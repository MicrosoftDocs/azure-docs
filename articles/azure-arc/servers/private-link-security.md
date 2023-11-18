---
title: Use Azure Private Link to securely connect servers to Azure Arc
description: Learn how to use Azure Private Link to securely connect networks to Azure Arc.
ms.topic: conceptual
ms.custom: devx-track-linux
ms.date: 06/20/2023
---

# Use Azure Private Link to securely connect servers to Azure Arc

[Azure Private Link](../../private-link/private-link-overview.md) allows you to securely link Azure PaaS services to your virtual network using private endpoints. For many services, you just set up an endpoint per resource. This means you can connect your on-premises or multicloud servers with Azure Arc and send all traffic over an Azure [ExpressRoute](../../expressroute/expressroute-introduction.md) or site-to-site [VPN connection](../../vpn-gateway/vpn-gateway-about-vpngateways.md) instead of using public networks.

Starting with Azure Arc-enabled servers, you can use a Private Link Scope model to allow multiple servers or machines to communicate with their Azure Arc resources using a single private endpoint.

This article covers when to use and how to set up an Azure Arc Private Link Scope.

## Advantages

With Private Link you can:

- Connect privately to Azure Arc without opening up any public network access.
- Ensure data from the Azure Arc-enabled machine or server is only accessed through authorized private networks. This also includes data from [VM extensions](manage-vm-extensions.md) installed on the machine or server that provide post-deployment management and monitoring support.
- Prevent data exfiltration from your private networks by defining specific Azure Arc-enabled servers and other Azure services resources, such as Azure Monitor, that connects through your private endpoint.
- Securely connect your private on-premises network to Azure Arc using ExpressRoute and Private Link.
- Keep all traffic inside the Microsoft Azure backbone network.

For more information, see  [Key Benefits of Private Link](../../private-link/private-link-overview.md#key-benefits).

## How it works

Azure Arc Private Link Scope connects private endpoints (and the virtual networks they're contained in) to an Azure resource, in this case Azure Arc-enabled servers. When you enable any one of the Azure Arc-enabled servers supported VM extensions, such as Azure Automation Update Management or Azure Monitor, those resources connect other Azure resources. Such as:

- Log Analytics workspace, required for Azure Automation Update Management, Azure Automation Change Tracking and Inventory, Azure Monitor VM insights, and Azure Monitor log collection with Log Analytics agent.
- Azure Automation account, required for Update Management and Change Tracking and Inventory.
- Azure Key Vault
- Azure Blob storage, required for Custom Script Extension.

:::image type="content" source="./media/private-link-security/private-link-topology.png" alt-text="Diagram of basic resource topology" border="true":::

Connectivity to any other Azure resource from an Azure Arc-enabled server requires configuring Private Link for each service, which is optional, but recommended. Azure Private Link requires separate configuration per service.

For more information about configuring Private Link for the Azure services listed earlier, see the [Azure Automation](../../automation/how-to/private-link-security.md), [Azure Monitor](../../azure-monitor/logs/private-link-security.md), [Azure Key Vault](../../key-vault/general/private-link-service.md), or [Azure Blob storage](../../private-link/tutorial-private-endpoint-storage-portal.md) articles.

> [!IMPORTANT]
> Azure Private Link is now generally available. Both Private Endpoint and Private Link service (service behind standard load balancer) are generally available. Different Azure PaaS onboard to Azure Private Link following different schedules. See [Private Link availability](../../private-link/availability.md) for an updated status of Azure PaaS on Private Link. For known limitations, see [Private Endpoint](../../private-link/private-endpoint-overview.md#limitations) and [Private Link Service](../../private-link/private-link-service-overview.md#limitations).

* The Private Endpoint on your VNet allows it to reach Azure Arc-enabled servers endpoints through private IPs from your network's pool, instead of using to the public IPs of these endpoints. That allows you to keep using your Azure Arc-enabled servers resource without opening your VNet to outbound traffic not requested.

* Traffic from the Private Endpoint to your resources will go over the Microsoft Azure backbone, and not routed to public networks.

* You can configure each of your components to allow or deny ingestion and queries from public networks. That provides a resource-level protection, so that you can control traffic to specific resources.

## Restrictions and limitations

The Azure Arc-enabled servers Private Link Scope object has a number of limits you should consider when planning your Private Link setup.

- You can associate at most one Azure Arc Private Link Scope with a virtual network.
- An Azure Arc-enabled machine or server resource can only connect to one Azure Arc-enabled servers Private Link Scope.
- All on-premises machines need to use the same private endpoint by resolving the correct private endpoint information (FQDN record name and private IP address) using the same DNS forwarder. For more information, see [Azure Private Endpoint DNS configuration](../../private-link/private-endpoint-dns.md)
- The Azure Arc-enabled server and Azure Arc Private Link Scope must be in the same Azure region. The Private Endpoint and the virtual network must also be in the same Azure region, but this region can be different from that of your Azure Arc Private Link Scope and Arc-enabled server.
- Network traffic to Microsoft Entra ID and Azure Resource Manager does not traverse the Azure Arc Private Link Scope and will continue to use your default network route to the internet. You can optionally [configure a resource management private link](../../azure-resource-manager/management/create-private-link-access-portal.md) to send Azure Resource Manager traffic to a private endpoint.
- Other Azure services that you will use, for example Azure Monitor, requires their own private endpoints in your virtual network.
- Remote access to the server using Windows Admin Center or SSH is not supported over private link at this time.

## Planning your Private Link setup

To connect your server to Azure Arc over a private link, you need to configure your network to accomplish the following:

1. Establish a connection between your on-premises network and an Azure virtual network using a [site-to-site VPN](../../vpn-gateway/tutorial-site-to-site-portal.md) or [ExpressRoute circuit](../../expressroute/expressroute-howto-linkvnet-arm.md).

1. Deploy an Azure Arc Private Link Scope, which controls which machines or servers can communicate with Azure Arc over private endpoints and associate it with your Azure virtual network using a private endpoint.

1. Update the DNS configuration on your local network to resolve the private endpoint addresses.

1. Configure your local firewall to allow access to Microsoft Entra ID and Azure Resource Manager.

1. Associate the machines or servers registered with Azure Arc-enabled servers with the private link scope.

1. Optionally, deploy private endpoints for other Azure services your machine or server is managed by, such as:

    - Azure Monitor
    - Azure Automation
    - Azure Blob storage
    - Azure Key Vault

This article assumes you have already set up your ExpressRoute circuit or site-to-site VPN connection.

## Network configuration

Azure Arc-enabled servers integrate with several Azure services to bring cloud management and governance to your hybrid machines or servers. Most of these services already offer private endpoints, but you need to configure your firewall and routing rules to allow access to Microsoft Entra ID and Azure Resource Manager over the internet until these services offer private endpoints.

There are two ways you can achieve this:

- If your network is configured to route all internet-bound traffic through the Azure VPN or ExpressRoute circuit, you can configure the network security group (NSG) associated with your subnet in Azure to allow outbound TCP 443 (HTTPS) access to Microsoft Entra ID and Azure using [service tags](../../virtual-network/service-tags-overview.md). The NSG rules should look like the following:

    |Setting |Microsoft Entra ID rule | Azure rule |
    |--------|--------------|-----------------------------|
    |Source |Virtual network |Virtual network |
    |Source port ranges |* |* |
    |Destination |Service Tag |Service Tag |
    |Destination service tag |AzureActiveDirectory |AzureResourceManager |
    |Destination port ranges |443 |443 |
    |Protocol |Tcp |Tcp |
    |Action |Allow |Allow |
    |Priority |150 (must be lower than any rules that block internet access) |151 (must be lower than any rules that block internet access) |
    |Name |AllowAADOutboundAccess |AllowAzOutboundAccess |

- Configure the firewall on your local network to allow outbound TCP 443 (HTTPS) access to Microsoft Entra ID and Azure using the downloadable service tag files. The [JSON file](https://www.microsoft.com/en-us/download/details.aspx?id=56519) contains all the public IP address ranges used by Microsoft Entra ID and Azure and is updated monthly to reflect any changes. Azure AD's service tag is `AzureActiveDirectory` and Azure's service tag is `AzureResourceManager`. Consult with your network administrator and network firewall vendor to learn how to configure your firewall rules.

See the visual diagram under the section [How it works](#how-it-works) for the network traffic flows.

## Create a Private Link Scope

1. Sign in to the [Azure portal](https://portal.azure.com).

1. Go to **Create a resource** in the Azure portal and search for **Azure Arc Private Link Scope**. Or you can use the following link to open the [Azure Arc Private Link Scope](https://portal.azure.com/#blade/HubsExtension/BrowseResource/resourceType/Microsoft.HybridCompute%2FprivateLinkScopes) page in the portal.

    :::image type="content" source="./media/private-link-security/private-scope-home.png" lightbox="./media/private-link-security/private-scope-home.png" alt-text="Screenshot of private scope home page with Create button." border="true":::

1. Select **Create**.

1. In the **Basics** tab, select a Subscription and Resource Group.

1. Enter a name for the Azure Arc Private Link Scope. It's best to use a meaningful and clear name.

   Optionally, you can require every Azure Arc-enabled machine or server associated with this Azure Arc Private Link Scope to send data to the service through the private endpoint. To do so, check the box for **Allow public network access** so machines or servers associated with this Azure Arc Private Link Scope can communicate with the service over both private or public networks. You can change this setting after creating the scope if you change your mind.

1. Select the **Private endpoint** tab, then select **Create**.
1. In the **Create private endpoint** window:
    1. Enter a **Name** for the endpoint.

    1. Choose **Yes** for **Integrate with private DNS zone**, and let it automatically create a new Private DNS Zone.
    
         > [!NOTE]
         > If you choose **No** and prefer to manage DNS records manually, first complete setting up your Private Link - including this Private Endpoint and the Private Scope configuration. Then, configure your DNS according to the instructions in [Azure Private Endpoint DNS configuration](../../private-link/private-endpoint-dns.md). Make sure not to create empty records as preparation for your Private Link setup. The DNS records you create can override existing settings and impact your connectivity with Azure Arc-enabled servers.

    1. Select **OK**.

1. Select **Review + Create**.

    :::image type="content" source="./media/private-link-security/create-private-link-scope.png" alt-text="Screenshot showing the Create Private Link Scope window" border="true":::

1. Let the validation pass, and then select **Create**.

<!--## Create a private endpoint

Once your Azure Arc Private Link Scope is created, you need to connect it with one or more virtual networks using a private endpoint. The private endpoint exposes access to the Azure Arc services on a private IP in your virtual network address space.

1. In your scope resource, select **Private Endpoint connections** in the left-hand resource menu. Select **Add** to start the endpoint create process. You can also approve connections that were started in the Private Link center here by selecting them and selecting **Approve**.

    :::image type="content" source="./media/private-link-security/create-private-endpoint.png" alt-text="Create Private Endpoint" border="true":::

1. Pick the subscription, resource group, and name of the endpoint, and the region it should live in. The region needs to be the same region as the VNet you connect it to.

1. Select **Next: Resource**.

1. On the **Resource** page,

   a. Pick the **Subscription** that contains your Azure Arc Private Link Scope resource.

   b. For **Resource type**, choose **Microsoft.HybridCompute/privateLinkScopes**.

   c. From the **Resource** drop-down, choose your Private Link scope you created earlier.

   d. Select **Next: Configuration >**.

    :::image type="content" source="./media/private-link-security/create-private-endpoint-configuration.png" alt-text="Complete creation of Private Endpoint" border="true":::

1. On the **Configuration** page,

   a. Choose the **virtual network** and **subnet** that you want to connect to your Azure Arc-enabled server. 

   b. Choose **Yes** for **Integrate with private DNS zone**, and let it automatically create a new Private DNS Zone. The actual DNS zones might be different from what is shown in the screenshot below.

     > [!NOTE]
     > If you choose **No** and prefer to manage DNS records manually, first complete setting up your Private Link - including this Private Endpoint and the Private Scope configuration. Then, configure your DNS according to the instructions in [Azure Private Endpoint DNS configuration](../../private-link/private-endpoint-dns.md). Make sure not to create empty records as preparation for your Private Link setup. The DNS records you create can override existing settings and impact your connectivity with Azure Arc-enabled servers.

   c.    Select **Review + create**.

   d.    Let validation pass.

   e.    Select **Create**.-->

## Configure on-premises DNS forwarding

Your on-premises machines or servers need to be able to resolve the private link DNS records to the private endpoint IP addresses. How you configure this depends on whether you're using Azure private DNS zones to maintain DNS records, or if you're using your own DNS server on-premises and how many servers you're configuring.

### DNS configuration using Azure-integrated private DNS zones

If you set up private DNS zones for Azure Arc-enabled servers and Guest Configuration when creating the private endpoint, your on-premises machines or servers need to be able to forward DNS queries to the built-in Azure DNS servers to resolve the private endpoint addresses correctly. You need a DNS forwarder in Azure (either a purpose-built VM or an Azure Firewall instance with DNS proxy enabled), after which you can configure your on-premises DNS server to forward queries to Azure to resolve private endpoint IP addresses.

The private endpoint documentation provides guidance for configuring [on-premises workloads using a DNS forwarder](../../private-link/private-endpoint-dns.md#on-premises-workloads-using-a-dns-forwarder).

### Manual DNS server configuration

If you opted out of using Azure private DNS zones during private endpoint creation, you will need to create the required DNS records in your on-premises DNS server.

1. Go to the Azure portal.

1. Navigate to the private endpoint resource associated with your virtual network and private link scope.

1. From the left-hand pane, select **DNS configuration** to see a list of the DNS records and corresponding IP addresses you'll need to set up on your DNS server. The FQDNs and IP addresses will change based on the region you selected for your private endpoint and the available IP addresses in your subnet.

    :::image type="content" source="./media/private-link-security/dns-configuration.png" lightbox="./media/private-link-security/dns-configuration.png" alt-text="DNS configuration details" border="true":::

1. Follow the guidance from your DNS server vendor to add the necessary DNS zones and A records to match the table in the portal. Ensure that you select a DNS server that is appropriately scoped for your network. Every machine or server that uses this DNS server now resolves the private endpoint IP addresses and must be associated with the Azure Arc Private Link Scope, or the connection will be refused.

### Single server scenarios

If you're only planning to use Private Links to support a few machines or servers, you might not want to update your entire network's DNS configuration. In this case, you can add the private endpoint hostnames and IP addresses to your operating systems **Hosts** file. Depending on the OS configuration, the Hosts file can be the primary or alternative method for resolving hostname to IP address.

#### Windows

1. Using an account with administrator privileges, open **C:\Windows\System32\drivers\etc\hosts**.

1. Add the private endpoint IPs and hostnames as shown in the table from step 3 under [Manual DNS server configuration](#manual-dns-server-configuration). The hosts file requires the IP address first followed by a space and then the hostname.

1. Save the file with your changes. You might need to save to another directory first, then copy the file to the original path.

#### Linux

1. Open the `/etc/hosts` hosts file in a text editor.

1. Add the private endpoint IPs and hostnames as shown in the table from step 3 under [Manual DNS server configuration](#manual-dns-server-configuration). The hosts file asks for the IP address first followed by a space and then the hostname.

1. Save the file with your changes.

## Connect to an Azure Arc-enabled servers

> [!NOTE]
> The minimum supported version of the Azure Arc-connected machine agent with private endpoint is version 1.4. The Azure Arc-enabled servers deployment script generated in the portal downloads the latest version.

### Configure a new Azure Arc-enabled server to use Private link

When connecting a machine or server with Azure Arc-enabled servers for the first time, you can optionally connect it to a Private Link Scope. The following steps are 

1. From your browser, go to the [Azure portal](https://portal.azure.com).

1. Navigate to **Machines - Azure Arc**.

1. On the **Machines - Azure Arc** page, select **Add/Create** at the upper left, and then select **Add a machine** from the drop-down menu.

1. On the **Add servers with Azure Arc** page, select either the **Add a single server** or **Add multiple servers** depending on your deployment scenario, and then select **Generate script**.

1. On the **Generate script** page, select the subscription and resource group where you want the machine to be managed within Azure. Select an Azure location where the machine metadata will be stored. This location can be the same or different, as the resource group's location.

1. On the **Basics** page, provide the following:

    1. Select the **Subscription** and **Resource group** for the machine.
    1. In the **Region** drop-down list, select the Azure region to store the machine or server metadata.
    1. In the **Operating system** drop-down list, select the operating system that the script is configured to run on.
    1. Under **Connectivity method**, select **Private endpoint** and select the Azure Arc Private Link Scope created in Part 1 from the drop-down list.

       :::image type="content" source="./media/private-link-security/arc-enabled-servers-create-script.png" alt-text="Selecting Private Endpoint connectivity option" border="true":::

    1. Select **Next: Tags**.

1. If you selected **Add multiple servers**, on the **Authentication** page, select the service principal created for Azure Arc-enabled servers from the drop-down list. If you have not created a service principal for Azure Arc-enabled servers, first review [how to create a service principal](onboard-service-principal.md#create-a-service-principal-for-onboarding-at-scale) to familiarize yourself with permissions required and the steps to create one. Select **Next: Tags** to continue.

1. On the **Tags** page, review the default **Physical location tags** suggested and enter a value, or specify one or more **Custom tags** to support your standards.

1. Select **Next: Download and run script**.

1. On the **Download and run script** page, review the summary information, and then select **Download**. If you still need to make changes, select **Previous**.

After downloading the script, you have to run it on your machine or server using a privileged (administrator or root) account. Depending on your network configuration, you might need to download the agent from a computer with internet access and transfer it to your machine or server, and then modify the script with the path to the agent. 

The Windows agent can be downloaded from [https://aka.ms/AzureConnectedMachineAgent](https://aka.ms/AzureConnectedMachineAgent) and the Linux agent can be downloaded from [https://packages.microsoft.com](https://packages.microsoft.com). Look for the latest version of the **azcmagent** under your OS distribution directory and installed with your local package manager.

The script will return status messages letting you know if onboarding was successful after it completes.

> [!TIP]
> Network traffic from the Azure Connected Machine agent to Microsoft Entra ID and Azure Resource Manager will continue to use public endpoints. If your server needs to communicate through a proxy server to reach these endpoints, [configure the agent with the proxy server URL](manage-agent.md#update-or-remove-proxy-settings) before connecting it to Azure. You might also need to [configure a proxy bypass](manage-agent.md#proxy-bypass-for-private-endpoints) for the Azure Arc services if your private endpoint is not accessible from your proxy server.

### Configure an existing Azure Arc-enabled server

For Azure Arc-enabled servers that were set up prior to your private link scope, you can allow them to start using the Azure Arc-enabled servers Private Link Scope by completing the following steps.

1. In the Azure portal, navigate to your Azure Arc Private Link Scope resource.

1. From the left-hand pane, select **Azure Arc resources** and then **+ Add**.

1. Select the servers in the list that you want to associate with the Private Link Scope, and then select **Select** to save your changes.

    > [!NOTE]
    > Only Azure Arc-enabled servers in the same subscription and region as your Private Link Scope is shown.

    :::image type="content" source="./media/private-link-security/select-servers-private-link-scope.png" lightbox="./media/private-link-security/select-servers-private-link-scope.png" alt-text="Selecting Azure Arc resources" border="true":::

It might take up to 15 minutes for the Private Link Scope to accept connections from the recently associated server(s).

## Troubleshooting

1. Check your on-premises DNS server(s) to verify it is either forwarding to Azure DNS or is configured with appropriate A records in your private link zone. These lookup commands should return private IP addresses in your Azure virtual network. If they resolve public IP addresses, double check your machine or server and network's DNS configuration.

    ```
    nslookup gbl.his.arc.azure.com
    nslookup agentserviceapi.guestconfiguration.azure.com
    ```

1. If you are having trouble onboarding a machine or server, confirm that you've added the Microsoft Entra ID and Azure Resource Manager service tags to your local network firewall. The agent needs to communicate with these services over the internet until private endpoints are available for these services.

## Next steps

* To learn more about Private Endpoint, see [What is Azure Private Endpoint?](../../private-link/private-endpoint-overview.md).

* If you are experiencing issues with your Azure Private Endpoint connectivity setup, see [Troubleshoot Azure Private Endpoint connectivity problems](../../private-link/troubleshoot-private-endpoint-connectivity.md).

* See the following to configure Private Link for [Azure Automation](../../automation/how-to/private-link-security.md), [Azure Monitor](../../azure-monitor/logs/private-link-security.md), [Azure Key Vault](../../key-vault/general/private-link-service.md), or [Azure Blob storage](../../private-link/tutorial-private-endpoint-storage-portal.md).
