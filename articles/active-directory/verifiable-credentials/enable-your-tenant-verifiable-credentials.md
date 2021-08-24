---
title: Tutorial - Configure Azure Active Directory to issue verifiable credentials (preview)
description: In this tutorial, you build the environment needed to deploy verifiable credentials in your tenant.
documentationCenter: ''
author: barclayn
manager: daveba
ms.custom: subject-rbac-steps
ms.service: active-directory
ms.topic: tutorial
ms.subservice: verifiable-credentials
ms.date: 06/24/2021
ms.author: barclayn
ms.reviewer: 

# Customer intent: As an administrator, I want the high-level steps that I should follow so that I can quickly start using verifiable credentials in my own Azure Active Directory.

---

# Tutorial - Configure Azure Active Directory to issue verifiable credentials (preview)

In this tutorial, you'll build on the work done as part of the [Get started](get-started-verifiable-credentials.md) article and set up Azure Active Directory (Azure AD) with its own [decentralized identifier](https://www.microsoft.com/security/business/identity-access-management/decentralized-identity-blockchain?rtc=1#:~:text=Decentralized%20identity%20is%20a%20trust,protect%20privacy%20and%20secure%20transactions.) (DID). You'll use the DID to issue a verifiable credential by using the sample app and your issuer. In this tutorial, you'll still use the sample Azure B2C tenant for authentication. In the next tutorial, you'll take steps to get the app configured to work with Azure AD.

> [!IMPORTANT]
> Azure Active Directory Verifiable Credentials is currently in public preview.
> This preview version is provided without a service level agreement, and we don't recommend it for production workloads. Certain features might not be supported or might have constrained capabilities.
> For more information, see [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).

In this article, you:

> [!div class="checklist"]
> * Create the necessary services to onboard Azure AD for verifiable credentials.
> * Create your DID.
> * Customize the rules and display files.
> * Configure verifiable credentials in Azure AD.

## Prerequisites

Before you can successfully complete this tutorial, you must first:

- Complete the steps in the [Get started](get-started-verifiable-credentials.md) tutorial.
- Have an Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).
- Have Azure AD with a P2 [license](https://www.microsoft.com/security/business/identity-access-management/azure-ad-pricing). If you don't have one, follow the steps in [Create a free developer account](how-to-create-a-free-developer-account.md).
- Have an instance of [Azure Key Vault](../../key-vault/general/overview.md) where you have rights to create keys and secrets.

## Azure Active Directory

Before you start, you need an Azure AD tenant. When your tenant is enabled for verifiable credentials, it's assigned a DID. It's also enabled with an issuer service for issuing verifiable credentials. Any verifiable credential you issue is issued by your tenant and its DID. The DID is also used when you verify verifiable credentials.

If you just created a test Azure subscription, your tenant doesn't need to be populated with user accounts. You'll need at least one user test account to complete later tutorials.

## Create a key vault

When you work with verifiable credentials, you have complete control and management of the cryptographic keys your tenant uses to digitally sign verifiable credentials. To issue and verify credentials, you must provide Azure AD with access to your own instance of Key Vault.

1. In the Azure portal, or on the home page, select **Create a resource**.
1. In the search box, enter **key vault**.
1. From the results list, select **Key Vault**.
1. In the **Key Vault** section, select **Create**.
1. In the **Create key vault** section, provide the following information:
    - **Subscription**: Select a subscription.
    - **Resource group**: Select **Create new**, and enter a resource group name such as **vc-resource-group**. We use the same resource group name across multiple articles.
    - **Name**: A unique name is required. We use **woodgroup-vc-kv**, so replace this value with your own unique name.
    - **Location**: Select a location.
    - Leave the other options set to their defaults.
1. After you provide the information, select **Access Policy**.

    ![Screenshot that shows the Create key vault screen.](media/enable-your-tenant-verifiable-credentials/create-key-vault.png)

1. On the **Access policy** screen, select **Add Access Policy**.

    >[!NOTE]
    > By default, the account that creates the key vault is the only one with access. The verifiable credential service needs access to the key vault. The key vault must have an access policy that allows the admin to create keys, have the ability to delete keys if you opt out, and permission to sign to create the domain binding for the verifiable credential. If you use the same account while testing, modify the default policy to grant the account **Sign** permission, in addition to the default permissions granted to vault creators.

1. For the user admin, make sure the key permissions section has **Create**, **Delete**, and **Sign** enabled. By default, **Create** and **Delete** are already enabled. **Sign** should be the only key permission you need to update.

    ![Screenshot that shows the key vault permissions.](media/enable-your-tenant-verifiable-credentials/keyvault-access.png)

1. Select **Review + create**.
1. Select **Create**.
1. Go to the vault and make a note of the vault name and URI.

Take note of the following two properties:

- **Vault Name**: In the example, the key vault name is **woodgrove-vc-kv**. You use this name for other steps.
- **Vault URI**: In the example, this value is https://woodgrove-vc-kv.vault.azure.net/. Applications that use your vault through its REST API must use this URI.

>[!NOTE]
> Each key vault transaction results in more Azure subscription costs. For more information, see the [Key Vault pricing page](https://azure.microsoft.com/pricing/details/key-vault/).

>[!IMPORTANT]
> During the Azure Active Directory Verifiable Credentials preview, don't modify keys and secrets created in your vault after they're created. Deleting, disabling, or updating your keys and secrets invalidates any issued credentials.

## Create modified rules and display files

In this section, you'll use the rules and display files from the [sample issuer app](https://github.com/Azure-Samples/active-directory-verifiable-credentials/)
 and modify them slightly to create your tenant's first verifiable credential.

1. Copy both the rules and display JSON files to a temporary folder. Rename them **MyFirstVC-display.json** and **MyFirstVC-rules.json**, respectively. You can find both files under **issuer\issuer_config**.

   ![Screenshot that shows the rules and display files as part of the sample app directory.](media/enable-your-tenant-verifiable-credentials/sample-app-rules-display.png)

   ![Screenshot that shows the rules and display files in a temp folder.](media/enable-your-tenant-verifiable-credentials/display-rules-files-temp.png)

1. Open the **MyFirstVC-rules.json** file in your code editor.

    ```json
         {
          "attestations": {
            "idTokens": [
              {
                "mapping": {
                  "firstName": { "claim": "given_name" },
                  "lastName": { "claim": "family_name" }
                },
                "configuration": "https://didplayground.b2clogin.com/didplayground.onmicrosoft.com/B2C_1_sisu/v2.0/.well-known/openid-configuration",
                "client_id": "8d5b446e-22b2-4e01-bb2e-9070f6b20c90",
                "redirect_uri": "vcclient://openid/"
              }
            ]
          },
          "validityInterval": 2592000,
          "vc": {
            "type": ["VerifiedCredentialExpert"]
          }
        }
      
    ```

   Now, change the "type" field to **"MyFirstVC"**.

   ```json
    "type": ["MyFirstVC"]
  
   ```

   Save this change.

   >[!NOTE]
   > You don't change the "configuration" or "client_id" values at this point in the tutorial. You'll still use the sample Azure tenant you used in the [Get started](get-started-verifiable-credentials.md) tutorial. You'll use Azure AD in the next tutorial.

1. Open the **MyFirstVC-display.json** file in your code editor.

   ```json
       {
          "default": {
           "locale": "en-US",
           "card": {
             "title": "Verified Credential Expert",
             "issuedBy": "Microsoft",
             "backgroundColor": "#000000",
             "textColor": "#ffffff",
             "logo": {
               "uri": "https://didcustomerplayground.blob.core.windows.net/public/VerifiedCredentialExpert_icon.png",
               "description": "Verified Credential Expert Logo"
             },
             "description": "Use your verified credential to prove to anyone that you know all about verifiable credentials."
           },
           "consent": {
             "title": "Do you want to get your Verified Credential?",
             "instructions": "Sign in with your account to get your card."
           },
           "claims": {
             "vc.credentialSubject.firstName": {
               "type": "String",
               "label": "First name"
             },
             "vc.credentialSubject.lastName": {
               "type": "String",
               "label": "Last name"
             }
           }
         }
      }
   ```

   Make modifications so this verifiable credential looks visibly different from the sample code's version.

    ```json
         "card": {
            "title": "My First VC",
            "issuedBy": "Your Issuer Name",
            "backgroundColor": "#ffffff",
            "textColor": "#000000",
          }
    ```
 
   >[!NOTE]
   > To ensure that your credential is readable and accessible, select text and background colors with a [contrast ratio](https://www.w3.org/WAI/WCAG21/Techniques/general/G18) of at least 4.5:1.

   Save these changes.

## Create a storage account

Before you create your first verifiable credential, create an Azure Blob Storage container that can hold your configuration and rules files.

1. Create a storage account by using the options shown. For detailed steps, see [Create a storage account](../../storage/common/storage-account-create.md?tabs=azure-portal).

   - **Subscription**: The subscription that you're using for these tutorials
   - **Resource group**: The same resource group you used in earlier tutorials (**vc-resource-group**)
   - **Name**: A unique name
   - **Location**: (US) EAST US
   - **Performance**: Standard
   - **Account kind**: Storage V2
   - **Replication**: Locally redundant
 
   ![Screenshot that shows the Create storage account screen.](media/enable-your-tenant-verifiable-credentials/create-storage-account.png)

1. After you create the storage account, create a container. Under **Blob Storage**, select **Containers**. Create a container by using these values:

    - **Name**: vc-container
    - **Public access level**: Private (no anonymous access)
  
   Select **Create**.

   ![Screenshot that shows creating a container.](media/enable-your-tenant-verifiable-credentials/new-container.png)

1. Now select your new container and upload both the new rules and display files **MyFirstVC-display.json** and **MyFirstVC-rules.json** you created earlier.

   ![Screenshot that shows uploading rules files.](media/enable-your-tenant-verifiable-credentials/blob-storage-upload-rules-display-files.png)

## Assign a blob role

Before you create the credential, you need to first give the signed-in user the correct role assignment so they can access the files in Storage Blob.

1. Go to **Storage** > **Container**.
1. Select **Access control (IAM)**.
1. Select **Add** > **Add role assignment** to open the **Add role assignment** page.
1. Assign the following role. For detailed steps, see [Assign Azure roles using the Azure portal](../../role-based-access-control/role-assignments-portal.md).
    
    | Setting | Value |
    | --- | --- |
    | Role | Storage Blob Data Reader |
    | Assign access to | User, group, or service principal |
    | Select | &lt;account that you're using to perform these steps&gt; |

    ![Screenshot that shows the Add role assignment page in the Azure portal.](../../../includes/role-based-access-control/media/add-role-assignment-page.png)

  >[!IMPORTANT]
  >By default, container creators get the Owner role assigned. The Owner role isn't enough on its own. Your account needs the Storage Blob Data Reader role. For more information, see [Use the Azure portal to assign an Azure role for access to blob and queue data](../../storage/blobs/assign-azure-role-data-access.md).

## Set up Verifiable Credentials Preview

Now you take the last step to set up your tenant for verifiable credentials.

1. In the Azure portal, search for **verifiable credentials**.
1. Select **Verifiable Credentials (Preview)**.
1. Select **Get started**.
1. Set up your organization by providing the following information:

      - **Organization name**: Enter a name to reference your business within Verifiable Credentials. This value isn't customer facing.
      - **Domain:** Enter a domain that's added to a service endpoint in your DID document. [Microsoft Authenticator](../user-help/user-help-auth-app-download-install.md) and other wallets use this information to validate that your DID is [linked to your domain](how-to-dnsbind.md). If the wallet can verify the DID, it displays a verified symbol. If the wallet is unable to verify the DID, it informs the user that the credential was issued by an organization it couldn't validate. The domain is what binds your DID to something tangible that the user might know about your business.
      - **Key vault:** Enter the name of the key vault that you created earlier.

   >[!IMPORTANT]
   > The domain can't be a redirect. Otherwise, the DID and domain can't be linked. Make sure to use the https://www.domain.com format.
  
1. Select **Save and create credential**.

    ![Screenshot that shows setting up your organizational identity.](media/enable-your-tenant-verifiable-credentials/save-create.png)

Congratulations, your tenant is now enabled for the Verifiable Credentials preview!

## Create your verifiable credential in the portal

After the previous step, the **Create a new credential** screen appears.

   ![Screenshot that shows the Getting started screen.](media/enable-your-tenant-verifiable-credentials/create-credential-after-enable-did.png)

1. For the credential name, enter **MyFirstVC**. This name is used in the portal to identify your verifiable credentials. It's included as part of the verifiable credentials contract.
1. In the **Display file** section, select **Configure display file**.
1. In the **Storage accounts** section, select **woodgrovevcstorage**.
1. From the list of available containers, select **vc-container**.
1. Select the **MyFirstVC-display.json** file you created earlier.
1. On the **Create a new credential** screen, in the **Rules file** section, select **Configure rules file**.
1. In the **Storage accounts** section, select **woodgrovecstorage**.
1. Select **vc-container**.
1. Select **MyFirstVC-rules.json**.
1. On the **Create a new credential** screen, select **Create**.

   ![Screenshot that shows creating a new credential.](media/enable-your-tenant-verifiable-credentials/create-my-first-vc.png)

### Credential URL

Now that you have a new credential, copy the credential URL.

   ![Screenshot that shows the credential URL.](media/enable-your-tenant-verifiable-credentials/issue-credential-url.png)

>[!NOTE]
>The credential URL is the combination of the rules and display files. It's the URL that Authenticator evaluates before it displays to the user verifiable credential issuance requirements.

## Update the sample app

Now you'll make modifications to the sample app's issuer code to update it with your verifiable credential URL. This step allows you to issue verifiable credentials by using your own tenant.

1. Go to the folder where you placed the sample app's files.
1. Open the issuer folder, and then open app.js in Visual Studio Code.
1. Update the constant **credential** with your new credential URL. Set the **credentialType** constant to **'MyFirstVC'**, and save the file.

    ![Screenshot that shows Visual Studio Code with the relevant areas highlighted.](media/enable-your-tenant-verifiable-credentials/sample-app-vscode.png)

1. Open a command prompt, and open the issuer folder.
1. Run the updated node app.

    ```terminal
    node app.js
    ```

1. Using a different command prompt, run ngrok to set up a URL on 8081. You can install ngrok globally by using the [ngrok npm package](https://www.npmjs.com/package/ngrok/).

    ```terminal
    ngrok http 8081
    ```

    >[!IMPORTANT]
    > You might see a warning that reads "This app or website may be risky." The message is expected at this time because you haven't linked your DID to your domain. For configuration instructions, see [DNS binding](how-to-dnsbind.md).

1. Open the HTTPS URL generated by ngrok.

    ![Screenshot that shows NGROK forwarding endpoints.](media/enable-your-tenant-verifiable-credentials/ngrok-url-screen.png)

1. Select **GET CREDENTIAL**.
1. In Authenticator, scan the QR code.
1. On the **This app or website may be risky** screen, select **Advanced**.

   ![Screenshot that shows the initial warning.](media/enable-your-tenant-verifiable-credentials/site-warning.png)

1. On the next **This app or website may be risky** screen, select **Proceed anyways (unsafe)**.

   ![Screenshot that shows the second warning about the issuer.](media/enable-your-tenant-verifiable-credentials/site-warning-proceed.png)

1. On the **Add a credential** screen, notice that:
    1. At the top of the screen, you can see a red **Not verified** message.
    1. The credential is customized based on the changes you made to the display file.
    1. The **Sign in to your account** option points to didplayground.b2clogin.com.
    
      ![Screenshot that shows the Add a credential screen with warning.](media/enable-your-tenant-verifiable-credentials/add-credential-not-verified.png)

1. Select **Sign in to your account**, and authenticate by using the credential information you provided in the [Get started](get-started-verifiable-credentials.md) tutorial.
1. After successful authentication, the **Add** button is now activated. Select **Add**.

    ![Screenshot that shows the Add a credential screen after authenticating.](media/enable-your-tenant-verifiable-credentials/add-credential-not-verified-authenticated.png)

   You're now issued a verifiable credential by using our tenant to generate a verifiable credential while still using the sample Azure B2C tenant for authentication.

     ![Screenshot that shows a verifiable credential issued by Azure AD and authenticated by the sample Azure B2C tenant.](media/enable-your-tenant-verifiable-credentials/my-vc-b2c.png)

## Verify the verifiable credential by using the sample app

Now that you're issued the verifiable credential from our tenant, verify it by using the sample app.

>[!IMPORTANT]
> When you test, use the same email and password that you used during the [Get started](get-started-verifiable-credentials.md) tutorial. While your tenant is issuing the verifiable credential, the input is coming from an ID token issued by the sample Azure B2C tenant. In the second tutorial, you'll switch token issuance to your tenant.

1. In the Azure portal, on the **Verifiable credentials** pane, select **Settings**. Copy the DID.

   ![Screenshot that shows copying the DID.](media/enable-your-tenant-verifiable-credentials/issuer-identifier.png)

1. Now open the verifier folder part of the sample app files. You need to update the app.js file in the verifier sample code and make the following changes:

    - **credential**: Change to your credential URL.
    - **credentialType**: Enter **'MyFirstVC'**.
    - **issuerDid**: Copy this value from the Azure portal > **Verifiable Credentials (Preview)** > **Settings** > **Decentralized identifier (DID)**.
    
   ![Screenshot that shows updating the constant issuer DID to match your issuer identifier.](media/enable-your-tenant-verifiable-credentials/editing-verifier.png)

1. Stop running your issuer ngrok service.

    ```cmd
    control-c
    ```

1. Now run ngrok with the verifier port 8082.

    ```cmd
    ngrok http 8082
    ```

1. In another terminal window, go to the verifier app and run it similarly to how you ran the issuer app.

    ```cmd
    cd ..
    cd verifier
    node app.js
    ```

1. Open the ngrok URL in your browser, and scan the QR code by using Authenticator in your mobile device.
1. On your mobile device, on the **New permission request** screen, select **Allow**.

    >[!NOTE]
    > The DID signing this verifiable credential is still the Azure B2C. The verifier DID is still from the Microsoft sample app tenant. Because the Microsoft DID is linked to a domain we own, you don't see the warning like you experienced during the issuance flow. This situation is updated in the next section.
    
   ![Screenshot that shows the New permission request screen.](media/enable-your-tenant-verifiable-credentials/new-permission-request.png)

1. You've now successfully verified your credential.

## Next steps

Now that you have the sample code that issues a verifiable credential from your issuer, continue to the next section. You'll use your own identity provider to authenticate users who are trying to get verifiable credentials. You'll also use your DID to sign presentation requests.

> [!div class="nextstepaction"]
> [Tutorial - Issue and verify verifiable credentials by using your tenant](issue-verify-verifiable-credentials-your-tenant.md)