---
title: Use migration runbooks to migrate workloads from Automation Update Management to Azure Update Manager
description: Guidance on how to use migration runbooks to move schedules and machines from Automation Update Management to Azure Update Manager
author: snehasudhirG
ms.service: azure-update-manager
ms.topic: how-to
ms.date: 08/01/2024
ms.author: sudhirsneha
---

# Migration using automated runbook scripts

**Applies to:** :heavy_check_mark: Windows VMs :heavy_check_mark: Linux VMs :heavy_check_mark: On-premises environment :heavy_check_mark: Azure Arc-enabled servers

This article details on how by using migration runbooks, you can automatically migrate all workloads (machines and schedules) from Automation Update Management to Azure Update Manager.

The following sections details on how to run the script, what the script does at the backend, expected behavior, and any limitations, if applicable. The script can migrate all the machines and schedules in one automation account at one go. If you have multiple automation accounts, you have to run the runbook for all the automation accounts.

At a high level, you need to follow the below steps to migrate your machines and schedules from Automation Update Management to Azure Update Manager. 


### Unsupported scenarios

- Non-Azure Saved Search Queries won't be migrated; these have to be migrated manually.

For the complete list of limitations and things to note, see the [key points in migration](migration-key-points.md)

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
 
   :::image type="content" source="./media/migration-using-runbook-scripts/prerequisite-install-module.png" alt-text="Screenshot that shows how the command to install module." lightbox="./media/migration-using-runbook-scripts/prerequisite-install-module.png":::


**B. Run the script** 

   Download and run the PowerShell script [`MigrationPrerequisiteScript`](https://github.com/azureautomation/Preqrequisite-for-Migration-from-Azure-Automation-Update-Management-to-Azure-Update-Manager/blob/main/MigrationPrerequisites.ps1) locally. This script takes AutomationAccountResourceId of the Automation account to be migrated and AutomationAccountAzureEnvironment as the inputs. The accepted values for AutomationAccountAzureEnvironment are AzureCloud, AzureUSGovernment and AzureChina signifying the cloud to which the automation account belongs.
    
   :::image type="content" source="./media/migration-using-runbook-scripts/run-script.png" alt-text="Screenshot that shows how to download and run the script." lightbox="./media/migration-using-runbook-scripts/run-script.png":::

   You can fetch AutomationAccountResourceId by going to **Automation Account** > **Properties**.

   :::image type="content" source="./media/migration-using-runbook-scripts/fetch-resource-id.png" alt-text="Screenshot that shows how to fetch the resource ID." lightbox="./media/migration-using-runbook-scripts/fetch-resource-id.png":::

**C. Verify** 

   After you run the script, verify that a user managed identity is created in the automation account. **Automation account** > **Identity** > **User Assigned**.

   :::image type="content" source="./media/migration-using-runbook-scripts/script-verification.png" alt-text="Screenshot that shows how to verify that a user managed identity is created." lightbox="./media/migration-using-runbook-scripts/script-verification.png":::

**D. Backend operations by the script**

 - Updating the Az.Modules for the Automation account, which will be required for running migration and deboarding scripts.
 - Creates an automation variable with name AutomationAccountAzureEnvironment which will store the Azure Cloud Environment to which Automation Account belongs.
 - Creation of User Identity in the same Subscription and resource group as the Automation Account. The name of User Identity will be like *AutomationAccount_aummig_umsi*. 
 - Attaching the User Identity to the Automation Account.
 - The script assigns the following permissions to the user managed identity: [Update Management Permissions Required](../automation/automation-role-based-access-control.md#update-management-permissions).


     1. For this, the script fetches all the machines onboarded to Automation Update Management under this automation account and parse their subscription IDs to be given the required RBAC to the User Identity. 
     1. The script gives a proper RBAC to the User Identity on the subscription to which the automation account belongs so that the MRP configs can be created here.
     1. The script assigns the required roles for the Log Analytics workspace and solution. 
-  Registration of required subscriptions to Microsoft.Maintenance and Microsoft.EventGrid Resource Providers.
 
#### Step 1: Migration of machines and schedules

This step involves using an automation runbook to migrate all the machines and schedules from an automation account to Azure Update Manager.

**Follow these steps:**

1. Import [migration runbook](https://github.com/azureautomation/Migrate-from-Azure-Automation-Update-Management-to-Azure-Update-Manager/blob/main/Migration.ps1) from the runbooks gallery and publish. Search for **azure automation update** from browse gallery, and import the migration runbook named **Migrate from Azure Automation Update Management to Azure Update Manager** and publish the runbook.

   :::image type="content" source="./media/migration-using-runbook-scripts/migrate-from-automation-update-management.png" alt-text="Screenshot that shows how to migrate from Automation Update Management." lightbox="./media/migration-using-runbook-scripts/migrate-from-automation-update-management.png":::

   Runbook supports PowerShell 5.1.

   :::image type="content" source="./media/migration-using-runbook-scripts/runbook-support.png" alt-text="Screenshot that shows runbook supports PowerShell 5.1 while importing." lightbox="./media/migration-using-runbook-scripts/runbook-support.png":::

1. Set Verbose Logging to True for the runbook. 

   :::image type="content" source="./media/migration-using-runbook-scripts/verbose-log-records.png" alt-text="Screenshot that shows how to set verbose log records." lightbox="./media/migration-using-runbook-scripts/verbose-log-records.png":::

1. Run the runbook and pass the required parameters like AutomationAccountResourceId, UserManagedServiceIdentityClientId, etc. 

   :::image type="content" source="./media/migration-using-runbook-scripts/run-runbook-parameters.png" alt-text="Screenshot that shows how to run the runbook and pass the required parameters." lightbox="./media/migration-using-runbook-scripts/run-runbook-parameters.png":::

   1. You can fetch AutomationAccountResourceId from **Automation Account** > **Properties**.

      :::image type="content" source="./media/migration-using-runbook-scripts/fetch-resource-id-portal.png" alt-text="Screenshot that shows how to fetch Automation account resource ID." lightbox="./media/migration-using-runbook-scripts/fetch-resource-id-portal.png":::

   1. You can fetch UserManagedServiceIdentityClientId from **Automation Account** > **Identity** > **User Assigned** > **Identity** > **Properties** > **Client ID**.

      :::image type="content" source="./media/migration-using-runbook-scripts/fetch-client-id.png" alt-text="Screenshot that shows how to fetch client ID." lightbox="./media/migration-using-runbook-scripts/fetch-client-id.png":::

   1. Setting **EnablePeriodicAssessmentForMachinesOnboardedToUpdateManagement** to **TRUE** would enable periodic assessment property on all the machines onboarded to Automation Update Management. 

   1. Setting **MigrateUpdateSchedulesAndEnablePeriodicAssessmentonLinkedMachines** to **TRUE** would migrate all the update schedules in Automation Update Management to Azure Update Manager and would also turn on periodic assessment property to **True** on all the machines linked to these schedules. 

   1. You need to specify **ResourceGroupForMaintenanceConfigurations** where all the maintenance configurations in Azure Update Manager would be created. If you supply a new name, a resource group would be created where all the maintenance configurations would be created. However, if you supply a name with which a resource group already exists, all the maintenance configurations would be created in the existing resource group.

1. Check Azure Runbook Logs for the status of execution and migration status of SUCs.

   :::image type="content" source="./media/migration-using-runbook-scripts/log-status.png" alt-text="Screenshot that shows the runbook logs." lightbox="./media/migration-using-runbook-scripts/fetch-client-id.png":::

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
- For schedules having pre/post tasks configured, the script will create an automation webhook for the runbooks in pre/post tasks and Event Grid subscriptions for pre/post maintenance events. For more information, see [how pre/post works in Azure Update Manager](tutorial-webhooks-using-runbooks.md)
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

:::image type="content" source="./media/migration-using-runbook-scripts/debug-logs.png" alt-text="Screenshot that shows how to view logs specific for debugging." lightbox="./media/migration-using-runbook-scripts/debug-logs.png":::

#### Step 2: Deboarding from Automation Update Management solution

**Follow these steps:**

1. Import the migration runbook from runbooks gallery. Search for **azure automation update** from browse gallery, and import the migration runbook named **Deboard from Azure Automation Update Management** and publish the runbook.

   :::image type="content" source="./media/migration-using-runbook-scripts/deboard-from-automation-update-management.png" alt-text="Screenshot that shows how to import the deaboard migration runbook." lightbox="./media/migration-using-runbook-scripts/deboard-from-automation-update-management.png":::

   Runbook supports PowerShell 5.1.

   :::image type="content" source="./media/migration-using-runbook-scripts/deboard-runbook-support.png" alt-text="Screenshot that shows the runbook supports PowerShell 5.1 while deboarding." lightbox="./media/migration-using-runbook-scripts/deboard-runbook-support.png":::

1. Set Verbose Logging to **True** for the Runbook.

   :::image type="content" source="./media/migration-using-runbook-scripts/verbose-log-records-deboard.png" alt-text="Screenshot that shows log verbose records setting while deboarding." lightbox="./media/migration-using-runbook-scripts/verbose-log-records-deboard.png":::

1. Start the runbook and pass parameters such as Automation AccountResourceId, UserManagedServiceIdentityClientId, etc.

   :::image type="content" source="./media/migration-using-runbook-scripts/deboard-runbook-parameters.png" alt-text="Screenshot that shows how to start runbook and pass parameters while deboarding." lightbox="./media/migration-using-runbook-scripts/deboard-runbook-parameters.png":::

   You can fetch AutomationAccountResourceId from **Automation Account** > **Properties**.

   :::image type="content" source="./media/migration-using-runbook-scripts/fetch-resource-id-deboard.png" alt-text="Screenshot that shows how to fetch resource ID while deboarding." lightbox="./media/migration-using-runbook-scripts/deboard-runbook-parameters.png":::

   You can fetch UserManagedServiceIdentityClientId from **Automation Account** > **Identity** > **User Assigned** > **Identity** > **Properties** > **Client ID**.

   :::image type="content" source="./media/migration-using-runbook-scripts/deboard-fetch-client-id.png" alt-text="Screenshot that shows how to fetch client ID while deboarding." lightbox="./media/migration-using-runbook-scripts/deboard-fetch-client-id.png":::

1. Check Azure runbook logs for the status of deboarding of machines and schedules.

   :::image type="content" source="./media/migration-using-runbook-scripts/deboard-debug-logs.png" alt-text="Screenshot that shows how runbook logs while deboarding." lightbox="./media/migration-using-runbook-scripts/deboard-debug-logs.png":::

**Deboarding script operations in the backend**

- Disable all the underlying schedules for all the software update configurations present in this Automation account. This is done to ensure that Patch-MicrosoftOMSComputers Runbook isn't triggered for SUCs that were partially migrated to V2. 
- Delete the Updates Solution from the Linked Log Analytics Workspace for the Automation Account being Deboarded from Automation Update Management in V1. 
- A summarized log of all SUCs disabled and status of removing updates solution from linked log analytics workspace is also printed to the output stream. 
- Detailed logs are printed on the verbose streams. 


## Next steps

- [An overview of migration](migration-overview.md)
- [Migration using Azure portal](migration-using-portal.md)
- [Manual migration guidance](migration-manual.md)
- [Key points during migration](migration-key-points.md)



 
