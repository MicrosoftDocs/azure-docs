---
title: Use Azure portal to move schedules and machines from Automation Update Management to Azure Update Manager
description: Guidance on how to use Azure portal to move schedules and machines from Automation Update Management to Azure Update Manager
author: snehasudhirG
ms.service: azure-update-manager
ms.topic: how-to
ms.date: 08/01/2024
ms.author: sudhirsneha
---

# Migration using Azure portal

**Applies to:** :heavy_check_mark: Windows VMs :heavy_check_mark: Linux VMs :heavy_check_mark: On-premises environment :heavy_check_mark: Azure Arc-enabled servers
 
 
This article explains how to use the Azure portal to move schedules and machines from Automation Update Management to Azure Update Manager. With minimal clicks and automated way to move your resources, it's the easiest way to move if you don't have customizations built on top of your Automation Update Management solution. For more details on what this portal tool is doing in the backend, please refer to [migration scripts](migration-using-runbook-scripts.md)

## Azure portal experience

To access the portal migration experience, you can use several entry points.

Select the **Migrate Now** button present on the following entry points. After the selection, you're guided through the process of moving your schedules and machines to Azure Update Manager. This process is designed to be user-friendly and straight forward to allow you to complete the migration with minimal effort.

You can migrate from any of the following entry points:

#### [Automation Update Management](#tab/update-mgmt)

Select the **Migrate Now** button. 

   :::image type="content" source="./media/migration-using-portal/migrate-from-update-management.png" alt-text="Screenshot that shows how to migrate from Automation Update Management entry point." lightbox="./media/migration-using-portal/migrate-from-update-management.png":::

The migration blade opens. It contains a summary of all resources including machines, and schedules in the Automation account. By default, the Automation account from which you accessed this blade is preselected if you go by this route.

Here, you can see how many of Azure, Arc-enabled servers, non-Azure non Arc-enabled servers, and schedules are enabled in Automation Update Management and need to be moved to Azure Update Manager. You can also view the details of these resources.

:::image type="content" source="./media/migration-using-portal/migrate-resources-automation-account.png" alt-text="Screenshot that shows how to migrate all resources from Automation account." lightbox="./media/migration-using-portal/migrate-resources-automation-account.png":::

After you review the resources that must be moved, you can proceed with the migration process which is a three-step process:

1. **Prerequisites** 

   This includes two steps:

   a. **Onboard non-Azure non-Arc-enabled machines to Arc** - This is because Arc connectivity is a prerequisite for Azure Update Manager. Onboarding your machines to Azure Arc is free of cost, and once you do so, you can avail all management services as you can do for any Azure machine. For more information, see [Azure Arc documentation](../azure-arc/servers/onboard-service-principal.md)
   on how to onboard your machines.

   b. **Download and run PowerShell script locally** -  This is required for the creation of a user identity and appropriate role assignments so that the migration can take place. This script gives proper RBAC to the User Identity on the subscription to which the automation account belongs, machines onboarded to Automation Update Management, scopes that are part of dynamic queries etc. so that the configuration can be assigned to the machines, MRP configurations can be created and updates solution can be removed. 
   
   :::image type="content" source="./media/migration-using-portal/prerequisite-migration-update-manager.png" alt-text="Screenshot that shows the prerequisites for migration." lightbox="./media/migration-using-portal/prerequisite-migration-update-manager.png":::

1. **Move resources in Automation account to Azure Update Manager**
   
   The next step in the migration process is to enable Azure Update Manager on the machines to be moved and create equivalent maintenance configurations for the schedules to be migrated. When you select the **Migrate Now** button, it imports the *MigrateToAzureUpdateManager* runbook into your Automation account and sets the verbose logging to **True**.

   :::image type="content" source="./media/migration-using-portal/step-two-migrate-workload.png" alt-text="Screenshot that shows how to migrate workload in your Automation account." lightbox="./media/migration-using-portal/step-two-migrate-workload.png":::
   
   Select **Start** runbook, which presents the parameters that must be passed to the runbook.
    
   :::image type="content" source="./media/migration-using-portal/start-runbook-migration.png" alt-text="Screenshot that shows how to start runbook to allow the parameters to be passed to the runbook." lightbox="./media/migration-using-portal/start-runbook-migration.png":::

   For more information on the parameters to fetch and the location from where it must be fetched, see [migration of machines and schedules](migration-using-runbook-scripts.md#step-1-migration-of-machines-and-schedules). Once you start the runbook after passing in all the parameters, Azure Update Manager will begin to get enabled on machines and maintenance configuration in Azure Update Manager will start getting created. You can monitor Azure runbook logs for the status of execution and migration of schedules.


1. **Deboard resources from Automation Update management**

   Run the clean-up script to deboard machines from the Automation Update Management solution and disable Automation Update Management schedules. 

   After you select the **Run clean-up script** button, the runbook *DeboardFromAutomationUpdateManagement* will be imported into your Automation account, and its verbose logging is set to **True**. 

   :::image type="content" source="./media/migration-using-portal/run-clean-up-script.png" alt-text="Screenshot that shows how to perform post migration." lightbox="./media/migration-using-portal/run-clean-up-script.png":::

   When you select **Start** the runbook, asks for parameters to be passed to the runbook. For more information, see [Deboarding from Automation Update Management solution](migration-using-runbook-scripts.md#step-2-deboarding-from-automation-update-management-solution) to fetch the parameters to be passed to the runbook.

   :::image type="content" source="./media/migration-using-portal/deboard-update-management-start-runbook.png" alt-text="Screenshot that shows how to deboard from Automation Update Management and starting the runbook." lightbox="./media/migration-using-portal/deboard-update-management-start-runbook.png":::

#### [Azure Update Manager](#tab/update-manager)

You can initiate migration from Azure Update Manager. On the top of screen, you can see a deprecation banner with a **Migrate Now** button at the top of screen. 

  :::image type="content" source="./media/migration-using-portal/migration-entry-update-manager.png" alt-text="Screenshot that shows how to migrate from Azure Update Manager entry point." lightbox="./media/migration-using-portal/migration-entry-update-manager.png":::

Select **Migrate Now** button to view the migration blade that allows you to select the Automation account whose resources you want to move from Automation Update Management to Azure Update Manager. You must select subscription, resource group, and finally the Automation account name. After you select, you will view the summary of machines and schedules to be migrated to Azure Update Manager. From here, follow the migration steps listed in [Automation Update Management](#azure-portal-experience).

#### [Virtual machine](#tab/virtual-machine)

To initiate migration from a single VM **Updates** view, follow these steps:

1. Select the machine that is enabled for Automation Update Management and under **Operations**, select **Updates**.
1. In the deprecation banner, select the **Migrate Now** button.
   
   :::image type="content" source="./media/migration-using-portal/migrate-single-virtual-machine.png" alt-text="Screenshot that shows how to migrate from single virtual machine entry point." lightbox="./media/migration-using-portal/migrate-single-virtual-machine.png":::

   You can see that the Automation account to which the machine belongs is preselected and a summary of all resources in the Automation account is presented. This allows you to migrate the resources from Automation Update Management to Azure Update Manager.

   :::image type="content" source="./media/migration-using-portal/single-vm-migrate-now.png" alt-text="Screenshot that shows how to migrate the resources from single virtual machine entry point." lightbox="./media/migration-using-portal/single-vm-migrate-now.png":::

---

## Next steps

- [An overview of migration](migration-overview.md)
- [Migration using runbook scripts](migration-using-runbook-scripts.md)
- [Manual migration guidance](migration-manual.md)
- [Key points during migration](migration-key-points.md)
