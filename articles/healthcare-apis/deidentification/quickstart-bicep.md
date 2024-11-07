---
title: "Quickstart: deploy the Azure Health Data Services de-identification service with Bicep"
description: "Quickstart: deploy the Azure Health Data Services de-identification service with Bicep."
author: jovinson-ms
ms.author: jovinson
ms.service: azure-health-data-services
ms.subservice: deidentification-service
ms.topic: quickstart-bicep
ms.custom: subject-bicepqs
ms.date: 11/06/2024
---

# Quickstart: deploy the Azure Health Data Services de-identification service (preview) with Bicep

In this quickstart, you will use a Bicep definition to deploy a de-identification service (preview).

[!INCLUDE [About Bicep](../../../includes/resource-manager-quickstart-bicep-introduction.md)]

If your environment meets the prerequisites and you're familiar with using Bicep, select the
**Deploy to Azure** button. The template will open in the Azure portal.

:::image type="content" source="~/articles/reusable-content/ce-skilling/azure/media/template-deployments/deploy-to-azure-button.svg" alt-text="Button to deploy the Bicep definition to Azure." border="false" link="https://portal.azure.com/#create/Microsoft.Template/uri/https%3A%2F%2Fraw.githubusercontent.com%2FAzure%2Fazure-quickstart-templates%2Fmaster%2Fquickstarts%2Fmicrosoft.healthdataaiservices%2Fdeidentification-service-create%2Fazuredeploy.json":::

## Prerequisites

- If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.
- [!INCLUDE [include](~/reusable-content/azure-cli/azure-cli-prepare-your-environment-no-header.md)]

## Review the Bicep file

The Bicep file used in this quickstart is from
[Azure Quickstart Templates](https://learn.microsoft.com/samples/azure/azure-quickstart-templates/deidentification-service-create/).

:::code language="bicep" source="~/quickstart-templates/deidentification-service-create/main.bicep":::

The following Azure resources are defined in the Bicep file:

- [Microsoft.HealthDataAIServices/deidServices](/azure/templates)

<!-- 5. Deploy the Bicep file ----------------------------------------------------------
Required: Explain how to use the Azure CLI and Azure PowerShell to deploy the Bicep file:

- Tell users to save the Bicep file locally with the file name `main.bicep`.
- Provide Azure CLI and Azure PowerShell deployment commands in code blocks. To include
  **Try it** buttons, use `azurecli-interactive` and `azurepowershell-interactive` as
  language indicators.
- If your Azure CLI code block uses the `az deployment group create` command, state that
  it requires Azure CLI version 2.6 or later. Tell readers to enter `az --version` to
  check the version.

--->

## Deploy the Bicep file

1. Save the Bicep file as `main.bicep` to your local computer.

1. Deploy the Bicep file by using either Azure CLI or Azure PowerShell.

   [Azure CLI commands]
   [Azure PowerShell commands]

TODO: Add your commands

<!-- 6. Review deployed resources ------------------------------------------------------
Required: Provide instructions for using Azure CLI or Azure PowerShell commands to
display the deployed resources:

- Give this section an H2 header of *Review deployed resources* or *Validate the
  deployment*.
- Provide Azure CLI and Azure PowerShell commands in code blocks. To include **Try it**
  buttons, use `azurecli-interactive` and `azurepowershell-interactive` as
  language indicators.

--->

## Review deployed resources

[Azure CLI commands]
[Azure PowerShell commands]
TODO: Add your commands

<!-- 7. Clean up resources -------------------------------------------------------------
Required: Explain how to delete unneeded resources.

Consider including the following Azure CLI commands for deleting a resource group:

```azurecli-interactive
echo "Enter the Resource Group name:" &&
read resourceGroupName &&
az group delete --name $resourceGroupName &&
echo "Press [ENTER] to continue ..."
```

Consider including the following Azure PowerShell commands for deleting a resource group:

```azurepowershell-interactive
$resourceGroupName = Read-Host -Prompt "Enter the Resource Group name"
Remove-AzResourceGroup -Name $resourceGroupName
Write-Host "Press [ENTER] to continue..."
```
-->

## Clean up resources

[Instructions for cleaning up resources]
[Azure CLI commands]
[Azure PowerShell commands]
TODO: Add your instructions and commands

<!-- 8. Next steps ---------------------------------------------------------------------

Required: Provide links in this section that lead to related information.

Include a link to the next logical quickstart. Possibilities include:

- The next article for your service.
- A quickstart about creating a Bicep file: [Quickstart: Create Bicep files with Visual
  Studio Code](/azure/azure-resource-manager/bicep/quickstart-create-bicep-use-visual-studio-code).

Use a blue box for the quickstart link by using the following Markdown code:

> [!div class="nextstepaction"]
> [Quickstart: <quickstart-title>](<quickstart-url>)

If you include links to information about the service, use a paragraph or bullet points.

-->

## Next steps

> [!div class="nextstepaction"]
> [Quickstart: <quickstart-title>](<quickstart-url>)

- [Links to related information]
TODO: Add your quickstart or related information links

<!--
Remove all comments in this template before you sign off or merge to the main branch.

-->