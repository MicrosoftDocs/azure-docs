---
title: Troubleshoot and repair Dev Box RDP connectivity issues 
description: Having problems connecting to your dev box remotely? Learn how to troubleshoot and resolve connectivity issues to your dev box with developer portal tools. 
author: RoseHJM 
ms.author: rosemalcolm 
ms.service: dev-box 
ms.topic: troubleshooting 
ms.date: 01/10/2024

#CustomerIntent: As a dev box user, I want to be able to troubleshoot and repair connectivity issues with my dev box so that I don't lose development time.
---

# Troubleshoot and resolve dev box remote desktop connectivity issues 

In this article, you learn how to troubleshoot and resolve remote desktop connectivity (RDC) issues with your dev box. Because RDC issues to your dev box can be time consuming to resolve manually, use the **Troubleshoot & repair** tool in the developer portal to diagnose and repair some common dev box connectivity issues.

:::image type="content" source="media/how-to-troubleshoot-repair-dev-box/dev-box-troubleshoot-repair-tool.png" alt-text="Screenshot showing the Troubleshoot and repair tool in the Microsoft developer portal." lightbox="media/how-to-troubleshoot-repair-dev-box/dev-box-troubleshoot-repair-tool.png":::

When you run the **Troubleshoot & repair** tool, your dev box and its back-end services in the Azure infrastructure are scanned for issues. If an issue is detected, the troubleshoot and repair process fixes the issue so you can connect to your dev box.

## Prerequisites

- Access to the Microsoft developer portal.
- The dev box that you want to troubleshoot must be running.

## Run Troubleshoot & repair

If you're unable to connect to your dev box by using an RDP client, use the **Troubleshoot & repair** tool. 

The troubleshoot and repair process completes on average in 20 minutes, but can take up to 40 minutes. During this time, you can't use your dev box. The tool scans a list of critical components that relate to RDP connectivity, including but not limited to:
- Domain join check
- SxS stack listener readiness
- URL accessibility check
- Virtual machine power status check
- Azure resource availability check
- Virtual machine extension check
- Windows Guest OS readiness

> [!WARNING]
> Running the troubleshoot and repair process might effectively restart your dev box. Any unsaved data on your dev box will be lost. 

To run the **Troubleshoot & repair** tool on your dev box, follow these steps:

1. Sign in to the [developer portal](https://aka.ms/devbox-portal).

1. Check that the dev box you want to troubleshoot is running.
 
   :::image type="content" source="media/how-to-troubleshoot-repair-dev-box/dev-box-running-tile.png" alt-text="Screenshot showing the dev box tile with the status Running." lightbox="media/how-to-troubleshoot-repair-dev-box/dev-box-running-tile.png"::: 

1. If the dev box isn't running, start it, and check whether you can connect to it with RDP.

1. If your dev box is running and you still can't connect to it with RDP, on the more actions (**...**) menu, select **Troubleshoot & repair**.

   :::image type="content" source="media/how-to-troubleshoot-repair-dev-box/dev-box-actions-troubleshoot-repair.png" alt-text="Screenshot showing the Troubleshoot and repair option for a dev box on the more actions menu." lightbox="media/how-to-troubleshoot-repair-dev-box/dev-box-actions-troubleshoot-repair.png" :::

1. In the **Troubleshoot & repair** connectivity message box, select **Yes, I want to troubleshoot this dev box**, and then select **Troubleshoot**.

   :::image type="content" source="media/how-to-troubleshoot-repair-dev-box/dev-box-troubleshoot-confirm.png" alt-text="Screenshot showing the Troubleshoot and repair connectivity confirmation message with the Yes option highlighted." lightbox="media/how-to-troubleshoot-repair-dev-box/dev-box-troubleshoot-confirm.png" ::: 

   While you wait for the process to complete, you can leave your developer portal session open, or close it and reopen it later. The troubleshoot and repair process continues in the background.

1. After the RDP connectivity issue is resolved, you can connect to dev box again through [a browser](quickstart-create-dev-box.md#connect-to-a-dev-box), or [a Remote Desktop client](/azure/dev-box/tutorial-connect-to-dev-box-with-remote-desktop-app?tabs=windows).

## View Troubleshoot & repair results

When the troubleshoot and repair process finishes, the tool lists the results of the completed checks:

| Check result | Description |
|---|---|
| **An issue was resolved.** | An issue was detected and fixed. You can try to connect to the dev box again. |
| **No issue detected.** | None of the checks discovered an issue with the dev box. |
| **An issue was detected but could not be fixed automatically.** | There's an issue with the dev box that the Troubleshoot & repair process couldn't resolve. You can select **View details** for the issue and explore options to fix the issue manually. |
 
## Related content

- [Tutorial: Use a Remote Desktop client to connect to a dev box](tutorial-connect-to-dev-box-with-remote-desktop-app.md)
