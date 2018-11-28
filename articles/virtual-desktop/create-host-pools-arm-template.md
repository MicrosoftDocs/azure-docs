---
title: Create a Windows Virtual Desktop host pool with an ARM template - Azure
description: How to create a host pool in Windows Virtual Desktop with an ARM template.
services: virtual-desktop
author: Heidilohr

ms.service: virtual-desktop
ms.topic: how-to
ms.date: 11/21/2018
ms.author: helohr
---
# Create a host pool with an ARM template

Host pools are a collection of one or more identical virtual machines within Windows Virtual Desktop tenant environments. Each host pool can contain an app group that users can interact with as they would on a physical desktop.

Follow the instructions in this article to complete the end-to-end process of creating a host pool within a Windows Virtual Desktop tenant with an Azure Resource Manager (ARM) template provided by Microsoft. You will create a host pool in Windows Virtual Desktop and a resource group with VMs in an Azure subscription, join those VMs to the AD domain, and register the VMs with Windows Virtual Desktop.

## Create a VM image

See Copy Windows 10 Enterprise multi-session images to your storage account to use a Windows 10 Enterprise multi-session image or see Create a VM image for automated deployment to create your own custom image.

## Run the ARM template for provisioning a new host pool

This section is the same as [Create a host pool with Azure Marketplace](create-host-pools-azure-marketplace.md), only this time you’ll find the template in GitHub.

1. Go to [this GitHub URL](https://github.com/Azure/RDS-Templates/tree/master/wvd-templates/Create%20and%20provision%20WVD%20host%20pool).
2. If deploying in an Enterprise subscription:
    1. Scroll down and select **Deploy to Azure**.
    2. Fill in the fields as described in steps 5–10 of Run the Azure Marketplace offering to provision a new host pool.
3. If deploying in a CSP subscription:
    1. Scroll down and right-click **Deploy to Azure**, then select **Copy Link Location**.
    2. Open a text editor like Notepad and paste the link there.
    3. Right after “https://portal.azure.com/” and before the hashtag (#) insert an at sign (@) followed by the tenant domain name. For example: https://portal.azure.com/@Contoso.onmicrosoft.com#create/...
    4. Sign in to the Azure portal as a user with Admin/Contributor permissions to the CSP subscription.
    5. Paste the link you copied to the text editor into the address bar.
    6. Fill in the fields as described in 5–10 of Run the Azure Marketplace offering to provision a new host pool. The GitHub URL provided in Step 1 will contain the most up-to-date information about the deployment scenarios.

## Create a virtual machine for a host pool using a default image in Azure Gallery

This section describes alternative ways to create individual session hosts and join them to the deployment.

### Create a virtual machine from an Azure Gallery image

To create a virtual machine for the host pool:

1. Sign in to the tenant’s Azure subscription where you want to create the virtual machines for the host pool.
2. Select **+** or **+ Create a resource**.
3. In the Search Everything field, search for and select one of the following:
    1. Windows Server 2016 Datacenter.
    2. A custom image of your creation. (There are currently no images available in Azure Gallery for Windows 10 RS5. Follow the instructions in Prepare a Windows VHD or VHDX to upload to Azure to create a custom image. This will require an Enterprise Azure subscription.)
4. Select **Create**. (We recommend selecting **Resource Manager**.)
5. On the Create virtual machine blades, enter in the required information based on the following examples:
    1. Name: rdsh-x (rdsh-0, rdsh-1, and so on) or win10-x (win10-1, win10-2, and so on).
    2. User name: a local admin user name you will remember.
    3. Password: a local admin password that meets the Azure VM password complexity requirements.
    4. Resource group: the resource group you want to manage your Azure resources. This may be the same resource group as the virtual network or a new resource group.
    5. Size: Your choice. DS1_V2 (SSD) or A1_V2 (HDD) are good for testing.
    6. Select View all to see all VM sizes available.
    7. Virtual Network: Select the virtual network created in Prepare Active Directory for the Windows Virtual Desktop tenant environment.
    8. Public IP address: Leave with default settings, like a public IP. This is only required during setup to connect to the VM, join the AD domain, and register with Windows Virtual Desktop. Once these steps have been completed, you can remove all public IP addresses for the session host VMs.
    9. Network security group (firewall): Create a new network security group (NSG) for the host pool with the default port rules. You can later use this NSG to disable all inbound ports to secure the Windows Virtual Desktop tenant environment.
6. Select **Create** and then **Purchase**. (Deployment takes about 10 minutes.)
7. Repeat steps 3–7 for each VM in the host pool.

### Prepare the session host virtual machine for the domain

Use the following procedure to prepare the VM for the domain if the OS is Windows Server 2012 R2 or Windows Server 2016. If your OS is Windows 10 Enterprise multi-session, follow the instructions in Prepare the session host VM for the domain.

1. Sign in to the VM:
    1. In the Microsoft Azure Portal, open the host pool resource group.
    2. Select the VM and select **Connect** at the top of the VM blade.
    3. Select Download RDP file and Open. Sign on with the local admin account when creating the VM.
2. Join the VM to the Active Directory domain.
    1. Launch the Control Panel and select **System**.
    2. Select **Computer name, Change settings**.
    3. Select **Change…**
    4. Select **Domain**, then enter the Active Directory domain and authenticate with domain admin credentials.
    5. Restart the VM.
3. Install the Remote Desktop Session Host (RDSH) server role.
    1. Sign in to the VM with the local admin or domain account used to join the VM to the domain.
    2. Launch Server Manager, select **Manage**, then select **Add Roles and Features**.
    3. Follow the instructions until you reach the Server Selection page. Select **the name of the machine you’re currently connected to**, then select **Next**.
    4. On the Server Roles page, expand the Remote Desktop Services option, check the box next to Remote Desktop Session Host, select** Add Features**, then select **Next**.
    5. When you reach the Confirmation page, check the box next to **Restart the destination server automatically if required**, then select **Install**.

### Register the VM with the Windows Virtual Desktop host pool in Windows Server 2012 R2 or Windows Server 2016

Use the following procedure to register the VM with the Windows Virtual Desktop host pool if your OS is Windows Server 2012 R2 or Windows Server 2016. If your OS is Windows 10 Enterprise multi-session, follow the instructions in Register the VM with the Windows Virtual Desktop host pool.

You’ll need to download the following packages from the Azure Advisors Yammer Group to manually set up a session host:

- The host agent folder, including RDInfra.RDAgent.Installer.msi
- The host agent loader folder, including RDInfra.RDAgentBootLoader.Installer.msi
- The host protocol folder, including RDInfra.StackSxS.Installer.msi

To manually join session hosts to the Windows Virtual Desktop deployment:

1. Install the Windows Virtual Desktop Agent on the new session host
    1. Copy and paste the RDInfraAgentInstall folder and the file containing the registration token onto the VM.
Note:
Use the registration token file you created in Create new host pool.
    2. Double-click the .msi file from the RDInfraAgentInstall folder to run the GUI.
    3. Select **Next**.
    4. Copy the Registration Token string from the file that was copied to the VM and paste the string into the Registration Token field.
    5. Select **Next**, **Install**, and then **Finish**.
2. Install the Windows Virtual Desktop Boot Loader on the new session host.
    1. Copy and paste the RDAgentBootLoaderInstall folder onto the VM.
    2. Double-click the .msi file from the RDAgentBootLoaderInstall folder to run the GUI.
    3. Follow the installer’s instructions to install the Windows Virtual Desktop Boot Loader.
3. Install the Windows Virtual Desktop side-by-side stack on the new session host.
    1. Copy and paste the RDInfraSxSStackInstall folder onto the VM.
    2. Double-click the .msi file from the RDInfraSxSStackInstall folder to run the GUI.
    3. Follow the installer’s instructions to install the Windows Virtual Desktop side-by-side stack.
