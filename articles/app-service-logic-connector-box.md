<properties 
   pageTitle="Using the Box Connector in your logic app" 
   description="Using the Box Connector in your logic app" 
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
   ms.date="03/20/2015"
   ms.author="vagarw"/>

# **Using the Box Connector in your logic app**

 

Logic apps can trigger based on a variety of data sources and offer connectors to get and process data as a part of the flow. You may have scenarios where you may need to work with Box that allows you to share data securely with anyone – even if they’re outside your firewall.

 

The Box gallery app provides you Trigger and Actions as mechanisms to interact with Box:

 

1. **Trigger** **on File Available**: Use this if you want to initiate a logic app when a file is added in a Box folder. The trigger checks the specified Box folder at configured frequency and triggers the flow when there is a file available in the specified folder. It returns the contents and properties of the file and after successfully passing it to next logic app step the file is deleted.


	<table>
	  <tr>
	    <td><b>Parameter Name</b></td>
	    <td><b>Description</b></td>
	    <td><b>Required</b></td>
	  </tr>
	  <tr>
	    <td>File Path</td>
	    <td>Path of the folder in which File is present.</td>
	    <td>Yes</td>
	  </tr>
	  <tr>
	    <td>File Type</td>
	    <td>Specifies if the file is Text or Binary.</td>
	    <td>No</td>
	  </tr>
	  <tr>
	    <td>Frequency</td>
	    <td>Specifies the frequency type, this is to be selected one from the listed types. It can be one of the following: Years, Months, Weeks, Days, Hours, Minutes Or Seconds</td>
	    <td>Yes</td>
	  </tr>
	  <tr>
	    <td>Interval</td>
	    <td>Specifies the unit for the frequency.</td>
	    <td>Yes</td>
	  </tr>
	</table>


 

2. **Actions**: The actions lets you perform predefined actions on the Box account configured with the logic app. Following are the actions that can be performed on Box account using Box connector:

	a. *List Files:* This operation will return the information of all files in a folder. Following is the list of parameters required for the action:

	<table>
	  <tr>
	    <td><b>Parameter Name</b></td>
	    <td><b>Description</b></td>
	    <td><b>Required</b></td>
	  </tr>
	  <tr>
	    <td>Folder Path</td>
	    <td>Path of the folder on which listing is to be done.</td>
	    <td>Yes</td>
	  </tr>
	</table>

	*Note: It does not return any file content.*

 

    b. *Get File:* This operation retrieves a file including its content and properties. Following is the list of parameters required for the action:

	<table>
	  <tr>
	    <td><b>Parameter Name</b></td>
	    <td><b>Description</b></td>
	    <td><b>Required</b></td>
	  </tr>
	  <tr>
	    <td>File Path</td>
	    <td>Path of the Folder in which File is present.</td>
	    <td>Yes</td>
	  </tr>
	  <tr>
	    <td>File Type</td>
	    <td>Specifies if the file is Text or Binary.</td>
	    <td>No</td>
	  </tr>
	</table>
	*Note: this operation will not delete the file after reading it.*

 

    c. Upload File: As the name suggests the action upload the file to Box account. If file already exists then it is not overwritten and error is thrown. Following is the list of parameters required for the action:

	<table>
	  <tr>
	    <td><b>Parameter Name</b></td>
	    <td><b>Description</b></td>
	    <td><b>Required</b></td>
	  </tr>
	  <tr>
	    <td>File Path</td>
	    <td>Path to the file.</td>
	    <td>Yes</td>
	  </tr>
	  <tr>
	    <td>File Content</td>
	    <td>File content to be uploaded.</td>
	    <td>Yes</td>
	  </tr>
	  <tr>
	    <td>Content Transfer Encoding</td>
	    <td>Encoding type of the content, it can be Base64 or None.</td>
	    <td> </td>
	  </tr>
	</table>


    d. Delete File: The action deletes specified file from a folder. If the file/folder is not found an exception is thrown. Following is the list of parameters required for the action:

 	<table>
	  <tr>
	    <td><b>Parameter Name</b></td>
	    <td><b>Description</b></td>
	    <td><b>Required</b></td>
	  </tr>
	  <tr>
	    <td>File Path</td>
	    <td>Path of the folder in which File is present.</td>
	    <td>Yes</td>
	  </tr>
	</table>


 

## **Creating a Box Connector for your Logic App** ##

To use the Box Connector, you need to first create an instance of the Cox Connector API app. This can be done as follows:

1. Open the Azure Marketplace using the + NEW option at the bottom right of the Azure Portal.

2. Browse to "Web and Mobile > API apps" and search for “Box Connector”.

3. Configure the Box Connector and click  Create:

	![][1]

4. Once that’s done, you can now create a logic App in the same resource group to use the Box Connector.


## **Using the Box Connector in your Logic App** ##

Once your API app is created, you can now use the Box Connector as a trigger or action for your Logic App. To do this, you need to:


1. Create a new Logic App and choose the same resource group which has the Box Connector.

2. Open "Triggers and Actions" to open the Logic Apps Designer and configure your flow. The Box Connector would appear in the “Recently Used” section in the gallery on the right hand side. Select that.

3. If Box connector is selected at the start of the logic app it acts like trigger else actions could be taken on Box account using the connector.

4. The first step would be to authenticate and authorize logic apps to perform operations on your behalf. To start the authorization click Authorize on Box Connector.

	![][2]

5. Clicking Authorize would open Box’s authentication dialog. Provide the login details of the Box account on which you want to perform the operations.

	![][3]

6. Grant logic apps access to your account to perform operation on your behalf. 

	![][4]

7. If the Box Connector is configured as Trigger than the triggers are shown else list of actions is displayed and you can choose appropriate operation that you want to perform.  

	![][5]


<!--Image references-->
[1]: ./media/app-service-logic-connector-box/image_0.jpg
[2]: ./media/app-service-logic-connector-box/image_1.jpg
[3]: ./media/app-service-logic-connector-box/image_2.jpg
[4]: ./media/app-service-logic-connector-box/image_3.jpg
[5]: ./media/app-service-logic-connector-box/image_4.jpg

