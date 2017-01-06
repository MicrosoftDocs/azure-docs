The Availability Group listener is an IP address and network name that the SQL Server Availability Group listens on. To create the Availability Group listener, do the following steps:

1. [Get the name of the cluster network resource](#getnet).

1. [Add the client access point](#addcap).

1. [Configure the IP resource for the Availability Group](#congroup).

1. [Make the Availability Group resource dependent on the listener resource name](#listname).

1. [Set the cluster parameters in PowerShell](#setparam).

The following sections provide detailed instructions for each of these steps. 

#### <a name="getnet">Get the name of the cluster network resource</a> 

1. Use RDP to connect to the Azure virtual machine that hosts the primary replica. 

1. Open Failover Cluster Manager.

1. Select the **Networks** node, and note the cluster network name. Use this name in the `$ClusterNetworkName` variable in the PowerShell script.

   In the following picture the cluster network name is **Cluster Network 1**:

   ![Cluster Network Name](./media/virtual-machines-ag-listener-configure/90-clusternetworkname.png)

#### <a name="addcap">Add the client access point</a>

1. Expand the cluster name, and then click **Roles**.

1. In the **Roles** pane, right-click the Availability Group name and then select **Add Resource** > **Client Access Point**.

   ![Client Access Point](./media/virtual-machines-ag-listener-configure/92-addclientaccesspoint.png)

1. In the **Name** box, create a name for this new listener. 

   The name for the new listener is the network name that applications use to connect to databases in the SQL Server Availability Group.
   
   To finish creating the listener, click **Next** twice, and then click **Finish**. Do not bring the listener or resource online at this point.
   
#### <a name="congroup">Configure the IP resource for the Availability Group</a>

1. Click the **Resources** tab, then expand the Client Access Point you created. The client access point is offline.

   ![Client Access Point](./media/virtual-machines-ag-listener-configure/94-newclientaccesspoint.png) 

1. Right-click the IP resource and click properties. Note the name of the IP address. Use this name in the `$IPResourceName` variable in the PowerShell script.

1. Under **IP Address**, click **Static IP Address**. Set the IP address to the same address that you used when you set the load balancer address on the Azure portal.

   ![IP Resource](./media/virtual-machines-ag-listener-configure/96-ipresource.png) 

<!-----------------------I don't see this option on server 2016
1. Disable NetBIOS for this address and click **OK**. Repeat this step for each IP resource if your solution spans multiple Azure VNets. 
------------------------->
#### <a name="listname">Make the Availability Group resource dependent on the listener resource</a>

1. In Failover Cluster Manager, click **Roles** and click your Availability Group. 

1. On the **Resources** tab, right-click the availability resource group under **Other Resources** and click **Properties**. 

   ![IP Resource](./media/virtual-machines-ag-listener-configure/98-dependencies.png) 

1. Click the **Dependencies** tab. Set a dependency on the listener resource name. If there are multiple resources listed, verify that the IP addresses have OR, not AND, dependencies. Click **OK**. 

   ![IP Resource](./media/virtual-machines-ag-listener-configure/98-propertiesdependencies.png) 

1. Right-click the listener name and click **Bring Online**. 

#### <a name="setparam">Set the cluster parameters in PowerShell</a>

1. Copy the following PowerShell script to one of your SQL Servers. Update the variables for your environment.     
   ```PowerShell
   $ClusterNetworkName = "<MyClusterNetworkName>" # the cluster network name (Use Get-ClusterNetwork on Windows Server 2012 of higher to find the name)
   $IPResourceName = "<IPResourceName>" # the IP Address resource name
   $ILBIP = “<n.n.n.n>” # the IP Address of the Internal Load Balancer (ILB). This is the static IP address for the load balancer you configured in the Azure portal.
   [int]$ProbePort = <nnnnn>

   Import-Module FailoverClusters

   Get-ClusterResource $IPResourceName | Set-ClusterParameter -Multiple @{"Address"="$ILBIP";"ProbePort"=$ProbePort;"SubnetMask"="255.255.255.255";"Network"="$ClusterNetworkName";"EnableDhcp"=0}
   ```

2. Set the cluster parameters by running the PowerShell script on one of the cluster nodes.  

> [!NOTE]
> If your SQL Servers are in separate regions, you need to run the PowerShell script twice. The first time, use the `$ILBIP` and `$ProbePort` from the first region. The second time, use the `$ILBIP` and `$ProbePort` from the second region. The cluster network name, and the cluster IP resource name are the same. 


