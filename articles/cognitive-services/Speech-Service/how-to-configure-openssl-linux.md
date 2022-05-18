---
title: How to configure OpenSSL for Linux
titleSuffix: Azure Cognitive Services
description: Learn how to configure OpenSSL for Linux.
services: cognitive-services
author: jhakulin
manager: nitinme
ms.service: cognitive-services
ms.subservice: speech-service
ms.topic: how-to
ms.date: 01/16/2020
ms.author: jhakulin
zone_pivot_groups: programming-languages-set-two
ROBOTS: NOINDEX
ms.devlang: cpp, csharp, java, python
---

# Configure OpenSSL for Linux

With the Speech SDK version 1.19.0 and higher, [OpenSSL](https://www.openssl.org) is dynamically configured to the host-system version. In previous versions, OpenSSL is statically linked to the core library of the SDK.

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

## Certificate revocation checks

When the Speech SDK connects to the Speech Service, it verifies that the Transport Layer Security (TLS) certificate reported by the remote endpoint is trusted and has not been revoked. This provides a layer of protection against attacks involving spoofing and other related vectors. The check is accomplished by retrieving a certificate revocation list (CRL) from a certificate authority (CA) used by Azure. A list of Azure CA download locations for updated TLS CRLs can be found in [this document](../../security/fundamentals/tls-certificate-changes.md).

If a destination posing as the Speech Service reports a certificate that's been revoked in a retrieved CRL, the SDK will terminate the connection and report an error via a `Canceled` event. Because the authenticity of a reported certificate cannot be checked without an updated CRL, the Speech SDK will by default also treat a failure to download a CRL from an Azure CA location as an error.

### Large CRL files (>10MB)

One cause of CRL-related failures is the use of particularly large CRL files. This is typically only applicable to special environments with extended CA chains and standard, public endpoints should not encounter this class of issue.

The default maximum CRL size used by the Speech SDK (10MB) can be adjusted per config object. The property key for this adjustment is `CONFIG_MAX_CRL_SIZE_KB` and the value, specified as a string, is by default "10000" (10MB). For example, when creating a `SpeechRecognizer` object (that manages a connection to the Speech Service), you can set this property in its `SpeechConfig`. In the snippet below, the configuration is adjusted to permit a CRL file size up to 15MB.

::: zone pivot="programming-language-csharp"

```csharp
config.SetProperty("CONFIG_MAX_CRL_SIZE_KB"", "15000");
```

::: zone-end

::: zone pivot="programming-language-cpp"

```C++
config->SetProperty("CONFIG_MAX_CRL_SIZE_KB"", "15000");
```

::: zone-end

::: zone pivot="programming-language-java"

```java
config.setProperty("CONFIG_MAX_CRL_SIZE_KB"", "15000");
```

::: zone-end

::: zone pivot="programming-language-python"

```Python
speech_config.set_property_by_name("CONFIG_MAX_CRL_SIZE_KB"", "15000")
```

::: zone-end

::: zone pivot="programming-language-more"

```ObjectiveC
[config setPropertyTo:@"15000" byName:"CONFIG_MAX_CRL_SIZE_KB"];
```

::: zone-end

### Bypassing or ignoring CRL failures

If an environment cannot be configured to access an Azure CA location, the Speech SDK will never be able to retrieve an updated CRL. You can configure the SDK either to continue and log download failures or to bypass all CRL checks.

> [!WARNING]
> CRL checks are a security measure and bypassing them increases susceptibility to attacks. They should not be bypassed without thorough consideration of the security implications and alternative mechanisms for protecting against the attack vectors that CRL checks mitigate.

To continue with the connection when a CRL cannot be retrieved, set the property `"OPENSSL_CONTINUE_ON_CRL_DOWNLOAD_FAILURE"` to `"true"`. An attempt will still be made to retrieve a CRL and failures will still be emitted in logs, but connection attempts will be allowed to continue.

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
speech_config.set_property_by_name("OPENSSL_CONTINUE_ON_CRL_DOWNLOAD_FAILURE", "true")
```

::: zone-end

::: zone pivot="programming-language-more"

```ObjectiveC
[config setPropertyTo:@"true" byName:"OPENSSL_CONTINUE_ON_CRL_DOWNLOAD_FAILURE"];
```

::: zone-end

To turn off certificate revocation checks, set the property `"OPENSSL_DISABLE_CRL_CHECK"` to `"true"`. Then, while connecting to the Speech Service, there will be no attempt to check or download a CRL and no automatic verification of a reported TLS certificate.

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
speech_config.set_property_by_name("OPENSSL_DISABLE_CRL_CHECK", "true")
```

::: zone-end

::: zone pivot="programming-language-more"

```ObjectiveC
[config setPropertyTo:@"true" byName:"OPENSSL_DISABLE_CRL_CHECK"];
```

::: zone-end

### CRL caching and performance

By default, the Speech SDK will cache a successfully downloaded CRL on disk to improve the initial latency of future connections. When no cached CRL is present or when the cached CRL is expired, a new list will be downloaded.

Some Linux distributions do not have a `TMP` or `TMPDIR` environment variable defined. This will prevent the Speech SDK from caching downloaded CRLs and cause it to download a new CRL upon every connection. To improve initial connection performance in this situation, you can [create a `TMPDIR` environment variable and set it to the accessible path of a temporary directory.](https://help.ubuntu.com/community/EnvironmentVariables).

## Next steps

> [!div class="nextstepaction"]
> [About the Speech SDK](speech-sdk.md)
