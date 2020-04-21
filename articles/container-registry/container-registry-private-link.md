---
title: Set up private link
description: Set up a private endpoint on a container registry and enable a private link in a local virtual network
ms.topic: article
ms.date: 03/10/2020
---

# Configure Azure Private Link for an Azure container registry 

You can set up a [private endpoint](../private-link/private-endpoint-overview.md) for your Azure container registry so that clients on an Azure virtual network securely access the registry over a [private link](../private-link/private-link-overview.md). The private endpoint uses an IP address from the virtual network address space for your registry. Network traffic between the clients on the virtual network and the registry traverses the virtual network and a private link on the Microsoft backbone network, eliminating exposure from the public internet.

You can [configure DNS settings](../private-link/private-endpoint-overview.md#dns-configuration) for your private endpoint, so that the settings resolve to the registry's allocated private IP address. With DNS configuration, clients and services in the network can continue to access the registry at the registry's fully qualified domain name, such as *myregistry.azurecr.io*.

This feature is available in the **Premium** container registry service tier. For information about registry service tiers and limits, see [Azure Container Registry SKUs](container-registry-skus.md).

> [!IMPORTANT]
> This feature is currently in preview, and some [limitations](#preview-limitations) apply. Previews are made available to you on the condition that you agree to the [supplemental terms of use][terms-of-use]. Some aspects of this feature may change prior to general availability (GA).

## Preview limitations

* Currently, you can't set up a private link with a private endpoint on a [geo-replicated registry](container-registry-geo-replication.md). 

## Prerequisites

* To use the Azure CLI steps in this article, Azure CLI version 2.2.0 or later is recommended. If you need to install or upgrade, see [Install Azure CLI][azure-cli]. Or run in [Azure Cloud Shell](../cloud-shell/quickstart.md).
* If you don't already have a container registry, create one (Premium tier required) and push a sample image such as `hello-world` from Docker Hub. For example, use the [Azure portal][quickstart-portal] or the [Azure CLI][quickstart-cli] to create a registry.
* If you want to configure registry access using a private link in a different Azure subscription, you need to register the resource provider for Azure Container Registry in that subscription. For example:

  ```azurecli
  az account set --subscription <Name or ID of subscription of private link>

  az provider register --namespace Microsoft.ContainerRegistry
  ``` 

The Azure CLI examples in this article use the following environment variables. Substitute values appropriate for your environment. All examples are formatted for the Bash shell:

```bash
registryName=<container-registry-name>
registryLocation=<container-registry-location> # Azure region such as westeurope where registry created
resourceGroup=<resource-group-name>
vmName=<virtual-machine-name>
```

## Create a Docker-enabled virtual machine

For test purposes, use a Docker-enabled Ubuntu VM to access an Azure container registry. To use Azure Active Directory authentication to the registry, also install the [Azure CLI][azure-cli] on the VM. If you already have an Azure virtual machine, skip this creation step.

You may use the same resource group for your virtual machine and your container registry. This setup simplifies clean-up at the end but isn't required. If you choose to create a separate resource group for the virtual machine and virtual network, run [az group create][az-group-create]:

```azurecli
az group create --name $resourceGroup --location $registryLocation
```

Now deploy a default Ubuntu Azure virtual machine with [az vm create][az-vm-create]. The following example creates a VM named *myDockerVM*.

```azurecli
az vm create \
  --resource-group $resourceGroup \
  --name $vmName \
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

Follow the steps in [Install Azure CLI with apt](/cli/azure/install-azure-cli-apt?view=azure-cli-latest) to install the Azure CLI on your Ubuntu virtual machine. For example:

```bash
curl -sL https://aka.ms/InstallAzureCLIDeb | sudo bash
```

Exit the SSH connection.

## Set up private link - CLI

### Get network and subnet names

If you don't have them already, you'll need the names of a virtual network and subnet to set up a private link. In this example, you use the same subnet for the VM and the registry's private endpoint. However, in many scenarios you would set up the endpoint in a separate subnet. 

When you create a VM, Azure by default creates a virtual network in the same resource group. The name of the virtual network is based on the name of the virtual machine. For example, if you name your virtual machine *myDockerVM*, the default virtual network name is *myDockerVMVNET*, with a subnet named *myDockerVMSubnet*. Set these values in environment variables by running the [az network vnet list][az-network-vnet-list] command:

```azurecli
networkName=$(az network vnet list \
  --resource-group $resourceGroup \
  --query '[].{Name: name}' --output tsv)

subnetName=$(az network vnet list \
  --resource-group $resourceGroup \
  --query '[].{Subnet: subnets[0].name}' --output tsv)

echo networkName=$networkName
echo subnetName=$subnetName
```

### Disable network policies in subnet

[Disable network policies](../private-link/disable-private-endpoint-network-policy.md) such as network security groups in the subnet for the private endpoint. Update your subnet configuration with [az network vnet subnet update][az-network-vnet-subnet-update]:

```azurecli
az network vnet subnet update \
 --name $subnetName \
 --vnet-name $networkName \
 --resource-group $resourceGroup \
 --disable-private-endpoint-network-policies
```

### Configure the private DNS zone

Create a private DNS zone for the priviate Azure container registry domain. In later steps, you create DNS records for your registry domain inside this DNS zone.

To use a private zone to override the default DNS resolution for your Azure container registry, the zone must be named **privatelink.azurecr.io**. Run the following [az network private-dns zone create][az-network-private-dns-zone-create] command to create the private zone:

```azurecli
az network private-dns zone create \
  --resource-group $resourceGroup \
  --name "privatelink.azurecr.io"
```

### Create an association link

Run [az network private-dns link vnet create][az-network-private-dns-link-vnet-create] to associate your private zone with the virtual network. This example creates a link called *myDNSLink*.

```azurecli
az network private-dns link vnet create \
  --resource-group $resourceGroup \
  --zone-name "privatelink.azurecr.io" \
  --name MyDNSLink \
  --virtual-network $networkName \
  --registration-enabled false
```

### Create a private registry endpoint

In this section, create the registry's private endpoint in the virtual network. First, get the resource ID of your registry:

```azurecli
registryID=$(az acr show --name $registryName \
  --query 'id' --output tsv)
```

Run the [az network private-endpoint create][az-network-private-endpoint-create] command to create the registry's private endpoint.

The following example creates the endpoint *myPrivateEndpoint* and service connection *myConnection*. To specify a container registry resource for the endpoint, pass `--group-ids registry`:

```azurecli
az network private-endpoint create \
    --name myPrivateEndpoint \
    --resource-group $resourceGroup \
    --vnet-name $networkName \
    --subnet $subnetName \
    --private-connection-resource-id $registryID \
    --group-ids registry \
    --connection-name myConnection
```

### Get private IP addresses

Run [az network private-endpoint show][az-network-private-endpoint-show] to query the endpoint for the network interface ID:

```azurecli
networkInterfaceID=$(az network private-endpoint show \
  --name myPrivateEndpoint \
  --resource-group $resourceGroup \
  --query 'networkInterfaces[0].id' \
  --output tsv)
```

Associated with the network interface are two private IP addresses for the container registry: one for the registry itself, and one for the registry's data endpoint. Run the following [az resource show][az-resource-show] commands to get the private IP addresses for the container registry and the registry's data endpoint:

```azurecli
privateIP=$(az resource show \
  --ids $networkInterfaceID \
  --api-version 2019-04-01 --query 'properties.ipConfigurations[1].properties.privateIPAddress' \
  --output tsv)

dataEndpointPrivateIP=$(az resource show \
  --ids $networkInterfaceID \
  --api-version 2019-04-01 \
  --query 'properties.ipConfigurations[0].properties.privateIPAddress' \
  --output tsv)
```

### Create DNS records in the private zone

The following commands create DNS records in the private zone for the registry endpoint and its data endpoint. For example, if you have a registry named *myregistry* in the *westeurope* region, the endpoint names are `myregistry.azurecr.io` and `myregistry.westeurope.data.azurecr.io`. 

First run [az network private-dns record-set a create][az-network-private-dns-record-set-a-create] to create empty A record sets for the registry endpoint and data endpoint:

```azurecli
az network private-dns record-set a create \
  --name $registryName \
  --zone-name privatelink.azurecr.io \
  --resource-group $resourceGroup

# Specify registry region in data endpoint name
az network private-dns record-set a create \
  --name ${registryName}.${registryLocation}.data \
  --zone-name privatelink.azurecr.io \
  --resource-group $resourceGroup
```

Run the [az network private-dns record-set a add-record][az-network-private-dns-record-set-a-add-record] command to create the A records for the registry endpoint and data endpoint:

```azurecli
az network private-dns record-set a add-record \
  --record-set-name $registryName \
  --zone-name privatelink.azurecr.io \
  --resource-group $resourceGroup \
  --ipv4-address $privateIP

# Specify registry region in data endpoint name
az network private-dns record-set a add-record \
  --record-set-name ${registryName}.${registryLocation}.data \
  --zone-name privatelink.azurecr.io \
  --resource-group $resourceGroup \
  --ipv4-address $dataEndpointPrivateIP
```

The private link is now configured and ready for use.

## Set up private link - portal

The following steps assume you already have a virtual network and subnet set up with a VM for testing. You can also [create a new virtual network and subnet](../virtual-network/quick-create-portal.md).

### Create a private endpoint

1. In the portal, navigate to your container registry.
1. Under **Settings**, select **Private endpoint connections (Preview)**.
1. Select **+ Private endpoint**.
1. In the **Basics** tab, enter or select the following information:

    | Setting | Value |
    | ------- | ----- |
    | **Project details** | |
    | Subscription | Select your subscription. |
    | Resource group | Enter the name of an existing group or create a new one.|
    | **Instance details** |  |
    | Name | Enter a unique name. |
    |Region|Select a region.|
    |||
5. Select **Next: Resource**.
6. Enter or select the following information:

    | Setting | Value |
    | ------- | ----- |
    |Connection method  | Select **Connect to an Azure resource in my directory**.|
    | Subscription| Select your subscription. |
    | Resource type | Select **Microsoft.ContainerRegistry/registries**. |
    | Resource |Select the name of your registry|
    |Target subresource |Select **registry**|
    |||
7. Select **Next: Configuration**.
8. Enter or select the  information:

    | Setting | Value |
    | ------- | ----- |
    |**Networking**| |
    | Virtual network| Select the virtual network where your virtual machine is deployed, such as *myDockerVMVNET*. |
    | Subnet | Select a subnet, such as *myDockerVMSubnet* where your virtual machine is deployed. |
    |**Private DNS Integration**||
    |Integrate with private DNS zone |Select **Yes**. |
    |Private DNS Zone |Select *(New) privatelink.azurecr.io* |
    |||

1. Select **Review + create**. You're taken to the **Review + create** page where Azure validates your configuration. 
2. When you see the **Validation passed** message, select **Create**.

After the private endpoint is created, DNS settings in the private zone appear on the endpoint's **Overview** page.

![Endpoint DNS settings](./media/container-registry-private-link/private-endpoint-overview.png)

Your private link is now configured and ready for use.

## Validate private link connection

You should validate that the resources within the subnet of the private endpoint connect to your registry over a private IP address, and have the correct private DNS zone integration.

To validate the private link connection, SSH to the virtual machine you set up in the virtual network.

Run the `nslookup` command to resolve the IP address of your registry over the private link:

```bash
nslookup $registryName.azurecr.io
```

Example output shows the registry's IP address in the address space of the subnet:

```console
[...]
myregistry.azurecr.io       canonical name = myregistry.privatelink.azurecr.io.
Name:   myregistry.privatelink.azurecr.io
Address: 10.0.0.6
```

Compare this result with the public IP address in `nslookup` output for the same registry over a public endpoint:

```console
[...]
Non-authoritative answer:
Name:   myregistry.westeurope.cloudapp.azure.com
Address: 40.78.103.41
```

### Registry operations over private link

Also verify that you can perform registry operations from the virtual machine in the subnet. Make an SSH connection to your virtual machine, and run [az acr login][az-acr-login] to login to your registry. Depending on your VM configuration, you might need to prefix the following commands with `sudo`.

```bash
az acr login --name $registryName
```

Perform registry operations such as `docker pull` to pull a sample image from the registry. Replace `hello-world:v1` with an image and tag appropriate for your registry, prefixed with the registry login server name (all lowercase):

```bash
docker pull myregistry.azurecr.io/hello-world:v1
``` 

Docker successfully pulls the image to the VM.

## Manage private endpoint connections

Manage a registry's private endpoint connections using the Azure portal, or by using commands in the [az acr private-endpoint-connection][az-acr-private-endpoint-connection] command group. Operations include approve, delete, list, reject, or show details of a registry's private endpoint connections.

For example, to list the private endpoint connections of a registry, run the [az acr private-endpoint-connection list][az-acr-private-endpoint-connection-list] command. For example:

```azurecli
az acr private-endpoint-connection list \
  --registry-name $registryName 
```

When you set up a private endpoint connection using the steps in this article, the registry automatically accepts connections from clients and services that have RBAC permissions on the registry. You can set up the endpoint to require manual approval of connections. For information about how to approve and reject private endpoint connections, see [Manage a Private Endpoint Connection](../private-link/manage-private-endpoint.md).

## Clean up resources

If you created all the Azure resources in the same resource group and no longer need them, you can optionally delete the resources by using a single [az group delete](/cli/azure/group) command:

```azurecli
az group delete --name $resourceGroup
```

To clean up your resources in the portal, navigate to your resource group. Once the resource group is loaded, click on **Delete resource group** to remove the resource group and the resources stored there.

## Next steps

* To learn more about Private Link, see the [Azure Private Link](../private-link/private-link-overview.md) documentation.
* An alternative to private link is to set up network access rules to restrict registry access. To learn more, see [Restrict access to an Azure container registry using an Azure virtual network or firewall rules](container-registry-vnet.md).

<!-- LINKS - external -->
[terms-of-use]: https://azure.microsoft.com/support/legal/preview-supplemental-terms
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
[az-acr-private-endpoint-connection]: /cli/azure/acr/private-endpoint-connection
[az-acr-private-endpoint-connection-list]: /cli/azure/acr/private-endpoint-connection#az-acr-private-endpoint-connection-list
[az-acr-private-endpoint-connection-approve]: /cli/azure/acr/private-endpoint-connection#az-acr-private-endpoint-connection-approve
[az-group-create]: /cli/azure/group
[az-role-assignment-create]: /cli/azure/role/assignment#az-role-assignment-create
[az-vm-create]: /cli/azure/vm#az-vm-create
[az-network-vnet-subnet-show]: /cli/azure/network/vnet/subnet/#az-network-vnet-subnet-show
[az-network-vnet-subnet-update]: /cli/azure/network/vnet/subnet/#az-network-vnet-subnet-update
[az-network-vnet-list]: /cli/azure/network/vnet/#az-network-vnet-list
[az-network-private-endpoint-create]: /cli/azure/network/private-endpoint#az-network-private-endpoint-create
[az-network-private-endpoint-show]: /cli/azure/network/private-endpoint#az-network-private-endpoint-show
[az-network-private-dns-zone-create]: /cli/azure/network/private-dns/zone#az-network-private-dns-zone-create
[az-network-private-dns-link-vnet-create]: /cli/azure/network/private-dns/link/vnet#az-network-private-dns-link-vnet-create
[az-network-private-dns-record-set-a-create]: /cli/azure/network/private-dns/record-set/a#az-network-private-dns-record-set-a-create
[az-network-private-dns-record-set-a-add-record]: /cli/azure/network/private-dns/record-set/a#az-network-private-dns-record-set-a-add-record
[az-resource-show]: /cli/azure/resource#az-resource-show
[quickstart-portal]: container-registry-get-started-portal.md
[quickstart-cli]: container-registry-get-started-azure-cli.md
[azure-portal]: https://portal.azure.com
