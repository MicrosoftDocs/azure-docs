<properties title="Walkthrough: try the Latest SQL Database Update V12 (preview)" pageTitle="Walkthrough: try the Latest SQL Database Update V12 (preview)" description="Describes the steps for trying the preview release of Azure SQL Database V12, by using the new Azure portal UI." metaKeywords="Azure, SQL DB, Update, Preview, Plan" services="sql-database" documentationCenter="" authors="GeneMi" manager="jeffreyg" videoId="" scriptId=""/>

<tags ms.service="sql-database" ms.workload="sql-database" ms.tgt_pltfrm="na" ms.devlang="na" ms.topic="article" ms.date="12/15/2014" ms.author="genemi"/>

# Walkthrough: try the Latest SQL Database Update V12 (preview)

<!--
Latest update datetime for this topic.
GeneMi  ,  2014-Dec-15 Monday 17:28pm.

http : // azure.microsoft .com/ documentation/articles/ sql-database-latest-preview-sign-up/
-->

This topic describes the steps you can follow to try the Azure SQL Database Update V12 (preview), as released by Microsoft in December 2014.

You can sign up for the V12 preview by using the preview Microsoft Azure management portal at [http://portal.azure.com/](http://portal.azure.com/). Users can initiate the upgrade workflow from the server blade or the database blade. The options to upgrade are locked if you have not yet signed up for the preview. When the locked state blocks further progress, the portal displays a blade that enables you to sign up.

For more information about the preview, see [Plan and Prepare to Upgrade to Azure SQL Database V12 Preview](http://azure.microsoft.com/documentation/articles/sql-database-preview-plan-prepare-upgrade/).


## Security authorization

The first step is to ensure that you have sufficient authorization to sign up for the V12 preview. To try the preview you must have one of the following authorizations:

- The subscription owner
- A co-administrator of the subscription

For more information about Azure accounts, see [Manage Accounts, Subscriptions, and Administrative Roles](http://msdn.microsoft.com/library/hh531793.aspx).

## Steps in the Portal UI

This section describes a click sequence that you can follow in the Azure portal UI to sign up for the V12 preview:

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
