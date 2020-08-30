---
title: Tutorial to configure Azure Active Directory B2C with Jumio
titleSuffix: Azure AD B2C
description: Tutorial to configure Azure Active Directory B2C with Jumio for automated ID verification, safeguarding customer data
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

# Tutorial for configuring Jumio with Azure Active Directory B2C

In this sample tutorial, we provide guidance on how to integrate Azure AD B2C with [Jumio](https://www.jumio.com/). Jumio is an ID verification service, which enables real-time automated ID verification, safeguarding customer data.

## Prerequisites

To get started, you'll need:

- An Azure AD subscription. If you don't have a subscription, you can get a [free account](https://azure.microsoft.com/free/).

- An [Azure AD B2C tenant](https://review.docs.microsoft.com/azure/active-directory-b2c/tutorial-create-tenant). Tenant is linked to your Azure subscription.

## Scenario description

The Jumio integration includes the following components:

- Azure AD B2C – The authorization server, responsible for verifying the user’s credentials, also known as the identity provider

- Jumio – The service that takes the ID details provided by the user and verifies it.

- Intermediate Rest API – This API implements the integration between Azure AD B2C and the Jumio service.

- Blob storage – Used to supply custom UI files to the Azure AD B2C policies.

The following architecture diagram shows the implementation.

![Screenshot for jumio-architecture-diagram](./media/partner-jumio/jumio-architecture-diagram.png)

|Step | Description |
|:-----| :-----------|
| 1. | User arrives at a login page. Users select sign-up to create a new account and enter information into the page. Azure AD B2C collects the user attributes.
| 2. | Azure AD B2C calls the middle layer API and passes on the user attributes.
| 3. | Middle layer API collects user attributes and transforms it into a format that Jumio API could consume. Then after sends it to Jumio.
| 4. | After Jumio consumes the information and processes it, it returns result to the middle layer API.
| 5. | Middle layer API processes the information and sends back relevant information to Azure AD B2C.
| 6. | Azure AD B2C receives information back from middle layer API. If it shows a Failure response, an error message is displayed to user. If it shows a Success response, the user is authenticated and written into the directory.

## Onboard with Jumio

1. To create a Jumio account, contact [Jumio](https://www.jumio.com/contact/)

2. Once an account is created, information is used in the API configuration. The following sections describe the process.

## Configure Azure AD B2C with Jumio

### Part 1 - Deploy the API

Deploy the provided [API code](https://github.com/azure-ad-b2c/partner-integrations/tree/master/samples/Jumio/API/Jumio.Api) to an Azure service. The code can be published from Visual Studio, following these [instructions](https://docs.microsoft.com/visualstudio/deployment/quickstart-deploy-to-azure?view=vs-2019).

>[!NOTE]
>You'll need the URL of the deployed service to configure Azure AD with the required settings.

### Part 2 - Deploy the client certificate

1. The Jumio API call is protected by a client certificate. Create a self-signed certificate using the PowerShell sample code mentioned below:

``` PowerShell
$cert = New-SelfSignedCertificate -Type Custom -Subject "CN=Demo-SigningCertificate" -TextExtension @("2.5.29.37={text}1.3.6.1.5.5.7.3.3") -KeyUsage DigitalSignature -KeyAlgorithm RSA -KeyLength 2048 -NotAfter (Get-Date).AddYears(2) -CertStoreLocation "Cert:\CurrentUser\My"
$cert.Thumbprint
$pwdText = "Your password"
$pwd = ConvertTo-SecureString -String $pwdText -Force -AsPlainText
Export-PfxCertificate -Cert $Cert -FilePath "{your-local-path}\Demo-SigningCertificate.pfx" -Password $pwd.

```

2. The certificate will then be exported to the location specified for {``your-local-path``}.

3. Following the  instructions mentioned in this [document](https://docs.microsoft.com/azure/app-service/configure-ssl-certificate#upload-a-private-certificate), import the certificate to the Azure App service.

### Part 3 - Create a signing/encryption key

Create a random string with a length greater than 64 characters that contains only alphabets or numbers.

For example: ``C9CB44D98642A7062A0D39B94B6CDC1E54276F2E7CFFBF44288CEE73C08A8A65``

Use the PowerShell script below to create a 64-character length alphanumeric value.

```PowerShell
-join ((0x30..0x39) + ( 0x41..0x5A) + ( 0x61..0x7A) + ( 65..90 ) | Get-Random -Count 64  | % {[char]$_})

```

### Part 4 - Configure the API

Application settings can be [configured in the App service in Azure](https://docs.microsoft.com/azure/app-service/configure-common#configure-app-settings). With this method,  settings can be securely configured without checking them into a repository. You'll need to provide the following settings to the Rest API:

| Application settings | Source | Notes |
| :-------- | :------------| :-----------|
|JumioSettings:AuthUsername | Jumio account configuration |     |
|JumioSettings:AuthPassword | Jumio account configuration |     |
|AppSettings:SigningCertThumbprint|Thumbprint of self-signed certificate created|  |
|AppSettings:IdTokenSigningKey| Signing Key created using PowerShell | |
| AppSettings:IdTokenEncryptionKey |Encryption Key created using PowerShell
| AppSettings:IdTokenIssuer | Issuer to be used for the JWT token (a guid value is preferred) |
| AppSettings:IdTokenAudience  | Audience to be used for the JWT token (a guid value is preferred) |
|AppSettings:BaseRedirectUrl | The base url of the B2C policy | https://{your-tenant-name}.b2clogin.com/{your-application-id}|
| WEBSITE_LOAD_CERTIFICATES| Thumbprint of self-signed certificate created |

### Part 5 - Deploy the UI

1. Set up a [blob storage container in your storage account](https://docs.microsoft.com/azure/storage/blobs/storage-quickstart-blobs-portal#create-a-container).

2. Store the UI files from the [UI folder](https://github.com/azure-ad-b2c/partner-integrations/tree/master/samples/Jumio/UI) to your blob container.

#### Update UI Files

1. In the UI files, go to the folder [ocean_blue](https://github.com/azure-ad-b2c/partner-integrations/tree/master/samples/Jumio/UI/ocean_blue)

2. Open each html file.

3. Find and replace {your-ui-blob-container-url} with your blob container URL.

4. Find and replace {your-intermediate-api-url} with the URL of the intermediate API app service.

>[!NOTE]
> As a best practice, we recommend that customers add consent notification in the attribute collection page. Notify users that information will be send to third-party services for Identity verification.

### Part 6 - Configure the Azure AD B2C policy

1. Go to the [Azure AD B2C policy](https://github.com/azure-ad-b2c/partner-integrations/tree/master/samples/Jumio/Policies) in the Policies folder.

2. Follow this [document](https://docs.microsoft.com/azure/active-directory-b2c/custom-policy-get-started?tabs=applications#custom-policy-starter-pack) to download [LocalAccounts starter pack](https://github.com/Azure-Samples/active-directory-b2c-custom-policy-starterpack/tree/master/LocalAccounts)

3. Configure the policy for the Azure AD B2C tenant.

>[!NOTE]
>Update the provided policies to relate to your specific tenant.

## Test the user flow

1. Open the Azure AD B2C tenant and under Policies select **Identity Experience Framework**.

2. Select your previously created **SignUpSignIn**.

3. Select **Run user flow** and select the settings:

   a. **Application**: select the registered app (sample is JWT)

   b. **Reply URL**: select the **redirect URL**

   c. Select **Run user flow**.

4. Go through sign-up flow and create an account

5. Jumio service will be called during the flow, after user attribute is created. If the flow is incomplete, check that user isn't saved in the directory.

## Next steps

For additional information, review the following articles:

- [Custom policies in Azure AD B2C](https://docs.microsoft.com/azure/active-directory-b2c/custom-policy-overview)

- [Get started with custom policies in Azure AD B2C](https://docs.microsoft.com/azure/active-directory-b2c/custom-policy-get-started?tabs=applications)
