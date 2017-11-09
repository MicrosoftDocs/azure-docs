---

title: Access requirements for PCI DSS-compliant environments
description: PCI DSS Requirement 7
services: security
documentationcenter: na
author: simorjay
manager: mbaldwin
editor: tomsh

ms.assetid: ac3afee9-0471-465d-a115-67488a1635a6
ms.service: security
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: na
ms.date: 10/15/2017
ms.author: frasim

---

# Access requirements for PCI DSS-compliant environments 
## PCI DSS Requirement 7

**Restrict access to cardholder data by business need to know**

> [!NOTE] These requirements are defined by the [Payment Card Industry (PCI) Security Standards Council](https://www.pcisecuritystandards.org/pci_security/) as part of the [PCI Data Security Standard (DSS) Version 3.2](https://www.pcisecuritystandards.org/document_library?category=pcidss&document=pci_dss). Please refer to the PCI DSS for information on testing procedures and guidance for each requirement.

To ensure critical data can only be accessed by authorized personnel, systems and processes must be in place to limit access based on need to know and according to job responsibilities.

“Need to know” is when access rights are granted to only the least amount of data and privileges needed to perform a job.

## PCI DSS Requirement 7.1

**7.1** Limit access to system components and cardholder data to only those individuals whose job requires such access.

**Responsibilities:&nbsp;&nbsp;`Shared`**

|||
|---|---|
| **Provider<br />(Microsoft&nbsp;Azure)** | Azure enforces existing ISMS policies regarding Azure personnel access to Azure system components, verification of access control effectiveness, providing Just-In-Time administrative access, revoking access when no longer needed, and ensuring staff accessing the Azure platform environment have a business need. Azure access to customer environments is highly restricted and only allowed with customer approval.<br /><br />Procedures have been established to restrict physical access to the data center to authorized employees, vendors, contractors, and visitors. Security verification and check-in are required for personnel requiring temporary access to the interior data center facility. Physical access logs are reviewed every quarter by Azure teams. |
| **Customer<br />(PCI&#8209;DSS&nbsp;Blueprint)** | Customers are responsible for limiting access to system components and cardholder data to only those individuals whose job requires such access. This includes limiting and restricting access to the Azure Management Portal as well as specifying accounts or roles with permission to create, modify, or delete PaaS services.|



### PCI DSS Requirement 7.1.1

**7.1.1** Define access needs for each role, including:
- System components and data resources that each role needs to access for their job function
- Level of privilege required (for example, user, administrator, etc.) for accessing resources

**Responsibilities:&nbsp;&nbsp;`Customer Only`**

|||
|---|---|
| **Provider<br />(Microsoft&nbsp;Azure)** | Not applicable. |
| **Customer<br />(PCI&#8209;DSS&nbsp;Blueprint)** | Customers are responsible for defining and documenting a User ID approval process, defining least privileges, restricting access to cardholder data, using unique IDs, providing separation of duties, and revoking user access when no longer necessary.|



### PCI DSS Requirement 7.1.2

**7.1.2** Restrict access to privileged user IDs to least privileges necessary to perform job responsibilities.

**Responsibilities:&nbsp;&nbsp;`Shared`**

|||
|---|---|
| **Provider<br />(Microsoft&nbsp;Azure)** | Microsoft Azure has adopted applicable corporate and organizational security policies, including an Information Security Policy. The policies have been approved, published and communicated to Windows Azure. The Microsoft Azure Information Security Policy requires that access to Microsoft Azure assets be granted based on business justification, with the asset owner's authorization and based on "need-to-know" and "least-privilege" principles. The policy also addresses requirements for access management lifecycle including access provisioning, access authorization, authentication removal of access rights, and periodic access reviews. |
| **Customer<br />(PCI&#8209;DSS&nbsp;Blueprint)** | The Contoso Webstore creates three accounts during deployment: admin, sqladmin, and edna (the default user logged into the web app during demo execution). User roles are limited to duties based on the documented demo scenario.|



### PCI DSS Requirement 7.1.3

**7.1.3** Assign access based on individual personnel’s job classification and function.

**Responsibilities:&nbsp;&nbsp;`Customer Only`**

|||
|---|---|
| **Provider<br />(Microsoft&nbsp;Azure)** | Not applicable. |
| **Customer<br />(PCI&#8209;DSS&nbsp;Blueprint)** | The Contoso Webstore creates three accounts during deployment: admin, sqladmin, and edna (the default user logged into the web app during demo execution). User roles are limited to duties based on the documented demo scenario.|



### PCI DSS Requirement 7.1.4

**7.1.4** Require documented approval by authorized parties specifying required privileges.

**Responsibilities:&nbsp;&nbsp;`Customer Only`**

|||
|---|---|
| **Provider<br />(Microsoft&nbsp;Azure)** | Not applicable. |
| **Customer<br />(PCI&#8209;DSS&nbsp;Blueprint)** | Customers are responsible for limiting access to system components and cardholder data to only those individuals whose job requires such access. This includes limiting and restricting access to the Azure Management Portal as well as specifying accounts or roles with permission to create, modify, or delete PaaS services.|



## PCI DSS Requirement 7.2

**7.2** Establish an access control system for systems components that restricts access based on a user’s need to know, and is set to “deny all” unless specifically allowed.
This access control system must include the following:
- 7.2.1 Coverage of all system components.
- 7.2.2 Assignment of privileges to individuals based on job classification and function.
- 7.2.3 Default “deny-all” setting.

**Responsibilities:&nbsp;&nbsp;`Customer Only`**

|||
|---|---|
| **Provider<br />(Microsoft&nbsp;Azure)** | Not applicable. |
| **Customer<br />(PCI&#8209;DSS&nbsp;Blueprint)** | The Contoso Webstore uses Azure Active Directory to restrict access to designated users only. For more information, see [PCI Guidance - Identity Management](payment-processing-blueprint.md#identity-management).|



## PCI DSS Requirement 7.3

**7.3** Ensure that security policies and operational procedures for restricting access to cardholder data are documented, in use, and known to all affected parties.

**Responsibilities:&nbsp;&nbsp;`Customer Only`**

|||
|---|---|
| **Provider<br />(Microsoft&nbsp;Azure)** | Not applicable. |
| **Customer<br />(PCI&#8209;DSS&nbsp;Blueprint)** | The Contoso Webstore documentation provides a use case and a description regarding who uses CHD, and how CHD is used.|




