'use server';

import { hashUserPassword } from '@/lib/hash';
import createUser from '@/lib/user';

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

  createUser(email, hashedPassword);
}
