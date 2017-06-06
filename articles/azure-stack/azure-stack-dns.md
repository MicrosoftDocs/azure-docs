---
title: DNS in Azure Stack | Microsoft Docs
description: DNS in Azure Stack
services: azure-stack
documentationcenter: ''
author: vhorne
manager: byronr
editor: ''

ms.assetid:
ms.service: azure-stack
ms.workload: na
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 3/2/2017
ms.author: victorh

---
# DNS in Azure Stack
Azure Stack TP3 introduces two new DNS features:
* Support for DNS hostname resolution
* Create and manage DNS zones and records using API

## Support for DNS hostname resolution
You can now specify a DNS domain name label for a public IP resource, which creates a mapping for *domainnamelabel.location*.cloudapp.azurestack.external to the public IP address in the Azure Stack managed DNS servers.  

For example, if you create a public IP resource with **contoso** as a **domainnamelabel** in the Local Azure Stack location, the fully-qualified domain name (FQDN) **contoso.local.cloudapp.azurestack.external** resolves to the public IP address of the resource. You can use this FQDN to create a custom domain CNAME record that points to the public IP address in Azure Stack if you want.

> [!IMPORTANT]
> Each domain name label created must be unique within its Azure Stack location.

If you create the public IP address using the portal, it will look like the following:

![Create public IP address](media/azure-stack-whats-new-dns/image01.png)

This is particularly useful if you want to associate a public IP address with a load-balanced resource. For example, you might have a load balancer processing requests from a web application to a web site located behind the load balancer on one or more virtual machines.  Now you can access the load-balanced web site by a DNS name, rather than by an IP address.

## Create and manage DNS zones and records using API
TP3 introduces the ability to create and manage DNS zones and records in Azure Stack.  

Azure Stack provides a DNS service like that of Azure’s, using APIs that are consistent with Azure’s DNS APIs.  By hosting your domains in Azure Stack DNS, you can manage your DNS records with the same credentials, APIs, tools, billing, and support as your other Azure services. For obvious reasons the Azure Stack DNS infrastructure is more compact than Azure's. Because of this, the scope, scale, and performance depends on the scale of the Azure Stack deployment and the environment where it is deployed.  So, things like performance, availability, global distribution, and High-Availability (HA) can vary from deployment to deployment.

## Comparison with Azure DNS
DNS in Azure Stack is very similar to DNS in Azure, with two major exceptions:
* **It does not support AAAA records**

    Azure Stack does NOT support AAAA records because Azure Stack does not support IPv6 addresses.  This is a key difference between DNS in Azure and Azure Stack.
* **It is not multi-tenant**

    Unlike Azure, the DNS Service in Azure Stack is not multi-tenant.  This means that each tenant cannot create the same DNS zone.  Only the first subscription that attempts to create the zone will succeed, and subsequent requests and will fail.  This is a known issue, and a key difference between Azure and Azure Stack DNS.  This issue will be resolved in a future release.

In addition, there are some minor differences in how Azure Stack DNS implements Tags, Metadata, Etags, and Limits.

The following information applies specifically to Azure Stack DNS and varies slightly from Azure DNS. To learn more about Azure DNS, see [DNS zones and records](../dns/dns-zones-records.md) at the Microsoft Azure documentation site.

### Tags, metadata, and Etags

**Tags**

Azure Stack DNS supports using Azure Resource Manager tags on DNS zone resources. It does not support tags on DNS record sets, although as an alternative 'metadata' is supported on DNS record sets as explained next.

**Metadata**

As an alternative to record set tags, Azure Stack DNS supports annotating record sets using 'metadata'. Similar to tags, metadata enables you to associate name-value pairs with each record set. For example, this can be useful to record the purpose of each record set. Unlike tags, metadata cannot be used to provide a filtered view of your Azure bill and cannot be specified in an Azure Resource Manager policy.

**Etags**

Suppose two people or two processes try to modify a DNS record at the same time. Which one wins? And does the winner know that they've overwritten changes created by someone else?

Azure Stack DNS uses Etags to handle concurrent changes to the same resource safely. Etags are separate from Azure Resource Manager 'Tags'. Each DNS resource (zone or record set) has an Etag associated with it. Whenever a resource is retrieved, its Etag is also retrieved. When updating a resource,you can choose to pass back the Etag so Azure Stack DNS can verify that the Etag on the server matches. Since each update to a resource results in the Etag being regenerated, an Etag mismatch indicates a concurrent change has occurred. Etags can also be used when creating a new resource to ensure that the resource does not already exist.

By default, Azure Stack DNS PowerShell uses Etags to block concurrent changes to zones and record sets. The optional *-Overwrite* switch can be used to suppress Etag checks, in which case any concurrent changes that have occurred are overwritten.

At the level of the Azure Stack DNS REST API, Etags are specified using HTTP headers. Their behavior is given in the following table:

| Header | Behavior|
|--------|---------|
| None   | PUT always succeeds (no Etag checks)|
| If-match| PUT only succeeds if resource exists and Etag matches|
| If-match *| PUT only succeeds if resource exists|
| If-none-match *| PUT only succeeds if resource does not exist|

### Limits

The following default limits apply when using Azure Stack DNS:

| Resource| Default limit|
|---------|--------------|
| Zones per subscription| 100|
| Record sets per zone| 5000|
| Records per record set| 20|

## Next steps
[Introducing iDNS for Azure Stack](azure-stack-understanding-dns.md)
