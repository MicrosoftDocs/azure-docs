<properties
   pageTitle="Using the SharePoint Connector in Logic Apps | Microsoft Azure App Service"
   description="How to create and configure the SharePoint Connector or API app and use it in a logic app in Azure App Service"
   services="app-service\logic"
   documentationCenter=".net,nodejs,java"
   authors="anuragdalmia"
   manager="erikre"
   editor=""/>

<tags
   ms.service="app-service-logic"
   ms.devlang="multiple"
   ms.topic="article"
   ms.tgt_pltfrm="na"
   ms.workload="integration"
   ms.date="03/16/2016"
   ms.author="sameerch"/>

# Get started with the SharePoint Connector and add it to your Logic App
>[AZURE.NOTE] This version of the article applies to logic apps 2014-12-01-preview schema version. For the 2015-08-01-preview schema version on the SharePoint Online API, click [SharePoint API](../connectors/connectors-create-api-sharepointonline.md).

Connect SharePoint Server or SharePoint Online to manage documents and list items. You can perform various actions such as create, update, get, and delete on documents and list items. When using on-premises SharePoint server, you enter the Service Bus Connection String as part of connector configuration and install the on-premises listener agent to connect to the server.

The SharePoint Online Connector and SharePoint Server Connector gallery app provides you Trigger and Actions as mechanisms to interact with SharePoint.

Logic apps can trigger based on a variety of data sources and offer connectors to get and process data as a part of the flow. You can add the SharePoint Connector to your business workflow and process data as part of this workflow within a Logic App. 

## Create a SharePoint Online Connector

A connector can be created within a logic app or be created directly from the Azure Marketplace. To create a connector from the Marketplace:

1. In the Azure startboard, select **Marketplace**.
2. Select **API Apps** and search for “SharePoint Online Connector”.
3. Enter the Name, App Service Plan, and other properties.
4. Enter the following package settings:

	Name | Required | Description
--- | --- | ---
Site URL | Yes | Enter the complete URL of the SharePoint web site. For example, enter: *https://microsoft.sharepoint.com/teams/wabstest*.
Document Library / List Relative URLs | Yes | Enter the document libraries/lists URLs, relative to the SharePoint site URL, that are allowed to be modified by the connector. For example, enter: *Lists/Task, Shared Documents*.

5. When complete, the Package Settings look similar to the following:  
![][1]

Once that’s done, you can now create a logic App in the same resource group to use the SharePoint Online Connector.

## Creating a SharePoint Server Connector

A connector can be created within a logic app or be created directly from the Azure Marketplace. To create a connector from the Marketplace:

1. In the Azure startboard, select **Marketplace**.
2. Select **API Apps** and search for “SharePoint Server Connector”.
3. Enter the Name, App Service Plan, and other properties.
4. Enter the following package settings:

	Name | Required | Description
--- | --- | ---
Site URL | Yes | Enter the complete URL of the SharePoint web site. For example, enter: *https://microsoft.sharepoint.com/teams/wabstest*.
Authentication Mode | Yes | Enter the authentication mode to connect to SharePoint Site. Options include:<ul><li>Default</li><li>WindowsAuthentication</li><li>FormBasedAuthentication</li></ul><br/><br/>If you choose Default, the credentials running the SharePoint Connector are used; Username/Password are not required. Username and Password are required for other authentication types.<br/><br/>**Note** Anonymous authentication is not supported.
User Name | No | Enter a valid user name to connect to SharePoint site, if Authentication mode is not Default.
Password | No | Enter a valid password to connect to SharePoint site, if Authentication mode is not Default.
Document Library / List Relative URLs | Yes | Enter the document libraries/lists URLs, relative to the SharePoint site URL, that are allowed to be modified by the connector. For example, enter: *Lists/Task, Shared Documents*.
Service Bus Connection String | No | If you're connecting to on-premises, enter the Service Bus relay connection string.<br/><br/>[Using the Hybrid Connection Manager](app-service-logic-hybrid-connection-manager.md)<br/>[Service Bus Pricing](https://azure.microsoft.com/pricing/details/service-bus/)

5. When complete, the Package Settings look similar to the following:  
![][2]

Once that’s done, you can now create a logic App in the same resource group to use the SharePoint Server Connector.


## Using the SharePoint Connector in your Logic App

Once your API app is created, you can now use the SharePoint Connector as a trigger or action for your Logic App. To do this, you need to:

1. Create a new Logic App and choose the same resource group that has the SharePoint Connector.

2. Open **Triggers and Actions** to open the Logic Apps Designer and configure your workflow. The SharePoint Connector appears in the “Recently Used” section in the gallery on the right hand side. Select it.

3. If SharePoint connector is selected at the start of the logic app, it acts like trigger. Otherwise, actions could be taken on SharePoint account using the connector.

4. When using the SharePoint Online Connector, you have to authenticate and authorize logic apps to perform operations on your behalf. To start the authorization, click **Authorize** on SharePoint Connector:  
![][3]

5. Clicking Authorize would open SharePoint’s authentication dialog. Enter the sign in details of the SharePoint account on which you want to perform the operations:  
![][4]

6. Grant logic apps access to your account to perform operation on your behalf:  
![][5]

7. If the SharePoint Connector is configured as Trigger, then the triggers are shown. Otherwise, a list of actions is displayed and you can choose appropriate operation that you want to perform:  
![][6]
  
**Relative URL configured for document library**  
![][7]

**Relative URL configured for document list**

> [AZURE.NOTE]For the following triggers, it is assumed that you entered 'Shared Documents, Lists/Task' in the Connector Package settings, where 'Shared Documents' is a document library and 'Lists/Task' is a List. 

##  Triggers
Use triggers if you want to initiate a logic app.

> [AZURE.NOTE] Triggers delete the files after reading them. To preserve these files, please enter a value for the archive location.

### 1.	New Document In Shared Documents (JSON)
This trigger is fired when a new document is available in 'Shared Documents'. 

#### Input

Name | Required | Description
--- | --- | ---
View Name | No | Enter a valid view used to filter documents to be picked. For example, enter: 'Approved Orders'. To process all the existing documents, leave this field empty.
Archive Location | No | Enter a valid folder URL, relative to SharePoint site, where the processed documents are archived.
Overwrite in Archive | No | Check this option to overwrite a file in Archive path if it already exists.
Caml Query | No, Advanced | Enter a valid Caml query to filter documents. For example, enter:  `<Where><Geq><FieldRef Name='ID'/><Value Type='Number'>10</Value></Geq></Where>`

#### Output

Name | Description
--- | ---
Name | Name of the document.
Content | Content of the document.
ContentTransferEncoding | Content Transfer Encoding of the Message. ("none"or ”base64”)

**Note** All the columns of the document item are shown in 'Advanced' output properties.


### 2. New Item In Tasks (JSON)
This trigger is fired when a new item is added in 'Tasks' list.

#### Input

Name | Required | Description
--- | --- | ---
View Name | No | Enter a valid view used to filter items in the list. For example, enter: 'Approved Orders'. To process all the all the new items, leave this field empty.
Archive Location | No | Enter a valid folder URL, relative to SharePoint site, where the processed list items are archived.
Caml Query | No, Advanced | Enter a valid Caml query to filter documents. For example, enter:  `<Where><Geq><FieldRef Name='ID'/><Value Type='Number'>10</Value></Geq></Where>`

#### Output

Name | Description
--- | ---
The columns in the list are dynamically populated and shown in the output parameters. | &nbsp;


### 3. New Document In Shared Documents (XML)

This trigger is fired when a new document is available in 'Shared Documents'. The new document is returned as an XML message.

#### Input

Name | Required | Description
--- | --- | ---
View Name | No | Enter a valid view used to filter documents to be picked. For example, enter: 'Approved Orders'. To process all the all the existing documents, leave this field empty.
Archive Location | No | Enter a valid folder URL, relative to SharePoint site, where the processed list documents are archived.
Overwrite in Archive | No | Check this option to overwrite a file in Archive path if it already exists.
Caml Query | No, Advanced | Enter a valid Caml query to filter documents. For example, enter:  `<Where><Geq><FieldRef Name='ID'/><Value Type='Number'>10</Value></Geq></Where>`

#### Output

Name | Description
--- | ---
Content | Content of the document.
ContentTransferEncoding | Content Transfer Encoding of the Message. ("none"or ”base64”)


### 4. New Item In Tasks (XML)

This trigger is fired when a new item is added in 'Tasks' list. The new list item is returned as an XML message.

#### Input

Name | Required | Description
--- | --- | ---
View Name | No | Enter a valid view used to filter items in the list. Example: 'Approved Orders'. To process all the new items, leave this field empty.
Archive Location | No | Enter a valid folder URL, relative to SharePoint site, where the processed list items are archived.
Caml Query | No, Advanced | Enter a valid Caml query to filter the list items. For example, enter: `<Where><Geq><FieldRef Name='ID'/><Value Type='Number'>10</Value></Geq></Where>`

#### Output

Name | Description
--- | ---
Content | Content of the document.
ContentTransferEncoding | Content Transfer Encoding of the Message. ("none"or ”base64”)


##  Actions
For the following actions, it is assumed that you entered 'Shared Documents, Lists/Task' in Connector Package settings, where 'Shared Documents' is a document library and 'Lists/Task' is a List. 

### 1. Upload To Shared Documents (JSON)

This action uploads new document to 'Shared Documents'. The input is a strongly typed JSON object with all the column fields of the document library.

#### Input

Name | Required | Description
--- | --- | ---
Name | Yes | Name of the document.
Content | Yes | Content of the document.
ContentTransferEncoding | Yes | Content Transfer Encoding of the Message. ("none"or ”base64”)
Force Overwrite | Yes | If set to TRUE and a document exists with the given name, it will be overwritten.
ReqParam1* | Yes | This is one of the required parameters to add a document in the document library.
ReqParam2* | Yes | This is one of the required parameters to add a document in the document library.
OptionalParam1* | No. Advanced | This is one of the optional parameters to add a document in the document library.
OptionalParam2* | No. Advanced | This is one of the optional parameters to add a document in the document library.

**Note** All the parameters of the document library are dynamically populated. The mandatory parameters are visible, where the optional parameters are in advanced section.

#### Output

Name | Description
--- | ---
ItemId | ItemId of the document added in Document library.
Status | A successful upload of document returns status code 200 (OK).


 

### 2. Get From Shared Documents (JSON)
This action gets the document from the document library given the relative URL (folder structure) of the document.

#### Input

Name | Required | Description
--- | --- | ---
Document Relative URI | No | Enter the document URL, relative to 'Shared Documents'. For example, enter: *myspec1,myfolder/orders*.

#### Output

Name | Description
--- | ---
Content | Document Content
ContentTransferEncoding | Content Transfer Encoding of the Message. ("none" or ”base64”)
Status | A successful action execution returns status code 200 (OK).
Param1* | This is one of the parameters of a document in the document library.
Param2* | This is one of the parameters of a document in the document library.

**Note** All the parameters of the document library are dynamically populated. And, they are in advanced section.

 

### 3. Delete From Shared Documents

This action deletes the document from the document library given the relative URL (folder structure) of the document.

#### Input

Name | Required | Description
--- | --- | ---
Document Relative URI | No | Enter the document URL, relative to 'Shared Documents'. For example, enter: *myspec1,myfolder/orders*.

#### Output

Name | Description
--- | ---
Status | A successful action execution returns status code 200 (OK).


### 4. Insert Into Tasks (JSON)

This action adds an item in the Item list.

#### Input

Name | Required | Description
--- | --- | ---
ReqParam1* | Yes | This is one of the required parameters to add an item in the List.
ReqParam2* | Yes | This is one of the required parameters to add an item in the List.
OptionalParam1* | No. Advanced | This is one of the required parameters to add an item in the List.
OptionalParam2* | No. Advanced | This is one of the required parameters to add an item in the List.

**Note** All the parameters of the 'List' are dynamically populated. The mandatory parameters are visible, whereas the optional parameters are in advanced section.

#### Output

Name | Description
--- | ---
ItemId | ItemId of the List item added.
Status | A successful insertion of List item returns status code 200 (OK).


### 5. Update Tasks (JSON)

This action updates an item in the Item list.

#### Input

Name | Required | Description
--- | --- | ---
ItemId | Yes | ItemId of the List item.
ReqParam1* | No | This is one of the required parameters to add an item in the List.
ReqParam2* | No | This is one of the required parameters to add an item in the List.
OptionalParam1* | No. Advanced | This is one of the required parameters to add an item in the List.
OptionalParam2* | No. Advanced | This is one of the required parameters to add an item in the List.

**Note**  All the parameters of the 'List' are dynamically populated. The mandatory parameters are visible, whereas the optional parameters are in advanced section.

#### Output

Name | Description
--- | ---
Status | A successful update of List item returns status code 200 (OK).


### 6. Get Item From Tasks (JSON)

This action gets an item from the Item list.

#### Input

Name | Required | Description
--- | --- | ---
ItemId | Yes | ItemId of the List item.

#### Output

Name | Description
--- | ---
Column1* | This is one of the parameters in the List.
Column2* | This is one of the parameters in the List.
Status | A successful execute of action returns status code 200 (OK).

**Note** The columns in the list are dynamically populated and shown in the output parameters.


### 7. Delete Item From Tasks

This action deletes an item from the Item list.

#### Input

Name | Required | Description
--- | --- | ---
ItemId | Yes | ItemId of the List item.

#### Output

Name | Description
--- | ---
Status | A successful delete of the list item returns status code 200 (OK).


### 8. List Shared Documents (JSON)

This action lists all the documents in a document library. You can use a View or a Caml query to filter the documents.  

#### Input

Name | Required | Description
--- | --- | ---
View Name | No | Enter a valid view used to filter documents to be picked. For example, enter: 'Approved Orders'. To process all the existing documents, leave this field empty.
Caml Query | No | Enter a valid Caml query to filter documents. For example, enter:  `<Where><Geq><FieldRef Name='ID'/><Value Type='Number'>10</Value></Geq></Where>`

#### Output

Name | Description
--- | ---
Documents | Array of all the documents. Each document has the following fields: <ul><li>Documents []</li><li>Name</li><li>Item Id</li><li>Item Full URL</li><li>Advanced</li><li>Item Edit URL</li><li>List Name</li><li>List Full URL</li></ul>
Status | A successful insertion of List item returns status code 200 (OK).


### 9. Upload To Shared Documents (XML)

This action uploads new document to 'Shared Documents'. The input document should be an XML payload. The response of the action will be an XML payload.
 
#### Input

Name | Required | Description
--- | --- | ---
Name | Yes | Name of the document.
Content | Yes | Content of the document.
ContentTransferEncoding | Yes | Content Transfer Encoding of the Message. ("none" or "base64”)
Force Overwrite | Yes | If set to TRUE and a document exists with the given name, it is overwritten.
 
#### Output

Name | Description
--- | ---
Output XML | Response of the Upload action in XML format.
Status | A successful upload of document returns status code 200 (OK).

### 10. Get From Shared Documents (XML)

This action gets the document from the document library given the relative URL (folder structure) of the document.

#### Input

Name | Required | Description
--- | --- | ---
Document Relative URI | No | Enter the document URL, relative to 'Shared Documents'. For example, enter: *myspec1,myfolder/orders*.
File Type | Yes | Enter whether the file is a binary file or a text file.

#### Output

Name | Description
--- | ---
Output XML | Document Content
ContentTransferEncoding | Content Transfer Encoding of the Message. ("none" or ”base64”)
Status | A successful action execution returns status code 200 (OK).

### 11. Insert Into Tasks (XML)

This action adds an item in the Item list. The input is expected to be an XML payload.

#### Input

Name | Required | Description
--- | --- | ---
Input XML | Yes | The XML message which contains the values of the fields of the list item to be inserted. You can use Transform API App to generate the XML message.

**Note** All the parameters of the 'List' are dynamically populated. The mandatory parameters are visible, whereas the optional parameters are in advanced section.

#### Output

Name | Description
--- | ---
ItemId | ItemId of the List item added.
Status | A successful insertion of List item returns status code 200 (OK).


### 12. Update Tasks (XML)

This action updates an item in the Item list. The input is expected to be an XML payload.

#### Input

Name | Required | Description
--- | --- | ---
ItemID | Yes | ItemId of the List item.
Input XML | Yes | The XML message which contains the values of the fields of the list item to be inserted. You can use Transform API App to generate the XML message.

**Note** All the parameters of the 'List' are dynamically populated. The mandatory parameters are visible, whereas the optional parameters are in advanced section.

#### Output

Name | Description
--- | ---
Status | A successful update of List item returns status code 200 (OK).


### 13. Get Item From Tasks (XML)

This action gets an item from the Item list.

#### Input

Name | Required | Description
--- | --- | ---
ItemID | Yes | ItemId of the List item.

#### Output

Name | Description
--- | ---
Output XML | The XML message which contains the values of the fields of the list item selected.
Status | A successful execute of action returns status code 200 (OK).


## Hybrid Configuration (Optional)

> [AZURE.NOTE] This step is required only if you are using SharePoint on-premises behind your firewall.

App Service uses the Hybrid Configuration Manager to connect securely to your on-premises system. If you're connector uses an on-premises SharePoint Server, the Hybrid Connection Manager is required.

See [Using the Hybrid Connection Manager](app-service-logic-hybrid-connection-manager.md).

## Do more with your Connector
Now that the connector is created, you can add it to a business workflow using a Logic App. See [What are Logic Apps?](app-service-logic-what-are-logic-apps.md).

>[AZURE.NOTE] If you want to get started with Azure Logic Apps before signing up for an Azure account, go to [Try Logic App](https://tryappservice.azure.com/?appservice=logic). You can immediately create a short-lived starter logic app in App Service. No credit cards required; no commitments.

View the Swagger REST API reference at [Connectors and API Apps Reference](http://go.microsoft.com/fwlink/p/?LinkId=529766).

You can also review performance statistics and control security to the connector. See [Manage  and Monitor API apps and connector](../app-service-api/app-service-api-manage-in-portal.md).


<!--Image references-->
[1]: ./media/app-service-logic-connector-sharepoint/image_0.png
[2]: ./media/app-service-logic-connector-sharepoint/image_1.png
[3]: ./media/app-service-logic-connector-sharepoint/image_2.png
[4]: ./media/app-service-logic-connector-sharepoint/image_3.png
[5]: ./media/app-service-logic-connector-sharepoint/image_4.jpg
[6]: ./media/app-service-logic-connector-sharepoint/image_5.png
[7]: ./media/app-service-logic-connector-sharepoint/image_6.png
