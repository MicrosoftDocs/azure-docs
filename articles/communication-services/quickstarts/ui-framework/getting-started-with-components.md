---
title: Getting started with Azure Communication Services UI Framework base components
titleSuffix: An Azure Communication Services quickstart
description: In this quickstart, you'll learn how to get started with UI Framework base components
author: ddematheu2
ms.author: dademath
ms.date: 11/16/2020
ms.topic: quickstart
ms.service: azure-communication-services

---

# Quickstart: Getting started with UI Framework base components

[!INCLUDE [Private Preview Notice](../../includes/private-preview-include.md)]

Get started with Azure Communication Services by using the UI Framework to quickly integrate communication experiences into your applications. In this quickstart, you'll learn how integrate UI Framework base components into your application to build communication experiences. 

UI Framework components come in two flavors: Base and Composite.

- **Base components** represent discrete communication capabilities; they're the basic building blocks that can be used to build complex communication experiences. 
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

We'll use the create-react-app template for this quickstart. For more information see: [Getting Started with React](https://reactjs.org/docs/create-a-new-react-app.html)

```console

npx create-react-app my-app

cd my-app

```

At the end of this process you should have a full application inside of the folder `my-app`. For this quickstart, we'll be modifying files inside of the `src` folder.

### Install the package

Use the `npm install` command to install the Azure Communication Services Calling client library for JavaScript.

```console

npm install @azure/acs-ui-sdk --save 

//Private Preview install tarball

npm install --save ./{path for tarball}

```

The `--save` option lists the library as a dependency in your **package.json** file.

### Run Create React App

Let's test the Create React App installation by running:

```console

yarn start 

or

npm start

```

## Object model

The following classes and interfaces handle some of the major features of the Azure Communication Services UI client library:

| Name                                  | Description                                                  |
| ------------------------------------- | ------------------------------------------------------------ |
| Provider| Fluent UI provider that lets you modify underlying Fluent UI components|
| CallingProvider| Calling Provider to insatiate a call. Required to instantiate additional components|
| ChatProvider | Chat Provider to insatiate a chat thread. Required to instantiate additional components|
| MediaGallery | Base component that shows call participants and their remote video streams |
| MediaControls | Base component to control call including mute, video, share screen |
| ChatThread | Base component that renders a chat thread with typing indicators, read receipts, etc. |
| SendBox | Base component that allows user to input messages that will be sent to the joined thread|

## Initialize Calling and Chat Providers using Azure Communication Services credentials

Go to the `src` folder inside of `my-app` and look for the file `app.js`. Here we'll drop the following code to initialize our Calling and Chat Providers. These providers are incharge of maintaining the context of the call and chat experiences. You can choose which one to use depending on the type of communication experience you're building. If needed, you can use both at the same time. To initialize the components, you'll need an access token retrieved from Azure Communication Services. For details on how to do this, see: [create and manage user access tokens](../../access-tokens.md).

UI Framework Components follow the same general architecture for the rest of the service. The components don't generate access tokens, group IDs or thread IDs. These elements come from services that go through the proper steps to generate these IDs and pass them to the client application. See [Client Server Architecture](./../../concepts/client-and-server-architecture.md) for more information.

We'll use a Fluent UI theme to enhance the look and feel of the application:

`App.js`
```javascript

import {CallingProvider, ChatProvider} from "@azure/communication-ui"
import { Provider } from '@fluentui/react-northstar';
import { svgIconStyles } from '@fluentui/react-northstar/dist/es/themes/teams/components/SvgIcon/svgIconStyles';
import { svgIconVariables } from '@fluentui/react-northstar/dist/es/themes/teams/components/SvgIcon/svgIconVariables';
import * as siteVariables from '@fluentui/react-northstar/dist/es/themes/teams/siteVariables';

const iconTheme = {
  componentStyles: {
    SvgIcon: svgIconStyles
  },
  componentVariables: {
    SvgIcon: svgIconVariables
  },
  siteVariables
};

<Provider theme={mergeThemes(iconTheme, teamsTheme)}>
    <CallingProvider
    displayName={/*Insert Display Name to be used for the user*/}
    groupId={/*Insert GUID for group call to be joined*/}
    userId={/*Insert the Azure Communication Services user id */}
    token={/*Insert the Azure Communication Services access token*/}
    refreshTokenCallback={/*Insert refresh token call back function*/}
    >
        // Add Calling Components Here
    </CallingProvider>

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

Once initialized, this provider lets you build your own layout using UI Framework Components as well as any additional layout logic. The provider takes care of initializing all the underlying logic and properly connecting the different components together. Next we'll use a variety of base components provided by UI Framework to build communication experiences. You can customize the layout of these components and add any additional custom components that you want to render with them. 

## Build UI Framework Calling Component Experiences

For Calling, we'll use the `MediaGallery` and `MediaControls` Components. For more information about them, see [UI Framework Capabilities](./../../concepts/ui-framework/ui-sdk-features.md). To start, in the `src` folder, create a new file called `callingComponents.js`. Here we'll initialize a function component that will hold our base components to then import in `app.js`.

`callingComponents.js`
```javascript

import {MediaGallery, MediaControls, useGroupCall, MapToCallingSetupProps, connectFuncsToContext} from "@azure/acs-ui-sdk"

function CallingComponents() {

  return (
    <div >
        <MediaGallery/>
        <MediaControls/>
    </div>
  );
}

```

You can add additional layout and styling around the components. 

At the bottom of this file, we'll export the calling components to be initiated inside `app.js`. To export them we'll use the `connectFuncsToContext` method part of the UI Framework. This method connects the calling UI components to the underlying state using the mapping function `MapToCallingSetupProps`. UI Framework supports custom mapping functions to be used for scenarios where you want to control how data is pushed to the components.

`callingComponents.js`
```javascript

export default connectFuncsToContext(CallingComponents, MapToCallingSetupProps);

```

## Build UI Framework Chat Component Experiences

For Chat, we will use the `ChatThread` and `SendBox` components. For more information about these components, see [UI Framework Capabilities](./../../concepts/ui-framework/ui-sdk-features.md). To start, in the `src` folder, create a new file called `chatComponents.js`. Here we'll initialize a function component that will hold our base components to then import in `app.js`.

`chatComponents.js`
```javascript

import {ChatThread, SendBox} from "@azure/acs-ui-sdk/dist/connected-components"

function ChatComponents() {

  return (
    <div >
        <ChatThread />
        <SendBox />
    </div >
  );
}

export default ChatComponents;

```

## Add Calling and Chat Components to the main application

Back in the `app.js` file, we will now add the components to the `CallingProvider` and `ChatProvider`:

`App.js`
```javascript

import ChatComponents from './chatComponents';
import CallingComponents from './callingComponents';

    <CallingProvider .... >
        <CallingComponents/>
    </CallingProvider>

    <ChatProvider .... >
        <ChatComponents />
    </ChatProvider>
</Provider>

```

## Run quickstart

To run the code above use the command:

```console

yarn start

or 

npm start

```

## Clean up resources

If you want to clean up and remove a Communication Services subscription, you can delete the resource or resource group. Deleting the resource group also deletes any other resources associated with it. Learn more about [cleaning up resources](../create-communication-resource.md#clean-up-resources).

## Next steps

> [!div class="nextstepaction"]
> [Try UI Framework Composite Components](./getting-started-with-composites.md)

For more information, see the following:
- [UI Framework Overview](../../concepts/ui-framework/ui-sdk-overview.md)
- [UI Framework Capabilities](./../../concepts/ui-framework/ui-sdk-features.md)

