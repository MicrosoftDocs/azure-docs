---
title: Create an Azure Attestation certificate by using Bicep
description: Learn how to create an Azure Attestation certificate by using Bicep.
services: azure-resource-manager
author: mumian
ms.service: attestation
ms.topic: quickstart
ms.custom: subject-armqs, mode-arm, devx-track-bicep
ms.author: jgao
ms.date: 03/08/2022
---

# Quickstart: Create an Azure Attestation provider with a Bicep file

[Microsoft Azure Attestation](overview.md) is a solution for attesting Trusted Execution Environments (TEEs). This quickstart focuses on the process of deploying a Bicep file to create a Microsoft Azure Attestation policy.

[!INCLUDE [About Bicep](../../includes/resource-manager-quickstart-bicep-introduction.md)]

## Prerequisites

If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.

## Review the Bicep file

The Bicep file used in this quickstart is from [Azure Quickstart Templates](https://azure.microsoft.com/resources/templates/attestation-provider-create/).

:::code language="bicep" source="~/quickstart-templates/quickstarts/microsoft.attestation/attestation-provider-create/main.bicep":::

Azure resources defined in the Bicep file:

- [Microsoft.Attestation/attestationProviders](/azure/templates/microsoft.attestation/attestationproviders?tabs=bicep)

## Deploy the Bicep file

1. Save the Bicep file as **main.bicep** to your local computer.
1. Deploy the Bicep file using either Azure CLI or Azure PowerShell.

    # [CLI](#tab/CLI)

    ```azurecli
    az group create --name exampleRG --location eastus

    az deployment group create --resource-group exampleRG --template-file main.bicep
    ```

    # [PowerShell](#tab/PowerShell)

    ```azurepowershell
    New-AzResourceGroup -Name exampleRG -Location eastus

    New-AzResourceGroupDeployment -ResourceGroupName exampleRG -TemplateFile ./main.bicep
    ```

    ---

    When the deployment finishes, you should see a message indicating the deployment succeeded.

## Validate the deployment

Use the Azure portal, Azure CLI, or Azure PowerShell to verify the resource group and server resource were created.

# [CLI](#tab/CLI)

```azurecli-interactive
az resource list --resource-group exampleRG
```

# [PowerShell](#tab/PowerShell)

```azurepowershell-interactive
Get-AzResource -ResourceGroupName exampleRG
```

---

## Clean up resources

Other Azure Attestation build upon this quickstart. If you plan to continue on to work with subsequent quickstarts and tutorials, you may wish to leave these resources in place.

When no longer needed, delete the resource group, which deletes the Attestation resource. To delete the resource group by using Azure CLI or Azure PowerShell:

# [CLI](#tab/CLI)

```azurecli-interactive
az group delete --name exampleRG
```

# [PowerShell](#tab/PowerShell)

```azurepowershell-interactive
Remove-AzResourceGroup -Name exampleRG
```

---

## Next steps

In this quickstart, you created an attestation resource using a Bicep file, and validated the deployment. To learn more about Azure Attestation, see [Overview of Azure Attestation](overview.md).
