<properties
	pageTitle="Azure AD Service to Service Auth using OAuth2.0 | Microsoft Azure"
	description="This article describes how to use HTTP messages to implement service to service authentication using the OAuth2.0 client credentials grant flow."
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

# Service to service calls using client credentials

The OAuth 2.0 Client Credentials Grant Flow permits a web service (a *confidential client*) to use its own credentials to authenticate when calling another web service, instead of impersonating a user. In this scenario, the client is typically a middle-tier web service, a daemon service, or web site.

## Client credentials grant flow diagram

The following diagram explains how the client credentials grant flow works in Azure AD.

![OAuth2.0 Client Credentials Grant Flow](media/active-directory-protocols-oauth-service-to-service/active-directory-protocols-oauth-client-credentials-grant-flow.jpg)

1. The client application authenticates to the Azure AD token issuance endpoint and requests an access token.
2. The Azure AD token issuance endpoint issues the access token.
3. The access token is used to authenticate to the secured resource.
4. Data from the secured resource is returned to the web application.

## Register the Services in Azure AD

Register both the calling service and the receiving service in Azure Active Directory (Azure AD). For detailed instructions, see Adding, Updating, and Removing an App

## Request an Access Token

To request an access token, use an HTTP POST to the tenant-specific Azure AD endpoint.

```
https://login.microsoftonline.com/<tenant id>/oauth2/token
```

## Service-to-service access token request

A service-to-service access token request contains the following parameters.

| Parameter |  | Description |
|-----------|--|------------|
| response_type | required | Specifies the requested response type. In a Client Credentials Grant flow, the value must be **client_credentials**.|
| client_id | required | Specifies the Azure AD client id of the calling web service. To find the calling application's client ID, in the Azure Management Portal, click **Active Directory**, click the directory, click the application, and then click **Configure**.|
| client_secret | required |  Enter a key registered for the calling web service in Azure AD. To create a key, in the Azure Management Portal, click **Active Directory**, click the directory, click the application, and then click **Configure**. |
| resource | required | Enter the App ID URI of the receiving web service. To find the App ID URI, in the Azure Management Portal, click **Active Directory**, click the directory, click the application, and then click **Configure**. |

## Example

The following HTTP POST requests an access token for the https://service.contoso.com/ web service. The `client_id` identifies the web service that requests the access token.

```
POST contoso.com/oauth2/token HTTP/1.1
Host: login.microsoftonline.com
Content-Type: application/x-www-form-urlencoded

grant_type=client_credentials&client_id=625bc9f6-3bf6-4b6d-94ba-e97cf07a22de&client_secret=qkDwDJlDfig2IpeuUZYKH1Wb8q1V0ju6sILxQQqhJ+s=&resource=https%3A%2F%2Fservice.contoso.com%2F
```

## Service-to-Service Access Token Response

A success response contains a JSON OAuth 2.0 response with the following parameters.

| Parameter   | Description |
|-------------|-------------|
|access_token |The requested access token. The calling web service can use this token to authenticate to the receiving web service. |
|access_type  | Indicates the token type value. The only type that Azure AD supports is **Bearer**. For more information about bearer tokens, see The [OAuth 2.0 Authorization Framework: Bearer Token Usage (RFC 6750)](http://www.rfc-editor.org/rfc/rfc6750.txt).
|expires_in   | How long the access token is valid (in seconds).|
|expires_on   |The time when the access token expires. The date is represented as the number of seconds from 1970-01-01T0:0:0Z UTC until the expiration time. This value is used to determine the lifetime of cached tokens. |
|resource     | The App ID URI of the receiving web service. |

## Example

The following example shows a success response to a request for an access token to a web service.

```
{
"access_token":"eyJhbGciOiJSUzI1NiIsIng1dCI6IjdkRC1nZWNOZ1gxWmY3R0xrT3ZwT0IyZGNWQSIsInR5cCI6IkpXVCJ9.eyJhdWQiOiJodHRwczovL3NlcnZpY2UuY29udG9zby5jb20vIiwiaXNzIjoiaHR0cHM6Ly9zdHMud2luZG93cy5uZXQvN2ZlODE0NDctZGE1Ny00Mzg1LWJlY2ItNmRlNTdmMjE0NzdlLyIsImlhdCI6MTM4ODQ0ODI2NywibmJmIjoxMzg4NDQ4MjY3LCJleHAiOjEzODg0NTIxNjcsInZlciI6IjEuMCIsInRpZCI6IjdmZTgxNDQ3LWRhNTctNDM4NS1iZWNiLTZkZTU3ZjIxNDc3ZSIsIm9pZCI6ImE5OTE5MTYyLTkyMTctNDlkYS1hZTIyLWYxMTM3YzI1Y2RlYSIsInN1YiI6ImE5OTE5MTYyLTkyMTctNDlkYS1hZTIyLWYxMTM3YzI1Y2RlYSIsImlkcCI6Imh0dHBzOi8vc3RzLndpbmRvd3MubmV0LzdmZTgxNDQ3LWRhNTctNDM4NS1iZWNiLTZkZTU3ZjIxNDc3ZS8iLCJhcHBpZCI6ImQxN2QxNWJjLWM1NzYtNDFlNS05MjdmLWRiNWYzMGRkNThmMSIsImFwcGlkYWNyIjoiMSJ9.aqtfJ7G37CpKV901Vm9sGiQhde0WMg6luYJR4wuNR2ffaQsVPPpKirM5rbc6o5CmW1OtmaAIdwDcL6i9ZT9ooIIicSRrjCYMYWHX08ip-tj-uWUihGztI02xKdWiycItpWiHxapQm0a8Ti1CWRjJghORC1B1-fah_yWx6Cjuf4QE8xJcu-ZHX0pVZNPX22PHYV5Km-vPTq2HtIqdboKyZy3Y4y3geOrRIFElZYoqjqSv5q9Jgtj5ERsNQIjefpyxW3EwPtFqMcDm4ebiAEpoEWRN4QYOMxnC9OUBeG9oLA0lTfmhgHLAtvJogJcYFzwngTsVo6HznsvPWy7UP3MINA",
"token_type":"Bearer",
"expires_in":"3599",
"expires_on":"1388452167",
"resource":"https://service.contoso.com/"
}
```

## See also

* [OAuth 2.0 in Azure AD](https://azure.microsoft.com/en-us/documentation/articles/active-directory-protocols-oauth-code/)
