---
title: Configure Domain-joined HDInsight clusters| Microsoft Docs
description: Learn how to set up and configure Domain-joined HDInsight clusters
services: hdinsight
documentationcenter: ''
author: saurinsh
manager: jhubbard
editor: cgronlun
tags: ''

ms.assetid: 0cbb49cc-0de1-4a1a-b658-99897caf827c
ms.service: hdinsight
ms.custom: hdinsightactive
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: big-data
ms.date: 11/02/2016
ms.author: saurinsh

---
# Configure Domain-joined HDInsight clusters (Preview)
Learn how to set up an Azure HDInsight cluster with Active Directory (AD) and [Apache Ranger](http://hortonworks.com/apache/ranger/) to take advantage of strong authentication and rich role-based access control (RBAC) policies.  Domain-joined HDInsight can only be configured on Linux-based clusters. For more information, see [Introduce Domain-joined HDInsight clusters](hdinsight-domain-joined-introduction.md).

This article is the first tutorial of a series:

* Create an HDInsight cluster connected to AD with Apache Ranger enabled.
* Create and apply Hive policies through Apache Ranger, and allow users (for example, data scientists) to connect to Hive using ODBC-based tools, for example Excel, Tableau etc. Microsoft is working on adding other workloads, such as HBase, Spark, and Storm, to Domain-joined HDInsight soon.

Azure service names must be globally unique. The following names are used in this tutorial. Contoso is a fictitious name. You must replace *contoso* with a different name when you go through the tutorial. 

**Names:**

| Property | Value |
| --- | --- |
| AD domain |contoso.local |
| HDInsight VNet |contosohdivnet |
| HDInsight VNet resource group |contosohdirg |
| HDInsight cluster |contosohdicluster |

This tutorial provides the steps for configuring a domain-joined HDInsight cluster. Each section has links to other articles with more background information.

## Prerequisite:
* Ensure that your subscription is whitelisted for this public preview. You can do so by sending an email to hdipreview@microsoft.com with your subscription ID.
* An SSL certificate that is signed by a signing authority for your domain. The certificate is required by configuring secure LDAP. Self-signed certificates cannot be used.

## Procedures
1. Create an AD.  
2. Setup LDAPS on the AD.
3. Create an HDInsight cluster.

> [!NOTE]
> This tutorial assumes that you do not have an AD. If you have one already setup and configured with LDAPS, you can skip the portion in steps 1 & 2.
> 
> 
## Create an AD on Azure IaaS
Use this ARM template to create an AD on Azure IaaS VMs. This template will provision 2 VMs one for primary domain controller and one for secondary domain controller.
<a href="https://portal.azure.com/#create/Microsoft.Template/uri/https%3A%2F%2Fraw.githubusercontent.com%2FAzure%2Fazure-quickstart-templates%2Fmaster%2Factive-directory-new-domain-ha-2-dc%2Fazuredeploy.json" target="_blank">
<img src="./media/hdinsight-domain-joined-configure/deploy-to-azure.png" alt="Deploy to Azure"></a>


> [!NOTE]
> Do not select the Premium Storage when you deploy the template. HDInsight does not support Premium storage.
> 

## Configure LDAPS for the AD
Follow these steps to setup LDAPS on the AD that you created above.
1. Get an SSL certificate that is signed by a signing authority for your domain. Self-signed certificates can't be used. If you can't get an SSL certificate, please reach out to hdipreview@microsoft.com for an exception.
2. Remote desktop on the primary DC for the AD created above. 
3. For setting up LDAPS, go launch Server Manager and follow the following steps below
   a. Click on **Manage** -> **Add roles and features** -> **Next** -> **Next** -> **Next** -> Select **Active Directory Certificate Services** -> **Next**
   b. Expand **Remote Server Administration Tools** -> expand **Remove Administration Tools** -> expand **AD DS and AD LDS Tools** -> select **AD DS Tools**
   c. Click **Next** -> **Install**.
4. Once the installation is complete, you will see a yellow warning sign for a notification on the right top bar of the **Server Manager**.
5. Click on Notifications and click to configure **Active Directory Certificate Services**.
6. Select the **Certification Authority role service** and keep clicking Next to accept all defaults and configure 
7. After the configuration is complete, restart the server.

## Create HDInsight cluster
In this section, you create a Linux-based Hadoop cluster in HDInsight using either the Azure portal or [Azure Resource Manager template](../azure-resource-manager/resource-group-template-deploy.md). For other cluster creation methods and understanding the settings, see [Create HDInsight clusters](hdinsight-hadoop-provision-linux-clusters.md). For more information about using Resource Manager template to create Hadoop clusters in HDInsight, see [Create Hadoop clusters in HDInsight using Resource Manager templates](hdinsight-hadoop-create-windows-clusters-arm-templates.md)

**To create a Domain-joined HDInsight cluster using the Azure portal**

1. Sign on to the [Azure portal](https://portal.azure.com).
2. Click **New**, **Intelligence + analytics**, and then **HDInsight**.
3. From the **New HDInsight cluster** blade, enter or select the following values:
   
   * **Cluster name**: Enter a new cluster name for the Domain-joined HDInsight cluster.
   * **Subscription**: Select an Azure subscription used for creating this cluster.
   * **Cluster configuration**:
     
     * **Cluster Type**: Hadoop. Domain-joined HDInsight is currently only supported on Hadoop clusters.
     * **Operating System**: Linux.  Domain-joined HDInsight is only supported on Linux-based HDInsight clusters.
     * **Version**: Hadoop 2.7.3 (HDI 3.5). Domain-joined HDInsight is only supported on HDInsight cluster version 3.5.
     * **Cluster Type**: PREMIUM
       
       Click **Select** to save the changes.
   * **Credentials**: Configure the credentials for both the cluster user and the SSH user.
   * **Data Source**: Create a new Storage account or use an existing Storage account as the default Storage account for the HDInsight cluster. The location must be the same as the two VNets.  The location is also the location of the HDInsight cluster.
   * **Pricing**: Select the number of worker nodes of your cluster.
   * **Advanced configurations**: 
     
     * **Domain-joining & Vnet/Subnet**: 
       
       * **Domain settings**: 
         
         * **Domain name**: contoso.onmicrosoft.com
         * **Domain user name**: Enter a domain user name. This domain must have the following privileges: Join machines to the domain and place them in the organization unit you configured earlier; Create service principals within the organization unit you configured earlier; Create reverse DNS entries. This domain user will become the administrator of this domain-joined HDInsight cluster.
         * **Domain password**: Enter the domain user password.
         * **Organization Unit**: Enter the distinguished name of the OU that you configured earlier. For example: OU=HDInsightOU,DC=contoso,DC=onmicrosoft,DC=com
         * **LDAPS URL**: ldaps://contoso.onmicrosoft.com:636
         * **Access user group**: Specify the security group whose users you wan to sync to the cluster. For example, HiveUsers.
           
           Click **Select** to save the changes.
           
           ![Domain-joined HDInsight portal configure domain setting](./media/hdinsight-domain-joined-configure/hdinsight-domain-joined-portal-domain-setting.png)
       * **Virtual Network**: contosohdivnet
       * **Subnet**: Subnet1
         
         Click **Select** to save the changes.        
         Click **Select** to save the changes.
   * **Resource Group**: Select the resource group used for the HDInsight VNet (contosohdirg).
4. Click **Create**.  

Another option for creating Domain-joined HDInsight cluster is to use Azure Resource Management template. The following procedure shows you how:

**To create a Domain-joined HDInsight cluster using a Resource Management template**

1. Click the following image to open a Resource Manager template in the Azure portal. The Resource Manager template is located in a public blob container. 
   
    <a href="https://portal.azure.com/#create/Microsoft.Template/uri/https%3A%2F%2Fhditutorialdata.blob.core.windows.net%2Farmtemplates%2Fcreate-domain-joined-hdinsight-cluster.json" target="_blank"><img src="./media/hdinsight-domain-joined-configure/deploy-to-azure.png" alt="Deploy to Azure"></a>
2. From the **Parameters** blade, enter the following values:
   
   * **Subscription**: (Select your Azure subscription).
   * **Resource group**: Click **Use existing**, and specify the same resource group you have been using.  For example contosohdirg. 
   * **Location**: Specify a resource group location.
   * **Cluster Name**: Enter a name for the Hadoop cluster that you will create. For example contosohdicluster.
   * **Cluster Type**: Select a cluster type.  The default value is **hadoop**.
   * **Location**: Select a location for the cluster.  The default storage account uses the same location.
   * **Cluster Worker Node count**: Select the number of worker nodes.
   * **Cluster login name and password**: The default login name is **admin**.
   * **SSH username and password**: The default username is **sshuser**.  You can rename it. 
   * **Virtual Network Id**: /subscriptions/&lt;SubscriptionID>/resourceGroups/&lt;ResourceGroupName>/providers/Microsoft.Network/virtualNetworks/&lt;VNetName>
   * **Virtual Network Subnet**: /subscriptions/&lt;SubscriptionID>/resourceGroups/&lt;ResourceGroupName>/providers/Microsoft.Network/virtualNetworks/&lt;VNetName>/subnets/Subnet1
   * **Domain Name**: contoso.onmicrosoft.com
   * **Organization Unit DN**: OU=HDInsightOU,DC=contoso,DC=onmicrosoft,DC=com
   * **Cluster Users Group D Ns**: "\"CN=HiveUsers,OU=AADDC Users,DC=<DomainName>,DC=onmicrosoft,DC=com\""
   * **LDAPUrls**: ["ldaps://contoso.onmicrosoft.com:636"]
   * **DomainAdminUserName**: (Enter the domain admin user name)
   * **DomainAdminPassword**: (enter the domain admin user password)
   * **I agree to the terms and conditions stated above**: (Check)
   * **Pin to dashboard**: (Check)
3. Click **Purchase**. You will see a new tile titled **Deploying Template deployment**. It takes about around 20 minutes to create a cluster. Once the cluster is created, you can click the cluster blade in the portal to open it.

After you complete the tutorial, you might want to delete the cluster. With HDInsight, your data is stored in Azure Storage, so you can safely delete a cluster when it is not in use. You are also charged for an HDInsight cluster, even when it is not in use. Since the charges for the cluster are many times more than the charges for storage, it makes economic sense to delete clusters when they are not in use. For the instructions of deleting a cluster, see [Manage Hadoop clusters in HDInsight by using the Azure portal](hdinsight-administer-use-management-portal.md#delete-clusters).

## Next steps
* For configuring a Domain-joined HDInsight cluster using Azure PowerShell, see [Configure Domain-joined HDInsight clusters use Azure PowerShell](hdinsight-domain-joined-configure-use-powershell.md).
* For configuring Hive policies and run Hive queries, see [Configure Hive policies for Domain-joined HDInsight clusters](hdinsight-domain-joined-run-hive.md).
* For using SSH to connect to Domain-joined HDInsight clusters, see [Use SSH with HDInsight](hdinsight-hadoop-linux-use-ssh-unix.md#domainjoined).

