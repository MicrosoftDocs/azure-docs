In this step, you manually create the availability group listener in Failover Cluster Manager and SQL Server Management Studio (SSMS).

1. Open Failover Cluster Manager from the node hosting the primary replica.

1. Select the **Networks** node, and note the cluster network name. This name will be used in the $ClusterNetworkName variable in the PowerShell script.

1. Expand the cluster name, and then click **Roles**.

1. In the **Roles** pane, right-click the availability group name and then select **Add Resource** > **Client Access Point**.

	![Add Client Access Point for Availability Group](./media/virtual-machines-sql-server-configure-alwayson-availability-group-listener/IC678769.gif)

1. In the **Name** box, create a name for this new listener, then click **Next** twice, and then click **Finish**. Do not bring the listener or resource online at this point.

1. Click the **Resources** tab, then expand the Client Access Point you just created. You will see the **IP Address** resource for each of the cluster networks in your cluster. If this is an Azure-only solution, you will only see one IP address resource.

1. If you are configuring a hybrid solution, continue with this step. If you are configuring an Azure only solution, skip to the next step. 
	 - Right-click the IP Address resource that corresponds to your on-premises subnet, then select **Properties**. Note the IP Address Name and network name.
	 - Select **Static IP Address**, assign an unused IP address and then click **OK**.

1. Right-click the IP Address resource that corresponds to your Azure subnet and then select Properties.
	>[AZURE.NOTE] If the listener later fails to come online due to a conflicting IP address selected by DHCP, you can configure a valid static IP Address in this properties window.

1. In the same **IP Address** properties window, change the **IP Address Name**. This IP address name will be used in the **$IPResourceName** variable of the PowerShell script. Repeat this step for each IP resource if your solution spans multiple Azure VNets.