---
title: Secure traffic destined to private endpoints in Azure Virtual WAN
description: Learn how to use network rules and application rules to secure traffic destined to private endpoints in Azure Virtual WAN 
services: firewall-manager
author: vhorne
ms.service: firewall-manager
ms.topic: how-to
ms.date: 06/19/2023
ms.author: victorh
---

# Secure traffic destined to private endpoints in Azure Virtual WAN

> [!NOTE]
> This article applies to secured virtual hub only. If you want to inspect traffic destined to private endpoints using Azure Firewall in a hub virtual network, see [Use Azure Firewall to inspect traffic destined to a private endpoint](../private-link/inspect-traffic-with-azure-firewall.md).

[Azure Private Endpoint](../private-link/private-endpoint-overview.md) is the fundamental building block for [Azure Private Link](../private-link/private-link-overview.md). Private endpoints enable Azure resources deployed in a virtual network to communicate privately with private link resources.

Private endpoints allow resources access to the private link service deployed in a virtual network. Access to the private endpoint through virtual network peering and on-premises network connections extend the connectivity.

You may need to filter traffic from clients either on-premises or in Azure destined to services exposed via private endpoints in a Virtual WAN connected virtual network. This article walks you through this task using [secured virtual hub](../firewall-manager/secured-virtual-hub.md) with [Azure Firewall](../firewall/overview.md) as the security provider.

Azure Firewall filters traffic using any of the following methods:

* [FQDN in network rules](../firewall/fqdn-filtering-network-rules.md) for TCP and UDP protocols
* [FQDN in application rules](../firewall/features.md#application-fqdn-filtering-rules) for HTTP, HTTPS, and MSSQL.
* Source and destination IP addresses, port, and protocol using [network rules](../firewall/features.md#network-traffic-filtering-rules)

Application rules are preferred over network rules to inspect traffic destined to private endpoints because Azure Firewall always SNATs traffic with application rules. SNAT is recommended when inspecting traffic destined to a private endpoint due to the limitation described here: [What is a private endpoint?][private-endpoint-overview]. If you're planning on using network rules instead, it's recommended to configure Azure Firewall to always perform SNAT: [Azure Firewall SNAT private IP address ranges][firewall-snat-private-ranges].

 Microsoft manages secured virtual hubs, which can't be linked to a [Private DNS Zone](../dns/private-dns-privatednszone.md). This is required to resolve a [private link resource](../private-link/private-endpoint-overview.md#private-link-resource) FQDN to its corresponding private endpoint IP address.

SQL FQDN filtering is supported in [proxy-mode](/azure/azure-sql/database/connectivity-architecture#connection-policy) only (port 1433). *Proxy* mode can result in more latency compared to *redirect*. If you want to continue using redirect mode, which is the default for clients connecting within Azure, you can filter access using FQDN in firewall network rules.

## Filter traffic using network or application rules in Azure Firewall

The following steps enable Azure Firewall to filter traffic using either network rules (FQDN or IP address-based) or application rules:

### Network rules:

1. Deploy a [DNS forwarder](../private-link/private-endpoint-dns-integration.md#virtual-network-and-on-premises-workloads-using-a-dns-forwarder) virtual machine in a virtual network connected to the secured virtual hub and linked to the Private DNS Zones hosting the A record types for the private endpoints.

2. Configure [custom DNS servers](../virtual-network/manage-virtual-network.md#change-dns-servers) for the virtual networks connected to the secured virtual hub:
   - **FQDN-based network rules** - configure [custom DNS settings](../firewall/dns-settings.md#configure-custom-dns-servers---azure-portal) to point to the DNS forwarder virtual machine IP address and enable DNS proxy in the firewall policy associated with the Azure Firewall. Enabling DNS proxy is required if you want to do FQDN filtering in network rules.
   - **IP address-based network rules** - the custom DNS settings described in the previous point are **optional**. You can configure the custom DNS servers to point to the private IP of the DNS forwarder virtual machine.

3. Depending on the configuration chosen in step **2.**, configure on-premises DNS servers to forward DNS queries for the private endpoints **public DNS zones** to either the private IP address of the Azure Firewall, or of the DNS forwarder virtual machine.

4. Configure a [network rule](../firewall/tutorial-firewall-deploy-portal.md#configure-a-network-rule) as required in the firewall policy associated with the Azure Firewall. Choose *Destination Type* IP Addresses  if going with an **IP address-based** rule and configure the IP address of the private endpoint as *Destination*. For **FQDN-based** network rules, choose *Destination Type* FQDN and configure the private link resource public FQDN as *Destination*.

5. Navigate to the firewall policy associated with the Azure Firewall deployed in the secured virtual hub. Select *Private IP ranges (SNAT)* and select the option to *Always perform SNAT*.

### Application rules:

1. For application rules, steps **1.** to **3.** from the previous section still apply. For the custom DNS server configuration, you can either choose to use the Azure Firewall as DNS proxy, or point to the DNS forwarder virtual machine directly.

2. Configure an [application rule](../firewall/tutorial-firewall-deploy-portal.md#configure-an-application-rule) as required in the firewall policy associated with the Azure Firewall. Choose *Destination Type* FQDN and the private link resource public FQDN as *Destination*.

Lastly, and regardless of the type of rules configured in the Azure Firewall, make sure [Network Policies][network-policies-overview] (at least for UDR support) are enabled in the subnet(s) where the private endpoints are deployed. This ensures traffic destined to private endpoints doesn't bypass the Azure Firewall. 

 > [!IMPORTANT]
   > By default, RFC 1918 prefixes are automatically included in the *Private Traffic Prefixes* of the Azure Firewall. For most private endpoints, this will be enough to make sure traffic from on-premises clients, or in different virtual networks connected to the same secured hub, will be inspected by the firewall. In case traffic destined to private endpoints is not being logged in the firewall, try adding the /32 prefix for each private endpoint to the list of *Private Traffic Prefixes*. 

If needed, you can edit the CIDR prefixes that is inspected via Azure Firewall in a secured hub as follows:

1. Navigate to *Secured virtual hubs* in the firewall policy associated with the Azure Firewall deployed in the secured virtual hub and select the secured virtual hub where traffic filtering destined to private endpoints is configured.

2. Navigate to **Security configuration**, select **Send via Azure Firewall** under **Private traffic**.

3. Select **Private traffic prefixes** to edit the CIDR prefixes that are inspected via Azure Firewall in secured virtual hub and add one /32 prefix for each private endpoint.

   :::image type="content" source="./media/private-link-inspection-secure-virtual-hub/firewall-manager-security-configuration.png" alt-text="Firewall Manager Security Configuration" border="true":::

To inspect traffic from clients in the same virtual network as private endpoints, it isn't required to specifically override the /32 routes from private endpoints. As long as **Network Policies** are enabled in the private endpoints subnet(s), a UDR with a wider address range takes precedence. For instance, configure this UDR with **Next hop type** set to **Virtual Appliance**, **Next hop address** set to the private IP of the Azure Firewall, and **Address prefix** destination set to the subnet dedicated to all private endpoint deployed in the virtual network. **Propagate gateway routes** must be set to **Yes**.

The following diagram illustrates the DNS and data traffic flows for the different clients to connect to a private endpoint deployed in Azure virtual WAN:

:::image type="content" source="./media/private-link-inspection-secure-virtual-hub/private-link-inspection-virtual-wan-architecture.png" alt-text="Traffic Flows" border="true":::

## Troubleshooting

The main problems that you might have when you attempt to filter traffic destined to private endpoints via secured virtual hub are:

- Clients are unable to connect to private endpoints.

- Azure Firewall is bypassed. You can validate this symptom  the absence of network or application rules log entries in Azure Firewall.

In most cases, one of the following issues causes these problems:

- Incorrect DNS name resolution

- Incorrect routing configuration

### Incorrect DNS name resolution

1. Verify the virtual network DNS servers are set to *Custom* and the IP address is the private IP address of Azure Firewall in secured virtual hub.

   Azure CLI:

   ```azurecli-interactive
   az network vnet show --name <VNET Name> --resource-group <Resource Group Name> --query "dhcpOptions.dnsServers"
   ```
2. Verify clients in the same virtual network as the DNS forwarder virtual machine can resolve the private endpoint public FQDN to its corresponding private IP address by directly querying the virtual machine configured as DNS forwarder.

   Linux:

   ```bash
   dig @<DNS forwarder VM IP address> <Private endpoint public FQDN>
   ```
3. Inspect *AzureFirewallDNSProxy* Azure Firewall log entries and validate it can receive and resolve DNS queries from the clients.

   ```kusto
   AzureDiagnostics
   | where Category contains "DNS"
   | where msg_s contains "database.windows.net"
   ```
4. Verify *DNS proxy* has been enabled and a *Custom* DNS server pointing to the IP address of the DNS forwarder virtual machine IP address has been configured in the firewall policy associated with the Azure Firewall in the secured virtual hub.

   Azure CLI:

   ```azurecli-interactive
   az network firewall policy show --name <Firewall Policy> --resource-group <Resource Group Name> --query dnsSettings
   ```

### Incorrect routing configuration

1. Verify *Security configuration* in the firewall policy associated with the Azure Firewall deployed in the secured virtual hub. Make sure under the **PRIVATE TRAFFIC** column it shows as **Secured by Azure Firewall** for all the virtual network and branches connections you want to filter traffic for.

   :::image type="content" source="./media/private-link-inspection-secure-virtual-hub/firewall-policy-private-traffic-configuration.png" alt-text="Private Traffic Secured by Azure Firewall" border="true":::

2. Verify **Security configuration** in the firewall policy associated with the Azure Firewall deployed in the secured virtual hub. In case traffic destined to private endpoints isn't being logged in the firewall, try adding the /32 prefix for each private endpoint to the list of **Private Traffic Prefixes**.

   :::image type="content" source="./media/private-link-inspection-secure-virtual-hub/firewall-manager-security-configuration.png" alt-text="Firewall Manager Security Configuration - Private Traffic Prefixes" border="true":::

3. In the secured virtual hub under virtual WAN, inspect effective routes for the route tables associated with the virtual networks and branches connections you want to filter traffic for. If /32 entries were added for each private endpoint you want to inspect traffic for, make sure these are listed in the effective routes.

   :::image type="content" source="./media/private-link-inspection-secure-virtual-hub/secured-virtual-hub-effective-routes.png" alt-text="Secured Virtual Hub Effective Routes" border="true":::

4. Inspect the effective routes on the NICs attached to the virtual machines deployed in the virtual networks you want to filter traffic for. Make sure there are /32 entries for each private endpoint private IP address you want to filter traffic for (if added).
 
   Azure CLI:

   ```azurecli-interactive
   az network nic show-effective-route-table --name <Network Interface Name> --resource-group <Resource Group Name> -o table
   ```
5. Inspect the routing tables of your on-premises routing devices. Make sure you're learning the address spaces of the virtual networks where the private endpoints are deployed.

   Azure virtual WAN doesn't advertise the prefixes configured under **Private traffic prefixes** in firewall policy **Security configuration** to on-premises. It's expected that the /32 entries don't show in the routing tables of your on-premises routing devices.

6. Inspect **AzureFirewallApplicationRule** and **AzureFirewallNetworkRule** Azure Firewall logs. Make sure traffic destined to the private endpoints is being logged.

   **AzureFirewallNetworkRule** log entries don't include FQDN information. Filter by IP address and port when inspecting network rules.

   When filtering traffic destined to [Azure Files](../storage/files/storage-files-introduction.md) private endpoints, **AzureFirewallNetworkRule** log entries are only generated when a client first mounts or connects to the file share. Azure Firewall doesn't generate logs for [CRUD](https://en.wikipedia.org/wiki/Create,_read,_update_and_delete) operations for files in the file share. This is because CRUD operations are carried over the persistent TCP channel opened when the client first connects or mounts to the file share.

   Application rule log query example:

   ```kusto
   AzureDiagnostics
   | where msg_s contains "database.windows.net"
   | where Category contains "ApplicationRule"
   ```
## Next steps

- [Use Azure Firewall to inspect traffic destined to a private endpoint](../private-link/inspect-traffic-with-azure-firewall.md)

[private-endpoint-overview]: ../private-link/private-endpoint-overview.md#limitations
[firewall-snat-private-ranges]: ../firewall/snat-private-range.md
[network-policies-overview]: ../private-link/disable-private-endpoint-network-policy.md
