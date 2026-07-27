---
title: Azure VMs high availability for SAP NetWeaver on Red Hat Enterprise Linux with simple mount and NFS
description: Learn how to configure high-availability SAP NetWeaver on Red Hat Enterprise Linux with simple mount and NFS for SAP applications.
services: virtual-machines-windows,virtual-network,storage
ms.service: sap-on-azure
ms.subservice: sap-vm-workloads
ms.topic: how-to
manager: rdeltcheva
author: zamasiel
ms.author: zamasiel
ms.date: 06/01/2026
zone_pivot_groups: sap-ha-nfs-solution
---

# High-availability SAP NetWeaver with simple mount and NFS on RHEL for SAP Virtual Machines

   [!INCLUDE [high-availability-simple-mount-overview](../../../includes/sap/high-availability-simple-mount-overview.md)]

> [!IMPORTANT]
> The cluster configuration with simple mount is supported on RHEL 9.x and later releases for SAP.

## Prerequisites

The following guides contain all the required information to configure a NetWeaver HA system:

- Red Hat Documentation
   - [RHEL SAP High Availability with Simple Mount][rheldoc-sap-ha-simplemount]
   - [RHEL High Availability Add-On for SAP][rheldoc-sap-ha-addon]
   - [RHEL 9 for SAP Solutions][rheldoc-sap-on-rhel9]
   - [RHEL 10 for SAP Solutions][rheldoc-sap-on-rhel10]
   - [RHEL Simple Mount Support for SAP with ENSA2][rheldoc-sap-simplemount-ensa2-versions]
   - [RHEL Simple Mount Support for SAP with ENSA1][rheldoc-sap-simplemount-ensa1-versions]
- SAP Documentation for RHEL
   - SAP Note [2526952][sapnote-2526952-rhel]: SAP Central RHEL Documentation
   - SAP Note [3108316][sapnote-3108316-rhel9]: recommended OS settings for RHEL 9.x
   - SAP Note [3562909][sapnote-3562909-rhel10]: recommended OS settings for RHEL 10.x

[!INCLUDE [high-availability-linux-prerequisites](../../../includes/sap/high-availability-linux-prerequisites.md)]


## Prepare the infrastructure

The resource agent for SAP Instance is included in RHEL for SAP. An image for which is available in Azure Marketplace. You can use the image to deploy new VMs.

### Deploy Linux VMs manually via Azure portal

This document assumes that you previously deployed a resource group, [Azure Virtual Network](../../virtual-network/virtual-networks-overview.md), and subnet for your cluster.

Deploy VMs for SAP ASCS, ERS, and Application servers. Choose a suitable version of RHEL that is supported for your SAP system. You can deploy VMs in any one of the availability options - virtual machine scale set, availability zone, or availability set.

### Configure Azure Load Balancer

[!INCLUDE [high-availability-load-balancer](../../../includes/sap/high-availability-load-balancer.md)]

:::zone pivot="azurefiles"
[!INCLUDE [nfs-azure-files-deployment](../../../includes/sap/nfs-azure-files-deployment.md)]
:::zone-end

:::zone pivot="anf"
[!INCLUDE [nfs-netapp-files-deployment](../../../includes/sap/nfs-netapp-files-deployment.md)]
:::zone-end

## Prepare Pacemaker cluster nodes for SAP installation

The next step is to prepare the nodes for installation. Begin by following the steps in [Set up Pacemaker on Red Hat Enterprise Linux in Azure][azdoc-sap-rhel-pacemaker], then continue.

> [!NOTE]
> The following items are prefixed with:
> - **[A]**: Applicable to all nodes.
> - **[1]**: Applicable to only node 1.
> - **[2]**: Applicable to only node 2.

1. **[A]** Install the latest version of the SAP Cluster Connector and the SAP Resource Agents.

   ```bash
   sudo dnf install -y sap-cluster-connector resource-agents-sap
   ```

   > [!IMPORTANT]
   > You need to have `resource-agents-sap-4.15.1` or a later version for Simple Mount. Older versions don't provide the mandatory `SAPStartSrv` resource agent.

[!INCLUDE [high-availability-node-default](../../../includes/sap/high-availability-node-default.md)]

6. **[A]** Add firewall rules
   > [!NOTE]
   > RHEL comes with a local firewall enabled by default. These commands are provided as an example. Reference [SAP Port Numbers][sapdoc-ports] for your specific system ports.
   
   ```bash
   # ASCS Probe Port
   sudo firewall-cmd --add-port=62500/tcp --permanent
   # ASCS SAP Ports
   sudo firewall-cmd --add-port={3200,3600,3900,8100,50013,50014,50016}/tcp --permanent

   # ERS Probe Port
   sudo firewall-cmd --add-port=62501/tcp --permanent
   # ERS SAP Ports
   sudo firewall-cmd --add-port={3201,3301,50113,50114,50116}/tcp --permanent

   # Apply Changes
   sudo firewall-cmd --reload
   ```

### Prepare and mount SAP shares
:::zone pivot="azurefiles"
   [!INCLUDE [nfs-azure-files-shares](../../../includes/sap/nfs-azure-files-shares.md)]
:::zone-end
:::zone pivot="anf"
   [!INCLUDE [nfs-netapp-files-shares](../../../includes/sap/nfs-netapp-files-shares.md)]
:::zone-end
   
## Install SAP NetWeaver ASCS and ERS

1. **[1]** Create a virtual IP resource and health probe for the ASCS instance.

   > [!IMPORTANT]
   > We recommend using the `azure-lb` resource agent, which is part of the resource-agents-cloud package. 

   ```bash
   sudo pcs node standby sap-cl2
   sudo pcs resource create vip_NW1_ASCS IPaddr2 ip=10.27.0.9
   sudo pcs resource create nc_NW1_ASCS azure-lb port=62500
   sudo pcs resource group add g-NW1_ASCS vip_NW1_ASCS nc_NW1_ASCS
   
   # Verify Cluster Status is OK and all resources are started.
   # As long as the resources in g-NW1_ASCS are on sap-cl1 then you're good.  
   sudo pcs status
   
   Cluster name: sap-cl
   Cluster Summary:
     * Stack: corosync (Pacemaker is running)
     * Current DC: sap-cl1 (version 3.0.0-5.1.el10_0-8818a21) - partition with quorum
     * Last updated: Tue May 19 22:15:08 2026 on sap-cl1
     * Last change:  Tue Apr 21 23:11:34 2026 by root via root on sap-cl1
     * 2 nodes configured
     * 3 resource instances configured
   
   Node List:
     * Node sap-cl2: standby
     * Online: [ sap-cl1 ]
   
   Full List of Resources:
     * sbd (stonith:fence_sbd):     Started sap-cl1
     * Resource Group: g-NW1_ASCS:
       * vip_NW1_ASCS      (ocf:heartbeat:IPaddr2):         Started sap-cl1
       * nc_NW1_ASCS       (ocf:heartbeat:azure-lb):        Started sap-cl1
   
   Daemon Status:
     corosync: active/disabled
     pacemaker: active/disabled
     pcsd: active/enabled
     sbd: active/enabled
   ```

1. **[1]** Install SAP NetWeaver ASCS as root on the first node.

   Use a virtual host name that maps to the IP address of the load balancer's front-end configuration for ASCS (for example, `sapascs`, `10.27.0.9`) and the instance number that you used for the probe of the load balancer (for example, `00`).

   You can use the `sapinst` parameter `SAPINST_REMOTE_ACCESS_USER` to allow a nonroot user to connect to `sapinst`. You can use the `SAPINST_USE_HOSTNAME` parameter to install SAP by using a virtual host name.

   ```bash
   <swpm>/sapinst SAPINST_REMOTE_ACCESS_USER=sapadmin SAPINST_USE_HOSTNAME=<virtual_hostname>
   ```

1. **[1]** Create a virtual IP resource and health probe for the ERS instance.

   ```bash
   sudo pcs node unstandby sap-cl2
   sudo pcs node standby sap-cl1
   
   sudo pcs resource create vip_NW1_ERS IPaddr2 ip=10.27.0.10
   sudo pcs resource create nc_NW1_ERS azure-lb port=62501
   sudo pcs resource group add g-NW1_ERS vip_NW1_ERS nc_NW1_ERS
   
   # Verify Cluster Status is OK and all resources are started.
   # As long as the resources in g-NW1_ERS are on sap-cl2 then you're good.    
   sudo pcs status
   
   Cluster name: sap-cl
   Cluster Summary:
     * Stack: corosync (Pacemaker is running)
     * Current DC: sap-cl2 (version 3.0.0-5.1.el10_0-8818a21) - partition with quorum
     * Last updated: Tue May 19 22:15:08 2026 on sap-cl2
     * Last change:  Tue Apr 21 23:11:34 2026 by root via root on sap-cl2
     * 2 nodes configured
     * 5 resource instances configured
   
   Node List:
     * Node sap-cl1: standby
     * Online: [ sap-cl2 ]
   
   Full List of Resources:
     * sbd (stonith:fence_sbd):     Started sap-cl2
     * Resource Group: g-NW1_ASCS:
       * vip_NW1_ASCS      (ocf:heartbeat:IPaddr2):         Started sap-cl2
       * nc_NW1_ASCS       (ocf:heartbeat:azure-lb):        Started sap-cl2
     * Resource Group: g-NW1_ERS:
       * vip_NW1_ERS       (ocf:heartbeat:IPaddr2):         Started sap-cl2
       * nc_NW1_ERS        (ocf:heartbeat:azure-lb):        Started sap-cl2
   
   Daemon Status:
     corosync: active/disabled
     pacemaker: active/disabled
     pcsd: active/enabled
     sbd: active/enabled
   
   ```

1. **[2]** Install SAP NetWeaver ERS as root on the second node.

   Use a virtual host name that maps to the IP address of the load balancer's front-end configuration for ERS (for example, `sapers`, `10.27.0.10`) and the instance number that you used for the probe of the load balancer (for example, `01`).

   You can use the `SAPINST_REMOTE_ACCESS_USER` parameter to allow a nonroot user to connect to `sapinst`. You can use the `SAPINST_USE_HOSTNAME` parameter to install SAP by using a virtual host name.

   ```bash
   <swpm>/sapinst SAPINST_REMOTE_ACCESS_USER=sapadmin SAPINST_USE_HOSTNAME=<virtual_hostname>
   ```

   > [!NOTE]
   > Use SWPM SP 20 PL 05 or later. Earlier versions don't set the permissions correctly, and they cause the installation to fail.

## Configure SAP to run in the cluster
1. **[1]** Adapt the instance profiles for running in a cluster.
   1. The ASCS and ERS profiles might contain `Restart_Program` configurations for certain instance services by default. Change these entries to `Start_Program` to prevent SAP from automatically restarting the enqueue replication process, because the cluster manages it. 
      1. ASCS Profile (Enqueue Server)
         ```bash
         sudo vi /sapmnt/NW1/profile/NW1_ASCS00_nw1ascs
         [...]
         #-----------------------------------------------------------------------
         # Start SAP enqueue server
         #-----------------------------------------------------------------------
         _ENQ = enq.sap$(SAPSYSTEMNAME)_$(INSTANCE_NAME)
         Execute_04 = local rm -f $(_ENQ)
         Execute_05 = local ln -s -f $(DIR_EXECUTABLE)/enq_server$(FT_EXE) $(_ENQ)
         Start_Program_01 = local $(_ENQ) pf=$(_PF)
         [...]
         ```
      1. ERS Profile (Enqueue Replicator)
         ```bash
         sudo vi /sapmnt/NW1/profile/NW1_ERS01_nw1ers
         [...]
         #-----------------------------------------------------------------------
         # Start enqueue replicator
         #-----------------------------------------------------------------------
         _ENQR = enqr.sap$(SAPSYSTEMNAME)_$(INSTANCE_NAME)
         Execute_02 = local rm -f $(_ENQR)
         Execute_03 = local ln -s -f $(DIR_EXECUTABLE)/enq_replicator$(FT_EXE) $(_ENQR)
         Start_Program_00 = local $(_ENQR) pf=$(_PF)
         [...]
         ```
   1. Add cluster libraries to the profiles of all instances managed by the cluster
      > [!NOTE]
      > In this example, you add only the ASCS and ERS instances to the cluster. However, if you include a Primary Application Server (PAS) in your cluster, add this section to that profile as well.

      ```bash
      sudo vi /sapmnt/NW1/profile/NW1_<instanceProfile>_nw1<instance>
      [...]
      #-----------------------------------------------------------------------
      # SAP Cluster Config
      #-----------------------------------------------------------------------
      service/halib = $(DIR_EXECUTABLE)/saphascriptco.so
      service/halib_cluster_connector = /usr/bin/sap_cluster_connector
      [...]
      ```
   1. Remove `Autostart` from any instances in the cluster, as the cluster manages them.
   1. **ENSA1 only**: Add the Keepalive parameter to the ERS profile.
      ```bash
      sudo vi /sapmnt/NW1/profile/NW1_ERS01_nw1ers
      [...]
      enque/encni/set_so_keepalive = TRUE
      [...]
      ```

1. **[A]** Add the `sidadm` account to the `haclient` group to allow it to run cluster commands.

   ```bash
   sudo usermod -a -G haclient nw1adm
   ```

1. **[A]** Register ASCS and ERS services on both nodes. This step adds or updates the entries in the `/usr/sap/sapservices` file so that both services are listed.

   ```bash
   sudo LD_LIBRARY_PATH=/usr/sap/NW1/ASCS00/exe /usr/sap/NW1/ASCS00/exe/sapstartsrv pf=/usr/sap/NW1/SYS/profile/NW1_ASCS00_nw1ascs -reg
   sudo LD_LIBRARY_PATH=/usr/sap/NW1/ERS01/exe /usr/sap/NW1/ERS01/exe/sapstartsrv pf=/usr/sap/NW1/SYS/profile/NW1_ERS01_nw1ers -reg
   ```

1. **[A]** Ensure all SAP services are stopped and disabled on both nodes. The cluster manages them.
   ```bash
   # Run as sidadm
   sudo su - nw1adm
   sapcontrol -nr 00 -function Stop
   sapcontrol -nr 00 -function StopService
   
   sapcontrol -nr 01 -function Stop
   sapcontrol -nr 01 -function StopService
   #Log off of sidadm
   exit
   
   sudo systemctl disable SAPNW1_00
   sudo systemctl disable SAPNW1_01
   ```

1. **[A]** Prevent SAP services from restarting outside of the cluster.
   ```bash
   sudo mkdir /etc/systemd/system/SAPNW1_00.service.d
   sudo vi /etc/systemd/system/SAPNW1_00.service.d/HA.conf
   [Service]
   Restart=no
   
   sudo mkdir /etc/systemd/system/SAPNW1_01.service.d
   sudo vi /etc/systemd/system/SAPNW1_01.service.d/HA.conf
   [Service]
   Restart=no
   
   sudo systemctl daemon-reload
   ```

1. **[A]** Enable `sapping` and `sappong` services.
   The `sapping` agent runs before `sapinit` to hide the `/usr/sap/sapservices` file. The `sappong` agent runs after `sapinit` to unhide the `sapservices` file during VM boot. `SAPStartSrv` isn't started automatically for an SAP instance at boot time, because the Pacemaker cluster manages it.

   ```bash
   sudo systemctl enable sapping
   sudo systemctl enable sappong
   ```


1. **[1]** Create SAP services in the cluster.
   1. Put the cluster into maintenance mode.
      ```bash
      sudo pcs property set maintenance-mode=true
      ```
   1. Create the ASCS and ERS services.
         :::zone pivot="azurefiles"
         #### [ENSA2](#tab/ensa2)
         ```bash
         # ASCS Resources
         sudo pcs resource create rsc_SAPStartSrv_NW1_ASCS00 ocf:heartbeat:SAPStartSrv InstanceName="NW1_ASCS00_nw1ascs" --group g-NW1_ASCS op monitor interval=0 timeout=20 enabled=0
         sudo pcs resource create rsc_SAPInstance_NW1_ASCS00 ocf:heartbeat:SAPInstance InstanceName="NW1_ASCS00_nw1ascs" MINIMAL_PROBE=true meta resource-stickiness=5000 priority=100 --group g-NW1_ASCS op monitor interval=20 on-fail=restart timeout=60
         
         # ERS Resources
         sudo pcs resource create rsc_SAPStartSrv_NW1_ERS01 ocf:heartbeat:SAPStartSrv InstanceName="NW1_ERS01_nw1ers" --group g-NW1_ERS op monitor interval=0 timeout=20 enabled=0
         sudo pcs resource create rsc_SAPInstance_NW1_ERS01 ocf:heartbeat:SAPInstance InstanceName="NW1_ERS01_nw1ers" MINIMAL_PROBE=true IS_ERS=true --group g-NW1_ERS op monitor interval=20 on-fail=restart timeout=60 op start interval=0 timeout=600 op stop interval=0 timeout=600
         ```
         #### [ENSA1](#tab/ensa1)
         ```bash
         # ASCS Resources
         sudo pcs resource create rsc_SAPStartSrv_NW1_ASCS00 ocf:heartbeat:SAPStartSrv InstanceName="NW1_ASCS00_nw1ascs" --group g-NW1_ASCS op monitor interval=0 timeout=20 enabled=0
         sudo pcs resource create rsc_SAPInstance_NW1_ASCS00 ocf:heartbeat:SAPInstance InstanceName="NW1_ASCS00_nw1ascs" MINIMAL_PROBE=true meta migration-threshold=1 resource-stickiness=5000 priority=100 --group g-NW1_ASCS op monitor interval=20 on-fail=restart timeout=60
         
         # ERS Resources
         sudo pcs resource create rsc_SAPStartSrv_NW1_ERS01 ocf:heartbeat:SAPStartSrv InstanceName="NW1_ERS01_nw1ers" --group g-NW1_ERS op monitor interval=0 timeout=20 enabled=0
         sudo pcs resource create rsc_SAPInstance_NW1_ERS01 ocf:heartbeat:SAPInstance InstanceName="NW1_ERS01_nw1ers" MINIMAL_PROBE=true IS_ERS=true --group g-NW1_ERS op monitor interval=20 on-fail=restart timeout=60 op start interval=0 timeout=600 op stop interval=0 timeout=600
         ```
         ---
         :::zone-end
         :::zone pivot="anf"
         #### [ENSA2](#tab/ensa2)
         ```bash
         # ASCS Resources
         sudo pcs resource create rsc_SAPStartSrv_NW1_ASCS00 ocf:heartbeat:SAPStartSrv InstanceName="NW1_ASCS00_nw1ascs" --group g-NW1_ASCS op monitor interval=0 timeout=20 enabled=0
         # NFSv4.1
         sudo pcs resource create rsc_SAPInstance_NW1_ASCS00 ocf:heartbeat:SAPInstance InstanceName="NW1_ASCS00_nw1ascs" MINIMAL_PROBE=true meta resource-stickiness=5000 priority=100 --group g-NW1_ASCS op monitor interval=20 on-fail=restart timeout=120
         # NFSv3
         sudo pcs resource create rsc_SAPInstance_NW1_ASCS00 ocf:heartbeat:SAPInstance InstanceName="NW1_ASCS00_nw1ascs" MINIMAL_PROBE=true meta resource-stickiness=5000 priority=100 --group g-NW1_ASCS op monitor interval=20 on-fail=restart timeout=60
         
         # ERS Resources
         sudo pcs resource create rsc_SAPStartSrv_NW1_ERS01 ocf:heartbeat:SAPStartSrv InstanceName="NW1_ERS01_nw1ers" --group g-NW1_ERS op monitor interval=0 timeout=20 enabled=0
         # NFSv4.1
         sudo pcs resource create rsc_SAPInstance_NW1_ERS01 ocf:heartbeat:SAPInstance InstanceName="NW1_ERS01_nw1ers" MINIMAL_PROBE=true IS_ERS=true --group g-NW1_ERS op monitor interval=20 on-fail=restart timeout=120 op start interval=0 timeout=600 op stop interval=0 timeout=600
         # NFSv3
         sudo pcs resource create rsc_SAPInstance_NW1_ERS01 ocf:heartbeat:SAPInstance InstanceName="NW1_ERS01_nw1ers" MINIMAL_PROBE=true IS_ERS=true --group g-NW1_ERS op monitor interval=20 on-fail=restart timeout=60 op start interval=0 timeout=600 op stop interval=0 timeout=600
         ```
         #### [ENSA1](#tab/ensa1)
         ```bash
         # ASCS Resources
         sudo pcs resource create rsc_SAPStartSrv_NW1_ASCS00 ocf:heartbeat:SAPStartSrv InstanceName="NW1_ASCS00_nw1ascs" --group g-NW1_ASCS op monitor interval=0 timeout=20 enabled=0
         # NFSv4.1
         sudo pcs resource create rsc_SAPInstance_NW1_ASCS00 ocf:heartbeat:SAPInstance InstanceName="NW1_ASCS00_nw1ascs" MINIMAL_PROBE=true meta migration-threshold=1 resource-stickiness=5000 meta priority=100 --group g-NW1_ASCS op monitor interval=20 on-fail=restart timeout=120
         # NFSv3         
         sudo pcs resource create rsc_SAPInstance_NW1_ASCS00 ocf:heartbeat:SAPInstance InstanceName="NW1_ASCS00_nw1ascs" MINIMAL_PROBE=true meta migration-threshold=1 resource-stickiness=5000 meta priority=100 --group g-NW1_ASCS op monitor interval=20 on-fail=restart timeout=60

         # ERS Resources
         sudo pcs resource create rsc_SAPStartSrv_NW1_ERS01 ocf:heartbeat:SAPStartSrv InstanceName="NW1_ERS01_nw1ers" --group g-NW1_ERS op monitor interval=0 timeout=20 enabled=0
         # NFSv4.1
         sudo pcs resource create rsc_SAPInstance_NW1_ERS01 ocf:heartbeat:SAPInstance InstanceName="NW1_ERS01_nw1ers" MINIMAL_PROBE=true IS_ERS=true --group g-NW1_ERS op monitor interval=20 on-fail=restart timeout=120 op start interval=0 timeout=600 op stop interval=0 timeout=600
         # NFSv3
         sudo pcs resource create rsc_SAPInstance_NW1_ERS01 ocf:heartbeat:SAPInstance InstanceName="NW1_ERS01_nw1ers" MINIMAL_PROBE=true IS_ERS=true --group g-NW1_ERS op monitor interval=20 on-fail=restart timeout=60 op start interval=0 timeout=600 op stop interval=0 timeout=600
         ```
         ---
         :::zone-end
   1. Configure properties and constraints for the cluster.
      ```bash
      sudo pcs property set priority-fencing-delay=15
      sudo pcs resource meta g-NW1_ASCS resource-stickiness=3000
      sudo pcs constraint colocation add g-NW1_ERS with g-NW1_ASCS -5000 id=col_sap_NW1_no_both
      sudo pcs constraint order start g-NW1_ASCS then stop g-NW1_ERS symmetrical=false kind=Optional id=ord_sap_NW1_first_start_ascs
      ```
   1. **ENSA1 only**: Configure additional constraint.
      #### [RHEL 10.x](#tab/rhel10)
      ```bash
      sudo pcs constraint location g-NW1_ASCS rule score=2000 "runs_ers_NW1 eq 1"
      ```
      #### [RHEL 9.x](#tab/rhel9)
      ```bash
      sudo pcs constraint location g-NW1_ASCS rule score=2000 runs_ers_NW1 eq 1
      ```
   1. Enable the nodes and take the cluster out of maintenance mode.
      ```bash
      sudo pcs node unstandby sap-cl1
      sudo pcs property set maintenance-mode=false
      ```
1. Verify cluster setup. Your cluster should have a similar status.
   ```bash
   sudo pcs status
   
   Cluster name: sap-cl
   Cluster Summary:
     * Stack: corosync (Pacemaker is running)
     * Current DC: sap-cl1 (version 2.1.9-1.2.el9_6-49aab9983) - partition with quorum
     * Last updated: Tue Jun  2 23:46:27 2026 on sap-cl1
     * Last change:  Tue May 26 18:30:18 2026 by root via root on sap-cl1
     * 2 nodes configured
     * 9 resource instances configured
   
   Node List:
     * Online: [ sap-cl1 sap-cl2 ]
   
   Full List of Resources:
     * sbd (stonith:fence_sbd):     Started sap-cl1
     * Resource Group: g-NW1_ASCS:
       * vip_NW1_ASCS      (ocf:heartbeat:IPaddr2):         Started sap-cl1
       * nc_NW1_ASCS       (ocf:heartbeat:azure-lb):        Started sap-cl1
       * rsc_SAPStartSrv_NW1_ASCS00        (ocf:heartbeat:SAPStartSrv):     Started sap-cl1
       * rsc_SAPInstance_NW1_ASCS00        (ocf:heartbeat:SAPInstance):     Started sap-cl1
     * Resource Group: g-NW1_ERS:
       * vip_NW1_ERS       (ocf:heartbeat:IPaddr2):         Started sap-cl2
       * nc_NW1_ERS        (ocf:heartbeat:azure-lb):        Started sap-cl2
       * rsc_SAPStartSrv_NW1_ERS01 (ocf:heartbeat:SAPStartSrv):     Started sap-cl2
       * rsc_SAPInstance_NW1_ERS01 (ocf:heartbeat:SAPInstance):     Started sap-cl2
   
   Daemon Status:
     corosync: active/disabled
     pacemaker: active/disabled
     pcsd: active/enabled
     sbd: active/enabled
   ```
   
> [!NOTE]
> You can extend a SAP ASCS/ERS cluster from a 2-node to a 3-node cluster with a third node as a spare for failover of ASCS or ERS services.
> - A 3-node cluster setup can only be used with Enqueue Replication Server 2 (ENSA2).
> - Don't use the cluster property `priority-fencing-delay` in a 3-node cluster. 

[!INCLUDE [high-availability-app-server](../../../includes/sap/high-availability-app-server.md)]

## Test your cluster setup

Thoroughly test your Pacemaker cluster. Run the typical [failover tests][azdoc-sap-rhel-test-cluster].

## Next steps

- [HA for SAP NetWeaver on Azure VMs on RHEL for SAP with HA and Update Services multi-SID guide][azdoc-sap-rhel-multi-sid]
- [SAP workload configurations with Azure availability zones][azdoc-sap-ha-zones]
- [Azure Virtual Machines planning and implementation for SAP][azdoc-sap-planning-guide]
- [Azure Virtual Machines deployment for SAP][azdoc-sap-deployment-guide]
- [Azure Virtual Machines DBMS deployment for SAP][azdoc-sap-dbms-guide]
- [High Availability of SAP HANA on Azure VMs][azdoc-sap-hana-ha]


[sapdoc-ports]: https://help.sap.com/docs/Security/575a9f0e56f34c6e8138439eefc32b16/616a3c0b1cc748238de9c0341b15c63c.html

[azdoc-sap-ha-zones]: ./high-availability-zones.md
[azdoc-sap-hana-ha]: ./sap-hana-high-availability.md
[azdoc-sap-dbms-guide]: ./dbms-guide-general.md
[azdoc-sap-deployment-guide]: ./deployment-guide.md
[azdoc-sap-planning-guide]: ./planning-guide.md
[azdoc-sap-rhel-pacemaker]: ./high-availability-guide-rhel-pacemaker.md
[azdoc-sap-rhel-test-cluster]: ./high-availability-guide-rhel.md#test-the-cluster-setup
[azdoc-sap-rhel-multi-sid]: ./high-availability-guide-rhel-multi-sid.md

[sapnote-2526952-rhel]: https://me.sap.com/notes/2526952
[sapnote-3108316-rhel9]: https://me.sap.com/notes/3108316
[sapnote-3562909-rhel10]: https://me.sap.com/notes/3562909

[rheldoc-sap-on-rhel9]: https://docs.redhat.com/en/documentation/red_hat_enterprise_linux_for_sap_solutions/9
[rheldoc-sap-on-rhel10]: https://docs.redhat.com/en/documentation/red_hat_enterprise_linux_for_sap_solutions/10
[rheldoc-sap-ha-addon]: https://docs.redhat.com/en/documentation/red_hat_enterprise_linux_for_sap_solutions/9/html-single/configuring_ha_clusters_to_manage_sap_netweaver_or_sap_s4hana_application_server_instances_using_the_rhel_ha_add-on/index
[rheldoc-sap-ha-simplemount]: https://docs.redhat.com/en/documentation/red_hat_enterprise_linux_for_sap_solutions/9/html-single/deploying_sap_netweaver_or_s4hana_application_server_high_availability_with_simple_mount/index
[rheldoc-sap-simplemount-ensa2-versions]: https://access.redhat.com/articles/4016901#changes_ra_sap
[rheldoc-sap-simplemount-ensa1-versions]: https://access.redhat.com/articles/3190982#changes_ra_sap
