---
title: Create and configure a dev center
titleSuffix: Azure Deployment Environments
description: Learn how to configure a dev center in Deployment Environments. You create a dev center, attach an identity, attach a catalog, and create environment types.
author: RoseHJM
ms.author: rosemalcolm
ms.topic: quickstart
ms.service: deployment-environments
ms.custom: ignite-2022, build-2023
ms.date: 04/25/2023
---

# Quickstart: Create and configure a dev center for Azure Deployment Environments

This quickstart shows you how to create and configure a dev center in Azure Deployment Environments.

A platform engineering team typically sets up a dev center, attaches external catalogs to the dev center, creates projects, and provides access to development teams. Development teams create [environments](concept-environments-key-concepts.md#environments) by using [environment definitions](concept-environments-key-concepts.md#environment-definitions), connect to individual resources, and deploy applications. To learn more about the components of Azure Deployment Environments, see [Key concepts for Azure Deployment Environments](concept-environments-key-concepts.md).

The following diagram shows the steps you perform in this quickstart to configure a dev center for Azure Deployment Environments in the Azure portal. 

:::image type="content" source="media/quickstart-create-and-configure-devcenter/dev-box-build-stages-1a.png" alt-text="Diagram showing the stages required to configure a dev center for Deployment Environments.":::

First, you create a dev center to organize your deployment environments resources. Next, you create a key vault to store the GitHub personal access token (PAT) that is used to grant Azure access to your GitHub repository. Then, you attach an identity to the dev center and assign that identity access to the key vault. Then, you add a catalog that stores your IaC templates to the dev center. Finally, you create environment types to define the types of environments that development teams can create. 


The following diagram shows the steps you perform in the [Create and configure a project quickstart](quickstart-create-and-configure-projects.md) to configure a project associated with a dev center for Deployment Environments.

:::image type="content" source="media/quickstart-create-and-configure-devcenter/dev-box-build-stages-1b.png" alt-text="Diagram showing the stages required to configure a project for Deployment Environments.":::

You need to perform the steps in both quickstarts before you can create a deployment environment.

## Prerequisites

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).
- Azure role-based access control role with permissions to create and manage resources in the subscription, such as [Contributor](../role-based-access-control/built-in-roles.md#contributor) or [Owner](../role-based-access-control/built-in-roles.md#owner).

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

1. Select **Review + Create**.
1. On the **Review** tab, wait for deployment validation, and then select **Create**.

    :::image type="content" source="media/quickstart-create-and-configure-devcenter/create-devcenter-review.png" alt-text="Screenshot that shows the Review tab of a dev center to validate the deployment details.":::

1. You can check the progress of the deployment in your Azure portal notifications. 

    :::image type="content" source="media/quickstart-create-and-configure-devcenter/azure-notifications.png" alt-text="Screenshot that shows portal notifications to confirm the creation of a dev center.":::

1. When the creation of the dev center is complete, select **Go to resource**.

1. In **Dev centers**, verify that the dev center appears.

    :::image type="content" source="media/quickstart-create-and-configure-devcenter/deployment-environments-devcenter-created.png" alt-text="Screenshot that shows the Dev centers overview, to confirm that the dev center is created.":::

## Create a Key Vault
You need an Azure Key Vault to store the GitHub personal access token (PAT) that is used to grant Azure access to your GitHub repository. Key Vaults can control access with either access policies or role-based access control (RBAC). If you have an existing key vault, you can use it, but you should check whether it uses access policies or RBAC assignments to control access. In this quickstart, you create an RBAC Key Vault. For help with configuring an access policy for a key vault, see [Assign a Key Vault access policy](/azure/key-vault/general/assign-access-policy?branch=main&tabs=azure-portal). 

If you don't have an existing key vault, use the following steps to create one:

1.	Sign in to the [Azure portal](https://portal.azure.com).
1.	In the Search box, enter *Key Vault*.
1.	From the results list, select **Key Vault**.
1.	On the Key Vault page, select **Create**.
1.	On the Create key vault tab, provide the following information:

    |Name      |Value      |
    |----------|-----------|
    |**Name**|Enter a name for the key vault.|
    |**Subscription**|Select the subscription in which you want to create the key vault.|
    |**Resource group**|Either use an existing resource group or select **Create new** and enter a name for the resource group.|
    |**Location**|Select the location or region where you want to create the key vault.|
    
    Leave the other options at their defaults.

1. On the Access configuration tab, select **Azure role-based access control**, and then select **Review + create**.

1. On the Review + create tab, select **Create**.

## Create a personal access token
Using an authentication token like a GitHub PAT enables you to share your repository securely.  GitHub offers classic PATs, and fine-grained PATs. Fine-grained and classic PATs work with Azure Deployment Environments, but fine-grained tokens give you more granular control over the repositories to which you're allowing access.

> [!TIP] 
> If you are attaching an Azure DevOps repository, use these steps: [Create a personal access token in Azure DevOps](how-to-configure-catalog.md#create-a-personal-access-token-in-azure-devops).

1.	In a new browser tab, sign into your [GitHub](https://github.com) account.
1.	On your profile menu, select **Settings**.
1.	On your account page, on the left menu, select **< >Developer Settings**.
1.	On the Developer settings page, select **Fine-grained tokens**.
    
    :::image type="content" source="media/quickstart-create-and-configure-devcenter/github-fine-grained-pat.png" alt-text="Screenshot that shows the GitHub Fine-grained tokens option.":::
     
1. On the Fine-grained personal access tokens page, select **Generate new token**
   :::image type="content" source="media/quickstart-create-and-configure-devcenter/generate-github-fine-grained-token.png" alt-text="Screenshot showing the GitHub Fine-grained personal access tokens page with Generate new token highlighted.":::

1. On the New fine-grained personal access token page, provide the following information:

    |Name      |Value      |
    |----------|-----------|
    |**Token name**|Enter a descriptive name for the token.|
    |**Expiration**|Select the token expiration period in days.|
    |**Description**|Enter a description for the token.|
    |**Repository access**|Select **Public Repositories (read-only)**.|
    
    Leave the other options at their defaults.

    :::image type="content" source="media/quickstart-create-and-configure-devcenter/github-public-repo-permissions.png" alt-text="Screenshot showing the GitHub New fine-grained personal access token page.":::

1. Select **Generate token**.
1. On the Fine-grained personal access tokens page, copy the new token.
 
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
1.	Leave this tab open, you need to come back to the Key Vault later.

## Attach an identity to the dev center

After you create a dev center, attach an [identity](concept-environments-key-concepts.md#identities) to the dev center. You can attach either a system-assigned managed identity or a user-assigned managed identity. Learn about the two [types of identities](how-to-configure-managed-identity.md#add-a-managed-identity).

In this quickstart, you configure a system-assigned managed identity for your dev center. 

### Attach a system-assigned managed identity

To attach a system-assigned managed identity to your dev center:

1.	In Dev centers, select your dev center.
1.	In the left menu under Settings, select **Identity**.
1.	Under **System assigned**, set **Status** to **On**, and then select **Save**.

    :::image type="content" source="media/quickstart-create-and-configure-devcenter/system-assigned-managed-identity-on.png" alt-text="Screenshot that shows a system-assigned managed identity.":::

1.	In the **Enable system assigned managed identity** dialog, select **Yes**.

### Assign the system-assigned managed identity access to the key vault secret
Make sure that the identity has access to the key vault secret that contains the personal access token to access your repository. Key Vaults support two methods of access; Azure role-based access control (RBAC) or Vault access policy. In this quickstart, you use an RBAC key vault.

Configure vault access:
1. In the Azure portal, go to the key vault that contains the secret with the personal access token.

1. In the left menu, select **Access control (IAM)**.

1. Select **Add** > **Add role assignment**.

1. Assign the following role. For detailed steps, see [Assign Azure roles using the Azure portal](../role-based-access-control/role-assignments-portal.md).
    
    | Setting | Value |
    | --- | --- |
    | **Role** | Select **Key Vault Secrets User**. |
    | **Assign access to** | Select **Managed identity**. |
    | **Members** | Select the dev center managed identity that you created in [Attach a system-assigned managed identity](#attach-a-system-assigned-managed-identity). |

## Add a catalog to the dev center
Azure Deployment Environments supports attaching Azure DevOps repositories and GitHub repositories. You can store a set of curated IaC templates in a repository. Attaching the repository to a dev center as a catalog gives your development teams access to the templates and enables them to quickly create consistent environments.

In this quickstart, you attach a GitHub repository that contains samples created and maintained by the Azure Deployment Environments team.

To add a catalog to your dev center, you first need to gather some information.

### Gather GitHub repo information
To add a catalog, you must specify the GitHub repo URL, the branch, and the folder that contains your environment definitions. You can gather this information before you begin the process of adding the catalog to the dev center, and paste it somewhere accessible, like notepad.

> [!TIP]
> If you are attaching an Azure DevOps repository, use these steps: [Get the clone URL of an Azure DevOps repository](how-to-configure-catalog.md#get-the-clone-url-of-an-azure-devops-repository).

1. On your [GitHub](https://github.com) account page, select **<> Code**, and then select copy.
1. Take a note of the branch that you're working in.
1. Take a note of the folder that contains your environment definitions. 
 
     :::image type="content" source="media/quickstart-create-and-configure-devcenter/github-info.png" alt-text="Screenshot that shows the GitHub repo with Code, branch, and folder highlighted.":::

### Gather the secret identifier
You also need the path to the secret you created in the key vault. 

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

1. In **Add catalog**, enter the following information, and then select **Add**:

    | Field | Value |
    | ----- | ----- |
    | **Name** | Enter a name for the catalog. |
    | **Git clone URI**  | Enter or paste the clone URL for either your GitHub repository or your Azure DevOps repository.<br />*Sample catalog example:* `https://github.com/Azure/deployment-environments.git` |
    | **Branch**  | Enter the repository branch to connect to.<br />*Sample catalog example:* `main`|
    | **Folder path**  | Enter the folder path relative to the clone URI that contains subfolders that hold your environment definitions. <br /> The folder path is for the folder with subfolders containing environment definition manifests, not for the folder with the environment definition manifest itself. The following image shows the sample catalog folder structure.<br />*Sample catalog example:* `/Environments`<br /> :::image type="content" source="media/how-to-configure-catalog/github-folders.png" alt-text="Screenshot showing Environments sample folder in GitHub."::: The folder path can begin with or without a forward slash (`/`).|
    | **Secret identifier**| Enter the [secret identifier](#create-a-personal-access-token) that contains your personal access token for the repository.<br /> When you copy a secret identifier, the connection string includes a version identifier at the end, like in this example: `https://contoso-kv.vault.azure.net/secrets/GitHub-repo-pat/9376b432b72441a1b9e795695708ea5a`.<br />Removing the version identifier ensures that Deployment Environments fetches the latest version of the secret from the key vault. If your personal access token expires, only the key vault needs to be updated. <br />*Example secret identifier:* `https://contoso-kv.vault.azure.net/secrets/GitHub-repo-pat`|

   :::image type="content" source="media/how-to-configure-catalog/add-catalog-form-inline.png" alt-text="Screenshot that shows how to add a catalog to a dev center." lightbox="media/how-to-configure-catalog/add-catalog-form-expanded.png":::

1. In **Catalogs** for the dev center, verify that your catalog appears. If the connection is successful, **Status** is **Connected**.

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
