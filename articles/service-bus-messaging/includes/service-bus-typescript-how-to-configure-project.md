---
title: Include file
description: Include file
services: service-bus-messaging
author: spelluru
ms.service: service-bus-messaging
ms.topic: include
ms.date: 07/17/2024
ms.author: spelluru
ms.custom: "include file"

---

## Configure project 

1. Create a project folder to contain the quickstart files. 

1. In a terminal in the project folder, initialize the Node.js project.

    ```bash
    npm init -y
    ```
1. Open the `package.json` file in the project folder and add the property to configure ESM. Add this property after the `version` property:

    ```json
    "type":"module",
    ```
1. In the `package.json` file, edit the `scripts` property to compile the TypeScript files. Add the `build` script.

    ```json
    "scripts": {
        "build": "tsc"
    }
    ```
    
1. Create a `tsconfig.json` in the project file to configure the TypeScript ESM build and copy the following into the file:

    :::code language="json" source="~/azure-typescript-e2e-apps/quickstarts/service-bus/ts/tsconfig.json":::

1. Create a `src` folder in the project. This is where you'll place the TypeScript files created in this quickstart.
