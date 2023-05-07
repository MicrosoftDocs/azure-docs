---
title: 'Hybrid Identity required ports and protocols - Azure'
description: This page is a technical reference page for ports that are required to be open for Azure AD Connect
services: active-directory
documentationcenter: ''
author: billmath
manager: amycolannino
ms.assetid: de97b225-ae06-4afc-b2ef-a72a3643255b
ms.service: active-directory
ms.workload: identity
ms.tgt_pltfrm: na
ms.topic: reference
ms.date: 01/19/2023
ms.subservice: hybrid
ms.author: billmath

ms.collection: M365-identity-device-management
---
# Hybrid Identity Required Ports and Protocols
The following document is a technical reference on the required ports and protocols for implementing a hybrid identity solution. Use the following illustration and refer to the corresponding table.

![What is Azure AD Connect](./media/reference-connect-ports/required3.png)

## Table 1 - Azure AD Connect and On-premises AD
This table describes the ports and protocols that are required for communication between the Azure AD Connect server and on-premises AD.

| Protocol | Ports | Description |
| --- | --- | --- |
| DNS |53 (TCP/UDP) |DNS lookups on the destination forest. |
| Kerberos |88 (TCP/UDP) |Kerberos authentication to the AD forest. |
| MS-RPC |135 (TCP) |Used during the initial configuration of the Azure AD Connect wizard when it binds to the AD forest, and also during Password synchronization. |
| LDAP |389 (TCP/UDP) |Used for data import from AD. Data is encrypted with Kerberos Sign & Seal. |
| SMB | 445 (TCP) |Used by Seamless SSO to create a computer account in the AD forest and during password writeback. For more information, see [Change a user account's password](/openspecs/windows_protocols/ms-adod/d211aaba-d188-4836-8007-8c62f7c9402d). |
| LDAP/SSL |636 (TCP/UDP) |Used for data import from AD. The data transfer is signed and encrypted. Only used if you are using TLS. |
| RPC |49152- 65535 (Random high RPC Port) (TCP) |Used during the initial configuration of Azure AD Connect when it binds to the AD forests, and during Password synchronization. If the dynamic port has been changed, you need to open that port. See [KB929851](https://support.microsoft.com/kb/929851), [KB832017](https://support.microsoft.com/kb/832017), and [KB224196](https://support.microsoft.com/kb/224196) for more information. |
|WinRM  | 5985 (TCP) |Only used if you are installing AD FS with gMSA by Azure AD Connect Wizard|
|AD DS Web Services | 9389 (TCP) |Only used if you are installing AD FS with gMSA by Azure AD Connect Wizard |
| Global Catalog | 3268 (TCP) | Used by Seamless SSO to query the global catalog in the forest before creating a computer account in the domain. |

## Table 2 - Azure AD Connect and Azure AD
This table describes the ports and protocols that are required for communication between the Azure AD Connect server and Azure AD.

| Protocol | Ports | Description |
| --- | --- | --- |
| HTTP |80 (TCP) |Used to download CRLs (Certificate Revocation Lists) to verify TLS/SSL certificates. |
| HTTPS |443 (TCP) |Used to synchronize with Azure AD. |

For a list of URLs and IP addresses you need to open in your firewall, see [Office 365 URLs and IP address ranges](https://support.office.com/article/Office-365-URLs-and-IP-address-ranges-8548a211-3fe7-47cb-abb1-355ea5aa88a2) and [Troubleshooting Azure AD Connect connectivity](tshoot-connect-connectivity.md#connectivity-issues-in-the-installation-wizard).

## Table 3 - Azure AD Connect and AD FS Federation Servers/WAP
This table describes the ports and protocols that are required for communication between the Azure AD Connect server and AD FS Federation/WAP servers.  

| Protocol | Ports | Description |
| --- | --- | --- |
| HTTP |80 (TCP) |Used to download CRLs (Certificate Revocation Lists) to verify TLS/SSL certificates. |
| HTTPS |443 (TCP) |Used to synchronize with Azure AD. |
| WinRM |5985 |WinRM Listener |

## Table 4 - WAP and Federation Servers
This table describes the ports and protocols that are required for communication between the Federation servers and WAP servers.

| Protocol | Ports | Description |
| --- | --- | --- |
| HTTPS |443 (TCP) |Used for authentication. |

## Table 5 - WAP and Users
This table describes the ports and protocols that are required for communication between users and the WAP servers.

| Protocol | Ports | Description |
| --- | --- | --- |
| HTTPS |443 (TCP) |Used for device authentication. |
| TCP |49443 (TCP) |Used for certificate authentication. |

## Table 6a & 6b - Pass-through Authentication with Single Sign On (SSO) and Password Hash Sync with Single Sign On (SSO)
The following tables describes the ports and protocols that are required for communication between the Azure AD Connect and Azure AD.

### Table 6a - Pass-through Authentication with SSO
| Protocol | Ports | Description |
| --- | --- | --- |
| HTTP |80 (TCP)|Used to download CRLs (Certificate Revocation Lists) to verify TLS/SSL certificates. Also needed for the connector auto-update capability to function properly. |
| HTTPS |443 (TCP)|Used to enable and disable the feature, register connectors, download connector updates, and handle all user sign-in requests. |

In addition, Azure AD Connect needs to be able to make direct IP connections to the [Azure data center IP ranges](https://www.microsoft.com/download/details.aspx?id=41653).

### Table 6b - Password Hash Sync with SSO

| Protocol | Ports | Description |
| --- | --- | --- |
| HTTPS |443 (TCP)|Used to enable SSO registration (required only for the SSO registration process).

In addition, Azure AD Connect needs to be able to make direct IP connections to the [Azure data center IP ranges](https://www.microsoft.com/download/details.aspx?id=41653). Again, this is only required for the SSO registration process.

## Table 7a & 7b - Azure AD Connect Health agent for (AD FS/Sync) and Azure AD
The following tables describe the endpoints, ports, and protocols that are required for communication between Azure AD Connect Health agents and Azure AD

### Table 7a - Ports and Protocols for Azure AD Connect Health agent for (AD FS/Sync) and Azure AD
This table describes the following outbound ports and protocols that are required for communication between the Azure AD Connect Health agents and Azure AD.  

| Protocol | Ports | Description |
| --- | --- | --- |
| Azure Service Bus |5671 (TCP) | Used to send health information to Azure AD. (recommended but not required in latest versions)|
| HTTPS |443 (TCP) |Used to send health information to Azure AD. (failback)|

If 5671 is blocked, the agent falls back to 443, but using 5671 is recommended. This endpoint isn't required in the latest version of the agent.
The latest Azure AD Connect Health agent versions only require port 443.

### 7b - Endpoints for Azure AD Connect Health agent for (AD FS/Sync) and Azure AD
For a list of endpoints, see [the Requirements section for the Azure AD Connect Health agent](how-to-connect-health-agent-install.md#requirements).
