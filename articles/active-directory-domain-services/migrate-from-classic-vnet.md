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

In the *migration* stage, the underlying virtual disks for the domain controllers (DCs) from the Classic Azure AD DS managed domain are copied to create the VMs using the Resource Manager model. The Azure AD DS managed domain is then recreated, which includes the LDAPS and DNS configuration. Synchronization to Azure AD is restarted, and your LDAP certificates are restored. There's no need to rejoin any machines to your Azure AD DS managed domain – they continue to be joined to the managed domain and run without changes.

## Migration benefits

When you move an Azure AD DS managed domain using this migration process, you avoid the need to rejoin your machines to the managed domain or delete your Azure AD DS instance and create one from scratch. Machines continue to be joined to the Azure AD DS managed domain at the end of the migration process.

Azure AD DS deploys many features that are only available for domains using in Resource Manager virtual networks, such as:

* Fine-grained password policy support.
* AD account lockout protection.
* Email notifications of alerts on your Azure AD DS managed domain.
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

> [!CAUTION]
> Read all of this migration article and guidance before you start the migration process. The migration process affects the availability of your Azure AD DS domain controllers for periods of time. Users, services, and applications can't authenticate against the managed domain during the migration process.

### Downtime

The migration process involves your domain controllers being offline for a period of time. Your domain controllers are inaccessible while Azure AD DS is migrated to the Resource Manager deployment model and virtual network. On average, the downtime is around 1 to 3 hours. This time period is from when the domain controllers are taken offline to the moment the first domain controller comes back online. This average doesn't include the time it takes for the second domain controller to replicate, or the time it may take to migrate additional resources to the Resource Manager deployment model.

### Account lockout

Azure AD Domain Services managed domains on classic virtual networks do not have AD account lockout policies in place. This means that if your virtual machines are exposed to the internet, attackers can use password-spray methods to brute-force their way into your accounts. With managed domain on classic virtual networks, there is no account lockout policy to stop attempts.

With Resource manager networks, Azure AD Domain Services provides AD account lockout policies, where 5 bad password attempts within 2 minutes will lock out an account for 30 minutes. While an account is locked out, it is unable to be logged into and may interfere with your ability to manage your domain or applications managed by that account. After migration, your managed domain can experience what feels like a permanent lockout of some users due to repeated attempts to log into that account. Two scenarios that are most common after migrating are:

* A service account that is using an expired password. The service account will repeatedly try to log in with an expired password, which will lock out the account. To fix this, you must locate the caller computer and update the password.
* A malicious entity is using brute-force attempts to log into your accounts. When your virtual machines are exposed to the internet, hackers try to log into accounts on your managed domain. They will usually try common username and password combinations. For this reason, we recommend not naming administrator accounts generic names such as “admin” “administrator”, and similar names.  

If you suspect that you will be locked out of your accounts immediately after migrating, follow the suggested directions in step 5 of this article.

### Rollback and restore

Options to rollback and restore your managed domain are available should the migration not be successful. Rollback is a self-service option to immediately restore your state to before you attempted migration. The Azure AD Domain Services team can also restore your domain from backup as a last resort. Both options are explained in detail later in this article.  

### IP addresses

The IP addresses of the domain controllers for your managed domain will change after the move. They will be inside the address range for the subnet specified in the resource manager virtual network. Usually, Azure AD Domain Services uses the first two available IP addresses in the address range specified in the virtual network, but it is not guaranteed. There is currently no way to specify the IP addresses to use after the migration.

### Restrictions on available virtual networks

Azure AD Domain Services has restrictions on which virtual networks you can move your managed domain to. In particular, it must meet these requirements:

* The resource manager virtual network must be in the same subscription as the classic virtual network that Azure AD Domain Services is currently in.
* The resource manager virtual network must be in the same region as the classic virtual network that Azure AD Domain Services is currently in.
* The resource manager virtual network’s subnet should have at least 3-5 available IP addresses for the managed domain.
* The resource manager virtual network’s subnet should be a dedicated subnet for Azure AD Domain Services and should not hold any other workloads.

## Migration steps

The migration is split into 5 main steps:

| Step    | Performed through  | Estimated time  | Downtime  | Rollback/Restore? |
|---------|--------------------|-----------------|-----------|-------------------|
| Step 1: Updates and locating the new virtual network | Azure portal | 15 minutes | No downtime required | N/A |
| Step 2: Preparing your managed domain for migration | PowerShell | 15 – 30 minutes on average | Downtime of managed domain starts after this command is completed | Rollback and Restore available |
| Step 3: Moving your managed domain to an existing virtual network | PowerShell | 1 – 3 hours on average | One domain controller will be available once this command is completed, downtime ends. | Restore only |
| Step 4: Testing and awaiting the replica domain controller | PowerShell and Azure portal | 1 hour or more, depending on number of tests | Both domain controllers will be available and should be functioning normally. | Restore only |
| Step 5: Optional configuration steps | Azure portal and VMs | N/A | No downtime required | N/A |

IMPT: To avoid additional downtime, it is important that you fully read and understand all steps before starting the process.

### Step 1: Updates and locating the new virtual network

In order to have a seamless experience, you must complete some initial checks and updates. These can happen at any time beforehand and should not affect your managed domain.

1. Update your PowerShell to the latest version. This guide is written using version 2.3.2. The commands will not work unless you have version 2.3.2 or later.
1. Create or choose a resource manager virtual network based on these guidelines.
1. Make sure your network settings are not blocking necessary ports required for Azure AD Domain Services. These ports must be open on both the classic virtual network and the resource manager virtual network. This requirement includes route tables and network security groups. To view the ports required, visit this article. It is easiest if you do not apply a network security group or route table to the resource manager virtual network until after the migration.
1. Check your domain’s health on the Azure portal to ensure you do not have any alerts on your managed domain.
1. Gather the following information using the Azure portal or PowerShell. It is best to have all of these IDs before you start the migration:

    | Data needed                                                | Example                              |
    |------------------------------------------------------------|--------------------------------------|
    | Directory ID that Azure AD Domain Services is hosted in    | c52a5745-de5d-4054-a540-bb06f60c678f |
    | Subscription ID that Azure AD Domain Services is hosted in | 8bb1def-7dc6-4eca-9f8b-422e33c8734b  |
    | Resource manager subnet resource ID                        | /subscriptions/28bb1def-7dc6-4eca-9f8b-422e33c8734b/resourceGroups/MigrationTest/providers/Microsoft.ClassicNetwork/virtualNetworks/MigrationTestV1Vnet/subnets/default |

1. OPTIONAL: If you are moving other resources to resource manager networks, validate that the resources can be moved by running this validation check. Do not convert the classic virtual network to a resource manager network, as this will remove the option for rollback or restore.  

### Step 2: Preparing your managed domain for migration

This step prepares your managed domain to be migrated using PowerShell. This includes taking a backup, pausing synchronization, and deleting the cloud service that hosts Azure AD Domain Services. When this step completes, your managed domain will be taken offline for a period of time. If this step fails, you are able to roll back to your managed domain’s previous state by following these steps.

```powershell
# Part 1: login and pause your managed domain  
Login-AzureRmAccount
$resourceId = (Get-AzureRmResource | Where-Object { $_.ResourceType -ieq 'Microsoft.AAD/domainServices' }).Id
Set-AzureRmResource -ResourceId $resourceId -Properties @{"subnetId" = $null}

# Part 2: check for serviceStatus to be set to PreparedForMigration
(Get-AzureRmResource -ResourceId $resourceId).Properties
```

Step by step instructions

1. Launch PowerShell
1. Login as a global admin of your directory:

    ```azurepowershell
    Login-AzureRmAccount
    ```

1. Ensure you are on the right subscription:

    ```azurepowershell
    Select-azsubscription <your subscription id>
    ```

1. Find your Azure AD Domain Services instance:

    ```azurepowershell
    $resourceId = (Get-AzureRmResource | Where-Object { $_.ResourceType -eq 'Microsoft.AAD/domainServices' }).Id
    ```

1. Prepare your managed domain for migration. During this step, the cloud service hosting the domain controllers will be deleted. This step should take around 15-30 minutes and it will look like the PowerShell command prompt is just frozen – be patient! After this command finishes, your domain controllers will not be accessible.

    ```azurepowershell
    Set-AzureRmResource -ResourceId $resourceId -Properties @{"subnetId" = $null}
    ```

1. Once the command finishes, check the properties of the old virtual network. The serviceStatus should be set to PreparedForMigration and the migrationProperties will show the ID of the old subnet (oldSubnetId) and the old virtual network site (oldVnetSiteId).

    ```azurepowershell
    (Get-AzureRmResource -ResourceId $resourceId).Properties
    ```

    If the command has failed, follow the instructions for rollback.

1. Remove the DNS server settings from the virtual network.

    * Login to the Azure portal
    * Click on "virtual networks"

### Step 3: Moving your managed domain to an existing virtual network

This step uses the VHD files to recreate Azure AD Domain Services in the  step is where xxdjkasdhaskldhal happens. This step usually takes around 1 to 3 hours to complete. You will need to specify the target subnet, which is the subnet in the resource manager network that you want Azure AD Domain Services to exist in. Once you execute this command, rollback is no longer an option.

```azurepowershell
# Step 3: point to the existing subnet
$arm_subnet = "<arm_subnet_resource_id>"
Set-AzureRmResource -ResourceId $resourceId -Properties @{"subnetId" = $arm_subnet}  
```

When this command returns, you will be able to view your first domain controller’s IP address in the Azure Portal and through PowerShell.

Optional: Moving your Azure resources to resource manager

While this step is completing, you can move existing resources off of the classic virtual network by using this article. You can also keep the resources on the classic virtual network and peer the virtual networks to one another after migration is completed.

IMPT: Do not convert the classic virtual network to a resource manager network while migration is completing. This eliminates the possibility of rollback or restore because the original virtual network will not exist anymore.

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
