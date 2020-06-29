---
title: Quick task run with template
description: Queue an ACR task run to build an image using an Azure Resource Manager template
ms.topic: article
ms.date: 04/22/2020
---

# Run ACR Tasks using Resource Manager templates

[ACR Tasks](container-registry-tasks-overview.md) is a suite of features within Azure Container Registry to help you manage and modify container images across the container lifecycle. 

This article shows Azure Resource Manager template examples to queue a quick task run, similar to one you can create manually using the [az acr build][az-acr-build] command.

A Resource Manager template to queue a task run is useful in automation scenarios and extends the functionality of `az acr build`. For example:

* Use a template to create a container registry and immediately queue a task run to build and push a container image
* Create or enable additional resources you can use in a quick task run, such as a managed identity for Azure resources

## Limitations

* You must specify a remote context such as a GitHub repo as the [source location](container-registry-tasks-overview.md#context-locations) for your task run. You can't use a local source context.
* For task runs using a managed identity, only a *user-assigned* managed identity is permitted.

## Prerequisites

* **GitHub account** - Create an account on https://github.com if you don't already have one. 
* **Fork sample repository** - For the task examples shown here, use the GitHub UI to fork the following sample repository into your GitHub account: https://github.com/Azure-Samples/acr-build-helloworld-node. This repo contains sample Dockerfiles and source code to build small container images.

## Example: Create registry and queue task run

This example uses a [sample template](https://github.com/Azure/acr/tree/master/docs/tasks/run-as-deployment/quickdockerbuild) to create a container registry and queue a task run that builds and pushes an image. 

### Template parameters

For this example, provide values for the following template parameters:

|Parameter  |Value  |
|---------|---------|
|registryName     |Unique name of registry that's created         |
|repository     |Target repository for build task        |
|taskRunName     |Name of task run, which specifies image tag |
|sourceLocation     |Remote context for the build task, for example, https://github.com/Azure-Samples/acr-build-helloworld-node. The Dockerfile in the repo root builds a container image for a small Node.js web app. If desired, use your fork of the repo as the build context.         |

### Deploy the template

Deploy the template with the [az deployment group create][az-deployment-group-create] command. This example builds and pushes the *helloworld-node:testrun* image to a registry named *mycontainerregistry*.

```azurecli
az deployment group create \
  --resource-group myResourceGroup \
  --template-uri https://raw.githubusercontent.com/Azure/acr/master/docs/tasks/run-as-deployment/quickdockerbuild/azuredeploy.json \
  --parameters \
    registryName=mycontainerregistry \
    repository=helloworld-node \
    taskRunName=testrun \
    sourceLocation=https://github.com/Azure-Samples/acr-build-helloworld-node.git
 ```

The previous command passes the parameters on the command line. If desired, pass them in a [parameters file](../azure-resource-manager/templates/parameter-files.md).

### Verify deployment

After the deployment completes successfully, verify the image is built by running [az acr repository show-tags][az-acr-repository-show-tags]:

```azurecli
az acr repository show-tags \
  --name mycontainerregistry \
  --repository helloworld-node --output table
```

Output:

```console
Result
--------
testrun
```

### View run log

To view details about the task run, view the run log.

First, get the run ID with [az acr task list-runs][az-acr-task-list-runs]
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

The output shows the task run log.

You can also view the task run log in the Azure portal. 

1. Navigate to your container registry
2. Under **Services**, select **Tasks** > **Runs**.
3. Select the run ID, in this case *ca1*. 

The portal shows the task run log.

## Example: Task run with managed identity

Use a [sample template](https://github.com/Azure/acr/tree/master/docs/tasks/run-as-deployment/quickdockerbuildwithidentity) to queue a task run that enables a user-assigned managed identity. During the task run, the identity authenticates to pull an image from another Azure container registry. 

This scenario is similar to [Cross-registry authentication in an ACR task using an Azure-managed identity](container-registry-tasks-cross-registry-authentication.md). For example, an organization might maintain a centralized registry with base images accessed by multiple development teams.

### Prepare base registry

For demonstration purposes, create a separate container registry as your base registry, and push a Node.js base image pulled from Docker Hub.

1. Create a second container registry, for example *mybaseregistry*, to store base images.
1. Pull the `node:9-alpine` image from Docker Hub, tag it for your base registry, and push it to the base registry:

  ```azurecli
  docker pull node:9-alpine
  docker tag node:9-alpine mybaseregistry.azurecr.io/baseimages/node:9-alpine
  az acr login -n mybaseregistry
  docker push mybaseregistry.azurecr.io/baseimages/node:9-alpine
  ```

### Create new Dockerfile

Create a Dockerfile that pulls the base image from your base registry. Perform the following steps in your local fork of the GitHub repo, for example, `https://github.com/myGitHubID/acr-build-helloworld-node.git`.

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

Use the [az acr show][az-acr-show] command to get the resource ID of the base registry and store it in a variable:

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

### Template parameters

For this example, provide values for the following template parameters:

|Parameter  |Value  |
|---------|---------|
|registryName     |Name of registry where image is built  |
|repository     |Target repository for build task        |
|taskRunName     |Name of task run, which specifies image tag |
|userAssignedIdentity |Resource ID of user-assigned identity enabled in the task|
|customRegistryIdentity | Client ID of user-assigned identity enabled in the task, used to authenticate with custom registry |
|customRegistry |Login server name of the custom registry accessed in the task, for example, *mybaseregistry.azurecr.io*|
|sourceLocation     |Remote context for the build task, for example, *https://github.com/\<your-GitHub-ID\>/acr-build-helloworld-node.* |
|dockerFilePath | Path to the Dockerfile at the remote context, used to build the image. |

### Deploy the template

Deploy the template with the [az deployment group create][az-deployment-group-create] command. This example builds and pushes the *helloworld-node:testrun* image to a registry named *mycontainerregistry*. The base image is pulled from *mybaseregistry.azurecr.io*.

```azurecli
az deployment group create \
  --resource-group myResourceGroup \
  --template-uri https://raw.githubusercontent.com/Azure/acr/master/docs/tasks/run-as-deployment/quickdockerbuildwithidentity/azuredeploy.json \
  --parameters \
    registryName=mycontainerregistry \
    repository=helloworld-node \
    taskRunName=basetask \
    userAssignedIdentity=$resourceID \
    customRegistryIdentity=$clientID \
    sourceLocation=https://github.com/<your-GitHub-ID>/acr-build-helloworld-node.git \
    dockerFilePath=Dockerfile-test \
    customRegistry=mybaseregistry.azurecr.io
```

The previous command passes the parameters on the command line. If desired, pass them in a [parameters file](../azure-resource-manager/templates/parameter-files.md).

### Verify deployment

After the deployment completes successfully, verify the image is built by running [az acr repository show-tags][az-acr-repository-show-tags]:

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

### View run log

To view the run log, see steps in the [preceding section](#view-run-log).

## Next steps

 * See more template examples in the [ACR GitHub repo](https://github.com/Azure/acr/tree/master/docs/tasks/run-as-deployment).
 * For details about template properties, see the template reference for [Task runs](/azure/templates/microsoft.containerregistry/2019-06-01-preview/registries/taskruns) and [Tasks](/azure/templates/microsoft.containerregistry/2019-06-01-preview/registries/tasks).


<!-- LINKS - Internal -->
[azure-cli]: /cli/azure/install-azure-cli
[az-acr-build]: /cli/azure/acr#az-acr-build
[az-acr-show]: /cli/azure/acr#az-acr-show
[az-acr-task-run]: /cli/azure/acr/task#az-acr-task-run
[az-acr-task-logs]: /cli/azure/acr/task#az-acr-task-logs
[az-acr-repository-show-tags]: /cli/azure/acr/repository#az-acr-repository-show-tags
[az-acr-task-list-runs]: /cli/azure/acr/task#az-acr-task-list-runs
[az-deployment-group-create]: /cli/azure/deployment/group#az-deployment-group-create
[az-identity-create]: /cli/azure/identity#az-identity-create
[az-identity-show]: /cli/azure/identity#az-identity-show
[az-role-assignment-create]: /cli/azure/role/assignment#az-role-assignment-create
