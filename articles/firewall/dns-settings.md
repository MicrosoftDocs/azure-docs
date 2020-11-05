---
title: Azure Firewall DNS settings (preview)
description: You can configure Azure Firewall with  DNS server and DNS proxy settings.
services: firewall
author: vhorne
ms.service: firewall
ms.topic: how-to
ms.date: 06/30/2020
ms.author: victorh
---

# Azure Firewall DNS settings (preview)

> [!IMPORTANT]
> Azure Firewall DNS settings is currently in public preview.
> This preview version is provided without a service level agreement, and it's not recommended for production workloads. Certain features might not be supported or might have constrained capabilities. 
> For more information, see [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).

You can configure a custom DNS server and enable DNS proxy for Azure Firewall. You can configure these settings when you deploy the firewall or later from the **DNS settings** page.

## DNS servers

A DNS server maintains and resolves domain names to IP addresses. By default, Azure Firewall uses Azure DNS for name resolution. The **DNS server** setting lets you configure your own DNS servers for Azure Firewall name resolution. You can configure a single or multiple servers.

> [!NOTE]
> For Azure Firewalls managed using Azure Firewall Manager the DNS settings are configured in the associated Azure Firewall Policy.

### Configure custom DNS servers (preview) - Azure Portal

1. Under Azure Firewall **Settings**, select **DNS Settings**.
2. Under **DNS servers**, you can type or add existing DNS servers that have been previously specified in your Virtual Network.
3. Select **Save**.
4. The firewall now directs DNS traffic to the specified DNS server(s) for name resolution.

:::image type="content" source="media/dns-settings/dns-servers.png" alt-text="DNS servers":::

### Configure custom DNS servers (preview) - Azure CLI

The following example updates the Azure Firewall with custom DNS servers using Azure CLI.

```azurecli-interactive
az network firewall update \
    --name fwName \ 
    --resource-group fwRG \
    --dns-servers 10.1.0.4 10.1.0.5
```

> [!IMPORTANT]
> The command `az network firewall` requires the Azure CLI extension `azure-firewall` to be installed. It can be installed using the command `az extension add --name azure-firewall`. 

### Configure custom DNS servers (preview) - Azure PowerShell

The following example updates the Azure Firewall with custom DNS servers using Azure PowerShell.

```azurepowershell
$dnsServers = @("10.1.0.4", "10.1.0.5")
$azFw = Get-AzFirewall -Name "fwName" -ResourceGroupName "fwRG"
$azFw.DNSServer = $dnsServers

$azFw | Set-AzFirewall
```

## DNS proxy (preview)

You can configure Azure Firewall to act as a DNS proxy. A DNS proxy acts as an intermediary for DNS requests from client virtual machines to a DNS server. If you configure a custom DNS server, you should enable DNS proxy to avoid DNS resolution mismatch, and enable FQDN filtering in network rules.

If you don't enable DNS proxy, DNS requests from the client may travel to a DNS server at a different time or return a different response compared to that of the firewall. DNS proxy puts Azure Firewall in the path of the client requests to avoid inconsistency.

DNS Proxy configuration requires three steps:
1. Enable DNS proxy in Azure Firewall DNS settings.
2. Optionally configure your custom DNS server or use the provided default.
3. Finally, you must configure the Azure Firewall’s private IP address as a Custom DNS address in your virtual network DNS server settings. This ensures DNS traffic is directed to Azure Firewall.

### Configure DNS proxy (preview) - Azure Portal

To configure DNS proxy, you must configure your virtual network DNS servers setting to use the firewall private IP address. Then, enable DNS Proxy in Azure Firewall **DNS settings**.

#### Configure virtual network DNS servers 

1. Select the virtual network where the DNS traffic will be routed through the Azure Firewall.
2. Under **Settings**, select **DNS servers**.
3. Select **Custom** under **DNS servers**.
4. Enter the firewall’s private IP address.
5. Select **Save**.
6. Restart the VMs that are connected to the virtual network, so they are assigned the new DNS server settings. VMs continue to use their current DNS settings until they are restarted.

#### Enable DNS proxy (preview)

1. Select your Azure Firewall.
2. Under **Settings**, select **DNS settings**.
3. By default, **DNS Proxy** is disabled. When enabled, the firewall listens on port 53 and forwards DNS requests to the configured DNS servers.
4. Review the **DNS servers** configuration to make sure that the settings are appropriate for your environment.
5. Select **Save**.

:::image type="content" source="media/dns-settings/dns-proxy.png" alt-text="DNS proxy":::

### Configure DNS proxy (preview) - Azure CLI

Configuring DNS proxy settings in Azure Firewall and updating VNets to use Azure Firewall as DNS Server can be done using Azure CLI.

#### Configure virtual network DNS servers

This example configures the VNet to use Azure Firewall as DNS server.
 
```azurecli-interactive
az network vnet update \
    --name VNetName \ 
    --resource-group VNetRG \
    --dns-servers <firewall-private-IP>
```

#### Enable DNS proxy (preview)

This example enables the DNS proxy feature in Azure Firewall.

```azurecli-interactive
az network firewall update \
    --name fwName \ 
    --resource-group fwRG \
    --enable-dns-proxy true
```

### Configure DNS proxy (preview) - Azure PowerShell

Configuring DNS proxy settings and updating VNets to use Azure Firewall as DNS Server can be done using Azure PowerShell.

#### Configure virtual network DNS servers

 This example configures the VNet to use Azure Firewall as DNS server.

```azurepowershell
$dnsServers = @("<firewall-private-IP>")
$VNet = Get-AzVirtualNetwork -Name "VNetName" -ResourceGroupName "VNetRG"
$VNet.DhcpOptions.DnsServers = $dnsServers

$VNet | Set-AzVirtualNetwork
```

#### Enable DNS proxy (preview)

This example enables the DNS proxy feature in Azure Firewall.

```azurepowershell
$azFw = Get-AzFirewall -Name "fwName" -ResourceGroupName "fwRG"
$azFw.DNSEnableProxy = $true

$azFw | Set-AzFirewall
```

## Next steps

[FQDN filtering in network rules](fqdn-filtering-network-rules.md)
