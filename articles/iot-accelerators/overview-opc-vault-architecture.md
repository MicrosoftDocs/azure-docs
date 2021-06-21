---
title: OPC Vault architecture - Azure | Microsoft Docs
description: OPC Vault certificate management service architecture
author: mregen
ms.author: mregen
ms.date: 08/16/2019
ms.topic: overview
ms.service: industrial-iot
services: iot-industrialiot
manager: philmea
---

# OPC Vault architecture

> [!IMPORTANT]
> While we update this article, see [Azure Industrial IoT](https://azure.github.io/Industrial-IoT/) for the most up to date content.

This article gives an overview about the OPC Vault microservice and the OPC Vault IoT Edge module.

OPC UA applications use application instance certificates to provide application level security. A secure connection is established by using asymmetric cryptography, for which the application certificates provide the public and private key pair. The certificates can be self-signed, or signed by a Certificate Authority (CA).

An OPC UA application has a list of trusted certificates that represents the applications it trusts. These certificates can be self-signed or signed by a CA, or can be a Root-CA or a Sub-CA themselves. If a trusted certificate is part of a larger certificate chain, the application trusts all certificates that chain up to the certificate in the trust list. This is true as long as the full certificate chain can be validated.

The major difference between trusting self-signed certificates and trusting a CA certificate 
is the installation effort required to deploy and maintain trust. There's also additional effort to host a company-specific CA. 

To distribute trust for self-signed certificates for multiple servers with a single client application, you must install all server application certificates on the client application trust list. Additionally, you must install the client application certificate on all server application trust lists. This administrative effort is quite a burden, and even increases when you have to consider certificate lifetimes and renew certificates.

The use of a company-specific CA can greatly simplify the management of trust with 
multiple servers and clients. In this case, the administrator generates a CA signed 
application instance certificate once for every client and server used. In addition, the CA Certificate is installed in every application trust list, on all servers and clients. With this approach, only expired certificates need to be renewed and replaced for the affected applications.

Azure Industrial IoT OPC UA certificate management service helps you manage a company-specific CA for OPC UA applications. This service is based on the OPC Vault microservice. OPC Vault provides a microservice to host a company-specific CA in a secure cloud. This solution is backed by services secured by Azure Active Directory (Azure AD), Azure Key Vault with Hardware Security Modules (HSMs), Azure Cosmos DB, and optionally IoT Hub as an application store.

The OPC Vault microservice is designed to support role-based workflow, where security 
administrators and approvers with signing rights in Azure Key Vault approve or reject requests.

For compatibility with existing OPC UA solutions, the services include
support for an OPC Vault microservice backed edge module. This implements the 
**OPC UA Global Discovery Server and Certificate Management** interface, to distribute certificates and trust lists according to Part 12 of the specification. 


## Architecture

The architecture is based on the OPC Vault microservice, with an OPC Vault 
IoT Edge module for the factory network and a web sample UX to control the workflow:

![Diagram of OPC Vault architecture](media/overview-opc-vault-architecture/opc-vault.png)

## OPC Vault microservice

The OPC Vault microservice consists of the following interfaces to implement 
the workflow to distribute and manage a company-specific CA for OPC UA applications.

### Application 
- An OPC UA application can be a server or a client, or both. OPC Vault serves in this 
case as an application registration authority. 
- In addition to the basic operations to register, update, and unregister applications, there are also interfaces to find and query for applications with search expressions. 
- The certificate requests must reference a valid application, in order to process a request and to issue a signed certificate with all OPC UA-specific extensions. 
- The application service is backed by a database in Azure Cosmos DB.

### Certificate group
- A certificate group is an entity that stores a root CA or a sub CA certificate, including the private key to sign certificates. 
- The RSA key length, the SHA-2 hash length, and the lifetimes are configurable for both Issuer CA and signed application certificates. 
- You store the CA certificates in Azure Key Vault, backed with FIPS 140-2 Level 2 HSM. The private key never leaves the secure storage, because signing is done by a Key Vault operation secured by Azure AD. 
- You can renew the CA certificates over time, and have them remain in safe storage due to Key Vault history. 
- The revocation list for each CA certificate is also stored in Key Vault as a secret. When an application is unregistered, the application certificate is also revoked in the Certificate Revocation List (CRL) by an administrator.
- You can revoke single certificates, as well as batched certificates.

### Certificate request
A certificate request implements the workflow to generate a new key pair or a signed certificate, by using a Certificate Signing Request (CSR) for an OPC UA application. 
- The request is stored in a database with accompanying information, like the subject or a CSR, and a reference to the OPC UA application. 
- The business logic in the service validates the request against the information stored in the application database. For example, the application Uri in the database must match the application Uri in the CSR.
- A security administrator with signing rights (that is, the Approver role) approves or rejects the request. If the request is approved, a new key pair or signed certificate (or both) are generated. The new private key is securely stored in Key Vault, and the new signed public certificate is stored in the certificate request database.
- The requester can poll the request status until it is approved or revoked. If the request was approved, the private key and the certificate can be downloaded and installed in the certificate store of the OPC UA application.
- The requestor can now accept the request to delete unnecessary information from the request database. 

Over the lifetime of a signed certificate, an application might be deleted or a key might become compromised. In such a case, a CA manager can:
- Delete an application, which also deletes all pending and approved certificate requests of the app. 
- Delete just a single certificate request, if only a key is renewed or compromised.

Now compromised approved and accepted certificate requests are marked as deleted.

A manager can regularly renew the Issuer CA CRL. At the renewal time, all the deleted certificate requests are revoked, and the certificate serial numbers are added to the CRL revocation list. Revoked certificate requests are marked as revoked. In urgent events, single certificate requests can be revoked, too.

Finally, the updated CRLs are available for distribution to the participating OPC UA clients and servers.

## OPC Vault IoT Edge module
To support a factory network Global Discovery Server, you can deploy the OPC Vault module on the edge. Run it as a local .NET Core application, or start it in a Docker container. Note that because of a lack of Auth2 authentication support in the current OPC UA .NET Standard stack, the functionality of the OPC Vault edge module is limited to a Reader role. A user can't be impersonated from the edge module to the microservice by using the OPC UA GDS standard interface.

## Next steps

Now that you have learned about the OPC Vault architecture, you can:

> [!div class="nextstepaction"]
> [Build and deploy OPC Vault](howto-opc-vault-deploy.md)
