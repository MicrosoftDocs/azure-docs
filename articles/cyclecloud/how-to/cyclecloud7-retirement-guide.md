---
title: Azure CycleCloud 7 Retirement Guide
description: This article describes the impact of the CycleCloud 7 retirement and migration options.
author: padmalathas
ms.author: padmalathas
ms.topic: how-to
ms.date: 03/27/2023
---

# CycleCloud 7 Retirement Guide

Azure CycleCloud is an enterprise-friendly tool for orchestrating and managing High Performance Computing (HPC) environments on Azure. With CycleCloud, you can provision infrastructure for HPC systems, deploy familiar HPC schedulers, and automatically scale the infrastructure to run jobs efficiently at any scale. You can create different types of file systems and mount them to the compute cluster nodes to support HPC workloads. HPC administrators and users can deploy an HPC environment with common schedulers such as Slurm, PBSPro, LSF, Grid Engine, and HT-Condor.

CycleCloud 7, first released in 2018, makes extensive use of Python 2.7 in its cluster-configuration software. As Python 2.7 reached end-of-life in 2020, CycleCloud 7 will be retired on **30 September 2023**. Since CycleCloud is an installed product, you may continue to use your installations past this point at your own risk. No additional security patches or bug fixes will be released.

## Retirement alternatives

CycleCloud 8 is the latest supported version with new features added including renewed focus on core HPC operations and Azure platform integration.

New features include:

- Cloud-init support with full support for using cloud-init to config cluster VMs
- PBS Updates
  - PBS clusters upgraded to using the latest OpenPBS 20 release
  - PBS autoscaler updated to use the new autoscaling library
- NAS Options in Default Templates
  - Mount an external NFS filesystem easily without needing to create a custom template
  - Size options for internal NFS volume
- Improved Node Preparation Time
  - Significant improvement in node preparation time
  - Shaves off between 90-180s from boot-up time
- Event Grid support for node-status notifications
- Altair Grid Engine Support 
  - Official support for Altair Grid Engine
  - Updated autoscaling library for Grid Engine
- Job Accounting
  - Enable Slurm job accounting feature
  - Job accounting data can be stored to a file or written to a MariaDB/MySQL database
- Autoscaling Lib
  - A new python library to facilitate and standardize scheduler autoscale integrations
  - Better scaling agility for both high-throughput and tightly-coupled jobs
- CentOS 8 and Ubuntu 20
  - CycleCloud 8 supports CentOS 7, CentOS 8, Ubuntu 18, and Ubuntu 20
- Additional Slurm Features
  - Option to stop-deallocate nodes instead of terminating them during auto-stopping
  - Auto-detection of GPU resources

The following features available in CycleCloud 7 are not available in CycleCloud 8:

- Python 2 support in clusters
- Job Management and Submission support for GridEngine 
- Ganglia monitoring
- Configurable Reports
- Data Transfer utilities
- Pogo data-transfer command line

## Impact  

Clusters created with CycleCloud 7 will continue to work; however, these clusters make use of Python 2 and are not supported.

CycleCloud 8 has a different package name, `cyclecloud8`, to prevent accidental upgrade from one major version to the next. There are incompatible changes between major versions. You cannot install both `cyclecloud` and `cyclecloud8` on the same machine.

The supported upgrade path is to remove the `cyclecloud` package and install `cyclecloud8`. Your data and configuration directories within **/opt/cycle_server** will be preserved upon removal of the `cyclecloud` package. Upon installing `cyclecloud8`, the installation scripts will detect existing data and configuration then run through any upgrade migrations automatically.

Upgrading may have undesired consequences on your CycleCloud environment and any running clusters. We recommend testing all upgrades in a development or staging environment to minimize risk on production workloads.

### Migration strategy

Refer to [Upgrade or Migrate Cyclecloud](upgrade-and-migrate.md) for instructions on how to Upgrade or Migrate.

## FAQ

1. Will my old templates be compatible with this new version?
   Templates should be compatible for minor version upgrades. Upgrades between major version releases may require you to pin clusters to the older version your templates are designed for.

2. Is there any downtime associated with the upgrade?
   CycleCloud will be down for a bit while the upgrade occurs. The upgrade typically takes 2-3 minutes.

3. Can I upgrade while clusters are running?
   Yes, but the clusters will not be able to communicate with CycleCloud while it's down. This means that autoscale, termination requests, etc will not work until the upgrade is complete.

## Next steps

For more information about CycleCloud, see [What is Azure CycleCloud](../overview.md).
