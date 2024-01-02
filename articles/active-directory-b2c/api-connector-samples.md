---
title:  Samples of APIs for modifying your Azure AD B2C user flows  
description: Code samples for modifying user flows with API connectors 

author: kengaderdus
manager: CelesteDG

ms.author: kengaderdus
ms.date: 11/03/2022
ms.custom: mvc
ms.topic: sample
ms.service: active-directory
ms.subservice: B2C
---

# API connector REST API samples

The following tables provide links to code samples for using web APIs in your user flows using [API connectors](api-connectors-overview.md). These samples are primarily designed to be used with built-in user flows.

## Azure Function quickstarts
| Sample                                                                                                                          | Description                                                                                                                                               |
| ------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [.NET Core](https://github.com/Azure-Samples/active-directory-dotnet-external-identities-api-connector-azure-function-validate) | This .NET Core Azure Function sample demonstrates how to limit sign-ups to specific email domains and validate user-provided information. |
| [Node.js](https://github.com/Azure-Samples/active-directory-nodejs-external-identities-api-connector-azure-function-validate)   | This Node.js Azure Function sample demonstrates how to limit sign-ups to specific email domains and validate user-provided information.  |
| [Python](https://github.com/Azure-Samples/active-directory-python-external-identities-api-connector-azure-function-validate)    | This Python Azure Function sample demonstrates how to limit sign-ups to specific email domains and validate user-provided information.    |


## Automated fraud protection services & CAPTCHA
| Sample                                                                                                            | Description                                                                                                                          |
| ----------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------ |
| [Arkose Labs fraud and abuse protection](https://github.com/Azure-Samples/active-directory-b2c-node-sign-up-user-flow-arkose) | This sample shows how to protect your user sign-ups using the Arkose Labs fraud and abuse protection service. |
| [reCAPTCHA](https://github.com/Azure-Samples/active-directory-b2c-node-sign-up-user-flow-captcha) | This sample shows how to protect your user sign-ups using a reCAPTCHA challenge to prevent automated abuse. |


## Identity verification

| Sample                                                                                                            | Description                                                                                                                          |
| ----------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------ |
| [IDology](https://github.com/Azure-Samples/active-directory-dotnet-external-identities-idology-identity-verification) | This sample shows how to verify a user identity as part of your sign-up flows with IDology's service. |
| [Experian](https://github.com/Azure-Samples/active-directory-dotnet-external-identities-experian-identity-verification) | This sample shows how to verify a user identity as part of your sign-up flows with Experian's service. |


## Other

| Sample                                                                                                            | Description                                                                                                                          |
| ----------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------ |
| [Invitation code](https://github.com/Azure-Samples/active-directory-b2c-node-sign-up-user-flow-invitation-code) | This sample demonstrates how to limit sign up to specific audiences by using invitation codes.|
| [API connector community samples](https://github.com/azure-ad-b2c/api-connector-samples) | This repository has community maintained samples of scenarios enabled by API connectors.|
