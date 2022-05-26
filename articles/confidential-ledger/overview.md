---
title: Microsoft Azure confidential ledger overview
description: An overview of Azure confidential ledger, a highly secure service for managing sensitive data records
services: confidential-ledger
author: msmbaldwin
ms.service: confidential-ledger
ms.topic: overview
ms.date: 04/15/2021
ms.author: mbaldwin

---
# Microsoft Azure confidential ledger (preview)

Microsoft Azure confidential ledger (ACL), is a new and highly secure service for managing sensitive data records. Based on a permissioned blockchain model, Azure confidential ledger offers unique data integrity advantages. These include immutability, making the ledger append-only, and tamper proofing, to ensure all records are kept intact.

The confidential ledger runs exclusively on hardware-backed secure enclaves, a heavily monitored and isolated runtime environment which keeps potential attacks at bay. Furthermore, no one is "above" the Ledger, not even Microsoft. By designing ourselves out of the solution, Azure confidential ledger runs on a minimalistic Trusted Computing Base (TCB) which prevents access to Ledger service developers, datacenter technicians and cloud administrators.

Azure confidential ledger appeals to use cases where critical metadata records must not be modified, including in perpetuity for regulatory compliance and archival purposes. Here are a few examples of things you can store on your Ledger:

- Records relating to your business transactions (for example, money transfers or confidential document edits).
- Updates to trusted assets (for example, core applications or contracts).
- Administrative and control changes (for example, granting access permissions).
- Operational IT and security events (for example, Microsoft Defender for Cloud alerts).

For more information, you can watch the [Azure confidential ledger demo](https://www.youtube.com/watch?v=Cg0-5moftP0).

## Key Features

The confidential ledger is exposed through REST APIs which can be integrated into new or existing applications. The confidential ledger can be managed by administrators utilizing Administrative APIs (Control Plane). It can also be called directly by application code through Functional APIs (Data Plane). The Administrative APIs support basic operations such as create, update, get and, delete. The Functional APIs allow direct interaction with your instantiated Ledger and include operations such as put and get data.

## Ledger security

This section defines the security protections for the Ledger. The Ledger APIs use client certificate-based authentication. Currently, the Ledger supports certificate-based authentication process with owner roles. We will be adding support for Azure Active Directory (AAD) based authentication and also role-based access (for example, owner, reader, and contributor).

The data to the Ledger is sent through TLS 1.2 connection and the TLS 1.2 connection terminates inside the hardware backed security enclaves (Intel® SGX enclaves). This ensures that no one can intercept the connection between a customer's client and the confidential ledger server nodes.

### Ledger storage

Confidential ledgers are created as blocks in blob storage containers belonging to an Azure Storage account. Transaction data can either be stored encrypted or in plaintext depending on your needs.

The confidential ledger can be managed by administrators utilizing Administrative APIs (Control Plane), and can be called directly by your application code through Functional APIs (Data Plane). The Administrative APIs support basic operations such as create, update, get and, delete.

The Functional APIs allow direct interaction with your instantiated confidential ledger and include operations such as put and get data.

## Preview Limitations

- Once a confidential ledger is created, you cannot change the Ledger type.
- Azure confidential ledger does not support standard Azure Disaster Recovery at this time. However, Azure confidential ledger offers built-in redundancy within the Azure region, as the confidential ledger runs on multiple independent nodes.
- Azure confidential ledger deletion leads to a "hard delete", so your data will not be recoverable after deletion.
- Azure confidential ledger names must be globally unique. Ledgers with the same name, irrespective of their type, are not allowed.

## Terminology

| Term | Definition |
|--|--|
| ACL | Azure confidential ledger |
| Ledger | An immutable append record of transactions (also known as a Blockchain) |
| Commit | A confirmation that a transaction has been locally committed to a node. A local commit by itself does not guarantee that a transaction is part of the Ledger. |
| Global commit | A confirmation that transaction was globally committed and is part of the Ledger. |
| Receipt | Proof that the transaction was processed by the Ledger. |

## Next steps

- [Microsoft Azure confidential ledger architecture](architecture.md)
- [Quickstart: Azure portal](quickstart-portal.md)
- [Quickstart: Python](quickstart-python.md)
- [Quickstart: Azure Resource Manager (ARM) template](quickstart-portal.md)
