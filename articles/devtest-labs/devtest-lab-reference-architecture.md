---
title: Deploy Azure DevTest Labs (enterprise reference architecture)
description: See a reference architecture and considerations for Azure DevTest Labs in an enterprise.
ms.topic: how-to
ms.author: rosemalcolm
author: RoseHJM
ms.date: 09/30/2023
ms.reviewer: christianreddington,anthdela,juselph
ms.custom: UpdateFrequency2
---

# DevTest Labs enterprise reference architecture

This article provides a reference architecture for deploying Azure DevTest Labs in an enterprise. The architecture includes the following key elements:

- On-premises connectivity via Azure ExpressRoute
- A remote desktop gateway to remotely sign in to virtual machines (VMs)
- Connectivity to a private artifact repository
- Other platform-as-a-service (PaaS) components that labs use

## Architecture

The following diagram shows a typical DevTest Labs enterprise deployment. This architecture connects several labs in different Azure subscriptions to a company's on-premises network.

![Diagram that shows a reference architecture for an enterprise DevTest Labs deployment.](./media/devtest-lab-reference-architecture/reference-architecture.png)

### DevTest Labs components

DevTest Labs makes it easy and fast for enterprises to provide access to Azure resources. Each lab contains software-as-a-service (SaaS), infrastructure-as-a-service (IaaS), and PaaS resources. Lab users can create and configure VMs, PaaS environments, and VM [artifacts]().

In the preceding diagram, **Team Lab 1** in **Azure Subscription 1** shows an example of Azure components that labs can access and use. For more information, see [About DevTest Labs](devtest-lab-overview.md).

### Connectivity components

You need on-premises connectivity if your labs must access on-premises corporate resources. Common scenarios are:

- Some on-premises data can't move to the cloud.
- You want to join lab VMs to an on-premises domain.
- You want to force all cloud network traffic through an on-premises firewall for security or compliance reasons.

This architecture uses [ExpressRoute](../expressroute/expressroute-introduction.md) for connectivity to the on-premises network. You can also use a [site-to-site VPN](../vpn-gateway/vpn-gateway-about-vpn-gateway-settings.md).

On-premises, a [remote desktop gateway](/windows-server/remote/remote-desktop-services/desktop-hosting-logical-architecture) enables outgoing remote desktop protocol (RDP) connections to DevTest Labs. Enterprise corporate firewalls usually block outgoing connections at the corporate firewall. To enable connectivity, you can:

- Use a remote desktop gateway, and allow the static IP address of the gateway load balancer.
- Use [forced tunneling](../vpn-gateway/vpn-gateway-forced-tunneling-rm.md) to redirect all RDP traffic back over the ExpressRoute or site-to-site VPN connection. Forced tunneling is common functionality for enterprise-scale DevTest Labs deployments.

### Networking components

In this architecture, [Azure Active Directory (Azure AD)](../active-directory/fundamentals/active-directory-whatis.md) provides identity and access management across all networks. Lab VMs usually have a local administrative account for access. If there's an Azure AD, on-premises, or [Azure AD Domain Services](../active-directory-domain-services/overview.md) domain available, you can join lab VMs to the domain. Users can then use their domain-based identities to connect to the VMs.

[Azure networking topology](../networking/fundamentals/networking-overview.md) controls how lab resources access and communicate with on-premises networks and the internet. This architecture shows a common way that enterprises network DevTest Labs. The labs connect with [peered virtual networks](../virtual-network/virtual-network-peering-overview.md) in a [hub-spoke configuration](/azure/architecture/reference-architectures/hybrid-networking/hub-spoke), through the ExpressRoute or site-to-site VPN connection, to the on-premises network.

Because DevTest Labs uses Azure Virtual Network directly, there are no restrictions on how you set up the networking infrastructure. You can set up a [network security group](../virtual-network/network-security-groups-overview.md) to restrict cloud traffic based on source and destination IP addresses. For example, you can allow only traffic that originates from the corporate network into the lab's networks.

## Scalability considerations

DevTest Labs has no built-in quotas or limits, but other Azure resources that labs use have [subscription-level quotas](../azure-resource-manager/management/azure-subscription-service-limits.md). In a typical enterprise deployment, you need several Azure subscriptions to cover a large DevTest Labs deployment. Enterprises commonly reach the following quotas:

- Resource groups. DevTest Labs creates a resource group for every new VM, and lab users create environments in resource groups. Subscriptions can contain [up to 980 resource groups](../azure-resource-manager/management/azure-subscription-service-limits.md#subscription-limits), so that's the limit of VMs and environments in a subscription.

  Two strategies can help you stay under resource group limits:

  - [All VMs go in the same resource group](resource-group-control.md). This strategy helps you meet the resource group limit, but it affects the resource-type-per-resource-group limit.
  - [Use shared public IPs](devtest-lab-shared-ip.md). If VMs are allowed to have public IP addresses, put all VMs of the same size and region into the same resource group. This configuration helps meet both resource group quotas and resource-type-per-resource-group quotas.

- Resources per resource group per resource type. The default limit for [resources per resource group per resource type is 800](../azure-resource-manager/management/azure-subscription-service-limits.md#resource-group-limits).  Putting all VMs in the same resource group hits this limit much sooner, especially if the VMs have many extra disks.

- Storage accounts. Every lab in DevTest Labs comes with a storage account. The Azure quota for [number of storage accounts per region per subscription is 250](../azure-resource-manager/management/azure-subscription-service-limits.md#azure-storage-limits) by default. So the maximum number of DevTest Labs in one region is also 250. With a quota increase, you can create up to 500 storage accounts per region. For more information, see [Increase Azure Storage account quotas](../quotas/storage-account-quota-requests.md).

- Role assignments. A role assignment gives a user or principal access to a resource. Azure has a limit of [2,000 role assignments per subscription](../azure-resource-manager/management/azure-subscription-service-limits.md#azure-rbac-limits).

  By default, DevTest Labs creates a resource group for each lab VM. The VM creator gets *owner* permission for the VM and *reader* permission to the resource group. So each lab VM uses two role assignments. Granting user permissions to the lab also uses role assignments.
  
- API reads/writes. You can automate Azure and DevTest Labs by using REST APIs, PowerShell, Azure CLI, and Azure SDK. Each Azure subscription allows up to [12,000 read requests and 1,200 write requests per hour](../azure-resource-manager/management/request-limits-and-throttling.md). By automating DevTest Labs, you might hit the limit on API requests.

## Manageability considerations

You can use the Azure portal to manage a single DevTest Labs instance at a time, but enterprises might have multiple Azure subscriptions and many labs to administer. Making changes consistently to all labs requires scripting automation.

Here are some examples of using scripting in DevTest Labs deployments:

- Changing lab settings. Update a specific lab setting across all labs by using PowerShell scripts, Azure CLI, or REST APIs. For example, update all labs to allow a new VM instance size.

- Updating artifact repository personal access tokens (PATs). PATs for Git repositories typically expire in 90 days, one year, or two years. To ensure continuity, it's important to extend the PAT. Or, create a new PAT and use automation to apply it to all labs.

- Restricting changes to lab settings. To restrict certain settings, such as allowing marketplace image use, you can use Azure Policy to prevent changes to a resource type. Or you can create a custom role, and grant users that role instead of a built-in lab role. You can restrict changes for most lab settings, such as internal support, lab announcements, and allowed VM sizes.

- Applying a naming convention for VMs. You can use Azure Policy to [specify a naming pattern](https://github.com/Azure/azure-policy/tree/master/samples/TextPatterns/allow-multiple-name-patterns) that helps identify VMs in cloud-based environments.

You manage Azure resources for DevTest Labs the same way as for other purposes. For example, Azure Policy applies to VMs you create in a lab. Microsoft Defender for Cloud can report on lab VM compliance. Azure Backup can provide regular backups for lab VMs.

## Security considerations

DevTest Labs automatically benefits from built-in Azure security features. To require incoming remote desktop connections to originate only from the corporate network, you can add a network security group to the virtual network on the remote desktop gateway.

Another security consideration is the permission level you grant to lab users. Lab owners use Azure role-based access control (Azure RBAC) to assign roles to users and set resource and access-level permissions. The most common DevTest Labs permissions are Owner, Contributor, and User. You can also create and assign [custom roles](devtest-lab-grant-user-permissions-to-specific-lab-policies.md). For more information, see [Add owners and users in Azure DevTest Labs](devtest-lab-add-devtest-user.md).

## Next steps
See the next article in this series: [Deliver a proof of concept](deliver-proof-concept.md).
