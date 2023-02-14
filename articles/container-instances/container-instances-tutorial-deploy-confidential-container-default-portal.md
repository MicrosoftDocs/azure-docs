---
title: Tutorial - Deploy a confidential container to Azure Container Instances via Azure portal
description: In this tutorial, you will deploy a confidential container with a default policy to Azure Container Instances via Azure portal.
ms.topic: tutorial
ms.author: tomcassidy
author: tomvcassidy
ms.service: container-instances
services: container-instances
ms.date: 02/28/2023
ms.custom: seodec18, mvc, devx-track-js
---

# Tutorial: Deploy a Confidential container to Azure Container Instances via Azure portal (preview)

In this tutorial, you will use Azure portal to deploy a Confidential container to Azure Container Instances with a default confidential computing enforcement policy. After deploying the container, you can browse to the running application. 

:::image type="content" source="media/container-instances-cc-tutorials/cc-aci-hello-world.png" alt-text="Screenshot showing a hello-world application deployed via Azure portal.":::

## Sign in to Azure 

Sign in to the Azure portal at https://portal.azure.com

If you don't have an Azure subscription, create a [free account][azure-free-account] before you begin.

## Create a Confidential container on Azure Container Instances 

On the Azure portal homepage, select **Create a resource**.

:::image type="content" source="media/container-instances-quickstart-portal/quickstart-portal-create-resource.png" alt-text="Screenshot showing how to begin creating a new container instance in the Azure portal.":::

Select **Containers** > **Container Instances**.

:::image type="content" source="media/container-instances-quickstart-portal/qs-portal-01.png" alt-text="Screenshot showing how to select a new container instance that you want to create in the Azure portal.":::

On the **Basics** page, choose a subscription and enter the following values for **Resource group**, **Container name**, **Image source**, and **Container image**.

On the **Basics** page, choose a subscription and enter the following values for **Resource group**, **Container name**, **Image source**, and **Container image**.

* Resource group: **Create new** > `myresourcegroup`
* Container name: `myconfidentialcontainer`
* Region: One of `West Europe`/`North Europe`/`East US`
* SKU: `Confidential (default policy)`
* Image source: **Quickstart images**
* Container image: `mcr.microsoft.com/azuredocs/aci-cc-helloworld:latest` (Linux)

:::image type="content" source="media/container-instances-cc-tutorials/cc-aci-portal-select-sku.png" alt-text="Screenshot showing the SKU selection of a container group.":::

> [!NOTE]
> When deploying confidential containers on Azure Container Instances you will only be able to deploy with a default confidential computing enforcement policy. This policy will only attest the hardware that the container group is running on and not the software components. If you want to attest software components you will need to deploy with a custom confidential computing enforcement policy via an Azure Resource Manager template. See [tutorial](./container-instances-tutorial-deploy-confidential-containers-cce-arm.md) for more details.

Leave all other settings as their defaults, then select **Review + create**.

When the validation completes, you're shown a summary of the container's settings. Select **Create** to submit your container deployment request.

:::image type="content" source="media/container-instances-cc-tutorials/cc-aci-portal-review.png" alt-text="Screenshot showing all of the properties in the container group on a review page.":::

When deployment starts, a notification appears that indicates the deployment is in progress. Another notification is displayed when the container group has been deployed.

Open the overview for the container group by navigating to **Resource Groups** > **myresourcegroup** > **myconfidentialcontainer**. Make a note of the **IP** of the container instance and its **Status**.

**TO DO** - ADD PICTURE OF IP ADDRESS.

Once its **Status** is *Running*, navigate to the containers IP address on port 8080 in your browser. 
*Example*: 00.000.000.00:8080

:::image type="content" source="media/container-instances-cc-tutorials/cc-aci-hello-world.png" alt-text="Screenshot showing the hello world application running.":::

Congratulations! You have deployed a confidential container on Azure Container Instances which is displaying a hardware attestation report in your browser. 

## View the confidential computing enforcement policy 

**TO DO** - ADD PICTURE OF PROPERTIES TAB WITH CCE POLICY.

## Clean up resources

When you're done with the container, select **Overview** for the *myconfidentialcontainer* container instance, then select **Delete**.

**TO DO** - ADD PICTURE OF DELETION.

Select **Yes** when the confirmation dialog appears.

**TO DO** - ADD PICTURE OF DELETION CONFIRMATION.

## Next steps

In this tutorial, you created a Confidential container on Azure container instances with a default confidential computing enforcement policy. If you would like to deploy a confidential container group with a custom computing enforcement policy continue to the Confidential containers on Azure Container Instances Azure Resource Manager template tutorial. 

> [!div class="nextstepaction"]
> [Azure Container Instances Azure Resource Manager template tutorial](./container-instances-tutorial-deploy-confidential-containers-cce-arm.md)

<!-- LINKS - External -->
[azure-free-account]: https://azure.microsoft.com/free/