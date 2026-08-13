---
title: Azure VMs high availability for SAP NetWeaver on SLES for SAP Applications with simple mount and NFS
description: Learn how to configure high-availability SAP NetWeaver on SUSE Linux Enterprise Server with simple mount and NFS for SAP applications.
services: virtual-machines-windows,virtual-network,storage
ms.service: sap-on-azure
ms.subservice: sap-vm-workloads
ms.topic: how-to
manager: juergent
author: rdeltcheva
ms.author: radeltch
ms.date: 03/04/2026
zone_pivot_groups: sap-ha-nfs-solution
ms.custom:
  - devx-track-azurecli
  - devx-track-azurepowershell
  - linux-related-content
  - sfi-image-nochange
# Customer intent: "As an IT administrator, I want to deploy a high-availability SAP NetWeaver system on Azure using NFS for shared storage, so that I can ensure continuous service and reliability for my applications running on SUSE Linux Enterprise Server."
---

# High-availability SAP NetWeaver with simple mount and NFS on SLES for SAP Virtual Machines

[!INCLUDE [high-availability-simple-mount-overview](../../../includes/sap/high-availability-simple-mount-overview.md)]

> [!IMPORTANT]
> SUSE supports the cluster configuration with simple mount on SLES for SAP Applications 15 and later releases.

## Prerequisites

The following guides contain all the required information to configure a NetWeaver HA system:

- SUSE Documentation
   - [SUSE SAP High Availability with Simple Mount][susedoc-sap-ha-simplemount]
   - [SUSE Simple Mount KB 19944][susedoc-kb-19944]
   - [SAP Applications on SLES 16 Best Practices][susedoc-sap-sles-16-bestpractices]
   - [SAP Applications on SLES 15 Best Practices][susedoc-sap-sles-15-bestpractices]
   - [SUSE Release Notes][susedoc-release-notes]
- SAP Documentation for SUSE
   - SAP Note [1275776][sapnote-1275776-sles]: SAP SUSE Documentation
   - SAP Note [3565382][sapnote-3565382-sles16]: recommended OS settings for SLES 16
   - SAP Note [2578899][sapnote-2578899-sles15]: recommended OS settings for SLES 15

[!INCLUDE [high-availability-linux-prerequisites](../../../includes/sap/high-availability-linux-prerequisites.md)]

## Prepare the infrastructure

The resource agent for SAP Instance is included in SUSE Linux Enterprise Server for SAP images in the Azure Marketplace. You can use it to deploy new VMs.

### Deploy Linux VMs manually via Azure portal

This article assumes that you previously deployed a resource group, [Azure Virtual Network](../../virtual-network/virtual-networks-overview.md), and subnet for your cluster.

Deploy VMs for SAP ASCS, ERS, and application servers. Choose a suitable version of SLES that is supported for your SAP system. You can deploy VMs in any one of the availability options - virtual machine scale set, availability zone, or availability set.

### Configure Azure load balancer

[!INCLUDE [high-availability-load-balancer](../../../includes/sap/high-availability-load-balancer.md)]

> [!IMPORTANT]
> - To prevent `saptune` from changing the manually set `net.ipv4.tcp_timestamps` value from `0` back to `1`, update `saptune` to version 3.1.1 or later. For more information, see [Saptune 3.1.1 – Do I Need to Update?](https://www.suse.com/c/saptune-3-1-1-do-i-need-to-update/)

:::zone pivot="azurefiles"
[!INCLUDE [nfs-azure-files-deployment](../../../includes/sap/nfs-azure-files-deployment.md)]
:::zone-end

:::zone pivot="anf"
[!INCLUDE [nfs-netapp-files-deployment](../../../includes/sap/nfs-netapp-files-deployment.md)]
:::zone-end

## Prepare Pacemaker cluster nodes for SAP installation

The next step is to prepare the nodes for installation. Begin by following the steps in [Set up Pacemaker on SUSE Linux Enterprise Server in Azure][azdoc-sap-sles-pacemaker], then continue.

> [!NOTE]
> The following items are prefixed with:
> - **[A]**: Applicable to all nodes.
> - **[1]**: Applicable to only node 1.
> - **[2]**: Applicable to only node 2.

1. **[A]** Install the latest version of the SAP Cluster Connector and the SAP Resource Agents.

   ```bash
   sudo zypper -n install sap-suse-cluster-connector sapstartsrv-resource-agents
   ```
   
   > [!IMPORTANT]
   > You need to have `sapstartsrv-resource-agents 0.9.1` or a later version for Simple Mount.

[!INCLUDE [high-availability-node-default](../../../includes/sap/high-availability-node-default.md)]

5. **[1]** Configure Pacemaker Resource Defaults
   
   ```bash
   # Check Values
   sudo crm configure show type:rsc_defaults
   # Output
   rsc_defaults build-resource-defaults: \
        resource-stickiness=1 \
        migration-threshold=3 \
        priority=1
   
   # Set Values if Required
   sudo crm configure rsc_defaults resource-stickiness=1 migration-threshold=3
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
   > We recommend using the `azure-lb` resource agent, which is part of the resource-agents package.

   ```bash
   sudo crm node standby sap-cl2
   sudo crm configure primitive vip_NW1_ASCS IPaddr2 params ip=10.27.0.9 \
      op monitor interval=10 timeout=20
   sudo crm configure primitive nc_NW1_ASCS azure-lb port=62500 \
      op monitor timeout=20s interval=10
   sudo crm configure group g-NW1_ASCS nc_NW1_ASCS vip_NW1_ASCS \
      meta resource-stickiness=3000
   ```

   Check that the cluster status is OK and all resources are started. As long as the resources in `g-NW1_ASCS` are on `sap-cl1`, you're good. 

   ```bash
   sudo crm status

   Cluster Summary:
     * Stack: corosync (Pacemaker is running)
     * Current DC: sap-cl1 (version 2.1.7+20231219.0f7f88312-150600.6.12.1-2.1.7+20231219.0f7f88312) - partition with quorum
     * Last updated: Wed Jul  8 21:26:21 2026 on sap-cl1
     * Last change:  Mon Jun  8 20:49:31 2026 by root via root on sap-cl1
     * 2 nodes configured
     * 3 resource instances configured

   Node List:
     * Node sap-cl2: standby
     * Online: [ sap-cl1 ]

   Full List of Resources:
     * stonith-sbd (stonith:external/sbd):  Started sap-cl1
     * Resource Group: g-NW1_ASCS:
       * nc_NW1_ASCS       (ocf::heartbeat:azure-lb):       Started sap-cl1
       * vip_NW1_ASCS      (ocf::heartbeat:IPaddr2):        Started sap-cl1
   ```

1. **[1]** Install SAP NetWeaver ASCS as root on the first node.

   Use a virtual host name that maps to the IP address of the load balancer's front-end configuration for ASCS (for example, `sapascs`, `10.27.0.9`) and the instance number that you used for the probe of the load balancer (for example, `00`).

   You can use the `sapinst` parameter `SAPINST_REMOTE_ACCESS_USER` to allow a nonroot user to connect to `sapinst`. You can use the `SAPINST_USE_HOSTNAME` parameter to install SAP by using a virtual host name.

   ```bash
   sudo <swpm>/sapinst SAPINST_REMOTE_ACCESS_USER=sapadmin SAPINST_USE_HOSTNAME=<virtual_hostname>
   ```

1. **[1]** Create a virtual IP resource and health probe for the ERS instance.

   ```bash
   sudo crm node online sap-cl2
   sudo crm node standby sap-cl1

   sudo crm configure primitive vip_NW1_ERS IPaddr2 params ip=10.27.0.10 \
      op monitor interval=10 timeout=20
   sudo crm configure primitive nc_NW1_ERS azure-lb port=62501 \
      op monitor timeout=20s interval=10
   sudo crm configure group g-NW1_ERS nc_NW1_ERS vip_NW1_ERS
   ```

   Check that the cluster status is OK and all resources are started. As long as the resources in `g-NW1_ERS` are on `sap-cl2`, you're good.

   ```bash
   sudo crm status

   Cluster Summary:
     * Stack: corosync (Pacemaker is running)
     * Current DC: sap-cl1 (version 2.1.7+20231219.0f7f88312-150600.6.12.1-2.1.7+20231219.0f7f88312) - partition with quorum
     * Last updated: Wed Jul  8 21:26:21 2026 on sap-cl1
     * Last change:  Mon Jun  8 20:49:31 2026 by root via root on sap-cl1
     * 2 nodes configured
     * 5 resource instances configured

   Node List:
     * Node sap-cl1: standby
     * Online: [ sap-cl2 ]

   Full List of Resources:
     * stonith-sbd (stonith:external/sbd):  Started sap-cl2
     * Resource Group: g-NW1_ASCS:
       * nc_NW1_ASCS       (ocf::heartbeat:azure-lb):       Started sap-cl2
       * vip_NW1_ASCS      (ocf::heartbeat:IPaddr2):        Started sap-cl2
     * Resource Group: g-NW1_ERS:
       * nc_NW1_ERS        (ocf::heartbeat:azure-lb):       Started sap-cl2
       * vip_NW1_ERS       (ocf::heartbeat:IPaddr2):        Started sap-cl2
   ```

1. **[2]** Install SAP NetWeaver ERS as root on the second node.

   Use a virtual host name that maps to the IP address of the load balancer's front-end configuration for ERS (for example, `sapers`, `10.27.0.10`) and the instance number that you used for the probe of the load balancer (for example, `01`).

   You can use the `SAPINST_REMOTE_ACCESS_USER` parameter to allow a nonroot user to connect to `sapinst`. You can use the `SAPINST_USE_HOSTNAME` parameter to install SAP by using a virtual host name.

   ```bash
   <swpm>/sapinst SAPINST_REMOTE_ACCESS_USER=sapadmin SAPINST_USE_HOSTNAME=virtual_hostname
   ```

   > [!NOTE]
   > Use SWPM SP 20 PL 05 or later. Earlier versions don't set the permissions correctly, and they cause the installation to fail.

## Configure SAP to run in the cluster
1. **[1]** Add cluster libraries to the profiles of all instances managed by the cluster.

   ```bash
   sudo vi /sapmnt/NW1/profile/NW1_<instanceProfile>_nw1<instance>
   [...]
   #-----------------------------------------------------------------------
   # SAP Cluster Config
   #-----------------------------------------------------------------------
   service/halib = $(DIR_EXECUTABLE)/saphascriptco.so
   service/halib_cluster_connector = /usr/bin/sap_suse_cluster_connector
   [...]
   ```

[!INCLUDE [high-availability-sap-cluster-services](../../../includes/sap/high-availability-sap-cluster-services.md)]


7. **[1]** Create SAP services in the cluster.
   1. Put the cluster into maintenance mode.
      ```bash
      sudo crm configure property maintenance-mode=true
      ```
   1. Create the ASCS and ERS services.
      :::zone pivot="azurefiles"
      #### [ENSA2](#tab/ensa2)
      ```bash
      # ASCS Resources
      sudo crm configure primitive rsc_SAPStartSrv_NW1_ASCS00 \
         ocf:suse:SAPStartSrv params InstanceName=NW1_ASCS00_nw1ascs
      sudo crm configure primitive rsc_SAPInstance_NW1_ASCS00 SAPInstance \
         op monitor interval=11 timeout=60 on-fail=restart \
         params InstanceName=NW1_ASCS00_nw1ascs \
         START_PROFILE="/sapmnt/NW1/profile/NW1_ASCS00_nw1ascs" \
         AUTOMATIC_RECOVER=false MINIMAL_PROBE=true \
         meta resource-stickiness=5000 priority=100
      
      # ERS Resources
      sudo crm configure primitive rsc_SAPStartSrv_NW1_ERS01 \
         ocf:suse:SAPStartSrv params InstanceName=NW1_ERS01_nw1ers
      sudo crm configure primitive rsc_SAPInstance_NW1_ERS01 SAPInstance \
         op monitor interval=11 timeout=60 on-fail=restart \
         params InstanceName=NW1_ERS01_nw1ers \
         START_PROFILE="/sapmnt/NW1/profile/NW1_ERS01_nw1ers" \
         AUTOMATIC_RECOVER=false IS_ERS=true MINIMAL_PROBE=true
      ```
      #### [ENSA1](#tab/ensa1)
      ```bash
      # ASCS Resources
      sudo crm configure primitive rsc_SAPStartSrv_NW1_ASCS00 \
         ocf:suse:SAPStartSrv params InstanceName=NW1_ASCS00_nw1ascs
      sudo crm configure primitive rsc_SAPInstance_NW1_ASCS00 SAPInstance \
         op monitor interval=11 timeout=60 on-fail=restart \
         params InstanceName=NW1_ASCS00_nw1ascs \
         START_PROFILE="/sapmnt/NW1/profile/NW1_ASCS00_nw1ascs" \
         AUTOMATIC_RECOVER=false MINIMAL_PROBE=true \
         meta resource-stickiness=5000 priority=10 \
         failure-timeout=60 migration-threshold=1
      
      # ERS Resources
      sudo crm configure primitive rsc_SAPStartSrv_NW1_ERS01 \
         ocf:suse:SAPStartSrv params InstanceName=NW1_ERS01_nw1ers
      sudo crm configure primitive rsc_SAPInstance_NW1_ERS01 SAPInstance \
         op monitor interval=11 timeout=60 on-fail=restart \
         params InstanceName=NW1_ERS01_nw1ers \
         START_PROFILE="/sapmnt/NW1/profile/NW1_ERS01_nw1ers" \
         AUTOMATIC_RECOVER=false IS_ERS=true MINIMAL_PROBE=true \
         meta priority=1000
      ```
      ---
      :::zone-end
      :::zone pivot="anf"
      #### [ENSA2](#tab/ensa2)
      ```bash
      # ASCS Resources
      sudo crm configure primitive rsc_SAPStartSrv_NW1_ASCS00 \
         ocf:suse:SAPStartSrv params InstanceName=NW1_ASCS00_nw1ascs
      # NFSv4.1
      sudo crm configure primitive rsc_SAPInstance_NW1_ASCS00 SAPInstance \
         op monitor interval=11 timeout=120 on-fail=restart \
         params InstanceName=NW1_ASCS00_nw1ascs \
         START_PROFILE="/sapmnt/NW1/profile/NW1_ASCS00_nw1ascs" \
         AUTOMATIC_RECOVER=false MINIMAL_PROBE=true \
         meta resource-stickiness=5000 priority=100
      # NFSv3
      sudo crm configure primitive rsc_SAPInstance_NW1_ASCS00 SAPInstance \
         op monitor interval=11 timeout=60 on-fail=restart \
         params InstanceName=NW1_ASCS00_nw1ascs \
         START_PROFILE="/sapmnt/NW1/profile/NW1_ASCS00_nw1ascs" \
         AUTOMATIC_RECOVER=false MINIMAL_PROBE=true \
         meta resource-stickiness=5000 priority=100         

      # ERS Resources
      sudo crm configure primitive rsc_SAPStartSrv_NW1_ERS01 \
         ocf:suse:SAPStartSrv params InstanceName=NW1_ERS01_nw1ers
      # NFSv4.1
      sudo crm configure primitive rsc_SAPInstance_NW1_ERS01 SAPInstance \
         op monitor interval=11 timeout=120 on-fail=restart \
         params InstanceName=NW1_ERS01_nw1ers \
         START_PROFILE="/sapmnt/NW1/profile/NW1_ERS01_nw1ers" \
         AUTOMATIC_RECOVER=false IS_ERS=true MINIMAL_PROBE=true
      # NFSv3
      sudo crm configure primitive rsc_SAPInstance_NW1_ERS01 SAPInstance \
         op monitor interval=11 timeout=60 on-fail=restart \
         params InstanceName=NW1_ERS01_nw1ers \
         START_PROFILE="/sapmnt/NW1/profile/NW1_ERS01_nw1ers" \
         AUTOMATIC_RECOVER=false IS_ERS=true MINIMAL_PROBE=true
      ```
      #### [ENSA1](#tab/ensa1)
      ```bash
      # ASCS Resources
      sudo crm configure primitive rsc_SAPStartSrv_NW1_ASCS00 \
         ocf:suse:SAPStartSrv params InstanceName=NW1_ASCS00_nw1ascs
      # NFSv4.1
      sudo crm configure primitive rsc_SAPInstance_NW1_ASCS00 SAPInstance \
         op monitor interval=11 timeout=120 on-fail=restart \
         params InstanceName=NW1_ASCS00_nw1ascs \
         START_PROFILE="/sapmnt/NW1/profile/NW1_ASCS00_nw1ascs" \
         AUTOMATIC_RECOVER=false MINIMAL_PROBE=true \
         meta resource-stickiness=5000 priority=10 \
         failure-timeout=60 migration-threshold=1
      # NFSv3
      sudo crm configure primitive rsc_SAPInstance_NW1_ASCS00 SAPInstance \
         op monitor interval=11 timeout=60 on-fail=restart \
         params InstanceName=NW1_ASCS00_nw1ascs \
         START_PROFILE="/sapmnt/NW1/profile/NW1_ASCS00_nw1ascs" \
         AUTOMATIC_RECOVER=false MINIMAL_PROBE=true \
         meta resource-stickiness=5000 priority=10 \
         failure-timeout=60 migration-threshold=1
      
      # ERS Resources
      sudo crm configure primitive rsc_SAPStartSrv_NW1_ERS01 \
         ocf:suse:SAPStartSrv params InstanceName=NW1_ERS01_NW1ers
      # NFSv4.1
      sudo crm configure primitive rsc_SAPInstance_NW1_ERS01 SAPInstance \
         op monitor interval=11 timeout=120 on-fail=restart \
         params InstanceName=NW1_ERS01_nw1ers \
         START_PROFILE="/sapmnt/NW1/profile/NW1_ERS01_nw1ers" \
         AUTOMATIC_RECOVER=false IS_ERS=true MINIMAL_PROBE=true \
         meta priority=1000
      # NFSv3
      sudo crm configure primitive rsc_SAPInstance_NW1_ERS01 SAPInstance \
         op monitor interval=11 timeout=60 on-fail=restart \
         params InstanceName=NW1_ERS01_nw1ers \
         START_PROFILE="/sapmnt/NW1/profile/NW1_ERS01_nw1ers" \
         AUTOMATIC_RECOVER=false IS_ERS=true MINIMAL_PROBE=true \
         meta priority=1000
      ```
      ---
      :::zone-end
   1. Configure groups and constraints for the cluster.
      ```bash
      sudo crm configure modgroup g-NW1_ASCS add rsc_sapstartsrv_NW1_ASCS00
      sudo crm configure modgroup g-NW1_ASCS add rsc_sap_NW1_ASCS00
      sudo crm configure modgroup g-NW1_ERS add rsc_sapstartsrv_NW1_ERS01
      sudo crm configure modgroup g-NW1_ERS add rsc_sap_NW1_ERS01

      sudo crm configure colocation col_sap_NW1_no_both -5000: g-NW1_ERS g-NW1_ASCS
      sudo crm configure order ord_sap_NW1_first_start_ascs \
         Optional: rsc_sap_NW1_ASCS00:start rsc_sap_NW1_ERS01:stop symmetrical=false
      ```
   1. Configure ENSA specific properties and constraints.
      #### [ENSA2](#tab/ensa2)
      ```bash
      sudo crm configure property priority-fencing-delay=30
      ```
      #### [ENSA1](#tab/ensa1)
      ```bash
      sudo crm_attribute --delete --name priority-fencing-delay
      sudo crm configure location loc_sap_NW1_failover_to_ers \
         rsc_sap_NW1_ASCS00 rule 2000: runs_ers_NW1 eq 1
      ```
   1. Enable the nodes and take the cluster out of maintenance mode.
      ```bash
      sudo crm node online sap-cl1
      sudo crm configure property maintenance-mode=false
      ```
1. Verify your cluster setup. It should have a similar status.
   ```bash
   sudo crm status

   Cluster Summary:
     * Stack: corosync (Pacemaker is running)
     * Current DC: sap-cl1 (version 2.1.7+20231219.0f7f88312-150600.6.12.1-2.1.7+20231219.0f7f88312) - partition with quorum
     * Last updated: Wed Jul  8 21:26:21 2026 on sap-cl1
     * Last change:  Mon Jun  8 20:49:31 2026 by root via root on sap-cl1
     * 2 nodes configured
     * 9 resource instances configured

   Node List:
     * Online: [ sap-cl1 sap-cl2 ]

   Full List of Resources:
     * stonith-sbd (stonith:external/sbd):  Started sap-cl2
     * Resource Group: g-NW1_ASCS:
       * nc_NW1_ASCS       (ocf::heartbeat:azure-lb):       Started sap-cl1
       * vip_NW1_ASCS      (ocf::heartbeat:IPaddr2):        Started sap-cl1
       * rsc_SAPStartSrv_NW1_ASCS00         (ocf::suse:SAPStartSrv):         Started sap-cl1
       * rsc_SAPInstance_NW1_ASCS00         (ocf::heartbeat:SAPInstance):    Started sap-cl1
     * Resource Group: g-NW1_ERS:
       * nc_NW1_ERS        (ocf::heartbeat:azure-lb):       Started sap-cl2
       * vip_NW1_ERS       (ocf::heartbeat:IPaddr2):        Started sap-cl2
       * rsc_SAPStartSrv_NW1_ERS01         (ocf::suse:SAPStartSrv):         Started sap-cl2
       * rsc_SAPInstance_NW1_ERS01         (ocf::heartbeat:SAPInstance):    Started sap-cl2
   ```

> [!NOTE]
> You can extend a SAP ASCS/ERS cluster from a two-node to a three-node cluster with a third node as a spare for failover of ASCS or ERS services.
> - A three-node cluster setup can only be used with Enqueue Replication Server 2 (ENSA2).
> - Don't use the cluster property `priority-fencing-delay` in a three-node cluster. 

[!INCLUDE [high-availability-app-server](../../../includes/sap/high-availability-app-server.md)]

## Test your cluster setup

Thoroughly test your Pacemaker cluster. Run the typical [failover tests][azdoc-sap-sles-test-cluster].

## Next steps

- [HA for SAP NetWeaver on Azure VMs on SLES for SAP applications multi-SID guide][azdoc-sap-sles-multi-sid]
- [SAP workload configurations with Azure availability zones][azdoc-sap-ha-zones]
- [Azure Virtual Machines planning and implementation for SAP][azdoc-sap-planning-guide]
- [Azure Virtual Machines deployment for SAP][azdoc-sap-deployment-guide]
- [Azure Virtual Machines DBMS deployment for SAP][azdoc-sap-dbms-guide]
- [High Availability of SAP HANA on Azure VMs][azdoc-sap-hana-ha]

[azdoc-sap-ha-zones]: ./high-availability-zones.md
[azdoc-sap-hana-ha]: ./sap-hana-high-availability.md
[azdoc-sap-dbms-guide]: ./dbms-guide-general.md
[azdoc-sap-deployment-guide]: ./deployment-guide.md
[azdoc-sap-planning-guide]: ./planning-guide.md
[azdoc-sap-sles-pacemaker]: ./high-availability-guide-suse-pacemaker.md
[azdoc-sap-sles-test-cluster]: ./high-availability-guide-suse.md#test-the-cluster-setup
[azdoc-sap-sles-multi-sid]: ./high-availability-guide-suse-multi-sid.md

[sapnote-1275776-sles]: https://me.sap.com/notes/1275776
[sapnote-2578899-sles15]: https://me.sap.com/notes/2578899
[sapnote-3565382-sles16]: https://me.sap.com/notes/3565382

[susedoc-sap-ha-simplemount]: https://documentation.suse.com/en-us/sbp/sap-15/html/SAP-S4HA10-setupguide-simplemount-sle15/
[susedoc-kb-19944]: https://support.scc.suse.com/s/kb/Use-of-Filesystem-resource-for-ASCS-ERS-HA-setup-not-possible?language=en_US
[susedoc-sap-sles-15-bestpractices]: https://documentation.suse.com/en-us/sbp/sap-15/
[susedoc-sap-sles-16-bestpractices]: https://documentation.suse.com/en-us/sbp/sap-16/
[susedoc-release-notes]: https://www.suse.com/releasenotes/index.html
