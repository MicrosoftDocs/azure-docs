---
title: Authenticating Azure Confidential Ledger nodes
description: Authenticating Azure Confidential Ledger nodes
services: confidential-ledger
author: msmbaldwin
ms.service: confidential-ledger
ms.topic: overview
ms.date: 04/15/2021
ms.author: mbaldwin

---
# Authenticating Azure Confidential Ledger nodes

Azure Confidential Ledger nodes can be authenticated by code samples and by users.

## Code samples

When initializing, code samples get the node certificate by querying Identity Service. After retrieving the node certificate, a code sample will query the Ledger network to get a quote, which is then validated using the Host Verify binaries. If the verification succeeds, the code sample proceeds to Ledger operations.

## Users

Users can validate the authenticity of Confidential Ledger nodes to confirm they are indeed interfacing with their Ledger’s enclave. You can build trust in Confidential Ledger nodes in a few ways, which can be stacked on one another to increase the overall level of confidence. As such, Steps 1-2 help build confidence in that Confidential Ledger enclave as part of the initial TLS handshake and authentication within functional workflows. Beyond that, a persistent client connection is maintained between the user’s client and the Confidential Ledger.

- **Validating the Confidential Ledger node**: This is accomplished by querying the identity service hosted by Microsoft, which provides a network cert and thus helps verify that the Ledger node is presenting a cert endorsed/signed by the network cert for that specific instance. Similar to PKI-based HTTPS, a server’s cert is signed by a well-known Certificate Authority (CA) or intermediate CA. In the case of Confidential Ledger, the CA cert is returned by an Identity service in the form of a network cert. This is an important confidence building measure for users of Confidential Ledger. If this node cert isn’t signed by the returned network cert, the client connection should fail (as implemented in the sample code).
- **Validate the Confidential Ledger enclave**: The Confidential Ledger runs in an Intel® SGX enclave that’s represented by a Quote, a data blob generated inside that enclave. It can be used by any other entity to verify that the quote has been produced from an application running with Intel® SGX protections. The quote is structured in a way that enables easy verification. It contains claims that help identify various properties of the enclave and the application that it’s running. This is an important confidence building mechanism for users of the Confidential Ledger. This can be accomplished by calling a functional workflow API to get an enclave quote. The client connection should fail if the quote is invalid. The retrieved quote can then be validated with the open_enclaves Host_Verify tool. More details about this can be found here.

## Next steps

- [Overview of Microsoft Azure Confidential Ledger](overview.md)
- [Azure Confidential Ledger architecture](architecture.md)
