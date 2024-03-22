---
title: Learn about the Confidential Consortium Framework
description: An overview of Confidential Consortium Framework.
services: managed-confidential-consortium-framework
author: msftsettiy
ms.service: confidential-ledger
ms.topic: overview
ms.date: 09/28/2023
ms.author: settiy

---

# Overview of Confidential Consortium Framework

The Confidential Consortium Framework (CCF) is an open-source framework for building secure, highly available, and performant applications that focus on multi-party compute and data. CCF leverages the power of trusted execution environments (TEE, or enclave), decentralized systems concepts, and cryptography, to enable enterprise-ready multiparty systems. CCF is based on industry standard web technologies that allows clients to interact with CCF aware applications over HTTPS.

The following diagram shows a basic CCF network made of three nodes. All nodes run the same application code inside an enclave. The effects of user (business) and member (governance) transactions are eventually committed to a replicated, encrypted ledger. A consortium of members is in charge of governing the network.

:::image type="content" source="media/how-to/confidential-consortium-framework-node-network.png" lightbox="media/how-to/confidential-consortium-framework-node-network.png" alt-text="A diagram of a A Confidential Consortium Framework network made of 3 nodes.":::

## Core Concepts

### Network and Nodes

A CCF network consists of several nodes, each running on top of a Trusted Execution Environment (TEE), such as Intel SGX. A CCF network is decentralized and highly available. Nodes are run and maintained by Operators. However, nodes must be trusted by the consortium of members before participating in a CCF network.

To learn more about the operators, refer to the [Operators](https://microsoft.github.io/CCF/main/operations/index.html) section in the CCF documentation.

### Application

Each node runs the same application, written in JavaScript. An application is a collection of endpoints that can be triggered by trusted Users' HTTP commands over TLS. Each endpoint can mutate or read the in-enclave-memory Key-Value Store that is replicated across all nodes in the network. Changes to the Key-Value Store must be agreed by at least a majority of nodes before being applied.

The Key-Value Store is a collection of maps (associating a key to a value) defined by the application. These maps can be private (encrypted in the ledger) or public (integrity-protected and visible by anyone that has access to the ledger).

As all the nodes in the CCF network can read the content of private maps, the application logic must control the access to such maps. As every application endpoint has access to the user identity in the request, it is easy to implement an authorization policy to restrict access to the maps.

To learn more about CCF applications and start building it, refer to the [Get Started](get-started.md) page.

### Ledger

All changes to the Key-Value Store are encrypted and recorded by each node of the network to disk to a decentralized auditable ledger. The integrity of the ledger is guaranteed by a Merkle Tree whose root is periodically signed by the current primary or leader node.

Find out how to audit the CCF ledger in the [Audit](https://microsoft.github.io/CCF/main/audit/index.html) section in the CCF documentation.

### Governance

A CCF network is governed by a consortium of members. The scriptable Constitution, recorded in the ledger, defines a set of rules that members must follow.

Members can submit proposals to modify the state of the Key-Value Store. For example, members can vote to allow a new trusted user to issue requests to the application or to add a new member to the consortium.

Proposals are executed only when the conditions defined in the constitution are met (for example, a majority of members have voted favorably for that proposal).

To learn more about the customizable constitution and governance, refer to the [Governance](https://microsoft.github.io/CCF/main/governance/index.html) section in the CCF documentation.

## Next steps

- [Quickstart: Azure portal](quickstart-portal.md)
- [Quickstart: Azure CLI](quickstart-python.md)
- [FAQ](faq.yml)
