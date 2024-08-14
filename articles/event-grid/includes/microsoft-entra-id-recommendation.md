---
 title: Recommendation to use Microsoft Entra ID authentication
 description: This include file has an important note that recommends customers to use Microsoft Entra ID authentication in production environments. 
 author: spelluru
 ms.service: azure-event-grid
 ms.topic: include
 ms.date: 08/14/2024
 ms.author: spelluru
 ms.custom: include file
---


> [!IMPORTANT]
> We use connection string to authenticate to Azure Event Hubs namespace to keep the tutorial simple. We recommend that you use Microsoft Entra ID authentication in production environments. When using an application, you can enable managed identity for the application and assign an appropriate role (Azure Event Hubs Owner, Azure Event Hubs Data Sender, or Azure Event Hubs Data Receiver) on the Event Hubs namespace. For more information, see [Authorize access to Event Hubs using Microsoft Entra ID](authorize-access-azure-active-directory.md).

