---
title: 'Tutorial: Use federation for hybrid identity in a single Active Directory forest'
description: Learn how to set up a hybrid identity environment by using federation to integrate a Windows Server Active Directory forest with Azure Active Directory.
services: active-directory
author: billmath
manager: amycolannino
ms.service: active-directory
ms.workload: identity
ms.tgt_pltfrm: na
ms.topic: tutorial
ms.date: 01/19/2023
ms.subservice: hybrid
ms.author: billmath

ms.collection: M365-identity-device-management
---

# Tutorial: Use federation for hybrid identity in a single Active Directory forest

This tutorial shows you how to create a hybrid identity environment in Azure by using federation and Windows Server Active Directory (Windows Server AD). You can use the hybrid identity environment you create for testing or to get more familiar with how hybrid identity works.

:::image type="content" source="media/tutorial-federation/diagram.png" border="false" alt-text="Diagram that shows how to create a hybrid identity environment in Azure by using federation.":::

In this tutorial, you learn how to:

> [!div class="checklist"]
>
> - Create a virtual machine.
> - Create a Windows Server Active Directory environment.
> - Create a Windows Server Active Directory user.
> - Create a certificate.
> - Create an Azure Active Directory tenant.
> - Create a Hybrid Identity Administrator account in Azure.
> - Add a custom domain to your directory.
> - Set up Azure AD Connect.
> - Test and verify that users are synced.

## Prerequisites

To complete the tutorial, you need these items:

- A computer with [Hyper-V](/windows-server/virtualization/hyper-v/hyper-v-technology-overview) installed. We suggest that you install Hyper-V on a [Windows 10](/virtualization/hyper-v-on-windows/about/supported-guest-os) or [Windows Server 2016](/windows-server/virtualization/hyper-v/supported-windows-guest-operating-systems-for-hyper-v-on-windows) computer.
- An Azure subscription. If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.
- An [external network adapter](/virtualization/hyper-v-on-windows/quick-start/connect-to-network), so the virtual machine can connect to the internet.
- A copy of Windows Server 2016.
- A [custom domain](../../fundamentals/add-custom-domain.md) that can be verified.

> [!NOTE]
> This tutorial uses PowerShell scripts to quickly create the tutorial environment. Each script uses variables that are declared at the beginning of the script. Be sure to change the variables to reflect your environment.
>
> The scripts in the tutorial create a general Windows Server Active Directory (Windows Server AD) environment before they install Azure AD Connect. The scripts are also used in related tutorials.
>
> The PowerShell scripts that are used in this tutorial are available on [GitHub](https://github.com/billmath/tutorial-phs).

## Create a virtual machine

To create a hybrid identity environment, the first task is to create a virtual machine to use as an on-premises Windows Server AD server.

> [!NOTE]
> If you've never run a script in PowerShell on your host machine, before you run any scripts, open Windows PowerShell ISE as administrator and run `Set-ExecutionPolicy remotesigned`. In the **Execution Policy Change** dialog, select **Yes**.

To create the virtual machine:

1. Open Windows PowerShell ISE as administrator.
1. Run the following script:

    ```powershell
    #Declare variables
    $VMName = 'DC1'
    $Switch = 'External'
    $InstallMedia = 'D:\ISO\en_windows_server_2016_updated_feb_2018_x64_dvd_11636692.iso'
    $Path = 'D:\VM'
    $VHDPath = 'D:\VM\DC1\DC1.vhdx'
    $VHDSize = '64424509440'
    
    #Create a new virtual machine
    New-VM -Name $VMName -MemoryStartupBytes 16GB -BootDevice VHD -Path $Path -NewVHDPath $VHDPath -NewVHDSizeBytes $VHDSize  -Generation 2 -Switch $Switch  
    
    #Set the memory to be non-dynamic
    Set-VMMemory $VMName -DynamicMemoryEnabled $false
    
    #Add a DVD drive to the virtual machine
    Add-VMDvdDrive -VMName $VMName -ControllerNumber 0 -ControllerLocation 1 -Path $InstallMedia
    
    #Mount installation media
    $DVDDrive = Get-VMDvdDrive -VMName $VMName
    
    #Configure the virtual machine to boot from the DVD
    Set-VMFirmware -VMName $VMName -FirstBootDevice $DVDDrive 
    ```

## Install the operating system

To finish creating the virtual machine, install the operating system:

1. In Hyper-V Manager, double-click the virtual machine.
1. Select **Start**.
1. At the prompt, press any key to boot from CD or DVD.
1. In the Windows Server start window, select your language, and then select **Next**.
1. Select **Install Now**.
1. Enter your license key and select **Next**.
1. Select the **I accept the license terms** checkbox and select **Next**.
1. Select **Custom: Install Windows Only (Advanced)**.
1. Select **Next**.
1. When the installation is finished, restart the virtual machine. Sign in, and then check Windows Update. Install any updates to ensure that the VM is fully up-to-date.

## Install Windows Server AD prerequisites

Before you install Windows Server AD, run a script that installs prerequisites:

1. Open Windows PowerShell ISE as administrator.
1. Run `Set-ExecutionPolicy remotesigned`. In the **Execution Policy Change** dialog, select **Yes to All**.
1. Run the following script:

    ```powershell
    #Declare variables
    $ipaddress = "10.0.1.117" 
    $ipprefix = "24" 
    $ipgw = "10.0.1.1" 
    $ipdns = "10.0.1.117"
    $ipdns2 = "8.8.8.8" 
    $ipif = (Get-NetAdapter).ifIndex 
    $featureLogPath = "c:\poshlog\featurelog.txt" 
    $newname = "DC1"
    $addsTools = "RSAT-AD-Tools" 
    
    #Set a static IP address
    New-NetIPAddress -IPAddress $ipaddress -PrefixLength $ipprefix -InterfaceIndex $ipif -DefaultGateway $ipgw 
    
    # Set the DNS servers
    Set-DnsClientServerAddress -InterfaceIndex $ipif -ServerAddresses ($ipdns, $ipdns2)
    
    #Rename the computer 
    Rename-Computer -NewName $newname -force 
    
    #Install features 
    New-Item $featureLogPath -ItemType file -Force 
    Add-WindowsFeature $addsTools 
    Get-WindowsFeature | Where installed >>$featureLogPath 
    
    #Restart the computer 
    Restart-Computer
    ```

## Create a Windows Server AD environment

Now, install and configure Active Directory Domain Services to create the environment:

1. Open Windows PowerShell ISE as administrator.
1. Run the following script:

    ```powershell
    #Declare variables
    $DatabasePath = "c:\windows\NTDS"
    $DomainMode = "WinThreshold"
    $DomainName = "contoso.com"
    $DomainNetBIOSName = "CONTOSO"
    $ForestMode = "WinThreshold"
    $LogPath = "c:\windows\NTDS"
    $SysVolPath = "c:\windows\SYSVOL"
    $featureLogPath = "c:\poshlog\featurelog.txt" 
    $Password = ConvertTo-SecureString "Passw0rd" -AsPlainText -Force
    
    #Install Active Directory Domain Services, DNS, and Group Policy Management Console 
    start-job -Name addFeature -ScriptBlock { 
    Add-WindowsFeature -Name "ad-domain-services" -IncludeAllSubFeature -IncludeManagementTools 
    Add-WindowsFeature -Name "dns" -IncludeAllSubFeature -IncludeManagementTools 
    Add-WindowsFeature -Name "gpmc" -IncludeAllSubFeature -IncludeManagementTools } 
    Wait-Job -Name addFeature 
    Get-WindowsFeature | Where installed >>$featureLogPath
    
    #Create a new Windows Server AD forest
    Install-ADDSForest -CreateDnsDelegation:$false -DatabasePath $DatabasePath -DomainMode $DomainMode -DomainName $DomainName -SafeModeAdministratorPassword $Password -DomainNetbiosName $DomainNetBIOSName -ForestMode $ForestMode -InstallDns:$true -LogPath $LogPath -NoRebootOnCompletion:$false -SysvolPath $SysVolPath -Force:$true
    ```

## Create a Windows Server AD user

Next, create a test user account. Create this account in your on-premises Active Directory environment. The account is then synced to Azure Active Directory (Azure AD).

1. Open Windows PowerShell ISE as administrator.
1. Run the following script:

    ```powershell
    #Declare variables
    $Givenname = "Allie"
    $Surname = "McCray"
    $Displayname = "Allie McCray"
    $Name = "amccray"
    $Password = "Pass1w0rd"
    $Identity = "CN=ammccray,CN=Users,DC=contoso,DC=com"
    $SecureString = ConvertTo-SecureString $Password -AsPlainText -Force
    
    #Create the user
    New-ADUser -Name $Name -GivenName $Givenname -Surname $Surname -DisplayName $Displayname -AccountPassword $SecureString
    
    #Set the password to never expire
    Set-ADUser -Identity $Identity -PasswordNeverExpires $true -ChangePasswordAtLogon $false -Enabled $true
    ```

## Create a certificate for AD FS

You need a TLS or SSL certificate that Active Directory Federation Services (AD FS) will use. The certificate is a self-signed certificate, and you create it to use only for testing. We recommend that you don't use a self-signed certificate in a production environment.

To create a certificate:

1. Open Windows PowerShell ISE as administrator.
1. Run the following script:

    ```powershell
    #Declare variables
    $DNSname = "adfs.contoso.com"
    $Location = "cert:\LocalMachine\My"
    
    #Create a certificate
    New-SelfSignedCertificate -DnsName $DNSname -CertStoreLocation $Location
    ```

## Create an Azure AD tenant

[!INCLUDE [portal updates](~/articles/active-directory/includes/portal-update.md)]

Now, create an Azure AD tenant, so you can sync your users in Azure:

1. Sign in to the [Azure portal](https://portal.azure.com) using the account that's associated with your Azure subscription.
1. Search for and then select **Azure Active Directory**.
1. Select **Create**.

   :::image type="content" source="media/tutorial-federation/create1.png" alt-text="Screenshot that shows how to create an Azure AD tenant.":::
1. Enter a name for the organization and an initial domain name. Then select **Create** to create your directory.
1. To manage the directory, select the **here** link.

## Create a Hybrid Identity Administrator account in Azure AD

The next task is to create a Hybrid Identity Administrator account. This account is used to create the Azure AD Connector account during Azure AD Connect installation. The Azure AD Connector account is used to write information to Azure AD.

To create the Hybrid Identity Administrator account:

1. In the left menu under **Manage**, select **Users**.

   :::image type="content" source="media/tutorial-federation/gadmin1.png" alt-text="Screenshot that shows Users selected under Manage in the resource menu to create a Hybrid Identity Administrator in Azure AD.":::
1. Select **All users**, and then select **New user**.
1. In the **User** pane, enter a name and a username for the new user. You're creating your Hybrid Identity Administrator account for the tenant. You can show and copy the temporary password.

   In the **Directory role** pane, select **Hybrid Identity Administrator**. Then select **Create**.

   :::image type="content" source="media/tutorial-federation/gadmin2.png" alt-text="Screenshot that shows the Create button you select when you create a Hybrid Identity Administrator account in Azure AD.":::
1. In a new web browser window, sign in to `myapps.microsoft.com` by using the new Hybrid Identity Administrator account and the temporary password.
1. Choose a new password for the Hybrid Identity Administrator account and change the password.

## Add a custom domain name to your directory

Now that you have a tenant and a Hybrid Identity Administrator account, add your custom domain so that Azure can verify it.

To add a custom domain name to a directory:

1. In the [Azure portal](https://portal.azure.com/#blade/Microsoft_AAD_IAM/ActiveDirectoryMenuBlade/Overview), be sure to close the **All users** pane.
1. In the left menu under **Manage**, select **Custom domain names**.
1. Select **Add custom domain**.

   :::image type="content" source="media/tutorial-federation/custom1.png" alt-text="Screenshot that shows the Add custom domain button highlighted.":::
1. In **Custom domain names**, enter the name of your custom domain, and then select **Add domain**.
1. In **Custom domain name**, either TXT or MX information is shown. You must add this information to the DNS information of the domain registrar under your domain. Go to your domain registrar and enter either the TXT or the MX information in the DNS settings for your domain.

   :::image type="content" source="media/tutorial-federation/custom2.png" alt-text="Screenshot that shows where you get TXT or MX information.":::
   Adding this information to your domain registrar allows Azure to verify your domain. Domain verification might take up to 24 hours.

   For more information, see the [add a custom domain](../../fundamentals/add-custom-domain.md) documentation.
1. To ensure that the domain is verified, select **Verify**.

   :::image type="content" source="media/tutorial-federation/custom3.png" alt-text="Screenshot that shows a success message after you select Verify.":::

## Download and install Azure AD Connect

Now it's time to download and install Azure AD Connect. After it's installed, you'll use the express installation.

1. Download [Azure AD Connect](https://www.microsoft.com/download/details.aspx?id=47594).
1. Go to *AzureADConnect.msi* and double-click to open the installation file.
1. In **Welcome**, select the checkbox to agree to the licensing terms, and then select **Continue**.
1. In **Express settings**, select **Customize**.
1. In **Install required components**, select **Install**.
1. In **User sign-in**, select **Federation with AD FS**, and then select **Next**.

   :::image type="content" source="media/tutorial-federation/fed1.png" alt-text="Screenshot that shows where to select Federation with AD FS.":::
1. In **Connect to Azure AD**, enter the username and password of the Hybrid Identity Administrator account you created earlier, and then select **Next**.
1. In **Connect your directories**, select **Add directory**. Then select **Create new AD account** and enter the contoso\Administrator username and password. Select **OK**.
1. Select **Next**.
1. In **Azure AD sign-in configuration**, select **Continue without matching all UPN suffixes to verified domains**. Select **Next.**
1. In **Domain and OU filtering**, select **Next**.
1. In **Uniquely identifying your users**, select **Next**.
1. In **Filter users and devices**, select **Next**.
1. In **Optional features**, select **Next**.
1. In **Domain Administrator credentials**, enter the contoso\Administrator username and password, and then select **Next.**
1. In **AD FS farm**, make sure that **Configure a new AD FS farm** is selected.
1. Select **Use a certificate installed on the federation servers**, and then select **Browse**.
1. In the search box, enter **DC1** and select it in the search results. Select **OK**.
1. For **Certificate File**, select **adfs.contoso.com**, the certificate you created. Select **Next**.

   :::image type="content" source="media/tutorial-federation/fed2.png" alt-text="Screenshot that shows where to select the certificate file you created.":::
1. In **AD FS server**, select **Browse**. In the search box, enter **DC1** and select it in the search results. Select **OK**, and then select **Next**.

   :::image type="content" source="media/tutorial-federation/fed3.png" alt-text="Screenshot that shows where to select your AD FS server.":::
1. In **Web application proxy servers**, select **Next**.
1. In **AD FS service account**, enter the contoso\Administrator username and password, and then select **Next.**
1. In **Azure AD Domain**, select your verified custom domain, and then select **Next**.
1. In **Ready to configure**, select **Install**.
1. When the installation is finished, select **Exit**.
1. Before you use Synchronization Service Manager or Synchronization Rule Editor, sign out, and then sign in again.

## Check for users in the portal

Now you'll verify that the users in your on-premises Active Directory tenant have synced and are now in your Azure AD tenant. This section might take a few hours to complete.

To verify that the users are synced:

1. Sign in to the [Azure portal](https://portal.azure.com) using the account that's associated with your Azure subscription.
1. In the portal menu, select **Azure Active Directory**.
1. In the resource menu under **Manage**, select **Users**.
1. Verify that the new users appear in your tenant.

   :::image type="content" source="media/tutorial-federation/sync1.png" alt-text="Screenshot that shows verifying that users were synced in Azure Active Directory.":::
  
## Sign in with a user account to test sync

To test that users from your Windows Server AD tenant are synced with your Azure AD tenant, sign in as one of the users:

1. Go to [https://myapps.microsoft.com](https://myapps.microsoft.com).
1. Sign in with a user account that was created in your new tenant.

   For the username, use the format `user@domain.onmicrosoft.com`. Use the same password the user uses to sign in to on-premises Active Directory.

You've successfully set up a hybrid identity environment that you can use to test and to get familiar with what Azure has to offer.

## Next steps

- Review [Azure AD Connect hardware and prerequisites](how-to-connect-install-prerequisites.md).
- Learn how to use [customized settings](how-to-connect-install-custom.md) in Azure AD Connect.
- Learn more about [Azure AD Connect and federation](how-to-connect-fed-whatis.md).
