<properties
	pageTitle="Changes to the Azure AD v2.0 endpoint | Microsoft Azure"
	description="A description of changes that are being made to the app model v2.0 public preview protocols."
	services="active-directory"
	documentationCenter=""
	authors="dstrockis"
	manager="mbaldwin"
	editor=""/>

<tags
	ms.service="active-directory"
	ms.workload="identity"
	ms.tgt_pltfrm="na"
	ms.devlang="na"
	ms.topic="article"
	ms.date="05/31/2016"
	ms.author="dastrock"/>

# Important Updates to the v2.0 Authentication Protocols
Attention developers! Over the next two weeks, we will be making a few updates to our v2.0 authentication protocols that may mean breaking changes for any apps you have written during our preview period.  

## Who does this affect?
Any apps that have been written to use the v2.0 converged authentication endpoint,

```
https://login.microsoftonline.com/common/oauth2/v2.0/authorize
```

More information on the v2.0 endpoint can be found [here](active-directory-appmodel-v2-overview.md).

If you have built an app using the v2.0 endpoint by coding directly to the v2.0 protocol, using any of our OpenID Connect or OAuth web middlewares, or using other 3rd party libraries to perform authentication, you should be prepared to test your projects and make changes if necessary.

## Who doesn`t this affect?
Any apps that have been written against the production Azure AD authentication endpoint,

```
https://login.microsoftonline.com/common/oauth2/authorize
```

This protocol is set in stone and will not be experiencing any changes.

Furthermore, if your app **only** uses our ADAL library to perform authentication, you won`t have to change anything.  ADAL has shielded your app from the changes.  

## What are the changes?
### Removing the x5t value from JWT headers
The v2.0 endpoint uses JWT tokens extensively, which contain a header parameters section with relevant metadata about the token.  If you decode the header of one of our current JWTs, you would find something like:

```
{ 
	"type": "JWT",
	"alg": "RS256",
	"x5t": "MnC_VZcATfM5pOYiJHMba9goEKY",
	"kid": "MnC_VZcATfM5pOYiJHMba9goEKY"
}
```

Where both the "x5t" and "kid" properties identify the public key that should be used to validate the token`s signature, as retrieved from the OpenID Connect metadata endpoint.

The change we are making here is to remove the "x5t" property.  You may continue to use the same mechanisms to validate tokens, but should rely only on the "kid" property to retrieve the correct public key, as specified in the OpenID Connect protocol. 

> [AZURE.IMPORTANT] **Your job: Make sure your app does not depend on the existence of the x5t value.**

### Removing profile_info
Previously, the v2.0 endpoint has been returning a base64 encoded JSON object in token responses called `profile_info`.  When requesting an access token from the v2.0 endpoint by sending a request to:

```
https://login.microsoftonline.com/common/oauth2/v2.0/token
```

The response would look like the following JSON object:
```
{ 
	"token_type": "Bearer",
	"expires_in": 3599,
	"scope": "https://outlook.office.com/mail.read",
	"access_token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsI...",
	"refresh_token": "OAAABAAAAiL9Kn2Z27UubvWFPbm0gL...",
	"profile_info": "eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsI...",
}
```

The `profile_info` value contained information about the user who signed into the app - their display name, first name, surname, email address, identifier, and so on.  Primarily, the `profile_info` was used for token caching and display purposes.

We are now removing the `profile_info` value – but don't worry, we are still providing this information to developers in a slightly different place.  Instead of `profile_info`, the v2.0 endpoint will now return an `id_token` in each token response:

```
{ 
	"token_type": "Bearer",
	"expires_in": 3599,
	"scope": "https://outlook.office.com/mail.read",
	"access_token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsI...",
	"refresh_token": "OAAABAAAAiL9Kn2Z27UubvWFPbm0gL...",
	"id_token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsI...",
}
```

You may decode and parse the id_token to retrieve the same information that you received from profile_info.  The id_token is a JSON Web Token (JWT), with contents as specified by OpenID Connect.  The code for doing so should be very similar – you simply need to extract the middle segment (the body) of the id_token and base64 decode it to access the JSON object within.

Over the next two weeks, you should code your app to retrieve the user information from either the `id_token` or `profile_info`; whichever is present.  That way when the change is made, your app can seamlessly handle the transition from `profile_info` to `id_token` without interruption.

> [AZURE.IMPORTANT] **Your job: Make sure your app does not depend on the existence of the `profile_info` value.**

### Removing id_token_expires_in
Similar to `profile_info`, we are also removing the `id_token_expires_in` parameter from responses.  Previously, the v2.0 endpoint would return a value for `id_token_expires_in` along with each id_token response, for instance in an authorize response:

```
https://myapp.com?id_token=eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsI...&id_token_expires_in=3599...
```

Or in a token response:

```
{ 
	"token_type": "Bearer",
	"id_token_expires_in": 3599,
	"scope": "openid",
	"id_token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsI...",
	"refresh_token": "OAAABAAAAiL9Kn2Z27UubvWFPbm0gL...",
	"profile_info": "eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsI...",
}
```

The `id_token_expires_in` value would indicate the number of seconds the id_token would remain valid for.  Now, we are removing the `id_token_expires_in` value completely.  Instead, you may use the OpenID Connect standard `nbf` and `exp` claims to examine the validity of an id_token.  See the [v2.0 token reference](active-directory-v2-tokens.md) for more information on these claims.

> [AZURE.IMPORTANT] **Your job: Make sure your app does not depend on the existence of the `id_token_expires_in` value.**


### Changing the claims returned by scope=openid
This change will be the most significant – in fact, it will affect almost every app that uses the v2.0 endpoint.  Many applications send requests to the v2.0 endpoint using the `openid` scope, like:

```
https://login.microsoftonline.com/common/oauth2/v2.0/authorize?
client_id=...
&redirect_uri=...
&response_mode=form_post
&response_type=id_token
&scope=openid offline_access https://outlook.office.com/mail.read
```

Today, when the user grants consent for the `openid` scope, your app receives a wealth of information about the user in the resulting id_token.  These claims can include their name, preferred username, email address, object ID, and more.

In this update, we are changing the information that the `openid` scope affords your app access to, to better comform with the OpenID Connect specification.  The `openid` scope will only allow your app to sign the user in, and receive an app-specific identifier for the user in the `sub` claim of the id_token.  The claims in an id_token with only the `openid` scope granted will be devoid of any personally identifiable information.  Example id_token claims are:

```
{ 
	"aud": "580e250c-8f26-49d0-bee8-1c078add1609",
	"iss": "https://login.microsoftonline.com/b9410318-09af-49c2-b0c3-653adc1f376e/v2.0 ",
	"iat": 1449520283,
	"nbf": 1449520283,
	"exp": 1449524183,
	"nonce": "12345",
	"sub": "MF4f-ggWMEji12KynJUNQZphaUTvLcQug5jdF2nl01Q",
	"tid": "b9410318-09af-49c2-b0c3-653adc1f376e",
	"ver": "2.0",
}
```

If you want to obtain personally identifiable information (PII) about the user in your app, your app will need to request additional permissions from the user.  We are introducing support for two new scopes from the OpenID Connect spec – the `email` and `profile` scopes – which allow you to do so.

- The `email` scope is very straightforward – it allows your app access to the user's primary email address via the `email` claim in the id_token.  Note that the `email` claim will not always be present in id_tokens – it will only be included if available in the user's profile.
- The `profile` scope affords your app access to all other basic information about the user – their name, preferred username, object ID, and so on.

This allows you to code your app in a minimal-disclosure fashion – you can ask the user for just the set of information that your app requires to do its job.  If you want to continue getting the full set of user information that your app is currently receiving, you should include all three scopes in your authorization requests:

```
https://login.microsoftonline.com/common/oauth2/v2.0/authorize?
client_id=...
&redirect_uri=...
&response_mode=form_post
&response_type=id_token
&scope=openid profile email offline_access https://outlook.office.com/mail.read
```

Your app can begin sending the `email` and `profile` scopes immediately, and the v2.0 endpoint will accept these two scopes and begin requesting permissions from users as necessary.  However, the change in the interpretation of the `openid` scope will not take effect for a few weeks.

> [AZURE.IMPORTANT] **Your job: Add the `profile` and `email` scopes if your app requires information about the user.**  Note that ADAL will include both of these permissions in requests by default. 

### Removing the issuer trailing slash.
Previously, the issuer value that appears in tokens from the v2.0 endpoint took the form

```
https://login.microsoftonline.com/{some-guid}/v2.0/
```

Where the guid was the tenantId of the Azure AD tenant which issued the token.  With these changes, the issuer value becomes

```
https://login.microsoftonline.com/{some-guid}/v2.0 
```

in both tokens and in the OpenID Connect discovery document.

> [AZURE.IMPORTANT] **Your job: Make sure your app accepts the issuer value both with and without a trailing slash during issuer validation.**

## Why change?
The primary motivation for introducing these changes is to be compliant with the OpenID Connect standard specification.  By being OpenID Connect compliant, we hope to minimize differences between integrating with Microsoft identity services and with other identity services in the industry.  We want to enable developers to use their favorite open source authentication libraries without having to alter the libraries to accommodate Microsoft differences.

## What can you do?
As of today, you can begin making all of the changes described above.  You should immediately:

1.	**Remove any dependencies on the `x5t` header parameter.**
2.	**Gracefully handle the transition from `profile_info` to `id_token` in token responses.**
3.  **Remove any dependencies on the `id_token_expires_in` response parameter.**
3.	**Add the `profile` and `email` scopes to your app if your app needs basic user information.**
4.	**Accept issuer values in tokens both with and without a trailing slash.**

Our [v2.0 protocol documentation](active-directory-v2-protocols.md) has already been updated to reflect these changes, so you may use it as reference in helping update your code.

If you have any further questions on the scope of the changes, please feel free to reach out to us on Twitter at @AzureAD.

## How often will protocol changes occur?
We do not foresee any further breaking changes to the authentication protocols.  We are intentionally bundling these changes into one release so that you won`t have to go through this type of update process again any time soon.  Of course, we will continue to add features to the converged v2.0 authentication service that you can take advantage of, but those changes should be additive and not break existing code.

Lastly, we would like to say thank you for trying things out during the preview period.  The insights and experiences of our early adopters have been invaluable thus far, and we hope you`ll continue to share your opinions and ideas.

Happy coding!

The Microsoft Identity Division
