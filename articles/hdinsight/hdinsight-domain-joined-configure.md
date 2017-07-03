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
ms.date: 11/02/2016
ms.author: saurinsh

---
# Configure Domain-joined HDInsight clusters (Preview)

Learn how to set up an Azure HDInsight cluster with Azure Active Directory (Azure AD) and [Apache Ranger](http://hortonworks.com/apache/ranger/) to take advantage of strong authentication and rich role-based access control (RBAC) policies.  Domain-joined HDInsight can only be configured on Linux-based clusters. For more information, see [Introduce Domain-joined HDInsight clusters](hdinsight-domain-joined-introduction.md).

> [!IMPORTANT]
> Oozie is not enabled on domain-joined HDInsight.

This article is the first tutorial of a series:

* Create an HDInsight cluster connected to Azure AD (via the Azure Directory Domain Services capability) with Apache Ranger enabled.
* Create and apply Hive policies through Apache Ranger, and allow users (for example, data scientists) to connect to Hive using ODBC-based tools, for example Excel, Tableau etc. Microsoft is working on adding other workloads, such as HBase, Spark, and Storm, to Domain-joined HDInsight soon.

An example of the final topology looks as follows:

![Domain-joined HDInsight topology](./media/hdinsight-domain-joined-configure/hdinsight-domain-joined-topology.png)

Because Azure AD currently only supports classic virtual networks (VNets) and Linux-based HDInsight clusters only support Azure Resource Manager based VNets, HDInsight Azure AD integration requires two VNets and a peering between them. For the comparison information between the two deployment models, see [Azure Resource Manager vs. classic deployment: Understand deployment models and the state of your resources](../azure-resource-manager/resource-manager-deployment-model.md). The two VNets must be in the same region as the Azure AD DS.

Azure service names must be globally unique. The following names are used in this tutorial. Contoso is a fictitious name. You must replace *contoso* with a different name when you go through the tutorial. 

**Names:**

| Property | Value |
| --- | --- |
| Azure AD VNet |contosoaadvnet |
| Azure AD Vnet resource group |contosoaadrg |
| Azure AD directory |contosoaaddirectory |
| Azure AD domain name |contoso (contoso.onmicrosoft.com) |
| HDInsight VNet |contosohdivnet |
| HDInsight VNet resource group |contosohdirg |
| HDInsight cluster |contosohdicluster |

This tutorial provides the steps for configuring a domain-joined HDInsight cluster. Each section has links to other articles with more background information.

## Prerequisite:
* Familiarize yourself with [Azure AD Domain Services](https://azure.microsoft.com/services/active-directory-ds/) its [pricing](https://azure.microsoft.com/pricing/details/active-directory-ds/) structure.
* Ensure that your subscription is whitelisted for this public preview. You can do so by sending an email to hdipreview@microsoft.com with your subscription ID.
* An SSL certificate that is signed by a signing authority for your domain. The certificate is required by configuring secure LDAP. Self-signed certificates cannot be used.

## Procedures
1. Create an Azure classic VNet for your Azure AD.  
2. Create and configure Azure AD and Azure AD DS.
3. Create an HDInsight VNet in the Azure resource management mode.
4. Peer the two VNets.
5. Create an HDInsight cluster.

> [!NOTE]
> This tutorial assumes that you do not have an Azure AD. If you have one, you can skip the portion in step 2.
> 
> 

There is a PowerShell script that automates step 3 through step 7.  For more information, see [Configure Domain-joined HDInsight clusters use Azure PowerShell](hdinsight-domain-joined-configure-use-powershell.md).

## Create an Azure virtual network (classic)
In this section, you create a virtual network (classic) using the Azure portal. In the next section, you enable the Azure AD DS for your Azure AD in the virtual network. For more information about the following procedure and using other virtual network creation methods, see [Create a virtual network (classic) by using the Azure portal](../virtual-network/virtual-networks-create-vnet-classic-pportal.md).

**To create a classic VNet**

1. Sign on to the [Azure portal](https://portal.azure.com). 
2. Click **New** > **Networking** > **Virtual Network**.
3. In **Select a deployment model**, select **Classic**, and then click **Create**.
4. Enter or select the following values:
   
   * **Name**: contosoaadvnet
   * **Address space**: 10.1.0.0/16
   * **Subnet name**: Subnet1
   * **Subnet address range**: 10.1.0.0/24
   * **Subscription**: (Select a subscription used for creating this VNet.)
   * **ResourceGroup**: contosoaadrg
   * **Location**: (Select a region for your HDInsight cluster.)
     
     > [!IMPORTANT]
     > You must choose a location that supports Azure AD DS. For more information, see [Products available by region](https://azure.microsoft.com/en-us/regions/services/). 
     > 
     > Both the classic VNet and the Resource Group VNet must be in the same region as the Azure AD DS.
     > 
     > 
5. Click **Create** to create the VNet.

## Create and configure Azure AD DS for your Azure AD
In this section, you will:

1. Create an Azure AD.
2. Create Azure AD users. These users are domain users. You use the first user for configuring the HDInsight cluster with the Azure AD.  The other two users are optional for this tutorial. They will be used in [Configure Hive policies for Domain-joined HDInsight clusters](hdinsight-domain-joined-run-hive.md) when you configure Apache Ranger policies.
3. Create the AAD DC Administrators group and add the Azure AD user to the group. You use this user to create the organizational unit.
4. Enable Azure AD Domain Services (Azure AD DS) for the Azure AD.
5. Configure LDAPS for the Azure AD. The Lightweight Directory Access Protocol (LDAP) is used to read from and write to Azure AD.

If you prefer to use an existing Azure AD, you can skip steps 1 and 2.

**To create an Azure AD**

1. From the [Azure classic portal](https://manage.windowsazure.com), click **New** > **App Services** > **Active Directory** > **Directory** > **Custom Create**. 
2. Enter or select the following values:
   
   * **Name**: contosoaaddirectory
   * **Domain name**: contoso.  This name must be globally unique.
   * **Country or region**: Select your country or region.
3. Click **Complete**.

**Create an Azure AD user**

1. From the [Azure classic portal](https://manage.windowsazure.com), click **Active Directory** -> **contosoaaddirectory**. 
2. Click **Users** from the top menu.
3. Click **Add User**.
4. Enter **User Name**, and then click **Next**. 
5. Configure user profile; In **Role**, select **Global Admin**; and then click **Next**.  The Global Admin role is needed to create organizational units.
6. Click **Create** to get a temporary password.
7. Make a copy of the password, and then click **Complete**. Later in this tutorial, you will use this global admin user to create the HDInsight cluster.

Follow the same procedure to create two more users with the **User** role, hiveuser1 and hiveuser2. The following users will be used in [Configure Hive policies for Domain-joined HDInsight clusters](hdinsight-domain-joined-run-hive.md).

**To create the AAD DC Administrators' group, and add an Azure AD user**

1. From the [Azure classic portal](https://manage.windowsazure.com), click **Active Directory** > **contosoaaddirectory**. 
2. Click **Groups** from the top menu.
3. Click **Add a Group** or **Add Group**.
4. Enter or select the following values:
   
   * **Name**: AAD DC Administrators.  Don't change the group name.
   * **Group Type**: Security.
5. Click **Complete**.
6. Click **AAD DC Administrators** to open the group.
7. Click **Add Members**.
8. Select the first user you created in the previous step, and then click **Complete**.
9. Repeat the same steps to create another group called **HiveUsers**, and add the two Hive users to the group.

For more information, see [Azure AD Domain Services (Preview) - Create the 'AAD DC Administrators' group](../active-directory-domain-services/active-directory-ds-getting-started.md).

**To enable Azure AD DS for your Azure AD**

1. From the [Azure classic portal](https://manage.windowsazure.com), click **Active Directory** > **contosoaaddirectory**. 
2. Click **Configure** from the top menu.
3. Scroll down to **Domain Services**, and set the following values:
   
   * **Enable domain services for this directory**: Yes.
   * **DNS domain name of domain services**: This shows the default DNS name of the Azure directory. For example, contoso.onmicrosoft.com.
   * **Connect domain services to this virtual network**: Select the classic virtual network you created earlier, i.e. **contosoaadvnet**.
4. Click **Save** from the bottom of the page. You will see **Pending ...** next to **Enable domain services for this directory**.  
5. Wait until **Pending ...** disappears, and **IP Address** gets populated. Two IP addresses will get populated. These are the IP addresses of the domain controllers provisioned by Domain Services. Each IP address will be visible after the corresponding domain controller is provisioned and ready. Write down the two IP addresses. You will need them later.

For more information, see [Azure AD Domain Services (Preview) - Enable Azure AD Domain Services](../active-directory-domain-services/active-directory-ds-getting-started-enableaadds.md).

**To synchronize password**

If you use your own domain, you need to synchronize the password. See [Enable password synchronization to Azure AD domain services for a cloud-only Azure AD directory](../active-directory-domain-services/active-directory-ds-getting-started-password-sync.md).

**To configure LDAPS for the Azure AD**

1. Get an SSL certificate that is signed by a signing authority for your domain. If you want to use a self-signed certificate, please reach out to hdipreview@microsoft.com for an exception.
2. From the [Azure classic portal](https://manage.windowsazure.com), click **Active Directory** > **contosoaaddirectory**. 
3. Click **Configure** from the top menu.
4. Scroll to **domain services**.
5. Click **Configure certificate**.
6. Follow the instruction to specify the certificate file and the password. You will see **Pending ...** next to **Enable domain services for this directory**.  
7. Wait until **Pending ...** disappears, and **Secure LDAP Certificate** got populated.  This can take up 10 minutes or more.

> [!NOTE]
> If some background tasks are being run on the Azure AD DS, you may see an error while uploading certificate - <i>There is an operation being performed for this tenant. Please try again later</i>.  In case you experience this error, please try again after some time. The second domain controller IP may take up to 3 hours to be provisioned.
> 
> 

For more information, see [Configure Secure LDAP (LDAPS) for an Azure AD Domain Services managed domain](../active-directory-domain-services/active-directory-ds-admin-guide-configure-secure-ldap.md).

## Create a Resource Manager VNet for HDInsight cluster
In this section, you will create an Azure Resource Manager VNet that will be used for the HDInsight cluster. For more information on creating Azure VNET using other methods, see [Create a virtual network](../virtual-network/virtual-networks-create-vnet-arm-pportal.md)

After creating the VNet, you will configure the Resource Manager VNet to use the same DNS servers as for the Azure AD VNet. If you followed the steps in this tutorial to create the classic VNet and the Azure AD, the DNS servers are 10.1.0.4 and 10.1.0.5.

**To create a Resource Manager VNet**

1. Sign on to the [Azure portal](https://portal.azure.com).
2. Click **New**, **Networking**, and then **Virtual network**. 
3. In **Select a deployment model**, select **Resource Manager**, and then click **Create**.
4. Type or select the following values:
   
   * **Name**: contosohdivnet
   * **Address space**: 10.2.0.0/16. Make sure the address range cannot overlap with the IP address range of the classic VNet.
   * **Subnet name**: Subnet1
   * **Subnet address range**: 10.2.0.0/24
   * **Subscription**: (Select your Azure subscription.)
   * **Resource group**: contosohdirg
   * **Location**: (Select the same location as the Azure AD VNet, i.e. contosoaadvnet.)
5. Click **Create**.

**To configure DNS for the Resource Manager VNet**

1. From the [Azure portal](https://portal.azure.com), click **More services** -> **Virtual networks**. Ensure not to click **Virtual networks (classic)**.
2. Click **contosohdivnet**.
3. Click **DNS servers** from the left side of the new blade.
4. Click **Custom**, and then enter the following values:
   
   * 10.1.0.4
   * 10.1.0.5
     
     These DNS server IP addresses must match to the DNS servers in the Azure AD VNet (classic VNet).
5. Click **Save**.

## Peer the Azure AD VNet and the HDInsight VNet
**To peer the two VNet**

1. Sign on to the [Azure portal](https://portal.azure.com).
2. Click **More services** from the left menu.
3. Click **Virtual Networks**. Don't click **Virtual networks (classic)**.
4. Click **contosohdivnet**.  This is the HDInsight VNet.
5. Click **Peerings** on the left menu of the blade.
6. Click **Add** from the top menu. It opens the **Add peering** blade.
7. On the **Add peering** blade, set or select the following values:
   
   * **Name**: ContosoAADHDIVNetPeering
   * **Virtual network deployment model**: Classic
   * **Subscription**: Select your subscription name used for the classic (Azure AD) vnet.
   * **Virtual network**: contosoaadvnet.
   * **Allow virtual network access**: (Check)
   * **Allow forwarded traffic**: (Check). Leave the other two checkboxes unchecked.
8. Click **OK**.

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
         * **Domain user name**: Enter a domain user name. This domain must have the following privileges: Join machines to the domain and place them in the organization unit you specify during cluster creation; Create service principals within the organization unit you specify during cluster creation; Create reverse DNS entries. This domain user will become the administrator of this domain-joined HDInsight cluster.
         * **Domain password**: Enter the domain user password.
         * **Organization Unit**: Enter the distinguished name of the OU that you want to use with HDInsight cluster. For example: OU=HDInsightOU,DC=contoso,DC=onmicrosoft,DC=com. If this OU does not exist, HDInsight cluster will attempt to create this OU. Make sure the OU is already present or the domain account has permissions to create a new one. If you use the domain account which is part of AADDC Administrators, it will have necessary permissions to create the OU.
         * **LDAPS URL**: ldaps://contoso.onmicrosoft.com:636
         * **Access user group**: Specify the security group whose users you want to sync to the cluster. For example, HiveUsers.
           
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
   * **Cluster Users Group DNs**: [\"HiveUsers\"]
   * **LDAPUrls**: ["ldaps://contoso.onmicrosoft.com:636"]
   * **DomainAdminUserName**: (Enter the domain admin user name)
   * **DomainAdminPassword**: (enter the domain admin user password)
   * **I agree to the terms and conditions stated above**: (Check)
   * **Pin to dashboard**: (Check)
3. Click **Purchase**. You will see a new tile titled **Deploying Template deployment**. It takes about around 20 minutes to create a cluster. Once the cluster is created, you can click the cluster blade in the portal to open it.

After you complete the tutorial, you might want to delete the cluster. With HDInsight, your data is stored in Azure Storage, so you can safely delete a cluster when it is not in use. You are also charged for an HDInsight cluster, even when it is not in use. Since the charges for the cluster are many times more than the charges for storage, it makes economic sense to delete clusters when they are not in use. For the instructions of deleting a cluster, see [Manage Hadoop clusters in HDInsight by using the Azure portal](hdinsight-administer-use-management-portal.md#delete-clusters).

## Next steps
* For configuring Hive policies and run Hive queries, see [Configure Hive policies for Domain-joined HDInsight clusters](hdinsight-domain-joined-run-hive.md).
* For using SSH to connect to Domain-joined HDInsight clusters, see [Use SSH with Linux-based Hadoop on HDInsight from Linux, Unix, or OS X](hdinsight-hadoop-linux-use-ssh-unix.md#domainjoined).

