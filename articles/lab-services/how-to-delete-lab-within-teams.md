---
title: Delete an Azure Lab Services lab from Teams
description: Learn how to delete an Azure Lab Services lab from Teams. 
ms.topic: how-to
ms.date: 04/25/2022
ms.custom: devdivchpfy22
---

# Delete labs within Teams

This article shows how to delete a lab from the **Azure Lab Services** app.

[!INCLUDE [preview note](./includes/lab-services-new-update-focused-article.md)]

## Prerequisites

* [Create a lab plan](tutorial-setup-lab-plan.md).
* [Create a lab within Teams](how-to-get-started-create-lab-within-teams.md).

## Delete labs

A lab created within Teams can be deleted in the [Lab Services portal](https://labs.azure.com) directly. For more information, see [Delete a lab](manage-labs.md#delete-a-lab).

Lab deletion is also triggered by the team deletion. The lab will be automatically deleted after 24 hours of the team deletion when the automatic user list sync is triggered.

> [!IMPORTANT]
> Deletion of the tab or uninstalling the app will not result in deletion of the lab.

If the *tab* is deleted in Teams, users can still access the lab VMs on the Lab Services web portal: [https://labs.azure.com](https://labs.azure.com). However, users can't access their VMs through the Lab Services web portal if the team or the lab is deleted explicitly.

## Next steps

* As an educator, [create a lab within Teams](how-to-get-started-create-lab-within-teams.md).
* As an educator, [manage the VM pool within Teams](how-to-manage-vm-pool-within-teams.md).
* As an educator, [create and manage schedules within Teams](how-to-create-schedules-within-teams.md).
* As an educator, [manage lab user lists from Teams](how-to-manage-user-lists-within-teams.md).
* As student, [access a VM within Teams](how-to-access-vm-for-students-within-teams.md).
