---
title: Include file
description: Include file
services: azure-communication-services
author: arifibrahim4
ms.service: azure-communication-services
ms.subservice: advanced-messaging
ms.date: 12/29/2024
ms.topic: include
ms.custom: include file
ms.author: armohamed
---

### Create a new Node.js application

1. Create a new directory for your app and open it in a terminal or command window.

1. Run the following command.

   ```console
   mkdir advance-messages-quickstart && cd advance-messages-quickstart
   ```

1. Run the following command to create a `package.json` file with default settings.

   ```console
   npm init -y
   ```

1. Use a text editor to create a file called `send-messages.js` in the project root directory.

1. Add the following code snippet to the file `send-messages.js`.

   ```javascript
   async function main() {
       // Quickstart code goes here.
   }

   main().catch((error) => {
       console.error("Encountered an error while sending message: ", error);
       process.exit(1);
   });
   ```

Complete the following section to add your source code for this example to the `send-messages.js` file that you created.

### Install the package

Use the `npm install` command to install the Azure Communication Services Advance Messaging SDK for JavaScript.

```console
npm install @azure-rest/communication-messages --save
```

The `--save` option lists the library as a dependency in your **package.json** file.
