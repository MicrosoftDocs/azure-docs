---
title: "Quickstart: Deploy the Azure Health Data Services de-identification service with Azure PowerShell"
description: "Quickstart: Deploy the Azure Health Data Services de-identification service with Azure PowerShell."
author: jovinson-ms
ms.author: jovinson
ms.service: azure-health-data-services
ms.subservice: deidentification-service
ms.topic: quickstart
ms.custom: devx-track-azurepowershell
ms.date: 11/11/2024
---

# Quickstart: Deploy the Azure Health Data Services de-identification service (preview) with Azure PowerShell

In this quickstart, you use Azure PowerShell to deploy a de-identification service (preview).

If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.

[!INCLUDE [include](~/reusable-content/azure-powershell/azure-powershell-requirements.md)]

## Install the module

> [!IMPORTANT]
> While the **Az.HealthDataAIServices** PowerShell module is in preview, you must install it separately
> using the `Install-Module` cmdlet.

```azurepowershell
Install-Module -Name Az.HealthDataAIServices
```

## Deploy a de-identification service (preview)

Replace `<deid-service-name>` with a name for your de-identification service.

```azurepowershell
New-AzResourceGroup -Name 'exampleRG' -Location 'EastUS'
New-AzDeidService -ResourceGroupName 'jovinson' -Name '<deid-service-name>' -Location 'EastUS'
```

The command returns the following output, with some fields omitted for brevity.

```output
Id                           : /subscriptions/aaaa0a0a-bb1b-cc2c-dd3d-eeeeee4e4e4e/resourceGroups/exampleRG/providers/Mi
                               crosoft.HealthDataAIServices/DeidServices/<deid-service-name>
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