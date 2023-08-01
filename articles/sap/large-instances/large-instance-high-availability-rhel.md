---
title: Azure Large Instances high availability for SAP on RHEL
description: Learn how to automate an SAP HANA database failover using a Pacemaker cluster in Red Hat Enterprise Linux.
author: jaawasth
ms.author: jaawasth
ms.service: sap-on-azure
ms.subservice: sap-large-instances
ms.topic: how-to
ms.date: 04/19/2021
---

# Azure Large Instances high availability for SAP on RHEL

> [!NOTE]
> This article contains references to the terms *blacklist* and  *slave*, terms that Microsoft no longer uses. When the term is removed from the software, we’ll remove it from this article.

In this article, you learn how to configure the Pacemaker cluster in RHEL 7 to automate an SAP HANA database failover. You need to have a good understanding of Linux, SAP HANA, and Pacemaker to complete the steps in this guide.

The following table includes the host names that are used throughout this article. The code blocks in the article show the commands that need to be run, as well as the output of those commands. Pay close attention to which node is referenced in each command.

| Type | Host name | Node|
|-------|-------------|------|
|Primary host|`sollabdsm35`|node 1|
|Secondary host|`sollabdsm36`|node 2|

## Configure your Pacemaker cluster


Before you can begin configuring the cluster, set up SSH key exchange to establish trust between nodes.

1. Use the following commands to create identical `/etc/hosts` on both nodes.

    ```
    root@sollabdsm35 ~]# cat /etc/hosts
    27.0.0.1 localhost localhost.azlinux.com
    10.60.0.35 sollabdsm35.azlinux.com sollabdsm35 node1
    10.60.0.36 sollabdsm36.azlinux.com sollabdsm36 node2
    10.20.251.150 sollabdsm36-st
    10.20.251.151 sollabdsm35-st
    10.20.252.151 sollabdsm36-back
    10.20.252.150 sollabdsm35-back
    10.20.253.151 sollabdsm36-node
    10.20.253.150 sollabdsm35-node
    ```

2. Create and exchange the SSH keys.
    1. Generate ssh keys.

    ```
       [root@sollabdsm35 ~]# ssh-keygen -t rsa -b 1024
       [root@sollabdsm36 ~]# ssh-keygen -t rsa -b 1024
    ```
    2. Copy keys to the other hosts for passwordless ssh.

       ```
       [root@sollabdsm35 ~]# ssh-copy-id -i /root/.ssh/id_rsa.pub sollabdsm35
       [root@sollabdsm35 ~]# ssh-copy-id -i /root/.ssh/id_rsa.pub sollabdsm36
       [root@sollabdsm36 ~]# ssh-copy-id -i /root/.ssh/id_rsa.pub sollabdsm35
       [root@sollabdsm36 ~]# ssh-copy-id -i /root/.ssh/id_rsa.pub sollabdsm36
       ```

3. Disable selinux on both nodes.
    ```
    [root@sollabdsm35 ~]# vi /etc/selinux/config

    ...

    SELINUX=disabled

    [root@sollabdsm36 ~]# vi /etc/selinux/config

    ...

    SELINUX=disabled

    ```

4. Reboot the servers and then use the following command to verify the status of selinux.
    ```
    [root@sollabdsm35 ~]# sestatus

    SELinux status: disabled

    [root@sollabdsm36 ~]# sestatus

    SELinux status: disabled
    ```

5. Configure NTP (Network Time Protocol). The time and time zones for both cluster nodes must match. Use the following command to open `chrony.conf` and verify the contents of the file.
    1. The following contents should be added to config file. Change the actual values as per your environment.
        ```
        vi /etc/chrony.conf

         Use public servers from the pool.ntp.org project.

         Please consider joining the pool (http://www.pool.ntp.org/join.html).

        server 0.rhel.pool.ntp.org iburst
       ```

    2. Enable chrony service.

        ```
        systemctl enable chronyd

        systemctl start chronyd



        chronyc tracking

        Reference ID : CC0BC90A (voipmonitor.wci.com)

        Stratum : 3

        Ref time (UTC) : Thu Jan 28 18:46:10 2021

        chronyc sources

        210 Number of sources = 8

        MS Name/IP address Stratum Poll Reach LastRx Last sample

        ===============================================================================

        ^+ time.nullroutenetworks.c> 2 10 377 1007 -2241us[-2238us] +/- 33ms

        ^* voipmonitor.wci.com 2 10 377 47 +956us[ +958us] +/- 15ms

        ^- tick.srs1.ntfo.org 3 10 177 801 -3429us[-3427us] +/- 100ms
        ```

6. Update the System
    1. First, install the latest updates on the system before you start to install the SBD device.
    1. Customers must make sure that they have at least version 4.1.1-12.el7_6.26 of the resource-agents-sap-hana package installed, as documented in [Support Policies for RHEL High Availability Clusters - Management of SAP HANA in a Cluster](https://access.redhat.com/articles/3397471)
    1. If you don’t want a complete update of the system, even if it is recommended, update the following packages at a minimum.
        1. `resource-agents-sap-hana`
        1. `selinux-policy`
        1. `iscsi-initiator-utils`


        ```
        node1:~ # yum update
        ```

7. Install the SAP HANA and RHEL-HA repositories.

    ```
    subscription-manager repos –list

    subscription-manager repos
    --enable=rhel-sap-hana-for-rhel-7-server-rpms

    subscription-manager repos --enable=rhel-ha-for-rhel-7-server-rpms
    ```


8. Install the Pacemaker, SBD, OpenIPMI, ipmitool, and fencing_sbd tools on all nodes.

    ```
    yum install pcs sbd fence-agent-sbd.x86_64 OpenIPMI
    ipmitool
    ```

  ## Configure Watchdog

In this section, you learn how to configure Watchdog. This section uses the same two hosts, `sollabdsm35` and `sollabdsm36`, referenced at the beginning of this article.

1. Make sure that the watchdog daemon is not running on any systems.
    ```
    [root@sollabdsm35 ~]# systemctl disable watchdog
    [root@sollabdsm36 ~]# systemctl disable watchdog
    [root@sollabdsm35 ~]# systemctl stop watchdog
    [root@sollabdsm36 ~]# systemctl stop watchdog
    [root@sollabdsm35 ~]# systemctl status watchdog

    ● watchdog.service - watchdog daemon

    Loaded: loaded (/usr/lib/systemd/system/watchdog.service; disabled;
    vendor preset: disabled)

    Active: inactive (dead)

    Nov 28 23:02:40 sollabdsm35 systemd[1]: Collecting watchdog.service

    ```

2. The default Linux watchdog, that will be installed during the installation, is the iTCO watchdog which is not supported by UCS and HPE SDFlex systems. Therefore, this watchdog must be disabled.
    1. The wrong watchdog is installed and loaded on the system:
       ```
       sollabdsm35:~ # lsmod |grep iTCO

       iTCO_wdt 13480 0

       iTCO_vendor_support 13718 1 iTCO_wdt
       ```

    2. Unload the wrong driver from the environment:
       ```
       sollabdsm35:~ # modprobe -r iTCO_wdt iTCO_vendor_support

       sollabdsm36:~ # modprobe -r iTCO_wdt iTCO_vendor_support
       ```

    3. To make sure the driver is not loaded during the next system boot, the driver must be blocklisted. To blocklist the iTCO modules, add the following to the end of the `50-blacklist.conf` file:
       ```
       sollabdsm35:~ # vi /etc/modprobe.d/50-blacklist.conf

        unload the iTCO watchdog modules

       blacklist iTCO_wdt

       blacklist iTCO_vendor_support
       ```
    4. Copy the file to secondary host.
       ```
       sollabdsm35:~ # scp /etc/modprobe.d/50-blacklist.conf sollabdsm35:
       /etc/modprobe.d/50-blacklist.conf
       ```

    5. Test if the ipmi service is started. It is important that the IPMI timer is not running. The timer management will be done from the SBD pacemaker service.
       ```
       sollabdsm35:~ # ipmitool mc watchdog get

       Watchdog Timer Use: BIOS FRB2 (0x01)

       Watchdog Timer Is: Stopped

       Watchdog Timer Actions: No action (0x00)

       Pre-timeout interval: 0 seconds

       Timer Expiration Flags: 0x00

       Initial Countdown: 0 sec

       Present Countdown: 0 sec

       ```

3. By default the required device is /dev/watchdog will not be created.

    ```
    sollabdsm35:~ # ls -l /dev/watchdog

    ls: cannot access /dev/watchdog: No such file or directory
    ```

4. Configure the IPMI watchdog.

    ```
    sollabdsm35:~ # mv /etc/sysconfig/ipmi /etc/sysconfig/ipmi.org

    sollabdsm35:~ # vi /etc/sysconfig/ipmi

    IPMI_SI=yes
    DEV_IPMI=yes
    IPMI_WATCHDOG=yes
    IPMI_WATCHDOG_OPTIONS="timeout=20 action=reset nowayout=0
    panic_wdt_timeout=15"
    IPMI_POWEROFF=no
    IPMI_POWERCYCLE=no
    IPMI_IMB=no
    ```
5. Copy the watchdog config file to secondary.
    ```
    sollabdsm35:~ # scp /etc/sysconfig/ipmi
    sollabdsm36:/etc/sysconfig/ipmi
    ```
6. Enable and start the ipmi service.
    ```
    [root@sollabdsm35 ~]# systemctl enable ipmi

    Created symlink from
    /etc/systemd/system/multi-user.target.wants/ipmi.service to
    /usr/lib/systemd/system/ipmi.service.

    [root@sollabdsm35 ~]# systemctl start ipmi

    [root@sollabdsm36 ~]# systemctl enable ipmi

    Created symlink from
    /etc/systemd/system/multi-user.target.wants/ipmi.service to
    /usr/lib/systemd/system/ipmi.service.

    [root@sollabdsm36 ~]# systemctl start ipmi
    ```
     Now the IPMI service is started and the device /dev/watchdog is created – But the timer is still stopped. Later the SBD will manage the watchdog reset and enables the IPMI timer.
7. Check that the /dev/watchdog exists but is not in use.
    ```
    [root@sollabdsm35 ~]# ipmitool mc watchdog get
    Watchdog Timer Use: SMS/OS (0x04)
    Watchdog Timer Is: Stopped
    Watchdog Timer Actions: No action (0x00)
    Pre-timeout interval: 0 seconds
    Timer Expiration Flags: 0x10
    Initial Countdown: 20 sec
    Present Countdown: 20 sec

    [root@sollabdsm35 ~]# ls -l /dev/watchdog
    crw------- 1 root root 10, 130 Nov 28 23:12 /dev/watchdog
    [root@sollabdsm35 ~]# lsof /dev/watchdog
    ```

## SBD configuration
In this section, you learn how to configure SBD. This section uses the same two hosts, `sollabdsm35` and `sollabdsm36`, referenced at the beginning of this article.

1. Make sure the iSCSI or FC disk is visible on both nodes. This example uses an FC-based SBD device. For more information about SBD fencing, see [Design Guidance for RHEL High Availability Clusters - SBD Considerations](https://access.redhat.com/articles/2941601) and [Support Policies for RHEL High Availability Clusters - sbd and fence_sbd](https://access.redhat.com/articles/2800691)
2. The LUN-ID must be identically on all nodes.

3. Check multipath status for the sbd device.
    ```
    multipath -ll
    3600a098038304179392b4d6c6e2f4b62 dm-5 NETAPP ,LUN C-Mode
    size=1.0G features='4 queue_if_no_path pg_init_retries 50
    retain_attached_hw_handle' hwhandler='1 alua' wp=rw
    |-+- policy='service-time 0' prio=50 status=active
    | |- 8:0:1:2 sdi 8:128 active ready running
    | `- 10:0:1:2 sdk 8:160 active ready running
    `-+- policy='service-time 0' prio=10 status=enabled
    |- 8:0:3:2 sdj 8:144 active ready running
    `- 10:0:3:2 sdl 8:176 active ready running
    ```

4. Creating the SBD discs and setup the cluster primitive fencing. This step must be executed on first node.
    ```
    sbd -d /dev/mapper/3600a098038304179392b4d6c6e2f4b62 -4 20 -1 10 create

    Initializing device /dev/mapper/3600a098038304179392b4d6c6e2f4b62
    Creating version 2.1 header on device 4 (uuid:
    ae17bd40-2bf9-495c-b59e-4cb5ecbf61ce)

    Initializing 255 slots on device 4

    Device /dev/mapper/3600a098038304179392b4d6c6e2f4b62 is initialized.
    ```

5. Copy the SBD config over to node2.
    ```
    vi /etc/sysconfig/sbd

    SBD_DEVICE="/dev/mapper/3600a09803830417934d6c6e2f4b62"
    SBD_PACEMAKER=yes
    SBD_STARTMODE=always
    SBD_DELAY_START=no
    SBD_WATCHDOG_DEV=/dev/watchdog
    SBD_WATCHDOG_TIMEOUT=15
    SBD_TIMEOUT_ACTION=flush,reboot
    SBD_MOVE_TO_ROOT_CGROUP=auto
    SBD_OPTS=

    scp /etc/sysconfig/sbd node2:/etc/sysconfig/sbd
    ```

6. Check that the SBD disk is visible from both nodes.
    ```
    sbd -d /dev/mapper/3600a098038304179392b4d6c6e2f4b62 dump

    ==Dumping header on disk /dev/mapper/3600a098038304179392b4d6c6e2f4b62

    Header version : 2.1

    UUID : ae17bd40-2bf9-495c-b59e-4cb5ecbf61ce

    Number of slots : 255
    Sector size : 512
    Timeout (watchdog) : 5
    Timeout (allocate) : 2
    Timeout (loop) : 1
    Timeout (msgwait) : 10

    ==Header on disk /dev/mapper/3600a098038304179392b4d6c6e2f4b62 is dumped
    ```

7. Add the SBD device in the SBD config file.

    ```
    # SBD_DEVICE specifies the devices to use for exchanging sbd messages
    # and to monitor. If specifying more than one path, use ";" as
    # separator.
    #

    SBD_DEVICE="/dev/mapper/3600a098038304179392b4d6c6e2f4b62"
    ## Type: yesno
     Default: yes
     # Whether to enable the pacemaker integration.
    SBD_PACEMAKER=yes
    ```

## Cluster initialization
In this section, you initialize the cluster. This section uses the same two hosts, `sollabdsm35` and `sollabdsm36`, referenced at the beginning of this article.

1. Set up the cluster user password (all nodes).
    ```
    passwd hacluster
    ```
2. Start PCS on all systems.
    ```
    systemctl enable pcsd
    ```


3. Stop the firewall and disable it on (all nodes).
    ```
    systemctl disable firewalld

     systemctl mask firewalld

    systemctl stop firewalld
    ```

4. Start pcsd service.
    ```
    systemctl start pcsd
    ```

5. Run the cluster authentication only from node1.

    ```
    pcs cluster auth sollabdsm35 sollabdsm36

        Username: hacluster

            Password:
            sollabdsm35.localdomain: Authorized
            sollabdsm36.localdomain: Authorized

     ```

6. Create the cluster.
    ```
    pcs cluster setup --start --name hana sollabdsm35 sollabdsm36
    ```


7. Check the cluster status.

    ```
    pcs cluster status

    Cluster name: hana

    WARNINGS:

    No stonith devices and `stonith-enabled` is not false

    Stack: corosync

    Current DC: sollabdsm35 (version 1.1.20-5.el7_7.2-3c4c782f70) -
    partition with quorum

    Last updated: Sat Nov 28 20:56:57 2020

    Last change: Sat Nov 28 20:54:58 2020 by hacluster via crmd on
    sollabdsm35

    2 nodes configured

    0 resources configured

    Online: [ sollabdsm35 sollabdsm36 ]

    No resources

    Daemon Status:

    corosync: active/disabled

    pacemaker: active/disabled

    pcsd: active/disabled
    ```

8. If one node is not joining the cluster check if the firewall is still running.

9. Create and enable the SBD Device
    ```
    pcs stonith create SBD fence_sbd devices=/dev/mapper/3600a098038303f4c467446447a
    ```

10. Stop the cluster restart the cluster services (on all nodes).

    ```
    pcs cluster stop --all
    ```

11. Restart the cluster services (on all nodes).

    ```
    systemctl stop pcsd
    systemctl stop pacemaker
    systemctl stop corocync
    systemctl enable sbd
    systemctl start corosync
    systemctl start pacemaker
    systemctl start pcsd
    ```

12. Corosync must start the SBD service.

    ```
    systemctl status sbd

    ● sbd.service - Shared-storage based fencing daemon

    Loaded: loaded (/usr/lib/systemd/system/sbd.service; enabled; vendor
    preset: disabled)

    Active: active (running) since Wed 2021-01-20 01:43:41 EST; 9min ago
    ```

13. Restart the cluster (if not automatically started from pcsd).

    ```
    pcs cluster start –-all

    sollabdsm35: Starting Cluster (corosync)...

    sollabdsm36: Starting Cluster (corosync)...

    sollabdsm35: Starting Cluster (pacemaker)...

    sollabdsm36: Starting Cluster (pacemaker)...
    ```


14. Enable fencing device settings.
    ```
    pcs stonith enable SBD --device=/dev/mapper/3600a098038304179392b4d6c6e2f4d65
    pcs property set stonith-watchdog-timeout=20
    pcs property set stonith-action=reboot
    ```


15. Check the new cluster status with now one resource.
    ```
    pcs status

    Cluster name: hana

    Stack: corosync

    Current DC: sollabdsm35 (version 1.1.16-12.el7-94ff4df) - partition
    with quorum

    Last updated: Tue Oct 16 01:50:45 2018

    Last change: Tue Oct 16 01:48:19 2018 by root via cibadmin on
    sollabdsm35

    2 nodes configured

    1 resource configured

    Online: [ sollabdsm35 sollabdsm36 ]

    Full list of resources:

    SBD (stonith:fence_sbd): Started sollabdsm35

    Daemon Status:

    corosync: active/disabled

    pacemaker: active/disabled

    pcsd: active/enabled

    sbd: active/enabled

    [root@node1 ~]#
    ```


16. Now the IPMI timer must run and the /dev/watchdog device must be opened by sbd.

    ```
    ipmitool mc watchdog get

    Watchdog Timer Use: SMS/OS (0x44)

    Watchdog Timer Is: Started/Running

    Watchdog Timer Actions: Hard Reset (0x01)

    Pre-timeout interval: 0 seconds

    Timer Expiration Flags: 0x10

    Initial Countdown: 20 sec

    Present Countdown: 19 sec

    [root@sollabdsm35 ~] lsof /dev/watchdog

    COMMAND PID USER FD TYPE DEVICE SIZE/OFF NODE NAME

    sbd 117569 root 5w CHR 10,130 0t0 323812 /dev/watchdog
    ```

17. Check the SBD status.

    ```
    sbd -d /dev/mapper/3600a098038304445693f4c467446447a list

    0 sollabdsm35 clear

    1 sollabdsm36 clear
    ```


18. Test the SBD fencing by crashing the kernel.

    * Trigger the Kernel Crash.

      ```
      echo c > /proc/sysrq-trigger

      System must reboot after 5 Minutes (BMC timeout) or the value which is
      set as panic_wdt_timeout in the /etc/sysconfig/ipmi config file.
      ```

    * Second test to run is to fence a node using PCS commands.

      ```
      pcs stonith fence sollabdsm36
      ```


19. For the rest of the SAP HANA clustering you can disable fencing by setting:

   * pcs property set `stonith-enabled=false`
   * It is sometimes easier to keep fencing deactivated during setup of the cluster, because you will avoid unexpected reboots of the system.
   * This parameter must be set to true for productive usage. If this parameter is not set to true, the cluster will be not supported.
   * pcs property set `stonith-enabled=true`

## HANA integration into the cluster

In this section, you integrate HANA into the cluster. This section uses the same two hosts, `sollabdsm35` and `sollabdsm36`, referenced at the beginning of this article.

The default and supported way is to create a performance optimized scenario where the database can be switched over directly. Only this scenario is described here in this document. In this case we recommend installing one cluster for the QAS system and a separate cluster for the PRD system. Only in this case it is possible to test all components before it goes into production.


* This process is build of the RHEL description on page:

  * https://access.redhat.com/articles/3004101

 ### Steps to follow to configure HSR

 | **Log Replication Mode**            | **Description**                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        |
| ----------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Synchronous in-memory (default)** | Synchronous in memory (mode=syncmem) means the log write is considered as successful, when the log entry has been written to the log volume of the primary and sending the log has been acknowledged by the secondary instance after copying to memory. When the connection to the secondary system is lost, the primary system continues transaction processing and writes the changes only to the local disk. Data loss can occur when primary and secondary fail at the same time as long as the secondary system is connected or when a takeover is executed, while the secondary system is disconnected. This option provides better performance because it is not necessary to wait for disk I/O on the secondary instance, but is more vulnerable to data loss.                                                                                                                                                                                                                                                                                                                     |
| **Synchronous**                     | Synchronous (mode=sync) means the log write is considered as successful when the log entry has been written to the log volume of the primary and the secondary instance. When the connection to the secondary system is lost, the primary system continues transaction processing and writes the changes only to the local disk. No data loss occurs in this scenario as long as the secondary system is connected. Data loss can occur, when a takeover is executed while the secondary system is disconnected. Additionally, this replication mode can run with a full sync option. This means that log write is successful when the log buffer has been written to the log file of the primary and the secondary instance. In addition, when the secondary system is disconnected (for example, because of network failure) the primary systems suspends transaction processing until the connection to the secondary system is reestablished. No data loss occurs in this scenario. You can set the full sync option for system replication only with the parameter \[system\_replication\]/enable\_full\_sync). For more information on how to enable the full sync option, see Enable Full Sync Option for System Replication.                                                                                                                                                                                                                                                                                                              |
| **Asynchronous**                    | Asynchronous (mode=async) means the primary system sends redo log buffers to the secondary system asynchronously. The primary system commits a transaction when it has been written to the log file of the primary system and sent to the secondary system through the network. It does not wait for confirmation from the secondary system. This option provides better performance because it is not necessary to wait for log I/O on the secondary system. Database consistency across all services on the secondary system is guaranteed. However, it is more vulnerable to data loss. Data changes may be lost on takeover.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      |

1. These are the actions to execute on node1 (primary).
    1. Make sure that the database log mode is set to normal.

       ```

       * su - hr2adm

       * hdbsql -u system -p $YourPass -i 00 "select value from
       "SYS"."M_INIFILE_CONTENTS" where key='log_mode'"



       VALUE

       "normal"
       ```
    2. SAP HANA system replication will only work after initial backup has been performed. The following command creates an initial backup in the `/tmp/` directory. Select a proper backup filesystem for the database.
       ```
       * hdbsql -i 00 -u system -p $YourPass "BACKUP DATA USING FILE
       ('/tmp/backup')"



       Backup files were created

       ls -l /tmp

       total 2031784

       -rw-r----- 1 hr2adm sapsys 155648 Oct 26 23:31 backup_databackup_0_1

       -rw-r----- 1 hr2adm sapsys 83894272 Oct 26 23:31 backup_databackup_2_1

       -rw-r----- 1 hr2adm sapsys 1996496896 Oct 26 23:31 backup_databackup_3_1

       ```

    3. Backup all database containers of this database.
       ```
       * hdbsql -i 00 -u system -p $YourPass -d SYSTEMDB "BACKUP DATA USING
       FILE ('/tmp/sydb')"

       * hdbsql -i 00 -u system -p $YourPass -d SYSTEMDB "BACKUP DATA FOR HR2
       USING FILE ('/tmp/rh2')"

       ```

    4. Enable the HSR process on the source system.
       ```
       hdbnsutil -sr_enable --name=DC1

       nameserver is active, proceeding ...

       successfully enabled system as system replication source site

       done.
       ```

    5. Check the status of the primary system.
       ```
       hdbnsutil -sr_state

       System Replication State


       online: true

       mode: primary

       operation mode: primary

       site id: 1

       site name: DC1



       is source system: true

       is secondary/consumer system: false

       has secondaries/consumers attached: false

       is a takeover active: false



       Host Mappings:

       ~~~~~~~~~~~~~~

       Site Mappings:

       ~~~~~~~~~~~~~~

       DC1 (primary/)

       Tier of DC1: 1

       Replication mode of DC1: primary

       Operation mode of DC1:

       done.
       ```

 2. These are the actions to execute on node2 (secondary).
     1. Stop the database.
       ```
       su – hr2adm

       sapcontrol -nr 00 -function StopSystem
       ```


     2. For SAP HANA2.0 only, copy the SAP HANA system `PKI SSFS_HR2.KEY` and `SSFS_HR2.DAT` files from primary node to secondary node.
       ```
       scp
       root@node1:/usr/sap/HR2/SYS/global/security/rsecssfs/key/SSFS_HR2.KEY
       /usr/sap/HR2/SYS/global/security/rsecssfs/key/SSFS_HR2.KEY



       scp
       root@node1:/usr/sap/HR2/SYS/global/security/rsecssfs/data/SSFS_HR2.DAT
       /usr/sap/HR2/SYS/global/security/rsecssfs/data/SSFS_HR2.DAT
       ```

     3. Enable secondary as the replication site.
       ```
       su - hr2adm

       hdbnsutil -sr_register --remoteHost=node1 --remoteInstance=00
       --replicationMode=syncmem --name=DC2



       adding site ...

       --operationMode not set; using default from global.ini/[system_replication]/operation_mode: logreplay

       nameserver node2:30001 not responding.

       collecting information ...

       updating local ini files ...

       done.

       ```

     4. Start the database.
       ```
       sapcontrol -nr 00 -function StartSystem
       ```

     5. Check the database state.
       ```
       hdbnsutil -sr_state

       ~~~~~~~~~
       System Replication State

       online: true

       mode: syncmem

       operation mode: logreplay

       site id: 2

       site name: DC2

       is source system: false

       is secondary/consumer system: true

       has secondaries/consumers attached: false

       is a takeover active: false

       active primary site: 1



       primary primarys: node1

       Host Mappings:



       node2 -> [DC2] node2

       node2 -> [DC1] node1



       Site Mappings:



       DC1 (primary/primary)

       |---DC2 (syncmem/logreplay)



       Tier of DC1: 1

       Tier of DC2: 2



       Replication mode of DC1: primary

       Replication mode of DC2: syncmem

       Operation mode of DC1: primary

       Operation mode of DC2: logreplay



       Mapping: DC1 -> DC2

       done.
       ~~~~~~~~~~~~~~
       ```

3. It is also possible to get more information on the replication status:
    ```
    ~~~~~
    hr2adm@node1:/usr/sap/HR2/HDB00> python
    /usr/sap/HR2/HDB00/exe/python_support/systemReplicationStatus.py

    | Database | Host | Port | Service Name | Volume ID | Site ID | Site
    Name | Secondary | Secondary | Secondary | Secondary | Secondary |
    Replication | Replication | Replication |

    | | | | | | | | Host | Port | Site ID | Site Name | Active Status |
    Mode | Status | Status Details |

    | SYSTEMDB | node1 | 30001 | nameserver | 1 | 1 | DC1 | node2 | 30001
    | 2 | DC2 | YES | SYNCMEM | ACTIVE | |

    | HR2 | node1 | 30007 | xsengine | 2 | 1 | DC1 | node2 | 30007 | 2 |
    DC2 | YES | SYNCMEM | ACTIVE | |

    | HR2 | node1 | 30003 | indexserver | 3 | 1 | DC1 | node2 | 30003 | 2
    | DC2 | YES | SYNCMEM | ACTIVE | |


    status system replication site "2": ACTIVE

    overall system replication status: ACTIVE

    Local System Replication State


    mode: PRIMARY

    site id: 1

    site name: DC1
    ```


#### Log Replication Mode Description

For more information about log replication mode, see the [official SAP documentation](https://help.sap.com/viewer/6b94445c94ae495c83a19646e7c3fd56/2.0.01/627bd11e86c84ec2b9fcdf585d24011c.html).


#### Network Setup for HANA System Replication


To ensure that the replication traffic is using the right VLAN for the replication, it must be configured properly in the `global.ini`. If you skip this step, HANA will use the Access VLAN for the replication, which might be undesired.


The following examples show the host name resolution configuration for system replication to a secondary site. Three distinct networks can be identified:

* Public network with addresses in the range of 10.0.1.*

* Network for internal SAP HANA communication between hosts at each site: 192.168.1.*

* Dedicated network for system replication: 10.5.1.*

In the first example, the `[system_replication_communication]listeninterface` parameter has been set to `.global` and only the hosts of the neighboring replicating site are specified.

In the following example, the `[system_replication_communication]listeninterface` parameter has been set to `.internal` and all hosts of both sites are specified.



For more information, see [Network Configuration for SAP HANA System Replication](https://www.sap.com/documents/2016/06/18079a1c-767c-0010-82c7-eda71af511fa.html).



For system replication, it is not necessary to edit the `/etc/hosts` file, internal ('virtual') host names must be mapped to IP addresses in the `global.ini` file to create a dedicated network for system replication. The syntax for this is as follows:

global.ini

[system_replication_hostname_resolution]

<ip-address_site>=<internal-host-name_site>


## Configure SAP HANA in a Pacemaker cluster
In this section, you learn how to configure SAP HANA in a Pacemaker cluster. This section uses the same two hosts, `sollabdsm35` and `sollabdsm36`, referenced at the beginning of this article.

Ensure you have met the following prerequisites:

* Pacemaker cluster is configured according to documentation and has proper and working fencing

* SAP HANA startup on boot is disabled on all cluster nodes as the start and stop will be managed by the cluster

* SAP HANA system replication and takeover using tools from SAP are working properly between cluster nodes

* SAP HANA contains monitoring account that can be used by the cluster from both cluster nodes

* Both nodes are subscribed to 'High-availability' and 'RHEL for SAP HANA' (RHEL 6,RHEL 7) channels



* In general, please execute all pcs commands only from on node because the CIB will be automatically updated from the pcs shell.

* [More info on quorum policy](https://access.redhat.com/solutions/645843)

### Steps to configure
1. Configure pcs.
    ```
    [root@node1 ~]# pcs property unset no-quorum-policy (optional – only if it was set before)
    [root@node1 ~]# pcs resource defaults resource-stickiness=1000
    [root@node1 ~]# pcs resource defaults migration-threshold=5000
    ```
2. Configure corosync.
    For more information, see [How can I configure my RHEL 7 High Availability Cluster with pacemaker and corosync](https://access.redhat.com/solutions/1293523).
    ```
    cat /etc/corosync/corosync.conf

    totem {

    version: 2

    secauth: off

    cluster_name: hana

    transport: udpu

    }



    nodelist {

    node {

    ring0_addr: node1.localdomain

    nodeid: 1

    }



    node {

    ring0_addr: node2.localdomain

    nodeid: 2

    }

    }



    quorum {

    provider: corosync_votequorum

    two_node: 1

    }



    logging {

    to_logfile: yes

    logfile: /var/log/cluster/corosync.log

    to_syslog: yes

    }

    ```


3. reate cloned SAPHanaTopology resource.

    SAPHanaTopology resource is gathering status and configuration of SAP
    HANA System Replication on each node. SAPHanaTopology requires
    following attributes to be configured.

    ```
    pcs resource create SAPHanaTopology_HR2_00 SAPHanaTopology SID=HR2 op start timeout=600 \
    op stop timeout=300 \
    op monitor interval=10 timeout=600 \
    clone clone-max=2 clone-node-max=1 interleave=true
    ```

    | Attribute Name | Description  |
    |---|---|
    | SID | SAP System Identifier (SID) of SAP HANA installation. Must be the same for all nodes. |
    | InstanceNumber | 2-digit SAP Instance Identifier.|

    * Resource status

      ```
      pcs resource show SAPHanaTopology_HR2_00

      Clone: SAPHanaTopology_HR2_00-clone
       Meta Attrs: clone-max=2 clone-node-max=1 interleave=true
       Resource: SAPHanaTopology_HR2_00 (class=ocf provider=heartbeat type=SAPHanaTopology)
        Attributes: InstanceNumber=00 SID=HR2
        Operations: monitor interval=60 timeout=60 (SAPHanaTopology_HR2_00-monitor-interval-60)
                    start interval=0s timeout=180 (SAPHanaTopology_HR2_00-start-interval-0s)
                    stop interval=0s timeout=60 (SAPHanaTopology_HR2_00-stop-interval-0s)
      ```

4. Create Primary/Secondary SAPHana resource.
    * SAPHana resource is responsible for starting, stopping, and relocating the SAP HANA database. This resource must be run as a Primary/Secondary cluster resource. The resource has the following attributes.

      | Attribute Name            | Required? | Default value | Description                                                                                                                                                                                                                                                                                                                                                                                                                                                             |
      |---------------------------|-----------|---------------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
      | SID                       | Yes       | None          | SAP System Identifier (SID) of SAP HANA installation. Must be same for all nodes.                                                                                                                                                                                                                                                                                                                                                                                       |
      | InstanceNumber            | Yes       | none          | 2-digit SAP Instance identifier.                                                                                                                                                                                                                                                                                                                                                                                                                                        |
      | PREFER_SITE_TAKEOVER      | no        | yes           | Should cluster prefer to switchover to secondary instance instead of restarting primary locally? ("no": Do prefer restart locally; "yes": Do prefer takeover to remote site)                                                                                                                                                                                                                                                                                            |
      |                           |           |               |                                                                                                                                                                                                                                                                                                                                                                                                                                                                      |
      | AUTOMATED_REGISTER        | no        | FALSE         | Should the former SAP HANA primary be registered as secondary after takeover and DUPLICATE_PRIMARY_TIMEOUT? ("false": no, manual intervention will be needed; "true": yes, the former primary will be registered by resource agent as secondary)                                                                                                                                                                                                                        |
      | DUPLICATE_PRIMARY_TIMEOUT | no        | 7200          | Time difference (in seconds) needed between primary time stamps, if a dual-primary situation occurs. If the time difference is less than the time gap, then the cluster holds one or both instances in a "WAITING" status. This is to give an admin a chance to react on a failover. A failed former primary will be registered after the time difference is passed. After this registration to the new primary, all data will be overwritten by the system replication. |

5. Create the HANA resource.

   ```
    pcs resource create SAPHana_HR2_00 SAPHana SID=HR2 InstanceNumber=00 PREFER_SITE_TAKEOVER=true DUPLICATE_PRIMARY_TIMEOUT=7200 AUTOMATED_REGISTER=true op start timeout=3600 \
    op stop timeout=3600 \
    op monitor interval=61 role="Slave" timeout=700 \
    op monitor interval=59 role="Master" timeout=700 \
    op promote timeout=3600 \
    op demote timeout=3600 \
    master meta notify=true clone-max=2 clone-node-max=1 interleave=true

    pcs resource show SAPHana_HR2_00-primary

    Primary: SAPHana_HR2_00-primary
     Meta Attrs: clone-max=2 clone-node-max=1 interleave=true notify=true
     Resource: SAPHana_HR2_00 (class=ocf provider=heartbeat type=SAPHana)
      Attributes: AUTOMATED_REGISTER=false DUPLICATE_PRIMARY_TIMEOUT=7200 InstanceNumber=00 PREFER_SITE_TAKEOVER=true SID=HR2
      Operations: demote interval=0s timeout=320 (SAPHana_HR2_00-demote-interval-0s)
                  monitor interval=120 timeout=60 (SAPHana_HR2_00-monitor-interval-120)
                  monitor interval=121 role=Secondary timeout=60 (SAPHana_HR2_00-monitor-
                  interval-121)
                  monitor interval=119 role=Primary timeout=60 (SAPHana_HR2_00-monitor-
                  interval-119)
                  promote interval=0s timeout=320 (SAPHana_HR2_00-promote-interval-0s)
                  start interval=0s timeout=180 (SAPHana_HR2_00-start-interval-0s)
                  stop interval=0s timeout=240 (SAPHana_HR2_00-stop-interval-0s)

    crm_mon -A1
    ....

    2 nodes configured

    5 resources configured

    Online: [ node1.localdomain node2.localdomain ]

    Active resources:

    .....

    Node Attributes:

    * Node node1.localdomain:

    + hana_hr2_clone_state : PROMOTED

    + hana_hr2_remoteHost : node2

    + hana_hr2_roles : 4:P:primary1:primary:worker:primary

    + hana_hr2_site : DC1

    + hana_hr2_srmode : syncmem

    + hana_hr2_sync_state : PRIM

    + hana_hr2_version : 2.00.033.00.1535711040

    + hana_hr2_vhost : node1

    + lpa_hr2_lpt : 1540866498

    + primary-SAPHana_HR2_00 : 150

    * Node node2.localdomain:

    + hana_hr2_clone_state : DEMOTED

    + hana_hr2_op_mode : logreplay

    + hana_hr2_remoteHost : node1

    + hana_hr2_roles : 4:S:primary1:primary:worker:primary

    + hana_hr2_site : DC2

    + hana_hr2_srmode : syncmem

    + hana_hr2_sync_state : SOK

    + hana_hr2_version : 2.00.033.00.1535711040

    + hana_hr2_vhost : node2

    + lpa_hr2_lpt : 30

    + primary-SAPHana_HR2_00 : 100
   ```

6. Create Virtual IP address resource.

   Cluster will contain Virtual IP address in order to reach the Primary instance of SAP HANA. Below is example command to create IPaddr2     resource with IP 10.7.0.84/24.

   ```
    pcs resource create vip_HR2_00 IPaddr2 ip="10.7.0.84"
    pcs resource show vip_HR2_00

    Resource: vip_HR2_00 (class=ocf provider=heartbeat type=IPaddr2)

        Attributes: ip=10.7.0.84

        Operations: monitor interval=10s timeout=20s
    (vip_HR2_00-monitor-interval-10s)

        start interval=0s timeout=20s (vip_HR2_00-start-interval-0s)

        stop interval=0s timeout=20s (vip_HR2_00-stop-interval-0s)
   ```

7. Create constraints.

   * For correct operation, we need to ensure that SAPHanaTopology resources are started before starting the SAPHana resources, and also that the virtual IP address is present on the node where the Primary resource of SAPHana is running. To achieve this, the following 2 constraints need to be created.
     ```
     pcs constraint order SAPHanaTopology_HR2_00-clone then SAPHana_HR2_00-primary symmetrical=false
     pcs constraint colocation add vip_HR2_00 with primary SAPHana_HR2_00-primary 2000
     ```

###  Testing the manual move of SAPHana resource to another node

#### (SAP Hana takeover by cluster)

To test out the move of the SAPHana resource from one node to another, use the command below. Note that the option `--primary` should not be used when running the following command because of how the SAPHana resource works internally.

`pcs resource move SAPHana_HR2_00-primary`

After each pcs resource move command invocation, the cluster creates location constraints to achieve the move of the resource. These constraints must be removed to allow automatic failover in the future.
To remove them you can use the command following command.

```
pcs resource clear SAPHana_HR2_00-primary
crm_mon -A1
Node Attributes:
    * Node node1.localdomain:
    + hana_hr2_clone_state : DEMOTED
    + hana_hr2_remoteHost : node2
    + hana_hr2_roles : 2:P:primary1::worker:
    + hana_hr2_site : DC1
    + hana_hr2_srmode : syncmem
    + hana_hr2_sync_state : PRIM
    + hana_hr2_version : 2.00.033.00.1535711040
    + hana_hr2_vhost : node1
    + lpa_hr2_lpt : 1540867236
    + primary-SAPHana_HR2_00 : 150
    * Node node2.localdomain:
    + hana_hr2_clone_state : PROMOTED
    + hana_hr2_op_mode : logreplay
    + hana_hr2_remoteHost : node1
    + hana_hr2_roles : 4:S:primary1:primary:worker:primary
    + hana_hr2_site : DC2
    + hana_hr2_srmode : syncmem
    + hana_hr2_sync_state : SOK
    + hana_hr2_version : 2.00.033.00.1535711040
    + hana_hr2_vhost : node2
    + lpa_hr2_lpt : 1540867311
    + primary-SAPHana_HR2_00 : 100
```

* Login to HANA as verification.

  * demoted host:

    ```
    hdbsql -i 00 -u system -p $YourPass -n 10.7.0.82

    result:

            * -10709: Connection failed (RTE:[89006] System call 'connect'
    failed, rc=111:Connection refused (10.7.0.82:30015))
    ```

  * Promoted host:

    ```
    hdbsql -i 00 -u system -p $YourPass -n 10.7.0.84

    Welcome to the SAP HANA Database interactive terminal.



    Type: \h for help with commands

    \q to quit



    hdbsql HR2=>




    DB is online
    ```

With option the `AUTOMATED_REGISTER=false`, you cannot switch back and forth.

If this option is set to false, you must re-register the node:

```
hdbnsutil -sr_register --remoteHost=node2 --remoteInstance=00 --replicationMode=syncmem --name=DC1
```

Now node2, which was the primary, acts as the secondary host.

Consider setting this option to true to automate the registration of the demoted host.

```
pcs resource update SAPHana_HR2_00-primary AUTOMATED_REGISTER=true
pcs cluster node clear node1
```

Whether you prefer automatic registering depends on the customer scenario. Automatically reregistering the node after a takeover will be easier for the operation team. However, you may want to register the node manually in order to first run additional tests to make sure everything works as you expect.

##  References

1. [Automated SAP HANA System Replication in Scale-Up in pacemaker cluster](https://access.redhat.com/articles/3397471)
2. [Support Policies for RHEL High Availability Clusters - Management of SAP HANA in a Cluster](https://access.redhat.com/articles/3397471)
3. [Setting up Pacemaker on RHEL in Azure - Azure Virtual Machines](../../virtual-machines/workloads/sap/high-availability-guide-rhel-pacemaker.md)
4. [Azure HANA Large Instances control through Azure portal - Azure Virtual Machines](hana-li-portal.md)
