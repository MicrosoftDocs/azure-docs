---
title: Create a content library to deploy VMs in Azure VMware Solution
description: Create a content library to deploy a VM in an Azure VMware Solution private cloud.
ms.topic: how-to
ms.service: azure-vmware
ms.date: 04/11/2022
---

# Create a content library to deploy VMs in Azure VMware Solution

A content library stores and manages content in the form of library items. A single library item consists of files you use to deploy virtual machines (VMs).

In this article, you'll create a content library in the vSphere Client and then deploy a VM using an ISO image from the content library.

## Prerequisites

An NSX-T Data Center segment and a managed DHCP service are required to complete this tutorial.  For more information, see [Configure DHCP for Azure VMware Solution](configure-dhcp-azure-vmware-solution.md).  

## Create a content library

1. From the on-premises vSphere Client, select **Menu** > **Content Libraries**.

   :::image type="content" source="media/content-library/vsphere-menu-content-libraries.png" alt-text="Screenshot showing the Content Libraries menu option in the vSphere Client.":::

1. Select **Add** to create a new content library.

   :::image type="content" source="media/content-library/create-new-content-library.png" alt-text="Screenshot showing how to create a new content library in vSphere.":::

1. Provide a name and confirm the IP address of the vCenter Server and select **Next**.

   :::image type="content" source="media/content-library/new-content-library-step-1.png" alt-text="Screenshot showing the name and vCenter Server IP for the new content library.":::

1. Select the **Local content library** and select **Next**.

   :::image type="content" source="media/content-library/new-content-library-step-2.png" alt-text="Screenshot showing the Local content library option selected for the new content library.":::

1. Select the datastore for storing your content library, and then select **Next**.

   :::image type="content" source="media/content-library/new-content-library-step-3.png" alt-text="Screenshot showing the vsanDatastore storage location selected.":::

1. Review the content library settings and select **Finish**.

   :::image type="content" source="media/content-library/new-content-library-step-4.png" alt-text="Screenshot showing the settings for the new content library.":::

## Upload an ISO image to the content library

Now that you've created the content library, you can add an ISO image to deploy a VM to a private cloud cluster. 

1. From the vSphere Client, select **Menu** > **Content Libraries**.

1. Right-click the content library you want to use for the new ISO and select **Import Item**.

1. Import a library item for the Source by doing one of the following, and then select **Import**:
   1. Select URL and provide a URL to download an ISO.

   1. Select **Local File** to upload from your local system.

   > [!TIP]
   > Optional, you can define a custom item name and notes for the Destination.

1. Open the library and select the **Other Types** tab to verify that your ISO was uploaded successfully.


## Deploy a VM to a private cloud cluster

1. From the vSphere Client, select **Menu** > **Hosts and Clusters**.

1. In the left panel, expand the tree and select a cluster.

1. Select **Actions** > **New Virtual Machine**.

1. Go through the wizard and modify the settings you want.

1. Select **New CD/DVD Drive** > **Client Device** > **Content Library ISO File**.

1. Select the ISO uploaded in the previous section and then select **OK**.

1. Select the **Connect** check box so the ISO is mounted at power-on time.

1. Select **New Network** > **Select dropdown** > **Browse**.

1. Select the **logical switch (segment)** and select **OK**.

1. Modify any other hardware settings and select **Next**.

1. Verify the settings and select **Finish**.


## Next steps

Now that you've created a content library to deploy VMs in Azure VMware Solution, you may want to learn about:

- [Migrating VM workloads to your private cloud](configure-vmware-hcx.md)
- [Integrating Azure native services in Azure VMware Solution](integrate-azure-native-services.md)

<!-- LINKS - external-->

<!-- LINKS - internal -->
