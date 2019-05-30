---
title: Testing Microsoft Authentication Library (MSAL) applications | Azure
description: Learn about testing Microsoft Authentication Library (MSAL) applications.
services: active-directory
documentationcenter: dev-center-name
author: rwike77
manager: CelesteDG
editor: ''

ms.service: active-directory
ms.subservice: develop
ms.devlang: na
ms.topic: overview
ms.tgt_pltfrm: na
ms.workload: identity
ms.date: 05/28/2019
ms.author: ryanwi
ms.reviewer: saeeda
ms.custom: aaddev
#Customer intent: As an application developer, I want to learn about testing so I can build reliable apps.
ms.collection: M365-identity-device-management
---

# Testing MSAL applications
This article discusses suggestions for testing Microsoft Authentication Library (MSAL) applications.

## Unit testing
The MSAL APIs use the [builder pattern](https://wikipedia.org/wiki/Builder_pattern) heavily. Builders are difficult and tedious to mock. Instead, we recommend that you wrap all your authentication logic behind an interface and mock that in your app.

## End-to-end testing
For end-to-end testing, you can set up test accounts, test applications, or even separate directories. Username and passwords can be deployed via the continuous integration pipeline (for example, secret build variables in Azure DevOps). Another strategy is to keep test credentials in [Key Vault](/azure/key-vault/) and configure the machine that runs the tests to access Key Vault), for example by installing a certificate. Feel free to use MSAL's [strategy for accessing Key Vault](https://github.com/AzureAD/microsoft-authentication-library-for-dotnet/blob/master/tests/Microsoft.Identity.Test.LabInfrastructure/KeyVaultSecretsProvider.cs#L112).

Once token acquisition occurs, both an access token and a refresh token are cached. The first has a lifetime of one hour, the latter of several months. When the access token expires, MSAL will automatically use the refresh token to acquire a new one, without user interaction. You can rely on this behavior to provision your tests.

If you have conditional access configured, automating around it will be difficult. It will be easier to have a manual step that deals with conditional access (for example, multi-factor authentication), which will add tokens to the MSAL cache and then rely on silent token acquisitions, that is, rely on a previously signed-in user.

## Web apps
Use Selenium or an equivalent technology to automate the web app. Fetch usernames and password from a secure location.

## Daemon apps
Daemon apps use pre-deployed secrets (passwords or certificates) to talk to Azure Active Directory (AAD). You can deploy a secret to your test environment or use the token caching technique to provision your tests. The [client credential grant](msal-authentication-flows.md#client-credentials) does NOT fetch refresh tokens, only access tokens, which expire in one hour.

## Native client apps
For native clients, there are several approaches to testing:

* Use the [username/password grant](msal-authentication-flows.md#usernamepassword) to fetch a token in a non-interactive way. This flow is not recommended in production, but it is reasonable to use it for testing.

* Use a framework, like Appium or Xamarin.Test, that provides an automation interface for both your app and the MSAL created browser.

* MSAL exposes an extensibility point that allows developers to inject their own browser experience. The MSAL team uses this internally to test interactive auth scenarios. Have a look at [this .NET test project](https://github.com/AzureAD/microsoft-authentication-library-for-dotnet/blob/master/tests/Microsoft.Identity.Test.Integration.net45/SeleniumTests/InteractiveFlowTests.cs) to see how to inject a [Selenium-powered browser](https://github.com/AzureAD/microsoft-authentication-library-for-dotnet/tree/master/tests/Microsoft.Identity.Test.Integration.net45/Infrastructure) that can handle authentication.

## Xamarin apps
The MSAL team are currently running tests on a Xamarin app that uses MSAL.NET; We are using [App Center](https://appcenter.ms/apps) to manage devices, test runs etc. The test framework is [Xamarin.UITest](/appcenter/test-cloud/uitest/). A limitation that we have found is that we are unable to test system browsers, only embedded browsers.

When evaluating a test framework, it is worth also having a look at the Appium and other test frameworks, as well as other CI/CD providers in the mobile space.

## Testing the token cache
No matter what platform you use, MSAL stores tokens in a token cache. On some platforms, you tell MSAL how to serialize this cache. On the mobile platforms, MSAL serializes the cache for you. From an application perspective, the token cache is responsible for three things:

* storing tokens in the cache after they were acquired (for example, using the `AcquireTokenInteractive` method)
* fetching tokens from the cache when calling the `AcquireTokenSilent` method
* fetching account metadata from the cache when calling the `GetAccount` method

So if you want to test cache scenarios, consider writing a scenario that would:

* acquire one or more tokens (for example, using [username/password grant](msal-authentication-flows.md#usernamepassword) flow, which is the simplest for testing)
* verify that `GetAccounts` works
* verify that `AcquireTokenSilent` works

You might want to also test that:

* restarting the app does not remove the cache
* `AcquireTokenSilent` does not refresh the refresh token (that is, network call to AAD), but serves the access token if it has not expired. You can achieve this and other HTTP-related scenarios by taking control of the HTTP client.  For a .NET example, see [Providing your own HttpClient](msal-net-provide-httpclient.md)

## Feedback
You can [log issues](developer-support-help-options.md#create-a-github-issue) or ask questions related to testing. Providing a good test experience is one of the goals of the team.

## Next steps
Learn about implementing [logging](msal-logging.md) in your MSAL application.