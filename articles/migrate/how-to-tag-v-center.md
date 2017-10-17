---
title: Set up VMware vCenter tagging | Microsoft Docs
description: Describes how to create a group before you run an assessment with the Azure Migrate service.
services: migration-planner
documentationcenter: ''
author: rayne-wiselman
manager: carmonm
editor: ''

ms.assetid: 5c279804-aa30-4946-a222-6b77c7aac508
ms.service: site-recovery
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: storage-backup-recovery
ms.date: 09/25/2017
ms.author: raynew
---

# Set up VMware vCenter tagging

This article describes how to create a group of machines for assessment by [Azure Migrate](migrate-overview.md), using tagging in VMware vCenter. Azure Migrate creates groups based on the vCenter tags. When you create an assessment, each machine in the group is assessed to check whether it's suitable for migration to Azure. Azure Migrate also provides sizing and cost estimations for running the machine in Azure.


## Set up tagging

During Azure Migrate deployment, you set up an on-premises Azure Migrate collector VM which discovers on-premises virtual machines (VMs) on ESXi hosts managed by a vCenter server. You need to set up vCenter tagging before discovery.

1. In the VMware vSphere Web Client, navigate to the vCenter server.
2. Click **Tags**, to review any current tags.
3. To tag a VM, select **Related Objects** > **Virtual Machines**, and then select the VM you want to tag.
4. In **Summary** > **Tags**, click **Assign**. 
5. Click **New Tag**, and specify a tag name and description.
6. To crate a category for the tag, select **New Category** in the drop-down list.
7. Specify a category name and description, and the cardinality. Then click **OK**.
8. On the VM **Summary** tab, you can view the tags associated with the VM.

    ![VM tags](./media/how-to-tag-v-center/vm-tag.png)

## Next steps

[Learn more](concepts-assessment-calculation.md) about how assessments are calculated.
