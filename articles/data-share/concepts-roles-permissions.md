---
title: Roles and requirements for Azure Data Share   
description: Learn about the permissions required to share and receive data using Azure Data Share.
author: sidontha
ms.author: sidontha
ms.service: data-share
ms.topic: conceptual
ms.date: 11/30/2022
ms.custom: subject-rbac-steps
---

# Roles and requirements for Azure Data Share 

This article describes roles and permissions required to share and receive data using Azure Data Share service. 

## Roles and requirements

With Azure Data Share service, you can share data without exchanging credentials between data provider and consumer. For snapshot-based sharing, Azure Data Share service uses Managed Identities (previously known as MSIs) to authenticate to Azure data store. Azure Data Share resource's managed identity needs to be granted access to Azure data store to read or write data.

To share or receive data from an Azure data store, user needs at least the following permissions. 

* Permission to write to the Azure data store. Typically, this permission exists in the **Contributor** role.

For storage and data lake snapshot-based sharing, you also need permission to create role assignment in the Azure data store. Typically, permission to create role assignments exists in the **Owner** role, User Access Administrator role, or a custom role with *Microsoft.Authorization/role assignments/write* permission assigned. This permission isn't required if the data share resource's managed identity is already granted access to the Azure data store. Below is a summary of the roles assigned to Data Share resource's managed identity:

|**Data Store Type**|**Data Provider Source Data Store**|**Data Consumer Target Data Store**|
|---|---|---|
|Azure Blob Storage| Storage Blob Data Reader | Storage Blob Data Contributor
|Azure Data Lake Gen1 | Owner | Not Supported
|Azure Data Lake Gen2 | Storage Blob Data Reader | Storage Blob Data Contributor
|

For SQL snapshot-based sharing, a SQL user needs to be created from an external provider in Azure SQL Database with the same name as the Azure Data Share resource. Microsoft Entra admin permission is required to create this user. Below is a summary of the permission required by the SQL user.

|**SQL Database Type**|**Data Provider SQL User Permission**|**Data Consumer SQL User Permission**|
|---|---|---|
|Azure SQL Database | db_datareader | db_datareader, db_datawriter, db_ddladmin
|Azure Synapse Analytics | db_datareader | db_datareader, db_datawriter, db_ddladmin
|

### Data provider

For storage and data lake snapshot-based sharing, to add a dataset in Azure Data Share, provider data share resource's managed identity needs to be granted access to the source Azure data store. For example, if using a storage account, the data share resource's managed identity is granted the *Storage Blob Data Reader* role. This is done automatically by the Azure Data Share service when user is adding dataset via Azure portal and the user has the proper permission. For example, user is an owner of the Azure data store, or is a member of a custom role that has the *Microsoft.Authorization/role assignments/write* permission assigned. 

Alternatively, user can have owner of the Azure data store add the data share resource's managed identity to the Azure data store manually. This action only needs to be performed once per data share resource.

To create a role assignment for the data share resource's managed identity manually, use the following steps:

1. Navigate to the Azure data store.

1. Select **Access control (IAM)**.

1. Select **Add > Add role assignment**.

   :::image type="content" source="../../includes/role-based-access-control/media/add-role-assignment-menu-generic.png" alt-text="Screenshot that shows Access control (IAM) page with Add role assignment menu open.":::

1. On the **Role** tab, select one of the roles listed in the role assignment table in the previous section.

1. On the **Members** tab, select **Managed identity**, and then select **Select members**.

1. Select your Azure subscription.

1. Select **System-assigned managed identity**, search for your Azure Data Share resource, and then select it.

1. On the **Review + assign** tab, select **Review + assign** to assign the role.

To learn more about role assignments, see [Assign Azure roles using the Azure portal](../role-based-access-control/role-assignments-portal.md). If you're sharing data using REST APIs, you can create role assignment using API by referencing [Assign Azure roles using the REST API](../role-based-access-control/role-assignments-rest.md). 

For SQL snapshot-based sharing, a SQL user needs to be created from an external provider in SQL Database with the same name as the Azure Data Share resource while connecting to SQL database using Microsoft Entra authentication. This user needs to be granted *db_datareader* permission. A sample script along with other prerequisites for SQL-based sharing can be found in the [Share from Azure SQL Database or Azure Synapse Analytics](how-to-share-from-sql.md) tutorial. 

### Data consumer

To receive data into storage account, consumer data share resource's managed identity needs to be granted access to the target storage account. The data share resource's managed identity needs to be granted the *Storage Blob Data Contributor* role. This is done automatically by the Azure Data Share service if the user specifies a target storage account via Azure portal and the user has proper permission. For example, user is an owner of the storage account, or is a member of a custom role that has the *Microsoft.Authorization/role assignments/write* permission assigned. 

Alternatively, user can have owner of the storage account add the data share resource's managed identity to the storage account manually. This action only needs to be performed once per data share resource. To create a role assignment for the data share resource's managed identity manually, follow the below steps. 

1. Navigate to the Azure data store.

1. Select **Access control (IAM)**.

1. Select **Add > Add role assignment**.

   :::image type="content" source="../../includes/role-based-access-control/media/add-role-assignment-menu-generic.png" alt-text="Screenshot that shows Access control (IAM) page with Add role assignment menu open.":::

1. On the **Role** tab, select one of the roles listed in the role assignment table in the previous section. For example, for a storage account, select Storage Blob Data Reader.

1. On the **Members** tab, select **Managed identity**, and then select **Select members**.

1. Select your Azure subscription.

1. Select **System-assigned managed identity**, search for your Azure Data Share resource, and then select it.

1. On the **Review + assign** tab, select **Review + assign** to assign the role.

To learn more about role assignments, see [Assign Azure roles using the Azure portal](../role-based-access-control/role-assignments-portal.md). If you're receiving data using REST APIs, you can create role assignment using API by referencing [Assign Azure roles using the REST API](../role-based-access-control/role-assignments-rest.md). 

For SQL-based target, a SQL user needs to be created from an external provider in SQL Database with the same name as the Azure Data Share resource while connecting to SQL database using Microsoft Entra authentication. This user needs to be granted *db_datareader, db_datawriter, db_ddladmin* permission. A sample script along with other prerequisites for SQL-based sharing can be found in the [Share from Azure SQL Database or Azure Synapse Analytics](how-to-share-from-sql.md) tutorial. 

## Resource provider registration 

You may need to manually register the Microsoft.DataShare resource provider into your Azure subscription in the following scenarios: 

* View Azure Data Share invitation for the first time in your Azure tenant
* Share data from an Azure data store in a different Azure subscription from your Azure Data Share resource
* Receive data into an Azure data store in a different Azure subscription from your Azure Data Share resource

Follow these steps to register the Microsoft.DataShare resource provider into your Azure Subscription. You need *Contributor* access to the Azure subscription to register resource provider.

1. In the Azure portal, navigate to **Subscriptions**.
1. Select the subscription that you're using for Azure Data Share.
1. Select on **Resource Providers**.
1. Search for Microsoft.DataShare.
1. Select **Register**.
 
To learn more about resource provider, refer to [Azure resource providers and types](../azure-resource-manager/management/resource-providers-and-types.md).

## Custom roles for Data Share

This section describes custom roles and permissions required within the custom roles for sharing and receiving data, specific to a Storage account. There are also pre-requisites that are independent of custom role or Azure Data Share role. 

### Pre-requisites for Data Share, in addition to custom role

* For storage and data lake snapshot-based sharing, to add a dataset in Azure Data Share, the provider data share resource's managed identity needs to be granted access to the source Azure data store.  For example, if using a storage account, the data share resource's managed identity is granted the Storage Blob Data Reader role.  
* To receive data into a storage account, the consumer data share resource's managed identity needs to be granted access to the target storage account. The data share resource's managed identity needs to be granted the Storage Blob Data Contributor role.  
* See the [Data Provider](#data-provider) and [Data Consumer](#data-consumer) sections of this article for more specific steps. 
* You may also need to manually register the Microsoft.DataShare resource provider into your Azure subscription for some scenarios. See in [Resource provider registration](#resource-provider-registration) section of this article for specific details. 

### Create custom roles and required permissions

Custom roles can be created in a subscription or resource group for sharing and receiving data. Users and groups can then be assigned the custom role. 

* For creating a custom role, there are actions required for Storage, Data Share, Resources group, and Authorization. See the [Azure resource provider operations document](../role-based-access-control/resource-provider-operations.md#microsoftdatashare) for Data Share to understand the different levels of permissions and choose the ones relevant for your custom role. 
* Alternately, you can use the Azure portal to navigate to IAM, Custom role, Add permissions, Search, search for Microsoft.DataShare permissions to see the list of actions available. 
* To learn more about custom role assignment, refer to [Azure custom roles](../role-based-access-control/custom-roles.md). Once you have your custom role, test it to verify that it works as you expect.  

The following shows an example of how the required actions will be listed in JSON view for a custom role to share and receive data. 

```json
{
"Actions": [ 

"Microsoft.Storage/storageAccounts/read",  

"Microsoft.Storage/storageAccounts/write",  

"Microsoft.Storage/storageAccounts/blobServices/containers/read", 

"Microsoft.Storage/storageAccounts/blobServices/generateUserDelegationKey/action", 

"Microsoft.DataShare/accounts/read", 

"Microsoft.DataShare/accounts/providers/Microsoft.Insights/metricDefinitions/read", 

"Microsoft.DataShare/accounts/shares/listSynchronizations/action", 

"Microsoft.DataShare/accounts/shares/synchronizationSettings/read", 

"Microsoft.DataShare/accounts/shares/synchronizationSettings/write", 

"Microsoft.DataShare/accounts/shares/synchronizationSettings/delete", 

"Microsoft.DataShare/accounts/shareSubscriptions/*", 

"Microsoft.DataShare/listInvitations/read", 

"Microsoft.DataShare/locations/rejectInvitation/action", 

"Microsoft.DataShare/locations/consumerInvitations/read", 

"Microsoft.DataShare/locations/operationResults/read", 

"Microsoft.Resources/subscriptions/resourceGroups/read", 

"Microsoft.Resources/subscriptions/resourcegroups/resources/read", 

"Microsoft.Authorization/roleAssignments/read", 
 ] 
}
```

## Next steps

- Learn more about roles in Azure - [Understand Azure role definitions](../role-based-access-control/role-definitions.md)
