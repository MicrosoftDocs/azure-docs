---
title: How to configure OpenSSL for Linux
titleSuffix: Azure Cognitive Services
description: Learn how to configure OpenSSL for Linux.
services: cognitive-services
author: jhakulin
manager: nitinme
ms.service: cognitive-services
ms.subservice: speech-service
ms.topic: conceptual
ms.date: 01/16/2020
ms.author: jhakulin
---

# Configure OpenSSL for Linux

When using any Speech SDK version before 1.9.0, [OpenSSL](https://www.openssl.org) is dynamically configured to the host-system version. In later versions of the Speech SDK, OpenSSL (version [1.1.1b](https://mta.openssl.org/pipermail/openssl-announce/2019-February/000147.html)) is statically linked to the core library of the Speech SDK.

To ensure connectivity, verify that OpenSSL certificates have been installed in your system. Run a command:
```bash
openssl version -d
```

The output on Ubuntu/Debian based systems should be:
```
OPENSSLDIR: "/usr/lib/ssl"
```

Check whether there is `certs` subdirectory under OPENSSLDIR. In the example above, it would be `/usr/lib/ssl/certs`.

* If there is `/usr/lib/ssl/certs` and it contains many individual certificate files (with `.crt` or `.pem` extension), there is no need for further actions.

* If OPENSSLDIR is something else than `/usr/lib/ssl` and/or there is a single certificate bundle file instead of multiple individual files, you need to set an appropriate SSL environment variable to indicate where the certificates can be found.

## Examples

- OPENSSLDIR is `/opt/ssl`. There is `certs` subdirectory with many `.crt` or `.pem` files.
Set environment variable `SSL_CERT_DIR` to point at `/opt/ssl/certs` before running a program that uses the Speech SDK. For example:
```bash
export SSL_CERT_DIR=/opt/ssl/certs
```

- OPENSSLDIR is `/etc/pki/tls` (like on RHEL/CentOS based systems). There is `certs` subdirectory with a certificate bundle file, for example `ca-bundle.crt`.
Set environment variable `SSL_CERT_FILE` to point at that file before running a program that uses the Speech SDK. For example:
```bash
export SSL_CERT_FILE=/etc/pki/tls/certs/ca-bundle.crt
```
> [!NOTE]
> It is also worth noting that some distributions of Linux do not have a TMP or TMPDIR environment variable defined. This will cause the Speech SDK to download the Certificate Revocation List (CRL) every time, rather than caching the CRL to disk for reuse until they expire. To improve initial connection performance you can [create an environment variable named TMPDIR and set it to the path of your chosen temporary directory.](https://help.ubuntu.com/community/EnvironmentVariables).

## Next steps

> [!div class="nextstepaction"]
> [About the Speech SDK](speech-sdk.md)
