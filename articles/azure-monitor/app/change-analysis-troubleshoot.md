---
title: Troubleshoot Application Change Analysis - Azure Monitor
description: Learn how to troubleshoot problems in Application Change Analysis.
ms.topic: conceptual
author: cawams
ms.author: cawa
ms.date: 02/11/2021 
ms.custom: devx-track-azurepowershell

---

# Troubleshoot Application Change Analysis (preview)

## Having trouble registering Microsoft. Change Analysis resource provider from Change history tab

If it's the first time you view Change history after its integration with Application Change Analysis, you will see it automatically registering a resource provider **Microsoft.ChangeAnalysis**. In rare cases it might fail for the following reasons:

- **You don't have enough permissions to register Microsoft.ChangeAnalysis resource provider**. This error message means your role in the current subscription does not have the **Microsoft.Support/register/action** scope associated with it. This might happen if you are not the owner of a subscription and got shared access permissions through a coworker (that is, view access to a resource group). To fix this, you can contact the owner of your subscription to register the **Microsoft.ChangeAnalysis** resource provider. This can be done in Azure portal through **Subscriptions | Resource providers** and search for ```Microsoft.ChangeAnalysis``` and register in the UI, or through Azure PowerShell or Azure CLI.

    Register resource provider through PowerShell:
    ```PowerShell
    # Register resource provider
    Register-AzResourceProvider -ProviderNamespace "Microsoft.ChangeAnalysis"
    ```

- **Failed to register Microsoft.ChangeAnalysis resource provider**. This message means something failed immediately as the UI sent request to register the resource provider, and it's not related to permission issue. Likely it might be a temporary internet connectivity issue. Try refreshing the page and checking your internet connection. If the error persists, contact changeanalysishelp@microsoft.com

- **This is taking longer than expected**. This message means the registration is taking longer than 2 minutes. This is unusual but does not necessarily mean something went wrong. You can go to **Subscriptions | Resource provider** to check for **Microsoft.ChangeAnalysis** resource provider registration status. You can try to use the UI to unregister, re-register, or refresh to see if it helps. If issue persists, contact changeanalysishelp@microsoft.com for support.
    ![Troubleshoot RP registration taking too long](./media/change-analysis/troubleshoot-registration-taking-too-long.png)

![Screenshot of the Diagnose and Solve Problems tool for a Virtual Machine with Troubleshooting tools selected.](./media/change-analysis/vm-dnsp-troubleshootingtools.png)

![Screenshot of the tile for the Analyze recent changes troubleshooting tool for a Virtual Machine.](./media/change-analysis/analyze-recent-changes.png)

## Azure Lighthouse subscription is not supported

- **Failed to query Microsoft.ChangeAnalysis resource provider** with message *Azure lighthouse subscription is not supported, the changes are only available in the subscription's home tenant*. There is a limitation right now for Change Analysis resource provider to be registered through Azure Lighthouse subscription for users not in home tenant. We are working on addressing this limitation. If this is a blocking issue for you, there is a workaround that involves creating a service principal and explicitly assigning the role to allow the access.  Contact changeanalysishelp@microsoft.com to learn more about it.

## An error occurred while getting changes. Please refresh this page or come back later to view changes

This is the general error message presented by Application Change Analysis service when changes could not be loaded. A few known causes are:

- Internet connectivity error from the client device
- Change Analysis service being temporarily unavailable
Refreshing the page after a few minutes usually fixes this issue. If the error persists, contact changeanalysishelp@micorosoft.com

## You don't have enough permissions to view some changes. Contact your Azure subscription administrator

This is the general unauthorized error message, explaining the current user does not have sufficient permissions to view the change. At least reader access is required on the resource to view infrastructure changes returned by Azure Resource Graph and Azure Resource Manager. For web app in-guest file changes and configuration changes, at least contributor role is required.

## Failed to register Microsoft.ChangeAnalysis resource provider

This message means something failed immediately as the UI sent request to register the resource provider, and it's not related to permission issue. Likely it might be a temporary internet connectivity issue. Try refreshing the page and checking your internet connection. If the error persists, contact changeanalysishelp@microsoft.com

## You don't have enough permissions to register Microsoft.ChangeAnalysis resource provider. Contact your Azure subscription administrator

This error message means your role in the current subscription does not have the **Microsoft.Support/register/action** scope associated with it. This might happen if you are not the owner of a subscription and got shared access permissions through a coworker (that is, view access to a resource group). To fix this, you can contact the owner of your subscription to register the **Microsoft.ChangeAnalysis** resource provider. This can be done in Azure portal through **Subscriptions | Resource providers** and search for ```Microsoft.ChangeAnalysis``` and register in the UI, or through Azure PowerShell or Azure CLI.

Register resource provider through PowerShell:

```PowerShell
# Register resource provider
Register-AzResourceProvider -ProviderNamespace "Microsoft.ChangeAnalysis"
```

## Next steps

- Learn more about [Azure Resource Graph](../../governance/resource-graph/overview.md), which helps power Change Analysis.
