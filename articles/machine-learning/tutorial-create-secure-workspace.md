---
title: Create a secure Azure Machine Learning workspace
titleSuffix: Azure Machine Learning
description: Tutorial of creating a secure Azure Machine Learning workspace
services: machine-learning
ms.service: machine-learning
ms.subservice: core
ms.reviewer: larryfr
ms.author: larryfr
author: blackmist
ms.date: 03/17/2021
ms.topic: how-to

---
# How to create a secure workspace

In this article, learn how to create and connect to a secure Azure Machine Learning workspace.

## Prerequisites

* Familiarity with Azure Virtual Networks

## Create a virtual network

To create a virtual network, use the following steps:

1. In the [Azure portal](https://portal.azure.com), select __+ Create a resource__ and then enter __Virtual Network__ in the search field. Select the __Virtual Network__ entry, and then select __Create__.

    :::image type="content" source="./media/tutorial-create-secure-workspace/create-resource-search-vnet.png" alt-text="The create resource UI search":::

    :::image type="content" source="./media/tutorial-create-secure-workspace/create-resource-vnet.png" alt-text="Virtual network create":::

1. From the __Basics__ tab, select the Azure __subscription__ to use for this resource and then select or create a new __resource group__. Under __Instance details__, enter a friendly __name__ for your virtual network and select the __region__ to create it in.

    :::image type="content" source="./media/tutorial-create-secure-workspace/create-vnet-basics.png" alt-text="Image of the basic virtual network config":::

1. Select __IP Addresses__ tab. The default settings should be similar to the following image:

    :::image type="content" source="./media/tutorial-create-secure-workspace/create-vnet-ipaddress-default.png" alt-text="Default IP Address screen":::

    Use the following steps to configure the IP address and configure a subnet for training and scoring resources:

    > [!TIP]
    > While you can use a single subnet for all Azure ML resources, the steps in this article show how to create two subnets to separate the training & scoring resources.
    >
    > The workspace and other dependency services will go into the training subnet. They can still be used by resources in other subnets, such as the scoring subnet.

    1. Make note of the the default __IPv4 address space__. In the screenshot, the value is __172.17.0.0/16__. __The value may be different for you__. While you can use a different value, the rest of the steps in this tutorial are based on the 172.17.0.0/16 value.
    1. Select the __Default__ subnet and then select __Remove subnet__.
    
        :::image type="content" source="./media/tutorial-create-secure-workspace/delete-default-subnet.png" alt-text="Delete default subnet":::

    1. To create a subnet to contain the workspace, dependency services, and resources used for training, select __+ Add subnet__ and use the following values for the subnet:
        * __Subnet name__: Training
        * __Subnet address range__: 172.17.0.0/24
        * __Services__: Select the following services:
            * __Microsoft.Storage__
            * __Microsoft.KeyVault__
            * __Microsoft.ContainerRegistry__

        :::image type="content" source="./media/tutorial-create-secure-workspace/vnet-add-training-subnet.png" alt-text="Create a Training subnet":::

    1. To create a subnet for compute resources used to score your models, select __+ Add subnet__ again, and use the follow values:
        * __Subnet name__: Scoring
        * __Subnet address range__: 172.17.1.0/24
        * __Services__: Select the following services:
            * __Microsoft.Storage__
            * __Microsoft.KeyVault__
            * __Microsoft.ContainerRegistry__

        :::image type="content" source="./media/tutorial-create-secure-workspace/vnet-add-scoring-subnet.png" alt-text="Create a Scoring subnet":::

1. Select __Review + create__.

    :::image type="content" source="./media/tutorial-create-secure-workspace/create-vnet-ipaddress-final.png" alt-text="Review + create button":::

1. Verify that the information is correct, and then select __Create__.

    :::image type="content" source="./media/tutorial-create-secure-workspace/create-vnet-review.png" alt-text="Review image":::

## Create network security groups

Use the following steps create a network security group (NSG) and add rules required for using Azure Machine Learning compute clusters and compute instances to train models:

1. In the Azure portal, select the __Home__ link to return to the homepage. Select __+ Create a resource__ and then enter __Network security group__. Select the __Network security group__ entry, and then select __Create__.
1. From the __Basics__ tab, select the __subscription__, __resource group__, and __region__ you previously used for the virtual network. Enter a unique __name__ for the new network security group.

    :::image type="content" source="./media/tutorial-create-secure-workspace/create-nsg.png" alt-text="Image of the basic network security group config":::

1. Select __Review + create__. Verify that the information is correct, and then select __Create__.

### Apply security rules

1. Once the network security group has been created, use the __Go to resource__ button and then select __Inbound security rules__. Select __+ Add__ to add a new rule.

    :::image type="content" source="./media/tutorial-create-secure-workspace/nsg-inbound-security-rules.png" alt-text="Add security rules":::

1. Use the following values for the new rule, and then select __Add__ to add the rule to the network security group:
    * __Source__: Service Tag
    * __Source service tag__: BatchNodeManagement
    * __Source port ranges__: *
    * __Destination__: Any
    * __Service__: Custom
    * __Destination port ranges__: 29876-29877
    * __Protocol__: TCP
    * __Action__: Allow
    * __Priority__: 1040
    * __Name__: AzureBatch
    * __Description__: Azure Batch management traffic

    :::image type="content" source="./media/tutorial-create-secure-workspace/nsg-batchnodemanagement.png" alt-text="Image of the batchnodemanagement rule":::


1. Select __+ Add__ to add another rule. Use the following values for this rule, and then select __Add__ to add the rule:
    * __Source__: Service Tag
    * __Source service tag__: AzureMachineLearning
    * __Source port ranges__: *
    * __Destination__: Any
    * __Service__: Custom
    * __Destination port ranges__: 44224
    * __Protocol__: TCP
    * __Action__: Allow
    * __Priority__: 1050
    * __Name__: AzureML
    * __Description__: Azure Machine Learning traffic to compute cluster/instance

    :::image type="content" source="./media/tutorial-create-secure-workspace/nsg-azureml.png" alt-text="Image of the azureml rule":::

1. From the left navigation, select __Subnets__, and then select __+ Associate__. From the __Virtual network__ dropdown, select your network. Then select the __Training__ subnet. Finally, select __OK__.

    > [!TIP]
    > The rules added in this section only apply to training computes, so do not need to be associated with the scoring subnet.

    :::image type="content" source="./media/tutorial-create-secure-workspace/nsg-associate-subnet.png" alt-text="Image of the associate config":::

## Create a storage account

1. In the Azure portal, select the __Home__ link to return to the homepage. Select __+ Create a resource__ and then enter __storage account__. Select the __Storage Account__ entry, and then select __Create__.
1. From the __Basics__ tab, select the __subscription__, __resource group__, and __region__ you previously used for the virtual network. Enter a unique __Storage account name__, and set __Redundancy__ to __Locally-redundant storage (LRS)__.

    :::image type="content" source="./media/tutorial-create-secure-workspace/create-storage.png" alt-text="Image of storage account basic config":::

1. From the __Networking__ tab, select __Private endpoint__ and then select __+ Add private endpoint__.

    :::image type="content" source="./media/tutorial-create-secure-workspace/storage-enable-private-endpoint.png" alt-text="UI to add the blob private network":::

1. On the __Create private endpoint__ form, use the following values:
    * __Subscription__: The same Azure subscription that contains the previous resources you've created.
    * __Resource group__: The same Azure resource group that contains the previous resources you've created.
    * __Location__: The same Azure region that contains the previous resources you've created.
    * __Name__: A unique name for this private endpoint.
    * __Target sub-resource__: blob
    * __Virtual network__: The virtual network you created earlier.
    * __Subnet__: Training (172.17.0.0/24)
    * __Private DNS integration__: Yes
    * __Private DNS Zone__: privatelink.blob.core.windows.net

    Select __OK__ to create the private endpoint.

1. Select __Review + create__. Verify that the information is correct, and then select __Create__.

### Enable private endpoint for file storage

While you created a private endpoint for Blob storage in the previous steps, you must also create one for File storage. Since the UI in the previous steps only allow you to create one private endpoint, use the following steps to add another after the Storage Account has been created.

1. Once the Storage Account has been created, select __Go to resource__. From the left navigation, select __Networking__ the __Private endpoint connections__ tab, and then select __+ Private endpoint__.

    :::image type="content" source="./media/tutorial-create-secure-workspace/storage-file-networking.png" alt-text="UI for storage account networking":::

1. On the __Create a private endpoint__ form, use the same __subscription__, __resource group__, and __Region__ that you have used for previous resources. Enter a unique __Name__.

    :::image type="content" source="./media/tutorial-create-secure-workspace/storage-file-private-endpoint.png" alt-text="UI to add the file private endpoint":::

1. Select __Next : Resource__, and then set __Target sub-resource__ to __file__.

    :::image type="content" source="./media/tutorial-create-secure-workspace/storage-file-private-endpoint-resource.png" alt-text="Add the sub-resource of 'file'":::

1. Select __Next : Configuration__, and then use the following values:
    * __Virtual network__: The network you created previously
    * __Subnet__: Training
    * __Integrate with private DNS zone__: Yes
    * __Private DNS zone__: privatelink.file.core.windows.net

    :::image type="content" source="./media/tutorial-create-secure-workspace/storage-file-private-endpoint-config.png" alt-text="UI to configure the file private endpoint":::

1. Select __Review + Create__. Verify that the information is correct, and then select __Create__.

## Create a key vault

1. In the Azure portal, select the __Home__ link to return to the homepage. Select __+ Create a resource__ and then enter __Key Vault__. Select the __Key Vault__ entry, and then select __Create__.
1. From the __Basics__ tab, select the __subscription__, __resource group__, and __region__ you previously used for the virtual network. Enter a unique __Key vault name__. Leave the other fields at the default value.

    :::image type="content" source="./media/tutorial-create-secure-workspace/create-key-vault.png" alt-text="Create a new key vault":::

1. From the __Networking__ tab, select __Private endpoint__ and then select __+ Add__.

    :::image type="content" source="./media/tutorial-create-secure-workspace/key-vault-networking.png" alt-text="Key vault networking":::

1. On the __Create private endpoint__ form, use the following values:
    * __Subscription__: The same Azure subscription that contains the previous resources you've created.
    * __Resource group__: The same Azure resource group that contains the previous resources you've created.
    * __Location__: The same Azure region that contains the previous resources you've created.
    * __Name__: A unique name for this private endpoint.
    * __Target sub-resource__: Vault
    * __Virtual network__: The virtual network you created earlier.
    * __Subnet__: Training (172.17.0.0/24)
    * __Private DNS integration__: Yes
    * __Private DNS Zone__: privatelink.vaultcore.azure.net

    Select __OK__ to create the private endpoint.

    :::image type="content" source="./media/tutorial-create-secure-workspace/key-vault-private-endpoint.png" alt-text="Configure a key vault private endpoint":::

1. Select __Review + create__. Verify that the information is correct, and then select __Create__.

## Create a container registry

1. In the Azure portal, select the __Home__ link to return to the homepage. Select __+ Create a resource__ and then enter __Container Registry__. Select the __Container Registry__ entry, and then select __Create__.
1. From the __Basics__ tab, select the __subscription__, __resource group__, and __location__ you previously used for the virtual network. Enter a unique __Registry name__ and set the __SKU__ to __Premium__.

    :::image type="content" source="./media/tutorial-create-secure-workspace/create-container-registry.png" alt-text="Create a container registry":::

1. From the __Networking__ tab, select __Private endpoint__ and then select __+ Add__.

    :::image type="content" source="./media/tutorial-create-secure-workspace/container-registry-networking.png" alt-text="Container registry networking":::

1. On the __Create private endpoint__ form, use the following values:
    * __Subscription__: The same Azure subscription that contains the previous resources you've created.
    * __Resource group__: The same Azure resource group that contains the previous resources you've created.
    * __Location__: The same Azure region that contains the previous resources you've created.
    * __Name__: A unique name for this private endpoint.
    * __Target sub-resource__: registry
    * __Virtual network__: The virtual network you created earlier.
    * __Subnet__: Training (172.17.0.0/24)
    * __Private DNS integration__: Yes
    * __Private DNS Zone__: privatelink.azurecr.io

    Select __OK__ to create the private endpoint.

    :::image type="content" source="./media/tutorial-create-secure-workspace/container-registry-private-endpoint.png" alt-text="Configure container registry private endpoint":::

1. Select __Review + create__. Verify that the information is correct, and then select __Create__.
1. After the container registry has been created, select __Go to resource__.

    :::image type="content" source="./media/tutorial-create-secure-workspace/container-registry-go-to-resource.png" alt-text="Select 'go to resource'":::

1. From the left of the page, select __Access keys__, and then enable __Admin user__. This setting is required when using Azure Container Registry inside a virtual network with Azure Machine Learning.

    :::image type="content" source="./media/tutorial-create-secure-workspace/container-registry-admin-user.png" alt-text="Screenshot of admin user toggle":::

## Create a workspace

1. In the Azure portal, select the __Home__ link to return to the homepage. Select __+ Create a resource__ and then enter __Machine Learning__. Select the __Machine Learning__ entry, and then select __Create__.
1. From the __Basics__ tab, select the __subscription__, __resource group__, and __Region__ you previously used for the virtual network. Use the follow values for the other fields:
    * __Workspace name__: A unique name for your workspace.
    * __Storage account__: Select the storage account you created previously.
    * __Key vault__: Select the key vault you created previously.
    * __Application insights__: Use the default value.
    * __Container registry__: Use the container registry you created previously.

    :::image type="content" source="./media/tutorial-create-secure-workspace/create-machine-learning-workspace.png" alt-text="Basic workspace configuration":::

1. From the __Networking__ tab, select __Private endpoint__ and then select __+ add__.

    :::image type="content" source="./media/tutorial-create-secure-workspace/machine-learning-workspace-networking.png" alt-text="Workspace networking":::

1. On the __Create private endpoint__ form, use the following values: 
    * __Subscription__: The same Azure subscription that contains the previous resources you've created.
    * __Resource group__: The same Azure resource group that contains the previous resources you've created.
    * __Location__: The same Azure region that contains the previous resources you've created.
    * __Name__: A unique name for this private endpoint.
    * __Target sub-resource__: amlworkspace
    * __Virtual network__: The virtual network you created earlier.
    * __Subnet__: Training (172.17.0.0/24)
    * __Private DNS integration__: Yes
    * __Private DNS Zone__: Leave the two private DNS zones at the default values of __privatelink.api.azureml.ms__ and __privatelink.notebooks.azure.net__.

    Select __OK__ to create the private endpoint.

    :::image type="content" source="./media/tutorial-create-secure-workspace/machine-learning-workspace-private-endpoint.png" alt-text="Workspace private network config":::

1. Select __Review + create__. Verify that the information is correct, and then select __Create__.

## Create a VPN gateway

In the Azure portal, select the __Home__ link to return to the homepage. Select __+ Create a resource__ and then enter __Virtual network gateway__. Select the __Virtual network gateway__ entry, and then select __Create__.
1. From the __Basics__ tab, select the __subscription__ and __Region__ you used for the virtual network. Use the follow values for the other fields:
    * __Name__: A unique name for your VPN gateway.
    * __Gateway type__: VPN
    * __VPN type__: Route-based
    * __SKU__: VpnGw2
    * __Generation__: Generation2
    * __Virtual network__: Your virtual network.
    * __Gateway subnet address range__: 172.17.2.0/24
    * __Public IP address__: Create new
    * __Public IP address name__: A unique name for the IP address.
    * __Public IP address SKU__: Basic
    * __Assignment__: Dynamic
    * __Enable active-active mode__: Disabled
    * __Configure BGP__: Disabled
1. Select __Review + create__. Verify that the information is correct, and then select __Create__.

    > [!IMPORTANT]
    > It can take up to 45 minutes for the VPN gateway creation process to finish.

### Configure the gateway

Once the VPN gateway creation has completed, use the following steps to enable a __point-to-site__ configuration:

1. To create an authentication certificate, use the __Generate certificates__ section of [Configure a Point-To-Site VPN connection](/vpn-gateway/vpn-gateway-howto-point-to-site-resource-manager-portal.md#generatecert) article.
1. From the portal, select the VPN gateway you created previously. From the left navigation, select __Point-to-site configuration__.
1. Select __Configure now__, and use the following values in the form:
    * __Address pool__: 172.16.201.0/24
    * __Tunnel type__: IKEv2
    * __Authentication type__: Azure certificate
1. When the __Root certificates__ fields appear, enter a unique __Name__ and then paste the contents of the __root certificate__ file you created earlier into the __Public certificate data__ field.

    > [!TIP]
    > If your root certificate file contains `-----BEGIN CERTIFICATE-----` and `-----END CERTIFICATE-----` lines, __do not__ include these lines when pasting into the __root certificate__ field.
1. Select __Save__ to save the configuration.

    > [!TIP]
    > When you navigate away from the point-to-site configuration screen, you may receive an error that your changes will be discarded. Select __OK__. You can then select the configuration again to verify the settings were saved.
1. From the __Point-to-site configuration__, select __Download VPN client__. For more information on configuring a VPN client using this zip, see [Create and install VPN client configuration files](/vpn-gateway/point-to-site-vpn-client-configuration-azure-cert.md).

    > [!TIP]
    > It may take several seconds before the download begins.

## Private IP addresses

To communicate with the resources in the VNet, use the following steps:

1. In the Azure portal, find your resource group.
1. In the resource group, select each of the resources with a type of __Private endpoint__.
1. Select __DNS configuration__ area and copy the __FQDN__ and __IP addresses__ values listed on the page. 

    > [!TIP]
    > In some cases there may be entries in two tables under __Custom DNS records__. Copy all the FQDN and matching IP addresses on the page.

## Configure image builds

When Azure Container Registry is behind the virtual network, Azure Machine Learning can't use it to directly build Docker images. Instead, configure the workspace to use an Azure Machine Learning compute cluster to build images. Use the following steps to create a compute cluster and configure the workspace to use it to build images:

> [!NOTE]
> You can use the same compute cluster to train models.

TBD steps.