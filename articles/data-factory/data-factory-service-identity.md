---
title: Azure Data Factory managed service identity support | Microsoft Docs
description: Learn about managed service identity (MSI) support in Azure Data Factory. 
services: data-factory
author: linda33wj
manager: craigg
editor: ''

ms.service: data-factory
ms.workload: data-services
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: conceptual
ms.date: 06/15/2018
ms.author: jingwang
---

# Azure Data Factory managed service identity support

This article helps you understand what is data factory managed service identity (MSI) and how it works. See [MSI Overview](~/articles/active-directory/msi-overview.md) for more background on Managed Service Identity, which data factory managed service identity is based upon. 

> [!NOTE]
> This article applies to version 2 of Data Factory, which is currently in preview. If you are using version 1 of the Data Factory service, which is generally available (GA), see [documentation for Data Factory version1](v1/data-factory-introduction.md).

## Overview

When creating a data factory, a MSI can be created along with factory creation. The MSI is a managed application registered to Azure Activity Directory, and represents this specific data factory.

Data factory MSI benefits the following features:

- [Store credential in Azure Key Vault](store-credentials-in-key-vault.md), in which case data factory MSI is used for Azure Key Vault authentication.
- [Copy data from/to Azure Data Lake Store](connector-azure-data-lake-store.md), in which case data factory MSI can be used as one of the supported Data Lake Store authentication types.
- [Copy data from/to Azure SQL Database](), in which case 
- [Copy data from/to Azure SQL Data Warehouse](), in which case 
- [Web Activity]()

## Generate MSI

Data factory MSI is generated as follows:

- When creating data factory through **Azure portal or PowerShell**, MSI will always be created automatically since ADF V2 public preview.
- When creating data factory through **SDK**, MSI will be created only if you specify "Identity = new FactoryIdentity()" in the factory object for creation. See example in [.NET quickstart - create data factory](quickstart-create-data-factory-dot-net.md#create-a-data-factory).
- When creating data factory through **REST API**, MSI will be created only if you specify "identity" section in request body. See example in [REST quickstart - create data factory](quickstart-create-data-factory-rest-api.md#create-a-data-factory).

If you find your data factory doesn't have a MSI associated following [retrieve MSI](#retrieve-msi) instruction, you can explicitly generate one by updating the data factory with identity initiator programmatically:

- [Generate MSI using PowerShell](#generate-msi-using-powershell)
- [Generate MSI using REST API](#generate-msi-using-rest-api)
- [Generate MSI using SDK](#generate-msi-using-sdk)

>[!NOTE]
>- MSI cannot be modified. Updating a data factory which already have a MSI won't have any impact, the MSI is kept unchanged.
>- If you update a data factory which already have a MSI without specifying "identity" parameter in the factory object or without specifying "identity" section in REST request body, you will get an error.
>- When you delete a data factory, the associated MSI will be deleted along.

### Generate MSI using PowerShell

Call **Set-AzureRmDataFactoryV2** command again, then you see "Identity" fields being newly generated:

```powershell
PS C:\WINDOWS\system32> Set-AzureRmDataFactoryV2 -ResourceGroupName <resourceGroupName> -Name <dataFactoryName> -Location <region>

DataFactoryName   : ADFV2DemoFactory
DataFactoryId     : /subscriptions/<subsID>/resourceGroups/<resourceGroupName>/providers/Microsoft.DataFactory/factories/ADFV2DemoFactory
ResourceGroupName : <resourceGroupName>
Location          : East US
Tags              : {}
Identity          : Microsoft.Azure.Management.DataFactory.Models.FactoryIdentity
ProvisioningState : Succeeded
```

### Generate MSI using REST API

Call below API with "identity" section in the request body:

```
PATCH https://management.azure.com/subscriptions/<subsID>/resourceGroups/<resourceGroupName>/providers/Microsoft.DataFactory/factories/<data factory name>?api-version=2017-09-01-preview
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

**Response**: MSI is created automatically, and "identity" section is populated accordingly.

```json
{
    "name": "ADFV2DemoFactory",
    "tags": {},
    "properties": {
        "provisioningState": "Succeeded",
        "loggingStorageAccountKey": "**********",
        "createTime": "2017-09-26T04:10:01.1135678Z",
        "version": "2017-09-01-preview"
    },
    "identity": {
        "type": "SystemAssigned",
        "principalId": "765ad4ab-XXXX-XXXX-XXXX-51ed985819dc",
        "tenantId": "72f988bf-XXXX-XXXX-XXXX-2d7cd011db47"
    },
    "id": "/subscriptions/<subscriptionId>/resourceGroups/<resourceGroupName>/providers/Microsoft.DataFactory/factories/ADFV2DemoFactory",
    "type": "Microsoft.DataFactory/factories",
    "location": "EastUS"
}
```

### Generate MSI using SDK

Call the data factory create_or_update function with Identity=new FactoryIdentity(). Sample code using .NET:

```csharp
Factory dataFactory = new Factory
{
    Location = <region>,
    Identity = new FactoryIdentity()
};
client.Factories.CreateOrUpdate(resourceGroup, dataFactoryName, dataFactory);
```

## Retrieve MSI

You can retrieve the MSI from Azure portal or programmatically. The following sections show some samples.

>[!TIP]
> If you don't see the MSI, [generate MSI](#generate-msi) by updating your factory.

### Retrieve MSI using Azure portal

You can find the MSI information from Azure portal -> your data factory -> Settings -> Properties:

- SERVICE IDENTITY ID
- SERVICE IDENTITY TENANT
- **SERVICE IDENTITY APPLICATION ID** > copy this value

![Retrieve service identity](media/data-factory-service-identity/retrieve-msi-portal.png)

### Retrieve MSI using PowerShell

The MSI principal ID and tenant ID will be returned when you get a specific data factory as follows:

```powershell
PS C:\WINDOWS\system32> (Get-AzureRmDataFactoryV2 -ResourceGroupName <resourceGroupName> -Name <dataFactoryName>).Identity

PrincipalId                          TenantId
-----------                          --------
765ad4ab-XXXX-XXXX-XXXX-51ed985819dc 72f988bf-XXXX-XXXX-XXXX-2d7cd011db47
```

Copy the principal ID, then run below Azure Active Directory command with principal ID as parameter to get the **ApplicationId**, which you use to grant access:

```powershell
PS C:\WINDOWS\system32> Get-AzureRmADServicePrincipal -ObjectId 765ad4ab-XXXX-XXXX-XXXX-51ed985819dc

ServicePrincipalNames : {76f668b3-XXXX-XXXX-XXXX-1b3348c75e02, https://identity.azure.net/P86P8g6nt1QxfPJx22om8MOooMf/Ag0Qf/nnREppHkU=}
ApplicationId         : 76f668b3-XXXX-XXXX-XXXX-1b3348c75e02
DisplayName           : ADFV2DemoFactory
Id                    : 765ad4ab-XXXX-XXXX-XXXX-51ed985819dc
Type                  : ServicePrincipal
```

## Next steps
See the following topics which introduce when and how to use data factory service identity:

- [Store credential in Azure Key Vault](store-credentials-in-key-vault.md)
- [Copy data from/to Azure Data Lake Store using managed service identity authentication](connector-azure-data-lake-store.md)
