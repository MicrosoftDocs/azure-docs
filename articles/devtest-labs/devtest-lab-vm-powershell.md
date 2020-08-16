---
title: Create a virtual machine in DevTest Labs with Azure PowerShell
description: Learn how to use Azure DevTest Labs to create and manage virtual machines with Azure PowerShell.
ms.topic: article
ms.date: 06/26/2020
---

# Create a virtual machine with DevTest Labs using Azure PowerShell
This article shows you how to create a virtual machine in Azure DevTest Labs by using Azure PowerShell. You can use PowerShell scripts to automate creation of virtual machines in a lab in Azure DevTest Labs. 

## Prerequisites
Before you begin:

- [Create a lab](devtest-lab-create-lab.md) if you don't want to use an existing lab to test the script or commands in this article. 
- [Install Azure PowerShell](/powershell/azure/install-az-ps?view=azps-1.7.0) or use Azure Cloud Shell that's integrated into the Azure portal. 

## PowerShell script
The sample script in this section uses the [Invoke-AzResourceAction](/powershell/module/az.resources/invoke-azresourceaction?view=azps-1.7.0) cmdlet.  This cmdlet takes the lab's resource ID, name of the action to perform (`createEnvironment`), and the parameters necessary perform that action. The parameters are in a hash table that contains all the virtual machine description properties. 

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

    #For this example, we are getting the first allowed subnet in the first virtual network
    #  for the lab.
    #If a specific virtual network is needed use | to find it. 
    #ie $virtualNetwork = @(Get-AzResource -ResourceType  'Microsoft.DevTestLab/labs/virtualnetworks' -ResourceName $LabName -ResourceGroupName $lab.ResourceGroupName -ApiVersion $API_VERSION) | Where-Object Name -EQ "SpecificVNetName"

    $virtualNetwork = @(Get-AzResource -ResourceType  'Microsoft.DevTestLab/labs/virtualnetworks' -ResourceName $LabName -ResourceGroupName $lab.ResourceGroupName -ApiVersion $API_VERSION)[0]

    $labSubnetName = $virtualNetwork.properties.allowedSubnets[0].labSubnetName

    #Prepare all the properties needed for the createEnvironment
    # call used to create the new VM.
    # The properties will be slightly different depending on the base of the vm
    # (a marketplace image, custom image or formula).
    # The setup of the virtual network to be used may also affect the properties.
    # This sample includes the properties to add an additional disk under dataDiskParameters
    
    $parameters = @{
       "name"      = $NewVmName;
       "location"  = $lab.Location;
       "properties" = @{
          "labVirtualNetworkId"     = $virtualNetwork.ResourceId;
          "labSubnetName"           = $labSubnetName;
          "notes"                   = "Windows Server 2016 Datacenter";
          "osType"                  = "windows"
          "expirationDate"          = "2019-12-01"
          "galleryImageReference"   = @{
             "offer"     = "WindowsServer";
             "publisher" = "MicrosoftWindowsServer";
             "sku"       = "2016-Datacenter";
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
    
    #The following line is the same as invoking
    # https://azure.github.io/projects/apis/#!/Labs/Labs_CreateEnvironment rest api

    Invoke-AzResourceAction -ResourceId $lab.ResourceId -Action 'createEnvironment' -Parameters $parameters -ApiVersion $API_VERSION -Force -Verbose
}
finally {
   popd
}
```

The properties for the virtual machine in the above script allow us to create a virtual machine with Windows Server 2016 DataCenter as the OS. For each type of virtual machine, these properties will be slightly different. The [Define virtual machine](#define-virtual-machine) section shows you how to determine which properties to use in this script.

The following command provides an example of running the script saved in a file name: Create-LabVirtualMachine.ps1. 

```powershell
 PS> .\Create-LabVirtualMachine.ps1 -ResourceGroupName 'MyLabResourceGroup' -LabName 'MyLab' -userName 'AdminUser' -password 'Password1!' -VMName 'MyLabVM'
```

## Define virtual machine
This section shows you how to get the properties that are specific to a type of virtual machine that you want to create. 

### Use Azure portal
You can generate an Azure Resource Manager template when creating a VM in the Azure portal. You don't need to complete the process of creating the VM. You only follow the steps until you see the template. This is the best way to get the necessary JSON description if you do not already have a lab VM created. 

1. Navigate to the [Azure portal](https://portal.azure.com).
2. Select **All Services** on the left navigational menu.
3. Search for and select **DevTest Labs** from the list of services. 
4. On the **DevTest Labs** page, select your lab in the list of labs.
5. On the home page for your lab, select **+ Add** on the toolbar. 
6. Select a **base image** for the VM. 
7. Select **automation options** at the bottom of the page above the **Submit** button. 
8. You see the **Azure Resource Manager template** for creating the virtual machine. 
9. The JSON segment in the **resources** section has the definition for the image type you selected earlier. 

    ```json
    {
      "apiVersion": "2018-10-15-preview",
      "type": "Microsoft.DevTestLab/labs/virtualmachines",
      "name": "[variables('vmName')]",
      "location": "[resourceGroup().location]",
      "properties": {
        "labVirtualNetworkId": "[variables('labVirtualNetworkId')]",
        "notes": "Windows Server 2019 Datacenter",
        "galleryImageReference": {
          "offer": "WindowsServer",
          "publisher": "MicrosoftWindowsServer",
          "sku": "2019-Datacenter",
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
    ```

In this example, you see how to get a definition of an Azure Market Place image. You can get a definition of a custom image, a formula, or an environment in the same way. Add any artifacts needed for the virtual machine, and set any advanced settings required. After providing values for the required fields, and any optional fields, before selecting the **Automation options** button.

### Use Azure REST API
The following procedure gives you steps to get properties of an image by using the REST API: These steps work only for an existing VM in a lab. 

1. Navigate to the [Virtual Machines - list](/rest/api/dtl/virtualmachines/list) page, select **Try it** button. 
2. Select your **Azure subscription**.
3. Enter the **resource group for the lab**.
4. Enter the **name of the lab**. 
5. Select **Run**.
6. You see the **properties for the image** based on which the VM was created. 

## Set expiration date
In scenarios such as training, demos and trials, you may want to create virtual machines and delete them automatically after a fixed duration so that you don’t incur unnecessary costs. You can set an expiration date for a VM while creating it using PowerShell as shown in the example [PowerShell script](#powershell-script) section.

Here is a sample PowerShell script that sets expiration date for all existing VMs in a lab:

```powershell
# Values to change
$subscriptionId = '<Enter the subscription Id that contains lab>'
$labResourceGroup = '<Enter the lab resource group>'
$labName = '<Enter the lab name>'
$VmName = '<Enter the VmName>'
$expirationDate = '<Enter the expiration date e.g. 2019-12-16>'

# Log into your Azure account
Login-AzureRmAccount

Select-AzureRmSubscription -SubscriptionId $subscriptionId
$VmResourceId = "subscriptions/$subscriptionId/resourcegroups/$labResourceGroup/providers/microsoft.devtestlab/labs/$labName/virtualmachines/$VmName"

$vm = Get-AzureRmResource -ResourceId $VmResourceId -ExpandProperties

# Get all the Vm properties
$VmProperties = $vm.Properties

# Set the expirationDate property
If ($VmProperties.expirationDate -eq $null) {
    $VmProperties | Add-Member -MemberType NoteProperty -Name expirationDate -Value $expirationDate
} Else {
    $VmProperties.expirationDate = $expirationDate
}

Set-AzureRmResource -ResourceId $VmResourceId -Properties $VmProperties -Force
```


## Next steps
See the following content: [Azure PowerShell documentation for Azure DevTest Labs](/powershell/module/az.devtestlabs/)
