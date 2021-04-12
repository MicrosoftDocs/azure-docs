---
title: Tutorial to configure Azure Active Directory B2C with Experian
titleSuffix: Azure AD B2C
description: Learn how to integrate Azure AD B2C authentication with Experian for Identification verification and proofing based on user attributes to prevent fraud.
services: active-directory-b2c
author: gargi-sinha
manager: martinco

ms.service: active-directory
ms.workload: identity
ms.topic: how-to
ms.date: 07/22/2020
ms.author: gasinh
ms.subservice: B2C
---
# Tutorial for configuring Experian with Azure Active Directory B2C

In this sample tutorial, we provide guidance on how to integrate Azure AD B2C with [Experian](https://www.experian.com/decision-analytics/account-opening-fraud/microsoft-integration). Experian provides a variety of solutions, which you can find [here](https://www.experian.com/).

In this sample, Experian's integrated digital identity and fraud risk platform **CrossCore** is used. CrossCore is an ID verification service that is used to verify user identification. It does risk analysis based on several pieces of information provided by the user during sign-up flow. CrossCore is used to determine whether the user should be allowed to continue to log in or not. The following attributes can be used in CrossCore risk analysis:

- Email
- IP Address
- Given Name
- Middle Name
- Surname
- Street Address
- City
- State/Province
- Postal Code
- Country/Region
- Phone Number

## Prerequisites

To get started, you'll need:

- An Azure AD subscription. If you don't have a subscription, you can get a [free account](https://azure.microsoft.com/free/).

- [An Azure AD B2C tenant](./tutorial-create-tenant.md) that is linked to your Azure subscription.

## Scenario description

The Experian integration includes the following components:

- Azure AD B2C – The authorization server, responsible for verifying the user's credentials, also known as the identity provider

- Experian – The Experian service takes inputs provided by the user and verifies the user's identity

- Custom Rest API – This API implements the integration between Azure AD B2C and the Experian service.

The following architecture diagram shows the implementation.

![screenshot for experian-architecture-diagram](media/partner-experian/experian-architecture-diagram.png)

|Step | Description |
|:-----| :-----------|
| 1. | User arrives at a login page. User selects sign-up to create a new account and enters information into the page. Azure AD B2C collects the user attributes.
| 2. | Azure AD B2C calls the middle layer API and passes on the user attributes.
| 3. | Middle layer API collects user attributes and transforms it into a format that Experian API could consume. Then, sends it to Experian.
| 4. | Experian consumes the information and processes it to validate user identification based on the risk analysis. Then, it returns the result to the middle layer API.
| 5. | Middle layer API processes the information and sends back relevant information in the correct JSON format to Azure AD B2C.
| 6. | Azure AD B2C receives information back from middle layer API. If it shows a Failure response, an error message is displayed to user. If it shows a Success response, the user is authenticated and written into the directory.

## Onboard with Experian

1. To create an Experian account, contact [Experian](https://www.experian.com/decision-analytics/account-opening-fraud/microsoft-integration)

2. Once an account is created, you'll receive the information you need for API configuration. The following sections describe the process.

## Configure Azure AD B2C with Experian

### Part 1 - Deploy the API

Deploy the provided [API code](https://github.com/azure-ad-b2c/partner-integrations/blob/master/samples/Experian/CrossCoreIntegrationApi/CrossCoreIntegrationApi.sln) to an Azure service. The code can be published from Visual Studio, following these [instructions](/visualstudio/deployment/quickstart-deploy-to-azure).

>[!NOTE]
>You'll need the URL of the deployed service to configure Azure AD with the required settings.

### Part 2 - Deploy the client certificate

The Experian API call is protected by a client certificate. This client certificate will be provided by Experian. Following the  instructions mentioned in this [document](../app-service/environment/certificates.md#private-client-certificate), the certificate must be uploaded to the Azure App service. The sample policy uses these keys steps in the process:

- Upload the certificate

- Set the `WEBSITE_LOAD_ROOT_CERTIFICATES` key with the thumbprint of the certificate.

### Part 3 - Configure the API

Application settings can be [configured in the App service in Azure](../app-service/configure-common.md#configure-app-settings). With this method,  settings can be securely configured without checking them into a repository. You'll need to provide the following settings to the Rest API:

| Application settings | Source | Notes |
| :-------- | :------------| :-----------|
|CrossCoreConfig:TenantId | Experian account configuration |     |
|CrossCoreConfig:OrgCode | Experian account configuration |     |
|CrossCore:ApiEndpoint |Experian account configuration|  |
|CrossCore:ClientReference | Experian account configuration | |
| CrossCore:ModelCode |Experian account configuration|
| CrossCore:OrgCode | Experian account configuration |
| CrossCore:SignatureKey  | Experian account configuration |
| CrossCore:TenantId  | Experian account configuration |
| CrossCore:CertificateThumbprint | Experian certificate |
| BasicAuth:ApiUsername | Define a username for the API | Used in the ExtId configuration |
| BasicAuth:ApiPassword | Define a password for the API | Used in the ExtId configuration

### Part 4 - Create API policy keys

Refer to this [document](./secure-rest-api.md#add-rest-api-username-and-password-policy-keys) and create two policy keys – one for the API username, and one for the API password that you defined above for HTTP basic authentication.

>[!NOTE]
>You'll need the keys for configuring the policies later.

### Part 5 - Replace the configuration values

In the provided [custom policies](https://github.com/azure-ad-b2c/partner-integrations/tree/master/samples/Experian/policy), find the following placeholders and replace with the corresponding values from your instance

|                      Placeholder                       |                                   Replace with value                                 |                   Example                    |
| ------------------------------------------------------ | -------------------------------------------------------------------------------- | -------------------------------------------- |
| {your_tenant_name}                                     | Your tenant short name                                                           | "yourtenant" from yourtenant.onmicrosoft.com |
| {your_trustframeworkbase_policy}                       | Azure AD B2C name of your TrustFrameworkBase policy                  | B2C_1A_experian_TrustFrameworkBase           |
| {your_tenant_IdentityExperienceFramework_appid}        | App ID of the IdentityExperienceFramework app configured in your Azure AD B2C tenant      | 01234567-89ab-cdef-0123-456789abcdef         |
| {your_tenant_ ProxyIdentityExperienceFramework _appid} | App ID of the ProxyIdentityExperienceFramework app configured in your Azure AD B2C tenant | 01234567-89ab-cdef-0123-456789abcdef         |
| {your_tenant_extensions_appid}                         | App ID of your tenant's storage application                                      | 01234567-89ab-cdef-0123-456789abcdef         |
| {your_tenant_extensions_app_objectid}                  | Object ID of your tenant's storage application                                   | 01234567-89ab-cdef-0123-456789abcdef         |
| {your_api_username_key_name}                           | Name of the username key you created [here](#part-4---create-api-policy-keys)             | B2C\_1A\_RestApiUsername                     |
| {your_api_password_key_name}                           | Name of the password key you created [here](#part-4---create-api-policy-keys)             | B2C\_1A\_RestApiPassword                     |
| {your_app_service_URL}                                 | URL of the app service you've set up                                             | `https://yourapp.azurewebsites.net`          |

### Part 6 - Configure the Azure AD B2C policy

Refer to this [document](./tutorial-create-user-flows.md?pivots=b2c-custom-policy#custom-policy-starter-pack) for instructions on how to set up your Azure AD B2C tenant and configure policies.

>[!NOTE]
>This sample policy is based on [Local Accounts starter
pack](https://github.com/Azure-Samples/active-directory-b2c-custom-policy-starterpack/tree/master/LocalAccounts).

>[!NOTE]
> As a best practice, we recommend that customers add consent notification in the attribute collection page. Notify users that information will be send to third-party services for Identity verification.

## Test the user flow

1. Open the Azure AD B2C tenant and under Policies select **User flows**.

2. Select your previously created **User Flow**.

3. Select **Run user flow** and select the settings:

   a. **Application**: select the registered app (sample is JWT)

   b. **Reply URL**: select the **redirect URL**

   c. Select **Run user flow**.

4. Go through sign-up flow and create an account

5. Log-out

6. Go through sign-in flow  

7. CrossCore puzzle will pop up after you enter **continue**.

## Next steps

For additional information, review the following articles:

- [Custom policies in Azure AD B2C](./custom-policy-overview.md)

- [Get started with custom policies in Azure AD B2C](tutorial-create-user-flows.md?pivots=b2c-custom-policy)
