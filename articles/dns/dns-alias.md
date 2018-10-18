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

Azure DNS alias records are qualification on a DNS record set that allows you to reference other Azure resources from within your DNS zone. For example, you can create an alias recordset that references an Azure Public IP address instead an A record. Since your alias recordset points to an Azure Public IP address service instance dynamically, the alias record set seamlessly updates itself during DNS resolution.

An alias record set is supported for the following record types in an Azure DNS zone: A, AAAA, and CNAME. 

> [!NOTE]
> Alias records for the A or AAAA record types for Traffic Manager are only supported for External Endpoint types. You must provide the IPv4 or IPv6 address (ideally static IPs) as appropriate for external endpoints in Traffic Manager.

## Capabilities

- **Point to a Public IP resource from a DNS A/AAAA record set**. You can create an A/AAAA record set, and make it an alias record set to point to a Public IP resource.
- **Point to a Traffic Manager profile from a DNS A/AAAA/CNAME record set**. In addition to being able to point to the CNAME of a Traffic Manager profile (for example: contoso.trafficmanager.net) from a DNS CNAME recordset, you can now also point to a Traffic Manager profile that has external endpoints, from an A or AAAA recordset in your DNS zone.
   > [!NOTE]
   > Alias records for the A or AAAA record types for Traffic Manager are only supported for External Endpoint types. You must provide the IPv4 or IPv6 address (ideally static IPs) as appropriate for external endpoints in Traffic Manager.
- **Point to another DNS record set within the same zone**. Alias records can reference to other record sets of the same type. For example, you can have a DNS CNAME recordset be an alias to another CNAME recordset of the same type. This is useful if you want to have some recordsets be aliases and some as non-aliases in terms of behavior.

## Scenarios
There are a few common scenarios for Alias records:

### Prevent dangling DNS records
From within Azure DNS zones, alias records can be used to closely keep track of the lifecycle of Azure resources such as a Public IP and Traffic Manager profile. One of the common problems with traditional DNS records is “dangling records”, especially with A/AAAA or CNAME record types. 

With a traditional DNS zone record, if the target IP or CNAME no longer exists, the DNS zone record has no knowledge of that fact and needs to be updated manually. In some organizations, this manual update may not happen in time or can be problematic due to the separation of roles and associated permission levels.

For example, the role that has authority to delete a CNAME or IP address belonging to an application may not have sufficient authority to update the DNS record that points to those targets. As a result, there may be a time delay between when the IP or CNAME is deleted and the DNS record that points to it is removed, which could potentially cause an outage for end users.

Alias records remove the complexity associated with this scenario and help prevent such dangling references. When a DNS record is qualified as an alias record to point to a Public IP or a Traffic Manager profile, and if those underlying resources are deleted, the DNS alias record is also removed at the same time. This ensures the end users never suffer an outage.

### Update DNS zones automatically when application IPs change

Similar to the previous scenario, if an application is moved or if the underlying virtual machine is restarted, an alias record is updated automatically when the IP address changes for the underlying Public IP resource. You can avoid potential security risks if end users are directed to another application that has the old IP address.

### Host load balanced applications at the zone apex

The DNS protocol prevents the assignment of anything other than an A or AAAA record at the zone apex (for example: contoso.com). This presents a problem for application owners who have load balanced applications behind a Traffic Manager, as it was not possible to point at the Traffic Manager profile from the zone apex record. As a result, application owners were forced to use a workaround. For example, a redirect at the application layer to redirect from the zone apex to another domain (from contoso.com to www.contoso.com). This presents a single point of failure in terms of the redirect functionality.

With alias records, this problem no longer exists. Application owners can now point their zone apex record to a Traffic Manager profile that has external endpoints. With this capability, application owners can point to the same Traffic Manager profile that is used for any other domain within their DNS zone. 
For example, contoso.com and www.contoso.com can both point to the same Traffic Manager profile as long as the Traffic Manager profile has only external endpoints configured.

## Next steps

To lean more about alias records, see the follwing articles:

- [Tutorial: Configure an alias record to refer to an Azure Public IP address](tutorial-alias-pip.md)
- [Tutorial: Configure an alias record to support apex domain names with Traffic Manager](tutorial-alias-tm.md)
- [DNS FAQ](https://docs.microsoft.com/azure/dns/dns-faq#alias-records)
