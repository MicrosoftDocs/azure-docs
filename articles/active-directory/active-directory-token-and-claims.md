 <properties
   pageTitle="Azure AD Token Reference | Microsoft Azure"
   description="A guide for understanding and evaluating the claims in the SAML 2.0 and JSON Web Tokens (JWT) tokens issued by Azure Active Directory (AAD)"
   documentationCenter="na"
   authors="msmbaldwin"
   services="active-directory"
   manager="mbaldwin"
   editor=""/>

<tags
   ms.service="active-directory"
   ms.devlang="na"
   ms.topic="article"
   ms.tgt_pltfrm="na"
   ms.workload="identity"
   ms.date="07/19/2016"
   ms.author="mbaldwin"
   />

# Azure AD token reference

Azure Active Directory (Azure AD) emits several types of security tokens in the processing of each authentication flow. This document describes the format, security characteristics, and contents of each type of token.

## Types of tokens

Azure AD supports the [OAuth 2.0 authorization protocol](active-directory-protocols-oauth-code.md), which makes use of both access_tokens and refresh_tokens.  It also supports authentication and sign-in via [OpenID Connect](active-directory-protocols-openid-connect-code.md), which introduces a third type of token, the id_token.  Each of these tokens is represented as a "bearer token".

A bearer token is a lightweight security token that grants the “bearer” access to a protected resource. In this sense, the “bearer” is any party that can present the token. Though a party must first authenticate with Azure AD to receive the bearer token, if the required steps are not taken to secure the token in transmission and storage, it can be intercepted and used by an unintended party. While some security tokens have a built-in mechanism for preventing unauthorized parties from using them, bearer tokens do not have this mechanism and must be transported in a secure channel such as transport layer security (HTTPS). If a bearer token is transmitted in the clear, a man-in the middle attack can be used by a malicious party to acquire the token and use it for an unauthorized access to a protected resource. The same security principles apply when storing or caching bearer tokens for later use. Always ensure that your app transmits and stores bearer tokens in a secure manner. For more security considerations on bearer tokens, see [RFC 6750 Section 5](http://tools.ietf.org/html/rfc6750).

Many of the tokens issued by Azure AD are implemented as JSON Web Tokens, or JWTs.  A JWT is a compact, URL-safe means of transferring information between two parties.  The information contained in JWTs are known as "claims", or assertions of information about the bearer and subject of the token.  The claims in JWTs are JSON objects encoded and serialized for transmission.  Since the JWTs issued by Azure AD are signed, but not encrypted, you can easily inspect the contents of a JWT for debugging purposes.  There are several tools available for doing so, such as [jwt.calebb.net](http://jwt.calebb.net). For more information on JWTs, you can refer to the [JWT specification](http://self-issued.info/docs/draft-ietf-oauth-json-web-token.html).

## Id_tokens

Id_tokens are a form of sign-in security token that your app receives when performing authentication using [OpenID Connect](active-directory-protocols-openid-connect-code.md).  They are represented as [JWTs](#types-of-tokens), and contain claims that you can use for signing the user into your app.  You can use the claims in an id_token as you see fit - commonly they are used for displaying account information or making access control decisions in an app.

Id_tokens are signed, but not encrypted at this time.  When your app receives an id_token, it must [validate the signature](#validating-tokens) to prove the token's authenticity and validate a few claims in the token to prove its validity.  The claims validated by an app vary depending on scenario requirements, but there are some [common claim validations](#validating-tokens) that your app must perform in every scenario.

Full details on the claims in id_tokens are provided below, as well as a sample id_token.  Note that the claims in id_tokens are not returned in any particular order.  In addition, new claims can be introduced into id_tokens at any point in time - your app should not break as new claims are introduced.  The list below includes the claims that your app can reliably interpret at the time of this writing.  If necessary, even more detail can be found in the [OpenID Connect specification](http://openid.net/specs/openid-connect-core-1_0.html).

#### Sample id_token

```
eyJ0eXAiOiJKV1QiLCJhbGciOiJub25lIn0.eyJhdWQiOiIyZDRkMTFhMi1mODE0LTQ2YTctODkwYS0yNzRhNzJhNzMwOWUiLCJpc3MiOiJodHRwczovL3N0cy53aW5kb3dzLm5ldC83ZmU4MTQ0Ny1kYTU3LTQzODUtYmVjYi02ZGU1N2YyMTQ3N2UvIiwiaWF0IjoxMzg4NDQwODYzLCJuYmYiOjEzODg0NDA4NjMsImV4cCI6MTM4ODQ0NDc2MywidmVyIjoiMS4wIiwidGlkIjoiN2ZlODE0NDctZGE1Ny00Mzg1LWJlY2ItNmRlNTdmMjE0NzdlIiwib2lkIjoiNjgzODlhZTItNjJmYS00YjE4LTkxZmUtNTNkZDEwOWQ3NGY1IiwidXBuIjoiZnJhbmttQGNvbnRvc28uY29tIiwidW5pcXVlX25hbWUiOiJmcmFua21AY29udG9zby5jb20iLCJzdWIiOiJKV3ZZZENXUGhobHBTMVpzZjd5WVV4U2hVd3RVbTV5elBtd18talgzZkhZIiwiZmFtaWx5X25hbWUiOiJNaWxsZXIiLCJnaXZlbl9uYW1lIjoiRnJhbmsifQ.
```

> [AZURE.TIP] For practice, try inspecting the claims in the sample id_token by pasting it into [calebb.net](http://jwt.calebb.net).

#### Claims in id_tokens

| JWT Claim | Name | Description |
|-----------|------|-------------|
| `appid`| Application ID | Identifies the application that is using the token to access a resource. The application can act as itself or on behalf of a user. The application ID typically represents an application object, but it can also represent a service principal object in Azure AD. <br><br> **Example JWT Value**: <br> `"appid":"15CB020F-3984-482A-864D-1D92265E8268"` |
| `aud`| Audience | The intended recipient of the token. The application that receives the token must verify that the audience value is correct and reject any tokens intended for a different audience. <br><br> **Example SAML Value**: <br> `<AudienceRestriction>`<br>`<Audience>`<br>`https://contoso.com`<br>`</Audience>`<br>`</AudienceRestriction>` <br><br> **Example JWT Value**: <br> `"aud":"https://contoso.com"` |
| `appidacr`| Application Authentication Context Class Reference | Indicates how the client was authenticated. For a public client, the value is 0. If client ID and client secret are used, the value is 1. <br><br> **Example JWT Value**: <br> `"appidacr": "0"`|
| `acr`| Authentication Context Class Reference | Indicates how the subject was authenticated, as opposed to the client in the Application Authentication Context Class Reference claim. A value of "0" indicates the end-user authentication did not meet the requirements of ISO/IEC 29115. <br><br> **Example JWT Value**: <br> `"acr": "0"`|
| | Authentication Instant | Records the date and time when authentication occurred. <br><br> **Example SAML Value**: <br> `<AuthnStatement AuthnInstant="2011-12-29T05:35:22.000Z">` |
| `amr`| Authentication Method | Identifies how the subject of the token was authenticated. <br><br> **Example SAML Value**: <br> `<AuthnContextClassRef>`<br>`http://schemas.microsoft.com/ws/2008/06/identity/claims/authenticationmethod/password`<br>`</AuthnContextClassRef>` <br><br> **Example JWT Value**: `“amr”: ["pwd"]` |
| `given_name`| First Name | Provides the first or "given" name of the user, as set on the Azure AD user object. <br><br> **Example SAML Value**: <br> `<Attribute Name=”http://schemas.xmlsoap.org/ws/2005/05/identity/claims/givenname”>`<br>`<AttributeValue>Frank<AttributeValue>` <br><br> **Example JWT Value**: <br> `"given_name": "Frank"` |
| `groups`| Groups | Provides object IDs that represent the subject's group memberships. These values are unique (see Object ID) and can be safely used for managing access, such as enforcing authorization to access a resource. The groups included in the groups claim are configured on a per-application basis, through the "groupMembershipClaims" property of the application manifest. A value of null will exclude all groups, a value of "SecurityGroup" will include only Active Directory Security Group memberships, and a value of "All" will include both Security Groups and Office 365 Distribution Lists. <br><br> **Example SAML Value**: <br> `<Attribute Name="http://schemas.microsoft.com/ws/2008/06/identity/claims/groups">`<br>`<AttributeValue>07dd8a60-bf6d-4e17-8844-230b77145381</AttributeValue>` <br><br> **Example JWT Value**: <br> `“groups”: ["0e129f5b-6b0a-4944-982d-f776045632af", … ]` |
| `idp` | Identity Provider | Records the identity provider that authenticated the subject of the token. This value is identical to the value of the Issuer claim unless the user account is in a different tenant than the issuer. <br><br> **Example SAML Value**: <br> `<Attribute Name=” http://schemas.microsoft.com/identity/claims/identityprovider”>`<br>`<AttributeValue>https://sts.windows.net/cbb1a5ac-f33b-45fa-9bf5-f37db0fed422/<AttributeValue>` <br><br> **Example JWT Value**: <br> `"idp":”https://sts.windows.net/cbb1a5ac-f33b-45fa-9bf5-f37db0fed422/”` |
| `iat` | IssuedAt | Stores the time at which the token was issued. It is often used to measure token freshness. <br><br> **Example SAML Value**: <br> `<Assertion ID="_d5ec7a9b-8d8f-4b44-8c94-9812612142be" IssueInstant="2014-01-06T20:20:23.085Z" Version="2.0" xmlns="urn:oasis:names:tc:SAML:2.0:assertion">` <br><br> **Example JWT Value**: <br> `"iat": 1390234181` |
| `iss` | Issuer | Identifies the security token service (STS) that constructs and returns the token. In the tokens that Azure AD returns, the issuer is sts.windows.net. The GUID in the Issuer claim value is the tenant ID of the Azure AD directory. The tenant ID is an immutable and reliable identifier of the directory. <br><br> **Example SAML Value**: <br> `<Issuer>https://sts.windows.net/cbb1a5ac-f33b-45fa-9bf5-f37db0fed422/</Issuer>` <br><br> **Example JWT Value**: <br>  `"iss":”https://sts.windows.net/cbb1a5ac-f33b-45fa-9bf5-f37db0fed422/”` |
| `family_name` | Last Name | Provides the last name, surname, or family name of the user as defined in the Azure AD user object. <br><br> **Example SAML Value**: <br> `<Attribute Name=” http://schemas.xmlsoap.org/ws/2005/05/identity/claims/surname”>`<br>`<AttributeValue>Miller<AttributeValue>` <br><br> **Example JWT Value**: <br> `"family_name": "Miller"` |
| `unique_name`| Name | Provides a human readable value that identifies the subject of the token. This value is not guaranteed to be unique within a tenant and is designed to be used only for display purposes. <br><br> **Example SAML Value**: <br> `<Attribute Name=”http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name”>`<br>`<AttributeValue>frankm@contoso.com<AttributeValue>` <br><br> **Example JWT Value**: <br> `"unique_name": "frankm@contoso.com"` |
| `oid` | Object ID | Contains a unique identifier of an object in Azure AD. This value is immutable and cannot be reassigned or reused. Use the object ID to identify an object in queries to Azure AD. <br><br> **Example SAML Value**: <br> `<Attribute Name="http://schemas.microsoft.com/identity/claims/objectidentifier">`<br>`<AttributeValue>528b2ac2-aa9c-45e1-88d4-959b53bc7dd0<AttributeValue>` <br><br> **Example JWT Value**: <br> `"oid":"528b2ac2-aa9c-45e1-88d4-959b53bc7dd0"` |
| `roles` | Roles | Represents all application roles that the subject has been granted both directly and indirectly through group membership and can be used to enforce role-based access control. Application roles are defined on a per-application basis, through the `appRoles` property of the application manifest. The `value` property of each application role is the value that appears in the roles claim. <br><br> **Example SAML Value**: <br> `<Attribute Name="http://schemas.microsoft.com/ws/2008/06/identity/claims/role">`<br>`<AttributeValue>Admin</AttributeValue>` <br><br> **Example JWT Value**: <br> `“roles”: ["Admin", … ]` |
| `scp` | Scope | Indicates the impersonation permissions granted to the client application. The default permission is `user_impersonation`. The owner of the secured resource can register additional values in Azure AD. <br><br> **Example JWT Value**: <br> `"scp": "user_impersonation"`|
| `sub` |Subject| Identifies the principal about which the token asserts information, such as the user of an application. This value is immutable and cannot be reassigned or reused, so it can be used to perform authorization checks safely. Because the subject is always present in the tokens the Azure AD issues, we recommended using this value in a general purpose authorization system. <br> `SubjectConfirmation` is not a claim. It describes how the subject of the token is verified. `Bearer` indicates that the subject is confirmed by their possession of the token. <br><br> **Example SAML Value**: <br> `<Subject>`<br>`<NameID>S40rgb3XjhFTv6EQTETkEzcgVmToHKRkZUIsJlmLdVc</NameID>`<br>`<SubjectConfirmation Method="urn:oasis:names:tc:SAML:2.0:cm:bearer" />`<br>`</Subject>` <br><br> **Example JWT Value**: <br> `"sub":"92d0312b-26b9-4887-a338-7b00fb3c5eab"`|
| `tid` | Tenant ID | An immutable, non-reusable identifier that identifies the directory tenant that issued the token. You can use this value to access tenant-specific directory resources in a multi-tenant application. For example, you can use this value to identify the tenant in a call to the Graph API. <br><br> **Example SAML Value**: <br> `<Attribute Name=”http://schemas.microsoft.com/identity/claims/tenantid”>`<br>`<AttributeValue>cbb1a5ac-f33b-45fa-9bf5-f37db0fed422<AttributeValue>` <br><br> **Example JWT Value**: <br> `"tid":"cbb1a5ac-f33b-45fa-9bf5-f37db0fed422"`|
| `nbf`, `exp`|Token Lifetime | Defines the time interval within which a token is valid. The service that validates the token should verify that the current date is within the token lifetime, else it should reject the token. The service might provide an allowance of up to five minutes beyond the token lifetime range to account for any differences in clock time ("time skew") between Azure AD and the service. <br><br> **Example SAML Value**: <br> `<Conditions`<br>`NotBefore="2013-03-18T21:32:51.261Z"`<br>`NotOnOrAfter="2013-03-18T22:32:51.261Z"`<br>`>` <br><br> **Example JWT Value**: <br> `"nbf":1363289634, "exp":1363293234` |
| `upn`| User Principal Name | Stores the user name of the user principal.<br><br> **Example JWT Value**: <br> `"upn": frankm@contoso.com`|
| `ver`| Version | Stores the version number of the token. <br><br> **Example JWT Value**: <br> `"ver": "1.0"`|

## Access tokens

Access tokens are only consumable by Microsoft Services at this point in time.  Your apps should not need to perform any validation or inspection of access tokens for any of the currently supported scenarios.  You can treat access tokens as completely opaque - they are just strings which your app can pass to Microsoft in HTTP requests.

When you request an access token, Azure AD also returns some metadata about the access token for your app's consumption.  This information includes the expiry time of the access token and the scopes for which it is valid.  This allows your app to perform intelligent caching of access tokens without having to parse open the access token itself.

## Refresh tokens

Refresh tokens are security tokens which your app can use to acquire new access tokens in an OAuth 2.0 flow.  It allows your app to achieve long-term access to resources on behalf of a user without requiring interaction by the user.

Refresh tokens are multi-resource.  That is to say that a refresh token received during a token request for one resource can be redeemed for access tokens to a completely different resource. To do this, set the `resource` parameter in the request to the targeted resource.

Refresh tokens are completely opaque to your app. They are long-lived, but your app should not be written to expect that a refresh token will last for any period of time.  Refresh tokens can be invalidated at any moment in time for a variety of reasons.  The only way for your app to know if a refresh token is valid is to attempt to redeem it by making a token request to Azure AD token endpoint.

When you redeem a refresh token for a new access token, you will receive a new refresh token in the token response.  You should save the newly issued refresh token, replacing the one you used in the request.  This will guarantee that your refresh tokens remain valid for as long as possible.

## Validating tokens

At this point in time, the only token validation your client app should need to perform is validating id_tokens.  In order to validate an id_token, your app should validate both the id_token's signature and the claims in the id_token.

We provide libraries and code samples that show how to easily handle token validation - the below information is simply provided for those who wish to understand the underlying process.  There are also several third party open source libraries available for JWT validation - there is at least one option for almost every platform and language out there. For more information about Azure AD authentication libraries and code samples, please see [Azure AD authentication libraries](active-directory-authentication-libraries.md).

#### Validating the signature

A JWT contains three segments, which are separated by the `.` character.  The first segment is known as the **header**, the second as the **body**, and the third as the **signature**.  The signature segment can be used to validate the authenticity of the id_token so that it can be trusted by your app.

Id_Tokens are signed using industry standard asymmetric encryption algorithms, such as RSA 256. The header of the id_token contains information about the key and encryption method used to sign the token:

```
{
  "typ": "JWT",
  "alg": "RS256",
  "x5t": "kriMPdmBvx68skT8-mPAB3BseeA"
}
```

The `alg` claim indicates the algorithm that was used to sign the token, while the `x5t` claim indicates the particular public key that was used to sign the token.

At any given point in time, Azure AD may sign an id_token using any one of a certain set of public-private key pairs. Azure AD rotates the possible set of keys on a periodic basis, so your app should be written to handle those key changes automatically.  A reasonable frequency to check for updates to the public keys used by Azure AD is every 24 hours.

#### Validating the claims

When your app receives an id_token upon user sign-in, it should also perform a few checks against the claims in the id_token.  These include but are not limited to:

  - The **Audience** claim - to verify that the id_token was intended to be given to your app.
  - The **Not Before** and **Expiration Time** claims - to verify that the id_token has not expired.
  - The **Issuer** claim - to verify that the token was indeed issued to your app by Azure AD.
  - The **Nonce** -  as a token replay attack mitigation.
  - and more...

For an full list of claim validations your app should perform, refer to the [OpenID Connect specification](http://openid.net/specs/openid-connect-core-1_0.html#IDTokenValidation).

Details of the expected values for these claims are included above in the [id_token section](#id-tokens).

## Sample Tokens

This section displays samples of SAML and JWT tokens that Azure AD returns. These samples let you see the claims in context.
SAML Token

This is a sample of a typical SAML token.

	<?xml version="1.0" encoding="UTF-8"?>
	<t:RequestSecurityTokenResponse xmlns:t="http://schemas.xmlsoap.org/ws/2005/02/trust">
	  <t:Lifetime>
		<wsu:Created xmlns:wsu="http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-wssecurity-utility-1.0.xsd">2014-12-24T05:15:47.060Z</wsu:Created>
		<wsu:Expires xmlns:wsu="http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-wssecurity-utility-1.0.xsd">2014-12-24T06:15:47.060Z</wsu:Expires>
	  </t:Lifetime>
	  <wsp:AppliesTo xmlns:wsp="http://schemas.xmlsoap.org/ws/2004/09/policy">
		<EndpointReference xmlns="http://www.w3.org/2005/08/addressing">
		  <Address>https://contoso.onmicrosoft.com/MyWebApp</Address>
		</EndpointReference>
	  </wsp:AppliesTo>
	  <t:RequestedSecurityToken>
		<Assertion xmlns="urn:oasis:names:tc:SAML:2.0:assertion" ID="_3ef08993-846b-41de-99df-b7f3ff77671b" IssueInstant="2014-12-24T05:20:47.060Z" Version="2.0">
		  <Issuer>https://sts.windows.net/b9411234-09af-49c2-b0c3-653adc1f376e/</Issuer>
		  <ds:Signature xmlns:ds="http://www.w3.org/2000/09/xmldsig#">
			<ds:SignedInfo>
			  <ds:CanonicalizationMethod Algorithm="http://www.w3.org/2001/10/xml-exc-c14n#" />
			  <ds:SignatureMethod Algorithm="http://www.w3.org/2001/04/xmldsig-more#rsa-sha256" />
			  <ds:Reference URI="#_3ef08993-846b-41de-99df-b7f3ff77671b">
				<ds:Transforms>
				  <ds:Transform Algorithm="http://www.w3.org/2000/09/xmldsig#enveloped-signature" />
				  <ds:Transform Algorithm="http://www.w3.org/2001/10/xml-exc-c14n#" />
				</ds:Transforms>
				<ds:DigestMethod Algorithm="http://www.w3.org/2001/04/xmlenc#sha256" />
				<ds:DigestValue>cV1J580U1pD24hEyGuAxrbtgROVyghCqI32UkER/nDY=</ds:DigestValue>
			  </ds:Reference>
			</ds:SignedInfo>
			<ds:SignatureValue>j+zPf6mti8Rq4Kyw2NU2nnu0pbJU1z5bR/zDaKaO7FCTdmjUzAvIVfF8pspVR6CbzcYM3HOAmLhuWmBkAAk6qQUBmKsw+XlmF/pB/ivJFdgZSLrtlBs1P/WBV3t04x6fRW4FcIDzh8KhctzJZfS5wGCfYw95er7WJxJi0nU41d7j5HRDidBoXgP755jQu2ZER7wOYZr6ff+ha+/Aj3UMw+8ZtC+WCJC3yyENHDAnp2RfgdElJal68enn668fk8pBDjKDGzbNBO6qBgFPaBT65YvE/tkEmrUxdWkmUKv3y7JWzUYNMD9oUlut93UTyTAIGOs5fvP9ZfK2vNeMVJW7Xg==</ds:SignatureValue>
			<KeyInfo xmlns="http://www.w3.org/2000/09/xmldsig#">
			  <X509Data>
				<X509Certificate>MIIDPjCCAabcAwIBAgIQsRiM0jheFZhKk49YD0SK1TAJBgUrDgMCHQUAMC0xKzApBgNVBAMTImFjY291bnRzLmFjY2Vzc2NvbnRyb2wud2luZG93cy5uZXQwHhcNMTQwMTAxMDcwMDAwWhcNMTYwMTAxMDcwMDAwWjAtMSswKQYDVQQDEyJhY2NvdW50cy5hY2Nlc3Njb250cm9sLndpbmRvd3MubmV0MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAkSCWg6q9iYxvJE2NIhSyOiKvqoWCO2GFipgH0sTSAs5FalHQosk9ZNTztX0ywS/AHsBeQPqYygfYVJL6/EgzVuwRk5txr9e3n1uml94fLyq/AXbwo9yAduf4dCHTP8CWR1dnDR+Qnz/4PYlWVEuuHHONOw/blbfdMjhY+C/BYM2E3pRxbohBb3x//CfueV7ddz2LYiH3wjz0QS/7kjPiNCsXcNyKQEOTkbHFi3mu0u13SQwNddhcynd/GTgWN8A+6SN1r4hzpjFKFLbZnBt77ACSiYx+IHK4Mp+NaVEi5wQtSsjQtI++XsokxRDqYLwus1I1SihgbV/STTg5enufuwIDAQABo2IwYDBeBgNVHQEEVzBVgBDLebM6bK3BjWGqIBrBNFeNoS8wLTErMCkGA1UEAxMiYWNjb3VudHMuYWNjZXNzY29udHJvbC53aW5kb3dzLm5ldIIQsRiM0jheFZhKk49YD0SK1TAJBgUrDgMCHQUAA4IBAQCJ4JApryF77EKC4zF5bUaBLQHQ1PNtA1uMDbdNVGKCmSp8M65b8h0NwlIjGGGy/unK8P6jWFdm5IlZ0YPTOgzcRZguXDPj7ajyvlVEQ2K2ICvTYiRQqrOhEhZMSSZsTKXFVwNfW6ADDkN3bvVOVbtpty+nBY5UqnI7xbcoHLZ4wYD251uj5+lo13YLnsVrmQ16NCBYq2nQFNPuNJw6t3XUbwBHXpF46aLT1/eGf/7Xx6iy8yPJX4DyrpFTutDz882RWofGEO5t4Cw+zZg70dJ/hH/ODYRMorfXEW+8uKmXMKmX2wyxMKvfiPbTy5LmAU8Jvjs2tLg4rOBcXWLAIarZ</X509Certificate>
			  </X509Data>
			</KeyInfo>
		  </ds:Signature>
		  <Subject>
			<NameID Format="urn:oasis:names:tc:SAML:2.0:nameid-format:persistent">m_H3naDei2LNxUmEcWd0BZlNi_jVET1pMLR6iQSuYmo</NameID>
			<SubjectConfirmation Method="urn:oasis:names:tc:SAML:2.0:cm:bearer" />
		  </Subject>
		  <Conditions NotBefore="2014-12-24T05:15:47.060Z" NotOnOrAfter="2014-12-24T06:15:47.060Z">
			<AudienceRestriction>
			  <Audience>https://contoso.onmicrosoft.com/MyWebApp</Audience>
			</AudienceRestriction>
		  </Conditions>
		  <AttributeStatement>
			<Attribute Name="http://schemas.microsoft.com/identity/claims/objectidentifier">
			  <AttributeValue>a1addde8-e4f9-4571-ad93-3059e3750d23</AttributeValue>
			</Attribute>
			<Attribute Name="http://schemas.microsoft.com/identity/claims/tenantid">
			  <AttributeValue>b9411234-09af-49c2-b0c3-653adc1f376e</AttributeValue>
			</Attribute>
			<Attribute Name="http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name">
			  <AttributeValue>sample.admin@contoso.onmicrosoft.com</AttributeValue>
			</Attribute>
			<Attribute Name="http://schemas.xmlsoap.org/ws/2005/05/identity/claims/surname">
			  <AttributeValue>Admin</AttributeValue>
			</Attribute>
			<Attribute Name="http://schemas.xmlsoap.org/ws/2005/05/identity/claims/givenname">
			  <AttributeValue>Sample</AttributeValue>
			</Attribute>
			<Attribute Name="http://schemas.microsoft.com/ws/2008/06/identity/claims/groups">
			  <AttributeValue>5581e43f-6096-41d4-8ffa-04e560bab39d</AttributeValue>
			  <AttributeValue>07dd8a89-bf6d-4e81-8844-230b77145381</AttributeValue>
			  <AttributeValue>0e129f4g-6b0a-4944-982d-f776000632af</AttributeValue>
			  <AttributeValue>3ee07328-52ef-4739-a89b-109708c22fb5</AttributeValue>
			  <AttributeValue>329k14b3-1851-4b94-947f-9a4dacb595f4</AttributeValue>
			  <AttributeValue>6e32c650-9b0a-4491-b429-6c60d2ca9a42</AttributeValue>
			  <AttributeValue>f3a169a7-9a58-4e8f-9d47-b70029v07424</AttributeValue>
			  <AttributeValue>8e2c86b2-b1ad-476d-9574-544d155aa6ff</AttributeValue>
			  <AttributeValue>1bf80264-ff24-4866-b22c-6212e5b9a847</AttributeValue>
			  <AttributeValue>4075f9c3-072d-4c32-b542-03e6bc678f3e</AttributeValue>
			  <AttributeValue>76f80527-f2cd-46f4-8c52-8jvd8bc749b1</AttributeValue>
			  <AttributeValue>0ba31460-44d0-42b5-b90c-47b3fcc48e35</AttributeValue>
			  <AttributeValue>edd41703-8652-4948-94a7-2d917bba7667</AttributeValue>
			</Attribute>
			<Attribute Name="http://schemas.microsoft.com/identity/claims/identityprovider">
			  <AttributeValue>https://sts.windows.net/b9411234-09af-49c2-b0c3-653adc1f376e/</AttributeValue>
			</Attribute>
		  </AttributeStatement>
		  <AuthnStatement AuthnInstant="2014-12-23T18:51:11.000Z">
			<AuthnContext>
			  <AuthnContextClassRef>urn:oasis:names:tc:SAML:2.0:ac:classes:Password</AuthnContextClassRef>
			</AuthnContext>
		  </AuthnStatement>
		</Assertion>
	  </t:RequestedSecurityToken>
	  <t:RequestedAttachedReference>
		<SecurityTokenReference xmlns="http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-wssecurity-secext-1.0.xsd" xmlns:d3p1="http://docs.oasis-open.org/wss/oasis-wss-wssecurity-secext-1.1.xsd" d3p1:TokenType="http://docs.oasis-open.org/wss/oasis-wss-saml-token-profile-1.1#SAMLV2.0">
		  <KeyIdentifier ValueType="http://docs.oasis-open.org/wss/oasis-wss-saml-token-profile-1.1#SAMLID">_3ef08993-846b-41de-99df-b7f3ff77671b</KeyIdentifier>
		</SecurityTokenReference>
	  </t:RequestedAttachedReference>
	  <t:RequestedUnattachedReference>
		<SecurityTokenReference xmlns="http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-wssecurity-secext-1.0.xsd" xmlns:d3p1="http://docs.oasis-open.org/wss/oasis-wss-wssecurity-secext-1.1.xsd" d3p1:TokenType="http://docs.oasis-open.org/wss/oasis-wss-saml-token-profile-1.1#SAMLV2.0">
		  <KeyIdentifier ValueType="http://docs.oasis-open.org/wss/oasis-wss-saml-token-profile-1.1#SAMLID">_3ef08993-846b-41de-99df-b7f3ff77671b</KeyIdentifier>
		</SecurityTokenReference>
	  </t:RequestedUnattachedReference>
	  <t:TokenType>http://docs.oasis-open.org/wss/oasis-wss-saml-token-profile-1.1#SAMLV2.0</t:TokenType>
	  <t:RequestType>http://schemas.xmlsoap.org/ws/2005/02/trust/Issue</t:RequestType>
	  <t:KeyType>http://schemas.xmlsoap.org/ws/2005/05/identity/NoProofKey</t:KeyType>
	</t:RequestSecurityTokenResponse>

### JWT Token - User Impersonation

This is a sample of a typical JSON web token (JWT) used in an authorization code grant flow.
In addition to claims, the token includes a version number in **ver** and **appidacr**, the authentication context class reference, which indicates how the client was authenticated. For a public client, the value is 0. If a client ID or client secret was used, the value is 1.

    {
     typ: "JWT",
     alg: "RS256",
     x5t: "kriMPdmBvx68skT8-mPAB3BseeA"
    }.
    {
     aud: "https://contoso.onmicrosoft.com/scratchservice",
     iss: "https://sts.windows.net/b9411234-09af-49c2-b0c3-653adc1f376e/",
     iat: 1416968588,
     nbf: 1416968588,
     exp: 1416972488,
     ver: "1.0",
     tid: "b9411234-09af-49c2-b0c3-653adc1f376e",
     amr: [
      "pwd"
     ],
     roles: [
      "Admin"
     ],
     oid: "6526e123-0ff9-4fec-ae64-a8d5a77cf287",
     upn: "sample.user@contoso.onmicrosoft.com",
     unique_name: "sample.user@contoso.onmicrosoft.com",
     sub: "yf8C5e_VRkR1egGxJSDt5_olDFay6L5ilBA81hZhQEI",
     family_name: "User",
     given_name: "Sample",
     groups: [
      "0e129f6b-6b0a-4944-982d-f776000632af",
      "323b13b3-1851-4b94-947f-9a4dacb595f4",
      "6e32c250-9b0a-4491-b429-6c60d2ca9a42",
      "f3a161a7-9a58-4e8f-9d47-b70022a07424",
      "8d4c81b2-b1ad-476d-9574-544d155aa6ff",
      "1bf80164-ff24-4866-b19c-6212e5b9a847",
      "76f80127-f2cd-46f4-8c52-8edd8bc749b1",
      "0ba27160-44d0-42b5-b90c-47b3fcc48e35"
     ],
     appid: "b075ddef-0efa-123b-997b-de1337c29185",
     appidacr: "1",
     scp: "user_impersonation",
     acr: "1"
    }.
