---
title: Tutorial to configure Azure Active Directory B2C with Jumio
titleSuffix: Azure AD B2C
description: In this tutorial, you configure Azure Active Directory B2C with Jumio for automated ID verification, safeguarding customer data.
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

In this sample tutorial, we provide guidance on how to integrate Azure Active Directory B2C (Azure AD B2C) with [Jumio](https://www.jumio.com/). Jumio is an ID verification service that enables real-time automated ID verification to help safeguard customer data.

## Prerequisites

To get started, you'll need:

- An Azure AD subscription. If you don't have a subscription, you can get a [free account](https://azure.microsoft.com/free/).

- An [Azure AD B2C tenant](https://docs.microsoft.com/azure/active-directory-b2c/tutorial-create-tenant) that's linked to your Azure subscription.

## Scenario description

The Jumio integration includes the following components:

- Azure AD B2C: The authorization server that's responsible for verifying the user's credentials. It's also known as the identity provider.

- Jumio: The service that takes the ID details provided by the user and verifies them.

- Intermediate Rest API: The API that implements the integration between Azure AD B2C and the Jumio service.

- Azure Blob storage: The service that supplies custom UI files to the Azure AD B2C policies.

The following architecture diagram shows the implementation.

![Diagram of the architecture of a Azure AD B2C integration with Jumio.](./media/partner-jumio/jumio-architecture-diagram.png)

|Step | Description |
|:-----| :-----------|
| 1. | The user arrives at a page to either sign in or sign up to create an account. Azure AD B2C collects the user attributes.
| 2. | Azure AD B2C calls the middle-layer API and passes on the user attributes.
| 3. | The middle-layer API collects user attributes and transforms them into a format that Jumio API can consume. Then it sends the attributes to Jumio.
| 4. | After Jumio consumes the information and processes it, it returns the result to the middle-layer API.
| 5. | The middle-layer API processes the information and sends back relevant information to Azure AD B2C.
| 6. | Azure AD B2C receives information back from the middle-layer API. If it shows a failure response, an error message is displayed to user. If it shows a success response, the user is authenticated and written into the directory.

## Sign up with Jumio

To create a Jumio account, contact [Jumio](https://www.jumio.com/contact/).

## Configure Azure AD B2C with Jumio

After you create a Jumio account, you use the account to configure Azure AD B2C. The following sections describe the process in sequence.

### Deploy the API

Deploy the provided [API code](https://github.com/azure-ad-b2c/partner-integrations/tree/master/samples/Jumio/API/Jumio.Api) to an Azure service. You can publish the code from Visual Studio, by following [these instructions](https://docs.microsoft.com/visualstudio/deployment/quickstart-deploy-to-azure?view=vs-2019).

>[!NOTE]
>You'll need the URL of the deployed service to configure Azure AD with the required settings.

### Deploy the client certificate

1. A client certificate helps protect the Jumio API call. Create a self-signed certificate by using the following PowerShell sample code:

   ``` PowerShell
   $cert = New-SelfSignedCertificate -Type Custom -Subject "CN=Demo-SigningCertificate" -TextExtension @("2.5.29.37={text}1.3.6.1.5.5.7.3.3") -KeyUsage DigitalSignature -KeyAlgorithm RSA -KeyLength 2048 -NotAfter (Get-Date).AddYears(2) -CertStoreLocation "Cert:\CurrentUser\My"
   $cert.Thumbprint
   $pwdText = "Your password"
   $pwd = ConvertTo-SecureString -String $pwdText -Force -AsPlainText
   Export-PfxCertificate -Cert $Cert -FilePath "{your-local-path}\Demo-SigningCertificate.pfx" -Password $pwd.

   ```

   The certificate is then exported to the location specified for ``{your-local-path}``.

3. Import the certificate to Azure App Service by following the  instructions in [this article](https://docs.microsoft.com/azure/app-service/configure-ssl-certificate#upload-a-private-certificate).

### Create a signing/encryption key

Create a random string with a length greater than 64 characters that contains only letters and numbers.

For example: ``C9CB44D98642A7062A0D39B94B6CDC1E54276F2E7CFFBF44288CEE73C08A8A65``

Use the following PowerShell script to create the string:

```PowerShell
-join ((0x30..0x39) + ( 0x41..0x5A) + ( 0x61..0x7A) + ( 65..90 ) | Get-Random -Count 64  | % {[char]$_})

```

### Configure the API

You can [configure application settings in Azure App Service](https://docs.microsoft.com/azure/app-service/configure-common#configure-app-settings). With this method, you can securely configure settings without checking them into a repository. You'll need to provide the following settings to the Rest API:

| Application settings | Source | Notes |
| :-------- | :------------| :-----------|
|JumioSettings:AuthUsername | Jumio account configuration |     |
|JumioSettings:AuthPassword | Jumio account configuration |     |
|AppSettings:SigningCertThumbprint|Thumbprint of the created self-signed certificate|  |
|AppSettings:IdTokenSigningKey| Signing key created using PowerShell | |
| AppSettings:IdTokenEncryptionKey |Encryption key created using PowerShell
| AppSettings:IdTokenIssuer | Issuer to be used for the JWT token (a GUID value is preferred) |
| AppSettings:IdTokenAudience  | Audience to be used for the JWT token (a GUID value is preferred) |
|AppSettings:BaseRedirectUrl | Base URL of the Azure AD B2C policy | https://{your-tenant-name}.b2clogin.com/{your-application-id}|
| WEBSITE_LOAD_CERTIFICATES| Thumbprint of the created self-signed certificate |

### Deploy the UI

1. Set up a [blob storage container in your storage account](https://docs.microsoft.com/azure/storage/blobs/storage-quickstart-blobs-portal#create-a-container).

2. Store the UI files from the [UI folder](https://github.com/azure-ad-b2c/partner-integrations/tree/master/samples/Jumio/UI) in your blob container.

#### Update UI files

1. In the UI files, go to the folder [ocean_blue](https://github.com/azure-ad-b2c/partner-integrations/tree/master/samples/Jumio/UI/ocean_blue).

2. Open each HTML file.

3. Find and replace `{your-ui-blob-container-url}` with the URL of your blob container.

4. Find and replace `{your-intermediate-api-url}` with the URL of the intermediate API app service.

>[!NOTE]
> As a best practice, we recommend that you add consent notification on the attribute collection page. Notify users that the information will be sent to third-party services for identity verification.

### Configure the Azure AD B2C policy

1. Go to the [Azure AD B2C policy](https://github.com/azure-ad-b2c/partner-integrations/tree/master/samples/Jumio/Policies) in the Policies folder.

2. Follow [this article](https://docs.microsoft.com/azure/active-directory-b2c/custom-policy-get-started?tabs=applications#custom-policy-starter-pack) to download the [LocalAccounts starter pack](https://github.com/Azure-Samples/active-directory-b2c-custom-policy-starterpack/tree/master/LocalAccounts).

3. Configure the policy for the Azure AD B2C tenant.

>[!NOTE]
>Update the provided policies to relate to your specific tenant.

## Test the user flow

1. Open the Azure AD B2C tenant. Under **Policies**, select **Identity Experience Framework**.

2. Select your previously created **SignUpSignIn**.

3. Select **Run user flow** and then:

   a. For **Application**, select the registered app (the sample is JWT).

   b. For **Reply URL**, select the **redirect URL**.

   c. Select **Run user flow**.

4. Go through the sign-up flow and create an account.

5. The Jumio service will be called during the flow, after the user attribute is created. If the flow is incomplete, check that the user isn't saved in the directory.

## Next steps

For additional information, review the following articles:

- [Custom policies in Azure AD B2C](https://docs.microsoft.com/azure/active-directory-b2c/custom-policy-overview)

- [Get started with custom policies in Azure AD B2C](https://docs.microsoft.com/azure/active-directory-b2c/custom-policy-get-started?tabs=applications)
