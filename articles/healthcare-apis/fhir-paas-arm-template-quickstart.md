---
title: 'Quickstart: Deploy Azure API for FHIR using an ARM template'
description: In this quickstart, learn how to deploy Azure API for Fast Healthcare Interoperability Resources (FHIR®), by using an Azure Resource Manager template.
author: mgblythe
ms.service: healthcare-apis
ms.subservice: fhir
ms.topic: quickstart
ms.custom: subject-armqs
ms.author: mblythe
ms.date: 09/14/2020
---

# Quickstart: Use an ARM template to deploy Azure API for FHIR

In this quickstart, you'll learn how to use an Azure Resource Manager template (ARM template) to deploy Azure API for Fast Healthcare Interoperability Resources (FHIR®).

[!INCLUDE [About Azure Resource Manager](../../includes/resource-manager-quickstart-introduction.md)]

If your environment meets the prerequisites and you're familiar with using ARM templates, select the **Deploy to Azure** button. The template will open in the Azure portal.

[![Deploy to Azure](../media/template-deployments/deploy-to-azure.svg)](https://portal.azure.com/#create/Microsoft.Template/uri/https%3a%2f%2fraw.githubusercontent.com%2fAzure%2fazure-quickstart-templates%2fmaster%2f101-azure-api-for-fhir%2fazuredeploy.json)

## Prerequisites

# [Portal](#tab/azure-portal)

An Azure account with an active subscription. [Create one for free](https://azure.microsoft.com/free/).

# [PowerShell](#tab/PowerShell)

* An Azure account with an active subscription. [Create one for free](https://azure.microsoft.com/free/).
* If you want to run the code locally, [Azure PowerShell](/powershell/azure/).

# [CLI](#tab/CLI)

* An Azure account with an active subscription. [Create one for free](https://azure.microsoft.com/free/).
* If you want to run the code locally, [Azure CLI](/cli/azure/).

---

## Review the template

The template used in this quickstart is from [Azure Quickstart Templates](https://azure.microsoft.com/resources/templates/101-azure-api-for-fhir/).

:::code language="json" source="~/quickstart-templates/101-azure-api-for-fhir/azuredeploy.json":::

The template defines one Azure resource:

* [**Microsoft.HealthcareApis/services**](/azure/templates/microsoft.healthcareapis/services)

More Azure API for FHIR template samples can be found in the [quickstart template gallery](https://azure.microsoft.com/resources/templates/?resourceType=Microsoft.HealthcareApis&pageNumber=1&sort=Popular).

## Deploy the template

# [Portal](#tab/azure-portal)

Select the following link to deploy the Azure API for FHIR using the ARM template in the Azure portal:

[![Deploy to Azure](../media/template-deployments/deploy-to-azure.svg)](https://portal.azure.com/#create/Microsoft.Template/uri/https%3a%2f%2fraw.githubusercontent.com%2fAzure%2fazure-quickstart-templates%2fmaster%2f101-azure-api-for-fhir%2fazuredeploy.json)

On the **Deploy Azure API for FHIR** page:

1. For **Resource group**, select **Create new**, enter a name for the new resource group, and select **OK**.

2. If you created a new resource group, select a **Region** for the resource group.

3. Enter a new **Service Name** and the **Location** of the Azure API for FHIR.

    :::image type="content" source="./media/fhir-paas-arm-template-quickstart/deploy-azure-api-fhir.png" alt-text="Deploy the Azure API for FHIR using the ARM template in the Azure portal.":::

4. If you want, change the **Subscription** from the default.

5. Select **Review + create**.

6. Read the terms and conditions, and then select **Create**.

# [PowerShell](#tab/PowerShell)

If the `Microsoft.HealthcareApis` resource provider isn't already registered for your subscription, you can register it with the following interactive code. To run the code in Azure Cloud Shell, select **Try it** at the upper corner of any code block.

```azurepowershell-interactive
Register-AzResourceProvider -ProviderNamespace Microsoft.HealthcareApis
```

Use the following code to deploy the Azure API for FHIR service using the ARM template. The code prompts you for the new FHIR service name, the name of a new resource group, and the locations for each of them.

```azurepowershell-interactive
$serviceName = Read-Host -Prompt "Enter a name for the new Azure API for FHIR service"
$serviceLocation = Read-Host -Prompt "Enter an Azure region (for example, westus2) for the service"
$resourceGroupName = Read-Host -Prompt "Enter a name for the new resource group to contain the service"
$resourceGroupRegion = Read-Host -Prompt "Enter an Azure region (for example, centralus) for the resource group"

Write-Verbose "New-AzResourceGroup -Name $resourceGroupName -Location $resourceGroupRegion" -Verbose
New-AzResourceGroup -Name $resourceGroupName -Location $resourceGroupRegion
Write-Verbose "Run New-AzResourceGroupDeployment to create an Azure API for FHIR service using an ARM template" -Verbose
New-AzResourceGroupDeployment -ResourceGroupName $resourceGroupName `
    -TemplateUri https://raw.githubusercontent.com/Azure/azure-quickstart-templates/master/101-azure-api-for-fhir/azuredeploy.json `
    -serviceName $serviceName `
    -location $serviceLocation
Read-Host "Press [ENTER] to continue ..."
```

# [CLI](#tab/CLI)

If the `Microsoft.HealthcareApis` resource provider isn't already registered for your subscription, you can register it with the following interactive code. To run the code in Azure Cloud Shell, select **Try it** at the upper corner of any code block.

```azurecli-interactive
az extension add --name healthcareapis
```

Use the following code to deploy the Azure API for FHIR service using the ARM template. The code prompts you for the new FHIR service name, the name of a new resource group, and the locations for each of them.

```azurecli-interactive
read -p "Enter a name for the new Azure API for FHIR service:" serviceName &&
read -p "Enter an Azure region (for example, westus2) for the service:" serviceLocation &&
read -p "Enter a name for the new resource group to contain the service:" resourceGroupName &&
read -p "Enter an Azure region (for example, centralus) for the resource group:" resourceGroupRegion &&
params='serviceName='$serviceName' location='$serviceLocation &&
echo "CREATE RESOURCE GROUP:  az group create --name $resourceGroupName --location $resourceGroupRegion" &&
az group create --name $resourceGroupName --location $resourceGroupRegion &&
echo "RUN az deployment group create, which creates an Azure API for FHIR service using an ARM template" &&
az deployment group create --resource-group $resourceGroupName --parameters $params --template-uri https://raw.githubusercontent.com/Azure/azure-quickstart-templates/master/101-azure-api-for-fhir/azuredeploy.json &&
read -p "Press [ENTER] to continue ..."
```

---

## Review deployed resources

# [Portal](#tab/azure-portal)

Follow these steps to see an overview of your new Azure API for FHIR service:

1. In the [Azure portal](https://portal.azure.com), search for and select **Azure API for FHIR**.

2. In the FHIR list, select your new service. The **Overview** page for the new Azure API for FHIR service appears.

# [PowerShell](#tab/PowerShell)

Run the following interactive code to view details about your Azure API for FHIR service. You'll have to enter the name of the new service and the resource group.

```azurepowershell-interactive
$serviceName = Read-Host -Prompt "Enter the name of your Azure API for FHIR service"
$resourceGroupName = Read-Host -Prompt "Enter the resource group name"
Write-Verbose "Get-AzHealthcareApisService -ResourceGroupName $resourceGroupName -Name $serviceName" -Verbose
Get-AzHealthcareApisService -ResourceGroupName $resourceGroupName -Name $serviceName
Read-Host "Press [ENTER] to continue..."
```

# [CLI](#tab/CLI)

Run the following interactive code to view details about your Azure API for FHIR service. You'll have to enter the name of the new service and the resource group.

```azurecli-interactive
read -p "Enter the name of your Azure API for FHIR service:" serviceName &&
read -p "Enter the resource group name:" resourceGroupName &&
echo "SHOW SERVICE DETAILS:  az healthcareapis service show --resource-group $resourceGroupName --resource-name $serviceName" &&
az healthcareapis service show --resource-group $resourceGroupName --resource-name $serviceName &&
read -p "Press [ENTER] to continue ..."
```

---

## Clean up resources

When it's no longer needed, delete the resource group, which deletes the resources in the resource group.

# [Portal](#tab/azure-portal)

1. In the [Azure portal](https://portal.azure.com), search for and select **Resource groups**.

2. In the resource group list, choose the name of your resource group.

3. In the **Overview** page of your resource group, select **Delete resource group**.

4. In the confirmation dialog box, type the name of your resource group, and then select **Delete**.

# [PowerShell](#tab/PowerShell)

```azurepowershell-interactive
$resourceGroupName = Read-Host -Prompt "Enter the name of the resource group to delete"
Write-Verbose "Remove-AzResourceGroup -Name $resourceGroupName" -Verbose
Remove-AzResourceGroup -Name $resourceGroupName
Read-Host "Press [ENTER] to continue..."
```

# [CLI](#tab/CLI)

```azurecli-interactive
read -p "Enter the name of the resource group to delete:" resourceGroupName &&
echo "DELETE A RESOURCE GROUP (AND ITS RESOURCES):  az group delete --name $resourceGroupName" &&
az group delete --name $resourceGroupName &&
read -p "Press [ENTER] to continue ..."
```

---

## Next steps

For a step-by-step tutorial that guides you through the process of creating an ARM template, see:

> [!div class="nextstepaction"]
> [ Tutorial: Create and deploy your first ARM template](../azure-resource-manager/templates/template-tutorial-create-first-template.md)
