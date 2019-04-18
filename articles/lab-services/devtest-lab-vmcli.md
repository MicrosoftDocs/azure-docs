---
title: Create and manage virtual machines in DevTest Labs with Azure CLI | Microsoft Docs
description: Learn how to use Azure DevTest Labs to create and manage virtual machines with Azure CLI
services: devtest-lab,virtual-machines,lab-services
documentationcenter: na
author: spelluru
manager: femila
editor: ''

ms.service: lab-services
ms.workload: na
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 04/02/2019
ms.author: spelluru

---
# Create and manage virtual machines with DevTest Labs using the Azure CLI
This quickstart will guide you through creating, starting, connecting, updating, and cleaning up a development machine in your lab. 

Before you begin:

* If a lab has not been created, instructions can be found [here](devtest-lab-create-lab.md).

* [Install the Azure CLI](/cli/azure/install-azure-cli). To start, run az login to create a connection with Azure. 

## Create and verify the virtual machine 
Before you execute DevTest Labs related commands, set the appropriate Azure context by using the `az account set` command:

```azurecli
az account set --subscription 11111111-1111-1111-1111-111111111111
```

The command to create a virtual machine is: `az lab vm create`. The resource group for the lab, lab name, and virtual machine name are all required. The rest of the arguments change depending on the type of virtual machine.

The following command creates a Windows-based image from Azure Market Place. The name of the image is the same as you would see when creating a virtual machine using the Azure portal. 

```azurecli
az lab vm create --resource-group DtlResourceGroup --lab-name MyLab --name 'MyTestVm' --image "Visual Studio Community 2017 on Windows Server 2016 (x64)" --image-type gallery --size 'Standard_D2s_v3’ --admin-username 'AdminUser' --admin-password 'Password1!'
```

The following command creates a virtual machine based on a custom image available in the lab:

```azurecli
az lab vm create --resource-group DtlResourceGroup --lab-name MyLab --name 'MyTestVm' --image "My Custom Image" --image-type custom --size 'Standard_D2s_v3' --admin-username 'AdminUser' --admin-password 'Password1!'
```

The **image-type** argument has changed from **gallery** to **custom**. The name of the image matches what you see if you were to create the virtual machine in the Azure portal.

The following command creates a VM from a marketplace image with ssh authentication:

```azurecli
az lab vm create --lab-name sampleLabName --resource-group sampleLabResourceGroup --name sampleVMName --image "Ubuntu Server 16.04 LTS" --image-type gallery --size Standard_DS1_v2 --authentication-type  ssh --generate-ssh-keys --ip-configuration public 
```

You can also create virtual machines based on formulas by setting the **image-type** parameter to **formula**. If you need to choose a specific virtual network for your virtual machine, use the **vnet-name** and **subnet** parameters. For more information, see [az lab vm create](/cli/azure/lab/vm#az-lab-vm-create).

## Verify that the VM is available.
Use the `az lab vm show` command to verify that the VM is available before you start and connect to it. 

```azurecli
az lab vm show --lab-name sampleLabName --name sampleVMName --resource-group sampleResourceGroup --expand 'properties($expand=ComputeVm,NetworkInterface)' --query '{status: computeVm.statuses[0].displayStatus, fqdn: fqdn, ipAddress: networkInterface.publicIpAddress}'
```
```json
{
  "fqdn": "lisalabvm.southcentralus.cloudapp.azure.com",
  "ipAddress": "13.85.228.112",
  "status": "Provisioning succeeded"
}
```

## Start and connect to the virtual machine
The following example command starts a VM:

```azurecli
az lab vm start --lab-name sampleLabName --name sampleVMName --resource-group sampleLabResourceGroup
```

Connect to a VM: [SSH](../virtual-machines/linux/mac-create-ssh-keys.md) or [Remote Desktop](../virtual-machines/windows/connect-logon.md).
```bash
ssh userName@ipAddressOrfqdn 
```

## Update the virtual machine
The following sample command applies artifacts to a VM:

```azurecli
az lab vm apply-artifacts --lab-name  sampleLabName --name sampleVMName  --resource-group sampleResourceGroup  --artifacts @/artifacts.json
```

```json
[
  {
    "artifactId": "/artifactSources/public repo/artifacts/linux-java",
    "parameters": []
  },
  {
    "artifactId": "/artifactSources/public repo/artifacts/linux-install-nodejs",
    "parameters": []
  },
  {
    "artifactId": "/artifactSources/public repo/artifacts/linux-apt-package",
    "parameters": [
      {
        "name": "packages",
        "value": "abcd"
      },
      {
        "name": "update",
        "value": "true"
      },
      {
        "name": "options",
        "value": ""
      }
    ]
  } 
]
```

List artifacts available in the lab.
```azurecli
az lab vm show --lab-name sampleLabName --name sampleVMName --resource-group sampleResourceGroup --expand "properties(\$expand=artifacts)" --query 'artifacts[].{artifactId: artifactId, status: status}'
```
```json
{
  "artifactId": "/subscriptions/abcdeftgh1213123/resourceGroups/lisalab123RG822645/providers/Microsoft.DevTestLab/labs/lisalab123/artifactSources/public repo/artifacts/linux-install-nodejs",
  "status": "Succeeded"
}
```

## Stop and delete the virtual machine    
The following sample command stops a VM.

```azurecli
az lab vm stop --lab-name sampleLabName --name sampleVMName --resource-group sampleResourceGroup
```

Delete a VM.
```azurecli
az lab vm delete --lab-name sampleLabName --name sampleVMName --resource-group sampleResourceGroup
```

## Next steps
See the following content: [Azure CLI documentation for Azure DevTest Labs](/cli/azure/lab?view=azure-cli-latest). 