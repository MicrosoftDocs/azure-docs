# Using MSAL with B2C

## Recommended Pre-Reading
- [What is Azure Active Directory B2C?](https://docs.microsoft.com/en-us/azure/active-directory-b2c/active-directory-b2c-overview)
- [Android - MSAL: Configuring your app](https://github.com/AzureAD/microsoft-authentication-library-for-android/wiki/Configuring-your-app)

## Configure Known Authorities and Redirect URI
In MSAL for Android, B2C policies (user journeys) are configured as individual authorities.

Suppose we are writing a B2C application that has two policies:
- Sign-up / Sign-in
    * Called `B2C_1_SISOPolicy` in our example
- Edit Profile
    * Called `B2C_1_EditProfile` in our example

In this case, our configuration will declare two `authorities` (one per policy), in addition to our `client_id`, and `redirect_uri`. Note the `type` property of each authority is `B2C`.

### `app/src/main/res/raw/msal_config.json`
```json
{
	"client_id": "<your_client_id_here>",
	"redirect_uri": "<your_redirect_uri_here>",
	"authorities": [{
			"type": "B2C",
			"authority_url": "https://contoso.b2clogin.com/tfp/contoso.onmicrosoft.com/B2C_1_SISOPolicy/",
			"default": true
		},
		{
			"type": "B2C",
			"authority_url": "https://contoso.b2clogin.com/tfp/contoso.onmicrosoft.com/B2C_1_EditProfile/"
		}
	]
}
```

In addition to registering our `redirect_uri` in our app configuration, we must also declare it in our `AndroidManifest.xml` -- this supports redirection during the [authorization code grant flow](https://docs.microsoft.com/en-us/azure/active-directory-b2c/active-directory-b2c-reference-oauth-code).

## Initialize IPublicClientApplication
Construction of `IPublicClientApplication` is handled by a factory method; this is to allow for asynchronous parsing of the application configuration.

```java
PublicClientApplication.create(
    context, // Your application Context
    R.raw.msal_config, // Id of app JSON config
    new IPublicClientApplication.ApplicationCreatedListener() {
        @Override
        public void onCreated(IPublicClientApplication pca) {
            // Application has been initialized.
        }

        @Override
        public void onError(MsalException exception) {
            // Application could not be created.
            // Check Exception message for details.
        }
    }
);
```

## Interactively Acquire a Token
To acquire a token interactively with MSAL, you can build-up your `AcquireTokenParameters` and supply them to `acquireToken`. The request below will use the `default` authority.

```java
IPublicClientApplication pca = ...; // Initialization not shown

AcquireTokenParameters parameters = new AcquireTokenParameters.Builder()
    .startAuthorizationFromActivity(activity)
    .withScopes(Arrays.asList("https://contoso.onmicrosoft.com/contosob2c/read")) // Provide your registered scope here
    .withPrompt(Prompt.LOGIN)
    .callback(new AuthenticationCallback() {
        @Override
        public void onSuccess(IAuthenticationResult authenticationResult) {
            // Token request was successful, inspect the result
        }

        @Override
        public void onError(MsalException exception) {
            // Token request was unsuccessful, inspect the exception
        }

        @Override
        public void onCancel() {
            // The user cancelled the flow
        }
    }).build();

pca.acquireToken(parameters);
```

## Silently Renew a Token
Similar to how the interactive request was built-up using the `AcquireTokenParameters` object, `acquireTokenSilent` has an `AcquireTokenSilentParameters` object that specifies the request properties.


```java
IPublicClientApplication pca = ...; // Initialization not shown
AcquireTokenSilentParameters parameters = new AcquireTokenSilentParameters.Builder()
    .withScopes(Arrays.asList("https://contoso.onmicrosoft.com/contosob2c/read")) // Provide your registered scope here
    .forAccount(account)
    // Select a configured authority (policy), mandatory for silent auth requests
    .fromAuthority("https://contoso.b2clogin.com/tfp/contoso.onmicrosoft.com/B2C_1_SISOPolicy/")
    .callback(new SilentAuthenticationCallback() {
        @Override
        public void onSuccess(IAuthenticationResult authenticationResult) {
            // Token request was successful, inspect the result
        }

        @Override
        public void onError(MsalException exception) {
            // Token request was unsuccesful, inspect the exception
        }
    })
    .build();

pca.acquireTokenSilentAsync(parameters);
```

## Specify a policy
Because policies in B2C are represented as separate authorities, invoking a policy other than the default can be achieved by specifying a `fromAuthority` clause when constructing `acquireToken` or `acquireTokenSilent` parameters.

Example parameters:
```java
AcquireTokenParameters parameters = new AcquireTokenParameters.Builder()
    .startAuthorizationFromActivity(activity)
    .withScopes(Arrays.asList("https://contoso.onmicrosoft.com/contosob2c/read")) // Provide your registered scope here
    .withPrompt(Prompt.LOGIN)
    .callback(...) // provide callback here
    .fromAuthority("<url_of_policy_defined_in_configuration_json>")
    .build();
```

## Handle Password Change Policies
A sign-up or sign-in user flow with local accounts includes a '**Forgot password?**' link on the first page of the experience. Clicking this link does not automatically trigger a password reset user flow.

Instead, the error code `AADB2C90118` is returned to your application. Your application needs to handle this error code by running a specific user flow that resets the password.

To catch a password reset error code, the following implementation can be used inside your `AuthenticationCallback`

```java
new AuthenticationCallback() {

    @Override
    public void onSuccess(IAuthenticationResult authenticationResult) {
        // ..
    }

    @Override
    public void onError(MsalException exception) {
        final String B2C_PASSWORD_CHANGE = "AADB2C90118";

        if (exception.getMessage().contains(B2C_PASSWORD_CHANGE)) {
            // invoke password reset flow
        }
    }

    @Override
    public void onCancel() {
        // ..
    }
}
```

## Using IAuthenticationResult
The result of a successful token aqcquisition is the `IAuthenticationResult` object. It will contain your access token as well as user claims and metadata.

### Getting the Access Token, Related Properties
```java
// Get the raw bearer token
String accessToken = authenticationResult.getAccessToken();

// Get the scopes included in the access token
String[] accessTokenScopes = authenticationResult.getScope();

// Gets the access token's expiry
Date expiry = authenticationResult.getExpiresOn();

// Get the tenant for which this access token was issued
String tenantId = authenticationResult.getTenantId();
```

### Getting the Authorized Account
```java
// Get the account from the result
IAccount account = authenticationResult.getAccount();

// Get the id of this account - note for B2C, the policy name is a part of the id
String id = account.getId();

// Get the IdToken Claims
//
// For more information about B2C token claims, see reference documentation
// https://docs.microsoft.com/en-us/azure/active-directory-b2c/active-directory-b2c-reference-tokens
Map<String, ?> claims = account.getClaims();

// Get the 'preferred_username' claim through a convenience function
String username = account.getUsername();

// Get the tenant id (tid) claim through a convenience function
String tenantId = account.getTenantId();
```

### IdToken Claims
>Please note: Claims returned in the IdToken are populated by the Security Token Service (STS) and not by MSAL. Depending on the identity provider used (IdP), some claims may be absent. Some IdPs do not currently provide the `preferred_username` claim; because this claim is used by MSAL for caching, a placeholder value is used in its place -- this value is `MISSING FROM THE TOKEN RESPONSE`. For more information on B2C IdToken claims please see [Overview of tokens in Azure Active Directory B2C](https://docs.microsoft.com/en-us/azure/active-directory-b2c/active-directory-b2c-reference-tokens#claims).

## Managing Accounts and Policies
 Because B2C treats each policy as a separate authority, the access tokens, refresh tokens, and id tokens returned from each policy are considered logically separate entities. In practical terms, this means that each policy returns a separate `IAccount` object whose tokens cannot be used to invoke other policies.

 In simple terms, each policy adds an `IAccount` to the cache for a given user. If a user signs into an application and invokes two policies, they will have 2 IAccounts. Accordingly, if you wish to remove this user from the cache `removeAccount()` must be called once for each policy (two times). When renewing tokens for a policy with `acquireTokenSilent`, the account provided to the `AcquireTokenSilentParameters` must be the same `IAccount` returned from previous invocations of the policy; providing an account returned by another policy will result in an error.