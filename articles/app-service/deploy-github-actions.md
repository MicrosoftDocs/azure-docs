---
title: Configure CI/CD with GitHub Actions
description: Learn how to deploy your code to Azure App Service from a CI/CD pipeline with GitHub Actions. Customize the build tasks and execute complex deployments.
ms.topic: article
ms.date: 01/16/2024
ms.reviewer: ushan
ms.custom: github-actions-azure, devx-track-azurecli
author: cephalin
ms.author: cephalin
---

# Deploy to App Service using GitHub Actions

Get started with [GitHub Actions](https://docs.github.com/en/actions/learn-github-actions) to automate your workflow and deploy to [Azure App Service](overview.md) from GitHub. 

## Prerequisites 

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).
- A GitHub account. If you don't have one, sign up for [free](https://github.com/join).

## Set up GitHub Actions deployment when creating the app

GitHub Actions deployment is integrated into the default [app creation wizard](https://portal.azure.com/#create/Microsoft.WebSite). You just need to set **Continuous deployment** to **Enable** in the Deployment tab, and configure the organization, repository, and branch you want.

:::image type="content" source="media/deploy-github-actions/create-wizard-deployment.png" alt-text="A screenshot showing how to enable GitHub Actions deployment in the App Service create wizard.":::

When you enable continuous deployment, the app creation wizard automatically picks the authentication method based on the basic authentication selection and configures your app and your GitHub repository accordingly:

| Basic authentication selection | Authentication method |
|-|-|
|Disable| [User-assigned identity (OpenID Connect)](deploy-continuous-deployment.md#what-does-the-user-assigned-identity-option-do-for-github-actions) (recommended) |
|Enable| [Basic authentication](configure-basic-auth-disable.md) |

> [!NOTE]
> If you receive an error when creating your app saying that your Azure account doesn't have certain permissions, it may not have [the required permissions to create and configure the user-assigned identity](deploy-continuous-deployment.md#why-do-i-see-the-error-you-do-not-have-sufficient-permissions-on-this-app-to-assign-role-based-access-to-a-managed-identity-and-configure-federated-credentials). For an alternative, see [Set up GitHub Actions deployment from the Deployment Center](#set-up-github-actions-deployment-from-the-deployment-center).

## Set up GitHub Actions deployment from the Deployment Center

For an existing app, you can get started quickly with GitHub Actions by using the App Service Deployment Center. This turn-key method automatically generates a GitHub Actions workflow file based on your application stack and commits it to your GitHub repository.

The Deployment Center also lets you easily configure the more secure OpenID Connect authentication with [the **user-assigned identity** option](deploy-continuous-deployment.md#what-does-the-user-assigned-identity-option-do-for-github-actions).

If your Azure account has the [needed permissions](deploy-continuous-deployment.md#why-do-i-see-the-error-you-do-not-have-sufficient-permissions-on-this-app-to-assign-role-based-access-to-a-managed-identity-and-configure-federated-credentials), you can select to create a user-assigned identity. Otherwise, you can select an existing user-assigned managed identity in the **Identity** dropdown. You can work with your Azure administrator to create a user-assigned managed identity with the [Website Contributor role](deploy-continuous-deployment.md#why-do-i-see-the-error-this-identity-does-not-have-write-permissions-on-this-app-please-select-a-different-identity-or-work-with-your-admin-to-grant-the-website-contributor-role-to-your-identity-on-this-app).

For more information, see [Continuous deployment to Azure App Service](deploy-continuous-deployment.md?tabs=github).

## Set up a GitHub Actions workflow manually

You can also deploy a workflow without using the Deployment Center. In that case you need to perform 3 steps:

1. [Generate deployment credentials](#1-generate-deployment-credentials)
1. [Configure the GitHub secret](#2-configure-the-github-secret)
1. [Add the workflow file to your GitHub repository](#3-add-the-workflow-file-to-your-github-repository)

### 1. Generate deployment credentials

The recommended way to authenticate with Azure App Services for GitHub Actions is with OpenID Connect. This is an authentication method that uses short-lived tokens. Setting up [OpenID Connect with GitHub Actions](/azure/developer/github/connect-from-azure) is more complex but offers hardened security.

Alternatively, you can authenticate with a User-assigned Managed Identity, a service principal, or a publish profile. 

# [OpenID Connect](#tab/openid)

The below runs you through the steps for creating an active directory application, service principal, and federated credentials using Azure CLI statements. To learn how to create an active directory application, service principal, and federated credentials in Azure portal, see [Connect GitHub and Azure](/azure/developer/github/connect-from-azure#use-the-azure-login-action-with-openid-connect).

1.  If you don't have an existing application, register a [new Active Directory application and service principal that can access resources](../active-directory/develop/howto-create-service-principal-portal.md). Create the Active Directory application. 

    ```azurecli-interactive
    az ad app create --display-name myApp
    ```

    This command outputs a JSON with an `appId` that is your `client-id`. Save the value to use as the `AZURE_CLIENT_ID` GitHub secret later. 

    You'll use the `objectId` value when creating federated credentials with Graph API and reference it as the `APPLICATION-OBJECT-ID`.

1. Create a service principal. Replace the `$appID` with the appId from your JSON output. 

    This command generates JSON output with a different `objectId` and will be used in the next step. The new  `objectId` is the `assignee-object-id`. 
    
    Copy the `appOwnerTenantId` to use as a GitHub secret for `AZURE_TENANT_ID` later. 

    ```azurecli-interactive
     az ad sp create --id $appId
    ```

1. Create a new role assignment by subscription and object. By default, the role assignment is tied to your default subscription. Replace `$subscriptionId` with your subscription ID, `$resourceGroupName` with your resource group name, `$webappName` with your web app name, and `$assigneeObjectId` with the generated `id`. Learn [how to manage Azure subscriptions with the Azure CLI](/cli/azure/manage-azure-subscriptions-azure-cli). 

    ```azurecli-interactive
    az role assignment create --role contributor --subscription $subscriptionId --assignee-object-id  $assigneeObjectId --scope /subscriptions/$subscriptionId/resourceGroups/$resourceGroupName/providers/Microsoft.Web/sites/$webappName --assignee-principal-type ServicePrincipal
    ```

1. Run the following command to [create a new federated identity credential](/graph/api/application-post-federatedidentitycredentials?view=graph-rest-beta&preserve-view=true) for your active directory application.

    * Replace `APPLICATION-OBJECT-ID` with the **appId (generated while creating app)** for your Active Directory application.
    * Set a value for `CREDENTIAL-NAME` to reference later.
    * Set the `subject`. Its value is defined by GitHub depending on your workflow:
      * Jobs in your GitHub Actions environment: `repo:< Organization/Repository >:environment:< Name >`
      * For Jobs not tied to an environment, include the ref path for branch/tag based on the ref path used for triggering the workflow: `repo:< Organization/Repository >:ref:< ref path>`.  For example, `repo:n-username/ node_express:ref:refs/heads/my-branch` or `repo:n-username/ node_express:ref:refs/tags/my-tag`.
      * For workflows triggered by a pull request event: `repo:< Organization/Repository >:pull_request`.
    
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
> Publish profile requires [basic authentication](configure-basic-auth-disable.md) to be enabled.

A publish profile is an app-level credential. Set up your publish profile as a GitHub secret. 

1. Go to your app service in the Azure portal. 

1. On the **Overview** page, select **Get Publish profile**.

1. Save the downloaded file. You'll use the contents of the file to create a GitHub secret.

> [!NOTE]
> As of October 2020, Linux web apps needs the app setting `WEBSITE_WEBDEPLOY_USE_SCM` set to `true` **before downloading the publish profile**. This requirement will be removed in the future.

# [Service principal](#tab/userlevel)

You can create a [service principal](../active-directory/develop/app-objects-and-service-principals.md#service-principal-object) with the [az ad sp create-for-rbac](/cli/azure/ad/sp#az-ad-sp-create-for-rbac) command in the [Azure CLI](/cli/azure/). Run this command with [Azure Cloud Shell](https://shell.azure.com/) in the Azure portal or by selecting the **Try it** button.

```azurecli-interactive
az ad sp create-for-rbac --name "myApp" --role contributor \
                            --scopes /subscriptions/<subscription-id>/resourceGroups/<group-name>/providers/Microsoft.Web/sites/<app-name> \
                            --json-auth
```

In the previous example, replace the placeholders with your subscription ID, resource group name, and app name. The output is a JSON object with the role assignment credentials that provide access to your App Service app similar to the following JSON snippet. Copy this JSON object for later.

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
> It is always a good practice to grant minimum access. The scope in the previous example is limited to the specific App Service app and not the entire resource group.

---

### 2. Configure the GitHub secret


# [OpenID Connect](#tab/openid)

You need to provide your application's **Client ID**, **Tenant ID** and **Subscription ID** to the [Azure/login](https://github.com/marketplace/actions/azure-login) action. These values can either be provided directly in the workflow or can be stored in GitHub secrets and referenced in your workflow. Saving the values as GitHub secrets is the more secure option.

1. Open your GitHub repository and go to **Settings > Security > Secrets and variables > Actions > New repository secret**.

1. Create secrets for `AZURE_CLIENT_ID`, `AZURE_TENANT_ID`, and `AZURE_SUBSCRIPTION_ID`. Use these values from your Active Directory application for your GitHub secrets:

    |GitHub Secret  | Active Directory Application  |
    |---------|---------|
    |AZURE_CLIENT_ID     |      Application (client) ID   |
    |AZURE_TENANT_ID     |     Directory (tenant) ID    |
    |AZURE_SUBSCRIPTION_ID     |     Subscription ID    |

1. Save each secret by selecting **Add secret**.

# [Publish profile](#tab/applevel)

In [GitHub](https://github.com/), browse your repository. Select **Settings > Security > Secrets and variables > Actions > New repository secret**.

To use [app-level credentials](#1-generate-deployment-credentials), paste the contents of the downloaded publish profile file into the secret's value field. Name the secret `AZURE_WEBAPP_PUBLISH_PROFILE`.

When you configure the GitHub workflow file later, you use the `AZURE_WEBAPP_PUBLISH_PROFILE` in the deploy Azure Web App action. For example:
    
```yaml
- uses: azure/webapps-deploy@v2
  with:
    publish-profile: ${{ secrets.AZURE_WEBAPP_PUBLISH_PROFILE }}
```

# [Service principal](#tab/userlevel)

In [GitHub](https://github.com/), browse your repository. Select **Settings > Security > Secrets and variables > Actions > New repository secret**.

To use [user-level credentials](#1-generate-deployment-credentials), paste the entire JSON output from the Azure CLI command into the secret's value field. Name the secret `AZURE_CREDENTIALS`.

When you configure the GitHub workflow file later, you use the secret for the input `creds` of the [Azure/login](https://github.com/marketplace/actions/azure-login). For example:

```yaml
- uses: azure/login@v1
  with:
    creds: ${{ secrets.AZURE_CREDENTIALS }}
```

---

### 3. Add the workflow file to your GitHub repository

A workflow is defined by a YAML (.yml) file in the `/.github/workflows/` path in your GitHub repository. This definition contains the various steps and parameters that make up the workflow.

At a minimum, the workflow file would have the following distinct steps:

1. Authenticate with App Service using the GitHub secret you created.
1. Build the web app.
1. Deploy the web app.

To deploy your code to an App Service app, you use the [azure/webapps-deploy@v3](https://github.com/Azure/webapps-deploy/tree/releases/v3) action. The action requires the name of your web app in `app-name` and, depending on your language stack, the path of a *.zip, *.war, *.jar, or folder to deploy in `package`. For a complete list of possible inputs for the `azure/webapps-deploy@v3` action, see the [action.yml](https://github.com/Azure/webapps-deploy/blob/releases/v3/action.yml) definition.

The following examples show the part of the workflow that builds the web app, in different supported languages.

# [OpenID Connect](#tab/openid)

[!INCLUDE [deploy-github-actions-openid-connect](includes/deploy-github-actions/deploy-github-actions-openid-connect.md)]

# [Publish profile](#tab/applevel)

[!INCLUDE [deploy-github-actions-publish-profile](includes/deploy-github-actions/deploy-github-actions-publish-profile.md)]

# [Service principal](#tab/userlevel)

[!INCLUDE [deploy-github-actions-service-principal](includes/deploy-github-actions/deploy-github-actions-service-principal.md)]

-----


## Frequently Asked Questions

- [How do I deploy a WAR file through Maven plugin and OpenID Connect](#how-do-i-deploy-a-war-file-through-maven-plugin-and-openid-connect)
- [How do I deploy a WAR file through Az CLI and OpenID Connect](#how-do-i-deploy-a-war-file-through-az-cli-and-openid-connect)
- [How do I deploy to a Container](#how-do-i-deploy-to-a-container)
- [How do I update the Tomcat configuration after deployment](#how-do-i-update-the-tomcat-configuration-after-deployment)

### How do I deploy a WAR file through Maven plugin and OpenID Connect 

In case you configured your Java Tomcat project with the [Maven plugin](https://github.com/microsoft/azure-maven-plugins), you can also deploy to Azure App Service through this plugin. If you use the [Azure CLI GitHub action](https://github.com/Azure/cli) it will make use of your Azure login credentials.

```yaml
    - name: Azure CLI script file
      uses: azure/cli@v2
      with:
        inlineScript: |
          mvn package azure-webapp:deploy
```

More information on the Maven plugin and how to use and configure it can be found in the [Maven plugin wiki for Azure App Service](https://github.com/microsoft/azure-maven-plugins/wiki/Azure-Web-App).


### How do I deploy a WAR file through Az CLI and OpenID Connect 

If you use prefer the Azure CLI to deploy to App Service, you can use the GitHub Action for CLI.

```yaml
    - name: Azure CLI script
      uses: azure/cli@v2
      with:
        inlineScript: |
          az webapp deploy --src-path '${{ github.workspace }}/target/yourpackage.war' --name ${{ env.AZURE_WEBAPP_NAME }} --resource-group ${{ env.RESOURCE_GROUP }}  --async true --type war
```

More information on the GitHub Action for CLI and how to use and configure it can be found in the [Azure CLI GitHub action](https://github.com/Azure/cli). 
More information on the az webapp deploy command, how to use and the parameter details can be found in the [az webapp deploy documentation](/cli/azure/webapp?view=azure-cli-latest#az-webapp-deploy).

### How do I deploy to a Container

With the Azure Web Deploy action, you can automate your workflow to deploy custom containers to App Service using GitHub Actions. Detailed information on the steps to deploy using GitHub Actions, can be found in the [Deploy to a Container](/azure/app-service/deploy-container-github-action).

### How do I update the Tomcat configuration after deployment

In case you would like to update any of your web apps settings after deployment, you can use the [App Service Settings](https://github.com/Azure/appservice-settings) action. 

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

More information on this action and how to use and configure it can be found in the [App Service Settings](https://github.com/Azure/appservice-settings) repository.


## Next steps

Check out references on Azure GitHub Actions and workflows:

- [Azure/login action](https://github.com/Azure/login)
- [Azure/webapps-deploy action](https://github.com/Azure/webapps-deploy)
- [Docker/login action](https://github.com/Azure/docker-login)
- [Azure/k8s-deploy action](https://github.com/Azure/k8s-deploy)
- [Actions workflows to deploy to Azure](https://github.com/Azure/actions-workflow-samples)
- [Starter Workflows](https://github.com/actions/starter-workflows)
- [Events that trigger workflows](https://docs.github.com/en/actions/reference/events-that-trigger-workflows)