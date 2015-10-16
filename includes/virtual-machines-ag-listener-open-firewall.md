In this step, you create a firewall rule to open the probe port for the load-balanced endpoint (59999 as specified earlier), and another rule to open the availability group listener port. Since you created the load-balanced endpoint on the Azure VMs that contain availability group replicas, you need to open the probe port and the listener port on the respective Azure VMs.

1. On VMs hosting replicas, launch **Windows Firewall with Advanced Security**.

1. Right-click **Inbound Rules** and click **New Rule**.

1. In the **Rule Type** page, select **Port**, then click **Next**.

1. In the **Protocol and Ports** page, select **TCP** and type **59999** in the **Specific local ports** box. Then, click **Next**.

1. In the **Action** page, keep **Allow the connection** selected and click **Next**.

1. In the **Profile** page, accept the default settings and click **Next**.

1. In the **Name** page, specify a rule name, such as **AlwaysOn Listener Probe Port** in the **Name** text box, and click **Finish**.

1. Repeat the above steps for the availability group listener port (as specified earlier in the $EndpointPort parameter of the script) and specify an appropriate rule name, such as **AlwaysOn Listener Port**.