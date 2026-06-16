---
title: Deploy Azure Health Data Services FHIR service using Bicep
description: Deploy the Azure Health Data Services FHIR service using Bicep with prerequisites, sample templates, and CLI or PowerShell commands. 
author: expekesheth
ms.service: azure-health-data-services
ms.custom: devx-track-bicep
ms.topic: tutorial
ms.author: kesheth
ms.date: 05/28/2026
---

# Deploy a FHIR service within Azure Health Data Services using Bicep

This tutorial uses Azure API for FHIR as an example to demonstrate how to deploy a FHIR service within Azure Health Data Services using Bicep. Azure API for FHIR is retiring on September 30, 2026. For new deployments, see [Deploy Azure Health Data Services with Bicep](../deploy-healthcare-apis-using-bicep.md) instead.


[Bicep](../../azure-resource-manager/bicep/overview.md) is a domain-specific language (DSL) that uses declarative syntax to deploy Azure resources. It provides concise syntax, reliable type safety, and support for code reuse. Bicep offers the best authoring experience for your infrastructure-as-code solutions in Azure.



## Prerequisites

# [PowerShell](#tab/PowerShell)

* An Azure account with an active subscription. [Create one for free](https://azure.microsoft.com/pricing/purchase-options/azure-account?cid=msft_learn).
* If you want to run the code locally:
    * [Azure PowerShell](/powershell/azure/install-azure-powershell).

# [CLI](#tab/CLI)

* An Azure account with an active subscription. [Create one for free](https://azure.microsoft.com/pricing/purchase-options/azure-account?cid=msft_learn).
* If you want to run the code locally:
    * A Bash shell (such as Git Bash, which is included in [Git for Windows](https://gitforwindows.org)) or a command prompt.
    * [Azure CLI](/cli/azure/install-azure-cli).

---

## Review the Bicep file

This article uses a Bicep file from [Azure Quickstart Templates](https://azure.microsoft.com/resources/templates/azure-api-for-fhir/).

:::code language="bicep" source="~/quickstart-templates/quickstarts/microsoft.healthcareapis/azure-api-for-fhir/main.bicep":::

The Bicep file defines three Azure resources:

* `Microsoft.HealthcareApis/workspaces`: Creates a `Microsoft.HealthcareApis/workspaces` resource.

* `Microsoft.HealthcareApis/workspaces/fhirservices`: Creates a `Microsoft.HealthcareApis/workspaces/fhirservices` resource.

* [Microsoft.Storage/storageAccounts](/azure/templates/microsoft.storage/storageaccounts): Creates a `Microsoft.Storage/storageAccounts` resource.

## Deploy the Bicep file

1. Save the Bicep file as **main.bicep** on your local computer.
1. Deploy the Bicep file by using either Azure CLI or Azure PowerShell.

    # [CLI](#tab/CLI)

    If you're using the Azure CLI locally, prepare your environment before running the deployment command.

    ```azurecli
    az login
    az upgrade
    ```

    Run the following commands in a Bash shell or command prompt. The first command creates a resource group, and the second command deploys the Bicep file to that resource group.

    ```azurecli-interactive
    az group create --name exampleRG --location eastus
    az deployment group create --resource-group exampleRG --template-file main.bicep --parameters serviceName=<service-name> location=<location>
    ```

    # [PowerShell](#tab/PowerShell)

    If you're using Azure PowerShell locally, prepare your environment before running the deployment command.

    ```azurepowershell
    Connect-AzAccount
    Update-Module -Name Az -Force
    ```

    Run the following commands in PowerShell. The first command creates a resource group, and the second command deploys the Bicep file to that resource group.

    ```azurepowershell-interactive
    New-AzResourceGroup -Name exampleRG -Location eastus
    New-AzResourceGroupDeployment -ResourceGroupName exampleRG -TemplateFile ./main.bicep -serviceName "<service-name>" -location "<location>"
    ```

    ---

    Replace **\<service-name\>** with the name of the service. Replace **\<location\>** with the location of the Azure API for FHIR. Location options include:

    * australiaeast
    * eastus
    * eastus2
    * japaneast
    * northcentralus
    * northeurope
    * southcentralus
    * southeastasia
    * uksouth
    * ukwest
    * westcentralus
    * westeurope
    * westus2

    > [!NOTE]
    > When the deployment finishes, you see a message indicating the deployment succeeded.

## Review the deployed resources

Use the Azure portal, Azure CLI, or Azure PowerShell to list the deployed resources in the resource group.

# [CLI](#tab/CLI)

```azurecli-interactive
az resource list --resource-group exampleRG
```

# [PowerShell](#tab/PowerShell)

```azurepowershell-interactive
Get-AzResource -ResourceGroupName exampleRG
```

---

> [!NOTE]
> You can also verify that the FHIR service is running by opening a browser and going to `https://<yourfhirservice>.azurehealthcareapis.com/metadata`. If the capability statement automatically displays or downloads, your deployment was successful. Make sure to replace **\<yourfhirservice\>** with the **\<service-name\>** you used in the deployment step of this quickstart.

## Clean up the resources

When you no longer need the resources, use the Azure portal, Azure CLI, or Azure PowerShell to delete the resource group and its resources.

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

In this quickstart, you deployed the FHIR service within Azure Health Data Services by using Bicep. For more information about supported features, see the following article:

>[!div class="nextstepaction"]
>[Supported FHIR Features](fhir-features-supported.md)

[!INCLUDE [FHIR trademark statement](../includes/healthcare-apis-fhir-trademark.md)]
