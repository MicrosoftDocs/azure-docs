---
title: Create a Private Endpoint for a secure connection
titleSuffix: Azure Cognitive Search
description: Set up a private endpoint in a virtual network for a secure connection to an Azure Cognitive Search service

manager: nitinme
author: mrcarter8
ms.author: mcarter
ms.service: cognitive-search
ms.topic: conceptual
ms.date: 01/13/2020
---

# Create a Private Endpoint for a secure connection to Azure Cognitive Search (Preview)

[Private Endpoints](../private-link/private-endpoint-overview.md) for Azure Cognitive Search allow a client on a virtual network to securely access data in a search index over a [Private Link](../private-link/private-link-overview.md). The private endpoint uses an IP address from the [virtual network address space](../virtual-network/virtual-network-ip-addresses-overview-arm.md#private-ip-addresses) for your search service. Network traffic between the client and the search service traverses over the virtual network and a private link on the Microsoft backbone network, eliminating exposure from the public internet. For a list of other PaaS services that support Private Link, check the [availability section](../private-link/private-link-overview.md#availability) in the product documentation.

> [!Important]
> Private Endpoint support for Azure Cognitive Search is available as a limited-access preview and not currently intended for production use. Please fill out and submit the [access request form](https://aka.ms/SearchPrivateLinkRequestAccess) if you would like to access the preview. The form requests information about you, your company, and general application architecture. Once we review your request, you'll receive a confirmation email with additional instructions.
>
> Once you are granted access to the preview, you'll be able to configure Private Endpoints for your service using the Azure portal and REST API version [2019-10-06-Preview](search-api-preview.md).
>   

Private endpoints for your search service enables you to:

- Block all connections on the public endpoint for your search service.
- Increase security for the virtual network, by enabling you to block exfiltration of data from the virtual network.
- Securely connect to your search service from on-premises networks that connect to the virtual network using [VPN](../vpn-gateway/vpn-gateway-about-vpngateways.md) or [ExpressRoutes](../expressroute/expressroute-locations.md) with private-peering.

> [!NOTE]
> There are currently some limitations in the preview that you should be aware of:
> * Available only for search services on the **Basic** tier. 
> * Available in the West US 2, West Central US, East US, South Central US, Australia East, and Australia Southeast regions.
> * When the service endpoint is private, some portal features are disabled. You'll be able to view and manage service level information, but portal access to index data and the various components in the service, such as the index, indexer, and skillset definitions, is restricted for security reasons.
> * When the service endpoint is private, you must use the search API to upload documents to the index.
> * You must use the following link to see the private endpoint support option in the Azure portal: https://portal.azure.com/?feature.enablePrivateEndpoints=true

In this article, you'll learn how to use the portal to create a new Azure Cognitive Search service instance that can't be accessed via a public IP address, configure an Azure virtual machine in the same virtual network, and use it to access the search service via a private endpoint.


## Create a VM
In this section, you will create a virtual network and subnet to host the VM that will be used to access your search service's private endpoint.

### Create the virtual network

1. From the Azure portal home tab, select **Create a resource** > **Networking** > **Virtual network**.

1. In **Create virtual network**, enter or select this information:

    | Setting | Value |
    | ------- | ----- |
    | Name | Enter *MyVirtualNetwork* |
    | Address space | Enter *10.1.0.0/16* |
    | Subscription | Select your subscription|
    | Resource group | Select **Create new**, enter *myResourceGroup*, then select **OK** |
    | Location | Select **West US** or whatever region you are using|
    | Subnet - Name | Enter *mySubnet* |
    | Subnet - Address range | Enter *10.1.0.0/24* |
    |||

1. Leave the rest as default and select **Create**.


## Create your search service with a private endpoint

In this section, you will create a new Azure Cognitive Search service with a Private Endpoint. 

1. On the upper-left side of the screen in the Azure portal, select **Create a resource** > **Web** > **Azure Cognitive Search**.

1. In **New Search Service - Basics**, enter or select this information:

    | Setting | Value |
    | ------- | ----- |
    | **PROJECT DETAILS** | |
    | Subscription | Select your subscription. |
    | Resource group | Select **myResourceGroup**. You created this in the previous section.|
    | **INSTANCE DETAILS** |  |
    | URL | Enter a unique name. |
    | Location | Select the region that you specified when requesting access to this preview feature. |
    | Pricing tier | Select **Change Pricing Tier** and choose **Basic**. This tier is required for the preview. |
    |||
  
1. Select **Next: Scale**.

1. Leave the values as default and select **Next: Networking**.

1. In **New Search Service - Networking**, select **Private** for **Endpoint connectivity(data)**.

1. In **New Search Service - Networking**, select **+ Add** under **Private endpoint**. 

1. In **Create Private Endpoint**, enter or select this information:

    | Setting | Value |
    | ------- | ----- |
    | Subscription | Select your subscription. |
    | Resource group | Select **myResourceGroup**. You created this in the previous section.|
    | Location | Select **West US**.|
    | Name | Enter *myPrivateEndpoint*.  |
    | Target sub-resource | Leave the default **searchService**. |
    | **NETWORKING** |  |
    | Virtual network  | Select *MyVirtualNetwork* from resource group *myResourceGroup*. |
    | Subnet | Select *mySubnet*. |
    | **PRIVATE DNS INTEGRATION** |  |
    | Integrate with private DNS zone  | Leave the default **Yes**. |
    | Private DNS zone  | Leave the default ** (New) privatelink.search.windows.net**. |
    |||

1. Select **OK**. 

1. Select **Review + create**. You're taken to the **Review + create** page where Azure validates your configuration. 

1. When you see the **Validation passed** message, select **Create**. 

1. Once provisioning of your new service is complete, browse to the resource that you just created.

1. Select **Keys** from the left content menu.

1. Copy the **Primary admin key** for later.

### Create a virtual machine

1. On the upper-left side of the screen in the Azure portal, select **Create a resource** > **Compute** > **Virtual machine**.

1. In **Create a virtual machine - Basics**, enter or select this information:

    | Setting | Value |
    | ------- | ----- |
    | **PROJECT DETAILS** | |
    | Subscription | Select your subscription. |
    | Resource group | Select **myResourceGroup**. You created this in the previous section.  |
    | **INSTANCE DETAILS** |  |
    | Virtual machine name | Enter *myVm*. |
    | Region | Select **West US** or whatever region you are using. |
    | Availability options | Leave the default **No infrastructure redundancy required**. |
    | Image | Select **Windows Server 2019 Datacenter**. |
    | Size | Leave the default **Standard DS1 v2**. |
    | **ADMINISTRATOR ACCOUNT** |  |
    | Username | Enter a username of your choosing. |
    | Password | Enter a password of your choosing. The password must be at least 12 characters long and meet the [defined complexity requirements](../virtual-machines/windows/faq.md?toc=%2fazure%2fvirtual-network%2ftoc.json#what-are-the-password-requirements-when-creating-a-vm).|
    | Confirm Password | Reenter password. |
    | **INBOUND PORT RULES** |  |
    | Public inbound ports | Leave the default **Allow selected ports**. |
    | Select inbound ports | Leave the default **RDP (3389)**. |
    | **SAVE MONEY** |  |
    | Already have a Windows license? | Leave the default **No**. |
    |||

1. Select **Next: Disks**.

1. In **Create a virtual machine - Disks**, leave the defaults and select **Next: Networking**.

1. In **Create a virtual machine - Networking**, select this information:

    | Setting | Value |
    | ------- | ----- |
    | Virtual network | Leave the default **MyVirtualNetwork**.  |
    | Address space | Leave the default **10.1.0.0/24**.|
    | Subnet | Leave the default **mySubnet (10.1.0.0/24)**.|
    | Public IP | Leave the default **(new) myVm-ip**. |
    | Public inbound ports | Select **Allow selected ports**. |
    | Select inbound ports | Select **HTTP** and **RDP**.|
    ||

1. Select **Review + create**. You're taken to the **Review + create** page where Azure validates your configuration.

1. When you see the **Validation passed** message, select **Create**. 


## Connect to a VM from the internet

Connect to the VM *myVm* from the internet as follows:

1. In the portal's search bar, enter *myVm*.

1. Select the **Connect** button. After selecting the **Connect** button, **Connect to virtual machine** opens.

1. Select **Download RDP File**. Azure creates a Remote Desktop Protocol (*.rdp*) file and downloads it to your computer.

1. Open the downloaded.rdp* file.

    1. If prompted, select **Connect**.

    1. Enter the username and password you specified when creating the VM.

        > [!NOTE]
        > You may need to select **More choices** > **Use a different account**, to specify the credentials you entered when you created the VM.

1. Select **OK**.

1. You may receive a certificate warning during the sign-in process. If you receive a certificate warning, select **Yes** or **Continue**.

1. Once the VM desktop appears, minimize it to go back to your local desktop.  


## Access the search service privately from the VM

In this section, you will verify private network access to the search service and connect privately to the using the Private Endpoint.

1. In the Remote Desktop of *myVM*, open PowerShell.

1. Enter 'nslookup [search service name].search.windows.net'

    You'll receive a message similar to this:
    ```azurepowershell
    Server:  UnKnown
    Address:  168.63.129.16
    Non-authoritative answer:
    Name:    [search service name].privatelink.search.windows.net
    Address:  10.0.0.5
    Aliases:  [search service name].search.windows.net
    ```
1. Follow this [Quickstart](search-get-started-postman.md) from the VM to create a new search index in your service in Postman using the REST API.  Use the key you copied in a previous step to authenticate to the service.

1. Try several of these same requests in Postman on your local workstation.

1. If you are able to complete the Quickstart from the VM, but receive an error that the remote server does not exist on your local workstation, you have successfully configured a private endpoint for your search service.

1. Close the remote desktop connection to *myVM*. 


## Clean up resources 
When you're done using the Private Endpoint, search service, and the VM, delete the resource group and all of the resources it contains:
1. Enter *myResourceGroup* in the **Search** box at the top of the portal and select *myResourceGroup* from the search results. 
1. Select **Delete resource group**. 
1. Enter *myResourceGroup* for **TYPE THE RESOURCE GROUP NAME** and select **Delete**.

## Next steps
In this article, you created a VM on a virtual network and a search service with a Private Endpoint. You connected to the VM from the internet and securely communicated to the search service using Private Link. To learn more about Private Endpoint, see [What is Azure Private Endpoint?](../private-link/private-endpoint-overview.md).
