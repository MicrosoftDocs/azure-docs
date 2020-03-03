---
title: Set up private endpoint
description: [add description]
ms.topic: article
ms.date: 03/02/2020
---

# Set up a private link to an Azure container registry 

[Intro]

An Azure container registry by default accepts connections over the internet from hosts on any network. With a private link, you can ...

> [!IMPORTANT]
> This feature is currently in preview, and some [limitations apply](#preview-limitations). Previews are made available to you on the condition that you agree to the [supplemental terms of use][terms-of-use]. Some aspects of this feature may change prior to general availability (GA).
>



## Preview limitations

* Only a **Premium** container registry can be configured with a private endpoint. For information about registry service tiers, see [Azure Container Registry SKUs](container-registry-skus.md). 

* Only an [Azure Kubernetes Service](../aks/intro-kubernetes.md) cluster or Azure [virtual machine](../virtual-machines/linux/overview.md) can be used as a host to access a container registry at a private endpoint


## Prerequisites

* To use the Azure CLI steps in this article, Azure CLI version XXXX or later is required. If you need to install or upgrade, see [Install Azure CLI][azure-cli].

* If you don't already have a container registry, create one (Premium SKU required) and push a sample image such as `hello-world` from Docker Hub. For example, use the [Azure portal][quickstart-portal] or the [Azure CLI][quickstart-cli] to create a registry. 




## Create a Docker-enabled virtual machine

For test purposes, use a Docker-enabled Ubuntu VM to access an Azure container registry. To use Azure Active Directory authentication to the registry, also install the [Azure CLI][azure-cli] on the VM. If you already have an Azure virtual machine, skip this creation step.

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

Follow the steps in [Install Azure CLI with apt](/cli/azure/install-azure-cli-apt?view=azure-cli-latest) to install the Azure CLI on your Ubuntu virtual machine. For this article, ensure that you install version 2.0.58 or later.

Exit the SSH connection.

## Set up private link - CLI

### Disable subnet private endpoint policies

When you create a VM, Azure by default creates a virtual network in the same resource group. The name of the virtual network is based on the name of the virtual machine. For example, if you name your virtual machine *myDockerVM*, the default virtual network name is *myDockerVMVNET*, with a subnet named *myDockerVMSubnet*. Verify this in the Azure portal or by using the [az network vnet list][az-network-vnet-list] command:

```azurecli
az network vnet list --resource-group myResourceGroup --query "[].{Name: name, Subnet: subnets[0].name}"
```

Output:

```json
[
  {
    "Name": "myDockerVMVNET",
    "Subnet": "myDockerVMSubnet"
  }
]
```

Create or update the subnet to disable private endpoint network policies. Update a subnet configuration named myDockerVMSubnet with [az network vnet subnet update][az-network-vnet-subnet-update]:

```azurecli
az network vnet subnet update \
 --name myDockerVMSubnet \
 --resource-group myResourceGroup \
 --vnet-name myDockerVMVNET \
 --disable-private-endpoint-network-policies
```

### Configure the private DNS zone

Create a private DNS zone for the Azure container registry domain. Run the following [az network private-dns zone create][az network-private-dns-zone-create] command:


```azurecli
az network private-dns zone create \
  --resource-group myResourceGroup \
  --name  "privatelink.azurecr.io"
```

### Create an association link

Run [az network private-dns link vnet create][az-network-private-dns-link-vnet-create] to create an association link with the virtual network.

```azurecli
az network private-dns link vnet create --resource-group myResourceGroup \
   --zone-name  "privatelink.azurecr.io"\
   --name MyDNSLink \
   --virtual-network myDockerVMVNET \
   --registration-enabled false
```

### Create the private endpoint

First get the resource ID of your Azure container registry:

```azurecli
acrID=$(az acr show --name myregistry --resource-group myResourceGroup --query "id" --output tsv)
```

Run the [az network private-endpoint create][az network-private-endpoint-create] command to create a private endpoint for the container registry in your virtual network:

```azurecli
az network private-endpoint create \
    --name myPrivateEndpoint \
    --resource-group myResourceGroup \
    --vnet-name myDockerVMVNET \
    --subnet myDockerVMSubnet \
    --private-connection-resource-id $acrID \
    --group-ids registry \
    --connection-name myConnection
```

Run [az network private-endpoint show][az-network-private-endpoint-show] to query the endpoint for the network interface ID:

```azurecli
networkInterfaceID=$(az network private-endpoint show --name myPrivateEndpoint --resource-group myResourceGroup --query 'networkInterfaces[0].id' --output tsv)
```
Run the following 

```azurecli
dataEndpointPrivateIP=$(az resource show --ids $NIC_RESOURCE_ID --api-version 2019-04-01 -o tsv --query 'properties.ipConfigurations[0].properties.privateIPAddress') 
```

Run the following [az resource show][az-resource-show] commands to get the private IP address for your container registry and its data endpoint:

```azurecli
privateIP=$(az resource show --ids $networkInterfaceID --api-version 2019-04-01 --query "properties.ipConfigurations[1].properties.privateIPAddress" --output tsv)

dataEndpointPrivateIP=$(az resource show --ids $networkInterfaceID --api-version 2019-04-01 -o tsv --query 'properties.ipConfigurations[0].properties.privateIPAddress') 
```

### Create DNS records in the private zone

Run the following commands to create the DNS records in the private zone. First run [az network private-dns record-set a create][az-network-private-dns-record-set-a-create] to create empty A record sets for the registry endpoints:

```azurecli
az network private-dns record-set a create \
  --name myregistry \
  --zone-name privatelink.azurecr.io \
  --resource-group myResourceGroup

# Enter the Azure region for the registry in the following
az network private-dns record-set a create \
  --name myregistry.<region>.data \
  --zone-name privatelink.azurecr.io \
  --resource-group myResourceGroup

```

Run the [az network private-dns record-set a add-record][az network-private-dns-record-set-a-add-record] command to create the A records for the registry endpoints:

```azurecli
az network private-dns record-set a add-record \
  --record-set-name myregistry \
  --zone-name privatelink.azurecr.io \
  --resource-group myResourceGroup --ipv4-address $privateIP

# Enter the Azure region for the registry in the following
az network private-dns record-set a add-record \
  --record-set-name myregistry.<region>.data \
  --zone-name privatelink.azurecr.io \
  --resource-group myResourceGroup --ipv4-address $networkInterfaceID
```
 

Continue to [Access registry privately from the VM](#access-registry-privately-from-the-vm).

## Set up private link - portal

## Add service endpoint to subnet

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
[az-network-private-endpoint-create]: /cli/azure/network/private-endpoint#az-network-private-endpoint-create
[az-network-private-endpoint-show]: /cli/azure/network/private-endpoint#az-network-private-endpoint-show
[az network-private-dns-zone-create]: /cli/azure/network/private-dns-zone/create#az-network-private-dns-zone-create
[az-network-private-dns-link-vnet-create]: /cli/azure/network/private-dns-link/vnet#az-network-private-dns-link-vnet-create
[az-network-private-dns-record-set-a-create]: /cli/azure/network/private-dns-record/set/a#az-network-private-dns-record-set-a-create
[az-network-private-dns-record-set-a-add-record]: /cli/azure/network/private-dns-record/set/a#az-network-private-dns-record-set-a-add-record
[quickstart-portal]: container-registry-get-started-portal.md
[quickstart-cli]: container-registry-get-started-azure-cli.md
[azure-portal]: https://portal.azure.com
