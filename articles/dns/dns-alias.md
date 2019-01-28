---
title: Azure DNS alias records overview
description: Overview of support for alias records in Microsoft Azure DNS.
services: dns
author: vhorne
ms.service: dns
ms.topic: article
ms.date: 9/25/2018
ms.author: victorh
---

# Azure DNS alias records overview

Azure DNS alias records are qualifications on a DNS record set. They can reference other Azure resources from within your DNS zone. For example, you can create an alias record set that references an Azure public IP address instead of an A record. Your alias record set points to an Azure public IP address service instance dynamically. As a result, the alias record set seamlessly updates itself during DNS resolution.

An alias record set is supported for the following record types in an Azure DNS zone: 

- A 
- AAAA 
- CNAME 

> [!NOTE]
> Alias records for the A or AAAA record types for Azure Traffic Manager are supported only for external endpoint types. You must provide the IPv4 or IPv6 address, as appropriate, for external endpoints in Traffic Manager. Ideally, use static IPs for the address.

## Capabilities

- **Point to a public IP resource from a DNS A/AAAA record set.** You can create an A/AAAA record set and make it an alias record set to point to a public IP resource.

- **Point to a Traffic Manager profile from a DNS A/AAAA/CNAME record set.** You can point to the CNAME of a Traffic Manager profile from a DNS CNAME record set. An example is contoso.trafficmanager.net. Now, you also can point to a Traffic Manager profile that has external endpoints from an A or AAAA record set in your DNS zone.

   > [!NOTE]
   > Alias records for the A or AAAA record types for Traffic Manager are supported only for external endpoint types. You must provide the IPv4 or IPv6 address, as appropriate, for external endpoints in Traffic Manager. Ideally, use static IPs for the address.
   
- **Point to another DNS record set within the same zone.** Alias records can reference other record sets of the same type. For example, a DNS CNAME record set can be an alias to another CNAME record set of the same type. This arrangement is useful if you want some record sets to be aliases and some non-aliases.

## Scenarios
There are a few common scenarios for Alias records.

### Prevent dangling DNS records
 Within Azure DNS zones, alias records can be used to closely keep track of the lifecycle of Azure resources. Resources include a public IP or a Traffic Manager profile. A common problem with traditional DNS records is dangling records. This issue occurs especially with A/AAAA or CNAME record types. 

With a traditional DNS zone record, if the target IP or CNAME no longer exists, the DNS zone record doesn't know it. As a result, the record must be updated manually. In some organizations, this manual update might not happen in time. It also can be problematic because of the separation of roles and associated permission levels.

For example, a role might have the authority to delete a CNAME or IP address that belongs to an application. But it doesn't have sufficient authority to update the DNS record that points to those targets. A time delay occurs between when the IP or CNAME is deleted and the DNS record that points to it is removed. This time delay potentially cause an outage for users.

Alias records remove the complexity associated with this scenario. They help to prevent dangling references. Take, for example, a DNS record that's qualified as an alias record to point to a public IP or a Traffic Manager profile. If those underlying resources are deleted, the DNS alias record is removed at the same time. This process makes sure that users never suffer an outage.

### Update DNS zones automatically when application IPs change

This scenario is similar to the previous one. Perhaps an application is moved, or the underlying virtual machine is restarted. An alias record then updates automatically when the IP address changes for the underlying public IP resource. To avoid potential security risks, direct users to another application that has the old IP address.

### Host load-balanced applications at the zone apex

The DNS protocol prevents the assignment of anything other than an A or AAAA record at the zone apex. An example is contoso.com. This restriction presents a problem for application owners who have load-balanced applications behind Traffic Manager. It isn't possible to point at the Traffic Manager profile from the zone apex record. As a result, application owners must use a workaround. A redirect at the application layer must redirect from the zone apex to another domain. An example is a redirect from contoso.com to www.contoso.com. This arrangement presents a single point of failure for the redirect function.

With alias records, this problem no longer exists. Now application owners can point their zone apex record to a Traffic Manager profile that has external endpoints. Application owners can point to the same Traffic Manager profile that's used for any other domain within their DNS zone. 
For example, contoso.com and www.contoso.com can point to the same Traffic Manager profile. This is the case as long as the Traffic Manager profile has only external endpoints configured.

## Next steps

To learn more about alias records, see the following articles:

- [Tutorial: Configure an alias record to refer to an Azure public IP address](tutorial-alias-pip.md)
- [Tutorial: Configure an alias record to support apex domain names with Traffic Manager](tutorial-alias-tm.md)
- [DNS FAQ](https://docs.microsoft.com/azure/dns/dns-faq#alias-records)
