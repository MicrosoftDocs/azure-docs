<properties pageTitle="Walkthrough: Activate the Latest SQL Database Update V12 (preview)" description="Describes the steps for trying the preview release of Azure SQL Database V12, by using the new Azure portal UI." services="sql-database" documentationCenter="" authors="MightyPen" manager="jhubbard, jeffreyg" editor=""/>

<tags ms.service="sql-database" ms.workload="sql-database" ms.tgt_pltfrm="na" ms.devlang="na" ms.topic="article" ms.date="12/18/2014" ms.author="genemi"/>

# Walkthrough: Activate the Latest SQL Database Update V12 (preview)

This topic describes the steps you can follow to activate the Azure SQL Database Update V12 (preview), as first released by Microsoft in December 2014.

To try the latest V12 preview you first need a subscription to Microsoft Azure, or at least a [free trial](http://azure.microsoft.com/pricing/free-trial/) subscription.

You can activate the V12 preview by using the new preview Microsoft Azure management portal at [http://portal.azure.com/](http://portal.azure.com/). After you activate the V12 preview for your subscription, the create and upgrade options for the V12 preview become unlocked in the Azure portal. Then users can initiate the create or upgrade workflow from the server blade or the database blade.

If a user attempts to create a new preview database before activation, the Azure portal displays a blade where the user can activate his subscription to the preview, subject to an authorization check.

> [AZURE.NOTE]
> Test databases, database copies, or new databases, are good candidates for upgrading to the preview. Production databases that your business depends on should wait until after the preview period.

For more information about the preview, see [Plan and Prepare to Upgrade to Azure SQL Database V12 (preview)](http://azure.microsoft.com/documentation/articles/sql-database-preview-plan-prepare-upgrade/).


## Security authorization

The first step is to ensure that you have sufficient authorization to activate the V12 preview for your subscription. To try the preview you must have one of the following authorizations:

- The subscription owner
- A co-administrator of the subscription

For more information about Azure accounts, see [Manage Accounts, Subscriptions, and Administrative Roles](http://msdn.microsoft.com/library/hh531793.aspx).

## Steps in the portal UI

This section describes a click sequence that you can follow in the Azure portal UI to activate the V12 preview:

1. In your web browser, navigate to the new Azure portal, which is labeled with the highlighted word **Preview** in its upper-left corner: <p></p> [http://portal.azure.com/](http://portal.azure.com/) <br/>

2. Click on the **+ New** item at the bottom of the hub that runs along the left edge of the UI. <br/> The **New** blade is displayed. <br/>

3. Click the **SQL Database** bar that is on the **New** blade. <br/> The **SQL database** blade is displayed. <br/>

4. Near the top of the **SQL database** blade there is a bar labeled <br/> **Click here to try the preview of the latest SQL Database Update.** <br/> Click the bar. <br/> The blade labeled **Try the latest update (preview)** is displayed. <br/>

5. Select the agreement check box that reminds you this is a "preview" version. <br/> Then click the **OK** button at the bottom of the blade. <br/> Note: the preview version should not be used to handle your mission-critical production databases.

You are now able to use the V12 preview. You can proceed to upgrade your test database, or to create a new test database in the preview version.

## What's next

Next, the following topics explain ways you can use the V12 preview.

- [Create a database in the Latest SQL Database Update V12 (preview)](http://azure.microsoft.com/documentation/articles/sql-database-preview-create/)
- [Upgrade to the Latest SQL Database Update V12 (preview)](http://azure.microsoft.com/documentation/articles/sql-database-preview-upgrade/)

> [AZURE.NOTE]
> Test databases, database copies, or new databases, are good candidates for upgrading to the preview. Production databases that your business depends on should wait until after the preview period.


<!-- EOF -->
