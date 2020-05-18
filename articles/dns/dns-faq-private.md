---
title: Azure Private DNS FAQ
description: In this article, learn frequently asked questions about Azure Private DNS
services: dns
author: rohinkoul
ms.service: dns
ms.topic: article
ms.date: 10/05/2019
ms.author: rohink
---
# Azure Private DNS FAQ

The following are frequently asked questions about Azure private DNS.

## Does Azure DNS support private domains?

Private domains are supported using the Azure Private DNS zones feature. Private DNS zones are resolvable only from within specified virtual networks. For more information, see the [overview](private-dns-overview.md).

For information on other internal DNS options in Azure, see [Name resolution for VMs and role instances](../virtual-network/virtual-networks-name-resolution-for-vms-and-role-instances.md).

## Will Azure Private DNS zones work across Azure regions?

Yes. Private Zones is supported for DNS resolution between virtual networks across Azure regions. Private Zones works even without explicitly peering the virtual networks. All the virtual networks must be linked to the private DNS zone.

## Is connectivity to the Internet from virtual networks required for private zones?

No. Private zones work along with virtual networks. You use them to manage domains for virtual machines or other resources within and across virtual networks. Internet connectivity isn't required for name resolution.

## Can the same private zone be used for several virtual networks for resolution?

Yes. You can link a private DNS zone with thousands of virtual networks. For more information, see [Azure DNS Limits](https://docs.microsoft.com/azure/azure-resource-manager/management/azure-subscription-service-limits#azure-dns-limits)

## Can a virtual network that belongs to a different subscription be linked to a private zone?

Yes. You must have write operation permission on the virtual networks and the private DNS zone. The write permission can be granted to several RBAC roles. For example, the Classic Network Contributor RBAC role has write permissions to virtual networks and Private DNS zones Contributor role has write permissions on the private DNS zones. For more information on RBAC roles, see [Role-based access control](../role-based-access-control/overview.md).

## Will the automatically registered virtual machine DNS records in a private zone be automatically deleted when you delete the virtual machine?

Yes. If you delete a virtual machine within a linked virtual network with autoregistration enabled, the registered records are automatically deleted.

## Can an automatically registered virtual machine record in a private zone from a linked virtual network be deleted manually?

Yes. You can overwrite the automatically registered DNS records with a manually created DNS record in the zone. The following question and answer address this topic.

## What happens when I try to manually create a new DNS record into a private zone that has the same hostname as an automatically registered existing virtual machine in a linked virtual network?

You try to manually create a new DNS record into a private zone that has the same hostname as an existing, automatically registered virtual machine in a linked virtual network. When you do, the new DNS record overwrites the automatically registered virtual machine record. If you try to delete this manually created DNS record from the zone again, the delete succeeds. The automatic registration happens again as long as the virtual machine still exists and has a private IP attached to it. The DNS record is re-created automatically in the zone.

## What happens when we unlink a linked virtual network from a private zone? Will the automatically registered virtual machine records from the virtual network be removed from the zone too?

Yes. To unlink a linked virtual network from a private zone, you update the DNS zone to remove the associated virtual network link. In this process, virtual machine records that were automatically registered are removed from the zone.

## What happens when we delete a linked virtual network that's linked to a private zone? Do we have to manually update the private zone to unlink the virtual network as a linked virtual network from the zone?

No. When you delete a linked virtual network without unlinking it from a private zone first, your deletion operation succeeds and the links to the DNS zone are automatically cleared.

## Will DNS resolution by using the default FQDN (internal.cloudapp.net) still work even when a private zone (for example, private.contoso.com) is linked to a virtual network?

Yes. Private Zones don't replace the default Azure-provided internal.cloudapp.net zone. Whether you rely on the Azure-provided internal.cloudapp.net or on your own private zone, use the FQDN of the zone you want to resolve against.

## Will the DNS suffix on virtual machines within a linked virtual network be changed to that of the private zone?

No. The DNS suffix on the virtual machines in your linked virtual network stays as the default Azure-provided suffix ("*.internal.cloudapp.net"). You can manually change this DNS suffix on your virtual machines to that of the private zone.
For guidance on how to change this suffix refer to [Use dynamic DNS to register hostnames in your own DNS server](https://docs.microsoft.com/azure/virtual-network/virtual-networks-name-resolution-ddns#windows-clients)

## What are the usage limits for Azure DNS Private zones?

Refer to [Azure DNS limits](https://docs.microsoft.com/azure/azure-resource-manager/management/azure-subscription-service-limits#azure-dns-limits) for details on the usage limits for Azure DNS private zones.

## Why don’t my existing private DNS zones show up in new portal experience?

If your existing private DNS zone were created using preview API, you must migrate these zones to new resource model. Private DNS zones created using preview API will not show up in new portal experience. See below for instructions on how to migrate to new resource model.

## How do I migrate my existing private DNS zones to the new model?

We strongly recommend that you migrate to the new resource model as soon as possible. Legacy resource model will be supported, however, further features will not be developed on top of this model. In future, we intend to deprecate it in favor of new resource model. For guidance on how to migrate your existing private DNS zones to new resource model see[migration guide for Azure DNS private zones](private-dns-migration-guide.md).

## Next steps

- [Learn more about Azure Private DNS](private-dns-overview.md)
