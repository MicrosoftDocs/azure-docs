---
author: dlepow
ms.service: container-registry
ms.topic: include
ms.date: 05/07/2020
ms.author: danlep
---
## Create a Docker-enabled virtual machine

For test purposes, use a Docker-enabled Ubuntu VM to access an Azure container registry. To use Microsoft Entra authentication to the registry, also install the [Azure CLI][azure-cli] on the VM. If you already have an Azure virtual machine, skip this creation step.

You may use the same resource group for your virtual machine and your container registry. This setup simplifies clean-up at the end but isn't required. If you choose to create a separate resource group for the virtual machine and virtual network, run [az group create][az-group-create]. The following example assumes you've set environment variables for the resource group name and registry location:

```azurecli
az group create --name $RESOURCE_GROUP --location $REGISTRY_LOCATION
```

Now deploy a default Ubuntu Azure virtual machine with [az vm create][az-vm-create]. The following example creates a VM named *myDockerVM*.

```azurecli
VM_NAME=myDockerVM

az vm create \
  --resource-group $RESOURCE_GROUP \
  --name $VM_NAME \
  --image Ubuntu2204 \
  --admin-username azureuser \
  --generate-ssh-keys
```

It takes a few minutes for the VM to be created. When the command completes, take note of the `publicIpAddress` displayed by the Azure CLI. Use this address to make SSH connections to the VM.

### Install Docker on the VM

After the VM is running, make an SSH connection to the VM. Replace *publicIpAddress* with the public IP address of your VM.

```bash
ssh azureuser@publicIpAddress
```

Run the following commands to install Docker on the Ubuntu VM:

```bash
sudo apt-get update
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

Follow the steps in [Install Azure CLI with apt](/cli/azure/install-azure-cli-apt) to install the Azure CLI on your Ubuntu virtual machine. For example:

```bash
curl -sL https://aka.ms/InstallAzureCLIDeb | sudo bash
```

Exit the SSH connection.

[azure-cli]: /cli/azure/install-azure-cli
[az-vm-create]: /cli/azure/vm#az_vm_create
[az-group-create]: /cli/azure/group
