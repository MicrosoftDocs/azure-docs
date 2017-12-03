---
title: Store credentials in Azure Key Vault | Microsoft Docs
description: Learn how to store credentials for data stores used in an Azure key vault that Azure Data Factory can automatically retrieve at runtime. 
services: data-factory
author: linda33wj
manager: jhubbard
editor: ''

ms.service: data-factory
ms.workload: data-services
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 11/09/2017
ms.author: jingwang
---

# Store credential in Azure Key Vault

You can store credentials for data stores in an [Azure Key Vault](../key-vault/key-vault-whatis.md). Azure Data Factory retrieves the credentials when executing an activity that uses the data store. Currently, only [Dynamics connector](connector-dynamics-crm-office-365.md) and [Salesforce connector](connector-salesforce.md) support this feature.

> [!NOTE]
> This article applies to version 2 of Data Factory, which is currently in preview. If you are using version 1 of the Data Factory service, which is generally available (GA), see [documentation for Data Factory version1](v1/data-factory-introduction.md).

## Prerequisites

This feature relies on the data factory service identity. Learn how it works from [Data factory service identity](data-factory-service-identity.md) and make sure your data factory have an associated one.

## Steps

To reference a credential stored in Azure Key Vault, you need to:

1. [Retrieve data factory service identity](data-factory-service-identity.md#retrieve-service-identity) by copying the value of "SERVICE IDENTITY APPLICATION ID" generated along with your factory.
2. Grant the service identity access to your Azure Key Vault. In your key vault -> Access control -> Add -> search this service identity application ID to add at least **Reader** permission. It allows this designated factory to access secret in key vault.
3. Create a linked service pointing to your Azure Key Vault. Refer to [Azure Key Vault linked service](#azure-key-vault-linked-service).
4. Create data store linked service, inside which reference the corresponding secret stored in key vault. Refer to [reference credential stored in key vault](#reference-credential-stored-in-key-vault).

## Azure Key Vault linked service

The following properties are supported for Azure Key Vault linked service:

| Property | Description | Required |
|:--- |:--- |:--- |
| type | The type property must be set to: **AzureKeyVault**. | Yes |
| baseUrl | Specify the Azure Key Vault URL. | Yes |

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
                "secretName": "<secret name in AKV>",
                "store":{
                    "referenceName": "<Azure Key Vault linked service>",
                    "type": "LinkedServiceReference"
                }
            }
        }
    }
}
```

## Next steps
For a list of data stores supported as sources and sinks by the copy activity in Azure Data Factory, see [supported data stores](copy-activity-overview.md#supported-data-stores-and-formats).