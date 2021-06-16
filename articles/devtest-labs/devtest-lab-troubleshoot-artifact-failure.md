---
title: Diagnose artifact failures in an Azure DevTest Labs virtual machine
description: DevTest Labs provide information that you can use to diagnose an artifact failure. This article shows you how to troubleshoot artifact failures. 
ms.topic: article
ms.date: 06/26/2020
---

# Diagnose artifact failures in the lab 
After you have created an artifact, you can check to see whether it succeeded or failed. Artifact logs in Azure DevTest Labs provide information that you can use to diagnose an artifact failure. You have a couple of options for viewing the artifact log information for a Windows VM:

* In the Azure portal
* In the VM

> [!NOTE]
> To ensure that failures are correctly identified and explained, it's important that the artifact has the proper structure. For information about how to correctly construct an artifact, see [Create custom artifacts](devtest-lab-artifact-author.md). To see an example of a properly structured artifact, check out the [Test parameter types](https://github.com/Azure/azure-devtestlab/tree/master/Artifacts/windows-test-paramtypes) artifact.

## Troubleshoot artifact failures by using the Azure portal

1. In the Azure portal, in your list of resources, select your lab.
2. Choose the Windows VM that includes the artifact that you want to investigate.
3. In the left panel, under **GENERAL**, select **Artifacts**. A list of artifacts associated with that VM appears. The name of the artifact and the artifact status are indicated.

   ![Artifact status](./media/devtest-lab-troubleshoot-artifact-failure/devtest-lab-artifacts-failure-new.png)

4. Select an artifact that shows a **Failed** status. The artifact opens. An extension message that includes details about the failure of the artifact is displayed.

   ![Artifact error message](./media/devtest-lab-troubleshoot-artifact-failure/devtest-lab-artifact-error.png)


## Troubleshoot artifact failures from within the virtual machine

1. Sign in to the VM that contains the artifact you want to diagnose.
2. Go to C:\Packages\Plugins\Microsoft.Compute.CustomScriptExtension\\*1.9*\Status, where *1.9* is the Azure Custom Script Extension version number.

   ![The Status file](./media/devtest-lab-troubleshoot-artifact-failure/devtest-lab-artifact-error-vm-status-new.png)

3. Open the **status** file.

For instructions on finding the log files on a **Linux** VM, see the following article: [Use the Azure Custom Script Extension Version 2 with Linux virtual machines](../virtual-machines/extensions/custom-script-linux.md#troubleshooting)


## Related blog posts
* [Join a VM to an existing Active Directory domain by using a Resource Manager template in DevTest Labs](https://www.visualstudiogeeks.com/blog/DevOps/Join-a-VM-to-existing-AD-domain-using-ARM-template-AzureDevTestLabs)

## Next steps
* Learn how to [add a Git repository to a lab](devtest-lab-add-artifact-repo.md).

