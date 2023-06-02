---
title: Tutorial - Deploy a Spot container to Azure Container Instances via Azure portal
description: In this tutorial, you will deploy a spot  container to Azure Container Instances via Azure portal.
ms.topic: tutorial
ms.author: atsenthi
author: athinanthny
ms.service: container-instances
services: container-instances
ms.date: 05/11/2023

---

# Tutorial: Deploy a Spot container to Azure Container Instances via Azure portal (preview)

In this tutorial, you will use Azure portal to deploy a spot container to Azure Container Instances with a default quota. After deploying the container, you can browse to the running application. 


## Sign in to Azure 

Sign in to the Azure portal at https://portal.azure.com

If you don't have an Azure subscription, create a [free account][azure-free-account] before you begin.

## Create a Spot container on Azure Container Instances 

On the Azure portal homepage, select **Create a resource**.

:::image type="content" source="media/container-instances-quickstart-portal/quickstart-portal-create-resource.png" alt-text="Screenshot showing how to begin creating a new container instance in the Azure portal.":::

Select **Containers** > **Container Instances**.

:::image type="content" source="media/container-instances-quickstart-portal/qs-portal-01.png" alt-text="Screenshot showing how to select a new container instance that you want to create in the Azure portal.":::

On the **Basics** page, choose a subscription and enter the following values for **Resource group**, **Container name**, **Image source**, and **Container image**. Then to deploy ACI Spot container, opt for Spot discount by selecting **Run with Spot discount** field. This will enforce limitations for this feature in preview release automatically and allow you to deploy only in supported regions.

* Resource group: **Create new** > `acispotdemo`
* Container name: `acispotportaldemo`
* Region: One of `West Europe`/`East US2`/`West US`
* SKU: `Standard`
* Image source: **Quickstart images**
* Container image: `mcr.microsoft.com/azuredocs/aci-helloworld:v1` (Linux)

:::image type="content" source="media/container-instances-spot-containers-tutorials/spot-create-portal-ui-basic.png" alt-text="Screenshot of the priority selection of a container group, PNG.":::

> [!NOTE]
> When deploying Spot container on Azure Container Instances you need to select only regions supported in public preview. You can change the restart policy, region, type of container images and compute resources. If you want more than default quota offered, please file a support request.
>  Here is a sample ARM template that can be used to deploy with a spot containers. 
>  :::image type="content" source="media/container-instances-spot-containers-tutorials/spot-container-arm-template.png" alt-text="Screenshot of all the properties in the container group on a review page, PNG.":::
>  

Leave all other settings as their defaults, then select **Review + create**.

When the validation completes, you're shown a summary of the container's settings. Select **Create** to submit your container deployment request.

:::image type="content" source="media/container-instances-spot-containers-tutorials/spot-create-portal-ui-basic.png" alt-text="Screenshot of all the properties in the container group on a review page, PNG.":::

When deployment starts, a notification appears that indicates the deployment is in progress. Another notification is displayed when the container group has been deployed.

Open the overview for the container group by navigating to **Resource Groups** > **acispotdemo** > **acispotportaldemo**. Make a note of the **priority** property of the container instance and its **Status**.

1. On the **Overview** page, note the **Status** of the instance.

    ![Screenshot of overview page for Spot container group instance, PNG.](media/container-instances-spot-containers-tutorials/spot-containers-aci-portal-review.png)

2. Once its status is *Running*, navigate to the AZ CLI and run the below command to check you are able to listen to container on default port 80. 

:::image type="content" source="media/container-instances-spot-containers-tutorials/aci-spot-portal-demo-show-container-logs.png" alt-text="Screenshot of output from container logs post successful deployment to show helloworld container application running, PNG.":::

Congratulations! You have deployed a spot container on Azure Container Instances which is running sample hello world container application. 

## Clean up resources

When you're done with the container, select **Overview** for the *helloworld* container instance, then select **Delete**.

## Next steps

In this tutorial, you created a spot container on Azure Container instances with a default quota and eviction policy.


* [Azure Container Instances Azure Resource Manager template tutorial](./container-instances-tutorial-deploy-spot-container-arm.md)
* [ACI Spot containers overview](./container-instances-spot-overview.md) 

<!-- LINKS - External -->
[azure-free-account]: https://azure.microsoft.com/free/