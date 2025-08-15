---
title: 'Troubleshoot site-to-site connections with digital certificate authentication'
description: Learn how to troubleshoot Azure Site-to-Site VPN Gateway connections that use digital certificate authentication. Resolve error codes, fix connectivity problems, and ensure stable VPN operations.
titleSuffix: Azure VPN Gateway
author: duongau
ms.service: azure-vpn-gateway
ms.topic: troubleshooting
ms.date: 08/13/2025
ms.author: duau
# Customer intent: As a network administrator, I want to troubleshoot Azure Site-to-Site VPN connection issues, so that I can ensure stable connectivity and minimize disruptions for users.
---

# Troubleshoot site-to-site connections with digital certificate authentication

This article helps you troubleshoot Azure Site-to-Site VPN Gateway connections that use digital certificate authentication**. It lists common error codes, explains their causes, and provides recommended actions to resolve connectivity issues. Use this guide to maintain stable VPN operations and minimize disruptions for users.

## Common error codes and recommended actions

| Error code | Error message | Recommended action |
|--|--|--|
| CannotSetConnectionAuthenticationForExpressRouteConnectionType | ConnectionAuthentication can't be configured for connection {0} because its type is **ExpressRoute**. | ConnectionAuthentication is only supported for **VPN Gateway connections**, not ExpressRoute. |
| VpnGatewayKeyVaultTokenRequestParameterMissingError | Missing required parameter for requesting user's Key Vault access token for VPN Gateway {0}. | The **Network Resource Provider (NRP)** didn't receive necessary managed identity properties from Azure Resource Manager. To resolve this issue, **open an Azure support ticket** for assistance. |
| ManagedIdentityMissingAtGatewayLevel | **User assigned managed identity** is required at gateway {0} to use PSK/Certificate from customer&apos;s keyvault in connection {1}. | Add a **user-assigned managed identity** to the gateway to access certificates or preshared keys from Key Vault. |
| MaxRootCertificatePublicKeySupported | A **maximum of {0}** root and intermediate certificate public keys ({1}) are supported. | **Reduce the certificate chain length**. Azure supports certificate chains (root + intermediate) up to a **maximum length of 5 certificates**. |
| VpnGatewayConnectionAuthenticationUsingCertInCustomerKeyvaultIsNotEnabled | VPN Gateway certificate-based connection authentication **isn't enabled** for gateway {0}. | **Digital certificate authentication** isn't enabled for the Azure subscription. To resolve this issue, **open an Azure support ticket** for assistance. |
| VpnGatewayManagedIdentitySupportIsNotEnabled | **Managed identity support** isn't enabled for VPN gateway {0}. | You attempted to add a managed identity to the VPN gateway, but **digital certificate authentication** isn't enabled for your Azure subscription. To resolve this issue, **open an Azure support ticket** for assistance. |
| VpnGatewayManagedIdentity | Managed identity is supported for VPN Gateway SKUs of **VpnGw1 or higher**. | To use managed identity, ensure your VPN Gateway is sized **VpnGw1 or greater**. |
| VpnGatewayConnectionAuthenticationUsingPskInCustomerKeyvaultIsNotEnabled | VPN Gateway connection authentication using a **preshared key** stored in Key Vault isn't enabled for gateway {0}. | **Preshared key authentication** from your Key Vault isn't enabled for your Azure subscription. To enable this feature, **open an Azure support ticket** for assistance. |
| VpnConnectionAuthenticationRootCertificateDataInvalid | Root/Intermediate certificate public key for certificate authentication is **invalid**. | The **root certificate is invalid**. Verify the certificate format and ensure it's a valid **X.509 certificate**. |
| VpnConnectionAuthenticationRootCertificateDataInvalidBecausePrivateKey | Root/Intermediate certificate public key for certificate authentication is invalid because it has **private key**. | The root certificate contains a **private key**, which isn't supported. Use only the **public key portion** of the certificate. |
| VpnConnectionAuthenticationDuplicateRootCertificate | Root/Intermediate certificate public key for certificate authentication has **duplicate entry**. | **Duplicate root certificates** detected. Remove the duplicate certificate and retry the connection. |
| VpnConnectionAuthenticationCertChainCreationIssue | Exception thrown while building chain for Root/Intermediate certificate with thumbprint: {0} for certificate authentication. Exception details: {1}. | **Certificate chain creation failed**. Review the exception details to identify and correct the certificate chain issues. |
| VpnConnectionAuthenticationRootCertificateIsExpired | Certificate authentication inbound root certificate is **expired**. Add a new certificate and retry. | Replace the **expired root certificate** with a valid, current certificate and retry the connection. |
| VpnConnectionOutBoundAuthenticationCertificateIsExpired | Certificate authentication outbound certificate is **expired**. Add a new certificate and retry. | Update the outbound certificate with a valid, **nonexpired certificate** and retry the connection. |
| VpnConnectionOutBoundAuthenticationCertificateIsEmpty | Certificate authentication outbound certificate is **empty**. | The VPN Gateway couldn't retrieve the certificate from **Key Vault**. Verify the certificate exists and the managed identity has proper access. |
| VpnConnectionOutBoundAuthenticationCertificateDoesNotHaveRSAPrivateKey | Certificate authentication outbound certificate isn't having **RSA private key**. | The outbound certificate is missing an **RSA private key**. Ensure the certificate includes the required RSA private key. |
| VpnConnectionOutBoundAuthenticationCertificateRSAPrivateKeyLength | Certificate authentication outbound certificate RSA private key length should be **at least {0}**. | The outbound certificate's **RSA private key length is insufficient**. Use a certificate with an RSA private key of at least the required length. |
| VpnConnectionOutBoundAuthenticationCertificateChainCreationIssue | Issue in creating certificate chain for Certificate authentication outbound certificate. Exception details {0}. | Review the exception details and correct the **certificate chain for outbound authentication**. |
| VpnConnectionOutBoundAuthenticationCertificateChainFault | Certificate authentication outbound certificate chain should have **at least {0} certificate** in it but has only {1} certificate. | Add the **required number of certificates** to complete the outbound certificate chain. |
| VpnConnectionInBoundAuthenticationCertificateChainFault | Certificate authentication inbound certificate chain is **empty**. | Add a **valid certificate chain** with root and intermediate certificates for inbound authentication. |
| VpnConnectionOutBoundAuthenticationCertificateChainDoesNotHaveRootCert | Certificate authentication outbound certificate chain doesn't have **root cert**. | Add a **valid root certificate** to the outbound certificate chain and retry the connection. |
| VpnConnectionInBoundAuthenticationCertificateChainDoesNotHaveRootCert | Certificate authentication Inbound certificate chain doesn't have **root cert**. | Add a **valid root certificate** to the inbound certificate chain and retry the connection. |
| VpnConnectionInBoundAuthenticationCertificateChainDoesNotHaveAllGivenCerts | All certificate provided for Certificate authentication Inbound certificate chain doesn't belongs to **single certificate chain**. | Ensure all certificates in the inbound chain belong to a **single, valid certificate chain**. |
| VpnConnectionOutBoundAuthenticationCertificateClientAndServerAuth | Certificate authentication outbound certificate should have both **client and server authentication** in Enhanced Key Usage extension. | The outbound certificate is missing **client and server authentication** in the Enhanced Key Usage extension. Ensure the certificate includes **both authentication types**. |
| ConnectionAuthenticationPSKAmbiguity | There's an ambiguity with **preshared key**. Both *SharedKey* and *SharedKeyKeyvaultId* are present in connection object. | Remove either *SharedKey* or *SharedKeyKeyvaultId* from the connection object so that **only one preshared key method** is present. |
| InvalidCertificateAuthenticationObject | *CertificateAuthentication* should be **null** when *AuthenticationType* is preshared key. | Remove the *CertificateAuthentication* object when using **preshared key-based connection authentication**. |
| CertificateAuthenticationObjectIsEmpty | *CertificateAuthentication* shouldn't be **null** when *AuthenticationType* is Certificate. | Add a valid *CertificateAuthentication* object when using **certificate-based connection authentication**. |
| InvalidPskExist | *SharedKey*/*SharedKeyKeyvaultId* should be **empty** when *AuthenticationType* is Certificate. | Remove *SharedKey*/*SharedKeyKeyvaultId* when using **certificate-based authentication**. |
| CertificateSubjectNameIsEmpty | *InboundAuthCertificateSubjectName* in *CertificateAuthentication* shouldn't be **empty** when *AuthenticationType* is Certificate. | Provide a **valid subject name** for the inbound authentication certificate. |
| InboundAuthCertificateChainIsEmpty | *InboundAuthCertificateChain* in *CertificateAuthentication* shouldn't be **empty** when *AuthenticationType* is Certificate. | Add a **valid certificate chain** for inbound authentication. |
| OutboundAuthCertificateIsEmpty | *OutboundAuthCertificate* in *CertificateAuthentication* shouldn't be **empty** when *AuthenticationType* is Certificate. | Add a **valid outbound authentication certificate**. |
| VpnGatewayKeyVaultTokenRequestError | **KeyVault access token request failed** for Vpn Gateway '{0}'. | The VPN Gateway failed to access your **Key Vault**. **Open an Azure support ticket** to receive assistance. |
| VpnGatewayKeyVaultSecretException | Problem occurred while **accessing and validating KeyVault Secrets** associated with resource type {0} (ID &apos;{1}&apos;). See details below: | The VPN Gateway failed to access your **Key Vault**. **Open an Azure support ticket** to receive assistance. |
| VpnGatewayKeyVaultSecretNotFound | KeyVault Secret '{0}' **couldn't be found** for resource type {1} (ID '{2}'). | The **secret or certificate wasn't found** in Key Vault. Verify that the secret exists and the name is correct. |
| VpnGatewayKeyVaultInaccessibleKeyvault | **Keyvault is inaccessible** for VPN gateway with certificate '{0}' for resource type {1} (ID '{2}'). | Verify that the **Key Vault is accessible** and properly configured for the VPN gateway. |
| VpnGatewayKeyVaultRequestTimeout | **KeyVault Request Timeout** occurred while waiting for '{0}' for resource type {1} (ID '{2}'). | The VPN Gateway request **timed out** when accessing Key Vault. Retry the operation, and if the issue persists, **open an Azure support ticket** for assistance. |
| VpnGatewayKeyVaultNameResolutionFailure | KeyVault host url '{0}' **can't be resolved** for resource type {1} (ID '{2}'). | Check if the **correct outbound certificate URL/path** is specified in the *CertificateAuthentication* object. |
| VpnGatewayKeyVaultSecretIsEmpty | Secret stored in keyvault with secretId '{0}' is **empty** for resource type {1} (ID '{2}'). | Add a **valid secret** to Key Vault for the specified resource. |
| VpnGatewayKeyVaultCertIsEmpty | Certificate stored in keyvault with certificate '{0}' is **empty** for resource type {1} (ID '{2}'). | Add a **valid certificate** to Key Vault for the specified resource. |
| PlainTextSharedKeyDoesnotExistCertIsGettingUsedForAuthentication | **Invalid operation**. Plain text shared key doesn't exist. ConnectionAuthentication with authentication type **Certificate** is getting used in connection {0}. | You're trying to retrieve a shared key, but the connection is configured for **certificate authentication**. Use the **appropriate authentication method** for your connection type. |
| PlainTextSharedKeyDoesnotExistSharedKeyStoredInKeyvaultIsGettingUsedForAuthentication | **Invalid operation**. Plain text shared key doesn't exist. **Shared key stored in keyvault** is getting used in connection {0}. | You're trying to retrieve a shared key, but the connection uses a **preshared key stored in Key Vault**. Use the **appropriate authentication method** for your connection type. |
| ResetSharedKeyIsNotSupportedBecauseNonPlainTextSharedKeyIsGettingUsedForConnectionAuthentication | **Not supported operation**. ConnectionAuthentication with **non plain text shared key** has been used in connection {0}. | Use a **plain text shared key** for connection authentication if reset functionality is required. |
| CannotDeleteManagedIdentity | **Can't delete Identity**. It's getting used by connection {0} to access keyvault secret {1}. | The **managed identity is currently in use** by a connection for Key Vault authentication. Remove the identity from the connection **before deleting it**. |
| VpnGatewaySupportsUserAssignedIdentityTypeOnly | Only **UserAssigned identity type** is supported for Vpn Gateway '{0}'. Provided identify type is {1}. | Change the identity type to **UserAssigned** for the VPN Gateway. Only **user-assigned managed identities** are supported. |
| VpnGatewayAllowsOneUserAssignedIdentityOnly | Only **one UserAssigned identity** is allowed for Vpn Gateway '{0}'. | Remove any additional UserAssigned identities and ensure **only one is assigned** to the VPN Gateway. |

## Next steps

- [About VPN Gateway configuration settings](vpn-gateway-about-vpn-gateway-settings.md)
- [Troubleshoot site-to-site VPN connection problems](vpn-gateway-troubleshoot-site-to-site-cannot-connect.md)
