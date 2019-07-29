---
title: Deploy Azure API for FHIR using PowerShell
description: Deploy Azure API for FHIR using PowerShell.
services: healthcare-apis
author: hansenms
ms.service: healthcare-apis
ms.subservice: fhir
ms.topic: quickstart
ms.date: 02/07/2019
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

## Create Azure Resource Manager template

Create an Azure Resource Manager template with the following content:

[!code-json[](samples/azuredeploy.json)]

Save it with the name `azuredeploy.json`

## Create Azure Resource Manager parameter file

Create an Azure Resource Manager template parameter file with the following content:

[!code-json[](samples/azuredeploy.parameters.json)]

Save it with the name `azuredeploy.parameters.json`

The object ID values `xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx` and `yyyyyyyy-yyyy-yyyy-yyyy-yyyyyyyyyyyy` correspond to the object IDs of specific Azure Active Directory users or service principals in the directory associated with the subscription. If you would like to know the object ID of a specific user, you can find it with a command like:

```azurepowershell-interactive
$(Get-AzureADUser -Filter "UserPrincipalName eq 'myuser@consoso.com'").ObjectId
```

Read the how-to guide on [finding identity object IDs](find-identity-object-ids.md) for more details.

## Create Azure resource group

```azurepowershell-interactive
$rg = New-AzResourceGroup -Name "myResourceGroupName" -Location westus2
```

## Deploy template

```azurepowershell-interactive
New-AzResourceGroupDeployment -ResourceGroup $rg.ResourceGroupName -TemplateFile azuredeploy.json -TemplateParameterFile azuredeploy.parameters.json
```

## Fetch capability statement

You'll be able to validate that the Azure API for FHIR account is running by fetching a FHIR capability statement:

```azurepowershell-interactive
$metadata = Invoke-WebRequest -Uri $metadataUrl "https://nameOfFhirAccount.azurehealthcareapis.com/metadata"
$metadata.RawContent
```

## Clean up resources

If you're not going to continue to use this application, delete the resource group with the following steps:

```azurepowershell-interactive
Remove-AzResourceGroup -Name $rg.ResourceGroupName
```

## Next steps

In this tutorial, you've deployed the Azure API for FHIR into your subscription. To learn how to access the FHIR API using Postman, proceed to the Postman tutorial.

>[!div class="nextstepaction"]
>[Access FHIR API using Postman](access-fhir-postman-tutorial.md)
