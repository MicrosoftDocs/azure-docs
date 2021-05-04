---
title: Create Azure NetApp files Windows Virtual Desktop - Azure
description: This article describes how to create an Azure NetApp file in Windows Virtual Desktop.
author: Heidilohr
ms.topic: how-to
ms.date: 05/03/2021
ms.author: helohr
manager: femila
---

# Create an Azure NetApp file in Windows Virtual Desktop

<!--Publishing this file will require retiring create-fslogix-profile-container.md and azure-netapp-files-register.md-->

This article describes how to set up Azure NetApp files for MSIX app attach in Windows Virtual Desktop.

## Requirements

To set up an Azure NetApp file, you'll need the following things:

- An Azure account with contributor or administrator access

- A virtual machine (VM) or physical machine joined to Active Directory Domain Services (AD DS), and permissions to access it

- A Windows Virtual Desktop host pool in which all session hosts have been domain joined. Each session host must be in the same region as the region you create your Azure NetApp files in. The following regions are supported for Azure NetApp files: Australia East, Australia Southeast, Canada Central, Canada East, Central India, Central US, East US, East US 2, Germany North, Germany West Central, Japan East, Japan West, North Europe, South Central US, South India, Southeast Asia, UAE Central, UK South, UK West, West Europe, West US, or West US 2.

- You will need to create new session hosts if they are not in one of the regions listed above

Process overview
----------------

1.  Confirm Azure NetApp Files is available in the region of your session hosts.

2.  Submit a waitlist request for accessing the service

3.  Register the NetApp Resource Provider

4.  Set up your Azure NetApp Files account

5.  Create a capacity pool

6.  Join an Active Directory connection

7.  Create a new volume

8.  Verify connection to Azure NetApp Files share

## Submit a waitlist request to access the service

1. Submit a waitlist request for accessing the Azure NetApp Files service through the Azure NetApp Files waitlist submission page. Please note that waitlist sign up does not guarantee immediate service access.

2. Wait for an official confirmation email from the Azure NetApp Files team before continuing.

## Register the NetApp resource provider

1. Open the Azure portal and select the Azure Cloud shell icon to the right of the search bar:

![](media/fb65f02acf591aa29d1040a285d423f4.png)

1. Switch to PowerShell mode if it defaults to bash.

2. If you have multiple subscriptions on your account, select the subscription that has been approved for Azure NetApp Files with the following command:

    ```azcopy
    az account set --subscription <subscription id>
    ```

1.  Register the NetApp resource provider with the following command:
    
    ```azcopy
    az provider register --namespace Microsoft.NetApp --wait
    ```

2.  Navigate to the **Subscriptions** tab in the Azure portal and select your subscription.

3.  In the settings tab, select **Resource Providers** to verify that the Microsoft.NetApp provider shows as registered:

![](media/2c5a0fdc781cb716066bf937c8a326f5.png)

Set up your Azure NetApp Files account
--------------------------------------

1.  In the Azure portal, search for **Azure NetApp Files** and select the **Add** button.

2.  When the **New NetApp Account** page opens, enter the following values:

    - For **Name**, enter what you want your NetApp account name to be.
    - For **Subscription**, select the subscription that you registered with the Microsoft.NetApp provider.
    - For **Resource group**, select an existing resource group from the drop-down menu or create a new one by selecting **Create new**.
    - For **Location**, select your region for the NetApp account from the drop-down menu. As mentioned in the pre-requisites, this region must be in the same region as your session host VMs.

3.  When you’re finished, select **Create** to create your NetApp account.

## Create a capacity pool

To create a capacity pool:

1.  Go to the Azure NetApp Files menu and select your new account.

2.  In your account menu, select **Capacity Pool** under Storage service.

3.  Select **Add pool.**

4.  When the **New capacity pool** tab opens, enter the following values:

    - For **Name**, enter a name for the new capacity pool.
    - For **Service level**, select your desired value from the drop-down menu. We recommend **Premium** for most environments.
      
      >[!NOTE]
      >The Premium setting provides the minimum throughput available for a Premium Service level, which is 256 MBps. You may need to adjust this throughput for a production environment.

    - For **Size (TiB)**, enter the capacity pool size that best fits your needs. The minimum size is 4 TiB.

5.  When you’re finished, select **OK**.

## Join an Active Directory connection

To join an Active Directory (AD) connection:

1. Navigate back to your NetApp account and select **Active Directory connections** under Azure NetApp Files.

2. Select the **Join** button to open the **Join Active Directory** page.

![](media/205366115dcaaee5490938468d7e938e.png)

1. Enter the following values in the **Join Active Directory** page to join a connection:

    - For **Primary DNS**, enter the IP address of the DNS server in your environment that can resolve the domain name.
    - For **Domain**, enter your fully qualified domain name (FQDN).
    - For **SMB Server (Computer Account) Prefix**, enter the string you want to append to the Computer account name.
    - For **Username**, enter the UPN of your AD admin.
    - For **Password**, enter the account’s password.

## Create a new volume

To create a new volume:

1. Navigate back to your NetApp account and select **Volumes** under Storage service.

2. When the **Create a Volume** tab opens, enter the following values:

    - For **Volume name**, enter a name for the new volume.

    - For **Capacity pool**, select the capacity pool you just created from the drop-down menu.

    - For **Quote (GiB)**, enter the volume size that best fits your needs. The minimum size is 100 GiB.

    - For **Virtual network**, select an existing virtual network that has connectivity to the domain controller from the drop-down menu.

    - Under **Subnet,** select **Create new**. Keep in mind that this subnet will be delegated to Azure NetApp Files. Only one subnet per virtual network can be delegated to Azure NetApp Files. If for some reason you need to create a second subnet for Azure NetApp Files, you will have to create a new virtual network and connect it to your existing virtual network through a virtual network peering.

3. Select **Next: Protocol \>** to open the Protocol tab and configure your volume access parameters. Enter the following values:

    - For **Protocol Type**, select **SMB**.

    - For **Active Directory**, select the same directory that you originally connected in the Join an Active Directory connection section.

    - For **Share name**, enter the name of the share used by the session host pool and its users. This value must be unique within the subscription.

    - Select **Review + create** at the bottom of the page, which will open the validation page. After your volume is validated successfully, select **Create**.

4. At this point, the new volume will start to deploy. Once deployment is complete, you can now start using your Azure NetApp Files share.

5. To see the mount path, select **Go to resource** and look for it in the **Overview** tab. You can also find additional details for mounting by selecting **Mount instructions** under Storage service. Copy the **Mount path** to your clipboard as you will need this in the next section.

## Verify connection to Azure NetApp file share

To make sure you're connected to the Azure NetApp file share:

1. Open Windows Virtual Desktop and connect to the VM or physical machine joined to AD DS.

2. Open **File Explorer** and select **Network**.

3. Go to the **Mount path** and verify that you are able to connect to the network. In the example below, the **Mount path** is \\\\netapp1-3671.jushiahwvdtest.onmicrosoft.com\\testing1.

![](media/4df7e7bc9de16006c35b685e18c3d965.png)

## Upload an MSIX image to the Azure NetApp file share

1. In each session host, install the certificate that you signed the MSIX package with. For the certificate store, make sure to put it in **Trusted People**.

2. In File Explorer, navigate again to the Mount path and copy/paste the MSIX Image that you want to add into the Azure NetApps Files share.

3. The MSIX image is now uploaded to the Azure NetApp Files share and is accessible by your session hosts when adding a MSIX Package through the Azure Portal UI or Powershell.
