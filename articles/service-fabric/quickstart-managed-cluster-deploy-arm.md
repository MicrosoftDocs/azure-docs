---
title: 'Quickstart: Deploy a Managed Service Fabric cluster by using an Azure Resource Manager template (Preview)'
description: In this quickstart, you will learn how to create a Managed Service Fabric cluster using an Azure Resource Manager template.
ms.topic: quickstart
ms.date: 09/01/2020
ms.custom: "armqs, references_regions"
---

# Quickstart: Deploy a Managed Service Fabric cluster using an Azure Resource Manager template

Service Fabric Managed clusters are an evolution of the Azure Service Fabric cluster resource model that streamlines your deployment and cluster management experience. Service Fabric managed clusters are a fully encapsulated resource that enable you to deploy a single Service Fabric cluster resource rather than having to deploy all of the underlying resources that make up a Service Fabric cluster. This article describes how to do deploy a Managed Service Fabric test cluster in Azure using an Azure Resource Manager template (ARM template).

The three-node Basic SKU cluster deployed in this tutorial is only intended to be used for instructional purposes (rather than production workloads). For more information about Managed Service Fabric cluster SKUs please see [PLACEHOLDER](https://docs.microsoft.com/azure/key-vault/certificates/quick-create-portal#:~:text=%20Quickstart%3A%20Set%20and%20retrieve%20a%20certificate%20from,vault%2C%20you%20just%20need%20to%20take...%20More%20).

## Prerequisites

Before you begin this quickstart:
* If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F)

<!-- Section to be completed when templates are merged into the quickstart repo. -->
## Review the template 

The template used in this quickstart is from [Azure Quickstart Templates - PLACEHOLDER](https://docs.microsoft.com/azure/key-vault/certificates/quick-create-portal#:~:text=%20Quickstart%3A%20Set%20and%20retrieve%20a%20certificate%20from,vault%2C%20you%20just%20need%20to%20take...%20More%20).

<!-- To be updated when samples are added 

:::code language="json" source="~peterpogorski/quickstart-templates/101-managed-service-fabric-cluster-basic/azuredeploy.json" range="1-112" :::
-->

## Create a client certificate (optional)

Service Fabric managed clusters use a client certificate as a key for access control. If you already have a client certificate that you would like to use for access control to your cluster, you can skip this step. 

If you need to create a new client certificate, please follow the steps in [set and retrieve a certificate from Azure Key Vault](https://docs.microsoft.com/azure/key-vault/certificates/quick-create-portal#:~:text=%20Quickstart%3A%20Set%20and%20retrieve%20a%20certificate%20from,vault%2C%20you%20just%20need%20to%20take...%20More%20).

Take note of the certificate thumbprint as this will be required to deploy the template in the next step.

## Deploy the template

> [!Note]
> Supported regions for the public preview include centraluseuap, eastus2euap, eastasia, northeurope, westcentralus, and eastus2.

<!-- Link to be updated when template is merged into the quickstart repo -->
1. Select the following image to sign in to Azure and open a template. 

[![Deploy to Azure](../media/template-deployments/deploy-to-azure.svg)](https://portal.azure.com/#create/Microsoft.Template/uri/https%3A%2F%2Fraw.githubusercontent.com%2Fpeterpogorski%2Fazure-quickstart-templates%2Fmanaged-sfrp-sample-templates%2F101-managed-service-fabric-cluster-standard-1-nt%2Fazuredeploy.json)

2. Select or enter the following values

For this quickstart, provide your own values for the following template parameters: 
* **Subscription**: Select an Azure subscription.
* **Resource Group**: Select **Create new**. Enter a unique name for the resource group, such as *myResourceGroup*, then choose **OK**.
* **Location**: Select a location, such as **East US**.
* **Cluster Name**: Enter a unique name for your cluster, such as *mySFCluster*.
* **Admin Username**: Enter a name for the admin to be used for RDP on the underlying VMs in the cluster.
* **Admin Password**: Enter a password for the admin to be used for RDP on the underlying VMs in the cluster.
* **Client Certificate Thumbprint**: Provide the thumbprint of the client certificate that you would like to use to access your cluster. If you do not have a certificate, follow [set and retrieve a certificate](https://docs.microsoft.com/azure/key-vault/certificates/quick-create-portal) to create a self-signed certificate. 
* **Node Type Name**: Enter a unique name for your node type, such as *myNodeType*.
* **I agree to the terms and conditions stated above**: Check this box to agree. 

3. Select **Purchase**.

4. It takes a few minutes for your managed Service Fabric cluster to deploy. Wait for the deployment to complete successfully before moving onto the next steps. 

## Validate the deployment 

### Review deployed resources 

Once the deployment completes, find the Service Fabric Explorer value in the output and open the address in a web browser to view your cluster in Service Fabric Explorer. When prompted for a certificate, use the certificate for which the client thumbprint was provided in the template. 

> [!NOTE]
> You can find the output of the deployment in Azure Portal under the resource group deployments tab.

## Clean up resources

When no longer needed, delete the resource group, which deletes the resources in the resource group.

```powershell
$resourceGroupName = Read-Host -Prompt "Enter the Resource Group name"
Remove-AzResourceGroup -Name $resourceGroupName
```

## Next steps

In this quickstart, you deployed a managed Service Fabric cluster.

> [!div class="nextstepaction"]
> [Learn how to add and remove node types](./tutorial-managed-cluster-add-remove-node-type.md)
 
<!-- LINKS - internal -->
