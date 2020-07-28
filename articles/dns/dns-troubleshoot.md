---
title: Troubleshooting guide - Azure DNS
description: In this learning path, get started troubleshooting common issues with Azure DNS
services: dns
author: rohinkoul
ms.service: dns
ms.topic: troubleshooting
ms.date: 09/20/2019
ms.author: rohink
---

# Azure DNS troubleshooting guide

This article provides troubleshooting information for common Azure DNS questions.

If these steps don't resolve your issue, you can also search for or post your issue on our [Microsoft Q&A question page for community support](https://docs.microsoft.com/answers/topics/azure-virtual-network.html). Or, you can open an Azure support request.


## I can't create a DNS zone

To resolve common issues, try one or more of the following steps:

1.	Review the Azure DNS audit logs to determine the failure reason.
2.	Each DNS zone name must be unique within its resource group. That is, two DNS zones with the same name can't share a resource group. Try using a different zone name, or a different resource group.
3.	You may see an error "You have reached or exceeded the maximum number of zones in subscription {subscription id}." Either use a different Azure subscription, delete some zones, or contact Azure Support to raise your subscription limit.
4.	You may see an error "The zone '{zone name}' is not available." This error means that Azure DNS was unable to allocate name servers for this DNS zone. Try using a different zone name. Or, if you are the domain name owner you can contact Azure support to allocate name servers for you.


### Recommended articles

* [DNS zones and records](dns-zones-records.md)
* [Create a DNS zone](dns-getstarted-create-dnszone-portal.md)

## I can't create a DNS record

To resolve common issues, try one or more of the following steps:

1.	Review the Azure DNS audit logs to determine the failure reason.
2.	Does the record set exist already?  Azure DNS manages records using record *sets*, which are the collection of records of the same name and the same type. If a record with the same name and type already exists, then to add another such record you should edit the existing record set.
3.	Are you trying to create a record at the DNS zone apex (the ‘root’ of the zone)? If so, the DNS convention is to use the ‘@’ character as the record name. Also note that the DNS standards don't permit CNAME records at the zone apex.
4.	Do you have a CNAME conflict?  The DNS standards don't allow a CNAME record with the same name as a record of any other type. If you have an existing CNAME, creating a record with the same name of a different type fails.  Likewise, creating a CNAME fails if the name matches an existing record of a different type. Remove the conflict by removing the other record or choosing a different record name.
5.	Have you reached the limit on the number of record sets permitted in a DNS zone? The current number of record sets and the maximum number of record sets are shown in the Azure portal, under the 'Properties' for the zone. If you've reached this limit, then either delete some record sets or contact Azure Support to raise your record set limit for this zone, then try again. 


### Recommended articles

* [DNS zones and records](dns-zones-records.md)
* [Create a DNS zone](dns-getstarted-create-dnszone-portal.md)



## I can't resolve my DNS record

DNS name resolution is a multi-step process, which can fail for many reasons. The following steps help you investigate why DNS resolution is failing for a DNS record in a zone hosted in Azure DNS.

1.	Confirm that the DNS records have been configured correctly in Azure DNS. Review the DNS records in the Azure portal, checking that the zone name, record name, and record type are correct.
2.	Confirm that the DNS records resolve correctly on the Azure DNS name servers.
    - If you make DNS queries from your local PC, you may see cached results that don’t reflect the current state of the name servers.  Also, corporate networks often use DNS proxy servers, which prevent DNS queries from being directed to specific name servers.  To avoid these problems, use a web-based name resolution service such as [digwebinterface](https://digwebinterface.com).
    - Be sure to specify the correct name servers for your DNS zone, as shown in the Azure portal.
    - Check that the DNS name is correct (you have to specify the fully qualified name, including the zone name) and the record type is correct
3.	Confirm that the DNS domain name has been correctly [delegated to the Azure DNS name servers](dns-domain-delegation.md). There are a [many 3rd-party web sites that offer DNS delegation validation](https://www.bing.com/search?q=dns+check+tool). This test is a *zone* delegation test, so you should only enter the DNS zone name and not the fully qualified record name.
4.	Having completed the above, your DNS record should now resolve correctly. To verify, you can again use [digwebinterface](https://digwebinterface.com), this time using the default name server settings.


### Recommended articles

* [Delegate a domain to Azure DNS](dns-domain-delegation.md)



## How do I specify the ‘service’ and ‘protocol’ for an SRV record?

Azure DNS manages DNS records as record sets—the collection of records with the same name and the same type. For an SRV record set, the 'service' and 'protocol' need to be specified as part of the record set name. The other SRV parameters ('priority', 'weight', 'port' and 'target') are specified separately for each record in the record set.

Example SRV record names (service name 'sip', protocol 'tcp'):

- \_sip.\_tcp (creates a record set at the zone apex)
- \_sip.\_tcp.sipservice (creates a record set named 'sipservice')

### Recommended articles

* [DNS zones and records](dns-zones-records.md)
* [Create DNS record sets and records by using the Azure portal](dns-getstarted-create-recordset-portal.md)
* [SRV record type (Wikipedia)](https://en.wikipedia.org/wiki/SRV_record)


## Next steps

* Learn about [Azure DNS zones and records](dns-zones-records.md)
* To start using Azure DNS, learn how to [create a DNS zone](dns-getstarted-create-dnszone-portal.md) and [create DNS records](dns-getstarted-create-recordset-portal.md).
* To migrate an existing DNS zone, learn how to [import and export a DNS zone file](dns-import-export.md).

