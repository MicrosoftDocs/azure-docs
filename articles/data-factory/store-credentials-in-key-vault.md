---
title: Store credentials in Azure Key Vault | Microsoft Docs
description: Learn how to store credentials for data stores used in an Azure key vault that Azure Data Factory can automatically retrieve at runtime. 
services: data-factory
author: spelluru
manager: jhubbard
editor: ''

ms.service: data-factory
ms.workload: data-services
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 09/08/2017
ms.author: spelluru
---

# Store credential in Azure Key Vault

You can store credentials for data stores in an [Azure Key Vault](../key-vault/key-vault-whatis.md). Azure Data Factory retrieves the credentials when executing an activity that uses the data store.

> [!NOTE]
> Currently, only [Dynamics connector](connector-dynamics-crm-office-365.md) support this feature. 

## Steps

When creating a data factory, a service identity is created along with factory creation. The service identity is a managed application registered to Azure Activity Directory, and represents this specific data factory. You can find the service identity information from Azure portal -> your data factory -> Properties: 

- SERVICE IDENTITY ID
- SERVICE IDENTITY TENANT
- SERVICE IDENTITY APPLICATION ID

To reference a credential stored in Azure Key Vault, you need to:

1. Copy the "SERVICE IDENTITY APPLICATION ID" generated along with your data factory.
2. Grant the service identity access to your Azure Key Vault. In your key vault -> Access control -> Add -> search this service identity application ID to add Reader permission. It allows this designated factory to access secret in key vault.
3. Create a linked service pointing to your Azure Key Vault. Refer to [Azure Key Vault linked service](#azure-key-vault-linked-service).
4. Create data store linked service, inside which reference the corresponding secret stored in key vault. Refer to [Reference credential stored in key vault](#reference-credential-stored-in-key-vault).

## Azure Key Vault linked service

The following properties are supported for Azure Key Vault linked service:

| Property | Description | Required |
|:--- |:--- |:--- |
| type | The type property must be set to: **AzureKeyVault**. | Yes |
| baseUrl | Specify the Azure Key Vault URL (DNS name). | Yes |

**Example:**

```json
{
    "name": "AzureKeyVaultLinkedService",
    "properties": {
        "type": "AzureKeyVault",
        "typeProperties": {
        "baseUrl": "https://<azureKeyVaultName>.vault.azure.net"
        }
    }
}
```

## Reference credential stored in key vault

The following properties are supported when you configure a field in linked service referencing a key vault secret:

| Property | Description | Required |
|:--- |:--- |:--- |
| type | The type property of the field must be set to: **AzureKeyVaultSecret**. | Yes |
| secretName | The name of secret in azure key vault. | Yes |
| secretVersion | The version of secret in azure key vault.<br/>If not specified, it always uses the latest version of the secret.<br/>If specified, then it sticks to the given version.| No |
| store | Refers to an Azure Key Vault linked service that you use to store the credential. | Yes |

**Example: (see the "password" section)**

```json
{
    "name": "DynamicsLinkedService",
    "properties": {
        "type": "Dynamics",
        "typeProperties": {
            "deploymentType": "<>",
            "organizationName": "<>",
            "authenticationType": "<>",
            "username": "<>",
            "password": {
                "type": "AzureKeyVaultSecret",
                "secretName": "mySecret",
                "store":{
                    "linkedServiceName": "<Azure Key Vault linked service>",
                    "type": "LinkedServiceReference"
                }
            }
        }
    }
}
```

## Next steps
For a list of data stores supported as sources and sinks by the copy activity in Azure Data Factory, see [supported data stores](copy-activity-overview.md##supported-data-stores-and-formats).