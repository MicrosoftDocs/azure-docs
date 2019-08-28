---
title: Migrate Azure AD Domain Services from a Classic virtual network | Microsoft Docs
description: Learn how to migrate an existing Azure AD Domain Services managed domain instance from the Classic virtual network model to a Resource Manager-based virtual network.
author: iainfoulds
manager: daveba

ms.service: active-directory
ms.subservice: domain-services
ms.workload: identity
ms.topic: conceptual
ms.date: 08/27/2019
ms.author: iainfou

---

# Migrate Azure AD Domain Services from the Classic virtual network model to Resource Manager

Azure Active Directory Domain Services (AD DS) supports a one-time move for customers currently using the Classic virtual network model to the Resource Manager virtual network model. This article outlines the benefits and considerations for migration, then the required steps to successfully migrate an existing Azure AD DS instance.

## Overview of the migration process

The migration process takes an existing Azure AD DS instance that runs in a Classic virtual network and moves it to an existing Resource Manager virtual network. The migration is performed using PowerShell, and has two main stages of execution - *preparation* and *migration*.

In the *preparation* stage, Azure AD DS takes a backup of the domain to get the latest snapshot of users, groups, and passwords synchronized to the managed domain. Synchronization is then disabled, and the cloud service that hosts the Azure AD DS managed domain is deleted. During the preparation stage, the Azure AD DS managed domain is unable to authenticate users.

In the *migration* stage, the underlying virtual disks for the domain controllers (DCs) from the Classic Azure AD DS managed domain are copied to create the VMs using the Resource Manager model. The Azure AD DS managed domain is then recreated, which includes the LDAPS and DNS configuration. Synchronization to Azure AD is restarted, and LDAP certificates are restored. There's no need to rejoin any machines to an Azure AD DS managed domain – they continue to be joined to the managed domain and run without changes.

## Migration benefits

When you move an Azure AD DS managed domain using this migration process, you avoid the need to rejoin machines to the managed domain or delete the Azure AD DS instance and create one from scratch. Machines continue to be joined to the Azure AD DS managed domain at the end of the migration process.

Azure AD DS deploys many features that are only available for domains using in Resource Manager virtual networks, such as:

* Fine-grained password policy support.
* AD account lockout protection.
* Email notifications of alerts on the Azure AD DS managed domain.
* Audit logs using Azure Monitor.

Azure AD DS managed domains that use a Resource Manager virtual network help you stay up to date with the latest new features. Support for Azure AD DS using Classic virtual networks is to be deprecated in the future.

## Example scenarios for migration

Some common scenarios for migrating an Azure AD DS managed domain include the following examples.

### Migrate Azure AD DS to an existing Resource Manager virtual network

A common scenario is where you've already moved existing Classic resources to a Resource Manager deployment model and virtual network. Peering is then used from the Resource Manager virtual network to the Classic virtual network that continues to run Azure AD DS. This approach lets the Resource Manager applications and services use the authentication and management functionality of the Azure AD DS managed domain the Classic virtual network. Once migrated, all resources run using the Resource Manager deployment model and virtual network.

High-level steps involved in this example migration scenario include the following:

1. Remove existing VPN gateways or virtual network peering configured on the Classic virtual network.
1. Migrate the Azure AD DS managed domain using the steps outlined in this article.
1. Test and confirm a successful migration, then delete the Classic virtual network.

### Migrate multiple resources including Azure AD DS

In this example scenario, you migrate Azure AD DS and other associated resources from the Classic deployment model to the Resource Manager deployment model. If some resources continued to run in the Classic virtual network alongside the Azure AD DS managed domain, they can all benefit from migrating to the Resource Manager deployment model.

High-level steps involved in this example migration scenario include the following:

1. Remove existing VPN gateways or virtual network peering configured on the Classic virtual network.
1. Migrate the Azure AD DS managed domain using the steps outlined in this article.
1. Test and confirm a successful migration, then delete the Classic virtual network.
1. Move additional Classic resources using the steps outlined in this article.

It isn't recommend to convert the Classic virtual network to a Resource Manager network. Converting the virtual network removes the option to rollback or restore the Azure AD DS managed domain if there any problems during the migration and verification stages.

### Migrate Azure AD DS but keep other resources on the Classic virtual network

With this example scenario, you have the minimum amount of downtime in one session. You only migrate Azure AD DS to a Resource Manager virtual network, and keep existing resources on the Classic deployment model and virtual network. In a following maintenance period, you can migrate the additional resources from the Classic deployment model and virtual network as desired.

High-level steps involved in this example migration scenario include the following:

1. Remove existing VPN gateways or virtual network peering configured on the Classic virtual network.
1. Migrate the Azure AD DS managed domain using the steps outlined in this article.1. Move Azure AD Domain Services using the steps below.
1. Set up virtual network peering between the Classic virtual network and the new Resource Manager virtual network
1. Later, migrate the additional resources from the classic virtual network as needed.

## Before you begin

As you prepare and then migrate an Azure AD DS managed domain, there are some considerations around

> [!IMPORTANT]
> Read all of this migration article and guidance before you start the migration process. The migration process affects the availability of the Azure AD DS domain controllers for periods of time. Users, services, and applications can't authenticate against the managed domain during the migration process.

### Downtime

The migration process involves the domain controllers being offline for a period of time. Domain controllers are inaccessible while Azure AD DS is migrated to the Resource Manager deployment model and virtual network. On average, the downtime is around 1 to 3 hours. This time period is from when the domain controllers are taken offline to the moment the first domain controller comes back online. This average doesn't include the time it takes for the second domain controller to replicate, or the time it may take to migrate additional resources to the Resource Manager deployment model.

### Account lockout

Azure AD DS managed domains that run on Classic virtual networks don't have AD account lockout policies in place. If VMs are exposed to the internet, attackers could use password-spray methods to brute-force their way into accounts. There's no account lockout policy to stop those attempts.

For Azure AD DS managed domains that use the Resource Manager deployment model and virtual networks, AD account lockout policies protect against these password-spray attacks. By default, 5 bad password attempts in 2 minutes lock out an account for 30 minutes. A locked out account can't be logged into, which may interfere with the ability to manage the Azure AD DS managed domain or applications managed by the account. After an Azure AD DS managed domain is migrated, accounts can experience what feels like a permanent lockout due to repeated failed attempts to sign-ins. Two common scenarios after migration include the following:

* A service account that's using an expired password.
    * The service account repeatedly tries to sign in with an expired password, which locks out the account. To fix this, locate the application or VM with expired credentials and update the password.
* A malicious entity is using brute-force attempts to sign in to accounts.
    * When VMs are exposed to the internet, attackers often try common username and password combinations as they attempt to sign. These repeated failed sign in attempts can lock out the accounts. It's not recommended to use administrator accounts with generic names such as *admin* or *administrator*, for example, to minimize administrative accounts from being locked out.
    * Minimize the number of VMs that are exposed to the internet. You can use [Azure Bastion (currently in preview)][azure-bastion] to securely connect to VMs using the Azure portal.

If you suspect that some accounts may be locked out after migration, the final migration steps outline how to enable auditing or change the fine-grained password policy settings.

### Rollback and restore

If the migration isn't successful, the process can rollback and restore an Azure AD DS managed domain. Rollback is a self-service option to immediately restore the state to before the migration attempt. Azure support engineers can also restore a managed domain from backup as a last resort. These options are explained in remaining sections of this article.

### IP addresses

The domain controller IP addresses for an Azure AD DS managed domain change after migration. The new IP address are inside the address range for the subnet specified in the Resource Manager virtual network. Azure AD DS typically uses the first two available IP addresses in the address range, but this isn't guaranteed. You can't currently specify the IP addresses to use after migration.

### Restrictions on available virtual networks

There are some restrictions on the virtual networks that an Azure AD DS managed domain can be migrated to. The destination Resource Manager virtual network must meet the following requirements:

* The Resource Manager virtual network must be in the same Azure subscription as the Classic virtual network that Azure AD DS is currently deployed in.
* The Resource Manager virtual network must be in the same region as the Classic virtual network that Azure AD DS is currently deployed in.
* The Resource Manager virtual network's subnet should have at least 3-5 available IP addresses.
* The Resource Manager virtual network's subnet should be a dedicated subnet for Azure AD DS, and shouldn't host any other workloads.

For more information on virtual network requirements, see [Virtual network design considerations and configuration options][network-considerations].

## Migration steps

The migration to the Resource Manager deployment model and virtual network is split into 5 main steps:

| Step    | Performed through  | Estimated time  | Downtime  | Rollback/Restore? |
|---------|--------------------|-----------------|-----------|-------------------|
| Step 1 - Update and locate the new virtual network | Azure portal | 15 minutes | No downtime required | N/A |
| Step 2 - Prepare the Azure AD DS managed domain for migration | PowerShell | 15 – 30 minutes on average | Downtime of Azure AD DS starts after this command is completed. | Rollback and restore available |
| Step 3 - Move the Azure AD DS managed domain to an existing virtual network | PowerShell | 1 – 3 hours on average | One domain controller is available once this command is completed, downtime ends. | Restore only |
| Step 4 - Test and wait for the replica domain controller | PowerShell and Azure portal | 1 hour or more, depending on the number of tests | Both domain controllers are available and should function normally. | Restore only |
| Step 5 - Optional configuration steps | Azure portal and VMs | N/A | No downtime required | N/A |

> [!IMPORTANT]
> To avoid additional downtime, read all of this migration article and guidance before you start the migration process. The migration process affects the availability of the Azure AD DS domain controllers for periods of time. Users, services, and applications can't authenticate against the managed domain during the migration process.

### Step 1 - Update and locate the new virtual network

Before you begin the migration, complete the following initial checks and updates. These steps can happen at any time before the migration and don't affect the operation of the Azure AD DS managed domain.

1. Update your local Azure PowerShell environment to the latest version. To complete the migration steps, you need at least version *2.3.2*.

    For information on how to check and update, see [Azure PowerShell overview][azure-powershell].

1. Create, or choose an existing, Resource Manager virtual network.

    Make sure that network settings don't block necessary ports required for Azure AD DS. Ports must be open on both the Classic virtual network and the Resource Manager virtual network. These settings include route tables and network security groups.

    To view the ports required, see [Network security groups and required ports][network-ports]. To minimize network communication problems, it's recommend to apply a network security group or route table to the Resource Manager virtual network after the migration as successfully completed.

1. Check the Azure AD DS managed domain health in the Azure portal. If you have any alerts for the managed domain, resolve them before you start the migration process.
1. Gather the following information using the Azure portal or PowerShell. It is best to have all of these IDs before you start the migration:

    | Data needed                                     | Example                              |
    |-------------------------------------------------|--------------------------------------|
    | Directory ID that Azure AD DS is hosted in      | c53a5765-de4d-4054-a530-bb16f61c678e |
    | Subscription ID that Azure AD DS is hosted in   | 8bc1dee-7dc5-4eca-9f8c-423e34c8735c  |
    | Destination Resource Manager subnet resource ID | /subscriptions/<guid>/resourceGroups/myResourceGroup/providers/Microsoft.ClassicNetwork/virtualNetworks/myVnet/subnets/DomainServices |

1. Optional - If you plan to move other resources to the Resource Manager deployment model and virtual network, confirm that those resources can be moved by running this validation check.

    Don't convert the Classic virtual network to a Resource Manager virtual network. If you, there's no option to rollback or restore the Azure AD DS managed domain.

### Step 2 - Prepare the Azure AD DS managed domain for migration

Azure PowerShell is used to prepare the Azure AD DS managed domain for migration. These steps include taking a backup, pausing synchronization, and deleting the cloud service that hosts Azure AD DS. When this step completes, Azure AD DS is taken offline for a period of time. If the preparation step fails, you can roll back to the previous state by following **LINK NEEDED**.

The following Azure PowerShell cmdlets are explained step-by-step after the code block:

```powershell
# Sign in and pause the Azure AD DS managed domain  
Connect-AzAccount
$resourceId = (Get-AzResource | Where-Object { $_.ResourceType -ieq 'Microsoft.AAD/domainServices' }).Id
Set-AzResource -ResourceId $resourceId -Properties @{"subnetId" = $null}

# Check for serviceStatus to be set to PreparedForMigration
(Get-AzResource -ResourceId $resourceId).Properties
```

To run the Azure PowerShell cmdlets, complete the following steps:

1. Open a PowerShell window and sign in as a global admin of your Azure AD directory using the [Connect-AzAccount][Connect-AzAccount] cmdlet:

    ```azurepowershell
    Connect-AzAccount
    ```

1. Make sure that you target the right subscription using the [Set-AzContext][Set-AzContext] cmdlet, and provide your own `<subscription_id>` value:

    ```azurepowershell
    Set-AzContext --SubscriptionId "<subscription_id>"
    ```

1. Find your Azure AD DS instance using the [Get-AzResource][Get-AzResource] cmdlet, and search for the resource of type *Microsoft.AAD/domainServices*:

    ```azurepowershell
    $resourceId = (Get-AzResource | Where-Object { $_.ResourceType -eq 'Microsoft.AAD/domainServices' }).Id
    ```

1. Now prepare the Azure AD DS managed domain for migration using the [Set-AzResource][Set-AzResource] cmdlet. As part of this step, the Classic cloud service that hosts the domain controllers is deleted. This step can take 15-30 minutes and may look like the PowerShell command prompt is frozen. Wait for the cmdlet to complete; don't close out the PowerShell window. When this command finishes, the domain controllers are now longer accessible.

    ```azurepowershell
    Set-AzResource -ResourceId $resourceId -Properties @{"subnetId" = $null}
    ```

1. When the the cmdlet finishes, check the properties of the Classic virtual network using the [Get-AzResource][Get-AzResource] cmdlet. The *serviceStatus* should be set to *PreparedForMigration*, and the *migrationProperties* show the ID of the *oldSubnetId* and the *oldVnetSiteId*:

    ```azurepowershell
    (Get-AzureRmResource -ResourceId $resourceId).Properties
    ```

    If the *serviceStatus* and *migrationProperties* don't show these values, follow the instructions for rollback.

1. Finally, remove the DNS server settings from the Classic virtual network:

    * From the Azure portal, select **Virtual networks (Classic)** from the left-hand side menu.
    * Choose the Classic virtual network that Azure AD DS was deployed into.
    * Select **DNS settings**, then delete the old IP addresses of the Azure AD DS domain controllers.

### Step 3 - Move the Azure AD DS managed domain to an existing virtual network

With the Azure AD DS managed domain prepared and backed up, the domain can be migrated. This step recreates the Azure AD Domain Services domain controller VMs using the Resource Manager deployment model. This step can take 1 to 3 hours to complete.

Specify the target virtual network subnet ID, `<rm_subnet_resource_id>`, for the subnet in the Resource Manager network that you want to migrate Azure AD DS to. After this command runs, you can't then rollback.

```azurepowershell
$rm_subnet = "<rm_subnet_resource_id>"
Set-AzResource -ResourceId $resourceId -Properties @{"subnetId" = $rm_subnet}  
```

When this command successfully completes, you can view your first domain controller's IP address in the Azure Portal or through through Azure PowerShell.

As this stage, you can optionally move other existing resources from the Classic deployment model and virtual network. Or, you can keep the resources on the Classic deployment model and peer the virtual networks to each another after the Azure AD DS migration is complete.

> [!IMPORTANT]
> Don't convert the Classic virtual network to a Resource Manager virtual network during the migration process. If you convert the virtual network, you can't then rollback or restore the Azure AD DS managed domain as the original virtual network won't exist anymore.

### Step 4: Testing and awaiting the replica domain controller

You’ve made it through! The first domain controller is up and running and ready for use. can also wait to perform step 4 when the second domain controller’s address shows up in the Azure portal, which will take about an hour from the completion of step 3.

#### Take note of new network resources

With resource manager, the network resources Azure AD Domain Services uses to manage your domain are exposed to you. To read more about the network resources created on your domain, visit our networking guidelines.

#### Updating the DNS server settings

Update your DNS server settings by using this guide.

#### Restarting your virtual machines

It’s important to restart your virtual machines so they are updated with the latest DNS server settings.

**note about any applications with stored dns settings*

#### Testing your connection

Whether one or two domain controllers are available, it’s recommended to test your connection. Here are some tests that Azure AD Domain Services suggests to run.

1. Ensure the domain controller’s IP is pingable
1. Name resolution

#### Checking for the replica domain controller

The second domain controller should be available 1-2 hours after the command finishes. You are able to check if the domain controller is available by visiting the properties tab of your managed domain and determining if there are two IP addresses available.

<PIC NEEDED>

After the replica domain controller is ready, you should complete other parts of this step again (update your DNS server settings, restart your VMs, and test your connection) to ensure your second domain controller is working as intended.

### Step 5: Optional configuration steps

#### Subscribe to audit logs with Azure Monitor

Azure AD Domain Services exposes audit logs so you can troubleshoot and view events that happen on the domain controllers. You can use audit logs to view which accounts are being locked out by visiting this section of our Azure AD Domain Services audit log article.

In addition, you are able to use templates to monitor important information exposed in the logs. In particular, use the audit log workbook template to monitor possible account lockouts on your managed domain.

#### Update your fine-grained password policy

It may be beneficial for you to update your fine-grained password policy to be less restrictive than the default on resource manager managed domains as you are observing the audit logs on your managed domain.

1. Lessen the restriction on your managed domain and observe the events in the audit logs.
1. Use the audit logs to see if any service accounts are using expired passwords and update passwords as needed.
1. If there is a virtual machine exposed to the internet on your domain, you will notice that generic account names (for example: administrator, user, or guest) have high login attempts.
1. Use a network trace on the VM to locate the source of the attacks and block those IPs from accessing your domain.
1. When you have ensured that you will be able to service your domain without lockout issues, update your fine-grained password policy to be as restrictive as necessary.

#### Configure Azure AD Domain Services email notifications

In order to be notified when there is a problem detected on your managed domain, update your email notification settings on the Azure portal. This article explains the benefits of email notifications and how to configure correct email notifications.

#### Creating a network security group

Azure AD Domain Services will create a network security group for you that will open up the ports needed to service your managed domain and block all other incoming traffic. This acts as an extra layer of security to lock down your managed domain.

1. Visit the Azure portal’s Azure AD Domain Services page
1. Click your domain name to travel to the managed domain’s overview page.
1. If there is no network security group associated with Azure AD Domain Services, there will be a button on your overview page that will create a network security group.
1. If you are using secure LDAP, make sure to add a rule to the network security group to allow incoming traffic for port 636. More information on the ports needed in this article.

## Rollback and restore

### Rollback

If during execution the first PowerShell command fails, your managed domain can rollback to the original configuration. This requires the original classic virtual network. For rollback, execute this command in the PowerShell window.

### Restore

This option should be considered a last resort. Azure AD Domain Services has the ability to restore your managed domain from the last available backup. A backup is taken during step 1 of migration to ensure we have the most current backup possible, which we store for 30 days.

To restore your managed domain from backup, you will need to file a support case on the Azure portal and provide your directory ID, your domain name, and reason for backup. This process could take multiple days to complete.

## Troubleshooting

* Input isn’t being accepted
* Different failure problems
* Cannot log into domain [won’t auth]
* Cannot log into domain [locked out]

## Next steps

<!-- INTERNAL LINKS -->
[azure-bastion]: ../bastion/bastion-overview.md
[network-considerations]: network-considerations.md
[azure-powershell]: /powershell/azure/overview
[network-ports]: network-considerations.md#network-security-groups-and-required-ports
[Connect-AzAccount]: /powershell/module/az.accounts/connect-azaccount
[Set-AzContext]: /powershell/module/az.accounts/set-azcontext
[Get-AzResource]: /powershell/module/az.resources/get-azresource
[Set-AzResource]: /powershell/module/az.resources/set-azresource
