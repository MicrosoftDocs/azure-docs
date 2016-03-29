<properties
	pageTitle="How to add or change Azure administrator roles | Microsoft Azure"
	description="Describes how to add or change Azure Co-Administrator, Service Administrator and Account Administrator"
	services=""
	documentationCenter=""
	authors="genlin"
	manager="msmbaldwin"
	editor="meerak"
	tags="billing"/>

<tags
	ms.service="billing"
	ms.workload="na"
	ms.tgt_pltfrm="na"
	ms.devlang="na"
	ms.topic="article"
	ms.date="03/22/2016"
	ms.author="genli"/>

# How to add or change Azure administrator roles

## How to add an admin for a subscription

**Azure portal**

1. Sign in to the [Azure portal](https://portal.azure.com).

2. On the Hub menu, select **Subscription** > *the subscription that you want the admin to access*.

	![newselectsub](./media/billing-add-change-azure-subscription-administrator/newselectsub.png)

3. In the subscription blade, select **Settings**> **Users**.

	![newsettings](./media/billing-add-change-azure-subscription-administrator/newsettings.png)
4. In the Users blade, select **Add**>**Select a role** > **Owner**.

	![newselectrole](./media/billing-add-change-azure-subscription-administrator/newselectrole.png)

	**Note**
	- The owner role has same access privileges as co-administrator. This role does not have access privilege to the [Azure Account Center](https://account.windowsazure.com/subscriptions).
	- The owners you added through the [Azure portal](https://portal.azure.com) cannot manage services in the [Azure classic portal](https://manage.windowsazure.com).  

5. Type the email address of the user you want to add as owner, click the user, and then click **Select**.

	![newadduser](./media/billing-add-change-azure-subscription-administrator/newadduser.png)
