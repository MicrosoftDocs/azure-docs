---
title: Establish trust on Azure confidential ledger
description: Learn how to establish trust on Azure confidential ledger by verifying the node quote
author: settiy
ms.author: settiy
ms.date: 08/18/2023
ms.service: confidential-ledger
ms.custom: devx-track-linux
ms.topic: how-to
---

# Establish trust on Azure confidential ledger

An Azure confidential ledger node executes on top of a Trusted Execution Environment(TEE), such as Intel SGX, which guarantees the confidentiality of the data while in process. The trustworthiness of the platform and the binaries running inside it is guaranteed through a remote attestation process. An Azure confidential ledger requires a node to present a quote before joining the network. The quote report data contains the cryptographic hash of the node's identity public key and the MRENCLAVE value. The node is allowed to join the network if the quote is found to be valid and the MRENCLAVE value is one of the allowed values in the auditable governance.

## Prerequisites

- Install [CCF](https://microsoft.github.io/CCF/main/build_apps/install_bin.html) or the [CCF Python package](https://pypi.org/project/ccf/).
- An Azure confidential ledger instance.

## Verify node quote

The node quote can be downloaded from `https://<ledgername>.confidential-ledger.azure.com` and verified by using the `oeverify` tool that ships with the [Open Enclave SDK](https://github.com/openenclave/openenclave/blob/master/tools/oeverify/README.md) or with the `verify_quote.sh` script. It is installed with the CCF installation or the CCF Python package. For complete details about the script and the supported parameters, refer to [verify_quote.sh](https://microsoft.github.io/CCF/main/use_apps/verify_quote.html).

```bash
verify_quote.sh https://<ledgername>.confidential-ledger.azure.com:443
```
The script checks if the cryptographic hash of the node's identity public key (DER encoded) matches the SGX report data and that the MRENCLAVE value present in the quote is trusted. A list of trusted MRENCLAVE values in the network can be downloaded from the `https://<ledgername>.confidential-ledger.azure.com/node/code` endpoint. An optional `mrenclave` parameter can be supplied to check if the node is running the trusted code. If supplied, the mreclave value in the quote must match it exactly.

## Next steps

* [Overview of Microsoft Azure confidential ledger](overview.md)
* [Azure confidential ledger architecture](architecture.md)