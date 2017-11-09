---

title: Policy requirements for PCI DSS-Compliant Environments
description: PCI DSS Requirement 12
services: security
documentationcenter: na
author: simorjay
manager: mbaldwin
editor: tomsh

ms.assetid: a79d59d8-20e3-4efe-8686-c8f4ed80e220
ms.service: security
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: na
ms.date: 10/15/2017
ms.author: frasim

---

# Policy requirements for PCI DSS-Compliant Environments  
## PCI DSS Requirement 12

**Maintain a policy that addresses information security for all personnel**

> [!NOTE] These requirements are defined by the [Payment Card Industry (PCI) Security Standards Council](https://www.pcisecuritystandards.org/pci_security/) as part of the [PCI Data Security Standard (DSS) Version 3.2](https://www.pcisecuritystandards.org/document_library?category=pcidss&document=pci_dss). Please refer to the PCI DSS for information on testing procedures and guidance for each requirement.

A strong security policy sets the security tone for the whole entity and informs personnel what is expected of them. All personnel should be aware of the sensitivity of data and their responsibilities for protecting it. For the purposes of Requirement 12, “personnel” refers to full-time and part-time employees, temporary employees, contractors and consultants who are “resident” on the entity’s site or otherwise have access to the cardholder data environment.

## PCI DSS Requirement 12.1

**12.1** Establish, publish, maintain, and disseminate a security policy.

**Responsibilities:&nbsp;&nbsp;`Customer Only`**

|||
|---|---|
| **Provider<br />(Microsoft&nbsp;Azure)** | Not applicable. |
| **Customer<br />(PCI&#8209;DSS&nbsp;Blueprint)** | Customers are responsible for establishing and maintaining an information security policy.|



### PCI DSS Requirement 12.1.1

**12.1.1** Review the security policy at least annually and update the policy when the environment changes.

**Responsibilities:&nbsp;&nbsp;`Customer Only`**

|||
|---|---|
| **Provider<br />(Microsoft&nbsp;Azure)** | Not applicable. |
| **Customer<br />(PCI&#8209;DSS&nbsp;Blueprint)** | Customers are responsible for updating their information security policy at least annually, or when there are changes to their cardholder data environment (CDE).|



## PCI DSS Requirement 12.2

**12.2** Implement a risk-assessment process that:
- Is performed at least annually and upon significant changes to the environment (for example, acquisition, merger, relocation, etc.)
- Identifies critical assets, threats, and vulnerabilities
- Results in a formal, documented analysis of risk.
- > Examples of risk-assessment methodologies include, but are not limited to, OCTAVE, ISO 27005, and NIST SP 800-30.

**Responsibilities:&nbsp;&nbsp;`Customer Only`**

|||
|---|---|
| **Provider<br />(Microsoft&nbsp;Azure)** | Not applicable. |
| **Customer<br />(PCI&#8209;DSS&nbsp;Blueprint)** | Customers are responsible for implementing a risk assessment process that addresses all threats listed in Requirement 12.2.|



## PCI DSS Requirement 12.3

**12.3** Develop usage policies for critical technologies and define proper use of these technologies.

> [!NOTE] Examples of critical technologies include, but are not limited to, remote access and wireless technologies, laptops, tablets, removable electronic media, e-mail usage and Internet usage.
Ensure these usage policies require the following.

**Responsibilities:&nbsp;&nbsp;`Customer Only`**

|||
|---|---|
| **Provider<br />(Microsoft&nbsp;Azure)** | Not applicable. |
| **Customer<br />(PCI&#8209;DSS&nbsp;Blueprint)** | Customers are responsible for creating and maintaining policies dictating proper usage, implementation, and authentication for critical technologies within their CDE.|



### PCI DSS Requirement 12.3.1

**12.3.1** Explicit approval by authorized parties

**Responsibilities:&nbsp;&nbsp;`Customer Only`**

|||
|---|---|
| **Provider<br />(Microsoft&nbsp;Azure)** | Not applicable. |
| **Customer<br />(PCI&#8209;DSS&nbsp;Blueprint)** | Customers are responsible for creating and maintaining policies dictating proper usage, implementation, and authentication for critical technologies within their CDE.|



### PCI DSS Requirement 12.3.2

**12.3.2** Authentication for use of the technology

**Responsibilities:&nbsp;&nbsp;`Customer Only`**

|||
|---|---|
| **Provider<br />(Microsoft&nbsp;Azure)** | Not applicable. |
| **Customer<br />(PCI&#8209;DSS&nbsp;Blueprint)** | Customers are responsible for creating and maintaining policies dictating proper usage, implementation, and authentication for critical technologies within their CDE.|



### PCI DSS Requirement 12.3.3

**12.3.3** A list of all such devices and personnel with access

**Responsibilities:&nbsp;&nbsp;`Customer Only`**

|||
|---|---|
| **Provider<br />(Microsoft&nbsp;Azure)** | Not applicable. |
| **Customer<br />(PCI&#8209;DSS&nbsp;Blueprint)** | Customers are responsible for creating and maintaining policies dictating proper usage, implementation, and authentication for critical technologies within their CDE.|



### PCI DSS Requirement 12.3.4

**12.3.4** A method to accurately and readily determine owner, contact information, and purpose (for example, labeling, coding, and/or inventorying of devices)

**Responsibilities:&nbsp;&nbsp;`Customer Only`**

|||
|---|---|
| **Provider<br />(Microsoft&nbsp;Azure)** | Not applicable. |
| **Customer<br />(PCI&#8209;DSS&nbsp;Blueprint)** | Customers are responsible for creating and maintaining policies dictating proper usage, implementation, and authentication for critical technologies within their CDE.|



### PCI DSS Requirement 12.3.5

**12.3.5** Acceptable uses of the technology

**Responsibilities:&nbsp;&nbsp;`Customer Only`**

|||
|---|---|
| **Provider<br />(Microsoft&nbsp;Azure)** | Not applicable. |
| **Customer<br />(PCI&#8209;DSS&nbsp;Blueprint)** | Customers are responsible for creating and maintaining policies dictating proper usage, implementation, and authentication for critical technologies within their CDE.|



### PCI DSS Requirement 12.3.6

**12.3.6** Acceptable network locations for the technologies

**Responsibilities:&nbsp;&nbsp;`Customer Only`**

|||
|---|---|
| **Provider<br />(Microsoft&nbsp;Azure)** | Not applicable. |
| **Customer<br />(PCI&#8209;DSS&nbsp;Blueprint)** | Customers are responsible for determining acceptable network locations for cloud based VMs, storage and supporting services.|



### PCI DSS Requirement 12.3.7

**12.3.7** List of company-approved products

**Responsibilities:&nbsp;&nbsp;`Customer Only`**

|||
|---|---|
| **Provider<br />(Microsoft&nbsp;Azure)** | Not applicable. |
| **Customer<br />(PCI&#8209;DSS&nbsp;Blueprint)** | Customers are responsible for determining acceptable network locations for cloud based VMs, storage and supporting services.|



### PCI DSS Requirement 12.3.8

**12.3.8** Automatic disconnect of sessions for remote-access technologies after a specific period of inactivity

**Responsibilities:&nbsp;&nbsp;`Shared`**

|||
|---|---|
| **Provider<br />(Microsoft&nbsp;Azure)** | Microsoft Azure uses Microsoft corporate AD session lock functionality, which enforces session lock outs after a period of inactivity. Network connections are terminated after 30 minutes of inactivity. |
| **Customer<br />(PCI&#8209;DSS&nbsp;Blueprint)** | Customers are responsible for creating and maintaining policies dictating proper usage, implementation, and authentication for critical technologies within their CDE.|



### PCI DSS Requirement 12.3.9

**12.3.9** Activation of remote-access technologies for vendors and business partners only when needed by vendors and business partners, with immediate deactivation after use

**Responsibilities:&nbsp;&nbsp;`Customer Only`**

|||
|---|---|
| **Provider<br />(Microsoft&nbsp;Azure)** | Not applicable. |
| **Customer<br />(PCI&#8209;DSS&nbsp;Blueprint)** | Customers are responsible for creating and maintaining policies dictating proper usage, implementation, and authentication for critical technologies within their CDE.|



### PCI DSS Requirement 12.3.10

**12.3.10** For personnel accessing cardholder data via remote-access technologies, prohibit the copying, moving, and storage of cardholder data onto local hard drives and removable electronic media, unless explicitly authorized for a defined business need.
Where there is an authorized business need, the usage policies must require the data be protected in accordance with all applicable PCI DSS Requirements.

**Responsibilities:&nbsp;&nbsp;`Customer Only`**

|||
|---|---|
| **Provider<br />(Microsoft&nbsp;Azure)** | Not applicable. |
| **Customer<br />(PCI&#8209;DSS&nbsp;Blueprint)** | Customers are responsible for ensuring that personnel accessing cardholder data via remote-access technologies are prohibited from copying, moving, and storing cardholder data on local hard drives and removable electronic media, unless explicitly authorized for a defined business need.|



## PCI DSS Requirement 12.4

**12.4** Ensure that the security policy and procedures clearly define information security responsibilities for all personnel.

**Responsibilities:&nbsp;&nbsp;`Customer Only`**

|||
|---|---|
| **Provider<br />(Microsoft&nbsp;Azure)** | Not applicable. |
| **Customer<br />(PCI&#8209;DSS&nbsp;Blueprint)** | Customers are responsible for creating and maintaining policies dictating proper usage, implementation, and authentication for critical technologies within their CDE.|



### PCI DSS Requirement 12.4.1

**12.4.1** Additional requirement for service providers only: Executive management shall establish responsibility for the protection of cardholder data and a PCI DSS compliance program to include:
- Overall accountability for maintaining PCI DSS compliance
- Defining a charter for a PCI DSS compliance program and communication to executive management 

> [!NOTE] This requirement is a best practice until January 31, 2018, after which it becomes a requirement.

**Responsibilities:&nbsp;&nbsp;`Customer Only`**

|||
|---|---|
| **Provider<br />(Microsoft&nbsp;Azure)** | Not applicable. |
| **Customer<br />(PCI&#8209;DSS&nbsp;Blueprint)** | Customers who are Service Providers are responsible for documenting their PCI compliance program.|



## PCI DSS Requirement 12.5

**12.5** Assign to an individual or team the following information security management responsibilities.

**Responsibilities:&nbsp;&nbsp;`Customer Only`**

|||
|---|---|
| **Provider<br />(Microsoft&nbsp;Azure)** | Not applicable. |
| **Customer<br />(PCI&#8209;DSS&nbsp;Blueprint)** | Customers are responsible for defining and assigning information security responsibilities to their employees.|



### PCI DSS Requirement 12.5.1

**12.5.1** Establish, document, and distribute security policies and procedures.

**Responsibilities:&nbsp;&nbsp;`Customer Only`**

|||
|---|---|
| **Provider<br />(Microsoft&nbsp;Azure)** | Not applicable. |
| **Customer<br />(PCI&#8209;DSS&nbsp;Blueprint)** | Customers are responsible for defining and assigning information security responsibilities to their employees.|



### PCI DSS Requirement 12.5.2

**12.5.2** Monitor and analyze security alerts and information, and distribute to appropriate personnel.

**Responsibilities:&nbsp;&nbsp;`Customer Only`**

|||
|---|---|
| **Provider<br />(Microsoft&nbsp;Azure)** | Not applicable. |
| **Customer<br />(PCI&#8209;DSS&nbsp;Blueprint)** | Customers are responsible for defining and assigning information security responsibilities to their employees.|



### PCI DSS Requirement 12.5.3

**12.5.3** Establish, document, and distribute security incident response and escalation procedures to ensure timely and effective handling of all situations.

**Responsibilities:&nbsp;&nbsp;`Customer Only`**

|||
|---|---|
| **Provider<br />(Microsoft&nbsp;Azure)** | Not applicable. |
| **Customer<br />(PCI&#8209;DSS&nbsp;Blueprint)** | Customers are responsible for creating and maintaining policies dictating proper usage, implementation, and authentication for critical technologies within their CDE.|



### PCI DSS Requirement 12.5.4

**12.5.4** Administer user accounts, including additions, deletions, and modifications.

**Responsibilities:&nbsp;&nbsp;`Customer Only`**

|||
|---|---|
| **Provider<br />(Microsoft&nbsp;Azure)** | Not applicable. |
| **Customer<br />(PCI&#8209;DSS&nbsp;Blueprint)** | Customers are responsible for creating and maintaining policies dictating proper usage, implementation, and authentication for critical technologies within their CDE.|



### PCI DSS Requirement 12.5.5

**12.5.5** Monitor and control all access to data.

**Responsibilities:&nbsp;&nbsp;`Customer Only`**

|||
|---|---|
| **Provider<br />(Microsoft&nbsp;Azure)** | Not applicable. |
| **Customer<br />(PCI&#8209;DSS&nbsp;Blueprint)** | Customers are responsible for creating and maintaining policies dictating proper usage, implementation, and authentication for critical technologies within their CDE.|



## PCI DSS Requirement 12.6

**12.6** Implement a formal security awareness program to make all personnel aware of the importance of cardholder data security policy and procedures.

**Responsibilities:&nbsp;&nbsp;`Customer Only`**

|||
|---|---|
| **Provider<br />(Microsoft&nbsp;Azure)** | Not applicable. |
| **Customer<br />(PCI&#8209;DSS&nbsp;Blueprint)** | Customers are responsible for creating and maintaining policies surrounding security awareness for staff with access to the CDE.|



### PCI DSS Requirement 12.6.1

**12.6.1** Educate personnel upon hire and at least annually. 

> [!NOTE] Methods can vary depending on the role of the personnel and their level of access to the cardholder data.

**Responsibilities:&nbsp;&nbsp;`Customer Only`**

|||
|---|---|
| **Provider<br />(Microsoft&nbsp;Azure)** | Not applicable. |
| **Customer<br />(PCI&#8209;DSS&nbsp;Blueprint)** | Customers are responsible for ensuring staff receive and acknowledge information security and PCI-DSS awareness training at least annually.|



### PCI DSS Requirement 12.6.2

**12.6.2** Require personnel to acknowledge at least annually that they have read and understood the security policy and procedures.

**Responsibilities:&nbsp;&nbsp;`Customer Only`**

|||
|---|---|
| **Provider<br />(Microsoft&nbsp;Azure)** | Not applicable. |
| **Customer<br />(PCI&#8209;DSS&nbsp;Blueprint)** | Customers are responsible for ensuring staff receive and acknowledge information security and PCI-DSS awareness training at least annually.|



## PCI DSS Requirement 12.7

**12.7** Screen potential personnel prior to hire to minimize the risk of attacks from internal sources. (Examples of background checks include previous employment history, criminal record, credit history, and reference checks.) 

> [!NOTE] For those potential personnel to be hired for certain positions such as store cashiers who only have access to one card number at a time when facilitating a transaction, this requirement is a recommendation only.

**Responsibilities:&nbsp;&nbsp;`Customer Only`**

|||
|---|---|
| **Provider<br />(Microsoft&nbsp;Azure)** | Not applicable. |
| **Customer<br />(PCI&#8209;DSS&nbsp;Blueprint)** | Customers are responsible for ensuring staff with access to the CDE undergo thorough background checks.|



## PCI DSS Requirement 12.8

**12.8** Maintain and implement policies and procedures to manage service providers with whom cardholder data is shared, or that could affect the security of cardholder data, as follows.

**Responsibilities:&nbsp;&nbsp;`Customer Only`**

|||
|---|---|
| **Provider<br />(Microsoft&nbsp;Azure)** | Not applicable. |
| **Customer<br />(PCI&#8209;DSS&nbsp;Blueprint)** | Customers are responsible for monitoring PCI compliance for service providers with whom cardholder data is shared, or could affect the security of the CDE. Customers must maintain a list of all service provides used within their CDE.|



### PCI DSS Requirement 12.8.1

**12.8.1** Maintain a list of service providers including a description of the service provided.


**Responsibilities:&nbsp;&nbsp;`Customer Only`**

|||
|---|---|
| **Provider<br />(Microsoft&nbsp;Azure)** | Not applicable. |
| **Customer<br />(PCI&#8209;DSS&nbsp;Blueprint)** | Customers are responsible for monitoring PCI compliance for service providers with whom cardholder data is shared, or could affect the security of the CDE. Customers must maintain a list of all service provides used within their CDE.|



### PCI DSS Requirement 12.8.2

**12.8.2** Maintain a written agreement that includes an acknowledgement that the service providers are responsible for the security of cardholder data the service providers possess or otherwise store, process or transmit on behalf of the customer, or to the extent that they could impact the security of the customer’s cardholder data environment. 

> [!NOTE] The exact wording of an acknowledgement will depend on the agreement between the two parties, the details of the service being provided, and the responsibilities assigned to each party. The acknowledgement does not have to include the exact wording provided in this requirement.

**Responsibilities:&nbsp;&nbsp;`Customer Only`**

|||
|---|---|
| **Provider<br />(Microsoft&nbsp;Azure)** | Not applicable. |
| **Customer<br />(PCI&#8209;DSS&nbsp;Blueprint)** | Customers are responsible for maintaining written agreements with service providers acknowledging the responsibility for maintaining security of cardholder data.|



### PCI DSS Requirement 12.8.3

**12.8.3** Ensure there is an established process for engaging service providers including proper due diligence prior to engagement.

**Responsibilities:&nbsp;&nbsp;`Customer Only`**

|||
|---|---|
| **Provider<br />(Microsoft&nbsp;Azure)** | Not applicable. |
| **Customer<br />(PCI&#8209;DSS&nbsp;Blueprint)** | Customers are responsible for ensuring there is an established process for engaging service providers including proper due diligence prior to engagement.|



### PCI DSS Requirement 12.8.4

**12.8.4** Maintain a program to monitor service providers’ PCI DSS compliance status at least annually.

**Responsibilities:&nbsp;&nbsp;`Customer Only`**

|||
|---|---|
| **Provider<br />(Microsoft&nbsp;Azure)** | Not applicable. |
| **Customer<br />(PCI&#8209;DSS&nbsp;Blueprint)** | Customers is responsible for maintaining a program to monitor service providers’ PCI DSS compliance status at least annually.|



### PCI DSS Requirement 12.8.5

**12.8.5** Maintain information about which PCI DSS requirements are managed by each service provider, and which are managed by the entity.

**Responsibilities:&nbsp;&nbsp;`Customer Only`**

|||
|---|---|
| **Provider<br />(Microsoft&nbsp;Azure)** | Not applicable. |
| **Customer<br />(PCI&#8209;DSS&nbsp;Blueprint)** | Customers are responsible for retaining a copy of the [Responsibility Summary Matrix](https://aka.ms/pciblueprintcrm32), which outlines the PCI DSS requirements that are the responsibility of the customer and those which are the responsibility of Microsoft Azure.|



## PCI DSS Requirement 12.9

**12.9** Additional requirement for service providers only: Service providers acknowledge in writing to customers that they are responsible for the security of cardholder data the service provider possesses or otherwise stores, processes, or transmits on behalf of the customer, or to the extent that they could impact the security of the customer’s cardholder data environment. 

> [!NOTE] The exact wording of an acknowledgement will depend on the agreement between the two parties, the details of the service being provided, and the responsibilities assigned to each party. The acknowledgement does not have to include the exact wording provided in this requirement.

**Responsibilities:&nbsp;&nbsp;`Customer Only`**

|||
|---|---|
| **Provider<br />(Microsoft&nbsp;Azure)** | Not applicable. |
| **Customer<br />(PCI&#8209;DSS&nbsp;Blueprint)** | Customers which are Service Providers are responsible for acknowledging their responsibilities for maintaining PCI compliance. |



## PCI DSS Requirement 12.10

**12.10** Implement an incident response plan. Be prepared to respond immediately to a system breach.

**Responsibilities:&nbsp;&nbsp;`Customer Only`**

|||
|---|---|
| **Provider<br />(Microsoft&nbsp;Azure)** | Not applicable. |
| **Customer<br />(PCI&#8209;DSS&nbsp;Blueprint)** | Customers are responsible for developing IR plans and testing that considers any customer controls relating to shared touch points and any customer applications leveraging Azure’s infrastructure. It is the customer’s responsibility to provide accurate contact information to Azure in the event an incident needs to be reported to them which may impact their application or data.|



### PCI DSS Requirement 12.10.1

**12.10.1** Create the incident response plan to be implemented in the event of system breach. Ensure the plan addresses the following, at a minimum:
- Roles, responsibilities, and communication and contact strategies in the event of a compromise including notification of the payment brands, at a minimum
- Specific incident response procedures
- Business recovery and continuity procedures
- Data backup processes
- Analysis of legal requirements for reporting compromises
- Coverage and responses of all critical system components
- Reference or inclusion of incident response procedures from the payment brands

**Responsibilities:&nbsp;&nbsp;`Customer Only`**

|||
|---|---|
| **Provider<br />(Microsoft&nbsp;Azure)** | Not applicable. |
| **Customer<br />(PCI&#8209;DSS&nbsp;Blueprint)** | Customers are responsible for developing IR plans and testing that considers any customer controls relating to shared touch points and any customer applications leveraging Azure’s infrastructure. It is the customer’s responsibility to provide accurate contact information to Azure in the event an incident needs to be reported to them which may impact their application or data.|



### PCI DSS Requirement 12.10.2

**12.10.2** Review and test the plan, including all elements listed in Requirement 12.10.1, at least annually.


**Responsibilities:&nbsp;&nbsp;`Customer Only`**

|||
|---|---|
| **Provider<br />(Microsoft&nbsp;Azure)** | Not applicable. |
| **Customer<br />(PCI&#8209;DSS&nbsp;Blueprint)** | Customers are responsible for developing IR plans and testing that considers any customer controls relating to shared touch points and any customer applications leveraging Azure’s infrastructure. It is the customer’s responsibility to provide accurate contact information to Azure in the event an incident needs to be reported to them which may impact their application or data.|



### PCI DSS Requirement 12.10.3

**12.10.3** Designate specific personnel to be available on a 24/7 basis to respond to alerts.

**Responsibilities:&nbsp;&nbsp;`Customer Only`**

|||
|---|---|
| **Provider<br />(Microsoft&nbsp;Azure)** | Not applicable. |
| **Customer<br />(PCI&#8209;DSS&nbsp;Blueprint)** | Customers are responsible for developing IR plans and testing that considers any customer controls relating to shared touch points and any customer applications leveraging Azure’s infrastructure. It is the customer’s responsibility to provide accurate contact information to Azure in the event an incident needs to be reported to them which may impact their application or data.|



### PCI DSS Requirement 12.10.4

**12.10.4** Provide appropriate training to staff with security breach response responsibilities.

**Responsibilities:&nbsp;&nbsp;`Customer Only`**

|||
|---|---|
| **Provider<br />(Microsoft&nbsp;Azure)** | Not applicable. |
| **Customer<br />(PCI&#8209;DSS&nbsp;Blueprint)** | Customers are responsible for developing IR plans and testing that considers any customer controls relating to shared touch points and any customer applications leveraging Azure’s infrastructure. It is the customer’s responsibility to provide accurate contact information to Azure in the event an incident needs to be reported to them which may impact their application or data.|



### PCI DSS Requirement 12.10.5

**12.10.5** Include alerts from security monitoring systems, including but not limited to intrusion-detection, intrusion-prevention, firewalls, and file-integrity monitoring systems.

**Responsibilities:&nbsp;&nbsp;`Customer Only`**

|||
|---|---|
| **Provider<br />(Microsoft&nbsp;Azure)** | Not applicable. |
| **Customer<br />(PCI&#8209;DSS&nbsp;Blueprint)** | Customers are responsible for developing IR plans and testing that considers any customer controls relating to shared touch points and any customer applications leveraging Azure’s infrastructure. It is the customer’s responsibility to provide accurate contact information to Azure in the event an incident needs to be reported to them which may impact their application or data.|



### PCI DSS Requirement 12.10.6

**12.10.6** Develop a process to modify and evolve the incident response plan according to lessons learned and to incorporate industry developments.

**Responsibilities:&nbsp;&nbsp;`Customer Only`**

|||
|---|---|
| **Provider<br />(Microsoft&nbsp;Azure)** | Not applicable. |
| **Customer<br />(PCI&#8209;DSS&nbsp;Blueprint)** | Customers are responsible for developing IR plans and testing that considers any customer controls relating to shared touch points and any customer applications leveraging Azure’s infrastructure. It is the customer’s responsibility to provide accurate contact information to Azure in the event an incident needs to be reported to them which may impact their application or data.|



## PCI DSS Requirement 12.11

**12.11** **Additional requirement for service providers only:** Perform reviews at least quarterly to confirm personnel are following
security policies and operational procedures.
Reviews must cover the following processes:
- Daily log reviews
- Firewall rule-set reviews
- Applying configuration standards to new systems
- Responding to security alerts
- Change management processes 

> [!NOTE] This requirement is a best practice until January 31, 2018, after which it becomes a requirement.


**Responsibilities:&nbsp;&nbsp;`Customer Only`**

|||
|---|---|
| **Provider<br />(Microsoft&nbsp;Azure)** | Not applicable. |
| **Customer<br />(PCI&#8209;DSS&nbsp;Blueprint)** | Customers who are service providers are responsible for documenting their reviews of processes for confirming PCI compliance control performance.|



### PCI DSS Requirement 12.11.1

**12.11.1** Additional requirement for service providers only: Maintain documentation of quarterly review process to include:
- Documenting results of the reviews
- Review and sign-off of results by personnel assigned responsibility for the PCI DSS compliance program 

> [!NOTE] This requirement is a best practice until January 31, 2018, after which it becomes a requirement.


**Responsibilities:&nbsp;&nbsp;`Customer Only`**

|||
|---|---|
| **Provider<br />(Microsoft&nbsp;Azure)** | Not applicable. |
| **Customer<br />(PCI&#8209;DSS&nbsp;Blueprint)** | Customers who are service providers are responsible for documenting their reviews of processes for confirming PCI compliance control performance.|




