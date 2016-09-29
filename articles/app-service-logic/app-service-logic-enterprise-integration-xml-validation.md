<properties 
	pageTitle="Overview of XML validation in the Enterprise Integration Pack | Microsoft Azure App Service | Microsoft Azure" 
	description="Learn how validation works in the Enterprise Integration Pack and Logic apps" 
	services="logic-apps" 
	documentationCenter=".net,nodejs,java"
	authors="msftman" 
	manager="erikre" 
	editor="cgronlun"/>

<tags 
	ms.service="logic-apps" 
	ms.workload="integration" 
	ms.tgt_pltfrm="na" 
	ms.devlang="na" 
	ms.topic="article" 
	ms.date="07/08/2016" 
	ms.author="deonhe"/>

# Enterprise integration with XML validation

## Overview
Often, in B2B scenarios, the partners to an agreement need to validate that messages they exchange among each other are valid before processing of the data can begin. In the Enterprise Integration Pack, you can use the XML Validation connector to validate documents against a predefined schema.  

## How to validate a document with the XML Validation connector
1. Create a Logic app and [link it to your integration account](./app-service-logic-enterprise-integration-accounts.md "Learn to link an integration account to a Logic app") that contains the schema you will use to validate the XML data.
2. Add a **Request - When an HTTP request is received** trigger to your Logic app  
![](./media/app-service-logic-enterprise-integration-xml/xml-1.png)    
3. Add the **XML Validation** action by first selecting **Add an action**  
4. Enter *xml* in the search box in order to filter all the actions to the one that you want to use 
5. Select **XML Validation**     
![](./media/app-service-logic-enterprise-integration-xml/xml-2.png)   
6. Select the **CONTENT** text box  
![](./media/app-service-logic-enterprise-integration-xml/xml-1-5.png)
7. Select the body tag as the content that will be validated.   
![](./media/app-service-logic-enterprise-integration-xml/xml-3.png)  
8. Select the **SCHEMA NAME** list box and chose the schema you want to use to validate the input *content* above     
![](./media/app-service-logic-enterprise-integration-xml/xml-4.png) 
9. Save your work  
![](./media/app-service-logic-enterprise-integration-xml/xml-5.png) 

At this point, you are finished setting up your validation connector. In a real world application, you may want to store the validated data in an LOB application such as SalesForce. You can easily add an action to send the output of the validation to Salesforce. 

You can now test your validation action by making a request to the HTTP endpoint.  

## Next steps

[Learn more about the Enterprise Integration Pack](./app-service-logic-enterprise-integration-overview.md "Learn about Enterprise Integration Pack")   