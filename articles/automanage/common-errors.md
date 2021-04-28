---
title: Troubleshoot common Azure Automanage onboarding errors
description: Common Automanage onboarding errors and how to troubleshoot them
author: asinn826
ms.service: virtual-machines
ms.subservice: automanage
ms.workload: infrastructure
ms.topic: conceptual
ms.date: 01/14/2021
ms.author: alsin
---

# Troubleshoot common Automanage onboarding errors
Automanage may fail to onboard a machine onto the service. This document explains how to troubleshoot deployment failures, shares some common reasons why deployments may fail, and describes potential next steps on mitigation.

## Troubleshooting deployment failures
Onboarding a machine to Automanage will result in an Azure Resource Manager deployment being created. For more information, see the deployment for further details as to why it failed. There are links to the deployments in the failure detail flyout, pictured below.

:::image type="content" source="media\common-errors\failure-flyout.png" alt-text="Automanage failure detail flyout.":::

### Check the deployments for the resource group containing the failed VM
The failure flyout will contain a link to the deployments in the resource group containing the machine that failed onboarding. The flyout will also contain a prefix name you can use to filter deployments with. Clicking the deployment link will take you to the deployments blade, where you can then filter deployments to see Automanage deployments to your machine. If you're deploying across multiple regions, ensure that you click on the deployment in the correct region.

### Check the deployments for the subscription containing the failed VM
If you don't see any failures in the resource group deployment, then your next step would be to look at the deployments in your subscription containing the VM that failed onboarding. Click the **Deployments for subscription** link in the failure flyout and filter deployments using the **Automanage-DefaultResourceGroup** filter. Use the resource group name from the failure blade to filter deployments. The deployment name will be suffixed with a region name. If you're deploying across multiple regions, ensure that you click on the deployment in the correct region.

### Check deployments in a subscription linked to a Log Analytics workspace
If you don't see any failed deployments in the resource group or subscription containing your failed VM, and if your failed VM is connected to a Log Analytics workspace in a different subscription, then go to the subscription linked to your Log Analytics workspace and check for failed deployments.

## Common deployment errors

Error |  Mitigation
:-----|:-------------|
Automanage account insufficient permissions error | This error may occur if you have recently moved a subscription containing a new Automanage Account into a new tenant. Steps to resolve this error are located [here](./repair-automanage-account.md).
Workspace region not matching region mapping requirements | Automanage was unable to onboard your machine because the Log Analytics workspace that the machine is currently linked to is not mapped to a supported Automation region. Ensure that your existing Log Analytics workspace and Automation account are located in a [supported region mapping](../automation/how-to/region-mappings.md).
"Access denied because of the deny assignment with name 'System deny assignment created by managed application'" | A [denyAssignment](https://docs.microsoft.com/azure/role-based-access-control/deny-assignments) was created on your resource, which prevented Automanage from accessing your resource. This denyAssignment may have been created by either a [Blueprint](https://docs.microsoft.com/azure/governance/blueprints/concepts/resource-locking) or a [Managed Application](https://docs.microsoft.com/azure/azure-resource-manager/managed-applications/overview).
"OS Information: Name='(null)', ver='(null)', agent status='Not Ready'." | Ensure that you're running a [minimum supported agent version](https://docs.microsoft.com/troubleshoot/azure/virtual-machines/support-extensions-agent-version), the agent is running ([Linux](https://docs.microsoft.com/troubleshoot/azure/virtual-machines/linux-azure-guest-agent) and [Windows](https://docs.microsoft.com/troubleshoot/azure/virtual-machines/windows-azure-guest-agent)), and that the agent is up to date ([Linux](https://docs.microsoft.com/azure/virtual-machines/extensions/update-linux-agent) and [Windows](https://docs.microsoft.com/azure/virtual-machines/extensions/agent-windows)).
"Unable to determine the OS for the VM OS Name:, ver . Please check that the VM Agent is running, the current status is Ready." | Ensure that you're running a [minimum supported agent version](https://docs.microsoft.com/troubleshoot/azure/virtual-machines/support-extensions-agent-version), the agent is running ([Linux](https://docs.microsoft.com/troubleshoot/azure/virtual-machines/linux-azure-guest-agent) and [Windows](https://docs.microsoft.com/troubleshoot/azure/virtual-machines/windows-azure-guest-agent)), and that the agent is up to date ([Linux](https://docs.microsoft.com/azure/virtual-machines/extensions/update-linux-agent) and [Windows](https://docs.microsoft.com/azure/virtual-machines/extensions/agent-windows)).
"VM has reported a failure when processing extension 'IaaSAntimalware'" | Ensure you don't have another antimalware/antivirus offering already installed on your VM. If that fails, contact support.
ASC workspace: Automanage does not currently support the Log Analytics service in _location_. | Check that your VM is located in a [supported region](./automanage-virtual-machines.md#supported-regions).
The template deployment failed because of policy violation. Please see details for more information. | There is a policy preventing Automanage from onboarding your VM. Check the policies that are applied to your subscription or resource group containing your VM you want to onboard to Automanage.
"The assignment has failed; there is no additional information available" | Please open a case with Microsoft Azure support.

## Next steps

* [Learn more about Azure Automanage](./automanage-virtual-machines.md)

> [!div class="nextstepaction"]
> [Enable Automanage for virtual machines in the Azure portal](quick-create-virtual-machines-portal.md)