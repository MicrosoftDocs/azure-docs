---
title: Configure Continuous Deployment
description: Learn how to configure CI/CD to Azure App Service from GitHub, Bitbucket, Azure Repos, or other repos. Select the build pipeline that fits your needs.
author: cephalin
ms.author: cephalin
ms.topic: how-to
ms.date: 02/29/2024
ms.assetid: 6adb5c84-6cf3-424e-a336-c554f23b4000

---

# Configure continuous deployment to Azure App Service

You can configure continuous deployment from [GitHub](https://help.github.com/articles/create-a-repo), [Bitbucket](https://confluence.atlassian.com/get-started-with-bitbucket/create-a-repository-861178559.html), and [Azure](/azure/devops/repos/git/creatingrepo) repositories by using [Azure App Service](overview.md), which pulls in the latest updates. This guide provides you with everything you need to get started.

[!INCLUDE [Prepare repository](../../includes/app-service-deploy-prepare-repo.md)]

## Configure the deployment source

1. In the [Azure portal](https://portal.azure.com), go to the management pane for your App Service app.

1. On the left menu, select **Deployment Center**. Then select **Settings**.

1. In the **Source** box, select one of the **Continuous Deployment (CI/CD)** options:

    ![Screenshot that shows how to choose the deployment source.](media/app-service-continuous-deployment/choose-source.png)

To continue, select the tab that corresponds to your build provider.

# [GitHub](#tab/github)

1. [GitHub Actions](?tabs=githubactions#what-are-the-build-providers) is the default build provider. To change the provider, select **Change provider** > **App Service Build Service** > **OK**.

1. If you're deploying from GitHub for the first time, select **Authorize** and follow the authorization prompts. To deploy from another user's repository, select **Change Account**.

1. After you authorize your Azure account with GitHub, select the appropriate **Organization**, **Repository**, and **Branch**.

    If you can't find an organization or repository, you might need to enable more permissions on GitHub. For more information, see [Managing access to your organization's repositories](https://docs.github.com/organizations/managing-access-to-your-organizations-repositories).

1. Under **Authentication type**, select **User-assigned identity** for better security. For more information, see [Frequently asked questions](#frequently-asked-questions).

    > [!NOTE]
    > If your Azure account has the [required permissions](#why-do-i-see-the-error-you-do-not-have-sufficient-permissions-on-this-app-to-assign-role-based-access-to-a-managed-identity-and-configure-federated-credentials) for the **User-assigned identity** option, Azure creates a [user-assigned managed identity](#what-does-the-user-assigned-identity-option-do-for-github-actions) for you. If you don't have the required permissions, work with your Azure administrator to create an [identity with the required role on your app](#why-do-i-see-the-error-this-identity-does-not-have-write-permissions-on-this-app-please-select-a-different-identity-or-work-with-your-admin-to-grant-the-website-contributor-role-to-your-identity-on-this-app), and then select it in the dropdown.

1. (Optional) To see the file before saving your changes, select **Preview file**. App Service selects a workflow template based on your app's [language stack setting](configure-common.md#configure-language-stack-settings) and commits it into your selected GitHub repository.

1. Select **Save**.

    New commits in the selected repository and branch now deploy continuously into your App Service app. You can track the commits and deployments on the **Logs** tab.

# [Bitbucket](#tab/bitbucket)

The Bitbucket integration uses the App Service build service for build automation.

1. If you're deploying from Bitbucket for the first time, select **Authorize** and follow the authorization prompts. If you want to deploy from another user's repository, select **Change Account**.

1. Select the Bitbucket **Team**, **Repository**, and **Branch** that you want to deploy continuously.

1. Select **Save**.

    New commits in the selected repository and branch now deploy continuously into your App Service app. You can track the commits and deployments on the **Logs** tab.

# [Local Git](#tab/local)

See [Local Git deployment to Azure App Service](deploy-local-git.md).

# [Azure Repos](#tab/repos)

1. The build service in App Service is the default build provider.

    > [!NOTE]
    > To use Azure Pipelines as the build provider for your App Service app, configure it directly from Azure Pipelines. Don't configure it in App Service. The **Azure Pipelines** option just points you in the right direction.

1. Select the **Azure DevOps Organization**, **Project**, **Repository**, and **Branch** you want to deploy continuously.

    If your DevOps organization isn't listed, it's not linked to your Azure subscription. For more information, see [Create an Azure service connection](/azure/devops/pipelines/library/connect-to-azure).

# [Other repositories](#tab/others)

For Windows apps, you can manually configure continuous deployment from a cloud Git or Mercurial repository that the portal doesn't directly support, like [GitLab](https://gitlab.com/). You do that by selecting **External Git** in the **Source** dropdown list. For more information, see [Set up continuous deployment using manual steps](https://github.com/projectkudu/kudu/wiki/Continuous-deployment#setting-up-continuous-deployment-using-manual-steps).

-----

## Disable continuous deployment

1. In the [Azure portal](https://portal.azure.com), go to the management page for your App Service app.

1. On the left menu, select **Deployment Center**. Then select **Settings** > **Disconnect**.

    ![Screenshot that shows you how to disconnect your cloud folder sync with your App Service app in the Azure portal.](media/app-service-continuous-deployment/disable.png)

1. The GitHub Actions workflow file is preserved in your repository by default, but it continues to trigger deployment to your app. To delete the file from your repository, select **Delete workflow file**.

1. Select **OK**.

## What are the build providers?

Depending on your deployment source in **Deployment Center**, you might see a few build provider options. Build providers help you build a continuous integration and continuous delivery (CI/CD) solution with Azure App Service by automating build, test, and deployment.

You're not limited to the build provider options found in **Deployment Center**, but by using App Service, you can set them up quickly and get some integrated deployment logging experience.

# [GitHub Actions](#tab/githubactions)

The GitHub Actions build provider is available only for [GitHub deployment](?tabs=github#configure-the-deployment-source). When configured from the app's deployment center, the build provider sets up CI/CD by depositing a GitHub Actions workflow file into your GitHub repository that handles build and deploy tasks to App Service.

For basic authentication, it adds the publish profile for your app as a GitHub secret. The workflow file uses this secret to authenticate with App Service. For user-assigned identity, see [What does the user-assigned identity option do for GitHub Actions?](#what-does-the-user-assigned-identity-option-do-for-github-actions)

It captures information from the [workflow run logs](https://docs.github.com/actions/managing-workflow-runs/using-workflow-run-logs) and displays it on the **Logs** tab in **Deployment Center**.

You can customize the GitHub Actions build provider in the following ways:

* You can customize the workflow file after it generates in your GitHub repository. For more information, see [Workflow syntax for GitHub Actions](https://docs.github.com/actions/reference/workflow-syntax-for-github-actions). Just make sure that the workflow deploys to App Service with the [`azure/webapps-deploy`](https://github.com/Azure/webapps-deploy) action.
* If the selected branch is protected, you can still preview the workflow file without saving the configuration, and then manually add it to your repository. This method doesn't give you log integration with the Azure portal.
* Instead of using basic authentication or a user-assigned identity, you can also deploy by using a [service principal](deploy-github-actions.md?tabs=userlevel) in Microsoft Entra ID. This method can't be configured in the portal.

# [App Service build service](#tab/appservice)

> [!NOTE]
> The App Service build service requires [SCM basic authentication to be enabled](configure-basic-auth-disable.md) for the webhook to work. For more information, see [Deploy without basic authentication](../app-service/configure-basic-auth-disable.md#deploy-without-basic-authentication).

The App Service build service is the deployment and build engine native to App Service. When this option is selected, App Service adds a webhook into the repository you authorized. Any code push to the repository triggers the webhook, and App Service pulls the changes into its repository and performs any deployment tasks. For more information, see [Deploying from GitHub (Kudu)](https://github.com/projectkudu/kudu/wiki/Deploying-from-GitHub).

Resources:

* [Investigate common problems with continuous deployment](https://github.com/projectkudu/kudu/wiki/Investigating-continuous-deployment)
* [Project Kudu](https://github.com/projectkudu/kudu/wiki)

# [Azure Pipelines](#tab/pipelines)

Azure Pipelines is part of Azure DevOps. You can configure a pipeline to build, test, and deploy your app to App Service from [any supported source repository](/azure/devops/pipelines/repos).

To use Azure Pipelines as the build provider, don't configure it in App Service. Go to [Azure DevOps directly](https://go.microsoft.com/fwlink/?linkid=2245703). In **Deployment Center**, the **Azure Pipelines** option just points you in the right direction.

For more information, see [Deploy to App Service using Azure Pipelines](deploy-azure-pipelines.md).

-----

[!INCLUDE [What happens to my app during deployment?](../../includes/app-service-deploy-atomicity.md)]

## Frequently asked questions

* [Does the GitHub Actions build provider work with basic authentication if basic authentication is disabled?](#does-the-github-actions-build-provider-work-with-basic-authentication-if-basic-authentication-is-disabled)
* [What does the user-assigned identity option do for GitHub Actions?](#what-does-the-user-assigned-identity-option-do-for-github-actions)
* [Why do I see the error "This identity does not have write permissions on this app. Please select a different identity, or work with your admin to grant the Website Contributor role to your identity on this app"?](#why-do-i-see-the-error-this-identity-does-not-have-write-permissions-on-this-app-please-select-a-different-identity-or-work-with-your-admin-to-grant-the-website-contributor-role-to-your-identity-on-this-app)
* [Why do I see the error "This identity does not have write permissions on this app. Please select a different identity, or work with your admin to grant the Website Contributor role to your identity on this app"?](#why-do-i-see-the-error-this-identity-does-not-have-write-permissions-on-this-app-please-select-a-different-identity-or-work-with-your-admin-to-grant-the-website-contributor-role-to-your-identity-on-this-app)

### Does the GitHub Actions build provider work with basic authentication if basic authentication is disabled?

No. Try using GitHub Actions with the **user-assigned identity** option.

For more information, see [Deploy without basic authentication](../app-service/configure-basic-auth-disable.md#deploy-without-basic-authentication).

### What does the user-assigned identity option do for GitHub Actions?

When you select **user-assigned identity** under the **GitHub Actions** source, App Service configures all the necessary resources in Azure and GitHub. App Service enables the recommended Microsoft OpenID Connect authentication with GitHub Actions.

Specifically, App Service does the following operations:

* [Creates a federated credential](/entra/workload-id/workload-identity-federation-create-trust-user-assigned-managed-identity?pivots=identity-wif-mi-methods-azp) between a user-assigned managed identity in Azure and your selected repository and branch in GitHub.
* Creates the secrets `AZURE_CLIENT_ID`, `AZURE_TENANT_ID`, and `AZURE_SUBSCRIPTION_ID` from the federated credential in your selected GitHub repository.
* Assigns the identity to your app.

In a GitHub Actions workflow in your GitHub repository, you can then use the [`Azure/login`](https://github.com/Azure/login) action to authenticate with your app by using OpenID Connect. For examples, see [Add the workflow file to your GitHub repository](deploy-github-actions.md#add-the-workflow-file-to-your-github-repository).

If your Azure account has the [required permissions](#why-do-i-see-the-error-you-do-not-have-sufficient-permissions-on-this-app-to-assign-role-based-access-to-a-managed-identity-and-configure-federated-credentials), App Service creates a user-assigned managed identity and configures it for you. This identity isn't shown in the **Identities** page of your app. If your Azure account doesn't have the required permissions, you must select an [existing identity with the required role](#why-do-i-see-the-error-this-identity-does-not-have-write-permissions-on-this-app-please-select-a-different-identity-or-work-with-your-admin-to-grant-the-website-contributor-role-to-your-identity-on-this-app).

### Why do I see the error "You do not have sufficient permissions on this app to assign role-based access to a managed identity and configure federated credentials"?

The message indicates that your Azure account doesn't have the required permissions to create a user-assigned managed identity for GitHub Actions. The required permissions (scoped to your app) are:

* `Microsoft.Authorization/roleAssignments/write`
* `Microsoft.ManagedIdentity/userAssignedIdentities/write`

By default, the **User Access Administrator** and **Owner** roles already have these permissions, but the **Contributor** role doesn't. If you don't have the required permissions, work with your Azure administrator to create a user-assigned managed identity with the [Websites Contributor role](#why-do-i-see-the-error-this-identity-does-not-have-write-permissions-on-this-app-please-select-a-different-identity-or-work-with-your-admin-to-grant-the-website-contributor-role-to-your-identity-on-this-app). In **Deployment Center**, you can then select the identity in the **GitHub** > **Identity** dropdown.

For more information on using alternative steps, see [Deploy to App Service using GitHub Actions](deploy-github-actions.md).

### Why do I see the error "This identity does not have write permissions on this app. Please select a different identity, or work with your admin to grant the Website Contributor role to your identity on this app"?

The message indicates that the selected user-assigned managed identity doesn't have the required role [to enable OpenID Connect](#what-does-the-user-assigned-identity-option-do-for-github-actions) between the GitHub repository and the App Service app. The identity must have one of the following roles on the app: **Owner**, **Contributor**, or **Websites Contributor**. The least privileged role that the identity needs is **Websites Contributor**.

## Related content

* [Use Azure PowerShell](/powershell/azure/)
