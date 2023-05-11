---
title: Migrate Azure AD Domain Services from a Classic virtual network | Microsoft Docs
description: Learn how to migrate an existing Azure AD Domain Services managed domain from the Classic virtual network model to a Resource Manager-based virtual network.
author: justinha
manager: amycolannino
ms.reviewer: xyuan

ms.service: active-directory
ms.subservice: domain-services
ms.workload: identity
ms.topic: how-to
ms.date: 04/17/2023
ms.author: justinha 
---

# Migrate Azure Active Directory Domain Services from the Classic virtual network model to Resource Manager

Starting April 1, 2023, Azure Active Directory Domain Services (Azure AD DS) has shut down all IaaS virtual machines that host domain controller services for customers who use the Classic virtual network model. Azure AD Domain Services offers a best-effort offline migration solution for customers currently using the Classic virtual network model to the Resource Manager virtual network model. Azure AD DS managed domains that use the Resource Manager deployment model have more features, such as fine-grained password policy, audit logs, and account lockout protection.

This article outlines considerations for migration, followed by the required steps to successfully migrate an existing managed domain. For some of the benefits, see [Benefits of migration from the Classic to Resource Manager deployment model in Azure AD DS][migration-benefits].

> [!NOTE]
> In 2017, Azure AD Domain Services became available to host in an Azure Resource Manager network. Since then, we have been able to build a more secure service using the Azure Resource Manager's modern capabilities. Because Azure Resource Manager deployments fully replace classic deployments, Azure AD DS classic virtual network deployments will be retired on March 1, 2023.
>
> For more information, see the [official deprecation notice](https://azure.microsoft.com/updates/we-are-retiring-azure-ad-domain-services-classic-vnet-support-on-march-1-2023/).

## Overview of the migration process

The offline migration process copies the underlying virtual disks for the domain controllers from the Classic managed domain to create the VMs using the Resource Manager deployment model. The managed domain is then recreated, which includes the LDAPS and DNS configuration. Synchronization to Azure AD is restarted, and LDAP certificates are restored. There's no need to rejoin any machines to a managed domain–they continue to be joined to the managed domain and run without changes.

## Before you begin

As you prepare for migration, there are some considerations around the availability of authentication and management services. The managed domain remains unavailable until the migration completes successfully.

> [!IMPORTANT]
> Read all of this migration article and guidance before you start the migration process. The migration process affects the availability of the Azure AD DS domain controllers for periods of time. Users, services, and applications can't authenticate against the managed domain during the migration process.

### IP addresses

The domain controller IP addresses for a managed domain change after migration. This change includes the public IP address for the secure LDAP endpoint. The new IP addresses are inside the address range for the new subnet in the Resource Manager virtual network.

Azure AD DS typically uses the first two available IP addresses in the address range, but this isn't guaranteed. You can't currently specify the IP addresses to use after migration.

### Account lockout

Managed domains that run on Classic virtual networks don't have AD account lockout policies in place. If VMs are exposed to the internet, attackers could use password-spray methods to brute-force their way into accounts. There's no account lockout policy to stop those attempts. For managed domains that use the Resource Manager deployment model and virtual networks, AD account lockout policies protect against these password-spray attacks.

By default, five (5) bad password attempts in two (2) minutes lock out an account for 30 minutes.

A locked out account can't be used to sign in, which may interfere with the ability to manage the managed domain or applications managed by the account. After a managed domain is migrated, accounts can experience what feels like a permanent lockout due to repeated failed attempts to sign in. Two common scenarios after migration include the following:

* A service account that's using an expired password.
    * The service account repeatedly tries to sign in with an expired password, which locks out the account. To fix this, locate the application or VM with expired credentials and update the password.
* A malicious entity is using brute-force attempts to sign in to accounts.
    * When VMs are exposed to the internet, attackers often try common username and password combinations as they attempt to sign. These repeated failed sign-in attempts can lock out the accounts. It's not recommended to use administrator accounts with generic names such as *admin* or *administrator*, for example, to minimize administrative accounts from being locked out.
    * Minimize the number of VMs that are exposed to the internet. You can use [Azure Bastion][azure-bastion] to securely connect to VMs using the Azure portal.

If you suspect that some accounts may be locked out after migration, the final migration steps outline how to enable auditing or change the fine-grained password policy settings.

### Restrictions on available virtual networks

There are some restrictions on the virtual networks that a managed domain can be migrated to. The destination Resource Manager virtual network must meet the following requirements:

* The Resource Manager virtual network must be in the same Azure subscription as the Classic virtual network that Azure AD DS is currently deployed in.
* The Resource Manager virtual network must be in the same region as the Classic virtual network that Azure AD DS is currently deployed in.
* The Resource Manager virtual network's subnet should have at least 3-5 available IP addresses.
* The Resource Manager virtual network's subnet should be a dedicated subnet for Azure AD DS, and shouldn't host any other workloads.

For more information on virtual network requirements, see [Virtual network design considerations and configuration options][network-considerations].

You must also create a network security group to restrict traffic in the virtual network for the managed domain. An Azure standard load balancer is created during the migration process that requires these rules to be place. This network security group secures Azure AD DS and is required for the managed domain to work correctly.

For more information on what rules are required, see [Azure AD DS network security groups and required ports](network-considerations.md#network-security-groups-and-required-ports).

## Migration steps

The migration to the Resource Manager deployment model and virtual network is split into four main steps:

| Step    | Performed through  | Estimated time  | Downtime  |
|---------|--------------------|-----------------|-----------|
| [Step 1 - Update and locate the new virtual network](#update-and-verify-virtual-network-settings) | Azure portal | 15 minutes | |
| [Step 2 - Perform offline migration](#perform-offline-migration) | PowerShell | 1 – 3 hours on average | One domain controller is available once this command is completed. |
| [Step 3 - Test and wait for the replica domain controller](#test-and-verify-connectivity-after-the-migration)| PowerShell and Azure portal | 1 hour or more, depending on the number of tests | Both domain controllers are available and should function normally, downtime ends. |
| [Step 4 - Optional configuration steps](#optional-post-migration-configuration-steps) | Azure portal and VMs | N/A | |

> [!IMPORTANT]
> To avoid additional downtime, read all of this migration article and guidance before you start the migration process. The migration process affects the availability of the Azure AD DS domain controllers for a period of time. Users, services, and applications can't authenticate against the managed domain during the migration process.

## Update and verify virtual network settings

Before you begin the migration process, complete the following initial checks and updates. These steps can happen at any time before the migration and don't affect the operation of the managed domain.

1. Update your local Azure PowerShell environment to the latest version. To complete the migration steps, you need at least version *2.3.2*.

   For information about how to check and update your PowerShell version, see [Azure PowerShell overview][azure-powershell].

1. Create, or choose an existing, Resource Manager virtual network.

    Make sure that network settings don't block ports required for Azure AD DS. Ports must be open on both the Classic virtual network and the Resource Manager virtual network. These settings include route tables (although it's not recommended to use route tables) and network security groups.

    Azure AD DS needs a network security group to secure the ports needed for the managed domain and block all other incoming traffic. This network security group acts as an extra layer of protection to lock down access to the managed domain. 

    The following network security group Inbound rules are required for the managed domain to provide authentication and management services. Don't edit or delete these network security group rules for the virtual network subnet your managed domain is deployed into.

    | Source      | Source service tag                 | Source port ranges |  Destination  | Service | Destination port ranges | Protocol | Action | Required | Purpose |
    |:-----------:|:----------------------------------:|:------------------:|:-------------:|:-------:|:-----------------------:|:--------:|:------:|:--------:|:--------|
    | Service tag | AzureActiveDirectoryDomainServices | *                  | Any           | WinRM   | 5986        | TCP       | Allow  | Yes       | Management of your domain |
    | Service tag | CorpNetSaw                         | *                  | Any           | RDP     | 3389        | TCP       | Allow  | Optional  | Debugging for support |
    
    Make a note of the target resource group, target virtual network, and target virtual network subnet. These resource names are used during the migration process.

    > [!NOTE]
    > The **CorpNetSaw** service tag isn't available by using Azure portal, and the network security group rule for **CorpNetSaw** has to be added by using [PowerShell](powershell-create-instance.md#create-a-network-security-group).

1. Check the managed domain health in the Azure portal. If you have any alerts for the managed domain, resolve them before you start the migration process.
1. Optionally, if you plan to move other resources to the Resource Manager deployment model and virtual network, confirm that those resources can be migrated. For more information, see [Platform-supported migration of IaaS resources from Classic to Resource Manager][migrate-iaas].

    > [!NOTE]
    > Don't convert the Classic virtual network to a Resource Manager virtual network. If you do, there's no option to roll back or restore the managed domain.

## Perform offline migration

Azure PowerShell is used to perform offline migration of the managed domain:

1. Install the `Migrate-Aaads` script from the [PowerShell Gallery][powershell-script]. This PowerShell migration script is a digitally signed by the Azure AD engineering team.

    ```powershell
    Install-Script -Name Migrate-Aadds
    ```

2. Create a variable to hold the credentials for by the migration script using the [Get-Credential][get-credential] cmdlet.

    The user account you specify needs [Application Administrator](../active-directory/roles/permissions-reference.md#application-administrator) and [Groups Administrator](../active-directory/roles/permissions-reference.md#groups-administrator) Azure AD roles in your tenant to enable Azure AD DS and [Domain Services Contributor](../role-based-access-control/built-in-roles.md#contributor) Azure role to create the required Azure AD DS resources.

    When prompted, enter an appropriate user account and password:

    ```powershell
    $creds = Get-Credential
    ```
    
3. Define a variable for your Azure subscription ID. If needed, you can use the [Get-AzSubscription](/powershell/module/az.accounts/get-azsubscription) cmdlet to list and view your subscription IDs. Provide your own subscription ID in the following command:

   ```powershell
   $subscriptionId = 'yourSubscriptionId'
   ```

4. Now run the `Migrate-Aadds` cmdlet using the *-Offline* parameter. Provide the *-ManagedDomainFqdn* for your own managed domain, such as *aaddscontoso.com*. Specify the target resource group that contains the virtual network you want to migrate Azure AD DS to, such as *myResourceGroup*. Provide the target virtual network, such as *myVnet*, and the subnet, such as *DomainServices*. This step can take 1 to 3 hours to complete.

    ```powershell
    Migrate-Aadds `
        -Offline `
        -ManagedDomainFqdn aaddscontoso.com `
        -VirtualNetworkResourceGroupName myResourceGroup `
        -VirtualNetworkName myVnet `
        -VirtualSubnetName DomainServices `
        -Credentials $creds `
        -SubscriptionId $subscriptionId
    ```

> [!IMPORTANT]
> As part of the offline migration workflow, you cannot convert the Classic virtual network to a Resource Manager virtual network.

Every two minutes during the migration process, a progress indicator reports the current status, as shown in the following example output:

![Progress indicator of the migration of Azure AD DS](media/migrate-from-classic-vnet/powershell-migration-status.png)

The migration process continues to run, even if you close out the PowerShell script. In the Azure portal, the status of the managed domain reports as *Migrating*.

When the migration successfully completes, you can view your first domain controller's IP address in the Azure portal or through Azure PowerShell. A time estimate on the second domain controller being available is also shown.

At this stage, you can optionally move other existing resources from the Classic deployment model and virtual network. Or, you can keep the resources on the Classic deployment model and peer the virtual networks to each other after the Azure AD DS migration is complete.

## Test and verify connectivity after the migration

It can take some time for the second domain controller to successfully deploy and be available for use in the managed domain. The second domain controller should be available 1-2 hours after the migration cmdlet finishes. With the Resource Manager deployment model, the network resources for the managed domain are shown in the Azure portal or Azure PowerShell. To check if the second domain controller is available, look at the **Properties** page for the managed domain in the Azure portal. If two IP addresses shown, the second domain controller is ready.

After the second domain controller is available, complete the following configuration steps for network connectivity with VMs:

* **Update DNS server settings** To let other resources on the Resource Manager virtual network resolve and use the managed domain, update the DNS settings with the IP addresses of the new domain controllers. The Azure portal can automatically configure these settings for you.

    To learn more about how to configure the Resource Manager virtual network, see [Update DNS settings for the Azure virtual network][update-dns].
* **Restart domain-joined VMs (optional)** As the DNS server IP addresses for the Azure AD DS domain controllers change, you can restart any domain-joined VMs so they then use the new DNS server settings. If applications or VMs have manually configured DNS settings, manually update them with the new DNS server IP addresses of the domain controllers that are shown in the Azure portal. Rebooting domain-joined VMs prevents connectivity issues caused by IP addresses that don’t refresh.

Now test the virtual network connection and name resolution. On a VM that's connected to the Resource Manager virtual network, or peered to it, try the following network communication tests:

1. Check if you can ping the IP address of one of the domain controllers, such as `ping 10.1.0.4`
    * The IP addresses of the domain controllers are shown on the **Properties** page for the managed domain in the Azure portal.
1. Verify name resolution of the managed domain, such as `nslookup aaddscontoso.com`
    * Specify the DNS name for your own managed domain to verify that the DNS settings are correct and resolves.

To learn more about other network resources, see [Network resources used by Azure AD DS][network-resources].

## Optional post-migration configuration steps

When the migration process is successfully complete, some optional configuration steps include enabling audit logs or e-mail notifications, or updating the fine-grained password policy.

### Subscribe to audit logs using Azure Monitor

Azure AD DS exposes audit logs to help troubleshoot and view events on the domain controllers. For more information, see [Enable and use audit logs][security-audits].

You can use templates to monitor important information exposed in the logs. For example, the audit log workbook template can monitor possible account lockouts on the managed domain.

### Configure email notifications

To be notified when a problem is detected on the managed domain, update the email notification settings in the Azure portal. For more information, see [Configure notification settings][notifications].

### Update fine-grained password policy

If needed, you can update the fine-grained password policy to be less restrictive than the default configuration. You can use the audit logs to determine if a less restrictive setting makes sense, then configure the policy as needed. Use the following high-level steps to review and update the policy settings for accounts that are repeatedly locked out after migration:

1. [Configure password policy][password-policy] for fewer restrictions on the managed domain and observe the events in the audit logs.
1. If any service accounts are using expired passwords as identified in the audit logs, update those accounts with the correct password.
1. If a VM is exposed to the internet, review for generic account names like *administrator*, *user*, or *guest* with high sign-in attempts. Where possible, update those VMs to use less generically named accounts.
1. Use a network trace on the VM to locate the source of the attacks and block those IP addresses from being able to attempt sign-ins.
1. When there are minimal lockout issues, update the fine-grained password policy to be as restrictive as necessary.

## Troubleshooting

If you have problems after migration to the Resource Manager deployment model, review some of the following common troubleshooting areas:

* [Troubleshoot domain-join problems][troubleshoot-domain-join]
* [Troubleshoot account lockout problems][troubleshoot-account-lockout]
* [Troubleshoot account sign-in problems][troubleshoot-sign-in]
* [Troubleshoot secure LDAP connectivity problems][tshoot-ldaps]

## Next steps

With your managed domain migrated to the Resource Manager deployment model, [create and domain-join a Windows VM][join-windows] and then [install management tools][tutorial-create-management-vm].

<!-- INTERNAL LINKS -->
[azure-bastion]: ../bastion/bastion-overview.md
[network-considerations]: network-considerations.md
[azure-powershell]: /powershell/azure/
[network-ports]: network-considerations.md#network-security-groups-and-required-ports
[Connect-AzAccount]: /powershell/module/az.accounts/connect-azaccount
[Set-AzContext]: /powershell/module/az.accounts/set-azcontext
[Get-AzResource]: /powershell/module/az.resources/get-azresource
[Set-AzResource]: /powershell/module/az.resources/set-azresource
[network-resources]: network-considerations.md#network-resources-used-by-azure-ad-ds
[update-dns]: tutorial-create-instance.md#update-dns-settings-for-the-azure-virtual-network
[azure-support]: ../active-directory/fundamentals/active-directory-troubleshooting-support-howto.md
[security-audits]: security-audit-events.md
[notifications]: notifications.md
[password-policy]: password-policy.md
[secure-ldap]: tutorial-configure-ldaps.md
[migrate-iaas]: ../virtual-machines/migration-classic-resource-manager-overview.md
[join-windows]: join-windows-vm.md
[tutorial-create-management-vm]: tutorial-create-management-vm.md
[troubleshoot-domain-join]: troubleshoot-domain-join.md
[troubleshoot-account-lockout]: troubleshoot-account-lockout.md
[troubleshoot-sign-in]: troubleshoot-sign-in.md
[tshoot-ldaps]: tshoot-ldaps.md
[get-credential]: /powershell/module/microsoft.powershell.security/get-credential
[migration-benefits]: concepts-migration-benefits.md

<!-- EXTERNAL LINKS -->
[powershell-script]: https://www.powershellgallery.com/packages/Migrate-Aadds/
