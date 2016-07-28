<properties
	pageTitle="Learn to encode or decode flat files using the Enterprise Integration Pack and Logic apps| Microsoft Azure App Service | Microsoft Azure"
	description="Use the features of Enterprise Integration Pack and Logic apps to encode or decode flat files"
	services="app-service\logic"
	documentationCenter=".net,nodejs,java"
	authors="msftman"
	manager="erikre"
	editor="cgronlun"/>

<<<<<<< HEAD
<tags 
	ms.service="logic-apps" 
	ms.workload="integration" 
	ms.tgt_pltfrm="na" 
	ms.devlang="na" 
	ms.topic="article" 
	ms.date="07/08/2016" 
	ms.author="deonhe"/>

# Enterprise integration with flat files

## Overview

You may want to encode XML content before you send it to a business partner in a business-to-business (B2B) scenario. In a logic app made by the Logic Apps feature of the Azure App Service, you can use the flat file encoding connector to do this. The logic app that you create can get its XML content from a variety of sources, including from an HTTP request trigger, from another application, or even from one of the many [connectors](../connectors/apis-list.md). For more information about logic apps, see the [logic apps documentation](./app-service-logic-what-are-logic-apps.md "Learn more about Logic apps").  

## How to create the flat file encoding connector

Follow these steps to add a flat file encoding connector to your logic app.

1. Create a logic app and [link it to your integration account](./app-service-logic-enterprise-integration-accounts.md "Learn to link an integration account to a Logic app"). This account contains the schema you will use to encode the XML data.  
2. Add a **Request - When an HTTP request is received** trigger to your logic app.  
![Screenshot of trigger to select](./media/app-service-logic-enterprise-integration-flatfile/flatfile-1.png)    
3. Add the flat file encoding action, as follows:

    a. Select the **plus** sign.

	b. Select the **Add an action** link (appears after you have selected the plus sign).

	c. In the search box, enter *Flat* to filter all the actions to the one that you want to use.

	d. Select the **Flat File Encoding** option from the list.   
![Screenshot of Flat File Encoding option](./media/app-service-logic-enterprise-integration-flatfile/flatfile-2.png)   
4. On the **Flat File Encoding** dialog box, select the **Content** text box.  
![Screenshot of Content text box](./media/app-service-logic-enterprise-integration-flatfile/flatfile-3.png)  
5. Select the body tag as the content that you want to encode. The body tag will populate the content field.     
![Screenshot of body tag](./media/app-service-logic-enterprise-integration-flatfile/flatfile-4.png)  
6. Select the **Schema Name** list box, and choose the schema you want to use to encode the input content.    
![Screenshot of Schema Name list box](./media/app-service-logic-enterprise-integration-flatfile/flatfile-5.png)  
7. Save your work.   
![Screenshot of Save icon](./media/app-service-logic-enterprise-integration-flatfile/flatfile-6.png)  

At this point, you are finished setting up your flat file encoding connector. In a real world application, you may want to store the encoded data in a line-of-business application, such as Salesforce. Or you can send that encoded data to a trading partner. You can easily add an action to send the output of the encoding action to Salesforce, or to your trading partner, by using any one of the other connectors provided.

You can now test your connector by making a request to the HTTP endpoint, and including the XML content in the body of the request.  

## How to create the flat file decoding connector

>[AZURE.NOTE] To complete these steps, you need to have a schema file already uploaded into you integration account.

1. Add a **Request - When an HTTP request is received** trigger to your logic app.  
![Screenshot of trigger to select](./media/app-service-logic-enterprise-integration-flatfile/flatfile-1.png)    
2. Add the flat file decoding action, as follows:

    a. Select the **plus** sign.

	b. Select the **Add an action** link (appears after you have selected the plus sign).

	c. In the search box, enter *Flat* to filter all the actions to the one that you want to use.

	d. Select the **Flat File Decoding** option from the list.   
![Screenshot of Flat File Decoding option](./media/app-service-logic-enterprise-integration-flatfile/flatfile-2.png)   
- Select the **Content** control. This produces a list of the content from earlier steps that you can use as the content to decode. Notice that the *Body* from the incoming HTTP request is available to be used as the content to decode. You can also enter the content to decode directly into the **Content** control.     
- Select the *Body* tag. Notice the body tag is now in the **Content** control.
- Select the name of the schema that you want to use to decode the content. The following screenshot shows that *OrderFile* is the selected schema name. This schema name had been uploaded into the integration account previously.

 ![Screenshot of Flat File Decoding dialog box](./media/app-service-logic-enterprise-integration-flatfile/flatfile-decode-1.png)    
- Save your work.  
![Screenshot of Save icon](./media/app-service-logic-enterprise-integration-flatfile/flatfile-6.png)    

At this point, you are finished setting up your flat file decoding connector. In a real world application, you may want to store the decoded data in a line-of-business application such as Salesforce. You can easily add an action to send the output of the decoding action to Salesforce.

You can now test your connector by making a request to the HTTP endpoint and including the XML content you want to decode in the body of the request.  

## Next steps
- [Learn more about the Enterprise Integration Pack](./app-service-logic-enterprise-integration-overview.md "Learn about Enterprise Integration Pack").  
