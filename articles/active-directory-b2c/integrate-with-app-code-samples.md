---
title: Azure Active Directory B2C integrates with app samples
description: Code samples for integrating Azure AD B2C to mobile, desktop, web, and single-page applications.
services: active-directory-b2c
author: garrodonnell
manager: CelesteDG

ms.author: godonnell
ms.date: 02/21/2023
ms.custom: mvc
ms.topic: sample
ms.service: active-directory
ms.subservice: B2C
---

# Azure Active Directory B2C code samples

The following tables provide links to samples for applications including iOS, Android, .NET, and Node.js.

## Web apps and APIs

| Sample | Description |
|--------| ----------- |
| [dotnet-webapp-and-webapi](https://github.com/Azure-Samples/active-directory-b2c-dotnet-webapp-and-webapi) | A combined sample for a .NET web application that calls a .NET Web API, both secured using Azure AD B2C. |
| [dotnetcore-webapp-openidconnect](https://github.com/Azure-Samples/active-directory-aspnetcore-webapp-openidconnect-v2/tree/master/1-WebApp-OIDC/1-5-B2C) | An ASP.NET Core web application that uses OpenID Connect to sign in users in Azure AD B2C. |
| [dotnetcore-webapp-msal-api](https://github.com/Azure-Samples/active-directory-aspnetcore-webapp-openidconnect-v2/tree/master/4-WebApp-your-API/4-2-B2C) | An ASP.NET Core web application that can sign in a user using Azure AD B2C, get an access token using MSAL.NET and call an API. |
| [auth-code-flow-nodejs](https://github.com/Azure-Samples/active-directory-b2c-msal-node-sign-in-sign-out-webapp) | A Node.js app that shows how to enable authentication (sign in, sign out and profile edit) in a Node.js web application using Azure Active Directory B2C. The web app uses MSAL-node.|
| [javascript-nodejs-webapi](https://github.com/Azure-Samples/active-directory-b2c-javascript-nodejs-webapi) | A small Node.js Web API for Azure AD B2C that shows how to protect your web api and accept B2C access tokens using passport.js. |
| [ms-identity-python-webapp](https://github.com/Azure-Samples/ms-identity-python-webapp/blob/main/README_B2C.md) | Demonstrate how to Integrate B2C of Microsoft identity platform with a Python web application.  |

## Single page apps

| Sample | Description |
|--------| ----------- |
| [ms-identity-javascript-angular-tutorial](https://github.com/Azure-Samples/ms-identity-javascript-angular-tutorial/tree/main/3-Authorization-II/2-call-api-b2c) | An Angular single page application (SPA) calling a web API. Authentication is done with Azure AD B2C by using MSAL Angular. This sample uses the authorization code flow with PKCE. |
| [ms-identity-javascript-react-tutorial](https://github.com/Azure-Samples/ms-identity-javascript-react-tutorial/tree/main/3-Authorization-II/2-call-api-b2c) | A React single page application (SPA) calling a web API. Authentication is done with Azure AD B2C by using MSAL React. This sample uses the authorization code flow with PKCE. |
| [ms-identity-b2c-javascript-spa](https://github.com/Azure-Samples/ms-identity-b2c-javascript-spa) | A VanillaJS single page application (SPA) calling a web API. Authentication is done with Azure AD B2C by using MSAL.js. This sample uses the authorization code flow with PKCE. |
| [javascript-nodejs-management](https://github.com/Azure-Samples/ms-identity-b2c-javascript-nodejs-management/tree/main/Chapter1) | A VanillaJS single page application (SPA) calling Microsoft Graph to manage users in a B2C directory. Authentication is done with Azure AD B2C by using MSAL.js. This sample uses the authorization code flow with PKCE.|

## Mobile and desktop apps

| Sample | Description |
|--------| ----------- |
| [ios-swift-native-msal](https://github.com/Azure-Samples/active-directory-b2c-ios-swift-native-msal) | An iOS sample in Swift that authenticates Azure AD B2C users and calls an API using OAuth 2.0 |
| [android-native-msal](https://github.com/Azure-Samples/ms-identity-android-java#b2cmodefragment-class) | A simple Android app showcasing how to use MSAL to authenticate users via Azure Active Directory B2C, and access a Web API with the resulting tokens. |
| [ios-native-appauth](https://github.com/Azure-Samples/active-directory-b2c-ios-native-appauth) | A sample that shows how you can use a third-party library to build an iOS application in Objective-C that authenticates Microsoft identity users to our Azure AD B2C identity service. |
| [android-native-appauth](https://github.com/Azure-Samples/active-directory-b2c-android-native-appauth) | A sample that shows how you can use a third-party library to build an Android application that authenticates Microsoft identity users to our B2C identity service and calls a web API using OAuth 2.0 access tokens. |
| [dotnet-desktop](https://github.com/Azure-Samples/active-directory-b2c-dotnet-desktop) | A sample that shows how a Windows Desktop .NET (WPF) application can sign in a user using Azure AD B2C, get an access token using MSAL.NET and call an API. |
| [xamarin-native](https://github.com/Azure-Samples/active-directory-b2c-xamarin-native) | A simple Xamarin Forms app showcasing how to use MSAL to authenticate users via Azure Active Directory B2C, and access a Web API with the resulting tokens. |

## Console/Daemon apps

| Sample | Description |
|--------| ----------- |
| [javascript-nodejs-management](https://github.com/Azure-Samples/ms-identity-b2c-javascript-nodejs-management/tree/main/Chapter2) | A Node.js and express console daemon application calling Microsoft Graph with its own identity to manage users in a B2C directory. Authentication is done with Azure AD B2C by using MSAL Node. This sample uses the authorization code flow.|
| [dotnetcore-b2c-account-management](https://github.com/Azure-Samples/ms-identity-dotnetcore-b2c-account-management) | A .NET Core console application calling Microsoft Graph with its own identity to manage users in a B2C directory. Authentication is done with Azure AD B2C by using MSAL.NET. This sample uses the authorization code flow.|

## SAML test application

| Sample | Description |
|--------| ----------- |
| [saml-sp-tester](https://github.com/azure-ad-b2c/saml-sp-tester/tree/master/source-code) | SAML test application to test Azure AD B2C configured to act as SAML identity provider. |

## API connectors

The following tables provide links to code samples for leveraging web APIs in your user flows using [API connectors](api-connectors-overview.md).

### Azure Function quickstarts

| Sample                                                                                                                          | Description                                                                                                                                               |
| ------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [.NET Core](https://github.com/Azure-Samples/active-directory-dotnet-external-identities-api-connector-azure-function-validate) | This .NET Core Azure Function sample demonstrates how to limit sign-ups to specific email domains and validate user-provided information. |
| [Node.js](https://github.com/Azure-Samples/active-directory-nodejs-external-identities-api-connector-azure-function-validate)   | This Node.js Azure Function sample demonstrates how to limit sign-ups to specific email domains and validate user-provided information.  |
| [Python](https://github.com/Azure-Samples/active-directory-python-external-identities-api-connector-azure-function-validate)    | This Python Azure Function sample demonstrates how to limit sign-ups to specific email domains and validate user-provided information.    |


### Automated fraud protection services & CAPTCHA
| Sample                                                                                                            | Description                                                                                                                          |
| ----------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------ |
| [Arkose Labs fraud and abuse protection](https://github.com/Azure-Samples/active-directory-b2c-node-sign-up-user-flow-arkose) | This sample shows how to protect your user sign-ups using the Arkose Labs fraud and abuse protection service. |
| [reCAPTCHA](https://github.com/Azure-Samples/active-directory-b2c-node-sign-up-user-flow-captcha) | This sample shows how to protect your user sign-ups using a reCAPTCHA challenge to prevent automated abuse. |


### Identity verification

| Sample                                                                                                            | Description                                                                                                                          |
| ----------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------ |
| [IDology](https://github.com/Azure-Samples/active-directory-dotnet-external-identities-idology-identity-verification) | This sample shows how to verify a user identity as part of your sign-up flows by using an API connector to integrate with IDology. |
| [Experian](https://github.com/Azure-Samples/active-directory-dotnet-external-identities-experian-identity-verification) | This sample shows how to verify a user identity as part of your sign-up flows by using an API connector to integrate with Experian. |


### Other

| Sample                                                                                                            | Description                                                                                                                          |
| ----------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------ |
| [Invitation code](https://github.com/Azure-Samples/active-directory-b2c-node-sign-up-user-flow-invitation-code) | This sample demonstrates how to limit sign up to specific audiences by using invitation codes.|
| [API connector community samples](https://github.com/azure-ad-b2c/api-connector-samples) | This repository has community maintained samples of scenarios enabled by API connectors.|
