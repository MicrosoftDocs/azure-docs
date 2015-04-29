<properties 
   pageTitle="Supported Token and Claim Types"
   description="A guide for understanding and evaluating the claims in the SAML 2.0 and JSON Web Tokens (JWT) tokens issued by Azure Active Directory (AAD)"
   documentationCenter="dev-center-name"
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
   ms.date="04/29/2015"
   ms.author="mbaldwin"/>

# Supported Token and Claim Types

This topic is designed to help you understand and evaluate the claims in the SAML 2.0 and JSON Web Tokens (JWT) tokens that Azure Active Directory (Azure AD) issues.

The topic begins with a description of each token claim and shows an example of the claim in a SAML token and a JWT token, as appropriate. Claims that are in preview status are listed separately. It ends with sample tokens so you can see the claims in context.

Azure adds claims to the tokens over time to enable new scenarios. Typically, we introduce these claims in preview status and then convert them to full support after a test period. To prepare for claim changes, applications that accept tokens from Azure AD should ignore unfamiliar token claims so that new claims do not break the application. Applications that use claims that are in preview status should not depend on these claims and should not raise exceptions if the claim does not appear in the token.
If your application needs claims that are not available in the SAML or JWT tokens that Azure AD issues, use the Community Additions section at the bottom of this page to suggest and discuss new claim types.

## Token Claims Reference

This section lists and describes the claims in tokens that Azure AD returns. It includes the SAML version and the JWT version of the claim and a description of the claim and its use. The claims are listed in alphabetical order.

### Application ID

The Application ID claim identifies the application that is using the token to access a resource. The application can act as itself or on behalf of a user. The application ID typically represents an application object, but it can also represent a service principal object in Azure AD.

Azure AD does not support an Application ID claim in a SAML token.

In a JWT token, the application ID appears in an appid claim.

    "appid":"15CB020F-3984-482A-864D-1D92265E8268"

### Audience
The audience of a token is the intended recipient of the token. The application that receives the token must verify that the audience value is correct and reject any tokens intended for a different audience.

The audience value is a string -- typically, the base address of the resource being accessed, such as "https://contoso.com". In Azure AD tokens, the audience is the App ID URI of the application that requested the token. When the application (which is the audience) has more than one App ID URI, the App ID URI in the Audience claim of the token matches the App ID Uri in the token request.
In a SAML token, the Audience claim is defined in the Audience element of the AudienceRestriction element.

    <AudienceRestriction>
    <Audience>https://contoso.com</Audience>
    </AudienceRestriction>

In a JWT token, the audience appears in an aud claim.

    "aud":"https://contoso.com"

### Application Authentication Context Class Reference

The Application Authentication Context Class Reference claim indicates how the client was authenticated. For a public client, the value is 0. If client ID and client secret are used, the value is 1.

In a JWT token, the authentication context class reference value appears in an appidacr (application-specific ACR value) claim.

    "appidacr": "0"

### Authentication Context Class Reference
The Authentication Context Class Reference claim indicates how the subject was authenticated, as opposed to the client in the Application Authentication Context Class Reference claim. A value of "0" indicates the end-user authentication did not meet the requirements of ISO/IEC 29115.

- In a JWT token, the authentication context class reference claim appears in the acr (user-specific ACR value) claim.

    "acr": "0"

### Authentication Instant

The Authentication Instant claim records the date and time when authentication occurred.

In a SAML token, the authentication instant appears in the AuthnInstant attribute of the AuthnStatement element. It represents a datetime in UTC (Z) time.

    <AuthnStatement AuthnInstant="2011-12-29T05:35:22.000Z">

Azure AD does not have an equivalent claim in JWT tokens.

### Authentication Method

The Authentication Method claim tells how the subject of the token was authenticated. In this example, the identity provider used a password to authenticate the user.
    http://schemas.microsoft.com/ws/2008/06/identity/claims/authenticationmethod/password

In a SAML token, the authentication method value appears in the AuthnContextClassRef element.

    <AuthnContextClassRef>http://schemas.microsoft.com/ws/2008/06/identity/claims/authenticationmethod/password</AuthnContextClassRef>

In a JWT token, the authentication method value appears inside the amr claim.

    “amr”: ["pwd"]

###First Name

The First Name or "given name" claim provides the first or "given" name of the user, as set on the Azure AD user object.

In a SAML token, the first name (or "given name") appears in a claim in the givenname SAML Attribute element.

    <Attribute Name=” http://schemas.xmlsoap.org/ws/2005/05/identity/claims/givenname”>
    <AttributeValue>Frank<AttributeValue>

In a JWT token, the first name appears in the given_name claim.

    "given_name": "Frank"

### Groups

The Groups claim provides object IDs that represent the subject's group memberships. These values are unique (see Object ID) and can be safely used for managing access, such as enforcing authorization to access a resource. The groups included in the groups claim are configured on a per-application basis, through the "groupMembershipClaims" property of the application manifest. A value of null will exclude all groups, a value of "SecurityGroup" will include only Active Directory Security Group memberships, and a value of "All" will include both Security Groups and Office 365 Distribution Lists. In any configuration, the groups claim represents the subject's transitive group memberships.

In a SAML token, the groups claim appears in the groups attribute.

    <Attribute Name="http://schemas.microsoft.com/ws/2008/06/identity/claims/groups">
    <AttributeValue>07dd8a60-bf6d-4e17-8844-230b77145381</AttributeValue>

In a JWT token, the groups claim appears in the groups claim.

    “groups”: ["0e129f5b-6b0a-4944-982d-f776045632af", … ]

### Identity Provider

The Identity Provider claim records the identity provider that authenticated the subject of the token. This value is identical to the value of the Issuer claim unless the user account is in a different tenant than the issuer.

In a SAML token, the identity provider appears in a claim in the identityprovider SAML Attribute element.

    <Attribute Name=” http://schemas.microsoft.com/identity/claims/identityprovider”>
    <AttributeValue>https://sts.windows.net/cbb1a5ac-f33b-45fa-9bf5-f37db0fed422/<AttributeValue>

In a JWT token, the identity provider appears in an idp claim.

    "idp":”https://sts.windows.net/cbb1a5ac-f33b-45fa-9bf5-f37db0fed422/”

### IssuedAt

The IssuedAt claim stores the time at which the token was issued. It is often used to measure token freshness.
In a SAML token, the IssuedAt value appears in the IssueInstant assertion.

    <Assertion ID="_d5ec7a9b-8d8f-4b44-8c94-9812612142be" IssueInstant="2014-01-06T20:20:23.085Z" Version="2.0" xmlns="urn:oasis:names:tc:SAML:2.0:assertion">

In a JWT token, the IssuedAt value appears in the iat claim. The value is expressed in the number of seconds since 1970-01-010:0:0Z in Coordinated Universal Time (UTC).

    "iat": 1390234181

### Issuer

The Issuer claim identifies the security token service (STS) that constructs and returns the token and the Azure AD directory tenant.
In the tokens that Azure AD returns, the issuer is sts.windows.net. The GUID in the Issuer claim value is the tenant ID of the Azure AD directory. The tenant ID is an immutable and reliable identifier of the directory.

In a SAML token, the Issuer claim appears in an Issuer element.

    <Issuer>https://sts.windows.net/cbb1a5ac-f33b-45fa-9bf5-f37db0fed422/</Issuer>

In a JWT token, the Issuer appears in an iss claim.

    "iss":”https://sts.windows.net/cbb1a5ac-f33b-45fa-9bf5-f37db0fed422/”

### Last Name

The Last Name claim provides the last name, surname, or family name of the user as defined in the Azure AD user object.
In a SAML token, The last name appears in a claim in the surname SAML Attribute element.

    <Attribute Name=” http://schemas.xmlsoap.org/ws/2005/05/identity/claims/surname”>
    <AttributeValue>Miller<AttributeValue>

In a JWT token, the last name appears in the family_name claim.

    "family_name": "Miller"

### Name

The Name claim provides a human readable value that identifies the subject of the token. This value is not guaranteed to be unique within a tenant and is designed to be used only for display purposes.
In a SAML token, the name appears in the Name attribute.

    <Attribute Name=”http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name”>
    <AttributeValue>frankm@contoso.com<AttributeValue>

In a JWT claim, the name appears in the unique_name claim.

    "unique_name": "frankm@contoso.com"

### Object ID

The Object ID claim contains a unique identifier of an object in Azure AD. This value is immutable and cannot be reassigned or reused, so you can use it to perform authorization checks safely, such as when the token is used to access a resource. Use the object ID to identify an object in queries to Azure AD.
In a SAML token, the Object ID appears in the objectidentifier attribute.

    <Attribute Name="http://schemas.microsoft.com/identity/claims/objectidentifier">
    <AttributeValue>528b2ac2-aa9c-45e1-88d4-959b53bc7dd0<AttributeValue>

In a JWT token, Object ID appears in an oid claim.

    "oid":"528b2ac2-aa9c-45e1-88d4-959b53bc7dd0"

### Roles

The Roles claim provides friendly strings that represent the subject's application role assignments in Azure AD, and can be used to enforce role-based access control. Application roles are defined on a per-application basis, through the "appRoles" property of the application manifest. The "value" property of each application role is the value that appears in the roles claim. The roles included in the roles claim represent all application roles that the subject has been granted both directly and indirectly through group membership.
In a SAML token, the roles claim appears in the roles attribute.

    <Attribute Name="http://schemas.microsoft.com/ws/2008/06/identity/claims/roles">
    <AttributeValue>Admin</AttributeValue>

In a JWT token, the roles claim appears in the roles claim.

    “roles”: ["Admin", … ]

### Scope

The Scope of the token indicates the impersonation permissions granted to the client application. The default permission is user_impersonation. The owner of the secured resource can register additional values in Azure AD.

In a JWT token, the scope of the token is specified in a scp claim.

    "scp": "user_impersonation"

### Subject

The Subject of the token is the principal about which the token asserts information, such as the user of an application. This value is immutable and cannot be reassigned or reused, so it can be used to perform authorization checks safely, such as when the token is used to access a resource. Because the subject is always present in the tokens the Azure AD issues, we recommended using this value in a general purpose authorization system.

In a SAML token, the subject of the token is specified in the NameID element of the Subject element. The NameID is a unique, non-reused identifier of the subject, which can be a user, an application, or a service.

SubjectConfirmation is not a claim. It describes how the subject of the token is verified. "Bearer" indicates that the subject is confirmed by their possession of the token.

    <Subject>
    <NameID>S40rgb3XjhFTv6EQTETkEzcgVmToHKRkZUIsJlmLdVc</NameID>
    <SubjectConfirmation Method="urn:oasis:names:tc:SAML:2.0:cm:bearer" />
    </Subject>

In a JWT token, the subject appears in a sub claim.

    "sub":"92d0312b-26b9-4887-a338-7b00fb3c5eab"

### Tenant ID
The Tenant ID is an immutable, non-reusable identifier that identifies the directory tenant that issued the token. You can use this value to access tenant-specific directory resources in a multi-tenant application. For example, you can use this value to identify the tenant in a call to the Graph API.

In a SAML token, the tenant ID appears in a claim in the tenantid SAML Attribute element.

    <Attribute Name=”http://schemas.microsoft.com/identity/claims/tenantid”>
    <AttributeValue>cbb1a5ac-f33b-45fa-9bf5-f37db0fed422<AttributeValue>

In a JWT token, the tenant ID appears in a tid claim.

    "tid":"cbb1a5ac-f33b-45fa-9bf5-f37db0fed422"

### Token Lifetime
The Token Lifetime claim defines the time interval within which a token is valid. The service that validates the token should verify that the current date is within the token lifetime. Otherwise, it should reject the token. The service might provide an allowance of up to five minutes beyond the token lifetime range to account for any differences in clock time ("time skew") between Azure AD and the service.

In a SAML token, the Token Lifetime claim is defined in the Conditions element by using the NotBefore and NotOnOrAfter attributes.

    <Conditions
    NotBefore="2013-03-18T21:32:51.261Z"
    NotOnOrAfter="2013-03-18T22:32:51.261Z"
    >

In a JWT token, the Token Lifetime is defined by nbf (not before) and exp (expiration time) claims. The value of these claims is expressed in the number of seconds since 1970-01-010:0:0Z in Coordinated Universal Time (UTC). For more information, see RFC 3339.

    "nbf":1363289634,
    "exp":1363293234

### User Principal Name
The User Principal Name claim stores the user name of the user principal.

In a JWT token, the user principal name appears in a upn claim.

    "upn": frankm@contoso.com

### Version
The Version claim stores the version number of the token.
In a JWT token, the user principal name appears in a ver claim.

    "ver": "1.0"

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

This is a sample of a typical JSON web token (JWT) used in a user impersonation web flow.
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

##See Also
### Concepts

[Azure Active Directory Authentication Protocols](active-directory-authentication-protocols.md)
