---
title: Embed Azure Communication Services Chat in a custom Microsoft Teams app
description: Learn how to use an Azure Communication Services Chat app from within Teams, without using interoperability linkage.
author: emlynmac
manager: kperla97
services: azure-communication-services

ms.author: eboltonmaggs
ms.date: 09/16/2024
ms.topic: tutorial
ms.service: azure-communication-services
ms.subservice: chat
---

# Embed chat in a Microsoft Teams custom app

This article describes how to create a Microsoft Teams custom app to interact with an Azure Communication Services instance. This chat app enables interwork functions between the two systems while maintaining separated backend environments and identity configurations.

## Use cases

- **Point-of-sales and post-sales support**
  
  Consumer websites can provide a quick access to a chat channel, either to automated bots or sales associate or both. We recommend using an isolated Azure Communication Service instance.

  Similarly, post-sales support and coordination benefit from the ability to use chat independently while incorporated within Teams.

- **Secured remote consultation services**
  
  For medical telepresence applications, banking services, and other privacy-sensitive scenarios, the encryption and security provided by Azure Communication Services enables these use cases without needing the remote participants to use Teams. You can brand the solution as needed and employees of your organization can access the consults from their existing Teams installation.

- **Data separation requirement scenarios**
  
  For some areas, you might need to ensure geographical quarantining of data to specific jurisdictions. A company’s legal data storage area might be different from the location required to store customer data. You can configure such a scenario using the Azure Communications Services storage location at instance creation. The location can be different from the [Teams’ storage location](/microsoftteams/privacy/location-of-data-in-teams).

  :::image type="content" source="media/chat-app-teams-instance-details.png" alt-text="Screen capture of selecting an Azure Communications Services storage location at instance creation." lightbox="media/chat-app-teams-instance-details.png":::

## Architecture

The following diagram shows the overall view of the Teams extensibility chat app.

:::image type="content" source="media/chat-app-teams-architecture.png" alt-text="Architecture diagram of the Azure Communications Services Teams extensibility chat app." lightbox="media/chat-app-teams-architecture.png":::

1. An Azure Communications Services instance enables the solution.

2. The Web API provides server-side function for the solution, for both internal and external facing applications.

3. Contoso customers use client (web or mobile) applications to interface with employees. This example shows a web app used to host the content.

4. Contoso employees use the Teams app within their Teams client. The Teams client is a web app hosted within a Teams custom app and deployed to Teams through an iframe inside the Teams client.

   The Azure Communication Services instance isn't directly connected to the Teams environment. The Communications Services environment is surfaced through the Teams custom app.

   The Teams custom app gains Teams’ single sign-on (SSO), which provides the Teams user ID to the app. The custom messaging app uses the Teams user ID to map to the communication service user ID.

## Build the Solution

You need the following components to create the chat app.

1. An Azure Communication Services instance.
   - For more information, see [Quickstart: Create and manage Communication Services resources](../quickstarts/create-communication-resource.md).
   - Configure the storage area for the instance during creation.

2. An API server to host the backend components. The API server provides the backend logic required. Common use cases include user authentication and chat thread management APIs.

3. A Web app instance to host the frontend components. The frontend components for both the customer-facing web and potentially for driving the Teams custom app layout via embedded iframe.

4. A Teams custom app configured Teams to enable this app installation. To provide the experience for employees, Set up the Teams custom app to use web content driven from a web app or through a Teams custom app deployment.

## Design the app

You can design the customer-facing portal site as needed to meet your business needs. A simple call / chat web app usually requires two features:

- Authentication (sign up / sign-on)
- Primary chat (and call) user interface

Teams single sign-on (SSO) provides authentication in the employee-facing Teams custom app. In this case, the employee needs to see a further list of customers before the main chat (and call) experience.

Some other considerations for the design work within teams include guidelines to ensure a cohesive, inclusive, and accessible experience. For more information, see [Designing your Microsoft Teams app](/microsoftteams/platform/concepts/design/design-teams-app-overview).

## Implement the Teams custom app

Start your dedicated journey at [Get started > Build your first Teams app](/microsoftteams/platform/get-started/get-started-overview#build-your-first-teams-app).  

To get the development toolkit for Visual Studio Code, a quick reference to learning materials, code samples, and project templates, see [Microsoft Teams Toolkit Overview](/microsoftteams/platform/toolkit/teams-toolkit-fundamentals).

In the Microsoft Teams Toolkit, select **New Project** > **Tab**.

:::image type="content" source="media/chat-app-teams-new-project.png" alt-text="Screen capture of Microsoft Teams Toolkit when you select New Project then Tab." lightbox="media/chat-app-teams-new-project.png":::

A Tab app provides the simplest framework, which you can further refine to use React with Fluent UI.

:::image type="content" source="media/chat-app-teams-new-tab.png" alt-text="Screen capture of Microsoft Teams Toolkit when you select App Features using a Tab then React with Fluent UI." lightbox="media/chat-app-teams-new-tab.png":::

You can quickly create an app skeleton and try it locally in Teams using a Microsoft 365 developer account. Use the React with Fluent UI capability and follow the basic install in Visual Studio Code.

:::image type="content" source="media/chat-app-teams-new-app-congrats.png" alt-text="Screen capture of Microsoft Teams Toolkit congratulations when your app starts running." lightbox="media/chat-app-teams-new-app-congrats.png":::

This project has a templated API implementation through Azure Functions. At this point, you need to create the complete backend implementation for a chat platform. The Basic Tab option provides the web app frontend structure. It also enables SSO for the app as described in [Develop single sign on experience in Teams | GitHub](https://github.com/OfficeDev/teams-toolkit/wiki/Develop-single-sign-on-experience-in-Teams).

### Other ways to implement the Teams custom app

You can create a Tab app that links each of the tabs through to an external app using the Teams app `manifest.json` file. For more information, see [Sample app manifest](/microsoftteams/platform/resources/schema/manifest-schema#sample-app-manifest).  

You can also use an existing Microsoft Entra app, as described in [Use existing Microsoft Entra app in TeamsFx project](/microsoftteams/platform/toolkit/use-existing-aad-app).

For more information about Tabs capabilities, see [Configure Tab capability within your Teams app | GitHub](https://github.com/OfficeDev/teams-toolkit/wiki/How-to-configure-Tab-capability-within-your-Teams-app).

## Build the chat app

To build a fully featured chat app, you need some key functions.  

You need an Azure Communication Services instance to host the chats and provide the function to send and receive messages (and other communication types). Within this system, each communication ID represents a user, provided by the API service for the app. The user receives a communication ID once the user authentication flow is complete.

### Authentication flow

Azure Communication Services endpoints require authentication, provided in the form of a bearer token. The authentication service provides one token per communication ID.

Depending upon your requirements, you might need to provide a means for users to sign up, sign-on, or resolve some other form of one-time authentication link.

You need to create identities and issue authentication tokens within a backend service for security. For more information, see [Quickstart: Create and manage access tokens](../quickstarts/identity/access-tokens.md).

### Chat UI

The quickest method to provide a chat pane with message entry for the web UI is to use the React Web UI Library composites, from the Azure communication-react package. The Storybook documentation explains the integration of these and also direct usage within the Storybook environment.  

:::image type="content" source="media/chat-app-teams-your-chat.png" alt-text="Screen capture of a sample Microsoft Teams chat app in action." lightbox="media/chat-app-teams-your-chat.png":::

### Chat composite with the participants list

The chat composite component requires the user identifier and token from the authentication flow, the Communication Services endpoint, and the thread ID to which it must be attached.

Thread IDs represent conversations between groups of communication identifiers. Before a conversation, you need to create the thread and add users to that thread. You can automate this procedure or provide the function from a Tab in the Teams app for the employees to configure.  

### Chat bots

You can add bots to your chat app. For more information, see [Quickstart: Add a bot to your chat app](..//quickstarts/chat/quickstart-botframework-integration.md).

## Distribute the Teams app

To use a Teams app in an organization, The Teams admin must approve it. You can [build a Teams custom app](/microsoftteams/platform/concepts/build-and-test/apps-package) and install the app package via the [Teams admin center](https://admin.teams.microsoft.com/). For more information, see [Manage custom apps in Microsoft Teams admin center](/microsoftteams/teams-custom-app-policies-and-settings).

## Next steps

- [Quickstart: Add a bot to your chat app](../quickstarts/chat/quickstart-botframework-integration.md)
- [Enable file sharing using UI Library in Teams Interoperability Chat](../tutorials/file-sharing-tutorial-interop-chat.md)

## Related articles

- For more information about building an app with Teams interop, see [Contact center](./contact-center.md).
