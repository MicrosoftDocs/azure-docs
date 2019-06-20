---
title: Use a managed identity with Azure Container Registry Tasks
description: Enable a managed identity or Azure Resources to an Azure Container Registry task to to allow the task to access other Azure resources including other private container registries b.
services: container-registry
author: dlepow

ms.service: container-registry
ms.topic: article
ms.date: 06/12/2019
ms.author: danlep
---

# Use an Azure managed identity in ACR Tasks 

Enable a [managed identity for Azure resources](../active-directory/managed-identities-azure-resources/overview.md) in an ACR task so the task can access another Azure container registry or other Azure resources, without needing to provide or manage credentials in code. For example, use a managed identity to pull or push container images to another registry as a step in a task.

In this article, you learn more about managed identities and how to:

> [!div class="checklist"]
> * Enable a managed identity on an ACR task
> * Grant the identity access to Azure resources, such as another Azure container registry or an Azure key valut
> * Use the managed identity to access the resources from a task 

To create the Azure resources, this article requires that you run the Azure CLI version 2.0.66 or later. Run `az --version` to find the version. If you need to install or upgrade, see [Install Azure CLI][azure-cli].

## Why use a managed identity?

A managed identity for Azure resources provides Azure services with an automatically managed identity in Azure Active Directory (Azure AD). You can configure [certain Azure resources](../active-directory/managed-identities-azure-resources/services-support-managed-identities.md), including ACR Tasks, with a managed identity. Then, use the identity to access other Azure resources, without passing credentials in code or scripts.

Managed identities are of two types:

* *User-assigned identities*, which you can assign to multiple resources and persist for as long as your want. User-assigned identities are currently in preview.

* A *system-managed identity*, which is unique to a specific resource such as an ACR task and lasts for the lifetime of that resource. 

After you set up an Azure resource with a managed identity, grant the identity access to another resource, just like any security principal. For example, assign a managed identity a role with pull, push and pull, or other permissions to a private container registry in Azure. (For a complete list of registry roles, see [Azure Container Registry roles and permissions](container-registry-roles.md).) You can give an identity access to one or more resources.

The examples in this article use a system-managed identity, which persists for the lifetime of the task.

## Create container registries

For this tutorial you need two container registries:

* You use the first registry to create and execute ACR tasks. In this article, this source registry is named *myregistry*. 
* The second registry hosts a base image used for the first example task to build an image. In this article, the second registry is named *mybaseregistry*.

Replace with your own registry names in later steps.

If you don't already have the needed Azure container registries, see [Quickstart: Create a private container registry using the Azure CLI](container-registry-get-started-azure-cli.md). You don't need to push images to the registry yet.

## Example: Task that references a base image, requiring permissions

In this example, you create a task that build and pushes an image. The task requires pulling a base image from another registry. In a real-world scenario, an organization might maintain a set of base images used by all development teams. These images are stored in a corporate registry, which each development team having only pull rights.

### Prepare base registry

First, create a working directory and then create a Dockerfile named Dockerfile with the following content. This example builds a Node.js base image.
    
```bash
echo FROM node:9-alpine > Dockerfile
```
In the current directory, run the [az acr build][az-acr-build] command to build and push the base image to the base registry. In practice, another team or process in the organization might maintain the base registry.
    
```azurecli
az acr build --image baseimages/node:9-alpine --registry mybaseregistry --file .
```

### Create a task with a system-assigned identity

Create a [multi-step task](container-registry-tasks-multi-step.md) in the first registry with a system-assigned identity.

The steps for this example task are defined in a [YAML file](container-registry-tasks-reference-yaml.md) named `helloworldtask.yaml`. Create the file in your local working directory and paste in the following contents. Update the `build-arg` in the build step with the server name of your base registry.

```yml
version: v1.0.0
steps:
# Replace mybaseregistry with the name of your registry containing the base image
  - build: -t {{.Run.Registry}}/hello-world:{{.Run.ID}}  https://github.com/Azure-Samples/acr-build-helloworld-node.git -f Dockerfile-app --build-arg REGISTRY_NAME=mybaseregistry.azurecr.io 
  - push: ["{{.Run.Registry}}/hello-world:{{.Run.ID}}"]
```

The build step uses the `Dockerfile-app` file in the [Azure-Samples/acr-build-helloworld-node](https://github.com/Azure-Samples/acr-build-helloworld-node.git) to build an image. The `--build-arg` references the base registry to pull the base image. When successfully built, the image is pushed to the registry used to run the task.

Create the task *helloworldtask* by executing the following [az acr task create][az-acr-task-create] command. The task context is the local system, and the command references the file `testtask.yaml` in the working directory. The `--assign-identity` parameter with no additional value creates a system-assigned identity for the task. This task is set up so you have to trigger it manually, but you could set it up to run when commits are pushed to the repo or a pull request is made. 

```azurecli
az acr task create \
  --registry myregistry \
  --name helloworldtask \
  --context /dev/null \
  --file helloworldtask.yaml \
  --commit-trigger-enabled false \
  --pull-request-trigger-enabled false \
  --assign-identity
```

In the command output, the `identity` section shows an identity of type `SystemAssigned` is set in the task. The `principalId` is the service principal ID of the identity:

```console
[...]
  "identity": {
    "principalId": "xxxxxxxx-2703-42f9-97d0-xxxxxxxxxxxx",
    "tenantId": "xxxxxxxx-86f1-41af-91ab-xxxxxxxxxxxx",
    "type": "SystemAssigned",
    "userAssignedIdentities": null
  },
  "location": "eastus",
[...]
``` 

Use the [az acr task show command][az-acr-task-show] command to store the principalId in a variable, to use in later commands:

```azurecli
principalID=$(az acr task show --name helloworldtask --registry myregistry --query identity.principalId --output tsv)
```

### Give the identity pull permissions to the base registry

In this section, give the system-assigned identity permissions to pull from the base registry, *mybaseregistry*.

First use the [az acr show][az-acr-show] command to get the resource ID of the base registry and store it in a variable:

```azurecli
basereg_id=$(az acr show --name mybaseregistry --query id --output tsv)
```

Use the [az role assignment create][az-role-assignment-create] command to assign the identity the `acrpull` role to the base registry. This role has permissions only to pull images from the registry.

```azurecli
az role assignment create --assignee $principalID --scope $basereg_id --role acrpull
```

### Add target registry credentials to task

Now use the [az acr task credential add][az-acr-task-credential-add] command to add the identity's credentials to the task so that it can authenticate with the base registry.

```azurecli
az acr task credential add \
  --name helloworldtask \
  --registry myregistry \
  --login-server mybaseregistry.azurecr.io \
  --use-identity [system]
```

### Manually run the task

Use the [az acr task run][az-acr-task-run] command to manually trigger the task. 

```azurecli
az acr task run \
  --name helloworldtask \
  --registry myregistry

Output is similar to:

```
Queued a run with ID: cf10
Waiting for an agent...
2019/06/14 22:47:32 Using acb_vol_dbfbe232-fd76-4ca3-bd4a-687e84cb4ce2 as the home volume
2019/06/14 22:47:39 Creating Docker network: acb_default_network, driver: 'bridge'
2019/06/14 22:47:40 Successfully set up Docker network: acb_default_network
2019/06/14 22:47:40 Setting up Docker configuration...
2019/06/14 22:47:41 Successfully set up Docker configuration
2019/06/14 22:47:41 Logging in to registry: myregistry.azurecr.io
2019/06/14 22:47:42 Successfully logged into myregistry.azurecr.io
2019/06/14 22:47:42 Logging in to registry: mybaseregistry.azurecr.io
2019/06/14 22:47:43 Successfully logged into mybaseregistry.azurecr.io
2019/06/14 22:47:43 Executing step ID: acb_step_0. Timeout(sec): 600, Working directory: '', Network: 'acb_default_network'
2019/06/14 22:47:43 Scanning for dependencies...
2019/06/14 22:47:45 Successfully scanned dependencies
2019/06/14 22:47:45 Launching container with name: acb_step_0
Sending build context to Docker daemon   25.6kB
Step 1/6 : ARG REGISTRY_NAME
Step 2/6 : FROM ${REGISTRY_NAME}/baseimages/node:9-alpine
9-alpine: Pulling from baseimages/node
[...]
Successfully built 41b49a112663
Successfully tagged myregistry.azurecr.io/hello-world:cf10
2019/06/14 22:47:56 Successfully executed container: acb_step_0
2019/06/14 22:47:56 Executing step ID: acb_step_1. Timeout(sec): 600, Working directory: '', Network: 'acb_default_network'
2019/06/14 22:47:56 Pushing image: myregistry.azurecr.io/hello-world:cf10, attempt 1
The push refers to repository [myregistry.azurecr.io/hello-world]
[...]
2019/06/14 22:48:00 Step ID: acb_step_1 marked as successful (elapsed time in seconds: 2.517011)
2019/06/14 22:48:00 The following dependencies were found:
2019/06/14 22:48:00
- image:
    registry: myregistry.azurecr.io
    repository: hello-world
    tag: cf10
    digest: sha256:611cf6e3ae3cb99b23fadcd89fa144e18aa1b1c9171ad4a0da4b62b31b4e38d1
  runtime-dependency:
    registry: mybaseregistry.azurecr.io
    repository: baseimages/node
    tag: 9-alpine
    digest: sha256:e8e92cffd464fce3be9a3eefd1b65dc9cbe2484da31c11e813a4effc6105c00f
  git:
    git-head-revision: 0f988779c97fe0bfc7f2f74b88531617f4421643


Run ID: cf10 was successful after 32s
```


Run the [az acr repository show-tags][az-acr-repository-show-tags] command to verify that the image built and was successfully pushed to *myregistry*:


```azurecli
az acr repository show-tags -n myregistry --repository hello-world --output tsv
```

Example output:

```console
cf10
```

## Example: Task with a user-assigned identity

In this example you create a user-assigned identity with permissions to read secrets from an Azure key vault. You assign this identity to a multistep task that reads the secret, builds an image, and signs into the Azure CLI to read the image tag.

### Create a key vault and store a secret

First, if you need to, create a resource group named *myResourceGroup* in the *eastus* location with the following [az group create][az-group-create] command:

```azurecli-interactive
az group create --name myResourceGroup --location eastus
```

Use the [az keyvault create][az-keyvault-create] command to create a key vault. Be sure to specify a unique key vault name. 

```azurecli-interactive
az keyvault create --name mykeyvault --resource-group myResourceGroup --location eastus
```

Store a sample secret in the key vault using the [az keyvault secret set][az-keyvault-secret-set] command:

```azurecli
az keyvault secret set \
  --name SampleSecret \
  --value "Hello ACR Tasks!" \
  --description ACRTasksecret  \
  --vault-name mykeyvault
```

For example, you might want to store credentials to authenticate with a private Docker registry so you can pull a private image.

### Create an identity

Create an identity named *myACRTasksId* in your subscription using the [az identity create][az-identity-create] command. You can use the same resource group you used previously to create a container registry or key vault, or a different one.

```azurecli-interactive
az identity create --resource-group myResourceGroup --name myACRTasksId
```

To configure the identity in the following steps, use the [az identity show][az-identity-show] command to store the identity's resource ID and service principal ID in variables.

```azurecli
# Get resource ID of the user-assigned identity
resourceID=$(az identity show --resource-group myResourceGroup --name myACRTasksId --query id --output tsv)

# Get service principal ID of the user-assigned identity
principalID=$(az identity show --resource-group myResourceGroup --name myACRTasksId --query principalId --output tsv)
```

### Grant identity access to keyvault to read secret

Run the following [az keyvault set-policy][az-keyvault-set-policy] command to set an access policy on the key vault. The following example allows the user-assigned identity to get secrets from the key vault. This access is needed later to run a multi-step task successfully.

```azurecli-interactive
 az keyvault set-policy --name mykeyvault --resource-group myResourceGroup --object-id $principalID --secret-permissions get
```

### Grant identity Reader access to the resource group for registry

Run the following [az role assignment create][az-role-assignment-create] command to assign the identity a Reader role, in this case to the resource group containing the source registry. This role is needed later to run a multi-step task successfully.

```azurecli
az role assignment create --role reader --resource-group myResourceGroup --assignee $principalID
```

### Create task with user-assigned identity

Now create a [multi-step task](container-registry-tasks-multi-step.md) and assign it the user-assigned identity. For this example task, create a [YAML file](container-registry-tasks-reference-yaml.md) named `managed-identities.yaml` in a local working directory and paste the following contents. Be sure to replace the key vault name in the file with the name of your key vault

```yml
version: v1.0.0
# Replace mykeyvault with the name of your key vault
secrets:
  - id: name
    keyvault: https://mykeyvault.vault.azure.net/secrets/SampleSecret
steps:
  # Verify that the task can access the secret in the key vault
  - cmd: bash -c 'if [ -z "$MY_SECRET" ]; then echo "Secret not resolved"; else echo "Secret resolved"; fi'
    env: 
      - MY_SECRET='{{.Secrets.name}}' 

  # Build/push the website image to source registry, using dockerfile in the Azure-Samples repo
  - cmd: docker build -t {{.Run.Registry}}/my-website:{{.Run.ID}} https://github.com/Azure-Samples/aci-helloworld.git
  - push: 
    - "{{.Run.Registry}}/my-website:{{.Run.ID}}"
  
  # Login to Azure CLI with identity and list the tags to verify that the image is in the registry
  - cmd: microsoft/azure-cli az login --identity
  - cmd: microsoft/azure-cli az acr repository show-tags -n {{.Values.registryName}} --repository my-website
```

This task does the following:

* Verifies that it can access the secret in your key vault. This step is for demonstration purposes. In a real-world scenario, you might need a task step to get credentials to access a private Docker Hub repo.
* Builds and pushes the `mywebsite` image to the source registry.
* Logs into the Azure CLI to list the `my-website` image tags in the source registry.

Create a task called *msitask* and pass it the resource ID of the user-assigned identity you created previously. This example task is created from the `managed-identities.yaml` file you saved in your local working directory, so you have to trigger it manually.

```azurecli
az acr task create \
  --name msitask \
  --registry myregistry \
  --context /dev/null \
  --file managed-identities.yaml \
  --pull-request-trigger-enabled false \
  --commit-trigger-enabled false \
  --assign-identity $resourceID
```

In the command output, the `identity` section shows an identity of type `UserAssigned` is set in the task. The `principalId` is the service principal ID of the identity:

```console
[...]
"identity": {
    "principalId": null,
    "tenantId": null,
    "type": "UserAssigned",
    "userAssignedIdentities": {
      "/subscriptions/xxxxxxxx-d12e-4760-9ab6-xxxxxxxxxxxx/resourcegroups/myResourceGroup/providers/Microsoft.ManagedIdentity/userAssignedIdentities/myACRTasksId": {
        "clientId": "xxxxxxxx-f17e-4768-bb4e-xxxxxxxxxxxx",
        "principalId": "xxxxxxxx-1335-433d-bb6c-xxxxxxxxxxxx"
      }
[...]
```

### Manually run the task

Use the [az acr task run][az-acr-task-run] command to manually trigger the task. The `--set` parameter is used to pass in the source registry name to the task:

```azurecli
az acr task run --name msitask --registry myregistry --set registryName=myregistry  
```

Output shows the secret is resolved, the image is successfully built and pushed, and the task logs into the Azure CLI with the identity to read the image tag from the source registry:

```console
Queued a run with ID: cf32
Waiting for an agent...
2019/06/10 23:25:37 Downloading source code...
2019/06/10 23:25:38 Finished downloading source code
2019/06/10 23:25:39 Using acb_vol_4e4a0a7c-b6ef-4ec5-b40f-3436fc5eb0f5 as the home volume
2019/06/10 23:25:41 Creating Docker network: acb_default_network, driver: 'bridge'
2019/06/10 23:25:41 Successfully set up Docker network: acb_default_network
2019/06/10 23:25:41 Setting up Docker configuration...
2019/06/10 23:25:42 Successfully set up Docker configuration
2019/06/10 23:25:42 Logging in to registry: myregistry.azurecr.io
2019/06/10 23:25:43 Successfully logged into myregistry.azurecr.io
2019/06/10 23:25:43 Executing step ID: acb_step_0. Timeout(sec): 600, Working directory: '', Network: 'acb_default_network'
2019/06/10 23:25:43 Launching container with name: acb_step_0
Secret resolved
2019/06/10 23:25:44 Successfully executed container: acb_step_0
2019/06/10 23:25:44 Executing step ID: acb_step_1. Timeout(sec): 600, Working directory: '', Network: 'acb_default_network'
2019/06/10 23:25:44 Launching container with name: acb_step_1
Sending build context to Docker daemon  74.75kB

[...]

cf32: digest: sha256:cbb4aa83b33f6959d83e84bfd43ca901084966a9f91c42f111766473dc977f36 size: 1577
2019/06/10 23:26:05 Successfully pushed image: myregistry.azurecr.io/my-website:cf32
2019/06/10 23:26:05 Executing step ID: acb_step_3. Timeout(sec): 600, Working directory: '', Network: 'acb_default_network'
2019/06/10 23:26:05 Launching container with name: acb_step_3
[
  {
    "environmentName": "AzureCloud",
    "id": "xxxxxxxx-d12e-4760-9ab6-xxxxxxxxxxxx",
    "isDefault": true,
    "name": "DanLep Internal Consumption",
    "state": "Enabled",
    "tenantId": "xxxxxxxx-86f1-41af-91ab-xxxxxxxxxxxx",
      "user": {
      "assignedIdentityInfo": "MSI",
      "name": "systemAssignedIdentity",
      "type": "servicePrincipal"
    }
  }
]
2019/06/10 23:26:09 Successfully executed container: acb_step_3
2019/06/10 23:26:09 Executing step ID: acb_step_4. Timeout(sec): 600, Working directory: '', Network: 'acb_default_network'
2019/06/10 23:26:09 Launching container with name: acb_step_4
[
  "cf32"
]
2019/06/10 23:26:14 Successfully executed container: acb_step_4
2019/06/10 23:26:14 Step ID: acb_step_0 marked as successful (elapsed time in seconds: 1.025312)
2019/06/10 23:26:14 Step ID: acb_step_1 marked as successful (elapsed time in seconds: 13.703823)
2019/06/10 23:26:14 Step ID: acb_step_2 marked as successful (elapsed time in seconds: 6.791506)
2019/06/10 23:26:14 Step ID: acb_step_3 marked as successful (elapsed time in seconds: 3.852972)
2019/06/10 23:26:14 Step ID: acb_step_4 marked as successful (elapsed time in seconds: 5.079079)
```


## Next steps

In this article, you learned about using managed identities with Azure Container Registry Tasks and how to:

> [!div class="checklist"]
> * Enable a system-assigned identity or user-assigned on an ACR task
> * Grant the identity access to Azure resources, such as other Azure container registries
> * Use the managed identity to access the resources from a task  

* Learn more about [managed identities for Azure resources](/azure/active-directory/managed-identities-azure-resources/).

<!-- LINKS - Internal -->
[az-login]: /cli/azure/reference-index#az-login
[az-acr-login]: /cli/azure/acr#az-acr-login
[az-acr-show]: /cli/azure/acr#az-acr-show
[az-acr-build]: /cli/azure/acr#az-acr-build
[az-acr-repository-show-tags]: /cli/azure/acr/repository#az-acr-repository-show-tags
[az-role-assignment-create]: /cli/azure/role/assignment#az-role-assignment-create
[az-acr-login]: /cli/azure/acr#az-acr-login
[az-identity-create]: /cli/azure/identity?view=azure-cli-latest#az-identity-create
[az-identity-show]: /cli/azure/identity#az-identity-show
[azure-cli]: /cli/azure/install-azure-cli
[az-acr-task-create]: /cli/azure/acr/task#az-acr-task-create
[az-acr-task-show]: /cli/azure/acr/task#az-acr-task-show
[az-acr-task-run]: /cli/azure/acr/task#az-acr-task-run
[az-acr-task-list-runs]: /cli/azure/acr/task#az-acr-task-list-runs
[az-acr-task-credential-add]: /cli/azure/acr/task/credential#az-acr-task-credential-add
[az-group-create]: /cli/azure/group?#az-group-create
[az-keyvault-create]: /cli/azure/keyvault?#az-keyvault-create
[az-keyvault-secret-set]: /cli/azure/keyvault/secret#az-keyvault-secret-set
[az-keyvault-set-policy]: /cli/azure/keyvault#az-keyvault-set-policy
