---
title: Azure Container Registry authentication with a managed identity
description: Provide access to images in your private container registry by using a system-assigned or user-assigned managed Azure identity.
services: container-registry
author: dlepow

ms.service: container-registry
ms.topic: article
ms.date: 01/09/2019
ms.author: danlep
---

# Use an Azure managed identity to authenticate to an Azure container registry 

Use a [managed identity for Azure resources](active-directory/managed-identities-azure-resources/overview.md) to authenticate to an Azure container registry from another Azure resource without needing to provide or manage registry credentials. For example, use a user-assigned or system-assigned managed identity for a Linux VM to push or pull container images from your container registry - without having to pass credentials for the registry login server.

For this article, you will set up a managed identity on a Docker-enabled Ubuntu virtual machine to access an Azure container registry. 

To create the Azure resources, this quickstart requires that you are running the Azure CLI version 2.0.27 or later. Run `az --version` to find the version. If you need to install or upgrade, see [Install Azure CLI][azure-cli].

You must also have Docker installed locally. Docker provides packages that easily configure Docker on any [macOS][docker-mac], [Windows][docker-windows], or [Linux][docker-linux] system.

## Why use a managed identity?

A managed identity for Azure resources provides Azure services with an automatically managed identity in Azure Active Directory (Azure AD). You can configure [certain Azure resources](active-directory/managed-identities-azure-resources/services-support-msi), including virtual machines, with a managed identity. You can then use the identity to access other Azure resources, without passing credentials in code or scripts.

Managed identities you set up can be of two types:

* *User-assigned identities*, which you can assign to multiple resources and that persist for as long as your want. 

* A *system-managed identity*, which is unique to a specific resource like a single virtual machine and lasts for the lifetime of that resource.

After you set up an Azure resource with a managed identity, you can give the identity access to another resource, just like any security principal. For example, assign a managed identity a role with pull, push and pull, or other permissions to a private registry in Azure. (For a complete list of registry roles, see [Azure Container Registry roles and permissions](container-registry-roles.md).) You can give the identity access to multiple resources.

Then, use the identity to authenticate to any [service that supports Azure AD authentication](../active-directory/managed-identities-azure-resources/services-support-msi.md#azure-services-that-support-azure-ad-authentication), including Azure Container Registry, without any credentials in your code. Choose how to authenticate using the managed identity, depending on your scenario. For a managed identity set up on a virtual machine, you have several options:

* [Acquire an Azure AD access token](../active-directory/managed-identities-azure-resources/how-to-use-vm-token.md) programmatically using HTTP or REST calls

* Use the [Azure SDKs](../active-directory/managed-identities-azure-resources/how-to-use-vm-sdk.md)

* [Sign into Azure CLI or PowerShell](./active-directory/managed-identities-azure-resources/how-to-use-vm-sign-in.md) with the identity. 


## Create a container registry

If you don't already have an Azure container registry, create a registry and push a sample container image to it. For steps, see [Quickstart: Create a private container registry using the Azure CLI](container-registry-get-started-azure-cli).

This article assumes you have the aci-helloworld:v1 image stored in your registry. Substitute your own image name in later steps if you want to use a different image name.

## Create a Docker-enabled virtual machine

Create a Docker-enabled Ubuntu virtual machine. You also need to install the [Azure CLI](/cli/azure/install-azure-cli?view=azure-cli-latest)  on the virtual machine. If you already have an Azure virtual machine, skip this step to create the virtual machine.

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

Follow the steps in [Install Azure CLI with apt](/cli/azure/install-azure-cli-apt?view=azure-cli-latest) to install the Azure CLI on your virtual machine. 

Exit the SSH session.

## Example 1: Use a user-assigned identity to access a container registry


## Example 2: Use a system-assigned identity to access a container registry


## Next steps

<!-- LINKS - external -->
[docker-linux]: https://docs.docker.com/engine/installation/#supported-platforms
[docker-login]: https://docs.docker.com/engine/reference/commandline/login/
[docker-mac]: https://docs.docker.com/docker-for-mac/
[docker-push]: https://docs.docker.com/engine/reference/commandline/push/
[docker-tag]: https://docs.docker.com/engine/reference/commandline/tag/
[docker-windows]: https://docs.docker.com/docker-for-windows/

<!-- LINKS - Internal -->
[az-vm-create]: /cli/azure/vm#az-vm-create
[az-acr-login]: /cli/azure/acr#az-acr-login