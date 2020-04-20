---
title: Windows Virtual Desktop host pool Azure portal - Azure
description: How to create a Windows Virtual Desktop host pool by using the Azure portal.
services: virtual-desktop
author: Heidilohr

ms.service: virtual-desktop
ms.topic: tutorial
ms.date: 04/30/2020
ms.author: helohr
manager: lizross
---
# Tutorial: Create a host pool with the Azure portal

>[!IMPORTANT]
>This content applies to the Spring 2020 update with Azure Resource Manager Windows Virtual Desktop objects. If you're using the Windows Virtual Desktop Fall 2019 release without Azure Resource Manager objects, see [this article](./virtual-desktop-fall-2019/create-host-pools-azure-marketplace-2019.md).
>
> The Windows Virtual Desktop Spring 2020 update is currently in public preview. This preview version is provided without a service level agreement, and we don't recommend using it for production workloads. Certain features might not be supported or might have constrained capabilities. 
> For more information, see [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).

Host pools are a collection of one or more identical virtual machines (VMs) within Windows Virtual Desktop environments. Each host pool can contain an app group that users can interact with as they would on a physical desktop.

This article will walk you through the setup process for creating a host pool for a Windows Virtual Desktop environment through the Azure portal. This method provides a browser-based user interface to create a host pool in Windows Virtual Desktop, create a resource group with VMs in an Azure subscription, join those VMs to the Azure Active Directory (AD) domain, and register the VMs with Windows Virtual Desktop.

## Prerequisites

You'll need to enter the following parameters to create a host pool:

- The VM image name
- VM configuration
- Domain and network properties
- Windows Virtual Desktop host pool properties

You'll also need to know the following things:

- Where the source of the image you want to use is. Is it from Azure Gallery or is it a custom image?
- Your domain join credentials
- Your Windows Virtual Desktop credentials

When you create a Windows Virtual Desktop host pool with the Azure Resource Manager template, you can create a virtual machine from the Azure gallery, a managed image, or an unmanaged image. To learn more about how to create VM images, see [Prepare a Windows VHD or VHDX to upload to Azure](../virtual-machines/windows/prepare-for-upload-vhd-image.md) and [Create a managed image of a generalized VM in Azure](../virtual-machines/windows/capture-image-resource.md).

If you don't have an Azure subscription already, make sure to [create an account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you start following these instrucitons.

## Begin the host pool setup process

To start creating your new host pool:

1. Sign in to the Azure portal at [https://portal.azure.com](https://portal.azure.com/).

2. Enter **Windows Virtual Desktop** into the search bar, then find and select **Windows Virtual Desktop** under Services.

3. In the **Windows Virtual Desktop** overview page, select **Create a host pool**.

     ![](media/67042b3de8d0c8a12703ae52aa080eba.png)

4. In the **Basics** tab, select the correct subscription under Project details.

5. Either select **Create new** to make a new resource group or select an existing resource group from the drop-down menu.

6. Enter a unique name for your host pool.

7. Select the region where you want to create the host pool.
   
   The Azure geography associated with the regions you selected is where the metadata for this host pool and its related objects will be stored. Make sure you choose regions inside the geography you want the service metadata to be stored in.

     ![](media/9fed31874b179b301e9f911b56f80c9d.png)

8.  Under Host pool type, select whether your host pool will be **Personal** or **Pooled**.

    - If you choose **Personal**, then select either **Automatic** or **Direct** in the Assignment Type field.

      ![](media/9dcc1833c035dde6d21ab43d17b6e8c8.png)

      ![](media/ba98daebb92a86daf6a999aa17739159.png)

9.  If you choose **Pooled**, enter the following information:

     - For **Max session limit**, enter the maximum number of users you want load-balanced to a single session host.
     - For **Load balancing algorithm**, choose either breadth-first or depth-first, based on your usage pattern.

       ![](media/9dcc1833c035dde6d21ab43d17b6e8c8.png)

       ![](media/48e4ad7fb3b467d66708dae1a5e95673.png)

10.  Select **Next: VM details**.

11. If you've already created virtual machines and want to use them with the new host pool, select **No**. If you want to create new virtual machines and register them to the new host pool, select **Yes**.

    ![](media/3bd219172ca1939e35f9a9c034d43210.png)

Now that you've completed the first part, let's move on to the next part of the setup process where we create the VM.

## Virtual machine details

Now that we're through the first part, you'll have to set up your VM.

To set up your virtual machine within the host pool setup process:

1. Under Resource Group, choose the resource group where you want to create the virtual machines. This can be a different resource group than the one you used for the host pool.

     ![](media/0a120ff4c3259d984bd0a5d5acff9a15.png)

2. Choose the **Virtual machine region** where you want to create the virtual machines. They can be the same or different from the region you selected for the host pool.

3. Next, choose the size of the virtual machine you want to create. You can either keep the default size as-is or select **Change Size** to change the size. If you select **Change Size**, in the window that appears, choose the size of the virtual machine suitable for your workload.

4. Under Number of VMs, provide the number of VMs you want to create for your host pool.

    >[!NOTE]
    >The setup process will only create VMs and APIs within the established Azure VM and API limits and doesn't check your subscription quota. This means you can only create up to 400 VMs while setting up your host pool in the Azure portal. Each VM setup process creates four objects. You can add more VMs after you complete the setup process and create the host pool. 

5. After that, provide a **Name prefix** to name the virtual machines the setup process creates. The suffix will be `-` with numbers starting from 0.

6. Next, choose the image that needs to be used to create the virtual machine. You can choose either **Gallery** or **Storage Blob**.

    ![A screenshot of a cell phone Description automatically generated](media/b3abdd5dd0e8ed72aeefd27c8e107204.png)

    - If you choose **Gallery**, select one of the recommended images from the drop-down menu:

      - Windows 10 Enterprise multi-session, Version 1909 + Office 365 ProPlus – Gen 1
      - Windows 10 Enterprise multi-session, Version 1909 – Gen 1
      - Windows Server 2019 Datacenter - Gen1

     If you don't see the image you want, select **Browse all images and disks**, which lets you select either another image in your gallery or an image provided by Microsoft and other publishers.

     ![](media/74ac56b14d0548d7c7242da20b1e40df.png)

     You can also go to **My Disks** and choose a custom image you've already uploaded.

     ![](media/752295d9e19a18b2d39d24394003975c.png)

    - If you choose **Storage Blob**, you can leverage your own image build through Hyper-V or on an Azure VM. All you have to do is enter the location of the image in the storage blob as a URI.

     ![](media/c7d19857ddc861a96cbc1cd46a1deaa6.png)

7. Choose what kind of OS disks you want your VMs to use: Standard SSD, Premium SSD, or Standard HDD.

8. Under **Network and security**, select the virtual network and subnet where you want to put the virtual machines you create. Make sure the virtual network can connect to the domain controller, since you'll need to join the virtual machines inside the virtual network to the domain. Next, select whether or not you want a public IP for the virtual machines. We recommend you select **No**, because a private IP is more secure.

    ![](media/851f2e3718c943b17edcb39beff47bff.png)

9. Select what kind of security group you want: **Basic**, **Advanced**, or **None**.

    If you select **Basic**, you'll have to select whether you want any inbound port open. If you select **Yes**, choose from the list of standard ports to allow inbound connections to.

    >[!NOTE]
    >For greater security, we recommend that you don't open public inbound ports.

    ![](media/66b5b1f21b4af201174d7e889a13dd05.png)
    
    If you choose **Advanced**, select an existing network security group that you've already configured.

    ![](media/c84901c0ac44f863f629972c5ba35ee3.png)

10. After that, select whether you want the virtual machines to be joined to a specific domain and organizational unit. If you choose **Yes**, specify the domain to join. You can also add a specific organizational unit you want the virtual machines to be under.

    ![](media/a5973f94dfa3ada35da33148c9262d0f.png)

11. Under Administrator account, enter the credentials for the Active Directory Domain admin of the virtual network you selected.

    ![](media/64e194ffd16961aa7faf30615809bbdb.png)

    This brings you to the end of the virtual machine configuration for the host pool.

12. Select **Workspace**.

## Workspace information

The host pool setup process creates a desktop application group by default. For the host pool to work as intended, you'll need to publish this app group to users or user groups, and you must register the app group to a workspace. 

To register the desktop app group to a workspace:

1. Select **Yes**.
   
   ![](media/c075467481cddb8cdee6c157d4e063a7.png)

   If you select **No**, you can register the app group later.

2. Next, choose whether you want to create a new workspace or select from existing workspaces. Only workspaces created in the same location as the host pool will be allowed to register the app group to.
   
   ![](media/c94b23a57591ce77731311179f697db8.png)

3. Optionally, you can select **Tags**.

    Here you can add tags so you can group the objects with metadata to make things easier for your admins.

4. When you're done, select **Review + create**.

5. Review the information about your deployment to make sure everything looks correct. When you're done, select **Create**. This starts the deployment process, which creates the following objects:

     - Your new host pool.
     - A desktop app group.
     - A workspace, if you chose to create it.
     - If you chose to register the desktop app group, the registration will be complete
     - Virtual machines, if you chose to create them, which are joined to the domain and registered with the new host pool.
     - A download link for an Azure Resource Management template based on your configuration.

After that, you're all done!

## Next steps

Now that you've made your host pool, you can populate it with RemoteApp programs. To learn more about how to manage apps in Windows Virtual Desktop, head to our next tutorial:

> [!div class="nextstepaction"]
> [Manage app groups tutorial](./manage-app-groups.md)
