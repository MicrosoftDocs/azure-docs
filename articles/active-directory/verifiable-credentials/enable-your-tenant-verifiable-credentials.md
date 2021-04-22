---
title: Tutorial - Configure your Azure Active Directory to issue verifiable credentials (Preview)
description: In this tutorial, you build the environment needed to deploy verifiable credentials in your tenant
documentationCenter: ''
author: barclayn
manager: daveba
ms.service: identity
ms.topic: tutorial
ms.subservice: verifiable-credentials
ms.date: 04/01/2021
ms.author: barclayn
ms.reviewer: 

# Customer intent: As an administrator, I want the high-level steps that I should follow so that I can quickly start using verifiable credentials in my own Azure AD

---

# Tutorial - Configure your Azure Active Directory to issue verifiable credentials (Preview)

In this tutorial, we build on the work done as part of the [get started](get-started-verifiable-credentials.md) article and set up your Azure Active Directory (Azure AD) with its own [decentralized identifier](https://www.microsoft.com/security/business/identity-access-management/decentralized-identity-blockchain?rtc=1#:~:text=Decentralized%20identity%20is%20a%20trust,protect%20privacy%20and%20secure%20transactions.) (DID). We use the decentralized identifier to issue a verifiable credential using the sample app and your issuer; however, in this tutorial, we still use the sample Azure B2C tenant for authentication.  In our next tutorial, we will take additional steps to get the app configured to work with your Azure AD.

> [!IMPORTANT]
> Azure Active Directory Verifiable Credentials is currently in public preview.
> This preview version is provided without a service level agreement, and it's not recommended for production workloads. Certain features might not be supported or might have constrained capabilities. 
> For more information, see [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).

In this article:

> [!div class="checklist"]
> * You create the necessary services to onboard your Azure AD for verifiable credentials 
> * We are creating your DID
> * We are customizing the Rules and Display files
> * Configure verifiable credentials in Azure AD.


## Prerequisites

Before you can successfully complete this tutorial, you must first:

- Complete the [Get started](get-started-verifiable-credentials.md).
- Have an Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).
- Azure AD with a P2 [license](https://azure.microsoft.com/pricing/details/active-directory/). Follow the [How to create a free developer account](how-to-create-a-free-developer-account.md) if you do not have one.
- An instance of [Azure Key Vault](../../key-vault/general/overview.md) where you have rights to create keys and secrets.

## Azure Active Directory

Before we can start, we need an Azure AD tenant. When your tenant is enabled for verifiable credentials, it is assigned a decentralized identifier (DID) and it is enabled with an issuer service for issuing verifiable credentials. Any verifiable credential you issue is issued by your tenant and its DID. The DID is also used when verifying verifiable credentials.
If you just created a test Azure subscription, your tenant does not need to be populated with user accounts but you will need to have at least one user test account to complete later tutorials.

## Create a Key Vault

When working with verifiable credentials, you have complete control and management of the cryptographic keys your tenant uses to digitally sign verifiable credentials. To issue and verify credentials, you must provide Azure AD with access to your own instance of Azure Key Vault.

1. From the Azure portal menu, or from the **Home** page, select **Create a resource**.
2. In the Search box, enter **key vault**.
3. From the results list, choose **Key Vault**.
4. On the Key Vault section, choose **Create**.
5. On the **Create key vault** section provide the following information:
    - **Subscription**: Choose a subscription.
    - Under **Resource Group**, choose **Create new** and enter a resource group name such as **vc-resource-group**. We are using the same resource group name across multiple articles.
    - **Name**: A unique name is required. We use **woodgroup-vc-kv** so replace this value with your own unique name.
    - In the **Location** pull-down menu, choose a location.
    - Leave the other options to their defaults.
6. After providing the information above, select **Access Policy**

    ![create a key vault page](media/enable-your-tenant-verifiable-credentials/create-key-vault.png)

7. In the Access Policy screen, choose **Add Access Policy**

    >[!NOTE]
    > By default the account that creates the key vault is the only one with access. The verifiable credential service needs access to key vault. The key vault must have an access policy allowing the Admin to **create keys**, have the ability to **delete keys** if you opt out, and **sign** to create the domain binding for verifiable credential. If you are using the same account while testing make sure to modify the default policy to grant the account **sign** in addition to the default permissions granted to vault creators.

8. For the User Admin, make sure the key permissions section has **Create**, **Delete**, and **Sign** enabled. By default Create and Delete are already enabled and Sign should be the only Key Permission that needs to be updated. 

    ![Key Vault permissions](media/enable-your-tenant-verifiable-credentials/keyvault-access.png)

9. Select **Review + create**.
10. Select **Create**.
11. Go to the vault and take note of the vault name and URI

Take note of the two properties listed below:

- **Vault Name**: In the example, the value name is **woodgrove-vc-kv**. You use this name for other steps.
- **Vault URI**: In the example, this value is https://woodgrove-vc-kv.vault.azure.net/. Applications that use your vault through its REST API must use this URI.

>[!NOTE]
> Each key vault transaction results in additional Azure subscription costs. Review the [Key Vault pricing page](https://azure.microsoft.com/pricing/details/key-vault/) for more details.

>[!IMPORTANT]
> During the Azure Active Directory Verifiable Credentials preview, keys and secrets created in your vault should not be modified once created. Deleting, disabling, or updating your keys and secrets invalidates any issued credentials. Do not modify your keys or secrets during the preview.

## Create a modified rules and display file

In this section, we use the rules and display files from the [Sample issuer app](https://github.com/Azure-Samples/active-directory-verifiable-credentials/)
 and modify them slightly to create your tenant's first verifiable credential.

1. Copy both the rules and display json files to a temporary folder and rename them **MyFirstVC-display.json** and **MyFirstVC-rules.json** respectively. You can find both files under **issuer\issuer_config**

   ![display and rules files as part of the sample app directory](media/enable-your-tenant-verifiable-credentials/sample-app-rules-display.png)

   ![display and rules files in a temp folder](media/enable-your-tenant-verifiable-credentials/display-rules-files-temp.png)

2. Open up the MyFirstVC-rules.json file in your code editor. 

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

Now let's change the type field to "MyFirstVC". 

  ```json
   "type": ["MyFirstVC"]
  
  ```

Save this change.

 >[!NOTE]
   > We are not changing the **"configuration"** or the **"client_id"** at this point in the tutorial. We still use the Microsoft B2C tenant we used in the [Get started](get-started-verifiable-credentials.md). We will use your Azure AD in the next tutorial.

3. Open up the MyFirstVC-display.json file in your code editor.

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

Lets make a few modifications so this verifiable credential looks visibly different from sample code's version. 
    
```json
     "card": {
        "title": "My First VC",
        "issuedBy": "Your Issuer Name",
        "backgroundColor": "#ffffff",
        "textColor": "#000000",
      }
```

Save these changes.

## Create a storage account

Before creating our first verifiable credential, we need to create a Blob Storage container that can hold our configuration and rules files.

1. Create a storage account using the options shown below. For detailed steps review the [Create a storage account](../../storage/common/storage-account-create.md?tabs=azure-portal) article.

   - **Subscription:** Choose the subscription that we are using for these tutorials.
   - **Resource group:** Choose the same resource group we used in earlier tutorials (**vc-resource-group**).
   - **Name:**  A unique name.
   - **Location:** (US) EAST US.
   - **Performance:** Standard.
   - **Account kind:** Storage V2.
   - **Replication:** Locally redundant.
 
   ![Create a new storage account](media/enable-your-tenant-verifiable-credentials/create-storage-account.png)

2. After creating the storage account, we need to create a container. Select **Containers** under **Blob Storage** and create a container using the values provided below:

    - **Name:** vc-container
    - **Public access level:** Private (no anonymous access)

   ![Create a container](media/enable-your-tenant-verifiable-credentials/new-container.png)

3. Now select your new container and upload both the new rules and display files **MyFirstVC-display.json** and **MyFirstVC-rules.json** we created earlier.

   ![upload rules file](media/enable-your-tenant-verifiable-credentials/blob-storage-upload-rules-display-files.png)

## Assign blob role

Before creating the credential, we need to first give the signed in user the correct role assignment so they can access the files in Storage Blob.

1. Navigate to **Storage** > **Container**.
2. Choose **Access Control (IAM)** from the menu on the left.
3. Choose **Role Assignments**.
4. Select **Add**.
5. In the **Role** section, choose **Storage Blob Data Reader**.
6. Under **Assign access to** choose **User, group, or service principle**.
7. In **Select**: Choose the account that you are using to perform these steps.
8. Select **Save** to complete the role assignment.


   ![Add a role assignment](media/enable-your-tenant-verifiable-credentials/role-assignment.png)

  >[!IMPORTANT]
  >By default, container creators get the **Owner** role assigned. The **Owner** role is not enough on its own. Your account needs  the **Storage Blob Data Reader** role. For more information review [Use the Azure portal to assign an Azure role for access to blob and queue data](../../storage/common/storage-auth-aad-rbac-portal.md)

## Set up verifiable credentials (Preview)

Now we need to take the last step to set up your tenant for verifiable credentials.

1. From the Azure portal, search for **verifiable credentials**.
2. Choose **Verifiable Credentials (Preview)**.
3. Choose **Get started**
4. We need to set up your organization and provide the organization name, domain, and key vault. Let's look at each one of the values.

      - **organization name**: This name is how you reference your business within the Verifiable Credential service. This value is not customer facing.
      - **Domain:** The domain entered is added to a service endpoint in your DID document. [Microsoft Authenticator](../user-help/user-help-auth-app-download-install.md) and other wallets use this information to validate that your DID is [linked to your domain](how-to-dnsbind.md). If the wallet can verify the DID, it displays a verified symbol. If the wallet is unable to verify the DID, it informs the user that the credential was issued by an organization it could not validate. The domain is what binds your DID to something tangible that the user may know about your business.
      - **Key vault:** Provide the name of the Key Vault that we created earlier.
 
   >[!IMPORTANT]
   > The domain can not be a redirect, otherwise the DID and domain cannot be linked. Make sure to use https://www.domain.com format.
    
5. Choose **Save and create credential**

    ![set up your organizational identity](media/enable-your-tenant-verifiable-credentials/save-create.png)

Congratulations, your tenant is now enabled for the Verifiable Credential preview!

## Create your VC in the portal

The previous step leaves you in the **Create a new credential** page. 

   ![verifiable credentials get started](media/enable-your-tenant-verifiable-credentials/create-credential-after-enable-did.png)

1. Under Credential Name, add the name **MyFirstVC**. This name is used in the portal to identify your verifiable credentials and it is included as part of the verifiable credentials contract.
2. In the Display file section, choose **Configure display file**
3. In the **Storage accounts** section, select **woodgrovevcstorage**.
4. From the list of available containers choose **vc-container**.
5. Choose the **MyFirstVC-display.json** file we created earlier.
6. From the **Create a new credential** in the **Rules file** section choose **Configure rules file**
7. In the **Storage accounts** section, select **woodgrovecstorage**
8. Choose **vc-container**.
9. Select **MyFirstVC-rules.json**
10. From the **Create a new credential** screen choose **Create**.

   ![create a new credential](media/enable-your-tenant-verifiable-credentials/create-my-first-vc.png)

### Credential URL

Now that you have a new credential, copy the credential URL.

   ![The issue credential URL](media/enable-your-tenant-verifiable-credentials/issue-credential-url.png)

>[!NOTE]
>The credential URL is the combination of the rules and display files. It is the URL that Authenticator evaluates before displaying to the user verifiable credential issuance requirements.  

## Update the sample app

Now we make modifications to the sample app's issuer code to update it with your verifiable credential URL. This allows you to issue verifiable credentials using your own tenant.

1. Go to the folder where you placed the sample app's files.
2. Open the issuer folder and then open app.js in Visual Studio Code.
3. Update the constant 'credential' with your new credential URL and set the credentialType constant to 'MyFirstVC' and save the file.

    ![image of visual studio code showing the relevant areas highlighted](media/enable-your-tenant-verifiable-credentials/sample-app-vscode.png)

4. Open a command prompt and open the issuer folder.
5. Run the updated node app.

    ```terminal
    node app.js
    ```

6. Using a different command prompt run ngrok to set up a URL on 8081. You can install ngrok globally using the [ngrok npm package](https://www.npmjs.com/package/ngrok/).

    ```terminal
    ngrok http 8081
    ```
    
    >[!IMPORTANT]
    > You may also notice a warning that this app or website may be risky. The message is expected at this time because we have not yet linked your DID to your domain. Follow the [DNS binding](how-to-dnsbind.md) instructions to configure this.

    
7. Open the HTTPS URL generated by ngrok.

    ![NGROK forwarding endpoints](media/enable-your-tenant-verifiable-credentials/ngrok-url-screen.png)

8. Choose **GET CREDENTIAL**
9. In Authenticator scan the QR code.
10. At **This app or website may be risky** warning message choose **Advanced**.

  ![Initial warning](media/enable-your-tenant-verifiable-credentials/site-warning.png)

11. At the risky website warning choose **Proceed anyways (unsafe)**

  ![Second warning about the issuer](media/enable-your-tenant-verifiable-credentials/site-warning-proceed.png)


12. At the **Add a credential** screen notice a few things: 
    1. At the top of the screen you can see a red **Not verified** message
    1. The credential is customized based on the changes we made to the display file.
    1. The **Sign in to your account** option is pointing to **didplayground.b2clogin.com**.
    
   ![add credential screen with warning](media/enable-your-tenant-verifiable-credentials/add-credential-not-verified.png)

13. Choose **Sign in to your account** and authenticate using the credential information you provided in the [get started tutorial](get-started-verifiable-credentials.md).
14. After successfully authenticating the **Add** button is no longer greyed out. Choose **Add**.

  ![add credential screen after authenticating](media/enable-your-tenant-verifiable-credentials/add-credential-not-verified-authenticated.png)

We have now issued a verifiable credential using our tenant to generate our vc while still using our B2C tenant for authentication.

  ![vc issued by your azure AD and authenticated by our Azure B2C instance](media/enable-your-tenant-verifiable-credentials/my-vc-b2c.png)


## Test verifying the VC using the sample app

Now that we've issued the verifiable credential from our own tenant, let's verify it using our sample app.

>[!IMPORTANT]
> When testing, use the same email and password that you used during the [get started](get-started-verifiable-credentials.md) article. While your tenant is issuing the vc, the input is coming from an id token issued by the Microsoft B2C tenant. In tutorial two, we are switching token issuance to your tenant

1. Open up **Settings** in the verifiable credentials blade in the Azure portal. Copy the decentralized identifier (DID).

   ![copy the DID](media/enable-your-tenant-verifiable-credentials/issuer-identifier.png)

2. Now open verifier folder part of the sample app files. We need to update the app.js file in the verifier sample code and make the following changes:

    - **credential**: change to your credential URL
    - **credentialType**: 'MyFirstVC'
    - **issuerDid**: Copy this value from Azure portal>Verifiable credentials (Preview)>Settings>Decentralized identifier (DID)
    
   ![update the constant issuerDid to match your issuer identifier](media/enable-your-tenant-verifiable-credentials/editing-verifier.png)

3. Stop running your issuer ngrok service.

    ```cmd
    control-c
    ```

4. Now run ngrok with the verifier port 8082.

    ```cmd
    ngrok http 8082
    ```

5. In another terminal window, navigate to the verifier app and run it similarly to how we ran the issuer app.

    ```cmd
    cd ..
    cd verifier
    node app.js
    ```

6. Open the ngrok url in your browser and scan the QR code using Authenticator in your mobile device.
7. On your mobile device, choose **Allow** at the **New permission request** screen.

    >[!NOTE]
    > The DID signing this VC is still the Microsoft B2C. The Verifier DID is still from the Microsoft Sample App tenant. Since Microsoft's DID has been linked to a domain we own, you do not see the warning like we experienced during the issuance flow. This will be updated in the next section.
    
   ![new permission request](media/enable-your-tenant-verifiable-credentials/new-permission-request.png)

8. You have no successfully verified your credential.

## Next steps

Now that you have the sample code issuing a VC from your issuer, lets continue to the next section where you use your own identity provider to authenticate users trying to get verifiable credential and use your DID to sign presentation requests.

> [!div class="nextstepaction"]
> [Tutorial - Issue and verify verifiable credentials using your tenant](issue-verify-verifiable-credentials-your-tenant.md)


