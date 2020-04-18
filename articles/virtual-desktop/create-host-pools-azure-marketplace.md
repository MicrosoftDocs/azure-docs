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

Host pools are a collection of one or more identical virtual machines within
Windows Virtual Desktop tenant environments. Each host pool can contain an app
group that users can interact with as they would on a physical desktop.

Follow this section's instructions to create a host pool for a Windows Virtual
Desktop tenant through the Azure portal. This method provides a browser-based
user interface to create a host pool in Windows Virtual Desktop, create a
resource group with VMs in an Azure subscription, join those VMs to the AD
domain, and register the VMs with Windows Virtual Desktop.

## Prerequisites

You'll need to enter the following parameters to successfully create a host pool:

- The virtual machine (VM) image name
- VM configuration
- Domain and network properties
- Windows Virtual Desktop host pool properties

You'll also need to know the following things:

- Where the source of the image you want to use is. Is it from Azure Gallery or is it a custom image?
- Your domain join credentials
- Your Windows Virtual Desktop credentials

When you create a Windows Virtual Desktop host pool with the Azure Resource Manager template, you can create a virtual machine from the Azure gallery, a managed image, or an unmanaged image. To learn more about how to create VM images, se [Prepare a Windows VHD or VHDX to upload to Azure](../virtual-machines/windows prepare-for-upload-vhd-image.md) and [Create a managed image of a generalized VM in Azure](https://docs.microsoft.com/en-us/azure/virtual-machines/windows/capture-image-resource).

If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.

## Create a host pool

1. Sign in to the Azure portal at [https://portal.azure.com](https://portal.azure.com/).

2. Enter **Windows Virtual Desktop** into the search bar, then find select **Windows Virtual Desktop** under Services.

3. In the **Windows Virtual Desktop** overview page, select **Create a host pool**.

     ![](media/67042b3de8d0c8a12703ae52aa080eba.png)

4. In the **Basics** tab, select the correct subscription under Project details.

5. Either select **Create new** to make a new resource group or select an existing resource group from the drop-down menu.

6. Enter a unique name for your host pool.

7. Select the region where you want to create the host pool. The Azure geography associated with the regions you selected is where the metadata for the host pool and related objects will be stored. So, ensure you are picking regions inside the geography you want the service metadata to be stored in.

     ![](media/9fed31874b179b301e9f911b56f80c9d.png)

8. Under Host pool type, select whether your host pool will be **Personal** or **Pooled**.

    -  If you choose Personal, then select either **Automatic** or **Direct** in the Assignment Type field.

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

## Virtual Machine details

1. Under **Resource Group**, choose the resource group where you want to create the virtual machines. They can be a different resource group than the one you used for the host pool.

     ![](media/0a120ff4c3259d984bd0a5d5acff9a15.png)

2. Choose the **Virtual machine region** where you want to create the virtual machines. They can be the same or different from the region you selected for the host pool.

3. Next choose the size of the virtual machine you want to create. A default size is already chosen for you, to change it click on **Change Size**. In the pop-up window, choose he size of the virtual machine suitable for your workload.

4. Under **Number of VMs** provide the number of virtual machines you want created in this workflow.

    >[!NOTE]
    >Keep in mind there are Azure subscription and API limits. Choose a moderate number of virtual machines. You can add more once the host pool is created. The wizard will allow upto 400 VMs to be created in 1 run. Keep in mind that the wizard does not check for your subscription quota. Please refer to the Azure subscription and Resource Group limits before creating VMs. Each VM creation creates 4 objects. So accordingly, add the number of VMs you are allowed to create in the resource group.

5.  Next, provide the **Name prefix** the wizard will use to name the virtual machines that are being created. The suffix will be ‘-‘ with numbers starting from 0.

2.  Next, choose the image that needs to be used to create the virtual machine. You have 2 choices, **Gallery** and **Storage Blob**.

    ![A screenshot of a cell phone Description automatically generated](media/b3abdd5dd0e8ed72aeefd27c8e107204.png)

    If you choose **Gallery**, select from the drop-down of our recommended images:

      - Windows 10 Enterprise multi-session, Version 1909 + Office 365 ProPlus – Gen 1
      - Windows 10 Enterprise multi-session, Version 1909 – Gen 1
      - Windows Server 2019 Datacenter - Gen1

    If you don't see the choice you want, select **Browse all images and disks**.

      - You can select another gallery image to use up-to-date images provided by Microsoft and other publishers

    ![](media/74ac56b14d0548d7c7242da20b1e40df.png)

    You can also go to **My Disks** and choose a custom image you've already uploaded.

    ![](media/752295d9e19a18b2d39d24394003975c.png)

    If you choose **Storage Blob**, you can leverage your own image build through Hyper-V or on an Azure VM. For the same, enter the location of the image in the storage blob as a URI.

    ![](media/c7d19857ddc861a96cbc1cd46a1deaa6.png)

1.  Choose what kind of OS disks you want your VMs to use: Standard SSD, Premium SSD, or Standard HDD.

2.  Under **Network and security**, select the virtual network and subnet where you want the virtual machines to be created in. Ensure that the virtual network can connect to the domain controller, since the virtual machines inside the virtual network need to joined to the domain. Then select if you  want a public IP for the virtual machines or not. Recommendation is to default to No, to enhance security on your VM.

    ![](media/851f2e3718c943b17edcb39beff47bff.png)

1.  Select what kind of **network security group** you want added to the virtual machines – *None, Basic and Advanced*.

    If you select *Basic*, then you select whether you want any inbound port to be open. If you select yes, then you can choose from the list of standard ports to allow inbound connections to.

    >[!NOTE]
    >For greater security, we recommend that you don't open an public inbound ports.

    ![](media/66b5b1f21b4af201174d7e889a13dd05.png)

>   If you choose *Advanced*, select an existing network security group that you
>   have already configured.

![](media/c84901c0ac44f863f629972c5ba35ee3.png)

1.  Next, select whether you want the virtual machines to be joined to a
    specific domain and organizational unit. If you choose yes, then input the
    domain to join. You can also add particular organizational unit you want the
    virtual machines to be under.

![](media/a5973f94dfa3ada35da33148c9262d0f.png)

1.  Under **Administrator account**, provide a username, and password for the
    Active Directory domain admin, configured in the virtual network you
    selected.

![](media/64e194ffd16961aa7faf30615809bbdb.png)

>   This brings you to the end of the virtual machine configuration for the host
>   pool.

>   Select **Workspace**

**Workspace information**

As part of the host pool creation wizard, a desktop application group will be
created by default. For you to use it, you will need to publish the app group to
users or user groups and you have to register the app group to a workspace. In
this step, you can choose to register the desktop app group to a workspace as
part of the create host pool workflow.

1.  If you want to register the desktop app group to a workspace, choose Yes. If
    you want to register the app group at a later time, choose No.

    ![](media/c075467481cddb8cdee6c157d4e063a7.png)

1.  If yes, you can then create a new workspace or select from existing
    workspaces. Only workspaces created in the same location as the host pool
    will be allowed to register the app group to.

     ![](media/c94b23a57591ce77731311179f697db8.png)

>   Then click on **Tags**. This can be skipped and you can choose to select
>   **Review + create.**

>   Here you can add tags, if you want to group the objects for better
>   administration.

>   Then select **Review + create** 

>   The wizard will validate all your input. *This validation will not handle
>   incorrect password and architecture mistakes.*

>   Once validation is completed click **Create**. Optionally you can download
>   the ARM template used by the wizard.

>   When the deployment completes, these are the following objects that will be
>   created:

-   Host pool

-   Desktop app group

-   If you chose to create a workspace, workspace will be created

-   If you chose to register the desktop app group, the registration will be
    complete

-   If you chose the create virtual machines, all the virtual machines will be
    created, joined to the domain and registered with the newly created host
    pool.


## Next steps

You've made a host pool and assigned users to access its desktop. You can populate your host pool with RemoteApp programs. To learn more about how to manage apps in Windows Virtual Desktop, see this tutorial:

> [!div class="nextstepaction"]
> [Manage app groups tutorial](./manage-app-groups.md)
