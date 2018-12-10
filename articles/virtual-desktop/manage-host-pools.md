---
title: Create a host pool for Windows Virtual Desktop - Azure
description: How to create a host pool for Windows Virtual Desktop.
services: virtual-desktop
author: Heidilohr

ms.service: virtual-desktop
ms.topic: tutorial
ms.date: 10/25/2018
ms.author: helohr
---
# Tutorial: Create a host pool for Windows Virtual Desktop (Preview)

After you've created a tenant, you'll need to create a host pool for your Windows Virtual Desktop environment's virtual machines. Follow this tutorial to do just that with [Azure Marketplace](https://azuremarketplace.microsoft.com/marketplace/).

Windows Virtual Desktop Marketplace offerings are hidden by default. You must send your subscription ID to Microsoft to whitelist your subscription before you can complete this section’s instructions.

In this tutorial, learn how to:

> [!div class="checklist"]
> * Provision a host pool.
> * Create virtual machines for a host pool.

## Create a host pool with Azure Marketplace

To run the Azure Marketplace offering to provision a new host pool:

1. Sign in to the tenant’s Azure subscription where you want to create the virtual machines for the host pool.
2. Select **+** or **+ Create a resource**.
3. Enter **RDmi** in the Marketplace search window.
4. Select **RDmi: Provision a new host pool - Private Preview (Staged)** and **Create**.
5. On the **RDmi: Provision a new host pool - Private Preview (Staged)** blades, enter the required information based on the following instructions:
    1. For the **Basics** blade:
        1. Enter a unique name for the host pool in the RDmi tenant.
        2. Enter the broker URL.
        3. Select **Create new** and provide a name for the Resource group.
        4. Select the **Location** of the Active Directory server.
    2. For the **Configure virtual machines** blade:
        1. Either accept the defaults or customize the number and size of the VMs.
    3. For the **Virtual machine settings** blade:
        1. Enter the URL for the VM image you created for automated deployment.
        2. Select either **HDD** or **SSD**.
        3. Enter the user principal name and password for the admin account that will join the VMs to the Active Directory domain.
        4. Enter the storage account where the VHD image is located.
        5. Select the **Virtual network** and **subnet** of the Active Directory server.
    4. For the **RDmi tenant information** blade:
        1. Enter the name of the RDmi tenant under which this host pool will be created.
        2. Enter the user principal name and password for the admin account with either RDS Owner or RDS Contributor roles on the RDmi tenant.
    5. For the **Summary** blade:
        1. Review the information on the **Summary** blade. If you need to change something, go back to the appropriate blade and make your change before continuing. If everything looks correct, select **OK**.
    6. For the **Buy** blade:
        1. Select **Create**.

>[!NOTE]
>Depending on how many VMs you’re creating, this process can take an hour or more to complete.

## Next steps

Now that you've made a host pool, it's time to populate it with RemoteApps. To learn more about how to manage apps in Windows Virtual Desktop, see the Manage app groups tutorial.

> [!div class="nextstepaction"]
> [Manage app groups tutorial](./manage-app-groups.md)