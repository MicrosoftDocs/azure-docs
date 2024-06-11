---
title: Guidance to move virtual machines from Automation Update Management to Azure Update Manager
description: Guidance overview on migration from Automation Update Management to Azure Update Manager
author: snehasudhirG
ms.service: azure-update-manager
ms.topic: conceptual
ms.date: 05/09/2024
ms.author: sudhirsneha
---

# Move from Automation Update Management to Azure Update Manager

**Applies to:** :heavy_check_mark: Windows VMs :heavy_check_mark: Linux VMs :heavy_check_mark: On-premises environment :heavy_check_mark: Azure Arc-enabled servers

This article provides guidance to move virtual machines from Automation Update Management to Azure Update Manager.

Azure Update Manager provides a SaaS solution to manage and govern software updates to Windows and Linux machines across Azure, on-premises, and multicloud environments. It's an evolution of [Azure Automation Update management solution](../automation/update-management/overview.md) with new features and functionality, for assessment and deployment of software updates on a single machine or on multiple machines at scale.

For the Azure Update Manager, both AMA and MMA aren't a requirement to manage software update workflows as it relies on the Microsoft Azure VM Agent for Azure VMs and Azure connected machine agent for Arc-enabled servers. When you perform an update operation for the first time on a machine, an extension is pushed to the machine and it interacts with the agents to assess missing updates and install updates.


> [!NOTE] 
> - If you are using Azure Automation Update Management Solution, we recommend that you don't remove MMA agents from the machines without completing the migration to Azure Update Manager for the machine's patch management needs. If you remove the MMA agent from the machine without moving to Azure Update Manager, it would break the patching workflows for that machine. 
>
> - All capabilities of Azure Automation Update Management will be available on Azure Update Manager before the deprecation date.

## Azure portal experience

This section explains how to use the portal experience to move schedules and machines from Automation Update Management to Azure Update Manager. With minimal clicks and automated way to move your resources, it's the easiest way to move if you don't have customizations built on top of your Automation Update Management solution.

To access the portal migration experience, you can use several entry points.

Select the **Migrate Now** button present on the following entry points. After the selection, you're guided through the process of moving your schedules and machines to Azure Update Manager. This process is designed to be user-friendly and straight forward to allow you to complete the migration with minimal effort.

You can migrate from any of the following entry points:

#### [Automation Update Management](#tab/update-mgmt)

Select the **Migrate Now** button and a migration blade opens. It contains a summary of all resources including machines, and schedules in the Automation account. By default, the Automation account from which you accessed this blade is preselected if you go by this route. 

   :::image type="content" source="./media/guidance-migration-automation-update-management-azure-update-manager/migrate-from-update-management.png" alt-text="Screenshot that shows how to migrate from Automation Update Management entry point." lightbox="./media/guidance-migration-automation-update-management-azure-update-manager/migrate-from-update-management.png":::

Here, you can see how many of Azure, Arc-enabled servers, non-Azure non Arc-enabled servers, and schedules are enabled in Automation Update Management and need to be moved to Azure Update Manager. You can also view the details of these resources.

The migration blade provides an overview of the resources that will be moved, allowing you to review and confirm the migration before proceeding. Once you're ready, you can proceed with the migration process to move your schedules and machines to Azure Update Manager.

:::image type="content" source="./media/guidance-migration-automation-update-management-azure-update-manager/migrate-resources-automation-account.png" alt-text="Screenshot that shows how to migrate all resources from Automation account." lightbox="./media/guidance-migration-automation-update-management-azure-update-manager/migrate-resources-automation-account.png":::

After you review the resources that must be moved, you can proceed with the migration process which is a three-step process:

1. **Prerequisites** 

   This includes two steps:

   a. **Onboard non-Azure non-Arc-enabled machines to Arc** - This is because Arc connectivity is a prerequisite for Azure Update Manager. Onboarding your machines to Azure Arc is free of cost, and once you do so, you can avail all management services as you can do for any Azure machine. For more information, see [Azure Arc documentation](../azure-arc/servers/onboard-service-principal.md)
   on how to onboard your machines.

   b. **Download and run PowerShell script locally** -  This is required for the creation of a user identity and appropriate role assignments so that the migration can take place. This script gives proper RBAC to the User Identity on the subscription to which the automation account belongs, machines onboarded to Automation Update Management, scopes that are part of dynamic queries etc. so that the configuration can be assigned to the machines, MRP configurations can be created and updates solution can be removed. For more information, see [Azure Update Manager documentation](guidance-migration-automation-update-management-azure-update-manager.md#prerequisite-2-create-user-identity-and-role-assignments-by-running-powershell-script).
   
   :::image type="content" source="./media/guidance-migration-automation-update-management-azure-update-manager/prerequisite-migration-update-manager.png" alt-text="Screenshot that shows the prerequisites for migration." lightbox="./media/guidance-migration-automation-update-management-azure-update-manager/prerequisite-migration-update-manager.png":::

1. **Move resources in Automation account to Azure Update Manager**
   
   The next step in the migration process is to enable Azure Update Manager on the machines to be moved and create equivalent maintenance configurations for the schedules to be migrated. When you select the **Migrate Now** button, it imports the *MigrateToAzureUpdateManager* runbook into your Automation account and sets the verbose logging to **True**.

   :::image type="content" source="./media/guidance-migration-automation-update-management-azure-update-manager/step-two-migrate-workload.png" alt-text="Screenshot that shows how to migrate workload in your Automation account." lightbox="./media/guidance-migration-automation-update-management-azure-update-manager/step-two-migrate-workload.png":::
   
   Select **Start** runbook, which presents the parameters that must be passed to the runbook.
    
   :::image type="content" source="./media/guidance-migration-automation-update-management-azure-update-manager/start-runbook-migration.png" alt-text="Screenshot that shows how to start runbook to allow the parameters to be passed to the runbook." lightbox="./media/guidance-migration-automation-update-management-azure-update-manager/start-runbook-migration.png":::

   For more information on the parameters to fetch and the location from where it must be fetched, see [migration of machines and schedules](#step-1-migration-of-machines-and-schedules). Once you start the runbook after passing in all the parameters, Azure Update Manager will begin to get enabled on machines and maintenance configuration in Azure Update Manager will start getting created. You can monitor Azure runbook logs for the status of execution and migration of schedules.


1. **Deboard resources from Automation Update management**

   Run the clean-up script to deboard machines from the Automation Update Management solution and disable Automation Update Management schedules. 

   After you select the **Run clean-up script** button, the runbook *DeboardFromAutomationUpdateManagement* will be imported into your Automation account, and its verbose logging is set to **True**. 

   :::image type="content" source="./media/guidance-migration-automation-update-management-azure-update-manager/run-clean-up-script.png" alt-text="Screenshot that shows how to perform post migration." lightbox="./media/guidance-migration-automation-update-management-azure-update-manager/run-clean-up-script.png":::

   When you select **Start** the runbook, asks for parameters to be passed to the runbook. For more information, see [Deboarding from Automation Update Management solution](#step-2-deboarding-from-automation-update-management-solution) to fetch the parameters to be passed to the runbook.

   :::image type="content" source="./media/guidance-migration-automation-update-management-azure-update-manager/deboard-update-management-start-runbook.png" alt-text="Screenshot that shows how to deboard from Automation Update Management and starting the runbook." lightbox="./media/guidance-migration-automation-update-management-azure-update-manager/deboard-update-management-start-runbook.png":::

#### [Azure Update Manager](#tab/update-manager)

You can initiate migration from Azure Update Manager. On the top of screen, you can see a deprecation banner with a **Migrate Now** button at the top of screen. 

  :::image type="content" source="./media/guidance-migration-automation-update-management-azure-update-manager/migration-entry-update-manager.png" alt-text="Screenshot that shows how to migrate from Azure Update Manager entry point." lightbox="./media/guidance-migration-automation-update-management-azure-update-manager/migration-entry-update-manager.png":::

Select **Migrate Now** button to view the migration blade that allows you to select the Automation account whose resources you want to move from Automation Update Management to Azure Update Manager. You must select subscription, resource group, and finally the Automation account name. After you select, you will view the summary of machines and schedules to be migrated to Azure Update Manager. From here, follow the migration steps listed in [Automation Update Management](#azure-portal-experience).

#### [Virtual machine](#tab/virtual-machine)

To initiate migration from a single VM **Updates** view, follow these steps:

1. Select the machine that is enabled for Automation Update Management and under **Operations**, select **Updates**.
1. In the deprecation banner, select the **Migrate Now** button.
   
   :::image type="content" source="./media/guidance-migration-automation-update-management-azure-update-manager/migrate-single-virtual-machine.png" alt-text="Screenshot that shows how to migrate from single virtual machine entry point." lightbox="./media/guidance-migration-automation-update-management-azure-update-manager/migrate-single-virtual-machine.png":::

   You can see that the Automation account to which the machine belongs is preselected and a summary of all resources in the Automation account is presented. This allows you to migrate the resources from Automation Update Management to Azure Update Manager.

   :::image type="content" source="./media/guidance-migration-automation-update-management-azure-update-manager/single-vm-migrate-now.png" alt-text="Screenshot that shows how to migrate the resources from single virtual machine entry point." lightbox="./media/guidance-migration-automation-update-management-azure-update-manager/single-vm-migrate-now.png":::

   From here, follow the migration steps listed in [Automation Update Management](#azure-portal-experience).

   For more information on how the scripts are executed in the backend, and their behavior see, [Migration scripts](#migration-scripts).

---

## Migration scripts

Using migration runbooks, you can automatically migrate all workloads (machines and schedules) from Automation Update Management to Azure Update Manager. This section details on how to run the script, what the script does at the backend, expected behavior, and any limitations, if applicable. The script can migrate all the machines and schedules in one automation account at one go. If you have multiple automation accounts, you have to run the runbook for all the automation accounts.

At a high level, you need to follow the below steps to migrate your machines and schedules from Automation Update Management to Azure Update Manager. 

### Prerequisites summary

1. Onboard [non-Azure machines on to Azure Arc](../azure-arc/servers/onboard-service-principal.md).
1. Download and run the PowerShell script for the creation of User Identity and Role Assignments locally on your system. See detailed instructions in the [step-by-step guide](#step-by-step-guide) as it also has certain prerequisites.

### Steps summary

1. Run migration automation runbook for migrating machines and schedules from Automation Update Management to Azure Update Manager. See detailed instructions in the [step-by-step guide](#step-by-step-guide). 
1. Run cleanup scripts to deboard from Automation Update Management. See detailed instructions in the [step-by-step guide](#step-by-step-guide).

### Unsupported scenarios

- Non-Azure Saved Search Queries won't be migrated; these have to be migrated manually.

For the complete list of limitations and things to note, see the last section of this article.

### Step-by-step guide

The information mentioned in each of the above steps is explained in detail below.

#### Prerequisite 1: Onboard Non-Azure Machines to Arc

**What to do**

Migration automation runbook ignores resources that aren't onboarded to Arc. It's therefore a prerequisite to onboard all non-Azure machines on to Azure Arc before running the migration runbook. Follow the steps to [onboard machines on to Azure Arc](../azure-arc/servers/onboard-service-principal.md).

#### Prerequisite 2: Create User Identity and Role Assignments by running PowerShell script


**A. Prerequisites to run the script**

   - Run the command `Install-Module -Name Az -Repository PSGallery -Force` in PowerShell. The prerequisite script depends on Az.Modules. This step is required if Az.Modules aren't present or updated.
   - To run this prerequisite script, you must have *Microsoft.Authorization/roleAssignments/write* permissions on all the subscriptions that contain Automation Update Management resources such as machines, schedules, log analytics workspace, and automation account. See [how to assign an Azure role](../role-based-access-control/role-assignments-rest.md#assign-an-azure-role).
   - You must have the [Update Management Permissions](../automation/automation-role-based-access-control.md).
 
   :::image type="content" source="./media/guidance-migration-automation-update-management-azure-update-manager/prerequisite-install-module.png" alt-text="Screenshot that shows how the command to install module." lightbox="./media/guidance-migration-automation-update-management-azure-update-manager/prerequisite-install-module.png":::


**B. Run the script** 

   Download and run the PowerShell script [`MigrationPrerequisiteScript`](https://github.com/azureautomation/Preqrequisite-for-Migration-from-Azure-Automation-Update-Management-to-Azure-Update-Manager/blob/main/MigrationPrerequisites.ps1) locally. This script takes AutomationAccountResourceId of the Automation account to be migrated and AutomationAccountAzureEnvironment as the inputs. The accepted values for AutomationAccountAzureEnvironment are AzureCloud, AzureUSGovernment and AzureChina signifying the cloud to which the automation account belongs.
    
   :::image type="content" source="./media/guidance-migration-automation-update-management-azure-update-manager/run-script.png" alt-text="Screenshot that shows how to download and run the script." lightbox="./media/guidance-migration-automation-update-management-azure-update-manager/run-script.png":::

   You can fetch AutomationAccountResourceId by going to **Automation Account** > **Properties**.

   :::image type="content" source="./media/guidance-migration-automation-update-management-azure-update-manager/fetch-resource-id.png" alt-text="Screenshot that shows how to fetch the resource ID." lightbox="./media/guidance-migration-automation-update-management-azure-update-manager/fetch-resource-id.png":::

**C. Verify** 

   After you run the script, verify that a user managed identity is created in the automation account. **Automation account** > **Identity** > **User Assigned**.

   :::image type="content" source="./media/guidance-migration-automation-update-management-azure-update-manager/script-verification.png" alt-text="Screenshot that shows how to verify that a user managed identity is created." lightbox="./media/guidance-migration-automation-update-management-azure-update-manager/script-verification.png":::

**D. Backend operations by the script**

 1. Updating the Az.Modules for the Automation account, which will be required for running migration and deboarding scripts.
 1. Creates an automation variable with name AutomationAccountAzureEnvironment which will store the Azure Cloud Environment to which Automation Account belongs.
 1. Creation of User Identity in the same Subscription and resource group as the Automation Account. The name of User Identity will be like *AutomationAccount_aummig_umsi*. 
 1. Attaching the User Identity to the Automation Account.
 1. The script assigns the following permissions to the user managed identity: [Update Management Permissions Required](../automation/automation-role-based-access-control.md#update-management-permissions).


     1. For this, the script fetches all the machines onboarded to Automation Update Management under this automation account and parse their subscription IDs to be given the required RBAC to the User Identity. 
     1. The script gives a proper RBAC to the User Identity on the subscription to which the automation account belongs so that the MRP configs can be created here.
     1. The script assigns the required roles for the Log Analytics workspace and solution. 
 1. Registration of required subscriptions to Microsoft.Maintenance and Microsoft.EventGrid Resource Providers.
 
#### Step 1: Migration of machines and schedules

This step involves using an automation runbook to migrate all the machines and schedules from an automation account to Azure Update Manager.

**Follow these steps:**

1. Import [migration runbook](https://github.com/azureautomation/Migrate-from-Azure-Automation-Update-Management-to-Azure-Update-Manager/blob/main/Migration.ps1) from the runbooks gallery and publish. Search for **azure automation update** from browse gallery, and import the migration runbook named **Migrate from Azure Automation Update Management to Azure Update Manager** and publish the runbook.

   :::image type="content" source="./media/guidance-migration-automation-update-management-azure-update-manager/migrate-from-automation-update-management.png" alt-text="Screenshot that shows how to migrate from Automation Update Management." lightbox="./media/guidance-migration-automation-update-management-azure-update-manager/migrate-from-automation-update-management.png":::

   Runbook supports PowerShell 5.1.

   :::image type="content" source="./media/guidance-migration-automation-update-management-azure-update-manager/runbook-support.png" alt-text="Screenshot that shows runbook supports PowerShell 5.1 while importing." lightbox="./media/guidance-migration-automation-update-management-azure-update-manager/runbook-support.png":::

1. Set Verbose Logging to True for the runbook. 

   :::image type="content" source="./media/guidance-migration-automation-update-management-azure-update-manager/verbose-log-records.png" alt-text="Screenshot that shows how to set verbose log records." lightbox="./media/guidance-migration-automation-update-management-azure-update-manager/verbose-log-records.png":::

1. Run the runbook and pass the required parameters like AutomationAccountResourceId, UserManagedServiceIdentityClientId, etc. 

   :::image type="content" source="./media/guidance-migration-automation-update-management-azure-update-manager/run-runbook-parameters.png" alt-text="Screenshot that shows how to run the runbook and pass the required parameters." lightbox="./media/guidance-migration-automation-update-management-azure-update-manager/run-runbook-parameters.png":::

   1. You can fetch AutomationAccountResourceId from **Automation Account** > **Properties**.

      :::image type="content" source="./media/guidance-migration-automation-update-management-azure-update-manager/fetch-resource-id-portal.png" alt-text="Screenshot that shows how to fetch Automation account resource ID." lightbox="./media/guidance-migration-automation-update-management-azure-update-manager/fetch-resource-id-portal.png":::

   1. You can fetch UserManagedServiceIdentityClientId from **Automation Account** > **Identity** > **User Assigned** > **Identity** > **Properties** > **Client ID**.

      :::image type="content" source="./media/guidance-migration-automation-update-management-azure-update-manager/fetch-client-id.png" alt-text="Screenshot that shows how to fetch client ID." lightbox="./media/guidance-migration-automation-update-management-azure-update-manager/fetch-client-id.png":::

   1. Setting **EnablePeriodicAssessmentForMachinesOnboardedToUpdateManagement** to **TRUE** would enable periodic assessment property on all the machines onboarded to Automation Update Management. 

   1. Setting **MigrateUpdateSchedulesAndEnablePeriodicAssessmentonLinkedMachines** to **TRUE** would migrate all the update schedules in Automation Update Management to Azure Update Manager and would also turn on periodic assessment property to **True** on all the machines linked to these schedules. 

   1. You need to specify **ResourceGroupForMaintenanceConfigurations** where all the maintenance configurations in Azure Update Manager would be created. If you supply a new name, a resource group would be created where all the maintenance configurations would be created. However, if you supply a name with which a resource group already exists, all the maintenance configurations would be created in the existing resource group.

1. Check Azure Runbook Logs for the status of execution and migration status of SUCs.

   :::image type="content" source="./media/guidance-migration-automation-update-management-azure-update-manager/log-status.png" alt-text="Screenshot that shows the runbook logs." lightbox="./media/guidance-migration-automation-update-management-azure-update-manager/fetch-client-id.png":::

**Runbook operations in backend** 

The migration of runbook does the following tasks:

- Enables periodic assessment on all machines.
- All schedules in the automation account are migrated to Azure Update Manager and a corresponding maintenance configuration is created for each of them, having the same properties.

**About the script**

The following is the behavior of the migration script:

- Check if a resource group with the name taken as input is already present in the subscription of the automation account or not. If not, then create a resource group with the name specified by the customer. This resource group is used for creating the MRP configs for V2. 
- RebootOnly Setting isn't available in Azure Update Manager. Schedules having RebootOnly Setting aren't migrated.
- Filter out SUCs that are in the errored/expired/provisioningFailed/disabled state and mark them as **Not Migrated**, and print the appropriate logs indicating that such SUCs aren't migrated. 
- The config assignment name is a string that will be in the format **AUMMig_AAName_SUCName** 
- Figure out if this Dynamic Scope is already assigned to the Maintenance config or not by checking against Azure Resource Graph. If not assigned, then only assign with assignment name in the format **AUMMig_ AAName_SUCName_SomeGUID**.
- For schedules having pre/post tasks configured, the script will create an automation webhook for the runbooks in pre/post tasks and event grid subscriptions for pre/post maintenance events. For more information, see [how pre/post works in Azure Update Manager](tutorial-webhooks-using-runbooks.md)
- A summarized set of logs is printed to the Output stream to give an overall status of machines and SUCs. 
- Detailed logs are printed to the Verbose Stream.  
- Post-migration, a Software Update Configuration can have any one of the following four migration statuses:

    - **MigrationFailed**
    - **PartiallyMigrated**
    - **NotMigrated**
    - **Migrated**
 
The below table shows the scenarios associated with each Migration Status. 

| **MigrationFailed** |	**PartiallyMigrated** |	**NotMigrated** | **Migrated** |
|---|---|---|---|
|Failed to create Maintenance Configuration for the Software Update Configuration.| Non-Zero number of Machines where Patch-Settings failed to apply.| Failed to get software update configuration from the API due to some client/server error like maybe **internal Service Error**.|  |
|  | Non-Zero number of Machines with failed Configuration Assignments.| Software Update Configuration is having reboot setting as reboot only. This isn't supported today in Azure Update Manager.|  |
|  | Non-Zero number of Dynamic Queries failed to resolve that is failed to execute the query against Azure Resource Graph.| |  |
|  | Non-Zero number of Dynamic Scope Configuration assignment failures.| Software Update Configuration isn't having succeeded provisioning state in DB.|  |
|  | Software Update Configuration is having Saved Search Queries.| Software Update Configuration is in errored state in DB.|  |
|  | Software Update Configuration is having pre/post tasks which have not been migrated successfully. | Schedule associated with Software Update Configuration is already expired at the time of migration.|  |
|  |  | Schedule associated with Software Update Configuration is disabled.|  |
|  |  | Unhandled exception while migrating software update configuration.| Zero Machines where Patch-Settings failed to apply.<br><br> **And** <br><br> Zero Machines with failed Configuration Assignments. <br><br> **And** <br><br> Zero Dynamic Queries failed to resolve that is failed to execute the query against Azure Resource Graph. <br><br> **And** <br><br> Zero Dynamic Scope Configuration assignment failures. <br><br> **And** <br><br> Software Update Configuration has zero Saved Search Queries.|

To figure out from the table above which scenario/scenarios correspond to why the software update configuration has a specific status, look at the verbose/failed/warning logs to get the error code and error message.

You can also search with the name of the update schedule to get logs specific to it for debugging. 

:::image type="content" source="./media/guidance-migration-automation-update-management-azure-update-manager/debug-logs.png" alt-text="Screenshot that shows how to view logs specific for debugging." lightbox="./media/guidance-migration-automation-update-management-azure-update-manager/debug-logs.png":::

#### Step 2: Deboarding from Automation Update Management solution

**Follow these steps:**

1. Import the migration runbook from runbooks gallery. Search for **azure automation update** from browse gallery, and import the migration runbook named **Deboard from Azure Automation Update Management** and publish the runbook.

   :::image type="content" source="./media/guidance-migration-automation-update-management-azure-update-manager/deboard-from-automation-update-management.png" alt-text="Screenshot that shows how to import the deaboard migration runbook." lightbox="./media/guidance-migration-automation-update-management-azure-update-manager/deboard-from-automation-update-management.png":::

   Runbook supports PowerShell 5.1.

   :::image type="content" source="./media/guidance-migration-automation-update-management-azure-update-manager/deboard-runbook-support.png" alt-text="Screenshot that shows the runbook supports PowerShell 5.1 while deboarding." lightbox="./media/guidance-migration-automation-update-management-azure-update-manager/deboard-runbook-support.png":::

1. Set Verbose Logging to **True** for the Runbook.

   :::image type="content" source="./media/guidance-migration-automation-update-management-azure-update-manager/verbose-log-records-deboard.png" alt-text="Screenshot that shows log verbose records setting while deboarding." lightbox="./media/guidance-migration-automation-update-management-azure-update-manager/verbose-log-records-deboard.png":::

1. Start the runbook and pass parameters such as Automation AccountResourceId, UserManagedServiceIdentityClientId, etc.

   :::image type="content" source="./media/guidance-migration-automation-update-management-azure-update-manager/deboard-runbook-parameters.png" alt-text="Screenshot that shows how to start runbook and pass parameters while deboarding." lightbox="./media/guidance-migration-automation-update-management-azure-update-manager/deboard-runbook-parameters.png":::

   You can fetch AutomationAccountResourceId from **Automation Account** > **Properties**.

   :::image type="content" source="./media/guidance-migration-automation-update-management-azure-update-manager/fetch-resource-id-deboard.png" alt-text="Screenshot that shows how to fetch resource ID while deboarding." lightbox="./media/guidance-migration-automation-update-management-azure-update-manager/deboard-runbook-parameters.png":::

   You can fetch UserManagedServiceIdentityClientId from **Automation Account** > **Identity** > **User Assigned** > **Identity** > **Properties** > **Client ID**.

   :::image type="content" source="./media/guidance-migration-automation-update-management-azure-update-manager/deboard-fetch-client-id.png" alt-text="Screenshot that shows how to fetch client ID while deboarding." lightbox="./media/guidance-migration-automation-update-management-azure-update-manager/deboard-fetch-client-id.png":::

1. Check Azure runbook logs for the status of deboarding of machines and schedules.

   :::image type="content" source="./media/guidance-migration-automation-update-management-azure-update-manager/deboard-debug-logs.png" alt-text="Screenshot that shows how runbook logs while deboarding." lightbox="./media/guidance-migration-automation-update-management-azure-update-manager/deboard-debug-logs.png":::

**Deboarding script operations in the backend**

- Disable all the underlying schedules for all the software update configurations present in this Automation account. This is done to ensure that Patch-MicrosoftOMSComputers Runbook isn't triggered for SUCs that were partially migrated to V2. 
- Delete the Updates Solution from the Linked Log Analytics Workspace for the Automation Account being Deboarded from Automation Update Management in V1. 
- A summarized log of all SUCs disabled and status of removing updates solution from linked log analytics workspace is also printed to the output stream. 
- Detailed logs are printed on the verbose streams. 
 
**Callouts for the migration process:**

- Non-Azure Saved Search Queries won't be migrated. 
- The Migration and Deboarding Runbooks need to have the Az.Modules updated to work. 
- The prerequisite script updates the Az.Modules to the latest version 8.0.0.
- The StartTime of the MRP Schedule will be equal to the nextRunTime of the Software Update Configuration. 
- Data from Log Analytics won't be migrated. 
- User Managed Identities [don't support](/entra/identity/managed-identities-azure-resources/managed-identities-faq#can-i-use-a-managed-identity-to-access-a-resource-in-a-different-directorytenant) cross tenant scenarios.
- RebootOnly Setting isn't available in Azure Update Manager. Schedules having RebootOnly Setting won't be migrated.
- For Recurrence, Automation schedules support values between (1 to 100) for Hourly/Daily/Weekly/Monthly schedules, whereas Azure Update Manager’s maintenance configuration supports between (6 to 35) for Hourly and (1 to 35) for Daily/Weekly/Monthly.
   - For example, if the automation schedule has a recurrence of every 100 Hours, then the equivalent maintenance configuration schedule has it for every 100/24 = 4.16 (Round to Nearest Value) -> Four days will be the recurrence for the maintenance configuration. 
   - For example, if the automation schedule has a recurrence of every 1 hour, then the equivalent maintenance configuration schedule will have it every 6 hours.
   - Apply the same convention for Weekly and Daily. 
     - If the automation schedule has daily recurrence of say 100 days, then 100/7 = 14.28 (Round to Nearest Value) -> 14 weeks will be the recurrence for the maintenance configuration schedule.
     - If the automation schedule has weekly recurrence of say 100 weeks, then 100/4.34 = 23.04 (Round to Nearest Value) -> 23 Months will be the recurrence for the maintenance configuration schedule. 
     - If the automation schedule that should recur Every 100 Weeks and has to be Executed on Fridays. When translated to maintenance configuration, it will be Every 23 Months (100/4.34). But there's no way in Azure Update Manager to say that execute every 23 Months on all Fridays of that Month, so the schedule won't be migrated. 
     - If an automation schedule has a recurrence of more than 35 Months, then in maintenance configuration it will always have 35 Months Recurrence. 
   - SUC supports between 30 Minutes to six Hours for the Maintenance Window. MRP supports between 1 hour 30 minutes to 4 hours.
     - For example, if SUC has a Maintenance Window of 30 Minutes, then the equivalent MRP schedule will have it for 1 hour 30 minutes.
     - For example, if SUC has a Maintenance Window of 6 hours, then the equivalent MRP schedule will have it for 4 hours. 
- When the migration runbook is executed multiple times, say you did Migrate All automation schedules and then again tried to migrate all the schedules, then migration runbook will run the same logic. Doing it again will update the MRP schedule if any new change is present in SUC. It won't make duplicate config assignments. Also, operations are carried only for automation schedules having enabled schedules. If an SUC was **Migrated** earlier, it will be skipped in the next turn as its underlying schedule will be **Disabled**. 
- In the end, you can resolve more machines from Azure Resource Graph as in Azure Update Manager; You can't check if Hybrid Runbook Worker is reporting or not, unlike in Automation Update Management where it was an intersection of Dynamic Queries and Hybrid Runbook Worker.


## Manual migration guidance

Guidance to move various capabilities is provided in table below:

**S.No** | **Capability** | **Automation Update Management** | **Azure Update Manager** | **Steps using Azure portal** | **Steps using API/script** | 
--- | --- | --- | ---| ---| ---| 
1 | Patch management for Off-Azure machines. | Could run with or without Arc connectivity. | Azure Arc is a prerequisite for non-Azure machines. | 1. [Create service principal](../app-service/quickstart-php.md#1---get-the-sample-repository) </br> 2. [Generate installation script](../azure-arc/servers/onboard-service-principal.md#generate-the-installation-script-from-the-azure-portal) </br> 3. [Install agent and connect to Azure](../azure-arc/servers/onboard-service-principal.md#install-the-agent-and-connect-to-azure) | 1. [Create service principal](../azure-arc/servers/onboard-service-principal.md#azure-powershell) <br> 2. [Generate installation script](../azure-arc/servers/onboard-service-principal.md#generate-the-installation-script-from-the-azure-portal) </br> 3. [Install agent and connect to Azure](../azure-arc/servers/onboard-service-principal.md#install-the-agent-and-connect-to-azure) |
2 | Enable periodic assessment to check for latest updates automatically every few hours. | Machines automatically receive the latest updates every 12 hours for Windows and every 3 hours for Linux. | Periodic assessment is an update setting on your machine. If it's turned on, the Update Manager fetches updates every 24 hours for the machine and shows the latest update status. | 1. [Single machine](manage-update-settings.md#configure-settings-on-a-single-vm) </br> 2. [At scale](manage-update-settings.md#configure-settings-at-scale) </br> 3. [At scale using policy](periodic-assessment-at-scale.md) | 1. [For Azure VM](../virtual-machines/automatic-vm-guest-patching.md#azure-powershell-when-updating-a-windows-vm) </br> 2.[For Arc-enabled VM](/powershell/module/az.connectedmachine/update-azconnectedmachine) |
3 | Static Update deployment schedules (Static list of machines for update deployment). | Automation Update management had its own schedules. | Azure Update Manager creates a [maintenance configuration](../virtual-machines/maintenance-configurations.md) object for a schedule. So, you need to create this object, copying all schedule settings from Automation Update Management to Azure Update Manager schedule. | 1. [Single VM](scheduled-patching.md#schedule-recurring-updates-on-a-single-vm) </br> 2. [At scale](scheduled-patching.md#schedule-recurring-updates-at-scale) </br> 3. [At scale using policy](scheduled-patching.md#onboard-to-schedule-by-using-azure-policy) | [Create a static scope](manage-vms-programmatically.md) |
4 | Dynamic Update deployment schedules (Defining scope of machines using resource group, tags, etc. that is evaluated dynamically at runtime).| Same as static update schedules. | Same as static update schedules. | [Add a dynamic scope](manage-dynamic-scoping.md#add-a-dynamic-scope) | [Create a dynamic scope]( tutorial-dynamic-grouping-for-scheduled-patching.md#create-a-dynamic-scope) |
5 | Deboard from Azure Automation Update management. | After you complete the steps 1, 2, and 3, you need to clean up Azure Update management objects. | |  [Remove Update Management solution](../automation/update-management/remove-feature.md#remove-updatemanagement-solution) </br> | NA |
6 | Reporting | Custom update reports using Log Analytics queries. | Update data is stored in Azure Resource Graph (ARG). Customers can query ARG data to build custom dashboards, workbooks etc. | The old Automation Update Management data stored in Log analytics can be accessed, but there's no provision to move data to ARG. You can write ARG queries to access data that will be stored to ARG after virtual machines are patched via Azure Update Manager. With ARG queries you can, build dashboards and workbooks using following instructions: </br> 1. [Log structure of Azure Resource graph updates data](query-logs.md) </br> 2. [Sample ARG queries](sample-query-logs.md) </br> 3. [Create workbooks](manage-workbooks.md) | NA |
7 | Customize workflows using pre and post scripts. | Available as Automation runbooks. | We recommend that you try out the Public Preview for pre and post scripts on your non-production machines and use the feature on production workloads once the feature enters General Availability. |[Manage pre and post events (preview)](manage-pre-post-events.md) and [Tutorial: Create pre and post events using a webhook with Automation](tutorial-webhooks-using-runbooks.md) | |
8 | Create alerts based on updates data for your environment | Alerts can be set up on updates data stored in Log Analytics. | We recommend that you try out the Public Preview for alerts on your non-production machines and use the feature on production workloads once the feature enters General Availability. |[Create alerts (preview)](manage-alerts.md) | |


## Next steps

- [Guidance on migrating Azure VMs from Microsoft Configuration Manager to Azure Update Manager](./guidance-migration-azure.md)