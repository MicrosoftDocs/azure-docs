---
title: Deploy container group to Azure virtual network
description: Learn how to deploy a container group to a new or existing Azure virtual network via the Azure CLI.
ms.topic: how-to
ms.author: tomcassidy
author: tomvcassidy
ms.service: container-instances
services: container-instances
ms.date: 06/17/2022
ms.custom: devx-track-azurecli, devx-track-linux
---

# Deploy container instances into an Azure virtual network

[Azure Virtual Network](../virtual-network/virtual-networks-overview.md) provides secure, private networking for your Azure and on-premises resources. By deploying container groups into an Azure virtual network, your containers can communicate securely with other resources in the virtual network.

This article shows how to use the [az container create][az-container-create] command in the Azure CLI to deploy container groups to either a new virtual network or an existing virtual network. 

> [!IMPORTANT]
> Before deploying container groups in virtual networks, we suggest checking the limitation first. For networking scenarios and limitations, see [Virtual network scenarios and resources for Azure Container Instances](container-instances-virtual-network-concepts.md).

> [!IMPORTANT]
> Container group deployment to a virtual network is generally available for Linux and Windows containers, in most regions where Azure Container Instances is available. For details, see [available-regions][available-regions]. 

[!INCLUDE [network profile callout](./includes/network-profile/network-profile-callout.md)]

Examples in this article are formatted for the Bash shell. If you prefer another shell such as PowerShell or Command Prompt, adjust the line continuation characters accordingly.

## Deploy to new virtual network

> [!NOTE]
> If you are using subnet IP range /29 to have only 3 IP addresses. we recommend always to go one range above (never below). For example, use subnet IP range /28 so you can have at least 1 or more IP buffer per container group. By doing this, you can avoid containers in stuck, not able to start, restart or even not able to stop states.

To deploy to a new virtual network and have Azure create the network resources for you automatically, specify the following when you execute [az container create][az-container-create]:

* Virtual network name
* Virtual network address prefix in CIDR format
* Subnet name
* Subnet address prefix in CIDR format

The virtual network and subnet address prefixes specify the address spaces for the virtual network and subnet, respectively. These values are represented in Classless Inter-Domain Routing (CIDR) notation, for example `10.0.0.0/16`. For more information about working with subnets, see [Add, change, or delete a virtual network subnet](../virtual-network/virtual-network-manage-subnet.md).

Once you've deployed your first container group with this method, you can deploy to the same subnet by specifying the virtual network and subnet names, or the network profile that Azure automatically creates for you. Because Azure delegates the subnet to Azure Container Instances, you can deploy *only* container groups to the subnet.

### Example

The following [az container create][az-container-create] command specifies settings for a new virtual network and subnet. Provide the name of a resource group that was created in a region where container group deployments in a virtual network are [available](container-instances-region-availability.md). This command deploys the public Microsoft [aci-helloworld][aci-helloworld] container that runs a small Node.js webserver serving a static web page. In the next section, you'll deploy a second container group to the same subnet, and test communication between the two container instances.

```azurecli-interactive
az container create \
  --name appcontainer \
  --resource-group myResourceGroup \
  --image mcr.microsoft.com/azuredocs/aci-helloworld \
  --vnet aci-vnet \
  --vnet-address-prefix 10.0.0.0/16 \
  --subnet aci-subnet \
  --subnet-address-prefix 10.0.0.0/24
```

When you deploy to a new virtual network by using this method, the deployment can take a few minutes while the network resources are created. After the initial deployment, additional container group deployments to the same subnet complete more quickly.

## Deploy to existing virtual network

To deploy a container group to an existing virtual network:

1. Create a subnet within your existing virtual network, use an existing subnet in which a container group is already deployed, or use an existing subnet emptied of *all* other resources and configuration.
1. Deploy a container group with [az container create][az-container-create] and specify one of the following:
   * Virtual network name and subnet name
   * Virtual network resource ID and subnet resource ID, which allows using a virtual network from a different resource group
   * Network profile name or ID, which you can obtain using [az network profile list][az-network-profile-list]

### Example

The following example deploys a second container group to the same subnet created previously, and verifies communication between the two container instances.

First, get the IP address of the first container group you deployed, the *appcontainer*:

```azurecli-interactive
az container show --resource-group myResourceGroup \
  --name appcontainer \
  --query ipAddress.ip --output tsv
```

The output displays the IP address of the container group in the private subnet. For example:

```output
10.0.0.4
```

Now, set `CONTAINER_GROUP_IP` to the IP you retrieved with the `az container show` command, and execute the following `az container create` command. This second container, *commchecker*, runs an Alpine Linux-based image and executes `wget` against the first container group's private subnet IP address.

```azurecli-interactive
CONTAINER_GROUP_IP=<container-group-IP-address>

az container create \
  --resource-group myResourceGroup \
  --name commchecker \
  --image alpine:3.5 \
  --command-line "wget $CONTAINER_GROUP_IP" \
  --restart-policy never \
  --vnet aci-vnet \
  --subnet aci-subnet
```

After this second container deployment has completed, pull its logs so you can see the output of the `wget` command it executed:

```azurecli-interactive
az container logs --resource-group myResourceGroup --name commchecker
```

If the second container communicated successfully with the first, output is similar to:

```output
Connecting to 10.0.0.4 (10.0.0.4:80)
index.html           100% |*******************************|  1663   0:00:00 ETA
```

The log output should show that `wget` was able to connect and download the index file from the first container using its private IP address on the local subnet. Network traffic between the two container groups remained within the virtual network.

### Example - YAML

You can also deploy a container group to an existing virtual network by using a YAML file, a [Resource Manager template](https://github.com/Azure/azure-quickstart-templates/tree/master/quickstarts/microsoft.containerinstance/aci-vnet), or another programmatic method such as with the Python SDK. 

For example, when using a YAML file, you can deploy to a virtual network with a subnet delegated to Azure Container Instances. Specify the following properties:

* `ipAddress`: The private IP address settings for the container group.
  * `ports`: The ports to open, if any.
  * `protocol`: The protocol (TCP or UDP) for the opened port.
* `subnetIds`: The resource IDs of the subnets to be deployed to
  * `id`: The resource ID of the subnet
  * `name`: The name of the subnet

This YAML creates a container group named *appcontaineryaml* in your virtual network.

```YAML
apiVersion: '2021-07-01'
location: westus
name: appcontaineryaml
properties:
  containers:
  - name: appcontaineryaml
    properties:
      image: mcr.microsoft.com/azuredocs/aci-helloworld
      ports:
      - port: 80
        protocol: TCP
      resources:
        requests:
          cpu: 1.0
          memoryInGB: 1.5
  ipAddress:
    type: Private
    ports:
    - protocol: tcp
      port: '80'
  osType: Linux
  restartPolicy: Always
  subnetIds:
    - id: <subnet-id>
      name: default
tags: null
type: Microsoft.ContainerInstance/containerGroups
```

Deploy the container group with the [az container create][az-container-create] command, specifying the YAML file name for the `--file` parameter:

```azurecli-interactive
az container create --resource-group myResourceGroup \
  --file vnet-deploy-aci.yaml
```

Once the deployment completes, run the [az container show][az-container-show] command to display its status. Sample output:

```output
Name              ResourceGroup    Status    Image                                       IP:ports     Network    CPU/Memory       OsType    Location
----------------  ---------------  --------  ------------------------------------------  -----------  ---------  ---------------  --------  ----------
appcontaineryaml  myResourceGroup  Running   mcr.microsoft.com/azuredocs/aci-helloworld  10.0.0.5:80  Private    1.0 core/1.5 gb  Linux     westus
```

## Clean up resources

### Delete container instances

When you're done working with the container instances you created, delete them with the following commands:

```azurecli-interactive
az container delete --resource-group myResourceGroup --name appcontainer -y
az container delete --resource-group myResourceGroup --name commchecker -y
az container delete --resource-group myResourceGroup --name appcontaineryaml -y
```

### Delete network resources

This feature currently requires several additional commands to delete the network resources you created earlier. If you used the example commands in previous sections of this article to create your virtual network and subnet, then you can use the following script to delete those network resources. The script assumes that your resource group contains a single virtual network with a single network profile.

Before executing the script, set the `RES_GROUP` variable to the name of the resource group containing the virtual network and subnet that should be deleted. Update the name of the virtual network if you did not use the `aci-vnet` name suggested earlier. The script is formatted for the Bash shell. If you prefer another shell such as PowerShell or Command Prompt, you'll need to adjust variable assignment and accessors accordingly.

> [!WARNING]
> This script deletes resources! It deletes the virtual network and all subnets it contains. Be sure that you no longer need *any* of the resources in the virtual network, including any subnets it contains, prior to running this script. Once deleted, **these resources are unrecoverable**.

```azurecli-interactive
# Replace <my-resource-group> with the name of your resource group
# Assumes one virtual network in resource group
RES_GROUP=<my-resource-group>

# Get network profile ID
# Assumes one profile in virtual network
NETWORK_PROFILE_ID=$(az network profile list --resource-group $RES_GROUP --query [0].id --output tsv)

# Delete the network profile
az network profile delete --id $NETWORK_PROFILE_ID -y

# Delete virtual network
az network vnet delete --resource-group $RES_GROUP --name aci-vnet
```

## Next steps

* To deploy a new virtual network, subnet, network profile, and container group using a Resource Manager template, see [Create an Azure container group with VNet](https://github.com/Azure/azure-quickstart-templates/tree/master/quickstarts/microsoft.containerinstance/aci-vnet).

* To deploy Azure Container Instances that can pull images from an Azure Container Registry through a private endpoint, see [Deploy to Azure Container Instances from Azure Container Registry using a managed identity](../container-instances/using-azure-container-registry-mi.md).

<!-- IMAGES -->
[aci-vnet-01]: ./media/container-instances-vnet/aci-vnet-01.png

<!-- LINKS - External -->
[aci-helloworld]: https://hub.docker.com/_/microsoft-azuredocs-aci-helloworld

<!-- LINKS - Internal -->
[az-container-create]: /cli/azure/container#az_container_create
[az-container-show]: /cli/azure/container#az_container_show
[az-network-vnet-create]: /cli/azure/network/vnet#az_network_vnet_create
[az-network-profile-list]: /cli/azure/network/profile#az_network_profile_list
[available-regions]: https://azure.microsoft.com/explore/global-infrastructure/products-by-region/?products=container-instances
