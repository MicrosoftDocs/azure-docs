---
title: Virtual machine scale sets for SAP workload
description: Learn about deployment guidelines for virtual machine scale sets with flexible orchestration for SAP workloads.
author: dennispadia
manager: rdeltcheva
ms.author: depadia
ms.service: sap-on-azure
ms.subservice: sap-vm-workloads
ms.topic: concept-article
ms.custom: devx-track-azurepowershell
ms.date: 03/24/2026
# Customer intent: As an IT administrator managing SAP workloads, I want to deploy flexible virtual machine scale sets with fault domain count set to one, so that I can ensure high availability and optimal resource allocation across availability zones without relying on scaling profiles.
---

# Virtual machine scale sets for SAP workload

Virtual machine scale sets in Azure provide a logical grouping of platform-managed virtual machines (VMs) that you can distribute across availability zones and fault domains. For SAP workloads, virtual machine scale sets with flexible orchestration and a fault domain count of 1 (FD=1) are the recommended deployment framework. This configuration improves high availability by distributing VMs across different fault domains within each availability zone on a best-effort basis.

This article describes the supported configuration for flexible virtual machine scale sets for SAP workloads, provides a reference architecture for zonal deployment, and walks you through creating a scale set by using the Azure portal, Azure CLI, or PowerShell.

## Important considerations for flexible virtual machine scale sets for SAP workload

- Virtual machine scale sets with flexible orchestration are the recommended and supported [orchestration mode](/azure/virtual-machine-scale-sets/virtual-machine-scale-sets-orchestration-modes) for SAP workloads. The Uniform orchestration mode can't be used for SAP workloads.
- For SAP workloads, flexible orchestration of virtual machine scale sets is supported only with FD=1. Regional deployment with FD>1 isn't currently supported for SAP workloads.
- Flexible virtual machine scale sets can be configured either with or without a scaling profile. For SAP workloads, **configure a flexible scale set without a scaling profile**, because autoscaling doesn't work out of the box for SAP. The scale set is used only as a deployment framework for SAP workloads.
- Deploy each SAP system in a separate flexible scale set.
- For SAP NetWeaver, deploy all components of a single SAP system within a single flexible scale set. These components include the database, SAP ASCS/ERS, and SAP application servers.
- You can include different VM SKUs, such as D-Series, E-Series, and M-Series. You can also include operating systems, such as Windows and various Linux distributions, within a single virtual machine scale set with flexible orchestration.
- When you set up a flexible scale set for SAP workloads, you can set `platformFaultDomainCount` to a maximum value of `1`. As a result, the VM instances in the scale set are distributed across multiple fault domains on a best-effort basis.
- You can configure flexible virtual machine scale sets with or without a scaling profile. However, we recommend creating a flexible virtual machine scale set without a scaling profile.
- Standard Load Balancer is the only supported load balancer for VMs deployed in a flexible scale set.
- To configure Azure fence agent with managed identity for a highly available SAP environment that uses a Pacemaker cluster, you can enable a system-assigned managed identity on individual VMs.
- You can enable capacity reservation at the individual VM level if you're using a flexible scale set without a scaling profile to manage your SAP workload. For more information, see the [limitations and restrictions](/azure/virtual-machines/capacity-reservation-overview#limitations-and-restrictions) section, as not all SKUs are currently supported for capacity reservation.
- For SAP workloads, don't use a proximity placement group (PPG) in combination with a flexible scale set deployment with FD=1.
- In a multi-SID SAP ASCS/ERS environment, deploy the first SAP system by using a flexible scale set with FD=1. Additionally, set up a separate flexible scale set with FD=1 for the application and database tier of the second system.

> [!IMPORTANT]
> After you create the scale set, you can't modify or update the orchestration mode or configuration type (with or without scaling profile).

## Reference architecture of SAP workload deployed with flexible virtual machine scale sets

When you create a virtual machine scale set with flexible orchestration across availability zones, specify all the availability zones where you plan to deploy your SAP system. You must specify the availability zones during creation, because you can't modify them later.

By default, when you configure a flexible scale set across availability zones, the fault domain count is set to 1. Meaning that the VM instances belonging to the scale set are spread across different fault domains on a best-effort basis in each zone.

The following diagram illustrates the architecture for deploying three separate systems by using a flexible virtual machine scale set with FD=1. Three flexible virtual machine scale sets are created, one for each system, with a platform fault domain count set to 1. The first flexible scale set is created for a highly available SAP system with two availability zones (zones 1 and 2). The second scale set is created to configure an SBD device across three availability zones (zones 1, 2, and 3). The third scale set is created for a nonproduction or non-HA SAP system with one availability zone (zone 1).

You then manually deploy the VMs for each system in their corresponding availability zone within the scale set. For SAP System #1, high availability components, such as primary and secondary databases and ASCS/ERS instances, are deployed across multiple zones. For application tier VMs, the scale set distributes them across different fault domains within a single zone, on a best-effort basis. **You can't add more VMs for SAP System #1 in availability zone 3 at a later stage, because the flexible scale set is limited to only two availability zones (zones 1 and 2).** For more information on high availability deployment for SAP workloads, see [High-availability architecture and scenarios for SAP NetWeaver](sap-high-availability-architecture-scenarios.md).

For SBD devices, you manually deploy VMs in each availability zone within the scale set. For SAP System #3, which is a nonproduction or non-HA environment, you deploy all the components of the SAP system in a single zone.

:::image type="content" source="media/virtual-machine-scale-sets/flexible-scale-set-sap-deployment.png" alt-text="Diagram that shows zonal deployment of SAP workload on a flexible scale set with FD=1." lightbox="media/virtual-machine-scale-sets/flexible-scale-set-sap-deployment.png":::

> [!NOTE]
> When creating a flexible scale set for zonal deployment, it's not possible to set `platformFaultDomainCount` to a value higher than `1`.

## Configure a flexible virtual machine scale set without a scaling profile

For SAP workloads, create a flexible virtual machine scale set without a scaling profile. To create a flexible scale set across availability zones, set the fault domain count to 1 and specify the desired zones.

# [Azure portal](#tab/scaleset-portal)

To set up a virtual machine scale set without a scaling profile by using the Azure portal:

1. Sign in to the [Azure portal](https://portal.azure.com).
1. Search for and select **Virtual machine scale set**, and then select **Create** on the corresponding page.
1. On the **Basics** tab, provide the necessary details:
   1. Under **Project details**, verify that the correct subscription is selected, and then select your resource group from the dropdown list.
   1. For **Scale set details**, name your scale set (for example, **myVmssFlex**), select the appropriate region, and specify one or more availability zones for your deployment.
   1. Under **Orchestration**, select the **Flexible** orchestration mode.
   1. Under **Scaling**, select **No scaling profile**.
1. For the allocation policy, select **Max spreading**.
1. Select **Review + create**.

> [!NOTE]
> For SAP workloads, only flexible scale set with FD=1 is supported. Don't configure the scale set with **Fixed spreading** as the allocation policy.

# [Azure CLI](#tab/scaleset-cli)

```azurecli-interactive
# Sign in to Azure CLI and specify the subscription and variables for the deployment.
$RGName="my-resource-group"
$Location="azure-region"
$VMSSName="myVmssFlex"

# Create flexible scale set for deployment of SAP workload across availability zones with platform fault domain count set to 1
az vmss create -n $VMSSName -g $RGName -l $Location --orchestration-mode flexible --zones {1,2,3} --platform-fault-domain-count 1

# Create flexible scale set for deployment of SAP workload in a single zone of a region with platform fault domain count set to 1
# Make sure you include --zones in a region with availability zones, even if you want to deploy all components in a single zone
az vmss create -n $VMSSName -g $RGName -l $Location --orchestration-mode flexible --zones 1 --platform-fault-domain-count 1

# Create flexible scale set for deployment of SAP workload in a region with no zones with platform fault domain count set to 1
az vmss create -n $VMSSName -g $RGName -l $Location --orchestration-mode flexible --platform-fault-domain-count 1
```

# [PowerShell](#tab/scaleset-ps)

```azurepowershell-interactive
# Sign in to Azure PowerShell and specify the subscription and variables for the deployment.
$RGName = "my-resource-group"
$Location = "azure-region"
$VMSSName = "myVmssFlex"

# Create flexible scale set for deployment of SAP workload across availability zones with platform fault domain count set to 1
$vmssConfig = New-AzVmssConfig -Location $Location -PlatformFaultDomainCount 1 -Zone @(1,2,3)
$VMSS = New-AzVmss -ResourceGroupName $RGName -Name $VMSSName -VirtualMachineScaleSet $vmssConfig -Verbose

# Create flexible scale set for deployment of SAP workload in a single zone of a region with platform fault domain count set to 1
# Make sure you include -Zone in a region with availability zones, even if you want to deploy all components in a single zone
$vmssConfig = New-AzVmssConfig -Location $Location -PlatformFaultDomainCount 1 -Zone @(1)
$VMSS = New-AzVmss -ResourceGroupName $RGName -Name $VMSSName -VirtualMachineScaleSet $vmssConfig -Verbose

# Create flexible scale set for deployment of SAP workload in a region with no zones with platform fault domain count set to 1
$vmssConfig = New-AzVmssConfig -Location $Location -PlatformFaultDomainCount 1
$VMSS = New-AzVmss -ResourceGroupName $RGName -Name $VMSSName -VirtualMachineScaleSet $vmssConfig -Verbose
```

---

After you create the flexible virtual machine scale set, you can create a VM by following the [quickstart guide](/azure/virtual-machines/linux/quick-create-portal). When you configure the VM, select **virtual machine scale set** under availability options, and then select the flexible scale set that you created. The portal lists all the zones that you included when you created the flexible scale set, so you can select the desired availability zone for your VM. To complete the VM configuration, follow the remaining instructions in the quickstart guide.

## Related content

- [What are virtual machine scale sets?](/azure/virtual-machine-scale-sets/overview)
- [High-availability architecture and scenarios for SAP NetWeaver](sap-high-availability-architecture-scenarios.md)
- [Virtual machine scale set orchestration modes](/azure/virtual-machine-scale-sets/virtual-machine-scale-sets-orchestration-modes)
