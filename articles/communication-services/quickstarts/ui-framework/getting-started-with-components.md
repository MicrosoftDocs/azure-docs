---
title: Getting started with UI Framework Base Components
titleSuffix: An Azure Communication Services quickstart
description: In this quickstart, you'll learn how to get started with UI Framework Base Components
author: ddematheu2
ms.author: dademath
ms.date: 11/16/2020
ms.topic: quickstart
ms.service: azure-communication-services

---

# Quickstart: Getting started with UI Framework Components

[!INCLUDE [Private Preview Notice](../../includes/private-preview-include.md)]

Get started with Azure Communication Services by using the UI Framework to quickly integrate communication experiences into your applications. In this quickstart, you'll learn how integrate UI Framework Components into your application to build communication experiences. Components come in two flavors: Base and Composite. 
- **Base components** represent discrete communication capabilities; they are basic building blocks that can be used to build complex communication experiences. 
- **Composite components** are turn-key experiences for common communication scenarios that have been built using **base components** as building blocks and packaged to be easily integrated into applications.

## Prerequisites

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).
- [Node.js](https://nodejs.org/) Active LTS and Maintenance LTS versions (Node 12 Recommended).
- An active Communication Services resource. [Create a Communication Services resource](../../create-communication-resource.md).
- A User Access Token to instantiate the call client. Learn how to [create and manage user access tokens](../../access-tokens.md).

## Setting up

Open your terminal or command window create a new directory for your app, and navigate to it.

```console

mkdir ui-framework-quickstart && cd ui-framework-quickstart

```

UI Framework requires a React environment to be setup. Next we will do that. If you already have a React App, you can skip this section.

### Set Up React App

We will use the create-react-app template for this quickstart. For more information see: [Getting Started with React](https://reactjs.org/docs/create-a-new-react-app.html)

```console

npx create-react-app my-app

cd my-app

```

At the end of this process you should have a full application inside of the folder `my-app`. For this quickstart, we will be modifying files inside of the `src` folder.

### Install the package

Use the `npm install` command to install the Azure Communication Services Calling client library for JavaScript.

```console

npm install @azure/acs-ui-sdk --save 

//Private Preview install tarball

npm install --save ./{path for tarball}

```

The `--save` option lists the library as a dependency in your **package.json** file.

### Run Create React App

Lets test the Create React App installation by running:

```console

yarn start 

or

npm start

```

## Object model

The following classes and interfaces handle some of the major features of the Azure Communication Services UI SDK client library:

| Name                                  | Description                                                  |
| ------------------------------------- | ------------------------------------------------------------ |
| Provider| Fluent UI provider that allows developers to modify underlying Fluent UI components|
| CallingProvider| Calling Provider to insatiate a call. Required to instantiate additional components|
| ChatProvider | Chat Provider to insatiate a chat thread. Required to instantiate additional components|
| ParticipantGallery | Base component that shows call participants and their remote video streams |
| CallControls | Base component to control call including mute, video, share screen |
| ChatThread | Base component that renders a chat thread with typing indicators, read receipts, etc. |
| ChatInput | Base component that allows user to input messages that will be sent to the joined thread|

## Initialize Calling and Chat Providers using Azure Communication Services credentials

Using the required user access token and user id, developers can initialize the UI Framework calling and chat provides. The UI Framework uses the given token and user id to then initialize and provide identity to the components used. 

Before initializing lets first import the UI Framework package.

```javascript

import {CallingProvider, ChatProvider} from "@azure/communication-ui"

```

To initialize the `CallingProvider` and `ChatProvider` do the following:

```javascript

<Provider theme={/*Insert Fluent Theme*/}>
    <CallingProvider
    displayName={/*Insert Display Name to be used for the user*/}
    groupId={/*Insert GUID for group call to be joined*/}
    userId={/*Insert the Azure Communication Services user id */}
    token={/*Insert the Azure Communication Services access token*/}
    refreshTokenCallback={/*Insert refresh token call back function*/}
  >
  // Add Calling Components Here
  </CallingProvider>
</Provider>

<Provider theme={/*Insert Fluent Theme*/}>
    <ChatProvider
    token={/*Insert the Azure Communication Services access token*/}
    userId={/*Insert the Azure Communication Services user id*/}
    displayName={/*Insert Display Name to be used for the user*/}
    threadId={/*Insert id for group chat thread to be joined*/}
    environmentUrl={/*Insert the enviornment URL for the Azure Resource used*/}
    refreshTokenCallback={/*Insert refresh token call back function*/}
  >
  //  Add Chat Components Here
  </ChatProvider>
</Provider>

```

Once initialized, this provider allows developers to build their own layout using UI Framework Components as well as any additional layout logic. The provider takes care of initializing all the underlying logic and properly connecting the different components together.

## Add UI Framework Components to your application

User Base Components for calling and chat to build your own communication experiences. See examples below:

```javascript

<Provider theme={/*Insert Fluent Theme*/}>
    <CallingProvider>
        <ParticipantGallery />
        <CallControls />
    </CallingProvider>
</Provider>

<Provider theme={/*Insert Fluent Theme*/}>
    <ChatProvider >
        <ChatThread />
        <ChatInput />
    </ChatProvider>
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
