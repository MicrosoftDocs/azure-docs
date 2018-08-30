---
title: Azure Active Directory authentication and authorization error codes | Microsoft Docs
description: Learn about the AADSTS error codes that are returned from the Azure AD security token service (STS).
services: active-directory
documentationcenter: ''
author: CelesteDG
manager: mtillman
editor: ''

ms.service: active-directory
ms.component: develop
ms.workload: identity
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: reference
ms.date: 09/24/2018
ms.author: celested
ms.reviewer: hirsin, justhu
ms.custom: aaddev
---

# Authentication and authorization error codes

Looking for info about the AADSTS error codes that are returned from the Azure Active Directory (Azure AD) security token service (STS)? Read this document to find AADSTS error descriptions, fixes, and some suggested workarounds.

> [!NOTE]
> This information is preliminary and subject to change. Have a question or can't find what you're looking for? Create a GitHub issue or see [Support and help options for developers](active-directory-develop-help-support.md) to learn about other ways you can get help and support.

## AADSTS error codes

| Error | Description |
|---|---|
| AADSTS16000 | SelectUserAccount - This is an interrupt thrown by Azure AD, which results in UI that allows the user to select from among multiple valid SSO sessions. This error is fairly common and may be returned to the application if `prompt=none` is specified. |
| AADSTS16001 | UserAccountSelectionInvalid - You'll see this error if the user clicks on a tile that the session select logic has rejected. When triggered, this error allows the user to recover by picking from an updated list of tiles/sessions, or by choosing another account. This error can occur due to a code defect or race condition. |
| AADSTS16002 | AppSessionSelectionInvalid - The app-specified SID requirement was not met.  |
| AADSTS16003 | SsoUserAccountNotFoundInResourceTenant |
| AADSTS17003 | CredentialKeyProvisioningFailed |
| AADSTS20001 | WsFedSignInResponseError - There's an issue with your federated Identity Provider. Contact your IDP to resolve this issue. |
| AADSTS20012 | WsFedMessageInvalid - There's an issue with your federated Identity Provider. Contact your IDP to resolve this issue. |
| AADSTS20033 | FedMetadataInvalidTenantName - There's an issue with your federated Identity Provider. Contact your IDP to resolve this issue. |
| AADSTS40008 | OAuth2IdPUnretryableServerError - There's an issue with your federated Identity Provider. Contact your IDP to resolve this issue. |
| AADSTS40009 | OAuth2IdPRefreshTokenRedemptionUserError - There's an issue with your federated Identity Provider. Contact your IDP to resolve this issue. |
| AADSTS40010 | OAuth2IdPRetryableServerError - There's an issue with your federated Identity Provider. Contact your IDP to resolve this issue. |
| AADSTS40015 | OAuth2IdPAuthCodeRedemptionUserError - There's an issue with your federated Identity Provider. Contact your IDP to resolve this issue. |
| AADSTS50000 | TokenIssuanceError - There's an issue with the sign-in service. [Open a support ticket](../fundamentals/active-directory-troubleshooting-support-howto.md) to resolve this issue. |
| AADSTS50001 | InvalidResource - The resource is disabled or does not exist. Check your app's code to ensure that you have specified the exact resource URL for the resource you are trying to access.  |
| AADSTS50002 | NotAllowedTenant - Sign-in failed due to restricted proxy access on tenant. If it's your own tenant policy, you can change your restricted tenant settings to fix this issue. |
| AADSTS50003 | MissingSigningKey - Sign-in failed due to missing signing key or certificate. This might be because there was no signing key configured in the app. Check out the resolutions outlined at [https://docs.microsoft.com/azure/active-directory/application-sign-in-problem-federated-sso-gallery#certificate-or-key-not-configured](https://docs.microsoft.com/azure/active-directory/application-sign-in-problem-federated-sso-gallery#certificate-or-key-not-configured). If you still see issues, contact the app owner or an app admin. |
| AADSTS50005 | DevicePolicyError - User tried to log in to a device from a platform that's currently not supported through conditional access policy. |
| AADSTS50006 | InvalidSignature - Signature verification failed due to an invalid signature. |
| AADSTS50007 | PartnerEncryptionCertificateMissing - The partner encryption certificate was not found for this app. [Open a support ticket](../fundamentals/active-directory-troubleshooting-support-howto.md) with Microsoft to get this fixed. |
| AADSTS50008 | InvalidSamlToken - SAML assertion is missing or misconfigured in the token. Contact your federation provider. |
| AADSTS50010 | AudienceUriValidationFailed - Audience URI validation for the app failed since no token audiences were configured. |
| AADSTS50011 | InvalidReplyTo - The reply address is missing, misconfigured, or does not match reply addresses configured for the app. Try out the resolution listed at [https://docs.microsoft.com/azure/active-directory/application-sign-in-problem-federated-sso-gallery#the-reply-address-does-not-match-the-reply-addresses-configured-for-the-application](https://docs.microsoft.com/azure/active-directory/application-sign-in-problem-federated-sso-gallery#the-reply-address-does-not-match-the-reply-addresses-configured-for-the-application). If you still see issues, contact the app owner or app admin. |
| AADSTS50012 | AuthenticationFailed - Authentication failed for one of the following reasons:<ul><li>The subject name of the signing certificate is not authorized</li><li>A matching trusted authority policy was not found for the authorized subject name</li><li>The certificate chain is not valid</li><li>The signing certificate is not valid</li><li>Policy is not configured on the tenant</li><li>Thumbprint of the signing certificate is not authorized</li><li>Client assertion contains an invalid signature</li></ul> |
| AADSTS50013 | InvalidAssertion - Assertion is invalid because of various reasons - The token issuer doesn't match the api version within its valid time range -expired -malformed - Refresh token in the assertion is not a primary refresh token. |
| AADSTS50014 | GuestUserInPendingState |
| AADSTS50015 | ViralUserLegalAgeConsentRequiredState |
| AADSTS50017 | CertificateValidationFailed - Certification validation failed, reasons for the following reasons:<ul><li>Cannot find issuing certificate in trusted certificates list</li><li>Unable to find expected CrlSegment</li><li>Cannot find issuing certificate in trusted certificates list</li><li>Delta CRL distribution point is configured without a corresponding CRL distribution point</li><li>Unable to retrieve valid CRL segments due to timeout issue</li><li>Unable to download CRL</li></ul>Contact the tenant admin. |
| AADSTS50020 | UserUnauthorized - Users are unauthorized to call this endpoint. |
| AADSTS50027 | InvalidJwtToken - Invalid JWT token due to the following reasons:<ul><li>doesn't contain nonce claim, sub claim</li><li>subject identifier mismatch</li><li>duplicate claim in idToken claims</li><li>unexpected issuer</li><li>unexpected audience</li><li>not within its valid time range </li><li>token format is not proper</li><li>External ID token from issuer failed signature verification.</li></ul> |
| AADSTS50029 | Invalid URI - domain name contains invalid characters. Contact the tenant admin. |
| AADSTS50032 | WeakRsaKey - Indicates the erroneous user attempt to use a weak RSA key. |
| AADSTS50033 | RetryableError - Indicates a transient error not related to the database operations. |
| AADSTS50034 | UserAccountNotFound - To sign into this application, the account must be added to the directory. |
| AADSTS50042 | UnableToGeneratePairwiseIdentifierWithMissingSalt - The salt required to generate a pairwise identifier is missing in principal. Contact the tenant admin. |
| AADSTS50043 | UnableToGeneratePairwiseIdentifierWithMultipleSalts |
| AADSTS50048 | SubjectMismatchesIssuer - Subject mismatches Issuer claim in the client assertion. Contact the tenant admin. |
| AADSTS50049 | NoSuchInstanceForDiscovery - Unknown or invalid instance. |
| AADSTS50050 | MalformedDiscoveryRequest - Request is malformed. |
| AADSTS50053 | IdsLocked - The account is locked because the user tried to sign in too many times with an incorrect user ID or password. |
| AADSTS50055 | InvalidPasswordExpiredPassword - The password is expired. |
| AADSTS50056 | Invalid or null password -Password does not exist in store for this user. |
| AADSTS50057 | UserDisabled - The user account is disabled. The account has been disabled by an administrator. |
| AADSTS50058 | UserInformationNotProvided - This means that a user is not signed in. This is a very common error that's expected when a user is unauthenticated and has not yet signed in.</br>If this error is encouraged in an SSO context where the user has just previously signed in, this means that the SSO session was either not found or invalid.</br>This error may be returned to the application if prompt=none is specified. |
| AADSTS50059 | MissingTenantRealmAndNoUserInformationProvided - Tenant-identifying information was not found in either the request or implied by any provided credentials. The user can contact the tenant admin to help resolve the issue. |
| AADSTS50061 | SignoutInvalidRequest - Sign-out request is invalid. |
| AADSTS50064 | CredentialAuthenticationError |
| AADSTS50068 | SignoutInitiatorNotParticipant |
| AADSTS50070 | SignoutUnknownSessionIdentifier |
| AADSTS50071 | SignoutMessageExpired |
| AADSTS50072 | UserStrongAuthEnrollmentRequiredInterrupt - User needs to enroll for second factor authentication (interactive). |
| AADSTS50074 | UserStrongAuthClientAuthNRequiredInterrupt - Strong authentication is required and the user did not pass the MFA challenge. |
| AADSTS50076 | UserStrongAuthClientAuthNRequired - The user must use multi-factor authentication to access this resource. Retry with a new authorize request for the resource. |
| AADSTS50079 | UserStrongAuthEnrollmentRequired - Due to a configuration change made by the administrator, or because the user moved to a new location, the user is required to use multi-factor authentication. |
| AADSTS50085 | Refresh token needs social IDP login. Have user try signing-in again with username -password |
| AADSTS50086 | SasNonRetryableError |
| AADSTS50087 | SasRetryableError |
| AADSTS50089 | Flow token expired - Authentication Failed. Have user try signing-in again with username -password |
| AADSTS50097 | DeviceAuthenticationRequired - Device authentication is required. |
| AADSTS50099 | PKeyAuthInvalidJwtUnauthorized - The JWT signature is invalid. |
| AADSTS50105 | EntitlementGrantsNotFound - The signed in user is not assigned to a role for the signed in app. Assign the user  to the app. For more information:[https://docs.microsoft.com/azure/active-directory/application-sign-in-problem-federated-sso-gallery#user-not-assigned-a-role](https://docs.microsoft.com/azure/active-directory/application-sign-in-problem-federated-sso-gallery#user-not-assigned-a-role). |
| AADSTS50107 | InvalidRealmUri - The requested federation realm object does not exist. Contact the tenant admin. |
| AADSTS50120 | ThresholdJwtInvalidJwtFormat - Issue with JWT header. Contact the tenant admin. |
| AADSTS50124 | ClaimsTransformationInvalidInputParameter - Claims Transformation contains invalid input parameter. Contact the tenant admin to update the policy. |
| AADSTS50125 | PasswordResetRegistrationRequiredInterrupt - Sign-in was interrupted due to a password reset or password registration entry. |
| AADSTS50126 | InvalidUserNameOrPassword - Error validating credentials due to invalid username or password. |
| AADSTS50127 | BrokerAppNotInstalled - User needs to install a broker app to gain access to this content. |
| AADSTS50128 | Invalid domain name - No tenant-identifying information found in either the request or implied by any provided credentials|
| AADSTS50129 | DeviceIsNotWorkplaceJoined - Workplace join is required to register the device. |
| AADSTS50131 | ConditionalAccessFailed - Indicates various conditional access errors such as bad Windows device state, request blocked due to suspicious activity, access policy, or security policy decisions. |
| AADSTS50132 | SsoArtifactInvalidOrExpired - The session is not valid due to password expiration or recent password change. |
| AADSTS50133 | SsoArtifactRevoked - The session is not valid due to password expiration or recent password change. |
| AADSTS50134 | DeviceFlowAuthorizeWrongDatacenter |
| AADSTS50135 | PasswordChangeCompromisedPassword - Password change is required due to account risk. |
| AADSTS50136 | RedirectMsaSessionToApp - Single MSA session detected. |
| AADSTS50139 | SessionMissingMsaOAuth2RefreshToken |
| AADSTS50140 | KmsiInterrupt - This error occurred due to "Keep me signed in" interrupt when the user was signing-in. [Open a support ticket](../fundamentals/active-directory-troubleshooting-support-howto.md) with Correlation ID, Request ID, and Error code to get more details. |
| AADSTS50143 | Session mismatch - Session is invalid because user tenant does not match the domain hint due to different resource. [Open a support ticket](../fundamentals/active-directory-troubleshooting-support-howto.md) with Correlation ID, Request ID, and Error code to get more details. |
| AADSTS50144 | InvalidPasswordExpiredOnPremPassword - User's Active Directory password has expired. Generate a new password for the user or have the user use the self-service reset tool to reset their password. |
| AADSTS50146 | MissingCustomSigningKey - This app is required to be configured with an app-specific signing key. It is either not configured with one, or the key has expired or is not yet valid. |
| AADSTS50147 | MissingCodeChallenge |
| AADSTS50155 | DeviceAuthenticationFailed - Device authentication failed for this user. |
| AADSTS50158 | ExternalSecurityChallenge - External security challenge was not satisfied. |
| AADSTS50161 | InvalidExternalSecurityChallengeConfiguration - Claims sent by external provider is not enough or Missing claim requested to external provider. |
| AADSTS50166 | ExternalClaimsProviderThrottled - Failed to send request to claims provider. |
| AADSTS50168 | ChromeBrowserSsoInterruptRequired - The client is capable of obtaining an SSO token through the Windows 10 Accounts extension, but the token was not found in the request or the supplied token was expired. |
| AADSTS50169 | InvalidRequestBadRealm - The realm is not a configured realm of the current service namespace. |
| AADSTS50170 | MissingExternalClaimsProviderMapping |
| AADSTS50177 | ExternalChallengeNotSupportedForPassthroughUsers - External challenge is not supported for passthrough users. |
| AADSTS50178 | SessionControlNotSupportedForPassthroughUsers - Session control is not supported for passthrough users. |
| AADSTS50180 | WindowsIntegratedAuthMissing - Integrated Windows authentication is needed. Enable the tenant for Seamless SSO. |
| AADSTS50187 | DeviceInformationNotProvided |
| AADSTS51000 | RequiredFeatureNotEnabled |
| AADSTS51001 | DomainHintMustbePresent - Domain hint must be present with on-premises security identifier or on-premises UPN. |
| AADSTS51004 | UserAccountNotInDirectory - The user account doesn’t exist in the directory. |
| AADSTS51005 | TemporaryRedirect - Equivalent to HTTP status 307, which indicates that the requested information is located at the URI specified in the location header. When you receive this status, follow the location header associated with the response. When the original request method was POST, the redirected request will also use the POST method. |
| AADSTS51006 | ForceReauthDueToInsufficientAuth - Integrated Windows authentication is needed. User logged in using a session token that is missing the Integrated Windows authentication claim. Request the  user to log in again. |
| AADSTS52004 | DelegationDoesNotExistForLinkedIn - The user has not provided consent for access to LinkedIn resources. |
| AADSTS53000 | DeviceNotCompliant - Conditional access policy requires a compliant device, and the device is not compliant. The user must enroll their device with an approved MDM provider like Intune. |
| AADSTS53001 | DeviceNotDomainJoined - Conditional access policy requires a domain joined device, and the device is not domain joined. Have the user use a domain joined device. |
| AADSTS53002 | ApplicationUsedIsNotAnApprovedApp - The app used is not an approved app for conditional access. User needs to use one of the apps from the list of approved apps to use in order to get access. |
| AADSTS53003 | BlockedByConditionalAccess - Access has been blocked by conditional access policies. The access policy does not allow token issuance. |
| AADSTS53004 | ProofUpBlockedDueToRisk - User needs to complete the multi-factor authentication registration process before accessing this content. User should register for multi-factor authentication. |
| AADSTS54000 | MinorUserBlockedLegalAgeGroupRule |
| AADSTS65001 | DelegationDoesNotExist - The user or administrator has not consented to use the application with ID X. Send an interactive authorization request for this user and resource. |
| AADSTS65004 | UserDeclinedConsent - User declined to consent to access the app. Have the user retry the sign-in and consent to the app|
| AADSTS65005 | MisconfiguredApplication - The app required resource access list does not contain apps discoverable by the resource or The client app has requested access to resource, which was not specified in its required resource access list or Graph service returned bad request or resource not found. If the app supports SAML, you may have configured the app with the wrong Identifier (Entity). Try out the resolution listed for SAML using the link below: [https://docs.microsoft.com/azure/active-directory/application-sign-in-problem-federated-sso-gallery#no-resource-in-requiredresourceaccess-list](https://docs.microsoft.com/azure/active-directory/application-sign-in-problem-federated-sso-gallery?/?WT.mc_id=DMC_AAD_Manage_Apps_Troubleshooting_Nav#no-resource-in-requiredresourceaccess-list) |
| AADSTS67003 | ActorNotValidServiceIdentity |
| AADSTS70000 | InvalidGrant - Authentication failed. The refresh token is not valid. Error may be due to the following reasons:<ul><li>Token binding header is empty</li><li>Token binding hash does not match</li></ul> |
| AADSTS70001 | UnauthorizedClient - The application is disabled. |
| AADSTS70002 | InvalidClient - Error validating the credentials. The specified client_secret does not match the expected value for this client. Correct the client_secret and try again. For more info, see [Use the authorization code to request an access token](v1-protocols-oauth-code.md#use-the-authorization-code-to-request-an-access-token). |
| AADSTS70003 | UnsupportedGrantType - The app returned an unsupported grant type. |
| AADSTS70004 | InvalidRedirectUri - The app returned an invalid redirect URI. The redirect address specified by the client does not match any configured addresses or any addresses on the OIDC approve list. |
| AADSTS70005 | UnsupportedResponseType - The app returned an unsupported response type due to the following reasons:<ul><li>response type 'token' is not enabled for the app</li><li>response type 'id_token' requires the 'OpenID' scope -contains an unsupported OAuth parameter value in the encoded wctx</li></ul> |
| AADSTS70007 | UnsupportedResponseMode - The app returned an unsupported value of `response_mode` when requesting a token.  |
| AADSTS70008 | ExpiredOrRevokedGrant - The refresh token has expired due to inactivity. The token was issued on XXX and was inactive for a certain amount of time. |
| AADSTS70011 | InvalidScope - The scope requested by the app is invalid. |
| AADSTS70012 | MsaServerError - A server error occurred while authenticating an MSA (consumer) user. Please retry. If it continues to fail, [open a support ticket](../fundamentals/active-directory-troubleshooting-support-howto.md) |
| AADSTS70016 | AuthorizationPending - OAuth 2.0 device flow error. Authorization is pending. The device will retry polling the request. |
| AADSTS70018 | BadVerificationCode - Invalid verification code due to User typing in wrong user code for device code flow. Authorization is not approved. |
| AADSTS70019 | CodeExpired - Verification code expired. Have the user retry the sign-in. |
| AADSTS75001 | BindingSerializationError - An error occurred during SAML message binding. |
| AADSTS75003 | UnsupportedBindingError - The app returned an error related to unsupported binding (SAML protocol response cannot be sent via bindings other than HTTP POST). |
| AADSTS75005 | Saml2MessageInvalid - Azure AD doesn’t support the SAML request sent by the app for SSO. |
| AADSTS75008 | RequestDeniedError - The request from the app was denied since the SAML request had an unexpected destination. |
| AADSTS75011 | NoMatchedAuthnContextInOutputClaims - The authentication method by which the user authenticated with the service doesn't match requested authentication method. |
| AADSTS75016 | Saml2AuthenticationRequestInvalidNameIDPolicy - SAML2 Authentication Request has invalid NameIdPolicy. |
| AADSTS80001 | OnPremiseStoreIsNotAvailable - The Authentication Agent is unable to connect to Active Directory. Make sure that agent servers are members of the same AD forest as the users whose passwords need to be validated and they are able to connect to Active Directory. |
| AADSTS80002 | OnPremisePasswordValidatorRequestTimedout - Password validation request timed out. Make sure that Active Directory is available and responding to requests from the agents. |
| AADSTS80005 | OnPremisePasswordValidatorUnpredictableWebException - An unknown error occurred while processing the response from the Authentication Agent. Retry the request. If it continues to fail, [open a support ticket](../fundamentals/active-directory-troubleshooting-support-howto.md) to get more details on the error. |
| AADSTS80007 | OnPremisePasswordValidatorErrorOccurredOnPrem - The Authentication Agent is unable to validate user's password. Check the agent logs for more info and verify that Active Directory is operating as expected. |
| AADSTS80010 | OnPremisePasswordValidationEncryptionException - The Authentication Agent is unable to decrypt password. |
| AADSTS80012 | OnPremisePasswordValidationAccountLogonInvalidHours - The users attempted to log on outside of the allowed hours (this is specified in AD). |
| AADSTS80013 | OnPremisePasswordValidationTimeSkew - The authentication attempt could not be completed due to time skew between the machine running the authentication agent and AD. Fix time sync issues. |
| AADSTS81004 | DesktopSsoIdentityInTicketIsNotAuthenticated - Kerberos authentication attempt failed. |
| AADSTS81005 | DesktopSsoAuthenticationPackageNotSupported - The authentication package is not supported. |
| AADSTS81006 | DesktopSsoNoAuthorizationHeader - No authorization header was found. |
| AADSTS81007 | DesktopSsoTenantIsNotOptIn - The tenant is not enabled for Seamless SSO. |
| AADSTS81009 | DesktopSsoAuthorizationHeaderValueWithBadFormat - Unable to validate user's Kerberos ticket. |
| AADSTS81010 | DesktopSsoAuthTokenInvalid - Seamless SSO failed because the user's Kerberos ticket has expired or is invalid. |
| AADSTS81011 | DesktopSsoLookupUserBySidFailed - Unable to find user object based on information in the user's Kerberos ticket. |
| AADSTS81012 | DesktopSsoMismatchBetweenTokenUpnAndChosenUpn - The user trying to sign in to Azure AD is different from the user signed into the device. |
| AADSTS90002 | InvalidTenantName - The tenant name wasn't found in the data store. Check to make sure you have the correct tenant ID. |
| AADSTS90004 | InvalidRequestFormat |
| AADSTS90005 | InvalidRequestWithMultipleRequirements |
| AADSTS90006 | ExternalServerRetryableError |
| AADSTS90007 | InvalidSessionId |
| AADSTS90008 | TokenForItselfRequiresGraphPermission |
| AADSTS90009 | TokenForItselfMissingIdenticalAppIdentifier |
| AADSTS90010 | NotSupported |
| AADSTS90012 | RequestTimeout |
| AADSTS90013 | InvalidUserInput |
| AADSTS90014 | MissingRequiredField - This error code may appear in various cases when an expected field is not present in the credential. |
| AADSTS90015 | QueryStringTooLong |
| AADSTS90016 | MissingRequiredClaim |
| AADSTS90019 | MissingTenantRealm - Azure AD was unable to determine the tenant identifier from the request. |
| AADSTS90022 | AuthenticatedInvalidPrincipalNameFormat - The principal name format is not valid, or does not meet the expected `name[/host][@realm]` format. The principal name is required, host and realm are optional and may be set to null. |
| AADSTS90023 | InvalidRequest |
| AADSTS90024 | RequestBudgetExceededError |
| AADSTS90033 | MsodsServiceUnavailable |
| AADSTS90036 | MsodsServiceUnretryableFailure |
| AADSTS90038 | NationalCloudTenantRedirection - The specified tenant 'Y' belongs to the National Cloud 'X'. Current cloud instance 'Z' does not federate with X. A cloud redirect error is returned. |
| AADSTS90043 | NationalCloudAuthCodeRedirection |
| AADSTS90051 | InvalidNationalCloudId |
| AADSTS90055 | TenantThrottlingError - There are too many incoming requests. This exception is thrown for blocked tenants. |
| AADSTS90056 | BadResourceRequest - To redeem the code for an access token, the app should send a POST request to the `/token` endpoint. Also, prior to this, you should provide an authorization code and send it in the POST request to the `/token` endpoint. Refer to this article for an overview of OAuth 2.0 authorization code flow: [https://docs.microsoft.com/azure/active-directory/develop/active-directory-protocols-oauth-code](https://docs.microsoft.com/azure/active-directory/develop/active-directory-protocols-oauth-code). You must first direct the user to the `/authorize` endpoint, which will return an authorization_code. By posting a request to the `/token` endpoint, the user gets the access token. Log in the Azure portal, and check **App registrations > Endpoints** to confirm that the two endpoints were configured correctly. |
| AADSTS90072 | PassThroughUserMfaError |
| AADSTS90081 | OrgIdWsFederationMessageInvalid |
| AADSTS90082 | OrgIdWsFederationNotSupported |
| AADSTS90084 | OrgIdWsFederationGuestNotAllowed |
| AADSTS90085 | OrgIdWsFederationSltRedemptionFailed |
| AADSTS90086 | OrgIdWsTrustDaTokenExpired |
| AADSTS90087 | OrgIdWsFederationMessageCreationFromUriFailed |
| AADSTS90090 | GraphRetryableError |
| AADSTS90091 | GraphServiceUnreachable |
| AADSTS90092 | GraphNonRetryableError |
| AADSTS90093 | GraphUserUnauthorized - Graph returned with a forbidden error code for the request. |
| AADSTS90094 | AdminConsentRequired |
| AADSTS90100 | InvalidRequestParameter |
| AADSTS90101 | InvalidEmailAddress |
| AADSTS90102 | InvalidUriParameter |
| AADSTS90107 | InvalidXml |
| AADSTS90114 | InvalidExpiryDate |
| AADSTS90117 | InvalidRequestInput |
| AADSTS90119 | InvalidUserCode |
| AADSTS90120 | InvalidDeviceFlowRequest |
| AADSTS90121 | InvalidEmptyRequest |
| AADSTS90123 | IdentityProviderAccessDenied |
| AADSTS90124 | V1ResourceV2GlobalEndpointNotSupported |
| AADSTS90125 | DebugModeEnrollTenantNotFound |
| AADSTS90126 | DebugModeEnrollTenantNotInferred |
| AADSTS90130 | NonConvergedAppV2GlobalEndpointNotSupported |
| AADSTS120000 | PasswordChangeIncorrectCurrentPassword |
| AADSTS120002 | PasswordChangeInvalidNewPasswordWeak |
| AADSTS120003 | PasswordChangeInvalidNewPasswordContainsMemberName |
| AADSTS120004 | PasswordChangeOnPremComplexity |
| AADSTS120005 | PasswordChangeOnPremSuccessCloudFail |
| AADSTS120008 | PasswordChangeAsyncJobStateTerminated |
| AADSTS120011 | PasswordChangeAsyncUpnInferenceFailed |
| AADSTS120012 | PasswordChangeNeedsToHappenOnPrem |
| AADSTS120013 | PasswordChangeOnPremisesConnectivityFailure |
| AADSTS120014 | PasswordChangeOnPremUserAccountLockedOutOrDisabled |
| AADSTS120015 | PasswordChangeADAdminActionRequired |
| AADSTS120016 | PasswordChangeUserNotFoundBySspr |
| AADSTS120018 | PasswordChangePasswordDoesnotComplyFuzzyPolicy |
| AADSTS120020 | PasswordChangeFailure |
| AADSTS120021 | PartnerServiceSsprInternalServiceError |
| AADSTS130004 | NgcKeyNotFound |
| AADSTS130005 | NgcInvalidSignature |
| AADSTS130006 | NgcTransportKeyNotFound |
| AADSTS130007 | NgcDeviceIsDisabled |
| AADSTS130008 | NgcDeviceIsNotFound |
| AADSTS135010 | KeyNotFound |
| AADSTS140000 | InvalidRequestNonce |
| AADSTS140001 | InvalidSessionKey |
| AADSTS165000 | InvalidRequestCanary |
| AADSTS165004 | InvalidApiCanary |
| AADSTS165900 | InvalidApiRequest |
| AADSTS220450 | UnsupportedAndroidWebViewVersion |
| AADSTS220501 | InvalidCrlDownload |
| AADSTS221000 | DeviceOnlyTokensNotSupportedByResource - The resource is not configured to accept device-only tokens. |
| AADSTS240001 | BulkAADJTokenUnauthorized |
| AADSTS240002 | RequiredClaimIsMissing |
| AADSTS700020 | InteractionRequired |
| AADSTS700022 | InvalidMultipleResroucesScope |
| AADSTS700023 | InvalidResourcelessScope |
| AADSTS900000 | WebWatsonEnvironmentError |
| AADSTS1000000 | UserNotBoundError |
| AADSTS1000002 | BindCompleteInterruptError |

## Next steps

* Have a question or can't find what you're looking for? Create a GitHub issue or see [Support and help options for developers](active-directory-develop-help-support.md) to learn about other ways you can get help and support.