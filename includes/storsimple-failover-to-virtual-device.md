#### To restore your physical device to the StorSimple virtual device

1. Verify that the volume container you want to fail over has associated cloud snapshots.

2. Open the **Device** page, and then click the **Volume Containers** tab.

3. Select a volume container that you would like to fail over to the virtual device. Click the volume container to display the list of volumes within the container. Select a volume and click **Take Offline** to take the volume offline. Repeat this process for all the volumes in the volume container.

4. Repeat the previous step for all the volume containers you want to fail over to the virtual device.

5. On the **Device** page, select the device that you need to fail over, and then click **Failover** to open the **Device Failover** wizard.

6. In **Choose volume container to failover**, select the volume containers you would like to fail over. To be displayed in this list, the volume container must contain a cloud snapshot and be offline. If a volume container that you expected to see is not present, cancel the wizard and verify that it is offline.

7. On the next page, in **Choose a target device for the volumes** in the selected containers, select the virtual device from the drop-down list of available devices. Only the devices that have the available capacity are displayed on the list. 

8. Review all the failover settings on the **Confirm failover** page. If they are correct, click the check icon.

The failover process will begin. When the failover is finished, go to the Devices page and select the virtual device that was used as the target for the failover process. Go to the Volume Containers page. All the volume containers, along with the volumes from the old device should appear.