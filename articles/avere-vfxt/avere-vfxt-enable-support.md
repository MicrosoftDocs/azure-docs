---
title: Enable support for Avere vFXT - Azure
description: Learn how to enable automatic upload of support data about your cluster from Avere vFXT for Azure to help Support provide customer service.
author: ekpgh
ms.service: azure-avere-vfxt
ms.topic: how-to
ms.date: 12/14/2019
ms.author: rohogue
---

# Enable support uploads

Avere vFXT for Azure can automatically upload support data about your cluster. These uploads let support staff provide the best possible customer service.

## Steps to enable uploads

Follow these steps from the Avere Control Panel to activate support. (Read [Access the vFXT cluster](avere-vfxt-cluster-gui.md) to learn how to open the control panel.)

1. Navigate to the **Settings** tab at the top.
1. Click the **Support** link on the left and accept the privacy policy.
1. On the support configuration page, open the **Customer Info** section by clicking the triangle at the left.
1. Click the **Revalidate upload information** button.
1. Set the cluster's support name in **Unique Cluster Name**. Make sure this name uniquely identifies your cluster to support staff.
1. Check the boxes for **Statistics Monitoring**, **General Information Upload**, and **Crash Information Upload**.
1. Click **Submit**.

   ![Screenshot containing completed customer info section of support settings page](media/avere-vfxt-support-info.png)

1. Click the triangle to the left of **Secure Proactive Support (SPS)** to expand the section.
1. Check the box for **Enable SPS Link**.
1. Click **Submit**.

   ![Screenshot containing completed Secure Proactive Support section on support settings page](media/avere-vfxt-support-sps.png)

## Next steps

If you need to add an on-premises or existing cloud storage system to the cluster, follow the instructions in [Configure storage](avere-vfxt-add-storage.md).

If you are ready to start attaching clients to the cluster, read [Mount the Avere vFXT cluster](avere-vfxt-mount-clients.md).
