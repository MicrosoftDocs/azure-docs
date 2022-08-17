---
title: Azure Virtual Desktop (classic) host pool service updates - Azure
description: Learn to create a validation host pool in Azure Virtual Desktop (classic) to monitor service updates before rolling out updates to production.
author: Heidilohr
ms.topic: tutorial
ms.date: 05/27/2020
ms.author: helohr
manager: femila
---
# Tutorial: Create a host pool to validate service updates in Azure Virtual Desktop (classic)

>[!IMPORTANT]
>This content applies to Azure Virtual Desktop (classic), which doesn't support Azure Resource Manager Azure Virtual Desktop objects. If you're trying to manage Azure Resource Manager Azure Virtual Desktop objects, see [this article](../create-validation-host-pool.md).

Host pools are a collection of one or more identical virtual machines within Azure Virtual Desktop tenant environments. We recommend you create a validation host pool where service updates are applied first. This allows you to monitor service updates before the service applies them to your standard or non-validation environment. Without a validation host pool, you may not discover changes that introduce errors, which could result in downtime for users in your production environment.

To ensure your apps work with the latest updates, the validation host pool should be as similar to host pools in your non-validation environment as possible. Users should connect as frequently to the validation host pool as they do to the standard host pool. If you have automated testing on your host pool, you should include automated testing on the validation host pool.

You can debug issues in the validation host pool with either [the diagnostics feature](diagnostics-role-service-2019.md) or the [Azure Virtual Desktop troubleshooting articles](troubleshoot-set-up-overview-2019.md).

>[!NOTE]
> We recommend that you leave the validation host pool in place to test all future updates.

Before you begin, [download and import the Azure Virtual Desktop PowerShell module](/powershell/windows-virtual-desktop/overview/), if you haven't already. After that, run the following cmdlet to sign in to your account:

```powershell
Add-RdsAccount -DeploymentUrl "https://rdbroker.wvd.microsoft.com"
```

## Create your host pool

You can create a host pool by following the instructions in any of these articles:
- [Tutorial: Create a host pool with Azure Marketplace](create-host-pools-azure-marketplace-2019.md)
- [Create a host pool with an Azure Resource Manager template](create-host-pools-arm-template.md)
- [Create a host pool with PowerShell](create-host-pools-powershell-2019.md)

## Define your host pool as a validation host pool

Run the following PowerShell cmdlets to define the new host pool as a validation host pool. Replace the values in quotes by the values relevant to your session:

```powershell
Add-RdsAccount -DeploymentUrl "https://rdbroker.wvd.microsoft.com"
Set-RdsHostPool -TenantName $myTenantName -Name "contosoHostPool" -ValidationEnv $true
```

Run the following PowerShell cmdlet to confirm that the validation property has been set. Replace the values in quotes by the values relevant to your session.

```powershell
Get-RdsHostPool -TenantName $myTenantName -Name "contosoHostPool"
```

The results from the cmdlet should look similar to this output:

```
    TenantName          : contoso
    TenantGroupName     : Default Tenant Group
    HostPoolName        : contosoHostPool
    FriendlyName        :
    Description         :
    Persistent          : False
    CustomRdpProperty    : use multimon:i:0;
    MaxSessionLimit     : 10
    LoadBalancerType    : BreadthFirst
    ValidationEnv       : True
    Ring                :
```

## Update schedule

Service updates happen monthly. If there are major issues, critical updates will be provided at a more frequent pace.

## Next steps

Now that you've created a validation host pool, you can learn how to use Azure Service Health to monitor your Azure Virtual Desktop deployment.

> [!div class="nextstepaction"]
> [Set up service alerts](set-up-service-alerts-2019.md)
