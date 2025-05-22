---
title: Deploy by Using GitHub Actions
description: Learn how to deploy your code to Azure App Service from a CI/CD pipeline by using GitHub Actions. Customize the build tasks and run complex deployments.
author: cephalin
ms.author: cephalin
ms.reviewer: ushan
ms.topic: how-to
ms.date: 01/16/2025
ms.custom: github-actions-azure, devx-track-azurecli

#customer intent: As a build developer, I want to learn how to automate my deployment of web apps by using Azure App Service and GitHub.

---

# Deploy to Azure App Service by using GitHub Actions

Use [GitHub Actions](https://docs.github.com/en/actions/learn-github-actions) to automate your workflow and deploy to [Azure App Service](overview.md) from GitHub.

## Prerequisites

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).
- A GitHub account. If you don't have one, sign up for [free](https://github.com/join).

## Set up GitHub Actions deployment when creating an app

GitHub Actions deployment is integrated into the default [Create Web App process](https://portal.azure.com/#create/Microsoft.WebSite). Set **Continuous deployment** to **Enable** in the **Deployment** tab, and configure your chosen organization, repository, and branch.

:::image type="content" source="media/deploy-github-actions/create-wizard-deployment.png" alt-text="Screenshot that shows how to enable GitHub Actions deployment in the App Service Deployment tab.":::

When you enable continuous deployment, the **Create Web App** process automatically picks the authentication method based on the basic authentication selection and configures your app and your GitHub repository accordingly:

| Basic authentication selection | Authentication method |
|-|-|
|Disable| [User-assigned identity (OpenID Connect)](deploy-continuous-deployment.md#what-does-the-user-assigned-identity-option-do-for-github-actions) (recommended) |
|Enable| [Basic authentication](configure-basic-auth-disable.md) |

> [!NOTE]
> When you create an app, you might receive an error that states that your Azure account doesn't have certain permissions. Your account might need [the required permissions to create and configure the user-assigned identity](deploy-continuous-deployment.md#why-do-i-see-the-error-you-do-not-have-sufficient-permissions-on-this-app-to-assign-role-based-access-to-a-managed-identity-and-configure-federated-credentials). For an alternative, see the following section.

## <a name = "set-up-github-actions-deployment-from-the-deployment-center"></a> Set up GitHub Actions deployment from Deployment Center

For an existing app, you can quickly get started with GitHub Actions by using **Deployment Center** in App Service. This turnkey method generates a GitHub Actions workflow file based on your application stack and commits it to your GitHub repository.

By using **Deployment Center**, you can also easily configure the more secure OpenID Connect authentication with a *user-assigned identity*. For more information, see [the user-assigned identity option](deploy-continuous-deployment.md#what-does-the-user-assigned-identity-option-do-for-github-actions).

If your Azure account has the [needed permissions](deploy-continuous-deployment.md#why-do-i-see-the-error-you-do-not-have-sufficient-permissions-on-this-app-to-assign-role-based-access-to-a-managed-identity-and-configure-federated-credentials), you can create a user-assigned identity. Otherwise, you can select an existing user-assigned managed identity in the **Identity** dropdown menu. You can work with your Azure administrator to create a user-assigned managed identity with the [Website Contributor role](deploy-continuous-deployment.md#why-do-i-see-the-error-this-identity-does-not-have-write-permissions-on-this-app-please-select-a-different-identity-or-work-with-your-admin-to-grant-the-website-contributor-role-to-your-identity-on-this-app).

For more information, see [Continuous deployment to Azure App Service](deploy-continuous-deployment.md?tabs=github).

## Manually set up a GitHub Actions workflow

You can deploy a workflow without using **Deployment Center**. Perform these three steps:

1. [Generate deployment credentials](#generate-deployment-credentials).
1. [Configure the GitHub secret](#configure-the-github-secret).
1. [Add the workflow file to your GitHub repository](#add-the-workflow-file-to-your-github-repository).

### Generate deployment credentials

We recommend that you use OpenID Connect to authenticate with Azure App Service for GitHub Actions. This authentication method uses short-lived tokens. Setting up [OpenID Connect with GitHub Actions](/azure/developer/github/connect-from-azure) is more complex but offers hardened security.

You can also authenticate with a user-assigned managed identity, a service principal, or a publish profile.

# [OpenID Connect](#tab/openid)

The following procedure describes the steps for creating a Microsoft Entra application, service principal, and federated credentials using Azure CLI statements. To learn how to create a Microsoft Entra application, service principal, and federated credentials in the Azure portal, see [Connect GitHub and Azure](/azure/developer/github/connect-from-azure#use-the-azure-login-action-with-openid-connect).

1. If you don't have an existing application, register a [new Microsoft Entra application and service principal that can access resources](../active-directory/develop/howto-create-service-principal-portal.md). Create the Microsoft Entra application.

   ```azurecli-interactive
   az ad app create --display-name myApp
   ```

   This command returns a JSON output with an `appId` that is your `client-id`. Save the value to use as the `AZURE_CLIENT_ID` GitHub secret later.

   You use the `objectId` value when you create federated credentials with Graph API and reference it as the `APPLICATION-OBJECT-ID`.

1. Create a service principal. Replace the `$appID` with the `appId` from your JSON output.

   This command generates a JSON output with a different `objectId` to use in the next step. The new  `objectId` is the `assignee-object-id`.

   Copy the `appOwnerTenantId` to later use as a GitHub secret for `AZURE_TENANT_ID`.

   ```azurecli-interactive
   az ad sp create --id $appId
   ```

1. Create a new role assignment by subscription and object. By default, the role assignment is tied to your default subscription. Replace `$subscriptionId` with your subscription ID, `$resourceGroupName` with your resource group name, `$webappName` with your web app name, and `$assigneeObjectId` with the generated `id`. Learn [how to manage Azure subscriptions with the Azure CLI](/cli/azure/manage-azure-subscriptions-azure-cli).

    ```azurecli-interactive
    az role assignment create --role contributor --subscription $subscriptionId --assignee-object-id  $assigneeObjectId --scope /subscriptions/$subscriptionId/resourceGroups/$resourceGroupName/providers/Microsoft.Web/sites/$webappName --assignee-principal-type ServicePrincipal
    ```

1. Run the following command to [create a new federated identity credential](/graph/api/application-post-federatedidentitycredentials?view=graph-rest-beta&preserve-view=true) for your Microsoft Entra app.

    - Replace `APPLICATION-OBJECT-ID` with the `appId` that you generated during app creation for your Active Directory application.
    - Set a value for `CREDENTIAL-NAME` to reference later.
    - Set the `subject`. GitHub defines its value depending on your workflow:

      - For jobs in your GitHub Actions environment, use: `repo:< Organization/Repository >:environment:< Name >`
      - For jobs not tied to an environment, include the ref path for branch/tag based on the ref path used for triggering the workflow: `repo:< Organization/Repository >:ref:< ref path>`. For example, `repo:n-username/ node_express:ref:refs/heads/my-branch` or `repo:n-username/ node_express:ref:refs/tags/my-tag`.
      - For workflows triggered by a pull request event, use: `repo:< Organization/Repository >:pull_request`.

    ```azurecli
    az ad app federated-credential create --id <APPLICATION-OBJECT-ID> --parameters credential.json
    ("credential.json" contains the following content)
    {
        "name": "<CREDENTIAL-NAME>",
        "issuer": "https://token.actions.githubusercontent.com",
        "subject": "repo:organization/repository:ref:refs/heads/main",
        "description": "Testing",
        "audiences": [
            "api://AzureADTokenExchange"
        ]
    }     
    ```

# [Publish profile](#tab/applevel)

> [!NOTE]
> To use publish profile, you must enable [basic authentication](configure-basic-auth-disable.md).

A publish profile is an app-level credential. Set up your publish profile as a GitHub secret.

1. Go to App Service in the Azure portal.

1. On the **Overview** page, select **Download publish profile**.

1. Save the downloaded file. Use the contents of the file to create a GitHub secret.

> [!NOTE]
> As of October 2020, Linux web apps need the app setting `WEBSITE_WEBDEPLOY_USE_SCM` set to `true` *before downloading the publish profile*.

# [Service principal](#tab/userlevel)

You can create a [service principal](../active-directory/develop/app-objects-and-service-principals.md#service-principal-object) with the [`az ad sp create-for-rbac`](/cli/azure/ad/sp#az-ad-sp-create-for-rbac) command in the [Azure CLI](/cli/azure/). Run this command by using [Azure Cloud Shell](https://shell.azure.com/) in the Azure portal or by selecting **Open Cloud Shell**.

```azurecli-interactive
az ad sp create-for-rbac --name "myApp" --role contributor \
                            --scopes /subscriptions/<subscription-id>/resourceGroups/<group-name>/providers/Microsoft.Web/sites/<app-name> \
                            --json-auth
```

In the previous example, replace the placeholders with your subscription ID, resource group name, and app name. The output is a JSON object with the role assignment credentials that provide access to your App Service app. The output should look similar to the following JSON snippet. Copy this JSON object for later.

```output
  {
    "clientId": "<GUID>",
    "clientSecret": "<GUID>",
    "subscriptionId": "<GUID>",
    "tenantId": "<GUID>",
    (...)
  }
```

> [!IMPORTANT]
> We recommend that you grant minimum access. The scope in the previous example is limited to the specific App Service app and not the entire resource group.

---

### Configure the GitHub secret

# [OpenID Connect](#tab/openid)

You need to provide your application's **Client ID**, **Tenant ID**, and **Subscription ID** to the [`Azure/login`](https://github.com/marketplace/actions/azure-login) action. These values can either be provided directly in the workflow or can be stored in GitHub secrets and referenced in your workflow. Saving the values as GitHub secrets is the more secure option.

1. Open your GitHub repository and go to **Settings** > **Security** > **Secrets and variables** > **Actions** > **New repository secret**.

1. Create secrets for `AZURE_CLIENT_ID`, `AZURE_TENANT_ID`, and `AZURE_SUBSCRIPTION_ID`. Use these values from your Active Directory application for your GitHub secrets:

   | GitHub secret | Active Directory application |
   |:--------------|:---------|
   | `AZURE_CLIENT_ID`       | Application (client) ID |
   | `AZURE_TENANT_ID`       | Directory (tenant) ID   |
   | `AZURE_SUBSCRIPTION_ID` | Subscription ID         |

1. Select **Add secret** to save each secret.

# [Publish profile](#tab/applevel)

In [GitHub](https://github.com/), browse to your repository. Select **Settings** > **Security** > **Secrets and variables** > **Actions** > **New repository secret**.

To use the app-level credentials that you created in the previous section, paste the contents of the downloaded publish profile file into the secret's value field. Name the secret `AZURE_WEBAPP_PUBLISH_PROFILE`.

When you configure the GitHub workflow file later, use the `AZURE_WEBAPP_PUBLISH_PROFILE` in the **Deploy Azure Web App** action. For example:

```yaml
- uses: azure/webapps-deploy@v2
  with:
    publish-profile: ${{ secrets.AZURE_WEBAPP_PUBLISH_PROFILE }}
```

# [Service principal](#tab/userlevel)

In [GitHub](https://github.com/), browse to your repository. Select **Settings** > **Security** > **Secrets and variables** > **Actions** > **New repository secret**.

To use the user-level credentials that you created in the previous section, paste the entire JSON output from the Azure CLI command into the secret's value field. Name the secret `AZURE_CREDENTIALS`.

When you configure the GitHub workflow file later, use the secret for the input `creds` of [`Azure/login`](https://github.com/marketplace/actions/azure-login). For example:

```yaml
- uses: azure/login@v2
  with:
    creds: ${{ secrets.AZURE_CREDENTIALS }}
```

---

### Add the workflow file to your GitHub repository

A YAML (.yml) file in the `/.github/workflows/` path in your GitHub repository defines a workflow. This definition contains the various steps and parameters that make up the workflow.

At a minimum, the workflow file has the following distinct steps:

1. Authenticate with App Service by using the GitHub secret you created.
1. Build the web app.
1. Deploy the web app.

To deploy your code to an App Service app, use the [`azure/webapps-deploy@v3`](https://github.com/Azure/webapps-deploy/tree/releases/v3) action. The action requires the name of your web app in `app-name` and, depending on your language stack, the path of a `*.zip`, `*.war`, `*.jar`, or folder to deploy in `package`. For a complete list of possible inputs for the `azure/webapps-deploy@v3` action, see [action.yml](https://github.com/Azure/webapps-deploy/blob/releases/v3/action.yml).

The following examples show the part of the workflow that builds the web app, in different supported languages.

# [OpenID Connect](#tab/openid)

[!INCLUDE [deploy-github-actions-openid-connect](includes/deploy-github-actions/deploy-github-actions-openid-connect.md)]

# [Publish profile](#tab/applevel)

[!INCLUDE [deploy-github-actions-publish-profile](includes/deploy-github-actions/deploy-github-actions-publish-profile.md)]

# [Service principal](#tab/userlevel)

[!INCLUDE [deploy-github-actions-service-principal](includes/deploy-github-actions/deploy-github-actions-service-principal.md)]

-----

## Frequently asked questions

- [How do I deploy a WAR file through the Maven plugin?](#how-do-i-deploy-a-war-file-through-the-maven-plugin)
- [How do I deploy a WAR file through the Azure CLI?](#how-do-i-deploy-a-war-file-through-the-azure-cli)
- [How do I deploy a startup file?](#how-do-i-deploy-a-startup-file)
- [How do I deploy to a container?](#how-do-i-deploy-to-a-container)
- [How do I update the Tomcat configuration after deployment?](#how-do-i-update-the-tomcat-configuration-after-deployment)

### How do I deploy a WAR file through the Maven plugin?

If you configured your Java Tomcat project with the [Maven plugin](https://github.com/microsoft/azure-maven-plugins), you can also deploy to Azure App Service through this plugin. If you use the [Azure CLI GitHub action](https://github.com/Azure/cli), it makes use of your Azure credentials.

```yaml
    - name: Azure CLI script file
      uses: azure/cli@v2
      with:
        inlineScript: |
          mvn package azure-webapp:deploy
```

For more information on how to use and configure the Maven plugin, see [Maven plugin wiki for Azure App Service](https://github.com/microsoft/azure-maven-plugins/wiki/Azure-Web-App).

### How do I deploy a WAR file through the Azure CLI?

If you prefer to use the Azure CLI to deploy to App Service, you can use the GitHub Action for the Azure CLI.

```yaml
- name: Azure CLI script
  uses: azure/cli@v2
  with:
    inlineScript: |
      az webapp deploy --src-path '${{ github.workspace }}/target/yourpackage.war' --name ${{ env.AZURE_WEBAPP_NAME }} --resource-group ${{ env.RESOURCE_GROUP }}  --async true --type war
```

For more information on how to use and configure the GitHub action for the Azure CLI, see [the Azure CLI GitHub action](https://github.com/Azure/cli).

For more information on the `az webapp deploy` command, including how to use it and the parameter details, see [`az webapp deploy` documentation](/cli/azure/webapp#az-webapp-deploy).

### How do I deploy a startup file?

Use the GitHub Action for the Azure CLI. For example:

```yaml
- name: Deploy startup script
  uses: azure/cli@v2
  with:
    inlineScript: |
      az webapp deploy --src-path ${{ github.workspace }}/src/main/azure/createPasswordlessDataSource.sh --name ${{ env.AZURE_WEBAPP_NAME }} --resource-group ${{ env.RESOURCE_GROUP }} --type startup --track-status false
```

### How do I deploy to a container?

With the **Azure Web Deploy** action, you can automate your workflow to deploy custom containers to App Service by using GitHub Actions. For more information, see [Deploy to a container](/azure/app-service/deploy-container-github-action).

### How do I update the Tomcat configuration after deployment?

If you want to update any of your web apps settings after deployment, you can use the [App Service settings](https://github.com/Azure/appservice-settings) action.

```yaml
    - uses: azure/appservice-settings@v1
      with:
        app-name: 'my-app'
        slot-name: 'staging'  # Optional and needed only if the settings have to be configured on the specific deployment slot
        app-settings-json: '[{ "name": "CATALINA_OPTS", "value": "-Dfoo=bar" }]' 
        connection-strings-json: '${{ secrets.CONNECTION_STRINGS }}'
        general-settings-json: '{"alwaysOn": "false", "webSocketsEnabled": "true"}' #'General configuration settings as Key Value pairs'
      id: settings
```

For more information on how to use and configure this action, see the [App Service settings](https://github.com/Azure/appservice-settings) repository.

## Related content

Check out the following references on Azure GitHub Actions and workflows:

- [`Azure/login` action](https://github.com/Azure/login)
- [`Azure/webapps-deploy` action](https://github.com/Azure/webapps-deploy)
- [`Docker/login` action](https://github.com/Azure/docker-login)
- [`Azure/k8s-deploy` action](https://github.com/Azure/k8s-deploy)
- [Actions workflows to deploy to Azure](https://github.com/Azure/actions-workflow-samples)
- [Starter workflows](https://github.com/actions/starter-workflows)
- [Events that trigger workflows](https://docs.github.com/en/actions/reference/events-that-trigger-workflows)
