---
title: Getting started with Azure Communication Services UI Framework SDK composite components
titleSuffix: An Azure Communication Services quickstart
description: In this quickstart, you'll learn how to get started with UI Framework Composite Components
author: ddematheu2
ms.author: dademath
ms.date: 11/16/2020
ms.topic: quickstart
ms.service: azure-communication-services

---

# Quickstart: Getting started with UI Framework Composite Components

[!INCLUDE [Private Preview Notice](../../includes/private-preview-include.md)]

Get started with Azure Communication Services by using the UI Framework to quickly integrate communication experiences into your applications. In this quickstart, you'll learn how integrate UI Framework Composite Components into your application to build communication experiences.

## Prerequisites

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).
- [Node.js](https://nodejs.org/) Active LTS and Maintenance LTS versions (Node 12 Recommended).
- An active Communication Services resource. [Create a Communication Services resource](../../create-communication-resource.md).
- A User Access Token to instantiate the call composite. Learn how to [create and manage user access tokens](../../access-tokens.md).

## Setting up

UI Framework requires a React environment to be setup. Next we will do that. If you already have a React App, you can skip this section.

### Set Up React App

We will use the create-react-app template for this quickstart. For more information see: [Getting Started with React](https://reactjs.org/docs/create-a-new-react-app.html)

```console

npx create-react-app my-app

cd my-app

```

At the end of this process you should have a full application inside of the folder `my-app`. For this quickstart, we'll be modifying files inside of the `src` folder.

### Install the package

Use the `npm install` command to install the Azure Communication Services Calling client library for JavaScript. Move the provided tarball (Private Preview) over to the my-app directory.

```console

//Private Preview install tarball

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
| Provider| Fluent UI provider that lets you modify underlying Fluent UI components|
| GroupCall | Composite component that renders a group calling experience with participant gallery and controls. |
| GroupChat | Composite component that renders a group chat experience with chat thread and input |


## Initialize Group Call and Group Chat Composite Components

Go to the `src` folder inside of `my-app` and look for the file `app.js`. Here we'll drop the following code to initialize our Composite Components for Group Chat and Calling. You can choose which one to use depending on the type of communication experience you're building. If needed, you can use both at the same time. To initialize the components, you'll need an access token retrieved from Azure Communication Services. For details on how to do this, see: [create and manage user access tokens](../../access-tokens.md).

UI Framework Components follow the same general architecture for the rest of the service. The components don't generate access tokens, group IDs or thread IDs. These elements come from services that go through the proper steps to generate these IDs and pass them to the client application. See [Client Server Architecture](./../../concepts/client-and-server-architecture.md) for more information.

`App.js`
```javascript

import {GroupCall, GroupChat} from "@azure/acs-ui-sdk"
import { Provider, mergeThemes, teamsTheme, } from '@fluentui/react-northstar';
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

function App(){

    <Provider theme={mergeThemes(iconTheme, teamsTheme)}>
        <GroupCall
            displayName={DISPLAY_NAME}, //Required, Display name for the user entering the call
            userId={USERID}, //Required, Azure Communication Services user id retrieved from authentication service
            token={TOKEN}, // Required, Azure Communication Services access token retrieved from authentication service
            refreshTokenCallback={CALLBACK}, //Optional, Callback to refresh the token in case it expires
            groupId={GROUPID}, //Required, Id for group call that will be joined. (GUID)
            onEndCall = { () => {
                //Optional, Action to be performed when the call ends
            }}
        />

        <GroupChat 
            displayName={DISPLAY_NAME}, //Required, Display name for the user entering the call
            userId={USERID}, //Required, Azure Communication Services user id retrieved from authentication service
            token={TOKEN}, // Required, Azure Communication Services access token retrieved from authentication service
            threadId={THREADID}, //Required, Id for group chat thread that will be joined.
            endpointURL={ENDPOINT_URL}, //Required, URL for Azure endpoint being used for Azure Communication Services
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
}

export default App;

```

## Run quickstart

To run the code above use the command:

```console

npm run start 

```

## Clean up resources

If you want to clean up and remove a Communication Services subscription, you can delete the resource or resource group. Deleting the resource group also deletes any other resources associated with it. Learn more about [cleaning up resources](../create-communication-resource.md#clean-up-resources).

## Next steps

> [!div class="nextstepaction"]
> [Try UI Framework Base Components](./getting-started-with-components.md)

For more information, see the following:
- [UI Framework Overview](../../concepts/ui-framework/ui-sdk-overview.md)
- [UI Framework Capabilities](./../../concepts/ui-framework/ui-sdk-features.md)
