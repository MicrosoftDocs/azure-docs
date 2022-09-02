# Private Link for Azure Virtual Desktop (preview)

Azure Private Link (PL) enables customers to access Azure PaaS Services (for example, Azure Storage and SQL Database) and Azure hosted customer-owned/partner services over a private endpoint in their virtual network. Learn more aka.ms/privatelink

Traffic between customer's virtual network and the service travels the Microsoft Azure backbone network. Azure Virtual Desktop, at present, requires customers to whitelist a set of URLs and communicate (both from session host virtual machine and end user client side) over public network. For increased security, customers want the communication from their environment to Azure Virtual Desktop service to be contained within the Azure backbone. For the same, they want Azure Virtual Desktop to support Private Link. This document covers scenarios and requirements for Private Link support in Azure Virtual Desktop.

There are 3 main workflows for Azure Virtual Desktop. With 3 corresponding private link
endpoint types to enable traffic for them.

1. **Initial feed discovery:** This allows a client to discover all the workspaces that have been assigned to the user. To enable this, you must create a single private endpoint to the *global* sub-resource of any *workspace*. You create one, and only one of these. It will create DNS entries (and private IP routes) for the global FQDN needed to do initial feed discovery (rdweb.wvd.microsoft.com). This becomes a single, shared route for all clients to use.

2. **Feed download**: For a given workspace the client will download all the connection details (RDP files) for the host pools that each of the application groups are hosted in. To enable this feed download, you must create a private endpoint for each workgroup you want to enable. This will be to the *workspace* sub-resource of the specific *workspace* you want to allow.

3. **Connections**: Connections happen to host pools. There are 2 sides of the connection: clients and session host VMs. To enable this, you must create a private link to the *host pool* sub-resource of the *host pool* you want to allow.

You can share these private endpoints across your network topology, or you can isolate your VNETs in a way that each has their own private endpoint to the host pool/workspace.

## Supported scenarios

1. Clients using public routes, session host VMs using public routes (no private link required).

2. Clients using public routes, session host VMs using private routes. 

3. Clients using private routes, session host VMs using private routes.

Note: Even though it shows session host access from public network, it also means client access from public network.

## Public preview limitations

There are a few limitations for the Private Link feature that apply to public preview only. They are listed below. We are actively working to add increased support to mitigate these limitations.

1. The shared FQDN for initial feed discovery is controlled by a private endpoint to the "global" sub-resource of any workspace. This also has the effect of enabling feed discovery for all workspaces. Due to this property, if this workspace is deleted then all feed discovery will stop working. Instead, the best practice is to create an unused placeholder workspace for the purpose of terminating this global endpoint.

2. Validation is currently in-progress for data path access checks, specifically to prevent exfiltration. This work will continue throughout the preview and will be fully completed by GA. As part of the preview, feedback from customers is collected regarding their exfiltration requirements, including their preferences for how to audit and analyze findings. Since this preview is for internal feature validation and usage, the use of production data traffic over Private Link for Azure Virtual Desktop is neither recommended nor supported.

3. After the private endpoint to a host pool has been changed, either the agent or the VM must be restarted. This must also be done for changes made to the host pool's network configuration. Thislimitation will be fixed for GA.

*Reboot the VM or Stop/Start RDAgentBootloader service from the Task
Manager*

4. Service tags are used for agent monitoring traffic.

5. At present, simultaneous enablement of Private Link and RDP Shortpath is not supported.

## Prerequisites

- An Azure account with an active subscription

- Create the Azure Virtual Desktop objects (host pool, applicationGroup, workspace)

## How to set up Private Link?

To use Azure portal to configure Private Link:

1. Create a Private Endpoint that will connect the Azure Virtual Desktop resource (host pool) to a customer VNET. This can be added from 2 places :

Home-\>Private Link Center-\>Private Endpoints -\> Add

> Home-\> Azure Virtual Desktop hub -\> hostpools -\> select hostpool -\> Networking -\>
> Private Endpoints -\> Add
>
> Either way, the creation wizard is the same![Graphical user interface,
> application Description automatically
> generated](media/image2.png){width="6.5in"
> height="2.890972222222222in"}

2. Provide name and select location where the PE should be created.

Keep in mind that the PE location must be the same location as the VNET that the customer wants locked down.

Create an endpoint (PE), they must be in the SAME VNET as your Session
Host VM**\
\
**

![](media/image3.png)

3. Select the Azure Virtual Desktop resource for which the PE is being created. We support resource type (Microsoft.DesktopVirtualization). In this example, we selected Resource named "PrivateLinkHostpool" and target sub-resource "hostpool" to enable access to global URLs.

For each resource you want locked down, you need to create a PE for.

![](media/image4.png)

- a) Select the virtual network and subnet

   You can use your own DNS service, or select "Integrate with private
DNS zone" to use Azure private DNS zones (recommended)

![](media/image5.png)

4. Review and create

![](media/image6.png)

## Closing public routes 

In addition to creating private routes, you can also control if the Azure Virtual Desktop resource allows traffic to come from public routes.

Hostpool -\> Networking -\> Firewall and virtual networks

![](media/image7.emf){width="3.2291666666666665in"
height="0.9588790463692038in"}

- Allow end users access from public network:

    - Enabled: Users can connect to host pool using public internet or private endpoint

    - Disabled: Users can only connect to host pool using private endpoint

- Allow session hosts access from public network:

    - Enabled: Azure Virtual Desktop VM\'s will talk to Azure Virtual Desktop service over public internet or private endpoint

    - Disabled: Azure Virtual Desktop VM\'s can only talk to Azure Virtual Desktop service over private endpoint connection

## Network connectivity

1. You can setup an NSG to block the ServiceTag WindowsVirtualDesktop.
    All service traffic will now use the private routes

2. You must setup your NSG to allow the other required URL\'s [listed
    here](https://docs.microsoft.com/en-us/azure/virtual-desktop/safe-url-list?tabs=azure).
    Make sure to include things like AzureMonitor.

## Validation your Private Link deployment

1. Register / validate your sessionHosts are up and working on the virtualNetwork. You can use the portal to check on their health status.

2. Validate that your feed connections are working how you expect them. If publicNetworkAccess is disabled, validate that the workspace does not show up in feeds from public routes. Feeds from private routes should always work.

3. Validate your end-to-end connections are working.

    i. For client access, if publicNetworkAccess is Disabled or EnabledForSessionHostsOnly validate that clients cannot connect from public routes. Client connections from private routes should always work.

    ii. For session host access, if publicNetworkAccess is Disabled or EnabledForClientsOnly validate that session hosts cannot connect from public routes. Session host connections from private routes should always work.

## Next steps

[Private Link DNS integration](../private-link/private-endpoint-dns.md#virtual-network-and-on-premises-workloads-using-a-dns-forwarder)

How to configure Azure Private Endpoint DNS

[Troubleshoot Azure Private Endpoint connectivity problems](../private-link/troubleshoot-private-endpoint-connectivity.md)

General troubleshooting guides for private link documentation

[Setup packet inspection with private link](../private-link/inspect-traffic-with-azure-firewall.md)

Use Azure Firewall to inspect traffic destined to a private endpoint

[Azure Virtual Desktop for the enterprise](/azure/architecture/example-scenario/wvd/windows-virtual-desktop?context=/azure/virtual-desktop/context/context)

Overview of Azure Virtual Desktop architecture

[Azure Virtual Desktop network connectivity](https://docs.microsoft.com/en-us/azure/virtual-desktop/network-connectivity)

Understanding Azure Virtual Desktop network connectivity

[Required URL list](safe-url-list.md)Required list of URLs your session host VMs need to access for Azure Virtual Desktop