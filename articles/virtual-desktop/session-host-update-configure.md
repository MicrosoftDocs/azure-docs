---
title: Update session hosts in a host pool with a session host configuration in Azure Virtual Desktop (preview) - Azure Virtual Desktop
description: Learn how to update session hosts in a host pool with a session host configuration using session host update in Azure Virtual Desktop.
ms.topic: how-to
author: dknappettmsft
ms.author: daknappe
ms.date: 10/01/2024
---

# Update session hosts using session host update in Azure Virtual Desktop (preview)

> [!IMPORTANT]
> Session host update for Azure Virtual Desktop is currently in PREVIEW. See the [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/) for legal terms that apply to Azure features that are in beta, preview, or otherwise not yet released into general availability.

When you want to update session hosts in a host pool with a session host configuration, you use session host update. Session host update enables you to update the underlying virtual machine (VM) image, size, disk type, and other configuration properties. During an update, the existing virtual machines are deleted or deallocated, and new ones are created with the updated configuration stored in the session host configuration. The update also uses the values from the session host management policy to determine how session hosts should get updated.

This article shows you how to update a host pool's session host configuration, update the session hosts in that pool, and how to monitor the progress of an update using the Azure portal and Azure PowerShell.

To learn more about how session host update works, see [Session host update](session-host-update.md).

## Prerequisites

Before you update session hosts using session host update, you need:

- An existing pooled host pool with a session host configuration with session hosts that are all in the same Azure region and resource group. Personal host pools aren't supported.

- The new image must be [supported for Azure Virtual Desktop](prerequisites.md#operating-systems-and-licenses) and match the [generation of virtual machine](/azure/virtual-machines/generation-2). If you're using [Trusted launch virtual machines](security-guide.md#trusted-launch) or [Confidential virtual machines](security-guide.md#azure-confidential-computing-virtual-machines), your image must be for generation 2 VMs. It can be from:

   - Azure Marketplace.
   - An existing Azure Compute Gallery shared image. We recommend having at least two replicas of the image you use.
   - An existing managed image.

- Remove any resource locks on session hosts or the resource group they're in.

- Assign the Azure Virtual Desktop service principal the [**Desktop Virtualization Virtual Machine Contributor**](rbac.md#desktop-virtualization-virtual-machine-contributor) role-based access control (RBAC) role on the resource group or subscription with the host pools and session hosts you want to use with session host update. For more information, see [Assign Azure RBAC roles or Microsoft Entra roles to the Azure Virtual Desktop service principals](service-principal-assign-roles.md).

- An Azure account you use to configure session host update with the following Azure RBAC roles to update the following resource types. You can also use another built-in role that includes the same permissions, or create a custom role.

   | Resource type | Built-in Azure RBAC role | Scope |
   |--|--|--|
   | Host pool | [Desktop Virtualization Host Pool Contributor](rbac.md#desktop-virtualization-host-pool-contributor)<br />[Desktop Virtualization Application Group Contributor](rbac.md#desktop-virtualization-application-group-contributor) | Resource group or subscription |
   | Session hosts | [Virtual Machine Contributor](../role-based-access-control/built-in-roles.md#virtual-machine-contributor) | Resource group or subscription |

- You can only join session hosts to an Active Directory domain. Joining session hosts to Microsoft Entra ID isn't supported, but you can use [Microsoft Entra hybrid join](/entra/identity/devices/concept-hybrid-join).

   - If you're joining session hosts to a Microsoft Entra Domain Services domain, you need to be a member of the [*AAD DC Administrators* group](../active-directory-domain-services/tutorial-create-instance-advanced.md#configure-an-administrative-group).

   - If you're joining session hosts to an Active Directory Domain Services (AD DS) domain, you need to use an account with more permissions than typically required for joining a domain because the new OS image reuses the existing computer object. The permissions and properties in the following table need to be applied to the account on the Organizational Unit (OU) containing your session hosts:

      | Name | Type | Applies to |
      |--|--|--|
      | Reset password | Allow | Descendant Computer objects |
      | Validated write to DNS host name | Allow | Descendant Computer objects |
      | Validated write to service principal name | Allow | Descendant Computer objects |
      | Read account restrictions | Allow | Descendant Computer objects |
      | Write account restrictions | Allow | Descendant Computer objects |

      Beginning with [KB5020276](https://support.microsoft.com/help/5020276), further protections were introduced for the reuse of computer accounts in an Active Directory domain. To successfully reuse the existing computer object for the session host, either:

      - The user account joining the session host to the domain is the creator of the existing computer account.
      - The computer account was created by a member of the domain administrators security group.
      - Apply the Group Policy setting `Domain controller: Allow computer account re-use during domain join` to the owner of the computer account. For more information on the scope of this setting, see [KB5020276](https://support.microsoft.com/help/5020276).

- A key vault containing the secrets you want to use for your virtual machine local administrator account credentials and, if you're joining session hosts to an Active Directory domain, your domain join account credentials. You need one secret for each username and password. The virtual machine local administrator password must meet the [password requirements when creating a VM](/azure/virtual-machines/windows/faq#what-are-the-password-requirements-when-creating-a-vm-).

   - You need to provide the Azure Virtual Desktop service principal the ability to read the secrets. Your key vault can be configured to use either:

      - [The Azure RBAC permission model](/azure/key-vault/general/rbac-guide) with the role [Key Vault Secrets User](../role-based-access-control/built-in-roles.md#key-vault-secrets-user) assigned to the Azure Virtual Desktop service principal.

      - [An access policy](/azure/key-vault/general/assign-access-policy) with the *Get* secret permission assigned to the Azure Virtual Desktop service principal.

   - The key vault must allow [Azure Resource Manager for template deployment](../azure-resource-manager/managed-applications/key-vault-access.md#enable-template-deployment).

   See [Assign Azure RBAC roles or Microsoft Entra roles to the Azure Virtual Desktop service principals](service-principal-assign-roles.md) to make sure you're using the correct service principal.

- For any custom configuration PowerShell scripts you specify in the session host configuration to run after an update, the URL to the script must be resolvable from the public internet.

- If you want to use Azure PowerShell locally, see [Use Azure CLI and Azure PowerShell with Azure Virtual Desktop](cli-powershell.md) to make sure you have the [Az.DesktopVirtualization](/powershell/module/az.desktopvirtualization) PowerShell module installed. Alternatively, use the [Azure Cloud Shell](/azure/cloud-shell/overview).

- Azure PowerShell cmdlets for Azure Virtual Desktop that support session host update are in preview. You need to download and install the [preview version of the Az.DesktopVirtualization module](https://www.powershellgallery.com/packages/Az.DesktopVirtualization/) to use these cmdlets, which are added in version 5.3.0.

## Schedule an update and edit a session host configuration

When you schedule an update, the session host configuration for the host pool is used. You need to make changes to the session host configuration when scheduling an update, otherwise your session hosts are redeployed with the same session host configuration values. Any changes you make when scheduling an update are saved to the session host configuration.

To schedule an update for your session hosts, select the relevant tab for your scenario and follow the steps.

> [!IMPORTANT]
> - During an update, the number of available session hosts for user sessions is reduced and any logged on users will be asked to log off. We recommend you schedule an update during less busy periods to minimize disruption to end users.
>
> - If you use a custom network security group (NSG) for the session hosts you want to update, there's a known issue where you can't start an update using the Azure portal. To work around this issue, use Azure PowerShell to start the update.

# [Azure portal](#tab/portal)

Here's how to schedule a new update for your session hosts using the Azure portal.

> [!TIP]
> When you schedule an update using the Azure portal, values are populated from the session host configuration. If this is the first update and a session host configuration hasn't already been created, the portal shows the default session host configuration until the session host configuration is created. Any changes you make to the session host configuration during an update will be saved.
>
> If you edit the session host configuration using the Azure portal, you have to schedule an update.

1. Sign in to the [Azure portal](https://portal.azure.com/).

1. In the search bar, enter *Azure Virtual Desktop* and select the matching service entry.

1. Select **Host pools**, then select the host pool with a session host configuration that you want to update.

1. Select **Session hosts**.

1. If you want to review the session host configuration before you schedule an update, select **Manage session host configuration**, then **View**. Once you review the session host configuration, select **Cancel**.

1. To schedule a new update, select **Manage session host update**, then select **New update**. Alternatively, select **Manage session host configuration**, then **Edit**.

1. On the **Basics** tab, complete the following information:

   | Parameter | Value/Description |
   |--|--|
   | Enable saving original virtual machines after the update | Useful in rollback scenarios, but normal costs apply for storing the original VM's components. |
   | Current host pool size (*read-only*) | The number of session hosts in your host pool. |
   | VM batch size authorized to be removed from the host pool during the update | The maximum number of session hosts that are updated at a time.<br /><br />When the update starts, only one session host, known as the *initial*, is updated first to verify the update process before updating the remaining session hosts in batches. If the update of the initial isn't successful, the update stops. |
   | Session hosts available during the update (*read-only*) | The minimum number of session hosts that are available for user sessions during the update. |

   Once you complete this tab, select **Next: Session hosts**.

1. On the **Session hosts** tab, you can optionally update the following parameters in your session host configuration:

   | Parameter | Value/Description |
   |--|--|
   | Security type | Select from **Standard**, **[Trusted launch virtual machines](/azure/virtual-machines/trusted-launch)**, or **[Confidential virtual machines](../confidential-computing/confidential-vm-overview.md)**.<br /><br />- If you select **Trusted launch virtual machines**, options for **secure boot** and **vTPM** are automatically selected.<br /><br />- If you select **Confidential virtual machines**, options for **secure boot**, **vTPM**, and **integrity monitoring** are automatically selected. You can't opt out of vTPM when using a confidential VM. |
   | Image | Select the OS image you want to use from the list, or select **See all images** to see more, including any custom images you created and stored as an [Azure Compute Gallery shared image](/azure/virtual-machines/shared-image-galleries) or a [managed image](/azure/virtual-machines/windows/capture-image-resource). |
   | Virtual machine size | Select a recommended SKU from the list. If you want to use different SKU, select **See all sizes**, then select from the list. |
   | OS disk type | Select the disk type to use for your session hosts. We recommend you use **Premium SSD** for production workloads.<br /><br />The disk type needs to be supported on the VM family and size selected. Ensure that you're selecting a combination that Azure compute supports. The name of the OS disk of the updated session hosts has a new name in the format `SessionHostName-DateTime_Hash`. |
   | **Domain to join** |  |
   | Select which directory you would like to join | Select **Active Directory**, then select the key vault that contains the secrets for the username and password for the domain join account.<br /><br />You can optionally specify a domain name and organizational unit path. |
   | **Virtual Machine Administrator account** | Complete the relevant parameters by selecting the key vault and secret for the username and password for the local administrator account of the updated session host VMs. The username and password must meet [the requirements for Windows VMs in Azure](/azure/virtual-machines/windows/faq#what-are-the-password-requirements-when-creating-a-vm-). |
   | **Custom configuration** |  |
   | Custom configuration script URL | If you want to run a PowerShell script during deployment you can enter the URL here. |

   Once you review or finish making changes to the session host configuration, select **Next: Schedule**.

1. On the **Schedule** tab, either check the box to **Schedule update now**, or select a date, time, and time zone that you want the update to start, up to a maximum of two weeks from the current time.

   Once you set your schedule, select **Next: Notifications**.

1. On the **Notifications** tab, complete the following information:

   | Parameter | Value/Description |
   |--|--|
   | Minutes before the users are signed out | The amount of time to wait after the update start time for users to be notified to sign out. This value is configurable between 0 and 60 minutes. Users will automatically be logged off after this elapsed time. |
   | Sign out message | A message you can specify to inform users that the session host they're using is about to start updating. |

   Once you complete this tab, select **Next: Review**.

1. On the **Review** tab, ensure validation passes and review the information that is used during the update.

1. Select **Update** to schedule the update. When you view the list of session hosts, the column **Current Version** shows the timestamp of the version of the session host configuration that the session host is using. If the **Current Version** column has a warning icon, it means the timestamp of the version in the column **Target Version** is later and the session host needs to be updated.

> [!NOTE]
> The first time you schedule an update, the settings you provide overwrite the default settings in the [session host management policy](host-pool-management-approaches.md#session-host-management-policy). Subsequent updates will have those parameters pre-populated and any changes are saved.

# [Azure PowerShell](#tab/powershell)

Here's how to schedule a new update for your session hosts using the [Az.DesktopVirtualization](/powershell/module/az.desktopvirtualization) PowerShell module. When you schedule an update, the session host configuration for the host pool is used. You need to make changes to the session host configuration before scheduling an update.

You can update the session host management policy before you schedule an update, where the changes persist for future use. Alternatively you can override the values in the session host management policy when scheduling an update, but they only apply to that update.

> [!IMPORTANT]
> In the following examples, you'll need to change the `<placeholder>` values for your own.

[!INCLUDE [include-cloud-shell-local-powershell](includes/include-cloud-shell-local-powershell.md)]

2. Use the `Update-AzWvdSessionHostConfiguration` cmdlet to update the session host configuration, where you only need to specify the parameters you want to change. Here are some example commands:

   - To specify a different custom image for your session hosts to use, run the following command. For information about how to find the values for the Marketplace image, see [Find and use Azure Marketplace VM images with Azure PowerShell](/azure/virtual-machines/windows/cli-ps-findimage).

      ```azurepowershell
      $parameters = @{
          HostPoolName = '<HostPoolName>'
          ResourceGroupName = '<ResourceGroupName>'
          ImageInfoType = 'Custom'
          CustomInfoResourceID  = '/subscriptions/<SubscriptionID>/resourceGroups/<ResourceGroupName>/providers/Microsoft.Compute/galleries/<GalleryName>/images/<ImageName>/versions/<ImageVersion>'
      }

      Update-AzWvdSessionHostConfiguration @parameters
      ```

   - To change the key vault and secret that stores the password for the local administrator account, run the following command:

      ```azurepowershell
      $parameters = @{
          HostPoolName = '<HostPoolName>'
          ResourceGroupName = '<ResourceGroupName>'
          VMAdminCredentialsUsernameKeyVaultSecretUri = 'https://<VaultName>.vault.azure.net/secrets/<SecretName>/<Version>'
          VMAdminCredentialsPasswordKeyVaultSecretUri = 'https://<VaultName>.vault.azure.net/secrets/<SecretName>/<Version>'
      }

      Update-AzWvdSessionHostConfiguration @parameters
      ```

   - To change the virtual machine size to **D8s_v5** and OS disk type to **Premium SSD**, run the following command. The name of the OS disk of the updated session hosts has a new name in the format `SessionHostName-DateTime_Hash`.

      ```azurepowershell
      $parameters = @{
          HostPoolName = '<HostPoolName>'
          ResourceGroupName = '<ResourceGroupName>'
          VMSizeId = 'Standard_D8s_v5'
          DiskInfoType = 'Premium_LRS'
      }

      Update-AzWvdSessionHostConfiguration @parameters
      ```

   View the session host configuration to verify the changes by running the following command:

   ```azurepowershell
   $parameters = @{
       HostPoolName = '<HostPoolName>'
       ResourceGroupName = '<ResourceGroupName>'
   }

   Get-AzWvdSessionHostConfiguration @parameters | FL *
   ```

3. *Optional*: If you want to update the session host management policy before scheduling an update, run the following command, using the `Update-AzWvdSessionHostManagement` cmdlet. Alternatively, you can override specific values when scheduling an update, which are used for that update only. For valid time zone values, see [Get-TimeZone PowerShell reference](/powershell/module/microsoft.powershell.management/get-timezone) and use the value from the `StandardName` property.

   ```azurepowershell
   $parameters = @{
       HostPoolName = '<HostPoolName>'
       ResourceGroupName = '<ResourceGroupName>'
       ScheduledDateTimeZone = '<TimeZoneID>'
       UpdateDeleteOriginalVM = <$true or $false>
       UpdateMaxVmsRemoved = '<Quantity>'
       UpdateLogOffDelayMinute = '<Minutes>'
       UpdateLogOffMessage = '<Message>'
   }

   Update-AzWvdSessionHostManagement @parameters
   ```

   You can view the properties of the updated session host management policy by running the following command:

   ```azurepowershell
   $parameters = @{
       HostPoolName = '<HostPoolName>'
       ResourceGroupName = '<ResourceGroupName>'
   }

   Get-AzWvdSessionHostManagement @parameters
   ```

4. To schedule an update, use the `Invoke-AzWvdInitiateSessionHostUpdate` cmdlet with the following examples. You can schedule an update to start immediately or specify a time that you want the update to start, up to a maximum of two weeks. Here are some example commands:

   - To schedule an update to start immediately and use the values from the session host management policy, run the following command:

      ```azurepowershell
      $parameters = @{
          HostPoolName = '<HostPoolName>'
          ResourceGroupName = '<ResourceGroupName>'
      }

      $update = Invoke-AzWvdInitiateSessionHostUpdate @parameters
      ```

   - To schedule an update at a specified time and date (in the format *YYYY-MM-DD HH:mm*), and use the values from the session host management policy, run the following command.

      ```azurepowershell
      $dateTime = Get-Date -Date "2024-03-15 01:30"

      $parameters = @{
          HostPoolName = '<HostPoolName>'
          ResourceGroupName = '<ResourceGroupName>'
          ScheduledDateTime = $dateTime
      }

      $update = Invoke-AzWvdInitiateSessionHostUpdate @parameters
      ```

   - To start an update that is scheduled, run the following command:

      ```azurepowershell
      $parameters = @{
          HostPoolName = '<HostPoolName>'
          ResourceGroupName = '<ResourceGroupName>'
          Action = Start
      }

      $update = Invoke-AzWvdInitiateSessionHostUpdate @parameters
      ```

5. You can view the properties of the scheduled update by running the following command:

   ```azurepowershell
   $parameters = @{
       HostPoolName = '<HostPoolName>'
       ResourceGroupName = '<ResourceGroupName>'
       IsLatest = $true
   }

   Get-AzWvdSessionHostManagementsUpdateStatus @parameters | FL *
   ```

---

> [!IMPORTANT]
> - Once an update has been scheduled, you can't edit the schedule or settings. If you need to make any changes, you'll need to cancel the update and schedule a new one.
>
> - Don't remove any VMs from the host pool while the update is ongoing. Doing so may create issues with the ongoing update.
>
> - Don't change the drain mode of any VMs in the host pool while an update is ongoing. The drain mode of the VMs is automatically changed based on which stage of the update it is in. If a session host is not recoverable after an update, its drain mode setting will be enabled. Once the update is complete, the drain mode is reset.
>
> - It takes around 20 minutes for a session host to update. The number of session hosts that you specify in the batch size will be updated concurrently before moving on to the next batch. You should factor the overall completion time into your scheduled time.

## Monitor the progress of an update

Once an update begins, you can check its progress. Select the relevant tab for your scenario and follow the steps.

# [Azure portal](#tab/portal)

Here's how to monitor the progress of an update using the Azure portal.

1. From the Azure Virtual Desktop overview, select **Host pools**, then select the host pool you scheduled an update for.

1. Select **Session hosts**.

1. A blue banner provides the status of the update. It only shows a point in time, so you need to select **Refresh** to check the latest progress.

If you selected to start the update immediately, the message will state that the update is scheduled while it begins, but this message is updated once you refresh. During an update, you see the batch size number of session hosts that are removed from the host pool during the update.

# [Azure PowerShell](#tab/powershell)

Here's how to monitor the progress of an update using the [Az.DesktopVirtualization](/powershell/module/az.desktopvirtualization) PowerShell module.

From your existing PowerShell session, use the `Get-AzWvdSessionHostManagementsUpdateStatus` cmdlet with the following examples to get the detail of the current update.

- To see the progress of the latest update, run the following commands:

   ```azurepowershell
   $parameters = @{
       HostPoolName = '<HostPoolName>'
       ResourceGroupName = '<ResourceGroupName>'
       IsLatest = $true
   }

   $updateProgress = Get-AzWvdSessionHostManagementsUpdateStatus @parameters |
       FL PercentComplete,
       ProgressExecutionStartTime,
       ProgressSessionHostsCompleted,
       ProgressSessionHostsInProgress,
       ProgressSessionHostsRollbackFailed,
       ProgressTotalSessionHost,
       EndTime

   $updateProgress
   ```

- To see all the parameters for the latest update, run the following command:

   ```azurepowershell
   $parameters = @{
       HostPoolName = '<HostPoolName>'
       ResourceGroupName = '<ResourceGroupName>'
       IsLatest = $true
   }
   $updateProgress = Get-AzWvdSessionHostManagementsUpdateStatus @parameters | FL *

   $updateProgress
   ```

---

> [!TIP]
> You can also see the activity of an update using [Azure Monitor activity log](/azure/azure-monitor/essentials/activity-log).

## Pause, resume, cancel, or retry an update

You can pause, resume, or cancel an update that is in progress. If you pause or cancel an update, the current activity is completed before it pauses the rest of the update. For example, if a batch of session hosts is being updated, the update to these session hosts completes first. The blue banner showing the status of the update changes to show how far the update got when it paused. Once an update is paused, you can only resume it, which continues from the point it was paused.

If you don't resume an update within two weeks, the update is canceled. Once an update is canceled, you can't resume it.

> [!CAUTION]
> If you cancel an update part way through, there will be differences between the session hosts in the host pool, such as a different operating system version, or joined to a different Active Directory domain. This may provide an inconsistent experience to users, so you will need to schedule another update as soon as possible to make sure there is parity across all session hosts.

# [Azure portal](#tab/portal)

Here's how to pause, resume, cancel, or retry an update using the Azure portal.

1. From the Azure Virtual Desktop overview, select **Host pools**, then select the host pool you scheduled an update for.

1. Select **Session hosts**, then select **Manage session host update**.

1. Select **Pause**, **Resume**, **Cancel**, or **Retry** depending on the current state of the update.

1. Select **Refresh** to update the status message in the blue banner. It can take approximately 20 seconds to show the correct status.

# [Azure PowerShell](#tab/powershell)

Here's how to pause, resume, cancel, or retry an update using the [Az.DesktopVirtualization](/powershell/module/az.desktopvirtualization) PowerShell module.

From your existing PowerShell session, use the `Invoke-AzWvdControlSessionHostUpdate` cmdlet with the following examples to pause or resume of the current update.

1. First, check the update status by running the following command:

   ```azurepowershell
   $parameters = @{
       HostPoolName = '<HostPoolName>'
       ResourceGroupName = '<ResourceGroupName>'
       IsLatest = $true
   }

   Get-AzWvdSessionHostManagementsUpdateStatus @parameters | FL Status
   ```

1. Depending on which action you want to take, use one of the following examples.

   - To pause an update, run the following command:

      ```azurepowershell
      $parameters = @{
          HostPoolName = '<HostPoolName>'
          ResourceGroupName = '<ResourceGroupName>'
          Action = 'Pause'
      }

      Invoke-AzWvdControlSessionHostUpdate @parameters
      ```

   - To resume the update, run the following command:

      ```azurepowershell
      $parameters = @{
          HostPoolName = '<HostPoolName>'
          ResourceGroupName = '<ResourceGroupName>'
          Action = 'Resume'
      }

      Invoke-AzWvdControlSessionHostUpdate @parameters
      ```

   - To cancel an update and include a message, run the following command:

      ```azurepowershell
      $parameters = @{
          HostPoolName = '<HostPoolName>'
          ResourceGroupName = '<ResourceGroupName>'
          Action = 'Cancel'
          CancelMessage = '<Message>'
      }

      Invoke-AzWvdControlSessionHostUpdate @parameters
      ```

   - To retry an update, run the following command:

      ```azurepowershell
      $parameters = @{
          HostPoolName = '<HostPoolName>'
          ResourceGroupName = '<ResourceGroupName>'
          Action = 'Retry'
      }

      Invoke-AzWvdControlSessionHostUpdate @parameters
      ```

1. Check the update action and status after performing an action by running the following command:

   ```azurepowershell
   $parameters = @{
       HostPoolName = '<HostPoolName>'
       ResourceGroupName = '<ResourceGroupName>'
       IsLatest = $true
   }

   Get-AzWvdSessionHostManagementsUpdateStatus @parameters | FL Action, Status
   ```

---

## Next steps

- Learn how to use [session host update diagnostics](session-host-update-diagnostics.md).

- Find guidance to [Troubleshoot session host update](troubleshoot-session-host-update.md).
