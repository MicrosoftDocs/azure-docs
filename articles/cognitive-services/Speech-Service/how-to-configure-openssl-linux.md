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
zone_pivot_groups: programming-languages-set-two
ROBOTS: NOINDEX
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

## Certificate Revocation Checks
When connecting to the Speech Service, the Speech SDK will verify that the TLS certificate used by the Speech Service has not been revoked. To conduct this check, the Speech SDK will need access to the CRL distribution points for Certificate Authorities used by Azure. A list of possible CRL download locations can be found in [this document](../../security/fundamentals/tls-certificate-changes.md). If a certificate has been revoked or the CRL cannot be downloaded the Speech SDK will abort the connection and raise the Canceled event.

In the event the network where the Speech SDK is being used from is configured in a manner that does not permit access to the CRL download locations, the CRL check can either be disabled or set to not fail if the CRL cannot be retrieved. This configuration is done through the configuration object used to create a Recognizer object.

To continue with the connection when a CRL cannot be retrieved set the property OPENSSL_CONTINUE_ON_CRL_DOWNLOAD_FAILURE.

::: zone pivot="programming-language-csharp"

```csharp
config.SetProperty("OPENSSL_CONTINUE_ON_CRL_DOWNLOAD_FAILURE", "true");
```

::: zone-end

::: zone pivot="programming-language-cpp"

```C++
config->SetProperty("OPENSSL_CONTINUE_ON_CRL_DOWNLOAD_FAILURE", "true");
```

::: zone-end

::: zone pivot="programming-language-java"

```java
config.setProperty("OPENSSL_CONTINUE_ON_CRL_DOWNLOAD_FAILURE", "true");
```

::: zone-end

::: zone pivot="programming-language-python"

```Python
speech_config.set_property_by_name("OPENSSL_CONTINUE_ON_CRL_DOWNLOAD_FAILURE", "true")?
```

::: zone-end

::: zone pivot="programming-language-more"

```ObjectiveC
[config setPropertyTo:@"true" byName:"OPENSSL_CONTINUE_ON_CRL_DOWNLOAD_FAILURE"];
```

::: zone-end
When set to "true" an attempt will be made to retrieve the CRL and if the retrieval is successful the certificate will be checked for revocation, if the retrieval fails, the connection will be allowed to continue.

To completely disable certificate revocation checks, set the property OPENSSL_DISABLE_CRL_CHECK to "true".
::: zone pivot="programming-language-csharp"

```csharp
config.SetProperty("OPENSSL_DISABLE_CRL_CHECK", "true");
```

::: zone-end

::: zone pivot="programming-language-cpp"

```C++
config->SetProperty("OPENSSL_DISABLE_CRL_CHECK", "true");
```

::: zone-end

::: zone pivot="programming-language-java"

```java
config.setProperty("OPENSSL_DISABLE_CRL_CHECK", "true");
```

::: zone-end

::: zone pivot="programming-language-python"

```Python
speech_config.set_property_by_name("OPENSSL_DISABLE_CRL_CHECK", "true")?
```

::: zone-end

::: zone pivot="programming-language-more"

```ObjectiveC
[config setPropertyTo:@"true" byName:"OPENSSL_DISABLE_CRL_CHECK"];
```

::: zone-end


> [!NOTE]
> It is also worth noting that some distributions of Linux do not have a TMP or TMPDIR environment variable defined. This will cause the Speech SDK to download the Certificate Revocation List (CRL) every time, rather than caching the CRL to disk for reuse until they expire. To improve initial connection performance you can [create an environment variable named TMPDIR and set it to the path of your chosen temporary directory.](https://help.ubuntu.com/community/EnvironmentVariables).

## Next steps

> [!div class="nextstepaction"]
> [About the Speech SDK](speech-sdk.md)