---
title: Step 1 - Set up Verifiable Credentials issuer in your own Azure AD
description: Set up your own verifiable credentials issuer in Azure
documentationCenter: ''
author: barclayn
manager: daveba
ms.service: identity
ms.topic: how-to
ms.subservice: verifiable-credentials
ms.date: 02/23/2021
ms.author: barclayn

#Customer intent: As an administrator, I want the high-level steps that I should follow so that I can quickly start using verifiable credentials in my own Azure AD

---

# Step 1 - Set up Verifiable Credentials (VC) in Azure

In this article:

1. create azure AD (NO need right?)
1. [Create a resource group](../../azure-resource-manager/management/manage-resource-groups-portal.md)
1. [Create a vault](../../key-vault/general/quick-create-portal.md)
1. Go to  https://aka.ms/vcpreviewportal
1. Requirements to issue credentials  WHERE IS THIS?
1. Create your directory (ISN'T ONE CREATED WITH EVERY TEST SUB CREATED?)
1. Set up Azure Key Vault

Building on the work we did getting the Sample code running on your own machine. Now we will set up your own Issuer and Verifier tenant with Azure AD. In a few simple steps, you can configure Azure AD to produce the same Ninja credential from the Sample code, but issued by your tenants DID.

## Prerequisites

To issue Verifiable Credentials, you need the following services.

- Complete the Getting Started Guide.
- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).
- Azure AD with a premium [license](https://azure.microsoft.com/en-us/pricing/details/active-directory/).
- An instance of [Azure Key Vault](../../key-vault/general/overview.md) where you have rights to create keys and secrets.
- Access to  Azure Blob storage that you can use to create containers and blobs.
- Any identity provider that supports the OpenID Connect standard for federation. Examples include Azure AD and Azure AD B2C. More detail is available in Credential Structure.

## Create your directory

Before we can get started we first need an Azure AD tenant. In the world of Verifiable Credentials, your Azure AD tenant represents your organization. When your tenant is enabled for Verifiable Credentials, it is assigned a decentralized identifier (DID) and it is equipped with an issuer service for issuing verifiable  credentials. Any verifiable credential you issue is issued by your tenant and its DID. The DID is also used when verifying Verifiable Credentials.

>[!NOTE]
>The Verifiable Credentials preview also requires an Azure AD Premium license. 

If you just created a test Azure subscription keep in mind that your tenant does not need to be populated with user accounts.

## Create a Key Vault

In the Verifiable Credentials preview, (IS THIS GOING TO CHANGE LATER?) you have complete control and management of the cryptographic keys your tenant will use to digitally sign Verifiable Credentials. To issue and verify credentials, you must provide Azure AD with access to your own instance of Azure Key Vault.

1. From the Azure portal menu, or from the **Home** page, select **Create a resource**.
2. In the Search box, enter **Key Vault**.
3. From the results list, choose **Key Vault**.
4. On the Key Vault section, choose **Create**.
5. On the **Create key vault** section provide the following information:
    - **Name**: A unique name is required. We use **Contoso-VC-Vault** so replace this value with your own unique name.
    - **Subscription**: Choose a subscription.
    - Under **Resource Group**, choose **Create new** and enter a resource group name such as **vc-resource-group**. We are using the same resource group name across multiple articles.
    - In the **Location** pull-down menu, choose a location.
    - Leave the other options to their defaults.
6. After providing the information above, select **Access Policy**

    ![create a key vault page](media/tutorial-verifiable-credentials-issuer/create-key-vault.png)

7. In the **Access Policy** screen choose **Add Access Policy**

    >[!NOTE]
    > By default the account that creates the Key Vault is the only one with access. In order for the Verifiable Credential service to get started, we need an access policy allowing the Admin to create keys, have the ability to delete them if you opt out (DO WE WANT TO SAY ANYTHING ABOUT OPTING OUT???) and sign in to create the domain binding for Verifiable Credential. (WHAT DO WE MEAN BY DOMAIN BINDING?) If you are using the same account while testing make sure to modify the default policy to grant the account **sign** in addition to the default permissions granted to vault creator.

8. In the key permissions section choose **Create**, **Delete**, and **Sign**.

    ![Key Vault permissions](media/tutorial-verifiable-credentials-issuer/vault-permissions.png)

9. Select **Review + create**.
10. Select **Create**.
11. Go to the vault and take note of the vault name and URI

Take note of the two properties listed below:

- **Vault Name**: In the example, this is **Contoso-VC-vault**. You will use this name for other steps.
- **Vault URI**: In the example, this is https://contoso-vc.vault.azure.net/. Applications that use your vault through its REST API must use this URI.

>[!NOTE]
> Each Key Vault transaction results in additional Azure subscription costs. Review the [Key Vault pricing page](https://azure.microsoft.com/pricing/details/key-vault/) for more details.

>[!IMPORTANT]
> During the Verifiable Credentials preview, keys and secrets created in your vault should not be modified once created. Deleting, disabling, or updating your keys and secrets will invalidate any credentials issued in the future. Do not modify your keys or secrets during the preview.

## Set up Verifiable Credentials Preview


WE ARE MISSING STEPS HERE... HOW ARE CUSTOMERS SUPPOSED TO ONBOARD DURING PREVIEW?

- Browse to https://aka.ms/vcpreviewportal
- Provide:
    -  **organization name**: This is how you will reference your business within the Verifiable Credential service. This will not be customer facing.
    - Domain (DOES THIS NEED TO RESOLVE OR IS IT JUST AN IDENTIFIER?) The domain entered is added to a service endpoint in your DID document. Microsoft Authenticator and other VC Wallets validate that your DID is linked to your domain and display to the user a Verified symbol or tell the user this is an untrusted session. The domain is what binds your DID to something tangible that the user may know about your business. See the example Presentation screen below. 

- Provide the name of the Key Vault that we created earlier.
- Choose **Save and create credential**

    ![set up your organizational identity](media/tutorial-verifiable-credentials-issuer/save-create.png)

At this point, your tenant has been successfully enabled for the Verifiable Credentials preview. Continue onto the next section to set up your credential issuer service.

Search for Verifiable Credentials and you see the blade. (I DO NOT. AFTER SAVING AND CREATING CREDENTIAL I GOT DROPPED INTO A 'CREATE A NEW CREDENTIAL SCREEN)

![create a new credential](media/tutorial-verifiable-credentials-issuer/create-new-credential.png)

 See the example Presentation screen below. 

![new permission request](media/tutorial-verifiable-credentials-issuer/e5EKExG.png)


## Next Steps

 - If you want to complete the credential, please go to this [tutorial.](tutorial-create-samplecard-your-issuer.md)



