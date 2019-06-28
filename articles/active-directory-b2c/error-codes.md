---
title: Error codes in Azure Active Directory B2C
description: A list of the error codes returned by the Azure Active Directory B2C service.
services: B2C
author: mmacy
manager: celestedg

ms.service: active-directory
ms.workload: identity
ms.topic: conceptual
ms.date: 07/03/2019
ms.author: marsma
ms.subservice: B2C
---

# Azure Active Directory B2C error codes

The following errors can be returned by the Azure Active Directory B2C service.
___

| Code | Message |
| ---- | ------- |
| `AADB2C90001` | The server hosting resource '{0}' is not enabled for CORS requests. Ensure that the 'Access-Control-Allow-Origin' header has been configured. |
| [AADB2C90002](error-handling.md#aadb2c90002) | The CORS resource '{0}' returned a 404 not found. |
| `AADB2C90003` | An unknown exception has occurred while requesting a CORS resource. |
| `AADB2C90004` | The request does not contain a redirect URI. |
| `AADB2C90005` | The redirect URI '{0}' has an invalid format. Specify an absolute URI such as 'https://example.com/return'. |
| [AADB2C90006](error-handling.md#aadb2c90006) | The redirect URI '{0}' provided in the request is not registered for the client id '{1}'. |
| `AADB2C90007` | The application associated with client id '{0}' has no registered redirect URIs. |
| `AADB2C90008` | The request does not contain a client id parameter. |
| `AADB2C90009` | The request does not contain a nonce. A nonce is required when using the '{0}' algorithm. |
| `AADB2C90010` | The request does not contain a scope parameter. |
| `AADB2C90011` | The client id '{0}' provided in the request does not match client id '{1}' registered in policy. |
| `AADB2C90012` | The scope '{0}' provided in request is not supported. |
| [AADB2C90013](error-handling.md#aadb2c90013) | The requested response type '{0}' provided in the request is not supported. |
| `AADB2C90014` | The requested response mode '{0}' provided in the request is not supported. |
| `AADB2C90015` | The HTTP method '{0}' provided in the request is not supported. |
| `AADB2C90016` | The requested client assertion type '{0}' does not match the expected type '{1}'. |
| `AADB2C90017` | The client assertion provided in the request is invalid: {0} |
| [AADB2C90018](error-handling.md#aadb2c90018) | The client id '{0}' specified in the request is not registered in tenant '{1}'. |
| `AADB2C90019` | The key container with id '{0}' in tenant '{1}' does not has a valid key. Reason: {2}. |
| `AADB2C90020` | The specified signature algorithm '{0}' is not supported. Expected one of 'sha1RSA' or 'sha256RSA'. |
| `AADB2C90021` | The technical profile '{0}' does not exist in the policy '{1}' of tenant '{2}'. |
| `AADB2C90022` | Unable to return metadata for the policy '{0}' in tenant '{1}'. |
| `AADB2C90023` | Profile '{0}' does not contain the required metadata key '{1}'. |
| `AADB2C90024` | Profile '{0}' contains the unsupported authentication type '{1}'. Expected one of '{2}', '{3}' or '{4}'. |
| `AADB2C90025` | Profile '{0}' in policy '{1}' in tenant '{2}' does not contain the required cryptographic key '{3}'. |
| `AADB2C90026` | Profile '{0}' metadata contains the key '{1}' which has the empty or invalid URL format of '{2}'. |
| `AADB2C90027` | Basic credentials specified for '{0}' are invalid. Check that the credentials are correct and that access has been granted by the resource. |
| `AADB2C90028` | Client certificate specified for '{0}' is invalid. Check that the certificate is correct, contains a private key and that access has been granted by the resource. |
| `AADB2C90029` | Profile '{0}' contains the unsupported SendClaimsIn type '{1}'. Expected one of '{2}', '{3}' or '{4}'. |
| `AADB2C90030` | Profile '{0}' contains an invalid boolean for {1}. Expected either 'true' or 'false'. |
| `AADB2C90031` | Policy '{0}' does not specify a default user journey. Ensure that the policy or it's parents specify a default user journey as part of a relying party section. |
| `AADB2C90032` | Profile '{0}' contains the unsupported request operation '{1}'. Expected one of '{2}' or '{3}'. |
| `AADB2C90033` | Policy '{0}' does not specify an Azure Active Directory provider for reading from the directory by object id. |
| `AADB2C90034` | Profile '{0}' must contain exactly one input claim. |
| `AADB2C90035` | The service is temporarily unavailable. Please retry after a few minutes. |
| `AADB2C90036` | The request does not contain a URI to redirect the user to post logout. Specify a URI in the post_logout_redirect_uri parameter field. |
| `AADB2C90037` | An error occurred while processing the request. Please contact administrator of the site you are trying to access. |
| `AADB2C90038` | An error occurred while processing the request. Please try after a while, or contact administrator of the site you are trying to access if this error persists. |
| `AADB2C90039` | The request contains a client assertion, but the provided policy '{0}' in tenant '{1}' is missing a client_secret in RelyingPartyPolicy. |
| `AADB2C90040` | User journey '{0}' does not contain a send claims step. |
| `AADB2C90041` | User journey '{0}' send claims step does not contain a reference to an issuer technical profile. |
| `AADB2C90042` | RequestContextMaximumLengthInBytes cannot be a negative. |
| `AADB2C90043` | The prompt included in the request contains invalid values. Expected 'none', 'login', 'consent' or 'select_account'. |
| `AADB2C90044` | The claim '{0}' is not supported by the claim resolver '{1}'. |
| `AADB2C90045` | The claim resolver '{0}' specified in policy is not implemented. |
| [AADB2C90046](error-handling.md#aadb2c90046) | We are having trouble loading your current state. You might want to try starting your session over from the beginning. |
| [AADB2C90047](error-handling.md#aadb2c90047) | The resource '{0}' contains script errors preventing it from being loaded. |
| `AADB2C90048` | An unhandled exception has occurred on the server. |
| `AADB2C90049` | User journey '{0}' is invalid because it contains multiple SendClaims steps. |
| `AADB2C90050` | User journey '{0}' is invalid because it contains steps which occur after the SendClaims step. |
| `AADB2C90051` | No suitable claims providers were found. |
| `AADB2C90052` | Invalid username or password. |
| [AADB2C90053](error-handling.md#aadb2c90053) | A user with the specified credential could not be found. |
| [AADB2C90054](error-handling.md#aadb2c90054) | Invalid username or password. |
| `AADB2C90055` | The scope '{0}' provided in request must specify a resource, such as 'https://example.com/calendar.read'. |
| `AADB2C90056` | The scope '{0}' contains a resource not authorized by the application. |
| `AADB2C90057` | The provided application is not configured to allow the OAuth Implicit flow. |
| `AADB2C90058` | The provided application is not configured to allow public clients. |
| `AADB2C90059` | The resource '{0}' contains errors preventing it from being parsed. |
| `AADB2C90060` | The client initializer timed out attempting to load the CORS resource '{0}'. |
| `AADB2C90061` | The Ajax CORS request has been aborted by the user canceling execution or navigating to another page. |
| `AADB2C90062` | The B2C resource '{0}' returned a 404 not found. |
| `AADB2C90063` | The B2C service has an internal error. |
| `AADB2C90064` | The server hosting resource '{0}' has returned an internal server error. |
| `AADB2C90065` | A B2C client-side error '{0}' has occurred requesting the remote resource. |
| `AADB2C90066` | Invalid policy '{0}' was specified in the request. |
| `AADB2C90067` | The post logout redirect URI '{0}' has an invalid format. Specify an https based URL such as 'https://example.com/return' or for native clients use the IETF native client URI 'urn:ietf:wg:oauth:2.0:oob'. |
| `AADB2C90068` | The provided application with ID '{0}' is not valid against this service. Please use an application created via the B2C portal and try again. |
| `AADB2C90069` | The reply URLs of the application '{0}' contain invalid values. Reply URLs can be either localhost or use the same domain with https. |
| `AADB2C90070` | The App ID URI of the application '{0}' has an invalid format. Specify an absolute URI such as 'https://example.com/'. |
| `AADB2C90071` | The Sector Identifier of the application '{0}' has an invalid format. Specify an absolute URI such as 'https://example.com/'. |
| `AADB2C90072` | The reply URLs of the application '{0}' contain invalid values. Reply URLs can be either localhost or use the same domain with https. |
| `AADB2C90073` | {0} with '{1}': '{2}' cannot be found in the directory '{3}'. |
| `AADB2C90074` | User attribute with id: '{0}' already exists in directory '{1}'. |
| `AADB2C90075` | The claims exchange '{0}' specified in step '{1}' returned HTTP error response with Code '{2}' and Reason '{3}'. |
| `AADB2C90076` | AAD query failed with reason: '{0}'. |
| [AADB2C90077](error-handling.md#aadb2c90077) | User does not have an existing session and request prompt parameter has a value of '{0}'. |
| `AADB2C90078` | The request must contain a redirect URI when policy allows open redirection. |
| `AADB2C90079` | Clients must send a client_secret when redeeming a confidential grant. |
| [AADB2C90080](error-handling.md#aadb2c90080) | The provided grant has expired. Please re-authenticate and try again. Current time: {0}, Grant issued time: {1}, Grant sliding window expiration time: {2}. |
| `AADB2C90081` | The specified client_secret does not match the expected value for this client. Please correct the client_secret and try again. |
| `AADB2C90082` | The provided grant has insufficient authorization for the requested scope '{0}'. |
| `AADB2C90083` | The request is missing required parameter: {0}. |
| `AADB2C90084` | Public clients should not send a client_secret when redeeming a publicly acquired grant. |
| `AADB2C90085` | The service has encountered an internal error. Please reauthenticate and try again. |
| `AADB2C90086` | The supplied grant_type [{0}] is not supported. |
| `AADB2C90087` | The provided grant has not been issued for this version of the protocol endpoint. |
| [AADB2C90088](error-handling.md#aadb2c90088) | The provided grant has not been issued for this endpoint. Actual Value : {0} and Expected Value : {1} |
| `AADB2C90089` | All the keys in the key container '{2}' must be of the same type. The new key is of type '{1}' but it must be of type '{0}' to be consistent with existing keys. |
| [AADB2C90090](error-handling.md#aadb2c90090) | {0}. |
| `AADB2C90091` | {0}. |
| `AADB2C90092` | The provided application with ID '{0}' is disabled for the tenant '{1}'. Please enable the application and try again. |
| `AADB2C90094` | One of the passwords provided for '{0}' is invalid. |
| `AADB2C90095` | One of the reply URLs provided for application '{0}' is invalid. Please change the reply URL and try again. |
| `AADB2C90096` | The application display name '{0}' contains a word that is not allowed. Please change the display name and try again. |
| `AADB2C90097` | One of the reply URLs provided for application '{0}' contains a word that is not allowed. Please change the reply URL and try again. |
| `AADB2C90098` | One of the passwords of application '{0}' is too weak. |
| `AADB2C90099` | One of the passwords of application '{0}' is too long. |
| `AADB2C90100` | Too many passwords were provided for application '{0}'. |
| `AADB2C90101` | Identifier URI was provided for application '{0}' but they are not supported for V2 applications. If this application was edited outside of this B2C Admin experience, you will have to delete it and create it again. Read this article (https://go.microsoft.com/fwlink/?linkid=826306) for more details. |
| `AADB2C90102` | One of the reply URLs provided for application '{0}' is not well formed. |
| `AADB2C90103` | One of the reply URLs provided for application '{0}' contains a scheme that is not allowed. Only HTTPS is allowed, with HTTP for localhost. |
| `AADB2C90104` | One of the reply URLs provided for application '{0}' contains query strings. Please change the reply URL and try again. |
| `AADB2C90105` | One of the reply URLs provided for application '{0}' contains a wild card. Please remove the wild card and try again. |
| `AADB2C90106` | One of the reply URLs provided for application '{0}' is on a domain different from other reply URL(s). Please make sure all reply URLs other than localhost are on the same root domain. |
| `AADB2C90107` | The application with ID '{0}' cannot get an ID token either because the openid scope was not provided in the request or the application is not authorized for it. |
| `AADB2C90108` | The orchestration step '{0}' does not specify a CpimIssuerTechnicalProfileReferenceId when one was expected. |
| `AADB2C90109` | The reply URLs of the application '{0}' contain more than one unique external domains. Reply URLs can be either localhost or use the same domain with https. |
| `AADB2C90110` | The scope parameter must include 'openid' when requesting a response_type that includes 'id_token'. |
| `AADB2C90111` | Your account has been locked. Contact your support person to unlock it, then try again. |
| `AADB2C90112` | The specified language '{0}' is invalid or unsupported. |
| `AADB2C90113` | The uploaded XML has an error on line {0} col {1} : {2}. |
| `AADB2C90114` | Your account is temporarily locked to prevent unauthorized use. Try again later. |
| `AADB2C90115` | When requesting the 'code' response_type, the scope parameter must include a resource or client ID for access tokens, and 'openid' for ID tokens. Additionally include 'offline_access' for refresh tokens. |
| `AADB2C90116` | The default culture is not specified. Please select a valid default culture. |
| [AADB2C90117](error-handling.md#aadb2c90117) | The scope '{0}' provided in the request is not supported. |
| `AADB2C90118` | The user has forgotten their password. |
| `AADB2C90119` | User has exceeded the maximum number of retries for step '{0}' of policy '{1}'. |
| `AADB2C90120` | The max age parameter '{0}' specified in the request is invalid. Max age must be an integer between '{1}' and '{2}' inclusive. |
| `AADB2C90121` | The user session exceeds the specified maximum age and request prompt parameter has a value of 'None'. |
| `AADB2C90122` | Input for '{0}' received in the request has failed HTTP request validation. Ensure that the input does not contain characters such as < or &. |
| `AADB2C90123` | The scope parameter must include the client ID when requesting a response_type that includes 'token'. |
| `AADB2C90124` | The application insights profile '{0}' does not specify an InstrumentationKey. |
| `AADB2C90125` | The application insights profile '{0}' has no value for the InstrumentationKey. |
| `AADB2C90126` | The application insights profile '{0}' does not specify an input claim with a partner claim type of 'eventName'. |
| `AADB2C90127` | The application insights profile '{0}' does not specify or has an empty DefaultValue for the 'eventName' claim. |
| [AADB2C90128](error-handling.md#aadb2c90128) | The account associated with this grant no longer exists. Please reauthenticate and try again. |
| [AADB2C90129](error-handling.md#aadb2c90129) | The provided grant has been revoked. Please reauthenticate and try again. |
| `AADB2C90130` | The key container in tenant '{0}' with storageReferenceId '{1}' does not exist. |
| `AADB2C90131` | The key container in tenant '{0}' with storageReferenceId '{1}' does not has a key referenced by '{2}'. |
| `AADB2C90132` | The key container in tenant '{0}' with storageReferenceId '{1}' has a key referenced by '{2}'. The key can't be revoked because there is no future key. |
| `AADB2C90133` | The key container in tenant '{0}' with storageReferenceId '{1}' can't be cleaned because there is no active or future key. |
| `AADB2C90134` | The key container in tenant '{0}' with storageReferenceId '{1}' does not has an active key to revoke. |
| `AADB2C90135` | The key container in tenant '{0}' with storageReferenceId '{1}' does not has a future key. |
| `AADB2C90136` | The request is missing parameters or has the wrong parameters. '{0}' has the value '{1}'. Expected value is '{2}'. |
| `AADB2C90137` | A secure RSA key requires at least {0} bits. |
| `AADB2C90138` | A secure OCT key requires at least {0} bits. |
| `AADB2C90139` | Can’t read application details. If this application was edited outside of this B2C Admin experience, you will have to delete it and create it again. Read this article (https://go.microsoft.com/fwlink/?linkid=826306) for more details. |
| `AADB2C90140` | One of the identifier URIs provided for application '{0}' is not valid URI. |
| `AADB2C90141` | One of the identifier URIs {1} provided for application '{0}' is already used. |
| `AADB2C90142` | Published scopes provided for application '{0}' have duplicate values. |
| `AADB2C90143` | The Identifier URIs provided for application '{0}' is not verified '{1}'. |
| `AADB2C90144` | The name of the application '{0}' cannot contain more than 90 characters. |
| `AADB2C90145` | No unverified phone numbers have been found and policy does not allow a user entered number. |
| `AADB2C90146` | The scope '{0}' provided in request specifies more than one resource for an access token, which is not supported. |
| `AADB2C90147` | One of the resource permission provided for application '{0}' already exists. |
| `AADB2C90148` | One of the published scopes for application '{0}' have invalid {1}: '{2}'. |
| `AADB2C90149` | Script '{0}' failed to load. |
| `AADB2C90150` | Cross origin request timed out getting the CORS resource '{0}'. |
| `AADB2C90151` | User as exceeded the maximum number for retries for multi-factor authentication. |
| `AADB2C90152` | A multi-factor poll request failed to get a response from the service. |
| `AADB2C90153` | A multi-factor poll request has resulted in an unknown poll response. |
| `AADB2C90154` | A multi-factor verification request failed to get a session id from the service. |
| `AADB2C90155` | A multi-factor verification request has failed with reason '{0}'. |
| `AADB2C90156` | A multi-factor validation request has failed with reason '{0}'. |
| `AADB2C90157` | User as exceeded the maximum number for retries for a self-asserted step. |
| `AADB2C90158` | A self-asserted validation request has failed with reason '{0}'. |
| `AADB2C90159` | A self-asserted verification request has failed with reason '{0}'. |
| `AADB2C90160` | A self-asserted send response has resulted in an unknown response from the service. |
| `AADB2C90161` | A self-asserted send response has failed with reason '{0}'. |
| `AADB2C90162` | The restful claims exchange '{0}' specified in step '{1}' has exceeded the number of allowable retries and has been canceled. |
| `AADB2C90163` | A cryptographic key for 'SamlMessageSigning' has not been specified or the certificate referenced does not exist. |
| `AADB2C90164` | The SAML relying party metadata does not specify a key descriptor for encryption. |
| `AADB2C90165` | The SAML initiating message with id '{0}' cannot be found in state. |
| `AADB2C90166` | The signature algorithm '{0}' is not supported on the HTTP-Redirect binding. |
| `AADB2C90167` | The signing certificate with subject '{0}' does not contain a private key and cannot be used for signing. |
| `AADB2C90168` | The HTTP-Redirect request does not contain the required parameter '{0}' for a signed request. |
| `AADB2C90169` | The SAML technical profile '{0}' does not specify a metadata item for PartnerEntity. This is required and must contain a URI referencing the SAML metadata or CDATA block containing the SAML metadata. |
| `AADB2C90170` | The metadata item '{0}' of technical profile '{1}' does not specify a valid boolean. True or False expected. |
| `AADB2C90171` | The metadata item '{0}' of technical profile '{1}' is deprecated and has been replaced by '{2}'. |
| `AADB2C90172` | The value specified for the NameID format of '{0}', is not a valid SAML NameID format. |
| `AADB2C90173` | The claims endpoint request is missing required parameter: '{0}', please contact your admin. |
| `AADB2C90174` | Received error response from identity provider server: {0}, please contact your admin. |
| `AADB2C90175` | The {0} response is missing required parameter: '{1}', please contact your admin. |
| `AADB2C90176` | The X509Certificate with subject '{0}' does not contain a private key and cannot be used for signing and decryption. |
| `AADB2C90177` | The client initializer encountered network error attempting to load the CORS resource '{0}'. |
| `AADB2C90178` | The signing certificate '{0}' has no private key. |
| `AADB2C90179` | The presented X509 certificate '{0}' in tenant '{1}' is not a valid X.509 certificate: '{2}' |
| `AADB2C90180` | The presented key '{0}' of type '{1}' already exists. |
| `AADB2C90181` | The metadata item '{0}' of technical profile '{1}' contains invalid URI '{2}'. A comma separated list of URIs is expected. |
| `AADB2C90182` | The supplied code_verifier does not match associated code_challenge |
| `AADB2C90183` | The supplied code_verifier is invalid |
| `AADB2C90184` | The supplied code_challenge_method is not supported. Supported values are plain or S256 |
| `AADB2C90185` | The uploaded JSON has an error on line {0} col {1} : {2}. |
| `AADB2C90186` | The input value {0} is null. Please specify a non null value. |
| `AADB2C90187` | The uploaded JSON contains invalid characters |
| `AADB2C90188` | The SAML technical profile '{0}' specifies a PartnerEntity URL of '{1}', but fetching the metadata fails with reason '{2}'. |
| `AADB2C90189` | A token request was attempted, but neither the discovery profile metadata nor the technical profile metadata specify a URL to which the request can be made. Please ensure that a token_endpoint is present in either the discovery profile or the technical profile. |
| `AADB2C90190` | A user info request returned no claims when claims were expected. |
| `AADB2C90191` | The bearer token provided for use in the authorization header is null or empty. |
| `AADB2C90192` | Restful profile '{0}' in policy '{1}' in tenant '{2}' specifies the bearer authentication type, but does specify the metadata item '{3}' or it is empty. |
| `AADB2C90193` | Restful profile '{0}' in policy '{1}' in tenant '{2}' does not have the input claim '{3}' referenced by '{4}'. |
| `AADB2C90194` | Claim '{0}' specified for the bearer token is not present in the available claims. Available claims '{1}'. |
| `AADB2C90195` | Claim '{0}' specified for the bearer token is null or empty. |
| `AADB2C90196` | The content definition with id '{0}' specifies a LoadUri of '{1}', but fetching the resource fails with reason '{2}'. |
| `AADB2C90197` | The application cannot have more than {0} reply URLs. |
| `AADB2C90198` | The grant type of the permission grant '{0}' is not supported. |
| `AADB2C90199` | Restful Provider {0} policy metadata contains an error related to NamespaceIdentifierPath or NamespaceIdentifierValue: : {1} |
| `AADB2C90200` | Restful Provider {0} encountered a payload with no value matching NamespaceIdentifierPath :  {1} |
| `AADB2C90201` | Restful Provider {0} encountered a payload where NamespaceIdentifierValue of {1} did not match the value configured in policy: {2} |
| `AADB2C90202` | Restful Provider {0} encountered a payload where NamespaceIdentifierValue of {1} did not match the value configured in policy: {2} |
| `AADB2C90203` | The x-ms-redirectblob header is missing in request headers |
| `AADB2C90204` | The provided redirectBlob '{0}' is not a valid 3 segment request blob |
| `AADB2C90205` | This application does not have sufficient permissions against this web resource to perform the operation. |
| `AADB2C90206` | A time out has occurred initialization the client. |
| `AADB2C90207` | The version '{0}' specified in the JourneyTelemetryVersion is not supported. Currently supported versions: '1.0.0'. |
| `AADB2C90208` | The provided id_token_hint parameter is expired. Please provide another token and try again. |
| `AADB2C90209` | The provided id_token_hint parameter does not contain an accepted audience. Valid audience values: '{0}'. Please provide another token and try again. |
| `AADB2C90210` | The provided id_token_hint parameter could not be validated. Please provide another token and try again. |
| `AADB2C90211` | The request contained an incomplete state cookie. |
| `AADB2C90212` | The request contained an invalid state cookie. |
| `AADB2C90213` | The certificate password provided in request is incorrect. |
| `AADB2C90214` | The expiry date for the key container in tenant '{0}' with storageReferenceId '{1}' is in the past. Passed date :'{2}'. |
| `AADB2C90215` | The uploaded key is badly formatted. Reason: '{0}'. |
| `AADB2C90216` | The key format parameter '{0}' is not supported. Use jwks, base64Certificate or pfx |
| `AADB2C90217` | {0} Validation errors found in upload overrides for {1}. Please ensure that your uploaded resource matches the template: {2} |
| `AADB2C90218` | The application {0} contains field of invalid length |
| `AADB2C90219` | Logout responses are not supported by protocol '{0}'. |
| `AADB2C90220` | The key container in tenant '{0}' with storage identifier '{1}' exists but does not contain a valid certificate. The certificate might be expired or your certificate might become active in the future (nbf). |
| `AADB2C90221` | The language resource you are uploading is not overriding any strings.  Please set your override value to true, or ensure you are including overrides in your file.  For more information see: https://go.microsoft.com/fwlink/?linkid=849075 |
| `AADB2C90222` | The language resource exceeds the maximum size allowed.  For more information see: https://go.microsoft.com/fwlink/?linkid=849075 |
| `AADB2C90223` | An error has occurred sanitizing the CORS resource. |
| `AADB2C90224` | Resource owner flow has not been enabled for the application. |
| [AADB2C90225](error-handling.md#aadb2c90225) | The username or password provided in the request are invalid. |
| `AADB2C90226` | The specified token exchange is only supported over HTTP POST. |
| `AADB2C90227` | The application '{0}' contains reply urls with fragments. Fragments are not allowed in reply urls. |
| `AADB2C90228` | The RelyingParty section of TrustFramework Policy does not have required TechnicalProfiles. |
| `AADB2C90229` | Your request is throttled temporarily. Please retry after the time specified in the additional information of the error message. |
| `AADB2C90230` | The uploaded localized resource contains a duplicated key, please ensure that the localized string with ElementType: {0}, ElementId: {1} and StringId: {2} appears only once. |
| `AADB2C90231` | The uploaded localized resource contains a duplicated key, please ensure that the localized string with ElementType: {0} and StringId: {1} appears only once. |
| `AADB2C90232` | The provided id_token_hint parameter does not contain an accepted issuer. Valid issuers: '{0}'. Please provide another token and try again. |
| `AADB2C90233` | The provided id_token_hint parameter failed signature validation. Please provide another token and try again. |
| `AADB2C90234` | The provided id_token_hint parameter has an 'nbf' value that is in the future. Please provide another token and try again. |
| `AADB2C90235` | The provided id_token is expired. Please provide another token and try again. |
| `AADB2C90236` | The provided id_token has an 'nbf' value that is in the future. Please provide another token and try again. |
| `AADB2C90237` | The provided id_token does not contain a valid audience. Valid audience values: '{0}'. Please provide another token and try again. |
| `AADB2C90238` | The provided id_token does not contain a valid issuer. Valid issuer values: '{0}'. Please provide another token and try again. |
| `AADB2C90239` | The provided id_token failed signature validation. Please provide another token and try again. |
| `AADB2C90240` | The provided id_token is malformed and could not be parsed. Please provide another token and try again. |
| `AADB2C90241` | Logout requests are not supported for protocol '{0}'. |
| `AADB2C90242` | The SAML technical profile '{0}' specifies PartnerEntity CDATA which cannot be loaded for reason '{1}'. |
| `AADB2C90243` | The IDP's client key/secret is not properly configured. |
| `AADB2C90244` | There are too many requests at this moment. Please wait for some time and try again. |
| `AADB2C90245` | Access to the tenant: '{0}' is disabled. Please contact support. |
| `AADB2C90246` | The uploaded JSON has {0} error(s) : {1} |
| `AADB2C90247` | Resource owner flow is only available on custom domains. |
| `AADB2C90248` | Resource owner flow can only be used by applications created through the B2C admin portal. |
| `AADB2C90249` | Resource owner flow has not been enabled for the tenant. |
| `AADB2C90250` | The generic login endpoint is not supported. |
| `AADB2C90255` | The claims exchange specified in technical profile '{0}' did not complete as expected. You might want to try starting your session over from the beginning. |
| `AADB2C90256` | Profile '{0}', production mode policies must use https '{1}' the provided value was '{2}'. |
| `AADB2C90257` | Profile '{0}' uses http service url that is only allowed in development mode policies with metadata key: {1} set to true. |
| `AADB2C90258` | Profile '{0}' uses an insecure authentication mode that is only allowed in production mode policies with metadata key '{1}' set to true. |
| `AADB2C90259` | Profile '{0}' uses '{1}' metadata that is only allowed in development mode policies. |
| `AADB2C90260` | The SSL provisioning service is currently not available. Please try later. |
| `AADB2C90261` | The claims exchange '{0}' specified in step '{1}' returned HTTP error response that could not be parsed. |
| `AADB2C95000` | The application has at least one invalid property. |
| `AADB2C95001` | Expected property '{0}' is missing. |
| `AADB2C95002` | The application name should not have more that '{0}' characters. |
| `AADB2C95003` | The application name should not contain characters from '{0}'. |
| `AADB2C95004` | Only V2 apps are allowed. |
| `AADB2C95005` | Application should either be a web app or a native app. |
| `AADB2C95006` | Application can not have more than '{0}' urls. |
| `AADB2C95007` | The reply url '{0}' is not correctly formatted. |
| `AADB2C95008` | There may not be any duplicate reply urls. |
| `AADB2C95009` | The following url value: '{0}' is not allowed. |
| `AADB2C95010` | Non localhost urls must use be secure (https). |
| `AADB2C95011` | Reply url '{0}' may not contain a query string. |
| `AADB2C95012` | Reply url '{0}' must not contain a fragment. |
| `AADB2C95013` | Reply url '{0}' should not contain characters from '{1}'. |
| `AADB2C95014` | Application may not have more than '{0}' external domains. |
| `AADB2C95015` | The uri '{0}' must not have more that '{1}' characters. |
| `AADB2C95016` | The native uri '{0}' should not contain characters from '{1}'. |
| `AADB2C95017` | The application id uri '{0}' is incorrectly formatted. |
| `AADB2C95018` | The application id uri '{0}' may not have more than '{1}' characters. |
| `AADB2C95019` | The application id uri '{0}' may not contain characters from the character set '{1}'. |
| `AADB2C95020` | The application id uri '{0}' is already used. |
| `AADB2C95021` | There are no defaults for this language. |
| `AADB2C95022` | There are no overrides for this language. |
| `AADB2C95023` | The claim '{0}' in technical profile '{1}' in policy '{2}' of tenant '{3}' has invalid Id for extension property. Please ensure the claim Id matches the regex '{4}'. |
| `AADB2C95024` | The uploaded resources file is larger than the limit of {0} KB. |
| `AADB2C95025` | The presented password for the uploaded certificate is wrong. |
| `AADB2C95026` | The uploaded JSON Web Key for tenant '{0}' is not in the correct JSON format. |
| `AADB2C95027` | The trustframework backup key set Id '{0}' must end with .bak. |
| `AADB2C95028` | Can't create trustframework key set with name '{0}' because it already exists. |
| `AADB2C95029` | The trustframework keyset parameter K is not base64 URL encoded. |
| `AADB2C95030` | Missing kty parameter for the trustframework key. |
| `AADB2C95031` | Bad kty parameter '{0}' for the trustframework key. Must be RSA or oct. |
| `AADB2C95032` | One can't mix RSA and Oct types in one key set. |
| `AADB2C95033` | Bad use parameter '{0}' for the trustframework key. |
| `AADB2C95034` | The presented TrustFrameworkKey entity is of the wrong format |
| `AADB2C95035` | The trustframework key can't be serialized. Reason: '{0}'. |
| `AADB2C95036` | The presented TrustFrameworkKey entity cannot be loaded for serialization. |
| `AADB2C95037` | The presented TrustFrameworkKey entity is missing kty. |
| `AADB2C95038` | Can't create trustframework key set with name '{0}' because it already exists. |
| `AADB2C95039` | The presented TrustFrameworkKey RSA entity is missing or the modulus or exponent. |
| `AADB2C95040` | The trustframework key can't be deserialized. Reason: '{0}'. |
| `AADB2C95041` | The trust framework key K parameter is wrongly encoded. Should be base64 URL encoded. |
| `AADB2C95042` | One can't mix signature and encryption usage in one key set. |
| `AADB2C95043` | There are too many requests at this moment. Please wait for some time and try again. |
| `AADB2C95044` | TenantId passed as part of object is different from login tenant. |
| `AADB2C95045` | The SSL certificate '{0}' to activate is not in status uploaded '{1}'. |
| `AADB2C95046` | The SSL certificate '{0}' to activate is not found. |
| `AADB2C95047` | SSL certificate can't be decoded. Possibly wrong password. |
| `AADB2C95048` | SSL certificate is not pfx encoded. |
| `AADB2C95049` | SSL certificate upload failed. Can't upload the active certificate {0}. |
| `AADB2C95050` | Custom domain binding limit reached. |
| `AADB2C95051` | The custom domain service is currently not available. Please try again later. |
| `AADB2C95052` | The trustframework key set with id '{0}' in tenant '{1}' is not created. Please use 'Create api' to create the key set first. |
| `AADB2C95053` | Multiple concurrent writes to the same object detected. Please perform update operations on the same object sequentially. |
| `AADB2C95054` | The tenant with name '{0}' already exists. |
| `AADB2C95055` | The tenant domain name prefix '{0}' is invalid. |
| `AADB2C95056` | The tenant domain name suffix '{0}' is invalid. |
| `AADB2C95057` | The tenant provisioning service not available. |
| `AADB2C95058` | An internal error occurred in tenant provisioning service. |
| `AADB2C95059` | One of the keys in the payload has 'kid' which is not empty. |
| `AADB2C95060` | The tenant can not be deleted. Reason = '{0}'. |
| `AADB2C95061` | The given tenant has subscription in it, it can not be deleted. |
| `AADB2C90251` | Resource owner requests using v1 applications require the resource parameter to be specified. |
| `AADB2C90252` | Technical profile '{0}' does not contain valid CDATA wrapped XML for metadata item '{1}'. |
| `AADB2C90253` | The trustframework keyset parameter '{0}' is missing |
| `AADB2C90272` | The id_token_hint parameter has not been specified in the request. Please provide token and try again. |
| `AADB2C90273` | An invalid response was received : '{0}' |
| `AADB2C90274` | The provider metadata does not specify a single logout service or the endpoint binding is not one of 'urn:oasis:names:tc:SAML:2.0:bindings:HTTP-Redirect' or 'urn:oasis:names:tc:SAML:2.0:bindings:HTTP-POST'. |
| `AADB2C90275` | The URL '{0}' specified for endpoint '{1}' cannot be reached. Please ensure that endpoint is publicly addressable and returns valid content. |
| `AADB2C90276` | The request is not consistent with the control setting '{0}': '{1}' in technicalProfile '{2}' for policy '{3}' tenant '{4}'. |
| `AADB2C90277` | The orchestration step '{0}' of user journey '{1}' of policy '{2}' does not contain a content definition reference. |
| `AADB2C90278` | Unable to validate the information provided. |
| `AADB2C90279` | The provided client id '{0}' does not match the client id that issued the grant. |
| `AADB2C90280` | The x-ms-redirectblob header is not expected in request headers. |
| `AADB2C90281` | The 'ExternalRefreshToken' claim is missing in the input token. |
| `AADB2C90282` | The 'ExternalRefreshToken' claim is having incorrect domain. |
| `AADB2C90283` | The 'ExternalRefreshToken' claim value is incorrect. |
| `AADB2C90284` | The application with identifier '{0}' has not been granted consent and is unable to be used for local accounts. |
| `AADB2C90285` | The application with identifier '{0}' was not found. |
| `AADB2C90286` | The request is missing the following required parameter: '{0}'. |
| `AADB2C90287` | The request contains invalid redirect URI '{0}' |
| `AADB2C90288` | UserJourney with id '{0}' referenced in TechnicalProfile '{1}' for refresh token redemption for tenant '{2}' does not exist in policy '{3}' or any of its base policies. |
| `AADB2C90289` | We encountered an error connecting to the identity provider. Please try again later. |
| `AADB2C90290` | The application cannot be updated because its keys are managed elsewhere. |
| `AADB2C99003` | One of the properties provided for the application '{0}' has invalid value. |
| `AADB2C99004` | One of the properties provided for the application '{0}' has invalid value. Property: '{1}', Error: '{2}'. |
| `AADB2C99005` | The request contains an invalid scope parameter which includes an illegal character '{0}'. |
| `AADB2C99006` | Azure AD B2C cannot find the extensions app with app id '{0}'. Please visit http://go.microsoft.com/fwlink/?linkid=851224 for more information. |
| `AADB2C99007` | This request is not listed in the allow or block list from authorization : {0}. |
| `AADB2C99008` | The format of the URI '{0}' is invalid. |
| `AADB2C99009` | Put operation not supported for this entity on this uri. Please append '$value' to the request uri and send the request again. |
| `AADB2C99010` | This tenant has not yet been configured for age gating. |
| `AADB2C99011` | The metadata value '{0}' has not been specified in TechnicalProfile '{1}' in policy '{2}'. |
| `AADB2C99012` | Cannot create User Attribute as Tenant {0} have reached its max limit {1} for User Attributes. |
| `AADB2C99013` | The supplied grant_type [{0}] and token_type [{1}] combination is not supported. |
| `AADB2C99014` | The property '{0}' can not be modified. It's a read only property.  |
| `AADB2C99015` | Profile '{0}' in policy '{1}' in tenant '{2}' is missing all InputClaims required for resource owner password credential flow. |
| `AADB2C99016` | Profile '{0}' in policy '{1}' in tenant '{2}' is missing the '{3}' InputClaim required for resource owner password credential flow. |
| `AADB2C99017` | Profile '{0}' in policy '{1}' in tenant '{2}' has a 'grant_type' InputClaim with a DefaultValue of '{3}' instead of the required 'password' for resource owner password credential flow. |
| `AADB2C99018` | Restful provider must not have specified Id |
| `AADB2C99019` | Restful provider can not have authentication scheme '{0}'. Authentication scheme must be set to one of the following: {1} |
| `AADB2C99020` | The {0} input claims selected for the restful provider are not valid. Please check that the claims are selected in the user flow. |
| `AADB2C99021` | Please add at least one user attribute in order to enable restful provider in your user flow |
| `AADB2C99022` | Please remove duplicated claim '{0}' from restful options. |
