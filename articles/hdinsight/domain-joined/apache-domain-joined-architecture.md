---
title: Azure HDInsight architecture with Enterprise Security Package
description: Learn how to plan Azure HDInsight security with Enterprise Security Package.
ms.service: hdinsight
ms.topic: conceptual
ms.custom: hdinsightactive, has-azure-ad-ps-ref
ms.date: 05/11/2023
---

# Use Enterprise Security Package in HDInsight

The standard Azure HDInsight cluster is a single-user cluster. It's suitable for most companies that have smaller application teams building large data workloads. Each user can create a dedicated cluster on demand and destroy it when it's not needed anymore.

Many enterprises have moved toward a model in which IT teams manage clusters, and multiple application teams share clusters. These larger enterprises need multiuser access to each cluster in Azure HDInsight.

HDInsight relies on a popular identity provider--Active Directory--in a managed way. By integrating HDInsight with [Microsoft Entra Domain Services](../../active-directory-domain-services/overview.md), you can access the clusters by using your domain credentials.

The virtual machines (VMs) in HDInsight are domain joined to your provided domain. So, all the services running on HDInsight (Apache Ambari, Apache Hive server, Apache Ranger, Apache Spark thrift server, and others) work seamlessly for the authenticated user. Administrators can then create strong authorization policies by using Apache Ranger to provide role-based access control for resources in the cluster.

## Integrate HDInsight with Active Directory

Open-source Apache Hadoop relies on the Kerberos protocol for authentication and security. Therefore, HDInsight cluster nodes with Enterprise Security Package (ESP) are joined to a domain that's managed by Microsoft Entra Domain Services. Kerberos security is configured for the Hadoop components on the cluster.

The following things are created automatically:

- A service principal for each Hadoop component
- A machine principal for each machine that's joined to the domain
- An Organizational Unit (OU) for each cluster to store these service and machine principals

To summarize, you need to set up an environment with:

- An Active Directory domain (managed by Microsoft Entra Domain Services). **The domain name must be 39 characters or less to work with Azure HDInsight.**
- Secure LDAP (LDAPS) enabled in Microsoft Entra Domain Services.
- Proper networking connectivity from the HDInsight virtual network to the Microsoft Entra Domain Services virtual network, if you choose separate virtual networks for them. A VM inside the HDInsight virtual network should have a line of sight to Microsoft Entra Domain Services through virtual network peering. If HDInsight and Microsoft Entra Domain Services are deployed in the same virtual network, the connectivity is automatically provided, and no further action is needed.

## Set up different domain controllers

HDInsight currently supports only Microsoft Entra Domain Services as the main domain controller that the cluster uses for Kerberos communication. But other complex Active Directory setups are possible, as long as such a setup leads to enabling Microsoft Entra Domain Services for HDInsight access.

<a name='azure-active-directory-domain-services'></a>

### Microsoft Entra Domain Services

[Microsoft Entra Domain Services](../../active-directory-domain-services/overview.md) provides a managed domain that's fully compatible with Windows Server Active Directory. Microsoft takes care of managing, patching, and monitoring the domain in a highly available (HA) setup. You can deploy your cluster without worrying about maintaining domain controllers.

Users, groups, and passwords are synchronized from Microsoft Entra ID. The one-way sync from your Microsoft Entra instance to Microsoft Entra Domain Services enables users to sign in to the cluster by using the same corporate credentials.

For more information, see [Configure HDInsight clusters with ESP using Microsoft Entra Domain Services](./apache-domain-joined-configure-using-azure-adds.md).

### On-premises Active Directory or Active Directory on IaaS VMs

If you have an on-premises Active Directory instance or more complex Active Directory setups for your domain, you can sync those identities to Microsoft Entra ID by using Microsoft Entra Connect. You can then enable Microsoft Entra Domain Services on that Active Directory tenant.

Because Kerberos relies on password hashes, you must [enable password hash sync on Microsoft Entra Domain Services](../../active-directory-domain-services/tutorial-create-instance.md).

If you're using federation with Active Directory Federation Services (AD FS), you must enable password hash sync. (For a recommended setup, see [this video](https://youtu.be/qQruArbu2Ew).) Password hash sync helps with disaster recovery in case your AD FS infrastructure fails, and it also helps provide leaked-credential protection. For more information, see [Enable password hash sync with Microsoft Entra Connect Sync](../../active-directory/hybrid/how-to-connect-password-hash-synchronization.md).

Using on-premises Active Directory or Active Directory on IaaS VMs alone, without Microsoft Entra ID and Microsoft Entra Domain Services, isn't a supported configuration for HDInsight clusters with ESP.

If federation is being used and password hashes are synced correctly, but you're getting authentication failures, check if cloud password authentication is enabled for the PowerShell service principal. If not, you must set a [Home Realm Discovery (HRD) policy](../../active-directory/manage-apps/configure-authentication-for-federated-users-portal.md) for your Microsoft Entra tenant. To check and set the HRD policy:

1. Install the preview [Azure AD PowerShell module](/powershell/azure/active-directory/install-adv2).

   ```powershell
   Install-Module AzureAD
   ```

2. Connect using global administrator (tenant administrator) credentials.

   ```powershell
   Connect-AzureAD
   ```

3. Check if the Microsoft Azure PowerShell service principal has already been created.

   ```powershell
   Get-AzureADServicePrincipal -SearchString "Microsoft Azure PowerShell"
   ```

4. If it doesn't exist, then create the service principal.

   ```powershell
   $powershellSPN = New-AzureADServicePrincipal -AppId 1950a258-227b-4e31-a9cf-717495945fc2
   ```

5. Create and attach the policy to this service principal.

   ```powershell
    # Determine whether policy exists
    Get-AzureADPolicy | Where {$_.DisplayName -eq "EnableDirectAuth"}

    # Create if not exists
    $policy = New-AzureADPolicy `
        -Definition @('{"HomeRealmDiscoveryPolicy":{"AllowCloudPasswordValidation":true}}') `
        -DisplayName "EnableDirectAuth" `
        -Type "HomeRealmDiscoveryPolicy"

    # Determine whether a policy for the service principal exist
    Get-AzureADServicePrincipalPolicy `
        -Id $powershellSPN.ObjectId

    # Add a service principal policy if not exist
    Add-AzureADServicePrincipalPolicy `
        -Id $powershellSPN.ObjectId `
        -refObjectID $policy.ID
   ```

## Next steps

- [Configure HDInsight clusters with ESP](apache-domain-joined-configure-using-azure-adds.md)
- [Configure Apache Hive policies for HDInsight clusters with ESP](apache-domain-joined-run-hive.md)
- [Manage HDInsight clusters with ESP](apache-domain-joined-manage.md)
