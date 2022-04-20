---
title: Deploy Azure Health Data Services FHIR service using Bicep
description: Learn how to deploy FHIR service by using Bicep
author: schaffererin
ms.service: healthcare-apis
ms.topic: tutorial
ms.author: v-eschaffer
ms.date: 04/20/2022
---

# Deploy a FHIR service within Azure Health Data Services - using Bicep

In this article, you'll learn how to deploy FHIR service within the Azure Health Data Services (hereby called FHIR service) using [Bicep](../azure-resource-manager/bicep/overview.md).

Bicep is a domain-specific language (DSL) that uses declarative syntax to deploy Azure resources. It provides concise syntax, reliable type safety, and support for code reuse. Bicep offers the best authoring experience for your infrastructure-as-code solutions in Azure.

## Prerequisites

# [PowerShell](#tab/PowerShell)

* An Azure account with an active subscription. [Create one for free](https://azure.microsoft.com/free/).
* If you want to run the code locally:
    * [Azure PowerShell](/powershell/azure/install-az-ps).

# [CLI](#tab/CLI)

* An Azure account with an active subscription. [Create one for free](https://azure.microsoft.com/free/).
* If you want to run the code locally:
    * A Bash shell (such as Git Bash, which is included in [Git for Windows](https://gitforwindows.org)).
    * [Azure CLI](/cli/azure/install-azure-cli).

---

## Review the Bicep file

The Bicep file used in this article is from [Azure Quickstart Templates](https://azure.microsoft.com/resources/templates/azure-api-for-fhir/).

:::code language="bicep" source="../azure-quickstart-templates/quickstarts/microsoft.healthcareapis/azure-api-for-fhir/main.bicep":::

The Bicep file defines three Azure resources:

- [Microsoft.HealthcareApis/workspaces]: create a Microsoft.HealthcareApis workspace resource.

- [Microsoft.HealthcareApis/workspaces/fhirservices]: create a Microsoft.HealthcareApis workspace fhirservices resource.

- [Microsoft.Storage/storageAccounts]: create a Microsoft.Storage storage account resource.

## Deploy the Bicep file

1. Save the Bicep file as **main.bicep** to your local computer.
1. Deploy the Bicep file using either Azure CLI or Azure PowerShell.

    # [CLI](#tab/CLI)

    ```azurecli
    az group create --name exampleRG --location eastus
    az deployment group create --resource-group exampleRG --template-file main.bicep --parameters serviceName=<service-name> location=<location>
    ```

    # [PowerShell](#tab/PowerShell)

    ```azurepowershell
    New-AzResourceGroup -Name exampleRG -Location eastus
    New-AzResourceGroupDeployment -ResourceGroupName exampleRG -TemplateFile ./main.bicep -serviceName "<service-name>" -location "<location>"
    ```

    ---

    > [!NOTE]
    > Replace **\<service-name\>** with the name of the service. Replace **\<location\>** with the location of the Azure API for FHIR.
    >
    > Location options include:
    >
    > * australiaeast
    > * eastus
    > * eastus2
    > * japaneast
    > * northcentralus
    > * northeurope
    > * southcentralus
    > * southeastasia
    > * uksouth
    > * ukwest
    > * westcentralus
    > * westeurope
    > * westus2

    When the deployment finishes, you should see a message indicating the deployment succeeded.

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

## Clean up the resources

When no longer needed, use the Azure portal, Azure CLI, or Azure PowerShell to delete the resource group and its resources.

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

In this quickstart guide, you've deployed the FHIR service within Azure Health Data Services using Bicep. For more information about FHIR service supported features, proceed to the following article:

>[!div class="nextstepaction"]
>[Supported FHIR Features](fhir-features-supported.md)