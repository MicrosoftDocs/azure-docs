---
title: Deploy PaaS FHIR Server using PowerShell
description: Deploy PaaS FHIR Server using PowerShell.
services: healthcare-apis
author: hansenms
ms.service: healthcare-apis
ms.topic: quickstart 
ms.date: 02/11/2019.
ms.author: mihansen
---

# Quickstart: Deploy PaaS FHIR Server using PowerShell

In this quickstart, you can deploy the PaaS Microsoft FHIR Server for Azure Using PowerShell.

## Prerequisites

- Azure Subscription

If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.

[!INCLUDE [cloud-shell-powershell.md](../../includes/cloud-shell-powershell.md)]

## Create an Azure Resource Manager template

Create an Azure Resource Manager template with the following content:

[!code-json[](samples/azuredeploy.json)]

Save it with the name `azuredeploy.json`

## Create an Azure Resource Group

```azurepowershell-interactive
$rg = New-AzureRmResourceGroup -Name "myResourceGroupName" -Location westus2
```

## Deploy Template

```azurepowershell-interactive
New-AzureRmResourceGroupDeployment -ResourceGroup $rg.ResourceGroupName -TemplateFile azuredeploy.json -accountName "myHealthcareApis"
```

## Verify that the Healthcare APIs account is running

```azurepowershell-interactive
$metadataUrl = "https://" + $fhirServiceName + ".microsofthealthcare-apis.com/fhir/metadata" 
$metadata = Invoke-WebRequest -Uri $metadataUrl
$metadata.RawContent
```

## Clean up resources

If you're not going to continue to use this application, delete the resource group with the following steps:

```azurepowershell-interactive
Remove-AzureRmResourceGroup -Name $rg.ResourceGroupName
```

## Next steps

In this tutorial, you've deployed the Microsoft Healthcare APIs for FHIR into your subscription. To learn how to configure an identity provider for the FHIR server, proceed to the identity provider tutorial.
 
>[!div class="nextstepaction"]
>[Configure FHIR Identity Provider](configure-fhir-identity-tutorial.md)