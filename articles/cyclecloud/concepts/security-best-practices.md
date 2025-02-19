---
title: Security Best Practices
description: Learn about Azure CycleCloud Security Best Practices
author: prkannap
ms.date: 08/02/2021
ms.author: aevdokimova
---

# Azure CycleCloud – Security Best Practices

This article discusses the best practices and useful tips for using Azure CycleCloud more securely and effectively. You can use the best practices listed here as a quick reference when using Azure CycleCloud.

## Installation

The default installation of CycleCloud uses non-encrypted HTTP running on port 8080. We strongly recommend configuring SSL for all installations to prevent unencrypted access to your CycleCloud installation. CycleCloud should not be accessible from the internet, but if needed only port 443 should be exposed. If you want to restrict direct internet access, configure to use a proxy for all internet-bound HTTP and/or HTTPS traffic. To disable unencrypted communications and HTTP access to CycleCloud refer to [SSL configuration](~/articles/cyclecloud/how-to/ssl-configuration.md).

If you want to also restrict outbound internet access, it is possible to configure CycleCloud to use a proxy for all internet-bound HTTP and/or HTTPS traffic.  See [Operating in a Locked Down Environment](~/articles/cyclecloud/how-to/running-in-locked-down-network.md) for details.

## Authentication and Authorization

Azure CycleCloud offers four methods of authentication: a built-in database with encryption, Active Directory, LDAP, or Entra ID. Any account with five authorization failures within 60 seconds will automatically be locked for five minutes. Accounts can manually be unlocked by an administrator and are automatically unlocked after five minutes.

CycleCloud should be installed on a drive with only admin-group access. This will prevent non-admin users from accessing non-encrypted data. Non-admin users should not be included to this group. Ideally, access to the CycleCloud installation should be limited to only administrators.

Do not share CycleCloud installation across trust boundaries.  The RBAC controls within a single CycleCloud installation may not be sufficient in a true multi-tenant environment. Use separate and isolated CycleCloud installations for each tenant with critical data.

## Networking and Secret Management

The [virtual network](</azure/virtual-network/virtual-networks-overview>) that clusters are launched in should be locked down with [Network Security Groups](</azure/virtual-network/network-security-groups-overview>)(NSG). Access to specific ports is governed by a NSG, you have the option to configure and control the inbound/outbound network traffic to/from Azure resources within the Azure virtual network. A Network Security Group contains security rules that allow or deny inbound network traffic or outbound network traffic from several types of Azure resources.

We strongly recommend using at least two subnets. One for the CycleCloud installation VM and any other VMs with the same access policies, and additional subnets for the compute clusters. However, keep in mind that for large clusters, the IP range of the subnet may become a limiting factor. So, in general, the CycleCloud subnet should use a small CIDR (Classless Inter-Domain Routing) range and compute subnets should be large.

CycleCloud uses the Azure Resource Manager for managing clusters. To make calls to Azure Resource Manager, certain permissions are granted to CycleCloud by configuring [Managed Identity](~/articles/cyclecloud/how-to/managed-identities.md) on the CycleCloud VM. It is recommended to use either System-assigned or User-assigned Managed Identity. A system-assigned Managed Identity creates an identity in Azure AD that is tied to the lifecycle of that service instance. When that resource is deleted, the managed identity is automatically deleted. A user-assigned Managed Identity can be assigned to one or more instances of an Azure service. In this case, the managed identity is separately managed by the resources used.

## Secured Locked-down environment

Some secure production environments will lock down the environment and have limited internet access. Since Azure CycleCloud requires access to Azure Storage accounts and other supported Azure services, the recommended way to provide private access is through [Virtual Network Service Endpoints](/azure/virtual-network/virtual-network-service-endpoints-overview) or Private Link. Enabling Service Endpoints or Private Link allows you to secure your Azure service resources to your virtual network. Service endpoints add more security by enabling private IP addresses in the Virtual Network to reach endpoints of an Azure service.  

The CycleCloud application and cluster nodes can operate in environments with limited internet access, though there are a minimal number of TCP ports that must remain open. One way to limit outbound internet access from the CycleCloud VM without configuring the Azure Firewall or an HTTPS proxy is to configure a strict Azure Network Security Group for the CycleCloud Virtual machine's subnet. The simplest way to do that is to use [Service Tags](/azure/virtual-network/service-tags-overview)  in the subnet or VM level Network Security Group  to permit the required outbound Azure access. Service tags can be used in place of specific IP address when you create security rules, you can allow or deny the traffic for the corresponding service.
