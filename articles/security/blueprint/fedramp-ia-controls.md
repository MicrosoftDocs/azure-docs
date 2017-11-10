---

title: Web Applications for FedRAMP: Identification and Authentication
description: Web Applications for FedRAMP: Identification and Authentication
services: security
documentationcenter: na
author: jomolesk
manager: mbaldwin
editor: tomsh

ms.assetid: 1033f63f-daf0-4174-a7f6-7b0f569020e2
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
    
    

# Identification and Authentication (IA)

## NIST 800-53 Control IA-1

#### Identification and Authentication Policy and Procedures

**IA-1** The organization develops, documents, and disseminates to [Assignment: organization-defined personnel or roles] an identification and authentication policy that addresses purpose, scope, roles, responsibilities, management commitment, coordination among organizational entities, and compliance; and procedures to facilitate the implementation of the identification and authentication policy and associated identification and authentication controls; and reviews and updates the current Identification and authentication policy [Assignment: organization-defined frequency]; and identification and authentication procedures [Assignment: organization-defined frequency].

**Responsibilities:** `Customer Only`

|||
|---|---|
| **Customer** | The customer's enterprise-level identification and authentication policy and procedures may be sufficient to address this control. |
| **Provider (Microsoft Azure)** | Not Applicable |


 ## NIST 800-53 Control IA-2

#### Identification and Authentication (Organizational Users)

**IA-2** The information system uniquely identifies and authenticates organizational users (or processes acting on behalf of organizational users).

**Responsibilities:** `Customer Only`

|||
|---|---|
| **Customer** | Accounts created by this Azure Blueprint have unique identifiers. Built-in accounts with non-unique identifiers are disabled or removed. |
| **Provider (Microsoft Azure)** | Not Applicable |


 ### NIST 800-53 Control IA-2 (1)

#### Identification and Authentication (Organizational Users) | Network Access to Privileged Accounts

**IA-2 (1)** The information system implements multifactor authentication for network access to privileged accounts.

**Responsibilities:** `Customer Only`

|||
|---|---|
| **Customer** | The customer is responsible for implementing multifactor authentication for network access to privileged accounts. |
| **Provider (Microsoft Azure)** | Not Applicable |


 ### NIST 800-53 Control IA-2 (2)

#### Identification and Authentication (Organizational Users) | Network Access to Non-Privileged Accounts

**IA-2 (2)** The information system implements multifactor authentication for network access to non-privileged accounts.

**Responsibilities:** `Customer Only`

|||
|---|---|
| **Customer** | The customer is responsible for implementing multifactor authentication for network access to non-privileged accounts. |
| **Provider (Microsoft Azure)** | Not Applicable |


 ### NIST 800-53 Control IA-2 (3)

#### Identification and Authentication (Organizational Users) | Local Access to Privileged Accounts

**IA-2 (3)** The information system implements multifactor authentication for local access to privileged accounts.

**Responsibilities:** `Azure Only`

|||
|---|---|
| **Customer** | Customer do not have local access to any system resources in Azure datacenters. |
| **Provider (Microsoft Azure)** | Microsoft Azure does not permit local access unless physical access is required. Local Administrator access must only be used to troubleshoot issues in instances where the member server is experiencing network issues and domain authentication is not working. <br /> Azure implements multifactor authentication for local access via access control mechanisms required for physical access to the environment. Rooms within the Azure datacenters that contain all Azure Infrastructure systems within the system boundary are restricted through various physical security mechanisms, including the requirement for corporate smart card badging access and biometric devices. Both forms of authentication are required for physical access at the ingress point to Azure datacenter colocations. |


 ### NIST 800-53 Control IA-2 (4)

#### Identification and Authentication (Organizational Users) | Local Access to Non-Privileged Accounts

**IA-2 (4)** The information system implements multifactor authentication for local access to non-privileged accounts.

**Responsibilities:** `Azure Only`

|||
|---|---|
| **Customer** | Customer do not have local access to any system resources in Azure datacenters. |
| **Provider (Microsoft Azure)** | Microsoft Azure considers all Microsoft Azure Government accounts used by Microsoft Azure Government personnel as privileged. Multifactor authentication is implemented for all Microsoft Azure Government personnel accounts using smartcards and pins, which includes local access. |


 ### NIST 800-53 Control IA-2 (5)

#### Identification and Authentication (Organizational Users) | Group Authentication

**IA-2 (5)** The organization requires individuals to be authenticated with an individual authenticator when a group authenticator is employed.

**Responsibilities:** `Customer Only`

|||
|---|---|
| **Customer** | No shared/group accounts are enabled on resources deployed by this Azure Blueprint. |
| **Provider (Microsoft Azure)** | Not Applicable |


 ### NIST 800-53 Control IA-2 (8)

#### Identification and Authentication (Organizational Users) | Network Access to Privileged Accounts - Replay Resistant

**IA-2 (8)** The information system implements replay-resistant authentication mechanisms for network access to privileged accounts.

**Responsibilities:** `Customer Only`

|||
|---|---|
| **Customer** | Access to resources deployed by this Azure Blueprint is protected from replay attacks by the built-in Kerberos functionality of Azure Active Directory, Active Directory, and the Windows operating system. In Kerberos authentication, the authenticator sent by the client contains additional data, such as an encrypted IP list, client timestamps, and ticket lifetime. If a packet is replayed, the timestamp is checked. If the timestamp is earlier than, or the same as a previous authenticator, the packet is rejected. |
| **Provider (Microsoft Azure)** | Not Applicable |


 ### NIST 800-53 Control IA-2 (9)

#### Identification and Authentication (Organizational Users) | Network Access to Non-Privileged Accounts - Replay Resistant

**IA-2 (9)** The information system implements replay-resistant authentication mechanisms for network access to non-privileged accounts.

**Responsibilities:** `Customer Only`

|||
|---|---|
| **Customer** | Access to resources deployed by this Azure Blueprint is protected from replay attacks by the built-in Kerberos functionality of Azure Active Directory, Active Directory, and the Windows operating system. In Kerberos authentication, the authenticator sent by the client contains additional data, such as an encrypted IP list, client timestamps, and ticket lifetime. If a packet is replayed, the timestamp is checked. If the timestamp is earlier than, or the same as a previous authenticator, the packet is rejected. |
| **Provider (Microsoft Azure)** | Not Applicable |


 ### NIST 800-53 Control IA-2 (11)

#### Identification and Authentication (Organizational Users) | Remote Access  - Separate Device

**IA-2 (11)** The information system implements multifactor authentication for remote access to privileged and non-privileged accounts such that one of the factors is provided by a device separate from the system gaining access and the device meets [Assignment: organization-defined strength of mechanism requirements].

**Responsibilities:** `Customer Only`

|||
|---|---|
| **Customer** | The customer is responsible for implementing multifactor authentication to access customer-deployed resources remotely. |
| **Provider (Microsoft Azure)** | Not Applicable |


 ### NIST 800-53 Control IA-2 (12)

#### Identification and Authentication (Organizational Users) | Acceptance of Piv Credentials

**IA-2 (12)** The information system accepts and electronically verifies Personal Identity Verification (PIV) credentials.

**Responsibilities:** `Customer Only`

|||
|---|---|
| **Customer** | The customer is responsible for accepting and verifying Personal Identity Verification (PIV) credentials. |
| **Provider (Microsoft Azure)** | Not Applicable |


 ## NIST 800-53 Control IA-3

#### Device Identification and Authentication

**IA-3** The information system uniquely identifies and authenticates [Assignment: organization-defined specific and/or types of devices] before establishing a [Selection (one or more): local; remote; network] connection.

**Responsibilities:** `Customer Only`

|||
|---|---|
| **Customer** | The customer is responsible for implementing device identification and authentication. |
| **Provider (Microsoft Azure)** | Not Applicable |


 ## NIST 800-53 Control IA-4.a

#### Identifier Management

**IA-4.a** The organization manages information system identifiers by receiving authorization from [Assignment: organization-defined personnel or roles] to assign an individual, group, role, or device identifier.

**Responsibilities:** `Customer Only`

|||
|---|---|
| **Customer** | The customer is responsible for managing identifiers (i.e., individuals, groups, roles, and devices) for customer resources. |
| **Provider (Microsoft Azure)** | Not Applicable |


 ## NIST 800-53 Control IA-4.b

#### Identifier Management

**IA-4.b** The organization manages information system identifiers by selecting an identifier that identifies an individual, group, role, or device.

**Responsibilities:** `Customer Only`

|||
|---|---|
| **Customer** | This Azure Blueprint prompts during deployment for customer-specified identifiers for individual accounts.  |
| **Provider (Microsoft Azure)** | Not Applicable |


 ## NIST 800-53 Control IA-4.c

#### Identifier Management

**IA-4.c** The organization manages information system identifiers by assigning the identifier to the intended individual, group, role, or device.

**Responsibilities:** `Customer Only`

|||
|---|---|
| **Customer** | The customer is responsible for managing identifiers (i.e., individuals, groups, roles, and devices) for customer resources. |
| **Provider (Microsoft Azure)** | Not Applicable |


 ## NIST 800-53 Control IA-4.d

#### Identifier Management

**IA-4.d** The organization manages information system identifiers by preventing reuse of identifiers for [Assignment: organization-defined time period].

**Responsibilities:** `Customer Only`

|||
|---|---|
| **Customer** | Active Directory and local Windows operating system accounts are assigned a unique security identifier (SID). Azure Active Directory accounts are assigned a globally unique Object ID. These unique IDs are not subject to reuse. |
| **Provider (Microsoft Azure)** | Not Applicable |


 ## NIST 800-53 Control IA-4.e

#### Identifier Management

**IA-4.e** The organization manages information system identifiers by disabling the identifier after [Assignment: organization-defined time period of inactivity].

**Responsibilities:** `Customer Only`

|||
|---|---|
| **Customer** | This Azure Blueprint implements a scheduled task for Active Directory to automatically disable accounts after 35 days of inactivity. |
| **Provider (Microsoft Azure)** | Not Applicable |


 ### NIST 800-53 Control IA-4 (4)

#### Identifier Management | Identify User Status

**IA-4 (4)** The organization manages individual identifiers by uniquely identifying each individual as [Assignment: organization-defined characteristic identifying individual status].

**Responsibilities:** `Customer Only`

|||
|---|---|
| **Customer** | Azure Active Directory and Active Directory support denoting contractors, vendors, and other user types using naming conventions applied to their identifiers. |
| **Provider (Microsoft Azure)** | Not Applicable |


 ## NIST 800-53 Control IA-5.a

#### Authenticator Management

**IA-5.a** The organization manages information system authenticators by verifying, as part of the initial authenticator distribution, the identity of the individual, group, role, or device receiving the authenticator.

**Responsibilities:** `Customer Only`

|||
|---|---|
| **Customer** | The customer is responsible for managing authenticators. |
| **Provider (Microsoft Azure)** | Not Applicable |


 ## NIST 800-53 Control IA-5.b

#### Authenticator Management

**IA-5.b** The organization manages information system authenticators by establishing initial authenticator content for authenticators defined by the organization.

**Responsibilities:** `Customer Only`

|||
|---|---|
| **Customer** | All initial authenticator content for accounts created by this Azure Blueprint meet the requirements stated in IA-5 (1) verified when specified by the customer during deployment.  |
| **Provider (Microsoft Azure)** | Not Applicable |


 ## NIST 800-53 Control IA-5.c

#### Authenticator Management

**IA-5.c** The organization manages information system authenticators by ensuring that authenticators have sufficient strength of mechanism for their intended use.

**Responsibilities:** `Customer Only`

|||
|---|---|
| **Customer** | Authenticators used by this Azure Blueprint meet requirements for strength as required by FedRAMP. |
| **Provider (Microsoft Azure)** | Not Applicable |


 ## NIST 800-53 Control IA-5.d

#### Authenticator Management

**IA-5.d** The organization manages information system authenticators by establishing and implementing administrative procedures for initial authenticator distribution, for lost/compromised or damaged authenticators, and for revoking authenticators.

**Responsibilities:** `Customer Only`

|||
|---|---|
| **Customer** | The customer is responsible for managing authenticators. |
| **Provider (Microsoft Azure)** | Not Applicable |


 ## NIST 800-53 Control IA-5.e

#### Authenticator Management

**IA-5.e** The organization manages information system authenticators by changing default content of authenticators prior to information system installation.

**Responsibilities:** `Customer Only`

|||
|---|---|
| **Customer** | All authenticators for components of this Azure Blueprint have been changed from their defaults. Authenticators are customer-specified during deployment of this solution. |
| **Provider (Microsoft Azure)** | Not Applicable |


 ## NIST 800-53 Control IA-5.f

#### Authenticator Management

**IA-5.f** The organization manages information system authenticators by establishing minimum and maximum lifetime restrictions and reuse conditions for authenticators.

**Responsibilities:** `Customer Only`

|||
|---|---|
| **Customer** | The customer is responsible for managing authenticators. |
| **Provider (Microsoft Azure)** | Not Applicable |


 ## NIST 800-53 Control IA-5.g

#### Authenticator Management

**IA-5.g** The organization manages information system authenticators by changing/refreshing authenticators [Assignment: organization-defined time period by authenticator type].

**Responsibilities:** `Customer Only`

|||
|---|---|
| **Customer** | This Azure Blueprint deploys a domain controller to which all deployed virtual machines are joined. A group policy is established and configured to implement password lifetime restrictions (60 days). |
| **Provider (Microsoft Azure)** | Not Applicable |


 ## NIST 800-53 Control IA-5.h

#### Authenticator Management

**IA-5.h** The organization manages information system authenticators by protecting authenticator content from unauthorized disclosure and modification.

**Responsibilities:** `Customer Only`

|||
|---|---|
| **Customer** | This Azure Blueprint implements Key Vault to protect authenticator content from unauthorized disclosure and modification. The following authenticators are stored in Key Vault: Azure password for deploy account, virtual machine administrator password, SQL Server service account password. |
| **Provider (Microsoft Azure)** | Not Applicable |


 ## NIST 800-53 Control IA-5.i

#### Authenticator Management

**IA-5.i** The organization manages information system authenticators by requiring individuals to take, and having devices implement, specific security safeguards to protect authenticators.

**Responsibilities:** `Customer Only`

|||
|---|---|
| **Customer** | This Azure Blueprint implements Key Vault to protect authenticator content from unauthorized disclosure and modification. The following authenticators are stored in Key Vault: Azure password for deploy account, virtual machine administrator password, SQL Server service account password. Key Vault encrypts keys and secrets (such as authentication keys, storage account keys, data encryption keys, and passwords) by using keys that are protected by hardware security modules (HSMs). |
| **Provider (Microsoft Azure)** | Not Applicable |


 ## NIST 800-53 Control IA-5.j

#### Authenticator Management

**IA-5.j** The organization manages information system authenticators by Changing authenticators for group/role accounts when membership to those accounts changes.

**Responsibilities:** `Customer Only`

|||
|---|---|
| **Customer** | No shared/group accounts are enabled on resources deployed by this Azure Blueprint. |
| **Provider (Microsoft Azure)** | Not Applicable |


 ### NIST 800-53 Control IA-5 (1).a

#### Authenticator Management | Password-Based Authentication

**IA-5 (1).a** The information system, for password-based authentication enforces minimum password complexity of [Assignment: organization-defined requirements for case sensitivity, number of characters, mix of upper-case letters, lower-case letters, numbers, and special characters, including minimum requirements for each type].

**Responsibilities:** `Customer Only`

|||
|---|---|
| **Customer** | This Azure Blueprint deploys a domain controller to which all deployed virtual machines are joined. A group policy is established and configured to enforce password complexity requirements for virtual machine local accounts and AD accounts.  |
| **Provider (Microsoft Azure)** | Not Applicable |


 ### NIST 800-53 Control IA-5 (1).b

#### Authenticator Management | Password-Based Authentication

**IA-5 (1).b** The information system, for password-based authentication enforces at least the following number of changed characters when new passwords are created: [Assignment: organization-defined number].

**Responsibilities:** `Customer Only`

|||
|---|---|
| **Customer** | The customer is responsible for employing password-based authentication within customer-deployed resources. |
| **Provider (Microsoft Azure)** | Not Applicable |


 ### NIST 800-53 Control IA-5 (1).c

#### Authenticator Management | Password-Based Authentication

**IA-5 (1).c** The information system, for password-based authentication stores and transmits only cryptographically-protected passwords.

**Responsibilities:** `Customer Only`

|||
|---|---|
| **Customer** | Azure Directory is used to ensure that all passwords are cryptographically protected while stored and transmitted. Passwords stored by Active Directory and locally on deployed Windows virtual machines are automatically hashed as part of built-in security functionality. Remote desktop authentication sessions are secured using TLS to ensure authenticators are protected when transmitted. |
| **Provider (Microsoft Azure)** | Not Applicable |


 ### NIST 800-53 Control IA-5 (1).d

#### Authenticator Management | Password-Based Authentication

**IA-5 (1).d** The information system, for password-based authentication enforces password minimum and maximum lifetime restrictions of [Assignment: organization-defined numbers for lifetime minimum, lifetime maximum].

**Responsibilities:** `Customer Only`

|||
|---|---|
| **Customer** | This Azure Blueprint deploys a domain controller to which all deployed virtual machines are joined. A group policy is established and configured to enforce restrictions on passwords that enforce minimum (1 day) and maximum (60 days) lifetime restrictions for local accounts and AD accounts. |
| **Provider (Microsoft Azure)** | Not Applicable |


 ### NIST 800-53 Control IA-5 (1).e

#### Authenticator Management | Password-Based Authentication

**IA-5 (1).e** The information system, for password-based authentication prohibits password reuse for [Assignment: organization-defined number] generations.

**Responsibilities:** `Customer Only`

|||
|---|---|
| **Customer** | This Azure Blueprint deploys a domain controller to which all deployed virtual machines are joined. A group policy is established and configured to enforce restrictions on reuse conditions (24 passwords) for local accounts and AD accounts. |
| **Provider (Microsoft Azure)** | Not Applicable |


 ### NIST 800-53 Control IA-5 (1).f

#### Authenticator Management | Password-Based Authentication

**IA-5 (1).f** The information system, for password-based authentication allows the use of a temporary password for system logons with an immediate change to a permanent password.

**Responsibilities:** `Customer Only`

|||
|---|---|
| **Customer** | Azure Active Directory is used to manage control access to the information system. Whenever an account is initially created, or a temporary password is generated, Azure Active Directory is employed to require that the user change the password at the next login. |
| **Provider (Microsoft Azure)** | Not Applicable |


 ### NIST 800-53 Control IA-5 (2).a

#### Authenticator Management | Pki-Based Authentication

**IA-5 (2).a** The information system, for PKI-based authentication validates certifications by constructing and verifying a certification path to an accepted trust anchor including checking certificate status information.

**Responsibilities:** `Customer Only`

|||
|---|---|
| **Customer** | The customer is responsible for employing PKI-based authentication within customer-deployed resources. |
| **Provider (Microsoft Azure)** | Not Applicable |


 ### NIST 800-53 Control IA-5 (2).b

#### Authenticator Management | Pki-Based Authentication

**IA-5 (2).b** The information system, for PKI-based authentication enforces authorized access to the corresponding private key.

**Responsibilities:** `Customer Only`

|||
|---|---|
| **Customer** | The customer is responsible for employing PKI-based authentication within customer-deployed resources. |
| **Provider (Microsoft Azure)** | Not Applicable |


 ### NIST 800-53 Control IA-5 (2).c

#### Authenticator Management | Pki-Based Authentication

**IA-5 (2).c** The information system, for PKI-based authentication maps the authenticated identity to the account of the individual or group.

**Responsibilities:** `Customer Only`

|||
|---|---|
| **Customer** | The customer is responsible for employing PKI-based authentication within customer-deployed resources. |
| **Provider (Microsoft Azure)** | Not Applicable |


 ### NIST 800-53 Control IA-5 (2).d

#### Authenticator Management | Pki-Based Authentication

**IA-5 (2).d** The information system, for PKI-based authentication implements a local cache of revocation data to support path discovery and validation in case of inability to access revocation information via the network.

**Responsibilities:** `Customer Only`

|||
|---|---|
| **Customer** | The customer is responsible for employing PKI-based authentication within customer-deployed resources. |
| **Provider (Microsoft Azure)** | Not Applicable |


 ### NIST 800-53 Control IA-5 (3)

#### Authenticator Management | in-Person or Trusted Third-Party Registration

**IA-5 (3)** The organization requires that the registration process to receive [Assignment: organization-defined types of and/or specific authenticators] be conducted [Selection: in person; by a trusted third party] before [Assignment: organization-defined registration authority] with authorization by [Assignment: organization-defined personnel or roles].

**Responsibilities:** `Customer Only`

|||
|---|---|
| **Customer** | The customer is responsible for registering authenticators. |
| **Provider (Microsoft Azure)** | Not Applicable |


 ### NIST 800-53 Control IA-5 (4)

#### Authenticator Management | Automated Support  for Password Strength Determination

**IA-5 (4)** The organization employs automated tools to determine if password authenticators are sufficiently strong to satisfy [Assignment: organization-defined requirements].

**Responsibilities:** `Customer Only`

|||
|---|---|
| **Customer** | User accounts deployed with this Azure Blueprint include AD and local user accounts. Both of these provide mechanisms that force compliance with established password requirements in order to create an initial password and during password changes. Azure Active Directory is the automated tool employed to determine if password authenticators are sufficiently strong to satisfy the password length, complexity, rotation, and lifetime restrictions established in IA-5 (1). Azure Active Directory ensures that password authenticator strength at creation meets these standards. Customer-specified passwords used to deploy this solution are checked to meet password strength requirements. |
| **Provider (Microsoft Azure)** | Not Applicable |


 ### NIST 800-53 Control IA-5 (6)

#### Authenticator Management | Protection of Authenticators

**IA-5 (6)** The organization protects authenticators commensurate with the security category of the information to which use of the authenticator permits access.

**Responsibilities:** `Customer Only`

|||
|---|---|
| **Customer** | The customer is responsible for protecting authenticators. |
| **Provider (Microsoft Azure)** | Not Applicable |


 ### NIST 800-53 Control IA-5 (7)

#### Authenticator Management | No Embedded Unencrypted Static Authenticators

**IA-5 (7)** The organization ensures that unencrypted static authenticators are not embedded in applications or access scripts or stored on function keys.

**Responsibilities:** `Customer Only`

|||
|---|---|
| **Customer** | There is no use of unencrypted static authenticators embedded in applications, access scripts, or function keys deployed by this Azure Blueprint. Any script or application that uses an authenticator makes a call to an Azure Key Vault container prior to each use. Access to Azure Key Vault containers is audited, which allows detection of violations of this prohibition if a service account is used to access a system without a corresponding call to the Azure Key Vault container. |
| **Provider (Microsoft Azure)** | Not Applicable |


 ### NIST 800-53 Control IA-5 (8)

#### Authenticator Management | Multiple Information System Accounts

**IA-5 (8)** The organization implements [Assignment: organization-defined security safeguards] to manage the risk of compromise due to individuals having accounts on multiple information systems.

**Responsibilities:** `Customer Only`

|||
|---|---|
| **Customer** | The customer may rely on enterprise-level security safeguards to manage risk associated with individuals having accounts on multiple systems. |
| **Provider (Microsoft Azure)** | Not Applicable |


 ### NIST 800-53 Control IA-5 (11)

#### Authenticator Management | Hardware Token-Based Authentication

**IA-5 (11)** The information system, for hardware token-based authentication, employs mechanisms that satisfy [Assignment: organization-defined token quality requirements].

**Responsibilities:** `Customer Only`

|||
|---|---|
| **Customer** | The customer is responsible for employing mechanisms to satisfy hardware token-based authentication quality requirements. |
| **Provider (Microsoft Azure)** | Not Applicable |


 ### NIST 800-53 Control IA-5 (13)

#### Authenticator Management | Expiration of Cached Authenticators

**IA-5 (13)** The information system prohibits the use of cached authenticators after [Assignment: organization-defined time period].

**Responsibilities:** `Customer Only`

|||
|---|---|
| **Customer** | No resources deployed by this Azure Blueprint are configured to allow the use of cached authenticators. Authentication to deployed virtual machines requires that an authenticator is entered at the time of authentication. |
| **Provider (Microsoft Azure)** | Not Applicable |


 ## NIST 800-53 Control IA-6

#### Authenticator Feedback

**IA-6** The information system obscures feedback of authentication information during the authentication process to protect the information from possible exploitation/use by unauthorized individuals.

**Responsibilities:** `Customer Only`

|||
|---|---|
| **Customer** | Access to resources deployed by this Azure Blueprint is through Remote Desktop and relies on Windows authentication. The default behavior of Windows authentication sessions masks passwords when input during an authentication session.  |
| **Provider (Microsoft Azure)** | Not Applicable |


 ## NIST 800-53 Control IA-7

#### Cryptographic Module Authentication

**IA-7** The information system implements mechanisms for authentication to a cryptographic module that meet the requirements of applicable federal laws, Executive Orders, directives, policies, regulations, standards, and guidance for such authentication.

**Responsibilities:** `Customer Only`

|||
|---|---|
| **Customer** | Windows authentication, remote desktop, and BitLocker are employed by this Azure Blueprint. These components can be configured to rely on FIPS 140 validated cryptographic modules. |
| **Provider (Microsoft Azure)** | Not Applicable |


 ## NIST 800-53 Control IA-8

#### Identification and Authentication (Non-Organizational Users)

**IA-8** The information system uniquely identifies and authenticates non-organizational users (or processes acting on behalf of non-organizational users).

**Responsibilities:** `Customer Only`

|||
|---|---|
| **Customer** | The customer is responsible for identifying and authenticating non-organizational users accessing customer-deployed resources. |
| **Provider (Microsoft Azure)** | Not Applicable |


 ### NIST 800-53 Control IA-8 (1)

#### Identification and Authentication (Non-Organizational Users) | Acceptance of Piv Credentials From Other Agencies

**IA-8 (1)** The information system accepts and electronically verifies Personal Identity Verification (PIV) credentials from other federal agencies.

**Responsibilities:** `Customer Only`

|||
|---|---|
| **Customer** | The customer is responsible for accepting and verifying Personal Identity Verification (PIV) credentials issued by other federal agencies. |
| **Provider (Microsoft Azure)** | Not Applicable |


 ### NIST 800-53 Control IA-8 (2)

#### Identification and Authentication (Non-Organizational Users) | Acceptance of Third-Party Credentials

**IA-8 (2)** The information system accepts only FICAM-approved third-party credentials.

**Responsibilities:** `Customer Only`

|||
|---|---|
| **Customer** | The customer is responsible for only accepting third-party credentials that have been approved by the Federal Identity, Credential, and Access Management (FICAM) Trust Framework Solutions initiative. |
| **Provider (Microsoft Azure)** | Not Applicable |


 ### NIST 800-53 Control IA-8 (3)

#### Identification and Authentication (Non-Organizational Users) | Use of Ficam-Approved Products

**IA-8 (3)** The organization employs only FICAM-approved information system components in [Assignment: organization-defined information systems] to accept third-party credentials.

**Responsibilities:** `Customer Only`

|||
|---|---|
| **Customer** | The customer is responsible for employing only Federal Identity, Credential, and Access Management (FICAM) Trust Framework Solutions initiative approved resources for accepting third-party credentials. |
| **Provider (Microsoft Azure)** | Not Applicable |


 ### NIST 800-53 Control IA-8 (4)

#### Identification and Authentication (Non-Organizational Users) | Use of Ficam-Issued Profiles

**IA-8 (4)** The information system conforms to FICAM-issued profiles.

**Responsibilities:** `Customer Only`

|||
|---|---|
| **Customer** | The customer is responsible for conforming to the profiles issued by the Federal Identity, Credential, and Access Management (FICAM) Trust Framework Solutions initiative. |
| **Provider (Microsoft Azure)** | Not Applicable |
