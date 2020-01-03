---
author: alkohli
ms.service: storsimple
ms.topic: include
ms.date: 10/26/2018
ms.author: alkohli
---
#### To stop and start a cloud appliance

1. To stop a cloud appliance, go to the VM for your cloud appliance.
    ![StorSimple Cloud Appliance Virtual Machine](./media/storsimple-8000-stop-restart-cloud-appliance/sca-stop-restart1.png)

2. From the command bar, click **Stop**.

    ![StorSimple Cloud Appliance Virtual Machine](./media/storsimple-8000-stop-restart-cloud-appliance/sca-stop-restart2.png)

3. When prompted for confirmation, click **Yes**.

    ![StorSimple Cloud Appliance Virtual Machine](./media/storsimple-8000-stop-restart-cloud-appliance/sca-stop-restart3.png)

4. When you stop a VM, it gets deallocated. While the cloud appliance is stopping, its status is **Deallocating**. After the cloud appliance is stopped, its status is **Stopped (deallocated)**.

    ![StorSimple Cloud Appliance Virtual Machine](./media/storsimple-8000-stop-restart-cloud-appliance/sca-stop-restart4.png)

5. Once a VM is stopped, click **Start** (button becomes available) to start the VM. After the cloud appliance has started up, its status is **Started**.

    ![StorSimple Cloud Appliance Virtual Machine](./media/storsimple-8000-stop-restart-cloud-appliance/sca-stop-restart5.png)

Use the following cmdlets to stop and start a cloud appliance.

`Stop-AzureVM -ServiceName "MyStorSimpleservice1" -Name "MyStorSimpleDevice"`

`Start-AzureVM -ServiceName "MyStorSimpleservice1" -Name "MyStorSimpleDevice"`

#### To restart a cloud appliance

To restart a cloud appliance, go to the VM for your cloud appliance. From the command bar, click **Restart**. When prompted, confirm the restart. When the cloud appliance is ready for you to use, its status is **Running**.

![StorSimple Cloud Appliance Virtual Machine](./media/storsimple-8000-stop-restart-cloud-appliance/sca-stop-restart6.png)

Use the following cmdlet to restart a cloud appliance.

`Restart-AzureVM -ServiceName "MyStorSimpleservice1" -Name "MyStorSimpleDevice"`

