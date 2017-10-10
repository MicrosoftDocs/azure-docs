---
title: Run a MariaDB (MySQL) cluster on Azure | Microsoft Docs
description: Create a MariaDB + Galera MySQL cluster on Azure virtual machines
services: virtual-machines-linux
documentationcenter: ''
author: sabbour
manager: timlt
editor: ''
tags: azure-service-management

ms.assetid: d0d21937-7aac-4222-8255-2fdc4f2ea65b
ms.service: virtual-machines-linux
ms.devlang: multiple
ms.topic: article
ms.tgt_pltfrm: vm-linux
ms.workload: infrastructure-services
ms.date: 04/15/2015
ms.author: asabbour

---
# MariaDB (MySQL) cluster: Azure tutorial
> [!IMPORTANT]
> Azure has two different deployment models for creating and working with resources: [Azure Resource Manager](../../../resource-manager-deployment-model.md) and classic. This article covers the classic deployment model. Microsoft recommends that most new deployments use the Azure Resource Manager model.

> [!NOTE]
> MariaDB Enterprise cluster is now available in the Azure Marketplace. The new offering will automatically deploy a MariaDB Galera cluster on Azure Resource Manager. You should use the new offering from [Azure Marketplace](https://azure.microsoft.com/en-us/marketplace/partners/mariadb/cluster-maxscale/).
>
>

This article shows you how to create a multi-Master [Galera](http://galeracluster.com/products/) cluster of [MariaDBs](https://mariadb.org/en/about/) (a robust, scalable, and reliable drop-in replacement for MySQL) to work in a highly available environment on Azure virtual machines.

## Architecture overview
This article describes how to complete the following steps:

- Create a three-node cluster.
- Separate the data disks from the OS disk.
- Create the data disks in RAID-0/striped setting to increase IOPS.
- Use Azure Load Balancer to balance the load for the three nodes.
- To minimize repetitive work, create a VM image that contains MariaDB + Galera and use it to create the other cluster VMs.

![System architecture](./media/mariadb-mysql-cluster/Setup.png)

> [!NOTE]
> This topic uses the [Azure CLI](../../../cli-install-nodejs.md) tools, so make sure to download them and connect them to your Azure subscription according to the instructions. If you need a reference to the commands available in the Azure CLI, see the [Azure CLI command reference](https://docs.microsoft.com/cli/azure/get-started-with-az-cli2). You will also need to [create an SSH key for authentication] and make note of the .pem file location.
>
>

## Create the template
### Infrastructure
1. Create an affinity group to hold the resources together.

        azure account affinity-group create mariadbcluster --location "North Europe" --label "MariaDB Cluster"
2. Create a virtual network.

        azure network vnet create --address-space 10.0.0.0 --cidr 8 --subnet-name mariadb --subnet-start-ip 10.0.0.0 --subnet-cidr 24 --affinity-group mariadbcluster mariadbvnet
3. Create a storage account to host all our disks. You shouldn't place more than 40 heavily used disks on the same storage account to avoid hitting the 20,000 IOPS storage account limit. In this case, you're well below that limit, so you'll store everything on the same account for simplicity.

        azure storage account create mariadbstorage --label mariadbstorage --affinity-group mariadbcluster
4. Find the name of the CentOS 7 virtual machine image.

        azure vm image list | findstr CentOS
   The output will be something like `5112500ae3b842c8b9c604889f8753c3__OpenLogic-CentOS-70-20140926`.

   Use that name in the following step.
5. Create the VM template and replace /path/to/key.pem with the path where you stored the generated .pem SSH key.

        azure vm create --virtual-network-name mariadbvnet --subnet-names mariadb --blob-url "http://mariadbstorage.blob.core.windows.net/vhds/mariadbhatemplate-os.vhd"  --vm-size Medium --ssh 22 --ssh-cert "/path/to/key.pem" --no-ssh-password mariadbtemplate 5112500ae3b842c8b9c604889f8753c3__OpenLogic-CentOS-70-20140926 azureuser
6. Attach four 500-GB data disks to the VM for use in the RAID configuration.

        FOR /L %d IN (1,1,4) DO azure vm disk attach-new mariadbhatemplate 512 http://mariadbstorage.blob.core.windows.net/vhds/mariadbhatemplate-data-%d.vhd
7. Use SSH to sign in to the template VM that you created at mariadbhatemplate.cloudapp.net:22, and connect by using your private key.

### Software
1. Get the root.

        sudo su

2. Install RAID support:

    a. Install mdadm.

              yum install mdadm

    b. Create the RAID0/stripe configuration with an EXT4 file system.

              mdadm --create --verbose /dev/md0 --level=stripe --raid-devices=4 /dev/sdc /dev/sdd /dev/sde /dev/sdf
              mdadm --detail --scan >> /etc/mdadm.conf
              mkfs -t ext4 /dev/md0
    c. Create the mount point directory.

              mkdir /mnt/data
    d. Retrieve the UUID of the newly created RAID device.

              blkid | grep /dev/md0
    e. Edit /etc/fstab.

              vi /etc/fstab
    f. Add the device to enable auto mounting on reboot, replacing the UUID with the value obtained from the previous **blkid** command.

              UUID=<UUID FROM PREVIOUS>   /mnt/data ext4   defaults,noatime   1 2
    g. Mount the new partition.

              mount /mnt/data

3. Install MariaDB.

    a. Create the MariaDB.repo file.

                vi /etc/yum.repos.d/MariaDB.repo

    b. Fill the repo file with the following content:

              [mariadb]
              name = MariaDB
              baseurl = http://yum.mariadb.org/10.0/centos7-amd64
              gpgkey=https://yum.mariadb.org/RPM-GPG-KEY-MariaDB
              gpgcheck=1
    c. To avoid conflicts, remove existing postfix and mariadb-libs.

           yum remove postfix mariadb-libs-*
    d. Install MariaDB with Galera.

           yum install MariaDB-Galera-server MariaDB-client galera

4. Move the MySQL data directory to the RAID block device.

    a. Copy the current MySQL directory into its new location and remove the old directory.

           cp -avr /var/lib/mysql /mnt/data  
           rm -rf /var/lib/mysql
    b. Set permissions for the new directory accordingly.

           chown -R mysql:mysql /mnt/data && chmod -R 755 /mnt/data/

    c. Create a symlink that points the old directory to the new location on the RAID partition.

           ln -s /mnt/data/mysql /var/lib/mysql

5. Because [SELinux interferes with the cluster operations](http://galeracluster.com/documentation-webpages/configuration.html#selinux), it is necessary to disable it for the current session. Edit `/etc/selinux/config` to disable it for subsequent restarts.

            setenforce 0

            then editing `/etc/selinux/config` to set `SELINUX=permissive`
6. Validate MySQL runs.

   a. Start MySQL.

           service mysql start
   b. Secure the MySQL installation, set the root password, remove anonymous users to disable remote root login, and remove the test database.

           mysql_secure_installation
   c. Create a user on the database for cluster operations, and optionally for your applications.

           mysql -u root -p
           GRANT ALL PRIVILEGES ON *.* TO 'cluster'@'%' IDENTIFIED BY 'p@ssw0rd' WITH GRANT OPTION; FLUSH PRIVILEGES;
           exit

   d. Stop MySQL.

            service mysql stop
7. Create a configuration placeholder.

   a. Edit the MySQL configuration to create a placeholder for the cluster settings. Do not replace the **`<Variables>`** or uncomment now. That will happen after you create a VM from this template.

            vi /etc/my.cnf.d/server.cnf
   b. Edit the **[galera]** section and clear it out.

   c. Edit the **[mariadb]** section.

           wsrep_provider=/usr/lib64/galera/libgalera_smm.so
           binlog_format=ROW
           wsrep_sst_method=rsync
           bind-address=0.0.0.0 # When set to 0.0.0.0, the server listens to remote connections
           default_storage_engine=InnoDB
           innodb_autoinc_lock_mode=2

           wsrep_sst_auth=cluster:p@ssw0rd # CHANGE: Username and password you created for the SST cluster MySQL user
           #wsrep_cluster_name='mariadbcluster' # CHANGE: Uncomment and set your desired cluster name
           #wsrep_cluster_address="gcomm://mariadb1,mariadb2,mariadb3" # CHANGE: Uncomment and Add all your servers
           #wsrep_node_address='<ServerIP>' # CHANGE: Uncomment and set IP address of this server
           #wsrep_node_name='<NodeName>' # CHANGE: Uncomment and set the node name of this server
8. Open required ports on the firewall by using FirewallD on CentOS 7.

   * MySQL: `firewall-cmd --zone=public --add-port=3306/tcp --permanent`
   * GALERA: `firewall-cmd --zone=public --add-port=4567/tcp --permanent`
   * GALERA IST: `firewall-cmd --zone=public --add-port=4568/tcp --permanent`
   * RSYNC: `firewall-cmd --zone=public --add-port=4444/tcp --permanent`
   * Reload the firewall: `firewall-cmd --reload`

9. Optimize the system for performance. For more information, see [performance tuning strategy](optimize-mysql.md).

   a. Edit the MySQL configuration file again.

            vi /etc/my.cnf.d/server.cnf
   b. Edit the **[mariadb]** section and append the following content:

   > [!NOTE]
   > We recommend that innodb\_buffer\_pool_size is 70 percent of your VM's memory. In this example, it has been set at 2.45 GB for the medium Azure VM with 3.5 GB of RAM.
   >
   >

           innodb_buffer_pool_size = 2508M # The buffer pool contains buffered data and the index. This is usually set to 70 percent of physical memory.
           innodb_log_file_size = 512M #  Redo logs ensure that write operations are fast, reliable, and recoverable after a crash
           max_connections = 5000 # A larger value will give the server more time to recycle idled connections
           innodb_file_per_table = 1 # Speed up the table space transmission and optimize the debris management performance
           innodb_log_buffer_size = 128M # The log buffer allows transactions to run without having to flush the log to disk before the transactions commit
           innodb_flush_log_at_trx_commit = 2 # The setting of 2 enables the most data integrity and is suitable for Master in MySQL cluster
           query_cache_size = 0
10. Stop MySQL, disable MySQL service from running on startup to avoid disrupting the cluster when adding a node, and deprovision the machine.

        service mysql stop
        chkconfig mysql off
        waagent -deprovision
11. Capture the VM through the portal. (Currently, [issue #1268 in the Azure CLI tools](https://github.com/Azure/azure-xplat-cli/issues/1268) describes the fact that images captured by the Azure CLI tools do not capture the attached data disks.)

    a. Shut down the machine through the portal.

    b. Click **Capture** and specify the image name as **mariadb-galera-image**. Provide a description and check "I have run waagent."
      
      ![Capture the virtual machine](./media/mariadb-mysql-cluster/Capture2.PNG)

## Create the cluster
Create three VMs with the template you created, and then configure and start the cluster.

1. Create the first CentOS 7 VM from the mariadb-galera-image image you created, providing the following information:

 - Virtual network name: mariadbvnet
 - Subnet: mariadb
 - Machine size: medium
 - Cloud service name: mariadbha (or whatever name you want to be accessed through mariadbha.cloudapp.net)
 - Machine name: mariadb1
 - Username: azureuser
 - SSH access: enabled
 - Passing the SSH certificate .pem file and replacing /path/to/key.pem with the path where you stored the generated .pem SSH key.

   > [!NOTE]
   > The following commands are split over multiple lines for clarity, but you should enter each as one line.
   >
   >
        azure vm create
        --virtual-network-name mariadbvnet
        --subnet-names mariadb
        --availability-set clusteravset
        --vm-size Medium
        --ssh-cert "/path/to/key.pem"
        --no-ssh-password
        --ssh 22
        --vm-name mariadb1
        mariadbha mariadb-galera-image azureuser
2. Create two more virtual machines by connecting them to the mariadbha cloud service. Change the VM name and the SSH port to a unique port not conflicting with other VMs in the same cloud service.

        azure vm create
        --virtual-network-name mariadbvnet
        --subnet-names mariadb
        --availability-set clusteravset
        --vm-size Medium
        --ssh-cert "/path/to/key.pem"
        --no-ssh-password
        --ssh 23
        --vm-name mariadb2
        --connect mariadbha mariadb-galera-image azureuser
  For MariaDB3:

        azure vm create
        --virtual-network-name mariadbvnet
        --subnet-names mariadb
        --availability-set clusteravset
        --vm-size Medium
        --ssh-cert "/path/to/key.pem"
        --no-ssh-password
        --ssh 24
        --vm-name mariadb3
        --connect mariadbha mariadb-galera-image azureuser
3. You will need to get the internal IP address of each of the three VMs for the next step:

    ![Getting IP address](./media/mariadb-mysql-cluster/IP.png)
4. Use SSH to sign in to the three VMs and edit the configuration file on each of them.

        sudo vi /etc/my.cnf.d/server.cnf

    Uncomment **`wsrep_cluster_name`** and **`wsrep_cluster_address`** by removing the **#** at the beginning of the line.
    Additionally, replace **`<ServerIP>`** in **`wsrep_node_address`** and **`<NodeName>`** in **`wsrep_node_name`** with the VM's IP address and name, respectively, and uncomment those lines as well.
5. Start the cluster on MariaDB1 and let it run at startup.

        sudo service mysql bootstrap
        chkconfig mysql on
6. Start MySQL on MariaDB2 and MariaDB3 and let it run at startup.

        sudo service mysql start
        chkconfig mysql on

## Load balance the cluster
When you created the clustered VMs, you added them into an availability set called clusteravset to ensure that they were put on different fault and update domains and that Azure never does maintenance on all machines at once. This configuration meets the requirements to be supported by the Azure service level agreement (SLA).

Now use Azure Load Balancer to balance requests between the three nodes.

Run the following commands on your machine by using the Azure CLI.

The command parameters structure is: `azure vm endpoint create-multiple <MachineName> <PublicPort>:<VMPort>:<Protocol>:<EnableDirectServerReturn>:<Load Balanced Set Name>:<ProbeProtocol>:<ProbePort>`

    azure vm endpoint create-multiple mariadb1 3306:3306:tcp:false:MySQL:tcp:3306
    azure vm endpoint create-multiple mariadb2 3306:3306:tcp:false:MySQL:tcp:3306
    azure vm endpoint create-multiple mariadb3 3306:3306:tcp:false:MySQL:tcp:3306

The CLI sets the load balancer probe interval to 15 seconds, which might be a bit too long. Change it in the portal under **Endpoints** for any of the VMs.

![Edit endpoint](./media/mariadb-mysql-cluster/Endpoint.PNG)

Select **Reconfigure the Load-Balanced Set**.

![Reconfigure the load-balanced Set](./media/mariadb-mysql-cluster/Endpoint2.PNG)

Change **Probe Interval** to 5 seconds and save your changes.

![Change probe interval](./media/mariadb-mysql-cluster/Endpoint3.PNG)

## Validate the cluster
The hard work is done. The cluster should be now accessible at `mariadbha.cloudapp.net:3306`, which hits the load balancer and route requests between the three VMs smoothly and efficiently.

Use your favorite MySQL client to connect, or connect from one of the VMs to verify that this cluster is working.

     mysql -u cluster -h mariadbha.cloudapp.net -p

Then create a database and populate it with some data.

    CREATE DATABASE TestDB;
    USE TestDB;
    CREATE TABLE TestTable (id INT NOT NULL AUTO_INCREMENT PRIMARY KEY, value VARCHAR(255));
    INSERT INTO TestTable (value)  VALUES ('Value1');
    INSERT INTO TestTable (value)  VALUES ('Value2');
    SELECT * FROM TestTable;

The database you created returns the following table:

    +----+--------+
    | id | value  |
    +----+--------+
    |  1 | Value1 |
    |  4 | Value2 |
    +----+--------+
    2 rows in set (0.00 sec)

<!--Every topic should have next steps and links to the next logical set of content to keep the customer engaged-->
## Next steps
In this article, you created a three-node MariaDB + Galera highly available cluster on Azure virtual machines running CentOS 7. The VMs are load balanced with Azure Load Balancer.

You might want to look at [another way to cluster MySQL on Linux](mysql-cluster.md) and ways to [optimize and test MySQL performance on Azure Linux VMs](optimize-mysql.md).

<!--Anchors-->
[Architecture overview]:#architecture-overview
[Creating the template]:#creating-the-template
[Creating the cluster]:#creating-the-cluster
[Load balancing the cluster]:#load-balancing-the-cluster
[Validating the cluster]:#validating-the-cluster
[Next steps]:#next-steps

<!--Image references-->

<!--Link references-->
[Galera]:http://galeracluster.com/products/
[MariaDBs]:https://mariadb.org/en/about/
[create an SSH key for authentication]:http://www.jeff.wilcox.name/2013/06/secure-linux-vms-with-ssh-certificates/
[issue #1268 in the Azure CLI]:https://github.com/Azure/azure-xplat-cli/issues/1268
