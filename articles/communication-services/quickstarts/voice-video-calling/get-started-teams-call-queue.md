---
title: Quickstart - Teams Call Queue on Azure Communication Services
titleSuffix: An Azure Communication Services quickstart
description: In this quickstart, you learn how to create and join a Teams call queue with the Azure Communication Calling SDK.
author: ruslanzdor
ms.author: ruslanzdor
ms.date: 07/14/2023
ms.topic: quickstart
ms.service: azure-communication-services
ms.subservice: calling
ms.custom: mode-other, devx-track-js
---

# Quickstart: Join your calling app to a Teams call queue

[!INCLUDE [Public Preview](../../../communication-services/includes/public-preview-include-document.md)]

In this quickstart you are going to learn how to start a call from Azure Communication Services user to Teams Call Queue. You are going to achieve it with the following steps:

1. Enable federation of Azure Communication Services resource with Teams Tenant.
2. Select or create Teams Call Queue via Teams Admin Center.
3. Get email address of Call Queue via Teams Admin Center.
4. Get Object ID of the Call Queue via Graph API.
5. Start a call with Azure Communication Services Calling SDK.

If you'd like to skip ahead to the end, you can download this quickstart as a sample on [GitHub](https://github.com/Azure-Samples/communication-services-javascript-quickstarts/tree/main/add-1-on-1-cte-video-calling).

[!INCLUDE [Enable interoperability in your Teams tenant](../../concepts/includes/enable-interoperability-for-teams-tenant.md)]

## Create or select Teams Call Queue

Teams Call Queue is a feature in Microsoft Teams that efficiently distributes incoming calls among a group of designated users or agents. It's useful for customer support or call center scenarios. Calls are placed in a queue and assigned to the next available agent based on a predetermined routing method. Agents receive notifications and can handle calls using Teams' call controls. The feature offers reporting and analytics for performance tracking. It simplifies call handling, ensures a consistent customer experience, and optimizes agent productivity. You can select existing or create new Call Queue via [Teams Admin Center](https://aka.ms/teamsadmincenter).

Learn more about how to create Call Queue using Teams Admin Center [here](/microsoftteams/create-a-phone-system-call-queue?tabs=general-info).

## Find Object ID for Call Queue

After Call queue is created, we need to find correlated Object ID to use it later for calls. Object ID is connected to Resource Account that was attached to call queue - open [Resource Accounts tab](https://admin.teams.microsoft.com/company-wide-settings/resource-accounts) in Teams Admin and find email.
:::image type="content" source="../media/teams-call-queue-resource-account.PNG" alt-text="Screenshot of Resource Accounts in Teams Admin Portal.":::
All required information for Resource Account can be found in [Microsoft Graph Explorer](https://developer.microsoft.com/en-us/graph/graph-explorer) using this email in the search.

```console
https://graph.microsoft.com/v1.0/users/lab-test2-cq-@contoso.com
```

In results we'll are able to find "ID" field

```json
    "userPrincipalName": "lab-test2-cq@contoso.com",
    "id": "31a011c2-2672-4dd0-b6f9-9334ef4999db"
```

[!INCLUDE [Call Queue with JavaScript](./includes/teams-call-queue/teams-call-queue-javascript.md)]

## Clean up resources

If you want to clean up and remove a Communication Services subscription, you can delete the resource or resource group. Deleting the resource group also deletes any other resources associated with it. Learn more about [cleaning up resources](../create-communication-resource.md#clean-up-resources).

## Next steps

For more information, see the following articles:

- Check out our [calling hero sample](../../samples/calling-hero-sample.md)
- Get started with the [UI Library](../ui-library/get-started-composites.md)
- Learn about [Calling SDK capabilities](./getting-started-with-calling.md)
- Learn more about [how calling works](../../concepts/voice-video-calling/about-call-types.md)
