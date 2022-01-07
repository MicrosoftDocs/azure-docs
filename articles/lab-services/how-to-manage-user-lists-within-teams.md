---
title: Manage Azure Lab Services user lists from Teams
description: Learn how to manage Azure Lab Services user lists from Teams. 
ms.topic: how-to
ms.date: 01/04/2022
---

# Manage Lab Services user lists from Teams

When a lab is [created within Teams](how-to-get-started-create-lab-within-teams.md)), the lab user list is automatically populated and synced with the team membership. Everyone on the team, including owners, members, and guests will be automatically added to the lab user list. Azure lab Services maintains a sync with the team membership and an automatic sync is triggered every 24 hours.

## Sync users

Educators can use the **Sync** button to trigger a manual sync once the team membership is updated.

> [!div class="mx-imgBorder"]
> :::image type="content" source="./media/how-to-manage-users-with-teams/sync-users.png" alt-text="Sync users":::

Users will be added or deleted from the lab user list as per changes to the team membership when the sync operation has completed.  

If the lab has been published, the lab capacity will be automatically updated.

    * If there are any new additions to the team, new VMs will be created.
    * If any user has been deleted from the team, the associated VM will be deleted as well.

## Next steps

To publish the template VM, go to the Teams Lab Services window, select **Template** tab -> **...** -> **Publish**.

Also review:

- [Manage a VM pool in Lab Services from Teams](how-to-manage-vm-pool-within-teams.md).
- [Create Lab Services schedules from Teams](how-to-create-schedules-within-teams.md)
- [Access a VM (student view) in Lab Services from Teams](how-to-access-vm-for-students-within-teams.md)
