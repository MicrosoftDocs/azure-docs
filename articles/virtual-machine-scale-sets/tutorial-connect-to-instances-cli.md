---
title: Connect to instances using the Azure CLI
description: Learn how to use the Azure CLI to connect to instances in your Virtual Machine Scale Set.
author: ju-shim
ms.author: jushiman
ms.topic: tutorial
ms.service: virtual-machine-scale-sets
ms.date: 12/16/2022
ms.reviewer: mimckitt
ms.custom: mimckitt, devx-track-azurecli

---

# Tutorial: Connect to Virtual Machine Scale Set instances using the Azure CLI
A Virtual Machine Scale Set allows you to deploy and manage a set of virtual machines. Throughout the lifecycle of a Virtual Machine Scale Set, you may need to run one or more management tasks. In this tutorial you learn how to:

> [!div class="checklist"]
> * List connection information
> * Connect to individual instances using SSH

[!INCLUDE [quickstarts-free-trial-note](../../includes/quickstarts-free-trial-note.md)]

[!INCLUDE [azure-cli-prepare-your-environment.md](~/reusable-content/azure-cli/azure-cli-prepare-your-environment.md)]

This article requires version 2.0.29 or later of the Azure CLI. If using Azure Cloud Shell, the latest version is already installed. 

## List instances in a scale set
If you do not have a scale set already created, see [Tutorial: Create and manage a Virtual Machine Scale Set with the Azure CLI](tutorial-create-and-manage-cli.md)

List all the instances in your Virtual Machine Scale Set. 

```azurecli-interactive
az vmss list-instances \
  --resource-group myResourceGroup \
  --name myScaleSet \
  --output table
```

```output
Location    Name                 ResourceGroup
----------  -------------------  ---------------
eastus      myScaleSet_0e7d4d21  myResourceGroup
eastus      myScaleSet_39379fc3  myResourceGroup
```

## Get NIC information
Use [az vm nic list](/cli/azure/vm/nic#az-vm-nic-list) and the name of the individual VM instance to find the NIC name.

```azurecli-interactive
az vm nic list \
  --resource-group myResourceGroup
  --vm-name myScaleSet_0e7d4d21
```

```output
[
  {
    "deleteOption": "Delete",
    "id": "/subscriptions/resourceGroups/myResourceGroup/providers/Microsoft.Network/networkInterfaces/mysca2215Nic-828c525a",
    "primary": true,
    "resourceGroup": "myResourceGroup"
  }
]
```

Using the VM name and NIC name, get the private IP address of the NIC, the Inbound NAT rule name and load balancer name using [az vm nic show](/cli/azure/vm/nic#az-vm-nic-show).


```azurecli-interactive
az vm nic show --resource-group myResourceGroup --vm-name myScaleSet_0e7d4d21 --nic mysca2215Nic-828c525a
```

```output
{
  "enableAcceleratedNetworking": false,
  "id": "/subscriptions/resourceGroups/myResourceGroup/providers/Microsoft.Network/networkInterfaces/mysca2215Nic-828c525a",
  "ipConfigurations": [
    {
      "id": "/subscriptions/resourceGroups/myResourceGroup/providers/Microsoft.Network/networkInterfaces/mysca2215Nic-828c525a/ipConfigurations/mysca2215IPConfig",
      "loadBalancerBackendAddressPools": [
        {
          "id": "/subscriptions/resourceGroups/myResourceGroup/providers/Microsoft.Network/loadBalancers/myScaleSetLB/backendAddressPools/myScaleSetLBBEPool",
        }
      ],
      "name": "mysca2215IPConfig",
      "primary": true,
      "privateIpAddress": "10.0.0.5",
      "privateIpAddressVersion": "IPv4",
      "privateIpAllocationMethod": "Dynamic",
      "provisioningState": "Succeeded",
      "resourceGroup": "myResourceGroup",
      "subnet": {
        "id": "/subscriptions/resourceGroups/myResourceGroup/providers/Microsoft.Network/virtualNetworks/myScaleSetVNET/subnets/myScaleSetSubnet",
        "resourceGroup": "myResourceGroup",
      },
      "type": "Microsoft.Network/networkInterfaces/ipConfigurations",
    }
  ],
  "location": "eastus",
  "name": "mysca2215Nic-828c525a",
  "networkSecurityGroup": {
    "id": "/subscriptions/resourceGroups/myResourceGroup/providers/Microsoft.Network/networkSecurityGroups/myScaleSetNSG",
    "resourceGroup": "myResourceGroup",
  },
  "nicType": "Standard",
  "primary": true,
  "provisioningState": "Succeeded",
  "resourceGroup": "myResourceGroup",
  "tapConfigurations": [],
  "type": "Microsoft.Network/networkInterfaces",
  "virtualMachine": {
    "id": "/subscriptions/resourceGroups/myResourceGroup/providers/Microsoft.Compute/virtualMachines/myScaleSet_0e7d4d21",
    "resourceGroup": "myResourceGroup"
  },
}
```

## Get backend pool details
Using the backend pool name and load balancer name, get the port for the private IP address of the instance you want to connect to with [az network lb list-mapping](/cli/azure/network/lb#az-network-lb-list-mapping).

```azurecli-interactive
az network lb list-mapping --backend-pool-name myScaleSetLBBEPool --resource-group myResourceGroup --name myScaleSetLB --request ip=10.0.0.5
```

```output
{
  "inboundNatRulePortMappings": [
    {
      "backendPort": 22,
      "frontendPort": 50001,
      "inboundNatRuleName": "NatRule",
      "protocol": "Tcp"
    }
  ]
}
```

## Get public IP of load balancer
Get the public IP of the load balancer using [az network public-ip list](/cli/azure/network/public-ip#az-network-public-ip-list).

```azurecli-interactive
az network public-ip list --resource-group myResourceGroup
```

```output
[
  {
    "id": "/subscriptions/resourceGroups/myResourceGroup/providers/Microsoft.Network/publicIPAddresses/myScaleSetLBPublicIP",
    "idleTimeoutInMinutes": 4,
    "ipAddress": "20.172.211.239",
    "ipConfiguration": {
      "id": "/subscriptions/resourceGroups/myResourceGroup/providers/Microsoft.Network/loadBalancers/myScaleSetLB/frontendIPConfigurations/loadBalancerFrontEnd",
      "resourceGroup": "myResourceGroup"
    },
    "ipTags": [],
    "location": "eastus",
    "name": "myScaleSetLBPublicIP",
    "provisioningState": "Succeeded",
    "publicIPAddressVersion": "IPv4",
    "publicIPAllocationMethod": "Static",
    "resourceGroup": "myResourceGroup",
    "sku": {
      "name": "Standard",
      "tier": "Regional"
    },
    "tags": {},
    "type": "Microsoft.Network/publicIPAddresses"
  }
]
```

## Connect to your instance

SSH to the machine using the load balancer IP and the port of the machine you want to connect to.

```azurecli-interactive
ssh azureuser@20.172.211.239 -p 50000
```


## Next steps
In this tutorial, you learned how to list the instances in your scale set and connect via SSH to an individual instance.

> [!div class="checklist"]
> * List and view instances in a scale set
> * Gather networking information for individual instances in a scale set
> * Connect to individual VM instances inside a scale set


> [!div class="nextstepaction"]
> [Modify a scale set](tutorial-modify-scale-sets-cli.md)
