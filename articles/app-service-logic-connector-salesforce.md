<properties 
   pageTitle="Salesforce Connector" 
   description="How to use the Salesforce Connector" 
   services="app-service\logic" 
   documentationCenter=".net,nodejs,java" 
   authors="sutalasi" 
   manager="dwrede" 
   editor=""/>

<tags
   ms.service="app-service-logic"
   ms.devlang="multiple"
   ms.topic="article"
   ms.tgt_pltfrm="na"
   ms.workload="integration" 
   ms.date="03/20/2015"
   ms.author="sutalasi"/>


#Using the Saleforce Connector in your Logic App#

Logic apps can trigger based on a variety of data sources and offer connectors to get and process data as a part of the flow. Salesforce connector lets you create and modify different entities such as Accounts, Leads etc. Following are the typical integration scenarios that involve Salesforce.

- Account Synchronization between Salesforce and ERP systems such as SAP and QuickBooks	

- Order to Cash flow from Salesforce to ERP systems


As part of Connector package settings, the user can specify entities the connector can manage and the actions, input and output parameters are dynamically populated. Following are the different actions available in Salesforce connector.
 
- Create Entity - Use this action to create a new Salesforce entity such as Account and Case.

- Update Entity - Use this action to update an existing Salesforce entity

- Upsert Entity - Use this action to update an existing Salesforce entity or create one if it does not exist

- Delete Entity - Use this action to delete an existing Salesforce entity

- Execute Query - Use this action to execute a SELECT query that is written in Salesforce Object Query Language (SOQL)


##Create a SalesForce Connector API App##
1.	Open the Azure Marketplace using the + NEW option at the bottom right of the Azure Portal.
2.	Browse to “Web and Mobile > API apps” and search for “SalesForce”.
3.	Configure the SalesForce Connector by providing the details for Hosting Plan, the resource group and selecting the name of the API App.

	![][15]
4. Configure the SalesForce Entities you are interested in reading/writing in the 'Package Settings'.

With this, you can now create a SalesForce Conenctor API App.


##Create a Logic App##
Let us create a simple logic app that creates an account in Salesforce and updates billing address details of the same account.

1.	Login to Azure Portal and click on ‘New -> Web + mobile -> Logic App’

	![][1]

2.	In the ‘Create logic app’ page, provide the required details such as name, app service plan and location.

	![][2]

3.	Click on ‘Triggers and Actions’ and the Logic App editor screen comes up.

	![][3]

4.	Select ‘Run this logic manually’ which means that this logic app can be invoked only manually.

    ![][4]

5.	Expand ‘API Apps in this resource group’ in Gallery to see all the available API Apps. Select ‘Salesforce’ from the gallery and the ‘Salesforce connector’ gets added to the flow.


	![][5]

8.	To authorize your Logic App to access your SalesForce account, click on ‘Authorize’ to provide Salesforce login credentials.

	![][6]

9.	You will be redirected to Salesforce login page and you can authenticate with your Salesforce credentials.

	![][7]

	![][8]

10.	Once the authorization is complete, all the actions are displayed.

	![][9]

11.	Select ‘Create Account’ action and the input parameters are displayed.

	![][10]

12.	Provide ‘Account Name’ and click ✓. 

	![][11]

13.	Select ‘Salesforce Connector’ from the ‘Recently Used’ section in the gallery and a new Salesforce action gets added.

14.	Select ‘Update Account’ from the list of actions and the input parameters of ‘Update Account’ action are displayed.

	![][12]

15.	Click on ‘+’ next to ‘Record Id’ to pick the id value from the output of ‘Create Account’ action. 

	![][13]

16.	Provide values for Billing Street, Billing City, Billing State and Billing Zip Code and click ✓.

	![][14]

17. Click on OK on Logic app editor screen and then click 'Create'. It will take approximately 30 seconds for the creation to complete.

18. Browse the newly created Logic App and click on 'Run' to initiate a run.

19. You can check that a new account by name 'Contoso' gets created in your Salesforce account.

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


