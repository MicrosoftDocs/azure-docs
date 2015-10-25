<properties
	pageTitle= "How to add or change Azure Co-Administrator, Service Administrator and Account Administrator | Microsoft Azure"
	description="Describes how to add or change Azure Co-Administrator, Service Administrator and Account Administrator"
	services="billing"
	documentationCenter=""
	authors="genlin"
	manager="jarrettr"
	editor="meerak"
	tags="billing"
	/>

<tags
	ms.service="billing"
	ms.workload="na"
	ms.tgt_pltfrm="na"
	ms.devlang="na"
	ms.topic="billing"
	ms.date="10/20/2015"
	ms.author="genli"/>

# How to add or change Azure Co-Administrator, Service Administrator and Account Administrator
## Administrator roles

There are three kinds of administrator roles in Windows Azure:

| Administrative role   | Limit  | Description
| ------------- | ------------- |---------------|
|Account Administrator  | 1 per Azure account  |This is the person who signed up for or bought Azure subscriptions, and is authorized to access the Account Center and perform various management tasks. These include being able to create subscriptions, cancel subscriptions, change the billing for a subscription, and change the Service Administrator.
| Service Administrator | 1 per Azure subscription  |This person is authorized to access the Azure Management Portal for subscriptions in the account assigned to them. By default, for a new subscription, the Account Administrator is also the Service Administrator is the.|
|Co-administrator|200 per subscription (in addition to Service Administrator)|This person has the same access privileges as the Service Administrator, but can’t change the association of subscriptions to Azure directories.|

## Add a Co-Administrator for a subscription
1. Sign in to the [Azure Management Portal](https://manage.windowsazure.com/).
2. In the navigation pane, select **Settings**> **Administrators**> **Add**. </br>![addcodmin](./media/billing-add-change-azure-subscription-administrator/addcoadmin.png)
3. Type the email address of the person you want to add as Co-administrator and then select the subscription that you want the Co-administrator to access.</br> ![addcoadmin2](./media/billing-add-change-azure-subscription-administrator/addcoadmin2.png)</br>

The following email address can be added as a Co-Administrator:

* **Microsoft Account** (formerly Windows Live ID) </br>
 You can use a Microsoft Account to sign in to all consumer-oriented Microsoft products and cloud services, such as Outlook (Hotmail), Skype (MSN), OneDrive, Windows Phone, and Xbox LIVE.
* **Organizational account**</br>
 An organizational account is an account that is created under Azure Active Directory. The organizational account address resembles the following:
	user@<your domain>.onmicrosoft.com

**Note**
 * If you are logged in with a Microsoft Account, you can only add other Microsoft Accounts as Co-Administrator. This is a security consideration to prevent non-organizational accounts from discovering if certain accounts (e.g. janedoe@contoso.com) are valid accounts.
 * If you are logged in with an organizational account, you can add other organizational accounts in your organization as Co-Administrator. For example, abby@contoso.com can add bob@contoso.com as Service Administrator or Co-Administrator, but cannot add john@notcontoso.com. Users logged in with organizational accounts can continue to add Microsoft Account users as Service Administrator or Co-Administrator.
 * Now that it is possible to log into Azure with an organizational account, here are the changes to Service Administrator and Co-administrator account requirements:

| Login Method| Add Microsoft Account as Co-Administrator or Service Administrator?  |Add organizational account in the same organization as Co-Administrator or Service Administrator? |Add organizational account in different organization as Co-Administrator or Service Administrator?
| ------------- | ------------- |---------------|---------------|
|Microsoft Account |Yes|No|No|
|Organizational Account|Yes|Yes|No|

## Change Service Administrator for a subscription
Only the Account Administrator can change the Service Administrator for a subscription.

1. Log on into [Account Management Portal](https://account.windowsazure.com/subscriptions) by using the Account Administrator.
2. Select the subscription you want to change.
3. On the right side, click **Edit subscription** details. </br>
![editsub](./media/billing-add-change-azure-subscription-administrator/editsub.png)

4. In the **SERVICE ADMINISTRATOR** box, enter the email address of the new service administrator. ![changeSA](./media/billing-add-change-azure-subscription-administrator/changeSA.png)

## Change the Account Administrator (transfer ownership of the Azure account to another account)

To transfer ownership of the Azure account to another. Account, see [Transferring an Azure subscription](https://azure.microsoft.com/en-us/documentation/articles/billing-subscription-transfer/).
