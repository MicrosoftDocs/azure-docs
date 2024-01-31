---
title: Add HSR third site to HANA Pacemaker cluster
description: Extending highly available SAP HANA solution with third site for disaster recovery
author: msftrobiro
ms.author: robiro
ms.service: sap-on-azure
ms.subservice: sap-vm-workloads
ms.workload: infrastructure-services
ms.topic: how-to
ms.date: 01/16/2024
ms.custom: template-how-to-pattern 
---

# Add HSR third site to HANA Pacemaker cluster

This article describes requirements and setup of a third HANA replication site to complement an existing Pacemaker cluster. Both SUSE Linux Enterprise Server (SLES) and RedHat Enterprise Linux (RHEL) specifics are covered.

## Overview

SAP HANA supports system replication (HSR) with more than two sites connected. You can add a third site to an existing HSR pair, managed by Pacemaker in a highly available setup. You can deploy the third site in a second Azure region for disaster recovery (DR) purposes.  

Pacemaker and HANA cluster resource agent manage the first two sites. Pacemaker cluster doesn't control the third site.

SAP HANA supports a third system replication site in two modes.

- [Multi-target](https://help.sap.com/docs/SAP_HANA_PLATFORM/6b94445c94ae495c83a19646e7c3fd56/ba457510958241889a459e606bbcf3d3.html) replicates data changes from primary to more than one target system. Third site connected to primary, replication in a star topology.
- [Multi-tier](https://help.sap.com/docs/SAP_HANA_PLATFORM/6b94445c94ae495c83a19646e7c3fd56/f730f308fede4040bcb5ccea6751e74d.html) is a two-tier replication. A cascading, or sometimes referred to as chained setup, of three different HANA tiers. Third site connects to secondary.  

For more information, see [SAP HANA availability across Azure regions](./sap-hana-availability-across-regions.md#combine-availability-within-one-region-and-across-regions) for more conceptual details about HANA HSR within one and across different regions.

## Prerequisites for SLES

Requirements for a third HSR site are different between HANA scale-up and HANA scale-out.

> [!NOTE]
> Requirements in this chapter are only valid for a Pacemaker enabled landscape. Without Pacemaker, SAP HANA version requirements apply for the chosen replication mode.  
> Pacemaker and HANA cluster resource agent manages only two sites. Third HSR site isn't controlled by Pacemaker cluster.

- Both scale-up and scale-out: SAP HANA SPS 04 or newer required to use multi-target HSR with a Pacemaker cluster
- Both scale-up and scale-out: Maximum one SAP HANA system replication connected from outside the Linux cluster
- HANA scale-out only: SLES 15 SP1 or higher
- HANA scale-out only: OS package SAPHanaSR-ScaleOut version 0.180 or higher
- HANA scale-out only: SAP HANA HA hook [SAPHanaSrMultiTarget](./sap-hana-high-availability-scale-out-hsr-suse.md#implement-hana-ha-hooks-saphanasrmultitarget-and-suschksrv) in use. Preview HANA HA hook SAPHanaSR isn't multi-target aware for scale-out.

## Prerequisites for RHEL

Requirements for a third HSR site are different between HANA scale-up and HANA scale-out.

> [!NOTE]
> Requirements in this chapter are only valid for a Pacemaker enabled landscape. Without Pacemaker, SAP HANA version requirements apply for the chosen replication mode.  
> Pacemaker and HANA cluster resource agent manages only two sites. Third HSR site isn't controlled by Pacemaker cluster.

- HANA scale-up only: See RedHat [support policies for RHEL high availability clusters](https://access.redhat.com/articles/3397471) for details on minimum OS, SAP HANA and cluster resource agents version.
- HANA scale-out only: HANA multi-target replication isn't supported on Azure with a Pacemaker cluster.

## HANA scale-up: Add HANA multi-target system replication for DR purposes

With SAP HANA HA hook SAPHanaSR for [SLES](./sap-hana-high-availability.md#implement-hana-hooks-saphanasr-and-suschksrv) and [RHEL](./sap-hana-high-availability-rhel.md#implement-the-python-system-replication-hook-saphanasr), you can add a third node for disaster recovery (DR) purposes. The Pacemaker environment is aware of a HANA multi-target DR setup.

Failure of the third node won't trigger any cluster action. Cluster detects the replication status of connected sites and the monitored attribute for third site can change between SOK and SFAIL state. Any takeover tests to third/DR site or executing your DR exercise process should first place the cluster resources into maintenance mode to prevent any undesired cluster action.

Example of a multi-target system replication system. For more information, see [SAP documentation](https://help.sap.com/docs/SAP_HANA_PLATFORM/4e9b18c116aa42fc84c7dbfd02111aba/2e6c71ab55f147e19b832565311a8e4e.html).  
![Diagram showing an example of a HANA scale-up multi-target system replication system.](./media/sap-hana-high-availability/sap-hana-high-availability-scale-up-hsr-multi-target.png)

1. Deploy Azure resources for the third node. Depending on your requirements, you can use a different Azure region for disaster recovery purposes.

   Steps required for the third site are similar to [virtual machines for HANA scale-up cluster](./sap-hana-high-availability.md#prepare-the-infrastructure). Third site will use Azure infrastructure, operating system and HANA version matching the existing Pacemaker cluster, with the following exceptions:

   - No load balancer deployed for third site and no integration with existing cluster load balancer for the VM of third site
   - Don't install OS packages SAPHanaSR, SAPHanaSR-doc and OS package pattern ha_sles on third site VM
   - No integration into the cluster for VM or HANA resources of the third site
   - No HANA HA hook setup for third site in global.ini

2. Install SAP HANA on third node.
  
   Same HANA SID and HANA installation number must be used for third site.  

3. With SAP HANA on third site installed and running, register the third site with the primary site.

   The example uses SITE-DR as the name for third site.

    ```bash
    # Execute on the third site 
    su - hn1adm
    # Register the HANA third site to the primary. Switch --online will shutdown the HANA instance on third site.
    hdbnsutil -sr_register --name=SITE-DR --remoteHost=hn1-db-0 --remoteInstance=03 --replicationMode=async --online
    ```

4. Verify HANA system replication shows both secondary and third site.

    ```bash
    # Verify HANA HSR is in sync, execute on primary
    sudo su - hn1adm -c "python /usr/sap/HN1/HDB03/exe/python_support/systemReplicationStatus.py"
    ```

5. Check the SAPHanaSR attribute for third site. SITE-DR should show up with status SOK in the sites section.

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

   Cluster detects the replication status of connected sites and the monitored attributed can change between SOK and SFAIL. No cluster action if the replication to DR site fails.

## HANA scale-out: Add HANA multi-target system replication for DR purposes

With SAP HANA HA provider [SAPHanaSrMultiTarget](./sap-hana-high-availability-scale-out-hsr-suse.md#implement-hana-ha-hooks-saphanasrmultitarget-and-suschksrv), you can add a third HANA scale-out site. This third site is often used for disaster recovery (DR) in another Azure region. The Pacemaker environment is aware of a HANA multi-target DR setup. Note that this section is only applicable to systems running Pacemaker on SUSE only, see prerequisites section in this document for details.

Failure of the third node won't trigger any cluster action. Cluster detects the replication status of connected sites and the monitored attribute for third site can change between SOK and SFAIL state. Any takeover tests to third/DR site or executing your DR exercise process should first place the cluster resources into maintenance mode to prevent any undesired cluster action.

Example of a multi-target system replication system. For more information, see [SAP documentation](https://help.sap.com/docs/SAP_HANA_PLATFORM/4e9b18c116aa42fc84c7dbfd02111aba/2e6c71ab55f147e19b832565311a8e4e.html).  
![Diagram showing an example of a HANA scale-out multi-target system replication system.](./media/sap-hana-high-availability/sap-hana-high-availability-scale-out-hsr-multi-target.png)

1. Deploy Azure resources for the third site. Depending on your requirements, you can use a different Azure region for disaster recovery purposes.

   Steps required for the HANA scale-out on third site are mirroring steps to deploy the [HANA scale-out cluster](./sap-hana-high-availability-scale-out-hsr-suse.md#prepare-the-infrastructure). Third site will use Azure infrastructure, operating system and HANA installation steps for SITE1 of the scale-out cluster, with the following exceptions:

   - No load balancer deployed for third site and no integration with existing cluster load balancer for the VMs of third site
   - Don't install OS packages SAPHanaSR-ScaleOut, SAPHanaSR-ScaleOut-doc and OS package pattern ha_sles on third site VMs
   - No majority maker VM for third site, as there's no cluster integration
   - Create NFS volume /hana/shared for third site exclusive use
   - No integration into the cluster for VMs or HANA resources of the third site
   - No HANA HA hook setup for third site in global.ini

   You must use the same HANA SID and HANA installation number for third site.

2. With SAP HANA scale-out on third site installed and running, register the third site with the primary site.

   The example uses SITE-DR as the name for third site.

    ```bash
    # Execute on the third site 
    su - hn1adm
    # Register the HANA third site to the primary. Switch --online will shutdown the HANA instance on third site.
    hdbnsutil -sr_register --name=SITE-DR --remoteHost=hana-s1-db1 --remoteInstance=03 --replicationMode=async --online
    ```

3. Verify HANA system replication shows both secondary and third site.

    ```bash
    # Verify HANA HSR is in sync, execute on primary
    sudo su - hn1adm -c "python /usr/sap/HN1/HDB03/exe/python_support/systemReplicationStatus.py"
    ```

4. Check the SAPHanaSR attribute for third site. SITE-DR should show up with status SOK in the sites section.

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

   Cluster detects the replication status of connected sites and the monitored attributed can change between SOK and SFAIL. No cluster action if the replication to DR site fails.

## Autoregistering third site

During planned or unplanned takeover event between the two Pacemaker cluster sites, HSR to third site will be also interrupted. Pacemaker doesn't modify HANA replication to third site.

SAP provides since HANA 2 SPS 04 parameter `register_secondaries_on_takeover`. With the parameter set to value `true`, after HSR takeover between cluster sites 1 and 2, HANA will register the third site on the new primary automatically to keep an HSR multi-target setup. Configure HANA parameter `register_secondaries_on_takeover = true` configured in `[system_replication]` block of global.ini on both SAP HANA sites in the Linux cluster. Both SITE1 and SITE2 need the parameter in the respective HANA global.ini configuration file. Parameter can be used also outside a Pacemaker cluster.

For HSR [multi-tier](https://help.sap.com/docs/SAP_HANA_PLATFORM/6b94445c94ae495c83a19646e7c3fd56/f730f308fede4040bcb5ccea6751e74d.html), no automatic SAP HANA registration of the third site exists. You need to manually register the third site to the current secondary, to keep HSR replication chain for multi-tier.

![Diagram flow showing how a HANA auto-registration works with a third site during a takeover.](./media/sap-hana-high-availability/sap-hana-high-availability-hsr-third-site-auto-register.png)

## Next steps

- [Disaster recovery overview and infrastructure](./disaster-recovery-overview-guide.md)
- [Disaster recovery for SAP workloads](./disaster-recovery-sap-guide.md)
- [High-availability architecture and scenarios for SAP NetWeaver](./sap-hana-availability-across-regions.md)
