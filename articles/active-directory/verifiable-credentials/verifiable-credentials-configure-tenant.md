---
title: Tutorial - Configure your tenant for Azure AD Verifiable Credentials (preview)
description: In this tutorial, you learn how to configure your tenant to support the Verifiable Credentials service. 
ms.service: decentralized-identity
ms.subservice: verifiable-credentials
author: barclayn
manager: rkarlin
ms.author: barclayn
ms.topic: tutorial
ms.date: 06/27/2022
# Customer intent: As an enterprise, we want to enable customers to manage information about themselves by using verifiable credentials.

---

# Configure your tenant for Azure AD Verifiable Credentials (preview)

[!INCLUDE [Verifiable Credentials announcement](../../../includes/verifiable-credentials-brand.md)]

Azure Active Directory (Azure AD) Verifiable Credentials safeguards your organization with an identity solution that's seamless and decentralized. The service allows you to issue and verify credentials. For issuers, Azure AD provides a service that they can customize and use to issue their own verifiable credentials. For verifiers, the service provides a free REST API that makes it easy to request and accept verifiable credentials in your apps and services.

In this tutorial, you learn how to configure your Azure AD tenant so it can use the verifiable credentials service.

Specifically, you learn how to:

> [!div class="checklist"]
> - Create an Azure Key Vault instance.
> - Set up the Verifiable Credentials service.
> - Register an application in Azure AD.

The following diagram illustrates the Azure AD Verifiable Credentials architecture and the component you configure.

![Diagram that illustrates the Azure AD Verifiable Credentials architecture.](media/verifiable-credentials-configure-tenant/verifiable-credentials-architecture.png)

## Prerequisites

- You need an Azure tenant with an active subscription. If you don't have Azure subscription, [create one for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).
- Ensure that you have the [global administrator](../../active-directory/roles/permissions-reference.md#global-administrator) permission for the directory you want to configure.

## Create a key vault

[Azure Key Vault](../../key-vault/general/basic-concepts.md) is a cloud service that enables the secure storage and access of secrets and keys. The Verifiable
Credentials service stores public and private keys in Azure Key Vault. These keys are used to sign and verify credentials.

If you don't have an Azure Key Vault instance available, follow [these steps](../../key-vault/general/quick-create-portal.md) to create a key vault using the Azure portal.

>[!NOTE]
>By default, the account that creates a vault is the only one with access. The Verifiable Credentials service needs access to the key vault. You must configure the key vault with an access policy that allows the account used during configuration to create and delete keys. The account used during configuration also requires permission to sign to create the domain binding for Verifiable Credentials. If you use the same account while testing, modify the default policy to grant the account sign permission, in addition to the default permissions granted to vault creators.

### Set access policies for the key vault

A Key Vault [access policy](../../key-vault/general/assign-access-policy.md) defines whether a specified security principal can perform operations on Key Vault secrets and keys. Set access policies in your key vault for both the Azure AD Verifiable Credentials service administrator account, and for the Request Service API principal that you created.
After you create your key vault, Verifiable Credentials generates a set of keys used to provide message security. These keys are stored in Key Vault. You use a key set for signing, updating, and recovering verifiable credentials.

### Set access policies for the Verifiable Credentials Admin user

1. In the [Azure portal](https://portal.azure.com/), go to the key vault you use for this tutorial.

1. Under **Settings**, select **Access policies**.

1. In **Add access policies**, under **USER**, select the account you use to follow this tutorial.

1. For **Key permissions**, verify that the following permissions are selected: **Create**, **Delete**, and **Sign**. By default, **Create** and **Delete** are already enabled. **Sign** should be the only key permission you need to update.

    ![Screenshot that shows how to configure the admin access policy.](media/verifiable-credentials-configure-tenant/set-key-vault-admin-access-policy.png)

1. To save the changes, select **Save**.

### Set access policies for the Verifiable Credentials Service Request service principal

The Verifiable Credentials Service Request is the Request Service API, and it needs access to Key Vault in order to sign issuance and presentation requests. 

1. Select **+ Add Access Policy** and select the service principal **Verifiable Credentials Service Request** with AppId **3db474b9-6a0c-4840-96ac-1fceb342124**.

1. For **Key permissions**, select permissions **Get** and **Sign**. 

    ![screenshot of key vault granting access to a security principal](media/verifiable-credentials-configure-tenant/set-key-vault-sp-access-policy.png)

1. To save the changes, select **Save**.

## Set up Verifiable Credentials 

To set up Azure AD Verifiable Credentials, follow these steps:

1. In the [Azure portal](https://portal.azure.com/), search for *verifiable credentials*. Then, select **Verifiable Credentials (Preview)**.

1. From the left menu, select **Getting started**.

1. Set up your organization by providing the following information:

    1. **Organization name**: Enter a name to reference your business within Verifiable Credentials. Your customers don't see this name.

    1. **Domain**: Enter a domain that's added to a service endpoint in your decentralized identity (DID) document. The domain is what binds your DID to something tangible that the user might know about your business. Microsoft Authenticator and other digital wallets use this information to validate that your DID is linked to your domain. If the wallet can verify the DID, it displays a verified symbol. If the wallet can't verify the DID, it informs the user that the credential was issued by an organization it couldn't validate.
            
        >[!IMPORTANT]
        > The domain can't be a redirect. Otherwise, the DID and domain can't be linked. Make sure to use HTTPS for the domain. For example: `https://contoso.com`.

    1. **Key vault**: Select the key vault that you created earlier.

    1. Under **Advanced**, you may choose the **trust system** that you want to use for your tenant. You can choose from either **Web** or **ION**. Web means your tenant uses [did:web](https://w3c-ccg.github.io/did-method-web/) as the did method and ION means it uses [did:ion](https://identity.foundation/ion/).
            
        >[!IMPORTANT]
        > The only way to change the trust system is to opt-out of verifiable credentials and redo the onboarding.


1. Select **Save and get started**.  
    
    ![Screenshots that shows how to set up Verifiable Credentials.](media/verifiable-credentials-configure-tenant/verifiable-credentials-getting-started.png)

## Register an application in Azure AD

Azure AD Verifiable Credentials Service Request needs to get access tokens to issue and verify. To get access tokens, register a web application and grant API permission for the API Verifiable Credential Request Service that you set up in the previous step.

1. Sign in to the [Azure portal](https://portal.azure.com/) with your administrative account.

1. If you have access to multiple tenants, select the **Directory + subscription**. Then, search for and select your **Azure Active Directory**.

1. Under **Manage**, select **App registrations** > **New registration**.  

   ![Screenshot that shows how to select a new application registration.](media/verifiable-credentials-configure-tenant/register-azure-ad-app.png)

1. Enter a display name for your application. For example: *verifiable-credentials-app*.

1. For **Supported account types**, select **Accounts in this organizational directory only (Default Directory only - Single tenant)**.

1. Select **Register** to create the application.

   ![Screenshot that shows how to register the verifiable credentials app.](media/verifiable-credentials-configure-tenant/register-azure-ad-app-properties.png)

### Grant permissions to get access tokens

In this step, you grant permissions to the Verifiable Credentials Service Request Service principal.

To add the required permissions, follow these steps:

1. Stay in the **verifiable-credentials-app** application details page. Select **API permissions** > **Add a permission**.
    
    ![Screenshot that shows how to add permissions to the verifiable credentials app.](media/verifiable-credentials-configure-tenant/add-app-api-permissions.png)

1. Select **APIs my organization uses**.

1. Search for the service principal that you created earlier, **Verifiable Credentials Service Request**, and select it.
    
    ![Screenshot that shows how to select the service principal.](media/verifiable-credentials-configure-tenant/add-app-api-permissions-select-service-principal.png)

1. Choose **Application Permission**, and expand **VerifiableCredential.Create.All**.

    ![Screenshot that shows how to select the required permissions.](media/verifiable-credentials-configure-tenant/add-app-api-permissions-verifiable-credentials.png)

1. Select **Add permissions**.

1. Select **Grant admin consent for \<your tenant name\>**.

## Service endpoint configuration

1. In the Azure portal, navigate to the Verifiable credentials page.
1. Select **Registration**.
1. Notice that there are two sections:
    1. Website ID registration
    1. Domain verification.
1. Select on each section and download the JSON file under each.
1. Crete a website that you can use to distribute the files. If you specified **https://contoso.com** as your domain, the URLs for each of the files would look as shown below:
    - https://contoso.com/.well-known/did.json
    - https://contoso.com/.well-known/did-configuration.json.

Once that you have successfully completed the verification steps, you are ready to continue to the next tutorial.

## Next steps

- [Learn how to issue Azure AD Verifiable Credentials from a web application](verifiable-credentials-configure-issuer.md).
- [Learn how to verify Azure AD Verifiable Credentials](verifiable-credentials-configure-verifier.md).