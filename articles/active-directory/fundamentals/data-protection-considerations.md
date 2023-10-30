---
title: Data protection considerations
description: Learn how services store and retrieve Microsoft Entra object data through an RBAC authorization layer.
services: active-directory
author: janicericketts
manager: martinco
ms.service: active-directory
ms.workload: identity
ms.subservice: fundamentals
ms.topic: conceptual
ms.date: 01/31/2023
ms.author: jricketts
ms.reviewer: jricketts
ms.custom: "it-pro"
ms.collection:
---

# Data protection considerations 

The following diagram illustrates how services store and retrieve Microsoft Entra object data through a role-based access control (RBAC) authorization layer. This layer calls the internal directory data access layer, ensuring the user's data request is permitted: 

   ![Diagram of services storing and retrieving Microsoft Entra object data.](./media/data-protection-considerations/isolated-tenants.PNG)

**Microsoft Entra Internal Interfaces Access**: Service-to-service communication with other Microsoft services, such as Microsoft 365 use Microsoft Entra ID interfaces, which authorize the service's callers using client certificates.  

**Microsoft Entra External Interfaces Access**: Microsoft Entra external interface helps prevent data leakage by using RBAC. When a security principal, such as a user, makes an access request to read information through Microsoft Entra ID interfaces, a security token must accompany the request. The token contains claims about the principal making the request. 

The security tokens are issued by the Microsoft Entra authentication Services. Information about the user’s existence, enabled state, and role is used by the authorization system to decide whether the requested access to the target tenant is authorized for this user in this session.  

**Application Access**: Because applications can access the Application Programming Interfaces (APIs) without user context, the access check includes information about the user’s application and the scope of access requested, for example read only, read/write, etc. Many applications use OpenID Connect or OAuth to obtain tokens to access the directory on behalf of the user. These applications must be explicitly granted access to the directory or they won't receive a token from Microsoft Entra authentication Service, and they access data from the granted scope. 

**Auditing**: Access is audited. For example, authorized actions such as create user and password reset create an audit trail that can be used by a tenant administrator to manage compliance efforts or investigations. Tenant administrators can generate audit reports by using the Microsoft Entra audit API.  

Learn more: [Audit logs in Microsoft Entra ID](../reports-monitoring/concept-audit-logs.md)

**Tenant Isolation**: Enforcement of security in Microsoft Entra multi-tenant environment helps achieve two primary goals:  

* Prevent data leakage and access across tenants: Data belonging to Tenant 1 can't be obtained by users in Tenant 2 without explicit authorization by Tenant 1.  
* Resource access isolation across tenants: Operations performed by Tenant 1 can't affect access to resources for Tenant 2.  

## Tenant isolation

The following information outlines tenant isolation.

* The service secures tenants using RBAC policy to ensure data isolation. 
* To enable access to a tenant, a principal, for example a user or application, needs to be able to authenticate against Microsoft Entra ID to obtain context and has explicit permissions defined in the tenant. If a principal isn't authorized in the tenant, the resulting token won't carry permissions, and the RBAC system rejects requests in this context.  
* RBAC ensures access to a tenant is performed by a security principal authorized in the tenant. Access across tenants is possible when a tenant administrator creates a security principal representation in the same tenant (for example, provisioning a guest user account using B2B collaboration), or when a tenant administrator creates a policy to enable a trust relationship with another tenant. For example, a cross-tenant access policy to enable B2B Direct Connect. Each tenant is an isolation boundary; existence in one tenant doesn't equate existence in another tenant unless the administrator allows it.  
* Microsoft Entra data for multiple tenants is stored in the same physical server and drive for a given partition. Isolation is ensured because access to the data is protected by the RBAC authorization system. 
* A customer application can't access Microsoft Entra ID without needed authentication. The request is rejected if not accompanied by credentials as part of the initial connection negotiation process. This dynamic prevents unauthorized access to a tenant by neighboring tenants. Only user credential’s token, or Security Assertion Markup Language (SAML) token, is brokered with a federated trust. Therefore, it's validated by Microsoft Entra ID, based on the shared keys configured by the Microsoft Entra tenant Global Administrator.  
* Because there's no application component that can execute from the Core Store, it's not possible for one tenant to forcibly breach the integrity of a neighboring tenant.  

## Data security

**Encryption in Transit**: To assure data security, directory data in Microsoft Entra ID is signed and encrypted while in transit between data centers in a scale unit. The data is encrypted and unencrypted by the Microsoft Entra Core Store tier, which resides in secured server hosting areas of the associated Microsoft data centers.  

Customer-facing web services are secured with the Transport Layer Security (TLS) protocol.  

**Secret Storage**: Microsoft Entra service back-end uses encryption to store sensitive material for service use, such as certificates, keys, credentials, and hashes using Microsoft proprietary technology. The store used depends on the service, the operation, the scope of the secret (user-wide or tenant-wide), and other requirements.  

These stores are operated by a security-focused group via established automation and workflows, including certificate request, renewal, revocation, and destruction. 

There's activity auditing related to these stores/workflows/processes, and there is no standing access. Access is request- and approval-based, and for a limited amount of time.  

For more information about Secret encryption at rest, see the following table. 

**Algorithms**: The following table lists the minimum cryptography algorithms used by Microsoft Entra components. As a cloud service, Microsoft reassesses and improves the cryptography, based on security research findings, internal security reviews, key strength against hardware evolution, etc. 

|Data/scenario|Cryptography algorithm|
|---|---|
|Password hash sync</br>Cloud account passwords|Hash: Password Key Derivation Function 2 (PBKDF2), using HMAC-SHA256 @ 1000 iterations |
|Directory in transit between data centers|AES-256-CTS-HMAC-SHA1-96</br>TLS_ECDHE_ECDSA_WITH_AES_256_GCM_SHA384 |
|Pass-through authentication user credential flow|RSA 2048-Public/Private key pair </br> Learn more: [Microsoft Entra pass-through authentication security deep dive](../hybrid/connect/how-to-connect-pta-security-deep-dive.md)|
|Self-service password reset password writeback with Microsoft Entra Connect: Cloud to on-premises communication |RSA 2048 Private/Public key pair</br>AES_GCM (256-bits key, 96-bits IV size)|
|Self-service password reset: Answers to security questions|SHA256|
|SSL certificates for Microsoft Entra application</br>Proxy published applications |AES-GCM 256-bit |
|Disk-level encryption|XTS-AES 128|
|[Seamless single sign-on (SSO)](../hybrid/connect/how-to-connect-sso-how-it-works.md) service account password</br>SaaS application provisioning credentials|AES-CBC 128-bit |
|Microsoft Entra managed identities|AES-GCM 256-bit|
|Microsoft Authenticator app: Passwordless sign-in to Microsoft Entra ID |Asymmetric RSA Key 2048-bit|
|Microsoft Authenticator app: Backup and restore of enterprise account metadata |AES-256  |

## Resources

* [Microsoft Service Trust Documents](https://servicetrust.microsoft.com/Documents/TrustDocuments)
* [Microsoft Azure Trust Center](https://azure.microsoft.com/overview/trusted-cloud/)
* [Recover from deletions in Microsoft Entra ID](../architecture/recover-from-deletions.md)

## Next steps

* [Microsoft Entra ID and data residency](data-residency.md) 
* [Data operational considerations](data-operational-considerations.md)
* [Data protection considerations](data-protection-considerations.md) (You're here)
