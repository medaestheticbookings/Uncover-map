# Uncover — turning sign-in on

Sign-in already works. Without a Firebase project the app keeps accounts on
the phone itself: each person signs up with an invite code, gets their own
map, and nothing leaves the device. That is enough to hand the app to people
today.

What a Firebase project adds is one thing: the map follows the account from
phone to phone. Until then a new phone starts under fog.

Everything below is done once, in a browser, by whoever owns the Google
account. Nothing in the app changes afterwards — fill in
`firebase-config.js`, deploy it, and the same door starts syncing.

## 0. The invite codes

Five work out of the box:

    EVZO-WALK   EVZO-START   EVZO-FRIEND   EVZO-TEAM   EVZO-GIFT

Only their hashes are in `index.html`, so reading the page gives nobody a
code. To add one:

    node -e "console.log(require('crypto').createHash('sha256').update('YOUR-CODE').digest('hex'))"

and paste the result into the `INVITES` list.

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
