---
title: Error codes in Azure Active Directory B2C
description: A list of the error codes returned by the Azure Active Directory B2C service.
services: B2C
author: mmacy
manager: celestedg

ms.service: active-directory
ms.workload: identity
ms.topic: conceptual
ms.date: 06/20/2019
ms.author: marsma
ms.subservice: B2C
---

# Azure Active Directory B2C error codes

The following table shows error codes and their descriptions that can be returned by the Azure Active Directory B2C service.

| Code | Message | Description |
| ---- | ------- | ----------- |
| AADB2C90001 | The server hosting resource '{0}' is not enabled for CORS requests. Ensure that the 'Access-Control-Allow-Origin' header has been configured. | An error indicating that CORS is not supported for the specified resource. |
| AADB2C90002 | The CORS resource '{0}' returned a 404 not found. | An error indicating that the CORS resource was not found at the specified location. |
| AADB2C90003 | An unknown exception has occurred while requesting a CORS resource. | An error indicating indicating that the CORS resource caused an unknown exception. |
| AADB2C90004 | The request does not contain a redirect URI. | An error indicating that OAuth2 authentication request does not contain redirect URI. |
| AADB2C90005 | The redirect URI '{0}' has an invalid format. Specify an absolute URI such as 'https://example.com/return'. | An error indicating that OAuth2 authentication request contains a malformed redirect URI. |
| AADB2C90006 | The redirect URI '{0}' provided in the request is not registered for the client id '{1}'. | An error indicating that OAuth2 authentication request contains an unregistered redirect URI. |
| AADB2C90007 | The application associated with client id '{0}' has no registered redirect URIs. | An error indicating that application associated with the specified client id does not have any registered redirect URIs. |
| AADB2C90008 | The request does not contain a client id parameter. | An error indicating that the OAuth request did not include a client id. |
| AADB2C90009 | The request does not contain a nonce. A nonce is required when using the '{0}' algorithm. | An error indicating that the OAuth request did not include a nonce. |
| AADB2C90010 | The request does not contain a scope parameter. | An error indicating that the OAuth request did not include a scope. |
| AADB2C90011 | The client id '{0}' provided in the request does not match client id '{1}' registered in policy. | An error indicating that the OAuth request client id does not match the client id in policy. |
| AADB2C90012 | The scope '{0}' provided in request is not supported. | An error indicating that the OAuth request scope is not supported. |
| AADB2C90013 | The requested response type '{0}' provided in the request is not supported. | An error indicating that the requested response type is not supported. |
| AADB2C90014 | The requested response mode '{0}' provided in the request is not supported. | An error indicating that the requested response mode is not supported. |
| AADB2C90015 | The HTTP method '{0}' provided in the request is not supported. | An error indicating that the requested HTTP method is not supported. |
| AADB2C90016 | The requested client assertion type '{0}' does not match the expected type '{1}'. | An error indicating that the requested client assertion type does not match the expected type. |
| AADB2C90017 | The client assertion provided in the request is invalid: {0} | An error indicating that the client assertion provided in the request is invalid. |
| AADB2C90018 | The client id '{0}' specified in the request is not registered in tenant '{1}'. | An error indicating that the request client id is not registered in the specified tenant. |
| AADB2C90019 | The key container with id '{0}' in tenant '{1}' does not has a valid key. Reason: {2}. | An error indicating that the key container has no valid key. Possibly the key expired (exp <= now) or the key container has only future keys (nbf > now). |
| AADB2C90020 | The specified signature algorithm '{0}' is not supported. Expected one of 'sha1RSA' or 'sha256RSA'. | An error indicating that the signature algorithm specified for the signing of metadata is not supported. |
| AADB2C90021 | The technical profile '{0}' does not exist in the policy '{1}' of tenant '{2}'. | An error indicating that specified technical profile does not exist in the policy of the tenant. |
| AADB2C90022 | Unable to return metadata for the policy '{0}' in tenant '{1}'. | An error indicating that metadata for the policy cannot be returned. |
| AADB2C90023 | Profile '{0}' does not contain the required metadata key '{1}'. | An error indicating that the specified metadata item for the technical profile cannot be found. |
| AADB2C90024 | Profile '{0}' contains the unsupported authentication type '{1}'. Expected one of '{2}', '{3}' or '{4}'. | An error indicating that the specified authentication metadata type is not supported. |
| AADB2C90025 | Profile '{0}' in policy '{1}' in tenant '{2}' does not contain the required cryptographic key '{3}'. | An error indicating that a required cryptographic key is missing from a technical profile. |
| AADB2C90026 | Profile '{0}' metadata contains the key '{1}' which has the empty or invalid URL format of '{2}'. | An error indicating that a provided metadata item contains an empty or invalid url. |
| AADB2C90027 | Basic credentials specified for '{0}' are invalid. Check that the credentials are correct and that access has been granted by the resource. | An error indicating that the provided basic credentials are invalid |
| AADB2C90028 | Client certificate specified for '{0}' is invalid. Check that the certificate is correct, contains a private key and that access has been granted by the resource. | An error indicating that the client certificte is invalid. |
| AADB2C90029 | Profile '{0}' contains the unsupported SendClaimsIn type '{1}'. Expected one of '{2}', '{3}' or '{4}'. | An error indicating that a profile contains an unsupported SendClaimsIn type. |
| AADB2C90030 | Profile '{0}' contains an invalid boolean for {1}. Expected either 'true' or 'false'. | An error indicating that a tehcnical profile specifies an invalid boolean for IgnoreServerCertificateErrors. |
| AADB2C90031 | Policy '{0}' does not specify a default user journey. Ensure that the policy or it's parents specify a default user journey as part of a relying party section. | An errorindicating that a provided policy does not contain have a default user journey specified. |
| AADB2C90032 | Profile '{0}' contains the unsupported request operation '{1}'. Expected one of '{2}' or '{3}'. | An error indicating that the specified request operation in metadata is not supported. |
| AADB2C90033 | Policy '{0}' does not specify an Azure Active Directory provider for reading from the directory by object id. | An error indicating that the specified policy does not define a technical profile for reading from AAD. |
| AADB2C90034 | Profile '{0}' must contain exactly one input claim. | An error indicating a specified technical profile can contain only one input claim. |
| AADB2C90035 | The service is temporarily unavailable. Please retry after a few minutes. | An error indicating that the MSODS Graph API is temporarily unavailable and the user should retry after a few minutes. |
| AADB2C90036 | The request does not contain a URI to redirect the user to post logout. Specify a URI in the post_logout_redirect_uri parameter field. | An error indicating the the logout request did not contain a URI to redirect the user to post logout. |
| AADB2C90037 | An error occurred while processing the request. Please contact administrator of the site you are trying to access. | An error indicating that an error was raised as a result of failure in MSODS. |
| AADB2C90038 | An error occurred while processing the request. Please try after a while, or contact administrator of the site you are trying to access if this error persists. | An error indicating that an error was raised due to a policy issue. |
| AADB2C90039 | The request contains a client assertion, but the provided policy '{0}' in tenant '{1}' is missing a client_secret in RelyingPartyPolicy. | An error indicating that a native client tried to send a client assertion. |
| AADB2C90040 | User journey '{0}' does not contain a send claims step. | An error indicating that a user journey does not specify a send claims step. |
| AADB2C90041 | User journey '{0}' send claims step does not contain a reference to an issuer technical profile. | An error indicating that a user journey does not specify an issuer technicalprofile. |
| AADB2C90042 | RequestContextMaximumLengthInBytes cannot be a negative. | An error indicating the request context maximum length has been exceeded. |
| AADB2C90043 | The prompt included in the request contains invalid values. Expected 'none', 'login', 'consent' or 'select_account'. | An error indicating an invalid open id connect prompt tyoe value has been specified. |
| AADB2C90044 | The claim '{0}' is not supported by the claim resolver '{1}'. | An error indicating the specified claim is not supported by the specified claim resolver. |
| AADB2C90045 | The claim resolver '{0}' specified in policy is not implemented. | An error indicating that the specified claim resolver is not implemented. |
| AADB2C90046 | We are having trouble loading your current state. You might want to try starting your session over from the beginning. | An error indicating a user journey that does not start properly and should be restarted. |
| AADB2C90047 | The resource '{0}' contains script errors preventing it from being loaded. | An error indicating that the specified CORS has script errors that prevent it from being loaded. |
| AADB2C90048 | An unhandled exception has occurred on the server. | An error indicating that unknown exception has occurred. |
| AADB2C90049 | User journey '{0}' is invalid because it contains multiple SendClaims steps. | An error indicating that a user journey contains more than one SendClaims step. |
| AADB2C90050 | User journey '{0}' is invalid because it contains steps which occur after the SendClaims step. | An error indicating that a user journey has steps which occur after the SendClaims step. |
| AADB2C90051 | No suitable claims providers were found. | An error indicating that no claims providers were found for the requesting application. |
| AADB2C90052 | Invalid username or password. | An error indicating the default error message for authentication failures against the directory. |
| AADB2C90053 | A user with the specified credential could not be found. | An error indicating indicating a user cannot be found in the directory. |
| AADB2C90054 | Invalid username or password. | An error indicating an invalid password has been provided. |
| AADB2C90055 | The scope '{0}' provided in request must specify a resource, such as 'https://example.com/calendar.read'. | An error indicating that the OAuth request scope does not specify a resource. |
| AADB2C90056 | The scope '{0}' contains a resource not authorized by the application. | An error indicating that the OAuth request scope contains a resource that is not authorized by the client application. |
| AADB2C90057 | The provided application is not configured to allow the OAuth Implicit flow. | An error indicating that request asks for use of the Implicit Flow, but the application is not configured to permit use of that flow. |
| AADB2C90058 | The provided application is not configured to allow public clients. | An error indicating that the request asks for use of a public client (no client_secret), but the application is not configured to allow public clients. |
| AADB2C90059 | The resource '{0}' contains errors preventing it from being parsed. | An error indicating that the CORS resource failed to parse. |
| AADB2C90060 | The client initializer timed out attempting to load the CORS resource '{0}'. | An error indicating that the user experience module failed to load on the client. |
| AADB2C90061 | The Ajax CORS request has been aborted by the user canceling execution or navigating to another page. | An error indicating that CORS request was aborted by the user. |
| AADB2C90062 | The B2C resource '{0}' returned a 404 not found. | An error indicating that the specified B2C resource returned a 404 not found. |
| AADB2C90063 | The B2C service has an internal error. | An error  indicating that the specified B2C resource server has an internal error. |
| AADB2C90064 | The server hosting resource '{0}' has returned an internal server error. | An error  indicating that the specified CORS resource server has an internal error. |
| AADB2C90065 | A B2C client-side error '{0}' has occurred requesting the remote resource. | An error indicating that the an error has occurred in the B2C initializer script will requesting the remote resource. |
| AADB2C90066 | Invalid policy '{0}' was specified in the request. | An error indicating that the policy specified in the request is invalid. |
| AADB2C90067 | The post logout redirect URI '{0}' has an invalid format. Specify an https based URL such as 'https://example.com/return' or for native clients use the IETF native client URI 'urn:ietf:wg:oauth:2.0:oob'. | An error indicating that Open Id connect logout request contains a malformed post logout redirect URI. |
| AADB2C90068 | The provided application with ID '{0}' is not valid against this service. Please use an application created via the B2C portal and try again. | An error indicating the relying party has attempted to use a V1 application against a V2 endpoint, or vice versa. |
| AADB2C90069 | The reply URLs of the application '{0}' contain invalid values. Reply URLs can be either localhost or use the same domain with https. | An error indicating that reply url of v1 application is invalid. |
| AADB2C90070 | The App ID URI of the application '{0}' has an invalid format. Specify an absolute URI such as 'https://example.com/'. | An error indicating that client uri of v1 applicatgion is invalid. |
| AADB2C90071 | The Sector Identifier of the application '{0}' has an invalid format. Specify an absolute URI such as 'https://example.com/'. | An error indicating that sector identifier uri of v1 application is invalid. |
| AADB2C90072 | The reply URLs of the application '{0}' contain invalid values. Reply URLs can be either localhost or use the same domain with https. | An error indicating that reply url of v2 application is invalid. |
| AADB2C90073 | {0} with '{1}': '{2}' cannot be found in the directory '{3}'. | An error indicating that application cannot be found in the directory. |
| AADB2C90074 | User attribute with id: '{0}' already exists in directory '{1}'. | An error indicating that a user attribute already exists in the directory. |
| AADB2C90075 | The claims exchange '{0}' specified in step '{1}' returned HTTP error response with Code '{2}' and Reason '{3}'. | An error indicating that an exception has occurred when making a restful service request. |
| AADB2C90076 | AAD query failed with reason: '{0}'. | An error indicating that Admin AAD Query request failed. |
| AADB2C90077 | User does not have an existing session and request prompt parameter has a value of '{0}'. | An error indicating that the user does not have an existing session and the request can not be fulfilled because of prompt=none. |
| AADB2C90078 | The request must contain a redirect URI when policy allows open redirection. | An error indicating that the OAuth2 authentication request must contain a redirect URI when the policy allows open redirection. |
| AADB2C90079 | Clients must send a client_secret when redeeming a confidential grant. | An error indicating that the OAuth2 token exchange request must include a client secret. |
| AADB2C90080 | The provided grant has expired. Please re-authenticate and try again. Current time: {0}, Grant issued time: {1}, Grant expiration time: {2} | An error indicating that the OAuth2 token exchange request used an expired grant token. |
| AADB2C90080 | The provided grant has expired. Please re-authenticate and try again. Current time: {0}, Grant issued time: {1}, Grant sliding window expiration time: {2}. | An error indicating that the OAuth2 token exchange request used an expired grant token because of sliding expiration. |
| AADB2C90081 | The specified client_secret does not match the expected value for this client. Please correct the client_secret and try again. | An error indicating that the OAuth2 token exchange request included an invalid client secret. |
| AADB2C90082 | The provided grant has insufficient authorization for the requested scope '{0}'. | An error indicating that the OAuth2 token exchange includes a grant token with insufficient privileges. |
| AADB2C90083 | The request is missing required parameter: {0}. | An error indicating that the OAuth2 token exchange is missing a required parameter. |
| AADB2C90084 | Public clients should not send a client_secret when redeeming a publicly acquired grant. | An error indicating that the OAuth2 token exchange request from a public client includes a client secret. |
| AADB2C90085 | The service has encountered an internal error. Please reauthenticate and try again. | An error indicating that the OAuth2 token exchange service has an internal error. |
| AADB2C90086 | The supplied grant_type [{0}] is not supported. | An error indicating that the OAuth2 token exchange request includes an unsupported grant type. |
| AADB2C90087 | The provided grant has not been issued for this version of the protocol endpoint. | An error indicating that the OAuth2 token exchange request includes a grant token issued for a different application version. |
| AADB2C90088 | The provided grant has not been issued for this endpoint. Actual Value : {0} and Expected Value : {1} | An error indicating that the OAuth2 token exchange request includes a grant token issued for a different tenant/policy id. |
| AADB2C90089 | All the keys in the key container '{2}' must be of the same type. The new key is of type '{1}' but it must be of type '{0}' to be consistent with existing keys. | An error indicating that the new key has not the type of the key container. |
| AADB2C90090 | {0}. | An error indicating that the OAuth2 token exchange request includes a grant token in an unsupported format. |
| AADB2C90091 | {0}. | An error indicating that the error is a result of a user action such as cancelling claims consent. |
| AADB2C90092 | The provided application with ID '{0}' is disabled for the tenant '{1}'. Please enable the application and try again. | An error indicating the relying party has attempted to use an application that has been disabled. |
| AADB2C90094 | One of the passwords provided for '{0}' is invalid. | An error indicating the relying party has attempted to use an application with an invalid password. |
| AADB2C90095 | One of the reply URLs provided for application '{0}' is invalid. Please change the reply URL and try again. | An error indicating the relying party has attempted to use an application with a prohibited word in the reply URL. |
| AADB2C90096 | The application display name '{0}' contains a word that is not allowed. Please change the display name and try again. | An error indicating the relying party has attempted to use an application with a prohibited word in the display name. |
| AADB2C90097 | One of the reply URLs provided for application '{0}' contains a word that is not allowed. Please change the reply URL and try again. | An error indicating the relying party has attempted to use an application with a prohibited word in reply URL. |
| AADB2C90098 | One of the passwords of application '{0}' is too weak. | An error indicating an attempt was made to create or update an application with a password that is too weak. |
| AADB2C90099 | One of the passwords of application '{0}' is too long. | An error indicating an attempt was made to create or update an application with a password that is too long. |
| AADB2C90100 | Too many passwords were provided for application '{0}'. | An error indicating an attempt was made to create or update an application with too many passwords. |
| AADB2C90101 | Identifier URI was provided for application '{0}' but they are not supported for V2 applications. If this application was edited outside of this B2C Admin experience, you will have to delete it and create it again. Read this article (https://go.microsoft.com/fwlink/?linkid=826306) for more details. | An error indicating an attempt was made to create or update an application with an identifier URI. |
| AADB2C90102 | One of the reply URLs provided for application '{0}' is not well formed. | An error indicating an attempt was made to create or update an application with a reply URL that is not well-formed. |
| AADB2C90103 | One of the reply URLs provided for application '{0}' contains a scheme that is not allowed. Only HTTPS is allowed, with HTTP for localhost. | An error indicating an attempt was made to create or update an application with a reply URL scheme that is not allowed. |
| AADB2C90104 | One of the reply URLs provided for application '{0}' contains query strings. Please change the reply URL and try again. | An error indicating an attempt was made to create or update an application with a reply URL that contains a wild card. |
| AADB2C90105 | One of the reply URLs provided for application '{0}' contains a wild card. Please remove the wild card and try again. | An error indicating an attempt was made to create or update an application with a reply URL containing wild cards. |
| AADB2C90106 | One of the reply URLs provided for application '{0}' is on a domain different from other reply URL(s). Please make sure all reply URLs other than localhost are on the same root domain. | An error indicating an attempt was made to create or update an application with one of the reply URLs not on the root domain. |
| AADB2C90107 | The application with ID '{0}' cannot get an ID token either because the openid scope was not provided in the request or the application is not authorized for it. | An error indicating the relying party application is not authorized to get id_token but attempted to get one. |
| AADB2C90108 | The orchestration step '{0}' does not specify a CpimIssuerTechnicalProfileReferenceId when one was expected. | An error indicating the specified orchestration step does not specify a token issuer technical profile. |
| AADB2C90109 | The reply URLs of the application '{0}' contain more than one unique external domains. Reply URLs can be either localhost or use the same domain with https. | An error indicating that reply url of v2 applicatgion contains more than 1 external domain. |
| AADB2C90110 | The scope parameter must include 'openid' when requesting a response_type that includes 'id_token'. | An error indicating that the OAuth request scope does not specify a resource. |
| AADB2C90111 | Your account has been locked. Contact your support person to unlock it, then try again. | An error indicating that a users account has been locked and that they will need an administrator to unlock it. |
| AADB2C90112 | The specified language '{0}' is invalid or unsupported. | An error indicating that the specified cullture is invalid or not supported. |
| AADB2C90113 | The uploaded XML has an error on line {0} col {1} : {2}. | An error indicating that the uploaded localized resources xml has an incorrect schema. |
| AADB2C90114 | Your account is temporarily locked to prevent unauthorized use. Try again later. | An error indicating that a users account has been temporarily locked and that they should try again later. |
| AADB2C90115 | When requesting the 'code' response_type, the scope parameter must include a resource or client ID for access tokens, and 'openid' for ID tokens. Additionally include 'offline_access' for refresh tokens. | An error indicating that when requesting the 'code' response_type, the scope parameter must include a resource or client ID for access tokens, and 'openid' for ID tokens. Additionally include 'offline_access' for refresh tokens. |
| AADB2C90116 | The default culture is not specified. Please select a valid default culture. | An error indicating that a default culture has not been specified. |
| AADB2C90117 | The scope '{0}' provided in the request is not supported. | An error indicating that the OAuth request scope is not supported. |
| AADB2C90118 | The user has forgotten their password. | An error indicating that the user has forgotten their password. |
| AADB2C90119 | User has exceeded the maximum number of retries for step '{0}' of policy '{1}'. | An error indicating that the maximum number of retries has been reached for a specified step in the policy. |
| AADB2C90120 | The max age parameter '{0}' specified in the request is invalid. Max age must be an integer between '{1}' and '{2}' inclusive. | An error indicating that the maximum age parameter in the request has an invalid value. |
| AADB2C90121 | The user session exceeds the specified maximum age and request prompt parameter has a value of 'None'. | An error indicating that the user session exceeds the specified maximum age and that request includes a prompt parameter of 'none' preventing user interaction. |
| AADB2C90122 | Input for '{0}' received in the request has failed HTTP request validation. Ensure that the input does not contain characters such as < or &. | An error indicating that request contained input that failed HTTP request validation. |
| AADB2C90123 | The scope parameter must include the client ID when requesting a response_type that includes 'token'. | An error indicating that the OAuth request scope must include the client ID when requesting an access token. |
| AADB2C90124 | The application insights profile '{0}' does not specify an InstrumentationKey. | An error indicating that the Application Insights technical profile does not specify an instrumentation key. |
| AADB2C90125 | The application insights profile '{0}' has no value for the InstrumentationKey. | An error indicating that the Application Insights technical profile has no value for the InstrumentationKey metadata item. |
| AADB2C90126 | The application insights profile '{0}' does not specify an input claim with a partner claim type of 'eventName'. | An error indicating that the Application Insights technical profile does not specify an input claim with partner type of 'eventName'.. |
| AADB2C90127 | The application insights profile '{0}' does not specify or has an empty DefaultValue for the 'eventName' claim. | An error indicating that the Application Insights technical profile does not specify or has an empty DefaultValue for the 'eventName' claim. |
| AADB2C90128 | The account associated with this grant no longer exists. Please reauthenticate and try again. | An error indicating that the user's object ID from the token was not found in the directory. |
| AADB2C90129 | The provided grant has been revoked. Please reauthenticate and try again. | An error indicating that the user's refresh token has been marked as revoked in the directory. |
| AADB2C90130 | The key container in tenant '{0}' with storageReferenceId '{1}' does not exist. | An error indicating that the requested key container is not available in the tenant. |
| AADB2C90131 | The key container in tenant '{0}' with storageReferenceId '{1}' does not has a key referenced by '{2}'. | An error indicating that the requested key is not available in the key container. |
| AADB2C90132 | The key container in tenant '{0}' with storageReferenceId '{1}' has a key referenced by '{2}'. The key can't be revoked because there is no future key. | An error indicating that the requested key in the key container can't be revoked. Revoking the key would result in no more active key in the key container. Generate first a new key before revoking the old one. |
| AADB2C90133 | The key container in tenant '{0}' with storageReferenceId '{1}' can't be cleaned because there is no active or future key. | An error indicating that the requested key container can't be cleaned because there is no active key available in the key container. Generate a new key before cleaning. |
| AADB2C90134 | The key container in tenant '{0}' with storageReferenceId '{1}' does not has an active key to revoke. | An error indicating that the requested key can't be revoked because that would remove the last active key in the key container. |
| AADB2C90135 | The key container in tenant '{0}' with storageReferenceId '{1}' does not has a future key. | An error indicating that the requested key container does not has future keys. There is no key to activate. Generate a new key in the key container. |
| AADB2C90136 | The request is missing parameters or has the wrong parameters. '{0}' has the value '{1}'. Expected value is '{2}'. | An error indicating that the request has bad parameters. |
| AADB2C90137 | A secure RSA key requires at least {0} bits. | An error indicating that the size for an RSA key generation is too small. |
| AADB2C90138 | A secure OCT key requires at least {0} bits. | An error indicating that the size for an OCT key generation is too small. |
| AADB2C90139 | Can’t read application details. If this application was edited outside of this B2C Admin experience, you will have to delete it and create it again. Read this article (https://go.microsoft.com/fwlink/?linkid=826306) for more details. | An error indicating an attempt was made to create or update an application with an invalid required resource. |
| AADB2C90140 | One of the identifier URIs provided for application '{0}' is not valid URI. | An error indicating an attempt was made to create or update an application with an invalid identifier Uri. |
| AADB2C90141 | One of the identifier URIs {1} provided for application '{0}' is already used. | An error indicating an attempt was made to create or update an application with an identifier Uri already used. |
| AADB2C90142 | Published scopes provided for application '{0}' have duplicate values. | An error indicating an attempt was made to create or update an application with OAuth2Permissions having duplicates |
| AADB2C90143 | The Identifier URIs provided for application '{0}' is not verified '{1}'. | An error indicating an attempt was made to create or update an application with an identifier Uri not verified. |
| AADB2C90144 | The name of the application '{0}' cannot contain more than 90 characters. | An error indicating an attempt was made to create or update an application with a name that was too long. |
| AADB2C90145 | No unverified phone numbers have been found and policy does not allow a user entered number. | An error indicating that unverified phone number is missing on phone factor page and policy does not allow user to enter a phone number. |
| AADB2C90146 | The scope '{0}' provided in request specifies more than one resource for an access token, which is not supported. | An error indicating that the OAuth request scope specifies more than one resource. |
| AADB2C90147 | One of the resource permission provided for application '{0}' already exists. | An error indicating an attempt was made to create a permission whose key already exists. |
| AADB2C90148 | One of the published scopes for application '{0}' have invalid {1}: '{2}'. | An error indicating an attempt was made to create or update an application with invalid OAuth2Permission |
| AADB2C90149 | Script '{0}' failed to load. | An error indicating that a client-side script failed to load. |
| AADB2C90150 | Cross origin request timed out getting the CORS resource '{0}'. | An error indicating that the cross origin request has timed out. |
| AADB2C90151 | User as exceeded the maximum number for retries for multi-factor authentication. | An error indicating that the user has exceeded the maximum number of multi-factor retries. |
| AADB2C90152 | A multi-factor poll request failed to get a response from the service. | An error indicating that a multi-factor poll request failed to get a response from the service. |
| AADB2C90153 | A multi-factor poll request has resulted in an unknown poll response. | An error indicating that a multi-factor poll request has resulted in an uknown response from the service. |
| AADB2C90154 | A multi-factor verification request failed to get a session id from the service. | An error indicating that a multi-factor verification request failed to get a session id from the service. |
| AADB2C90155 | A multi-factor verification request has failed with reason '{0}'. | An error indicating that a multi-factor verification request has failed. |
| AADB2C90156 | A multi-factor validation request has failed with reason '{0}'. | An error indicating that a multi-factor validation request has failed. |
| AADB2C90157 | User as exceeded the maximum number for retries for a self-asserted step. | An error indicating that the user has exceeded the maximum number of self-asserted retries. |
| AADB2C90158 | A self-asserted validation request has failed with reason '{0}'. | An error indicating that a self-asserted validation request has failed. |
| AADB2C90159 | A self-asserted verification request has failed with reason '{0}'. | An error indicating that a self-asserted verification request has failed. |
| AADB2C90160 | A self-asserted send response has resulted in an unknown response from the service. | An error indicating that a self-asserted send response has resulted in an unknown response from the service. |
| AADB2C90161 | A self-asserted send response has failed with reason '{0}'. | An error indicating that a self-asserted send response has failed. |
| AADB2C90162 | The restful claims exchange '{0}' specified in step '{1}' has exceeded the number of allowable retries and has been canceled. | An error indicating that an exception has occurred when making a restful service request. |
| AADB2C90163 | A cryptographic key for 'SamlMessageSigning' has not been specified or the certificate referenced does not exist. | An error indicating that the SamlMessageSigning cryptographic key has not been specified in policy or that the certificate referenced by the key does not exist. |
| AADB2C90164 | The SAML relying party metadata does not specify a key descriptor for encryption. | An error indicating that the relying party metadata does not specify a key descriptor for encryption. |
| AADB2C90165 | The SAML initiating message with id '{0}' cannot be found in state. | An error indicating that the SAML initiating message cannot be found in state. |
| AADB2C90166 | The signature algorithm '{0}' is not supported on the HTTP-Redirect binding. | An error indicating that the specified signature algorithm is not supported on the SAML HTTP-Redirect binding. |
| AADB2C90167 | The signing certificate with subject '{0}' does not contain a private key and cannot be used for signing. | An error indicating that the specified signing certificate does not have a private key and cannot be used for signing. |
| AADB2C90168 | The HTTP-Redirect request does not contain the required parameter '{0}' for a signed request. | An error indicating that the signed HTTP-Redirect request is missing required parameters. |
| AADB2C90169 | The SAML technical profile '{0}' does not specify a metadata item for PartnerEntity. This is required and must contain a URI referencing the SAML metadata or CDATA block containing the SAML metadata. | An error indicating that the specified SAML technical profile does not specify a metadata item for PartnerEntity. This is required and must contain a URI referencing the SAML metadata or CDATA block containing the SAML metadata. |
| AADB2C90170 | The metadata item '{0}' of technical profile '{1}' does not specify a valid boolean. True or False expected. | An error indicating that the specified SAML technical profile metadata does not specify a valid boolean value. True or False is expected. |
| AADB2C90171 | The metadata item '{0}' of technical profile '{1}' is deprecated and has been replaced by '{2}'. | An error indicating that the specified technical profile metadata item has been deprecated. |
| AADB2C90172 | The value specified for the NameID format of '{0}', is not a valid SAML NameID format. | An error indicating that an invalid SAML NameID format value has been specified. |
| AADB2C90173 | The claims endpoint request is missing required parameter: '{0}', please contact your admin. | An error indicating that no extra parameter was found in the token response for getting claims request. |
| AADB2C90174 | Received error response from identity provider server: {0}, please contact your admin. | An error indicating that error response received from identity provider server. |
| AADB2C90175 | The {0} response is missing required parameter: '{1}', please contact your admin. | An error indicating that no extra parameter was found in the token response. |
| AADB2C90176 | The X509Certificate with subject '{0}' does not contain a private key and cannot be used for signing and decryption. | An error indicating that the specified X509Certificate does not contain a private key and cannot be used for signing and decryption. |
| AADB2C90177 | The client initializer encountered network error attempting to load the CORS resource '{0}'. | An error indicating that the CORS resource cannot be loaded due to network error. |
| AADB2C90178 | The signing certificate '{0}' has no private key. | An error indicating that certificate used as signing certifcate does not contain a private key. |
| AADB2C90179 | The presented X509 certificate '{0}' in tenant '{1}' is not a valid X.509 certificate: '{2}' | An error indicating that the presented certificate was invalid. Maybe the certificate was encrypted. The certificate needs to be presented as base64 encoded raw bytes format |
| AADB2C90180 | The presented key '{0}' of type '{1}' already exists. | An error indicating that the presented key already exists. Use overwriteIfExists=true. |
| AADB2C90181 | The metadata item '{0}' of technical profile '{1}' contains invalid URI '{2}'. A comma separated list of URIs is expected. | An error indicating that the specified technical profile metadata item specifies an invalid URI list. |
| AADB2C90182 | The supplied code_verifier does not match associated code_challenge | An error indicating that the supplied code_verifier and code_challenge didnot match. |
| AADB2C90183 | The supplied code_verifier is invalid | An error indicating that the supplied code_verifier is invalid. |
| AADB2C90184 | The supplied code_challenge_method is not supported. Supported values are plain or S256 | An error indicating that the supplied code_challenge_method is not supported. Supported values are plain or S256. |
| AADB2C90185 | The uploaded JSON has an error on line {0} col {1} : {2}. | An error indicating that the uploaded localized resources json is invalid. |
| AADB2C90186 | The input value {0} is null. Please specify a non null value. | An error indicating that a controller input value is null. |
| AADB2C90187 | The uploaded JSON contains invalid characters | An error indicating that the specified technical profile metadata item specifies an invalid URI list. |
| AADB2C90188 | The SAML technical profile '{0}' specifies a PartnerEntity URL of '{1}', but fetching the metadata fails with reason '{2}'. | An error indicating that the metadata specified by the PartnerEntity URL cannot be retrieved. |
| AADB2C90189 | A token request was attempted, but neither the discovery profile metadata nor the technical profile metadata specify a URL to which the request can be made. Please ensure that a token_endpoint is present in either the discovery profile or the technical profile. | An error indicating that niether the discovery profile metadata nor the technical profile metadata specify a token endpoint to which token requests can be made. |
| AADB2C90190 | A user info request returned no claims when claims were expected. | An error indicating that a request to user info returned no claims when claims were expected. |
| AADB2C90191 | The bearer token provided for use in the authorization header is null or empty. | An error indicating the bearer token provided for use in the authorization header is null or empty. |
| AADB2C90192 | Restful profile '{0}' in policy '{1}' in tenant '{2}' specifies the bearer authentication type, but does specify the metadata item '{3}' or it is empty. | An error indicating a restful profile using bearer authentication does not specify the claim to use as the bearer token or the item value is empty. |
| AADB2C90193 | Restful profile '{0}' in policy '{1}' in tenant '{2}' does not have the input claim '{3}' referenced by '{4}'. | An error indicating a restful profile using bearer authentication specify the input claim being referenced as the bearer token. |
| AADB2C90194 | Claim '{0}' specified for the bearer token is not present in the available claims. Available claims '{1}'. | An error indicating that the claim specified for the bearer token is not present in the available claims. |
| AADB2C90195 | Claim '{0}' specified for the bearer token is null or empty. | An error indicating that the claim specified for the bearer token is null or empty. |
| AADB2C90196 | The content definition with id '{0}' specifies a LoadUri of '{1}', but fetching the resource fails with reason '{2}'. | An error indicating that the remote content URL specified in the content definition cannot be fetched for the specified reason. |
| AADB2C90197 | The application cannot have more than {0} reply URLs. | An error indicating that v2 application has more than allowed reply URLs |
| AADB2C90198 | The grant type of the permission grant '{0}' is not supported. | indicating that permission grant type is not supported. |
| AADB2C90199 | Restful Provider {0} policy metadata contains an error related to NamespaceIdentifierPath or NamespaceIdentifierValue: : {1} | An error indicating an error in configured Json Namespace Info for parsing OData. |
| AADB2C90200 | Restful Provider {0} encountered a payload with no value matching NamespaceIdentifierPath :  {1} | An error indicating that no namespace was returned in JSON OData. |
| AADB2C90201 | Restful Provider {0} encountered a payload where NamespaceIdentifierValue of {1} did not match the value configured in policy: {2} | An error indicating that a request to user info returned the wrong JSON OData namespace. |
| AADB2C90202 | Restful Provider {0} encountered a payload where NamespaceIdentifierValue of {1} did not match the value configured in policy: {2} | An error indicating that a JsonPath Configuration did not produce a Claims object. |
| AADB2C90203 | The x-ms-redirectblob header is missing in request headers | An error indicating that the x-ms-redirectblob header is missing in request headers. |
| AADB2C90204 | The provided redirectBlob '{0}' is not a valid 3 segment request blob | An error indicating that the provided redirectBlob is not a valid 3 segment request blob. |
| AADB2C90205 | This application does not have sufficient permissions against this web resource to perform the operation. | An error indicating that the calling application does not have sufficient permissions against the requested resource to issue an access token. |
| AADB2C90206 | A time out has occurred initialization the client. | An error indicating that the client has timed out while initializing. |
| AADB2C90207 | The version '{0}' specified in the JourneyTelemetryVersion is not supported. Currently supported versions: '1.0.0'. | An error indicating that the JourneyTelemetryVersion specified in policy is not a currently supported version. |
| AADB2C90208 | The provided id_token_hint parameter is expired. Please provide another token and try again. | An error indicating that the id_token_hint parameter is expired. |
| AADB2C90209 | The provided id_token_hint parameter does not contain an accepted audience. Valid audience values: '{0}'. Please provide another token and try again. | An error indicating that the id_token_hint parameter does not have a valid audience. |
| AADB2C90210 | The provided id_token_hint parameter could not be validated. Please provide another token and try again. | An error indicating that the id_token_hint parameter could not be validated. |
| AADB2C90211 | The request contained an incomplete state cookie. | An error indicating that an incomplete state cookie has been received. |
| AADB2C90212 | The request contained an invalid state cookie. | An error indicating that an invalid state cookie has been received. |
| AADB2C90213 | The certificate password provided in request is incorrect. | The password for the certificate (pfx file) is wrong. |
| AADB2C90214 | The expiry date for the key container in tenant '{0}' with storageReferenceId '{1}' is in the past. Passed date :'{2}'. | You can't generate expired keys. |
| AADB2C90215 | The uploaded key is badly formatted. Reason: '{0}'. | An error indicating that the uploaded key is of a bad format. |
| AADB2C90216 | The key format parameter '{0}' is not supported. Use jwks, base64Certificate or pfx | The key format parameter is not supported. |
| AADB2C90217 | {0} Validation errors found in upload overrides for {1}. Please ensure that your uploaded resource matches the template: {2} | An error indicating that the uploaded strings have validation errors |
| AADB2C90218 | The application {0} contains field of invalid length | An error indicating an attempt was made to create or update an application with a field of invalid length. |
| AADB2C90219 | Logout responses are not supported by protocol '{0}'. | An error indicating a logout response was recieved for an unsupported protocol. |
| AADB2C90220 | The key container in tenant '{0}' with storage identifier '{1}' exists but does not contain a valid certificate. The certificate might be expired or your certificate might become active in the future (nbf). | An error indicating that the requested key container has no certificate. |
| AADB2C90221 | The language resource you are uploading is not overriding any strings.  Please set your override value to true, or ensure you are including overrides in your file.  For more information see: https://go.microsoft.com/fwlink/?linkid=849075 | indicating that the uploaded localized resource is empty. |
| AADB2C90222 | The language resource exceeds the maximum size allowed.  For more information see: https://go.microsoft.com/fwlink/?linkid=849075 | An error indicating that the uploaded localized resource exeedes the size limit. |
| AADB2C90223 | An error has occurred sanitizing the CORS resource. | An error indicating that the CORS resource was not found at the specified location. |
| AADB2C90224 | Resource owner flow has not been enabled for the application. | An error indicating that the resource owner flow has not been enabled for the application. |
| AADB2C90225 | The username or password provided in the request are invalid. | An error indicating that the username or password provided in the request are invalid. |
| AADB2C90226 | The specified token exchange is only supported over HTTP POST. | An error indicating that the specified token exchange is only supported over HTTP POST. |
| AADB2C90227 | The application '{0}' contains reply urls with fragments. Fragments are not allowed in reply urls. | An error indicating that The application '{0}' contains reply urls with fragments, fragments are not allowed in reply urls. |
| AADB2C90228 | The RelyingParty section of TrustFramework Policy does not have required TechnicalProfiles. | An error indicating that the request client id is not registered in the specified tenant. |
| AADB2C90229 | Your request is throttled temporarily. Please retry after the time specified in the additional information of the error message. | An error indicating that the MSODS Graph API has throttled the requests. |
| AADB2C90230 | The uploaded localized resource contains a duplicated key, please ensure that the localized string with ElementType: {0}, ElementId: {1} and StringId: {2} appears only once. | An error indicating that the MSODS Graph API has throttled the requests. |
| AADB2C90231 | The uploaded localized resource contains a duplicated key, please ensure that the localized string with ElementType: {0} and StringId: {1} appears only once. | An error indicating that there is a duplicate localized string. |
| AADB2C90232 | The provided id_token_hint parameter does not contain an accepted issuer. Valid issuers: '{0}'. Please provide another token and try again. | An error indicating that the id_token_hint parameter does not have a valid issuer. |
| AADB2C90233 | The provided id_token_hint parameter failed signature validation. Please provide another token and try again. | An error indicating that the id_token_hint parameter failed signature validation. |
| AADB2C90234 | The provided id_token_hint parameter has an 'nbf' value that is in the future. Please provide another token and try again. | An error indicating that the id_token_hint parameter has an 'nbf' value that is in the future. |
| AADB2C90235 | The provided id_token is expired. Please provide another token and try again. | An error indicating that the id_token is expired. |
| AADB2C90236 | The provided id_token has an 'nbf' value that is in the future. Please provide another token and try again. | An error indicating that the id_token has an 'nbf' value that is in the future. |
| AADB2C90237 | The provided id_token does not contain a valid audience. Valid audience values: '{0}'. Please provide another token and try again. | An error indicating that the id_token does not contain a valid audience. |
| AADB2C90238 | The provided id_token does not contain a valid issuer. Valid issuer values: '{0}'. Please provide another token and try again. | An error indicating that the id_token does not contain a valid issuer. |
| AADB2C90239 | The provided id_token failed signature validation. Please provide another token and try again. | An error indicating that the id_token failed signature validation. |
| AADB2C90240 | The provided id_token is malformed and could not be parsed. Please provide another token and try again. | An error indicating that the id_token is malformed and could not be parsed. |
| AADB2C90241 | Logout requests are not supported for protocol '{0}'. | An error indicating a logout reqeust for the specified protocol is unsupported. |
| AADB2C90242 | The SAML technical profile '{0}' specifies PartnerEntity CDATA which cannot be loaded for reason '{1}'. | An error indicating that the metadata specified by the PartnerEntity URL cannot be retrieved. |
| AADB2C90243 | The IDP's client key/secret is not properly configured. | An error indicating that the IDP's client key/secret is not properly configured. |
| AADB2C90244 | There are too many requests at this moment. Please wait for some time and try again. | An error indicating that the Ests API has throttled the requests. |
| AADB2C90245 | Access to the tenant: '{0}' is disabled. Please contact support. | Indicating that the tenant has lost access. |
| AADB2C90246 | The uploaded JSON has {0} error(s) : {1} | An error indicating that the uploaded localized resources json is invalid. |
| AADB2C90247 | Resource owner flow is only available on custom domains. | An error indicating that the resource owner flow is only available on custom domains. |
| AADB2C90248 | Resource owner flow can only be used by applications created through the B2C admin portal. | An error indicating that the resource owner flow is only available to applications created through the B2C admin portal. |
| AADB2C90249 | Resource owner flow has not been enabled for the tenant. | An error indicating that the resource owner flow has not been enabled for the tenant. |
| AADB2C90250 | The generic login endpoint is not supported. | An error indicating that the generic login endpoint is only supported for Saml2. |
| AADB2C90255 | The claims exchange specified in technical profile '{0}' did not complete as expected. You might want to try starting your session over from the beginning. | An error indicating that a claims exchange did not complete as expected. |
| AADB2C90256 | Profile '{0}', production mode policies must use https '{1}' the provided value was '{2}'. | An error indicating that a claims exchange did not complete as expected. |
| AADB2C90257 | Profile '{0}' uses http service url that is only allowed in development mode policies with metadata key: {1} set to true. | An error indicating that a claims exchange did not complete as expected. |
| AADB2C90258 | Profile '{0}' uses an insecure authentication mode that is only allowed in production mode policies with metadata key '{1}' set to true. | An error indicating that a claims exchange did not complete as expected. |
| AADB2C90259 | Profile '{0}' uses '{1}' metadata that is only allowed in development mode policies. | An error indicating that a claims exchange did not complete as expected. |
| AADB2C90260 | The SSL provisioning service is currently not available. Please try later. | The SSL provisioning service is currently not available. Please try later. |
| AADB2C90261 | The claims exchange '{0}' specified in step '{1}' returned HTTP error response that could not be parsed. | An error indicating that an exception has occurred when making a restful service request. |
| AADB2C95000 | The application has at least one invalid property. | an error indicating that the application validation failed |
| AADB2C95001 | Expected property '{0}' is missing. | An error indicating that the expected property is missing |
| AADB2C95002 | The application name should not have more that '{0}' characters. | An error indicating that the app name has too many characters |
| AADB2C95003 | The application name should not contain characters from '{0}'. | An error indicating that the app name contains invalid characters |
| AADB2C95004 | Only V2 apps are allowed. | An error indicating that only v2 apps are allowed |
| AADB2C95005 | Application should either be a web app or a native app. | An error indicating that the app should either be a web or native app |
| AADB2C95006 | Application can not have more than '{0}' urls. | An error indicating that thge app has too many urls |
| AADB2C95007 | The reply url '{0}' is not correctly formatted. | An error indicating that the reply url is not correctly formatted |
| AADB2C95008 | There may not be any duplicate reply urls. | An error indicating that there are duplicate reply urls |
| AADB2C95009 | The following url value: '{0}' is not allowed. | An error indicating that the rul value is not allowed |
| AADB2C95010 | Non localhost urls must use be secure (https). | An error indicating that the url should be secure |
| AADB2C95011 | Reply url '{0}' may not contain a query string. | An error indicating that the url should not have a query string |
| AADB2C95012 | Reply url '{0}' must not contain a fragment. | An error indicating that the url should not contain a fragment |
| AADB2C95013 | Reply url '{0}' should not contain characters from '{1}'. | An error indicating that the url should not contain invalid characters |
| AADB2C95014 | Application may not have more than '{0}' external domains. | An error indicating that the app has too many external domains |
| AADB2C95015 | The uri '{0}' must not have more that '{1}' characters. | An error indicating that the url has too many characters |
| AADB2C95016 | The native uri '{0}' should not contain characters from '{1}'. | An error indicating that the native uri has invalid characters |
| AADB2C95017 | The application id uri '{0}' is incorrectly formatted. | An error indicating that the app id uri is not correctly formatted |
| AADB2C95018 | The application id uri '{0}' may not have more than '{1}' characters. | An error indicating that the app id uri has too many characters |
| AADB2C95019 | The application id uri '{0}' may not contain characters from the character set '{1}'. | An error indicating that the app id uri has invalid characters |
| AADB2C95020 | The application id uri '{0}' is already used. | An error indicating that the appid uri is already used |
| AADB2C95021 | There are no defaults for this language. | An error indicating that no default resources were found |
| AADB2C95022 | There are no overrides for this language. | An error indicating that no override resources were found |
| AADB2C95023 | The claim '{0}' in technical profile '{1}' in policy '{2}' of tenant '{3}' has invalid Id for extension property. Please ensure the claim Id matches the regex '{4}'. | An error indicating that the extension property name in the policy is invalid |
| AADB2C95024 | The uploaded resources file is larger than the limit of {0} KB. | An error indicating that the uploaded file is larger than the maximum supported size. |
| AADB2C95025 | The presented password for the uploaded certificate is wrong. | An error indicating that the presented password is false. |
| AADB2C95026 | The uploaded JSON Web Key for tenant '{0}' is not in the correct JSON format. | An error indicating that the uploaded key container has an invalid payload. |
| AADB2C95027 | The trustframework backup key set Id '{0}' must end with .bak. | The trustframework backup key set Id must end with .bak. |
| AADB2C95028 | Can't create trustframework key set with name '{0}' because it already exists. | Can't create trustframework key set with id '{0}' because it already exists. |
| AADB2C95029 | The trustframework keyset parameter K is not base64 URL encoded. | An error indicating that the trust framework key set K parameter is not base64 URL encoded. |
| AADB2C95030 | Missing kty parameter for the trustframework key. | Specify the kty parameter for the trustframework key. |
| AADB2C95031 | Bad kty parameter '{0}' for the trustframework key. Must be RSA or oct. | Specify the kty parameter for the trustframework key. |
| AADB2C95032 | One can't mix RSA and Oct types in one key set. | Do not mix RSA and Oct keys in one key set. |
| AADB2C95033 | Bad use parameter '{0}' for the trustframework key. | Specify the use parameter for the trustframework key. |
| AADB2C95034 | The presented TrustFrameworkKey entity is of the wrong format | Check the format of the presented trustframework key. |
| AADB2C95035 | The trustframework key can't be serialized. Reason: '{0}'. | Check the reason why the presented trustframework key could not be serialized. |
| AADB2C95036 | The presented TrustFrameworkKey entity cannot be loaded for serialization. | Check the reason why the presented trustframework key could not be serialized. |
| AADB2C95037 | The presented TrustFrameworkKey entity is missing kty. | The kty parameter is missing in the trust framework key. |
| AADB2C95038 | Can't create trustframework key set with name '{0}' because it already exists. | Check the X.509 certificate in the presented trust framework key. |
| AADB2C95039 | The presented TrustFrameworkKey RSA entity is missing or the modulus or exponent. | Check the RSA trust framework key. |
| AADB2C95040 | The trustframework key can't be deserialized. Reason: '{0}'. | Check the reason why the presented trustframework key could not be deserialized. |
| AADB2C95041 | The trust framework key K parameter is wrongly encoded. Should be base64 URL encoded. |  the trust framework key K parameter is wrongly encoded. Should be base64 URL encoded. |
| AADB2C95042 | One can't mix signature and encryption usage in one key set. | Do not mix RSA and Oct keys in one key set. |
| AADB2C95043 | There are too many requests at this moment. Please wait for some time and try again. | An error indicating that the admin api has throttled the request. |
| AADB2C95044 | TenantId passed as part of object is different from login tenant. | TenantId passed as part of object is different from login tenant. |
| AADB2C95045 | The SSL certificate '{0}' to activate is not in status uploaded '{1}'. | An error indicating that the certificate to activate is not in status uploaded. |
| AADB2C95046 | The SSL certificate '{0}' to activate is not found. | An error indicating that the certificate to activate is not found. |
| AADB2C95047 | SSL certificate can't be decoded. Possibly wrong password. | An error indicating that the certificate password is wrong. |
| AADB2C95048 | SSL certificate is not pfx encoded. | An error indicating that the certificate is badly formatted. |
| AADB2C95049 | SSL certificate upload failed. Can't upload the active certificate {0}. | An error indicating that the active certificate is uploaded. |
| AADB2C95050 | Custom domain binding limit reached. | An error indicating that the custom domain binding limit is reached. |
| AADB2C95051 | The custom domain service is currently not available. Please try again later. | An error indicating that the custom domain is not available. |
| AADB2C95052 | The trustframework key set with id '{0}' in tenant '{1}' is not created. Please use 'Create api' to create the key set first. | An error indicating that the key set was not created. |
| AADB2C95053 | Multiple concurrent writes to the same object detected. Please perform update operations on the same object sequentially. | An error indicating that the admin api has rejected parallel edits to the same object. |
| AADB2C95054 | The tenant with name '{0}' already exists. | An error indicating the tenant with the provided name already exists. |
| AADB2C95055 | The tenant domain name prefix '{0}' is invalid. | An error indicating the tenant domain prefix is invalid. |
| AADB2C95056 | The tenant domain name suffix '{0}' is invalid. | An error indicating the tenant domain suffix is invalid. |
| AADB2C95057 | The tenant provisioning service not available. | An error indicating the tenant with the provided name already exists. |
| AADB2C95058 | An internal error occurred in tenant provisioning service. | An internal error occured in tenant provisioning service. |
| AADB2C95059 | One of the keys in the payload has 'kid' which is not empty. | One of the keys in the payload has 'kid' which is not empty. |
| AADB2C95060 | The tenant can not be deleted. Reason = '{0}'. | An error indicating that the prereq for the delete tenant failed. |
| AADB2C95061 | The given tenant has subscription in it, it can not be deleted. | An error indicating that the tenant with subscriptions cannot be deleted. |
| AADB2C90251 | Resource owner requests using v1 applications require the resource parameter to be specified. | An error indicating that resource owner requests using application v1 require the resource parameter. |
| AADB2C90252 | Technical profile '{0}' does not contain valid CDATA wrapped XML for metadata item '{1}'. | An error indicating that a technical profile metadata item specifies invalid XML. |
| AADB2C90253 | The trustframework keyset parameter '{0}' is missing | An error indicating that a trust framework key set parameter is missing. |
| AADB2C90272 | The id_token_hint parameter has not been specified in the request. Please provide token and try again. | An error indicating that the id_token_hint parameter was not specified. |
| AADB2C90273 | An invalid response was received : '{0}' | An error indicating an invalid response from an external OAuth1 or OAuth2 provider |
| AADB2C90274 | The provider metadata does not specify a single logout service or the endpoint binding is not one of 'urn:oasis:names:tc:SAML:2.0:bindings:HTTP-Redirect' or 'urn:oasis:names:tc:SAML:2.0:bindings:HTTP-POST'. | An error indicating indicating that the SAML Metadata for the provider does not specify a valid single logout endpoint. |
| AADB2C90275 | The URL '{0}' specified for endpoint '{1}' cannot be reached. Please ensure that endpoint is publicly addressable and returns valid content. | An error indicating indicating that the OAuth endpoint cannot be reached. |
| AADB2C90276 | The request is not consistent with the control setting '{0}': '{1}' in technicalProfile '{2}' for policy '{3}' tenant '{4}'. | An error indicating that a request is illegal according to the setting of control. |
| AADB2C90277 | The orchestration step '{0}' of user journey '{1}' of policy '{2}' does not contain a content definition reference. | An error indicating that a content definition reference does not exist for an orchestration step that requires a content definition reference |
| AADB2C90278 | Unable to validate the information provided. | An error indicating that an unspecified validation exception has occurred. |
| AADB2C90279 | The provided client id '{0}' does not match the client id that issued the grant. | An error indicating that the specified client id does not match the client id that issued the provided grant |
| AADB2C90280 | The x-ms-redirectblob header is not expected in request headers. | An error indicating that the x-ms-redirectblob header is not expected in request headers. |
| AADB2C90281 | The 'ExternalRefreshToken' claim is missing in the input token. | An error indicating that the ExternalRefreshToken is missing in the InputToken. |
| AADB2C90282 | The 'ExternalRefreshToken' claim is having incorrect domain. | An error indicating that the 'ExternalRefreshToken' claim is having incorrect domain. |
| AADB2C90283 | The 'ExternalRefreshToken' claim value is incorrect. | An error indicating that the 'ExternalRefreshToken' claim value is incorrect. |
| AADB2C90284 | The application with identifier '{0}' has not been granted consent and is unable to be used for local accounts. | An error indicating that the application for non-interactive login has not been configured correctly as it has not been granted consent |
| AADB2C90285 | The application with identifier '{0}' was not found. | An error indicating that the application for non-interactive login does not exist in the directory of the tenant |
| AADB2C90286 | The request is missing the following required parameter: '{0}'. | An error indicating that the non-interactive login request was missing a required parameter |
| AADB2C90287 | The request contains invalid redirect URI '{0}' | An error indicating that the request contains invalid redirect_uri |
| AADB2C90288 | UserJourney with id '{0}' referenced in TechnicalProfile '{1}' for refresh token redemption for tenant '{2}' does not exist in policy '{3}' or any of its base policies. | An error indicating that the referenced UserJourney for refresh token redemption does not exist. |
| AADB2C90289 | We encountered an error connecting to the identity provider. Please try again later. | We are sorry, we encountered and connecting to the identity provider. Please try again later. |
| AADB2C99003 | One of the properties provided for the application '{0}' has invalid value. | An generic error representing the invalid property name and error. |
| AADB2C99004 | One of the properties provided for the application '{0}' has invalid value. Property: '{1}', Error: '{2}'. | An generic error representing the invalid application modification request. |
| AADB2C99005 | The request contains an invalid scope parameter which includes an illegal character '{0}'. | An error indicating that the OAuth request include an invalid scope. |
| AADB2C99006 | Azure AD B2C cannot find the extensions app with app id '{0}'. Please visit http://go.microsoft.com/fwlink/?linkid=851224 for more information. | An error indicating that extensions app is missing. |
| AADB2C99007 | This request is not listed in the allow or block list from authorization : {0}. | An error indicating that request does not have authz specified. |
| AADB2C99008 | The format of the URI '{0}' is invalid. | An error indicating that the format of the URI provided is invalid. |
| AADB2C99009 | Put operation not supported for this entity on this uri. Please append '$value' to the request uri and send the request again. | An error indicating that the format of the URI provided is invalid. |
| AADB2C99010 | This tenant has not yet been configured for age gating. | An error indicating that the tenant is not configured for age gating. |
| AADB2C99011 | The metadata value '{0}' has not been specified in TechnicalProfile '{1}' in policy '{2}'. | An error indicating that a specified metadata for tenant is not configured. |
| AADB2C99012 | Cannot create User Attribute as Tenant {0} have reached its max limit {1} for User Attributes. | An error indicating that a User AttributeLimit has reached for the tenant. |
| AADB2C99013 | The supplied grant_type [{0}] and token_type [{1}] combination is not supported. | An error indicating that the OAuth2 token exchange request includes an invalid combination of grant type and token type. |
| AADB2C99014 | The property '{0}' can not be modified. It's a read only property.  | An error indicating that a request has come to modify a read only property. |
| AADB2C99015 | Profile '{0}' in policy '{1}' in tenant '{2}' is missing all InputClaims required for resource owner password credential flow. | An error indicating that the executing technical profile for a resource owner flow request is missing all required input claims. |
| AADB2C99016 | Profile '{0}' in policy '{1}' in tenant '{2}' is missing the '{3}' InputClaim required for resource owner password credential flow. | An  error indicating that the executing technical profile for a resource owner flow request is missing a required input claim. |
| AADB2C99017 | Profile '{0}' in policy '{1}' in tenant '{2}' has a 'grant_type' InputClaim with a DefaultValue of '{3}' instead of the required 'password' for resource owner password credential flow. | An  error indicating that the executing technical profile for a resource owner flow request is missing a required input claim. |
| AADB2C99018 | Restful provider must not have specified Id | An error indicating that a RESTful provider must not have specified Id |
| AADB2C99019 | Restful provider can not have authentication scheme '{0}'. Authentication scheme must be set to one of the following: {1} | An error indicating that a RESTful provider has invalid authentication scheme |
| AADB2C99020 | The {0} input claims selected for the restful provider are not valid. Please check that the claims are selected in the user flow. | An error indicating that input claims from restfuOptions do not exist in output claims from self asserted technical profile |
| AADB2C99021 | Please add at least one user attribute in order to enable restful provider in your user flow | An error indicating that self-asserted technical profile does not exist |
| AADB2C99022 | Please remove duplicated claim '{0}' from restful options. | An error indicating that self-asserted technical profile does not exist |
