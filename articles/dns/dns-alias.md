---
title: Azure DNS alias records overview
description: Overview of support for alias records in Microsoft Azure DNS.
services: dns
author: vhorne
ms.service: dns
ms.topic: article
ms.date: 2/11/2019
ms.author: victorh
---

# Azure DNS alias records overview

Azure DNS alias records are qualifications on a DNS record set. They can reference other Azure resources from within your DNS zone. For example, you can create an alias record set that references an Azure public IP address instead of an A record. Your alias record set points to an Azure public IP address service instance dynamically. As a result, the alias record set seamlessly updates itself during DNS resolution.

An alias record set is supported for the following record types in an Azure DNS zone: 

- A 
- AAAA 
- CNAME 

> [!NOTE]
> If you intend to use Alias record for the A or AAAA record types to point to an [Azure Traffic Manager profile](../traffic-manager/quickstart-create-traffic-manager-profile.md) you must make sure that Traffic Manager profile has only [external endpoints](../traffic-manager/traffic-manager-endpoint-types.md#external-endpoints). You must provide the IPv4 or IPv6 address, as appropriate, for external endpoints in Traffic Manager. Ideally, use static IPs for the address.

## Capabilities

- **Point to a public IP resource from a DNS A/AAAA record set.** You can create an A/AAAA record set and make it an alias record set to point to a public IP resource. This will automatically update the DNS record set if the public IP address changes or is deleted; so that you don't have dangling DNS records that point to incorrect IP addresses.

- **Point to a Traffic Manager profile from a DNS A/AAAA/CNAME record set.** You can create an A/AAAA or CNAME recordset and use alias records feature to point it to a Traffic Manager profile. This is especially useful when you need to route traffic at zone apex as traditional CNAME record is not supported for zone apex. For example if your Traffic Manager profile is mypofile.trafficmanager.net and your business DNS zone is contoso.com; you can create an Alias recortset of type A/AAAA for contoso.com (zone apex) and point to myprofile.trafficmanage.net.

   > [!NOTE]
   > Alias records for the A or AAAA record types for Traffic Manager are supported only for external endpoint types. You must provide the IPv4 or IPv6 address, as appropriate, for external endpoints in Traffic Manager. Ideally, use static IPs for the address.
   
- **Point to another DNS record set within the same zone.** Alias records can reference other record sets of the same type. For example, a DNS CNAME record set can be an alias to another CNAME record set. This arrangement is useful if you want some record sets to be aliases and some non-aliases.

## Scenarios
There are a few common scenarios for Alias records.

### Prevent dangling DNS records
A common problem with traditional DNS records is dangling records i.e. DNS records that have not been updated to reflect changes to IP addresses. This issue occurs especially with A/AAAA or CNAME record types. 

With a traditional DNS zone record, if the target IP or CNAME no longer exists, the DNS record associated with it must be manually updated. In some organizations, this manual update might not happen in time due to process issues or due to the separation of roles and associated permission levels. For example, a role might have the authority to delete a CNAME or IP address that belongs to an application. But it doesn't have sufficient authority to update the DNS record that points to those targets. A delay in updating the DNS record can potentially cause an outage for the users.

Alias records prevent dangling rerfences by tightly coupling the lifecycle of a DNS record with an Azure resource. Take, for example, a DNS record that's qualified as an alias record to point to a public IP or a Traffic Manager profile. If those underlying resources are deleted, the DNS alias record is removed at the same time.

### Update DNS record-set automatically when application IPs change

This scenario is similar to the previous one. Perhaps an application is moved, or the underlying virtual machine is restarted. An alias record then updates automatically when the IP address changes for the underlying public IP resource. This avoids potential security risks of directing the users to another application that has been assigned the old public IP address.

### Host load-balanced applications at the zone apex

The DNS protocol prevents the assignment of CNAME record at the zone apex. For example if you domain is contoso.com; you can create CNAME records for somelable.contoso.com; but you can't create CNAME for contoso.com itself.
This restriction presents a problem for application owners who have load-balanced applications behind [Azure Traffic Manager](../traffic-manager/traffic-manager-overview.md). Since using a Traffic Manager profile requires creation of a CNAME record; it is not possible to point at the Traffic Manager profile from the zone apex. 

This problem can be solved using alias records. Unlike CNAME record; Alias record can be created at zone apex and application owners can use it to point their zone apex record to a Traffic Manager profile that has external endpoints. Application owners can point to the same Traffic Manager profile that's used for any other domain within their DNS zone. 
For example, contoso.com and www.contoso.com can point to the same Traffic Manager profile. To know more about how to use Alias records with Azure Traffic Manager profiles follow the link to tutorial in the Next Steps section below.

## Next steps

To learn more about alias records, see the following articles:

- [Tutorial: Configure an alias record to refer to an Azure public IP address](tutorial-alias-pip.md)
- [Tutorial: Configure an alias record to support apex domain names with Traffic Manager](tutorial-alias-tm.md)
- [DNS FAQ](https://docs.microsoft.com/azure/dns/dns-faq#alias-records)
