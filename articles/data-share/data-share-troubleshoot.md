---
title: Troubleshoot Azure Data Share 
description: Learn how to troubleshoot issues with invitations and errors when creating or receiving data shares with Azure Data Share.
services: data-share
author: joannapea
ms.author: joanpo
ms.service: data-share
ms.topic: troubleshooting
ms.date: 07/10/2019
---

# Troubleshoot common issues in Azure Data Share 

This article shows how to troubleshoot common issues for Azure Data Share. 

## Azure Data Share invitations 

In some cases, when a new user clicks **Accept Invitation** from the e-mail invitation that was sent, they may be presented with an empty list of invitations. 

![No invitations](media/no-invites.png)

This could be due to the following reasons:

* **Azure Data Share service is not registered as a resource provider of any Azure subscription in the Azure tenant.** You will experience this issue if there is no Data Share resource in your Azure tenant. When you create an Azure Data Share resource, it automatically registers the resource provider in your Azure subscription. You can also manually register the Data Share service following these steps. You'll need to have the Azure Contributor role to complete these steps.

    1. In the Azure portal, navigate to **Subscriptions**
    1. Select the subscription you want to use to create Azure Data Share resource
    1. Click on **Resource Providers**
    1. Search for **Microsoft.DataShare**
    1. Click **Register** 

    You'll need to have the [Azure Contributor RBAC role](https://docs.microsoft.com/azure/role-based-access-control/built-in-roles#contributor) to complete these steps. 

* **Invitation is sent to your email alias instead of your Azure login email.** If you have registered the Azure Data Share service or have already created a Data Share resource in the Azure tenant, but still cannot see the invitation, it maybe because the provider has entered your email alias as recipient instead of your Azure login email address. Contact your data provider and ensure that they have sent the invitation to your Azure login e-mail address and not your e-mail alias.

* **Invitation has already been accepted.** The link in the email takes you to the Data Share Invitation page in Azure portal, which only lists pending invitations. If you have already accepted the invitation, it will no longer show up in the Data Share Invitation page. Proceed to your Data Share resource which you used to accept the invitation into to view received shares and configure your target Azure Data Explorer cluster setting.

## Error when creating or receiving a new share

"Failed to add datasets"

"Failed to map datasets"

"Unable to grant Data Share resource x access to y"

"You do not have proper permissions to x"

"We could not add write permissions for Azure Data Share account to one or more of your selected resources"

If you receive any of the above errors when creating a new share or mapping datasets, it could be due to insufficient permissions to the Azure data store. See [Roles and requirements](concepts-roles-permissions.md) for required permissions. 

You need write permission to share or receive data from an Azure data store, which typically exists in the Contributor role. 

If this is the first time you are sharing or receiving data from the Azure data store, you also need *Microsoft.Authorization/role assignments/write* permission, which typically exists in the Owner role. Even if you created the Azure data store resource, it does NOT automatically make you the owner of the resource. With proper permission, Azure Data Share service automatically grants the data share resource's managed identity access to the data store. This process could take a few minutes to take effect. If you experience failure due to this delay, try again in a few minutes.

SQL-based sharing requires additional permissions. See Troubleshooting SQL-based sharing for details.

## Troubleshooting SQL-based sharing

"User x does not exist in SQL Database"

If you receive this error when adding a dataset from a SQL-based source, it may be because you did not create a user for the Azure Data Share managed identity in SQL Database.  To resolve this issue, run the following script:

```sql
    create user "<share_acct_name>" from external provider; 
    exec sp_addrolemember db_datareader, "<share_acct_name>";
```      
If you receive this error when mapping dataset to a SQL-based target, it may be because you did not create a user for the Azure Data Share managed identity on your SQL Server.  To resolve this issue, run the following script:

```sql
    create user "<share_acc_name>" from external provider; 
    exec sp_addrolemember db_datareader, "<share_acc_name>"; 
    exec sp_addrolemember db_datawriter, "<share_acc_name>"; 
    exec sp_addrolemember db_ddladmin, "<share_acc_name>";
```
Note that the *<share_acc_name>* is the name of your Data Share resource.      

Ensure that you have followed all prerequisites listed in [Share your data](share-your-data.md) and [accept and receive data](subscribe-to-data-share.md) tutorial.

## Snapshot failed
Snapshot could fail due to a variety of reasons. You can find detailed error message by clicking on the start time of the snapshot and then the status of each dataset. 

If the error message is related to permission, verify Data Share service has the required permission. See [Roles and requirements](concepts-roles-permissions.md) for details. If this is the first time you are taking a snapshot, it could take a few minutes for Data Share resource to be granted access to the Azure data store. Wait for a few minutes and try again.

## Next steps

To learn how to start sharing data, continue to the [share your data](share-your-data.md) tutorial. 

To learn how to receive data, continue to the [accept and receive data](subscribe-to-data-share.md) tutorial.

