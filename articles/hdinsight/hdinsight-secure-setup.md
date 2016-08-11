<properties
   	pageTitle="Configure Secure HDInsight | Microsoft Azure"
   	description="Learn how to set up and configure secure HDInsight"
   	services="hdinsight"
   	documentationCenter=""
   	authors="mumian"
   	manager="paulettm"
   	editor="cgronlun"
	tags="azure-portal"/>

<tags
   	ms.service="hdinsight"
   	ms.devlang="na"
   	ms.topic="hero-article"
   	ms.tgt_pltfrm="na"
   	ms.workload="big-data"
   	ms.date="08/11/2016"
   	ms.author="jgao"/>

# Configure Secure HDInsight

Learn how to set up an Azure HDInsight cluster with Azure Active Directory(AAD) and [Apache Ranger](http://hortonworks.com/apache/ranger/) to take advantage of strong authentication and rich role-based access control(RBAC) policies.  Secure HDInsight can only be configured on Linux-based clusters. For more information, see [Introduce Secure HDInsight](hdinsight-secure-introduction.md).

This is the first tutorial of the 2-part series:

- Create an HDInsight cluster connected to AAD (via the Azure Directory Domain Services capability) with Apache Ranger enabled.
- Create and apply Hive policies through Apache Ranger, and allow users (e.g. business analysts) to connect to Hive using ODBC-based tools e.g. Excel, Tableau etc. Currently, other workloads, such as HBase, Spark and Storm, are not supported. [jgao: how about YARN?]

An example of the final topology looks as follows:

![Secure HDInsight topology](.\media\hdinsight-secure-setup\hdinsight-secure-topology.png)

Because AAD currently only supports classic virtual networks (VNets) and Linux-based HDInsight clusters only support Azure Resource Manager based VNets, HDInsight AAD integration requires two VNets and a bridge between them. For the comparison information between the two deployment models, see [Azure Resource Manager vs. classic deployment: Understand deployment models and the state of your resources](../resource-manager-deployment-model.md)

Azure service names must be globally unique.  The following are the names used in this tutorial. Contoso is a fictitious name. You must replace *contoso* with a different name when you go through the tutorial.
	
**Names:**

- AAD VNet: contosoaadvnet
- AAD Virtual Machine (VM): contosoaadadmin
- AAD directory: contosoaaddirectory
- AAD domain name: contoso158 (contoso158.onmicrosoft.com)

- HDInsight VNet: contosohdivnet
- HDInsight VNet resource group: contosohdirg
- HDInsight cluster: contosohdicluster

This tutorial provides the steps for configuring a secured HDInsight. Each section has links to other articles which give you more background information.

## Prerequisites:

- Familiarize yourself with [ADDS](https://azure.microsoft.com/services/active-directory-ds/) its [pricing](https://azure.microsoft.com/pricing/details/active-directory-ds/) structure.
- Learn about [Apache Ranger](http://hortonworks.com/apache/ranger/), specifically how [Hive policies](http://hortonworks.com/apache/hive/) work.
- Ensure that your subscription is whitelisted for this private preview. You can do so by sending an email to arindamc@microsoft.com with your subscription ID.
- [Azure PowerShell](../powershell-install-configure.md) on a Windows workstation. Most of the steps use the Azure portal or Azure classic portal. Only a few steps in this tutorial require Azure PowerShell. Azure PowerShell can only be installed on Windows workstations.

## Procedures

1. Create an Azure classic VNet for Azure Active Directory.  
2. Create and configure an Azure Active Directory.
3. Add an admin VM to the AAD.
3. Configure an organizational unit.
4. Create an HDInsight VNet (Resource Manager VNet)
5. Bridge the two VNets.
6. Create an HDInsight cluster.
6. Test the connection between the two VNets.
	
## Create an Azure classic VNet

In this section, you will create a classic VNet using the Azure classic portal. In the next section,  you will create an AAD and enabled the AAD service for the VNet. For additional information about the following procedure and using other VNet creation methods, see [Create a virtual network (classic) by using the Azure portal](../virtual-network/virtual-networks-create-vnet-classic-portal.md).

**To create a classic VNet**

1. Sign on to the [Azure classic portal](https://manage.windowsazure.com).
2. Click **New** > **Network Services** > **Virtual Network** > **Custom Create**.
3. Enter or select the following:

	- **Name**: contosoaadvnet
	- **Location**: East US 2
	- **Subscription**: (Select a subscription).
4. Click **Next**.
4. On the **DNS Servers and VPN Connectivity** page, click **Next**. If you do not specify a DNS server, your VNet will use the internal naming resolution provided by Azure. For our scenario, we will not configure DNS servers.
5. Configure **Address Space** with **10.1.0.0/16**, and **Subnet-1** with **10.1.0.0/24** as shown below:

	![Configure Secure HDInsight Azure Active directory virtual network](.\media\hdinsight-secure-setup\hdinsight-secure-aad-vnet-setting.png)
	
6. Click **Complete** to create the VNet.

## Create and configure an AAD

In this section, you will:

- Create an AAD.
- Create AAD users. These are domain users. The first user will be used to configure the AAD.  The other two users are optional for this tutorial.  They will be used in [Configure Hive policies in secure HDInsight](hdinsight-secure-run-hive.md) when you configure Ranger policies.
- Create the AAD DC Administrators group and add the AAD user to the group. You will use this user to create the organizational unit.
- Enable AAD Service for the VNet.
- Update the DNS setting for the VNet - Use the AAD domain controllers for domain name resolution.
- Configure DNS for the VNet.
- Configure LDAPS for the AAD.

**To create an AAD**

1. Sign on to the [Azure classic portal](https://manage.windowsazure.com).
2. Click **New** > **App Services** > **Active Directory** > **Directory** > **Custom Create**. 
3. Enter or select the following values:

	- Name: contosoaaddirectory
	- Domain name: contoso158.  This name must be globally unique. Replace the number in the name with a different number until it is validated successfully.
	- Country or region: Select your country or region.
4. Click **Complete**.


**Create an AAD user**

[jgao: use lower case for the usernames. Nitya has logged this bug.]

1. Sign on to the [Azure classic portal](https://manage.windowsazure.com).
2. Click **Active Directory** > **contosoaaddirectory**. 
3. Click **Users** from the top menu.
4. Click **Add User**
4. Enter **User Name**, and then click **Next**. 
5. Configure user profile; In **Role**, select **Global Admin**; and then click **Next**.
6. Click **Create** to get a temporary password.
7. Make a copy of the password - Bodu8439, and then click **Complete**. jgao@contoso158.onmicrosoft.com


Follow the same procedure to create two more users with the **User** role. The following users will be used in [Configure Hive policies in secure HDInsight](hdinsight-secure-run-hive.md).

- hiveuser1, Faja2959
- hiveuser2, Juha0790
- hiveuser3, Nulu4002
- hiveuser4, Cado7088


**To create the AAD DC Administrators' group, and add the AAD user**

1. Sign on to the [Azure classic portal](https://manage.windowsazure.com).
2. Click **Active Directory** > **contosoaaddirectory**. 
3. Click **Groups** from the top menu.
4. Click **Add a Group** or **Add Group**.
5. Enter or select the following values:

	- **Name**: AAD DC Administrators.  The name has to be "AAD DC Administrators".
	- **Group Type**: Security.
6. Click **Complete**.
7. Click **AAD DC Administrators** to open the group.
8. Click **Add Members**.
9. Select the first user you created in the previous step, for example jgao@contoso158.onmicrosoft.com, and then click **Complete**.

	- Members of this group will be granted administrative privileges on machines that are domain joined to the Azure AD domain Service domain you will set up.	
	- After domain joined, this group will be added to the Administrators group on these domain-joined machines.
	- Members of this group will also be able to use Remote Desktop to connect remotely to domain-joined machines. [jgao: this is not correct based on my testing]

For more information, see [Azure AD Domain Services (Preview) - Create the 'AAD DC Administrators' group](../active-directory/active-directory-ds-getting-started.md).

**To enable AAD domain services for the VNet**

1. Sign on to the [Azure classic portal](https://manage.windowsazure.com).
2. Click **Active Directory** > **contosoaaddirectory**. 
3. Click **Configure** from the top menu.
4. Scroll down to **Domain Services**, and set the following values:

	- **Enable domain services for this directory**: Yes.
	- **DNS domain name of domain services**: This shows the default NDS name of the Azure directory. For example, contoso158.onmicrosoft.com.
	- **Connect domain services to this virtual network**: Select the classic virtual network you created earlier. I.e. **contosoaadvnet**.
	
6. Click **Save** from the bottom of the page. You will see **Pending ...** next to **Enable domain services for this directory**.  
7. Wait until **Pending ...** disappears, and **IP Address** got populated. There are the IP addresses of the domain controllers provisioned by Domain Services. Each IP address will be visible after the corresponding domain controller is provisioned and ready. This can take up 20 minutes or more. It takes more time for the second IP address to show up. Update the DNS settings for the virtual network to point to these IP addresses in order to join computers to the domain.
8. Make a copy of the two IP addresses.

For more information, see [Azure AD Domain Services (Preview) - Enable Azure AD Domain Services](../active-directory/active-directory-ds-getting-started-enableaadds.md).

**To update DNS settings for the VNet**

1. Sign on to the [Azure classic portal](https://manage.windowsazure.com).
2. Click **Networks** > **contosoaadvnet**. 
3. Click **Configure** from the top menu.
4. In the **DNS Servers** section, enter:

	- "contosoaaddns1" - 10.1.0.4
	- "contosoaaddns2" - 10.1.0.5
5. Click **Save** from the bottom of the page.
6. Click **Yes** to confirm.	

For more information, see [Azure AD Domain Services (Preview) - Update DNS settings for the Azure virtual network](../active-directory/active-directory-ds-getting-started-dns.md).

You can skip the next step in this tutorial. In your real implementation, you might need it:

- (Optional) [Enable password synchronization to AAD domain services for a cloud-only Azure AD directory](../active-directory/active-directory-ds-getting-started-password-sync.md).
	

**To configure LDAPS for the AAD**

1. Create a certificate using the following script from an elevated Windows PowerShell console:

		$certFile = "c:\Tutorials\cert\SecureLdapCert.pfx" # this must be an existing folder
		$certPassword = "Pass@word123"
		$certName = "*.contoso158.onmicrosoft.com" # this must match the AAD DNS name

		$lifetime=Get-Date
		$cert = New-SelfSignedCertificate `
			-Subject $certName `
			-NotAfter $lifetime.AddDays(365) `
			-KeyUsage DigitalSignature, KeyEncipherment `
			-Type SSLServerAuthentication `
			-DnsName $certName 

		$certThumbprint = $cert.Thumbprint
		$cert = (Get-ChildItem -Path cert:\LocalMachine\My\$certThumbprint)

		$certPasswordSecureString = ConvertTo-SecureString $certPassword -AsPlainText -Force
		Export-PfxCertificate -Cert $cert -FilePath $certFile -Password $certPasswordSecureString

1. Sign on to the [Azure classic portal](https://manage.windowsazure.com).
2. Click **Active Directory** > **contosoaaddirectory**. 
3. Click **Configure** from the top menu.
4. Scroll to **domain services**.
5. Click **Configure certificate**.
6. Follow the instruction to specify the certificate file and the password. You will see **Pending ...** next to **Enable domain services for this directory**.  
7. Wait until **Pending ...** disappears, and **Secure LDAP Certificate** got populated.  This can take up 10 minutes or more.
 
For more information, see [Configure Secure LDAP (LDAPS) for an Azure AD Domain Services managed domain](../active-directory/active-directory-ds-admin-guide-configure-secure-ldap.md).


## Configure an organizational unit

In this section, you will add a virtual machine to the AAD VNet, you will install some administrative tools on this VM so you can configure AAD organizational unit.

**To create a virtual machine into the virtual network**

1. Sign on to the [Azure classic portal](https://manage.windowsazure.com).
2. Click **New** > **Compute** > **Virtual Machine** > **From Gallery**.
3. Select an image, and then click **Next**.  If you don't know which one to use, select the default, **Windows Server 2012 R2 Datacenter**.
4. Enter or select the following values:

	- Virtual Machine Name: **contosoaadadmin**
	- Tier: **Basic**
	- New User Name: **jgao**
	- Password: **Pass@word123**
	
	Please note the username and the password is the local admin.
	
5. Click **Next**
6. In **Region/Virtual Network**, select the new virtual network you created in the last step (contosoaadvnet), and then click **Next**.
7. Click **Complete**.

**To RDP to the VM**

1. Sign on to the [Azure classic portal](https://manage.windowsazure.com).
2. Click **Virtual Machines** > **contosoaadadmin**.
3. Click **Dashboard** from the top menu.
4. Click **Connect** from the bottom of the page.
5. Follow the instruction and use the local admin username and password to connect.

**To join VM to the AAD domain**

1. From the RDP session, click **Start**, and then click **Server Manager**.
2. Click **Local Server** from the left menu.
3. From Workgroup, click **Workgroup**.
4. Click **Change**.
5. Click **Domain**, enter **contoso158.onmicrosoft.com**, and then click **OK**.
6. Enter the domain user credentials, and then click **OK**.
7. Click **OK**.
8. Click **OK** to agree to reboot the computer.
9. Click **Close**.
10. Click **Restart Now**.

For more information, see [Join a Windows Server virtual machine to a managed domain](../active-directory/active-directory-ds-admin-guide-join-windows-vm.md).

**To install Active Directory administration tools and DNS tools**

1. RDP into **contosoaadadmin**.
2. Click **Start**, and then click **Server Manager**.
3. Click **Dashboard** from the left menu.
4. Click **Add roles and features**.
5. Click **Next**.
6. Select **Role-based or feature-based installation**, and then click **Next**.
7. Select the current virtual machine from the server pool, and click **Next**.
8. Click **Next** to skip roles.
9. Expand **Remote Server Administration Tools**, expand **Role Administration Tools**, select **AD DS and AD LDS Tools**, and then click **Next**. 
10. Click **Next**
10. Click **Install**.

For more information, see [Install Active Directory administration tools on the virtual machine](https://azure.microsoft.com/en-us/documentation/articles/active-directory-ds-admin-guide-administer-domain/#task-2---install-active-directory-administration-tools-on-the-virtual-machine).


[jgao: how about adding a step here to check the AADDC Users OU?]

This organization unit will be used when creating the HDInsight cluster. It will be used to retain the Hadoop system users.

**Create an Organizational Unit (OU) on an AAD Domain Services managed domain**

1. RDP into **contosoaadadmin** using the domain account that is in the **AAD DC Administrators** group.
2. Click **Start**, click **Administrative Tools**, and then click **Active Directory Administrative Center**.
5. Click the domain name in the left pane. For example, contoso158.
6. Click **New** under the domain name in the **Task** pane, and then click **Organizational Unit**.
7. Enter a name, for sample **Hadoop System Users**, and then click **OK**. 

*****************************************
**additional steps**
Permissions/security for newly created ous
https://azure.microsoft.com/en-us/documentation/articles/active-directory-ds-admin-guide-create-ou/#permissionssecurity-for-newly-created-ous
*****************************************

For more information, See [Create an Organizational Unit (OU) on an AAD Domain Services managed domain](https://azure.microsoft.com/en-us/documentation/articles/active-directory-ds-admin-guide-create-ou/).



## Create a Resource Manager virtual network for HDInsight cluster

In this section, you will create a Resource Manager VNet that will be used for the HDInsight cluster. A Resource Manager template is used in this tutorial to create the VNet.  For more information on creating Azure VNET using other methods, see [Create a virtual network](../virtual-network/virtual-networks-create-vnet-arm-pportal.md)

After creating the VNet, you will configure the Resource Manager VNet to use the same DNS servers as for the AAD VNet. If you follow the steps in this tutorial to create the classic VNet and the AAD, the DNS servers are 10.1.0.4 and 10.1.0.5.

**To create a Resource Manager VNet**

1. Click the following image to open a Resource Manager template in the Azure Portal. The Resource Manager template is located in a public blob container. 

    <a href="https://portal.azure.com/#create/Microsoft.Template/uri/https%3A%2F%2Fhditutorialdata.blob.core.windows.net%2Farmtemplates%2Fcreate-vnet-secure-hdinsight.json" target="_blank"><img src="https://acom.azurecomcdn.net/80C57D/cdn/mediahandler/docarticles/dpsmedia-prod/azure.microsoft.com/en-us/documentation/articles/hdinsight-hbase-tutorial-get-started-linux/20160201111850/deploy-to-azure.png" alt="Deploy to Azure"></a>

	If you are interested in understanding the template, please pay attention to the following section in the cluster configuration:

		"ranger-ugsync-site": {
			"ranger.usersync.ldap.binddn": "[concat('CN=', variables('userNameAndDomain')[0], ',OU=AADDC Users', ',DC=', variables('domainNameParts')[0], ',DC=', variables('domainNameParts')[1], ',DC=', variables('domainNameParts')[2])]",
			"ranger.usersync.ldap.user.searchbase": "[concat('OU=AADDC Users', ',DC=', variables('domainNameParts')[0], ',DC=', variables('domainNameParts')[1], ',DC=', variables('domainNameParts')[2])]"
		},
		"ranger-admin-site": {
			"ranger.ldap.user.dnpattern": "[concat('CN={0}', ',OU=AADDC Users', ',DC=', variables('domainNameParts')[0], ',DC=', variables('domainNameParts')[1], ',DC=', variables('domainNameParts')[2])]",
			"ranger.ldap.base.dn": "[concat('OU=AADDC Users', ',DC=', variables('domainNameParts')[0], ',DC=', variables('domainNameParts')[1], ',DC=', variables('domainNameParts')[2])]",                            
			"ranger.ldap.ad.base.dn": "[concat('OU=AADDC Users', ',DC=', variables('domainNameParts')[0], ',DC=', variables('domainNameParts')[1], ',DC=', variables('domainNameParts')[2])]"
		}

	and the following in the node configurations:

		"securityProfile": {
			"activeDirectoryConfiguration": {
				"directoryType": "ActiveDirectory",
				"domain": "[parameters('domainName')]",
				"organizationalUnitDN": "[parameters('organizationalUnitDN')]",
				"ldapUrls": "[parameters('ldapUrls')]",
				"domainAdminUsername": "[parameters('domainAdminUsername')]",
				"domainAdminPassword": "[parameters('domainAdminPassword')]"
			}
		},



2. From the **Parameters** blade, enter the following:

    - **VNetName**:  contosohdivnet.
	- **VNetAddressPrefix**: 10.2.0.0/16
	- **SubNet1Prefix**: 10.2.0.0/24
	- **SubNetName**: Subnet1

3. Click **OK** to save the parameters.
4. From the **Custom deployment** blade, click **Create new** under **Resource Group**, and then enter **contosohdirg**.  The resource group is a container that groups the cluster, the dependent storage account and other linked resource.
5. Click **Legal terms**, and then click **Create**.
6. Click **Create**. You will see a new tile titled **Submitting deployment for Template deployment**. 

**To configure DNS for the Resource Manager VNet**

1. Sign on to the [Azure portal](https://portal.azure.com).
2. Click **Browse** -> **Virtual networks**. Don't click **Virtual networks (classic).
2. Click **contosohdivnet**.
3. Click **Settings** from the top menu.
4. Click **DNS servers** from the Settings blade.
6. Click **Custom DNS**, and then enter the following:

	- Primary DNS server: 10.1.0.4
	- Secondary DNS server: 10.1.0.5

	These DNS server IP addresses must match to the DNS servers in the AAD VNet (classic VNet).
7. Click **Save**.

## Bridge the AAD VNet and the HDInsight VNet


There are 3 steps in this section.

**To create a VPN gateway for the AAD(classic) VNet**

1. Sign on to the [classic portal](https://manage.windowsazure.com).
2. Click **New** > **NETWORK SERVICES** > **VIRTUAL NETWORKS** > **ADD LOCAL NETWORK**. 
3. Enter the following:

	- Name: For example: contosohdivnet. 
	- VPN Device IP Address: Type any valid public IP address. For example, 192.168.0.1. We will change this IP address later. 
4. Click **Next**.
4. Enter or select the following values:

	- In the address space STARTING IP text box, type the network prefix for the Resource Manager VNet you want to connect to. For example, 10.2.0.0/16.
	- In the CIDR (ADDRESS COUNT) drop-down, select the number of bits used for the network portion of the CIDR block used by the Resource Manager VNet you want to connect to.
4. Click **Complete**.
5. Click **Networks** from the left pane >  **VIRTUAL NETWORKS**, and then click on your classic VNet (contosoaadvnet), and then click **CONFIGURE**.
6. Under **site-to-site connectivity**,  check **Connect to the local network**, and then select the local network you just created in **Local Network**.
7. Click **Save** on the bottom of the page.
8. Click **Yes** to confirm.
9. Click **Dashboard** from the top menu, click **Create Gateway** from the bottom of the page, click **Dynamic Routing**, and then click **Yes**. When it is done, copy the gateway public IP address. You will need it to set up the gateway in the Resource Manager VNet. Don't worry if you see the status is disconnected.  It is expected. 104.209.180.23


**To create a VPN gateway for the HDInsight(Resource Manager) VNet**

1. Sign on to the [Azure portal](https://portal.azure.com).
2. Click **New** > **Networking** > **Local network gateway**.
3. Select or enter:

	- Name:  contosohdivnetlocalnetworkgateway
	- IP Address: The public IP address of the gateway you created in the last step.
	- Address space: the CIDR block of the classic VNet, 10.1.0.0/16

4. Click **OK**.
5. Enter the following:

	- Resource group: Use existing - contosohdirg
	- Location: East US 2

4. Click **Create**

3. Click **New** > **Networking** > **Virtual network gateway**.
4. Select or enter:

	- Name: contosohdivnetvirtualnetworkgateway
	- Virtual network: Resource Manager network name contosohdivnet.
	- Public IP address: Create new: contosohdvnetvirtualnetworkgatewayip

4. Click **OK**.
5. Click **Create**.
6. Open the virtual network public gateway (contosohdivnetvirtualnetworkgateway.  In the Settings > Properties, find the public IP address:  40.79.35.228



**To connect the two gateways**

1. Sign on to the [classic portal](https://manage.windowsazure.com).
2. Click **Networks** > **Local Networks**, and then click the Resource Manager VNet that you want to connect to. For example: contosohdivnet.
3. Click **Edit** from the bottom.
4. Replace **VPN Device IP Address** with the Resource Manager VNet gateway public IP address: 40.79.76.167
5. Click **Next**.
6. Click **Complete**.
7. From a PowerShell console, setup a shared key by running the command below. Make sure you change the names of the VNets to the your own VNet names.

		Add-AzureAccount
		Set-AzureVNetGatewayKey -VNetName contosoaadvnet -LocalNetworkSiteName contosohdivnet -SharedKey "Password123"

8. Create the VPN connection by running the commands below.

		Add-AzureRmAccount
		$vnet01gateway = Get-AzureRmLocalNetworkGateway  -ResourceGroupName  contosohdirg -Name contosohdivnetlocalnetworkgateway
		$vnet02gateway = Get-AzureRmVirtualNetworkGateway -ResourceGroupName contosohdirg -Name contosohdivnetvirtualnetworkgateway

		New-AzureRmVirtualNetworkGatewayConnection -Name contoso-asm-Resource Manager-connection `
			-ResourceGroupName contosohdirg -Location "East US 2" -VirtualNetworkGateway1 $vnet02gateway `
			-LocalNetworkGateway2 $vnet01gateway -ConnectionType IPsec `
			-RoutingWeight 10 -SharedKey "Password123"


## Create HDInsight cluster


In this section, you will create a Linux-based Hadoop cluster in HDInsight using [Azure Resource Manager template](../resource-group-template-deploy.md). The Azure Resource Manager template experience is not required for following this tutorial. For other cluster creation methods and understanding the settings, see [Create HDInsight clusters](hdinsight-hadoop-provision-linux-clusters.md). For more information about using Resource Manager template to create Hadoop clusters in HDInsight, see [Create Hadoop clusters in HDInsight using Resource Manager templates](hdinsight-hadoop-create-windows-clusters-arm-templates.md)

**To create an HDInsight cluster**

1. Click the following image to open a Resource Manager template in the Azure portal. The Resource Manager template is located in a public blob container. 

    <a href="https://portal.azure.com/#create/Microsoft.Template/uri/https%3A%2F%2Fhditutorialdata.blob.core.windows.net%2Farmtemplates%2Fcreate-linux-based-hadoop-cluster-in-vnet-v2.json" target="_blank"><img src="https://acom.azurecomcdn.net/80C57D/cdn/mediahandler/docarticles/dpsmedia-prod/azure.microsoft.com/en-us/documentation/articles/hdinsight-hbase-tutorial-get-started-linux/20160201111850/deploy-to-azure.png" alt="Deploy to Azure"></a>

2. From the **Parameters** blade, enter the following:

	- **ClusterVNetID**: /subscriptions/&lt;SubscriptionID>/resourceGroups/&lt;ResourceGroupName>/providers/Microsoft.Network/virtualNetworks/&lt;VNetName>
	- **ClusterVNetSubNetID**: /subscriptions/&lt;SubscriptionID>/resourceGroups/&lt;ResourceGroupName>/providers/Microsoft.Network/virtualNetworks/&lt;VNetName>/subnets/Subnet1
    - **ClusterName**: Enter a name for the Hadoop cluster that you will create. For example contosohdicluster
    - **Cluster login name and password**: The default login name is **admin**.
    - **SSH username and password**: The default username is **sshuser**.  You can rename it. 

	- DomainName: contoso158.onmicrosoft.com
	- OrganizationUnitDN: OU=Hadoop System Users,DC=contoso158,DC=onmicrosoft,DC=com
	- LDAPUrls: ["ldaps://40.84.54.252:636"], ["ldaps://10.1.0.4:636","ldaps://10.1.0.5:636"]
	- DomainAdminUserName: jgao@contoso158.onmicrosoft.com
	- DomainAdminPassword: Bodu8439

	The organizational unit is what you created earlier in the article.

    Other properties have been hard-coded into the template. For example:
    
    - Location: East US 2
    - Cluster worker node count: 2
    - Default storage account: <Cluster Name>store
    - Virtual network name: <Cluster Name>-vnet
    - Virtual network address space: 10.2.0.0/16
    - Subnet name: default
    - Subnet address range: 10.2.0.0/24

3. Click **OK** to save the parameters.
4. From the **Custom deployment** blade, click **Resource group** dropdown box, and then click **Use existing**, and specify the same resource group you have been using.  For example contosohdirg. 
5. Click **Legal terms**, and then click **Purchase**.
6. Click **Create**. You will see a new tile titled **Submitting deployment for Template deployment**. It takes about around 20 minutes to create a cluster. Once the cluster is created, you can click the cluster blade in the portal to open it.

After you complete the tutorial, you might want to delete the cluster. With HDInsight, your data is stored in Azure Storage, so you can safely delete a cluster when it is not in use. You are also charged for an HDInsight cluster, even when it is not in use. Since the charges for the cluster are many times more than the charges for storage, it makes economic sense to delete clusters when they are not in use. For the instructions of deleting a cluster, see [Manage Hadoop clusters in HDInsight by using the Azure portal](hdinsight-administer-use-management-portal.md#delete-clusters).



## Configure the Ranger user sync service

[jgao: this part is actually done in the Resource Manager template.  It might be good to keep it as a validation procedure.]

**To configure the Ranger user sync service**

1. Sign on to the [Azure portal](https://portal.azure.com).
2. Open the cluster. For example: contosohdicluster.
3. Click **Dashboard**.
4. Sign in to Ambari using the Hadoop HTTP username and password.
5. Click **Ranger** from the left menu.
6. Click the **Configs** tab.
7. Click the **Ranger User Info** tab.
8. Click the **Common Configs** tab.
9. Configure the fields highlighted in the following screenshots:

	![Secure HDInsight Ranger user sync configuration](.\media\hdinsight-secure-setup\hdinsight-secure-ranger-user-sync-common-configs.png)

	By default, new users belong to the **AADDC Users** OU. If your AD is configured differently, then specify the appropriate OU.

	![Secure HDInsight Ranger user sync configuration](.\media\hdinsight-secure-setup\hdinsight-secure-ranger-user-sync-user-configs.png)

10. Click **Save**.
11. Click **Restart**.


## Test the connection between the two VNets

[This part only tests the network connectivity and domain name resolution. Do I need to add another procedure for validating the AAD configuration, for example, verify domain users are populated when creating a Ranger policy.]

To test the connection between the two VNets, you will ping one of the cluster nodes from the Windows VM in the Classic VNet.

**To find the cluster node IP addresses**

1. Sign on to the [Azure portal](https://portal.azure.com).
2. Open the cluster. For example: contosohdicluster.
3. Click **Dashboard**.
4. Sign in to Ambari using the Hadoop HTTP username and password.
5. Click **Hosts** from the top. You will see a list of the Hadoop nodes.  Write down the IP address and the domain name of one of the nodes.

**To ping a cluster node**

1. RDP into **contosoaadadmin** using the domain account that is in the **AAD DC Administrators** group.
2. Click **Start**, and then click **Windows PowerShell**.
3. Ping the IP address and the domain name you wrote down in the last procedure.




## Next steps:

- [Configure Hive policies in secure HDInsight](hdinsight-secure-run-hive.md)


