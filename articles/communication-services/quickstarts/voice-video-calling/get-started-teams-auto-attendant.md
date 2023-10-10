---
title: Quickstart - Teams Auto Attendant on Azure Communication Services
titleSuffix: An Azure Communication Services quickstart
description: In this quickstart, you learn how to create and join a Teams Auto Attendant with the Azure Communication Calling SDK.
author: ruslanzdor
ms.author: ruslanzdor
ms.date: 07/14/2023
ms.topic: quickstart
ms.service: azure-communication-services
ms.subservice: calling
ms.custom: mode-other, devx-track-js
---

# Quickstart: Join your calling app to a Teams Auto Attendant

[!INCLUDE [Public Preview](../../../communication-services/includes/public-preview-include-document.md)]

In this quickstart you are going to learn how to start a call from Azure Communication Services user to Teams Auto Attendant. You are going to achieve it with the following steps:

1. Enable federation of Azure Communication Services resource with Teams Tenant.
2. Select or create Teams Auto Attendant via Teams Admin Center.
3. Get email address of Auto Attendant via Teams Admin Center.
4. Get Object ID of the Auto Attendant via Graph API.
5. Start a call with Azure Communication Services Calling SDK.

If you'd like to skip ahead to the end, you can download this quickstart as a sample on [GitHub](https://github.com/Azure-Samples/communication-services-javascript-quickstarts/tree/main/add-1-on-1-cte-video-calling).

[!INCLUDE [Enable interoperability in your Teams tenant](../../concepts/includes/enable-interoperability-for-teams-tenant.md)]

## Create or select Teams Auto Attendant

Teams Auto Attendant is system that provides an automated call handling system for incoming calls. It serves as a virtual receptionist, allowing callers to be automatically routed to the appropriate person or department without the need for a human operator. You can select existing or create new Auto Attendant via [Teams Admin Center](https://aka.ms/teamsadmincenter).

Learn more about how to create Auto Attendant using Teams Admin Center [here](/microsoftteams/create-a-phone-system-auto-attendant?tabs=general-info).

## Find Object ID for Auto Attendant

After Auto Attendant is created, we need to find correlated Object ID to use it later for calls. Object ID is connected to Resource Account that was attached to Auto Attendant - open [Resource Accounts tab](https://admin.teams.microsoft.com/company-wide-settings/resource-accounts) in Teams Admin and find email of account.
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

[!INCLUDE [Auto Attendant with JavaScript](./includes/teams-auto-attendant/teams-auto-attendant-javascript.md)]

## Clean up resources

If you want to clean up and remove a Communication Services subscription, you can delete the resource or resource group. Deleting the resource group also deletes any other resources associated with it. Learn more about [cleaning up resources](../create-communication-resource.md#clean-up-resources).

## Next steps

For more information, see the following articles:

- Check out our [calling hero sample](../../samples/calling-hero-sample.md)
- Get started with the [UI Library](../ui-library/get-started-composites.md)
- Learn about [Calling SDK capabilities](./getting-started-with-calling.md)
- Learn more about [how calling works](../../concepts/voice-video-calling/about-call-types.md)
