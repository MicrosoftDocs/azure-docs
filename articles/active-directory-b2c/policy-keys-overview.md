---
title: Policy keys overview - Azure Active Directory B2C
description: Learn about the types of encryption policy keys that can be used in Azure Active Directory B2C for signing and validating tokens, client secrets, certificates, and passwords.
services: active-directory-b2c
author: kengaderdus
manager: CelesteDG

ms.service: active-directory
ms.workload: identity
ms.topic: conceptual
ms.date: 09/20/2021
ms.author: kengaderdus
ms.subservice: B2C
zone_pivot_groups: b2c-policy-type
---

# Overview of policy keys in Azure Active Directory B2C

[!INCLUDE [active-directory-b2c-choose-user-flow-or-custom-policy](../../includes/active-directory-b2c-choose-user-flow-or-custom-policy.md)]

::: zone pivot="b2c-user-flow"

[!INCLUDE [active-directory-b2c-limited-to-custom-policy](../../includes/active-directory-b2c-limited-to-custom-policy.md)]

::: zone-end

::: zone pivot="b2c-custom-policy"

Azure Active Directory B2C (Azure AD B2C) stores secrets and certificates in the form of policy keys to establish trust with the services it integrates with. These trusts consist of:

- External identity providers
- Connecting with [REST API services](restful-technical-profile.md)
- Token signing and encryption

 This article discusses what you need to know about the policy keys that are used by Azure AD B2C.

> [!NOTE]
> Currently, configuration of policy keys is limited to [custom policies](./user-flow-overview.md) only.

You can configure secrets and certificates for establishing trust between services in the Azure portal under the **Policy keys** menu. Keys can be symmetric or asymmetric. *Symmetric* cryptography, or private key cryptography, is where a shared secret is used to both encrypt and decrypt the data. *Asymmetric* cryptography, or public key cryptography, is a cryptographic system that uses pairs of keys, consisting of public keys that are shared with the relying party application and private keys that are known only to Azure AD B2C.

## Policy keyset and keys

The top-level resource for policy keys in Azure AD B2C is the **Keyset** container. Each keyset contains at least one **Key**. A key has following attributes:

| Attribute |  Required | Remarks |
| --- | --- |--- |
| `use` | Yes | Usage: Identifies the intended use of the public key. Encrypting data `enc`, or verifying the signature on data `sig`.|
| `nbf`| No | Activation date and time. |
| `exp`| No | Expiration date and time. |

We recommend setting the key activation and expiration values according to your PKI standards. You might need to rotate these certificates periodically for security or policy reasons. For example, you might have a policy to rotate all your certificates every year.

To create a key, you can choose one of the following methods:

- **Manual** - Create a secret with a string you define. The secret is a symmetric key. You can set the activation and expiration dates.
- **Generated** - Auto-generate a key. You can set activation and expiration dates. There are two options:
  - **Secret** - Generates a symmetric key.
  - **RSA** - Generates a key pair (asymmetric keys).
- **Upload** - Upload a certificate, or a PKCS12 key. The certificate must contain the private and public keys (asymmetric keys).

## Key rollover

For security purposes, Azure AD B2C can roll over keys periodically, or immediately in case of emergency. Any application, identity provider, or REST API that integrates with Azure AD B2C should be prepared to handle a key rollover event, no matter how frequently it may occur. Otherwise, if your application or Azure AD B2C attempts to use an expired key to perform a cryptographic operation, the sign-in request will fail.

If an Azure AD B2C keyset has multiple keys, only one of the keys is active at any one time, based on the following criteria:

- The key activation is based on the **activation date**.
  - The keys are sorted by activation date in ascending order. Keys with activation dates further into the future appear lower in the list. Keys without an activation date are located at the bottom of the list.
  - When the current date and time is greater than a key's activation date, Azure AD B2C will activate the key and stop using the prior active key.
- When the current key's expiration time has elapsed and the key container contains a new key with valid *not before* and *expiration* times, the new key will become active automatically.
- When the current key's expiration time has elapsed and the key container *does not* contain a new key with valid *not before* and *expiration* times, Azure AD B2C won't be able to use the expired key. Azure AD B2C will raise an error message within a dependant component of your custom policy. To avoid this issue, you can create a default key without activation and expiration dates as a safety net.
- The key's endpoint (JWKS URI) of the OpenId Connect well-known configuration endpoint reflects the keys configured in the Key Container, when the Key is referenced in the [JwtIssuer Technical Profile](./jwt-issuer-technical-profile.md). An application using an OIDC library will automatically fetch this metadata to ensure it uses the correct keys to validate tokens. For more information, learn how to use [Microsoft Authentication Library](../active-directory/develop/msal-b2c-overview.md), which always fetches the latest token signing keys automatically.

## Policy key management

To get the current active key within a key container, use the Microsoft Graph API [getActiveKey](/graph/api/trustframeworkkeyset-getactivekey) endpoint.

To add or delete signing and encryption keys:

1. Sign in to the [Azure portal](https://portal.azure.com).
1. If you have access to multiple tenants, select the **Settings** icon in the top menu to switch to your Azure AD B2C tenant from the **Directories + subscriptions** menu.
1. In the Azure portal, search for and select **Azure AD B2C**.
1. On the overview page, under **Policies**, select **Identity Experience Framework**.
1. Select **Policy Keys** 
    1. To add a new key, select **Add**.
    1. To remove a new key, select the key, and then select **Delete**. To delete the key, type the name of the key container to delete. Azure AD B2C will delete the key and create a copy of the key with the suffix .bak.

### Replace a key

The keys in a keyset are not replaceable or removable. If you need to change an existing key:

- We recommend adding a new key with the **activation date** set to the current date and time. Azure AD B2C will activate the new key and stop using the prior active key.
- Alternatively, you can create a new keyset with the correct keys. Update your policy to use the new keyset, and then remove the old keyset. 

## Next steps

- Learn how to use Microsoft Graph to automate a [keyset](microsoft-graph-operations.md#trust-framework-policy-keyset) and [policy keys](microsoft-graph-operations.md#trust-framework-policy-key) deployment.

::: zone-end
