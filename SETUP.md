# Uncover — turning sign-in on

The app is finished and waiting for a Firebase project. Everything below is
done once, in a browser, by whoever owns the Google account.

## 1. Create the project

console.firebase.google.com → **Add project** → call it `uncover`.
Google Analytics is not needed. The free Spark plan covers Auth and Firestore
at this scale.

## 2. Turn on email sign-in

**Build → Authentication → Get started → Email/Password → Enable.**
Leave *Email link (passwordless sign-in)* off.

Anyone can make their own account for now. When the monthly fee arrives, the
gate becomes the subscription rather than the sign-up: every account carries a
`plan` field, set to `free` on first sign-in, and the paywall reads that. To
close sign-ups instead, **Settings → User actions** → untick **Enable create
(sign-up)**, and make each account by hand under **Authentication → Users**.

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

## 6. Walkers make their own accounts

The sign-in screen has a **Create account** tab. Nothing to do here unless you
have closed sign-ups, in which case add each person under **Authentication →
Users → Add user** and send them the first password.

## 7. Publish

Copy `index.html` and `firebase-config.js` into the site repo under
`uncover/`, and push. The page is at `evzomethod.com/uncover`.

## What syncs

Each account's map is one document at `users/{uid}`: the revealed tiles,
distances, day log and badges, as the same JSON the app keeps on the phone.
Local storage stays the copy the app reads, so a walk with no signal still
works and goes up on the next save. If two devices disagree, the one that has
opened more ground wins.
