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

* Sign in to Azure using Azure command-line interface (Azure CLI) and run the following command to register the Azure Spring Cloud Resource Provider.

   ```azurecli-interactive
   az provider register --namespace 'Microsoft.AppPlatform'
   ```

* Run the following command to add the required extensions to Azure CLI.

   ```azurecli-interactive
   az extension add --name spring-cloud
   ```

* Run the following command and record the subscription ID of the Azure account you will be deploying to. This subscription ID will be used when you run deploySpringCloud.sh and prompted to enter the subscription.

   ```azurecli-interactive
   az account list
   ```

* Create a resource group to deploy the resource to.

   ```azurecli-interactive
   export RESOURCE_GROUP=my-resource-group
   export LOCATION=eastus

   az group create --name ${RESOURCE_GROUP} --location ${LOCATION}
   ```

## Deployment

To deploy the template, follow these steps:

1. Execute the [deploySpringCloud.sh](https://github.com/Azure/azure-spring-cloud-reference-architecture/blob/main/CLI/brownfield-deployment/deploySpringCloud.sh) Bash script. 

2. Enter Values for the following fields:

   - **Subscription ID** of the Azure account you will be deploying to

   - A valid **Azure Region** where resources will be deployed
       - Refer `https://azure.microsoft.com/global-infrastructure/services/?products=spring-cloud&regions=all` to find list of available regions for Azure Spring Cloud
       - **Note:** region format must be lower case with no spaces(for example, East US is represented as eastus)

   - Name of the **Resource Group** where resources will be deployed

   - Name of the **Virtual Network Resource Group** where resources will be deployed

   - Name of the Spoke **Virtual Network** name (for example, *vnet-spoke*)

   - Name of the **SubNet** to be used by Spring Cloud App Service (for example, *snet-app*)

   - Name of the **SubNet** to be used by Spring Cloud runtime Service (for example, *snet-runtime*)

   - Name of the **Azure Log Analytics workspace** to be used for storing diagnostic logs(for example, *la-cb5sqq6574o2a*)

   - **CIDR Ranges** from your Virtual Network to be used by Azure Spring Cloud (for example, *XX.X.X.X/16,XX.X.X.X/16,XX.X.X.X/16*)

   - key=value pairs to be applied as [Tags](/azure/azure-resource-manager/management/tag-resources) on all resources that support tags
       - Space separated list to support applying multiple tags
       - **Example:** environment=Dev BusinessUnit=finance

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
