#### To stop and start a virtual device
To stop a virtual device, click its name, and then click **Shutdown**. While the virtual device is shutting down, its status is **Stopping**. After the virtual device is stopped, its status is **Stopped**.

Use the following cmdlets to stop and start a virtual device.

`Stop-AzureVM -ServiceName "MyStorSimpleservice1" -Name "MyStorSimpleDevice"`


`Start-AzureVM -ServiceName "MyStorSimpleservice1" -Name "MyStorSimpleDevice"`
    
#### To restart a virtual device

When a virtual device is running and you want to restart it, click its name, and then click **Restart**. While the virtual device is restarting, its status is **Restarting**. When the virtual device is ready for you to use, its status is **Running**.

Use the following cmdlet to restart a virtual device.

`Restart-AzureVM -ServiceName "MyStorSimpleservice1" -Name "MyStorSimpleDevice"`




