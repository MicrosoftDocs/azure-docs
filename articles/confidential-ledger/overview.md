---
title: Microsoft Azure confidential ledger overview
description: An overview of Azure confidential ledger, a highly secure service for managing sensitive data records
services: confidential-ledger
author: msmbaldwin
ms.service: confidential-ledger
ms.topic: overview
ms.date: 11/14/2022
ms.author: mbaldwin

---
# Microsoft Azure confidential ledger

Microsoft Azure confidential ledger (ACL) is a new and highly secure service for managing sensitive data records. It runs exclusively on hardware-backed secure enclaves, a heavily monitored and isolated runtime environment which keeps potential attacks at bay. Furthermore, Azure confidential ledger runs on a minimalistic Trusted Computing Base (TCB), which ensures that no one⁠—not even Microsoft⁠—is "above" the ledger.

As its name suggests, Azure confidential ledger utilizes the [Azure Confidential Computing platform](../confidential-computing/index.yml) and the [Confidential Consortium Framework](https://ccf.dev) to provide a high integrity solution that is tamper-protected and evident. One ledger spans across three or more identical instances, each of which run in a dedicated, fully attested hardware-backed enclave. The ledger's integrity is maintained through a consensus-based blockchain.

Azure confidential ledger offers unique data integrity advantages, including immutability, tamper-proofing, and append-only operations. These features, which ensure that all records are kept intact, are ideal when critical metadata records must not be modified, such as for regulatory compliance and archival purposes.

Here are a few examples of things you can store on your ledger:

- Records relating to your business transactions (for example, money transfers or confidential document edits).
- Updates to trusted assets (for example, core applications or contracts).
- Administrative and control changes (for example, granting access permissions).
- Operational IT and security events (for example, Microsoft Defender for Cloud alerts).

For more information, you can watch the [Azure confidential ledger demo](https://www.youtube.com/watch?v=Cg0-5moftP0).

## Key Features

The confidential ledger is exposed through REST APIs which can be integrated into new or existing applications. The confidential ledger can be managed by administrators utilizing Administrative APIs (Control Plane). It can also be called directly by application code through Functional APIs (Data Plane). The Administrative APIs support basic operations such as create, update, get and, delete. The Functional APIs allow direct interaction with your instantiated ledger and include operations such as put and get data.

## Ledger security

The ledger APIs support certificate-based authentication process with owner roles as well as Microsoft Entra ID based authentication and also role-based access (for example, owner, reader, and contributor).

The data to the ledger is sent through TLS 1.3 connection and the TLS 1.3 connection terminates inside the hardware backed security enclaves (Intel® SGX enclaves). This ensures that no one can intercept the connection between a customer's client and the confidential ledger server nodes.

### Ledger storage

Confidential ledgers are created as blocks in blob storage containers belonging to an Azure Storage account. Transaction data can either be stored encrypted or in plaintext depending on your needs.

The confidential ledger can be managed by administrators utilizing Administrative APIs (Control Plane), and can be called directly by your application code through Functional APIs (Data Plane). The Administrative APIs support basic operations such as create, update, get and, delete.

The Functional APIs allow direct interaction with your instantiated confidential ledger and include operations such as put and get data.

## Constraints

- Once a confidential ledger is created, you cannot change the ledger type (private or public).
- Azure confidential ledger deletion leads to a "hard delete", so your data will not be recoverable after deletion.
- Azure confidential ledger names must be globally unique. Ledgers with the same name, irrespective of their type, are not allowed.

## Terminology

| Term | Definition |
|--|--|
| ACL | Azure confidential ledger |
| Ledger | An immutable append-only record of transactions (also known as a Blockchain) |
| Commit | A confirmation that a transaction has been appended to the ledger. |
| Receipt | Proof that the transaction was processed by the ledger. |

## Next steps

- [Microsoft Azure confidential ledger architecture](architecture.md)
- [Quickstart: Azure portal](quickstart-portal.md)
- [Quickstart: Python](quickstart-python.md)
- [Quickstart: Azure Resource Manager (ARM) template](quickstart-template.md)
