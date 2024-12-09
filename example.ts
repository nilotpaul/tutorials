import { MetaFunction } from '@remix-run/node';
import { isRouteErrorResponse } from '@remix-run/react';

type MetaWithoutNotFound = {
  title: string | { template?: string; name: string };
  description: string;
  image?: string;
  notFound?: boolean;
};

type MetaWithNotFound = {
  title?: string | { template?: string; name: string };
  description?: string;
  image?: string;
  notFound: true;
};

type Meta = MetaWithoutNotFound | MetaWithNotFound;

export const constructMeta = ({
  title,
  description,
  image = '/banner.png',
  notFound = false,
}: Meta): MetaFunction => {
  return ({ error }) => {
    if (isRouteErrorResponse(error)) {
      if (error.status === 404) {
        return [
          {
            title: 'Not Found',
          },
          {
            name: 'description',
            content: 'This page does not exist',
          },
        ];
      } else {
        return [
          {
            title: 'Some Error Happened',
          },
          {
            name: 'description',
            content: 'Some error happened while loading this page',
          },
        ];
      }
    }
    if (notFound || !title) {
      return [
        {
          title: 'Not Found',
        },
        {
          name: 'description',
          content: 'This page does not exist',
        },
      ];
    }

    return [
      {
        title:
          typeof title === 'string' ? title : `${title.name} | ${title?.template || 'EvolveAsDev'}`,
      },
      {
        name: 'description',
        content: description,
      },
      {
        property: 'og:title',
        content:
          typeof title === 'string' ? title : `${title.name} | ${title?.template || 'EvolveAsDev'}`,
      },
      {
        property: 'og:description',
        content: description,
      },
      {
        property: 'og:image',
        content: image,
      },
      {
        property: 'og:url',
        content: process.env.NODE_ENV === 'production' ? 'evolveasdev.com' : 'localhost:5174',
      },
      {
        name: 'twitter:card',
        content: 'summary_large_image',
      },
      {
        name: 'twitter:title',
        content:
          typeof title === 'string' ? title : `${title.name} | ${title?.template || 'EvolveAsDev'}`,
      },
      {
        name: 'twitter:description',
        content: description,
      },
      {
        name: 'twitter:image',
        content: image,
      },
      {
        name: 'twitter:site',
        content: '',
      },
    ];
  };
};
