---
title: Quickstart - Provision Azure Spring Cloud using Azure CLI
description: This quickstart shows you how to deploy a Spring Cloud cluster into an existing virtual network.
services: azure-cli
author: vramasubbu
ms.service: spring-cloud
ms.topic: quickstart
ms.custom: devx-track-azurecli, devx-track-java
ms.author: vramasubbu
ms.date: 06/03/2021
---

# Quickstart: Provision Azure Spring Cloud using Azure CLI into an existing Virtual Network

This quickstart describes how to use Azure CLI to deploy an Azure Spring Cloud cluster into an existing virtual network.

Azure Spring Cloud makes it easy to deploy Spring Boot microservice applications to Azure without any code changes. The service manages the infrastructure of Spring Cloud applications so developers can focus on their code. Azure Spring Cloud provides lifecycle management using comprehensive monitoring and diagnostics, configuration management, service discovery, CI/CD integration, blue-green deployments, and more.

[!INCLUDE [Azure CLI](https://docs.microsoft.com/en-us/cli/azure/)]

## Prerequisites

* An Azure subscription. If you don't have a subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.
* Two dedicated subnets for the Azure Spring Cloud Cluster. One for the service runtime and another for the Spring Boot micro-service applications. see [here](https://docs.microsoft.com/en-us/azure/spring-cloud/how-to-deploy-in-azure-virtual-network#virtual-network-requirements) for subnet and virtual network requirements.
* An existing Log Analytics workspace for Azure Spring Cloud [diagnostics settings](https://docs.microsoft.com/en-us/azure/spring-cloud/diagnostic-services) as well as a workspace-based [Application Insights](https://docs.microsoft.com/en-us/azure/spring-cloud/how-to-distributed-tracing) resource.
* You must plan the 3 internal CIDR ranges (at least /16 each) used for the Azure Spring Cloud cluster. These will not be directly routable and will be used only internally by the Azure Spring Cloud Cluster. Clusters may not use 169.254.0.0/16, 172.30.0.0/16, 172.31.0.0/16, or 192.0.2.0/24 for the internal Spring Cloud CIDR ranges, or any ranges included within the cluster virtual network address range.
* Grant service permission to the virtual network. The Azure Spring Cloud Resource Provider requires Owner permission to your virtual network in order to grant a dedicated and dynamic service principal on the virtual network for further deployment and maintenance. See [here](https://docs.microsoft.com/en-us/azure/spring-cloud/how-to-deploy-in-azure-virtual-network#grant-service-permission-to-the-virtual-network) for instructions and more information.
* If using Azure Firewall or an NVA you will need the following:
    * Network and FQDN rules. see [requirements](https://docs.microsoft.com/en-us/azure/spring-cloud/how-to-deploy-in-azure-virtual-network#virtual-network-requirements).
    * A unique UDR ([User Defined Route](https://docs.microsoft.com/en-us/azure/virtual-network/virtual-networks-udr-overview)) applied to each of the service runtime and Spring Boot micro-service application subnets. The UDR should be configured with a route for **0.0.0.0/0** with a destination of your NVA. See [here](https://docs.microsoft.com/en-us/azure/spring-cloud/how-to-deploy-in-azure-virtual-network#bring-your-own-route-table) for more information.
* [Install Azure CLI](https://docs.microsoft.com/en-us/cli/azure/install-azure-cli)
* Login into Azure using Azure command-line interface (Azure CLI) and run the following command to register the Azure Spring Cloud Resource Provider.
  # [CLI](#tab/azure-cli)
  ```azurecli-interactive
  az provider register --namespace 'Microsoft.AppPlatform'
  ```
* Run the following command to add the required extensions to Azure CLI.
  # [CLI](#tab/azure-cli)

  ```azurecli-interactive
  az extension add --name spring-cloud
  ```
* Run the following command and record the subscription id of the Azure account you will be deploying to. This subscription id will be used when you run deploySpringCloud.sh and prompted to enter the subscrition.
  # [CLI](#tab/azure-cli)

  ```azurecli-interactive
  az account list
  ```
* Create a resource group to deploy the resource to.
  # [CLI](#tab/azure-cli)

  ```azurecli-interactive
  export RESOURCE_GROUP=my-resource-group
  export LOCATION=eastus

  az group create --name ${RESOURCE_GROUP} --location ${LOCATION}
  ```
---

## Deployment

To deploy the template, follow these steps:

1. Execute the [deploySpringCloud.sh](https://github.com/Azure/azure-spring-cloud-reference-architecture/blob/main/CLI/brownfield-deployment/deploySpringCloud.sh) Bash script. 

2. Enter Values for the following fields:

   - **Subscrition ID** of the Azure account you will be deploying to

   - A valid **Azure Region** where resources will be deployed
       - Refer `https://azure.microsoft.com/global-infrastructure/services/?products=spring-cloud&regions=all` to find list of available regions for Azure Spring Cloud
       - **Note:** region format must be lower case with no spaces(for example, East US is represented as eastus)

   - Name of the **Resource Group** where resources will be deployed

   - Name of the **Virtual Network Resource Group** where resources will be deployed

   - Name of the Spoke **Virtual Network** name(e.g. vnet-spoke)

   - Name of the **SubNet** to be used by Spring Cloud App Service (e.g snet-app) 

   - Name of the **SubNet** to be used by Spring Cloud runtime Service (e.g snet-runtime) 

   - Name of the **Azure Log Analytics workspace** to be used for storing diagnostic logs(for example, la-cb5sqq6574o2a)

   - **CIDR Ranges** from your Virtual Network to be used by Azure Spring Cloud(for example, XX.X.X.X/16,XX.X.X.X/16,XX.X.X.X/16)

   - key=value pairs to be applied as [Tags](https://docs.microsoft.com/en-us/azure/azure-resource-manager/management/tag-resources) on all resources which support tags
       - Space separated list to support applying multiple tags
       - **Example:** environment=Dev BusinessUnit=finance

## Review deployed resources

You can either use the Azure portal to check the deployed resources, or use Azure CLI or Azure PowerShell script to list the deployed resources.

## Clean up resources

If you plan to continue working with subsequent quickstarts and tutorials, you might want to leave these resources in place. When no longer needed, delete the resource group, which deletes the resources in the resource group. To delete the resource group by using Azure CLI or Azure PowerShell, use the following commands:

# [CLI](#tab/azure-cli)

```azurecli-interactive
echo "Enter the Resource Group name:" &&
read resourceGroupName &&
az group delete --name $resourceGroupName &&
echo "Press [ENTER] to continue ..."
```
---

## Next steps

In this quickstart, you deployed an Azure Spring Cloud instance into an existing virtual network using Azure CLI, and then validated the deployment. To learn more about Azure Spring Cloud , continue on to the resources below.

- Deploy one of the following sample applications from the locations below:
   * [Pet Clinic App with MySQL Integration](https://github.com/azure-samples/spring-petclinic-microservices) (Microservices with MySQL backend).
   * [Simple Hello World](spring-cloud-quickstart.md?tabs=Azure-CLI&pivots=programming-language-java).
- Use [custom domains](tutorial-custom-domain.md) with Azure Spring Cloud.
- Expose Azure Spring Cloud applications to the internet using [Azure Application Gateway](expose-apps-gateway-azure-firewall.md).
- View the secure end-to-end [Azure Spring Cloud reference architecture](reference-architecture.md), which is based on the [Microsoft Azure Well-Architected Framework](/azure/architecture/framework/).
- Learn more about [Azure Resource Manager](../azure-resource-manager/management/overview.md).
