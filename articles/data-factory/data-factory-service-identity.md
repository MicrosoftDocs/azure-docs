---
title: Managed identity
titleSuffix: Azure Data Factory
description: Learn about using managed identities in Azure Data Factory. 
author: nabhishek
ms.service: data-factory
ms.subservice: security
ms.topic: conceptual
ms.date: 02/13/2023
ms.author: abnarain 
ms.custom: subject-rbac-steps
---

# Managed identity for Azure Data Factory

[!INCLUDE[appliesto-adf-xxx-md](includes/appliesto-adf-xxx-md.md)]

This article helps you understand managed identity (formerly known as Managed Service Identity/MSI) and how it works in Azure Data Factory.

[!INCLUDE [updated-for-az](../../includes/updated-for-az.md)]

## Overview

Managed identities eliminate the need to manage credentials. Managed identities provide an identity for the service instance when connecting to resources that support Azure Active Directory (Azure AD) authentication. For example, the service can use a managed identity to access resources like [Azure Key Vault](../key-vault/general/overview.md), where data admins can securely store credentials or access storage accounts. The service uses the managed identity to obtain Azure AD tokens.

There are two types of supported managed identities: 

- **System-assigned:** You can enable a managed identity directly on a service instance. When you allow a system-assigned managed identity during the creation of the service, an identity is created in Azure AD tied to that service instance's lifecycle. By design, only that Azure resource can use this identity to request tokens from Azure AD. So when the resource is deleted, Azure automatically deletes the identity for you.  
- **User-assigned:** You may also create a managed identity as a standalone Azure resource. You can [create a user-assigned managed identity](../active-directory/managed-identities-azure-resources/how-to-manage-ua-identity-portal.md) and assign it to one or more instances of a data factory. In user-assigned managed identities, the identity is managed separately from the resources that use it.

Managed identity provides the below benefits:

- [Store credential in Azure Key Vault](store-credentials-in-key-vault.md), in which case-managed identity is used for Azure Key Vault authentication.
- Access data stores or computes using managed identity authentication, including Azure Blob storage, Azure Data Explorer, Azure Data Lake Storage Gen1, Azure Data Lake Storage Gen2, Azure SQL Database, Azure SQL Managed Instance, Azure Synapse Analytics, REST, Databricks activity, Web activity, and more. Check the connector and activity articles for details.
- Managed identity is also used to encrypt/decrypt data and metadata using the customer-managed key stored in Azure Key Vault, providing double encryption. 

## System-assigned managed identity 

>[!NOTE]
> System-assigned managed identity is also referred to as 'Managed identity' elsewhere in the documentation and in the Data Factory Studio for backward compatibility purpose. We will explicitly mention 'User-assigned managed identity' when referring to it. 

### <a name="generate-managed-identity"></a> Generate system-assigned managed identity

System-assigned managed identity is generated as follows:

- When creating a data factory through **Azure portal or PowerShell**, managed identity will always be created automatically.
- When creating data factory through **SDK**, managed identity will be created only if you specify "Identity = new FactoryIdentity()" in the factory object for creation."  See example in [.NET Quickstart - Create data factory](quickstart-create-data-factory-dot-net.md#create-a-data-factory).
- When creating a data factory through **REST API**, managed identity will be created only if you specify "identity" section in request body. See example in [REST quickstart - create data factory](quickstart-create-data-factory-rest-api.md#create-a-data-factory).

If you find your service instance doesn't have a managed identity associated following [retrieve managed identity](#retrieve-managed-identity) instruction, you can explicitly generate one by updating it with identity initiator programmatically:

- [Generate managed identity using PowerShell](#generate-system-assigned-managed-identity-using-powershell)
- [Generate managed identity using REST API](#generate-system-assigned-managed-identity-using-rest-api)
- [Generate managed identity using an Azure Resource Manager template](#generate-system-assigned-managed-identity-using-an-azure-resource-manager-template)
- [Generate managed identity using SDK](#generate-system-assigned-managed-identity-using-sdk)

>[!NOTE]
>
>- Managed identity cannot be modified. Updating a service instance which already has a managed identity won't have any impact, and the managed identity is kept unchanged.
>- If you update a service instance which already has a managed identity without specifying the "identity" parameter in the factory objects or without specifying "identity" section in REST request body, you will get an error.
>- When you delete a service instance, the associated managed identity will also be deleted.

#### Generate system-assigned managed identity using PowerShell

Call **Set-AzDataFactoryV2** command, then you see "Identity" fields being newly generated:

```powershell
PS C:\> Set-AzDataFactoryV2 -ResourceGroupName <resourceGroupName> -Name <dataFactoryName> -Location <region>

DataFactoryName   : ADFV2DemoFactory
DataFactoryId     : /subscriptions/<subsID>/resourceGroups/<resourceGroupName>/providers/Microsoft.DataFactory/factories/ADFV2DemoFactory
ResourceGroupName : <resourceGroupName>
Location          : East US
Tags              : {}
Identity          : Microsoft.Azure.Management.DataFactory.Models.FactoryIdentity
ProvisioningState : Succeeded
```

#### Generate system-assigned managed identity using REST API

> [!NOTE]
> If you attempt to update a service instance that already has a managed identity without either specifying the **identity** parameter in the factory object or providing an **identity** section in the REST request body, you will get an error.

Call the API below with the "identity" section in the request body:

```
PATCH https://management.azure.com/subscriptions/<subsID>/resourceGroups/<resourceGroupName>/providers/Microsoft.DataFactory/factories/<data factory name>?api-version=2018-06-01
```

**Request body**: add "identity": { "type": "SystemAssigned" }.

```json
{
    "name": "<dataFactoryName>",
    "location": "<region>",
    "properties": {},
    "identity": {
        "type": "SystemAssigned"
    }
}
```

**Response**: managed identity is created automatically, and "identity" section is populated accordingly.

```json
{
    "name": "<dataFactoryName>",
    "tags": {},
    "properties": {
        "provisioningState": "Succeeded",
        "loggingStorageAccountKey": "**********",
        "createTime": "2017-09-26T04:10:01.1135678Z",
        "version": "2018-06-01"
    },
    "identity": {
        "type": "SystemAssigned",
        "principalId": "765ad4ab-XXXX-XXXX-XXXX-51ed985819dc",
        "tenantId": "72f988bf-XXXX-XXXX-XXXX-2d7cd011db47"
    },
    "id": "/subscriptions/<subscriptionId>/resourceGroups/<resourceGroupName>/providers/Microsoft.DataFactory/factories/<dataFactoryName>",
    "type": "Microsoft.DataFactory/factories",
    "location": "<region>"
}
```

#### Generate system-assigned managed identity using an Azure Resource Manager template

**Template**: add "identity": { "type": "SystemAssigned" }.

```json
{
    "contentVersion": "1.0.0.0",
    "$schema": "https://schema.management.azure.com/schemas/2019-04-01/deploymentTemplate.json#",
    "resources": [{
        "name": "<dataFactoryName>",
        "apiVersion": "2018-06-01",
        "type": "Microsoft.DataFactory/factories",
        "location": "<region>",
        "identity": {
            "type": "SystemAssigned"
        }
    }]
}
```

#### Generate system-assigned managed identity using SDK

Call the create_or_update function with Identity=new FactoryIdentity(). Sample code using .NET:

```csharp
Factory dataFactory = new Factory
{
    Location = <region>,
    Identity = new FactoryIdentity()
};
client.Factories.CreateOrUpdate(resourceGroup, dataFactoryName, dataFactory);
```

### <a name="retrieve-managed-identity"></a> Retrieve system-assigned managed identity

You can retrieve the managed identity from Azure portal or programmatically. The following sections show some samples.

>[!TIP]
> If you don't see the managed identity, [generate managed identity](#generate-managed-identity) by updating your service instance.

#### Retrieve system-assigned managed identity using Azure portal

You can find the managed identity information from Azure portal -> your data factory -> Properties.

:::image type="content" source="media/data-factory-service-identity/system-managed-identity-in-portal.png" alt-text="Shows the Azure portal with the system-managed identity object ID and Identity Tenant for an Azure Data Factory." lightbox="media/data-factory-service-identity/system-managed-identity-in-portal.png":::


- Managed Identity Object ID
- Managed Identity Tenant

The managed identity information will also show up when you create linked service, which supports managed identity authentication, like Azure Blob, Azure Data Lake Storage, Azure Key Vault, etc.

To grant permissions, follow these steps. For detailed steps, see [Assign Azure roles using the Azure portal](../role-based-access-control/role-assignments-portal.md).

1. Select **Access control (IAM)**.

1. Select **Add** > **Add role assignment**.

    :::image type="content" source="../../includes/role-based-access-control/media/add-role-assignment-menu-generic.png" alt-text="Screenshot that shows Access control (IAM) page with Add role assignment menu open.":::

1. On the **Members** tab, select **Managed identity**, and then select **Select members**.

1. Select your Azure subscription.

1. Under **System-assigned managed identity**, select **Data Factory**, and then select a data factory. You can also use the object ID or data factory name (as the managed-identity name) to find this identity. To get the managed identity's application ID, use PowerShell.

1. On the **Review + assign** tab, select **Review + assign** to assign the role.

#### Retrieve system-assigned managed identity using PowerShell

The managed identity principal ID and tenant ID will be returned when you get a specific service instance as follows. Use the **PrincipalId** to grant access:

```powershell
PS C:\> (Get-AzDataFactoryV2 -ResourceGroupName <resourceGroupName> -Name <dataFactoryName>).Identity

PrincipalId                          TenantId
-----------                          --------
765ad4ab-XXXX-XXXX-XXXX-51ed985819dc 72f988bf-XXXX-XXXX-XXXX-2d7cd011db47
```

You can get the application ID by copying above principal ID, then running below Azure Active Directory command with principal ID as parameter.

```powershell
PS C:\> Get-AzADServicePrincipal -ObjectId 765ad4ab-XXXX-XXXX-XXXX-51ed985819dc

ServicePrincipalNames : {76f668b3-XXXX-XXXX-XXXX-1b3348c75e02, https://identity.azure.net/P86P8g6nt1QxfPJx22om8MOooMf/Ag0Qf/nnREppHkU=}
ApplicationId         : 76f668b3-XXXX-XXXX-XXXX-1b3348c75e02
DisplayName           : ADFV2DemoFactory
Id                    : 765ad4ab-XXXX-XXXX-XXXX-51ed985819dc
Type                  : ServicePrincipal
```

#### Retrieve managed identity using REST API

The managed identity principal ID and tenant ID will be returned when you get a specific service instance as follows.

Call below API in the request:

```
GET https://management.azure.com/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.DataFactory/factories/{factoryName}?api-version=2018-06-01
```

**Response**: You’ll get response like shown in below example. The "identity" section is populated accordingly.

```json
{
    "name":"<dataFactoryName>",
    "identity":{
        "type":"SystemAssigned",
        "principalId":"554cff9e-XXXX-XXXX-XXXX-90c7d9ff2ead",
        "tenantId":"72f988bf-XXXX-XXXX-XXXX-2d7cd011db47"
    },
    "id":"/subscriptions/<subscriptionId>/resourceGroups/<resourceGroupName>/providers/Microsoft.DataFactory/factories/<dataFactoryName>",
    "type":"Microsoft.DataFactory/factories",
    "properties":{
        "provisioningState":"Succeeded",
        "createTime":"2020-02-12T02:22:50.2384387Z",
        "version":"2018-06-01",
        "factoryStatistics":{
            "totalResourceCount":0,
            "maxAllowedResourceCount":0,
            "factorySizeInGbUnits":0,
            "maxAllowedFactorySizeInGbUnits":0
        }
    },
    "eTag":"\"03006b40-XXXX-XXXX-XXXX-5e43617a0000\"",
    "location":"<region>",
    "tags":{

    }
}
```

> [!TIP] 
> To retrieve the managed identity from an ARM template, add an **outputs** section in the ARM JSON:

```json
{
    "outputs":{
        "managedIdentityObjectId":{
            "type":"string",
            "value":"[reference(resourceId('Microsoft.DataFactory/factories', parameters('<dataFactoryName>')), '2018-06-01', 'Full').identity.principalId]"
        }
    }
}
```

## User-assigned managed identity

You can create, delete, manage user-assigned managed identities in Azure Active Directory. For more details refer to [Create, list, delete, or assign a role to a user-assigned managed identity using the Azure portal](../active-directory/managed-identities-azure-resources/how-to-manage-ua-identity-portal.md). 

In order to use a user-assigned managed identity, you must first [create credentials](credentials.md) in your service instance for the UAMI.

## Next steps

- [Create credentials](credentials.md).

See the following topics that introduce when and how to use managed identity:

- [Store credential in Azure Key Vault](store-credentials-in-key-vault.md).
- [Copy data from/to Azure Data Lake Store using managed identities for Azure resources authentication](connector-azure-data-lake-store.md).

See [Managed Identities for Azure Resources Overview](../active-directory/managed-identities-azure-resources/overview.md) for more background on managed identities for Azure resources, on which managed identity in Azure Data Factory is based.

See [Limitations](../active-directory/managed-identities-azure-resources/managed-identities-faq.md#limitations) of managed identities, which also apply to managed identities in Azure Data Factory.
