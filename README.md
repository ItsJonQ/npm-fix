# 📦 NPM Fix

> A quick way to reset npm dependencies in your project

- Removes `package-lock.json`
- Removes `node_modules`
- Downloads dependencies again

```
📦  NPM Fix

🔍  Analyzing...

Project details
--------------------------------------------
npm    version   5.8.0
npm    user      itsjonq
--------------------------------------------

💪  Fixing...

  ✔ [1/4] 🔌  Checking connection...
  ✔ [2/4] 🔓  Removing package-lock.json...
  ✔ [3/4] 📦  Removing node_modules...
  ✔ [4/4] 🚚  Fetching packages...

Success!

✨  Have fun developing!
```

## Installation

```
npm install -g npm-fix-cli
```

## Usage

To use `npm-fix`, run the command after installing it on your computer:

```
npm-fix
```

### Note

Only use this if `npm` is giving you issues. Otherwise, opt for:

```
npm install
```

Or:

```
npm ci
```
