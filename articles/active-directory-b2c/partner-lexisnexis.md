---
title: Tutorial to configure Azure Active Directory B2C with LexisNexis
titleSuffix: Azure AD B2C
description: Learn how to integrate Azure AD B2C authentication with LexisNexis which is a profiling and identity validation service and is used to verify user identification and provide comprehensive risk assessments based on the user's device.
author: gargi-sinha
manager: martinco

ms.service: active-directory
ms.workload: identity
ms.topic: how-to
ms.date: 07/22/2020
ms.author: gasinh
ms.subservice: B2C
---
# Tutorial for configuring LexisNexis with Azure Active Directory B2C

In this sample tutorial, we provide guidance on how to integrate Azure AD B2C with [LexisNexis](https://risk.lexisnexis.com/products/threatmetrix/?utm_source=bingads&utm_medium=ppc&utm_campaign=SEM%7CLNRS%7CUS%7CEN%7CTMX%7CBR%7CBing&utm_term=threat%20metrix&utm_network=o&utm_device=c&msclkid=1e85e32ec18c1ae9bbc1bc2998e026bd). LexisNexis provides a variety of solutions, you can find them [here](https://risk.lexisnexis.com/products/threatmetrix/?utm_source=bingads&utm_medium=ppc&utm_campaign=SEM%7CLNRS%7CUS%7CEN%7CTMX%7CBR%7CBing&utm_term=threat%20metrix&utm_network=o&utm_device=c&msclkid=1e85e32ec18c1ae9bbc1bc2998e026bd). In this sample tutorial, we'll cover the **ThreatMetrix** solution from LexisNexis. ThreatMetrix is a profiling and identity validation service. It's used to verify user identification and provide comprehensive risk assessments based on the user's device.

This integration does profiling based on a few pieces of user information, which is provided by the user during sign-up flow. ThreatMetrix  determines whether the user should be allowed to continue to log in or not. The following attributes are considered in ThreatMetrix's risk analysis:

- Email
- Phone Number
- Profiling information collected from the user's machine

## Prerequisites

To get started, you'll need:

- An Azure AD subscription. If you don't have a subscription, you can get a [free account](https://azure.microsoft.com/free/).

- [An Azure AD B2C tenant](https://docs.microsoft.com/azure/active-directory-b2c/tutorial-create-tenant) that is linked to your Azure subscription.

## Scenario description

The ThreatMetrix integration includes the following components:

- Azure AD B2C – The authorization server, responsible for verifying the user’s credentials, also known as the identity provider

- ThreatMetrix – The ThreatMetrix service takes inputs provided by the user and combines it with profiling information gathered from the user's machine to verify the security of the user interaction.

- Custom Rest API – This API implements the integration between Azure AD B2C and the ThreatMetrix service.

The following architecture diagram shows the implementation.

![screenshot for lexisnexis-architecture-diagram](media/partner-lexisnexis/lexisnexis-architecture-diagram.png)

|Step | Description |
|:--------------|:-------------|
|1. | User arrives at a login page. User selects sign-up to create a new account and enter information into the page. Azure AD B2C collects the user attributes.
| 2. | Azure AD B2C calls the middle layer API and passes on the user attributes.
| 3. | Middle layer API collects user attributes and transforms it into a format that LexisNexis API could consume. Then, sends it to LexisNexis.  
| 4. | LexisNexis consumes the information and processes it to validate user identification based on the risk analysis. Then, it returns the result to the middle layer API.
| 5. | Middle layer API processes the information and sends back relevant information to Azure AD B2C.
| 6. | Azure AD B2C receives information back from middle layer API. If it shows a Failure response, an error message is displayed to user. If it shows a Success response, the user is authenticated and granted access.

## Onboard with LexisNexis

1. To create a LexisNexis account, contact [LexisNexis](https://risk.lexisnexis.com/products/threatmetrix/?utm_source=bingads&utm_medium=ppc&utm_campaign=SEM%7CLNRS%7CUS%7CEN%7CTMX%7CBR%7CBing&utm_term=threat%20metrix&utm_network=o&utm_device=c&msclkid=1e85e32ec18c1ae9bbc1bc2998e026bd)

2. Create a LexisNexis policy that meets your requirements. Use the documentation available [here](https://risk.lexisnexis.com/products/threatmetrix/?utm_source=bingads&utm_medium=ppc&utm_campaign=SEM%7CLNRS%7CUS%7CEN%7CTMX%7CBR%7CBing&utm_term=threat%20metrix&utm_network=o&utm_device=c&msclkid=1e85e32ec18c1ae9bbc1bc2998e026bd).

>[!NOTE]
> The name of the policy will be used later.

Once an account is created, you'll receive the information you need for API configuration. The following sections describe the process.

## Configure Azure AD B2C with LexisNexis

### Part 1 - Deploy the API

Deploy the provided [API code](https://github.com/azure-ad-b2c/partner-integrations/tree/master/samples/ThreatMetrix/Api) to an Azure service. The code can be published from Visual Studio, following these [instructions](https://docs.microsoft.com/visualstudio/deployment/quickstart-deploy-to-azure?view=vs-2019).

>[!NOTE]
>You'll need the URL of the deployed service to configure Azure AD with the required settings.

### Part 2 - Configure the API

Application settings can be [configured in the App service in Azure](https://docs.microsoft.com/azure/app-service/configure-common#configure-app-settings).  With this method,  settings can be securely configured without checking them into a repository. You'll need to provide the following settings to the Rest API:

| Application settings | Source | Notes |
| :-------- | :------------| :-----------|
|ThreatMetrix: Url | ThreatMetrix account configuration |     |
|ThreatMetrix:OrgId | ThreatMetrix account configuration |     |
|ThreatMetrix:ApiKey |ThreatMetrix account configuration|  |
|ThreatMetrix: Policy | Name of policy created in ThreatMetrix | |
| BasicAuth:ApiUsername |Define a username for the API| Username will be used in the Azure AD B2C configuration
| BasicAuth:ApiPassword | Define a password for the API | Password will be used in the Azure AD B2C configuration

### Part 3 - Deploy the UI

This solution uses custom UI templates that are loaded by Azure AD B2C. These UI templates do the profiling that is sent directly to the ThreatMetrix service.

Refer to these [instructions](https://docs.microsoft.com/azure/active-directory-b2c/custom-policy-ui-customization#custom-page-content-walkthrough) to deploy the included [UI files](https://github.com/azure-ad-b2c/partner-integrations/tree/master/samples/ThreatMetrix/ui-template) to a blob storage account. The instructions include setting up a blob storage account, configuring CORS, and enabling public access.

The UI is based on the [ocean blue template](https://github.com/azure-ad-b2c/partner-integrations/tree/master/samples/ThreatMetrix/ui-template/ocean_blue). All links within the UI should be updated to refer to the deployed location. In the UI folder, find and replace https://yourblobstorage/blobcontainer with the deployed location.

### Part 4 - Create API policy keys

Refer to this [document](https://docs.microsoft.com/azure/active-directory-b2c/secure-rest-api#add-rest-api-username-and-password-policy-keys) and create two policy keys – one for the API username, and one for the API password that you defined above.

The sample policy uses these key names:

- B2C_1A_RestApiUsername

- B2C_1A_RestApiPassword

### Part 5 - Update the API URL

In the provided [TrustFrameworkExtensions policy](https://github.com/azure-ad-b2c/partner-integrations/blob/master/samples/ThreatMetrix/policy/TrustFrameworkExtensions.xml), find the technical profile named `Rest-LexisNexus-SessionQuery`, and update the `ServiceUrl` metadata item with the location of the API deployed above.

### Part 6 - Update UI URL

In the provided [TrustFrameworkExtensions policy](https://github.com/azure-ad-b2c/partner-integrations/blob/master/samples/ThreatMetrix/policy/TrustFrameworkExtensions.xml), do a find and replace to search for https://yourblobstorage/blobcontainer/ with the location the UI files are deployed to.

>[!NOTE]
> As a best practice, we recommend that customers add consent notification in the attribute collection page. Notify users that information will be send to third-party services for Identity verification.

### Part 7 - Configure the Azure AD B2C policy

Refer to this [document](https://docs.microsoft.com/azure/active-directory-b2c/custom-policy-get-started?tabs=applications#custom-policy-starter-pack) to download [Local Accounts starter pack](https://github.com/Azure-Samples/active-directory-b2c-custom-policy-starterpack/tree/master/LocalAccounts) and configure the [policy](https://github.com/azure-ad-b2c/partner-integrations/tree/master/samples/ThreatMetrix/policy) for the Azure AD B2C tenant.

>[!NOTE]
>Update the provided policies to relate to your specific tenant.

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

7. ThreatMetrix puzzle will pop up after you enter **continue**.

## Next steps

For additional information, review the following articles:

- [Custom policies in Azure AD B2C](https://docs.microsoft.com/azure/active-directory-b2c/custom-policy-overview)

- [Get started with custom policies in Azure AD B2C](https://docs.microsoft.com/azure/active-directory-b2c/custom-policy-get-started?tabs=applications)
