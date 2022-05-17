---
title: Tutorial - Deploy Azure Container App revisions with GitHub Actions
description: Learn how to deploy a Dapr application to Azure Container Apps using GitHub Actions. 
author: cebundy
ms.author: v-bcatherine
ms.reviewer: keroden
ms.service: container-apps
ms.topic: tutorial 
ms.date: 05/16/2022
ms.custom: template-tutorial
---

# Tutorial: Deploy a Dapr application to Azure Container Apps using Github Actions

[GitHub Actions](https://docs.github.com/en/actions) gives you the flexibility to build an automated software development lifecycle workflow. In this tutorial, you will leverage the Github Actions integration with Azure Container Apps to generate a workflow for deploying revision-scope changes on a [Dapr](./dapr-overview.md) container app.

You will:

> [!div class="checklist"]
>
> - Deploy a Dapr container app sample microservice to Azure Container Apps.
> - Run a GitHub Actions workflow for deploying Azure Container Apps revisions to the Dapr sample app.
> - Modify the generated workflow within the context of a monorepo.
> - Make a [revision-scope change](revisions.md#revision-scope-changes) to a Dapr application to trigger the GitHub workflow.
> - View the Container Apps revision you triggered.

The [Container App Store Microservice sample](https://github.com/Azure-Samples/container-apps-store-api-microservice) consists of three microservices, which will be deployed as three container apps respectively:

- **Store API** (node-app): returns details on an order from the order service and details on an inventory item from the inventory service
- **Order service** (python-app): Python flask app that retrieves and stores order state
- **Inventory service** (go-app): Go mux app that returns a static value for inventory state for demo purposes

Once your solution is up and running in Azure, you will leverage the Azure Container Apps GitHub Action integration feature to trigger new revisions for the Order Service.

> [!NOTE]
> A new revision is created for a container app when the update contains **[revision-scope](revisions.md#revision-scope-changes)** changes. [Application-scope](revisions.md#application-scope-changes) changes do not create a new revision.

## Prerequisites

- An Azure account with an active subscription [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).
- Contributor or Owner permissions on the Azure subscription.
- A GitHub account. If you don't have one, sign up for [free](https://github.com/join).
- Install the [Azure CLI](/cli/azure/install-azure-cli).

## Before you begin

### Set up the environment

In the console, set the following environment variables:

# [Bash](#tab/bash)

```bash
RESOURCE_GROUP="my-containerapp-store"
LOCATION="canadacentral"
GITHUB_USERNAME="your-GitHub-username"
SUBSCRIPTION_ID="your-subscription-id"
```

# [PowerShell](#tab/powershell)

```powershell
$RESOURCE_GROUP="my-containerapp-store"
$LOCATION="canadacentral"
$GITHUB_USERNAME="your-GitHub-username"
$SUBSCRIPTION_ID="your-subscription-id"
```

---

Sign into Azure from the CLI using the following command, and follow the prompts in your browser to complete the authentication process.

# [Bash](#tab/bash)

```azurecli
az login
```

# [PowerShell](#tab/powershell)

```azurecli
az login
```

---

Ensure you're running the latest version of the CLI via the upgrade command.

# [Bash](#tab/bash)

```azurecli
az upgrade
```

# [PowerShell](#tab/powershell)

```azurecli
az upgrade
```

---

Now that you have validated your Azure CLI set up, bring the application code to your local machine.

### Get application code

1. Navigate to the [sample GitHub repo](https://github.com/Azure-Samples/container-apps-store-api-microservice.git) and click **Fork** in the top-right corner of the page.

1. Use the following [git](https://git-scm.com/downloads) command with your GitHub username to clone **your fork** of the repo to your development environment:

# [Bash](#tab/bash)

```git
git clone https://github.com/$GITHUB_USERNAME/container-apps-store-api-microservice.git
```

# [PowerShell](#tab/powershell)

```git
git clone https://github.com/$GITHUB_USERNAME/container-apps-store-api-microservice.git
```

---

Navigate into the cloned directory.

```console
cd container-apps-store-api-microservice
```

Inside the directory is:

- The source code for each application
- Deployment manifests
- A GitHub Actions workflow
- Other development assets

> [!NOTE]
> For this tutorial, we focus on the baseline solution deployment outlined below. If you are interested in building and running the solution on your own, [follow the README instructions within the repo](https://github.com/azure-samples/container-apps-store-api-microservice#build-and-run).

## Deploy baseline solution using GitHub Actions

In your forked repository, an existing GitHub Actions workflow defined by a YAML file in the `/.github/workflows/` path will execute the following steps:

| Section            | Tasks                                                             |
| ------------------ | ----------------------------------------------------------------- |
| **Authentication** | Login to a private container registry (GitHub Container Registry) |
| **Build**          | Build & push the container images for each microservice           |
| **Authentication** | Login to Azure                                                    |
| **Deploy**         | 1. Create a resource group                                        |
|                    | 2. Deploy Azure Resources for the solution using bicep            |

The following resources will be deployed via the bicep template in the `/deploy` path of the repository:

- Log Analytics workspace
- Application Insights
- Container App Environment
- Store API Container App
- Order Container App
- Inventory Container App
- CosmosDB

### Create a service principal

The workflow requires a [service principal](../active-directory/develop/app-objects-and-service-principals.md#service-principal-object) to authenticate to Azure. Replace <SERVICE_PRINCIPAL_NAME> with your own unique value.

# [Bash](#tab/bash)

```azurecli
az ad sp create-for-rbac \
  --name <SERVICE_PRINCIPAL_NAME> \
  --role "contributor" \
  --scopes /subscriptions/$SUBSCRIPTION_ID \
  --sdk-auth
```

# [PowerShell](#tab/powershell)

```azurecli
az ad sp create-for-rbac `
  --name <SERVICE_PRINCIPAL_NAME> `
  --role "contributor" `
  --scopes /subscriptions/$SUBSCRIPTION_ID `
  --sdk-auth
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

Copy the JSON object output and **save it**. You will use it to authenticate from GitHub.

### Create a GitHub Personal Access Token (PAT)

Since you are using a private GitHub Container Registry to host the container images, you need to generate a GitHub PAT with the `write:packages` scope. With this scope, you can:

- Upload and download your container images within the GitHub Action workflow
- Connect to your registry from Azure Container Apps, later in the tutorial.

Navigate to GitHub and verify you're logged in.  

1. In the upper-right corner of any GitHub page, click your profile photo, then click **Settings**.
1. In the left sidebar, click **Developer Settings** > **Personal Access Tokens**.
1. Click **Generate new token**. You may be asked to enter your GitHub password.
1. In the **Note** field, provide a descriptive name.
1. Leave the **Expiration** value at default.
1. Select the `write:packages` scope.
1. Scroll down and click **Generate Token**.
1. Copy the PAT value and **save it**. You will not be able to view it again after this initial creation.

### Configure GitHub Secrets

1. Still in GitHub, browse to your forked repository for this tutorial.
1. Select the **Settings** tab. 
1. Select **Secrets** > **Actions**. 
1. On the **Actions secrets** page, select **New repository secret**.
1. Create the following secrets: 

   | Name | Value |
   | ---- | ----- |
   | PACKAGES_TOKEN | The PAT you saved in the previous step |
   | AZURE_CREDENTIALS | The JSON output you saved earlier from the service principal creation |
   | RESOURCE_GROUP | Set as "my-containerapp-store" |

### Trigger the GitHub Action

To build and deploy the initial solution to Azure Container Apps, run the "Build and deploy baseline" workflow.

1. Open the **Actions** tab in your GitHub repository.
1. In the left side menu, select the **Build and Deploy** baseline workflow.

   :::image type="content" source="media/container-store-dapr/run-workflow.png" alt-text="Screenshot of the Actions tab in GitHub and running the workflow.":::

1. Select **Run workflow**.
1. In the prompt, leave the **Use workflow from** value as _Branch: main_.
1. Select **Run workflow**.

### Verify the deployment

After the workflow successfully completes, verify the application is running in Azure Container Apps. 

1. Navigate to the [Azure portal](https://portal.azure.com).
1. In the search field, enter _my-containerapp-store_ and select the "my-containerapp-store" resource group.

   :::image type="content" source="media/container-store-dapr/search-resource-group.png" alt-text="Screenshot of searching for and finding the my container app store resoure group.":::

1. Navigate to the container app called **node-app**.

   :::image type="content" source="media/container-store-dapr/node-app.png" alt-text="Screenshot of the node app container app in the resource group list of resources.":::

1. Select the **Application Url**.

   :::image type="content" source="media/container-store-dapr/app-url.png" alt-text="Screenshot of the application url.":::

1. Test successful deployment by creating a new order:
    1. Enter an **Id** and **Item**.
    1. Click **Create**.   
  
       :::image type="content" source="media/container-store-dapr/create-order.png" alt-text="Screenshot of creating an order via the application url.":::

    If the order was persisted, you will be redirected to a page that says "Order created!"  

1. Navigate back to the previous page.

1. View the item you created via the **View Order** form:
    1. Enter the item **Id**.
    1. Select **View**. 
    
       :::image type="content" source="media/container-store-dapr/view-order.png" alt-text="Screenshot of viewing the order via the view order form.":::

      You will be redirected to a new page displaying the order object. 

### Modify the source code to trigger a new revision

Once the source code is changed and committed, the Github build/deploy workflow will build and push a new container image to GitHub Container Registry. Changing the container image is considered a [revision-scope](revisions.md#revision-scope-changes) change and results in the creation of a new Container App revision. 

For this tutorial, you'll add a **Delete Order** operation to your store. 

1. Back in the console, navigate into the `node-service/views` directory in the forked repository.

   
   # [Bash](#tab/bash)
   
   ```azurecli
      cd node-service/views
   ```
   
   # [PowerShell](#tab/powershell)
   
   ```azurecli
      cd node-service/views
   ```
   ---


1. Open the `index.jade` file in your editor of choice.


   # [Bash](#tab/bash)
   
   ```azurecli
      code index.jade .
   ```
   
   # [PowerShell](#tab/powershell)
   
   ```azurecli
      code index.jade .
   ```
   ---


1. At the bottom of the file, add the following code to create an order deletion form:

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
1. Save the file.

1. In the console, navigate to `node-service/routes`.

   # [Bash](#tab/bash)
   
   ```azurecli
   cd .. 
   cd routes/
   ```
   
   # [PowerShell](#tab/powershell)
   
   ```azurecli
   cd .. 
   cd routes/
   ```
   ---

1. Open `orders.js`:

   # [Bash](#tab/bash)
   
   ```azurecli
      code orders.js .
   ```
   
   # [PowerShell](#tab/powershell)
   
   ```azurecli
      code orders.js .
   ```
   ---

1. Add a route for the delete action after the create action in the file. With the following route, a Dapr service invocation calls to the `python-service` to delete the order from the CosmosDB state store:

   ```js
   router.post('/delete', async function(req, res ) {
   
     var data = await axios.delete(`${daprSidecar}/order?id=${req.body.id}`, {
       headers: {'dapr-app-id': `${orderService}`}
     });
     
     res.setHeader('Content-Type', 'application/json');
     res.send(`${JSON.stringify(data.data)}`);
   });
   ```

1. Save the file.

1. Navigate to the `python-service`:

   # [Bash](#tab/bash)
   
   ```azurecli
   cd ../..
   cd python-service/
   ```
   
   # [PowerShell](#tab/powershell)
   
   ```azurecli
   cd ../..
   cd python-service/
   ```
   ---

1. Open `app.py`:

   # [Bash](#tab/bash)
   
   ```azurecli
      code app.py .
   ```
   
   # [PowerShell](#tab/powershell)
   
   ```azurecli
      code app.py .
   ```
   ---

1. Add the endpoint for deleting an order under the endpoint for creating an order:

   ```python
   @app.route('/order', methods=['DELETE'])
   def deleteOrder():
       app.logger.info('delete called in the order service')
       with DaprClient() as d:
           d.wait(5)
           id = request.args.get('id')
           if id:
               # Delete the order status from Cosmos DB via Dapr
               try: 
                   d.delete_state(store_name='orders', key=id)
                   return f'Item {id} successfully deleted', 200
               except Exception as e:
                   app.logger.info(e)
                   return abort(500)
               finally:
                   app.logger.info('completed order delete')
           else:
               resp = jsonify('Order "id" not found in query string')
               resp.status_code = 400
               return resp
   ```

1. Save the file.

1. Stage the changes and push to the `main` branch of your fork using git. 

   # [Bash](#tab/bash)
   
   ```azurecli
   git add .
   git commit -m '<commit message>'
   git push origin main
   ```
   
   # [PowerShell](#tab/powershell)
   
   ```azurecli
   git add .
   git commit -m '<commit message>'
   git push origin main
   ```
   ---

### View the new revision

1. In the GitHub UI of your fork, select the **Actions** tab to verify the Github **Build and Deploy** workflow is running. 

1. Once the workflow is complete, navigate to the **my-containerapp-store** resource group in the Azure portal.

1. Select the **node-app** container app. 

1. In the left side menu, select **Application** > **Revision Management**. 

   :::image type="content" source="media/container-store-dapr/revision-mgmt.png" alt-text="Screenshot that shows Revision Management in the left side menu.":::

1. Check the box in the upper-right corner for **Show inactive revisions**. 

   :::image type="content" source="media/container-store-dapr/show-inactive.png" alt-text="Screenshot of selecting the Show inactive revisions checkbox.":::

Notice the node-app now has two revisions:

:::image type="content" source="media/container-store-dapr/two-revisions.png" alt-text="Screenshot that shows both the inactive and active revisions on the node app.":::


| Revision | Description |
| -------- | ----------- |
| **Inactive** | Created when the base application was first deployed |
| **Active** | Created when you added the Delete Order operation and pushed the changes |

Since our Container App is in **single revision mode**, Container Apps created a new revision and automatically set it to `active` with 100% traffic. View this new revision in action by refreshing the node-app UI.

:::image type="content" source="media/container-store-dapr/revision-ui.png" alt-text="Screenshot of the node app after building and deploying the delete order revision.":::

Select on each revision in the **Revision management** table to view revision details.

## Clean up resources

Once you've finished the tutorial, run the following command to delete your resource group, along with all the resources you created in this tutorial.

# [Bash](#tab/bash)

```azurecli
az group delete \
  --resource-group $RESOURCE_GROUP
```

# [PowerShell](#tab/powershell)

```powershell
Remove-AzResourceGroup -Name $RESOURCE_GROUP -Force
```

---

Make sure to also hard-delete the API Management resource included in the tutorial. Run the following REST `get` command with your subscription ID to retrieve the API Management resource name and location:

# [Bash](#tab/bash)

```azurecli
az rest -m get --header "Accept=application/json" -u ‘https://management.azure.com/subscriptions/{subscriptionID}/providers/Microsoft.ApiManagement/deletedservices?api-version=2021-08-01'
```

Run the REST `delete` command with your subscription ID and the API Management resource name and location to purge:

```azurecli
az rest -m delete --header "Accept=application/json" -u 'https://management.azure.com/subscriptions/{subscriptionID}/providers/Microsoft.ApiManagement/locations/{location}/deletedservices/{APIMname}?api-version=2021-08-01'
```

# [PowerShell](#tab/powershell)

```powershell
az rest -m get --header "Accept=application/json" -u ‘https://management.azure.com/subscriptions/{subscriptionID}/providers/Microsoft.ApiManagement/deletedservices?api-version=2021-08-01'
```

Run the REST `delete` command to purge the API Management resource:

```powershell
az rest -m delete --header "Accept=application/json" -u 'https://management.azure.com/subscriptions/{subscriptionID}/providers/Microsoft.ApiManagement/locations/{location}/deletedservices/{APIMname}?api-version=2021-08-01'
```

---

## Next steps

Learn more about how [Dapr integrates with Azure Container Apps](./dapr-overview.md).

