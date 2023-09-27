---
title: Configure Microsoft Entra ID for HIPAA compliance
description: Introduction for guidance on how to configure Microsoft Entra ID for HIPAA compliance level.
services: active-directory 
ms.service: active-directory
ms.subservice: fundamentals
ms.workload: identity
ms.topic: how-to
author: janicericketts
ms.author: jricketts
manager: martinco
ms.reviewer: martinco
ms.date: 04/13/2023
ms.custom: it-pro
ms.collection: M365-identity-device-management
---

# Configuring Microsoft Entra ID for HIPAA compliance

Microsoft services such as Microsoft Entra ID can help you meet identity-related requirements for the Health Insurance Portability and Accountability Act of 1996 (HIPAA).

The HIPAA Security Rule (HSR) establishes standards to protect individuals’ electronic personal health information that is created, received, used, or maintained by a covered entity. The HSR is managed by the U.S. Department of Health and Human Services (HHS) and requires appropriate administrative, physical, and technical safeguards to ensure the confidentiality, integrity, and security of electronic protected health information.

Technical safeguards requirements and objectives are defined in Title 45 of the Code of Federal Regulations (CFRs). Part 160 of Title 45 provides the general administrative requirements, and Part 164’s subparts A and C describe the security and privacy requirements.

Subpart § 164.304 defines technical safeguards as the technology and the policies and procedures for its use that protect electronic protected health information and control access to it. The HHS also outlines key areas for healthcare organizations to consider when implementing HIPAA technical safeguards. From [§ 164.312 Technical safeguards](https://www.ecfr.gov/current/title-45/section-164.312):

* **Access controls** - Implement technical policies and procedures for electronic information systems that maintain electronic protected health information to allow access only to those persons or software programs that have been granted access rights as specified in [§ 164.308(a)(4)](https://www.ecfr.gov/current/title-45/section-164.308).

* **Audit controls** - Implement hardware, software, and/or procedural mechanisms that record and examine activity in information systems that contain or use electronic protected health information.

* **Integrity controls** - Implement policies and procedures to protect electronic protected health information from improper alteration or destruction.

* **Person or entity authentication** - Implement procedures to verify that a person or entity seeking access to electronic protected health information is the one claimed.

* **Transmission security** - Implement technical security measures to guard against unauthorized access to electronic protected health information that is being transmitted over an electronic communications network.

The HSR defines subparts as standard, along with required and addressable implementation specifications. All must be implemented. The "addressable" designation denotes a specification is reasonable and appropriate. Addressable doesn't mean that an implementation specification is optional. Therefore, subparts that are defined as addressable are also required.

The remaining articles in this series provide guidance and links to resources, organized by key areas and technical safeguards. For each key area, there's a table with the relevant safeguards listed, and links to Microsoft Entra guidance to accomplish the safeguard.

## Learn more

* [HHS Zero Trust in Healthcare pdf](https://www.hhs.gov/sites/default/files/zero-trust.pdf)

* [Combined regulation text](https://www.hhs.gov/hipaa/for-professionals/privacy/laws-regulations/combined-regulation-text/index.html) of all HIPAA Administrative Simplification Regulations found at 45 CFR 160, 162, and 164

* [Code of Federal Regulations (CFR) Title 45](https://www.ecfr.gov/current/title-45) describing the public welfare portion of the regulation

* [Part 160](https://www.ecfr.gov/current/title-45/subtitle-A/subchapter-C/part-160?toc=1) describing the general administrative requirements of Title 45

* [Part 164](https://www.ecfr.gov/current/title-45/subtitle-A/subchapter-C/part-164) Subparts A and C describing the security and privacy requirements of Title 45

* [HIPAA Security Risk Safeguard Tool](https://www.healthit.gov/topic/privacy-security-and-hipaa/security-risk-assessment-tool)

* [NIST HSR Toolkit](http://scap.nist.gov/hipaa/)

## Next steps

* [Access Controls Safeguard guidance](hipaa-access-controls.md)

* [Audit Controls Safeguard guidance](hipaa-audit-controls.md)

* [Other Safeguard guidance](hipaa-other-controls.md)
