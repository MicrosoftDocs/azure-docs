---
title: Troubleshoot Azure Data Share 
description: Learn how to troubleshoot problems with invitations and errors when you create or receive data shares in Azure Data Share.
services: data-share
author: sidontha
ms.author: sidontha
ms.service: data-share
ms.topic: troubleshooting
ms.date: 11/30/2022
---

# Troubleshoot common problems in Azure Data Share 

This article explains how to troubleshoot common problems in Azure Data Share. 

## Azure Data Share invitations 

In some cases, when new users select **Accept Invitation** in an email invitation, they might see an empty list of invitations. This problem could have one of the following causes:

* **The Azure Data Share service isn't registered as a resource provider of any Azure subscription in the Azure tenant.** This problem happens when your Azure tenant has no Data Share resource. 

    When you create an Azure Data Share resource, it automatically registers the resource provider in your Azure subscription. You can manually register the Data Share service by using the following steps. To complete these steps, you need the [Contributor role](../role-based-access-control/built-in-roles.md#contributor) for the Azure subscription. 

    1. In the Azure portal, go to **Subscriptions**.
    1. Select the subscription you want to use to create the Azure Data Share resource.
    1. Select **Resource Providers**.
    1. Search for **Microsoft.DataShare**.
    1. Select **Register**.

* **The invitation is sent to your email alias instead of your Azure sign-in email address.** If you already registered the Azure Data Share service or created a Data Share resource in the Azure tenant, but you still can't see the invitation, your email alias might be listed as the recipient. Contact your data provider and ensure that the invitation will be sent to your Azure sign-in email address and not your email alias.

* **The invitation is already accepted.** The link in the email takes you to the **Data Share Invitations** page in the Azure portal. This page lists only pending invitations. Accepted invitations don't appear on the page. To view received shares and configure your target Azure Data Explorer cluster setting, go to the Data Share resource you used to accept the invitation.

* **You are guest user of the tenant.** If you're a guest user of the tenant, you'll need to verify your email address for the tenant prior to viewing the invitation. Once verified, it's valid for 12 months. 

## Creating and receiving shares

The following errors might appear when you create a new share, add datasets, or map datasets:

* Failed to add datasets.
* Failed to map datasets.
* Unable to grant Data Share resource x access to y.
* You don't have proper permissions to x.
* We couldn't add write permissions for the Azure Data Share account to one or more of your selected resources.

You might see one of these errors if you have insufficient permissions to the Azure data store. For more information, see [Roles and requirements](concepts-roles-permissions.md). 

You need the write permission to share or receive data from an Azure data store. This permission is typically part of the Contributor role. 

If you're sharing data or receiving data from the Azure data store for the first time, you also need the *Microsoft.Authorization/role assignments/write* permission. This permission is typically part of the Owner role. Even if you created the Azure data store resource, you're not necessarily the owner of the resource. 

When you have the proper permissions, the Azure Data Share service automatically allows the data share resource's managed identity to access the data store. This process can take a few minutes. If you experience failure because of this delay, try again after a few minutes.

SQL-based sharing requires extra permissions. For information about prerequisites, see [Share from SQL sources](how-to-share-from-sql.md).

## Snapshots
A snapshot can fail for various reasons. Open a detailed error message by selecting the start time of the snapshot and then the status of each dataset. 

Snapshots commonly fail for these reasons:

* Data Share lacks permission to read from the source data store or to write to the target data store. For more information, see [Roles and requirements](concepts-roles-permissions.md). If you're taking a snapshot for the first time, the Data Share resource might need a few minutes to get access to the Azure data store. After a few minutes, try again.
* The Data Share connection to the source data store or target data store is blocked by a firewall.
* A shared dataset, source data store, or target data store was deleted.

For storage accounts, a snapshot can fail because a file is being updated at the source while the snapshot is happening. As a result, a 0-byte file might appear at the target. After the update at the source, snapshots should succeed.

For SQL sources, a snapshot can fail for these other reasons:

* The source SQL script or target SQL script that grants Data Share permission hasn't run. Or for Azure SQL Database or Azure Synapse Analytics (formerly Azure SQL Data Warehouse), the script runs by using SQL authentication rather than Azure Active Directory authentication. You can run the below query to check if the Data Share account has proper permission to the SQL database. For source SQL database, query result should show Data Share account has *db_datareader* role. For target SQL database, query result should show Data Share account has *db_datareader*, *db_datawriter*, and *db_dlladmin* roles.

    ```sql
        SELECT DP1.name AS DatabaseRoleName,
        isnull (DP2.name, 'No members') AS DatabaseUserName
        FROM sys.database_role_members AS DRM
        RIGHT OUTER JOIN sys.database_principals AS DP1
        ON DRM.role_principal_id = DP1.principal_id
        LEFT OUTER JOIN sys.database_principals AS DP2
        ON DRM.member_principal_id = DP2.principal_id
        WHERE DP1.type = 'R'
        ORDER BY DP1.name; 
     ``` 

* The source data store or target SQL data store is paused.
* The snapshot process or target data store doesn't support SQL data types. For more information, see [Share from SQL sources](how-to-share-from-sql.md#supported-data-types).
* The source data store or target SQL data store is locked by other processes. Azure Data Share doesn't lock these data stores. But existing locks on these data stores can make a snapshot fail.
* The target SQL table is referenced by a foreign key constraint. During a snapshot, if a target table has the same name as a table in the source data, Azure Data Share drops the table and creates a new table. If the target SQL table is referenced by a foreign key constraint, the table can't be dropped.
* A target CSV file is generated, but the data can't be read in Excel. You might see this problem when the source SQL table contains data that includes non-English characters. In Excel, select the **Get Data** tab and choose the CSV file. Select the file origin **65001: Unicode (UTF-8)**, and then load the data.

## Update snapshot schedule
After the data provider updates the snapshot schedule for the sent share, the data consumer needs to disable the previous snapshot schedule, then enable the updated snapshot schedule for the received share. Snapshot schedule is stored in UTC, and shown in the UI as the computer local time. It doesn't automatically adjust for daylight saving time.  

## In-place sharing
Dataset mapping can fail for Azure Data Explorer clusters due to the following reasons:

* User doesn't have *write* permission to the Azure Data Explorer cluster. This permission is typically part of the Contributor role. 
* The source or target Azure Data Explorer cluster is paused.
* Source Azure Data Explorer cluster is EngineV2 and target is EngineV3, or vice versa. Sharing between Azure Data Explorer clusters of different engine versions isn't supported.

## Next steps

To learn how to start sharing data, continue to the [Share data](share-your-data.md) tutorial. 

To learn how to receive data, continue to the [Accept and receive data](subscribe-to-data-share.md) tutorial.