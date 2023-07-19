---
title: View Application Insights Snapshot Debugger data
description: View snapshots collected by the Snapshot Debugger in either the Azure portal or Visual Studio 
ms.author: hannahhunter
author: hhunter-ms
ms.reviewer: charles.weininger
reviewer: cweining
ms.topic: conceptual
ms.custom: devdivchpfy22
ms.date: 04/14/2023
---

# View Application Insights Snapshot Debugger data

Snapshots appear on [**Exceptions**](../app/asp-net-exceptions.md) in the Application Insights pane of the Azure portal.

You can view debug snapshots in the portal to see the call stack and inspect variables at each call stack frame. To get a more powerful debugging experience with source code, open snapshots with Visual Studio Enterprise. You can also [set SnapPoints to interactively take snapshots](/visualstudio/debugger/debug-live-azure-applications) without waiting for an exception.

## View Snapshots in the Portal

After an exception has occurred in your application and a snapshot has been created, you should have snapshots to view in the Azure portal within 5 to 10 minutes. To view snapshots, in the **Failure** pane, either:

* Select the **Operations** button when viewing the **Operations** tab, or
* Select the **Exceptions** button when viewing the **Exceptions** tab.

:::image type="content" source="./media/snapshot-debugger/failures-page.png" alt-text="Screenshot showing the Failures Page in Azure portal.":::

Select an operation or exception in the right pane to open the **End-to-End Transaction Details** pane, then select the exception event. If a snapshot is available for the given exception, an **Open Debug Snapshot** button appears on the right pane with details for the [exception](../app/asp-net-exceptions.md).

:::image type="content" source="./media/snapshot-debugger/e2e-transaction-page.png" alt-text="Screenshot showing the Open Debug Snapshot button on exception.":::

In the Debug Snapshot view, you see a call stack and a variables pane. When you select frames of the call stack in the call stack pane, you can view local variables and parameters for that function call in the variables pane.

:::image type="content" source="./media/snapshot-debugger/open-snapshot-portal.png" alt-text="Screenshot showing the Open debug snapshot highlighted in the Azure portal.":::

Snapshots might include sensitive information. By default,  you can only view snapshots if you've been assigned the `Application Insights Snapshot Debugger` role.

## View Snapshots in Visual Studio 2017 Enterprise or above

1. Click the **Download Snapshot** button to download a `.diagsession` file, which can be opened by Visual Studio Enterprise.

1. To open the `.diagsession` file, you need to have the Snapshot Debugger Visual Studio component installed. The Snapshot Debugger component is a required component of the ASP.NET workload in Visual Studio and can be selected from the Individual Component list in the Visual Studio installer. If you're using a version of Visual Studio before Visual Studio 2017 version 15.5, you'll need to install the extension from the [Visual Studio Marketplace](https://aka.ms/snapshotdebugger).

1. After you open the snapshot file, the Minidump Debugging page in Visual Studio appears. Click **Debug Managed Code** to start debugging the snapshot. The snapshot opens to the line of code where the exception was thrown so that you can debug the current state of the process.

    :::image type="content" source="./media/snapshot-debugger/open-snapshot-visual-studio.png" alt-text="Screenshot showing the debug snapshot in Visual Studio.":::

The downloaded snapshot includes any symbol files that were found on your web application server. These symbol files are required to associate snapshot data with source code. For App Service apps, make sure to enable symbol deployment when you publish your web apps.

## Next steps 

Enable the Snapshot Debugger in your:
- [App Service](./snapshot-debugger-app-service.md)
- [Function App](./snapshot-debugger-function-app.md)
- [Virtual machine or other Azure service](./snapshot-debugger-vm.md)
