---
title: High availability of SAP HANA on Azure VMs on SLES
description: Learn how to set up and use high availability of SAP HANA on Azure VMs on SUSE Linux Enterprise Server.
services: virtual-machines-linux
documentationcenter: 
author: rdeltcheva
manager: juergent
editor:
ms.service: sap-on-azure
ms.subservice: sap-vm-workloads
ms.topic: article
ms.tgt_pltfrm: vm-linux
ms.workload: infrastructure
ms.date: 12/07/2022
ms.author: radeltch

---
# High availability of SAP HANA on Azure VMs on SUSE Linux Enterprise Server

[dbms-guide]:dbms-guide-general.md
[deployment-guide]:deployment-guide.md
[planning-guide]:planning-guide.md

[2205917]:https://launchpad.support.sap.com/#/notes/2205917
[1944799]:https://launchpad.support.sap.com/#/notes/1944799
[1928533]:https://launchpad.support.sap.com/#/notes/1928533
[2015553]:https://launchpad.support.sap.com/#/notes/2015553
[2178632]:https://launchpad.support.sap.com/#/notes/2178632
[2191498]:https://launchpad.support.sap.com/#/notes/2191498
[2243692]:https://launchpad.support.sap.com/#/notes/2243692
[1984787]:https://launchpad.support.sap.com/#/notes/1984787
[1999351]:https://launchpad.support.sap.com/#/notes/1999351
[2388694]:https://launchpad.support.sap.com/#/notes/2388694
[401162]:https://launchpad.support.sap.com/#/notes/401162

[sles-for-sap-bp]:https://www.suse.com/documentation/sles-for-sap-12/

[sap-swcenter]:https://launchpad.support.sap.com/#/softwarecenter
[template-multisid-db]:https://portal.azure.com/#create/Microsoft.Template/uri/https%3A%2F%2Fraw.githubusercontent.com%2FAzure%2Fazure-quickstart-templates%2Fmaster%2Fapplication-workloads%2Fsap%2Fsap-3-tier-marketplace-image-multi-sid-db-md%2Fazuredeploy.json
[template-converged]:https://portal.azure.com/#create/Microsoft.Template/uri/https%3A%2F%2Fraw.githubusercontent.com%2FAzure%2Fazure-quickstart-templates%2Fmaster%2Fapplication-workloads%2Fsap%2Fsap-3-tier-marketplace-image-converged-md%2Fazuredeploy.json

For on-premises development, you can use either SAP HANA System Replication or shared storage to establish high availability for SAP HANA.

On Azure virtual machines (VMs), HANA System Replication on Azure is currently the only supported high availability function.

SAP HANA System Replication consists of one primary node and at least one secondary node. Changes to the data on the primary node are replicated to the secondary node synchronously or asynchronously.

This article describes how to deploy and configure the VMs, install the cluster framework, and install and configure SAP HANA System Replication.

In the example configurations and installation commands, replace `<placeholder>`  values with your SAP HANA deployment information.

Before you begin, read the following SAP Notes and papers:

- SAP Note [1928533], which has:

  - The list of Azure VM sizes that are supported for the deployment of SAP software.
  - Important capacity information for Azure VM sizes.
  - The supported SAP software, and operating system (OS) and database combinations.
  - The required SAP kernel versions for Windows and Linux on Microsoft Azure.
- SAP Note [2015553] lists the prerequisites for SAP-supported SAP software deployments in Azure.
- SAP Note [2205917] has recommended OS settings for SUSE Linux Enterprise Server for SAP Applications.
- SAP Note [1944799] has SAP HANA Guidelines for SUSE Linux Enterprise Server for SAP Applications.
- SAP Note [2178632] has detailed information about all the monitoring metrics that are reported for SAP in Azure.
- SAP Note [2191498] has the required SAP Host Agent version for Linux in Azure.
- SAP Note [2243692] has information about SAP licensing on Linux in Azure.
- SAP Note [1984787] has general information about SUSE Linux Enterprise Server 12.
- SAP Note [1999351] has more troubleshooting information for the Azure Enhanced Monitoring Extension for SAP.
- SAP Note [401162] has information on how to avoid "address already in use" when you set up HANA System Replication.
- [SAP Community Support Wiki](https://wiki.scn.sap.com/wiki/display/HOME/SAPonLinuxNotes) has all the required SAP Notes for Linux.
- [SAP HANA Certified IaaS Platforms](https://www.sap.com/dmc/exp/2014-09-02-hana-hardware/enEN/#/solutions?filters=v:deCertified;ve:24;iaas;v:125;v:105;v:99;v:120)
- [Azure Virtual Machines planning and implementation for SAP on Linux][planning-guide] guide.
- [Azure Virtual Machines deployment for SAP on Linux][deployment-guide] (this article).
- [Azure Virtual Machines DBMS deployment for SAP on Linux][dbms-guide] guide.
- [SUSE Linux Enterprise Server for SAP Applications 12 SP3 best practices guides][sles-for-sap-bp]:

  - Setting up an SAP HANA SR Performance Optimized Infrastructure (SLES for SAP Applications 12 SP1). The guide contains all the required information to set up SAP HANA System Replication for on-premises development. Use this guide as a baseline.
  - Setting up an SAP HANA SR Cost Optimized Infrastructure (SLES for SAP Applications 12 SP1).

## SAP HANA overview

To achieve high availability, SAP HANA is installed on two virtual machines. The data is replicated by using HANA System Replication.

![SAP HANA high availability overview](./media/sap-hana-high-availability/ha-suse-hana.png)

The SAP HANA System Replication setup uses a dedicated virtual host name and virtual IP addresses. On Azure, a load balancer is required to use a virtual IP address. The figure shows an *example* load balancer that has these configurations:

- Front-end IP address: 10.0.0.13 for HN1-db
- Probe port: 62503

## Deploy for Linux

The resource agent for SAP HANA is included in SUSE Linux Enterprise Server for SAP Applications.

Azure Marketplace contains an image for SUSE Linux Enterprise Server for SAP Applications 12. You can use the image to deploy new VMs.

### Deploy by using a template

You can use one of the quickstart templates that are on GitHub to deploy the SAP HANA solution. The templates install all the required resources, including the VMs, the load balancer, and the availability set.

To deploy the template:

1. In the Azure portal, open the [database template][template-multisid-db] or the [converged template][template-converged].

   The database template creates the load-balancing rules only for a database. The converged template also creates the load-balancing rules for an SAP ASCS/SCS and SAP ERS (Linux only) instance. If you plan to install an SAP NetWeaver-based system and you want to install the ASCS/SCS instance on the same machines, use the [converged template][template-converged].

1. Enter the following parameters:

   - **Sap System ID**: Enter the SAP system ID of the SAP system you want to install. The ID is used as a prefix for the resources that are deployed.
   - **Stack Type** (*converged template only*): Select the SAP NetWeaver stack type.
   - **Os Type**: Select one of the Linux distributions. For this example, select **SLES 12**.
   - **Db Type**: Select **HANA**.
   - **Sap System Size**: Enter the number of SAP Application Performance Standard units (SAPS) the new system will provide. If you're not sure how many SAPS the system requires, ask your SAP Technology Partner or System Integrator.
   - **System Availability**: Select **HA**.
   - **Admin Username and Admin Password**: A new user is created. You can use it to sign in to the machine.
   - **New Or Existing Subnet**: Determines whether a new virtual network and subnet should be created or an existing subnet is used. If you already have a virtual network that's connected to your on-premises network, select **Existing**.
   - **Subnet ID**: If you want to deploy the VM into an existing VNet where you have a subnet defined, the VM should be assigned to the name the ID of that specific subnet. The ID usually looks like `/subscriptions/<subscription ID>/resourceGroups/<resource group name>/providers/Microsoft.Network/virtualNetworks/<virtual network name>/subnets/<subnet name>`.

### Manual deployment

> [!IMPORTANT]
> Make sure that the OS you select is SAP-certified for SAP HANA on the specific VM types you are using. The list of SAP HANA certified VM types and OS releases for those can be looked up in [SAP HANA Certified IaaS Platforms](https://www.sap.com/dmc/exp/2014-09-02-hana-hardware/enEN/#/solutions?filters=v:deCertified;ve:24;iaas;v:125;v:105;v:99;v:120). Make sure that you look at the details of the VM type that's listed to get the complete list of SAP HANA supported OS releases for the specific VM type.

1. Create a resource group.
1. Create a virtual network.
1. Create an availability set.

   - Set the max update domain.
1. Create a load balancer (internal). We recommend that you use the [standard load balancer](../../load-balancer/load-balancer-overview.md). Select the virtual network you created in step 2.
1. Create virtual machine 1.

   - Use a SLES4SAP image in the Azure gallery that is supported for SAP HANA on the VM type you selected.
   - Select the availability set you created in step 3.
1. Create virtual machine 2.

   - Use a SLES4SAP image in the Azure gallery that is supported for SAP HANA on the VM type you selected.
   - Select the availability set you created in step 3. 
1. Add data disks.

   > [!IMPORTANT]
   > A floating IP address isn't supported on a NIC secondary IP configuration in load-balancing scenarios. For details see [Azure Load Balancer limitations](../../load-balancer/load-balancer-multivip-overview.md#limitations). If you need an additional IP address for the VM, deploy a second NIC.   

   > [!NOTE]
   > When VMs without public IP addresses are placed in the back-end pool of an internal (no public IP address) standard instance of Azure Load Balancer, there's no outbound internet connectivity, unless additional configuration is performed to allow routing to public endpoints. For details on how to achieve outbound connectivity, see [Public endpoint connectivity for VMs by using Azure Standard Load Balancer in SAP high-availability scenarios](./high-availability-guide-standard-load-balancer-outbound-connections.md).  

1. Set up a standard load balancer.

   1. Create a front-end IP pool:
   
      1. Open the load balancer, select **frontend IP pool**, and then select **Add**.
      1. Enter the name of the new front-end IP pool (for example, **hana-frontend**).
      1. Set **Assignment** to **Static** and enter the IP address (for example, **10.0.0.13**).
      1. Select **OK**.
      1. After the new front-end IP pool is created, note the pool IP address.
   
   1. Create a single back-end pool: 
 
      1. Open the load balancer, select **Backend pools**, and then select **Add**.
      1. Enter the name of the new back-end pool (for example, **hana-backend**).
      1. For **Backend Pool Configuration**, select **NIC**. 
      1. Select **Add a virtual machine**.
      1. Select the virtual machines of the HANA cluster.
      1. Select **Add**.     
      2. Select **Save**.
   
   1. Create a health probe:
   
      1. Open the load balancer, select **health probes**, and then select **Add**.
      1. Enter the name of the new health probe (for example, **hana-hp**).
      1. For **Protocol**, select **TCP** and select port **625\<instance number\>**. Keep **Interval** set to **5**.
      1. Select **OK**.
   
   1. Create the load-balancing rules:
   
      1. Open the load balancer, select **load balancing rules**, and then select **Add**.
      1. Enter the name of the new load balancer rule (for example, **hana-lb**).
      1. Select the front-end IP address, the back-end pool, and the health probe that you created earlier (for example, **hana-frontend**, **hana-backend**, and **hana-hp**).
      1. Increase the idle timeout to 30 minutes.
      1. Select **HA Ports**.
      1. Enable **Floating IP**.
      1. Select **OK**.

   For more information about the required ports for SAP HANA, read the chapter [Connections to Tenant Databases](https://help.sap.com/viewer/78209c1d3a9b41cd8624338e42a12bf6/latest/en-US/7a9343c9f2a2436faa3cfdb5ca00c052.html) in the [SAP HANA Tenant Databases](https://help.sap.com/viewer/78209c1d3a9b41cd8624338e42a12bf6) guide or [SAP Note 2388694][2388694].

> [!IMPORTANT]
> Don't enable TCP timestamps on Azure VMs that are placed behind Azure Load Balancer. Enabling TCP timestamps causes the health probes to fail. Set parameter `net.ipv4.tcp_timestamps` to `0`. For details see [Load Balancer health probes](../../load-balancer/load-balancer-custom-probe-overview.md) or SAP note [2382421](https://launchpad.support.sap.com/#/notes/2382421). 

## Create a Pacemaker cluster

Follow the steps in [Set up Pacemaker on SUSE Linux Enterprise Server in Azure](high-availability-guide-suse-pacemaker.md) to create a basic Pacemaker cluster for this HANA server. You can use the same Pacemaker cluster for SAP HANA and SAP NetWeaver (A)SCS.

## Install SAP HANA

The steps in this section use the following prefixes:

- **[A]**: The step applies to all nodes.
- **[1]**: The step applies only to node 1.
- **[2]**: The step applies only to node 2 of the Pacemaker cluster.

*Replace the `<placeholder>` values with the values for your SAP HANA installation.*

1. **[A]** Set up the disk layout: **Logical Volume Manager (LVM)**.

   We recommend that you use LVM for volumes that store data and log files. The following example assumes that the VMs have four data disks attached that are used to create two volumes.

   1. List all the available disks:

      ```bash
      /dev/disk/azure/scsi1/lun*
      ```

      Example output:

      ```bash
      /dev/disk/azure/scsi1/lun0  /dev/disk/azure/scsi1/lun1  /dev/disk/azure/scsi1/lun2  /dev/disk/azure/scsi1/lun3
      ```

   1. Create physical volumes for all the disks that you want to use:

      ```bash   
      sudo pvcreate /dev/disk/azure/scsi1/lun0
      sudo pvcreate /dev/disk/azure/scsi1/lun1
      sudo pvcreate /dev/disk/azure/scsi1/lun2
      sudo pvcreate /dev/disk/azure/scsi1/lun3
      ```

   1. Create a volume group for the data files. Use one volume group for the log files and one for the shared directory of SAP HANA:

       ```bash
       sudo vgcreate vg_hana_data_<HANA SID> /dev/disk/azure/scsi1/lun0 /dev/disk/azure/scsi1/lun1
       sudo vgcreate vg_hana_log_<HANA SID> /dev/disk/azure/scsi1/lun2
       sudo vgcreate vg_hana_shared_<HANA SID> /dev/disk/azure/scsi1/lun3
       ```

   1. Create the logical volumes.

      A linear volume is created when you use `lvcreate` without the `-i` switch. We suggest that you create a striped volume for better I/O performance, and align the stripe sizes to the values documented in [SAP HANA VM storage configurations](./hana-vm-operations-storage.md). The `-i` argument should be the number of the underlying physical volumes and the `-I` argument is the stripe size. In this document, two physical volumes are used for the data volume, so the `-i` switch argument is set to **2**. The stripe size for the data volume is **256KiB**. One physical volume is used for the log volume, so no `-i` or `-I` switches are explicitly used for the log volume commands.  

       > [!IMPORTANT]
       > Use the `-i` switch and set it to the number of the underlying physical volume when you use more than one physical volume for each data, log, or shared volumes. Use the `-I` switch to specify the stripe size, when creating a striped volume.
       >
       > See [SAP HANA VM storage configurations](./hana-vm-operations-storage.md) for recommended storage configurations, including stripe sizes and number of disks.  
    
       ```bash
       sudo lvcreate -i <number of the physical volume> -I <stripe size for the data volume> -l 100%FREE -n hana_data vg_hana_data_<HANA SID>
       sudo lvcreate -l 100%FREE -n hana_log vg_hana_log_<HANA SID>
       sudo lvcreate -l 100%FREE -n hana_shared vg_hana_shared_<HANA SID>
       sudo mkfs.xfs /dev/vg_hana_data_<HANA SID>/hana_data
       sudo mkfs.xfs /dev/vg_hana_log_<HANA SID>/hana_log
       sudo mkfs.xfs /dev/vg_hana_shared_<HANA SID>/hana_shared
       ```
   
  
   1. Create the mount directories and copy the UUID of all the logical volumes:

       ```bash
       sudo mkdir -p /hana/data/<HANA SID>
       sudo mkdir -p /hana/log/<HANA SID>
       sudo mkdir -p /hana/shared/<HANA SID>
       # Write down the ID of /dev/vg_hana_data_<HANA SID>/hana_data, /dev/vg_hana_log_<HANA SID>/hana_log, and /dev/vg_hana_shared_<HANA SID>/hana_shared
       sudo blkid
       ```
   

   1. Create `fstab` entries for the three logical volumes:       

       ```bash
       sudo vi /etc/fstab
       ```
   

   1. Insert the following line in the */etc/fstab* file:      

       ```bash
       /dev/disk/by-uuid/<UUID of /dev/mapper/vg_hana_data_<HANA SID>-hana_data> /hana/data/<HANA SID> xfs  defaults,nofail  0  2
       /dev/disk/by-uuid/<UUID of /dev/mapper/vg_hana_log_<HANA SID>-hana_log> /hana/log/<HANA SID> xfs  defaults,nofail  0  2
       /dev/disk/by-uuid/<UUID of /dev/mapper/vg_hana_shared_<HANA SID>-hana_shared> /hana/shared/<HANA SID> xfs  defaults,nofail  0  2
       ```
   

   1. Mount the new volumes:

       ```bash
       sudo mount -a
       ```
   

1. **[A]** Set up the disk layout: **Plain Disks**.

   For demo systems, you can place your HANA data and log files on one disk. 

   1. Create a partition on */dev/disk/azure/scsi1/lun0* and format it by using XFS:

       ```bash
       sudo sh -c 'echo -e "n\n\n\n\n\nw\n" | fdisk /dev/disk/azure/scsi1/lun0'
       sudo mkfs.xfs /dev/disk/azure/scsi1/lun0-part1
       
       # Write down the ID of /dev/disk/azure/scsi1/lun0-part1
       sudo /sbin/blkid
       sudo vi /etc/fstab
       ```
   

   1. Insert this line in the */etc/fstab* file:

       ```bash
       /dev/disk/by-uuid/<UUID> /hana xfs  defaults,nofail  0  2
       ```
   

   1. Create the target directory and mount the disk:

       ```bash
       sudo mkdir /hana
       sudo mount -a
       ```
   

1. **[A]** Set up host name resolution for all hosts.

   You can either use a DNS server or modify the */etc/hosts* file on all nodes. This example shows you how to use the */etc/hosts* file. Replace the IP address and the host name in the following commands.
   
   1. Run the following command:

       ```bash
       sudo vi /etc/hosts
       ```
   

   1. Insert the following lines in the */etc/hosts* file. Change the IP address and host name to match your environment.

       ```bash
       <IP address> <HANA SID>-db-0
       <IP address> <HANA SID>-db-1
       ```
   

1. **[A]** Install the SAP HANA high availability packages.

    - Run the following command:

       ```bash
       sudo zypper install SAPHanaSR
       ```
   

   To install SAP HANA System Replication, follow chapter 4 of the [SAP HANA SR Performance Optimized Scenario guide](https://www.suse.com/products/sles-for-sap/resource-library/sap-best-practices/).

1. **[A]** Run the **hdblcm** program from the HANA DVD. 

   Enter the following values at the prompt:

   1. Choose installation: Enter **1**.
   1. Select additional components for installation: Enter **1**.
   1. Enter Installation Path: Enter **/hana/shared**, and then select Enter.
   1. Enter Local Host Name: Enter **..**, and then select Enter.
   1. Do you want to add additional hosts to the system? (y/n): Enter **n**, and then select Enter.
   1. Enter SAP HANA System ID: Enter the SID of HANA, for example: **\<HANA SID\>**.
   1. Enter Instance Number: Enter the HANA Instance number. Enter **03** if you used the Azure template or if you followed the manual deployment section of this article.
   1. Select Database Mode / Enter Index: Enter or select **1**, and then select Enter.
   1. Select System Usage / Enter Index: Select the system usage value **4**.
   1. Enter Location of Data Volumes: Enter **/hana/data/\<HANA SID\>**, and then select Enter.
   1. Enter Location of Log Volumes: Enter **/hana/log/\<HANA SID\>**, and then select Enter.
   1. Restrict maximum memory allocation?: Enter **n**, and then select Enter.
   1. Enter Certificate Host Name For Host: Enter **...**, and then select Enter.
   1. Enter SAP Host Agent User (sapadm) Password: Enter the host agent user password.
   1. Confirm SAP Host Agent User (sapadm) Password: Enter the host agent user password again to confirm.
   1. Enter System Administrator (hdbadm) Password: Enter the system administrator password.
   1. Confirm System Administrator (hdbadm) Password: Enter the system administrator password again to confirm.
   1. Enter System Administrator Home Directory: Enter **/usr/sap/\<HANA SID\>/home**, and then select Enter.
   1. Enter System Administrator Login Shell: Enter **/bin/sh**, and then select Enter.
   1. Enter System Administrator User ID: Enter **1001**, and then select Enter.
   1. Enter ID of User Group (sapsys): Enter **79**, and then select Enter.
   1. Enter Database User (SYSTEM) Password: Enter the database user password.
   1. Confirm Database User (SYSTEM) Password: Enter the database user password again to confirm.
   1. Restart system after machine reboot?: Enter **n**, and then select Enter.
   1. Do you want to continue? (y/n): Validate the summary. Enter **y** to continue.

1. **[A]** Upgrade the SAP host agent.

   Download the latest SAP host agent archive from the [SAP Software Center][sap-swcenter] and run the following command to upgrade the agent. Replace the path to the archive to point to the file that you downloaded.

   ```bash
   sudo /usr/sap/hostctrl/exe/saphostexec -upgrade -archive <path to SAP host gent SAR>
   ```
   

## Configure SAP HANA 2.0 System Replication

The steps in this section use the following prefixes:

* **[A]**: The step applies to all nodes.
* **[1]**: The step applies only to node 1.
* **[2]**: The step applies only to node 2 of the Pacemaker cluster.

*Replace the `<placeholder>` values with the values for your SAP HANA installation.*

1. **[1]** Create the tenant database.

   If you're using SAP HANA 2.0 or MDC, create a tenant database for your SAP NetWeaver system. Replace \<NW1\> with the SID of your SAP system.

   Execute the following command as \<HANA SID\>adm :

   ```bash
   hdbsql -u SYSTEM -p "<password>" -i <instance number> -d SYSTEMDB 'CREATE DATABASE <SAP SID> SYSTEM USER PASSWORD "<password>"'
   ```
   

1. **[1]** Configure System Replication on the first node:

   Back up the databases as \<HANA SID\>adm:

   ```bash
   hdbsql -d SYSTEMDB -u SYSTEM -p "<password>" -i <instance number> "BACKUP DATA USING FILE ('initialbackupSYS')"
   hdbsql -d <HANA SID> -u SYSTEM -p "<password>" -i <instance number> "BACKUP DATA USING FILE ('initialbackup<HANA SID>')"
   hdbsql -d <SAP SID> -u SYSTEM -p "<password>" -i <instance number> "BACKUP DATA USING FILE ('initialbackup<SAP SID>')"
   ```
   

   Copy the system PKI files to the secondary site:

   ```bash
   scp /usr/sap/<HANA SID>/SYS/global/security/rsecssfs/data/SSFS_<HANA SID>.DAT   <HANA SID>-db-1:/usr/sap/<HANA SID>/SYS/global/security/rsecssfs/data/
   scp /usr/sap/<HANA SID>/SYS/global/security/rsecssfs/key/SSFS_<HANA SID>.KEY  <HANA SID>-db-1:/usr/sap/<HANA SID>/SYS/global/security/rsecssfs/key/
   ```
   

   Create the primary site:

   ```bash
   hdbnsutil -sr_enable --name=<first site name, for example, SITE1>
   ```
   

1. **[2]** Configure System Replication on the second node:
    
   Register the second node to start the system replication. Run the following command as \<HANA SID\>adm :

   ```bash
   sapcontrol -nr <instance number> -function StopWait 600 10
   hdbnsutil -sr_register --remoteHost=<HANA SID>-db-0 --remoteInstance=<instance number> --replicationMode=sync --name=<second site name> 
   ```
   

## Configure SAP HANA 1.0 System Replication

The steps in this section use the following prefixes:

* **[A]**: The step applies to all nodes.
* **[1]**: The step applies only to node 1.
* **[2]**: The step applies only to node 2 of the Pacemaker cluster.

Replace the `<placeholder>` values with the values for your SAP HANA installation.

1. **[1]** Create the required users.

   Run the following command as root. Replace the `<placeholder>` values with the values for your SAP HANA installation.

   ```bash
   PATH="$PATH:/usr/sap/<HANA SID>/HDB<instance number>/exe"
   hdbsql -u system -i <instance number> 'CREATE USER hdbhasync PASSWORD "<password>"'
   hdbsql -u system -i <instance number> 'GRANT DATA ADMIN TO hdbhasync'
   hdbsql -u system -i <instance number> 'ALTER USER hdbhasync DISABLE PASSWORD LIFETIME'
   ```
   

1. **[A]** Create the keystore entry.

   Run the following command as root to create a new keystore entry:

   ```bash
   PATH="$PATH:/usr/sap/<HANA SID>/HDB<instance number>/exe"
   hdbuserstore SET hdbhaloc localhost:30315 hdbhasync <password>
   ```
   

1. **[1]** Back up the database.

   Back up the databases as root:

   ```bash
   PATH="$PATH:/usr/sap/<HANA SID>/HDB<instance number>/exe"
   hdbsql -d SYSTEMDB -u system -i <instance number> "BACKUP DATA USING FILE ('<initial backup file name>')"
   ```
   

   If you use a multi-tenant installation, also back up the tenant database:

   ```bash
   hdbsql -d <HANA SID> -u system -i <instance number> "BACKUP DATA USING FILE ('<initial backup file name>')"
   ```
   

1. **[1]** Configure System Replication on the first node.

   Create the primary site as \<HANA SID>\>adm :

   ```bash
   su - hdbadm
   hdbnsutil -sr_enable –-name=<first site name>
   ```
   

1. **[2]** Configure System Replication on the secondary node.

   Register the secondary site as \<HANA SID>\>adm:

   ```bash
   sapcontrol -nr <instance number> -function StopWait 600 10
   hdbnsutil -sr_register --remoteHost=<HANA SID>-db-0 --remoteInstance=<instance number> --replicationMode=sync --name=<second site name> 
   ```
   

## Implement HANA hooks SAPHanaSR and susChkSrv

In this important step, you optimize the integration with the cluster and improve detection when a cluster failover is needed. We highly recommend that you configure the SAPHanaSR Python hook. For HANA 2.0 SP5 and later, we recommend that you implement SAPHanaSR and the susChkSrv hook.  

SusChkSrv extends the functionality of  the main SAPHanaSR HA provider. It acts when the HANA process hdbindexserver crashes. If a single process crashes, HANA typically tries to restart it. Restarting the indexserver process can take a long time, during which the HANA database isn't responsive.

With susChkSrv implemented, an immediate and configurable action is executed. The action triggers a failover in the configured timeout period  instead of waiting for the hdbindexserver process to restart on the same node. 

1. **[A]** Install the HANA system replication hook. The hook must be installed on both HANA database nodes.           

   > [!TIP]
   > The SAPHanaSR Python hook can be implemented only for HANA 2.0. The SAPHanaSR package must be at least version 0.153.
   >   
   > The susChkSrv Python hook requires SAP HANA 2.0 SP5, and SAPHanaSR version 0.161.1_BF or later must be installed.  

   1. Stop HANA on both nodes. Execute as \<SAP SID\>adm:  
   
    ```bash
    sapcontrol -nr <instance number> -function StopSystem
    ```

   1. Adjust *global.ini* on each cluster node. If the requirements for the susChkSrv hook aren't met, remove the entire [ha_dr_provider_suschksrv] block from the following parameters.

   You can adjust the behavior of `susChkSrv` by using the `action_on_lost` parameter.  
   
   Valid values are [ `ignore` | `stop` | `kill` | `fence` ].
 
    ```bash
    # add to global.ini
    [ha_dr_provider_SAPHanaSR]
    provider = SAPHanaSR
    path = /usr/share/SAPHanaSR
    execution_order = 1
    
    [ha_dr_provider_suschksrv]
    provider = susChkSrv
    path = /usr/share/SAPHanaSR
    execution_order = 3
    action_on_lost = fence

    [trace]
    ha_dr_saphanasr = info
    ```      

   If you point to the standard */usr/share/SAPHanaSR* location, the Python hook code updates automatically through OS or package updates. HANA uses the hook code updates when it next restarts. With an optional own path like */hana/shared/myHooks*, you can decouple OS updates from the hook version you use.

1. **[A]** The cluster requires sudoers configuration on each cluster node for \<sid\>adm. In this example, that's achieved by creating a new file. Execute the command as root and replace `<placeholders>` with the values from your SAP HANA deployment.    

    ```bash
    cat << EOF > /etc/sudoers.d/20-saphana
    # Needed for SAPHanaSR and susChkSrv Python hooks
    <HANA SID>adm ALL=(ALL) NOPASSWD: /usr/sbin/crm_attribute -n hana_<HANA SID>_site_srHook_*
    <HANA SID>adm ALL=(ALL) NOPASSWD: /usr/sbin/SAPHanaSR-hookHelper --sid=<HANA SID> --case=fenceMe
    EOF
    ```

   For details about implementing the SAP HANA system replication hook, see [Set up HANA HA/DR providers](https://documentation.suse.com/sbp/all/html/SLES4SAP-hana-sr-guide-PerfOpt-15/index.html#_set_up_sap_hana_hadr_providers). 

1. **[A]** Start SAP HANA on both nodes. Execute as \<SAP SID\>adm.  

    ```bash
    sapcontrol -nr <instance number> -function StartSystem 
    ```

1. **[1]** Verify the hook installation. Execute as \<SAP SID\>adm on the active HANA system replication site.   

    ```bash
     cdtrace
     awk '/ha_dr_SAPHanaSR.*crm_attribute/ \
     { printf "%s %s %s %s\n",$2,$3,$5,$16 }' nameserver_*
     # Example output
     # 2021-04-08 22:18:15.877583 ha_dr_SAPHanaSR SFAIL
     # 2021-04-08 22:18:46.531564 ha_dr_SAPHanaSR SFAIL
     # 2021-04-08 22:21:26.816573 ha_dr_SAPHanaSR SOK
    ```
   
    Verify the susChkSrv hook installation. Execute as \<SAP SID\>adm on all HANA VMs:

    ```bash
     cdtrace
     egrep '(LOST:|STOP:|START:|DOWN:|init|load|fail)' nameserver_suschksrv.trc
     # Example output
     # 2022-11-03 18:06:21.116728  susChkSrv.init() version 0.7.7, parameter info: action_on_lost=fence stop_timeout=20 kill_signal=9
     # 2022-11-03 18:06:27.613588  START: indexserver event looks like graceful tenant start
     # 2022-11-03 18:07:56.143766  START: indexserver event looks like graceful tenant start (indexserver started)
    ```

## Create SAP HANA cluster resources

First, create the HANA topology. Run the following commands on one of the Pacemaker cluster nodes:

```bash
sudo crm configure property maintenance-mode=true

# Replace <placeholders> with your instance number and HANA system ID

sudo crm configure primitive rsc_SAPHanaTopology_<HANA SID>_HDB<instance number> ocf:suse:SAPHanaTopology \
  operations \$id="rsc_sap2_<HANA SID>_HDB<instance number>-operations" \
  op monitor interval="10" timeout="600" \
  op start interval="0" timeout="600" \
  op stop interval="0" timeout="300" \
  params SID="<HANA SID>" InstanceNumber="<instance number>"

sudo crm configure clone cln_SAPHanaTopology_<HANA SID>_HDB<instance number> rsc_SAPHanaTopology_<HANA SID>_HDB<instance number> \
  meta clone-node-max="1" target-role="Started" interleave="true"
```
   

Next, create the HANA resources:

> [!IMPORTANT]
> Recent testing revealed situations in which netcat stops responding to requests due to a backlog and its limitation of handling only one connection. The `netcat` resource stops listening to the Azure Load Balancer requests, and the floating IP becomes unavailable.
> 
> For existing Pacemaker clusters, previously, we recommended replacing `netcat` with `socat`. Currently, we recommend using the `azure-lb` resource agent, which is part of a package of resource agents. The following package versions are required:
>
> - For SLES 12 SP4/SP5, the version must be at least resource-agents-4.3.018.a7fb5035-3.30.1.  
> - For SLES 15/15 SP1, the version must be at least resource-agents-4.3.0184.6ee15eb2-4.13.1.  
>
> The change requires a brief downtime.
>
> For existing Pacemaker clusters, if the configuration was already changed to use `socat` as described in [Azure Load-Balancer Detection Hardening](https://www.suse.com/support/kb/doc/?id=7024128), there's no requirement to immediately switch to the `azure-lb` resource agent.


> [!NOTE]
> This article contains references to the terms *master* and *slave*, terms that Microsoft no longer uses. When these terms are removed from the software, we'll remove them from this article.

```bash
   # Replace the bold string with your instance number, HANA system ID, and the front-end IP address of the Azure load balancer. 

sudo crm configure primitive rsc_SAPHana_<HANA SID>_HDB<instance number> ocf:suse:SAPHana \
  operations \$id="rsc_sap_<HANA SID>_HDB<instance number>-operations" \
  op start interval="0" timeout="3600" \
  op stop interval="0" timeout="3600" \
  op promote interval="0" timeout="3600" \
  op monitor interval="60" role="Master" timeout="700" \
  op monitor interval="61" role="Slave" timeout="700" \
  params SID="<HANA SID>" InstanceNumber="<instance number>" PREFER_SITE_TAKEOVER="true" \
  DUPLICATE_PRIMARY_TIMEOUT="7200" AUTOMATED_REGISTER="false"

sudo crm configure ms msl_SAPHana_<HANA SID>_HDB<instance number> rsc_SAPHana_<HANA SID>_HDB<instance number> \
  meta notify="true" clone-max="2" clone-node-max="1" \
  target-role="Started" interleave="true"

sudo crm configure primitive rsc_ip_<HANA SID>_HDB<instance number> ocf:heartbeat:IPaddr2 \
  meta target-role="Started" \
  operations \$id="rsc_ip_<HANA SID>_HDB<instance number>-operations" \
  op monitor interval="10s" timeout="20s" \
  params ip="10.0.0.13"

sudo crm configure primitive rsc_nc_<HANA SID>_HDB<instance number> azure-lb port=625<instance number> \
  op monitor timeout=20s interval=10 \
  meta resource-stickiness=0

sudo crm configure group g_ip_<HANA SID>_HDB<instance number> rsc_ip_<HANA SID>_HDB<instance number> rsc_nc_<HANA SID>_HDB<instance number>

sudo crm configure colocation col_saphana_ip_<HANA SID>_HDB<instance number> 4000: g_ip_<HANA SID>_HDB<instance number>:Started \
  msl_SAPHana_<HANA SID>_HDB<instance number>:Master  

sudo crm configure order ord_SAPHana_<HANA SID>_HDB<instance number> Optional: cln_SAPHanaTopology_<HANA SID>_HDB<instance number> \
  msl_SAPHana_<HANA SID>_HDB<instance number>

# Clean up the HANA resources. The HANA resources might have failed because of a known issue.
sudo crm resource cleanup rsc_SAPHana_<HANA SID>_HDB<instance number>

sudo crm configure property maintenance-mode=false
sudo crm configure rsc_defaults resource-stickiness=1000
sudo crm configure rsc_defaults migration-threshold=5000
```
   

> [!IMPORTANT]
> We recommend as a best practice that you only set `AUTOMATED_REGISTER` to `no` while you complete thorough failover tests, to prevent a failed primary instance from automatically registering as secondary. When the failover tests have completed successfully, set `AUTOMATED_REGISTER` to `yes`, so that after takeover, system replication can resume automatically.

Make sure that the cluster status is `OK` and that all the resources started. Which node the resources are running on isn't important.

```bash
   sudo crm_mon -r

# Online: [ <HANA SID>-db-0 <HANA SID>-db-1 ]
#
# Full list of resources:
#
# stonith-sbd     (stonith:external/sbd): Started <HANA SID>-db-0
# Clone Set: cln_SAPHanaTopology_<HANA SID>_HDB<instance number> [rsc_SAPHanaTopology_<HANA SID>_HDB<instance number>]
#     Started: [ <HANA SID>-db-0 <HANA SID>-db-1 ]
# Master/Slave Set: msl_SAPHana_<HANA SID>_HDB<instance number> [rsc_SAPHana_<HANA SID>_HDB<instance number>]
#     Masters: [ <HANA SID>-db-0 ]
#     Slaves: [ <HANA SID>-db-1 ]
# Resource Group: g_ip_<HANA SID>_HDB<instance number>
#     rsc_ip_<HANA SID>_HDB<instance number>   (ocf::heartbeat:IPaddr2):       Started <HANA SID>-db-0
#     rsc_nc_<HANA SID>_HDB<instance number>   (ocf::heartbeat:azure-lb):      Started <HANA SID>-db-0
```
   

## Configure HANA active/read enabled system replication in Pacemaker cluster

Starting with SAP HANA 2.0 SPS 01, SAP allows an active/read-enabled setup for SAP HANA System Replication. In this scenario, the secondary systems of SAP HANA system replication can be actively used for read-intense workloads. To support this setup in a cluster, a second virtual IP address is required so that clients can access the secondary read-enabled SAP HANA database. To ensure that the secondary replication site can still be accessed after a takeover has occurred, the cluster needs to move the virtual IP address around with the secondary of the SAPHana resource.

This section describes the extra steps that are required to manage a HANA active/read-enabled system replication in a SUSE high availability cluster with a second virtual IP.

Before going further, make sure that you have fully configured the SUSE High Availability Cluster managing SAP HANA database as described in earlier sections.  

![SAP HANA high availability with read-enabled secondary](./media/sap-hana-high-availability/ha-hana-read-enabled-secondary.png)

### Extra setup steps in Azure Load Balancer for active/read-enabled setup

To proceed with extra steps to provision the second virtual IP, make sure you have configured Azure Load Balancer as described in [Manual deployment](#manual-deployment).

For the *standard* load balancer, complete these extra steps on the same load balancer that you created earlier.

1. Create a second front-end IP pool: 

   1. Open the load balancer, select **frontend IP pool**, and select **Add**.
   1. Enter the name of the second front-end IP pool (for example, **hana-secondaryIP**).
   1. Set the **Assignment** to **Static** and enter the IP address (for example, **10.0.0.14**).
   1. Select **OK**.
   1. After the new front-end IP pool is created, note the front-end IP address.

1. Create a health probe:

   1. Open the load balancer, select **health probes**, and select **Add**.
   1. Enter the name of the new health probe (for example, **hana-secondaryhp**).
   1. Select **TCP** as the protocol and port **626\<instance number\>**. Keep the **Interval** value set to 5, and the **Unhealthy threshold** value set to 2.
   1. Select **OK**.

1. Create the load-balancing rules:

   1. Open the load balancer, select **load balancing rules**, and select **Add**.
   1. Enter the name of the new load balancer rule (for example, **hana-secondarylb**).
   1. Select the front-end IP address, the back-end pool, and the health probe that you created earlier (for example, **hana-secondaryIP**, **hana-backend** and **hana-secondaryhp**).
   1. Select **HA Ports**.
   1. Increase the **idle timeout** to 30 minutes.
   1. Make sure to **enable Floating IP**.
   1. Select **OK**.

### Configure HANA active/read enabled system replication

The steps to configure HANA system replication are described in [Configure SAP HANA 2.0 System Replication](#configure-sap-hana-20-system-replication). If you're deploying a read-enabled secondary scenario, while configuring system replication on the second node, execute the following command as \<hanasid\>adm:

```
sapcontrol -nr <instance number> -function StopWait 600 10 

hdbnsutil -sr_register --remoteHost=<HANA SID>-db-0 --remoteInstance=<instance number> --replicationMode=sync --name=<second site name> --operationMode=logreplay_readaccess 
```

### Add a secondary virtual IP address resource for an active/read-enabled setup

You can configure the second virtual IP and the appropriate colocation constraint by using the following commands:

```bash
crm configure property maintenance-mode=true

crm configure primitive rsc_secip_<HANA SID>_HDB<instance number> ocf:heartbeat:IPaddr2 \
 meta target-role="Started" \
 operations \$id="rsc_secip_<HANA SID>_HDB<instance number>-operations" \
 op monitor interval="10s" timeout="20s" \
 params ip="10.0.0.14"

crm configure primitive rsc_secnc_<HANA SID>_HDB<instance number> azure-lb port=626<instance number> \
 op monitor timeout=20s interval=10 \
 meta resource-stickiness=0

crm configure group g_secip_<HANA SID>_HDB<instance number> rsc_secip_<HANA SID>_HDB<instance number> rsc_secnc_<HANA SID>_HDB<instance number>

crm configure colocation col_saphana_secip_<HANA SID>_HDB<instance number> 4000: g_secip_<HANA SID>_HDB<instance number>:Started \
 msl_SAPHana_<HANA SID>_HDB<instance number>:Slave 

crm configure property maintenance-mode=false
```

Make sure that the cluster status is `ok` and that all the resources started. The second virtual IP runs on the secondary site along with the SAPHana secondary resource.

```bash
sudo crm_mon -r

# Online: [ <HANA SID>-db-0 <HANA SID>-db-1 ]
#
# Full list of resources:
#
# stonith-sbd     (stonith:external/sbd): Started <HANA SID>-db-0
# Clone Set: cln_SAPHanaTopology_<HANA SID>_HDB<instance number> [rsc_SAPHanaTopology_<HANA SID>_HDB<instance number>]
#     Started: [ <HANA SID>-db-0 <HANA SID>-db-1 ]
# Master/Slave Set: msl_SAPHana_<HANA SID>_HDB<instance number> [rsc_SAPHana_<HANA SID>_HDB<instance number>]
#     Masters: [ <HANA SID>-db-0 ]
#     Slaves: [ <HANA SID>-db-1 ]
# Resource Group: g_ip_<HANA SID>_HDB<instance number>
#     rsc_ip_<HANA SID>_HDB<instance number>   (ocf::heartbeat:IPaddr2):       Started <HANA SID>-db-0
#     rsc_nc_<HANA SID>_HDB<instance number>   (ocf::heartbeat:azure-lb):      Started <HANA SID>-db-0
# Resource Group: g_secip_<HANA SID>_HDB<instance number>:
#     rsc_secip_<HANA SID>_HDB<instance number>       (ocf::heartbeat:IPaddr2):        Started <HANA SID>-db-1
#     rsc_secnc_<HANA SID>_HDB<instance number>       (ocf::heartbeat:azure-lb):       Started <HANA SID>-db-1

```

In the next section, you can find the typical set of failover tests to execute.

Considerations when you test a HANA cluster that's configured with a read-enabled secondary:

1. When you migrate the *SAPHana_\<HANA SID\>_HDB\<instance number\>* cluster resource to the *\<HANA SID\>-db-1* virtual machine, the second virtual IP moves to the *\<HANA SID\>-db-0* server. If you have configured `AUTOMATED_REGISTER="false"` and HANA system replication isn't registered automatically, the second virtual IP runs on *\<HANA SID\>-db-0* because the server is available and cluster services are online.  

1. When you test a server crash, the second virtual IP resources (*rsc_secip_\<HANA SID\>_HDB\<instance number\>*) and the Azure load balancer port resource (*rsc_secnc_\<HANA SID\>_HDB\<instance number\>*) run on the primary server alongside the primary virtual IP resources. While the secondary server is down, the applications that are connected to a read-enabled HANA database connect to the primary HANA database. The behavior is expected because you don't want applications that are connected to a read-enabled HANA database to be inaccessible while the secondary server is unavailable.
  
1. When the secondary server is available and the cluster services are online, the second virtual IP and port resources automatically move to the secondary server, even though HANA system replication might not be registered as secondary. Make sure that you register the secondary HANA database as read enabled before you start cluster services on that server. You can configure the HANA instance cluster resource to automatically register the secondary by setting the parameter `AUTOMATED_REGISTER=true`.       

1. During failover and fallback, the existing connections for applications, using the second virtual IP to connect to the HANA database might be interrupted.  

## Test the cluster setup

This section describes how you can test your setup. Every test assumes that you're root and that the SAP HANA master is running on the *\<HANA SID\>-db-0* virtual machine.

### Test the migration

Before you start the test, make sure that Pacemaker doesn't have any failed action (by running `crm_mon -r`), that there are no unexpected location constraints (for example, leftovers of a migration test), and that HANA is in sync state, for example, by running `SAPHanaSR-showAttr`:

```bash
   <HANA SID>-db-0:~ # SAPHanaSR-showAttr
Sites    srHook
----------------
SITE2    SOK

Global cib-time
--------------------------------
global Mon Aug 13 11:26:04 2018

Hosts    clone_state lpa_<HANA SID>_lpt node_state op_mode   remoteHost    roles                            score site  srmode sync_state version                vhost
-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------
<HANA SID>-db-0 PROMOTED    1534159564  online     logreplay nws-hana-vm-1 4:P:master1:master:worker:master 150   SITE1 sync   PRIM       2.00.030.00.1522209842 nws-hana-vm-0
<HANA SID>-db-1 DEMOTED     30          online     logreplay nws-hana-vm-0 4:S:master1:master:worker:master 100   SITE2 sync   SOK        2.00.030.00.1522209842 nws-hana-vm-1
```
   

You can migrate the SAP HANA master node by executing the following command:

```bash
   crm resource move msl_SAPHana_<HANA SID>_HDB<instance number> <HANA SID>-db-1 force
```
   

If you set `AUTOMATED_REGISTER="false"`, this sequence of commands should migrate the SAP HANA master node and the group that contains the virtual IP address to \<HANA SID\>-db-1.

When the migration is done, the `crm_mon -r` output looks like this example:

```bash
   Online: [ <HANA SID>-db-0 <HANA SID>-db-1 ]

Full list of resources:

stonith-sbd     (stonith:external/sbd): Started <HANA SID>-db-1
 Clone Set: cln_SAPHanaTopology_<HANA SID>_HDB<instance number> [rsc_SAPHanaTopology_<HANA SID>_HDB<instance number>]
     Started: [ <HANA SID>-db-0 <HANA SID>-db-1 ]
 Master/Slave Set: msl_SAPHana_<HANA SID>_HDB<instance number> [rsc_SAPHana_<HANA SID>_HDB<instance number>]
     Masters: [ <HANA SID>-db-1 ]
     Stopped: [ <HANA SID>-db-0 ]
 Resource Group: g_ip_<HANA SID>_HDB<instance number>
     rsc_ip_<HANA SID>_HDB<instance number>   (ocf::heartbeat:IPaddr2):       Started <HANA SID>-db-1
     rsc_nc_<HANA SID>_HDB<instance number>   (ocf::heartbeat:azure-lb):      Started <HANA SID>-db-1

Failed Actions:
* rsc_SAPHana_<HANA SID>_HDB<instance number>_start_0 on <HANA SID>-db-0 'not running' (7): call=84, status=complete, exitreason='none',
    last-rc-change='Mon Aug 13 11:31:37 2018', queued=0ms, exec=2095ms
```
   

The SAP HANA resource on \<HANA SID\>-db-0 fails to start as secondary. In this case, configure the HANA instance as secondary by executing this command:

```bash
   su - <HANA SID>adm

# Stop the HANA instance just in case it is running
<HANA SID>adm@<HANA SID>-db-0:/usr/sap/<HANA SID>/HDB<instance number> sapcontrol -nr <instance number> -function StopWait 600 10
<HANA SID>adm@<HANA SID>-db-0:/usr/sap/<HANA SID>/HDB<instance number> hdbnsutil -sr_register --remoteHost=<HANA SID>-db-1 --remoteInstance=<instance number> --replicationMode=sync --name=<first site name>
```
   

The migration creates location constraints that need to be deleted again:

```bash
   # Switch back to root and clean up the failed state
exit
<HANA SID>-db-0:~ # crm resource clear msl_SAPHana_<HANA SID>_HDB<instance number>
```
   

You also need to clean up the state of the secondary node resource:

```bash
   <HANA SID>-db-0:~ # crm resource cleanup msl_SAPHana_<HANA SID>_HDB<instance number> <HANA SID>-db-0
```
   

Monitor the state of the HANA resource using `crm_mon -r`. When HANA is started on \<HANA SID\>-db-0, the output should look like this example:

```bash
   Online: [ <HANA SID>-db-0 <HANA SID>-db-1 ]

Full list of resources:

stonith-sbd     (stonith:external/sbd): Started <HANA SID>-db-1
 Clone Set: cln_SAPHanaTopology_<HANA SID>_HDB<instance number> [rsc_SAPHanaTopology_<HANA SID>_HDB<instance number>]
     Started: [ <HANA SID>-db-0 <HANA SID>-db-1 ]
 Master/Slave Set: msl_SAPHana_<HANA SID>_HDB<instance number> [rsc_SAPHana_<HANA SID>_HDB<instance number>]
     Masters: [ <HANA SID>-db-1 ]
     Slaves: [ <HANA SID>-db-0 ]
 Resource Group: g_ip_<HANA SID>_HDB<instance number>
     rsc_ip_<HANA SID>_HDB<instance number>   (ocf::heartbeat:IPaddr2):       Started <HANA SID>-db-1
     rsc_nc_<HANA SID>_HDB<instance number>   (ocf::heartbeat:azure-lb):      Started <HANA SID>-db-1
```
   

### Test the Azure fencing agent (not SBD)

You can test the setup of the Azure fencing agent by disabling the network interface on the \<HANA SID\>-db-0 node:

```bash
   sudo ifdown eth0
```

The virtual machine should now restart or stop depending on your cluster configuration.
If you set the `stonith-action` setting to off, the virtual machine is stopped and the resources are migrated to the running virtual machine.

After you start the virtual machine again, the SAP HANA resource fails to start as secondary if you set `AUTOMATED_REGISTER="false"`. In this case, configure the HANA instance as secondary by executing this command:

```bash
   su - <HANA SID>adm

# Stop the HANA instance just in case it is running
sapcontrol -nr <instance number> -function StopWait 600 10
hdbnsutil -sr_register --remoteHost=<HANA SID>-db-1 --remoteInstance=<instance number> --replicationMode=sync --name=<first site name>

# Switch back to root and clean up the failed state
exit
crm resource cleanup msl_SAPHana_<HANA SID>_HDB<instance number> <HANA SID>-db-0
```
   

### Test SBD fencing

You can test the setup of SBD by killing the inquisitor process:

```bash
   <HANA SID>-db-0:~ # ps aux | grep sbd
root       1912  0.0  0.0  85420 11740 ?        SL   12:25   0:00 sbd: inquisitor
root       1929  0.0  0.0  85456 11776 ?        SL   12:25   0:00 sbd: watcher: /dev/disk/by-id/scsi-360014056f268462316e4681b704a9f73 - slot: 0 - uuid: 7b862dba-e7f7-4800-92ed-f76a4e3978c8
root       1930  0.0  0.0  85456 11776 ?        SL   12:25   0:00 sbd: watcher: /dev/disk/by-id/scsi-360014059bc9ea4e4bac4b18808299aaf - slot: 0 - uuid: 5813ee04-b75c-482e-805e-3b1e22ba16cd
root       1931  0.0  0.0  85456 11776 ?        SL   12:25   0:00 sbd: watcher: /dev/disk/by-id/scsi-36001405b8dddd44eb3647908def6621c - slot: 0 - uuid: 986ed8f8-947d-4396-8aec-b933b75e904c
root       1932  0.0  0.0  90524 16656 ?        SL   12:25   0:00 sbd: watcher: Pacemaker
root       1933  0.0  0.0 102708 28260 ?        SL   12:25   0:00 sbd: watcher: Cluster
root      13877  0.0  0.0   9292  1572 pts/0    S+   12:27   0:00 grep sbd

<HANA SID>-db-0:~ # kill -9 1912
```
   

Cluster node \<HANA SID\>-db-0 should be rebooted. The Pacemaker service might not restart. Make sure to start it again.

### Test a manual failover

You can test a manual failover by stopping the `pacemaker` service on the \<HANA SID\>-db-0 node:

```bash
   service pacemaker stop
```

After the failover, you can start the service again. If you set `AUTOMATED_REGISTER="false"`, the SAP HANA resource on the \<HANA SID\>-db-0 node fails to start as secondary. 

In this case, configure the HANA instance as secondary by executing this command:

```bash
   service pacemaker start
su - <HANA SID>adm

# Stop the HANA instance just in case it is running
sapcontrol -nr <instance number> -function StopWait 600 10
hdbnsutil -sr_register --remoteHost=<HANA SID>-db-1 --remoteInstance=<instance number> --replicationMode=sync --name=<first site name> 

# Switch back to root and clean up the failed state
exit
crm resource cleanup msl_SAPHana_<HANA SID>_HDB<instance number> <HANA SID>-db-0
```
   

### SUSE tests

> [!IMPORTANT]
> Make sure that the OS you select is SAP certified for SAP HANA on the specific VM types you are using. The list of SAP HANA-certified VM types and OS releases for those can be looked up in [SAP HANA Certified IaaS Platforms](https://www.sap.com/dmc/exp/2014-09-02-hana-hardware/enEN/#/solutions?filters=v:deCertified;ve:24;iaas;v:125;v:105;v:99;v:120). Make sure to select the details of the VM type listed to get the complete list of SAP HANA-supported OS releases for the specific VM type.

Run all test cases that are listed in the SAP HANA SR Performance Optimized Scenario or SAP HANA SR Cost Optimized Scenario guide, depending on your use case. You can find the guides on the [SLES for SAP best practices page][sles-for-sap-bp].

The following tests are a copy of the test descriptions of the SAP HANA SR Performance Optimized Scenario SUSE Linux Enterprise Server for SAP Applications 12 SP1 guide. For an up-to-date version, always also read the guide itself. Always make sure that HANA is in sync before starting the test and also make sure that the Pacemaker configuration is correct.

In the following test descriptions, we assume `PREFER_SITE_TAKEOVER="true"` and `AUTOMATED_REGISTER="false"`.

> [!NOTE]
> The following tests are designed to be run in sequence. Each test depends on the exit state of the preceding test.

1. Test 1: Stop the primary database on node 1.

   The resource state before starting the test:

   ```bash
   Clone Set: cln_SAPHanaTopology_<HANA SID>_HDB<instance number> [rsc_SAPHanaTopology_<HANA SID>_HDB<instance number>]
      Started: [ <HANA SID>-db-0 <HANA SID>-db-1 ]
   Master/Slave Set: msl_SAPHana_<HANA SID>_HDB<instance number> [rsc_SAPHana_<HANA SID>_HDB<instance number>]
      Masters: [ <HANA SID>-db-0 ]
      Slaves: [ <HANA SID>-db-1 ]
   Resource Group: g_ip_<HANA SID>_HDB<instance number>
      rsc_ip_<HANA SID>_HDB<instance number>   (ocf::heartbeat:IPaddr2):       Started <HANA SID>-db-0
      rsc_nc_<HANA SID>_HDB<instance number>   (ocf::heartbeat:azure-lb):      Started <HANA SID>-db-0
   ```
   

   Run the following commands as \<hanasid\>adm on node \<HANA SID\>-db-0:

   ```bash
   <HANA SID>adm@<HANA SID>-db-0:/usr/sap/<HANA SID>/HDB<instance number> HDB stop
   ```
   

   Pacemaker should detect the stopped HANA instance and failover to the other node. When the failover is done, the HANA instance on node \<HANA SID\>-db-0 is stopped because Pacemaker doesn't automatically register the node as HANA secondary.

   Run the following commands to register node \<HANA SID\>-db-0 as secondary and clean up the failed resource.

   ```bash
   <HANA SID>adm@<HANA SID>-db-0:/usr/sap/<HANA SID>/HDB<instance number> hdbnsutil -sr_register --remoteHost=<HANA SID>-db-1 --remoteInstance=<instance number> --replicationMode=sync --name=<first site name>
   
   # run as root
   <HANA SID>-db-0:~ # crm resource cleanup msl_SAPHana_<HANA SID>_HDB<instance number> <HANA SID>-db-0
   ```
   

   The resource state after the test:

   ```bash
   Clone Set: cln_SAPHanaTopology_<HANA SID>_HDB<instance number> [rsc_SAPHanaTopology_<HANA SID>_HDB<instance number>]
      Started: [ <HANA SID>-db-0 <HANA SID>-db-1 ]
   Master/Slave Set: msl_SAPHana_<HANA SID>_HDB<instance number> [rsc_SAPHana_<HANA SID>_HDB<instance number>]
      Masters: [ <HANA SID>-db-1 ]
      Slaves: [ <HANA SID>-db-0 ]
   Resource Group: g_ip_<HANA SID>_HDB<instance number>
      rsc_ip_<HANA SID>_HDB<instance number>   (ocf::heartbeat:IPaddr2):       Started <HANA SID>-db-1
      rsc_nc_<HANA SID>_HDB<instance number>   (ocf::heartbeat:azure-lb):      Started <HANA SID>-db-1
   ```
   

1. Test 2: Stop the primary database on node 2.

   The resource state before starting the test:

   ```bash
   Clone Set: cln_SAPHanaTopology_<HANA SID>_HDB<instance number> [rsc_SAPHanaTopology_<HANA SID>_HDB<instance number>]
      Started: [ <HANA SID>-db-0 <HANA SID>-db-1 ]
   Master/Slave Set: msl_SAPHana_<HANA SID>_HDB<instance number> [rsc_SAPHana_<HANA SID>_HDB<instance number>]
      Masters: [ <HANA SID>-db-1 ]
      Slaves: [ <HANA SID>-db-0 ]
   Resource Group: g_ip_<HANA SID>_HDB<instance number>
      rsc_ip_<HANA SID>_HDB<instance number>   (ocf::heartbeat:IPaddr2):       Started <HANA SID>-db-1
      rsc_nc_<HANA SID>_HDB<instance number>   (ocf::heartbeat:azure-lb):      Started <HANA SID>-db-1
   ```
   

   Run the following commands as \<hanasid\>adm on node \<HANA SID\>-db-1:

   ```bash
   <HANA SID>adm@<HANA SID>-db-1:/usr/sap/<HANA SID>/HDB<instance number> HDB stop
   ```
   

   Pacemaker should detect the stopped HANA instance and failover to the other node. When the failover is done, the HANA instance on node \<HANA SID\>-db-1 is stopped because Pacemaker doesn't automatically register the node as HANA secondary.

   Run the following commands to register node \<HANA SID\>-db-1 as secondary and clean up the failed resource.

   ```bash
   <HANA SID>adm@<HANA SID>-db-1:/usr/sap/<HANA SID>/HDB<instance number> hdbnsutil -sr_register --remoteHost=<HANA SID>-db-0 --remoteInstance=<instance number> --replicationMode=sync --name=<second site name>
   
   # run as root
   <HANA SID>-db-1:~ # crm resource cleanup msl_SAPHana_<HANA SID>_HDB<instance number> <HANA SID>-db-1
   ```
   

   The resource state after the test:

   ```bash
   Clone Set: cln_SAPHanaTopology_<HANA SID>_HDB<instance number> [rsc_SAPHanaTopology_<HANA SID>_HDB<instance number>]
      Started: [ <HANA SID>-db-0 <HANA SID>-db-1 ]
   Master/Slave Set: msl_SAPHana_<HANA SID>_HDB<instance number> [rsc_SAPHana_<HANA SID>_HDB<instance number>]
      Masters: [ <HANA SID>-db-0 ]
      Slaves: [ <HANA SID>-db-1 ]
   Resource Group: g_ip_<HANA SID>_HDB<instance number>
      rsc_ip_<HANA SID>_HDB<instance number>   (ocf::heartbeat:IPaddr2):       Started <HANA SID>-db-0
      rsc_nc_<HANA SID>_HDB<instance number>   (ocf::heartbeat:azure-lb):      Started <HANA SID>-db-0
   ```
   

1. Test 3: Crash primary database on node.

   The resource state before starting the test:

   ```bash
   Clone Set: cln_SAPHanaTopology_<HANA SID>_HDB<instance number> [rsc_SAPHanaTopology_<HANA SID>_HDB<instance number>]
      Started: [ <HANA SID>-db-0 <HANA SID>-db-1 ]
   Master/Slave Set: msl_SAPHana_<HANA SID>_HDB<instance number> [rsc_SAPHana_<HANA SID>_HDB<instance number>]
      Masters: [ <HANA SID>-db-0 ]
      Slaves: [ <HANA SID>-db-1 ]
   Resource Group: g_ip_<HANA SID>_HDB<instance number>
      rsc_ip_<HANA SID>_HDB<instance number>   (ocf::heartbeat:IPaddr2):       Started <HANA SID>-db-0
      rsc_nc_<HANA SID>_HDB<instance number>   (ocf::heartbeat:azure-lb):      Started <HANA SID>-db-0
   ```
   

   Run the following commands as \<hanasid\>adm on node \<HANA SID\>-db-0:

   ```bash
   <HANA SID>adm@<HANA SID>-db-0:/usr/sap/<HANA SID>/HDB<instance number> HDB kill-9
   ```
   
   
   Pacemaker should detect the killed HANA instance and failover to the other node. When the failover is done, the HANA instance on node \<HANA SID\>-db-0 is stopped because Pacemaker doesn't automatically register the node as HANA secondary.

   Run the following commands to register node \<HANA SID\>-db-0 as secondary and clean up the failed resource.

   ```bash
   <HANA SID>adm@<HANA SID>-db-0:/usr/sap/<HANA SID>/HDB<instance number> hdbnsutil -sr_register --remoteHost=<HANA SID>-db-1 --remoteInstance=<instance number> --replicationMode=sync --name=<first site name>
   
   # run as root
   <HANA SID>-db-0:~ # crm resource cleanup msl_SAPHana_<HANA SID>_HDB<instance number> <HANA SID>-db-0
   ```
   

   The resource state after the test:

   ```bash
   Clone Set: cln_SAPHanaTopology_<HANA SID>_HDB<instance number> [rsc_SAPHanaTopology_<HANA SID>_HDB<instance number>]
      Started: [ <HANA SID>-db-0 <HANA SID>-db-1 ]
   Master/Slave Set: msl_SAPHana_<HANA SID>_HDB<instance number> [rsc_SAPHana_<HANA SID>_HDB<instance number>]
      Masters: [ <HANA SID>-db-1 ]
      Slaves: [ <HANA SID>-db-0 ]
   Resource Group: g_ip_<HANA SID>_HDB<instance number>
      rsc_ip_<HANA SID>_HDB<instance number>   (ocf::heartbeat:IPaddr2):       Started <HANA SID>-db-1
      rsc_nc_<HANA SID>_HDB<instance number>   (ocf::heartbeat:azure-lb):      Started <HANA SID>-db-1
   ```
   

1. Test 4: Crash primary database on node 2.

   The resource state before starting the test:

   ```bash
   Clone Set: cln_SAPHanaTopology_<HANA SID>_HDB<instance number> [rsc_SAPHanaTopology_<HANA SID>_HDB<instance number>]
      Started: [ <HANA SID>-db-0 <HANA SID>-db-1 ]
   Master/Slave Set: msl_SAPHana_<HANA SID>_HDB<instance number> [rsc_SAPHana_<HANA SID>_HDB<instance number>]
      Masters: [ <HANA SID>-db-1 ]
      Slaves: [ <HANA SID>-db-0 ]
   Resource Group: g_ip_<HANA SID>_HDB<instance number>
      rsc_ip_<HANA SID>_HDB<instance number>   (ocf::heartbeat:IPaddr2):       Started <HANA SID>-db-1
      rsc_nc_<HANA SID>_HDB<instance number>   (ocf::heartbeat:azure-lb):      Started <HANA SID>-db-1
   ```
   

   Run the following commands as \<hanasid\>adm on node \<HANA SID\>-db-1:

   ```bash
   <HANA SID>adm@<HANA SID>-db-1:/usr/sap/<HANA SID>/HDB<instance number> HDB kill-9
   ```
   

   Pacemaker should detect the killed HANA instance and failover to the other node. When the failover is done, the HANA instance on node \<HANA SID\>-db-1 is stopped because Pacemaker doesn't automatically register the node as HANA secondary.

   Run the following commands to register node \<HANA SID\>-db-1 as secondary and clean up the failed resource.

   ```bash
   <HANA SID>adm@<HANA SID>-db-1:/usr/sap/<HANA SID>/HDB<instance number> hdbnsutil -sr_register --remoteHost=<HANA SID>-db-0 --remoteInstance=<instance number> --replicationMode=sync --name=<second site name>
   
   # run as root
   <HANA SID>-db-1:~ # crm resource cleanup msl_SAPHana_<HANA SID>_HDB<instance number> <HANA SID>-db-1
   ```
   

   The resource state after the test:

   ```bash
   Clone Set: cln_SAPHanaTopology_<HANA SID>_HDB<instance number> [rsc_SAPHanaTopology_<HANA SID>_HDB<instance number>]
      Started: [ <HANA SID>-db-0 <HANA SID>-db-1 ]
   Master/Slave Set: msl_SAPHana_<HANA SID>_HDB<instance number> [rsc_SAPHana_<HANA SID>_HDB<instance number>]
      Masters: [ <HANA SID>-db-0 ]
      Slaves: [ <HANA SID>-db-1 ]
   Resource Group: g_ip_<HANA SID>_HDB<instance number>
      rsc_ip_<HANA SID>_HDB<instance number>   (ocf::heartbeat:IPaddr2):       Started <HANA SID>-db-0
      rsc_nc_<HANA SID>_HDB<instance number>   (ocf::heartbeat:azure-lb):      Started <HANA SID>-db-0
   ```
   

1. Test 5: Crash primary site node (node 1).

   The resource state before starting the test:

   ```bash
   Clone Set: cln_SAPHanaTopology_<HANA SID>_HDB<instance number> [rsc_SAPHanaTopology_<HANA SID>_HDB<instance number>]
      Started: [ <HANA SID>-db-0 <HANA SID>-db-1 ]
   Master/Slave Set: msl_SAPHana_<HANA SID>_HDB<instance number> [rsc_SAPHana_<HANA SID>_HDB<instance number>]
      Masters: [ <HANA SID>-db-0 ]
      Slaves: [ <HANA SID>-db-1 ]
   Resource Group: g_ip_<HANA SID>_HDB<instance number>
      rsc_ip_<HANA SID>_HDB<instance number>   (ocf::heartbeat:IPaddr2):       Started <HANA SID>-db-0
      rsc_nc_<HANA SID>_HDB<instance number>   (ocf::heartbeat:azure-lb):      Started <HANA SID>-db-0
   ```
   

   Run the following commands as root on node \<HANA SID\>-db-0:

   ```bash
   <HANA SID>-db-0:~ #  echo 'b' > /proc/sysrq-trigger
   ```
   

   Pacemaker should detect the killed cluster node and fence the node. When the node is fenced, Pacemaker triggers a takeover of the HANA instance. When the fenced node is rebooted, Pacemaker doesn't start automatically.

   Run the following commands to start Pacemaker, clean the SBD messages for node \<HANA SID\>-db-0, register node \<HANA SID\>-db-0 as secondary, and clean up the failed resource.

   ```bash
   # run as root
   # list the SBD device(s)
   <HANA SID>-db-0:~ # cat /etc/sysconfig/sbd | grep SBD_DEVICE=
   # SBD_DEVICE="/dev/disk/by-id/scsi-36001405772fe8401e6240c985857e116;/dev/disk/by-id/scsi-36001405034a84428af24ddd8c3a3e9e1;/dev/disk/by-id/scsi-36001405cdd5ac8d40e548449318510c3"
   
   <HANA SID>-db-0:~ # sbd -d /dev/disk/by-id/scsi-36001405772fe8401e6240c985857e116 -d /dev/disk/by-id/scsi-36001405034a84428af24ddd8c3a3e9e1 -d /dev/disk/by-id/scsi-36001405cdd5ac8d40e548449318510c3 message <HANA SID>-db-0 clear
   
   <HANA SID>-db-0:~ # systemctl start pacemaker
   
   # run as <hanasid>adm
   <HANA SID>adm@<HANA SID>-db-0:/usr/sap/<HANA SID>/HDB<instance number> hdbnsutil -sr_register --remoteHost=<HANA SID>-db-1 --remoteInstance=<instance number> --replicationMode=sync --name=<first site name>
   
   # run as root
   <HANA SID>-db-0:~ # crm resource cleanup msl_SAPHana_<HANA SID>_HDB<instance number> <HANA SID>-db-0
   ```
   

   The resource state after the test:

   ```bash
   Clone Set: cln_SAPHanaTopology_<HANA SID>_HDB<instance number> [rsc_SAPHanaTopology_<HANA SID>_HDB<instance number>]
      Started: [ <HANA SID>-db-0 <HANA SID>-db-1 ]
   Master/Slave Set: msl_SAPHana_<HANA SID>_HDB<instance number> [rsc_SAPHana_<HANA SID>_HDB<instance number>]
      Masters: [ <HANA SID>-db-1 ]
      Slaves: [ <HANA SID>-db-0 ]
   Resource Group: g_ip_<HANA SID>_HDB<instance number>
      rsc_ip_<HANA SID>_HDB<instance number>   (ocf::heartbeat:IPaddr2):       Started <HANA SID>-db-1
      rsc_nc_<HANA SID>_HDB<instance number>   (ocf::heartbeat:azure-lb):      Started <HANA SID>-db-1
   ```
   

1. Test 6: Crash secondary site node (node 2).

   The resource state before starting the test:

   ```bash
   Clone Set: cln_SAPHanaTopology_<HANA SID>_HDB<instance number> [rsc_SAPHanaTopology_<HANA SID>_HDB<instance number>]
      Started: [ <HANA SID>-db-0 <HANA SID>-db-1 ]
   Master/Slave Set: msl_SAPHana_<HANA SID>_HDB<instance number> [rsc_SAPHana_<HANA SID>_HDB<instance number>]
      Masters: [ <HANA SID>-db-1 ]
      Slaves: [ <HANA SID>-db-0 ]
   Resource Group: g_ip_<HANA SID>_HDB<instance number>
      rsc_ip_<HANA SID>_HDB<instance number>   (ocf::heartbeat:IPaddr2):       Started <HANA SID>-db-1
      rsc_nc_<HANA SID>_HDB<instance number>   (ocf::heartbeat:azure-lb):      Started <HANA SID>-db-1
   ```
   

   Run the following commands as root on node \<HANA SID\>-db-1:

   ```bash
   <HANA SID>-db-1:~ #  echo 'b' > /proc/sysrq-trigger
   ```
   

   Pacemaker should detect the killed cluster node and fence the node. When the node is fenced, Pacemaker triggers a takeover of the HANA instance. When the fenced node is rebooted, Pacemaker doesn't start automatically.

   Run the following commands to start Pacemaker, clean the SBD messages for node \<HANA SID\>-db-1, register node \<HANA SID\>-db-1 as secondary, and clean up the failed resource.

   ```bash
   # run as root
   # list the SBD device(s)
   <HANA SID>-db-1:~ # cat /etc/sysconfig/sbd | grep SBD_DEVICE=
   # SBD_DEVICE="/dev/disk/by-id/scsi-36001405772fe8401e6240c985857e116;/dev/disk/by-id/scsi-36001405034a84428af24ddd8c3a3e9e1;/dev/disk/by-id/scsi-36001405cdd5ac8d40e548449318510c3"
   
   <HANA SID>-db-1:~ # sbd -d /dev/disk/by-id/scsi-36001405772fe8401e6240c985857e116 -d /dev/disk/by-id/scsi-36001405034a84428af24ddd8c3a3e9e1 -d /dev/disk/by-id/scsi-36001405cdd5ac8d40e548449318510c3 message <HANA SID>-db-1 clear
   
   <HANA SID>-db-1:~ # systemctl start pacemaker
   
   # run as <hanasid>adm
   <HANA SID>adm@<HANA SID>-db-1:/usr/sap/<HANA SID>/HDB<instance number> hdbnsutil -sr_register --remoteHost=<HANA SID>-db-0 --remoteInstance=<instance number> --replicationMode=sync --name=<second site name>
   
   # run as root
   <HANA SID>-db-1:~ # crm resource cleanup msl_SAPHana_<HANA SID>_HDB<instance number> <HANA SID>-db-1
   ```
   

   The resource state after the test:

   ```bash
   Clone Set: cln_SAPHanaTopology_<HANA SID>_HDB<instance number> [rsc_SAPHanaTopology_<HANA SID>_HDB<instance number>]
      Started: [ <HANA SID>-db-0 <HANA SID>-db-1 ]
   Master/Slave Set: msl_SAPHana_<HANA SID>_HDB<instance number> [rsc_SAPHana_<HANA SID>_HDB<instance number>]
      Masters: [ <HANA SID>-db-0 ]
      Slaves: [ <HANA SID>-db-1 ]
   Resource Group: g_ip_<HANA SID>_HDB<instance number>
      rsc_ip_<HANA SID>_HDB<instance number>   (ocf::heartbeat:IPaddr2):       Started <HANA SID>-db-0
      rsc_nc_<HANA SID>_HDB<instance number>   (ocf::heartbeat:azure-lb):      Started <HANA SID>-db-0
   ```
   

1. Test 7: Stop the secondary database on node 2.

   The resource state before starting the test:

   ```bash
   Clone Set: cln_SAPHanaTopology_<HANA SID>_HDB<instance number> [rsc_SAPHanaTopology_<HANA SID>_HDB<instance number>]
      Started: [ <HANA SID>-db-0 <HANA SID>-db-1 ]
   Master/Slave Set: msl_SAPHana_<HANA SID>_HDB<instance number> [rsc_SAPHana_<HANA SID>_HDB<instance number>]
      Masters: [ <HANA SID>-db-0 ]
      Slaves: [ <HANA SID>-db-1 ]
   Resource Group: g_ip_<HANA SID>_HDB<instance number>
      rsc_ip_<HANA SID>_HDB<instance number>   (ocf::heartbeat:IPaddr2):       Started <HANA SID>-db-0
      rsc_nc_<HANA SID>_HDB<instance number>   (ocf::heartbeat:azure-lb):      Started <HANA SID>-db-0
   ```
   

   Run the following commands as \<hanasid\>adm on node \<HANA SID\>-db-1:

   ```bash
   <HANA SID>adm@<HANA SID>-db-1:/usr/sap/<HANA SID>/HDB<instance number> HDB stop
   ```
   

   Pacemaker detects the stopped HANA instance and marks the resource as failed on node \<HANA SID\>-db-1. Pacemaker should automatically restart the HANA instance. Run the following command to clean up the failed state.

   ```bash
   # run as root
   <HANA SID>-db-1:~ # crm resource cleanup msl_SAPHana_<HANA SID>_HDB<instance number> <HANA SID>-db-1
   ```
   

   The resource state after the test:

   ```bash
   Clone Set: cln_SAPHanaTopology_<HANA SID>_HDB<instance number> [rsc_SAPHanaTopology_<HANA SID>_HDB<instance number>]
      Started: [ <HANA SID>-db-0 <HANA SID>-db-1 ]
   Master/Slave Set: msl_SAPHana_<HANA SID>_HDB<instance number> [rsc_SAPHana_<HANA SID>_HDB<instance number>]
      Masters: [ <HANA SID>-db-0 ]
      Slaves: [ <HANA SID>-db-1 ]
   Resource Group: g_ip_<HANA SID>_HDB<instance number>
      rsc_ip_<HANA SID>_HDB<instance number>   (ocf::heartbeat:IPaddr2):       Started <HANA SID>-db-0
      rsc_nc_<HANA SID>_HDB<instance number>   (ocf::heartbeat:azure-lb):      Started <HANA SID>-db-0
   ```
   

1. Test 8: Crash the secondary database on node 2.

   The resource state before starting the test:

   ```bash
   Clone Set: cln_SAPHanaTopology_<HANA SID>_HDB<instance number> [rsc_SAPHanaTopology_<HANA SID>_HDB<instance number>]
      Started: [ <HANA SID>-db-0 <HANA SID>-db-1 ]
   Master/Slave Set: msl_SAPHana_<HANA SID>_HDB<instance number> [rsc_SAPHana_<HANA SID>_HDB<instance number>]
      Masters: [ <HANA SID>-db-0 ]
      Slaves: [ <HANA SID>-db-1 ]
   Resource Group: g_ip_<HANA SID>_HDB<instance number>
      rsc_ip_<HANA SID>_HDB<instance number>   (ocf::heartbeat:IPaddr2):       Started <HANA SID>-db-0
      rsc_nc_<HANA SID>_HDB<instance number>   (ocf::heartbeat:azure-lb):      Started <HANA SID>-db-0
   ```
   

   Run the following commands as \<hanasid\>adm on node \<HANA SID\>-db-1:

   ```bash
   <HANA SID>adm@<HANA SID>-db-1:/usr/sap/<HANA SID>/HDB<instance number> HDB kill-9
   ```
   

   Pacemaker detects the killed HANA instance and marks the resource as failed on node \<HANA SID\>-db-1. Run the following command to clean up the failed state. Pacemaker should then automatically restart the HANA instance.

   ```bash
   # run as root
   <HANA SID>-db-1:~ # crm resource cleanup msl_SAPHana_<HANA SID>_HDB<instance number> <HANA SID>-db-1
   ```
   

   The resource state after the test:

   ```bash
   Clone Set: cln_SAPHanaTopology_<HANA SID>_HDB<instance number> [rsc_SAPHanaTopology_<HANA SID>_HDB<instance number>]
      Started: [ <HANA SID>-db-0 <HANA SID>-db-1 ]
   Master/Slave Set: msl_SAPHana_<HANA SID>_HDB<instance number> [rsc_SAPHana_<HANA SID>_HDB<instance number>]
      Masters: [ <HANA SID>-db-0 ]
      Slaves: [ <HANA SID>-db-1 ]
   Resource Group: g_ip_<HANA SID>_HDB<instance number>
      rsc_ip_<HANA SID>_HDB<instance number>   (ocf::heartbeat:IPaddr2):       Started <HANA SID>-db-0
      rsc_nc_<HANA SID>_HDB<instance number>   (ocf::heartbeat:azure-lb):      Started <HANA SID>-db-0
   ```
   

1. TEST 9: CRASH SECONDARY SITE NODE (NODE 2) RUNNING SECONDARY HANA DATABASE

   The resource state before starting the test:

   ```bash
   Clone Set: cln_SAPHanaTopology_<HANA SID>_HDB<instance number> [rsc_SAPHanaTopology_<HANA SID>_HDB<instance number>]
      Started: [ <HANA SID>-db-0 <HANA SID>-db-1 ]
   Master/Slave Set: msl_SAPHana_<HANA SID>_HDB<instance number> [rsc_SAPHana_<HANA SID>_HDB<instance number>]
      Masters: [ <HANA SID>-db-0 ]
      Slaves: [ <HANA SID>-db-1 ]
   Resource Group: g_ip_<HANA SID>_HDB<instance number>
      rsc_ip_<HANA SID>_HDB<instance number>   (ocf::heartbeat:IPaddr2):       Started <HANA SID>-db-0
      rsc_nc_<HANA SID>_HDB<instance number>   (ocf::heartbeat:azure-lb):      Started <HANA SID>-db-0
   ```
   

   Run the following commands as root on node \<HANA SID\>-db-1:

   ```bash
   <HANA SID>-db-1:~ # echo b > /proc/sysrq-trigger
   ```
   

   Pacemaker should detect the killed cluster node and fence the node. When the fenced node is rebooted, Pacemaker doesn't start automatically.

   Run the following commands to start Pacemaker, clean the SBD messages for node \<HANA SID\>-db-1, and clean up the failed resource.

   ```bash
   # run as root
   # list the SBD device(s)
   <HANA SID>-db-1:~ # cat /etc/sysconfig/sbd | grep SBD_DEVICE=
   # SBD_DEVICE="/dev/disk/by-id/scsi-36001405772fe8401e6240c985857e116;/dev/disk/by-id/scsi-36001405034a84428af24ddd8c3a3e9e1;/dev/disk/by-id/scsi-36001405cdd5ac8d40e548449318510c3"
   
   <HANA SID>-db-1:~ # sbd -d /dev/disk/by-id/scsi-36001405772fe8401e6240c985857e116 -d /dev/disk/by-id/scsi-36001405034a84428af24ddd8c3a3e9e1 -d /dev/disk/by-id/scsi-36001405cdd5ac8d40e548449318510c3 message <HANA SID>-db-1 clear
   
   <HANA SID>-db-1:~ # systemctl start pacemaker  
   
   <HANA SID>-db-1:~ # crm resource cleanup msl_SAPHana_<HANA SID>_HDB<instance number> <HANA SID>-db-1
   ```
   

   The resource state after the test:

   ```bash
   Clone Set: cln_SAPHanaTopology_<HANA SID>_HDB<instance number> [rsc_SAPHanaTopology_<HANA SID>_HDB<instance number>]
      Started: [ <HANA SID>-db-0 <HANA SID>-db-1 ]
   Master/Slave Set: msl_SAPHana_<HANA SID>_HDB<instance number> [rsc_SAPHana_<HANA SID>_HDB<instance number>]
      Masters: [ <HANA SID>-db-0 ]
      Slaves: [ <HANA SID>-db-1 ]
   Resource Group: g_ip_<HANA SID>_HDB<instance number>
      rsc_ip_<HANA SID>_HDB<instance number>   (ocf::heartbeat:IPaddr2):       Started <HANA SID>-db-0
      rsc_nc_<HANA SID>_HDB<instance number>   (ocf::heartbeat:azure-lb):      Started <HANA SID>-db-0
   ```
   

## Next steps

- [Azure Virtual Machines planning and implementation for SAP][planning-guide]
- [Azure Virtual Machines deployment for SAP][deployment-guide]
- [Azure Virtual Machines DBMS deployment for SAP][dbms-guide]
