---
title: Alias records overview - Azure DNS
description: In this article, learn about support for alias records in Microsoft Azure DNS.
services: dns
author: greg-lindsay
ms.service: dns
ms.topic: article
ms.date: 09/27/2022
ms.author: greglin
---

# Azure DNS alias records overview

Azure DNS alias records are qualifications on a DNS record set. They can reference other Azure resources from within your DNS zone. For example, you can create an alias record set that references an Azure public IP address instead of an A record. Your alias record set points to an Azure public IP address service instance dynamically. As a result, the alias record set seamlessly updates itself during DNS resolution.

An alias record set is supported for the following record types in an Azure DNS zone: 

- A
- AAAA
- CNAME

> [!NOTE]
> If you intend to use an alias record for the A or AAAA record types to point to an [Azure Traffic Manager profile](../traffic-manager/quickstart-create-traffic-manager-profile.md) you must make sure that the Traffic Manager profile has only [external endpoints](../traffic-manager/traffic-manager-endpoint-types.md#external-endpoints). You must provide the IPv4 or IPv6 address for external endpoints in Traffic Manager. You can't use fully qualified domain names (FQDNs) in endpoints. Ideally, use static IP addresses.

## Capabilities

- **Point to a public IP resource from a DNS A/AAAA record set.** You can create an A/AAAA record set and make it an alias record set to point to a public IP resource (standard or basic). The DNS record set changes automatically if the public IP address changes or is deleted. Dangling DNS records that point to incorrect IP addresses are avoided.

   > [!NOTE]
   > There's a current limit of 20 alias records sets per resource.

- **Point to a Traffic Manager profile from a DNS A/AAAA/CNAME record set** - You can create an A/AAAA or CNAME record set and use alias records to point it to a Traffic Manager profile. It's especially useful when you need to route traffic at a zone apex, as traditional CNAME records aren't supported for a zone apex. For example, say your Traffic Manager profile is myprofile.trafficmanager.net and your business DNS zone is contoso.com. You can create an alias record set of type A/AAAA for contoso.com (the zone apex) and point to myprofile.trafficmanager.net.
- **Point to an Azure Content Delivery Network (CDN) endpoint** - This is useful when you create static websites using Azure storage and Azure CDN.
- **Point to another DNS record set within the same zone** - Alias records can reference other record sets of the same type. For example, a DNS CNAME record set can be an alias to another CNAME record set. This arrangement is useful if you want some record sets to be aliases and some non-aliases.

## Scenarios

The following are a few common scenarios for using Alias records.

### Prevent dangling DNS records

A common problem with traditional DNS records is dangling records. For example, DNS records that haven't been updated to reflect changes to IP addresses. The issue occurs especially with A/AAAA or CNAME record types.

With a traditional DNS zone record, when the target IP or CNAME no longer exists, the DNS record associated with it has been updated manually. In some organizations, a manual update may not happen quickly because of process issues or the separation of roles and associated permission levels. For example, a role might have the authority to delete a CNAME or IP address that belongs to an application. But they don't have sufficient authority to update the DNS record that points to those targets. A delay in updating the DNS record can potentially cause an extended outage for the users.

Alias records prevent dangling references by tightly coupling the life cycle of a DNS record with an Azure resource. For example, consider a DNS record that's qualified as an alias record to point to a public IP address or a Traffic Manager profile. If you delete those underlying resources, the DNS alias record becomes an empty record set. It no longer references the deleted resource.

### Update DNS record-set automatically when application IP addresses change

This scenario is similar to the previous one. Perhaps an application gets moved, or the underlying virtual machine gets restarted. The alias record then updates automatically when the IP address changes for the underlying public IP resource. This update can potentially avoid the security risks of directing the users to another application that has been assigned the old public IP address.

### Host load-balanced applications at the zone apex

The DNS protocol prevents the assignment of CNAME records at the zone apex. For example if your domain is contoso.com. You can create CNAME records for somelabel.contoso.com but you can't create a CNAME for contoso.com itself.

This restriction presents a problem for application owners who have load-balanced applications behind [Azure Traffic Manager](../traffic-manager/traffic-manager-overview.md). Since using a Traffic Manager profile requires creation of a CNAME record, it's not possible to point to Traffic Manager profile from the zone apex.

To resolve this issue, you can use alias records. Unlike CNAME records, alias records are created at the zone apex and application owners can use it to point their zone apex record to a Traffic Manager profile that has external endpoints. Application owners point to the same Traffic Manager profile that's used for any other domain within their DNS zone.

For example, contoso.com and www\.contoso.com can point to the same Traffic Manager profile. To learn more about using alias records with Azure Traffic Manager profiles, see the Next steps section.

### Point zone apex to Azure CDN endpoints

Just like a Traffic Manager profile, you can also use alias records to point your DNS zone apex to Azure CDN endpoints. This is useful when you create static websites using Azure storage and Azure CDN. You can then access the website without prepending "www" to your DNS name.

For example, if your static website is named `www.contoso.com`, your users can access your site using `contoso.com` without the need to prepend www to the DNS name.

As described previously, CNAME records aren't supported at the zone apex. You can’t use a CNAME record to point contoso.com to your CDN endpoint. Instead, you can use an alias record to point the zone apex to a CDN endpoint directly.

> [!NOTE]
> Pointing a zone apex to CDN endpoints for Azure CDN from Akamai is currently not supported.

## Next steps

To learn more about alias records, see the following articles:

- [Tutorial: Configure an alias record to refer to an Azure public IP address](tutorial-alias-pip.md)
- [Tutorial: Configure an alias record to support apex domain names with Traffic Manager](tutorial-alias-tm.md)
- [DNS FAQ](./dns-faq.yml)