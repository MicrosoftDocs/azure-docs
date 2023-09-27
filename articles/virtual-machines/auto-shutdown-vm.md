---
title: Auto-shutdown the VM
description: Learn how to set up auto-shutdown for VMs in Azure.
author: ericd-mst-github
ms.author: erd
ms.service: virtual-machines
ms.topic: tutorial
ms.custom: mvc
ms.date: 09/27/2023

---

# Auto-shutdown the VM

In this tutorial, you'll learn how to automatically shut-down virtual machines (VMs) in Azure. The auto-shutdown feature for Azure VMs can help reduce costs by shutting down the VMs during off hours when they aren't needed and automatically restarting them when they're needed again.

## Configure auto-shutdown for a virtual machine

### [Portal](#tab/portal)

Sign in to the [Azure portal](https://portal.azure.com/).
1. In the Azure portal, navigate to the virtual machine you want to configure auto-shutdown for.
2. In the virtual machine's detail page, select "Auto-shutdown" under the **Operations** section.
3. In the "Auto-shutdown" configuration screen, toggle the switch to "On".
4. Set the time you want the virtual machine to shut down.
5. Select "Save" to save the auto-shutdown configuration.

### [CLI](#tab/cli)

To configure auto-shutdown for a single virtual machine using the Azure CLI, you can use the following script:

```azurecli-interactive
# Set the resource group name, VM name, and shutdown time
RESOURCE_GROUP_NAME="myResourceGroup"
VM_NAME="myVM"  # Add your VM's name here
SHUTDOWN_TIME="18:00"

# Prompt the user to choose whether to auto-restart or leave the machines off
echo "Do you want to auto-restart the machine? (y/n)"
read RESTART_OPTION

# Set the auto-shutdown and auto-start properties based on the user's choice
if [ "$RESTART_OPTION" == "y" ]; then
  AUTO_SHUTDOWN="true"
  AUTO_START="true"
else
  AUTO_SHUTDOWN="true"
  AUTO_START="false"
fi

# Set the auto-shutdown and auto-start properties for the VM
az vm auto-shutdown -g $RESOURCE_GROUP_NAME -n $VM_NAME --time $SHUTDOWN_TIME

if [ "$AUTO_START" == "true" ]; then
  az vm restart -g $RESOURCE_GROUP_NAME -n $VM_NAME --no-wait
fi
```

To configure auto-shutdown for multiple virtual machines using the Azure CLI, you can use the following script:

```azurecli-interactive
# Set the resource group name and shutdown time
RESOURCE_GROUP_NAME="myResourceGroup"
SHUTDOWN_TIME="18:00"

# Prompt the user to choose whether to auto-restart or leave the machines off
echo "Do you want to auto-restart the machines? (y/n)"
read RESTART_OPTION

# Set the auto-shutdown and auto-start properties based on the user's choice
if [ "$RESTART_OPTION" == "y" ]; then
  AUTO_SHUTDOWN="true"
  AUTO_START="true"
else
  AUTO_SHUTDOWN="true"
  AUTO_START="false"
fi

# Loop through all VMs in the resource group and set the auto-shutdown and auto-start properties
for VM_ID in $(az vm list -g $RESOURCE_GROUP_NAME --query "[].id" -o tsv); do
  az vm auto-shutdown --ids $VM_ID --time $SHUTDOWN_TIME
  az vm restart --ids $VM_ID --no-wait
done
```

The above scripts use the `az vm auto-shutdown` and `az vm restart` commands to set the `auto-shutdown` and `restart` properties of all the VMs in the specified resource group. The `--ids` option is used to specify the VMs by their IDs, and the `--time` and `--auto-start-`enabled options are used to set the auto-shutdown and autostart properties, respectively.

Both scripts also prompt to choose whether to auto-restart the machines or leave them off until they're manually restarted. The choice is used to set the -`-auto-shutdown-enabled` property of the VMs.


### [PowerShell](#tab/powershell)

Currently, there's no cmdlet available to set auto-shutdown for VMs directly. Instead, you can use `New-AzPolicyAssignment` to create a policy definition that sets VMs shut down on a schedule.

To configure the new policy definition for a single virtual machine using PowerShell, you can use the script provided as an example: 

```azurepowershell-interactive
# Parameters
$resourceGroupName = "myResourceGroup"
$vmName = "myVM"
$location = "eastus" # Example: eastus, westeurope
$shutdownTime = "19:00" # Use 24-hour format
$autoRestart = $true # $true for auto-restart, $false for manual restart

# Policy Definition parameters
$policyDefinitionName = "ShutdownVMsWithSchedule"
$description = "Ensure that VMs shut down on a schedule"
$mode = "Indexed"
$policyRule = @{
    "if" = @{
        "field" = "type";
        "equals" = "Microsoft.Compute/virtualMachines"
    }
    "then" = @{
        "effect" = "auditIfNotExists";
        "details" = @{
            "type" = "Microsoft.DevTestLab/schedules";
            "existenceCondition" = @{
                "allOf" = @(
                    @{
                        "field" = "Microsoft.DevTestLab/schedules/taskType";
                        "equals" = "ComputeVmShutdownTask"
                    }
                    @{
                        "field" = "Microsoft.DevTestLab/schedules/dailyRecurrence";
                        "exists" = $true
                    }
                )
            }
        }
    }
}

$policyRuleJSON = $policyRule | ConvertTo-Json -Depth 10

# Create policy definition
$policyDefinition = New-AzPolicyDefinition -Name $policyDefinitionName -Policy $policyRuleJSON -Description $description -Mode $mode

# Fetch VM details to get its ID
$vm = Get-AzVM -ResourceGroupName $resourceGroupName -Name $vmName

# Assign policy to the VM using its ID
New-AzPolicyAssignment -Name "AutoShutdownVMsPolicy" -Scope $vm.Id -PolicyDefinition $policyDefinition
```

To configure the new policy definition for multiple virtual machines using PowerShell, you can use the script as an example:

```powershell-interactive
# Parameters
$resourceGroupName = "myResourceGroup"
$location = "eastus" # Example: eastus, westeurope
$shutdownTime = "19:00" # Use 24-hour format
$autoRestart = $true # $true for auto-restart, $false for manual restart

# Policy Definition parameters
$policyDefinitionName = "ShutdownVMsWithSchedule"
$description = "Ensure that VMs shut down on a schedule"
$mode = "Indexed"
$policyRule = @{
    "if" = @{
        "field" = "type";
        "equals" = "Microsoft.Compute/virtualMachines"
    }
    "then" = @{
        "effect" = "auditIfNotExists";
        "details" = @{
            "type" = "Microsoft.DevTestLab/schedules";
            "existenceCondition" = @{
                "allOf" = @(
                    @{
                        "field" = "Microsoft.DevTestLab/schedules/taskType";
                        "equals" = "ComputeVmShutdownTask"
                    }
                    @{
                        "field" = "Microsoft.DevTestLab/schedules/dailyRecurrence";
                        "exists" = $true
                    }
                )
            }
        }
    }
}

$policyRuleJSON = $policyRule | ConvertTo-Json -Depth 10

# Create policy definition
$policyDefinition = New-AzPolicyDefinition -Name $policyDefinitionName -Policy $policyRuleJSON -Description $description -Mode $mode

# Assign policy to the resource group
New-AzPolicyAssignment -Name "AutoShutdownVMsPolicy" -Scope "/subscriptions/<subscription-ID>/resourceGroups/$resourceGroupName" -PolicyDefinition $policyDefinition

Write-Host "Policy assigned successfully to $resourceGroupName."
```
If needed, modify `$resourceGroupName` and `<subscription_id>` with the appropriate values for your environment in either script. Both scripts first define the desired policy, which checks if each VM has an associated shutdown schedule. Any VMs without the requisite shutdown schedule are flagged, prompting remedial action to ensure cost-saving practices are consistently applied across resources.

---

## Clean up resources

If you no longer need the virtual machine, delete it with the following steps:

1. Navigate to the virtual machine's **Overview** page on the left
1. Select on "Delete" from the top middle option.
1. Follow the prompts to delete the virtual machine.

For more information on how to delete a virtual machine, see [delete a VM](./delete.md).

## Next steps

Learn about sizes and how to resize a VM:
- Types of virtual machine [sizes.](./sizes.md)
- Change the [size of a virtual machine](./resize-vm.md).