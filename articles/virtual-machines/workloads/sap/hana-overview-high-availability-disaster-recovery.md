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

## High availability

Microsoft supports SAP HANA high-availability methods "out of the box," which include:

- **Storage replication:** The storage system's ability to replicate all data to another location (within, or separate from, the same datacenter). SAP HANA operates independently of this method.
- **HANA system replication:** The replication of all data in SAP HANA to a separate SAP HANA system. The recovery time objective is minimized through data replication at regular intervals. SAP HANA supports asynchronous, synchronous in-memory, and synchronous modes (recommended only for SAP HANA systems that are within the same datacenter or less than 100 KM apart). In the current design of HANA large-instance stamps, HANA system replication can be used for high availability only.
- **Host auto-failover:** A local fault-recovery solution to use as an alternative to system replication. When the master node becomes unavailable, one or more standby SAP HANA nodes are configured in scale-out mode and SAP HANA automatically fails over to another node.

For more information on SAP HANA high availability, see the following SAP information:

- [SAP HANA High-Availability Whitepaper](http://go.sap.com/documents/2016/05/f8e5eeba-737c-0010-82c7-eda71af511fa.html)
- [SAP HANA Administration Guide](http://help.sap.com/hana/SAP_HANA_Administration_Guide_en.pdf)
- [SAP Academy Video on SAP HANA System Replication](http://scn.sap.com/community/hana-in-memory/blog/2015/05/19/sap-hana-system-replication)
- [SAP Support Note #1999880 – FAQ on SAP HANA System Replication](https://bcs.wdf.sap.corp/sap/support/notes/1999880)
- [SAP Support Note #2165547 – SAP HANA Backup and Restore within SAP HANA System Replication Environment](https://websmp230.sap-ag.de/sap(bD1lbiZjPTAwMQ==)/bc/bsp/sno/ui_entry/entry.htm?param=69765F6D6F64653D3030312669765F7361706E6F7465735F6E756D6265723D3231363535343726)
- [SAP Support Note #1984882 – Using SAP HANA System Replication for Hardware Exchange with Minimum/Zero Downtime](https://websmp230.sap-ag.de/sap(bD1lbiZjPTAwMQ==)/bc/bsp/sno/ui_entry/entry.htm?param=69765F6D6F64653D3030312669765F7361706E6F7465735F6E756D6265723D3139383438383226)

## Disaster recovery

SAP HANA on Azure (large instances) is offered in two Azure regions in a geopolitical region. Between the two large-instance stamps of two different regions is a direct network connectivity for replicating data during disaster recovery. The replication of the data is storage-infrastructure based. The replication is not done by default. It is done for the customer configurations that ordered the disaster recovery. In the current design, HANA system replication can't be used for disaster recovery.

However, to take advantage of the disaster recovery, you need to start to design the network connectivity to the two different Azure regions. To do so, you need an Azure ExpressRoute circuit connection from on-premises in your main Azure region and another circuit connection from on-premises to your disaster-recovery region. This measure would cover a situation in which a complete Azure region, including a Microsoft enterprise edge router (MSEE) location, has an issue.

As a second measure, you can connect all Azure virtual networks that connect to SAP HANA on Azure (large instances) in one of the regions to both of those ExpressRoute circuits. This measure addresses a case where only one of the MSEE locations that connects your on-premises location with Azure goes off duty.

The following figure shows the optimal configuration for disaster recovery:

![Optimal configuration for disaster recovery](./media/hana-overview-high-availability-disaster-recovery/image1-optimal-configuration.png)

The optimal case for a disaster-recovery configuration of the network is to have two ExpressRoute circuits from on-premises to the two different Azure regions. One circuit goes to region #1, running a production instance. The second ExpressRoute circuit goes to region #2, running some non-production HANA instances. (This is important if an entire Azure region, including the MSEE and large-instance stamp, goes off the grid.)

As a second measure, the various virtual networks are connected to the various ExpressRoute circuits that are connected to SAP HANA on Azure (large instances). You can bypass the location where an MSEE is failing, or you can lower the recovery point objective for disaster recovery, as we discuss later.

The next requirements for a disaster-recovery setup are:

- You must order SAP HANA on Azure (large instances) SKUs of the same size as your production SKUs and deploy them in the disaster-recovery region. These instances can be used to run test, sandbox, or QA HANA instances.
- You must order a disaster-recovery profile for each of your SAP HANA on Azure (large instances) SKUs that you want to recover in the disaster-recovery site, if necessary. This action leads to the allocation of storage volumes, which are the target of the storage replication from your production region into the disaster-recovery region.

After you meet the preceding requirements, it is your responsibility to start the storage replication. In the storage infrastructure used for SAP HANA on Azure (large instances), the basis of storage replication is storage snapshots. To start the disaster-recovery replication, you need to perform:

- A snapshot of your boot LUN, as described earlier.
- A snapshot of your HANA-related volumes, as described earlier.

After you execute these snapshots, an initial replica of the volumes is seeded on the volumes that are associated with your disaster-recovery profile in the disaster-recovery region.

Subsequently, the most recent storage snapshot is used every hour to replicate the deltas that develop on the storage volumes.

The recovery point objective that's achieved with this configuration is from 60 to 90 minutes. To achieve a better recovery point objective in the disaster-recovery case, copy the HANA transaction log backups from SAP HANA on Azure (large instances) to the other Azure region. To achieve this recovery point objective, do the following:

1. Back up the HANA transaction log as frequently as possible to /hana/log/backup.
2. Copy the transaction log backups when they are finished to an Azure virtual machine (VM), which is in a virtual network that's connected to the SAP HANA on Azure (large instances) server.
3. From that VM, copy the backup to a VM that's in a virtual network in the disaster-recovery region.
4. Keep the transaction log backups in that region in the VM.

In case of disaster, after the disaster-recovery profile has been deployed on an actual server, copy the transaction log backups from the VM to the SAP HANA on Azure (large instances) that is now the primary server in the disaster-recovery region, and restore those backups. This recovery is possible because the state of HANA on the disaster-recovery disks is that of a HANA snapshot. This is the offset point for further restorations of transaction log backups.

## Backup and restore

One of the most important aspects to operating databases is making sure the database can be protected from various catastrophic events. These events can be caused by anything from natural disasters to simple user errors.

Backing up a database, with the ability to restore it to any point in time (such as before somebody deleted critical data), allows restoration to a state that is as close as possible to the way it was before the disruption occurred.

Two types of backups must be performed for best results:

- Database backups
- Transaction log backups

In addition to full database backups performed at an application-level, you can be even more thorough by performing backups with storage snapshots. Performing log backups is also important for restoring the database (and to empty the logs from already committed transactions).

SAP HANA on Azure (large instances) offers two backup and restore options:

- Do it yourself (DIY). After you calculate to ensure enough disk space, perform full database and log backups by using disk backup methods (to those disks). Over time, the backups are copied to an Azure storage account (after you set up an Azure-based file server with virtually unlimited storage), or use an Azure Backup vault or Azure cold storage. Another option is to use a third-party data protection tool, such as Commvault, to store the backups after they are copied to a storage account. The DIY backup option might also be necessary for data that needs to be stored for longer periods for compliancy and auditing purposes.
- Use the backup and restore functionality that the underlying infrastructure of SAP HANA on Azure (large instances) provides. This option fulfills the need for backups, and it makes manual backups nearly obsolete (except where data backups are required for compliance purposes). The rest of this section addresses the backup and restore functionality that's offered with HANA (large instances).

> [!NOTE]
> The snapshot technology that is used by the underlying infrastructure of HANA (large instances) has a dependency on SAP HANA snapshots. SAP HANA snapshots do not work in conjunction with SAP HANA Multitenant Database Containers. As a result, this method of backup cannot be used to deploy SAP HANA Multitenant Database Containers.

### Using storage snapshots of SAP HANA on Azure (large instances)

The storage infrastructure underlying SAP HANA on Azure (large instances) supports the notion of a storage snapshot of volumes. Both backup and restoration of a particular volume are supported, with the following considerations:

- Instead of database backups, storage volume snapshots are taken on a frequent basis.
- The storage snapshot initiates an SAP HANA snapshot before it executes the storage snapshot. This SAP HANA snapshot is the setup point for eventual log restorations after recovery of the storage snapshot.
- At the point where the storage snapshot is executed successfully, the SAP HANA snapshot is deleted.
- Log backups are taken frequently and stored in the log backup volume or in Azure.
- If the database must be restored to a certain point in time, a request is made to Microsoft Azure Support (production outage) or SAP HANA on Azure Service Management to restore to a certain storage snapshot (for example, a planned restoration of a sandbox system to its original state).
- The SAP HANA snapshot that's included in the storage snapshot is an offset point for applying log backups that have been executed and stored after the storage snapshot was taken.
- These log backups are taken to restore the database back to a certain point in time.

Specifying the backup\_name creates a snapshot of the following volumes:

- hana/data
- hana/log
- hana/log\_backup (mounted as backup into hana/log)
- hana/shared

### Storage snapshot considerations

>[!NOTE]
>Storage snapshots are _not_ provided free of charge, because additional storage space must be allocated.

The specific mechanics of storage snapshots for SAP HANA on Azure (large instances) include:

- A specific storage snapshot (at the point in time when it is taken) consumes very little storage.
- As data content changes and the content in SAP HANA data files change on the storage volume, the snapshot needs to store the original block content.
- The storage snapshot increases in size. The longer the snapshot exists, the larger the storage snapshot becomes.
- The more changes made to the SAP HANA database volume over the lifetime of a storage snapshot, the larger the space consumption of the storage snapshot becomes.

SAP HANA on Azure (large instances) comes with fixed volume sizes for the SAP HANA data and log volume. Performing snapshots of those volumes eats into your volume space, so it is your responsibility to schedule storage snapshots (within the SAP HANA on Azure [large instances] process).

The following sections provide information for performing these snapshots, including general recommendations:

- Though the hardware can sustain 255 snapshots per volume, we highly recommend that you stay well below this number.
- Before you perform storage snapshots, monitor and keep track of free space.
- Lower the number of storage snapshots based on free space. You might need to lower the number of snapshots that you keep, or you might need to extend the volumes. (You can order additional storage in 1-TB units.)
- During activities such as moving data into SAP HANA with system migration tools (with R3load, or by restoring SAP HANA databases from backups), we highly recommended that you not perform any storage snapshots. (If a system migration is being done on a new SAP HANA system, storage snapshots would not need to be performed.)
- During larger reorganizations of SAP HANA tables, storage snapshots should be avoided if possible.
- Storage snapshots are a prerequisite to engaging the disaster-recovery capabilities of SAP HANA on Azure (large instances).

### Setting up storage snapshots

1. Make sure that Perl is installed in the Linux operating system on the HANA (large instances) server.
2. Modify /etc/ssh/ssh\_config to add the line _MACs hmac-sha1_.
3. Create an SAP HANA backup user account on the master node for each SAP HANA instance you are running (if applicable).
4. The SAP HANA HDB client must be installed on all SAP HANA (large instances) servers.
5. On the first SAP HANA (large instances) server of each region, a public key must be created to access the underlying storage infrastructure that controls snapshot creation.
6. Copy the script azure\_hana\_backup.pl from /scripts to the location of **hdbsql** of the SAP HANA installation.
7. Copy the HANABackupDetails.txt file from /scripts to the same location as the Perl script.
8. Modify the HANABackupDetails.txt file as necessary for the appropriate customer specifications.

### Step 1: Install SAP HANA HDBClient

The Linux installed on SAP HANA on Azure (large instances) includes the folders and scripts necessary to execute SAP HANA storage snapshots for backup and disaster-recovery purposes. However, it is your responsibility to install SAP HANA HDBclient while you are installing SAP HANA. (Microsoft installs neither the HDBclient nor SAP HANA.)

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

Create an SAP HANA user account within SAP HANA Studio for backup purposes. This account must have the following privileges: _Backup Admin_ and _Catalog Read_. In this example, the username SCADMIN is created.

![Creating a user in HANA Studio](./media/hana-overview-high-availability-disaster-recovery/image3-creating-user.png)

### Step 5: Authorize the SAP HANA user account

Authorize the SAP HANA user account (to be used by the scripts without requiring authorization every time the script is run). The SAP HANA command `hdbuserstore` allows the creation of an SAP HANA user key, which is stored on one or more SAP HANA nodes. The user key also allows the user to access SAP HANA without having to manage passwords from within the scripting process that's discussed later.

>[!IMPORTANT]
>Run the following command as `_root_`. Otherwise, the script cannot work properly.

Enter the `hdbuserstore` command as follows:

![Enter the hdbuserstore command](./media/hana-overview-high-availability-disaster-recovery/image4-hdbuserstore-command.png)

In the following example, where the user is SCADMIN01 and the hostname is lhanad01, the command is:
```
hdbuserstore set SCADMIN01 lhanad01:30115 <backup username> <password>
```
Manage all scripting from a single server for scale-out HANA instances. In this example, the SAP HANA key SCADMIN01 must be altered for each host in a way that reflects the host that is related to the key. That is, the SAP HANA backup account is amended with the instance number of the HANA DB, **lhanad**. The key must have administrative privileges on the host it is assigned to, and the backup user for scale-out must have access rights to all SAP HANA instances.
```
hdbuserstore set SCADMIN01 lhanad:30015 SCADMIN <password>
hdbuserstore set SCADMIN02 lhanad:30115 SCADMIN <password>
hdbuserstore set SCADMIN03 lhanad:30215 SCADMIN <password>
```

### Step 6: Copy items from the /scripts folder

Copy the following items from the /scripts folder (included on the gold image of the installation) to the working directory for **hdbsql**. For current HANA installations, this directory is /hana/shared/D01/exe/linuxx86\_64/hdb.
```
azure\_hana\_backup.pl
testHANAConnection.pl
testStorageSnapshotConnection.pl
removeTestStorageSnapshot.pl
HANABackupCustomerDetails.txt
```
Copy the following items if they are running scale-out or OLAP:
```
azure\_hana\_backup\_bw.pl
testHANAConnectionBW.pl
testStorageSnapshotConnectionBW.pl
removeTestStorageSnapshotBW.pl
HANABackupCustomerDetailsBW.txt
```
The HANABackupCustomerDetails.txt file is modifiable as follows for a scale-up deployment. It is the control and configuration file for the script that runs the storage snapshots. You should have received the _Storage Backup Name_ and _Storage IP Address_ from SAP HANA on Azure Service Management when your instances were deployed. You cannot modify the sequence, ordering, or spacing of any of the variables, or the script does not run properly.

For a scale-up deployment, the configuration file would look like:
```
#Provided by Microsoft Service Management
Storage Backup Name: lhanad01backup
Storage IP Address: 10.250.20.21
#Created by customer using hdbuserstore
HANA Backup Name: SCADMIND01
```
For a scale-out configuration, the HANABackupCustomerDetailsBW.txt file would look like:
```
#Provided by Microsoft Service Management
Storage Backup Name: lhanad01backup
Storage IP Address: 10.250.20.21
#Node IP addresses, instance numbers, and HANA backup name
#provided by customer.  HANA backup name created using
#hdbuserstore utility.
Node 1 IP Address: 10.254.15.21
Node 1 HANA instance number: 01
Node 1 HANA Backup Name: SCADMIN01
Node 2 IP Address: 10.254.15.22
Node 2 HANA instance number: 02
Node 2 HANA Backup Name: SCADMIN02
Node 3 IP Address: 10.254.15.23
Node 3 HANA instance number: 03
Node 3 HANA Backup Name: SCADMIN03
Node 4 IP Address: 10.254.15.24
Node 4 HANA instance number: 04
Node 4 HANA Backup Name: SCADMIN04
Node 5 IP Address: 10.254.15.25
Node 5 HANA instance number: 05
Node 5 HANA Backup Name: SCADMIN05
Node 6 IP Address: 10.254.15.26
Node 6 HANA instance number: 06
Node 6 HANA Backup Name: SCADMIN06
Node 7 IP Address: 10.254.15.27
Node 7 HANA instance number: 07
Node 7 HANA Backup Name: SCADMIN07
Node 8 IP Address: 10.254.15.28
Node 8 HANA instance number: 08
Node 8 HANA Backup Name: SCADMIN08
```
>[!NOTE]
>Currently, only Node 1 details are used in the actual HANA storage snapshot script. We recommend that you test access to or from all HANA nodes so that, if the master backup node ever changes, you have already ensured that any other node can take its place by modifying the details in Node 1.

To check for the correct configurations in the configuration file or proper connectivity to the HANA instances, run either of the following scripts:
- For a scale-up configuration (independent on SAP workload):

 ```
testHANAConnection.pl
```
- For a scale-out configuration:

 ```
testHANAConnectionBW.pl
```

Ensure that the master HANA instance has access to all required HANA servers. There are no parameters to the script, but you must complete the appropriate HANABackupCustomerDetails/ HANABackupCustomerDetailsBW file for the script to run properly. Because only the shell command error codes are returned, it is not possible for the script to error-check every instance. Even so, the script does provide some helpful comments for you to double-check.

To run the script:
```
 ./testHANAConnection.pl
```
 If the script successfully obtains the status of the HANA instance, it displays a message that the HANA connection was successful.

Additionally, there is a second type of script you can use to check the master HANA instance server's ability to sign in to the storage. Before you execute the azure\_hana\_backup(\_bw).pl script, you must execute the next script. If a volume contains no snapshots, it is impossible to determine whether the volume is simply empty or there is an ssh failure to obtain the snapshot details. For this reason, the script executes two steps:

- It verifies that the storage console is accessible.
- It creates a test, or dummy, snapshot for each volume by HANA instance.

For this reason, the HANA instance is included as an argument. Again, it is not possible to provide error checking for the storage connection, but the script provides helpful hints if the execution fails.

The script is run as:
```
 ./testStorageSnapshotConnection.pl <hana instance>
```
Or it is run as:
```
./testStorageSnapshotConnectionBW.pl <hana instance>
```
The script also displays a message that you are able to sign in appropriately to your deployed storage tenant, which is organized around the logical unit numbers (LUNs) that are used by the server instances you own.

Before you execute the first storage snapshot-based backups, run the next scripts to make sure that the configuration is correct.

After running these scripts, you can delete the snapshots by executing:
```
./removeTestStorageSnapshot.pl <hana instance>
```
Or
```
./removeTestStorageSnapshot.pl <hana instance>
```

### Step 7: Perform on-demand snapshots

Perform on-demand snapshots (as well as schedule regular snapshots by using cron) as described here.

For scale-up configurations, execute the following script:
```
./azure_hana_backup.pl lhanad01 customer 20
```
For scale-out configurations, execute the following script:
```
./azure_hana_backup_bw.pl lhanad01 customer 20
```
The scale-out script does some additional checking to make sure that all HANA servers can be accessed, and all HANA instances return appropriate status of the instance before proceeding with creating SAP HANA or storage snapshots.

The following arguments are required:

- The HANA instance requiring backup.
- The snapshot prefix for the storage snapshot.
- The number of snapshots to be kept for the specific prefix.

```
./azure_hana_backup.pl lhanad01 customer 20
```

The execution of the script creates the storage snapshot in these three distinct phases:

- Execute a HANA snapshot.
- Execute a storage snapshot.
- Remove the HANA snapshot.

Execute the script by calling it from the HDB executable folder that it was copied to. It backs up at least the following volumes, but it also backs up any volume that has the explicit SAP HANA instance name in the volume name.
```
hana_data_<hana instance>_prod_t020_vol
hana_log_<hana instance>_prod_t020_vol
hana_log_backup_<hana instance>_prod_t020_vol
hana_shared_<hana instance>_prod_t020_vol
```
The retention period is strictly administered, with the number of snapshots submitted as a parameter when you execute the script (such as 20, shown previously). So the amount of time is a function of the period of execution and the number of snapshots in the call of the script. If the number of snapshots that are kept exceeds the number that are named as a parameter in the call of the script, the oldest storage snapshot of this label (in our previous case, _custom_) is deleted before a new snapshot is executed. This means the number you give as the last parameter of the call is the number you can use to control the number of snapshots.

>[!NOTE]
>As soon as you change the label, the counting starts again.

You need to include the HANA instance name that's provided by SAP HANA on Azure Service Management as an argument if they are creating snapshots in multi-node environments. In single-node environments, the name of the SAP HANA on Azure (large instances) unit is sufficient, but the HANA instance name is still recommended.

Additionally, you can back up boot volumes\LUNs by using the same script. You must back up your boot volume at least once when you first run HANA, although we recommend a weekly or nightly backup schedule for booting in cron. Rather than add an SAP HANA instance name, insert _boot_ as the argument into the script as follows:
```
./azure_hana_backup boot customer 20
```
The same retention policy is afforded to the boot volume as well. Use on-demand snapshots, as described previously, for special cases only, such as during an SAP enhancement package (EHP) upgrade, or when you need to create a distinct storage snapshot.

We encourage you to perform scheduled storage snapshots using cron, and we recommend that you use the same script for all backups and disaster-recovery needs (modifying the script inputs to match the various requested backup times). These are all scheduled differently in cron depending on their execution time: hourly, 12-hour, daily, or weekly. The cron schedule is designed to create storage snapshots that match the previously discussed retention labeling for long-term off-site backup. The script includes commands to back up all production volumes, depending on their requested frequency (data and log files are backed up hourly, whereas the boot volume is backed up daily).

The entries in the following cron script run every hour at the tenth minute, every 12 hours at the tenth minute, and daily at the tenth minute. The cron jobs are created in such a way that only one SAP HANA storage snapshot takes place during any particular hour, so that the hourly and daily backups do not occur at the same time (12:10 AM). To help optimize your snapshot creation and replication, SAP HANA on Azure Service Management provides the recommended time for you to run your backups.

The default cron scheduling in /etc/crontab is as follows:
```
10 1-11,13-23 * * * ./azure_hana_backup.pl lhanad01 hourly 66
10 12 * * *  ./azure_hana_backup.pl lhanad01 12hour 14
```
In the previous cron instructions, the HANA volumes (without boot volume) get an hourly snapshot with the label. Of these snapshots, 66 are retained. Additionally, 14 snapshots with the 12-hour label are retained. You potentially get hourly snapshots for three days, plus 12-hour snapshots for another four days, which gives you an entire week of snapshots.

Scheduling within cron can be tricky, because only one script should be executed at any particular time, unless the scripts are staggered by several minutes. If you want daily backups for long-term retention, either a daily snapshot is kept along with a 12-hour snapshot (with a retention count of seven each), or the hourly snapshot is staggered to take place 10 minutes later. Only one daily snapshot is kept in the production volume.
```
10 1-11,13-23 * * * ./azure_hana_backup.pl lhanad01 hourly 66
10 12 * * *  ./azure_hana_backup.pl lhanad01 12hour 7
10 0 * * * ./azure_hana_backup.pl lhanad01 daily 7
```
The frequencies listed here are only examples. To derive your optimum number of snapshots, use the following criteria:

- Requirements in recovery time objective for point-in-time recovery.
- Space usage.
- Requirements in recovery point objective and recovery time objective for potential disaster recovery.
- Eventual execution of HANA full database backups against disks. Whenever a full database backup against disks, or _backint_ interface, is performed, the execution of storage snapshots fails. If you plan to execute full database backups on top of storage snapshots, make sure that the execution of storage snapshots is disabled during this time.

>[!IMPORTANT]
> The use of storage snapshots for SAP HANA backups is valid only when the snapshots are performed in conjunction with SAP HANA log backups. These log backups need to be able to cover the time periods between the storage snapshots. If you've set a commitment to users of a point-in-time recovery of 30 days, you need the following:

- Ability to access a storage snapshot that is 30 days old.
- Contiguous log backups over the last 30 days.

In the range of log backups, create a snapshot of the backup log volume as well. However, be sure to perform regular log backups so that you can:

- Have the contiguous log backups needed to perform point-in-time recoveries.
- Prevent the SAP HANA log volume from running out of space.

One of the last steps is to schedule SAP HANA backup logs in SAP HANA Studio. The SAP HANA backup log target destination is the specially created hana/log\_backups volume with the mount point of /hana/log/backups.

![Schedule SAP HANA backup logs in SAP HANA Studio](./media/hana-overview-high-availability-disaster-recovery/image5-schedule-backup.png)

You can choose backups that are more frequent than every 15 minutes. Some users even perform log backups every minute, although we do not recommend going _over_ 15 minutes.

The final step is to perform a file-based backup (after the initial installation of SAP HANA) to create a single backup entry that must exist within the backup catalog. Otherwise SAP HANA cannot initiate your specified log backups.

![Make a file-based backup to create a single backup entry](./media/hana-overview-high-availability-disaster-recovery/image6-make-backup.png)

### Monitoring the number and size of snapshots on the disk volume

On a particular storage volume, you can monitor the number of snapshots and the storage consumption of snapshots. The `ls` command doesn't show the snapshot directory or files. However, the Linux OS command `du` does, with the following commands:

- `du –sh .snapshot` provides a total of all snapshots within the snapshot directory.
- `du –sh --max-depth=1` lists all snapshots that are saved in the .snapshot folder and the size of each snapshot.
- `du –hc` provides the total size used by all snapshots.

Use these commands to make sure that the snapshots that are taken and stored are not consuming all the storage on the volumes.

### Reducing the number of snapshots on a server

As explained earlier, you can reduce the number of certain labels of snapshots that you store. The last two parameters of the command to initiate a snapshot are a label and the number of snapshots you want to retain.
```
./azure_hana_backup.pl lhanad01 customer 20
```
In the previous example, the snapshot label is _customer_ and the number of snapshots with this label to be retained is _20_. As you respond to disk space consumption, you might want to reduce the number of stored snapshots. The easy way to reduce the number of snapshots is to run the script with the last parameter set to 5:
```
./azure_hana_backup.pl lhanad01 customer 5
```
As a result of running the script with this setting, the number of snapshots, including the new storage snapshot, is _5_.

 >[!NOTE]
 > This script reduces the number of snapshots only if the most recent previous snapshot is more than one hour old. The script does not delete snapshots that are less than one hour old.

These restrictions are related to the optional disaster-recovery functionality offered.

If you no longer want to maintain a set of snapshots with that prefix, you can execute the script with _0_ as the retention number to remove all snapshots matching that prefix. However, removing all snapshots can affect the capabilities of disaster recovery.

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

## Monitoring the execution of snapshots

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
