---
title: Diagnose artifact failures in DevTest Labs VM | Microsoft Docs
description: Learn how to troubleshoot artifact failures in DevTest Labs
services: devtest-lab,virtual-machines
documentationcenter: na
author: tomarcher
manager: douge
editor: ''

ms.assetid: 115e0086-3293-4adf-8738-9f639f31f918
ms.service: devtest-lab
ms.workload: na
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 08/18/2017
ms.author: tarcher

---
# Diagnose artifact failures in the lab 
After you have created an artifact, you can check to see if it succeeded or failed. Artifact logs in DevTest Labs provide information you can use to diagnose an artifact failure. There are a couple different ways you can view the artifact log information for a Windows VM.

> [!NOTE]
> To ensure that failures are correctly identified and explained, it is important that the artifact definition file is properly structured. For information about how to correctly construct an artifact definition file, see [Create custom artifacts](devtest-lab-artifact-author.md). And to see an example of a properly structured file, checkout this [artifact JSON file](https://github.com/Azure/azure-devtestlab/blob/master/Artifacts/windows-test-paramtypes/artifactfile.json).

## Troubleshoot artifact failures using the Azure portal
To use the Azure portal to diagnose failures during artifact creation, follow these steps:

1) From the list of resources, select your lab.

2) Choose the Windows VM that includes the artifact you want to investigate.

3) In the main blade under **GENERAL**, choose **Artifacts**. A list of artifacts associated with that VM appears, indicating the name of the artifact and its status.

   ![Artifact git repo example](./media/devtest-lab-troubleshoot-artifact-failure/devtest-lab-artifacts-failure.png)

4) Choose an artifact that shows a status of **Failed**. This opens the artifact and shows an extension message that includes details about the failure of the artifact.

   ![Artifact git repo example](./media/devtest-lab-troubleshoot-artifact-failure/devtest-lab-artifact-error.png)


## Troubleshoot artifact failures from within the VM
To view the artifact logs from within the virtual machine, follow these steps:

1) Log in to the VM that contains the artifact you want to diagnose.

2) Navigate to C:\Packages\Plugins\Microsoft.Compute.CustomScriptExtension\1.9\Status where "1.9 is the CSE version number.

   ![Artifact git repo example](./media/devtest-lab-troubleshoot-artifact-failure/devtest-lab-artifact-error-vm-status.png)


3) Open the **status** file to view information that will help diagnose artifact failures for that VM.




[!INCLUDE [devtest-lab-try-it-out](../../includes/devtest-lab-try-it-out.md)]

## Related blog posts
* [Join a VM to existing AD Domain using ARM template in Azure Dev Test Lab](http://www.visualstudiogeeks.com/blog/DevOps/Join-a-VM-to-existing-AD-domain-using-ARM-template-AzureDevTestLabs)

## Next steps
* Learn how to [add a Git repository to a lab](devtest-lab-add-artifact-repo.md).

