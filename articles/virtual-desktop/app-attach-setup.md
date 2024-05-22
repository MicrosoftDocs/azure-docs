---
title: Add and manage MSIX app attach and app attach applications - Azure Virtual Desktop
description: Learn how to add and manage applications with MSIX app attach and app attach in Azure Virtual Desktop using the Azure portal and Azure PowerShell, where you can dynamically attach applications from an application package to a user session.
ms.topic: how-to
ms.custom: devx-track-azurepowershell
zone_pivot_groups: azure-virtual-desktop-app-attach
author: dknappettmsft
ms.author: daknappe
ms.date: 12/08/2023
---

# Add and manage MSIX app attach and app attach applications in Azure Virtual Desktop

> [!IMPORTANT]
> App attach is currently in PREVIEW.
> See the [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/) for legal terms that apply to Azure features that are in beta, preview, or otherwise not yet released into general availability.

> [!TIP]
> A new version of app attach for Azure Virtual Desktop is available in preview. Select a button at the top of this article to choose between *MSIX app attach* (current) and *app attach* (preview) to see the relevant documentation.

::: zone pivot="app-attach"
App attach enables you to dynamically attach applications from an application package to a user session in Azure Virtual Desktop. Applications aren't installed locally on session hosts or images, enabling you to create fewer custom images for your session hosts, and reducing operational overhead and costs for your organization. Delivering applications with app attach also gives you greater control over which applications your users can access in a remote session.
::: zone-end

::: zone pivot="msix-app-attach"
MSIX app attach enables you to dynamically attach applications from an application package to a user session in Azure Virtual Desktop. Applications aren't installed locally on session hosts or images, making it easier to create custom images for your session hosts, and reducing operational overhead and costs for your organization. Delivering applications with MSIX app attach also gives you greater control over which applications your users can access in a remote session.
::: zone-end

::: zone pivot="app-attach"
This article shows you how to add and manage applications with app attach in Azure Virtual Desktop using the Azure portal and Azure PowerShell. You can't add or manage app attach applications using Azure CLI. Before you start, make sure you read the overview for [MSIX app attach and app attach in Azure Virtual Desktop](app-attach-overview.md).
::: zone-end

::: zone pivot="msix-app-attach"
This article shows you how to add and manage MSIX packages with MSIX app attach in Azure Virtual Desktop using the Azure portal and Azure PowerShell. You can't add or manage MSIX app attach applications using Azure CLI. Before you start, make sure you read the overview for [MSIX app attach and app attach in Azure Virtual Desktop](app-attach-overview.md).
::: zone-end

> [!IMPORTANT]
> You have to choose whether you want to use MSIX app attach or app attach with a host pool. You can't use both versions with the same host pool.

## Prerequisites

::: zone pivot="app-attach"
In order to use app attach in Azure Virtual Desktop, you need the following things:
::: zone-end

::: zone pivot="msix-app-attach"
In order to use MSIX app attach in Azure Virtual Desktop, you need to meet the prerequisites:
::: zone-end

- An existing [host pool](create-host-pool.md) with [session hosts](add-session-hosts-host-pool.md), an [application group, and a workspace](create-application-group-workspace.md).

- Your session hosts need to run a [supported Windows client operating system](prerequisites.md#operating-systems-and-licenses) and at least one of them must be powered on. Windows Server isn't supported.

::: zone pivot="app-attach"
- Your host pool needs to be [configured as a validation environment](configure-validation-environment.md).
::: zone-end

::: zone pivot="app-attach"
- Your session hosts need to be joined to Microsoft Entra ID or an Active Directory Domain Services (AD DS) domain.
::: zone-end

::: zone pivot="msix-app-attach"
- Your session hosts need to be joined to an Active Directory Domain Services (AD DS) domain. Microsoft Entra ID isn't supported.

::: zone-end

::: zone pivot="msix-app-attach"
- User accounts need to be hybrid accounts (created in AD DS and synchronized to Microsoft Entra ID). Groups can be hybrid or Microsoft Entra ID groups.
::: zone-end

::: zone pivot="app-attach"
- An SMB file share in the same Azure region as your session hosts. All session hosts in the host pool must have *read* access with their computer account. This file share is used to store your application images. For more information on the requirements for the file share, see [File share](app-attach-overview.md#file-share).

   To use Azure Files when your session hosts joined to Microsoft Entra ID, you need to assign the [Reader and Data Access](../role-based-access-control/built-in-roles.md#reader-and-data-access) Azure role-based access control (RBAC) role to both the **Azure Virtual Desktop** and **Azure Virtual Desktop ARM Provider** service principals. To learn how to assign an Azure RBAC role to the Azure Virtual Desktop service principals, see [Assign RBAC roles to the Azure Virtual Desktop service principals](service-principal-assign-roles.md). In a future update of the preview, you won't need to assign the **Azure Virtual Desktop ARM Provider** service principal.
::: zone-end

::: zone pivot="msix-app-attach"
- An SMB file share in the same Azure region as your session hosts. All session hosts in the host pool must have *read* access with their computer account. This file share is used to store your application images. For more information on the requirements for the file share, see [File share](app-attach-overview.md#file-share).
::: zone-end

::: zone pivot="app-attach"
- An MSIX or Appx disk image that you created from an application package and stored on the file share. For more information, see [Create an image](app-attach-create-msix-image.md), where you can also download a prebuilt MSIX package for testing.
::: zone-end

::: zone pivot="msix-app-attach"
- An MSIX image that you created from an application package and stored on the file share. For more information, see [Create an image](app-attach-create-msix-image.md), where you can also download a prebuilt MSIX package for testing.
::: zone-end

- To add MSIX images, you need the [Desktop Virtualization Contributor](rbac.md#desktop-virtualization-contributor) Azure role-based access control (RBAC) role assigned on the resource group as a minimum. To assign users to the application group, you also need `Microsoft.Authorization/roleAssignments/write` permissions on the application group. Built-in RBAC roles that include this permission are [User Access Administrator](../role-based-access-control/built-in-roles.md#user-access-administrator) and [Owner](../role-based-access-control/built-in-roles.md#owner). 

- If you want to use Azure PowerShell locally, see [Use Azure PowerShell with Azure Virtual Desktop](cli-powershell.md) to make sure you have the [Az.DesktopVirtualization](/powershell/module/az.desktopvirtualization) and [Microsoft Graph](/powershell/microsoftgraph/installation) PowerShell modules installed. Alternatively, use the [Azure Cloud Shell](../cloud-shell/overview.md).

::: zone pivot="app-attach"
- You need to use version 4.2.1 of the *Az.DesktopVirtualization* PowerShell module, which contains the cmdlets that support app attach. You can download and install the Az.DesktopVirtualization PowerShell module from the [PowerShell Gallery](https://www.powershellgallery.com/packages/Az.DesktopVirtualization/).
::: zone-end

::: zone pivot="app-attach"
> [!IMPORTANT]
>
> - All MSIX and Appx application packages include a certificate. You're responsible for making sure the certificates are trusted in your environment. Self-signed certificates are supported with the appropriate chain of trust.
>
> - You have to choose whether you want to use MSIX app attach or app attach with a host pool. You can't use both versions with the same package in the same host pool.
::: zone-end

::: zone pivot="msix-app-attach"
> [!IMPORTANT]
>
> All MSIX application packages include a certificate. You're responsible for making sure the certificates are trusted in your environment. Self-signed certificates are supported with the appropriate chain of trust.
::: zone-end

::: zone pivot="app-attach"
## Add an application

To add an application in an MSIX or Appx image to Azure Virtual Desktop as an app attach package, select the relevant tab for your scenario and follow the steps.

# [Portal](#tab/portal)

Here's how to add an MSIX or Appx image as an app attach package using the Azure portal:

1. Sign in to the [Azure portal](https://portal.azure.com/).

1. In the search bar, type *Azure Virtual Desktop* and select the matching service entry to go to the Azure Virtual Desktop overview.

1. Select **App attach**, then select **+ Create**.

1. On the **Basics** tab, complete the following information:

   | Parameter | Description |
   |--|--|
   | Subscription | Select the subscription you want to add an MSIX or Appx image to from the drop-down list. |
   | Resource group | Select an existing resource group or select **Create new** and enter a name. |
   | Host pool | Select an existing host pool from the drop-down list. |
   | Location | Select the Azure region for your app attach package. |

   Once you've completed this tab, select **Next**.

1. On the **Image path** tab, complete the following information:

   | Parameter | Description |
   |--|--|
   | Image path | Select from **Select from storage account** if your image is stored in Azure Files or **Input UNC** to specify a UNC path. Subsequent fields depend on which option you select. |
   | **Select from storage account** |  |
   | Storage account | Select the storage account your image is in. |
   | File share | Select **Select a file**, then browse to the file share and directory your image is in. Check the box next to the image you want to add, for example `MyApp.cim`, then select **Select**. |
   | MSIX package | Select the MSIX or Appx package from the image. |
   | **Input UNC** |  |
   | UNC | Enter the UNC path to your image file. |
   | MSIX package | Select the MSIX or Appx package from the image. |
   | **Either option** |  |
   | Display name | Enter a friendly name for your application. |
   | Version | Check the expected version number is shown. |
   | Registration type | Select the [registration type](app-attach-overview.md#application-registration) you want to use. |
   | State | Select the initial [state](app-attach-overview.md#application-state) for the package. |
   | Health check status on failure | Select the status for the package if it fails to stage on a session host. This status is reported for **AppAttachHealthCheck** for the [session host health check status](troubleshoot-statuses-checks.md). |

   Once you've completed this tab, select **Next**.

   > [!TIP]
   > Once you've completed this tab, you can continue to optionally assign the application to host pools, users and groups. Alternatively, if you want to configure assignments separately, select **Review + create**, then go to [Assign an app attach package](#assign-an-app-attach-package).

1. *Optional*: On the **Assignments** tab, complete the following information:

   1. For **Host pool**, select which host pools you want to assign the application to. If you're already using *MSIX app attach* with a host pool, you can't select that host pool as you can't use both versions of app attach with the same host pool.

   1. Select **Add users or user groups**, then search for and select the users or groups you want to assign the application to. Once you have finished, select **Select**.
   
   1. Review the assignments you added, then select **Next**.

1. *Optional*: On the **Tags** tab, you can enter any name/value pairs you need, then select **Review + create**.

1. On the **Review + create** tab, ensure validation passes and review the information that is used during deployment, then select **Create** to add the application.

# [Azure PowerShell](#tab/powershell)

Here's how to add an MSIX or Appx image as an app attach package using the [Az.DesktopVirtualization](/powershell/module/az.desktopvirtualization/) PowerShell module.

> [!IMPORTANT]
> In the following examples, you'll need to change the `<placeholder>` values for your own.

[!INCLUDE [include-cloud-shell-local-powershell](includes/include-cloud-shell-local-powershell.md)]

2. During the preview, check that you have the PowerShell cmdlets available by running the following commands:

   ```azurepowershell
   Import-Module Az.DesktopVirtualization
   Get-Command -Module Az.DesktopVirtualization -Noun "*AppAttach*"
   ```

   Your output should be similar to the following output:

   ```output
   CommandType     Name                                               Version    Source
   -----------     ----                                               -------    ------
   Function        Get-AzWvdAppAttachPackage                          4.2.1      Az.DesktopVirtualization
   Function        Import-AzWvdAppAttachPackageInfo                   4.2.1      Az.DesktopVirtualization
   Function        New-AzWvdAppAttachPackage                          4.2.1      Az.DesktopVirtualization
   Function        Remove-AzWvdAppAttachPackage                       4.2.1      Az.DesktopVirtualization
   Function        Update-AzWvdAppAttachPackage                       4.2.1      Az.DesktopVirtualization
   ```

3. Get the properties of the image you want to add and store them in a variable by running the following command. You need to specify a host pool, but it can be any host pool where session hosts have access to the file share.

   ```azurepowershell
   # Get the properties of the MSIX or Appx image
   $parameters = @{
       HostPoolName = '<HostPoolName>'
       ResourceGroupName = '<ResourceGroupName>'
       Path = '<UNCPathToImageFile>'
   }

   $app = Import-AzWvdAppAttachPackageInfo @parameters
   ```

4. Check you only have one object in the application properties by running the following command:

   ```azurepowershell
   $app | FL *
   ```

   *Optional*: if you have more than one object in the output, for example an x64 and an x86 version of the same application, you can use the parameter `PackageFullName` to specify which application you want to add by running the following command:

   ```azurepowershell
   # Specify the package full name
   $packageFullName = '<PackageFullName>'

   # Get the properties of the application
   $parameters = @{
       HostPoolName = '<HostPoolName>'
       ResourceGroupName = '<ResourceGroupName>'
       Path = '<UNCPathToImageFile>'
   }

   $app = Import-AzWvdAppAttachPackageInfo @parameters | ? ImagePackageFullName -like *$packageFullName*
   ```

5. Add the image as an app attach package by running the following command. In this example, the [application state](app-attach-overview.md#application-state) is marked as *active*, the [application registration](app-attach-overview.md#application-registration) is set to **on-demand**, and [session host health check status](troubleshoot-statuses-checks.md) on failure is set to **NeedsAssistance**:

   ```azurepowershell
   $parameters = @{
       Name = '<AppName>'
       ResourceGroupName = '<ResourceGroupName>'
       Location = '<AzureRegion>'
       FailHealthCheckOnStagingFailure = 'NeedsAssistance'
       ImageIsRegularRegistration = $false
       ImageDisplayName = '<AppDisplayName>'
       ImageIsActive = $true
   }

   New-AzWvdAppAttachPackage -AppAttachPackage $app @parameters
   ```

   There's no output when the package is added successfully.

6. You can verify the package is added by running the following command:

   ```azurepowershell
   $parameters = @{
       Name = '<AppName>'
       ResourceGroupName = '<ResourceGroupName>'
   }

   Get-AzWvdAppAttachPackage @parameters | FL Name, ImagePackageApplication, ImagePackageFamilyName, ImagePath, ImageVersion, ImageIsActive, ImageIsRegularRegistration, SystemDataCreatedAt
   ```

   The output should be similar to the following output:

   ```output
   Name                       : My App
   ImagePackageApplication    : {MyApp}
   ImagePackageFamilyName     : MyApp_abcdef123ghij
   ImagePath                  : \\fileshare\Apps\MyApp\MyApp.cim
   ImageVersion               : 1.0.0.0
   ImageIsActive              : True
   ImageIsRegularRegistration : True
   SystemDataCreatedAt        : 7/31/2023 3:03:43 PM
   ```

---

## Assign an app attach package

You need to assign an app attach package to host pools as well as groups and users. Select the relevant tab for your scenario and follow the steps.

> [!NOTE]
> User accounts need to be hybrid accounts (created in AD DS and synchronized to Azure AD), but groups do not.

# [Portal](#tab/portal)

Here's how to assign an application package to host pools, users and groups using the Azure portal:

#### Host pools

1. From the Azure Virtual Desktop overview, select **App attach**, then select the name of the app attach package you want to assign.

1. In the section **Manage**, select **Host pools**:

1. Select **+ Assign**, then select one or more host pools from the drop-down list. Make sure that all session hosts in the host pool must have *read* access with their computer account, as listed in the prerequisites.

1. Select **Add**.

#### Groups and users

1. From the Azure Virtual Desktop overview, select **App attach**, then select the name of the app attach package you want to assign.

1. In the section **Manage**, select **Users**:

1. Select **+ Add**, then select one or more groups and/or users from the list.

1. Select **Select**.

# [Azure PowerShell](#tab/powershell)

Here's how to assign an application package to host pools as well as groups and users using the [Az.DesktopVirtualization](/powershell/module/az.desktopvirtualization/) PowerShell module.

#### Host pools

> [!IMPORTANT]
> The host pool IDs you specify each time will overwrite any existing assignments. If you want to add or remove a host pool to or from an existing list of host pools, you need to specify all the host pools you want to assign the application to.

1. In the same PowerShell session, get the resource IDs of the host pool(s) you want to assign the application to and add them to an array to by running the following command:

   ```azurepowershell
   # Add a comma-separated list of host pools names
   $hostPoolNames = "<HostPoolName1>","<HostPoolName2>"

   # Create an array and add the resource ID for each host pool
   $hostPoolIds = @()
   foreach ($hostPoolName in $HostPoolNames) {
       $hostPoolIds += (Get-AzWvdHostPool | ? Name -eq $hostPoolName).Id
   }
   ```

1. Once you have the resource IDs of the host pool(s), you can assign the application package to them by running the following command:

   ```azurepowershell
   $parameters = @{
       Name = '<AppName>'
       ResourceGroupName = '<ResourceGroupName>'
       Location = '<AzureRegion>'
       HostPoolReference = $hostPoolIds
   }
   
   Update-AzWvdAppAttachPackage @parameters
   ```

1. To unassign the application package from all host pools, you can pass an empty array of host pools by running the following command:

   ```azurepowershell
   $parameters = @{
       Name = '<AppName>'
       ResourceGroupName = '<ResourceGroupName>'
       Location = '<AzureRegion>'
       HostPoolReference = @()
   }
   
   Update-AzWvdAppAttachPackage @parameters
   ```

#### Groups and users

Here's how to assign an application to groups and users using the [Az.DesktopVirtualization](/powershell/module/az.desktopvirtualization/) PowerShell module.

1. Get the object ID of the groups or users you want to add to or remove from the application and add them to an array to by using one of the following examples. We recommend you assign applications to groups.

   1. Get the object ID of the group or groups and add them to an array to by running the following command. This example uses the group display name:

      ```azurepowershell
      # Add a comma-separated list of group names
      $groups = "Group1","Group2"

      # Connect to Microsoft Graph
      Connect-MgGraph -Scopes 'Group.Read.All'

      # Create an array and add the ID for each group
      $Ids = @()

      foreach ($group in $groups) {
         $Ids += (Get-MgGroup | ? DisplayName -eq $group).Id
      }
      ```

   1. Get the object ID of the user(s) and add them to an array to by running the following command. This example uses the user principal name (UPN):

      ```azurepowershell
      # Add a comma-separated list of user principal names
      $users = "user1@contoso.com","user2@contoso.com"

      # Connect to Azure AD
      Connect-MgGraph -Scopes 'User.Read.All'

      # Create an array and add the ID for each user
      $Ids = @()

      foreach ($user in $users) {
          $Ids += (Get-MgUser | ? UserPrincipalName -eq $user).Id
      }
      ```

1. Once you have the object IDs of the users or groups, you can add them to or remove them from the application by using one of the following examples, which assigns the [Desktop Virtualization User](rbac.md#desktop-virtualization-user) RBAC role. You can also assign the Desktop Virtualization User RBAC role to your groups or users using the [New-AzRoleAssignment](../role-based-access-control/role-assignments-powershell.md) cmdlet.

   1. To add the groups or users to the application, run the following command:
      
      ```azurepowershell
      $parameters = @{
          Name = '<AppName>'
          ResourceGroupName = '<ResourceGroupName>'
          Location = '<AzureRegion>'
          PermissionsToAdd = $Ids
      }
      
      Update-AzWvdAppAttachPackage @parameters
      ```

   1. To remove the groups or users to the application, run the following command:

      ```azurepowershell
      $parameters = @{
          Name = '<AppName>'
          ResourceGroupName = '<ResourceGroupName>'
          Location = '<AzureRegion>'
          PermissionsToRemove = $objectIds
      }
      
      Update-AzWvdAppAttachPackage @parameters
      ```

---

> [!NOTE]
> Adding a package, setting it to active, and assigning it to a host pool and users automatically makes the application available in a desktop session. If you want to use RemoteApp, you'll need to add the application to a RemoteApp application group. For more information, see [Publish an MSIX or Appx application with a RemoteApp application group](#publish-an-msix-or-appx-application-with-a-remoteapp-application-group). You can't add MSIX or Appx applications to the desktop application group with app attach.

## Change registration type and state

You can manage your MSIX and Appx packages by changing their [registration type](app-attach-overview.md#application-registration) and [state](app-attach-overview.md#application-state). Select the relevant tab for your scenario and follow the steps.

# [Portal](#tab/portal)

Here's how to change a package's registration type and state using the Azure portal:

1. From the Azure Virtual Desktop overview, select **App attach**. You should see a list of all existing packages within the host pool.

1. Select the name of the package you want to change.

   1. To change the registration type, select **On-demand** or **Log on blocking**, then select **Save**.

   1. To change the state, select **Inactive** or **Active**, then select **Save**.

# [Azure PowerShell](#tab/powershell)

Here's how to change a package's registration type and state using the [Az.DesktopVirtualization](/powershell/module/az.desktopvirtualization/) PowerShell module.

1. In the same PowerShell session, you can change the registration type and state by running the following commands:

   1. Change the registration type by running the following command. Set `IsRegularRegistration` to `$true` for **Log on blocking** or `$false` for **On-demand**.

      ```azurepowershell
      $parameters = @{
          FullName = '<FullName>'
          HostPoolName = '<HostPoolName>'
          ResourceGroupName = '<ResourceGroupName>'
          Location = '<AzureRegion>'
          IsRegularRegistration = $true
      }
      
      Update-AzWvdAppAttachPackage @parameters
      ``` 

   1. Change the state by running the following command. Set `IsActive` to `$true` for **Active** or `$false` for **Inactive**.

      ```azurepowershell
      $parameters = @{
          Name = '<Name>'
          HostPoolName = '<HostPoolName>'
          ResourceGroupName = '<ResourceGroupName>'
          Location = '<AzureRegion>'
          IsActive = $true
      }
      
      Update-AzWvdAppAttachPackage @parameters
      ```

---

## Publish an MSIX or Appx application with a RemoteApp application group

You can make MSIX and Appx applications available to users by publishing them with a RemoteApp application group. You don't need to add applications to a desktop application group when using app attach as you only need to [Assign an app attach package](#assign-an-app-attach-package). The application you want to publish must be assigned to a host pool.

# [Portal](#tab/portal)

Here's how to add an application from the package you added in this article to a RemoteApp application group using the Azure portal:

1. From the Azure Virtual Desktop overview, select **Application groups**, then select the RemoteApp application group you want to add an application to.

1. Select **Applications**, select **+ Add**. Make sure you have at least one session host powered on in the host pool the application group is assigned to.

1. On the **Basics** tab, complete the following information:

   | Parameter | Value/Description |
   |--|--|
   | Application source | Select **App Attach** from the drop-down list. If you want to add applications from the *Start menu* or by specifying a file path, see [Publish applications with RemoteApp](publish-applications.md).  |
   | Package | Select a package available for the host pool from the drop-down list. Regional packages are from *app attach*. |
   | Application | Select an application from the drop-down list. |
   | Application identifier | Enter a unique identifier for the application. |
   | Display name | Enter a friendly name for the application that is to users. |
   | Description | Enter a description for the application. |

   Once you've completed this tab, select **Next**.

1. On the **Icon** tab, select **Default** to use the default icon for the application, or select **File path** to use a custom icon. For **File path**, select one of the following options:

      - **Browse Azure Files** to use an icon from an Azure file share. Select **Select a storage account** and select the storage account containing your icon file, then select **Select icon file**. Browse to the file share and directory your icon is in, check the box next to the icon you want to add, for example `MyApp.ico`, then select **Select**. You can also use a `.png` file. For **Icon index**, specify the index number for the icon you want to use. This number is usually **0**.
      
      - **UNC file path** to use an icon from a file share. For **Icon path**, enter the UNC path to your icon file, for example `\\MyFileShare\MyApp.ico`. You can also use a `.png` file. For **Icon index**, specify the index number for the icon you want to use. This number is usually **0**.

   Once you've completed this tab, select **Review + add**.

1. On the **Review + add** tab, ensure validation passes and review the information that is used to add the application, then select **Add** to add the application to the RemoteApp application group.

# [Azure PowerShell](#tab/powershell)

Here's how to add an application from the package you added in this article to a RemoteApp application group using the [Az.DesktopVirtualization](/powershell/module/az.desktopvirtualization/) PowerShell module.

1. In the same PowerShell session, if there are multiple applications in the package, you need to get the application ID of the application you want to add from the package by running the following command:

   ```azurepowershell
   Write-Host "These are the application IDs available in the package. Many packages only contain one application." -ForegroundColor Yellow
   $app.ImagePackageApplication.AppId
   ```
   
1. Make a note of the application ID you want to publish (for example `App`), then run the following commands to add the application to the RemoteApp application group:
      
   ```azurepowershell
   $parameters = @{
       Name = '<ApplicationName>'
       ApplicationType = 'MsixApplication'
       MsixPackageFamilyName = $app.ImagePackageFamilyName
       MsixPackageApplicationId = '<ApplicationID>'
       GroupName = '<ApplicationGroupName>'
       ResourceGroupName = '<ResourceGroupName>'
       CommandLineSetting = 'DoNotAllow'
   }

   New-AzWvdApplication @parameters
   ```

1. Verify the list of applications in the application group by running the following command:

   ```azurepowershell
   $parameters = @{
       GroupName = '<ApplicationGroupName>'
       ResourceGroupName = '<ResourceGroupName>'
   }
   
   Get-AzWvdApplication @parameters
   ```

---

## Update an existing package

You can update an existing package by supplying a new image containing the updated application. For more information, see [New versions of applications](app-attach-overview.md#new-versions-of-applications).

To update an existing package in-place, select the relevant tab for your scenario and follow the steps.

# [Portal](#tab/portal)

Here's how to update an existing package using the Azure portal:

1. From the Azure Virtual Desktop overview, select **App attach**. You should see a list of all existing packages.

1. Select the package you want to update, then from the overview, select **Update**.

1. Enter the information for the updated package:

   1. **Subscription** and **Resource group** are prepopulated with the values for the current package.
   
   1. Select the **Host pool** for which you want to update the package.
   
   1. Select the image path from **Select from storage account** or **Input UNC**. Subsequent fields depend on which option you select.
      1. For **Select from storage account**, select the **Storage account** containing the updated image. Select **Select a file**, then browse to the file share and directory your image is in. Check the box next to the image you want to add, for example `MyApp.cim`, then select **Select**.
      1. For **Input UNC**, enter the UNC path to your image file.

   1. For **MSIX package**, select the MSIX or Appx package from the image.

1. Once you've completed the fields, select **Update**.

# [Azure PowerShell](#tab/powershell)

Here's how to update an existing package using the [Az.DesktopVirtualization](/powershell/module/az.desktopvirtualization/) PowerShell module.

1. In the same PowerShell session, get the properties of the updated application and store them in a variable by running the following command:

   ```azurepowershell
   # Get the properties of the application
   $parameters = @{
       HostPoolName = '<HostPoolName>'
       ResourceGroupName = '<ResourceGroupName>'
       Path = '<UNCPathToImageFile>'
   }

   $app = Import-AzWvdAppAttachPackageInfo @parameters
   ```

1. Check you only have one object in the application properties by running the following command:

   ```azurepowershell
   $app | FL *
   ```

   If you have more than one object in the output, for example an x64 and an x86 version of the same application, you can use the parameter `PackageFullName` to specify which one you want to add by running the following command:

   ```azurepowershell
   # Specify the package full name
   $packageFullName = '<PackageFullName>'

   # Get the properties of the application
   $parameters = @{
       HostPoolName = '<HostPoolName>'
       ResourceGroupName = '<ResourceGroupName>'
       Path = '<UNCPathToImageFile>'
   }

   $app = Import-AzWvdAppAttachPackageInfo @parameters | ? ImagePackageFullName -like *$packageFullName*
   ```

1. Update an existing package by running the following command. The new disk image supersedes the existing one, but existing assignments are kept. Don't delete the existing image until users have stopped using it.

   ```azurepowershell
   $parameters = @{
       Name = '<PackageName>'
       ResourceGroupName = '<ResourceGroupName>'
   }

   Update-AzWvdAppAttachPackage -AppAttachPackage $app @parameters
   ```

---

## Remove an app attach package

You can remove an app attach package that you no longer need. You don't need to unassign host pools or users and groups first. Select the relevant tab for your scenario and follow the steps.

> [!TIP]
> You can also remove an application in an MSIX package published as a RemoteApp from an application group the same way as other application types. For more information, see [Remove applications](manage-app-groups.md#remove-applications).

# [Portal](#tab/portal)

Here's how to remove an app attach package using the Azure portal:

1. From the Azure Virtual Desktop overview, select **App attach**. You should see a list of all existing packages.

1. Check the box next to the name of the package you want to remove, then select **Remove**. The package is also removed from any host pools it's assigned to.

# [Azure PowerShell](#tab/powershell)

Here's how to remove an app attach package using the [Az.DesktopVirtualization](/powershell/module/az.desktopvirtualization/) PowerShell module.

1. In the same PowerShell session, run the following command to remove the package containing an application:

   ```azurepowershell
   $parameters = @{
       Name = '<PackageName>'
       ResourceGroupName = '<ResourceGroupName>'
   }

   Remove-AzWvdAppAttachPackage @parameters
   ``` 

---

::: zone-end

::: zone pivot="msix-app-attach"
## Add an MSIX image to a host pool

To add an MSIX image to a host pool, select the relevant tab for your scenario and follow the steps.

# [Portal](#tab/portal)

Here's how to add an MSIX image using the Azure portal:

1. Sign in to the [Azure portal](https://portal.azure.com/).

1. In the search bar, type *Azure Virtual Desktop* and select the matching service entry to go to the Azure Virtual Desktop overview.

1. Select **Host pools**, then select the name of the host pool you want to add an MSIX image to.

1. From the host pool overview, select **MSIX packages**, then select **+ Add**.

1. For **MSIX image path**, enter a valid UNC path pointing to the MSIX image on the file share, for example, `\\fileshare\Apps\MyApp\MyApp.cim`, then select **Add**, which checks the path is valid.

1. Once the path has been verified, more fields appear. Complete the following information:

   | Parameter | Description |
   |--|--|
   | MSIX package | Select the relevant MSIX package name from the drop-down menu. |
   | Package applications | This shows **App** and isn't configurable. |
   | Display name | Enter a friendly name for your package. |
   | Version | Check the expected version number is shown. |
   | Registration type | Select the [registration type](app-attach-overview.md#application-registration) you want to use. |
   | State | Select the initial [state](app-attach-overview.md#application-state) for the package. |

1. Once you've completed the fields, select **Add**.

# [Azure PowerShell](#tab/powershell)

Here's how to add an MSIX package using the [Az.DesktopVirtualization](/powershell/module/az.desktopvirtualization/) PowerShell module.

> [!IMPORTANT]
> In the following examples, you'll need to change the `<placeholder>` values for your own.

[!INCLUDE [include-cloud-shell-local-powershell](includes/include-cloud-shell-local-powershell.md)]

2. Get the properties of the application in the MSIX image you want to add and store them in a variable by running the following command:

   ```azurepowershell
   # Get the properties of the MSIX image
   $parameters = @{
       HostPoolName = '<HostPoolName>'
       ResourceGroupName = '<ResourceGroupName>'
       Uri = '<UNCPathToImageFile>'
   }

   $app = Expand-AzWvdMsixImage @parameters
   ```

   The output should be similar to the following output:

   ```output
   Name
   ----
   hp01/expandmsiximage
   ```

3. Check you only have one object in the application properties by running the following command:

   ```azurepowershell
   $app | FL *
   ```

   If you have more than one object in the output, for example an x64 and an x86 version of the same application, you can use the parameter `PackageFullName` to specify which one you want to add by running the following command:

   ```azurepowershell
   # Specify the package full name
   $packageFullName = '<PackageFullName>'

   # Get the properties of the application
   $parameters = @{
       HostPoolName = '<HostPoolName>'
       ResourceGroupName = '<ResourceGroupName>'
       Uri = '<UNCPathToImageFile>'
   }

   $app = Expand-AzWvdMsixImage @parameters | ? PackageFullName -like *$packageFullName*
   ```

4. Add the MSIX image to a host pool by running the following command. In this example, the [application state](app-attach-overview.md#application-state) is marked as *active*.

   ```azurepowershell
   $parameters = @{
       HostPoolName = '<HostPoolName>'
       ResourceGroupName = '<ResourceGroupName>'
       PackageAlias = $app.PackageAlias
       DisplayName = '<DisplayName>'
       ImagePath = $app.ImagePath
       IsActive = $true
   }
   
   New-AzWvdMsixPackage @parameters
   ```

   There's no output when the MSIX package is added successfully.

5. You can verify the MSIX package is added by running the following command:

   ```azurepowershell
   $parameters = @{
       HostPoolName = '<HostPoolName>'
       ResourceGroupName = '<ResourceGroupName>'
   }
   
   Get-AzWvdMsixPackage @parameters | ? PackageFamilyName -eq $app.PackageFamilyName | FL *
   ```

   The output should be similar to the following output:

   ```output
   DisplayName                  : My App
   Id                           : /subscriptions/00000000-0000-0000-0000-000000000000/resourcegroups/avd/providers/Microsoft.DesktopVirtualization/hostpools/hp01/msixpackages/MyApp_1.0.0.0_neutral__abcdef123ghij
   ImagePath                    : \\fileshare\Apps\MyApp\MyApp.cim
   IsActive                     : True
   IsRegularRegistration        : False
   LastUpdated                  : 7/27/2023 10:02:29 AM
   Name                         : hp01/MyApp_1.0.0.0_neutral__abcdef123ghij
   PackageApplication           : {MyApp}
   PackageDependency            : {}
   PackageFamilyName            : MyApp_abcdef123ghij
   PackageName                  : MyApp
   PackageRelativePath          : apps\MyApp_1.0.0.0_neutral__abcdef123ghij
   SystemDataCreatedAt          : 7/28/2023 9:04:00 AM
   SystemDataCreatedBy          : avdadmin@contoso.com
   SystemDataCreatedByType      : User
   SystemDataLastModifiedAt     : 7/28/2023 9:04:00 AM
   SystemDataLastModifiedBy     : avdadmin@contoso.com
   SystemDataLastModifiedByType : User
   Type                         : Microsoft.DesktopVirtualization/hostpools/msixpackages
   Version                      : 1.0.0.0
   ```

---

## Change registration type and state

You can manage MSIX packages in your host pool by changing their [registration type](app-attach-overview.md#application-registration) and [state](app-attach-overview.md#application-state). Select the relevant tab for your scenario and follow the steps.

# [Portal](#tab/portal)

Here's how to change a package's registration type and state using the Azure portal:

1. From the Azure Virtual Desktop overview, select **Host pools**, then select the name of the host pool the MSIX package is added to.

1. From the host pool overview, select **MSIX packages**. You should see a list of all existing MSIX packages within the host pool.

1. Select the name of the MSIX package you want to change.

   1. To change the registration type, select **On-demand** or **Log on blocking**, then select **Save**.

   1. To change the state, select **Inactive** or **Active**, then select **Save**.

# [Azure PowerShell](#tab/powershell)

Here's how to change a package's registration type and state using the [Az.DesktopVirtualization](/powershell/module/az.desktopvirtualization/) PowerShell module.

1. In the same PowerShell session, get a list of MSIX packages on a host pool and their current registration type and state by running the following command:

   ```azurepowershell
   $parameters = @{
       HostPoolName = '<HostPoolName>'
       ResourceGroupName = '<ResourceGroupName>'
   }
   
   Get-AzWvdMsixPackage @parameters | Select-Object DisplayName, ImagePath, Name, Version, IsRegularRegistration, IsActive
   ```

   The output should be similar to the following output:

   ```output
   DisplayName ImagePath                        Name                                      Version IsRegularRegistration IsActive
   ----------- ---------                        -----------------                         ------- --------------------- --------
   My App      \\fileshare\Apps\MyApp\MyApp.cim hp01/MyApp_1.0.0.0_neutral__abcdef123ghij 1.0.0.0                 False     True
   ```

1. Find the package you want to remove and use the value for the `Name` parameter, but remove the **host pool name** and `/` from the start. For example, `hp01/MyApp_1.0.0.0_neutral__abcdef123ghij` becomes `MyApp_1.0.0.0_neutral__abcdef123ghij`. Here are a couple of examples.

   1. Change the registration type by running the following command. Set `IsRegularRegistration` to `$true` for **Log on blocking** or `$false` for **On-demand**.

      ```azurepowershell
      $parameters = @{
          FullName = '<FullName>'
          HostPoolName = '<HostPoolName>'
          ResourceGroupName = '<ResourceGroupName>'
          IsRegularRegistration = $true
      }
      
      Update-AzWvdMsixPackage @parameters
      ``` 

   1. Change the state by running the following command. Set `IsActive` to `$true` for **Active** or `$false` for **Inactive**.

      ```azurepowershell
      $parameters = @{
          FullName = '<FullName>'
          HostPoolName = '<HostPoolName>'
          ResourceGroupName = '<ResourceGroupName>'
          IsActive = $true
      }
      
      Update-AzWvdMsixPackage @parameters
      ``` 
---

## Publish an MSIX application

You can make MSIX applications available to users as part of a desktop or RemoteApp application group. A desktop application group makes the applications available in a user's start menu, whereas a RemoteApp application group means a user can stream them individually. For more information about application groups, see [Terminology](terminology.md#application-groups). Select the relevant tab for your scenario and follow the steps.

# [Portal](#tab/portal)

Here's how to add an application from the package you added in this article to a RemoteApp application group using the Azure portal:

1. From the Azure Virtual Desktop overview, select **Application groups**, then select the Desktop or RemoteApp application group you want to add an application to.

1. Select **Applications**, select **+ Add**. Make sure you have at least one session host powered on in the host pool the application group is assigned to.

1. On the **Basics** tab, the options you see depend on whether your application group is for a Desktop or a RemoteApp:

   1. For a Desktop application group, complete the following information:

      | Parameter | Value/Description |
      |--|--|
      | Application source | **MSIX package** is automatically selected and greyed out.  |
      | Package | Select a package available for the host pool from the drop-down list. |
      | Application identifier | Enter a unique identifier for the application. |
      | Display name | Enter a friendly name for the application that is to users. |
      | Description | Enter a description for the application. |

      Once you've completed this tab, select **Review + add**.

   1. For a RemoteApp application group, complete the following information:

      | Parameter | Value/Description |
      |--|--|
      | Application source | Select **App Attach** from the drop-down list. If you want to add applications from the *Start menu* or by specifying a file path, see [Publish applications with RemoteApp](publish-applications.md).  |
      | Package | Select a package available for the host pool from the drop-down list. Host pool packages are from *MSIX app attach*. |
      | Application | Select an application from the drop-down list. |
      | Application identifier | Enter a unique identifier for the application. |
      | Display name | Enter a friendly name for the application that is to users. |
      | Description | Enter a description for the application. |

      Once you've completed this tab, select **Next**.

      On the **Icon** tab, select **Default** to use the default icon for the application, or select **File path** to use a custom icon. For **File path**, select one of the following options:

         - **Browse Azure Files** to use an icon from an Azure file share. Select **Select a storage account** and select the storage account containing your icon file, then select **Select icon file**. Browse to the file share and directory your icon is in, check the box next to the icon you want to add, for example `MyApp.ico`, then select **Select**. You can also use a `.png` file. For **Icon index**, specify the index number for the icon you want to use. This number is usually **0**.
      
         - **UNC file path** to use an icon from a file share. For **Icon path**, enter the UNC path to your icon file, for example `\\MyFileShare\MyApp.ico`. You can also use a `.png` file. For **Icon index**, specify the index number for the icon you want to use. This number is usually **0**.

      Once you've completed this tab, select **Review + add**.

1. On the **Review + add** tab, ensure validation passes and review the information that is used to add the application, then select **Add** to add the application to the application group.

# [Azure PowerShell](#tab/powershell)

Here's how to add MSIX applications to an application group using the [Az.DesktopVirtualization](/powershell/module/az.desktopvirtualization) PowerShell module.

1. In the same PowerShell session, add an MSIX application to an application group by running the commands in one of the following examples.

   1. To add an MSIX application to a desktop application group, run the following commands:

      ```azurepowershell
      $parameters = {
          Name = '<ApplicationName>'
          ApplicationType = 'MsixApplication'
          MsixPackageFamilyName = $app.PackageFamilyName
          GroupName = '<ApplicationGroupName>'
          ResourceGroupName = '<ResourceGroupName>'
          CommandLineSetting = 'DoNotAllow'
      }
      
      New-AzWvdApplication @parameters
      ```

   1. To add an MSIX application to a RemoteApp application group, if there are multiple applications in the package, you need to get the application ID of the application you want to add from the package by running the following command:

      ```azurepowershell
      Write-Host "These are the application IDs available in the package. Many packages only contain one application." -ForegroundColor Yellow
      $app.ImagePackageApplication.AppId
      ```

      Make a note of the application ID you want to publish (for example `App`), then run the following commands to add the application to the RemoteApp application group:

      ```azurepowershell
      $parameters = @{
          Name = '<ApplicationName>'
          ApplicationType = 'MsixApplication'
          MsixPackageFamilyName = $app.PackageFamilyName
          MsixPackageApplicationId = '<ApplicationID>'
          GroupName = '<ApplicationGroupName>'
          ResourceGroupName = '<ResourceGroupName>'
          CommandLineSetting = 'DoNotAllow'
      }

      New-AzWvdApplication @parameters
      ```

      Verify the list of applications in the application group by running the following command:

      ```azurepowershell
      $parameters = @{
          GroupName = '<ApplicationGroupName>'
          ResourceGroupName = '<ResourceGroupName>'
      }

      Get-AzWvdApplication @parameters
      ```

---

## Remove an MSIX package

You can remove an MSIX package that you no longer need. Select the relevant tab for your scenario and follow the steps.

> [!TIP]
> You can also remove only an application in an MSIX package from an application group the same way as other application types. For more information, see [Remove applications](manage-app-groups.md#remove-applications).

# [Portal](#tab/portal)

Here's how to remove an MSIX package from your host pool using the Azure portal:

1. From the Azure Virtual Desktop overview, select **Host pools**, then select the name of the host pool the MSIX package is added to.

1. From the host pool overview, select **MSIX packages**. You should see a list of all existing MSIX packages within the host pool.

1. Check the box next to the name of the MSIX package you want to remove, then select **Remove**.

# [Azure PowerShell](#tab/powershell)

Here's how to remove applications using the [Az.DesktopVirtualization](/powershell/module/az.desktopvirtualization/) PowerShell module.

1. In the same PowerShell session, get a list of MSIX packages on a host pool by running the following command:

   ```azurepowershell
   $parameters = @{
       HostPoolName = '<HostPoolName>'
       ResourceGroupName = '<ResourceGroupName>'
   }
   
   Get-AzWvdMsixPackage @parameters | Select-Object DisplayName, ImagePath, PackageFamilyName, Version
   ```

   The output should be similar to the following output:

   ```output
   DisplayName ImagePath                        Name                                      Version
   ----------- ---------                        -----------------                         -------
   My App      \\fileshare\Apps\MyApp\MyApp.cim hp01/MyApp_1.0.0.0_neutral__abcdef123ghij 1.0.0.0
   ```

1. Find the package you want to remove and use the value for the `Name` parameter, but remove the **host pool name** and `/` from the start. For example, `hp01/MyApp_1.0.0.0_neutral__abcdef123ghij` becomes `MyApp_1.0.0.0_neutral__abcdef123ghij`. Then remove the package by running the following command:

   ```azurepowershell
   $parameters = @{
       FullName = '<FullName>'
       HostPoolName = '<HostPoolName>'
       ResourceGroupName = '<ResourceGroupName>'
   }

   Remove-AzWvdMsixPackage @parameters
   ``` 

---

::: zone-end

## Disable automatic updates
::: zone pivot="app-attach"
We recommend that you disable automatic updates for MSIX and Appx applications. To disable automatic updates, you need set the following registry values on your session hosts:
::: zone-end

::: zone pivot="msix-app-attach"
We recommend that you disable automatic updates for MSIX applications. To disable automatic updates, you need set the following registry values on your session hosts:
::: zone-end

- **Key**: HKLM\Software\Policies\Microsoft\WindowsStore
   - **Type**: DWORD
   - **Name**: AutoDownload
   - **Value**: 2
   - **Description**: Disables Microsoft Store automatic update.

- **Key**: HKCU\Software\Microsoft\Windows\CurrentVersion\ContentDeliveryManager
   - **Type**: DWORD
   - **Name**: PreInstalledAppsEnabled
   - **Value**: 0
   - **Description**: Disables content delivery automatic download.

- **Key**: HKLM\SOFTWARE\Microsoft\Windows\CurrentVersion\ContentDeliveryManager\Debug
   - **Type**: DWORD
   - **Name**: ContentDeliveryAllowedOverride
   - **Value**: 2
   - **Description**: Disables content delivery automatic download.


You can set these registry values using Group Policy or Intune, depending on how your session hosts are managed. You can also set them by running the following PowerShell commands as an administrator on each session host, but if you do this, you should also set them in your operating system image:

```powershell
# Disable Microsoft Store automatic update
If (!(Test-Path "HKLM:\Software\Policies\Microsoft\WindowsStore")) {
    New-Item -Path "HKLM:\Software\Policies\Microsoft\WindowsStore" -Force
}
New-ItemProperty -Path "HKLM:\Software\Policies\Microsoft\WindowsStore" -Name AutoDownload -PropertyType DWORD -Value 2 -Force

# Disable content delivery automatic download
If (!(Test-Path "HKCU:\Software\Microsoft\Windows\CurrentVersion\ContentDeliveryManager")) {
    New-Item -Path "HKCU:\Software\Microsoft\Windows\CurrentVersion\ContentDeliveryManager" -Force
}
New-ItemProperty -Path "HKCU:\Software\Microsoft\Windows\CurrentVersion\ContentDeliveryManager" -Name PreInstalledAppsEnabled -PropertyType DWORD -Value 0 -Force

# Disables content delivery automatic download
If (!(Test-Path "HKLM:\SOFTWARE\Microsoft\Windows\CurrentVersion\ContentDeliveryManager\Debug")) {
    New-Item -Path "HKLM:\SOFTWARE\Microsoft\Windows\CurrentVersion\ContentDeliveryManager\Debug" -Force
}
New-ItemProperty -Path "HKLM:\SOFTWARE\Microsoft\Windows\CurrentVersion\ContentDeliveryManager\Debug" -Name ContentDeliveryAllowedOverride -PropertyType DWORD -Value 2 -Force
```

## Next steps

Learn how to publish applications from the start menu or a file path with RemoteApp. For more information, see [Publish applications](publish-applications.md).
