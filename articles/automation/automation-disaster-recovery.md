---
title: Disaster recovery for Azure Automation
description: This article details on disaster recovery strategy to handle service outage or zone failure for Azure Automation
keywords: automation disaster recovery
services: automation
ms.subservice: process-automation
ms.date: 08/01/2022
ms.topic: conceptual 
---

# Disaster recovery for Azure Automation

**Applies to:** :heavy_check_mark: Linux VMs :heavy_check_mark: Windows VMs

This article explains the disaster recovery strategy to handle a region-wide or zone-wide failure.

You need to have a strategy to reduce the impact and effects arising from unpredictable events to be effective in disaster recovery of Automation accounts and their dependent resources such as Modules, Connections, Credentials, Certificates, Variables and Schedules. An essential part of a disaster recovery plan is preparing to failover to the replica of the Automation account created in advance in the secondary region if the Automation account in the primary region becomes unavailable. Ensure that your disaster recovery strategy considers your Automation account and the dependent resources listed above.


## Enable disaster recovery

When you [create](./quickstarts/create-account-portal.md#create-automation-account) an Automation account, it requires a location that you must use for deployment. Primary region included Assets and runbooks created for the Automation account, also includes the job execution data and logs. For disaster recovery, the replica of your Automation account must be already deployed and ready in the secondary region. 

- Begin by [creating a replica of the Automation account](./quickstarts/create-account-portal.md#create-automation-account) in any alternate [region](https://azure.microsoft.com/global-infrastructure/services/?products=automation&regions=all).
- Select the secondary region of your choice - paired region or any other region where Azure Automation is available.
- Apart from creating a replica of the Automation account, replicate the dependent resources such as Runbooks, Modules, Connections, Credentials, Certificates, Variables, Schedules and permissions assigned for the Run As account and Managed Identities in the Automation account.
- If you are using [ARM templates](https://azure.microsoft.com/global-infrastructure/services/?products=automation&regions=all) to define and deploy Automation runbooks, you can use the same templates to deploy the same runbooks in any other Azure region where the replica of the Automation account exists. In case of a region-wide service outage or zone-wide failure in the primary region, you can execute the runbooks replicated in the secondary region to continue business as usual. This ensures that the secondary region steps up to continue the work if the primary regions have a disruption or failure. 

>[!NOTE]
> Due to data residency requirements, jobs data and logs present in the primary region are not be available in the secondary region.

## Scenario: Execute Cloud jobs
For Cloud jobs, ensure that the replica of the Automation account and all the dependent resources and runbooks are deployed and available in the secondary region to result in a negligible downtime. You can then use the replica account to execute jobs and business continuity.

## Scenario: Execute jobs on Hybrid Runbook Worker deployed in a region different from primary region of failure
If the Windows or Linux Hybrid Runbook worker is deployed using the extension-based approach in a region *different* from the primary region of failure, follow these steps to continue executing the Hybrid jobs:

1. [Delete](extension-based-hybrid-runbook-worker-install.md?tabs=windows#delete-a-hybrid-runbook-worker) the extension installed on Hybrid Runbook worker in the Automation account in the primary region. 
1. [Add](extension-based-hybrid-runbook-worker-install.md?tabs=windows#create-hybrid-worker-group) the same Hybrid Runbook worker to a Hybrid Worker group in the Automation account in the secondary region. The Hybrid worker extension is installed on the machine in the replica of the Automation account.
1. Execute the jobs on the Hybrid Runbook worker created in Step 2.

### Deploy the Windows/Linux Hybrid Runbook worked using the agent-based approach

Choose the Hybrid Runbook worker

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

## Scenario: Execute jobs on Hybrid Runbook Worker deployed in the primary region of failure
If the Hybrid Runbook worker is deployed in the primary region, and there is a computing failure in that region, the machine will not be available for executing Automation jobs. You must provision a new virtual machine in an alternate region and deploy it as Hybrid Runbook Worker in Automation account in the secondary region.
 
- See the installation steps in [how to deploy an extension-based Windows or Linux User Hybrid Runbook Worker](extension-based-hybrid-runbook-worker-install.md?tabs=windows#create-hybrid-worker-group).
- See the installation steps in [how to deploy an agent-based Windows Hybrid Worker](automation-windows-hrw-install.md#installation-options).
- See the installation steps in [how to deploy an agent-based Linux Hybrid Worker](automation-linux-hrw-install.md#install-a-linux-hybrid-runbook-worker).


## Next steps

- Learn more about [regions that support availability zones](/azure/availability-zones/az-region.md).