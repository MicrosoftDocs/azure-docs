---
title: Enable VM insights by using Azure Policy
description: Describes how you enable VM insights for multiple Azure virtual machines or virtual machine scale sets using Azure Policy.
ms.topic: conceptual
author: guywi-ms
ms.author: guywild
ms.reviewer: xpathak
ms.date: 12/13/2022

---

# Enable VM insights by using Azure Policy

With [Azure Policy](/azure/governance/policy/overview) you can install the agents required for VM insights and enable monitoring on all new virtual machines in your Azure environment. VM insights provides a set policy initiatives, which are predefined sets of policies, that discover and remediate noncompliant new VMs in your environment. This article explains how to enable VM insights for Azure virtual machines, virtual machine scale sets, and hybrid virtual machines connected with Azure Arc using the predefined VM insights policy initiates. 

> [!NOTE]
> To use Azure Policy with Azure virtual machine scale sets, or to work with Azure Policy directly to enable Azure virtual machines, see [Deploy Azure Monitor at scale using Azure Policy](../best-practices.md).

## VM insights initiatives
VM insights policy initiatives install Azure Monitor Agent and Dependency Agent on new virtual machines in your Azure environment. Assign these initiatives to a management group, subscription, or resource group to install the agents on any Windows or Linux Azure virtual machines within a defined scope automatically.

The initiatives apply to new machines you create and machines you modify, but not to existing VMs. 

|Name |Description |
|:---|:---|
| Enable Azure Monitor for VMs with Azure Monitoring Agent (AMA) | Installs Azure Monitor Agent and Dependency agent on Azure VMs. |
| Enable Azure Monitor for VMSS with Azure Monitoring Agent (AMA) | Installs Azure Monitor Agent and Dependency agent on Azure virtual machine scale sets. |
| Enable Azure Monitor for Hybrid VMs with AMA | Installs Azure Monitor Agent and Dependency agent on hybrid VMs connected with Azure Arc. |
| Legacy - Enable Azure Monitor for VMs | Installs the Log Analytics agent and Dependency agent on Azure virtual machine scale sets. |
| Legacy - Enable Azure Monitor for virtual machine scale sets | Installs the Log Analytics agent and Dependency agent on Azure virtual machine scale sets. |

## Assign a VM insights policy initiative

To assign a VM insights policy initiative to a subscription or management group from the Azure portal:

1. Select **Azure Monitor** > **Virtual machines**. 
1. Select **Overview** > **Other onboarding options** and then **Enable** under **Enable using policy**.

    :::image type="content" source="media/vminsights-enable-policy/other-onboarding-options.png" lightbox="media/vminsights-enable-policy/other-onboarding-options.png" alt-text="Screenshot showing other onboarding options page of VM insights with the Enable using policy option.":::

1. Select **Assign Policy** to assign a policy to a subscription or management group.

    [![Create assignment](media/vminsights-enable-policy/create-assignment.png)](media/vminsights-enable-policy/create-assignment.png#lightbox)
    
    This is the same page to assign an initiative in Azure Policy except that it's hardcoded with the scope that you selected and the **Enable VM insights** initiative definition. 

1. (Optional) Change the **Assignment name** and add a **Description**. 
1. Select **Exclusions** if you want to provide an exclusion to the scope. For example, your scope could be a management group, and you could specify a subscription in that management group to be excluded from the assignment.

    [![Assign initiative](media/vminsights-enable-policy/assign-initiative.png)](media/vminsights-enable-policy/assign-initiative.png#lightbox)

1. On the **Parameters** tab, select a **Log Analytics workspace** to which all virtual machines in the assignment will send data. For virtual machines to send data to different workspaces, create multiple assignments, each with their own scope. 


    [![Workspace](media/vminsights-enable-policy/assignment-workspace.png)](media/vminsights-enable-policy/assignment-workspace.png#lightbox)
   
    > [!NOTE]
    > If you select a workspace that's not within the scope of the assignment, grant *Log Analytics Contributor* permissions to the policy assignment's Principal ID. If you don't do this, you might see a deployment failure like `The client '343de0fe-e724-46b8-b1fb-97090f7054ed' with object id '343de0fe-e724-46b8-b1fb-97090f7054ed' does not have authorization to perform action 'microsoft.operationalinsights/workspaces/read' over scope ...`


1. Select **Review + Create** to review the details before selecting **Create** to create the assignment. Don't create a remediation task at this point because you'll probably need multiple remediation tasks to enable existing virtual machines. See [Remediate compliance results](#remediate-compliance-results) below.

### Review compliance for a VM insights policy initiative 

After you create a policy assignment, you can review and manage compliance for the **Enable VM insights** initiative across your management groups and subscriptions. 

To see how many virtual machines exist in each of the management groups or subscriptions and their compliance status:

1. Select **Azure Monitor** > **Virtual machines**. 
1. Select **Overview** > **Other onboarding options** and then **Enable** under **Enable using policy**.

    [![VM insights Manage Policy page](media/vminsights-enable-policy/manage-policy-page-01.png)](media/vminsights-enable-policy/manage-policy-page-01.png#lightbox)


    The following table describes the information in this view.
    
    | Function | Description | 
    |----------|-------------| 
    | **Scope** | Management group and subscriptions that you have or inherited access to with ability to drill down through the management group hierarchy.|
    | **Role** | Your role in the scope, which might be reader, owner, or contributor. This will be blank if you have access to the subscription but not to the management group it belongs to. This role determines what data you can see and actions you can perform in terms of assigning policies or initiatives (owner), editing them, or viewing compliance. |
    | **Total VMs** | Total number of VMs in that scope regardless of their status. For a management group, this is a sum total of VMs nested under the subscriptions or child management groups. |
    | **Assignment Coverage** | Percent of VMs that are covered by the initiative. |
    | **Assignment Status** | **Success** - All VMs in the scope have the Log Analytics and Dependency agents deployed to them.<br>**Warning** - The subscription isn't under a management group.<br>**Not Started** - A new assignment was added.<br>**Lock** - You don't have sufficient privileges to the management group.<br>**Blank** - No VMs exist or a policy isn't assigned. |
    | **Compliant VMs** | Number of VMs that are compliant, which is the number of VMs that have both Log Analytics agent and Dependency agent installed. This will be blank if there are no assignments, no VMs in the scope, or not proper permissions. |
    | **Compliance** | The overall compliance number is the sum of distinct resources that are compliant divided by the sum of all distinct resources. |
    | **Compliance State** | **Compliant** - All VMs in the scope virtual machines have the Log Analytics and Dependency agents deployed to them or any new VMs in the scope subject to the assignment have not yet been evaluated.<br>**Non-compliant** - There are VMs that have been evaluated but are not enabled and may require remediation.<br>**Not Started** - A new assignment was added.<br>**Lock** - You don't have sufficient privileges to the management group.<br>**Blank** - No policy is assigned.  |

    When you assign the initiative, the scope you select in the assignment could be the scope listed or a subset of it. For instance, you might have created an assignment for a subscription (initiative scope) and not a management group (coverage scope). In this case, the value of **Assignment Coverage** indicates the VMs in the initiative scope divided by the VMs in coverage scope. In another case, you might have excluded some VMs, resource groups, or a subscription from policy scope. If the value is blank, it indicates that either the policy or initiative doesn't exist or you don't have permission. Information is provided under **Assignment Status**.

## Remediate compliance results

If your assignment doesn't show 100% compliance, create remediation tasks to evaluate and enable existing VMs.

To create remediation tasks from the Azure portal:

1. Select **Azure Monitor** > **Virtual machines**. 
1. Select **Overview** > **Other onboarding options** and then **Enable** under **Enable using policy**.
1. Select the ellipsis (...) > **View Compliance**.

    [![View compliance](media/vminsights-enable-policy/view-compliance.png)](media/vminsights-enable-policy/view-compliance.png#lightbox)
    
    This opens the **Compliance** page, which lists assignments that match the specified filter and indicates whether they're compliant. 
    
    [![Policy compliance for Azure VMs](./media/vminsights-enable-policy/policy-view-compliance.png)](./media/vminsights-enable-policy/policy-view-compliance.png#lightbox)
    
1. Select an assignment to view its details.
    
    [![Compliance details](media/vminsights-enable-policy/compliance-details.png)](media/vminsights-enable-policy/compliance-details.png#lightbox)

    This opens the **Initiative compliance** page, which lists the policy definitions in the initiative and whether each is in compliance.
    
1. Select a policy definition to view its details. Scenarios that policy definitions will show as out of compliance include the following:

    * Log Analytics agent or Dependency agent isn't deployed. Create a remediation task to mitigate.
    * VM image (OS) isn't identified in the policy definition. The criteria of the deployment policy include only VMs that are deployed from well-known Azure VM images. Check the documentation to see whether the VM OS is supported.
    * VMs aren't logging to the specified Log Analytics workspace. Some VMs in the initiative scope are connected to a Log Analytics workspace other than the one that's specified in the policy assignment.
    
1. To create a remediation task to mitigate compliance issues, select **Create Remediation Task**. 

    [![Policy compliance details](media/vminsights-enable-policy/policy-compliance-details.png)](media/vminsights-enable-policy/policy-compliance-details.png#lightbox)

    

    [![New remediation task](media/vminsights-enable-policy/new-remediation-task.png)](media/vminsights-enable-policy/new-remediation-task.png#lightbox)

1. Select **Remediate** to create the remediation task and then **Remediate** to start it. You will most likely need to create multiple remediation tasks, one for each policy definition. You can't create a remediation task for an initiative.

    [![Screenshot shows the Policy Remediation pane for Monitor | Virtual Machines.](media/vminsights-enable-policy/remediation.png)](media/vminsights-enable-policy/remediation.png#lightbox)
    
    
    Once the remediation tasks are complete, your VMs should be compliant with agents installed and enabled for VM insights. 
    

## Azure Policy
To use Azure Policy to enable monitoring for virtual machine scale sets, assign the **Enable Azure Monitor for Virtual Machine Scale Sets** initiative to an Azure management group, subscription, or resource group, depending on the scope of your resources to monitor. A [management group](../../governance/management-groups/overview.md) is useful for scoping policy, especially if your organization has multiple subscriptions.

![Screenshot of the Assign initiative page in Azure portal. Initiative definition is set to Enable Azure Monitor for Virtual Machine Scale Sets.](media/vminsights-enable-policy/virtual-machine-scale-set-assign-initiative.png)

Select the workspace that the data will be sent to. This workspace must have the *VMInsights* solution installed, as described in [Configure Log Analytics workspace for VM insights](vminsights-configure-workspace.md).

![Screenshot that shows selecting a workspace.](media/vminsights-enable-policy/virtual-machine-scale-set-workspace.png)

Create a remediation task if you have existing virtual machine scale sets that need to be assigned this policy.

![Screenshot that shows creating a remediation task.](media/vminsights-enable-policy/virtual-machine-scale-set-remediation.png)



## Next steps

Now that monitoring is enabled for your virtual machines, this information is available for analysis with VM insights. 

- To view discovered application dependencies, see [View VM insights Map](vminsights-maps.md). 
- To identify bottlenecks and overall utilization with your VM's performance, see [View Azure VM performance](vminsights-performance.md).
