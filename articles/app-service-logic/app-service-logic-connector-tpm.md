<properties 
   pageTitle="BizTalk Trading Partner Management" 
   description="BizTalk Trading Partner Management" 
   services="app-service\logic" 
   documentationCenter=".net,nodejs,java" 
   authors="rajeshramabathiran" 
   manager="dwrede" 
   editor=""/>

<tags
   ms.service="app-service-logic"
   ms.devlang="multiple"
   ms.topic="article"
   ms.tgt_pltfrm="na"
   ms.workload="integration" 
   ms.date="08/19/2015"
   ms.author="rajram"/>

#BizTalk Trading Partner Management
Microsoft Azure Trading Partner Management (TPM) service lets one define and persist business to business relationships such as partners and agreements along with associated artifacts such as schemas and certificates. These relationships can then be enforced by related API services such as AS2, EDIFACT, and X12.

The TPM API App is the base requirement of the AS2 connector, and the X12 or EDIFACT API Apps.

##Pre-requisites
- Blank SQL Azure database - You have to create a blank SQL Azure database first, before creating a new TPM API App.

##Understanding Partners, Agreements and Profiles
To know more about trading partner agreement, click [here][1]

## Do more with your Connector
Now that the connector is created, you can add it to a business workflow using a Logic App. See [What are Logic Apps?](app-service-logic-what-are-logic-apps.md).

View the Swagger REST API reference at [Connectors and API Apps Reference](http://go.microsoft.com/fwlink/p/?LinkId=529766).

You can also review performance statistics and control security to the connector. See [Manage and Monitor your built-in API Apps and Connectors](app-service-logic-monitor-your-connectors.md).

<!--References-->
[1]: app-service-logic-create-a-trading-partner-agreement.md