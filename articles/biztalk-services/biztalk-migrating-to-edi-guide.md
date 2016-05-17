<properties   
	pageTitle="Migrating BizTalk Server EDI Solutions to BizTalk Services Technical Guide | Microsoft Azure"
	description="Migrate EDI to MABS; Microsoft Azure BizTalk Services"
	services="biztalk-services"
	documentationCenter="na"
	authors="MandiOhlinger"
	manager="erikre"
	editor=""/>

<tags 
	ms.service="biztalk-services"
	ms.workload="integration"
	ms.tgt_pltfrm="na"
	ms.devlang="na"
	ms.topic="article"
	ms.date="05/16/2016"
	ms.author="mandia"/>


# Migrating BizTalk Server EDI Solutions to BizTalk Services: Technical Guide

Author: Tim Wieman and Nitin Mehrotra

Reviewers: Karthik Bharthy

Written using:  Microsoft Azure BizTalk Services – February 2014 release.

## Introduction

Electronic Data Interchange (EDI) is one of the most prevalent means by which businesses exchange data electronically, also termed as Business-to-Business or B2B transactions. BizTalk Server has had EDI support for over a decade, since the initial BizTalk Sever release. With BizTalk Services, Microsoft continues the support for EDI solutions on the Microsoft Azure platform. B2B transactions are mostly external to an organization, and hence it’s easier to implement if it was implemented on a cloud platform. Microsoft Azure provides this capability through BizTalk Services.

While some customers look at BizTalk Services as a "greenfield" platform for new EDI solutions, many customers have current BizTalk Server EDI solutions that they may want to migrate to Azure. Because BizTalk Services EDI is architected based on the same key entities as BizTalk Server EDI architecture (trading partners, entities, agreements), it is possible to migrate BizTalk Server EDI artifacts to BizTalk Services.

This document discusses some of the differences involved with migrating BizTalk Server EDI artifacts to BizTalk Services. This document assumes a working knowledge of BizTalk Server EDI processing and Trading Partner Agreements. For more information on BizTalk Server EDI, see [Trading Partner Management Using BizTalk Server](https://msdn.microsoft.com/library/bb259970.aspx).

## Which version of BizTalk Server EDI artifacts can be migrated to BizTalk Services?

The BizTalk Server EDI module was significantly enhanced for BizTalk Server 2010, when it was remodeled to include partners, profiles, and agreements. BizTalk Services uses the same model to organize the trading partners and the business divisions within those trading partners. As a result, migrating EDI artifacts from BizTalk Server 2010 and later versions to BizTalk Services, is a much more straight forward process. To migrate EDI artifacts associated with versions prior to BizTalk Server 2010, you must first upgrade to BizTalk Server 2010 and then migrate your EDI artifacts to BizTalk Services.

## Scenarios/Message Flow

As with BizTalk Server, EDI processing in BizTalk Services is built around a Trading Partner Management (TPM) solution. The TPM solution has the following key components:

- Trading partners, which represent organization in a B2B transaction.
- Profiles, which represent divisions within a trading partner.
- Trading partner agreements (or agreements), which represent the business agreement between two partners/profiles.

The following illustration depicts the similarities, as well as differences, between a BizTalk Server EDI solution and BizTalk Services EDI solution:

![][EDImessageflow]

The key differences, and similarities, between an EDI solution flow in BizTalk Server and BizTalk Services are:

- Just like BizTalk Server uses an EDIReceive pipeline to receive an EDI message and an EDISend pipeline to send an EDI message, BizTalk Services uses an EDI Receive bridge to receive and EDI Send bridge to send out EDI messages. In BizTalk Server, the pipelines are associated with an agreement by using send or receive ports. In BizTalk Services, the agreement itself denotes the send or receive bridge.
- In BizTalk Server, after the EDIReceive pipeline processes the EDI message, the message is dumped to a SQL Server database. The EdiSend pipeline then picks up the message from the SQL Server database, processes it, and then sends it out to the trading partner.

	In BizTalk Services, after the EDI receive bridge processes the EDI message, it routes the message to an external process. The external process could be running on Microsoft Azure or on-premises. The external process should route the message to the EDI send bridge; the send bridge does not inherently pull the message. After processing the message, the EDI send bridge routes the message to the trading partner.

BizTalk Services provides an easy-to-use configuration experience to quickly create and deploy a B2B agreement between trading partners without configuring any Microsoft Azure Compute instances (Web or Worker roles), any Microsoft Azure SQL Databases, or any Microsoft Azure storage accounts. More complex scenarios will require tying in workflows or other service processing "around the edges" of a Trading Partner agreement, that is, before or after Trading Partner Agreement EDI bridge processing. In detail, the following sequences of events occur during an EDI message processing in BizTalk Services.

1. An EDI message is received from trading partner, Fabrikam.  For receiving EDI messages from trading partners, BizTalk Services supports transport protocols such as FTP, SFTP, AS2, and HTTP/S.

2. The trading partner agreement receive-side processing disassembles the EDI message to XML format.  You can route the disassembled EDI message (in XML format) to Service Bus endpoints such as a Service Bus Relay endpoint, Service Bus Topic, Service Bus Queue, or a BizTalk Services bridge.

3. The disassembled XML messages could then be received from the endpoint for further custom processing.  These endpoints could be processed by an on-premises component or a Microsoft Azure Compute instance to further process the message in a Windows Workflow (WF) or Windows Communication Foundation (WCF) service, for example.

4. The "send-side processing" of the trading partner agreement then assembles the XML message into EDI format and sends it to trading partner, Contoso.  For sending EDI messages to trading partners, BizTalk Services supports the same protocols as those used for receiving EDI messages.

This document further provides conceptual guidance on migrating some of the different BizTalk Server EDI artifacts to BizTalk Services.

## Send/Receive Ports to Trading Partners

In BizTalk Server you set up Receive Locations and Receive Ports to receive EDI/XML messages from trading partners, and you set up Send Ports to send EDI/XML messages to trading partner. You then tie up these ports to a trading partner agreement using the BizTalk Server Administration console. In BizTalk Services, the locations where you receive messages from trading partners and where you send messages to trading partners are configured as part of the trading partner agreement itself (as part of Transport Settings) in the BizTalk Services Portal.  So you do not really have the concept of "send ports" and "receive locations", per se, in BizTalk Services. For more information, see [Creating Agreements](https://msdn.microsoft.com/library/windowsazure/hh689908.aspx).

## Pipelines (Bridges)

In BizTalk Server EDI, pipelines are message processing entities that can also include custom logic for specific processing capabilities, as required by the application. For BizTalk Services, the equivalent would an EDI bridge. However in BizTalk Services, for now, the EDI bridges are "closed".  That is, you cannot add your own custom activities to an EDI bridge. Any custom processing must be done outside the EDI bridge in your application, either before or after the message enters the bridge configured as part of the Trading Partner agreement. EAI bridges have the option to do custom processing. If you want custom processing, you can use EAI bridges before or after the message is processed by the EDI bridge. For more information, see [How to Include Custom Code in Bridges](https://msdn.microsoft.com/library/azure/dn232389.aspx).

You can insert a publish/subscribe flow with custom code and/or using Service Bus messaging Queues and Topics before the trading partner agreement receives the message, or after the agreement processes the message and routes it to a Service Bus endpoint.

See **Scenarios/Message Flow** in this topic for the message flow pattern.

## Agreements

If you are familiar with the BizTalk Server 2010 Trading Partner Agreements used for EDI processing, then BizTalk Services trading partner agreements look very familiar. Most of the agreement settings are the same and use the same terminology. In some cases, the agreement settings are much simpler compared to the same settings in BizTalk Server. Microsoft Azure BizTalk Services supports X12, EDIFACT, and AS2 transport.

Microsoft Azure BizTalk Services also provides a **TPM Data Migration** tool to migrate trading partners and agreements from BizTalk Server Trading Partner module to BizTalk Services Portal. The TPM Data Migration tool is available as part of a Tools package, which can be downloaded from the [MABS SDK](http://go.microsoft.com/fwlink/p/?LinkId=235057). The package also includes a readme that provides instructions on how to use the tool, and basic troubleshooting information for the tool.

## Schemas

BizTalk Services provides EDI schemas which can be used in BizTalk Services solutions.  In addition, BizTalk Server EDI schemas can also be used with BizTalk Services because the root node of the EDI schema is same across BizTalk Server as well as BizTalk Services. Thus, you will be able to directly take your BizTalk Server EDI schemas and use them in the EDI solutions that you develop using BizTalk Services. You can also download the schemas from the [MABS SDK](http://go.microsoft.com/fwlink/p/?LinkId=235057).

## Maps (Transforms)

Maps in BizTalk Server are called Transforms in BizTalk Services. Migrating maps from BizTalk Server to BizTalk Services could be one of the more complex tasks to achieve (depending on map complexity). The mapping tool used for BizTalk Services is different from the BizTalk mapper. Even though the mapper looks mostly the same, the underlying map format is different. The functoids (called **Map Operations** in BizTalk Services) available to the users are different as well.  In effect, you cannot directly use a BizTalk map in BizTalk Services. Also, not all the functoids available in BizTalk Server are available as map operations in BizTalk Services.

### New Transform Operations

While the list of Transform map operations available may seem quite different from the BizTalk Server mapper, BizTalk Services Transforms have new ways of accomplishing the same tasks. For example, BizTalk Services Transforms have **List Operations** available. This was not available in the BizTalk mapper.  The **List Operations** enable you to create and operate on a "List", where a list is a set of items (also known as "rows") and where each item can have multiple members (also known as "columns").  You can sort the list, select items based on a condition, etc.

Another example of new functionality in BizTalk Services Transforms are the **Loop Operations**.  It is difficult to create nested loops in the BizTalk Server mapper.  Thus, the Loop map operations are added for the BizTalk Services Transforms.

Yet another example is the **If-Then-Else** Expression map operation.  Doing an if-then-else operation was possible in the BizTalk mapper, but it required multiple functoids to accomplish a seemingly simple task.

### Migrating BizTalk Server Maps

Microsoft Azure BizTalk Services provides a tool to migrate BizTalk Server maps to BizTalk Services transforms. The **BTMMigrationTool** is available as part of the **Tools** package provided with the [BizTalk Services SDK download](http://go.microsoft.com/fwlink/p/?LinkId=235057). For more information about the tool, see [Convert a BizTalk map to a BizTalk Services Transform](https://msdn.microsoft.com/library/windowsazure/hh949812.aspx).

You can also look at a sample by Sandro Pereira, BizTalk MVP, on how to [migrate BizTalk Server maps to BizTalk Services transforms](http://social.technet.microsoft.com/wiki/contents/articles/23220.migrating-biztalk-server-maps-to-windows-azure-biztalk-services-wabs-maps.aspx).

## Orchestrations

If you need to migrate BizTalk Server orchestration processing to Microsoft Azure, the orchestrations would need to be rewritten because Microsoft Azure does not support running BizTalk Server orchestrations.  You could rewrite the orchestration functionality in a Windows Workflow Foundation 4.0 (WF4) service.  This would be a complete rewrite as there is currently no migration from BizTalk Server orchestrations to WF4. Here are some resources for Windows Workflow:

- [*How to integrate a WCF Workflow Service with Service Bus Queues and Topics*](https://msdn.microsoft.com/library/azure/hh709041.aspx) by Paolo Salvatori. 

- [*Building apps with Windows Workflow Foundation and Azure* session](http://go.microsoft.com/fwlink/p/?LinkId=237314) from the Build 2011 conference.

- [*Windows Workflow Foundation Developer Center*](http://go.microsoft.com/fwlink/p/?LinkId=237315) on MSDN.

- [*Windows Workflow Foundation 4 (WF4) documentation*](https://msdn.microsoft.com/library/dd489441.aspx) on MSDN.

## Other Considerations

Following are a few considerations that you must make while using BizTalk Services.

### Fallback Agreements

BizTalk Server EDI processing has the concept of "Fallback Agreements".  BizTalk Services does **not** have a Fallback Agreement concept so far.  See BizTalk documentation topics [The Role of Agreements in EDI Processing](http://go.microsoft.com/fwlink/p/?LinkId=237317) and [Configuring Global or Fallback Agreement Properties](https://msdn.microsoft.com/library/bb245981.aspx) for information on how Fallback Agreements are used in BizTalk Server.

### Routing to multiple destinations

BizTalk Services bridges, in its current state does not support routing messages to multiple destinations using a publish-subscribe model. Instead you could route messages from a BizTalk Services bridge to a Service Bus topic, which can then have multiple subscriptions to receive the message at more than one endpoint.

## Conclusion

Microsoft Azure BizTalk Services is updated at regular milestones to add more features and capabilities. With each update, we look forward to supporting increased functionality to facilitate creating end-to-end solutions using BizTalk Services and other Azure technologies.

## See Also

[Developing Enterprise Applications with Azure](https://msdn.microsoft.com/library/azure/hh674490.aspx)

[EDImessageflow]: ./media/biztalk-migrating-to-edi-guide/IC719455.png
