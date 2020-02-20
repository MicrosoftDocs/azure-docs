---
title: Expand existing host pool with new session hosts - Azure
description: How to expand an existing host pool with new session hosts in Windows Virtual Desktop.
services: virtual-desktop
author: Heidilohr

ms.service: virtual-desktop
ms.topic: conceptual
ms.date: 02/18/2020
ms.author: helohr
---
# Expand an existing host pool with new session hosts

Host pools are a collection of one or more identical virtual machines within Windows Virtual Desktop tenant environments. Each host pool can contain an app group that users can interact with as they would on a physical desktop.

This article will tell you how you can expand an existing host pool with new session hosts.

## What you need to expand the host pool

Before you start, make sure you've created a host pool and session host virtual machines (VMs) using one of the following methods:

- [Azure Marketplace offering](./create-host-pools-azure-marketplace.md)
- [GitHub Azure Resource Manager template](./create-host-pools-arm-template.md)
- [Create a host pool with PowerShell](./create-host-pools-powershell.md)

You'll also need the following information from when you first created the host pool and session host VMs:

- VM size, image, and name prefix
- Domain join and Windows Virtual Desktop tenant administrator credentials
- Virtual network name and subnet name

The next three sections are three methods you can use to expand the host pool. You can do either with whichever deployment tool you're comfortable with.

## Redeploy from Azure

If you previously created a host pool and session host VMs through the [Azure Marketplace offering](./create-host-pools-azure-marketplace.md) or [GitHub Azure Resource Manager template](./create-host-pools-arm-template.md), you can redeploy the same Azure Resource Manager template from the Azure portal. This will automatically reenter all of the same information except for passwords, ensuring that you do not mistype input parameters this time around.

Follow the instructions below to redeploy the Azure Resource Manager template to expand an existing host pool:

1. Sign in to the [Azure portal](https://portal.azure.com/).
2. From the search bar at the top of the Azure portal, search for **Resource groups** and select the item under **Services**.
3. Find the resource group you created when you first created the host pool, then select it.
4. In the panel on the left side of the browser, select **Deployments**.
5. Select the appropriate deployment that maps to the host pool creation process:
     - If you initially created the host pool through the Azure Marketplace offering, select the deployment starting with *rds.wvd-provision-host-pool*.
     - If you initially created the host pool through the GitHub Azure Resource Manager template, select the deployment named *Microsoft.Template*.
6. Select **Redeploy**.
7. Make sure that the correct *Resource group* is entered.
     
     >[!NOTE]
     >Even though the *Resource group* is automatically and correctly populated, you may see an error that suggests selecting a different resource group. To fix, select another resource group, then select the original resource group.

8. Enter the new total for *Rdsh Number Of Instances*. For example, if you are expanding your host pool from 5 session hosts to 8 session hosts, enter **8** for this parameter.
9. Re-enter the *Existing Domain Password* for the user entered for *Existing Domain UPN*. Do not change the username, as this will result in an error when running the template.
10. Re-enter the *Tenant Admin Password* for the user or application ID entered for *Tenant Admin Upn Or Application Id*. Do not change the username, as this will result in an error when running the template.
11. Complete the submission to expand your host pool.

## Run the Azure Marketplace offering

Follow the instructions in [Run the Azure Marketplace offering to provision a new host pool](./create-host-pools-azure-marketplace.md#run-the-azure-marketplace-offering-to-provision-a-new-host-pool), with the following guidance per blade:

### Basics

All values in this section should match what you provided when you first created the host pool and session host VMs, except for *Default desktop users*:

1.	For *Subscription*, select the subscription where you first created the host pool.
2.	For *Resource group*, select the same resource group where the existing host pool session host VMs are located.
3.	For *Region*, select the same region where the existing host pool session host VMs are located.
4.	For *Hostpool name*, enter the of the existing host pool.
5.	For *Desktop type*, select the desktop type that matches the existing host pool.
6.	For *Default desktop users*, enter a comma-separated list of any additional users who you want to sign in to the Windows Virtual Desktop clients and access a desktop after the Azure Marketplace offering finishes. For example, if you want to assign user3@contoso.com and user4@contoso.com access, enter user3@contoso.com,user4@contoso.com.
7.	Select **Next : Configure virtual machine**.

>[!NOTE]
>Except for *Default desktop users*, all fields must match exactly what has been configure in the existing host pool. If there is a mismatch that will result in a new host pool.

### Configure virtual machines



1. Either accept the defaults or customize the number and size of the VMs.
    
    >[!NOTE]
    >If the specific VM size you're looking for doesn't appear in the VM size selector, that's because we haven't onboarded it to the Azure Marketplace tool yet. To request a VM size, create a request or upvote an existing request in the [Windows Virtual Desktop UserVoice forum](https://windowsvirtualdesktop.uservoice.com/forums/921118-general).
    
2. Enter a prefix for the names of the virtual machines. For example, if you enter the name "prefix," the virtual machines will be called "prefix-0," "prefix-1," and so on.
3. Select **Next : Virtual machine settings**.

### Virtual machine settings

All parameter values in this section should match what you provided when you first created the host pool and session host VMs:

1. For *Image source* and *Image OS version*, enter the same information that you provided when you first created the host pool.
2. For *AD domain join UPN* and the associated passwords, enter the same information that you provided when you first created the host pool to join the VMs to the Active Directory domain. This same username and password will be created on the virtual machines as a local account. You can reset these local accounts later.
3. For the virtual network information, select the same virtual network and subnet for where your existing host pool session host VMs are located.
4. Select **Next: Configure Windows Virtual Desktop information**.

### Windows Virtual Desktop information

All parameter values in this section should match what you provided when you first created the host pool and session host VMs:

1. For **Windows Virtual Desktop tenant group name**, enter the name for the tenant group that contains your tenant. Leave it as the default unless you were provided a specific tenant group name.
2. For **Windows Virtual Desktop tenant name**, enter the name of the tenant where you'll be creating this host pool.
3. Specify the type of credentials that you want to use to authenticate as the Windows Virtual Desktop tenant RDS Owner. If you completed the [Create service principals and role assignments with PowerShell tutorial](./create-service-principal-role-powershell.md), select **Service principal**. When **Azure AD tenant ID** appears, enter the ID for the Azure Active Directory instance that contains the service principal.
4. Enter the credentials for the tenant admin account. Only service principals with a password credential are supported.
5. Select **Next : Review + create**.

## Run the GitHub Azure Resource Manager template

Follow the same steps provided in [Run the Azure Resource Manager template for provisioning a new host pool](./create-host-pools-arm-template.md#run-the-azure-resource-manager-template-for-provisioning-a-new-host-pool) and provide all of the same parameter values except for the *Rdsh Number Of Instances*. Enter the number of session host VMs you want in the host pool after running the template. For example, if you are expanding your host pool from 5 session hosts to 8 session hosts, enter **8** for this parameter.