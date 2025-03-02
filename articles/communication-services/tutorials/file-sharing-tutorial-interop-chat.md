---
title: Enable file sharing using UI Library in Teams Interoperability Chat
titleSuffix: An Azure Communication Services tutorial
description: Learn how to use the UI Library to enable file sharing in Teams Interoperability Chat
author: jpeng-ms
services: azure-communication-services
ms.author: jopeng
ms.date: 08/03/2023
ms.topic: tutorial
ms.service: azure-communication-services
ms.subservice: chat
---

# Enable file sharing using UI Library in Teams Interoperability Chat

In a Teams Interoperability Chat ("Interop Chat"), we can enable file sharing between Azure Communication Services end users and Teams users. Note, Interop Chat is different from the Azure Communication Services Chat. If you want to enable file sharing in an Azure Communication Services Chat, refer to [Add file sharing with UI Library in Azure Communication Services Chat](./file-sharing-tutorial-acs-chat.md). Currently, the Azure Communication Services end user is only able to receive file attachments from the Teams user. Refer to [UI Library Use Cases](../concepts/ui-library/ui-library-use-cases.md) to learn more.

>[!IMPORTANT]
>
>File sharing feature comes with the CallWithChat Composite without additional setups. 
>


## Download code

Access the code for this tutorial on [GitHub](https://github.com/Azure-Samples/communication-services-javascript-quickstarts/tree/main/ui-library-quickstart-teams-interop-meeting-chat).

## Prerequisites

- An Azure account with an active subscription. For details, see [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).
- [Visual Studio Code](https://code.visualstudio.com/) on one of the [supported platforms](https://code.visualstudio.com/docs/supporting/requirements#_platforms).
- [Node.js](https://nodejs.org/), Active LTS and Maintenance LTS versions. Use the `node --version` command to check your version.
- An active Communication Services resource and connection string. [Create a Communication Services resource](../quickstarts/create-communication-resource.md).
- Using the UI library version [1.17.0](https://www.npmjs.com/package/@azure/communication-react/v/1.17.0) or the latest.
- Have a Teams meeting created and the meeting link ready.
- Be familiar with how [ChatWithChat Composite](https://azure.github.io/communication-ui-library/?path=/docs/composites-callwithchatcomposite--docs) works.


## Background

First of all, we need to understand that Teams Interop Chat has to part of a Teams meeting currently. When the Teams user creates an online meeting, a chat thread would be created and associated with the meeting. To enable the Azure Communication Services end user joining the chat and starting to send/receive messages, a meeting participant (a Teams user) would need to admit them to the call first. Otherwise, they don't have access to the chat.

Once the Azure Communication Services end user is admitted to the call, they would be able to start to chat with other participants on the call. In this tutorial, we're checking out how inline image works in Interop chat.

## Overview

Similar to how we're [Adding Inline Image Support](./inline-image-tutorial-interop-chat.md) to the UI library, we need a `CallWithChat` Composite created. 
Let's follow the basic example from the [storybook page](https://azure.github.io/communication-ui-library/?path=/docs/composites-callwithchatcomposite--docs) to create a ChatWithChat Composite.

From the sample code, it needs `CallWithChatExampleProps`, which is defined as the following code snippet:

```js
export type CallWithChatExampleProps = {
  // Props needed for the construction of the CallWithChatAdapter
  userId: CommunicationUserIdentifier;
  token: string;
  displayName: string;
  endpointUrl: string;
  locator: TeamsMeetingLinkLocator | TeamsMeetingIdLocator | CallAndChatLocator;

  // Props to customize the CallWithChatComposite experience
  fluentTheme?: PartialTheme | Theme;
  compositeOptions?: CallWithChatCompositeOptions;
  callInvitationURL?: string;
};

```

To be able to start the Composite for meeting chat, we need to pass `TeamsMeetingLinkLocator` or `TeamsMeetingIdLocator`, which looks like this:

```js
{ "meetingLink": "<TEAMS_MEETING_LINK>" }
```

Or

```js
{ "meetingId": "<TEAMS_MEETING_ID>", "passcode": "<TEAMS_MEETING_PASSCODE>"}
```

This is all you need - and there's no other setup needed to enable the Azure Communication Services end user to receive file attachments from the Teams user!

## Permissions

When file is shared from a Teams client, the Teams user has options to set the file permissions to be:
 - "Anyone"
 - "People in your organization"
 - "People currently in this chat"
 - "People with existing access"
 - "People you choose"

Specifically, the UI library currently only supports "Anyone" and "People you choose" (with email address) and all other permissions aren't supported. If Teams user sent a file with unsupported permissions, the Azure Communication Services end user might be prompted to a login page or denied access when they click on the file attachment in the chat thread.


![Screenshot of a Teams client listing out file permissions.](./media/file-sharing-tutorial-interop-chat-0.png "Screenshot of a Teams client listing out file permissions.")


Moreover, the Teams user's tenant admin might impose restrictions on file sharing, including disabling some file permissions or disabling file sharing option all together. 

## Run the code

Let's run `npm run start` then you should be able to access our sample app via `localhost:3000` like the following screenshot: 

![Screenshot of an Azure Communication Services UI library.](./media/inline-image-tutorial-interop-chat-0.png "Screenshot of a Azure Communication Services UI library.")

Simply click on the chat button located in the bottom to reveal the chat panel and now if Teams user sends some files, you should see something like the following screenshot:

![Screenshot of a Teams client sending one file.](./media/file-sharing-tutorial-interop-chat-1.png "Screenshot of a Teams client sending one file.")

![Screenshot of Azure Communication Services UI library receiving one file.](./media/file-sharing-tutorial-interop-chat-2.png "Screenshot of Azure Communication Services UI library receiving one file.")

And now if the user click on the file attachment card, a new tab would be opened like the following where the user can download the file:

![Screenshot of Sharepoint webpage that shows the file content.](./media/file-sharing-tutorial-interop-chat-3.png "Screenshot of Sharepoint webpage that shows the file content.")


## Next steps

> [!div class="nextstepaction"]
> [Check the rest of the UI Library](https://azure.github.io/communication-ui-library/)

You may also want to:

- [Check UI Library use cases](../concepts/ui-library/ui-library-use-cases.md)
- [Add chat to your app](../quickstarts/chat/get-started.md)
- [Creating user access tokens](../quickstarts/identity/access-tokens.md)
- [Learn about client and server architecture](../concepts/identity-model.md#client-server-architecture)
- [Learn about authentication](../concepts/authentication.md)
- [Add file sharing with UI Library in Azure Azure Communication Services end user Service Chat](./file-sharing-tutorial-acs-chat.md)
- [Add inline image with UI Library in Teams Interoperability Chat](./inline-image-tutorial-interop-chat.md)
