---
title: Disaster recovery for Azure Automation
description: This article details on disaster recovery strategy to handle service outage or zone failure for Azure Automation
keywords: automation disaster recovery
services: automation
ms.subservice: process-automation
author: SnehaSudhirG
ms.author: sudhirsneha
ms.date: 10/17/2022
ms.topic: conceptual 
---

# Disaster recovery for Azure Automation

**Applies to:** :heavy_check_mark: Linux VMs :heavy_check_mark: Windows VMs

This article explains the disaster recovery strategy to handle a region-wide or zone-wide failure.

You must have a disaster recovery strategy to handle a region-wide service outage or zone-wide failure to help reduce the impact and effects arising from unpredictable events on your business and customers. You are responsible to set up disaster recovery of Automation accounts, and its dependent resources such as Modules, Connections, Credentials, Certificates, Variables and Schedules. An important aspect of a disaster recovery plan is preparing to failover to the replica of the Automation account created in advance in the secondary region, if the Automation account in the primary region becomes unavailable. Ensure that your disaster recovery strategy considers your Automation account and the dependent resources.

In addition to high availability offered by Availability zones, some regions are paired with another region to provide protection from regional or large geographical disasters. Irrespective of whether the primary region has a regional pair or not, the disaster recovery strategy for the Automation account remains the same. For more information about regional pairs, [learn more](../availability-zones/cross-region-replication-azure.md).


## Enable disaster recovery

Every Automation account that you [create](/azure/automation/quickstarts/create-azure-automation-account-portal)
requires a location that you must use for deployment. This would be the primary region for your Automation account and it includes Assets, runbooks created for the Automation account, job execution data, and logs. For disaster recovery, the replica  Automation account must be already deployed and ready in the secondary region. 

- Begin by [creating a replica Automation account](/azure/automation/quickstarts/create-azure-automation-account-portal#create-automation-account) in any alternate [region](https://azure.microsoft.com/global-infrastructure/services/?products=automation&regions=all).
- Select the secondary region of your choice - paired region or any other region where Azure Automation is available.
- Apart from creating a replica of the Automation account, replicate the dependent resources such as Runbooks, Modules, Connections, Credentials, Certificates, Variables, Schedules and permissions assigned for the Run As account and Managed Identities in the Automation account in primary region to the Automation account in secondary region. You can use the [PowerShell script](#script-to-migrate-automation-account-assets-from-one-region-to-another) to migrate assets of the Automation account from one region to another.
- If you are using [ARM templates](../azure-resource-manager/management/overview.md) to define and deploy Automation runbooks, you can use these templates to deploy the same runbooks in any other Azure region where you create the replica Automation account. In case of a region-wide outage or zone-wide failure in the primary region, you can execute the runbooks replicated in the secondary region to continue business as usual. This ensures that the secondary region steps up to continue the work if the primary region has a disruption or failure. 

>[!NOTE]
> Due to data residency requirements, jobs data and logs present in the primary region are not available in the secondary region.

## Scenarios for cloud and hybrid jobs

### Scenario: Execute Cloud jobs in secondary region
For Cloud jobs, there would be a negligible downtime, provided a replica Automation account and all dependent resources and runbooks are already deployed and available in the secondary region. You can use the replica account for executing jobs as usual.

### Scenario: Execute jobs on Hybrid Runbook Worker deployed in a region different from primary region of failure
If the Windows or Linux Hybrid Runbook worker is deployed using the extension-based approach in a region *different* from the primary region of failure, follow these steps to continue executing the Hybrid jobs:

1. [Delete](extension-based-hybrid-runbook-worker-install.md?tabs=windows#delete-a-hybrid-runbook-worker) the extension installed on Hybrid Runbook worker in the Automation account in the primary region. 
1. [Add](extension-based-hybrid-runbook-worker-install.md?tabs=windows#create-hybrid-worker-group) the same Hybrid Runbook worker to a Hybrid Worker group in the Automation account in the secondary region. The Hybrid worker extension is installed on the machine in the replica of the Automation account.
1. Execute the jobs on the Hybrid Runbook worker created in Step 2.

For Hybrid Runbook worker deployed using the agent-based approach, choose from below:

#### [Windows Hybrid Runbook worker](#tab/win-hrw)

If the Windows Hybrid Runbook worker is deployed using an agent-based approach in a region different from the primary region of failure, follow the steps to continue executing Hybrid jobs: 
1. [Uninstall](automation-windows-hrw-install.md#remove-windows-hybrid-runbook-worker) the agent from the Hybrid Runbook worker present in the Automation account in the primary region. 
1. [Re-install](automation-windows-hrw-install.md#installation-options) the agent on the same machine in the replica Automation account in the secondary region. 
1. You can now execute jobs on the Hybrid Runbook worker created in Step 2. 

#### [Linux Hybrid Runbook worker](#tab/linux-hrw)

If the Linux Hybrid Runbook worker is deployed using agent-based approach in a region different from the primary region of failure, follow the below steps to continue executing Hybrid jobs: 
1. [Uninstall](automation-linux-hrw-install.md#remove-linux-hybrid-runbook-worker) the agent from the Hybrid Runbook worker present in Automation account in the primary region. 
1. [Re-install](automation-linux-hrw-install.md#install-a-linux-hybrid-runbook-worker) the agent on the same machine in the replica Automation account in the secondary region. 
1. You can now execute jobs on the Hybrid Runbook worker created in Step 2. 

---

### Scenario: Execute jobs on Hybrid Runbook Worker deployed in the primary region of failure
If the Hybrid Runbook worker is deployed in the primary region, and there is a compute failure in that region, the machine will not be available for executing Automation jobs. You must provision a new virtual machine in an alternate region and register it as Hybrid Runbook Worker in Automation account in the secondary region.
 
- See the installation steps in [how to deploy an extension-based Windows or Linux User Hybrid Runbook Worker](extension-based-hybrid-runbook-worker-install.md?tabs=windows#create-hybrid-worker-group).
- See the installation steps in [how to deploy an agent-based Windows Hybrid Worker](automation-windows-hrw-install.md#installation-options).
- See the installation steps in [how to deploy an agent-based Linux Hybrid Worker](automation-linux-hrw-install.md#install-a-linux-hybrid-runbook-worker).

## Script to migrate Automation account assets from one region to another

You can use these scripts for migration of Automation account assets from the account in primary region to the account in the secondary region. These scripts are used to migrate only Runbooks, Modules, Connections, Credentials, Certificates and Variables. The execution of these scripts does not affect the Automation account and its assets present in the primary region.

### Prerequisites

 1. Ensure that the Automation account in the secondary region is created and available so that assets from primary region can be migrated to it. It is preferred if the destination automation account is one without any custom resources as it prevents potential resource clash due to same name and loss of data.
 1. Ensure that the system assigned managed identities are enabled in the Automation account in the primary region.
 1. Ensure that the system assigned managed identities of the primary Automation account has contributor access to the subscription it belongs to.
 1. Ensure that the primary Automation account's managed identity has Contributor access with read and write permissions to the Automation account in secondary region. To enable, provide the necessary permissions in secondary Automation account's managed identities. [Learn more](../role-based-access-control/quickstart-assign-role-user-portal.md).
 1. Ensure that the script has access to the Automation account assets in primary region. Hence, it should be executed as a runbook in that Automation account for successful migration.
 1. If the primary Automation account is deployed using a Run as account, then it must be switched to Managed Identity before migration. [Learn more](migrate-run-as-accounts-managed-identity.md).
 1. Modules required are:
 
      - Az.Accounts version 2.8.0 
      - Az.Resources version 6.0.0 
      - Az.Automation version 1.7.3 
      - Az.Storage version 4.6.0 
1. Ensure that both the source and destination Automation accounts should belong to the same Microsoft Entra tenant.

### Create and execute the runbook
You can use the[PowerShell script](https://github.com/azureautomation/Migrate-automation-account-assets-from-one-region-to-another) or [PowerShell workflow](https://github.com/azureautomation/Migrate-automation-account-assets-from-one-region-to-another-PwshWorkflow/tree/main) runbook or import from the Runbook gallery and execute it to enable migration of assets from one Automation account to another. 

Follow the steps to import and execute the runbook:

#### [PowerShell script](#tab/ps-script)

1. Sign in to the [Azure portal](https://portal.azure.com).
1. Go to Automation account that you want to migrate to another region.
1. Under **Process Automation**, select **Runbooks**.
1. Select **Browse gallery** and in the search, enter *Migrate Automation account assets from one region to another* and select **PowerShell script**.
1. In the **Import a runbook** page, enter a name for the runbook.
1. Select **Runtime version** as either 5.1 or 7.1 (preview)
1. Enter the description and select **Import**.
1. In the **Edit PowerShell Runbook** page, edit the required parameters and execute it.

You can choose either of the options to edit and execute the script. You can provide the seven mandatory parameters as given in Option 1 **or** three mandatory parameters given in Option 2 to edit and execute the script.

#### [PowerShell Workflow](#tab/ps-workflow)
1. Sign in to the [Azure portal](https://portal.azure.com).
1. Go to Automation account that you want to migrate to another region.
1. Under **Process Automation**, select **Runbooks**.
1. Select **Browse gallery** and in the search, enter *Migrate Automation account assets from one region to another* and Select **PowerShell workflow**.
1. In the **Import a runbook** page, enter a name for the runbook.
1. Select **Runtime version** as 5.1
1. Enter the description and select **Import**.

You can input the parameters during execution of PowerShell Workflow runbook. You can provide the seven mandatory parameters as given in Option 1 **or** three mandatory parameters given in Option 2 to execute the script.

---

The options are:

#### [Option 1](#tab/option-one)

**Name** | **Required** | **Description**
----------- | ------------- | -----------
SourceAutomationAccountName | True | Name of automation account in primary region from where assets need to be migrated. |
DestinationAutomationAccountName | True | Name of automation account in secondary region to which assets need to be migrated. |
SourceResourceGroup | True | Resource group name of the Automation account in the primary region. |
DestinationResourceGroup | True | Resource group name of the Automation account in the secondary region. |
SourceSubscriptionId | True | Subscription ID of the Automation account in primary region |
DestinationSubscriptionId | True | Subscription ID of the Automation account in secondary region. |
Type[] | True | Array consisting of all the types of assets that need to be migrated, possible values are Certificates, Connections, Credentials, Modules, Runbooks, and Variables. |

#### [Option 2](#tab/option-two)

**Name** | **Required** | **Description**
----------- | ------------- | -----------
SourceAutomationAccountResourceId | True | Resource ID of the Automation account in primary region from where assets need to be migrated. |
DestinationAutomationAccountResourceId | True | Resource ID of the Automation account in secondary region to which assets need to be migrated. |
Type[] | True | Array consisting of all the types of assets that need to be migrated, possible values are Certificates, Connections, Credentials, Modules, Runbooks, and Variables. |

---

### Limitations
- The script migrates only Custom PowerShell modules. Default modules and Python packages would not be migrated to replica Automation account.
- The script does not migrate **Schedules** and **Managed identities** present in Automation account in primary region. These would have to be created manually in replica Automation account.
- Jobs data and activity logs would not be migrated to the replica account.

## Next steps

- Learn more about [regions that support availability zones](../availability-zones/az-region.md).
