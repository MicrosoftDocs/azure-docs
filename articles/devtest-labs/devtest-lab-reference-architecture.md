---
title: Enterprise reference architecture
description: See a reference architecture and considerations for Azure DevTest Labs in an enterprise.
ms.topic: how-to
ms.date: 03/14/2022
ms.reviewer: christianreddington,anthdela,juselph
---

# DevTest Labs enterprise reference architecture

This article provides a reference architecture for deploying Azure DevTest Labs in an enterprise. The architecture includes the following components:

- On-premises connectivity via Azure ExpressRoute
- A remote desktop gateway to remotely sign in to virtual machines (VMs)
- Connectivity to an artifact repository for private artifacts
- Other platform-as-a-service (PaaS) components that labs use


## Architecture

![Diagram that shows a reference architecture for an enterprise DevTest Labs deployment.](./media/devtest-lab-reference-architecture/reference-architecture.png)

This reference architecture has the following key elements:

- DevTest Labs. DevTest Labs makes it easy and fast for enterprises to provide access to Azure resources. For more information, see [About DevTest Labs](devtest-lab-overview.md).

- VMs and other software-as-a-service (SaaS), infrastructure-as-a-service (IaaS), and PaaS resources. DevTest Labs instances contain VMs and other Azure resources like PaaS environments and VM artifacts, which are software and settings to apply to VMs. 

- [Azure Active Directory (Azure AD)] for identity management. Lab owners use Azure role-based access control (Azure RBAC) to assign roles to users and set resource and access-level permissions.

  Lab VMs usually have a local admin account. If there's an Azure AD, on-premises, or [Azure AD Domain Services](../active-directory-domain-services/overview.md) domain available, you can join lab VMs to the domain. Users can then use their domain-based identities to connect to the VMs.

- [ExpressRoute](../expressroute/expressroute-introduction.md) for on-premises connectivity. You can also use a [site-to-site VPN](../vpn-gateway/vpn-gateway-about-vpn-gateway-settings.md). You need on-premises connectivity only if your labs need access to on-premises corporate resources. Common scenarios are:

  - Some on-premises data can't move to the cloud.
  - You want to join lab VMs to the on-premises domain.
  - You want to force all cloud network traffic through an on-premises firewall for security or compliance reasons.

- A [remote desktop gateway](/windows-server/remote/remote-desktop-services/desktop-hosting-logical-architecture) to enable outgoing remote desktop protocol (RDP) connections to DevTest Labs. Enterprise corporate firewalls usually block outgoing connections at the corporate firewall. To enable connectivity, you can:

  - Use a remote desktop gateway, and allow the static IP address of the gateway load balancer.
  - [Use forced tunneling](../vpn-gateway/vpn-gateway-forced-tunneling-rm.md) to redirect all RDP traffic back over the ExpressRoute or site-to-site VPN connection. This functionality is common for enterprises using a DevTest Labs deployment.

- [Azure networking topology](../networking/fundamentals/networking-overview.md) controls how lab resources access and communicate with on-premises networks and the internet. This architecture shows the most common way customers connect DevTest Labs. All labs connect via [peered virtual networks](../virtual-network/virtual-network-peering-overview.md) in a [hub-spoke configuration](/azure/architecture/reference-architectures/hybrid-networking/hub-spoke), through the ExpressRoute or site-to-site VPN connection, to the on-premises network. Because DevTest Labs uses Azure Virtual Network directly, there are no restrictions on how you set up the networking infrastructure.

- A [network security group](../virtual-network/network-security-groups-overview.md) restricts traffic to or within the cloud environment, based on source and destination IP addresses. For example, you can allow only traffic that originates from the corporate network into the lab's networks.

## Scalability considerations

DevTest Labs doesn't have built-in quotas or limits, but other Azure resources that labs use have [subscription-level quotas](../azure-resource-manager/management/azure-subscription-service-limits.md). In a typical enterprise deployment, you need multiple Azure subscriptions to cover a large deployment of DevTest Labs. The quotas that enterprises most commonly reach are:

- Resource groups. In the default configuration, DevTest Labs creates a resource group for every new VM, or lab users create environments in resource groups. Subscriptions can contain [up to 980 resource groups](../azure-resource-manager/management/azure-subscription-service-limits.md#subscription-limits), so that's the limit of VMs and environments in a subscription. Two strategies can help you stay under resource group limits:

  - [All VMs go in the same resource group](resource-group-control.md). This strategy setup helps you meet the resource group limit, but it affects the resource-type-per-resource-group limit.
  - Use shared Public IPs. If VMs are allowed to have public IP addresses, put all VMs of the same size and region into the same resource group. This configuration helps meet resource group quotas and resource-type-per-resource-group quotas.

- Resources per resource group per resource type. The default limit for [resources per resource group per resource type is 800](../azure-resource-manager/management/azure-subscription-service-limits.md#resource-group-limits).  Putting all VMs in the same resource group hits this limit much sooner, especially if the VMs have many extra disks.

- Storage accounts. Every lab in DevTest Labs comes with a storage account. The Azure quota for [number of storage accounts per region per subscription is 250](../azure-resource-manager/management/azure-subscription-service-limits.md#storage-limits). So the maximum number of DevTest Labs in one region is also 250.

- Role assignments. A role assignment gives a user or principal access to a resource. Azure has a limit of [2,000 role assignments per subscription](../azure-resource-manager/management/azure-subscription-service-limits.md#azure-rbac-limits).

  By default, DevTest Labs creates a resource group for each VM. The VM creator gets *owner* permission for the VM and *reader* permission to the resource group. So each new VM uses two role assignments. Granting user permissions to the lab also uses role assignments.
  
- API reads/writes. You can automate Azure and DevTest Labs by using REST APIs, PowerShell, Azure CLI, and Azure SDK. Each Azure subscription allows up to [12,000 read requests and 1,200 write requests per hour](../azure-resource-manager/management/request-limits-and-throttling.md). Be aware that by automating DevTest Labs, you might hit the limit on API requests.

## Manageability considerations

You can use the DevTest Labs administrative user interface in the Azure portal to work with a single lab. Enterprises might have multiple Azure subscriptions and many labs. Making changes consistently to all labs requires scripting automation. Here are some examples and best management practices for scripting in DevTest Labs deployments:

- Change lab settings. Update a specific lab setting across all labs by using PowerShell scripts, Azure CLI, or REST APIs. For example, update all labs to allow a new VM instance size.

- Update artifact repository personal access tokens (PATs). PATs for Git repositories typically expire in 90 days, one year, or two years. To ensure continuity, it's important to extend the PAT. Or, or create a new one and use automation to apply it to all the labs.

- Restrict changes to lab settings. To restrict certain settings, such as allowing marketplace image use, you can use Azure Policy to prevent changes to a resource type. Or you can create a custom role, and grant users that role instead of the Owner role for the lab. You can restrict changes for most lab settings, such as internal support, lab announcements, and allowed VM sizes.

- Require VMs to follow a naming convention. You can easily identify VMs that are part of a cloud-based environment by using Azure Policy to [specify a naming pattern](https://github.com/Azure/azure-policy/tree/master/samples/TextPatterns/allow-multiple-name-patterns).

You manage underlying Azure resources for DevTest Labs the same way you manage them for other purposes. For example, Azure Policy applies to VMs you create in a lab. Microsoft Defender for Cloud can report on lab VM compliance. Azure Backup can provide regular backups for lab VMs.

## Security considerations

DevTest Labs automatically benefits from built-in Azure security features. For example, to require incoming remote desktop connections to originate only from the corporate network, simply add a network security group to the virtual network on the remote desktop gateway.

The only other security consideration is the permission level you grant to lab users. The most common lab permissions are Owner, Contributor, and User. For more information, see [Add owners and users in Azure DevTest Labs](devtest-lab-add-devtest-user.md).

## Next steps
See the next article in this series: [Scale up your Azure DevTest Labs infrastructure](devtest-lab-guidance-scale.md).
