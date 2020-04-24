---
title: Manage app groups for Windows Virtual Desktop portal - Azure
description: How to manage Windows Virtual Desktop app groups with the Azure portal.
services: virtual-desktop
author: Heidilohr

ms.service: virtual-desktop
ms.topic: tutorial
ms.date: 04/30/2020
ms.author: helohr
manager: lizross
---
# Tutorial: Manage app groups with the Azure portal

>[!IMPORTANT]
>This content applies to the Spring 2020 update with Azure Resource Manager Windows Virtual Desktop objects. If you're using the Windows Virtual Desktop Fall 2019 release without Azure Resource Manager objects, see [this article](./virtual-desktop-fall-2019/manage-app-groups-2019.md).
>
> The Windows Virtual Desktop Spring 2020 update is currently in public preview. This preview version is provided without a service level agreement, and we don't recommend using it for production workloads. Certain features might not be supported or might have constrained capabilities. 
> For more information, see [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).

The default app group created for a new Windows Virtual Desktop host pool also publishes the full desktop. In addition, you can create one or more RemoteApp application groups for the host pool. Follow this tutorial to create a RemoteApp app group and publish individual Start menu apps.

In this tutorial, learn how to:

> [!div class="checklist"]
> * Create a RemoteApp group.
> * Grant access to RemoteApp programs.

## Create a RemoteApp group

If you've already created a host pool and session host VMs using the Azure
portal or PowerShell, you can add virtual machines from the Azure portal with
the following process:

1.  Sign in to the [Azure portal](https://portal.azure.com/).

2.  Search for and select **Windows Virtual Desktop**.

3.  Select **Application Groups** in the menu on the left side of the page, then select **+ Add**.

4.  Select the subscription group and resource group you want to create the app group for. You can also choose to create a new resource group instead of selecting an existing one.

5.  Select the host pool that will be associated with the application group.

    >[!NOTE]
    >You must select the host pool associated with the application group. App groups have apps or desktops that are served from a session host and session hosts are part of host pools. So, an app group needs to be associated with a host pool during creation.

     ![](media/fa2a6efddb0d220c6bfdbf2c86194406.png)

6. If you want to add virtual machines to your host pool, select **Host pools** in the menu on the left side of the screen. Next, select the name of the host pool you want to add virtual machines to.
   
   After that, select **Application groups** from the menu on the left side of the screen, then select **+ Add**.

    ![](media/bd0b037abe969ff33b219949432ab341.png)

   Finally, select the subscription group and resource group you want to create the app group in. You can choose to create a new resource group instead of selecting an existing one.

     >[!NOTE]
     >With this approach, the host pool that is related to the application group is already selected since you navigated from the host pool context.

![](media/522f3865c86b16d51c570621b4353386.png)

7. Select **RemoteApp** under **Application group type** and provide a name.

![](media/dacceac6fc2408bdb2fbe521d530a092.png)

1.  Select **Assignments**.

![](media/35e982bc311922d99943d955441908f5.png)

1.  To publish individual users or user groups to the app group, select **+Add Azure AD users or user groups**.

2.  When the Azure Active Directory user selector opens, select single or multiple users and user groups.

![](media/ad4dcb32deebf98ea07e6b2d29deb934.png)

1.  Select **Select**.

2.  Select **Applications**, then select **+Add applications**.

3.  To add an application from the start menu:

- For *Application source*, choose Start menu and then choose the application from the list under *Application*.

![](media/ae82f483a6bf5c6abfc80fae3e9ceafd.png)

- Add a *Display name*. This will be the name shown to the user on their client.

- Leave the other options as is and click on **Save**.

4. To add an application from specific file path:

1. For *Application source*, choose File path.

2. Enter the path to the application on the session host, registered with the associated host pool.

3. Enter all other details of the application like *Application name, Display name, Icon path and Icon index*.

4.  Click on **Save**.

![](media/3f5d93ee4c09d2681ea7dd540b8e71d5.png)

Repeat this for every application you want added to the application group.

1.  Click on Workspace. As part of the application group creation wizard, you can hoose to register the app group to a workspace.

2.  If you want to register the app group to a workspace, choose Yes. If you want to register the app group at a later time, choose No.

![](media/35ad245ea9f0c7ad0672d4990ef72464.png)

1.  If yes, you can then create a new workspace or select from existing workspaces. Only workspaces created in the same location as the host pool will be allowed to register the app group to. Also if you have previously registered another app group (from the same host pool) to a workspace, it will be selected and you cannot edit it. All app groups from a host pool must be registered to the same workspace.

![](media/1b64e643f42d458b1245087ccc4ada9f.png)

Then click on **Tags**. This can be skipped and you can choose to select **Review + create.**

Then select **Review + create** 

validate all your input.

Once validation is completed click **Create**. Optionally you can download the ARM template used by the wizard.

 When the deployment completes, these are the following will be completed:

-   The RemoteApp app group

-   Applications added to the app group

-   App group published to the selected users and user groups.

-   If you chose to create a workspace, workspace will be created

-   If you chose to register the app group, the registration will be complete

## Next steps

In this tutorial, you learned how to create an app group, populate it with RemoteApp programs, and assign users to the app group. To learn how to create a validation host pool, see the following tutorial. You can use a validation host pool to monitor service updates before rolling them out to your production environment.

> [!div class="nextstepaction"]
> [Create a host pool to validate service updates](./create-validation-host-pool.md)
