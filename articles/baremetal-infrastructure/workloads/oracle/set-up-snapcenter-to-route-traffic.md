---
title: Set up SnapCenter to route traffic from Azure to Oracle BareMetal servers
description: Learn how to set up NetApp SnapCenter to route traffic from Azure to Oracle BareMetal Infrastructure servers.
ms.topic: how-to
ms.subservice: baremetal-oracle
ms.date: 05/05/2021
---


# Set up NetApp SnapCenter to route traffic from Azure to Oracle BareMetal servers

In this article, we'll walk through setting up NetApp SnapCenter to route traffic from Azure to Oracle BareMetal Infrastructure servers. 

## Prerequisites

> [!div class="checklist"]
> - **SnapCenter Server system requirements:** Azure Windows 2019 or newer with 4-vCPU, 16-GB RAM, and a minimum of 500 GB managed premium SSD storage.
> - **ExpressRoute networking requirements:** A SnapCenter user for Oracle BareMetal must work with Microsoft Operations to create the networking accounts to enable communication between your personal storage virtual machine (VM) and the SnapCenter VM in Azure.
> - **Java 1.8 on BareMetal instances:** The SnapCenter plugins require Java 1.8 installed on the BareMetal instances.

## Steps to integrate SnapCenter

Here are the steps you'll need to complete to set up NetApp SnapCenter to route traffic from Azure to Oracle BareMetal Infrastructure servers: 

1. Raise a support ticket request to communicate the user-generated public key to the Microsoft Ops team. Support is required to set up the SnapCenter user for access to the storage system. 

2. Create a VM in your Azure Virtual Network (VNet) that has access to your BareMetal instances; this VM is used for SnapCenter. 

3. Download and install SnapCenter. 

4. Backup and recovery operations. 

>[!NOTE]
> These steps assume that you've already created an ExpressRoute connection between your subscription in Azure and your tenant in Oracle HaaS.

## Create a support ticket for user-role storage setup

1. Open the Azure portal and navigate to the Subscriptions page. Select your BareMetal subscription.
2. On your BareMetal subscription page, select **Resource Groups**.
3. Select an appropriate resource group in a region.
    
    :::image type="content" source="media/netapp-snapcenter-integration-oracle-baremetal/select-resource-group.png" alt-text="Screenshot showing resource groups on the subscription page.":::

4. Select a SKU entry corresponding to SAP HANA on Azure storage. 

    :::image type="content" source="media/netapp-snapcenter-integration-oracle-baremetal/select-sku.png" alt-text="Screenshot of a resource group showing a SKU highlighted of type SAP HANA on Azure.":::

5. Select **New support request**.

6. On the **Basics** tab, provide the following information for the ticket:
    - **Issue type**: Technical
    -	**Subscription**: Your subscription
    -	**Service**: BareMetal Infrastructure
    -	**Resource**: Your resource group
    -	**Summary**: SnapCenter access setup
    -	**Problem type**: Configuration and Setup
    -	**Problem subtype**: Set up SnapCenter

7. In the **Description** of the support ticket, on the **Details** tab, paste the contents of a *.pem file in the text box for more details. You can also zip a *.pem file and upload it. snapcenter.pem will be your public key for SnapCenter user. Use the following example to create a *.pem file from one of your BareMetal instances. 

    :::image type="content" source="media/netapp-snapcenter-integration-oracle-baremetal/pem.png" alt-text="Screenshot showing sample contents of a .pem file.":::

    >[!NOTE]
    >The name of the file "snapcenter" is the username required to make REST API calls. So we recommend that you make the file name descriptive.

8.	Select **Review + create** to review your support ticket.

9.	Once the public key certificate is submitted, Microsoft sets up the SnapCenter username for your tenant along with the storage virtual machine (SVM) IP address. Microsoft will give you the SVM IP.

10.	After you receive the SVM IP, set a password to access the SVM, which you control.

    The following is an example of the REST CALL from a HANA Large Instance or a VM in the virtual network that has access to the HANA Large Instance environment and will be used to set the password.
    
    :::image type="content" source="media/netapp-snapcenter-integration-oracle-baremetal/sample-rest-call.png" alt-text="Screenshot showing sample REST call.":::

11.	Make sure there isn't a proxy variable active on the BareMetal instance used in creating the *.pem file.

     :::image type="content" source="media/netapp-snapcenter-integration-oracle-baremetal/ensure-no-proxy.png" alt-text="Screenshot showing unset http proxy to ensure there is no proxy variable active on BareMetal instance in creating *.pem file.":::

12. From the client machine, it's now possible to execute commands without a username/password for enabled REST commands. Test the connection: 

    No proxy:

    :::image type="content" source="media/netapp-snapcenter-integration-oracle-baremetal/connection-test.png" alt-text="Screenshot showing test of connection and enabled REST commands without username/password.":::


       >[!NOTE]
       > Either curl command can have "--verbose" added to provide further details on why a command was not successful.

## Install SnapCenter

1. On the provisioned Windows VM, browse to the [NetApp website](https://mysupport.netapp.com/site/products/all/details/snapcenter/downloads-tab).

2. Sign in and download SnapCenter. Download > SnapCenter > Select **Version 4.4**.

3. Install SnapCenter 4.4. Select **Next**.

    The installer will check the prerequisites of the VM. Please note the size of the VM, especially in larger environments. It's okay to continue installing even though a restart may be pending.

4. Configure the user credentials for SnapCenter. By Default, it populates with the Windows user who launched the application for installation. Unless there is a port conflict, we recommended using the default ports.

    The installation wizard will take some time to complete and show progress.
 
5. Once installation is complete, select **Finish**.  Take note of the web address for the SnapCenter web portal.  It can also be reached by double-clicking the SnapCenter icon that will appear on the desktop after installation is complete.
 
## Disable enhanced messaging service (EMS) messages to NetApp auto support

EMS data collection is enabled by default and runs every seven days after your installation date. You can disable data collection at any time.

1. From a PowerShell command line, establish a session with SnapCenter:

   ```powershell-interactive
   Open-SmConnection
   ```

2. Sign in with your credentials.

3. Disable EMS data collection: 

   ```powershell-interactive
   Disable-SmDataCollectionEms
   ```
   
## Next steps

Learn how to configure SnapCenter:

> [!div class="nextstepaction"]
> [Configure SnapCenter](configure-snapcenter-oracle-baremetal.md)
