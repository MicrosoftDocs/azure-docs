---
title: Add HSR third site to HANA Pacemaker cluster
description: Learn how to extend a highly available SAP HANA solution with a third site for disaster recovery.
author: msftrobiro
ms.author: robiro
ms.service: sap-on-azure
ms.subservice: sap-vm-workloads
ms.topic: how-to
ms.date: 01/16/2024
ms.custom: template-how-to-pattern
---

# Add an HSR third site to a HANA Pacemaker cluster

This article describes requirements and setup of a third HANA replication site to complement an existing Pacemaker cluster. Both SUSE Linux Enterprise Server (SLES) and RedHat Enterprise Linux (RHEL) specifics are covered.

## Overview

SAP HANA supports system replication (HSR) with more than two sites connected. You can add a third site to an existing HSR pair, managed by Pacemaker in a highly available setup. You can deploy the third site in a second Azure region for disaster recovery (DR) purposes.

Pacemaker and the HANA cluster resource agent manage the first two sites. The Pacemaker cluster doesn't control the third site.

SAP HANA supports a third system replication site in two modes:

- [Multitarget](https://help.sap.com/docs/SAP_HANA_PLATFORM/6b94445c94ae495c83a19646e7c3fd56/ba457510958241889a459e606bbcf3d3.html) replicates data changes from primary to more than one target system. The third site is connected to primary replication in a star topology.
- [Multitier](https://help.sap.com/docs/SAP_HANA_PLATFORM/6b94445c94ae495c83a19646e7c3fd56/f730f308fede4040bcb5ccea6751e74d.html) is a two-tier replication. A cascading, or chained, setup of three different HANA tiers. The third site connects to the secondary.

For more conceptual details about HANA HSR within one region and across different regions, see [SAP HANA availability across Azure regions](./sap-hana-availability-across-regions.md#combine-availability-within-one-region-and-across-regions).

## Prerequisites for SLES

Requirements for a third HSR site are different for HANA scale-up and HANA scale-out.

> [!NOTE]
> Requirements in this article are only valid for a Pacemaker-enabled landscape. Without Pacemaker, SAP HANA version requirements apply to the chosen replication mode.
> Pacemaker and the HANA cluster resource agent manage only two sites. The third HSR site isn't controlled by the Pacemaker cluster.

- **Both scale-up and scale-out**: SAP HANA SPS 04 or newer is required to use multitarget HSR with a Pacemaker cluster.
- **Both scale-up and scale-out**: Maximum of one SAP HANA system replication connected from outside the Linux cluster.
- **HANA scale-out only**: SLES 15 SP1 or higher.
- **HANA scale-out only**: Operating system (OS) package SAPHanaSR-ScaleOut version 0.180 or higher.
- **HANA scale-out only**: SAP HANA high-availability (HA) hook [SAPHanaSrMultiTarget](./sap-hana-high-availability-scale-out-hsr-suse.md#implement-hana-ha-hooks-saphanasrmultitarget-and-suschksrv) in use. Preview HANA HA hook `SAPHanaSR` isn't multitarget aware for scale-out.

## Prerequisites for RHEL

Requirements for a third HSR site are different for HANA scale-up and HANA scale-out.

> [!NOTE]
> Requirements in this article are only valid for a Pacemaker-enabled landscape. Without Pacemaker, SAP HANA version requirements apply for the chosen replication mode.
> Pacemaker and the HANA cluster resource agent manage only two sites. The third HSR site isn't controlled by the Pacemaker cluster.

- **HANA scale-up only**: See RedHat [support policies for RHEL HA clusters](https://access.redhat.com/articles/3397471) for details on the minimum OS, SAP HANA, and cluster resource agents version.
- **HANA scale-out only**: HANA multitarget replication isn't supported on Azure with a Pacemaker cluster.

## HANA scale-up: Add HANA multitarget system replication for DR purposes

With SAP HANA HA hook SAPHanaSR for [SLES](./sap-hana-high-availability.md#implement-hana-hooks-saphanasr-and-suschksrv) and [RHEL](./sap-hana-high-availability-rhel.md#implement-the-python-system-replication-hook-saphanasr), you can add a third node for DR purposes. The Pacemaker environment is aware of a HANA multitarget DR setup.

Failure of the third node won't trigger any cluster action. The cluster detects the replication status of connected sites and the monitored attribute for the third site can change between `SOK` and `SFAIL` states. Any takeover tests to the third/DR site or executing your DR exercise process should first place the cluster resources into maintenance mode to prevent any undesired cluster action.

The following example shows a multitarget system replication system. For more information, see [SAP documentation](https://help.sap.com/docs/SAP_HANA_PLATFORM/4e9b18c116aa42fc84c7dbfd02111aba/2e6c71ab55f147e19b832565311a8e4e.html).
![Diagram that shows an example of a HANA scale-up multitarget system replication system.](./media/sap-hana-high-availability/sap-hana-high-availability-scale-up-hsr-multi-target.png)

1. Deploy Azure resources for the third node. Depending on your requirements, you can use a different Azure region for DR purposes.

   Steps required for the third site are similar to [virtual machines (VMs) for HANA scale-up cluster](./sap-hana-high-availability.md#prepare-the-infrastructure). The third site uses Azure infrastructure. The OS and HANA version match the existing Pacemaker cluster, with the following exceptions:

   - No load balancer is deployed for the third site. There's no integration with the existing cluster load balancer for the VM of the third site.
   - Don't install OS packages SAPHanaSR, SAPHanaSR-doc, and the OS package pattern ha_sles on the third site VM.
   - No integration into the cluster for VM or HANA resources of the third site.
   - No HANA HA hook setup for the third site in *global.ini*.

1. Install SAP HANA on the third node.
  
   The same HANA SID and HANA installation number must be used for the third site.

1. With SAP HANA on the third site installed and running, register the third site with the primary site.

   The following example uses `SITE-DR` as the name for the third site.

    ```bash
    # Execute on the third site 
    su - hn1adm
    # Register the HANA third site to the primary. Switch --online will shutdown the HANA instance on third site.
    hdbnsutil -sr_register --name=SITE-DR --remoteHost=hn1-db-0 --remoteInstance=03 --replicationMode=async --online
    ```

1. Verify that the HANA system replication shows the secondary site and the third site.

    ```bash
    # Verify HANA HSR is in sync, execute on primary
    sudo su - hn1adm -c "python /usr/sap/HN1/HDB03/exe/python_support/systemReplicationStatus.py"
    ```

1. Check the `SAPHanaSR` attribute for the third site. `SITE-DR` should show up with the status `SOK` in the `Sites` section.

    ```bash
    # Check SAPHanaSR attribute on any cluster managed host (first or second site)
    sudo SAPHanaSR-showAttr
    # Example result
    # Global cib-time                 maintenance
    # --------------------------------------------
    # global Tue Feb 21 19:28:21 2023 false
    # 
    # Sites     srHook
    # -----------------
    # HN1-SITE1 PRIM
    # HN1-SITE2 SOK
    # SITE-DR   SOK
    ```

   The cluster detects the replication status of connected sites. The monitored attributes can change between `SOK` and `SFAIL`. There's no cluster action if the replication to the DR site fails.

## HANA scale-out: Add HANA multitarget system replication for DR purposes

With the SAP HANA HA provider [SAPHanaSrMultiTarget](./sap-hana-high-availability-scale-out-hsr-suse.md#implement-hana-ha-hooks-saphanasrmultitarget-and-suschksrv), you can add a third HANA scale-out site. This third site is often used for DR in another Azure region. The Pacemaker environment is aware of a HANA multitarget DR setup. This section applies to systems running Pacemaker on SUSE only. See the "Prerequisites" section in this document for details.

Failure of the third node won't trigger any cluster action. The cluster detects the replication status of connected sites and the monitored attribute for the third site can change between the `SOK` and `SFAIL` states. Any takeover tests to the third/DR site or executing your DR exercise process should first place the cluster resources into maintenance mode to prevent any undesired cluster action.

The following example shows a multitarget system replication system. For more information, see [SAP documentation](https://help.sap.com/docs/SAP_HANA_PLATFORM/4e9b18c116aa42fc84c7dbfd02111aba/2e6c71ab55f147e19b832565311a8e4e.html).
![Diagram that shows an example of a HANA scale-out multitarget system replication system.](./media/sap-hana-high-availability/sap-hana-high-availability-scale-out-hsr-multi-target.png)

1. Deploy Azure resources for the third site. Depending on your requirements, you can use a different Azure region for DR purposes.

   Steps required for the HANA scale-out on the third site mirror the steps to deploy the [HANA scale-out cluster](./sap-hana-high-availability-scale-out-hsr-suse.md#prepare-the-infrastructure). The third site uses Azure infrastructure, OS, and HANA installation steps for `SITE1` of the scale-out cluster, with the following exceptions:

   - No load balancer is deployed for the third site. There's no integration with the existing cluster load balancer for the VMs of the third site.
   - Don't install the OS packages SAPHanaSR-ScaleOut, SAPHanaSR-ScaleOut-doc, and the OS package pattern ha_sles on the third site VMs.
   - No majority maker VM for the third site because there's no cluster integration.
   - Create the NFS volume /hana/shared for the third site's exclusive use.
   - No integration into the cluster for the VMs or HANA resources of the third site.
   - No HANA HA hook setup for the third site in *global.ini*.

   You must use the same HANA SID and HANA installation number for the third site.

1. With SAP HANA scale-out on the third site installed and running, register the third site with the primary site.

   The following example uses `SITE-DR` as the name for the third site.

    ```bash
    # Execute on the third site 
    su - hn1adm
    # Register the HANA third site to the primary. Switch --online will shutdown the HANA instance on third site.
    hdbnsutil -sr_register --name=SITE-DR --remoteHost=hana-s1-db1 --remoteInstance=03 --replicationMode=async --online
    ```

1. Verify that the HANA system replication shows the secondary site and the third site.

    ```bash
    # Verify HANA HSR is in sync, execute on primary
    sudo su - hn1adm -c "python /usr/sap/HN1/HDB03/exe/python_support/systemReplicationStatus.py"
    ```

1. Check the `SAPHanaSR` attribute for the third site. `SITE-DR` should show up with the status `SOK` in the `Sites` section.

    ```bash
    # Check SAPHanaSR attribute on any cluster managed host (first or second site)
    sudo SAPHanaSR-showAttr
    # Expected result
    # Global cib-time                 maintenance prim  sec sync_state upd
    # ---------------------------------------------------------------------
    # HN1    Fri Jan 27 10:38:46 2023 false       HANA_S1 -   SOK        ok
    # 
    # Sites     lpt        lss mns         srHook srr
    # ------------------------------------------------
    # SITE-DR                              SOK
    # HANA_S1   1674815869 4   hana-s1-db1 PRIM   P
    # HANA_S2   30         4   hana-s2-db1 SOK    S
    ```

   The cluster detects the replication status of connected sites. The monitored attribute can change between `SOK` and `SFAIL`. There's no cluster action if the replication to the DR site fails.

## Autoregister the third site

During a planned or unplanned takeover event between the two Pacemaker cluster sites, HSR to the third site is also interrupted. Pacemaker doesn't modify HANA replication to the third site.

SAP provides since the HANA 2 SPS 04 parameter `register_secondaries_on_takeover`. With the parameter set to the value `true`, after the HSR takeover between cluster sites 1 and 2, HANA registers the third site on the new primary automatically to keep an HSR multitarget setup. Configure the HANA parameter `register_secondaries_on_takeover = true` that's configured in the `[system_replication]` block of *global.ini* on both SAP HANA sites in the Linux cluster. Both SITE1 and SITE2 need the parameter in the respective HANA *global.ini* configuration file. The parameter can also be used outside a Pacemaker cluster.

For HSR [multitier](https://help.sap.com/docs/SAP_HANA_PLATFORM/6b94445c94ae495c83a19646e7c3fd56/f730f308fede4040bcb5ccea6751e74d.html), no automatic SAP HANA registration of the third site exists. You need to manually register the third site to the current secondary to keep the HSR replication chain for multitier.

![Diagram flow that shows how a HANA autoregistration works with a third site during a takeover.](./media/sap-hana-high-availability/sap-hana-high-availability-hsr-third-site-auto-register.png)

## Next steps

- [Disaster recovery overview and infrastructure](./disaster-recovery-overview-guide.md)
- [Disaster recovery for SAP workloads](./disaster-recovery-sap-guide.md)
- [High-availability architecture and scenarios for SAP NetWeaver](./sap-hana-availability-across-regions.md)
