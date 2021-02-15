---
title: How to tag a VM using PowerShell
description: Learn about tagging a virtual machine using PowerShell
author: cynthn
ms.service: virtual-machines
ms.topic: how-to
ms.workload: infrastructure-services
ms.date: 11/11/2020
ms.author: cynthn

---
# How to tag a virtual machine in Azure using PowerShell

This article describes how to tag a VM in Azure using PowerShell. Tags are user-defined key/value pairs which can be placed directly on a resource or a resource group. Azure currently supports up to 50 tags per resource and resource group. Tags may be placed on a resource at the time of creation or added to an existing resource. If you want to tag a virtual machine using the Azure CLI, see [How to tag a virtual machine in Azure using the Azure CLI](tag-cli.md).

Use the `Get-AzVM` cmdlet to view the current list of tags for your VM.

```azurepowershell-interactive
Get-AzVM -ResourceGroupName "myResourceGroup" -Name "myVM" | Format-List -Property Tags
```

If your Virtual Machine already contains tags, you will then see all the tags in list format.

To add tags, use the `Set-AzResource` command. When updating tags through PowerShell, tags are updated as a whole. If you are adding one tag to a resource that already has tags, you will need to include all the tags that you want to be placed on the resource. Below is an example of how to add additional tags to a resource through PowerShell Cmdlets.

Assign all of the current tags for the VM to the `$tags` variable, using the `Get-AzResource` and `Tags` property.

```azurepowershell-interactive
$tags = (Get-AzResource -ResourceGroupName myResourceGroup -Name myVM).Tags
```

To see the current tags, type the variable.

```azurepowershell-interactive
$tags
```

Here is what the output might look like:

```output
Key           Value
----          -----
Department    MyDepartment
Application   MyApp1
Created By    MyName
Environment   Production
```

In the following example, we add a tag called `Location` with the value `myLocation`. Use `+=` to append the new key/value pair to the `$tags` list.

```azurepowershell-interactive
$tags += @{Location="myLocation"}
```

Use `Set-AzResource` to set all of the tags defined in the *$tags* variable on the VM.

```azurepowershell-interactive
Set-AzResource -ResourceGroupName myResourceGroup -Name myVM -ResourceType "Microsoft.Compute/VirtualMachines" -Tag $tags
```

Use `Get-AzResource` to display all of the tags on the resource.

```azurepowershell-interactive
(Get-AzResource -ResourceGroupName myResourceGroup -Name myVM).Tags

```

The output should look something like the following, which now includes the new tag:

```output

Key           Value
----          -----
Department    MyDepartment
Application   MyApp1
Created By    MyName
Environment   Production
Location      MyLocation
```

### Next steps

- To learn more about tagging your Azure resources, see [Azure Resource Manager Overview](../azure-resource-manager/management/overview.md) and [Using Tags to organize your Azure Resources](../azure-resource-manager/management/tag-resources.md).
- To see how tags can help you manage your use of Azure resources, see [Understanding your Azure Bill](../cost-management-billing/understand/review-individual-bill.md).
