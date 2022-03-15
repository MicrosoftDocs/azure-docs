---
title: Create on-demand backup of your Nutanix Database in SnapCenter
description: Learn how to create an on-demand backup of your Nutanix Database in SnapCenter on Nutanix BareMetal Infrastructure.
ms.topic: how-to
ms.subservice: baremetal-nutanix
ms.date: 05/07/2021
---

# Create on-demand backup of your Nutanix Database in SnapCenter

In this article, we'll walk through creating an on-demand backup of your Nutanix Database in SnapCenter. 

Once you've [configured SnapCenter](configure-snapcenter-nutanix-baremetal.md), backups of your datafiles, control files, and archive logs will continue based on the schedule you entered when creating the resource group(s). However, as part of normal database protection, you might also want on-demand backups.

## Steps to create an on-demand backup

1. Select **Resources** on the left menu. Then in the dropdown menu next to **View**, select **Resource Group**. Select the resource group name corresponding to the on-demand backup you want to create.

2. Select **Back up now** in the upper right.

3. Verify the resource group and protection policy are correct for the on-demand backup. Select the **Verify after backup** checkbox if you want to verify this backup. Select **Backup**.

After the backup completes, it will be available in the list of backups under **Resources**. Select the database or databases associated with the resource group you backed up. This backup will be retained according to the on-demand retention policy you set when creating the protection policy.

## Next steps

Learn how to restore an Nutanix Database in SnapCenter:

> [!div class="nextstepaction"]
> [Restore Nutanix database](restore-nutanix-database-baremetal.md)
