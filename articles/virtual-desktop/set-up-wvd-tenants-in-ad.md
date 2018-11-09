---
title: Set up Windows Virtual Desktop tenants in Azure Active Directory
description: Describes how to set up Windows Virtual Desktop tenants in Azure Active Directory.
services: virtual-desktop
author: Heidilohr

ms.service: virtual-desktop
ms.topic: conceptual
ms.date: 10/25/2018
ms.author: helohr
---
# Set up Windows Virtual Desktop tenants in Azure Active Directory

This section will tell you how to deploy Windows Virtual Desktop in Azure Active Directory.

In this tutorial, you'll learn how to:

> [!div class="checklist"]
> * Access a CSP subscription for a customer
> * Prepare Azure Active Directory for a Remote Desktop environment

## Prerequisites

Before you deploy the Remote Desktop Services modern infrastructure, it's a good idea to have both the RDWeb and RDBroker URLs handy. Additionally, you should download the following files before deployment:

* The host agent installer, **RDInfra.RDAgent.Installer-x64.msi**.
* The host protocol installer, **Microsoft.RDInfra.StackSxS.Installer-x64.msi**.
* The Windows Virtual Desktop PowerShell module, **RDPowerShell.zip**.

If you're hosting for external customers, you should also have a Cloud Solution Provider (CSP) account to access the Microsoft Partner Center. The CSP technology enables the creation of CSP subscriptions that the hosting partner controls but is parented to the customer’s Azure Active Directory tenant. You'll need Azure credentials to access one of the following:

* Microsoft Partner Center (CSP) to create a CSP subscription.
* Enterprise subscription with either the Owner or Contributor role assigned.

## Prepare the Azure subscription for the tenant’s environment

Follow the steps in this section to prepare a subscription for the tenant’s session hosts (RDSH or Windows 10 RS3) if you plan to employ Active Directory. Choose the section that best suits your needs.

### Alternative 1: Create a CSP subscription for a customer without an Azure Active Directory tenant

This is the scenario you'll use if you're a hosting partner currently hosting Windows desktops and applications for an external customer without an Azure Active Directory tenant. Use the following steps to create a new Azure Active Directory tenant for a customer with a CSP subscription that's parented to the Azure Active Directory tenant but controlled and managed by the partner. This procedure uses the Partner Center portal, but there are also equivalent REST APIs that you can use to get the same results.

1. Open the [Microsoft Partner Center](https://partnercenter.microsoft.com/).
2. Select **Dashboard**.
3. Enter your Partner Center (CSP) account information.
4. On the CSP Dashboard, select **Customers**, then select **Add customer**.
5. On the **Account info** page, enter the required information, then select **Next: Subscriptions**.
6. On the **New subscription page**, select **Microsoft Azure** and **Azure Active Directory Basic**.

  >[!NOTE]
  >For now, leave the number of licenses at 1. You can change this value later.
7. Scroll down and select **Next: Review**.
8. Verify that all the information is correct, then select **Submit**.
9. Write down the Azure tenant ID (listed as the Microsoft ID on the confirmation page) and the admin name and password that you see on the Confirmation page for later use, then select **Done**.

You can see the new customer that you set up in the **Partner Center** portal by selecting **Customers** on the **Dashboard** and scrolling down, or searching for their name.

Here's how to change the admin password:

1. Open the Edge browser in a new InPrivate window.
2. Go to <https://login.microsoftonline.com>.
3. Enter the new tenant's admin credentials (for example, ```admin@<tenantname>.onmicrosoft.com``` and password).
4. On the **Update password** page, enter the old password, and then enter a new one of your choosing.
5. Select **Update** and sign in.

### Accessing a CSP subscription for a customer

You'll need to access the CSP subscription frequently while setting up your tenants. Because you can't go directly to the Microsoft Azure Management Portal to access CSP subscriptions, you have to sign in to the Microsoft Partner Center portal first, then launch the Azure Portal. After that, follow these steps:

1. Launch the [Microsoft Partner Center website](https://partnercenter.microsoft.com).
2. Enter your CSP account.
3. In the Dashboard, select **Customers**, then select the customer.
4. On the customer’s **Subscriptions** page, select **Service management**.
5. On the Service management page, select **Microsoft Azure Management Portal**.
6. Sign in to the Azure Portal using the CSP account. (Don't use the customer's Azure Active Directory admin account, like ```admin@tenant.onmicrosoft.com```.)

### Alternative 2: Use an existing Enterprise subscription

This section is for Enterprise admins hosting for a department within their company. You can use the same subscription for both the tenant environment and Windows Virtual Desktop.

Ensure that you have Owner access to the subscription. To access an Enterprise subscription, do the following things:

1. Launch the [Azure Portal](https://portal.azure.com).
2. Sign in to the Azure Portal with your Enterprise account credentials.

## Prepare Active Directory for the RD tenant environment

All session host virtual machines (RDSH or Windows 10) in the RD tenant environment must be domain-joined, and the Active Directory domain must be synchronized with the tenant’s Azure AD. This section will cover how to create the tenant’s Active Directory and networking infrastructure.

Azure Active Directory Domain Services (DS) can't be deployed in a CSP subscription at the moment, so the following procedure uses an Enterprise Azure subscription. This section will be updated once Azure Active Directory Domain Services supports CSP subscriptions.

To create a Resource Group and virtual network in the tenant’s environment:

1. Access the Enterprise Azure subscription through the [Azure Portal](https://portal.azure.com).
2. Follow the steps [here](https://docs.microsoft.com/azure/active-directory-domain-services/active-directory-ds-getting-started) to create a Resource Group, virtual network, and Azure Active Directory Domain Services instance for the customer’s session host environment.

>[!NOTE]
>It may take several hours to create the Azure Active Directory Domain Services. When adding users to Azure AD, it may take several minutes for the accounts to be synchronized to the Azure Active Directory Domain Services instance.

>[!TIP]
>Optionally, you can also [associate a custom domain to your Azure Active Directory](https://azure.microsoft.com/documentation/articles/active-directory-add-domain/).

### Create a virtual network and Active Directory virtual machines in the tenant’s environment

You can use the following [Azure Quickstart Azure Resource Manager template](https://github.com/Azure/azure-quickstart-templates/tree/master/active-directory-new-domain) to create an Active Directory Domain Services (AD DS) on a virtual machine in a virtual network.

1. Select **Deploy to Azure**.
2. Enter the required information.
 1. Resource group: Select **Create new** and specify a name.
 1. Admin username: Choose a domain admin name you will remember.
 1. Admin password: Choose a password that you will remember that also meets Azure virtual machine password complexity standards.
 1. Domain name: If you have already created a custom domain name, like the ```contoso.com``` name from the example, then use that name. However, the name doesn't necessarily need to match your Azure Active directory tenant domain, as you can always sync your user accounts.
 1. DNS Prefix: Same prefix as your domain name except all lower case. For example, ```contoso```.
   
   >[!WARNING]
   >Avoid making a domain name ending in ```.onmicrosoft.com```, as this will prevent successful end-user connections.
3. Select **I agree to the terms**, and then select **Purchase**.
4. After deployment is complete, go to the Resource group blade and select the virtual machine named **adVM**.
5. On the Virtual machine blade, select **Connect**.
6. Select **Open**, **Connect**, then sign in with the domain admin credentials you created (for example, ```myadminacct@mydomainname.com```).
7. When Server Manager opens, select **Tools**, and open the **Active Directory Users and Computers** tool. From here, you can add user accounts.

### Deploy Azure Active Directory Connect to synchronize Active Directory Domain Services accounts to Azure Active Directory

You need to synchronize the user accounts in the Active Directory Domain Services deployed in a virtual machine in the tenant’s environment with the user accounts in Azure Active Directory. You can use the [Azure Active Directory Connect tool](https://docs.microsoft.com/azure/active-directory/connect/active-directory-aadconnect-get-started-express) to do this.

>[!NOTE]
>If you want the fully qualified user names to match between Active Directory and Azure Active Directory, you need to first create a custom domain name for Azure Active Directory. This is described in [Quickstart: Add a custom domain name to Azure Active Directory](https://docs.microsoft.com/azure/active-directory/active-directory-add-domain).

#### Add users to the new Active Directory domain so that they sync up to the new Azure Active Directory tenant

1. Connect and sign into the Active Directory virtual machine in the customer’s environment.
2. In Server Manager, select **Tools** > **Active Directory Users and Computers**.
3. Expand the domain name, right-click **Users**, then select **New** > **User**.
4. Repeat to make 2–3 users.
5. Wait approximately 30 minutes for the Azure Active Directory sync to complete, then confirm that you can sign in to Azure using the synchronized accounts. To do this, open a new InPrivate Edge browser session and navigate to <https://portal.azure.com>. Sign out, and then sign back in with one of the user names you added.

  >[!NOTE]
  >If you have added a custom domain name to Azure Active Directory for matched UPNs, you can sign in with ```myusername@mydomainname.com```. If you haven't added a custom domain name to Azure AD, this means your UPNs are mismatched, so you'll have to sign in as ```myusername@mydomainname.onmicrosoft.com```.

## Give consent to allow the Windows Virtual Desktop roles and RD clients to read the tenant’s Azure Active Directory

When an infrastructure admin deploys Windows Virtual Desktop, it gets registered as a multi-tenant Azure application in Azure Active Directory. You must allow the Windows Virtual Desktop application to read the tenant’s Azure AD. Follow these steps to to connect to a web site that is part of the Windows Virtual Desktop deployment and consent to allow the Windows Virtual Desktop application to read that customer’s Azure Active Directory tenant.

1. Open a browser and connect to the Remote Desktop Web page URL.
2. Select **Consent Option: Server App** and enter the Azure Active Directory tenant ID. (For CSP subscriptions, you can find the ID listed in the Partner Portal as the customer's Microsoft ID. For Enterprise subscriptions, you can find the ID under **Azure Active Directory** > **Properties** > **Directory ID**.) After entering the ID, select **Submit**.
3. Sign in to the RD Connection App consent page with an administrative account from the customer’s Azure Active Directory tenant. The account name will look something like ```admin@<tenantname>.onmicrosoft.com```. (Note that this is not the partner’s CSP account.)
4. Select **Accept**.
5. Repeat steps 1–4 for the Client App.

  >[!NOTE]
  >The Server App must be consented before the Client App. Wait one minute between consenting the Server App and the Client App.

## Create a Remote Desktop tenant and host pool in Windows Virtual Desktop

Follow the steps in this section to create a new Remote Desktop tenant and create an empty session host pool in Windows Virtual Desktop.

### Install and import the Window Virtual Desktop PowerShell module

Follow these steps in the Windows PowerShell command window or a Windows PowerShell Integrated Scripting Environment (ISE) window to install and import the Windows Virtual Desktop PowerShell module on your local Windows computer.

>[!NOTE]
>These instructions will change once the RDS2mi.0 PowerShell module is published to the PowerShell Gallery.

1. Copy the **RDPowerShell.zip** file and extract it to a folder on your local computer.
2. Open a PowerShell window as Administrator.
3. At the PowerShell cmd shell prompt, enter the following:

  ```PowerShell
  cd <path-to-folder-where-RDPowerShell.zip-was-extracted>
  Import-module .\Microsoft.RdInfra.RdPowershell.dll
  ```

## Create a new RD tenant and host pool

Run the following cmdlets to create a new tenant, host pool, app group, and registration token.

```PowerShell
Set-RdsContext -DeploymentUrl <Windows Virtual Desktop Broker URL>
```

>[!NOTE]
>When you input this cmdlet, you'll be asked to provide credentials.

```PowerShell
New-RdsTenant -Name <tenantname> --AadTenantId <aadtenantid>

New-RdsHostPool -TenantName <tenantname> -Name <hostpoolname>

New-RdsRegistrationInfo -TenantName <tenantname> -HostPoolName <hostpoolname> -ExpirationHours <number of hours> | Select-Object -ExpandProperty Token > <PathToRegFile>

Add-RdsAppGroupUser -TenantName <tenantname> -HostPoolName <hostpoolname> -Name “Desktop Application Group” -UserPrincipalNames <userupn>

# to assign an array of users, use the following:
$userarray = @("u1@contoso.com","u2@contoso.com")

Add-RdsAppGroupUser  <tenantname> <hostpoolname> <appgroup> -UserPrincipalNames $userarray
```

>[!NOTE]
>**New-RdsRegistrationInfo** generates a new registration token that is active for enrolment for the amount of time that you specified in the **-ExpirationHours** parameter. The default value is 96 hours.
>Once a new RDS registration token generated by the **New-RdsRegistrationInfo** cmdlet, you should export it to a file. The **Select-Object** cmdlet is redirected to a file specified by the *PathToRegFile* variable.
>By design, when a new RDS host pool is created, a fault app group named “Desktop Application Group” is created. The **Add-RdsAppGroupUser** cmdlet above adds users to that group if a new group is needed the **-Name** parameter needs to be changed.

For additional cmdlet details, see the Windows Virtual Desktop PowerShell reference.

All of these cmdlet settings can be validated by running the **Get-** equivalent for each cmdlet.

>[!NOTE]
>Many cmdlet parameters are positional so that the parameter name is optional, as shown in the following examples.

```PowerShell
Get-RdsContext
Get-RdsTenant
Get-RdsHostPool <tenantname> <hostpoolname>
Get-RdsRegistrationInfo <tenantname> <hostpoolname> | Select-Object -ExpandProperty Token
Get-RdsAppGroupUser <tenantname> <hostpoolname> "Desktop Application Group"
```

## Create the host pool resources in Azure

This section will teach you how to create a host pool resource in Azure.

### Create a resource group and virtual machines for the host pool

Use the following procedure to create a resource group and one or more virtual machines for the host pool.

1. Access the Azure subscription using the steps outlined in either Alterative 1 (CSP) or Alternative 2 (Enterprise) under [Prepare the Azure subscription for the tenant's environment](set-up-wvd-tenants-in-ad.md#prepare-the-azure-subscription-for-the-tenant’s-environment) section.
2. Create a new Resource group.
3. Navigate to the Resource group. On the **Resource group** blade, select **Add**.
4. In the **Search Everything** field, enter and then select one of the following:
    1. Windows Server 2016 Remote Desktop Session Host.
    2. Windows Server Remote Desktop Session Host on Windows Server 2012 R2.
    3. Windows Server Remote Desktop Session Host with Microsoft Office 365 ProPlus (this gallery image is recommended if you plan to validate scenarios involving Microsoft Office applications).
    4. Windows Server 2016 Datacenter.
    5. (add info about Win10 RS4 image).
5. Select **Create** (Recommendation: Select **Resource Manager**).
6. On the **Create virtual machine** blades, enter the required information.

    Here are some examples of information you'll be asked to enter:

    * Name: rdsh-x  (rdsh-0, rdsh-1, and so on) or win10-x (win10-1, win10-2, and so on).
    * User name: A local admin user name you will remember.
    * Password: A local admin password you will remember that meets the Azure virtual machine password complexity requirements.
    * Resource group: the Resource group that you created in step 2.
    * Size: your choice, DS1_V2 (SSD) or A1_V2 (HDD) are good for testing.
    * Select **View all** to see all virtual machine sizes available.
    * Virtual Network: Select the virtual network created in the [Prepare Active Directory for the RD tenant environment](set-up-wvd-tenants-in-ad.md#prepare-active-directory-for-the-rd-tenant-environment) section.
    * Public IP address: Leave with default settings, that is, a public IP. A public IP is initially required to connect to the virtual machine, join the Active Directory domain, and register with Windows Virtual Desktop. After completing these actions, you can go back and remove all public IP addresses for the session host virtual machines.
    * Network security group (firewall): Create a new network security group for the host pool with the default port rules.

      >[!NOTE]
      >You can later use this network security group to disable all inbound ports and secure the RD tenant environment.
7. Select **Create** and then **Purchase** (deployment takes about ten minutes).
8. Repeat steps 3–7 for each virtual machine in the host pool.

### Prepare the host pool virtual machines

Use the following procedure to prepare each virtual machine in the host pool.

1. Sign in to the virtual machine:
    1. In the Microsoft Azure Portal, open the host pool resource group.
    1. Select the virtual machine and select **Connect** at the top of the virtual machine blade.
    1. Select **Open** and sign on using the local admin account that you created.
2. Join the virtual machine to the Active Directory domain.
    1. Launch Control Panel and select **System**.
    1. Select **Computer name, Change settings**.
    1. Select **Change…**
    1. Select **Domain**, enter the Active Directory domain, and authenticate with domain admin credentials.
    1. Restart the virtual machine.
3. Sign in to the virtual machine using a local or Domain admin account using procedure described in step 1, then install the RD Session Host role on the session host. Skip this step if you deployed a virtual machine using Windows 10 or one of the Remote Desktop Session Host images in the Azure gallery that already has the RD Session Host role installed.
    1. Run **servermanager.exe** from a commamd window.
    1. In Server Manager, select **Add roles and features**.
    1. Select **role-based** or **feature-based installation**, and then select the target server.
    1. Select **Remote Desktop Services**.
    1. Select **Next**.
    1. Select **Remote Desktop Session Host** > **Add Features**, and then select **Next**.
    1. Select **Install**.
    1. Restart the virtual machine to complete installation.
4. (Optional) Some Azure gallery images for Windows Server have audio disabled. To enable audio, do the following:
    1. Open **services.msc**.
    1. Right-click **Windows Audio** in the list of services.
    1. Select **Start**.

### Register the virtual machine with the host pool in Windows Virtual Desktop

1. Copy and paste the **Microsoft.RDInfra.RDAgent.Installer-x64.msi** and the file containing the registration token onto the virtual machine.

   >[!NOTE]
   >The registration token file was created in the Create4 Ne RD tenant and host pool section.
2. There are a number of ways to install RD host agent, three of which are presented here.
    1. Alternative 1: Use the command line. For the full set of msiexec command-line switches, see [this article](<https://msdn.microsoft.com/library/windows/desktop/aa367988(v=vs.85).aspx>).
      1. Open a PowerShell or CMD window as administrator.
      2. Enter the following cmdlet:

         ```PowerShell
         msiexec.exe /i “<full path>\Microsoft.RDInfra.RDAgent.Installer-x64.msi”  /quiet /qn RDBROKERURI=”<brokerURL>” REGISTRATIONTOKEN=”<tokenstring>”
         ```

      Here's an explanation of what each value means:
      * ```<full path>``` is the location of the MSI on the virtual machine.
      * ```<brokerURL>``` is the broker URL (formatted as <https://rdbroker-xxxx.azurewebsites.net>).
      * ```<tokenstring>``` is the JWT string created in Alternative 2 of the [Prepare Active Directory for the RD tenant environment](set-up-wvd-tenants-in-ad.md#prepare-active-directory-for-the-rd-tenant-environment) section.
    1. Alternative 2: Use the installer’s graphical user interface (GUI).
       1. Select the msi to run the GUI.
       1. Select **Next**.
       1. Enter the Broker URI string.
       1. Copy the Registration Token string from the file that was to the virtual machine in step 1 and paste it into the **Registration Token** field.
       1. Select **Next**, **Install**, and **Finish**.
    1. Alternative 3: Use the installer’s GUI and the registry.
       1. Select the **msi** to run the GUI.
       1. Select **Next**.
       1. Enter the Broker URI string.
       1. Leave the **Registration Token** field blank.
       1. Select **Next**, then **Install**, and then **Finish**.
          >[!NOTE]
          > At this point, the service has been installed with appropriate URL to register with the broker. The virtual machine could be sysprepped and then used as an image for future host pool virtual machines by creating virtual machines from the image, adding the registration token to the registry and then booting the virtual machine. When the virtual machine boots, the Remote Desktop Host Agent service will start and automatically register.
       1. Open Regedit and navigate to the following registry key: ```[HKEY_LOCAL_MACHINE\SOFTWARE\Microsoft\RDInfraAgent]```
       1. Right-click the **RegistrationToken** value and select **Modify…**
       1. Copy the token string from the file that was copied to the virtual machine in step 1 and paste the string into the **Value data** field, then select **OK**.
       1. Launch **services.msc**.
       1. Restart the Remote Desktop Host Agent service (this is not the same as the RdAgent service).
3. Verify that the session host was successfully added to Windows Virtual Desktop by checking that the following registry value has been set on the session host.
    ```PowerShell
    [HKEY_LOCAL_MACHINE\SOFTWARE\Microsoft\RDInfraAgent]
    IsRegistered = 1
    ```
4. (Optional) You can verify that all virtual machines have been successfully registered with Windows Virtual Desktop and added to the host pool by running the following PowerShell cmdlet.

    ```PowerShell
    Get-RdsSessionHost <tenantname> <hostpoolname>
    ```

### Install the Windows Virtual Desktop side-by-side stack on the virtual machine (used only for reverse connect)

>[!NOTE]
>You may choose to get forward connect working first using the built-in RDP stack and then install the side-by-side stack and switch to reverse connect.

1. Copy and paste **Microsoft.RDInfra.StackSxS.Installer-x64.msi** onto the virtual machine.
2. Install the Side-by-Side stack one of the following two ways.
   1. Alternative 1: Use the command line. For the full set of msiexec command-line switches, see [Command-line options](<https://msdn.microsoft.com/library/windows/desktop/aa367988(v=vs.85).aspx>).
      1. Run a PowerShell or CMD window as administrator.
      1. Run the following cmdlet:

          ```PowerShell
          msiexec.exe /i “<full path>\Microsoft.RDInfra.StackSxS.Installer-x64.msi”  /quiet /qn
          ```

         In this case, ```<full path>``` is the location of the MSI on the virtual machine.
   1. Alternative 2: Use the installer’s GUI.
      1. Select the msi to run the graphical user interface.
      1. Select **Next**, **Install**, and then **Finish**.
3. Restart the virtual machine after installing the side-by-side stack.
4. Run the following PowerShell cmdlet to change the host pool to use reverse connect.

 ```PowerShell
 Set-RdsHostPool <tenantname> <hostpoolname> -UseReverseConnect 1
 ```

You must have the RDSH role installed on each session host virtual machine before you install the side-by-side stack. If you install the side-by-side stack without the RDSH, you could potentially lose all forward connectivity to the virtual machine. If you've already installed the Side-by-Side stack without the RDSH, follow these steps to safely uninstall the stack before reinstalling with RDSH:

1. Install [PSExec](https://docs.microsoft.com/sysinternals/downloads/psexec) on any machine that is the same network group as the virtual machine having issues.
1. Start the command prompt as admin and run the following commands:

    ```CMD
    psexec.exe \\<VMName> cmd
    wmic product get name
    wmic product where name="Remote Desktop Services Infrastructure Agent" call uninstall
    ```
1. Restart the virtual machine with Azure Portal.

Need help learning how to publish RemoteApps and manage assignments? Check out [Manage app groups for Windows Virtual Desktop](manage-app-groups-for-wvd.md).