package main

import (
	"html/template"
	"log"
	"net/http"
	"strings"
)

type Renderer interface {
	Render(w http.ResponseWriter, status int, name string, data any, layouts ...string) error
}

type Template struct {
	templates *template.Template
}

func NewRenderer(pattern string) *Template {
	tmpl := template.New("")
	funcs := template.FuncMap{
		"embed": func(name string, data any) template.HTML {
			var out strings.Builder
			if err := tmpl.ExecuteTemplate(&out, name, data); err != nil {
				log.Println(err)
			}

			return template.HTML(out.String())
		},
	}

	tmpls := template.Must(tmpl.Funcs(funcs).ParseGlob(pattern))
	return &Template{templates: tmpls}
}

func (t *Template) Render(w http.ResponseWriter, status int, name string, data any, layouts ...string) error {
	w.WriteHeader(status)
	templateName := name

	if len(layouts) > 0 {
		templateName = layouts[0]
		data = map[string]any{"Page": name, "Ctx": data}
	}

	return t.templates.ExecuteTemplate(w, templateName, data)
}

func main() {
	tmpls := NewRenderer("templates/*.html")

	// Necessary Folder Structure
	// /templates
	// ├── index.html
	// ├── another.html

	http.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
		err := tmpls.Render(w, http.StatusOK, "another.html", nil, "index.html")
		if err != nil {
			log.Println(err)
		}
	})

	http.ListenAndServe(":3000", nil)
}
