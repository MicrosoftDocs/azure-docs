---
title: Authenticate with managed identity
description: Provide access to images in your private container registry by using a user-assigned or system-assigned managed Azure identity.
ms.topic: article
ms.custom: devx-track-azurecli, devx-track-azurepowershell, devx-track-linux
author: tejaswikolli-web
ms.author: tejaswikolli
ms.date: 10/11/2022
---

# Use an Azure managed identity to authenticate to an Azure container registry 

Use a [managed identity for Azure resources](../active-directory/managed-identities-azure-resources/overview.md) to authenticate to an Azure container registry from another Azure resource, without needing to provide or manage registry credentials. For example, set up a user-assigned or system-assigned managed identity on a Linux VM to access container images from your container registry, as easily as you use a public registry. Or, set up an Azure Kubernetes Service cluster to use its [managed identity](../aks/cluster-container-registry-integration.md) to pull container images from Azure Container Registry for pod deployments.

For this article, you learn more about managed identities and how to:

> [!div class="checklist"]
> * Enable a user-assigned or system-assigned identity on an Azure VM
> * Grant the identity access to an Azure container registry
> * Use the managed identity to access the registry and pull a container image 

### [Azure CLI](#tab/azure-cli)

To create the Azure resources, this article requires that you run the Azure CLI version 2.0.55 or later. Run `az --version` to find the version. If you need to install or upgrade, see [Install Azure CLI][azure-cli-install].

### [Azure PowerShell](#tab/azure-powershell)

To create the Azure resources, this article requires that you run the Azure PowerShell module version 7.5.0 or later. Run `Get-Module Az -ListAvailable` to find the version. If you need to install or upgrade, see [Install Azure PowerShell module][azure-powershell-install].

---

To set up a container registry and push a container image to it, you must also have Docker installed locally. Docker provides packages that easily configure Docker on any [macOS][docker-mac], [Windows][docker-windows], or [Linux][docker-linux] system.

## Why use a managed identity?

If you're not familiar with the managed identities for Azure resources feature, see this [overview](../active-directory/managed-identities-azure-resources/overview.md).

After you set up selected Azure resources with a managed identity, give the identity the access you want to another resource, just like any security principal. For example, assign a managed identity a role with pull, push and pull, or other permissions to a private registry in Azure. (For a complete list of registry roles, see [Azure Container Registry roles and permissions](container-registry-roles.md).) You can give an identity access to one or more resources.

Then, use the identity to authenticate to any [service that supports Azure AD authentication](../active-directory/managed-identities-azure-resources/services-support-managed-identities.md#azure-services-that-support-azure-ad-authentication), without any credentials in your code. Choose how to authenticate using the managed identity, depending on your scenario. To use the identity to access an Azure container registry from a virtual machine, you authenticate with Azure Resource Manager. 

## Create a container registry

### [Azure CLI](#tab/azure-cli)

If you don't already have an Azure container registry, create a registry and push a sample container image to it. For steps, see [Quickstart: Create a private container registry using the Azure CLI](container-registry-get-started-azure-cli.md).

This article assumes you have the `aci-helloworld:v1` container image stored in your registry. The examples use a registry name of *myContainerRegistry*. Replace with your own registry and image names in later steps.

### [Azure PowerShell](#tab/azure-powershell)

If you don't already have an Azure container registry, create a registry and push a sample container image to it. For steps, see [Quickstart: Create a private container registry using Azure PowerShell](container-registry-get-started-powershell.md).

This article assumes you have the `aci-helloworld:v1` container image stored in your registry. The examples use a registry name of *myContainerRegistry*. Replace with your own registry and image names in later steps.

---

## Create a Docker-enabled VM

### [Azure CLI](#tab/azure-cli)

Create a Docker-enabled Ubuntu virtual machine. You also need to install the [Azure CLI][azure-cli-install] on the virtual machine. If you already have an Azure virtual machine, skip this step to create the virtual machine.

Deploy a default Ubuntu Azure virtual machine with [az vm create][az-vm-create]. The following example creates a VM named *myDockerVM* in an existing resource group named *myResourceGroup*:

```azurecli-interactive
az vm create \
    --resource-group myResourceGroup \
    --name myDockerVM \
    --image UbuntuLTS \
    --admin-username azureuser \
    --generate-ssh-keys
```

It takes a few minutes for the VM to be created. When the command completes, take note of the `publicIpAddress` displayed by the Azure CLI. Use this address to make SSH connections to the VM.

### [Azure PowerShell](#tab/azure-powershell)

Create a Docker-enabled Ubuntu virtual machine. You also need to install the [Azure PowerShell][azure-powershell-install] on the virtual machine. If you already have an Azure virtual machine, skip this step to create the virtual machine.

Deploy a default Ubuntu Azure virtual machine with [New-AzVM][new-azvm]. The following example creates a VM named *myDockerVM* in an existing resource group named *myResourceGroup*. You will be prompted for a user name that will be used when you connect to the VM. Specify *azureuser* as the user name. You will also be asked for a password, which you can leave blank. Password login for the VM is disabled when using an SSH key.

```azurepowershell-interactive
$vmParams = @{
    ResourceGroupName   = 'MyResourceGroup'
    Name                = 'myDockerVM'
    Image               = 'UbuntuLTS'
    PublicIpAddressName = 'myPublicIP' 
    GenerateSshKey      = $true
    SshKeyName          = 'mySSHKey'
}
New-AzVM @vmParams
```

It takes a few minutes for the VM to be created. When the command completes, run the following command to get the public IP address. Use this address to make SSH connections to the VM.

```azurepowershell-interactive
Get-AzPublicIpAddress -Name myPublicIP -ResourceGroupName myResourceGroup | Select-Object -ExpandProperty IpAddress
```

---

### Install Docker on the VM

After the VM is running, make an SSH connection to the VM. Replace *publicIpAddress* with the public IP address of your VM.

```bash
ssh azureuser@publicIpAddress
```

Run the following command to install Docker on the VM:

```bash
sudo apt update
sudo apt install docker.io -y
```

After installation, run the following command to verify that Docker is running properly on the VM:

```bash
sudo docker run -it mcr.microsoft.com/hello-world
```

```output
Hello from Docker!
This message shows that your installation appears to be working correctly.
[...]
```
### [Azure CLI](#tab/azure-cli)

### Install the Azure CLI

Follow the steps in [Install Azure CLI with apt](/cli/azure/install-azure-cli-apt) to install the Azure CLI on your Ubuntu virtual machine. For this article, ensure that you install version 2.0.55 or later.

### [Azure PowerShell](#tab/azure-powershell)

### Install the Azure PowerShell

Follow the steps in [Installing PowerShell on Ubuntu][powershell-install] and [Install the Azure Az PowerShell module][azure-powershell-install] to install PowerShell and Azure PowerShell on your Ubuntu virtual machine. For this article, ensure that you install Azure PowerShell version 7.5.0 or later.

---

Exit the SSH session.

## Example 1: Access with a user-assigned identity

### Create an identity

### [Azure CLI](#tab/azure-cli)

Create an identity in your subscription using the [az identity create][az-identity-create] command. You can use the same resource group you used previously to create the container registry or virtual machine, or a different one.

```azurecli-interactive
az identity create --resource-group myResourceGroup --name myACRId
```

To configure the identity in the following steps, use the [az identity show][az-identity-show] command to store the identity's resource ID and service principal ID in variables.

```azurecli-interactive
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

```output
/subscriptions/xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxxx/resourcegroups/myResourceGroup/providers/Microsoft.ManagedIdentity/userAssignedIdentities/myACRId
```

### [Azure PowerShell](#tab/azure-powershell)

Create an identity in your subscription using the [New-AzUserAssignedIdentity][new-azuserassignedidentity] cmdlet. You can use the same resource group you used previously to create the container registry or virtual machine, or a different one.

```azurepowershell-interactive
New-AzUserAssignedIdentity -ResourceGroupName myResourceGroup -Location eastus -Name myACRId
```

To configure the identity in the following steps, use the [Get-AzUserAssignedIdentity][get-azuserassignedidentity] cmdlet to store the identity's resource ID and service principal ID in variables.

```azurepowershell-interactive
# Get resource ID of the user-assigned identity
$userID = (Get-AzUserAssignedIdentity -ResourceGroupName myResourceGroup -Name myACRId).Id

# Get service principal ID of the user-assigned identity
$spID = (Get-AzUserAssignedIdentity -ResourceGroupName myResourceGroup -Name myACRId).PrincipalId
```

Because you need the identity's ID in a later step when you sign in to the Azure PowerShell from your virtual machine, show the value:

```azurepowershell-interactive
$userID
```

The ID is of the form:

```output
/subscriptions/xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxxx/resourcegroups/myResourceGroup/providers/Microsoft.ManagedIdentity/userAssignedIdentities/myACRId
```

---

### Configure the VM with the identity

### [Azure CLI](#tab/azure-cli)

The following [az vm identity assign][az-vm-identity-assign] command configures your Docker VM with the user-assigned identity:

```azurecli-interactive
az vm identity assign --resource-group myResourceGroup --name myDockerVM --identities $userID
```

### [Azure PowerShell](#tab/azure-powershell)

The following [Update-AzVM][update-azvm] command configures your Docker VM with the user-assigned identity:

```azurepowershell-interactive
$vm = Get-AzVM -ResourceGroupName myResourceGroup -Name myDockerVM
Update-AzVM -ResourceGroupName myResourceGroup -VM $vm -IdentityType UserAssigned -IdentityID $userID
```

---

### Grant identity access to the container registry

### [Azure CLI](#tab/azure-cli)

Now configure the identity to access your container registry. First use the [az acr show][az-acr-show] command to get the resource ID of the registry:

```azurecli-interactive
resourceID=$(az acr show --resource-group myResourceGroup --name myContainerRegistry --query id --output tsv)
```

Use the [az role assignment create][az-role-assignment-create] command to assign the AcrPull role to the identity. This role provides [pull permissions](container-registry-roles.md) to the registry. To provide both pull and push permissions, assign the AcrPush role.

```azurecli-interactive
az role assignment create --assignee $spID --scope $resourceID --role acrpull
```

### [Azure PowerShell](#tab/azure-powershell)

Now configure the identity to access your container registry. First use the [Get-AzContainerRegistry][get-azcontainerregistry] command to get the resource ID of the registry:

```azurepowershell-interactive
$resourceID = (Get-AzContainerRegistry -ResourceGroupName myResourceGroup -Name myContainerRegistry).Id
```

Use the [New-AzRoleAssignment][new-azroleassignment] cmdlet to assign the AcrPull role to the identity. This role provides [pull permissions](container-registry-roles.md) to the registry. To provide both pull and push permissions, assign the AcrPush role.

```azurepowershell-interactive
New-AzRoleAssignment -ObjectId $spID -Scope $resourceID -RoleDefinitionName AcrPull
```

---

### Use the identity to access the registry

### [Azure CLI](#tab/azure-cli)

SSH into the Docker virtual machine that's configured with the identity. Run the following Azure CLI commands, using the Azure CLI installed on the VM.

First, authenticate to the Azure CLI with [az login][az-login], using the identity you configured on the VM. For `<userID>`, substitute the ID of the identity you retrieved in a previous step. 

```azurecli-interactive
az login --identity --username <userID>
```

Then, authenticate to the registry with [az acr login][az-acr-login]. When you use this command, the CLI uses the Active Directory token created when you ran `az login` to seamlessly authenticate your session with the container registry. (Depending on your VM's setup, you might need to run this command and docker commands with `sudo`.)

```azurecli-interactive
az acr login --name myContainerRegistry
```

You should see a `Login succeeded` message. You can then run `docker` commands without providing credentials. For example, run [docker pull][docker-pull] to pull the `aci-helloworld:v1` image, specifying the login server name of your registry. The login server name consists of your container registry name (all lowercase) followed by `.azurecr.io` - for example, `mycontainerregistry.azurecr.io`.

```
docker pull mycontainerregistry.azurecr.io/aci-helloworld:v1
```

### [Azure PowerShell](#tab/azure-powershell)

SSH into the Docker virtual machine that's configured with the identity. Run the following Azure PowerShell commands, using the Azure PowerShell installed on the VM.

First, authenticate to the Azure PowerShell with [Connect-AzAccount][connect-azaccount], using the identity you configured on the VM. For `-AccountId` specify a client ID of the identity. 

```azurepowershell-interactive
$clientId = (Get-AzUserAssignedIdentity -ResourceGroupName myResourceGroup -Name myACRId).ClientId
Connect-AzAccount -Identity -AccountId $clientId
```

Then, authenticate to the registry with [Connect-AzContainerRegistry][connect-azcontainerregistry]. When you use this command, the Azure PowerShell uses the Active Directory token created when you ran `Connect-AzAccount` to seamlessly authenticate your session with the container registry. (Depending on your VM's setup, you might need to run this command and docker commands with `sudo`.)

```azurepowershell-interactive
sudo pwsh -command Connect-AzContainerRegistry -Name myContainerRegistry
```

You should see a `Login succeeded` message. You can then run `docker` commands without providing credentials. For example, run [docker pull][docker-pull] to pull the `aci-helloworld:v1` image, specifying the login server name of your registry. The login server name consists of your container registry name (all lowercase) followed by `.azurecr.io` - for example, `mycontainerregistry.azurecr.io`.

```bash
docker pull mycontainerregistry.azurecr.io/aci-helloworld:v1
```

---

## Example 2: Access with a system-assigned identity

### Configure the VM with a system-managed identity

### [Azure CLI](#tab/azure-cli)

The following [az vm identity assign][az-vm-identity-assign] command configures your Docker VM with a system-assigned identity:

```azurecli-interactive
az vm identity assign --resource-group myResourceGroup --name myDockerVM 
```

Use the [az vm show][az-vm-show] command to set a variable to the value of `principalId` (the service principal ID) of the VM's identity, to use in later steps.

```azurecli-interactive
spID=$(az vm show --resource-group myResourceGroup --name myDockerVM --query identity.principalId --out tsv)
```

### [Azure PowerShell](#tab/azure-powershell)

The following [Update-AzVM][update-azvm] command configures your Docker VM with a system-assigned identity:

```azurepowershell-interactive
$vm = Get-AzVM -ResourceGroupName myResourceGroup -Name myDockerVM
Update-AzVM -ResourceGroupName myResourceGroup -VM $vm -IdentityType SystemAssigned 
```

Use the [Get-AzVM][get-azvm] command to set a variable to the value of `principalId` (the service principal ID) of the VM's identity, to use in later steps.

```azurepowershell-interactive
$spID = (Get-AzVM -ResourceGroupName myResourceGroup -Name myDockerVM).Identity.PrincipalId
```

---

### Grant identity access to the container registry

### [Azure CLI](#tab/azure-cli)

Now configure the identity to access your container registry. First use the [az acr show][az-acr-show] command to get the resource ID of the registry:

```azurecli-interactive
resourceID=$(az acr show --resource-group myResourceGroup --name myContainerRegistry --query id --output tsv)
```

Use the [az role assignment create][az-role-assignment-create] command to assign the AcrPull role to the identity. This role provides [pull permissions](container-registry-roles.md) to the registry. To provide both pull and push permissions, assign the AcrPush role.

```azurecli-interactive
az role assignment create --assignee $spID --scope $resourceID --role acrpull
```

### [Azure PowerShell](#tab/azure-powershell)

Now configure the identity to access your container registry. First use the [[Get-AzContainerRegistry][get-azcontainerregistry] command to get the resource ID of the registry:

```azurepowershell-interactive
$resourceID = (Get-AzContainerRegistry -ResourceGroupName myResourceGroup -Name myContainerRegistry).Id
```

Use the [New-AzRoleAssignment][new-azroleassignment] cmdlet to assign the AcrPull role to the identity. This role provides [pull permissions](container-registry-roles.md) to the registry. To provide both pull and push permissions, assign the AcrPush role.

```azurepowershell-interactive
New-AzRoleAssignment -ObjectId $spID -Scope $resourceID -RoleDefinitionName AcrPull
```

---

### Use the identity to access the registry

### [Azure CLI](#tab/azure-cli)

SSH into the Docker virtual machine that's configured with the identity. Run the following Azure CLI commands, using the Azure CLI installed on the VM.

First, authenticate the Azure CLI with [az login][az-login], using the system-assigned identity on the VM.

```azurecli-interactive
az login --identity
```

Then, authenticate to the registry with [az acr login][az-acr-login]. When you use this command, the CLI uses the Active Directory token created when you ran `az login` to seamlessly authenticate your session with the container registry. (Depending on your VM's setup, you might need to run this command and docker commands with `sudo`.)

```azurecli-interactive
az acr login --name myContainerRegistry
```

You should see a `Login succeeded` message. You can then run `docker` commands without providing credentials. For example, run [docker pull][docker-pull] to pull the `aci-helloworld:v1` image, specifying the login server name of your registry. The login server name consists of your container registry name (all lowercase) followed by `.azurecr.io` - for example, `mycontainerregistry.azurecr.io`.

```bash
docker pull mycontainerregistry.azurecr.io/aci-helloworld:v1
```
### [Azure PowerShell](#tab/azure-powershell)

SSH into the Docker virtual machine that's configured with the identity. Run the following Azure PowerShell commands, using the Azure PowerShell installed on the VM.

First, authenticate the Azure PowerShell with [Connect-AzAccount][connect-azaccount], using the system-assigned identity on the VM.

```azurepowershell-interactive
Connect-AzAccount -Identity
```

Then, authenticate to the registry with [Connect-AzContainerRegistry][connect-azcontainerregistry]. When you use this command, the PowerShell uses the Active Directory token created when you ran `Connect-AzAccount` to seamlessly authenticate your session with the container registry. (Depending on your VM's setup, you might need to run this command and docker commands with `sudo`.)

```azurepowershell-interactive
sudo pwsh -command Connect-AzContainerRegistry -Name myContainerRegistry
```

You should see a `Login succeeded` message. You can then run `docker` commands without providing credentials. For example, run [docker pull][docker-pull] to pull the `aci-helloworld:v1` image, specifying the login server name of your registry. The login server name consists of your container registry name (all lowercase) followed by `.azurecr.io` - for example, `mycontainerregistry.azurecr.io`.

```bash
docker pull mycontainerregistry.azurecr.io/aci-helloworld:v1
```

---

## Next steps

In this article, you learned about using managed identities with Azure Container Registry and how to:

> [!div class="checklist"]
> * Enable a user-assigned or system-assigned identity in an Azure VM
> * Grant the identity access to an Azure container registry
> * Use the managed identity to access the registry and pull a container image

* Learn more about [managed identities for Azure resources](../active-directory/managed-identities-azure-resources/index.yml).
* Learn how to use a [system-assigned](https://github.com/Azure/app-service-linux-docs/blob/master/HowTo/use_system-assigned_managed_identities.md) or [user-assigned](https://github.com/Azure/app-service-linux-docs/blob/master/HowTo/use_user-assigned_managed_identities.md) managed identity with App Service and Azure Container Registry.
* Learn how to [deploy a container image from Azure Container Registry using a managed identity](../container-instances/using-azure-container-registry-mi.md).

<!-- LINKS - external -->
[docker-linux]: https://docs.docker.com/engine/installation/#supported-platforms
[docker-login]: https://docs.docker.com/engine/reference/commandline/login/
[docker-mac]: https://docs.docker.com/docker-for-mac/
[docker-pull]: https://docs.docker.com/engine/reference/commandline/pull/
[docker-windows]: https://docs.docker.com/docker-for-windows/

<!-- LINKS - Internal -->
[az-login]: /cli/azure/reference-index#az_login
[connect-azaccount]: /powershell/module/az.accounts/connect-azaccount
[az-acr-login]: /cli/azure/acr#az_acr_login
[connect-azcontainerregistry]: /powershell/module/az.containerregistry/connect-azcontainerregistry
[az-acr-show]: /cli/azure/acr#az_acr_show
[get-azcontainerregistry]: /powershell/module/az.containerregistry/get-azcontainerregistry
[az-vm-create]: /cli/azure/vm#az_vm_create
[new-azvm]: /powershell/module/az.compute/new-azvm
[az-vm-show]: /cli/azure/vm#az_vm_show
[get-azvm]: /powershell/module/az.compute/get-azvm
[az-identity-create]: /cli/azure/identity#az_identity_create
[new-azuserassignedidentity]: /powershell/module/az.managedserviceidentity/new-azuserassignedidentity
[az-vm-identity-assign]: /cli/azure/vm/identity#az_vm_identity_assign
[update-azvm]: /powershell/module/az.compute/update-azvm
[az-role-assignment-create]: /cli/azure/role/assignment#az_role_assignment_create
[new-azroleassignment]: /powershell/module/az.resources/new-azroleassignment
[az-identity-show]: /cli/azure/identity#az_identity_show
[get-azuserassignedidentity]: /powershell/module/az.managedserviceidentity/get-azuserassignedidentity
[azure-cli-install]: /cli/azure/install-azure-cli
[azure-powershell-install]: /powershell/azure/install-az-ps
[powershell-install]: /powershell/scripting/install/install-ubuntu
