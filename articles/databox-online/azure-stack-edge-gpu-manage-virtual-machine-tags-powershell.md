---
title: Manage VM Tags on Azure Stack Edge Pro GPU device via Azure PowerShell
description: Describes how to create and manage virtual machine tags for virtual machines running in Azure Stack Edge by using Azure PowerShell.
services: databox
author: alkohli

ms.service: databox
ms.subservice: edge
ms.topic: how-to
ms.date: 03/24/2021
ms.author: alkohli
#Customer intent: As an IT admin, XXXX.
---

# Manage VM Tags on Azure Stack Edge via Azure PowerShell

This article describes how to tag virtual machines (VMs) running on your Azure Stack Edge Pro GPU devices using Azure PowerShell.

## About tags

Tags are user-defined key-value pairs that can be assigned to a resource or a resource group. You can apply tags to VMs running on your device to logically organize them into a taxonomy. You can placed tags on a resource at the time of creation or add it to an existing resource. For example, you can apply the name `Organization` and the value `Engineering` to all VMs that are used by the Engineering department in your organization.

For more information on tags, see how to [Manage tags via AzureRM PowerShell](/powershell/module/azurerm.tags/?view=azurermps-6.13.0).

## Prerequisites

Before you can manage tags on your Azure Stack Edge device, you must have configured your client to the Azure Stack Edge device via Azure Resource Manager over Azure PowerShell. For detailed steps, go to [Connect to Azure Resource Manager on your Azure Stack Edge device](azure-stack-edge-gpu-connect-resource-manager.md).<!--Target link: https://docs.microsoft.com/en-us/azure/databox-online/azure-stack-edge-gpu-connect-resource-manager-->

Make sure that the following steps can be used to access the device from your client.

1. Verify that Azure Resource Manager communication is working. Enter:

   ```powershell
   Add-AzureRmEnvironment -Name <Environment Name> -ARMEndpoint "https://management.<appliance name>.<DNSDomain>"
   ```

1. Call local device APIs to authenticate. Enter:

      ```powershell
   login-AzureRMAccount -EnvironmentName <Environment Name>
   ```

   Provide the username - EdgeARMuser - and the password to connect via Azure Resource Manager.




## View all existing tags on the device

To view the current list of tags for all the resources in the local Azure Resource Manager subscription of your device, use the `Get-AzureRMTag` command.

```powershell
Get-AzureRmTag
```
Here is an example output:



## Add a tag to a VM

1. Set some parameters.

   ```powershell
   $VMName = <VM Name>
   $VMRG = <VM Resource Group>
   $TagName = <Tag Name>
   $TagValue = <Tag Value>   
   ```

2. Get the VM object and its tags.

   ```powershell
   $VirtualMachine = Get-AzureRmVM -ResourceGroupName $VMRG -Name $VMName
   $tags = $VirtualMachine.Tags
   ```

3. Add the tag and update the VM. Updating the VM may take a few minutes.

   You can use the optional **-Force** flag to run the command without user confirmation.

   ```powershell
   $tags.Add($TagName, $TagValue)
   Set-AzureRmResource -ResourceId $VirtualMachine.Id -Tag $tags [-Force]
   ```

For more information, see [Add-AzureRMTag](/powershell/module/azurerm.tags/remove-azurermtag?view=azurermps-6.13.0).

## View tags of a VM

1. Define the parameters of the VM.

   ```powershell
   $VMName = <VM Name>
   $VMRG = <VM Resource Group>
   ```

1. Get the VM object and view its tags.

   ```powershell
   $VirtualMachine = Get-AzureRmVM -ResourceGroupName $VMRG -Name $VMName
   $VirtualMachine.Tags
   ```

## Remove a tag from a VM

1. Set some parameters. 

    ```powershell
    $VMName = <VM Name>
    $VMRG = <VM Resource Group>
    $TagName = <Tag Name>
   ``` 
    Here is an example output:

    ```powershell
    PS C:\WINDOWS\system32> $VMName = "myaselinuxvm1"
    PS C:\WINDOWS\system32> $VMRG = "myaserg1"
    PS C:\WINDOWS\system32> $TagName = "Organization" 
    ```
2. Get the VM object.

    ```powershell
    $VirtualMachine = Get-AzureRmVM -ResourceGroupName $VMRG -Name $VMName
    $VirtualMachine   
    ```   

    Here is an example output:

    ```powershell
    PS C:\WINDOWS\system32> $VirtualMachine = Get-AzureRMVM -ResourceGroupName $VMRG -Name $VMName
    ResourceGroupName : myaserg1
    Id                : /subscriptions/992601bc-b03d-4d72-598e-d24eac232122/resourceGroups/myaserg1/providers/Microsoft.Compute/virtualMachines/myaselinuxvm1
    VmId              : 290b3fdd-0c99-4905-9ea1-cf93cd6f25ee
    Name              : myaselinuxvm1
    Type              : Microsoft.Compute/virtualMachines
    Location          : dbelocal
    Tags              : {"Organization":"Engineering"}
    HardwareProfile   : {VmSize}
    NetworkProfile    : {NetworkInterfaces}
    OSProfile         : {ComputerName, AdminUsername, LinuxConfiguration, Secrets}
    ProvisioningState : Succeeded
    StorageProfile    : {ImageReference, OsDisk, DataDisks}
                                                                                  PS C:\WINDOWS\system32> 
    ```
3. Remove the tag and update the VM. Use the optional `-Force` flag to run the command without user confirmation.

    ```powershell
    $tags = $VirtualMachine.Tags
    $tags.Remove($TagName)
    Set-AzureRmResource -ResourceId $VirtualMachine.Id -Tag $tags [-Force]
    ```
    Here is an example output:

    ```powershell
    PS C:\WINDOWS\system32> $tags = $Virtualmachine.Tags
    PS C:\WINDOWS\system32> $tags
    Key          Value
    ---          -----
    Organization Engineering
    PS C:\WINDOWS\system32> $tags.Remove($TagName)
    True
    PS C:\WINDOWS\system32> Set-AzureRMResource -ResourceID $VirtualMachine.ID -Tag $tags -Force
    Name              : myaselinuxvm1
    ResourceId        : /subscriptions/992601bc-b03d-4d72-598e-d24eac232122/resourceGrou
                        ps/myaserg1/providers/Microsoft.Compute/virtualMachines/myaselin
                        uxvm1
    ResourceName      : myaselinuxvm1
    ResourceType      : Microsoft.Compute/virtualMachines
    ResourceGroupName : myaserg1
    Location          : dbelocal
    SubscriptionId    : 992601bc-b03d-4d72-598e-d24eac232122
    Tags              : {}
    Properties        : @{vmId=290b3fdd-0c99-4905-9ea1-cf93cd6f25ee; hardwareProfile=;
                        storageProfile=; osProfile=; networkProfile=;
                        provisioningState=Succeeded}
    PS C:\WINDOWS\system32>
    ```


## Next steps

Learn how to [Manage tags via AzureRM PowerShell](/powershell/module/azurerm.tags/?view=azurermps-6.13.0).
