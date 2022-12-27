---
title:  Create a Service Fabric managed cluster (SFMC) with Ephemeral OS disks for node types
description: Learn how to create a Service Fabric managed cluster (SFMC) with Ephemeral OS disks for node types
ms.topic: how-to
ms.date: 7/14/2022
---

# Introduction to Service Fabric managed cluster with Ephemeral OS disks for node types (Preview)
Azure Service Fabric managed clusters by default use managed OS disks for the nodes in a given node type. To be more cost efficient, managed clusters provide the ability to configure Ephemeral OS disks. Ephemeral OS disks are created on the local virtual machine (VM) storage and not saved to the remote Azure Storage. Ephemeral OS disks are free and replace the need to use managed OS disks.

The key benefits of ephemeral OS disks are: 

* Lower read/write latency, like a temporary disk along with faster node scaling and cluster upgrades.
* Supported by Marketplace, custom images, and by [Azure Compute Gallery](../virtual-machines/shared-image-galleries.md) (formerly known as Shared Image Gallery). 
* Ability to fast reset or reimage VMs and scale set instances to the original boot state. 
* Available in all Azure regions. 

Ephemeral OS disks work well where applications are tolerant of individual VM failures but are more affected by VM deployment time or reimaging of individual VM instances. They don't provide data backup / restore guarantee as managed OS disks do.

This article describes how to create a Service Fabric managed cluster node types specifically with Ephemeral OS disks using an Azure Resource Manager template (ARM template).

## Prerequisites
This guide builds upon the managed cluster quick start guide: [Deploy a Service Fabric managed cluster using Azure Resource Manager](./quickstart-managed-cluster-template.md)

Before you begin:

* If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free)
* Retrieve a managed cluster ARM template. Sample Resource Manager templates are available in the [Azure samples on GitHub](https://github.com/Azure-Samples/service-fabric-cluster-templates). These templates can be used as a starting point for your cluster template.
* Ephemeral OS disks are supported both for primary and secondary node type. This guide shows how to deploy a Standard SKU cluster with two node types - a primary and a secondary node type, which uses Ephemeral OS disk.
* Ephemeral OS disks aren't supported for every SKU. VM sizes such as DSv1, DSv2, DSv3, Esv3, Fs, FsV2, GS, M, Mdsv2, Bs, Dav4, Eav4 supports Ephemeral OS disks. Ensure the SKU with which you want to deploy supports Ephemeral OS disk. For more information on individual SKU, see [supported VM SKU](../virtual-machines/dv3-dsv3-series.md) and navigate to the desired SKU on left side pane.
* Ephemeral OS disks in Service Fabric are placed in the space for temporary disks for the VM SKU. Ensure the VM SKU you're using has more than 127 GiB of temporary disk space to place Ephemeral OS disk.

## Review the template
The template used in this guide is from [Azure Samples - Service Fabric cluster templates](https://github.com/Azure-Samples/service-fabric-cluster-templates/tree/master/SF-Managed-Standard-SKU-2-NT-Ephemeral).


## Create a client certificate
Service Fabric managed clusters use a client certificate as a key for access control. If you already have a client certificate that you would like to use for access control to your cluster, you can skip this step. 

If you need to create a new client certificate, follow the steps in [set and retrieve a certificate from Azure Key Vault](../key-vault/certificates/quick-create-portal.md). Note the certificate thumbprint as it will be required to deploy the template in the next step.

## Deploy the template

1. Pick the template from [Service Fabric cluster sample template for Ephemeral OS disk](https://github.com/Azure-Samples/service-fabric-cluster-templates/tree/master/SF-Managed-Standard-SKU-2-NT-Ephemeral), which includes specification for Ephemeral OS disks support.

2. Provide your own values for the following template parameters:

   * Subscription: Select an Azure subscription.
   * Resource Group: Select Create new. Enter a unique name for the resource group, such as myResourceGroup, then choose OK.
   * Location: Select a location.
   * Cluster Name: Enter a unique name for your cluster, such as mysfcluster.
   * Admin Username: Enter a name for the admin to be used for RDP on the underlying VMs in the cluster.
   * Admin Password: Enter a password for the admin to be used for RDP on the underlying VMs in the cluster.
   * Client Certificate Thumbprint: Provide the thumbprint of the client certificate that you would like to use to access your cluster. If you don't have a certificate, follow [set and retrieve a certificate](../key-vault/certificates/quick-create-portal.md) to create a self-signed certificate.
   * Node Type Name: Enter a unique name for your node type, such as nt1.


3. Deploy an ARM template through one of the methods below:

   * ARM portal custom template experience: [Custom deployment - Microsoft Azure](https://portal.azure.com/#create/Microsoft.Template). Select the following image to sign in to Azure, and provide your own values for the template parameters, then deploy the template.

      [![Deploy to Azure](../media/template-deployments/deploy-to-azure.svg)](https://portal.azure.com/#create/Microsoft.Template/uri/https%3A%2F%2Fraw.githubusercontent.com%2FAzure-Samples%2Fservice-fabric-cluster-templates%2Fmaster%2FSF-Managed-Standard-SKU-2-NT-Ephemeral%2Fazuredeploy.json)


   * ARM PowerShell cmdlets: [New-AzResourceGroupDeployment (Az.Resources)](/powershell/module/az.resources/new-azresourcegroupdeployment). Store the paths of your ARM template and parameter files in variables, then deploy the template.
    
      ```powershell
      $templateFilePath = "<full path to azuredeploy.json>"
      $parameterFilePath = "<full path to azuredeploy.parameters.json>"

      New-AzResourceGroupDeployment ` 
        -Name $DeploymentName ` 
        -ResourceGroupName $resourceGroupName ` 
        -TemplateFile $templateFilePath ` 
        -TemplateParameterFile $parameterFilePath `
        -Debug -Verbose
      ```
    Wait for the deployment to be completed successfully.

4. To configure a node type to use Ephemeral OS disks through your own template:
   * Use Service Fabric API version 2022-06-01-preview and above
   * Edit the template, azuredeploy.json, and add the following properties under the node type section:
       ```JSON
      "properties": { 
      "useEphemeralOSDisk": true 
      }
      ```
   Sample template is available that includes these specifications: [Azure-Sample - Service Fabric cluster template](https://github.com/Azure-Samples/service-fabric-cluster-templates/tree/master/SF-Managed-Standard-SKU-2-NT-Ephemeral).


## Migrate to using Ephemeral OS disks for Service Fabric managed cluster node types
A node type can only be configured to use Ephemeral OS disk at the time of creation. Existing node types can't be converted to use Ephemeral OS disks. For all migration scenarios, add a new node type with Ephemeral OS disk to the cluster and migrate your services to that node type. 

1. Add a new node type that's configured to use Ephemeral OS disk as specified earlier.
2. Migrate any required workloads to the new node type.
3. Disable and remove the old node type from the cluster.

## Next steps
> [!div class="nextstepaction"]
> [Read about Service Fabric managed cluster configuration options](how-to-managed-cluster-configuration.md)