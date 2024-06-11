---
title: Establish trust on Azure confidential ledger
description: Learn how to establish trust on Azure confidential ledger by verifying the node quote
author: settiy
ms.author: settiy
ms.date: 08/18/2023
ms.service: confidential-ledger
ms.custom:
ms.topic: how-to
---

# Establish trust on Azure confidential ledger

An Azure confidential ledger node executes on top of a Trusted Execution Environment(TEE), such as Intel SGX, which guarantees the confidentiality of the data while in process. The trustworthiness of the platform and the binaries running inside it is guaranteed through a remote attestation process. An Azure confidential ledger requires a node to present a quote before joining the network. The quote report data contains the cryptographic hash of the node's identity public key and the MRENCLAVE value. The node is allowed to join the network if the quote is found to be valid and the MRENCLAVE value is one of the allowed values in the auditable governance.

## Prerequisites

- Ubuntu 20.04-LTS 64-bit
- Install [CCF](https://microsoft.github.io/CCF/main/build_apps/install_bin.html) or the [CCF Python package](https://pypi.org/project/ccf/)
- Install the [Open Enclave Host-verify SDK](https://github.com/openenclave/openenclave/blob/master/docs/GettingStartedDocs/install_host_verify_Ubuntu_20.04.md)
- Install [jq](https://jqlang.github.io/jq/download/)

## Verify node quote

### Download the service identity

It is used to verify the identity of the node that the client is connected to and establish a secure communication channel with it. The following command downloads the service identity, formats it and saves it to service_cert.pem.

```bash
curl https://identity.confidential-ledger.core.azure.com/ledgerIdentity/<ledgername> --silent | jq '.ledgerTlsCertificate' | xargs echo -e > service_cert.pem
```

### Verify quote

The node quote can be downloaded from `https://<ledgername>.confidential-ledger.azure.com` and verified by using the `oeverify` tool that ships with the [Open Enclave SDK](https://github.com/openenclave/openenclave/blob/master/tools/oeverify/README.md) or with the `verify_quote.sh` script. It is installed with the CCF installation or the CCF Python package. For complete details about the script and the supported parameters, refer to [verify_quote.sh](https://microsoft.github.io/CCF/main/use_apps/verify_quote.html).

```bash
/opt/ccf_virtual/bin/verify_quote.sh https://<ledgername>.confidential-ledger.azure.com:443 --cacert service_cert.pem
```
The script checks if the cryptographic hash of the node's identity public key (DER encoded) matches the SGX report data and that the MRENCLAVE value present in the quote is trusted. A list of trusted MRENCLAVE values in the network can be downloaded from the `https://<ledgername>.confidential-ledger.azure.com/node/code` endpoint. An optional `mrenclave` parameter can be supplied to check if the node is running the trusted code. If supplied, the mreclave value in the quote must match it exactly.

## Next steps

* [Overview of Microsoft Azure confidential ledger](overview.md)
* [Azure confidential ledger architecture](architecture.md)
