---
title: Azure API Management policy reference - validate-client-certificate | Microsoft Docs
description: Reference for the validate-client-certificate policy available for use in Azure API Management. Provides policy usage, settings, and examples.
services: api-management
author: dlepow

ms.service: api-management
ms.topic: article
ms.date: 12/08/2022
ms.author: danlep
---

# Validate client certificate

Use the `validate-client-certificate` policy to enforce that a certificate presented by a client to an API Management instance matches specified validation rules and claims such as subject or issuer for one or more certificate identities.

To be considered valid, a client certificate must match all the validation rules defined by the attributes at the top-level element and match all defined claims for at least one of the defined identities. 

Use this policy to check incoming certificate properties against desired properties. Also use this policy to override default validation of client certificates in these cases:

* If you have uploaded custom CA certificates to validate client requests to the managed gateway
* If you configured custom certificate authorities to validate client requests to a self-managed gateway

For more information about custom CA certificates and certificate authorities, see [How to add a custom CA certificate in Azure API Management](api-management-howto-ca-certificates.md).
 
[!INCLUDE [api-management-policy-generic-alert](../../includes/api-management-policy-generic-alert.md)]

## Policy statement

```xml
<validate-client-certificate 
    validate-revocation="true | false"
    validate-trust="true | false" 
    validate-not-before="true | false" 
    validate-not-after="true | false" 
    ignore-error="true | false">
    <identities>
        <identity 
            thumbprint="certificate thumbprint"
            serial-number="certificate serial number"
            common-name="certificate common name"
            subject="certificate subject string"
            dns-name="certificate DNS name"
            issuer-subject="certificate issuer"
            issuer-thumbprint="certificate issuer thumbprint"
            issuer-certificate-id="certificate identifier" />
    </identities>
</validate-client-certificate> 
```

## Attributes

| Name                            | Description      | Required |  Default    |
| ------------------------------- | -----------------| -------- | ----------- |
| validate-revocation  | Boolean. Specifies whether certificate is validated against online revocation list. Policy expressions aren't allowed.  | No  | `true`  |
| validate-trust | Boolean. Specifies if validation should fail in case chain cannot be successfully built up to trusted CA. Policy expressions aren't allowed. | No | `true` |
| validate-not-before | Boolean. Validates value against current time. Policy expressions aren't allowed.| No | `true` |
| validate-not-after  | Boolean. Validates value against current time. Policy expressions aren't allowed.| No | `true`|
| ignore-error  | Boolean. Specifies if policy should proceed to the next handler or jump to on-error upon failed validation. Policy expressions aren't allowed. | No | `false` |

## Elements

| Element             | Description                                  | Required |
| ------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------- |
|   identities      |  Add this element to specify one or more `identity` elements with defined claims on the client certificate.       |    No        |

## identity attributes

| Name                            | Description      | Required |  Default    |
| ------------------------------- | -----------------| -------- | ----------- |
| thumbprint | Certificate thumbprint. | No | N/A |
| serial-number | Certificate serial number. | No | N/A |
| common-name | Certificate common name (part of Subject string). | No | N/A |
| subject | Subject string. Must follow format of Distinguished Name. | No | N/A |
| dns-name | Value of dnsName entry inside Subject Alternative Name claim. | No | N/A |
| issuer-subject | Issuer's subject. Must follow format of Distinguished Name. | No | N/A |
| issuer-thumbprint | Issuer thumbprint. | No | N/A |
| issuer-certificate-id | Identifier of existing certificate entity representing the issuer's public key. Mutually exclusive with other issuer attributes.  | No | N/A |

## Usage

- [**Policy sections:**](./api-management-howto-policies.md#sections) inbound
- [**Policy scopes:**](./api-management-howto-policies.md#scopes) global, workspace, product, API, operation
- [**Gateways:**](api-management-gateways-overview.md) dedicated, consumption, self-hosted

## Example

The following example validates a client certificate to match the policy's default validation rules and checks whether the subject and issuer name match specified values.

```xml
<validate-client-certificate 
    validate-revocation="true" 
    validate-trust="true" 
    validate-not-before="true" 
    validate-not-after="true" 
    ignore-error="false">
    <identities>
        <identity
            subject="C=US, ST=Illinois, L=Chicago, O=Contoso Corp., CN=*.contoso.com"
            issuer-subject="C=BE, O=FabrikamSign nv-sa, OU=Root CA, CN=FabrikamSign Root CA" />
    </identities>
</validate-client-certificate> 
```

## Related policies

* [API Management access restriction policies](api-management-access-restriction-policies.md)

[!INCLUDE [api-management-policy-ref-next-steps](../../includes/api-management-policy-ref-next-steps.md)]