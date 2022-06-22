---
title: Tutorial - Issue a Verifiable Credential for directory based claims 
description: In this tutorial, you learn how to issue verifiable credentials, from directory based claims, by using a sample app.
ms.service: decentralized-identity
ms.subservice: verifiable-credentials
author: barclayn
manager: rkarlin
ms.author: barclayn
ms.topic: tutorial
ms.date: 06/14/2022
# Customer intent: As an enterprise, we want to enable customers to manage information about themselves by using verifiable credentials.

---


# Issue a Verifiable Credential for directory based claims 

[!INCLUDE [Verifiable Credentials announcement](../../../includes/verifiable-credentials-brand.md)]

In this guide you will create a credential where the claims come from a user profile in the directory of the Azure AD tenant. With directory based claims you can create Verifiable Credentials of type VerifiedEmployee, if the users in the directory are employees.

In this article, you learn how to:

> [!div class="checklist"]
>
> - Create a user in the directory
> - Setup the user for Microsoft Authenticator
> - Create a Verified employee credential
> - Configure the samples to issue and verify your VerifiedEmployee credential


## Prerequisites

- [Set up a tenant for Azure AD Verifiable Credentials](verifiable-credentials-configure-tenant.md).
- Complete the tutorial for [issuing](verifiable-credentials-configure-issuer.md) and [verification](verifiable-credentials-configure-verifier.md) of verifiable credentials.
- A mobile phone with Microsoft Authenticator that the simulate being the users phone

## Create a user in the directory
If you already have a test user, you can skip this section. If you want to create a test user, these are the steps.
1. As an **User Admin**, go to the Azure Active Directory blade in [portal.azure.com](https://portal.azure.com/#view/Microsoft_AAD_IAM/UsersManagementMenuBlade/~/MsGraphUsers)
1. Select **Users** and **+ New user**, then keep selection on [x] Create user
1. Fill in **User name**, **Name**, **First name** and **Last name**. 
1. Check **[x] Show Password** and copy the temporary password to somewhere, like Notepad, then click the Create button
1. Find the new user, click to **view profile** and click **Edit**. Update the following attributes then click Save:
    - Job Title
    - Email (in the Contact Info section. Does not have to be an existing email address) 
    - Photo (select JPG/PNG file with low, thumbnail like, resolution)
1. Open a new, private, browser window and navigate to page like [https://myapps.microsoft.com/](https://myapps.microsoft.com/) and login with your new user. The user name would be something like meganb@yourtenant.onmicrosoft.com. You will be prompted to change your password

## Setup the user for Microsoft Authenticator
Your test user needs to have Microsoft Authenticator setup for the account. In order to do this, follow these steps:
1. On your mobile test device, open Microsoft Authenticator, go to the Authenticator tab at the bottom and tap **+**  sign to **Add account**. Select **Work or school account** 
1. At the prompt, select **Sign in**. Do not select “Scan QR code”
1. Sign in with the test user’s credentials in the Azure AD tenant
1. Authenticator will launch [https://aka.ms/mfasetup](https://aka.ms/mfasetup) in the browser on your mobile device. You will need to sign in again with your test users credentials.
1. In the **Set up your account in the app**, click on the link **Pair your account to the app by clicking this link**. This will open the Microsoft Authenticator app and you will see your test user as an added account

If [https://aka.ms/mfasetup](https://aka.ms/mfasetup) launches without prompting you to login, that means you have already setup the authenticator for another user on this device and you are automatically signed in. Sign that user out in the browser you are currently in and then repeat the steps above. You will find the Sign out button in the top right corder if you zoom in on the page.

## Create a Verified employee credential

When you select + Add credential in the portal, you get the option to launch two Quickstarts. Select **Verified employee** and click Next. 

![Quickstart start screen](media/how-to-use-quickstart-verifiedemployee/verifiable-credentials-configure-verifiedemployee-quickstart.png)

In the next screen, you enter some of the Display definitions, like logo url, text and background color. Since this is a managed credential with directory based claims, you do not need to enter the rules definition details as they are predefined. The credential type will be **VerifiedEmployee** and the claims from the user’s profile are pre-set. Click Create to create the credential.

![Card styling](media/how-to-use-quickstart-verifiedemployee/verifiable-credentials-configure-verifiedemployee-styling.png)

## Claims schema for Verified employee credential

All of the claims in the Verified employee credential comes from attributes in the [user's profile](https://docs.microsoft.com/en-us/graph/api/resources/user?view=graph-rest-1.0) in Azure AD for the issuing tenant. All claims, except photo, come from the Microsoft Graph Query [https://graph.microsoft.com/v1.0/me](https://docs.microsoft.com/en-us/graph/api/user-get?view=graph-rest-1.0&tabs=http). The photo claim comes from the value returned from the Microsoft Graph Query [https://graph.microsoft.com/v1.0/me/photo/$value](https://docs.microsoft.com/en-us/graph/api/profilephoto-get?view=graph-rest-1.0).
.

| Claim | Directory attribute | Value  |
|---------|---------|---------|
| `revocationId` | `userPrincipalName`| The UPN of the user is added as a claim named `revocationId` and it is this claim who is index. *This name may change before the preview ends.*|
| `displayName` | `displayName` | The displayName of the user |
| `givenName` | `givenName` | First name of the user |
| `surname` | `surname` | Last name of the user |
| `jobTitle` | `jobTitle` | The user's job title. This attribute doesn't have a value by default in the user's profile. If there is no value, there will be no claim in the issued VC. | 
| `preferredLanguage` | `preferredLanguage` | Should follow [ISO 639-1](https://en.wikipedia.org/wiki/ISO_639-1) and contain a value like `en-us`. This attribute doesn't have a value by default in the user's profile. If there is no value, there will be no claim in the issued VC. |
| `mail` | `mail` | The user's email address. Note that this is not the same as the UPN. It is also an attribute that doesn't have a value by default. 
| `photo` | `photo` | The uploaded photo for the user. The image type (JPEG, PNG, etc), depends on what image type was uploaded. When presenting the photo claim to a verifier, the photo claim, if it has a value, will be in the format UrlEncode(Base64Encode(photo)). This means that to properly use the photo, the verifier application has to do the reverse, ie Base64Decode(UrlDecode(photo)).

See full Azure AD user profile properties reference [here](https://docs.microsoft.com/en-us/graph/api/resources/user?view=graph-rest-1.0#properties).

If attribute values change in the user's Azure AD profile, the VC will not automatically be reissued. It will have to be reissued manually, like the issuance process in the samples.

## Configure the samples to issue and verify your VerifiedEmployee credential

Verifiable Credentials for directory based claims can be issued and verified just like any other credentials you create. All you need is your issuer DID for your tenant, the credential type and the manifest url to your credential. The easiest way to find this for a Managed Credential is to go to your credential in the portal, select Issue credential and switch to Custom issue. This will bring up a textbox with a skeleton JSON payload for the Request Service API. 

![Custom issue](media/how-to-use-quickstart-verifiedemployee/verifiable-credentials-configure-verifiedemployee-custom-issue.png)

There you have these value that you can copy and paste to your sample deployment’s configuration files. Issuer’s DID is the authority value.

- **authority** - Issuer's DID
- **type** - the credential type. This will always be `VerifiedEmployee` for a verified employee credential
- **manifest** - the credential manifest URL

The configuration file depends on what sample you are using.

- **Dotnet** - [appsettings.json](https://github.com/Azure-Samples/active-directory-verifiable-credentials-dotnet/blob/main/1-asp-net-core-api-idtokenhint/appsettings.json)
- **node** - [config.json](https://github.com/Azure-Samples/active-directory-verifiable-credentials-node/blob/main/1-node-api-idtokenhint/config.json)
- **python** - [config.json](https://github.com/Azure-Samples/active-directory-verifiable-credentials-python/blob/main/1-python-api-idtokenhint/config.json)
- **Java** - values are set as environment variables in [run.cmd](https://github.com/Azure-Samples/active-directory-verifiable-credentials-java/blob/main/1-java-api-idtokenhint/run.cmd) and [run.sh](https://github.com/Azure-Samples/active-directory-verifiable-credentials-java/blob/main/1-java-api-idtokenhint/run.sh) or docker-run.cmd/docker-run.sh if you are using docker.

## Next steps

Learn [how to customize your verifiable credentials](credential-design.md).
