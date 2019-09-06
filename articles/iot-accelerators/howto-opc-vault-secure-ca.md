---
title: How to run the OPC Vault certificate management service securely - Azure | Microsoft Docs
description: Describes how to run the OPC Vault certificate management service securely in Azure and other security guidelines to consider.
author: mregen
ms.author: mregen
ms.date: 8/16/2019
ms.topic: conceptual
ms.service: industrial-iot
services: iot-industrialiot
manager: philmea
---

# How to run the OPC Vault certificate management service securely

This article explains how to run the OPC Vault certificate management service securely in Azure and other security guidelines to consider.

## Roles

### Trusted and authorized roles

The OPC Vault microservice is configured to allow for distinct roles to access various parts of the service.

> [!IMPORTANT]
> During deployment, the script only adds the user who runs the deployment script as a user for all roles.
> This role assignment should be reviewed for a production deployment and reconfigured appropriately following the guidelines below.
> This task requires manual assignment of roles and services in the Azure AD Enterprise Applications portal.

### Certificate management service roles

The OPC Vault microservice defines the following roles:

- **Reader**: By default any authenticated user in the tenant has read access. 
  - Read access to applications and certificate requests. Can list and query for applications and certificate requests. Also device discovery information and public certificates are accessible with read access.
- **Writer**: The Writer role is assigned to a user to add write permissions for certain tasks. 
  - Read/Write access to applications and certificate requests. Can register, update, and unregister applications. Can create certificate requests and obtain approved private keys and certificates. Can also delete private keys.
- **Approver**: The Approver role is assigned to a user to approve or reject certificate requests. The role does not include any other role.
  - In addition to the Approver role to access the OPC Vault microservice Api the user must also have the key signing permission in Key Vault to be able to sign the certificates.
  - The Writer and Approver role should be assigned to different users.
  - The main role of the Approver is the Approval of the generation and rejection of certificate requests.
- **Administrator**: The Administrator role is assigned to a user to manage the certificate groups. The role does not support the Approver role, but includes the Writer role.
  - The administrator can manage the certificate groups, change the configuration and revoke application certificates by issuing a new CRL.
  - Ideally, Writer, Approver and Administrator roles are assigned to different users. For additional security, a user with Approver or Administrator role needs also key signing permission in KeyVault to issue certificates or to renew an Issuer CA certificate.
  - In addition to the microservice administration role, the role includes also but is not limited to:
    - Responsible for administering the implementation of the CA’s security practices.
    - Management of the generation, revocation, and suspension of certificates. 
    - Cryptographic key life-cycle management (for example, the renewal of the Issuer CA keys).
    - Installation, configuration, and maintenance of services that operate the CA.
    - Day-to-day operation of the services. 
    - CA and database backup and recovery.

### Other role assignments

The following roles should also be considered and assigned when running the service:

- Business owner of the certificate procurement contract with the external Root certification authority 
(in the case when the owner purchases certificates from an external CA or operates a CA that is subordinate to an external CA).
- Development and validation of the Certificate Authority.
- Review of audit records.
- Personnel that help to support the CA or to manage the physical and cloud facilities, 
but are not directly trusted to perform CA operations are defined to be in the authorized role. 
The set of tasks persons in the authorized role is allowed to perform must also be documented.

### Memberships of trusted and authorized roles must be reviewed annually

Membership of trusted and authorized roles must be reviewed at least quarterly to 
ensure the set of people (for manual processes) or service identities 
(for automated processes) in each role is kept to a minimum.

### Certificate issuance process must enforce role separation between certificate requester and approver

The certificate issuance process must enforce role separation between certificate requester 
and certificate approver roles (persons or automated systems). Certificate issuance must be 
authorized by a certificate approver role that verifies that the certificate requestor 
is authorized to obtain certificates. 
The persons that hold the certificate approver role must be a formally authorized person.

### Privileged role management must restrict access and be reviewed quarterly

Assignment of privileged roles, such as authorizing membership of the Administrators and Approvers group, must be restricted to a limited set of authorized personnel. Any privileged role changes must have 
access revoked within 24 hours. Finally, privileged role assignments must be reviewed on a quarterly 
basis and any unneeded or expired assignments must be removed.

### Privileged roles should use two-factor authentication

Multi-factor authentication (Two-Factor Authentication, MFA, or TFA) must be used for 
interactive logons of Approvers and Administrators to the service.

## Certificate service operation guidelines

### Operational contacts

The certificate service must have an up-to-date Security Response Plan on file, which contains detailed operational incident response contacts.

### Security updates

All systems must be continuously monitored and updated with latest security updates/patch compliance.

> [!IMPORTANT]
> The GitHub repository of the OPC Vault service is continuously updated with security patches. The updates on GitHub should be monitored and the updates be applied to the service at regular intervals.

### Security monitoring

Subscribe to or implement appropriate security monitoring, e.g.,  by subscribing to a central monitoring solution 
(for example, Azure Security Center, O365 monitoring solution) and configure it appropriately to ensure 
that security events are transmitted to the monitoring solution.

> [!IMPORTANT]
> By default, the OPC Vault service is deployed with the [Azure Application Insights](https://docs.microsoft.com/azure/azure-monitor/app/devops) as a monitoring 
> solution. Adding a security solution like [Azure Security Center](https://azure.microsoft.com/services/security-center/) is highly recommended.

### Assess security of open source software components

All open-source components used within a product or service must be free of moderate or greater security vulnerabilities.

> [!IMPORTANT]
> The GitHub repository of the OPC Vault service is scanning all components during continuous integration builds for vulnerabilities. The updates on GitHub should be monitored and the updates be applied to the service at regular intervals.

### Maintain an inventory

An asset inventory must be maintained for all production hosts (including persistent virtual machines), devices, 
all internal IP address ranges, VIPs, and public DNS domain names. This inventory must be updated with addition 
or removal of a system, device IP address, VIP, or public DNS domain within 30 days.

#### Inventory of the default Azure OPC Vault microservice production deployment: 

In **Azure**:
- **App Service Plan**: App service plan for service hosts. Default S1.
- **App Service** for microservice: The OPC Vault service host.
- **App Service** for sample application: The OPC Vault sample application host.
- **KeyVault Standard**: To store secrets and Cosmos DB keys for the web services.
- **KeyVault Premium**: To host the Issuer CA keys, for signing service, for vault configuration and storage of application private keys.
- **Cosmos DB**: Database for application and certificate requests. 
- **Application Insights**: (optional) Monitoring solution for web service and application.
- **AzureAD Application Registration**: A registration for the sample application, the service, and the edge module.

For the cloud services all hostnames, Resource Groups, Resource Names, Subscription ID, TenantId used to deploy the service should be documented. 

In **IoT Edge** or a local **IoT Edge Server**:
- **OPC Vault IoT Edge Module**: To support a factory network OPC UA Global Discovery Server. 

For the IoT Edge devices the hostnames and IP addresses should be documented. 

### Document the Certification Authorities (CAs)

The CA hierarchy documentation must contain all operated CAs including all related 
subordinate CAs, parent CAs, and root CAs, even when they are not managed by the service. 
An exhaustive set of all non-expired CA certificates may be provided instead of formal documentation.

> [!NOTE]
> The OPC Vault sample application supports for download of all certificates used and produced in the service for documentation.

### Document the issued certificates by all Certification Authorities (CAs)

An exhaustive set of all certificates issued in the past 12 months should be provided for documentation.

> [!NOTE]
> The OPC Vault sample application supports for download of all certificates used and produced in the service for documentation.

### Document the SOP for securely deleting cryptographic keys

Key deletion may only rarely happen during the lifetime of a CA, this is why no user has KeyVault Certificate Delete 
right assigned and why there are no APIs exposed to delete an Issuer CA certificate. 
The manual standard operating procedure for securely deleting certification authority cryptographic keys is only available by directly
accessing the KeyVault in the Azure portal and by deleting the certificate group in KeyVault. To ensure immediate deletion
[KeyVault soft delete](https://docs.microsoft.com/azure/key-vault/key-vault-ovw-soft-delete) should be disabled.

## Certificates

### Certificates must comply with minimum certificate profile

The OPC Vault service is an online Certification Authorities (CAs) that issues end entity certificates to subscribers.
The OPC Vault microservice follows these guidelines in the default implementation.

- All certificates must include the following X.509 fields as specified below:
  - The content of the version field must be v3. 
  - The contents of the serialNumber field must include at least 8 bytes of entropy obtained from a FIPS (Federal Information Processing Standards) 140 approved random number generator.<br>
    > [!IMPORTANT]
    > The OPC Vault serial number is by default 20 bytes and obtained from the OS cryptographic random number generator. The random number generator is FIPS 140 approved on Windows devices, however not on Linux flavors. This fact needs to be considered when choosing a service deployment, which uses Linux VMs or Linux docker containers, on which the underlying technology OpenSSL is not FIPS 140 approved.
  - The issuerUniqueID and subjectUniqueID fields must not be present.
  - End-entity certificates must be identified with the Basic Constraints extension in accordance with IETF RFC 5280.
  - The pathLenConstraint field must be set to 0 for the Issuing CA certificate. 
  - The Extended Key Usage extension must be present and contain the minimum set of Extended Key Usage object identifiers (OIDs). The anyExtendedKeyUsage OID (2.5.29.37.0) must not be specified. 
  - The CRL Distribution Point (CDP) extension must be present in the Issuer CA certificate.<br>
    > [!IMPORTANT]
    > The CRL Distribution Point (CDP) extension is present in OPC Vault CA certificates, nevertheless OPC UA devices use custom methods to distribute CRLs.
  - The Authority Information Access extension must be present in the subscriber certificates.<br>
    > [!IMPORTANT]
    > The Authority Information Access extension is present in OPC Vault subscriber certificates, nevertheless OPC UA devices use custom methods to distribute Issuer CA information.
- Approved asymmetric algorithms, key lengths, hash functions and padding modes must be used.
  - **RSA** and **SHA-2** are the only supported algorithms (*).
  - RSA may be used for encryption, key exchange, and signature.
  - RSA encryption must use only the OAEP, RSA-KEM, or RSA-PSS padding modes.
  - Key lengths >= 2048 bits are required.
  - Use the SHA-2 family of hash algorithms (SHA256, SHA384, and SHA512).
  - RSA Root CA keys with a typical lifetime >= 20 years must be 4096 bits or greater.
  - RSA Issuer CA keys must be at least 2048 bits; if the CA certificate expiration date is after 2030, the CA key must be 4096 bits or greater.
- Certificate Lifetime
  - Root CA certificates: The maximum certificate validity period for root CAs must not exceed 25 years.
  - Sub CA or online Issuer CA certificates: The maximum certificate validity period for CAs that are online and issue only subscriber certificates must not exceed six years. For these CAs, the related private signature key must not be used longer than three years to issue new certificates.<br>
    > [!IMPORTANT]
    > The Issuer certificate as it is generated in the default OPC Vault microservice without external Root CA is treated like an online Sub CA with respective requirements and lifetimes. The default lifetime is set to five years with a key length >= 2048.
  - All asymmetric keys must have a maximum five-year lifetime, recommended one-year lifetime.<br>
    > [!IMPORTANT]
    > By default the lifetimes of application certificates issued with OPC Vault have a lifetime of two years and should be replaced every year. 
  - Whenever a certificate is renewed, it is renewed with a new key.
- OPC UA-specific extensions in application instance certificates
  - The subjectAltName extension includes the application Uri and hostnames, which may also include FQDN, IPv4 and IPv6 addresses.
  - The keyUsage includes digitalSignature, nonRepudiation, keyEncipherment, and dataEncipherment.
  - The extendedKeyUsage includes serverAuth and/or clientAuth.
  - The authorityKeyIdentifier is specified in signed certificates.

### Certificate Authority (CA) keys and certificates must meet minimum requirements

- **Private keys**: **RSA** keys must be at least 2048 bits; if the CA certificate expiration date is after 2030, the CA key must be 4096 bits or greater.
- **Lifetime**: The maximum certificate validity period for CAs that are online and issue only subscriber certificates must not exceed six years. For these CAs, the related private signature key must not be used longer than three years to issue new certificates.

### CA keys are protected using Hardware Security Modules (HSM)

- OpcVault uses Azure KeyVault Premium and keys are protected by FIPS 140-2 Level 2 Hardware Security Modules (HSM). 

The cryptographic modules that Key Vault uses, whether HSM or software, are FIPS (Federal Information Processing Standards) validated.<br>
Keys created or imported as HSM-protected are processed inside an HSM, validated to FIPS 140-2 Level 2.<br>
Keys created or imported as software-protected, are processed inside cryptographic modules validated to FIPS 140-2 Level 1.

## Operational practices

### Document and maintain standard operational PKI practices for certificate enrollment

Document and maintain standard operational procedures (SOPs) for how CAs issue certificates, including: 
- How the subscriber is identified and authenticated 
- How the certificate request is processed and validated (if applicable, include also how certificate renewal and rekey requests are processed) 
- How issued certificates are distributed to the subscribers 

The OPC Vault microservice SOP is described in the [Overview](overview-opc-vault-architecture.md) and the [How to manage](howto-opc-vault-manage.md) documents. The practices follow the OPC Unified Architecture Specification Part 12: Discovery and Global Services.


### Document and maintain standard operational PKI practices for certificate revocation

The certificate revocation process is described in the [Overview](overview-opc-vault-architecture.md) and the [How to manage](howto-opc-vault-manage.md) documents.
	
### Document Certification Authority (CA) key generation ceremony 

The Issuer CA key generation in the OPC Vault microservice is simplified due to the secure storage in Azure KeyVault and described in the [How to manage](howto-opc-vault-manage.md) documentation.

However, when an external Root certification authority is being used, 
a Certificate Authority (CA) key generation ceremony must adhere to the following requirements:

The CA key generation ceremony must be performed against a documented script that includes at least the following items: 
1. Definition of roles and participant responsibilities
2. Approval for conduct of the CA key generation ceremony
3. Cryptographic hardware and activation materials required for the ceremony
4. Hardware preparation (including asset/configuration information update and sign off)
5. Operating system installation
6. Specific steps performed during the CA key generation ceremony, such as: 
7. CA application installation and configuration
8. CA key generation
9. CA key backup
10. CA certificate signing
9. Import of signed keys in the protected HSM of the service.
11. CA system shutdown
12. Preparation of materials for storage


## Next steps

Now that you have learned how to securely manage OPC Vault, here is the suggested next step:

> [!div class="nextstepaction"]
> [Secure OPC UA devices with OPC Vault](howto-opc-vault-secure.md)