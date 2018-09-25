---
title: Configure a HDInsight cluster with Enterprise Security Package by using Azure AD-DS
description: Learn how to set up and configure a HDInsight Enterprise Security Package cluster by using Azure Active Directory Domain Services
services: hdinsight
ms.service: hdinsight
author: omidm1
ms.author: omidm
ms.reviewer: jasonh
ms.topic: conceptual
ms.date: 09/24/2018
---
# Configure a HDInsight cluster with Enterprise Security Package by using Azure Active Directory Domain Services

Enterprise Security Package (ESP) clusters provide multi-user access on Azure HDInsight clusters. HDInsight clusters with ESP are connected to a domain so that domain users can use their domain credentials to authenticate with the clusters and run big data jobs. 

In this article, you learn how to configure a HDInsight cluster with ESP by using Azure Active Directory Domain Services (Azure AD-DS).

>[!NOTE]
>ESP is available in HDI 3.6+ for Spark, Interactive, and Hadoop. ESP for HBase cluster types is in preview.


## Enable Azure AD-DS

Enabling Azure AD-DS is a prerequisite before you can create a HDInsight cluster with ESP. For more information, see [Enable Azure Active Directory Domain Services using the Azure portal](../../active-directory-domain-services/active-directory-ds-getting-started.md). 

> [!NOTE]
> Only tenant administrators have the privileges to create an Azure AD-DS instance. If you use Azure Data Lake Storage Gen1 as the default storage for HDInsight, make sure that the default Azure AD tenant for Data Lake Storage Gen1 is same as the domain for the HDInsight cluster. Because Hadoop relies on Kerberos and basic authentication, multi-factor authentication needs to be disabled for users who will access the cluster.

Secure LDAP is for an Azure AD-DS managed domain. When enabling LDAPS, put the domain name in the subject name or the alternative subject name in the certificate. For more information, see [Configure secure LDAP for an Azure AD-DS managed domain](../../active-directory-domain-services/active-directory-ds-admin-guide-configure-secure-ldap.md).

## Add managed identity

After you enabled Azure AD-DS, create a managed identity and assign it to the **HDInsight Domain Services Contributor** role in Azure AD-DS Access control.

![Azure Active Directory Domain Services Access control](./media/apache-domain-joined-configure-using-azure-adds/hdinsight-configure-managed-identity.png)

For more information, see [What is managed identities for Azure resources](../../active-directory/managed-identities-azure-resources/overview.md).

## Create a HDInsight cluster with ESP

The next step is to create the HDInsight cluster with ESP enabled using Azure AD-DS.

It's easier to place both the Azure AD-DS instance and the HDInsight cluster in the same Azure virtual network. If you choose to put them in different virtual networks, you must peer those virtual networks so that HDInsight VMs have a line of sight to the domain controller for joining the VMs. For more information, see [Virtual network peering](../../virtual-network/virtual-network-peering-overview.md).

When you create an HDInsight cluster, you have the option to enable Enterprise Security Package to connect your cluster with Azure AD-DS. 

![Azure HDInsight Security and networking](./media/apache-domain-joined-configure-using-azure-adds/hdinsight-create-cluster-security-networking.png)

Once you enable ESP, common misconfigurations related to Azure AD-DS will be automatically detected and validated.

![Azure HDInsight Enterprise security package domain validation](./media/apache-domain-joined-configure-using-azure-adds/hdinsight-create-cluster-esp-domain-validate.png)

Early detection saves time by allowing you to fix errors before creating the cluster.

![Azure HDInsight Enterprise security package failed domain validation](./media/apache-domain-joined-configure-using-azure-adds/hdinsight-create-cluster-esp-domain-validate-failed.png)

When you create a HDInsight cluster with ESP, you must supply the following parameters:

- **Cluster admin user**: Choose an admin for your cluster from your synced Azure AD-DS.

- **Cluster access groups**: The security groups whose users you want to sync to the cluster should be synced and available in Azure AD-DS. For example, HiveUsers. If you want to specify multiple user groups, separate them by semicolon ‘;’. The group(s) must exist in the directory prior to provisioning. For more information, see [Create a group and add members in Azure Active Directory](../../active-directory/fundamentals/active-directory-groups-create-azure-portal.md). If the group does not exist, an error occurs: "Group HiveUsers not found in the Active Directory."

- **LDAPS URL**: An example is ldaps://contoso.onmicrosoft.com:636.

    > [!IMPORTANT]
    > Enter the complete URL, including "ldaps://" and the port number (:636).

The following screenshot shows the configurations in the Azure portal:

   ![Azure HDInsight ESP Active Directory Domain Services configuration](./media/apache-domain-joined-configure-using-azure-adds/hdinsight-domain-joined-configuration-azure-aads-portal.png).


## Next steps
* For configuring Hive policies and running Hive queries, see [Configure Hive policies for HDInsight clusters with ESP](apache-domain-joined-run-hive.md).
* For using SSH to connect to HDInsight clusters with ESP, see [Use SSH with Linux-based Hadoop on HDInsight from Linux, Unix, or OS X](../hdinsight-hadoop-linux-use-ssh-unix.md#domainjoined).

