---
title: Manage Azure Lab Services user lists from Canvas
description: Learn how to manage Azure Lab Services user lists from Canvas. 
ms.topic: how-to
ms.date: 11/08/2021
---

# Manage Lab Services user lists from Canvas

When a [lab is created within Canvas](how-to-get-started-create-lab-within-canvas.md), the lab user list is automatically populated and synced with the course membership. An automatic sync is triggered every 24 hours.  Educators can also manually sync the user list when needed.

## Sync users

Educators can use the **Sync** button to trigger a manual sync once the course membership is updated.

:::image type="content" source="./media/how-to-manage-users-with-teams/sync-users.png" alt-text="Sync users":::

Once the automatic or manual sync is complete the following is true depending on whether the lab has been [published](tutorial-setup-lab.md#publish-the-lab).

If the lab has *not* been published at least once:

- Users will be added or deleted from the lab user list as per changes to the course membership.

If the lab has been published at least once:

- New VMs will be created if there are any new additions to the course.
- VM will be deleted if  any student has been deleted from the course
- Lab capacity will be automatically updated as need.

## Next steps

Once the template VM is configured and when the educator selects to publish the template, number of VMs equivalent to the number of users in the lab’s user list will be created. Once the lab is published and VMs are created, users will be automatically registered to the lab and VMs will be assigned to them on their first login to Azure Lab Services that is, when they first access the tab having **Azure Lab Services** app.

To manage VM pools, see [Manage a VM pool in Lab Services from Canvas](how-to-manage-vm-pool-within-canvas.md).

### Also review

See the following articles:

- [Use Azure Lab Services within Canvas overview](lab-services-within-canvas-overview.md)
- [Get started and create a Lab Services lab from Canvas](how-to-get-started-create-lab-within-canvas.md)
- [Create Lab Services schedules from Canvas](how-to-create-schedules-within-canvas.md)
- [Access a VM (student view) in Lab Services from Canvas](how-to-access-vm-for-students-within-canvas.md)
