---
title: Azure Policy sample - Only allow a certain VM platform image
description: This sample policy requires that virtual machines use a specific version of UbuntuServer.
services: azure-policy
author: DCtheGeek
manager: carmonm
ms.service: azure-policy
ms.topic: sample
ms.date: 09/18/2018
ms.author: dacoulte
ms.custom: mvc
---
# Only allow a certain VM platform image

Requires that virtual machines use a specific version of UbuntuServer.

[!INCLUDE [quickstarts-free-trial-note](../../../../includes/quickstarts-free-trial-note.md)]

## Sample template

[!code-json[main](../../../../policy-templates/samples/compute/platform-image-policy/azurepolicy.json "Only allow a certain VM platform image")]

You can deploy this template using the [Azure portal](#deploy-with-the-portal), with [PowerShell](#deploy-with-powershell) or with the [Azure CLI](#deploy-with-azure-cli).

## Deploy with the portal

[![Deploy to Azure](http://azuredeploy.net/deploybutton.png)](https://portal.azure.com/?feature.customportal=false&microsoft_azure_policy=true&microsoft_azure_policy_policyinsights=true&feature.microsoft_azure_security_policy=true&microsoft_azure_marketplace_policy=true#blade/Microsoft_Azure_Policy/CreatePolicyDefinitionBlade/uri/https%3A%2F%2Fraw.githubusercontent.com%2FAzure%2Fazure-policy%2Fmaster%2Fsamples%2FCompute%2Fplatform-image-policy%2Fazurepolicy.json)

## Deploy with PowerShell

[!INCLUDE [sample-powershell-install](../../../../includes/sample-powershell-install-no-ssh.md)]

```azurepowershell-interactive
$definition = New-AzureRmPolicyDefinition -Name "platform-image-policy" -DisplayName "Only allow a certain VM platform image" -description "This policy ensures that only UbuntuServer, Canonical is allowed from the image repository" -Policy 'https://raw.githubusercontent.com/Azure/azure-policy/master/samples/Compute/platform-image-policy/azurepolicy.rules.json' -Parameter 'https://raw.githubusercontent.com/Azure/azure-policy/master/samples/Compute/platform-image-policy/azurepolicy.parameters.json' -Mode All
$definition
$assignment = New-AzureRMPolicyAssignment -Name <assignmentname> -Scope <scope>  -PolicyDefinition $definition
$assignment
```

### Clean up PowerShell deployment

Run the following command to remove the resource group, VM, and all related resources.

```azurepowershell-interactive
Remove-AzureRmResourceGroup -Name myResourceGroup
```

## Deploy with Azure CLI

[!INCLUDE [sample-cli-install](../../../../includes/sample-cli-install.md)]

```azurecli-interactive
az policy definition create --name 'platform-image-policy' --display-name 'Only allow a certain VM platform image' --description 'This policy ensures that only UbuntuServer, Canonical is allowed from the image repository' --rules 'https://raw.githubusercontent.com/Azure/azure-policy/master/samples/Compute/platform-image-policy/azurepolicy.rules.json' --params 'https://raw.githubusercontent.com/Azure/azure-policy/master/samples/Compute/platform-image-policy/azurepolicy.parameters.json' --mode All

az policy assignment create --name <assignmentname> --scope <scope> --policy "platform-image-policy"
```

### Clean up Azure CLI deployment

Run the following command to remove the resource group, VM, and all related resources.

```azurecli-interactive
az group delete --name myResourceGroup --yes
```

## Next steps

- Review more samples at [Azure Policy samples](index.md)