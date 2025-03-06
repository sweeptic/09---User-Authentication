'use server';

import { hashUserPassword } from '@/lib/hash';
import createUser from '@/lib/user';
import { redirect } from 'next/navigation';

export async function signup(prevState, formdata) {
  const email = formdata.get('email');
  const password = formdata.get('password');

  let errors = {};

  if (!email.includes('@')) {
    errors.email = 'Please enter a valid email address';
  }

  if (password.trim().length < 8) {
    errors.password = 'Password must be at least 8 characters long.';
  }

  // store it in the database ( create a new user)

  if (Object.keys(errors).length > 0) {
    return { errors };
  }

  const hashedPassword = hashUserPassword(password);
  //   console.log('password', password);
  //   console.log('hashedPassword', hashedPassword);

  try {
    createUser(email, hashedPassword);
  } catch (error) {
    if (error.code === 'SQLITE_CONSTRAINT_UNIQUE') {
      return {
        errors: {
          email: 'It seems like an account for the chosen email already exists.',
        },
      };
    }
    throw error;
  }

  redirect('/training');
}
