---
title: Create a Private Endpoint for a secure connection
titleSuffix: Azure AI Search
description: Set up a private endpoint in a virtual network for a secure connection to an Azure AI Search service.
author: HeidiSteen
ms.author: heidist
manager: nitinme
ms.service: cognitive-search
ms.topic: conceptual
ms.date: 09/12/2022
---

# Create a Private Endpoint for a secure connection to Azure AI Search

In this article, you'll learn how to secure an Azure AI Search service so that it can't be accessed over the internet:

+ [Create an Azure virtual network](#create-the-virtual-network) (or use an existing one)
+ [Create a search service to use a private endpoint](#create-a-search-service-with-a-private-endpoint)
+ [Create an Azure virtual machine in the same virtual network](#create-a-virtual-machine)
+ [Connect to search using a browser session on the virtual machine](#connect-to-the-vm)

Private endpoints are provided by [Azure Private Link](../private-link/private-link-overview.md), as a separate billable service. For more information about costs, see the [pricing page](https://azure.microsoft.com/pricing/details/private-link/).

You can create a private endpoint in the Azure portal, as described in this article. Alternatively, you can use the [Management REST API version](/rest/api/searchmanagement/), [Azure PowerShell](/powershell/module/az.search), or [Azure CLI](/cli/azure/search).

> [!NOTE]
> Once a search service has a private endpoint, portal access to that service must be initiated from a browser session on a virtual machine inside the virtual network. See [this step](#portal-access-private-search-service) for details.

## Why use a Private Endpoint for secure access?

[Private Endpoints](../private-link/private-endpoint-overview.md) for Azure AI Search allow a client on a virtual network to securely access data in a search index over a [Private Link](../private-link/private-link-overview.md). The private endpoint uses an IP address from the [virtual network address space](../virtual-network/ip-services/private-ip-addresses.md) for your search service. Network traffic between the client and the search service traverses over the virtual network and a private link on the Microsoft backbone network, eliminating exposure from the public internet. For a list of other PaaS services that support Private Link, check the [availability section](../private-link/private-link-overview.md#availability) in the product documentation.

Private endpoints for your search service enable you to:

+ Block all connections on the public endpoint for your search service.
+ Increase security for the virtual network, by enabling you to block exfiltration of data from the virtual network.
+ Securely connect to your search service from on-premises networks that connect to the virtual network using [VPN](../vpn-gateway/vpn-gateway-about-vpngateways.md) or [ExpressRoutes](../expressroute/expressroute-locations.md) with private-peering.

## Create the virtual network

In this section, you'll create a virtual network and subnet to host the VM that will be used to access your search service's private endpoint.

1. From the Azure portal home tab, select **Create a resource** > **Networking** > **Virtual network**.

1. In **Create virtual network**, enter or select the following values:

    | Setting | Value |
    | ------- | ----- |
    | Subscription | Select your subscription.|
    | Resource group | Select **Create new**, enter a name, such as "myResourceGroup", then select **OK**. |
    | Name | Enter a name, such as "MyVirtualNetwork". |
    | Region | Select a region. |

1. Accept the defaults for the rest of the settings. Select **Review + create** and then **Create**.

## Create a search service with a private endpoint

In this section, you'll create a new Azure AI Search service with a Private Endpoint.

1. On the upper-left side of the screen in the Azure portal, select **Create a resource** > **Web** > **Azure AI Search**.

1. In **New Search Service - Basics**, enter or select the following values:

    | Setting | Value |
    | ------- | ----- |
    | **PROJECT DETAILS** | |
    | Subscription | Select your subscription. |
    | Resource group | Use the resource group that you created in the previous step.|
    | **INSTANCE DETAILS** |  |
    | URL | Enter a unique name. |
    | Location | Select your region. |
    | Pricing tier | Select **Change Pricing Tier** and choose your desired service tier. Private endpoints aren't supported on the  **Free** tier. You must select **Basic** or higher. |
  
1. Select **Next: Scale**.

1. Accept the defaults and select **Next: Networking**.

1. In **New Search Service - Networking**, select **Private** for **Endpoint connectivity(data)**.

1. Select **+ Add** under **Private endpoint**. 

1. In **Create Private Endpoint**, enter or select values that associate your search service with the virtual network you created:

    | Setting | Value |
    | ------- | ----- |
    | Subscription | Select your subscription. |
    | Resource group | Use the resource group that you created in the previous step. |
    | Location | Select a region. |
    | Name | Enter a name, such as "myPrivateEndpoint".  |
    | Target subresource | Accept the default **searchService**. |
    | **NETWORKING** |  |
    | Virtual network  | Select the virtual network you created in the previous step. |
    | Subnet | Select the default. |
    | **PRIVATE DNS INTEGRATION** |  |
    | Integrate with private DNS zone  | Accept the default "Yes". |
    | Private DNS zone  | Accept the default **(New) privatelink.search.windows.net**. |

1. Select **OK**. 

1. Select **Review + create**. You're taken to the **Review + create** page where Azure validates your configuration. 

1. When you see the **Validation passed** message, select **Create**. 

1. Once provisioning of your new service is complete, browse to the resource that you created.

1. Select **Keys** from the left content menu.

1. Copy the **Primary admin key** for later, when connecting to the service.

<a id="create-virtual-machine-private-endpoint"></a>

## Create a virtual machine

1. On the upper-left side of the screen in the Azure portal, select **Create a resource** > **Compute** > **Virtual machine**.

1. In **Create a virtual machine - Basics**, enter or select the following values:

    | Setting | Value |
    | ------- | ----- |
    | **PROJECT DETAILS** | |
    | Subscription | Select your subscription. |
    | Resource group | Use the resource group that you created in the previous section.|
    | **INSTANCE DETAILS** |  |
    | Virtual machine name | Enter a name, such as "my-vm". |
    | Region | Select your region. |
    | Availability options | You can choose **No infrastructure redundancy required**, or select another option if you need the functionality. |
    | Image | Select **Windows Server 2022 Datacenter: Azure Edition - Gen2**. |
    | VM architecture | Accept the default **x64**. |
    | Size | Accept the default **Standard D2S v3**. |
    | **ADMINISTRATOR ACCOUNT** |  |
    | Username | Enter the user name of the administrator. Use an account that's valid for your Azure subscription. You'll want to sign in to the Azure portal from the VM so that you can manage your search service. |
    | Password | Enter the account password. The password must be at least 12 characters long and meet the [defined complexity requirements](../virtual-machines/windows/faq.yml?toc=%2fazure%2fvirtual-network%2ftoc.json#what-are-the-password-requirements-when-creating-a-vm-).|
    | Confirm Password | Reenter password. |
    | **INBOUND PORT RULES** |  |
    | Public inbound ports | Accept the default **Allow selected ports**. |
    | Select inbound ports | Accept the default **RDP (3389)**. |

1. Select **Next: Disks**.

1. In **Create a virtual machine - Disks**, accept the defaults and select **Next: Networking**.

1. In **Create a virtual machine - Networking**, provide the following values:

    | Setting | Value |
    | ------- | ----- |
    | Virtual network | Select the virtual network you created in a previous step. |
    | Subnet | Accept the default (10.1.0.0/24).|
    | NIC network security group | Accept the default "Basic" |
    | Public IP | Accept the default "(new) myVm-ip". |
    | Public inbound ports | Select the default "Allow selected ports". |
    | Select inbound ports | Select "HTTP 80", "HTTPS (443)" and "RDP (3389)".|

   > [!NOTE]
   > IPv4 addresses can be expressed in [CIDR](https://en.wikipedia.org/wiki/Classless_Inter-Domain_Routing) format. Remember to avoid the IP range reserved for private networking, as described in [RFC 1918](https://tools.ietf.org/html/rfc1918):
   >
   > + `10.0.0.0 - 10.255.255.255  (10/8 prefix)`
   > + `172.16.0.0 - 172.31.255.255  (172.16/12 prefix)`
   > + `192.168.0.0 - 192.168.255.255 (192.168/16 prefix)`

1. Select **Review + create** for a validation check.

1. When you see the **Validation passed** message, select **Create**. 

## Connect to the VM

Download and then connect to the virtual machine as follows:

1. In the portal's search bar, search for the virtual machine created in the previous step.

1. Select **Connect**. After selecting the **Connect** button, **Connect to virtual machine** opens.

1. Select **Download RDP File**. Azure creates a Remote Desktop Protocol (`.rdp`) file and downloads it to your computer.

1. Open the downloaded `.rdp` file.

    1. If prompted, select **Connect**.

    1. Enter the username and password you specified when creating the VM.

        > [!NOTE]
        > You may need to select **More choices** > **Use a different account**, to specify the credentials you entered when you created the VM.

1. Select **OK**.

1. You may receive a certificate warning during the sign-in process. If you receive a certificate warning, select **Yes** or **Continue**.

1. Once the VM desktop appears, minimize it to go back to your local desktop.  

## Test connections

In this section, you'll verify private network access to the search service and connect privately to the using the Private Endpoint.

When the search service endpoint is private, some portal features are disabled. You'll be able to view and manage service level settings, but portal access to index data and various other components in the service, such as the index, indexer, and skillset definitions, is restricted for security reasons.

1. In the Remote Desktop of *myVM*, open PowerShell.

1. Enter `nslookup [search service name].search.windows.net`.

    You'll receive a message similar to this:

    ```
    Server:  UnKnown
    Address:  168.63.129.16
    Non-authoritative answer:
    Name:    [search service name].privatelink.search.windows.net
    Address:  10.0.0.5
    Aliases:  [search service name].search.windows.net
    ```

1. From the VM, connect to the search service and create an index. You can follow this [quickstart](search-get-started-rest.md) to create a new search index in your service using the REST API. Setting up requests from a Web API test tool requires the search service endpoint (https://[search service name].search.windows.net) and the admin api-key you copied in a previous step.

1. Completing the quickstart from the VM is your confirmation that the service is fully operational.

1. Close the remote desktop connection to *myVM*. 

1. To verify that your service isn't accessible on a public endpoint, open Postman on your local workstation and attempt the first several tasks in the quickstart. If you receive an error that the remote server doesn't exist, you've successfully configured a private endpoint for your search service.

<a id="portal-access-private-search-service"></a>

## Use the Azure portal to access a private search service

When the search service endpoint is private, some portal features are disabled. You can view and manage service level information, but index, indexer, and skillset information is hidden for security reasons. 

To work around this restriction, connect to Azure portal from a browser on a virtual machine inside the virtual network. The portal uses the private endpoint on the connection and gives you visibility into content and operations.

1. Follow the [steps to provision a VM that can access the search service through a private endpoint](#create-virtual-machine-private-endpoint).

1. On a virtual machine in your virtual network, open a browser and sign in to the Azure portal. The portal will use the private endpoint attached to the virtual machine to connect to your search service.

## Clean up resources

When you're working in your own subscription, it's a good idea at the end of a project to identify whether you still need the resources you created. Resources left running can cost you money.

You can delete individual resources or the resource group to delete everything you created in this exercise. Select the resource group on any resource's overview page, and then select **Delete**.

## Next steps

In this article, you created a VM on a virtual network and a search service with a Private Endpoint. You connected to the VM from the internet and securely communicated to the search service using Private Link. To learn more about Private Endpoint, see [What is Azure Private Endpoint?](../private-link/private-endpoint-overview.md).
