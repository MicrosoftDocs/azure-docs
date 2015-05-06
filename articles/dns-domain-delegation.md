<properties 
   pageTitle="Delegate your domain to Azure DNS | Microsoft Azure" 
   description="Understand how to change domain delegation and use Azure DNS name servers to provide domain hosting" 
   services="dns" 
   documentationCenter="na" 
   authors="joaoma" 
   manager="Adinah" 
   editor=""/>

<tags
   ms.service="dns"
   ms.devlang="na"
   ms.topic="article"
   ms.tgt_pltfrm="na"
   ms.workload="infrastructure-services" 
   ms.date="04/28/2015"
   ms.author="joaoma"/>


# Delegate Domain to Azure DNS 

Azure DNS is a hosting service for DNS domains.  In order for DNS queries for a domain to reach Azure DNS, the domain has to be delegated to Azure DNS from the parent domain.  This page explains how domain delegation works and how to delegate domains to Azure DNS.


## How DNS delegation works

### Domains and zones

A domain is a unique name in the Domain Name System, for example ‘contoso.com’.  A domain registrar is a company who can provide Internet domain names.  They will verify if the Internet domain you want to use is available and allow you to purchase it.  Once the domain name is registered, you will be the legal owner for the domain name. If you already have an Internet domain, you will use the current domain registrar to delegate to Azure DNS.

>[AZURE.NOTE] To find out more information on who owns a given domain name or to buy a domain, see domain registrars, locating and buying your domain.

A DNS zone is used to host the DNS records for a particular domain.  For example, the domain ‘contoso.com’ may contain a number of DNS records such as ‘mail.contoso.com’ (for a mail server) and ‘www.contoso.com’ (for a web site).

Azure DNS allows you to host a DNS zone and thereby manage the DNS records for a domain in Azure. Keep in mind Azure DNS is not domain registrar.

The Domain Name System is a hierarchy of domains.  The hierarchy starts from the ‘root’ domain, whose name is simply ‘.’.  Below this come top-level domains, such as ‘com’, ‘net’, ‘org’, ‘uk’ or ‘jp’.  Below these are second-level domains, such as ‘org.uk’ or ‘co.jp’.  And so on.

The domains in the DNS hierarchy are hosted using separate DNS zones.  These zones are globally distributed, hosted by DNS name servers around the world.

### Resolution and delegation

There are two types of DNS server:

- An _authoritative_ DNS server hosts DNS zones.  It answers DNS queries for records in those zones only.
- A _recursive_ DNS server does not host DNS zones.  It answers all DNS queries, by calling authoritative DNS servers to gather the data it needs.

DNS clients in PCs or mobile devices typically call a recursive DNS server to perform any DNS queries the client applications need.

When a recursive DNS server receives a query for a DNS record such as ‘www.contoso.com’, it first needs to find the name server hosting the zone for the ‘contoso.com’ domain.  To do this, it starts at the root name servers, and from there finds the name servers hosting the ‘com’ zone.  It then queries the ‘com’ name servers to find the name servers hosting the ‘contoso.com’ zone.  Finally, it is able to query these name servers for ‘www.contoso.com’.  

This is called resolving the DNS name (strictly, DNS resolution includes additional steps such as following CNAMEs, but that’s not important to understanding how DNS delegation works.)

How does a parent zone ‘point’ to the name servers for a child zone?  It does this using a special type of DNS record, called an NS record (NS stands for ‘name server’).  For example, the root zone contains NS records for ‘com’, showing the name servers for the ‘com’ zone.  In turn, the ‘com’ zone contains NS records for ‘contoso.com’, showing the name servers for the ‘contoso.com’ zone. Setting up the NS records for a child zone in a parent zone is called delegating the domain.

The following diagram illustrates:

![Dns-nameserver](./media/dns-domain-delegation/image1.png)

Each delegation actually has two copies of the NS records—one in the parent zone pointing to the child, and another in the child zone itself.  I.e. the ‘contoso.com’ zone contains the NS records for ‘contoso.com’ (in addition to the NS records in ‘com’).  These are called authoritative NS records, and they sit at the apex of the child zone.


## Delegating a domain to Azure DNS

Once you create your DNS zone in Azure DNS, you need to set up NS records in the parent zone to make Azure DNS the authoritative source for name resolution for your zone. For domains purchased from a registrar, your registrar will offer the option to set up these NS records.

>[AZURE.NOTE] You do not have to own a domain in order to create a DNS zone with that domain name in Azure DNS.  However, you do need to own the domain to set up the delegation to Azure DNS with the registrar.

For example, suppose you purchase the domain ‘contoso.com’, and create a zone with the name ‘contoso.com’ in Azure DNS.  As the owner of the domain, your registrar will offer you the option to configure the name server addresses (i.e. NS records) for your domain.  The registrar will store these NS records in the parent domain, in this case ‘.com’.  Clients around the world will then be directed to your domain in Azure DNS zone when trying to resolve DNS records in ‘contoso.com’.

To set up the delegation, you need to know the name server names for your zone.  Azure DNS allocates name servers from a pool each time a zone is created, and stores these in the authoritative NS records which are automatically created within your zone.  So, to see the name server names, you simply need to retrieve these records.

Using Azure PowerShell, the authoritative NS records can be retrieved as follows (the record name “@” is used to refer to records at the apex of the zone):

	PS C:> $zone = New-AzureDnsZone –Name contoso.com –ResourceGroupName MyAzureResourceGroup
	PS C:> Get-AzureDnsRecordSet –Name “@” –RecordType NS –Zone $zone

	Name              : @
	ZoneName          : contoso.com
	ResourceGroupName : MyResourceGroup
	Ttl               : 3600
	Etag              : 5fe92e48-cc76-4912-a78c-7652d362ca18
	RecordType        : NS
	Records           : {ns1-04.azure-dns.com, ns2-04.azure-dns.net, ns3-04.azure-dns.org,
                     ns4-04.azure-dns.info}
	Tags              : {}

In this example, the zone ‘contoso.com’ has been assigned name servers ‘ns1-04.azure-dns.com’, ‘ns2-04.azure-dns.net’, ‘ns3-04.azure-dns.org’, and ‘ns4-04.azure-dns.info’.

Each registrar has their own DNS management tools to change the name server records for a domain. In the registrar’s DNS management page, edit the NS records and replace the NS records with the ones Azure DNS created.

Having completed the delegation, you can verify that name resolution is working by using a tool such as ‘nslookup’ to query the SOA record for your zone (which is also automatically created when the zone is created).

Note that you do not have to specify the Azure DNS name servers, since the normal DNS resolution process will find the name servers automatically if the delegation has been set up correctly.

	PS C:\> nslookup –type=SOA contoso.com

	Server: ns1-04.azure-dns.com
	Address: 208.76.47.4 

	contoso.com
	primary name server = ns1-04.azure-dns.com
	responsible mail addr = msnhst.microsoft.com
	serial = 1
	refresh = 900 (15 mins)
	retry = 300 (5 mins)
	expire = 604800 (7 days)
	default TTL = 300 (5 mins)


## Next Steps 

[Manage DNS zones](../dns-operations-dnszones)

[Manage DNS records](../dns-operations-recordsets)

[Traffic Manager Overview](../traffic-manmager-overview)

