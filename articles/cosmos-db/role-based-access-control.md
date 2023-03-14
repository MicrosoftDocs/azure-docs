---
title: Azure role-based access control in Azure Cosmos DB 
description: Learn how Azure Cosmos DB provides database protection with Active directory integration (Azure RBAC).
ms.service: cosmos-db
ms.topic: conceptual
ms.date: 05/11/2022
author: seesharprun
ms.author: sidandrews
ms.custom: ignite-2022
---

# Azure role-based access control in Azure Cosmos DB
[!INCLUDE[NoSQL, MongoDB, Cassandra, Gremlin, Table](includes/appliesto-nosql-mongodb-cassandra-gremlin-table.md)]

> [!NOTE]
> This article is about role-based access control for management plane operations in Azure Cosmos DB. If you are using data plane operations, data is secured using primary keys, resource tokens, or the Azure Cosmos DB RBAC. 

To learn more about role-based access control applied to data plane operations in the API for NoSQL, see [Secure access to data](secure-access-to-data.md) and [Azure Cosmos DB RBAC](how-to-setup-rbac.md) articles. For the Azure Cosmos DB API for MongoDB, see [Data Plane RBAC in the API for MongoDB](mongodb/how-to-setup-rbac.md).

Azure Cosmos DB provides built-in Azure role-based access control (Azure RBAC) for common management scenarios in Azure Cosmos DB. An individual who has a profile in Azure Active Directory can assign these Azure roles to users, groups, service principals, or managed identities to grant or deny access to resources and operations on Azure Cosmos DB resources. Role assignments are scoped to control-plane access only, which includes access to Azure Cosmos DB accounts, databases, containers, and offers (throughput).


## Built-in roles

The following are the built-in roles supported by Azure Cosmos DB:

|**Built-in role**  |**Description**  |
|---------|---------|
|[DocumentDB Account Contributor](../role-based-access-control/built-in-roles.md#documentdb-account-contributor)|Can manage Azure Cosmos DB accounts.|
|[Cosmos DB Account Reader](../role-based-access-control/built-in-roles.md#cosmos-db-account-reader-role)|Can read Azure Cosmos DB account data.|
|[CosmosBackupOperator](../role-based-access-control/built-in-roles.md#cosmosbackupoperator)| Can submit a restore request in the Azure portal for a periodic backup enabled database or a container. Can modify the backup interval and retention in the Azure portal. Cannot access any data or use Data Explorer.  |
| [CosmosRestoreOperator](../role-based-access-control/built-in-roles.md#cosmosrestoreoperator) | Can perform a restore action for an Azure Cosmos DB account with continuous backup mode.|
|[Cosmos DB Operator](../role-based-access-control/built-in-roles.md#cosmos-db-operator)|Can provision Azure Cosmos DB accounts, databases, and containers. Cannot access any data or use Data Explorer.|

## Identity and access management (IAM)

The **Access control (IAM)** pane in the Azure portal is used to configure Azure role-based access control on Azure Cosmos DB resources. The roles are applied to users, groups, service principals, and managed identities in Active Directory. You can use built-in roles or custom roles for individuals and groups. The following screenshot shows Active Directory integration (Azure RBAC) using access control (IAM) in the Azure portal:

:::image type="content" source="./media/role-based-access-control/database-security-identity-access-management-rbac.png" alt-text="Access control (IAM) in the Azure portal - demonstrating database security.":::

## Custom roles

In addition to the built-in roles, users may also create [custom roles](../role-based-access-control/custom-roles.md) in Azure and apply these roles to service principals across all subscriptions within their Active Directory tenant. Custom roles provide users a way to create Azure role definitions with a custom set of resource provider operations. To learn which operations are available for building custom roles for Azure Cosmos DB see, [Azure Cosmos DB resource provider operations](../role-based-access-control/resource-provider-operations.md#microsoftdocumentdb)

> [!TIP]
> Custom roles that need to access data stored within Azure Cosmos DB or use Data Explorer in the Azure portal must have `Microsoft.DocumentDB/databaseAccounts/listKeys/*` action.

> [!NOTE]
> Custom role assignments may not always be visible in the Azure portal.

## <a id="prevent-sdk-changes"></a>Preventing changes from the Azure Cosmos DB SDKs

The Azure Cosmos DB resource provider can be locked down to prevent any changes to resources from a client connecting using the account keys (that is applications connecting via the Azure Cosmos DB SDK). This feature may be desirable for users who want higher degrees of control and governance for production environments. Preventing changes from the SDK also enables features such as resource locks and diagnostic logs for control plane operations. The clients connecting from Azure Cosmos DB SDK will be prevented from changing any property for the Azure Cosmos DB accounts, databases, containers, and throughput. The operations involving reading and writing data to Azure Cosmos DB containers themselves are not impacted.

When this feature is enabled, changes to any resource can only be made from a user with the right Azure role and Azure Active Directory credentials including Managed Service Identities.

> [!WARNING]
> Enabling this feature can have impact on your application. Make sure that you understand the impact before enabling it.

### Check list before enabling

This setting will prevent any changes to any Azure Cosmos DB resource from any client connecting using account keys including any Azure Cosmos DB SDK, any tools that connect via account keys. To prevent issues or errors from applications after enabling this feature, check if  applications perform any of the following actions before enabling this feature, including:

- Creating, deleting child resources such as databases and containers. This includes resources for other APIs such as Cassandra, MongoDB, Gremlin, and table resources.

- Reading or updating throughput on database or container level resources.
- Modifying container properties including index policy, TTL and unique keys.

- Modifying stored procedures, triggers or user-defined functions.

If your applications (or users via Azure portal) perform any of these actions they will need to be migrated to execute via [ARM Templates](sql/manage-with-templates.md), [PowerShell](sql/manage-with-powershell.md), [Azure CLI](sql/manage-with-cli.md), REST, or [Azure Management Library](https://github.com/Azure-Samples/cosmos-management-net). Note that Azure Management is available in [multiple languages](../index.yml?product=featured).

### Set via ARM Template

To set this property using an ARM template, update your existing template or export a new template for your current deployment, then include the `"disableKeyBasedMetadataWriteAccess": true` to the properties for the `databaseAccounts` resources. Below is a basic example of an Azure Resource Manager template with this property setting.

```json
{
    {
      "type": "Microsoft.DocumentDB/databaseAccounts",
      "name": "[variables('accountName')]",
      "apiVersion": "2020-04-01",
      "location": "[parameters('location')]",
      "kind": "GlobalDocumentDB",
      "properties": {
        "consistencyPolicy": "[variables('consistencyPolicy')[parameters('defaultConsistencyLevel')]]",
        "locations": "[variables('locations')]",
        "databaseAccountOfferType": "Standard",
        "disableKeyBasedMetadataWriteAccess": true
        }
    }
}
```

> [!IMPORTANT]
> Make sure you include the other properties for your account and child resources when redeploying with this property. Do not deploy this template as is or it will reset all of your account properties.

### Set via Azure CLI

To enable using Azure CLI, use the command below:

```azurecli-interactive
az cosmosdb update  --name [CosmosDBAccountName] --resource-group [ResourceGroupName]  --disable-key-based-metadata-write-access true

```

### Set via PowerShell

To enable using Azure PowerShell, use the command below:

```azurepowershell-interactive
Update-AzCosmosDBAccount -ResourceGroupName [ResourceGroupName] -Name [CosmosDBAccountName] -DisableKeyBasedMetadataWriteAccess true
```

## Next steps

- [What is Azure role-based access control (Azure RBAC)](../role-based-access-control/overview.md)
- [Azure custom roles](../role-based-access-control/custom-roles.md)
- [Azure Cosmos DB resource provider operations](../role-based-access-control/resource-provider-operations.md#microsoftdocumentdb)
- [Configure role-based access control for your Azure Cosmos DB for MongoDB](mongodb/how-to-setup-rbac.md)

