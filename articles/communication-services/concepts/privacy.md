---
title: Region availability and data residency for Azure Communication Services
description: Learn about data residency, and privacy related matters on Azure Communication Services
author: tophpalmer
manager: anvalent
services: azure-communication-services

ms.author: chpalm
ms.date: 03/07/2023
ms.topic: conceptual
ms.service: azure-communication-services
ms.custom: references_regions
---

# Region availability and data residency

Azure Communication Services is committed to helping our customers meet their privacy and personal data requirements. As a developer using Communication Services with a direct relationship with humans using the application, you're potentially a controller of their data. Since Azure Communication Services is storing and encrypting this data at rest on your behalf, we're most likely a processor of this data. This page summarizes how the service retains data and how you can identify, export, and delete this data.

## Data residency

When [creating](../quickstarts/create-communication-resource.md) an Azure Communication Services resource, you specify a **geography** (not an Azure data center). All chat messages, and resource data stored by Communication Services at rest are retained in that geography, in a data center selected internally by Communication Services. Data **may** transit or be processed in other geographies. These global endpoints are necessary to provide a high-performance, low-latency experience to end-users no matter their location.

The list of geographies you can choose from includes:
- Africa
- Asia Pacific
- Australia
- Brazil
- Canada
- Europe
- France
- Germany
- India
- Japan
- Korea
- Norway
- Switzerland
- United Arab Emirates
- United Kingdom
- United States

## Data collection

Azure Communication Services only collects diagnostic data required to deliver the service. 

## Data residency and events

Any Event Grid system topic configured with Azure Communication Services is created in a global location. To support reliable delivery, a global Event Grid system topic may store the event data in any Microsoft data center. When you configure Event Grid with Azure Communication Services, you're delivering your event data to Event Grid, which is an Azure resource under your control. While Azure Communication Services may be configured to utilize Azure Event Grid, you're responsible for managing your Event Grid resource and the data stored within it.

## Relating humans to Azure Communication Services identities

Your application manages the relationship between human users and Communication Service identities. When you want to delete data for a human user, you must delete data involving all Communication Service identities correlated for the user.

There are two categories of Communication Service data:
- **API Data.** This data is created and managed with Communication Service APIs, for example, Chat messages managed through Chat APIs.
- **Azure Monitor Logs** This data is created by the service and managed through the Azure Monitor data platform. This data includes telemetry and metrics to help you understand your Communication Services usage.

## API data

### Identities

Azure Communication Services maintains a directory of identities. Use the [DeleteIdentity](/rest/api/communication/communication-identity/delete?tabs=HTTP) API to remove identities. If you remove an identity, it revokes all associated access tokens and deletes their chat messages. For more information on how to remove an identity, see [Create and manage access tokens](../quickstarts/identity/access-tokens.md).

- `Delete Identity`

### Azure Resource Manager

You can use the Azure portal or Azure Resource Manager APIs with Azure Communication Services to create personal data. For more information, see [Manage personal data associated with Azure Resource Manager](../../azure-resource-manager/management/resource-manager-personal-data.md).

### Telephone number management

Azure Communication Services maintains a directory of phone numbers associated with a Communication Services resource. Use [Phone Number Administration APIs](/rest/api/communication/phonenumbers) to retrieve phone numbers and delete them:

- `Get All Phone Numbers`
- `Release Phone Number`

### Chat

Azure Communication Services stores chat threads according to the [data retention policy](/purview/create-retention-policies) in effect when the thread is created. You can update the retention policy if needed during the retention time period you set. After you delete a chat thread (by policy or by a Delete API request), it can't be retrieved.

[!INCLUDE [chat-retention-policy.md](../includes/chat-retention-policy.md)]

You can choose between indefinite thread retention, automatic deletion between 30 and 90 days via the retention policy on the [Create Chat Thread API](/rest/api/communication/chat/chat/create-chat-thread), or immediate deletion using the APIs [Delete Chat Message](/rest/api/communication/chat/chat-thread/delete-chat-message) or [Delete Chat Thread](/rest/api/communication/chat/chat/delete-chat-thread). 

Any thread created before the new retention policy isn't affected unless you specifically change the policy for that thread. If you submit a support request for a deleted chat thread more than 30 days after the retention policy has deleted that thread, it can no longer be retrieved and no information about that thread is available. If needed, [open a support ticket](/azure/azure-portal/supportability/how-to-create-azure-support-request) as quickly as possible within the 30 day window after you create a thread so we can assist you.

Chat thread participants can use `ListMessages` to view message history for a particular thread. The `ListMessages` API can't return the history of a thread if the thread is deleted. Users that are removed from a chat thread are able to view previous message history but can't send or receive new messages. Accidentally deleted messages aren't recoverable by the system.

Use [Chat APIs](/rest/api/communication/chat/chatthread) to get, list, update, and delete messages.

- `Get Thread`
- `Get Message`
- `List Messages`
- `Update Message`
- `Delete Thread`
- `Delete Message`

For customers that use Virtual appointments, refer to our Teams Interoperability [user privacy](interop/guest/privacy.md#chat-storage) for storage of chat messages in Teams meetings.

### SMS

The service temporarily processes sent and received SMS messages and they are not retained.

### PSTN voice calling

Audio and video communication is ephemerally processed by the service and no call processing data is retained in your resource other than Azure Monitor logs.

### Internet voice and video calling

Audio and video communication is ephemerally processed by the service and no call processing data is retained in your resource other than Azure Monitor logs.

### Call Recording

Call recordings are stored temporarily in the same geography you selected for `Data Location` during resource creation for 24 hours. After this the recording is deleted, you are responsible for storing the recording in a secure and compliant location.

### Email
Email message content is ephemerally stored for processing in the resource's `Data Location` specified by you during resource provisioning. Email message delivery logs are available in Azure Monitor Logs, where you are in control to define the workspace to store logs. Domain sender usernames (or MailFrom) values are stored in the resource's `Data Location` until explicitly deleted. Recipient's email addresses that result in hard bounced messages are temporarily retained for spam and abuse prevention and detection.

## Azure Monitor and Log Analytics

Azure Communication Services feed into Azure Monitor logging data for understanding operational health and use of the service. Some of these logs include Communication Service identities and phone numbers as field data. To delete any potentially personal data, [use these procedures for Azure Monitor](/azure/azure-monitor/logs/personal-data-mgmt). You may also want to configure [the default retention period for Azure Monitor](/azure/azure-monitor/logs/data-retention-configure).

## Related articles

- [Azure Data Subject Requests for the GDPR and CCPA](/microsoft-365/compliance/gdpr-dsr-azure)
- [Microsoft Trust Center](https://www.microsoft.com/trust-center/privacy/data-location)
- [Azure Interactive Map - Where is my customer data?](https://infrastructuremap.microsoft.com/)
