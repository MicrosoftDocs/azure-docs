---
title: Disable Azure Automanage for virtual machines
description: Learn how to disable Azure Automanage for Automanaged virtual machines.
author: mmccrory
ms.service: automanage
ms.workload: infrastructure
ms.topic: how-to
ms.date: 09/07/2022
ms.author: memccror
---

# Disabling Automanage for VMs

You may decide one day to disable Automanage on certain VMs. For instance, your machine is running some super sensitive secure workload and you need to lock it down even further than Azure would have done naturally, so you need to configure the machine outside of Azure best practices.

## How to disable Automanage through the Azure portal

To do that in the Azure portal, go to the **Automanage – Azure machine best practices** page that lists all of your auto-managed VMs. Select the checkbox next to the virtual machine you want to disable from Automanage, then click on the **Disable automanagment** button.

[ ![Screenshot of disabling Automanage on a virtual machine.](./media/automanage-virtual-machines/disable-step-1.png) ](./media/automanage-virtual-machines/disable-step-1.png#lightbox)

Read carefully through the messaging in the resulting pop-up before agreeing to **Disable**.

[ ![Screenshot of disabling Automanage on a virtual machine confirmation.](./media/automanage-virtual-machines/disable-step-2.png) ](./media/automanage-virtual-machines/disable-step-2.png#lightbox)

> [!NOTE]
> Disabling automanagement in a VM results in the following behavior:
>
> - The configuration of the VM and the services it is onboarded to don't change.
> - Any charges incurred by those services remain billable and continue to be incurred.
> - Automanage drift monitoring immediately stops.

First and foremost, we will not off-board the virtual machine from any of the services that we onboarded it to and configured. So any charges incurred by those services will continue to remain billable. You will need to off-board if necessary. Any Automanage behavior will stop immediately. For example, we will no longer monitor the VM for drift.

## Next steps

Get the most frequently asked questions answered in our FAQ.

> [!div class="nextstepaction"]
> [Frequently Asked Questions](faq.yml)