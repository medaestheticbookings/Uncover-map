# Uncover — turning sign-in on

The app is finished and waiting for a Firebase project. Everything below is
done once, in a browser, by whoever owns the Google account.

## 1. Create the project

console.firebase.google.com → **Add project** → call it `uncover`.
Google Analytics is not needed. The free Spark plan covers Auth and Firestore
at this scale.

## 2. Turn on email sign-in, with no self-signup

**Build → Authentication → Get started → Email/Password → Enable.**
Leave *Email link (passwordless sign-in)* off.

Then **Settings → User actions** and untick **Enable create (sign-up)**. This
is the invitation-only part: without it, anyone who finds the page can make
themselves an account.

## 3. Create the database and lock it down

**Build → Firestore Database → Create database → Production mode.**

Then **Rules**, and paste the contents of `firestore.rules` from this repo.
Those rules let an account read and write one document — its own — and refuse
everything else.

## 4. Copy the project's settings into the site

**Project settings → Your apps → Web app (`</>`) → register**, then copy the
`firebaseConfig` object it shows into `firebase-config.js`, replacing every
`REPLACE_ME`. These values are not secrets; the rules above are what protects
the data.

## 5. Allow the domain

**Authentication → Settings → Authorised domains → Add domain** →
`evzomethod.com`. Sign-in is refused from anywhere not on that list.

## 6. Make an account for each walker

**Authentication → Users → Add user**: email and a first password. Send those
to the person; they can change it later through *Forgot your password?* on the
sign-in screen.

## 7. Publish

Copy `index.html` and `firebase-config.js` into the site repo under
`uncover/`, and push. The page is at `evzomethod.com/uncover`.

## What syncs

Each account's map is one document at `users/{uid}`: the revealed tiles,
distances, day log and badges, as the same JSON the app keeps on the phone.
Local storage stays the copy the app reads, so a walk with no signal still
works and goes up on the next save. If two devices disagree, the one that has
opened more ground wins.
