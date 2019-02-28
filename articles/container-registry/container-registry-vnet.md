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

[Azure Virtual Network](../virtual-network/virtual-networks-overview.md) provides secure, private networking including filtering, routing, and peering for your Azure and on-premises resources. By deploying your private Azure container registry into an Azure virtual network, you can ensure that only resources in the virtual network access the registry.

For example, use a virtual network to allow Azure resources such as an [Azure Kubernetes Service](../aks/intro-kubernetes.md) cluster or Azure [virtual machine](../virtual-machines/linux/overview.md) to securely access the container registry without crossing a network boundary. You can also configure network firewall rules to restrict access to specific public internet IP address ranges. 

> [!IMPORTANT]
> This feature is currently in preview, and some [limitations apply](#preview-limitations). Previews are made available to you on the condition that you agree to the [supplemental terms of use][terms-of-use]. Some aspects of this feature may change prior to general availability (GA).
>

This article shows you how to restrict access to an Azure container registry from a virtual machine deployed in the same network, or from the virtual machine's public IP address.

This article requires that you are running the Azure CLI (version 2.0.58 or later). If you need to install or upgrade, see [Install Azure CLI][azure-cli]. If you don't already have a Premium container registry, create one and push a sample image. For example, use the [Azure portal][quickstart-portal] or the [Azure CLI][quickstart-cli] to create a registry.

## Preview limitations

The following limitations currently apply to the preview:

* During preview, only a **Premium** container registry can be configured with network access rules. For information about registry service tiers, see [Azure Container Registry SKUs](container-registry-skus.md). Each registry supports a maximum of 100 virtual network rules.

* Only an Azure virtual machine or AKS cluster can be used as a host to access a container registry in a virtual network. *Other Azure services including Azure Container Instances aren't currently supported.*

## About network rules for a container registry

By default, an Azure container registry accepts connections from hosts on any network. To limit access to a selected subnet in a virtual network, or to an IP address range, you must first change the default action to deny connections, and then configure specific network rules that allow access.

For example, to change the default action so that all connections are denied, use the Azure CLI command [az acr update][az-acr-update].

Then, add network rules to a container registry that allow requests to be received only from specific subnets in a virtual network, from specific IP addresses, or both. For example, add rules using the [az acr network-rule add][az-acr-network-rule-add] command. Clients granted access via these network rules must continue to [authenticate to the container registry](https://docs.microsoft.com/azure/container-registry/container-registry-authentication) and be authorized to access the data.

### Service endpoint for subnets

To allow access from a subnet in a virtual network, additional subnet configuration is needed. You need to configure the subnet with a [service endpoint](../virtual-network/virtual-network-service-endpoints-overview.md) for the Azure Container Registry service. For example, configure the endpoint with the [az network vnet subnet update][az-network-vnet-subnet-update] command.

Multi-tenant services, like Azure Container Registry, use a single set of IP addresses for all customers. A service endpoint assigns an endpoint to configure access to a registry. This endpoint gives traffic an optimal route to the service over the Azure backbone network. The identities of the virtual network and the subnet are also transmitted with each request.

## Create a Docker-enabled virtual machine

For this article, use a Docker-enabled Ubuntu virtual machine in a virtual network to access an Azure container registry. If you already have an Azure virtual machine, skip this section to create the virtual machine.

First, create a resource group to contain the virtual machine and virtual network. Create a resource group with [az group create](https://docs.microsoft.com/cli/azure/group#az_group_create). The following example creates a resource group named *myResourceGroup* in the *westcentralus* location:

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

Use the [az network vnet subnet show][az-network-vnet-subnet-show] command to retrieve the resource ID of the subnet. You need this in a later step to configure a network access rule. Substitute the name of your container registgry in the following command:

```azurecli


``` 

### Change default network access to registry

By default, an Azure container registry accepts connections from hosts on any network. To limit access to a selected network, you must change the default action. The following example creates a resource group named *myResourceGroup* in the *westcentralus* location:

```azurecli

```

### Configure registry authentication

For this example, you configure registry access using [service principal authentication](https://docs.microsoft.com/azure/container-registry/container-registry-auth-service-principal). 

To create a service principal, use the [service-principal-create.sh](https://github.com/Azure-Samples/azure-cli-samples/blob/master/container-registry/service-principal-create/service-principal-create.sh) script on GitHub. For this example, assign the `acrpull` role to the service principal, to allow pulling images. 

The script returns values for the service principal application ID and password. Take note of these values for a later step.


### Verify access to the registry

Now verify that the VM in the virtual network can access the container registry. Make an SSH connection to your VM, and run the following command to login to your registry. When prompted, supply the user name (service principal application ID) and service principal password:

```bash
docker login  mycontainerregistryxxx.azurecr.io
```

You can pull the sample image in your registry to your VM. Substitute the image and tag that you pushed in an earlier step.

```bash
sudo docker pull mycontainerregistryxxx.azurecr.io/aci-helloworld:v1
``` 

Docker successfully pulls the image to the VM.

Although you are able to access the private container registry from the VM over the virtual network, the registry can't be accessed from other networks. For example, you can't login to the registry over the internet from a different login host (such as your local computer) using the `docker login` command. 

Output indicates that the registry can't be accessed in this case:

```Console
Error response from daemon: Get https://mycontainerregistryxxx.azurecr.io/v2/ failed with status: 404 Not Found
```

This example demonstrates that only a Docker host in the virtual network is able to access the registry.

## Grant access from an IP address range

Alternatively, or in addition, configure a container registry to allow access from specific public internet IP address (IPv4) ranges. This configuration grants access to specific internet-based services and on-premises networks and blocks general internet traffic.

Provide allowed internet address ranges using CIDR notation such as *16.17.18.0/24* or as individual IP addresses like *16.17.18.19*.

IP network rules are only allowed for public internet IP addresses. IP address ranges reserved for private networks (as defined in RFC 1918) aren't allowed in IP rules. Private networks include addresses that start with 10.\*, 172.16.\* - 172.31.\*, and 192.168.\*

## Clean up resources

If you followed the steps in this article to create the Azure resources in the same resource group, you can delete the resources when done by using the [az group delete](/cli/azure/group#az_group_delete) command:

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
[az-role-assignment-create]: /cli/azure/role/assignment#az-role-assignment-create
[az-vm-create]: /cli/azure/vm#az-vm-create
[az-network-vnet-subnet-show]: /cli/azure/network/vnet/subnet/#az-network-vnet-subnet-show
[az-network-vnet-subnet-update]: /cli/azure/network/vnet/subnet/#az-network-vnet-subnet-update
[az-network-vnet-subnet-show]: /cli/azure/network/vnet/subnet/#az-network-vnet-subnet-show
[az-network-vnet-list]: /cli/azure/network/vnet/#az-network-vnet-list
[quickstart-portal]: container-registry-get-started-portal.md
[quickstart-cli]: container-registry-get-started-azure-cli.md