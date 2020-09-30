---
title: How to run the OPC Vault certificate management service securely - Azure | Microsoft Docs
description: Describes how to run the OPC Vault certificate management service securely in Azure, and reviews other security guidelines to consider.
author: mregen
ms.author: mregen
ms.date: 8/16/2019
ms.topic: conceptual
ms.service: industrial-iot
services: iot-industrialiot
manager: philmea
---

# Run the OPC Vault certificate management service securely

> [!IMPORTANT]
> While we update this article, see [Azure Industrial IoT](https://azure.github.io/Industrial-IoT/) for the most up to date content.

This article explains how to run the OPC Vault certificate management service securely in Azure, and reviews other security guidelines to consider.

## Roles

### Trusted and authorized roles

The OPC Vault microservice allows for distinct roles to access various parts of the service.

> [!IMPORTANT]
> During deployment, the script only adds the user who runs the deployment script as a user for all roles. For a production deployment, you should review this role assignment, and reconfigure appropriately by following the guidelines below. This task requires manual assignment of roles and services in the Azure Active Directory (Azure AD) Enterprise Applications portal.

### Certificate management service roles

The OPC Vault microservice defines the following roles:

- **Reader**: By default, any authenticated user in the tenant has read access. 
  - Read access to applications and certificate requests. Can list and query for applications and certificate requests. Also device discovery information and public certificates are accessible with read access.
- **Writer**: The Writer role is assigned to a user to add write permissions for certain tasks. 
  - Read/Write access to applications and certificate requests. Can register, update, and unregister applications. Can create certificate requests and obtain approved private keys and certificates. Can also delete private keys.
- **Approver**: The Approver role is assigned to a user to approve or reject certificate requests. The role doesn't include any other role.
  - In addition to the Approver role to access the OPC Vault microservice API, the user must also have the key signing permission in Azure Key Vault to be able to sign the certificates.
  - The Writer and Approver role should be assigned to different users.
  - The main role of the Approver is the approval of the generation and rejection of certificate requests.
- **Administrator**: The Administrator role is assigned to a user to manage the certificate groups. The role doesn't support the Approver role, but includes the Writer role.
  - The administrator can manage the certificate groups, change the configuration, and revoke application certificates by issuing a new Certificate Revocation List (CRL).
  - Ideally, the Writer, Approver, and Administrator roles are assigned to different users. For additional security, a user with the Approver or Administrator role also needs key-signing permission in Key Vault, to issue certificates or to renew an Issuer CA certificate.
  - In addition to the microservice administration role, the role includes, but isn't limited to:
    - Responsibility for administering the implementation of the CA’s security practices.
    - Management of the generation, revocation, and suspension of certificates. 
    - Cryptographic key life-cycle management (for example, the renewal of the Issuer CA keys).
    - Installation, configuration, and maintenance of services that operate the CA.
    - Day-to-day operation of the services. 
    - CA and database backup and recovery.

### Other role assignments

Also consider the following roles when you're running the service:

- Business owner of the certificate procurement contract with the external root certification authority (for example, when the owner purchases certificates from an external CA or operates a CA that is subordinate to an external CA).
- Development and validation of the Certificate Authority.
- Review of audit records.
- Personnel that help support the CA or manage the physical and cloud facilities, but aren't directly trusted to perform CA operations, are in the *authorized* role. The set of tasks persons in the authorized role is allowed to perform must also be documented.

### Review memberships of trusted and authorized roles quarterly

Review membership of trusted and authorized roles at least quarterly. Ensure that the set of people (for manual processes) or service identities (for automated processes) in each role is kept to a minimum.

### Role separation between certificate requester and approver

The certificate issuance process must enforce role separation between the certificate requester and certificate approver roles (persons or automated systems). Certificate issuance must be authorized by a certificate approver role that verifies that the certificate requestor 
is authorized to obtain certificates. The persons that hold the certificate approver role must be a formally authorized person.

### Restrict assignment of privileged roles

You should restrict assignment of privileged roles, such as authorizing membership of the Administrators and Approvers group, to a limited set of authorized personnel. Any privileged role changes must have access revoked within 24 hours. Finally, review privileged role assignments on a quarterly basis, and remove any unneeded or expired assignments.

### Privileged roles should use two-factor authentication

Use multi-factor authentication (also called two-factor authentication) for interactive sign-ins of Approvers and Administrators to the service.

## Certificate service operation guidelines

### Operational contacts

The certificate service must have an up-to-date security response plan on file, which contains detailed operational incident response contacts.

### Security updates

All systems must be continuously monitored and updated with latest security updates.

> [!IMPORTANT]
> The GitHub repository of the OPC Vault service is continuously updated with security patches. Monitor these updates, and apply them to the service at regular intervals.

### Security monitoring

Subscribe to or implement appropriate security monitoring. For example, subscribe to a central monitoring solution (such as Azure Security Center or Microsoft 365 monitoring solution), and configure it appropriately to ensure that security events are transmitted to the monitoring solution.

> [!IMPORTANT]
> By default, the OPC Vault service is deployed with [Azure Application Insights](https://docs.microsoft.com/azure/azure-monitor/app/devops) as a monitoring solution. Adding a security solution like [Azure Security Center](https://azure.microsoft.com/services/security-center/) is highly recommended.

### Assess the security of open-source software components

All open-source components used within a product or service must be free of moderate or greater security vulnerabilities.

> [!IMPORTANT]
> During continuous integration builds, the GitHub repository of the OPC Vault service scans all components for vulnerabilities. Monitor these updates on GitHub, and apply them to the service at regular intervals.

### Maintain an inventory

Maintain an asset inventory for all production hosts (including persistent virtual machines), devices, all internal IP address ranges, VIPs, and public DNS domain names. Whenever you add or remove a system, device IP address, VIP, or public DNS domain, you must update the inventory within 30 days.

#### Inventory of the default Azure OPC Vault microservice production deployment 

In Azure:
- **App Service Plan**: App service plan for service hosts. Default S1.
- **App Service** for microservice: The OPC Vault service host.
- **App Service** for sample application: The OPC Vault sample application host.
- **Key Vault Standard**: To store secrets and Azure Cosmos DB keys for the web services.
- **Key Vault Premium**: To host the Issuer CA keys, for signing service, and for vault configuration and storage of application private keys.
- **Azure Cosmos DB**: Database for application and certificate requests. 
- **Application Insights**: (optional) Monitoring solution for web service and application.
- **Azure AD Application Registration**: A registration for the sample application, the service, and the edge module.

For the cloud services, all hostnames, resource groups, resource names, subscription IDs, and tenant IDs used to deploy the service should be documented. 

In Azure IoT Edge or a local IoT Edge server:
- **OPC Vault IoT Edge module**: To support a factory network OPC UA Global Discovery Server. 

For the IoT Edge devices, the hostnames and IP addresses should be documented. 

### Document the Certification Authorities (CAs)

The CA hierarchy documentation must contain all operated CAs. This includes all related 
subordinate CAs, parent CAs, and root CAs, even when they aren't managed by the service. 
Instead of formal documentation, you can provide an exhaustive set of all non-expired CA certificates.

> [!NOTE]
> The OPC Vault sample application supports the download of all certificates used and produced in the service for documentation.

### Document the issued certificates by all Certification Authorities (CAs)

Provide an exhaustive set of all certificates issued in the past 12 months.

> [!NOTE]
> The OPC Vault sample application supports the download of all certificates used and produced in the service for documentation.

### Document the standard operating procedure for securely deleting cryptographic keys

During the lifetime of a CA, key deletion might happen only rarely. This is why no user has Key Vault Certificate Delete right assigned, and why there are no APIs exposed to delete an Issuer CA certificate. The manual standard operating procedure for securely deleting certification authority cryptographic keys is only available by directly accessing Key Vault in the Azure portal. You can also delete the certificate group in Key Vault. To ensure immediate deletion, disable the 
[Key Vault soft delete](https://docs.microsoft.com/azure/key-vault/key-vault-ovw-soft-delete) functionality.

## Certificates

### Certificates must comply with minimum certificate profile

The OPC Vault service is an online CA that issues end entity certificates to subscribers. The OPC Vault microservice follows these guidelines in the default implementation.

- All certificates must include the following X.509 fields, as specified below:
  - The content of the version field must be v3. 
  - The contents of the serialNumber field must include at least 8 bytes of entropy obtained from a FIPS (Federal Information Processing Standards) 140 approved random number generator.<br>
    > [!IMPORTANT]
    > The OPC Vault serial number is by default 20 bytes, and is obtained from the operating system cryptographic random number generator. The random number generator is FIPS 140 approved on Windows devices, but not on Linux. Consider this when choosing a service deployment that uses Linux VMs or Linux docker containers, on which the underlying technology OpenSSL isn't FIPS 140 approved.
  - The issuerUniqueID and subjectUniqueID fields must not be present.
  - End-entity certificates must be identified with the basic constraints extension, in accordance with IETF RFC 5280.
  - The pathLenConstraint field must be set to 0 for the Issuing CA certificate. 
  - The Extended Key Usage extension must be present, and must contain the minimum set of Extended Key Usage object identifiers (OIDs). The anyExtendedKeyUsage OID (2.5.29.37.0) must not be specified. 
  - The CRL Distribution Point (CDP) extension must be present in the Issuer CA certificate.<br>
    > [!IMPORTANT]
    > The CDP extension is present in OPC Vault CA certificates. Nevertheless, OPC UA devices use custom methods to distribute CRLs.
  - The Authority Information Access extension must be present in the subscriber certificates.<br>
    > [!IMPORTANT]
    > The Authority Information Access extension is present in OPC Vault subscriber certificates. Nevertheless, OPC UA devices use custom methods to distribute Issuer CA information.
- Approved asymmetric algorithms, key lengths, hash functions and padding modes must be used.
  - RSA and SHA-2 are the only supported algorithms.
  - RSA can be used for encryption, key exchange, and signature.
  - RSA encryption must use only the OAEP, RSA-KEM, or RSA-PSS padding modes.
  - Key lengths greater than or equal to 2048 bits are required.
  - Use the SHA-2 family of hash algorithms (SHA256, SHA384, and SHA512).
  - RSA Root CA keys with a typical lifetime greater than or equal to 20 years must be 4096 bits or greater.
  - RSA Issuer CA keys must be at least 2048 bits. If the CA certificate expiration date is after 2030, the CA key must be 4096 bits or greater.
- Certificate lifetime
  - Root CA certificates: The maximum certificate validity period for root CAs must not exceed 25 years.
  - Sub CA or online Issuer CA certificates: The maximum certificate validity period for CAs that are online and issue only subscriber certificates must not exceed 6 years. For these CAs, the related private signature key must not be used longer than 3 years to issue new certificates.<br>
    > [!IMPORTANT]
    > The Issuer certificate, as it is generated in the default OPC Vault microservice without external Root CA, is treated like an online Sub CA, with respective requirements and lifetimes. The default lifetime is set to 5 years, with a key length greater than or equal to 2048.
  - All asymmetric keys must have a maximum 5-year lifetime, and a recommended 1-year lifetime.<br>
    > [!IMPORTANT]
    > By default, the lifetimes of application certificates issued with OPC Vault have a lifetime of 2 years, and should be replaced every year. 
  - Whenever a certificate is renewed, it's renewed with a new key.
- OPC UA-specific extensions in application instance certificates
  - The subjectAltName extension includes the application Uri and hostnames. These might also include FQDN, IPv4, and IPv6 addresses.
  - The keyUsage includes digitalSignature, nonRepudiation, keyEncipherment, and dataEncipherment.
  - The extendedKeyUsage includes serverAuth and clientAuth.
  - The authorityKeyIdentifier is specified in signed certificates.

### CA keys and certificates must meet minimum requirements

- **Private keys**: RSA keys must be at least 2048 bits. If the CA certificate expiration date is after 2030, the CA key must be 4096 bits or greater.
- **Lifetime**: The maximum certificate validity period for CAs that are online and issue only subscriber certificates must not exceed 6 years. For these CAs, the related private signature key must not be used longer than 3 years to issue new certificates.

### CA keys are protected using Hardware Security Modules

OpcVault uses Azure Key Vault Premium, and keys are protected by FIPS 140-2 Level 2 Hardware Security Modules (HSM). 

The cryptographic modules that Key Vault uses, whether HSM or software, are FIPS validated. Keys created or imported as HSM-protected are processed inside an HSM, validated to FIPS 140-2 Level 2. Keys created or imported as software-protected are processed inside cryptographic modules validated to FIPS 140-2 Level 1.

## Operational practices

### Document and maintain standard operational PKI practices for certificate enrollment

Document and maintain standard operational procedures (SOPs) for how CAs issue certificates, including: 
- How the subscriber is identified and authenticated. 
- How the certificate request is processed and validated (if applicable, include also how certificate renewal and rekey requests are processed). 
- How issued certificates are distributed to the subscribers. 

The OPC Vault microservice SOP is described in [OPC Vault architecture](overview-opc-vault-architecture.md) and [Manage the OPC Vault certificate service](howto-opc-vault-manage.md). The practices follow "OPC Unified Architecture Specification Part 12: Discovery and Global Services."


### Document and maintain standard operational PKI practices for certificate revocation

The certificate revocation process is described in [OPC Vault architecture](overview-opc-vault-architecture.md) and [Manage the OPC Vault certificate service](howto-opc-vault-manage.md).
	
### Document CA key generation ceremony 

The Issuer CA key generation in the OPC Vault microservice is simplified, due to the secure storage in Azure Key Vault. For more information, see [Manage the OPC Vault certificate service](howto-opc-vault-manage.md).

However, when you're using an external Root certification authority, a CA key generation ceremony must adhere to the following requirements.

The CA key generation ceremony must be performed against a documented script that includes at least the following items: 
- Definition of roles and participant responsibilities.
- Approval for conduct of the CA key generation ceremony.
- Cryptographic hardware and activation materials required for the ceremony.
- Hardware preparation (including asset/configuration information update and sign-off).
- Operating system installation.
- Specific steps performed during the CA key generation ceremony, such as: 
  - CA application installation and configuration.
  - CA key generation.
  - CA key backup.
  - CA certificate signing.
  - Import of signed keys in the protected HSM of the service.
  - CA system shutdown.
  - Preparation of materials for storage.


## Next steps

Now that you have learned how to securely manage OPC Vault, you can:

> [!div class="nextstepaction"]
> [Secure OPC UA devices with OPC Vault](howto-opc-vault-secure.md)
