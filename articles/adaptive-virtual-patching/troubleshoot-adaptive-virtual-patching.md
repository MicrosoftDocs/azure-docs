---
title: Troubleshoot Azure Adaptive Virtual Patching
description: Troubleshoot common problems with onboarding, protection status, findings, and mitigations in Azure Adaptive Virtual Patching.
author: AlishaJyoti
ms.author: alishajyoti
ms.service: azure
ms.topic: troubleshooting
ms.date: 11/17/2026
---

# Troubleshoot Azure Adaptive Virtual Patching

This article answers common questions about onboarding, protection status, findings, and mitigations. For setup steps, see [Deploy](deploy-adaptive-shield-portal.md). For day-to-day operations, see [Manage](manage-adaptive-shield.md).

## Onboarding and eligibility

### Why doesn't my VM or virtual machine scale set appear in **Add resource**?

The picker shows only VMs that meet all of the following requirements:

- VM runs Ubuntu or Azure Linux with Kernel version 4.19 or later.
- VM has a system-assigned managed identity. For a scale set, enable it on the scale set.
- VM size isn't `Standard_B1ls`.
- For a scale set, the orchestration mode is Uniform (Flexible isn't supported) and the upgrade policy is Automatic.

The portal shows a reason for each resource that doesn't qualify. Fix that setting, and then refresh the list.

### Why does my VM fail the check after I select it?

The second check tests power state and network access:

- VM must be running, because a stopped or deallocated VM fails.
- VM must have outbound internet connectivity through a public IP address, a load balancer, or a NAT gateway.
- No network security group (NSG) rule or network policy blocks the Neuron extension.

### Why do I get an error that the preview feature isn't registered?

Register the `Microsoft.NetworkSecurity` resource provider first, and then register `AdaptiveVirtualPatchingPreview` under **Subscription** > **Preview features**. For steps, see [Register resource provider](/azure/azure-resource-manager/management/resource-providers-and-types#register-resource-provider) and [Set up preview features in an Azure subscription](/azure/azure-resource-manager/management/preview-features). Then confirm the feature's state is `Registered` by running `az feature show --namespace Microsoft.NetworkSecurity --name AdaptiveVirtualPatchingPreview --query properties.state -o tsv`.

### Why can't I deploy an Adaptive Shield in my region?

Adaptive Virtual Patching is available for preview only in select regions. For the full list of supported regions, see [Supported regions](overview.md#supported-regions).

### Why can't I add more VMs to my Adaptive Shield?

An Adaptive Shield protects either up to 40 individual VMs or one or more virtual machine scale sets with up to 40 VM instances combined, but not both. A subscription can have up to two shields. To add VMs to a deployed shield, go to **Protected Resources** > **Add resource**.

## Protection status

### The portal says the VM isn't reachable

Select **Check reachability** on the protected resource. If the VM is stopped, start it, and wait for **Last communication time** to update.

### The portal says the Neuron extension isn't communicating

The extension is installed, but the VM didn't report yet. This condition often happens when the VM is deallocated before its first report. Start the VM, select **Check reachability**, and wait for the first report.

### The extension never finished installing

The Extensions blade on the VM page doesn't list Neuron. On the protected resource page, select **Install VM extension** and confirm. Installation can take up to about five minutes.

### The extension installation failed

Remove the extension from the VM and reinstall it. You can also open Adaptive Shield and select **Install VM extension** from the Protected resource blade.

### Last communication time is old, but the extension shows as installed

The VM stopped reporting. Confirm that the VM is running and can reach the internet. Then select **Scan now** on the **Protected Resources** page. This action restarts the Neuron extension so that it collects and sends a new report. Refresh the page and check **Last communication** time. If it still doesn't update, contact support with the information listed in [Get help](#get-help).

## Findings and mitigations

### Why doesn't my VM have a finding for a CVE I expected?

A finding shows if a VM is exposed to a CVE. Adaptive Virtual Patching creates a finding only when the following conditions are true:

- The VM is enrolled and reports its software inventory through the Neuron extension.
- Adaptive Virtual Patching covers the CVE and can evaluate it. Only CVEs from the last three months are covered. Zero-day CVEs are onboarded within 48 hours of disclosure.

### Why is a mitigation waiting for approval?

In Manual mode, Adaptive Shield generates mitigations but applies them only after you approve them. Approve mitigations from the **Mitigations** page, the **Findings** page, or the protected resource page. In Auto mode, Adaptive Shield applies mitigations without approval.

### Why does a mitigation show **Failed**, **Skipped**, or **Mitigations Exhausted**?

- **Skipped:** the CVE is already resolved, so no change was needed. This status counts as success.
- **Failed:** the CVE is still present. Adaptive Shield tries the next mitigation in recommendation order.
- If every mitigation fails, the finding shows **MitigationsExhausted**.

### Why is a mitigation stuck in **Queued**, or does a finding show **Unreachable**?

**Queued** is expected after a mitigation is approved in Manual mode or selected in Auto mode. The mitigation waits for the agent's next poll, which occurs about every 15 minutes. Queued status alone doesn't indicate a connectivity failure.

If a finding shows **Unreachable**, or a mitigation remains **Queued** beyond the expected polling interval, check **Last communication time** and the resource's protection status. Confirm that the VM is running and that the Neuron extension can communicate. If communication still doesn't resume, contact support with the details listed in [Get help](#get-help).

### Why can't I roll back a mitigation, or reapply one I rolled back?

Rollback is available only for completed mitigations that support it. A rolled-back mitigation can't be reapplied. If a rollback fails, the status shows **Rollback Failed**. Contact support with the failure details.

### Why does **Approve** show a **Conflict** message in Auto mode?

This problem is a known issue. In Auto mode, selecting **Approve** can show a **Conflict** message. You don't need to approve anything in Auto mode, because Adaptive Shield applies mitigations automatically.

## Get help

Include the following information when you contact support:

- Subscription ID
- Adaptive Shield resource name and resource ID
- VM name, resource ID, and region
- Status text shown in the portal
- Last communication time
- Time the problem started
- Any correlation ID shown in the portal or an error message

## Related content

- [Overview of Azure Adaptive Virtual Patching](overview.md)
- [Deploy Azure Adaptive Virtual Patching](deploy-adaptive-shield-portal.md)
- [Manage Azure Adaptive Virtual Patching](manage-adaptive-shield.md)
