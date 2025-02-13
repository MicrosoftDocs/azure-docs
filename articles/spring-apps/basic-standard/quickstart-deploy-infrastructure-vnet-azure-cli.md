---
title: Quickstart - Provision Azure Spring Apps Using Azure CLI
description: This quickstart shows you how to use Azure CLI to deploy an Azure Spring Apps cluster into an existing virtual network.
services: azure-cli
author: KarlErickson
ms.service: azure-spring-apps
ms.topic: quickstart
ms.custom: devx-track-azurecli, devx-track-java, mode-api
ms.author: vramasubbu
ms.date: 08/28/2024
---

# Quickstart: Provision Azure Spring Apps using Azure CLI

[!INCLUDE [deprecation-note](../includes/deprecation-note.md)]

**This article applies to:** ❎ Basic ✅ Standard ✅ Enterprise

This quickstart describes how to use Azure CLI to deploy an Azure Spring Apps cluster into an existing virtual network.

Azure Spring Apps makes it easy to deploy Spring applications to Azure without any code changes. The service manages the infrastructure of Spring applications so developers can focus on their code. Azure Spring Apps provides lifecycle management using comprehensive monitoring and diagnostics, configuration management, service discovery, CI/CD integration, blue-green deployments, and more.

The Enterprise deployment plan includes the following Tanzu components:

* Build Service
* Application Configuration Service
* Service Registry
* Spring Cloud Gateway
* API Portal

## Prerequisites

* An Azure subscription. If you don't have a subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.
* Two dedicated subnets for the Azure Spring Apps cluster, one for the service runtime and another for the Spring applications. For subnet and virtual network requirements, see the [Virtual network requirements](how-to-deploy-in-azure-virtual-network.md#virtual-network-requirements) section of [Deploy Azure Spring Apps in a virtual network](how-to-deploy-in-azure-virtual-network.md).
* An existing Log Analytics workspace for Azure Spring Apps diagnostics settings and a workspace-based Application Insights resource. For more information, see [Analyze logs and metrics with diagnostics settings](diagnostic-services.md) and [Application Insights Java In-Process Agent in Azure Spring Apps](how-to-application-insights.md).
* Three internal Classless Inter-Domain Routing (CIDR) ranges (at least `/16` each) that you've identified for use by the Azure Spring Apps cluster. These CIDR ranges won't be directly routable and will be used only internally by the Azure Spring Apps cluster. Clusters may not use `169.254.0.0/16`, `172.30.0.0/16`, `172.31.0.0/16`, or `192.0.2.0/24` for the internal Spring app CIDR ranges, or any IP ranges included within the cluster virtual network address range.
* Service permission granted to the virtual network. The Azure Spring Apps Resource Provider requires `User Access Administrator` and `Network Contributor` permissions to your virtual network in order to grant a dedicated and dynamic service principal on the virtual network for further deployment and maintenance. For instructions and more information, see the [Grant service permission to the virtual network](how-to-deploy-in-azure-virtual-network.md#grant-service-permission-to-the-virtual-network) section of [Deploy Azure Spring Apps in a virtual network](how-to-deploy-in-azure-virtual-network.md).
* If you're using Azure Firewall or a Network Virtual Appliance (NVA), you'll also need to satisfy the following prerequisites:
  * Network and fully qualified domain name (FQDN) rules. For more information, see [Virtual network requirements](how-to-deploy-in-azure-virtual-network.md#virtual-network-requirements).
  * A unique User Defined Route (UDR) applied to each of the service runtime and Spring application subnets. For more information about UDRs, see [Virtual network traffic routing](../../virtual-network/virtual-networks-udr-overview.md). The UDR should be configured with a route for `0.0.0.0/0` with a destination of your NVA before deploying the Azure Spring Apps cluster. For more information, see the [Bring your own route table](how-to-deploy-in-azure-virtual-network.md#bring-your-own-route-table) section of [Deploy Azure Spring Apps in a virtual network](how-to-deploy-in-azure-virtual-network.md).
* [Azure CLI](/cli/azure/install-azure-cli)
* If you're deploying an Azure Spring Apps Enterprise plan instance for the first time in the target subscription, see the [Requirements](../enterprise/how-to-enterprise-marketplace-offer.md#requirements) section of [Enterprise plan in Azure Marketplace](../enterprise/how-to-enterprise-marketplace-offer.md).

## Review the Azure CLI deployment script

The deployment script used in this quickstart is from the [Azure Spring Apps reference architecture](/previous-versions/azure/spring-apps/reference-architecture).

### [Standard plan](#tab/azure-spring-apps-standard)

:::code language="azurecli" source="~/azure-spring-apps-reference-architecture/CLI/brownfield-deployment/azuredeploySpringStandard.sh":::

### [Enterprise plan](#tab/azure-spring-apps-enterprise)

:::code language="azurecli" source="~/azure-spring-apps-reference-architecture/CLI/brownfield-deployment/azuredeploySpringEnterprise.sh":::

---

## Deploy the cluster

To deploy the Azure Spring Apps cluster using the Azure CLI script, follow these steps:

1. Sign in to Azure by using the following command:

   ```azurecli
   az login
   ```

   After you sign in, this command will output information about all the subscriptions you have access to. Take note of the name and ID of the subscription you want to use.

1. Set the target subscription.

   ```azurecli
   az account set --subscription "<your subscription name>"
   ```

1. Register the Azure Spring Apps Resource Provider.

   ```azurecli
   az provider register --namespace 'Microsoft.AppPlatform'
   ```

1. Add the required extensions to Azure CLI.

   ```azurecli
   az extension add --name spring
   ```

1. Choose a deployment location from the regions where Azure Spring Apps is available, as shown in [Products available by region](https://azure.microsoft.com/global-infrastructure/services/?products=spring-cloud&regions=all).

1. Use the following command to generate a list of Azure locations. Take note of the short **Name** value for the region you selected in the previous step.

   ```azurecli
   az account list-locations --output table
   ```

1. Create a resource group to deploy the resource to.

   ```azurecli
   az group create --name <your-resource-group-name> --location <location-name>
   ```

1. Save the script for Azure Spring Apps [Standard plan](https://raw.githubusercontent.com/Azure/azure-spring-apps-landing-zone-accelerator/reference-architecture/CLI/brownfield-deployment/azuredeploySpringStandard.sh) or [Enterprise plan](https://raw.githubusercontent.com/Azure/azure-spring-apps-landing-zone-accelerator/reference-architecture/CLI/brownfield-deployment/azuredeploySpringEnterprise.sh) locally, then run it from the Bash prompt.

   **Standard plan:**

   ```azurecli
   ./azuredeploySpringStandard.sh
   ```

   **Enterprise plan:**

   ```azurecli
   ./azuredeploySpringEnterprise.sh
   ```

1. Enter the following values when prompted by the script:

   * The Azure subscription ID that you saved earlier.
   * The Azure location name that you saved earlier.
   * The name of the resource group that you created earlier.
   * The name of the virtual network resource group where you'll deploy your resources.
   * The name of the spoke virtual network (for example, **vnet-spoke**).
   * The name of the subnet to be used by the Azure Spring Apps Application Service (for example, **snet-app**).
   * The name of the subnet to be used by the Azure Spring Apps Runtime Service (for example, **snet-runtime**).
   * The name of the resource group for the Azure Log Analytics workspace to be used for storing diagnostic logs.
   * The name of the Azure Log Analytics workspace (for example, **la-cb5sqq6574o2a**).
   * The CIDR ranges from your virtual network to be used by Azure Spring Apps (for example, **XX.X.X.X/16,XX.X.X.X/16,XX.X.X.X/16**).
   * The key/value pairs to be applied as tags on all resources that support tags. For more information, see [Use tags to organize your Azure resources and management hierarchy](../../azure-resource-manager/management/tag-resources.md). Use a space-separated list to apply multiple tags (for example, *environment=Dev BusinessUnit=finance*).

After you provide this information, the script will create and deploy the Azure resources.

## Review deployed resources

You can either use the Azure portal to check the deployed resources, or use Azure CLI to list the deployed resources.

## Clean up resources

If you plan to continue working with subsequent quickstarts and tutorials, you might want to leave these resources in place. When no longer needed, delete the resource group, which deletes the resources in the resource group. To delete the resource group by using Azure CLI, use the following commands:

```azurecli
echo "Enter the Resource Group name:" &&
read resourceGroupName &&
az group delete --name $resourceGroupName &&
echo "Press [ENTER] to continue ..."
```

## Next steps

In this quickstart, you deployed an Azure Spring Apps instance into an existing virtual network using Azure CLI, and then validated the deployment. To learn more about Azure Spring Apps, continue on to the resources below.

* Deploy one of the following sample applications from the locations below:
  * [Pet Clinic App with MySQL Integration](https://github.com/azure-samples/spring-petclinic-microservices)
  * [Simple Hello World](./quickstart.md?pivots=programming-language-java&tabs=Azure-CLI).
* Use [custom domains](how-to-custom-domain.md) with Azure Spring Apps.
* Expose applications in Azure Spring Apps to the internet using Azure Application Gateway. For more information, see [Expose applications with end-to-end TLS in a virtual network](expose-apps-gateway-end-to-end-tls.md).
* View the secure end-to-end [Azure Spring Apps reference architecture](/previous-versions/azure/spring-apps/reference-architecture), which is based on the [Microsoft Azure Well-Architected Framework](/azure/architecture/framework/).
