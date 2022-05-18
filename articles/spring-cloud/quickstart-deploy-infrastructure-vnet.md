---
title: Quickstart - Provision Azure Spring Apps using an Azure Resource Manager template (ARM template)
description: This quickstart shows you how to use an ARM template to deploy a Spring Apps cluster into an existing virtual network.
services: azure-resource-manager
author: karlerickson
ms.service: spring-cloud
ms.topic: quickstart
ms.custom: subject-armqs, devx-track-java, mode-arm
ms.author: rhudson
ms.date: 05/13/2022
---

# Quickstart: Provision Azure Spring Apps using an ARM template

**This article applies to:** ✘ Basic Tier ✔️ Standard tier ✔️ Enterprise tier

This quickstart describes how to use an Azure Resource Manager template (ARM template) to deploy an Azure Spring Apps cluster into an existing virtual network.

Azure Spring Apps makes it easy to deploy Spring applications to Azure without any code changes. The service manages the infrastructure of Spring Apps applications so developers can focus on their code. Azure Spring Apps provides lifecycle management using comprehensive monitoring and diagnostics, configuration management, service discovery, CI/CD integration, blue-green deployments, and more.

[!INCLUDE [About Azure Resource Manager](../../includes/resource-manager-quickstart-introduction.md)]

## Prerequisites

* An Azure subscription. If you don't have a subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.
* Two dedicated subnets for the Azure Spring Apps cluster, one for the service runtime and another for the Spring applications. For subnet and virtual network requirements, see the [Virtual network requirements](how-to-deploy-in-azure-virtual-network.md#virtual-network-requirements) section of [Deploy Azure Spring Apps in a virtual network](how-to-deploy-in-azure-virtual-network.md).
* An existing Log Analytics workspace for Azure Spring Apps diagnostics settings and a workspace-based Application Insights resource. For more information, see [Analyze logs and metrics with diagnostics settings](diagnostic-services.md) and [Application Insights Java In-Process Agent in Azure Spring Apps](how-to-application-insights.md).
* Three internal Classless Inter-Domain Routing (CIDR) ranges (at least */16* each) that you've identified for use by the Azure Spring Apps cluster. These CIDR ranges will not be directly routable and will be used only internally by the Azure Spring Apps cluster. Clusters may not use *169.254.0.0/16*, *172.30.0.0/16*, *172.31.0.0/16*, or *192.0.2.0/24* for the internal Spring Apps CIDR ranges, or any IP ranges included within the cluster virtual network address range.
* Service permission granted to the virtual network. The Azure Spring Apps Resource Provider requires Owner permission to your virtual network in order to grant a dedicated and dynamic service principal on the virtual network for further deployment and maintenance. For instructions and more information, see the [Grant service permission to the virtual network](how-to-deploy-in-azure-virtual-network.md#grant-service-permission-to-the-virtual-network) section of [Deploy Azure Spring Apps in a virtual network](how-to-deploy-in-azure-virtual-network.md).
* If you're using Azure Firewall or a Network Virtual Appliance (NVA), you'll also need to satisfy the following prerequisites:

  * Network and fully qualified domain name (FQDN) rules. For more information, see [Virtual network requirements](how-to-deploy-in-azure-virtual-network.md#virtual-network-requirements).
  * A unique User Defined Route (UDR) applied to each of the service runtime and Spring application subnets. For more information about UDRs, see [Virtual network traffic routing](../virtual-network/virtual-networks-udr-overview.md). The UDR should be configured with a route for *0.0.0.0/0* with a destination of your NVA before deploying the Spring Apps cluster. For more information, see the [Bring your own route table](how-to-deploy-in-azure-virtual-network.md#bring-your-own-route-table) section of [Deploy Azure Spring Apps in a virtual network](how-to-deploy-in-azure-virtual-network.md).
* If deploying Azure Spring Enterprise for the first time in the the target subscription, you are required to register the provider, and accept the legal terms for the Enterprise tier
```azurecli
az provider register --namespace Microsoft.SaaS
az term accept --publisher vmware-inc --product azure-spring-cloud-vmware-tanzu-2 --plan tanzu-asc-ent-mtr
```

## Review the template

The templates used in this quickstart are from the [Azure Spring Apps Reference Architecture](reference-architecture.md).

# [Azure Spring Standard](#tab/azure-spring-standard)

:::code language="json" source="~/azure-spring-cloud-reference-architecture/ARM/brownfield-deployment/azuredeploySpringStandard.json":::

Two Azure resources are defined in the template:

* [Microsoft.AppPlatform/Spring](/azure/templates/microsoft.appplatform/spring): Create an Azure Spring Apps instance.
* [Microsoft.Insights/components](/azure/templates/microsoft.insights/components): Create an Application Insights workspace.

For Azure CLI, Terraform, and Bicep deployments, see the [Azure Spring Apps Reference Architecture](https://github.com/Azure/azure-spring-cloud-reference-architecture) repository on GitHub.

## Deploy the template

To deploy the template, follow these steps:

1. Select the following image to sign in to Azure and open a template. The template creates an Azure Spring Apps instance into an existing Virtual Network and a workspace-based Application Insights instance into an existing Azure Monitor Log Analytics Workspace.

   [![Deploy to Azure](../media/template-deployments/deploy-to-azure.svg?sanitize=true)](https://portal.azure.com/#create/Microsoft.Template/uri/https%3A%2F%2Fraw.githubusercontent.com%2FAzure%2Fazure-spring-cloud-reference-architecture%2Fmain%2FARM%2Fbrownfield-deployment%2fazuredeploySpringStandard.json)

2. Enter values for the following fields:

   * **Resource Group:** select **Create new**, enter a unique name for the **resource group**, and then select **OK**.
   * **springCloudInstanceName:** Enter the name of the Azure Spring Apps resource.
   * **appInsightsName:** Enter the name of the Application Insights instance for Azure Spring Apps.
   * **laWorkspaceResourceId:** Enter the resource ID of the existing Log Analytics workspace (for example, */subscriptions/\<your subscription>/resourcegroups/\<your log analytics resource group>/providers/Microsoft.OperationalInsights/workspaces/\<your log analytics workspace name>*.)
   * **springCloudAppSubnetID:** Enter the resourceID of the Azure Spring Apps App Subnet.
   * **springCloudRuntimeSubnetID:** Enter the resourceID of the Azure Spring Apps Runtime Subnet.
   * **springCloudServiceCidrs:** Enter a comma-separated list of IP address ranges (3 in total) in CIDR format. The IP ranges are reserved to host underlying Azure Spring Apps infrastructure. These 3 ranges should be at least */16* unused IP ranges, and must not overlap with any routable subnet IP ranges used within the network.
   * **tags:** Enter any custom tags.

3. Select **Review + Create** and then **Create**.

# [Azure Spring Enterprise](#tab/azure-spring-enterprise)

:::code language="json" source="~/azure-spring-cloud-reference-architecture/ARM/brownfield-deployment/azuredeploySpringEnterprise.json":::

Two Azure resources are defined in the template:

* [Microsoft.AppPlatform/Spring](/azure/templates/microsoft.appplatform/spring): Create an Azure Spring Apps instance.
* [Microsoft.Insights/components](/azure/templates/microsoft.insights/components): Create an Application Insights workspace.

For Azure CLI, Terraform, and Bicep deployments, see the [Azure Spring Apps Reference Architecture](https://github.com/Azure/azure-spring-cloud-reference-architecture) repository on GitHub.

## Deploy the template

To deploy the template, follow these steps:

1. Select the following image to sign in to Azure and open a template. The template creates an Azure Spring Apps instance into an existing Virtual Network and a workspace-based Application Insights instance into an existing Azure Monitor Log Analytics Workspace.

   [![Deploy to Azure](../media/template-deployments/deploy-to-azure.svg?sanitize=true)](https://portal.azure.com/#create/Microsoft.Template/uri/https%3A%2F%2Fraw.githubusercontent.com%2FAzure%2Fazure-spring-cloud-reference-architecture%2Fmain%2FARM%2Fbrownfield-deployment%2fazuredeploySpringEnterprise.json)

2. Enter values for the following fields:

   * **Resource Group:** select **Create new**, enter a unique name for the **resource group**, and then select **OK**.
   * **springCloudInstanceName:** Enter the name of the Azure Spring Apps resource.
   * **appInsightsName:** Enter the name of the Application Insights instance for Azure Spring Apps.
   * **laWorkspaceResourceId:** Enter the resource ID of the existing Log Analytics workspace (for example, */subscriptions/\<your subscription>/resourcegroups/\<your log analytics resource group>/providers/Microsoft.OperationalInsights/workspaces/\<your log analytics workspace name>*.)
   * **springCloudAppSubnetID:** Enter the resourceID of the Azure Spring Apps App Subnet.
   * **springCloudRuntimeSubnetID:** Enter the resourceID of the Azure Spring Apps Runtime Subnet.
   * **springCloudServiceCidrs:** Enter a comma-separated list of IP address ranges (3 in total) in CIDR format. The IP ranges are reserved to host underlying Azure Spring Apps infrastructure. These 3 ranges should be at least */16* unused IP ranges, and must not overlap with any routable subnet IP ranges used within the network.
   * **tags:** Enter any custom tags.

3. Select **Review + Create** and then **Create**.

---

## Review deployed resources

You can either use the Azure portal to check the deployed resources, or use Azure CLI or Azure PowerShell script to list the deployed resources.

## Clean up resources

If you plan to continue working with subsequent quickstarts and tutorials, you might want to leave these resources in place. When no longer needed, delete the resource group, which deletes the resources in the resource group. To delete the resource group by using Azure CLI or Azure PowerShell, use the following commands:

# [CLI](#tab/azure-cli)

```azurecli
echo "Enter the Resource Group name:" &&
read resourceGroupName &&
az group delete --name $resourceGroupName &&
echo "Press [ENTER] to continue ..."
```

# [PowerShell](#tab/azure-powershell)

```azurepowershell-interactive
$resourceGroupName = Read-Host -Prompt "Enter the Resource Group name"
Remove-AzResourceGroup -Name $resourceGroupName
Write-Host "Press [ENTER] to continue..."
```

---

## Next steps

In this quickstart, you deployed an Azure Spring Apps instance into an existing virtual network using an ARM template, and then validated the deployment. To learn more about Azure Spring Apps and Azure Resource Manager, continue on to the resources below.

* Deploy one of the following sample applications from the locations below:
  * [Pet Clinic App with MySQL Integration](https://github.com/azure-samples/spring-petclinic-microservices)
  * [Simple Hello World](./quickstart.md?pivots=programming-language-java&tabs=Azure-CLI)
* Use [custom domains](tutorial-custom-domain.md) with Azure Spring Apps.
* Expose applications in Azure Spring Apps to the internet using [Azure Application Gateway](expose-apps-gateway-azure-firewall.md).
* View the secure end-to-end [Azure Spring Apps reference architecture](reference-architecture.md), which is based on the [Microsoft Azure Well-Architected Framework](/azure/architecture/framework/).
* Learn more about [Azure Resource Manager](../azure-resource-manager/management/overview.md).
