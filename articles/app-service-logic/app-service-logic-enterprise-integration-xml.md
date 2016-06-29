<properties 
	pageTitle="Overview of Enterprise Integration Pack | Microsoft Azure App Service" 
	description="Use the features of Enterprise Integration Pack to enable business process and integration scenarios using Microsoft Azure App service" 
	services="app-service\logic" 
	documentationCenter=".net,nodejs,java"
	authors="msftman" 
	manager="erickre" 
	editor="cgronlun"/>

<tags 
	ms.service="app-service-logic" 
	ms.workload="integration" 
	ms.tgt_pltfrm="na" 
	ms.devlang="na" 
	ms.topic="article" 
	ms.date="06/29/2016" 
	ms.author="deonhe"/>

# Enterprise integration with XML

Use the Enterprise Integration XML validator connector in your Logic apps to validate XML data against predefined XML schemas. Validation can be done using existing schemas or by generating schemas based on a flat file instance, JSON instance, or from existing connectors.

## How to use the Enterprise Integration XML validator
To use the Enterprise Integration XML Validator, first create a Logic app. todo: any other steps?

## How to configure the validator
You configure the validator using schemas that you uploaded to your [integration account](./app-service-logic-enterprise-integration-accounts.md)

Follow these steps to configure your validator to use a schema from your integration account:

### Prerequiste
- At least one schema in your integration account
- todo:

Now that you have the prerequistes in place, let's configure the validator:
1. todo: 


### What's the output from the validator
The validator returns the output as an object. The output contains the model that represents the response from the XML Validator. It consists of the result, schema name, root node, and error description.

## Next steps
- [Lean more about agreements](./app-service-logic-enterprise-integration-agreements.md "Learn about enterprise integration agreements")  