<properties
   pageTitle="Using the QuickBooks connector in Logic apps | Microsoft Azure App Service"
   description="How to create and configure the QuickBooks connector or API app and use it in a logic app in Azure App Service"
   services="app-service\logic"
   documentationCenter=".net,nodejs,java"
   authors="anuragdalmia"
   manager="erikre"
   editor=""/>

<tags
   ms.service="logic-apps"
   ms.devlang="multiple"
   ms.topic="article"
   ms.tgt_pltfrm="na"
   ms.workload="integration"
   ms.date="05/31/2016"
   ms.author="sameerch"/>


# Get started with the QuickBooks connector and add it to your Logic app
>[AZURE.NOTE] This version of the article applies to Logic apps 2014-12-01-preview schema version.

Use the QuickBooks connector to create and modify different QuickBooks entities. The following table lists the supported entities:

Entities|Description
---|---
Account|Account is a component of a Chart Of Accounts, and is part of a Ledger. Used to record a total monetary amount allocated against a specific use
CreditMemo|The CreditMemo is a financial transaction representing a refund or credit of payment or part of a payment for goods or services that have been sold.
Customer|A customer is a consumer of the service or product that your business offers.
Estimate|The Estimate represents a proposal for a financial transaction from a business to a customer for goods or services proposed to be sold, including proposed pricing.
Invoice|An Invoice represents a sales form where the customer pays for a product or service later. Additional information about using the Invoice data model can be found here.
Item|An item is a thing that your company buys, sells, or re-sells, such as products, shipping and handling charges, discounts, and sales tax (if applicable).  An item is shown as a line on an invoice or other sales form.
SalesReceipt|This entity represents the sales receipt that is given to a customer.

Logic apps can trigger based on a variety of data sources and offer connectors to get and process data as a part of the flow. You can add the QuickBooks connector to your business workflow and process data as part of this workflow within a Logic app. 

##QuickBooks Actions ##
Following are the different actions available in QuickBooks connector.

Action|Description
---|---
Read Entity|Read entity object
Create Or Update Entity|Create or Update entity object. Object is updated if it already exists else a new object is created
Delete|This action deletes specified object from selected entity
Query|The query operation is the method for creating a guided query against an entity.

##Create a QuickBooks connector API app##
1.	Open the Azure Marketplace using the + NEW option at the bottom right of the Azure Portal.
2.	Browse to “Web and Mobile > API apps” and search for “QuickBooks”.
3.	Configure the QuickBooks connector by providing the details for Hosting Plan, the resource group and selecting the name of the API app.

	![][13]
4. Configure the QuickBooks Entities you are interested in reading/writing in the 'Package Settings'.

With this, you can now create a QuickBooks Conenctor API app.


##Create a Logic app##
Let us create a simple Logic app that creates an account in QuickBooks and update 'Category Type' of the same account.

1.	Login to Azure Portal and click on ‘New -> Web + mobile -> Logic app’

	![][1]

2.	In the ‘Create logic app’ page, provide the required details such as name, app service plan and location.

	![][2]

3.	Click on ‘Triggers and Actions’ and the Logic app editor screen comes up.

	![][3]

4.	Select ‘Run this logic manually’ which means that this Logic app can be invoked only manually.


5.	Expand ‘API apps in this resource group’ in Gallery to see all the available API apps. Select ‘QuickBooks connector’ from the gallery and the ‘QuickBooks connector’ gets added to the flow.


6.	You would have to authenticate and authorize Logic apps to perform operations on your behalf if QuickBooks online. To start the authorization click Authorize on QuickBooks connector.

	![][4]

7.	Clicking Authorize would open QuickBook’s authentication dialog. Provide the login details of the QuickBooks account on which you want to perform the operations.

	![][5]

8. Grant Logic apps access to your account to perform operation on your behalf by clicking Authorize on the consent dialog.

	![][6]

9.	Once the authorization is complete, all the actions are displayed.

	![][7]

10.	Select ‘Create Or Update Account’ action and the input parameters are displayed.

	![][8]

11.	Provide ‘Name’ and 'Account Type' and click ✓.

	![][9]

12.	Select ‘QuickBooks connector’ from the ‘Recently Used’ section in the gallery and a new QuickBooks action gets added.

13.	Select ‘Create or Update Account’ from the list of actions and the input parameters of the action are displayed.

	![][10]

14.	Click on ‘+’ next to ‘Id’ to pick the id value from the output of Create Account action.

	![][11]

15.	Provide new values for Account Type and click ✓.

	![][12]

16. Click on OK on Logic app editor screen and then click 'Create'. It will take approximately 30 seconds for the creation to complete.

17. Browse the newly created Logic app and click on 'Run' to initiate a run.

18. You can check that a new account by name 'Contoso' gets created in your QuickBooks account.

## Do more with your connector
Now that the connector is created, you can add it to a business workflow using a Logic app. See [What are Logic apps?](app-service-logic-what-are-logic-apps.md).

>[AZURE.NOTE] If you want to get started with Azure Logic apps before signing up for an Azure account, go to [Try Logic App](https://tryappservice.azure.com/?appservice=logic), where you can immediately create a short-lived starter Logic app in App Service. No credit cards required; no commitments.

View the Swagger REST API reference at [Connectors and API Apps Reference](http://go.microsoft.com/fwlink/p/?LinkId=529766).

You can also review performance statistics and control security to the connector. See [Manage and Monitor your built-in API Apps and connector](app-service-logic-monitor-your-connectors.md).

<!--Image references-->
[1]: ./media/app-service-logic-connector-quickbooks/1_New_Logic_App.png
[2]: ./media/app-service-logic-connector-quickbooks/2_Logic_App_Settings.png
[3]: ./media/app-service-logic-connector-quickbooks/3_Logic_App_Editor.png
[4]: ./media/app-service-logic-connector-quickbooks/4_QuickBooks_Authorize.png
[5]: ./media/app-service-logic-connector-quickbooks/5_QuickBooks_Login.png
[6]: ./media/app-service-logic-connector-quickbooks/6_QuickBooks_User_Consent.png
[7]: ./media/app-service-logic-connector-quickbooks/7_QuickBooks_Actions.png
[8]: ./media/app-service-logic-connector-quickbooks/8_QuickBooks_Create_Account.png
[9]: ./media/app-service-logic-connector-quickbooks/9_Create_Account_OK.png
[10]: ./media/app-service-logic-connector-quickbooks/10_QuickBooks_Update_Account.png
[11]: ./media/app-service-logic-connector-quickbooks/11_Record_ID_from_Create.png
[12]: ./media/app-service-logic-connector-quickbooks/12_Update_Account_Address.png
[13]: ./media/app-service-logic-connector-quickbooks/13_Create_new_quickbooks_connector.png
