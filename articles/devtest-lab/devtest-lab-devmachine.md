---
title: Use Azure DevTest Labs for developer machine | Microsoft Docs
description: Learn how to use Azure DevTest Labs for developer sceanrios with CLI.
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
ms.date: 05/01/2017
ms.author: liwong

---
# Use Azure DevTest Labs for developer machine with CLI 
Azure DevTest labs 

Prerequisites: 

* If a lab has not been created, create one using the instructions from [create lab](devtest-lab-create-lab.md)

* [Install CLI 2.0](https://docs.microsoft.com/en-us/cli/azure/install-azure-cli) 

1. Create a VM from a marketplace image with ssh authentication.
'''azcli
az lab vm create --lab-name sampleLabName --resource-group sampleResourceGroup --name sampleVMName --image "Ubuntu Server 16.04 LTS" --image-type gallery --size Standard_DS1_v2 --authentication-type  ssh  --ssh-key  ~/.ssh/id_rsa.pub
'''

2. Create a Jenkins VM from a custom image already in the Lab with password authentication.

* az lab vm create --lab-name sampleLabName --resource-group sampleResourceGroup --name sampleVMName --image "jenkins_custom" --image-type custom --size Standard_DS1_v2

3. Create a VM from a formula with password authentication.

* az lab vm create --lab-name sampleLabName --resource-group sampleResourceGroup --name sampleVMName --formula MyFormula --artifacts @/artifacts.json

4. List my VMs in the lab. 

* az lab vm list --lab-name sampleLabName  --resource-group sampleResourceGroup  

5. List all VMs available in that lab
az lab vm list --lab-name sampleLabName  --resource-group sampleResourceGroup  --all

6. Start a VM
* az lab vm stop --lab-name sampleLabName --name sampleVMName --resource-group sampleResourceGroup

7. Stop a VM
* az lab vm start --lab-name sampleLabName --name sampleVMName --resource-group sampleResourceGroup

8. Connect to a VM.
    SSH
    https://docs.microsoft.com/en-us/azure/virtual-machines/linux/mac-create-ssh-keys
    ssh userName@ipAddress -p portNumber
    ** note: DTL doesn't use port 22, port number is found in the essentials section (add a screen cap?)
    
    Remote Desktop
    https://docs.microsoft.com/en-us/azure/virtual-machines/windows/connect-logon

9. List artifacts 
* az lab vm show --lab-name sampleLabName --name sampleVMName --resource-group sampleResourceGroup --expand "properties(\$expand=artifacts)"


10. Apply artifacts to a VM
* az lab vm apply-artifacts --lab-name  sampleLabName --name sampleVMName  --resource-group sampleResourceGroup  --artifacts @/Users/lisa/Desktop/lab-nodejs-artifact.json
