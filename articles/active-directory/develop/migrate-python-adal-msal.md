# Migrate existing Refresh Tokens into MSAL Python

MSAL is not a low-level OAuth2 library. MSAL actually wraps and hides the concept of Refresh Token (RT) away from you.
So if you started your project with MSAL Python and following its
[3-steps usage pattern](https://github.com/AzureAD/microsoft-authentication-library-for-python/blob/dev/README.md#usage-and-samples)
(specifically, the step 2), you don't even need to know and care about where to store an RT, how to look it up, and when to update it.
MSAL Python just automatically does all the hard work on token caching for you,
and your end user will see minimal amount of sign-in prompt.

But if your existing project was using other OAuth2 libraries (including but not limited to ADAL Python) and your RTs were stored there, and now you want to migrate your project to MSAL Python, you may also want to migrate those RTs into MSAL Python so that your existing end users would not need to sign in again.

Starting from MSAL Python 0.6.0, one of the way to do it,
is to use MSAL Python to acquire a new access token with the previous RT,
and then when a new RT comes back, MSAL will store it in the usual way.
As this method is intended for scenarios that are not typical, it is NOT readily accessible with the official API surface.
You will have to call it via an internal helper `app.client`,
and its naming convention is also slightly different than those other
[official APIs]().

```python
from msal import PublicClientApplication

def get_preexisting_rt_and_their_scopes_from_elsewhere(...):
    raise NotImplementedError("You will need to implement this by yourself")

app = PublicClientApplication(..., token_cache=...)

for old_rt, old_scope in get_preexisting_rt_and_their_scopes_from_elsewhere(...):
    # Assuming the old scope could be a space-delimited string,
    # in MSAL we expect a list, like ["scope1", "scope2"].
    scopes = old_scope.split()
        # If your old RT came from ADAL Python which uses resource rather than scope,
        # you need to somehow convert your v1 resource into v2 scopes
        # See https://docs.microsoft.com/en-us/azure/active-directory/develop/azure-ad-endpoint-comparison#scopes-not-resources
        # You can probably just append "/.default" to your v1 resource to form a scope
        # See https://docs.microsoft.com/en-us/azure/active-directory/develop/v2-permissions-and-consent#the-default-scope

    result = app.client.obtain_token_by_refresh_token(old_rt, scope=scopes)
    # Providing that the above function call would succeed, the new token(s) would be returned,
    # a new RT would be issued by Microsoft Identity platform and be stored in new msal cache.
```

You can also use this method for various integration scenarios where you have a refresh token available.


# Migrate from ADAL Python to MSAL Python

## Differences

If you are already familiar with the Azure AD for developers (v1.0) endpoint (and ADAL Python), you might want to read [What's different about the Microsoft identity platform (v2.0) endpoint?](https://docs.microsoft.com/en-us/azure/active-directory/develop/azure-ad-endpoint-comparison).

## Scopes not resources

ADAL Python acquires tokens for resources, but MSAL Python acquires tokens for scopes. The API surface in MSAL Python does not have resource paramater anymore. You would need to provide scopes as a list of strings that declare the desired permissions and resources that are requested. Well known scopes are the [Microsoft Graph's scopes](https://docs.microsoft.com/en-us/graph/permissions-reference).

## API mapping

| API in ADAL Python  | Roughly maps to API in MSAL Python |
| ------------------- | ---------------------------------- |
| [AuthenticationContext](https://adal-python.readthedocs.io/en/latest/#adal.AuthenticationContext)  | [PublicClientApplication or ConfidentialClientApplication](https://msal-python.readthedocs.io/en/latest/#msal.ClientApplication.__init__)  |
| N/A  | [get_authorization_request_url()](https://msal-python.readthedocs.io/en/latest/#msal.ClientApplication.get_authorization_request_url)  |
| [acquire_token_with_authorization_code()](https://adal-python.readthedocs.io/en/latest/#adal.AuthenticationContext.acquire_token_with_authorization_code) | [acquire_token_by_authorization_code()](https://msal-python.readthedocs.io/en/latest/#msal.ClientApplication.acquire_token_by_authorization_code) |
| [acquire_token()](https://adal-python.readthedocs.io/en/latest/#adal.AuthenticationContext.acquire_token) | [acquire_token_silent()](https://msal-python.readthedocs.io/en/latest/#msal.ClientApplication.acquire_token_silent) |
| [acquire_token_with_refresh_token()](https://adal-python.readthedocs.io/en/latest/#adal.AuthenticationContext.acquire_token_with_refresh_token) | N/A (See the section above) |
| [acquire_user_code()](https://adal-python.readthedocs.io/en/latest/#adal.AuthenticationContext.acquire_user_code) | [initiate_device_flow()](https://msal-python.readthedocs.io/en/latest/#msal.PublicClientApplication.initiate_device_flow) |
| [acquire_token_with_device_code()](https://adal-python.readthedocs.io/en/latest/#adal.AuthenticationContext.acquire_token_with_device_code) and [cancel_request_to_get_token_with_device_code()](https://adal-python.readthedocs.io/en/latest/#adal.AuthenticationContext.cancel_request_to_get_token_with_device_code) | [acquire_token_by_device_flow()](https://msal-python.readthedocs.io/en/latest/#msal.PublicClientApplication.acquire_token_by_device_flow) |
| [acquire_token_with_username_password()](https://adal-python.readthedocs.io/en/latest/#adal.AuthenticationContext.acquire_token_with_username_password) | [acquire_token_by_username_password()](https://msal-python.readthedocs.io/en/latest/#msal.PublicClientApplication.acquire_token_by_username_password) |
| [acquire_token_with_client_credentials()](https://adal-python.readthedocs.io/en/latest/#adal.AuthenticationContext.acquire_token_with_client_credentials) and [acquire_token_with_client_certificate()](https://adal-python.readthedocs.io/en/latest/#adal.AuthenticationContext.acquire_token_with_client_certificate) | [acquire_token_for_client()](https://msal-python.readthedocs.io/en/latest/#msal.ConfidentialClientApplication.acquire_token_for_client) |
| N/A | [acquire_token_on_behalf_of()](https://msal-python.readthedocs.io/en/latest/#msal.ConfidentialClientApplication.acquire_token_on_behalf_of) |
| [TokenCache()](https://adal-python.readthedocs.io/en/latest/#adal.TokenCache) | [SerializableTokenCache()](https://msal-python.readthedocs.io/en/latest/#msal.SerializableTokenCache) |
| N/A | Cache with persistence, available from [MSAL Extensions](https://github.com/marstr/original-microsoft-authentication-extensions-for-python) |
