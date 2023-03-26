---
title: Quickstart - Provision Azure Spring Apps using an Azure Resource Manager template (ARM template)
description: This quickstart shows you how to use an ARM template to deploy an Azure Spring Apps cluster into an existing virtual network.
services: azure-resource-manager
author: karlerickson
ms.service: spring-apps
ms.topic: quickstart
ms.custom: subject-armqs, devx-track-java, mode-arm, event-tier1-build-2022
ms.author: rhudson
ms.date: 05/31/2022
---

# Quickstart: Provision Azure Spring Apps using an ARM template

> [!NOTE]
> Azure Spring Apps is the new name for the Azure Spring Cloud service. Although the service has a new name, you'll see the old name in some places for a while as we work to update assets such as screenshots, videos, and diagrams.

**This article applies to:** ❌ Basic tier ✔️ Standard tier ✔️ Enterprise tier

This quickstart describes how to use an Azure Resource Manager template (ARM template) to deploy an Azure Spring Apps cluster into an existing virtual network.

Azure Spring Apps makes it easy to deploy Spring applications to Azure without any code changes. The service manages the infrastructure of Spring applications so developers can focus on their code. Azure Spring Apps provides lifecycle management using comprehensive monitoring and diagnostics, configuration management, service discovery, CI/CD integration, blue-green deployments, and more.

The Enterprise tier deployment plan includes the following Tanzu components:

* Build Service
* Application Configuration Service
* Service Registry
* Spring Cloud Gateway
* API Portal

[!INCLUDE [About Azure Resource Manager](../../includes/resource-manager-quickstart-introduction.md)]

## Prerequisites

* An Azure subscription. If you don't have a subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.
* Two dedicated subnets for the Azure Spring Apps cluster, one for the service runtime and another for the Spring applications. For subnet and virtual network requirements, see the [Virtual network requirements](how-to-deploy-in-azure-virtual-network.md#virtual-network-requirements) section of [Deploy Azure Spring Apps in a virtual network](how-to-deploy-in-azure-virtual-network.md).
* An existing Log Analytics workspace for Azure Spring Apps diagnostics settings and a workspace-based Application Insights resource. For more information, see [Analyze logs and metrics with diagnostics settings](diagnostic-services.md) and [Application Insights Java In-Process Agent in Azure Spring Apps](how-to-application-insights.md).
* Three internal Classless Inter-Domain Routing (CIDR) ranges (at least */16* each) that you've identified for use by the Azure Spring Apps cluster. These CIDR ranges won't be directly routable and will be used only internally by the Azure Spring Apps cluster. Clusters may not use *169.254.0.0/16*, *172.30.0.0/16*, *172.31.0.0/16*, or *192.0.2.0/24* for the internal Azure Spring Apps CIDR ranges. Clusters also may not use any IP ranges included within the cluster virtual network address range.
* Service permission granted to the virtual network. The Azure Spring Apps Resource Provider requires Owner permission to your virtual network in order to grant a dedicated and dynamic service principal on the virtual network for further deployment and maintenance. For instructions and more information, see the [Grant service permission to the virtual network](how-to-deploy-in-azure-virtual-network.md#grant-service-permission-to-the-virtual-network) section of [Deploy Azure Spring Apps in a virtual network](how-to-deploy-in-azure-virtual-network.md).
* If you're using Azure Firewall or a Network Virtual Appliance (NVA), you'll also need to satisfy the following prerequisites:

  * Network and fully qualified domain name (FQDN) rules. For more information, see [Virtual network requirements](how-to-deploy-in-azure-virtual-network.md#virtual-network-requirements).
  * A unique User Defined Route (UDR) applied to each of the service runtime and Spring application subnets. For more information about UDRs, see [Virtual network traffic routing](../virtual-network/virtual-networks-udr-overview.md). The UDR should be configured with a route for *0.0.0.0/0* with a destination of your NVA before deploying the Azure Spring Apps cluster. For more information, see the [Bring your own route table](how-to-deploy-in-azure-virtual-network.md#bring-your-own-route-table) section of [Deploy Azure Spring Apps in a virtual network](how-to-deploy-in-azure-virtual-network.md).
* If you're deploying Azure Spring Apps Enterprise tier for the first time in the target subscription, see the [Requirements](./how-to-enterprise-marketplace-offer.md#requirements) section of [Enterprise Tier in Azure Marketplace](./how-to-enterprise-marketplace-offer.md).

## Review the template

The templates used in this quickstart are from the [Azure Spring Apps Reference Architecture](reference-architecture.md).

### [Standard tier](#tab/azure-spring-apps-standard)

:::code language="json" source="~/azure-spring-apps-reference-architecture/ARM/brownfield-deployment/azuredeploySpringStandard.json":::

### [Enterprise tier](#tab/azure-spring-apps-enterprise)

:::code language="json" source="~/azure-spring-apps-reference-architecture/ARM/brownfield-deployment/azuredeploySpringEnterprise.json":::

---

Two Azure resources are defined in the template:

* [Microsoft.AppPlatform/Spring](/azure/templates/microsoft.appplatform/spring) creates an Azure Spring Apps instance.
* [Microsoft.Insights/components](/azure/templates/microsoft.insights/components) creates an Application Insights workspace.

## Deploy the template

To deploy the template, use the following steps.

First, select the following image to sign in to Azure and open a template. The template creates an Azure Spring Apps instance in an existing Virtual Network and a workspace-based Application Insights instance in an existing Azure Monitor Log Analytics Workspace.

### [Standard tier](#tab/azure-spring-apps-standard)

:::image type="content" source="../media/template-deployments/deploy-to-azure.svg" alt-text="Button to deploy the ARM template to Azure." border="false" link="https://portal.azure.com/#create/Microsoft.Template/uri/https%3A%2F%2Fraw.githubusercontent.com%2FAzure%2Fazure-spring-apps-landing-zone-accelerator%2Freference-architecture%2FARM%2Fbrownfield-deployment%2fazuredeploySpringStandard.json":::

### [Enterprise tier](#tab/azure-spring-apps-enterprise)

:::image type="content" source="../media/template-deployments/deploy-to-azure.svg" alt-text="Button to deploy the ARM template to Azure." border="false" link="https://portal.azure.com/#create/Microsoft.Template/uri/https%3A%2F%2Fraw.githubusercontent.com%2FAzure%2Fazure-spring-apps-landing-zone-accelerator%2Freference-architecture%2FARM%2Fbrownfield-deployment%2fazuredeploySpringEnterprise.json":::

---

Next, enter values for the following fields:

* **Resource Group:** Select **Create new**, enter a unique name for the **resource group**, and then select **OK**.
* **springCloudInstanceName:** Enter the name of the Azure Spring Apps resource.
* **appInsightsName:** Enter the name of the Application Insights instance for Azure Spring Apps.
* **laWorkspaceResourceId:** Enter the resource ID of the existing Log Analytics workspace (for example, */subscriptions/\<your subscription>/resourcegroups/\<your Log Analytics resource group>/providers/Microsoft.OperationalInsights/workspaces/\<your Log Analytics workspace name>*.)
* **springCloudAppSubnetID:** Enter the resource ID of the Azure Spring Apps Application Subnet.
* **springCloudRuntimeSubnetID:** Enter the resource ID of the Azure Spring Apps Runtime Subnet.
* **springCloudServiceCidrs:** Enter a comma-separated list of IP address ranges (three in total) in CIDR format. The IP ranges are reserved to host underlying Azure Spring Apps infrastructure. These three ranges should be at least */16* unused IP ranges, and must not overlap with any routable subnet IP ranges used within the network.
* **tags:** Enter any custom tags.

Finally, select **Review + Create** and then **Create**.

## Review deployed resources

You can either use the Azure portal to check the deployed resources, or use Azure CLI or Azure PowerShell script to list the deployed resources.

## Clean up resources

If you plan to continue working with subsequent quickstarts and tutorials, you might want to leave these resources in place. When no longer needed, delete the resource group, which deletes the resources in the resource group. To delete the resource group by using Azure CLI or Azure PowerShell, use the following commands:

### [Azure CLI](#tab/azure-cli)

```azurecli
echo "Enter the Resource Group name:" &&
read resourceGroupName &&
az group delete --name $resourceGroupName &&
echo "Press [ENTER] to continue ..."
```

### [PowerShell](#tab/azure-powershell)

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
* Expose applications in Azure Spring Apps to the internet using Azure Application Gateway. For more information, see [Expose applications with end-to-end TLS in a virtual network](expose-apps-gateway-end-to-end-tls.md).
* View the secure end-to-end [Azure Spring Apps reference architecture](reference-architecture.md), which is based on the [Microsoft Azure Well-Architected Framework](/azure/architecture/framework/).
* Learn more about [Azure Resource Manager](../azure-resource-manager/management/overview.md).
