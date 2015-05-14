<properties 
   pageTitle="SugarCRM Connector" 
   description="How to use the SugarCRM Connector" 
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
   ms.date="04/01/2015"
   ms.author="vagarw"/>


#Using the SugarCRM Connector in your Logic App#

Logic apps can trigger based on a variety of data sources and offer connectors to get and process data as a part of the flow. SugarCRM connector lets you create and modify different entities such as Accounts, Leads, Contacts etc. Following are the typical integration scenarios that involve SugarCRM.

- Account Synchronization between SugarCRM and ERP systems such as SAP

- Account, Contacts and Leads synchronization between Marketo and SugarCRM

- Order to Cash flow from SugarCRM to ERP systems


As part of Connector package settings, the user can specify entities the connector can manage and the actions, input and output parameters are dynamically populated. 

##SugarCRM Connector Actions##
Following are the different actions available in SugarCRM connector.
 
- Create Module - Use this action to create a new record for SugarCRM module such as Accounts, Leads, Contacts.

- Update Module - Use this action to update an existing  record for SugarCRM module.

- Delete Module - Use this action to delete an existing record for SugarCRM module.

- List Module - Use this action to list filtered records. If no query is specified then all records are returned.

- Get Module - Use this action to retrieve a single record from specified module.

- Get Record Count - Use this action to get the number of records in the module that match the query. If no query is specified then total number of records in the module are returned. 

- Check Duplicate Module - Use this action to check for duplicate records within a module.

*Note*: For more details on the supported arguments in query refer to SugarCRM REST API documentation.
   
##Create a SugarCRM Connector API App##
1.	Open the Azure Marketplace using the + NEW option at the bottom right of the Azure Portal.
2.	Browse to “Web and Mobile > API apps” and search for “SugarCRM”.
3.	Configure the SugarCRM Connector by providing the details for Hosting Plan, the resource group and selecting the name of the API App.

4. Configure the SugarCRM Connector and click Create. Following are the package settings you would need to provide to create the connector:

	<table>
	  <tr>
	    <td><b>Name</b></td>
	    <td><b>Required</b></td>
	    <td><b>Description</b></td>
	  </tr>
	  <tr>
	    <td>Site URL</td>
	    <td>Yes</td>
	    <td>Specify the URL of your SugarCRM instance Ex: https://abcde1234.sugarcrm.com</td>
	  </tr>
	  <tr>
	    <td>Client Id</td>
	    <td>Yes</td>
	    <td>Specify the consumer key of oauth 2.0 key in SugarCRM </td>
	  </tr>
	  <tr>
	    <td>Client Secret</td>
	    <td>Yes</td>
	    <td>Specify the consumer secret of oauth 2.0 key in SugarCRM </td>
	  </tr>
	<tr>
	    <td>Username</td>
	    <td>Yes</td>
	    <td>Specify the username of SugarCRM user</td>
	  </tr>
		<tr>
	    <td>Password</td>
	    <td>Yes</td>
	    <td>Specify the password of the SugarCRM user</td>
	  </tr>
	  <tr>
	    <td>Module Names</td>
	    <td>Yes</td>
	    <td>Specify the SugarCRM modules such as Accounts, Contacts, Products, etc. on which you want to perform operation<br><br>Ex: Accounts,Leads,Contacts</td>
	  </tr>
	</table>

	![][9]				



##Create a Logic App##
Let us create a simple logic app that creates an account in SugarCRM and updates billing address details of the same account.

1.	Login to Azure Portal and click on ‘New -> Web + mobile -> Logic App’

	![][1]

2.	In the ‘Create logic app’ page, provide the required details such as name, app service plan and location.

	![][2]

3.	Click on ‘Triggers and Actions’ and the Logic App editor screen comes up. Select ‘Run this logic manually’ which means that this logic app can be invoked only manually.


5.	Expand ‘API Apps in this resource group’ in Gallery to see all the available API Apps. Select ‘SugarCRM’ from the gallery and the ‘SugarCRM connector’ gets added to the flow.


	![][3]

6.	Select ‘Create Account’ action and the input parameters are displayed.

	![][4]

12.	Provide name as 'Microsoft Account' and click ✓. 

	![][5]

13.	Select ‘SugarCRM Connector’ from the ‘Recently Used’ section in the gallery and a new SugarCRM action gets added.

14.	Select ‘Update Account’ from the list of actions and the input parameters of ‘Update Account’ action are displayed.

	![][6]

15.	Click on ‘+’ next to ‘Record Id’ to pick the id value from the output of ‘Create Account’ action. 

	![][7]

16.	Provide values for billing address information and click ✓.

	![][8]

17. Click on OK on Logic app editor screen and then click 'Create'. It will take approximately 30 seconds for the creation to complete.

18. Browse the newly created Logic App and click on 'Run' to initiate a run.

19. You can check that a new account by name 'Microsoft Account' gets created in your SugarCRM account and the same account is also updated with billing address information.

<!--Image references-->
[1]: ./media/app-service-logic-connector-sugarcrm/1_New_Logic_App.png
[2]: ./media/app-service-logic-connector-sugarcrm/2_Logic_App_Settings.png
[3]: ./media/app-service-logic-connector-sugarcrm/3_Select_SugarCRM_Gallery.png
[4]: ./media/app-service-logic-connector-sugarcrm/4_SugarCRM_Create_Account.png
[5]: ./media/app-service-logic-connector-sugarcrm/5_Create_Account_OK.png
[6]: ./media/app-service-logic-connector-sugarcrm/6_SugarCRM_Update_Account.png
[7]: ./media/app-service-logic-connector-sugarcrm/7_Record_ID_from_Create.png
[8]: ./media/app-service-logic-connector-sugarcrm/8_Update_Account_Address.png
[9]: ./media/app-service-logic-connector-sugarcrm/9_Create_new_SugarCRM_connector.png


