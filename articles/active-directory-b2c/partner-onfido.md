---
title: Tutorial to configure Azure Active Directory B2C with Onfido
titleSuffix: Azure AD B2C
description: Learn how to integrate Azure AD B2C authentication with Onfido for document ID and facial biometrics verification 
services: active-directory-b2c
author: gargi-sinha
manager: martinco
ms.service: active-directory
ms.workload: identity
ms.topic: how-to
ms.date: 08/03/2020
ms.author: gasinh
ms.subservice: B2C
---

# Tutorial for configuring Onfido with Azure Active Directory B2C

In this sample tutorial, we provide guidance on how to integrate Azure AD B2C with [Onfido](https://onfido.com/). Onfido is a document ID and facial biometrics verification app. It allows companies to meet *Know Your Customer* and identity requirements in real time. Onfido uses sophisticated AI-based identity verification, which first verifies a photo ID, then matches it against their facial biometrics. This solution ties a digital identity to their real-world person and provides a safe onboarding experience while reducing fraud.

In this sample, we connect Onfido's service in the sign-up or login flow to do identity verification. Informed decisions about which product and service the user can access is made based on Onfido's results.

## Prerequisites

To get started, you'll need:

- An Azure AD subscription. If you don't have a subscription, you can get a [free account](https://azure.microsoft.com/free/).

- [An Azure AD B2C tenant](./tutorial-create-tenant.md) that is linked to your Azure subscription.

- An Onfido [trial account](https://onfido.com/signup/).

## Scenario description

The Onfido integration includes the following components:

- Azure AD B2C tenant – The authorization server, responsible for verifying the user's credentials based on custom policies defined in the tenant. It's also known as the identity provider. It hosts the Onfido client app, which collects the user documents and transmits it to the Onfido API service.

- Onfido client – A configurable JavaScript client document collection utility deployed within other webpages. Collects the documents and does preliminary checks like document size and quality.

- Intermediate Rest API – Provides endpoints for the Azure AD B2C tenant to communicate with the Onfido API service, handling data processing and adhering to the security requirements of both.

- Onfido API service – The backend service provided by Onfido, which saves and verifies the documents provided by the user.

The following architecture diagram shows the implementation.

![screenshot for onfido-architecture-diagram](media/partner-onfido/onfido-architecture-diagram.png)

|Step | Description |
|:-----| :-----------|
| 1. | User arrives at a login page. User signs-up to create a new account and enters information into the page. Azure AD B2C collects the user attributes. Onfido client app hosted in Azure AD B2C does preliminary checks for the user information.
| 2. | Azure AD B2C calls the middle layer API and passes on the user attributes.
| 3. | Middle layer API collects user attributes and transforms it into a format that Onfido API could consume. Then, sends it to Onfido.
| 4. | Onfido consumes the information and processes it to validate user identification. Then, it returns the result to the middle layer API.
| 5. | Middle layer API processes the information and sends back relevant information in the correct JSON format to Azure AD B2C.
| 6. | Azure AD B2C receives information back from middle layer API. If it shows a Failure response, an error message is displayed to user. If it shows a Success response, the user is authenticated and written into the directory.

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

Application settings can be configured in the [App service in Azure](../app-service/configure-common.md#configure-app-settings). The App service allows for settings to be securely configured without checking them into a repository. The Rest API needs the following settings:

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

3. Find and  replace {your-ui-blob-container-url} with the URL of where your UI **ocean_blue**, **dist**, and **assets** folders are located

4. Find and replace {your-intermediate-api-url} with the URL of the intermediate API app service.

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

Refer to this [document](./custom-policy-get-started.md?tabs=applications#custom-policy-starter-pack) for instructions on how to set up your Azure AD B2C tenant and configure policies.

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

- [Get started with custom policies in Azure AD B2C](./custom-policy-get-started.md?tabs=applications)
