<properties
   pageTitle="Using the Salesforce Connector in Logic Apps | Microsoft Azure App Service"
   description="How to create and configure the Salesforce Connector or API app and use it in a logic app in Azure App Service"
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


# Get started with the Salesforce Connector and add it to your Logic App
Connect to Salesforce and create and modify entities such as Accounts, Leads, and so on. Following are the typical integration scenarios that involve Salesforce:

- Account Synchronization between Salesforce and ERP systems such as SAP and QuickBooks
- Order to Cash flow from Salesforce to ERP systems

As part of Connector package settings, the user can specify entities the connector can manage and the actions, input and output parameters are dynamically populated. Following are the different actions available in Salesforce connector:

- Create Entity - Use this action to create a new Salesforce entity such as Account, Case or a Custom Object
- Update Entity - Use this action to update an existing Salesforce entity
- Upsert Entity - Use this action to update an existing Salesforce entity or create one if it does not exist
- Delete Entity - Use this action to delete an existing Salesforce entity
- Execute Query - Use this action to execute a SELECT query that is written in Salesforce Object Query Language (SOQL)

Logic apps can trigger based on a variety of data sources and offer connectors to get and process data as a part of the flow. You can add the Salesforce Connector to your business workflow and process data as part of this workflow within a Logic App. 


## Create a Salesforce Connector API App
1.	Open the Azure Marketplace using the + NEW option at the bottom right of the Azure Portal.
2.	Browse to “Web and Mobile > API apps” and search for “Salesforce”.
3.	Configure the Salesforce Connector by providing the details for Hosting Plan, the resource group and selecting the name of the API App:  
![][15]
4. Configure the Salesforce Entities you are interested in reading/writing in the 'Package Settings'.

With this, you can now create a Salesforce Conenctor API App.


## Create a Logic App
Let us create a simple logic app that creates an account in Salesforce and updates billing address details of the same account.

1.	Login to Azure Portal and click on ‘New -> Web + mobile -> Logic App’:  
![][1]

2.	In the ‘Create logic app’ page, provide the required details such as name, app service plan and location:  
![][2]

3.	Click on ‘Triggers and Actions’. The Logic App editor opens:  
![][3]

4.	Select ‘Run this logic manually’ which means that this logic app can be invoked only manually:  
![][4]

5.	Expand ‘API Apps in this resource group’ in Gallery to see all the available API Apps. Select ‘Salesforce’ from the gallery and the ‘Salesforce connector’ gets added to the flow:  
![][5]

8.	To authorize your Logic App to access your Salesforce account, click on ‘Authorize’ to provide Salesforce login credentials:  
![][6]

9.	You are redirected to Salesforce login page and you can authenticate with your Salesforce credentials:  
![][7]  
![][8]

10.	Once the authorization is complete, all the actions are displayed:  
![][9]

11.	Select ‘Create Account’ action and the input parameters are displayed:  
![][10]

12.	Provide ‘Account Name’ and click ✓:  
![][11]

13.	Select ‘Salesforce Connector’ from the ‘Recently Used’ section in the gallery and a new Salesforce action gets added.

14.	Select ‘Update Account’ from the list of actions and the input parameters of ‘Update Account’ action are displayed:  
![][12]

15.	Click on ‘+’ next to ‘Record Id’ to pick the id value from the output of ‘Create Account’ action:  
![][13]

16.	Provide values for Billing Street, Billing City, Billing State and Billing Zip Code and click ✓:  
![][14]

17. Click on OK on Logic app editor screen and then click 'Create'. It will take approximately 30 seconds for the creation to complete.

18. Browse the newly created Logic App and click on 'Run' to initiate a run.

19. You can check that a new account by the name 'Contoso' is created in your Salesforce account.

## Do more with your Connector
Now that the connector is created, you can add it to a business workflow using a Logic App. See [What are Logic Apps?](app-service-logic-what-are-logic-apps.md).

>[AZURE.NOTE] If you want to get started with Azure Logic Apps before signing up for an Azure account, go to [Try Logic App](https://tryappservice.azure.com/?appservice=logic), where you can immediately create a short-lived starter logic app in App Service. No credit cards required; no commitments.

View the Swagger REST API reference at [Connectors and API Apps Reference](http://go.microsoft.com/fwlink/p/?LinkId=529766).

You can also review performance statistics and control security to the connector. See [Manage and Monitor your built-in API Apps and Connectors](app-service-logic-monitor-your-connectors.md).

<!--Image references-->
[1]: ./media/app-service-logic-connector-salesforce/1_New_Logic_App.png
[2]: ./media/app-service-logic-connector-salesforce/2_Logic_App_Settings.png
[3]: ./media/app-service-logic-connector-salesforce/3_Logic_App_Editor.png
[4]: ./media/app-service-logic-connector-salesforce/4_Manual_Logic_App.png
[5]: ./media/app-service-logic-connector-salesforce/5_Select_Salesforce_Gallery.png
[6]: ./media/app-service-logic-connector-salesforce/6_Salesforce_Authorize.png
[7]: ./media/app-service-logic-connector-salesforce/7_Salesforce_Login.png
[8]: ./media/app-service-logic-connector-salesforce/8_Salesforce_User_Consent.png
[9]: ./media/app-service-logic-connector-salesforce/9_Salesforce_Actions.png
[10]: ./media/app-service-logic-connector-salesforce/10_Salesforce_Create_Account.png
[11]: ./media/app-service-logic-connector-salesforce/11_Create_Account_OK.png
[12]: ./media/app-service-logic-connector-salesforce/12_Salesforce_Update_Account.png
[13]: ./media/app-service-logic-connector-salesforce/13_Record_ID_from_Create.png
[14]: ./media/app-service-logic-connector-salesforce/14_Update_Account_Address.png
[15]: ./media/app-service-logic-connector-salesforce/15_Create_new_salesforce_connector.png
