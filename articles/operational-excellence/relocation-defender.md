---
title: Relocation guidance for Microsoft Defender for Cloud
description: Learn how to relocate Microsoft Defender for Cloud to a new region
author: anaharris-ms
ms.author: anaharris
ms.date: 01/18/2024
ms.service: defender-for-cloud
ms.topic: how-to
ms.custom:
  - subject-relocation
---

# Relocate Microsoft Defender for Cloud to another region

Microsoft Defender for Cloud is an environment-based management feature of Azure. As such, Defender is not region specific. However, moving region-specific services to another region may or may not have implications on their connectivity or functionality with Microsoft Defender for Cloud. This article covers all the aspects of this scenario to help make sure that your region relocation plan includes making sure Microsoft Defender for Cloud continues to work for your workloads afte region move.

To relocate Microsoft Defender for Cloud to a new region, you must select the appropriate [relocation strategy for each Azure service](overview-relocation.md) that uses Defender for Cloud. This section contains general guidance and recommendations to help you prepare for a relocation of services that use Microsoft Defender.

**Azure Resource Mover** doesn't support moving services used by the Microsoft Defender for Cloud. To see which resources Resource Mover supports, see [What resources can I move across regions?](/azure/resource-mover/overview#what-resources-can-i-move-across-regions).

## Prerequisites

If there's a subscription change in the new region, [you must enable Defender for Cloud on the new subscription](/azure/defender-for-cloud/connect-azure-subscription). 


## General recommendations

- After relocation, you'll need to update the CI/CD integration in Defender for Cloud. You'll need to update to a new default workspace region, a new authentication token, and connection strings to the pipelines.

- If alerts and recommendations from Defender are being exported to an Azure Event Hub, SQL servers, or Log Analytics Workspace, you'll need to modify settings to point to the new target instances, to avoid breaking data flow from regional services. For more information, see [Continuously export Microsoft Defender for Cloud data](/azure/defender-for-cloud/continuous-export?tabs=azure-portal). 

- Ensure that the resources and services that are exempted from secure score in the source location are also exempted in the target location. 

- Ensure that all servers in the source location are deleted or de-allocated to avoid extra cost bearing.

### Microsoft Defender for servers

- If Microsoft Defender for servers is enabled for the subscription and auto-provisioning of the Log Analytics agent is enabled under Environment settings, all the machines in the subscription are automatically protected after relocation. Otherwise, you must manually provision the agents after relocation. 

- If the servers are using a custom workspace in the source location of the workload, make sure that they use a custom workspace in the target location as well. There are two possible scenarios for relocating with a custom workspace:

    - If the custom workspace is relocated along with the servers, you must reconfigure the servers to connect to a new custom workspace that's created at the target location. For more information, see [How can I use my existing Log Analytics Workspace](/azure/defender-for-cloud/faq-data-collection-agents#how-can-i-use-my-existing-log-analytics-workspace-).

    - If you are relocating the servers without the custom workspace by using ARM, the monitoring agent is installed as an extension in the servers. The extension configuration allows reporting to only a single workspace. Defender for Cloud doesn't override existing connections to user workspaces. To ensure that Defender for Cloud is able to store security data from the VM in the connected Log analytics workspace, install “Security” or “SecurityCenterFree” solution on the VM.

    >[!NOTE]
    >It's recommended that you don't delete the default workspace for Defender. Defender for Cloud uses the default workspaces to store security data from your VMs. If you delete a workspace, Defender for Cloud is unable to collect this data and some security recommendations and alerts are unavailable. If you have already delete the default workspace, you can recover by removing the Log Analytics agent on the VMs connected to the deleted workspace. Defender for Cloud reinstalls the agent and creates a new default workspaces.

### Microsoft Defender for SQL

If a custom Log analytics workspace is being used in the source location to defend a SQL server deployment and is also required in the target location, ensure that the target Log analytics workspace has Microsoft Defender for SQL solution enabled.

### Microsoft Defender for Container components

If auto-provisioning is turned off, Defender profiles must be deployed manually for the new container instances at target. To learn how to manually deploy containers, see [Enable and deploy Defender for Containers plan for each relevant component](/azure/defender-for-cloud/defender-for-containers-enable#deploying-defender-agent---all-options). 

### Microsoft Defender for Storage

If Defender for Storage plan is enabled for the subscription and if the Storage Account in the source location is excluded from that plan, [ensure the same configuration for the storage account in the target location](/azure/defender-for-cloud/defender-for-storage-classic-enable?tabs=enable-storage-protection-ps#exclude-a-storage-account-from-a-protected-subscription-in-the-per-transaction-plan).

### Logic Apps

- If the response to alerts in the source location are automated through Logic Apps, the same must be done in the target location. The logic app in the target location  must have the following roles/permissions:
    - Logic App Operator permissions or Logic App read/trigger access for running Logic Apps.
    - Logic App Contributor permissions for Logic App creation and modification.

- If you want to use Logic App connectors, you may need additional credentials to sign in to their respective services such as your Outlook/Teams/Slack instances.
    

## Next steps

To learn more about moving resources between regions and disaster recovery in Azure, refer to:

- [Move resources to a new resource group or subscription](../azure-resource-manager/management/move-resource-group-and-subscription.md)
- [Move Azure VMs to another region](../site-recovery/azure-to-azure-tutorial-migrate.md)


