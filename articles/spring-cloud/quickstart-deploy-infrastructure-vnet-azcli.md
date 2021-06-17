---
title: Quickstart - Provision Azure Spring Cloud using Azure CLI
description: This quickstart shows you how to use Azure CLI to deploy a Spring Cloud cluster into an existing virtual network.
services: azure-cli
author: vramasubbu
ms.service: spring-cloud
ms.topic: quickstart
ms.custom: devx-track-azurecli, devx-track-java
ms.author: vramasubbu
ms.date: 06/15/2021
---

# Quickstart: Provision Azure Spring Cloud using Azure CLI into an existing Virtual Network

This quickstart describes how to use Azure CLI to deploy an Azure Spring Cloud cluster into an existing virtual network.

Azure Spring Cloud makes it easy to deploy Spring Boot microservice applications to Azure without any code changes. The service manages the infrastructure of Spring Cloud applications so developers can focus on their code. Azure Spring Cloud provides lifecycle management using comprehensive monitoring and diagnostics, configuration management, service discovery, CI/CD integration, blue-green deployments, and more.

## Prerequisites

* An Azure subscription. If you don't have a subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.
* Two dedicated subnets for the Azure Spring Cloud Cluster, one for the service runtime and another for the Spring Boot micro-service applications. For subnet and virtual network requirements, see the [Virtual network requirements](how-to-deploy-in-azure-virtual-network.md#virtual-network-requirements) section of [Deploy Azure Spring Cloud in a virtual network](how-to-deploy-in-azure-virtual-network.md).
* An existing Log Analytics workspace for Azure Spring Cloud diagnostics settings and a workspace-based Application Insights resource. For more information, see [Analyze logs and metrics with diagnostics settings](diagnostic-services.md) and [Application Insights Java In-Process Agent in Azure Spring Cloud](how-to-application-insights.md).
* Three internal Classless Inter-Domain Routing (CIDR) ranges (at least */16* each) that you've identified for use by the Azure Spring Cloud cluster. These CIDR ranges will not be directly routable and will be used only internally by the Azure Spring Cloud Cluster. Clusters may not use *169.254.0.0/16*, *172.30.0.0/16*, *172.31.0.0/16*, or *192.0.2.0/24* for the internal Spring Cloud CIDR ranges, or any IP ranges included within the cluster virtual network address range.
* Service permission granted to the virtual network. The Azure Spring Cloud Resource Provider requires Owner permission to your virtual network in order to grant a dedicated and dynamic service principal on the virtual network for further deployment and maintenance. For instructions and more information, see the [Grant service permission to the virtual network](how-to-deploy-in-azure-virtual-network.md#grant-service-permission-to-the-virtual-network) section of [Deploy Azure Spring Cloud in a virtual network](how-to-deploy-in-azure-virtual-network.md).
* If you're using Azure Firewall or a Network Virtual Appliance (NVA), you'll also need to satisfy the following prerequisites:
   * Network and fully qualified domain name (FQDN) rules. For more information, see [Virtual network requirements](how-to-deploy-in-azure-virtual-network.md#virtual-network-requirements).
   * A unique User Defined Route (UDR) applied to each of the service runtime and Spring Boot micro-service application subnets. For more information about UDRs, see [Virtual network traffic routing](../virtual-network/virtual-networks-udr-overview.md). The UDR should be configured with a route for *0.0.0.0/0* with a destination of your NVA before deploying the Spring Cloud cluster. For more information, see the [Bring your own route table](how-to-deploy-in-azure-virtual-network.md#bring-your-own-route-table) section of [Deploy Azure Spring Cloud in a virtual network](how-to-deploy-in-azure-virtual-network.md).
* [Azure CLI](/cli/azure/install-azure-cli)

## Deployment

To deploy the cluster, follow these steps:

1. Sign in to Azure by using the following command:

   ```azurecli
   az login
   ```

   After you sign in, this command will output information about all the subscriptions you have access to. Take note of the name and ID of the subscription you want to use.

1. Set the target subscription.

   ```azurecli
   az account set --subscription "<your subscription name>"
   ```

1. Register the Azure Spring Cloud Resource Provider.

   ```azurecli
   az provider register --namespace 'Microsoft.AppPlatform'
   ```

1. Add the required extensions to Azure CLI.

   ```azurecli
   az extension add --name spring-cloud
   ```

1. Choose a deployment location from the regions where Azure Spring Cloud is available, as shown in [Products available by region](https://azure.microsoft.com/en-us/global-infrastructure/services/?products=spring-cloud&regions=all).

1. Use the following command to generate a list of Azure locations. Take note of the short **Name** value for the region you selected in the previous step.

   ```azurecli
   az account list-locations --output table
   ```

1. Create a resource group to deploy the resource to. 

   ```azurecli
   az group create --name <your-resource-group-name> --location <location-name>
   ```

1. Save the [deploySpringCloud.sh](https://raw.githubusercontent.com/Azure/azure-spring-cloud-reference-architecture/main/CLI/brownfield-deployment/deploySpringCloud.sh) Bash script locally, then execute it from the Bash prompt.

   ```azurecli
   ./deploySpringCloud.sh
   ```

1. Enter the following values when prompted by the script:

   - The Azure subscription ID that you saved earlier.

   - The Azure location name that you saved earlier.

   - The name of the resource group that you created earlier.

   - The name of the virtual network resource group where you'll deploy your resources.

   - The name of the spoke virtual network (for example, *vnet-spoke*).

   - The name of the subnet to be used by the Spring Cloud App Service (for example, *snet-app*).

   - The name of the subnet to be used by the Spring Cloud runtime service (for example, *snet-runtime*).

   - The name of the resource group for the Azure Log Analytics workspace to be used for storing diagnostic logs (for example, *la-cb5sqq6574o2a*).

   - The name of the Azure Log Analytics workspace.

   - The CIDR ranges from your virtual network to be used by Azure Spring Cloud (for example, *XX.X.X.X/16,XX.X.X.X/16,XX.X.X.X/16*).

   - The key/value pairs to be applied as tags on all resources that support tags. For more information, see [Use tags to organize your Azure resources and management hierarchy](/azure/azure-resource-manager/management/tag-resources). Use a space-separated list to apply multiple tags (for example, *environment=Dev BusinessUnit=finance*).

After you provide this information, the script will create and deploy the Azure resources.

## Review deployed resources

You can either use the Azure portal to check the deployed resources, or use Azure CLI or Azure PowerShell script to list the deployed resources.

## Clean up resources

If you plan to continue working with subsequent quickstarts and tutorials, you might want to leave these resources in place. When no longer needed, delete the resource group, which deletes the resources in the resource group. To delete the resource group by using Azure CLI, use the following commands:

```azurecli-interactive
echo "Enter the Resource Group name:" &&
read resourceGroupName &&
az group delete --name $resourceGroupName &&
echo "Press [ENTER] to continue ..."
```

## Next steps

In this quickstart, you deployed an Azure Spring Cloud instance into an existing virtual network using Azure CLI, and then validated the deployment. To learn more about Azure Spring Cloud, continue on to the resources below.

- Deploy one of the following sample applications from the locations below:
   - [Pet Clinic App with MySQL Integration](https://github.com/azure-samples/spring-petclinic-microservices) (Microservices with MySQL backend).
   - [Simple Hello World](spring-cloud-quickstart.md?tabs=Azure-CLI&pivots=programming-language-java).
- Use [custom domains](tutorial-custom-domain.md) with Azure Spring Cloud.
- Expose Azure Spring Cloud applications to the internet using [Azure Application Gateway](expose-apps-gateway-azure-firewall.md).
- View the secure end-to-end [Azure Spring Cloud reference architecture](reference-architecture.md), which is based on the [Microsoft Azure Well-Architected Framework](/azure/architecture/framework/).
