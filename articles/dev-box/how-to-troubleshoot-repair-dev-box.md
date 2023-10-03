---
title: Troubleshoot and Repair Dev Box RDP Connectivity Issues 
description: Having problems connecting to your dev box remotely? Learn how to troubleshoot and resolve connectivity issues to your dev box with developer portal tools. 
author: RoseHJM 
ms.author: rosemalcolm 
ms.service: dev-box 
ms.topic: troubleshooting 
ms.date: 09/25/2023 

#CustomerIntent: As a dev box user, I want to be able to troubleshoot and repair connectivity issues with my dev box so that I don't lose development time.
---

# Troubleshoot and resolve dev box remote desktop connectivity issues 

In this article, you learn how to troubleshoot and resolve remote desktop connectivity (RDC) issues with your dev box. Since RDC issues to your dev box can be time consuming to resolve manually, use the *Troubleshoot & repair* tool in the developer portal to diagnose and repair some common dev box connectivity issues.

:::image type="content" source="media/how-to-troubleshoot-repair-dev-box/dev-box-troubleshooting-confirm.png" alt-text="Screenshot showing the Troubleshoot and repair connectivity confirmation message with Yes, I want to troubleshoot this dev box highlighted.":::

When you run the *Troubleshoot & repair* tool, your dev box and its backend services in the Azure infrastructure are scanned for issues. If an issue is detected, *Troubleshoot & repair* fixes the issue so you can connect to your dev box.

## Prerequisites

- Access to the developer portal.
- The dev box you want to troubleshoot must be running.

## Run Troubleshoot and repair

If you're unable to connect to your dev box using an RDP client, use the *Troubleshoot & repair* tool. 

The *Troubleshoot & repair* process takes between 10 to 40 minutes to complete. During this time, you can't use your dev box. The tool scans a list of critical components that relate to RDP connectivity, including but not limited to:
- Domain join check
- SxS stack listener readiness
- URL accessibility check
- VM power status check
- Azure resource availability check
- VM extension check
- Windows Guest OS readiness

> [!WARNING]
> Running *Troubleshoot & repair* may effectively restart your Dev Box. Any unsaved data on your Dev Box will be lost. 

To run *Troubleshoot & repair* on your dev box, follow these steps:

1. Sign in to the [developer portal](https://aka.ms/devbox-portal).

1. Check that the dev box you want to troubleshoot is running.
 
   :::image type="content" source="media/how-to-troubleshoot-repair-dev-box/dev-box-running-tile.png" alt-text="Screenshot showing the dev box tile with the status Running."::: 

1. If the dev box isn't running, start it, and check whether you can connect to it with RDP.

1. If your dev box is running and you still can't connect to it with RDP, on the Actions menu, select **Troubleshoot & repair**.

   :::image type="content" source="media/how-to-troubleshoot-repair-dev-box/dev-box-actions-troubleshoot-repair.png" alt-text="Screenshot showing the Troubleshoot and repair option for a dev box.":::

1. In the Troubleshoot and repair connectivity message box, select *Yes, I want to troubleshoot this dev box*, and then select **Troubleshoot**.

   :::image type="content" source="media/how-to-troubleshoot-repair-dev-box/dev-box-troubleshooting-confirm.png" alt-text="Screenshot showing the Troubleshoot and repair connectivity confirmation message with Yes, I want to troubleshoot this dev box highlighted."::: 

   While waiting for the process to complete, you can leave your dev portal as is, or close it and come back. The process continues in the background.

1. After the RDP connectivity issue is resolved, you can connect to dev box again through [a browser](/azure/dev-box/quickstart-create-dev-box#connect-to-a-dev-box), or [a Remote Desktop client](/azure/dev-box/tutorial-connect-to-dev-box-with-remote-desktop-app?tabs=windows).

## Troubleshoot & repair results

When the *Troubleshoot & repair* process finishes, it lists the results of the checks it ran:

|Outcome  |Description  |
|---------|---------|
|An issue was resolved. |An issue was detected and fixed. You can try to connect to Dev Box again. |
|No issue detected. |None of the checks discovered an issue with the Dev Box. |
|An issue was detected but could not be fixed automatically. |There is an issue with Dev Box, but this action couldn’t fix it. You can select **view details** about the issue was and how to fix it manually. |
 
## Related content

 - [Tutorial: Use a Remote Desktop client to connect to a dev box](tutorial-connect-to-dev-box-with-remote-desktop-app.md)