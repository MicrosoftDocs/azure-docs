---
title: Region availability and data residency for Azure Communication Services
description: Learn about data residency, and privacy related matters on Azure Communication Services
author: chpalm
manager: anvalent
services: azure-communication-services

ms.author: chpalm
ms.date: 10/03/2020
ms.topic: overview
ms.service: azure-communication-services
---

# Region availability and data residency

[!INCLUDE [Public Preview Notice](../includes/public-preview-include.md)]

Azure Communication Services is committed to helping our customers meet their privacy and personal data requirements. As a developer using Communication Services with a direct relationship with humans using the application, you are potentially a controller of their data. Since Azure Communication Services is storing this data on your behalf, we are most likely a processor of this data. This page summarizes how the service retains data and how you can identify, export, and delete this data.

## Data residency

When creating an Communication Services resource, you specify a **geography** (not an Azure data center). All data stored by Communication Services at rest will be retained in that geography, in a data center selected internally by Communication Services. However data may transit or be processed in other geographies, these global endpoints are necessary to provide a high-performance, low-latency experience to end-users no matter their location.

## Relating humans to Azure Communication Services identities

Your application manages the relationship between human users and Communication Service identities. When you want to delete data for a human user, you must delete data involving all Communication Service identities correlated for the user.

There are two categories of Communication Service data:
- **API Data.** This data is created and managed by Communication Service APIs, a typical example being Chat messages managed through Chat APIs.
- **Azure Monitor Logs** This data is created by the service and managed through the Azure Monitor data platform. This data includes telemetry and metrics to help you understand your Communication Services usage. This is not managed by Communication Service APIs.

## API data

### Identities

Azure Communication Services maintains a directory of identities, use the [DeleteIdentity](https://docs.microsoft.com/rest/api/communication/communicationidentity/delete) API to remove them. Deleting an identity will revoke all associated access tokens and delete their chat messages. For more information on how to remove an identity [see this page](../quickstarts/access-tokens.md).

- DeleteIdentity

### Azure Resource Manager

Using the Azure portal or Azure Resource Manager APIs with Communication Services, can create personal data. [Use this page to learn how to manage personal data in Azure Resource Manager systems.](https://docs.microsoft.com/azure/azure-resource-manager/management/resource-manager-personal-data)

### Telephone number management

Azure Communication Services maintains a directory of phone numbers associated with a Communication Services resource. Use these APIs to retrieve phone numbers and delete them:
- `Release Phone Number`

### Chat

Chat threads and messages are retained until explicitly deleted. A fully idle thread will be automatically deleted after 30 days. Use [Chat APIs](https://docs.microsoft.com/rest/api/communication/chat/deletechatmessage/deletechatmessage) to get, list, update, and delete messages.

- `Get Thread`
- `Get Message`
- `Delete Thread`
- `Delete Message`

### SMS

Sent and received SMS messages are ephemerally processed by the service and not retained. 

### PSTN voice calling

Audio and video communication is ephemerally processed by the service and no data is retained in your resource other than Azure Monitor logs.

### Internet voice and video calling

Audio and video communication is ephemerally processed by the service and no data is retained in your resource other than Azure Monitor logs.

## Azure Monitor and Log Analytics

Azure Communication Services will feed into Azure Monitor logging data for understanding operational health and utilization of the service. Some of these logs include Communication Service identities and phone numbers as field data. To delete any potentially personal data [use these procedures for Azure Monitor](https://docs.microsoft.com/azure/azure-monitor/platform/personal-data-mgmt). You may also want to configure [the default retention period for Azure Monitor](https://docs.microsoft.com/azure/azure-monitor/platform/manage-cost-storage).

## Additional resources

- [Azure Data Subject Requests for the GDPR and CCPA](https://docs.microsoft.com/microsoft-365/compliance/gdpr-dsr-azure?view=o365-worldwide&preserve-view=true)
- [Microsoft Trust Center](https://www.microsoft.com/trust-center/privacy/data-location)
- [Azure Interactive Map - Where is my customer data?](https://azuredatacentermap.azurewebsites.net/)