---
title: Configure custom DNS settings for container group in Azure Container Instances
description: Configure a public or private DNS configuration for a container group
author: tomvcassidy
ms.topic: conceptual
ms.service: container-instances
services: container-instances
ms.author: tomcassidy
ms.date: 05/11/2022
---

# Deploy a container group with custom DNS settings

In [Azure Virtual Network](../virtual-network/virtual-networks-overview.md), you can deploy container groups using the `az container create` command in the Azure CLI. You can then provide advanced configuration settings to the `az container create` command with a YAML configuration file.  

This article demonstrates how to deploy a container group with custom DNS settings using a YAML configuration file.  

For more information on deploying container groups to a virtual network, see the [Deploy in a virtual network article](container-instances-vnet.md).

## Prerequisites

**Azure CLI**: The command-line examples in this article use the [Azure CLI](/cli/azure/) and are formatted for the Bash shell. You can [install the Azure CLI](/cli/azure/install-azure-cli) locally, or use the [Azure Cloud Shell][cloud-shell-bash].

**DNS Server**: A DNS server is required to test name resolution. One possible implementation could be Azure Private DNS Zones, which you can learn about in the [Private DNS Overview](../dns/private-dns-overview.md).

## Limitations

For networking scenarios and limitations, see [Virtual network scenarios and resources for Azure Container Instances](container-instances-virtual-network-concepts.md).

> [!IMPORTANT]
> Container group deployment to a virtual network is available for Linux containers in most regions where Azure Container Instances is available. For details, see [Regions and resource availability](container-instances-region-availability.md).
Examples in this article are formatted for the Bash shell. For PowerShell or command prompt, adjust the line continuation characters accordingly.

## Before you begin

You will need a virtual network and network profile to enable the use of custom DNS configuration within container group deployments. A network profile will be automatically created when you deploy the container group to a virtual network.

## Deploy a container group a to new virtual network

Execute [az container create][az-container-create] with the following arguments to deploy a new container group with a new virtual network:

* Virtual network name
* Virtual network address prefix in Classless Inter-Domain Routing (CIDR) format
* Subnet name
* Subnet address prefix in CIDR format

The virtual network address and subnet address prefixes specify the virtual network and subnet address spaces. These values are represented in CIDR format (for example: `10.0.0.0/16`). For more information about working with subnets, see the [Add, change, or delete a virtual network subnet](../virtual-network/virtual-network-manage-subnet.md).

You can deploy multiple container groups to the same subnet by specifying the virtual network and subnet names, or the automatically created network profile. Since Azure delegates the subnet to Azure Container Instances, you can *only* deploy container groups to the subnet. See [the Virtual Network Scenarios and Resources article section on delegated subnets](container-instances-virtual-network-concepts.md#subnet-delegated) for details.

### Example - Deploy container group to a new virtual network

The [az container create][az-container-create] command specifies settings for a new virtual network and subnet. This command deploys the public Microsoft [aci-helloworld][aci-helloworld] container, which runs a small Node.js webserver serving a static web page. Deploy this container group so that Azure can create a network profile for future deployments.

```azurecli
az container create \
  --name appcontainer \
  --resource-group myResourceGroup \
  --image mcr.microsoft.com/azuredocs/aci-helloworld \
  --vnet aci-vnet \
  --vnet-address-prefix 10.0.0.0/16 \
  --subnet aci-subnet \
  --subnet-address-prefix 10.0.0.0/24
```

The first container group deployment to a new virtual network takes a few minutes to create the network resources. Container groups later deployed to the same subnet will deploy more quickly.

## Deploy to existing virtual network

To deploy a container group to an existing virtual network:

1. Create a subnet within your virtual network or use an existing subnet with no resources.
1. Deploy a container group with [az container create][az-container-create] and specify one of the following networking arguments:
   * Virtual network name and subnet name.
   * Virtual network resource ID and subnet resource ID, which allows using a virtual network from a different resource group.
   * Network profile name or ID, which you can obtain using [az network profile list][az-network-profile-list].

## Deploy with custom DNS settings

Now that you have deployed a container group to a virtual network, a network profile specifying the network settings has been automatically created. This profile will be required for future deployments in which you want to use custom DNS settings.  

Use the `az network profile` command to obtain the network profile ID.

### Get the network profile ID

You can use the following `az network profile` commands to view and obtain the network profile ID:

* `az network profile list`
* `az network profile show`

#### `az network profile list`

```azurecli
# View a list of network profiles
az network profile list -o table
```

Sample output:

```console
Location        Name                             ProvisioningState    ResourceGroup    ResourceGuid
--------------  -------------------------------  -------------------  ---------------  ------------------------------------
eastus          appcontainer-networkProfile      Succeeded            acilab           32eabc0e-b15f-4b2c-84bf-d21c8f8fc354
```

#### `az network profile show`

```azurecli
az network profile show --resource-group myResourceGroup --name appcontainer-networkProfile --query id
```

Once obtained, copy the ID to use later.

### Example - Use YAML configuration file

>[!NOTE]
> Custom DNS settings are not currently available in the Azure portal for container group deployments. They must be provided with YAML file, Resource Manager template, [REST API](/rest/api/container-instances/containergroups/createorupdate), or an [Azure SDK](https://azure.microsoft.com/downloads/)
Once you have the network profile ID, copy the following YAML into a new file named *custom-dns-deploy-aci.yaml*. Edit the following configurations with your values:

* `dnsConfig`: DNS settings for your containers within your container group.
  * `nameServers`: A list of name servers to be used for DNS lookups.
  * `searchDomains`: DNS suffixes to be appended for DNS lookups.
* `ipAddress`: The private IP address settings for the container group.
  * `ports`: The ports to open, if any.
  * `protocol`: The protocol (TCP or UDP) for the opened port.
* `networkProfile`: Network settings for the virtual network and subnet.
  * `id`: The full Resource Manager resource ID of the `networkProfile` that you obtained earlier.

```YAML
apiVersion: '2021-07-01'
location: westus
name: pwsh-vnet-dns
properties:
  containers:
  - name: pwsh-vnet-dns
    properties:
      command:
      - /bin/bash
      - -c
      - echo hello; sleep 10000
      environmentVariables: []
      image: mcr.microsoft.com/powershell:latest
      ports:
      - port: 80
      resources:
        requests:
          cpu: 1.0
          memoryInGB: 2.0
  dnsConfig:
    nameServers:
    - 10.0.0.10 # DNS Server 1
    - 10.0.0.11 # DNS Server 2
    searchDomains: constoso.com # DNS search suffix
  ipAddress:
    type: Private
    ports:
    - port: 80
  networkProfile:
    id: /subscriptions/<SubscriptionID>/resourceGroups/<myResourceGroup>/providers/Microsoft.Network/networkProfiles/<appcontainer-networkProfile>
  osType: Linux
tags: null
type: Microsoft.ContainerInstance/containerGroups
```

Deploy the container group with the [az container create][az-container-create] command, specifying the YAML file name for the `--file` parameter:

```azurecli
az container create --resource-group myResourceGroup \
  --file custom-dns-deploy-aci.yaml
```

Once the deployment is complete, run the [az container show][az-container-show] command to display its status. Sample output:

```azurecli
az container show --resource-group myResourceGroup --name pwsh-vnet-dns -o table
```

```console
Name              ResourceGroup    Status    Image                                       IP:ports     Network    CPU/Memory       OsType    Location
----------------  ---------------  --------  ------------------------------------------  -----------  ---------  ---------------  --------  ----------
pwsh-vnet-dns     myResourceGroup  Running   mcr.microsoft.com/powershell                10.0.0.5:80  Private    1.0 core/2.0 gb  Linux     westus
```

After the status shows `Running`, execute the `az container exec` command to obtain bash access within the container.

```azurecli
az container exec --resource-group myResourceGroup --name pwsh-vnet-dns --exec-command "/bin/bash"
```

Validate that DNS is working as expected from within your container. For example, read the `/etc/resolv.conf` file to ensure it is configured with the DNS settings provided in the YAML file.

```console
root@wk-caas-81d609b206c541589e11058a6d260b38-90b0aff460a737f346b3b0:/# cat /etc/resolv.conf

nameserver 10.0.0.10
nameserver 10.0.0.11
search contoso.com
```

## Clean up resources

### Delete container instances

When you're finished with the container instances you created, delete them with the following commands:

```azurecli
az container delete --resource-group myResourceGroup --name appcontainer -y
az container delete --resource-group myResourceGroup --name pwsh-vnet-dns -y
```

### Delete network resources

This feature currently requires several commands to delete the network resources you created earlier. If you used the example commands from this article to create your virtual network and subnet, you can use the following script to delete the network resources. The script assumes that your resource group contains a single virtual network with a single network profile.

Before executing the script, set the `RES_GROUP` variable to the name of the resource group containing the virtual network and subnet that should be deleted. Update the name of the virtual network if you did not use the `aci-vnet` name suggested earlier.

The script is formatted for the Bash shell. For PowerShell or command prompt, adjust variable assignment and accessors accordingly.

> [!WARNING]
> This script deletes resources! It deletes the virtual network and all subnets it contains. Prior to running this script, ensure that you no longer need *any* of the resources in the virtual network, including any subnets it contains. Once deleted, **these resources are unrecoverable**.

```azurecli
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

See the Azure QuickStart template, [Create an Azure container group with VNet](https://github.com/Azure/azure-quickstart-templates/tree/master/101-aci-vnet), to deploy a container group within a virtual network.

<!-- IMAGES -->
[aci-vnet-01]: ./media/container-instances-virtual-network-concepts/aci-vnet-01.png

<!-- LINKS - External -->
[aci-helloworld]: https://hub.docker.com/_/microsoft-azuredocs-aci-helloworld

<!-- LINKS - Internal -->
[az-container-create]: /cli/azure/container#az-container-create
[az-container-show]: /cli/azure/container#az-container-show
[az-network-vnet-create]: /cli/azure/network/vnet#az-network-vnet-create
[az-network-profile-list]: /cli/azure/network/profile#az-network-profile-list
[cloud-shell-bash]: /cloud-shell/overview.md
