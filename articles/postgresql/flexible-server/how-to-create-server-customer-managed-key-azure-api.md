---
title: Create and manage with data encrypted by customer managed keys using Azure REST API
description: Create and manage  Azure Database for PostgreSQL - Flexible Server with data  encrypted by Customer Managed Keys using Azure REST API.
author: gennadNY
ms.author: gennadyk
ms.reviewer: maghan
ms.date: 04/27/2024
ms.service: postgresql
ms.subservice: flexible-server
ms.topic: how-to
---
# Create and manage  Azure Database for PostgreSQL - Flexible Server with data  encrypted by Customer Managed Keys (CMK) using Azure REST API

[!INCLUDE [applies-to-postgresql-flexible-server](../includes/applies-to-postgresql-flexible-server.md)]

In this article, you learn how to create an Azure Database for PostgreSQL flexible server instance with data encrypted by customer managed keys (CMK) by using the  Azure REST API. For more information on encryption with Customer Managed Keys (CMK), see [overview](../flexible-server/concepts-data-encryption.md).

## Set up customer managed key during server creation

Prerequisites:
- You must have an Azure subscription and be an administrator on that subscription.
- Azure managed identity in region where the Azure Database for PostgreSQL flexible server instance will be created. 
- Key Vault with key in region where the Azure Database for PostgreSQL flexible server instance will be created. Follow this [tutorial](../../key-vault/general/quick-create-portal.md) to create Key Vault and generate key. 


> [!NOTE]  
> API examples below are based on 2022-12-01 API version 

You can create an Azure Database for PostgreSQL flexible server instance encrypted with customer managed key  by using the [create API](/rest/api/postgresql/flexibleserver/servers/create?tabs=HTTP):
```rest
PUT https://management.azure.com/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.DBForPostgreSql/flexibleServers/{serverName}?api-version=2022-12-01

```
```json
{
	"location": "eastus",
	"identity": {
		"type": "UserAssigned",
		"UserAssignedIdentities": {
			"/subscriptions/{subscriptionId}/resourcegroups/{resourceGroupName}/providers/Microsoft.ManagedIdentity/userAssignedIdentities/{userIdentity}": {}
		}
	},
	"properties": {
		"CreateMode": "Create",
		"administratorLogin": "admin",
		"AdministratorLoginPassword": "p@ssw0rd",
		"version": "14",
		"dataencryption": {
			"type": "AzureKeyVault",
			"primaryUserAssignedIdentityId": "/subscriptions/{subscriptionId}/resourcegroups/{resourceGroupName}/providers/Microsoft.ManagedIdentity/userAssignedIdentities/{userIdentity}",
			"primaryKeyUri": {keyVaultUri}
		}
	}
}
```
Key Vault Uri can be copied from key properties **Key Identifier** field  in Azure Key Vault Portal UI, as shown in image below:
:::image type="content" source="./media/how-to-create-server-customer-managed-key-azure-api/key-uri-portal.png" alt-text =" Screenshot of  key properties and URI on Azure Key Vault Portal page." :::
You can also programmatically fetch Key Vault Uri using [Azure REST API](/rest/api/keyvault/keyvault/vaults/get?tabs=HTTP)

## Next steps

- [Azure Database for PostgreSQL - Flexible Server encryption with customer managed key (CMK)](../flexible-server/concepts-data-encryption.md)
- [Microsoft Entra ID](../../active-directory-domain-services/overview.md)
