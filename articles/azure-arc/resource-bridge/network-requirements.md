---
title: Azure Arc resource bridge (preview) network requirements
description: Learn about network requirements for Azure Arc resource bridge (preview) including URLs that must be allowlisted.
ms.topic: conceptual
ms.date: 01/27/2023
---

# Azure Arc resource bridge (preview) network requirements

This article describes the networking requirements for deploying Azure Arc resource bridge (preview) in your enterprise.

## Configuration requirements

### Static Configuration

Static configuration is recommended for Arc resource bridge because the resource bridge needs three static IPs in the same subnet for the control plane, appliance VM, and reserved appliance VM (for upgrade). The control plane corresponds to the `controlplanenedpoint` parameter, the appliance VM IP to `k8snodeippoolstart`, and reserved appliance VM to `k8snodeippoolend` in the `createconfig` command that creates the bridge configuration files. If using DHCP, reserve those IP addresses, ensuring they are outside the DHCP range.

### IP Address Prefix

The subnet of the IP addresses for Arc resource bridge must lie in the IP address prefix that is passed in the `ipaddressprefix` parameter of the `createconfig` command. The IP address prefix is the IP prefix that is exposed by the network to which Arc resource bridge is connected. It is entered as the subnet's IP address range for the virtual network and subnet mask (IP Mask) in CIDR notation, for example `192.168.7.1/24`. Consult your system or network administrator to obtain the IP address prefix in CIDR notation. An IP Subnet CIDR calculator may be used to obtain this value.

### Gateway

The gateway address provided in the `createconfig` command must be in the same subnet specified in the IP address prefix.

### DNS Server

DNS Server must have internal and external endpoint resolution. The appliance VM and control plane need to resolve the management machine and vice versa. All three must be able to reach the required URLs for deployment.

## General network requirements

[!INCLUDE [network-requirement-principles](../includes/network-requirement-principles.md)]

[!INCLUDE [network-requirements](includes/network-requirements.md)]

## Additional network requirements

In addition, resource bridge (preview) requires connectivity to the Arc-enabled Kubernetes endpoints.

[!INCLUDE [network-requirements](../kubernetes/includes/network-requirements.md)]

> [!NOTE]
> The URLs listed here are required for Arc resource bridge only. Other Arc products (such as Arc-enabled VMware vSphere) may have additional required URLs. For details, see [Azure Arc network requirements](../network-requirements-consolidated.md).

## SSL proxy configuration

Azure Arc resource bridge must be configured for proxy so that it can connect to the Azure services. This configuration is handled automatically. However, proxy configuration of the management machine isn't configured by the Azure Arc resource bridge.

There are only two certificates that should be relevant when deploying the Arc resource bridge behind an SSL proxy: the SSL certificate for your SSL proxy (so that the host and guest trust your proxy FQDN and can establish an SSL connection to it), and the SSL certificate of the Microsoft download servers. This certificate must be trusted by your proxy server itself, as the proxy is the one establishing the final connection and needs to trust the endpoint. Non-Windows machines may not trust this second certificate by default, so you may need to ensure that it's trusted.

## Next steps

- Review the [Azure Arc resource bridge (preview) overview](overview.md) to understand more about requirements and technical details.
- Learn about [security configuration and considerations for Azure Arc resource bridge (preview)](security-overview.md).
