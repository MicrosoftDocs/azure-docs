---
title: High availability and disaster recovery of SAP HANA on Azure (large instances) | Microsoft Docs
description: Establish high availability and plan for disaster recovery of SAP HANA on Azure (large instances).
services: virtual-machines-linux
documentationcenter:
author: RicksterCDN
manager: timlt
editor:

ms.service: virtual-machines-linux
ms.devlang: NA
ms.topic: article
ms.tgt_pltfrm: vm-linux
ms.workload: infrastructure
ms.date: 12/01/2016
ms.author: rclaus
ms.custom: H1Hack27Feb2017

---
# SAP HANA (large instances) high availability and disaster recovery on Azure 

High availability and disaster recovery are important aspects of running your mission-critical SAP HANA on Azure (large instances) servers. It's important to work with SAP, your system integrator, or Microsoft to properly architect and implement the right high-availability/disaster-recovery strategy. It is also important to consider the recovery point objective and recovery time objective, which are specific to your environment.

Currently supported High-Availability and Disaster Recovery methods can be seen in this table:

| Scenario supported in HANA Large Instances | High Availability Option | Disaster Recovery Option | Comments |
| --- | --- | --- | --- |
| Single Node | Not Available | Dedicated DR Setup<br /> Multipurpose DR Setup | |
| Host auto Failover: N+m<br /> including 1+1 | Possible with Standby taking active role<br /> HANA controls the role switch | Dedicated DR Setup<br /> Multipurpose DR Setup<br /> DR synchronization using storage replication | HANA volume sets attached to all the nodes (n+m)<br /> DR site must have the same number of nodes |
| HANA System Replication | Possible with Primary/Secondary setup<br /> Secondary moves in primary role in case of failover<br /> HANA System replication controls failover | Dedicated DR Setup<br /> | Multipurpose DR Setup<br /> DR synchronization using storage replication<br /> DR using HANA System Replication is not yet possible without 3rd party components | Separate set of disk volumes attached to each node<br /> One set of volumes required at DR site<br /> Storage replication maps to storage from production site to DR site | 

As Dedicated DR Setup we characterize a setup where the HANA Large Instance unit in the DR site is not used for running any other workload or test. The unit is passive and us held just for the case of jumping into action in the case of a disaster
As a Multipurpose DR Setup we characterize a setup on the DR site, where the HANA Large Instance unit runs a test or QA workload. In the disaster case that test or QA system would get shut down, the storage replicated (additional) volume sets mounted and the production HANA instance would get started.  

## High Availability 

Microsoft supports some SAP HANA high-availability methods "out of the box" with HANA Large Instances. These include:

- **Storage replication:** The storage system's ability to replicate all data to another HANA Large Instance Stamp in another Azure Region. SAP HANA operates independently of this method.
- **HANA system replication:** The replication of all data in SAP HANA to a separate SAP HANA system. The recovery time objective is minimized through data replication at regular intervals. SAP HANA supports asynchronous, synchronous in-memory, and synchronous modes (recommended only for SAP HANA systems that are within the same datacenter or less than 100 KM apart). In the current design of HANA large-instance stamps, HANA system replication can be used for high availability only. Due to some network design, HANA system Replication can't be used without third party reverse proxy for Disaster Recovery configurations into another Azure Region. 
- **Host auto-failover:** A local fault-recovery solution for SAP HANA to use as an alternative to HANA System Replication. When the master node becomes unavailable, one or more standby SAP HANA nodes are configured in scale-out mode and SAP HANA automatically fails over to another node.

For more information on SAP HANA high availability, see the following SAP information:

- [SAP HANA High-Availability Whitepaper](http://go.sap.com/documents/2016/05/f8e5eeba-737c-0010-82c7-eda71af511fa.html)
- [SAP HANA Administration Guide](http://help.sap.com/hana/SAP_HANA_Administration_Guide_en.pdf)
- [SAP Academy Video on SAP HANA System Replication](http://scn.sap.com/community/hana-in-memory/blog/2015/05/19/sap-hana-system-replication)
- [SAP Support Note #1999880 – FAQ on SAP HANA System Replication](https://bcs.wdf.sap.corp/sap/support/notes/1999880)
- [SAP Support Note #2165547 – SAP HANA Backup and Restore within SAP HANA System Replication Environment](https://websmp230.sap-ag.de/sap(bD1lbiZjPTAwMQ==)/bc/bsp/sno/ui_entry/entry.htm?param=69765F6D6F64653D3030312669765F7361706E6F7465735F6E756D6265723D3231363535343726)
- [SAP Support Note #1984882 – Using SAP HANA System Replication for Hardware Exchange with Minimum/Zero Downtime](https://websmp230.sap-ag.de/sap(bD1lbiZjPTAwMQ==)/bc/bsp/sno/ui_entry/entry.htm?param=69765F6D6F64653D3030312669765F7361706E6F7465735F6E756D6265723D3139383438383226)

## Disaster recovery requirements

SAP HANA on Azure (large instances) is offered in two Azure regions in meanwhile three different geopolitical regions (U.S., Australia and Europe). Two different regions hosting HANA Large Instance stamps are connected with separate dedicated network circuits that are used for replicating storage snapshots to provide disaster recovery methods. The replication is not established by default. It is setup for customers that ordered disaster recovery functionality. It is also not possible to choose an Azure Region as DR region which is in a different geopolitical area.

However, to take advantage of the disaster recovery, you need to start to design the network connectivity to the two different Azure regions. To do so, you need an Azure ExpressRoute circuit connection from on-premises in your main Azure region and another circuit connection from on-premises to your disaster-recovery region. This measure would cover a situation in which a complete Azure region, including a Microsoft Enterprise Edge router (MSEE) location, has an issue.

As a second measure, you can connect all Azure virtual networks that connect to SAP HANA on Azure (large instances) in one of the regions to both of those ExpressRoute circuits. This measure addresses a case where only one of the MSEE locations that connects your on-premises location with Azure goes off duty.

The following figure shows the optimal configuration for disaster recovery:

![Optimal configuration for disaster recovery](./media/hana-overview-high-availability-disaster-recovery/image1-optimal-configuration.png)

The optimal case for a disaster-recovery configuration of the network is to have two ExpressRoute circuits from on-premises to the two different Azure regions. One circuit goes to region #1, running a production instance. The second ExpressRoute circuit goes to region #2, running some non-production HANA instances. (This would important if an entire Azure region, including the MSEE and HANA Large Instance stamp, would go off the grid.)

As a second measure, the various virtual networks are connected to the various ExpressRoute circuits that are connected to SAP HANA on Azure (large instances). You can bypass the location where an MSEE is failing, or you can lower the recovery point objective for disaster recovery, as we discuss later.

The next requirements for a disaster-recovery setup are:

- You must order SAP HANA on Azure (large instances) SKUs of the same size as your production SKUs and deploy them in the disaster-recovery region. These instances can be used to run test, sandbox, or QA HANA instances. We refer to them as multi-usage units since we expect those units to have two HANA instances installed. One instance which is running and used as QA or test instance. Plus a dormant instance which would be the HANA instance taking over the production data in DR case. This instance is not up and running.  
- You must order additional storage on the DR site for each of your SAP HANA on Azure (large instances) SKUs that you want to recover in the disaster-recovery site, if necessary. This action leads to the allocation of storage volumes, which are the target of the storage replication from your production Azure region into the disaster-recovery Azure region.

More details on Disaster Recovery are following in the last chapters of the document.
 

## Backup and restore

One of the most important aspects to operating databases is making sure the database can be protected from various catastrophic events. These events can be caused by anything from natural disasters to simple user errors.

Backing up a database, with the ability to restore it to any point in time (such as before somebody deleted critical data), allows restoration to a state that is as close as possible to the way it was before the disruption occurred.

Two types of backups must be performed for best results:

- Database backups - full or differential backups
- Transaction log backups

In addition to full database backups performed at an application-level, you can be even more thorough by performing backups with storage snapshots. Performing log backups is also important for restoring the database (and to empty the logs from already committed transactions).

SAP HANA on Azure (large instances) offers two backup and restore options:

- Do it yourself (DIY). After you calculate to ensure enough disk space, perform full database and log backups by using disk backup methods either directly to volumes attached to the HANA Large Instance units of to NFS shares setup in an Azure VM. In case of performing the backup against volumes directly attached to HANA Large Instance units, the backups need to be copied to an Azure storage account (after you set up an Azure-based NFS server with virtually unlimited storage), or use an Azure Backup vault or Azure cold storage. Another option is to use a third-party data protection tool, such as Commvault, to store the backups after they are copied to a storage account. The DIY backup option might also be necessary for data that needs to be stored for longer periods for compliance and auditing purposes.
- Use the backup and restore functionality that the underlying infrastructure of SAP HANA on Azure (large instances) provides. This option fulfills the need for backups, and it makes manual backups nearly obsolete (except where data backups are required for compliance purposes). The rest of this section addresses the backup and restore functionality that's offered with HANA Large Instances.

> [!NOTE]
> The snapshot technology that is used by the underlying infrastructure of HANA Large Instances has a dependency on SAP HANA snapshots. SAP HANA snapshots do not work in conjunction with multiple tenants of SAP HANA Multitenant Database Containers so far. As a result, this method of backup cannot be used to deploy multiple tenants in SAP HANA Multitenant Database Containers.

### Using storage snapshots of SAP HANA on Azure (large instances)

The storage infrastructure underlying SAP HANA on Azure (large instances) supports the notion of a storage snapshot of volumes. Both backup and restoration of a particular volume are supported, with the following considerations:

- Instead of database backups, storage volume snapshots are taken on a frequent basis.
- The storage snapshot initiates an SAP HANA snapshot before it executes the storage snapshot. This SAP HANA snapshot is the setup point for eventual log restorations after recovery of the storage snapshot.
- At the point where the storage snapshot is executed successfully, the SAP HANA snapshot is deleted.
- Log backups are taken frequently and stored in the log backup volume or in Azure.
- If the database must be restored to a certain point in time, a request is made to Microsoft Azure Support (production outage) or SAP HANA on Azure Service Management to restore to a certain storage snapshot (for example, a planned restoration of a sandbox system to its original state).
- The SAP HANA snapshot that's included in the storage snapshot is an offset point for applying log backups that have been executed and stored after the storage snapshot was taken.
- These log backups are taken to restore the database back to a certain point in time.

You as a customer have the possibility to perform storage snapshots targetting three different classes of volumes:

- /hana/data, /hana/log and /hana/shared
- /hana/logbackup
- OS partition (only for 2-socket and 4-socket HANA Large Instance units)


### Storage snapshot considerations

>[!NOTE]
>Storage snapshots are _not_ consuming storage space that has been allocated to the HANA Large Instance units. Hence you need to consider the aspects below in terms of scheduling storage snapshots and keeping a number of storage snapshots. 

The specific mechanics of storage snapshots for SAP HANA on Azure (large instances) include:

- A specific storage snapshot (at the point in time when it is taken) consumes very little storage.
- As data content changes and the content in SAP HANA data files change on the storage volume, the snapshot needs to store the original block content.
- The storage snapshot increases in size. The longer the snapshot exists, the larger the storage snapshot becomes.
- The more changes made to the SAP HANA database volume over the lifetime of a storage snapshot, the larger the space consumption of the storage snapshot becomes.

SAP HANA on Azure (large instances) comes with fixed volume sizes for the SAP HANA data and log volume. Performing snapshots of those volumes eats into your volume space, so it is the customer's responsibility to schedule storage snapshots (within the SAP HANA on Azure [large instances] process). Only you as a customer can decide to eventually disable storage snapshots because you import masses of data or perform other significant changes to the HANA database. 

The following sections provide information for performing these snapshots, including general recommendations:

- Though the hardware can sustain 255 snapshots per volume, we highly recommend that you stay well below this number.
- Before you perform storage snapshots, monitor and keep track of free space.
- Lower the number of storage snapshots based on free space. You might need to lower the number of snapshots that you keep, or you might need to extend the volumes. (You can order additional storage in 1-TB units.)
- During activities such as moving data into SAP HANA with system migration tools (with R3load, or by restoring SAP HANA databases from backups), we highly recommended that you not perform any storage snapshots. (If a system migration is being done on a new SAP HANA system, storage snapshots would not need to be performed.)
- During larger reorganizations of SAP HANA tables, storage snapshots should be avoided if possible.
- Storage snapshots are a prerequisite to engaging the disaster-recovery capabilities of SAP HANA on Azure (large instances).

### Setting up storage snapshots

The rough steps to set up storage snapshots with HANA Large Instances look like:
1. Make sure that Perl is installed in the Linux operating system on the HANA (large instances) server.
2. Modify /etc/ssh/ssh\_config to add the line _MACs hmac-sha1_.
3. Create an SAP HANA backup user account on the master node for each SAP HANA instance you are running (if applicable).
4. The SAP HANA HDB client must be installed on all SAP HANA (large instances) servers.
5. On the first SAP HANA (large instances) server of each region, a public key must be created to access the underlying storage infrastructure that controls snapshot creation.
6. Copy the script azure\_hana\_backup.pl from /scripts to the location of **hdbsql** of the SAP HANA installation.
7. Copy the HANABackupDetails.txt file from /scripts to the same location as the Perl script.
8. Modify the HANABackupDetails.txt file as necessary for the appropriate customer specifications.

### Step 1: Install SAP HANA HDBClient

The Linux installed on SAP HANA on Azure (large instances) includes the folders and scripts necessary to execute SAP HANA storage snapshots for backup and disaster-recovery purposes. You might need to check for more recent releases in github (see later).
However, it is your responsibility to install SAP HANA HDBclient while you are installing SAP HANA. (Microsoft installs neither the HDBclient nor SAP HANA.)

### Step 2: Change /etc/ssh/ssh\_config

Change /etc/ssh/ssh\_config by adding _MACs hmac-sha1_ line as shown here:
```
#   RhostsRSAAuthentication no
#   RSAAuthentication yes
#   PasswordAuthentication yes
#   HostbasedAuthentication no
#   GSSAPIAuthentication no
#   GSSAPIDelegateCredentials no
#   GSSAPIKeyExchange no
#   GSSAPITrustDNS no
#   BatchMode no
#   CheckHostIP yes
#   AddressFamily any
#   ConnectTimeout 0
#   StrictHostKeyChecking ask
#   IdentityFile ~/.ssh/identity
#   IdentityFile ~/.ssh/id_rsa
#   IdentityFile ~/.ssh/id_dsa
#   Port 22
Protocol 2
#   Cipher 3des
#   Ciphers aes128-ctr,aes192-ctr,aes256-ctr,arcfour256,arcfour128,aes128-cbc,3des-cbc
#   MACs hmac-md5,hmac-sha1,umac-64@openssh.com,hmac-ripemd160
MACs hmac-sha1
#   EscapeChar ~
#   Tunnel no
#   TunnelDevice any:any
#   PermitLocalCommand no
#   VisualHostKey no
#   ProxyCommand ssh -q -W %h:%p gateway.example.com
```

### Step 3: Create a public key

On the first SAP HANA on Azure (large instances) server in each Azure region, create a public key to be used to access the storage infrastructure so that you can create snapshots. The public key ensures that a password is not required to sign in to the storage and that password credentials are not maintained. In Linux on the SAP HANA (large instances) server, execute the following command to generate the public key:
```
  ssh-keygen –t dsa –b 1024
```
The new location is _/root/.ssh/id\_dsa.pub. Do not enter an actual passphrase, or else you will be required to enter the passphrase each time you sign in. Instead, press **Enter** twice to remove the enter passphrase requirement for signing in.

Check to make sure that the public key was corrected as expected by changing folders to /root/.ssh/ and then executing the **ls** command. If the key is present, you can copy it by running the following command:

![Public key is copied by running this command](./media/hana-overview-high-availability-disaster-recovery/image2-public-key.png)

At this point, contact SAP HANA on Azure Service Management and provide the key. The service representative uses the public key to register it in the underlying storage infrastructure.

### Step 4: Create an SAP HANA user account

Create an SAP HANA user account within SAP HANA Studio for backup purposes. This account must have the following privileges: _Backup Admin_ and _Catalog Read_. In this example, the username SCADMIN is created. The user account name created in HANA studio is case-sensitive.  Make sure to click No on require user to change password on next login.

![Creating a user in HANA Studio](./media/hana-overview-high-availability-disaster-recovery/image3-creating-user.png)

### Step 5: Authorize the SAP HANA user account

Authorize the SAP HANA user account (to be used by the scripts without requiring authorization every time the script is run). The SAP HANA command `hdbuserstore` allows the creation of an SAP HANA user key, which is stored on one or more SAP HANA nodes. The user key also allows the user to access SAP HANA without having to manage passwords from within the scripting process that's discussed later.

>[!IMPORTANT]
>Run the following command as `root`. Otherwise, the script cannot work properly.

Enter the `hdbuserstore` command as follows:

![Enter the hdbuserstore command](./media/hana-overview-high-availability-disaster-recovery/image4-hdbuserstore-command.png)

In the following example, where the user is SCADMIN01 and the hostname is lhanad01, the command is:
```
hdbuserstore set SCADMIN01 lhanad01:30115 <backup username> <password>
```
In case of an SAP HANA scale-out configuration you should manage all scripting from a single server. In this example, the SAP HANA key SCADMIN01 must be altered for each host in a way that reflects the host that is related to the key. That is, the SAP HANA backup account is amended with the instance number of the HANA DB. The key must have administrative privileges on the host it is assigned to, and the backup user for scale-out must have access rights to all SAP HANA instances. Assuming the three scale-out nodes having the names lhanad01, lhanad02 and lhanad03, the sequence of commands would look like:

```
hdbuserstore set SCADMIN01 lhanad01:30015 SCADMIN <password>
hdbuserstore set SCADMIN02 lhanad02:30115 SCADMIN <password>
hdbuserstore set SCADMIN03 lhanad02:30215 SCADMIN <password>
```

### Step 6: Get snapshot scripts, configure snapshots and test configuration and connectivity

Download the most recent version of scripts from here:
Copy the downloaded scripts and the text file to the working directory for **hdbsql**. For current HANA installations, this directory is /hana/shared/D01/exe/linuxx86\_64/hdb.
```
azure\_hana\_backup.pl
azure\_hana\_replication\_status.pl
azure\_hana\_snapshot\_details.pl
azure\_hana\_snapshot\_delelte.pl
testHANAConnection.pl
testStorageSnapshotConnection.pl
removeTestStorageSnapshot.pl
HANABackupCustomerDetails.txt
```

The purpose of the different scripts and files looks like:

- **azure\_hana\_backup.pl**: This is the script that needs to be scheduled with cron to have storage snapshots performed on either the data/log/shared volumes, the log backup Volume or the OS (on for SKUs of S72, S72m, S144, S144m, S192 and S192m)
- **azure\_hana\_replication\_status.pl**: This is script is design to provide basic details around the replication status from the Production site to the Disaster Recovery site.  The script is designed to assure customers that replication is taking place and the sizes of items that are being replicated.  It will also provide guidance if a replication is taking too long or if the link is potentially down.
- **azure\_hana\_snapshot\_details.pl**: The purpose of this document is to provide the customer a list of basic details about all the snapshots per volume that exist in the customer’s environment. This script can be run in either location if there is an active server in the Disaster Recovery Location.  The script provides the following broken down by each volume that contains snapshots: the size of total snapshots in a volume, and then each snapshot in that volume with the following details: the snapshot name, create time, size of snapshot, the frequency of the snapshot, and the HANA Backup ID associated with that snapshot (if relevant).
- **azure\_hana\_snapshot\_delelte.pl**: This script is designed to delete a storage snapshot or set of snapshots by either using the SAP HANA backupid as found in HANA Studio or by the storage snapshot name itself.  Currently, the backupid is only tied to the snapshots created for the data filesystems.  Otherwise, if the snapshot id is entered it will seek all snapshots that match the entered snapshot.  
- **testHANAConnection.pl**: This script tests the connection to the SAP HANA instance.
- **testStorageSnapshotConnection.pl**: This script has two purposes. First, to ensure that the server used for scripts has access to the customer assigned storage area in HANA Large Instances before you run the backup scripts. Second purpose is, to create a temp snapshot for the HANA instance you are testing. This script should be run for every HANA instance on a server to ensure that the backup scripts function as expected.
- **removeTestStorageSnapshot.pl**: This script needs to be used to delete the test snapshot as created with the script testStorageSnapshotConnection.pl. Before you shcedule the real backups with azure\_hana\_backup.pl, make sure that the test snapshot gets deleted with this script.
- **HANABackupCustomerDetails.txt**: Is a modifiable configuration file that you need to modify to adapt to your SAP HANA configuration

 
The HANABackupCustomerDetails.txt file is modifiable as follows for a scale-up deployment. It is the control and configuration file for the script that runs the storage snapshots. You should have received the _Storage Backup Name_ and _Storage IP Address_ from SAP HANA on Azure Service Management when your instances were deployed. You cannot modify the sequence, ordering, or spacing of any of the variables, or the script does not run properly. Additionally you received the IP address of the scale-up node or the master node from SAP HANA on Azure Service Management. After you installed SAP HANA, you also know the HANA instance number and you then need to add the a backup name to the configuration file

For a scale-up or scale-out deployment, the configuration file would look like below after you filled the storage backup name and the storage IP address in. Further data you would need to get into the configuration file would be the single node or master node IP address, HANA instance number and fbackup name that you can choose:
```
#Provided by Microsoft Service Management
Storage Backup Name: client1hm3backup
Storage IP Address: 10.240.20.31
#Node IP addresses, instance numbers, and HANA backup name
#provided by customer.  HANA backup name created using
#hdbuserstore utility.
Node 1 IP Address: 
Node 1 HANA instance number:
Node 1 HANA Backup Name:
```

>[!NOTE]
>Currently, only Node 1 details are used in the actual HANA storage snapshot script. We recommend that you test access to or from all HANA nodes so that, if the master backup node ever changes, you have already ensured that any other node can take its place by modifying the details in Node 1.

After putting all the configuration data into the HANABackupCustomerDetails.txt file, you need to check whether the configurations are correct in regards to the HANA instance data using the script testHANAConnection.pl. This script is independent of a SAP HANA scaleup or scale-out configuration

```
testHANAConnection.pl
```

In case of scale-out, ensure that the master HANA instance has access to all required HANA servers and instances. There are no parameters to the test script, but you must complete adding your data into the HANABackupCustomerDetails.txt configuration file for the script to run properly. Because only the shell command error codes are returned, it is not possible for the script to error-check every instance. Even so, the script does provide some helpful comments for you to double-check.

To run the script:
```
 ./testHANAConnection.pl
```
If the script successfully obtains the status of the HANA instance, it displays a message that the HANA connection was successful.


The next test stpe is to check the connectivity to the storage as configured in the HANABackupCustomerDetails.txt configuration file and to execute a test snapshot.  Before you execute the azure\_hana\_backup.pl script, you must execute this test. If a volume contains no snapshots, it is impossible to determine whether the volume is simply empty or there is an ssh failure to obtain the snapshot details. For this reason, the script executes two steps:

- It verifies that the storage console is accessible for the scripts to execute snapshots.
- It creates a test, or dummy, snapshot for each volume by HANA instance.

For this reason, the HANA instance is included as an argument. Again, it is not possible to provide error checking for the storage connection, but the script provides helpful hints if the execution fails.

The script is run as:
```
 ./testStorageSnapshotConnection.pl <HANA SID>
```
Next the script will initiate a test login to the storage using the credentials provided in the HANABackupCustomerDetails.txt document. If successful, the following will be shown:

```
**********************Checking access to Storage**********************
Storage Access successful!!!!!!!!!!!!!!
```

In case of problems connecting to the storage console, the output would look like:

```
**********************Checking access to Storage**********************
WARNING: Storage check status command 'volume show -type RW -fields volume' failed: 65280
WARNING: Please check the following:
WARNING: Was publickey sent to Microsoft Service Team?
WARNING: If passphrase entered while using tool, publickey must be re-created and passphrase must be left blank for both entries
WARNING: Ensure correct IP address was entered in HANABackupCustomerDetails.txt
WARNING: Ensure correct Storage backup name was entered in HANABackupCustomerDetails.txt
WARNING: Ensure that no modification in format HANABackupCustomerDetails.txt like additional lines, line numbers or spacing
WARNING: ******************Exiting Script*******************************
```

After the successfully logging into the the storage console the script would continue with phase #2 and create test snapshot as shown here for a 3 node scale-out configuration:

```
**********************Creating Storage snapshot**********************
Taking snapshot testStorage.recent for hana_data_hm3_mnt00001_t020_dp ...
Snapshot created successfully.
Taking snapshot testStorage.recent for hana_data_hm3_mnt00001_t020_vol ...
Snapshot created successfully.
Taking snapshot testStorage.recent for hana_data_hm3_mnt00002_t020_dp ...
Snapshot created successfully.
Taking snapshot testStorage.recent for hana_data_hm3_mnt00002_t020_vol ...
Snapshot created successfully.
Taking snapshot testStorage.recent for hana_data_hm3_mnt00003_t020_dp ...
Snapshot created successfully.
Taking snapshot testStorage.recent for hana_data_hm3_mnt00003_t020_vol ...
Snapshot created successfully.
Taking snapshot testStorage.recent for hana_log_backups_hm3_t020_dp ...
Snapshot created successfully.
Taking snapshot testStorage.recent for hana_log_backups_hm3_t020_vol ...
Snapshot created successfully.
Taking snapshot testStorage.recent for hana_log_hm3_mnt00001_t020_vol ...
Snapshot created successfully.
Taking snapshot testStorage.recent for hana_log_hm3_mnt00002_t020_vol ...
Snapshot created successfully.
Taking snapshot testStorage.recent for hana_log_hm3_mnt00003_t020_vol ...
Snapshot created successfully.
Taking snapshot testStorage.recent for hana_shared_hm3_t020_vol ...
Snapshot created successfully.
```

If the test snapshot has been executed successfully with the script, everything is fine to proceed with configuring the actual storage snapshots. If there was no success, please investigate the issues before going ahead. The test snapshot created should stay around until the first real snapshots have been done.



### Step 7: Perform snapshots

As all the preparation steps have been finished we can now start to configure the actual storage snapshot configuration. The script to be scheduled works with SAP HANA scale-up and scale-out configurations. The idea is that you schedule the execution of the scripts via cron. 

There are three type of snapshot backups that can be made:
- HANA: snapshot backup where the volumes containing /hana/data, /hana/log, /hana/shared and /usr/sap are getting covered by the snapshots. We usually recommend to perform these types of snapshots on an hourly bases if you use the disaster recovery functionality offered by the HANA Large Instance infrastructure. Otherwise you might be fine using this snapshot on a daily or 12h basis. For the case of using the duisaster recovery functionality, this snapshot is replicated on an hourly basis. Lowering the time of performing this snapshot to less than 1h will not make the storage replication to the DR site more frequent. A single file restore is possible from this snapshot.
- Logs: snapshot backup of the /hana/log/backup volume. No other volume will experience a snapshot. This is the volume meant to contain SAP HANA transaction log backups which are performed more frequently in order to restrict log growth and prevent potential data loss. If you use the disaster recovery functionality of the HANA Large Instance infrastructure, the recommendation is to schedule these 'logs' snapshot every 15 minutes which would give you an RPO on the DR side of 25-30min. A single file restore is possible from this snapshot. You should not lower the frequency below 5 minutes.
- Boot: snapshot of the volume that contains the boot LUN of the HANA Large Instance. This snapshot backup is only possible with the following SKUs of HANA Large Instances: S72, S72m, S144, S144m, S192 and S192m. Please also note that you can't perform single file restores from the snapshot of the volume that contains the boot LUN.   

The call syntax for these three different types of snapshots would look like:
```
HANA backup covering /hana/data, /hana/log, /hana/shared and /usr/sap
./azure_hana_backup.pl hana <HANA SID> manual 30

For /hana/log/backups snapshot
./azure_hana_backup.pl logs <HANA SID> manual 30

For snapshot of the volume storing the boot LUN
./azure_hana_backup.pl boot <HANA SID> manual 30

```

The following parameter need to be specified:

- The first parameter to be specified characterizes the type of the snapshot backup. As values allowed we have 'hana', 'log' and 'boot'
- The second value is the HANA SID (like HM3)
- The third parameter is a snapshot prefix. It is expected that it stays the same for scheduled snapshots of a specific type.
- The fourth parameter defines the retention of the snapshots indirectly by defining the number of snapshots of this type to be kept. This is parameter is usually important for scheduled execution through cron. 

The scale-out script does some additional checking to make sure that all HANA servers can be accessed, and all HANA instances return appropriate status of the instance before proceeding with creating SAP HANA or storage snapshots.

The execution of the script creates the storage snapshot in these three distinct phases:

- Execute a HANA snapshot.
- Execute a storage snapshot.
- Remove the HANA snapshot.

Execute the script by calling it from the HDB executable folder that it was copied to. 

The retention period is strictly administered, with the number of snapshots submitted as a parameter when you execute the script (such as 20, shown previously). So the amount of time is a function of the period of execution and the number of snapshots in the call of the script. If the number of snapshots that are kept exceeds the number that are named as a parameter in the call of the script, the oldest storage snapshot of this label (in our previous case, _manual_) is deleted before a new snapshot is executed. This means the number you give as the last parameter of the call is the number you can use to control the number of snapshots that are kept. With that you also can control the indirectly the disk space used for snapshots. 


>[!NOTE]
>As soon as you change the label, the counting starts again. Means you need to be strict in labeling.


We encourage you to perform scheduled storage snapshots using cron, and we recommend that you use the same script for all backups and disaster-recovery needs (modifying the script inputs to match the various requested backup times). These are all scheduled differently in cron depending on their execution time: hourly, 12-hour, daily, or weekly. The cron schedule is designed to create storage snapshots that match the previously discussed retention labeling for long-term off-site backup. The script includes commands to back up all production volumes, depending on their requested frequency (data and log files are backed up hourly, whereas the boot volume is backed up daily).

The entries in the following cron script run every hour at the tenth minute, every 12 hours at the tenth minute, and daily at the tenth minute. The cron jobs are created in such a way that only one SAP HANA storage snapshot takes place during any particular hour, so that the hourly and daily backups do not occur at the same time (12:10 AM). To help optimize your snapshot creation and replication, SAP HANA on Azure Service Management provides the recommended time for you to run your backups.

The default cron scheduling in /etc/crontab is as follows:
```
10 1-11,13-23 * * * ./azure_hana_backup.pl hana HM3 hourly 66
10 12 * * *  ./azure_hana_backup.pl HM3 12hour 14
```
Scheduling within cron can be tricky, because only one script should be executed at any particular time, unless the scripts are staggered by several minutes. If you want daily backups for long-term retention, either a daily snapshot is kept along with a 12-hour snapshot (with a retention count of seven each), or the hourly snapshot is staggered to take place 10 minutes later. Only one daily snapshot is kept in the production volume.
```
10 1-11,13-23 * * * ./azure_hana_backup.pl lhanad01 hourly 66
10 12 * * *  ./azure_hana_backup.pl lhanad01 12hour 7
10 0 * * * ./azure_hana_backup.pl lhanad01 daily 7
```
The frequencies listed here are only examples. To derive your optimum number of snapshots, use the following criteria:

- Requirements in recovery time objective for point-in-time recovery.
- Space usage.
- Requirements in recovery point objective and recovery time objective for potential disaster recovery (hourly for 'hana' type backup and 5-15 minute frequency for /hana/log/backups volume).
- Eventual execution of HANA full database backups against disks. Whenever a full database backup against disks, or _backint_ interface, is performed, the execution of storage snapshots fails. If you plan to execute full database backups on top of storage snapshots, make sure that the execution of storage snapshots is disabled during this time.
- Number of snapshots per volume is limited to 255.

>[!IMPORTANT]
> The use of storage snapshots for SAP HANA backups is valid only when the snapshots are performed in conjunction with SAP HANA log backups. These log backups need to be able to cover the time periods between the storage snapshots. If you've set a commitment to users of a point-in-time recovery of 30 days, you need the following:

- Ability to access a storage snapshot that is 30 days old.
- Contiguous log backups over the last 30 days.

In the range of log backups, create a snapshot of the backup log volume as well. However, be sure to perform regular log backups so that you can:

- Have the contiguous log backups needed to perform point-in-time recoveries.
- Prevent the SAP HANA log volume from running out of space.

In order to be able to benefit from storage snapshots and eventual storage replication of transaction log backups, you need to change the location SAP HANA writes the log backups to. This can be done in HANA Studio below. Though SAP HANA is backing up full log segments automatically, you might want to specify a log backup intervall to be deterministic. Especially with using the disaster recovery option, you usually want to execute log backups with a deterministic period. In the case below we took 15 minutes as log backup interval.

![Schedule SAP HANA backup logs in SAP HANA Studio](./media/hana-overview-high-availability-disaster-recovery/image5-schedule-backup.png)

You can choose backups that are more frequent than every 15 minutes. Some users even perform log backups every minute, although we do not recommend going _over_ 15 minutes. 

The final step is to perform a file-based database backup if the database has never been backed up before to create a single backup entry that must exist within the backup catalog. Otherwise SAP HANA cannot initiate your specified log backups.

![Make a file-based backup to create a single backup entry](./media/hana-overview-high-availability-disaster-recovery/image6-make-backup.png)


After your first successful storage snapshots have been executed you also can delete the test snapshot that was executed in step 6. In order to do so, you need to run the script removeTestStorageSnapshot.pl like shown below:
```
./removeTestStorageSnapshot.pl <hana instance>
```

### Monitoring the number and size of snapshots on the disk volume

On a particular storage volume, you can monitor the number of snapshots and the storage consumption of snapshots. The `ls` command doesn't show the snapshot directory or files. However, the Linux OS command `du` does, with the following commands:

- `du –sh .snapshot` provides a total of all snapshots within the snapshot directory.
- `du –sh --max-depth=1` lists all snapshots that are saved in the .snapshot folder and the size of each snapshot.
- `du –hc` provides the total size used by all snapshots.

Use these commands to make sure that the snapshots that are taken and stored are not consuming all the storage on the volumes.

>[!NOTE]
>The snapshots of the boot LUN are not visible with the commands above.

### Getting details of snapshots
In order to get more details on snapshots you also can use the script azure\_hana\_snapshot\_details.pl. This script. This script can be run in either location if there is an active server in the Disaster Recovery Location.  The script provides the following broken down by each volume that contains snapshots: the size of total snapshots in a volume, and then each snapshot in that volume with the following details: the snapshot name, create time, size of snapshot, the frequency of the snapshot, and the HANA Backup ID associated with that snapshot (if relevant). The execution syntax of the script looks like:

```
./azure_hana_snapshot_details.pl 
```

Since the script tries to retrieve the HANA backupid, it needs to connect to the SAP HANA instance and thus requires the configuration file HANABackupCustomerDetails.txt to be correctly set. An output of two snapshots on of a volume could look like:

```
**********************************************************
****Volume: hana_shared_SAPTSTHDB100_t020_vol       ***********
**********************************************************
Total Snapshot Size:  411.8MB
----------------------------------------------------------
Snapshot:   customer.2016-09-20_1404.0
Create Time:   "Tue Sep 20 18:08:35 2016"
Size:   2.10MB
Frequency:   customer 
HANA Backup ID:   
----------------------------------------------------------
Snapshot:   customer2.2016-09-20_1532.0
Create Time:   "Tue Sep 20 19:36:21 2016"
Size:   2.37MB
Frequency:   customer2
HANA Backup ID:   
```


### File level restore from storage snapshot
For the snapshot types 'hana' and 'logs' you are able to access the snapshots directly on the volumes in the directory '.snapshot'. You will find a sub directory for each of the snapshots. You should be able to copy each file that got covered by the snapshot in the state it had at the point of the snapshot from that sub directory into the actual directory structure.

>[!NOTE]
>Single file restore will not work for snapshots of the boot LUN. You will not see the .snapshot directory in the boot LUN/volume. 


### Reducing the number of snapshots on a server

As explained earlier, you can reduce the number of certain labels of snapshots that you store. The last two parameters of the command to initiate a snapshot are a label and the number of snapshots you want to retain.

```
./azure_hana_backup.pl hana HM3 customer 20
```

In the previous example, the snapshot label is _customer_ and the number of snapshots with this label to be retained is _20_. As you respond to disk space consumption, you might want to reduce the number of stored snapshots. The easy way to reduce the number of snapshots is to run the script with the last parameter set to 5:

```
./azure_hana_backup.pl hana HM3 customer 5
```

As a result of running the script with this setting, the number of snapshots, including the new storage snapshot, is _5_.

 >[!NOTE]
 > This script reduces the number of snapshots only if the most recent previous snapshot is more than one hour old. The script does not delete snapshots that are less than one hour old.

These restrictions are related to the optional disaster-recovery functionality offered.

If you no longer want to maintain a set of snapshots with that prefix, you can execute the script with _0_ as the retention number to remove all snapshots matching that prefix. However, removing all snapshots can affect the capabilities of disaster recovery.

A second possibility to delete specific snapshots is to use the script azure\_hana\_snapshot\_delelte.pl. This script is designed to delete a snapshot or set of snapshots by either using the HANA backupid as found in studio or by the snapshot name itself.  Currently, the backupid is only tied to the snapshots created for the 'hana' snapshot type. If the snapshot name is entered it will seek all snapshots that match the entered snapshot. The call syntax of the script is:

```
./azure_hana_snapshot_delete.pl 

```

You need to execute the script as user _root_

If you selects snapshot, you have the capability of deleting each snapshot individually.  You will be asked first for the volume that contains the snapshot and then the actual snapshot name.  If the snapshot exists in that volume and is aged more than one hour, it will be deleted. You can find the volume names and snapshot names from the azure_hana_snapshot_details script. 

>[!IMPORTANT]
>If there is data that only exists on the snapshot you are deleting then the execution of the deletion means that the data is lost forever.

   

### Recovering to the most recent HANA snapshot

In the event that you experience a production-down scenario, the process of recovering from a storage snapshot can be initiated as a customer incident with SAP HANA on Azure Service Management. Such an unexpected scenario might be a high-urgency matter if data was deleted in a production system and the only way to retrieve the data is to restore the production database.

On the other hand, a point-in-time recovery could be low urgency and planned for days in advance. You can plan this recovery with SAP HANA on Azure Service Management instead of raising a high-priority issue. For example, you might be planning to try an upgrade of the SAP software by applying a new enhancement package, and you then need to revert back to a snapshot that represents the state before the EHP upgrade.

Before you issue the request, you need to do some preparation. SAP HANA on Azure Service Management team can then handle the request and provide the restored volumes. Afterward, it is up to you to restore the HANA database based on the snapshots. Here is how to prepare for the request:

>[!NOTE]
>Your user interface might vary from the following screenshots, depending on the SAP HANA release you are using.

1. Decide which snapshot to restore. Only the hana/data volume would be restored unless you are instructed otherwise.

2. Shut down the HANA instance.

 ![Shut down the HANA instance](./media/hana-overview-high-availability-disaster-recovery/image7-shutdown-hana.png)

3. Unmount the data volumes on each HANA database node. The restoration of the snapshot fails if the data volumes are not unmounted.

 ![Unmount the data volumes on each HANA database node](./media/hana-overview-high-availability-disaster-recovery/image8-unmount-data-volumes.png)

4. Open an Azure support request to instruct the restoration of a specific snapshot.

 - During the restoration: SAP HANA on Azure Service Management might ask you to attend a conference call to ensure that no data is getting lost.

 - After the restoration: SAP HANA on Azure Service Management notifies you when the storage snapshot has been restored.

5. After the restoration process is complete, remount all data volumes.

 ![Remount all data volumes](./media/hana-overview-high-availability-disaster-recovery/image9-remount-data-volumes.png)

6. Select recovery options within SAP HANA Studio, if they do not automatically come up when you reconnect to HANA DB through SAP HANA Studio. The following example shows a restoration to the last HANA snapshot. A storage snapshot embeds one HANA snapshot, and if you are restoring to the most recent storage snapshot, it should be the most recent HANA snapshot. (If you are restoring to older storage snapshots, you need to locate the HANA snapshot based on the time the storage snapshot was taken.)

 ![Select recover options within SAP HANA Studio](./media/hana-overview-high-availability-disaster-recovery/image10-recover-options-a.png)

7. Select **Recover the database to a specific data backup or storage snapshot**.

 ![The "Specify Recovery Type" window](./media/hana-overview-high-availability-disaster-recovery/image11-recover-options-b.png)

8. Select **Specify backup without catalog**.

 ![The "Specify Backup Location" window](./media/hana-overview-high-availability-disaster-recovery/image12-recover-options-c.png)

9. In the **Destination Type** list, select **Snapshot**.

 ![The "Specify the Backup to Recover" window](./media/hana-overview-high-availability-disaster-recovery/image13-recover-options-d.png)

10. Click **Finish** to start the recovery process.

 ![Click "Finish" to start the recovery process](./media/hana-overview-high-availability-disaster-recovery/image14-recover-options-e.png)

11. The HANA database is restored and recovered to the HANA snapshot that's included in the storage snapshot.

 ![HANA database is restored and recovered to the HANA snapshot](./media/hana-overview-high-availability-disaster-recovery/image15-recover-options-f.png)

### Recovering to the most recent state

The following process restores the HANA snapshot that is included in the storage snapshot. It then restores the transaction log backups to the most recent state of the database before restoring the storage snapshot.

>[!IMPORTANT]
>Before you proceed, make sure that you have a complete and contiguous chain of transaction log backups. Without these backups, you cannot restore the current state of the database.

1. Complete steps 1-6 of the preceding procedure in "Recovering to the most recent HANA snapshot."

2. Select **Recover the database to its most recent state**.

 ![Select "Recover the database to its most recent state"](./media/hana-overview-high-availability-disaster-recovery/image16-recover-database-a.png)

3. Specify the location of the most recent HANA log backups. The location needs to contain all HANA transaction log backups from the HANA snapshot to the most recent state.

 ![Specify the location of the most recent HANA log backups](./media/hana-overview-high-availability-disaster-recovery/image17-recover-database-b.png)

4. Select a backup as a base from which to recover the database. In our example, this is the HANA snapshot that was included in the storage snapshot. (Only one snapshot is listed in the following screenshot.)

 ![Select a backup as a base from which to recover the database](./media/hana-overview-high-availability-disaster-recovery/image18-recover-database-c.png)

5. Clear the **Use Delta Backups** check box if deltas do not exist between the time of the HANA snapshot and the most recent state.

 ![Clear the "Use Delta Backups" check box if no deltas exist](./media/hana-overview-high-availability-disaster-recovery/image19-recover-database-d.png)

6. On the summary screen, click **Finish** to start the restoration procedure.

 ![Click "Finish" on the summary screen](./media/hana-overview-high-availability-disaster-recovery/image20-recover-database-e.png)

### Recovering to another point in time
To recover to a point in time between the HANA snapshot (included in the storage snapshot) and one that is later than the HANA snapshot point-in-time recovery, do the following:

1. Make sure that you have all transaction log backups from the HANA snapshot to the time you want to recover.
2. Begin the procedure under "Recovering to the most recent state."
3. In step 2 of the procedure, in the **Specify Recovery Type** window, select **Recover the database to the following point in time**, specify the point in time, and then complete steps 3-6.

### Monitoring the execution of snapshots

You need to monitor the execution of storage snapshots. The script that executes a storage snapshot writes output to a file and then saves it to the same location as the Perl scripts. A separate file is written for each snapshot. The output of each file clearly shows the various phases that the snapshot script executes:

- Finding the volumes that need to create a snapshot
- Finding the snapshots taken from these volumes
- Deleting eventual existing snapshots to match the number of snapshots you specified
- Creating a HANA snapshot
- Creating the storage snapshot over the volumes
- Deleting the HANA snapshot
- Renaming the most recent snapshot to **.0**

The most important part of the script is this:
```
**********************Creating HANA snapshot**********************
Creating the HANA snapshot with command: "./hdbsql -n localhost -i 01 -U SCADMIN01 "backup data create snapshot"" ...
HANA snapshot created successfully.
**********************Creating Storage snapshot**********************
Taking snapshot hourly.recent for hana_data_lhanad01_t020_vol ...
Snapshot created successfully.
Taking snapshot hourly.recent for hana_log_backup_lhanad01_t020_vol ...
Snapshot created successfully.
Taking snapshot hourly.recent for hana_log_lhanad01_t020_vol ...
Snapshot created successfully.
Taking snapshot hourly.recent for hana_shared_lhanad01_t020_vol ...
Snapshot created successfully.
Taking snapshot hourly.recent for sapmnt_lhanad01_t020_vol ...
Snapshot created successfully.
**********************Deleting HANA snapshot**********************
Deleting the HANA snapshot with command: "./hdbsql -n localhost -i 01 -U SCADMIN01 "backup data drop snapshot"" ...
HANA snapshot deletion successfully.
```
You can see from this sample how the script records the creation of the HANA snapshot. In the scale-out case, this process is initiated on the master node. The master node initiates the synchronous creation of the snapshots on each of the worker nodes. Then the storage snapshot is taken. After the successful execution of the storage snapshots, the HANA snapshot is deleted.


## Disaster Recovery principles
With HANA Large Instances we offer a disaster recovery functionality between HANA Large Instance stamps in different Azure regions. Means if you deploy HANA large Instance units in the US West Region of Azure, you could leverage HANA Large Instance units in the US East region as Disaster Recovery units. As mentioned earlier, disaster recovery is not configured automatically since it requires you to pay for another HANA Large Instance unit in the DR region as well. The disaster recovery setup works for scale-up as well as scale-out setups. 

In the scenarios deployed so far, the customers used the unit in the DR region to run some QA or test systems that leveraged an installed HANA instance. The HANA Large Instance unit needs to be of the same SKU as the SKU used for production purposes. You then need to order some more disk volumes in order to have those used as targets for the storage replication from the production system into the DR site. The volumes which actually are getting replicated to the DR site are covering:

- /hana/data
- /hana/log
- /hana/shared
- /hana/log/backup
- /usr/sap

The basis of the disaster recovery functionality offered, is storage replication functionality offered by the HANA Large Instance infrastructure. the functionality used on the storage side is not a constant stream of changes being replicated in an asynchronous manner as changes happen to the storage. Instead it is a mechanism that relies on the fact that snapshots are created on a regular basis of these volumes. The changes between an already replicated snapshots and the snapshots not yet replicated are then transferred to the disaster recovery site into matching disk volumes (same size as production volumes. Sure the first time the complete data of a volume needs to be transferred before the amount of data is becoming smaller with deltas between snapshots. As a result the volumes in the DR site contain everyone of the volume snapshots performed in the production site. This allows you to eventually use that DR system to an earlier status in order to recover lost data without rolling back the production system.


>[!NOTE]
>In order to use the storage replication functionality, you need to first establish a storage snapshot schedule.

In order to minimize the Recovery Point Objective, we recommend the following storage snapshot schedule:
- One 'hana' type snapshot (see step 7 - Perform snapshots) every one hour
- One 'logs' type of snapshot every 5-15 minutes. This will give you an RPO of around 15-25 minutes.

To achieve a better recovery point objective in the disaster-recovery case, copy the HANA transaction log backups from SAP HANA on Azure (large instances) to the other Azure region. To achieve this recovery point objective reduction, do the following:

1. Back up the HANA transaction log as frequently as possible to /hana/log/backups.
2. Copy the transaction log backups, using rsync, when they are finished to NFS share hosted Azure virtual machines (VM), which are in Azure virtual networks in the Azure production region and in the DR regions. Both VNets need to be connected to the ExpressRoute circuit connecting the production HANA Large Instances to Azure (see graphics in the section: 'Disaster recovery requirements' of this document). 
3. Keep the transaction log backups in that region in the VM.
4. In case of disaster, after the disaster-recovery volumes have been mounted to the former QA HANA Large Instance unit, the transaction log backups not yet showing up in the newly mounted (and formerly replicated) /hana/log/backups volume would be copied from the NFS share into that volume. 
5. Now you could start a transaction log backup restore to the latest backup that could be saved over to the DR region.

## Disaster Recovery fail-over procedure
In case you want or need to fail over to the DR site, you look at a process where you will need to interact with the SAP HANA on Azure Operations. In rough steps the process so far looks like:

- Since you are running a QA or test instance of HANA on the DR unit of HANA Large Instances. You need to shutdown this instance. we assume that there is a dormant HANA production instance installed.
- You need to make sure that no SAP HANA processes are running anymore. You can do this check with the command: /usr/sap/hostctrl/exe/sapcontrol –nr <HANA instance number> - function GetProcessList. the output should show you the hdbdeamon process in a stopped state and no other HANA processes in a running or started state.
- Now you need to check to which snapshot name or HANA backupid you want to have the DR site restored. In real DR cases this is usually the latest one. However you might be in a situation where you need to recover lost data. Hence you would need to pick an earlier snapshot.
- You need to contact the SAP HANA on Azure Service Management through a high priority support request and ask for the restore of that snapshot/HANA backupid on the DR site. On the opreations side, the following steps will happen:
	- The replication of snapshots from production volume to DR volumes will be stopped
	- The storage snapshot/backupID you chose is getting restored
	- After the restore the volumes will be made mountable
- The next step on your side as customer is to mount the DR volumes to the DR HANA Large Instance unit 
- Now you can start the so far dormant SAP HANA production instance.
- if you chose to copy transaction log backup logs additionally to reduce th RPO time, you need to merge those transaction log backups into the newly mounted DR /hana/log/backups directory. Don't overwrite existing backups, but, just copy newer ones that have not been replicated by the storage.

The next sequence of steps involves the recovering the SAP HANA production instance based on the restored storage snapshot and the transaction log backups that are available. the steps look like:

Change the backup location to /hana/log/backups using SAP HANA Studio as seen below
 ![Change backup location for DR recovery](./media/hana-overview-high-availability-disaster-recovery/change_backup_location_dr1.png)

SAP HANA will scan through the backup file locations and suggest the most recent transaction log backup to be restored to. the scan can take a few minutes until a screen like the one below is shown:
 ![List of transaction log backups for DR recovery](./media/hana-overview-high-availability-disaster-recovery/backup_list_dr2.png)

In the next step you need to adjust some default settings by:

- De-Selecting 'Use Delta Backups'
- Selecting 'Initialize Log Area'
as shown below:

 ![Set initialize Log area](./media/hana-overview-high-availability-disaster-recovery/initialize_log_dr3.png)

In the next screen simply press finish as shown below:

 ![Finish DR restore](./media/hana-overview-high-availability-disaster-recovery/finish_dr4.png)

A progress window like this should appear. Please note the example is of a DR restore of a 3-node scale-out setup.

 ![Restore progress](./media/hana-overview-high-availability-disaster-recovery/restore_progress_dr5.png)

In cases where the restore seems to hang in the 'finish screen' and does not come up with the progress screen, check whether all the SAP HANA instances on the worker nodes are running. if necessary start them manually.


### Fail-back from DR to production site
We assume that the fail-over into the DR site was caused by issues in the production Azure region and not by you requiring to get back lost data. means you now were in production or a while in the DR site. As the problems in the production site are resolved, you would like to fail back with your production site. Since you can't lose data, the step back into the production site involves several steps and close cooperation with SAP HANA on Azure Operations. It is on you as a customer to trigger the operations to start synchronizing back to the production site once the problems got resolved.

The sequence of steps looks like:

- Operations gets the trigger to synchronize the production volumes from the Dr volumes which are representing production state now. In this state the HANA Large Instance unit in the production site is shutdown.
- Operations monitors the replication and makes sure that a catch up is achieved before informing you as a customer
- You need to shutdown the applications which use the production HANA Instance in the DR site. Then perform a HANA transaction log backup and then stop the HANA instance running on the HANA Large Instance units in the DR site
- After the HANA instance running in HANA Large Instance unit in the DR site is shut down, operation needs to manually synchronize the the disk volumes again.
- Operations will start the HANA Large Instance unit in the production site again and hand it over to you. Please make sure that the SAP HANA instance is shutdown.
- Now you need to perform the same steps database restore steps as you did them failing over to the DR site.

### Monitoring Disaster Recovery Replication

You are able to monitor the status of your storage replication progress by running the  script azure\_hana\_replication\_status.pl. This script must be run from the Disaster Recovery location otherwise it will not function as expected. The script will work regardless if replication is active.  The script can be run for every SAP HANA instance in the disaster recovery location. It cannot be used to obtain details about the boot volume.

Call the script like:
```
./replication_status.pl <HANA SID>
```

The output is broken down by volume into the following:  Link Status, Current Replication Activity,  Latest Snapshot Replicated, Size of Latest Snapshot, and Current lag time between last completed snapshot replication and now.  The link status will either show as Active unless the link between locations is down or a failover event is currently ongoing.  The replication activity addresses whether any data is currently being replicated, idle, or if other activities are currently happening to the link.  The last snapshot replicated should only display as snapmirror…. If the log_backups volume is displayed otherwise only the latest customer-generated snapshot will appear.  This is a good indication that either a snapshot was not created by you or there is an issue with replication.  The size of the last snapshot is then displayed. Finally, the lag time is shown. The lag time represents the time from the scheduled replication time to when the replication finishes.  A lag time may show greater than an hour for data replication even though replication has started.  The lag time will continue to increase until the ongoing replication finishes.

An example of an output can look like:

```
hana_data_hm3_mnt00002_t020_dp
-------------------------------------------------
Link Status: Broken-Off
Current Replication Activity: Idle
Latest Snapshot Replicated: snapmirror.c169b434-75c0-11e6-9903-00a098a13ceb_2154095454.2017-04-21_051515
Size of Latest Snapshot Replicated: 244KB
Current Lag Time between snapshots: -   ***Less than 90 minutes is acceptable***
```











