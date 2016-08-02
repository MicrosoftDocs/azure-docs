<properties
	pageTitle="I am unable to log in to manage my Azure subscription | Microsoft Azure"
	description="Describes the troubleshoot information for some common Azure subscription login issues"
	services=""
	documentationCenter=""
	authors="genlin"
	manager="msmbaldwin"
	editor="na"
	tags="billing"
	/>

<tags
	ms.service="billing"
	ms.workload="na"
	ms.tgt_pltfrm="na"
	ms.devlang="na"
	ms.topic="article"
	ms.date="06/30/2016"
	ms.author="genli"/>

# I am unable to log in to manage my Azure subscription

> [AZURE.NOTE] If you need more help at any point in this article, you can contact the Azure experts on the [MSDN Azure and the Stack Overflow forums](https://azure.microsoft.com/support/forums/). Alternatively, you can also file an Azure support incident on the [Azure Support site](http://go.microsoft.com/fwlink/?linkid=544831&clcid=0x409). For information about using Azure Support, read the [Microsoft Azure Support FAQ](https://azure.microsoft.com/support/faq/).

This article will help you troubleshoot some common causes of login issues.

## Which portal are you trying to access?

An Account Administrator can only access the [Account Center](https://account.windowsazure.com/) whereas Service Administrators (SA) and Co-Administrators (CA) only have access to the [Azure portal](https://portal.azure.com) or the [Azure classic portal](https://manage.windowsazure.com/).

For more information about Azure administrator roles, see [How to add or change Azure administrator roles](billing-add-change-azure-subscription-administrator.md).

## Is your subscription associated with a Microsoft account or Organizational account?

Your Microsoft account is the email address you use, along with your password, to sign in to any Windows Live program or service, such as Outlook, Hotmail, MSN or OneDrive. You may set up a Microsoft account using any email address belonging to you, including your company email. Please see [www.microsoft.com/account](http://www.microsoft.com/account) for more details.

If your account is associated with an Organizational account, then please select the correct login option as shown below. For more information on using an Organizational account, see [Sign up for Azure as an organization](./active-directory/sign-up-organization.md):

![signin page](./media/billing-cannot-login-subscription/signin.png)

## Co-Admin: Are you using the correct account type to manage other accounts?

- If you are logged in with a Microsoft Account, you can only add other Microsoft Accounts as Co-administrators. This is a security requirement to prevent non-organizational accounts from discovering if certain accounts (e.g. janedoe@contoso.com) are valid accounts.
- If you are logged in with an organizational account, you can add other organizational accounts in your organization as Co-administrators. For example, abby@contoso.com can add bob@contoso.com as a Service Administrator or Co-administrator, but cannot add john@notcontoso.com. Users logged in with organizational accounts can also add Microsoft Account users as Service Administrators or Co-administrators.

Now that it is possible to log into Azure with an organizational account, here are the changes to Service Administrator (SA) and Co-administrator (CA) account requirements:

| Login Method| Add Microsoft Account as Co-Administrator or Service Administrator?  |Add organizational account in the same organization as Co-Administrator or Service Administrator? |Add organizational account in different organization as Co-Administrator or Service Administrator?
| ------------- | ------------- |---------------|---------------|
|Microsoft Account |Yes|No|No|
|Organizational Account|Yes|Yes|No|

## Is there a problem with the Internet Browser?

Try deleting cache/cookies, using IE InPrivate Browsing mode and also using a different browser.
