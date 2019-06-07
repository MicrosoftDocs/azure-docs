---
title: Use a managed identity with Azure Container Registry Tasks
description: Provide an Azure Container Registry task access to Azure resources including other private container registries by assigning a managed identity for Azure Resources.
services: container-registry
author: dlepow

ms.service: container-registry
ms.topic: article
ms.date: 06/07/2019
ms.author: danlep
---

# Use an Azure managed identity in ACR Tasks 

Use a [managed identity for Azure resources](../active-directory/managed-identities-azure-resources/overview.md) to authenticate from ACR Tasks to an Azure container registry or other Azure resources, without needing to provide or manage credentials in code. For example ...

For this article, you learn more about managed identities and how to:

> [!div class="checklist"]
> * Enable a system-assigned identity on an ACR task
> * Grant the identity access to two Azure container registries
> * Use the managed identity to access the registries from a task and push a container image 

To create the Azure resources, this article requires that you run the Azure CLI version 2.0.66 or later. Run `az --version` to find the version. If you need to install or upgrade, see [Install Azure CLI][azure-cli].

## Why use a managed identity?

A managed identity for Azure resources provides Azure services with an automatically managed identity in Azure Active Directory (Azure AD). You can configure [certain Azure resources](../active-directory/managed-identities-azure-resources/services-support-managed-identities.md), including ACR Tasks, with a managed identity. Then, use the identity to access other Azure resources, without passing credentials in code or scripts.

Managed identities are of two types:

* *User-assigned identities*, which you can assign to multiple resources and persist for as long as your want. User-assigned identities are currently in preview.

* A *system-managed identity*, which is unique to a specific resource such as an ACR task and lasts for the lifetime of that resource.

After you set up an Azure resource with a managed identity, give the identity the access you want to another resource, just like any security principal. For example, assign a managed identity a role with pull, push and pull, or other permissions to a private registry in Azure. (For a complete list of registry roles, see [Azure Container Registry roles and permissions](container-registry-roles.md).) You can give an identity access to one or more resources.

## Create container registries

For this tutorial you need three container registries. You use the first registry to create and execute an ACR task. The second and third registries are target registries where the task pushes an image it builds. If you don't already have the needed Azure container registries, see [Quickstart: Create a private container registry using the Azure CLI](container-registry-get-started-azure-cli.md). You don't need to push images to the registry yet.

This article assumes that the registry where you run the task is called *myregistry*, and the task pushes images to *customregistry1* and *customregistry2*. Replace with your own registry names in later steps.

<!-----

## Example 1: Access with a user-assigned identity

### Create an identity

Create an identity in your subscription using the [az identity create](/cli/azure/identity?view=azure-cli-latest#az-identity-create) command. You can use the same resource group you used previously to create the container registry or virtual machine, or a different one.

```azurecli-interactive
az identity create --resource-group myResourceGroup --name myACRId
```

To configure the identity in the following steps, use the [az identity show][az-identity-show] command to store the identity's resource ID and service principal ID in variables.

```azurecli
# Get resource ID of the user-assigned identity
userID=$(az identity show --resource-group myResourceGroup --name myACRId --query id --output tsv)

# Get service principal ID of the user-assigned identity
spID=$(az identity show --resource-group myResourceGroup --name myACRId --query principalId --output tsv)
```

Because you need the identity's ID in a later step when you sign in to the CLI from your virtual machine, show the value:

```bash
echo $userID
```

The ID is of the form:

```
/subscriptions/xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxxx/resourcegroups/myResourceGroup/providers/Microsoft.ManagedIdentity/userAssignedIdentities/myACRId
```

### Configure the VM with the identity

The following [az vm identity assign][az-vm-identity-assign] command configures your Docker VM with the user-assigned identity:

```azurecli
az vm identity assign --resource-group myResourceGroup --name myDockerVM --identities $userID
```

### Grant identity access to the container registry

Now configure the identity to access your container registry. First use the [az acr show][az-acr-show] command to get the resource ID of the registry:

```azurecli
resourceID=$(az acr show --resource-group myResourceGroup --name myContainerRegistry --query id --output tsv)
```

Use the [az role assignment create][az-role-assignment-create] command to assign the AcrPull role to the registry. This role provides [pull permissions](container-registry-roles.md) to the registry. To provide both pull and push permissions, assign the ACRPush role.

```azurecli
az role assignment create --assignee $spID --scope $resourceID --role acrpull
```

### Use the identity to access the registry

SSH into the Docker virtual machine that's configured with the identity. Run the following Azure CLI commands, using the Azure CLI installed on the VM.

First, authenticate to the Azure CLI with [az login][az-login], using the identity you configured on the VM. For `<userID>`, substitute the ID of the identity you retrieved in a previous step. 

```azurecli
az login --identity --username <userID>
```

Then, authenticate to the registry with [az acr login][az-acr-login]. When you use this command, the CLI uses the Active Directory token created when you ran `az login` to seamlessly authenticate your session with the container registry. (Depending on your VM's setup, you might need to run this command and docker commands with `sudo`.)

```azurecli
az acr login --name myContainerRegistry
```

You should see a `Login succeeded` message. You can then run `docker` commands without providing credentials. For example, run [docker pull][docker-pull] to pull the `aci-helloworld:v1` image, specifying the login server name of your registry. The login server name consists of your container registry name (all lowercase) followed by `.azurecr.io` - for example, `mycontainerregistry.azurecr.io`.

```
docker pull mycontainerregistry.azurecr.io/aci-helloworld:v1
```
---->

## Example: Task with a system-assigned identity

This example shows you how to create a [multi-step task](container-registry-tasks-multi-step.md) with a system-assigned identity. The task builds an image, and then uses the identity to authenticate with two target registries to push the image.

The task steps for this example are defined in the [YAML file](container-registry-tasks-reference-yaml.md) `testtask.yaml`. The file is located in the multipleRegistries directory of the [acr-tasks](https://github.com/Azure-Samples/acr-tasks) samples repo.

```yml
version: v1.0.0
steps:
  - build: -t {{.Values.REGISTRY1}}/hello-world:{{.Run.ID}} . -f hello-world.dockerfile
  - push: ["{{.Values.REGISTRY1}}/hello-world:{{.Run.ID}}"]
  - build: -t {{.Values.REGISTRY2}}/hello-world:{{.Run.ID}} . -f hello-world.dockerfile
  - push: ["{{.Values.REGISTRY2}}/hello-world:{{.Run.ID}}"]
```

### Create task with system-assigned identity

Create the task *multiple-reg* by executing the following [az acr task create][az-acr-task-create] command. The task context is the multipleRegistries folder of the samples repo, and task steps are defined in `testtask.yaml` there. The `--assign-identity` parameter with no additional value creates a system-assigned identity for the task. For example purposes, this task can only be triggered manually, but you could enable the task to run when commits are pushed to the registry or a base image is updated 

```azurecli
az acr task create \
  --registry myregistry \
  --name multiple-reg \
  --context https://github.com/Azure-Samples/acr-tasks.git#:multipleRegistries \
  --file testtask.yaml \
  --commit-trigger-enabled false \
  --pull-request-trigger-enabled false \
  --assign-identity
```

Notice that the `identity` section in the output shows the identity of type `SystemAssigned` is set in the task. The `principalID` is the service principal of the identity:

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

Use the [az acr task show][az-acr-task-show] command to store the `principalId` of the identity in a variable, to use in later commands: :

```azurecli
principal_id=$(az acr task show --name multiple-reg --registry myregistry --query identity.principalId --output tsv)
```

### Give identity push permissions to two target container registries

For test purposes, call customregistry1.azurecr.io and customregistry2.azurecr.io.

Get resource Id of each registry. For example:

```azurecli
reg1_id=$(az acr show --name customregistry1 --query id --output tsv)
reg2_id=$(az acr show --name customregistry2 --query id --output tsv)
```

Assign `acrpush` role to each registry. For example:

```azurecli
az role assignment create --assignee $principal_id --scope $reg1_id --role acrpush
az role assignment create --assignee $principal_id --scope $reg2_id --role acrpush
```

### Add target registry credentials to task

Add credentials to task to access target registry using system-assigned identity. Note the `[system]` seems required here. (Bug?)

```azurecli
az acr task credential add --name multiple-reg --registry myregistry --login-server customregistry1.azurecr.io --use-identity [system]

az acr task credential add --name multiple-reg --registry myregistry --login-server customregistry2.azurecr.io --use-identity [system]
```

### Manually run the task

Passing in target registry names:

```azurecli
az acr task run --name multiple-reg --registry --set REGISTRY1=customregistry1.azurecr.io --set REGISTRY2=customregistry2.azurecr.io
```

Output is similar to:

```console
Queued a run with ID: cf31
Waiting for an agent...
2019/05/31 22:15:50 Downloading source code...
2019/05/31 22:15:52 Finished downloading source code
2019/05/31 22:15:52 Using acb_vol_b2c7f60e-6b7c-4e71-9475-a37731f4abf5 as the home volume
2019/05/31 22:15:54 Creating Docker network: acb_default_network, driver: 'bridge'
2019/05/31 22:15:55 Successfully set up Docker network: acb_default_network
2019/05/31 22:15:55 Setting up Docker configuration...
2019/05/31 22:15:55 Successfully set up Docker configuration
2019/05/31 22:15:55 Logging in to registry: danlep0531.azurecr.io
2019/05/31 22:15:57 Successfully logged into danlep0531.azurecr.io
2019/05/31 22:15:57 Logging in to registry: danlep0501.azurecr.io
2019/05/31 22:15:58 Successfully logged into danlep0501.azurecr.io
2019/05/31 22:15:58 Logging in to registry: danlep0531b.azurecr.io
2019/05/31 22:16:00 Successfully logged into danlep0531b.azurecr.io
2019/05/31 22:16:00 Executing step ID: acb_step_0. Timeout(sec): 600, Working directory: 'multipleRegistries', Network: 'acb_default_network'
2019/05/31 22:16:00 Scanning for dependencies...
2019/05/31 22:16:01 Successfully scanned dependencies
2019/05/31 22:16:01 Launching container with name: acb_step_0
Sending build context to Docker daemon  4.096kB
Step 1/1 : FROM hello-world
 ---> fce289e99eb9
Successfully built fce289e99eb9
Successfully tagged danlep0531b.azurecr.io/hello-world:cf31
2019/05/31 22:16:02 Successfully executed container: acb_step_0
2019/05/31 22:16:02 Executing step ID: acb_step_1. Timeout(sec): 600, Working directory: 'multipleRegistries', Network: 'acb_default_network'
2019/05/31 22:16:02 Pushing image: danlep0531b.azurecr.io/hello-world:cf31, attempt 1
The push refers to repository [danlep0531b.azurecr.io/hello-world]
af0b15c8625b: Preparing
af0b15c8625b: Pushed
cf31: digest: sha256:92c7f9c92844bbbb5d0a101b22f7c2a7949e40f8ea90c8b3bc396879d95e899a size: 524
2019/05/31 22:16:08 Successfully pushed image: danlep0531b.azurecr.io/hello-world:cf31
2019/05/31 22:16:08 Executing step ID: acb_step_2. Timeout(sec): 600, Working directory: 'multipleRegistries', Network: 'acb_default_network'
2019/05/31 22:16:08 Scanning for dependencies...
2019/05/31 22:16:08 Successfully scanned dependencies
2019/05/31 22:16:08 Launching container with name: acb_step_2
Sending build context to Docker daemon  4.096kB
Step 1/1 : FROM hello-world
 ---> fce289e99eb9
Successfully built fce289e99eb9
Successfully tagged danlep0531.azurecr.io/hello-world:cf31
2019/05/31 22:16:09 Successfully executed container: acb_step_2
2019/05/31 22:16:09 Executing step ID: acb_step_3. Timeout(sec): 600, Working directory: 'multipleRegistries', Network: 'acb_default_network'
2019/05/31 22:16:09 Pushing image: danlep0531.azurecr.io/hello-world:cf31, attempt 1
The push refers to repository [danlep0531.azurecr.io/hello-world]
af0b15c8625b: Preparing
af0b15c8625b: Pushed
cf31: digest: sha256:92c7f9c92844bbbb5d0a101b22f7c2a7949e40f8ea90c8b3bc396879d95e899a size: 524
2019/05/31 22:16:21 Successfully pushed image: danlep0531.azurecr.io/hello-world:cf31
2019/05/31 22:16:21 Step ID: acb_step_0 marked as successful (elapsed time in seconds: 1.985291)
2019/05/31 22:16:21 Populating digests for step ID: acb_step_0...
2019/05/31 22:16:22 Successfully populated digests for step ID: acb_step_0
2019/05/31 22:16:22 Step ID: acb_step_1 marked as successful (elapsed time in seconds: 5.743225)
2019/05/31 22:16:22 Step ID: acb_step_2 marked as successful (elapsed time in seconds: 1.925959)
2019/05/31 22:16:22 Populating digests for step ID: acb_step_2...
2019/05/31 22:16:24 Successfully populated digests for step ID: acb_step_2
2019/05/31 22:16:24 Step ID: acb_step_3 marked as successful (elapsed time in seconds: 11.061057)
2019/05/31 22:16:24 The following dependencies were found:
2019/05/31 22:16:24
- image:
    registry: danlep0531b.azurecr.io
    repository: hello-world
    tag: cf31
    digest: sha256:92c7f9c92844bbbb5d0a101b22f7c2a7949e40f8ea90c8b3bc396879d95e899a
  runtime-dependency:
    registry: registry.hub.docker.com
    repository: library/hello-world
    tag: latest
    digest: sha256:6f744a2005b12a704d2608d8070a494ad1145636eeb74a570c56b94d94ccdbfc
  git:
    git-head-revision: 05275dca2bc61f584085ca913c39d509236f576b
- image:
    registry: danlep0531.azurecr.io
    repository: hello-world
    tag: cf31
    digest: sha256:92c7f9c92844bbbb5d0a101b22f7c2a7949e40f8ea90c8b3bc396879d95e899a
  runtime-dependency:
    registry: registry.hub.docker.com
    repository: library/hello-world
    tag: latest
    digest: sha256:6f744a2005b12a704d2608d8070a494ad1145636eeb74a570c56b94d94ccdbfc
  git:
    git-head-revision: 05275dca2bc61f584085ca913c39d509236f576b

Run ID: cf31 was successful after 35s
```




## Next steps

In this article, you learned about using managed identities with Azure Container Registry Tasks and how to:

> [!div class="checklist"]
> * Enable a system-assigned identity on an ACR task
> * Grant the identity access to two Azure container registries
> * Use the managed identity to access the registries from a task and push a container image 

* Learn more about [managed identities for Azure resources](/azure/active-directory/managed-identities-azure-resources/).

<!-- LINKS - Internal -->
[az-login]: /cli/azure/reference-index#az-login
[az-acr-login]: /cli/azure/acr#az-acr-login
[az-acr-show]: /cli/azure/acr#az-acr-show
[az-role-assignment-create]: /cli/azure/role/assignment#az-role-assignment-create
[az-acr-login]: /cli/azure/acr#az-acr-login
[az-identity-show]: /cli/azure/identity#az-identity-show
[azure-cli]: /cli/azure/install-azure-cli
[az-acr-task-create]: /cli/azure/acr/task#az-acr-task-create
[az-acr-task-show]: /cli/azure/acr/task#az-acr-task-show
[az-acr-task-run]: /cli/azure/acr/task#az-acr-task-run
[az-acr-task-list-runs]: /cli/azure/acr/task#az-acr-task-list-runs
[az-acr-task-credential-add]: /cli/azure/acr/task/credential#az-acr-task-credential-add    
