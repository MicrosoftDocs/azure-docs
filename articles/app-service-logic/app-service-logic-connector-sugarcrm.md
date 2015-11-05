<properties
   pageTitle="Using the SugarCRM Connector in Logic Apps | Microsoft Azure App Service"
   description="How to create and configure the SugarCRM Connector or API app and use it in a logic app in Azure App Service"
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
   ms.date="08/23/2015"
   ms.author="sameerch"/>


# Get started with the SugarCRM Connector and add it to your Logic App
SugarCRM connector lets you create and modify different entities such as Accounts, Leads, Contacts, and so on. Following are the typical integration scenarios that involve SugarCRM:

- Account Synchronization between SugarCRM and ERP systems such as SAP
- Account, Contacts and Leads synchronization between Marketo and SugarCRM
- Order to Cash flow from SugarCRM to ERP systems

As part of Connector package settings, you can choose entities the connector can manage and the actions, input and output parameters are dynamically populated.

Logic apps can trigger based on a variety of data sources and offer connectors to get and process data as a part of the flow. You can add the SugarCRM Connector to your business workflow and process data as part of this workflow within a Logic App. 



## SugarCRM Connector Actions
Following are the different actions available in SugarCRM connector:

- Create Module - Use this action to create a new record for SugarCRM module such as Accounts, Leads, Contacts.

- Update Module - Use this action to update an existing  record for SugarCRM module.

- Delete Module - Use this action to delete an existing record for SugarCRM module.

- List Module - Use this action to list filtered records. If no query is specified then all records are returned.

- Get Module - Use this action to retrieve a single record from specified module.

- Get Record Count - Use this action to get the number of records in the module that match the query. If no query is specified then total number of records in the module are returned.

- Check Duplicate Module - Use this action to check for duplicate records within a module.

*Note*: For more details on the supported arguments in a query, refer to [SugarCRM REST API](https://msdn.microsoft.com/library/dn705870) documentation.

## Create a SugarCRM Connector API App
1.	Navigate to portal.azure.com. Open the Azure Marketplace using the + NEW option at the top left corner of the Azure Portal.
2.	Browse to “Marketplace > Everything” and search for “SugarCRM”.
3.	Configure the SugarCRM Connector by providing the details for App Service Plan, the Resource Group and entering the name of the API App.
4. Configure the SugarCRM Connector package settings. Following are the package settings you would need to provide to create the connector:

	Name | Required | Description
--- | --- | ---
Site URL | Yes | Enter the URL of your SugarCRM instance. For example, enter https://abcde1234.sugarcrm.com.
Client Id | Yes | Enter the consumer key of OAUTH 2.0 key in SugarCRM. 
Client Secret | Yes | Enter the consumer secret of OAUTH.
Username | Yes | Enter the username of SugarCRM user.
Password | Yes | Enter the password of the SugarCRM user.
Module Names | Yes | Enter the SugarCRM modules (such as Accounts, Contacts, Products) on which you want to perform operation<br><br>Example: Accounts, Leads, Contacts  
  
![][9]



## Create a Logic App
Let us create a simple logic app that creates an account in SugarCRM and updates billing address details of the same account.

1.	Login to Azure Portal and click on ‘New -> Web + mobile -> Logic App’:  
![][1]

2.	In the ‘Create logic app’ page, provide the required details such as name, app service plan and location:  
![][2]

3.	Click on ‘Triggers and Actions’ and the Logic App editor screen comes up. Select ‘Run this logic manually’ which means that this logic app can be invoked only manually.

4.	Expand ‘API Apps in this resource group’ in Gallery to see all the available API Apps. Select ‘SugarCRM’ from the gallery and the ‘SugarCRM connector’ gets added to the flow:  
![][3]

5.	Select ‘Create Account’ action and the input parameters are displayed:  
![][4]

6.	Provide name as 'Microsoft Account' and click ✓:  
![][5]

7.	Select ‘SugarCRM Connector’ from the ‘Recently Used’ section in the gallery and a new SugarCRM action gets added.

8.	Select ‘Update Account’ (this will be under advanced actions '...') from the list of actions and the input parameters of ‘Update Account’ action are displayed:  
![][6]

9.	Click on ‘...’ next to ‘Record Id’ to pick the "id" value from the output of ‘Create Account’ action:  
![][7]

10.	Provide values for billing address information and click ✓:  
![][8]

11. Click on OK on Logic app editor screen and then click 'Create'. It will take approximately 30 seconds for the creation to complete.

12. Browse the newly created Logic App and click on 'Run Now' to initiate a run.

13. You can check that a new account by name 'Microsoft Account' gets created in your SugarCRM account and the same account is also updated with billing address information.

## Do more with your Connector
Now that the connector is created, you can add it to a business workflow using a Logic App. See [What are Logic Apps?](app-service-logic-what-are-logic-apps.md).

>[AZURE.NOTE] If you want to get started with Azure Logic Apps before signing up for an Azure account, go to [Try Logic App](https://tryappservice.azure.com/?appservice=logic), where you can immediately create a short-lived starter logic app in App Service. No credit cards required; no commitments.

View the Swagger REST API reference at [Connectors and API Apps Reference](http://go.microsoft.com/fwlink/p/?LinkId=529766).

You can also review performance statistics and control security to the connector. See [Manage and Monitor your built-in API Apps and Connectors](app-service-logic-monitor-your-connectors.md).

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
