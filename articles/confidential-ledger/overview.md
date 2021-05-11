---
title: Microsoft Azure Confidential Ledger overview
description: An overview of Azure Confidential Ledger, a highly secure service for managing sensitive data records
services: confidential-ledger
author: msmbaldwin
ms.service: confidential-ledger
ms.topic: overview
ms.date: 04/15/2021
ms.author: mbaldwin

---
# Microsoft Azure Confidential Ledger

Microsoft Azure Confidential Ledger (ACL), or Confidential Ledger for short, is a new and highly secure service for managing sensitive data records. Based on a permissioned blockchain model, Confidential Ledger offers unique data integrity advantages. These include immutability, making the ledger write-only, and tamperproofing, to ensure all records are kept intact.

The Confidential Ledger runs exclusively on hardware-backed secure enclaves, a heavily monitored and isolated runtime environment which keeps potential attacks at bay. Furthermore, no one is "above" the Ledger, not even Microsoft. By designing ourselves out of the solution, Confidential Ledger runs on a minimalistic Trusted Computing Base (TCB) which prevents access to Ledger service developers, datacenter technicians and cloud administrators.

Confidential Ledger appeals to use cases where critical metadata records must not be modified, including in perpetuity for regulatory compliance and archival purposes. Here are a few examples of things you can store on your Ledger:

- Records relating to your business transactions (for example, money transfers or confidential document edits).
- Updates to trusted assets (for example, core applications or contracts).
- Administrative and control changes (for example, granting access permissions).
- Operational IT and security events (for example, Azure Security Center alerts).

For more information, we recommend checking out the Confidential Ledger demo showcased at [Microsoft Ignite 2020](https://mediusprodstatic.studios.ms/asset-b88de19d-4187-40c4-98f2-a65efc419e2a/OD221_1920x1080_AACAudio_1461.mp4?sv=2018-03-28&sr=b&sig=k5roi6WXnlqK1zP0fs5KYlJd4FD3Nuaf97z%2B2gV0aTs%3D&st=2020-09-22T08%3A05%3A01Z&se=2025-09-22T08%3A10%3A01Z&sp=r&rscd=filename%3DIG20-OD221-Inside%2BAzure%2BDatacenter%2BArchitecture%2Bwith%2BMark%2BRu.mp4).

## Preview prerequisites

Qualified participants must have an active NDA with Microsoft.

Users of this preview should have signed up on this form and received notification that their Tenant ID has been enabled for this preview.

## Key Features

The Confidential Ledger is exposed through REST APIs which can be integrated into new or existing applications. The Confidential Ledger can be managed by administrators utilizing Administrative APIs (Control Plane). It can also be called directly by application code through Functional APIs (Data Plane). The Administrative APIs supports basic operations such as create, update, get and, delete —- available workflows are detailed in [Azure Confidential Ledger workflows](workflows.md). The Functional APIs allow direct interaction with your instantiated Ledger and includes operations such as put and get data.

## Ledger security

This section defines the security protections for the Ledger. The Ledger APIs use client certificate-based authentication. Currently, the Ledger supports certificate-based authentication process with owner roles. We will be adding support for Azure Active Directory (AAD) based authentication and also role-based access (for example, owner, reader, and contributor).

The data to the Ledger is sent through TLS 1.2 connection and the TLS 1.2 connection terminates inside the hardware backed security enclaves (Intel® SGX enclaves). This ensures that no one can intercept the connection between a customer's client and the Confidential Ledger server nodes.

You can also perform [offline Ledger verification](offline-ledger-verification.md)

### Ledger storage

Confidential Ledgers are created as blocks in blob storage containers belonging to an Azure Storage account. Transaction data can either be stored as encrypted or in plaintext depending on your needs. When you create a Ledger, you will associate a Storage Account using the steps described in [Register a Confidential Ledger Service Principal](register-ledger-service-principal.md).

The Confidential Ledger can be managed by administrators utilizing Administrative APIs (Control Plane), and can be called directly by your application code through Functional APIs (Data Plane). The Administrative APIs supports basic operations such as create, update, get and, delete — available workflows are detailed in [Azure Confidential Ledger workflows](workflows.md).

The Functional APIs allow direct interaction with your instantiated Confidential Ledger and includes operations such as put and get data.

## Preview Limitations

- Once a Confidential Ledger is created, you cannot change the Ledger type.
- Confidential Ledger APIs only support cert-based authentication (AAD-based authentication will come).
- Confidential Ledger does not support standard Azure Disaster Recovery at this time. However, Azure Confidential Ledger offers built-in redundancy within the Azure region, as the Confidential Ledger runs on multiple independent nodes.
- Users must create an Azure Storage account and pass the Storage Account name during Confidential Ledger creation. Users are also required to register the Ledger Service Principal. More details are available here [??]
- Confidential Ledger deletion leads to a "hard delete", so your data will not be recoverable after deletion.
- Tools and code samples are maintained in a private repository. We plan to publish them on GitHub soon.
- Confidential Ledger names must be unique per tenant. Ledgers with the same name, irrespective of their type, are not allowed within the same tenant.

## Terminology

| Term | Definition |
|--|--|
| ACL | Azure Confidential Ledger |
| Ledger | An immutable append record of transactions (also known as a Blockchain) |
| Commit | A confirmation that a transaction has been locally committed to a node. A local commit by itself does not guarantee that a transaction is part of the Ledger. |
| Global commit | A confirmation that transaction was globally committed and is part of the Ledger. |
| Receipt | Proof that the transaction was processed by the Ledger. |

## Next steps

- [Overview of Microsoft Azure Confidential Ledger](overview.md)
