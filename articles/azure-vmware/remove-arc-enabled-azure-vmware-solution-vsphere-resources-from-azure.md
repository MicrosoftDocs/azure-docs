---
title: Remove Arc-enabled Azure VMware Solution vSphere resources from Azure
description: Learn how to remove Arc-enabled Azure VMware Solution vSphere resources from Azure.
ms.topic: how-to 
ms.service: azure-vmware
ms.date: 11/01/2023
ms.custom: references_regions
---

# Remove Arc-enabled Azure VMware Solution vSphere resources from Azure

In this article, learn how to cleanly remove your VMware vCenter environment from Azure Arc-enabled VMware vSphere. For VMware vSphere environments that you no longer want to manage with Azure Arc-enabled VMware vSphere, use the information in this article to perform the following actions: 

- Remove guest management from VMware virtual machines (VMs). 
- Remove VMware vSphere resource from Azure Arc.
- Remove Arc resource bridge related items in your vCenter.

## Remove guest management from VMware VMs

To prevent continued billing of Azure management services, after you remove the vSphere environment from Azure Arc, you must first remove guest management from all Arc-enabled Azure VMware Solution VMs where it was enabled. 

When you enable guest management on Arc-enabled Azure VMware Solution VMs, the Arc connected machine agent is installed on them. Once guest management is enabled, you can install VM extensions on them and use Azure management services like the Log Analytics on them. 

To completely remove guest management, use the following steps to remove any VM extensions from the virtual machine, disconnect the agent, and uninstall the software from your virtual machine. It's important to complete each of the three steps to fully remove all related software components from your virtual machines. 

### Remove VM extensions

Use the following steps to uninstall extensions from the portal. 

> [!NOTE]
> **Steps 2-5** must be performed for all the VMs that have VM extensions installed.

1. Sign in to your Azure VMware Solution private cloud. 
1. Select **Virtual machines** in **Private cloud**, found in the left navigation under “vCenter Server Inventory Page".
1. Search and select the virtual machine where you have **Guest management** enabled.
1. Select **Extensions**.
1. Select the extensions and select **Uninstall**.

### Disable guest management from Azure Arc

To avoid problems onboarding the same VM to **Guest management**, we recommend you do the following steps to cleanly disable guest management capabilities. 

> [!NOTE]
> **Steps 2-3** must be performed for **all VMs** that have **Guest management** enabled.

1. Sign into the virtual machine using administrator or root credentials and run the following command in the shell.
    1. `azcmagent disconnect --force-local-only`.
1. Uninstall the `ConnectedMachine agent` from the machine.
1. Set the **identity** on the VM resource to **none**. 

## Uninstall agents from Virtual Machines (VMs)

### Windows VM uninstall

To uninstall the Windows agent from the machine, use the following steps:

1. Sign in to the computer with an account that has administrator permissions.
2. In **Control Panel**, select **Programs and Features**.
3. In **Programs and Features**, select **Azure Connected machine Agent**, select **Uninstall**, then select **Yes**.
4. Delete the `C:\Program Files\AzureConnectedMachineAgent` folder.

### Linux VM uninstall

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

## Remove VMware vSphere resources from Azure

When you activate Arc-enabled Azure VMware Solution resources in Azure, a representation is created for them in Azure. Before you can delete the vCenter Server resource in Azure, you need to delete all of the Azure resource representations you created for your vSphere resources. To delete the Azure resource representations you created, do the following steps: 

1. Go to the Azure portal.
1. Choose **Virtual machines** from Arc-enabled VMware vSphere resources in the private cloud.
1. Select all the VMs that have an Azure Enabled value as **Yes**.
1. Select **Remove from Azure**. This step starts deployment and removes these resources from Azure. The resources remain in your vCenter Server.
    1. Repeat steps 2, 3 and 4 for **Resourcespools/clusters/hosts**, **Templates**, **Networks**, and **Datastores**.
1. When the deletion completes, select **Overview**.
    1. Note the Custom location and the Azure Arc Resource bridge resources in the Essentials section.
1. Select **Remove from Azure** to remove the vCenter Server resource from Azure.
1. Go to vCenter Server resource in Azure and delete it.
1. Go to the Custom location resource and select **Delete**.
1. Go to the Azure Arc Resource bridge resources and select **Delete**. 

At this point, all of your Arc-enabled VMware vSphere resources are removed from Azure.

## Remove Arc resource bridge related items in your vCenter

During onboarding, to create a connection between your VMware vCenter and Azure, an Azure Arc resource bridge is deployed into your VMware vSphere environment. As the last step, you must delete the resource bridge VM as well the VM template created during the onboarding.

As a last step, run the following command: 

[`az rest --method delete`](https://management.azure.com/subscriptions/f%7BsubId%7D/resourcegroups/%7Brg)

Once that step is done, Arc no longer works on the Azure VMware Solution private cloud. When you delete Arc resources from vCenter Server, it doesn't affect the Azure VMware Solution private cloud for the customer. 
