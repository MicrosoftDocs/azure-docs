---
title: Set up IBM Db2 HADR on Azure virtual machines (VMs) | Microsoft Docs
description: Establish high availability of IBM Db2 LUW on Azure virtual machines (VMs).
author: msjuergent
ms.service: sap-on-azure
ms.subservice: sap-vm-workloads
ms.custom: devx-track-azurecli, devx-track-azurepowershell, linux-related-content
ms.topic: article
ms.date: 06/18/2024
ms.author: juergent
---

# High availability of IBM Db2 LUW on Azure VMs on SUSE Linux Enterprise Server with Pacemaker

IBM Db2 for Linux, UNIX, and Windows (LUW) in [high availability and disaster recovery (HADR) configuration](https://www.ibm.com/support/knowledgecenter/en/SSEPGG_10.5.0/com.ibm.db2.luw.admin.ha.doc/doc/c0011267.html) consists of one node that runs a primary database instance and at least one node that runs a secondary database instance. Changes to the primary database instance are replicated to a secondary database instance synchronously or asynchronously, depending on your configuration.

> [!NOTE]
> This article contains references to terms that Microsoft no longer uses. When these terms are removed from the software, we'll remove them from this article.

This article describes how to deploy and configure the Azure virtual machines (VMs), install the cluster framework, and install the IBM Db2 LUW with HADR configuration.

The article doesn't cover how to install and configure IBM Db2 LUW with HADR or SAP software installation. To help you accomplish these tasks, we provide references to SAP and IBM installation manuals. This article focuses on parts that are specific to the Azure environment.

The supported IBM Db2 versions are 10.5 and later, as documented in SAP note [1928533].

Before you begin an installation, see the following SAP notes and documentation:

| SAP note | Description |
| --- | --- |
| [1928533] | SAP applications on Azure: Supported products and Azure VM types |
| [2015553] | SAP on Azure: Support prerequisites |
| [2178632] | Key monitoring metrics for SAP on Azure |
| [2191498] | SAP on Linux with Azure: Enhanced monitoring |
| [2243692] | Linux on Azure (IaaS) VM: SAP license issues |
| [1984787] | SUSE LINUX Enterprise Server 12: Installation notes |
| [1999351] | Troubleshooting enhanced Azure monitoring for SAP |
| [2233094] | DB6: SAP applications on Azure that use IBM Db2 for Linux, UNIX, and Windows - additional information |
| [1612105] | DB6: FAQ on Db2 with HADR |

| Documentation |
| --- |
| [SAP Community Wiki](https://wiki.scn.sap.com/wiki/display/HOME/SAPonLinuxNotes): Has all of the required SAP Notes for Linux |
| [Azure Virtual Machines planning and implementation for SAP on Linux][planning-guide] guide |
| [Azure Virtual Machines deployment for SAP on Linux][deployment-guide] (this article) |
| [Azure Virtual Machines database management system(DBMS) deployment for SAP on Linux][dbms-guide] guide |
| [SAP workload on Azure planning and deployment checklist][azr-sap-plancheck] |
| [SUSE Linux Enterprise Server for SAP Applications 12 SP4 best practices guides][sles-for-sap-bp] |
| [SUSE Linux Enterprise High Availability Extension 12 SP4][sles-ha-guide] |
| [IBM Db2 Azure Virtual Machines DBMS deployment for SAP workload][dbms-db2] |
| [IBM Db2 HADR 11.1][db2-hadr-11.1] |
| [IBM Db2 HADR R 10.5][db2-hadr-10.5] |

## Overview

To achieve high availability, IBM Db2 LUW with HADR is installed on at least two Azure virtual machines, which are deployed in an [virtual machine scale set](./virtual-machine-scale-set-sap-deployment-guide.md) with flexible orchestration across [availability zones](./high-availability-zones.md) or in an [availability set](/azure/virtual-machines/windows/tutorial-availability-sets).

The following graphics display a setup of two database server Azure VMs. Both database server Azure VMs have their own storage attached and are up and running. In HADR, one database instance in one of the Azure VMs has the role of the primary instance. All clients are connected to this primary instance. All changes in database transactions are persisted locally in the Db2 transaction log. As the transaction log records are persisted locally, the records are transferred via TCP/IP to the database instance on the second database server, the standby server, or standby instance. The standby instance updates the local database by rolling forward the transferred transaction log records. In this way, the standby server is kept in sync with the primary server.

HADR is only a replication functionality. It has no failure detection and no automatic takeover or failover facilities. A takeover or transfer to the standby server must be initiated manually by a database administrator. To achieve an automatic takeover and failure detection, you can use the Linux Pacemaker clustering feature. Pacemaker monitors the two database server instances. When the primary database server instance crashes, Pacemaker initiates an *automatic* HADR takeover by the standby server. Pacemaker also ensures that the virtual IP address is assigned to the new primary server.

![IBM Db2 high availability overview](./media/dbms-guide-ha-ibm/ha-db2-hadr-lb.png)

To have SAP application servers connect to primary database, you need a virtual host name and a virtual IP address. After a failover, the SAP application servers connect to new primary database instance. In an Azure environment, an [Azure load balancer](https://microsoft.sharepoint.com/teams/WAG/AzureNetworking/Wiki/Load%20Balancing.aspx) is required to use a virtual IP address in the way that's required for HADR of IBM Db2.

To help you fully understand how IBM Db2 LUW with HADR and Pacemaker fits into a highly available SAP system setup, the following image presents an overview of a highly available setup of an SAP system based on IBM Db2 database. This article covers only IBM Db2, but it provides references to other articles about how to set up other components of an SAP system.

![IBM DB2 high availability full environment overview](.//media/dbms-guide-ha-ibm/end-2-end-ha.png)

### High-level overview of the required steps

To deploy an IBM Db2 configuration, you need to follow these steps:

- Plan your environment.
- Deploy the VMs.
- Update SUSE Linux and configure file systems.
- Install and configure Pacemaker.
- Install [highly available NFS][nfs-ha].
- Install [ASCS/ERS on a separate cluster][ascs-ha].
- Install IBM Db2 database with Distributed/High Availability option (SWPM).
- Install and create a secondary database node and instance, and configure HADR.
- Confirm that HADR is working.
- Apply the Pacemaker configuration to control IBM Db2.
- Configure Azure Load Balancer.
- Install primary and dialog application servers.
- Check and adapt the configuration of SAP application servers.
- Perform failover and takeover tests.

## Plan Azure infrastructure for hosting IBM Db2 LUW with HADR

Complete the planning process before you execute the deployment. Planning builds the foundation for deploying a configuration of Db2 with HADR in Azure. Key elements that need to be part of planning for IMB Db2 LUW (database part of SAP environment) are listed in the following table:

| Topic | Short description |
| --- | --- |
| Define Azure resource groups | Resource groups where you deploy VM, virtual network, Azure Load Balancer, and other resources. Can be existing or new. |
| Virtual network / Subnet definition | Where VMs for IBM Db2 and Azure Load Balancer are being deployed. Can be existing or newly created. |
| Virtual machines hosting IBM Db2 LUW | VM size, storage, networking, IP address. |
| Virtual host name and virtual IP for IBM Db2 database| The virtual IP or host name that's used for connection of SAP application servers. **db-virt-hostname**, **db-virt-ip**. |
| Azure fencing | Azure fencing or SBD fencing (highly recommended). Method to avoid split brain situations. |
| SBD VM | SBD virtual machine size, storage, network. |
| Azure Load Balancer | Usage of Standard (recommended), probe port for Db2 database (our recommendation 62500) **probe-port**. |
| Name resolution| How name resolution works in the environment. DNS service is highly recommended. Local hosts file can be used. |

For more information about Linux Pacemaker in Azure, see [Set up Pacemaker on SUSE Linux Enterprise Server in Azure](./high-availability-guide-suse-pacemaker.md).

> [!IMPORTANT]
> For Db2 versions 11.5.6 and higher we highly recommend Integrated solution using Pacemaker from IBM.
>
> - [Integrated solution using Pacemaker](https://www.ibm.com/docs/en/db2/11.5?topic=feature-integrated-solution-using-pacemaker).
> - [Alternate or additional configurations available on Microsoft Azure](https://www.ibm.com/support/pages/alternate-or-additional-configurations-available-microsoft-azure).

## Deployment on SUSE Linux

The resource agent for IBM Db2 LUW is included in SUSE Linux Enterprise Server for SAP Applications. For the setup that's described in this document, you must use SUSE Linux Server for SAP Applications. The Azure Marketplace contains an image for SUSE Enterprise Server for SAP Applications 12 that you can use to deploy new Azure virtual machines. Be aware of the various support or service models that are offered by SUSE through the Azure Marketplace when you choose a VM image in the Azure VM Marketplace.

### Hosts: DNS updates

Make a list of all host names, including virtual host names, and update your DNS servers to enable proper IP address to host-name resolution. If a DNS server doesn't exist or you can't update and create DNS entries, you need to use the local host files of the individual VMs that are participating in this scenario. If you're using host files entries, make sure that the entries are applied to all VMs in the SAP system environment. However, we recommend that you use your DNS that, ideally, extends into Azure

### Manual deployment

Make sure that the selected OS is supported by IBM/SAP for IBM Db2 LUW. The list of supported OS versions for Azure VMs and Db2 releases is available in SAP note [1928533]. The list of OS releases by individual Db2 release is available in the SAP Product Availability Matrix. We highly recommend a minimum of SLES 12 SP4 because of Azure-related performance improvements in this or later SUSE Linux versions.

1. Create or select a resource group.
2. Create or select a virtual network and subnet.
3. Choose a [suitable deployment type](./sap-high-availability-architecture-scenarios.md#comparison-of-different-deployment-types-for-sap-workload) for SAP virtual machines. Typically a virtual machine scale set with flexible orchestration.
4. Create Virtual Machine 1.
   1. Use SLES for SAP image in the Azure Marketplace.
   2. Select the scale set, availability zone or availability set created in step 3.
5. Create Virtual Machine 2.
   1. Use SLES for SAP image in the Azure Marketplace.
   2. Select the scale set, availability zone or availability set created in step 3 (not the same zone as in step 4).
6. Add data disks to the VMs, and then check the recommendation of a file system setup in the article [IBM Db2 Azure Virtual Machines DBMS deployment for SAP workload][dbms-db2].

## Install the IBM Db2 LUW and SAP environment

Before you start the installation of an SAP environment based on IBM Db2 LUW, review the following documentation:

- Azure documentation
- SAP documentation
- IBM documentation

Links to this documentation are provided in the introductory section of this article.

Check the SAP installation manuals about installing NetWeaver-based applications on IBM Db2 LUW.

You can find the guides on the SAP Help portal by using the [SAP Installation Guide Finder][sap-instfind].

You can reduce the number of guides displayed in the portal by setting the following filters:

- I want to: "Install a new system"
- My Database: "IBM Db2 for Linux, Unix, and Windows"
- Additional filters for SAP NetWeaver versions, stack configuration, or operating system

### Installation hints for setting up IBM Db2 LUW with HADR

To set up the primary IBM Db2 LUW database instance:

- Use the high availability or distributed option.
- Install the SAP ASCS/ERS and Database instance.
- Take a backup of the newly installed database.

> [!IMPORTANT]
> Write down the "Database Communication port" that's set during installation. It must be the same port number for both database instances
> ![SAP SWPM Port Definition](./media/high-availability-guide-rhel-ibm-db2-luw/hadr-swpm-db2-port.png)

To set up the Standby database server by using the SAP homogeneous system copy procedure, execute these steps:

1. Select the **System copy** option > **Target systems** > **Distributed** > **Database instance**.
1. As a copy method, select **Homogeneous System** so that you can use backup to restore a backup on the standby server instance.
1. When you reach the exit step to restore the database for homogeneous system copy, exit the installer. Restore the database from a backup of the primary host. All subsequent installation phases have already been executed on the primary database server.
1. Set up HADR for IBM Db2.

   > [!NOTE]
   > For installation and configuration that's specific to Azure and Pacemaker: During the installation procedure through SAP Software Provisioning Manager, there is an explicit question about high availability for IBM Db2 LUW:
   > - Do not select **IBM Db2 pureScale**.
   > - Do not select **Install IBM Tivoli System Automation for Multiplatforms**.
   > - Do not select **Generate cluster configuration files**.

When you use an SBD device for Linux Pacemaker, set the following Db2 HADR parameters:

- HADR peer window duration (seconds) (HADR_PEER_WINDOW) = 300  
- HADR timeout value (HADR_TIMEOUT) = 60

When you use an Azure Pacemaker fencing agent, set the following parameters:

- HADR peer window duration (seconds) (HADR_PEER_WINDOW) = 900  
- HADR timeout value (HADR_TIMEOUT) = 60

We recommend the preceding parameters based on initial failover/takeover testing. It's mandatory that you test for proper functionality of failover and takeover with these parameter settings. Because individual configurations can vary, the parameters might require adjustment.

> [!IMPORTANT]
> Specific to IBM Db2 with HADR configuration with normal startup: The secondary or standby database instance must be up and running before you can start the primary database instance.

For demonstration purposes and the procedures described in this article, the database SID is **PTR**.

#### IBM Db2 HADR check

After you've configured HADR and the status is PEER and CONNECTED on the primary and standby nodes, perform the following check:

```bash
Execute command as db2<sid> db2pd -hadr -db <SID>

#Primary output:
# Database Member 0 -- Database PTR -- Active -- Up 1 days 01:51:38 -- Date 2019-02-06-15.35.28.505451
# 
#                             HADR_ROLE = PRIMARY
#                           REPLAY_TYPE = PHYSICAL
#                         HADR_SYNCMODE = NEARSYNC
#                            STANDBY_ID = 1
#                         LOG_STREAM_ID = 0
#                            HADR_STATE = PEER
#                            HADR_FLAGS = TCP_PROTOCOL
#                   PRIMARY_MEMBER_HOST = azibmdb02
#                      PRIMARY_INSTANCE = db2ptr
#                        PRIMARY_MEMBER = 0
#                   STANDBY_MEMBER_HOST = azibmdb01
#                      STANDBY_INSTANCE = db2ptr
#                        STANDBY_MEMBER = 0
#                   HADR_CONNECT_STATUS = CONNECTED
#              HADR_CONNECT_STATUS_TIME = 02/05/2019 13:51:47.170561 (1549374707)
#           HEARTBEAT_INTERVAL(seconds) = 15
#                      HEARTBEAT_MISSED = 0
#                    HEARTBEAT_EXPECTED = 6137
#                 HADR_TIMEOUT(seconds) = 60
#         TIME_SINCE_LAST_RECV(seconds) = 13
#              PEER_WAIT_LIMIT(seconds) = 0
#            LOG_HADR_WAIT_CUR(seconds) = 0.000
#     LOG_HADR_WAIT_RECENT_AVG(seconds) = 0.000025
#    LOG_HADR_WAIT_ACCUMULATED(seconds) = 434.595
#                   LOG_HADR_WAIT_COUNT = 223713
# SOCK_SEND_BUF_REQUESTED,ACTUAL(bytes) = 0, 46080
# SOCK_RECV_BUF_REQUESTED,ACTUAL(bytes) = 0, 374400
#             PRIMARY_LOG_FILE,PAGE,POS = S0000280.LOG, 15571, 27902548040
#             STANDBY_LOG_FILE,PAGE,POS = S0000280.LOG, 15571, 27902548040
#                   HADR_LOG_GAP(bytes) = 0
#      STANDBY_REPLAY_LOG_FILE,PAGE,POS = S0000280.LOG, 15571, 27902548040
#        STANDBY_RECV_REPLAY_GAP(bytes) = 0
#                      PRIMARY_LOG_TIME = 02/06/2019 15:34:39.000000 (1549467279)
#                      STANDBY_LOG_TIME = 02/06/2019 15:34:39.000000 (1549467279)
#               STANDBY_REPLAY_LOG_TIME = 02/06/2019 15:34:39.000000 (1549467279)
#          STANDBY_RECV_BUF_SIZE(pages) = 2048
#              STANDBY_RECV_BUF_PERCENT = 0
#            STANDBY_SPOOL_LIMIT(pages) = 0
#                 STANDBY_SPOOL_PERCENT = NULL
#                    STANDBY_ERROR_TIME = NULL
#                  PEER_WINDOW(seconds) = 300
#                       PEER_WINDOW_END = 02/06/2019 15:40:25.000000 (1549467625)
#              READS_ON_STANDBY_ENABLED = N

#Secondary output:
# Database Member 0 -- Database PTR -- Standby -- Up 1 days 01:46:43 -- Date 2019-02-06-15.38.25.644168
# 
#                             HADR_ROLE = STANDBY
#                           REPLAY_TYPE = PHYSICAL
#                         HADR_SYNCMODE = NEARSYNC
#                            STANDBY_ID = 0
#                         LOG_STREAM_ID = 0
#                            HADR_STATE = PEER
#                            HADR_FLAGS = TCP_PROTOCOL
#                   PRIMARY_MEMBER_HOST = azibmdb02
#                      PRIMARY_INSTANCE = db2ptr
#                        PRIMARY_MEMBER = 0
#                   STANDBY_MEMBER_HOST = azibmdb01
#                      STANDBY_INSTANCE = db2ptr
#                        STANDBY_MEMBER = 0
#                   HADR_CONNECT_STATUS = CONNECTED
#              HADR_CONNECT_STATUS_TIME = 02/05/2019 13:51:47.205067 (1549374707)
#           HEARTBEAT_INTERVAL(seconds) = 15
#                      HEARTBEAT_MISSED = 0
#                    HEARTBEAT_EXPECTED = 6186
#                 HADR_TIMEOUT(seconds) = 60
#         TIME_SINCE_LAST_RECV(seconds) = 5
#              PEER_WAIT_LIMIT(seconds) = 0
#            LOG_HADR_WAIT_CUR(seconds) = 0.000
#     LOG_HADR_WAIT_RECENT_AVG(seconds) = 0.000023
#    LOG_HADR_WAIT_ACCUMULATED(seconds) = 434.595
#                   LOG_HADR_WAIT_COUNT = 223725
# SOCK_SEND_BUF_REQUESTED,ACTUAL(bytes) = 0, 46080
# SOCK_RECV_BUF_REQUESTED,ACTUAL(bytes) = 0, 372480
#             PRIMARY_LOG_FILE,PAGE,POS = S0000280.LOG, 15574, 27902562173
#             STANDBY_LOG_FILE,PAGE,POS = S0000280.LOG, 15574, 27902562173
#                   HADR_LOG_GAP(bytes) = 0
#      STANDBY_REPLAY_LOG_FILE,PAGE,POS = S0000280.LOG, 15574, 27902562173
#        STANDBY_RECV_REPLAY_GAP(bytes) = 155
#                      PRIMARY_LOG_TIME = 02/06/2019 15:37:34.000000 (1549467454)
#                      STANDBY_LOG_TIME = 02/06/2019 15:37:34.000000 (1549467454)
#               STANDBY_REPLAY_LOG_TIME = 02/06/2019 15:37:34.000000 (1549467454)
#          STANDBY_RECV_BUF_SIZE(pages) = 2048
#              STANDBY_RECV_BUF_PERCENT = 0
#            STANDBY_SPOOL_LIMIT(pages) = 0
#                 STANDBY_SPOOL_PERCENT = NULL
#                    STANDBY_ERROR_TIME = NULL
#                  PEER_WINDOW(seconds) = 300
#                       PEER_WINDOW_END = 02/06/2019 15:43:19.000000 (1549467799)
#              READS_ON_STANDBY_ENABLED = N
```

### Configure Azure Load Balancer

During VM configuration, you have an option to create or select exiting load balancer in networking section. Follow below steps, to set up standard load balancer for high availability setup of DB2 database.

#### [Azure portal](#tab/lb-portal)

[!INCLUDE [Configure Azure standard load balancer using Azure portal](../../../includes/sap-load-balancer-db-portal.md)]

#### [Azure CLI](#tab/lb-azurecli)

[!INCLUDE [Configure Azure standard load balancer using Azure CLI](../../../includes/sap-load-balancer-db-azurecli.md)]

#### [PowerShell](#tab/lb-powershell)

[!INCLUDE [Configure Azure standard load balancer using PowerShell](../../../includes/sap-load-balancer-db-powershell.md)]

---

> [!NOTE]
> When VMs without public IP addresses are placed in the back-end pool of an internal (no public IP address) instance of Standard Azure Load Balancer, there's no outbound internet connectivity unless more configuration is performed to allow routing to public endpoints. For more information on how to achieve outbound connectivity, see [Public endpoint connectivity for VMs using Azure Standard Load Balancer in SAP high-availability scenarios](./high-availability-guide-standard-load-balancer-outbound-connections.md).

> [!IMPORTANT]
> Don't enable TCP timestamps on Azure VMs placed behind Azure Load Balancer. Enabling TCP timestamps could cause the health probes to fail. Set the parameter `net.ipv4.tcp_timestamps` to `0`. For more information, see [Load Balancer health probes](../../load-balancer/load-balancer-custom-probe-overview.md).

## Create the Pacemaker cluster

To create a basic Pacemaker cluster for this IBM Db2 server, see [Set up Pacemaker on SUSE Linux Enterprise Server in Azure][sles-pacemaker].

## Db2 Pacemaker configuration

When you use Pacemaker for automatic failover in the event of a node failure, you need to configure your Db2 instances and Pacemaker accordingly. This section describes this type of configuration.

The following items are prefixed with either:

- **[A]**: Applicable to all nodes
- **[1]**: Applicable only to node 1
- **[2]**: Applicable only to node 2

**[A]** Prerequisites for Pacemaker configuration:

- Shut down both database servers with user db2\<sid> with db2stop.
- Change the shell environment for db2\<sid> user to */bin/ksh*. We recommend that you use the Yast tool.

### Pacemaker configuration

> [!IMPORTANT]
> Recent testing revealed situations, where netcat stops responding to requests due to backlog and its limitation of handling only one connection. The netcat resource stops listening to the Azure Load balancer requests and the floating IP becomes unavailable.
> For existing Pacemaker clusters, we recommended in the past replacing netcat with socat. Currently we recommend using azure-lb resource agent, which is part of package resource-agents, with the following package version requirements:
>
> - For SLES 12 SP4/SP5, the version must be at least resource-agents-4.3.018.a7fb5035-3.30.1.  
> - For SLES 15/15 SP1, the version must be at least resource-agents-4.3.0184.6ee15eb2-4.13.1.  
>
> Note that the change will require brief downtime.  
> For existing Pacemaker clusters, if the configuration was already changed to use socat as described in [Azure Load-Balancer Detection Hardening](https://www.suse.com/support/kb/doc/?id=7024128), there is no requirement to switch immediately to azure-lb resource agent.

1. **[1]** IBM Db2 HADR-specific Pacemaker configuration:

   ```bash
   # Put Pacemaker into maintenance mode
   sudo crm configure property maintenance-mode=true
   ```

2. **[1]** Create IBM Db2 resources:

   ```bash
   # Replace **bold strings** with your instance name db2sid, database SID, and virtual IP address/Azure Load Balancer.
   sudo crm configure primitive rsc_Db2_db2ptr_PTR db2 \
           params instance="db2ptr" dblist="PTR" \
           op start interval="0" timeout="130" \
           op stop interval="0" timeout="120" \
           op promote interval="0" timeout="120" \
           op demote interval="0" timeout="120" \
           op monitor interval="30" timeout="60" \
           op monitor interval="31" role="Master" timeout="60"
   
   # Configure virtual IP - same as Azure Load Balancer IP
   sudo crm configure primitive rsc_ip_db2ptr_PTR IPaddr2 \
           op monitor interval="10s" timeout="20s" \
           params ip="10.100.0.10"
   
   # Configure probe port for Azure load Balancer
   sudo crm configure primitive rsc_nc_db2ptr_PTR azure-lb port=62500 \
           op monitor timeout=20s interval=10
   
   sudo crm configure group g_ip_db2ptr_PTR rsc_ip_db2ptr_PTR rsc_nc_db2ptr_PTR
   
   sudo crm configure ms msl_Db2_db2ptr_PTR rsc_Db2_db2ptr_PTR \
           meta target-role="Started" notify="true"
   
   sudo crm configure colocation col_db2_db2ptr_PTR inf: g_ip_db2ptr_PTR:Started msl_Db2_db2ptr_PTR:Master
   
   sudo crm configure order ord_db2_ip_db2ptr_PTR inf: msl_Db2_db2ptr_PTR:promote g_ip_db2ptr_PTR:start
   
   sudo crm configure rsc_defaults resource-stickiness=1000
   sudo crm configure rsc_defaults migration-threshold=5000
   ```

3. **[1]** Start IBM Db2 resources:

   Put Pacemaker out of maintenance mode.

   ```bash
   # Put Pacemaker out of maintenance-mode - that start IBM Db2
   sudo crm configure property maintenance-mode=false
   ```

4. **[1]** Make sure that the cluster status is OK and that all of the resources are started. It's not important which node the resources are running on.

   ```bash
   sudo crm status
   
   # 2 nodes configured
   # 5 resources configured
   
   # Online: [ azibmdb01 azibmdb02 ]
   
   # Full list of resources:
   
   # stonith-sbd    (stonith:external/sbd): Started azibmdb02
   # Resource Group: g_ip_db2ptr_PTR
   #      rsc_ip_db2ptr_PTR  (ocf::heartbeat:IPaddr2):       Started azibmdb02
   #      rsc_nc_db2ptr_PTR  (ocf::heartbeat:azure-lb):      Started azibmdb02
   # Master/Slave Set: msl_Db2_db2ptr_PTR [rsc_Db2_db2ptr_PTR]
   #      Masters: [ azibmdb02 ]
   #      Slaves: [ azibmdb01 ]
   ```

> [!IMPORTANT]
> You must manage the Pacemaker clustered Db2 instance by using Pacemaker tools. If you use db2 commands such as db2stop, Pacemaker detects the action as a failure of resource. If you're performing maintenance, you can put the nodes or resources in maintenance mode. Pacemaker suspends  monitoring resources, and you can then use normal db2 administration commands.

### Make changes to SAP profiles to use virtual IP for connection

To connect to the primary instance of the HADR configuration, the SAP application layer needs to use the virtual IP address that you defined and configured for the Azure Load Balancer. The following changes are required:

/sapmnt/\<SID>/profile/DEFAULT.PFL

```bash
SAPDBHOST = db-virt-hostname
j2ee/dbhost = db-virt-hostname
```

/sapmnt/\<SID>/global/db6/db2cli.ini

```bash
Hostname=db-virt-hostname
```

## Install primary and dialog application servers

When installing primary and dialog application servers against a Db2 HADR configuration, use the virtual host name that you picked for the configuration.

If you performed the installation before you created the Db2 HADR configuration, make the changes as described in the preceding section and as follows for SAP Java stacks.

### ABAP+Java or Java stack systems JDBC URL check

Use the J2EE Config tool to check or update the JDBC URL. Because the J2EE Config tool is a graphical tool, you need to have X server installed:

1. Sign in to the primary application server of the J2EE instance and execute:

   ```bash
   sudo /usr/sap/*SID*/*Instance*/j2ee/configtool/configtool.sh
   ```

2. In the left frame, choose **security store**.
3. In the right frame, choose the key jdbc/pool/\<SAPSID>/url.
4. Change the host name in the JDBC URL to the virtual host name.

   ```TEXT
   jdbc:db2://db-virt-hostname:5912/TSP:deferPrepares=0
   ```

5. Select **Add**.
6. To save your changes, select the disk icon at the upper left.
7. Close the configuration tool.
8. Restart the Java instance.

## Configure log archiving for HADR setup

To configure the Db2 log archiving for HADR setup, we recommend that you configure both the primary and the standby database to have automatic log retrieval capability from all log archive locations. Both the primary and standby database must be able to retrieve log archive files from all the log archive locations to which either one of the database instances might archive log files.

The log archiving is performed only by the primary database. If you change the HADR roles of the database servers or if a failure occurs, the new primary database is responsible for log archiving. If you've set up multiple log archive locations, your logs might be archived twice. In the event of a local or remote catch-up, you might also have to manually copy the archived logs from the old primary server to the active log location of the new primary server.

We recommend configuring a common NFS share where logs are written from both nodes. The NFS share has to be highly available.

You can use existing highly available NFS shares for transports or a profile directory. For more information, see:

- [High availability for NFS on Azure VMs on SUSE Linux Enterprise Server][nfs-ha].
- [High availability for SAP NetWeaver on Azure VMs on SUSE Linux Enterprise Server with Azure NetApp Files for SAP Applications](./high-availability-guide-suse-netapp-files.md).
- [Azure NetApp Files](../../azure-netapp-files/azure-netapp-files-introduction.md) (to create NFS shares).

## Test the cluster setup

This section describes how you can test your Db2 HADR setup. *Every test assumes that you're logged in as user root* and the IBM Db2 primary is running on the *azibmdb01* virtual machine.

The initial status for all test cases is explained here: (crm_mon -r  or crm status)

- **crm status** is a snapshot of Pacemaker status at execution time.
- **crm_mon -r** is continuous output of Pacemaker status.

```bash
2 nodes configured
5 resources configured

Online: [ azibmdb01 azibmdb02 ]

Full list of resources:

stonith-sbd     (stonith:external/sbd): Started azibmdb02
Resource Group: g_ip_db2ptr_PTR
     rsc_ip_db2ptr_PTR  (ocf::heartbeat:IPaddr2):       Stopped
     rsc_nc_db2ptr_PTR  (ocf::heartbeat:azure-lb):      Stopped
Master/Slave Set: msl_Db2_db2ptr_PTR [rsc_Db2_db2ptr_PTR]
     rsc_Db2_db2ptr_PTR      (ocf::heartbeat:db2):   Promoting azibmdb01
     Slaves: [ azibmdb02 ]
```

The original status in an SAP system is documented in Transaction DBACOCKPIT > Configuration > Overview, as shown in the following image:

![DBACockpit - Pre Migration](./media/dbms-guide-ha-ibm/hadr-sap-mgr-org.png)

### Test takeover of IBM Db2

> [!IMPORTANT]
> Before you start the test, make sure that:
>
> - Pacemaker doesn't have any failed actions (crm status).
> - There are no location constraints (leftovers of migration test.
> - The IBM Db2 HADR synchronization is working. Check with user db2\<sid>
>
>   ```bash
>   db2pd -hadr -db <DBSID>
>   ```

Migrate the node that's running the primary Db2 database by executing following command:

```bash
crm resource migrate msl_Db2_db2ptr_PTR azibmdb02
```

After the migration is done, the crm status output looks like:

```bash
2 nodes configured
5 resources configured

Online: [ azibmdb01 azibmdb02 ]

Full list of resources:

stonith-sbd     (stonith:external/sbd): Started azibmdb02
Resource Group: g_ip_db2ptr_PTR
     rsc_ip_db2ptr_PTR  (ocf::heartbeat:IPaddr2):       Started azibmdb02
     rsc_nc_db2ptr_PTR  (ocf::heartbeat:azure-lb):      Started azibmdb02
Master/Slave Set: msl_Db2_db2ptr_PTR [rsc_Db2_db2ptr_PTR]
     Masters: [ azibmdb02 ]
     Slaves: [ azibmdb01 ]
```

The original status in an SAP system is documented in Transaction DBACOCKPIT > Configuration > Overview, as shown in the following image:

![DBACockpit - Post Migration](./media/dbms-guide-ha-ibm/hadr-sap-mgr-post.png)

Resource migration with "crm resource migrate" creates location constraints. Location constraints should be deleted. If location constraints aren't deleted, the resource can't fail back or you can experience unwanted takeovers.

Migrate the resource back to *azibmdb01* and clear the location constraints

```bash
crm resource migrate msl_Db2_db2ptr_PTR azibmdb01
crm resource clear msl_Db2_db2ptr_PTR
```

- **crm resource migrate \<res_name> \<host>:** Creates location constraints and can cause issues with takeover
- **crm resource clear \<res_name>**: Clears location constraints
- **crm resource cleanup \<res_name>**: Clears all errors of the resource

### Test SBD fencing

In this case, we test SBD fencing, which we recommend that you do when you use SUSE Linux.

```bash
azibmdb01:~ # ps -ef|grep sbd
root       2374      1  0 Feb05 ?        00:00:17 sbd: inquisitor
root       2378   2374  0 Feb05 ?        00:00:40 sbd: watcher: /dev/disk/by-id/scsi-36001405fbbaab35ee77412dacb77ae36 - slot: 0 - uuid: 27cad13a-0bce-4115-891f-43b22cfabe65
root       2379   2374  0 Feb05 ?        00:01:51 sbd: watcher: Pacemaker
root       2380   2374  0 Feb05 ?        00:00:18 sbd: watcher: Cluster

azibmdb01:~ # kill -9 2374
```

Cluster node *azibmdb01* should be rebooted. The IBM Db2 primary HADR role is going to be moved to *azibmdb02*. When *azibmdb01* is back online, the Db2 instance is going to move in the role of a secondary database instance.

If the Pacemaker service doesn't start automatically on the rebooted former primary, be sure to start it manually with:

```bash
sudo service pacemaker start
```

### Test a manual takeover

You can test a manual takeover by stopping the Pacemaker service on *azibmdb01* node:

```bash
service pacemaker stop
```

status on *azibmdb02*

```bash
2 nodes configured
5 resources configured

Online: [ azibmdb02 ]
OFFLINE: [ azibmdb01 ]

Full list of resources:

stonith-sbd     (stonith:external/sbd): Started azibmdb02
Resource Group: g_ip_db2ptr_PTR
     rsc_ip_db2ptr_PTR  (ocf::heartbeat:IPaddr2):       Started azibmdb02
     rsc_nc_db2ptr_PTR  (ocf::heartbeat:azure-lb):      Started azibmdb02
Master/Slave Set: msl_Db2_db2ptr_PTR [rsc_Db2_db2ptr_PTR]
     Masters: [ azibmdb02 ]
     Stopped: [ azibmdb01 ]
```

After the failover, you can start the service again on *azibmdb01*.

```bash
service pacemaker start
```

### Kill the Db2 process on the node that runs the HADR primary database

```bash
#Kill main db2 process - db2sysc
azibmdb01:~ # ps -ef|grep db2s
db2ptr    34598  34596  8 14:21 ?        00:00:07 db2sysc 0

azibmdb01:~ # kill -9 34598
```

The Db2 instance is going to fail, and Pacemaker will report following status:

```bash
2 nodes configured
5 resources configured

Online: [ azibmdb01 azibmdb02 ]

Full list of resources:

stonith-sbd    (stonith:external/sbd): Started azibmdb01
Resource Group: g_ip_db2ptr_PTR
     rsc_ip_db2ptr_PTR  (ocf::heartbeat:IPaddr2):       Stopped
     rsc_nc_db2ptr_PTR  (ocf::heartbeat:azure-lb):      Stopped
Master/Slave Set: msl_Db2_db2ptr_PTR [rsc_Db2_db2ptr_PTR]
     Slaves: [ azibmdb02 ]
     Stopped: [ azibmdb01 ]

Failed Actions:
* rsc_Db2_db2ptr_PTR_demote_0 on azibmdb01 'unknown error' (1): call=157, status=complete, exitreason='',
    last-rc-change='Tue Feb 12 14:28:19 2019', queued=40ms, exec=223ms
```

Pacemaker restarts the Db2 primary database instance on the same node, or it fails over to the node that's running the secondary database instance and an error is reported.

```bash
2 nodes configured
5 resources configured

Online: [ azibmdb01 azibmdb02 ]

Full list of resources:

stonith-sbd    (stonith:external/sbd): Started azibmdb01
Resource Group: g_ip_db2ptr_PTR
     rsc_ip_db2ptr_PTR  (ocf::heartbeat:IPaddr2):       Started azibmdb01
     rsc_nc_db2ptr_PTR  (ocf::heartbeat:azure-lb):      Started azibmdb01
Master/Slave Set: msl_Db2_db2ptr_PTR [rsc_Db2_db2ptr_PTR]
     Masters: [ azibmdb01 ]
     Slaves: [ azibmdb02 ]

Failed Actions:
* rsc_Db2_db2ptr_PTR_demote_0 on azibmdb01 'unknown error' (1): call=157, status=complete, exitreason='',
    last-rc-change='Tue Feb 12 14:28:19 2019', queued=40ms, exec=223ms
```

### Kill the Db2 process on the node that runs the secondary database instance

```bash
azibmdb02:~ # ps -ef|grep db2s
db2ptr    65250  65248  0 Feb11 ?        00:09:27 db2sysc 0

azibmdb02:~ # kill -9
```

The node gets into failed stated and error reported

```bash
2 nodes configured
5 resources configured

Online: [ azibmdb01 azibmdb02 ]

Full list of resources:

stonith-sbd    (stonith:external/sbd): Started azibmdb01
Resource Group: g_ip_db2ptr_PTR
     rsc_ip_db2ptr_PTR  (ocf::heartbeat:IPaddr2):       Started azibmdb01
     rsc_nc_db2ptr_PTR  (ocf::heartbeat:azure-lb):      Started azibmdb01
Master/Slave Set: msl_Db2_db2ptr_PTR [rsc_Db2_db2ptr_PTR]
     rsc_Db2_db2ptr_PTR      (ocf::heartbeat:db2):   FAILED azibmdb02
     Masters: [ azibmdb01 ]

Failed Actions:
* rsc_Db2_db2ptr_PTR_monitor_30000 on azibmdb02 'not running' (7): call=144, status=complete, exitreason='',
last-rc-change='Tue Feb 12 14:36:59 2019', queued=0ms, exec=0ms
```

The Db2 instance gets restarted in the secondary role it had assigned before.

```bash
2 nodes configured
5 resources configured

Online: [ azibmdb01 azibmdb02 ]

Full list of resources:

stonith-sbd     (stonith:external/sbd): Started azibmdb01
Resource Group: g_ip_db2ptr_PTR
     rsc_ip_db2ptr_PTR  (ocf::heartbeat:IPaddr2):       Started azibmdb01
     rsc_nc_db2ptr_PTR  (ocf::heartbeat:azure-lb):      Started azibmdb01
Master/Slave Set: msl_Db2_db2ptr_PTR [rsc_Db2_db2ptr_PTR]
     Masters: [ azibmdb01 ]
     Slaves: [ azibmdb02 ]

Failed Actions:
* rsc_Db2_db2ptr_PTR_monitor_30000 on azibmdb02 'not running' (7): call=144, status=complete, exitreason='',
    last-rc-change='Tue Feb 12 14:36:59 2019', queued=0ms, exec=0ms
```

### Stop DB via db2stop force on the node that runs the HADR primary database instance

```bash
2 nodes configured
5 resources configured

Online: [ azibmdb01 azibmdb02 ]

Full list of resources:

stonith-sbd     (stonith:external/sbd): Started azibmdb01
Resource Group: g_ip_db2ptr_PTR
     rsc_ip_db2ptr_PTR  (ocf::heartbeat:IPaddr2):       Started azibmdb01
     rsc_nc_db2ptr_PTR  (ocf::heartbeat:azure-lb):      Started azibmdb01
Master/Slave Set: msl_Db2_db2ptr_PTR [rsc_Db2_db2ptr_PTR]
     Masters: [ azibmdb01 ]
     Slaves: [ azibmdb02 ]
```

As user db2\<sid> execute command db2stop force:

```bash
azibmdb01:~ # su - db2ptr
azibmdb01:db2ptr> db2stop force
```

Failure detected

```bash
2 nodes configured
5 resources configured

Online: [ azibmdb01 azibmdb02 ]

Full list of resources:

stonith-sbd    (stonith:external/sbd): Started azibmdb01
Resource Group: g_ip_db2ptr_PTR
     rsc_ip_db2ptr_PTR  (ocf::heartbeat:IPaddr2):       Stopped
     rsc_nc_db2ptr_PTR  (ocf::heartbeat:azure-lb):      Stopped
Master/Slave Set: msl_Db2_db2ptr_PTR [rsc_Db2_db2ptr_PTR]
     rsc_Db2_db2ptr_PTR      (ocf::heartbeat:db2):   FAILED azibmdb01
     Slaves: [ azibmdb02 ]

Failed Actions:
* rsc_Db2_db2ptr_PTR_demote_0 on azibmdb01 'unknown error' (1): call=201, status=complete, exitreason='',
    last-rc-change='Tue Feb 12 14:45:25 2019', queued=1ms, exec=150ms
```

The Db2 HADR secondary database instance got promoted into the primary role.

```bash
nodes configured
5 resources configured

Online: [ azibmdb01 azibmdb02 ]

Full list of resources:

stonith-sbd     (stonith:external/sbd): Started azibmdb01
Resource Group: g_ip_db2ptr_PTR
     rsc_ip_db2ptr_PTR  (ocf::heartbeat:IPaddr2):       Started azibmdb02
     rsc_nc_db2ptr_PTR  (ocf::heartbeat:azure-lb):      Started azibmdb02
Master/Slave Set: msl_Db2_db2ptr_PTR [rsc_Db2_db2ptr_PTR]
     Masters: [ azibmdb02 ]
     Stopped: [ azibmdb01 ]

Failed Actions:
* rsc_Db2_db2ptr_PTR_start_0 on azibmdb01 'unknown error' (1): call=205, stat
us=complete, exitreason='',
    last-rc-change='Tue Feb 12 14:45:27 2019', queued=0ms, exec=865ms
```

### Crash VM with restart on the node that runs the HADR primary database instance

```bash
#Linux kernel panic - with OS restart
azibmdb01:~ # echo b > /proc/sysrq-trigger
```

Pacemaker promotes the secondary instance to the primary instance role. The old primary instance will move into the secondary role after the VM and all services are fully restored after the VM reboot.

```bash
nodes configured
5 resources configured

Online: [ azibmdb01 azibmdb02 ]

Full list of resources:

stonith-sbd     (stonith:external/sbd): Started azibmdb02
Resource Group: g_ip_db2ptr_PTR
     rsc_ip_db2ptr_PTR  (ocf::heartbeat:IPaddr2):       Started azibmdb01
     rsc_nc_db2ptr_PTR  (ocf::heartbeat:azure-lb):      Started azibmdb01
Master/Slave Set: msl_Db2_db2ptr_PTR [rsc_Db2_db2ptr_PTR]
     Masters: [ azibmdb01 ]
     Slaves: [ azibmdb02 ]
```

### Crash the VM that runs the HADR primary database instance with "halt"

```bash
#Linux kernel panic - halts OS
azibmdb01:~ # echo b > /proc/sysrq-trigger
```

In such a case, Pacemaker detects that the node that's running the primary database instance isn't responding.

```bash
2 nodes configured
5 resources configured

Node azibmdb01: UNCLEAN (online)
Online: [ azibmdb02 ]

Full list of resources:

stonith-sbd     (stonith:external/sbd): Started azibmdb02
Resource Group: g_ip_db2ptr_PTR
     rsc_ip_db2ptr_PTR  (ocf::heartbeat:IPaddr2):       Started azibmdb01
     rsc_nc_db2ptr_PTR  (ocf::heartbeat:azure-lb):      Started azibmdb01
Master/Slave Set: msl_Db2_db2ptr_PTR [rsc_Db2_db2ptr_PTR]
     Masters: [ azibmdb01 ]
     Slaves: [ azibmdb02 ]
```

The next step is to check for a *Split brain* situation. After the surviving node has determined that the node that last ran the primary database instance is down, a failover of resources is executed.

```bash
2 nodes configured
5 resources configured

Online: [ azibmdb02 ]
OFFLINE: [ azibmdb01 ]

Full list of resources:

stonith-sbd     (stonith:external/sbd): Started azibmdb02
Resource Group: g_ip_db2ptr_PTR
     rsc_ip_db2ptr_PTR  (ocf::heartbeat:IPaddr2):       Started azibmdb02
     rsc_nc_db2ptr_PTR  (ocf::heartbeat:azure-lb):      Started azibmdb02
Master/Slave Set: msl_Db2_db2ptr_PTR [rsc_Db2_db2ptr_PTR]
     Masters: [ azibmdb02 ]
     Stopped: [ azibmdb01 ]
```

In the event of a "halting" of the node, the failed node has to be restarted via Azure Management tools (in the Azure portal, PowerShell, or the Azure CLI). After the failed node is back online, it starts the Db2 instance into the secondary role.

```bash
2 nodes configured
5 resources configured

Online: [ azibmdb01 azibmdb02 ]

Full list of resources:

stonith-sbd     (stonith:external/sbd): Started azibmdb02
 Resource Group: g_ip_db2ptr_PTR
     rsc_ip_db2ptr_PTR  (ocf::heartbeat:IPaddr2):       Started azibmdb02
     rsc_nc_db2ptr_PTR  (ocf::heartbeat:azure-lb):      Started azibmdb02
 Master/Slave Set: msl_Db2_db2ptr_PTR [rsc_Db2_db2ptr_PTR]
     Masters: [ azibmdb02 ]
     Slaves: [ azibmdb01 ]
```

## Next steps

- [High-availability architecture and scenarios for SAP NetWeaver](./sap-high-availability-architecture-scenarios.md)
- [Set up Pacemaker on SUSE Linux Enterprise Server in Azure](./high-availability-guide-suse-pacemaker.md)

[1928533]:https://launchpad.support.sap.com/#/notes/1928533
[2015553]:https://launchpad.support.sap.com/#/notes/2015553
[2178632]:https://launchpad.support.sap.com/#/notes/2178632
[2191498]:https://launchpad.support.sap.com/#/notes/2191498
[2243692]:https://launchpad.support.sap.com/#/notes/2243692
[1984787]:https://launchpad.support.sap.com/#/notes/1984787
[1999351]:https://launchpad.support.sap.com/#/notes/1999351
[2233094]:https://launchpad.support.sap.com/#/notes/2233094
[1612105]:https://launchpad.support.sap.com/#/notes/1612105

[sles-for-sap-bp]:https://www.suse.com/documentation/sles-for-sap-12/
[db2-hadr-11.1]:https://www.ibm.com/support/knowledgecenter/en/SSEPGG_11.1.0/com.ibm.db2.luw.admin.ha.doc/doc/c0011267.html
[db2-hadr-10.5]:https://www.ibm.com/support/knowledgecenter/en/SSEPGG_10.5.0/com.ibm.db2.luw.admin.ha.doc/doc/c0011267.html
[dbms-db2]:dbms-guide-ibm.md
[sles-pacemaker]:high-availability-guide-suse-pacemaker.md
[sap-instfind]:https://help.sap.com/viewer/9e41ead9f54e44c1ae1a1094b0f80712/ALL/en-US/576f5c1808de4d1abecbd6e503c9ba42.html
[nfs-ha]:high-availability-guide-suse-nfs.md
[sles-ha-guide]:https://www.suse.com/releasenotes/x86_64/SLE-HA/12-SP4/
[ascs-ha]:high-availability-guide-suse.md

[dbms-guide]:dbms-guide-general.md
[deployment-guide]:deployment-guide.md
[planning-guide]:planning-guide.md
[azr-sap-plancheck]:deployment-checklist.md
