---
title: Delete an Azure Lab Services lab from Canvas
description: Learn how to delete an Azure Lab Services lab from Canvas. 
ms.topic: how-to
ms.date: 11/08/2021
---

# Delete labs within Canvas

This article shows how to delete a lab from the **Azure Lab Services** app.

## Prerequisites

* [Create a Lab Plan](tutorial-setup-lab-plan.md#create-a-lab-plan) in the Azure portal.
* [Get started and create a Lab Services lab within Canvas](how-to-get-started-create-lab-within-canvas.md).

## Delete labs

A lab created within Canvas can be deleted in the [Lab Services website](https://labs.azure.com) by deleting the lab directly, as described in [Manage labs in Azure Lab Services](how-to-manage-classroom-labs-2.md). 

Lab deletion is also triggered when the team is deleted. If the team in which the lab is created gets deleted, lab would be automatically deleted 24 hours after the automatic user list sync is triggered. 

> [!IMPORTANT]
> Deletion of the tab or uninstalling the app will not result in deletion of the lab. 

If the tab is deleted, users on the team membership list will still be able to access the VMs on the [Lab Services website](https://labs.azure.com) unless the lab deletion is explicitly triggered by deleting the lab on website or deleting the team. 

## Next steps

- [Use Azure Lab Services within Canvas overview](lab-services-within-canvas-overview.md)
- [Manage lab user lists within Canvas](how-to-manage-user-lists-within-canvas.md)
- [Manage lab's VM pool within Canvas](how-to-manage-vm-pool-within-canvas.md)
- [Create and manage lab schedules within Canvas](how-to-create-schedules-within-canvas.md)
- [Access a VM within Canvas – Student view](how-to-access-vm-for-students-within-canvas.md)

