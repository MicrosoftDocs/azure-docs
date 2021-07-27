---
title: Deploy Azure dedicated hosts
description: Deploy VMs and scale sets to dedicated hosts.
author: brittanyrowe
ms.author: brittanyrowe
ms.service: virtual-machines
ms.subservice: dedicated-hosts
ms.topic: how-to
ms.workload: infrastructure
ms.date: 07/26/2021
ms.reviewer: cynthn, zivr


#Customer intent: As an IT administrator, I want to learn about more about using a dedicated host for my Azure virtual machines
---

# Deploy VMs and scale sets to dedicated hosts

This article guides you through how to create an Azure [dedicated host](dedicated-hosts.md) to host your virtual machines (VMs) and scale set instances.


## Limitations

- The sizes and hardware types available for dedicated hosts vary by region. Refer to the host [pricing page](https://aka.ms/ADHPricing) to learn more.

## Create a host group

A **host group** is a resource that represents a collection of dedicated hosts. You create a host group in a region and an availability zone, and add hosts to it. When planning for high availability, there are additional options. You can use one or both of the following options with your dedicated hosts:
- Span across multiple availability zones. In this case, you are required to have a host group in each of the zones you wish to use.
- Span across multiple fault domains which are mapped to physical racks.

In either case, you are need to provide the fault domain count for your host group. If you do not want to span fault domains in your group, use a fault domain count of 1.

You can also decide to use both availability zones and fault domains.

### [Portal](#tab/portal)

In this example, we will create a host group using 1 availability zone and 2 fault domains.

1. Open the Azure [portal](https://portal.azure.com).
1. Select **Create a resource** in the upper left corner.
1. Search for **Host group** and then select **Host Groups** from the results.
1. In the **Host Groups** page, select **Create**.
1. Select the subscription you would like to use, and then select **Create new** to create a new resource group.
1. Type *myDedicatedHostsRG* as the **Name** and then select **OK**.
1. For **Host group name**, type *myHostGroup*.
1. For **Location**, select **East US**.
1. For **Availability Zone**, select **1**.
1. For **Fault domain count**, select **2**.
1. Select **Automatic placement** to automatically assign VMs and scale set instances to an available host in this group.
1. Select **Review + create** and then wait for validation.
1. Once you see the **Validation passed** message, select **Create** to create the host group.

It should only take a few moments to create the host group.




### [CLI](#tab/cli)

Not all host SKUs are available in all regions, and availability zones. You can list host availability, and any offer restrictions before you start provisioning dedicated hosts.

```azurecli-interactive
az vm list-skus -l eastus2  -r hostGroups/hosts  -o table
```

In this example, we will use [az vm host group create](/cli/azure/vm/host/group#az_vm_host_group_create) to create a host group using both availability zones and fault domains.

```azurecli-interactive
az vm host group create \
   --name myHostGroup \
   -g myDHResourceGroup \
   -z 1 \
   --platform-fault-domain-count 2
```

Add the `--automatic-placement true` parameter to have your VMs and scale set instances automatically placed on hosts, within a host group. For more information, see [Manual vs. automatic placement ](../dedicated-hosts.md#manual-vs-automatic-placement).


**Other examples**

You can also use [az vm host group create](/cli/azure/vm/host/group#az_vm_host_group_create) to create a host group in availability zone 1 (and no fault domains).

```azurecli-interactive
az vm host group create \
   --name myAZHostGroup \
   -g myDHResourceGroup \
   -z 1 \
   --platform-fault-domain-count 1
```

The following uses [az vm host group create](/cli/azure/vm/host/group#az_vm_host_group_create) to create a host group by using fault domains only (to be used in regions where availability zones are not supported).

```azurecli-interactive
az vm host group create \
   --name myFDHostGroup \
   -g myDHResourceGroup \
   --platform-fault-domain-count 2
```

### [PowerShell](#tab/powershell)

This example creates a host group in zone 1, with 2 fault domains.


```azurepowershell-interactive
$rgName = "myDHResourceGroup"
$location = "EastUS"

New-AzResourceGroup -Location $location -Name $rgName
$hostGroup = New-AzHostGroup `
   -Location $location `
   -Name myHostGroup `
   -PlatformFaultDomain 2 `
   -ResourceGroupName $rgName `
   -Zone 1
```


Add the `-SupportAutomaticPlacement true` parameter to have your VMs and scale set instances automatically placed on hosts, within a host group. For more information, see [Manual vs. automatic placement ](../dedicated-hosts.md#manual-vs-automatic-placement).





---


## Create a dedicated host

Now create a dedicated host in the host group. In addition to a name for the host, you are required to provide the SKU for the host. Host SKU captures the supported VM series as well as the hardware generation for your dedicated host.

For more information about the host SKUs and pricing, see [Azure Dedicated Host pricing](https://aka.ms/ADHPricing).

If you set a fault domain count for your host group, you will need to specify the fault domain for your host.

### [Portal](#tab/portal)

1. Select **Create a resource** in the upper left corner.
1. Search for **Dedicated host** and then select **Dedicated hosts** from the results.
1. In the **Dedicated Hosts** page, select **Create**.
1. Select the subscription you would like to use.
1. Select *myDedicatedHostsRG* as the **Resource group**.
1. In **Instance details**, type *myHost* for the **Name** and select *East US* for the location.
1. In **Hardware profile**, select *Standard Es3 family - Type 1* for the **Size family**, select *myHostGroup* for the **Host group** and then select *1* for the **Fault domain**. Leave the defaults for the rest of the fields.
1. When you are done, select **Review + create** and wait for validation.
1. Once you see the **Validation passed** message, select **Create** to create the host.

### [CLI](#tab/cli)

Use [az vm host create](/cli/azure/vm/host#az_vm_host_create) to create a host. If you set a fault domain count for your host group, you will be asked to specify the fault domain for your host.

```azurecli-interactive
az vm host create \
   --host-group myHostGroup \
   --name myHost \
   --sku DSv3-Type1 \
   --platform-fault-domain 1 \
   -g myDHResourceGroup
```

### [PowerShell](#tab/powershell)

---

## Create a VM

Now create a VM on the host.

### [Portal](#tab/portal)

1. Choose **Create a resource** in the upper left corner of the Azure portal.
1. In the search box above the list of Azure Marketplace resources, search for and select the image you want use, then choose **Create**.
1. In the **Basics** tab, under **Project details**, make sure the correct subscription is selected and then select *myDedicatedHostsRG* as the **Resource group**.
1. Under **Instance details**, type *myVM* for the **Virtual machine name** and choose *East US* for your **Location**.
1. In **Availability options** select **Availability zone**, select *1* from the drop-down.
1. For the size, select **Change size**. In the list of available sizes, choose one from the Esv3 series, like **Standard E2s v3**. You may need to clear the filter in order to see all of the available sizes.
1. Complete the rest of the fields on the **Basics** tab as needed.
1. If you want to specify which host to use for your VM, then at the top of the page, select the **Advanced** tab and in the **Host** section, select *myHostGroup* for **Host group** and *myHost* for the **Host**. Otherwise, your VM will automatically be placed on a host with capacity.
	![Select host group and host](./media/dedicated-hosts-portal/advanced.png)
1. Leave the remaining defaults and then select the **Review + create** button at the bottom of the page.
1. When you see the message that validation has passed, select **Create**.

It will take a few minutes for your VM to be deployed.


### [CLI](#tab/cli)

Create a virtual machine within a dedicated host using [az vm create](/cli/azure/vm#az_vm_create). If you specified an availability zone when creating your host group, you are required to use the same zone when creating the virtual machine.

```azurecli-interactive
az vm create \
   -n myVM \
   --image debian \
   --host-group myHostGroup \
   --generate-ssh-keys \
   --size Standard_D4s_v3 \
   -g myDHResourceGroup \
   --zone 1
```

To place the VM on a specific host, use `--host` instead of specifying the host group with `--host-group`.

> [!WARNING]
> If you create a virtual machine on a host which does not have enough resources, the virtual machine will be created in a FAILED state.


### [PowerShell](#tab/powershell)

---

## Create a scale set

You can also create a scale set on your host.

### [Portal](#tab/portal)

When you deploy a scale set, you specify the host group.

1. Search for *Scale set* and select **Virtual machine scale sets** from the list.
1. Select **Add** to create a new scale set.
1. Complete the fields on the **Basics** tab as you usually would, but make sure you select a VM size that is from the series you chose for your dedicated host, like **Standard E2s v3**.
1. On the **Advanced** tab, for **Spreading algorithm** select **Max spreading**.
1. In **Host group**, select the host group from the drop-down. If you recently created the group, it might take a minute to get added to the list.


### [CLI](#tab/cli)

When you deploy a scale set using [az vmss create](/cli/azure/vmss#az_vmss_create), you specify the host group using `--host-group`.

```azurecli-interactive
az vmss create \
  --resource-group myResourceGroup \
  --name myScaleSet \
  --image UbuntuLTS \
  --upgrade-policy-mode automatic \
  --admin-username azureuser \
  --host-group myHostGroup \
  --generate-ssh-keys \
  --size Standard_D4s_v3 \
  -g myDHResourceGroup \
  --zone 1
```

If you want to manually choose which host to deploy the scale set to, add `--host` and the name of the host.


### [PowerShell](#tab/powershell)

---

## Add an existing VM

You can also move existing VMs to a host.

### [Portal](#tab/portal)

You can add an exiting VM to a dedicated host, but the VM must first be Stop\Deallocated. Before you move a VM to a dedicated host, make sure that the VM configuration is supported:

- The VM size must be in the same size family as the dedicated host. For example, if your dedicated host is DSv3, then the VM size could be Standard_D4s_v3, but it could not be a Standard_A4_v2.
- The VM needs to be located in same region as the dedicated host.
- The VM can't be part of a proximity placement group. Remove the VM from the proximity placement group before moving it to a dedicated host. For more information, see [Move a VM out of a proximity placement group](./windows/proximity-placement-groups.md#move-an-existing-vm-out-of-a-proximity-placement-group)
- The VM can't be in an availability set.
- If the VM is in an availability zone, it must be the same availability zone as the host group. The availability zone settings for the VM and the host group must match.

Move the VM to a dedicated host using the [portal](https://portal.azure.com).

1. Open the page for the VM.
1. Select **Stop** to stop\deallocate the VM.
1. Select **Configuration** from the left menu.
1. Select a host group and a host from the drop-down menus.
1. When you are done, select **Save** at the top of the page.
1. After the VM has been added to the host, select **Overview** from the left menu.
1. At the top of the page, select **Start** to restart the VM.


### [CLI](#tab/cli)

### [PowerShell](#tab/powershell)

---


## Check the status of the host


### [CLI](#tab/cli)

You can check the host health status and how many virtual machines you can still deploy to the host using [az vm host get-instance-view](/cli/azure/vm/host#az_vm_host_get_instance_view).

```azurecli-interactive
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

### [PowerShell](#tab/powershell)



---

## Next steps

- For more information, see the [Dedicated hosts](dedicated-hosts.md) overview.

- There is sample template, available at [Azure quickstart templates](https://github.com/Azure/azure-quickstart-templates/blob/master/quickstarts/microsoft.compute/vm-dedicated-hosts/README.md), that uses both zones and fault domains for maximum resiliency in a region.

- You can also deploy a dedicated host using the [Azure CLI](./linux/dedicated-hosts-cli.md) or [PowerShell](./windows/dedicated-hosts-powershell.md).
