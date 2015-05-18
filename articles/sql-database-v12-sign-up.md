<properties
	pageTitle="Walkthrough: Activate the latest SQL Database Update V12"
	description="Describes the steps for trying the V12 version of Azure SQL Database, by using the new Microsoft Azure portal UI."
	services="sql-database"
	documentationCenter=""
	authors="MightyPen"
	manager="jeffreyg"
	editor=""/>


<tags
	ms.service="sql-database"
	ms.workload="data-management" 
	ms.tgt_pltfrm="na"
	ms.devlang="na"
	ms.topic="article"
	ms.date="04/28/2015"
	ms.author="genemi"/>


# Walkthrough: Activate the Latest SQL Database Update V12

This topic describes the steps you can follow to activate the Azure SQL Database V12 option, as first released by Microsoft in December 2014.

To try the latest V12 you first need a subscription to Microsoft Azure, or at least a [free trial](http://azure.microsoft.com/pricing/free-trial/) subscription.

You can activate V12 by using the new Azure preview portal at [http://portal.azure.com/](http://portal.azure.com/), instead of the [older Azure portal](http://manage.windowsazure.com/). After you activate V12 for your subscription, the create and upgrade options for V12 become unlocked in the Azure preview portal. Then users can initiate the [create](sql-database-create.md) workflow from the server blade or the database blade.

> [AZURE.NOTE]
> Test databases, database copies, or new databases, are good candidates for upgrading to the preview. Production databases that your business depends on should wait until after the preview period.

For more information about the upgrade to V12, see [Plan and Prepare to Upgrade to Azure SQL Database V12](sql-database-v12-plan-prepare-upgrade.md).


## A. Security authorization

The first step is to ensure that you have sufficient authorization to activate V12 for your subscription. When you attempt to activate the V12 option, an authorization check is performed to verify you have sufficient authority within the subscription.

 To try V12 you must have one of the following authorizations:

- The subscription owner
- A co-administrator of the subscription

For more information about Azure accounts, see [Manage Accounts, Subscriptions, and Administrative Roles](http://msdn.microsoft.com/library/hh531793.aspx).

## B. Steps in the Azure preview portal UI

This section describes a click sequence that you can follow one time in the Azure preview portal UI to activate V12 option. After you activate the option, it remains available thereafter.

All the activation scenarios use the same basic idea. When you first try to [create a new SQL Database server](sql-database-create.md), a blade labeled **Latest Update (preview)** is displayed that offers a check box that you can select to activate your privilege to use V12 version. After you activate the privilege, you never see the check box again. Instead you see a **Yes|No** control you can use to specify whether you want your new server to use V12. If you choose **No**, you create a V11 server (as reported by SELECT @@VERSION;).

### B.1 Yes|No control for the V12 version

After you have activated the V12 option privilege, you see the **Yes|No** control that is circled in the following Azure preview portal screenshot.

![YesNoOptionForTheV12Preview][Image1]


## C. What's next

Next, the following topics explain ways you can use SQL Database V12.

- [Create a database in SQL Database Update V12](sql-database-create.md)


<!-- References, Images. -->
[Image1]: ./media/sql-database-v12-sign-up/V12Preview-YesNo-Option-New-SQLDatabase-Server-Newserver-Screenshot-e23.png

