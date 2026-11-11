---
title: TLS Key Exchange Policy
titleSuffix: Azure Front Door
description: Learn how Azure Front Door TLS key exchange policies control classical and hybrid post-quantum key exchanges for client connections to default and custom domains.
author: jessie-jyy
ms.author: yuajia
ms.service: azure-frontdoor
ms.topic: concept-article
ms.date: 11/03/2026
---

# TLS key exchange policy in Azure Front Door

**Applies to:** :heavy_check_mark: Front Door Standard :heavy_check_mark: Front Door Premium

During a TLS handshake, the client and Azure Front Door negotiate a mutually supported key exchange to establish a shared secret for the connection. A *TLS key exchange policy* controls which key exchange methods Front Door can negotiate for a default or custom domain. These methods are represented by TLS supported groups.

Front Door supports classical elliptic-curve key exchanges and hybrid post-quantum key exchanges. Hybrid methods combine a classical key exchange with the Module-Lattice-Based Key-Encapsulation Mechanism (ML-KEM) to help protect the shared secret against quantum-computing threats.

The TLS key exchange policy is separate from the [TLS policy](tls-policy.md), which controls protocol versions and cipher suites, and from the [TLS certificate configuration](domain.md#https-for-custom-domains), which provides the domain's certificate.

## Connection scope

The policy applies to the TLS connection from the **client to Azure Front Door**. Front Door terminates this connection at the edge. If you use HTTPS to your origin, Front Door establishes a separate TLS connection to the origin.

| Connection | Key exchange behavior |
| --- | --- |
| Client to Front Door | Uses the domain's key exchange policy. Hybrid post-quantum methods require TLS 1.3 and a compatible client. |
| Front Door to origin | Uses a separate TLS connection. The domain's key exchange policy doesn't configure this connection. |

> [!IMPORTANT]
> Selecting hybrid post-quantum groups in a domain's key exchange policy controls key establishment on the client-to-Front Door connection. It doesn't configure key exchange on the separate Front Door-to-origin connection.

For more information about the two TLS connections, see [TLS encryption with Azure Front Door](end-to-end-tls.md).

## Policy options

For a custom domain, choose a predefined policy or select the supported groups explicitly with a custom policy. Default Front Door domains use **Standard** and don't support policy customization.

| Policy | Supported groups | When to use |
| --- | --- | --- |
| **Standard** | `SecP256r1MLKEM768`, `X25519MLKEM768`, `prime256v1`, `secp384r1`, `secp521r1` | The default for new and existing profiles and the recommended starting point for most workloads. |
| **Enhanced** | `SecP256r1MLKEM768`, `prime256v1`, `secp384r1`, `secp521r1` | A predefined policy that excludes X25519-based key exchanges. |
| **Custom** | Select from `SecP256r1MLKEM768`, `SecP384r1MLKEM1024`, `X25519MLKEM768`, `prime256v1`, `secp384r1`, `secp521r1`, and `X25519`. | Explicit control for security, compliance, or application-compatibility requirements. |

> [!NOTE]
> The **Standard** policy name refers to the key exchange configuration, not the Front Door pricing tier.

**Standard** is the default key exchange policy for new and existing profiles. Existing profiles default to **Standard** for backward compatibility; no migration is required. Custom domains use **Standard** unless you select another policy. Default Front Door domains always use **Standard**; you can't customize their key exchange policy.

## Supported key exchange methods

The following table lists the supported groups and the TLS versions with which they can be used.

| Key exchange | TLS supported group | TLS versions | Category |
| --- | --- | --- | --- |
| P-256 (`secp256r1`) | `prime256v1` | TLS 1.2, TLS 1.3 | Classical |
| P-384 (`secp384r1`) | `secp384r1` | TLS 1.2, TLS 1.3 | Classical |
| P-521 (`secp521r1`) | `secp521r1` | TLS 1.2, TLS 1.3 | Classical |
| X25519 | `X25519` | TLS 1.2, TLS 1.3 | Classical |
| P-256 + ML-KEM-768 | `SecP256r1MLKEM768` | TLS 1.3 only | Hybrid post-quantum |
| X25519 + ML-KEM-768 | `X25519MLKEM768` | TLS 1.3 only | Hybrid post-quantum |
| P-384 + ML-KEM-1024 | `SecP384r1MLKEM1024` | TLS 1.3 only | Hybrid post-quantum |

### TLS version compatibility

Hybrid methods require TLS 1.3. For a TLS 1.2 connection, Front Door negotiates a compatible classical group from the selected policy.

> [!IMPORTANT]
> If your TLS configuration permits TLS 1.2, include at least one classical group in a custom key exchange policy. A policy that contains only hybrid groups can't support TLS 1.2 clients.

A client must support at least one group in the selected policy to complete the handshake. Including hybrid groups doesn't guarantee that every client connection uses a hybrid method; the negotiated method depends on the client and TLS version.

## Configure the key exchange policy

Configure the policy at the custom-domain level:

1. Choose **Standard**, **Enhanced**, or **Custom** for the domain's TLS key exchange policy.
1. If you choose **Custom**, select the key exchange groups that Front Door can negotiate.
1. Check that the selected groups are compatible with the domain's TLS protocol configuration and your clients. If TLS 1.2 is permitted, include a classical group.
1. Test the configuration with representative clients before you use it for production traffic.

Use the [TLS policy](tls-policy.md) to configure the minimum TLS version and cipher suites separately. Continue to follow the [custom-domain certificate requirements](domain.md#certificate-requirements) when you configure HTTPS.

## Compatibility and rollout considerations

Start with **Standard** unless your requirements call for a different selection. Before changing a policy:

- Test browsers, devices, SDKs, and automated clients to verify that they support a group allowed by the policy.
- If you select **Enhanced**, verify that clients can negotiate a method other than an X25519-based exchange.
- If you select **Custom**, retain the groups required by your supported clients and TLS versions.
- Test latency, network-device compatibility, and connection success rates. Post-quantum exchanges use larger handshake messages.
- Monitor client-side handshake failures and connection errors after deployment.

> [!WARNING]
> If the policy excludes every key exchange method supported by a client, that client can't complete the TLS handshake and can't connect to your application through the domain.

## Related content

- [Configure an Azure Front Door TLS policy](tls-policy.md)
- [TLS encryption with Azure Front Door](end-to-end-tls.md)
- [Configure HTTPS on an Azure Front Door custom domain](standard-premium/how-to-configure-https-custom-domain.md)
- [Domains in Azure Front Door](domain.md)
