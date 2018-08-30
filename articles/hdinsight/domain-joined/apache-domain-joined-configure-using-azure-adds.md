---
title: Configure a domain-joined HDInsight cluster by using Azure AD DS
description: Learn how to set up and configure a domain-joined HDInsight cluster by using Azure Active Directory Domain Services
services: hdinsight
ms.service: hdinsight
author: omidm1
ms.author: omidm
ms.reviewer: jasonh
ms.topic: conceptual
ms.date: 07/17/2018
---
# Configure a domain-joined HDInsight cluster by using Azure Active Directory Domain Services

Domain-joined clusters provide multiuser access on Azure HDInsight clusters. Domain-joined HDInsight clusters are connected to a domain so that domain users can use their domain credentials to authenticate with the clusters and run big data jobs. 

In this article, you learn how to configure a domain-joined HDInsight cluster by using Azure Active Directory Domain Services (Azure AD DS).

## Enable Azure AD DS

Enabling Azure AD DS is a prerequisite before you can create a domain-joined HDInsight cluster. For more information, see [Enable Azure Active Directory Domain Services using the Azure portal](../../active-directory-domain-services/active-directory-ds-getting-started.md). 

> [!NOTE]
> Only tenant administrators have the privileges to create an Azure AD DS instance. If you use Azure Data Lake Storage Gen1 as the default storage for HDInsight, make sure that the default Azure AD tenant for Data Lake Storage Gen1 is same as the domain for the HDInsight cluster. Because Hadoop relies on Kerberos and basic authentication, multi-factor authentication needs to be disabled for users who will access the cluster.

After you provision the Azure AD DS instance, create a service account in Azure Active Directory (Azure AD) with the right permissions. If this service account already exists, reset its password and wait until it syncs to Azure AD DS. This reset will result in the creation of the Kerberos password hash, and it might take up to 30 minutes to sync to Azure AD DS. 

The service account needs the following privileges:

- Join machines to the domain and place machine principals within the OU that you specify during cluster creation.
- Create service principals within the OU that you specify during cluster creation.

> [!NOTE]
> Because Apache Zeppelin uses the domain name to authenticate the administrative service account, the service account *must* have the same domain name as its UPN suffix for Apache Zeppelin to function properly.

To learn more about OUs and how to manage them, see [Create an OU on an Azure AD DS managed domain](../../active-directory-domain-services/active-directory-ds-admin-guide-create-ou.md). 

Secure LDAP is for an Azure AD DS managed domain. For more information, see [Configure secure LDAP for an Azure AD DS managed domain](../../active-directory-domain-services/active-directory-ds-admin-guide-configure-secure-ldap.md).

## Create a domain-joined HDInsight cluster

The next step is to create the HDInsight cluster by using Azure AD DS and the service account that you created in the previous section.

It's easier to place both the Azure AD DS instance and the HDInsight cluster in the same Azure virtual network. If you choose to put them in different virtual networks, you must peer those virtual networks so that HDInsight VMs have a line of sight to the domain controller for joining the VMs. For more information, see [Virtual network peering](../../virtual-network/virtual-network-peering-overview.md).

When you create a domain-joined HDInsight cluster, you must supply the following parameters:

- **Domain name**: The domain name that's associated with Azure AD DS. An example is contoso.onmicrosoft.com.

- **Domain user name**: The service account in the Azure ADDS DC managed domain that you created in the previous section. An example is hdiadmin@contoso.onmicrosoft.com. This domain user will be the administrator of this HDInsight cluster.

- **Domain password**: The password of the service account.

- **Organizational unit**: The distinguished name of the OU that you want to use with the HDInsight cluster. An example is OU=HDInsightOU,DC=contoso,DC=onmicrosoft,DC=com. If this OU does not exist, the HDInsight cluster tries to create the OU by using the privileges that the service account has. For example, if the service account is in the Azure AD DS Administrators group, it has the right permissions to create an OU. Otherwise, you need to create the OU first and give the service account full control over that OU. For more information, see [Create an OU on an Azure AD DS managed domain](../../active-directory-domain-services/active-directory-ds-admin-guide-create-ou.md).

    > [!IMPORTANT]
    > Include all of the DCs, separated by commas, after the OU (for example, OU=HDInsightOU,DC=contoso,DC=onmicrosoft,DC=com).

- **LDAPS URL**: An example is ldaps://contoso.onmicrosoft.com:636.

    > [!IMPORTANT]
    > Enter the complete URL, including "ldaps://" and the port number (:636).

- **Access user group**: The security groups whose users you want to sync to the cluster. For example, HiveUsers. If you want to specify multiple user groups, separate them by semicolon ‘;’. The group(s) must exist in the directory prior to provisioning. For more information, see [Create a group and add members in Azure Active Directory](../../active-directory/fundamentals/active-directory-groups-create-azure-portal.md). If the group does not exist, an error occurs: "Group HiveUsers not found in the Active Directory."

The following screenshot shows the configurations in the Azure portal:

   ![Azure HDInsight domain-joined Active Directory Domain Services configuration](./media/apache-domain-joined-configure-using-azure-adds/hdinsight-domain-joined-configuration-azure-aads-portal.png).


## Next steps
* For configuring Hive policies and running Hive queries, see [Configure Hive policies for domain-joined HDInsight clusters](apache-domain-joined-run-hive.md).
* For using SSH to connect to domain-joined HDInsight clusters, see [Use SSH with Linux-based Hadoop on HDInsight from Linux, Unix, or OS X](../hdinsight-hadoop-linux-use-ssh-unix.md#domainjoined).

