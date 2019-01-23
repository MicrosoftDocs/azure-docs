---
author: cynthn
ms.service: virtual-machines
ms.topic: include
ms.date: 10/26/2018
ms.author: cynthn
---
In this step, you create a firewall rule to open the probe port for the load-balanced endpoint (59999, as specified earlier) and another rule to open the availability group listener port. Because you created the load-balanced endpoint on the VMs that contain availability group replicas, you need to open the probe port and the listener port on the respective VMs.

1. On VMs that host replicas, start **Windows Firewall with Advanced Security**.

2. Right-click **Inbound Rules**, and then click **New Rule**.

3. On the **Rule Type** page, select **Port**, and then click **Next**.

4. On the **Protocol and Ports** page, select **TCP**, type **59999** in the **Specific local ports** box, and then click **Next**.

5. On the **Action** page, keep **Allow the connection** selected, and then click **Next**.

6. On the **Profile** page, accept the default settings, and then click **Next**.

7. On the **Name** page, in the **Name** text box, specify a rule name, such as **Always On Listener Probe Port**, and then click **Finish**.

8. Repeat the preceding steps for the availability group listener port (as specified earlier in the $EndpointPort parameter of the script), and then specify an appropriate rule name, such as **Always On Listener Port**.

