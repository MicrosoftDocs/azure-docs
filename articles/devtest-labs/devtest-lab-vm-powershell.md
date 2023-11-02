---
title: Create a lab virtual machine by using Azure PowerShell
description: Learn how to use Azure PowerShell to create and manage virtual machines in Azure DevTest Labs.
ms.topic: how-to
ms.author: rosemalcolm
author: RoseHJM
ms.date: 09/30/2023
ms.custom: devx-track-azurepowershell, UpdateFrequency2
---

# Create DevTest Labs VMs by using Azure PowerShell

This article shows you how to create an Azure DevTest Labs virtual machine (VM) in a lab by using Azure PowerShell. You can use PowerShell scripts to automate lab VM creation.

## Prerequisites

You need the following prerequisites to work through this article:

- Access to a lab in DevTest Labs. [Create a lab](devtest-lab-create-lab.md), or use an existing lab.
- Azure PowerShell. [Install Azure PowerShell](/powershell/azure/install-azure-powershell), or [use Azure Cloud Shell](/azure/cloud-shell/quickstart?tabs=powershell) in the Azure portal.

## PowerShell VM creation script

The PowerShell [Invoke-AzResourceAction](/powershell/module/az.resources/invoke-azresourceaction) cmdlet invokes the `createEnvironment` action with the lab's resource ID and VM parameters. The parameters are in a hash table that contains all the VM properties. The properties are different for each type of VM. To get the properties for the VM type you want, see [Get VM properties](#get-vm-properties).

This sample script creates a Windows Server 2019 Datacenter VM. The sample also includes properties to add a second data disk under `dataDiskParameters`.

```powershell
[CmdletBinding()]

Param(
[Parameter(Mandatory = $false)]  $SubscriptionId,
[Parameter(Mandatory = $true)]   $LabResourceGroup,
[Parameter(Mandatory = $true)]   $LabName,
[Parameter(Mandatory = $true)]   $NewVmName,
[Parameter(Mandatory = $true)]   $UserName,
[Parameter(Mandatory = $true)]   $Password
)

pushd $PSScriptRoot

try {
    if ($SubscriptionId -eq $null) {
        $SubscriptionId = (Get-AzContext).Subscription.SubscriptionId
    }

    $API_VERSION = '2016-05-15'
    $lab = Get-AzResource -ResourceId "/subscriptions/$SubscriptionId/resourceGroups/$LabResourceGroup/providers/Microsoft.DevTestLab/labs/$LabName"

    if ($lab -eq $null) {
       throw "Unable to find lab $LabName resource group $LabResourceGroup in subscription $SubscriptionId."
    }

    $virtualNetwork = @(Get-AzResource -ResourceType  'Microsoft.DevTestLab/labs/virtualnetworks' -ResourceName $LabName -ResourceGroupName $lab.ResourceGroupName -ApiVersion $API_VERSION)[0]

    #The preceding command puts the VM in the first allowed subnet in the first virtual network for the lab.
    #If you need to use a specific virtual network, use | to find the network. For example:
    #$virtualNetwork = @(Get-AzResource -ResourceType  'Microsoft.DevTestLab/labs/virtualnetworks' -ResourceName $LabName -ResourceGroupName $lab.ResourceGroupName -ApiVersion $API_VERSION) | Where-Object Name -EQ "SpecificVNetName"

    $labSubnetName = $virtualNetwork.properties.allowedSubnets[0].labSubnetName

    #Prepare all the properties needed for the createEnvironment call.
    # The properties are slightly different depending on the type of VM base.
    # The virtual network setup might also affect the properties.

    $parameters = @{
       "name"      = $NewVmName;
       "location"  = $lab.Location;
       "properties" = @{
          "labVirtualNetworkId"     = $virtualNetwork.ResourceId;
          "labSubnetName"           = $labSubnetName;
          "notes"                   = "Windows Server 2019 Datacenter";
          "osType"                  = "windows"
          "expirationDate"          = "2022-12-01"
          "galleryImageReference"   = @{
             "offer"     = "WindowsServer";
             "publisher" = "MicrosoftWindowsServer";
             "sku"       = "2019-Datacenter";
             "osType"    = "Windows";
             "version"   = "latest"
          };
          "size"                    = "Standard_DS2_v2";
          "userName"                = $UserName;
          "password"                = $Password;
          "disallowPublicIpAddress" = $true;
          "dataDiskParameters" = @(@{
            "attachNewDataDiskOptions" = @{
                "diskName" = "adddatadisk"
                "diskSizeGiB" = "1023"
                "diskType" = "Standard"
                }
          "hostCaching" = "ReadWrite"
          })
       }
    }

    #The following line has the same effect as invoking the
    # https://azure.github.io/projects/apis/#!/Labs/Labs_CreateEnvironment REST API

    Invoke-AzResourceAction -ResourceId $lab.ResourceId -Action 'createEnvironment' -Parameters $parameters -ApiVersion $API_VERSION -Force -Verbose
}
finally {
   popd
}
```

Save the preceding script in a file named *Create-LabVirtualMachine.ps1*. Run the script by using the following command. Enter your own values for the placeholders.

```powershell
.\Create-LabVirtualMachine.ps1 -ResourceGroupName '<lab resource group name>' -LabName '<lab name>' -userName '<VM administrative username>' -password '<VM admin password>' -VMName '<VM name to create>'
```

## Get VM properties

This section shows how to get the specific properties for the type of VM you want to create. You can get the properties from an Azure Resource Manager (ARM) template in the Azure portal, or by calling the DevTest Labs Azure REST API.

### Use the Azure portal to get VM properties

Creating a VM in the Azure portal generates an Azure Resource Manager (ARM) template that shows the VM's properties. Once you choose a VM base, you can see the ARM template and get the properties without actually creating the VM. This method is the easiest way to get the JSON VM description if you don't already have a lab VM of that type.

1. In the [Azure portal](https://portal.azure.com), on the **Overview** page for your lab, select **Add** on the top toolbar.
1. On the **Choose a base** page, select the VM type you want. Depending on lab settings, the VM base can be an Azure Marketplace image, a custom image, a formula, or an environment.
1. On the **Create lab resource** page, optionally [add artifacts](add-artifact-vm.md) and configure any other settings you want on the **Basic settings** and **Advanced settings** tabs.
1. On the **Advanced settings** tab, select **View ARM template** at the bottom of the page.
1. On the **View Azure Resource Manager template** page, review the JSON template for creating the VM. The **resources** section has the VM properties.

   For example, the following `resources` section has the properties for a Windows Server 2022 Datacenter VM:
   ```json
     "resources": [
          {
               "apiVersion": "2018-10-15-preview",
               "type": "Microsoft.DevTestLab/labs/virtualmachines",
               "name": "[variables('vmName')]",
               "location": "[resourceGroup().location]",
               "properties": {
                    "labVirtualNetworkId": "[variables('labVirtualNetworkId')]",
                    "notes": "Windows Server 2022 Datacenter: Azure Edition Core",
                    "galleryImageReference": {
                         "offer": "WindowsServer",
                         "publisher": "MicrosoftWindowsServer",
                         "sku": "2022-datacenter-azure-edition-core",
                         "osType": "Windows",
                         "version": "latest"
                    },
                    "size": "[parameters('size')]",
                    "userName": "[parameters('userName')]",
                    "password": "[parameters('password')]",
                    "isAuthenticationWithSshKey": false,
                    "labSubnetName": "[variables('labSubnetName')]",
                    "disallowPublicIpAddress": true,
                    "storageType": "Standard",
                    "allowClaim": false,
                    "networkInterface": {
                         "sharedPublicIpAddressConfiguration": {
                              "inboundNatRules": [
                                   {
                                        "transportProtocol": "tcp",
                                        "backendPort": 3389
                                   }
                              ]
                         }
                    }
               }
          }
     ],
   ```

1. Copy and save the template to use in future PowerShell automation, and transfer the properties to the PowerShell VM creation script.



### Use the DevTest Labs Azure REST API to get VM properties

You can also call the DevTest Labs REST API to get the properties of existing lab VMs. You can use those properties to create more lab VMs of the same types.

1. On the [Virtual Machines - list](/rest/api/dtl/virtualmachines/list) page, select **Try it** above the first code block.
1. On the **REST API Try It** page:
   - Under **labName**, enter your lab name.
   - Under **labResourceGroup**, enter the lab resource group name.
   - Under **subscriptionId**, select the lab's Azure subscription.
1. Select **Run**.
1. In the **Response** section under **Body**, view the properties for all the existing VMs in the lab.

## Set VM expiration date

In training, demo, and trial scenarios, you can avoid unnecessary costs by deleting VMs automatically on a certain date. You can set the VM `expirationDate` property when you create a VM. The PowerShell VM creation script earlier in this article sets an expiration date under `properties`:

```json
  "expirationDate": "2022-12-01"
```

You can also set expiration dates on existing VMs by using PowerShell. The following PowerShell script sets an expiration date for an existing lab VM if it doesn't already have an expiration date:

```powershell
# Enter your own values:
$subscriptionId = '<Lab subscription Id>'
$labResourceGroup = '<Lab resource group>'
$labName = '<Lab name>'
$VmName = '<VM name>'
$expirationDate = '<Expiration date, such as 2022-12-16>'

# Sign in to your Azure account

Select-AzSubscription -SubscriptionId $subscriptionId
$VmResourceId = "subscriptions/$subscriptionId/resourcegroups/$labResourceGroup/providers/microsoft.devtestlab/labs/$labName/virtualmachines/$VmName"

$vm = Get-AzResource -ResourceId $VmResourceId -ExpandProperties

# Get the Vm properties
$VmProperties = $vm.Properties

# Set the expirationDate property
If ($VmProperties.expirationDate -eq $null) {
    $VmProperties | Add-Member -MemberType NoteProperty -Name expirationDate -Value $expirationDate -Force
} Else {
    $VmProperties.expirationDate = $expirationDate
}

Set-AzResource -ResourceId $VmResourceId -Properties $VmProperties -Force
```

## Next steps

[Az.DevTestLabs PowerShell reference](/powershell/module/az.devtestlabs/)