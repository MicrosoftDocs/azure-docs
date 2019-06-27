---
title: Create a Windows Virtual Desktop preview host pool to validate service updates  - Azure
description: How to create a validation host pool to monitor service updates before rolling out updates to production.
services: virtual-desktop
author: ChJenk

ms.service: virtual-desktop
ms.topic: tutorial
ms.date: 05/08/2019
ms.author: v-chjenk
---
# Tutorial: Create a host pool to validate service updates

Host pools are a collection of one or more identical virtual machines within Windows Virtual Desktop Preview tenant environments. Before deploying host pools to your production environment, we highly recommend you create a validation host pool. Updates are applied first to validation host pools, letting you monitor service updates before rolling them out to your production environment. Without a validation host pool, you may not discover changes that introduce errors, which could result in downtime for users in your production environment.

To ensure your apps work with the latest updates, the validation host pool should be as similar to host pools in your production environment as possible. Users should connect as frequently to the validation host pool as they do to the production host pool. If you have automated testing on your host pool, you should include automated testing on the validation host pool.

You can debug issues in the validation host pool with either [the diagnostics feature](diagnostics-role-service.md) or the [Windows Virtual Desktop troubleshooting articles](https://docs.microsoft.com/Azure/virtual-desktop/troubleshoot-set-up-overview).

>[!NOTE]
> We recommend that you leave the validation host pool in place to test all future updates.

Before you begin, [download and import the Windows Virtual Desktop PowerShell module](https://docs.microsoft.com/powershell/windows-virtual-desktop/overview), if you haven't already.

## Create your host pool

You can create a host pool by following the instructions in any of these articles:
- [Tutorial: Create a host pool with Azure Marketplace](create-host-pools-azure-marketplace.md)
- [Create a host pool with an Azure Resource Manager template](create-host-pools-arm-template.md)
- [Create a host pool with PowerShell](create-host-pools-powershell.md)

## Define your host pool as a validation host pool

Run the following PowerShell cmdlets to define the new host pool as a validation host pool. Replace the values in quotes by the values relevant to your session:

```powershell
Add-RdsAccount -DeploymentUrl "https://rdbroker.wvd.microsoft.com"
Set-RdsHostPool -TenantName $myTenantName -Name "contosoHostPool" -ValidationEnv $true
```

Run the following PowerShell cmdlet to confirm that the validation property has been set. Replace the values in quotes by the values relevant to your session.

```powershell
Get-RdsHostPool -TenantName $myTenantName -Name "contosoHostPool" -ValidationEnv $true
```

The results from the cmdlet should look similar to this output:

```
    TenantName          : contoso 
    TenantGroupName     : Default Tenant Group
    HostPoolName        : contosoHostPool
    FriendlyName        :
    Description         :
    Persistent          : False 
    CustomRdpProperty	: use multimon:i:0;
    MaxSessionLimit     : 10
    LoadBalancerType	: BreadthFirst
    ValidationEnv       : True
    Ring                :
```

## Update schedule

In preview, service updates occur on approximately a monthly cadence. If there are major issues, critical updates will be provided on a more frequent cadence.

## Next steps

Now that you've created a validation host pool, you can learn how to deploy and connect to a management tool for managing Microsoft Virtual Desktop resources.

> [!div class="nextstepaction"]
> [Deploy a management tool tutorial](./manage-resources-using-ui.md)
