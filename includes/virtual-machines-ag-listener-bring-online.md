---
author: cynthn
ms.service: virtual-machines
ms.topic: include
ms.date: 10/26/2018
ms.author: cynthn
---
1. In Failover Cluster Manager, expand **Roles**, and then highlight your availability group.  

2. On the **Resources** tab, right-click the listener name, and then click **Properties**.

3. Click the **Dependencies** tab. If multiple resources are listed, verify that the IP addresses have OR, not AND, dependencies.  

4. Click **OK**.

5. Right-click the listener name, and then click **Bring Online**.

6. After the listener is online, on the **Resources** tab, right-click the availability group, and then click **Properties**.
   
    ![Configure the availability group resource](./media/virtual-machines-sql-server-configure-alwayson-availability-group-listener/IC678772.gif)

7. Create a dependency on the listener name resource (not the IP address resources name), and then click **OK**.
   
    ![Add dependency on the listener name](./media/virtual-machines-sql-server-configure-alwayson-availability-group-listener/IC678773.gif)

8. Start SQL Server Management Studio, and then connect to the primary replica.

9. Go to **AlwaysOn High Availability** > **Availability Groups** > **\<AvailabilityGroupName\>** > **Availability Group Listeners**.  
    The listener name that you created in Failover Cluster Manager should be displayed.

10. Right-click the listener name, and then click **Properties**.

11. In the **Port** box, specify the port number for the availability group listener by using the $EndpointPort that you used earlier (in this tutorial, 1433 was the default), and then click **OK**.

