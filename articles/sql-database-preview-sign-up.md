<properties
	pageTitle="Walkthrough: Activate the Latest SQL Database Update V12 (preview)"
	description="Describes the steps for trying the preview release of Azure SQL Database V12, by using the new Azure preview portal UI."
	services="sql-database"
	documentationCenter=""
	authors="MightyPen"
	manager="jhubbard, jeffreyg"
	editor=""/>

<tags
	ms.service="sql-database"
	ms.workload="data-management" 
	ms.tgt_pltfrm="na"
	ms.devlang="na"
	ms.topic="article"
	ms.date="04/28/2015"
	ms.author="genemi"/>


# Walkthrough: Activate the Latest SQL Database Update V12 (preview)

This topic describes the steps you can follow to activate the Azure SQL Database Update V12 (preview) option, as first released by Microsoft in December 2014.

To try the latest V12 preview you first need a subscription to Microsoft Azure, or at least a [free trial](http://azure.microsoft.com/pricing/free-trial/) subscription.

You can activate the V12 preview by using the new Azure preview portal at [http://portal.azure.com/](http://portal.azure.com/). After you activate the V12 preview for your subscription, the create and upgrade options for the V12 preview become unlocked in the Azure preview portal. Then users can initiate the [create](sql-database-preview-create.md) or [upgrade](sql-database-preview-create.md) workflow from the server blade or the database blade.

> [AZURE.NOTE]
> Test databases, database copies, or new databases, are good candidates for upgrading to the preview. Production databases that your business depends on should wait until after the preview period.

For more information about the preview, see [Plan and Prepare to Upgrade to Azure SQL Database V12 (preview)](sql-database-preview-plan-prepare-upgrade.md).


## A. Security authorization

The first step is to ensure that you have sufficient authorization to activate the V12 preview for your subscription. When you attempt to activate the V12 preview option, an authorization check is performed to verify you have sufficient authority within the subscription.

 To try the preview you must have one of the following authorizations:

- The subscription owner
- A co-administrator of the subscription

For more information about Azure accounts, see [Manage Accounts, Subscriptions, and Administrative Roles](http://msdn.microsoft.com/library/hh531793.aspx).

## B. Steps in the Azure preview portal UI

This section describes a click sequence that you can follow one time in the Azure preview portal UI to activate the V12 preview option. After you activate the option, it remains available thereafter.

All the activation scenarios use the same basic idea. When you first try to [create a new SQL Database server](sql-database-preview-create.md), a blade labeled **Latest Update (preview)** is displayed that offers a check box that you can select to activate your privilege to use the V12 preview version. After you activate the privilege, you never see the check box again. Instead you see a **Yes|No** control you can use to specify whether you want your new server to use the V12 preview. If you choose **No**, you create a V11 server (as reported by SELECT @@VERSION;).

### B.1 Yes|No control for the V12 preview version

After you have activated the V12 preview privilege, you see the **Yes|No** control that is circled in the following Azure preview portal screenshot.

![YesNoOptionForTheV12Preview][Image1]


## C. What's next

Next, the following topics explain ways you can use the V12 preview.

- [Create a database in the Latest SQL Database Update V12 (preview)](sql-database-preview-create.md)
- [Upgrade to the Latest SQL Database Update V12 (preview)](sql-database-preview-upgrade.md)

> [AZURE.NOTE]
> Test databases, database copies, or new databases, are good candidates for upgrading to the preview. Production databases that your business depends on should wait until after the preview period.


<!-- References, Images. -->
[Image1]: ./media/sql-database-preview-sign-up/V12Preview-YesNo-Option-New-SQLDatabase-Server-Newserver-Screenshot-e23.png


<!-- EOF -->
