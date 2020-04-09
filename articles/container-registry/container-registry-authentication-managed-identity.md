---
title: Authenticate with managed identity
description: Provide access to images in your private container registry by using a user-assigned or system-assigned managed Azure identity.
ms.topic: article
ms.date: 01/16/2019
---

# Use an Azure managed identity to authenticate to an Azure container registry 

Use a [managed identity for Azure resources](../active-directory/managed-identities-azure-resources/overview.md) to authenticate to an Azure container registry from another Azure resource, without needing to provide or manage registry credentials. For example, set up a user-assigned or system-assigned managed identity on a Linux VM to access container images from your container registry, as easily as you use a public registry.

For this article, you learn more about managed identities and how to:

> [!div class="checklist"]
> * Enable a user-assigned or system-assigned identity on an Azure VM
> * Grant the identity access to an Azure container registry
> * Use the managed identity to access the registry and pull a container image 

To create the Azure resources, this article requires that you run the Azure CLI version 2.0.55 or later. Run `az --version` to find the version. If you need to install or upgrade, see [Install Azure CLI][azure-cli].

To set up a container registry and push a container image to it, you must also have Docker installed locally. Docker provides packages that easily configure Docker on any [macOS][docker-mac], [Windows][docker-windows], or [Linux][docker-linux] system.

## Why use a managed identity?

A managed identity for Azure resources provides Azure services with an automatically managed identity in Azure Active Directory (Azure AD). You can configure [certain Azure resources](../active-directory/managed-identities-azure-resources/services-support-managed-identities.md), including virtual machines, with a managed identity. Then, use the identity to access other Azure resources, without passing credentials in code or scripts.

Managed identities are of two types:

* *User-assigned identities*, which you can assign to multiple resources and persist for as long as your want. User-assigned identities are currently in preview.

* A *system-managed identity*, which is unique to a specific resource like a single virtual machine and lasts for the lifetime of that resource.

After you set up an Azure resource with a managed identity, give the identity the access you want to another resource, just like any security principal. For example, assign a managed identity a role with pull, push and pull, or other permissions to a private registry in Azure. (For a complete list of registry roles, see [Azure Container Registry roles and permissions](container-registry-roles.md).) You can give an identity access to one or more resources.

Then, use the identity to authenticate to any [service that supports Azure AD authentication](../active-directory/managed-identities-azure-resources/services-support-managed-identities.md#azure-services-that-support-azure-ad-authentication), without any credentials in your code. To use the identity to access an Azure container registry from a virtual machine, you authenticate with Azure Resource Manager. Choose how to authenticate using the managed identity, depending on your scenario:

* [Acquire an Azure AD access token](../active-directory/managed-identities-azure-resources/how-to-use-vm-token.md) programmatically using HTTP or REST calls

* Use the [Azure SDKs](../active-directory/managed-identities-azure-resources/how-to-use-vm-sdk.md)

* [Sign into Azure CLI or PowerShell](../active-directory/managed-identities-azure-resources/how-to-use-vm-sign-in.md) with the identity. 

## Create a container registry

If you don't already have an Azure container registry, create a registry and push a sample container image to it. For steps, see [Quickstart: Create a private container registry using the Azure CLI](container-registry-get-started-azure-cli.md).

This article assumes you have the `aci-helloworld:v1` container image stored in your registry. The examples use a registry name of *myContainerRegistry*. Replace with your own registry and image names in later steps.

## Create a Docker-enabled VM

Create a Docker-enabled Ubuntu virtual machine. You also need to install the [Azure CLI](/cli/azure/install-azure-cli?view=azure-cli-latest) on the virtual machine. If you already have an Azure virtual machine, skip this step to create the virtual machine.

Deploy a default Ubuntu Azure virtual machine with [az vm create][az-vm-create]. The following example creates a VM named *myDockerVM* in an existing resource group named *myResourceGroup*:

```azurecli
az vm create \
    --resource-group myResourceGroup \
    --name myDockerVM \
    --image UbuntuLTS \
    --admin-username azureuser \
    --generate-ssh-keys
```

It takes a few minutes for the VM to be created. When the command completes, take note of the `publicIpAddress` displayed by the Azure CLI. Use this address to make SSH connections to the VM.

### Install Docker on the VM

After the VM is running, make an SSH connection to the VM. Replace *publicIpAddress* with the public IP address of your VM.

```bash
ssh azureuser@publicIpAddress
```

Run the following command to install Docker on the VM:

```bash
sudo apt install docker.io -y
```

After installation, run the following command to verify that Docker is running properly on the VM:

```bash
sudo docker run -it hello-world
```

Output:

```
Hello from Docker!
This message shows that your installation appears to be working correctly.
[...]
```

### Install the Azure CLI

Follow the steps in [Install Azure CLI with apt](/cli/azure/install-azure-cli-apt?view=azure-cli-latest) to install the Azure CLI on your Ubuntu virtual machine. For this article, ensure that you install version 2.0.55 or later.

Exit the SSH session.

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

## Example 2: Access with a system-assigned identity

### Configure the VM with a system-managed identity

The following [az vm identity assign][az-vm-identity-assign] command configures your Docker VM with a system-assigned identity:

```azurecli
az vm identity assign --resource-group myResourceGroup --name myDockerVM 
```

Use the [az vm show][az-vm-show] command to set a variable to the value of `principalId` (the service principal ID) of the VM's identity, to use in later steps.

```azurecli-interactive
spID=$(az vm show --resource-group myResourceGroup --name myDockerVM --query identity.principalId --out tsv)
```

### Grant identity access to the container registry

Now configure the identity to access your container registry. First use the [az acr show][az-acr-show] command to get the resource ID of the registry:

```azurecli
resourceID=$(az acr show --resource-group myResourceGroup --name myContainerRegistry --query id --output tsv)
```

Use the [az role assignment create][az-role-assignment-create] command to assign the AcrPull role to the identity. This role provides [pull permissions](container-registry-roles.md) to the registry. To provide both pull and push permissions, assign the ACRPush role.

```azurecli
az role assignment create --assignee $spID --scope $resourceID --role acrpull
```

### Use the identity to access the registry

SSH into the Docker virtual machine that's configured with the identity. Run the following Azure CLI commands, using the Azure CLI installed on the VM.

First, authenticate the Azure CLI with [az login][az-login], using the system-assigned identity on the VM.

```azurecli
az login --identity
```

Then, authenticate to the registry with [az acr login][az-acr-login]. When you use this command, the CLI uses the Active Directory token created when you ran `az login` to seamlessly authenticate your session with the container registry. (Depending on your VM's setup, you might need to run this command and docker commands with `sudo`.)

```azurecli
az acr login --name myContainerRegistry
```

You should see a `Login succeeded` message. You can then run `docker` commands without providing credentials. For example, run [docker pull][docker-pull] to pull the `aci-helloworld:v1` image, specifying the login server name of your registry. The login server name consists of your container registry name (all lowercase) followed by `.azurecr.io` - for example, `mycontainerregistry.azurecr.io`.

```
docker pull mycontainerregistry.azurecr.io/aci-helloworld:v1
```

## Next steps

In this article, you learned about using managed identities with Azure Container Registry and how to:

> [!div class="checklist"]
> * Enable a user-assigned or system-assigned identity in an Azure VM
> * Grant the identity access to an Azure container registry
> * Use the managed identity to access the registry and pull a container image

* Learn more about [managed identities for Azure resources](/azure/active-directory/managed-identities-azure-resources/).


<!-- LINKS - external -->
[docker-linux]: https://docs.docker.com/engine/installation/#supported-platforms
[docker-login]: https://docs.docker.com/engine/reference/commandline/login/
[docker-mac]: https://docs.docker.com/docker-for-mac/
[docker-pull]: https://docs.docker.com/engine/reference/commandline/pull/
[docker-windows]: https://docs.docker.com/docker-for-windows/

<!-- LINKS - Internal -->
[az-login]: /cli/azure/reference-index#az-login
[az-acr-login]: /cli/azure/acr#az-acr-login
[az-acr-show]: /cli/azure/acr#az-acr-show
[az-vm-create]: /cli/azure/vm#az-vm-create
[az-vm-show]: /cli/azure/vm#az-vm-show
[az-vm-identity-assign]: /cli/azure/vm/identity#az-vm-identity-assign
[az-role-assignment-create]: /cli/azure/role/assignment#az-role-assignment-create
[az-acr-login]: /cli/azure/acr#az-acr-login
[az-identity-show]: /cli/azure/identity#az-identity-show
[azure-cli]: /cli/azure/install-azure-cli
