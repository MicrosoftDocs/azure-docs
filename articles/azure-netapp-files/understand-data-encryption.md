---
title: Understand data encryption in Azure NetApp Files
description: Learn about data encryption at-rest and in-transit in Azure NetApp Files. 
services: azure-netapp-files
author: b-ahibbard
ms.service: azure-netapp-files
ms.topic: conceptual
ms.date: 02/02/2024
ms.author: anfdocs
---
# Understand data encryption in Azure NetApp Files 

Azure NetApp Files encrypts data through two different methods:

* **Encryption at-rest**: Data is encrypted in-place using FIPS 140-2 compliant standards.
* **Encryption in-transit**: Data is encrypted in transit--or over the wire--as it's transferred between client and server. 

## Understand encryption at-rest 

Data at-rest in Azure NetApp Files can be encrypted in two ways:
* Single encryption uses software-based encryption for Azure NetApp Files volumes.
* [Double encryption](double-encryption-at-rest.md) adds hardware-level encryption at the physical storage device layer. 

Azure NetApp Files uses standard CryptoMod to generate AES-256 encryption keys. [CryptoMod](https://public.cyber.mil/pki-pke/cryptographic-modernization/) is listed on the CMVP FIPS 140-2 validated modules list; for more information, see [FIPS 140-2 Cert #4144](https://csrc.nist.gov/projects/cryptographic-module-validation-program/certificate/4144). Encryption keys are associated with the volumes and can be Microsoft [platform-managed keys](faq-security.md#how-are-encryption-keys-managed) or [customer-managed keys](configure-customer-managed-keys.md). 

## Understand data in-transit encryption  

In addition to securing data at-rest, Azure NetApp Files can secure data when it's in-transit between endpoints. The encryption method used depends on the protocol or feature. DNS isn't encrypted in-transit in Azure NetApp files. Continue reading to learn about SMB and NFS encryption, LDAP, and data replication in Azure NetApp Files. 

### SMB encryption 

Windows SMB clients using the SMB3.x protocol version natively support [SMB encryption](/windows-server/storage/file-server/smb-security). [SMB encryption is conducted end-to-end](network-attached-storage-permissions.md) and encrypts the entirety of the SMB conversation using AES-256-GCM/AES-128-GCM and AES-256-CCM/AES-128-CCM cryptographic suites. 

SMB encryption isn't required for Azure NetApp Files volumes, but can be used for extra security. SMB encryption does add a performance overhead. To learn more about performance considerations with SMB encryption, see [SMB performance best practices for Azure NetApp Files](azure-netapp-files-smb-performance.md).

#### Requiring encryption for SMB connections 

Azure NetApp Files provides an option to [enforce encryption on all SMB connections](create-active-directory-connections.md). Enforcing encryption disallows unencrypted SMB communication and uses SMB3 and later for SMB connections. Encryption is performed using AES encryption and encrypts all SMB packets. For this feature to work properly, SMB clients must support SMB encryption. If the SMB client doesn't support encryption and SMB3, then SMB connections are disallowed. If this option is enabled, all shares that have the same IP address require encryption, thus overriding the SMB share property setting for encryption. 

#### SMB share-level encryption 

Alternatively, encryption can be set at the level of [individual share of an Azure NetApp Files volume](azure-netapp-files-create-volumes-smb.md#smb3-encryption). 

#### UNC hardening 

In 2015, Microsoft introduced UNC hardening ([MS15-011](https://technet.microsoft.com/library/security/ms15-011) and [MS15-014](https://technet.microsoft.com/library/security/ms15-014)) to address remote network path vulnerabilities that could allow remote code execution across SMB shares. For more information, see [MS15-011 & MS15-014: Hardening Group Policy](https://msrc.microsoft.com/blog/2015/02/ms15-011-ms15-014-hardening-group-policy/).

UNC hardening provides three options for securing UNC paths: 

* `RequireMutualAuthentication` – Identity authentication required/not required to block spoofing attacks. 
* `RequireIntegrity` – Integrity checking required/not required to block tampering attacks. 
* `RequirePrivacy` – Privacy (total encryption of SMB packets) enabled/disabled to prevent traffic sniffing. 

Azure NetApp Files supports all three forms of UNC hardening. 

### NFS Kerberos 

Azure NetApp Files also provides [the ability to encrypt NFSv4.1 conversations via Kerberos authentication](configure-kerberos-encryption.md) using AES-256-GCM/AES-128-GCM and AES-256-CCM/AES-128-CCM cryptographic suites.  

With NFS Kerberos, Azure NetApp Files supports three different security flavors: 

* Kerberos 5 (`krb5`) – Initial authentication only; requires a Kerberos ticket exchange/user sign-in to access the NFS export. NFS packets are not encrypted. 
* Kerberos 5i (`krb5i`) – Initial authentication and integrity checking; requires a Kerberos ticket exchange/user sign-in to access the NFS export and adds integrity checks to each NFS packet to prevent man-in-the-middle attacks (MITM). 
* Kerberos 5p (`krb5p`) – Initial authentication, integrity checking and privacy; requires a Kerberos ticket exchange/user sign-in to access the NFS export, performs integrity checks and applies a GSS wrapper to each NFS packet to encrypt its contents. 

Each Kerberos encryption level has an effect on performance. As the encryption types and security flavors incorporate more secure methods, the performance effect increases. For instance, `krb5` performs better than `krb5i`, krb5i performs better than `krb5p`, AES-128 perform better than AES-256, and so on. For more information about the performance effect of NFS Kerberos in Azure NetApp Files, see [Performance impact of Kerberos on Azure NetApp Files NFSv4.1 volumes](performance-impact-kerberos.md). 

>[!NOTE]
>NFS Kerberos is only supported with NFSv4.1 in Azure NetApp Files. 

In the following image, Kerberos 5 (`krb5`) is used; only the initial authentication request (the sign in/ticket acquisition) is encrypted. All other NFS traffic arrives in plain text. 

:::image type="content" source="./media/understand-data-encryption/kerberos-5-ticket-screenshot.png" alt-text="Screenshot of NFS packet with krb5." lightbox="./media/understand-data-encryption/kerberos-5-ticket-screenshot.png":::

When using Kerberos 5i (`krb5i`; integrity checking), a trace show that the NFS packets aren't encrypted, but there's a GSS/Kerberos wrapper added to the packet that requires the client and server ensure the integrity of the data transferred using a checksum.

:::image type="content" source="./media/understand-data-encryption/kerberos-5i-packet.png" alt-text="Screenshot of NFS packet with krb5i enabled." lightbox="./media/understand-data-encryption/kerberos-5i-packet.png":::

Kerberos 5p (privacy; `krb5p`) provides end-to-end encryption of all NFS traffic as shown in the trace image using a GSS/Kerberos wrapper. This method creates the most performance overhead due to the need to process every NFS packet’s encryption.

:::image type="content" source="./media/understand-data-encryption/kerberos-5p-packet.png" alt-text="Screenshot of NFS packet with krb5p enabled." lightbox="./media/understand-data-encryption/kerberos-5p-packet.png":::

## Data replication

In Azure NetApp Files, you can replicate entire volumes [across zones or regions in Azure to provide data protection](data-protection-disaster-recovery-options.md). Since the replication traffic resides in the Azure cloud, the transfers take place in the secure Azure network infrastructure, which is limited in access to prevent packet sniffing and man-in-the-middle attacks (eavesdropping or impersonating in-between communication endpoints). In addition, the replication traffic is encrypted using FIPS 140-2 compliant TLS 1.2 standards. For details, see [Security FAQs](faq-security.md#is-azure-netapp-files-cross-region-and-cross-zone-replication-traffic-encrypted).

## LDAP encryption

Normally, LDAP search and bind traffic passes over the wire in plain text, meaning anyone with access to sniff network packets can gain information from the LDAP server such as usernames, numeric IDs, group memberships, etc. This information can then be used to spoof users, send emails for phishing attacks, etc.

To protect LDAP communications from being intercepted and read, LDAP traffic can leverage over-the-wire encryption leveraging AES and TLS 1.2 via LDAP signing and LDAP over TLS, respectively. For details on configuring these options, see [Create and manage Active Directory connections](create-active-directory-connections.md#ldap-signing).
 
### LDAP signing

LDAP signing is specific to connections on Microsoft Active Directory servers that are hosting UNIX identities for users and groups. This functionality enables integrity verification for Simple Authentication and Security Layer (SASL) LDAP binds to AD servers hosting LDAP connections. Signing does not require configuration of security certificates because it uses GSS-API communication with Active Directory’s Kerberos Key Distribution Center (KDC) services. LDAP signing only checks the integrity of an LDAP packet; it does not encrypt the payload of the packet.

:::image type="content" source="./media/understand-data-encryption/packet-ldap-signing.png" alt-text="Screenshot of NFS packet with LDAP signing." lightbox="./media/understand-data-encryption/packet-ldap-signing.png":::

LDAP signing can also be [configured from the Windows server side](/troubleshoot/windows-server/identity/enable-ldap-signing-in-windows-server) via Group Policy to either be [opportunistic with LDAP signing (none – support if requested by client) or to enforce LDAP signing (require)](/windows/security/threat-protection/security-policy-settings/domain-controller-ldap-server-signing-requirements). LDAP signing can add some performance overhead to LDAP traffic that usually isn't noticeable to end users.

Windows Active Directory also enables you to use LDAP signing and sealing (end-to-end encryption of LDAP packets). Azure NetApp Files doesn't support this feature. 

### LDAP channel binding

Because of a security vulnerability discovered in Windows Active Directory domain controllers, a default setting was changed for Windows servers. For details, see [Microsoft Security Advisory ADV190023](https://portal.msrc.microsoft.com/security-guidance/advisory/ADV190023).

Essentially, Microsoft recommends that administrators enable LDAP signing along with channel binding. If the LDAP client supports channel binding tokens and LDAP signing, channel binding and signing are required, and registry options are set by the new Microsoft patch.

Azure NetApp Files, by default, supports LDAP channel binding opportunistically, meaning LDAP channel binding is used when the client supports it. If it doesn't support/send channel binding, communication is still allowed, and channel binding isn't enforced.

### LDAP over SSL (port 636)

LDAP traffic in Azure NetApp Files passes over port 389 in all cases. This port cannot be modified. LDAP over SSL (LDAPS) isn't supported and is considered legacy by most LDAP server vendors ([RFC 1777](https://www.ietf.org/rfc/rfc1777.txt) was published in 1995). If you want to use LDAP encryption with Azure NetApp Files, use LDAP over TLS. 

### LDAP over StartTLS

LDAP over StartTLS was introduced with [RFC 2830](https://www.ietf.org/rfc/rfc2830.txt) in 2000 and was combined into the LDAPv3 standard with [RFC 4511](https://www.ietf.org/rfc/rfc2830.txt) in 2006. After StartTLS was made a standard, LDAP vendors began to refer to LDAPS as deprecated.

LDAP over StartTLS uses port 389 for the LDAP connection. After the initial LDAP connection has been made, a StartTLS OID is exchanged and certificates are compared; then all LDAP traffic is encrypted by using TLS. The packet capture shown below shows the LDAP bind, StartTLS handshake and subsequent TLS-encrypted LDAP traffic.

:::image type="content" source="./media/understand-data-encryption/packet-starttls.png" alt-text="Screenshot of packet capture with StartTLS." lightbox="./media/understand-data-encryption/packet-starttls.png":::

There are two main differences between LDAPS and StartTLS:

* StartTLS is part of the LDAP standard; LDAPS isn't. As a result, LDAP library support on the LDAP servers or clients can vary, and functionality might or might not work in all cases.
* If encryption fails, StartTLS allows the configuration to fall back to regular LDAP. LDAPS does not. As a result, StartTLS offers some flexibility and resiliency, but it also presents security risks if it's misconfigured.

#### Security considerations with LDAP over StartTLS

StartTLS enables administrators to fall back to regular LDAP traffic if they want. For security purposes, most LDAP administrators don't allow it. The following recommendations for StartTLS can help secure LDAP communication:

* Ensure that StartTLS is enabled and that certificates are configured.
* For internal environments, you can use self-signed certificates, but for external LDAP, use a certificate authority. For more information about certificates, see the [Difference Between Self Signed SSL & Certificate Authority](https://social.technet.microsoft.com/wiki/contents/articles/15189.difference-between-self-signed-ssl-certificate-authority.aspx).
* Prevent LDAP queries and binds that do not use StartTLS. By default, Active Directory disables anonymous binds. 

## Active Directory security connection 

Active Directory connections with Azure NetApp Files volumes can be configured to try the strongest available Kerberos encryption type first: AES-256. When AES encryption is enabled, domain controller communications (such as scheduled SMB server password resets) use the highest available encryption type supported on the domain controllers. Azure NetApp Files supports the following encryption types for domain controller communications, in order of attempted authentication: AES-256, AES-128, RC4-HMAC, DES

>[!NOTE]
>It's not possible to disable weaker authentication types in Azure NetApp Files (such as RC4-HMAC and DES). Instead, if desired, these should be disabled from the domain controller so that authentication requests do not attempt to use them. If RC4-HMAC is disabled on the domain controllers, then AES encryption must be enabled in Azure NetApp Files for proper functionality.

## Next steps 
* [Azure NetApp Files double encryption at rest](double-encryption-at-rest.md) 
* [Configure customer-managed keys for Azure NetApp Files volume encryption](configure-customer-managed-keys.md)
* [Understand data protection and disaster recovery options in Azure NetApp Files](data-protection-disaster-recovery-options.md)
* [Create and manage Active Directory connections](create-active-directory-connections.md)
