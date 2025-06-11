---
title: Disable SNAT requirement for Azure private endpoint traffic through NVA
description: Learn how to enable SNAT bypass for Azure private endpoint traffic passing through a network virtual appliance (NVA) in Azure.
author: abell
ms.author: abell
ms.service: azure-private-link
ms.topic: how-to #Don't change
ms.date: 03/11/2025

#customer intent: As a network administrator, I want to disable SNAT requirement for private endpoint traffic through NVA so that I can ensure symmetric routing and comply with internal logging standards.

---

# How to Guide: Disable SNAT requirement for Azure private endpoint traffic through NVA

Source network address translation (SNAT) is no longer required for private endpoint destined traffic passing through a network virtual appliance (NVA). You can now configure a tag on your NVA virtual machines to notify the Microsoft platform that you wish to opt into this feature. This means SNATing is no longer be necessary for private endpoint destined traffic traversing through your NVA.

Enabling this feature provides a more streamlined experience for guaranteeing symmetric routing without affecting nonprivate endpoint traffic. It also allows you to follow internal compliance standards where the source of traffic origination needs to be available during logging. This feature is available in all regions.

> [!NOTE]
> Disabling SNAT for private endpoint traffic passing through a Network Virtual Appliance (NVA) causes a one-time reset of all long-running private endpoint connections established through the NVA. To minimize disruption, it's recommended to configure this feature during a maintenance window. This update will only affect traffic passing through your NVA; private endpoint traffic that bypasses the NVA won't be affected.

## Prerequisites

* An active Azure account with a subscription. [Create an account for free](https://azure.microsoft.com/free/).
* A configured private endpoint in your subscription. For more information on how to create a private endpoint, see [Create a private endpoint](./create-private-endpoint-portal.md).
* A network virtual appliance (NVA) deployed in your subscription. For the example in this article, a virtual machine (VM) is used as the NVA. For more information on how to deploy a virtual machine, see [Quickstart: Create a Windows virtual machine in the Azure portal](/azure/virtual-machines/windows/quick-create-portal).
* Understanding of how to add tags to Azure resources. For more information, see [Use tags to organize your Azure resources](../azure-resource-manager/management/tag-resources.md).

### Disable SNAT requirement for Private Endpoint traffic through NVA

The type of NVA you're using determines how to disable SNAT for private endpoint traffic passing through the NVA. For the virtual machine, you add a tag on the Network interface (NIC). On the virtual machine scale set you enable the tag on the virtual machine scale set instance.

#### Add Tag to your virtual machine NIC

Here we add the tag to the virtual machine's NIC. 

# [Portal](#tab/vm-nic-portal)

1. Sign in to the [Azure portal](https://portal.azure.com).
1. In the search bar at the top, search for and select **virtual machines**.
1. From the list of virtual machines, select your virtual machine.
1. In the left navigation pane under **Settings**, select **Networking**, then select **Network settings**.
1. Under the **Network Interface** section, select on the NIC name. Now you are in the Network interface pane.
1. In the left navigation pane under **Overview**, select **Tags**.
1. Add a new tag with the following details:

   | Field | Value |
   |-------|-------|
   | Name  | `disableSnatOnPL` |
   | Value | `true` |

1. Select **Apply** to save the tag.
1. Select the **Overview** section, then select **Refresh** to see the updated tags.

> [!NOTE]
> The tag is case-sensitive. Ensure you enter it exactly as shown.

# [PowerShell](#tab/vm-nic-powershell)

* Use the following PowerShell command to add the tag to your virtual machine's NIC:

```azurepowershell-interactive
    $nic = Get-AzNetworkInterface -Name "myNIC" -ResourceGroupName "MyResourceGroup"
    $tags = @{
    "disableSnatOnPL" = "true"
    }
    Set-AzResource -ResourceId $nic.Id -Tag $tags -Force
```

# [Azure CLI](#tab/vm-nic-cli)

* Use the following CLI command to add the tag to your virtual machine's NIC:

```azurecli-interactive
    az network nic update --name "myNIC" --resource-group "MyResourceGroup" --set tags.disableSnatOnPL=\'true\'
```
---

### Add Tag to your Virtual Machine Scale Sets

Here we add the tag to the virtual machine scale set instance. 

# [Portal](#tab/vmss-portal)  

1. Sign in to the [Azure portal](https://portal.azure.com).
1. In the search bar at the top, search and select **virtual machine scale sets**.
1. From the list of scale sets, select your virtual machine scale set.
1. In the left navigation pane under **Overview**, select **Tags**.
1. Add a new tag with the following details:

   | Field | Value |
   |-------|-------|
   | Name  | `disableSnatOnPL` |
   | Value | `true` |

1. Select **Apply** to save the tag.
1. Select the **Overview** section, then select **Refresh** to see the updated tags.

> [!NOTE]
> The tag is case-sensitive. Ensure you enter it exactly as shown.

# [PowerShell](#tab/vmss-powershell) 

* Use the following PowerShell command to add the tag to your virtual machine scale set:

```azurepowershell-interactive
    $vmss = Get-AzVmss -ResourceGroupName "MyResourceGroup" -VMScaleSetName "myVmss"
    $vmss.Tags.Add("disableSnatOnPL", "true")
    Update-AzVmss -ResourceGroupName "MyResourceGroup" -Name "myVmss" -VirtualMachineScaleSet $vmss
```

# [Azure CLI](#tab/vmss-cli) 

* Use the following Azure CLI command to add the tag to your virtual machine scale set:

```azurecli-interactive
    az vmss update --name "myVmss" --resource-group "MyResourceGroup" --set tags.disableSnatOnPL=\'true\'
```
---

#### Validate the Tag

Verify the tag is present in the virtual machine's NIC settings or virtual machine scale set settings.

1. Navigate to the **Tags** service in the Azure portal.
1. In the **Filter by** field, type `disableSnatOnPL`.
1. Select the tag from the list. Here you see all resources with the tag.
1. Select the resource to view the tag details.

To learn more, see [View resources by tag](../azure-resource-manager/management/tag-resources-portal.md#view-resources-by-tag).

## Next Step

> [!div class="nextstepaction"]
> [Create a private endpoint](./create-private-endpoint-portal.md)
> [Manage Network Polices](./disable-private-endpoint-network-policy.md)