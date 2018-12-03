---
title: Azure Policy sample - No network peering to ER network
description: This sample policy prohibits a network peering from being associated to a network in a specified resource group.
services: azure-policy
author: DCtheGeek
manager: carmonm
ms.service: azure-policy
ms.topic: sample
ms.date: 09/18/2018
ms.author: dacoulte
ms.custom: mvc
---
# No network peering to ER network

This policy prohibits a network peering from being associated to a network in a specified resource group. Use to prevent connection with central managed network infrastructure. You specify the name of the resource group to prevent association.

[!INCLUDE [quickstarts-free-trial-note](../../../../includes/quickstarts-free-trial-note.md)]

## Sample template

[!code-json[main](../../../../policy-templates/samples/Network/no-network-peerings-to-er-network/azurepolicy.json "No network peering to ER network")]

You can deploy this template using the [Azure portal](#deploy-with-the-portal), with [PowerShell](#deploy-with-powershell) or with the [Azure CLI](#deploy-with-azure-cli).

## Deploy with the portal

[![Deploy to Azure](http://azuredeploy.net/deploybutton.png)](https://portal.azure.com/?feature.customportal=false&microsoft_azure_policy=true&microsoft_azure_policy_policyinsights=true&feature.microsoft_azure_security_policy=true&microsoft_azure_marketplace_policy=true#blade/Microsoft_Azure_Policy/CreatePolicyDefinitionBlade/uri/https%3A%2F%2Fraw.githubusercontent.com%2FAzure%2Fazure-policy%2Fmaster%2Fsamples%2FNetwork%2Fno-network-peerings-to-er-network%2Fazurepolicy.json)

## Deploy with PowerShell

[!INCLUDE [sample-powershell-install](../../../../includes/sample-powershell-install-no-ssh.md)]

```azurepowershell-interactive
$definition = New-AzureRmPolicyDefinition -Name "no-network-peerings-to-er-network" -DisplayName "No network peering to ER network" -description "No network peering can be associated to networks in network in a resource group containing central managed network infrastructure." -Policy 'https://raw.githubusercontent.com/Azure/azure-policy/master/samples/Network/no-network-peerings-to-er-network/azurepolicy.rules.json' -Parameter 'https://raw.githubusercontent.com/Azure/azure-policy/master/samples/Network/no-network-peerings-to-er-network/azurepolicy.parameters.json' -Mode All
$definition
$assignment = New-AzureRMPolicyAssignment -Name <assignmentname> -Scope <scope>  -resourceGroupName <ER Network Resource Group Name> -PolicyDefinition $definition
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
az policy definition create --name 'no-network-peerings-to-er-network' --display-name 'No network peering to ER network' --description 'No network peering can be associated to networks in network in a resource group containing central managed network infrastructure.' --rules 'https://raw.githubusercontent.com/Azure/azure-policy/master/samples/Network/no-network-peerings-to-er-network/azurepolicy.rules.json' --params 'https://raw.githubusercontent.com/Azure/azure-policy/master/samples/Network/no-network-peerings-to-er-network/azurepolicy.parameters.json' --mode All

az policy assignment create --name <assignmentname> --scope <scope> --policy "no-network-peerings-to-er-network"
```

### Clean up Azure CLI deployment

Run the following command to remove the resource group, VM, and all related resources.

```azurecli-interactive
az group delete --name myResourceGroup --yes
```

## Next steps

- Review more samples at [Azure Policy samples](index.md)