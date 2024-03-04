---
title: Tutorial - Configure your tenant for Microsoft Entra Verified ID
description: In this tutorial, you learn how to configure your tenant to support the Verified ID service. 
ms.service: decentralized-identity
ms.subservice: verifiable-credentials
author: barclayn
manager: amycolannino
ms.author: barclayn
ms.topic: tutorial
ms.date: 01/26/2023
# Customer intent: As an enterprise, we want to enable customers to manage information about themselves by using verifiable credentials.

---

# Configure your tenant for Microsoft Entra Verified ID

[!INCLUDE [Verifiable Credentials announcement](../../../includes/verifiable-credentials-brand.md)]

Microsoft Entra Verified ID is a decentralized identity solution that helps you safeguard your organization. The service allows you to issue and verify credentials. Issuers can use the Verified ID service to issue their own customized verifiable credentials. Verifiers can use the service's free REST API to easily request and accept verifiable credentials in apps and services. In both cases, your Azure AD tenant needs to be configured to either issue your own verifiable credentials, or verify the presentation of a user's verifiable credentials issued by a third party. In the event that you are both an issuer and a verifier, you can use a single Azure AD tenant to both issue your own verifiable credentials and verify those of others.

In this tutorial, you learn how to configure your Azure AD tenant to use the verifiable credentials service.

Specifically, you learn how to:

> [!div class="checklist"]
> - Create an Azure Key Vault instance.
> - Set up the Verified ID service.
> - Register an application in Azure AD.

The following diagram illustrates the Verified ID architecture and the component you configure.

:::image type="content" source="media/verifiable-credentials-configure-tenant/verifiable-credentials-architecture.png" alt-text="Diagram that illustrates the Microsoft Entra Verified ID architecture." border="false":::

## Prerequisites

- You need an Azure tenant with an active subscription. If you don't have an Azure subscription, [create one for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).
- Ensure that you have the [global administrator](../../active-directory/roles/permissions-reference.md#global-administrator) or the [authentication policy administrator](../../active-directory/roles/permissions-reference.md#authentication-policy-administrator) permission for the directory you want to configure. If you're not the global administrator, you need the [application administrator](../../active-directory/roles/permissions-reference.md#application-administrator) permission to complete the app registration including granting admin consent.
- Ensure that you have the [contributor](../../role-based-access-control/built-in-roles.md#contributor) role for the Azure subscription or the resource group where you are deploying Azure Key Vault.

## Create a key vault

[Azure Key Vault](../../key-vault/general/basic-concepts.md) is a cloud service that enables the secure storage and access of secrets and keys. The Verified ID service stores public and private keys in Azure Key Vault. These keys are used to sign and verify credentials.

If you don't have an Azure Key Vault instance available, follow [these steps](../../key-vault/general/quick-create-portal.md) to create a key vault using the Azure portal.

>[!NOTE]
>By default, the account that creates a vault is the only one with access. The Verified ID service needs access to the key vault. You must configure your key vault with access policies allowing the account used during configuration to create and delete keys. The account used during configuration also requires permissions to sign so that it can create the domain binding for Verified ID. If you use the same account while testing, modify the default policy to grant the account sign permission, in addition to the default permissions granted to vault creators.

### Set access policies for the key vault

A Key Vault [access policy](../../key-vault/general/assign-access-policy.md) defines whether a specified security principal can perform operations on Key Vault secrets and keys. Set access policies in your key vault for both the Verified ID service administrator account, and for the Request Service API principal that you created.
After you create your key vault, Verifiable Credentials generates a set of keys used to provide message security. These keys are stored in Key Vault. You use a key set for signing, updating, and recovering verifiable credentials.

### Set access policies for the Verified ID Admin user

[!INCLUDE [portal updates](~/articles/active-directory/includes/portal-update.md)]

1. Sign in to the [Azure portal](https://portal.azure.com).

1. Go to the key vault you use for this tutorial.

1. Under **Settings**, select **Access policies**.

1. In **Add access policies**, under **USER**, select the account you use to follow this tutorial.

1. For **Key permissions**, verify that the following permissions are selected: **Get**, **Create**, **Delete**, and **Sign**. By default, **Create** and **Delete** are already enabled. **Sign** should be the only key permission you need to update.

    :::image type="content" source="media/verifiable-credentials-configure-tenant/set-key-vault-admin-access-policy.png" alt-text="Screenshot that shows how to configure the admin access policy." border="false":::

1. To save the changes, select **Save**.

## Set up Verified ID

:::image type="content" source="media/verifiable-credentials-configure-tenant/verifiable-credentials-getting-started.png" alt-text="Screenshot that shows how to set up Verifiable Credentials.":::

To set up Verified ID, follow these steps:

1. Sign in to the [Azure portal](https://portal.azure.com).

1. Search for *Verified ID*. Then, select **Verified ID**.

1. From the left menu, select **Setup**.

1. From the middle menu, select **Define organization settings**

1. Set up your organization by providing the following information:

    1. **Organization name**: Enter a name to reference your business within Verified IDs. Your customers don't see this name.

    1. **Trusted domain**: Enter a domain that's added to a service endpoint in your decentralized identity (DID) document. The domain is what binds your DID to something tangible that the user might know about your business. Microsoft Authenticator and other digital wallets use this information to validate that your DID is linked to your domain. If the wallet can verify the DID, it displays a verified symbol. If the wallet can't verify the DID, it informs the user that the credential was issued by an organization it couldn't validate.

        >[!IMPORTANT]
        > The domain can't be a redirect. Otherwise, the DID and domain can't be linked. Make sure to use HTTPS for the domain. For example: `https://did.woodgrove.com`.

    1. **Key vault**: Select the key vault that you created earlier.

    1. Under **Advanced**, you may choose the **trust system** that you want to use for your tenant. You can choose from either **Web** or **ION**. Web means your tenant uses [did:web](https://w3c-ccg.github.io/did-method-web/) as the did method and ION means it uses [did:ion](https://identity.foundation/ion/).

        >[!IMPORTANT]
        > The only way to change the trust system is to opt-out of the Verified ID service and redo the onboarding.

1. Select **Save**.  

    :::image type="content" source="media/verifiable-credentials-configure-tenant/verifiable-credentials-getting-started-save.png" alt-text="Screenshot that shows how to set up Verifiable Credentials first step.":::

### Set access policies for the Verified ID service principals

When you set up Verified ID in the previous step, the access policies in Azure Key Vault are automatically updated to give service principals for Verified ID the required permissions.  
If you ever are in need of manually resetting the permissions, the access policy should look like below.

| Service Principal | AppId | Key Permissions |
| -------- | -------- | -------- |
| Verifiable Credentials Service | bb2a64ee-5d29-4b07-a491-25806dc854d3 | Get, Sign |
| Verifiable Credentials Service Request | 3db474b9-6a0c-4840-96ac-1fceb342124f | Sign |

:::image type="content" source="media/verifiable-credentials-configure-tenant/sp-key-vault-admin-access-policy.png" alt-text="Screenshot of key vault access policies for security principals.":::

## Register an application in Azure AD

Your application needs to get access tokens when it wants to call into Microsoft Entra Verified ID so it can issue or verify credentials. To get access tokens, you have to register an application and grant API permission for the Verified ID Request Service. For example, use the following steps for a web application:

1. Sign in to the [Azure portal](https://portal.azure.com) with your administrative account.

1. If you have access to multiple tenants, select the **Directory + subscription**. Then, search for and select your **Azure Active Directory**.

1. Under **Manage**, select **App registrations** > **New registration**.  

    :::image type="content" source="media/verifiable-credentials-configure-tenant/register-app.png" alt-text="Screenshot that shows how to select a new application registration.":::

1. Enter a display name for your application. For example: *verifiable-credentials-app*.

1. For **Supported account types**, select **Accounts in this organizational directory only (Default Directory only - Single tenant)**.

1. Select **Register** to create the application.

    :::image type="content" source="media/verifiable-credentials-configure-tenant/register-app-properties.png" alt-text="Screenshot that shows how to register the verifiable credentials app.":::

### Grant permissions to get access tokens

In this step, you grant permissions to the **Verifiable Credentials Service Request** Service principal.

To add the required permissions, follow these steps:

1. Stay in the **verifiable-credentials-app** application details page. Select **API permissions** > **Add a permission**.

    :::image type="content"  source="media/verifiable-credentials-configure-tenant/add-app-api-permissions.png" alt-text="Screenshot that shows how to add permissions to the verifiable credentials app.":::

1. Select **APIs my organization uses**.

1. Search for the **Verifiable Credentials Service Request** service principal and select it.

    :::image type="content" source="media/verifiable-credentials-configure-tenant/add-app-api-permissions-select-service-principal.png" alt-text="Screenshot that shows how to select the service principal.":::

1. Choose **Application Permission**, and expand **VerifiableCredential.Create.All**.

    :::image type="content" source="media/verifiable-credentials-configure-tenant/add-app-api-permissions-verifiable-credentials.png" alt-text="Screenshot that shows how to select the required permissions.":::

1. Select **Add permissions**.

1. Select **Grant admin consent for \<your tenant name\>**.

You can choose to grant issuance and presentation permissions separately if you prefer to segregate the scopes to different applications.

:::image type="content" source="media/verifiable-credentials-configure-tenant/granular-app-permissions.png" alt-text="Screenshot that shows how to select granular permissions for issuance or presentation.":::

## Register decentralized ID and verify domain ownership

After Azure Key Vault is setup, and the service have a signing key, you must complete step 2 and 3 in the setup.

:::image type="content" source="media/verifiable-credentials-configure-tenant/verifiable-credentials-getting-started-step-2-3.png" alt-text="Screenshot that shows how to set up Verifiable Credentials step 2 and 3.":::

1. Navigate to the Verified ID service in the Azure portal.  
1. From the left menu, select **Setup**.
1. From the middle menu, select **Register decentralized ID** to register your DID document, as per instructions in article [How to register your decentralized ID for did:web](how-to-register-didwebsite.md). You must complete this step before you can continue to verify your domain. If you selected did:ion as your trust system, you should skip this step.
1. From the middle menu, select **Verify domain ownership** to verify your domain, as per instructions in article [Verify domain ownership to your Decentralized Identifier (DID)](how-to-dnsbind.md)

Once that you have successfully completed the verification steps, and have green checkmarks on all three steps, you are ready to continue to the next tutorial.

## Next steps

- [Learn how to issue Microsoft Entra Verified ID credentials from a web application](verifiable-credentials-configure-issuer.md).
- [Learn how to verify Microsoft Entra Verified ID credentials](verifiable-credentials-configure-verifier.md).
