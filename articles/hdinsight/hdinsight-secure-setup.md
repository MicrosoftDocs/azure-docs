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

## Introduction

- Two vnets
	
	- AAD in classic vnet
	- Hadoop cluster in ARM vnet
	
**Names:**
aad Vnet: contoso_aad_vnet
aad Vm: contoso-aad-vm
AAD directory: contoso-aad
AAD domain name: contoso155
HDInsight Vnet: contoso_hdi_vnet
HDInsight Vnet resource group: contoso_hdi_rg
HDInsight cluster: contoso_hdi_cluster


## Prerequisites

- Azure subscription

## Procedures

Since ADDS currently only supports classic VNETs and HDInsight only supports Resource Manager based VNETs, HDInsight AAD integration requires two VNETs – classic and Resource Manager based – and a bridge between the two.

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


**To install Active Directory administration tools**

1. RDP into **contoso-aad-vm**.
2. Click the ServerManager icon from the startbar.
3. 




 
install AD admin tools
	- Join the vm to the domain
	
		- validate the AAD DC Administrators group is added to the local administrator's group
		- validate the remote desktop access permision
		
	- configure an oganizational unit
	
		- connect to the vm using the domain account
		
	- (?)Enable Secure Ldap access through the internet
	- (?)Configure DNS to access the managed domain from the internet