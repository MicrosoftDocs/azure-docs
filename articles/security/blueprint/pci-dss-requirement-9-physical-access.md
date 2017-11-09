---

title: Physical access requirements for PCI DSS-compliant environments
description: PCI DSS Requirement 9
services: security
documentationcenter: na
author: simorjay
manager: mbaldwin
editor: tomsh

ms.assetid: 91595a69-e9ce-4f9c-8388-10224165d9c0
ms.service: security
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: na
ms.date: 10/15/2017
ms.author: frasim

---

# Physical access requirements for PCI DSS-compliant environments 
## PCI DSS Requirement 9

**Restrict physical access to cardholder data**

> [!NOTE] These requirements are defined by the [Payment Card Industry (PCI) Security Standards Council](https://www.pcisecuritystandards.org/pci_security/) as part of the [PCI Data Security Standard (DSS) Version 3.2](https://www.pcisecuritystandards.org/document_library?category=pcidss&document=pci_dss). Please refer to the PCI DSS for information on testing procedures and guidance for each requirement.

Any physical access to data or systems that house cardholder data provides the opportunity for individuals to access devices or data and to remove systems or hardcopies, and should be appropriately restricted. For the purposes of Requirement 9, “onsite personnel” refers to full-time and part-time employees, temporary employees, contractors and consultants who are physically present on the entity’s premises. A “visitor” refers to a vendor, guest of any onsite personnel, service workers, or anyone who needs to enter the facility for a short duration, usually not more than one day. “Media” refers to all paper and electronic media containing cardholder data.

## PCI DSS Requirement 9.1

**9.1** Use appropriate facility entry controls to limit and monitor physical access to systems in the cardholder data environment.

**Responsibilities:&nbsp;&nbsp;`Microsoft Azure Only`**

|||
|---|---|
| **Provider<br />(Microsoft&nbsp;Azure)** | Microsoft Azure is responsible for implementing, enforcing, and monitoring physical access security for data centers. |
| **Customer<br />(PCI&#8209;DSS&nbsp;Blueprint)** | Not applicable.|



### PCI DSS Requirement 9.1.1

**9.1.1** Use either video cameras or access control mechanisms (or both) to monitor individual physical access to sensitive areas. Review collected data and correlate with other entries. Store for at least three months, unless otherwise restricted by law.

> [!NOTE] “Sensitive areas” refers to any data center, server room or any area that houses systems that store, process, or transmit cardholder data. This excludes public-facing areas where only point-of-sale terminals are present, such as the cashier areas in a retail store.

**Responsibilities:&nbsp;&nbsp;`Microsoft Azure Only`**

|||
|---|---|
| **Provider<br />(Microsoft&nbsp;Azure)** | Microsoft Azure is responsible for implementing, enforcing, and monitoring CCTV and biometric access control mechanisms for data centers. |
| **Customer<br />(PCI&#8209;DSS&nbsp;Blueprint)** | Not applicable.|



### PCI DSS Requirement 9.1.2

**9.1.2** Implement physical and/or logical controls to restrict access to publicly accessible network jacks. 

For example, network jacks located in public areas and areas accessible to visitors could be disabled and only enabled when network access is explicitly authorized. Alternatively, processes could be implemented to ensure that visitors are escorted at all times in areas with active network jacks.

**Responsibilities:&nbsp;&nbsp;`Microsoft Azure Only`**

|||
|---|---|
| **Provider<br />(Microsoft&nbsp;Azure)** | There are no publicly accessible network jacks within the Microsoft Azure platform. |
| **Customer<br />(PCI&#8209;DSS&nbsp;Blueprint)** | Not applicable.|



### PCI DSS Requirement 9.1.3

**9.1.3** Restrict physical access to wireless access points, gateways, handheld devices, networking/communications hardware, and telecommunication lines.

**Responsibilities:&nbsp;&nbsp;`Microsoft Azure Only`**

|||
|---|---|
| **Provider<br />(Microsoft&nbsp;Azure)** | Physical access to Microsoft Azure network hardware is tightly controlled by access lists, multiple forms of authentication, physical barriers to entry, and requirement for business need to be approved for access to equipment. |
| **Customer<br />(PCI&#8209;DSS&nbsp;Blueprint)** | Not applicable.|



## PCI DSS Requirement 9.2

**9.2** Develop procedures to easily distinguish between onsite personnel and visitors, to include:
- Identifying onsite personnel and visitors (for example, assigning badges)
- Changes to access requirements
- Revoking or terminating onsite personnel and expired visitor identification (such as ID badges).

**Responsibilities:&nbsp;&nbsp;`Microsoft Azure Only`**

|||
|---|---|
| **Provider<br />(Microsoft&nbsp;Azure)** | Microsoft Azure is responsible for implementing, enforcing, and monitoring physical access security and employee or contractor identification when visiting data centers. |
| **Customer<br />(PCI&#8209;DSS&nbsp;Blueprint)** | Not applicable.|



## PCI DSS Requirement 9.3

**9.3** Control physical access for onsite personnel to the sensitive areas as follows:
- Access must be authorized and based on individual job function.
- Access is revoked immediately upon termination, and all physical access mechanisms, such as keys, access cards, etc., are returned or disabled.

**Responsibilities:&nbsp;&nbsp;`Microsoft Azure Only`**

|||
|---|---|
| **Provider<br />(Microsoft&nbsp;Azure)** | Access authorizations to Microsoft data centers is controlled using an authorized access list approved by the Data Center team based on the principle of least privilege. The access control list is reviewed, verified and updated quarterly.<br /><br />Microsoft Azure data centers utilize physical access devices such as perimeter gates, electronic access badge readers, biometric readers, man-traps/portals, and anti-pass back devices. Access badge devices are continuously monitored. |
| **Customer<br />(PCI&#8209;DSS&nbsp;Blueprint)** | Not applicable.|



## PCI DSS Requirement 9.4

**9.4** Implement procedures to identify and authorize visitors. Procedures should include the following.

**Responsibilities:&nbsp;&nbsp;`Microsoft Azure Only`**

|||
|---|---|
| **Provider<br />(Microsoft&nbsp;Azure)** | Microsoft Azure is responsible for enforcing pre-approved deliveries are received in a secure loading bay that is physically isolated from information processing facilities and are monitored by authorized personnel. |
| **Customer<br />(PCI&#8209;DSS&nbsp;Blueprint)** | Not applicable.|



### PCI DSS Requirement 9.4.1

**9.4.1** Visitors are authorized before entering, and escorted at all times within, areas where cardholder data is processed or maintained.


**Responsibilities:&nbsp;&nbsp;`Microsoft Azure Only`**

|||
|---|---|
| **Provider<br />(Microsoft&nbsp;Azure)** | Microsoft Azure is responsible for enforcing pre-approved deliveries are received in a secure loading bay that is physically isolated from information processing facilities and are monitored by authorized personnel. |
| **Customer<br />(PCI&#8209;DSS&nbsp;Blueprint)** | Not applicable.|



### PCI DSS Requirement 9.4.2

**9.4.2** Visitors are identified and given a badge or other identification that expires and that visibly distinguishes the visitors from onsite personnel.

**Responsibilities:&nbsp;&nbsp;`Microsoft Azure Only`**

|||
|---|---|
| **Provider<br />(Microsoft&nbsp;Azure)** | Microsoft data center access must be pre-approved and authorized visitors are required to check-in with physical security at the point of arrival and provide a valid proof of ID before entry. Badges clearly indicate employees. Contractors and visitors receive temporary badges that must be surrendered upon departure from the facility. |
| **Customer<br />(PCI&#8209;DSS&nbsp;Blueprint)** | Not applicable.|



### PCI DSS Requirement 9.4.3

**9.4.3** Visitors are asked to surrender the badge or identification before leaving the facility or at the date of expiration.

**Responsibilities:&nbsp;&nbsp;`Microsoft Azure Only`**

|||
|---|---|
| **Provider<br />(Microsoft&nbsp;Azure)** | Visitors are required to surrender badges upon departure from any Microsoft facility. |
| **Customer<br />(PCI&#8209;DSS&nbsp;Blueprint)** | Not applicable.|



### PCI DSS Requirement 9.4.4

**9.4.4** A visitor log is used to maintain a physical audit trail of visitor activity to the facility as well as computer rooms and data centers where cardholder data is stored or transmitted.
Document the visitor’s name, the firm represented, and the onsite personnel authorizing physical access on the log.
Retain this log for a minimum of three months, unless otherwise restricted by law.

**Responsibilities:&nbsp;&nbsp;`Microsoft Azure Only`**

|||
|---|---|
| **Provider<br />(Microsoft&nbsp;Azure)** | Microsoft Azure is responsible for maintaining a visitor log as a physical audit trail of visitor activity to the facility as well as computer rooms and data centers where cardholder data is stored or transmitted. |
| **Customer<br />(PCI&#8209;DSS&nbsp;Blueprint)** | Not applicable.|



## PCI DSS Requirement 9.5

**9.5** Physically secure all media.

**Responsibilities:&nbsp;&nbsp;`Customer Only`**

|||
|---|---|
| **Provider<br />(Microsoft&nbsp;Azure)** | Not applicable. |
| **Customer<br />(PCI&#8209;DSS&nbsp;Blueprint)** | The Contoso Webstore stores all data in Azure SQL Database. A PaaS SQL Database instance is used to showcase database security measures. For more information, see [PCI Guidance - Azure SQL Database](payment-processing-blueprint.md#azure-sql-database).|



### PCI DSS Requirement 9.5.1

**9.5.1** Store media backups in a secure location, preferably an off-site facility, such as an alternate or backup site, or a commercial storage facility. Review the location’s security at least annually.

**Responsibilities:&nbsp;&nbsp;`Customer Only`**

|||
|---|---|
| **Provider<br />(Microsoft&nbsp;Azure)** | Not applicable. |
| **Customer<br />(PCI&#8209;DSS&nbsp;Blueprint)** | The Contoso Webstore stores all data in Azure SQL Database. A PaaS SQL Database instance is used to showcase database security measures. For more information, see [PCI Guidance - Azure SQL Database](payment-processing-blueprint.md#azure-sql-database).|



## PCI DSS Requirement 9.6

**9.6** Maintain strict control over the internal or external distribution of any kind of media, including the following.

**Responsibilities:&nbsp;&nbsp;`Customer Only`**

|||
|---|---|
| **Provider<br />(Microsoft&nbsp;Azure)** | Not applicable. |
| **Customer<br />(PCI&#8209;DSS&nbsp;Blueprint)** | The Contoso Webstore stores all data in Azure SQL Database. A PaaS SQL Database instance is used to showcase database security measures. For more information, see [PCI Guidance - Azure SQL Database](payment-processing-blueprint.md#azure-sql-database).|



### PCI DSS Requirement 9.6.1

**9.6.1** Classify media so the sensitivity of the data can be determined.

**Responsibilities:&nbsp;&nbsp;`Customer Only`**

|||
|---|---|
| **Provider<br />(Microsoft&nbsp;Azure)** | Not applicable. |
| **Customer<br />(PCI&#8209;DSS&nbsp;Blueprint)** | The Contoso Webstore stores all data in Azure SQL Database. A PaaS SQL Database instance is used to showcase database security measures. For more information, see [PCI Guidance - Azure SQL Database](payment-processing-blueprint.md#azure-sql-database).|



### PCI DSS Requirement 9.6.2

**9.6.2** Send the media by secured courier or other delivery method that can be accurately tracked.

**Responsibilities:&nbsp;&nbsp;`Customer Only`**

|||
|---|---|
| **Provider<br />(Microsoft&nbsp;Azure)** | Not applicable. |
| **Customer<br />(PCI&#8209;DSS&nbsp;Blueprint)** | The Contoso Webstore stores all data in Azure SQL Database. A PaaS SQL Database instance is used to showcase database security measures. For more information, see [PCI Guidance - Azure SQL Database](payment-processing-blueprint.md#azure-sql-database).|



### PCI DSS Requirement 9.6.3

**9.6.3** Ensure management approves any and all media that is moved from a secured area (including when media is distributed to individuals).

**Responsibilities:&nbsp;&nbsp;`Customer Only`**

|||
|---|---|
| **Provider<br />(Microsoft&nbsp;Azure)** | Not applicable. |
| **Customer<br />(PCI&#8209;DSS&nbsp;Blueprint)** | The Contoso Webstore stores all data in Azure SQL Database. A PaaS SQL Database instance is used to showcase database security measures. For more information, see [PCI Guidance - Azure SQL Database](payment-processing-blueprint.md#azure-sql-database).|



## PCI DSS Requirement 9.7

**9.7** Maintain strict control over the storage and accessibility of media.

**Responsibilities:&nbsp;&nbsp;`Customer Only`**

|||
|---|---|
| **Provider<br />(Microsoft&nbsp;Azure)** | Not applicable. |
| **Customer<br />(PCI&#8209;DSS&nbsp;Blueprint)** | The Contoso Webstore stores all data in Azure SQL Database. A PaaS SQL Database instance is used to showcase database security measures. For more information, see [PCI Guidance - Azure SQL Database](payment-processing-blueprint.md#azure-sql-database).|



### PCI DSS Requirement 9.7.1

**9.7.1** Properly maintain inventory logs of all media and conduct media inventories at least annually.


**Responsibilities:&nbsp;&nbsp;`Customer Only`**

|||
|---|---|
| **Provider<br />(Microsoft&nbsp;Azure)** | Not applicable. |
| **Customer<br />(PCI&#8209;DSS&nbsp;Blueprint)** | The Contoso Webstore stores all data in Azure SQL Database. A PaaS SQL Database instance is used to showcase database security measures. For more information, see [PCI Guidance - Azure SQL Database](payment-processing-blueprint.md#azure-sql-database).|



## PCI DSS Requirement 9.8

**9.8** Destroy media when it is no longer needed for business or legal reasons as follows.

**Responsibilities:&nbsp;&nbsp;`Customer Only`**

|||
|---|---|
| **Provider<br />(Microsoft&nbsp;Azure)** | Not applicable. |
| **Customer<br />(PCI&#8209;DSS&nbsp;Blueprint)** | The Contoso Webstore stores all data in Azure SQL Database. A PaaS SQL Database instance is used to showcase database security measures. For more information, see [PCI Guidance - Azure SQL Database](payment-processing-blueprint.md#azure-sql-database).|



### PCI DSS Requirement 9.8.1

**9.8.1** Shred, incinerate, or pulp hard-copy materials so that cardholder data cannot be reconstructed. Secure storage containers used for materials that are to be destroyed.

**Responsibilities:&nbsp;&nbsp;`Customer Only`**

|||
|---|---|
| **Provider<br />(Microsoft&nbsp;Azure)** | Not applicable. |
| **Customer<br />(PCI&#8209;DSS&nbsp;Blueprint)** | The Contoso Webstore stores all data in Azure SQL Database. A PaaS SQL Database instance is used to showcase database security measures. For more information, see [PCI Guidance - Azure SQL Database](payment-processing-blueprint.md#azure-sql-database).|



### PCI DSS Requirement 9.8.2

**9.8.2** Render cardholder data on electronic media unrecoverable so that cardholder data cannot be reconstructed.

**Responsibilities:&nbsp;&nbsp;`Shared`**

|||
|---|---|
| **Provider<br />(Microsoft&nbsp;Azure)** | Data destruction techniques vary depending on the type of data object being destroyed, whether it be subscriptions, storage, virtual machines, or databases. In the Microsoft Azure multi-tenant environment, careful attention is taken to ensure that one customer’s data is not allowed to either “leak” into another customer’s data, or when a customer deletes data, no other customer (including, in most cases, the customer who once owned the data) can gain access to that deleted data.<br /><br />Microsoft Azure follows NIST 800-88 Guidelines on Media Sanitization, which address the principal concern of ensuring that data is not unintentionally released. These guidelines encompass both electronic and physical sanitization. |
| **Customer<br />(PCI&#8209;DSS&nbsp;Blueprint)** | The Contoso Webstore can be deleted entirely by deleting the Resource Group used during deployment.|



## PCI DSS Requirement 9.9

**9.9** Protect devices that capture payment card data via direct physical interaction with the card from tampering and substitution.

> [!NOTE] These requirements apply to card-reading devices used in card-present transactions (that is, card swipe or dip) at the point of sale. This requirement is not intended to apply to manual key-entry components such as computer keyboards and POS keypads. 

**Responsibilities:&nbsp;&nbsp;`Customer Only`**

|||
|---|---|
| **Provider<br />(Microsoft&nbsp;Azure)** | Not applicable. |
| **Customer<br />(PCI&#8209;DSS&nbsp;Blueprint)** | The Contoso Webstore utilizes OMS to log all system changes.<br /><br />[Operations Management Suite (OMS)](/azure/operations-management-suite/) provides extensive logging of changes. Changes can be reviewed and verified for accuracy. For more specific guidance, see [PCI Guidance - Operations Management Suite](payment-processing-blueprint.md#logging-and-auditing).|



### PCI DSS Requirement 9.9.1

**9.9.1** Maintain an up-to-date list of devices. The list should include the following:
- Make, model of device
- Location of device (for example, the address of the site or facility where the device is located)
- Device serial number or other method of unique identification

**Responsibilities:&nbsp;&nbsp;`Customer Only`**

|||
|---|---|
| **Provider<br />(Microsoft&nbsp;Azure)** | Not applicable. |
| **Customer<br />(PCI&#8209;DSS&nbsp;Blueprint)** | The Contoso Webstore provides a reference architecture and a list of all services used in its deployment documentation.|



### PCI DSS Requirement 9.9.2

**9.9.2** Periodically inspect device surfaces to detect tampering (for example, addition of card skimmers to devices), or substitution (for example, by checking the serial number or other device characteristics to verify it has not been swapped with a fraudulent device).

> [!NOTE] Examples of signs that a device might have been tampered with or substituted include unexpected attachments or cables plugged into the device, missing or changed security labels, broken or differently colored casing, or changes to the serial number or other external markings.

**Responsibilities:&nbsp;&nbsp;`Customer Only`**

|||
|---|---|
| **Provider<br />(Microsoft&nbsp;Azure)** | Not applicable. |
| **Customer<br />(PCI&#8209;DSS&nbsp;Blueprint)** | Not applicable.|



### PCI DSS Requirement 9.9.3

**9.9.3** Provide training for personnel to be aware of attempted tampering or replacement of devices. Training should include the following:
- Verify the identity of any third-party persons claiming to be repair or maintenance personnel, prior to granting them access to modify or troubleshoot devices.
- Do not install, replace, or return devices without verification.
- Be aware of suspicious behavior around devices (for example, attempts by unknown persons to unplug or open devices).
- Report suspicious behavior and indications of device tampering or substitution to appropriate personnel (for example, to a manager or security officer).

**Responsibilities:&nbsp;&nbsp;`Customer Only`**

|||
|---|---|
| **Provider<br />(Microsoft&nbsp;Azure)** | Not applicable. |
| **Customer<br />(PCI&#8209;DSS&nbsp;Blueprint)** | Not applicable.|



## PCI DSS Requirement 9.10

**9.10** Ensure that security policies and operational procedures for restricting physical access to cardholder data are documented, in use, and known to all affected parties.

**Responsibilities:&nbsp;&nbsp;`Customer Only`**

|||
|---|---|
| **Provider<br />(Microsoft&nbsp;Azure)** | Not applicable. |
| **Customer<br />(PCI&#8209;DSS&nbsp;Blueprint)** | Not applicable.|




