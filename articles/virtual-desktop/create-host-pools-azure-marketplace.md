---
title: Create a Windows Virtual Desktop Preview host pool with Azure Marketplace  - Azure
description: How to create a Windows Virtual Desktop Preview host pool with Azure Marketplace.
services: virtual-desktop
author: Heidilohr

ms.service: virtual-desktop
ms.topic: tutorial
ms.date: 04/05/2019
ms.author: helohr
---
# Tutorial: Create a host pool with Azure Marketplace

Host pools are a collection of one or more identical virtual machines within Windows Virtual Desktop Preview tenant environments. Each host pool can contain an app group that users can interact with as they would on a physical desktop.

This article describes how to create a host pool within a Windows Virtual Desktop tenant using a Microsoft Azure Marketplace offering. This includes creating a host pool in Windows Virtual Desktop, creating a resource group with VMs in an Azure subscription, joining those VMs to the Active Directory domain, and registering the VMs with Windows Virtual Desktop.

Before you begin, [download and import the Windows Virtual Desktop PowerShell module](https://docs.microsoft.com/powershell/windows-virtual-desktop/overview) to use in your PowerShell session if you haven't already.

## Sign in to Azure

Sign in to the Azure portal at <https://portal.azure.com>.

## Run the Azure Marketplace offering to provision a new host pool

To run the Azure Marketplace offering to provision a new host pool:

1. Select **+** or **+ Create a resource**.
2. Enter **Windows Virtual Desktop** in the Marketplace search window.
3. Select **Windows Virtual Desktop - Provision a host pool**, then select **Create**.

Follow the guidance to enter the information for the appropriate blades.

### Basics

Here's what you do for the Basics blade:

1. Enter a name for the host pool that’s unique within the Windows Virtual Desktop tenant.
2. Select the appropriate option for personal desktop. If you select **Yes**, each user that connects to this host pool will be permanently assigned to a virtual machine.
3. Enter a comma-separated list of users who can sign in to the Windows Virtual Desktop clients and access a desktop after the Azure Marketplace offering completes. For example, if you'd like to assign user1@contoso.com and user2@contoso.com access, enter "user1@contoso.com,user2@contoso.com."
4. Select **Create new** and provide a name for the new resource group.
5. For **Location**, select the same location as the virtual network that has connectivity to the Active Directory server.
6. Select **OK**.

### Configure virtual machines

For the Configure virtual machines blade:

1. Either accept the defaults or customize the number and size of the VMs.
2. Enter a prefix for the names of the virtual machines. For example, if you enter the name "prefix," the virtual machines will be called "prefix-0," "prefix-1," and so on.
3. Select **OK**.

### Virtual machine settings

For the Virtual machine setting blade:

1. Select the **Image source** and enter the appropriate information for how to find it and how to store it. If you choose not to use managed disks, select the storage account containing the .vhd file.
2. Enter the user principal name and password for the domain account that will join the VMs to the Active Directory domain. This same username and password will be created on the virtual machines as a local account. You can reset these local accounts later.
3. Select the virtual network that has connectivity to the Active Directory server, then choose a subnet to host the virtual machines.
4. Select **OK**.

### Windows Virtual Desktop Preview tenant information

For the Windows Virtual Desktop tenant information blade:

1. Enter the **Windows Virtual Desktop tenant group name** for the tenant group that contains your tenant. If you don't have a specific tenant group name planned, leave it as the default.
2. Enter the **Windows Virtual Desktop tenant name** for the tenant you'll be creating this host pool in.
3. Specify the type of credentials you want to use to authenticate as the Windows Virtual Desktop tenant RDS Owner. If you completed the previous tutorial, select **Service principal**. You will notice that the **Azure AD tenant ID** associated with the service principal is required.
4. Enter either the credentials for the tenant admin account. Only service principals with a password credential are supported.
5. Select **OK**.

## Complete setup and create the virtual machine

For the last two blades:

1. In the **Summary** blade, review the setup information. If you need to change something, go back to the appropriate blade and make your change before continuing. If the information looks right, select **OK**.
2. In the **Buy** blade, review the additional information about your purchase from Azure Marketplace.
3. Select **Create** to deploy your host pool.

Depending on how many VMs you’re creating, this process can take 30 minutes or more to complete.

## (Optional) Assign additional users to the desktop application group

After the Azure Marketplace offering completes, you can assign additional users to the desktop application group before you start testing the full session desktops on your virtual machines. If you've already added default users in the Azure Marketplace offering and don't want to add more, you can skip this section.

To assign users to the desktop application group, you must first open a PowerShell window. After that, you'll need to enter the following two cmdlets.

Run the following cmdlet to sign in to the Windows Virtual Desktop environment:

```powershell
Add-RdsAccount -DeploymentUrl "https://rdbroker.wvd.microsoft.com"
```

Set the context to the Windows Virtual Desktop tenant group you specified in the Azure Marketplace offering with the following cmdlet. If you left the Windows Virtual Desktop tenant group value as the default value in the Azure Marketplace offering, you can skip this step.

```powershell
Set-RdsContext -TenantGroupName <tenantgroupname>
```

Once you've done those two things, you can add users to the desktop application group with this cmdlet:

```powershell
Add-RdsAppGroupUser <tenantname> <hostpoolname> "Desktop Application Group" -UserPrincipalName <userupn>
```

The user’s UPN should match the user’s identity in Azure Active Directory (for example, user1@contoso.com). If you want to add multiple users, you must run this cmdlet for each user.

After you've completed these steps, users added to the desktop application group can sign in to Windows Virtual Desktop with supported Remote Desktop clients and see a resource for a session desktop.

Here are the current supported clients:

- [Remote Desktop client for Windows 7 and Windows 10](connect-windows-7-and-10.md)
- [Windows Virtual Desktop web client](connect-web.md)

>[!IMPORTANT]
>To help secure your Windows Virtual Desktop environment in Azure, we recommend you don't open inbound port 3389 on your VMs. Windows Virtual Desktop doesn't require an open inbound port 3389 for users to access the host pool's VMs. If you must open port 3389 for troubleshooting purposes, we recommend you use [just-in-time VM access](https://docs.microsoft.com/en-us/azure/security-center/security-center-just-in-time).

## Next steps

Now that you've made a host pool and assigned users to access its desktop, you can also populate your host pool with RemoteApps. To learn more about how to manage apps in Windows Virtual Desktop, see the Manage app groups tutorial.

> [!div class="nextstepaction"]
> [Manage app groups tutorial](./manage-app-groups.md)
