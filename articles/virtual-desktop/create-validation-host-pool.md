---
title: Azure Virtual Desktop host pool service updates - Azure
description: How to create a validation host pool to monitor service updates before rolling out updates to production.
author: Heidilohr
ms.topic: tutorial
ms.date: 12/15/2020
ms.author: helohr 
ms.custom: devx-track-azurepowershell
manager: femila
---
# Tutorial: Create a host pool to validate service updates

>[!IMPORTANT]
>This content applies to Azure Virtual Desktop with Azure Resource Manager Azure Virtual Desktop objects. If you're using Azure Virtual Desktop (classic) without Azure Resource Manager objects, see [this article](./virtual-desktop-fall-2019/create-validation-host-pool-2019.md).

Host pools are a collection of one or more identical virtual machines within Azure Virtual Desktop environment. We highly recommend you create a validation host pool where service updates are applied first. This allows you to monitor service updates before the service applies them to your standard or non-validation environment. Without a validation host pool, you may not discover changes that introduce errors, which could result in downtime for users in your standard environment.

To ensure your apps work with the latest updates, the validation host pool should be as similar to host pools in your non-validation environment as possible. Users should connect as frequently to the validation host pool as they do to the standard host pool. If you have automated testing on your host pool, you should include automated testing on the validation host pool.

You can debug issues in the validation host pool with either [the diagnostics feature](diagnostics-role-service.md) or the [Azure Virtual Desktop troubleshooting articles](troubleshoot-set-up-overview.md).

>[!NOTE]
> We recommend that you leave the validation host pool in place to test all future updates.

>[!IMPORTANT]
>Azure Virtual Desktop with Azure Resource Management integration currently has trouble enabling and disabling validation environments. We'll update this article when we've resolved the issue.

## Prerequisites

Before you begin, follow the instructions in [Set up the Azure Virtual Desktop PowerShell module](powershell-module.md) to set up your PowerShell module and sign in to Azure.

## Create your host pool

You can create a host pool by following the instructions in any of these articles:
- [Tutorial: Create a host pool with Azure Marketplace](create-host-pools-azure-marketplace.md)
- [Create a host pool with PowerShell](create-host-pools-powershell.md)

## Define your host pool as a validation host pool

Run the following PowerShell cmdlets to define the new host pool as a validation host pool. Replace the values in brackets with the values relevant to your session:

```powershell
Update-AzWvdHostPool -ResourceGroupName <resourcegroupname> -Name <hostpoolname> -ValidationEnvironment:$true
```

Run the following PowerShell cmdlet to confirm that the validation property has been set. Replace the values in brackets with the values relevant to your session.

```powershell
Get-AzWvdHostPool -ResourceGroupName <resourcegroupname> -Name <hostpoolname> | Format-List
```

The results from the cmdlet should look similar to this output:

```powershell
    HostPoolName        : hostpoolname
    FriendlyName        :
    Description         :
    Persistent          : False
    CustomRdpProperty   : use multimon:i:0;
    MaxSessionLimit     : 10
    LoadBalancerType    : BreadthFirst
    ValidationEnvironment : True
```

## Enable your validation environment with the Azure portal

You can also use the Azure portal to enable your validation environment.

To use the Azure portal to configure your validation host pool:

1. Sign in to the Azure portal at <https://portal.azure.com>.
2. Search for and select **Azure Virtual Desktop**.
3. In the Azure Virtual Desktop page, select **Host pools**.
4. Select the name of the host pool you want to edit.
5. Select **Properties**.
6. In the validation environment field, select **Yes** to enable the validation environment.
7. Select **Save**. This will apply the new settings.

## Update schedule

Service updates happen monthly. If there are major issues, critical updates will be provided at a more frequent pace.

If there are any service updates, make sure you have at least a small group of users signing in each day to validate the environment. We recommend you regularly visit our [TechCommunity site](https://techcommunity.microsoft.com/t5/forums/searchpage/tab/message?filter=location&q=wvdupdate&location=forum-board:WindowsVirtualDesktop&sort_by=-topicPostDate&collapse_discussion=true) and follow any posts with WVDUPdate to stay informed about service updates.

## Next steps

Now that you've created a validation host pool, you can learn how to use Azure Service Health to monitor your Azure Virtual Desktop deployment.

> [!div class="nextstepaction"]
> [Set up service alerts](./set-up-service-alerts.md)
