---
title: Understand Domain Name Systems in Azure NetApp Files 
description: The Domain Name Systems (DNS) service is a critical component of data access in Azure NetApp Files.
services: azure-netapp-files
author: whyistheinternetbroken
ms.service: azure-netapp-files
ms.topic: how-to
ms.date: 01/29/2025
ms.author: anfdocs
---
# Understand Domain Name Systems in Azure NetApp Files 

Azure NetApp Files supports the use of Active Directory integrated DNS or standalone DNS servers and requires reliable access to Domain Name System (DNS) services and up-to-date DNS records. Poor network connectivity between Azure NetApp Files and DNS servers can cause client access interruptions or client time-outs. Incomplete or incorrect DNS records for Active Directory Domain Services (AD DS) or Azure NetApp Files can cause client access interruptions or client time-outs. 

The DNS service is a critical component of data access in Azure NetApp Files. File protocol access over SMB, NFSV4.1 Kerberos, LDAP, and Active Directory Site Discovery all make significant use of DNS for their operations. Using a hostname centrally located in DNS simplifies access to a volume and protects against scenarios when an IP address changes. Rather than an administrator needing to inform users of a new IP address, users can continue using the user-friendly hostname.

DNS servers are configured under Active Directory connections. A primary and secondary server can be added, as well as the Active Directory DNS name.

>[!NOTE]
>As a best practice, configure more than one DNS server for redundancy.

:::image type="content" source="media/domain-name-system-concept/edit-settings.png" alt-text="Screenshot of DNS settings." lightbox="media/domain-name-system-concept/edit-settings.png":::

## About DNS servers

Azure NetApp Files requires an Active Directory connection for SMB and NFSv4.1 Kerberos functionality. Active Directory requires DNS for proper functionality. In most cases, Active Directory deployments are installed with DNS servers integrated with the domain controllers. This configuration is a [Microsoft best practice](/windows-server/identity/ad-ds/plan/dns-and-ad-ds) for both ease of use and to ensure all required DNS records are created for domain services.

:::image type="content" source="media/domain-name-system-concept/integrated-active-directory-dns.png" alt-text="Diagram of AD DNS configuration." lightbox="media/domain-name-system-concept/integrated-active-directory-dns.png":::

In some cases, external DNS servers (such as BIND) may be used in lieu of (or in addition to) Active Directory hosted DNS services. This is called a [disjointed namespace](/windows-server/identity/ad-ds/plan/disjoint-namespace).

:::image type="content" source="media/domain-name-system-concept/external-bind-dns.png" alt-text="Diagram of external bind configuration." lightbox="media/domain-name-system-concept/external-bind-dns.png":::

Azure NetApp Files supports the use of both integrated and external DNS servers, but when using external DNS servers without Active Directory integration, it's important to ensure that the necessary service (SRV) records are added to DNS for proper functionality and redundancy of services. Poor network connectivity between Azure NetApp Files and DNS servers can cause client access interruptions or client time-outs. Incomplete or incorrect DNS records for AD DS or Azure NetApp Files can cause client access interruptions or client time-outs.

See [DNS records in Azure NetApp Files](#types-of-dns-records-in-azure-netapp-files) for a list of SRV records the service uses. Also review the [guidelines for DNS with Active Directory](/windows-server/) and [Integrating AD DS into an existing DNS infrastructure](/windows-server/identity/ad-ds/plan/integrating-ad-ds-into-an-existing-dns-infrastructure).

## Azure DNS integration with Azure NetApp Files

[Azure DNS](/azure/dns/dns-for-azure-services) is a hosted DNS management and name resolution service in Microsoft Azure. You can use it to create public or private DNS names for other applications and services that you deploy in Azure – including Azure NetApp Files. Deploying DNS in Azure prevents the need to send DNS requests (over port 53) directly between Azure NetApp Files and on-premises DNS and/or an Active Directory domain. Additionally, Azure DNS can be used to create conditional forwarders (using the Azure Private DNS resolver) that can be used to send DNS requests from Azure NetApp Files to specific DNS servers by way of the private DNS servers hosted in Azure, which can be specified for use in the Active Directory connection.

:::image type="content" source="media/domain-name-system-concept/azure-dns.png" alt-text="Diagram of Azure DNS configuration." lightbox="media/domain-name-system-concept/azure-dns.png":::

For information on using Azure DNS:
- [How Azure DNS works with other Azure services](/azure/dns/dns-for-azure-services)
- [Quickstart: Create an Azure DNS zone and record using the Azure portal](/azure/dns/dns-getstarted-portal)
- [Quickstart: Create an Azure private DNS zone using the Azure portal](/azure/dns/private-dns-getstarted-portal)
- [Quickstart: Create an Azure DNS Private Resolver using the Azure portal](/azure/dns/dns-private-resolver-get-started-portal)

## Using load balancer IP addresses with DNS in Azure NetApp Files

A load balancer device is a way for a single IP address to be used to service multiple IP addresses on the backend. This provides security via obfuscation, as well as performance and redundancy benefits for enterprise environments.

:::image type="content" source="media/domain-name-system-concept/load-balancer.png" alt-text="Diagram of a load balancer configuration." lightbox="media/domain-name-system-concept/load-balancer.png":::

A DNS load balancer can service requests and send them to multiple DNS servers designated in a pool. [Microsoft Azure provides native load balancing services](https://azure.microsoft.com/solutions/load-balancing-with-azure/) for multiple use cases.

Azure NetApp Files supports the use of DNS load balancers, provided they supply an IP address as an endpoint and that IP address can communicate over port 53 to the Azure NetApp Files networks. For instance, Azure Traffic Manager provides DNS load balancing at layer 7, but only provides a front-end hostname for use. Azure NetApp Files Active Directory connections only allow IP addresses to be specified for DNS servers.

## Types of DNS records in Azure NetApp Files

Azure NetApp Files makes use of different types of DNS records for access to file services.

| DNS record type | Definition |
| -- | ------- |
| A/AAAA | DNS [A records](https://www.cloudflare.com/learning/dns/dns-records/dns-a-record/) are address records that indicate the IPv4 address for a hostname. AAAA records indicate the IPv6 address for a hostname. Azure NetApp Files uses [A/AAAA records](https://www.cloudflare.com/learning/dns/dns-records/dns-aaaa-record/) in the following ways: <ul><li>Masking IP addresses behind user-friendly hostnames</li><li>Kerberos service principal requests</li><li>Root domain queries</li></ul> |
| Pointer records (PTR) | A [PTR record](https://www.cloudflare.com/learning/dns/dns-records/dns-ptr-record/) maps an IP address to a hostname by way of a reverse [lookup zone](https://developers.cloudflare.com/dns/additional-options/reverse-zones/). PTR records are primarily used when an IP address is specified for a mount/share in Azure NetApp Files. Use of an IP address in mount/share requests can impact the authentication method used. For more information, see [IP addresses for access with Kerberos](kerberos.md#ip-addresses-for-access-with-kerberos).
| Service records (SRV)	| [SRV records](https://www.cloudflare.com/learning/dns/dns-records/dns-srv-record/) are used to specify which hosts and ports are used for a specific service, such as LDAP, NFS, CIFS, Kerberos, etc. SRV records in Azure NetApp Files are heavily utilized for file service security (such as Kerberos), site discovery in Active Directory, LDAP server queries, and more. It's important to verify the existence of these records for proper functionality of Azure NetApp Files services. <br></br> SRV records can be queried using `nslookup` or `dig` commands. For examples, see [Using `nslookup` and `dig` for DNS queries](#using-nslookup-and-dig-for-dns-queries). |
| Canonical names (CNAME) | A CNAME record is a way to provide DNS aliases for A/AAAA records. CNAME records are optional but can be useful to reduce the complexity of the hostname records provided by Azure NetApp Files. For more information, see [DNS aliases and Canonical Name records](#dns-aliases-and-canonical-name-cname-records). |
| Uniform Resource Identifier (URI) | A [URI record](https://www.rfc-editor.org/rfc/rfc7553) is a way to map hostnames/IP addresses for services to URIs. URIs are presented in a format as such: service://fqdn.contoso.com. <br></br> Azure NetApp Files makes use of queries for URI records only when performing Kerberos KDC lookups for NFS Kerberos requests. URI records aren't created in Active Directory DNS deployments by default. As such, URI lookup requests usually fail and fall back to SRV record lookups. |

### Service records (SRV) used with Azure NetApp Files

Azure NetApp Files makes use of the following SRV records:

- **NFS Kerberos***
    - _kerberos-master._tcp.CONTOSO.COM (port 88)*
    - _kerberos-master._tcp.CONTOSO.COM (port 88)*
- **SMB/Active Directory site discovery****
    - _kerberos.CONTOSO.COM (port 88)
    - _kerberos._tcp.CONTOSO.COM (port 88)
    - _kerberos._tcp.dc_msdcs.CONTOSO.COM (port 88)
    - _kpasswd._tcp.dc._msdcs.CONTOSO.COM (port 464)
    - _kpasswd._tcp.CONTOSO.COM (port 464)
    - _kerberos._tcp.Default-First-Site-Name._sites.dc._msdcs.CONTOSO.COM (port 88)
    - _kerberos._tcp.{other site names}._sites.dc._msdcs.CONTOSO.COM (port 88)
    - _kerberos.udp.CONTOSO.COM (port 88)
    - _kerberos._udp.dc_msdcs.CONTOSO.COM (port 88) 
    - _kpasswd._udp.dc._msdcs.CONTOSO.COM (port 464)
    - _kpasswd._udp.CONTOSO.COM  (port 464)
    - _kerberos._udp.Default-First-Site-Name._sites.dc._msdcs.CONTOSO.COM (port 88)
    - _kerberos._udp.{other site names}._sites.dc._msdcs.CONTOSO.COM (port 88)
- **LDAP****
    - _ldap.CONTOSO.COM (port 389)
    - _ldap._tcp.CONTOSO.COM (port 389)
    - _ldap._udp.CONTOSO.COM (port 389)

\* Active Directory DNS doesn't create these SRV records by default. It's highly recommended to create them if using NFS Kerberos.

\** Active Directory DNS creates these SRV records by default.

For more information on how Azure NetApp Files uses SRV records, see:

- [Understand the use of LDAP in Azure NetApp Files](lightweight-directory-access-protocol.md)
- [About Kerberos in Azure NetApp Files](kerberos.md)

>[!NOTE]
>For proper Key Distribution Center discovery and redundancy in NFS Kerberos, URI records and/or kerberos-master SRV records must be created.

## Dynamic DNS

Azure NetApp Files volumes provide a single IP address for a volume, which is then added to DNS automatically via [dynamic DNS (DDNS)](/azure/virtual-network/virtual-networks-name-resolution-ddns) (if dynamic DNS is supported in the DNS server). Hostnames (rather than IP addresses) are used for volume mount paths in specific configurations. Use of hostnames in mount paths require DNS for proper functionality:

- SMB volumes
- NFSv4.1 Kerberos
- Dual-protocol volumes

**NFSv4.1 Kerberos:**

:::image type="content" source="media/domain-name-system-concept/nfsv41-mount-path.png" alt-text="Screenshot of NFSv4.1 mount path." lightbox="media/domain-name-system-concept/nfsv41-mount-path.png":::

**SMB**

:::image type="content" source="media/domain-name-system-concept/smb-mount-path.png" alt-text="Screenshot of SMB mount path." lightbox="media/domain-name-system-concept/smb-mount-path.png":::


**Dual protocol**

:::image type="content" source="media/domain-name-system-concept/dual-protocol-mount-path.png" alt-text="Screenshot of dual protocol mount path." lightbox="media/domain-name-system-concept/dual-protocol-mount-path.png":::

An IP address is used for the mount path when an Azure NetApp File volume doesn't require DNS, such as NFSv3 or NFSv4.1 without Kerberos. 

**NFSv3**

:::image type="content" source="media/domain-name-system-concept/nfsv3-mount-path.png" alt-text="Screenshot of NFS3 mount path." lightbox="media/domain-name-system-concept/nfsv3-mount-path.png":::

### Considerations 

In Azure NetApp Files, dynamic DNS updates send two different requests to the configured DNS server: one for a PTR and one for an A/AAAA record creation/update. 

- Azure NetApp Files volumes created with hostnames automatically notify the DNS server to create an A/AAAA record. This happens immediately after the volume creation completes.
- If a DNS A/AAAA record already is present for the IP address/hostname combination, then no new records are created.
- If a DNS A/AAAA record is present for the same hostname with a *different* IP address, then a second A/AAAA record with the same name is created.
- For Azure NetApp Files volumes created without hostnames (such as NFSv3 volumes), dynamic DNS doesn't create the DNS records since there's no hostname assigned in the service. The records must be created manually.
- If a reverse lookup zone for the interface’s IP subnet exists, then the DNS server also creates a PTR record. If the necessary reverse lookup zone doesn't exist, then a PTR record can't be created automatically. You must create the PTR record manually.
- If a DNS entry created by dynamic DNS is deleted on the DNS server, it's recreated within 24 hours by a new dynamic DNS update from Azure NetApp Files.
- Secure DDNS gets enabled when SMB or dual protocol volumes are created. NFS volumes don't enable secure DDNS, but do enable DDNS. If secure DDNS is disabled on the DNS server or the Kerberos authentication fails, then DDNS updates don't work.

    | Dynamic DNS type | Port |
    | --- | --- |
    | Standard DNS | UDP 53 |
    | Secure DNS | TCP 53 |

- Azure NetApp Files supports secure DDNS only with Microsoft Active Directory DNS servers.

### Dynamic DNS entry details

When Azure NetApp Files creates a DNS A/AAAA record via dynamic DNS, the following configurations are used:

- **An associated PTR record box is checked:** If reverse lookup zones for the subnet exist, then A/AAAA records automatically create PTR records without administrator intervention.
- **The “Delete this record when it becomes stale” box is checked:** When the DNS record becomes “stale,” DNS deletes the record, provided scavenging for DNS has been enabled.
- **The DNS record’s “time to live (TTL)” is set to one day (24 hours):** The TTL setting can be modified by the DNS administrator as needed. The TTL on a DNS record determines the length of time a DNS entry exists in a client’s DNS cache.

>[!NOTE]
>To view timestamps and the Time to Live (TTL) when a DNS record was created in Windows Active Directory DNS, navigate to the View menu of the DNS Manager then select Advanced. From there, select the A/AAAA record entry and view the properties.

:::image type="content" source="media/domain-name-system-concept/timestamp-screenshot.png" alt-text="Screenshot of DNS timestamps." lightbox="media/domain-name-system-concept/timestamp-screenshot.png":::


## How standard dynamic DNS works in Azure NetApp Files

Azure NetApp Files follows four basic steps to create dynamic DNS updates to the configured DNS servers. Standard dynamic DNS (DDNS) updates traverse **UDP** port 53.

- A SOA DNS query for the IP address of the Azure NetApp Files volume interface is performed.
- A DDNS update for the PTR is performed. If the PTR doesn't exist, it gets created.
- A DNS start of authority (SOA) query is made for the fully qualified domain name (FQDN) of the Azure NetApp Files volume.
- A DDNS update for the A/AAAA record is performed. If the record doesn't exist, it gets created.

 ###  Dynamic DNS via packet capture

<details>
<summary>Packet captures can be useful in troubleshooting service issues that might not have available logging to analyze. Expand this view for a detailed looked at packet captures.</summary>


1. A SOA DNS query for the IP address of the Azure NetApp Files volume interface is performed.
    ```
    143 x.x.x.y	x.x.x.x	DNS	86	Standard query 0x77c8 SOA y.x.x.x.in-addr.arpa
    
    144 x.x.x.x	x.x.x.y	DNS	229	Standard query response 0x77c8 No such name SOA y.x.x.x.in-addr.arpa SOA dc1.anf.local A x.x.x.x AAAA aaaa:bbbb:cccc:d:eeee:ffff:0000:1111 AAAA aaaa:bbbb:cccc:d:eeee:ffff:0000:1111
    ```
 
2. A DDNS update for the PTR is performed. If the PTR doesn't exist, it gets created.

    ```
    145 x.x.x.y	x.x.x.x	DNS	121	Dynamic update 0x1a43 SOA x.x.x.in-addr.arpa PTR ANF1234.anf.local

    146 x.x.x.x	x.x.x.y	DNS	121	Dynamic update response 0x1a43 SOA x.x.x.in-addr.arpa PTR ANF1234.anf.local
    ```  

3. A DNS start of authority (SOA) query is made for the fully qualified domain name (FQDN) of the Azure NetApp Files volume.

    ```
    147 x.x.x.y	x.x.x.x	DNS	81	Standard query 0xcfab SOA ANF1234.anf.local

    148 x.x.x.x	x.x.x.y	DNS	214	Standard query response 0xcfab No such name SOA ANF1234.anf.local SOA dc1.anf.local A x.x.x.x AAAA aaaa:bbbb:cccc:d:eeee:ffff:0000:1111
    ```
4. A DDNS update for the A/AAAA record is performed. If the record doesn't exist, it gets created.

    ```
    149 x.x.x.y	x.x.x.x	DNS	97	Dynamic update 0x83b2 SOA anf.local A x.x.x.y

    150 x.x.x.x	x.x.x.y	DNS	97	Dynamic update response 0x83b2 SOA anf.local A x.x.x.y
    ```
    

</details>

### How secure DDNS works in Azure NetApp Files

When secure DNS is enabled, Azure NetApp Files negotiates with the DNS server to authenticate via GSS using [Secret Key Transaction Authentication for DNS](/openspecs/windows_protocols/ms-gssa/42bab475-fada-4f4a-a6ec-c84cf36d3779), ensuring that the requested updates are coming from a legitimate source. The following shows the steps used during this process.Secure DDNS updates traverse **TCP** port 53.

- A SOA DNS query for the IP address of the Azure NetApp Files volume interface is performed.
- A Kerberos service ticket is exchanged for the DNS service on the DNS server.
- The ticket is then used in a DNS query for a transaction key (TKEY) from Azure NetApp Files to the DNS server, which is passed using [GSS-TSIG (transaction signature)](/openspecs/windows_protocols/ms-gssa/c0c6ffdd-a094-40b1-bbb9-bc4e5a58804f) to authenticate.
- Once successfully authenticated, a secure dynamic DNS update is sent using the TKEY to create the PTR is sent using GSS-TSIG. If the record doesn't already exist, it gets created. 
- A DNS SOA query is sent for the fully qualified domain name (FQDN) of the Azure NetApp Files volume and responded to.
- A new TKEY ID is exchanged between the DNS server and Azure NetApp Files.
- A secure dynamic DNS update is sent using the TKEY to create the A/AAAA record for the FQDN. If the record already exists with the same IP address, no changes are made.

###  Dynamic DNS via packet capture

<details>
<summary>Packet captures can be useful in troubleshooting service issues that might not have available logging to analyze. Expand this view for a detailed looked at packet captures.</summary>

1. A SOA DNS query for the IP address of the Azure NetApp Files volume interface is performed.

    ```
    1135 x.x.x.y 	x.x.x.x	DNS	86	Standard query 0xd29a SOA y.x.x.x.in-addr.arpa
    
    1136 x.x.x.x	x.x.x.y	DNS	229	Standard query response 0xd29a No such name SOA y.x.x.x.in-addr.arpa SOA dc1.anf.local A x.x.x.x AAAA aaaa:bbbb:cccc:d:eeee:ffff:0000:1111
    ```

2. A Kerberos service ticket is exchanged for the DNS service on the DNS server.

    ```
    1141 x.x.x.y	x.x.x.x	KRB5	406	TGS-REQ
    •	SNameString: DNS
    •	SNameString: dc1.anf.local
    
    1143 x.x.x.x	x.x.x.y	KRB5	1824	TGS-REP
    
    ``` 

3. The ticket is then used in a DNS query for a transaction key (TKEY) from Azure NetApp Files to the DNS server, which is passed using [GSS-TSIG (transaction signature)](/openspecs/windows_protocols/ms-gssa/c0c6ffdd-a094-40b1-bbb9-bc4e5a58804f) to authenticate.

    ```
        1152 x.x.x.y	x.x.x.x	DNS	191	Standard query 0x147c TKEY 1492998148.sig-dc1.anf.local TKEY
    •	Name: 1492998148.sig-dc1.anf.local
    •	Type: TKEY (249) (Transaction Key)
    •	Algorithm name: gss-tsig
    
    1154 x.x.x.x	x.x.x.y	DNS	481	Standard query response 0x147c TKEY 1492998148.sig-dc1.anf.local TKEY TSIG
    
    ```

4. Once successfully authenticated, a secure dynamic DNS update is sent using the TKEY to create the PTR is sent using GSS-TSIG. If the record doesn't already exist, it gets created. 

    ```
    1155 x.x.x.y	x.x.x.x	DNS	240	Dynamic update 0xf408 SOA x.x.x.in-addr.arpa PTR ANF1234.anf.local TSIG
    •	Zone
    o	x.x.x.in-addr.arpa: type SOA, class IN
    o	y.x.x.x.in-addr.arpa: type PTR, class IN, ANF1234.anf.local
    •	Type: PTR (12) (domain name PoinTeR)
    o	Additional records
    o	1492998148.sig-dc1.anf.local: type TSIG, class ANY
    
    1156 x.x.x.x	x.x.x.y	DNS	240	Dynamic update response 0xf408 SOA x.x.x.in-addr.arpa PTR ANF1234.anf.local TSIG
    •	Updates
    o	y.x.x.x.in-addr.arpa: type PTR, class IN, ANF1234.anf.local
    o	Type: PTR (12) (domain name PoinTeR)
    ```

5. A DNS SOA query is sent for the fully qualified domain name (FQDN) of the Azure NetApp Files volume and responded to.

    ```
    1162 x.x.x.y	x.x.x.x	DNS	81	Standard query 0xe872 SOA ANF1234.anf.local

    1163 x.x.x.x	x.x.x.y	DNS	214	Standard query response 0xe872 No such name SOA ANF1234.anf.local SOA dc1.anf.local A x.x.x.x AAAA aaaa:bbbb:cccc:d:eeee:ffff:0000:1111 AAAA aaaa:bbbb:cccc:d:eeee:ffff:0000:1111
    ``` 

6. A new TKEY ID is exchanged between the DNS server and Azure NetApp Files.

    ```
    1165 x.x.x.y	x.x.x.x	DNS	191	Standard query 0x020e TKEY 1260534462.sig-dc1.anf.local TKEY

    1167 x.x.x.x	x.x.x.y	DNS	481	Standard query response 0x020e TKEY 1260534462.sig-dc1.anf.local TKEY TSIG
    ```
    
7. A secure dynamic DNS update is sent using the TKEY to create the A/AAAA record for the FQDN. If the record already exists with the same IP address, no changes are made.

    ```
        1168 x.x.x.y	x.x.x.x	DNS	216	Dynamic update 0x014a SOA anf.local A x.x.x.y TSIG
    •	Zone
    o	anf.local: type SOA, class IN
    •	Updates
    o	ANF1234.anf.local: type A, class IN, addr x.x.x.y
    o	Type: A (1) (Host Address)
    o	Address: x.x.x.y
    •	Additional records
    o	1260534462.sig-dc1.anf.local: type TSIG, class ANY
    
    1170 x.x.x.x	x.x.x.y	DNS	216	Dynamic update response 0x014a SOA anf.local A x.x.x.y TSIG
    •	Updates
    o	ANF1234.anf.local: type A, class IN, addr x.x.x.y
    o	Type: A (1) (Host Address)
    ```
</details>


## DNS caching 

To reduce load on DNS servers, DNS clients make use of caching concepts to store previous queries in memory so that repeat requests for a hostname, IP or service are kept locally for the period of time defined by the DNS record’s TTL.

Azure NetApp Files makes use of DNS caches like any other standard DNS client. When the service requests a DNS record, that record has a TTL defined. By default, Active Directory DNS entries have a TTL of 600 seconds (10 minutes) unless specified otherwise. If a DNS record is updated and lives in the Azure NetApp Files cache and the TTL is 10 minutes, then the new record doesn't update in Azure NetApp Files until the cache is purged after the time-out value. There's currently no way to manually purge this cache. If a lower TTL is desired, make the change from the DNS server.

When using external DNS servers (such as BIND), the default time-out values can differ. If undefined, a BIND DNS record's TTL is 604,800 seconds (seven days), too long for effective DNS caching. As such, when creating DNS records manually, it is important to manually set the TTL for the record to a reasonable value. Using the Microsoft default of 10 minutes is recommended for a blend of performance and reliability for DNS lookups.

You can manually query a DNS record's TTL using `nslookup` or `dig` commands. For examples, see [Using `nslookup` and `dig` for DNS queries](#using-nslookup-and-dig-for-dns-queries).

## DNS record pruning/scavenging

Most DNS servers provide methods to [prune and scavenge expired records](/troubleshoot/windows-server/networking/dns-scavenging-setup). Pruning helps prevent stale records from cluttering DNS servers and creating scenarios where duplicate A/AAAA and/or PTR records exist, which can create unpredictable outcomes for Azure NetApp Files volumes.

If multiple PTR records for the same IP address point to different hostnames, Kerberos requests may fail because the incorrect SPN is being retrieved during DNS lookups. DNS doesn't discern which PTR record belongs to which hostname; instead, reverse lookups perform a round-robin search through each A/AAAA record for each new lookup. 

**For example:**

```
C:\> nslookup x.x.x.x
Server:  contoso.com
Address:  x.x.x.x

Name:    ANF-1234.contoso.com
Address:  x.x.x.x

C:\> nslookup x.x.x.x
Server:  contoso.com
Address:  x.x.x.x

Name:    ANF-5678.contoso.com
Address:  x.x.x.x
```

## DNS aliases and Canonical Name (CNAME) records

Azure NetApp Files creates a DNS hostname for a volume that has been configured for a protocol that requires DNS for proper functionality, such as SMB, dual protocol or NFSv4.1 with Kerberos. The name created uses the format of the SMB server (computer account) as a prefix when creating the Active Directory connection for the NetApp account; extra alphanumeric characters are added so that multiple volume entries in the same NetApp account have unique names. In most cases, multiple volumes that require hostnames and exist in the same NetApp account attempt to use the same hostnames/IP addresses. For example, if the SMB server name is SMB-West.contoso.com, then hostname entries follow the format of SMB-West-XXXX.contoso.com.

In some cases, the name used by Azure NetApp Files might not be user-friendly enough to pass on to end users, or administrators may want to keep more familiar DNS names used when data has migrated from on-premises storage to Azure NetApp Files (i.e., if the original DNS name was datalake.contoso.com, end users may want to continue using that name).

Azure NetApp Files doesn't natively allow for the specification of DNS hostnames used. If you require an alternate DNS name with the same functionality, you should use a [DNS alias/canonical name (CNAME)](/microsoft-365/admin/dns/create-dns-records-using-windows-based-dns).

Using a CNAME record (rather than an additional A/AAAA record) that points to the Azure NetApp Files volume’s A/AAAA record leverages the same SPN as the SMB server to enable Kerberos access for both the A/AAAA record and CNAME. Consider the example of an A/AAAA record of SMB-West-XXXX.contoso.com. The CNAME record of datalake.contoso.com is configured to point back to A/AAAA record of SMB-West-XXXX.contoso.com. SMB or NFS Kerberos requests made to datalake.contoso.com use the Kerberos SPN for SMB-West-XXXX to provide access to the volume.

## Using nslookup and dig for DNS queries

DNS servers can be manually queried using DNS tools such as [`nslookup` (Windows and Linux clients)](/windows-server/administration/windows-commands/nslookup) and [`dig` (Linux clients)](https://linux.die.net/man/1/dig). Using these tools is helpful in scenarios including trying to verify functionality of services, testing hostname/IP resolution, searching for existing/stale DNS records, checking server configuration, verifying TTL. You can also use the [Azure connection troubleshooter](/azure/network-watcher/connection-troubleshoot-overview) for additional problem solving.

The `nslookup` and `dig` commands can be run from a remote connection to the VM (such as from Bastion) or directly to the VM via the [run command option](/azure/virtual-machines/run-command-overview) on the VM itself.

### nslookup with Windows 

You can run `nslookup` to gather basic IP address information without any options:

```
C:\>nslookup anf.local
Server:  dns.anf.local
Address:  x.x.x.a

Name:    anf.local
Addresses:  x.x.x.x
            x.x.x.y
```

To query only TTL information for the record, use the `-query=hinfo` command option.

```
C:\>nslookup -query=hinfo anf.local
Server:  dns.anf.local
Address:  x.x.x.a

anf.local
        primary name server = dns.anf.local
        responsible mail addr = root.dns.anf.local
        serial  = 7
        refresh = 604800 (7 days)
        retry   = 86400 (1 day)
        expire  = 2419200 (28 days)
        default TTL = 604800 (7 days)
```

The `-debug` option can also be used to gather more detailed information about the DNS record.

```
C:\>nslookup -debug anf.local
------------
Got answer:
    HEADER:
        opcode = QUERY, id = 1, rcode = NOERROR
        header flags:  response, auth. answer, want recursion, recursion avail.
        questions = 1,  answers = 1,  authority records = 0,  additional = 0

    QUESTIONS:
        x.x.x.x.in-addr.arpa, type = PTR, class = IN
    ANSWERS:
    ->  x.x.x.x.in-addr.arpa
        name = dns.anf.local
        ttl = 604800 (7 days)

------------
Server:  dns.anf.local
Address:  x.x.x.a

------------
Got answer:
    HEADER:
        opcode = QUERY, id = 2, rcode = NXDOMAIN
        header flags:  response, auth. answer, want recursion, recursion avail.
        questions = 1,  answers = 0,  authority records = 1,  additional = 0

    QUESTIONS:
        anf.local.ANF.LOCAL, type = A, class = IN
    AUTHORITY RECORDS:
    ->  anf.local
        ttl = 604800 (7 days)
        primary name server = dns.anf.local
        responsible mail addr = root.dns.anf.local
        serial  = 7
        refresh = 604800 (7 days)
        retry   = 86400 (1 day)
        expire  = 2419200 (28 days)
        default TTL = 604800 (7 days)
```

### dig with Linux

```
# dig anf.local

; <<>> DiG 9.11.4-P2-RedHat-9.11.4-16.P2.el7_8.6 <<>> anf.local
;; global options: +cmd
;; Got answer:
;; WARNING: .local is reserved for Multicast DNS
;; You are currently testing what happens when an mDNS query is leaked to DNS
;; ->>HEADER<<- opcode: QUERY, status: NOERROR, id: 12196
;; flags: qr aa rd ra; QUERY: 1, ANSWER: 2, AUTHORITY: 0, ADDITIONAL: 1

;; OPT PSEUDOSECTION:
; EDNS: version: 0, flags:; udp: 1232
;; QUESTION SECTION:
;anf.local.                     IN      A

;; ANSWER SECTION:
anf.local.              604800  IN      A       x.x.x.x
anf.local.              604800  IN      A       x.x.x.y

;; Query time: 0 msec
;; SERVER: 10.193.67.250#53(10.193.67.250)
;; WHEN: Thu Aug 29 15:27:47 EDT 2024
;; MSG SIZE  rcvd: 70
```

## DNS best practices in Azure NetApp Files

Ensure you meet the following DNS configuration requirements:

- Specify more than one DNS server in the DNS configuration for redundancy.
- For best results, use DNS integrated with and/or installed with Active Directory.
- If you're using standalone DNS servers:
    - Ensure the DNS servers have network connectivity to the Azure NetApp Files delegated subnet hosting the Azure NetApp Files volumes.
    - Ensure the network ports UDP 53 and TCP 53 aren't blocked by firewalls or network security groups.
- Ensure [the SRV records registered by the AD DS Net Logon service](https://social.technet.microsoft.com/wiki/contents/articles/7608.srv-records-registered-by-net-logon.aspx) have been created on the DNS servers, as well as the service records listed in [Types of DNS records in Azure NetApp Files](#types-of-dns-records-in-azure-netapp-files).
- Ensure the PTR records for the AD DS domain controllers used by Azure NetApp Files have been created on the DNS servers in the same domain as your Azure NetApp Files configuration.
- Azure NetApp Files supports standard and secure dynamic DNS updates. If you require secure dynamic DNS updates, ensure that secure updates are configured on the DNS servers.
- Ensure a reverse lookup zone has been created for the Azure NetApp Files subnet to allow dynamic DNS to create PTR records in addition to A/AAAA record.
- If a DNS alias is required, use a CNAME record. Point the CNAME record to the A/AAAA records for Azure NetApp Files.
- If you're not using dynamic DNS updates, you must manually create an A record and a PTR record for the AD DS computer accounts created in the AD DS Organizational Unit (specified in the Azure NetApp Files AD connection) to support Azure NetApp Files LDAP Signing, LDAP over TLS, SMB, dual-protocol, or Kerberos NFSv4.1 volumes.
- For complex or large AD DS topologies, [DNS Policies or DNS subnet prioritization might be required to support LDAP enabled NFS volumes](understand-guidelines-active-directory-domain-service-site.md#ad-ds-ldap-discover).
- If DNS scavenging is enabled (where stale DNS entries are automatically pruned based on timestamp/age) and dynamic DNS was used to create the DNS records for the Azure NetApp Files volume, the scavenger process might inadvertently prune the records for the volume. This pruning can lead to a service outage for name-based queries. Until this issue is resolved, manually create DNS A/AAAA and PTR entries for the Azure NetApp Files volume if DNS scavenging is enabled.

## Next steps

- [Understand the use of LDAP with Azure NetApp Files](lightweight-directory-access-protocol.md)
- [Understand guidelines for Active Directory Domain Services site design and planning for Azure NetApp Files](understand-guidelines-active-directory-domain-service-site.md)
- [Understand Kerberos in Azure NetApp Files](kerberos.md)
