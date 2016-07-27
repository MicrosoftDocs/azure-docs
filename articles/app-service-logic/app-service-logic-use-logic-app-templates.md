<properties
 pageTitle="Use Logic app templates in Azure App Service | Microsoft Azure"
 description="Learn how to use pre-created Logic app templates to help you get started"
 authors="kevinlam1"
 manager="dwrede"
 editor=""
 services="app-service\logic"
 documentationCenter=""/>

<tags
	ms.service="logic-apps"
	ms.workload="integration"
	ms.tgt_pltfrm="na"
	ms.devlang="na"
	ms.topic="article"
	ms.date="05/31/2016"
	ms.author="klam"/>

# Use Logic app templates

>[AZURE.NOTE] This version of the article applies to logic apps 2014-12-01-preview schema version.

Logic app Templates are a set of curated pre-built Logic apps to help you quickly get started building your own integration applications.

These templates show how to use some of the many connectors available in the marketplace as well as being a good way to discover various patterns that can be built using Logic apps.  You can either use these templates as-is or modify them to fit your scenario.

To get started using a Logic app Template, go to the Marketplace, search for "Logic app Template", and then choose one of the Logic app templates from the curated list. Or when a new Logic app is created, select "Triggers and actions", and pick from the set of Logic app Templates on the designer.

## Sample templates available

### SaaS and cloud templates
Examples of how to integrate across different SaaS connectors.  Here you can find various examples integrating Salesforce, Box, SharePoint and other services.

### BizTalk templates
Configurations of BizTalk VETR (validate, extract, transform, route) pipelines as well as EDIFACT, X12 and AS2 message handling.

### Message routing templates
Patterns for doing messaging routing including synchronous request-response, routing messages across different protocols and content based routing.

### DevOps templates
Automated processes for handling common Azure procedures that you may typically run manually or had to write custom code for.  There are templates that cover how to do recurring processes such as restarting a VMs every weekend or getting notified when a new RBAC user has been added to a resource.

### Consumer cloud templates
Simple templates that integrate with social media services such as Twitter, Yammer, and email.  These can be great personal productivity applications that constantly listen for updates and takes action when new items arrive.

After selecting one of the templates, complete the deployment as if you created your own Logic app. The details steps are at [Create a Logic app](app-service-logic-create-a-logic-app.md).
 
