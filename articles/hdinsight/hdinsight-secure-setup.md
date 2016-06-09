<properties
   	pageTitle="Configure Secure HDInsight | Microsoft Azure"
   	description="Learn ...."
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
   	ms.date="06/03/2016"
   	ms.author="jgao"/>

# Configure Secure HDInsight

Learn how to setup an HDInsight cluster with Azure Activie Directory(AAD) and Apache Ranger to take advantage of strong authentication and rich role based access control(RBAC) policies.  For more information, see [Introduce Secure HDInsigit](hdinsight-secure-introduction.md).

This is the first part of the 3 part tutorial:

- Create an HDInsight cluster connected to AAD (via new Azure Directory Domain Services
capability) with Apache Ranger enabled.
- Create and apply Hive policies through Apache Ranger. Other workloads, such as, HBase, Spark and Storm are not supported at this time.
- Allow users (e.g. business analysts) to connect to Hive using ODBC-based tools e.g. Excel, Tableau etc.

## Prerequisites:

- Familiarize yourself with [ADDS](https://azure.microsoft.com/services/active-directory-ds/) its [pricing](https://azure.microsoft.com/pricing/details/active-directory-ds/) structure.
- Learn about [Apache Ranger](http://hortonworks.com/apache/ranger/), specifically how [Hive policies](http://hortonworks.com/apache/hive/) work.
- Ensure that your subscription is whitelisted for this private preview. You can do so by sending an email to adnan.ijaz@microsoft.com with your subscription ID.


## Secure HDInsight topology 

Because AAD currently only supports classic VNETs and HDInsight only supports Resource Manager based
VNETs, HDInsight AAD integration requires two VNETs and a
bridge between the two. An example of the final topology looks as follows:

![Secure HDInsight topology](.\media\hdinsight-secure-setup\hdinsight-secure-topology.png)

Most of the names must be globally unique.  The following are the names used in this tutorial.  You must replace *contoso* with a different name when you go through the tutorial.
	
**Names:**

- aad Vnet: contoso_aad_vnet
- aad Vm: contoso-aad-vm
- AAD directory: contoso-aad
- AAD domain name: contoso155
- HDInsight Vnet: contoso_hdi_vnet
- HDInsight Vnet resource group: contoso_hdi_rg
- HDInsight cluster: contoso_hdi_cluster


## Prerequisites

- Azure subscription

## Procedures


- Create a classic vnet with a vm (portal and powershell)

	- AAD only susported by classic vnet
	- the VM is used for administer the AAD
	
- Create and configure an AAD

	- Create a AAD
	- Create "AAD DC Administrator's group. Members of this group will be granted administrative privileges on machines that are domain joined to the Azure AD domain Service domain you will setup.
	
		- After domain join, this group will be added to the Administrators group on these domain joined machines.
		- Members of this group will also be able to use Remote Desktop to connect remotely to domain joined machines.

	- Create an AAD global admin user and add it to the "AAD DC Administrator's group
	- Enable Azure AD domain services for the AAD.
	- (Optional) Update DNS settings for the virtual network
	- (Optional) Enable password synchronization to AAD domain services for a cloud-only Azure AD directory.
	
	- Configure Secure LDAPfor the AAD

- Configure an organizational unit (why is this needed)

	- Join the vm to the domain
	
		- validate the AAD DC Administrators group is added to the local administrator's group
		- validate the remote desktop access permision
		
	- configure an oganizational unit
	
		- connect to the vm using the domain account
		
	- (?)Enable Secure Ldap access through the internet
	- (?)Configure DNS to access the managed domain from the internet


- create an arm vnet with an HDInsight cluster

- Bridge the two VNets

- Additional temporary steps.

	
## Create an AAD VNet with a VM

For additional information about the following procedure, see [Create a virtual network (classic) by using the Azure portal](../virtual-network/virtual-networks-create-vnet-classic-portal.md)
**To create a classic VNet**

1. Sign on to the [Azure classic portal](https://manage.windowsazure.com).
2. Click **New** > **Network Services** > **Custom Create**.
3. Enter or select **Name**, **Location** and **Subscription**, and then click **Next**.
4. On the **DNS Servers and VPN Connectivity** page, click **Next**. If you do not specify a DNS server, your VNet will use the internal naming resolution resolution provided by Azure. For our scenario, we will not configure DNS servers.
5. Configure **Address Space** with **10.1.0.0/16**, and **Subnet-1** with **10.1.0.0.24** as shown below:

	![Configure Secure HDInsight Azure Activie directory virtual network](.\media\hdinsight-secure-setup\hdinsight-secure-aad-vnet-setting.png)
	
6. Click **Complete** to create the vnet.

**To create a virtual machine into the virtual network**

1. Sign on to the [Azure classic portal](https://manage.windowsazure.com).
2. Click **New** > **Compute** > **Virtual Machine** > **From Gallery**.
3. Select an image, and then click **Next**.  If you don't know which one to use, select the default, **Windows Server 2012 R2 Data center**.
4. Enter or select the following values:

	- Virtual Machine Name: **contoso-aad-vm**
	- Tier: **Basic**
	- New User Name: **jgao**
	- Password: **Password123**
	
	Please note the username and the password is the local admin.
	
5. Click **Next**
6. In **Region/Virtual Network**, select the new virtual network you created in the last step, and then click **Next**.
7. Click **Complete**.

## Create and configure an AAD

** To create an AAD**

1. Sign on to the [Azure classic portal](https://manage.windowsazure.com).
2. Click **New** > **App Services** > **Active Directory** > **Directory** > **Custom Create**. 
3. Enter or select the following values:

	- Name: contoso-aad
	- Domain name: contoso155.  This name must be globally unique. Replace the number in the name with a different number until it is validated successfully.
	- Country or region: Select your country or region.
4. Click **Complete**.

This is a domain user, which will be used to configure the AAD.

** Create an AAD user**

1. Sign on to the [Azure classic portal](https://manage.windowsazure.com).
2. Click **Active Directory** > **contoso-aad**. 
3. Click **Users** from the top menu.
4. Enter **User Name**, and then click **Next**. 
5. Configure user profile; In **Role**, select **Global Admin**; and then click **Next**.
6. Click **Create** to get a temporary password.
7. Make a copy of the password - Xomo0052, and then click **Complete**. jgao@contoso155.onmicrosoft.com



**To create the AAD DC Administrators' group**

1. Sign on to the [Azure classic portal](https://manage.windowsazure.com).
2. Click **Active Directory** > **contoso-aad**. 
3. Click **Groups** from the top menu.
4. Click **Add a Group** or **Add Group**.
5. Enter or select the following values:

	- **Name**: AAD DC Administrators.  The name has to be "AAD DC Administrators".
	- **Group Type**: Security.
6. Click **Complete**.
7. Click **AAD DC Administrators** to open the group.
8. Click **Add Members**.
9. Select the user you created in the previous step, and then click **Complete**.

	- Members of this group will be granted administrative privileges on machines that are domain joined to the Azure AD domain Service domain you will setup.	
	- After domain join, this group will be added to the Administrators group on these domain joined machines.
	- Members of this group will also be able to use Remote Desktop to connect remotely to domain joined machines. (????)

**To enable Azure AD domain services for the Vnet**

1. Sign on to the [Azure classic portal](https://manage.windowsazure.com).
2. Click **Active Directory** > **contoso-aad**. 
3. Click **Configure** from the top menu.
4. Scoll down to **Domain Services**, and set the following values:

	- **Enable domain services for this directory**: Yes.
	- **DNS domain name of domain services**: This shows the default NDS name of the Azure directory.
	- **Connect domain services to this virtual network**: Select the classic virtual network you created earlier. I.e. **contoso_aad_vnet**.
	
6. Click **Save** from the bottom of the page. You will see **Pending ...** next to **Enable domain services for this directory**.  
7. Wait until **Pending ...** disappears, and **IP Address** got populated.  This can take up 20 minutes or more.
8. Make a copy of the IP addresses.

**To update DNS settings for the VNet**

1. Sign on to the [Azure classic portal](https://manage.windowsazure.com).
2. Click **Networks** > **contoso_aad_vnet**. 
3. Click **Configure** from the top menu.
4. In the **DNS Servers** section, enter:

	- "Contoso local 1" - 10.1.0.5
	- "Contoso local 2" - 10.1.0.6
5. Click **Save** from the bottom of the page.
6. Click **Yes** to confirm.	

You can skip the next two steps in this tutorial. In your real implementation, you night need the following two steps:

	- (Optional) [Update DNS settings for the virtual network](../active-directory/active-directory-ds-getting-started-dns.md)
	- (Optional) [Enable password synchronization to AAD domain services for a cloud-only Azure AD directory](../active-directory/active-directory-ds-getting-started-password-sync.md)
	

**To configure LDAPS for an Azure AD domain**

For more information, see [Configure Secure LDAP (LDAPS) for an Azure AD Domain Services managed domain](../active-directory/active-directory-ds-admin-guide-configure-secure-ldap.md).

1. Create a certificate using the following script from an elevated Windows PowerShell console:

		$certFile = "c:\Tutorials\cert\SecureLdapCert.pfx"
		$certPassword = "Pass@word123"
		$certName = "*.contoso155.onmicrosoft.com" # this must match the AAD DNS name


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
2. Click **Active Directory** > **contoso-aad**. 
3. Click **Configure** from the top menu.
4. Scroll to **domain services**.
5. Click **Configure certificate**.
6. Follow the instruction to specify the certificate file and the password. You will see **Pending ...** next to **Enable domain services for this directory**.  
7. Wait until **Pending ...** disappears, and **Secure LDAP Certificate** got populated.  This can take up 10 minutes or more.

**Optional steps**
 
 - enable secure LDAP access over the internet
 - configure DNS to access the managed domain from the internet
 
## Configure an organizational unit (why is this needed)


**To RDP to the vm**
1. Sign on to the [Azure classic portal](https://manage.windowsazure.com).
2. Click **Virtual Machines** > **contoso-aad-vm**.
3. Click **Dashboard** from the top menu.
4. Click **Connect** from the bottom of the page.
5. Follow the instruction and use the local admin username and password to connect.

**To join VM to the AAD domain**

See [Join a Windows Server virtual machine to a managed domain](../active-directory/active-directory-ds-admin-guide-join-windows-vm.md).

1. From the RDP session, click the Server Manager icon from the startbar.
2. Click **Local Server** from the left menu.
3. From Workgroup, click **Workgroup**.
4. Click **Change**.
5. Click **Domain**, enter **contoso155.onmicrosoft.com**, and then click **OK**.
6. Enter the domain user credentials, and then click **OK**.
7. Click **OK**.
8. Click **OK** to agree to reboot the computer.
9. Click **Close**.
10. Click **Restart Now**.

**Add AAD DC Administrators to the Remote Desktop users**

**To install Active Directory administration tools**

See [Install Active Directory administration tools on the virtual machine](https://azure.microsoft.com/en-us/documentation/articles/active-directory-ds-admin-guide-administer-domain/#task-2---install-active-directory-administration-tools-on-the-virtual-machine).
1. RDP into **contoso-aad-vm**.
2. Click the **Server Manager** icon from the startbar.
3. Click **Dashboard** from the left menu.
4. Click **Add roles and features**.
5. Click **Next**.
6. Select **Role-based or feature-based installation**, and then click **Next**.
7. Select the current virtual machine from the server pool, and click **Next**.
8. Click **Next** to skip installing any server roles.
8. Click **Features** from the left.
9. From the **Features** list, exapnd **Remote Server Administration Tools**, expand **Role Administration Tools**, select **AD DS and AD LDS Tools**, and then click **Next**.
10. Click **Install**.


**Crate an Organizational Unit (OU) on an Azure AD Domain Services managed domain**

See [Create an Organizational Unit (OU) on an Azure AD Domain Services managed domain](https://azure.microsoft.com/en-us/documentation/articles/active-directory-ds-admin-guide-create-ou/).

1. RDP into **contoso-aad-vm**.
2. Click the Windows button from the taskbar.
3. Click **Administrative Tools**.
4. Click **Active Directory Administrative Center**.
5. Click the domain name in the left pane. For example Contoso155.com.
6. Click **New** under the domain name in the **Task** pane, and then click **Organizational Unit**.
7. Enter a name, and then click **OK**.

*****************************************
**additional steps**
Permissions/security for newly created ous
https://azure.microsoft.com/en-us/documentation/articles/active-directory-ds-admin-guide-create-ou/#permissionssecurity-for-newly-created-ous
*****************************************



## Create Hadoop cluster into virtual network

clustername: contosohdi
resource group: contosohdirg

In this section, you will create a Linux-based Hadoop cluster in HDInsight using [Azure ARM template](../resource-group-template-deploy.md). The Azure ARM template experience is not required for following this tutorial. For other cluster creation methods and understanding the settings, see [Create HDInsight clusters](hdinsight-hadoop-provision-linux-clusters.md). For more information about using ARM template to create Hadoop clusters in HDInsight, see [Create Hadoop clusters in HDInsight using ARM templates](hdinsight-hadoop-create-windows-clusters-arm-templates.md)

1. Click the following image to open an ARM template in the Azure Portal. The ARM template is located in a public blob container. 

    <a href="https://portal.azure.com/#create/Microsoft.Template/uri/https%3A%2F%2Fhditutorialdata.blob.core.windows.net%2Farmtemplates%2Fcreate-linux-based-hadoop-cluster-in-vnet.json" target="_blank"><img src="https://acom.azurecomcdn.net/80C57D/cdn/mediahandler/docarticles/dpsmedia-prod/azure.microsoft.com/en-us/documentation/articles/hdinsight-hbase-tutorial-get-started-linux/20160201111850/deploy-to-azure.png" alt="Deploy to Azure"></a>

2. From the **Parameters** blade, enter the following:

    - **ClusterName**: Enter a name for the Hadoop cluster that you will create.
    - **Cluster login name and password**: The default login name is **admin**.
    - **SSH username and password**: The default username is **sshuser**.  You can rename it. 

    A lot of properties have been hard-coded into the template. For example:
    
    - Location: East US
    - Cluster worker node count: 4
    - Default storage account: <Cluster Name>store
    - Virtual network name: <Cluster Name>-vnet
    - Virtual network address space: 10.0.0.0/16
    - Subnet name: default
    - Subnet address range: 10.0.0.0/24

3. Click **OK** to save the parameters.
4. From the **Custom deployment** blade, click **Resource group** dropdown box, and then click **New** to create a new resource group.  The resource group is a container that groups the cluster, the dependent storage account and other linked resource.
5. Click **Legal terms**, and then click **Create**.
6. Click **Create**. You will see a new tile titled **Submitting deployment for Template deployment**. It takes about around 20 minutes to create a cluster. Once the cluster is created, you can click the cluster blade in the portal to open it.

After you complete the tutorial, you might want to delete the cluster. With HDInsight, your data is stored in Azure Storage, so you can safely delete a cluster when it is not in use. You are also charged for an HDInsight cluster, even when it is not in use. Since the charges for the cluster are many times more than the charges for storage, it makes economic sense to delete clusters when they are not in use. For the instructions of deleting a cluster, see [Manage Hadoop clusters in HDInsight by using the Azure Portal](hdinsight-administer-use-management-portal.md#delete-clusters).



## Bridge the AAD VNet and the HDInsight VNet


3 steps:

**To create a VPN gateway for the AAD(classic) VNet**

1. Sign on to the [classic portal](https://manage.windowsazure.com).
2. Click **New** > **NETWORK SERVICES** > **VIRTUAL NETWORKS** > **ADD LOCAL NETWORK**. 
3. Enter a name for the ARM VNet you want to connect to, and then click **Next**. For example: contosohdi-vnet
4. Enter or select the following values:

	- In the address space STARTING IP text box, type the network prefix for the ARM VNet you want to connect to.
	- In the CIDR (ADDRESS COUNT) drop down, select the number of bits used for the network portion of the CIDR block used by the ARM VNet you want to connect to.
	- In VPN DEVICE IP ADDRESS (OPTIONAL), type any valid public IP address. For example, 192.168.0.1. We will change this IP address later. 
	

5. On the **Networks** page, click **VIRTUAL NETWORKS**, and then click on your classic VNet (contoso-aad_vnet), and then click **CONFIGURE**.
6. Under **site-to-site connectivity**,  check **Connect to the local network**, and then select the local network you just created in **Local Netwrok**.
7. Click **Save** on the bottom of the page.
8. Click **Yes** to confirm.
9. Click **Dashboard** from the top menu, click **Create Gateway** from the bottom of the page, click **Dynamic Routing**, and then click **Yes**. When it is done, copy the gateway public IP address. You will need it to setup the gateway in the ARM VNet. Don't worry if you see the status is disconnected.  It is expected. 23.96.115.230


**To create a VPN gateway for the ARM VNet**

1. Sign on to the [Azure portal](https://portal.azure.com).
2. Click **New** > **Networking** > **Local network gateway**.
3. Select or enter:

	- Name:  contosohdivnetlocalgateway
	- IP Address: The public IP address of the gateway you created in the last step.
	- Address space: the CIDR block of the classic VNet, 10.1.0.0/16
	- Resource group: contosohdirg


3. Click **New** > **Networking** > **Virtual network gateway**.
4. Select or enter:

	- Name: contosohdivnetpublicgateway
	- Virtual network: ARM network name contosohdi-vnet.
	- Pulbic IP address: Create new: contosohdvnetpublicgatewayip


6. Open the virutal network public gateway.  In the Seetings > Properties, find the public IP address:  23.96.13.21 



**To connect the two gateways**

1. Sign on to the [classic portal](https://manage.windowsazure.com).
2. Click **Networks** > **Local Networks**, and then click the ARM VNet that you want to connect to. For example: contosohdi-vnet.
3. Click **Edit** from the bottom.
4. Replace **VPN Device IP Address** with the ARM VNet gateway public IP address: 23.96.13.21.
5. Click **Next**.
6. Click **Complete**.
7. From a PowerShell console, setup a shared key by running the command below. Make sure you change the names of the VNets to the your own VNet names.

		Set-AzureVNetGatewayKey -VNetName VNetClassic `
			-LocalNetworkSiteName VNetARM -SharedKey abc123

8. Create the VPN connection by running the commands below.


		$vnet01gateway = Get-AzureRmLocalNetworkGateway -Name VNetClassic -ResourceGroupName RG1
		$vnet02gateway = Get-AzureRmVirtualNetworkGateway -Name v1v2Gateway -ResourceGroupName RG1

		New-AzureRmVirtualNetworkGatewayConnection -Name arm-asm-s2s-connection `
			-ResourceGroupName RG1 -Location "East US" -VirtualNetworkGateway1 $vnet02gateway `
			-LocalNetworkGateway2 $vnet01gateway -ConnectionType IPsec `
			-RoutingWeight 10 -SharedKey 'abc123'











 
install AD admin tools
	- Join the vm to the domain
	
		- validate the AAD DC Administrators group is added to the local administrator's group
		- validate the remote desktop access permision
		
	- configure an oganizational unit
	
		- connect to the vm using the domain account
		
	- (?)Enable Secure Ldap access through the internet
	- (?)Configure DNS to access the managed domain from the internet