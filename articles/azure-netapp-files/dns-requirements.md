---
title: Understand DNS requirements in Azure NetApp Files 
description: The Domain Name Systems (DNS) service is a critical component of data access in Azure NetApp Files.
services: azure-netapp-files
author: b-hchen
ms.service: azure-netapp-files
ms.topic: how-to
ms.date: 05/04/2023
ms.author: anfdocs
---
# Understand DNS requirements in Azure NetApp Files 

The Domain Name Systems (DNS) service is a critical component of data access in Azure NetApp Files when using file protocols that rely on Kerberos for authentication (including SMB and NFSv4.1). Not only does a hostname simplify access to a volume, it protects against scenarios when an IP address changes; instead of informing users of a new IP address, they can simply continue using the hostname. 

By default Kerberos authentication leverages name-to-IP-address resolution to formulate the Service Principal Name (SPN) used to retrieve the Kerberos ticket. For example, when an SMB share is accessed with a Universal Naming Convention path (UNC) such as \\SMB.CONTOSO.COM, a DNS request is issued for SMB.CONTOSO.COM, and the IP address of the Azure NetApp Files volume is retrieved. If there's no DNS entry present (or is a different name than what is being requested – such as with aliases/CNAMEs), then a proper SPN isn't able to be retrieved and the Kerberos request fails. As a result, access to the volume could be disallowed if the fallback authentication method (such as New Technology LAN Manager [NTLM]) is disabled. 

NFSv4.1 Kerberos operates in a similar manner for SPN retrieval, where DNS lookups are integral to the authentication process and can also be used for Kerberos realm discovery. 

Azure NetApp Files supports the use of Active Directory integrated DNS or standalone DNS servers and requires reliable access to Domain Name System (DNS) services and up-to-date DNS records. Poor network connectivity between Azure NetApp Files and DNS servers can cause client access interruptions or client timeouts. Incomplete or incorrect DNS records for AD DS or Azure NetApp Files can cause client access interruptions or client timeouts. 

## Using IP addresses for access with Kerberos 

If an IP address is used in an access request to an Azure NetApp Files volume, then a Kerberos request will operate differently depending on the protocol in use. 

When using SMB, a request for a UNC using \\x.x.x.x by default attempts to use NTLM for authentication. In environments where NTLM is disallowed for security reasons, an SMB request using an IP address isn't able to use Kerberos or NTLM for authentication by default. As a result, access to the Azure NetApp Files volume is denied. In later Windows releases (beginning with Windows 10 version 1507 and Windows Server 2016), [Kerberos clients can be configured to support IPv4 and IPv6 hostnames in SPNs](/windows-server/security/kerberos/configuring-kerberos-over-ip) for SMB communication. 

When using NFSv4.1, a mount request to an IP address using one of the `sec=[krb5/krb5i/krb5p]` options uses reverse-DNS lookups via a pointer record (PTR) to resolve an IP address to a hostname, which is then used to formulate the SPN for ticket retrieval. If you use NFSv4.1 with Kerberos, you should have an A/AAAA and PTR for the Azure NetApp Files volume to cover both hostname and IP address access to mounts. 

## DNS entries in Azure NetApp Files 

In Azure NetApp Files, DNS entries are created by: 

<!-- "ate" -->
- **An associated pointer (PTR) record” box is checked**: If reverse lookup zones for the subnet exist, then A/AAAA records automatically create PTR records without administrator intervention.
- **The “Delete this record when it becomes stale” box is checked.** When the DNS record becomes “stale,” DNS deletes the record, provided scavenging for DNS has been enabled.
- **The DNS record’s “time to live (TTL)” is set to 1 day (24 hours)**. The TTL setting can be modified by the DNS administrator as needed. The TTL on a DNS record determines the length of time a DNS entry exists in a client’s DNS cache.

>[!NOTE]
>To view timestamps of when a DNS record was created in Windows Active Directory DNS, navigate to the **View** menu of the DNS Manager then select **Advanced**. 

Azure NetApp Files volumes support dynamic DNS updates if the DNS server supports dynamic DNS. With dynamic DNS, volumes created with hostnames automatically notify the DNS server to create an A/AAAA record. If a reverse lookup zone exists, then DNS also creates a PTR record. If the reverse lookup zone doesn't exist, then a PTR record isn't created automatically, meaning you need to create it manually. Hostnames (rather than IP addresses) will be used for volume mount paths in specific configurations, which all require DNS for proper functionality:
•	SMB volumes
•	NFSv4.1 Kerberos
•	Dual protocol volumes
An IP address will be used when an Azure NetApp File volume does not require DNS, such as NFSv3 or NFSv4.1 without Kerberos. In those cases, if a DNS entry is desired, then it should be manually created.
If a DNS entry created by dynamic DNS is deleted on the DNS server, it will be re-created within 24 hours by a new dynamic DNS update from Azure NetApp Files.
When Azure NetApp Files creates a DNS A/AAAA record via dynamic DNS, the following configurations are used:


<!-- 
### DNS requirements 

Azure NetApp Files SMB, dual-protocol, and Kerberos NFSv4.1 volumes require reliable access to Domain Name System (DNS) services and up-to-date DNS records. Poor network connectivity between Azure NetApp Files and DNS servers can cause client access interruptions or client timeouts. Incomplete or incorrect DNS records for AD DS or Azure NetApp Files can cause client access interruptions or client timeouts.

Azure NetApp Files supports the use of [Active Directory integrated DNS](/windows-server/identity/ad-ds/plan/active-directory-integrated-dns-zones) or standalone DNS servers.    

Ensure that you meet the following requirements about the DNS configurations:
* If you're using standalone DNS servers: 
    * Ensure that DNS servers have network connectivity to the Azure NetApp Files delegated subnet hosting the Azure NetApp Files volumes.
    * Ensure that network ports UDP 53 and TCP 53 are not blocked by firewalls or NSGs.
* Ensure that [the SRV records registered by the AD DS Net Logon service](https://social.technet.microsoft.com/wiki/contents/articles/7608.srv-records-registered-by-net-logon.aspx) have been created on the DNS servers.
* Ensure the PTR records for the AD DS domain controllers used by Azure NetApp Files have been created on the DNS servers in the same domain as your Azure NetApp Files configuration.
* Azure NetApp Files doesn’t automatically delete pointer records (PTR) associated with DNS entries when a volume is deleted. PTR records are used for reverse DNS lookups, which map IP addresses to hostnames. They are typically managed by the DNS server's administrator.
When you create a volume in Azure NetApp Files, you can associate it with a DNS name. However, the management of DNS records, including PTR records, is outside the scope of Azure NetApp Files. Azure NetApp Files provides the option to associate a volume with a DNS name for easier access, but it doesn't manage the DNS records associated with that name. 
If you delete a volume in Azure NetApp Files, the associated DNS records (such as the A records for forwarding DNS lookups) need to be managed and deleted from the DNS server or the DNS service you are using.
* Azure NetApp Files supports standard and secure dynamic DNS updates. If you require secure dynamic DNS updates, ensure that secure updates are configured on the DNS servers.
* If dynamic DNS updates are not used, you need to manually create an A record and a PTR record for the AD DS computer account(s) created in the AD DS **Organizational Unit** (specified in the Azure NetApp Files AD connection) to support Azure NetApp Files LDAP Signing, LDAP over TLS, SMB, dual-protocol, or Kerberos NFSv4.1 volumes.
* For complex or large AD DS topologies, [DNS Policies or DNS subnet prioritization may be required to support LDAP enabled NFS volumes](#ad-ds-ldap-discover).  
* If DNS scavenging is enabled (where stale DNS entries are automatically pruned based on timestamp/age) and dynamic DNS was used to create the DNS records for the Azure NetApp Files volume, the scavenger process might inadvertently prune the records for the volume. This pruning can lead to a service outage for name-based queries. Until this issue is resolved, manually create DNS A/AAAA and PTR entries for the Azure NetApp Files volume if DNS scavenging is enabled.

-->