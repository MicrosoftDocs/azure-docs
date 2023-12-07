---
title: How to configure OpenSSL for Linux
titleSuffix: Azure AI services
description: Learn how to configure OpenSSL for Linux.
#services: cognitive-services
author: jhakulin
manager: nitinme
ms.service: azure-ai-speech
ms.custom: devx-track-extended-java, devx-track-go, devx-track-python
ms.topic: how-to
ms.date: 06/22/2022
ms.author: jhakulin
zone_pivot_groups: programming-languages-set-three
---

# Configure OpenSSL for Linux

With the Speech SDK, [OpenSSL](https://www.openssl.org) is dynamically configured to the host-system version. 

> [!NOTE]
> This article is only applicable where the Speech SDK is [supported on Linux](speech-sdk.md#supported-languages).

To ensure connectivity, verify that OpenSSL certificates have been installed in your system. Run a command:
```bash
openssl version -d
```

The output on Ubuntu/Debian based systems should be:
```
OPENSSLDIR: "/usr/lib/ssl"
```

Check whether there's a `certs` subdirectory under OPENSSLDIR. In the example above, it would be `/usr/lib/ssl/certs`.

* If the `/usr/lib/ssl/certs` exists, and if it contains many individual certificate files (with `.crt` or `.pem` extension), there's no need for further actions.

* If OPENSSLDIR is something other than `/usr/lib/ssl` or there's a single certificate bundle file instead of multiple individual files, you need to set an appropriate SSL environment variable to indicate where the certificates can be found.

## Examples
Here are some example environment variables to configure per OpenSSL directory.

- OPENSSLDIR is `/opt/ssl`. There's a `certs` subdirectory with many `.crt` or `.pem` files.
Set the environment variable `SSL_CERT_DIR` to point at `/opt/ssl/certs` before using the Speech SDK. For example:
```bash
export SSL_CERT_DIR=/opt/ssl/certs
```

- OPENSSLDIR is `/etc/pki/tls` (like on RHEL/CentOS based systems). There's a `certs` subdirectory with a certificate bundle file, for example `ca-bundle.crt`.
Set the environment variable `SSL_CERT_FILE` to point at that file before using the Speech SDK. For example:
```bash
export SSL_CERT_FILE=/etc/pki/tls/certs/ca-bundle.crt
```

## Certificate revocation checks

When the Speech SDK connects to the Speech service, it checks the Transport Layer Security (TLS/SSL) certificate. The Speech SDK verifies that the certificate reported by the remote endpoint is trusted and hasn't been revoked. This verification provides a layer of protection against attacks involving spoofing and other related vectors. The check is accomplished by retrieving a certificate revocation list (CRL) from a certificate authority (CA) used by Azure. A list of Azure CA download locations for updated TLS CRLs can be found in [this document](../../security/fundamentals/tls-certificate-changes.md).

If a destination posing as the Speech service reports a certificate that's been revoked in a retrieved CRL, the SDK will terminate the connection and report an error via a `Canceled` event. The authenticity of a reported certificate can't be checked without an updated CRL. Therefore, the Speech SDK will also treat a failure to download a CRL from an Azure CA location as an error.

> [!WARNING]
> If your solution uses proxy or firewall it should be configured to allow access to all certificate revocation list URLs used by Azure. Note that many of these URLs are outside of `microsoft.com` domain, so allowing access to `*.microsoft.com` is not enough. See [this document](../../security/fundamentals/tls-certificate-changes.md) for details. In exceptional cases you may ignore CRL failures (see [the correspondent section](#bypassing-or-ignoring-crl-failures)), but such configuration is strongly not recommended, especially for production scenarios.

### Large CRL files (>10 MB)

One cause of CRL-related failures is the use of large CRL files. This class of error is typically only applicable to special environments with extended CA chains. Standard public endpoints shouldn't encounter this class of issue.

The default maximum CRL size used by the Speech SDK (10 MB) can be adjusted per config object. The property key for this adjustment is `CONFIG_MAX_CRL_SIZE_KB` and the value, specified as a string, is by default "10000" (10 MB). For example, when creating a `SpeechRecognizer` object (that manages a connection to the Speech service), you can set this property in its `SpeechConfig`. In the snippet below, the configuration is adjusted to permit a CRL file size up to 15 MB.

::: zone pivot="programming-language-csharp"

```csharp
config.SetProperty("CONFIG_MAX_CRL_SIZE_KB"", "15000");
```

::: zone-end

::: zone pivot="programming-language-cpp"

```cpp
config->SetProperty("CONFIG_MAX_CRL_SIZE_KB"", "15000");
```

::: zone-end

::: zone pivot="programming-language-java"

```java
config.setProperty("CONFIG_MAX_CRL_SIZE_KB"", "15000");
```

::: zone-end

::: zone pivot="programming-language-python"

```python
speech_config.set_property_by_name("CONFIG_MAX_CRL_SIZE_KB"", "15000")
```

::: zone-end

::: zone pivot="programming-language-go"

```go
speechConfig.properties.SetPropertyByString("CONFIG_MAX_CRL_SIZE_KB", "15000")
```

::: zone-end

### Bypassing or ignoring CRL failures

If an environment can't be configured to access an Azure CA location, the Speech SDK will never be able to retrieve an updated CRL. You can configure the SDK either to continue and log download failures or to bypass all CRL checks.

> [!WARNING]
> CRL checks are a security measure and bypassing them increases susceptibility to attacks. They should not be bypassed without thorough consideration of the security implications and alternative mechanisms for protecting against the attack vectors that CRL checks mitigate.

To continue with the connection when a CRL can't be retrieved, set the property `"OPENSSL_CONTINUE_ON_CRL_DOWNLOAD_FAILURE"` to `"true"`. An attempt will still be made to retrieve a CRL and failures will still be emitted in logs, but connection attempts will be allowed to continue.

::: zone pivot="programming-language-csharp"

```csharp
config.SetProperty("OPENSSL_CONTINUE_ON_CRL_DOWNLOAD_FAILURE", "true");
```

::: zone-end

::: zone pivot="programming-language-cpp"

```cpp
config->SetProperty("OPENSSL_CONTINUE_ON_CRL_DOWNLOAD_FAILURE", "true");
```

::: zone-end

::: zone pivot="programming-language-java"

```java
config.setProperty("OPENSSL_CONTINUE_ON_CRL_DOWNLOAD_FAILURE", "true");
```

::: zone-end

::: zone pivot="programming-language-python"

```python
speech_config.set_property_by_name("OPENSSL_CONTINUE_ON_CRL_DOWNLOAD_FAILURE", "true")
```

::: zone-end

::: zone pivot="programming-language-go"

```go

speechConfig.properties.SetPropertyByString("OPENSSL_CONTINUE_ON_CRL_DOWNLOAD_FAILURE", "true")
```

::: zone-end

To turn off certificate revocation checks, set the property `"OPENSSL_DISABLE_CRL_CHECK"` to `"true"`. Then, while connecting to the Speech service, there will be no attempt to check or download a CRL and no automatic verification of a reported TLS/SSL certificate.

::: zone pivot="programming-language-csharp"

```csharp
config.SetProperty("OPENSSL_DISABLE_CRL_CHECK", "true");
```

::: zone-end

::: zone pivot="programming-language-cpp"

```cpp
config->SetProperty("OPENSSL_DISABLE_CRL_CHECK", "true");
```

::: zone-end

::: zone pivot="programming-language-java"

```java
config.setProperty("OPENSSL_DISABLE_CRL_CHECK", "true");
```

::: zone-end

::: zone pivot="programming-language-python"

```python
speech_config.set_property_by_name("OPENSSL_DISABLE_CRL_CHECK", "true")
```

::: zone-end

::: zone pivot="programming-language-go"

```go
speechConfig.properties.SetPropertyByString("OPENSSL_DISABLE_CRL_CHECK", "true")
```

::: zone-end

### CRL caching and performance

By default, the Speech SDK will cache a successfully downloaded CRL on disk to improve the initial latency of future connections. When no cached CRL is present or when the cached CRL is expired, a new list will be downloaded.

Some Linux distributions don't have a `TMP` or `TMPDIR` environment variable defined, so the Speech SDK won't cache downloaded CRLs. Without `TMP` or `TMPDIR` environment variable defined, the Speech SDK will download a new CRL for each connection. To improve initial connection performance in this situation, you can [create a `TMPDIR` environment variable and set it to the accessible path of a temporary directory.](https://help.ubuntu.com/community/EnvironmentVariables).

## Next steps

- [Speech SDK overview](speech-sdk.md)
- [Install the Speech SDK](quickstarts/setup-platform.md)
