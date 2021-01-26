---
title: Getting started with UI Framework Composite Components
titleSuffix: An Azure Communication Services quickstart
description: In this quickstart, you'll learn how to get started with UI Framework Composite Components
author: ddematheu2
ms.author: dademath
ms.date: 11/16/2020
ms.topic: quickstart
ms.service: azure-communication-services

---

# Quickstart: Getting started with UI Framework Composites

[!INCLUDE [Private Preview Notice](../../includes/private-preview-include.md)]

Get started with Azure Communication Services by using the UI Framework to quickly integrate communication experiences into your applications. In this quickstart, you'll learn how integrate UI Framework Components into your application to build communication experiences. Components come in two flavors: Base and Composite. 
- **Base components** represent discrete communication capabilities; they are basic building blocks that can be used to build complex communication experiences. 
- **Composite components** are turn-key experiences for common communication scenarios that have been built using **base components** as building blocks and packaged to be easily integrated into applications.

## Prerequisites

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).
- [Node.js](https://nodejs.org/) Active LTS and Maintenance LTS versions (Node 12 Recommended).
- An active Communication Services resource. [Create a Communication Services resource](../../create-communication-resource.md).
- A User Access Token to instantiate the call composite. Learn how to [create and manage user access tokens](../../access-tokens.md).

## Setting up

Open your terminal or command window create a new directory for your app, and navigate to it.

```console

mkdir ui-framework-quickstart && cd ui-framework-quickstart

```

### Set Up Fluent UI

Install Fluent UI package and initialize


```console

npm i @fluentui/react

```

```javascript
import {Provider} from '@fluentui/react';
```

### Set Up React

Install the React package and initialize 

```console

npm i react

```

```javascript
import React from 'react';
```

### Install the package

Use the `npm install` command to install the Azure Communication Services Calling client library for JavaScript.

```console

npm install @azure/communication-ui --save

```

The `--save` option lists the library as a dependency in your **package.json** file.


## Object model

The following classes and interfaces handle some of the major features of the Azure Communication Services UI SDK client library:

| Name                                  | Description                                                  |
| ------------------------------------- | ------------------------------------------------------------ |
| Provider| Fluent UI provider that allows developers to modify underlying Fluent UI components|
| CallingProvider| Calling Provider to insatiate a call. Required to instantiate additional components|
| ChatProvider | Chat Provider to insatiate a chat thread. Required to instantiate additional components|
| GroupCall | Composite component that renders a group calling experience with participant gallery and controls. |
| GroupChat | Composite component that renders a group chat experience with chat thread and input |

## Initialize Group Call and Group Chat Composite Components

In the snippet below we initialize both the `GroupCall` and the `GroupChat` composite components. Developers can choose which one to use depending on the type of communication experience they look to build or use both when both modalities are required. To initialize the components you will require an access token retrieved from Azure Communication Services. For details on how to do this see: [create and manage user access tokens](../../access-tokens.md).

```javascript

import {CallingProvider, ChatProvider} from "@azure/communication-ui"

<Provider>
    <GroupCall
    config={{
        displayName, //Required, Display name for the user entering the call
        userId, //Required, Azure Communication Services user id retrieved from authentication service
        token, // Required, Azure Communication Services access token retrieved from authentication service
        refreshTokenCallback, //Optional, Callback to refresh the token in case it expires
        groupId, //Required, Id for group call that will be joined. (GUID)
    }}
    onEndCall = { () => {
        //Required, Action to be performed when the call ends
    }}/>

    <GroupChat config={{
        displayName, //Required, Display name for the user entering the call
        userId, //Required, Azure Communication Services user id retrieved from authentication service
        token, // Required, Azure Communication Services access token retrieved from authentication service
        threadId, //Required, Id for group chat thread that will be joined.
        environmentURL, //Required, URL for Azure endpoint being used for Azure Communication Services
    }}
    onRenderAvatar = { () => {
        //Optional, ???
    }}
    refreshToken = { () => {
        //Optional, function to refresh the access token in case it expires
    }}
    options = {
        //Optional, options to define chat behavior
        sendBoxMaxLength: number | undefined //Optional, Limit the max send box length based on viewport size change.
    }
    />

</Provider>

```

## Run quickstart

TBD

TBD Screenshot 

## Clean up resources

If you want to clean up and remove a Communication Services subscription, you can delete the resource or resource group. Deleting the resource group also deletes any other resources associated with it. Learn more about [cleaning up resources](../create-communication-resource.md#clean-up-resources).

## Next steps

For more information, see the following articles:
- TODO
