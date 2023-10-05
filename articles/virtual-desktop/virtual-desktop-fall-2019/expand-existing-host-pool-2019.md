---
title: Expand existing Azure Virtual Desktop (classic) host pool with new session hosts - Azure
description: How to expand an existing host pool with new session hosts in Azure Virtual Desktop (classic).
author: Heidilohr
ms.topic: how-to
ms.custom: devx-track-arm-template
ms.date: 03/31/2021
ms.author: helohr
manager: femila
---
# Expand an existing host pool with new session hosts in Azure Virtual Desktop (classic)

>[!IMPORTANT]
>This content applies to Azure Virtual Desktop (classic), which doesn't support Azure Resource Manager Azure Virtual Desktop objects. If you're trying to manage Azure Resource Manager Azure Virtual Desktop objects, see [this article](../expand-existing-host-pool.md).

As you ramp up usage within your host pool, you may need to expand your existing host pool with new session hosts to handle the new load.

This article will tell you how you can expand an existing host pool with new session hosts.

## What you need to expand the host pool

Before you start, make sure you've created a host pool and session host virtual machines (VMs) using one of the following methods:

- [Azure Marketplace offering](create-host-pools-azure-marketplace-2019.md)
- [GitHub Azure Resource Manager template](create-host-pools-arm-template.md)
- [Create a host pool with PowerShell](create-host-pools-powershell-2019.md)

You'll also need the following information from when you first created the host pool and session host VMs:

- VM size, image, and name prefix
- Domain join and Azure Virtual Desktop tenant administrator credentials
- Virtual network name and subnet name

The next three sections are three methods you can use to expand the host pool. You can do either with whichever deployment tool you're comfortable with.

>[!NOTE]
>During the deployment phase, you'll see error messages for the previous session host VM resources if they're currently shut down. These errors happen because Azure can't run the PowerShell DSC extension to validate that the session host VMs are correctly registered to your existing host pool. The session host whose name ends with "-0" must be running however you can safely ignore these errors for other session hosts, or you can avoid the errors by starting all session host VMs in the existing host pool before starting the deployment process.

## Redeploy from Azure

If you've already created a host pool and session host VMs using the [Azure Marketplace offering](create-host-pools-azure-marketplace-2019.md) or [GitHub Azure Resource Manager template](create-host-pools-arm-template.md), you can redeploy the same template from the Azure portal. Redeploying the template automatically reenters all the information you entered into the original template except for passwords.

Here's how to redeploy the Azure Resource Manager template to expand a host pool:

1. Sign in to the [Azure portal](https://portal.azure.com/).
2. From the search bar at the top of the Azure portal, search for **Resource groups** and select the item under **Services**.
3. Find and select the resource group you created when you made the host pool.
4. In the panel on the left side of the browser, select **Deployments**.
5. Select the appropriate deployment for your host pool creation process:
     - If you created the original host pool with the Azure Marketplace offering, select the deployment starting with **rds.wvd-provision-host-pool**.
     - If you created the original host pool with the GitHub Azure Resource Manager template, select the deployment named **Microsoft.Template**.
6. Select **Redeploy**.

     >[!NOTE]
     >If the template doesn't automatically redeploy when you select **Redeploy**, select **Template** in the panel on the left side of your browser, then select **Deploy**.

7. Select the resource group that contains the current session host VMs in the existing host pool.

     >[!NOTE]
     >If you see an error that tells you to select a different resource group even though the one you entered is correct, select another resource group, then select the original resource group.

8. Enter the following URL for the *_artifactsLocation*: `https://raw.githubusercontent.com/Azure/RDS-Templates/master/wvd-templates/`
9. Enter the new total number of session hosts you want into *Rdsh Number Of Instances*. For example, if you're expanding your host pool from five session hosts to eight, enter **8**.
10. Enter the same existing domain password that you used for the existing domain UPN. Don't change the username, because that will cause an error when you run the template.
11. Enter the same tenant admin password you used for the user or application ID you entered for *Tenant Admin Upn Or Application Id*. Once again, don't change the username.
12. Complete the submission to expand your host pool.

## Run the Azure Marketplace offering

Follow the instructions in [Create a host pool by using the Azure Marketplace](create-host-pools-azure-marketplace-2019.md) until you reach [Run the Azure Marketplace offering to provision a new host pool](create-host-pools-azure-marketplace-2019.md#run-the-azure-marketplace-offering-to-provision-a-new-host-pool). When you get to that point, you'll need to enter the following information for each tab:

### Basics

All values in this section should match what you provided when you first created the host pool and session host VMs, except for *Default desktop users*:

1.    For *Subscription*, select the subscription where you first created the host pool.
2.    For *Resource group*, select the same resource group where the existing host pool session host VMs are located.
3.    For *Region*, select the same region where the existing host pool session host VMs are located.
4.    For *Hostpool name*, enter the name of the existing host pool.
5.    For *Desktop type*, select the desktop type that matches the existing host pool.
6.    For *Default desktop users*, enter a comma-separated list of any additional users who you want to sign in to the Azure Virtual Desktop clients and access a desktop after the Azure Marketplace offering finishes. For example, if you want to assign user3@contoso.com and user4@contoso.com access, enter user3@contoso.com,user4@contoso.com.
7.    Select **Next : Configure virtual machine**.

>[!NOTE]
>Except for *Default desktop users*, all fields must match exactly what has been configure in the existing host pool. If there is a mismatch that will result in a new host pool.

### Configure virtual machines

All parameter values in this section should match what you provided when you first created the host pool and session host VMs, except for the total number of VMs. The number of VMs you enter will be the number of VMs in your expanded host pool:

1. Select the VM size that matches the existing session host VMs.

    >[!NOTE]
    >If the specific VM size you're looking for doesn't appear in the VM size selector, that's because we haven't onboarded it to the Azure Marketplace tool yet.

2. Customize the *Usage Profile*, *Total users*, and *Number of virtual machines* parameters to select the total number of session hosts you would like to have in your host pool. For example, if you're expanding your host pool from five session hosts to eight, configure these options to get to 8 virtual machines.
3. Enter a prefix for the names of the virtual machines. For example, if you enter the name "prefix," the virtual machines will be called "prefix-0," "prefix-1," and so on.
4. Select **Next : Virtual machine settings**.

### Virtual machine settings

All parameter values in this section should match what you provided when you first created the host pool and session host VMs:

1. For *Image source* and *Image OS version*, enter the same information that you provided when you first created the host pool.
2. For *AD domain join UPN* and the associated passwords, enter the same information that you provided when you first created the host pool to join the VMs to the Active Directory domain. These credentials will be used to create a local account on your virtual machines. You can reset these local accounts to change their credentials later.
3. For the virtual network information, select the same virtual network and subnet for where your existing host pool session host VMs are located.
4. Select **Next : Configure Azure Virtual Desktop information**.

### Azure Virtual Desktop information

All parameter values in this section should match what you provided when you first created the host pool and session host VMs:

1. For *Azure Virtual Desktop tenant group name*, enter the name for the tenant group that contains your tenant. Leave it as the default unless you were provided a specific tenant group name.
2. For *Azure Virtual Desktop tenant name*, enter the name of the tenant where you'll be creating this host pool.
3. Specify the same credentials you used when you first created the host pool and session host VMs. If you are using a service principal, enter the ID of the Azure Active Directory instance where your service principal is located.
4. Select **Next : Review + create**.

## Run the GitHub Azure Resource Manager template

Follow the instructions in [Run the Azure Resource Manager template for provisioning a new host pool](create-host-pools-arm-template.md#run-the-azure-resource-manager-template-for-provisioning-a-new-host-pool) and provide all of the same parameter values except for the *Rdsh Number Of Instances*. Enter the number of session host VMs you want in the host pool after running the template. For example, if you're expanding your host pool from five session hosts to eight, enter **8**.

## Next steps

Now that you've expanded your existing host pool, you can sign in to a Azure Virtual Desktop client to test them as part of a user session. You can connect to a session with any of the following clients:

- [Connect with the Windows Desktop client](connect-windows-2019.md)
- [Connect with the web client](connect-web-2019.md)
- [Connect with the Android client](connect-android-2019.md)
- [Connect with the macOS client](connect-macos-2019.md)
- [Connect with the iOS client](connect-ios-2019.md)
