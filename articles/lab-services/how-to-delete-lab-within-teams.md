---
title: Delete an Azure Lab Services lab from Teams
description: Learn how to delete an Azure Lab Services lab from Teams. 
ms.topic: article
ms.date: 10/12/2020
---

# Delete labs within Teams

This article shows how to delete a lab from the **Azure Lab Services** app.

## Prerequisites

* [Create a Lab Services account](tutorial-setup-lab-account.md#create-a-lab-account) in the Azure portal.
* [Get started and create a Lab Services lab within Teams](how-to-get-started-create-lab-within-teams.md).

## Delete labs

A lab created within Teams can be deleted in the [Lab Services website](https://labs.azure.com) by deleting the lab directly, as described in [Manage labs in Azure Lab Services](how-to-manage-classroom-labs.md). 

Lab deletion is also triggered when the team is deleted. If the team in which the lab is created gets deleted, lab would be automatically deleted 24 hours after the automatic user list sync is triggered. 

> [!IMPORTANT]
> Deletion of the tab or uninstalling the app will not result in deletion of the lab. 

If the tab is deleted, users on the team membership list will still be able to access the VMs on the [Lab Services website](https://labs.azure.com) unless the lab deletion is explicitly triggered by deleting the lab on website or deleting the team. 

## Next steps

- [Use Azure Lab Services within Teams overview](lab-services-within-teams-overview.md)
- [Manage lab user lists within Teams](how-to-manage-user-lists-within-teams.md)
- [Manage lab's VM pool within Teams](how-to-manage-vm-pool-within-teams.md)
- [Create and manage lab schedules within Teams](how-to-create-schedules-within-teams.md)
- [Access a VM within Teams – Student view](how-to-access-vm-for-students-within-teams.md)

