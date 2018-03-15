---

title: Azure Payment Processing Blueprint - Encryption requirements
description: PCI DSS Requirement 4
services: security
documentationcenter: na
author: simorjay
manager: mbaldwin
editor: tomsh

ms.assetid: 43f75ba9-cb4e-49ab-b3f4-09e48310bc18
ms.service: security
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: na
ms.date: 11/15/2017
ms.author: frasim

---

# Encryption requirements for PCI DSS-compliant environments 
## PCI DSS Requirement 4

**Encrypt transmission of cardholder data across open, public networks**

> [!NOTE]
> These requirements are defined by the [Payment Card Industry (PCI) Security Standards Council](https://www.pcisecuritystandards.org/pci_security/) as part of the [PCI Data Security Standard (DSS) Version 3.2](https://www.pcisecuritystandards.org/document_library?category=pcidss&document=pci_dss). Please refer to the PCI DSS for information on testing procedures and guidance for each requirement.

Sensitive information must be encrypted during transmission over networks that are easily accessed by malicious individuals. Misconfigured wireless networks and vulnerabilities in legacy encryption and authentication protocols continue to be targets of malicious individuals who exploit these vulnerabilities to gain privileged access to cardholder data environments.

## PCI DSS Requirement 4.1

**4.1** Use strong cryptography and security protocols (for example, TLS, IPSEC, SSH, etc.) to safeguard sensitive cardholder data during transmission over open, public networks, including the following:
- Only trusted keys and certificates are accepted.
- The protocol in use only supports secure versions or configurations.
- The encryption strength is appropriate for the encryption methodology in use. 

> [!NOTE]
> Where SSL/early TLS is used, the requirements in Appendix A2 must be completed.
>
> Examples of open, public networks include but are not limited to:
> - The Internet
> - Wireless technologies, including 802.11 and Bluetooth
> - Cellular technologies, for example, Global System for Mobile communications (GSM), Code division multiple access (CDMA)
> - General Packet Radio Service (GPRS)
> - Satellite communications


**Responsibilities:&nbsp;&nbsp;`Customer Only`**

|||
|---|---|
| **Provider<br />(Microsoft&nbsp;Azure)** | Not applicable. |
| **Customer<br />(PCI&#8209;DSS&nbsp;Blueprint)** | The Contoso Webstore is a PaaS solution that implements strong cryptography for the deployment as follows:<br /><br />To meet encrypted data-at-rest requirements, [Azure Storage](https://azure.microsoft.com/services/storage/) uses the following:<br /><br /><ul><li>[Azure Storage Service Encryption (SSE) for Data at Rest](/azure/storage/storage-service-encryption)</li><li>SQL Database: A PaaS SQL Database instance is used to showcase database security measures. For more information, see [PCI Guidance - Azure SQL Database](payment-processing-blueprint.md#azure-sql-database).</li><li>[Azure Disk Encryption (Bitlocker)](/azure/security/azure-security-disk-encryption)</li></ul>Using Azure Key Vault aligns with Azure Government, PCI DSS, and HIPAA requirements.|



### PCI DSS Requirement 4.1.1

**4.1.1** Ensure wireless networks transmitting cardholder data, or connected to the cardholder data environment, use industry best practices (for example, IEEE 802.11i) to implement strong encryption for authentication and transmission.

**Responsibilities:&nbsp;&nbsp;`Customer Only`**

|||
|---|---|
| **Provider<br />(Microsoft&nbsp;Azure)** | Not applicable. |
| **Customer<br />(PCI&#8209;DSS&nbsp;Blueprint)** | Wireless and SNMP are not implemented in the solution.|



## PCI DSS Requirement 4.2

**4.2** Never send unprotected PANs by end-user messaging technologies (for example, e-mail, instant messaging, SMS, chat, etc.).

**Responsibilities:&nbsp;&nbsp;`Customer Only`**

|||
|---|---|
| **Provider<br />(Microsoft&nbsp;Azure)** | Not applicable. |
| **Customer<br />(PCI&#8209;DSS&nbsp;Blueprint)** | The Contoso Webstore does not have any messaging solutions implemented that may send unprotected primary account number (PAN) data.|



## PCI DSS Requirement 4.3

**4.3** Ensure that security policies and operational procedures for encrypting transmissions of cardholder data are documented, in use, and known to all affected parties.

**Responsibilities:&nbsp;&nbsp;`Customer Only`**

|||
|---|---|
| **Provider<br />(Microsoft&nbsp;Azure)** | Not applicable. |
| **Customer<br />(PCI&#8209;DSS&nbsp;Blueprint)** | Customers are responsible for documenting and encrypting transmissions containing cardholder data.|




