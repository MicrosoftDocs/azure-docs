---
title: Deboard from Azure Arc-enabled VMware vSphere
description: This article explains the steps to cleanly deboard your VMware vCenter from Azure Arc-enabled VMware vSphere and delete related Azure Arc resources from Azure.
author: snehithm
ms.author: snmuvva
ms.topic: how-to 
ms.date: 3/28/2022
# Customer intent: As an infrastructure admin, I want to cleanly deboard my VMware vCenter from Azure Arc-enabled VMware vSphere.
---

# Deboard from Azure Arc-enabled VMware vSphere

In this article, you'll learn how to cleanly deboard from Azure Arc-enabled VMware vSphere.

## Remove your VMware virtual machines from Azure management services

For VMware VMs that you've onboarded to Azure management services by installing VM extensions on them (for example, say MMA extension was installed to collect and send logs to an Azure Log Analytics), you must uninstall the extensions to prevent continued billing. You must also uninstall the Azure Connected Machine agent to avoid problems reinstalling the agent in future.

Uninstall extensions and the Connected Machine agent using following steps:

1. Go to [Azure Arc center in Azure portal](https://portal.azure.com/#blade/Microsoft_Azure_HybridCompute/AzureArcCenterBlade/overview)

2. Select **VMware vCenters**.

3. Search and select the vCenter you plan to deboard.

    ![Browse your VMware Inventory ](./media/browse-vmware-inventory.png)

4. Select **Virtual machines** under **vCenter inventory**.

5. Search and select the virtual machine where you have Guest Management enabled.

6. Select **Extensions**.

7. Select the extensions and select **Uninstall**

8. Sign-in the virtual machine using administrator or root credentials and run the following command in the shell

    ```powershell
    azcmagent disconnect --force-local-only
    ```

9. Uninstall the Connected Machine agent from the machine

10. Set the identity on the virtual machine resource to none by running the following command

Steps 5 to 10 must be performed for all the VMs that have guest management enabled.

## Remove VMware vSphere resources from Azure

When you enable VMware vSphere resources in Azure, an Azure resource representing them is created. Before you can delete the vCenter resource in Azure, you must delete all the Azure resources that represent your related vSphere resources.

1. Go to [Azure Arc center in Azure portal](https://portal.azure.com/#blade/Microsoft_Azure_HybridCompute/AzureArcCenterBlade/overview)

2. Select **VMware vCenters**.

3. Search and select the vCenter you plan to deboard.

4. Select **Virtual machines** under **vCenter inventory**.

5. Select all the VMs that have **Azure Enabled** value as **Yes**.

6. Select **Remove from Azure**.

    This action will only remove these resource representations from Azure. The resources will continue to remain in your vCenter.

7. Perform the steps 4,5 and 6 for **Resources pools/clusters/hosts**, **Templates**, **Networks**, and **Datastores**

8. Once the deletion is complete, select **Overview**.

9. Note the **Custom location** and the **Azure Arc Resource bridge** resource in the **Essentials** section.

10. Select **Remove from Azure** to remove the vCenter resource from Azure.

11. Go to the **Custom location** resource and click **Delete**

12. Go to the **Azure Arc Resource bridge** resource and click **Delete**

At this point, all your Arc-enabled VMware vSphere resources are removed from Azure.

## Delete Arc resources from vCenter

During onboarding, to create a connection between your VMware vCenter and Azure, an Azure Arc resource bridge is deployed into your VMware vSphere environment. As the last step, you must delete the resource bridge VM as well the VM template created during the onboarding.

You can find both the virtual machine and the template on the resource pool/cluster/host that you provided during [Azure Arc-enabled VMware vSphere onboarding](quick-start-connect-vcenter-to-arc-using-script.md).

## Next steps