<properties 
   pageTitle="Using the SharePoint Connector in your logic app" 
   description="Using the SharePoint Connector in your logic app" 
   services="app-service\logic" 
   documentationCenter=".net,nodejs,java" 
   authors="anuragdalmia" 
   manager="dwrede" 
   editor=""/>

<tags
   ms.service="app-service-logic"
   ms.devlang="multiple"
   ms.topic="article"
   ms.tgt_pltfrm="na"
   ms.workload="integration" 
   ms.date="03/20/2015"
   ms.author="vagarw"/>

# Using the SharePoint Connector in your logic app

Logic apps can trigger based on a variety of data sources and offer connectors to get and process data as a part of the flow. Microsoft SharePoint connector lets you connect to Microsoft SharePoint Server/SharePoint Online and manage documents and list items. You can perform various actions such as create, update, get and delete on documents and list items. In case of On-Premises SharePoint server, you can provide Service Bus Connection String as part of connector configuration and install the on-premises listener agent to connect to the server.

The SharePoint Online Connector and SharePoint Server Connector gallery app provides you Trigger and Actions as mechanisms to interact with SharePoint.

## Creating a SharePoint Online Connector for your Logic App

To use the SharePoint Online Connector, you need to first create an instance of the SharePoint Online Connector API app. This can be done as follows:

1. Open the Azure Marketplace using the + NEW option at the bottom right of the Azure Portal.

2. Browse to "Web and Mobile > API apps" and search for “SharePoint Online Connector”

3. Configure the SharePoint Online Connector and click Create. Following are the parameters you would need to provide to create the connector:

	<table>
	  <tr>
	    <td><b>Name</b></td>
	    <td><b>Required</b></td>
	    <td><b>Description</b></td>
	  </tr>
	  <tr>
	    <td>Site URL</td>
	    <td>Yes</td>
	    <td>Specify the complete URL of the SharePoint web site. Ex: https://microsoft.sharepoint.com/teams/wabstest </td>
	  </tr>
	  <tr>
	    <td>Document Library / List Relative URLs</td>
	    <td>Yes</td>
	    <td>Specify the document libraries/lists URLs, relative to the SharePoint site URL, that are allowed to be modified by the connector. Ex: Lists/Task, Shared Documents'.</td>
	  </tr>
	</table>
	![][1]


4. Once that’s done, you can now create a logic App in the same resource group to use the SharePoint Online Connector.

## Creating a SharePoint Server Connector for your Logic App

To use the SharePoint Server Connector, you need to first create an instance of the SharePoint Server Connector API app. This can be done as follows:

1. Open the Azure Marketplace using the + NEW option at the bottom right of the Azure Portal.

2. Browse to "Web and Mobile > API apps" and search for “SharePoint Server Connector”

3. Configure the SharePoint Server Connector and click Create. Following are the parameters you would need to provide to create the connector:

	<table>
	  <tr>
	    <td><b>Name</b></td>
	    <td><b>Required</b></td>
	    <td><b>Description</b></td>
	  </tr>
	  <tr>
	    <td>Site URL</td>
	    <td>Yes</td>
	    <td>Specify the complete URL of the SharePoint web site. Ex: https://microsoft.sharepoint.com/teams/wabstest </td>
	  </tr>
	  <tr>
	    <td>Authentication Mode</td>
	    <td>Yes</td>
	    <td>Specify the authentication mode to connect to SharePoint Site. The allowed Values are:<br><br>
			Default<br>			
			WindowsAuthentication<br>
			FormBasedAuthentication.<br><br>
	
	In case you choose Default credentials, default credentials under which SharePoint Microservice is running are used and Username/Password is not required. Username and Password fields are compulsory for other authentication types. <br><br>Note:Anonymous authentication is not supported.</td>
	  </tr>
	  <tr>
	    <td>User Name</td>
	    <td>No</td>
	    <td>Specify a valid user name to connect to SharePoint site, if Authentication mode is not Default.</td>
	  </tr>
	  <tr>
	    <td>Password</td>
	    <td>No</td>
	    <td>Specify a valid password to connect to SharePoint site, if Authentication mode is not Default.</td>
	  </tr>
	  <tr>
	    <td>Document Library / List Relative URLs</td>
	    <td>Yes</td>
	    <td>Specify the document libraries/lists URLs, relative to the SharePoint site URL, that are allowed to be modified by the connector. Ex: Lists/Task, Shared Documents'.</td>
	  </tr>
	  <tr>
	    <td>Service Bus Connection String</td>
	    <td>No</td>
	    <td>This should be a valid Service Bus Namespace connection string.<br><br>
	
	You would need to install a listener agent on a server that can access your SharePoint server. <br>You can go to your API App summary page and click on 'Hybrid Connection' to install the agent.</td>
	  </tr>
	</table>


	![][2]

4. Once that’s done, you can now create a logic App in the same resource group to use the SharePoint Server Connector.
5. You would need to install a listener agent on a server that can access your SharePoint Server. You can go to your API App summary page and click on 'Hybrid Connection' to install the agent

## Using the SharePoint Connector in your Logic App

Once your API app is created, you can now use the SharePoint Connector as a trigger or action for your Logic App. To do this, you need to:

1. Create a new Logic App and choose the same resource group which has the SharePoint Connector.

2. Open "Triggers and Actions" to open the Logic Apps Designer and configure your flow. The SharePoint Connector would appear in the “Recently Used” section in the gallery on the right hand side. Select that.

3. If SharePoint connector is selected at the start of the logic app it acts like trigger else actions could be taken on SharePoint account using the connector. 

4. You would have to authenticate and authorize logic apps to perform operations on your behalf if SharePoint Online Connector is used. To start the authorization click Authorize on SharePoint Connector. 

	![][3]

5. Clicking Authorize would open SharePoint’s authentication dialog. Provide the login details of the SharePoint account on which you want to perform the operations. 

	![][4]
6. Grant logic apps access to your account to perform operation on your behalf. 

	![][5]

7. If the SharePoint Connector is configured as Trigger than the triggers are shown else list of actions is displayed and you can choose appropriate operation that you want to perform.  

	![][6]

	<b>Relative URL configured for document bibrary</b><br><br>

	![][7]

	<b>Relative URL configured for document list</b>

	<b>Note:</b> For the below triggers, it is assumed that the user specified 'Shared Documents, Lists/Task' in Connector Package settings, where 'Shared Documents' is a document library and 'Lists/Task' is a List. 

##  Triggers
Use triggers if you want to initiate a logic app 

**NOTE**: Triggers will delete the files after reading them. To preserve these files, please provide a value for the archive location. 

### 1.	New Document In Shared Documents (JSON)
This trigger is fired when a new document is available in 'Shared Documents'. 

**Inputs:**

<table>
  <tr>
    <td><b>Name</b></td>
    <td><b>Required</b></td>
    <td><b>Description</b></td>
  </tr>
  <tr>
    <td>View Name</td>
    <td>No</td>
    <td>Specify a valid view used to filter documents to be picked. Example: 'Approved Orders'. To process all the existing documents, leave this field empty. </td>
  </tr>
  <tr>
    <td>Archive Location</td>
    <td>No</td>
    <td>Specify a valid folder URL, relative to SharePoint site, where the processed documents are archived. </td>
  </tr>
  <tr>
    <td>Overwrite in Archive</td>
    <td>No</td>
    <td>Check this option to overwrite a file in Archive path if it already exists. </td>
  </tr>
  <tr>
    <td>Caml Query</td>
    <td>No, Advanced</td>
    <td>Specify a valid Caml query to filter documents. Example: <Where><Geq><FieldRef Name='ID'/><Value Type='Number'>10</Value></Geq></Where></td>
  </tr>
</table>

**Outputs:**
<table>
  <tr>
    <td><b>Name</b></td>
    <td><b>Description</b></td>
  </tr>
  <tr>
    <td>Name  </td>
    <td>Name of the document.</td>
  </tr>
  <tr>
    <td>Content</td>
    <td>Content of the document.</td>
  </tr>
  <tr>
    <td>ContentTransferEncoding</td>
    <td>Content Transfer Encoding of the Message. ("none"|”base64”)</
  </tr>
</table>


Note: All the columns of the document item are shown in 'Advanced' output properties.


###2. New Item In Tasks (JSON)
This trigger is fired when a new item is added in 'Tasks' list.

**Inputs:**
<table>
  <tr>
    <td><b>Name</b></td>
    <td><b>Required</b></td>
    <td><b>Description</b></td>
 </tr>
  <tr>
    <td>View Name</td>
    <td>No</td>
    <td>Specify a valid view used to filter items in the list. Example: 'Approved Orders'. To process all the new items, leave this field empty. </td>
  </tr>
  <tr>
    <td>Archive Location</td>
    <td>No</td>
    <td>Specify a valid folder URL, relative to SharePoint site, where the processed list items are archived. </td>
  </tr>
  <tr>
    <td>Caml Query</td>
    <td>No, Advanced</td>
    <td>Specify a valid Caml query to filter the list items. Example: <Where><Geq><FieldRef Name='ID'/><Value Type='Number'>10</Value></Geq></Where></td>
  </tr>
</table>


**Outputs:**

<table>
  <tr>
    <td><b>Name</b></td>
    <td><b>Description</b></td>
  </tr>
  <tr>
    <td>The columns in the list are dynamically populated and shown in the output parameters.</td>
    <td> </td>
  </tr>

</table>


###3. New Document In Shared Documents (XML)

This trigger is fired when a new document is available in 'Shared Documents'. The new document is returned as an XML message.

**Inputs:**

<table>
  <tr>
    <td><b>Name</b></td>
    <td><b>Required</b></td>
    <td><b>Description</b></td>
  </tr>
  <tr>
    <td>View Name</td>
    <td>No</td>
    <td>Specify a valid view used to filter documents to be picked. Example: 'Approved Orders'. To process all the existing documents, leave this field empty. </td>
  </tr>
  <tr>
    <td>Archive Location</td>
    <td>No</td>
    <td>Specify a valid folder URL, relative to SharePoint site, where the processed documents are archived. </td>
  </tr>
  <tr>
    <td>Overwrite in Archive</td>
    <td>No</td>
    <td>Check this option to overwrite a file in Archive path if it already exists. </td>
  </tr>
  <tr>
    <td>Caml Query</td>
    <td>No, Advanced</td>
    <td>Specify a valid Caml query to filter documents. Example: <Where><Geq><FieldRef Name='ID'/><Value Type='Number'>10</Value></Geq></Where></td>
  </tr>
</table>

**Outputs:**

<table>
  <tr>
    <td><b>Name</b></td>
    <td><b>Description</b></td>
  </tr>
  <tr>
    <td>Content</td>
    <td>Content of the document.</td>
  </tr>
  <tr>
    <td>ContentTransferEncoding</td>
    <td>Content Transfer Encoding of the Message. ("none"|”base64”)</td>
  </tr>
</table>


###4. New Item In Tasks (XML)

This trigger is fired when a new item is added in 'Tasks' list. The new list item is returned as an XML message.

**Inputs:**

<table>
  <tr>
    <td><b>Name</b></td>
    <td><b>Required</b></td>
    <td><b>Description</b></td>
  </tr>
  <tr>
    <td>View Name</td>
    <td>No</td>
    <td>Specify a valid view used to filter items in the list. Example: 'Approved Orders'. To process all the new items, leave this field empty. </td>
  </tr>
  <tr>
    <td>Archive Location</td>
    <td>No</td>
    <td>Specify a valid folder URL, relative to SharePoint site, where the processed list items are archived. </td>
  </tr>
  <tr>
    <td>Caml Query</td>
    <td>No, Advanced</td>
    <td>Specify a valid Caml query to filter the list items. Example: <Where><Geq><FieldRef Name='ID'/><Value Type='Number'>10</Value></Geq></Where></td>
  </tr>
</table>


**Outputs:**

<table>
  <tr>
    <td><b>Name</b></td>
    <td><b>Description</b></td>
  </tr>
  <tr>
    <td>Content</td>
    <td>Content of the document.</td>
  </tr>
  <tr>
    <td>ContentTransferEncoding</td>
    <td>Content Transfer Encoding of the Message. ("none"|”base64”)</td>
  </tr>
</table>


##  Actions
For the below actions, it is assumed that the user specified 'Shared Documents, Lists/Task' in Connector Package settings, where 'Shared Documents' is a document library and 'Lists/Task' is a List. 

###1. Upload To Shared Documents (JSON)

This action uploads new document to 'Shared Documents'. The input is a strongly typed JSON object with all the column fields of the document library.

**Inputs:**

<table>
  <tr>
    <td><b>Name</b></td>
    <td><b>Required</b></td>
    <td><b>Description</b></td>
 </tr>
  <tr>
    <td>Name</td>
    <td>Yes</td>
    <td>Name of the document.</td>
  </tr>
  <tr>
    <td>Content</td>
    <td>Yes</td>
    <td>Content of the document.</td>
  </tr>
  <tr>
    <td>ContentTransferEncoding</td>
    <td>Yes</td>
    <td>Content Transfer Encoding of the Message. ("none"|”base64”)</td>
  </tr>
  <tr>
    <td>Force Overwrite</td>
    <td>Yes</td>
    <td>If set to TRUE and a document exists with the given name, it will be overwritten.</td>
  </tr>
  <tr>
    <td>ReqParam1*</td>
    <td>Yes</td>
    <td>This is one of the required parameters to add a document in the document library.</td>
  </tr>
  <tr>
    <td>ReqParam2*</td>
    <td>Yes</td>
    <td>This is one of the required parameters to add a document in the document library.</td>
  </tr>
  <tr>
    <td>OptionalParam1*</td>
    <td>No. Advanced</td>
    <td>This is one of the optional parameters to add a document in the document library.</td>
  </tr>
  <tr>
    <td>OptionalParam2*</td>
    <td>No. Advanced</td>
    <td>This is one of the optional parameters to add a document in the document library.</td>
  </tr>
</table>

<b>Note:</b> All the parameters of the document library are dynamically populated. The mandatory parameters are visible, where the optional parameters are in advanced section.


**Outputs:**

<table>
  <tr>
    <td><b>Name</b></td>
    <td><b>Description</b></td>
  </tr>
  <tr>
    <td>ItemId</td>
    <td>ItemId of the document added in Document library.</td>
  </tr>
  <tr>
    <td>Status</td>
    <td>A successful upload of document returns status code 200 (OK).</td>
  </tr>
</table>


 

###2. Get From Shared Documents (JSON)
This action gets the document from the document library given the relative URL (folder structure) of the document.


**Inputs:**

<table>
  <tr>
    <td><b>Name</b></td>
    <td><b>Required</b></td>
    <td><b>Description</b></td>
  </tr>
  <tr>
    <td>Document Relative URI</td>
    <td>No</td>
    <td>Specify the document URL, relative to 'Shared Documents'. Example: myspec1,myfolder/orders</td>
  </tr>
</table>


**Outputs:**

<table>
  <tr>
    <td><b>Name</b></td>
    <td><b>Description</b></td>
  </tr>
  <tr>
    <td>Content</td>
    <td>Document Content</td>
  </tr>
  <tr>
    <td>ContentTransferEncoding</td>
    <td>Content Transfer Encoding of the Message. ("none"|”base64”)</td>
  </tr>
  <tr>
    <td>Status</td>
    <td>A successful action execution returns status code 200 (OK).</td>
  </tr>
  <tr>
    <td>Param1*</td>
    <td>This is one of the parameters of a document in the document library.</td>
  </tr>
  <tr>
    <td>Param2*</td>
    <td>This is one of the parameters of a document in the document library.</td>
  </tr>
</table>

<b>Note:</b> All the parameters of the document library are dynamically populated. And, they are in advanced section.

 

###3. Delete From Shared Documents

This action deletes the document from the document library given the relative URL (folder structure) of the document.

**Inputs:**

<table>
  <tr>
    <td><b>Name</b></td>
    <td><b>Required</b></td>
    <td><b>Description</b></td>
  </tr>
  <tr>
    <td>Document Relative URI</td>
    <td>No</td>
    <td>Specify the document URL, relative to 'Shared Documents'. Example: myspec1,myfolder/orders</td>
  </tr>
</table>


**Outputs:**

<table>
  <tr>
    <td><b>Name</b></td>
    <td><b>Description</b></td>
  </tr>
  <tr>
    <td>Status</td>
    <td>A successful action execution returns status code 200 (OK).</td>
  </tr>
</table>


###4. Insert Into Tasks (JSON)

This action adds an item in the Item list.

**Inputs:**

<table>
  <tr>
    <td><b>Name</b></td>
    <td><b>Required</b></td>
    <td><b>Description</b></td>
  </tr>
  <tr>
    <td>ReqParam1*</td>
    <td>Yes</td>
    <td>This is one of the required parameters to add an item in the List.</td>
  </tr>
  <tr>
    <td>ReqParam2*</td>
    <td>Yes</td>
    <td>This is one of the required parameters to add an item in the List.</td>
  </tr>
  <tr>
    <td>OptionalParam1*</td>
    <td>No. Advanced</td>
    <td>This is one of the required parameters to add an item in the List.</td>
  </tr>
  <tr>
    <td>OptionalParam2*</td>
    <td>No. Advanced</td>
    <td>This is one of the required parameters to add an item in the List.</td>
  </tr>
</table>


<b>Note:</b> All the parameters of the 'List' are dynamically populated. The mandatory parameters are visible, whereas the optional parameters are in advanced section.

 
**Outputs:**

<table>
  <tr>
    <td><b>Name</b></td>
    <td><b>Description</b></td>
  </tr>
  <tr>
    <td>ItemId</td>
    <td>ItemId of the List item added.</td>
  </tr>
  <tr>
    <td>Status</td>
    <td>A successful insertion of List item returns status code 200 (OK).</td>
  </tr>
</table>


###5. Update Tasks (JSON)

This action updates an item in the Item list.

**Inputs:**

<table>
  <tr>
    <td><b>Name</b></td>
    <td><b>Required</b></td>
    <td><b>Description</b></td>
  </tr>
  <tr>
    <td>ItemId</td>
    <td>Yes</td>
    <td>ItemId of the List item.</td>
  </tr>
  <tr>
    <td>ReqParam1*</td>
    <td>No</td>
    <td>This is one of the required parameters to add an item in the List.</td>
  </tr>
  <tr>
    <td>ReqParam2*</td>
    <td>No</td>
    <td>This is one of the required parameters to add an item in the List.</td>
  </tr>
  <tr>
    <td>OptionalParam1*</td>
    <td>No. Advanced</td>
    <td>This is one of the required parameters to add an item in the List.</td>
  </tr>
  <tr>
    <td>OptionalParam2*</td>
    <td>No. Advanced</td>
    <td>This is one of the required parameters to add an item in the List.</td>
  </tr>
</table>

<b>Note:</b> All the parameters of the 'List' are dynamically populated. The mandatory parameters are visible, whereas the optional parameters are in advanced section.


**Outputs:**

<table>
  <tr>
    <td><b>Name</b></td>
    <td><b>Description</b></td>
  </tr>
  <tr>
    <td>Status  </td>
    <td>A successful update of List item returns status code 200 (OK).</td>
  </tr>
</table>


###6. Get Item From Tasks (JSON)

This action gets an item from the Item list.


**Inputs:**

<table>
  <tr>
    <td><b>Name</b></td>
    <td><b>Required</b></td>
    <td><b>Description</b></td>
  </tr>
  <tr>
    <td>ItemId</td>
    <td>Yes</td>
    <td>ItemId of the List item.</td>
  </tr>
</table>


**Outputs:**

<table>
  <tr>
    <td><b>Name</b></td>
    <td><b>Description</b></td>
  </tr>
  <tr>
    <td>Column1*</td>
    <td>This is one of the parameters in the List.</td>
  </tr>
  <tr>
    <td>Column2*</td>
    <td>This is one of the parameters in the List.</td>
  </tr>
  <tr>
    <td>Status</td>
    <td>A successful execute of action returns status code 200 (OK).</td>
  </tr>
</table>

<b>Note:</b> The columns in the list are dynamically populated and shown in the output parameters.


###7. Delete Item From Tasks

This action deletes an item from the Item list.

 
**Inputs:**

<table>
  <tr>
    <td><b>Name</b></td>
    <td><b>Required</b></td>
    <td><b>Description</b></td>
  </tr>
  <tr>
    <td>ItemId</td>
    <td>Yes</td>
    <td>ItemId of the List item.</td>
  </tr>
</table>


**Outputs:**

<table>
  <tr>
    <td><b>Name</b></td>
    <td><b>Description</b></td>
  </tr>
  <tr>
    <td>Status  </td>
    <td>A successful delete of the list item returns status code 200 (OK).</td>
  </tr>
</table>


###8. List Shared Documents (JSON)

This action lists all the documents in a document library. You can use a View or a Caml query to filter the documents.  

 
**Inputs:**

<table>
  <tr>
    <td><b>Name</b></td>
    <td><b>Required</b></td>
    <td><b>Description</b></td>
  </tr>
  <tr>
    <td>View Name</td>
    <td>No</td>
    <td>Specify a valid view used to filter documents to be picked. Example: 'Approved Orders'. To process all the existing documents, leave this field empty. </td>
  </tr>
  <tr>
    <td>Caml Query</td>
    <td>No</td>
    <td>Specify a valid Caml query to filter documents. Example: <Where><Geq><FieldRef Name='ID'/><Value Type='Number'>10</Value></Geq></Where></td>
  </tr>
</table>


**Outputs:**

<table>
  <tr>
    <td><b>Name</b></td>
    <td><b>Description</b></td>
  </tr>
  <tr>
    <td>Documents</td>
    <td>Array of all the documents. Each document has the below fields. <br><br>
	Documents []<br>
	Name<br>
	Item Id<br>
	Item Full URL<br>
	Advanced<br>
	Item Edit URL<br>
	List Name<br>
	List Full URL<br>
	</td>
  </tr>
  <tr>
    <td>Status  </td>
    <td>A successful insertion of List item returns status code 200 (OK).</td>
  </tr>
</table>


###9. Upload To Shared Documents (XML)

This action uploads new document to 'Shared Documents'. The input document should be an XML payload. The response of the action will be an XML payload.
 

**Inputs:**

<table>
  <tr>
    <td><b>Name</b></td>
    <td><b>Required</b></td>
    <td><b>Description</b></td>
  </tr>
  <tr>
    <td>Name</td>
    <td>Yes</td>
    <td>Name of the document.</td>
  </tr>
  <tr>
    <td>Content</td>
    <td>Yes</td>
    <td>Content of the document.</td>
  </tr>
  <tr>
    <td>ContentTransferEncoding</td>
    <td>Yes</td>
    <td>Content Transfer Encoding of the Message. ("none"|”base64”)</td>
  </tr>
  <tr>
    <td>Force Overwrite</td>
    <td>Yes</td>
    <td>If set to TRUE and a document exists with the given name, it will be overwritten.</td>
  </tr>
</table>
 

**Outputs:**

<table>
  <tr>
    <td><b>Name</b></td>
    <td><b>Description</b></td>
  </tr>
  <tr>
    <td>Output XML</td>
    <td>Response of the Upload action in XML format.</td>
  </tr>
  <tr>
    <td>Status  </td>
    <td>A successful upload of document returns status code 200 (OK).</td>
  </tr>
</table>

###10. Get From Shared Documents (XML)

This action gets the document from the document library given the relative URL (folder structure) of the document.

 
**Inputs:**

<table>
  <tr>
    <td><b>Name</b></td>
    <td><b>Required</b></td>
    <td><b>Description</b></td>
  </tr>
  <tr>
    <td>Document Relative URI</td>
    <td>No</td>
    <td>Specify the document URL, relative to 'Shared Documents'. Example: myspec1,myfolder/orders</td>
  </tr>
  <tr>
    <td>File Type</td>
    <td>Yes</td>
    <td>Specify whether the file is a binary file or a text file.</td>
  </tr>
</table>


**Outputs:**

<table>
  <tr>
    <td><b>Name</b></td>
    <td><b>Description</b></td>
  </tr>
  <tr>
    <td>Output XML</td>
    <td>Document Content</td>
  </tr>
  <tr>
    <td>ContentTransferEncoding</td>
    <td>Content Transfer Encoding of the Message. ("none"|”base64”)</td>
  </tr>
  <tr>
    <td>Status</td>
    <td>A successful action execution returns status code 200 (OK).</td>
  </tr>
</table>

###11. Insert Into Tasks (XML)

This action adds an item in the Item list. The input is expected to be an XML payload.

** Inputs:**

<table>
  <tr>
    <td><b>Name</b></td>
    <td><b>Required</b></td>
    <td><b>Description</b></td>
  </tr>
  <tr>
    <td>Input XML</td>
    <td>Yes</td>
    <td>The XML message which contains the values of the fields of the list item to be inserted. You can use Transform API App to generate the XML message.</td>
  </tr>
</table>
 
<b>Note:</b> All the parameters of the 'List' are dynamically populated. The mandatory parameters are visible, whereas the optional parameters are in advanced section.

 
**Outputs:**

<table>
  <tr>
    <td><b>Name</b></td>
    <td><b>Description</b></td>
  </tr>
  <tr>
    <td>ItemId</td>
    <td>ItemId of the List item added.</td>
  </tr>
  <tr>
    <td>Status  </td>
    <td>A successful insertion of List item returns status code 200 (OK).</td>
  </tr>
</table>


###12. Update Tasks (XML)

This action updates an item in the Item list. The input is expected to be an XML payload.


**Inputs:**

<table>
  <tr>
    <td><b>Name</b></td>
    <td><b>Required</b></td>
    <td><b>Description</b></td>
  </tr>
  <tr>
    <td>ItemId</td>
    <td>Yes</td>
    <td>ItemId of the List item.</td>
  </tr>
  <tr>
    <td>Input XML</td>
    <td>Yes</td>
    <td>The XML message which contains the values of the fields of the list item to be inserted. You can use Transform API App to generate the XML message.</td>
  </tr>
</table>

<b>Note:</b> All the parameters of the 'List' are dynamically populated. The mandatory parameters are visible, whereas the optional parameters are in advanced section.

 
**Outputs:**

<table>
  <tr>
    <td><b>Name</b></td>
    <td><b>Description</b></td>
  </tr>
  <tr>
    <td>Status  </td>
    <td>A successful update of List item returns status code 200 (OK).</td>
  </tr>
</table>


###13. Get Item From Tasks (XML)

This action gets an item from the Item list.


**Inputs:**

<table>
  <tr>
    <td><b>Name</b></td>
    <td><b>Required</b></td>
    <td><b>Description</b></td>
  </tr>
  <tr>
    <td>ItemId</td>
    <td>Yes</td>
    <td>ItemId of the List item.</td>
  </tr>
</table>

**Outputs:**

<table>
  <tr>
    <td><b>Name</b></td>
    <td><b>Description</b></td>
  </tr>
  <tr>
    <td>Output XML</td>
    <td>The XML message which contains the values of the fields of the list item selected. </td>
  </tr>
  <tr>
    <td>Status  </td>
    <td>A successful execute of action returns status code 200 (OK).</td>
  </tr>
</table>


<!--Image references-->
[1]: ./media/app-service-logic-connector-sharepoint/image_0.png
[2]: ./media/app-service-logic-connector-sharepoint/image_1.png
[3]: ./media/app-service-logic-connector-sharepoint/image_2.png
[4]: ./media/app-service-logic-connector-sharepoint/image_3.png
[5]: ./media/app-service-logic-connector-sharepoint/image_4.jpg
[6]: ./media/app-service-logic-connector-sharepoint/image_5.png
[7]: ./media/app-service-logic-connector-sharepoint/image_6.png
