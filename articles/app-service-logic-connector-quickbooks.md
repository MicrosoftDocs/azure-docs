<properties 
   pageTitle="QuickBooks Connector" 
   description="How to use the QuickBooks Connector" 
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


#Using the QuickBooks Connector in your Logic App#

Logic apps can trigger based on a variety of data sources and offer connectors to get and process data as a part of the flow. QuickBooks connector lets you create and modify different QuickBooks entities. Following is the list of QuickBooks entities that are supported by the QuickBooks Connector.

<Table>
<TR><TD><B>Entities</TD><TD><B>Description</TR>
<TR>	<TD>	Account	</TD>	<TD>	Account is a component of a Chart Of Accounts, and is part of a Ledger. Used to record a total monetary amount allocated against a specific use	</TD>	</TR>
<TR>	<TD>	CreditMemo	</TD>	<TD>	The CreditMemo is a financial transaction representing a refund or credit of payment or part of a payment for goods or services that have been sold.	</TD>	</TR>
<TR>	<TD>	Customer	</TD>	<TD>	A customer is a consumer of the service or product that your business offers.	</TD>	</TR>
<TR>	<TD>	Estimate	</TD>	<TD>	The Estimate represents a proposal for a financial transaction from a business to a customer for goods or services proposed to be sold, including proposed pricing.	</TD>	</TR>
<TR>	<TD>	Invoice	</TD>	<TD>	An Invoice represents a sales form where the customer pays for a product or service later. Additional information about using the Invoice data model can be found here.	</TD>	</TR>
<TR>	<TD>	Item	</TD>	<TD>	An item is a thing that your company buys, sells, or re-sells, such as products, shipping and handling charges, discounts, and sales tax (if applicable).  An item is shown as a line on an invoice or other sales form.	</TD>	</TR>
<TR>	<TD>	SalesReceipt	</TD>	<TD>	This entity represents the sales receipt that is given to a customer.	</TD>	</TR>
</Table>


##QuickBooks Actions ##
Following are the different actions available in QuickBooks connector.
	<table>
	<tbody>
		<tr><td>
		<strong>Action</strong>
		</td>
		<td>
		<strong>Description</strong>
		</td>
		</tr>
		<tr>
		<td>
		Read Entity
		</td>
		<td>
		Read entity object.
		</td>
		</tr>
		<tr>
		<td>
		Create Or Update Entity
		</td>
		<td>
		Create or Update entity object. Object is updated if it already exists else a new object is created.
		</td>
		</tr>
		<tr>
		<td>
		Delete
		</td>
		<td>
		This action deletes specified object from selected entity.
		</td>
		</tr>
		<tr>	
		<td>
		Query
		</td>
		<td>
		The query operation is the method for creating a guided query against an entity.
		</td>
		</tr>
	</tbody>
	</table>

##Create a QuickBooks Connector API App##
1.	Open the Azure Marketplace using the + NEW option at the bottom right of the Azure Portal.
2.	Browse to “Web and Mobile > API apps” and search for “QuickBooks”.
3.	Configure the QuickBooks Connector by providing the details for Hosting Plan, the resource group and selecting the name of the API App.

	![][13]
4. Configure the QuickBooks Entities you are interested in reading/writing in the 'Package Settings'.

With this, you can now create a QuickBooks Conenctor API App.


##Create a Logic App##
Let us create a simple logic app that creates an account in QuickBooks and update 'Category Type' of the same account.

1.	Login to Azure Portal and click on ‘New -> Web + mobile -> Logic App’

	![][1]

2.	In the ‘Create logic app’ page, provide the required details such as name, app service plan and location.

	![][2]

3.	Click on ‘Triggers and Actions’ and the Logic App editor screen comes up.

	![][3]

4.	Select ‘Run this logic manually’ which means that this logic app can be invoked only manually.


5.	Expand ‘API Apps in this resource group’ in Gallery to see all the available API Apps. Select ‘QuickBooks Connector’ from the gallery and the ‘QuickBooks Connector’ gets added to the flow.


6.	You would have to authenticate and authorize logic apps to perform operations on your behalf if QuickBooks online. To start the authorization click Authorize on QuickBooks Connector.

	![][4]

7.	Clicking Authorize would open QuickBook’s authentication dialog. Provide the login details of the QuickBooks account on which you want to perform the operations.

	![][5]

8. Grant logic apps access to your account to perform operation on your behalf by clicking Authorize on the consent dialog.

	![][6]

9.	Once the authorization is complete, all the actions are displayed.

	![][7]

10.	Select ‘Create Or Update Account’ action and the input parameters are displayed.

	![][8]

11.	Provide ‘Name’ and 'Account Type' and click ✓. 

	![][9]

12.	Select ‘QuickBooks Connector’ from the ‘Recently Used’ section in the gallery and a new QuickBooks action gets added.

13.	Select ‘Create or Update Account’ from the list of actions and the input parameters of the action are displayed.

	![][10]

14.	Click on ‘+’ next to ‘Id’ to pick the id value from the output of Create Account action. 

	![][11]

15.	Provide new values for Account Type and click ✓.

	![][12]

16. Click on OK on Logic app editor screen and then click 'Create'. It will take approximately 30 seconds for the creation to complete.

17. Browse the newly created Logic App and click on 'Run' to initiate a run.

18. You can check that a new account by name 'Contoso' gets created in your QuickBooks account.

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


