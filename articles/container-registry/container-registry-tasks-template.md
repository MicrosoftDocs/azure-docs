---
title: Run task using template
description: Run an ACR task using an Azure Resource Manager template
ms.topic: article
ms.date: 03/25/2020
---

# Run ACR Tasks using Resource Manager templates

[ACR Tasks](container-registry-tasks-overview.md) is a suite of features within Azure Container Registry to help you manage and modify container images across the container lifecycle. 

This article shows how to use an Azure Resource Manager template to queue a [quick task](container-registry-tasks-overview.md#quick-task), similar to one you can create manually using the [az acr build][az-acr-build] command.

A Resource Manager template to queue a task is useful in automation scenarios. For example:

* Use a template to create a container registry and immediately queue an ACR task to build or push a container image
* Automate creation of additional resources you can use in a quick task, such as a managed identity for Azure resources. The template-based creation of a quick task allows you to use a managed identity, which currently isn't supported with `az acr build`.

## Limitations

* You must specify a remote context such as a GitHub repo as the [source location](container-registry-tasks-overview.md#context-locations) for your task. You can't use a local source context.
* For task runs using a managed identity, only a *user-assigned* managed identity is permitted.

## Prerequisites

* **GitHub account** - Create an account on https://github.com if you don't already have one. This tutorial series uses a GitHub repository to demonstrate automated image builds in ACR Tasks.
* **Fork sample repository** - Use the GitHub UI to fork the following sample repository into your GitHub account: https://github.com/Azure-Samples/acr-build-helloworld-node. This repo contains sample Dockerfiles and source code to build small container images.

## Example: Create registry and queue a build task

This example uses a [sample template](https://github.com/Azure/acr/tree/master/docs/tasks/run-as-deployment/quickdockerbuild) that creates a container registry and queues a task to build and push an image. To use the template:

* First create a resource group, or use an existing group
* Specify a unique registry name
* Point to a remote GitHub repo for the build context, such as https://github.com/<your-GitHub-ID>/acr-build-helloworld-node. The Dockerfile in the root of this repo builds a container image for  small Node.js web app. 

### Deploy the template

Deploy the template with the [az deployment group create][az-deployment-group-create] command. This example builds and pushes the *helloworld-node:testtask* image to a registry named *mycontainerregistry*:

```azurecli
az deployment group create \
  --resource-group myResourceGroup \
  --template-uri https://raw.githubusercontent.com/Azure/acr/master/docs/tasks/run-as-deployment/quickdockerbuild/azuredeploy.json \
  --parameters azuredeploy.parameters.json \
  --parameters \
    registryName=mycontainerregistry \
    taskRunName=testtask \
    repository=helloworld-node \
    sourceLocation=https://github.com/<your-GitHub-ID>/acr-build-helloworld-node.git 
 ```

### Verify deployment

Verify the image is built by running [az acr repository show-tags][az-acr-repository-show-tags]:

```azurecli
az acr repository show-tags \
  --name mycontainerregistry \
  --repository helloworld-node --output table
```

Output:

```console
Result
--------
testtask
```

### View run log

To view details about the task run, view the run log.

First get the run ID with [az acr task list-runs][az-acr-task-list-runs]
```azurecli
az acr task list-runs \
  --registry mycontainerregistry --output table
```

Output is similar to:

```console
RUN ID    TASK    PLATFORM    STATUS     TRIGGER    STARTED               DURATION
--------  ------  ----------  ---------  ---------  --------------------  ----------
ca1               linux       Succeeded  Manual     2020-03-23T17:54:28Z  00:00:48
```

Run [az acr task logs][az-acr-task-logs] to view task run logs for the run ID, in this case *ca1*:

```azurecli
az acr task logs \
  --registry mycontainerregistry \
  --run-id ca1
```

Output is similar to:

```console
2020/03/23 17:54:29 Downloading source code...
2020/03/23 17:54:49 Finished downloading source code
2020/03/23 17:54:50 Using acb_vol_076f6d6d-209f-4b12-8a2a-936e3279ef6f as the home volume
2020/03/23 17:54:50 Setting up Docker configuration...
2020/03/23 17:54:51 Successfully set up Docker configuration
2020/03/23 17:54:51 Logging in to registry: mycontainerregistry.azurecr.io
2020/03/23 17:54:52 Successfully logged into mycontainerregistry.azurecr.io
2020/03/23 17:54:52 Executing step ID: build. Timeout(sec): 28800, Working directory: '', Network: ''
2020/03/23 17:54:52 Scanning for dependencies...
2020/03/23 17:54:53 Successfully scanned dependencies
2020/03/23 17:54:53 Launching container with name: build
Sending build context to Docker daemon  89.09kB
Step 1/5 : FROM node:9-alpine
[...]
testtask: digest: sha256:770789bd67d6ae1cc3eef9035b796ffc1616b1f9d117cf5c83cf48aec89ac464 size: 1367
2020/03/23 17:55:13 Successfully pushed image: mycontainerregistry.azurecr.io/helloworld-node:testtask
2020/03/23 17:55:13 Step ID: build marked as successful (elapsed time in seconds: 11.468590)
2020/03/23 17:55:13 Populating digests for step ID: build...
2020/03/23 17:55:15 Successfully populated digests for step ID: build
2020/03/23 17:55:15 Step ID: push marked as successful (elapsed time in seconds: 9.269134)
2020/03/23 17:55:15 The following dependencies were found:
2020/03/23 17:55:15 
- image:
    registry: mycontainerregistry.azurecr.io
    repository: helloworld-node
    tag: testtask
    digest: sha256:770789bd67d6ae1cc3eef9035b796ffc1616b1f9d117cf5c83cf48aec89ac464
  runtime-dependency:
    registry: registry.hub.docker.com
    repository: library/node
    tag: 9-alpine
    digest: sha256:8dafc0968fb4d62834d9b826d85a8feecc69bd72cd51723c62c7db67c6dec6fa
  git:
    git-head-revision: a3710d1af24d20fbdc6bb3feeea428fa01138e93


Run ID: ca1 was successful after 47s
```

## Example: Task with managed identity

This [deployment example](https://github.com/Azure/acr/tree/master/docs/tasks/run-as-deployment/quickdockerbuildwithidentity) queues a task that uses a user-assigned managed identity. During the task run, the identity authenticates to pull an image from another Azure container registry. This scenario is similar to the one in [Cross-registry authentication in an ACR task using an Azure-managed identity](container-registry-tasks-cross-registry-authentication.md). For example, an organization might maintain a *base registry* with base images accessed by multiple development teams.

For this example, you create a managed identity before queuing the task. However, you can also set up a template to automate creation of the identity. 

### Prepare a base registry

For demonstration purposes, create a separate container registry as your base registry, and push a Node.js base image pulled from Docker Hub.

1. Create a second container registry, for example *mybaseregistry*, to store base images.
1. Pull the `node:9-alpine` image from Docker Hub, tag it for your base registry, and push it to the base registry:

  ```azurecli
  docker pull node:9-alpine
  docker tag node:9-alpine mybaseregistry.azurecr.io/baseimages/node:9-alpine
  az acr login -n mybaseregistry
  docker push mybaseregistry.azurecr.io/baseimages/node:9-alpine
  ```

### Create a new Dockerfile

Create a Dockerfile that pulls the base image from your base registry.

1. In the GitHub UI, select **Create new file**.
1. Name your file *Dockerfile-test* and paste the following contents. Substitute your registry name for *mybaseregistry*.
  ```
  FROM mybaseregistry.azurecr.io/baseimages/node:9-alpine
  COPY . /src
  RUN cd /src && npm install
  EXPOSE 80
  CMD ["node", "/src/server.js"]
  ```
 1. Select **Commit new file**.

[!INCLUDE [container-registry-tasks-user-assigned-id](../../includes/container-registry-tasks-user-assigned-id.md)]

### Give identity pull permissions to the base registry

Give the managed identity permissions to pull from the base registry, *mybaseregistry*.

First use the [az acr show][az-acr-show] command to get the resource ID of the base registry and store it in a variable:

```azurecli
baseregID=$(az acr show \
  --name mybaseregistry \
  --query id --output tsv)
```

Use the [az role assignment create][az-role-assignment-create] command to assign the identity the Acrpull role to the base registry. This role has permissions only to pull images from the registry.

```azurecli
az role assignment create \
  --assignee $principalID \
  --scope $baseregID \
  --role acrpull
```

### Deploy the template

```azurecli
az deployment group create \
  --resource-group myResourceGroup \
  --template-uri https://raw.githubusercontent.com/Azure/acr/master/docs/tasks/run-as-deployment/quickdockerbuildwithidentity/azuredeploy.json \
  --parameters azuredeploy.parameters.json \
  --parameters \
    registryName=mycontainerregistry \
    taskRunName=basetask \
    repository=helloworld-node \
    userAssignedIdentity=$resourceID \
    identityCredential=$clientID \
    sourceLocation=https://github.com/<your-GitHub-ID>/acr-build-helloworld-node.git \
    dockerFilePath=Dockerfile-test \
    baseRegistry=mybaseregistry.azurecr.io
```

Verify the image is built by running [az acr repository show-tags][az-acr-repository-show-tags]:

```azurecli
az acr repository show-tags \
  --name mycontainerregistry \
  --repository helloworld-node --output table
```

Output:

```console
Result
--------
basetask
```

To view the run log, see steps in the [preceding section](#view-run-log).

## Next steps

 * See more template examples in the [ACR GitHub repo](https://github.com/Azure/acr/tree/master/docs/tasks/run-as-deployment).
 * For details about template properties, see the template reference for [Tasks](/azure/templates/microsoft.containerregistry/2019-06-01-preview/registries/tasks) and [Task runs](/azure/templates/microsoft.containerregistry/2019-06-01-preview/registries/taskruns).


<!-- LINKS - Internal -->
[azure-cli]: /cli/azure/install-azure-cli
[az-acr-build]: /cli/azure/acr#az-acr-build
[az-acr-task-run]: /cli/azure/acr/task#az-acr-task-run
[az-acr-task-logs]: /cli/azure/acr/task#az-acr-task-logs
[az-acr-task-list-runs]: /cli/azure/acr/task#az-acr-task-list-runs
[az-deployment-group-create]: /cli/azure/deployment/group#az-deployment-group-create
[az-identity-create]: /cli/azure/identity#az-identity-create
[az-identity-show]: /cli/azure/identity#az-identity-show