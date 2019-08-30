# ADAL to MSAL Migration Guide

## Highlights of Changes

The Azure Active Directory Authentication Library (ADAL) was created to operate over the Azure Active Directory v1.0 endpoint.  The Microsoft Authentication Library (MSAL) was created to operate over the Microsoft Identity Platform (formerly known as Azure Active Directory v2.0 endpoint).  

The Microsoft Identity Platform differs from Azure Active Directory v1.0 in that it:

- Supports both:
  - Organizational Identity (Azure Active Directory) and 
  - Non-organizational identity (Microsoft s - outlook.com, xbox live, etc...)
- Is standards compatible:
  - oAuth v2.0
  - OpenID Connect (OIDC)

The public API of MSAL reflects these differences and introduced some important usability changes including:

- AuthenticationContext to PublicClientApplication
  - ADAL provided access to tokens via the AuthenticationContext which represented the server; MSAL instead provides access to methods via a representation of the client.  This means that client developers do not need to create a new instance of the main object for every Authority they need to interact with
  - Although not a singleton only one configuration for your PublicClientApplication should ever be requried.
- Support for requesting access tokens using scopes rather than resource identifiers
- Support for incremental/progressive consent by enabling developers to request scopes (including scopes not included as part of it's app registration)
- Authority Validation -> Known Authorities
- Calling pattern changes:
  - AcquireTokenSilent always results in a silent request that either succeeds or fails
  - AcquireToken always results in an interactive (user prompted with UI) request
  - in ADAL AcquireToken would first attempt to make a silent request and then fallback to an interactive request.  This behavior resulted in some developers solely relying on AcquireToken, which sometimes meant that a user interaction would happen at an unexpected moment.  In MSAL we took the usability change to ensure that the developer is required to be intentional about when their user is prompted.
- MSAL supports interaction via either a default browser or via embedded web view
  - The default is to use the default browser installed;  This allows the library to use authentication state (cookies) that may already be present for one or more signed in accounts.  If not already present the act of authenticating during authorization via MSAL results in authentication state (cookies) being created for the benefit of other web application experiences being accessed in the same browser.
- New Exception Model
  - Attempt to provide better clarity on the type of Exception that occurred and what you as developer need to do to resolve that exception
- MSAL supports parameter objects
- MSAL supports declarative configuration:
  - Client ID, Redirect URI
  - Embedded vs Default Browser
  - Authorities

## Your app registration and migration to MSAL

No changes are required to your existing app registration to use MSAL.  With that said, if you wish to add support for incremental/progressive consent you may need to review it to identify the specific scopes that you want to request incrementally.  More information on scopes and incremental consent below.

In your app registration you will see an "API permissions" tab.  This will provide you a list of the APIs and permissions (scopes) that your app is currently configured to request access to.  It will also show a list of the scope names associated with each API permission.

### User Consent

With ADAL and the AAD v1 endpoint consent by the user to resources that they own was granted on first use.  With MSAL and the Microsoft Identity Platform consent can be requested in an incremental fashion.  Incremental consent is useful for permissions that a user may consider high privilege or may otherwise question if not provided with a clear explanation of why that permission is required.  In ADAL those permissions may have resulted in the user abandoning sign in to your app.

>NOTE: We recommend the use of incremental consent in scenarios where you need to provide additional context to your user about why your app needs the permission that it's requesting.

### Admin Consent

Admins of organizations are able to consent to your application on behalf of all of the members of their organization.  Some organizations only allow admins to consent to applications. Admin consent requires all API permissions and scopes used by your application to be included in your app registration

>NOTE: we recommend that even though you can request a scope using MSAL for something not included in your app registration that you do update your app registration to include all resources and scopes that a user could ever grant permission to.  

## Resource Id to Scopes

### Authenticate and request authorization for all permissions on first use

If you do not need to make use of incremental consent then the simplest way to start using MSAL when you're already using ADAL is to make an acquireToken request using the new AcquireTokenParameter object and setting the resource id value. 

> Note: It's not possible to set both scopes and a resource id.  Attempting to set both will result in an IllegalArgumentException.

 This will result in the same v1 behavior that you are used to where all permissions requested in your app registration will be requested from the end user during their first interaction.
 

### Authenticate and request only permissions (scopes) as needed (incrementally)

In this case you'll need to get the list of actual permissions(scopes) that your app uses from your app registration and then divvy them up according to:

- Which scopes that you wish to request during first interaction (sign in to your app)
- Those permissions which are associated with an important feature in your app that may require explanation of

Once you've divvied up the scopes in this way you'll need to divvy each list up again by which resource (api) you want to request a token for and any other scopes that you wish the user to authorize at the same time.  

When making your request to MSAL the parameters object supports both:

- Scope: The list of scopes that you wish to request authorization for and receive an access token for
- ExtraScopesToConsent: Additional list of scopes that you wish to request authorization for at the same time as you're requesting an access token for another resource

ExtraScopesToConsent allows you to minimize the number of times that you need to request user authorization (prompt your user for their authorization / consent).  

## AuthenticationContext to PublicClientApplications

### PublicClientApplication construction

Using MSAL requires instantiating a PublicClientApplication.  This object models your app identity and is used to make requests to one or more authorities. Via this object you will configure your client identity, redirect URI, default authority, device browser vs. embedded web view, log level, etc....

MSAL provides the ability to declaratively configure this object using JSON either provided as a file during construction or stored as a resource within your APK.

Although this is not a singleton, internally this library makes uses of shared Executors for both interactive and silent requests.

### Business to Business

In ADAL every organization that you needed to request access tokens from required a separate instance of the AuthenticationContext.  In MSAL this is no longer a requirement.  You can simply specify the authority from which you want to request a token as part of your silent or interactive request.

### Authority Validation to Known Authorities

There is no longer a boolean to enable/disable authority validation.  Authority validation was a feature in ADAL and in the first releases of MSAL that prevented your code from requesting tokens from a potentially malicious authority.  MSAL now retrieves a list of authorities known to Microsoft and merges this with the authorities that you've specified via configuration.  

>NOTE: If your are an Azure B2C user this means there is no longer a requirement to disable authority validation.  Simply include each of the your supported Azure AD B2C policies as authorities in your MSAL configuration.

If you attempt to use an authority that is not known to Microsoft and not included in your configuration you will receive an UnknownAuthorityException.

### Logging

>TBD: Look at any changes in logging configuration and/or output

## UserInfo to Account

In ADAL the AuthenticationResult provided you a UserInfo object from which you could retrieve information about the authenticated account.  The term "user" (human or software agent) was being applied in a way that made it difficult to communicate/address the fact that some applications support a single user (human or software agent) having multiple accounts.  The term account itself is problematic, so let's take a moment to explain using an analogy and then extend that analogy to the Microsoft Identity platform.

Most of you are likely familiar with the concept of a bank account.  Many of us have more than one bank  at one or more financial institutions.  When we open an account we (the user) are issued with credentials (ATM Card & PIN) that we can use to access resources (balance, bill payment, etc...) associated with the account.  Those credentials can only be used at the financial institution that issued them.  

Similar to financial institutions accounts in the Microsoft Identity platform are accessed using credentials.  Those credentials are either registered/issued by Microsoft by Microsoft on behalf of an organization.

Where the Microsoft Identity platform differs from financial institutions is that it provides a framework via which a user can use one account and associated credentials to access resources that belong to multiple individuals and organizations.  This would be like using a bank card issued by one bank at another financial institution.  This works because all of the organizations in question are using the Microsoft Identity platform and it allows one account to be used across multiple organizations.  Let's take a look at an example.

Imagine Sam works for contoso.com and is contracted with to manage Azure virtual machines belonging to fabrikam.com.  In order for Sam to perform their virtual machine management responsibilities their  has to be authorized to access that resource.  This is done by adding Sam's account as a member of the fabrikam.com and granting it a role relative to the virtual machines.  This is accomplished via the Azure Portal.  Adding Sam's contoso.com account as a member of Fabrikam.com results in a new record of Sam being created in the Fabrikam.com Azure Active Directory.  That record in Azure Active Directory for Sam is known as a user object and in this case that user object points back to Sam's user object in contoso.com.  Sam's fabrikam user object is the local representation of Sam and is used to store create and store information about the account associated with Sam in the fabrikam.com context.  In contoso.com Sam's title is Senior DevOps Consultant.  In fabrikam Sam's title is Contractor - Virtual Machines.  In contoso.com Sam is not responsible and not authorized to manage virtual machines.  In Fabrikam.com that's his only job function.  Sam still only has one set of credentials to keep track of, the credentials issued by contoso.com.  

Once a successful acquireToken call was made you will see a reference to an IAccount object which can be used in subsequent acquireTokenSilent requests  

### IMultiTenantAccount

For applications that need to access claims regarding an account from each of the tenants in which the account is represented.  You will be able to cast IAccount to IMultiTenantAccount.  This interface will provide a map of ITenantProfiles keyed by tenant id that will allow you access the claims belong to the account in each of the tenants you have requested a token from relative to the current account.

> NOTE: The claims at the root of the IAccount and IMultiTenantAccount always contains the claims from the home tenant.  If you have not yet made a request for a token within the home tenant this collection will be empty.


## Usage Changes

## AuthenticationCallback to new AuthenticationCallback

```java
//Existing ADAL Interface
public interface AuthenticationCallback<T> {

    /**
     * This will have the token info.
     *
     * @param result returns <T>
     */
    void onSuccess(T result);

    /**
     * Sends error information. This can be user related error or server error.
     * Cancellation error is AuthenticationCancelError.
     *
     * @param exc return {@link Exception}
     */
    void onError(Exception exc);
}
```

```java
//New Interface
public interface AuthenticationCallback {

    /**
     * Authentication finishes successfully.
     *
     * @param authenticationResult {@link IAuthenticationResult} that contains the success response.
     */
    void onSuccess(final IAuthenticationResult authenticationResult);

    /**
     * Error occurs during the authentication.
     *
     * @param exception The {@link MsalException} contains the error code, error message and cause if applicable. The exception
     *                  returned in the callback could be {@link MsalClientException}, {@link MsalServiceException} or
     *                  {@link MsalUiRequiredException}.
     */
    void onError(final MsalException exception);

    /**
     * Will be called if user cancels the flow.
     */
    void onCancel();
}
```

## AuthenticationException to MsalException

In ADAL there was one type of Exception: AuthenticationException which included a method of retrieving and ADALError enum value.  In MSAL there is a hierarchy of exceptions, each with their own set of associated specific error codes.  

TODO: Insert hierarchy of Exceptions

MsalException->MsalClientException
MsalException->MsalServiceException
MsalException->UserCancelledException

### ADALError to MsalException ErrorCode

### ADAL Logging to MSAL Logging

```java
//Legacy Interface
public void Log(
                    String tag,
                    String message,
                    String additionalMessage,
                    com.microsoft.aad.adal.Logger.LogLevel level,
                    ADALError errorCode) {
            }

//Need Legacy Log levels
```

```java
//New interface
public void Log()

//New Log Levels:

WARNING
```