---
title: Deploy Linux VMs to dedicated hosts using the CLI 
description: Deploy VMs to dedicated hosts using the Azure CLI.
author: cynthn
ms.service: virtual-machines-linux
ms.topic: article
ms.date: 01/09/2020
ms.author: cynthn

#Customer intent: As an IT administrator, I want to learn about more about using a dedicated host for my Azure virtual machines
---

# Deploy VMs to dedicated hosts using the Azure CLI
 

This article guides you through how to create an Azure [dedicated host](dedicated-hosts.md) to host your virtual machines (VMs). 

Make sure that you have installed Azure CLI version 2.0.70 or later, and signed in to an Azure account using `az login`. 


## Limitations

- Virtual machine scale sets are not currently supported on dedicated hosts.
- The sizes and hardware types available for dedicated hosts vary by region. Refer to the host [pricing page](https://aka.ms/ADHPricing) to learn more.

## Create resource group 
An Azure resource group is a logical container into which Azure resources are deployed and managed. Create the resource group with az group create. The following example creates a resource group named *myDHResourceGroup* in the *East US* location.

```bash
az group create --name myDHResourceGroup --location eastus 
```
 
## List Available host SKUs in a region
Not all host SKUs are available in all regions, and availability zones. 

List host availability, and any offer restrictions before you start provisioning dedicated hosts. 

```bash
az vm list-skus -l eastus2  -r hostGroups/hosts  -o table  
```
 
## Create a host group 

A **host group** is a resource that represents a collection of dedicated hosts. You create a host group in a region and an availability zone, and add hosts to it. When planning for high availability, there are additional options. You can use one or both of the following options with your dedicated hosts: 
- Span across multiple availability zones. In this case, you are required to have a host group in each of the zones you wish to use.
- Span across multiple fault domains which are mapped to physical racks. 
 
In either case, you are need to provide the fault domain count for your host group. If you do not want to span fault domains in your group, use a fault domain count of 1. 

You can also decide to use both availability zones and fault domains. 

In this example, we will use [az vm host group create](/cli/azure/vm/host/group#az-vm-host-group-create) to create a host group using both availability zones and fault domains. 

```bash
az vm host group create \
   --name myHostGroup \
   -g myDHResourceGroup \
   -z 1 \
   --platform-fault-domain-count 2 
``` 

### Other examples

You can also use [az vm host group create](/cli/azure/vm/host/group#az-vm-host-group-create) to create a host group in availability zone 1 (and no fault domains).

```bash
az vm host group create \
   --name myAZHostGroup \
   -g myDHResourceGroup \
   -z 1 \
   --platform-fault-domain-count 1 
```
 
The following uses [az vm host group create](/cli/azure/vm/host/group#az-vm-host-group-create) to create a host group by using fault domains only (to be used in regions where availability zones are not supported). 

```bash
az vm host group create \
   --name myFDHostGroup \
   -g myDHResourceGroup \
   --platform-fault-domain-count 2 
```
 
## Create a host 

Now let's create a dedicated host in the host group. In addition to a name for the host, you are required to provide the SKU for the host. Host SKU captures the supported VM series as well as the hardware generation for your dedicated host.  

For more information about the host SKUs and pricing, see [Azure Dedicated Host pricing](https://aka.ms/ADHPricing).

Use [az vm host create](/cli/azure/vm/host#az-vm-host-create) to create a host. If you set a fault domain count for your host group, you will be asked to specify the fault domain for your host.  

```bash
az vm host create \
   --host-group myHostGroup \
   --name myHost \
   --sku DSv3-Type1 \
   --platform-fault-domain 1 \
   -g myDHResourceGroup
```


 
## Create a virtual machine 
Create a virtual machine within a dedicated host using [az vm create](/cli/azure/vm#az-vm-create). If you specified an availability zone when creating your host group, you are required to use the same zone when creating the virtual machine.

```bash
az vm create \
   -n myVM \
   --image debian \
   --generate-ssh-keys \
   --host-group myHostGroup \
   --host myHost \
   --generate-ssh-keys \
   --size Standard_D4s_v3 \
   -g myDHResourceGroup \
   --zone 1
```
 
> [!WARNING]
> If you create a virtual machine on a host which does not have enough resources, the virtual machine will be created in a FAILED state. 


## Check the status of the host

You can check the host health status and how many virtual machines you can still deploy to the host using [az vm host get-instance-view](/cli/azure/vm/host#az-vm-host-get-instance-view).

```bash
az vm host get-instance-view \
   -g myDHResourceGroup \
   --host-group myHostGroup \
   --name myHost
```
 The output will look similar to this:
 
```json
{
  "autoReplaceOnFailure": true,
  "hostId": "6de80643-0f45-4e94-9a4c-c49d5c777b62",
  "id": "/subscriptions/10101010-1010-1010-1010-101010101010/resourceGroups/myDHResourceGroup/providers/Microsoft.Compute/hostGroups/myHostGroup/hosts/myHost",
  "instanceView": {
    "assetId": "12345678-1234-1234-abcd-abc123456789",
    "availableCapacity": {
      "allocatableVms": [
        {
          "count": 31.0,
          "vmSize": "Standard_D2s_v3"
        },
        {
          "count": 15.0,
          "vmSize": "Standard_D4s_v3"
        },
        {
          "count": 7.0,
          "vmSize": "Standard_D8s_v3"
        },
        {
          "count": 3.0,
          "vmSize": "Standard_D16s_v3"
        },
        {
          "count": 1.0,
          "vmSize": "Standard_D32-8s_v3"
        },
        {
          "count": 1.0,
          "vmSize": "Standard_D32-16s_v3"
        },
        {
          "count": 1.0,
          "vmSize": "Standard_D32s_v3"
        },
        {
          "count": 1.0,
          "vmSize": "Standard_D48s_v3"
        },
        {
          "count": 0.0,
          "vmSize": "Standard_D64-16s_v3"
        },
        {
          "count": 0.0,
          "vmSize": "Standard_D64-32s_v3"
        },
        {
          "count": 0.0,
          "vmSize": "Standard_D64s_v3"
        }
      ]
    },
    "statuses": [
      {
        "code": "ProvisioningState/succeeded",
        "displayStatus": "Provisioning succeeded",
        "level": "Info",
        "message": null,
        "time": "2019-07-24T21:22:40.604754+00:00"
      },
      {
        "code": "HealthState/available",
        "displayStatus": "Host available",
        "level": "Info",
        "message": null,
        "time": null
      }
    ]
  },
  "licenseType": null,
  "location": "eastus2",
  "name": "myHost",
  "platformFaultDomain": 1,
  "provisioningState": "Succeeded",
  "provisioningTime": "2019-07-24T21:22:40.604754+00:00",
  "resourceGroup": "myDHResourceGroup",
  "sku": {
    "capacity": null,
    "name": "DSv3-Type1",
    "tier": null
  },
  "tags": null,
  "type": null,
  "virtualMachines": [
    {
      "id": "/subscriptions/10101010-1010-1010-1010-101010101010/resourceGroups/MYDHRESOURCEGROUP/providers/Microsoft.Compute/virtualMachines/MYVM",
      "resourceGroup": "MYDHRESOURCEGROUP"
    }
  ]
}

```
 
## Export as a template 
You can export a template if you now want to create an additional development environment with the same parameters, or a production environment that matches it. Resource Manager uses JSON templates that define all the parameters for your environment. You build out entire environments by referencing this JSON template. You can build JSON templates manually or export an existing environment to create the JSON template for you. Use [az group export](/cli/azure/group#az-group-export) to export your resource group.

```bash
az group export --name myDHResourceGroup > myDHResourceGroup.json 
```

This command creates the `myDHResourceGroup.json` file in your current working directory. When you create an environment from this template, you are prompted for all the resource names. You can populate these names in your template file by adding the `--include-parameter-default-value` parameter to the `az group export` command. Edit your JSON template to specify the resource names, or create a parameters.json file that specifies the resource names.
 
To create an environment from your template, use [az group deployment create](/cli/azure/group/deployment#az-group-deployment-create).

```bash
az group deployment create \ 
    --resource-group myNewResourceGroup \ 
    --template-file myDHResourceGroup.json 
```


## Clean up 

You are being charged for your dedicated hosts even when no virtual machines are deployed. You should delete any hosts you are currently not using to save costs.  

You can only delete a host when there are no any longer virtual machines using it. Delete the VMs using [az vm delete](/cli/azure/vm#az-vm-delete).

```bash
az vm delete -n myVM -g myDHResourceGroup
```

After deleting the VMs, you can delete the host using [az vm host delete](/cli/azure/vm/host#az-vm-host-delete).

```bash
az vm host delete -g myDHResourceGroup --host-group myHostGroup --name myHost 
```
 
Once you have deleted all of your hosts, you may delete the host group using [az vm host group delete](/cli/azure/vm/host/group#az-vm-host-group-delete).  
 
```bash
az vm host group delete -g myDHResourceGroup --host-group myHostGroup  
```
 
You can also delete the entire resource group in a single command. This will delete all resources created in the group, including all of the VMs, hosts and host groups.
 
```bash
az group delete -n myDHResourceGroup 
```

## Next steps

- For more information, see the [Dedicated hosts](dedicated-hosts.md) overview.

- You can also create dedicated hosts using the [Azure portal](dedicated-hosts-portal.md).

- There is sample template, found [here](https://github.com/Azure/azure-quickstart-templates/blob/master/201-vm-dedicated-hosts/README.md), that uses both zones and fault domains for maximum resiliency in a region.
