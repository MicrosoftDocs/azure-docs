---
title: Authenticating Azure confidential ledger nodes
description: Authenticating Azure confidential ledger nodes
services: confidential-ledger
author: msmbaldwin
ms.service: confidential-ledger
ms.topic: overview
ms.date: 11/14/2022
ms.author: mbaldwin

---
# Authenticating Azure confidential ledger nodes

Azure confidential ledger nodes can be authenticated by code samples and by users.

## Code samples

When initializing, code samples get the node certificate by querying the Identity Service. After retrieving the node certificate, a code sample will query the ledger to get a quote, which is then validated using the Host Verify binaries. If the verification succeeds, the code sample proceeds to ledger operations.

## Users

Users can validate the authenticity of Azure confidential ledger nodes to confirm they are indeed interfacing with their ledger’s enclave. You can build trust in Azure confidential ledger nodes in a few ways, which can be stacked on one another to increase the overall level of confidence. As such, steps 1 and 2 are important confidence building mechanisms for users of Azure confidential ledger enclave as part of the initial TLS handshake and authentication within functional workflows. Beyond that, a persistent client connection is maintained between the user's client and the confidential ledger.

1. **Validating a confidential ledger node**: This is accomplished by querying the identity service hosted by Microsoft, which provides a service certificate and thus helps verify that the ledger node is presenting a certificate endorsed/signed by the service certificate for that specific instance. Using PKI-based HTTPS, a server’s certificate is signed by a well-known Certificate Authority (CA) or intermediate CA. In the case of Azure confidential ledger, the CA certificate is returned by the Identity Service in the form of the service certificate. If this node certificate isn’t signed by the returned service certificate, the client connection should fail (as implemented in the sample code).

2. **Validating a confidential ledger enclave**: A confidential ledger runs in an Intel® SGX enclave that’s represented by a remote attestation report (or quote), a data blob generated inside that enclave. It can be used by any other entity to verify that the quote has been produced from an application running with Intel® SGX protections. The quote contains claims that help identify various properties of the enclave and the application that it’s running. In particular, it contains the SHA-256 hash of the public key contained in the confidential ledger node's certificate. The quote of a confidential ledger node can be retrieved by calling a functional workflow API. The retrieved quote can then be validated following the steps described [here](https://microsoft.github.io/CCF/main/use_apps/verify_quote.html).

## Next steps

- [Overview of Microsoft Azure confidential ledger](overview.md)
- [Azure confidential ledger architecture](architecture.md)
