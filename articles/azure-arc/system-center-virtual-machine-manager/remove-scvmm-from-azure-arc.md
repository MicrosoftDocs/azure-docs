---
title: Remove your SCVMM environment from Azure Arc
description: This article explains the steps to cleanly remove your SCVMM environment from Azure Arc and delete related Azure Arc resources from Azure.
author: Farha-Bano
ms.author: v-farhabano
manager: jsuri
ms.topic: how-to
ms.date: 03/18/2024
ms.service: azure-arc
ms.subservice: azure-arc-scvmm
ms.custom:
# Customer intent: As an infrastructure admin, I want to cleanly remove my SCVMM environment from Azure Arc.
---

# Remove your SCVMM environment from Azure Arc

> [!CAUTION]
> This article references CentOS, a Linux distribution that is nearing End Of Life (EOL) status. Please consider your use and planning accordingly. For more information, see the [CentOS End Of Life guidance](~/articles/virtual-machines/workloads/centos/centos-end-of-life.md).

In this article, you learn how to cleanly remove your SCVMM managed environment from Azure Arc-enabled SCVMM. For SCVMM environments that you no longer want to manage with Azure Arc-enabled SCVMM, follow the steps in the article to:

1.	Remove guest management from SCVMM virtual machines
2.	Remove your SCVMM environment from Azure Arc
3.	Remove Arc resource bridge related items in your SCVMM management server

## 1. Remove guest management from SCVMM virtual machines
To prevent continued billing of Azure management services after you remove the SCVMM environment from Azure Arc, you must first cleanly remove guest management from all Arc-enabled SCVMM virtual machines where it was enabled. When you enable guest management on Arc-enabled SCVMM virtual machines, the Arc connected machine agent is installed on them.

Once guest management is enabled, you can install VM extensions on them and use Azure management services like the Log Analytics on them. To cleanly remove guest management, you must follow the steps below to remove any VM extensions from the virtual machine, disconnect the agent, and uninstall the software from your virtual machine. It's important to complete each of the three steps to fully remove all related software components from your virtual machines.

### Step 1: Remove VM extensions

If you have deployed Azure VM extensions to an Azure Arc-enabled SCVMM VM, you must uninstall the extensions before disconnecting the agent or uninstalling the software. Uninstalling the Azure Connected Machine agent doesn't automatically remove extensions, and they won't be recognized if you later connect the VM to Azure Arc again. Uninstall extensions using the following steps:

1. Go to [Azure Arc center in Azure portal](https://portal.azure.com/#blade/Microsoft_Azure_HybridCompute/AzureArcCenterBlade/overview)

2. Select **SCVMM management servers**.

3. Search and select the VMM management server you want to remove from Azure Arc.

4. Select Virtual machines under SCVMM inventory.

5. Search and select the virtual machine where you have Guest Management enabled.

6. Select Extensions.

7. Select the extensions and select Uninstall.

### Step 2: Disconnect the agent from Azure Arc

Disconnecting the agent clears the local state of the agent and removes agent information from our systems. To disconnect the agent, sign-in and run the following command as an administrator/root account on the virtual machine.

```powershell
    azcmagent disconnect --force-local-only
```

### Step 3: Uninstall the agent

#### For Windows virtual machines

To uninstall the Windows agent from the machine, do the following:

1. Sign in to the computer with an account that has administrator permissions.
2. In Control Panel, select Programs and Features.
3. In Programs and Features, select Azure Connected Machine Agent, select Uninstall, and then select Yes.
4. Delete the `C:\Program Files\AzureConnectedMachineAgent` folder.

#### For Linux virtual machines

To uninstall the Linux agent, the command to use depends on the Linux operating system. You must have `root` access permissions or your account must have elevated rights using sudo.

- For Ubuntu, run the following command:

  ```bash
  sudo apt purge azcmagent
  ```

- For RHEL, CentOS, Oracle Linux run the following command:

    ```bash
    sudo yum remove azcmagent
    ```

- For SLES, run the following command:

     ```bash
    sudo zypper remove azcmagent
    ```

## 2. Remove your SCVMM environment from Azure Arc

You can remove your SCVMM resources from Azure Arc using either the deboarding script or manually.

### Remove SCVMM managed resources from Azure Arc using deboarding script

Download the [deboarding script](https://download.microsoft.com/download/a/d/b/adb5650c-5c90-4e94-8a93-2a4707c2020a/arcscvmm-deboard-windows.ps1) to do a full cleanup of all the Arc-enabled SCVMM resources. The script removes all the Azure resources, including SCVMM management server, custom location, virtual machines, virtual templates, hosts, clusters, resource pools, datastores, virtual networks, Azure Resource Manager (ARM) resource of Appliance, and the appliance VM running on the SCVMM management server.

#### Run the script

To run the deboarding script, follow these steps:

##### Windows
1.	Open a PowerShell window as an Administrator and go to the folder where you've downloaded the PowerShell script.

2.	Run the following command to allow the script to run because it's an unsigned script. (If you close the session before you complete all the steps, run this command again for the new session.)

    ```powershell-interactive
    Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass
    ```
3. Run the script.

    ```powershell-interactive
    ./arcvmm-deboard-windows.ps1
    ```

#### Inputs for the script

- **vmmServerId**: The Azure resource ID of the SCVMM management server resource. </br> For example: */subscriptions/204898ee-cd13-4332-1111-88ca5c11111c/resourceGroups/Synthetics/providers/Microsoft.ScVmm/VMMServers/scvmmserverresource*

- **ApplianceConfigFilePath (optional)**: Path to kubeconfig, output from deploy command. Providing applianceconfigfilepath also deletes the appliance VM running on the SCVMM management server.

- **Force**: Using the Force flag deletes all the Azure resources without reaching resource bridge. Use this option if resource bridge VM isn't in running state.

### Remove SCVMM managed resources from Azure manually

If you aren't using the deboarding script, follow these steps to remove the SCVMM resources manually:

>[!NOTE]
>When you enable SCVMM resources in Azure, an Azure resource representing them is created. Before you can delete the SCVMM management server resource in Azure, you must delete all the Azure resources that represent your related SCVMM resources.

1. Go to [Azure Arc center in Azure portal](https://portal.azure.com/#blade/Microsoft_Azure_HybridCompute/AzureArcCenterBlade/overview)

2. Select **SCVMM management servers**.

3. Search and select the SCVMM management server you want to remove from Azure Arc.

4. Select **Virtual machines** under **SCVMM inventory**.

5. Select all the VMs that have **Virtual hardware management** value as **Enabled**.

6. Select **Remove from Azure**.

    This action only removes these resource representations from Azure. The resources continue to remain in your SCVMM management server.

7. Do the steps 4, 5, and 6 for **Clouds**, **VM networks**, and **VM templates** by performing **Remove from Azure** operation for resources with **Azure Enabled** value as **Yes**.

8. Once the deletion is complete, select **Overview**.

9. Note the **Custom location** and the **Azure Arc Resource bridge** resource in the **Essentials** section.

10. Select **Remove from Azure** to remove the SCVMM management server resource from Azure.

11. Go to the noted **Custom location** resource and select **Delete**

12. Go to the noted **Azure Arc Resource bridge** resource and select **Delete**

At this point, all your Arc-enabled SCVMM resources are removed from Azure.

## 3. Remove Arc resource bridge related items in your VMM management server

During onboarding, to create a connection between your SCVMM management server and Azure, an Azure Arc resource bridge was deployed in your SCVMM managed environment. As the last step, you must delete the resource bridge VM and the VM template created during the onboarding.

You can find both the virtual machine and the template on the resource pool/cluster/host/cloud that you provided during [Azure Arc-enabled SCVMM onboarding](./quickstart-connect-system-center-virtual-machine-manager-to-arc.md).

## Next steps

[Connect your System Center Virtual Machine Manager management server to Azure Arc again](./quickstart-connect-system-center-virtual-machine-manager-to-arc.md).
