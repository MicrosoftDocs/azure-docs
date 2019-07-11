---
title: Restrict access to an Azure container registry from a virtual network
description: Allow access to an Azure container registry only from resources in an Azure virtual network or from public IP address ranges.
services: container-registry
author: dlepow

ms.service: container-registry
ms.topic: article
ms.date: 07/01/2019
ms.author: danlep
---

# Restrict access to an Azure container registry using an Azure virtual network or firewall rules

[Azure Virtual Network](../virtual-network/virtual-networks-overview.md) provides secure, private networking for your Azure and on-premises resources. By limiting access to your private Azure container registry from an Azure virtual network, you ensure that only resources in the virtual network access the registry. For cross-premises scenarios, you can also configure firewall rules to allow registry access only from specific IP addresses.

This article shows two scenarios to create network access rules to limit access to an Azure container registry: from a virtual machine deployed in a virtual network, or from a VM's public IP address.

> [!IMPORTANT]
> This feature is currently in preview, and some [limitations apply](#preview-limitations). Previews are made available to you on the condition that you agree to the [supplemental terms of use][terms-of-use]. Some aspects of this feature may change prior to general availability (GA).
>

## Preview limitations

* Only a **Premium** container registry can be configured with network access rules. For information about registry service tiers, see [Azure Container Registry SKUs](container-registry-skus.md). 

* Only an [Azure Kubernetes Service](../aks/intro-kubernetes.md) cluster or Azure [virtual machine](../virtual-machines/linux/overview.md) can be used as a host to access a container registry in a virtual network. *Other Azure services including Azure Container Instances aren't currently supported.*

* [ACR Tasks](container-registry-tasks-overview.md) operations aren't currently supported in a container registry accessed in a virtual network.

* Each registry supports a maximum of 100 virtual network rules.

## Prerequisites

* To use the Azure CLI steps in this article, Azure CLI version 2.0.58 or later is required. If you need to install or upgrade, see [Install Azure CLI][azure-cli].

* If you don't already have a container registry, create one (Premium SKU required) and push a sample image such as `hello-world` from Docker Hub. For example, use the [Azure portal][quickstart-portal] or the [Azure CLI][quickstart-cli] to create a registry. 

* If you want to restrict registry access using a virtual network in a different Azure subscription, you need to register the resource provider for Azure Container Registry in that subscription. For example:

  ```azurecli
  az account set --subscription <Name or ID of subscription of virtual network>

  az provider register --namespace Microsoft.ContainerRegistry
  ``` 

## About network rules for a container registry

An Azure container registry by default accepts connections over the internet from hosts on any network. With a virtual network, you can allow only Azure resources such as an AKS cluster or Azure VM to securely access the registry, without crossing a network boundary. You can also configure network firewall rules to whitelist specific public internet IP address ranges. 

To limit access to a registry, first change the default action of the registry so that it denies all network connections. Then, add network access rules. Clients granted access via the network rules must continue to [authenticate to the container registry](https://docs.microsoft.com/azure/container-registry/container-registry-authentication) and be authorized to access the data.

### Service endpoint for subnets

To allow access from a subnet in a virtual network, you need to add a [service endpoint](../virtual-network/virtual-network-service-endpoints-overview.md) for the Azure Container Registry service. 

Multi-tenant services, like Azure Container Registry, use a single set of IP addresses for all customers. A service endpoint assigns an endpoint to access a registry. This endpoint gives traffic an optimal route to the resource over the Azure backbone network. The identities of the virtual network and the subnet are also transmitted with each request.

### Firewall rules

For IP network rules, provide allowed internet address ranges using CIDR notation such as *16.17.18.0/24* or an individual IP addresses like *16.17.18.19*. IP network rules are only allowed for *public* internet IP addresses. IP address ranges reserved for private networks (as defined in RFC 1918) aren't allowed in IP rules.

## Create a Docker-enabled virtual machine

For this article, use a Docker-enabled Ubuntu VM to access an Azure container registry. To use Azure Active Directory authentication to the registry, also install the [Azure CLI][azure-cli] on the VM. If you already have an Azure virtual machine, skip this creation step.

You may use the same resource group for your virtual machine and your container registry. This setup simplifies clean-up at the end but isn't required. If you choose to create a separate resource group for the virtual machine and virtual network, run [az group create][az-group-create]. The following example creates a resource group named *myResourceGroup* in the *westcentralus* location:

```azurecli
az group create --name myResourceGroup --location westus
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

It takes a few minutes for the VM to be created. When the command completes, take note of the `publicIpAddress` displayed by the Azure CLI. Use this address to make SSH connections to the VM, and optionally for later setup of firewall rules.

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

## Allow access from a virtual network

In this section, configure your container registry to allow access from a subnet in an Azure virtual network. Equivalent steps using the Azure CLI and Azure portal are provided.

### Allow access from a virtual network - CLI

#### Add a service endpoint to a subnet

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

#### Change default network access to registry

By default, an Azure container registry allows connections from hosts on any network. To limit access to a selected network, change the default action to deny access. Substitute the name of your registry in the following [az acr update][az-acr-update] command:

```azurecli
az acr update --name myContainerRegistry --default-action Deny
```

#### Add network rule to registry

Use the [az acr network-rule add][az-acr-network-rule-add] command to add a network rule to your registry that allows access from the VM's subnet. Substitute the container registry's name and the resource ID of the subnet in the following command: 

 ```azurecli
az acr network-rule add --name mycontainerregistry --subnet <subnet-resource-id>
```

Continue to [Verify access to the registry](#verify-access-to-the-registry).

### Allow access from a virtual network - portal

#### Add service endpoint to subnet

When you create a VM, Azure by default creates a virtual network in the same resource group. The name of the virtual network is based on the name of the virtual machine. For example, if you name your virtual machine *myDockerVM*, the default virtual network name is *myDockerVMVNET*, with a subnet named *myDockerVMSubnet*.

To add a service endpoint for Azure Container Registry to a subnet:

1. In the search box at the top of the [Azure portal][azure-portal], enter *virtual networks*. When **Virtual networks** appear in the search results, select it.
1. From the list of virtual networks, select the virtual network where your virtual machine is deployed, such as *myDockerVMVNET*.
1. Under **Settings**, select **Subnets**.
1. Select the subnet where your virtual machine is deployed, such as *myDockerVMSubnet*.
1. Under **Service endpoints**, select **Microsoft.ContainerRegistry**.
1. Select **Save**.

![Add service endpoint to subnet][acr-subnet-service-endpoint] 

#### Configure network access for registry

By default, an Azure container registry allows connections from hosts on any network. To limit access to the virtual network:

1. In the portal, navigate to your container registry.
1. Under **Settings**, select **Firewall and virtual networks**.
1. To deny access by default, choose to allow access from **Selected networks**. 
1. Select **Add existing virtual network**, and select the virtual network and subnet you configured with a service endpoint. Select **Add**.
1. Select **Save**.

![Configure virtual network for container registry][acr-vnet-portal]

Continue to [Verify access to the registry](#verify-access-to-the-registry).

## Allow access from an IP address

In this section, configure your container registry to allow access from a specific IP address or range. Equivalent steps using the Azure CLI and Azure portal are provided.

### Allow access from an IP address - CLI

#### Change default network access to registry

If you haven't already done so, update the registry configuration to deny access by default. Substitute the name of your registry in the following [az acr update][az-acr-update] command:

```azurecli
az acr update --name myContainerRegistry --default-action Deny
```

#### Remove network rule from registry

If you previously added a network rule to allow access from the VM's subnet, remove the subnet's service endpoint and the network rule. Substitute the container registry's name and the resource ID of the subnet you retrieved in an earlier step in the [az acr network-rule remove][az-acr-network-rule-remove] command: 

```azurecli
# Remove service endpoint

az network vnet subnet update \
  --name myDockerVMSubnet \
  --vnet-name myDockerVMVNET \
  --resource-group myResourceGroup \
  --service-endpoints ""

# Remove network rule

az acr network-rule remove --name mycontainerregistry --subnet <subnet-resource-id>
```

#### Add network rule to registry

Use the [az acr network-rule add][az-acr-network-rule-add] command to add a network rule to your registry that allows access from the VM's IP address. Substitute the container registry's name and the public IP address of the VM in the following command.

```azurecli
az acr network-rule add --name mycontainerregistry --ip-address <public-IP-address>
```

Continue to [Verify access to the registry](#verify-access-to-the-registry).

### Allow access from an IP address - portal

#### Remove existing network rule from registry

If you previously added a network rule to allow access from the VM's subnet, remove the existing rule. Skip this section if you want to access the registry from a different VM.

* Update the subnet settings to remove the subnet's service endpoint for Azure Container Registry. 

  1. In the [Azure portal][azure-portal], navigate to the virtual network where your virtual machine is deployed.
  1. Under **Settings**, select **Subnets**.
  1. Select the subnet where your virtual machine is deployed.
  1. Under **Service endpoints**, remove the checkbox for **Microsoft.ContainerRegistry**. 
  1. Select **Save**.

* Remove the network rule that allows the subnet to access the registry.

  1. In the portal, navigate to your container registry.
  1. Under **Settings**, select **Firewall and virtual networks**.
  1. Under **Virtual networks**, select the name of the virtual network, and then select **Remove**.
  1. Select **Save**.

#### Add network rule to registry

1. In the portal, navigate to your container registry.
1. Under **Settings**, select **Firewall and virtual networks**.
1. If you haven't already done so, choose to allow access from **Selected networks**. 
1. Under **Virtual networks**, ensure no network is selected.
1. Under **Firewall**, enter the public IP address of a VM. Or, enter an address range in CIDR notation that contains the VM's IP address.
1. Select **Save**.

![Configure firewall rule for container registry][acr-vnet-firewall-portal]

Continue to [Verify access to the registry](#verify-access-to-the-registry).

## Verify access to the registry

After waiting a few minutes for the configuration to update, verify that the VM can access the container registry. Make an SSH connection to your VM, and run the [az acr login][az-acr-login] command to login to your registry. 

```bash
az acr login --name mycontainerregistry
```

You can perform registry operations such as run `docker pull` to pull a sample image from the registry. Substitute an image and tag value appropriate for your registry, prefixed with the registry login server name (all lowercase):

```bash
docker pull mycontainerregistry.azurecr.io/hello-world:v1
``` 

Docker successfully pulls the image to the VM.

This example demonstrates that you can access the private container registry through the network access rule. However, the registry can't be accessed from a different login host that doesn't have a network access rule configured. If you attempt to login from another host using the `az acr login` command or `docker login` command, output is similar to the following:

```Console
Error response from daemon: login attempt to https://xxxxxxx.azurecr.io/v2/ failed with status: 403 Forbidden
```

## Restore default registry access

To restore the registry to allow access by default, remove any network rules that are configured. Then set the default action to allow access. Equivalent steps using the Azure CLI and Azure portal are provided.

### Restore default registry access - CLI

#### Remove network rules

To see a list of network rules configured for your registry, run the following [az acr network-rule list][az-acr-network-rule-list] command:

```azurecli
az acr network-rule list--name mycontainerregistry 
```

For each rule that is configured, run the [az acr network-rule remove][az-acr-network-rule-remove] command to remove it. For example:

```azurecli
# Remove a rule that allows access for a subnet. Substitute the subnet resource ID.

az acr network-rule remove \
  --name mycontainerregistry \
  --subnet /subscriptions/ \
  xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx/resourceGroups/myResourceGroup/providers/Microsoft.Network/virtualNetworks/myDockerVMVNET/subnets/myDockerVMSubnet

# Remove a rule that allows access for an IP address or CIDR range such as 23.45.1.0/24.

az acr network-rule remove \
  --name mycontainerregistry \
  --ip-address 23.45.1.0/24
```

#### Allow access

Substitute the name of your registry in the following [az acr update][az-acr-update] command:
```azurecli
az acr update --name myContainerRegistry --default-action Allow
```

### Restore default registry access - portal


1. In the portal, navigate to your container registry and select **Firewall and virtual networks**.
1. Under **Virtual networks**, select each virtual network, and then select **Remove**.
1. Under **Firewall**, select each address range, and then select the Delete icon.
1. Under **Allow access from**, select **All networks**. 
1. Select **Save**.

## Clean up resources

If you created all the Azure resources in the same resource group and no longer need them, you can optionally delete the resources by using a single [az group delete](/cli/azure/group) command:

```azurecli
az group delete --name myResourceGroup
```

To clean up your resources in the portal, navigate to the myResourceGroup resource group. Once the resource group is loaded, click on **Delete resource group** to remove the resource group and the resources stored there.

## Next steps

Several virtual network resources and features were discussed in this article, though briefly. The Azure Virtual Network documentation covers these topics extensively:

* [Virtual network](https://docs.microsoft.com/azure/virtual-network/manage-virtual-network)
* [Subnet](https://docs.microsoft.com/azure/virtual-network/virtual-network-manage-subnet)
* [Service endpoints](https://docs.microsoft.com/azure/virtual-network/virtual-network-service-endpoints-overview)

<!-- IMAGES -->

[acr-subnet-service-endpoint]: ./media/container-registry-vnet/acr-subnet-service-endpoint.png
[acr-vnet-portal]: ./media/container-registry-vnet/acr-vnet-portal.png
[acr-vnet-firewall-portal]: ./media/container-registry-vnet/acr-vnet-firewall-portal.png

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
[az-acr-network-rule-remove]: /cli/azure/acr/network-rule/#az-acr-network-rule-remove
[az-acr-network-rule-list]: /cli/azure/acr/network-rule/#az-acr-network-rule-list
[az-acr-run]: /cli/azure/acr#az-acr-run
[az-acr-update]: /cli/azure/acr#az-acr-update
[az-ad-sp-create-for-rbac]: /cli/azure/ad/sp#az-ad-sp-create-for-rbac
[az-group-create]: /cli/azure/group
[az-role-assignment-create]: /cli/azure/role/assignment#az-role-assignment-create
[az-vm-create]: /cli/azure/vm#az-vm-create
[az-network-vnet-subnet-show]: /cli/azure/network/vnet/subnet/#az-network-vnet-subnet-show
[az-network-vnet-subnet-update]: /cli/azure/network/vnet/subnet/#az-network-vnet-subnet-update
[az-network-vnet-subnet-show]: /cli/azure/network/vnet/subnet/#az-network-vnet-subnet-show
[az-network-vnet-list]: /cli/azure/network/vnet/#az-network-vnet-list
[quickstart-portal]: container-registry-get-started-portal.md
[quickstart-cli]: container-registry-get-started-azure-cli.md
[azure-portal]: https://portal.azure.com
