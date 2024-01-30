---
title: Create a secure workspace with Azure Virtual Network
titleSuffix: Azure Machine Learning
description: Create an Azure Machine Learning workspace and required Azure services inside an Azure Virtual Network.
services: machine-learning
ms.service: machine-learning
ms.subservice: enterprise-readiness
ms.reviewer: larryfr
ms.author: jhirono
author: jhirono
ms.date: 08/22/2023
ms.topic: how-to
ms.custom: subject-rbac-steps, cliv2, event-tier1-build-2022, ignite-2022, build-2023
monikerRange: 'azureml-api-2 || azureml-api-1'
---
# Tutorial: How to create a secure workspace with an Azure Virtual Network

In this article, learn how to create and connect to a secure Azure Machine Learning workspace. The steps in this article use an Azure Virtual Network to create a security boundary around resources used by Azure Machine Learning. 

> [!IMPORTANT]
> We recommend using the Azure Machine Learning managed virtual network instead of an Azure Virtual Network. For a version of this tutorial that uses a managed virtual network, see [Tutorial: Create a secure workspace with a managed virtual network](tutorial-create-secure-workspace.md).

In this tutorial, you accomplish the following tasks:

> [!div class="checklist"]
> * Create an Azure Virtual Network (VNet) to __secure communications between services in the virtual network__.
> * Create an Azure Storage Account (blob and file) behind the VNet. This service is used as __default storage for the workspace__.
> * Create an Azure Key Vault behind the VNet. This service is used to __store secrets used by the workspace__. For example, the security information needed to access the storage account.
> * Create an Azure Container Registry (ACR). This service is used as a repository for Docker images. __Docker images provide the compute environments needed when training a machine learning model or deploying a trained model as an endpoint__.
> * Create an Azure Machine Learning workspace.
> * Create a jump box. A jump box is an Azure Virtual Machine that is behind the VNet. Since the VNet restricts access from the public internet, __the jump box is used as a way to connect to resources behind the VNet__.
> * Configure Azure Machine Learning studio to work behind a VNet. The studio provides a __web interface for Azure Machine Learning__.
> * Create an Azure Machine Learning compute cluster. A compute cluster is used when __training machine learning models in the cloud__. In configurations where Azure Container Registry is behind the VNet, it is also used to build Docker images.
> * Connect to the jump box and use the Azure Machine Learning studio.

> [!TIP]
> If you're looking for a template (Microsoft Bicep or Hashicorp Terraform) that demonstrates how to create a secure workspace, see [Tutorial - Create a secure workspace using a template](tutorial-create-secure-workspace-template.md).

After completing this tutorial, you'll have the following architecture:

* An Azure Virtual Network, which contains three subnets:
    * __Training__: Contains the Azure Machine Learning workspace, dependency services, and resources used for training models.
    * __Scoring__: For the steps in this tutorial, it isn't used. However if you continue using this workspace for other tutorials, we recommend using this subnet when deploying models to [endpoints](concept-endpoints.md).
    * __AzureBastionSubnet__: Used by the Azure Bastion service to securely connect clients to Azure Virtual Machines.
* An Azure Machine Learning workspace that uses a private endpoint to communicate using the VNet.
* An Azure Storage Account that uses private endpoints to allow storage services such as blob and file to communicate using the VNet.
* An Azure Container Registry that uses a private endpoint communicate using the VNet.
* Azure Bastion, which allows you to use your browser to securely communicate with the jump box VM inside the VNet.
* An Azure Virtual Machine that you can remotely connect to and access resources secured inside the VNet.
* An Azure Machine Learning compute instance and compute cluster.

> [!TIP]
> The Azure Batch Service listed on the diagram is a back-end service required by the compute clusters and compute instances.

:::image type="content" source="./media/tutorial-create-secure-workspace-vnet/create-secure-vnet-end-state.svg" alt-text="Diagram of the final architecture created through this tutorial." lightbox="./media/tutorial-create-secure-workspace-vnet/create-secure-vnet-end-state.png":::

## Prerequisites

* Familiarity with Azure Virtual Networks and IP networking. If you aren't familiar, try the [Fundamentals of computer networking](/training/modules/network-fundamentals/) module.
* While most of the steps in this article use the Azure portal or the Azure Machine Learning studio, some steps use the Azure CLI extension for Machine Learning v2.

## Create a virtual network

To create a virtual network, use the following steps:

1. In the [Azure portal](https://portal.azure.com), select the portal menu in the upper left corner. From the menu, select __+ Create a resource__ and then enter __Virtual Network__ in the search field. Select the __Virtual Network__ entry, and then select __Create__.


    :::image type="content" source="./media/tutorial-create-secure-workspace-vnet/create-resource-search-vnet.png" alt-text="Screenshot of the create resource search form with virtual network selected.":::

    :::image type="content" source="./media/tutorial-create-secure-workspace-vnet/create-resource-vnet.png" alt-text="Screenshot of the virtual network create form.":::

1. From the __Basics__ tab, select the Azure __subscription__ to use for this resource and then select or create a new __resource group__. Under __Instance details__, enter a friendly __name__ for your virtual network and select the __region__ to create it in.

    :::image type="content" source="./media/tutorial-create-secure-workspace-vnet/create-vnet-basics.png" alt-text="Screenshot of the basic virtual network configuration form.":::

1. Select __Security__. Select to __Enable Azure Bastion__. [Azure Bastion](../bastion/bastion-overview.md) provides a secure way to access the VM jump box you'll create inside the VNet in a later step. Use the following values for the remaining fields:

    * __Bastion name__: A unique name for this Bastion instance
    * __Public IP address__: Create a new public IP address.

    Leave the other fields at the default values.

    :::image type="content" source="./media/tutorial-create-secure-workspace-vnet/create-bastion.png" alt-text="Screenshot of Bastion config.":::

1. Select __IP Addresses__. The default settings should be similar to the following image:

    :::image type="content" source="./media/tutorial-create-secure-workspace-vnet/create-vnet-ip-address-default.png" alt-text="Screenshot of the default IP Address form.":::

    Use the following steps to configure the IP address and configure a subnet for training and scoring resources:

    > [!TIP]
    > While you can use a single subnet for all Azure Machine Learning resources, the steps in this article show how to create two subnets to separate the training & scoring resources.
    >
    > The workspace and other dependency services will go into the training subnet. They can still be used by resources in other subnets, such as the scoring subnet.

    1. Look at the default __IPv4 address space__ value. In the screenshot, the value is __172.16.0.0/16__. __The value may be different for you__. While you can use a different value, the rest of the steps in this tutorial are based on the __172.16.0.0/16 value__.
    
        > [!WARNING]
        > Do not use the 172.17.0.0/16 IP address range for your VNet. This is the default subnet range used by the Docker bridge network, and will result in errors if used for your VNet. Other ranges may also conflict depending on what you want to connect to the virtual network. For example, if you plan to connect your on premises network to the VNet, and your on-premises network also uses the 172.16.0.0/16 range. Ultimately, it is up to __you__ to plan your network infrastructure.

    1. Select the __Default__ subnet and then select __Remove subnet__.
    
        :::image type="content" source="./media/tutorial-create-secure-workspace-vnet/delete-default-subnet.png" alt-text="Screenshot of deleting default subnet.":::

    1. To create a subnet to contain the workspace, dependency services, and resources used for _training_, select __+ Add subnet__ and set the subnet name, starting address, and subnet size. The following are the values used in this tutorial:
        * __Name__: Training
        * __Starting address__: 172.16.0.0
        * __Subnet size__: /24 (256 addresses)

        :::image type="content" source="./media/tutorial-create-secure-workspace-vnet/vnet-add-training-subnet.png" alt-text="Screenshot of Training subnet.":::

    1. To create a subnet for compute resources used to _score_ your models, select __+ Add subnet__ again, and set the name and address range:
        * __Subnet name__: Scoring
        * __Starting address__: 172.16.1.0
        * __Subnet size__: /24 (256 addresses)

        :::image type="content" source="./media/tutorial-create-secure-workspace-vnet/vnet-add-scoring-subnet.png" alt-text="Screenshot of Scoring subnet.":::

    1. To create a subnet for _Azure Bastion_, select __+ Add subnet__ and set the template, starting address, and subnet size:
        * __Subnet template__: Azure Bastion
        * __Starting address__: 172.16.2.0
        * __Subnet size__: /26 (64 addresses)

        :::image type="content" source="./media/tutorial-create-secure-workspace-vnet/vnet-add-azure-bastion-subnet.png" alt-text="Screenshot of Azure Bastion subnet.":::

1. Select __Review + create__.

    :::image type="content" source="./media/tutorial-create-secure-workspace-vnet/create-vnet-ip-address-final.png" alt-text="Screenshot of the review + create button.":::

1. Verify that the information is correct, and then select __Create__.

    :::image type="content" source="./media/tutorial-create-secure-workspace-vnet/create-vnet-review.png" alt-text="Screenshot of the virtual network review + create page.":::

## Create a storage account

1. In the [Azure portal](https://portal.azure.com), select the portal menu in the upper left corner. From the menu, select __+ Create a resource__ and then enter __Storage account__. Select the __Storage Account__ entry, and then select __Create__.
1. From the __Basics__ tab, select the __subscription__, __resource group__, and __region__ you previously used for the virtual network. Enter a unique __Storage account name__, and set __Redundancy__ to __Locally-redundant storage (LRS)__.

    :::image type="content" source="./media/tutorial-create-secure-workspace-vnet/create-storage.png" alt-text="Screenshot of storage account basic config.":::

1. From the __Networking__ tab, select __Private endpoint__ and then select __+ Add private endpoint__.

    :::image type="content" source="./media/tutorial-create-secure-workspace-vnet/storage-enable-private-endpoint.png" alt-text="Screenshot of the form to add the blob private network.":::

1. On the __Create private endpoint__ form, use the following values:
    * __Subscription__: The same Azure subscription that contains the previous resources you've created.
    * __Resource group__: The same Azure resource group that contains the previous resources you've created.
    * __Location__: The same Azure region that contains the previous resources you've created.
    * __Name__: A unique name for this private endpoint.
    * __Target sub-resource__: blob
    * __Virtual network__: The virtual network you created earlier.
    * __Subnet__: Training (172.16.0.0/24)
    * __Private DNS integration__: Yes
    * __Private DNS Zone__: privatelink.blob.core.windows.net

    Select __OK__ to create the private endpoint.

1. Select __Review + create__. Verify that the information is correct, and then select __Create__.

1. Once the Storage Account has been created, select __Go to resource__:

    :::image type="content" source="./media/tutorial-create-secure-workspace-vnet/storage-go-to-resource.png" alt-text="Screenshot of the go to new storage resource button.":::

1. From the left navigation, select __Networking__ the __Private endpoint connections__ tab, and then select __+ Private endpoint__:

    > [!NOTE]
    > While you created a private endpoint for Blob storage in the previous steps, you must also create one for File storage.

    :::image type="content" source="./media/tutorial-create-secure-workspace-vnet/storage-file-networking.png" alt-text="Screenshot of the storage account networking form.":::

1. On the __Create a private endpoint__ form, use the same __subscription__, __resource group__, and __Region__ that you've used for previous resources. Enter a unique __Name__.

    :::image type="content" source="./media/tutorial-create-secure-workspace-vnet/storage-file-private-endpoint.png" alt-text="Screenshot of the basics form when adding the file private endpoint.":::

1. Select __Next : Resource__, and then set __Target sub-resource__ to __file__.

    :::image type="content" source="./media/tutorial-create-secure-workspace-vnet/storage-file-private-endpoint-resource.png" alt-text="Screenshot of the resource form when selecting a sub-resource of 'file'.":::

1. Select __Next : Configuration__, and then use the following values:
    * __Virtual network__: The network you created previously
    * __Subnet__: Training
    * __Integrate with private DNS zone__: Yes
    * __Private DNS zone__: privatelink.file.core.windows.net

    :::image type="content" source="./media/tutorial-create-secure-workspace-vnet/storage-file-private-endpoint-config.png" alt-text="Screenshot of the configuration form when adding the file private endpoint.":::

1. Select __Review + Create__. Verify that the information is correct, and then select __Create__.

> [!TIP]
> If you plan to use a [batch endpoint](concept-endpoints.md) or an Azure Machine Learning pipeline that uses a [ParallelRunStep](./tutorial-pipeline-batch-scoring-classification.md), it is also required to configure private endpoints target **queue** and **table** sub-resources. ParallelRunStep uses queue and table under the hood for task scheduling and dispatching.

## Create a key vault

1. In the [Azure portal](https://portal.azure.com), select the portal menu in the upper left corner. From the menu, select __+ Create a resource__ and then enter __Key Vault__. Select the __Key Vault__ entry, and then select __Create__.
1. From the __Basics__ tab, select the __subscription__, __resource group__, and __region__ you previously used for the virtual network. Enter a unique __Key vault name__. Leave the other fields at the default value.

    :::image type="content" source="./media/tutorial-create-secure-workspace-vnet/create-key-vault.png" alt-text="Screenshot of the basics form when creating a new key vault.":::

1. From the __Networking__ tab, select __Private endpoint__ and then select __+ Add__.

    :::image type="content" source="./media/tutorial-create-secure-workspace-vnet/key-vault-networking.png" alt-text="Screenshot of the networking form when adding a private endpoint for the key vault.":::

1. On the __Create private endpoint__ form, use the following values:
    * __Subscription__: The same Azure subscription that contains the previous resources you've created.
    * __Resource group__: The same Azure resource group that contains the previous resources you've created.
    * __Location__: The same Azure region that contains the previous resources you've created.
    * __Name__: A unique name for this private endpoint.
    * __Target sub-resource__: Vault
    * __Virtual network__: The virtual network you created earlier.
    * __Subnet__: Training (172.16.0.0/24)
    * __Private DNS integration__: Yes
    * __Private DNS Zone__: privatelink.vaultcore.azure.net

    Select __OK__ to create the private endpoint.

    :::image type="content" source="./media/tutorial-create-secure-workspace-vnet/key-vault-private-endpoint.png" alt-text="Screenshot of the key vault private endpoint configuration form.":::

1. Select __Review + create__. Verify that the information is correct, and then select __Create__.

## Create a container registry

1. In the [Azure portal](https://portal.azure.com), select the portal menu in the upper left corner. From the menu, select __+ Create a resource__ and then enter __Container Registry__. Select the __Container Registry__ entry, and then select __Create__.
1. From the __Basics__ tab, select the __subscription__, __resource group__, and __location__ you previously used for the virtual network. Enter a unique __Registry name__ and set the __SKU__ to __Premium__.

    :::image type="content" source="./media/tutorial-create-secure-workspace-vnet/create-container-registry.png" alt-text="Screenshot of the basics form when creating a container registry.":::

1. From the __Networking__ tab, select __Private endpoint__ and then select __+ Add__.

    :::image type="content" source="./media/tutorial-create-secure-workspace-vnet/container-registry-networking.png" alt-text="Screenshot of the networking form when adding a container registry private endpoint.":::

1. On the __Create private endpoint__ form, use the following values:
    * __Subscription__: The same Azure subscription that contains the previous resources you've created.
    * __Resource group__: The same Azure resource group that contains the previous resources you've created.
    * __Location__: The same Azure region that contains the previous resources you've created.
    * __Name__: A unique name for this private endpoint.
    * __Target sub-resource__: registry
    * __Virtual network__: The virtual network you created earlier.
    * __Subnet__: Training (172.16.0.0/24)
    * __Private DNS integration__: Yes
    * __Private DNS Zone__: privatelink.azurecr.io

    Select __OK__ to create the private endpoint.

    :::image type="content" source="./media/tutorial-create-secure-workspace-vnet/container-registry-private-endpoint.png" alt-text="Screenshot of the configuration form for the container registry private endpoint.":::

1. Select __Review + create__. Verify that the information is correct, and then select __Create__.
1. After the container registry has been created, select __Go to resource__.

    :::image type="content" source="./media/tutorial-create-secure-workspace-vnet/container-registry-go-to-resource.png" alt-text="Screenshot of the 'go to resource' button.":::

1. From the left of the page, select __Access keys__, and then enable __Admin user__. This setting is required when using Azure Container Registry inside a virtual network with Azure Machine Learning.

    :::image type="content" source="./media/tutorial-create-secure-workspace-vnet/container-registry-admin-user.png" alt-text="Screenshot of the container registry access keys form, with the 'admin user' option enabled.":::

## Create a workspace

1. In the [Azure portal](https://portal.azure.com), select the portal menu in the upper left corner. From the menu, select __+ Create a resource__ and then enter __Machine Learning__. Select the __Machine Learning__ entry, and then select __Create__.

    :::image type="content" source="./media/tutorial-create-secure-workspace-vnet/machine-learning-create.png" alt-text="Screenshot of the create page for Azure Machine Learning.":::

1. From the __Basics__ tab, select the __subscription__, __resource group__, and __Region__ you previously used for the virtual network. Use the following values for the other fields:
    * __Workspace name__: A unique name for your workspace.
    * __Storage account__: Select the storage account you created previously.
    * __Key vault__: Select the key vault you created previously.
    * __Application insights__: Use the default value.
    * __Container registry__: Use the container registry you created previously.

    :::image type="content" source="./media/tutorial-create-secure-workspace-vnet/create-machine-learning-workspace.png" alt-text="Screenshot of the basic workspace configuration form.":::

1. From the __Networking__ tab, select __Private with Internet Outbound__. In the __Workspace inbound access__ section, select __+ add__.

1. On the __Create private endpoint__ form, use the following values: 
    * __Subscription__: The same Azure subscription that contains the previous resources you've created.
    * __Resource group__: The same Azure resource group that contains the previous resources you've created.
    * __Location__: The same Azure region that contains the previous resources you've created.
    * __Name__: A unique name for this private endpoint.
    * __Target sub-resource__: amlworkspace
    * __Virtual network__: The virtual network you created earlier.
    * __Subnet__: Training (172.16.0.0/24)
    * __Private DNS integration__: Yes
    * __Private DNS Zone__: Leave the two private DNS zones at the default values of __privatelink.api.azureml.ms__ and __privatelink.notebooks.azure.net__.

    Select __OK__ to create the private endpoint.

    :::image type="content" source="./media/tutorial-create-secure-workspace-vnet/machine-learning-workspace-private-endpoint.png" alt-text="Screenshot of the workspace private network configuration form.":::

1. From the __Networking__ tab, in the __Workspace outbound access__ section, select __Use my own virtual network__.
1. Select __Review + create__. Verify that the information is correct, and then select __Create__.
1. Once the workspace has been created, select __Go to resource__.
1. From the __Settings__ section on the left, select __Private endpoint connections__ and then select the link in the __Private endpoint__ column:

    :::image type="content" source="./media/tutorial-create-secure-workspace-vnet/workspace-private-endpoint-connections.png" alt-text="Screenshot of the private endpoint connections for the workspace.":::

1. Once the private endpoint information appears, select __DNS configuration__ from the left of the page. Save the IP address and fully qualified domain name (FQDN) information on this page, as it will be used later.

    :::image type="content" source="./media/tutorial-create-secure-workspace-vnet/workspace-private-endpoint-dns.png" alt-text="screenshot of the IP and FQDN entries for the workspace.":::

> [!IMPORTANT]
> There are still some configuration steps needed before you can fully use the workspace. However, these require you to connect to the workspace.

## Enable studio

Azure Machine Learning studio is a web-based application that lets you easily manage your workspace. However, it needs some extra configuration before it can be used with resources secured inside a VNet. Use the following steps to enable studio:

1. When using an Azure Storage Account that has a private endpoint, add the service principal for the workspace as a __Reader__ for the storage private endpoint(s). From the Azure portal, select your storage account and then select __Networking__. Next, select __Private endpoint connections__.

    :::image type="content" source="./media/tutorial-create-secure-workspace-vnet/storage-private-endpoint-select.png" alt-text="Screenshot of storage private endpoint connections.":::

1. For __each private endpoint listed__, use the following steps:

    1. Select the link in the __Private endpoint__ column.
    
        :::image type="content" source="./media/tutorial-create-secure-workspace-vnet/storage-private-endpoint-selected.png" alt-text="Screenshot of the endpoint links in the private endpoint column.":::

    1. Select __Access control (IAM)__ from the left side.
    1. Select __+ Add__, and then __Add role assignment (Preview)__.

        ![Access control (IAM) page with Add role assignment menu open.](../../includes/role-based-access-control/media/add-role-assignment-menu-generic.png)

    1. On the __Role__ tab, select the __Reader__.

        ![Add role assignment page with Role tab selected.](../../includes/role-based-access-control/media/add-role-assignment-role-generic.png)

    1. On the __Members__ tab, select __User, group, or service principal__ in the __Assign access to__ area and then select __+ Select members__. In the __Select members__ dialog, enter the name as your Azure Machine Learning workspace. Select the service principal for the workspace, and then use the __Select__ button.

    1. On the **Review + assign** tab, select **Review + assign** to assign the role.

## Secure Azure Monitor and Application Insights

> [!NOTE]
> For more information on securing Azure Monitor and Application Insights, see the following links:
> * [Migrate to workspace-based Application Insights resources](../azure-monitor/app/convert-classic-resource.md).
> * [Configure your Azure Monitor private link](../azure-monitor/logs/private-link-configure.md).

1. In the [Azure portal](https://portal.azure.com), select your Azure Machine Learning workspace. From __Overview__, select the __Application Insights__ link.

    :::image type="content" source="./media/tutorial-create-secure-workspace-vnet/workspace-application-insight.png" alt-text="Screenshot of the Application Insights link.":::

1. In the __Properties__ for Application Insights, check the __WORKSPACE__ entry to see if it contains a value. If it _doesn't_, select __Migrate to Workspace-based__, select the __Subscription__ and __Log Analytics Workspace__ to use, then select __Apply__.

    :::image type="content" source="./media/tutorial-create-secure-workspace-vnet/migrate-workspace-based.png" alt-text="Screenshot of the link to migrate to workspace-based.":::

1. In the Azure portal, select __Home__, and then search for __Private link__. Select the __Azure Monitor Private Link Scope__ result and then select __Create__.
1. From the __Basics__ tab, select the same __Subscription__, __Resource Group__, and __Resource group region__ as your Azure Machine Learning workspace. Enter a __Name__ for the instance, and then select __Review + Create__. To create the instance, select __Create__.
1. Once the Azure Monitor Private Link Scope instance has been created, select the instance in the Azure portal. From the __Configure__ section, select __Azure Monitor Resources__ and then select __+ Add__.

    :::image type="content" source="./media/tutorial-create-secure-workspace-vnet/add-monitor-resources.png" alt-text="Screenshot of the add button.":::

1. From __Select a scope__, use the filters to select the Application Insights instance for your Azure Machine Learning workspace. Select __Apply__ to add the instance.
1. From the __Configure__ section, select __Private Endpoint connections__ and then select __+ Private Endpoint__.

    :::image type="content" source="./media/tutorial-create-secure-workspace-vnet/private-endpoint-connections.png" alt-text="Screenshot of the add private endpoint button.":::

1. Select the same __Subscription__, __Resource Group__, and __Region__ that contains your VNet. Select __Next: Resource__.

    :::image type="content" source="./media/tutorial-create-secure-workspace-vnet/monitor-private-endpoint-basics.png" alt-text="Screenshot of the Azure Monitor private endpoint basics.":::

1. Select `Microsoft.insights/privateLinkScopes` as the __Resource type__. Select the Private Link Scope you created earlier as the __Resource__. Select `azuremonitor` as the __Target sub-resource__. Finally, select __Next: Virtual Network__ to continue.

    :::image type="content" source="./media/tutorial-create-secure-workspace-vnet/monitor-private-endpoint-resource.png" alt-text="Screenshot of the Azure Monitor private endpoint resources.":::

1. Select the __Virtual network__ you created earlier, and the __Training__ subnet. Select __Next__ until you arrive at __Review + Create__. Select __Create__ to create the private endpoint.

    :::image type="content" source="./media/tutorial-create-secure-workspace-vnet/monitor-private-endpoint-network.png" alt-text="Screenshot of the Azure Monitor private endpoint network.":::

1. After the private endpoint has been created, return to the __Azure Monitor Private Link Scope__ resource in the portal. From the __Configure__ section, select __Access modes__. Select __Private only__ for __Ingestion access mode__ and __Query access mode__, then select __Save__.

    :::image type="content" source="./media/tutorial-create-secure-workspace-vnet/access-modes.png" alt-text="Screenshot of the private link scope access modes.":::

## Connect to the workspace

There are several ways that you can connect to the secured workspace. The steps in this article use a __jump box__, which is a virtual machine in the VNet. You can connect to it using your web browser and Azure Bastion. The following table lists several other ways that you might connect to the secure workspace:

| Method | Description |
| ----- | ----- |
| [Azure VPN gateway](../vpn-gateway/vpn-gateway-about-vpngateways.md) | Connects on-premises networks to the VNet over a private connection. Connection is made over the public internet. |
| [ExpressRoute](https://azure.microsoft.com/services/expressroute/) | Connects on-premises networks into the cloud over a private connection. Connection is made using a connectivity provider. |

> [!IMPORTANT]
> When using a __VPN gateway__ or __ExpressRoute__, you will need to plan how name resolution works between your on-premises resources and those in the VNet. For more information, see [Use a custom DNS server](how-to-custom-dns.md).

### Create a jump box (VM)

Use the following steps to create an Azure Virtual Machine to use as a jump box. Azure Bastion enables you to connect to the VM desktop through your browser. From the VM desktop, you can then use the browser on the VM to connect to resources inside the VNet, such as Azure Machine Learning studio. Or you can install development tools on the VM. 

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

1. Select __Networking__, and then select the __Virtual network__ you created earlier. Use the following information to set the remaining fields:

    * Select the __Training__ subnet.
    * Set the __Public IP__ to __None__.
    * Leave the other fields at the default value.

    :::image type="content" source="./media/tutorial-create-secure-workspace-vnet/create-virtual-machine-network.png" alt-text="Screenshot of the virtual machine network configuration.":::

1. Select __Review + create__. Verify that the information is correct, and then select __Create__.


### Connect to the jump box

1. Once the virtual machine has been created, select __Go to resource__.
1. From the top of the page, select __Connect__ and then __Bastion__.

    :::image type="content" source="./media/tutorial-create-secure-workspace-vnet/virtual-machine-connect.png" alt-text="Screenshot of the 'connect' list, with 'Bastion' selected.":::

1. Select __Use Bastion__, and then provide your authentication information for the virtual machine, and a connection will be established in your browser.

    :::image type="content" source="./media/tutorial-create-secure-workspace-vnet/use-bastion.png" alt-text="Screenshot of the Use Bastion button.":::

## Create a compute cluster and compute instance

A compute cluster is used by your training jobs. A compute instance provides a Jupyter Notebook experience on a shared compute resource attached to your workspace.

1. From an Azure Bastion connection to the jump box, open the __Microsoft Edge__ browser on the remote desktop.
1. In the remote browser session, go to __https://ml.azure.com__. When prompted, authenticate using your Microsoft Entra account.
1. From the __Welcome to studio!__ screen, select the __Machine Learning workspace__ you created earlier and then select __Get started__.

    > [!TIP]
    > If your Microsoft Entra account has access to multiple subscriptions or directories, use the __Directory and Subscription__ dropdown to select the one that contains the workspace.

    :::image type="content" source="./media/tutorial-create-secure-workspace-vnet/studio-select-workspace.png" alt-text="Screenshot of the select Machine Learning workspace form.":::

1. From studio, select __Compute__, __Compute clusters__, and then __+ New__.

    :::image type="content" source="./media/tutorial-create-secure-workspace-vnet/studio-new-compute-cluster.png" alt-text="Screenshot of the compute clusters page, with the 'new' button selected.":::

1. From the __Virtual Machine__ dialog, select __Next__ to accept the default virtual machine configuration.

    :::image type="content" source="./media/tutorial-create-secure-workspace-vnet/studio-new-compute-vm.png" alt-text="Screenshot of the compute cluster virtual machine configuration.":::
    
1. From the __Configure Settings__ dialog, enter __cpu-cluster__ as the __Compute name__. Set the __Subnet__ to __Training__ and then select __Create__ to create the cluster.

    > [!TIP]
    > Compute clusters dynamically scale the nodes in the cluster as needed. We recommend leaving the minimum number of nodes at 0 to reduce costs when the cluster is not in use.

    :::image type="content" source="./media/tutorial-create-secure-workspace-vnet/studio-new-compute-settings.png" alt-text="Screenshot of the configure settings form.":::

1. From studio, select __Compute__, __Compute instance__, and then __+ New__.

    :::image type="content" source="./media/tutorial-create-secure-workspace-vnet/create-compute-instance.png" alt-text="Screenshot of the compute instances page, with the 'new' button selected.":::

1. From the __Virtual Machine__ dialog, enter a unique __Computer name__ and select __Next: Advanced Settings__.

    :::image type="content" source="./media/tutorial-create-secure-workspace-vnet/create-compute-instance-vm.png" alt-text="Screenshot of compute instance virtual machine configuration.":::

1. From the __Advanced Settings__ dialog, set the __Subnet__ to __Training__, and then select __Create__.

    :::image type="content" source="./media/tutorial-create-secure-workspace-vnet/create-compute-instance-settings.png" alt-text="Screenshot of the advanced settings.":::

> [!TIP]
> When you create a compute cluster or compute instance, Azure Machine Learning dynamically adds a Network Security Group (NSG). This NSG contains the following rules, which are specific to compute cluster and compute instance:
> 
> * Allow inbound TCP traffic on ports 29876-29877 from the `BatchNodeManagement` service tag.
> * Allow inbound TCP traffic on port 44224 from the `AzureMachineLearning` service tag.
>
> The following screenshot shows an example of these rules:
>
> :::image type="content" source="./media/how-to-secure-training-vnet/compute-instance-cluster-network-security-group.png" alt-text="Screenshot of NSG":::

For more information on creating a compute cluster and compute cluster, including how to do so with Python and the CLI, see the following articles:

* [Create a compute cluster](how-to-create-attach-compute-cluster.md)
* [Create a compute instance](how-to-create-compute-instance.md)

## Configure image builds

[!INCLUDE [cli v2](includes/machine-learning-cli-v2.md)]

When Azure Container Registry is behind the virtual network, Azure Machine Learning can't use it to directly build Docker images (used for training and deployment). Instead, configure the workspace to use the compute cluster you created earlier. Use the following steps to create a compute cluster and configure the workspace to use it to build images:

1. Navigate to [https://shell.azure.com/](https://shell.azure.com/) to open the Azure Cloud Shell.
1. From the Cloud Shell, use the following command to install the 2.0 CLI for Azure Machine Learning:
 
    ```azurecli-interactive
    az extension add -n ml
    ```

1. To update the workspace to use the compute cluster to build Docker images. Replace `docs-ml-rg` with your resource group. Replace `docs-ml-ws` with your workspace. Replace `cpu-cluster` with the compute cluster to use:
    
    ```azurecli-interactive
    az ml workspace update \
      -n myworkspace \
      -g myresourcegroup \
      -i mycomputecluster
    ```

    > [!NOTE]
    > You can use the same compute cluster to train models and build Docker images for the workspace.

## Use the workspace

> [!IMPORTANT]
> The steps in this article put Azure Container Registry behind the VNet. In this configuration, you cannot deploy a model to Azure Container Instances inside the VNet. We do not recommend using Azure Container Instances with Azure Machine Learning in a virtual network. For more information, see [Secure the inference environment (SDK/CLI v1)](./v1/how-to-secure-inferencing-vnet.md).
>
> As an alternative to Azure Container Instances, try Azure Machine Learning managed online endpoints. For more information, see [Enable network isolation for managed online endpoints](how-to-secure-online-endpoint.md).

At this point, you can use the studio to interactively work with notebooks on the compute instance and run training jobs on the compute cluster. For a tutorial on using the compute instance and compute cluster, see [Tutorial: Azure Machine Learning in a day](tutorial-azure-ml-in-a-day.md).

## Stop compute instance and jump box

> [!WARNING]
> While it is running (started), the compute instance and jump box will continue charging your subscription. To avoid excess cost, __stop__ them when they are not in use.

The compute cluster dynamically scales between the minimum and maximum node count set when you created it. If you accepted the defaults, the minimum is 0, which effectively turns off the cluster when not in use.
### Stop the compute instance

From studio, select __Compute__, __Compute clusters__, and then select the compute instance. Finally, select __Stop__ from the top of the page.

:::image type="content" source="./media/tutorial-create-secure-workspace-vnet/compute-instance-stop.png" alt-text="Screenshot of the stop button for the compute instance.":::

### Stop the jump box

Once it has been created, select the virtual machine in the Azure portal and then use the __Stop__ button. When you're ready to use it again, use the __Start__ button to start it.

:::image type="content" source="./media/tutorial-create-secure-workspace-vnet/virtual-machine-stop.png" alt-text="Screenshot of the stop button for the jump box virtual machine.":::

You can also configure the jump box to automatically shut down at a specific time. To do so, select __Auto-shutdown__, __Enable__, set a time, and then select __Save__.

:::image type="content" source="./media/tutorial-create-secure-workspace-vnet/virtual-machine-auto-shutdown.png" alt-text="Screenshot of the auto-shutdown option.":::

## Clean up resources

If you plan to continue using the secured workspace and other resources, skip this section.

To delete all resources created in this tutorial, use the following steps:

1. In the Azure portal, select __Resource groups__ on the far left.
1. From the list, select the resource group that you created in this tutorial.
1. Select __Delete resource group__.

    :::image type="content" source="./media/tutorial-create-secure-workspace-vnet/delete-resources.png" alt-text="Screenshot of the delete resource group link.":::

1. Enter the resource group name, then select __Delete__.
## Next steps

:::moniker range="azureml-api-2"
Now that you've created a secure workspace and can access studio, learn how to [deploy a model to an online endpoint with network isolation](how-to-secure-online-endpoint.md).
:::moniker-end
:::moniker range="azureml-api-1"
Now that you've created a secure workspace, learn how to [deploy a model](./v1/how-to-deploy-and-where.md).
:::moniker-end
