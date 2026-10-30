---
title: Deploy a De-identification Service with Azure PowerShell
description: Learn how to deploy the Azure Health Data Services de-identification service by using Azure PowerShell. Create a resource group and service in minutes.
author: jovinson-ms
ms.author: jovinson
ms.service: azure-health-data-services
ms.subservice: deidentification-service
ms.topic: quickstart
ms.custom: devx-track-azurepowershell
ms.date: 10/01/2026
---

# Quickstart: Deploy the Azure Health Data Services de-identification service with Azure PowerShell

In this quickstart, you use Azure PowerShell to deploy the Azure Health Data Services de-identification service. The service helps you remove protected health information from clinical data so you can use it for research and analytics.


If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/pricing/purchase-options/azure-account?cid=msft_learn) before you begin.

[!INCLUDE [include](~/reusable-content/azure-powershell/azure-powershell-requirements.md)]


## Log in to Azure

```azurepowershell
Connect-AzAccount
```

Select the account you want to use for this quickstart. If your account is associated with multiple Azure subscriptions, set the subscription that you want to use.

## Install the Az.HealthDataAIServices PowerShell module

 > [!IMPORTANT]
> While the **Az.HealthDataAIServices** PowerShell module is in preview, you must install it separately
> by using the `Install-Module` cmdlet.

```azurepowershell
Install-Module -Name Az.HealthDataAIServices
```

## Deploy a de-identification service

Replace `<deid-service-name>` with a name for your de-identification service.

```azurepowershell
New-AzResourceGroup -Name 'exampleRG' -Location 'EastUS'
New-AzDeidService -ResourceGroupName 'exampleRG' -Name '<deid-service-name>' -Location 'EastUS'
```

The command returns the following output, with some fields omitted for brevity.

```output
Id                           : /subscriptions/aaaa0a0a-bb1b-cc2c-dd3d-eeeeee4e4e4e/resourceGroups/exampleRG/providers/Microsoft.HealthDataAIServices/DeidServices/<deid-service-name>
IdentityPrincipalId          :
IdentityTenantId             :
IdentityType                 :
IdentityUserAssignedIdentity : {
                               }
Location                     : eastus
Name                         : <deid-service-name>
PrivateEndpointConnection    :
ProvisioningState            : Succeeded
PublicNetworkAccess          : Enabled
ResourceGroupName            : exampleRG
ServiceUrl                   : https://example.api.eus001.deid.azure.com
Tag                          : {
                               }
Type                         : microsoft.healthdataaiservices/deidservices
```

## Clean up resources

When you no longer need the resources, use the Azure CLI to delete the resource group.

```azurepowershell
Remove-AzResourceGroup -Name 'exampleRG'
```

## Next steps

> [!div class="nextstepaction"]
> [Quickstart: Azure Health De-identification client library for .NET](quickstart-sdk-net.md)
