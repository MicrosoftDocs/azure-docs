---
title: Cross-registry authentication from ACR task
description: Configure an Azure Container Registry Task (ACR Task) to access another private Azure container registry by using a managed identity for Azure resources
ms.topic: article
ms.date: 01/14/2020
---

# Cross-registry authentication in an ACR task using an Azure-managed identity 

In an [ACR task](container-registry-tasks-overview.md), you can [enable a managed identity for Azure resources](container-registry-tasks-authentication-managed-identity.md). The task can use the identity to access other Azure resources, without needing to provide or manage credentials. 

In this article, you learn how to enable a managed identity in a task to pull an image from a registry different from the one used to run the task.

To create the Azure resources, this article requires that you run the Azure CLI version 2.0.68 or later. Run `az --version` to find the version. If you need to install or upgrade, see [Install Azure CLI][azure-cli].

## Scenario overview

The example task pulls a base image from another Azure container registry to build and push an application image. To pull the base image, you configure the task with a managed identity and assign appropriate permissions to it. 

This example shows steps using either a user-assigned or system-assigned managed identity. Your choice of identity depends on your organization's needs.

In a real-world scenario, an organization might maintain a set of base images used by all development teams to build their applications. These base images are stored in a corporate registry, with each development team having only pull rights. 

## Prerequisites

For this article, you need two Azure container registries:

* You use the first registry to create and execute ACR tasks. In this article, this registry is named *myregistry*. 
* The second registry hosts a base image used for the task to build an image. In this article, the second registry is named *mybaseregistry*. 

Replace with your own registry names in later steps.

If you don't already have the needed Azure container registries, see [Quickstart: Create a private container registry using the Azure CLI](container-registry-get-started-azure-cli.md). You don't need to push images to the registry yet.

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

The steps for this example [multi-step task](container-registry-tasks-multi-step.md) are defined in a [YAML file](container-registry-tasks-reference-yaml.md). Create a file named `helloworldtask.yaml` in your local working directory and paste the following contents. Update the value of `REGISTRY_NAME` in the build step with the server name of your base registry.

```yml
version: v1.1.0
steps:
# Replace mybaseregistry with the name of your registry containing the base image
  - build: -t $Registry/hello-world:$ID  https://github.com/Azure-Samples/acr-build-helloworld-node.git -f Dockerfile-app --build-arg REGISTRY_NAME=mybaseregistry.azurecr.io
  - push: ["$Registry/hello-world:$ID"]
```

The build step uses the `Dockerfile-app` file in the [Azure-Samples/acr-build-helloworld-node](https://github.com/Azure-Samples/acr-build-helloworld-node.git) repo to build an image. The `--build-arg` references the base registry to pull the base image. When successfully built, the image is pushed to the registry used to run the task.

## Option 1: Create task with user-assigned identity

The steps in this section create a task and enable a user-assigned identity. If you want to enable a system-assigned identity instead, see [Option 2: Create task with system-assigned identity](#option-2-create-task-with-system-assigned-identity). 

[!INCLUDE [container-registry-tasks-user-assigned-id](../../includes/container-registry-tasks-user-assigned-id.md)]

### Create task

Create the task *helloworldtask* by executing the following [az acr task create][az-acr-task-create] command. The task runs without a source code context, and the command references the file `helloworldtask.yaml` in the working directory. The `--assign-identity` parameter passes the resource ID of the user-assigned identity. 

```azurecli
az acr task create \
  --registry myregistry \
  --name helloworldtask \
  --context /dev/null \
  --file helloworldtask.yaml \
  --assign-identity $resourceID
```

[!INCLUDE [container-registry-tasks-user-id-properties](../../includes/container-registry-tasks-user-id-properties.md)]

## Option 2: Create task with system-assigned identity

The steps in this section create a task and enable a system-assigned identity. If you want to enable a user-assigned identity instead, see [Option 1: Create task with user-assigned identity](#option-1-create-task-with-user-assigned-identity). 

### Create task

Create the task *helloworldtask* by executing the following [az acr task create][az-acr-task-create] command. The task runs without a source code context, and the command references the file `helloworldtask.yaml` in the working directory. The `--assign-identity` parameter with no value enables the system-assigned identity on the task. 

```azurecli
az acr task create \
  --registry myregistry \
  --name helloworldtask \
  --context /dev/null \
  --file helloworldtask.yaml \
  --assign-identity 
```
[!INCLUDE [container-registry-tasks-system-id-properties](../../includes/container-registry-tasks-system-id-properties.md)]

## Give identity pull permissions to the base registry

In this section, give the managed identity permissions to pull from the base registry, *mybaseregistry*.

Use the [az acr show][az-acr-show] command to get the resource ID of the base registry and store it in a variable:

```azurecli
baseregID=$(az acr show --name mybaseregistry --query id --output tsv)
```

Use the [az role assignment create][az-role-assignment-create] command to assign the identity the `acrpull` role to the base registry. This role has permissions only to pull images from the registry.

```azurecli
az role assignment create \
  --assignee $principalID \
  --scope $baseregID \
  --role acrpull
```

## Add target registry credentials to task

Now use the [az acr task credential add][az-acr-task-credential-add] command to enable the task to authenticate with the base registry using the identity's credentials. Run the command corresponding to the type of managed identity you enabled in the task. If you enabled a user-assigned identity, pass `--use-identity` with the client ID of the identity. If you enabled a system-assigned identity, pass `--use-identity [system]`.

```azurecli
# Add credentials for user-assigned identity to the task
az acr task credential add \
  --name helloworldtask \
  --registry myregistry \
  --login-server mybaseregistry.azurecr.io \
  --use-identity $clientID

# Add credentials for system-assigned identity to the task
az acr task credential add \
  --name helloworldtask \
  --registry myregistry \
  --login-server mybaseregistry.azurecr.io \
  --use-identity [system]
```

## Manually run the task

To verify that the task in which you enabled a managed identity runs successfully, manually trigger the task with the [az acr task run][az-acr-task-run] command. 

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

* Learn more about [enabling a managed identity in an ACR task](container-registry-tasks-authentication-managed-identity.md).
* See the [ACR Tasks YAML reference](container-registry-tasks-reference-yaml.md)

<!-- LINKS - Internal -->
[az-login]: /cli/azure/reference-index#az-login
[az-acr-login]: /cli/azure/acr#az-acr-login
[az-acr-show]: /cli/azure/acr#az-acr-show
[az-acr-build]: /cli/azure/acr#az-acr-build
[az-acr-repository-show-tags]: /cli/azure/acr/repository#az-acr-repository-show-tags
[az-role-assignment-create]: /cli/azure/role/assignment#az-role-assignment-create
[az-acr-login]: /cli/azure/acr#az-acr-login
[azure-cli]: /cli/azure/install-azure-cli
[az-acr-task-create]: /cli/azure/acr/task#az-acr-task-create
[az-acr-task-show]: /cli/azure/acr/task#az-acr-task-show
[az-acr-task-run]: /cli/azure/acr/task#az-acr-task-run
[az-acr-task-list-runs]: /cli/azure/acr/task#az-acr-task-list-runs
[az-acr-task-credential-add]: /cli/azure/acr/task/credential#az-acr-task-credential-add
[az-group-create]: /cli/azure/group?#az-group-create
