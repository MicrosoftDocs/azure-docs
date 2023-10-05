---
title: Configure clusters for Azure Active Directory integration
titleSuffix: Azure HDInsight
description: Learn how to set up and configure an HDInsight cluster integrated with Active Directory by using Azure Active Directory Domain Services and the Enterprise Security Package feature.
ms.service: hdinsight
ms.topic: how-to
ms.custom: seodec18,seoapr2020, contperf-fy21q2
ms.date: 09/21/2023
---

# Configure HDInsight clusters for Azure Active Directory integration with Enterprise Security Package

This article provides a summary and overview of the process of creating and configuring an HDInsight cluster integrated with Azure Active Directory. This integration relies on a HDInsight feature called Enterprise Security Package (ESP), Azure Active Directory Domain Services (Azure AD-DS) and your pre-existing on-premises Active Directory.

For a detailed, step-by-step tutorial on setting up and configuring a domain in Azure and creating an ESP enabled cluster and then syncing on-premises users, see [Create and configure Enterprise Security Package clusters in Azure HDInsight](apache-domain-joined-create-configure-enterprise-security-cluster.md).

## Background

Enterprise Security Package (ESP) provides Active Directory integration for Azure HDInsight. This integration allows domain users to use their domain credentials to authenticate with HDInsight clusters and run big data jobs.

> [!NOTE]  
> ESP is generally available in HDInsight 4.0 and 5.0 for these cluster types: Apache Spark, Interactive, Hadoop, Apache Kafka, and HBase. ESP clusters created before the ESP GA date (October 1, 2018) are not supported.

## Prerequisites

There are a few prerequisites to complete before you can create an ESP-enabled HDInsight cluster:

- An existing on-premises Active Directory and Azure Active Directory.
- Enable Azure AD-DS.
- Check Azure AD-DS health status to ensure synchronization completed.
- Create and authorize a managed identity.
- Complete Networking setup for DNS and related issues.

Each of these items are discussed in details. For a walkthrough of completing all of these steps, see [Create and configure Enterprise Security Package clusters in Azure HDInsight](apache-domain-joined-create-configure-enterprise-security-cluster.md).

### Enable Azure AD DS

Enabling Azure AD DS is a prerequisite before you can create an HDInsight cluster with ESP. For more information, see [Enable Azure Active Directory Domain Services by using the Azure portal](../../active-directory-domain-services/tutorial-create-instance.md).

When Azure AD DS is enabled, all users and objects start synchronizing from Azure Active Directory (Azure AD) to Azure AD DS by default. The length of the sync operation depends on the number of objects in Azure AD. The sync might take a few days for hundreds of thousands of objects.

The domain name that you use with Azure AD DS must be 39 characters or fewer, to work with HDInsight.

You can choose to sync only the groups that need access to the HDInsight clusters. This option of syncing only certain groups is called *scoped synchronization*. For instructions, see [Configure scoped synchronization from Azure AD to your managed domain](../../active-directory-domain-services/scoped-synchronization.md).

When you're enabling secure LDAP, put the domain name in the subject name. And the subject alternative name in the certificate. If your domain name is *contoso100.onmicrosoft.com*, ensure the exact name exists in your certificate subject name and subject alternative name. For more information, see [Configure secure LDAP for an Azure AD DS managed domain](../../active-directory-domain-services/tutorial-configure-ldaps.md).

The following example creates a self-signed certificate. The domain name *contoso100.onmicrosoft.com* is in both `Subject` (subject name) and `DnsName` (subject alternative name).

```powershell
$lifetime=Get-Date
New-SelfSignedCertificate -Subject contoso100.onmicrosoft.com `
  -NotAfter $lifetime.AddDays(365) -KeyUsage DigitalSignature, KeyEncipherment `
  -Type SSLServerAuthentication -DnsName *.contoso100.onmicrosoft.com, contoso100.onmicrosoft.com
```

> [!NOTE]  
> Only tenant administrators have the privileges to enable Azure AD DS. If the cluster storage is Azure Data Lake Storage Gen1 or Gen2, you must disable Azure AD Multi-Factor Authentication only for users who will need to access the cluster by using basic Kerberos authentication.  If your organization requires Multi-Factor Authentication, try using the [HDInsight ID Broker feature](identity-broker.md).
>
> You can use [trusted IPs](../../active-directory/authentication/howto-mfa-mfasettings.md#trusted-ips) or [Conditional Access](../../active-directory/conditional-access/overview.md) to disable Multi-Factor Authentication for specific users *only* when they're accessing the IP range for the HDInsight cluster's virtual network.
>
> If the cluster storage is Azure Blob storage, do not disable Multi-Factor Authentication.

### Check Azure AD DS health status

View the health status of Azure Active Directory Domain Services by selecting **Health** in the **Manage** category. Make sure the status of Azure AD DS is green (running) and the synchronization is complete.

:::image type="content" source="./media/apache-domain-joined-configure-using-azure-adds/hdinsight-aadds-health.png" alt-text="Azure AD DS health" border="true":::

### Create and authorize a managed identity

Use a *user-assigned managed identity* to simplify secure domain services operations. When you assign the **HDInsight Domain Services Contributor** role to the managed identity, it can read, create, modify, and delete domain services operations.

Certain domain services operations, such as creating OUs and service principals, are needed for HDInsight Enterprise Security Package. You can create managed identities in any subscription. For more information on managed identities in general, see [Managed identities for Azure resources](../../active-directory/managed-identities-azure-resources/overview.md). For more information on how managed identities work in Azure HDInsight, see [Managed identities in Azure HDInsight](../hdinsight-managed-identities.md).

To set up ESP clusters, create a user-assigned managed identity if you don't have one already. See [`Create, list, delete, or assign a role to a user-assigned managed identity by using the Azure portal`](../../active-directory/managed-identities-azure-resources/how-to-manage-ua-identity-portal.md).

Next, assign the **HDInsight Domain Services Contributor** role to the managed identity in **Access control** for Azure AD DS. You need Azure AD DS admin privileges to make this role assignment.

:::image type="content" source="./media/apache-domain-joined-configure-using-azure-adds/hdinsight-configure-managed-identity.png" alt-text="Azure Active Directory Domain Services Access control" border="true":::

Assigning the **HDInsight Domain Services Contributor** role ensures that this identity has proper (`on behalf of`) access to do domain services operations on the Azure AD DS domain. These operations include creating and deleting OUs.

After the managed identity is given the role, the Azure AD DS admin manages who uses it. First, the admin selects the managed identity in the portal. Then selects **Access Control (IAM)** under **Overview**. The admin assigns the **Managed Identity Operator** role to users or groups that want to create ESP clusters.

For example, the Azure AD DS admin can assign this role to the **MarketingTeam** group for the **sjmsi** managed identity. An example is shown in the following image. This assignment ensures the right people in the organization can use the managed identity to create ESP clusters.

:::image type="content" source="./media/apache-domain-joined-configure-using-azure-adds/hdinsight-managed-identity-operator-role-assignment.png" alt-text="HDInsight Managed Identity Operator Role Assignment" border="true":::

### Network configuration

> [!NOTE]  
> Azure AD DS must be deployed in an Azure Resource Manager-based virtual network. Classic virtual networks are not supported for Azure AD DS. For more information, see [Enable Azure Active Directory Domain Services by using the Azure portal](../../active-directory-domain-services/tutorial-create-instance-advanced.md#create-and-configure-the-virtual-network).

Enable Azure AD DS. Then a local Domain Name System (DNS) server runs on the Active Directory virtual machines (VMs). Configure your Azure AD DS virtual network to use these custom DNS servers. To locate the right IP addresses, select **Properties** in the **Manage** category and look under **IP ADDRESS ON VIRTUAL NETWORK**.

:::image type="content" source="./media/apache-domain-joined-configure-using-azure-adds/hdinsight-aadds-dns1.png" alt-text="Locate IP addresses for local DNS servers" border="true":::

Change the configuration of the DNS servers in the Azure AD DS virtual network. To use these custom IPs, select **DNS servers** in the **Settings** category. Then select the **Custom** option, enter the first IP address in the text box, and select **Save**. Add more IP addresses by using the same steps.

:::image type="content" source="./media/apache-domain-joined-configure-using-azure-adds/hdinsight-aadds-vnet-configuration.png" alt-text="Updating the virtual network DNS configuration" border="true":::

It's easier to place both the Azure AD DS instance and the HDInsight cluster in the same Azure virtual network. If you plan to use different virtual networks, you must peer those virtual networks so that the domain controller is visible to HDInsight VMs. For more information, see [Virtual network peering](../../virtual-network/virtual-network-peering-overview.md).

After the virtual networks are peered, configure the HDInsight virtual network to use a custom DNS server. And enter the Azure AD DS private IPs as the DNS server addresses. When both virtual networks use the same DNS servers, your custom domain name resolves to the right IP and it is reachable from HDInsight. For example, if your domain name is `contoso.com`, then after this step, `ping contoso.com` should resolve to the right Azure AD DS IP.

:::image type="content" source="./media/apache-domain-joined-configure-using-azure-adds/hdinsight-aadds-peered-vnet-configuration.png" alt-text="Configuring custom DNS servers for a peered virtual network" border="true":::

If you're using network security group (NSG) rules in your HDInsight subnet, you should allow the [required IPs](../hdinsight-management-ip-addresses.md) for both inbound and outbound traffic.

To test your network setup, join a Windows VM to the HDInsight virtual network/subnet and ping the domain name. (It should resolve to an IP.) Run **ldp.exe** to access the Azure AD DS domain. Then join this Windows VM to the domain to confirm that all the required RPC calls succeed between the client and server.

Use **nslookup** to confirm network access to your storage account. Or any external database that you might use (for example, external Hive metastore or Ranger DB). Ensure the [required ports](/previous-versions/windows/it-pro/windows-server-2008-R2-and-2008/dd772723(v=ws.10)#communication-to-domain-controllers) are allowed in the Azure AD DS subnet's NSG rules, if an NSG secures Azure AD DS. If the domain joining of this Windows VM is successful, then you can continue to the next step and create ESP clusters.

## Create an HDInsight cluster with ESP

After you've set up the previous steps correctly, the next step is to create the HDInsight cluster with ESP enabled. When you create an HDInsight cluster, you can enable Enterprise Security Package on the **Security + networking** tab. For an Azure Resource Manager template for deployment, use the portal experience once. Then download the prefilled template on the **Review + create** page for future reuse.

You can also enable the [HDInsight ID Broker](identity-broker.md) feature during cluster creation. The ID Broker feature lets you sign in to Ambari by using Multi-Factor Authentication and get the required Kerberos tickets without needing password hashes in Azure AD DS.

> [!NOTE]  
> The first six characters of the ESP cluster names must be unique in your environment. For example, if you have multiple ESP clusters in different virtual networks, choose a naming convention that ensures the first six characters on the cluster names are unique.

:::image type="content" source="./media/apache-domain-joined-configure-using-azure-adds/azure-portal-cluster-security-networking-esp.png" alt-text="Domain validation for Azure HDInsight Enterprise Security Package" border="true":::

After you enable ESP, common misconfigurations related to Azure AD DS are automatically detected and validated. After you fix these errors, you can continue with the next step.

:::image type="content" source="./media/apache-domain-joined-configure-using-azure-adds/azure-portal-cluster-security-networking-esp-error.png" alt-text="Azure HDInsight Enterprise Security Package failed domain validation" border="true":::

When you create an HDInsight cluster with ESP, you must supply the following parameters:

* **Cluster admin user**: Choose an admin for your cluster from your synced Azure AD DS instance. This domain account must be already synced and available in Azure AD DS.

* **Cluster access groups**: The security groups whose users you want to sync and have access to the cluster should be available in Azure AD DS. An example is the HiveUsers group. For more information, see [Create a group and add members in Azure Active Directory](../../active-directory/fundamentals/active-directory-groups-create-azure-portal.md).

* **LDAPS URL**: An example is `ldaps://contoso.com:636`.

The managed identity that you created can be chosen from the **User-assigned managed identity** drop-down list when you're creating a new cluster.

:::image type="content" source="./media/apache-domain-joined-configure-using-azure-adds/azure-portal-cluster-security-networking-identity.png" alt-text="Azure HDInsight ESP Active Directory Domain Services managed identity" border="true":::.

## Next steps

* For configuring Hive policies and running Hive queries, see [Configure Apache Hive policies for HDInsight clusters with ESP](apache-domain-joined-run-hive.md).
* For using SSH to connect to HDInsight clusters with ESP, see [Use SSH with Linux-based Apache Hadoop on HDInsight from Linux, Unix, or OS X](../hdinsight-hadoop-linux-use-ssh-unix.md#authentication-domain-joined-hdinsight).
