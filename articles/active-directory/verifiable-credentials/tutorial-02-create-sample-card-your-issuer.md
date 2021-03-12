---
title: Tutorial 2 - Create Sample Ninja Credential in your Issuer (preview)
description: Modify the sample app to work with your issuer
documentationCenter: ''
author: barclayn
manager: daveba
ms.service: identity
ms.topic: how-to
ms.subservice: verifiable-credentials
ms.date: 03/09/2021
ms.author: barclayn

# Customer intent: As an administrator, I want the high-level steps that I should follow so that I can learn how to issue cards using Azure verifiable credentials

---

# Tutorial 2: Create Sample Ninja Credential in your Issuer

In the previous tutorials we setup verifiable credentials using rule and display files from our sample app and you Azure Active Directory.  In this tutorial we will take the sample app code running on our test system and make the necessary changes to get it working with your verifiable credentials issuer.

> [!IMPORTANT]
> Verifiable credentials is currently in public preview.
> This preview version is provided without a service level agreement, and it's not recommended for production workloads. Certain features might not be supported or might have constrained capabilities.
> For more information, see [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).

In this article:

> [!div class="checklist"]
> * Create rules and display files.
> * Create a storage account and a container to store verifiable credentials keys.
> * Go to  https://aka.ms/vcpreviewportal

## Prerequisites

Before you can continue you must complete [the first tutorial](tutorial-01-verifiable-credentials-issuer.md) and have access to the environment you used.

## Create a rules file

1. Open up Visual Studio Code and create the Rules JSON file with the following configuration. 

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
            "redirect_uri": "vcclient://openid"
          }
        ]
      },
      "validityInterval": 2592000,
      "vc": {
        "type": ["VerifiedCredentialNinja"]
      }
    }
    ```

2. Save it as SampleNinjaRules.json so we can identify it in the future.

## Create a display file

1. In Visual Studio Code create another JSON file for the **Display file** using the information below.

```json
{
  "default": {
    "locale": "en-US",
    "card": {
      "title": "Verified Credential Ninja",
      "issuedBy": "Ninja VC",
      "backgroundColor": "#000000",
      "textColor": "#ffffff",
      "logo": {
        "uri": "https://didcustomerplayground.blob.core.windows.net/public/ninja-icon.png",
        "description": "Ninja Logo"
      },
      "description": "Use your verified credential ninja card to prove to anyone that you know all about verifiable credentials."
    },
    "consent": {
      "title": "Do you want to get your Verified Credential Ninja card?",
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

2. Save it as 'display-example.json'.

## Create a storage account

We need a storage account to hold the two files we created in the previous step. 

1. Create a storage account using the options shown below. For detailed steps review the [Create a storage account](../../storage/common/storage-account-create.md?tabs=azure-portal) article. 

    - **Resource group:** Choose the same resource group we used in earlier tutorials (**vc-resource-group**)
    - **Name:**  A unique name
    - **Location:** (US) EAST US
    - **Performance:** Standard
    - **Account kind:** Storage V2
    - **Replication:** Locally redundant
 
   ![Create a new storage account](media/tutorial-create-sample-card-your-issuer/create-storage-account.png)

2. After creating the storage account we need to create a container. Create a container using the values provided below:

    - **Name:** vc-container
    - **Public access level:** Private (no anonymous access)

   ![Create a container](media/tutorial-create-sample-card-your-issuer/new-container.png)

3. Now select your new container and upload both the rules and display files. 

![upload rules file](media/tutorial-create-samplecard-your-issuer/3WOwn6Z.png)

## Assign storage blob role to your account

Before creating the credential, we need to first give the signed in user the correct role assignment so that they can access the files in Storage Blob.

1. Navigate to **Storage** > **Container**.
1. Select the Container we created **vc-container** 
1. Choose **Access Control (IAM)** from the menu on the left.
1. Choose **Role Assignments**.
1. Select **Add**.
1. In the **Role** section, choose **Storage Blob Data Reader**.
1. Under **Assign access to** choose **User, group, or service principle**.
1. In the **Select**: specify the account of the user that you are signed in with.
1. Select **Save** to complete the role assignment.


  ![Create a new credential screen](media/tutorial-create-sample-card-your-issuer/role_assignment.jpg)

  >[!IMPORTANT]
    >Even if you created the container with the account you are using, the **Owner** role is not enough on its own. For more information review [Use the Azure portal to assign an Azure role for access to blob and queue data](../../storage/common/storage-auth-aad-rbac-portal.md) Your account needs  the **Storage Blob Data Reader** role.

At this point, we have taken the steps necessary to transition from the sample app configured to work with our hosted Azure Active Directory environment to yours.

## Create the Ninja Credential VC

In this section, we use the environment we have built so far in your tenant and use the rules and display files to create a new credential.

1. Select **Credentials** from the verifiable credentials preview page.

    ![Create a new credential screen](media/tutorial-create-sample-card-your-issuer/verifiable-credentials-page-preview.png)

2. Choose **Create a credential**
3. Under Credential Name, add the name **ninjaCredential**. This name is used in the portal to identify your verifiable credentials and it is included as part of the verifiable credentials contract.

    ![Create a new credential screen](media/tutorial-create-samplecard-your-issuer/zah7B0L.png)

4. Select **display file**
5. In **Storage accounts** select **contosovcstorage**
6. Select **vc-container** from the list of available containers
7. Choose **display-example.json**.
8. From the **Create a new credential** page Select rules file**
9. In **Storage accounts** select **contosovcstorage**
10. Choose **vc-container**.
11. Select **SampleNinjaRules.json**
12. From the **Create a new credential** screen choose **Create**.

## Credential URL

Now that you have a new credential, copy the credential URL. 

![The issue credential URL](media/tutorial-create-samplecard-your-issuer/DdV0c8A.png)


>[!WARNING]
If you try browsing the URL immediately after completing these steps you may receive an unauthorized error message. This is expected and the error clears within five minutes.

## Update the contract URL

Now we make modifications to the sample app's issuer code to update it with your verifiable credential URL. This allows you to issue verifiable credentials using your own tenant.

1. Open your Issuer Sample code app.js file.
2. Update the constant 'credential' with your new credential URL and save the file.

    ```json
        /////////// Set the expected values for the Verifiable Credential
    
        const credential = 'https://portableidentitycards.azure-api.net/v1.0/96e93203-0285-41ef-88e5-a8c9b7a33457/portableIdentities/contracts/SampleNinja';
    
        const credentialType = ['VerifiedCredentialNinja'];
    ```

3. Open a command prompt and open the issuer folder.
4. Run the updated node app.

    ```cmd
    node ./app.js
    ```
5. Using a different command prompt run ngrok to set up a URL on 8081

```cmd
ngrok http 8081
```

>[!IMPORTANT]
> Delete or Archive the Verifiable Credential in your wallet before you issue a credential to yourself. At this time, there is a limitation of only one credential type in Authenticator at a time. You will also see a warning about your issuer not having yet configured [DNS binding](how-to-dnsbind.md). When testing, use the same email and password that you used during the first tutorial. You need that information because while you are issuing the credential authentication is still handled by the same Azure AD that we used earlier.

6. Open up your url from ngrok and test issuing the VC to yourself.

![NGROK forwarding endpoints](media/tutorial-create-samplecard-your-issuer/nL4PleI.png)


## Test verifying the VC using the sample app

Now that we've issued the Verifiable Credential from our own tenant, let's verify it using our Sample app.

1. Open up **Settings** in the verifiable credentials blade in Azure portal. Copy the Issuer identifier.

    ![copy the issuer identifier](media/tutorial-create-samplecard-your-issuer/ovlIGdJ.png)

2. Now open up your app.js file in your Verifier Sample code. Set the constant issuerDid to your issuer identifier. 

![update the constant issuerDid to match your issuer identifier](media/tutorial-create-samplecard-your-issuer/5ELuqH6.png)

3. Now run your verifier app and present the VC.

4. Stop running your issuer ngrok service.

    ```cmd
    control-c
    ```

5. Now run ngrok with the verifier port 8082.

    ```cmd
    $.\ngrok http 8082
    ```

6. In another terminal window, navigate to the verifier app and run it similarly to how we ran the issuer app.

    ```bash
    cd ..
    cd ./verifier
    node ./app.js
    ```

## Next steps

Now that you have the sample code issuing a VC by your issuer, lets jump into the next section where you use your own identity provider to gate who can get the VC.

> [!div class="nextstepaction"]
> [Tutorial - Configure your identity provider using the verifiable credentials sample app](tutorial-sample-app-your-idp.md)