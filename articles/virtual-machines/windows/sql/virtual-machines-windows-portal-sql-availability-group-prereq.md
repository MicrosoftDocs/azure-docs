---
title: SQL Server Availability Groups - Azure Virtual Machines - Prereq | Microsoft Docs 
description: "This tutorial shows how to configure the prerequisites for creating a SQL Server Always On Availability Group in Azure VMs."
services: virtual-machines
documentationCenter: na
authors: MikeRayMSFT
manager: jhubbard
editor: monicar
tags: azure-service-management

ms.assetid: c492db4c-3faa-4645-849f-5a1a663be55a
ms.service: virtual-machines-sql
ms.devlang: na
ms.custom: na
ms.topic: article
ms.tgt_pltfrm: vm-windows-sql-server
ms.workload: iaas-sql-server
ms.date: 03/17/2017
ms.author: mikeray

---

# Complete prerequisites for creating Always On Availability Groups in Azure Virtual Machines

This tutorial shows how to complete the prerequisites to create a [SQL Server Always On Availability Group on Azure Virtual Machines](virtual-machines-windows-portal-sql-availability-group-tutorial.md). When the prerequisites are completed, you have a domain controller, two SQL Servers, and a witness server in a single resource group.

**Time estimate**: It may take a couple of hours to complete the prerequisites. Much of this time is spent creating virtual machines.

The diagram illustrates what you build in the tutorial.

![Availability Group](./media/virtual-machines-windows-portal-sql-availability-group-tutorial/00-EndstateSampleNoELB.png)

## Review Availability Group documentation

The tutorial assumes you have a basic understanding of SQL Server Always On Availability Groups. If you are not familiar with this technology, see [Overview of Always On Availability Groups (SQL Server)](http://msdn.microsoft.com/library/ff877884.aspx).


## Create an Azure account
* You need an Azure account. You can [open a free Azure account](/pricing/free-trial/?WT.mc_id=A261C142F) or [Activate Visual Studio subscriber benefits](/pricing/member-offers/msdn-benefits-details/?WT.mc_id=A261C142F). 

## Create resource group
1. Sign in to the [Azure portal](http://portal.azure.com). 
2. Click **+** to create a new object in the portal.

   ![New](./media/virtual-machines-windows-portal-sql-availability-group-tutorial/01-portalplus.png)

1. Type **resource group** in the **Marketplace** search window.
   
   ![Resource Group](./media/virtual-machines-windows-portal-sql-availability-group-tutorial/01-resourcegroupsymbol.png)
1. Click **Resource group**.
4. Click **Create**. 
5. In the **Resource group** blade, under **Resource group name** type a name for the resource group. For example, type **sql-ha-rg**.
6. If you have multiple Azure subscriptions, verify that the subscription is the Azure subscription you want to create the availability group in. 
7. Select a location. The location is the Azure region where you want to create the availability group. For this tutorial, we are going to build all resources in one Azure location. 
8. Verify **Pin to dashboard** is checked. This optional setting places a shortcut for the resource group on the Azure portal dashboard.

   ![Resource Group](./media/virtual-machines-windows-portal-sql-availability-group-tutorial/01-resourcegroup.png)

9. Click **Create** to create the resource group.

Azure creates the resource group and pins a shortcut to the resource group in the portal.

## Create network and subnets
The next step is to create the networks and subnets in the Azure resource group.

The solution uses one virtual network with two subnets. The [Virtual Network Overview](../../../virtual-network/virtual-networks-overview.md) provides more information about networks in Azure.

To create the virtual network:

1. On the Azure portal in your resource group, click **+ Add**. Azure opens the **Everything** blade. 
   
   ![New Item](./media/virtual-machines-windows-portal-sql-availability-group-tutorial/02-newiteminrg.png)
2. Search for **virtual network**.
   
     ![Search Virtual Network](./media/virtual-machines-windows-portal-sql-availability-group-tutorial/04-findvirtualnetwork.png)
3. Click **Virtual network**.
4. In the **Virtual network** blade, click the **Resource Manager** deployment model and click **Create**.
   
   The following table shows the settings for the virtual network:
   
   | **Field** | Value |
   | --- | --- |
   | **Name** |autoHAVNET |
   | **Address space** |10.33.0.0/24 |
   | **Subnet name** |Admin |
   | **Subnet address range** |10.33.0.0/29 |
   | **Subscription** |Specify the subscription that you intend to use. **Subscription** is blank if you only have one subscription. |
   | **Location** |Specify the Azure location. |
   
   Your address space and subnet address range may be different from the table. Depending on your subscription, the portal suggests an available address space and corresponding subnet address range. If no sufficient address space is available, use a different subscription. 

   The example uses the subnet name **Admin**. This subnet is for the domain controllers. 

6. Click **Create**.
   
   ![Configure Virtual Network](./media/virtual-machines-windows-portal-sql-availability-group-tutorial/06-configurevirtualnetwork.png)

Azure returns you to the portal dashboard and notifies you when the new network is created.

### Create a second subnet
The new virtual network has one subnet, named **Admin**. The domain controllers use this subnet. The SQL Servers use a second subnet named **SQL**. To configure this subnet:

1. On your dashboard, click the resource group that you created, **SQL-HA-RG**. Locate the network in the resource group under **Resources**.
   
    If **SQL-HA-RG** is not visible, find it by clicking **Resource Groups** and filtering by the resource group name.
2. Click **autoHAVNET** on the list of resources. Azure opens the network configuration blade.
3. On **autoHAVNET** virtual network, click **All settings.**
4. On the **Settings** blade, click **Subnets**.
   
    Notice the subnet that you already created. 
   
   ![Configure Virtual Network](./media/virtual-machines-windows-portal-sql-availability-group-tutorial/07-addsubnet.png)
5. Create a second subnet. Click **+ Subnet**. 
6. In the **Add Subnet** blade, configure the subnet by typing **sqlsubnet** under **Name**. Azure automatically specifies a valid **Address range**. Verify that this address range has at least 10 addresses in it. In a production environment, you may require more addresses. 
7. Click **OK**.
   
    ![Configure Virtual Network](./media/virtual-machines-windows-portal-sql-availability-group-tutorial/08-configuresubnet.png)

The following table summarizes the network configuration settings:

| **Field** | Value |
| --- | --- |
| **Name** |**autoHAVNET** |
| **Address space** |Depends on available address spaces in your subscription. A typical value is 10.0.0.0/16 |
| **Subnet name** |**admin** |
| **Subnet address range** |Depends on available address ranges in your subscription. A typical value is 10.0.0.0/24. |
| **Subnet name** |**sqlsubnet** |
| **Subnet address range** |Depends on available address ranges in your subscription. A typical value is 10.0.1.0/24. |
| **Subscription** |Specify the subscription that you intend to use. |
| **Resource Group** |**SQL-HA-RG** |
| **Location** |Specify the same location that you chose for the resource group. |

## Create availability sets

Before creating virtual machines, you need to create availability sets. Availability sets reduce downtime for planned or unplanned maintenance events. An Azure availability set is a logical group of resources that Azure places on physical fault domains and update domains. A fault domain ensures that the members of the availability set have separate power and network resources. An update domain ensures that members of the availability set are not brought down for maintenance at the same time. [Manage the availability of virtual machines](../../virtual-machines-windows-manage-availability.md?toc=%2fazure%2fvirtual-machines%2fwindows%2ftoc.json).

You need two availability sets. One is for the domain controllers. The second is for the SQL Servers.

To create an availability set, go to the resource group and click **Add**. Filter the results by typing **availability Set**. Click **Availability Set** in the results. Click **Create**.

Configure two availability sets according to the parameters in the following table:

| **Field** | Domain Controller availability Set | SQL Server availability Set |
| --- | --- | --- |
| **Name** |adavailabilityset |sqlavailabilityset |
| **Resource group** |SQL-HA-RG |SQL-HA-RG |
| **Fault domains** |3 |3 |
| **Update domains** |5 |3 |

After you create the availability sets, return to the resource group in the Azure portal.

## Create domain controllers
After you have created the network, subnets, availability sets, and an internet facing load balancer. You are ready to create the virtual machines for the domain controllers.

### Create the virtual machines for the domain controllers
To create and configure the domain controllers, return to the **SQL-HA-RG** resource group.

1. Click Add. The **Everything** blade opens.
2. Type **Windows Server 2016 Datacenter**. 
3. Click **Windows Server 2016 Datacenter**. In the **Windows Server 2016 Datacenter** blade, verify that the deployment model is **Resource Manager** and click **Create**. Azure opens the **Create virtual machine** blade. 

Repeat the steps preceding steps to create two virtual machines. Name the two virtual machines:

* ad-primary-dc
* ad-secondary-dc
  
  > [!NOTE]
  > **ad-secondary-dc** is an optional component to provide high availability for Active Directory domain services. 
  > 
  > 

The following table shows the settings for these two machines:

| **Field** | Value |
| --- | --- |
| **VM disk type** |SSD |
| **User name** |DomainAdmin |
| **Password** |Contoso!0000 |
| **Subscription** |*your subscription* |
| **Resource group** |SQL-HA-RG |
| **Location** |*your location* |
| **Size** |DS1_V2 |
| **Storage account** |*Automatically created* |
| **Virtual network** |autoHAVNET |
| **Subnet** |admin |
| **Public IP address** |*Same name as the VM* |
| **Network Security Group** |*Same name as the VM* |
| **Availability set** |adavailabilityset |
| **Diagnostics** |Enabled |
| **Diagnostics storage account** |*Automatically created* |


   >[!IMPORTANT]
   >You can only place a VM in an availability set when you create it. You cannot change the availability set after a VM is created. See [Manage the availability of virtual machines](../../virtual-machines-windows-manage-availability.md).

Azure creates the virtual machines.

After the virtual machines are created, configure the domain controller.

### Configure the domain controller
In the following steps, configure the **ad-primary-dc** machine as a domain controller for corp.contoso.com.

1. In the portal, open the **SQL-HA-RG** resource group and select the **ad-primary-dc** machine. On the **ad-primary-dc** blade, click **Connect** to open an RDP file for remote desktop access.
   
    ![Connect to Virtual Machine](./media/virtual-machines-windows-portal-sql-availability-group-tutorial/20-connectrdp.png)
2. Log in with your configured administrator account (**\DomainAdmin**) and password (**Contoso!0000**).
3. By default, the **Server Manager** dashboard should be displayed.
4. Click the **Add roles and features** link on the dashboard.
   
    ![Server Explorer Add Roles](./media/virtual-machines-windows-portal-sql-availability-group-tutorial/22-addfeatures.png)
5. Select **Next** until you get to the **Server Roles** section.
6. Select the **Active Directory Domain Services** and **DNS Server** roles. When prompted, add any additional features required by these roles.
   
   > [!NOTE]
   > Windows warns you that there is no static IP address. If you are testing the configuration, click continue. For production scenarios, set the IP address to static in the Azure portal or [use PowerShell to set the static IP address of the domain controller machine](../../../virtual-network/virtual-networks-reserved-private-ip.md).
   > 
   > 
   
    ![Add Roles Dialog](./media/virtual-machines-windows-portal-sql-availability-group-tutorial/23-addroles.png)
7. Click **Next** until you reach the **Confirmation** section. Select the **Restart the destination server automatically if required** checkbox.
8. Click **Install**.
9. After the features finish installing, return to the **Server Manager** dashboard.
10. Select the new **AD DS** option on the left-hand pane.
11. Click the **More** link on the yellow warning bar.
    
    ![AD DS dialog on DNS Server VM](./media/virtual-machines-windows-portal-sql-availability-group-tutorial/24-addsmore.png)
12. In the **Action** column of the **All Server Task Details** dialog, click **Promote this server to a domain controller**.
13. In the **Active Directory Domain Services Configuration Wizard**, use the following values:
    
    | **Page** | Setting |
    | --- | --- |
    | **Deployment Configuration** |**Add a new forest**<br/> **Root domain name** = corp.contoso.com |
    | **Domain Controller Options** |**DSRM Password** = Contoso!0000<br/>**Confirm Password** = Contoso!0000 |
14. Click **Next** to go through the other pages in the wizard. On the **Prerequisites Check** page, verify that you see the following message: **All prerequisite checks passed successfully**. Review any applicable warning messages, but it is possible to continue with the install.
15. Click **Install**. The **ad-primary-dc** virtual machine automatically reboots.

### Note IP Address of primary domain controller

Use the primary domain controller for DNS. Note the primary domain controller IP address.

One way to get the primary domain controller IP address is through the Azure portal. 

1. On the Azure portal, open the resource group. 

1. Click the primary domain controller.

1. In the primary domain controller blade, click **Network interfaces**.

![New Item](./media/virtual-machines-windows-portal-sql-availability-group-tutorial/25-primarydcip.png)

Note the private IP address for this server. 

### Configure the second domain controller
After the primary domain controller reboots, you can configure the second domain controller. This optional step is for high availability. Follow these steps to configure the second domain controller:

1. In the portal, open the **SQL-HA-RG** resource group and select the **ad-secondary-dc** machine. On the **ad-secondary-dc** blade, click **Connect** to open an RDP file for remote desktop access.
4. Log in to the VM using your configured administrator account (**BUILTIN\DomainAdmin**) and password (**Contoso!0000**).
3. Change the preferred DNS server address to the address of the domain controller. 
1. In **Network and Sharing Center**, click the network interface. 
   ![NetworkInterface](./media/virtual-machines-windows-portal-sql-availability-group-tutorial/26-networkinterface.png)

5. Click **Properties**.
10. Select **Internet Protocol Version 4 (TCP/IPv4)** and click Properties.
11. Select **Use the following DNS server addresses** and specify the address of the primary domain controller in **Preferred DNS server**.
1. Click **OK** and then **Close** to commit the changes. You are now able to join the VM to **corp.contoso.com**.

   >[!IMPORTANT]
   >If you lose the connection to your remote desktop after changing the DNS setting, go to the Azure portal and restart the virtual machine.

1. From the remote desktop to the secondary domain controller, open **Server Manager Dashboard**.
4. Click the **Add roles and features** link on the dashboard.
   
    ![Server Explorer Add Roles](./media/virtual-machines-windows-portal-sql-availability-group-tutorial/22-addfeatures.png)
5. Select **Next** until you get to the **Server Roles** section.
6. Select the **Active Directory Domain Services** and **DNS Server** roles. When prompted, add any additional features required by these roles.

9. After the features finish installing, return to the **Server Manager** dashboard.
10. Select the new **AD DS** option on the left-hand pane.
11. Click the **More** link on the yellow warning bar.
12. In the **Action** column of the **All Server Task Details** dialog, click **Promote this server to a domain controller**.
1. Under **Deployment Configuration**, select **Add a domain controller to an existing domain**. 
   ![NetworkInterface](./media/virtual-machines-windows-portal-sql-availability-group-tutorial/28-deploymentconfig.png)

1. Click **Select...**.
1. Connect using the administrator account (**CORP.CONTOSO.COM\domainadmin**) and password (**Contoso!0000**).
1. On **Select a domain from the forest**, click your domain, and click **OK**. 

1. On **Domain Controller Options**, use the default values and set a DSRM password.

   >[!NOTE]
   >The **DNS Options** page may warn you that a delegation for this DNS server cannot be created. You can ignore this warning in non-production environments. 
1. Click **Next** until the dialog reaches the **Prerequisites** check. Then click **Install**.

After the server completes the configuration changes, restart the server. 

### <a name=DomainAccounts></a> Configure Domain Accounts

The next steps configure the Active Directory (AD) accounts. The following table shows the accounts:

| |Installation Account<br/> |sqlserver-0 <br/>SQL Server and SQL Agent Service Account |sqlserver-1<br/>SQL Server and SQL Agent Service Account
| --- | --- | --- | --- 
|**First Name** |Install |SQLSvc1 | SQLSvc2
|**User SamAccountName** |Install |SQLSvc1 | SQLSvc2

Use the following steps to create each account. 

1. Log back in to the **ad-primary-dc** machine.
2. In **Server Manager**, select **Tools**, and then click **Active Directory Administrative Center**.   
3. Select **corp (local)** from the left pane.
4. On the right **Tasks** pane, select **New** and then click **User**. 
   ![Active Directory Administrative Center](./media/virtual-machines-windows-portal-sql-availability-group-tutorial/29-addcnewuser.png)

   >[!TIP]
   >Set a complex password for each account.<br/> For non-production environments, set the user account to never expire.

5. Click **OK** to create the user. 
6. Repeat the preceding steps for each of the three accounts. 

### Grant required permissions to the installation account
1. In the **Active Directory Administrative Center**, select **corp (local)** in the left pane. Then in the right-hand **Tasks** pane, click **Properties**.
   
    ![CORP User Properties](./media/virtual-machines-windows-portal-sql-availability-group-tutorial/31-addcproperties.png)
8. Select **Extensions**, and then click the **Advanced** button on the **Security** tab.
9. On the **Advanced Security Settings for corp** dialog. Click **Add**.
10. Click **Select a principal**. Then search for **CORP\Install**. Click **OK**.
11. Check the **Read all properties**.

1. Check **Create Computer objects**.
    
     ![Corp User Permissions](./media/virtual-machines-windows-portal-sql-availability-group-tutorial/33-addpermissions.png)
12. Click **OK**, and then click **OK** again. Close the corp properties window.

Now that you have finished configuring Active Directory and the user objects, create two SQL Server VMs, a witness server VM. Then join all three to the domain.

## Create SQL Servers
### Create and configure the SQL Server VMs
Next, create three VMs, including two SQL Server VMs, and a VM for the an additional cluster node. To create each of the VMs, go back to **SQL-HA-RG** resource group, click **Add**, search for the appropriate gallery item, **Virtual Machine**, and then **From Gallery**. Use the information in the following table to help you create the VMs:

| Page | VM1 | VM2 | VM3 |
| --- | --- | --- | --- |
| Select the appropriate gallery item |**Windows Server 2016 Datacenter** |**SQL Server 2016 SP1 Enterprise on Windows Server 2016** |**SQL Server 2016 SP1 Enterprise on Windows Server 2016** |
| Virtual machine configuration **Basics** |**Name** = cluster-fsw<br/>**User Name** = DomainAdmin<br/>**Password** = Contoso!0000<br/>**Subscription** = Your subscription<br/>**Resource group** = SQL-HA-RG<br/>**Location** = Your azure location |**Name** = sqlserver-0<br/>**User Name** = DomainAdmin<br/>**Password** = Contoso!0000<br/>**Subscription** = Your subscription<br/>**Resource group** = SQL-HA-RG<br/>**Location** = Your azure location |**Name** = sqlserver-1<br/>**User Name** = DomainAdmin<br/>**Password** = Contoso!0000<br/>**Subscription** = Your subscription<br/>**Resource group** = SQL-HA-RG<br/>**Location** = Your azure location |
| Virtual machine configuration **Size** |DS1\_V2 (1 core, 3.5 GB) |**SIZE** = DS2\_V2 (2 cores, 7 GB) |**SIZE** = DS2\_V2 (2 cores, 7 GB) |
| Virtual machine configuration **Settings** |**Storage** = Premium (SSD)<br/>**NETWORK SUBNETS** = autoHAVNET<br/>**STORAGE ACCOUNT** = Use an automatically generated storage account<br/>**Subnet** = sqlsubnet(10.1.1.0/24)<br/>**Public IP address** = None<br/>**Network security group** = None<br/>**Monitoring Diagnostics** = Enabled<br/>**Diagnostics storage account** = Use an automatically generated storage account<br/>**AVAILABILITY SET** = sqlAvailabilitySet<br/> |**Storage** = Premium (SSD)<br/>**NETWORK SUBNETS** = autoHAVNET<br/>**STORAGE ACCOUNT** = Use an automatically generated storage account<br/>**Subnet** = sqlsubnet(10.1.1.0/24)<br/>**Public IP address** = None<br/>**Network security group** = None<br/>**Monitoring Diagnostics** = Enabled<br/>**Diagnostics storage account** = Use an automatically generated storage account<br/>**AVAILABILITY SET** = sqlAvailabilitySet<br/> |**Storage** = Premium (SSD)<br/>**NETWORK SUBNETS** = autoHAVNET<br/>**STORAGE ACCOUNT** = Use an automatically generated storage account<br/>**Subnet** = sqlsubnet(10.1.1.0/24)<br/>**Public IP address** = None<br/>**Network security group** = None<br/>**Monitoring Diagnostics** = Enabled<br/>**Diagnostics storage account** = Use an automatically generated storage account<br/>**AVAILABILITY SET** = sqlAvailabilitySet<br/> |
| Virtual machine configuration **SQL Server settings** |Not applicable |**SQL connectivity** = Private (within Virtual Network)<br/>**Port** = 1433<br/>**SQL Authentication** = Disable<br/>**Storage configuration** = General<br/>**Automated patching** = Sunday at 2:00<br/>**Automated backup** = Disabled</br>**Azure Key Vault integration** = Disabled |**SQL connectivity** = Private (within Virtual Network)<br/>**Port** = 1433<br/>**SQL Authentication** = Disable<br/>**Storage configuration** = General<br/>**Automated patching** = Sunday at 2:00<br/>**Automated backup** = Disabled</br>**Azure Key Vault integration** = Disabled |

<br/>

> [!NOTE]
> The machine sizes suggested here are meant for testing availability groups in Azure VMs. For the best performance on production workloads, see the recommendations for SQL Server machine sizes and configuration in [Performance best practices for SQL Server in Azure Virtual Machines](virtual-machines-windows-sql-performance.md?toc=%2fazure%2fvirtual-machines%2fwindows%2ftoc.json).
> 
> 

Once the three VMs are fully provisioned, you need to join them to the **corp.contoso.com** domain and grant CORP\Install administrative rights to the machines.

### Set DNS On each server
First, change the preferred DNS server address for each member server. Follow these steps:

1. In the portal, open the **SQL-HA-RG** resource group and select the **sqlserver-0** machine. On the **sqlserver-0** blade, click **Connect** to open an RDP file for remote desktop access.
2. Log in with your configured administrator account (**\DomainAdmin**) and password (**Contoso!0000**).
3. By default, the **Server Manager** dashboard should be displayed. Click **Local Server** in the left pane.
5. Select the **IPv4 address assigned by DHCP, IPv6 enabled** link.
6. In the **Network Connections** window, select the network icon.
7. On the command bar, click **Change the settings of this connection**. If you do not see this option, click the double-right arrow.
8. Select **Internet Protocol Version 4 (TCP/IPv4)** and click Properties.
9. Select **Use the following DNS server addresses** and specify the address of the primary domain controller in **Preferred DNS server**.
   >[!TIP]
   >To get the IP address of the server use `nslookup`.<br/>
   >From the command prompt type `nslookup ad-primary-dc`. 
11. Click **OK** and then **Close** to commit the changes. 

   >[!IMPORTANT]
   >If you lose the connection to your remote desktop after changing the DNS setting, go to the Azure portal and restart the virtual machine.

Repeat these steps for all servers.

### <a name="joinDomain"></a>Join the servers to the domain.

You are now able to join the VM to **corp.contoso.com**. Do the following for both SQL Servers and the file share witness server: 

1. Remotely connect to the virtual machine with **BUILTIN\DomainAdmin**. 
1. In **Server Manager**, click **Local Server**
1. Click the **WORKGROUP** link.
1. In the **Computer Name** section, click **Change**.
1. Select the **Domain** check box and type **corp.contoso.com** in the text box. Click **OK**.
1. In the **Windows Security** popup dialog, specify the credentials for the default domain administrator account (**CORP\DomainAdmin**) and the password (**Contoso!0000**).
1. When you see the "Welcome to the corp.contoso.com domain" message, click **OK**.
1. Click **Close**, and then click **Restart Now** in the popup dialog.



### Add the Corp\Install user as an administrator on each cluster VM:

After each virtual machine restarts as a member of the domain, add **CORP\Install** as a member of the local administrators group. 

1. Wait until the VM is restarted, then launch the RDP file again from the primary domain controller to log in to **sqlserver-0** using the **CORP\DomainAdmin** account.
   >[!TIP]
   >Make sure you log in with the domain administrator account. In the previous steps you were using the BUILT IN administrator account. Now that the server is in the domain, use the domain account. In your RDP session, specify *DOMAIN*\\*username*.

2. In **Server Manager**, select **Tools**, and then click **Computer Management**.
3. In the **Computer Management** window, expand **Local Users and Groups**, and then select **Groups**.
4. Double-click the **Administrators** group.
5. In the **Administrators Properties** dialog, click the **Add** button.
6. Enter the user **CORP\Install**, and then click **OK**. 
7. Click **OK** to close the **Administrator Properties** dialog.
8. Repeat the above steps on **sqlserver-1**, and **cluster-fsw**.

### <a name="setServiceAccount"></a>Set the SQL Server Service Accounts

On each SQL Server, set the SQL Server service account. Use the accounts that you created when you [configured the domain accounts](#DomainAccounts).

1. Open **SQL Server Configuration Manager**.

1. Right-click the SQL Server service, and click **Properties**.

1. Set the account and password. 

1. Repeat these steps on the other SQL Server.  

For SQL Server Availability Groups, each SQL Server needs to run as a domain account. 

### Create Login on Each SQL Server for Installation Account

Use the installation account to configure the availability group. This account needs to be a member of the **sysadmin** fixed server role on each SQL Server. The following steps create a login for the installation account:

1. RDP into the server using the *\<MachineName\>\DomainAdmin* account.

1. Open SQL Server Management Studio and connect to the local instance of SQL Server. 

1. In **Object Explorer**, click **Security**.

1. Right-click **Logins**. Click **New Login...**.

1. In **Login - New**, click **Search...**.

1. Click **Locations...**.

1. Enter the domain administrator network credentials. 

1. Use the installation account.

1. Set the login to be a member of the **sysadmin** fixed server role. 

1. Click OK. 

Repeat the preceding steps on the other SQL Server. 

## Add Failover Cluster Features to both SQL Servers

To add the failover cluster features, do the following steps on both SQL Servers:

1. From the remote desktop to the secondary domain controller, open **Server Manager Dashboard**.
4. Click the **Add roles and features** link on the dashboard.
   
    ![Server Explorer Add Roles](./media/virtual-machines-windows-portal-sql-availability-group-tutorial/22-addfeatures.png)
5. Select **Next** until you get to the **Server Features** section.
1. In **Features**, select **Failover Clustering**. 
1. Add additional required features. 
1. Click Install to add all the features.

Repeat the steps on the other SQL Server. 


## <a name="endpoint-firewall"> Configure the firewall on each SQL Server

The solution requires the following TCP ports to be open in the firewall:

- **SQL Server**<br/>
   Port 1433 for a default instance of SQL Server. 
- **Azure Load Balancer Probe**<br/>
   Any available port. Examples frequently use 59999.
- **Database mirroring endpoint** <br/>
   Any available port. Examples frequently use 5022. 

The firewall ports need to be open on both SQL Servers.

The way to open the ports depends on the firewall solution you use. The next section explains how to open the ports on the Windows Firewall. Open the required ports each of your SQL Servers. 

### Open a TCP Port on a firewall 

1. On the first SQL Server **Start** screen, launch **Windows Firewall with Advanced Security**.

2. In the left pane, select **Inbound Rules**. On the right pane, click **New Rule**.

3. For **Rule Type**, choose **Port**.

1. For the port, specify TCP and type the appropriate port numbers. See the following example:

   ![SQLFirewall](./media/virtual-machines-windows-portal-sql-availability-group-tutorial/35-tcpports.png)

1. Click **Next**. 

5. In the **Action** page, keep **Allow the connection** selected and click **Next**.

6. In the **Profile** page, accept the default settings and click **Next**.

7. In the **Name** page, specify a rule name, such as **Azure LB Probe** in the **Name** text box, then click **Finish**.

Repeat these steps on the second SQL Server in the same way.



## Next steps

* [Create SQL Server Always On Availability Group on Azure Virtual Machines](virtual-machines-windows-portal-sql-availability-group-tutorial.md)
