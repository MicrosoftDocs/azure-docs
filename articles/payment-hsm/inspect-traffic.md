---
title: Access the payShield manager for your Azure Payment HSM
description: Access the payShield manager for your Azure Payment HSM
services: payment-hsm
ms.service: payment-hsm
author: msmbaldwin
ms.author: mbaldwin
ms.topic: quickstart
ms.date: 04/06/2023
---

# How to inspect Azure Payment HSM traffic

Intent of this article is to explain how to inspect traffic to Azure Payment HSM.

Payment Hardware Security Module (Payment HSM or PHSM) is a [bare-metal service](overview.md) providing cryptographic key operations for real-time and critical payment transactions in the Azure cloud. 

Payment HSM devices are a variation of Dedicated HSM devices with more advanced cryptographic modules and features: a Payment HSM never decrypts the PIN value in transit for example.

The Azure Payment HSM solution uses hardware from [Thales](https://cpl.thalesgroup.com/encryption/hardware-security-modules/payment-hsms/payshield-10k) as a vendor. Customers have [full control and exclusive access](overview.md#customer-managed-hsm-in-azure) to the Payment HSM.

## Azure Payment HSM - Networking

When Payment HSM is deployed, it comes with a host network interface and a management network interface. There are several deployment scenarios:
1. [With host and management ports in same VNet](create-payment-hsm.md?tabs=azure-cli)
2. [With host and management ports in different VNets](create-different-vnet.md?tabs=azure-cli)
3. [With host and management port with IP addresses in different VNets](create-different-ip-addresses.md?tabs=azure-cli)

In all of the above scenarios, Payment HSM is a VNet-injected service in a delegated subnet: `hsmSubnet` and `managementHsmSubnet` must be delegated to `Microsoft.HardwareSecurityModules/dedicatedHSMs` service.

## FastPathEnabled feature flag & fastpathenabled VNet tag

In addition, the `FastPathEnabled` **feature** must be [registered and approved](https://learn.microsoft.com/en-us/azure/payment-hsm/register-payment-hsm-resource-providers?tabs=azure-cli#register-the-resource-providers-and-features) on all subscriptions that need access to Payment HSM.

A second step consists in enabling the `fastpathenabled` **tag** on the VNet hosting the Payment HSM delegated subnet and on every peered VNet requiring [connectivity to the Payment HSM devices](https://learn.microsoft.com/en-us/azure/payment-hsm/peer-vnets?tabs=azure-cli). This operation must be done via CLI.

For the `fastpathenabled` VNet tag to be valid, the `FastPathEnabled` feature needs to be enabled on the subscription where that VNet is deployed: make sure to complete both steps to enable resources to connect to the Payment HSM devices. 

Adding the `FastPathEnabled` feature and enabling the `fastpathenabled` tag don't cause any downtime.

The public documentation related to these 2 settings is now available [here](fastpathenabled.md).
 
## Azure Payment HSM - Networking limitations

Payment HSM comes with some policy [restrictions](solution-design.md#constraints) on these subnets: **Network Security Groups (NSGs) and User-Defined Routes (UDRs) are currently not supported**.

> Note: PHSM is not compatible with vWAN topologies or cross region VNet peering, as listed in the [topology supported](solution-design.md#supported-topologies).

This article present two ways to inspect traffic destined to a Payment HSM: a firewall with source network address translation (SNAT), and a firewall with reverse proxy

# Firewall with source network address translation (SNAT)

This design is inspired by the [Dedicated HSM solution architecture](networking.md#solution-architecture).

The firewall **SNATs the client IP address** before forwarding traffic to the PHSM NIC, guaranteeing that the return traffic will automatically be directed back to the Firewall. Either an Azure Firewall or a 3rd party FW NVA can be used in this design.

![image](docs/solution1fp.png)

:::image type="content" source="./media/firewall-snat-architecture-diagram.png" alt-text="Architecture diagram of the firewall with SNAT":::

Route tables required:
- On-Prem to PHSM: a Route Table containing a UDR for the Payment HSM VNet range and pointing to the central hub Firewall is applied to the GatewaySubnet.
- Spoke VNet(s) to PHSM: a Route Table containing the usual default route pointing to the central hub Firewall is applied to the Spoke VNet(s) subnets. 

Results:
- UDRs not being supported on the PHSM subnet is addressed by the Firewall doing SNAT on the client IP: when forwarding traffic to PHSM, the return traffic will automatically be directed back to the Firewall.
- Filtering rules that cannot be enforced using NSGs on the PHSM subnet can be configured on the Firewall.
- Both Spoke traffic and On-Prem traffic to the PHSM environment are secured.

## Firewall with reverse proxy

This design is a good option when performing SNAT on the Firewall is not approved by network security teams, requiring instead to keep the source and destination IPs unchanged for traffic crossing the Firewall.

This architecture leverages a reverse proxy, deployed in a dedicated subnet in the PHSM VNet directly or in a peered VNet. Instead of sending traffic to the PHSM devices, the destination is set to the reverse proxy IP, located in a subnet that does not have the restrictions of the PHSM delegated subnet: both NSGs and UDRs can be configured, and combined with a Firewall in the central hub.

:::image type="content" source="./media/firewall-reverse-proxy-architecture-diagram.png" alt-text="Architecture diagram of the firewall with reverse proxy":::

This solution requires a reverse proxy, such as:

- F5 (Azure Marketplace ; VM-based)
- NGINXaaS (Azure Marketplace ; PaaS fully managed)
- Reverse proxy Server using NGINX (VM-based)
- Reverse proxy Server using HAProxy (VM-based)

Example of reverse proxy Server using NGINX (VM-based) configuration:

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
- On-Prem to PHSM: a Route Table containing a UDR for the Payment HSM VNet range and pointing to the central hub Firewall is applied to the GatewaySubnet.
- Spoke VNet(s) to PHSM: a Route Table containing the usual default route pointing to the central hub Firewall is applied to the Spoke VNet(s) subnets. 

> [!IMPORTANT]
> Gateway Route propagation must be disabled on the reverse proxy subnet, so that a 0/0 UDR is enough to force the return traffic via the firewall.

Results:
- UDRs not being supported on the PHSM subnet can be configured on the reverse proxy subnet.
- The reverse proxy SNATs the client IP: when forwarding traffic to PHSM, the return traffic will automatically be directed back to the reverse proxy.
- Filtering rules that cannot be enforced using NSGs on the PHSM subnet can be configured on the Firewall and/or on NSGs applied to the reverse proxy subnet.
- Both Spoke traffic and On-Prem traffic to the PHSM environment are secured.

## Next steps