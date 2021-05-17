---
title: Quickstart - Deploy Azure Spring Cloud into an existing Virtual Network using Azure Resource Manager template (ARM template)
description: In this quickstart, we deploy a Spring Cloud cluster into an existing Virtual Network.
services: azure-resource-manager
author: ryhud
ms.service: spring-cloud
ms.topic: quickstart
ms.custom: subject-armqs
ms.author: rhudson
ms.date: 05/23/2021
---

# Quickstart: Deploy an Azure Spring Cloud Cluster into an existing Virtual Network by using an ARM Template



Azure Spring Cloud makes it easy to deploy Spring Boot microservice applications to Azure without any code changes. The service manages the infrastructure of Spring Cloud applications so developers can focus on their code. Azure Spring Cloud provides lifecycle management using comprehensive monitoring and diagnostics, configuration management, service discovery, CI/CD integration, blue-green deployments, and more.

This quickstart describes how to use an Azure Resource Manager template (ARM template) to create \<service>.


[!INCLUDE [About Azure Resource Manager](../../includes/resource-manager-quickstart-introduction.md)]


If your environment meets the prerequisites and you're familiar with using ARM templates, select the **Deploy to Azure** button. The template will open in the Azure portal.

[![Deploy to Azure](../media/template-deployments/deploy-to-azure.svg?sanitize=true)](https://portal.azure.com/#create/Microsoft.Template/uri/https%3A%2F%2Fraw.githubusercontent.com%2FAzure%2Fazure-spring-cloud-reference-architecture%2Fmain%2FARM%2Fbrownfield-deployment%2fazuredeploy.json)

## Prerequisites



If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.

* **Two dedicated subnets** for the Azure Spring Cloud Cluster. One for the service runtime and another for the Spring Boot micro-service applications. For more information, see [here](/azure/spring-cloud/how-to-deploy-in-azure-virtual-network#virtual-network-requirements) for subnet and virtual network requirements.
* An **existing Log Analytics workspace** for Azure Spring Cloud [diagnostics settings](/azure/spring-cloud/diagnostic-services) and a workspace-based [Application Insights](/azure/spring-cloud/how-to-distributed-tracing) resource.
* You **must identify three internal CIDR ranges** (at least /16 each) used for the Azure Spring Cloud cluster. **These CIDR ranges will not be directly routable and will be used only internally by the Azure Spring Cloud Cluster**. Clusters may not use 169.254.0.0/16, 172.30.0.0/16, 172.31.0.0/16, or 192.0.2.0/24 for the internal Spring Cloud CIDR ranges, or any IP ranges included within the cluster virtual network address range.
* **Grant service permission** to the virtual network. The Azure Spring Cloud Resource Provider requires Owner permission to your virtual network in order to grant a dedicated and dynamic service principal on the virtual network for further deployment and maintenance. For more information, see [here](/azure/spring-cloud/how-to-deploy-in-azure-virtual-network#grant-service-permission-to-the-virtual-network) for instructions and more information.
* If using **Azure Firewall** or an **NVA**, you will need to satisfy the following prerequisites:
  * Network and FQDN rules. For more information, see the [requirements](/azure/spring-cloud/how-to-deploy-in-azure-virtual-network#virtual-network-requirements).
  * A unique UDR ([User Defined Route](/azure/virtual-network/virtual-networks-udr-overview)) applied to each of the service runtime and Spring Boot micro-service application subnets. The UDR should be configured with a route for **0.0.0.0/0** with a destination of your NVA before deploying the spring cloud cluster. For more information, see [here](/azure/spring-cloud/how-to-deploy-in-azure-virtual-network#bring-your-own-route-table).

## Review the template

The template used in this quickstart is from [Azure Spring Cloud Reference Architecture](https://github.com/Azure/azure-spring-cloud-reference-architecture/).

:::code language="json" source="azure-spring-cloud-reference-architecture/ARM/brownfield-deployment/azuredeploy.json":::

Two Azure resources are defined in the template:

* [Microsoft.AppPlatform/Spring](/azure/templates/microsoft.appplatform/spring): Create an Azure Spring Cloud instance.
* [Microsoft.Insights/components](/azure/templates/microsoft.insights/components): Create an Application Insights workspace.

For Azure CLI and Terraform deployments, see the [Azure Spring Cloud Reference Architecture](https://github.com/Azure/azure-spring-cloud-reference-architecture)repository on GitHub.

## Deploy the template

1. Select the following image to sign in to Azure and open a template. The template creates an Azure Spring Cloud instance into an existing Virtual Network and a workspace-based Application Insights instance into an existing Azure Monitor Log Analytics Workspace.

[![Deploy to Azure](../media/template-deployments/deploy-to-azure.svg?sanitize=true)](https://portal.azure.com/#create/Microsoft.Template/uri/https%3A%2F%2Fraw.githubusercontent.com%2FAzure%2Fazure-spring-cloud-reference-architecture%2Fmain%2FARM%2Fbrownfield-deployment%2fazuredeploy.json)

2. Enter Values for the following fields:

- **Resource Group:** select **Create new**, enter a unique name for the **resource group**, and then click **OK**.
- **springCloudInstanceName:** Enter the name of the Azure Spring Cloud resource.
- **appInsightsName:** Enter the name of the Application Insights instance for Azure Spring Cloud.
- **laWorkspaceResourceId:** Enter the resource ID of the existing Log Analytics workspace (For example: "/subscriptions/[your sub]/resourcegroups/[your log analytics rg]/providers/Microsoft.OperationalInsights/workspaces/[your log analytics workspace name]")
- **springCloudAppSubnetID:** Enter the resourceID of the Azure Spring Cloud App Subnet.
- **springCloudRuntimeSubnetID:** Enter the resourceID of the Azure Spring Cloud Runtime Subnet.
- **springCloudServiceCidrs:** Enter a comma-separated list of IP address ranges (3 in total) in CIDR format. The IP ranges are reserved to host underlying Azure Spring Cloud infrastructure, which should be 3 at least /16 unused IP ranges, must not overlap with any routable subnet IP ranges used within the network.
- **tags:** Enter any custom tags.

3. Click **Review + Create** and then **Create**

## Review deployed resources

You can either use the Azure portal to check the deployed resources, or use Azure CLI or Azure PowerShell script to list the deployed resources.

## Clean up resources

If you plan to continue working with subsequent quickstarts and tutorials, you might want to leave these resources in place. When no longer needed, delete the resource group, which deletes the resources in the resource group. To delete the resource group by using Azure CLI or Azure PowerShell:

# [CLI](#tab/CLI)

```azurecli-interactive
echo "Enter the Resource Group name:" &&
read resourceGroupName &&
az group delete --name $resourceGroupName &&
echo "Press [ENTER] to continue ..."
```

# [PowerShell](#tab/PowerShell)

```azurepowershell-interactive
$resourceGroupName = Read-Host -Prompt "Enter the Resource Group name"
Remove-AzResourceGroup -Name $resourceGroupName
Write-Host "Press [ENTER] to continue..."
```

## Next steps

<!-- 
Make the next steps similar to other quickstarts and use a blue button to link to the next article for your service. Or direct readers to the article: "Tutorial: Create and deploy your first ARM template" to follow the process of creating a template.

To include additional links for more information about the service, it's acceptable to use a paragraph and bullet points.
-->

In this quickstart, you created an Azure Spring Cloud instance into an existing Virtual Network using an ARM template and validated the deployment. To learn more about Azure Spring Cloud and Azure Resource Manager, continue on to the articles below.

- Deploy one of the following sample applications from the locations below:
    * [Pet Clinic App with MySQL Integration](https://github.com/azure-samples/spring-petclinic-microservices) (Microservices with MySQL backend).
    * [Simple Hello World](/azure/spring-cloud/spring-cloud-quickstart?tabs=Azure-CLI&pivots=programming-language-java).
- Use [custom domains](/azure/spring-cloud/tutorial-custom-domain) with Azure Spring Cloud.
- Expose Azure Spring Cloud applications to the internet using [Azure Application Gateway](/azure/spring-cloud/expose-apps-gateway-azure-firewall).
- View a secure end-to-end [Reference Architecture](/azure/spring-cloud/reference-architecture) for Azure Spring Cloud that is based on the [Microsoft Azure Well-Architected Framework](/azure/architecture/framework/)
- Learn more about [Azure Resource Manager](../azure-resource-manager/management/overview.md)

