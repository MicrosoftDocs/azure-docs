---
title: Set up Pacemaker on SUSE Linux Enterprise Server (SLES) in Azure | Microsoft Docs
description: This article discusses how to set up Pacemaker on SUSE Linux Enterprise Server in Azure.
services: virtual-machines-windows,virtual-network,storage
author: rdeltcheva
manager: juergent
ms.service: sap-on-azure
ms.subservice: sap-vm-workloads
ms.topic: article
ms.custom: devx-track-azurepowershell, linux-related-content
ms.date: 08/01/2026
ms.author: radeltch
# Customer intent: "As a system administrator, I want to set up Pacemaker with fencing on SUSE Linux Enterprise Server in Azure, so that I can ensure high availability and reliability for my applications running in the cloud."
zone_pivot_groups: sap-pacemaker-fencing-solution
---

# Set up Pacemaker on SUSE Linux Enterprise Server in Azure

This article explains how to set up and configure a basic two node Pacemaker cluster on SUSE Linux Enterprise Server (SLES) in Azure. These instructions cover `SLES for SAP 12 SP5`, `SLES for SAP 15 SP 4+`, and  `SLES for SAP 16`.

## Prerequisites

* SLES High Availability (HA) documentation
   * [SLES High Availability Administration Guide][susedoc-ha-admin-guide]
   * [SLES 16 High Availability Documentation Hub][susedoc-ha-sles16-hub]

* SLES documentation for SAP Offerings
   * [SLES Supported High Availability Solutions for SAP Applications][susedoc-ha-sap]

## Overview

[!INCLUDE [pacemaker-overview](../../../includes/sap/pacemaker-overview.md)]

<!--- Fencing Option Overview --->
:::zone pivot="sbd-shared-disk"
[!INCLUDE [pacemaker-sbd-shared-disk-overview](../../../includes/sap/pacemaker-sbd-shared-disk-overview.md)]
:::zone-end

:::zone pivot="sbd-iscsi"
[!INCLUDE [pacemaker-sbd-iscsi-overview](../../../includes/sap/pacemaker-sbd-iscsi-overview.md)]
:::zone-end

:::zone pivot="azure-fence-agent"
[!INCLUDE [pacemaker-fence-agent-overview](../../../includes/sap/pacemaker-fence-agent-overview.md)]
:::zone-end


<!--- Fencing Option Deployment --->

:::zone pivot="sbd-shared-disk"
[!INCLUDE [pacemaker-sbd-shared-disk-deploy](../../../includes/sap/pacemaker-sbd-shared-disk-deploy.md)]
:::zone-end

:::zone pivot="sbd-iscsi"

## Use iSCSI targets
### Build iSCSI target host servers

1. Deploy three virtual machines that run on a supported SLES OS version. The VMs don't need to be large. VM sizes such as Standard_E2s or Standard_D2s are sufficient.
   > [!NOTE]
   > You don't need to use SLES for SAP Applications OS image for the iSCSI target server. You can use a standard SLES OS image instead. However, the support life cycle varies between different OS product releases.

1. Install the latest updates, and reboot if required.
   ```bash
   sudo zypper -n update
   ```
1. Install the iSCSI target package.
   ```bash
   sudo zypper -n install targetcli-fb
   ```
1. Enable and start the iSCSI service.
   ```bash
   sudo systemctl start targetcli
   sudo systemctl enable targetcli
   ```

[!INCLUDE [sap-pacemaker-sbd-iscsi-deploy-create-targets](../../../includes/sap/pacemaker-sbd-iscsi-deploy-create-targets.md)]

:::zone-end

:::zone pivot="azure-fence-agent"
[!INCLUDE [sap-pacemaker-fence-agent-deploy](../../../includes/sap/pacemaker-fence-agent-deploy.md)]
:::zone-end

## Create and configure cluster
1. **[A]** Update the OS and reboot if required.
   ```bash
   sudo zypper -n update
   ```
1. **[A]** Install required cluster packages.
   ```bash
   sudo zypper -n install socat pacemaker resource-agents 
   ```
1. **[A]** Install required fencing packages.

   :::zone pivot="sbd-shared-disk"
   ```bash
   sudo zypper -n install sbd
   ```
   :::zone-end
   
   :::zone pivot="sbd-iscsi"
   ```bash
   sudo zypper -n install sbd open-iscsi
   ```
   :::zone-end
   
   :::zone pivot="azure-fence-agent"
   ```bash
   sudo zypper -n install fence-agents-azure-arm
   ```
   :::zone-end

1. **[A]** Configure DNS.

   You can either use a DNS server or modify `/etc/hosts` on all nodes. This example shows how to use the `/etc/hosts` file.

   Update the entries to match your IPs and hostnames.
   :::zone pivot="sbd-shared-disk,azure-fence-agent"
   ```bash
   sudo vi /etc/hosts
   [...]
   # IP address of cluster node 1
   10.27.0.6    sap-cl1
   # IP address of cluster node 2
   10.27.0.7    sap-cl2
   ```
   :::zone-end
   :::zone pivot="sbd-iscsi"
   ```bash
   sudo vi /etc/hosts
   [...]
   # IP address of cluster node 1
   10.0.0.6    sap-cl1
   # IP address of cluster node 2
   10.0.0.7    sap-cl2
   # IP address of iSCSI Target Host Server 1
   10.0.0.17   sbd-iscsi1
   # IP address of iSCSI Target Host Server 1
   10.0.0.18   sbd-iscsi2
   # IP address of iSCSI Target Host Server 1
   10.0.0.19   sbd-iscsi3
   ```
   :::zone-end
   
1. **[A]** Exchange SSH root keys between the nodes.
   ```bash
   sudo ssh-keygen -t ed25519 -N "" -f /root/.ssh/id_ed25519
   sudo cat /root/.ssh/id_ed25519.pub
   sudo vi /root/.ssh/authorized_keys
   [...]
   <Contents from cat command on other server>
   ```
1. **[A]** Configure the operating system.
   1. Adjust the dirty cache for NFS clients on high memory systems. See [this][susedoc-kb17857-writeperf-nfs] article for more information.
      ```bash
      sudoedit /etc/sysctl.d/30-nfs.conf && sudo sysctl --system
      ```
      ```/etc/sysctl.d/30-nfs.conf
      vm.dirty_bytes = 629145600
      vm.dirty_background_bytes = 314572800
      ```
   1. Make sure `vm.swappiness` is set to 10 to reduce swap usage and favor memory.
      ```bash
      sudoedit /etc/sysctl.d/31-memswap.conf && sudo sysctl --system
      ```
      ```/etc/sysctl.d/31-memswap.conf
      vm.swappiness = 10
      ```
   1. **SLES 12 SP 5 Only**: Pacemaker occasionally creates many processes, which can exhaust the allowed number. When this happens, a heartbeat between the cluster nodes might fail and lead to a failover of your resources. Increase the maximum number of allowed processes by setting the following parameter:
      ```bash
      # Edit the configuration file
      sudo vi /etc/systemd/system.conf
      [...]
      DefaultTasksMax=4096
      [...]
      
      # Activate this setting
      sudo systemctl daemon-reload
      
      # Test to ensure that the change was successful
      sudo systemctl --no-pager show | grep DefaultTasksMax
      ```
   
1. **[1]** Create the cluster.
   ```bash
   sudo crm cluster init --yes --name ascsnw1 --node sap-cl1 --node sap-cl2
   ```
1. **[1]** Configure cluster settings.
   ```bash
   sudo crm corosync set totem.token 30000
   sudo csync2 -xv
   sudo crm cluster run "corosync-cfgtool -R"
   ```
1. Configure a startup delay for Pacemaker.

   Starting Pacemaker immediately after boot can potentially let a node rejoin the cluster before failover completes, preventing failover or delaying recovery. To solve this problem use a timer service to delay pacemaker startup on reboot.
   1. **[A]** Configure timer service.
      ```bash
      sudo vi /etc/systemd/system/pacemaker.timer   
      ```
      ```pacemaker.timer
      [Unit]
      Description=Delay start of pacemaker.service after boot
      [Timer]
      OnBootSec=216
      Unit=pacemaker.service
      [Install]
      WantedBy=timers.target
      ```
   1. **[A]** Enable timer service.
      ```bash
      sudo systemctl daemon-reload
      sudo systemctl enable pacemaker.timer
      ```
   1. **[1]** Disable Pacemaker services.
      ```bash
      sudo crm cluster disable --all
      ```
1. Validate the cluster.
   1. **[1]** Validate Pacemaker cluster.
      ```bash
      sudo crm status
      
      Cluster Summary:
        * Stack: corosync (Pacemaker is running)
        * Current DC: sap-cl1 (version 2.1.7+20231219.0f7f88312-150600.6.15.1-2.1.7+20231219.0f7f88312) - partition with quorum
        * Last updated: Tue Aug  4 17:50:24 2026 on sap-cl1
        * Last change:  Thu Jul 30 19:02:56 2026 by hacluster via hacluster on sap-cl1
        * 2 nodes configured
        * 0 resource instances configured
      
      Node List:
        * Online: [ sap-cl1 sap-cl2 ]
      
      Full List of Resources:
      ```
   1. **[A]** Validate services.
      ```bash
      systemctl list-unit-files pacemaker.timer pacemaker.service corosync.service
      ```
      ```output
      UNIT FILE         STATE    PRESET
      corosync.service  disabled disabled
      pacemaker.service disabled disabled
      pacemaker.timer   enabled  disabled
      ```
## Configure fencing

:::zone pivot="sbd-shared-disk"

[!INCLUDE [pacemaker-sbd-shared-disk-cluster-common](../../../includes/sap/pacemaker-sbd-shared-disk-cluster-common.md)]

5. **[1]** Add the SBD device to the cluster.
   ```bash
   sudo crm cluster init --yes sbd -s /dev/disk/by-id/scsi-360022480055c9f501a24256ea0f87617
   ```
1. **[1]** Change SBD configuration settings.
   ```bash
   sudo crm configure property stonith-timeout=210
   sudo crm configure property stonith-enabled=true
   # For the below command, 600 is the interval, and 120 is the timeout
   sudo crm configure monitor stonith-sbd 600:120
   sudo crm configure set stonith-sbd.pcmk_delay_max 15
   ```
1. **[A]** Validate SBD config file.
   ```bash
   sudo vi /etc/sysconfig/sbd
   ```
   ```/etc/sysconfig/sbd
   [...]
   SBD_DELAY_START=no
   [...]
   SBD_PACEMAKER=yes
   [...]
   SBD_STARTMODE=always
   [...]
   ```
:::zone-end

:::zone pivot="sbd-iscsi"
[!INCLUDE [pacemaker-sbd-iscsi-cluster-common](../../../includes/sap/pacemaker-sbd-iscsi-cluster-common.md)]

9. **[1]** Add the SBD devices to the cluster.
   ```bash
   sudo crm cluster init --yes sbd \
      -s /dev/disk/by-id/scsi-3600140537cf4c6d604a4ae4b58f1a528 \
      -s /dev/disk/by-id/scsi-360014056e4d07b80e1148ac973330dff \
      -s /dev/disk/by-id/scsi-360014059f135275c24647d49268123e5
   ```
1. **[1]** Change SBD configuration settings.
   ```bash
   sudo crm configure property stonith-timeout=210
   sudo crm configure property stonith-enabled=true
   # For the below command, 600 is the interval, and 120 is the timeout
   sudo crm configure monitor stonith-sbd 600:120
   sudo crm configure set stonith-sbd.pcmk_delay_max 15
   ```
1. **[A]** Validate SBD config file.
   ```bash
   sudo vi /etc/sysconfig/sbd
   ```
   ```/etc/sysconfig/sbd
   [...]
   SBD_DELAY_START=no
   [...]
   SBD_PACEMAKER=yes
   [...]
   SBD_STARTMODE=always
   [...]
   ```
:::zone-end

:::zone pivot="azure-fence-agent"
1. **[1]** Configure Azure Fence Agent.
   > [!NOTE]
   > When using Azure government cloud, you must specify the `cloud=` option when configuring the Azure Fence Agent. For example, `cloud=usgov` for the Azure US government cloud.

   #### [Managed identity](#tab/msi)
   ```bash
   sudo crm configure primitive rsc_st_azure stonith:fence_azure_arm params msi=true \ 
      resourceGroup="<ResourceGroupName>" subscriptionId="<SubscriptionID>" \
      pcmk_host_map="sap-cl1:<AzureVMNameCL1>;sap-cl2:<AzureVMNameCL2>" \
      power_timeout=240 pcmk_reboot_timeout=900 pcmk_monitor_timeout=120 \
      pcmk_monitor_retries=4 pcmk_action_limit=3 pcmk_delay_max=15 \
      meta failure-timeout=120s op monitor interval=3600 timeout=120
   ```
   #### [Service principal](#tab/spn)
   ```bash
   sudo crm configure primitive rsc_st_azure stonith:fence_azure_arm params \
      login="<ClientID>" passwd="<ClientSecret>" tenantId="<TenantID>" \
      resourceGroup="<ResourceGroupName>" subscriptionId="<SubscriptionID>" \
      pcmk_host_map="sap-cl1:<AzureVMNameCL1>;sap-cl2:<AzureVMNameCL2>" \
      power_timeout=240 pcmk_reboot_timeout=900 pcmk_monitor_timeout=120 \
      pcmk_monitor_retries=4 pcmk_action_limit=3 pcmk_delay_max=15 \
      meta failure-timeout=120s op monitor interval=3600 timeout=120
   ```
1. **[1]** Configure the cluster for Azure Fence Agent.
   ```bash
   sudo crm configure property stonith-enabled=true
   sudo crm configure property stonith-timeout=900
   ```
:::zone-end

### Building a Pacemaker cluster with more than two nodes

If you're building a larger cluster, keep these considerations in mind:
1. **[1]** Adjust cluster configuration.

   The `quorum.two_node` and `quorum.expected_votes` values automatically update when you add a third or more nodes. Validate the `quorum.two_node` is `0` and `quorum.expected_votes` equals the number of nodes in your cluster.
   ```bash
   sudo crm corosync get quorum.two_node
   sudo crm corosync get quorum.expected_votes
   ```

1. Adjust fencing configuration.
   :::zone pivot="sbd-shared-disk,sbd-iscsi"
   ```bash
   sudo crm resource param stonith-sbd delete pcmk_delay_max
   sudo crm resource param stonith-sbd set pcmk_action_limit -1
   ```
   :::zone-end
   :::zone pivot="azure-fence-agent"
   ```bash
   sudo crm resource param rsc_st_azure delete pcmk_delay_max
   sudo crm resource param rsc_st_azure pcmk_action_limit -1
   ```
   :::zone-end


## Configure Pacemaker for Azure scheduled events

[!INCLUDE [sap-pacemaker-scheduled-events-overview](../../../includes/sap/pacemaker-scheduled-events-overview.md)]

1. **SLES 12 SP5 Only** Check your version of the `resource-agents` package and update if required.  SLES 15 and higher include it by default in their installed versions.

   ```bash
   zypper info resource-agents
   ```
   The minimum version is `resource-agents-4.3.018.a7fb5035-3.98.1`.

1. **[1]** Place the cluster in maintenance mode.
   ```bash
   sudo crm configure property maintenance-mode=true
   ```
1. **[1]** Set the pacemaker cluster health node strategy and constraint.
   > [!IMPORTANT]
   > Don't define any other resources in the cluster starting with `health-`, besides the resources described in the next steps.

   ```bash
   sudo crm configure property node-health-strategy=custom
   sudo crm configure location loc_azure_health \
      /'!health-.*'/ rule '#health-azure': defined '#uname'
   ```

1. **[1]** Set initial value of the cluster attributes.
   
   Run a command for each cluster node. For scale-out environments include the majority maker VM.

   ```bash
   # Node 1
   sudo crm_attribute --node sap-cl1 --name '#health-azure' --update 0
   # Node 2
   sudo crm_attribute --node sap-cl2 --name '#health-azure' --update 0
   # Node N
   sudo crm_attribute --node sap-clN --name '#health-azure' --update 0
   ```

1. **[1]** Configure the resources in Pacemaker. The resources must start with `health-azure`.

   ```bash
   sudo crm configure primitive health-azure-events ocf:heartbeat:azure-events-az \
      meta failure-timeout=120s \
      op start start-delay=60s \
      op monitor interval=10s
   
   sudo crm configure clone health-azure-events-cln health-azure-events \
      meta allow-unhealthy-nodes=true
   ```

   > [!NOTE]
   > When you configure the `health-azure-events` resource, you can ignore the following warning message.
   >
   > WARNING: health-azure-events: unknown attribute 'allow-unhealthy-nodes'.

1. Take the Pacemaker cluster out of maintenance mode and clear any errors.

   ```bash
   sudo crm configure property maintenance-mode=false
   sudo crm resource cleanup
   ```

1. Verify that `health-azure-events` starts successfully on all nodes.

   ```bash
   crm status
   
   Cluster Summary:
     * Stack: corosync (Pacemaker is running)
     * Current DC: sap-cl1 (version 3.0.0+20250218.64cd85422c-160000.4.1-3.0.0+20250218.64cd85422c) - partition with quorum
     * Last updated: Thu Jul 30 19:07:49 2026 on sap-cl1
     * Last change:  Thu Jul 30 19:06:01 2026 by root via root on sap-cl1
     * 2 nodes configured
     * 3 resource instances configured
   
   Node List:
     * Online: [ z04ascs3 z04ascs4 ]
   
   Full List of Resources:
     * stonith-sbd (stonith:fence_sbd):     Started sap-cl1
     * Clone Set: health-azure-events-cln [health-azure-events]:
       * Started: [ sap-cl1 sap-cl2 ]
   ```

   The first time query execution for scheduled events [can take up to 2 minutes][azdoc-vm-linux-scheduled-events-enable]. Pacemaker testing with scheduled events can use reboot or redeploy actions for the cluster VMs. For more information, see [scheduled events][azdoc-vm-linux-scheduled-events].

   > [!NOTE]
   > After you configure the Pacemaker resources for the azure-events agent, if you place the cluster in or out of maintenance mode, you might get warning messages such as:
   >
   > WARNING: cib-bootstrap-options: unknown attribute 'hostName_**hostname**'  
   > WARNING: cib-bootstrap-options: unknown attribute 'azure-events_globalPullState'  
   > WARNING: cib-bootstrap-options: unknown attribute 'hostName_ **hostname**'  
   > You can ignore these warning messages.

## Next steps

- [Azure Virtual Machines planning and implementation for SAP][azdoc-sap-planning-guide].
- [Azure Virtual Machines deployment for SAP][azdoc-sap-deployment-guide].
- [Azure Virtual Machines DBMS deployment for SAP][azdoc-sap-dbms-guide].
- [High availability for NFS Simple Mount on Azure VMs on SUSE Linux Enterprise Server][azdoc-sap-sles-ha-simplemount].
- To learn how to establish high availability and plan for disaster recovery of SAP HANA on Azure VMs, see [High availability of SAP HANA on Azure Virtual Machines][azdoc-sap-hana-ha].


[susedoc-ha-watchdog]: https://documentation.suse.com/sle-ha/15-SP7/html/SLE-HA-all/cha-ha-storage-protect.html#sec-ha-storage-protect-sw-watchdog
[susedoc-ha-admin-guide]: https://documentation.suse.com/sle-ha/15-SP6/html/SLE-HA-all/book-administration.html
[susedoc-ha-sles16-hub]: https://documentation.suse.com/sle-ha/16.0/
[susedoc-ha-azure]: https://documentation.suse.com/sbp/sap-15/html/SBP-SAP-HANA-PerOpt-HA-Azure/index.html
[susedoc-ha-sap]: https://documentation.suse.com/en-us/sles-sap/sap-ha-support/html/sap-ha-support/index.html
[susedoc-kb17857-writeperf-nfs]: https://support.scc.suse.com/s/kb/Low-write-performance-on-SLES-servers-with-remote-storage-1583239384308?language=en_US




[azdoc-sap-planning-guide]: /azure/sap/workloads/planning-guide
[azdoc-sap-deployment-guide]: /azure/sap/workloads/deployment-guide
[azdoc-sap-dbms-guide]: /azure/sap/workloads/dbms-guide-general
[azdoc-sap-hana-ha]:/azure/sap/workloads/sap-hana-high-availability
[azdoc-sap-sles-ha-simplemount]: /azure/sap/workloads/high-availability-guide-suse-nfs-simple-mount


[azdoc-vm-linux-scheduled-events-enable]: /azure/virtual-machines/linux/scheduled-events#enabling-and-disabling-scheduled-events
[azdoc-vm-linux-scheduled-events]: /azure/virtual-machines/linux/scheduled-events

