---
title: Configure Domain-joined HDInsight clusters using AAD-DS
description: Learn how to set up and configure Domain-joined HDInsight clusters using Azure Active Directory Domain Services
services: hdinsight
author: omidm1
manager: jhubbard
editor: cgronlun


ms.service: hdinsight
ms.topic: conceptual
ms.date: 05/30/2018
ms.author: omidm

---
# Configure Domain-joined HDInsight clusters using Azure Active Directory Domain Services

Domain-joined clusters provide the multi-user access on HDInsight clusters. Domain-joined HDInsight clusters are connected to a domain, so that domain users can use their domain credentials to authenticate with the clusters and run big data jobs. 

In this article, you learn how to configure a Domain-joined HDInsight cluster using Azure Active Directory Domain Services.

## Create Azure ADDS

Enabling Azure AD Domain Services (AAD-DS) is a prerequisite before you can create a domain-joined HDInsight cluster. To enable an AAD-DS instance, see [How to enable AAD-DS using the Azure portal](../../active-directory-domain-services/active-directory-ds-getting-started.md). 

> [!NOTE]
> Only the tenant administrators have the privileges to create an AAD-DS instance. If you use Azure Data Lake Storage (ADLS) as the default storage for HDInsight, then make sure the default Azure AD tenant for ADLS is same as the domain for the HDInsight cluster. Sincde Hadoop relies on Kerberos and basic auth, multi-factor authentication needs to be disabled for users that will have access to the cluster.

After the AAD-DS instance has been provisioned, you need to create a service account in AAD (which will be synced to AAD-DS) with the right permissions. If this service account already exists, you need to reset its password and wait until it syncs to AAD-DS (This reset will result in creation of the kerberos password hash and it could take up to 30 min to sync to AAD-DS). This service account should have the following privileges:

- Join machines to the domain and place machine principals within the OU that you specify during cluster creation.
- Create service principals within the OU that you specify during cluster creation.

> [!NOTE]
> Because Apache Zeppelin uses the domain name to authenticate the administrative service account, the service account MUST have the same domain name as its UPN suffix for Apache Zeppelin to function properly.

To learn more about OUs and how to manage them, see [Create an OU on an AAD-DS](../../active-directory-domain-services/active-directory-ds-admin-guide-create-ou.md). 

Secure LDAP for AAD-DS Managed Domain is required. To enable Secure LDAP, see [How to configure secure LDAP (LDAPS) for an AAD-DS managed domain](../../active-directory-domain-services/active-directory-ds-admin-guide-configure-secure-ldap.md).

## Create a Domain-joined HDInsight cluster

The next step is to create the HDInsight cluster using the AAD-DS and the service account created in the previous section.

It is easier to place both the AAD-DS and the HDInsight cluster in the same Azure virtual network(VNet). In case you chose to put them in different VNets, you must peer those VNets so that HDI VMs have a line of sight to the domain controller for joining the VMs. For more information, see [Virtual network peering](../../virtual-network/virtual-network-peering-overview.md).

When you create a domain-joined HDInsight cluster, you must supply the following parameters:

- **Domain name**: The domain-name that is associated with AAD-DS. For example, contoso.onmicrosoft.com
- **Domain user name**: The service account in the managed domain that is created in the previous section. For example, hdiadmin@contoso.onmicrosoft.com. This domain user will be the administrator of this HDInsight cluster.
- **Domain password**: The password of the service account.
- **Organization Unit**: The distinguished name of the OU that you want to use with HDInsight cluster. For example: OU=HDInsightOU,DC=contoso,DC=onmicrosohift,DC=com. If this OU does not exist, HDInsight cluster attempts to create the OU using the privileges the service account has. (For example, if the service account is in AAD-DS Administrators Group, it has the right permissions to create an OU, otherwise you might need to create the OU first and give the service acccount full control over that OU first - see [Create an OU on an AAD-DS](../../active-directory-domain-services/active-directory-ds-admin-guide-create-ou.md)).

    > [!IMPORTANT]
    > It's important to include all of the DCs sepearated by comma after the OU (e.g. OU=HDInsightOU,DC=contoso,DC=onmicrosohift,DC=com).

- **LDAPS URL**: For example, ldaps://contoso.onmicrosoft.com:636

    > [!IMPORTANT]
    > Please enter the complete url including the ldaps:// and port number (:636)

- **Access user group**: The security groups whose users you want to sync to the cluster. For example, HiveUsers. If you want to specify multiple user groups, separate them by comma ‘,’.
 
The following screenshot shows the configurations in the Azure portal:

![Azure HDInsight domain-joined Active Directory Domain Services configuration](./media/apache-domain-joined-configure-using-azure-adds/hdinsight-domain-joined-configuration-azure-aads-portal.png).


## Next steps
* For configuring Hive policies and run Hive queries, see [Configure Hive policies for Domain-joined HDInsight clusters](apache-domain-joined-run-hive.md).
* For using SSH to connect to Domain-joined HDInsight clusters, see [Use SSH with Linux-based Hadoop on HDInsight from Linux, Unix, or OS X](../hdinsight-hadoop-linux-use-ssh-unix.md#domainjoined).

