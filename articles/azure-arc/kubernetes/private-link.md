---
title: Private connectivity for Azure Arc-enabled Kubernetes clusters using private link (preview)
ms.date: 09/21/2022
ms.topic: article
description: With Azure Arc, you can use a Private Link Scope model to allow multiple Kubernetes clusters to use a single private endpoint.
ms.custom: references_regions
---

# Private connectivity for Arc-enabled Kubernetes clusters using private link (preview)

[Azure Private Link](../../private-link/private-link-overview.md) allows you to securely link Azure services to your virtual network using private endpoints. This means you can connect your on-premises Kubernetes clusters with Azure Arc and send all traffic over an Azure ExpressRoute or site-to-site VPN connection instead of using public networks. In Azure Arc, you can use a Private Link Scope model to allow multiple Kubernetes clusters to communicate with their Azure Arc resources using a single private endpoint.

This document covers when to use and how to set up Azure Arc Private Link (preview).

> [!IMPORTANT]
> The Azure Arc Private Link feature is currently in PREVIEW in all regions where Azure Arc-enabled Kubernetes is present, except South East Asia.
> See the [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/) for legal terms that apply to Azure features that are in beta, preview, or otherwise not yet released into general availability.

## Advantages

With Private Link you can:

* Connect privately to Azure Arc without opening up any public network access.
* Ensure data from the Arc-enabled Kubernetes cluster is only accessed through authorized private networks.
* Prevent data exfiltration from your private networks by defining specific Azure Arc-enabled Kubernetes clusters and other Azure services resources, such as Azure Monitor, that connects through your private endpoint.
* Securely connect your private on-premises network to Azure Arc using ExpressRoute and Private Link.
* Keep all traffic inside the Microsoft Azure backbone network.

For more information, see [Key benefits of Azure Private Link](../../private-link/private-link-overview.md#key-benefits).

## How it works

Azure Arc Private Link Scope connects private endpoints (and the virtual networks they're contained in) to an Azure resource, in this case Azure Arc-enabled Kubernetes clusters. When you enable any one of the Arc-enabled Kubernetes cluster supported extensions, such as Azure Monitor, then connection to other Azure resources may be required for these scenarios. For example, in the case of Azure Monitor, the logs collected from the cluster are sent to Log Analytics workspace.

Connectivity to the other Azure resources from an Arc-enabled Kubernetes cluster listed earlier requires configuring Private Link for each service. For an example, see [Private Link for Azure Monitor](../../azure-monitor/logs/private-link-security.md).

## Current limitations

Consider these current limitations when planning your Private Link setup.

* You can associate at most one Azure Arc Private Link Scope with a virtual network.
* An Azure Arc-enabled Kubernetes cluster can only connect to one Azure Arc Private Link Scope.
* All on-premises Kubernetes clusters need to use the same private endpoint by resolving the correct private endpoint information (FQDN record name and private IP address) using the same DNS forwarder. For more information, see [Azure Private Endpoint DNS configuration](../../private-link/private-endpoint-dns.md). The Azure Arc-enabled Kubernetes cluster, Azure Arc Private Link Scope, and virtual network must be in the same Azure region. The Private Endpoint and the virtual network must also be in the same Azure region, but this region can be different from that of your Azure Arc Private Link Scope and Arc-enabled Kubernetes cluster.
* Traffic to Microsoft Entra ID, Azure Resource Manager and Microsoft Container Registry service tags must be allowed through your on-premises network firewall during the preview.
* Other Azure services that you will use, for example Azure Monitor, requires their own private endpoints in your virtual network.

    > [!NOTE]
    > The [Cluster Connect](conceptual-cluster-connect.md) (and hence the [Custom location](custom-locations.md)) feature is not supported on Azure Arc-enabled Kubernetes clusters with private connectivity enabled. This is planned and will be added later. Network connectivity using private links for Azure Arc services like Azure Arc-enabled data services and Azure Arc-enabled App services that use these features are also not supported yet. Refer to the section below for a list of [cluster extensions or Azure Arc services that support network connectivity through private links](#cluster-extensions-that-support-network-connectivity-through-private-links).

## Cluster extensions that support network connectivity through private links

On Azure Arc-enabled Kubernetes clusters configured with private links, the following extensions support end-to-end connectivity through private links. Refer to the guidance linked to each cluster extension for additional configuration steps and details on support for private links.

* [Azure GitOps](conceptual-gitops-flux2.md)
* [Azure Monitor](../../azure-monitor/logs/private-link-security.md)

## Planning your Private Link setup

To connect your Kubernetes cluster to Azure Arc over a private link, you need to configure your network to accomplish the following:

1. Establish a connection between your on-premises network and an Azure virtual network using a [site-to-site VPN](../../vpn-gateway/tutorial-site-to-site-portal.md) or [ExpressRoute](../../expressroute/expressroute-howto-linkvnet-arm.md) circuit.
1. Deploy an Azure Arc Private Link Scope, which controls which Kubernetes clusters can communicate with Azure Arc over private endpoints and associate it with your Azure virtual network using a private endpoint.
1. Update the DNS configuration on your local network to resolve the private endpoint addresses.
1. Configure your local firewall to allow access to Microsoft Entra ID, Azure Resource Manager and Microsoft Container Registry.
1. Associate the Azure Arc-enabled Kubernetes clusters with the Azure Arc Private Link Scope.
1. Optionally, deploy private endpoints for other Azure services your Azure Arc-enabled Kubernetes cluster is managed by, such as Azure Monitor.
The rest of this document assumes you have already set up your ExpressRoute circuit or site-to-site VPN connection.

## Network configuration

Azure Arc-enabled Kubernetes integrates with several Azure services to bring cloud management and governance to your hybrid Kubernetes clusters. Most of these services already offer private endpoints, but you need to configure your firewall and routing rules to allow access to Microsoft Entra ID and Azure Resource Manager over the internet until these services offer private endpoints. You also need to allow access to Microsoft Container Registry (and AzureFrontDoor.FirstParty as a precursor for Microsoft Container Registry) to pull images & Helm charts to enable services like Azure Monitor, as well as for initial setup of Azure Arc agents on the Kubernetes clusters.

There are two ways you can achieve this:

* If your network is configured to route all internet-bound traffic through the Azure VPN or ExpressRoute circuit, you can configure the network security group (NSG) associated with your subnet in Azure to allow outbound TCP 443 (HTTPS) access to Microsoft Entra ID, Azure Resource Manager, Azure Front Door and Microsoft Container Registry  using [service tags](../../virtual-network/service-tags-overview.md). The NSG rules should look like the following:

    | Setting                 | Microsoft Entra ID rule                                                 | Azure Resource Manager rule                                   | AzureFrontDoorFirstParty rule                                 | Microsoft Container Registry rule                            |
    |-------------------------|---------------------------------------------------------------|---------------------------------------------------------------|---------------------------------------------------------------|---------------------------------------------------------------
    | Source                  | Virtual Network                                               | Virtual Network                                               | Virtual Network                                               | Virtual Network
    | Source Port ranges      | *                                                             | *                                                             | *                                                             | *
    | Destination             | Service Tag                                                   | Service Tag                                                   | Service Tag                                                   | Service Tag
    | Destination service tag | AzureActiveDirectory                                          | AzureResourceManager                                          | AzureFrontDoor.FirstParty                                     | MicrosoftContainerRegistry
    | Destination port ranges | 443                                                           | 443                                                           | 443                                                           | 443
    | Protocol                | TCP                                                           | TCP                                                           | TCP                                                           | TCP
    | Action                  | Allow                                                         | Allow                                                         | Allow (Both inbound and outbound)                             | Allow
    | Priority                | 150 (must be lower than any rules that block internet access) | 151 (must be lower than any rules that block internet access) | 152 (must be lower than any rules that block internet access) | 153 (must be lower than any rules that block internet access) |
    | Name                    | AllowAADOutboundAccess                                        | AllowAzOutboundAccess                                         | AllowAzureFrontDoorFirstPartyAccess                           | AllowMCROutboundAccess

* Configure the firewall on your local network to allow outbound TCP 443 (HTTPS) access to Microsoft Entra ID, Azure Resource Manager, and Microsoft Container Registry, and inbound & outbound access to AzureFrontDoor.FirstParty using the downloadable service tag files. The JSON file contains all the public IP address ranges used by Microsoft Entra ID, Azure Resource Manager, AzureFrontDoor.FirstParty, and Microsoft Container Registry and is updated monthly to reflect any changes. Microsoft Entra service tag is AzureActiveDirectory, Azure Resource Manager's service tag is AzureResourceManager, Microsoft Container Registry's service tag is MicrosoftContainerRegistry, and Azure Front Door's service tag is AzureFrontDoor.FirstParty. Consult with your network administrator and network firewall vendor to learn how to configure your firewall rules.

## Create an Azure Arc Private Link Scope

1. Sign in to the [Azure portal](https://portal.azure.com).
1. Go to **Create a resource** in the Azure portal, then search for Azure Arc Private Link Scope. Or you can go directly to the [Azure Arc Private Link Scope page](https://portal.azure.com/#blade/HubsExtension/BrowseResource/resourceType/Microsoft.HybridCompute%2FprivateLinkScopes) in the portal.

1. Select **Create**.
1. Select a subscription and resource group. During the preview, your virtual network and Azure Arc-enabled Kubernetes clusters must be in the same subscription as the Azure Arc Private Link Scope.
1. Give the Azure Arc Private Link Scope a name.
1. You can optionally require every Arc-enabled Kubernetes cluster associated with this Azure Arc Private Link Scope to send data to the service through the private endpoint. If you select **Enable public network access**, Kubernetes clusters associated with this Azure Arc Private Link Scope can communicate with the service over both private or public networks. You can change this setting after creating the scope as needed.
1. Select **Review + Create**.

   :::image type="content" source="media/private-link/create-private-link-scope.png" alt-text="Screenshot of the Azure Arc Private Link Scope creation screen in the Azure portal.":::

1. After the validation completes, select **Create**.

### Create a private endpoint

Once your Azure Arc Private Link Scope is created, you need to connect it with one or more virtual networks using a private endpoint. The private endpoint exposes access to the Azure Arc services on a private IP in your virtual network address space.

The Private Endpoint on your virtual network allows it to reach Azure Arc-enabled Kubernetes cluster endpoints through private IPs from your network's pool, instead of using to the public IPs of these endpoints. That allows you to keep using your Azure Arc-enabled Kubernetes clusters without opening your VNet to unrequested outbound traffic. Traffic from the Private Endpoint to your resources will go through Microsoft Azure, and is not routed to public networks.

1. In your scope resource, select **Private Endpoint connections** in the left-hand resource menu. Select **Add** to start the endpoint create process. You can also approve connections that were started in the Private Link center by selecting them, then selecting **Approve**.

    :::image type="content" source="media/private-link/create-private-endpoint.png" alt-text="Screenshot of the Private Endpoint connections screen in the Azure portal.":::

1. Pick the subscription, resource group, and name of the endpoint, and the region you want to use. This must be the same region as your virtual network.
1. Select **Next: Resource**.
1. On the **Resource** page, perform the following:
   1. Select the subscription that contains your Azure Arc Private Link Scope resource.
   1. For **Resource type**, choose Microsoft.HybridCompute/privateLinkScopes.
   1. From the **Resource** drop-down, choose the Azure Arc Private Link Scope that you created earlier.
   1. Select **Next: Configuration**.
1. On the **Configuration** page, perform the following:
    1. Choose the virtual network and subnet from which you want to connect to Azure Arc-enabled Kubernetes clusters.
    1. For **Integrate with private DNS zone**, select **Yes**. A new Private DNS Zone will be created. The actual DNS zones may be different from what is shown in the screenshot below.

        :::image type="content" source="media/private-link/create-private-endpoint-2.png" alt-text="Screenshot of the Configuration step to create a private endpoint in the Azure portal.":::

        > [!NOTE]
        > If you choose **No** and prefer to manage DNS records manually, first complete setting up your Private Link, including this private endpoint and the Private Scope configuration. Next, configure your DNS according to the instructions in [Azure Private Endpoint DNS configuration](../../private-link/private-endpoint-dns.md). Make sure not to create empty records as preparation for your Private Link setup. The DNS records you create can override existing settings and impact your connectivity with Arc-enabled Kubernetes clusters.
    1. Select **Review + create**.
    1. Let validation pass.
    1. Select **Create**.

## Configure on-premises DNS forwarding

Your on-premises Kubernetes clusters need to be able to resolve the private link DNS records to the private endpoint IP addresses. How you configure this depends on whether you are using Azure private DNS zones to maintain DNS records or using your own DNS server on-premises, along with how many clusters you are configuring.

### DNS configuration using Azure-integrated private DNS zones

If you set up private DNS zones for Azure Arc-enabled Kubernetes clusters when creating the private endpoint, your on-premises Kubernetes clusters must be able to forward DNS queries to the built-in Azure DNS servers to resolve the private endpoint addresses correctly. You need a DNS forwarder in Azure (either a purpose-built VM or an Azure Firewall instance with DNS proxy enabled), after which you can configure your on-premises DNS server to forward queries to Azure to resolve private endpoint IP addresses.

The private endpoint documentation provides guidance for configuring [on-premises workloads using a DNS forwarder](../../private-link/private-endpoint-dns-integration.md#on-premises-workloads-using-a-dns-forwarder).

### Manual DNS server configuration

If you opted out of using Azure private DNS zones during private endpoint creation, you'll need to create the required DNS records in your on-premises DNS server.

1. Go to the Azure portal.
1. Navigate to the private endpoint resource associated with your virtual network and Azure Arc Private Link Scope.
1. From the left-hand pane, select **DNS configuration** to see a list of the DNS records and corresponding IP addresses you’ll need to set up on your DNS server. The FQDNs and IP addresses will change based on the region you selected for your private endpoint and the available IP addresses in your subnet.

      :::image type="content" source="media/private-link/update-dns-configuration.png" alt-text="Screenshot showing manual DNS server configuration in the Azure portal.":::

1. Follow the guidance from your DNS server vendor to add the necessary DNS zones and A records to match the table in the portal. Ensure that you select a DNS server that is appropriately scoped for your network. Every Kubernetes cluster that uses this DNS server now resolves the private endpoint IP addresses and must be associated with the Azure Arc Private Link Scope, or the connection will be refused.

## Configure private links

> [!NOTE]
> Configuring private links for Azure Arc-enabled Kubernetes clusters is supported starting from version 1.3.0 of the `connectedk8s` CLI extension, but requires Azure CLI version greater than 2.3.0. If you use a version greater than 1.3.0 for the `connectedk8s` CLI extension, we have introduced validations to check and successfully connect the cluster to Azure Arc only if you're running Azure CLI version greater than 2.3.0.  

You can configure private links for an existing Azure Arc-enabled Kubernetes cluster or when onboarding a Kubernetes cluster to Azure Arc for the first time using the command below:

```azurecli
az connectedk8s connect -g <resource-group-name> -n <connected-cluster-name> -l <location> --enable-private-link true --private-link-scope-resource-id <pls-arm-id>
```

| Parameter name | Description |
| -------------- | ----------- |
| --enable-private-link |Property to enable/disable private links feature. Set it to "True" to enable connectivity with private links. |
| --private-link-scope-resource-id | ID of the private link scope resource created earlier. For example: /subscriptions//resourceGroups//providers/Microsoft.HybridCompute/privateLinkScopes/ |

For Azure Arc-enabled Kubernetes clusters that were set up prior to configuring the Azure Arc private link scope, you can configure private links through the Azure portal using the following steps:

1. In the Azure portal, navigate to your Azure Arc Private Link Scope resource.
1. From the left pane, select **Azure Arc resources** and then **+ Add**.
1. Select the Kubernetes clusters in the list that you want to associate with the Private Link Scope, and then choose **Select** to save your changes.

    > [!NOTE]
    > The list only shows Azure Arc-enabled Kubernetes clusters that are within the same subscription and region as your Private Link Scope.

    :::image type="content" source="media/private-link/select-clusters.png" alt-text="Screenshot of the list of Kubernetes clusters for the Azure Arc Private Link Scope." lightbox="media/private-link/select-clusters.png":::

## Troubleshooting

If you run into problems, the following suggestions may help:

* Check your on-premises DNS server(s) to verify it is either forwarding to Azure DNS or is configured with appropriate A records in your private link zone. These lookup commands should return private IP addresses in your Azure virtual network. If they resolve public IP addresses, double check your machine or server and network’s DNS configuration.

  ```console
  nslookup gbl.his.arc.azure.com
  nslookup agentserviceapi.guestconfiguration.azure.com
  nslookup dp.kubernetesconfiguration.azure.com
  ```

* If you are having trouble onboarding your Kubernetes cluster, confirm that you’ve added the Microsoft Entra ID, Azure Resource Manager, AzureFrontDoor.FirstParty and Microsoft Container Registry service tags to your local network firewall.

## Next steps

* Learn more about [Azure Private Endpoint](../../private-link/private-link-overview.md).
* Learn how to [troubleshoot Azure Private Endpoint connectivity problems](../../private-link/troubleshoot-private-endpoint-connectivity.md).
* Learn how to [configure Private Link for Azure Monitor](../../azure-monitor/logs/private-link-security.md).
