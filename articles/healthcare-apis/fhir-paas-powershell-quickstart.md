---
title: Deploy Azure API for FHIR using PowerShell
description: Deploy Azure API for FHIR using PowerShell.
services: healthcare-apis
author: hansenms
ms.service: healthcare-apis
ms.topic: quickstart
ms.date: 02/07/2019
ms.author: mihansen
---

# Quickstart: Deploy Azure API for FHIR using PowerShell

In this quickstart, you'll learn how to deploy Azure API for FHIR using PowerShell.

If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.

[!INCLUDE [cloud-shell-powershell.md](../../includes/cloud-shell-powershell.md)]

## Register the Azure API for FHIR resource provider

If the `Microsoft.HealthcareAPIs` resource provider is not already registered for your subscription, you can register it with:

```azurepowershell-interactive
Register-AzureRmResourceProvider -ProviderNamespace Microsoft.HealthcareAPIs
```

## Create an Azure Resource Manager template

Create an Azure Resource Manager template with the following content:

[!code-json[](samples/azuredeploy.json)]

Save it with the name `azuredeploy.json`

## Create an Azure resource group

```azurepowershell-interactive
$rg = New-AzureRmResourceGroup -Name "myResourceGroupName" -Location westus2
```

## Deploy template

```azurepowershell-interactive
$accountName = "myHealthcareApis"
New-AzureRmResourceGroupDeployment -ResourceGroup $rg.ResourceGroupName -TemplateFile azuredeploy.json -accountName $accountName
```

## Fetch capability statement

You'll be able to validate that the Azure API for FHIR account is running by fetching a FHIR capability statement:

```azurepowershell-interactive
$metadataUrl = "https://" + $accountName + ".microsofthealthcare-apis.com/metadata"
$metadata = Invoke-WebRequest -Uri $metadataUrl
$metadata.RawContent
```

## Clean up resources

If you're not going to continue to use this application, delete the resource group with the following steps:

```azurepowershell-interactive
Remove-AzureRmResourceGroup -Name $rg.ResourceGroupName
```

## Next steps

In this tutorial, you've deployed the Azure API for FHIR into your subscription. To learn how to access the FHIR API using Postman, proceed to the Postman tutorial.

>[!div class="nextstepaction"]
>[Access FHIR API using Postman](access-fhir-postman-tutorial.md)