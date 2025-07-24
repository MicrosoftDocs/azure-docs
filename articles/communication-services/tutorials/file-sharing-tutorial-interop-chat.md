---
title: Add file sharing in Teams interop chat using UI Library
titleSuffix: An Azure Communication Services tutorial
description: This article describes how to add file sharing in Teams interop chat using UI Library.
author: jpeng-ms
services: azure-communication-services
ms.author: jopeng
ms.date: 08/03/2023
ms.topic: tutorial
ms.service: azure-communication-services
ms.subservice: chat
---

# Enable file sharing using UI Library in Teams Interoperability Chat

In a Teams Interoperability Chat or *Interop Chat*, we can enable file sharing between Azure Communication Services end users and Teams users. Interop Chat is different from the Azure Communication Services Chat. If you want to enable file sharing in an Azure Communication Services Chat, see [Add file sharing with UI Library in Azure Communication Services Chat](./file-sharing-tutorial-acs-chat.md). Currently, the Azure Communication Services end user is only able to receive file attachments from the Teams user. For more information, see [UI Library Use Cases](../concepts/ui-library/ui-library-use-cases.md).

>[!IMPORTANT]
>
>The file sharing feature comes with the CallWithChat Composite without no added setup.
>

## Download code

Access the code for this tutorial at [UI Library Sample - File Sharing using UI Library Teams Interop meeting Chat](https://github.com/Azure-Samples/communication-services-javascript-quickstarts/tree/main/ui-library-quickstart-teams-interop-meeting-chat).

## Prerequisites

- An Azure account with an active subscription. For details, see [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).
- [Visual Studio Code](https://code.visualstudio.com/) on one of the [supported platforms](https://code.visualstudio.com/docs/supporting/requirements#_platforms).
- [Node.js](https://nodejs.org/), Active LTS, and Maintenance LTS versions. Use the `node --version` command to check your version.
- An active Communication Services resource and connection string. [Create a Communication Services resource](../quickstarts/create-communication-resource.md).
- Using the UI library version [1.17.0](https://www.npmjs.com/package/@azure/communication-react/v/1.17.0) or the latest.
- Have a Teams meeting created and the meeting link ready.
- Be familiar with how [ChatWithChat Composite](https://azure.github.io/communication-ui-library/?path=/docs/composites-callwithchatcomposite--docs) works.


## Background

Teams Interop Chat needs to be to part of an existing Teams meeting. When the Teams user creates an online meeting, a chat thread is created and associated with the meeting. To enable the Azure Communication Services end user joining the chat and starting to send/receive messages, a meeting participant (a Teams user) needs to admit them to the call first. Otherwise, they don't have access to the chat.

Once the Azure Communication Services end user is admitted to the call, they can start to chat with other participants on the call. This article describes how inline image sharing works in Teams Interop chat.

## Overview

Similar to how you [Add Inline Image Support](./inline-image-tutorial-interop-chat.md) to the UI library, you need to create a `CallWithChat` Composite.

To create a ChatWithChat Composite, see [CallWithChatComposite tutorial](https://azure.github.io/communication-ui-library/?path=/docs/composites-callwithchatcomposite--docs).

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

That's it! You don't need any other setup to enable the Azure Communication Services end user to receive file attachments from the Teams user!

## Permissions

When file is shared from a Teams client, the Teams user has options to set the file permissions to be:
 - "Anyone"
 - "People in your organization"
 - "People currently in this chat"
 - "People with existing access"
 - "People you choose"

Specifically, the UI library currently only supports "Anyone" and "People you choose" (with email address) and all other permissions aren't supported. If Teams user sent a file with unsupported permissions, the Azure Communication Services end user might be prompted to sign in or denied access when they click on the file attachment in the chat thread.


![Screenshot of a Teams client listing out file permissions.](./media/file-sharing-tutorial-interop-chat-0.png "Screenshot of a Teams client listing out file permissions.")


In addition, the Teams user tenant admin might impose restrictions on file sharing, including disabling some file permissions or disabling file sharing option all together. 

## Run the code

When you run `npm run start`, you can access our sample app via `localhost:3000` as shown in the following screenshot: 

![Screenshot of an Azure Communication Services UI library.](./media/inline-image-tutorial-interop-chat-0.png "Screenshot of a Azure Communication Services UI library.")

Click on the chat button located in the bottom to reveal the chat panel. If a Teams user sends some files, you should see something like the following screenshot:

![Screenshot of a Teams client sending one file.](./media/file-sharing-tutorial-interop-chat-1.png "Screenshot of a Teams client sending one file.")

![Screenshot of Azure Communication Services UI library receiving one file.](./media/file-sharing-tutorial-interop-chat-2.png "Screenshot of Azure Communication Services UI library receiving one file.")

And now if the user click on the file attachment card, a new tab opens like the following screenshot in which the user can download the file:

![Screenshot of Sharepoint webpage that shows the file content.](./media/file-sharing-tutorial-interop-chat-3.png "Screenshot of Sharepoint webpage that shows the file content.")


## Next steps

> [!div class="nextstepaction"]
> [Check the rest of the UI Library](https://azure.github.io/communication-ui-library/)

## Related articles

- [Check UI Library use cases](../concepts/ui-library/ui-library-use-cases.md)
- [Add chat to your app](../quickstarts/chat/get-started.md)
- [Creating user access tokens](../quickstarts/identity/access-tokens.md)
- [Learn about client and server architecture](../concepts/identity-model.md#client-server-architecture-for-the-bring-your-own-identity-byoi-model)
- [Learn about authentication](../concepts/authentication.md)
- [Add file sharing with UI Library in Azure Azure Communication Services end user Service Chat](./file-sharing-tutorial-acs-chat.md)
- [Add inline image with UI Library in Teams Interoperability Chat](./inline-image-tutorial-interop-chat.md)
