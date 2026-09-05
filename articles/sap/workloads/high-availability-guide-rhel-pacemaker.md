---
title: Set up Pacemaker on RHEL in Azure | Microsoft Docs
description: Learn how to set up Pacemaker on Red Hat Enterprise Linux (RHEL) in Azure.
services: virtual-machines-windows,virtual-network,storage
author: rdeltcheva
manager: juergent
ms.service: sap-on-azure
ms.topic: article
ms.tgt_pltfrm: vm-linux
ms.date: 08/01/2026
ms.author: radeltch
ms.custom:
  - linux-related-content
  - sfi-image-nochange
  - sfi-ropc-nochange
# Customer intent: "As a system administrator managing RHEL clusters on Azure, I want to configure a high availability cluster using Pacemaker, so that I can ensure redundancy and fault tolerance for my applications."
zone_pivot_groups: sap-pacemaker-fencing-solution
---

# Set up Pacemaker on Red Hat Enterprise Linux in Azure

This article explains how to set up and configure a basic two node Pacemaker cluster on Red Hat Enterprise Linux (RHEL). The instructions cover `RHEL 8.6+`, `RHEL 9.x`, and `RHEL 10.x`.

## Prerequisites

* RHEL High Availability (HA) documentation
  * [Configuring and managing high availability clusters][rheldoc-ha-guide].
  * [Support Policies for RHEL High-Availability Clusters - sbd and fence_sbd][rheldoc-ha-support-sbd-fence_sbd].
  * [Support Policies for RHEL High Availability clusters - fence_azure_arm][rheldoc-ha-support-fence_azure_arm].
  * [Software-Emulated Watchdog Known Limitations][rheldoc-ha-softdog-limitations].
  * [Exploring RHEL High Availability's Components - sbd and fence_sbd][rheldoc-ha-sbd-fence_sbd].
  * [Design Guidance for RHEL High Availability Clusters - sbd Considerations][rheldoc-ha-sbd-considerations].
  * [Considerations in adopting RHEL 8 - High Availability and Clusters][rheldoc-ha-rhel8-considerations]

* Azure-specific RHEL documentation
  * [Support Policies for RHEL High-Availability Clusters - Microsoft Azure Virtual Machines as Cluster Members][rheldoc-ha-support-azure].
  * [Design Guidance for RHEL High Availability Clusters - Microsoft Azure Virtual Machines as Cluster Members][rheldoc-ha-design-azure].

* RHEL documentation for SAP offerings
  * [Support Policies for RHEL High Availability Clusters - Management of SAP S/4HANA in a cluster][rheldoc-sap-ha-support].

## Overview

[!INCLUDE [pacemaker-overview](../../../includes/sap/pacemaker-overview.md)]

<!--- Fencing Option Overview --->
:::zone pivot="sbd-shared-disk,sbd-iscsi"
> [!IMPORTANT]
> In Azure, RHEL high availability clusters with storage based fencing (fence_sbd) use a software-emulated watchdog. Review the following documentation when using SBD.
> * [Software-Emulated Watchdog Known Limitations][rheldoc-ha-softdog-limitations]
> * [Support Policies for RHEL High Availability Clusters - sbd and fence_sbd][rheldoc-ha-support-sbd-fence_sbd]
:::zone-end

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

1. Deploy three virtual machines that run on a supported RHEL OS version. The VMs don't need to be large. VM sizes such as Standard_E2s or Standard_D2s are sufficient.
   > [!NOTE]
   > You don't need to use RHEL for SAP with HA and Update Services, or RHEL for SAP Apps OS image for the iSCSI target server. You can use a standard RHEL OS image instead. However, the support life cycle varies between different OS product releases.

1. Install the latest updates, and reboot if required.
   ```bash
   sudo dnf -y update
   ```
1. Install the iSCSI target package.
   ```bash
   sudo dnf install -y targetcli
   ```
1. Enable and start the iSCSI service.
   ```bash
   sudo systemctl start target
   sudo systemctl enable target
   ```
1. Open the port in the firewall.
   ```bash
   sudo firewall-cmd --add-port=3260/tcp --permanent
   sudo firewall-cmd --reload
   ```   

[!INCLUDE [sap-pacemaker-sbd-iscsi-deploy-create-targets](../../../includes/sap/pacemaker-sbd-iscsi-deploy-create-targets.md)]


:::zone-end

:::zone pivot="azure-fence-agent"
[!INCLUDE [sap-pacemaker-fence-agent-deploy](../../../includes/sap/pacemaker-fence-agent-deploy.md)]
:::zone-end

## Create and configure cluster
1. **[A]** Update the OS and reboot if required.
   ```bash
   sudo dnf -y update
   ```
1. **[A]** Install required cluster packages.
   #### [RHEL 10 / RHEL 9](#tab/rhel10+rhel9)
   ```bash
   sudo dnf install -y nmap-ncat pcs pacemaker resource-agents resource-agents-cloud
   ```
   #### [RHEL 8](#tab/rhel8)
   ```bash
   sudo dnf install -y nmap-ncat pcs pacemaker resource-agents
   ```
   
1. **[A]** Install required fencing packages.
   :::zone pivot="sbd-shared-disk"
   ```bash
   sudo dnf install -y sbd fence-agents-sbd
   ```
   :::zone-end
   
   :::zone pivot="sbd-iscsi"
   ```bash
   sudo dnf install -y sbd fence-agents-sbd iscsi-initiator-utils
   ```
   :::zone-end
   
   :::zone pivot="azure-fence-agent"
   ```bash
   sudo dnf install -y fence-agents-azure-arm
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
1. **[A]** Update the `hacluster` password to be the same on all nodes.
   ```bash
   sudo passwd hacluster
   ```
1. **[A]** Update the firewall.
   ```bash  
   sudo firewall-cmd --add-service=high-availability --permanent
   sudo firewall-cmd --reload
   ```
1. **[A]** Enable Pacemaker services.
   ```bash
   sudo systemctl start pcsd.service
   sudo systemctl enable pcsd.service
   ```
1. **[1]** Create the cluster.
   ```bash
   sudo pcs host auth sap-cl1 sap-cl2 -u hacluster
   sudo pcs cluster setup ascsnw1 sap-cl1 sap-cl2 totem token=30000
   sudo pcs cluster start --all
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
      OnBootSec=186
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
      sudo pcs cluster disable --all
      ```
1. Validate the cluster.
   1. **[1]** Validate Pacemaker cluster.
      ```bash
      sudo pcs status

      Cluster name: ascsnw1
      Cluster Summary:
        * Stack: corosync (Pacemaker is running)
        * Current DC: sap-cl1 (version 3.0.0-5.1.el10_0-8818a21) - partition with quorum
        * Last updated: Tue May 19 22:15:08 2026 on sap-cl1
        * Last change:  Tue Apr 21 23:11:34 2026 by root via root on sap-cl1
        * 2 nodes configured
        * 0 resource instances configured
      
      Node List:
        * Online: [ sap-cl1 sap-cl2 ]
      
      Full List of Resources:
      
      Daemon Status:
        corosync: active/disabled
        pacemaker: active/disabled
        pcsd: active/enabled
      ```
   1. **[A]** Validate services.
      ```bash
      systemctl list-unit-files pacemaker.timer pacemaker.service corosync.service pcsd.service
      ```
      ```output
      UNIT FILE         STATE    PRESET
      corosync.service  disabled disabled
      pacemaker.service disabled disabled
      pacemaker.timer   enabled  disabled
      pcsd.service      enabled  disabled
      ```
## Configure fencing

:::zone pivot="sbd-shared-disk"

[!INCLUDE [pacemaker-sbd-shared-disk-cluster-common](../../../includes/sap/pacemaker-sbd-shared-disk-cluster-common.md)]

5. **[1]** Add the SBD device to the cluster.
   ```bash
   sudo pcs stonith create sbd fence_sbd devices=/dev/disk/by-id/scsi-360022480055c9f501a24256ea0f87617 op monitor interval=600 timeout=15
   ```
1. **[1]** Change SBD configuration settings.
   ```bash
   sudo pcs property set stonith-timeout=210
   sudo pcs property set stonith-enabled=true
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
   sudo pcs stonith create sbd fence_sbd \
      devices=/dev/disk/by-id/scsi-3600140537cf4c6d604a4ae4b58f1a528,/dev/disk/by-id/scsi-360014056e4d07b80e1148ac973330dff,/dev/disk/by-id/scsi-360014059f135275c24647d49268123e5 \
      op monitor interval=600 timeout=120
   ```
1. **[1]** Change SBD configuration settings.
   ```bash
   sudo pcs property set stonith-timeout=210
   sudo pcs property set stonith-enabled=true
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
   sudo pcs stonith create rsc_st_azure fence_azure_arm msi=true \
      resourceGroup="<ResourceGroupName>" subscriptionId="<SubscriptionID>" \
      pcmk_host_map="sap-cl1:<AzureVMNameCL1>;sap-cl2:<AzureVMNameCL2>" \
      power_timeout=240 pcmk_reboot_timeout=900 pcmk_monitor_timeout=120 \
      pcmk_monitor_retries=4 pcmk_action_limit=3 pcmk_delay_max=15 \
      meta failure-timeout=120s op monitor interval=3600 timeout=120
   ```
   #### [Service principal](#tab/spn)
   ```bash
   sudo pcs stonith create rsc_st_azure fence_azure_arm \
      username="<ClientID>" password="<ClientSecret>" tenantId="<TenantID>" \
      resourceGroup="<ResourceGroupName>" subscriptionId="<SubscriptionID>" \
      pcmk_host_map="sap-cl1:<AzureVMNameCL1>;sap-cl2:<AzureVMNameCL2>" \
      power_timeout=240 pcmk_reboot_timeout=900 pcmk_monitor_timeout=120 \
      pcmk_monitor_retries=4 pcmk_action_limit=3 pcmk_delay_max=15 \
      meta failure-timeout=120s op monitor interval=3600 timeout=120
   ```
1. **[1]** Configure the cluster for Azure Fence Agent.
   ```bash
   sudo pcs property set stonith-enabled=true
   sudo pcs property set stonith-timeout=900
   ```
:::zone-end

### Building a Pacemaker cluster with more than two nodes

If you're building a larger cluster, keep these considerations in mind:
1. **[1]** Adjust cluster configuration.

   The `Votequorum - Expected votes` and `Votequorum - Flags - 2Node` values automatically update when you add a third or more nodes. Validate the `2Node` flag is absent and `Votequorum - Expected votes` equals the number of nodes in your cluster.
   ```bash
   sudo pcs quorum status
   
   Quorum information
   ------------------
   [...]
   
   Votequorum information
   ----------------------
   Expected votes:   3
   Highest expected: 3
   Total votes:      3
   Quorum:           2
   Flags:            Quorate WaitForAll
   
   Membership information
   ----------------------
   [...]
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

1. Install and update the `resource-agents` package.
   ```bash
   sudo dnf install -y resource-agents
   ```

1. **[1]** Place the cluster in maintenance mode.
   ```bash
   sudo pcs property set maintenance-mode=true
   ```
1. **[1]** Set the Pacemaker cluster health node strategy and constraint.
   > [!IMPORTANT]
   > Don't define any other resources in the cluster starting with `health-` besides the resources described in the next steps.

   #### [RHEL 10](#tab/rhel10)
   ```bash
   sudo pcs property set node-health-strategy=custom
   sudo pcs constraint location 'regexp%!health-.*' \
      rule score-attribute='#health-azure' \
      "defined #uname"
   ```
   #### [RHEL 9 / RHEL 8](#tab/rhel9+rhel8)
   ```bash
   sudo pcs property set node-health-strategy=custom
   sudo pcs constraint location 'regexp%!health-.*' \
      rule score-attribute='#health-azure' \
      defined '#uname'
   ```
1. **[1]** Set the initial value of the cluster attributes. 

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
   sudo pcs resource create health-azure-events \
      ocf:heartbeat:azure-events-az \
      meta failure-timeout=120s \
      op monitor interval=10s timeout=240s \
      op start timeout=10s start-delay=90s
   ```
   #### [RHEL 10](#tab/rhel10)
   ```bash
   sudo pcs resource clone health-azure-events meta allow-unhealthy-nodes=true
   ```
   #### [RHEL 9 / RHEL 8](#tab/rhel9+rhel8)
   ```bash
   sudo pcs resource clone health-azure-events allow-unhealthy-nodes=true
   ```

1. Take the Pacemaker cluster out of maintenance mode and clear any errors

   ```bash
   sudo pcs property set maintenance-mode=false
   sudo pcs resource cleanup
   ```

1. Verify that `health-azure-events` starts successfully on all nodes.
   ```bash
   sudo pcs status

      Cluster name: ascsnw1
      Cluster Summary:
        * Stack: corosync (Pacemaker is running)
        * Current DC: sap-cl1 (version 3.0.0-5.1.el10_0-8818a21) - partition with quorum
        * Last updated: Tue May 19 22:15:08 2026 on sap-cl1
        * Last change:  Tue Apr 21 23:11:34 2026 by root via root on sap-cl1
        * 2 nodes configured
        * 3 resource instances configured
      
      Node List:
        * Online: [ sap-cl1 sap-cl2 ]
      
      Full List of Resources:
        * sbd (stonith:fence_sbd):     Started sap-cl1
        * Clone Set: health-azure-events-clone [health-azure-events]:
          * Started: [ sap-cl1 sap-cl2 ]

      Daemon Status:
        corosync: active/disabled
        pacemaker: active/disabled
        pcsd: active/enabled
        sbd: active/enabled
   ```

   First-time query execution for scheduled events [can take up to two minutes][azdoc-vm-linux-scheduled-events-enable]. Pacemaker testing with scheduled events can use reboot or redeploy actions for the cluster VMs. For more information, see [Scheduled events][azdoc-vm-linux-scheduled-events].

## Optional fencing configuration  

> [!TIP]
> This section is only applicable if you want to configure the special fencing device `fence_kdump`.  

If you need to collect diagnostic information within the VM, it might be useful to configure another fencing device based on the fence agent `fence_kdump`. The `fence_kdump` agent can detect that a node entered kdump crash recovery and can allow the crash recovery service to complete before other fencing methods are invoked. Note that `fence_kdump` isn't a replacement for traditional fence mechanisms, like the SBD or Azure fence agent, when you're using Azure VMs.

> [!IMPORTANT]
> Be aware that when `fence_kdump` is configured as a first-level fencing device, it introduces delays in the fencing operations and, respectively, delays in the application resources failover.
>
> If a crash dump is successfully detected, the fencing is delayed until the crash recovery service completes. If the failed node is unreachable or if it doesn't respond, the fencing is delayed by time determined, the configured number of iterations, and the `fence_kdump` timeout.
>
> The proposed `fence_kdump` timeout might need to be adapted to the specific environment.
>
> We recommend that you configure `fence_kdump` fencing only when necessary to collect diagnostics within the VM and always in combination with traditional fence methods, such as SBD or Azure fence agent.

The following Red Hat KB articles contain important information about configuring `fence_kdump` fencing:

* See [How do I configure fence_kdump in a Red Hat Pacemaker cluster?][rheldoc-ha-fence_kdump]
* See [How to configure/manage fencing levels in an RHEL cluster with Pacemaker][rheldoc-ha-fencing-levels].
* For information on how to change the default timeout, see [How do I configure kdump for use with the RHEL 6, 7, 8 HA Add-On?][rheldoc-ha-fence_kdump-timeout]
* For information on how to reduce failover delay when you use `fence_kdump`, see [Can I reduce the expected delay of failover when adding fence_kdump configuration?][rheldoc-ha-fence_kdump-reduce-delay]
  

Run the following optional steps to add `fence_kdump` as a first-level fencing configuration, in addition to the Azure fence agent configuration.

1. **[A]** Verify that `kdump` is active and configured.

    ```bash
    systemctl is-active kdump
    # Expected result
    # active
    ```

1. **[A]** Install the `fence_kdump` fence agent.
   ```bash
   sudo dnf install -y fence-agents-kdump
   ```

1. **[1]** Create a `fence_kdump` fencing device in the cluster.

    ```bash
    pcs stonith create rsc_st_kdump fence_kdump pcmk_reboot_action="off" pcmk_host_list="sap-cl1 sap-cl2" timeout=30
    ```

1. **[1]** Configure fencing levels so that the `fence_kdump` fencing mechanism is engaged first.  

    ```bash
    pcs stonith create rsc_st_kdump fence_kdump pcmk_reboot_action="off" pcmk_host_list="sap-cl1 sap-cl2"
    pcs stonith level add 1 sap-cl1 rsc_st_kdump
    pcs stonith level add 1 sap-cl2 rsc_st_kdump
    # Replace <stonith-resource-name> to the resource name of the STONITH resource configured in your pacemaker cluster (example based on above configuration - sbd or rsc_st_azure)
    pcs stonith level add 2 sap-cl1 <stonith-resource-name>
    pcs stonith level add 2 sap-cl2 <stonith-resource-name>
    
    # Check the fencing level configuration 
    pcs stonith level
    # Example output
    # Target: sap-cl1
    # Level 1 - rsc_st_kdump
    # Level 2 - <stonith-resource-name>
    # Target: sap-cl2
    # Level 1 - rsc_st_kdump
    # Level 2 - <stonith-resource-name>
    ```

1. **[A]** Allow the required ports for `fence_kdump` through the firewall.

   ```bash
   firewall-cmd --add-port=7410/udp --permanent
   firewall-cmd --reload
   ```

1. **[A]** Perform the `fence_kdump_nodes` configuration in `/etc/kdump.conf` to avoid  `fence_kdump` from failing with a timeout for some `kexec-tools` versions. For more information, see [fence_kdump times out when fence_kdump_nodes isn't specified with kexec-tools version 2.0.15 or later][rheldoc-ha-fence_kdump-timeout-kexec]. The example configuration for a two-node cluster is presented here. After you make a change in `/etc/kdump.conf`, the kdump image must be regenerated. To regenerate, restart the `kdump` service.  

    ```bash
    vi /etc/kdump.conf
    # On node prod-cl1-0 make sure the following line is added
    fence_kdump_nodes  prod-cl1-1
    # On node prod-cl1-1 make sure the following line is added
    fence_kdump_nodes  prod-cl1-0
    
    # Restart the service on each node
    systemctl restart kdump
    ```

1. **[A]** Ensure that the `initramfs` image file contains the `fence_kdump` and `hosts` files.

    ```bash
    lsinitrd /boot/initramfs-$(uname -r)kdump.img | egrep "fence|hosts"
    # Example output 
    # -rw-r--r--   1 root     root          208 Jun  7 21:42 etc/hosts
    # -rwxr-xr-x   1 root     root        15560 Jun 17 14:59 usr/libexec/fence_kdump_send
    ```

1. Test the configuration by crashing a node. 

    > [!IMPORTANT]
    > If the cluster is already in productive use, plan the test accordingly because crashing a node has an impact on the application.

    ```bash
    echo c > /proc/sysrq-trigger
    ```

## Next steps

- [Azure Virtual Machines planning and implementation for SAP][azdoc-sap-planning-guide].
- [Azure Virtual Machines deployment for SAP][azdoc-sap-deployment-guide].
- [Azure Virtual Machines DBMS deployment for SAP][azdoc-sap-dbms-guide].
- [High availability for NFS Simple Mount on Azure VMs on Red Hat Enterprise Linux][azdoc-sap-rhel-ha-simplemount].
- To learn how to establish high availability and plan for disaster recovery of SAP HANA on Azure VMs, see [High availability of SAP HANA on Azure Virtual Machines][azdoc-sap-hana-ha].



[rheldoc-ha-guide]: https://docs.redhat.com/en/documentation/red_hat_enterprise_linux/8/html/configuring_and_managing_high_availability_clusters/index
[rheldoc-ha-support-sbd-fence_sbd]: https://access.redhat.com/articles/2800691
[rheldoc-ha-support-fence_azure_arm]: https://access.redhat.com/articles/6627541
[rheldoc-ha-softdog-limitations]: https://access.redhat.com/articles/7034141
[rheldoc-ha-sbd-fence_sbd]: https://access.redhat.com/articles/2943361
[rheldoc-ha-sbd-considerations]: https://access.redhat.com/articles/2941601
[rheldoc-ha-rhel8-considerations]: https://access.redhat.com/documentation/en-us/red_hat_enterprise_linux/8/html/considerations_in_adopting_rhel_8/high-availability-and-clusters_considerations-in-adopting-rhel-8
[rheldoc-ha-support-azure]: https://access.redhat.com/articles/3131341
[rheldoc-ha-design-azure]: https://access.redhat.com/articles/3402391
[rheldoc-sap-ha-support]: https://access.redhat.com/articles/4016901
[rheldoc-ha-fence_kdump]: https://access.redhat.com/solutions/2876971
[rheldoc-ha-fencing-levels]: https://access.redhat.com/solutions/891323
[rheldoc-ha-fence_kdump-timeout]: https://access.redhat.com/articles/67570
[rheldoc-ha-fence_kdump-reduce-delay]: https://access.redhat.com/solutions/5512331
[rheldoc-ha-fence_kdump-timeout-kexec]: https://access.redhat.com/solutions/4498151

[azdoc-sap-planning-guide]: /azure/sap/workloads/planning-guide
[azdoc-sap-deployment-guide]: /azure/sap/workloads/deployment-guide
[azdoc-sap-dbms-guide]: /azure/sap/workloads/dbms-guide-general
[azdoc-sap-hana-ha]:/azure/sap/workloads/sap-hana-high-availability
[azdoc-sap-rhel-ha-simplemount]: /azure/sap/workloads/high-availability-guide-rhel-nfs-simple-mount

[azdoc-vm-linux-scheduled-events-enable]: /azure/virtual-machines/linux/scheduled-events#enabling-and-disabling-scheduled-events
[azdoc-vm-linux-scheduled-events]: /azure/virtual-machines/linux/scheduled-events
