---
title: Tutorial to configure Azure Active Directory B2C with whoIam 
titleSuffix: Azure AD B2C
description: Learn how to integrate Azure AD B2C authentication with whoIam for user verification 
services: active-directory-b2c
author: gargi-sinha
manager: martinco
ms.service: active-directory
ms.workload: identity
ms.topic: how-to
ms.date: 08/20/2020
ms.author: gasinh
ms.subservice: B2C
---

# Tutorial for configuring WhoIAM with Azure Active Directory B2C

In this sample tutorial, we provide guidance on how to configure [WhoIAM](https://www.whoiam.ai/brims/) Branded Identity Management System (BRIMS) in your environment and integrate it with Azure AD B2C.

WhoIAM's BRIMS is a set of apps and services that gets deployed in your environment. It provides voice, SMS, and email verification of your user base. BRIMS works in conjunction with your existing identity and access management solution and is platform agnostic.

## Prerequisites

To get started, you'll need:

- An Azure AD subscription. If you don't have a subscription, you can get a [free account](https://azure.microsoft.com/free/).

- [An Azure AD B2C tenant](https://docs.microsoft.com/azure/active-directory-b2c/tutorial-create-tenant) that is linked to your Azure subscription.

- A WhoIAM [trial account](https://www.whoiam.ai/contact-us/)

## Scenario description

The WhoIAM integration includes the following components:

- Azure AD B2C tenant – The authorization server, responsible for verifying the user’s credentials based on custom policies defined in the tenant. It's also known as the identity provider.

- An administration portal for managing clients and their configurations

- An API service that exposes various features through endpoints  

- Azure Cosmos DB that is used as the backend for both the BRIMS administration portal and the API service

The following architecture diagram shows the implementation.

![screenshot for whoiam-architecture-diagram](media/partner-whoiam/whoiam-architecture-diagram.png)

|Step | Description |
|:-----| :-----------|
| 1. | User arrives at a login page. The user starts a sign-up or sign-in request to an app that uses Azure AD B2C as its identity provider.
| 2. | As part of authentication, the user requests to either verify ownership of their email or phone or use their voice as a biometric verification factor.  
| 3. | Azure AD B2C makes a call to the BRIMS API service passing on the user’s email address, phone number, and their voice recording
| 4. | BRIMS uses pre-defined configurations such as fully customizable email and SMS templates to interact with the user in their respective language that is consistent with the app's look and feel.
| 5. | Once a user’s identity verification is complete, BRIMS returns a token to Azure AD B2C indicating the outcome of the verification. Azure AD B2C then either grants the user access to the app or fails their authentication attempt.  

## Onboard with WhoIAM

1. Contact [WhoIAM](https://www.whoiam.ai/contact-us/) and create a BRIMS account.

2. Once an account is created, use the onboarding guidelines made available to you and configure the following Azure services:

    - [Azure Key Vault](https://azure.microsoft.com/services/key-vault/) - Used for secure storage of password such as, mail service passwords.

    - [Azure App Service](https://azure.microsoft.com/services/app-service/) - Used to host the BRIMS API and admin portal services

    - [Azure Active Directory](https://azure.microsoft.com/services/active-directory/) - Used to authenticate administrative users for the admin portal

    - [Azure Cosmos DB](https://azure.microsoft.com/services/cosmos-db/) - Used to store and retrieve settings

    - [Application Insights](https://docs.microsoft.com/azure/azure-monitor/app/app-insights-overview#:~:text=Application%20Insights%2C%20a%20feature%20of%20Azure%20Monitor%2C%20is,professionals.%20Use%20it%20to%20monitor%20your%20live%20applications.) (Optional) - Used to log into both API and admin portal

3. Deploy the BRIMS API and the BRIMS administration portal in your Azure environment.

4. Azure AD B2C custom policy samples are available in your BRIMS onboarding documentation. Follow the document to configure your app and use the BRIMS platform for user identity verification.  

For more information about WhoIAM's BRIMS, see [product documentation](https://www.whoiam.ai/brims/)

## Test the user flow

1. Open the Azure AD B2C tenant and under Policies select **Identity Experience Framework**.

2. Select your previously created **SignUpSignIn**.

3. Select **Run user flow** and select the settings:

   a. **Application**: select the registered app (sample is JWT)

   b. **Reply URL**: select the **redirect URL**

   c. Select **Run user flow**.

4. Go through sign-up flow and create an account

5. BRIMS service will be called during the flow, after user attribute is created. If the flow is incomplete, check that user isn't saved in the directory.

## Next steps

For additional information, review the following articles:

- [Custom policies in Azure AD B2C](https://docs.microsoft.com/azure/active-directory-b2c/custom-policy-overview)

- [Get started with custom policies in Azure AD B2C](https://docs.microsoft.com/azure/active-directory-b2c/custom-policy-get-started?tabs=applications)
