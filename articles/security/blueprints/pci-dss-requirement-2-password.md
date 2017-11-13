---

title: Azure Payment Processing Blueprint - Password requirements
description: PCI DSS Requirement 2
services: security
documentationcenter: na
author: simorjay
manager: mbaldwin
editor: tomsh

ms.assetid: 0df24870-6156-4415-a608-dd385b6ae807
ms.service: security
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: na
ms.date: 10/15/2017
ms.author: frasim

---

# Password requirements for PCI DSS-compliant environments 
## PCI DSS Requirement 2

**Do not use vendor-supplied defaults for system passwords and other security parameters**

> [!NOTE]
> These requirements are defined by the [Payment Card Industry (PCI) Security Standards Council](https://www.pcisecuritystandards.org/pci_security/) as part of the [PCI Data Security Standard (DSS) Version 3.2](https://www.pcisecuritystandards.org/document_library?category=pcidss&document=pci_dss). Please refer to the PCI DSS for information on testing procedures and guidance for each requirement.

Malicious individuals (external and internal to an entity) often use vendor default passwords and other vendor default settings to compromise systems. These passwords and settings are well known by hacker communities and are easily determined via public information.

## PCI DSS Requirement 2.1
 
**2.1** Always change vendor-supplied defaults and remove or disable unnecessary default accounts **before** installing a system on the network.
This applies to ALL default passwords, including but not limited to those used by operating systems, software that provides security services, application and system accounts, point-of-sale (POS) terminals, Simple Network Management Protocol (SNMP) community strings, etc.

**Responsibilities:&nbsp;&nbsp;`Shared`**

|||
|---|---|
| **Provider<br />(Microsoft&nbsp;Azure)** | Microsoft Azure Active Directory password policy requirements are enforced for the new passwords supplied by customers within the AADUX portal. Customer-initiated self-service password changes require validation of prior password. Administrator reset passwords are required to be changed upon subsequent login. |
| **Customer<br />(PCI&#8209;DSS&nbsp;Blueprint)** | The Contoso Webstore requires users to use set strong passwords for all users. No sample or guest accounts are enabled in the demo.<br /><br />Wireless and SNMP are not implemented in the solution.|



### PCI DSS Requirement 2.1.1

**2.1.1** For wireless environments connected to the cardholder data environment or transmitting cardholder data, change ALL wireless vendor defaults at installation, including but not limited to default wireless encryption keys, passwords, and SNMP community strings.

**Responsibilities:&nbsp;&nbsp;`Customer Only`**

|||
|---|---|
| **Provider<br />(Microsoft&nbsp;Azure)** | Not applicable. |
| **Customer<br />(PCI&#8209;DSS&nbsp;Blueprint)** | Wireless and SNMP are not implemented in the solution.|



## PCI DSS Requirement 2.2

**2.2** Develop configuration standards for all system components. Assure that these standards address all known security vulnerabilities and are consistent with industry-accepted system hardening standards.
Sources of industry-accepted system hardening standards may include, but are not limited to:
- Center for Internet Security (CIS)
- International Organization for Standardization (ISO)
- SysAdmin Audit Network Security (SANS) Institute
- National Institute of Standards Technology (NIST)

**Responsibilities:&nbsp;&nbsp;`Shared`**

|||
|---|---|
| **Provider<br />(Microsoft&nbsp;Azure)** | For Microsoft Azure, the OSSC Technical Security Services team develops security configuration standards for systems in the Microsoft Azure environment that are consistent with industry-accepted hardening standards. These configurations are documented in system baselines and relevant configuration changes are communicated to impacted teams (e.g., IPAK team). Procedures are implemented to monitor for compliance against the security configuration standards. The security configuration standards for systems in the Microsoft Azure environment are consistent with industry-accepted hardening standards and are reviewed at least annually. |
| **Customer<br />(PCI&#8209;DSS&nbsp;Blueprint)** | The Contoso Webstore provides hardening of all services in scope for the cardholder data environment (CDE). <br /><br />The Contoso Webstore also deploys the [Azure Security Center](https://azure.microsoft.com/services/security-center/), which provides a centralized view of the security state of all your Azure resources. At a glance, you can verify that the appropriate security controls are in place and configured correctly, and you can quickly identify any resources that require attention.<br /><br />The Contoso Webstore utilizes Operations Management Suite to log all system changes. [Operations Management Suite (OMS)](/azure/operations-management-suite/) provides extensive logging of changes. Changes can be reviewed and verified for accuracy. For more specific guidance, see [PCI Guidance - Operations Management Suite](payment-processing-blueprint.md#logging-and-auditing).|



### PCI DSS Requirement 2.2.1

**2.2.1** Implement only one primary function per server to prevent functions that require different security levels from co-existing on the same server. (For example, web servers, database servers, and DNS should be implemented on separate servers.) 

> [!NOTE]
> Where virtualization technologies are in use, implement only one primary function per virtual system component.

**Responsibilities:&nbsp;&nbsp;`Customer Only`**

|||
|---|---|
| **Provider<br />(Microsoft&nbsp;Azure)** | Not applicable. |
| **Customer<br />(PCI&#8209;DSS&nbsp;Blueprint)** | Contoso Webstore services are deployed as PaaS services. All services are isolated, and segmented using network segmentation.<br /><br />The Contoso Webstore also uses an [App Service Environment (ASE)](/azure/app-service-web/app-service-app-service-environment-intro) to enforce key practices. For more information, see [PCI Guidance - App Service Environment](payment-processing-blueprint.md#app-service-environment).|



### PCI DSS Requirement 2.2.2

**2.2.2** Enable only necessary services, protocols, daemons, etc., as required for the function of the system.

**Responsibilities:&nbsp;&nbsp;`Shared`**

|||
|---|---|
| **Provider<br />(Microsoft&nbsp;Azure)** | Microsoft Azure software and hardware configurations are reviewed at least quarterly to identify and eliminate any unnecessary functions, ports, protocols and services. |
| **Customer<br />(PCI&#8209;DSS&nbsp;Blueprint)** | Contoso Webstore services are deployed as PaaS services. All services are isolated, and segmented using network segmentation.<br /><br />The Contoso Webstore also uses an [App Service Environment (ASE)](/azure/app-service-web/app-service-app-service-environment-intro) to enforce key practices. For more information, see [PCI Guidance - App Service Environment](payment-processing-blueprint.md#app-service-environment).|



### PCI DSS Requirement 2.2.3

**2.2.3** Implement additional security features for any required services, protocols, or daemons that are considered to be insecure. 

> [!NOTE]
> Where SSL/early TLS is used, the
requirements in Appendix A2 must be
completed.


**Responsibilities:&nbsp;&nbsp;`Customer Only`**

|||
|---|---|
| **Provider<br />(Microsoft&nbsp;Azure)** | Not applicable. |
| **Customer<br />(PCI&#8209;DSS&nbsp;Blueprint)** | Contoso Webstore services are deployed as PaaS services. All services are isolated, and segmented using network segmentation. The deployment also provides hardening of all services in scope of the CDE. <br /><br />The Contoso Webstore also deploys the [Azure Security Center](https://azure.microsoft.com/services/security-center/), which provides a centralized view of the security state of all your Azure resources. At a glance, you can verify that the appropriate security controls are in place and configured correctly, and you can quickly identify any resources that require attention.<br /><br />The Contoso Webstore also uses an [App Service Environment (ASE)](/azure/app-service-web/app-service-app-service-environment-intro) to enforce key practices. For more information, see [PCI Guidance - App Service Environment](payment-processing-blueprint.md#app-service-environment).|



### PCI DSS Requirement 2.2.4

**2.2.4** Configure system security parameters to prevent misuse.

**Responsibilities:&nbsp;&nbsp;`Shared`**

|||
|---|---|
| **Provider<br />(Microsoft&nbsp;Azure)** | Azure ensures only authorized personnel are able to configure Azure platform security controls, using multi-factor access controls and a documented business need. |
| **Customer<br />(PCI&#8209;DSS&nbsp;Blueprint)** | The Contoso Webstore utilizes AAD and AD RBAC to manage security parameters are deployed correctly. For more information, see [PCI Guidance - Identity Management](payment-processing-blueprint.md#identity-management).|



### PCI DSS Requirement 2.2.5

**2.2.5** Remove all unnecessary functionality, such as scripts, drivers, features, subsystems, file systems, and unnecessary web servers.

**Responsibilities:&nbsp;&nbsp;`Customer Only`**

|||
|---|---|
| **Provider<br />(Microsoft&nbsp;Azure)** | Not applicable. |
| **Customer<br />(PCI&#8209;DSS&nbsp;Blueprint)** | The Contoso Webstore provides documentation on how boundaries are established. Contoso's threat model and data flow diagram illustrate all services used and controls enabled.|



## PCI DSS Requirement 2.3

**2.3** Encrypt all non-console administrative access using strong cryptography. 

> [!NOTE]
> Where SSL/early TLS is used, the requirements in Appendix A2 must be completed.

**Responsibilities:&nbsp;&nbsp;`Shared`**

|||
|---|---|
| **Provider<br />(Microsoft&nbsp;Azure)** | Microsoft Azure ensures the use of strong cryptography is enforced when accessing the hypervisor infrastructure. Microsoft Azure also ensures that customers using the Microsoft Azure Management Portal are able to access their service/IaaS consoles with strong cryptography. |
| **Customer<br />(PCI&#8209;DSS&nbsp;Blueprint)** | The Contoso Webstore shows how strong passwords can be implemented in a solution; additionally, all tests can be performed to verify that encryption is implemented throughout the solution.<br /><br />The Contoso Webstore also uses an [App Service Environment (ASE)](/azure/app-service-web/app-service-app-service-environment-intro) to enforce key practices. For more information, see [PCI Guidance - App Service Environment](payment-processing-blueprint.md#app-service-environment).|



## PCI DSS Requirement 2.4

**2.4** Maintain an inventory of system components that are in scope for PCI DSS.

**Responsibilities:&nbsp;&nbsp;`Customer Only`**

|||
|---|---|
| **Provider<br />(Microsoft&nbsp;Azure)** | Not applicable. |
| **Customer<br />(PCI&#8209;DSS&nbsp;Blueprint)** | The Contoso Webstore demo PaaS solution inventory can be reviewed in the provided documentation. For more information, see [PCI Guidance - Pre-Installed OMS Solutions](payment-processing-blueprint.md#oms-solutions).|



## PCI DSS Requirement 2.5

**2.5** Ensure that security policies and operational procedures for managing vendor defaults and other security parameters are documented, in use, and known to all affected parties.

**Responsibilities:&nbsp;&nbsp;`Customer Only`**

|||
|---|---|
| **Provider<br />(Microsoft&nbsp;Azure)** | Not applicable. |
| **Customer<br />(PCI&#8209;DSS&nbsp;Blueprint)** | The Contoso Webstore provides documentation that provides insight into security parameters, and documents service elements. |



## PCI DSS Requirement 2.6

**2.6** Shared hosting providers must protect each entity’s hosted environment and cardholder data. These providers must meet specific requirements as detailed in *Appendix A: Additional PCI DSS Requirements for Shared Hosting Providers.*

**Responsibilities:&nbsp;&nbsp;`Not Applicable`**

|||
|---|---|
| **Provider<br />(Microsoft&nbsp;Azure)** | Not applicable. Microsoft Azure is not a shared hosting provider. |
| **Customer<br />(PCI&#8209;DSS&nbsp;Blueprint)** | Not applicable. Microsoft Azure is not a shared hosting provider.|




