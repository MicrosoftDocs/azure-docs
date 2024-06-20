---
 title: include file
 description: include file
 services: virtual-machines
 author: mattmcinnes
 ms.service: virtual-machines
 ms.topic: include
 ms.date: 04/10/2024
 ms.author: jainan
 ms.reviewer: mattmcinnes
 ms.custom: include file
---

## Hibernate a VM

Once a VM with hibernation enabled has been created and the guest OS is configured for hibernation, you can hibernate the VM through the Azure portal, the Azure CLI, PowerShell, or REST API. 


#### [Portal](#tab/PortalDoHiber) 

To hibernate a VM in the Azure portal, click the 'Hibernate' button on the VM Overview page.

![Screenshot of the button to hibernate a VM in the Azure portal.](/azure/virtual-machines/media/hibernate-resume/hibernate-the-vm.png)

#### [CLI](#tab/CLIDoHiber) 

To hibernate a VM in the Azure CLI, run this command:

```azurecli
az vm deallocate --resource-group TestRG --name TestVM --hibernate true 
```

#### [PowerShell](#tab/PSDoHiber)  

To hibernate a VM in PowerShell, run this command:

```powershell
Stop-AzVM -ResourceGroupName "TestRG" -Name "TestVM" -Hibernate      
```

After running the above command, enter 'Y' to continue:

```
Virtual machine stopping operation 

This cmdlet will stop the specified virtual machine. Do you want to continue? 

[Y] Yes  [N] No  [S] Suspend  [?] Help (default is "Y"): Y 
```

#### [REST API](#tab/APIDoHiber) 

To hibernate a VM using the REST API, run this command:

```json
POST 
https://management.azure.com/subscriptions/.../providers/Microsoft.Compute/virtualMachines/{vmName}/deallocate?hibernate=true&api-version=2021-03-01 
```
---



## View state of hibernated VM 

#### [Portal](#tab/PortalStatCheck)

To view the state of a VM in the portal, check the 'Status' on the overview page. It should report as "Hibernated (deallocated)"

![Screenshot of the Hibernated VM's status in the Azure portal listing as 'Hibernated (deallocated)'.](/azure/virtual-machines/media/hibernate-resume/vm-in-hibernated-state.png)

#### [PowerShell](#tab/PSStatCheck)

To view the state of a VM using PowerShell:

```powershell
Get-AzVM -ResourceGroupName "testRG" -Name "testVM" -Status 
```

Your output should look something like this:

```
ResourceGroupName : testRG 
Name              : testVM 
HyperVGeneration  : V1 
Disks[0]          :  
  Name            : testVM_OsDisk_1_d564d424ff9b40c987b5c6636d8ea655 
  Statuses[0]     :  
    Code          : ProvisioningState/succeeded 
    Level         : Info 
    DisplayStatus : Provisioning succeeded 
    Time          : 4/17/2022 2:39:51 AM 
Statuses[0]       :  
  Code            : ProvisioningState/succeeded 
  Level           : Info 
  DisplayStatus   : Provisioning succeeded 
  Time            : 4/17/2022 2:39:51 AM 
Statuses[1]       :  
  Code            : PowerState/deallocated 
  Level           : Info 
  DisplayStatus   : VM deallocated 
Statuses[2]       :  
  Code            : HibernationState/Hibernated 
  Level           : Info 
  DisplayStatus   : VM hibernated 
```

#### [CLI](#tab/CLIStatCheck)

To view the state of a VM using Azure CLI:

```azurecli
az vm get-instance-view -g MyResourceGroup -n myVM
```

Your output should look something like this:
```
{
  "additionalCapabilities": {
    "hibernationEnabled": true,
    "ultraSsdEnabled": null
  },
  "hardwareProfile": {
    "vmSize": "Standard_D2s_v5",
    "vmSizeProperties": null
  },
  "instanceView": {
    "assignedHost": null,
    "bootDiagnostics": null,
    "computerName": null,
    "statuses": [
      {
        "code": "ProvisioningState/succeeded",
        "displayStatus": "Provisioning succeeded",
        "level": "Info",
        "message": null,
        "time": "2022-04-17T02:39:51.122866+00:00"
      },
      {
        "code": "PowerState/deallocated",
        "displayStatus": "VM deallocated",
        "level": "Info",
        "message": null,
        "time": null
      },
      {
        "code": "HibernationState/Hibernated",
        "displayStatus": "VM hibernated",
        "level": "Info",
        "message": null,
        "time": null
      }
    ],
  },
```

#### [REST API](#tab/APIStatCheck)

To view the state of a VM using REST API, run this command:

```json
GET https://management.azure.com/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.Compute/virtualMachines/{vmName}/instanceView?api-version=2020-12-01 
```

Your output should look something like this:

```
"statuses":  
[ 
    { 
      "code": "ProvisioningState/succeeded", 
      "level": "Info", 
      "displayStatus": "Provisioning succeeded", 
      "time": "2019-10-14T21:30:12.8051917+00:00" 
    }, 
    { 
      "code": "PowerState/deallocated", 
      "level": "Info", 
      "displayStatus": "VM deallocated" 
    }, 
   { 
      "code": "HibernationState/Hibernated", 
      "level": "Info", 
      "displayStatus": "VM hibernated" 
    } 
] 
```
---

## Start hibernated VMs 

You can start hibernated VMs just like how you would start a stopped VM. This can be done through the Azure portal, the Azure CLI, PowerShell, or REST API.

### [Portal](#tab/PortalStartHiber)
To start a hibernated VM using the Azure portal, click the 'Start' button on the VM Overview page.

![Screenshot of the Azure portal button to start a hibernated VM with an underlined status listed as 'Hibernated (deallocated)'.](/azure/virtual-machines/media/hibernate-resume/start-vm.png)

### [CLI](#tab/CLIStartHiber)

To start a hibernated VM using the Azure CLI, run this command:
```azurecli
az vm start -g MyResourceGroup -n MyVm
```

### [PowerShell](#tab/PSStartHiber)

To start a hibernated VM using PowerShell, run this command:

```powershell
Start-AzVM -ResourceGroupName "ExampleRG" -Name "ExampleName"
```

### [REST API](#tab/RESTStartHiber)

To start a hibernated VM using the REST API, run this command:

```json
POST https://management.azure.com/subscriptions/../providers/Microsoft.Compute/virtualMachines/{vmName}/start?api-version=2020-12-01 
```
---

## Deploy hibernation enabled VMs from the Azure Compute Gallery

VMs created from Compute Gallery images can also be enabled for hibernation. Ensure that the OS version associated with your Gallery image supports hibernation on Azure. Refer to the list of supported OS versions.

To create VMs with hibernation enabled using Gallery images, you'll first need to create a new image definition with the hibernation property enabled. Once this feature property is enabled on the Gallery Image definition, you can [create an image version](/azure/virtual-machines/image-version?tabs=portal#create-an-image) and use that image version to create hibernation enabled VMs. 

>[!NOTE]
> For specialized Windows images, the page file location must be set to C: drive in order for Azure to successfully configure your guest OS for hibernation.
> If you're creating an Image version from an existing VM, you should first move the page file to the OS disk and then use the VM as the source for the Image version.

#### [Portal](#tab/PortalImageGallery)
To create an image definition with the hibernation property enabled, select the checkmark for 'Enable hibernation'.

![Screenshot of the option to enable hibernation in the Azure portal while creating a VM image definition.](/azure/virtual-machines/media/hibernate-resume/hibernate-images-support.png)


#### [CLI](#tab/CLIImageGallery)
```azurecli
az sig image-definition create --resource-group MyResourceGroup \
--gallery-name MyGallery --gallery-image-definition MyImage \
--publisher GreatPublisher --offer GreatOffer --sku GreatSku \
--os-type linux --os-state Specialized \
--features IsHibernateSupported=true
```

#### [PowerShell](#tab/PSImageGallery)
```powershell
$rgName = "myResourceGroup"
$galleryName = "myGallery"
$galleryImageDefinitionName = "myImage"
$location = "eastus"
$publisherName = "GreatPublisher"
$offerName = "GreatOffer"
$skuName = "GreatSku"
$description = "My gallery"
$IsHibernateSupported = @{Name='IsHibernateSupported';Value='True'} 
$features = @($IsHibernateSupported)
New-AzGalleryImageDefinition -ResourceGroupName $rgName -GalleryName $galleryName -Name $galleryImageDefinitionName -Location $location -Publisher $publisherName -Offer $offerName -Sku $skuName -OsState "Generalized" -OsType "Windows" -Description $description -Feature $features
```
---

## Deploy hibernation enabled VMs from an OS disk 

VMs created from OS disks can also be enabled for hibernation. Ensure that the OS version associated with your OS disk supports hibernation on Azure. Refer to the list of supported OS versions.

To create VMs with hibernation enabled using OS disks, ensure that the OS disk has the hibernation property enabled. Refer to API example to enable this property on OS disks. Once the hibernation property is enabled on the OS disk, you can create hibernation enabled VMs using that OS disk.

```
PATCH https://management.azure.com/subscriptions/{subscription-id}/resourceGroups/myResourceGroup/providers/Microsoft.Compute/disks/myDisk?api-version=2021-12-01

{
  "properties": {
    "supportsHibernation": true
  }
}
```
