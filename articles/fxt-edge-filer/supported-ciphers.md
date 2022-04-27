---
title: 'Supported encryption ciphers for Azure FXT Edge Filer'
description: List of encryption standards used by FXT Edge Filer clusters.
author: femila
ms.author: femila
ms.service: fxt-edge-filer
ms.topic: conceptual
ms.date: 05/20/2021
---

# Supported encryption standards for Azure FXT Edge Filer

This document describes encryption standards needed for Azure FXT Edge Filer. These standards are implemented as of the operating system version 5.1.1.2.

These standards apply to [Avere vFXT for Azure](../avere-vfxt/index.yml) as well as to Azure FXT Edge Filer.

Any administrative or infrastructure system that connects to the Azure FXT Edge Filer cache or to individual nodes must meet these standards.

(Client machines mount the cache using NFS, so these encryption requirements don't apply. Use other reasonable measures to ensure their security.)

## TLS standard

* TLS1.2 must be enabled
* SSL V2 and V3 must be disabled

TLS1.0 and TLS1.1 can be used if absolutely necessary for backward compatibility with private object stores, but it's better to upgrade your private storage to modern security standards. Contact Microsoft Customer Service and Support to learn more.

## Permitted cipher suites

Azure FXT Edge Filer permits the following TLS cipher suites to be negotiated:

* ECDHE-ECDSA-AES128-GCM-SHA256
* ECDHE-ECDSA-AES256-GCM-SHA384
* ECDHE-RSA-AES128-GCM-SHA256
* ECDHE-RSA-AES256-GCM-SHA384
* ECDHE-ECDSA-AES128-SHA256
* ECDHE-ECDSA-AES256-SHA384
* ECDHE-RSA-AES128-SHA256
* ECDHE-RSA-AES256-SHA384

The cluster administrative HTTPS interface (used for the Control Panel web GUI and administrative RPC connections) supports only the above cipher suites and TLS1.2. No other protocols or cipher suites are supported when connecting to the administrative interface.

## SSH server access

These standards apply to the SSH server that is embedded in these products.

The SSH server does not allow remote login as the superuser "root". If remote SSH access is required under the guidance of Microsoft Customer Service and Support, log in as the SSH “admin” user, which has a restricted shell.

The following SSH cipher suites are available on the cluster SSH server. Make sure that any client that uses SSH to connect to the cluster has up-to-date software that meets these standards.

### SSH encryption standards

| Type | Supported values |
|--|--|
| Ciphers | aes256-gcm@openssh.com</br> aes128-gcm@openssh.com</br> aes256-ctr</br> aes128-ctr |
| MACs | hmac-sha2-512-etm@openssh.com</br> hmac-sha2-256-etm@openssh.com</br> hmac-sha2-512</br> hmac-sha2-256 |
| KEX algorithms | ecdh-sha2-nistp521</br> ecdh-sha2-nistp384</br> ecdh-sha2-nistp256</br> diffie-hellman-group-exchange-sha256 |

## Next steps

* Learn how to [add storage](add-storage.md) to the Azure FXT Edge Filer cluster
* [Connect to the control panel](cluster-create.md#open-the-settings-pages) to administer the cluster
* [Mount clients](mount-clients.md) to access data from the cluster
* [Contact support](support-ticket.md) to learn more about encryption standards
