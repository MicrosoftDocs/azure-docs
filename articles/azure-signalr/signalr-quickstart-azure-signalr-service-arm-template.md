---
title: 'Quickstart: Create an Azure SignalR Service - ARM template'
description: In this Quickstart, learn how to create an Azure SignalR Service using an Azure Resource Manager template (ARM template).
author: vicancy
ms.author: lianwei
ms.date: 10/02/2020
ms.topic: quickstart
ms.service: signalr
ms.custom: subject-armqs, mode-arm, devx-track-arm-template
---

# Quickstart: Use an ARM template to deploy Azure SignalR Service

This quickstart walks you through the process of creating an Azure SignalR Service using an Azure Resource Manager (ARM) template. You can deploy the Azure SignalR Service through the Azure portal, PowerShell, or CLI.

[!INCLUDE [About Azure Resource Manager](../../includes/resource-manager-quickstart-introduction.md)]

If your environment meets the prerequisites and you're familiar with using ARM templates, select the **Deploy to Azure** button. The template opens in the Azure portal once you sign in.

:::image type="content" source="~/reusable-content/ce-skilling/azure/media/template-deployments/deploy-to-azure-button.svg" alt-text="Button to deploy the Resource Manager template to Azure." border="false" link="https://portal.azure.com/#create/Microsoft.Template/uri/https%3a%2f%2fraw.githubusercontent.com%2fAzure%2fazure-quickstart-templates%2fmaster%2fquickstarts%2fmicrosoft.signalrservice%2fsignalr%2fazuredeploy.json":::

## Prerequisites

# [Portal](#tab/azure-portal)

An Azure account with an active subscription. [Create one for free](https://azure.microsoft.com/free/).

# [PowerShell](#tab/PowerShell)

* An Azure account with an active subscription. [Create one for free](https://azure.microsoft.com/free/).
* If you want to run the code locally, [Azure PowerShell](/powershell/azure/install-azure-powershell).

# [CLI](#tab/CLI)

* An Azure account with an active subscription. [Create one for free](https://azure.microsoft.com/free/).
* If you want to run the code locally:
    * A Bash shell (such as Git Bash, which is included in [Git for Windows](https://gitforwindows.org)).
    * [Azure CLI](/cli/azure/install-azure-cli).

---

## Review the template

The template used in this quickstart is from [Azure Quickstart Templates](https://azure.microsoft.com/resources/templates/signalr/).

:::code language="json" source="~/quickstart-templates/quickstarts/microsoft.signalrservice/signalr/azuredeploy.json":::

The template defines one Azure resource:

* [**Microsoft.SignalRService/SignalR**](/azure/templates/microsoft.signalrservice/signalr)

## Deploy the template

# [Portal](#tab/azure-portal)

To deploy the Azure SignalR Service using the ARM template, Select the following link in the Azure portal:

:::image type="content" source="~/reusable-content/ce-skilling/azure/media/template-deployments/deploy-to-azure-button.svg" alt-text="Button to deploy the Resource Manager template to Azure." border="false" link="https://portal.azure.com/#create/Microsoft.Template/uri/https%3a%2f%2fraw.githubusercontent.com%2fAzure%2fazure-quickstart-templates%2fmaster%2fquickstarts%2fmicrosoft.signalrservice%2fsignalr%2fazuredeploy.json":::

On the **Deploy an Azure SignalR Service** page:

1. If you want, change the **Subscription** from the default.

2. For **Resource group**, select **Create new**, enter a name for the new resource group, and select **OK**.

3. If you created a new resource group, select a **Region** for the resource group.

4. If you want, enter a new **Name** and the **Location** (For example **eastus2**) of the Azure SignalR Service. If **Name** is not specified, it is generated automatically. The **Location** can be the same or different from the region of the resource group. If **Location** is not specified, it defaults to the same region as your resource group.

5. Choose the **Pricing Tier** (**Free_F1** or **Standard_S1**), enter the **Capacity** (number of SignalR units), and choose a **Service Mode** of **Default** (requires hub server), **Serverless** (doesn't allow any server connection), or **Classic** (routed to hub server only if hub has server connection). Now, choose whether to **Enable Connectivity Logs** or **Enable Messaging Logs**.

    > [!NOTE]
    > For the **Free_F1** pricing tier, the capacity is limited to 1 unit.

    :::image type="content" source="./media/signalr-quickstart-azure-signalr-service-arm-template/deploy-azure-signalr-service-arm-template-portal.png" alt-text="Screenshot of the ARM template for creating an Azure SignalR Service in the Azure portal.":::

6. Select **Review + create**.

7. Read the terms and conditions, and then select **Create**.

# [PowerShell](#tab/PowerShell)

> [!NOTE]
> If you want to run the PowerShell scripts locally, first enter `Connect-AzAccount` to set up your Azure credentials.

Use the following code to deploy the Azure SignalR Service using the ARM template. The code prompts you for the following items:

* The name and region of the new Azure SignalR Service
* The name and region of a new resource group
* The Azure pricing tier (**Free_F1** or **Standard_S1**)
* The SignalR unit capacity (1, 2, 5, 10, 20, 50, or 100)
  > [!NOTE]
  > For the **Free_F1** pricing tier, the capacity is limited to 1 unit.
* The service mode: **Default** to require a hub server, **Serverless** to disallow any server connection, or **Classic** to route to a hub server only if the hub has a server connection
* Whether to enable logs for connectivity or messaging (**true** or **false**)

```azurepowershell-interactive
$serviceName = Read-Host -Prompt "Enter a name for the new Azure SignalR Service"
$serviceLocation = Read-Host -Prompt "Enter an Azure region (for example, westus2) for the service"
$resourceGroupName = Read-Host -Prompt "Enter a name for the new resource group to contain the service"
$resourceGroupRegion = Read-Host -Prompt "Enter an Azure region (for example, centralus) for the resource group"

$priceTier = Read-Host -Prompt "Enter the pricing tier (Free_F1 or Standard_S1)"
$unitCapacity = Read-Host -Prompt "Enter the number of SignalR units (1, 2, 5, 10, 20, 50, or 100)"
$servicingMode = Read-Host -Prompt "Enter the service mode (Default, Serverless, or Classic)"
$enableConnectionLogs = Read-Host -Prompt "Specify whether to enable connectivity logs (true or false)"
$enableMessageLogs = Read-Host -Prompt "Specify whether to enable messaging logs (true or false)"

Write-Verbose "New-AzResourceGroup -Name $resourceGroupName -Location $resourceGroupRegion" -Verbose
New-AzResourceGroup -Name $resourceGroupName -Location $resourceGroupRegion

$paramObjHashTable = @{
    name = $serviceName
    location = $serviceLocation
    pricingTier = $priceTier
    capacity = [int]$unitCapacity
    serviceMode = $servicingMode
    enableConnectivityLogs = $enableConnectionLogs
    enableMessagingLogs = $enableMessageLogs
}

Write-Verbose "Run New-AzResourceGroupDeployment to create an Azure SignalR Service using an ARM template" -Verbose
New-AzResourceGroupDeployment -ResourceGroupName $resourceGroupName `
    -TemplateParameterObject $paramObjHashTable `
    -TemplateUri https://raw.githubusercontent.com/Azure/azure-quickstart-templates/master/quickstarts/microsoft.signalrservice/signalr/azuredeploy.json
Read-Host "Press [ENTER] to continue"
```

# [CLI](#tab/CLI)

Use the following code to deploy the Azure SignalR Service using the ARM template. The code prompts you for the following items:

* The name and region of the new Azure SignalR Service
* The name and region of a new resource group
* The Azure pricing tier (**Free_F1** or **Standard_S1**)
* The SignalR unit capacity (1, 2, 5, 10, 20, 50, or 100)
    > [!NOTE]
    > For the **Free_F1** pricing tier, the capacity is limited to 1 unit.
* The service mode: **Default** to require a hub server, **Serverless** to disallow any server connection, or **Classic** to route to a hub server only if the hub has a server connection
* Whether to enable logs for connectivity or messaging (**true** or **false**)

```azurecli-interactive
read -p "Enter a name for the new Azure SignalR Service: " serviceName &&
read -p "Enter an Azure region (for example, westus2) for the service: " serviceLocation &&
read -p "Enter a name for the new resource group to contain the service: " resourceGroupName &&
read -p "Enter an Azure region (for example, centralus) for the resource group: " resourceGroupRegion &&
read -p "Enter the pricing tier (Free_F1 or Standard_S1): " priceTier &&
read -p "Enter the number of SignalR units (1, 2, 5, 10, 20, 50, or 100): " unitCapacity &&
read -p "Enter the service mode (Default, Serverless, or Classic): " servicingMode &&
read -p "Specify whether to enable connectivity logs (true or false): " enableConnectionLogs &&
read -p "Specify whether to enable messaging logs (true or false): " enableMessageLogs &&
params='name='$serviceName' location='$serviceLocation' pricingTier='$priceTier' capacity='$unitCapacity' serviceMode='$servicingMode' enableConnectivityLogs='$enableConnectionLogs' enableMessagingLogs='$enableMessageLogs &&
echo "CREATE RESOURCE GROUP:  az group create --name $resourceGroupName --location $resourceGroupRegion" &&
az group create --name $resourceGroupName --location $resourceGroupRegion &&
echo "RUN az deployment group create, which creates an Azure SignalR Service using an ARM template" &&
az deployment group create --resource-group $resourceGroupName --parameters $params --template-uri https://raw.githubusercontent.com/Azure/azure-quickstart-templates/master/quickstarts/microsoft.signalrservice/signalr/azuredeploy.json &&
read -p "Press [ENTER] to continue: "
```

---

> [!NOTE]
> The deployment may take a few minutes to complete. Note the names for the Azure SignalR Service and the resource group, which you use to review the deployed resources later.

## Review deployed resources

# [Portal](#tab/azure-portal)

Follow these steps to see an overview of your new Azure SignalR Service:

1. In the [Azure portal](https://portal.azure.com), search for and select **SignalR**.

2. In the SignalR list, select your new service. The **Overview** page for the new Azure SignalR Service appears.

# [PowerShell](#tab/PowerShell)

Run the following interactive code to view details about your Azure SignalR Service. You have to enter the name of the new service and the resource group.

```azurepowershell-interactive
$serviceName = Read-Host -Prompt "Enter the name of your Azure SignalR Service"
$resourceGroupName = Read-Host -Prompt "Enter the resource group name"
Write-Verbose "Get-AzSignalR -ResourceGroupName $resourceGroupName -Name $serviceName" -Verbose
Get-AzSignalR -ResourceGroupName $resourceGroupName -Name $serviceName
Read-Host "Press [ENTER] to continue"
```

# [CLI](#tab/CLI)

Run the following interactive code to view details about your Azure SignalR Service. You have to enter the name of the new service and the resource group.

```azurecli-interactive
read -p "Enter the name of your Azure SignalR Service: " serviceName &&
read -p "Enter the resource group name: " resourceGroupName &&
echo "SHOW SERVICE DETAILS:  az signalr show --resource-group $resourceGroupName --name $serviceName" &&
az signalr show --resource-group $resourceGroupName --name $serviceName &&
read -p "Press [ENTER] to continue: "
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
Read-Host "Press [ENTER] to continue"
```

# [CLI](#tab/CLI)

```azurecli-interactive
read -p "Enter the name of the resource group to delete: " resourceGroupName &&
echo "DELETE A RESOURCE GROUP (AND ITS RESOURCES):  az group delete --name $resourceGroupName" &&
az group delete --name $resourceGroupName &&
read -p "Press [ENTER] to continue: "
```

---

## Next steps

For a step-by-step tutorial that guides you through the process of creating an ARM template, see:

> [!div class="nextstepaction"]
> [Tutorial: Create and deploy your first ARM template](../azure-resource-manager/templates/template-tutorial-create-first-template.md)
