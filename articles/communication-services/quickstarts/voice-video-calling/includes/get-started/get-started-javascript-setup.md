---
author: probableprime
ms.service: azure-communication-services
ms.topic: include
ms.date: 06/21/2023
ms.author: rifox
---

## Setting up

### Create a new Node.js application

Open your terminal or command window create a new directory for your app, and navigate to it.

```console
mkdir calling-quickstart
cd calling-quickstart
```

Run `npm init -y` to create a **package.json** file with default settings.

```console
npm init -y
```

### Install the package

Use the `npm install` command to install the Azure Communication Services Calling SDK for JavaScript.

```console
npm install @azure/communication-common --save
npm install @azure/communication-calling --save
```

The `--save` option lists the library as a dependency in your **package.json** file.

### Set up the app framework

This quickstart uses parcel to bundle the application assets. Run the following command to install it and list it as a development dependency in your **package.json**:

```console
npm install parcel --save-dev
```

Create an **index.html** file in the root directory of your project. We'll use this file to configure a basic layout that will allow the user to place a call.