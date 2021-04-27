---
title: Tutorial to configure Azure Active Directory B2C with Microsoft Dynamics 365 Fraud Protection
titleSuffix: Azure AD B2C
description: Tutorial to configure Azure Active Directory B2C with Microsoft Dynamics 365 Fraud Protection to identify risky and fraudulent account
services: active-directory-b2c
author: gargi-sinha
manager: martinco

ms.service: active-directory
ms.workload: identity
ms.topic: how-to
ms.date: 02/10/2021
ms.author: gasinh
ms.subservice: B2C
---

# Tutorial: Configure Microsoft Dynamics 365 Fraud Protection with Azure Active Directory B2C

In this sample tutorial, we provide guidance on how to integrate [Microsoft Dynamics 365 Fraud Protection](https://docs.microsoft.com/dynamics365/fraud-protection/overview) (DFP) with the Azure Active Directory (AD) B2C.

Microsoft DFP provides clients with the capability to assess if the risk of attempts to create new accounts and attempts to login to client's ecosystem are fraudulent. Microsoft DFP assessment can be used by the customer to block or challenge suspicious attempts to create new fake accounts or to compromise existing accounts. Account protection includes artificial intelligence empowered device fingerprinting, APIs for real-time risk assessment, rule and list experience to optimize risk strategy as per client's business needs, and a scorecard to monitor fraud protection effectiveness and trends in client's ecosystem.

In this sample, we'll be integrating the account protection features of Microsoft DFP with an Azure AD B2C user flow. The service will externally fingerprint every sign-in or sign up attempt and watch for any past or present suspicious behavior. Azure AD B2C invokes a decision endpoint from Microsoft DFP, which returns a result based on all past and present behavior from the identified user, and also the custom rules specified within the Microsoft DFP service. Azure AD B2C makes an approval decision based on this result and passes the same back to Microsoft DFP.

## Prerequisites

To get started, you'll need:

- An Azure subscription. If you don't have a subscription, you can get a [free account](https://azure.microsoft.com/free/).

- An [Azure AD B2C tenant](./tutorial-create-tenant.md). Tenant is linked to your Azure subscription.

- Get a Microsoft DFP [subscription](https://dynamics.microsoft.com/pricing/#Sales). You can set up a [trial client version](https://dynamics.microsoft.com/ai/fraud-protection/signin/?RU=https%3A%2F%2Fdfp.microsoft.com%2Fsignin) as well.

## Scenario description

Microsoft DFP integration includes the following components:

- **Azure AD B2C tenant**: Authenticates the user and acts as a client of Microsoft DFP. Hosts a fingerprinting script collecting identification and diagnostic data of every user that executes a target policy. Later blocks or challenges sign-in or sign-up attempts if Microsoft DFP finds them suspicious.

- **Custom app service**: A web application that serves two purposes.

  - Serves HTML pages to be used as Identity Experience Framework's UI. Responsible for embedding the Microsoft Dynamics 365 fingerprinting script.

  - An API controller with RESTful endpoints that connects Microsoft DFP to Azure AD B2C. Handle's data processing, structure, and adheres to the security requirements of both.

- **Microsoft DFP fingerprinting service**: Dynamically embedded script, which logs device telemetry and self-asserted user details to create a uniquely identifiable fingerprint for the user to be used later in the decision-making process.

- **Microsoft DFP API endpoints**: Provides the decision result and accepts a final status reflecting the operation undertaken by the client application. Azure AD B2C doesn't communicate with the endpoints directly because of varying security and API payload requirements, instead uses the app service as an intermediate.

The following architecture diagram shows the implementation.

![Image shows microsoft dynamics365 fraud protection architecture diagram](./media/partner-dynamics365-fraud-protection/microsoft-dynamics-365-fraud-protection-diagram.png)

|Step | Description |
|:-----| :-----------|
| 1. | The user arrives at a login page. Users select sign-up to create a new account and enter information into the page. Azure AD B2C collects user attributes.
| 2. | Azure AD B2C calls the middle layer API and passes on the user attributes.
| 3. | Middle layer API collects user attributes and transforms it into a format that Microsoft DFP API could consume. Then after sends it to Microsoft DFP API.
| 4. | After Microsoft DFP API consumes the information and processes it, it returns the result to the middle layer API.
| 5. | The middle layer API processes the information and sends back relevant information to Azure AD B2C.
| 6. | Azure AD B2C receives information back from the middle layer API. If it shows a Failure response, an error message is displayed to the user. If it shows a Success response, the user is authenticated and written into the directory.

## Set up the solution

1. [Create a Facebook application](./identity-provider-facebook.md#create-a-facebook-application) configured to allow federation to Azure AD B2C.
2. [Add the Facebook secret](./tutorial-create-user-flows.md?pivots=b2c-custom-policy#create-the-facebook-key) you created as an Identity Experience Framework policy key.

## Configure your application under Microsoft DFP

[Set up your Azure AD tenant](/dynamics365/fraud-protection/integrate-real-time-api) to use Microsoft DFP.

## Deploy to the web application

### Implement Microsoft DFP service fingerprinting

[Microsoft DFP device fingerprinting](/dynamics365/fraud-protection/device-fingerprinting) is a requirement for Microsoft DFP account protection.

>[!NOTE]
>In addition to Azure AD B2C UI pages, customer may also implement the fingerprinting service inside app code for more comprehensive device profiling. Fingerprinting service in app code is not included in this sample.

### Deploy the Azure AD B2C API code

Deploy the [provided API code](https://github.com/azure-ad-b2c/partner-integrations/tree/master/samples/Dynamics-Fraud-Protection/API) to an Azure service. The code can be [published from Visual Studio](/visualstudio/deployment/quickstart-deploy-to-azure).

Set-up CORS, add **Allowed Origin** `https://{your_tenant_name}.b2clogin.com`

>[!NOTE]
>You'll later need the URL of the deployed service to configure Azure AD with the required settings.

See [App service documentation](../app-service/app-service-web-tutorial-rest-api.md) to learn more.

### Add context-dependent configuration settings

Configure the application settings in the [App service in Azure](../app-service/configure-common.md#configure-app-settings). This allows settings to be securely configured without checking them into a repository. The Rest API needs the following settings provided:

| Application settings | Source | Notes |
| :-------- | :------------| :-----------|
|FraudProtectionSettings:InstanceId | Microsoft DFP Configuration |     |
|FraudProtectionSettings:DeviceFingerprintingCustomerId | Your Microsoft device fingerprinting customer ID |     |
| FraudProtectionSettings:ApiBaseUrl |  Your Base URL from Microsoft DFP Portal   | Remove '-int' to call the production API instead|
|  TokenProviderConfig: Resource  | Your Base URL - https://api.dfp.dynamics-int.com     | Remove '-int' to call the production API instead|
|   TokenProviderConfig:ClientId       |Your Fraud Protection merchant Azure AD client app ID      |       |
| TokenProviderConfig:Authority | https://login.microsoftonline.com/<directory_ID> | Your Fraud Protection merchant Azure AD tenant authority |
| TokenProviderConfig:CertificateThumbprint* | The thumbprint of the certificate to use to authenticate against your merchant Azure AD client app |
| TokenProviderConfig:ClientSecret* | The secret for your merchant Azure AD client app | Recommended to use a secrets manager |

*Only set 1 of the 2 marked parameters depending on if you authenticate with a certificate or a secret such as a password.

## Azure AD B2C configuration

### Replace the configuration values

In the provided [custom policies](https://github.com/azure-ad-b2c/partner-integrations/tree/master/samples/Dynamics-Fraud-Protection/Policies), find the following placeholders and replace them with the corresponding values from your instance.

| Placeholder | Replace with | Notes |
| :-------- | :------------| :-----------|
|{your_tenant_name} | Your tenant short name |  "yourtenant" from yourtenant.onmicrosoft.com   |
|{your_tenantId} | Tenant ID of your Azure AD B2C tenant |  01234567-89ab-cdef-0123-456789abcdef   |
|  {your_tenant_IdentityExperienceFramework_appid}    |   App ID of the IdentityExperienceFramework app configured in your Azure AD B2C tenant    |  01234567-89ab-cdef-0123-456789abcdef   |
|  {your_tenant_ ProxyIdentityExperienceFramework _appid}     |  App ID of the ProxyIdentityExperienceFramework app configured in your Azure AD B2C tenant      |   01234567-89ab-cdef-0123-456789abcdef     |
|  {your_tenant_extensions_appid}   |  App ID of your tenant's storage application   |  01234567-89ab-cdef-0123-456789abcdef  |
|   {your_tenant_extensions_app_objectid}  | Object ID of your tenant's storage application    | 01234567-89ab-cdef-0123-456789abcdef   |
|   {your_app_insights_instrumentation_key}  |   Instrumentation key of your app insights instance*  |   01234567-89ab-cdef-0123-456789abcdef |
|  {your_ui_base_url}   | Endpoint in your app service from where your UI files are served    | `https://yourapp.azurewebsites.net/B2CUI/GetUIPage`   |
|   {your_app_service_url}  | URL of your app service    |  `https://yourapp.azurewebsites.net`  |
|   {your-facebook-app-id}  |  App ID of the facebook app you configured for federation with Azure AD B2C   | 000000000000000   |
|  {your-facebook-app-secret}   |  Name of the policy key you've saved facebook's app secret as   | B2C_1A_FacebookAppSecret   |

*App insights can be in a different tenant. This step is optional. Remove the corresponding TechnicalProfiles and OrechestrationSteps if not needed.

### Call Microsoft DFP label API

Customers need to [implement label API](/dynamics365/fraud-protection/integrate-ap-api). See [Microsoft DFP API](https://apidocs.microsoft.com/services/dynamics365fraudprotection#/AccountProtection/v1.0) to learn more.

`URI: < API Endpoint >/v1.0/label/account/create/<userId>`

The value of the userID needs to be the same as the one in the corresponding Azure AD B2C configuration value (ObjectID).

>[!NOTE]
>Add consent notification to the attribute collection page. Notify that the users' telemetry and user identity information will be recorded for account protection purposes.

## Configure the Azure AD B2C policy

1. Go to the [Azure AD B2C policy](https://github.com/azure-ad-b2c/partner-integrations/tree/master/samples/Dynamics-Fraud-Protection/Policies) in the Policies folder.

2. Follow this [document](./tutorial-create-user-flows.md?pivots=b2c-custom-policy?tabs=applications#custom-policy-starter-pack) to download [LocalAccounts starter pack](https://github.com/Azure-Samples/active-directory-b2c-custom-policy-starterpack/tree/master/LocalAccounts)

3. Configure the policy for the Azure AD B2C tenant.

>[!NOTE]
>Update the policies provided to relate to your specific tenant.

## Test the user flow

1. Open the Azure AD B2C tenant and under Policies select **Identity Experience Framework**.

2. Select your previously created **SignUpSignIn**.

3. Select **Run user flow** and select the settings:

   a. **Application**: select the registered app (sample is JWT)

   b. **Reply URL**: select the **redirect URL**

   c. Select **Run user flow**.

4. Go through sign-up flow and create an account

5. Microsoft DFP service will be called during the flow, after user attribute is created. If the flow is incomplete, check that the user isn't saved in the directory.

>[!NOTE]
>Update rules directly in Microsoft DFP Portal if using [Microsoft DFP rule engine](/dynamics365/fraud-protection/rules).

## Next steps

For additional information, review the following articles:

- [Microsoft DFP samples](https://github.com/Microsoft/Dynamics-365-Fraud-Protection-Samples)

- [Custom policies in Azure AD B2C](./custom-policy-overview.md)

- [Get started with custom policies in Azure AD B2C](./tutorial-create-user-flows.md?pivots=b2c-custom-policy)
