---
title: Delete an Azure Lab Services lab from Teams
description: Learn how to delete an Azure Lab Services lab from Teams. 
ms.topic: how-to
ms.date: 01/06/2022
---

# Delete labs within Teams

This article shows how to delete a lab from the **Azure Lab Services** app.

[!INCLUDE [preview note](./includes/lab-services-new-update-focused-article.md)]

## Prerequisites

* [Create a lab plan](tutorial-setup-lab-plan.md).
* [Create a lab within Teams](how-to-get-started-create-lab-within-teams.md).

## Delete labs

A lab created within Teams can be deleted in the [Lab Services portal](https://labs.azure.com) directly.  For more information, see [Delete a lab](manage-labs.md#delete-a-lab).

Lab deletion is also triggered when the team is deleted. If the associated team is deleted, the lab will be automatically deleted 24 hours later when the automatic user list sync is triggered.

> [!IMPORTANT]
> Deletion of the tab or uninstalling the app will not result in deletion of the lab.

If the *tab* is deleted in Teams, users can still access the lab VMs on the [Azure Lab Services portal](https://labs.azure.com).  When the team is deleted or the lab is explicitly deleted, users can no longer access their VMs through the [Azure Lab Services portal](https://labs.azure.com).

## Next steps

* [Use Azure Lab Services within Teams overview](lab-services-within-teams-overview.md)
* [Manage lab user lists within Teams](how-to-manage-user-lists-within-teams.md)
* [Manage lab's VM pool within Teams](how-to-manage-vm-pool-within-teams.md)
* [Create and manage lab schedules within Teams](how-to-create-schedules-within-teams.md)
* [Access a VM within Teams – Student view](how-to-access-vm-for-students-within-teams.md)
