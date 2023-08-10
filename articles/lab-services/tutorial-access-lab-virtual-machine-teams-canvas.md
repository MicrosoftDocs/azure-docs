---
title:  "Tutorial: Access lab VM from Teams/Canvas"
titleSuffix: Azure Lab Services
description: Learn how to access a VM (student view) in Azure Lab Services from Canvas. 
services: lab-services
ms.service: lab-services
author: ntrogh
ms.author: nicktrog
ms.topic: tutorial
ms.date: 07/04/2023
---

# Tutorial: Access a lab VM from Teams or Canvas

In this tutorial, you learn how to access a lab virtual machine by using the Azure Lab Services app in Teams or Canvas. After you start the lab VM, you can then remotely connect to the lab VM by using secure shell (SSH).

:::image type="content" source="./media/tutorial-access-lab-virtual-machine-teams-canvas/lab-services-process-access-lab-teams-canvas.png" alt-text="Diagram that shows the steps involved in registering and accessing a lab from the Azure Lab Services website.":::

> [!div class="checklist"]
> * Access the lab in Teams or Canvas
> * Start the lab VM
> * Connect to the lab VM

## Prerequisites

- A lab that was created in the Teams or Canvas. Complete the steps in [Tutorial: Create and publish a lab in Teams or Canvas](./tutorial-setup-lab-teams-canvas.md) to create a lab.

## Access a lab

# [Teams](#tab/teams)

When you access a lab in Microsoft Teams, you're automatically registered for the lab, based on your team membership in Microsoft Teams. 

To access your lab in Teams:

1. Sign into Microsoft Teams with your organizational account.

1. Select the team and channel that contain the lab.

1. Select the **Azure Lab Services** tab to view your lab virtual machines.

    :::image type="content" source="./media/tutorial-access-lab-virtual-machine-teams-canvas/teams-view-lab.png" alt-text="Screenshot of lab in Teams after it's published.":::

    You might see a message that the lab isn't available. This error can occur when the lab isn't published yet by the lab creator, or if the Teams membership information still needs to synchronize.

# [Canvas](#tab/canvas)

When you access a lab in [Canvas](https://www.instructure.com/canvas), you're automatically registered for the lab, based on your course membership in Canvas. Azure Lab Services supports test users in Canvas and the ability for the educator to act as another user.

To access your lab in Canvas:

1. Sign into Canvas by using your Canvas credentials.

1. Go to the course, and then open the **Azure Lab Services** app.

    :::image type="content" source="./media/tutorial-access-lab-virtual-machine-teams-canvas/canvas-view-lab.png" alt-text="Screenshot of a lab in the Canvas portal.":::

    You might see a message that the lab isn't available. This error can occur when the lab isn't published yet by the lab creator, or if the Canvas course membership still needs to synchronize.

---

## Start the lab VM

You can start a lab virtual machine from the **My virtual machines** page. If the lab creator configured a lab schedule, the lab VM is automatically started and stopped during the scheduled hours.

To start the lab VM:

1. Go to the **My virtual machines** page in Teams or Canvas.

1. Use the toggle control next to the lab VM status to start the lab VM.

    When the VM is in progress of starting, the control is inactive. Starting the lab VM might take some time to complete.

    :::image type="content" source="./media/tutorial-access-lab-virtual-machine-teams-canvas/start-vm.png" alt-text="Screenshot of My virtual machines page for Azure Lab Services, highlighting the status toggle and status label on the VM tile.":::

1. After the operation finishes, confirm that the lab VM status is *Running*.

    :::image type="content" source="./media/tutorial-access-lab-virtual-machine-teams-canvas/vm-running.png" alt-text="Screenshot of My virtual machines page for Azure Lab Services, highlighting the status label on the VM tile.":::

## Connect to the lab VM

When the lab virtual machine is running, you can remotely connect to the VM. Depending on the lab VM operating system configuration, you can connect by using remote desktop (RDP) or secure shell (SSH).

If there are no quota hours available, you're can't start the lab VM outside the scheduled lab hours and can't connect to the lab VM.

Learn more about how to [connect to a lab VM](connect-virtual-machine.md).

## Next steps

- [Access lab virtual machines in Azure Lab Services](./how-to-access-lab-virtual-machine.md)
- [Connect remotely to a lab virtual machine](./connect-virtual-machine.md)