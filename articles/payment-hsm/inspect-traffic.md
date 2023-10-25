---
title: Azure Payment HSM traffic inspection
description: Guiance on how to bypass the UDR restriction and inspect traffic destined to an Azure Payment HSM.
services: payment-hsm
ms.service: payment-hsm
author: dawlysd
ms.author: dasantiago
ms.topic: quickstart
ms.date: 04/06/2023
---

# Azure Payment HSM traffic inspection

Azure Payment Hardware Security Module (Payment HSM or PHSM) is a [bare-metal service](overview.md) providing cryptographic key operations for real-time and critical payment transactions in the Azure cloud. For more information, see [What is Azure Payment HSM?](overview.md). 

When Payment HSM is deployed, it comes with a host network interface and a management network interface. There are several deployment scenarios:

1. [With host and management ports in same VNet](create-payment-hsm.md?tabs=azure-cli)
2. [With host and management ports in different VNets](create-different-vnet.md?tabs=azure-cli)
3. [With host and management port with IP addresses in different VNets](create-different-ip-addresses.md?tabs=azure-cli)

In all of the above scenarios, Payment HSM is a VNet-injected service in a delegated subnet: `hsmSubnet` and `managementHsmSubnet` must be delegated to `Microsoft.HardwareSecurityModules/dedicatedHSMs` service.

> [!IMPORTANT]
> The `FastPathEnabled` feature must be [registered and approved](register-payment-hsm-resource-providers.md?tabs=azure-cli#register-the-resource-providers-and-features) on all subscriptions that need access to Payment HSM. You must also enable the `fastpathenabled` tag on the VNet hosting the Payment HSM delegated subnet and on every peered VNet requiring [connectivity to the Payment HSM devices](peer-vnets.md?tabs=azure-cli).
> 
> For the `fastpathenabled` VNet tag to be valid, the `FastPathEnabled` feature must be enabled on the subscription where that VNet is deployed. Both steps must be completed to enable resources to connect to the Payment HSM devices. For more information, see [FastPathEnabled](fastpathenabled.md).

PHSM isn't compatible with vWAN topologies or cross region VNet peering, as listed in the [topology supported](solution-design.md#supported-topologies). Payment HSM comes with some policy [restrictions](solution-design.md#constraints) on these subnets: **Network Security Groups (NSGs) and User-Defined Routes (UDRs) are currently not supported**.

It's possible to bypass the current UDR restriction and inspect traffic destined to a Payment HSM. This article presents two ways: a firewall with source network address translation (SNAT), and a firewall with reverse proxy.

## Firewall with source network address translation (SNAT)

This design is inspired by the [Dedicated HSM solution architecture](../dedicated-hsm/networking.md#solution-architecture).

The firewall **SNATs the client IP address** before forwarding traffic to the PHSM NIC, guaranteeing that the return traffic will automatically be directed back to the Firewall. Either an Azure Firewall or a third party FW NVA can be used in this design.

:::image type="content" source="./media/firewall-snat-architecture-diagram.png" alt-text="Architecture diagram of the firewall with SNAT" lightbox="./media/firewall-snat-architecture-diagram.png":::

Route tables required:
- On-premises to PHSM: a Route Table containing a UDR for the Payment HSM VNet range and pointing to the central hub Firewall is applied to the GatewaySubnet.
- Spoke VNet(s) to PHSM: a Route Table containing the usual default route pointing to the central hub Firewall is applied to the Spoke VNet(s) subnets. 

Results:
- UDRs not being supported on the PHSM subnet is addressed by the Firewall doing SNAT on the client IP: when forwarding traffic to PHSM, the return traffic will automatically be directed back to the Firewall.
- Filtering rules that cannot be enforced using NSGs on the PHSM subnet can be configured on the Firewall.
- Both Spoke traffic and on-premises traffic to the PHSM environment are secured.

## Firewall with reverse proxy

This design is a good option when performing SNAT on a Firewall that has not been approved by network security teams, requiring instead to keep the source and destination IPs unchanged for traffic crossing the Firewall.

This architecture uses a reverse proxy, deployed in a dedicated subnet in the PHSM VNet directly or in a peered VNet. Instead of sending traffic to the PHSM devices, the destination is set to the reverse proxy IP, located in a subnet that does not have the restrictions of the PHSM delegated subnet: both NSGs and UDRs can be configured, and combined with a Firewall in the central hub.

:::image type="content" source="./media/firewall-reverse-proxy-architecture-diagram.png" alt-text="Architecture diagram of the firewall with reverse proxy" lightbox="./media/firewall-reverse-proxy-architecture-diagram.png":::

This solution requires a reverse proxy, such as:

- F5 (Azure Marketplace; VM-based)
- NGINXaaS (Azure Marketplace; PaaS fully managed)
- Reverse proxy Server using NGINX (VM-based)
- Reverse proxy Server using HAProxy (VM-based)

Example of reverse proxy Server using NGINX (VM-based) configuration to load balance tcp traffic:

```conf
# Nginx.conf  
stream { 
    server { 
        listen 1500; 
        proxy_pass 10.221.8.4:1500; 
    } 

    upstream phsm { 
        server 10.221.8.5:443; 
    } 

    server { 
        listen 443; 
        proxy_pass phsm; 
        proxy_next_upstream on; 
    } 
} 
```

Route tables required:
- On-premises to PHSM: a Route Table containing a UDR for the Payment HSM VNet range and pointing to the central hub Firewall is applied to the GatewaySubnet.
- Spoke VNet(s) to PHSM: a Route Table containing the usual default route pointing to the central hub Firewall is applied to the Spoke VNet(s) subnets. 

> [!IMPORTANT]
> Gateway Route propagation must be disabled on the reverse proxy subnet, so that a 0/0 UDR is enough to force the return traffic via the firewall.

Results:
- UDRs not being supported on the PHSM subnet can be configured on the reverse proxy subnet.
- The reverse proxy SNATs the client IP: when forwarding traffic to PHSM, the return traffic will automatically be directed back to the reverse proxy.
- Filtering rules that cannot be enforced using NSGs on the PHSM subnet can be configured on the Firewall and/or on NSGs applied to the reverse proxy subnet.
- Both Spoke traffic and on-premises traffic to the PHSM environment are secured.

## Next steps

- [What is Azure Payment HSM?](overview.md)
- [Azure Payment HSM solution design](solution-design.md)
- [Azure Payment HSM deployment scenarios](deployment-scenarios.md)
- [Get started with Azure Payment HSM](getting-started.md)
- [Create a payment HSM](create-payment-hsm.md)
- [Frequently asked questions](faq.yml)
