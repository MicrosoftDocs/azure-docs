---
title: Teams Phone Extensibility Emergency Call
titleSuffix: An Azure Communication Services article
description: This article describes how emergency calls work for Teams Phone Extensibility User
author: cnwankwo
manager: miguelher
services: azure-communication-services
ms.author: ansrin
ms.date: 08/28/2025
ms.topic: quickstart
ms.service: azure-communication-services
ms.subservice: identity
---

# Teams Phone Extensibility Emergency Call

This article describes how emergency calls work for Teams Phone Extensibility Users

[!INCLUDE [public-preview-notice.md](../../includes/public-preview-include-document.md)]

## Prerequisites

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).

- A Communication Services resource, see [Create a Communication Services resource](../../quickstarts/create-communication-resource.md).

- A configured Event Grid endpoint. [Incoming call concepts - An Azure Communication Services concept document](../../concepts/call-automation/incoming-call-notification.md#receiving-an-incoming-call-notification-from-event-grid)

- A Microsoft Teams resource account with an associated phone number. [Create a new Teams Resource account](/powershell/module/teams/new-csonlineapplicationinstance)

- Create and host an Azure Dev Tunnel. [Instructions here](/azure/developer/dev-tunnels/get-started).

## Associate your Teams resource account with your Communication Services resource

Execute the following command. Make sure you have your Azure Communication Services resource identifier ready. To find it, see [Get an immutable resource identifier](/azure/communication-services/concepts/troubleshooting-info#get-an-immutable-resource-id).

```powershell
Set-CsOnlineApplicationInstance -Identity <appIdentity> -AcsResourceId <acsResourceId>
```

For more details, follow this guide: [Associate your Azure Communication Services resource with the Teams Resource account](/powershell/module/teams/set-csonlineapplicationinstance#-acsresourceid)


## Next steps
  
> [!div class="nextstepaction"]
> [REST API for Teams Phone extensibility](./teams-phone-extensiblity-rest-api.md)

## Related articles

- [Teams Phone extensibility overview](../../concepts/interop/tpe/teams-phone-extensibility-overview.md)
- [Teams Phone System extensibility quick start](./teams-phone-extensibility-quickstart.md)
