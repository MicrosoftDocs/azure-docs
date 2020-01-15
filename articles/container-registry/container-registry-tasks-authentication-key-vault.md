---
title: External authentication from ACR task
description: Configure an Azure Container Registry Task (ACR Task) to read Docker Hub credentials stored in an Azure key vault, by using a managed identity for Azure resources.
ms.topic: article
ms.date: 01/14/2020
---

# External authentication in an ACR task using an Azure-managed identity 

In an [ACR task](container-registry-tasks-overview.md), you can [enable a managed identity for Azure resources](container-registry-tasks-authentication-managed-identity.md). The task can use the identity to access other Azure resources, without needing to provide or manage credentials. 

In this article, you learn how to enable a managed identity in a task that accesses secrets stored in an Azure key vault. 

To create the Azure resources, this article requires that you run the Azure CLI version 2.0.68 or later. Run `az --version` to find the version. If you need to install or upgrade, see [Install Azure CLI][azure-cli].

## Scenario overview

The example task reads Docker Hub credentials stored in an Azure key vault. The credentials are for a Docker Hub account with write (push) permissions to a private Docker Hub repository. To read the credentials, you configure the task with a managed identity and assign appropriate permissions to it. The task associated with the identity builds an image, and signs into Docker Hub to push the image to the private repo. 

This example shows steps using either a user-assigned or system-assigned managed identity. Your choice of identity depends on your organization's needs.

In a real-world scenario, a company might publish images to a private repo in Docker Hub as part of a build process. 

## Prerequisites

You need an Azure container registry in which you run the task. In this article, this registry is named *myregistry*. Replace with your own registry name in later steps.

If you don't already have an Azure container registry, see [Quickstart: Create a private container registry using the Azure CLI](container-registry-get-started-azure-cli.md). You don't need to push images to the registry yet.

You also need a private repository in Docker Hub, and a Docker Hub account with permissions to write to the repo. In this example, this repo is named *hubuser/hubrepo*. 

## Create a key vault and store secrets

First, if you need to, create a resource group named *myResourceGroup* in the *eastus* location with the following [az group create][az-group-create] command:

```azurecli-interactive
az group create --name myResourceGroup --location eastus
```

Use the [az keyvault create][az-keyvault-create] command to create a key vault. Be sure to specify a unique key vault name. 

```azurecli-interactive
az keyvault create --name mykeyvault --resource-group myResourceGroup --location eastus
```

Store the required Docker Hub credentials in the key vault using the [az keyvault secret set][az-keyvault-secret-set] command. In these commands, the values are passed in environment variables:

```azurecli
# Store Docker Hub user name
az keyvault secret set \
  --name UserName \
  --value $USERNAME \
  --vault-name mykeyvault

# Store Docker Hub password
az keyvault secret set \
  --name Password \
  --value $PASSWORD \
  --vault-name mykeyvault
```

In a real-world scenario, secrets would likely be set and maintained in a separate process.

## Define task steps in YAML file

The steps for this example task are defined in a [YAML file](container-registry-tasks-reference-yaml.md). Create a file named `dockerhubtask.yaml` in a local working directory and paste the following contents. Be sure to replace the `hubuser/hubrepo` alias with the name of your private repo in Docker Hub.

```yml
version: v1.1.0
# Replace hubuser/hubrepo with name of private repo in Docker Hub
alias: 
  values:
    REPO: hubuser/hubrepo
steps:
# Build image
  - build: -t $REPO:$ID https://github.com/Azure-Samples/acr-tasks.git -f hello-world.dockerfile
# Push image to private repo in Docker Hub
  - push:
    - $REPO:$ID
```

The task steps do the following:
* Build an image using a sample Dockerfile in the [Azure-Samples/acr-tasks](https://github.com/Azure-Samples/acr-tasks.git) repo.
* Tag the image for a private Docker Hub repository
* Push the image to the Docker Hub repository.

## Option 1: Create task with user-assigned identity

The steps in this section create a task and enable a user-assigned identity. If you want to enable a system-assigned identity instead, see [Option 2: Create task with system-assigned identity](#option-2-create-task-with-system-assigned-identity). 

[!INCLUDE [container-registry-tasks-user-assigned-id](../../includes/container-registry-tasks-user-assigned-id.md)]

### Create task

Create the task *dockerhubtask* by executing the following [az acr task create][az-acr-task-create] command. The task runs without a source code context, and the command references the file `dockerhubtask.yaml` in the working directory. The `--assign-identity` parameter passes the resource ID of the user-assigned identity. 

```azurecli
az acr task create \
  --name dockerhubtask \
  --registry myregistry \
  --context /dev/null \
  --file dockerhubtask.yaml \
  --assign-identity $resourceID
```

[!INCLUDE [container-registry-tasks-user-id-properties](../../includes/container-registry-tasks-user-id-properties.md)]

## Option 2: Create task with system-assigned identity

The steps in this section create a task and enable a system-assigned identity. If you want to enable a user-assigned identity instead, see [Option 1: Create task with user-assigned identity](#option-1-create-task-with-user-assigned-identity). 

### Create task

Create the task *dockerhubtask* by executing the following [az acr task create][az-acr-task-create] command. The task runs without a source code context, and the command references the file `dockerhubtask.yaml` in the working directory. The `--assign-identity` parameter with no value enables the system-assigned identity on the task.  

```azurecli
az acr task create \
  --name dockerhubtask \
  --registry myregistry \
  --context /dev/null \
  --file dockerhubtask.yaml \
  --assign-identity 
```

[!INCLUDE [container-registry-tasks-system-id-properties](../../includes/container-registry-tasks-system-id-properties.md)]

## Grant identity access to key vault

Run the following [az keyvault set-policy][az-keyvault-set-policy] command to set an access policy on the key vault. The following example allows the identity to read secrets from the key vault. 

```azurecli
az keyvault set-policy --name mykeyvault --resource-group myResourceGroup --object-id $principalID --secret-permissions get
```

## Add Docker Hub credentials to the task

Now use the [az acr task credential add][az-acr-task-credential-add] command to enable the task to authenticate with Docker Hub using the credentials accessed from the key vault. The managed identity has access to the credentials in the vault.

Run the command corresponding to the type of managed identity you enabled in the task. If you enabled a user-assigned identity, pass `--use-identity` with the client ID of the identity. If you enabled a system-assigned identity, pass `--use-identity [system]`.

```azurecli
# Add credentials to task accessed with user-assigned identity
az acr task credential add \
  --name dockerhubtask \
  --registry myregistry \
  --login-server docker.io \
  --username https://mykeyvault.vault.azure.net/secrets/UserName \
  --password  https://mykeyvault.vault.azure.net/secrets/Password \
  --use-identity $clientID

# Add credentials to task accessed with system-assigned identity
az acr task credential add \
  --name dockerhubtask \
  --registry myregistry \
  --login-server docker.io \
  --username https://mykeyvault.vault.azure.net/secrets/UserName \
  --password  https://mykeyvault.vault.azure.net/secrets/Password \
  --use-identity [system]
```

## Manually run the task

To verify that the task in which you enabled a managed identity runs successfully, manually trigger the task with the [az acr task run][az-acr-task-run] command.

```azurecli
az acr task run --name dockerhubtask --registry myregistry 
```

When the task runs successfully, output shows successful authentication to Docker Hub, and the image is successfully built and pushed to the private repo:

```console
Queued a run with ID: cfr
Waiting for an agent...
2020/01/15 22:01:45 Alias support enabled for version >= 1.1.0, please see https://aka.ms/acr/tasks/task-aliases for more information.
2020/01/15 22:01:47 Creating Docker network: acb_default_network, driver: 'bridge'
2020/01/15 22:01:47 Successfully set up Docker network: acb_default_network
2020/01/15 22:01:47 Setting up Docker configuration...
2020/01/15 22:01:48 Successfully set up Docker configuration
2020/01/15 22:01:48 Logging in to registry: myregistry.azurecr.io
2020/01/15 22:01:49 Successfully logged into myregistry.azurecr.io
2020/01/15 22:01:49 Logging in to registry: docker.io
2020/01/15 22:01:51 Successfully logged into docker.io
2020/01/15 22:01:51 Executing step ID: acb_step_0. Timeout(sec): 600, Working directory: '', Network: 'acb_default_network'
2020/01/15 22:01:51 Scanning for dependencies...
2020/01/15 22:01:52 Successfully scanned dependencies
2020/01/15 22:01:52 Launching container with name: acb_step_0
[...]
Sending build context to Docker daemon  157.2kB
Step 1/1 : FROM hello-world
 ---> fce289e99eb9
Successfully built fce289e99eb9
Successfully tagged myrepo/hello-world:cfr
2020/01/15 22:01:54 Successfully executed container: acb_step_0
2020/01/15 22:01:54 Executing step ID: acb_step_1. Timeout(sec): 600, Working directory: '', Network: 'acb_default_network'
2020/01/15 22:01:54 Pushing image: myrepo/hello-world:cfr, attempt 1
The push refers to repository [docker.io/myrepo/hello-world]
af0b15c8625b: Preparing
af0b15c8625b: Layer already exists
cfr: digest: sha256:92c7f9c92844bbbb5d0a101b22f7c2a7949e40f8ea90c8b3bc396879d95e899a size: 524
2020/01/15 22:01:56 Successfully pushed image: myrepo/hello-world:cfr
2020/01/15 22:01:56 Step ID: acb_step_0 marked as successful (elapsed time in seconds: 2.890404)
2020/01/15 22:01:56 Populating digests for step ID: acb_step_0...
2020/01/15 22:01:59 Successfully populated digests for step ID: acb_step_0
2020/01/15 22:01:59 Step ID: acb_step_1 marked as successful (elapsed time in seconds: 2.852518)
2020/01/15 22:01:59 The following dependencies were found:
2020/01/15 22:01:59 
- image:
    registry: registry.hub.docker.com
    repository: myrepo/hello-world
    tag: cfr
    digest: sha256:92c7f9c92844bbbb5d0a101b22f7c2a7949e40f8ea90c8b3bc396879d95e899a
  runtime-dependency:
    registry: registry.hub.docker.com
    repository: library/hello-world
    tag: latest
    digest: sha256:4df8ca8a7e309c256d60d7971ea14c27672fc0d10c5f303856d7bc48f8cc17ff
  git:
    git-head-revision: d6a675eb39338cb3632fab648e11b8e9a9a943cb


Run ID: cfr was successful after 22s
```

To confirm the image is pushed, check for the tag (`cf24` in this example) in the private Docker Hub repo.

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
