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

#Customer intent: As an administrator, I want the high-level steps that I should follow so that I can learn how to issue cards using Azure verifiable credentials

---

# Tutorial 2: Create Sample Ninja Credential in your Issuer

Now that we have our Verifiable Credentials service set up in Azure Active Directory (AAD). Let's use the Sample Code's Ninja Credential and use that with our Issuer.

> [!IMPORTANT]
> Azure Verifiable Credentials is currently in public preview.
> This preview version is provided without a service level agreement, and it's not recommended for production workloads. Certain features might not be supported or might have constrained capabilities. 
> For more information, see [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).

## Create the Rules and Display Files

Open up Visual Studio Code and create the Rules JSON file with the following configuration. Save it as SampleNinjaRules.json so we can differentiate it in the future.

### Rules File

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

Create another file for the Display file and save it as 'display-example.json'. You don't need to change anything. For more information on display file customization options follow the how-to article [custom Verifiable Credential design](credential-design.md).

### Display File

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

## Create a storage account

We need a storage account to hold the rule and display files we created in the previous step.

1. Create a storage account using the following options:

    - **Name:**  A unique name
    - **Account kind:** Storage V2 (Why did we choose this? is this required
    - **Performance:** Standard
    - **Replication:** Locally redundant  (IS THERE A REASON FOR THIS? WHAT WOULD BE THE RECOMMENDATION FOR PRODUCTION? GEO REDUNDANT? )
    - **Location:** (US) EAST US
    - **Resource group:** Choose the same resource group we used in earlier tutorials (**vc-resource-group**)
    
    For detailed steps review the [Create a storage account](../../storage/common/storage-account-create.md?tabs=azure-portal) article.
    
    ![Create a new storage account](media/tutorial-create-sample-card-your-issuer/create-storage-account.png)

2. Once that you have a storage account we need to create a container in our new storage account. Create a container using the values provided below:

    - **Name:** vc-container
    - **Public access level:** Private (no anonymous access)

   ![Create a container](media/tutorial-create-sample-card-your-issuer/new-container.png)

3. Now select your new container and upload both the rules and display files. 

![upload rules file](media/tutorial-create-samplecard-your-issuer/3WOwn6Z.png)

## Role Assignment for Storage Blob

Before creating the credential, we need to first give the signed in user the right role assignment so we can access the files in Storage Blob.

1. Navigate to Storage > Container
2. Choose Access Control (IAM) in left menu
3. Role Assignments 
4. Add
5. Role: Storage Blob Data Reader
6. Assign access to: User, group or service principle
7. Select: choose the user that you are signed in with
8. Save


    ![Create a new credential screen](media/tutorial-create-sample-card-your-issuer/role_assignment.jpg)

  >[!IMPORTANT]
    >Even if you created the container with the account you are using the **Owner** role is not enough on its own. For more information review [Use the Azure portal to assign an Azure role for access to blob and queue data](../../storage/common/storage-auth-aad-rbac-portal.md) Your account needs  the **Storage Blob Data Reader** role.

Now that you have completed this, go to the next section and create your Verifiable Credential. 

## Create the Ninja Credential VC

- Select **Credentials** from the Verifiable Credentials preview page.

    ![Create a new credential screen](media/tutorial-create-sample-card-your-issuer/verifiable-credentials-page-preview.png)

- Choose **Create a credential**
- Under Credential Name, add the name **Ninja Credential**. This name is not shown to the user and is only for managing your Verifiable Credentials. 

![Create a new credential screen](media/tutorial-create-samplecard-your-issuer/zah7B0L.png)

- Select **Select display file**
- In **Storage accounts** select **contosovcstorage**
- Select **vc-container** from the list of available containers
- Choose **display-example.json**.
- From the **Create a new credential** page Select **Select rules file**
- In **Storage accounts** select **contosovcstorage**
- Choose **vc-container**.
- Select **SampleNinjaRules.json**
- From the **Create a new credential** screen choose **Create**.

>[!NOTE]
> If you just created a new blob storage you will see an error. Wait 5 minutes and try again. Since the files are being stored in your own tenants container, the Verifiable Credential service needs to get permissions to read those files to create the Verifiable Credentials contract. 

## Credential URL

Now that you have a new credential, copy the credential URL and run it in the browser to see if it works.  

![The issue credential URL](media/tutorial-create-samplecard-your-issuer/DdV0c8A.png)

You should see a response formatted like the example shown below:

![The issue credential URL response](media/tutorial-create-sample-card-your-issuer/issue-credential-url.png)

```json
{
  "id": "SampleNinja",
  "display": {
    "locale": "en-US",
    "contract": "https://portableidentitycards.azure-api.net/v1.0/96e93203-0285-41ef-88e5-a8c9b7a33457/portableIdentities/contracts/SampleNinja",
    "card": {
      "title": "Verified Credential Ninja",
      "issuedBy": "Microsoft",
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
    },
    "id": "display"
  },
  "input": {
    "credentialIssuer": "https://portableidentitycards.azure-api.net/v1.0/96e93203-0285-41ef-88e5-a8c9b7a33457/portableIdentities/card/issue",
    "issuer": "did:ion:EiD13Qcyk-WNxrD1lWLWORJkBjnNe1n5ZaX2u7uqcCi_8g:eyJkZWx0YSI6eyJwYXRjaGVzIjpbeyJhY3Rpb24iOiJyZXBsYWNlIiwiZG9jdW1lbnQiOnsicHVibGljS2V5cyI6W3siaWQiOiJzaWdfMjVlNDgzMzEiLCJwdWJsaWNLZXlKd2siOnsiY3J2Ijoic2VjcDI1NmsxIiwia3R5IjoiRUMiLCJ4IjoibDBWV0ZlemMxVmNEeHphRmk5R20tMWRaeTItNjlEcXlJOXNHb3NwT2pwcyIsInkiOiJZMFg4TDh5SHVoOVNhb2hDLW1jUzFGbkhicXRzNmlDNDhYdXlGQm11MHdnIn0sInB1cnBvc2VzIjpbImF1dGhlbnRpY2F0aW9uIiwiYXNzZXJ0aW9uTWV0aG9kIl0sInR5cGUiOiJFY2RzYVNlY3AyNTZrMVZlcmlmaWNhdGlvbktleTIwMTkifV0sInNlcnZpY2VzIjpbeyJpZCI6ImxpbmtlZGRvbWFpbnMiLCJzZXJ2aWNlRW5kcG9pbnQiOnsib3JpZ2lucyI6WyJodHRwczovL3Zjc2F0b3NoaS5jb20vIl19LCJ0eXBlIjoiTGlua2VkRG9tYWlucyJ9XX19XSwidXBkYXRlQ29tbWl0bWVudCI6IkVpQzd3MFJLd19rTGpxejdkUzFWR0VWWmttYmpDazdsUFJCR21aZXBaN0p5NXcifSwic3VmZml4RGF0YSI6eyJkZWx0YUhhc2giOiJFaUFBYVphRllaMEtRRGdYQnlxRm9WNldLY2J4Wmp4YXNMbmhTWk9OV2ZGMU93IiwicmVjb3ZlcnlDb21taXRtZW50IjoiRWlEbnotLXQ5RWFyc1pBdEJBOWo5THNJWXJvVlNPdTNLcDBLanJGdEFiM1Z4dyJ9fQ",
    "attestations": {
      "idTokens": [
        {
          "id": "https://didplayground.b2clogin.com/didplayground.onmicrosoft.com/B2C_1_sisu/v2.0/.well-known/openid-configuration",
          "encrypted": false,
          "claims": [
            {
              "claim": "given_name",
              "required": false,
              "indexed": false
            },
            {
              "claim": "family_name",
              "required": false,
              "indexed": false
            }
          ],
          "required": false,
          "configuration": "https://didplayground.b2clogin.com/didplayground.onmicrosoft.com/B2C_1_sisu/v2.0/.well-known/openid-configuration",
          "client_id": "8d5b446e-22b2-4e01-bb2e-9070f6b20c90",
          "redirect_uri": "vcclient://openid"
        }
      ]
    },
    "id": "input"
  }
}
```

## Update Contract URL in Sample

1. Open your Issuer Sample code app.js file.
2. Update the constant 'credential' with your new credential URL and save the file.

  ```js
        /////////// Set the expected values for the Verifiable Credential
    
        const credential = 'https://portableidentitycards.azure-api.net/v1.0/96e93203-0285-41ef-88e5-a8c9b7a33457/portableIdentities/contracts/SampleNinja';
    
        const credentialType = ['VerifiedCredentialNinja'];
    ```

3. Open a command prompt and open the issuer folder where the app.js file we just updated resides. 
4. Run the updated node app.

    ```cmd
    node ./app.js
    ```
5. Using a different command prompt run ngrok to setup a URL on 8081

```cmd
ngrok http 8081
```

Open up your url from ngrok and test issuing the VC to yourself.

![NGROK forwarding endpoints](media/tutorial-create-samplecard-your-issuer/nL4PleI.png)

>[!Note]
> Delete or Archive the Verifiable Credential from the Getting Started guide in order to issue the credential again to yourself. 

## Test verifying the VC with Sample Code

Now that we've issued the Verifiable Credential via our own tenant, let's verify it with our Sample app. 

Open up Settings in the Verifiable Credentials blade in Azure portal. Copy the Issuer identifier.

![copy the tenant identifier](media/tutorial-create-samplecard-your-issuer/ovlIGdJ.png)

Now open up your app.js file in your Verifier Sample code. 

Set the constant issuerDid to your issuer identifier. (Tenant identifier right? so could we say that to match the interface?)

![update the constant issuerDid to match your tenant identifier](media/tutorial-create-samplecard-your-issuer/5ELuqH6.png)

Now run your verifier app and present the VC.

Stop running your issuer ngrok service.
```bash
control-c
```
Now run ngrok with the verifier port 8082.
```bash
$.\ngrok http 8082
```

In another terminal window, navigate to the verifier app and run it similarly to how we ran the issuer app.

```bash
cd ..
cd ./verifier
node ./app.js
```

## Next steps

Now that you have the sample code issuing a VC by your issuer, lets jump into the next section where you use your own identity provider to gate who can get the VC.

> [!div class="nextstepaction"]
> [Tutorial - Configure your identity provider using the verifiable credentials sample app](tutorial-sample-app-your-idp.md)