<properties
	pageTitle="Azure AD Federation Metadata | Microsoft Azure"
	description="This article describes the federation metadata document that Azure Active Directory publishes for services that accept Azure Active Directory tokens."
	services="active-directory"
	documentationCenter=".net"
	authors="priyamohanram"
	manager="mbaldwin"
	editor=""/>

<tags
	ms.service="active-directory"
	ms.workload="identity"
	ms.tgt_pltfrm="na"
	ms.devlang="na"
	ms.topic="article"
	ms.date="06/23/2016"
	ms.author="priyamo"/>


# Federation metadata

Azure Active Directory (Azure AD) publishes a federation metadata document for services that configured to accept the security tokens that Azure AD issues. The federation metadata document format is described in the [Web Services Federation Language (WS-Federation) Version 1.2](http://docs.oasis-open.org/wsfed/federation/v1.2/os/ws-federation-1.2-spec-os.html), which extends [Metadata for the OASIS Security Assertion Markup Language (SAML) v2.0](http://docs.oasis-open.org/security/saml/v2.0/saml-metadata-2.0-os.pdf).

## Tenant-specific and Tenant-independent metadata endpoints

Azure AD publishes tenant-specific and tenant-independent endpoints.

Tenant-specific endpoints are designed for a particular tenant. The tenant-specific federation metadata includes information about the tenant, including tenant-specific issuer and endpoint information. Applications that restrict access to a single tenant use tenant-specific endpoints.

Tenant-independent endpoints provide information that is common to all Azure AD tenants. This information applies to tenants hosted at *login.microsoftonline.com* and is shared across tenants. Tenant-independent endpoints are recommended for multi-tenant applications, since they are not associated with any particular tenant.

## Federation metadata endpoints

Azure AD publishes federation metadata at `https://login.microsoftonline.com/<TenantDomainName>/FederationMetadata/2007-06/FederationMetadata.xml`.

For **tenant-specific endpoints**, the `TenantDomainName` can be one of the following types:

- A registered domain name of an Azure AD tenant, such as: `contoso.onmicrosoft.com`.
- The immutable tenant ID of the domain, such as `72f988bf-86f1-41af-91ab-2d7cd011db45`.

For **tenant-independent endpoints**, the `TenantDomainName` is `common`. This document lists only the Federation Metadata elements that are common to all Azure AD tenants that are hosted at login.microsoftonline.com.

For example, a tenant-specific endpoint might be `https:// login.microsoftonline.com/contoso.onmicrosoft.com/FederationMetadata/2007-06/FederationMetadata.xml`. The tenant-independent endpoint is [https://login.microsoftonline.com/common/FederationMetadata/2007-06/FederationMetadata.xml](https://login.microsoftonline.com/common/FederationMetadata/2007-06/FederationMetadata.xml). You can view the federation metadata document by typing this URL in a browser.

## Contents of federation Metadata

The following section provides information needed by services that consume the tokens issued by Azure AD.

### Entity ID

The `EntityDescriptor` element contains an `EntityID` attribute. The value of the `EntityID` attribute represents the issuer, that is, the security token service (STS) that issued the token. It is important to validate the issuer when you receive a token.

The following metadata shows a sample tenant-specific `EntityDescriptor` element with an `EntityID` element.

```
<EntityDescriptor
xmlns="urn:oasis:names:tc:SAML:2.0:metadata"
ID="_b827a749-cfcb-46b3-ab8b-9f6d14a1294b"
entityID="https://sts.windows.net/72f988bf-86f1-41af-91ab-2d7cd011db45/">
```
You can replace the tenant ID in the tenant-independent endpoint with your tenant ID to create a tenant-specific `EntityID` value. The resulting value will be the same as the token issuer. The strategy allows a multi-tenant application to validate the issuer for a given tenant.

The following metadata shows a sample tenant-independent `EntityID` element. Please note, that the `{tenant}` is a literal, not a placeholder.

```
<EntityDescriptor
xmlns="urn:oasis:names:tc:SAML:2.0:metadata"
ID="="_0e5bd9d0-49ef-4258-bc15-21ce143b61bd"
entityID="https://sts.windows.net/{tenant}/">
```

### Token signing certificates

When a service receives a token that is issued by a Azure AD tenant, the signature of the token must be validated with a signing key that is published in the federation metadata document. The federation metadata includes the public portion of the certificates that the tenants use for token signing. The certificate raw bytes appear in the `KeyDescriptor` element. The token signing certificate is valid for signing only when the value of the `use` attribute is `signing`.

A federation metadata document published by Azure AD can have multiple signing keys, such as when Azure AD is preparing to update the signing certificate. When a federation metadata document includes more than one certificate, a service that is validating the tokens should support all certificates in the document.

The following metadata shows a sample `KeyDescriptor` element with a signing key.

```
<KeyDescriptor use="signing">
<KeyInfo xmlns="http://www.w3.org/2000/09/xmldsig#">
<X509Data>
<X509Certificate>
MIIDPjCCAiqgAwIBAgIQVWmXY/+9RqFA/OG9kFulHDAJBgUrDgMCHQUAMC0xKzApBgNVBAMTImFjY291bnRzLmFjY2Vzc2NvbnRyb2wud2luZG93cy5uZXQwHhcNMTIwNjA3MDcwMDAwWhcNMTQwNjA3MDcwMDAwWjAtMSswKQYDVQQDEyJhY2NvdW50cy5hY2Nlc3Njb250cm9sLndpbmRvd3MubmV0MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEArCz8Sn3GGXmikH2MdTeGY1D711EORX/lVXpr+ecGgqfUWF8MPB07XkYuJ54DAuYT318+2XrzMjOtqkT94VkXmxv6dFGhG8YZ8vNMPd4tdj9c0lpvWQdqXtL1TlFRpD/P6UMEigfN0c9oWDg9U7Ilymgei0UXtf1gtcQbc5sSQU0S4vr9YJp2gLFIGK11Iqg4XSGdcI0QWLLkkC6cBukhVnd6BCYbLjTYy3fNs4DzNdemJlxGl8sLexFytBF6YApvSdus3nFXaMCtBGx16HzkK9ne3lobAwL2o79bP4imEGqg+ibvyNmbrwFGnQrBc1jTF9LyQX9q+louxVfHs6ZiVwIDAQABo2IwYDBeBgNVHQEEVzBVgBCxDDsLd8xkfOLKm4Q/SzjtoS8wLTErMCkGA1UEAxMiYWNjb3VudHMuYWNjZXNzY29udHJvbC53aW5kb3dzLm5ldIIQVWmXY/+9RqFA/OG9kFulHDAJBgUrDgMCHQUAA4IBAQAkJtxxm/ErgySlNk69+1odTMP8Oy6L0H17z7XGG3w4TqvTUSWaxD4hSFJ0e7mHLQLQD7oV/erACXwSZn2pMoZ89MBDjOMQA+e6QzGB7jmSzPTNmQgMLA8fWCfqPrz6zgH+1F1gNp8hJY57kfeVPBiyjuBmlTEBsBlzolY9dd/55qqfQk6cgSeCbHCy/RU/iep0+UsRMlSgPNNmqhj5gmN2AFVCN96zF694LwuPae5CeR2ZcVknexOWHYjFM0MgUSw0ubnGl0h9AJgGyhvNGcjQqu9vd1xkupFgaN+f7P3p3EVN5csBg5H94jEcQZT7EKeTiZ6bTrpDAnrr8tDCy8ng
</X509Certificate>
</X509Data>
</KeyInfo>
</KeyDescriptor>
  ```

The `KeyDescriptor` element appears in two places in the federation metadata document; in the WS-Federation-specific section and the SAML-specific section. The certificates published in both sections will be the same.

In the WS-Federation-specific section, a WS-Federation metadata reader would read the certificates from a `RoleDescriptor` element with the `SecurityTokenServiceType` type.

The following metadata shows a sample `RoleDescriptor` element.

```
<RoleDescriptor xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:fed="http://docs.oasis-open.org/wsfed/federation/200706" xsi:type="fed:SecurityTokenServiceType"protocolSupportEnumeration="http://docs.oasis-open.org/wsfed/federation/200706">
```

In the SAML-specific section, a WS-Federation metadata reader would read the certificates from a `IDPSSODescriptor` element.

The following metadata shows a sample `IDPSSODescriptor` element.

```
<IDPSSODescriptor protocolSupportEnumeration="urn:oasis:names:tc:SAML:2.0:protocol">
```
There are no differences in the format of tenant-specific and tenant-independent certificates.

### WS-Federation endpoint URL

The federation metadata includes the URL that is Azure AD uses for single sign-in and single sign-out in WS-Federation protocol. This endpoint appears in the `PassiveRequestorEndpoint` element.

The following metadata shows a sample `PassiveRequestorEndpoint` element for a tenant-specific endpoint.

```
<fed:PassiveRequestorEndpoint>
<EndpointReference xmlns="http://www.w3.org/2005/08/addressing">
<Address>
https://login.microsoftonline.com/72f988bf-86f1-41af-91ab-2d7cd011db45/wsfed
</Address>
</EndpointReference>
</fed:PassiveRequestorEndpoint>
```
For the tenant-independent endpoint, the WS-Federation URL appears in the WS-Federation endpoint, as shown in the following sample.

```
<fed:PassiveRequestorEndpoint>
<EndpointReference xmlns="http://www.w3.org/2005/08/addressing">
<Address>
https://login.microsoftonline.com/common/wsfed
</Address>
</EndpointReference>
</fed:PassiveRequestorEndpoint>
```

### SAML protocol endpoint URL

The federation metadata includes the URL that Azure AD uses for single sign-in and single sign-out in SAML 2.0 protocol. These endpoints appear in the `IDPSSODescriptor` element.

The sign-in and sign-out URLs appear in the `SingleSignOnService` and `SingleLogoutService` elements.

The following metadata shows a sample `PassiveResistorEndpoint` for a tenant-specific endpoint.

```
<IDPSSODescriptor protocolSupportEnumeration="urn:oasis:names:tc:SAML:2.0:protocol">
…
    <SingleLogoutService Binding="urn:oasis:names:tc:SAML:2.0:bindings:HTTP-Redirect" Location="https://login.microsoftonline.com/contoso.onmicrosoft.com/saml2" />
    <SingleSignOnService Binding="urn:oasis:names:tc:SAML:2.0:bindings:HTTP-Redirect" Location="https://login.microsoftonline.com/contoso.onmicrosoft.com /saml2" />
  </IDPSSODescriptor>
```

Similarly the endpoints for the common SAML 2.0 protocol endpoints are published in the tenant-independent federation metadata, as shown in the following sample.

```
<IDPSSODescriptor protocolSupportEnumeration="urn:oasis:names:tc:SAML:2.0:protocol">
…
    <SingleLogoutService Binding="urn:oasis:names:tc:SAML:2.0:bindings:HTTP-Redirect" Location="https://login.microsoftonline.com/common/saml2" />
    <SingleSignOnService Binding="urn:oasis:names:tc:SAML:2.0:bindings:HTTP-Redirect" Location="https://login.microsoftonline.com/common/saml2" />
  </IDPSSODescriptor>
```
