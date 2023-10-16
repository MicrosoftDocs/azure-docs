---
title: Manage application groups for Azure Virtual Desktop (classic) - Azure
description: Learn how to set up Azure Virtual Desktop (classic) tenants in Microsoft Entra ID.
author: Heidilohr
ms.topic: tutorial
ms.date: 08/16/2021
ms.author: helohr
manager: femila
---
# Tutorial: Manage application groups for Azure Virtual Desktop (classic)

>[!IMPORTANT]
>This content applies to Azure Virtual Desktop (classic), which doesn't support Azure Resource Manager Azure Virtual Desktop objects. If you're trying to manage Azure Resource Manager Azure Virtual Desktop objects, see [this article](../manage-app-groups.md).

The default application group created for a new Azure Virtual Desktop host pool also publishes the full desktop. In addition, you can create one or more RemoteApp application groups for the host pool. Follow this tutorial to create a RemoteApp application group and publish individual **Start** menu apps.

In this tutorial, learn how to:

> [!div class="checklist"]
> * Create a RemoteApp group.
> * Grant access to RemoteApp programs.

Before you begin, [download and import the Azure Virtual Desktop PowerShell module](/powershell/windows-virtual-desktop/overview/) to use in your PowerShell session if you haven't already. After that, run the following cmdlet to sign in to your account:

```powershell
Add-RdsAccount -DeploymentUrl "https://rdbroker.wvd.microsoft.com"
```

## Create a RemoteApp group

1. Run the following PowerShell cmdlet to create a new empty RemoteApp application group.

   ```powershell
   New-RdsAppGroup -TenantName <tenantname> -HostPoolName <hostpoolname> -Name <appgroupname> -ResourceType "RemoteApp"
   ```

2. (Optional) To verify that the application group was created, you can run the following cmdlet to see a list of all application groups for the host pool.

   ```powershell
   Get-RdsAppGroup -TenantName <tenantname> -HostPoolName <hostpoolname>
   ```

3. Run the following cmdlet to get a list of **Start** menu apps on the host pool's virtual machine image. Write down the values for **FilePath**, **IconPath**, **IconIndex**, and other important information for the application that you want to publish.

   ```powershell
   Get-RdsStartMenuApp -TenantName <tenantname> -HostPoolName <hostpoolname> -AppGroupName <appgroupname>
   ```

4. Run the following cmdlet to install the application based on `AppAlias`. `AppAlias` becomes visible when you run the output from step 3.

   ```powershell
   New-RdsRemoteApp -TenantName <tenantname> -HostPoolName <hostpoolname> -AppGroupName <appgroupname> -Name <RemoteAppName> -AppAlias <appalias>
   ```

5. (Optional) Run the following cmdlet to publish a new RemoteApp program to the application group created in step 1.

   ```powershell
    New-RdsRemoteApp -TenantName <tenantname> -HostPoolName <hostpoolname> -AppGroupName <appgroupname> -Name <RemoteAppName> -Filepath <filepath>  -IconPath <iconpath> -IconIndex <iconindex>
   ```

6. To verify that the app was published, run the following cmdlet.

   ```powershell
    Get-RdsRemoteApp -TenantName <tenantname> -HostPoolName <hostpoolname> -AppGroupName <appgroupname>
   ```

7. Repeat steps 1–5 for each application that you want to publish for this application group.
8. Run the following cmdlet to grant users access to the RemoteApp programs in the application group.

   ```powershell
   Add-RdsAppGroupUser -TenantName <tenantname> -HostPoolName <hostpoolname> -AppGroupName <appgroupname> -UserPrincipalName <userupn>
   ```

## Next steps

In this tutorial, you learned how to create an application group, populate it with RemoteApp programs, and assign users to the application group. To learn how to create a validation host pool, see the following tutorial. You can use a validation host pool to monitor service updates before rolling them out to your production environment.

> [!div class="nextstepaction"]
> [Create a host pool to validate service updates](create-validation-host-pool-2019.md)
