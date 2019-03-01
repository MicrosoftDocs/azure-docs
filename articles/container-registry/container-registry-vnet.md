---
title: Deploy an Azure container registry into a virtual network
description: Restrict access to an Azure container registry from resources in an Azure virtual network or from public IP address ranges.
services: container-registry
author: dlepow

ms.service: container-registry
ms.topic: article
ms.date: 02/28/2019
ms.author: danlep
---

# Restrict access to an Azure container registry using an Azure virtual network or firewall rules

[Azure Virtual Network](../virtual-network/virtual-networks-overview.md) provides secure, private networking including filtering, routing, and peering for your Azure and on-premises resources. By deploying your private Azure container registry into an Azure virtual network, you can ensure that only resources in the virtual network access the registry. For cross-premises scenarios, you can also configure firewall rules to allow registry access only from specific IP addresses.

This article shows two scenarios to limit access to an Azure container registry: from a virtual machine deployed in the same network, or from the VM's public IP address.

> [!IMPORTANT]
> This feature is currently in preview, and some [limitations apply](#preview-limitations). Previews are made available to you on the condition that you agree to the [supplemental terms of use][terms-of-use]. Some aspects of this feature may change prior to general availability (GA).
>



This article requires that you are running the Azure CLI (version 2.0.58 or later). If you need to install or upgrade, see [Install Azure CLI][azure-cli]. If you don't already have a Premium container registry, create one and push a sample image. For example, use the [Azure portal][quickstart-portal] or the [Azure CLI][quickstart-cli] to create a registry.

## Preview limitations

The following limitations currently apply to the preview:

* During preview, only a **Premium** container registry can be configured with network access rules. For information about registry service tiers, see [Azure Container Registry SKUs](container-registry-skus.md). Each registry supports a maximum of 100 virtual network rules.

* Only an [Azure Kubernetes Service](../aks/intro-kubernetes.md) cluster or Azure [virtual machine](../virtual-machines/linux/overview.md) can be used as a host to access a container registry in a virtual network. *Other Azure services including Azure Container Instances aren't currently supported.*

## About network rules for a container registry

An Azure container registry by default accepts connections over the internet from hosts on any network. However, you can take advantage of a virtual network to allow only Azure resources such as an AKS cluster or Azure VM to securely access the registry, without crossing a network boundary. You can also configure network firewall rules to whitelist specific public internet IP address ranges. 

To limit access to a registry, you first change the default action of the registry so that it denies all network connections. Then, configure specific network rules to allow access.

The network rules you add to a container registry can allow requests from specific subnets in a virtual network, from specific IP addresses, or both. Clients granted access via these network rules must continue to [authenticate to the container registry](https://docs.microsoft.com/azure/container-registry/container-registry-authentication) and be authorized to access the data.

### Service endpoint for subnets

To allow access from a subnet in a virtual network, additional subnet configuration is needed. You need to configure the subnet with a [service endpoint](../virtual-network/virtual-network-service-endpoints-overview.md) for the Azure Container Registry service. 

Multi-tenant services, like Azure Container Registry, use a single set of IP addresses for all customers. A service endpoint assigns an endpoint to configure access to a registry. This endpoint gives traffic an optimal route to the service over the Azure backbone network. The identities of the virtual network and the subnet are also transmitted with each request.

### Firewall rules

For IP network rules, provide allowed internet address ranges using CIDR notation such as *16.17.18.0/24* or as individual IP addresses like *16.17.18.19*.

IP network rules are only allowed for *public* internet IP addresses. IP address ranges reserved for private networks (as defined in RFC 1918) aren't allowed in IP rules. Private networks include addresses that start with 10.\*, 172.16.\* - 172.31.\*, and 192.168.\*.

## Create a Docker-enabled virtual machine

For this article, use a Docker-enabled Ubuntu virtual machine in a virtual network to access an Azure container registry. To use Azure Active Directory authentication to the registry, also install the [Azure CLI][azure-cli]. If you already have an Azure virtual machine, skip this section to create the virtual machine.

If you want to, use the same resource group for your virtual machine and your container registry. This setup simplifies clean-up at the end but isn't required. If you choose to create a resource group to contain the virtual machine and virtual network, run [az group create][az-group-create]. The following example creates a resource group named *myResourceGroup* in the *westcentralus* location:

```azurecli
az group create --name myResourceGroup --location westcentralus
```

Now deploy a default Ubuntu Azure virtual machine with [az vm create][az-vm-create]. The following example creates a VM named *myDockerVM*:

```azurecli
az vm create \
    --resource-group myResourceGroup \
    --name myDockerVM \
    --image UbuntuLTS \
    --admin-username azureuser \
    --generate-ssh-keys
```

It takes a few minutes for the VM to be created. When the command completes, take note of the `publicIpAddress` displayed by the Azure CLI. Use this address to make SSH connections to the VM, and for later setup of firewall rules.

### Install Docker on the VM

After the VM is running, make an SSH connection to the VM. Replace *publicIpAddress* with the public IP address of your VM.

```bash
ssh azureuser@publicIpAddress
```

Run the following command to install Docker on the Ubuntu VM:

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

Follow the steps in [Install Azure CLI with apt](/cli/azure/install-azure-cli-apt?view=azure-cli-latest) to install the Azure CLI on your Ubuntu virtual machine. For this article, ensure that you install version 2.0.58 or later.

Exit the SSH connection.

## Grant access from a virtual network

### Add a service endpoint to a subnet

When you create a VM, Azure by default creates a virtual network in the same resource group. The name of the virtual network is based on the name of the virtual machine. For example, if you name your virtual machine *myDockerVM*, the default virtual network name is *myDockerVMVNET*, with a subnet named *myDockerVMSubnet*. Verify this in the Azure portal or by using the [az network vnet list][az-network-vnet-list] command:

```azurecli
az network vnet list --resource-group myResourceGroup --query "[].{Name: name, Subnet: subnets[0].name}"
```

Output:

```console
[
  {
    "Name": "myDockerVMVNET",
    "Subnet": "myDockerVMSubnet"
  }
]
```

Use the [az network vnet subnet update][az-network-vnet-subnet-update] command to add a **Microsoft.ContainerRegistry** service endpoint to your subnet. Substitute the names of your virtual network and subnet in the following command:

```azurecli
az network vnet subnet update \
  --name myDockerVMSubnet \
  --vnet-name myDockerVMVNET \
  --resource-group myResourceGroup \
  --service-endpoints Microsoft.ContainerRegistry
```

Use the [az network vnet subnet show][az-network-vnet-subnet-show] command to retrieve the resource ID of the subnet. You need this in a later step to configure a network access rule.

```azurecli
az network vnet subnet show \
  --name myDockerVMSubnet \
  --vnet-name myDockerVMVNET \
  --resource-group myResourceGroup \
  --query "id"
  --output tsv
``` 

Output:

```
/subscriptions/xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx/resourceGroups/myResourceGroup/providers/Microsoft.Network/virtualNetworks/myDockerVMVNET/subnets/myDockerVMSubnet
```

### Change default network access to registry

By default, an Azure container registry allows connections from hosts on any network. To limit access to a selected network, change the default action to deny access. Substitute the name of your registry in the following [az acr update][az-acr-update] command:

```azurecli
az acr update --name myContainerRegistry --default-action Deny
```

### Add network rule to registry

Use the [az acr network-rule add][az-acr-network-rule-add] command to add a network rule to your registry that allows access from the VM's subnet. Substitute the container registry's name and the resource ID of the subnet you retrieved in an earlier step in the following command: 


```azurecli
az acr network-rule add --name mycontainerregistry --subnet <subnet-resource-id>
```


### Verify access to the registry

After waiting a few minutes for the configuration to update, verify that the VM in the virtual network can access the container registry. Make an SSH connection to your VM, and run the [az acr login][az-acr-login] command to login to your registry. 

```bash
az acr login --name mycontainerregistry
```

You can pull a sample image in your registry to your VM. Substitute an image and tag value appropriate for your registry, prefixed with the registry login server name (all lowercase).

```bash
docker pull mycontainerregistry.azurecr.io/aci-helloworld:v1
``` 

Docker successfully pulls the image to the VM.

Although you are able to access the private container registry from the VM over the virtual network, the registry can't be accessed from other networks. For example, you can't login to the registry over the internet from a different login host (such as your local computer) using the `az acr login` command or `docker login` command. 

Output indicates that the registry can't be accessed in this case:

```Console
...
Error response from daemon: login attempt to https://xxxxxxx.azurecr.io/v2/ failed with status: 403 Forbidden
```

This example demonstrates that only a Docker host in the virtual network is able to access the registry.

## Grant access from an IP address

In this section, configure your container registry to allow access from the public internet IP address of your virtual machine.

### Change default network access to registry

If you haven't already done so, update the registry configuration to deny access by default. Substitute the name of your registry in the following [az acr update][az-acr-update] command:

```azurecli
az acr update --name myContainerRegistry --default-action Deny
```

### Remove network rule from registry

If you previously added a network rule to allow access from the VM's subnet, first remove it. Substitute the container registry's name and the resource ID of the subnet you retrieved in an earlier step in the following command: 

```azurecli
az acr network-rule remove --name mycontainerregistry --subnet <subnet-resource-id>
``` 

### Add network rule to registry

Use the [az acr network-rule add][az-acr-network-rule-add] command to add a network rule to your registry that allows access from the VM's IP address. Substitute the container registry's name and the public IP address of the VM you retrieved in an earlier step in the following command. You can also substitute an address range in CIDR notation.

```azurecli
az acr network-rule add --name mycontainerregistry --ip-address <public-IP-address>
```

### Verify access to the registry

After waiting a few minutes for the configuration to update, verify that the VM can access the container registry. Make an SSH connection to your VM, and run the [az acr login][az-acr-login] command to login to your registry. 

```bash
az acr login --name mycontainerregistry
```

You can pull a sample image in your registry to your VM. Substitute an image and tag value appropriate for your registry, prefixed with the registry login server name (all lowercase).

```bash
docker pull mycontainerregistry.azurecr.io/aci-helloworld:v1
``` 

Docker successfully pulls the image to the VM.

Although you are able to access the private container registry from the VM's public IP address, the registry can't be accessed from other hosts. For example, you can't login to the registry from a different login host (such as your local computer) using the `az acr login` command or `docker login` command. 

Output indicates that the registry can't be accessed in this case:

```Console
...
Error response from daemon: login attempt to https://xxxxxxx.azurecr.io/v2/ failed with status: 403 Forbidden
```

## Restore default registry access

If you want the registry to revert to allow access by default. Substitute the name of your registry in the following [az acr update][az-acr-update] command:

```azurecli
az acr update --name myContainerRegistry --default-action Allow
```

## Clean up resources

If you created all the Azure resources in the same resource group, you can delete the resources when done by using a single [az group delete](/cli/azure/group#az_group_delete) command:

```azurecli
az group delete --name myResourceGroup
```

## Next steps

Several virtual network resources and features were discussed in this article, though briefly. The Azure Virtual Network documentation covers these topics extensively:

* [Virtual network](https://docs.microsoft.com/azure/virtual-network/manage-virtual-network)
* [Subnet](https://docs.microsoft.com/azure/virtual-network/virtual-network-manage-subnet)
* [Service endpoints](https://docs.microsoft.com/azure/virtual-network/virtual-network-service-endpoints-overview)

<!-- IMAGES -->

<!-- LINKS - External -->
[aci-helloworld]: https://hub.docker.com/r/microsoft/aci-helloworld/
[terms-of-use]: https://azure.microsoft.com/support/legal/preview-supplemental-terms/
[kubectl]: https://kubernetes.io/docs/user-guide/kubectl/
[docker-linux]: https://docs.docker.com/engine/installation/#supported-platforms
[docker-login]: https://docs.docker.com/engine/reference/commandline/login/
[docker-mac]: https://docs.docker.com/docker-for-mac/
[docker-push]: https://docs.docker.com/engine/reference/commandline/push/
[docker-tag]: https://docs.docker.com/engine/reference/commandline/tag/
[docker-windows]: https://docs.docker.com/docker-for-windows/

<!-- LINKS - Internal -->
[azure-cli]: /cli/azure/install-azure-cli
[az-acr-create]: /cli/azure/acr#az-acr-create
[az-acr-show]: /cli/azure/acr#az-acr-show
[az-acr-repository-show]: /cli/azure/acr/repository#az-acr-repository-show
[az-acr-repository-list]: /cli/azure/acr/repository#az-acr-repository-list
[az-acr-login]: /cli/azure/acr#az-acr-login
[az-acr-network-rule-add]: /cli/azure/acr/network-rule/#az-acr-network-rule-add
[az-acr-run]: /cli/azure/acr#az-acr-run
[az-acr-update]: /cli/azure/acr#az-acr-update
[az-ad-sp-create-for-rbac]: /cli/azure/ad/sp#az-ad-sp-create-for-rbac
[az-group-create]: /cli/azure/group#az_group_create
[az-role-assignment-create]: /cli/azure/role/assignment#az-role-assignment-create
[az-vm-create]: /cli/azure/vm#az-vm-create
[az-network-vnet-subnet-show]: /cli/azure/network/vnet/subnet/#az-network-vnet-subnet-show
[az-network-vnet-subnet-update]: /cli/azure/network/vnet/subnet/#az-network-vnet-subnet-update
[az-network-vnet-subnet-show]: /cli/azure/network/vnet/subnet/#az-network-vnet-subnet-show
[az-network-vnet-list]: /cli/azure/network/vnet/#az-network-vnet-list
[quickstart-portal]: container-registry-get-started-portal.md
[quickstart-cli]: container-registry-get-started-azure-cli.md