---
title: Configure an availability group listener for SQL Server on RHEL virtual machines in Azure - Linux virtual machines | Microsoft Docs
description: Learn about setting up an availability group listener in SQL Server on RHEL virtual machines in Azure
ms.service: virtual-machines-linux
ms.subservice:
ms.topic: tutorial
author: VanMSFT
ms.author: vanto
ms.reviewer: jroth
ms.date: 03/11/2020
---
# Tutorial: Configure an availability group listener for SQL Server on RHEL virtual machines in Azure
[!INCLUDE[appliesto-sqlvm](../../includes/appliesto-sqlvm.md)]

> [!NOTE]
> The tutorial presented is in **public preview**. 
>
> We use SQL Server 2017 with RHEL 7.6 in this tutorial, but it is possible to use SQL Server 2019 in RHEL 7 or RHEL 8 to configure high availability. The commands to configure availability group resources has changed in RHEL 8, and you'll want to look at the article [Create availability group resource](/sql/linux/sql-server-linux-availability-group-cluster-rhel#create-availability-group-resource) and RHEL 8 resources for more information on the correct commands.

This tutorial will go over steps on how to create an availability group listener for your SQL Servers on RHEL virtual machines (VMs) in Azure. You will learn how to:

> [!div class="checklist"]
> - Create a load balancer in the Azure portal
> - Configure the back-end pool for the load balancer
> - Create a probe for the load balancer
> - Set the load balancing rules
> - Create the load balancer resource in the cluster
> - Create the availability group listener
> - Test connecting to the listener
> - Testing a failover

## Prerequisite

Completed [Tutorial: Configure availability groups for SQL Server on RHEL virtual machines in Azure](rhel-high-availability-stonith-tutorial.md)

## Create the load balancer in the Azure portal

The following instructions take you through steps 1 through 4 from the [Create and configure the load balancer in the Azure portal](../windows/availability-group-load-balancer-portal-configure.md#create-and-configure-the-load-balancer-in-the-azure-portal) section of the [Load balancer - Azure portal](../windows/availability-group-load-balancer-portal-configure.md) article.

### Create the load balancer

1. In the Azure portal, open the resource group that contains the SQL Server virtual machines. 

2. In the resource group, click **Add**.

3. Search for **load balancer** and then, in the search results, select **Load Balancer**, which is published by **Microsoft**.

4. On the **Load Balancer** blade, click **Create**.

5. In the **Create load balancer** dialog box, configure the load balancer as follows:

   | Setting | Value |
   | --- | --- |
   | **Name** |A text name representing the load balancer. For example, **sqlLB**. |
   | **Type** |**Internal** |
   | **Virtual network** |The default virtual network that was created should be named **VM1VNET**. |
   | **Subnet** |Select the subnet that the SQL Server instances are in. The default should be **VM1Subnet**.|
   | **IP address assignment** |**Static** |
   | **Private IP address** |Use the `virtualip` IP address that was created in the cluster. |
   | **Subscription** |Use the subscription that was used for your resource group. |
   | **Resource group** |Select the resource group that the SQL Server instances are in. |
   | **Location** |Select the Azure location that the SQL Server instances are in. |

### Configure the back-end pool
Azure calls the back-end address pool *backend pool*. In this case, the back-end pool is the addresses of the three SQL Server instances in your availability group. 

1. In your resource group, click the load balancer that you created. 

2. On **Settings**, click **Backend pools**.

3. On **Backend pools**, click **Add** to create a back-end address pool. 

4. On **Add backend pool**, under **Name**, type a name for the back-end pool.

5. Under **Associated to**, select **Virtual machine**. 

6. Select each virtual machine in the environment, and associate the appropriate IP address to each selection.

    :::image type="content" source="media/rhel-high-availability-listener-tutorial/add-backend-pool.png" alt-text="Add backend pool":::

7. Click **Add**. 

### Create a probe

The probe defines how Azure verifies which of the SQL Server instances currently owns the availability group listener. Azure probes the service based on the IP address on a port that you define when you create the probe.

1. On the load balancer **Settings** blade, click **Health probes**. 

2. On the **Health probes** blade, click **Add**.

3. Configure the probe on the **Add probe** blade. Use the following values to configure the probe:

   | Setting | Value |
   | --- | --- |
   | **Name** |A text name representing the probe. For example, **SQLAlwaysOnEndPointProbe**. |
   | **Protocol** |**TCP** |
   | **Port** |You can use any available port. For example, *59999*. |
   | **Interval** |*5* |
   | **Unhealthy threshold** |*2* |

4.  Click **OK**. 

5. Log in to all your virtual machines, and open the probe port using the following commands:

    ```bash
    sudo firewall-cmd --zone=public --add-port=59999/tcp --permanent
    sudo firewall-cmd --reload
    ```

Azure creates the probe and then uses it to test which SQL Server instance has the listener for the availability group.

### Set the load-balancing rules

The load-balancing rules configure how the load balancer routes traffic to the SQL Server instances. For this load balancer, you enable direct server return because only one of the three SQL Server instances owns the availability group listener resource at a time.

1. On the load balancer **Settings** blade, click **Load balancing rules**. 

2. On the **Load balancing rules** blade, click **Add**.

3. On the **Add load balancing rules** blade, configure the load-balancing rule. Use the following settings: 

   | Setting | Value |
   | --- | --- |
   | **Name** |A text name representing the load-balancing rules. For example, **SQLAlwaysOnEndPointListener**. |
   | **Protocol** |**TCP** |
   | **Port** |*1433* |
   | **Backend port** |*1433*. This value is ignored because this rule uses **Floating IP (direct server return)**. |
   | **Probe** |Use the name of the probe that you created for this load balancer. |
   | **Session persistence** |**None** |
   | **Idle timeout (minutes)** |*4* |
   | **Floating IP (direct server return)** |**Enabled** |

   :::image type="content" source="media/rhel-high-availability-listener-tutorial/add-load-balancing-rule.png" alt-text="Add load balancing rule":::

4. Click **OK**. 
5. Azure configures the load-balancing rule. Now the load balancer is configured to route traffic to the SQL Server instance that hosts the listener for the availability group. 

At this point, the resource group has a load balancer that connects to all SQL Server machines. The load balancer also contains an IP address for the SQL Server Always On availability group listener, so that any machine can respond to requests for the availability groups.

## Create the load balancer resource in the cluster

1. Log in to the primary virtual machine. We need to create the resource to enable the Azure load balancer probe port (59999 is used in our example). Run the following command:

    ```bash
    sudo pcs resource create azure_load_balancer azure-lb port=59999
    ```

1. Create a group that contains the `virtualip` and `azure_load_balancer` resource:

    ```bash
    sudo pcs resource group add virtualip_group azure_load_balancer virtualip
    ```

### Add constraints

1. A colocation constraint must be configured to ensure the Azure load balancer IP address and the AG resource are running on the same node. Run the following command:

    ```bash
    sudo pcs constraint colocation add azure_load_balancer ag_cluster-master INFINITY with-rsc-role=Master
    ```
1. Create an ordering constraint to ensure that the AG resource is up and running before the Azure load balancer IP address. While the colocation constraint implies an ordering constraint, this enforces it.

    ```bash
    sudo pcs constraint order promote ag_cluster-master then start azure_load_balancer
    ```

1. To verify the constraints, run the following command:

    ```bash
    sudo pcs constraint list --full
    ```

    You should see the following output:

    ```output
    Location Constraints:
    Ordering Constraints:
      promote ag_cluster-master then start virtualip (kind:Mandatory) (id:order-ag_cluster-master-virtualip-mandatory)
      promote ag_cluster-master then start azure_load_balancer (kind:Mandatory) (id:order-ag_cluster-master-azure_load_balancer-mandatory)
    Colocation Constraints:
      virtualip with ag_cluster-master (score:INFINITY) (with-rsc-role:Master) (id:colocation-virtualip-ag_cluster-master-INFINITY)
      azure_load_balancer with ag_cluster-master (score:INFINITY) (with-rsc-role:Master) (id:colocation-azure_load_balancer-ag_cluster-master-INFINITY)
    Ticket Constraints:
    ```

## Create the availability group listener

1. On the primary node, run the following command in SQLCMD or SSMS:

    - Replace the IP address used below with the `virtualip` IP address.

    ```sql
    ALTER AVAILABILITY
    GROUP [ag1] ADD LISTENER 'ag1-listener' (
            WITH IP(('10.0.0.7'    ,'255.255.255.0'))
                ,PORT = 1433
            );
    GO
    ```

1. Log in to each VM node. Use the following command to open the hosts file and set up host name resolution for the `ag1-listener` on each machine.

    ```
    sudo vi /etc/hosts
    ```

    In the **vi** editor, enter `i` to insert text, and on a blank line, add the IP of the `ag1-listener`. Then add `ag1-listener` after a space next to the IP.

    ```output
    <IP of ag1-listener> ag1-listener
    ```

    To exit the **vi** editor, first hit the **Esc** key, and then enter the command `:wq` to write the file and quit. Do this on each node.

## Test the listener and a failover

### Test logging in to SQL Server using the availability group listener

1. Use SQLCMD to log in to the primary node of SQL Server using the availability group listener name:

    - Use a login that was previously created and replace `<YourPassword>` with the correct password. The example below uses the `sa` login that was created with the SQL Server.

    ```bash
    sqlcmd -S ag1-listener -U sa -P <YourPassword>
    ```

1. Check the name of the server that you are connected to. Run the following command in SQLCMD:

    ```sql
    SELECT @@SERVERNAME
    ```

    Your output should show the current primary node. This should be `VM1` if you have never tested a failover.

    Exit the SQL Server session by typing the `exit` command.

### Test a failover

1. Run the following command to manually fail over the primary replica to `<VM2>` or another replica. Replace `<VM2>` with the value of your server name.

    ```bash
    sudo pcs resource move ag_cluster-master <VM2> --master
    ```

1. If you check your constraints, you'll see that another constraint was added because of the manual failover:

    ```bash
    sudo pcs constraint list --full
    ```

    You will see that a constraint with ID `cli-prefer-ag_cluster-master` was added.

1. Remove the constraint with ID `cli-prefer-ag_cluster-master` using the following command:

    ```bash
    sudo pcs constraint remove cli-prefer-ag_cluster-master
    ```

1. Check your cluster resources using the command `sudo pcs resource`, and you should see that the primary instance is now `<VM2>`.

    ```output
    [<username>@<VM1> ~]$ sudo pcs resource
    Master/Slave Set: ag_cluster-master [ag_cluster]
        Masters: [ <VM2> ]
        Slaves: [ <VM1> <VM3> ]
    Resource Group: virtualip_group
        azure_load_balancer        (ocf::heartbeat:azure-lb):      Started <VM2>
        virtualip  (ocf::heartbeat:IPaddr2):       Started <VM2>
    ```

1. Use SQLCMD to log in to your primary replica using the listener name:

    - Use a login that was previously created and replace `<YourPassword>` with the correct password. The example below uses the `sa` login that was created with the SQL Server.

    ```bash
    sqlcmd -S ag1-listener -U sa -P <YourPassword>
     ```

1. Check the server that you are connected to. Run the following command in SQLCMD:

    ```sql
    SELECT @@SERVERNAME
    ```

    You should see that you are now connected to the VM that you failed-over to.

## Next steps

For more information on load balancers in Azure, see:

> [!div class="nextstepaction"]
> [Configure a load balance for an availability group on SQL Server on Azure VMs](../windows/availability-group-load-balancer-portal-configure.md)
