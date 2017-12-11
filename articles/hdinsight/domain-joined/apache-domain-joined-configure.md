---
title: Configure Domain-joined HDInsight clusters - Azure | Microsoft Docs
description: Learn how to set up and configure Domain-joined HDInsight clusters
services: hdinsight
documentationcenter: ''
author: saurinsh
manager: jhubbard
editor: cgronlun
tags: ''

ms.assetid: 0cbb49cc-0de1-4a1a-b658-99897caf827c
ms.service: hdinsight
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: big-data
ms.date: 12/11/2017
ms.author: saurinsh

---
# Configure Domain-joined HDInsight clusters

Learn how to set up an Azure HDInsight cluster with Azure Active Directory (Azure AD) and [Apache Ranger](http://hortonworks.com/apache/ranger/) to take advantage of strong authentication and rich role-based access control (RBAC) policies. For more information, see [Introduce Domain-joined HDInsight clusters](apache-domain-joined-introduction.md).

Without domain joined HDInsight cluster, each cluster can only have a Hadoop HTTP users account, and an SSH user account.  The multi-user authentication can be achieved using:

-	A standalone Active Directory running on Azure IaaS
-	Azure Active Directory
-	Active Directory running on the customer on-premises environment.

Using a standalone Active Directory running on Azure IaaS is covered in this article. It is the simplest architecture a customer can follow to get multi-user support on HDInsight. 


> [!IMPORTANT]
> Oozie is not enabled on domain-joined HDInsight.

This article is the first tutorial of a series:

* Create an HDInsight cluster connected to Azure AD (via the Azure Directory Domain Services capability) with Apache Ranger enabled.
* Create and apply Hive policies through Apache Ranger, and allow users (for example, data scientists) to connect to Hive using ODBC-based tools, for example Excel, Tableau etc. Microsoft is working on adding other workloads, such as HBase and Storm, to Domain-joined HDInsight soon.

Azure service names must be globally unique. The following names are used in this tutorial. Contoso is a fictitious name. You must replace *contoso* with a different name when you go through the tutorial. 

**Names:**

| Property | Value |
| --- | --- |
| Azure AD directory |contosoaaddirectory |
| Azure AD domain name |contoso (contoso.onmicrosoft.com) |
| HDInsight VNet |contosohdivnet |
| HDInsight VNet resource group |contosohdirg |
| HDInsight cluster |contosohdicluster |

This tutorial provides the steps for configuring a domain-joined HDInsight cluster. Each section has links to other articles with more background information.

## Prerequisite:
* Familiarize yourself with [Azure AD Domain Services](https://azure.microsoft.com/services/active-directory-ds/) its [pricing](https://azure.microsoft.com/pricing/details/active-directory-ds/) structure.
* An SSL certificate that is signed by a signing authority or a Self-signed certificate for your domain. The certificate is required for configuring secure LDAP.

## Create a domain controller virtual machine

Azure Resource Manager template makes it easier to create Azure resources. In this section, you use an Azure QuickStart template](https://azure.microsoft.com/resources/templates/active-directory-new-domain-ha-2-dc/) to create a new forest and domain with two virtual machines. The two virtual machines serve as a primary domain controller and a backup domain controller.

1. Create a Resource Manager vnet

Name: contosohdivnet
Address space: 10.0.0.0/16.
Subnet name: Subnet1
Subnet address range: 10.0.0.0/24
Subscription: (Select your Azure subscription.)
Resource group: contosohdirg
Location: (Select the same location as the Azure AD VNet. For example, contosoaadvnet.)


1. Create an Azure AD.
2. Create Azure AD users. These users are domain users. You use the first user for configuring the HDInsight cluster with the Azure AD. The other two users are optional for this tutorial. They will be used in Configure Hive policies for Domain-joined HDInsight clusters when you configure Apache Ranger policies.
3. Create the AAD DC Administrators group and add the Azure AD user to the group. You use this user to create the organizational unit.
4. Enable Azure AD Domain Services (Azure AD DS) for the Azure AD.

DNS?


**To create a domain with two domain controllers**

1. Click the following image to open the template in the Azure portal.

    <a href="https://portal.azure.com/#create/Microsoft.Template/uri/https%3A%2F%2Fraw.githubusercontent.com%2FAzure%2Fazure-quickstart-templates%2Fmaster%2Factive-directory-new-domain-ha-2-dc%2Fazuredeploy.json" target="_blank"><img src="./media/apache-domain-joined-configure/deploy-to-azure.png" alt="Deploy to Azure"></a>

    The template looks like:

    ![HDInsight domain joined create forest domain virtual machines](./media/apache-domain-joined-configure/hdinsight-domain-joined-create-arm-template.png)

2. Enter the following values:

    - Subscription: Select an Azure subscription.
    - Resource group name: Type a resource group name.  A resource group is used to manage your Azure resources that are related to a project.
    - Location: Select an Azure location that is close to you.
    - Admin username: This the domain administrator username. This user is not the HTTP user account of your HDInsight cluster. This is the account you use throughout the tutorial.
    - Admin password: Enter the password for the domain administrator.
    - Domain name: The domain name must be a two-part name. For example: contoso.com, or contoso.local, or hdinsight.test.
    - DNS prefix: Type a DNS prefix
    - PDC RDP Port: (use the default value for this tutorial)
    - BDC RDP Port: (use the default value for this tutorial)
    - artifacts location: (use the default value for this tutorial)
    - artifacts location SAS token: (Leave it empty for this tutorial.)

It takes about 20 minutes to create the resources.

## Setup LDAPS

The Lightweight Directory Access Protocol (LDAP) is used to read from and write to Azure AD.

**To connect to the PDC using remote desktop**

1. Sign in to the [Azure portal](https://portal.azure.com).
2. Open the resource group, and then open the primary domain controller (PDC) virtual machine. The default PDC name is adPDC. 
3. Click **Connect** to connect to the PDC using remote desktop.

    ![HDInsight domain joined connect PDC remote desktop](./media/apache-domain-joined-configure/hdinsight-domain-joined-remote-desktop-pdc.png)


**To add the Active Directory Certificate services**

4. Open **Server Manager** if it is not opened.
5. Click **Manage**, and then click **Add Roles and Features**.

    ![HDInsight domain joined add roles and features](./media/apache-domain-joined-configure/hdinsight-domain-joined-add-roles.png)
5. From "Before you begin", click **Next**.
6. Select **Role-based or feature-based installation**, and then click **Next**.
7. Select the PDC, and then click **Next**.  The default PDC name is adPDC.
8. Select **Active Directory Certificate Services**.
9. Click **Add Features** from the popup dialog.
10. Follow the wizard, use the default settings for the rest of the procedure.
11. Click **Close** to close the wizard.

**To configure AD certificate**

1. From Server Manager, click the yellow notification icon, and then click **Configure Active Directory Certificate services**.

    ![HDInsight domain joined configure AD certificate](./media/apache-domain-joined-configure/hdinsight-domain-joined-configure-ad-certificate.png)

2. Click **role Services on the left, select **Certification Authority**, and then click **Next**.
3. Follow the wizard, use the default settings for the rest of the procedure (click **Configure** at the last step).
4. Click **Close** to close the wizard.


To create users and groups in the AD
1. Open **Active Directory Users and Computers**.
2. Select your domain name in the left pane.
3. Click the **Create a new users in the current container** icon on the top menu.

> [!IMPORTANT]
> You must reboot the PDC before creating a domain-joined HDInsight cluster.

## Create a HDInsight cluster in the VNet

In this section, you use the Azure portal to add a HDInsight cluster into the virtual network you created using the resouce manager template earlier in the tutorial. This article only covers the specific information for domain-joined cluster configuration.  For the general information, see [Create Linux-based clusters in HDInsight using the Azure portal](../hdinsight-hadoop-create-linux-clusters-portal.md).  

**To create a domain-joined HDInsight cluster**

1. Sign on to the [Azure portal](https://portal.azure.com).
2. Open the resource group you created using the resource manager template earlier in the tutorial.
3. Add a HDInsight cluster to the resource group.
4. Select **Custom** option:

    ![HDInsight domain joined custom create option](./media/apache-domain-joined-configure/hdinsight-domain-joined-portal-custom-configuration-option.png)

    There are six sections using the custom configuration option: Basics, Storage, Application, Cluster size, Advanced settings, and Summary.
5. In the **Basics** section:

    - Cluster type: Choose **PREMIUM**. Currently you can only create premium cluster with the following cluster types: Hadoop, Interactive Query, and Spark.

        ![HDInsight domain joined Premium](./media/apache-domain-joined-configure/hdinsight-domain-joined-create-cluster-premium.png)
    - Cluster login username: The is the Hadoop HTTP user. This account is different from the domain administrator account.
    - Resource group: Select the resource group you created earlier using the resource manager template.
    - Location:  The location must be the same as the one you used when you create the vnet and the DCs using the resource manager template.

6. In the **Advanced settings** section:

    - Domain settings:

        ![HDInsight domain joined advanced settings domain](./media/apache-domain-joined-configure/hdinsight-domain-joined-portal-advanced-domain-settings.png)
        
        - Domain name:
        - Domain user name:
        - Organization Unit:
        - LDAPS URL:
        - Access user group:
    - Virtual network:
    - Subnet: 





After you complete the tutorial, you might want to delete the cluster. With HDInsight, your data is stored in Azure Storage, so you can safely delete a cluster when it is not in use. You are also charged for an HDInsight cluster, even when it is not in use. Since the charges for the cluster are many times more than the charges for storage, it makes economic sense to delete clusters when they are not in use. For the instructions of deleting a cluster, see [Manage Hadoop clusters in HDInsight by using the Azure portal](../hdinsight-administer-use-management-portal.md#delete-clusters).

## Next steps
* For configuring Hive policies and run Hive queries, see [Configure Hive policies for Domain-joined HDInsight clusters](apache-domain-joined-run-hive.md).
* For using SSH to connect to Domain-joined HDInsight clusters, see [Use SSH with Linux-based Hadoop on HDInsight from Linux, Unix, or OS X](../hdinsight-hadoop-linux-use-ssh-unix.md#domainjoined).

