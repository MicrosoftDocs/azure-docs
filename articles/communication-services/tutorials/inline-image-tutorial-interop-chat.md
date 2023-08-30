---
title: Enable file sharing using UI Library and Azure Blob Storage in an Azure communication Chat
titleSuffix: An Azure Communication Services tutorial
description: Learn how to use Azure Communication Services with the UI Library to enable file sharing through chat leveraging Azure Blob Storage.
author: anjulgarg
manager: alkwa
services: azure-communication-services

author: jpeng-ms
ms.author: jopeng
ms.date: 08/03/2023
ms.topic: tutorial
ms.service: azure-communication-services
ms.subservice: chat
---

# Enable inline image using UI Library in Teams Interoperability Chat

[!INCLUDE [Public Preview Notice](../includes/public-preview-include.md)]

In a Teams Interopability Chat ("Interop Chat"), we can enable communication users to receive inline images sent by Teams users. Please note, letting communication users to send inline images to Teams users are currently not supported. To learn more about what current is supported by the UI library, please refer to [this document](../concepts/ui-library/includes/web-ui-use-cases.md) for more information.

>[!IMPORTANT]
>
>*Certain GIF images might not be supported by the UI library at this time. The user might receive a static image instead, and this is a known issue.
>
>In addition, the Web UI library doesn't support Clips (short videos) sent by the Teams users at this time.**
>
>Moreover, inline images are images that are copied and pasted in to the send box of Teams client. If the Teams user drop-and-drop an image to the send box, it woud become an image attachment, which is supported by the file sharing feature in Interop chat. Please refer to the turtorial on [adding file sharing with UI Library in Teams Interoperability Chat](./file-sharing-tutorial-interop-chat.md).


## Download code

Access the code for this tutorial on [GitHub TBA](https://github.com/Azure-Samples/communication-services-javascript-quickstarts/tree/main/XXXXXXXXTBA).

## Prerequisites

- An Azure account with an active subscription. For details, see [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).
- [Visual Studio Code](https://code.visualstudio.com/) on one of the [supported platforms](https://code.visualstudio.com/docs/supporting/requirements#_platforms).
- [Node.js](https://nodejs.org/), Active LTS and Maintenance LTS versions (10.14.1 recommended). Use the `node --version` command to check your version.
- An active Communication Services resource and connection string. [Create a Communication Services resource](../quickstarts/create-communication-resource.md).
- Using the UI library version [1.7.0-beta.1](https://www.npmjs.com/package/@azure/communication-react/v/1.7.0-beta.1) or the latest.
- Have a Teams meeting created and the meeting link ready.

## Background

First of all, we need to understand that Teams Interop Chat is part of a Teams meeting. When the Teams user creates an online meeting, a chat thread would be created and associated with the meeting. To enable the Communication Service user joining the chat and starting to send/receive messages, they need to be admitted by a meeting participant first (a Teams user) first. Otherwise, they won't have access to the chat.
Once the Communication Service User is admitted, they would be able to start any chat related operations. 
In this tutoria, we will be checking out how inline image works in Interop chat.

# Overview

As mentioned above, since we need to join a Teams meeting first, we need to leverage the ChatWithChat Composite from the UI library. Let's create it like the following:

```js
import { TeamsMeetingLinkLocator } from '@azure/communication-calling';
import { AzureCommunicationTokenCredential, CommunicationUserIdentifier } from '@azure/communication-common';
import {
  CallAndChatLocator,
  CallWithChatComposite,
  useAzureCommunicationCallWithChatAdapter,
  CallWithChatCompositeOptions
} from '@azure/communication-react';
import { Theme, PartialTheme, Spinner } from '@fluentui/react';
import React, { useMemo } from 'react';

export type CallWithChatExampleProps = {
  // Props needed for the construction of the CallWithChatAdapter
  userId: CommunicationUserIdentifier;
  token: string;
  displayName: string;
  endpointUrl: string;
  /**
   * For CallWithChat you need to provide either a teams meeting locator or a CallAndChat locator
   * for the composite
   *
   * CallAndChatLocator: This locator is comprised of a groupId call locator and a chat thread
   * threadId for the session. See documentation on the {@link CallAndChatLocator} to see types of calls supported.
   * {callLocator: ..., threadId: ...}
   *
   * TeamsMeetingLinkLocator: this is a special locator comprised of a Teams meeting link
   * {meetingLink: ...}
   */
  locator: TeamsMeetingLinkLocator | CallAndChatLocator;

  // Props to customize the CallWithChatComposite experience
  fluentTheme?: PartialTheme | Theme;
  compositeOptions?: CallWithChatCompositeOptions;
  callInvitationURL?: string;
  formFactor?: 'desktop' | 'mobile';
};

export const CallWithChatExperience = (props: CallWithChatExampleProps): JSX.Element => {
  // Construct a credential for the user with the token retrieved from your server. This credential
  // must be memoized to ensure useAzureCommunicationCallWithChatAdapter is not retriggered on every render pass.
  const credential = useMemo(() => new AzureCommunicationTokenCredential(props.token), [props.token]);

  // Create the adapter using a custom react hook provided in the @azure/communication-react package.
  // See https://aka.ms/acsstorybook?path=/docs/composite-adapters--page for more information on adapter construction and alternative constructors.
  const adapter = useAzureCommunicationCallWithChatAdapter({
    userId: props.userId,
    displayName: props.displayName,
    credential,
    locator: props.locator,
    endpoint: props.endpointUrl
  });

  // The adapter is created asynchronously by the useAzureCommunicationCallWithChatAdapter hook.
  // Here we show a spinner until the adapter has finished constructing.
  if (!adapter) {
    return <Spinner label="Initializing..." />;
  }

  return (
    <CallWithChatComposite
      adapter={adapter}
      fluentTheme={props.fluentTheme}
      formFactor={props.formFactor}
      joinInvitationURL={props.callInvitationURL}
      options={props.compositeOptions}
    />
  );
};

```

The sample code above is from [ChatWithChat Composite Storybook](https://azure.github.io/communication-ui-library/?path=/docs/composites-call-with-chat-basicexample--basic-example)

And that's all we need to do.


TBA

## Next steps

> [!div class="nextstepaction"]
> [Check the rest of the UI Library](https://azure.github.io/communication-ui-library/)

You may also want to:

- [Add chat to your app](../quickstarts/chat/get-started.md)
- [Creating user access tokens](../quickstarts/identity/access-tokens.md)
- [Learn about client and server architecture](../concepts/client-and-server-architecture.md)
- [Learn about authentication](../concepts/authentication.md)
- [Add file sharing with UI Library in Azure Communication Service Chat](./file-sharing-tutorial-acs-chat.md)
- [Add file sharing with UI Library in Teams Interoperability Chat](./file-sharing-tutorial-interop-chat.md)
