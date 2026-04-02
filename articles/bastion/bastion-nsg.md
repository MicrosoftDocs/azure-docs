---
title: Configure NSG rules for Azure Bastion
description: Learn how to configure required network security group rules for Azure Bastion to protect your deployment, prevent unauthorized access, and keep your Bastion host healthy.
author: cherylmc
ms.service: azure-bastion
ms.topic: concept-article
ms.date: 02/24/2026
ms.author: cherylmc
# Customer intent: As a network administrator, I want to understand and configure network security groups for Azure Bastion, so that I can manage secure ingress and egress traffic to virtual machines while maintaining compliance and security practices. I want to understand the impact of not having the correct NSG rules in place from a security perspective. This is a procedural article. 
---
# Configure NSG rules for Azure Bastion

Azure Bastion supports NSGs on the AzureBastionSubnet and target VM subnets. Applying NSGs lets you enforce least-privilege network access, restrict traffic to only the ports and sources Bastion requires, and prevent unauthorized lateral movement within your virtual network. If you apply an NSG, you must configure all required ingress and egress rules. Omitting any rule can prevent Bastion from receiving platform updates and block VM connectivity.

For more information about NSGs, see [Security groups](../virtual-network/network-security-groups-overview.md).

:::image type="content" source="./media/bastion-nsg/figure-1.png" alt-text="NSG":::

In this diagram:

* The Bastion host is deployed to the virtual network.
* The user connects to the Azure portal using any HTML5 browser.
* The user navigates to the Azure virtual machine to RDP/SSH.
* Connect Integration - Single-click RDP/SSH session inside the browser
* No public IP is required on the Azure VM.

## <a name="nsg"></a>Setting up network security groups (NSG)

This section shows you the network traffic between the user and Azure Bastion, and through to target VMs in your virtual network:

> [!IMPORTANT]
> If you apply an NSG to your Azure Bastion resource, you **must** create all of the following ingress and egress traffic rules. Omitting any rule blocks your Bastion host from receiving platform updates and opens your deployment to future security vulnerabilities.

The following table summarizes all required NSG rules.

| Rule name | Direction | Source | Destination | Port(s) | Protocol |
|---|---|---|---|---|---|
| AllowHttpsInbound | Inbound | Internet | * | 443 | TCP |
| AllowGatewayManagerInbound | Inbound | GatewayManager | * | 443 | TCP |
| AllowBastionHostCommunication | Inbound | VirtualNetwork | VirtualNetwork | 8080, 5701 | * |
| AllowAzureLoadBalancerInbound | Inbound | AzureLoadBalancer | * | 443 | TCP |
| AllowSshRdpOutbound | Outbound | * | VirtualNetwork | 22, 3389 | * |
| AllowAzureCloudOutbound | Outbound | * | AzureCloud | 443 | TCP |
| AllowBastionCommunication | Outbound | VirtualNetwork | VirtualNetwork | 8080, 5701 | * |
| AllowHttpOutbound | Outbound | * | Internet | 80 | * |

You can configure the required NSG rules using the Azure portal or PowerShell.

### [Portal](#tab/portal)

### <a name="apply"></a>AzureBastionSubnet

Use the following steps to configure NSG rules for the AzureBastionSubnet.

1. Sign in to the [Azure portal](https://portal.azure.com).
1. Go to **Network security groups** and select the NSG that's associated with your **AzureBastionSubnet**.
1. Select **Inbound security rules** on the left side, then select **+ Add** to create the following ingress rules:

   * **Ingress from internet (port 443):** Enable port 443 inbound from the **Internet** service tag. Ports 3389 and 22 are not required on AzureBastionSubnet. The source can be **Internet** or a set of specific public IP addresses you specify.
   * **Ingress from GatewayManager (port 443):** Enable port 443 inbound from the **GatewayManager** service tag. This allows the control plane (Gateway Manager) to communicate with your Bastion host.
   * **Ingress from VirtualNetwork (ports 8080, 5701):** Enable ports 8080 and 5701 inbound from the **VirtualNetwork** service tag to the **VirtualNetwork** service tag. This enables the internal components of Azure Bastion to communicate with each other.
   * **Ingress from AzureLoadBalancer (port 443):** Enable port 443 inbound from the **AzureLoadBalancer** service tag. This enables Azure Load Balancer to detect connectivity for health probes.


   :::image type="content" source="./media/bastion-nsg/inbound.png" alt-text="Screenshot shows inbound security rules for Azure Bastion connectivity." lightbox="./media/bastion-nsg/inbound.png":::

1. Select **Outbound security rules** on the left side, then select **+ Add** to create the following egress rules:

   * **Egress to target VMs (ports 3389, 22):** Enable outbound traffic to target VM subnets on ports 3389 and 22 over private IP. If you use the custom port feature with the Standard SKU, allow outbound traffic to the **VirtualNetwork** service tag instead.
   * **Egress to VirtualNetwork (ports 8080, 5701):** Enable ports 8080 and 5701 outbound from the **VirtualNetwork** service tag to the **VirtualNetwork** service tag. This enables the internal components of Azure Bastion to communicate with each other.
   * **Egress to AzureCloud (port 443):** Enable port 443 outbound to the **AzureCloud** service tag. This allows Bastion to connect to Azure public endpoints for storing diagnostics logs and metering logs.
   * **Egress to Internet (port 80):** Enable port 80 outbound to **Internet** for session validation, Bastion Shareable Link, and certificate validation.


   :::image type="content" source="./media/bastion-nsg/outbound.png" alt-text="Screenshot shows outbound security rules for Azure Bastion connectivity." lightbox="./media/bastion-nsg/outbound.png":::

### Target VM subnet

Use the following steps to configure the NSG rules for the subnet that contains your target virtual machine.

1. In the Azure portal, go to **Network security groups** and select the NSG that's associated with your target VM subnet.
1. Select **Inbound security rules**, then select **+ Add** to create the following rule:

   * **Ingress from AzureBastionSubnet (ports 3389, 22):** Open RDP/SSH ports (3389 and 22 respectively, or custom values if you use the custom port feature with Standard or Premium SKU) inbound on the target VM subnet over private IP. Without this rule, Bastion can't reach your VMs even when it's correctly configured. As a best practice, scope the source to the AzureBastionSubnet IP address range so that only Bastion can open these ports -- not the broader internet.

### [PowerShell](#tab/powershell)

Use the following script to create all required NSG rules for Azure Bastion.

```azurepowershell
# Connect to Azure Account
Connect-AzAccount
# Get the Network Security Group details
$resourceGroupName = Read-Host ("Enter the name of the Resource Group")
$nsgName = Read-Host ("Enter the name of the Network Security Group")
# Ingress and Egress rules
$rules = @(
    @{
        Name = "AllowHttpsInbound"
        Priority = 120
        Direction = "Inbound"
        Access = "Allow"
        SourceAddressPrefix = "Internet"
        SourcePortRange = "*"
        DestinationAddressPrefix = "*"
        DestinationPortRange = "443"
        Protocol = "TCP"
    },
    @{
        Name = "AllowGatewayManagerInbound"
        Priority = 130
        Direction = "Inbound"
        Access = "Allow"
        SourceAddressPrefix = "GatewayManager"
        SourcePortRange = "*"
        DestinationAddressPrefix = "*"
        DestinationPortRange = "443"
        Protocol = "TCP"
    },
    @{
        Name = "AllowAzureLoadBalancerInbound"
        Priority = 140
        Direction = "Inbound"
        Access = "Allow"
        SourceAddressPrefix = "AzureLoadBalancer"
        SourcePortRange = "*"
        DestinationAddressPrefix = "*"
        DestinationPortRange = "443"
        Protocol = "TCP"
    },
    @{
        Name = "AllowBastionHostCommunication"
        Priority = 150
        Direction = "Inbound"
        Access = "Allow"
        SourceAddressPrefix = "VirtualNetwork"
        SourcePortRange = "*"
        DestinationAddressPrefix = "VirtualNetwork"
        DestinationPortRange = 8080,5701
        Protocol = "Tcp"
    }
    @{
        Name = "AllowSshRdpOutbound"
        Priority = 100
        Direction = "Outbound"
        Access = "Allow"
        SourceAddressPrefix = "*"
        SourcePortRange = "*"
        DestinationAddressPrefix = "VirtualNetwork"
        DestinationPortRange = 22,3389
        Protocol = "Tcp"
    },
    @{
        Name = "AllowAzureCloudOutbound"
        Priority = 110
        Direction = "Outbound"
        Access = "Allow"
        SourceAddressPrefix = "*"
        SourcePortRange = "*"
        DestinationAddressPrefix = "AzureCloud"
        DestinationPortRange = "443"
        Protocol = "TCP"
    },
    @{
        Name = "AllowBastionCommunication"
        Priority = 120
        Direction = "Outbound"
        Access = "Allow"
        SourceAddressPrefix = "VirtualNetwork"
        SourcePortRange = "*"
        DestinationAddressPrefix = "VirtualNetwork"
        DestinationPortRange = 8080,5701
        Protocol = "Tcp"
    },
    @{
        Name = "AllowHttpOutbound"
        Priority = 130
        Direction = "Outbound"
        Access = "Allow"
        SourceAddressPrefix = "*"
        SourcePortRange = "*"
        DestinationAddressPrefix = "Internet"
        DestinationPortRange = "80"
        Protocol = "Tcp"
    }
 )
foreach ($rule in $rules) {
    $nsgRule = New-AzNetworkSecurityRuleConfig -Name $rule.Name `
        -Priority $rule.Priority `
        -Direction $rule.Direction `
        -Access $rule.Access `
        -SourceAddressPrefix $rule.SourceAddressPrefix `
        -SourcePortRange $rule.SourcePortRange `
        -DestinationAddressPrefix $rule.DestinationAddressPrefix `
        -DestinationPortRange $rule.DestinationPortRange `
        -Protocol $rule.Protocol
 # Get the details of the Network Security Group and Add rules to the group
    $nsg = Get-AzNetworkSecurityGroup -ResourceGroupName $resourceGroupName -Name $nsgName
    $nsg.SecurityRules.Add($nsgRule)
    Set-AzNetworkSecurityGroup -NetworkSecurityGroup $nsg
}
```

---

## Next steps

* Learn how to [secure your Azure Bastion deployment](secure-bastion.md) using actionable guidance aligned to the Microsoft Cloud Security Benchmark.
* Learn about the different [deployment architectures available with Azure Bastion](design-architecture.md), depending on the selected SKU and option configurations.
* Learn how to [deploy Bastion as private-only](private-only-deployment.md) to ensure secure access to virtual machines without allowing outbound access outside of the virtual network.
* Learn how to [monitor Azure Bastion](monitor-bastion.md) by using Azure Monitor to collect and analyze performance data and logs.
* Learn how [virtual network peering and Azure Bastion](vnet-peering.md) can be used together to connect to VMs deployed in a peered virtual network without deploying an additional bastion host.
* Learn about [frequently asked questions for Azure Bastion](bastion-faq.md).
