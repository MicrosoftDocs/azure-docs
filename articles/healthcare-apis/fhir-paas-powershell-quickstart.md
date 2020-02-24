---
title: 'Quickstart: Deploy Azure API for FHIR using PowerShell'
description: In this quickstart, you'll learn how to deploy Azure API for FHIR using PowerShell.
services: healthcare-apis
author: hansenms
ms.service: healthcare-apis
ms.subservice: fhir
ms.topic: quickstart
ms.date: 10/15/2019
ms.author: mihansen
---

# Quickstart: Deploy Azure API for FHIR using PowerShell

In this quickstart, you'll learn how to deploy Azure API for FHIR using PowerShell.

If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.

[!INCLUDE [cloud-shell-try-it.md](../../includes/cloud-shell-try-it.md)]

[!INCLUDE [updated-for-az](../../includes/updated-for-az.md)]

## Register the Azure API for FHIR resource provider

If the `Microsoft.HealthcareApis` resource provider is not already registered for your subscription, you can register it with:

```azurepowershell-interactive
Register-AzResourceProvider -ProviderNamespace Microsoft.HealthcareApis
```

## Locate your identity object ID

Object ID values are guids that correspond to the object IDs of specific Azure Active Directory users or service principals in the directory associated with the subscription. If you would like to know the object ID of a specific user, you can find it with a command like:

```azurepowershell-interactive
$(Get-AzureADUser -Filter "UserPrincipalName eq 'myuser@consoso.com'").ObjectId
```

Read the how-to guide on [finding identity object IDs](find-identity-object-ids.md) for more details.

## Create Azure resource group

```azurepowershell-interactive
New-AzResourceGroup -Name "myResourceGroupName" -Location westus2
```

## Deploy Azure API for FHIR

```azurepowershell-interactive
New-AzHealthcareApisService -Name nameoffhirservice -ResourceGroupName myResourceGroupName -Location westus2 -Kind fhir-R4 -AccessPolicyObjectId "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
```

where `xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx` is the identity object ID for a user or service principal that you would like to have access to the FHIR API.

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

In this quickstart guide, you've deployed the Azure API for FHIR into your subscription. To set additional settings in your Azure API for FHIR, proceed to the additional settings how-to guide.

>[!div class="nextstepaction"]
>[Additional settings in Azure API for FHIR](azure-api-for-fhir-additional-settings.md)
