---
title: Get started with Azure Communication Services UI Framework base components
titleSuffix: An Azure Communication Services quickstart
description: In this quickstart, you'll learn how to get started with UI Framework base components
author: ddematheu2
ms.author: dademath
ms.date: 03/10/2021
ms.topic: quickstart
ms.service: azure-communication-services

---

# Quickstart: Get started with UI Framework Base Components

[!INCLUDE [Private Preview Notice](../../includes/private-preview-include.md)]

Get started with Azure Communication Services by using the UI Framework to quickly integrate communication experiences into your applications. In this quickstart, you'll learn how integrate UI Framework base components into your application to build communication experiences. 

UI Framework components come in two flavors: Base and Composite.

- **Base components** represent discrete communication capabilities; they're the basic building blocks that can be used to build complex communication experiences. 
- **Composite components** are turn-key experiences for common communication scenarios that have been built using **base components** as building blocks and packaged to be easily integrated into applications.

## Prerequisites

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).
- [Node.js](https://nodejs.org/) Active LTS and Maintenance LTS versions (Node 12 Recommended).
- An active Communication Services resource. [Create a Communication Services resource](./../create-communication-resource.md).
- A User Access Token to instantiate the call client. Learn how to [create and manage user access tokens](./../access-tokens.md).

## Setting up

UI Framework requires a React environment to be setup. Next we will do that. If you already have a React App, you can skip this section.

### Set Up React App

We'll use the create-react-app template for this quickstart. For more information, see: [Get Started with React](https://reactjs.org/docs/create-a-new-react-app.html)

```console

npx create-react-app my-app

cd my-app

```

At the end of this process, you should have a full application inside of the folder `my-app`. For this quickstart, we'll be modifying files inside of the `src` folder.

### Install the package

Use the `npm install` command to install the Azure Communication Services Calling client library for JavaScript. Move the provided tarball (Private Preview) over to the my-app directory.

```console

//For Private Preview install tarball

npm install --save ./{path for tarball}

```

The `--save` option lists the library as a dependency in your **package.json** file.

### Run Create React App

Let's test the Create React App installation by running:

```console

npm run start   

```

## Object model

The following classes and interfaces handle some of the major features of the Azure Communication Services UI client library:

| Name                                  | Description                                                  |
| ------------------------------------- | ------------------------------------------------------------ |
| Provider| Fluent UI provider that allows developers to modify underlying Fluent UI components|
| CallingProvider| Calling Provider to instantiate a call. Required to add extra components|
| ChatProvider | Chat Provider to instantiate a chat thread. Required to add extra components|
| MediaGallery | Base component that shows call participants and their remote video streams |
| MediaControls | Base component to control call including mute, video, share screen |
| ChatThread | Base component that renders a chat thread with typing indicators, read receipts, etc. |
| SendBox | Base component that allows user to input messages that will be sent to the joined thread|

## Initialize Calling and Chat Providers using Azure Communication Services credentials

Go to the `src` folder inside of `my-app` and look for the file `app.js`. Here we'll drop the following code to initialize our Calling and Chat providers. These providers are responsible for maintaining the context of the call and chat experiences. You can choose which one to use depending on the type of communication experience you're building. If needed, you can use both at the same time. To initialize the components, you'll need an access token retrieved from Azure Communication Services. For details on how to get access tokens, see: [create and manage access tokens](./../access-tokens.md).

> [!NOTE]
> The components don't generate access tokens, group IDs, or thread IDs. These elements come from services that go through the proper steps to generate these IDs and pass them to the client application. For more information, see: [Client Server Architecture](./../../concepts/client-and-server-architecture.md).
> 
> For Example: The Chat Provider expects that the `userId` associated to the `token` being used to initialize it has already been joined to the `threadId` being provided. If the token hasn't been joined to the thread ID, then the Chat Provider will fail. For more information on chat, see: [Getting Started with Chat](./../chat/get-started.md)

We'll use a Fluent UI theme to enhance the look and feel of the application:

`App.js`
```javascript

import {CallingProvider, ChatProvider} from "@azure/acs-ui-sdk"
import { mergeThemes, teamsTheme } from '@fluentui/react-northstar';
import { Provider } from '@fluentui/react-northstar/dist/commonjs/components/Provider/Provider';
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

function App(props) {

  return (
    <Provider theme={mergeThemes(iconTheme, teamsTheme)}>
        <CallingProvider
        displayName={/*Insert Display Name to be used for the user*/}
        groupId={/*Insert GUID for group call to be joined*/}
        token={/*Insert the Azure Communication Services access token*/}
        refreshTokenCallback={/*Optional, Insert refresh token call back function*/}
        >
            // Add Calling Components Here
        </CallingProvider>

        {/*Note: Make sure that the userId associated to the token has been added to the provided threadId*/}

        <ChatProvider
        token={/*Insert the Azure Communication Services access token*/}
        displayName={/*Insert Display Name to be used for the user*/}
        threadId={/*Insert id for group chat thread to be joined*/}
        endpointUrl={/*Insert the environment URL for the Azure Resource used*/}
        refreshTokenCallback={/*Optional, Insert refresh token call back function*/}
        >
            //  Add Chat Components Here
        </ChatProvider>
    </Provider>
  );
}

export default App;

```

Once initialized, this provider lets you build your own layout using UI Framework Base Components and any extra layout logic. The provider takes care of initializing all the underlying logic and properly connecting the different components together. Next we'll use various base components provided by UI Framework to build communication experiences. You can customize the layout of these components and add any other custom components that you want to render with them. 

## Build UI Framework Calling Component Experiences

For Calling, we'll use the `MediaGallery` and `MediaControls` Components. For more information about them, see [UI Framework Capabilities](./../../concepts/ui-framework/ui-sdk-features.md). To start, in the `src` folder, create a new file called `CallingComponents.js`. Here we'll initialize a function component that will hold our base components to then import in `app.js`. You can add extra layout and styling around the components. 

`CallingComponents.js`
```javascript

import {MediaGallery, MediaControls, MapToCallConfigurationProps, connectFuncsToContext} from "@azure/acs-ui-sdk"

function CallingComponents(props) {

  if (props.isCallInitialized) {props.joinCall()}

  return (
    <div style = {{height: '35rem', width: '30rem', float: 'left'}}>
        <MediaGallery/>
        <MediaControls/>
    </div>
  );
}

export default connectFuncsToContext(CallingComponents, MapToCallConfigurationProps);

```

At the bottom of this file, we exported the calling components using the  `connectFuncsToContext` method from the UI Framework to connect the calling UI components to the underlying state using the mapping function `MapToCallingSetupProps`. This method yields the component having its props populated, which we then use to check state and join the call. Using the `isCallInitialized` property to check whether the `CallAgent` is ready and then we use the `joinCall` method to join in. UI Framework supports custom mapping functions to be used for scenarios where developers want to control how data is pushed to the components.

## Build UI Framework Chat Component Experiences

For Chat, we will use the `ChatThread` and `SendBox` components. For more information about these components, see [UI Framework Capabilities](./../../concepts/ui-framework/ui-sdk-features.md). To start, in the `src` folder, create a new file called `ChatComponents.js`. Here we'll initialize a function component that will hold our base components to then import in `app.js`.

`ChatComponents.js`
```javascript

import {ChatThread, SendBox} from '@azure/acs-ui-sdk'

function ChatComponents() {

  return (
    <div style = {{height: '35rem', width: '30rem', float: 'left'}}>
        <ChatThread />
        <SendBox />
    </div >
  );
}

export default ChatComponents;

```

## Add Calling and Chat Components to the main application

Back in the `app.js` file, we will now add the components to the `CallingProvider` and `ChatProvider` like shown below.

`App.js`
```javascript

import ChatComponents from './ChatComponents';
import CallingComponents from './CallingComponents';

<Provider ... >
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

npm run start   

```

To fully test the capabilities, you will need a second client with calling and chat functionality to join the call and chat thread. See our [Calling Hero Sample](./../../samples/calling-hero-sample.md) and [Chat Hero Sample](./../../samples/chat-hero-sample.md) as potential options.

## Clean up resources

If you want to clean up and remove a Communication Services subscription, you can delete the resource or resource group. Deleting the resource group also deletes any other resources associated with it. Learn more about [cleaning up resources](../create-communication-resource.md#clean-up-resources).

## Next steps

> [!div class="nextstepaction"]
> [Try UI Framework Composite Components](./get-started-with-composites.md)

For more information, see the following resources:
- [UI Framework Overview](../../concepts/ui-framework/ui-sdk-overview.md)
- [UI Framework Capabilities](./../../concepts/ui-framework/ui-sdk-features.md)
