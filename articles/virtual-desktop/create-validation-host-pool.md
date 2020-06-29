---
title: Windows Virtual Desktop host pool service updates - Azure
description: How to create a validation host pool to monitor service updates before rolling out updates to production.
services: virtual-desktop
author: Heidilohr

ms.service: virtual-desktop
ms.topic: tutorial
ms.date: 03/13/2020
ms.author: helohr
manager: lizross
---
# Tutorial: Create a host pool to validate service updates

>[!IMPORTANT]
>This content applies to the Spring 2020 update with Azure Resource Manager Windows Virtual Desktop objects. If you're using the Windows Virtual Desktop Fall 2019 release without Azure Resource Manager objects, see [this article](./virtual-desktop-fall-2019/create-validation-host-pool-2019.md).
>
> The Windows Virtual Desktop Spring 2020 update is currently in public preview. This preview version is provided without a service level agreement, and we don't recommend using it for production workloads. Certain features might not be supported or might have constrained capabilities. 
> For more information, see [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).

Host pools are a collection of one or more identical virtual machines within Windows Virtual Desktop tenant environments. Before deploying host pools to your production environment, we highly recommend you create a validation host pool. Updates are applied first to validation host pools, letting you monitor service updates before rolling them out to your production environment. Without a validation host pool, you may not discover changes that introduce errors, which could result in downtime for users in your production environment.

To ensure your apps work with the latest updates, the validation host pool should be as similar to host pools in your production environment as possible. Users should connect as frequently to the validation host pool as they do to the production host pool. If you have automated testing on your host pool, you should include automated testing on the validation host pool.

You can debug issues in the validation host pool with either [the diagnostics feature](diagnostics-role-service.md) or the [Windows Virtual Desktop troubleshooting articles](troubleshoot-set-up-overview.md).

>[!NOTE]
> We recommend that you leave the validation host pool in place to test all future updates.

>[!IMPORTANT]
>The Windows Virtual Desktop Spring 2020 release currently has trouble enabling and disabling validation environment. We'll update this article when we've resolved the issue.

## Prerequisites

Before you begin, follow the instructions in [Set up the Windows Virtual Desktop PowerShell module](powershell-module.md) to set up your PowerShell module and sign in to Azure.

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

## Update schedule

Service updates happen monthly. If there are major issues, critical updates will be provided at a more frequent pace.

If there are any service updates, make sure you have at least a small group of users signing in each day to validate the environment. We recommend you regularly visit our [TechCommunity site](https://techcommunity.microsoft.com/t5/forums/searchpage/tab/message?filter=location&q=wvdupdate&location=forum-board:WindowsVirtualDesktop&sort_by=-topicPostDate&collapse_discussion=true) and follow any posts with WVDUPdate to stay informed about service updates.

## Next steps

Now that you've created a validation host pool, you can learn how to use Azure Service Health to monitor your Windows Virtual Desktop deployment. 

> [!div class="nextstepaction"]
> [Set up service alerts](./set-up-service-alerts.md)
