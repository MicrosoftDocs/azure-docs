---
title: Azure API Management template resources | Microsoft Docs
description: Learn about the types of resources available for use in developer portal templates in Azure API Management.
services: api-management
documentationcenter: ''
author: dlepow
manager: erikre
editor: ''

ms.assetid: 51a1b4c6-a9fd-4524-9e0e-03a9800c3e94
ms.service: api-management
ms.workload: mobile
ms.tgt_pltfrm: na
ms.topic: article
ms.date: 11/04/2019
ms.author: danlep
---
# Azure API Management template resources
Azure API Management provides the following types of resources for use in the developer portal templates.  
  
-   [String resources](#strings)  
  
-   [Glyph resources](#glyphs)  

[!INCLUDE [api-management-portal-legacy.md](../../includes/api-management-portal-legacy.md)]

[!INCLUDE [premium-dev-standard-basic.md](../../includes/api-management-availability-premium-dev-standard-basic.md)]
  
##  <a name="strings"></a> String resources  
 API Management provides a comprehensive set of string resources for use in the developer portal. These resources are localized into all of the languages supported by API Management. The default set of templates uses these resources for page headers, labels, and any constant strings that are displayed in the developer portal. To use a string resource in your templates, provide the resource string prefix followed by the string name, as shown in the following example.  
  
```  
{% localized "Prefix|Name" %}  
  
```  
  
 The following example is from the Product list template, and displays **Products** at the top of the page.  
  
```  
<h2>{% localized "ProductsStrings|PageTitleProducts" %}</h2>  
  
```  
  
The following localization options are supported:

| Locale    | Language               |
|-----------|------------------------|
| "en"      | "English"              |
| "cs"      | "Čeština"              |
| "de"      | "Deutsch"              |
| "es"      | "Español"              |
| "fr"      | "Français"             |
| "hu"      | "Magyar"               |
| "it"      | "Italiano"             |
| "ja-JP"   | "日本語"                |
| "ko"      | "한국어"                |
| "nl"      | "Nederlands"           |
| "pl"      | "Polski"               |
| "pt-br"   | "Português (Brasil)"   |
| "pt-pt"   | "Português (Portugal)" |
| "ru"      | "Русский"              |
| "sv"      | "Svenska"              |
| "tr"      | "Türkçe"               |
| "zh-hans" | "中文(简体)"           |
| "zh-hant" | "中文(繁體)"           |

 Refer to the following tables for the string resources available for use in your developer portal templates. Use the table name as the prefix for the string resources in that table.  
  
-   [ApisStrings](#ApisStrings)  
  
-   [ApplicationListStrings](#ApplicationListStrings)  
  
-   [AppDetailsStrings](#AppDetailsStrings)  
  
-   [AppStrings](#AppStrings)  
  
-   [CommonResources](#CommonResources)  
  
-   [CommonStrings](#CommonStrings)  
  
-   [Documentation](#Documentation)  
  
-   [ErrorPageStrings](#ErrorPageStrings)  
  
-   [IssuesStrings](#IssuesStrings)  
  
-   [NotFoundStrings](#NotFoundStrings)  
  
-   [ProductDetailsStrings](#ProductDetailsStrings)  
  
-   [ProductsStrings](#ProductsStrings)  
  
-   [ProviderInfoStrings](#ProviderInfoStrings)  
  
-   [SigninResources](#SigninResources)  
  
-   [SigninStrings](#SigninStrings)  
  
-   [SignupStrings](#SignupStrings)  
  
-   [SubscriptionListStrings](#SubscriptionListStrings)  
  
-   [SubscriptionStrings](#SubscriptionStrings)  
  
-   [UpdateProfileStrings](#UpdateProfileStrings)  
  
-   [UserProfile](#UserProfile)  
  
###  <a name="ApisStrings"></a> ApisStrings  
  
|Name|Text|  
|----------|----------|  
|PageTitleApis|APIs|  
  
###  <a name="AppDetailsStrings"></a> AppDetailsStrings  
  
|Name|Text|  
|----------|----------|  
|WebApplicationsDetailsTitle|Application preview|  
|WebApplicationsRequirementsHeader|Requirements|  
|WebApplicationsScreenshotAlt|Screenshot|  
|WebApplicationsScreenshotsHeader|Screenshots|  
  
###  <a name="ApplicationListStrings"></a> ApplicationListStrings  
  
|Name|Text|  
|----------|----------|  
|WebDevelopersAppDeleteConfirmation|Are you sure that you want to remove application?|  
|WebDevelopersAppNotPublished|Not published|  
|WebDevelopersAppNotSubmitted|Not submitted|  
|WebDevelopersAppTableCategoryHeader|Category|  
|WebDevelopersAppTableNameHeader|Name|  
|WebDevelopersAppTableStateHeader|State|  
|WebDevelopersEditLink|Edit|  
|WebDevelopersRegisterAppLink|Register application|  
|WebDevelopersRemoveLink|Remove|  
|WebDevelopersSubmitLink|Submit|  
|WebDevelopersYourApplicationsHeader|Your applications|  
  
###  <a name="AppStrings"></a> AppStrings  
  
|Name|Text|  
|----------|----------|  
|WebApplicationsHeader|Applications|  
  
###  <a name="CommonResources"></a> CommonResources  
  
|Name|Text|  
|----------|----------|  
|NoItemsToDisplay|No results found.|  
|GeneralExceptionMessage|Something is not right. It could be a temporary glitch or a bug. Please, try again.|  
|GeneralJsonExceptionMessage|Something is not right. It could be a temporary glitch or a bug. Please, reload the page and try again.|  
|ConfirmationMessageUnsavedChanges|There are some unsaved changes. Are you sure you want to cancel and discard the changes?|  
|AzureActiveDirectory|Microsoft Entra ID|  
|HttpLargeRequestMessage|Http Request Body too large.|  
  
###  <a name="CommonStrings"></a> CommonStrings  
  
|Name|Text|  
|----------|----------|  
|ButtonLabelCancel|Cancel|  
|ButtonLabelSave|Save|  
|GeneralExceptionMessage|Something is not right. It could be a temporary glitch or a bug. Please, try again.|  
|NoItemsToDisplay|There are no items to display.|  
|PagerButtonLabelFirst|First|  
|PagerButtonLabelLast|Last|  
|PagerButtonLabelNext|Next|  
|PagerButtonLabelPrevious|Prev|  
|PagerLabelPageNOfM|Page {0} of {1}|  
|PasswordTooShort|The Password is too short|  
|EmailAsPassword|Do not use your email as your password|  
|PasswordSameAsUserName|Your password cannot contain your username|  
|PasswordTwoCharacterClasses|Use different character classes|  
|PasswordTooManyRepetitions|Too many repetitions|  
|PasswordSequenceFound|Your password contains sequences|  
|PagerLabelPageSize|Page size|  
|CurtainLabelLoading|Loading...|  
|TablePlaceholderNothingToDisplay|There is no data for the selected period and scope|  
|ButtonLabelClose|Close|  
  
###  <a name="Documentation"></a> Documentation  
  
|Name|Text|  
|----------|----------|  
|WebDocumentationInvalidHeaderErrorMessage|Invalid header '{0}'|  
|WebDocumentationInvalidRequestErrorMessage|Invalid Request URL|  
|TextboxLabelAccessToken|Access token *|  
|DropdownOptionPrimaryKeyFormat|Primary-{0}|  
|DropdownOptionSecondaryKeyFormat|Secondary-{0}|  
|WebDocumentationSubscriptionKeyText|Your subscription key|  
|WebDocumentationTemplatesAddHeaders|Add required HTTP headers|  
|WebDocumentationTemplatesBasicAuthSample|Basic Authorization Sample|  
|WebDocumentationTemplatesCurlForBasicAuth|for Basic Authorization use: --user {username}:{password}|  
|WebDocumentationTemplatesCurlValuesForPath|Specify values for path parameters (shown as {...}), your subscription key and values for query parameters|  
|WebDocumentationTemplatesDeveloperKey|Specify your subscription key|  
|WebDocumentationTemplatesJavaApache|This sample uses the Apache HTTP client from HTTP Components (http://hc.apache.org/httpcomponents-client-ga/)|  
|WebDocumentationTemplatesOptionalParams|Specify values for optional parameters, as needed|  
|WebDocumentationTemplatesPhpPackage|This sample uses the HTTP_Request2 package. (for more information: https://pear.php.net/package/HTTP_Request2)|  
|WebDocumentationTemplatesPythonValuesForPath|Specify values for path parameters (shown as {...}) and request body if needed|  
|WebDocumentationTemplatesRequestBody|Specify request body|  
|WebDocumentationTemplatesRequiredParams|Specify values for the following required parameters|  
|WebDocumentationTemplatesValuesForPath|Specify values for path parameters (shown as {...})|  
|OAuth2AuthorizationEndpointDescription|The authorization endpoint is used to interact with the resource owner and obtain an authorization grant.|  
|OAuth2AuthorizationEndpointName|Authorization endpoint|  
|OAuth2TokenEndpointDescription|The token endpoint is used by the client to obtain an access token by presenting its authorization grant or refresh token.|  
|OAuth2TokenEndpointName|Token endpoint|  
|OAuth2Flow_AuthorizationCodeGrant_Step_AuthorizationRequest_Description|<p\>         The client initiates the flow by directing the resource owner's         user-agent to the authorization endpoint.  The client includes         its client identifier, requested scope, local state, and a         redirection URI to which the authorization server will send the         user-agent back once access is granted (or denied).     </p\>     <p\>         The authorization server authenticates the resource owner (via         the user-agent) and establishes whether the resource owner         grants or denies the client's access request.     </p\>     <p\>         Assuming the resource owner grants access, the authorization         server redirects the user-agent back to the client using the         redirection URI provided earlier (in the request or during         client registration).  The redirection URI includes an         authorization code and any local state provided by the client         earlier.     </p\>|  
|OAuth2Flow_AuthorizationCodeGrant_Step_AuthorizationRequest_ErrorDescription|<p\>     If the user denies the access request of if the request is invalid, the client will be informed using the following parameters added on to the redirect: </p\>|  
|OAuth2Flow_AuthorizationCodeGrant_Step_AuthorizationRequest_Name|Authorization request|  
|OAuth2Flow_AuthorizationCodeGrant_Step_AuthorizationRequest_RequestDescription|<p\>         The client app must send the user to the authorization endpoint in order to initiate the OAuth process.          At the authorization endpoint, the user authenticates and then grants or denies access to the app.     </p\>|  
|OAuth2Flow_AuthorizationCodeGrant_Step_AuthorizationRequest_ResponseDescription|<p\>     Assuming the resource owner grants access, authorization server     redirects the user-agent back to the client using the     redirection URI provided earlier (in the request or during     client registration).  The redirection URI includes an     authorization code and any local state provided by the client     earlier. </p\>|  
|OAuth2Flow_AuthorizationCodeGrant_Step_TokenRequest_Description|<p\>  The client requests an access token from the authorization     server''s token endpoint by including the authorization code     received in the previous step.  When making the request, the     client authenticates with the authorization server.  The client     includes the redirection URI used to obtain the authorization     code for verification. </p\> <p\>     The authorization server authenticates the client, validates the     authorization code, and ensures that the redirection URI     received matches the URI used to redirect the client in     step (C).  If valid, the authorization server responds back with     an access token and, optionally, a refresh token. </p\>|  
|OAuth2Flow_AuthorizationCodeGrant_Step_TokenRequest_ErrorDescription|<p\>     If the request client     authentication failed or is invalid, the authorization server responds with an HTTP 400 (Bad Request)     status code (unless specified otherwise) and includes the following     parameters with the response. </p\>|  
|OAuth2Flow_AuthorizationCodeGrant_Step_TokenRequest_RequestDescription|<p\>   The client makes a request to the token endpoint by sending the     following parameters using the "application/x-www-form-urlencoded"  format with a character encoding of UTF-8 in the HTTP  request entity-body. </p\>|  
|OAuth2Flow_AuthorizationCodeGrant_Step_TokenRequest_ResponseDescription|<p\>  The authorization server issues an access token and optional refresh    token, and constructs the response by adding the following parameters   to the entity-body of the HTTP response with a 200 (OK) status code. </p\>|  
|OAuth2Flow_ClientCredentialsGrant_Step_TokenRequest_Description|<p\>  The client authenticates with the authorization server and     requests an access token from the token endpoint. </p\> <p\>  The authorization server authenticates the client, and if valid,     issues an access token. </p\>|  
|OAuth2Flow_ClientCredentialsGrant_Step_TokenRequest_ErrorDescription|<p\>     If the request failed client authentication or is invalid   the authorization server responds with an HTTP 400 (Bad Request)     status code (unless specified otherwise) and includes the following     parameters with the response. </p\>|  
|OAuth2Flow_ClientCredentialsGrant_Step_TokenRequest_RequestDescription|<p\>   The client makes a request to the token endpoint by adding the     following parameters using the "application/x-www-form-urlencoded"     format with a character encoding of UTF-8 in the HTTP     request entity-body. </p\>|  
|OAuth2Flow_ClientCredentialsGrant_Step_TokenRequest_ResponseDescription|<p\>  If the access token request is valid and authorized, the     authorization server issues an access token and optional refresh     token, and constructs the response by adding the following parameters     to the entity-body of the HTTP response with a 200 (OK) status code. </p\>|  
|OAuth2Flow_ImplicitGrant_Step_AuthorizationRequest_Description|<p\>   The client initiates the flow by directing the resource owner''s     user-agent to the authorization endpoint.  The client includes     its client identifier, requested scope, local state, and a     redirection URI to which the authorization server will send the     user-agent back once access is granted (or denied). </p\> <p\>        The authorization server authenticates the resource owner (via     the user-agent) and establishes whether the resource owner     grants or denies the client''s access request. </p\> <p\>        Assuming the resource owner grants access, the authorization   server redirects the user-agent back to the client using the   redirection URI provided earlier.  The redirection URI includes     the access token in the URI fragment. </p\>|  
|OAuth2Flow_ImplicitGrant_Step_AuthorizationRequest_ErrorDescription|<p\>     If the resource owner denies the access request or if the request     fails for reasons other than a missing or invalid redirection URI,     the authorization server informs the client by adding the following     parameters to the fragment component of the redirection URI using the     "application/x-www-form-urlencoded" format. </p\>|  
|OAuth2Flow_ImplicitGrant_Step_AuthorizationRequest_RequestDescription|<p\>     The client app must send the user to the authorization endpoint in order to initiate the OAuth process.      At the authorization endpoint, the user authenticates and then grants or denies access to the app. </p\>|  
|OAuth2Flow_ImplicitGrant_Step_AuthorizationRequest_ResponseDescription|<p\>     If the resource owner grants the access request, the authorization     server issues an access token and delivers it to the client by adding     the following parameters to the fragment component of the redirection     URI using the "application/x-www-form-urlencoded" format. </p\>|  
|OAuth2Flow_ObtainAuthorization_AuthorizationCodeGrant_Description|Authorization code flow is optimized for clients capable of maintaining the confidentiality of their credentials (e.g., web server applications implemented using  PHP, Java, Python, Ruby, ASP.NET, etc.).|  
|OAuth2Flow_ObtainAuthorization_AuthorizationCodeGrant_Name|Authorization Code grant|  
|OAuth2Flow_ObtainAuthorization_ClientCredentialsGrant_Description|Client credentials flow is suitable in cases where the client (your application) is requesting access to the protected resources under its control. The client is considered as a resource owner, so no end-user interaction is required.|  
|OAuth2Flow_ObtainAuthorization_ClientCredentialsGrant_Name|Client Credentials grant|  
|OAuth2Flow_ObtainAuthorization_ImplicitGrant_Description|Implicit flow is optimized for clients incapable of maintaining the confidentiality of their credentials known to operate a particular redirection URI. These clients are typically implemented in a browser using a scripting language such as JavaScript.|  
|OAuth2Flow_ObtainAuthorization_ImplicitGrant_Name|Implicit grant|  
|OAuth2Flow_ObtainAuthorization_ResourceOwnerPasswordCredentialsGrant_Description|Resource owner password credentials flow is suitable in cases where the resource owner has a trust relationship with the client (your application), such as the device operating system or a highly privileged application. This flow is suitable for clients capable of obtaining the resource owner's credentials (username and password, typically using an interactive form).|  
|OAuth2Flow_ObtainAuthorization_ResourceOwnerPasswordCredentialsGrant_Name|Resource Owner Password Credentials grant|  
|OAuth2Flow_ResourceOwnerPasswordCredentialsGrant_Step_TokenRequest_Description|<p\>   The resource owner provides the client with its username and     password. </p\> <p\> The client requests an access token from the authorization     server''s token endpoint by including the credentials received     from the resource owner.  When making the request, the client     authenticates with the authorization server. </p\> <p\>     The authorization server authenticates the client and validates     the resource owner credentials, and if valid, issues an access     token. </p\>|  
|OAuth2Flow_ResourceOwnerPasswordCredentialsGrant_Step_TokenRequest_ErrorDescription|<p\>  If the request failed client authentication or is invalid   the authorization server responds with an HTTP 400 (Bad Request)     status code (unless specified otherwise) and includes the following     parameters with the response. </p\>|  
|OAuth2Flow_ResourceOwnerPasswordCredentialsGrant_Step_TokenRequest_RequestDescription|<p\>    The client makes a request to the token endpoint by adding the     following parameters using the "application/x-www-form-urlencoded"     format with a character encoding of UTF-8 in the HTTP     request entity-body. </p\>|  
|OAuth2Flow_ResourceOwnerPasswordCredentialsGrant_Step_TokenRequest_ResponseDescription|<p\>   If the access token request is valid and authorized, the     authorization server issues an access token and optional refresh     token, and constructs the response by adding the following parameters     to the entity-body of the HTTP response with a 200 (OK) status code. </p\>|  
|OAuth2Step_AccessTokenRequest_Name|Access token request|  
|OAuth2Step_AuthorizationRequest_Name|Authorization request|  
|OAuth2AccessToken_AuthorizationCodeGrant_TokenResponse|REQUIRED. The access token issued by the authorization server.|  
|OAuth2AccessToken_ClientCredentialsGrant_TokenResponse|REQUIRED. The access token issued by the authorization server.|  
|OAuth2AccessToken_ImplicitGrant_AuthorizationResponse|REQUIRED. The access token issued by the authorization server.|  
|OAuth2AccessToken_ResourceOwnerPasswordCredentialsGrant_TokenResponse|REQUIRED. The access token issued by the authorization server.|  
|OAuth2ClientId_AuthorizationCodeGrant_AuthorizationRequest|REQUIRED. Client identifier.|  
|OAuth2ClientId_AuthorizationCodeGrant_TokenRequest|REQUIRED if the client is not authenticating with the authorization server.|  
|OAuth2ClientId_ImplicitGrant_AuthorizationRequest|REQUIRED. The client identifier.|  
|OAuth2Code_AuthorizationCodeGrant_AuthorizationResponse|REQUIRED. The authorization code generated by the authorization server.|  
|OAuth2Code_AuthorizationCodeGrant_TokenRequest|REQUIRED. The authorization code received from the authorization server.|  
|OAuth2ErrorDescription_AuthorizationCodeGrant_AuthorizationErrorResponse|OPTIONAL. Human-readable ASCII text providing additional information.|  
|OAuth2ErrorDescription_AuthorizationCodeGrant_TokenErrorResponse|OPTIONAL. Human-readable ASCII text providing additional information.|  
|OAuth2ErrorDescription_ClientCredentialsGrant_TokenErrorResponse|OPTIONAL. Human-readable ASCII text providing additional information.|  
|OAuth2ErrorDescription_ImplicitGrant_AuthorizationErrorResponse|OPTIONAL. Human-readable ASCII text providing additional information.|  
|OAuth2ErrorDescription_ResourceOwnerPasswordCredentialsGrant_TokenErrorResponse|OPTIONAL. Human-readable ASCII text providing additional information.|  
|OAuth2ErrorUri_AuthorizationCodeGrant_AuthorizationErrorResponse|OPTIONAL. A URI identifying a human-readable web page with information about the error.|  
|OAuth2ErrorUri_AuthorizationCodeGrant_TokenErrorResponse|OPTIONAL. A URI identifying a human-readable web page with information about the error.|  
|OAuth2ErrorUri_ClientCredentialsGrant_TokenErrorResponse|OPTIONAL. A URI identifying a human-readable web page with information about the error.|  
|OAuth2ErrorUri_ImplicitGrant_AuthorizationErrorResponse|OPTIONAL. A URI identifying a human-readable web page with information about the error.|  
|OAuth2ErrorUri_ResourceOwnerPasswordCredentialsGrant_TokenErrorResponse|OPTIONAL. A URI identifying a human-readable web page with information about the error.|  
|OAuth2Error_AuthorizationCodeGrant_AuthorizationErrorResponse|REQUIRED. A single ASCII error code from the following: invalid_request, unauthorized_client, access_denied, unsupported_response_type, invalid_scope, server_error, temporarily_unavailable.|  
|OAuth2Error_AuthorizationCodeGrant_TokenErrorResponse|REQUIRED. A single ASCII error code from the following: invalid_request, invalid_client, invalid_grant, unauthorized_client, unsupported_grant_type, invalid_scope.|  
|OAuth2Error_ClientCredentialsGrant_TokenErrorResponse|REQUIRED. A single ASCII error code from the following: invalid_request, invalid_client, invalid_grant, unauthorized_client, unsupported_grant_type, invalid_scope.|  
|OAuth2Error_ImplicitGrant_AuthorizationErrorResponse|REQUIRED. A single ASCII error code from the following: invalid_request, unauthorized_client, access_denied, unsupported_response_type, invalid_scope, server_error, temporarily_unavailable.|  
|OAuth2Error_ResourceOwnerPasswordCredentialsGrant_TokenErrorResponse|REQUIRED. A single ASCII error code from the following: invalid_request, invalid_client, invalid_grant, unauthorized_client, unsupported_grant_type, invalid_scope.|  
|OAuth2ExpiresIn_AuthorizationCodeGrant_TokenResponse|RECOMMENDED. The lifetime in seconds of the access token.|  
|OAuth2ExpiresIn_ClientCredentialsGrant_TokenResponse|RECOMMENDED. The lifetime in seconds of the access token.|  
|OAuth2ExpiresIn_ImplicitGrant_AuthorizationResponse|RECOMMENDED. The lifetime in seconds of the access token.|  
|OAuth2ExpiresIn_ResourceOwnerPasswordCredentialsGrant_TokenResponse|RECOMMENDED. The lifetime in seconds of the access token.|  
|OAuth2GrantType_AuthorizationCodeGrant_TokenRequest|REQUIRED. Value MUST be set to "authorization_code".|  
|OAuth2GrantType_ClientCredentialsGrant_TokenRequest|REQUIRED. Value MUST be set to "client_credentials".|  
|OAuth2GrantType_ResourceOwnerPasswordCredentialsGrant_TokenRequest|REQUIRED. Value MUST be set to "password".|  
|OAuth2Password_ResourceOwnerPasswordCredentialsGrant_TokenRequest|REQUIRED. The resource owner password.|  
|OAuth2RedirectUri_AuthorizationCodeGrant_AuthorizationRequest|OPTIONAL. The redirection endpoint URI must be an absolute URI.|  
|OAuth2RedirectUri_AuthorizationCodeGrant_TokenRequest|REQUIRED if the "redirect_uri" parameter was included in the authorization request, and their values MUST be identical.|  
|OAuth2RedirectUri_ImplicitGrant_AuthorizationRequest|OPTIONAL. The redirection endpoint URI must be an absolute URI.|  
|OAuth2RefreshToken_AuthorizationCodeGrant_TokenResponse|OPTIONAL. The refresh token, which can be used to obtain new access tokens.|  
|OAuth2RefreshToken_ClientCredentialsGrant_TokenResponse|OPTIONAL. The refresh token, which can be used to obtain new access tokens.|  
|OAuth2RefreshToken_ResourceOwnerPasswordCredentialsGrant_TokenResponse|OPTIONAL. The refresh token, which can be used to obtain new access tokens.|  
|OAuth2ResponseType_AuthorizationCodeGrant_AuthorizationRequest|REQUIRED. Value MUST be set to "code".|  
|OAuth2ResponseType_ImplicitGrant_AuthorizationRequest|REQUIRED. Value MUST be set to "token".|  
|OAuth2Scope_AuthorizationCodeGrant_AuthorizationRequest|OPTIONAL. The scope of the access request.|  
|OAuth2Scope_AuthorizationCodeGrant_TokenResponse|OPTIONAL if identical to the scope requested by the client; otherwise, REQUIRED.|  
|OAuth2Scope_ClientCredentialsGrant_TokenRequest|OPTIONAL. The scope of the access request.|  
|OAuth2Scope_ClientCredentialsGrant_TokenResponse|OPTIONAL, if identical to the scope requested by the client; otherwise, REQUIRED.|  
|OAuth2Scope_ImplicitGrant_AuthorizationRequest|OPTIONAL. The scope of the access request.|  
|OAuth2Scope_ImplicitGrant_AuthorizationResponse|OPTIONAL if identical to the scope requested by the client; otherwise, REQUIRED.|  
|OAuth2Scope_ResourceOwnerPasswordCredentialsGrant_TokenRequest|OPTIONAL. The scope of the access request.|  
|OAuth2Scope_ResourceOwnerPasswordCredentialsGrant_TokenResponse|OPTIONAL, if identical to the scope requested by the client; otherwise, REQUIRED.|  
|OAuth2State_AuthorizationCodeGrant_AuthorizationErrorResponse|REQUIRED if the "state" parameter was present in the client authorization request.  The exact value received from the client.|  
|OAuth2State_AuthorizationCodeGrant_AuthorizationRequest|RECOMMENDED. An opaque value used by the client to maintain state between the request and callback.  The authorization server includes this value when redirecting the user-agent back to the client.  The parameter SHOULD be used for preventing cross-site request forgery.|  
|OAuth2State_AuthorizationCodeGrant_AuthorizationResponse|REQUIRED if the "state" parameter was present in the client authorization request.  The exact value received from the client.|  
|OAuth2State_ImplicitGrant_AuthorizationErrorResponse|REQUIRED if the "state" parameter was present in the client authorization request.  The exact value received from the client.|  
|OAuth2State_ImplicitGrant_AuthorizationRequest|RECOMMENDED. An opaque value used by the client to maintain state between the request and callback.  The authorization server includes this value when redirecting the user-agent back to the client.  The parameter SHOULD be used for preventing cross-site request forgery.|  
|OAuth2State_ImplicitGrant_AuthorizationResponse|REQUIRED if the "state" parameter was present in the client authorization request.  The exact value received from the client.|  
|OAuth2TokenType_AuthorizationCodeGrant_TokenResponse|REQUIRED. The type of the token issued.|  
|OAuth2TokenType_ClientCredentialsGrant_TokenResponse|REQUIRED. The type of the token issued.|  
|OAuth2TokenType_ImplicitGrant_AuthorizationResponse|REQUIRED. The type of the token issued.|  
|OAuth2TokenType_ResourceOwnerPasswordCredentialsGrant_TokenResponse|REQUIRED. The type of the token issued.|  
|OAuth2UserName_ResourceOwnerPasswordCredentialsGrant_TokenRequest|REQUIRED. The resource owner username.|  
|OAuth2UnsupportedTokenType|Token type '{0}' is not supported.|  
|OAuth2InvalidState|Invalid response from authorization server|  
|OAuth2GrantType_AuthorizationCode|Authorization code|  
|OAuth2GrantType_Implicit|Implicit|  
|OAuth2GrantType_ClientCredentials|Client credentials|  
|OAuth2GrantType_ResourceOwnerPassword|Resource owner password|  
|WebDocumentation302Code|302 Found|  
|WebDocumentation400Code|400 (Bad request)|  
|OAuth2SendingMethod_AuthHeader|Authorization header|  
|OAuth2SendingMethod_QueryParam|Query parameter|  
|OAuth2AuthorizationServerGeneralException|An error has occurred while authorizing access via {0}|  
|OAuth2AuthorizationServerCommunicationException|An HTTP connection to authorization server could not be established or it has been unexpectedly closed.|  
|WebDocumentationOAuth2GeneralErrorMessage|Unexpected error occurred.|  
|AuthorizationServerCommunicationException|Authorization server communication exception has happened. Please contact administrator.|  
|TextblockSubscriptionKeyHeaderDescription|Subscription key which provides access to this API. Found in your <a href='/developer'\>Profile</a\>.|  
|TextblockOAuthHeaderDescription|OAuth 2.0 access token obtained from <i\>{0}</i\>. Supported grant types: <i\>{1}</i\>.|  
|TextblockContentTypeHeaderDescription|Media type of the body sent to the API.|  
|ErrorMessageApiNotAccessible|The API you are trying to call is not accessible at this time. Please contact the API publisher <a href="/issues"\>here</a\>.|  
|ErrorMessageApiTimedout|The API you are trying to call is taking longer than normal to get response back. Please contact the API publisher <a href="/issues"\>here</a\>.|  
|BadRequestParameterExpected|"'{0}' parameter is expected"|  
|TooltipTextDoubleClickToSelectAll|Double click to select all.|  
|TooltipTextHideRevealSecret|Show/Hide|  
|ButtonLinkOpenConsole|Try it|  
|SectionHeadingRequestBody|Request body|  
|SectionHeadingRequestParameters|Request parameters|  
|SectionHeadingRequestUrl|Request URL|  
|SectionHeadingResponse|Response|  
|SectionHeadingRequestHeaders|Request headers|  
|FormLabelSubtextOptional|optional|  
|SectionHeadingCodeSamples|Code samples|  
|TextblockOpenidConnectHeaderDescription|OpenID Connect ID token obtained from <i\>{0}</i\>. Supported grant types: <i\>{1}</i\>.|  
  
###  <a name="ErrorPageStrings"></a> ErrorPageStrings  
  
|Name|Text|  
|----------|----------|  
|LinkLabelBack|back|  
|LinkLabelHomePage|home page|  
|LinkLabelSendUsEmail|Send us an e-mail|  
|PageTitleError|Sorry, there was a problem serving the requested page|  
|TextblockPotentialCauseIntermittentIssue|This may be an intermittent data access issue that is already gone.​|  
|TextblockPotentialCauseOldLink|The link you have clicked on may be old and not point to the correct location anymore.​​|  
|TextblockPotentialCauseTechnicalProblem|There may be a technical problem on our end.​|  
|TextblockPotentialSolutionRefresh|Try refreshing the page.​​|  
|TextblockPotentialSolutionStartOver|Start over from our {0}.​|  
|TextblockPotentialSolutionTryAgain|Go {0} and try the action you performed again.|  
|TextReportProblem|{0} describing what went wrong and we will look at it as soon as we can.|  
|TitlePotentialCause|Potential cause|  
|TitlePotentialSolution|It's possibly just a temporary issue, a few things to try|  
  
###  <a name="IssuesStrings"></a> IssuesStrings  
  
|Name|Text|  
|----------|----------|  
|WebIssuesIndexTitle|Issues|  
|WebIssuesNoActiveSubscriptions|You have no active subscriptions. You need to subscribe for a product to report an issue.|  
|WebIssuesNotSignin|You're not signed in. Please {0} to report an issue or post a comment.|  
|WebIssuesReportIssueButton|Report Issue|  
|WebIssuesSignIn|sign in|  
|WebIssuesStatusReportedBy|Status: {0} &#124; Reported by {1}|  
  
###  <a name="NotFoundStrings"></a> NotFoundStrings  
  
|Name|Text|  
|----------|----------|  
|LinkLabelHomePage|home page|  
|LinkLabelSendUsEmail|send us an e-mail|  
|PageTitleNotFound|Sorry, we can’t find the page you are looking for​|  
|TextblockPotentialCauseMisspelledUrl|You may have misspelled the URL if you typed it in.​|  
|TextblockPotentialCauseOldLink|The link you have clicked on may be old and not point to the correct location anymore.|  
|TextblockPotentialSolutionRetype|Try retyping the URL.|  
|TextblockPotentialSolutionStartOver|Start over from our {0}.|  
|TextReportProblem|{0} describing what went wrong and we will look at it as soon as we can.|  
|TitlePotentialCause|Potential cause|  
|TitlePotentialSolution|Potential solution|  
  
###  <a name="ProductDetailsStrings"></a> ProductDetailsStrings  
  
|Name|Text|  
|----------|----------|  
|WebProductsAgreement|By subscribing to {0} Product, I agree to the `<a data-toggle='modal' href='#legal-terms'\>Terms of Use</a\>`.|  
|WebProductsLegalTermsLink|Terms of Use|  
|WebProductsSubscribeButton|Subscribe|  
|WebProductsUsageLimitsHeader|Usage limits|  
|WebProductsYouAreNotSubscribed|You are subscribed to this product.|  
|WebProductsYouRequestedSubscription|You requested subscription to this product.|  
|ErrorYouNeedToAgreeWithLegalTerms|You must agree to the Terms of Use before you can proceed.|  
|ButtonLabelAddSubscription|Add subscription|  
|LinkLabelChangeSubscriptionName|change|  
|ButtonLabelConfirm|Confirm|  
|TextblockMultipleSubscriptionsCount|You have {0} subscriptions to this product:|  
|TextblockSingleSubscriptionsCount|You have {0} subscription to this product:|  
|TextblockSingleApisCount|This product contains {0} API:|  
|TextblockMultipleApisCount|This product contains {0} APIs:|  
|TextblockHeaderSubscribe|Subscribe to product|  
|TextblockSubscriptionDescription|A new subscription will be created as follows:|  
|TextblockSubscriptionLimitReached|Subscriptions limit reached.|  
  
###  <a name="ProductsStrings"></a> ProductsStrings  
  
|Name|Text|  
|----------|----------|  
|PageTitleProducts|Products|  
  
###  <a name="ProviderInfoStrings"></a> ProviderInfoStrings  
  
|Name|Text|  
|----------|----------|  
|TextboxExternalIdentitiesDisabled|Sign in is disabled by the administrators at the moment.|  
|TextboxExternalIdentitiesSigninInvitation|Alternatively, sign in with|  
|TextboxExternalIdentitiesSigninInvitationPrimary|Sign in with:|  
  
###  <a name="SigninResources"></a> SigninResources  
  
|Name|Text|  
|----------|----------|  
|PrincipalNotFound|Principal is not found or signature is invalid|  
|ErrorSsoAuthenticationFailed|SSO authentication failed|  
|ErrorSsoAuthenticationFailedDetailed|Invalid token provided or signature cannot be verified.|  
|ErrorSsoTokenInvalid|SSO token is invalid|  
|ValidationErrorSpecificEmailAlreadyExists|Email '{0}' already registered|  
|ValidationErrorSpecificEmailInvalid|Email '{0}' is invalid|  
|ValidationErrorPasswordInvalid|Password is invalid. Please correct the errors and try again.|  
|PropertyTooShort|{0} is too short|  
|WebAuthenticationAddresserEmailInvalidErrorMessage|Invalid email address.|  
|ValidationMessageNewPasswordConfirmationRequired|Confirm new password|  
|ValidationErrorPasswordConfirmationRequired|Confirm password is empty|  
|WebAuthenticationEmailChangeNotice|Change confirmation email is on the way to {0}. Please follow instructions within it to confirm your new email address. If the email does not arrive to your inbox in the next few minutes, please check your junk email folder.|  
|WebAuthenticationEmailChangeNoticeHeader|Your email change request was successfully processed|  
|WebAuthenticationEmailChangeNoticeTitle|Email change requested|  
|WebAuthenticationEmailHasBeenRevertedNotice|You email already exist. Request has been reverted|  
|ValidationErrorEmailAlreadyExists|Email already exist|  
|ValidationErrorEmailInvalid|Invalid e-mail address|  
|TextboxLabelEmail|Email|  
|ValidationErrorEmailRequired|Email is required.|  
|WebAuthenticationErrorNoticeHeader|Error|  
|WebAuthenticationFieldLengthErrorMessage|{0} must be a maximum length of {1}|  
|TextboxLabelEmailFirstName|First name|  
|ValidationErrorFirstNameRequired|First name is required.|  
|ValidationErrorFirstNameInvalid|Invalid first name|  
|NoticeInvalidInvitationToken|Please note that confirmation links are valid for only 48 hours. If you are still within this timeframe, please make sure your link is correct. If your link has expired, then please repeat the action you're trying to confirm.|  
|NoticeHeaderInvalidInvitationToken|Invalid invitation token|  
|NoticeTitleInvalidInvitationToken|Confirmation error|  
|WebAuthenticationLastNameInvalidErrorMessage|Invalid last name|  
|TextboxLabelEmailLastName|Last name|  
|ValidationErrorLastNameRequired|Last name is required.|  
|WebAuthenticationLinkExpiredNotice|Confirmation link sent to you has expired. `<a href={0}?token={1}>Resend confirmation email.</a\>`|  
|NoticePasswordResetLinkInvalidOrExpired|Your password reset link is invalid or expired.|  
|WebAuthenticationLinkExpiredNoticeTitle|Link sent|  
|WebAuthenticationNewPasswordLabel|New password|  
|ValidationMessageNewPasswordRequired|New password is required.|  
|TextboxLabelNotificationsSenderEmail|Notifications sender email|  
|TextboxLabelOrganizationName|Organization name|  
|WebAuthenticationOrganizationRequiredErrorMessage|Organization name is empty|  
|WebAuthenticationPasswordChangedNotice|Your password was successfully updated|  
|WebAuthenticationPasswordChangedNoticeTitle|Password updated|  
|WebAuthenticationPasswordCompareErrorMessage|Passwords don't match|  
|WebAuthenticationPasswordConfirmLabel|Confirm password|  
|ValidationErrorPasswordInvalidDetailed|Password is too weak.|  
|WebAuthenticationPasswordLabel|Password|  
|ValidationErrorPasswordRequired|Password is required.|  
|WebAuthenticationPasswordResetSendNotice|Change password confirmation email is on the way to {0}. Please follow the instructions within the email to continue your password change process.|  
|WebAuthenticationPasswordResetSendNoticeHeader|Your password reset request was successfully processed|  
|WebAuthenticationPasswordResetSendNoticeTitle|Password reset requested|  
|WebAuthenticationRequestNotFoundNotice|Request not found|  
|WebAuthenticationSenderEmailRequiredErrorMessage|Notifications sender email is empty|  
|WebAuthenticationSigninPasswordLabel|Please confirm the change by entering a password|  
|WebAuthenticationSignupConfirmNotice|Registration confirmation email is on its way to {0}.<br /\> Please follow instructions within the email to activate your account.<br /\> If the email does not arrive in your inbox within the next few minutes, please check your junk email folder.|  
|WebAuthenticationSignupConfirmNoticeHeader|Your account was successfully created|  
|WebAuthenticationSignupConfirmNoticeRepeatHeader|Registration confirmation email was sent again|  
|WebAuthenticationSignupConfirmNoticeTitle|Account created|  
|WebAuthenticationTokenRequiredErrorMessage|Token is empty|  
|WebAuthenticationUserAlreadyRegisteredNotice|It seems a user with this email is already registered in the system. If you forgot your password, please try to restore it or contact our support team.|  
|WebAuthenticationUserAlreadyRegisteredNoticeHeader|User already registered|  
|WebAuthenticationUserAlreadyRegisteredNoticeTitle|Already registered|  
|ButtonLabelChangePassword|Change password|  
|ButtonLabelChangeAccountInfo|Change account information|  
|ButtonLabelCloseAccount|Close account|  
|WebAuthenticationInvalidCaptchaErrorMessage|Text entered doesn't match text on the picture. Please try again.|  
|ValidationErrorCredentialsInvalid|Email or password is invalid. Please correct the errors and try again.|  
|WebAuthenticationRequestIsNotValid|Request is not valid|  
|WebAuthenticationUserIsNotConfirm|Please confirm your registration before attempting to sign in.|  
|WebAuthenticationInvalidEmailFormatted|Email is invalid: {0}|  
|WebAuthenticationUserNotFound|User not found|  
|WebAuthenticationTenantNotRegistered|Your account belongs to a Microsoft Entra tenant which is not authorized to access this portal.|  
|WebAuthenticationAuthenticationFailed|Authentication has failed.|  
|WebAuthenticationGooglePlusNotEnabled|Authentication has failed. If you authorized the application then please contact the admin to make sure that Google authentication is configured correctly.|  
|ValidationErrorAllowedTenantIsRequired|Allowed Tenant is required|  
|ValidationErrorTenantIsNotValid|The Microsoft Entra tenant '{0}' is not valid.|  
|WebAuthenticationActiveDirectoryTitle|Microsoft Entra ID|  
|WebAuthenticationLoginUsingYourProvider|Log in using your {0} account|  
|WebAuthenticationUserLimitNotice|This service has reached the maximum number of allowed users. Please `<a href="mailto:{0}"\>contact the administrator</a\>` to upgrade their service and re-enable user registration.|  
|WebAuthenticationUserLimitNoticeHeader|User registration disabled|  
|WebAuthenticationUserLimitNoticeTitle|User registration disabled|  
|WebAuthenticationUserRegistrationDisabledNotice|Registration of users has been disabled by the administrator. Please login with external identity provider.|  
|WebAuthenticationUserRegistrationDisabledNoticeHeader|User registration disabled|  
|WebAuthenticationUserRegistrationDisabledNoticeTitle|User registration disabled|  
|WebAuthenticationSignupPendingConfirmationNotice|Before we can complete the creation of your account we need to verify your e-mail address. We’ve sent an e-mail to {0}. Please follow the instructions inside the e-mail to activate your account. If the e-mail doesn’t arrive within the next few minutes, please check your junk email folder.|  
|WebAuthenticationSignupPendingConfirmationAccountFoundNotice|We found an unconfirmed account for the e-mail address {0}. To complete the creation of your account we need to verify your e-mail address. We’ve sent an e-mail to {0}. Please follow the instructions inside the e-mail to activate your account. If the e-mail doesn’t arrive within the next few minutes, please check your junk email folder|  
|WebAuthenticationSignupConfirmationAlmostDone|Almost Done|  
|WebAuthenticationSignupConfirmationEmailSent|We’ve sent an e-mail to {0}. Please follow the instructions inside the e-mail to activate your account. If the e-mail doesn’t arrive within the next few minutes, please check your junk email folder.|  
|WebAuthenticationEmailSentNotificationMessage|Email sent successfully to {0}|  
|WebAuthenticationNoAadTenantConfigured|No Microsoft Entra tenant configured for the service.|  
|CheckboxLabelUserRegistrationTermsConsentRequired|I agree to the `<a data-toggle="modal" href="#" data-target="#terms"\>Terms of Use</a\>`.|  
|TextblockUserRegistrationTermsProvided|Please review `<a data-toggle="modal" href="#" data-target="#terms"\>Terms of Use.</a\>`|  
|DialogHeadingTermsOfUse|Terms of Use|  
|ValidationMessageConsentNotAccepted|You must agree to the Terms of Use before you can proceed.|  
  
###  <a name="SigninStrings"></a> SigninStrings  
  
|Name|Text|  
|----------|----------|  
|WebAuthenticationForgotPassword|Forgot your password?|  
|WebAuthenticationIfAdministrator|If you are an Administrator you must sign in `<a href="{0}"\>here</a\>`.|  
|WebAuthenticationNotAMember|Not a member yet? `<a href="/signup"\>Sign up now</a\>`|  
|WebAuthenticationRemember|Remember me on this computer|  
|WebAuthenticationSigininWithPassword|Sign in with your username and password|  
|WebAuthenticationSigninTitle|Sign in|  
|WebAuthenticationSignUpNow|Sign up now|  
  
###  <a name="SignupStrings"></a> SignupStrings  
  
|Name|Text|  
|----------|----------|  
|PageTitleSignup|Sign up|  
|WebAuthenticationAlreadyAMember|Already a member?|  
|WebAuthenticationCreateNewAccount|Create a new API Management account|  
|WebAuthenticationSigninNow|Sign in now|  
|ButtonLabelSignup|Sign up|  
  
###  <a name="SubscriptionListStrings"></a> SubscriptionListStrings  
  
|Name|Text|  
|----------|----------|  
|SubscriptionCancelConfirmation|Are you sure that you want to cancel this subscription?|  
|SubscriptionRenewConfirmation|Are you sure that you want to renew this subscription?|  
|WebDevelopersManageSubscriptions|Manage subscriptions|  
|WebDevelopersPrimaryKey|Primary key|  
|WebDevelopersRegenerateLink|Regenerate|  
|WebDevelopersSecondaryKey|Secondary key|  
|ButtonLabelShowKey|Show|  
|ButtonLabelRenewSubscription|Renew|  
|WebDevelopersSubscriptionRequested|Requested on {0}|  
|WebDevelopersSubscriptionRequestedState|Requested|  
|WebDevelopersSubscriptionTableNameHeader|Name|  
|WebDevelopersSubscriptionTableStateHeader|State|  
|WebDevelopersUsageStatisticsLink|Analytics reports|  
|WebDevelopersYourSubscriptions|Your subscriptions|  
|SubscriptionPropertyLabelRequestedDate|Requested on|  
|SubscriptionPropertyLabelStartedDate|Started on|  
|PageTitleRenameSubscription|Rename subscription|  
|SubscriptionPropertyLabelName|Subscription name|  
  
###  <a name="SubscriptionStrings"></a> SubscriptionStrings  
  
|Name|Text|  
|----------|----------|  
|SectionHeadingCloseAccount|Looking to close your account?|  
|PageTitleDeveloperProfile|Profile|  
|ButtonLabelHideKey|Hide|  
|ButtonLabelRegenerateKey|Regenerate|  
|InformationMessageKeyWasRegenerated|Are you sure that you want to regenerate this key?|  
|ButtonLabelShowKey|Show|  
  
###  <a name="UpdateProfileStrings"></a> UpdateProfileStrings  
  
|Name|Text|  
|----------|----------|  
|ButtonLabelUpdateProfile|Update profile|  
|PageTitleUpdateProfile|Update account information|  
  
###  <a name="UserProfile"></a> UserProfile  
  
|Name|Text|  
|----------|----------|  
|ButtonLabelChangeAccountInfo|Change account information|  
|ButtonLabelChangePassword|Change password|  
|ButtonLabelCloseAccount|Close account|  
|TextboxLabelEmail|Email|  
|TextboxLabelEmailFirstName|First name|  
|TextboxLabelEmailLastName|Last name|  
|TextboxLabelNotificationsSenderEmail|Notifications sender email|  
|TextboxLabelOrganizationName|Organization name|  
|SubscriptionStateActive|Active|  
|SubscriptionStateCancelled|Cancelled|  
|SubscriptionStateExpired|Expired|  
|SubscriptionStateRejected|Rejected|  
|SubscriptionStateRequested|Requested|  
|SubscriptionStateSuspended|Suspended|  
|DefaultSubscriptionNameTemplate|{0}  (default)|  
|SubscriptionNameTemplate|Developer access #{0}|  
|TextboxLabelSubscriptionName|Subscription name|  
|ValidationMessageSubscriptionNameRequired|Subscription name cannot be empty.|  
|ApiManagementUserLimitReached|This service has reached the maximum number of allowed users. Please upgrade to a higher pricing tier.|  
  
##  <a name="glyphs"></a> Glyph resources  
 API Management developer portal templates can use the glyphs from [Glyphicons from Bootstrap](https://getbootstrap.com/components/#glyphicons). This set of glyphs includes over 250 glyphs in font format from the [Glyphicon](https://glyphicons.com/) Halflings set. To use a glyph from this set, use the following syntax.  
  
```html  
<span class="glyphicon glyphicon-user">  
```  
  
 For the complete list of glyphs, see [Glyphicons from Bootstrap](https://getbootstrap.com/components/#glyphicons).

## Next steps
For more information about working with templates, see [How to customize the API Management developer portal using templates](api-management-developer-portal-templates.md).
