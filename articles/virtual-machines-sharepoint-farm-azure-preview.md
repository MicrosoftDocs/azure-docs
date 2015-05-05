<properties 
	pageTitle="SharePoint Server Farm" 
	description="Describes the new SharePoint Server Farm feature available in the Azure Preview Portal" 
	services="virtual-machines" 
	documentationCenter="" 
	authors="JoeDavies-MSFT" 
	manager="timlt" 
	editor=""/>

<tags 
	ms.service="virtual-machines" 
	ms.workload="infrastructure-services" 
	ms.tgt_pltfrm="vm-sharepoint" 
	ms.devlang="na" 
	ms.topic="article" 
	ms.date="04/09/2015" 
	ms.author="josephd"/>

# SharePoint Server Farm

With SharePoint Server Farm, the Microsoft Azure Preview Portal automatically creates a pre-configured SharePoint Server 2013 farm for you. This can save you a lot of time when you need a basic or high-availability SharePoint farm for a development and testing environment or if you are evaluating SharePoint Server 2013 as a collaboration solution for your organization.

The basic SharePoint farm consists of three virtual machines in this configuration.

![sharepointfarm](./media/virtual-machines-sharepoint-farm-azure-preview/SPFarm_Basic.png)

You can use this farm configuration for a simplified setup for SharePoint app development or your first-time evaluation of SharePoint 2013.

The high-availability SharePoint farm consists of nine virtual machines in this configuration.

![sharepointfarm](./media/virtual-machines-sharepoint-farm-azure-preview/SPFarm_HighAvail.png)

You can use this farm configuration to test higher client loads, high availability of the external SharePoint site, and SQL Server AlwaysOn for a SharePoint farm. You can also use this configuration for SharePoint app development in a high-availability environment.
 
For the configuration details of both of these farms, see [SharePoint Server Farm Configuration Details](virtual-machines-sharepoint-farm-config-azure-preview.md).

## Stepping through configuration
 
To create your SharePoint farm with the SharePoint Server Farm template, do the following:

1. In the [Microsoft Azure Preview Portal](https://portal.azure.com/), click  **New** > **Compute** > **SharePoint Server Farm**.
2. In the **Create a SharePoint farm** pane, type the name of a resource group.
3. Type a user name and password for a local administrator account on each virtual machine in your farm. Choose a name and password that is difficult to guess, record it, and store it in a secure location.
4. If you want the high-availability farm, click **Enable high availability**.
5. To configure your domain controllers, click the arrow. You can specify a host name prefix (the default is the resource group name), forest root domain name (default is contoso.com), and the size of your domain controllers (default is A1).
6. To configure your SQL servers, click the arrow. You can specify a host name prefix (the default is the resource group name), the size of your SQL servers (default is A5), a database access account name and password (the default is to use the administrator account), and a SQL server service account name (the default is sqlservice) and password (the default is to use the same password as the administrator account).
7. To configure your SharePoint servers, click the arrow. You can specify a host name prefix (the default is the resource group name), the size of your SharePoint servers (default is A2), a SharePoint user account (the default is sp_setup) and password, a SharePoint farm account name (the default is sp_farm) and password, and a SharePoint farm passphrase. The default is to use the administrator password for the SharePoint user account, farm account, and passphrase.
8. To configure optional configuration (the virtual network, storage account, diagnostics), click the arrow.
9. To specify the subscription, click the arrow.
10. When you are done, click **Create**.

> [AZURE.NOTE] The domain controller does not have the Active Directory Management tools installed by default. To install them, run the **Install-WindowsFeature AD-Domain-Services -IncludeManagementTools** command from an administrator-level Windows PowerShell command prompt on the domain controller virtual machine.

## Accessing and managing the SharePoint farms

The SharePoint farms have a pre-configured endpoint to allow unauthenticated web traffic (TCP port 80) to the SharePoint web server for an Internet-connected client computer. This endpoint is to a pre-configured team site. To access this team site:

1.	From the Azure Preview Portal, click **Browse**, and then click **Resource Groups**. 
2.	In the list of resource groups, click the name of your SharePoint farm resource group.
3.	In the pane for your SharePoint farm resource group, click **Deployment history**. 
4.	In the **Deployment history** pane, click **Microsoft.SharePointFarm**.
5.	In the **Microsoft.SharePointFarm** pane, select the URL in the SHAREPOINTSITEURL field and copy it. 
6.	From your Internet browser, paste the URL into the address field.
7.	When prompted, enter the user account credentials that you specified when you created the farm.

From the Central Administration SharePoint site, you can configure My sites, SharePoint applications, and other functionality. For more information, see [Configure SharePoint 2013](http://technet.microsoft.com/library/ee836142.aspx). To access the Central Administration SharePoint site:

1.	From the Azure Preview Portal, click **Browse**, and then click **Resource Groups**. 
2.	In the list of resource groups, click the name of your SharePoint farm resource group.
3.	In the pane for your SharePoint farm resource group, click **Deployment history**. 
4.	In the **Deployment history** pane, click **Microsoft.SharePointFarm**.
5.	In the **Microsoft.SharePointFarm** pane, select the URL in the SHAREPOINTCENTRALADMINURL field and copy it. 
6.	From your Internet browser, paste the URL into the address field.
7.	When prompted, enter the user account credentials that you specified when you created the farm.


Notes:

- The Azure Preview Portal creates these virtual machines within your subscription.
- The Azure Preview Portal creates both of these farms in a cloud-only virtual network with an Internet-facing web presence. There is no site-to-site VPN connection back to your organization network. 
- You can administer these servers through Remote Desktop connections. For more information, see [How to Log on to a Virtual Machine Running Windows Server](virtual-machines-log-on-windows-server.md).


## Azure Resource Manager

SharePoint Server Farm uses the Azure Resource Manager and scripts to automatically create the infrastructure and the server configurations for these SharePoint farms. For more information, see [Using Windows PowerShell with Resource Manager](powershell-azure-resource-manager.md).

## Additional Resources

[SharePoint on Azure Infrastructure Services](http://msdn.microsoft.com/library/azure/dn275955.aspx)

[SharePoint Server Farm Configuration Details](virtual-machines-sharepoint-farm-config-azure-preview.md)

[Set up a SharePoint intranet farm in a hybrid cloud for testing](virtual-networks-setup-sharepoint-hybrid-cloud-testing.md)
