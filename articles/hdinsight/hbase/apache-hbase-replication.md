---
title: HBase cluster replication in virtual networks - Azure HDInsight
description: Learn how to set up HBase replication from one HDInsight version to another for load balancing, high availability, zero-downtime migration and updates, and disaster recovery.
ms.service: hdinsight
ms.custom: hdinsightactive
ms.topic: how-to
ms.date: 06/14/2023
---

# Set up Apache HBase cluster replication in Azure virtual networks

Learn how to set up [Apache HBase](https://hbase.apache.org/) replication within a virtual network, or between two virtual networks in Azure.

Cluster replication uses a source-push methodology. An HBase cluster can be a source or a destination, or it can fulfill both roles at once. Replication is asynchronous. The goal of replication is eventual consistency. When the source receives an edit to a column family when replication is enabled, the edit is propagated to all destination clusters. When data replicated from one cluster to another, the source cluster and all clusters that have already consumed the data tracked, to prevent replication loops.

In this article, you set up a source-destination replication. For other cluster topologies, see the [Apache HBase reference guide](https://hbase.apache.org/book.html#_cluster_replication).

The following are HBase replication usage cases for a single virtual network:

* Load balancing. For example, you can run scans or MapReduce jobs on the destination cluster, and ingest data on the source cluster.
* Adding high availability.
* Migrating data from one HBase cluster to another.
* Upgrading an Azure HDInsight cluster from one version to another.

The following are HBase replication usage cases for two virtual networks:

* Setting up disaster recovery.
* Load balancing and partitioning the application.
* Adding high availability.

You can replicate clusters by using [script action](../hdinsight-hadoop-customize-cluster-linux.md) scripts from [GitHub](https://github.com/Azure/hbase-utils/tree/master/replication).

## Prerequisites
Before you begin this article, you must have an Azure subscription. See [Get an Azure free trial](https://azure.microsoft.com/documentation/videos/get-azure-free-trial-for-testing-hadoop-in-hdinsight/).

## Set up the environments

You have three configuration options:

- Two Apache HBase clusters in one Azure virtual network.
- Two Apache HBase clusters in two different virtual networks in the same region.
- Two Apache HBase clusters in two different virtual networks in two different regions (geo-replication).

This article covers the geo-replication scenario.

To help you set up the environments, we have created some [Azure Resource Manager templates](../../azure-resource-manager/management/overview.md). If you prefer to set up the environments by using other methods, see:

- [Create Apache Hadoop clusters in HDInsight](../hdinsight-hadoop-provision-linux-clusters.md)
- [Create Apache HBase clusters in Azure Virtual Network](apache-hbase-provision-vnet.md)

### Set up two virtual networks in two different regions

To use a template that creates two virtual networks in two different regions and the VPN connection between the VNets, select the following **Deploy to Azure** button.

<a href="https://portal.azure.com/#create/Microsoft.Template/uri/https%3A%2F%2Fhditutorialdata.blob.core.windows.net%2Fhbaseha%2Fazuredeploy.json" target="_blank"><img src="./media/apache-hbase-replication/hdi-deploy-to-azure1.png" alt="Deploy to Azure button for new cluster"></a>

Some of the hard-coded values in the template:

**VNet 1**

| Property | Value |
|----------|-------|
| Location | West US |
| VNet name | &lt;ClusterNamePrevix>-vnet1 |
| Address space prefix | 10.1.0.0/16 |
| Subnet name | subnet 1 |
| Subnet prefix | 10.1.0.0/24 |
| Subnet (gateway) name | GatewaySubnet (can't be changed) |
| Subnet (gateway) prefix | 10.1.255.0/27 |
| Gateway name | vnet1gw |
| Gateway type | Vpn |
| Gateway VPN type | RouteBased |
| Gateway SKU | Basic |
| Gateway IP | vnet1gwip |

**VNet 2**

| Property | Value |
|----------|-------|
| Location | East US |
| VNet name | &lt;ClusterNamePrevix>-vnet2 |
| Address space prefix | 10.2.0.0/16 |
| Subnet name | subnet 1 |
| Subnet prefix | 10.2.0.0/24 |
| Subnet (gateway) name | GatewaySubnet (can't be changed) |
| Subnet (gateway) prefix | 10.2.255.0/27 |
| Gateway name | vnet2gw |
| Gateway type | Vpn |
| Gateway VPN type | RouteBased |
| Gateway SKU | Basic |
| Gateway IP | vnet1gwip |

Alternatively, follow below steps to setup two different vnets and VMs manually
1. [Create Two VNET (Virtual Network)](../../virtual-network/quick-create-portal.md) in different Region
2. Enable [Peering in both the VNET](../../virtual-network/virtual-network-peering-overview.md). Go to **Virtual network** created in above steps then click on **peering** and add peering link of another region. Do it for both the virtual network. 
3. [Create the latest version of the UBUNTU](../../virtual-machines/linux/quick-create-portal.md#create-virtual-machine) in each VNET. 

## Setup DNS

In the last section, the template creates an Ubuntu virtual machine in each of the two virtual networks.  In this section, you install Bind on the two DNS virtual machines, and then configure the DNS forwarding on the two virtual machines.

To install Bind, yon need to find the public IP address of the two DNS virtual machines.

1. Open the [Azure portal](https://portal.azure.com).
2. Open the DNS virtual machine by selecting **Resources groups > [resource group name] > [vnet1DNS]**.  The resource group name is the one you create in the last procedure. The default DNS virtual machine names are *vnet1DNS* and *vnet2NDS*.
3. Select **Properties** to open the properties page of the virtual network.
4. Write down the **Public IP address**, and also verify the **Private IP address**.  The private IP address shall be **10.1.0.4** for vnet1DNS and **10.2.0.4** for vnet2DNS.  
5. Change the DNS Servers for both virtual networks to use Default (Azure-Provided) DNS servers to allow inbound and outbound access to download packages to install Bind in the following steps.

To install Bind, use the following procedure:

1. Use SSH to connect to the __public IP address__ of the DNS virtual machine. The following example connects to a virtual machine at 40.68.254.142:

    ```bash
    ssh sshuser@40.68.254.142
    ```

    Replace `sshuser` with the SSH user account you specified when creating the DNS virtual machine.

    > [!NOTE]  
	> There are a variety of ways to obtain the `ssh` utility. On Linux, Unix, and macOS, it's provided as part of the operating system. If you are using Windows, consider one of the following options:
    >
    > * [Azure Cloud Shell](../../cloud-shell/quickstart.md)
    > * [Bash on Ubuntu on Windows 10](/windows/wsl/about)
    > * [Git (https://git-scm.com/)](https://git-scm.com/)
    > * [OpenSSH (https://github.com/PowerShell/Win32-OpenSSH/wiki/Install-Win32-OpenSSH)](https://github.com/PowerShell/Win32-OpenSSH/wiki/Install-Win32-OpenSSH)

2. To install Bind, use the following commands from the SSH session:

    ```bash
	sudo apt-get update -y
	sudo apt-get install bind9 -y
    ```

3. Configure Bind to forward name resolution requests to your on premises DNS server. To do so, use the following text as the contents of the `/etc/bind/named.conf.options` file:

    ```
    acl goodclients {
        10.1.0.0/16; # Replace with the IP address range of the virtual network 1
        10.2.0.0/16; # Replace with the IP address range of the virtual network 2
        localhost;
        localhost;
    };
    
    options {
        directory "/var/cache/bind";
        recursion yes;
        allow-query { goodclients; };

        forwarders {
            168.63.129.16; #This is the Azure DNS server
        };

        dnssec-validation auto;

        auth-nxdomain no;    # conform to RFC1035
        listen-on-v6 { any; };
    };
    ```
    
    > [!IMPORTANT]  
    > Replace the values in the `goodclients` section with the IP address range of the two virtual networks. This section defines the addresses that this DNS server accepts requests from.

    To edit this file, use the following command:

    ```bash
    sudo nano /etc/bind/named.conf.options
    ```

    To save the file, use __Ctrl+X__, __Y__, and then __Enter__.

4. From the SSH session, use the following command:

    ```bash
    hostname -f
    ```

    This command returns a value similar to the following text:

    ```output
    vnet1DNS.icb0d0thtw0ebifqt0g1jycdxd.ex.internal.cloudapp.net
    ```

    The `icb0d0thtw0ebifqt0g1jycdxd.ex.internal.cloudapp.net` text is the __DNS suffix__ for this virtual network. Save this value, as it's used later.

    You must also find out the DNS suffix from the other DNS server. You need it in the next step.

5. To configure Bind to resolve DNS names for resources within the virtual network, use the following text as the contents of the `/etc/bind/named.conf.local` file:

    ```
    // Replace the following with the DNS suffix for your virtual network
    zone "v5ant3az2hbe1edzthhvwwkcse.bx.internal.cloudapp.net" {
            type forward;
            forwarders {10.2.0.4;}; # The Azure recursive resolver
    };
    ```

    > [!IMPORTANT]  
    > You must replace the `v5ant3az2hbe1edzthhvwwkcse.bx.internal.cloudapp.net` with the DNS suffix of the other virtual network. And the forwarder IP is the private IP address of the DNS server in the other virtual network.

    To edit this file, use the following command:

    ```bash
    sudo nano /etc/bind/named.conf.local
    ```

    To save the file, use __Ctrl+X__, __Y__, and then __Enter__.

6. To start Bind, use the following command:

    ```bash
    sudo service bind9 restart
    ```

7. To verify that bind can resolve the names of resources in the other virtual network, use the following commands:

    ```bash
    sudo apt install dnsutils
    nslookup vnet2dns.v5ant3az2hbe1edzthhvwwkcse.bx.internal.cloudapp.net
    ```

    > [!IMPORTANT]  
    > Replace `vnet2dns.v5ant3az2hbe1edzthhvwwkcse.bx.internal.cloudapp.net` with the fully qualified domain name (FQDN) of the DNS virtual machine in the other network.
    >
    > Replace `10.2.0.4` with the __internal IP address__ of your custom DNS server in the other virtual network.

    The response appears similar to the following text:

    ```output
    Server:         10.2.0.4
    Address:        10.2.0.4#53
    
    Non-authoritative answer:
    Name:   vnet2dns.v5ant3az2hbe1edzthhvwwkcse.bx.internal.cloudapp.net
    Address: 10.2.0.4
    ```

    Until now, you can't look up the IP address from the other network without specified DNS server IP address.

### Configure the virtual network to use the custom DNS server

To configure the virtual network to use the custom DNS server instead of the Azure recursive resolver, use the following steps:

1. In the [Azure portal](https://portal.azure.com), select the virtual network, and then select __DNS Servers__.

2. Select __Custom__, and enter the __internal IP address__ of the custom DNS server. Finally, select __Save__.

6. Open the DNS server virtual machine in vnet1, and click **Restart**.  You must restart all the virtual machines in the virtual network to make the DNS configuration to take effect.
7. Repeat steps configure the custom DNS server for vnet2.

To test the DNS configuration, you can connect to the two DNS virtual machines using SSH, and ping the DNS server of the other virtual network by using its host name. If it doesn't work, use the following command to check DNS status:

```bash
sudo service bind9 status
```

## Create Apache HBase clusters

Create an [Apache HBase](https://hbase.apache.org/) cluster in each of the two virtual networks with the following configuration:

- **Resource group name**: use the same resource group name as you created the virtual networks.
- **Cluster type**: HBase
- **Version**: HBase 1.1.2 (HDI 3.6)
- **Location**: Use the same location as the virtual network.  By default, vnet1 is *West US*, and vnet2 is *East US*.
- **Storage**: Create a new storage account for the cluster.
- **Virtual network** (from Advanced settings on the portal): Select vnet1 you created in the last procedure.
- **Subnet**: The default name used in the template is **subnet1**.

To ensure the environment is configured correctly, you must be able to ping the headnode's FQDN between the two clusters.

## Load test data

When you replicate a cluster, you must specify the tables that you want to replicate. In this section, you load some data into the source cluster. In the next section, you'll enable replication between the two clusters.

To create a **Contacts** table and insert some data in the table, follow the instructions at [Apache HBase tutorial: Get started using Apache HBase in HDInsight](apache-hbase-tutorial-get-started-linux.md).

> [!NOTE]
> If you want to replicate tables from a custom namespace, you need to ensure that the appropriate custom namespaces are defined on the destination cluster as well.
>

## Enable replication

The following steps describe how to call the script action script from the Azure portal. For information about running a script action by using Azure PowerShell and the Azure Classic CLI, see [Customize HDInsight clusters by using script action](../hdinsight-hadoop-customize-cluster-linux.md).

**To enable HBase replication from the Azure portal**

1. Sign in to the [Azure portal](https://portal.azure.com).
2. Open the source HBase cluster.
3. In the cluster menu, select **Script Actions**.
4. At the top of the page, select **Submit New**.
5. Select or enter the following information:

   1. **Name**: Enter **Enable replication**.
   2. **Bash Script URL**: Enter **https://raw.githubusercontent.com/Azure/hbase-utils/master/replication/hdi_enable_replication.sh**.
   3. **Head**: Ensure this parameter is selected. Clear the other node types.
   4. **Parameters**: The following sample parameters enable replication for all existing tables, and then copy all data from the source cluster to the destination cluster:

    `-m hn1 -s <source hbase cluster name> -d <destination hbase cluster name> -sp <source cluster Ambari password> -dp <destination cluster Ambari password> -copydata`
    
      > [!NOTE]
      > Use hostname instead of FQDN for both the source and destination cluster DNS name.
      >
      > This walkthrough assumes hn1 as active headnode. Check your cluster to identify the active head node.

6. Select **Create**. The script can take a while to run, especially when you use the **-copydata** argument.

Required arguments:

|Name|Description|
|----|-----------|
|-s, --src-cluster | Specifies the DNS name of the source HBase cluster. For example: -s hbsrccluster, --src-cluster=hbsrccluster |
|-d, --dst-cluster | Specifies the DNS name of the destination (replica) HBase cluster. For example: -s dsthbcluster, --src-cluster=dsthbcluster |
|-sp, --src-ambari-password | Specifies the admin password for Ambari on the source HBase cluster. |
|-dp, --dst-ambari-password | Specifies the admin password for Ambari on the destination HBase cluster.|

Optional arguments:

|Name|Description|
|----|-----------|
|-su, --src-ambari-user | Specifies the admin user name for Ambari on the source HBase cluster. The default value is **admin**. |
|-du, --dst-ambari-user | Specifies the admin user name for Ambari on the destination HBase cluster. The default value is **admin**. |
|-t, --table-list | Specifies the tables to be replicated. For example: --table-list="table1;table2;table3". If you don't specify tables, all existing HBase tables are replicated.|
|-m, --machine | Specifies the head node where the script action runs. The value should be chosen based on which is the active head node. Use this option when you're running the $0 script as a script action from the HDInsight portal or Azure PowerShell.|
|-cp, -copydata | Enables the migration of existing data on the tables where replication is enabled. |
|-rpm, -replicate-phoenix-meta | Enables replication on Phoenix system tables. <br><br>*Use this option with caution.* We recommend that you re-create Phoenix tables on replica clusters before you use this script. |
|-h, --help | Displays usage information. |

The `print_usage()` section of the [script](https://github.com/Azure/hbase-utils/blob/master/replication/hdi_enable_replication.sh) has a detailed explanation of parameters.

After the script action is successfully deployed, you can use SSH to connect to the destination HBase cluster, and then verify that the data has been replicated.

### Replication scenarios

The following list shows you some general usage cases and their parameter settings:

- **Enable replication on all tables between the two clusters**. This scenario doesn't require copying or migrating existing data in the tables, and it doesn't use Phoenix tables. Use the following parameters:

  `-m hn1 -s <source hbase cluster name> -d <destination hbase cluster name> -sp <source cluster Ambari password> -dp <destination cluster Ambari password>`

- **Enable replication on specific tables**. To enable replication on table1, table2, and table3, use the following parameters:

  `-m hn1 -s <source hbase cluster name> -d <destination hbase cluster name> -sp <source cluster Ambari password> -dp <destination cluster Ambari password> -t "table1;table2;table3"`

- **Enable replication on specific tables, and copy the existing data**. To enable replication on table1, table2, and table3, use the following parameters:

  `-m hn1 -s <source hbase cluster name> -d <destination hbase cluster name> -sp <source cluster Ambari password> -dp <destination cluster Ambari password> -t "table1;table2;table3" -copydata`

- **Enable replication on all tables, and replicate Phoenix metadata from source to destination**. Phoenix metadata replication isn't perfect. Use it with caution. Use the following parameters:

  `-m hn1 -s <source hbase cluster name> -d <destination hbase cluster name> -sp <source cluster Ambari password> -dp <destination cluster Ambari password> -t "table1;table2;table3" -replicate-phoenix-meta`

### Set up replication between ESP clusters

**Prerequisites**
1. Both ESP clusters should be there in the same realm (domain). Check `/etc/krb5.conf` file default realm property to confirm. 
1. Common user should be there who has read and write access to both the clusters
   1. For example, if both clusters have same cluster admin user (For example, `admin@abc.example.com`), that user can be used to run the replication script.
   1. If both the clusters using same user group, you can add a new user or use existing user from the group.
   1. If both the clusters using different user group, you can add a new user to both use existing user from the groups.
 
**Steps to Execute Replication script**

> [!NOTE]
> Perform the following steps only if DNS is unable to resolve hostname correctly of destination cluster. 
> 1. Copy sink cluster hosts IP & hostname mapping in source cluster nodes /etc/hosts file. 
> 1. Copy head node, worker node and ZooKeeper nodes host and IP mapping from /etc/hosts file of destination(sink) cluster.
> 1. Add copied entries source cluster /etc/hosts file. These entries should be added to head nodes, worker nodes and ZooKeeper nodes.

**Step 1:**
Create keytab file for the user using `ktutil`.
`$ ktutil`
1. `addent -password -p admin@ABC.EXAMPLE.COM -k 1 -e RC4-HMAC`
1. Ask for password to authenticate, provide user password 
1. `wkt /etc/security/keytabs/admin.keytab`

> [!NOTE] 
> Make sure the keytab file is stored in `/etc/security.keytabs/` folder in the `<username>.keytab` format.

**Step 2:** 
Run script action with `-ku` option 
1. Provide `-ku <username>` on ESP clusters.
	
|Name|Description|
|----|-----------|
|`-ku, --krb-user`  | For ESP clusters, Common Kerberos user, who can authenticate both source and destination clusters|

## Copy and migrate data

There are two separate script action scripts available for copying or migrating data after replication is enabled:

- [Script for small tables](https://raw.githubusercontent.com/Azure/hbase-utils/master/replication/hdi_copy_table.sh) (tables that are a few gigabytes in size, and overall copy is expected to finish in less than one hour)

- [Script for large tables](https://raw.githubusercontent.com/Azure/hbase-utils/master/replication/nohup_hdi_copy_table.sh) (tables that are expected to take longer than one hour to copy)

You can follow the same procedure that's described in [Enable replication](#enable-replication) to call the script action. Use the following parameters:

`-m hn1 -t <table1:start_timestamp:end_timestamp;table2:start_timestamp:end_timestamp;...> -p <replication_peer> [-everythingTillNow]`

The `print_usage()` section of the [script](https://github.com/Azure/hbase-utils/blob/master/replication/hdi_copy_table.sh) has a detailed description of parameters.

### Scenarios

- **Copy specific tables (test1, test2, and test3) for all rows edited until now (current time stamp)**:

  `-m hn1 -t "test1::;test2::;test3::" -p "<zookeepername1>;<zookeepername2>;<zookeepername3>:2181:/hbase-unsecure" -everythingTillNow`

  Or:

  `-m hn1 -t "test1::;test2::;test3::" --replication-peer="<zookeepername1>;<zookeepername2>;<zookeepername3>:2181:/hbase-unsecure" -everythingTillNow`

- **Copy specific tables with a specified time range**:

  `-m hn1 -t "table1:0:452256397;table2:14141444:452256397" -p "<zookeepername1>;<zookeepername2>;<zookeepername3>:2181:/hbase-unsecure"`

## Disable replication

To disable replication, use another script action script from [GitHub](https://raw.githubusercontent.com/Azure/hbase-utils/master/replication/hdi_disable_replication.sh). You can follow the same procedure that's described in [Enable replication](#enable-replication) to call the script action. Use the following parameters:

`-m hn1 -s <source hbase cluster name> -sp <source cluster Ambari password> <-all|-t "table1;table2;...">`

The `print_usage()` section of the [script](https://raw.githubusercontent.com/Azure/hbase-utils/master/replication/hdi_disable_replication.sh) has a detailed explanation of parameters.

### Scenarios

- **Disable replication on all tables**:

  `-m hn1 -s <source hbase cluster name> -sp Mypassword\!789 -all`

  or

  `--src-cluster=<source hbase cluster name> --dst-cluster=<destination hbase cluster name> --src-ambari-user=<source cluster Ambari user name> --src-ambari-password=<source cluster Ambari password>`

- **Disable replication on specified tables (table1, table2, and table3)**:

  `-m hn1 -s <source hbase cluster name> -sp <source cluster Ambari password> -t "table1;table2;table3"`

> [!NOTE]
> If you intend to delete the destination cluster, make sure you remove it from the peer list of the source cluster. This can be done by running the command remove_peer '1' at the hbase shell on the source cluster. Failing this the source cluster may not function properly.
>

## Next steps

In this article, you learned how to set up Apache HBase replication within a virtual network, or between two virtual networks. To learn more about HDInsight and Apache HBase, see these articles:

* [Get started with Apache HBase in HDInsight](./apache-hbase-tutorial-get-started-linux.md)
* [HDInsight Apache HBase overview](./apache-hbase-overview.md)
* [Create Apache HBase clusters in Azure Virtual Network](./apache-hbase-provision-vnet.md)
