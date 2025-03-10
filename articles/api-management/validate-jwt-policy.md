---
title: Azure API Management policy reference - validate-jwt | Microsoft Docs
description: Reference for the validate-jwt policy available for use in Azure API Management. Provides policy usage, settings, and examples.
services: api-management
author: dlepow

ms.service: azure-api-management
ms.topic: reference
ms.date: 01/27/2025
ms.author: danlep
---

# Validate JWT

[!INCLUDE [api-management-availability-all-tiers](../../includes/api-management-availability-all-tiers.md)]

The `validate-jwt` policy enforces existence and validity of a supported JSON web token (JWT) that was provided by an identity provider. The JWT can be extracted from a specified HTTP header, extracted from a specified query parameter, or matching a specific value.

> [!NOTE]
>  Use the [`validate-azure-ad-token`](validate-azure-ad-token-policy.md) policy to validate a JWT that was provided by Microsoft Entra. 

[!INCLUDE [api-management-policy-form-alert](../../includes/api-management-policy-form-alert.md)]


## Policy statement

```xml
<validate-jwt
    header-name="name of HTTP header containing the token (alternatively, use query-parameter-name or token-value attribute to specify token)"
    query-parameter-name="name of query parameter used to pass the token (alternative, use header-name or token-value attribute to specify token)"
    token-value="expression returning the token as a string (alternatively, use header-name or query-parameter attribute to specify token)"
    failed-validation-httpcode="HTTP status code to return on failure"
    failed-validation-error-message="error message to return on failure"
    require-expiration-time="true | false"
    require-scheme="scheme"
    require-signed-tokens="true | false"
    clock-skew="allowed clock skew in seconds"
    output-token-variable-name="name of a variable to receive a JWT object representing successfully validated token">
  <openid-config url="full URL of the configuration endpoint, for example, https://login.constoso.com/openid-configuration" />
  <issuer-signing-keys>
    <key id="kid-claim" certificate-id="mycertificate" n="modulus" e="exponent">Base64 encoded signing key</key>
    <!-- if there are multiple keys, then add additional key elements -->
  </issuer-signing-keys>
  <decryption-keys>
    <key certificate-id="mycertificate">Base64 encoded signing key</key>
    <!-- if there are multiple keys, then add additional key elements -->
  </decryption-keys>
  <audiences>
    <audience>audience string</audience>
    <!-- if there are multiple possible audiences, then add additional audience elements -->
  </audiences>
  <issuers>
    <issuer>issuer string</issuer>
    <!-- if there are multiple possible issuers, then add additional issuer elements -->
  </issuers>
  <required-claims>
    <claim name="name of the claim as it appears in the token" match="all | any" separator="separator character in a multi-valued claim">
      <value>claim value as it is expected to appear in the token</value>
      <!-- if there is more than one allowed value, then add additional value elements -->
    </claim>
    <!-- if there are multiple possible allowed claim, then add additional claim elements -->
  </required-claims>
</validate-jwt>
```

## Attributes

| Attribute                            | Description                                                                                                                                                                                                                                                                                                                                                                                                                                            | Required                                                                         | Default                                                                           |
| ------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | -------------------------------------------------------------------------------- | --------------------------------------------------------------------------------- |
| header-name                     | The name of the HTTP header holding the token. Policy expressions are allowed.                                                                                                                                                                                                                                                                                                                                                                                                        | One of `header-name`, `query-parameter-name` or `token-value` must be specified. | N/A                                                                               |
| query-parameter-name            | The name of the query parameter holding the token. Policy expressions are allowed.                                                                                                                                                                                                                                                                                                                                                                                                    | One of `header-name`, `query-parameter-name` or `token-value` must be specified. | N/A                                                                               |
| token-value                     | Expression returning a string containing the token. You must not return `Bearer ` as part of the token value.  Policy expressions are allowed.                                                                                                                                                                                                                                                                                                                                         | One of `header-name`, `query-parameter-name` or `token-value` must be specified. | N/A                                                                               |
| failed-validation-httpcode      | HTTP Status code to return if the JWT doesn't pass validation. Policy expressions are allowed.                                                                                                                                                                                                                                                                                                                                                                                        | No                                                                               | 401                                                                               |
| failed-validation-error-message | Error message to return in the HTTP response body if the JWT doesn't pass validation. This message must have any special characters properly escaped. Policy expressions are allowed.                                                                                                                                                                                                                                                                                                 | No                                                                               | Default error message depends on validation issue, for example "JWT not present." |
| require-expiration-time         | Boolean. Specifies whether an expiration claim is required in the token.  Policy expressions are allowed.                                                                                                                                                                                                                                                                                                                                                                             | No                                                                               | true                                                                              |
| require-scheme                  | The name of the token scheme, for example, "Bearer". When this attribute is set, the policy will ensure that specified scheme is present in the Authorization header value. Policy expressions are allowed.                                                                                                                                                                                                                                                                                   | No                                                                               | N/A                                                                               |
| require-signed-tokens           | Boolean. Specifies whether a token is required to be signed. Policy expressions are allowed.                                                                                                                                                                                                                                                                                                                                                                                          | No                                                                               | true                                                                              |
| clock-skew                      | Timespan. Use to specify maximum expected time difference between the system clocks of the token issuer and the API Management instance. Policy expressions are allowed.                                                                                                                                                                                                                                                                                                              | No                                                                               | 0 seconds                                                                         |
| output-token-variable-name      | String. Name of context variable that will receive token value as an object of type [`Jwt`](api-management-policy-expressions.md) upon successful token validation. Policy expressions aren't allowed.                                                                                                                                                                                                                                                                                    | No                                                                               | N/A                                                                               |



## Elements

| Element             | Description                                                                                                                                                                                                                                                                                                                                           | Required |
| ------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------- |
| openid-config       |Add one or more of these elements to specify a compliant OpenID configuration endpoint URL from which signing keys and issuer can be obtained.<br/><br/>Configuration including the JSON Web Key Set (JWKS) is pulled from the endpoint every 1 hour and cached. If the token being validated references a validation key (using `kid` claim) that is missing in cached configuration, or if retrieval fails, API Management pulls from the endpoint at most once per 5 min. These intervals are subject to change without notice.                                                                                                                                              <br/><br/>The response should be according to specs as defined at URL: `https://openid.net/specs/openid-connect-discovery-1_0.html#ProviderMetadata`. <br/><br/>For Microsoft Entra ID use the OpenID Connect [metadata endpoint](../active-directory/develop/v2-protocols-oidc.md#find-your-apps-openid-configuration-document-uri) configured in your app registration such as:<br/>- v2 `https://login.microsoftonline.com/{tenant-name}/v2.0/.well-known/openid-configuration`<br/>- v2 Multi-Tenant ` https://login.microsoftonline.com/organizations/v2.0/.well-known/openid-configuration`<br/>- v1 `https://login.microsoftonline.com/{tenant-name}/.well-known/openid-configuration` <br/>- Customer tenant (preview) `https://{tenant-name}.ciamlogin.com/{tenant-id}/v2.0/.well-known/openid-configuration` <br/><br/> Substituting your directory tenant name or ID, for example `contoso.onmicrosoft.com`, for `{tenant-name}`.                                                                                                                                                                                            | No       |
| issuer-signing-keys | A list of Base64-encoded security keys, in [`key`](#key-attributes) subelements, used to validate signed tokens. If multiple security keys are present, then each key is tried until either all are exhausted (in which case validation fails) or one succeeds (useful for token rollover). <br/><br/>Optionally, specify a key by using the `id` attribute to match the token's `kid` claim. To validate a token signed with an asymmetric key, optionally specify the public key using a `certificate-id` attribute with value set to the identifier of a certificate uploaded to API Management, or the RSA modulus `n` and exponent `e` pair of the signing key in Base64url-encoded format.               | No       |
| decryption-keys     | A list of Base64-encoded keys, in [`key`](#key-attributes) subelements, used to decrypt the tokens. If multiple security keys are present, then each key is tried until either all keys are exhausted (in which case validation fails) or a key succeeds.<br/><br/> To decrypt a token encrypted with an asymmetric key, optionally specify the public key using a `certificate-id` attribute with value set to the identifier of a certificate uploaded to API Management.         | No       |
| audiences           | A list of acceptable audience claims, in `audience` subelements, that can be present on the token. If multiple audience values are present, then each value is tried until either all are exhausted (in which case validation fails) or until one succeeds. At least one audience must be specified.                                                                     | No       |
| issuers             | A list of acceptable principals, in `issuer` subelements, that issued the token. If multiple issuer values are present, then each value is tried until either all are exhausted (in which case validation fails) or until one succeeds.                                                                                                                                         | No       |
| required-claims     | A list of claims, in [`claim`](#claim-attributes) subelements, expected to be present on the token for it to be considered valid. When multiple claims are present, the token must match claim values according to the value of the `match` attribute. | No       |

### key attributes
| Attribute                            | Description                                                                                                                                                                                                                                                                                                                                                                                                                                            | Required                                                                         | Default                                                                           |
| ------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | -------------------------------------------------------------------------------- | --------------------------------------------------------------------------------- |
| id  | (Issuer signing key only) String. Identifier used to match `kid` claim presented in JWT. If no keys match the claim, API Management will attempt each specified key. [Learn more about the `kid` claim in the RFC](https://www.rfc-editor.org/rfc/rfc7515#section-4.1.4). | No | N/A |
| certificate-id  | Identifier of a certificate entity [uploaded](/rest/api/apimanagement/apimanagementrest/azure-api-management-rest-api-certificate-entity#Add) to API Management, used to specify the public key to verify a token signed with an asymmetric key.   | No | N/A |
| n | (Issuer signing key only) Modulus of the public key used to verify the issuer of a token signed with an asymmetric key. Must be specified with the value of the exponent `e`. Policy expressions aren't allowed. | No | N/A|
| e | (Issuer signing key only) Exponent of the public key used to verify the issuer of a token signed with an asymmetric key. Must be specified with the value of the modulus `n`. Policy expressions aren't allowed. | No | N/A|



### claim attributes
| Attribute                            | Description                                                                                                                                                                                                                                                                                                                                                                                                                                            | Required                                                                         | Default                                                                           |
| ------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | -------------------------------------------------------------------------------- | --------------------------------------------------------------------------------- |
| match                           | The `match` attribute on the `claim` element specifies whether every claim value in the policy must be present in the token for validation to succeed. Possible values are:<br /><br /> - `all` - every claim value in the policy must be present in the token for validation to succeed.<br /><br /> - `any` - at least one claim value must be present in the token for validation to succeed.                                                       | No                                                                               | all                                                                               |
| separator                       | String. Specifies a separator (for example, ",") to be used for extracting a set of values from a multi-valued claim.                                                                                                                                                                                                                                                                                                                                          | No                                                                               | N/A                                                                               |

## Usage

- [**Policy sections:**](./api-management-howto-policies.md#sections) inbound
- [**Policy scopes:**](./api-management-howto-policies.md#scopes) global, workspace, product, API, operation
-  [**Gateways:**](api-management-gateways-overview.md) classic, v2, consumption, self-hosted, workspace

### Usage notes

* The `validate-jwt` policy requires that the `exp` registered claim is included in the JWT token, unless `require-expiration-time` attribute is specified and set to `false`.
* The policy supports both symmetric and asymmetric signing algorithms: 
    * **Symmetric** - The following encryption algorithms are supported: A128CBC-HS256, A192CBC-HS384, A256CBC-HS512.
    	* If used in the policy, the key must be provided inline within the policy in the Base64-encoded form.
    * **Asymmetric** - The following encryption algorithms are supported: PS256, RS256, RS512, ES256. 
    	* If used in the policy, the key may be provided either via an OpenID configuration endpoint, or by providing the ID of an uploaded certificate (in PFX format) that contains the public key, or the modulus-exponent pair of the public key.
* To configure the policy with one or more OpenID configuration endpoints for use with a self-hosted gateway, the OpenID configuration endpoints URLs must also be reachable by the cloud gateway.
* You can use access restriction policies in different scopes for different purposes. For example, you can secure the whole API with Microsoft Entra authentication by applying the `validate-jwt` policy on the API level, or you can apply it on the API operation level and use `claims` for more granular control.
* When using a custom header (`header-name`), the configured required scheme (`require-scheme`) will be ignored. To use a required scheme, JWT tokens must be provided in the `Authorization` header.

## Examples

### Simple token validation

```xml
<validate-jwt header-name="Authorization" require-scheme="Bearer">
    <issuer-signing-keys>
        <key>{{jwt-signing-key}}</key>  <!-- signing key specified as a named value -->
    </issuer-signing-keys>
    <audiences>
        <audience>@(context.Request.OriginalUrl.Host)</audience>  <!-- audience is set to API Management host name -->
    </audiences>
    <issuers>
        <issuer>http://contoso.com/</issuer>
    </issuers>
</validate-jwt>
```

### Token validation with RSA certificate

```xml
<validate-jwt header-name="Authorization" require-scheme="Bearer">
    <issuer-signing-keys>
        <key certificate-id="my-rsa-cert" />  <!-- signing key specified as certificate ID, enclosed in double-quotes -->
    </issuer-signing-keys>
    <audiences>
        <audience>@(context.Request.OriginalUrl.Host)</audience>  <!-- audience is set to API Management host name -->
    </audiences>
    <issuers>
        <issuer>http://contoso.com/</issuer>
    </issuers>
</validate-jwt>
```

<a name='azure-active-directory-token-validation'></a>

### Microsoft Entra ID single tenant token validation

```xml
<validate-jwt header-name="Authorization" failed-validation-httpcode="401" failed-validation-error-message="Unauthorized. Access token is missing or invalid.">
    <openid-config url="https://login.microsoftonline.com/contoso.onmicrosoft.com/.well-known/openid-configuration" />
    <audiences>
        <audience>00001111-aaaa-2222-bbbb-3333cccc4444</audience>
    </audiences>
    <required-claims>
        <claim name="id" match="all">
            <value>insert claim here</value>
        </claim>
    </required-claims>
</validate-jwt>
```

### Microsoft Entra ID customer tenant token validation

```xml
<validate-jwt header-name="Authorization" failed-validation-httpcode="401" failed-validation-error-message="Unauthorized. Access token is missing or invalid.">
	<openid-config url="https://<tenant-name>.ciamlogin.com/<tenant-id>/v2.0/.well-known/openid-configuration" />
	<required-claims>
		<claim name="azp" match="all">
			<value>insert claim here</value>
		</claim>
	</required-claims>
</validate-jwt>
```

### Azure Active Directory B2C token validation

```xml
<validate-jwt header-name="Authorization" failed-validation-httpcode="401" failed-validation-error-message="Unauthorized. Access token is missing or invalid.">
    <openid-config url="https://login.microsoftonline.com/tfp/contoso.onmicrosoft.com/b2c_1_signin/v2.0/.well-known/openid-configuration" />
    <audiences>
        <audience>11112222-bbbb-3333-cccc-4444dddd5555</audience>
    </audiences>
    <required-claims>
        <claim name="id" match="all">
            <value>insert claim here</value>
        </claim>
    </required-claims>
</validate-jwt>
```

### Token validation using decryption key

This example shows how to use the `validate-jwt` policy to validate a token that is decrypted using a decryption key. The key is specified using the ID of an uploaded certificate (in PFX format) that contains the public key.

```xml
<validate-jwt header-name="Authorization" require-scheme="Bearer" output-token-variable-name="jwt">
    <issuer-signing-keys>
        <key>{{jwt-signing-key}}</key> <!-- signing key is stored in a named value -->
    </issuer-signing-keys>
    <audiences>
        <audience>@(context.Request.OriginalUrl.Host)</audience>
    </audiences>
    <issuers>
        <issuer>contoso.com</issuer>
    </issuers>
    <required-claims>
        <claim name="group" match="any">
            <value>finance</value>
            <value>logistics</value>
        </claim>
    </required-claims>
    <decryption-keys>
        <key certificate-id="my-certificate-in-api-management" /> <!-- decryption key specified as certificate ID -->
    </decryption-keys>
</validate-jwt>
```

### Authorize access to operations based on token claims

This example shows how to use the `validate-jwt` policy to authorize access to operations based on token claims value.

```xml
<validate-jwt header-name="Authorization" require-scheme="Bearer" output-token-variable-name="jwt">
    <issuer-signing-keys>
        <key>{{jwt-signing-key}}</key> <!-- signing key is stored in a named value -->
    </issuer-signing-keys>
    <audiences>
        <audience>@(context.Request.OriginalUrl.Host)</audience>
    </audiences>
    <issuers>
        <issuer>contoso.com</issuer>
    </issuers>
    <required-claims>
        <claim name="group" match="any">
            <value>finance</value>
            <value>logistics</value>
        </claim>
    </required-claims>
</validate-jwt>
<choose>
    <when condition="@(context.Request.Method == "POST" && !((Jwt)context.Variables["jwt"]).Claims["group"].Contains("finance"))">
        <return-response>
            <set-status code="403" reason="Forbidden" />
        </return-response>
    </when>
</choose>
```

## Related policies 
* [Authentication and authorization](api-management-policies.md#authentication-and-authorization)



[!INCLUDE [api-management-policy-ref-next-steps](../../includes/api-management-policy-ref-next-steps.md)]
