---
title: Cross-registry authentication in an Azure Container Registry task
description: Enable a managed identity for Azure Resources in an Azure Container Registry task to allow the task to access another private container registry.
services: container-registry
author: dlepow

ms.service: container-registry
ms.topic: article
ms.date: 07/11/2019
ms.author: danlep
---

# Use an Azure-managed identity for cross-registry authentication in ACR Tasks 

In an [ACR task](container-registry-tasks-overview.md), you can [enable a managed identity for Azure resources](container-registry-tasks-authentication-managed-identity.md). The task can use the identity to access other Azure resources, without needing to provide or manage credentials. 

In this article, you learn how to use a managed identity in a task that performs operations in two different Azure container registries. You learn how to:

> [!div class="checklist"]
> * Enable a user-assigned or system-assigned managed identity on an ACR task
> * Grant the identity access to another Azure container registry 
> * Use the managed identity to access the target container registry from a sample task 

To create the Azure resources, this article requires that you run the Azure CLI version 2.0.68 or later. Run `az --version` to find the version. If you need to install or upgrade, see [Install Azure CLI][azure-cli].

## Scenario overview

The example tasks require pulling a base image from another registry to build and push an application image. To pull the base imagem tou configure the task with either a user-assigned or system-assigned managed identity, depending on your organization's needs. 

In a real-world scenario, an organization might maintain a set of base images used by all development teams to build their applications. These base images are stored in a corporate registry, with each development team having only pull rights. 


## Prerequisites

### Container registries

For this article, you need two Azure container registries:

* You use the first registry to create and execute ACR tasks. In this article, this registry is named *myregistry*. 
* The second registry hosts a base image used for the first example task to build an image. In this article, the second registry is named *mybaseregistry*.

Replace with your own registry names in later steps.

If you don't already have the needed Azure container registries, see [Quickstart: Create a private container registry using the Azure CLI](container-registry-get-started-azure-cli.md). You don't need to push images to the registry yet.

### User-assigned identity

Create an identity named *myACRTasksId* in your subscription using the [az identity create][az-identity-create] command. You can use the same resource group you used previously to create a container registry, or a different one.

```azurecli-interactive
az identity create --resource-group myResourceGroup --name myACRTasksId
```

To configure the user-assigned identity in the following steps, use the [az identity show][az-identity-show] command to store the identity's resource ID, service principal ID, and client ID in variables.

```azurecli
# Get resource ID of the user-assigned identity
resourceID=$(az identity show --resource-group myResourceGroup --name myACRTasksId --query id --output tsv)

# Get service principal ID of the user-assigned identity
principalID=$(az identity show --resource-group myResourceGroup --name myACRTasksId --query principalId --output tsv)

# Get client ID of the user-assigned identity
clientID=$(az identity show --resource-group myResourceGroup --name myACRTasksId --query clientId --output tsv)
```

## Prepare base registry

First, create a working directory and then create a file named Dockerfile with the following content. This simple example builds a Node.js base image from a public image in Docker Hub.
    
```bash
echo FROM node:9-alpine > Dockerfile
```
In the current directory, run the [az acr build][az-acr-build] command to build and push the base image to the base registry. In practice, another team or process in the organization might maintain the base registry.
    
```azurecli
az acr build --image baseimages/node:9-alpine --registry mybaseregistry --file Dockerfile .
```

## Define task steps in YAML file

The steps for this example [multi-step task](container-registry-tasks-multi-step.md) are defined in a [YAML file](container-registry-tasks-reference-yaml.md). Create a file named `helloworldtask.yaml` in your local working directory and paste in the following contents. Update the value of `REGISTRY_NAME` in the build step with the server name of your base registry.

```yml
version: v1.0.0
steps:
# Replace mybaseregistry with the name of your registry containing the base image
  - build: -t {{.Run.Registry}}/hello-world:{{.Run.ID}}  https://github.com/Azure-Samples/acr-build-helloworld-node.git -f Dockerfile-app --build-arg REGISTRY_NAME=mybaseregistry.azurecr.io
  - push: ["{{.Run.Registry}}/hello-world:{{.Run.ID}}"]
```

The build step uses the `Dockerfile-app` file in the [Azure-Samples/acr-build-helloworld-node](https://github.com/Azure-Samples/acr-build-helloworld-node.git) repo to build an image. The `--build-arg` references the base registry to pull the base image. When successfully built, the image is pushed to the registry used to run the task.

## Create and run task with user-assigned identity

### Create task

Create the task *helloworldtask* by executing the following [az acr task create][az-acr-task-create] command. The task context is the local system, and the command references the file `helloworldtask.yaml` in the working directory. The `--assign-identity` parameter enables the user-assigned identity on the task. 

```azurecli
az acr task create \
  --registry myregistry \
  --name helloworldtask \
  --context /dev/null \
  --file helloworldtask.yaml \
  --assign-identity $resourceID
```

In the command output, the `identity` section shows the identity of type `UserAssigned` is set in the task:

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

### Give identity pull permissions to the base registry

In this section, give the user-assigned identity permissions to pull from the base registry, *mybaseregistry*.

First use the [az acr show][az-acr-show] command to get the resource ID of the base registry and store it in a variable:

```azurecli
basereg_id=$(az acr show --name mybaseregistry --query id --output tsv)
```

Use the [az role assignment create][az-role-assignment-create] command to assign the identity the `acrpull` role to the base registry. This role has permissions only to pull images from the registry.

```azurecli
az role assignment create --assignee $principalID --scope $basereg_id --role acrpull
```

### Add target registry credentials to task

Now use the [az acr task credential add][az-acr-task-credential-add] command to add the identity's credentials to the task so that it can authenticate with the base registry. The `--use-identity` parameter passes the client ID of the identity.

```azurecli
az acr task credential add \
  --name helloworldtask \
  --registry myregistry \
  --login-server mybaseregistry.azurecr.io \
  --use-identity $clientID
```

### Manually run the task

Use the [az acr task run][az-acr-task-run] command to manually trigger the task. 

```azurecli
az acr task run \
  --name helloworldtask \
  --registry myregistry
```

If the task runs successfully, output is similar to:

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
az acr repository show-tags --name myregistry --repository hello-world --output tsv
```

Example output:

```console
cf10
```

## Next steps

* Learn more about [managed identities for Azure resources](/azure/active-directory/managed-identities-azure-resources/).

<!-- LINKS - Internal -->
[az-login]: /cli/azure/reference-index#az-login
[az-acr-login]: /cli/azure/acr#az-acr-login
[az-acr-show]: /cli/azure/acr#az-acr-show
[az-acr-build]: /cli/azure/acr#az-acr-build
[az-acr-repository-show-tags]: /cli/azure/acr/repository#az-acr-repository-show-tags
[az-role-assignment-create]: /cli/azure/role/assignment#az-role-assignment-create
[az-acr-login]: /cli/azure/acr#az-acr-login
[az-identity-create]: /cli/azure/identity#az-identity-create
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
