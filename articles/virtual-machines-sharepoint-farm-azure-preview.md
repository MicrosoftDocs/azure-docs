<properties title="SharePoint Farm" pageTitle="SharePoint Farm" description="Describes the new SharePoint farm feature available in the Azure Preview Portal" metaKeywords="" services="virtual-machines" solutions="" documentationCenter="" authors="josephd" videoId="" scriptId="" />

#SharePoint Farm#

With SharePoint Farm, the Microsoft Azure Preview Portal automatically creates a pre-configured SharePoint Server 2013 farm for you. This can save you a lot of time when you need a basic or high-availability SharePoint farm for a development and testing environment or if you are evaluating SharePoint Server 2013 as a collaboration solution for your organization.

The basic SharePoint farm consists of three virtual machines in the following configuration:

![sharepointfarm](./media/virtual-machines-sharepoint-farm-azure-preview/SPFarm_Basic.png)

You can use this farm configuration for a simplified setup for SharePoint app development or your first-time evaluation of SharePoint 2013.

The high-availability SharePoint farm consists of nine virtual machines in the following configuration:

![sharepointfarm](./media/virtual-machines-sharepoint-farm-azure-preview/SPFarm_HighAvail.png)

You can use this farm configuration to test higher client loads, high-availability of the external SharePoint site, and SQL Server AlwaysOn for a SharePoint farm. You can also use this configuration for SharePoint app development in a highly available environment.
 
For the configuration details of both of these farms, see [SharePoint Farm Configurations](../virtual-machines-sharepoint-farm-config-azure-preview/).

These farms have a pre-configured endpoint to allow authenticated web traffic (TCP port 80) to the SharePoint web server through an Internet-connected client computer.

These farms have a team site already built, which you can access from the URL of the Domain Name (cloud service) for the web servers of the farm. From the Central Administration SharePoint site, you can configure My sites, SharePoint applications, and other functionality. For more information, see [Configure SharePoint 2013](http://technet.microsoft.com/library/ee836142.aspx).

Notes:

- The Azure Preview Portal creates these virtual machines within your subscription.
- The Azure Preview Portal creates both of these farms in a cloud-only virtual network with an Internet-facing web presence. There is no site-to-site VPN connection back to your organization network. 
- You can administer these servers through remote desktop connections.

##Stepping through configuration##

To create your SharePoint farm with SharePoint Farm, do the following:

1. In the [Microsoft Azure Preview Portal](https://portal.azure.com/), click  **Virtual Machines** > **SharePoint Farm**.
2. In the **Create SharePoint Farm** pane, type the name of a resource group.
3. Type a user name and password for a local administrator account on each virtual machine in your farm. Choose a name and password that is difficult to guess.
4. If you want the high-availability farm, click **Enable high-availability**.
5. To configure your domain controllers, click the arrow. You can specify a host name prefix, forest root domain name (default is contoso.com), and the size of your domain controllers (default is A1).
6. To configure your SQL servers, click the arrow. You can specify a host name prefix, the size of your SQL servers (default is A5), a database access account name and password, and a SQL server service account name and password.
7. To configure your SharePoint servers, click the arrow. You can specify a host name prefix, the size of your SharePoint servers (default is A3), a SharePoint farm account name and password, and a SharePoint farm passphrase.
8. To configure your virtual network or storage account, click the arrows.
9. To specify the subscription, click the arrow.
10. To specify the location (region), click the arrow.
11. When you are done, click **Create**.

##Azure Resource Manager##

SharePoint Farm uses the Azure Resource Manager and scripts to automatically create the infrastructure and the server configurations for these SharePoint farms. For more information, see [Using Windows PowerShell with Resource Manager](http://azure.microsoft.com/en-us/documentation/articles/powershell-azure-resource-manager/).

