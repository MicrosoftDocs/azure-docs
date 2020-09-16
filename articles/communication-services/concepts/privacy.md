---
title: Region Availability and Data Residency for Azure Communication Services
titleSuffix: An Azure Communication Services concept document
description: TODO
author: mikben
manager: jken
services: azure-communication-services

ms.author: mikben
ms.date: 03/10/2020
ms.topic: overview
ms.service: azure-communication-services
---

# Region availability and data residency

[!INCLUDE [Public Preview Notice](../includes/public-preview-include.md)]

> [!WARNING]
> This document is under construction and needs the following items to be addressed:
> - Reference: https://docs.microsoft.com/azure/active-directory-b2c/data-residency
> - DCOM guidelines RE privacy content: https://review.docs.microsoft.com/help/contribute/contribute-get-started-channel-guidance?branch=master

Azure Communication Services is committed to helping our customers meet their privacy and personal data requirements, including the European Union's General Data Protection Regulation (GDPR).

GDPR requires that data subjects – humans using your application – have the ability to view, export, and in some cases, edit or delete the data which has been collected about them. GDPR uses the concept of data *controllers* and data *processors* to lay out data handling requirements. Generally speaking, a controller is the entity which has an agreement or contract with the data subject to enable the collection of the data (usually in exchange for performing a service) while a processor has an agreement with a controller to process that data on their behalf. 

As a developer using Communication Services has a direct relationship with humans using the application, you are likely a controller of their data. Since Azure Communication Services is storing this data on your behalf, we are most likely a processor of this data. This page summarizes how the service retains data and how you can identify, export, and delete this data.

## Data residency

When creating an Communication Services resource, you specify a **geography** (not an Azure data center). All data stored by Communication Services at rest will be retained in that geography, in a data center selected internally by Communication Services. However data may transit or be processed in other geographies, these global endpoints are necessary to provide a performant experience to end-users no matter their location.

**TODO TBD LINK TO CURRENT GEOGRAPHIES**

## Relating humans to Azure Communication Services identities

Your application manages the relationship between human users and Communication Service identities. When you want to delete data for a human user, you must delete data involving all Communication Service identities correlated for the user.

There are two categories of Communication Service data:
1. **API Data.** This data is created and managed by Communication Service APIs, a typical example being Chat messages managed through Chat APIs.
2. **Azure Monitor Logs** This data is created by the service and managed through the Azure Monitor data platform. This data includes telemetry and metrics to help you understand your Communication Services usage.

## API data

### Identities, authentication, token management

Azure Communication Services maintains a directory of identities. Use these APIs to retrieve identities and delete them
- `DeleteIdentity`

### Azure Resource Manager

Using the Azure portal or Azure Resource Manager APIs can create personal data. [Use this page to learn how to manage personal data in Azure Resource Manager systems.](https://docs.microsoft.com/azure/azure-resource-manager/management/resource-manager-personal-data)

### Telephone number management

Azure Communication Services maintains a directory of phone numbers associated with a Communication Services resource. Use these APIs to retrieve phone numbers and delete them:
- `Release Phone Number`

### Chat

Chat threads and messages are retained. Idle threads are automatically deleted after 30 days.

- `Get Thread`
- `Get Message`
- `Delete Thread`
- `Delete Message`

### SMS

Sent and received SMS messages are ephemerally processed by the service and not retained. You may configure forwarding to Azure EventGrid and from there to a persistent data store.

From Opt-Out Handling perspective, Communication Services may retain the opt-out data for your application until the phone number or resource is active.
- Opt-Out data is data about the recipient phone numbers that opted out of campaigns associated with your phone number(s). This data will be stored as a ToNumber - FromNumber pair and will be checked against at run time to ensure no further messages are sent to the recipients who opted out thereby complying with TCPA(Telephone Consumer Protection Act) regulations. It is required that you respect these opt-outs and ensure no further messages are sent to the recipients who have opted out by replying STOP.

### PSTN voice calling

Audio and video communication is ephemerally processed by the service and no data is retained in your resource other than Azure Monitor logs.

**Information about CDR and Azure Monitor**

### Internet voice and video calling

Audio and video communication is ephemerally processed by the service and no data is retained in your resource other than Azure Monitor logs.

## Azure Monitor and Log Analytics

Azure Communication Services will feed into Azure Monitor logging data for understanding operational health and utilization of the service. Some of these logs include Communication Service identities and phone numbers as field data.

The list of log analytics produced by Azure Communication Services is [TBD link]. To delete any potentially personal data [use these procedures for Azure Monitor](https://docs.microsoft.com/azure/azure-monitor/platform/personal-data-mgmt). You may also want to configure [the default retention period for Azure Monitor](https://docs.microsoft.com/azure/azure-monitor/platform/manage-cost-storage).

## Additional resources

- [Azure Data Subject Requests for the GDPR and CCPA](https://docs.microsoft.com/microsoft-365/compliance/gdpr-dsr-azure?view=o365-worldwide)
- [Microsoft Trust Center](https://www.microsoft.com/trust-center/privacy/data-location)
- [Azure Interactive Map - Where is my customer data?](https://azuredatacentermap.azurewebsites.net/)
