---
title: Turn on public IP on the NSX Edge gateway for Azure VMware Solution
description: Learn how to turn on internet access for your Azure VMware Solution.
ms.topic: how-to
ms.service: azure-vmware
ms.date: 12/12/2023
ms.custom: engagement-fy23
---

# Turn on public IP on an NSX Edge node to run NSX-T Data Center for Azure VMware Solution

In this article, learn how to turn on public IP on a VMware NSX Edge node to run VMware NSX-T Data Center for your instance of Azure VMware Solution.

> [!TIP]
> Before you turn on internet access to your instance of Azure VMware Solution, review [internet connectivity design considerations](concepts-design-public-internet-access.md).

Public IP on an NSX Edge node for NSX-T Data Center is a feature in Azure VMware Solution that turns on inbound and outbound internet access for your Azure VMware Solution environment.

> [!IMPORTANT]
> Public IPv4 address usage can be consumed directly in Azure VMware Solution and charged based on the public IPv4 prefix that's shown in [Pricing - Virtual machine IP address options](https://azure.microsoft.com/pricing/details/ip-addresses/). No charges for data ingress or egress are related to this service.

The public IP is configured in Azure VMware Solution through the Azure portal and the NSX-T Data Center interface within your Azure VMware Solution private cloud.

With this capability, you have the following features:

- A cohesive and simplified experience for reserving and using a public IP down to the NSX Edge node.
- The ability to receive up to 1,000 or more public IPs, so you can turn on internet access at scale.
- Inbound and outbound internet access for your workload VMs.
- Distributed denial-of-service (DDoS) security protection against network traffic to and from the internet.
- VMware HCX migration support over the public internet.

> [!IMPORTANT]
> You can set up a maximum of 64 total public IP addresses across these network blocks. If you want to configure more than 64 public IP addresses, please submit a support ticket stating how many.

## Prerequisites

- Azure VMware Solution private cloud
- DNS Server configured on the NSX-T Data Center

## Reference architecture

The following figure shows internet access to and from your Azure VMware Solution private cloud via a public IP address directly to the NSX Edge node for NSX-T Data Center.

:::image type="content" source="media/public-ip-nsx-edge/architecture-internet-access-avs-public-ip.png" alt-text="Diagram that shows architecture of internet access to and from your Azure VMware Solution Private Cloud using a public IP directly to the NSX Edge." border="false" lightbox="media/public-ip-nsx-edge/architecture-internet-access-avs-public-ip.png":::

> [!IMPORTANT]
> Using a public IP at the NSX Edge node for NSX-T Data Center is not compatible with reverse DNS lookup. If you use this scenario, you can't host a mail server in Azure VMware Solution.

## Configure a public IP in the Azure portal

1. Sign in to the Azure portal. Go to your Azure VMware Solution private cloud.
1. On the resource menu under **Workload networking**, select **Internet connectivity**.
1. Select the **Connect using Public IP down to the NSX-T Edge** checkbox.

    > [!IMPORTANT]
    > Before you select a public IP address, ensure that you understand the implications to your existing environment. For more information, see [Internet connectivity design considerations](concepts-design-public-internet-access.md). This should include a risk mitigation review with your relevant networking and security governance and compliance teams.

1. Select **Public IP**.

    :::image type="content" source="media/public-ip-nsx-edge/public-ip-internet-connectivity.png" alt-text="Diagram that shows how to select public IP to the NSX Edge node.":::

1. Enter a value for **Public IP name**. In the **Address space** dropdown, select a subnet size. Then, select **Configure**.

   This public IP should be configured within 20 minutes. Check that the subnet is listed.

   :::image type="content" source="media/public-ip-nsx-edge/public-ip-subnet-internet-connectivity.png" alt-text="Diagram that shows internet connectivity in Azure VMware Solution.":::

   If you don't see the subnet, refresh the list. If the refresh fails, try the configuration again.

1. After you set the public IP, select the **Connect using the public IP down to the NSX-T Edge** checkbox to turn off all other internet options.

1. Select **Save**.

You successfully turned on internet connectivity for your Azure VMware Solution private cloud and reserved a Microsoft-allocated public IP address. You can now configure this public IP address to the NSX Edge node for NSX-T Data Center Edge to use for your workloads.  NSX-T Data Center is used for all virtual machine (VM) communication.

You have three options for configuring your reserved public IP address to the NXS Edge node to NSX-T Data Center:

- Outbound internet access for VMs
- Inbound internet access for VMs
- A gateway firewall to filter traffic to VMs at T1 gateways

### Outbound internet access for VMs

A Source Network Address Translation (SNAT) ser ice with Port Address Translation (PAT) is used to allow many VMs to use one SNAT service. This connection means that you can provide internet connectivity for many VMs.

> [!IMPORTANT]
> To enable SNAT for your specified address ranges, you must [configure a gateway firewall rule](#gateway-firewall-used-to-filter-traffic-to-vms-at-t1-gateways) and SNAT for the specific address ranges you want to use. If you don't want SNAT turned on for specific address ranges, you must create a [No-NAT rule](#no-network-address-translation-rule-for-specific-address-ranges) for the address ranges to exclude. For your SNAT service to work as expected, the No-NAT rule should be a lower priority than the SNAT rule.

#### Create a SNAT rule

1. In your Azure VMware Solution private cloud, select **vCenter Server Credentials**.
1. Go to your NSX Manager URL and credentials.
1. Sign in to VMware NSX Manager.
1. Go to **NAT Rules**.
1. Select the T1 router.
1. Select **Add NAT Rule**.
1. Enter a name for the rule.
1. Select **SNAT**.

   Optionally, enter a source, such as a subnet to SNAT or a destination.

1. Enter the translated IP address. This IP address is from the range of public IP addresses that you reserved in the Azure VMware Solution portal.

   1. Optionally, give the rule a higher-priority number. This prioritization moves the rule further down the rule list to ensure that more specific rules are matched first.

1. Select **Save**.

Logging is turned on via the logging slider. For more information on NSX-T Data Center NAT configuration and options, see the
[NSX-T Data Center NAT Administration Guide](https://docs.vmware.com/en/VMware-NSX-T-Data-Center/3.1/administration/GUID-7AD2C384-4303-4D6C-A44A-DEF45AA18A92.html).

#### Create a No-NAT rule

A No-SNAT rule in NSX-T Manager can be used to exclude certain matches from performing Network Address Translation. This policy can be used to allow private IP traffic to bypass existing network translation rules.

1. In your Azure VMware Solution private cloud, select **vCenter Server Credentials**.
1. Go to your NSX Manager URL and credentials.
1. Sign in to VMware NSX Manager, and then select **NAT Rules**.
1. Select the T1 router, and then select **Add NAT Rule**.
1. Select **No SNAT** rule as the type of NAT rule.
1. Select the **Source IP** value as the range of addresses you don't want to be translated. The **Destination IP** value should be any internal addresses that you're reaching from the range of source IP ranges.
1. Select **Save**.

### Inbound internet access for VMs

A Destination Network Translation (DNAT) service is used to expose a VM on a specific public IP address or on a specific port. This service provides inbound internet access to your workload VMs.

#### Create a DNAT rule

1. In your Azure VMware Solution private cloud, select **vCenter Server Credentials**.
1. Go to your NSX Manager URL and credentials.
1. Sign in to VMware NSX Manager, and then select **NAT Rules**.
1. Select the T1 router, and then select **Add DNAT Rule**.
1. Enter a name for the rule.
1. Select **DNAT** as the action.
1. Enter the reserved public IP address in the destination match. This IP is from the range of public IPs that are reserved in the Azure VMware Solution portal.
1. In the translated IP, enter the VM Private IP.
1. Select **Save**.

   Optionally, configure the translated port or source IP for more specific matches.

The VM is now exposed to the internet on the specific public IP or specific ports.

### Use a gateway firewall to filter traffic to VMs at T1 gateways

You can provide security protection for your network traffic in and out of the public internet through your gateway firewall.

1. In your Azure VMware Solution private cloud, select **VMware credentials**.
1. Go to your NSX Manager URL and credentials.
1. Sign in to VMware NSX Manager.
1. On the NSX-T overview page, select **Gateway Policies**.
1. Select **Gateway Specific Rules**, choose the T1 gateway, and then select **Add Policy**.
1. Select **New Policy** and enter a policy name.
1. Select the policy and select **Add Rule**.
1. Configure the rule

    1. Select **New Rule**.
    1. Enter a descriptive name.
    1. Configure the source, destination, services, and action.

1. Select **Match External Address** to apply firewall rules to the external address of a NAT rule.

   For example, the following rule is set to **Match External Address**. The setting allows SSH traffic inbound to the public IP.

   :::image type="content" source="media/public-ip-nsx-edge/gateway-specific-rules-match-external-connectivity.png" alt-text="Screenshot that shows internet connectivity inbound to the public IP." lightbox="media/public-ip-nsx-edge/gateway-specific-rules-match-external-connectivity-expanded.png":::

If **Match Internal Address** was specified, the destination would be the internal or private IP address of the VM.

For more information on the NSX-T Data Center gateway firewall, see the [NSX-T Data Center Gateway Firewall Administration Guide]( https://docs.vmware.com/en/VMware-NSX-T-Data-Center/3.1/administration/GUID-A52E1A6F-F27D-41D9-9493-E3A75EC35481.html).
The Distributed Firewall can be used to filter traffic to VMs. This feature is outside the scope of this article. For more information, see [NSX-T Data Center Distributed Firewall Administration Guide]( https://docs.vmware.com/en/VMware-NSX-T-Data-Center/3.1/administration/GUID-6AB240DB-949C-4E95-A9A7-4AC6EF5E3036.html).

## Related content

- [Internet connectivity design considerations (preview)](concepts-design-public-internet-access.md)
- [Turn on Managed SNAT for Azure VMware Solution workloads (preview)](enable-managed-snat-for-workloads.md)
- [Turn off internet access or enable a default route](disable-internet-access.md)
- [Enable HCX access over the internet](enable-hcx-access-over-internet.md)
