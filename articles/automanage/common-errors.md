---
title: Troubleshoot common Azure Automanage onboarding errors
description: Common Automanage onboarding errors and how to troubleshoot them
ms.service: automanage
ms.workload: infrastructure
ms.topic: conceptual
ms.date: 12/10/2021
---

# Troubleshoot common Automanage onboarding errors
Automanage may fail to onboard a machine onto the service. This document explains how to troubleshoot deployment failures, shares some common reasons why deployments may fail, and describes potential next steps on mitigation.

## Troubleshooting deployment failures
Onboarding a machine to Automanage will result in an Azure Resource Manager deployment being created. For more information, see the deployment for further details as to why it failed. There are links to the deployments in the failure detail flyout, pictured below.

:::image type="content" source="media\common-errors\failure-flyout.png" alt-text="Screenshot of Automanage failure detail flyout.":::

### Check the deployments for the resource group containing the failed machine
The failure flyout will contain a link to the deployments in the resource group containing the machine that failed onboarding. Clicking the deployment link will take you to the deployments blade where you can see the Automanage deployments to your machine. If you're deploying across multiple regions, ensure that you click on the deployment in the correct region.

### Check the deployments for the subscription containing the failed machine
If you don't see any failures in the resource group deployment, then your next step would be to look at the deployments in your subscription containing the machine that failed onboarding. Click the **Deployments for subscription** link in the failure flyout to see all Automanage related deployments for further troubleshooting. 

### Check deployments in a subscription linked to a Log Analytics workspace
If you don't see any failed deployments in the resource group or subscription containing your failed machine, and if your failed machine is connected to a Log Analytics workspace in a different subscription, then go to the subscription linked to your Log Analytics workspace and check for failed deployments.

## Common deployment errors

| Error                                                                                                            | Mitigation                                                                                                                                                                                                                                                                                                                                                                                                                                                                          |
| :--------------------------------------------------------------------------------------------------------------- | :---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Automanage account insufficient permissions error                                                                | This error may occur if you've recently moved a subscription containing a new Automanage Account into a new tenant. Steps to resolve this error are located [here](./repair-automanage-account.md).                                                                                                                                                                                                                                                                                 |
| Workspace region not matching region mapping requirements                                                        | Automanage was unable to onboard your machine because the Log Analytics workspace that the machine is currently linked to isn't mapped to a supported Automation region. Ensure that your existing Log Analytics workspace and Automation account are located in a [supported region mapping](../automation/how-to/region-mappings.md).                                                                                                                                             |
| The template deployment failed because of policy violation                                                       | Automanage was unable to onboard your machine because it violates an existing policy. If the policy violation is related to tags, you can [deploy a custom configuration profile](./virtual-machines-custom-profile.md#create-a-custom-profile-using-azure-resource-manager-templates) with tags for the following ARM resources: default resource group, automation account, recovery services vault, and log analytics workspace                                                  |
| "Access denied because of the deny assignment with name 'System deny assignment created by managed application'" | A [denyAssignment](../role-based-access-control/deny-assignments.md) was created on your resource, which prevented Automanage from accessing your resource. This denyAssignment may have been created by either a [Blueprint](../governance/blueprints/concepts/resource-locking.md) or a [Managed Application](../azure-resource-manager/managed-applications/overview.md).                                                                                                        |
| "OS Information: Name='(null)', ver='(null)', agent status='Not Ready'."                                         | Ensure that you're running a [minimum supported agent version](/troubleshoot/azure/virtual-machines/support-extensions-agent-version), the agent is running ([Linux](/troubleshoot/azure/virtual-machines/linux-azure-guest-agent) and [Windows](/troubleshoot/azure/virtual-machines/windows-azure-guest-agent)), and that the agent is up to date ([Linux](../virtual-machines/extensions/update-linux-agent.md) and [Windows](../virtual-machines/extensions/agent-windows.md)). |
| "Unable to determine the OS for the VM. Check that the VM Agent is running, the current status is Ready."        | Ensure that you're running a [minimum supported agent version](/troubleshoot/azure/virtual-machines/support-extensions-agent-version), the agent is running ([Linux](/troubleshoot/azure/virtual-machines/linux-azure-guest-agent) and [Windows](/troubleshoot/azure/virtual-machines/windows-azure-guest-agent)), and that the agent is up to date ([Linux](../virtual-machines/extensions/update-linux-agent.md) and [Windows](../virtual-machines/extensions/agent-windows.md)). |
| "VM has reported a failure when processing extension 'IaaSAntimalware'"                                          | Ensure you don't have another antimalware/antivirus offering already installed on your VM. If that fails, contact support.                                                                                                                                                                                                                                                                                                                                                          |
| ASC workspace: Automanage doesn't currently support the Log Analytics service in _location_.                     | Check that your VM is located in a [supported region](./overview-about.md#supported-regions).                                                                                                                                                                                                                                                                                                                                                                                       |
| "The assignment has failed; there is no additional information available"                                        | Open a case with Microsoft Azure support.                                                                                                                                                                                                                                                                                                                                                                                                                                           |

## Next steps

* [Learn more about Azure Automanage](./overview-about.md)

> [!div class="nextstepaction"]
> [Enable Automanage for machines in the Azure portal](quick-create-virtual-machines-portal.md)