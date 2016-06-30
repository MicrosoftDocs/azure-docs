<properties 
	pageTitle="Overview of Enterprise Integration Pack | Microsoft Azure App Service" 
	description="Use the features of Enterprise Integration Pack to enable business process and integration scenarios using Microsoft Azure App service" 
	services="app-service\logic" 
	documentationCenter=".net,nodejs,java"
	authors="msftman" 
	manager="erikre" 
	editor="cgronlun"/>

<tags 
	ms.service="app-service-logic" 
	ms.workload="integration" 
	ms.tgt_pltfrm="na" 
	ms.devlang="na" 
	ms.topic="article" 
	ms.date="06/29/2016" 
	ms.author="deonhe"/>

# Enterprise integration with XML transforms

## Overview
The Enterprise integration Transform connector converts data from one format to another format. For example, you may have an incoming message that contains the current date in the YearMonthDay format. You can use a transform to reformat the date to be in the MonthDayYear format.

## What does a transform do?
A Transform, which is also known as a map, consists of a Source XML schema (the input) and a Target XML schema (the output). You can use different built-in functions to help manipulate or control the data, including string manipulations, conditional assignments, arithmetic expressions, date time formatters, and even looping constructs.

## How to create a transform?
You can create transform by using Visual Studio using the [Enterprise Integration SDK](https://aka.ms/vsmapsandschemas). When you are finished creating and testing the map, you upload the transform into your integration account.

## Features and use cases

- The transformation created in a map can be simple, such as copying a name and address from one document to another. Or, you can create more complex transformations using the out-of-the-box map operations.  
- Multiple map operations or functions are readily available, including strings, date time functions, and so on.  
- You can do a direct data copy between the schemas. In the Mapper included in the SDK, this is as simple as drawing a line that connects the elements in the source schema with their counterparts in the destination schema.  
- When creating a map, you view a graphical representation of the map, which show all the relationships and links you create.
- Use the Test Map feature to add a sample XML message. With a simple click, you can test the map you created, and see the generated output.  
- Upload existing Azure BizTalk Service maps (.trfm) and use all the benefits of the Transform API App.  
- When you create the map, you don't need to add a schema. When your map is ready, add it to the Transform API App and you're ready to go.  
- Includes support for the XML format.


## Learn more
- [Lean more about the Enterprise Integration Pack](./app-service-logic-enterprise-integration-overview.md "Learn about Enterprise Integration Pack")  
 