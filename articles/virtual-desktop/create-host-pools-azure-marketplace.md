---
title: Create a Windows Virtual Desktop host pool with Azure Marketplace - Azure
description: How to create a Windows Virtual Desktop host pool with Azure Marketplace.
services: virtual-desktop
author: Heidilohr

ms.service: virtual-desktop
ms.topic: tutorial
ms.date: 11/21/2018
ms.author: helohr
---
# Tutorial: Create a host pool with Azure Marketplace (Preview)

Host pools are a collection of one or more identical virtual machines within Windows Virtual Desktop tenant environments. Each host pool can contain an app group that users can interact with as they would on a physical desktop.

Follow the steps in this article to create a host pool within a Windows Virtual Desktop tenant using a Microsoft Azure Marketplace offering. This includes creating a host pool in Windows Virtual Desktop, creating a resource group with VMs in an Azure subscription, joining those VMs to the Active Directory domain, and registering the VMs with Windows Virtual Desktop.

You need the Windows Virtual Desktop PowerShell module to follow the instructions in this article. Install the Windows Virtual Desktop PowerShell module from the PowerShell Gallery by running this cmdlet:

```powershell
PS C:\> Install-Module WindowsVirtualDesktop
```

## Copy Windows 10 Enterprise multi-session images to your storage account

The instructions in this section will show you how to create a storage account, create a container within the storage account, and then add the provided Windows 10 Enterprise multi-session image for your session's host pool.

To use the provided Windows 10 Enterprise multi-session image for your session host pool:

1. Sign in to the tenant’s Azure subscription where you want to copy the Windows 10 Enterprise multi-session image.
2. Select the **+** or **+ Create a resource** icon in the left navigation pane.
3. Search for and select **Storage account – blob, file, table, queue**.
4. Select **Create**.
5. Enter a unique value for **Name** and select the same **Location** as the virtual network you want to use.
6. Select the appropriate **Subscription**, then select the **Create new** option under **Resource group** and enter a resource group name.
7. Select **Create**.
8. In the Azure portal, navigate to the storage account you just created.
9. In the Storage account view, select **Blobs**.
10. In the top ribbon, select **+ Container**, enter a **Name**, select **Private** as the Public access level, then select **OK**.
11. In the container you created, select **Properties**.
12. Copy down the URL field, which should be in the format of `https://<storageaccountname>.blob.core.windows.net/<containername>/`. For example, `https://rdsstorage.blob.core.windows.net/vhds/`.
13. Navigate back to the storage account you created.
14. Select **Access keys** on the left-hand pane and copy down the "key1" key for your records.
15. [Download and install the latest stable version of AzCopy](https://aka.ms/downloadazcopy) if you haven't already.
16. Run the following AzCopy command:

    ```azcopy
    AzCopy /Source:”https://rdmipreview.blob.core.windows.net/vhds?< Windows-10-Enterprise-multi-session-SaS-Key>” /Dest:<url-to-container> /DestKey:<your-key> /S
    ```
    
    Replace `<url-to-container>` with the URL from step 4, `<Windows-10-Enterprise-multi-session-SaS-Key>` with the Windows 10 Enterprise multi-session account key you should have received during the initial whitelisting, and `<your-key>` with the key from step 5.

Now that you have the Windows 10 Enterprise multi-session.vhd files in your storage account, you can carry out the instructions in the following section.

### Run the Azure Marketplace offering to provision a new host pool

The Windows Virtual Desktop Marketplace offerings are hidden by default. You must send your subscription ID to Microsoft to whitelist your subscription before you can complete this section’s instructions.

To run the Azure Marketplace offering to provision a new host pool:

1. Sign in to the tenant’s Azure subscription where you want to create the virtual machines for the host pool.
2. Select **+** or **+ Create a resource**.
3. Enter **Windows Virtual Desktop** in the Marketplace search window.
4. Select **Windows Virtual Desktop: Provision a host pool (Staged)**, then select **Create**.
5. On the Windows **Virtual Desktop: Provision a host pool (Staged)** blades, go to the **Basics** blade.
6. Enter a name for the host pool that’s unique within the Windows Virtual Desktop tenant.
7. Enter the broker URL.
8. Select **Create new** and provide a name for the Resource group.
9. For **Location**, select the Active Directory server's location.
10. Go to the **Configure virtual machines** blade.
11. Either accept the defaults or customize the number and size of the VMs.
12. Go to the **Virtual machine settings** blade.
13. Enter the URL for the VM image you created for automated deployment.
14. Select either **HDD** or **SSD**.
15. Enter the user principal name and password for the admin account that will join the VMs to the Active Directory domain.
16. Enter the storage account where the VHD image is located.
17. Select the virtual network and subnet of the Active Directory server.
18. Go to the **Windows Virtual Desktop tenant information** blade.
19. Enter the name of the Windows Virtual Desktop tenant under which this host pool will be created.
20. Enter the user principal name and password for the admin account that has been assigned either RDS Owner or RDS Contributor role on the Windows Virtual Desktop tenant.
21. Go to the **Summary** blade and review the setup information. If you need to change something, go back to the appropriate blade and make your change before continuing. If the information looks correct, select **OK**.
22. Go to the **Buy** blade.
23. Select **Create**.

Depending on how many VMs you’re creating, this process can take an hour or more to complete.

## Next steps

Now that you've made a host pool, it's time to populate it with RemoteApps. To learn more about how to manage apps in Windows Virtual Desktop, see the Manage app groups tutorial.

> [!div class="nextstepaction"]
> [Manage app groups tutorial](./manage-app-groups.md)