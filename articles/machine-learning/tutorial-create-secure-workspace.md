---
title: Create a secure workspace with a managed virtual network
titleSuffix: Azure Machine Learning
description: Create an Azure Machine Learning workspace and required Azure services inside a managed virtual network.
services: machine-learning
ms.service: machine-learning
ms.subservice: enterprise-readiness
ms.reviewer: larryfr
ms.author: jhirono
author: jhirono
ms.date: 08/11/2023
ms.topic: how-to
monikerRange: 'azureml-api-2 || azureml-api-1'
---
# Tutorial: How to create a secure workspace with a managed virtual network

In this article, learn how to create and connect to a secure Azure Machine Learning workspace. The steps in this article use an Azure Machine Learning managed virtual network to create a security boundary around resources used by Azure Machine Learning.

In this tutorial, you accomplish the following tasks:

> [!div class="checklist"]
> * Create an Azure Machine Learning workspace configured to use a managed virtual network.
> * Create an Azure Machine Learning compute cluster. A compute cluster is used when __training machine learning models in the cloud__.

After completing this tutorial, you'll have the following architecture:

* An Azure Machine Learning workspace that uses a private endpoint to communicate using the managed network.
* An Azure Storage Account that uses private endpoints to allow storage services such as blob and file to communicate using the managed network.
* An Azure Container Registry that uses a private endpoint communicate using the managed network.
* An Azure Key Vault that uses a private endpoint to communicate using the managed network.
* An Azure Machine Learning compute instance and compute cluster secured by the managed network.

## Prerequisites

* An Azure subscription. If you don't have an Azure subscription, create a free account before you begin. Try the [free or paid version of Azure Machine Learning](https://azure.microsoft.com/free/).

## Create a workspace

1. In the [Azure portal](https://portal.azure.com), select the portal menu in the upper left corner. From the menu, select __+ Create a resource__ and then enter __Azure Machine Learning__. Select the __Azure Machine Learning__ entry, and then select __Create__.

1. From the __Basics__ tab, select the __subscription__, __resource group__, and __Region__ to create the service in. If you don't have an existing resource group, select __Create new__ to create one. Enter a unique name for the __Workspace name__. Leave the rest of the fields at the default values; new instances of the required services are created for the workspace.

    :::image type="content" source="./media/tutorial-create-secure-workspace/create-workspace.png" alt-text="Screenshot of the workspace creation form.":::

1. From the __Networking__ tab, select __Private with Internet Outbound__.

    :::image type="content" source="./media/tutorial-create-secure-workspace/private-internet-outbound.png" alt-text="Screenshot of the workspace network tab with internet outbound selected.":::

1. Select __Review + create__. Verify that the information is correct, and then select __Create__.

    :::image type="content" source="./media/tutorial-create-secure-workspace/review-create-machine-learning.png" alt-text="Screenshot of the review page for workspace creation.":::

1. Once the workspace has been created, select __Go to resource__.

## Create the managed virtual network

At this point, the workspace has been created __but the managed virtual network has not__. The managed virtual network is _configured_ when you create the workspace, but it isn't created until you create the first compute resource or manually provision it.

Since the managed virtual network hasn't been created yet, you can still connect to the workspace using the public internet. Use the following steps to connect to the Azure Machine Learning studio and create a compute instance:

1. In the Azure portal, select your workspace. From the __Overview__ page for your workspace, select __Launch studio__. 

    > [!TIP]
    > You can also go to the [Azure Machine Learning studio](https://ml.azure.com) and select your workspace from the list.

    :::image type="content" source="./media/tutorial-create-secure-workspace/launch-studio.png" alt-text="Screenshot of the studio button in the Azure portal.":::

1. From studio, select __Compute__, __Compute instances__, and then __+ New__.

    :::image type="content" source="./media/tutorial-create-secure-workspace/create-new-compute-instance.png" alt-text="Screenshot of the new compute option in studio.":::
    
1. From the __Configure required settings__ dialog, enter a unique value as the __Compute name__. Leave the rest of the selections at the default value.

1. Select __Create__. The compute instance takes a few minutes to create. The compute instance is created within the managed network.

    > [!TIP]
    > It may take several minutes to create the first compute resource. This delay occurs because the managed virtual network is also being created. The managed virtual network isn't created until the first compute resource is created. Subsequent managed compute resources will be created much faster.

1. After the compute instance has been created, close the studio tab in your browser. From the __Overview__ page for your workspace, select __Launch studio__ again. You should receive an "Error loading workspace" message now, as the managed virtual network has been created.

## Connect to the secured workspace

There are several ways that you can connect to the secured workspace. In this tutorial, a __jump box__ is used. A jump box is a virtual machine in an Azure Virtual Network. You can connect to it using your web browser and Azure Bastion. 

The following table lists several other ways that you might connect to the secure workspace:

| Method | Description |
| ----- | ----- |
| [Azure VPN gateway](../vpn-gateway/vpn-gateway-about-vpngateways.md) | Connects on-premises networks to an Azure Virtual Network over a private connection. A private endpoint for your workspace is created within that virtual network. Connection is made over the public internet. |
| [ExpressRoute](https://azure.microsoft.com/services/expressroute/) | Connects on-premises networks into the cloud over a private connection. Connection is made using a connectivity provider. |

> [!IMPORTANT]
> When using a __VPN gateway__ or __ExpressRoute__, you will need to plan how name resolution works between your on-premises resources and those in the cloud. For more information, see [Use a custom DNS server](how-to-custom-dns.md).

### Create a jump box (VM)

Use the following steps to create an Azure Virtual Machine to use as a jump box. Azure Bastion enables you to connect to the VM desktop through your browser. From the VM desktop, you can then use the browser on the VM to connect to resources inside the managed virtual network, such as Azure Machine Learning studio. Or you can install development tools on the VM. 

> [!TIP]
> The steps below create a Windows 11 enterprise VM. Depending on your requirements, you may want to select a different VM image. The Windows 11 (or 10) enterprise image is useful if you need to join the VM to your organization's domain.

1. In the [Azure portal](https://portal.azure.com), select the portal menu in the upper left corner. From the menu, select __+ Create a resource__ and then enter __Virtual Machine__. Select the __Virtual Machine__ entry, and then select __Create__.

1. From the __Basics__ tab, select the __subscription__, __resource group__, and __Region__ you previously used for the virtual network. Provide values for the following fields:

    * __Virtual machine name__: A unique name for the VM.
    * __Username__: The username you'll use to log in to the VM.
    * __Password__: The password for the username.
    * __Security type__: Standard.
    * __Image__: Windows 11 Enterprise.

        > [!TIP]
        > If Windows 11 Enterprise isn't in the list for image selection, use _See all images__. Find the __Windows 11__ entry from Microsoft, and use the __Select__ drop-down to select the enterprise image.


    You can leave other fields at the default values.

    :::image type="content" source="./media/tutorial-create-secure-workspace-vnet/create-virtual-machine-basic.png" alt-text="Screenshot of the virtual machine basics configuration.":::

1. Select __Networking__. Review the networking information and make sure that it's not using the 172.17.0.0/16 IP address range. If it is, select a different range such as 172.16.0.0/16; the 172.17.0.0/16 range can cause conflicts with Docker.

    > [!NOTE]
    > The Azure Virtual Machine creates its own Azure Virtual Network for network isolation. This network is separate from the managed virtual network used by Azure Machine Learning.

1. Select __Review + create__. Verify that the information is correct, and then select __Create__.

### Create a private endpoint for the workspace

Since the VM is in an Azure Virtual Network and not the managed virtual network, it can't yet connect to the workspace. To connect to the workspace, you need to create a private endpoint for the workspace. The private endpoint is created in the Azure Virtual Network that contains the VM and allows the VM to connect to the workspace.

1. In the Azure portal, select your workspace. From the __Settings__ section, select __Networking__, __Private endpoint connections__, and then __+ Private endpoint__.
1. On the __Basics__ tab of the __Create a private endpoint__ form, enter a unique name for the private endpoint. Select __Next__ until you arrive at the __Virtual Network__ tab.
1. From the __Virtual Network__ tab, select the __virtual network__ that contains the VM. If you used a different subnet than __default__, select it also.
1. Continue selecting __Next__ until you arrive at the __Review + create__ tab. Select __Create__ to create the private endpoint.

### Enable Azure Bastion for the VM

1. In the Azure portal, select the VM you created earlier. From the __Operations__ section of the page, select __Bastion__.

1. Select __Deploy Bastion__ to deploy the Azure Bastion service and enable it for this VM.

1. Once the Bastion service has been deployed, you are presented with a connection page. Enter your connection information and then select __Connect__.

### Connect to studio

From the VM desktop, open a browser and navigate to the [Azure Machine Learning studio](https://ml.azure.com). Select your workspace from the list. You should be able to connect to studio now.

At this point, you can use the studio to interactively work with notebooks on the compute instance and run training jobs on the compute cluster. For a tutorial on using the compute instance and compute cluster, see [Tutorial: Model development](tutorial-cloud-workstation.md).

## Stop compute instance

While it's running (started), the compute instance continues charging your subscription. To avoid excess cost, __stop__ it when not in use.

From studio, select __Compute__, __Compute instances__, and then select the compute instance. Finally, select __Stop__ from the top of the page.

:::image type="content" source="./media/tutorial-create-secure-workspace/compute-instance-stop.png" alt-text="Screenshot of stop button for compute instance":::

## Clean up resources

If you plan to continue using the secured workspace and other resources, skip this section.

To delete all resources created in this tutorial, use the following steps:

1. In the Azure portal, select __Resource groups__.
1. From the list, select the resource group that you created in this tutorial.
1. Select __Delete resource group__.

    :::image type="content" source="./media/tutorial-create-secure-workspace/delete-resources.png" alt-text="Screenshot of delete resource group button":::

1. Enter the resource group name, then select __Delete__.

## Next steps

Now that you've created a secure workspace and can access studio, learn how to [deploy a model to an online endpoint with network isolation](how-to-secure-online-endpoint.md).

For more information on the managed virtual network, see [Secure your workspace with a managed virtual network](how-to-managed-network.md).