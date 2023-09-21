---
title: Transport Layer Security in Azure Site Recovery
description: Learn how to enable Azure Site Recovery to use the encryption protocol Transport Layer Security (TLS) to keep data secure when being transferred over a network.
ms.topic: conceptual
ms.service: site-recovery
ms.date: 11/01/2020
ms.author: ankitadutta
author: ankitaduttaMSFT
---

# Transport Layer Security in Azure Site Recovery

Transport Layer Security (TLS) is an encryption protocol that keeps data secure when being transferred over a network. Azure Site Recovery uses TLS to protect the privacy of data being transferred. Azure Site Recovery now uses TLS 1.2 protocol, for improved security.

## Enable TLS on older versions of Windows

If the machine is running earlier versions of Windows, ensure to install the corresponding updates as detailed below and make the registry changes as documented in the respective KB articles.

|Operating system  |KB article |
|---------|---------|
|Windows Server 2008 SP2 | <https://support.microsoft.com/help/4019276> |
|Windows Server 2008 R2, Windows 7, Windows Server 2012 | <https://support.microsoft.com/help/3140245> |

>[!NOTE]
>The update installs the required components for the protocol. After installation, to enable the required protocols, ensure to update the registry keys as mentioned in the above KB articles.

## Verify Windows registry

### Configure SChannel protocols

The following registry keys ensure that the TLS 1.2 protocol is enabled at the SChannel component level:

```reg
[HKEY_LOCAL_MACHINE\SYSTEM\CurrentControlSet\Control\SecurityProviders\SCHANNEL\Protocols\TLS 1.2\Client]
    "Enabled"=dword:00000001

[HKEY_LOCAL_MACHINE\SYSTEM\CurrentControlSet\Control\SecurityProviders\SCHANNEL\Protocols\TLS 1.2\Client]
    "DisabledByDefault"=dword:00000000
```

>[!NOTE]
>By default, the above registry keys are set in values shown are set in Windows Server 2012 R2 and later versions. For these versions of Windows, if the registry keys are absent, you do not need to create them.

### Configure .NET Framework

Use the following registry keys to configure .NET Framework that supports strong cryptography. Learn more about [configuring .NET Framework here](/dotnet/framework/network-programming/tls#configuring-schannel-protocols-in-the-windows-registry).

```reg
[HKEY_LOCAL_MACHINE\SOFTWARE\Microsoft\.NETFramework\v4.0.30319]
    "SystemDefaultTlsVersions"=dword:00000001
    "SchUseStrongCrypto" = dword:00000001

[HKEY_LOCAL_MACHINE\SOFTWARE\WOW6432Node\Microsoft\.NETFramework\v4.0.30319]
    "SystemDefaultTlsVersions"=dword:00000001
    "SchUseStrongCrypto" = dword:00000001
```

## Frequently asked questions

### Why enable TLS 1.2?

TLS 1.2 is more secure than previous cryptographic protocols such as SSL 2.0, SSL 3.0, TLS 1.0, and TLS 1.1. Azure Site Recovery services fully support TLS 1.2.

### What determines the encryption protocol used?

The highest protocol version supported by both the client and server is negotiated to establish the encrypted conversation. For more information on the TLS handshake protocol, see [Establishing a Secure Session by using TLS](/windows/win32/secauthn/tls-handshake-protocol#establishing-a-secure-session-by-using-tls).

### What is the impact if TLS 1.2 is not enabled?

For improved security from protocol downgrade attacks, Azure Site Recovery is beginning to disable TLS versions older than 1.2. This is part of a long-term shift across services to disallow legacy protocol and cipher suite connections. Azure Site Recovery services and components fully support TLS 1.2. However, Windows versions lacking required updates or certain customized configurations can still prevent TLS 1.2 protocols being offered. This can cause failures including but not limited to one or more of the following:

- Replication may fail at source.
- Azure Site Recovery components connections failures with error 10054 (An existing connection was forcibly closed by the remote host).
- Services related to Azure Site Recovery won't stop or start as usual.

## Additional resources

- [Transport Layer Security Protocol](/windows/win32/secauthn/transport-layer-security-protocol)
- [Ensuring support for TLS 1.2 across deployed operating systems](/security/engineering/solving-tls1-problem#ensuring-support-for-tls-12-across-deployed-operating-systems)
- [Transport layer security (TLS) best practices with the .NET Framework](/dotnet/framework/network-programming/tls)