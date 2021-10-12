---
title: Quickstart - Provision Azure Spring Cloud using Bicep
description: This quickstart shows you how to use Bicep to deploy a Spring Cloud cluster into an existing virtual network.
author: karlerickson
ms.service: spring-cloud
ms.topic: quickstart
ms.custom: devx-track-java
ms.author: ssarwa
ms.date: 08/06/2021
---

# Quickstart: Provision Azure Spring Cloud using Bicep

This quickstart describes how to use a Bicep template to deploy an Azure Spring Cloud cluster into an existing virtual network.

Azure Spring Cloud makes it easy to deploy Spring Boot microservice applications to Azure without any code changes. The service manages the infrastructure of Spring Cloud applications so developers can focus on their code. Azure Spring Cloud provides lifecycle management using comprehensive monitoring and diagnostics, configuration management, service discovery, CI/CD integration, blue-green deployments, and more.

## Prerequisites

* An Azure subscription. If you don't have a subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.
* Two dedicated subnets for the Azure Spring Cloud cluster, one for the service runtime and another for the Spring Boot micro-service applications. For subnet and virtual network requirements, see the [Virtual network requirements](how-to-deploy-in-azure-virtual-network.md#virtual-network-requirements) section of [Deploy Azure Spring Cloud in a virtual network](how-to-deploy-in-azure-virtual-network.md).
* An existing Log Analytics workspace for Azure Spring Cloud diagnostics settings. For more information, see [Analyze logs and metrics with diagnostics settings](diagnostic-services.md).
* Three internal Classless Inter-Domain Routing (CIDR) ranges (at least */16* each) that you've identified for use by the Azure Spring Cloud cluster. These CIDR ranges will not be directly routable and will be used only internally by the Azure Spring Cloud cluster. Clusters may not use *169.254.0.0/16*, *172.30.0.0/16*, *172.31.0.0/16*, or *192.0.2.0/24* for the internal Spring Cloud CIDR ranges, or any IP ranges included within the cluster virtual network address range.
* Service permission granted to the virtual network. The Azure Spring Cloud Resource Provider requires Owner permission to your virtual network in order to grant a dedicated and dynamic service principal on the virtual network for further deployment and maintenance. For instructions and more information, see the [Grant service permission to the virtual network](how-to-deploy-in-azure-virtual-network.md#grant-service-permission-to-the-virtual-network) section of [Deploy Azure Spring Cloud in a virtual network](how-to-deploy-in-azure-virtual-network.md).
* If you're using Azure Firewall or a Network Virtual Appliance (NVA), you'll also need to satisfy the following prerequisites:
   * Network and fully qualified domain name (FQDN) rules. For more information, see [Virtual network requirements](how-to-deploy-in-azure-virtual-network.md#virtual-network-requirements).
   * A unique User Defined Route (UDR) applied to each of the service runtime and Spring Boot micro-service application subnets. For more information about UDRs, see [Virtual network traffic routing](../virtual-network/virtual-networks-udr-overview.md). The UDR should be configured with a route for *0.0.0.0/0* with a destination of your NVA before deploying the Spring Cloud cluster. For more information, see the [Bring your own route table](how-to-deploy-in-azure-virtual-network.md#bring-your-own-route-table) section of [Deploy Azure Spring Cloud in a virtual network](how-to-deploy-in-azure-virtual-network.md).
* [Azure CLI](/cli/azure/install-azure-cli)

## Deploy using Bicep

To deploy the cluster, follow these steps:

1. Create an *azuredeploy.bicep* file with the following contents:

   ```Bicep
   @description('The instance name of the Azure Spring Cloud resource')
   param springCloudInstanceName string

   @description('The name of the Application Insights instance for Azure Spring Cloud')
   param appInsightsName string

   @description('The resource ID of the existing Log Analytics workspace. This will be used for both diagnostics logs and Application    Insights')
   param laWorkspaceResourceId string

   @description('The resourceID of the Azure Spring Cloud App Subnet')
   param springCloudAppSubnetID string

   @description('The resourceID of the Azure Spring Cloud Runtime Subnet')
   param springCloudRuntimeSubnetID string

   @description('Comma-separated list of IP address ranges in CIDR format. The IP ranges are reserved to host underlying Azure Spring Cloud    infrastructure, which should be 3 at least /16 unused IP ranges, must not overlap with any Subnet IP ranges')
   param springCloudServiceCidrs string = '10.0.0.0/16,10.2.0.0/16,10.3.0.1/16'

   @description('The tags that will be associated to the Resources')
   param tags object = {
     environment: 'lab'
   }

   var springCloudSkuName = 'S0'
   var springCloudSkuTier = 'Standard'
   var location = resourceGroup().location

   resource appInsights 'Microsoft.Insights/components@2020-02-02-preview' = {
     name: appInsightsName
     location: location
     kind: 'web'
     tags: tags
     properties: {
       Application_Type: 'web'
       Flow_Type: 'Bluefield'
       Request_Source: 'rest'
       WorkspaceResourceId: laWorkspaceResourceId
     }
   }

   resource springCloudInstance 'Microsoft.AppPlatform/Spring@2020-07-01' = {
     name: springCloudInstanceName
     location: location
     tags: tags
     sku: {
       name: springCloudSkuName
       tier: springCloudSkuTier
     }
     properties: {
       networkProfile: {
         serviceCidr: springCloudServiceCidrs
         serviceRuntimeSubnetId: springCloudRuntimeSubnetID
         appSubnetId: springCloudAppSubnetID
       }
     }
   }

   resource springCloudMonitoringSettings 'Microsoft.AppPlatform/Spring/monitoringSettings@2020-07-01' = {
     name: '${springCloudInstance.name}/default'
     properties: {
       traceEnabled: true
       appInsightsInstrumentationKey: appInsights.properties.InstrumentationKey
     }
   }

   resource springCloudDiagnostics 'microsoft.insights/diagnosticSettings@2017-05-01-preview' = {
     name: 'monitoring'
     scope: springCloudInstance
     properties: {
       workspaceId: laWorkspaceResourceId
       logs: [
         {
           category: 'ApplicationConsole'
           enabled: true
           retentionPolicy: {
             days: 30
             enabled: false
           }
         }
       ]
     }
   }
   ```

1. Open a Bash window and run the following Azure CLI command, replacing the *\<value>* placeholders with the following values:

   - **resource-group:** The resource group name for deploying the Spring Cloud instance.
   - **springCloudInstanceName:** The name of the Azure Spring Cloud resource.
   - **appInsightsName:** The name of the Application Insights instance for Azure Spring Cloud.
   - **laWorkspaceResourceId:** The resource ID of the existing Log Analytics workspace (for example, */   subscriptions/\<your subscription>/resourcegroups/\<your log analytics resource group>/providers/   Microsoft.OperationalInsights/workspaces/\<your log analytics workspace name>*.)
   - **springCloudAppSubnetID:** The resourceID of the Azure Spring Cloud App Subnet.
   - **springCloudRuntimeSubnetID:** The resourceID of the Azure Spring Cloud Runtime Subnet.
   - **springCloudServiceCidrs:** A comma-separated list of IP address ranges (3 in total) in CIDR format. The IP ranges are reserved to host underlying Azure Spring Cloud infrastructure. These 3 ranges should be at least */16* unused IP ranges, and must not overlap with any routable subnet IP ranges used within the network.

   ```azurecli
   az deployment group create \
       --resource-group <value> \
       --name initial \
       --template-file azuredeploy.bicep \
       --parameters \
           springCloudInstanceName=<value> \
           appInsightsName=<value> \
           laWorkspaceResourceId=<value> \
           springCloudAppSubnetID=<value> \
           springCloudRuntimeSubnetID=<value> \
           springCloudServiceCidrs=<value>
   ```

   This command uses the Bicep template to create an Azure Spring Cloud instance in an existing virtual network. The command also creates a workspace-based Application Insights instance in an existing Azure Monitor Log Analytics Workspace.

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

In this quickstart, you deployed an Azure Spring Cloud instance into an existing virtual network using Bicep, and then validated the deployment. To learn more about Azure Spring Cloud, continue on to the resources below.

- Deploy one of the following sample applications from the locations below:
   - [Pet Clinic App with MySQL Integration](https://github.com/azure-samples/spring-petclinic-microservices) (Microservices with MySQL backend).
   - [Simple Hello World](./quickstart.md?pivots=programming-language-java&tabs=Azure-CLI).
- Use [custom domains](tutorial-custom-domain.md) with Azure Spring Cloud.
- Expose Azure Spring Cloud applications to the internet using [Azure Application Gateway](expose-apps-gateway-azure-firewall.md).
- View the secure end-to-end [Azure Spring Cloud reference architecture](reference-architecture.md), which is based on the [Microsoft Azure Well-Architected Framework](/azure/architecture/framework/).
