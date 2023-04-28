---
title: Troubleshooting guide - Azure DNS
description: In this learning path, get started troubleshooting common issues with Azure DNS
services: dns
author: greg-lindsay
ms.service: dns
ms.topic: troubleshooting
ms.date: 09/27/2022
ms.author: greglin
---
# Azure DNS troubleshooting guide

This article provides troubleshooting information for common Azure DNS questions.

If these steps don't resolve your issue, you can also search for or post your issue on our [Microsoft Q&A question page for community support](/answers/topics/azure-virtual-network.html). Or, you can open an Azure support request.

## I can't create a DNS zone

To resolve common issues, try one or more of the following steps:

1.	Review the Azure DNS audit logs to determine the failure reason.
2.	Each DNS zone name must be unique within its resource group. That is, two DNS zones with the same name can't share a resource group. Try using a different zone name, or a different resource group.
3.	You may see an error "You have reached or exceeded the maximum number of zones in subscription {subscription ID}." Either use a different Azure subscription, delete some zones, or contact Azure Support to raise your subscription limit.
4.	You may see an error "The zone '{zone name}' is not available." This error means that Azure DNS was unable to allocate name servers for this DNS zone. Try using a different zone name. Or, if you are the domain name owner you can contact Azure support to allocate name servers for you.

### Recommended articles

* [DNS zones and records](dns-zones-records.md)
* [Create a DNS zone](./dns-getstarted-portal.md)

## I can't create a DNS record

To resolve common issues, try one or more of the following steps:

1.	Review the Azure DNS audit logs to determine the failure reason.
2.	Does the record set exist already?  Azure DNS manages records using record *sets*, which are the collection of records of the same name and the same type. If a record with the same name and type already exists, then to add another such record you should edit the existing record set.
3.	Are you trying to create a record at the DNS zone apex (the ‘root’ of the zone)? If so, the DNS convention is to use the ‘@’ character as the record name. Also note that the DNS standards don't permit CNAME records at the zone apex.
4.	Do you have a CNAME conflict?  The DNS standards don't allow a CNAME record with the same name as a record of any other type. If you have an existing CNAME, creating a record with the same name of a different type fails.  Likewise, creating a CNAME fails if the name matches an existing record of a different type. Remove the conflict by removing the other record or choosing a different record name.
5.	Have you reached the limit on the number of record sets permitted in a DNS zone? The current number of record sets and the maximum number of record sets are shown in the Azure portal, under the 'Properties' for the zone. If you've reached this limit, then either delete some record sets or contact Azure Support to raise your record set limit for this zone, then try again. 

### Recommended articles

* [DNS zones and records](dns-zones-records.md)
* [Create a DNS zone](./dns-getstarted-portal.md)

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

## DNS zone status and unhealthy delegation scenarios

DNS zone status indicates the current status of the zone. DNS zone status can be **Unknown**, **Available**, and **Degraded**.

### Unknown

When a resource is newly created, health signals for these new resources aren't available immediately. A maximum of 24 hours may pass to get the correct health signals for DNS zones. Until this time, the health of the DNS zones will be shown as **Unknown**.

When resource health check hasn't received information about DNS zones for more than 6 hours, the zones are marked Unknown. Although this status isn't a definitive indication of the state of the resource, it's an important data point in the troubleshooting process. Once the signal is received and the resource is running as expected, the status of the resource will change to **Available** after a few minutes.

The following screenshot is an example of the resource health check message.

:::image type="content" source="./media/dns-troubleshoot/unknown-status.png" alt-text="Screenshot of unknown status.":::

### Available

An **Available** status indicates that the resource health check hasn't detected a delegation issue with your DNS zones. This status means that NS delegation records are appropriately maintained in your primary zone and records meant for child zones aren't present in your primary zone. 

The following screenshot is an example of the resource health check message.

:::image type="content" source="./media/dns-troubleshoot/available-status.png" alt-text="Screenshot of available status.":::

### Degraded

A **Degraded** status indicates that the resource health check has detected a delegation issue with your DNS zones. Correct the delegation configuration and wait 24 hours for the status to change to **Available**.  

The following screenshot is an example of the resource health check message.

:::image type="content" source="./media/dns-troubleshoot/degraded-status.png" alt-text="Screenshot of degraded status.":::

If 24 hours have elapsed after correcting the configuration and the DNS zones are still degraded, contact support.  

### Configuration error scenario

The following scenario demonstrates where a configuration error has led to the unhealthy state of the DNS zones.

**Unhealthy Delegation**

A primary zone contains NS delegation records, which help delegate traffic from the primary to the child zones. If any NS delegation record is present in the parent zone, the DNS server is supposed to mask all other records below the NS delegation record, except glue records, and direct traffic to the respective child zone based on the user query. If a parent zone contains other records meant for the child zones (delegated zones) below the NS delegation record, the zone will be marked unhealthy, and its status is **Degraded**.

**What are glue records?** - These are records under the delegation record, which help direct traffic to the delegated/child zones using their IP addresses and are configured as seen in the following.

| Setting | Value |
| ------- | ----- |
| **Zone** | contoso.com |
| **Delegation record** | Child NS </br> ns1.child.contoso.com |
| **Glue record** | ns1.child A 1.1.1.1 |

#### Example of an unhealthy zone

The following is an example of a zone containing records below NS delegation.

* Zone Name: contoso.com

| Name | Type | TTL | Value |
| ---- | ---- | --- | ----- |
| @ | NS | 3600 | ns1-04.azure-dns.com. |
| @ | SOA | 3600 | _SOA values_ |
| * | A | 3600 | 255.255.255.255 |
| **child** | **NS** | **3600** | **ns1-08.azure-dns.com** (NS delegation record) |
| _**foo.child**_ | _**A**_ | _**3600**_ | _**10.10.10.10**_ |
| _**txt.child**_ | _**TXT**_ | _**3600**_ | _**"text record"**_ |
| abc.test | A | 3600 | 5.5.5.5 |

In the preceding example, **child** is the NS delegation records. The records _**foo.child**_ and _**txt.child**_ are records that should only be present in the child zone, **child.contoso.com**. These records might cause inconsistencies if they aren't removed from the parent zone, **contoso.com**. These inconsistencies could cause the zone to be considered as unhealthy with a **Degraded** status.

#### Examples of when a zone is considered healthy or unhealthy

| Example | Status |
| ------- | ------ |
| Zone doesn't contain NS delegation records, glue records, and other records. | **Healthy** |
| Zone only contains NS delegation records. | **Healthy** |
| Zone only contains NS delegation records and glue records. | **Healthy** |
| Zone contains NS delegation records and other records (except glue records) below delegation record, that should be present in the child zone. | **Unhealthy** |
| Zone contains NS delegation Records, glue records, and other records (except glue records). | **Unhealthy** |

**How can you fix it?** - To resolve, locate and remove all records except glue records under NS delegation records in your parent zone.

**How to locate unhealthy delegation records?** - A script has been created to find the unhealthy delegation records in your zone.  The script will report records, which are unhealthy.

1. Save the script located at: [Find unhealthy DNS records in Azure DNS - PowerShell script sample](./scripts/find-unhealthy-dns-records.md)

2. Execute the script as mentioned in the script editor.  Script can be edited to meet your requirements.

**Historical information** - You can access up to 14 days of health history in the health history section of resource health. This section will also contain the reason for the downtime (when available) for the downtimes reported by resource health. Currently, Azure shows the downtime for your DNS zones resource at a 24-hour granularity.

## How do I specify the ‘service’ and ‘protocol’ for an SRV record?

Azure DNS manages DNS records as record sets—the collection of records with the same name and the same type. For an SRV record set, the 'service' and 'protocol' need to be specified as part of the record set name. The other SRV parameters ('priority', 'weight', 'port' and 'target') are specified separately for each record in the record set.

Example SRV record names (service name 'sip', protocol 'tcp'):

- \_sip.\_tcp (creates a record set at the zone apex)
- \_sip.\_tcp.sipservice (creates a record set named 'sipservice')

### Recommended articles

* [DNS zones and records](dns-zones-records.md)
* [Create DNS record sets and records by using the Azure portal](./dns-getstarted-portal.md)
* [SRV record type (Wikipedia)](https://en.wikipedia.org/wiki/SRV_record)

## Next steps

* Learn about [Azure DNS zones and records](dns-zones-records.md)
* To start using Azure DNS, learn how to [create a DNS zone](./dns-getstarted-portal.md) and [create DNS records](./dns-getstarted-portal.md).
* To migrate an existing DNS zone, learn how to [import and export a DNS zone file](dns-import-export.md).
