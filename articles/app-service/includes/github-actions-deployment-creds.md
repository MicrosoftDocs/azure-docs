---
title: 'Generate GitHub Actions deployment credentials'
ms.topic: include
ms.date: 04/22/2021
ms.title: include
ROBOTS: NOINDEX,NOFOLLOW
---

## Generate deployment credentials

The recommended way to authenticate with Azure App Services for GitHub Actions is with a publish profile. You can also authenticate with a service principal but the process requires more steps. 

Save your publish profile credential or service principal as a [GitHub secret](https://docs.github.com/en/actions/reference/encrypted-secrets) to authenticate with Azure. You'll access the secret within your workflow. 

# [Publish profile](#tab/publish-profile)

A publish profile is an app-level credential. Set up your publish profile as a GitHub secret. 

1. Go to your app service in the Azure portal. 

1. On the **Overview** page, select **Get Publish profile**.

    > [!NOTE]
    > As of October 2020, Linux web apps will need the app setting `WEBSITE_WEBDEPLOY_USE_SCM` set to `true` **before downloading the file**. This requirement will be removed in the future. See [Configure an App Service app in the Azure portal](./configure-common.md), to learn how to configure common web app settings.  

1. Save the downloaded file. You'll use the contents of the file to create a GitHub secret.

# [Service principal](#tab/service-principal)

You can create a [service principal](../active-directory/develop/app-objects-and-service-principals.md#service-principal-object) with the [az ad sp create-for-rbac](/cli/azure/ad/sp#az_ad_sp_create_for_rbac) command in the [Azure CLI](/cli/azure/). Run this command with [Azure Cloud Shell](https://shell.azure.com/) in the Azure portal or by selecting the **Try it** button.

```azurecli-interactive
az ad sp create-for-rbac --name "myApp" --role contributor \
                            --scopes /subscriptions/<subscription-id>/resourceGroups/<group-name>/providers/Microsoft.Web/sites/<app-name> \
                            --sdk-auth
```

In the example, replace the placeholders with your subscription ID, resource group name, and app name. The output is a JSON object with the role assignment credentials that provide access to your App Service app. Copy this JSON object for later.

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
## Configure the GitHub secret for authentication

# [Publish profile](#tab/publish-profile)

In [GitHub](https://github.com/), browse your repository, select **Settings > Secrets > Add a new secret**.

To use [app-level credentials](#generate-deployment-credentials), paste the contents of the downloaded publish profile file into the secret's value field. Name the secret `AZURE_WEBAPP_PUBLISH_PROFILE`.

When you configure your GitHub workflow, you use the `AZURE_WEBAPP_PUBLISH_PROFILE` in the deploy Azure Web App action. For example:
    
```yaml
- uses: azure/webapps-deploy@v2
  with:
    publish-profile: ${{ secrets.AZURE_WEBAPP_PUBLISH_PROFILE }}
```

# [Service principal](#tab/service-principal)

In [GitHub](https://github.com/), browse your repository, select **Settings > Secrets > Add a new secret**.

To use [user-level credentials](#generate-deployment-credentials), paste the entire JSON output from the Azure CLI command into the secret's value field. Give the secret the name like `AZURE_CREDENTIALS`.

When you configure the workflow file later, you use the secret for the input `creds` of the Azure Login action. For example:

```yaml
- uses: azure/login@v1
  with:
    creds: ${{ secrets.AZURE_CREDENTIALS }}
```

---