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

Azure Communication Services is committed to helping our customers meet their privacy and personal data requirements. As a developer using Communication Services with a direct relationship with humans using the application, you are potentially a controller of their data. Since Azure Communication Services is storing and encrypting this data at rest on your behalf, we are most likely a processor of this data. This page summarizes how the service retains data and how you can identify, export, and delete this data.

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

Azure Communication Services maintains a directory of identities, use the [DeleteIdentity](/rest/api/communication/communication-identity/delete?tabs=HTTP) API to remove them. Deleting an identity revokes all associated access tokens and deletes their chat messages. For more information on how to remove an identity [see this page](../quickstarts/identity/access-tokens.md).

- DeleteIdentity

### Azure Resource Manager

Using the Azure portal or Azure Resource Manager APIs with Communication Services, can create personal data. [Use this page to learn how to manage personal data in Azure Resource Manager systems.](../../azure-resource-manager/management/resource-manager-personal-data.md)

### Telephone number management

Azure Communication Services maintains a directory of phone numbers associated with a Communication Services resource. Use [Phone Number Administration APIs](/rest/api/communication/phonenumbers) to retrieve phone numbers and delete them:

- `Get All Phone Numbers`
- `Release Phone Number`

### Chat

Azure Communication Services stores chat messages indefinitely till they are deleted. Chat thread participants can use ListMessages to view message history for a particular thread. Users that are removed from a chat thread are able to view previous message history but cannot send or receive new messages. Accidentally deleted messages are not recoverable by the system.

Use [Chat APIs](/rest/api/communication/chat/chatthread) to get, list, update, and delete messages.

- `Get Thread`
- `Get Message`
- `List Messages`
- `Update Message`
- `Delete Thread`
- `Delete Message`

For customers that use Virtual appointments, refer to our Teams Interoperability [user privacy](interop/guest/privacy.md#chat-storage) for storage of chat messages in Teams meetings.

### SMS

Sent and received SMS messages are ephemerally processed by the service and not retained.

### PSTN voice calling

Audio and video communication is ephemerally processed by the service and no call processing data is retained in your resource other than Azure Monitor logs.

### Internet voice and video calling

Audio and video communication is ephemerally processed by the service and no call processing data is retained in your resource other than Azure Monitor logs.

### Call Recording

Call recordings are stored temporarily in the same geography that was selected for ```Data Location``` during resource creation for 48 hours. After this the recording is deleted and you are responsible for storing the recording in a secure and compliant location.

### Email
Email message content is ephemerally stored for processing in the resource's ```Data Location``` specified by you during resource provisioning. Email message delivery logs are available in Azure Monitor Logs, where you are in control to define the workspace to store logs. Domain sender usernames (or MailFrom) values are stored in the resource's ```Data Location``` until explicitly deleted. Recipient's email addresses that result in hard bounced messages are temporarily retained for spam and abuse prevention and detection.

## Azure Monitor and Log Analytics

Azure Communication Services feed into Azure Monitor logging data for understanding operational health and utilization of the service. Some of these logs include Communication Service identities and phone numbers as field data. To delete any potentially personal data, [use these procedures for Azure Monitor](../../azure-monitor/logs/personal-data-mgmt.md). You may also want to configure [the default retention period for Azure Monitor](../../azure-monitor/logs/data-retention-archive.md).

## Additional resources

- [Azure Data Subject Requests for the GDPR and CCPA](/microsoft-365/compliance/gdpr-dsr-azure)
- [Microsoft Trust Center](https://www.microsoft.com/trust-center/privacy/data-location)
- [Azure Interactive Map - Where is my customer data?](https://infrastructuremap.microsoft.com/)
