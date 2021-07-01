---
author: alkohli
ms.service: storsimple
ms.topic: include
ms.date: 10/26/2018
ms.author: alkohli
---

#### To add or remove a volume

1. Go to your StorSimple device and click **Backup policy**.

2. In the tabular listing of the policies, select and click the policy that you want to modify. Right-click to invoke the context menu and then select **Add/remove volume**.

    ![Backup policy is highlighted in the left Settings pane. In Backup Policy, the only policy, mybupol1, is highlighted. Add/Remove Volume is highlighted in the context menu.](./media/storsimple-8000-add-remove-volume-backup-policy-u2/addvolbupol1.png)

3. In the **Add/remove volume** blade, select or clear the check box(es) to add or remove the volume. Multiple volumes are selected/cleared by checking or clearing the corresponding checkboxes.

    ![The myssvolsrch2 volume is selected. The volume information is highlighted, as is the Add button.](./media/storsimple-8000-add-remove-volume-backup-policy-u2/addvolbupol3.png)

    If you assign volumes from different volume containers to a backup policy, then you will need to remember to fail over those volume containers together. You will see a warning to that effect.

    ![A volume from one container is highlighted, and two volumes from another container are highlighted together.](./media/storsimple-8000-add-remove-volume-backup-policy-u2/addvolbupol2.png)

4. You are notified when the backup policy is modified. The backup policy list is also updated.

    ![In the Backup Policy list, the number of VOLUMES for policy mybupol1 is highlighted. Its value is 1.](./media/storsimple-8000-add-remove-volume-backup-policy-u2/addvolbupol6.png)




