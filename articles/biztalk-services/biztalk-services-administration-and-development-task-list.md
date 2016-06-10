<properties
	pageTitle="Administration and Development Task List in BizTalk Services | Microsoft Azure" 
	description="Planning and job aid for deploying Azure BizTalk Services."
	services="biztalk-services"
	documentationCenter=""
	authors="msftman"
	manager="erikre"
	editor=""/>

<tags
	ms.service="biztalk-services"
	ms.workload="integration"
	ms.tgt_pltfrm="na"
	ms.devlang="na"
	ms.topic="article"
	ms.date="02/29/2016"
	ms.author="deonhe"/>

# Administration and Development Task List in BizTalk Services  

## Getting Started
When working with Microsoft Azure BizTalk Services, there are several on-premises and cloud-based components to consider. To get started, consider the following process flow:  

|Step|Who's responsible|Task|Related Links|
|----|----|----|----|
1.|Administrator|Create the Microsoft Azure Subscription using a Microsoft account or an Organizational account|[Azure classic portal](http://go.microsoft.com/fwlink/p/?LinkID=213885)|
|2.|Administrator|Create or provision a BizTalk Service.|[Create a BizTalk Service using Azure classic portal](http://go.microsoft.com/fwlink/p/?LinkID=302280)|
|3.|Administrator|Register you or your company’s BizTalk Services deployment|[Registering and Updating a BizTalk Service Deployment on the BizTalk Services Portal](https://msdn.microsoft.com/library/azure/hh689837.aspx)|
|4.|Administrator|Applies if the application uses BizTalk Adapter Service to connect to an on-premises Line-of-Business (LOB) system or uses a Queue or Topic Destination.  Create the Azure Service Bus Namespace. Give this namespace, Service Bus Issuer Name, and Service Bus Issuer Key values to the developer.|[How to: Create or Modify a Service Bus Service Namespace](../service-bus/service-bus-dotnet-get-started-with-queues.md) and [Get Issuer Name and Issuer Key values](biztalk-issuer-name-issuer-key.md)|
|5.|Developer|Install the SDK and create the BizTalk Service project in Visual Studio.|[Install Azure BizTalk Services SDK](https://msdn.microsoft.com/library/azure/hh689760.aspx) and [Create Rich Messaging Endpoints on Azure](https://msdn.microsoft.com/library/azure/hh689766.aspx)|
|6.|Developer|Deploy your BizTalk Service project to your BizTalk Service hosted on Azure.|[Deploying and Refreshing the BizTalk Services Project](https://msdn.microsoft.com/library/azure/hh689881.aspx)|
|7.|Administrator|Applies if you are using EDI.  You can add Partners and create Agreements on the Microsoft Azure BizTalk Services Portal. When you create an Agreement, you can add the bridge and/or Transforms created by the developer to the Agreement settings.|[Configuring EDI, AS2, and EDIFACT on BizTalk Services Portal](https://msdn.microsoft.com/library/azure/hh689853.aspx)|
|8.|Administrator|Using the Azure classic Portal, monitor the health of your BizTalk Service, including performance metrics.|[BizTalk Services: Dashboard, Monitor and Scale tabs](http://go.microsoft.com/fwlink/p/?LinkID=302281)|
|9.|Administrator|Using the Microsoft Azure BizTalk Services Portal, manage the artifacts used by BizTalk Services, and track messages as they are processed by the bridge files.|[Using the BizTalk Services Portal](https://msdn.microsoft.com/library/azure/dn874043.aspx)|
|10.|Administrator|Create a backup plan to back up the BizTalk Service.|[Business Continuity and Disaster Recovery in BizTalk Services](https://msdn.microsoft.com/library/azure/dn509557.aspx) |  
## Next Steps
[Tutorials and Samples](https://msdn.microsoft.com/library/azure/hh689895.aspx)

[Create the project in Visual Studio](https://msdn.microsoft.com/library/azure/hh689811.aspx)

[Install Azure BizTalk Services SDK](https://msdn.microsoft.com/library/azure/hh689760.aspx)

## Concepts
[Create the project in Visual Studio](https://msdn.microsoft.com/library/azure/hh689811.aspx)  
[EDI, AS2, and EDIFACT Messaging (Business to Business)](https://msdn.microsoft.com/library/azure/hh689898.aspx)  
## Other Resources  
[Add Source, Destination, and Bridge Messaging Endpoints](https://msdn.microsoft.com/library/azure/hh689877.aspx)  
[Learn and create Message Maps and Transforms](https://msdn.microsoft.com/library/azure/hh689905.aspx)  
[Using the BizTalk Adapter Service (BAS)](https://msdn.microsoft.com/library/azure/hh689889.aspx)  
[Azure BizTalk Services](http://go.microsoft.com/fwlink/p/?LinkID=303664)
