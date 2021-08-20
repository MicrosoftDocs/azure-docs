---
author: mikben
ms.service: azure-communication-services
ms.topic: include
ms.date: 03/10/2021
ms.author: mikben
---

## Setting up

### Create a new Node.js application

Open your terminal or command window create a new directory for your app, and navigate to it.

```console
mkdir calling-quickstart && cd calling-quickstart
```

Run `npm init -y` to create a **package.json** file with default settings.

```console
npm init -y
```

### Install the package

Use the `npm install` command to install the Azure Communication Services Calling SDK for JavaScript.

```console
npm install @azure/communication-common --save
npm install @azure/communication-calling@1.1.0 --save
```

The following versions of webpack are recommended for this quickstart:

```console
"webpack": "^4.42.0",
"webpack-cli": "^3.3.11",
"webpack-dev-server": "^3.10.3"
```

The `--save` option lists the library as a dependency in your **package.json** file.

### Set up the app framework

This quickstart uses webpack to bundle the application assets. Run the following command to install the webpack, webpack-cli and webpack-dev-server npm packages and list them as development dependencies in your **package.json**:

```console
npm install webpack@4.42.0 webpack-cli@3.3.11 webpack-dev-server@3.10.3 --save-dev
```

Create an **index.html** file in the root directory of your project. We'll use this file to configure a basic layout that will allow the user to place a call.
