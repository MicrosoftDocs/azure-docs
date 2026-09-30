---
title: 'Tutorial: Create a Traffic Manager Linked Record - Azure PowerShell'
titleSuffix: Azure DNS
description: Learn to create a Traffic Manager Linked Record in Azure DNS with Azure PowerShell, returning endpoint IPs without an intermediate CNAME hop.
services: dns
author: asudbring
ms.service: azure-dns
ms.topic: tutorial
ms.date: 06/01/2026
ms.author: allensu
ms.custom:
  - template-tutorial
  - devx-track-azurepowershell
# Customer intent: "As a network administrator, I want to create a Traffic Manager Linked Record using PowerShell, so that I can script and automate DNS configurations for Traffic Manager-backed domains."
---

# Tutorial: Create a Traffic Manager Linked Record using Azure PowerShell

In this tutorial, you create a **Traffic Manager Linked Record** in Azure DNS using Azure PowerShell. A Traffic Manager Linked Record connects a DNS record set directly to an Azure Traffic Manager profile, returning IP addresses to clients without an intermediate CNAME resolution.

> [!IMPORTANT]
> Traffic Manager Linked Records is currently in PREVIEW. See the [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/) for legal terms that apply to Azure features that are in beta, preview, or otherwise not yet released into general availability.

For a portal-based walkthrough, see [Create a Traffic Manager Linked Record using the Azure portal](tutorial-traffic-manager-linked-records-portal.md). For a conceptual overview, see [Traffic Manager Linked Records overview](dns-traffic-manager-linked-records.md).

In this tutorial, you learn how to:

> [!div class="checklist"]
> * Create the networking and virtual machine infrastructure.
> * Create a Traffic Manager profile with endpoints.
> * Create a Traffic Manager Linked Record using Azure PowerShell.
> * Test the Traffic Manager Linked Record.

If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/pricing/purchase-options/azure-account?cid=msft_learn) before you begin.

## Prerequisites

* An Azure account with an active subscription.
* Azure PowerShell version 12.0.0 or later installed locally, or use Azure Cloud Shell. Run `Get-Module -ListAvailable Az` to check your version. To install or upgrade, see [Install Azure PowerShell](/powershell/azure/install-az-ps).
* A domain name hosted in Azure DNS. If you don't have an Azure DNS zone, [create one](./dns-getstarted-powershell.md) and [delegate your domain](dns-delegate-domain-azure-dns.md) to Azure DNS.

> [!NOTE]
> In this tutorial, `contoso.com` is used as an example domain name. Replace `contoso.com` with your own domain name.

[!INCLUDE [updated-for-az](~/reusable-content/ce-skilling/azure/includes/updated-for-az.md)]

[!INCLUDE [cloud-shell-try-it.md](~/reusable-content/ce-skilling/azure/includes/cloud-shell-try-it.md)]

## Set variables

Define variables for resource names and locations used throughout this tutorial.

```azurepowershell-interactive
$ResourceGroup = "test-rg"
$Location = "eastus"
$VNetName = "vnet-1"
$TmProfileName = "tm-profile"
$DnsZone = "contoso.com"
$DnsZoneResourceGroup = "<dns-zone-resource-group>"
```

> [!NOTE]
> Replace `<dns-zone-resource-group>` with the resource group that contains your existing Azure DNS zone.

## Create the resource group

```azurepowershell-interactive
New-AzResourceGroup -Name $ResourceGroup -Location $Location
```

## Create the virtual network

```azurepowershell-interactive
$subnet = @{
    Name          = "subnet-1"
    AddressPrefix = "10.10.0.0/24"
}
$SubnetConfig = New-AzVirtualNetworkSubnetConfig @subnet

$vnet = @{
    ResourceGroupName = $ResourceGroup
    Name              = $VNetName
    Location          = $Location
    AddressPrefix     = "10.10.0.0/16"
    Subnet            = $SubnetConfig
}
New-AzVirtualNetwork @vnet
```

## Create web server virtual machines

### Create the public IP addresses

```azurepowershell-interactive
$pip1 = @{
    ResourceGroupName = $ResourceGroup
    Name              = "public-ip-1"
    Location          = $Location
    Sku               = "Standard"
    AllocationMethod  = "Static"
    DomainNameLabel   = "vm-1-tmlink"
}
$Vm1Pip = New-AzPublicIpAddress @pip1

$pip2 = @{
    ResourceGroupName = $ResourceGroup
    Name              = "public-ip-2"
    Location          = $Location
    Sku               = "Standard"
    AllocationMethod  = "Static"
    DomainNameLabel   = "vm-2-tmlink"
}
$Vm2Pip = New-AzPublicIpAddress @pip2
```

### Create the network security group

```azurepowershell-interactive
$httpRule = @{
    Name                     = "AllowHTTP"
    Protocol                 = "Tcp"
    Direction                = "Inbound"
    Priority                 = 100
    SourceAddressPrefix      = "*"
    SourcePortRange          = "*"
    DestinationAddressPrefix = "*"
    DestinationPortRange     = 80
    Access                   = "Allow"
}
$HttpRule = New-AzNetworkSecurityRuleConfig @httpRule

$httpsRule = @{
    Name                     = "AllowHTTPS"
    Protocol                 = "Tcp"
    Direction                = "Inbound"
    Priority                 = 110
    SourceAddressPrefix      = "*"
    SourcePortRange          = "*"
    DestinationAddressPrefix = "*"
    DestinationPortRange     = 443
    Access                   = "Allow"
}
$HttpsRule = New-AzNetworkSecurityRuleConfig @httpsRule

$nsg = @{
    ResourceGroupName = $ResourceGroup
    Location          = $Location
    Name              = "nsg-1"
    SecurityRules     = $HttpRule, $HttpsRule
}
$Nsg = New-AzNetworkSecurityGroup @nsg
```

### Create the network interfaces and virtual machines

```azurepowershell-interactive
$VNet = Get-AzVirtualNetwork -ResourceGroupName $ResourceGroup -Name $VNetName
$Subnet = Get-AzVirtualNetworkSubnetConfig -VirtualNetwork $VNet -Name "subnet-1"

$nic1 = @{
    ResourceGroupName      = $ResourceGroup
    Name                   = "nic-1"
    Location               = $Location
    SubnetId               = $Subnet.Id
    PublicIpAddressId      = $Vm1Pip.Id
    NetworkSecurityGroupId = $Nsg.Id
}
$Vm1Nic = New-AzNetworkInterface @nic1

$nic2 = @{
    ResourceGroupName      = $ResourceGroup
    Name                   = "nic-2"
    Location               = $Location
    SubnetId               = $Subnet.Id
    PublicIpAddressId      = $Vm2Pip.Id
    NetworkSecurityGroupId = $Nsg.Id
}
$Vm2Nic = New-AzNetworkInterface @nic2
```

Create the virtual machine configurations and deploy the VMs. When prompted, enter a password for the administrator account.

```azurepowershell-interactive
$Credential = Get-Credential -Message "Enter a username and password for the VMs"

$image = @{
    PublisherName = "Canonical"
    Offer         = "ubuntu-24_04-lts"
    Skus          = "server"
    Version       = "latest"
}

$Vm1Config = New-AzVMConfig -VMName "vm-1" -VMSize "Standard_B1s" |
    Set-AzVMOperatingSystem -Linux -ComputerName "vm-1" -Credential $Credential |
    Set-AzVMSourceImage @image |
    Add-AzVMNetworkInterface -Id $Vm1Nic.Id

New-AzVM -ResourceGroupName $ResourceGroup -Location $Location -VM $Vm1Config -AsJob

$Vm2Config = New-AzVMConfig -VMName "vm-2" -VMSize "Standard_B1s" |
    Set-AzVMOperatingSystem -Linux -ComputerName "vm-2" -Credential $Credential |
    Set-AzVMSourceImage @image |
    Add-AzVMNetworkInterface -Id $Vm2Nic.Id

New-AzVM -ResourceGroupName $ResourceGroup -Location $Location -VM $Vm2Config
```

### Install NGINX on the virtual machines

```azurepowershell-interactive
$run1 = @{
    ResourceGroupName = $ResourceGroup
    VMName            = "vm-1"
    CommandId         = "RunShellScript"
    ScriptString      = "sudo apt-get update && sudo apt-get install -y nginx && echo 'Hello World from vm-1' | sudo tee /var/www/html/index.html"
}
Invoke-AzVMRunCommand @run1

$run2 = @{
    ResourceGroupName = $ResourceGroup
    VMName            = "vm-2"
    CommandId         = "RunShellScript"
    ScriptString      = "sudo apt-get update && sudo apt-get install -y nginx && echo 'Hello World from vm-2' | sudo tee /var/www/html/index.html"
}
Invoke-AzVMRunCommand @run2
```

## Retrieve the public IP addresses

```azurepowershell-interactive
$Vm1IPAddress = (Get-AzPublicIpAddress -ResourceGroupName $ResourceGroup -Name "public-ip-1").IpAddress
$Vm2IPAddress = (Get-AzPublicIpAddress -ResourceGroupName $ResourceGroup -Name "public-ip-2").IpAddress

Write-Output "vm-1 IP: $Vm1IPAddress"
Write-Output "vm-2 IP: $Vm2IPAddress"
```

## Create the Traffic Manager profile

```azurepowershell-interactive
$tm = @{
    Name                 = $TmProfileName
    ResourceGroupName    = $ResourceGroup
    TrafficRoutingMethod = "Priority"
    RelativeDnsName      = "tm-profile-$(Get-Random)"
    Ttl                  = 30
    MonitorProtocol      = "HTTP"
    MonitorPort          = 80
    MonitorPath          = "/"
    RecordType           = "A"
}
$TmProfile = New-AzTrafficManagerProfile @tm
```

### Add endpoints to the Traffic Manager profile

```azurepowershell-interactive
$ep1 = @{
    EndpointName          = "tmendpoint-1"
    TrafficManagerProfile = $TmProfile
    Type                  = "ExternalEndpoints"
    Target                = $Vm1IPAddress
    EndpointStatus        = "Enabled"
    Priority              = 1
}
Add-AzTrafficManagerEndpointConfig @ep1

$ep2 = @{
    EndpointName          = "tmendpoint-2"
    TrafficManagerProfile = $TmProfile
    Type                  = "ExternalEndpoints"
    Target                = $Vm2IPAddress
    EndpointStatus        = "Enabled"
    Priority              = 2
}
Add-AzTrafficManagerEndpointConfig @ep2

Set-AzTrafficManagerProfile -TrafficManagerProfile $TmProfile
```

## Create the Traffic Manager Linked Record

Use `New-AzDnsRecordSet` with the `-TrafficManagementProfile` parameter to create the Traffic Manager Linked Record. The following command creates an A record at the zone apex (`@`).

> [!NOTE]
> The `-TrafficManagementProfile` parameter is available in Az.Dns 5.0.0 and later, and requires the Traffic Manager Linked Records preview API (`2024-06-01-preview` or later).

```azurepowershell-interactive
$TmProfileId = $TmProfile.Id

$apex = @{
    ResourceGroupName        = $DnsZoneResourceGroup
    ZoneName                 = $DnsZone
    Name                     = "@"
    RecordType               = "A"
    Ttl                      = 30
    TrafficManagementProfile = $TmProfileId
}
New-AzDnsRecordSet @apex
```

To create the record for a subdomain instead of the zone apex, replace `"@"` with the subdomain name. For example:

```azurepowershell-interactive
$www = @{
    ResourceGroupName        = $DnsZoneResourceGroup
    ZoneName                 = $DnsZone
    Name                     = "www"
    RecordType               = "A"
    Ttl                      = 30
    TrafficManagementProfile = $TmProfileId
}
New-AzDnsRecordSet @www
```

### Verify the linked record

```azurepowershell-interactive
$record = @{
    ResourceGroupName = $DnsZoneResourceGroup
    ZoneName          = $DnsZone
    Name              = "@"
    RecordType        = "A"
}
Get-AzDnsRecordSet @record
```

The output includes a `TrafficManagementProfile` property showing the Traffic Manager profile resource ID, confirming the link is established.

> [!NOTE]
> The TTL value in the record reflects the Traffic Manager profile TTL. Any TTL specified during record creation is replaced by the Traffic Manager profile's DNS TTL value.

## Test the Traffic Manager Linked Record

Retrieve the name servers for your DNS zone and query one directly.

```azurepowershell-interactive
$ns = @{
    ResourceGroupName = $DnsZoneResourceGroup
    ZoneName          = $DnsZone
    Name              = "@"
    RecordType        = "NS"
}
$NameServer = (Get-AzDnsRecordSet @ns).Records[0].Nsdname

Resolve-DnsName -Name $DnsZone -Server $NameServer -Type A
```

The response contains A records with IP addresses, confirming that Traffic Manager Linked Records return IP addresses directly without a CNAME hop.

### Test failover

1. Browse to your domain. You should see the NGINX page for **vm-1**.
1. Stop the **vm-1** VM:

    ```azurepowershell-interactive
    Stop-AzVM -ResourceGroupName $ResourceGroup -Name "vm-1" -Force
    ```

1. Wait a few minutes for Traffic Manager to detect the endpoint as unhealthy.
1. Flush your local DNS cache if needed, then browse to your domain again. You should now see the page for **vm-2**.
1. Restart **vm-1** to restore the original configuration:

    ```azurepowershell-interactive
    Start-AzVM -ResourceGroupName $ResourceGroup -Name "vm-1"
    ```

## Clean up resources

When you no longer need the resources, remove the resource group and the DNS record:

```azurepowershell-interactive
# Delete the resource group and all resources within it
Remove-AzResourceGroup -Name $ResourceGroup -Force -AsJob

# Delete the Traffic Manager Linked Record from the DNS zone
$cleanup = @{
    ResourceGroupName = $DnsZoneResourceGroup
    ZoneName          = $DnsZone
    Name              = "@"
    RecordType        = "A"
}
Remove-AzDnsRecordSet @cleanup
```

## Next steps

In this tutorial, you created a Traffic Manager Linked Record using Azure PowerShell. The record links your DNS zone to a Traffic Manager profile, returning IP addresses directly to clients.

- Learn more about [Traffic Manager Linked Records](dns-traffic-manager-linked-records.md).
- Create a Traffic Manager Linked Record using [Azure CLI](tutorial-traffic-manager-linked-records-cli.md) or the [Azure portal](tutorial-traffic-manager-linked-records-portal.md).
- Learn more about [Traffic Manager routing methods](../traffic-manager/traffic-manager-routing-methods.md).
- Learn more about [Strictly Typed Profiles](../traffic-manager/traffic-manager-strictly-typed-profiles.md).
