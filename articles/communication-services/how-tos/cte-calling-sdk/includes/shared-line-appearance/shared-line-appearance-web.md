---
author: charithgunaratna
ms.service: azure-communication-services
ms.topic: include
ms.date: 02/04/2025
ms.author: charithg
ms.custom:
  - build-2025
---

> [!NOTE]
> This API is available with Azure Communication Services Calling Web SDK (1.35.1 or higher).

[!INCLUDE [Install SDK](../install-sdk/install-sdk-web.md)]

## Place a call on behalf of a Microsoft Teams user

Before placing a call behalf of a delegator, make sure delegate placing the call has `make calls` permission through [delegator call settings in Microsoft Teams](https://support.microsoft.com/office/share-a-phone-line-with-a-delegate-in-microsoft-teams-16307929-a51f-43fc-8323-3b1bf115e5a8)

To place a call on behalf of a Microsoft Teams user, specify `OnBehalfOfOptions` during start call. Replace `xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx` with the userId of the delegator and `yyyyyyyy-yyyy-yyyy-yyyy-yyyyyyyyyyyy` with the userId of the callee.

```js
const onBehalfOfOptions = { userId: { microsoftTeamsUserId: "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx" } }
const teamsCallOptions = { onBehalfOfOptions: onBehalfOfOptions };
const call = teamsCallAgent.startCall([{ microsoftTeamsUserId: "yyyyyyyy-yyyy-yyyy-yyyy-yyyyyyyyyyyy" }], teamsCallOptions);
```

To place a call to a PSTN user on behalf of a Microsoft Teams user, use `PhoneNumberIdentifier` for call participant.

```js
const call = teamsCallAgent.startCall([{ phoneNumber: "+1xxxxxxxxxx" }], teamsCallOptions);
```

## Receive a call on behalf of a Microsoft Teams user

To receive calls on behalf of a delegator,

- Update delegate permission to enable "receive calls" through [delegator call settings in Microsoft Teams](https://support.microsoft.com/office/share-a-phone-line-with-a-delegate-in-microsoft-teams-16307929-a51f-43fc-8323-3b1bf115e5a8)
- Set up simultaneous ring for delegates through [delegator call settings in Microsoft Teams](https://support.microsoft.com/office/call-forwarding-call-groups-and-simultaneous-ring-in-microsoft-teams-a88da9e8-1343-4d3c-9bda-4b9615e4183e)