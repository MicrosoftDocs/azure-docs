---
title: Tutorial to configure Azure Active Directory B2C with Onfido
titleSuffix: Azure AD B2C
description: Learn how to integrate Azure AD B2C authentication with Onfido for document ID and facial biometrics verification 
services: active-directory-b2c
author: gargi-sinha
manager: martinco
ms.reviewer: kengaderdus
ms.service: active-directory
ms.workload: identity
ms.topic: how-to
ms.date: 12/8/2022
ms.author: gasinh
ms.subservice: B2C
---

# Tutorial for configuring Onfido with Azure Active Directory B2C

In this tutorial, learn how to integrate Azure AD business-to-consumer B2C with [Onfido](https://onfido.com/), a document ID and facial biometrics verification app. Use it to meet *Know Your Customer* and identity requirements. Onfido uses AI-based identity verification, which verifies a photo ID, then matches it with facial biometrics. The solution connects a digital identity to a person and provides a reliable onboarding experience, while reducing fraud.

In this tutorial, you'll enable the Onfido service to verify identity in the sign-up, or sign-in, flow. Onfido results inform decisions about which product or service the user accesses.

## Prerequisites

To get started, you'll need:

- An Azure AD subscription
  - If you don't have on, you can get an [Azure free account](https://azure.microsoft.com/free/)
- [An Azure AD B2C tenant](./tutorial-create-tenant.md) linked to your Azure subscription
- An Onfido trial account
  - Go to onfido.com [Contact us](https://onfido.com/signup/) and fill out the form

## Scenario description

The Onfido integration includes the following components:

- **Azure AD B2C tenant** – The authorization server that verifies user credentials based on custom policies defined in the tenant. It's also known as the identity provider (IdP). It hosts the Onfido client app, which collects the user documents and transmits them to the Onfido API service.
- **Onfido client** – A configurable, JavaScript client document-collection utility deployed in webpages. It checks details such as document size and quality.
- **Intermediate REST API** – Provides endpoints for the Azure AD B2C tenant to communicate with the Onfido API service. It handles data processing and adheres to security requirements of both.
- **Onfido API service** – The back-end service, which saves and verifies user documents.

The following architecture diagram shows the implementation.

  ![screenshot for onfido-architecture-diagram](media/partner-onfido/onfido-architecture-diagram.png)

1. User signs-up to create a new account and enters attributes. Azure AD B2C collects the attributes. Onfido client app hosted in Azure AD B2C checks for the user information.
2. Azure AD B2C calls the middle layer API and passes the attributes.
3. Middle layer API collects attributes and converts them to an Onfido API format.
4. Onfido processes attributes to validate user identification and sends result to the middle layer API.
5. Middle layer API processes the results and sends relevant information to Azure AD B2C, in JavaScript Object Notation (JSON) format.
6. Azure AD B2C receives the information. If the response fails, an error message appears. If the response succeeds, the user is authenticated and written into the directory.

## Onboard with Onfido

1. To create an Onfido account, contact [Onfido](https://onfido.com/signup/).

2. Once an account is created, create an [API key](https://documentation.onfido.com/). Live keys are billable, however, you can use the [sandbox keys for testing](https://documentation.onfido.com/?javascript#sandbox-and-live-differences) the solution. The sandbox keys produce the same result structure as live keys, however, the results are always predetermined. Documents aren't processed or saved.

>[!NOTE]
> You will need the key later.

For more information about Onfido, see [Onfido API documentation](https://documentation.onfido.com) and [Onfido Developer Hub](https://developers.onfido.com).  

## Configure Azure AD B2C with Onfido

### Part 1 - Deploy the API

- Deploy the provided [API code](https://github.com/azure-ad-b2c/partner-integrations/tree/master/samples/OnFido-Combined/API/Onfido.Api) to an Azure service. The code can be published from Visual Studio, following these [instructions](/visualstudio/deployment/quickstart-deploy-to-azure).
- Set-up CORS, add **Allowed Origin** as https://{your_tenant_name}.b2clogin.com

>[!NOTE]
>You'll need the URL of the deployed service to configure Azure AD with the required settings.

#### Adding sensitive configuration settings

Application settings can be configured in the [App service in Azure](../app-service/configure-common.md#configure-app-settings). The App service allows for settings to be securely configured without checking them into a repository. The REST API needs the following settings:

| Application setting name | Source | Notes |
|:-------------------------|:-------|:-------|
|OnfidoSettings:AuthToken| Onfido Account |

### Part 2 - Deploy the UI

#### Configure your storage location

1. Set up a [blob storage container in your storage account](../storage/blobs/storage-quickstart-blobs-portal.md#create-a-container)

2. Store the UI files from the [UI folder](https://github.com/azure-ad-b2c/partner-integrations/tree/master/samples/OnFido-Combined/UI) to your blob container.

3. Allow CORS access to storage container you created by following these instructions:

   a. Go to **Settings** >**Allowed Origin**, enter `https://{your_tenant_name}.b2clogin.com`. Replace your-tenant-name with the name of your Azure AD B2C tenant. For example, https://fabrikam.b2clogin.com. Use all lowercase letters when entering your tenant name.

   b. For **Allowed Methods**, select `GET` and `PUT`.

   c. Select **Save**.

#### Update UI files

1. In the UI files, go to the folder [**ocean_blue**](https://github.com/azure-ad-b2c/partner-integrations/tree/master/samples/OnFido-Combined/UI/ocean_blue)

2. Open each html file.

3. Find and replace `{your-ui-blob-container-url}` with the URL of where your UI **ocean_blue**, **dist**, and **assets** folders are located

4. Find and replace `{your-intermediate-api-url}` with the URL of the intermediate API app service.

#### Upload your files

1. Store the UI files from the UI folder to your blob container.

2. Use [Azure Storage Explorer](../virtual-machines/disks-use-storage-explorer-managed-disks.md) to manage your files and access permissions.

### Part 3 - Configure Azure AD B2C

#### Replace the configuration values

In the provided [custom policies](https://github.com/azure-ad-b2c/partner-integrations/tree/master/samples/OnFido-Combined/Policies), find the following placeholders and replace with the corresponding values from your instance.

| Placeholder | Replace with value | Example  |
|:---------------|:----------------|:-------------------|
| {your_tenant_name}  | Your tenant short name |  "yourtenant" from yourtenant.onmicrosoft.com |
| {your_tenantID} | TenantID of your Azure AD B2C tenant | 01234567-89ab-cdef-0123-456789abcdef           |
| {your_tenant_IdentityExperienceFramework_appid}        | App ID of the IdentityExperienceFramework app configured in your Azure AD B2C tenant      | 01234567-89ab-cdef-0123-456789abcdef         |
| {your_tenant_ ProxyIdentityExperienceFramework _appid} | App ID of the ProxyIdentityExperienceFramework app configured in your Azure AD B2C tenant | 01234567-89ab-cdef-0123-456789abcdef         |
| {your_tenant_extensions_appid}                         | App ID of your tenant's storage application                                      | 01234567-89ab-cdef-0123-456789abcdef         |
| {your_tenant_extensions_app_objectid}                  | Object ID of your tenant's storage application                                   | 01234567-89ab-cdef-0123-456789abcdef         |
| {your_app_insights_instrumentation_key} | Instrumentation key of your app insights instance*| 01234567-89ab-cdef-0123-456789abcdef|
|{your_ui_file_base_url}| URL of the location where your UI **ocean_blue**, **dist**, and **assets** folders are located | https://yourstorage.blob.core.windows.net/UI/|
| {your_app_service_URL}                                 | URL of the app service you've set up                                             | `https://yourapp.azurewebsites.net`          |

*App insights can be in a different tenant. This step is optional. Remove the corresponding TechnicalProfiles and OrchestrationSteps if not needed.

### Part 4 - Configure the Azure AD B2C policy

Refer to this [document](tutorial-create-user-flows.md?pivots=b2c-custom-policy#custom-policy-starter-pack) for instructions on how to set up your Azure AD B2C tenant and configure policies.

>[!NOTE]
> As a best practice, we recommend that customers add consent notification in the attribute collection page. Notify users that information will be send to third-party services for Identity verification.

## Test the user flow

1. Open the Azure AD B2C tenant and under Policies select **Identity Experience Framework**.

2. Select your previously created **SignUpSignIn**.

3. Select **Run user flow** and select the settings:

   a. **Application**: select the registered app (sample is JWT)

   b. **Reply URL**: select the **redirect URL**

   c. Select **Run user flow**.

4. Go through sign-up flow and create an account

5. Onfido service will be called during the flow, after user attribute is created. If the flow is incomplete, check that user isn't saved in the directory.

## Next steps

For additional information, review the following articles:

- [Custom policies in Azure AD B2C](./custom-policy-overview.md)

- [Get started with custom policies in Azure AD B2C](tutorial-create-user-flows.md?pivots=b2c-custom-policy)
