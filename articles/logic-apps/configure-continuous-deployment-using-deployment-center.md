---
title: Set Up CD for Standard Logic Apps with Deployment Center
description: Learn how to automate deployment for Standard logic apps with Deployment Center in Azure.
ms.service: azure-logic-apps
ms.suite: integration
ms.reviewer: estfan, wsilveiranz, azla
ms.topic: how-to
ms.date: 08/14/2025
# Customer intent: As a logic app workflow developer, I want to automate deployment for Standard logic apps by directly integrating my source code repository with my logic app resources and setting up continuous deployment by using Deployment Center in Azure.
---

# Set up CD for Standard logic apps with Deployment Center in Azure

[!INCLUDE [logic-apps-sku-standard](../../includes/logic-apps-sku-standard.md)]

To streamline automation for your Standard logic app deployments, directly integrate your source code repository with your logic app resources by using Deployment Center in Azure. Deployment Center gives you the capability to set up continuous deployment (CD), so you can make sure that every change committed to your repository gets automatically deployed to your logic app in Azure. This configuration helps your team ship new features, fix bugs, and respond to changes more quickly, yet maintain control and visibility over the deployment process.

Deployment Center supports multiple source control providers, seamlessly fits into modern DevOps workloads and scenarios, and makes sure that your logic apps stay current and production ready.

Due to Azure Logic Apps (Standard) similarities with Azure Functions, for more information about Deployment Center, see [Continuous deployment for Azure Functions](../azure-functions/functions-continuous-deployment.md).

## Prerequisites

- An Azure account and subscription. If you don't have an Azure subscription, [sign up for a free Azure account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).

- [Visual Studio Code with the Azure Logic Apps (Standard) extension installed and their prerequisites](/azure/logic-apps/create-single-tenant-workflows-visual-studio-code#prerequisites).

- An Azure Key Vault resource for you to store connection strings and secrets.

  For more information, see [Quickstart: Create a key vault using the Azure portal](../key-vault/general/quick-create-portal.md).

- Your Standard logic app resource with the following requirements:

  | Requirement | Description |
  |-------------|-------------|
  | Enable the **SCM Basic Auth Publishing Credentials** setting. | To enable this setting, see [Turn on SCM Basic Auth Publishing Credentials](#turn-on-scm-basic-auth-publishing-credentials). |
  | Create a *user-assigned managed identity* on your logic app. | This identity needs to have role assignments on the following resources: <br><br>- **Logic Apps Standard Contributor** role on your logic app's resource group. <br><br>- **Key Vault Secrets User** role on your key vault resource. <br><br>For more information, see [Create the user-assigned managed identity and assign roles](#set-up-user-identity-and-assign-roles). |
  | Create a workspace and project in Visual Studo Code for your logic app. | This workspace also needs a connection to your source control repository. To create the workspace and project, you can [export your Standard logic app to Visual Studio Code](export-standard-logic-app-to-visual-studio-code.md). |

### Turn on SCM Basic Auth publishing credentials

1. In the [Azure portal](https://portal.azure.com), open your Standard logic app resource.

1. On the resource sidebar, under **Settings**, select **Configuration**.

1. On the **General settings** tab, under **Platform settings**, select **SCM Basic Auth Publishing Credentials** so that the setting is turned on.

1. When you're done, select **Apply**.

### Create the user-assigned managed identity and assign roles

1. In the [Azure portal](https://portal.azure.com), open your Standard logic app resource.

1. Follow the [general steps to create the user-assigned managed identity](authenticate-with-managed-identity.md?tabs=standard#create-user-assigned-identity-in-the-azure-portal).

1. Follow the [general steps to add the user-assigned managed identity to your logic app](authenticate-with-managed-identity.md?tabs=standard#add-user-assigned-identity-to-logic-app-in-the-azure-portal).

1. Follow the [general steps to give the identity access to the resources](authenticate-with-managed-identity.md?tabs=standard#give-identity-access-to-resources) in the [Prerequisites section](#prerequisites).

1. When you're done, continue on to create scripts for Deployment Center.

## Create Deployment Center scripts in Visual Studio Code

1. In Visual Studio Code, open your **Logic Apps project** context menu and select **Generate deployment scripts…**

    ![An image of the Logic Apps Standard context Menu with the Generate deployment script option selected.](media/generate-deployment-screen-menu-option.png)

1. Complete the steps, following the prompts from the wizard:

   - Select the existing Azure subscription where your Logic Apps is deployed.
   - Select the the target resource group.
   - Select the target Logic Apps application.
   - Select the associated user managed identity that has the **Logic Apps Standard Contributor** permissions.

When you're done, Visual Studio Code creates the following resources:

| Folder Name                   | File Name           | Description                                                                                                                                                                                                                                                                                                                                                         |
|-------------------------------|---------------------|---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| \<Logic Apps project folder\> | cloud.settings.json | This file copies the keys required to deploy the Logic Apps application from the local.settings.json. The file will have associated values for any nonsecret value, and a placeholder to include a keyvault reference for any secrets.                                                                                                                             |
| deployment                    | deploy.ps1          | This is the deployment script parameterized with the items you selected during the wizard. This script deploys the logic app code and update the authentication required for any Azure managed connection defined in connections.json. It also configures the settings defined in the cloud.settings.json file created in the Logic Apps project. |
|                               | README.md           | The README.md file contains instructions on how to update cloud.settings.json to safely deploy application secrets, including: Connection strings required for Service Provider connections in the project. API Management keys Azure Function keys Any other customer defined secrets.                                                                             |

Once you review the files and update cloud.settings.json with the keyvault references, push your changes to your source control.

### Configure Azure Logic Apps Standard Deployment Center in the portal

# [GitHub](#tab/github)
To configure Azure Logic Apps Standard Deployment Center with a GitHub repository, follow these steps:

1.  In the [Azure portal](https://portal.azure.com/), go to your Standard logic app resource.
2.  On the logic app menu, under **Deployment**, select **Deployment Center.**
3.  Select GitHub as source repository.
4.  Change the provider to App Service Build Service.

    ![An image of the Build Provide drop-down menu.](media/select-build-provider.png)

5.  Sign in to GitHub, if you aren't signed yet.
6.  Select your organization.
7.  Select your repository.
8.  Select your branch.

Scroll back to the top of the page and click **Save.**

# [Azure Repos](#tab/azure-repos)
To configure Azure Logic Apps Standard Deployment Center with an Azure Repo repository, follow these steps:

1.  In the [Azure portal](https://portal.azure.com/), go to your Standard logic app resource.
2.  On the logic app menu, under **Deployment**, select **Deployment Center.**
3.  Select Azure Repos as source repository.
4.  Change the provider to App Service Build Service.

    ![A screenshot of a computer AI-generated content may be incorrect.](media/select-build-provider.png)

5.  Select your organization
6.  Select your project
7.  Select your repository
8.  Select your branch

Scroll back to the top of the page and click **Save.**

---

Verify that your deployment worked correctly by checking the Logs tab and check if the deployment completed successfully.

![An image of the Deployment Center Logs tab with a successful deployment.](media/deployment-center-logs.png)
