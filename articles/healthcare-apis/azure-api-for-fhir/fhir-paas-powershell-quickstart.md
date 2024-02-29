---
title: 'Quickstart: Deploy Azure API for FHIR using PowerShell'
description: In this quickstart, you'll learn how to deploy Azure API for FHIR using PowerShell.
services: healthcare-apis
author: expekesheth
ms.service: healthcare-apis
ms.subservice: fhir
ms.topic: quickstart
ms.date: 09/27/2023
ms.author: kesheth
ms.custom: devx-track-azurepowershell
---

# Quickstart: Deploy Azure API for FHIR using PowerShell

[!INCLUDE [retirement banner](../includes/healthcare-apis-azure-api-fhir-retirement.md)]

In this quickstart, you'll learn how to deploy Azure API for FHIR using PowerShell.

If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.

[!INCLUDE [cloud-shell-try-it.md](../../../includes/cloud-shell-try-it.md)]

[!INCLUDE [updated-for-az](../../../includes/updated-for-az.md)]

## Register the Azure API for FHIR resource provider

If the `Microsoft.HealthcareApis` resource provider isn't already registered for your subscription, you can register it with:

```azurepowershell-interactive
Register-AzResourceProvider -ProviderNamespace Microsoft.HealthcareApis
```

## Create Azure resource group

```azurepowershell-interactive
New-AzResourceGroup -Name "myResourceGroupName" -Location westus2
```

## Deploy Azure API for FHIR

```azurepowershell-interactive
New-AzHealthcareApisService -Name nameoffhirservice -ResourceGroupName myResourceGroupName -Location westus2 -Kind fhir-R4
```

> [!NOTE]
> Depending on the version of the `Az` PowerShell module you have installed, the provisioned FHIR server may be configured to use [local RBAC](configure-local-rbac.md) and have the currently signed in PowerShell user set in the list of allowed identity object IDs for the deployed FHIR service. Going forward, we recommend that you [use Azure RBAC](configure-azure-rbac.md) for assigning data plane roles and you may need to delete this users object ID after deployment to enable Azure RBAC mode.


## Fetch capability statement

You'll be able to validate that the Azure API for FHIR account is running by fetching a FHIR capability statement:

```azurepowershell-interactive
$metadata = Invoke-WebRequest -Uri "https://nameoffhirservice.azurehealthcareapis.com/metadata"
$metadata.RawContent
```

## Clean up resources

If you're not going to continue to use this application, delete the resource group with the following steps:

```azurepowershell-interactive
Remove-AzResourceGroup -Name myResourceGroupName
```

## Next steps

In this quickstart guide, you've deployed the Azure API for FHIR into your subscription. For more information about the settings in Azure API for FHIR and to start using Azure API for FHIR, see

>[!div class="nextstepaction"]
>[Additional settings in Azure API for FHIR](azure-api-for-fhir-additional-settings.md)

>[!div class="nextstepaction"]
>[Register Applications Overview](fhir-app-registration.md)

>[!div class="nextstepaction"]
>[Configure Azure RBAC](configure-azure-rbac.md)

>[!div class="nextstepaction"]
>[Configure local RBAC](configure-local-rbac.md)

>[!div class="nextstepaction"]
>[Configure database settings](configure-database.md)

>[!div class="nextstepaction"]
>[Configure customer-managed keys](customer-managed-key.md)

>[!div class="nextstepaction"]
>[Configure CORS](configure-cross-origin-resource-sharing.md)

>[!div class="nextstepaction"]
>[Configure Private Link](configure-private-link.md)

FHIR&#174; is a registered trademark of [HL7](https://hl7.org/fhir/) and is used with the permission of HL7.