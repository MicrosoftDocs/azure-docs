---
title: Tutorial - Deploy a Dapr application with GitHub Actions for Azure Container Apps
description: Learn about multiple revision management by deploying a Dapr application with GitHub Actions and Azure Container Apps. 
author: hhunter-ms
ms.author: hannahhunter
ms.reviewer: keroden
ms.service: container-apps
ms.topic: tutorial 
ms.date: 07/10/2023
ms.custom: template-tutorial, engagement, devx-track-linux
---

# Tutorial: Deploy a Dapr application with GitHub Actions for Azure Container Apps

[GitHub Actions](https://docs.github.com/en/actions) gives you the flexibility to build an automated software development lifecycle workflow. In this tutorial, you'll see how revision-scope changes to a Container App using [Dapr](https://docs.dapr.io) can be deployed using a GitHub Actions workflow. 

Dapr is an open source project that helps developers with the inherent challenges presented by distributed applications, such as state management and service invocation. [Azure Container Apps provides a managed experience of the core Dapr APIs.](./dapr-overview.md)

In this tutorial, you:

> [!div class="checklist"]
> - Configure a GitHub Actions workflow for deploying the end-to-end Dapr solution to Azure Container Apps.
> - Modify the source code with a [revision-scope change](revisions.md#revision-scope-changes) to trigger the Build and Deploy GitHub workflow.
> - Learn how revisions are created for container apps in multi-revision mode.

The [sample solution](https://github.com/Azure-Samples/container-apps-store-api-microservice):
- Consists of three Dapr-enabled microservices
- Uses Dapr APIs for service-to-service communication and state management 

:::image type="content" source="media/dapr-github-actions/arch.png" alt-text="Diagram demonstrating microservices app.":::

> [!NOTE]
> This tutorial focuses on the solution deployment outlined below. If you're interested in building and running the solution on your own, [follow the README instructions within the repo](https://github.com/Azure-Samples/container-apps-store-api-microservice/blob/main/build-and-run.md).

## Prerequisites

- [An Azure account with an active subscription.](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).
- Contributor or Owner permissions on the Azure subscription.
- [A GitHub account](https://github.com/join).
- Install [Git](https://github.com/git-guides/install-git).
- Install the [Azure CLI](/cli/azure/install-azure-cli).

## Set up the environment

In the console, set the following environment variables:

# [Azure CLI](#tab/azure-cli)

Replace \<PLACEHOLDERS\> with your values.

```bash
RESOURCE_GROUP="my-containerapp-store"
LOCATION="canadacentral"
GITHUB_USERNAME="<YOUR_GITHUB_USERNAME>"
SUBSCRIPTION_ID="<YOUR_SUBSCRIPTION_ID>"
```

# [PowerShell](#tab/powershell)

Replace \<Placeholders\> with your values.

```azurepowershell-interactive
$ResourceGroup="my-containerapp-store"
$Location="canadacentral"
$GitHubUsername="<GitHubUsername>"
$SubscriptionId="<SubscriptionId>"
```

---

Sign in to Azure from the CLI using the following command, and follow the prompts in your browser to complete the authentication process.

# [Azure CLI](#tab/azure-cli)

```azurecli-interactive
az login
```

# [PowerShell](#tab/powershell)

```azurepowershell-interactive
Connect-AzAccount
```

---

Ensure you're running the latest version of the CLI via the upgrade command.

# [Azure CLI](#tab/azure-cli)

```azurecli-interactive
az upgrade
```

# [PowerShell](#tab/powershell)

```azurepowershell-interactive
Install-Module -Name Az.App
```

---

Now that you've validated your Azure CLI setup, bring the application code to your local machine.

## Get application code

1. Navigate to the [sample GitHub repo](https://github.com/Azure-Samples/container-apps-store-api-microservice.git) and select **Fork** in the top-right corner of the page.

1. Use the following [git](https://git-scm.com/downloads) command with your GitHub username to clone **your fork** of the repo to your development environment:

    # [Azure CLI](#tab/azure-cli)

    ```git
    git clone https://github.com/$GITHUB_USERNAME/container-apps-store-api-microservice.git
    ```

    # [PowerShell](#tab/powershell)

    ```git
    git clone https://github.com/$GitHubUsername/container-apps-store-api-microservice.git
    ```

    ---

1. Navigate into the cloned directory.

    ```bash
    cd container-apps-store-api-microservice
    ```

The repository includes the following resources:

- The source code for each application
- Deployment manifests
- A GitHub Actions workflow file

## Deploy Dapr solution using GitHub Actions

The GitHub Actions workflow YAML file in the `/.github/workflows/` folder executes the following steps in the background as you work through this tutorial:

| Section                | Tasks                                                             |
| ---------------------- | ----------------------------------------------------------------- |
| **Authentication**     | Log in to a private container registry (GitHub Container Registry) |
| **Build**              | Build & push the container images for each microservice           |
| **Authentication**     | Log in to Azure                                                    |
| **Deploy using bicep** | 1. Create a resource group  <br>2. Deploy Azure Resources for the solution using bicep            |

The following resources are deployed via the bicep template in the `/deploy` path of the repository:

- Log Analytics workspace
- Application Insights
- Container apps environment
- Order service container app
- Inventory container app
- Azure Cosmos DB

### Create a service principal

The workflow requires a [service principal](../active-directory/develop/app-objects-and-service-principals.md#service-principal-object) to authenticate to Azure. In the console, run the following command and replace `<SERVICE_PRINCIPAL_NAME>` with your own unique value.

# [Azure CLI](#tab/azure-cli)

```azurecli-interactive
az ad sp create-for-rbac \
  --name <SERVICE_PRINCIPAL_NAME> \
  --role "contributor" \
  --scopes /subscriptions/$SUBSCRIPTION_ID \
  --sdk-auth
```

# [PowerShell](#tab/powershell)

```azurepowershell-interactive
$CmdArgs = @{
   DisplayName = '<SERVICE_PRINCIPAL_NAME>'
   Role = 'contributor'
   Scope = '/subscriptions/' + $SubscriptionId 
}

New-AzAdServicePrincipal @CmdArgs
```

---

The output is the role assignment credentials that provide access to your resource. The command should output a JSON object similar to:

```json
  {
    "clientId": "<GUID>",
    "clientSecret": "<GUID>",
    "subscriptionId": "<GUID>",
    "tenantId": "<GUID>"
    (...)
  }
```

Copy the JSON object output and save it to a file on your machine. You use this file as you authenticate from GitHub.

### Configure GitHub Secrets

1. While in GitHub, browse to your forked repository for this tutorial.
1. Select the **Settings** tab. 
1. Select **Secrets** > **Actions**. 
1. On the **Actions secrets** page, select **New repository secret**.

   :::image type="content" source="media/dapr-github-actions/secrets-actions.png" alt-text="Screenshot of selecting settings, then actions from under secrets in the menu, then the new repository secret button.":::

1. Create the following secrets: 

   | Name | Value |
   | ---- | ----- |
   | `AZURE_CREDENTIALS` | The JSON output you saved earlier from the service principal creation |
   | `RESOURCE_GROUP` | Set as **my-containerapp-store** |

   :::image type="content" source="media/dapr-github-actions/secrets.png" alt-text="Screenshot of all three secrets once created.":::

### Trigger the GitHub Action

To build and deploy the initial solution to Azure Container Apps, run the "Build and deploy" workflow.

1. Open the **Actions** tab in your GitHub repository.
1. In the left side menu, select the **Build and Deploy** workflow.

   :::image type="content" source="media/dapr-github-actions/run-workflow.png" alt-text="Screenshot of the Actions tab in GitHub and running the workflow.":::

1. Select **Run workflow**.
1. In the prompt, leave the *Use workflow from* value as **Branch: main**.
1. Select **Run workflow**.

### Verify the deployment

After the workflow successfully completes, verify the application is running in Azure Container Apps.

1. Navigate to the [Azure portal](https://portal.azure.com).
1. In the search field, enter **my-containerapp-store** and select the **my-containerapp-store** resource group.

   :::image type="content" source="media/dapr-github-actions/search-resource-group.png" alt-text="Screenshot of searching for and finding my container app store resource group.":::

1. Navigate to the container app called **node-app**.

   :::image type="content" source="media/dapr-github-actions/node-app.png" alt-text="Screenshot of the node app container app in the resource group list of resources.":::

1. Select the **Application Url**.

   :::image type="content" source="media/dapr-github-actions/app-url.png" alt-text="Screenshot of the application url.":::

1. Ensure the application was deployed successfully by creating a new order:
    1. Enter an **Id** and **Item**.
    1. Select **Create**.   
  
       :::image type="content" source="media/dapr-github-actions/create-order.png" alt-text="Screenshot of creating an order via the application url.":::

    If the order is persisted, you're redirected to a page that says "Order created!"  

1. Navigate back to the previous page.

1. View the item you created via the **View Order** form:
    1. Enter the item **Id**.
    1. Select **View**.
    
       :::image type="content" source="media/dapr-github-actions/view-order.png" alt-text="Screenshot of viewing the order via the view order form.":::

      The page is redirected to a new page displaying the order object. 

1. In the Azure portal, navigate to **Application** > **Revision Management** in the **node-app** container. 

   At this point, only one revision is available for this app.

   :::image type="content" source="media/dapr-github-actions/single-revision-view.png" alt-text="Screenshot of checking the number of revisions at this point of the tutorial.":::


## Modify the source code to trigger a new revision

Container Apps run in single-revision mode by default. In the Container Apps bicep module, the revision mode is explicitly set to "multiple". Multiple revision mode means that once the source code is changed and committed, the GitHub build/deploy workflow builds and pushes a new container image to GitHub Container Registry. Changing the container image is considered a [revision-scope](revisions.md#revision-scope-changes) change and results in a new container app revision. 

> [!NOTE]
> [Application-scope](revisions.md#application-scope-changes) changes do not create a new revision.

To demonstrate the inner-loop experience for creating revisions via GitHub actions, you'll make a change to the frontend application and commit this change to your repo. 

1. Return to the console, and navigate into the *node-service/views* directory in the forked repository.

    # [Azure CLI](#tab/azure-cli)

    ```bash
   cd node-service/views
    ```

    # [PowerShell](#tab/powershell)

    ```azurepowershell
   cd node-service/view
    ```
   ---

1. Open the *index.jade* file in your editor of choice.

   # [Azure CLI](#tab/azure-cli)

    ```bash
   code index.jade .
    ```

   # [PowerShell](#tab/powershell)

    ```azurepowershell
   code index.jade .
    ```

    ---

1. At the bottom of the file, uncomment the following code to enable deleting an order from the Dapr state store.

   ```jade
   h2= 'Delete Order'
   br
   br
   form(action='/order/delete', method='post')
     div.input
       span.label Id
       input(type='text', name='id', placeholder='foo', required='required')
     div.actions
       input(type='submit', value='View')
   ```

1. Stage the changes and push to the `main` branch of your fork using git. 

   # [Azure CLI](#tab/azure-cli)
   
   ```git
   git add .
   git commit -m '<commit message>'
   git push origin main
   ```
   
   # [PowerShell](#tab/powershell)
   
    ```git
   git add .
   git commit -m '<commit message>'
   git push origin main
   ```
   ---

### View the new revision

1. In the GitHub UI of your fork, select the **Actions** tab to verify the GitHub **Build and Deploy** workflow is running. 

1. Once the workflow is complete, navigate to the **my-containerapp-store** resource group in the Azure portal.

1. Select the **node-app** container app. 

1. In the left side menu, select **Application** > **Revision Management**. 

   :::image type="content" source="media/dapr-github-actions/revision-mgmt.png" alt-text="Screenshot that shows Revision Management in the left side menu.":::

   Since our container app is in **multiple revision mode**, Container Apps created a new revision, and automatically sets it to `active` with 100% traffic.

   :::image type="content" source="media/dapr-github-actions/two-revisions.png" alt-text="Screenshot that shows both the inactive and active revisions on the node app.":::

1. Select each revision in the **Revision management** table to view revision details.

   :::image type="content" source="media/dapr-github-actions/revision-details.png" alt-text="Screenshot of the revision details for the active node app revision.":::

1. View the new revision in action by refreshing the node-app UI.

1. Test the application further by deleting the order you created in the container app. 

   :::image type="content" source="media/dapr-github-actions/delete-order.png" alt-text="Screenshot of deleting the order created earlier in the tutorial.":::

   The page is redirected to a page indicating that the order is removed.

## Clean up resources

Once you've finished the tutorial, run the following command to delete your resource group, along with all the resources you created in this tutorial.

# [Azure CLI](#tab/azure-cli)

```azurecli-interactive
az group delete \
  --resource-group $RESOURCE_GROUP
```

# [PowerShell](#tab/powershell)

```azurepowershell-interactive
Remove-AzResourceGroup -Name $ResourceGroupName -Force
```

---

## Next steps

Learn more about how [Dapr integrates with Azure Container Apps](./dapr-overview.md).
