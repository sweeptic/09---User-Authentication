'use server';

import { createAuthSession } from '@/lib/auth';
import { hashUserPassword, verifyPassword } from '@/lib/hash';
import { createUser, getUserByEmail } from '@/lib/user';

import { redirect } from 'next/navigation';

export async function signup(prevState, formData) {
  const email = formData.get('email');
  const password = formData.get('password');

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
    const id = createUser(email, hashedPassword);
    await createAuthSession(id);
    redirect('/training');
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
}

export default async function login(prevState, formData) {
  const email = formData.get('email');
  const password = formData.get('password');

  const existingUser = getUserByEmail(email);

  if (!existingUser) {
    return {
      errors: {
        email: 'Could not authenticate user, please check your credentials.',
      },
    };
  }

  const isValidPassword = verifyPassword(existingUser.password, password);

  if (!isValidPassword) {
    return {
      errors: {
        email: 'Could not authenticate user, please check your credentials.',
      },
    };
  }

  await createAuthSession(existingUser.id);
  redirect('/training');
}
