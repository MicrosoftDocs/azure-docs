---
title: Azure CycleCloud 7 Retirement Guide
description: This article describes the impact of the CycleCloud 7 retirement and migration options.
author: padmalathas
ms.author: padmalathas
ms.topic: how-to
ms.date: 07/01/2025
---

# CycleCloud 7 retirement guide

Azure CycleCloud is an enterprise-friendly tool for orchestrating and managing High Performance Computing (HPC) environments on Azure. With CycleCloud, you can provision infrastructure for HPC systems, deploy familiar HPC schedulers, and automatically scale the infrastructure to run jobs efficiently at any scale. You can create different types of file systems and mount them to the compute cluster nodes to support HPC workloads. HPC administrators and users can deploy an HPC environment with common schedulers such as Slurm, PBSPro, LSF, Grid Engine, and HT-Condor.

CycleCloud 7, first released in 2018, uses Python 2.7 extensively in its cluster-configuration software. Since Python 2.7 reached end of life in 2020, CycleCloud 7 is retiring on **30 September 2023**. Because CycleCloud is an installed product, you can continue using your installations past this date at your own risk. No additional security patches or bug fixes are available.

## Retirement alternatives

CycleCloud 8 is the latest supported version with new features including a renewed focus on core HPC operations and Azure platform integration.

New features include:

- Cloud-init support with full support for using cloud-init to config cluster VMs
- PBS Updates
  - PBS clusters upgraded to use the latest OpenPBS 20 release
  - PBS autoscaler updated to use the new autoscaling library
- NAS Options in Default Templates
  - Mount an external NFS filesystem easily without needing to create a custom template
  - Size options for internal NFS volume
- Improved Node Preparation Time
  - Significant improvement in node preparation time
  - Shaves off between 90 to 180 seconds from boot-up time
- Event Grid support for node-status notifications
- Altair Grid Engine Support 
  - Official support for Altair Grid Engine
  - Updated autoscaling library for Grid Engine
- Job Accounting
  - Enable Slurm job accounting feature
  - Store job accounting data in a file or write it to a MariaDB/MySQL database.
- **Autoscaling Lib**
  - A new Python library that makes scheduler autoscale integrations easier and more consistent.
  - Provides better scaling agility for both high-throughput and tightly coupled jobs.
- **CentOS 8 and Ubuntu 20**
  - CycleCloud 8 supports CentOS 7, CentOS 8, Ubuntu 18, and Ubuntu 20.
- **Additional Slurm Features**
  - Option to stop deallocate nodes instead of terminating them during auto-stopping.
  - Auto-detection of GPU resources.

The following features available in CycleCloud 7 aren't available in CycleCloud 8:

- Python 2 support in clusters.
- Job management and submission support for GridEngine.
- Ganglia monitoring.
- Configurable reports.
- Data transfer utilities.
- Pogo data-transfer command line.

## Impact  

Clusters that you created with CycleCloud 7 continue to work, but Python 2 is no longer supported.

CycleCloud 8 uses a different package name, `cyclecloud8`, to prevent accidental upgrades between major versions. There are incompatible changes between major versions. You can't install both `cyclecloud` and `cyclecloud8` on the same machine.

To upgrade, remove the `cyclecloud` package and install `cyclecloud8`. When you remove the `cyclecloud` package, your data and configuration directories in **/opt/cycle_server** are preserved. When you install `cyclecloud8`, the installation scripts detect existing data and configuration files and automatically run any upgrade migrations.

Upgrading might cause undesired consequences for your CycleCloud environment and any running clusters. To minimize risk for production workloads, we recommend testing all upgrades in a development or staging environment.

### Migration strategy

For instructions on how to upgrade or migrate, see [Upgrade or Migrate Cyclecloud](upgrade-and-migrate.md).

## FAQ

1. Will my old templates work with this new version?
   Templates should work for minor version upgrades. Upgrades between major version releases might require you to pin clusters to the older version your templates are designed for.

1. Is there any downtime during the upgrade?
   CycleCloud is unavailable while the upgrade happens. The upgrade usually takes two to three minutes.

1. Can I upgrade while clusters are running?
   Yes, but the clusters can't communicate with CycleCloud while it's down. This communication stops autoscale, termination requests, and other actions until the upgrade finishes.

## Next steps

For more information about CycleCloud, see [What is Azure CycleCloud](../overview.md).
