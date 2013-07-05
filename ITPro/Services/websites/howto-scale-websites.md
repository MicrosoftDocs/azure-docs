<properties linkid="manage-scenarios-how-to-scale-websites" urlDisplayName="How to scale" pageTitle="How to scale web sites - Windows Azure service management" metaKeywords="Azure scaling web sites, share web site, reserve web site" metaDescription="Learn how to scale web sites in Windows Azure. Also learn how to use Shared Web Site and Reserved Web Site modes." metaCanonical="" disqusComments="1" umbracoNaviHide="0" />

<div chunk="../chunks/web-sites-left-nav.md" />

# How to Scale Web Sites #

You use the Windows Azure Management Portal to scale your web sites, and to specify whether you want to run them in **Free** web site mode, **Shared** web site mode or **Standard** web site mode. 

## Table of Contents ##

- [Free Web Site Mode](#freemode)
- [Shared Web Site Mode](#sharedmode)
- [Standard Web Site Mode](#standardmode)
- [How to Change Scale Options for a Web Site](#howtochangescale)

##<a name="freemode"></a>Free Web Site Mode

When a web site is first created it runs in **Free** web site mode, meaning that it shares available compute resources with other subscribers that are also running web sites in **Free** or **Shared** web site mode.

A single instance of a web site configured to run in **Free** mode will provide somewhat limited performance when compared to other configurations but should still provide sufficient performance to complete development tasks or proof of concept work. It is recommended that you configure any  "proof of concept” web sites to run in **Free** mode. You can create up to 10 web sites per region in Free mode.



If a web site that is configured to run in a single instance using **Free** web site mode is put into production, the resources available to the web site may prove to be inadequate as the average number of client requests increases over time. If the CPU time quota is exceeded for the web site, all web sites in the same subscription are stopped (Web site instances normally unload after going idle for 20 minutes). The web sites are started again at the next quota interval. 

Before putting a web site into production, estimate the load that the web site will be expected to handle and consider scaling up / scaling out the web site by changing configuration options available on the web site's **Scale** management page.

##<a name="sharedmode"></a>Shared Web Site Mode

A web site that is configured as or updated to **Shared** mode uses a low-cost scaling mode that provides high availability and more performance than **Free** mode. Changing to **Shared** mode is easily done in the **Scale** tab of the management portal. These changes take only seconds to apply, and do not require code to be changed or the application to be redeployed. You can create up to 100 web sites per region in Shared mode.



A web site in **Shared** mode is deployed in the same multi-tenant environment as one in **Free** mode, but has no quotas or upper limit to the amount of bandwidth it can serve. The first 5 GB of bandwidth served on a **Shared** web site is free; subsequent bandwidth is charged at the standard "pay-as-you-go" rate for outbound bandwidth.

A web site running in **Shared** mode also now supports the ability to receive mapping for multiple custom DNS domain names, using both CNAME and A-records. Using A-records allows web sites to be accessed using only the domain name (e.g. http://microsoft.com in addition to http://www.microsoft.com). If you require custom domain SSL support, you can upgrade to **Standard** mode, which has support for both SNI and IP-based SSL.

A web site running in **Shared** mode benefits from high availability even with a single instance, but you can add up to 6 instances ("scale out") for even greater performance and fault tolerance. For more information, see "How to Change Scale Options for a Web Site" later in this document.
 
##<a name="standardmode"></a>Standard Web Site Mode

A web site that is configured as **Standard** will provide high availability and more consistent performance than a web site that is configured as **Free** or **Shared**.  **Standard** mode also has support for SNI and IP-based SSL certificates for custom domains. Before switching a web site from **Free** web site mode to **Standard** web site mode, you must first remove the spending caps in place for your Web Site subscription. To view or change options for your Windows Azure Web Sites subscription, see [Windows Azure Subscriptions][azuresubscriptions].

In **Standard** mode, you can create up to 500 web sites per region. If you have more than one web site in the same region, you can use the **Choose Sites** feature to decide which of the sites you want to run in Standard mode. 

When you configure a web site as Standard, you can specify the size of the web site (**Small**, **Medium** or **Large**). A web site that is "scaled up" (configured with a larger **Instance Size**) will perform better under load. 

You also specify a value for **Instance Count** (from 1 to 10).
A web site running in **Standard** mode benefits from high availability even with a single instance, but scaling out (that is, increasing the value for **Instance Count**) will provide even greater performance and fault tolerance. 

The **Autoscale** feature, available in Standard mode only, lets you have Windows Azure automatically scale the instance count and instance size depending on load, which makes running your web site more cost effective.


##<a name="howtochangescale"></a>How to Change Scale Options for a Web Site
By default, a web site that is configured to run in **Free** or **Shared** web site mode has access to the resources associated with an **ExtraSmall** Virtual Machine Size described in the table at [Virtual Machine and Cloud Service Sizes for Windows Azure][vmsizes]. 

To change the scaling of resources for a web site, in the Management Portal, open the web site's **Scale** management page to configure the following options:

- **Web Site Mode** - Set to **Free** by default.  When you change the **Web Site Mode** from **Free** or **Shared** to **Standard**, the web site is scaled up to run in a Small compute instance on a single dedicated core with access to additional memory, disk space and bandwidth.

	**Note**: In order to configure Web sites to run in **Standard** mode, you must first remove spending limits associated with your Web sites subscription. To view or change options for your Windows Azure Web Sites subscription, see [Windows Azure Subscriptions][azuresubscriptions].

- **Choose Sites** (Standard mode only) - Choose which web sites in the current region and subscription to run in Standard mode. To run all web sites in the current region and subscription in **Standard** mode, leave the **Select All** checkbox selected.

- **Autoscale** (Standard mode only) - Choose **CPU** to have Windows Azure automatically scale the instance count and instance size depending on load. Enabling **Autoscale** also enables the **Target CPU** option so that you can specify a target range for CPU usage, and modifies the **Instance Count** feature so that you can set the minimum and maximum number of virtual machines to be used for automatic scaling.

	**Note**: When **Autoscale** is enabled, Windows Azure checks the CPU of your web site once every five minutes and adds instances as needed at that point in time. If CPU usage is low, Windows Azure will remove instances once every two hours to ensure that your website remains performant. Generally, putting the minimum instance count at 1 is appropriate. However, if you have sudden usage spikes on your web site, be sure that you have a sufficient minimum number of instances to handle the load. For example, if you have a sudden spike of traffic during the 5 minute interval before Windows Azure checks your CPU usage, your site might not be responsive during that time. If you expect sudden, large amounts of traffic, set the minimum instance count higher to anticipate these bursts. 

- **Instance Size** (Standard mode only) - Provides options for additional scale up of a web site running in **Standard** web site mode. If **Instance Size** is changed from **Small** to **Medium** or **Large**, the web site will run in a compute instance of corresponding size with access to associated resources for each size. For more information, see [Virtual Machine and Cloud Service Sizes for Windows Azure][vmsizes].

- **Instance Count** (Shared and Standard modes only) -  A single instance in **Shared** or **Standard** mode already benefits from high availability, but you can provide even greater throughput and fault tolerance by running additional web site instances (that is, "scaling out"). In **Shared** mode, you can choose from 1 through 6 instances. In **Standard** mode, you can choose from 1 through 10 instances, and if you enable the **Autoscale** feature, you can set the minimum and maximum number of virtual machines to be used for automatic scaling.
	
- **Target CPU** (Standard mode only) - This option appears only when **Autoscale** is enabled. Use the sliders to set the minimum and maximum percent CPU usage that you desire for your web site. Windows Azure will add or remove standard instances to keep CPU usage in this range.

- **Linked Resources** - 
If you have linked a SQL database to your web site, you can scale your database here. Choose **Web** or **Business** depending on the storage capacity that you require. The **Web** edition offers a range of smaller capacities, while the **Business** edition offers a range of larger capacities. For more information, see [Accounts and Billing in Windows Azure SQL Database][SQLaccountsbilling].


[vs2010]:http://go.microsoft.com/fwlink/?LinkId=225683
[msexpressionstudio]:http://go.microsoft.com/fwlink/?LinkID=205116
[mswebmatrix]:http://go.microsoft.com/fwlink/?LinkID=226244
[getgit]:http://go.microsoft.com/fwlink/?LinkId=252533
[azuresdk]:http://go.microsoft.com/fwlink/?LinkId=246928
[gitref]:http://go.microsoft.com/fwlink/?LinkId=246651
[howtoconfiganddownloadlogs]:http://go.microsoft.com/fwlink/?LinkId=252031
[sqldbs]:http://go.microsoft.com/fwlink/?LinkId=246930
[fzilla]:http://go.microsoft.com/fwlink/?LinkId=247914
[vmsizes]:http://go.microsoft.com/fwlink/?LinkId=309169
[webmatrix]:http://go.microsoft.com/fwlink/?LinkId=226244
[SQLaccountsbilling]:http://go.microsoft.com/fwlink/?LinkId=234930
[azuresubscriptions]:http://go.microsoft.com/fwlink/?LinkID=235288
