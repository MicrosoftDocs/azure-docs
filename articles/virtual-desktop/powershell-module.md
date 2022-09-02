---
title: PowerShell module Azure Virtual Desktop - Azure
description: How to install and set up the PowerShell module for Azure Virtual Desktop.
author: Heidilohr
ms.topic: how-to
ms.date: 07/20/2021
ms.author: helohr 
ms.custom: devx-track-azurepowershell
manager: femila
---
# Set up the PowerShell module for Azure Virtual Desktop

>[!IMPORTANT]
>This content applies to Azure Virtual Desktop with Azure Resource Manager integration.

The Azure Virtual Desktop PowerShell module is integrated into the Azure PowerShell module. This article will tell you how to set up the PowerShell module so you can run cmdlets for Azure Virtual Desktop.

## Set up your PowerShell environment

To get started with using the module, first install the [latest version of PowerShell Core](/powershell/scripting/install/installing-powershell#powershell-core). Azure Virtual Desktop cmdlets currently only work with PowerShell Core.

Next, you'll need to install the DesktopVirtualization module to use in your PowerShell session.

Run the following PowerShell cmdlet in elevated mode to install the module:

```powershell
Install-Module -Name Az.DesktopVirtualization
```

>[!NOTE]
> If this cmdlet doesn't work, try running it again with elevated permissions.

Next, run the following cmdlet to connect to Azure:

```powershell
Connect-AzAccount
```

>[!IMPORTANT]
>If you're connecting to the US Gov portal, run this cmdlet instead:
> 
> ```powershell
> Connect-AzAccount -EnvironmentName AzureUSGovernment
> ```
> 
> To connect to the Azure China portal, run this cmdlet:
> 
> ```powershell
> Connect-AzAccount -EnvironmentName AzureChinaCloud
> ```

Signing into your Azure account requires a code that's generated when you run the Connect cmdlet. Sign in via [device login](https://microsoft.com/devicelogin), enter the code, then sign in using your Azure admin credentials.

```output
Account SubscriptionName TenantId Environment

------- ---------------- -------- -----------

Youradminupn subscriptionname AzureADTenantID AzureCloud
```

This will sign you directly into the subscription that is default for your admin credentials.

## Change the default subscription

If you want to change the default subscription after you've signed in, run this cmdlet:

```powershell
Select-AzSubscription -Subscription <preferredsubscriptionname>
```

You can also select one from a list using the Out-GridView cmdlet:

```powershell
Get-AzSubscription | Out-GridView -PassThru | Select-AzSubscription
```

When you select a new subscription to use, you don't need to specify that subscription's ID in cmdlets you run afterwards. For example, the following cmdlet retrieves a specific session host without needing the subscription ID:

```powershell
Get-AzWvdSessionHost -HostPoolName <hostpoolname> -Name <sessionhostname> -ResourceGroupName <resourcegroupname>
```

You can also change subscriptions on a per-cmdlet basis by adding the desired subscription name as a parameter. The next cmdlet is the same as the previous example, except with the subscription ID added as a parameter to change which subscription the cmdlet uses.

```powershell
Get-AzWvdSessionHost -HostPoolName <hostpoolname> -Name <sessionhostname> -ResourceGroupName <resourcegroupname> -SubscriptionId <subscriptionGUID>
```

## Get locations

The location parameter is mandatory for all **New-AzWVD** cmdlets that create new objects.

Run the following cmdlet to get a list of locations your subscription supports:

```powershell
Get-AzLocation
```

The output for **Get-AzLocation** will look like this:

```powershell
Location : eastasia

DisplayName : East Asia

Providers : {Microsoft.RecoveryServices, Microsoft.ManagedIdentity,
Microsoft.SqlVirtualMachine, microsoft.insightsΓÇª}

Location : southeastasia

DisplayName : Southeast Asia

Providers : {Microsoft.RecoveryServices, Microsoft.ManagedIdentity,
Microsoft.SqlVirtualMachine, microsoft.insightsΓÇª}

Location : centralus

DisplayName : Central US

Providers : {Microsoft.RecoveryServices, Microsoft.DesktopVirtualization,
Microsoft.ManagedIdentity, Microsoft.SqlVirtualMachineΓÇª}

Location : eastus

DisplayName : East US

Providers : {Microsoft.RecoveryServices, Microsoft.DesktopVirtualization,
Microsoft.ManagedIdentity, Microsoft.SqlVirtualMachineΓÇª}
```

Once you know your account's location, you can use it in a cmdlet. For example, here's a cmdlet that creates a host pool in the "uksouth" location:

```powershell
New-AzWvdHostPool -Name <hostpoolname> -location uksouth -ResourceGroupName <resourcegroupname> -HostPoolType <hostpooltype> -LoadBalancerType <loadbalancertype> -PreferredAppGroupType ,preferredappgroiptype
```

## Next steps

Now that you've set up your PowerShell module, you can run cmdlets to do all sorts of things in Azure Virtual Desktop. Here are some of the places you can use your module:

- Run through our [Azure Virtual Desktop tutorials]() to set up your very own Azure Virtual Desktop environment.
- [Create a host pool with PowerShell](create-host-pools-powershell.md)
- [Configure the Azure Virtual Desktop load-balancing method](configure-host-pool-load-balancing.md)
- [Configure the personal desktop host pool assignment type](configure-host-pool-personal-desktop-assignment-type.md)
- And much more!

If you run into any issues, check out our [PowerShell troubleshooting article](troubleshoot-powershell.md) for help.

