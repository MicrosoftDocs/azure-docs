---
author: spelluru
ms.service: azure-service-bus
ms.topic: include
ms.date: 05/12/2025
ms.author: spelluru
---


The following table shows the list of features that are available (or not available) in a specific tier of Azure Service Bus. 

| Feature | Basic | Standard | Premium | 
| ------- | ----- | -------- | ------- |
| Queues | &check; | &check; | &check; | 
| Scheduled messages | &check; | &check; | &check; | 
| Topics | &nbsp; | &check; | &check; | 
| Transactions | &nbsp; | &check; | &check; | 
| De-duplication | &nbsp; | &check; | &check; | 
| Sessions | &nbsp; | &check; | &check; |
| ForwardTo/SendVia | &nbsp; | &check; | &check; | 
| Resource isolation | &nbsp; | &nbsp; | &check; | 
| Geo-disaster recovery (Geo-DR) | &nbsp; | &nbsp; | &check; <br/>*Requires additional premium namespaces in another region| 
| Java Messaging Service (JMS) 2.0 support | &nbsp; | &nbsp; | &check; | 
| Availability Zones (AZ) support | &check; | &check; | &check; | 




