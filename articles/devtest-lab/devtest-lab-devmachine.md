---
title: Create a development machine with DevTest Labs| Microsoft Docs
description: Learn how to use Azure DevTest Labs to create a development machine with Azure CLI 2.0
services: devtest-lab,virtual-machines
documentationcenter: na
author: lisawong19
manager: douge
editor: ''

ms.service: devtest-lab
ms.workload: na
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 05/12/2017
ms.author: liwong

---
# Create a development machine with DevTest Labs using the Azure CLI
This quick start will guide you through creating, starting, connecting, updating and cleaning up a development machine in your lab. 

Before you begin:

* If a lab has not been created, instructions can be found [here](devtest-lab-create-lab.md)

* [Install CLI 2.0](https://docs.microsoft.com/en-us/cli/azure/install-azure-cli). To start, run az login to create a connection with Azure. 

## Create and verify the virtual machine 
Create a VM from a marketplace image with ssh authentication
```azurecli
az lab vm create --lab-name sampleLabName --resource-group sampleResourceGroup --name sampleVMName --image "Ubuntu Server 16.04 LTS" --image-type gallery --size Standard_DS1_v2 --authentication-type  ssh --generate-ssh-keys
```
If you want to create a VM using a formula, use the --formula parameter in [az lab vm create](https://docs.microsoft.com/en-us/cli/azure/lab/vm#create)


Verify that the VM is available 
```azurecli
az lab vm list --lab-name sampleLabName  --resource-group sampleResourceGroup  
```
```json
[
  {
    "allowClaim": false,
    "applicableSchedule": null,
    "artifactDeploymentStatus": {
      "artifactsApplied": 0,
      "deploymentStatus": null,
      "totalArtifacts": 0
    },
    "artifacts": null,
    "computeId": "/subscriptions/..../resourceGroups/lisalab123669080926004/providers/Microsoft.Compute/virtualMachines/lisalabvm",
    "computeVm": null,
    "createdByUser": "liwong@microsoft.com",
    "createdByUserId": "123456",
    "createdDate": "2017-05-12T18:13:10.112089+00:00",
    "customImageId": null,
    "disallowPublicIpAddress": true,
    "environmentId": null,
    "expirationDate": null,
    "fqdn": null,
    "galleryImageReference": {
      "offer": "UbuntuServer",
      "osType": "Linux",
      "publisher": "Canonical",
      "sku": "16.04-LTS",
      "version": "latest"
    },
    "id": "/subscriptions/..../resourcegroups/lisalab123rg822645/providers/microsoft.devtestlab/labs/lisalab123/virtualmachines/lisalabvm",
    "isAuthenticationWithSshKey": null,
    "labSubnetName": null,
    "labVirtualNetworkId": null,
    "location": "southcentralus",
    "name": "lisalabvm",
    "networkInterface": {
      "dnsName": null,
      "privateIpAddress": null,
      "publicIpAddress": null,
      "publicIpAddressId": null,
      "rdpAuthority": null,
      "sharedPublicIpAddressConfiguration": null,
      "sshAuthority": null,
      "subnetId": null,
      "virtualNetworkId": null
    },
    "notes": null,
    "osType": "Linux",
    "ownerObjectId": "83dbd007-3333-4444",
    "password": null,
    "provisioningState": "Succeeded",
    "size": "Standard_DS1_v2",
    "sshKey": null,
    "storageType": "Premium",
    "tags": null,
    "type": "Microsoft.DevTestLab/labs/virtualMachines",
    "uniqueIdentifier": "7e7b402e-3333-4444-5555",
    "userName": "liwong",
    "virtualMachineCreationSource": "FromGalleryImage"
  }
]
```

## Start and connect to the virtual machine
Start a VM
```azurecli
az lab vm start --lab-name sampleLabName --name sampleVMName --resource-group sampleResourceGroup
```

Connect to a VM: SSH or [Remote Desktop](https://docs.microsoft.com/en-us/azure/virtual-machines/windows/connect-logon)
```bash
ssh userName@ipAddress -p portNumber
```
** NOTE: port number is found in the **Essentials** section of the VM

## Update the virtual machine
Apply artifacts to a VM
```azurecli
az lab vm apply-artifacts --lab-name  sampleLabName --name sampleVMName  --resource-group sampleResourceGroup  --artifacts @/artifacts.json
```

List artifacts 
```azurecli
az lab vm show --lab-name sampleLabName --name sampleVMName --resource-group sampleResourceGroup --expand "properties(\$expand=artifacts)"
```
```json
{
	"allowClaim": false,
	"applicableSchedule": null,
	"artifactDeploymentStatus": {
		"artifactsApplied": 1,
		"deploymentStatus": "Succeeded",
		"totalArtifacts": 1
	},
	"artifacts": [
		{
			"artifactId": "/subscriptions/...../resourceGroups/lisalab123RG822645/providers/Microsoft.DevTestLab/labs/lisalab123/artifactSources/public repo/artifacts/linux-install-nodejs",
			"deploymentStatusMessage": null,
			"installTime": "2017-05-12T18:52:34.069012+00:00",
			"parameters": null,
			"status": "Succeeded",
			"vmExtensionStatusMessage": "null"
		}
	]
}
```

## Stop and clean up the virtual machine    
Stop a VM
```azurecli
az lab vm stop --lab-name sampleLabName --name sampleVMName --resource-group sampleResourceGroup
```

Delete a VM
```azurecli
az lab vm delete --lab-name sampleLabName --name sampleVMName --resource-group sampleResourceGroup
```

[!INCLUDE [devtest-lab-try-it-out](../../includes/devtest-lab-try-it-out.md)]