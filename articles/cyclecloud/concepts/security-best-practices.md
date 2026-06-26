---
title: Security Best Practices
description: Learn security best practices and useful tips for deploying and operating Azure CycleCloud more securely.
author: prkannap
ms.date: 06/23/2026
ms.topic: concept-article
ms.update-cycle: 3650-days
ms.author: bewatrou
---

# Azure CycleCloud – Security best practices

This article discusses the best practices and useful tips for using Azure CycleCloud more securely and effectively. You can use the best practices listed here as a quick reference when using Azure CycleCloud.

## Installation

Use the Azure Marketplace Azure CycleCloud virtual machine image to launch Azure CycleCloud. The Marketplace image starts with Azure CycleCloud configured to use HTTPS.

However, if you install CycleCloud manually, the default installation uses unencrypted HTTP running on port 8080. Configure SSL for all installations to prevent unencrypted access to your CycleCloud installation. Don't make CycleCloud accessible from the internet, but if needed, expose only port 443. For more information about configuring the SSL certificate and disabling unencrypted HTTP access to CycleCloud, see [SSL configuration](~/articles/cyclecloud/how-to/ssl-configuration.md).

To restrict outbound internet access from the Azure CycleCloud virtual machine, you can configure Azure CycleCloud to use a proxy for all internet-bound HTTP and HTTPS traffic. For more information, see [Operating in a Locked Down Environment](~/articles/cyclecloud/how-to/running-in-locked-down-network.md).

## Authentication and authorization

Azure CycleCloud offers four methods of authentication: 

- Built-in user database with encryption
- Active Directory
- LDAP
- Entra ID

If an account has five authorization failures within 60 seconds, the system locks the account automatically. An administrator can manually unlock accounts, and the system automatically unlocks accounts after five minutes.

Install Azure CycleCloud on a drive with only admin-group access. This configuration prevents non-admin users from accessing unencrypted cluster data. Don't include non-admin users in this group. Ideally, limit access to the CycleCloud installation to only administrators.

Don't share a single Azure CycleCloud installation across trust boundaries. The RBAC controls within a single CycleCloud installation might not be sufficient in a true multitenant environment. Use separate and isolated CycleCloud installations for each tenant with critical data.

### Role-based authentication

Azure CycleCloud provides a set of built-in roles that control user access to the CycleCloud UI and cluster nodes with permissions specific to AI and HPC cluster management.

- `SuperUser`: Full administrative access to Azure CycleCloud, including control over user creation and permissions, cluster administration for all clusters, and database administration.
- `Administrator`: Grants administrative access to all clusters in the Azure CycleCloud UI.
- `Cluster Owner`: The initial creator of a cluster. Owners can be administrators or basic users, but they have administrative privileges for their own clusters.
- `User`: Grants basic user access to the CycleCloud UI. By default, users have no access to any cluster. The Cluster Owner or an Administrator must grant cluster access.
- `Auditor`: A view-only role that allows cluster monitoring in the Azure CycleCloud UI.

> [!WARNING]
> Grant the `SuperUser` role only to highly privileged administrative users. Most users should have the `User` role and only have explicit access to specific clusters they need to access.


## Networking and secret management

For detailed guidance, consult the Azure [network security best practices](/azure/security/fundamentals/network-best-practices).

Lock down the target [virtual network](/azure/virtual-network/virtual-networks-overview) for your clusters by using [Network Security Groups](/azure/virtual-network/network-security-groups-overview) (NSGs). A Network Security Group contains security rules that allow or deny inbound network traffic or outbound network traffic from several types of Azure resources.

Use at least two subnets. Use one subnet for the CycleCloud installation virtual machine (VM) and any other VMs with the same access policies. Use additional subnets for the compute clusters. For large clusters, the IP range of the subnet might become a limiting factor. In general, use a small CIDR (Classless Inter-Domain Routing) range for the CycleCloud subnet and a larger range for the compute subnets.

Azure CycleCloud uses Azure Resource Manager to manage clusters. To grant access to Azure Resource Manager, configure a [Managed Identity](~/articles/cyclecloud/how-to/managed-identities.md) for the CycleCloud VM with the permissions described in the article. You can use either a system-assigned or a user-assigned Managed Identity. A system-assigned Managed Identity creates an Entra identity that is tied to the lifecycle of that service instance. When you delete that resource, the Managed Identity is automatically deleted. A user-assigned Managed Identity can be assigned to one or more instances of an Azure service. You separately manage the Managed Identity.

> [!WARNING]
> AI and HPC clusters often use components that require passwords, certificates, and other data that is classified as private or secret. This secret data *must not* be stored directly in cluster templates or cluster parameters. All basic CycleCloud users can access cluster templates and parameters, which are stored in plain text.


Instead, use the following recommendations to protect secrets:

- Use Managed Identity on the cluster nodes to provide access to Azure resources from the nodes.
- Use Azure Key Vault or other secret management services to pass any required secret data to cluster nodes.

## Secured locked-down environment

Some secure production environments lock down the environment and have limited internet access. Since Azure CycleCloud requires access to Azure Storage accounts and other supported Azure services, the recommended way to provide private access is through [Virtual Network Service Endpoints](/azure/virtual-network/virtual-network-service-endpoints-overview) or Private Link. By enabling Service Endpoints or Private Link, you secure your Azure service resources to your virtual network. Service Endpoints and Private Link add more security by enabling private IP addresses in the virtual network to reach endpoints of an Azure service.

The CycleCloud application and cluster nodes can operate in environments with limited internet access, though a minimal number of TCP ports must remain open. To limit outbound internet access from the CycleCloud VM without configuring the Azure Firewall or an HTTPS proxy, configure a strict Azure Network Security Group for the CycleCloud virtual machine's subnet. The simplest way to do this configuration is to use [Service Tags](/azure/virtual-network/service-tags-overview) in the subnet or VM level Network Security Group to permit the required outbound Azure access. Use service tags in place of specific IP address when you create security rules. You can allow or deny the traffic for the corresponding service.
