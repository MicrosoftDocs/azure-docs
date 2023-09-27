---
title: Tutorial - Configure Microsoft Entra Verified ID verifier
description: In this tutorial, you learn how to configure your tenant to verify credentials.
ms.service: decentralized-identity
ms.subservice: verifiable-credentials
author: barclayn
manager: amycolannino
ms.author: barclayn
ms.topic: tutorial
ms.date: 08/16/2022
# Customer intent: As an enterprise, we want to enable customers to manage information about themselves by using verifiable credentials.

---

# Configure Microsoft Entra Verified ID verifier

[!INCLUDE [Verifiable Credentials announcement](../../../includes/verifiable-credentials-brand.md)]

In [Issue Microsoft Entra Verified ID credentials from an application](verifiable-credentials-configure-issuer.md), you learn how to issue and verify credentials by using the same Microsoft Entra tenant. In a real-world scenario, where the issuer and verifier are separate organizations, the verifier uses *their own* Microsoft Entra tenant to perform the verification of the credential that was issued by the other organization. In this tutorial, you go over the steps needed to present and verify your first verifiable credential: a verified credential expert card.

As a verifier, you unlock privileges to subjects that possess verified credential expert cards. In this tutorial, you run a sample application from your local computer that asks you to present a verified credential expert card, and then verifies it.

In this article, you learn how to:

> [!div class="checklist"]
>
> - Download the sample application code to your local computer
> - Set up Microsoft Entra Verified ID on your Microsoft Entra tenant
> - Gather credentials and environment details to set up your sample application, and update the sample application with your verified credential expert card details
> - Run the sample application and initiate a verifiable credential issuance process

## Prerequisites

- [Set up a tenant for Microsoft Entra Verified ID](verifiable-credentials-configure-tenant.md).
- If you want to clone the repository that hosts the sample app, install [Git](https://git-scm.com/downloads).
- [Visual Studio Code](https://code.visualstudio.com/Download) or similar code editor.
- [.NET 5.0](https://dotnet.microsoft.com/download/dotnet/5.0).
- Download [ngrok](https://ngrok.com/) and sign up for a free account. If you can't use `ngrok` in your organization, please read this [FAQ](verifiable-credentials-faq.md#i-cannot-use-ngrok-what-do-i-do).
- A mobile device with Microsoft Authenticator:
  - Android version 6.2206.3973 or later installed.
  - iOS version 6.6.2 or later installed.

## Gather tenant details to set up your sample application

Now that you've set up your Microsoft Entra Verified ID service, you're going to gather some information about your environment and the verifiable credentials you set. You use these pieces of information when you set up your sample application.

1. From **Verified ID**, select **Organization settings**.
1. Copy the **Tenant identifier** value, and record it for later.
1. Copy the **Decentralized identifier** value, and record it for later.

The following screenshot demonstrates how to copy the required values:

![Screenshot that demonstrates how to copy the required values from Microsoft Entra Verified ID.](media/verifiable-credentials-configure-verifier/tenant-settings.png)

## Download the sample code

The sample application is available in .NET, and the code is maintained in a GitHub repository. Download the sample code from the [GitHub repo](https://github.com/Azure-Samples/active-directory-verifiable-credentials-dotnet), or clone the repository to your local computer:

```bash
git clone git@github.com:Azure-Samples/active-directory-verifiable-credentials-dotnet.git 
```

## Configure the verifiable credentials app

Create a client secret for the registered application you created. The sample application uses the client secret to prove its identity when it requests tokens.

1. In Microsoft Entra ID, go to **App registrations**.

1. Select the **verifiable-credentials-app** application you created earlier.

1. Select the name to go into the **App registrations details**.

1. Copy the **Application (client) ID** value, and store it for later. 

    ![Screenshot that shows how to get the app ID.](media/verifiable-credentials-configure-verifier/get-app-id.png)

1. In **App registration details**, from the main menu, under **Manage**, select **Certificates & secrets**.

1. Select **New client secret**.

    1. In the **Description** box, enter a description for the client secret (for example, vc-sample-secret).

    1. Under **Expires**, select a duration for which the secret is valid (for example, six months). Then select **Add**.

    1. Record the secret's **Value**. This value is needed in a later step. The secret’s value won't be displayed again, and isn't retrievable by **any** other means, so you should record it once it's visible.

At this point, you should have all the required information that you need to set up your sample application.

## Update the sample application

Now make modifications to the sample app's issuer code to update it with your verifiable credential URL. This step allows you to issue verifiable credentials by using your own tenant.

1. In the *active-directory-verifiable-credentials-dotnet-main* directory, open **Visual Studio Code**. Select the project inside the *1. asp-net-core-api-idtokenhint* directory.

1. Under the project root folder, open the *appsettings.json* file. This file contains information about your credentials in Microsoft Entra Verified ID environment. Update the following properties with the information that you collected during earlier steps.

    1. **Tenant ID**: Your tenant ID
    1. **Client ID**: Your client ID
    1. **Client Secret**: Your client secret
    1. **VerifierAuthority**: Your decentralized identifier
    1. **CredentialManifest**: Your issue credential URL

1. Save the *appsettings.json* file.

The following JSON demonstrates a complete *appsettings.json* file:

```json
{

 "AppSettings": {
   "Endpoint": "https://verifiedid.did.msidentity.com/v1.0",
   "VCServiceScope": "3db474b9-6a0c-4840-96ac-1fceb342124f/.default",
   "Instance": "https://login.microsoftonline.com/{0}",
   "TenantId": "987654321-0000-0000-0000-000000000000",
   "ClientId": "555555555-0000-0000-0000-000000000000",
   "ClientSecret": "123456789012345678901234567890",
   "VerifierAuthority": "did:ion:EiDJzvzaBMb_EWTWUFEasKzL2nL-BJPhQTzYWjA_rRz3hQ:eyJkZWx0YSI6eyJwYXRjaGVzIjpbeyJhY3Rpb24iOiJyZXBsYWNlIiwiZG9jdW1lbnQiOnsicHVibGljS2V5cyI6W3siaWQiOiJzaWdfMmNhMzY2YmUiLCJwdWJsaWNLZXlKd2siOnsiY3J2Ijoic2VjcDI1NmsxIiwia3R5IjoiRUMiLCJ4IjoiZDhqYmduRkRGRElzR1ZBTWx5aDR1b2RwOGV4Q2dpV3dWUGhqM0N...",
   "CredentialManifest": " https://verifiedid.did.msidentity.com/v1.0/987654321-0000-0000-0000-000000000000/verifiableCredentials/contracts/VerifiedCredentialExpert"
 }
}
```

## Run and test the sample app

Now you are ready to present and verify your first verified credential expert card by running the sample application.

1. From Visual Studio Code, run the *Verifiable_credentials_DotNet* project. Or from the command shell, run the following commands:

    ```bash
    cd active-directory-verifiable-credentials-dotnet/1-asp-net-core-api-idtokenhint
    dotnet build "AspNetCoreVerifiableCredentials.csproj" -c Debug -o .\bin\Debug\netcoreapp3.1  
    dotnet run
    ```

1. In another terminal, run the following command. This command runs the [ngrok](https://ngrok.com/) to set up a URL on 5000 and make it publicly available on the internet.

    ```bash
    ngrok http 5000 
    ```
    
    >[!NOTE]
    > On some computers, you might need to run the command in this format: `./ngrok http 3000`.

1. Open the HTTPS URL generated by ngrok.

    ![Screenshot showing how to get the ngrok public URL.](media/verifiable-credentials-configure-verifier/run-ngrok.png)

1. From the web browser, select **Verify Credential**.

    ![Screenshot showing how to verify credential from the sample app.](media/verifiable-credentials-configure-verifier/verify-credential.png)

1. Using Authenticator, scan the QR code, or scan it directly from your mobile camera.

1. When you see the warning message, *This app or website may be risky*, select **Advanced**. You are seeing this warning because your domain isn't verified. For this tutorial, you can skip the domain registration.  

    ![Screenshot showing how to choose advanced on the risky authenticator app warning.](media/verifiable-credentials-configure-verifier/at-risk.png)
    

1. At the risky website warning, select **Proceed anyways (unsafe)**.  
 
    ![Screenshot showing how to proceed with the risky warning.](media/verifiable-credentials-configure-verifier/proceed-anyway.png)

1. Approve the request by selecting **Allow**.

    ![Screenshot showing how to approve the presentation request.](media/verifiable-credentials-configure-verifier/approve-presentation-request.jpg)

1. After you approve the request, you can see that the request has been approved. You can also check the log. To see the log, select the verifiable credential.

    ![Screenshot showing a verified credential expert card.](media/verifiable-credentials-configure-verifier/verifable-credential-info.png)

1. Then select **Recent Activity**.  

    ![Screenshot showing the recent activity button that takes you to the credential history.](media/verifiable-credentials-configure-verifier/verifable-credential-history.jpg)

1. **Recent Activity** shows you the recent activities of your verifiable credential.

    ![Screenshot showing the history of the verifiable credential.](media/verifiable-credentials-configure-issuer/verify-credential-history.jpg)

1. Go back to the sample app. It shows you that the presentation of the verifiable credentials was received.

    ![Screenshot showing that the presentation of the verifiable credentials was received.](media/verifiable-credentials-configure-verifier/presentation-received.png)

## Next steps

Learn [how to customize your verifiable credentials](credential-design.md).
