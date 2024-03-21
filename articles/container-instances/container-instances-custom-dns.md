---
title: Configure custom DNS settings for container group in Azure Container Instances
description: Configure a public or private DNS configuration for a container group
author: tomvcassidy
ms.topic: how-to
ms.service: container-instances
ms.custom: devx-track-azurecli
services: container-instances
ms.author: tomcassidy
ms.date: 05/25/2022
---

# Deploy a container group with custom DNS settings

In [Azure Virtual Network](../virtual-network/virtual-networks-overview.md), you can deploy container groups using the `az container create` command in the Azure CLI. You can also provide advanced configuration settings to the `az container create` command using a YAML configuration file.

This article demonstrates how to deploy a container group with custom DNS settings using a YAML configuration file.

For more information on deploying container groups to a virtual network, see the [Deploy in a virtual network article](container-instances-vnet.md).

> [!IMPORTANT]
> Previously, the process of deploying container groups on virtual networks used [network profiles](./container-instances-virtual-network-concepts.md#network-profile) for configuration. However, network profiles have been retired as of the `2021-07-01` API version. We recommend you use the latest API version, which relies on [subnet IDs](../virtual-network/subnet-delegation-overview.md) instead.

## Prerequisites

* An **active Azure subscription**. If you don't have an active Azure subscription, create a [free account](https://azure.microsoft.com/free) before you begin.

* **Azure CLI**. The command-line examples in this article use the [Azure CLI](/cli/azure/) and are formatted for the Bash shell. You can [install the Azure CLI](/cli/azure/install-azure-cli) locally or use the [Azure Cloud Shell][cloud-shell-bash].

* A **resource group** to manage all the resources you use in this how-to guide. We use the example resource group name **ACIResourceGroup** throughout this article.

   ```azurecli-interactive
   az group create --name ACIResourceGroup --location westus
   ```

## Limitations

For networking scenarios and limitations, see [Virtual network scenarios and resources for Azure Container Instances](container-instances-virtual-network-concepts.md).

> [!IMPORTANT]
> Container group deployment to a virtual network is available for Linux containers in most regions where Azure Container Instances is available. For details, see [Regions and resource availability](container-instances-region-availability.md).
Examples in this article are formatted for the Bash shell. For PowerShell or command prompt, adjust the line continuation characters accordingly.

## Create your virtual network

You'll need a virtual network to deploy a container group with a custom DNS configuration. This virtual network will require a subnet with permissions to create Azure Container Instances resources and a linked private DNS zone to test name resolution.

This guide uses a virtual network named `aci-vnet`, a subnet named `aci-subnet`, and a private DNS zone named `private.contoso.com`. We use **Azure Private DNS Zones**, which you can learn about in the [Private DNS Overview](../dns/private-dns-overview.md).

If you have an existing virtual network that meets these criteria, you can skip to [Deploy your container group](#deploy-your-container-group).

> [!TIP]
> You can modify the following commands with your own information as needed.

1. Create the virtual network using the [az network vnet create][az-network-vnet-create] command. Enter address prefixes in Classless Inter-Domain Routing (CIDR) format (for example: `10.0.0.0/16`).

   ```azurecli-interactive
   az network vnet create \
     --name aci-vnet \
     --resource-group ACIResourceGroup \
     --location westus \
     --address-prefix 10.0.0.0/16
   ```

1. Create the subnet using the [az network vnet subnet create][az-network-vnet-subnet-create] command. The following command creates a subnet in your virtual network with a delegation that permits it to create container groups. For more information about working with subnets, see the [Add, change, or delete a virtual network subnet](../virtual-network/virtual-network-manage-subnet.md). For more information about subnet delegation, see the [Virtual Network Scenarios and Resources article section on delegated subnets](container-instances-virtual-network-concepts.md#subnet-delegated).

   ```azurecli-interactive
   az network vnet subnet create \
     --name aci-subnet \
     --resource-group ACIResourceGroup \
     --vnet-name aci-vnet \
     --address-prefixes 10.0.0.0/24 \
     --delegations Microsoft.ContainerInstance/containerGroups
   ```

1. Record the subnet ID key-value pair from the output of this command. You'll use this in your YAML configuration file later. It will take the form `"id"`: `"/subscriptions/<subscription-ID>/resourceGroups/ACIResourceGroup/providers/Microsoft.Network/virtualNetworks/aci-vnet/subnets/aci-subnet"`.

1. Create the private DNS Zone using the [az network private-dns zone create][az-network-private-dns-zone-create] command.

    ```azurecli-interactive
    az network private-dns zone create -g ACIResourceGroup -n private.contoso.com
    ```

1. Link the DNS zone to your virtual network using the [az network private-dns link vnet create][az-network-private-dns-link-vnet-create] command. The DNS server is only required to test name resolution. The `-e` flag enables automatic hostname registration, which is unneeded, so we set it to `false`.

   ```azurecli-interactive
   az network private-dns link vnet create \
     -g ACIResourceGroup \
     -n aciDNSLink \
     -z private.contoso.com \
     -v aci-vnet \
     -e false
   ```

Once you've completed the steps above, you should see an output with a final key-value pair that reads `"virtualNetworkLinkState"`: `"Completed"`.

## Deploy your container group

> [!NOTE]
> Custom DNS settings are not currently available in the Azure portal for container group deployments. They must be provided with YAML file, Resource Manager template, [REST API](/rest/api/container-instances/2022-09-01/container-groups/create-or-update), or an [Azure SDK](https://azure.microsoft.com/downloads/).

Copy the following YAML into a new file named *custom-dns-deploy-aci.yaml*. Edit the following configurations with your values:

* `dnsConfig`: DNS settings for your containers within your container group.
  * `nameServers`: A list of name servers to be used for DNS lookups.
  * `searchDomains`: DNS suffixes to be appended for DNS lookups.
* `ipAddress`: The private IP address settings for the container group.
  * `ports`: The ports to open, if any.
  * `protocol`: The protocol (TCP or UDP) for the opened port.
* `subnetIDs`: Network settings for the subnet(s) in the virtual network.
  * `id`: The full Resource Manager resource ID of the subnet, which you obtained earlier.

> [!NOTE]
> The DNS config fields aren't automatically queried at this time, so these fields must be explicitly filled out.

```yaml
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
    searchDomains: contoso.com # DNS search suffix
  ipAddress:
    type: Private
    ports:
    - port: 80
  subnetIds:
    - id: /subscriptions/<subscription-ID>/resourceGroups/ACIResourceGroup/providers/Microsoft.Network/virtualNetworks/aci-vnet/subnets/aci-subnet
  osType: Linux
tags: null
type: Microsoft.ContainerInstance/containerGroups
```

Deploy the container group with the [az container create][az-container-create] command, specifying the YAML file name with the `--file` parameter:

```azurecli-interactive
az container create --resource-group ACIResourceGroup \
  --file custom-dns-deploy-aci.yaml
```

Once the deployment is complete, run the [az container show][az-container-show] command to display its status. Sample output:

```azurecli-interactive
az container show --resource-group ACIResourceGroup --name pwsh-vnet-dns -o table
```

```output
Name              ResourceGroup    Status    Image                                       IP:ports     Network    CPU/Memory       OsType    Location
----------------  ---------------  --------  ------------------------------------------  -----------  ---------  ---------------  --------  ----------
pwsh-vnet-dns     ACIResourceGroup  Running   mcr.microsoft.com/powershell                10.0.0.5:80  Private    1.0 core/2.0 gb  Linux     westus
```

After the status shows `Running`, execute the [az container exec][az-container-exec] command to obtain bash access within the container.

```azurecli-interactive
az container exec --resource-group ACIResourceGroup --name pwsh-vnet-dns --exec-command "/bin/bash"
```

Validate that DNS is working as expected from within your container. For example, read the `/etc/resolv.conf` file to ensure it's configured with the DNS settings provided in the YAML file.

```bash
root@wk-caas-81d609b206c541589e11058a6d260b38-90b0aff460a737f346b3b0:/# cat /etc/resolv.conf

nameserver 10.0.0.10
nameserver 10.0.0.11
search contoso.com
```

## Clean up resources

### Delete container instances

When you're finished with the container instance you created, delete it with the [az container delete][az-container-delete] command:

```azurecli-interactive
az container delete --resource-group ACIResourceGroup --name pwsh-vnet-dns -y
```

### Delete network resources

If you don't plan to use this virtual network again, you can delete it with the [az network vnet delete][az-network-vnet-delete] command:

```azurecli-interactive
az network vnet delete --resource-group ACIResourceGroup --name aci-vnet
```

### Delete resource group

If you don't plan to use this resource group outside of this guide, you can delete it with [az group delete][az-group-delete] command:

```azurecli-interactive
az group delete --name ACIResourceGroup
```

Enter `y` when prompted if you're sure you wish to perform the operation.

## Next steps

See the Azure quickstart template [Create an Azure container group with VNet](https://github.com/Azure/azure-quickstart-templates/tree/master/quickstarts/microsoft.containerinstance/aci-vnet), to deploy a container group within a virtual network.

<!-- LINKS - Internal -->
[az-network-vnet-create]: /cli/azure/network/vnet#az-network-vnet-create
[az-network-vnet-subnet-create]: /cli/azure/network/vnet/subnet#az-network-vnet-subnet-create
[az-network-private-dns-zone-create]: /cli/azure/network/private-dns/zone#az-network-private-dns-zone-create
[az-network-private-dns-link-vnet-create]: /cli/azure/network/private-dns/link/vnet#az-network-private-dns-link-vnet-create
[az-container-create]: /cli/azure/container#az-container-create
[az-container-show]: /cli/azure/container#az-container-show
[az-container-exec]: /cli/azure/container#az-container-exec
[az-container-delete]: /cli/azure/container#az-container-delete
[az-network-vnet-delete]: /cli/azure/network/vnet#az-network-vnet-delete
[az-group-delete]: /cli/azure/group#az-group-create
[cloud-shell-bash]: ../cloud-shell/overview.md
