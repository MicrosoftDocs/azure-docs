---
title: Transport Layer Security in Azure Backup
description: Learn how to enable Azure Backup to use the encryption protocol Transport Layer Security (TLS) to keep data secure when being transferred over a network.
ms.topic: conceptual
ms.date: 09/20/2022
author: AbhishekMallick-MS
ms.author: v-abhmallick
---

# Transport Layer Security in Azure Backup

Transport Layer Security (TLS) is an encryption protocol that keeps data secure when being transferred over a network. Azure Backup uses transport layer security to protect the privacy of backup data being transferred. This article describes steps to enable the TLS 1.2 protocol, which provides improved security over previous versions.

## Earlier versions of Windows

If the machine is running earlier versions of Windows, the corresponding updates noted below must be installed and the registry changes documented in the KB articles must be applied.

|Operating system  |KB article |
|---------|---------|
|Windows Server 2008 SP2 | <https://support.microsoft.com/help/4019276> |
|Windows Server 2008 R2, Windows 7, Windows Server 2012 | <https://support.microsoft.com/help/3140245> |

>[!NOTE]
>The update will install the required protocol components. After installation, you must make the registry key changes mentioned in the KB articles above to properly enable the required protocols.

## Verify Windows registry

### Configuring SChannel protocols

The following registry keys ensure that the TLS 1.2 protocol is enabled at the SChannel component level:

```reg
[HKEY_LOCAL_MACHINE\SYSTEM\CurrentControlSet\Control\SecurityProviders\SCHANNEL\Protocols\TLS 1.2\Client]
    "Enabled"=dword:00000001

[HKEY_LOCAL_MACHINE\SYSTEM\CurrentControlSet\Control\SecurityProviders\SCHANNEL\Protocols\TLS 1.2\Client]
    "DisabledByDefault"=dword:00000000
```

>[!NOTE]
>The values shown are set by default in Windows Server 2012 R2 and newer versions. For these versions of Windows, if the registry keys are absent, they don't need to be created.

### Configuring .NET Framework

The following registry keys configure .NET Framework to support strong cryptography. You can read more about [configuring .NET Framework here](/dotnet/framework/network-programming/tls#configuring-schannel-protocols-in-the-windows-registry).

```reg
[HKEY_LOCAL_MACHINE\SOFTWARE\Microsoft\.NETFramework\v4.0.30319]
    "SystemDefaultTlsVersions"=dword:00000001
    "SchUseStrongCrypto" = dword:00000001

[HKEY_LOCAL_MACHINE\SOFTWARE\WOW6432Node\Microsoft\.NETFramework\v4.0.30319]
    "SystemDefaultTlsVersions"=dword:00000001
    "SchUseStrongCrypto" = dword:00000001
```

## Azure TLS certificate changes

Azure TLS/SSL endpoints now contain updated certificates chaining up to new root CAs. Ensure that the following changes include the updated root CAs.  [Learn more](../security/fundamentals/tls-certificate-changes.md#what-changed) about the possible impacts on your applications.

Earlier, most of the TLS certificates, used by Azure services, chained up to the following Root CA:

Common name of CA | Thumbprint (SHA1)
--- | ---
[Baltimore CyberTrust Root](https://cacerts.digicert.com/BaltimoreCyberTrustRoot.crt) | d4de20d05e66fc53fe1a50882c78db2852cae474

Now, TLS certificates, used by Azure services, helps to chain up to one of the following Root CAs:

Common name of CA | Thumbprint (SHA1)
--- | ---
[DigiCert Global Root G2](https://cacerts.digicert.com/DigiCertGlobalRootG2.crt) | df3c24f9bfd666761b268073fe06d1cc8d4f82a4
[DgiCert Global Root CA](https://cacerts.digicert.com/DigiCertGlobalRootG2.crt) | a8985d3a65e5e5c4b2d7d66d40c6dd2fb19c5436
[Baltimore CyberTrust Root](https://cacerts.digicert.com/BaltimoreCyberTrustRoot.crt)| d4de20d05e66fc53fe1a50882c78db2852cae474
[D-TRUST Root Class 3 CA 2 2009](https://www.d-trust.net/cgi-bin/D-TRUST_Root_Class_3_CA_2_2009.crt) | 58e8abb0361533fb80f79b1b6d29d3ff8d5f00f0
[Microsoft RSA Root Certificate Authority 2017](https://www.microsoft.com/pkiops/certs/Microsoft%20RSA%20Root%20Certificate%20Authority%202017.crt) | 73a5e64a3bff8316ff0edccc618a906e4eae4d74
[Microsoft ECC Root Certificate Authority 2017](https://www.microsoft.com/pkiops/certs/Microsoft%20ECC%20Root%20Certificate%20Authority%202017.crt) | 999a64c37ff47d9fab95f14769891460eec4c3c5

## Frequently asked questions

### Why enable TLS 1.2?

TLS 1.2 is more secure than previous cryptographic protocols such as SSL 2.0, SSL 3.0, TLS 1.0, and TLS 1.1. Azure Backup services already fully support TLS 1.2.

### What determines the encryption protocol used?

The highest protocol version supported by both the client and server is negotiated to establish the encrypted conversation. For more information on the TLS handshake protocol, see [Establishing a Secure Session by using TLS](/windows/win32/secauthn/tls-handshake-protocol#establishing-a-secure-session-by-using-tls).

### What is the impact of not enabling TLS 1.2?

For improved security from protocol downgrade attacks, Azure Backup is beginning to disable TLS versions older than 1.2 in a phased manner. This is part of a long-term shift across services to disallow legacy protocol and cipher suite connections. Azure Backup services and components fully support TLS 1.2. However, Windows versions lacking required updates or certain customized configurations can still prevent TLS 1.2 protocols being offered. This can cause failures including but not limited to one or more of the following:

- Backup and restore operations may fail.
- The backup components connections failures with error 10054 (An existing connection was forcibly closed by the remote host).
- Services related to Azure Backup won't stop or start as usual.

## Additional resources

- [Transport Layer Security Protocol](/windows/win32/secauthn/transport-layer-security-protocol)
- [Ensuring support for TLS 1.2 across deployed operating systems](/security/engineering/solving-tls1-problem#ensuring-support-for-tls-12-across-deployed-operating-systems)
- [Transport layer security (TLS) best practices with the .NET Framework](/dotnet/framework/network-programming/tls)