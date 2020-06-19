---
title: Windows Virtual Desktop host pool Azure Marketplace - Azure
description: How to create a Windows Virtual Desktop host pool by using the Azure Marketplace.
services: virtual-desktop
author: Heidilohr

ms.service: virtual-desktop
ms.topic: tutorial
ms.date: 03/30/2020
ms.author: helohr
manager: lizross
---
# Tutorial: Create a host pool by using the Azure Marketplace

>[!IMPORTANT]
>This content applies to the Fall 2019 release that doesn't support Azure Resource Manager Windows Virtual Desktop objects. If you're trying to manage Azure Resource Manager Windows Virtual Desktop objects introduced in the Spring 2020 update, see [this article](../create-host-pools-azure-marketplace.md).

In this tutorial, you'll learn how to create a host pool within a Windows Virtual Desktop tenant by using a Microsoft Azure Marketplace offering.

Host pools are a collection of one or more identical virtual machines within Windows Virtual Desktop tenant environments. Each host pool can contain an app group that users can interact with as they would on a physical desktop.

The tasks in this tutorial include:

> [!div class="checklist"]
>
> * Create a host pool in Windows Virtual Desktop.
> * Create a resource group with VMs in an Azure subscription.
> * Join the VMs to the Active Directory domain.
> * Register the VMs with Windows Virtual Desktop.

## Prerequisites

* A tenant in Virtual Desktop. A previous [tutorial](tenant-setup-azure-active-directory.md) creates a tenant.
* [Windows Virtual Desktop PowerShell module](/powershell/windows-virtual-desktop/overview/).

Once you have this module, run the following cmdlet to sign in to your account:

```powershell
Add-RdsAccount -DeploymentUrl "https://rdbroker.wvd.microsoft.com"
```

## Sign in to Azure

Sign in to the [Azure portal](https://portal.azure.com).

## Run the Azure Marketplace offering to provision a new host pool

To run the Azure Marketplace offering to provision a new host pool:

1. On the Azure portal menu or from the **Home** page, select **Create a resource**.
1. Enter **Windows Virtual Desktop** in the Marketplace search window.
1. Select **Windows Virtual Desktop - Provision a host pool**, and then select **Create**.

After that, follow the instructions in the next section to enter the information for the appropriate tabs.

### Basics

Here's what you do for the **Basics** tab:

1. Select a **Subscription**.
1. For **Resource group**, select **Create new** and provide a name for the new resource group.
1. Select a **Region**.
1. Enter a name for the host pool that's unique within the Windows Virtual Desktop tenant.
1. Select **Desktop type**. If you select **Personal**, each user that connects to this host pool is permanently assigned to a virtual machine.
1. Enter users who can sign in to the Windows Virtual Desktop clients and access a desktop. Use a comma-separated list. For example, if you want to assign `user1@contoso.com` and `user2@contoso.com` access, enter *`user1@contoso.com,user2@contoso.com`*
1. For **Service metadata location**, select the same location as the virtual network that has connectivity to the Active Directory server.

   >[!IMPORTANT]
   >If you're using a pure Azure Active Directory Domain Services (Azure AD DS) and Azure Active Directory (Azure AD) solution, make sure to deploy your host pool in the same region as your Azure AD DS to avoid domain-join and credential errors.

1. Select **Next: Configure virtual machines**.

### Configure virtual machines

For the **Configure virtual machines** tab:

1. Either accept the defaults or customize the number and size of the virtual machines.

    >[!NOTE]
    >If the specific virtual machine size you're looking for doesn't appear in the size selector, that's because we haven't onboarded it to the Azure Marketplace tool yet. To request a size, create a request or upvote an existing request in the [Windows Virtual Desktop UserVoice forum](https://windowsvirtualdesktop.uservoice.com/forums/921118-general).

1. Enter a prefix for the names of the virtual machines. For example, if you enter *prefix*, the virtual machines will be called **prefix-0**, **prefix-1**, and so on.
1. Select **Next: Virtual machine settings**.

### Virtual machine settings

For the **Virtual machine settings** tab:

1. For **Image source**, select the source and enter the appropriate information for how to find it and how to store it. Your options differ for Blob storage, Managed image, and Gallery.

   If you choose not to use managed disks, select the storage account that contains the *.vhd* file.
1. Enter the user principal name and password. This account must be the domain account that will join the virtual machines to the Active Directory domain. This same username and password will be created on the virtual machines as a local account. You can reset these local accounts later.

   >[!NOTE]
   > If you're joining your virtual machines to an Azure AD DS environment, ensure that your domain join user is a member of the [AAD DC Administrators group](../../active-directory-domain-services/tutorial-create-instance-advanced.md#configure-an-administrative-group).
   >
   > The account must also be part of the Azure AD DS managed domain or Azure AD tenant. Accounts from external directories associated with your Azure AD tenant can't correctly authenticate during the domain-join process.

1. Select the **Virtual network** that has connectivity to the Active Directory server, and then choose a subnet to host the virtual machines.
1. Select **Next: Windows Virtual Desktop information**.

### Windows Virtual Desktop tenant information

For the **Windows Virtual Desktop tenant information** tab:

1. For **Windows Virtual Desktop tenant group name**, enter the name for the tenant group that contains your tenant. Leave it as the default unless you were provided a specific tenant group name.
1. For **Windows Virtual Desktop tenant name**, enter the name of the tenant where you'll be creating this host pool.
1. Specify the type of credentials that you want to use to authenticate as the Windows Virtual Desktop tenant RDS Owner. Enter the UPN or Service principal and a password.

   If you completed the [Create service principals and role assignments with PowerShell tutorial](create-service-principal-role-powershell.md), select **Service principal**.

1. For **Service principal**, for **Azure AD tenant ID**, enter the tenant admin account for the Azure AD instance that contains the service principal. Only service principals with a password credential are supported.
1. Select **Next: Review + create**.

## Complete setup and create the virtual machine

In **Review and Create**, review the setup information. If you need to change something, go back and make changes. When you're ready, select **Create** to deploy your host pool.

Depending on how many virtual machines you're creating, this process can take 30 minutes or more to complete.

>[!IMPORTANT]
> To help secure your Windows Virtual Desktop environment in Azure, we recommend you don't open inbound port 3389 on your virtual machines. Windows Virtual Desktop doesn't require an open inbound port 3389 for users to access the host pool's virtual machines.
>
> If you must open port 3389 for troubleshooting purposes, we recommend you use just-in-time access. For more information, see [Secure your management ports with just-in-time access](../../security-center/security-center-just-in-time.md).

## (Optional) Assign additional users to the desktop application group

After Azure Marketplace finishes creating the pool, you can assign more users to the desktop application group. If you don't want to add more, skip this section.

To assign users to the desktop application group:

1. Open a PowerShell window.

1. Run the following command to sign in to the Windows Virtual Desktop environment:

   ```powershell
   Add-RdsAccount -DeploymentUrl "https://rdbroker.wvd.microsoft.com"
   ```

1. Add users to the desktop application group by using this command:

   ```powershell
   Add-RdsAppGroupUser <tenantname> <hostpoolname> "Desktop Application Group" -UserPrincipalName <userupn>
   ```

   The user's UPN should match the user's identity in Azure AD, for example, *user1@contoso.com*. If you want to add multiple users, run the command for each user.

Users you add to the desktop application group can sign in to Windows Virtual Desktop with supported Remote Desktop clients and see a resource for a session desktop.

Here are the current supported clients:

* [Remote Desktop client for Windows 7 and Windows 10](../connect-windows-7-and-10.md)
* [Windows Virtual Desktop web client](connect-web-2019.md)

## Next steps

You've made a host pool and assigned users to access its desktop. You can populate your host pool with RemoteApp programs. To learn more about how to manage apps in Windows Virtual Desktop, see this tutorial:

> [!div class="nextstepaction"]
> [Manage app groups tutorial](manage-app-groups-2019.md)
