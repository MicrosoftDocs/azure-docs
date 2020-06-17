---
title: Create SQL Server VM (Azure Resource Manager template)
description: Learn how to create a SQL Server on Azure Virtual Machine (VM) by using Azure Resource Manager template.
services: azure-resource-manager
author: MashaMSFT
ms.service: azure-resource-manager
ms.topic: quickstart
ms.custom: subject-armqs
ms.author: mathoma
ms.date: 06/16/20
ms.service: virtual-machines-sql
---

# Create SQL Server VM (Azure Resource Manager template)

[!INCLUDE [About Azure Resource Manager](../../../../includes/resource-manager-quickstart-introduction.md)]

## Prerequisites

The SQL VM ARM template requires the following:

- A [resource group](../../../azure-resource-manager/management/manage-resource-groups-portal.md#create-resource-groups) with a [virtual network](../../../virtual-network/quick-create-portal.md) and [subnet](../../../virtual-network/virtual-network-manage-subnet#add-a-subnet) already preconfigured. 

If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.


## Create a SQL Server VM



### Review the template

The template used in this quickstart is from [Azure Quickstart Templates](https://azure.microsoft.com/resources/templates/101-sql-vm-new-storage/).


:::code language="json" source="~/quickstart-templates/101-sql-vm-new-storage/azuredeploy.json" range="000-000" highlight="169-310":::

Five Azure resources are defined in the template: 

- [Microsoft.Network/publicIpAddresses](/azure/templates/microsoft.network/2018-08-01/publicipaddresses): Creates a public IP address. 
- [Microsoft.Network/networkSecurityGroups](/azure/templates/microsoft.network/networksecuritygroups): Creates a network security group. 
- [Microsoft.Network/networkInterfaces](/azure/templates/microsoft.network/networkinterfaces): Configures the network interface. 
- [Microsoft.Compute/virtualMachines](/azure/templates/microsoft.compute/virtualmachines): Creates a virtual machine in Azure. 
- [Microsoft.SqlVirtualMachine/SqlVirtualMachines](/azure/templates/microsoft.sqlvirtualmachine/sqlvirtualmachines): registers the virtual machine with the SQL VM resource provider. 

More SQL Server on Azure VM templates can be found in the [quickstart template gallery](https://azure.microsoft.com/resources/templates/?resourceType=Microsoft.Sqlvirtualmachine).


### Deploy the template

1. Select the following image to sign in to Azure and open a template. The template creates an Azure Cosmos account, a database, and a container.

   [![Deploy to Azure](../media/template-deployments/deploy-to-azure.svg)](https://portal.azure.com/#create/Microsoft.Template/uri/https%3A%2F%2Fraw.githubusercontent.com%2FAzure%2Fazure-quickstart-templates%2Fmaster%2F101-cosmosdb-sql%2Fazuredeploy.json)

2. Select or enter the following values.

   ![Resource Manager template, Azure Cosmos DB integration, deploy portal](./media/quick-create-template/create-cosmosdb-using-template-portal.png)

    Unless it is specified, use the default values to create the Azure Cosmos resources.

    * **Subscription**: select an Azure subscription.
    * **Resource group**: select **Create new**, enter a unique name for the resource group, and then click **OK**.
    * **Location**: select a location.  For example, **Central US**.
    * **Account Name**: enter a name for the Azure Cosmos account. It must be globally unique.
    * **Location**: enter a location where you want to create your Azure Cosmos account. The Azure Cosmos account can be in the same location as the resource group.
    * **Primary Region**: The primary replica region for the Azure Cosmos account.
    * **Secondary region**: The secondary replica region for the Azure Cosmos account.
    * **Default Consistency Level**: The default consistency level for the Azure Cosmos account.
    * **Max Staleness Prefix**: Max stale requests. Required for BoundedStaleness.
    * **Max Interval in Seconds**: Max lag time. Required for BoundedStaleness.
    * **Database Name**: The name of the Azure Cosmos database.
    * **Container Name**: The name of the Azure Cosmos container.
    * **Throughput**:  The throughput for the container, minimum throughput value is 400 RU/s.
    * **I agree to the terms and conditions state above**: Select.

3. Select **Purchase**. After the Azure Cosmos account has been deployed successfully, you get a notification:

   ![Resource Manager template, Cosmos DB integration, deploy portal notification](./media/quick-create-template/resource-manager-template-portal-deployment-notification.png)

The Azure portal is used to deploy the template. In addition to the Azure portal, you can also use the Azure PowerShell, Azure CLI, and REST API. To learn other deployment methods, see [Deploy templates](../azure-resource-manager/templates/deploy-powershell.md).

## Review deployed resources

<!-- You can also use the title "Validate the deployment". -->

<!-- Include a portal screenshot of the resources or use interactive Azure CLI and Azure PowerShell commands to show the deployed resources. -->

You can either use the Azure portal to check the deployed resources, or use Azure CLI or Azure PowerShell script to list the deployed resources.

## Clean up resources

<!-- Include a paragraph that explains how to delete unneeded resources. Add a portal screenshot or use interactive Azure CLI and Azure PowerShell commands to clean up the resources. -->

When no longer needed, delete the resource group, which deletes the resources in the resource group.

<!--

Choose Azure CLI, Azure PowerShell, or Azure portal to delete the resource group.

Here are the samples for Azure CLI and Azure PowerShell:

```azurecli-interactive
echo "Enter the Resource Group name:" &&
read resourceGroupName &&
az group delete --name $resourceGroupName &&
echo "Press [ENTER] to continue ..."
```

```azurepowershell-interactive
$resourceGroupName = Read-Host -Prompt "Enter the Resource Group name"
Remove-AzResourceGroup -Name $resourceGroupName
Write-Host "Press [ENTER] to continue..."
```

-->

## Next steps

<!-- You can either make the next steps similar to the next steps in your other quickstarts, or point users to the following tutorial.

If you want to include links to more information about the service, it's acceptable to use a paragraph and bullet points.
-->

For a step-by-step tutorial that guides you through the process of creating a template, see:

> [!div class="nextstepaction"]
> [ Tutorial: Create and deploy your first Azure Resource Manager template](/azure/azure-resource-manager/templates/template-tutorial-create-first-template)
