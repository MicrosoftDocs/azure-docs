---
title: Create and manage Azure Database for PostgreSQL - Flexible Server with data  encrypted by Customer Managed Keys using Azure REST API
description: Create and manage  Azure Database for PostgreSQL - Flexible Server with data  encrypted by Customer Managed Keys using Azure REST API
author: gennadNY 
ms.author: gennadyk
ms.service: postgresql
ms.subservice: flexible-server
ms.topic: how-to
ms.date: 04/13/2023
---
# Create and manage  Azure Database for PostgreSQL - Flexible Server with data  encrypted by Customer Managed Keys (CMK) using Azure REST API

[!INCLUDE [applies-to-postgresql-flexible-server](../includes/applies-to-postgresql-flexible-server.md)]

In this article, you learn how to create  Azure Database for PostgreSQL with data encrypted by Customer Managed Keys (CMK) by using the  Azure REST API. For more information on encryption with Customer Managed Keys (CMK), see [overview](../flexible-server/concepts-data-encryption.md).

## Setup Customer Managed Key during Server Creation

Prerequisites:
- You must have an Azure subscription and be an administrator on that subscription.
- Azure managed identity in region where Postgres Flex Server will be created. 
- Key Vault with key in region where Postgres Flex Server will be created. Follow this [tutorial](../../key-vault/general/quick-create-portal.md) to create Key Vault and generate key. 


> [!NOTE]  
> API examples below are based on 2022-12-01 API version 

You can create a PostgreSQL Flexible Server encrypted with Customer Managed Key  by using the [create API](/rest/api/postgresql/flexibleserver/servers/create?tabs=HTTP):
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

- [Flexible Server encryption with Customer Managed Key (CMK)](../flexible-server/concepts-data-encryption.md)
- [Microsoft Entra ID](../../active-directory-domain-services/overview.md)
