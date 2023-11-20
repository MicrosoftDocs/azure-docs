---
title: Disable local authentication in Azure Automation
description: This article describes disabling local authentication in Azure Automation.
services: automation
ms.subservice: process-automation
ms.date: 11/20/2023
ms.custom: engagement-fy23
ms.topic: how-to
#Customer intent: As an administrator, I want disable local authentication so that I can enhance security.
---

# Disable local authentication in Automation

> [!IMPORTANT]
> - Update Management patching will not work when local authentication is disabled. 
> - When you disable local authentication, it impacts the starting a runbook using a webhook, Automation Desired State Configuration and agent-based Hybrid Runbook Workers. For more information, see the [available alternatives](#compatibility).

Azure Automation provides Microsoft Entra authentication support for all Automation service public endpoints. This critical security enhancement removes certificate dependencies and gives organizations control to disable local authentication methods. This feature provides you with seamless integration when centralized control and management of identities and resource credentials through Microsoft Entra ID is required.

Azure Automation provides an optional feature to "Disable local authentication" at the Automation account level using the Azure policy [Configure Azure Automation account to disable local authentication](../automation/policy-reference.md#azure-automation). By default, this flag is set to false at the account, so you can use both local authentication and Microsoft Entra authentication. If you choose to disable local authentication, then the Automation service only accepts Microsoft Entra ID based authentication.

In the Azure portal, you may receive a warning message on the landing page for the selected Automation account if authentication is disabled. To confirm if the local authentication policy is enabled, use the PowerShell cmdlet [Get-AzAutomationAccount](/powershell/module/az.automation/get-azautomationaccount) and check property `DisableLocalAuth`. A value of `true` means local authentication is disabled.

Disabling local authentication doesn't take effect immediately. Allow a few minutes for the service to block future authentication requests.

>[!NOTE]
> - Currently, PowerShell support for the new API version (2021-06-22) or the flag – `DisableLocalAuth` is not available. However, you can use the Rest-API with this API version to update the flag.

## Re-enable local authentication

To re-enable local authentication, execute the PowerShell cmdlet `Set-AzAutomationAccount` with the parameter `-DisableLocalAuth false`.  Allow a few minutes for the service to accept the change to allow local authentication requests.

## Compatibility

The following table describes the behaviors or features that are prevented from working by disabling local authentication.

|Scenario | Alternative |
|---|---|
|Starting a runbook using a webhook. | Start a runbook job using Azure Resource Manager template, which uses Microsoft Entra authentication. |
|Using Automation Desired State Configuration.| Use [Azure Policy Guest configuration](../governance/machine-configuration/overview.md).  |
|Using agent-based Hybrid Runbook Workers.| Use [extension-based Hybrid Runbook Workers](./extension-based-hybrid-runbook-worker-install.md).|
|Using Automation Update management |Use [Update Manager (preview)](../update-center/overview.md)


## Next steps
- [Azure Automation account authentication overview](./automation-security-overview.md)
