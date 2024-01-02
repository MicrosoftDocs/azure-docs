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

## Create a jump box (VM)

There are several ways that you can connect to the secured workspace. In this tutorial, a __jump box__ is used. A jump box is a virtual machine in an Azure Virtual Network. You can connect to it using your web browser and Azure Bastion. 

The following table lists several other ways that you might connect to the secure workspace:

| Method | Description |
| ----- | ----- |
| [Azure VPN gateway](../vpn-gateway/vpn-gateway-about-vpngateways.md) | Connects on-premises networks to an Azure Virtual Network over a private connection. A private endpoint for your workspace is created within that virtual network. Connection is made over the public internet. |
| [ExpressRoute](https://azure.microsoft.com/services/expressroute/) | Connects on-premises networks into the cloud over a private connection. Connection is made using a connectivity provider. |

> [!IMPORTANT]
> When using a __VPN gateway__ or __ExpressRoute__, you will need to plan how name resolution works between your on-premises resources and those in the cloud. For more information, see [Use a custom DNS server](how-to-custom-dns.md).

Use the following steps to create an Azure Virtual Machine to use as a jump box. From the VM desktop, you can then use the browser on the VM to connect to resources inside the managed virtual network, such as Azure Machine Learning studio. Or you can install development tools on the VM. 

> [!TIP]
> The following steps create a Windows 11 enterprise VM. Depending on your requirements, you may want to select a different VM image. The Windows 11 (or 10) enterprise image is useful if you need to join the VM to your organization's domain.

1. In the [Azure portal](https://portal.azure.com), select the portal menu in the upper left corner. From the menu, select __+ Create a resource__ and then enter __Virtual Machine__. Select the __Virtual Machine__ entry, and then select __Create__.

1. From the __Basics__ tab, select the __subscription__, __resource group__, and __Region__ to create the service in. Provide values for the following fields:

    * __Virtual machine name__: A unique name for the VM.
    * __Username__: The username you use to sign in to the VM.
    * __Password__: The password for the username.
    * __Security type__: Standard.
    * __Image__: Windows 11 Enterprise.

        > [!TIP]
        > If Windows 11 Enterprise isn't in the list for image selection, use _See all images__. Find the __Windows 11__ entry from Microsoft, and use the __Select__ drop-down to select the enterprise image.


    You can leave other fields at the default values.

    :::image type="content" source="./media/tutorial-create-secure-workspace/create-virtual-machine-basic.png" alt-text="Screenshot of the virtual machine basics configuration.":::

1. Select __Networking__. Review the networking information and make sure that it's not using the 172.17.0.0/16 IP address range. If it is, select a different range such as 172.16.0.0/16; the 172.17.0.0/16 range can cause conflicts with Docker.

    > [!NOTE]
    > The Azure Virtual Machine creates its own Azure Virtual Network for network isolation. This network is separate from the managed virtual network used by Azure Machine Learning.

    :::image type="content" source="./media/tutorial-create-secure-workspace/virtual-machine-networking.png" alt-text="Screenshot of the networking tab for the virtual machine.":::

1. Select __Review + create__. Verify that the information is correct, and then select __Create__.

### Enable Azure Bastion for the VM

Azure Bastion enables you to connect to the VM desktop through your browser.

1. In the Azure portal, select the VM you created earlier. From the __Operations__ section of the page, select __Bastion__ and then __Deploy Bastion__.

    :::image type="content" source="./media/tutorial-create-secure-workspace/virtual-machine-deploy-bastion.png" alt-text="Screenshot of the deploy Bastion option.":::

1. Once the Bastion service has been deployed, you're presented with a connection page. Leave this dialog for now.

## Create a workspace

1. In the [Azure portal](https://portal.azure.com), select the portal menu in the upper left corner. From the menu, select __+ Create a resource__ and then enter __Azure Machine Learning__. Select the __Azure Machine Learning__ entry, and then select __Create__.

1. From the __Basics__ tab, select the __subscription__, __resource group__, and __Region__ to create the service in. Enter a unique name for the __Workspace name__. Leave the rest of the fields at the default values; new instances of the required services are created for the workspace.

    :::image type="content" source="./media/tutorial-create-secure-workspace/create-workspace.png" alt-text="Screenshot of the workspace creation form.":::

1. From the __Networking__ tab, select __Private with Internet Outbound__.

    :::image type="content" source="./media/tutorial-create-secure-workspace/private-internet-outbound.png" alt-text="Screenshot of the workspace network tab with internet outbound selected.":::

1. From the __Networking__ tab, in the __Workspace inbound access__ section, select __+ Add__.

    :::image type="content" source="./media/tutorial-create-secure-workspace/workspace-inbound-access.png" alt-text="Screenshot showing the add button for inbound access.":::

1. From the __Create private endpoint__ form, enter a unique value in the __Name__ field. Select the __Virtual network__ created earlier with the VM, and select the default __Subnet__. Leave the rest of the fields at the default values. Select __OK__ to save the endpoint.

    :::image type="content" source="./media/tutorial-create-secure-workspace/private-endpoint-workspace.png" alt-text="Screenshot of the create private endpoint form.":::

1. Select __Review + create__. Verify that the information is correct, and then select __Create__.

1. Once the workspace has been created, select __Go to resource__.

## Connect to the VM desktop

1. From the [Azure portal](https://portal.azure.com), select the VM you created earlier.
1. From the __Connect__ section, select __Bastion__. Enter the username and password you configured for the VM, and then select __Connect__.

    :::image type="content" source="./media/tutorial-create-secure-workspace/virtual-machine-bastion-connect.png" alt-text="Screenshot of the Bastion connect form.":::

## Connect to studio

At this point, the workspace has been created __but the managed virtual network has not__. The managed virtual network is _configured_ when you create the workspace, but it isn't created until you create the first compute resource or manually provision it.

Use the following steps to create a compute instance.

1. From the __VM desktop__, use the browser to open the [Azure Machine Learning studio](https://ml.azure.com) and select the workspace you created earlier.

1. From studio, select __Compute__, __Compute instances__, and then __+ New__.

    :::image type="content" source="./media/tutorial-create-secure-workspace/create-new-compute-instance.png" alt-text="Screenshot of the new compute option in studio.":::
    
1. From the __Configure required settings__ dialog, enter a unique value as the __Compute name__. Leave the rest of the selections at the default value.

1. Select __Create__. The compute instance takes a few minutes to create. The compute instance is created within the managed network.

    > [!TIP]
    > It may take several minutes to create the first compute resource. This delay occurs because the managed virtual network is also being created. The managed virtual network isn't created until the first compute resource is created. Subsequent managed compute resources will be created much faster.

### Enable studio access to storage

Since the Azure Machine Learning studio partially runs in the web browser on the client, the client needs to be able to directly access the default storage account for the workspace to perform data operations. To enable this, use the following steps:

1. From the [Azure portal](https://portal.azure.com), select the jump box VM you created earlier. From the __Overview__ section, copy the __Public IP address__.
1. From the [Azure portal](https://portal.azure.com), select the workspace you created earlier. From the __Overview__ section, select the link for the __Storage__ entry.
1. From the storage account, select __Networking__, and add the jump box's _public_ IP address to the __Firewall__ section.

    > [!TIP]
    > In a scenario where you use a VPN gateway or ExpressRoute instead of a jump box, you could add a private endpoint or service endpoint for the storage account to the Azure Virtual Network. Using a private endpoint or service endpoint would allow multiple clients connecting through the Azure Virtual Network to successfully perform storage operations through studio.

    At this point, you can use the studio to interactively work with notebooks on the compute instance and run training jobs. For a tutorial, see [Tutorial: Model development](tutorial-cloud-workstation.md).

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
