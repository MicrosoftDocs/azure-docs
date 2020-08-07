---
title: Error code reference
titleSuffix: Azure AD B2C
description: A list of the error codes that can returned by the Azure Active Directory B2C service.
services: B2C
author: msmimart
manager: celestedg

ms.service: active-directory
ms.workload: identity
ms.topic: reference
ms.date: 01/10/2020
ms.author: mimart
ms.subservice: B2C
---

# Error codes: Azure Active Directory B2C

The following errors can be returned by the Azure Active Directory B2C service.

| Error code | Message |
| ---------- | ------- |
| `AADB2C90002` | The CORS resource '{0}' returned a 404 not found. |
| `AADB2C90006` | The redirect URI '{0}' provided in the request is not registered for the client id '{1}'. |
| `AADB2C90007` | The application associated with client id '{0}' has no registered redirect URIs. |
| `AADB2C90008` | The request does not contain a client id parameter. |
| `AADB2C90010` | The request does not contain a scope parameter. |
| `AADB2C90011` | The client id '{0}' provided in the request does not match client id '{1}' registered in policy. |
| `AADB2C90012` | The scope '{0}' provided in request is not supported. |
| `AADB2C90013` | The requested response type '{0}' provided in the request is not supported. |
| `AADB2C90014` | The requested response mode '{0}' provided in the request is not supported. |
| `AADB2C90016` | The requested client assertion type '{0}' does not match the expected type '{1}'. |
| `AADB2C90017` | The client assertion provided in the request is invalid: {0} |
| `AADB2C90018` | The client id '{0}' specified in the request is not registered in tenant '{1}'. |
| `AADB2C90019` | The key container with id '{0}' in tenant '{1}' does not has a valid key. Reason: {2}. |
| `AADB2C90021` | The technical profile '{0}' does not exist in the policy '{1}' of tenant '{2}'. |
| `AADB2C90022` | Unable to return metadata for the policy '{0}' in tenant '{1}'. |
| `AADB2C90023` | Profile '{0}' does not contain the required metadata key '{1}'. |
| `AADB2C90025` | Profile '{0}' in policy '{1}' in tenant '{2}' does not contain the required cryptographic key '{3}'. |
| `AADB2C90027` | Basic credentials specified for '{0}' are invalid. Check that the credentials are correct and that access has been granted by the resource. |
| `AADB2C90028` | Client certificate specified for '{0}' is invalid. Check that the certificate is correct, contains a private key and that access has been granted by the resource. |
| `AADB2C90031` | Policy '{0}' does not specify a default user journey. Ensure that the policy or it's parents specify a default user journey as part of a relying party section. |
| `AADB2C90035` | The service is temporarily unavailable. Please retry after a few minutes. |
| `AADB2C90036` | The request does not contain a URI to redirect the user to post logout. Specify a URI in the post_logout_redirect_uri parameter field. |
| `AADB2C90037` | An error occurred while processing the request. Please contact administrator of the site you are trying to access. |
| `AADB2C90039` | The request contains a client assertion, but the provided policy '{0}' in tenant '{1}' is missing a client_secret in RelyingPartyPolicy. |
| `AADB2C90040` | User journey '{0}' does not contain a send claims step. |
| `AADB2C90043` | The prompt included in the request contains invalid values. Expected 'none', 'login', 'consent' or 'select_account'. |
| `AADB2C90044` | The claim '{0}' is not supported by the claim resolver '{1}'. |
| `AADB2C90046` | We are having trouble loading your current state. You might want to try starting your session over from the beginning. |
| `AADB2C90047` | The resource '{0}' contains script errors preventing it from being loaded. |
| `AADB2C90048` | An unhandled exception has occurred on the server. |
| `AADB2C90051` | No suitable claims providers were found. |
| `AADB2C90052` | Invalid username or password. |
| `AADB2C90053` | A user with the specified credential could not be found. |
| `AADB2C90054` | Invalid username or password. |
| `AADB2C90055` | The scope '{0}' provided in request must specify a resource, such as 'https://example.com/calendar.read'. |
| `AADB2C90057` | The provided application is not configured to allow the OAuth Implicit flow. |
| `AADB2C90058` | The provided application is not configured to allow public clients. |
| `AADB2C90067` | The post logout redirect URI '{0}' has an invalid format. Specify an https based URL such as 'https://example.com/return' or for native clients use the IETF native client URI 'urn:ietf:wg:oauth:2.0:oob'. |
| `AADB2C90068` | The provided application with ID '{0}' is not valid against this service. Please use an application created via the B2C portal and try again. |
| `AADB2C90075` | The claims exchange '{0}' specified in step '{1}' returned HTTP error response with Code '{2}' and Reason '{3}'. |
| `AADB2C90077` | User does not have an existing session and request prompt parameter has a value of '{0}'. |
| `AADB2C90079` | Clients must send a client_secret when redeeming a confidential grant. |
| `AADB2C90080` | The provided grant has expired. Please re-authenticate and try again. Current time: {0}, Grant issued time: {1}, Grant sliding window expiration time: {2}. |
| `AADB2C90081` | The specified client_secret does not match the expected value for this client. Please correct the client_secret and try again. |
| `AADB2C90083` | The request is missing required parameter: {0}. |
| `AADB2C90084` | Public clients should not send a client_secret when redeeming a publicly acquired grant. |
| `AADB2C90085` | The service has encountered an internal error. Please reauthenticate and try again. |
| `AADB2C90086` | The supplied grant_type [{0}] is not supported. |
| `AADB2C90087` | The provided grant has not been issued for this version of the protocol endpoint. |
| `AADB2C90088` | The provided grant has not been issued for this endpoint. Actual Value : {0} and Expected Value : {1} |
| `AADB2C90092` | The provided application with ID '{0}' is disabled for the tenant '{1}'. Please enable the application and try again. |
| `AADB2C90107` | The application with ID '{0}' cannot get an ID token either because the openid scope was not provided in the request or the application is not authorized for it. |
| `AADB2C90108` | The orchestration step '{0}' does not specify a CpimIssuerTechnicalProfileReferenceId when one was expected. |
| `AADB2C90110` | The scope parameter must include 'openid' when requesting a response_type that includes 'id_token'. |
| `AADB2C90111` | Your account has been locked. Contact your support person to unlock it, then try again. |
| `AADB2C90114` | Your account is temporarily locked to prevent unauthorized use. Try again later. |
| `AADB2C90115` | When requesting the 'code' response_type, the scope parameter must include a resource or client ID for access tokens, and 'openid' for ID tokens. Additionally include 'offline_access' for refresh tokens. |
| `AADB2C90117` | The scope '{0}' provided in the request is not supported. |
| `AADB2C90118` | The user has forgotten their password. |
| `AADB2C90120` | The max age parameter '{0}' specified in the request is invalid. Max age must be an integer between '{1}' and '{2}' inclusive. |
| `AADB2C90122` | Input for '{0}' received in the request has failed HTTP request validation. Ensure that the input does not contain characters such as < or &. |
| `AADB2C90128` | The account associated with this grant no longer exists. Please reauthenticate and try again. |
| `AADB2C90129` | The provided grant has been revoked. Please reauthenticate and try again. |
| `AADB2C90145` | No unverified phone numbers have been found and policy does not allow a user entered number. |
| `AADB2C90146` | The scope '{0}' provided in request specifies more than one resource for an access token, which is not supported. |
| `AADB2C90149` | Script '{0}' failed to load. |
| `AADB2C90151` | User has exceeded the maximum number for retries for multi-factor authentication. |
| `AADB2C90152` | A multi-factor poll request failed to get a response from the service. |
| `AADB2C90154` | A multi-factor verification request failed to get a session id from the service. |
| `AADB2C90155` | A multi-factor verification request has failed with reason '{0}'. |
| `AADB2C90156` | A multi-factor validation request has failed with reason '{0}'. |
| `AADB2C90157` | User has exceeded the maximum number for retries for a self-asserted step. |
| `AADB2C90158` | A self-asserted validation request has failed with reason '{0}'. |
| `AADB2C90159` | A self-asserted verification request has failed with reason '{0}'. |
| `AADB2C90161` | A self-asserted send response has failed with reason '{0}'. |
| `AADB2C90165` | The SAML initiating message with id '{0}' cannot be found in state. |
| `AADB2C90168` | The HTTP-Redirect request does not contain the required parameter '{0}' for a signed request. |
| `AADB2C90178` | The signing certificate '{0}' has no private key. |
| `AADB2C90182` | The supplied code_verifier does not match associated code_challenge |
| `AADB2C90183` | The supplied code_verifier is invalid |
| `AADB2C90184` | The supplied code_challenge_method is not supported. Supported values are plain or S256 |
| `AADB2C90188` | The SAML technical profile '{0}' specifies a PartnerEntity URL of '{1}', but fetching the metadata fails with reason '{2}'. |
| `AADB2C90194` | Claim '{0}' specified for the bearer token is not present in the available claims. Available claims '{1}'. |
| `AADB2C90205` | This application does not have sufficient permissions against this web resource to perform the operation. |
| `AADB2C90206` | A time out has occurred initialization the client. |
| `AADB2C90208` | The provided id_token_hint parameter is expired. Please provide another token and try again. |
| `AADB2C90209` | The provided id_token_hint parameter does not contain an accepted audience. Valid audience values: '{0}'. Please provide another token and try again. |
| `AADB2C90210` | The provided id_token_hint parameter could not be validated. Please provide another token and try again. |
| `AADB2C90211` | The request contained an incomplete state cookie. |
| `AADB2C90212` | The request contained an invalid state cookie. |
| `AADB2C90220` | The key container in tenant '{0}' with storage identifier '{1}' exists but does not contain a valid certificate. The certificate might be expired or your certificate might become active in the future (nbf). |
| `AADB2C90223` | An error has occurred sanitizing the CORS resource. |
| `AADB2C90224` | Resource owner flow has not been enabled for the application. |
| `AADB2C90225` | The username or password provided in the request are invalid. |
| `AADB2C90226` | The specified token exchange is only supported over HTTP POST. |
| `AADB2C90232` | The provided id_token_hint parameter does not contain an accepted issuer. Valid issuers: '{0}'. Please provide another token and try again. |
| `AADB2C90233` | The provided id_token_hint parameter failed signature validation. Please provide another token and try again. |
| `AADB2C90235` | The provided id_token is expired. Please provide another token and try again. |
| `AADB2C90237` | The provided id_token does not contain a valid audience. Valid audience values: '{0}'. Please provide another token and try again. |
| `AADB2C90238` | The provided id_token does not contain a valid issuer. Valid issuer values: '{0}'. Please provide another token and try again. |
| `AADB2C90239` | The provided id_token failed signature validation. Please provide another token and try again. |
| `AADB2C90240` | The provided id_token is malformed and could not be parsed. Please provide another token and try again. |
| `AADB2C90242` | The SAML technical profile '{0}' specifies PartnerEntity CDATA which cannot be loaded for reason '{1}'. |
| `AADB2C90243` | The IDP's client key/secret is not properly configured. |
| `AADB2C90244` | There are too many requests at this moment. Please wait for some time and try again. |
| `AADB2C90248` | Resource owner flow can only be used by applications created through the B2C admin portal. |
| `AADB2C90250` | The generic login endpoint is not supported. |
| `AADB2C90255` | The claims exchange specified in technical profile '{0}' did not complete as expected. You might want to try starting your session over from the beginning. |
| `AADB2C90261` | The claims exchange '{0}' specified in step '{1}' returned HTTP error response that could not be parsed. |
| `AADB2C90272` | The id_token_hint parameter has not been specified in the request. Please provide token and try again. |
| `AADB2C90273` | An invalid response was received : '{0}' |
| `AADB2C90274` | The provider metadata does not specify a single logout service or the endpoint binding is not one of 'urn:oasis:names:tc:SAML:2.0:bindings:HTTP-Redirect' or 'urn:oasis:names:tc:SAML:2.0:bindings:HTTP-POST'. |
| `AADB2C90276` | The request is not consistent with the control setting '{0}': '{1}' in technicalProfile '{2}' for policy '{3}' tenant '{4}'. |
| `AADB2C90277` | The orchestration step '{0}' of user journey '{1}' of policy '{2}' does not contain a content definition reference. |
| `AADB2C90279` | The provided client id '{0}' does not match the client id that issued the grant. |
| `AADB2C90284` | The application with identifier '{0}' has not been granted consent and is unable to be used for local accounts. |
| `AADB2C90285` | The application with identifier '{0}' was not found. |
| `AADB2C90288` | UserJourney with id '{0}' referenced in TechnicalProfile '{1}' for refresh token redemption for tenant '{2}' does not exist in policy '{3}' or any of its base policies. |
| `AADB2C90289` | We encountered an error connecting to the identity provider. Please try again later. |
| `AADB2C90296` | Application has not been configured correctly. Please contact administrator of the site you are trying to access. |
| `AADB2C99005` | The request contains an invalid scope parameter which includes an illegal character '{0}'. |
| `AADB2C99006` | Azure AD B2C cannot find the extensions app with app id '{0}'. Please visit https://go.microsoft.com/fwlink/?linkid=851224 for more information. |
| `AADB2C99011` | The metadata value '{0}' has not been specified in TechnicalProfile '{1}' in policy '{2}'. |
| `AADB2C99013` | The supplied grant_type [{0}] and token_type [{1}] combination is not supported. |
| `AADB2C99015` | Profile '{0}' in policy '{1}' in tenant '{2}' is missing all InputClaims required for resource owner password credential flow. |
