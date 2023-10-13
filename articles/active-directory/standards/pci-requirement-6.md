---
title: Microsoft Entra ID and PCI-DSS Requirement 6
description: Learn PCI-DSS defined approach requirements about developing and maintaining secure systems and software
services: active-directory 
ms.service: active-directory
ms.subservice: standards
ms.workload: identity
ms.topic: how-to
author: jricketts
ms.author: jricketts
manager: martinco
ms.reviewer: martinco
ms.date: 04/18/2023
ms.custom: it-pro
ms.collection: 
---

# Microsoft Entra ID and PCI-DSS Requirement 6

**Requirement 6: Develop and Maintain Secure Systems and Software**
</br>**Defined approach requirements**

## 6.1 Processes and mechanisms for developing and maintaining secure systems and software are defined and understood.

|PCI-DSS Defined approach requirements|Microsoft Entra guidance and recommendations|
|-|-|
|**6.1.1** All security policies and operational procedures that are identified in Requirement 6 are: </br> Documented </br> Kept up to date </br> In use </br> Known to all affected parties|Use the guidance and links herein to produce the documentation to fulfill requirements based on your environment configuration.|
|**6.1.2** Roles and responsibilities for performing activities in Requirement 6 are documented, assigned, and understood.|Use the guidance and links herein to produce the documentation to fulfill requirements based on your environment configuration.|

## 6.2 Bespoke and custom software are developed securely.

|PCI-DSS Defined approach requirements|Microsoft Entra guidance and recommendations|
|-|-|
|**6.2.1** Bespoke and custom software are developed securely, as follows: </br> Based on industry standards and/or best practices for secure development. </br> In accordance with PCI-DSS (for example, secure authentication and logging). </br> Incorporating consideration of information security issues during each stage of the software development lifecycle.|Procure and develop applications that use modern authentication protocols, such as OAuth2 and OpenID Connect (OIDC), which integrate with Microsoft Entra ID. </br> Build software using the Microsoft identity platform. [Microsoft identity platform best practices and recommendations](../develop/identity-platform-integration-checklist.md)|
|**6.2.2** Software development personnel working on bespoke and custom software are trained at least once every 12 months as follows: </br> On software security relevant to their job function and development languages. </br> Including secure software design and secure coding techniques. </br> Including, if security testing tools are used, how to use the tools for detecting vulnerabilities in software.|Use the following exam to provide proof of proficiency on Microsoft identity platform: [Exam MS-600: Building Applications and Solutions with Microsoft 365 Core Services](/credentials/certifications/exams/ms-600/) Use the following training to prepare for the exam: [MS-600: Implement Microsoft identity](/training/paths/m365-identity-associate/)|
|**6.2.3** Bespoke and custom software is reviewed prior to being released into production or to customers, to identify and correct potential coding vulnerabilities, as follows: </br> Code reviews ensure code is developed according to secure coding guidelines. </br> Code reviews look for both existing and emerging software vulnerabilities. </br> Appropriate corrections are implemented prior to release.|Not applicable to Microsoft Entra ID.|
|**6.2.3.1** If manual code reviews are performed for bespoke and custom software prior to release to production, code changes are: </br> Reviewed by individuals other than the originating code author, and who are knowledgeable about code-review techniques and secure coding practices. </br> Reviewed and approved by management prior to release.|Not applicable to Microsoft Entra ID.|
|**6.2.4** Software engineering techniques or other methods are defined and in use by software development personnel to prevent or mitigate common software attacks and related vulnerabilities in bespoke and custom software, including but not limited to the following: </br> Injection attacks, including SQL, LDAP, XPath, or other command, parameter, object, fault, or injection-type flaws. </br> Attacks on data and data structures, including attempts to manipulate buffers, pointers, input data, or shared data. </br> Attacks on cryptography usage, including attempts to exploit weak, insecure, or inappropriate cryptographic implementations, algorithms, cipher suites, or modes of operation. </br> Attacks on business logic, including attempts to abuse or bypass application features and functionalities through the manipulation of APIs, communication protocols and channels, client-side functionality, or other system/application functions and resources. This includes cross-site scripting (XSS) and cross-site request forgery (CSRF). </br> Attacks on access control mechanisms, including attempts to bypass or abuse identification, authentication, or authorization mechanisms, or attempts to exploit weaknesses in the implementation of such mechanisms. </br> Attacks via any “high-risk” vulnerabilities identified in the vulnerability identification process, as defined in Requirement 6.3.1.|Not applicable to Microsoft Entra ID.|

## 6.3 Security vulnerabilities are identified and addressed.

|PCI-DSS Defined approach requirements|Microsoft Entra guidance and recommendations|
|-|-|
|**6.3.1** Security vulnerabilities are identified and managed as follows: </br> New security vulnerabilities are identified using industry-recognized sources for security vulnerability information, including alerts from international and national/regional computer emergency response teams (CERTs). </br> Vulnerabilities are assigned a risk ranking based on industry best practices and consideration of potential impact. </br> Risk rankings identify, at a minimum, all vulnerabilities considered to be a high-risk or critical to the environment. </br> Vulnerabilities for bespoke and custom, and third-party software (for example operating systems and databases) are covered.|Learn about vulnerabilities. [MSRC | Security Updates, Security Update Guide](https://msrc.microsoft.com/update-guide)|
|**6.3.2** An inventory of bespoke and custom software, and third-party software components incorporated into bespoke and custom software is maintained to facilitate vulnerability and patch management.|Generate reports for applications using Microsoft Entra ID for authentication for inventory. [applicationSignInDetailedSummary resource type](/graph/api/resources/applicationsignindetailedsummary?view=graph-rest-beta&viewFallbackFrom=graph-rest-1.0&preserve-view=true) </br> [Applications listed in Enterprise applications](../manage-apps/application-list.md)|
|**6.3.3** All system components are protected from known vulnerabilities by installing applicable security patches/updates as follows: </br> Critical or high-security patches/updates (identified according to the risk ranking process at Requirement 6.3.1) are installed within one month of release. </br> All other applicable security patches/updates are installed within an appropriate time frame as determined by the entity (for example, within three months of release).|Not applicable to Microsoft Entra ID.|

## 6.4 Public-facing web applications are protected against attacks.

|PCI-DSS Defined approach requirements|Microsoft Entra guidance and recommendations|
|-|-|
|**6.4.1** For public-facing web applications, new threats and vulnerabilities are addressed on an ongoing basis and these applications are protected against known attacks as follows: Reviewing public-facing web applications via manual or automated application vulnerability security assessment tools or methods as follows: </br> – At least once every 12 months and after significant changes. </br> – By an entity that specializes in application security. </br> – Including, at a minimum, all common software attacks in Requirement 6.2.4. </br> – All vulnerabilities are ranked in accordance with requirement 6.3.1. </br> – All vulnerabilities are corrected. </br> – The application is reevaluated after the corrections </br> OR </br> Installing an automated technical solution(s) that continually detect and prevent web-based attacks as follows: </br> – Installed in front of public-facing web applications to detect and prevent web-based attacks. </br> – Actively running and up to date as applicable. </br> – Generating audit logs. </br> – Configured to either block web-based attacks or generate an alert that is immediately investigated.|Not applicable to Microsoft Entra ID.|
|**6.4.2**  For public-facing web applications, an automated technical solution is deployed that continually detects and prevents web-based attacks, with at least the following: </br> Is installed in front of public-facing web applications and is configured to detect and prevent web-based attacks. </br> Actively running and up to date as applicable. </br> Generating audit logs. </br> Configured to either block web-based attacks or generate an alert that is immediately investigated.|Not applicable to Microsoft Entra ID.|
|**6.4.3** All payment page scripts that are loaded and executed in the consumer’s browser are managed as follows: </br> A method is implemented to confirm that each script is authorized. </br> A method is implemented to assure the integrity of each script. </br> An inventory of all scripts is maintained with written justification as to why each is necessary.|Not applicable to Microsoft Entra ID.|

## 6.5 Changes to all system components are managed securely.

|PCI-DSS Defined approach requirements|Microsoft Entra guidance and recommendations|
|-|-|
|**6.5.1** Changes to all system components in the production environment are made according to established procedures that include: </br> Reason for, and description of, the change. </br> Documentation of security impact. </br> Documented change approval by authorized parties. </br> Testing to verify that the change doesn't adversely impact system security. </br> For bespoke and custom software changes, all updates are tested for compliance with Requirement 6.2.4 before being deployed into production. </br> Procedures to address failures and return to a secure state.|Include changes to Microsoft Entra configuration in the change control process. |
|**6.5.2** Upon completion of a significant change, all applicable PCI-DSS requirements are confirmed to be in place on all new or changed systems and networks, and documentation is updated as applicable.|Not applicable to Microsoft Entra ID.|
|**6.5.3** Preproduction environments are separated from production environments and the separation is enforced with access controls.|Approaches to separate preproduction and production environments, based on organizational requirements. [Resource isolation in a single tenant](../architecture/secure-single-tenant.md) </br> [Resource isolation with multiple tenants](../architecture/secure-multiple-tenants.md)|
|**6.5.4** Roles and functions are separated between production and preproduction environments to provide accountability such that only reviewed and approved changes are deployed.|Learn about privileged roles and dedicated preproduction tenants. [Best practices for Microsoft Entra roles](../roles/best-practices.md)|
|**6.5.5** Live PANs aren't used in preproduction environments, except where those environments are included in the CDE and protected in accordance with all applicable PCI-DSS requirements.|Not applicable to Microsoft Entra ID.|
|**6.5.6** Test data and test accounts are removed from system components before the system goes into production.|Not applicable to Microsoft Entra ID.|

## Next steps

PCI-DSS requirements **3**, **4**, **9**, and **12** aren't applicalbe to Microsoft Entra ID, therefore there are no corresponding articles. To see all requirements, go to pcisecuritystandards.org: [Official PCI Security Standards Council Site](https://docs-prv.pcisecuritystandards.org/PCI%20DSS/Standard/PCI-DSS-v4_0.pdf).

To configure Microsoft Entra ID to comply with PCI-DSS, see the following articles. 

* [Microsoft Entra PCI-DSS guidance](pci-dss-guidance.md) 
* [Requirement 1: Install and Maintain Network Security Controls](pci-requirement-1.md) 
* [Requirement 2: Apply Secure Configurations to All System Components](pci-requirement-2.md)
* [Requirement 5: Protect All Systems and Networks from Malicious Software](pci-requirement-5.md) 
* [Requirement 6: Develop and Maintain Secure Systems and Software](pci-requirement-6.md) (You're here)
* [Requirement 7: Restrict Access to System Components and Cardholder Data by Business Need to Know](pci-requirement-7.md)
* [Requirement 8: Identify Users and Authenticate Access to System Components](pci-requirement-8.md)
* [Requirement 10: Log and Monitor All Access to System Components and Cardholder Data](pci-requirement-10.md)
* [Requirement 11: Test Security of Systems and Networks Regularly](pci-requirement-11.md)
* [Microsoft Entra PCI-DSS Multi-Factor Authentication guidance](pci-dss-mfa.md)
