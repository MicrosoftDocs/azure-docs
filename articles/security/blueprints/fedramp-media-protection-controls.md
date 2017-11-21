---

title: FedRAMP Azure Blueprint Automation - Media Protection
description: Web Applications for FedRAMP - Media Protection
services: security
documentationcenter: na
author: jomolesk
manager: mbaldwin
editor: tomsh

ms.assetid: fe86fd92-ef6b-4d17-a4a2-de6796d251d0
ms.service: security
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: na
ms.date: 11/15/2017
ms.author: jomolesk

---

> [!NOTE]
> These controls are defined by NIST and the U.S. Department of Commerce as part of the NIST Special Publication 800-53 Revision 4. Please refer to NIST 800-53 Rev. 4 for information on testing procedures and guidance for each control.
    
    

# Media Protection (MP)

## NIST 800-53 Control MP-1

#### Media Protection Policy and Procedures

**MP-1** The organization develops, documents, and disseminates to [Assignment: organization-defined personnel or roles] a media protection policy that addresses purpose, scope, roles, responsibilities, management commitment, coordination among organizational entities, and compliance; and procedures to facilitate the implementation of the media protection policy and associated media protection controls; and reviews and updates the current media protection policy [Assignment: organization-defined frequency]; and media protection procedures [Assignment: organization-defined frequency].

**Responsibilities:** `Customer Only`

|||
|---|---|
| **Customer** | The customer's enterprise-level  media protection policy and procedures may be sufficient to address this control. |
| **Provider (Microsoft Azure)** | Not Applicable |


 ## NIST 800-53 Control MP-2

#### Media Access

**MP-2** The organization restricts access to [Assignment: organization-defined types of digital and/or non-digital media] to [Assignment: organization-defined personnel or roles].

**Responsibilities:** `Azure Only`

|||
|---|---|
| **Customer** | There is no customer-controlled media within the scope of systems deployed on Azure. |
| **Provider (Microsoft Azure)** | Microsoft Azure has implemented media access through the implementation of the Microsoft Security Policy. Logical access to digital media is controlled via Active Directory Group Policy Objects (AD GPOs) and security groups. Physical access to all media is restricted by the datacenter access process. Access is restricted to individuals who have a legitimate business purpose for accessing the data. Please refer to PE-3, Physical Access Control, for more details on the datacenter access controls in place. The Asset Protection Standard defines the safeguards required to protect the confidentiality, integrity, and availability of information assets within Microsoft Azure datacenters. |


 ## NIST 800-53 Control MP-3.a

#### Media Marking

**MP-3.a** The organization marks information system media indicating the distribution limitations, handling caveats, and applicable security markings (if any) of the information.

**Responsibilities:** `Azure Only`

|||
|---|---|
| **Customer** | There is no customer-controlled media within the scope of systems deployed on Azure. |
| **Provider (Microsoft Azure)** | Microsoft Azure marks assets within Microsoft datacenters with an HBI, MBI, or LBI (High, Moderate, or Low Business Impact) designation which requires different levels of security and handling precautions. Asset owners are required to classify their assets that are stored within a Microsoft datacenter. Refer to Asset Classification Standard and Asset Protection Standard for more information. |


 ## NIST 800-53 Control MP-3.b

#### Media Marking

**MP-3.b** The organization exempts [Assignment: organization-defined types of information system media] from marking as long as the media remain within [Assignment: organization-defined controlled areas].

**Responsibilities:** `Azure Only`

|||
|---|---|
| **Customer** | There is no customer-controlled media within the scope of systems deployed on Azure. |
| **Provider (Microsoft Azure)** | Microsoft Azure requires asset owners to assign their assets with an asset classification and no assets are exempt from this requirement. In the Microsoft datacenter environment, assets refer to servers, network devices, and magnetic tapes. Other digital media like USB flash/thumb drives, external/removable hard drives, or CD/DVDs are not used. Non-digital media is not used in the datacenter. |


 ## NIST 800-53 Control MP-4.a

#### Media Storage

**MP-4.a** The organization physically controls and securely stores [Assignment: organization-defined types of digital and/or non-digital media] within [Assignment: organization-defined controlled areas].

**Responsibilities:** `Azure Only`

|||
|---|---|
| **Customer** | There is no customer-controlled media within the scope of systems deployed on Azure. |
| **Provider (Microsoft Azure)** | Microsoft Azure digital media assets are physically and securely stored within datacenter colocation rooms. Microsoft datacenters have multiple layers of physical access controls (access badge, biometrics; see PE-3 for further details on physical access controls) and video surveillance in place to provide secure storage. Digital media for includes servers, network devices, and magnetic tapes used for backup. Non-digital media is not used in the datacenter environment. |


 ## NIST 800-53 Control MP-4.b

#### Media Storage

**MP-4.b** The organization protects information system media until the media are destroyed or sanitized using approved equipment, techniques, and procedures.

**Responsibilities:** `Azure Only`

|||
|---|---|
| **Customer** | There is no customer-controlled media within the scope of systems deployed on Azure. |
| **Provider (Microsoft Azure)** | Microsoft Azure digital media assets are protected in Microsoft datacenter colocations through physical access controls (PE-3) and logical access controls (IA-2) for the lifetime of the asset. Microsoft Azure assets are cleared, purged, or destroyed with methods consistent with NIST SP 800-88 prior to the assets disposal. For asset destruction, Microsoft Azure utilizes onsite asset destruction services. |


 ## NIST 800-53 Control MP-5.a

#### Media Transport

**MP-5.a** The organization protects and controls [Assignment: organization-defined types of information system media] during transport outside of controlled areas using [Assignment: organization-defined security safeguards].

**Responsibilities:** `Azure Only`

|||
|---|---|
| **Customer** | There is no customer-controlled media within the scope of systems deployed on Azure. |
| **Provider (Microsoft Azure)** | Microsoft Azure digital media at Microsoft datacenters consist of servers, network devices, and magnetic backup tapes and discs, where appropriate. Microsoft datacenters do not use non-digital media. Microsoft utilizes three methods to protect media that is being transported outside the datacenter: 1) Secure Transport, 2) Encryption 3) Cleanse, Purge, or Destroy. |


 ## NIST 800-53 Control MP-5.b

#### Media Transport

**MP-5.b** The organization maintains accountability for information system media during transport outside of controlled areas.

**Responsibilities:** `Azure Only`

|||
|---|---|
| **Customer** | There is no customer-controlled media within the scope of systems deployed on Azure. |
| **Provider (Microsoft Azure)** | Microsoft Azure maintains accountability for assets leaving the datacenter through the use of guidance from NIST SP 800-88: consistent cleansing/purging, asset destruction, encryption, accurate inventorying, tracking, and protection of chain of custody during transport. |


 ## NIST 800-53 Control MP-5.c

#### Media Transport

**MP-5.c** The organization documents activities associated with the transport of information system media.

**Responsibilities:** `Azure Only`

|||
|---|---|
| **Customer** | There is no customer-controlled media within the scope of systems deployed on Azure. |
| **Provider (Microsoft Azure)** | Microsoft Azure maintains records of inventory prior to transport, tracking and protection of chain of custody during transport, asset cleaning/purging, asset destruction, receipt of assets, and inventory validation after transport. |


 ## NIST 800-53 Control MP-5.d

#### Media Transport

**MP-5.d** The organization restricts the activities associated with the transport of information system media to authorized personnel.

**Responsibilities:** `Azure Only`

|||
|---|---|
| **Customer** | There is no customer-controlled media within the scope of systems deployed on Azure. |
| **Provider (Microsoft Azure)** | Microsoft Azure restricts the activities of asset transport to authorized personnel through the protection of the chain of custody. The use of locks, tamper proof seals, and requiring validation of the asset inventories ensures that only authorized personnel are involved in the asset transport. |


 ### NIST 800-53 Control MP-5 (4)

#### Media Transport | Cryptographic Protection

**MP-5 (4)** The information system implements cryptographic mechanisms to protect the confidentiality and integrity of information stored on digital media during transport outside of controlled areas.

**Responsibilities:** `Azure Only`

|||
|---|---|
| **Customer** | There is no customer-controlled media within the scope of systems deployed on Azure. |
| **Provider (Microsoft Azure)** | Microsoft Azure employs Data Protection Service (DPS) to manage cryptographic keys using a FIPS 140-2 Level 3-validated encryption module (cert #1694) and HSM (cert #1178) to secure AES 256-bit encrypted data on the magnetic tapes. |


 ## NIST 800-53 Control MP-6.a

#### Media Sanitization

**MP-6.a** The organization sanitizes [Assignment: organization-defined information system media] prior to disposal, release out of organizational control, or release for reuse using [Assignment: organization-defined sanitization techniques and procedures] in accordance with applicable federal and organizational standards and policies.

**Responsibilities:** `Azure Only`

|||
|---|---|
| **Customer** | There is no customer-controlled media within the scope of systems deployed on Azure. |
| **Provider (Microsoft Azure)** | Microsoft Azure requires digital media in the Microsoft Azure datacenter environment to be cleansed/purged using Microsoft Azure approved tools and in a manner consistent with NIST SP 800-88, Guidelines for Media Sanitization, prior to being reused or disposed of. Non-digital media is not used by Microsoft Azure in the datacenter environment. |


 ## NIST 800-53 Control MP-6.b

#### Media Sanitization

**MP-6.b** The organization employs sanitization mechanisms with the strength and integrity commensurate with the security category or classification of the information.

**Responsibilities:** `Azure Only`

|||
|---|---|
| **Customer** | There is no customer-controlled media within the scope of systems deployed on Azure. |
| **Provider (Microsoft Azure)** | Microsoft Azure uses data erasure units and processes to cleanse/purge data in a manner consistent with NIST SP 800-88 and which are commensurate with the Microsoft Azure asset classification of the asset. For assets requiring destruction, Microsoft Azure utilizes onsite asset destruction services. |


 ### NIST 800-53 Control MP-6 (1)

#### Media Sanitization | Review / Approve / Track / Document / Verify

**MP-6 (1)** The organization reviews, approves, tracks, documents, and verifies media sanitization and disposal actions.

**Responsibilities:** `Azure Only`

|||
|---|---|
| **Customer** | There is no customer-controlled media within the scope of systems deployed on Azure. |
| **Provider (Microsoft Azure)** | Microsoft Azure has implemented media sanitization procedures in accordance with the guidance in NIST SP 800-88 for the Asset Classification Standard and Asset Protection Standard. All magnetic or electronic media is cleansed/purged by following NIST SP 800-88 specifications in accordance with its Azure asset classification. Azure utilizes data erasure units from Extreme Protocol Solutions (EPS). EPS software supports NIST SP 800-88 requirements for cleansing and purging/secure erasure. |


 ### NIST 800-53 Control MP-6 (2)

#### Media Sanitization | Equipment Testing

**MP-6 (2)** The organization tests sanitization equipment and procedures [Assignment: organization-defined frequency] to verify that the intended sanitization is being achieved.

**Responsibilities:** `Azure Only`

|||
|---|---|
| **Customer** | There is no customer-controlled media within the scope of systems deployed on Azure. |
| **Provider (Microsoft Azure)** | Microsoft Azure uses data erasure units and processes to cleanse/purge data in a manner consistent with NIST SP 800-88. Every 180 days, DCS operations tests the Microsoft Azure data erasure units and the process for erasure. In the test, DCS operations verifies that the intended sanitization is being achieved through a forensic analysis of tested hard drives to confirm that the data has been sanitized by the data erasure units |


 ### NIST 800-53 Control MP-6 (3)

#### Media Sanitization | Nondestructive Techniques

**MP-6 (3)** The organization applies nondestructive sanitization techniques to portable storage devices prior to connecting such devices to the information system under the following circumstances: [Assignment: organization-defined circumstances requiring sanitization of portable storage devices].

**Responsibilities:** `Azure Only`

|||
|---|---|
| **Customer** | There is no customer-controlled media within the scope of systems deployed on Azure. |
| **Provider (Microsoft Azure)** | Microsoft Azure ensures that Azure datacenters follow the Tools and Removable Media Security Procedure in the Data Center Services Run Book in order to prevent the infection of the Government environment by malware on portable storage devices. The procedure specifies that the following actions be taken with USB drives before use in the Government environment: <br /> (1) Format the USB drives when the drives are first purchased from the manufacturer or vendor, before the initial use or when being reused for a different tool. <br /> (2) Scan any USB drive to be used in a Government-designated area for malware, before taking the drive into the area. <br /> (3) After using a drive within a Government-designated area, format the drive before leaving the area. <br /> The Tools and Removable Media Security Procedure also requires that all lost, discarded, stolen or misplaced thumb drives never be re-introduced into Azure datacenters but that they be instead cataloged and destroyed. |


 ## NIST 800-53 Control MP-7

#### Media Use

**MP-7** The organization [Selection: restricts; prohibits] the use of [Assignment: organization-defined types of information system media] on [Assignment: organization-defined information systems or system components] using [Assignment: organization-defined security safeguards].

**Responsibilities:** `Azure Only`

|||
|---|---|
| **Customer** | There is no customer-controlled media within the scope of systems deployed on Azure. |
| **Provider (Microsoft Azure)** | Microsoft Azure requires asset owners to assign their assets with an asset classification, and no assets are exempt from this requirement. In the Microsoft Azure datacenter environment, assets refer to servers, and network devices. Other digital media like USB flash/thumb drives are managed by specific policies and procedures governing how those devices are managed. CD/DVDs are not used. Non-digital media is not used in the datacenter. The usage of digital media in Microsoft Azure datacenter environments is monitored 24x7 via CCTV coverage. Please see PE-06 for more details. |


 ### NIST 800-53 Control MP-7 (1)

#### Media Use | Prohibit Use Without Owner

**MP-7 (1)** The organization prohibits the use of portable storage devices in organizational information systems when such devices have no identifiable owner.

**Responsibilities:** `Azure Only`

|||
|---|---|
| **Customer** | There is no customer-controlled media within the scope of systems deployed on Azure. |
| **Provider (Microsoft Azure)** | Microsoft restricts the use of writable, removable media to media that has been explicitly approved by Datacenter Management via the DCS Tools and Removable Media Procedure. Media that is personally owned or has no identifiable owner is prohibited in any production area as noted in the Microsoft Datacenter Work Rules and Regulations document. |
