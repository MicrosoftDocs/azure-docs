<properties
	pageTitle="Azure Active Directory Domain Services preview: Administration Guide | Microsoft Azure"
	description="Join a Windows virtual machine to a managed domain using Azure PowerShell and the classic deployment model."
	services="active-directory-ds"
	documentationCenter=""
	authors="mahesh-unnikrishnan"
	manager="stevenpo"
	editor="curtand"/>

<tags
	ms.service="active-directory-ds"
	ms.workload="identity"
	ms.tgt_pltfrm="na"
	ms.devlang="na"
	ms.topic="article"
	ms.date="07/06/2016"
	ms.author="maheshu"/>


# Create Windows virtual machines with PowerShell and the classic deployment model

> [AZURE.SELECTOR]
- [Azure classic portal - Windows](active-directory-ds-admin-guide-join-windows-vm.md)
- [PowerShell - Windows](active-directory-ds-admin-guide-join-windows-vm-classic-powershell.md)

<br>

> [AZURE.IMPORTANT] Azure has two different deployment models for creating and working with resources:  [Resource Manager and classic](../resource-manager-deployment-model.md). This article covers using the classic deployment model. Azure AD Domain Services does not currently support the Resource Manager model.

These steps show you how to customize a set of Azure PowerShell commands that create and preconfigure a Windows-based Azure virtual machine by using a building block approach. These steps help you build a Windows-based Azure virtual machine and join it to an Azure AD Domain Services managed domain.

These steps follow a fill-in-the-blanks approach for creating Azure PowerShell command sets. This approach can be useful if you are new to PowerShell or you just want to know what values to specify for successful configuration. Advanced PowerShell users can take the commands and substitute their own values for the variables (the lines beginning with "$").

If you haven't done so already, use the instructions in [How to install and configure Azure PowerShell](../powershell-install-configure.md) to install Azure PowerShell on your local computer. Then, open a Windows PowerShell command prompt.

## Step 1: Add your account

1. At the PowerShell prompt, type **Add-AzureAccount** and click **Enter**.
2. Type in the email address associated with your Azure subscription and click **Continue**.
3. Type in the password for your account.
4. Click **Sign in**.

## Step 2: Set your subscription and storage account

Set your Azure subscription and storage account by running these commands at the Windows PowerShell command prompt. Replace everything within the quotes, including the < and > characters, with the correct names.

	$subscr="<subscription name>"
	$staccount="<storage account name>"
	Select-AzureSubscription -SubscriptionName $subscr –Current
	Set-AzureSubscription -SubscriptionName $subscr -CurrentStorageAccountName $staccount

You can get the correct subscription name from the SubscriptionName property of the output of the **Get-AzureSubscription** command. You can get the correct storage account name from the Label property of the output of the **Get-AzureStorageAccount** command after you run the **Select-AzureSubscription** command.


## Step 3: Step-by-step walkthrough - provision the virtual machine and join it to the managed domain
Here is the corresponding Azure PowerShell command set to create this virtual machine, with blank lines between each block for readability.

Specify information about the Windows virtual machine to be provisioned.

    $family="Windows Server 2012 R2 Datacenter"
    $vmname="Contoso100-test"
    $vmsize="ExtraSmall"

For the InstanceSize values for D-, DS-, or G-series virtual machines, see [Virtual Machine and Cloud Service Sizes for Azure](https://msdn.microsoft.com/library/azure/dn197896.aspx).

Provide information about the managed domain.

    $domaindns="contoso100.com"
    $domacctdomain="contoso100"

Specify the name of the cloud service.

    $svcname="Contoso100-test"

Specify the name of the virtual network to which the VM should be joined. Ensure that the AAD-DS managed domain is available in this virtual network.

    $vnetname="MyPreviewVnet"

Select the VM image to be used to provision the VM.

    $image=Get-AzureVMImage | where { $_.ImageFamily -eq $family } | sort PublishedDate -Descending | select -ExpandProperty ImageName -First 1

Configure the VM - set VM name, instance size & image to be used.

    $vm1=New-AzureVMConfig -Name $vmname -InstanceSize $vmsize -ImageName $image

Obtain local administrator credentials for the VM. Choose a strong local administrator password. To check its strength, see [Password Checker: Using Strong Passwords](https://www.microsoft.com/security/pc-security/password-checker.aspx).

    $localadmincred=Get-Credential –Message "Type the name and password of the local administrator account."

Obtain credentials for a user account belonging to 'AAD DC Administrators' group to join VM to the managed domain. Do not specify the domain name - for instance, in our example, we specify 'bob' as the user name.

    $domainadmincred=Get-Credential –Message "Now type the name (DO NOT INCLUDE THE DOMAIN) and password of an account in the AAD DC Administrators group, that has permission to add the machine to the domain."

Configure the VM - specify domain join requirement & required credentials.

    $vm1 | Add-AzureProvisioningConfig -AdminUsername $localadmincred.Username -Password $localadmincred.GetNetworkCredential().Password -WindowsDomain -Domain $domacctdomain -DomainUserName $domainadmincred.Username -DomainPassword $domainadmincred.GetNetworkCredential().Password -JoinDomain $domaindns

Set a subnet for the VM.

    $vm1 | Set-AzureSubnet -SubnetNames "Subnet-1"

Optional: Point to the IP address of the domain. If you set the IP addresses of the Azure AD Domain Services managed domain to be the DNS servers for the virtual network, this step is not required.

    $dns = New-AzureDns -Name 'contoso100-dc1' -IPAddress '10.0.0.4'

Now, provision the domain-joined Windows VM.

    New-AzureVM –ServiceName $svcname -VMs $vm1 -VNetName $vnetname -Location "Central US" -DnsSettings $dns

<br>

## Script to provision a Windows VM and automatically join it to an AAD Domain Services managed domain
This PowerShell command set creates a virtual machine for a line of business server that:

- Uses the Windows Server 2012 R2 Datacenter image.
- Is an extra small virtual machine.
- Has the name contoso-test.
- Is automatically domain joined to the contoso100 managed domain.
- Is added to the same virtual network as the managed domain.

Here is the full sample script to create the Windows virtual machine and automatically join it to the Azure AD Domain Services managed domain.

    $family="Windows Server 2012 R2 Datacenter"
    $vmname="Contoso100-test"
    $vmsize="ExtraSmall"

    $domaindns="contoso100.com"
    $domacctdomain="contoso100"

    $svcname="Contoso100-test"
    $vnetname="MyPreviewVnet"

    $image=Get-AzureVMImage | where { $_.ImageFamily -eq $family } | sort PublishedDate -Descending | select -ExpandProperty ImageName -First 1

    $vm1=New-AzureVMConfig -Name $vmname -InstanceSize $vmsize -ImageName $image

    $localadmincred=Get-Credential –Message "Type the name and password of the local administrator account."

    $domainadmincred=Get-Credential –Message "Now type the name (not including the domain) and password of an account in the AAD DC Administrators group, that has permission to add the machine to the domain."

    $vm1 | Add-AzureProvisioningConfig -AdminUsername $localadmincred.Username -Password $localadmincred.GetNetworkCredential().Password -WindowsDomain -Domain $domacctdomain -DomainUserName $domainadmincred.Username -DomainPassword $domainadmincred.GetNetworkCredential().Password -JoinDomain $domaindns

    $vm1 | Set-AzureSubnet -SubnetNames "Subnet-1"

    $dns = New-AzureDns -Name 'contoso100-dc1' -IPAddress '10.0.0.4'

    New-AzureVM –ServiceName $svcname -VMs $vm1 -VNetName $vnetname -Location "Central US" -DnsSettings $dns
