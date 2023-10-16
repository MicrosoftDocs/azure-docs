---
title: Microsoft Entra PCI-DSS guidance
description: Guidance on meeting payment card industry (PCI) compliance with Microsoft Entra ID
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

# Microsoft Entra PCI-DSS guidance

The Payment Card Industry Security Standards Council (PCI SSC) is responsible for developing and promoting data security standards and resources, including the Payment Card Industry Data Security Standard (PCI-DSS), to ensure the security of payment transactions. To achieve PCI compliance, organizations using Microsoft Entra ID can refer to guidance in this document. However, it's the responsibility of the organizations to ensure their PCI compliance. Their IT teams, SecOps teams, and Solutions Architects are responsible for creating and maintaining secure systems, products, and networks that handle, process, and store payment card information. 

While Microsoft Entra ID helps meet some PCI-DSS control requirements, and provides modern identity and access protocols for cardholder data environment (CDE) resources, it shouldn't be the sole mechanism for protecting cardholder data. Therefore, review this document set and all PCI-DSS requirements to establish a comprehensive security program that preserves customer trust. For a complete list of requirements, visit the official PCI Security Standards Council website at pcisecuritystandards.org: [Official PCI Security Standards Council Site](https://docs-prv.pcisecuritystandards.org/PCI%20DSS/Standard/PCI-DSS-v4_0.pdf)

## PCI requirements for controls

The global PCI-DSS v4.0  establishes a baseline of technical and operational standards for protecting account data. It "was developed to encourage and enhance payment card account data security and facilitate the broad adoption of consistent data security measures, globally. It provides a baseline of technical and operational requirements designed to protect account data. While designed to focus on environments with payment card account data, PCI-DSS can also be used to protect against threats and secure other elements in the payment ecosystem."  

<a name='azure-ad-configuration-and-pci-dss'></a>

## Microsoft Entra configuration and PCI-DSS

This document serves as a comprehensive guide for technical and business leaders who are responsible for managing identity and access management (IAM) with Microsoft Entra ID in compliance with the Payment Card Industry Data Security Standard (PCI DSS). By following the key requirements, best practices, and approaches outlined in this document, organizations can reduce the scope, complexity, and risk of PCI noncompliance, while promoting security best practices and standards compliance. The guidance provided in this document aims to help organizations configure Microsoft Entra ID in a way that meets the necessary PCI DSS requirements and promotes effective IAM practices.

Technical and business leaders can use the following guidance to fulfill responsibilities for identity and access management (IAM) with Microsoft Entra ID. For more information on PCI-DSS in other Microsoft workloads, see [Overview of the Microsoft cloud security benchmark (v1)](/security/benchmark/azure/overview).

PCI-DSS requirements and testing procedures consist of 12 principal requirements that ensure the secure handling of payment card information. Together, these requirements are a comprehensive framework that helps organizations secure payment card transactions and protect sensitive cardholder data. 

Microsoft Entra ID is an enterprise identity service that secures applications, systems, and resources to support PCI-DSS compliance. The following table has the PCI principal requirements and links to Microsoft Entra ID recommended controls for PCI-DSS compliance.

## Principal PCI-DSS requirements

PCI-DSS requirements **3**, **4**, **9**, and **12** aren't addressed or met by Microsoft Entra ID, therefore there are no corresponding articles. To see all requirements, go to pcisecuritystandards.org: [Official PCI Security Standards Council Site](https://docs-prv.pcisecuritystandards.org/PCI%20DSS/Standard/PCI-DSS-v4_0.pdf).

|PCI Data Security Standard - High Level Overview|Microsoft Entra ID recommended PCI-DSS controls|
|-|-|
|Build and Maintain Secure Network and Systems|[1. Install and Maintain Network Security Controls](pci-requirement-1.md) </br> [2. Apply Secure Configurations to All System Components](pci-requirement-2.md)|
|Protect Account Data|3. Protect Stored Account Data </br> 4. Protect Cardholder Data with Strong Cryptography During Transmission Over Public Networks|
|Maintain a Vulnerability Management Program|[5. Protect All Systems and Networks from Malicious Software](pci-requirement-5.md) </br> [6. Develop and Maintain Secure Systems and Software](pci-requirement-6.md)|
|Implement Strong Access Control Measures|[7. Restrict Access to System Components and Cardholder Data by Business Need to Know](pci-requirement-7.md) </br> [8. Identify and Authenticate Access to System Components](pci-requirement-8.md) </br> 9. Restrict Physical Access to System Components and Cardholder Data|
|Regularly Monitor and Test Networks|[10. Log and Monitor All Access to System Components and Cardholder Data](pci-requirement-10.md) </br> [11. Test Security of Systems and Networks Regularly](pci-requirement-11.md)|
|Maintain an Information Security Policy|12. Support Information Security with Organizational Policies and Programs|

## PCI-DSS applicability

PCI-DSS applies to organizations that store, process, or transmit cardholder data (CHD) and/or sensitive authentication data (SAD). These data elements, considered together, are known as account data. PCI-DSS provides security guidelines and requirements for organizations that affect the cardholder data environment (CDE). Entities safeguarding CDE ensures the confidentiality and security of customer payment information.

CHD consists of:

* **Primary account number (PAN)** - a unique payment card number (credit, debit, or prepaid cards, etc.)   that identifies the issuer and the cardholder account
* **Cardholder name** – the card owner
* **Card expiration date** – the day and month the card expires
* **Service code** - a three- or four-digit value in the magnetic stripe that follows the expiration date of the payment card on the track data. It defines service attributes, differentiating between international and national/regional interchange, or identifying usage restrictions.

SAD consists of security-related information used to authenticate cardholders and/or authorize payment card transactions. SAD includes, but isn't limited to:

* **Full track data** - magnetic stripe or chip equivalent
* **Card verification codes/values** - also referred to as the card validation code (CVC), or value (CVV). It's the three- or four-digit value on the front or back of the payment card. It's also referred to as CAV2, CVC2, CVN2, CVV2 or CID, determined by the participating payment brands (PPB).  
* **PIN** - personal identification number 
  * **PIN blocks** - an encrypted representation of the PIN used in a debit or credit card transaction. It ensures the secure transmission of sensitive information during a transaction 

Protecting the CDE is essential to the security and confidentiality of customer payment information and helps:

* **Preserve customer trust** - customers expect their payment information to be handled securely and kept confidential. If a company experiences a data breach that results in the theft of customer payment data, it can degrade customer trust in the company and cause reputational damage.
* **Comply with regulations** - companies processing credit card transactions are required to comply with the PCI-DSS. Failure to comply results in fines, legal liabilities, and resultant reputational damage.
* **Financial risk mitigation** -data breaches have significant financial effects, including, costs for forensic investigations, legal fees, and compensation for affected customers.
* **Business continuity** - data breaches disrupt business operations and might affect credit card transaction processes. This scenario might lead to lost revenue, operational disruptions, and reputational damage.

## PCI audit scope

PCI audit scope relates to the systems, networks, and processes in the storage, processing, or transmission of CHD and/or SAD. If Account Data is stored, processed, or transmitted in a cloud environment, PCI-DSS applies to that environment and compliance typically involves validation of the cloud environment and the usage of it.  There are five fundamental elements in scope for a PCI audit: 

* **Cardholder data environment (CDE)** - the area where CHD, and/or SAD, is stored, processed, or transmitted. It includes an organization's components that touch CHD, such as networks, and network components, databases, servers, applications, and payment terminals.
* **People** - with access to the CDE, such as employees, contractors, and third-party service providers, are in the scope of a PCI audit.
* **Processes** - that involve CHD, such as authorization, authentication, encryption and storage of account data in any format, are within the scope of a PCI audit.
* **Technology** - that processes, stores, or transmits CHD, including hardware such as printers, and multi-function devices that scan, print and fax, end-user devices such as computers, laptops workstations, administrative workstations, tablets and mobile devices, software, and other IT systems, are in the scope of a PCI audit.
* **System components** – that might not store, process, or transmit CHD/SAD but have unrestricted connectivity to system components that store, process, or transmit CHD/SAD, or that could affect the security of the CDE.

If PCI scope is minimized, organizations can effectively reduce the effects of security incidents and lower the risk of data breaches. Segmentation can be a valuable strategy for reducing the size of the PCI CDE, resulting in reduced compliance costs and overall benefits for the organization including but not limited to:

* **Cost savings** - by limiting audit scope, organizations reduce time, resources, and expenses to undergo an audit, which leads to cost savings.
* **Reduced risk exposure** - a smaller PCI audit scope reduces potential risks associated with processing, storing, and transmitting cardholder data. If the number of systems, networks, and applications subject to an audit are limited, organizations focus on securing their critical assets and reducing their risk exposure.
* **Streamlined compliance** - narrowing audit scope makes PCI-DSS compliance more manageable and streamlined. Results are more efficient audits, fewer compliance issues, and a reduced risk of incurring noncompliance penalties.
* **Improved security posture** - with a smaller subset of systems and processes, organizations allocate security resources and efforts efficiently. Outcomes are a stronger security posture, as security teams concentrate on securing critical assets and identifying vulnerabilities in a targeted and effective manner.

## Strategies to reduce PCI audit scope

An organization's definition of its CDE determines PCI audit scope. Organizations document and communicate this definition to the PCI-DSS Qualified Security Assessor (QSA) performing the audit. The QSA assesses controls for the CDE to determine compliance.
Adherence to PCI standards and use of effective risk mitigation helps businesses protect customer personal and financial data, which maintains trust in their operations. The following section outlines strategies to reduce risk in PCI audit scope. 

### Tokenization

Tokenization is a data security technique. Use tokenization to replace sensitive information, such as credit card numbers, with a unique token stored and used for transactions, without exposing sensitive data. Tokens reduce the scope of a PCI audit for the following requirements: 

* **Requirement 3** - Protect Stored Account Data
* **Requirement 4** - Protect Cardholder Data with strong Cryptography During Transmission Over Open Public Networks
* **Requirement 9** - Restrict Physical Access to Cardholder Data
* **Requirement 10** - Log and Monitor All Access to Systems Components and Cardholder Data. 

When using cloud-based processing methodologies, consider the relevant risks to sensitive data and transactions. To mitigate these risks, it's recommended you implement relevant security measures and contingency plans to protect data and prevent transaction interruptions. As a best practice, use payment tokenization as a methodology to declassify data, and potentially reduce the footprint of the CDE. With payment tokenization, sensitive data is replaced with a unique identifier that reduces the risk of data theft and limits the exposure of sensitive information in the CDE.

### Secure CDE

PCI-DSS requires organizations to maintain a secure CDE. With effectively configured CDE, businesses can mitigate their risk exposure and reduce the associated costs for both on-premises and cloud environments. This approach helps minimize the scope of a PCI audit, making it easier and more cost-effective to demonstrate compliance with the standard.

To configure Microsoft Entra ID to secure the CDE: 

* Use passwordless credentials for users: Windows Hello for Business, FIDO2 security keys, and Microsoft Authenticator app
* Use strong credentials for workload identities: certificates and managed identities for Azure resources.
  * Integrate access technologies such as VPN, remote desktop, and network access points with Microsoft Entra ID for authentication, if applicable
* Enable privileged identity management and access reviews for Microsoft Entra roles, privileged access groups and Azure resources
* Use Conditional Access policies to enforce PCI-requirement controls: credential strength, device state, and enforce them based on location, group membership, applications, and risk 
* Use modern authentication for DCE workloads
* Archive Microsoft Entra logs in security information and event management (SIEM) systems

Where applications and resources use Microsoft Entra ID for identity and access management (IAM), the Microsoft Entra tenant(s) are in scope of PCI audit, and the guidance herein is applicable. Organizations must evaluate identity and resource isolation requirements, between non-PCI and PCI workloads, to determine their best architecture.

Learn more

* [Introduction to delegated administration and isolated environments](../architecture/secure-introduction.md)
* [How to use the Microsoft Authenticator app](https://support.microsoft.com/account-billing/how-to-use-the-microsoft-authenticator-app-9783c865-0308-42fb-a519-8cf666fe0acc)
* [What are managed identities for Azure resources?](../managed-identities-azure-resources/overview.md)
* [What are access reviews?](../governance/access-reviews-overview.md)
* [What is Conditional Access?](../conditional-access/overview.md)
* [Audit logs in Microsoft Entra ID](../reports-monitoring/concept-audit-logs.md)

### Establish a responsibility matrix

PCI compliance is the responsibility of entities that process payment card transactions including but not limited to:

* Merchants
* Card service providers
* Merchant service providers
* Acquiring banks
* Payment processors
* Payment card issuers
* Hardware vendors

These entities ensure payment card transactions are processed securely and are PCI-DSS compliant. All entities involved in payment card transactions have a role to help ensure PCI compliance.

Azure PCI DSS compliance status doesn't automatically translate to PCI-DSS validation for the services you build or host on Azure. You ensure that you achieve compliance with PCI-DSS requirements. 

### Establish continuous processes to maintain compliance

Continuous processes entail ongoing monitoring and improvement of compliance posture. Benefits of continuous processes to maintain PCI compliance: 

* Reduced risk of security incidents and noncompliance
* Improved data security
* Better alignment with regulatory requirements
* Increased customer and stakeholder confidence

With ongoing processes, organizations respond effectively to changes in the regulatory environment and ever-evolving security threats. 

* **Risk assessment** – conduct this process to identify credit-card data vulnerabilities and security risks. Identify potential threats, assess the likelihood threats occurring, and evaluate the potential effects on the business. 
* **Security awareness training** - employees who handle credit card data receive regular security awareness training to clarify the importance of protecting cardholder data and the measures to do so.
* **Vulnerability management** -conduct regular vulnerability scans and penetration testing to identify network or system weaknesses exploitable by attackers.
* **Monitor and maintain access control policies** - access to credit card data is restricted to authorized individuals. Monitor access logs to identify unauthorized access attempts.
* **Incident response** – an incident response plan helps security teams take action during security incidents involving credit card data. Identify incident cause, contain the damage, and restore normal operations in a timely manner.
* **Compliance monitoring** - and auditing is conducted to ensure ongoing compliance with PCI-DSS requirements. Review security logs, conduct regular policy reviews, and ensure system components are accurately configured and maintained.

### Implement strong security for shared infrastructure

Typically, web services such as Azure, have a shared infrastructure wherein customer data might be stored on the same physical server or data storage device. This scenario creates the risk of unauthorized customers accessing data they don't own, and the risk of malicious actors targeting the shared infrastructure. Microsoft Entra security features help mitigate risks associated with shared infrastructure:

* User authentication to network access technologies that support modern authentication protocols: virtual private network (VPN), remote desktop, and network access points.
* Access control policies that enforce strong authentication methods and device compliance based on signals such as user context, device, location, and risk. 
* Conditional Access provides an identity-driven control plane and brings signals together, to make decisions, and enforce organizational policies.
* Privileged role governance - access reviews, just-in-time (JIT) activation, etc.

Learn more: [What is Conditional Access?](../conditional-access/overview.md)

### Data residency 

PCI-DSS cites no specific geographic location for credit card data storage. However, it requires cardholder data is stored securely, which might include geographic restrictions, depending on the organization's security and regulatory requirements. Different countries and regions have data protection and privacy laws. Consult with a legal or compliance advisor to determine applicable data residency requirements. 

Learn more: [Microsoft Entra ID and data residency](../fundamentals/data-residency.md)

### Third-party security risks

A non-PCI compliant third-party provider poses a risk to PCI compliance. Regularly assess and monitor third-party vendors and service providers to ensure they maintain required controls to protect cardholder data.

Microsoft Entra features and functions in **Data residency** help mitigate risks associated with third-party security. 

### Logging and monitoring

Implement accurate logging and monitoring to detect, and respond to, security incidents in a timely manner. Microsoft Entra ID helps manage PCI compliance with audit and activity logs, and reports that can be integrated with a SIEM system. Microsoft Entra ID has role -based access control (RBAC) and MFA to secure access to sensitive resources, encryption, and threat protection features to protect organizations from unauthorized access and data theft. 

Learn more: 

* [What are Microsoft Entra reports?](../reports-monitoring/overview-reports.md)
* [Microsoft Entra built-in roles](../roles/permissions-reference.md)

### Multi-application environments: host outside the CDE

PCI-DSS ensures that companies that accept, process, store, or transmit credit card information maintain a secure environment. Hosting outside the CDE introduces risks such as:

* Poor access control and identity management might result in unauthorized access to sensitive data and systems
* Insufficient logging and monitoring of security events impedes detection and response to security incidents
* Insufficient encryption and threat protection increases the risk of data theft and unauthorized access 
* Poor, or no security awareness and training for users might result in avoidable social engineering attacks, such as phishing

## Next steps

PCI-DSS requirements **3**, **4**, **9**, and **12** aren't applicable to Microsoft Entra ID, therefore there are no corresponding articles. To see all requirements, go to pcisecuritystandards.org: [Official PCI Security Standards Council Site](https://docs-prv.pcisecuritystandards.org/PCI%20DSS/Standard/PCI-DSS-v4_0.pdf).

To configure Microsoft Entra ID to comply with PCI-DSS, see the following articles. 

* [Microsoft Entra PCI-DSS guidance](pci-dss-guidance.md) (You're here)
* [Requirement 1: Install and Maintain Network Security Controls](pci-requirement-1.md)
* [Requirement 2: Apply Secure Configurations to All System Components](pci-requirement-2.md)
* [Requirement 5: Protect All Systems and Networks from Malicious Software](pci-requirement-5.md)
* [Requirement 6: Develop and Maintain Secure Systems and Software](pci-requirement-6.md)
* [Requirement 7: Restrict Access to System Components and Cardholder Data by Business Need to Know](pci-requirement-7.md)
* [Requirement 8: Identify Users and Authenticate Access to System Components](pci-requirement-8.md)
* [Requirement 10: Log and Monitor All Access to System Components and Cardholder Data](pci-requirement-10.md)
* [Requirement 11: Test Security of Systems and Networks Regularly](pci-requirement-11.md)
* [Microsoft Entra PCI-DSS Multi-Factor Authentication guidance](pci-dss-mfa.md)
