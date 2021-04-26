---
title: SAP BusinessObjects BI Platform Deployment on Azure for Linux | Microsoft Docs
description: Deploy and configure SAP BusinessObjects BI Platform on Azure for Linux
services: virtual-machines-windows,virtual-network,storage,azure-netapp-files,azure-files,mysql
documentationcenter: saponazure
author: dennispadia
manager: juergent
editor: ''
tags: azure-resource-manager
keywords: ''
ms.service: virtual-machines-sap
ms.topic: article
ms.tgt_pltfrm: vm-linux
ms.workload: infrastructure-services
ms.date: 10/05/2020
ms.author: depadia

---

# SAP BusinessObjects BI platform deployment guide for linux on Azure

This article describes the strategy to deploy SAP BusinessObjects BI Platform on Azure for Linux. In this example, two virtual machines with Premium SSD Managed Disks as its install directory are configured. Azure Database for MySQL is used for CMS database, and Azure NetApp Files for File Repository Server is shared across both servers. The default Tomcat Java web application and BI Platform application are installed together on both virtual machines. To load balance the user request, Application Gateway is used that has native TLS/SSL offloading capabilities.

This type of architecture is effective for small deployment or non-production environment. For Production or large-scale deployment, you can have separate hosts for Web Application and can as well have multiple BOBI applications hosts allowing server to process more information.

![SAP BOBI Deployment on Azure for Linux](media/businessobjects-deployment-guide/businessobjects-deployment-linux.png)

In this example, below product version and file system layout is used

- SAP BusinessObjects Platform 4.3
- SUSE Linux Enterprise Server 12 SP5
- Azure Database for MySQL (Version: 8.0.15)
- MySQL C API Connector - libmysqlclient (Version: 6.1.11)

| File System        | Description                                                                                                               | Size (GB)             | Owner  | Group  | Storage                    |
|--------------------|---------------------------------------------------------------------------------------------------------------------------|-----------------------|--------|--------|----------------------------|
| /usr/sap           | The  file system for installation of SAP BOBI instance, default Tomcat Web Application, and database drivers (if necessary) | SAP Sizing Guidelines | bl1adm | sapsys | Managed Premium Disk - SSD |
| /usr/sap/frsinput  | The mount directory is for the shared files across all BOBI hosts that will be used as Input File Repository Directory  | Business Need         | bl1adm | sapsys | Azure NetApp Files         |
| /usr/sap/frsoutput | The mount directory is for the shared files across all BOBI hosts that will be used as Output File Repository Directory | Business Need         | bl1adm | sapsys | Azure NetApp Files         |

## Deploy linux virtual machine via Azure portal

In this section, we'll create two virtual machines (VMs) with Linux Operating System (OS) image for SAP BOBI Platform. The high-level steps to create Virtual Machines are as follows -

1. Create a [Resource Group](../../../azure-resource-manager/management/manage-resource-groups-portal.md#create-resource-groups)

2. Create a [Virtual Network](../../../virtual-network/quick-create-portal.md#create-a-virtual-network).

   - Don't use single subnet for all Azure services in SAP BI Platform deployment. Based on SAP BI Platform architecture, you need to create multiple subnets. In this deployment, we'll create three subnets - Application Subnet, File Repository Store Subnet, and Application Gateway Subnet.
   - In Azure, Application Gateway and Azure NetApp Files always need to be on separate subnet. Check [Azure Application Gateway](../../../application-gateway/configuration-overview.md) and [Guidelines for Azure NetApp Files Network Planning](../../../azure-netapp-files/azure-netapp-files-network-topologies.md) article for more details.

3. Create an Availability Set.

   - To achieve redundancy for each tier in multi-instance deployment, place virtual machines for each tier in an availability set. Make sure you separate the availability sets for each tier based on your architecture.

4. Create Virtual Machine 1 **(azusbosl1).**

   - You can either use custom image or choose an image from Azure Marketplace. Refer to [Deploying a VM from the Azure Marketplace for SAP](https://github.com/MicrosoftDocs/azure-docs/blob/master/articles/virtual-machines/workloads/sap/deployment-guide.md#scenario-1-deploying-a-vm-from-the-azure-marketplace-for-sap) or [Deploying a VM with a custom image for SAP](https://github.com/MicrosoftDocs/azure-docs/blob/master/articles/virtual-machines/workloads/sap/deployment-guide.md#scenario-2-deploying-a-vm-with-a-custom-image-for-sap) based on your need.

5. Create Virtual Machine 2 **(azusbosl2).**
6. Add one Premium SSD disk. It will be used as SAP BOBI Installation directory.

## Provision Azure NetApp Files

Before you continue with the setup for Azure NetApp Files, familiarize yourself with the Azure [NetApp Files documentation](../../../azure-netapp-files/azure-netapp-files-introduction.md).

Azure NetApp Files is available in several [Azure regions](https://azure.microsoft.com/global-infrastructure/services/?products=netapp). Check to see whether your selected Azure region offers Azure NetApp Files.

Use [Azure NetApp Files availability by Azure Region](https://azure.microsoft.com/global-infrastructure/services/?products=netapp&regions=all) page to check the availability of Azure NetApp Files by region.

Request onboarding to Azure NetApp Files by going to [Register for Azure NetApp Files instructions](../../../azure-netapp-files/azure-netapp-files-register.md) before you deploy Azure NetApp Files.

### Deploy Azure NetApp Files resources

The following instructions assume that you've already deployed your [Azure virtual network](../../../virtual-network/virtual-networks-overview.md). The Azure NetApp Files resources and VMs, where the Azure NetApp Files resources will be mounted, must be deployed in the same Azure virtual network or in peered Azure virtual networks.

1. If you haven't already deployed the resources, request [onboarding to Azure NetApp Files](../../../azure-netapp-files/azure-netapp-files-register.md).

2. Create a NetApp account in your selected Azure region by following the instructions in [Create a NetApp account](../../../azure-netapp-files/azure-netapp-files-create-netapp-account.md).

3. Set up an Azure NetApp Files capacity pool by following the instructions in [Set up an Azure NetApp Files capacity pool](../../../azure-netapp-files/azure-netapp-files-set-up-capacity-pool.md).

   - The SAP BI Platform architecture presented in this article uses a single Azure NetApp Files capacity pool at the *Premium* Service level. For SAP BI File Repository Server on Azure, we recommend using an Azure NetApp Files *Premium* or *Ultra* [service Level](../../../azure-netapp-files/azure-netapp-files-service-levels.md).

4. Delegate a subnet to Azure NetApp Files, as described in the instructions in [Delegate a subnet to Azure NetApp Files](../../../azure-netapp-files/azure-netapp-files-delegate-subnet.md).

5. Deploy Azure NetApp Files volumes by following the instructions in [Create an NFS volume for Azure NetApp Files](../../../azure-netapp-files/azure-netapp-files-create-volumes.md).

   ANF volume can be deployed as NFSv3 and NFSv4.1, as both protocol are supported for SAP BOBI Platform. Deploy the volumes in respective Azure NetApp Files subnet. The IP addresses of the Azure NetApp Volumes are assigned automatically.

Keep in mind that the Azure NetApp Files resources and the Azure VMs must be in the same Azure virtual network or in peered Azure virtual networks. For example, azusbobi-frsinput, azusbobi-frsoutput are the volume names and nfs://10.31.2.4/azusbobi-frsinput, nfs://10.31.2.4/azusbobi-frsoutput are the file paths for the Azure NetApp Files Volumes.

- Volume azusbobi-frsinput (nfs://10.31.2.4/azusbobi-frsinput)
- Volume azusbobi-frsoutput (nfs://10.31.2.4/azusbobi-frsoutput)

### Important considerations

As you're creating your Azure NetApp Files for SAP BOBI Platform File Repository Server, be aware of the following consideration:

1. The minimum capacity pool is 4 tebibytes (TiB).
2. The minimum volume size is 100 gibibytes (GiB).
3. Azure NetApp Files and all virtual machines where the Azure NetApp Files volumes will be mounted must be in the same Azure virtual network or in [peered virtual networks](../../../virtual-network/virtual-network-peering-overview.md) in the same region. Azure NetApp Files access over VNET peering in the same region is supported now. Azure NetApp access over global peering isn't supported yet.
4. The selected virtual network must have a subnet that is delegated to Azure NetApp Files.
5. With the Azure NetApp Files [export policy](../../../azure-netapp-files/azure-netapp-files-configure-export-policy.md), you can control the allowed clients, the access type (read-write, read only, and so on).
6. The Azure NetApp Files feature isn't zone-aware yet. Currently, the feature isn't deployed in all availability zones in an Azure region. Be aware of the potential latency implications in some Azure regions.
7. Azure NetApp Files volumes can be deployed as NFSv3 or NFSv4.1 volumes. Both protocols are supported for the SAP BI Platform Applications.

## Configure file systems on linux servers

The steps in this section use the following prefixes:

**[A]**: The step applies to all hosts

### Format and mount SAP file system

1. **[A]** List all attached disk

    ```bash
    sudo lsblk
    NAME   MAJ:MIN RM  SIZE RO TYPE MOUNTPOINT
    sda      8:0    0   30G  0 disk
    ├─sda1   8:1    0    2M  0 part
    ├─sda2   8:2    0  512M  0 part /boot/efi
    ├─sda3   8:3    0    1G  0 part /boot
    └─sda4   8:4    0 28.5G  0 part /
    sdb      8:16   0   32G  0 disk
    └─sdb1   8:17   0   32G  0 part /mnt
    sdc      8:32   0  128G  0 disk
    sr0     11:0    1  628K  0 rom  
    # Premium SSD of 128 GB is attached to Virtual Machine, whose device name is sdc
    ```

2. **[A]** Format block device for /usr/sap

    ```bash
    sudo mkfs.xfs /dev/sdc
    ```

3. **[A]** Create mount directory

    ```bash
    sudo mkdir -p /usr/sap
    ```

4. **[A]** Get UUID of block device

    ```bash
    sudo blkid

    #It will display information about block device. Copy UUID of the formatted block device

    /dev/sdc: UUID="0eb5f6f8-fa77-42a6-b22d-7a9472b4dd1b" TYPE="xfs"
    ```

5. **[A]** Maintain file system mount entry in /etc/fstab

    ```bash
    sudo echo "UUID=0eb5f6f8-fa77-42a6-b22d-7a9472b4dd1b /usr/sap xfs defaults,nofail 0 2" >> /etc/fstab
    ```

6. **[A]** Mount file system

    ```bash
    sudo mount -a

    sudo df -h

    Filesystem                     Size  Used Avail Use% Mounted on
    devtmpfs                       7.9G  8.0K  7.9G   1% /dev
    tmpfs                          7.9G   82M  7.8G   2% /run
    tmpfs                          7.9G     0  7.9G   0% /sys/fs/cgroup
    /dev/sda4                       29G  1.8G   27G   6% /
    tmpfs                          1.6G     0  1.6G   0% /run/user/1000
    /dev/sda3                     1014M   87M  928M   9% /boot
    /dev/sda2                      512M  1.1M  511M   1% /boot/efi
    /dev/sdb1                       32G   49M   30G   1% /mnt
    /dev/sdc                       128G   29G  100G  23% /usr/sap
    ```

### Mount Azure NetApp Files volume

1. **[A]** Create mount directories

   ```bash
   sudo mkdir -p /usr/sap/frsinput
   sudo mkdir -p /usr/sap/frsoutput
   ```

2. **[A]** Configure Client OS to support NFSv4.1 Mount **(Only applicable if using NFSv4.1)**

   If you're using Azure NetApp Files volumes with NFSv4.1 protocol, execute following configuration on all VMs, where Azure NetApp Files NFSv4.1 volumes need to be mounted.

   **Verify NFS domain settings**

   Make sure that the domain is configured as the default Azure NetApp Files domain that is,  **defaultv4iddomain.com** and the mapping is set to **nobody**.

   ```bash
   sudo cat /etc/idmapd.conf
   # Example
   [General]
   Domain = defaultv4iddomain.com
   [Mapping]
   Nobody-User = nobody
   Nobody-Group = nobody
   ```

   > [!Important]
   >
   > Make sure to set the NFS domain in /etc/idmapd.conf on the VM to match the default domain configuration on Azure NetApp Files: **defaultv4iddomain.com**. If there's a mismatch between the domain configuration on the NFS client (i.e. the VM) and the NFS server, i.e. the Azure NetApp configuration, then the permissions for files on Azure NetApp volumes that are mounted on the VMs will be displayed as nobody.

   Verify `nfs4_disable_idmapping`. It should be set to **Y**. To create the directory structure where `nfs4_disable_idmapping` is located, execute the mount command. You won't be able to manually create the directory under /sys/modules, because access is reserved for the kernel / drivers.

   ```bash
   # Check nfs4_disable_idmapping
   cat /sys/module/nfs/parameters/nfs4_disable_idmapping

   # If you need to set nfs4_disable_idmapping to Y
   mkdir /mnt/tmp
   mount -t nfs -o sec=sys,vers=4.1 10.31.2.4:/azusbobi-frsinput /mnt/tmp
   umount /mnt/tmp

   echo "Y" > /sys/module/nfs/parameters/nfs4_disable_idmapping

   # Make the configuration permanent
   echo "options nfs nfs4_disable_idmapping=Y" >> /etc/modprobe.d/nfs.conf
   ```

3. **[A]** Add mount entries

   If using NFSv3

   ```bash
   sudo echo "10.31.2.4:/azusbobi-frsinput /usr/sap/frsinput  nfs   rw,hard,rsize=65536,wsize=65536,vers=3" >> /etc/fstab
   sudo echo "10.31.2.4:/azusbobi-frsoutput /usr/sap/frsoutput  nfs   rw,hard,rsize=65536,wsize=65536,vers=3" >> /etc/fstab
   ```

   If using NFSv4.1

   ```bash
   sudo echo "10.31.2.4:/azusbobi-frsinput /usr/sap/frsinput  nfs   rw,hard,rsize=65536,wsize=65536,vers=4.1,sec=sys" >> /etc/fstab
   sudo echo "10.31.2.4:/azusbobi-frsoutput /usr/sap/frsoutput  nfs   rw,hard,rsize=65536,wsize=65536,vers=4.1,sec=sys" >> /etc/fstab
   ```

4. **[A]** Mount NFS volumes

   ```bash
   sudo mount -a

   sudo df -h

   Filesystem                     Size  Used Avail Use% Mounted on
   devtmpfs                       7.9G  8.0K  7.9G   1% /dev
   tmpfs                          7.9G   82M  7.8G   2% /run
   tmpfs                          7.9G     0  7.9G   0% /sys/fs/cgroup
   /dev/sda4                       29G  1.8G   27G   6% /
   tmpfs                          1.6G     0  1.6G   0% /run/user/1000
   /dev/sda3                     1014M   87M  928M   9% /boot
   /dev/sda2                      512M  1.1M  511M   1% /boot/efi
   /dev/sdb1                       32G   49M   30G   1% /mnt
   /dev/sdc                       128G   29G  100G  23% /usr/sap
   10.31.2.4:/azusbobi-frsinput   101T   18G  100T   1% /usr/sap/frsinput
   10.31.2.4:/azusbobi-frsoutput  100T  512K  100T   1% /usr/sap/frsoutput
   ```

## Configure CMS database - Azure database for MySQL

This section provides details on how to provision Azure Database for MySQL using Azure portal. It also provides instructions on how to create CMS and Audit Databases for SAP BOBI Platform and a user account to access the database.

The guidelines are applicable only if you're using Azure DB for MySQL. For other database(s), refer to SAP or database-specific documentation for instructions.

### Create an Azure database for MySQL

Sign in to Azure portal and follow the steps mentioned in this [Quick start Guide of Azure Database for MySQL](../../../mysql/quickstart-create-mysql-server-database-using-azure-portal.md). Few points to note while provisioning Azure Database for MySQL -

1. Select the same region for Azure Database for MySQL where your SAP BI Platform application servers are running.

2. Choose a supported DB version based on [Product Availability Matrix (PAM) for SAP BI](https://support.sap.com/pam) specific to your SAP BOBI version. Follow same compatibility guidelines as addressed for MySQL AB in SAP PAM

3. In “compute+storage”, select **Configure server** and select the appropriate pricing tier based on you sizing output.

4. **Storage Autogrowth** is enabled by default. Keep in mind that [Storage](../../../mysql/concepts-pricing-tiers.md#storage) can only be scaled-up, not down.

5. By default, **Back up Retention Period** is seven days but you can [optionally configure](../../../mysql/howto-restore-server-portal.md#set-backup-configuration) it up to 35 days.

6. Backups of Azure Database for MySQL are locally redundant by default, so if you want server backups in geo-redundant storage, select **Geographically Redundant** from **Backup Redundancy Options**.

>[!Important]
>Changing the [Backup Redundancy Options](../../../mysql/concepts-backup.md#backup-redundancy-options) after server creation is not supported.

>[!Note]
>The private link feature is only available for Azure Database for MySQL servers in the General Purpose or Memory Optimized pricing tiers. Ensure the database server is in one of these pricing tiers.

### Configure Private Link

In this section, you will create a private link that will allow SAP BOBI virtual machines to connect to Azure database for MySQL service via private endpoint. Azure Private Link brings Azure services inside your private Virtual Network (VNet).

1. Select the Azure database for MySQL created in above section.
2. Navigate to **Security** > **Private endpoint connections**.
3. In **Private endpoint connections** section, Select **Private endpoint**.
4. Select **Subscription**, **Resource group**, and **Location**.
5. Enter the **Name** of private endpoint.
6. On the **Resource** section, perform below selection -
   - Resource type - Microsoft.DBforMySQL/servers
   - Resource - MySQL database created in above section
   - Target sub-resource - mysqlServer.
7. On the **Networking** section, select the **Virtual network** and **Subnet** on which SAP BusinessObjects BI application is deployed.
   >[!NOTE]
   >If you have a network security group (NSG) enabled for the subnet, it will be disabled for private endpoints on this subnet only. Other resources on the subnet will still have NSG enforcement.
8. Accept the **default (yes)** for **Integrate with private DNS zone**.
9.  Select your **private DNS zone** from the drop-down.
10. Select **Review+Create**, and create private end point.

For more information, see [Private Link for Azure Database for MySQL](../../../mysql/concepts-data-access-security-private-link.md)

### Create CMS and audit database

1. Download and install MySQL workbench from [MySQL website](https://dev.mysql.com/downloads/workbench/). Make sure you install MySQL workbench on the server that can access Azure Database for MySQL.

2. Connect to server by using MySQL Workbench. Follow the instruction mentioned in this [article](../../../mysql/connect-workbench.md#get-connection-information). If the connection test is successful, you'll get following message -

   ![SQL Workbench Connection](media/businessobjects-deployment-guide/businessobjects-sql-workbench.png)

3. In SQL query tab, run below query to create schema for CMS and Audit database.

   ```sql
   # Here cmsbl1 is the database name of CMS database. You can provide the name you want for CMS database.
   CREATE SCHEMA `cmsbl1` DEFAULT CHARACTER SET utf8;

   # auditbl1 is the database name of Audit database. You can provide the name you want for CMS database.
   CREATE SCHEMA `auditbl1` DEFAULT CHARACTER SET utf8;
   ```

4. Create user account to connect to schema

   ```sql
   # Create a user that can connect from any host, use the '%' wildcard as a host part
   CREATE USER 'cmsadmin'@'%' IDENTIFIED BY 'password';
   CREATE USER 'auditadmin'@'%' IDENTIFIED BY 'password';

   # Grant all privileges to a user account over a specific database:
   GRANT ALL PRIVILEGES ON cmsbl1.* TO 'cmsadmin'@'%' WITH GRANT OPTION;
   GRANT ALL PRIVILEGES ON auditbl1.* TO 'auditadmin'@'%' WITH GRANT OPTION;

   # Following any updates to the user privileges, be sure to save the changes by issuing the FLUSH PRIVILEGES
   FLUSH PRIVILEGES;
   ```

5. To check the privileges and roles of MySQL user account

   ```sql
   USE sys;
   SHOW GRANTS for 'cmsadmin'@'%';
   +------------------------------------------------------------------------+
   | Grants for cmsadmin@%                                                  |
   +------------------------------------------------------------------------+
   | GRANT USAGE ON *.* TO `cmsadmin`@`%`                                   |
   | GRANT ALL PRIVILEGES ON `cmsbl1`.* TO `cmsadmin`@`%` WITH GRANT OPTION |
   +------------------------------------------------------------------------+

   USE sys;
   SHOW GRANTS FOR 'auditadmin'@'%';
   +----------------------------------------------------------------------------+
   | Grants for auditadmin@%                                                    |
   +----------------------------------------------------------------------------+
   | GRANT USAGE ON *.* TO `auditadmin`@`%`                                     |
   | GRANT ALL PRIVILEGES ON `auditbl1`.* TO `auditadmin`@`%` WITH GRANT OPTION |
   +----------------------------------------------------------------------------+
   ```

### Install MySQL C API connector (libmysqlclient) on linux server

For SAP BOBI Application server to access database, it requires database client/drivers. MySQL C API Connector for Linux has to be used to access CMS and Audit databases. ODBC connection to CMS database isn't supported. This section provides instructions on how to set up MySQL C API Connector on Linux.

1. Refer to [MySQL drivers and management tools compatible with Azure Database for MySQL](../../../mysql/concepts-compatibility.md) article, which describes the drivers that are compatible with Azure Database for MySQL. Check for **MySQL Connector/C (libmysqlclient)** driver in the article.

2. Refer to this [link](https://downloads.mysql.com/archives/c-c/) to download drivers.

3. Select the operating system and download the shared component rpm package of MySQL Connector. In this example, mysql-connector-c-shared-6.1.11 connector version is used.

4. Install the connector in all SAP BOBI Application instance.

   ```bash
   # Install rpm package
   SLES: sudo zypper install <package>.rpm
   RHEL: sudo yum install <package>.rpm
   ```

5. Check the path of libmysqlclient.so

   ```bash
   # Find the location of libmysqlclient.so file
   whereis libmysqlclient

   # sample output
   libmysqlclient: /usr/lib64/libmysqlclient.so
   ```

6. Set LD_LIBRARY_PATH to point to `/usr/lib64` directory for user account that will be used for installation.

   ```bash
   # This configuration is for bash shell. If you are using any other shell for sidadm, kindly set environment variable accordingly.
   vi /home/bl1adm/.bashrc

   export LD_LIBRARY_PATH=/usr/lib64
   ```

## Server Preparation

The steps in this section use the following prefixes:

**[A]**: The step applies to all hosts.

1. **[A]** Based on the flavor of Linux (SLES or RHEL), you need to set kernel parameters and install required libraries. Refer to **System requirements** section in [Business Intelligence Platform Installation Guide for Unix](https://help.sap.com/viewer/65018c09dbe04052b082e6fc4ab60030/4.3).

2. **[A]** Ensure the time zone on your machine is set correctly. Refer to [Additional Unix and Linux requirements section](https://help.sap.com/viewer/65018c09dbe04052b082e6fc4ab60030/4.3/46b143336e041014910aba7db0e91070.html) in Installation Guide.

3. **[A]** Create user account (**bl1**adm) and group (sapsys) under which the software's background processes can run. Use this account to execute the installation and run the software. The account doesn't require root privileges.

4. **[A]** Set user account (**bl1**adm) environment to use a supported UTF-8 locale and ensure that your console software supports UTF-8 character sets. To ensure that your operating system uses the correct locale, set the LC_ALL and LANG environment variables to your preferred locale in your (**bl1**adm) user environment.

   ```bash
   # This configuration is for bash shell. If you are using any other shell for sidadm, kindly set environment variable accordingly.
   vi /home/bl1adm/.bashrc

   export LANG=en_US.utf8
   export LC_ALL=en_US.utf8
   ```

5. **[A]** Configure user account (**bl1**adm).

   ```bash
   # Set ulimit for bl1adm to unlimited
   root@azusbosl1:~> ulimit -f unlimited bl1adm
   root@azusbosl1:~> ulimit -u unlimited bl1adm

   root@azusbosl1:~> su - bl1adm
   bl1adm@azusbosl1:~> ulimit -a

   core file size          (blocks, -c) unlimited
   data seg size           (kbytes, -d) unlimited
   scheduling priority             (-e) 0
   file size               (blocks, -f) unlimited
   pending signals                 (-i) 63936
   max locked memory       (kbytes, -l) 64
   max memory size         (kbytes, -m) unlimited
   open files                      (-n) 1024
   pipe size            (512 bytes, -p) 8
   POSIX message queues     (bytes, -q) 819200
   real-time priority              (-r) 0
   stack size              (kbytes, -s) 8192
   cpu time               (seconds, -t) unlimited
   max user processes              (-u) unlimited
   virtual memory          (kbytes, -v) unlimited
   file locks                      (-x) unlimited
   ```

6. Download and extract media for SAP BusinessObjects BI Platform from SAP Service Marketplace.

## Installation

Check locale for user account **bl1**adm on the server

```bash
bl1adm@azusbosl1:~> locale
LANG=en_US.utf8
LC_ALL=en_US.utf8
```

Navigate to media of SAP BusinessObjects BI Platform and run below command with **bl1**adm user -

```bash
./setup.sh -InstallDir /usr/sap/BL1
```

Follow [SAP BOBI Platform](https://help.sap.com/viewer/product/SAP_BUSINESSOBJECTS_BUSINESS_INTELLIGENCE_PLATFORM) Installation Guide for Unix, specific to your version. Few points to note while installing SAP BOBI Platform.

- On **Configure Product Registration** screen, you can either use temporary license key for SAP BusinessObjects Solutions from SAP Note [1288121](https://launchpad.support.sap.com/#/notes/1288121) or can generate license key in SAP Service Marketplace

- On **Select Install Type** screen, select **Full** installation on first server (azusbosl1), for other server (azusbosl2) select **Custom / Expand** which will expand the existing BOBI setup.

- On **Select Default or Existing Database** screen, select **configure an existing database**, which will prompt you to select CMS and Audit database. Select **MySQL** for CMS Database type and Audit Database type.

  You can also select No auditing database, if you don’t want to configure auditing during installation.

- Select appropriate options on **Select Java Web Application Server screen** based on your SAP BOBI architecture. In this example, we have selected option 1, which installs tomcat server on the same SAP BOBI Platform.

- Enter CMS database information in **Configure CMS Repository Database - MySQL**. Example input for CMS database information for Linux installation. Azure Database for MySQL is used on default port 3306
  
  ![SAP BOBI Deployment on Linux - CMS Database](media/businessobjects-deployment-guide/businessobjects-deployment-linux-sql-cms.png)

- (Optional) Enter Audit database information in **Configure Audit Repository Database - MySQL**. Example input for Audit database information for Linux installation.

  ![SAP BOBI Deployment on Linux - Audit Database](media/businessobjects-deployment-guide/businessobjects-deployment-linux-sql-audit.png)

- Follow the instructions and enter required inputs to complete the installation.

For multi-instance deployment, run the installation setup on second host (azusbosl2). During **Select Install Type** screen, select **Custom / Expand** which will expand the existing BOBI setup.

In Azure database for MySQL offering, a gateway is used to redirect the connections to server instances. After the connection is established, the MySQL client displays the version of MySQL set in the gateway, not the actual version running on your MySQL server instance. To determine the version of your MySQL server instance, use the `SELECT VERSION();` command at the MySQL prompt. So in Central Management Console (CMC), you'll find different database version that is basically the version set on gateway. Check [Supported Azure Database for MySQL server versions](../../../mysql/concepts-supported-versions.md) for more details.

![SAP BOBI Deployment on Linux - CMC Settings](media/businessobjects-deployment-guide/businessobjects-deployment-linux-sql-cmc.png)

```sql
# Run direct query to the database using MySQL Workbench

select version();

+-----------+
| version() |
+-----------+
| 8.0.15    |
+-----------+
```

## Post installation

After multi-instance installation of SAP BOBI Platform, additional post configuration steps need to be performed to support application high availability.

### Configuring cluster name

In multi-instance deployment of SAP BOBI Platform, you want to run several CMS servers together in a cluster. A cluster consists of two or more CMS servers working together against a common CMS system database. If a node that is running on CMS fails, a node with another CMS will continue to service BI platform requests. By default in SAP BOBI platform, a cluster name reflects the hostname of the first CMS that you install.

To configure the cluster name on Linux, follow the instruction mentioned in [SAP Business Intelligence Platform Administrator Guide](https://help.sap.com/viewer/2e167338c1b24da9b2a94e68efd79c42/4.3). After configuring the cluster name, follow SAP Note [1660440](https://launchpad.support.sap.com/#/notes/1660440) to set default system entry on the CMC or BI Launchpad sign in page.

### Configure Input and Output Filestore location to Azure NetApp Files

Filestore refers to the disk directories where the actual SAP BusinessObjects files are. The default location of file repository server for SAP BOBI platform is located in the local installation directory. In multi-instance deployment, it's important to set up filestore on a shared storage like Azure NetApp Files so it can be accessed from all storage tier servers.

1. If not created, follow the instruction provided in above section > **Provision Azure NetApp Files** to create NFS volumes in Azure NetApp Files.

2. Mount the NFS volume as instructed in above section > **Mount Azure NetApp Files volume**

3. Follow SAP Note [2512660](https://launchpad.support.sap.com/#/notes/0002512660) to change the path of file repository (Input and Output).

### Tomcat clustering - session replication

Tomcat supports clustering of two or more application servers for session replication and failover. SAP BOBI platform sessions are serialized, a user session can fail over seamlessly to another instance of tomcat, even when an application server fails.

For example, if a user is connected to a web server that fails while the user is navigating a folder hierarchy in SAP BI application. With a correctly configured cluster, the user may continue navigating the folder hierarchy without being redirected to sign in page.

In SAP Note [2808640](https://launchpad.support.sap.com/#/notes/2808640), steps to configure tomcat clustering is provided using multicast. But in Azure, multicast isn't supported. So to make Tomcat cluster work in Azure, you must use [StaticMembershipInterceptor](https://tomcat.apache.org/tomcat-8.0-doc/config/cluster-interceptor.html#Static_Membership) (SAP Note [2764907](https://launchpad.support.sap.com/#/notes/2764907)). Check [Tomcat Clustering using Static Membership for SAP BusinessObjects BI Platform](https://blogs.sap.com/2020/09/04/sap-on-azure-tomcat-clustering-using-static-membership-for-sap-businessobjects-bi-platform/) on SAP blog to set up tomcat cluster in Azure.

### Load-balancing web tier of SAP BI platform

In SAP BOBI multi-instance deployment, Java Web Application servers (web tier) are running on two or more hosts. To distribute user load evenly across web servers, you can use a load balancer between end users and web servers. In Azure, you can either use Azure Load Balancer or Azure Application Gateway to manage traffic to your web application servers. Details about each offering are explained in following section.

1. [Azure Load Balancer](../../../load-balancer/load-balancer-overview.md) is a high performance, low latency layer 4 (TCP, UDP) load balancer that distributes traffic among healthy Virtual Machines. A load balancer health probe monitors a given port on each VM and only distributes traffic to an operational Virtual Machine(s). You can either choose a public load balancer or internal load balancer depending on whether you want SAP BI Platform accessible from internet or not. Its zone redundant, ensuring high-availability across Availability Zones.

   Refer to Internal Load Balancer section in below figure where web application server runs on port 8080, default Tomcat HTTP Port, which will be monitored by health probe. So any incoming request that comes from end users will get redirected to the web application servers (azusbosl1 or azusbosl2) in the backend pool. Load balancer doesn’t support TLS/SSL Termination (also known as TLS/SSL Offloading). If you are using Azure load balancer to distribute traffic across web servers, we recommend using Standard Load Balancer.

   > [!NOTE]
   > When VMs without public IP addresses are placed in the backend pool of internal (no public IP address) Standard Azure load balancer, there will be no outbound internet connectivity, unless additional configuration is performed to allow routing to public end points. For details on how to achieve outbound connectivity see [Public endpoint connectivity for Virtual Machines using Azure Standard Load Balancer in SAP high-availability scenarios](high-availability-guide-standard-load-balancer-outbound-connections.md).

   ![Azure Load Balancer to balance traffic across Web Servers](media/businessobjects-deployment-guide/businessobjects-deployment-load-balancer.png)

2. [Azure Application Gateway (AGW)](../../../application-gateway/overview.md) provide Application Delivery Controller (ADC) as a service, which is used to help application to direct user traffic to one or more web application servers. It offers various layer 7 load-balancing capabilities like TLS/SSL Offloading, Web Application Firewall (WAF), Cookie-based session affinity and others for your applications.

   In SAP BI Platform, application gateway directs application web traffic to the specified resources in a backend pool - azusbosl1 or azusbos2. You assign a listener to port, create rules, and add resources to a backend pool. In below figure, application gateway with private frontend IP address (10.31.3.20) act as entry point for the users, handles incoming TLS/SSL (HTTPS - TCP/443) connections, decrypt the TLS/SSL and passing on the unencrypted request (HTTP - TCP/8080) to the servers in the backend pool. With in-built TLS/SSL termination feature, we just need to maintain one TLS/SSL certificate on application gateway, which simplifies operations.

   ![Application Gateway to balance traffic across Web Servers](media/businessobjects-deployment-guide/businessobjects-deployment-application-gateway.png)

   To configure Application Gateway for SAP BOBI Web Server, you can refer to [Load Balancing SAP BOBI Web Servers using Azure Application Gateway](https://blogs.sap.com/2020/09/17/sap-on-azure-load-balancing-web-application-servers-for-sap-bobi-using-azure-application-gateway/) on SAP blog.

   > [!NOTE]
   > We recommend to use Azure Application Gateway to load balance the traffic to web server as it provide feature likes like SSL offloading, Centralize SSL management to reduce encryption and decryption overhead on server, Round-Robin algorithm to distribute traffic, Web Application Firewall (WAF) capabilities, high-availability and so on.

## SAP BusinessObjects BI Platform Reliability on Azure

SAP BusinessObjects BI Platform includes different tiers, which are optimized for specific tasks and operations. When a component from any one tier becomes unavailable, SAP BOBI application will either become inaccessible or certain functionality of the application won’t work. So one need to make sure that each tier is designed to be reliable to keep application operational without any business disruption.

This guide will explore how features native to Azure in combination with SAP BOBI platform configuration improves the availability of SAP deployment. This section focuses on the following options for SAP BOBI Platform reliability on Azure -

- **Back up and Restore:** It's a process of creating periodic copies of data and applications to separate location. So it can be restored or recovered to previous state if the original data or applications are lost or damaged.

- **High Availability:** A high available platform has at least two of everything within Azure region to keep the application operational if one of the servers becomes unavailable.
- **Disaster Recovery:** It's a process of restoring your application functionality if there are any catastrophic loss like entire Azure Region becomes unavailable because of some natural disaster.

Implementation of this solution varies based on the nature of the system setup in Azure. So customer needs to tailor their backup/restore, high availability and disaster recovery solution based on their business requirement.

## Back-up and restore

Backup and Restore is a process of creating periodic copies of data and applications to separate location. So it can be restored or recovered to previous state if the original data or applications are lost or damaged. It's also an essential component of any business disaster recovery strategy.

To develop comprehensive backup and restore strategy for SAP BOBI Platform, identify the components that lead to system downtime or disruption in the application. In SAP BOBI Platform, backup of following components are vital to protect the application.

- SAP BOBI Installation Directory (Managed Premium Disks)
- File Repository Server (Azure NetApp Files or Azure Premium Files)
- CMS Database (Azure Database for MySQL or Database on Azure VM)

Following section describes how to implement backup and restore strategy for each component on SAP BOBI Platform.

### Backup & restore for SAP BOBI installation directory

In Azure, the simplest way to back up application servers and all the attached disks is by using [Azure Backup](../../../backup/backup-overview.md) Service. It provides independent and isolated backups to guard unintended destruction of the data on your VMs. Backups are stored in a Recovery Services vault with built-in management of recovery points. Configuration and scaling are simple, backups are optimized and can be restored easily when needed.

As part of backup process, snapshot is taken and the data is transferred to the Recovery Service vault with no impact on production workloads. The snapshot provides different level of consistency as described in [Snapshot Consistency](../../../backup/backup-azure-vms-introduction.md#snapshot-consistency) article. You can also choose to back up subset of the data disks in VM by using selective disks backup and restore functionality. For more information, see [Azure VM Backup](../../../backup/backup-azure-vms-introduction.md) document and [FAQs - Backup Azure VMs](../../../backup/backup-azure-vm-backup-faq.yml).

#### Backup & restore for file repository server

Based on your SAP BOBI deployment on Linux, filestore of SAP BOBI platform can be Azure NetApp Files. Choose from the following options for backup and restore based on the storage you use for filestore.

- **Azure NetApp Files**, you can create an on-demand snapshots and schedule automatic snapshot by using snapshot policies. Snapshot copies provide a point-in-time copy of your ANF volume. For more information, see [Manage snapshots by using Azure NetApp Files](../../../azure-netapp-files/azure-netapp-files-manage-snapshots.md).

- If you have created separate NFS server, make sure you implement the back and restore strategy for the same.

#### Backup & restore for CMS and audit database

For SAP BOBI Platform running on Linux virtual machines, the CMS and audit database can run on any of the supported databases as described in the [support matrix](businessobjects-deployment-guide.md#support-matrix) of SAP BusinessObjects BI platform planning and implementation guide on Azure. So it's important that you adopt the backup and restore strategy based on the database used for CMS and audit data store.

1. Azure Database of MySQL is DBaaS offering in Azure, which automatically creates server backups and stores them in user configured locally redundant or geo-redundant storage. Azure Database of MySQL takes backups of the data files and the transaction log. Depending on the supported maximum storage size, it either takes full and differential backups (4-TB max storage servers) or snapshot backup (up to 16-TB max storage servers). These backups allow you to restore a server at any point-in-time within your configured backup retention period. The default backup retention period is seven days, which you can [optionally configure it](../../../mysql/howto-restore-server-portal.md#set-backup-configuration) up to three days. All backups are encrypted using AES 256-bit encryption. These backup files aren't user-exposed and cannot be exported. These backups can only be used for restore operations in Azure Database for MySQL. You can use [mysqldump](../../../mysql/concepts-migrate-dump-restore.md) to copy a database. For more information, see [Backup and restore in Azure Database for MySQL](../../../mysql/concepts-backup.md).

2. For database installed on Azure virtual machine, you can use standard backup tools or [Azure Backup](../../../backup/sap-hana-db-about.md) service for supported databases. Also if the Azure Services and tools don't meet your requirement, you can use supported third-party backup tools that provide an agent for backup and recovery of all SAP BOBI platform component.

## High availability

High Availability refers to a set of technologies that can minimize IT disruptions by providing business continuity of application/services through redundant, fault-tolerant, or failover-protected components inside the same data center. In our case, the data centers are within one Azure region. The article [High-availability Architecture and Scenarios for SAP](sap-high-availability-architecture-scenarios.md) provide an initial insight on different high availability techniques and recommendation offered on Azure for SAP Applications, which will compliment the instructions in this section.

Based on the sizing result of SAP BOBI Platform, you need to design the landscape and determine the distribution of BI components across Azure Virtual Machines and subnets. The level of redundancy in the distributed architecture depends on the business required Recovery Time Objective (RTO) and Recovery Point Objective (RPO). SAP BOBI Platform includes different tiers and components on each tier should be designed to achieve redundancy. So that if one component fails, there's little to no disruption to your SAP BOBI application. For example,

- Redundant Application Servers like BI Application Servers and Web Server
- Unique Components like CMS Database, File Repository Server, Load Balancer

Following section describes how to achieve high availability on each component of SAP BOBI Platform.

### High availability for application servers

For BI and Web Application Servers whether they're installed separately or together, doesn’t need a specific high availability solution. You can achieve high availability by redundancy, that is by configuring multiple instances of BI and Web Servers in various Azure Virtual Machines.

To reduce the impact of downtime due to one or more events, it is advisable to follow below high availability practice for the application servers running on multiple virtual Machines.

- Use Availability Zones to protect datacenter failures.
- Configure multiple Virtual Machines in an Availability Set for redundancy.
- Use Managed Disks for VMs in an Availability Set.
- Configure each application tier into separate Availability Sets.

For more information, check [Manage the availability of Linux virtual machines](../../availability.md)

>[!Important]
>The concepts of Azure Availability Zones and Azure availability sets are mutually exclusive. That means, you can either deploy a pair or multiple VMs into a specific Availability Zone or an Azure availability set. But not both.

### High availability for CMS database

If you're using Azure Database as a Service (DBaaS) service for CMS and audit database, locally redundant high availability framework is provided by default. You just need to select the region and service inherent high availability, redundancy, and resiliency capabilities without requiring you to configure any additional components. If the deployment strategy for SAP BOBI Platform is across Availability Zone, then you need to make sure you achieve zone redundancy for your CMS and audit databases. For more information on high availability offering for supported DBaaS offering in Azure, check [High availability in Azure Database for MySQL](../../../mysql/concepts-high-availability.md) and [High availability for Azure SQL Database](../../../azure-sql/database/high-availability-sla.md)

For other DBMS deployment for CMS database refer to [DBMS deployment guides for SAP Workload](dbms_guide_general.md), which provides insight on different DBMS deployment and its approach to attain high availability.

### High availability for filestore

Filestore refers to the disk directories where contents like reports, universes, and connections are stored. It's being shared across all application servers of that system. So you must make sure that it's highly available, alongside with other SAP BOBI platform components.

For SAP BOBI Platform running on Linux, you can choose [Azure Premium Files](../../../storage/files/storage-files-introduction.md) or [Azure NetApp Files](../../../azure-netapp-files/azure-netapp-files-introduction.md) for file share that are designed to be highly available and highly durable in nature. For more information, see [Redundancy](../../../storage/files/storage-files-planning.md#redundancy) section for Azure Files.

> [!Important]
> SMB Protocol for Azure Files is generally available, but NFS Protocol support for Azure Files is currently in preview. For more information, see [NFS 4.1 support for Azure Files is now in preview](https://azure.microsoft.com/blog/nfs-41-support-for-azure-files-is-now-in-preview/)

As this File share service isn't available in all region, make sure you refer to [Products available by region](https://azure.microsoft.com/global-infrastructure/services/) site to find out up-to-date information. If the service isn't available in your region, you can create NFS server from which you can share the file system to SAP BOBI application. But you'll also need to consider its high availability.

### High availability for load balancer

To distribute traffic across web server, you can either use Azure Load Balancer or Azure Application Gateway. The redundancy for either of the load balancer can be achieved based on the SKU you choose for deployment.

- For Azure Load Balancer, redundancy can be achieved by configuring Standard Load Balancer frontend as zone-redundant. For more information, see [Standard Load Balancer and Availability Zones](../../../load-balancer/load-balancer-standard-availability-zones.md)
- For Application Gateway, high availability can be achieved based on the type of tier selected during deployment.
   -  v1 SKU supports high-availability scenarios when you've deployed two or more instances. Azure distributes these instances across update and fault domains to ensure that instances don't all fail at the same time. So with this SKU, redundancy can be achieved within the zone.
   -  v2 SKU automatically ensures that new instances are spread across fault domains and update domains. If you choose zone redundancy, the newest instances are also spread across availability zones to offer zonal failure resiliency. For more details, refer [Autoscaling and Zone-redundant Application Gateway v2](../../../application-gateway/application-gateway-autoscaling-zone-redundant.md)

### Reference high availability architecture for SAP BusinessObjects BI platform

Below reference architecture describe the setup of SAP BOBI Platform using availability set running on Linux server. The architecture showcases the use of different Azure Services like Azure Application Gateway, Azure NetApp Files (Filestore), and Azure Database for MySQL (CMS and Audit database) for SAP BOBI Platform that offers built-in redundancy, which reduces the complexity of managing different high availability solutions.

In below figure, the incoming traffic (HTTPS - TCP/443) is load balanced using Azure Application Gateway v1 SKU, which is highly available when deployed on two or more instances. Multiple instances of web server, management servers, and processing servers are deployed in separate Virtual Machines to achieve redundancy and each tier is deployed in separate Availability Sets. Azure NetApp Files has built-in redundancy within data center, so your ANF volumes for File Repository Server will be highly available. CMS Database is provisioned on Azure Database for MySQL (DBaaS) which has inherent high availability. For more information, see [High availability in Azure Database for MySQL](../../../mysql/concepts-high-availability.md) guide.

![SAP BusinessObjects BI Platform Redundancy using Availability Sets](media/businessobjects-deployment-guide/businessobjects-deployment-high-availability.png)

The above architecture provides insight on how SAP BOBI deployment on Azure can be done. But it doesn't cover all possible configuration options for SAP BOBI Platform on Azure. Customer can tailor their deployment based on their business requirement, by choosing different products/services for different components like Load Balancer, File Repository Server, and DBMS.

In several Azure Regions, Availability Zones are offered which means it has independent supply of power source, cooling, and network. It enables customer to deploy application across two or three availability zones. For customer who wants to achieve high availability across AZs can deploy SAP BOBI Platform across availability zones, making sure that each component in the application is zone redundant.

## Disaster recovery

The instruction in this section explains the strategy to provide disaster recovery protection for SAP BOBI Platform running on Linux. It complements the [Disaster Recovery for SAP](../../../site-recovery/site-recovery-sap.md) document, which represents the primary resources for overall SAP disaster recovery approach. For SAP BusinessObjects BI platform refer to SAP Note [2056228](https://launchpad.support.sap.com/#/notes/2056228), which describe below methods to implement DR environment safely.

- Fully or selectively using Lifecycle Management (LCM) or federation to promote/distribute the content from primary system.
- Periodically copying over the CMS and FRS contents.

In this guide, we'll talk about second option to implement DR environment. It won't cover an exhaustive list of all possible configuration options for disaster recovery, but covers solution that feature native Azure services in combination with SAP BOBI Platform configuration.

>[!Important]
>Availability of each component in SAP BusinessObjects BI Platform should be factored in secondary region and entire disaster recovery strategy must be thoroughly tested.

### Reference disaster recovery architecture for SAP BusinessObjects BI platform

This reference architecture is running multi-instance deployment of SAP BOBI Platform with redundant application servers. For disaster recovery, you should fail over all the components of SAP BOBI platform to a secondary region. In below figure, Azure NetApp Files is used as filestore, Azure database for MySQL as CMS/audit repository, and Azure Application Gateway to load balance traffic. The strategy to achieve disaster recovery protection for each component is different, which is described in details in following section.

![SAP BusinessObjects BI Platform Disaster Recovery](media/businessobjects-deployment-guide/businessobjects-deployment-disaster-recovery.png)

### Load balancer

Load Balancer is used to distribute traffic across Web Application Servers of SAP BOBI Platform. On Azure, you can either use Azure Load Balancer or Azure Application Gateway to load balance the traffic across web servers. To achieve DR for the load balancer services, you need to implement another Azure Load Balancer or Azure Application Gateway on secondary region. To keep same URL after DR failover you need to change the entry in DNS, pointing to the load-balancing service running on the secondary region.

### Virtual machines running web and BI application servers

[Azure Site Recovery](../../../site-recovery/site-recovery-overview.md) service can be used to replicate Virtual Machines running Web and BI Application Servers on the secondary region. It replicates the servers and all it's attached managed disk to the secondary region so that when disasters and outages occur you can easily fail over to your replicated environment and continue working. To start replicating all the SAP application virtual machines to the Azure disaster recovery data center, follow the guidance in [Replicate a virtual machine to Azure](../../../site-recovery/azure-to-azure-tutorial-enable-replication.md).

### File repository servers

Filestore is a disk directory where the actual files like reports, BI documents are stored. It's important that all the files in the filestore are in sync to DR region. Based on the type of file share service you use for SAP BOBI Platform running on Linux, necessary DR strategy needs to adopted to sync the content.

- **Azure NetApp Files** provides NFS and SMB volumes, so any file-based copy tool can be used to replicate data between Azure regions. For more information on how to copy ANF volume in another region, see [FAQs About Azure NetApp Files](../../../azure-netapp-files/azure-netapp-files-faqs.md#how-do-i-create-a-copy-of-an-azure-netapp-files-volume-in-another-azure-region)

  You can use Azure NetApp Files Cross Region Replication, which is currently in [preview](https://azure.microsoft.com/blog/azure-netapp-files-cross-region-replication-and-new-enhancements-in-preview/) that uses NetApp SnapMirror® technology. So only changed blocks are sent over the network in a compressed, efficient format. This proprietary technology minimizes the amount of data required to replicate across the regions, which saves data transfer costs. It also shortens the replication time so you can achieve a smaller Restore Point Objective (RPO). For more information, see [Requirements and considerations for using cross-region replication](../../../azure-netapp-files/cross-region-replication-requirements-considerations.md).

- **Azure premium files** only support locally redundant (LRS) and zone redundant storage (ZRS). For Azure Premium Files DR strategy, you can use [AzCopy](../../../storage/common/storage-use-azcopy-v10.md) or [Azure PowerShell](/powershell/module/az.storage/) to copy your files to another storage account in a different region. For more information, see [Disaster recovery and storage account failover](../../../storage/common/storage-disaster-recovery-guidance.md)

   > [!Important]
   > SMB Protocol for Azure Files is generally available, but NFS Protocol support for Azure Files is currently in preview. For more information, see [NFS 4.1 support for Azure Files is now in preview](https://azure.microsoft.com/blog/nfs-41-support-for-azure-files-is-now-in-preview/)

### CMS database

The CMS and audit database in the DR region must be a copy of the databases running in primary region. Based on the database type it's important to copy the database to DR region based on business required RTO and RPO.

#### Azure database for MySQL

Azure Database for MySQL provides multiple options to recover database if there are any disaster. Choose appropriate option that works for your business.

- Enable cross-region read replicas to enhance your business continuity and disaster recovery planning. You can replicate from source server to up to five replicas. Read replicas are updated asynchronously using MySQL's binary log replication technology. Replicas are new servers that you manage similar to regular Azure Database for MySQL servers. Learn more about read replicas, available regions, restrictions and how to fail over from the [read replicas concepts article](../../../mysql/concepts-read-replicas.md).

- Use Azure Database for MySQL's geo-restore feature that restores the server using geo-redundant backups. These backups are accessible even when the region on which your server is hosted is offline. You can restore from these backups to any other region and bring your server back online.

  > [!NOTE]
  > Geo-restore is only possible if you provisioned the server with geo-redundant backup storage. Changing the **Backup Redundancy Options** after server creation is not supported. For more information, see [Backup Redundancy](../../../mysql/concepts-backup.md#backup-redundancy-options) article.

Following is the recommendation for disaster recovery of each tier used in this example.

| SAP BOBI Platform Tiers   | Recommendation                                                                                           |
|---------------------------|----------------------------------------------------------------------------------------------------------|
| Azure Application Gateway | Parallel setup of Application Gateway on Secondary Region                                                |
| Web Application Servers   | Replicate by using Site Recovery                                                                         |
| BI Application Servers    | Replicate by using Site Recovery                                                                         |
| Azure NetApp Files        | File based copy tool to replicate data to Secondary Region **or** ANF Cross Region Replication (Preview) |
| Azure Database for MySQL  | Cross region read replicas **or** Restore backup from geo-redundant backups.                             |

## Next steps

- [Set up disaster recovery for a multi-tier SAP app deployment](../../../site-recovery/site-recovery-sap.md)
- [Azure Virtual Machines planning and implementation for SAP](planning-guide.md)
- [Azure Virtual Machines deployment for SAP](deployment-guide.md)
- [Azure Virtual Machines DBMS deployment for SAP](./dbms_guide_general.md)
