---
title: Create and configure a dev center
titleSuffix: Azure Deployment Environments
description: Learn how to create and configure a dev center in Azure Deployment Environments Preview. In the quickstart, you create a dev center, attach an identity, attach a catalog, and create environment types.
author: RoseHJM
ms.author: rosemalcolm
ms.topic: quickstart
ms.service: deployment-environments
ms.custom: ignite-2022
ms.date: 12/20/2022
---

# Quickstart: Create and configure a dev center

This quickstart shows you how to create and configure a dev center in Azure Deployment Environments Preview.

An enterprise development infrastructure team typically sets up a dev center, configures authentication so that the dev center can connect to external catalogs, creates projects, and provides access to development teams. Development teams create [environments](concept-environments-key-concepts.md#environments) by using [catalog items](concept-environments-key-concepts.md#catalog-items), connect to individual resources, and deploy applications.

> [!IMPORTANT]
> Azure Deployment Environments currently is in preview. For legal terms that apply to Azure features that are in beta, in preview, or otherwise not yet released into general availability, review the [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).

## Prerequisites

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).
- Azure role-based access control role with permissions to create and manage resources in the subscription, such as [Contributor](../role-based-access-control/built-in-roles.md#contributor) or [Owner](../role-based-access-control/built-in-roles.md#owner).

## Create a Key Vault
You'll need an Azure Key Vault to store the GitHub personal access token (PAT) that is used to grant Azure access to your GitHub repository. 
If you don't have an existing key vault, use the following steps to create one:

1.	Sign in to the [Azure portal](https://portal.azure.com).
1.	In the Search box, enter *Key Vault*.
1.	From the results list, select **Key Vault**.
1.	On the Key Vault page, select **Create**.
1.	On the Create key vault page provide the following information:

    |Name      |Value      |
    |----------|-----------|
    |**Name**|Enter a name for the dev center.|
    |**Subscription**|Select the subscription in which you want to create the key vault.|
    |**Resource group**|Either use an existing resource group or select **Create new** and enter a name for the resource group.|
    |**Location**|Select the location or region where you want to create the key vault.|
    
    Leave the other options at their defaults.

1.	Select **Create**.

## Create a GitHub PAT
Using an authentication token like a GitHub PAT enables you to share your repository securely.  

1.	In a new browser tab, sign into your [GitHub](https://github.com) account.
1.	On your profile menu, select **Settings**.
1.	On your account page, on the left menu, select **< >Developer Settings**.
1.	On the Developer settings page, select **Tokens (classic)**.
    
    :::image type="content" source="media/quickstart-create-and-configure-devcenter/github-pat.png" alt-text="Screenshot that shows the GitHub Tokens (classic) option.":::
    
    Fine grained and classic tokens work with Azure Deployment Environments.

1. On the New personal access token (classic) page:
    - In the **Note** box, add a note describing the token’s intended use.
    - In **Select scopes**, select repo.

    :::image type="content" source="media/quickstart-create-and-configure-devcenter/generate-git-hub-token.png" alt-text="Screenshot that shows the GitHub Tokens (classic) configuration page.":::

1. Select **Generate token**.
1. On the Personal access tokens (classic) page, copy the new token.
 
    :::image type="content" source="media/quickstart-create-and-configure-devcenter/copy-new-token.png" alt-text="Screenshot that shows the new GitHub token with the copy button highlighted.":::

    > [!WARNING]
    > You must copy the token now. You will not be able to access it again.

1.	Switch back to the **Key Vault – Microsoft Azure** browser tab.
1.	In the Key Vault, on the left menu, select **Secrets**.
1.	On the Secrets page, select **Generate/Import**.
 
    :::image type="content" source="media/quickstart-create-and-configure-devcenter/import-secret.png" alt-text="Screenshot that shows the key vault Secrets page with the generate/import button highlighted.":::

1.	On the Create a secret page:
    - In the **Name** box, enter a descriptive name for your secret.
    - In the **Secret value** box, paste the GitHub secret you copied in step 7.

    :::image type="content" source="media/quickstart-create-and-configure-devcenter/create-secret-in-key-vault.png" alt-text="Screenshot that shows the Create a secret page with the Name and Secret value text boxes highlighted.":::

    - Select **Create**.
1.	Leave this tab open, you’ll need to come back to the Key Vault later.

## Create a dev center
To create and configure a Dev center in Azure Deployment Environments by using the Azure portal:

1. Sign in to the [Azure portal](https://portal.azure.com).
1. Search for **Azure Deployment Environments**, and then select the service in the results.
1. In **Dev centers**, select **Create**.

    :::image type="content" source="media/quickstart-create-and-configure-devcenter/deployment-environments-add-devcenter.png" alt-text="Screenshot that shows how to create a dev center in Azure Deployment Environments.":::

1. In **Create a dev center**, on the **Basics** tab, select or enter the following information:

    |Name      |Value      |
    |----------|-----------|
    |**Subscription**|Select the subscription in which you want to create the dev center.|
    |**Resource group**|Either use an existing resource group or select **Create new** and enter a name for the resource group.|
    |**Name**|Enter a name for the dev center.|
    |**Location**|Select the location or region where you want to create the dev center.|

1. (Optional) Select the **Tags** tab and enter a **Name**:**Value** pair.
1. Select **Review + Create**.
1. On the **Review** tab, wait for deployment validation, and then select **Create**.

    :::image type="content" source="media/quickstart-create-and-configure-devcenter/create-devcenter-review.png" alt-text="Screenshot that shows the Review tab of a dev center to validate the deployment details.":::

1. Confirm that the dev center was successfully created by checking your Azure portal notifications. Then, select **Go to resource**.

    :::image type="content" source="media/quickstart-create-and-configure-devcenter/azure-notifications.png" alt-text="Screenshot that shows portal notifications to confirm the creation of a dev center.":::

1. In **Dev centers**, verify that the dev center appears.

    :::image type="content" source="media/quickstart-create-and-configure-devcenter/deployment-environments-devcenter-created.png" alt-text="Screenshot that shows the Dev centers overview, to confirm that the dev center is created.":::

## Attach an identity to the dev center

After you create a dev center, attach an [identity](concept-environments-key-concepts.md#identities) to the dev center. Learn about the two [types of identities](how-to-configure-managed-identity.md#add-a-managed-identity) you can attach:

- System-assigned managed identity
- User-assigned managed identity

You can use a system-assigned managed identity or a user-assigned managed identity. You don't have to use both. For more information, review [Configure a managed identity](how-to-configure-managed-identity.md).

In this quickstart, you'll configure a system-assigned managed identity for your dev center. 

### Attach a system-assigned managed identity

To attach a system-assigned managed identity to your dev center:

1.	In Dev centers, select your dev center.
1.	In the left menu under Settings, select **Identity**.
1.	Under **System assigned**, set **Status** to **On**, and then select **Save**.

    :::image type="content" source="media/quickstart-create-and-configure-devcenter/system-assigned-managed-identity-on.png" alt-text="Screenshot that shows a system-assigned managed identity.":::

1.	In the **Enable system assigned managed identity** dialog, select **Yes**.

### Assign the system-assigned managed identity the owner role to the subscription
After you create a system-assigned managed identity, assign the Owner role to give the identity access on the subscriptions that will be used to configure [project environment types](concept-environments-key-concepts.md#project-environment-types).

1.	On the left menu under Settings, select **Identity**.
1.	Under System assigned > Permissions, select **Azure role assignments**.

    :::image type="content" source="media/quickstart-create-and-configure-devcenter/system-assigned-managed-identity.png" alt-text="Screenshot that shows a system-assigned managed identity with Role assignments highlighted.":::

1. In Azure role assignments, select **Add role assignment (Preview)**, and then enter or select the following information:
    - In **Scope**, select **Subscription**.
    - In **Subscription**, select the subscription in which to use the managed identity.
    - In **Role**, select **Owner**.
    - Select **Save**.

### Assign the system-assigned managed identity access to the key vault secret
Make sure that the identity has access to the key vault secret that contains the personal access token to access your repository.

Configure a key vault access policy:
1.	In the Azure portal, go to the key vault that contains the secret with the personal access token.
2.	In the left menu, select **Access policies**, and then select **Create**.
3.	In Create an access policy, enter or select the following information:
    - On the Permissions tab, under **Secret permissions**, select **Select all**, and then select **Next**.
    - On the Principal tab, select the identity that's attached to the dev center, and then select **Next**.
    - Select **Review + create**, and then select **Create**.


## Add a catalog to the dev center
To add a catalog to your dev center you'll first need to gather some information.

### Gather GitHub repo information
To add a catalog, you must specify the GitHub repo URL, the branch, and the folder that contains your catalog items. You can gather this information before you begin the process of adding the catalog to the dev center, and paste it somewhere accessible, like notepad.

1. On your [GitHub](https://github.com) account page, select **<> Code**, and then select copy.
1. Take a note of the branch that you are working in.
1. Take a note of the folder that contains your catalog items. 
 
     :::image type="content" source="media/quickstart-create-and-configure-devcenter/github-info.png" alt-text="Screenshot that shows the GitHub repo with Code, branch, and folder highlighted.":::

### Gather the secret identifier
You will also need the path to the secret you created in the key vault. 

1. In the Azure portal, navigate to your key vault.
1. On the key vault page, from the left menu, select **Secrets**.
1. On the Secrets page, select the secret you created earlier.

    :::image type="content" source="media/quickstart-create-and-configure-devcenter/key-vault-secrets-page.png" alt-text="Screenshot that shows the list of secrets in the key vault with one highlighted.":::

1. On the versions page, select the **CURRENT VERSION**.
 
    :::image type="content" source="media/quickstart-create-and-configure-devcenter/key-vault-versions-page.png" alt-text="Screenshot that shows the current version of the select secret.":::

1. On the current version page, for the **Secret identifier**, select copy.

    :::image type="content" source="media/quickstart-create-and-configure-devcenter/key-vault-current-version-page.png" alt-text="Screenshot that shows the details current version of the select secret with the secret identifier copy button highlighted.":::

### Add a catalog to your dev center
1. Navigate to your dev center.
1. In the left menu under **Environment configuration**, select **Catalogs**, and then select **Add**.

    :::image type="content" source="media/quickstart-create-and-configure-devcenter/catalogs-page.png" alt-text="Screenshot that shows the Catalogs pane.":::

1. In the **Add catalog** pane, enter the following information, and then select **Add**.

    | Name | Value |
    | ----- | ----- |
    | **Name** | Enter a name for the catalog. |
    | **Git clone URI**  | Enter or paste the clone URL for either your GitHub repository or your Azure DevOps repository.<br/>*Sample Catalog Example:* https://github.com/Azure/deployment-environments.git |
    | **Branch**  | Enter the repository branch to connect to.<br/>*Sample Catalog Example:* main|
    | **Folder path**  | Enter the folder path relative to the clone URI that contains subfolders with your catalog items. This folder path should be the path to the folder that contains the subfolders with the catalog item manifests, and not the path to the folder with the catalog item manifest itself.<br/>*Sample Catalog Example:* /Environments|
    | **Secret identifier**| Enter the secret identifier that contains your personal access token for the repository.|

   :::image type="content" source="media/how-to-configure-catalog/add-new-catalog-form.png" alt-text="Screenshot that shows how to add a catalog to a dev center.":::

1. Confirm that the catalog is successfully added by checking your Azure portal notifications.

1. Select the specific repository, and then select **Sync**.

    :::image type="content" source="media/quickstart-create-and-configure-devcenter/sync-catalog.png" alt-text="Screenshot that shows how to sync the catalog." :::

## Create an environment type

Use an environment type to help you define the different types of environments your development teams can deploy. You can apply different settings for each environment type.

1. In the Azure portal, go to Azure Deployment Environments.
1. In **Dev centers**, select your dev center.
1. In the left menu under **Environment configuration**, select **Environment types**, and then select **Create**.
1. In **Create environment type**, enter the following information, and then select **Add**.

    |Name     |Value     |
    |---------|----------|
    |**Name**|Enter a name for the environment type.|
    |**Tags**|Enter a tag name and a tag value.|

    :::image type="content" source="media/quickstart-create-and-configure-devcenter/create-environment-type.png" alt-text="Screenshot that shows the Create environment type pane.":::

1. Confirm that the environment type is added by checking your Azure portal notifications.

An environment type that you add to your dev center is available in each project in the dev center, but environment types aren't enabled by default. When you enable an environment type at the project level, the environment type determines the managed identity and subscription that are used to deploy environments.

## Next steps

In this quickstart, you created a dev center and configured it with an identity, a catalog, and an environment type. To learn how to create and configure a project, advance to the next quickstart.

> [!div class="nextstepaction"]
> [Quickstart: Create and configure a project](./quickstart-create-and-configure-projects.md)
