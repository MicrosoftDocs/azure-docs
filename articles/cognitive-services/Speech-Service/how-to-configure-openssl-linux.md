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

When using any Speech SDK version prior to 1.9.0, OpenSSL is dynamically configured to the host-system version. In later versions of the Speech SDK, OpenSSL (version [1.1.1b](https://mta.openssl.org/pipermail/openssl-announce/2019-February/000147.html)) is statically linked to the core library.

## Troubleshoot connectivity

If there are connection failures with the Speech SDK 1.9.0 release, check that the OpenSSL `ssl/certs` directory exists in `/usr/lib` directory under the Linux system. If the `ssl/certs` directory *does not* exist, check where OpenSSL is installed in your system, using the following command:

```sh
which openssl
```

Then, locate the OpenSSL `certs` directory, and copy the contents of that directory into `/usr/lib/ssl/certs` directory.

## Next steps

> [!div class="nextstepaction"]
> [About the Speech SDK](speech-sdk.md)