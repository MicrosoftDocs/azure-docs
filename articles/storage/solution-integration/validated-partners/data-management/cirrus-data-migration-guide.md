---
title: Migrate your block data to Azure with Cirrus Data
titleSuffix: Azure Storage
description: Learn how Cirrus Migrate Cloud enables disk migration from an existing storage system or cloud to Azure. The original system operates during migration.
author: dukicn
ms.author: nikoduki
ms.date: 06/10/2022
ms.topic: how-to
ms.custom: kr2b-contr-experiment
ms.service: azure-storage
ms.subservice: storage-partner-integration
---

# Migrate your block data to Azure with Cirrus Migrate Cloud

Cirrus Migrate Cloud (CMC) enables disk migration from an existing storage system or cloud to Azure. Migration proceeds while the original system is still in operation. This article presents the methodology to successfully configure and execute the migration.

The solution uses distributed Migration Agents that run on every host. The agents allow direct Host-to-Host connections. Each Host-to-Host migration is independent, which makes the solution infinitely scalable. There are no central bottlenecks for the dataflow. The migration uses cMotion™ technology to ensure no effect on production.

## Migration use cases

This document covers a generic migration case for moving an application from one virtual machine to a virtual machine in Azure. The virtual machine can be on-premises or in another cloud provider. For step-by-step guides in various use cases, see the following links:

- [Moving the workload to Azure with cMotion](https://support.cirrusdata.cloud/en/article/howto-cirrus-migrate-cloud-on-premises-to-azure-1xo3nuf/)
- [Moving from Premium Disks to Ultra Disks](https://support.cirrusdata.cloud/en/article/howto-cirrus-migrate-cloud-migration-between-azure-tiers-sxhppt/)
- [Moving from AWS to Azure](https://support.cirrusdata.cloud/en/article/howto-cirrus-migrate-cloud-migration-from-aws-to-azure-weegd9/.)

## Cirrus Migrate Cloud Components

Cirrus Migrate Cloud consists of multiple components:

- The *cMotion™ feature* of CMC does a storage-level cut-over from a source to the target cloud without downtime to the source host. cMotion™ is used to swing the workload over from the original FC or iSCSI source disk to the new destination Azure Managed Disk.
- *Web-based Management Portal* is web-based management as a service. It allows users to manage migration and protect any block storage. Web-based Management Portal provides interfaces for all CMC application configurations, management, and administrative tasks.

    :::image type="content" source="./media/cirrus-data-migration-guide/cirrus-web-portal.jpg" alt-text="Screenshot of C M C Portal with the menu tabs, fields for the tab, and migration project owner called out.":::

## Implementation guide

Follow the Azure best practices to implement a new virtual machine. For more information, see [quick start guide](../../../../virtual-machines/windows/quick-create-portal.md).

Before starting the migration, make sure the following prerequisites have been met:

- Verify that the OS in Azure is properly licensed.
- Verify access to the Azure Virtual Machine.
- Check that the application / database license is available to run in Azure.
- Check the permission to auto-allocate the destination disk size.
- Ensure that managed disk is the same size or larger than the source disk.
- Ensure that either the source or the destination virtual machine has a port open to allow our H2H connection.

Follow these implementation steps:

1. **Prepare the Azure virtual machine**. The virtual machine must be fully implemented. Once the data disks are migrated, the destination host can immediately start the application and bring it online. State of the data is the same as the source when it was shut down seconds ago. CMC doesn't migrate the OS disk from source to destination.

1. **Prepare the application in the Azure virtual machine**. In this example, the source is Linux host. It can run any user application accessing the respective BSD storage. This example uses a database application running at the source using a 1-GiB disk as a source storage device. However, any application can be used instead. Set up a virtual machine in Azure ready to be used as the destination virtual machine. Make sure that resource configuration and operating system are compatible with the application, and ready to receive the migration from the source using CMC portal. The destination block storage devices are automatically allocated and created during the migration process.

1. **Sign up for CMC account**. To obtain a CMC account, follow the support page for instructions on how to get an account. For more information, see [Licensing Model](https://support.cirrusdata.cloud/en/article/licensing-m4lhll/).

1. **Create a Migration Project**. The project reflects the specific migration characteristics, type, owner of the migration, and any details needed to define the operations. 

    :::image type="content" source="./media/cirrus-data-migration-guide/cirrus-create-project.jpg" alt-text="Screenshot shows the Create New Project dialog.":::

1. **Define the migration project parameters**. Use the CMC web-based portal to configure the migration by defining the parameters: source, destination, and other parameters.

1. **Install the migration CMC agents on source and destination hosts**. Using the CMC web-based management portal, select  **Deploy Cirrus Migrate Cloud** to get the `curl` command for **New Installation**. Run the command on the source and destination command-line interface.

1. **Create a bidirectional connection between source and destination hosts**. Use **H2H** tab in the CMC web-based management portal. Select **Create New Connection**. Select the device used by the application, not the device used by the Linux operating system.

    :::image type="content" source="./media/cirrus-data-migration-guide/cirrus-migration-1.jpg" alt-text="Screenshot that shows list of deployed hosts.":::

    :::image type="content" source="./media/cirrus-data-migration-guide/cirrus-migration-2.jpg" alt-text="Screenshot that shows list of host-to-host connections.":::

    :::image type="content" source="./media/cirrus-data-migration-guide/cirrus-migration-3.jpg" alt-text="Screenshot that shows list of migrated devices.":::

1. **Start the migration to the destination virtual machine** using **Migrate Host Volumes** from the CMC web-based management portal. Follow the instructions for remote location. Use the CMC portal to **Auto allocate destination volumes** on the right of the screen.

1. Add Azure Credentials to allow connectivity and disk provisioning using the **Integrations** tab on the CMC portal. Fill in the required fields using your private company’s values for Azure: **Integration Name**, **Tenant ID**, **Client/Application ID**, and **Secret**. Select **Save**.

    :::image type="content" source="./media/cirrus-data-migration-guide/cirrus-migration-4.jpg" alt-text="Screenshot that shows entering Azure credentials.":::

    For details on creating Azure AD application, see the [step-by-step instructions](https://support.cirrusdata.cloud/en/article/creating-an-azure-service-account-for-cirrus-data-cloud-tw2c9n/). By creating and registering Azure AD application for CMC, you enable automatic creation of Azure Managed Disks on the target virtual machine.

    >[!NOTE]
    >Since you selected **Auto allocate destination volumes** on the previous step, don't select it again for a new allocation. Instead, select **Continue**.

## Migration guide

After selecting **Save** in the previous step, the **New Migration Session** window appears. Fill in the fields:

- **Session description**: Provide meaningful description.
- **Auto Resync Interval**: Enable migration schedule.
- Use iQoS to select the effect migration has on the production:
  - **Minimum** throttles migration rate to 25% of the available bandwidth.
  - **Moderate** throttles migration rate to 50% of the available bandwidth.
  - **Aggressive** throttles migration rate to 75% of the available bandwidth.
  - **Relentless** doesn't throttle the migration.

       :::image type="content" source="./media/cirrus-data-migration-guide/cirrus-iqos.jpg" alt-text="Screenshot that shows options for iQoS settings.":::

Select **Create Session** to start the migration.

From the start of the migration initial sync until cMotion starts, there's no need for you to interact with CMC. You can monitor current status, session volumes, and track the changes using the dashboard.

:::image type="content" source="./media/cirrus-data-migration-guide/cirrus-monitor-1.jpg" alt-text="Screenshot that shows monitoring progress.":::

During the migration, you can observe the blocks changed on the source device by selecting the **Changed Data Map**.  

:::image type="content" source="./media/cirrus-data-migration-guide/cirrus-monitor-2.jpg" alt-text="Screenshot that shows changed data map.":::

Details on iQoS show synchronized blocks and migration status. It also shows that there's no effect on production IO.

:::image type="content" source="./media/cirrus-data-migration-guide/cirrus-monitor-3.jpg" alt-text="Screenshot that shows iQoS details.":::

## Moving the workload to Azure with cMotion

After the initial synchronization finishes, prepare to move the workload from the source disk to the destination Azure Managed Disk using cMotion™.

### Start cMotion™

At this point, the systems are ready for cMotion™ migration cut-over.

In the CMS portal, select **Trigger cMotion™** using Session to switch the workload from the source to the destination disk. To check if the process finished, you can use `iostat`, or equivalent command. Go to the terminal in the Azure virtual machine, and run `iostat /dev/<device_name>`, for example `/dev/sdc`. Observe that the IOs are written by the application on the destination disk in Azure cloud.

:::image type="content" source="./media/cirrus-data-migration-guide/cirrus-monitor-4.jpg" alt-text="Screenshot that shows current monitoring status.":::

In this state, the workload can be moved back to the source disk at any time. If you want to revert the production virtual machine, select **Session Actions** and select the **Revert cMotion™** option. You can swing back and forth as many times we want while the application is running at source host/VM.

When the final cut-over to the destination virtual machine is required, follow these steps:

1. Select **Session Actions**.
1. Select the **Finalize Cutover** option to lock-in the cut-over to the new Azure virtual machine and disable the option for source disk to be removed.
1. Stop any other application running in the source host for final host cut-over.

### Move the application to the destination virtual machine

Once the cut-over has been done, application needs to be switched over to the new virtual machine. To do that, do the following steps:

1. Stop the application.
1. Unmount the migrated device.
1. Mount the new migrated device in the Azure virtual machine.
1. Start the same application in the Azure virtual machine on the new migrated disk.

Verify that here are no IOs going to source hosts devices by running the `iostat` command in the source host. Running `iostat` in Azure virtual machine shows that IO is running on the Azure virtual machine terminal.

### Complete the migration session in CMC GUI

The migration step is complete when all the IOs were redirected to the destination devices after triggering cMotion™. You can now close the session using **Session Actions**. Select **Delete Session** to close the migration session.
As a last step, remove the **Cirrus Migrate Cloud Agents** from both source host and Azure virtual machine. To perform uninstall, get the **Uninstall curl command** from **Deploy Cirrus Migrate Cloud** button. Option is in the **Hosts** section of the portal. 

After the agents are removed, migration is fully complete. Now the source application is running in production on the destination Azure virtual machine with locally mounted disks.

## Support

### How to open a case with Azure

In the [Azure portal](https://portal.azure.com) search for support in the search bar at the top. Select **Help + support** > **New Support Request**.

### Engaging Cirrus Support

In the CMC portal, select **Help Center** tab on the CMC portal to contact Cirrus Data Solutions support, or go to [CDSI website](https://support.cirrusdata.cloud/en/), and file a support request.

## Next steps

- Learn more about [Azure virtual machines](../../../../virtual-machines/windows/overview.md)
- Learn more about [Azure Managed Disks](../../../../virtual-machines/managed-disks-overview.md)
- Learn more about [storage migration](../../../common/storage-migration-overview.md)
- [Cirrus Data website](https://www.cirrusdata.com/)
- Step-by-step guides for [cMotion](https://support.cirrusdata.cloud/en/category/howtos-1un623w/)
