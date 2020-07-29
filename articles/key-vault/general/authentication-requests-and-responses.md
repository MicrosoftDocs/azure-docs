---
title: Authentication, requests and responses
description: Authenticate to AD for using Key Vault
services: key-vault
author: msmbaldwin
manager: rkarlin
tags: azure-resource-manager

ms.service: key-vault
ms.subservice: general
ms.topic: conceptual
ms.date: 01/07/2019
ms.author: mbaldwin

---

# Authentication, requests and responses

Azure Key Vault supports JSON formatted requests and responses. Requests to the Azure Key Vault are directed to a valid Azure Key Vault URL using HTTPS with some URL parameters and JSON encoded request and response bodies.

This topic covers specifics for the Azure Key Vault service. For general information on using Azure REST interfaces, including authentication/authorization and how to acquire an access token, see [Azure REST API Reference](https://docs.microsoft.com/rest/api/azure).

## Request URL  
 Key management operations use HTTP DELETE, GET, PATCH, PUT and HTTP POST and cryptographic operations against existing key objects use HTTP POST. Clients that cannot support specific HTTP verbs may also use HTTP POST using the X-HTTP-REQUEST header to specify the intended verb; requests that do not normally require a body should include an empty body when using HTTP POST, for example when using POST instead of DELETE.  

 To work with objects in the Azure Key Vault, the following are example URLs:  

- To CREATE a key called TESTKEY in a Key Vault use - `PUT /keys/TESTKEY?api-version=<api_version> HTTP/1.1`  

- To IMPORT a key called IMPORTEDKEY into a Key Vault use - `POST /keys/IMPORTEDKEY/import?api-version=<api_version> HTTP/1.1`  

- To GET a secret called MYSECRET in a Key Vault use - `GET /secrets/MYSECRET?api-version=<api_version> HTTP/1.1`  

- To SIGN a digest using a key called TESTKEY in a Key Vault use - `POST /keys/TESTKEY/sign?api-version=<api_version> HTTP/1.1`  

  The authority for a request to a Key Vault is always as follows,  `https://{keyvault-name}.vault.azure.net/`  

  Keys are always stored under the /keys path, Secrets are always stored under the /secrets path.  

## API Version  
 The Azure Key Vault Service supports protocol versioning to provide compatibility with down-level clients, although not all capabilities will be available to those clients. Clients must use the `api-version` query string parameter to specify the version of the protocol that they support as there is no default.  

 Azure Key Vault protocol versions follow a date numbering scheme using a {YYYY}.{MM}.{DD} format.  

## Request Body  
 As per the HTTP specification, GET operations must NOT have a request body, and POST and PUT operations must have a request body. The body in DELETE operations is optional in HTTP.  

 Unless otherwise noted in operation description, the request body content type must be application/json and must contain a serialized JSON object conformant to content type.  

 Unless otherwise noted in operation description, the Accept request header must contain the application/json media type.  

## Response Body  
 Unless otherwise noted in operation description, the response body content type of both successful and failed operations will be application/json and contains detailed error information.  

## Using HTTP POST  
 Some clients may not be able to use certain HTTP verbs, such as PATCH or DELETE. Azure Key Vault supports HTTP POST as an alternative for these clients provided that the client also includes the “X-HTTP-METHOD” header to specific the original HTTP verb. Support for HTTP POST is noted for each of the API defined in this document.  

## Error Responses  
 Error handling will use HTTP status codes. Typical results are:  

- 2xx – Success: Used for normal operation. The response body will contain the expected result  

- 3xx – Redirection: The 304 "Not Modified" may be returned to fulfill a conditional GET. Other 3xx codes may be used in the future to indicate DNS and path changes.  

- 4xx – Client Error: Used for bad requests, missing keys, syntax errors, invalid parameters, authentication errors, etc. The response body will contain detailed error explanation.  

- 5xx – Server Error: Used for internal server errors. The response body will contain summarized error information.  

  The system is designed to work behind a proxy or firewall. Therefore, a client might receive other error codes.  

  Azure Key Vault also returns error information in the response body when a problem occurs. The response body is JSON formatted and takes the form:  

```  

{  
  "error":  
  {  
    "code": "BadArgument",  
    "message":  

      "’Foo’ is not a valid argument for ‘type’."  
    }  
  }  
}  

```  

## Authentication  
 All requests to Azure Key Vault MUST be authenticated. Azure Key Vault supports Azure Active Directory access tokens that may be obtained using OAuth2 [[RFC6749](https://tools.ietf.org/html/rfc6749)]. 
 
 For more information on registering your application and authenticating to use Azure Key Vault, see [Register your client application with Azure AD](https://docs.microsoft.com/rest/api/azure/index#register-your-client-application-with-azure-ad).
 
 Access tokens must be sent to the service using the HTTP Authorization header:  

```  
PUT /keys/MYKEY?api-version=<api_version>  HTTP/1.1  
Authorization: Bearer <access_token>  

```  

 When an access token is not supplied, or when a token is not accepted by the service, an HTTP 401 error will be returned to the client and will include the WWW-Authenticate header, for example:  

```  
401 Not Authorized  
WWW-Authenticate: Bearer authorization="…", resource="…"  

```  

 The parameters on the WWW-Authenticate header are:  

-   authorization: The address of the OAuth2 authorization service that may be used to obtain an access token for the request.  

-   resource: The name of the resource (`https://vault.azure.net`) to use in the authorization request.  

