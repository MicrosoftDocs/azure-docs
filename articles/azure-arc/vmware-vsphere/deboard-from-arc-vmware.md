---
title: Deboard from Azure Arc-enabled VMware vSphere
description: This topic explains the steps to cleanly deboard your VMware vCenter from Azure Arc-enabled VMware vSphere and delete related Azure Arc resources from Azure.
author: snehithm
ms.author: snmuvva
ms.service: arc
ms.topic: how-to 
ms.date: 3/28/2022
ms.custom: template-how-to
# Customer intent: As an infrastructure admin, I want to cleanly deboard my VMware vCenter from Azure Arc-enabled VMware vSphere.
---

# Deboard from Azure Arc-enabled VMware vSphere

In this how-to guide, you will learn how to cleanly deboard from Azure Arc-enabled VMware vSphere and delete the related Arc resources in Azure.

## Remove your VMware virtual machines from Azure management services

If you have enabled guest management on your VMware VMs and onboard-ed them to Azure management services by installing VM extensions on them (e.g. you might have installed MMA extension to collect and send logs to an Azure Log Analytics workspace), you will need to uninstall the extensions to prevent continued billing. You will also need to uninstall the Azure Connected Machine agent to avoid any problems installing the agent in future.

Following steps can be performed to uninstall extensions from the portal:

1. Go to the [Azure Arc center in Azure portal](https://portal.azure.com/#blade/Microsoft_Azure_HybridCompute/AzureArcCenterBlade/overview)

2. Click on the **VMware vCenters** blade.

3. Search and select the vCenter you plan to delete.

    ![Browse your VMware Inventory ](./media/browse-vmware-inventory.png)

4. Click on **Virtual machines** on **vCenter inventory**.

5. Search and select the virtual machine where you have Guest Management enabled.

6. Click on **Extensions**.

7. Select the extensions and click **Uninstall**

8. Log in to the virtual machine using administrator or root credentials and run the following command in the shell

    ```powershell
    azcmagent disconnect --force-local-only
    ```

9. Uninstall the ConnectedMachine agent from the machine

10. Set the identity on the virtual machine resource to none by running the following command

Steps 5 to 10 must be performed for all the VMs that have guest management enabled.

## Remove VMware vSphere resources from Azure

When you enable VMware vSphere resources in Azure a representation is created for them in Azure. Before you can delete the vCenter resource in Azure, you will need to first delete all the Azure resource representations you created for your vSphere resources. To achieve this, perform the following steps:

1. Go to the [Azure portal](https://aka.ms/vcenter)

2. Click on the **VMware vCenters** blade.

3. Search and select the vCenter you plan to delete.

4. Click on **Virtual machines** on **vCenter inventory**.

5. Select all the VMs that have **Azure Enabled** value as **Yes**.

6. Click **Remove from Azure**.

    This action will only remove these resources from Azure. The resources will continue to remain in your vCenter.

7. Perform the steps 4,5 and 6 for **Resources pools/clusters/hosts**, **Templates**, **Networks**, and **Datastores**

8. Once the deletion is complete, click on **Overview**.

9. Note the **Custom location** and the **Azure Arc Resource bridge** resource in the **Essentials** section.

10. Click **Remove from Azure** to remove the vCenter resource from Azure.

11. Go to the **Custom location** resource and click **Delete**

12. Go to the **Azure Arc Resource bridge** resource and click **Delete**

At this point, all your Arc-enabled VMware vSphere resources are removed from Azure.

## Delete Arc resources from vCenter

During onboarding, to create a connection between your VMware vCenter and Azure, an Azure Arc resource bridge is deployed into your VMware vSphere environment. As the last step, you must delete the resource bridge VM as well the VM template created during the onboarding.

You can find both the virtual machine and the template on the resource pool/cluster/host that you provided during [Azure Arc-enabled VMware vSphere onboarding](quick-start-connect-vcenter-to-arc-using-script.md).
