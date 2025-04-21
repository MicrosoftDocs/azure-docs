---
title: Security Best Practices
description: Learn about Azure CycleCloud Security Best Practices
author: prkannap
ms.date: 08/02/2021
ms.author: aevdokimova
---

# Azure CycleCloud – Security best practices

This article discusses the best practices and useful tips for using Azure CycleCloud more securely and effectively. You can use the best practices listed here as a quick reference when using Azure CycleCloud.

## Installation

The default installation of CycleCloud uses nonencrypted HTTP running on port 8080. We strongly recommend configuring SSL for all installations to prevent unencrypted access to your CycleCloud installation. CycleCloud shouldn't be accessible from the internet, but if needed, expose only port 443. If you want to restrict direct internet access, configure a proxy for all internet-bound HTTP and HTTPS traffic. For more information about disabling unencrypted communications and HTTP access to CycleCloud, see [SSL configuration](~/articles/cyclecloud/how-to/ssl-configuration.md).

If you also want to restrict outbound internet access, configure CycleCloud to use a proxy for all internet-bound HTTP and HTTPS traffic. For more information, see [Operating in a Locked Down Environment](~/articles/cyclecloud/how-to/running-in-locked-down-network.md).

## Authentication and authorization

Azure CycleCloud offers four methods of authentication: a built-in database with encryption, Active Directory, LDAP, or Entra ID. If an account has five authorization failures within 60 seconds, it locks automatically for five minutes. An administrator can manually unlock accounts, and the system automatically unlocks accounts after five minutes.

Install CycleCloud on a drive with only admin-group access. This configuration prevents non-admin users from accessing nonencrypted data. Don't include nonadmin users in this group. Ideally, limit access to the CycleCloud installation to only administrators.

Don't share CycleCloud installation across trust boundaries. The RBAC controls within a single CycleCloud installation might not be sufficient in a true multitenant environment. Use separate and isolated CycleCloud installations for each tenant with critical data.

## Networking and secret management

Lock down the [virtual network](</azure/virtual-network/virtual-networks-overview>) where you launch clusters with [Network Security Groups](</azure/virtual-network/network-security-groups-overview>)(NSG). A NSG governs access to specific ports. You can configure and control the inbound and outbound network traffic to and from Azure resources within the Azure virtual network. A Network Security Group contains security rules that allow or deny inbound network traffic or outbound network traffic from several types of Azure resources.

We recommend using at least two subnets. Use one subnet for the CycleCloud installation VM and any other VMs with the same access policies. Use additional subnets for the compute clusters. For large clusters, the IP range of the subnet might become a limiting factor. In general, use a small CIDR (Classless Inter-Domain Routing) range for the CycleCloud subnet and a large range for the compute subnets.

CycleCloud uses the Azure Resource Manager for managing clusters. To make calls to Azure Resource Manager, configure [Managed Identity](~/articles/cyclecloud/how-to/managed-identities.md) on the CycleCloud VM. CycleCloud needs certain permissions. Use either system-assigned or user-assigned managed identity. A system-assigned managed identity creates an identity in Azure AD that is tied to the lifecycle of that service instance. When you delete that resource, the managed identity is automatically deleted. A user-assigned managed identity can be assigned to one or more instances of an Azure service. You separately manage the managed identity.

## Secured locked-down environment

Some secure production environments lock down the environment and have limited internet access. Since Azure CycleCloud requires access to Azure Storage accounts and other supported Azure services, the recommended way to provide private access is through [Virtual Network Service Endpoints](/azure/virtual-network/virtual-network-service-endpoints-overview) or Private Link. Enabling service endpoints or private link secures your Azure service resources to your virtual network. Service endpoints add more security by enabling private IP addresses in the virtual network to reach endpoints of an Azure service.

The CycleCloud application and cluster nodes can operate in environments with limited internet access, though a minimal number of TCP ports must remain open. To limit outbound internet access from the CycleCloud VM without configuring the Azure Firewall or an HTTPS proxy, configure a strict Azure Network Security Group for the CycleCloud virtual machine's subnet. The simplest way to do this configuration is to use [Service Tags](/azure/virtual-network/service-tags-overview) in the subnet or VM level Network Security Group to permit the required outbound Azure access. Use service tags in place of specific IP address when you create security rules. You can allow or deny the traffic for the corresponding service.
