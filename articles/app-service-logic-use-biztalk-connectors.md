<properties 
   pageTitle="Using connectors" 
   description="Using connectors" 
   services="app-service\logic" 
   documentationCenter=".net,nodejs,java" 
   authors="prkumar" 
   manager="dwrede" 
   editor=""/>

<tags
   ms.service="app-service-logic"
   ms.devlang="multiple"
   ms.topic="article"
   ms.tgt_pltfrm="na"
   ms.workload="integration" 
   ms.date="03/20/2015"
   ms.author="prkumar"/>


#Using connectors#

Connectors are API Apps that allow you to connect to services that are running in the cloud or on-premises to get, put data or perform actions. These can be used across Azure App Services, from Web, Mobile and Logic Apps.

Azure App Services provides several connectors out of the box to help you connect to services of your interest, while focusing your efforts on the actual business logic of your application. In addition, the platform is easily extensible by writing your own API apps to connect to your legacy applications.

Some of the key features of BizTalk connectors are :

1. Handle OAuth security for connecting to popular SaaS services (Facebook, Twitter, Office 365, SalesForce)
2. Connectivity to your on-premises assets via a Service Bus Relay.
3. Connectivity for common protocols to receive and send data.

##Connectors and Logic Apps##
Logic Apps are composed of triggers and actions. Some connectors can be used as triggers for identifying if new data is available, and triggering a Logic App with that data as input. Connectors can also be used as an action in the middle of a Logic App to look up data, write data or perform other actions supported by the connector.

###Connectors as Triggers###
Several connectors provide triggers for Logic Apps. These triggers are of two types:

1. Poll Triggers: These triggers will poll your service of interest at a specified frequency to check for new data. When new data is available, a new instance of your Logic App will run with the data as input. The trigger may perform additional tasks like clean-up of the data that has been read and passed on to the Logic App, to prevent the same data from being consumed multiple times. Examples of such connectors are File, SQL and Azure Storage.
2. Push Triggers: These triggers listen for data on an endpoint or for an event to occur and trigger a new instance of a Logic App. Examples of such connectors are HTTP Listener and Twitter.

###Connectors as Actions###
Connectors can also be used as actions as a part of your Logic App. This can be useful for looking up data in the Logic App to be used in the execution, for example, you may need to look up a SQL database for additional information about a customer when processing an order from the customer in a Logic App. Alternatively, you may need to write, update or delete data in a destination, for which you can use the actions provided by the connectors.

##How to use connectors##
The following articles provide examples of how some of the out of box connectors can be used.

* [Using Box connector]
* [Using Facebook connector]
* [Using Salesforce connector]
* [Using Twitter connector]
* [Using SAP connector]
* [Using FTP connector]

For additional details, please refer to the Connector API Reference [http://aka.ms/appservicesconnectorreference](http://aka.ms/appservicesconnectorreference).


<!-- Links -->

[Using Box connector]: app-service-logic-connector-box.md
[Using Facebook connector]: app-service-logic-connector-facebook.md
[Using Salesforce connector]: app-service-logic-connector-salesforce.md
[Using Twitter connector]: app-service-logic-connector-twitter.md
[Using SAP connector]: app-service-logic-connector-sap.md
[Using FTP connector]: app-service-logic-connector-ftp.md


