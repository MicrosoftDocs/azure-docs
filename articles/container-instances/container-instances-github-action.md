---
title: Deploy container instance by GitHub action
description: Configure a GitHub action that automates steps to build, push, and deploy a container image to Azure Container Instances
ms.topic: article
ms.date: 03/18/2020
ms.custom: 
---

# Configure a GitHub action to create a container instance

[GitHub Actions](https://help.github.com/actions/getting-started-with-github-actions/about-github-actions) is a suite of features in GitHub to automate your software development workflows in the same place you store code and collaborate on pull requests and issues.

Use the [Deploy to Azure Container Instances](https://github.com/azure/aci-deploy) GitHub action to automate deployment of a container to Azure Container Instances. The action allows you to set properties for a container instance similar to those in the [az container create][az-container-create] command.

This article shows how to set up a workflow in a GitHub repo that performs the following actions:

* Build an image from a Dockerfile
* Push the image to an Azure container registry
* Deploy the container image to an Azure container instance

This article shows two ways to set up the workflow:

* Configure a workflow yourself in a GitHub repo using the Deploy to Azure Container Instances action and other actions.  
* Use the `az container app up` command in the [Deploy to Azure](https://github.com/Azure/deploy-to-azure-cli-extension) extension in the Azure CLI. This command streamlines creation of the GitHub workflow and deployment steps.

> [!IMPORTANT]
> The GitHub action for Azure Container Instances is currently in preview. Previews are made available to you on the condition that you agree to the [supplemental terms of use][terms-of-use]. Some aspects of this feature may change prior to general availability (GA).

## Prerequisites

* **GitHub account** - Create an account on https://github.com if you don't already have one.
* **Azure CLI** - You can use the Azure Cloud Shell or a local installation of the Azure CLI to complete the Azure CLI steps. If you need to install or upgrade, see [Install Azure CLI][azure-cli-install].
* **Azure container registry** - If you don't have one, create an Azure container registry in the Basic tier using the [Azure CLI](../container-registry/container-registry-get-started-azure-cli.md), [Azure portal](../container-registry/container-registry-get-started-portal.md), or other methods. Take note of the resource group used for the deployment, which is used for the GitHub workflow.

## Set up repo

* For the examples in this article, use GitHub to fork the following repository: https://github.com/Azure-Samples/acr-build-helloworld-node

  This repo contains a Dockerfile and source files to create a container image of a small web app.

  ![Screenshot of the Fork button (highlighted) in GitHub](../container-registry/media/container-registry-tutorial-quick-build/quick-build-01-fork.png)

* Ensure Actions is enabled for your repository. Navigate to your forked repository and select **Settings** > **Actions**. In **Actions permissions**, ensure that **Enable local and third party Actions for this repository** is selected.

## Configure GitHub workflow

### Create service principal for Azure authentication

In the GitHub workflow, you need to supply Azure credentials to authenticate to the Azure CLI. The following example creates a service principal with the Contributor role scoped to the resource group for your container registry.

First, get the resource ID of your resource group. Substitute the name of your group in the following [az group show][az-group-show] command:

```azurecli
groupId=$(az group show \
  --name <resource-group-name> \
  --query id --output tsv)
```

Use [az ad sp create-for-rbac][az-ad-sp-create-for-rbac] to create the service principal:

```azurecli
az ad sp create-for-rbac \
  --scope $groupId \
  --role Contributor \
  --sdk-auth
```

Output is similar to:

```json
{
  "clientId": "xxxx6ddc-xxxx-xxxx-xxx-ef78a99dxxxx",
  "clientSecret": "xxxx79dc-xxxx-xxxx-xxxx-aaaaaec5xxxx",
  "subscriptionId": "xxxx251c-xxxx-xxxx-xxxx-bf99a306xxxx",
  "tenantId": "xxxx88bf-xxxx-xxxx-xxxx-2d7cd011xxxx",
  "activeDirectoryEndpointUrl": "https://login.microsoftonline.com",
  "resourceManagerEndpointUrl": "https://management.azure.com/",
  "activeDirectoryGraphResourceId": "https://graph.windows.net/",
  "sqlManagementEndpointUrl": "https://management.core.windows.net:8443/",
  "galleryEndpointUrl": "https://gallery.azure.com/",
  "managementEndpointUrl": "https://management.core.windows.net/"
}
```

Save the JSON output because it is used in a later step. Also, take note of the `clientId`, which you need to update the service principal in the next section.

### Update service principal for registry authentication

Update the Azure service principal credentials to allow push and pull permissions on your container registry. This step allows the GitHub workflow to use the service principal to [authenticate with your container registry](../container-registry/container-registry-auth-service-principal.md). 

Get the resource ID of your container registry. Substitute the name of your registry in the following [az acr show][az-acr-show] command:

```azurecli
registryId=$(az acr show \
  --name <registry-name> \
  --query id --output tsv)
```

Use [az role assignment create][az-role-assignment-create] to assign the AcrPush role, which gives push and pull access to the registry. Substitute the client ID of your service principal:

```azurecli
az role assignment create \
  --assignee <ClientId> \
  --scope $registryId \
  --role AcrPush
```

### Save credentials to GitHub repo

1. In the GitHub UI, navigate to your forked repository and select **Settings** > **Secrets**. 

1. Select **Add a new secret** to add the following secrets:

|Secret  |Value  |
|---------|---------|
|`AZURE_CREDENTIALS`     | The entire JSON output from the service principal creation |
|`REGISTRY_LOGIN_SERVER`   | The login server name of your registry (all lowercase). Example: *myregistry.azure.cr.io*        |
|`REGISTRY_USERNAME`     |  The `clientId` from the JSON output from the service principal creation       |
|`REGISTRY_PASSWORD`     |  The `clientSecret` from the JSON output from the service principal creation |
| `RESOURCE_GROUP` | The name of the resource group you used to scope the service principal |

### Create workflow file

1. In the GitHub UI, select **Actions** > **New workflow**.
1. Select **Set up a workflow yourself**.
1. In **Edit new file**, paste the following YAML contents to overwrite the sample code. Accept the default filename `main.yml`, or provide a filename you choose.
1. Select **Start commit**, optionally provide short and extended descriptions of your commit, and select **Commit new file**.

```yml
on: [push]
name: Linux_Container_Workflow

jobs:
    build-and-deploy:
        runs-on: ubuntu-latest
        steps:
        # checkout the repo
        - name: 'Checkout GitHub Action'
          uses: actions/checkout@master
          
        - name: 'Login via Azure CLI'
          uses: azure/login@v1
          with:
            creds: ${{ secrets.AZURE_CREDENTIALS }}
        
        - name: 'Build and push image'
          uses: azure/docker-login@v1
          with:
            login-server: ${{ secrets.REGISTRY_LOGIN_SERVER }}
            username: ${{ secrets.REGISTRY_USERNAME }}
            password: ${{ secrets.REGISTRY_PASSWORD }}
        - run: |
            docker build . -t ${{ secrets.REGISTRY_LOGIN_SERVER }}/sampleapp:${{ github.sha }}
            docker push ${{ secrets.REGISTRY_LOGIN_SERVER }}/sampleapp:${{ github.sha }}

        - name: 'Deploy to Azure Container Instances'
          uses: 'azure/aci-deploy@v1'
          with:
            resource-group: ${{ secrets.RESOURCE_GROUP }}
            dns-name-label: ${{ secrets.RESOURCE_GROUP }}${{ github.run_number }}
            image: ${{ secrets.REGISTRY_LOGIN_SERVER }}/sampleapp:${{ github.sha }}
            registry-login-server: ${{ secrets.REGISTRY_LOGIN_SERVER }}
            registry-username: ${{ secrets.REGISTRY_USERNAME }}
            registry-password: ${{ secrets.REGISTRY_PASSWORD }}
            name: aci-sampleapp
            location: 'west us'
```

### Validate workflow

After you commit the workflow file, the workflow is triggered. To review workflow progress, navigate to **Actions** > **Workflows**. 

![View workflow progress](./media/container-instances-github-action/github-action-progress.png)

See [Managing a workflow run](https://help.github.com/actions/configuring-and-managing-workflows/managing-a-workflow-run) for information about viewing the status and results of each step in your workflow.

When the workflow completes, get information about the container instance named *aci-sampleapp* by running the [az container show][az-container-show] command. Substitute the name of your resource group: 

```azurecli
az container show \
  --resource-group <resource-group-name> \
  --name aci-sampleapp \
  --query "{FQDN:ipAddress.fqdn,ProvisioningState:provisioningState}" \
  --output table
```

Output is similar to:

```console
FQDN                                   ProvisioningState
---------------------------------      -------------------
aci-action01.westus.azurecontainer.io  Succeeded
```

After the instance is provisioned, navigate to the container's FQDN in your browser to view the running web app.

![Running web app in browser](./media/container-instances-github-action/github-action-container.png)

## Use Deploy to Azure extension

Alternatively, use the [Deploy to Azure extension](https://github.com/Azure/deploy-to-azure-cli-extension) in the Azure CLI to configure the workflow. The `az container app up` command in the extension takes input parameters from you to set up a workflow to deploy to Azure Container Instances. 

The workflow created by the Azure CLI is similar to the workflow you can [create manually using GitHub](#configure-github-workflow).

### Additional prerequisite

In addition to the [prerequisites](#prerequisites) and [repo setup](#set-up-repo) for this scenario, you need to install the  **Deploy to Azure extension** for the Azure CLI.

Run the [az extension add][az-extension-add] command to install the extension:

```azurecli
az extension add \
  --name deploy-to-azure
```

For information about finding, installing, and managing extensions, see [Use extensions with Azure CLI](/cli/azure/azure-cli-extensions-overview).

### Run `az container app up`

To run the [az container app up][az-container-app-up] command, provide at minimum:

* The name of your Azure container registry, for example, *myregistry*
* The URL to your GitHub repo, for example, `https://github.com/<your-GitHub-Id>/acr-build-helloworld-node`

Sample command:

```azurecli
az container app up \
  --acr myregistry \
  --repository https://github.com/myID/acr-build-helloworld-node
```

### Command progress

* When prompted, provide your GitHub credentials or provide a [GitHub personal access token](https://help.github.com/github/authenticating-to-github/creating-a-personal-access-token-for-the-command-line) (PAT) that has *repo* and *user* scopes to authenticate with your registry. If you provide GitHub credentials, the command creates a PAT for you.

* The command creates repo secrets for the workflow:

  * Service principal credentials for the Azure CLI
  * Credentials to access the Azure container registry

* After the command commits the workflow file to your repo, the workflow is triggered. 

Output is similar to:

```console
[...]
Checking in file github/workflows/main.yml in the Github repository myid/acr-build-helloworld-node
Creating workflow...
GitHub Action Workflow has been created - https://github.com/myid/acr-build-helloworld-node/runs/515192398
GitHub workflow completed.
Workflow succeeded
Your app is deployed at:  http://acr-build-helloworld-node.eastus.azurecontainer.io:8080/
```

### Validate workflow

The workflow deploys an Azure container instance with the base name of your GitHub repo, in this case, *acr-build-helloworld-node*. In your browser, you can browse to the link provided to view the running web app. If your app listens on a port other than 8080, specify that in the URL instead.

To view the workflow status and results of each step in the GitHub UI, see [Managing a workflow run](https://help.github.com/actions/configuring-and-managing-workflows/managing-a-workflow-run).

## Clean up resources

Stop the container instance with the [az container delete][az-container-delete] command:

```azurecli
az container delete \
  --name <instance-name>
  --resource-group <resource-group-name>
```

To delete the resource group and all the resources in it, run the [az group delete][az-group-delete] command:

```azurecli
az group delete \
  --name <resource-group-name>
```

## Next steps

Browse the [GitHub Marketplace](https://github.com/marketplace?type=actions) for more actions to automate your development workflow


<!-- LINKS - external -->
[terms-of-use]: https://azure.microsoft.com/support/legal/preview-supplemental-terms/

<!-- LINKS - internal -->

[azure-cli-install]: /cli/azure/install-azure-cli
[az-group-show]: /cli/azure/group#az-group-show
[az-group-delete]: /cli/azure/group#az-group-delete
[az-ad-sp-create-for-rbac]: /cli/azure/ad/sp#az-ad-sp-create-for-rbac
[az-role-assignment-create]: /cli/azure/role/assignment#az-role-assignment-create
[az-container-create]: /cli/azure/container#az-container-create
[az-acr-show]: /cli/azure/acr#az-acr-show
[az-container-show]: /cli/azure/container#az-container-show
[az-container-delete]: /cli/azure/container#az-container-delete
[az-extension-add]: /cli/azure/extension#az-extension-add
[az-container-app-up]: /cli/azure/ext/deploy-to-azure/container/app#ext-deploy-to-azure-az-container-app-up
