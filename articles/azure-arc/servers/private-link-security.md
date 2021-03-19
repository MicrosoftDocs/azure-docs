---
title: Use Azure Private Link to securely connect networks to Azure Arc enabled servers
description: Use Azure Private Link to securely connect networks to Azure Arc enabled servers
ms.topic: conceptual
ms.date: 03/19/2021
---

# Use Azure Private Link to securely connect networks to Azure Arc enabled servers

[Azure Private Link](../../private-link/private-link-overview.md) allows you to securely link Azure PaaS services to your virtual network using private endpoints. For many services, you just set up an endpoint per resource. This means you can connect your on-premises or multi-cloud servers with Azure Arc and send all traffic over an Express Route or site-to-site VPN connection instead of using public networks. Azure Arc uses a Private Link Scope model to allow multiple servers to communicate with their Azure Arc resources using a single private endpoint. This article covers when to use and how to set up an Azure Arc Private Link Scope (preview). This is available in all commercial cloud regions, it is not available in the US Government cloud today.

## Planning your Private Link setup

To connect your server to Azure Arc over a private link, you need to configure your network to accomplish the following:

1. Establish a connection between your on-premises network and an Azure virtual network using a [site-to-site VPN](../../vpn-gateway/tutorial-site-to-site-portal.md) or [Express Route circuit](../../expressroute/expressroute-howto-linkvnet-arm.md).

1. Deploy an Azure Arc Private Link Scope, which controls which servers can communicate with Azure Arc over private endpoints and associate it with your Azure virtual network using a private endpoint.

1. Update the DNS configuration on your local network to resolve the private endpoint addresses.

1. Configure your local firewall to allow access to Azure Active Directory and Azure Resource Manager. This is a temporary step and will not be required when private endpoints for these services enter preview.

1. Associate the servers registered with Azure Arc enabled servers with the private link scope.

1. Optionally, deploy private endpoints for other Azure services your server is managed with, such as Azure Monitor or Azure Automation.

This article assumes you have already set up your Express Route circuit or site-to-site VPN connection.

![Diagram of basic resource topology](./media/private-link-security/private-link-basic-topology.png)

## Network configuration

Azure Arc enabled servers integrates with several Azure services to bring cloud management and governance to your hybrid servers. Most of these services already offer private endpoints, but you need to configure your firewall and routing rules to allow access to Azure Active Directory and Azure Resource Manager over the Internet until these services offer private endpoints.

There are two ways you can achieve this:

1. If your network is configured to route all Internet-bound traffic through the Azure VPN or Express Route circuit, you can configure the network security group associated with your subnet in Azure to allow outbound TCP 443 (HTTPS) access to Azure AD and Azure using [service tags](../../virtual-network/service-tags-overview.md). The NSG rules should look like the following:

    |Setting |Azure AD rule | Azure rule |
    |--------|--------------|-----------------------------|
    |Source |Virtual network |Virtual network |
    |Source port ranges |* |* |
    |Destination |Service Tag |Service Tag |
    |Destination service tag |AzureActiveDirectory |AzureResourceManager |
    |Destination port ranges |443 |443 |
    |Protocol |Tcp |Tcp |
    |Action |Allow |Allow |
    |Priority |150 (must be lower than any rules that block Internet access) |151 (must be lower than any rules that block Internet access) |
    |Name |AllowAADOutboundAccess |AllowAzOutboundAccess |

1. Configure the firewall on your local network to allow outbound TCP 443 (HTTPS) access to Azure AD and Azure using the downloadable service tag files. The JSON file contains all the public IP address ranges used by Azure AD and Azure and is updated monthly to reflect any changes. Azure ADs service tag is `AzureActiveDirectory` and Azure's service tag is `AzureResourceManager`. You need to consult with your network admin and network firewall vendor to learn how to configure your firewall rules.

See the visual diagram under the section [How it works](#how-it-works) for the network traffic flows.

## Create a Private Link Scope

1. Go to **Create a resource** in the Azure portal and search for **Azure Arc Private Link Scope**.

   ![Find Azure Monitor Private Link Scope](./media/private-link-security/ampls-find-1c.png)

1. Select **create**.
1. Pick a Subscription and Resource Group. During the preview, your virtual network and Azure Arc enabled servers must be in the same subscription as the Private Link Scope.
1. Give the Azure Arc Private Link Scope a name. It's best to use a meaningful and clear name.

   You can optionally require every Arc enabled server associated with this Azure Arc Private Link Scope to send data to the service through the private endpoint. If you select **Enable public network access**, servers associated with this Azure Arc Private Link Scope can communicate with the service over both private or public networks. You can change this setting after creating the scope if you change your mind.

1. Select **Review + Create**.

   ![Create Azure Monitor Private Link Scope](./media/private-link-security/ampls-create-1d.png)

1. Let the validation pass, and then select **Create**.

## Create a private endpoint

Once your Azure Arc Private Link Scope is created, you need to connect it with one or more virtual networks using a private endpoint. The private endpoint exposes access to the Azure Arc services on a private IP in your virtual network address space.

1. In your scope resource, select **Private Endpoint connections** in the left-hand resource menu. Select **Private Endpoint** to start the endpoint create process. You can also approve connections that were started in the Private Link center here by selecting them and selecting **Approve**.

1. Pick the subscription, resource group, and name of the endpoint, and the region it should live in. The region needs to be the same region as the VNet you connect it to.

1. Select **Next: Resource**.

1. On the **Resource** page,

   a. Pick the **Subscription** that contains your Azure Arc Private Link Scope resource.

   b. For **resource type**, choose **Microsoft.HybridCompute/privateLinkScopes**.

   c. From the **resource** drop-down, choose your Private Link scope you created earlier.

   d. Select **Next: Configuration >**.
      ![Screenshot of select Create Private Endpoint](./media/private-link-security/ampls-select-private-endpoint-create-4.png)

1. On the **Configuration** page,

   a. Choose the **virtual network** and **subnet** that you want to connect to your Azure Monitor resources. 

   b. Choose **Yes** for **Integrate with private DNS zone**, and let it automatically create a new Private DNS Zone. The actual DNS zones may be different from what is shown in the screenshot below.

     > [!NOTE]
     > If you choose **No** and prefer to manage DNS records manually, first complete setting up your Private Link - including this Private Endpoint and the AMPLS configuration. Then, configure your DNS according to the instructions in [Azure Private Endpoint DNS configuration](../../private-link/private-endpoint-dns.md). Make sure not to create empty records as preparation for your Private Link setup. The DNS records you create can override existing settings and impact your connectivity with Azure Monitor.

   c.    Select **Review + create**.

   d.    Let validation pass. 

   e.    Select **Create**. 

    ![Screenshot of select Private Endpoint details.](./media/private-link-security/ampls-select-private-endpoint-create-5.png)

## Configure on-premises DNS forwarding

Your on-premises servers need to be able to resolve the private link DNS records to the private endpoint IP addresses. How you configure this depends on whether you’re using Azure private DNS zones to maintain DNS records, or if you’re using your own DNS server on-premises and how many servers you’re configuring.

### DNS configuration using Azure-integrated private DNS zones

If you set up private DNS zones for Azure Arc and Guest Configuration when creating the private endpoint, your on-premises servers need to be able to forward DNS queries to the built-in Azure DNS servers to resolve the private endpoint addresses correctly. You will need a DNS forwarder in Azure (purpose-built VM or an Azure Firewall instance with DNS proxy enabled), after which you can configure your on-premises DNS server to forward queries to Azure to resolve private endpoint IPs.
The private endpoint docs provide guidance for configuring on-premises workloads using a DNS forwarder.
