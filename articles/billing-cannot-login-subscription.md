<properties
	pageTitle="I cannot sign in to manage my Azure subscription | Microsoft Azure"
	description="Describes the troubleshoot information for some common Azure subscription login issues"
	services=""
	documentationCenter=""
	authors="genlin"
	manager="msmbaldwin"
	editor=""
	tags="billing"
	/>

<tags
	ms.service="billing"
	ms.workload="na"
	ms.tgt_pltfrm="na"
	ms.devlang="na"
	ms.topic="article"
	ms.date="09/09/2016"
	ms.author="genli"/>

# I cannot sign in to manage my Azure subscription

This article guides you through some of the most common methods to resolve login issues.

> [AZURE.NOTE] If you need more help at any point in this article, please [contact support](http://go.microsoft.com/fwlink/?linkid=544831&clcid=0x409) to get your issue resolved quickly.

## Azure portals

| Name  | Description  |  URL |
|---|---|---|
| Azure portal |A central place where you can provision and manage your Azure resources   | [https://portal.azure.com](https://portal.azure.com)  |
| Azure classic portal  | The old Azure portal |[https://manage.windowsazure.com](https://manage.windowsazure.com)   |
| Azure Account Center | A central place where you can track your Azure usage and manage your subscription |[https://account.windowsazure.com/Subscriptions](https://account.windowsazure.com/Subscriptions)   ||

## Symptom: The page hangs in the loading status

This issue can be caused a problem that affects your Internet browser.

To resolve this issue, try the following methods, in the given order. After you do each method, try to reconnect to the sign-in page on the portal.

-	Refresh the page.
-	Use a different Internet browser.
-	If you’re using Microsoft Internet Explorer, browse to the Azure portal by using the InPrivate Browsing mode. To do this, follow these steps:

	A.	Click **Tools** ![tools button](./media/billing-cannot-login-subscription/Toolsbutton.png) > **Safety** > **InPrivate Browsing**.

	B.	Browse to the [Azure portal](https://portal.azure.com) or the [Azure classic portal](https://manage.windowsazure.com), and then sign in to the portal.

## Symptom: Error message "No subscriptions found”

This issue can occur if the account doesn’t have sufficient user rights. An account administrator can only access the [Account Center](https://account.windowsazure.com/) whereas service administrators (SA) and co-administrators (CA) only have access to the [Azure portal](https://portal.azure.com) or the [Azure classic portal](https://manage.windowsazure.com/).

**Scenario 1: Error message is received in the Azure portal or the Azure classic portal**

To resolve this issue, [add the co-administrator or owner role](billing-add-change-azure-subscription-administrator.md) for the account.

**Scenario 2: Error message is received in the Azure Account Center**

Check whether the account that you used is the account administrator. To verify who the account administrator is, follow these steps:

1.	Sign in to the [Azure portal](https://portal.azure.com).
2.	On the Hub menu, select **Subscription**.
3.	Select the subscription that you want to check, and then select **Settings**.
4.	Select **Properties**. The account administrator of the subscription is displayed in the **Account Admin** box.

## Symptom: You are automatically signed in as a different user

This issue can occur if you're using more than one user account in an Internet browser.

To resolve the issue, try one of the following methods:

- Sign out of the portal,  and then sign back in with the account you want to use.
-	Clear the cache and delete Internet cookies. To do this in Internet Explorer, click **Tools** ![tools button](./media/billing-cannot-login-subscription/Toolsbutton.png) > **Internet Options** > **Delete**, make sure that the check boxes for temporary files, cookies, password, and browsing history are selected, and then click Delete.

-	Reset the Internet Explorer settings to revert any personal settings that you’ve made. To do this, click **Tools** ![tools button](./media/billing-cannot-login-subscription/Toolsbutton.png)> **Internet Options** > **Advanced** >select the **Delete personal settings** box > **Reset**.

-	Browse to the Azure portal in InPrivate Browsing mode. To do this, click **Tools** ![tools button](./media/billing-cannot-login-subscription/Toolsbutton.png) > **Safety** > **InPrivate Browsing**.

## Microsoft account vs Organizational account

Your Microsoft account is the email address you use, along with your password, to sign in to any Windows Live program or service, such as Outlook, Hotmail, MSN or OneDrive. You may set up a Microsoft account using any email address belonging to you, including your company email. Please see [www.microsoft.com/account](http://www.microsoft.com/account) for more details.

If your account is associated with an Organizational account, then please select the correct login option as shown below. For more information on using an Organizational account, see [Sign up for Azure as an organization](./active-directory/sign-up-organization.md):

![sign in page](./media/billing-cannot-login-subscription/signin.png)
