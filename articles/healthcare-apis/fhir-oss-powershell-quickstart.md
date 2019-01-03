---
title: Deploy Open Source FHIR Server using PowerShell
description: Deploy Open Source FHIR Server using PowerShell.
services: healthcare-apis
author: hansenms
ms.service: healthcare-apis
ms.topic: quickstart 
ms.date: 02/11/2019.
ms.author: mihansen
---

# Quickstart: Deploy Open Source FHIR Server using PowerShell

In this quickstart, you can deploy the Open Source Microsoft FHIR Server for Azure Using PowerShell.

If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.

[!INCLUDE [cloud-shell-powershell.md](../../includes/cloud-shell-powershell.md)]

## Create a Resource Group

```azurepowershell-interactive
$fhirServiceName = "MyFhirService"
$rg = New-AzureRmResourceGroup -Name $fhirServiceName -Location westus2
```

## Deploy the FHIR Server template

The Microsoft FHIR Server for Azure [GitHub Repository](https://github.com/Microsoft/fhir-server) contains a template that will deploy all necessary resources. Deploy it with:

```azurepowershell-interactive
New-AzureRmResourceGroupDeployment -TemplateUri https://raw.githubusercontent.com/Microsoft/fhir-server/master/samples/templates/default-azuredeploy.json -ResourceGroupName $rg.ResourceGroupName -serviceName $fhirServiceName `
```

## Verify FHIR Server is running

```azurepowershell-interactive
$metadataUrl = "https://" + $fhirServiceName + ".azurewebsites.net/metadata" 
$metadata = Invoke-WebRequest -Uri $metadataUrl
$metadata.RawContent
```

It will take a minute or so for the server to respond the first time.

## Clean up resources

If you're not going to continue to use this application, delete the resource group
with the following steps:

```azurepowershell-interactive
Remove-AzureRmResourceGroup -Name $rg.ResourceGroupName
```

## Next steps

In this tutorial, you've deployed the Microsoft Open Source FHIR Server for Azure into your subscription. To learn how to configure an identity provider for the FHIR server, proceed to the identity provider tutorial.

>[!div class="nextstepaction"]
>[Configure FHIR Identity Provider](configure-fhir-identity-tutorial.md)