---
title: Administration and Development Task List in BizTalk Services | Microsoft Docs
description: Planning and job aid for deploying Azure BizTalk Services.
services: biztalk-services
documentationcenter: ''
author: msftman
manager: erikre
editor: ''

ms.assetid: 0ab70b5b-1a88-4ba5-b329-ec51b785010e
ms.service: biztalk-services
ms.workload: integration
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 08/15/2016
ms.author: deonhe

---
# Administration and Development Task List in BizTalk Services

> [!INCLUDE [BizTalk Services is being retired, and replaced with Azure Logic Apps](../../includes/biztalk-services-retirement.md)]
> 
> [!INCLUDE [Use APIs to manage MABS](../../includes/biztalk-services-retirement-azure-classic-portal.md)]

## Getting Started
When working with Microsoft Azure BizTalk Services, there are several on-premises and cloud-based components to consider. To get started, consider the following process flow:  

| Step | Who's responsible | Task | Related Links |
| --- | --- | --- | --- |
| 1. |Administrator |Create the Microsoft Azure Subscription using a Microsoft account or an Organizational account |[Azure portal](https://portal.azure.com) |
| 2. |Administrator |Create or provision a BizTalk Service. |[Create a BizTalk Service](/previous-versions/azure/reference/dn232347(v=azure.100)) |
| 3. |Administrator |Register you or your company’s BizTalk Services deployment |[Registering and Updating a BizTalk Service Deployment on the BizTalk Services Portal](/previous-versions/azure/hh689837(v=azure.100)) |
| 4. |Administrator |Applies if the application uses BizTalk Adapter Service to connect to an on-premises Line-of-Business (LOB) system or uses a Queue or Topic Destination.  Create the Azure Service Bus Namespace. Give this namespace, Service Bus Issuer Name, and Service Bus Issuer Key values to the developer. |[How to: Create or Modify a Service Bus Service Namespace](../service-bus-messaging/service-bus-dotnet-get-started-with-queues.md) and [Get Issuer Name and Issuer Key values](biztalk-issuer-name-issuer-key.md) |
| 5. |Developer |Install the SDK and create the BizTalk Service project in Visual Studio. |[Install Azure BizTalk Services SDK](/previous-versions/azure/hh689760(v=azure.100)) and [Create Rich Messaging Endpoints on Azure](/previous-versions/azure/hh689766(v=azure.100)) |
| 6. |Developer |Deploy your BizTalk Service project to your BizTalk Service hosted on Azure. |[Deploying and Refreshing the BizTalk Services Project](/previous-versions/azure/hh689881(v=azure.100)) |
| 7. |Administrator |Applies if you are using EDI.  You can add Partners and create Agreements on the Microsoft Azure BizTalk Services Portal. When you create an Agreement, you can add the bridge and/or Transforms created by the developer to the Agreement settings. |[Configuring EDI, AS2, and EDIFACT on BizTalk Services Portal](/previous-versions/azure/hh689853(v=azure.100)) |
| 8. |Administrator |Using [REST](/previous-versions/azure/reference/dn232347(v=azure.100)), monitor the health of your BizTalk Service, including performance metrics. |[BizTalk Services: Dashboard, Monitor and Scale tabs](https://go.microsoft.com/fwlink/p/?LinkID=302281) |
| 9. |Administrator |Using the Microsoft Azure BizTalk Services Portal, manage the artifacts used by BizTalk Services, and track messages as they are processed by the bridge files. |[Using the BizTalk Services Portal](/previous-versions/azure/dn874043(v=azure.100)) |
| 10. |Administrator |Create a backup plan to back up the BizTalk Service. |[Business Continuity and Disaster Recovery in BizTalk Services](/previous-versions/azure/dn509557(v=azure.100)) |

## Next Steps
[Tutorials and Samples](/previous-versions/azure/hh689895(v=azure.100))

[Create the project in Visual Studio](/previous-versions/azure/hh689811(v=azure.100))

[Install Azure BizTalk Services SDK](/previous-versions/azure/hh689760(v=azure.100))

## Concepts
[Create the project in Visual Studio](/previous-versions/azure/hh689811(v=azure.100))  
[EDI, AS2, and EDIFACT Messaging (Business to Business)](/previous-versions/azure/hh689898(v=azure.100))  

## Other Resources
[Add Source, Destination, and Bridge Messaging Endpoints](/previous-versions/azure/hh689877(v=azure.100))  
[Learn and create Message Maps and Transforms](/previous-versions/azure/hh689905(v=azure.100))  
[Using the BizTalk Adapter Service (BAS)](/previous-versions/azure/hh689889(v=azure.100))  
[Azure BizTalk Services](https://go.microsoft.com/fwlink/p/?LinkID=303664)

