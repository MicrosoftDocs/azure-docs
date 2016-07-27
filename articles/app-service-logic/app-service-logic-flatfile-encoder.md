<properties 
   pageTitle="Using the BizTalk Flat File Encoder in a logic app| Microsoft Azure" 
   description="BizTalk Flat File Encoder API app or connector" 
   services="app-service\logic" 
   documentationCenter=".net,nodejs,java" 
   authors="rajram" 
   manager="erikre" 
   editor=""/>

<tags
   ms.service="logic-apps" 	
   ms.devlang="multiple"
   ms.topic="article"
   ms.tgt_pltfrm="na"
   ms.workload="integration" 
   ms.date="04/20/2016"
   ms.author="rajram"/>

# BizTalk Flat File Encoder

[AZURE.INCLUDE [app-service-logic-version-message](../../includes/app-service-logic-version-message.md)]

Use the BizTalk Flat File Encoder connector to interop between flat file data (for example, an Excel or CSV file) and XML data. It can convert a given flat file instance to XML and vice versa.

##Using the BizTalk Flat File Encoder
To use the BizTalk Flat File Encoder, you need to first create an instance of the BizTalk Flat File Encoder API app. This can be done either inline while creating a logic app or by selecting the BizTalk Flat File Encoder API app from the Azure Marketplace. Here are the steps to create a BizTalk Flat File Encoder API app from the Azure Marketplace:  
1. Log into the Azure portal (http://portal.azure.com)  
2. Select New > Marketplace > Everything  
3. Search for "BizTalk Flat File Encoder" in the search box  
4. Select BizTalk Flat File Encoder from the list of results  
5. Select "Create" then provide a name and the other required details  
6. Select "Create". You will be redirected to the start page where you can see the creation progress. This may take a while to complete. You will receive a notification when it completes.  

###Configure BizTalk Flat File Encoder
After the API app has been created, you can launch it either directly from the Azure portal start page or from the designer's surface when creating a Logic app. 

To launch it from the Azure start page you can search for it by typing the name you gave to the BizTalk Flat File Encoder when you created it. You do this by:  
1. Entering the name of your BizTalk Flat File Encoder in the search box on the Auzre portal and searching for it  
2. Next, select your BizTalk Flat File Encoder from the list. This opens up the API App blade where you can configure your BizTalk Flat File Encoder API app.  
To start the configuration, you'll want to add a schema by:  
1. Selecting the "Schemas" component  
![BizTalk Flat File Encoder Schemas Part][2]  
2. Then selecting "Add New" on the Schemas blade that opens up  
![BizTalk Flat File Encoder List of actions][7]  
3. Select one of the three options to provide your schema. The options are UPLOAD NEW SCHEMA, GENERATE FROM JSON AND GENERATE FROM FLAT FILE  
![BizTalk Flat File Encoder List of actions][8]  
4. Follow the steps to provide your schema, based on your selection in the previous step. You'll then see the that the schema has been uploaded:  
![BizTalk Flat File Encoder List of actions][9]

###Using the BizTalk Flat File Encoder in design surface
Now that you've configured the Biztalk Flat File Encoder, its time to use it in a Logic app. To get started, either create a new Logic app, our launch an existing one that you've created beforehand then follow these steps:  
1. On the 'Start logic' card, click 'Run this logic manually'.  
2. Select the BizTalk Flat File Encoder API App you created earlier in the gallery (You will find the BizTalk Flat File Encoder you created in the API Apps list on the right of your screen.).  
3. Select the black right arrow. The two available actions (Flat File to Xml and Xml to Flat File) are presented:  
![BizTalk Flat File Encoder List of actions][1] ![BizTalk Flat File Encoder List of actions][4]

Follow the steps below, based on your the action you select.

####Flat File to Xml

![BizTalk Flat File Encoder List of actions][5]

Parameter|Type|Description of the parameter
---|---|---
Flat File|string|Content of the input flat file
Schema Name|string|Name of the schema which represents the input flat file
Root Name|string|Root node name of the flat file schema


The action returns the output as a string - Output Xml. Output Xml contains the xml representation of the input flat file content.

####Xml to Flat File

![BizTalk Flat File Encoder List of actions][6]

Parameter|Type|Description of the parameter
---|---|---
Input Xml|string|Input Xml content

The action returns the output as a string - Flat File. Output contains the flat file representation of the input xml content.

<!-- References -->
[1]: ./media/app-service-logic-flatfile-encoder/FlatFileEncoder.ClickToConfigure.PNG
[2]: ./media/app-service-logic-flatfile-encoder/FlatFileEncoder.SchemasPart.PNG
[3]: ./media/app-service-logic-flatfile-encoder/FlatFileEncoder.SchemaUpload.PNG
[4]: ./media/app-service-logic-flatfile-encoder/FlatFileEncoder.ListOfActions.PNG
[5]: ./media/app-service-logic-flatfile-encoder/FlatFileEncoder.FlatFileToXml.PNG
[6]: ./media/app-service-logic-flatfile-encoder/FlatFileEncoder.XmlToFlatFile.PNG
[7]: ./media/app-service-logic-flatfile-encoder/flatfileencoder.addschema.PNG 
[8]: ./media/app-service-logic-flatfile-encoder/flatfileencoder.selectschemauploadoption.PNG
[9]: ./media/app-service-logic-flatfile-encoder/flatfileencoder.shemauploaded.PNG

 

