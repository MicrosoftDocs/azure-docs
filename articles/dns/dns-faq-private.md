---
title: Azure Private DNS FAQ
description: Frequently asked questions about Azure Private DNS
services: dns
author: vhorne
ms.service: dns
ms.topic: article
ms.date: 6/12/2019
ms.author: victorh
---
# Azure Private DNS FAQ

> [!IMPORTANT]
> Azure Private DNS is currently in public preview.
> This preview version is provided without a service level agreement, and it's not recommended for production workloads. Certain features might not be supported or might have constrained capabilities.
> For more information, see [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).

## Does Azure DNS support private domains?

Support for private domains is supported using Azure Private DNS Zones feature. Private DNS zones are managed using the same tools as internet-facing Azure DNS zones. They're resolvable only from within your specified virtual networks. For more information, see the [overview](private-dns-overview.md).

For information on other internal DNS options in Azure, see [Name resolution for VMs and role instances](../virtual-network/virtual-networks-name-resolution-for-vms-and-role-instances.md).

## Will Azure DNS Private Zones work across Azure regions?

Yes. Private Zones is supported for DNS resolution between virtual networks across Azure regions. Private Zones works even without explicitly peering the virtual networks. All the virtual networks must be specified as Resolution virtual networks for the private zone. Customers might need the virtual networks to be peered for TCP/HTTP traffic to flow from one region to another.

## Is connectivity to the Internet from virtual networks required for private zones?

No. Private zones work along with virtual networks. Customers use them to manage domains for virtual machines or other resources within and across virtual networks. Internet connectivity isn't required for name resolution.

## Can the same private zone be used for several virtual networks for resolution?

Yes. You can associate up to 1000 virtual networks with a single private zone.

## Can a virtual network that belongs to a different subscription be added as a linked virtual network to a private zone?

Yes. You must have write operation permission on the virtual networks and the private DNS zone. The write permission can be granted to several RBAC roles. For example, the Classic Network Contributor RBAC role has write permissions to virtual networks. For more information on RBAC roles, see [Role-based access control](../role-based-access-control/overview.md).

## Will the automatically registered virtual machine DNS records in a private zone be automatically deleted when you delete the virtual machine?

Yes. If you delete a virtual machine within a linked virtual network with autoregistration enabled, the registered records are automatically deleted.

## Can an automatically registered virtual machine record in a private zone from a linked virtual network be deleted manually?

Yes. You can overwrite the automatically registered DNS records with a manually created DNS record in the zone. The following question and answer address this topic.

## What happens when I try to manually create a new DNS record into a private zone that has the same hostname as an automatically registered existing virtual machine in a linked virtual network?

You try to manually create a new DNS record into a private zone that has the same hostname as an existing, automatically registered virtual machine in a linked virtual network. When you do, the new DNS record overwrites the automatically registered virtual machine record. If you try to delete this manually created DNS record from the zone again, the delete succeeds. The automatic registration happens again as long as the virtual machine still exists and has a private IP attached to it. The DNS record is re-created automatically in the zone.

## What happens when we unlink a linked virtual network from a private zone? Will the automatically registered virtual machine records from the virtual network be removed from the zone too?

Yes. To unlink a linked virtual network from a private zone, you update the DNS zone to remove the associated virtual network link. In this process, virtual machine records that were automatically registered are removed from the zone.

## What happens when we delete a linked virtual network that's linked to a private zone? Do we have to manually update the private zone to unlink the virtual network as a linked virtual network from the zone?

Yes. When you delete a linked virtual network without unlinking it from a private zone first, your deletion operation succeeds. But the virtual network isn't automatically unlinked from your private zone, if any. You must manually unlink the virtual network from the private zone. For this reason,  unlink your virtual network from your private zone before you delete it.

## Will DNS resolution by using the default FQDN (internal.cloudapp.net) still work even when a private zone (for example, private.contoso.com) is linked to a virtual network?

Yes. Private Zones doesn't replace the default DNS resolutions by using the Azure-provided internal.cloudapp.net zone. It's offered as an additional feature or enhancement. Whether you rely on the Azure-provided internal.cloudapp.net or on your own private zone, use the FQDN of the zone you want to resolve against.

## Will the DNS suffix on virtual machines within a linked virtual network be changed to that of the private zone?

No. The DNS suffix on the virtual machines in your linked virtual network stays as the default Azure-provided suffix ("*.internal.cloudapp.net"). You can manually change this DNS suffix on your virtual machines to that of the private zone.

## What are the usage limits for Azure Private DNS?

The following default limits apply when you use Azure Private DNS.

| Resource | Default limit |
| --- | --- |
|Private DNS zones per subscription|1000|
|Record sets per Private DNS zone|25,000|
|Records per record set|20|
|Virtual Network Links per private DNS zone|1000|
|Virtual Networks Links per private DNS zones with auto-registration enabled|100|
|Number of private DNS zones a virtual network can get linked to with auto-registration enabled|1|
|Number of private DNS zones a virtual network can get linked|1000|

## Is there portal support for private zones?

Yes, and private zones that are already created via APIs, PowerShell, the CLI, and SDKs are visible on the Azure portal.

## Why don’t my existing private DNS zones show up in new portal experience?

As part of Preview Refresh release we shipped a new resource model for private DNS zones. Your existing private DNS zones will need to be migrated to new resource model before these can show up in the new portal experience. See below for instructions on how to migrate to new resource model.

## How do I migrate my existing private DNS zones to the new model?
We strongly recommend that you migrate to the new resource model as soon as possible. Legacy resource model will be supported, however, further features will not be developed on top of this model. In future we intend to deprecate it in favor of new resource model. For guidance on how to migrate your existing private DNS zones to new resource model see[migration guide for Azure DNS private zones](private-dns-migration-guide.md).

## Next steps

- [Learn more about Azure Private DNS](private-dns-overview.md)