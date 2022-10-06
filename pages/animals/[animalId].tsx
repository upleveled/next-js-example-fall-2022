import { css } from '@emotion/react';
import { GetServerSidePropsContext, GetServerSidePropsResult } from 'next';
import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import { Animal, getAnimalById } from '../../database/animals';
import { parseIntFromContextQuery } from '../../utils/contextQuery';

const animalStyles = css`
  border-radius: 15px;
  border: 1px solid #ccc;
  padding: 20px;

  h2 {
    margin-top: 0;
  }

  & + & {
    margin-top: 25px;
  }
`;

type Props =
  | {
      animal: Animal;
    }
  | {
      error: string;
    };

export default function SingleAnimal(props: Props) {
  if ('error' in props) {
    return (
      <div>
        <Head>
          <title>Animal not found</title>
          <meta name="description" content="Animal not found" />
        </Head>
        <h1>{props.error}</h1>
        Sorry, try the <Link href="/animals">animals page</Link>
      </div>
    );
  }

  return (
    <div css={animalStyles}>
      <Head>
        <title>
          {props.animal.firstName}, the {props.animal.type}
        </title>
        <meta
          name="description"
          content={`${props.animal.firstName} is a ${props.animal.type} with a ${props.animal.accessory}`}
        />
      </Head>
      <h2>{props.animal.firstName}</h2>
      <Image
        src={`/${props.animal.id}-${props.animal.firstName.toLowerCase()}.jpeg`}
        alt=""
        width="400"
        height="400"
      />
      <div>Id: {props.animal.id}</div>
      <div>Type: {props.animal.type}</div>
      <div>Accessory: {props.animal.accessory}</div>
    </div>
  );
}

export async function getServerSideProps(
  context: GetServerSidePropsContext,
): Promise<GetServerSidePropsResult<Props>> {
  // Retrieve the animal ID from the URL
  const animalId = parseIntFromContextQuery(context.query.animalId);

  if (typeof animalId === 'undefined') {
    context.res.statusCode = 404;
    return {
      props: {
        error: 'Animal not found',
      },
    };
  }

  // Finding the animal
  //
  // Note: This is not the most efficient way
  // of finding the single animal, because it
  // will run every time. Using a database
  // like PostgreSQL will allow you to do this
  // in a nicer way.
  // const foundAnimal = animals.find((animal) => {
  //   return animal.id === animalId;
  // });
  const foundAnimal = await getAnimalById(animalId);

  if (typeof foundAnimal === 'undefined') {
    context.res.statusCode = 404;
    return {
      props: {
        error: 'Animal not found',
      },
    };
  }

  return {
    props: {
      animal: foundAnimal,
    },
  };
}
