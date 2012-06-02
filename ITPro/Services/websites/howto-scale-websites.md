<properties umbracoNaviHide="0" pageTitle="How to Scale Website" metaKeywords="Windows Azure Websites, Azure deployment, Azure configuration changes, Azure deployment update, Windows Azure .NET deployment, Azure .NET deployment" metaDescription="Learn how to configure Websites in Windows Azure to use a SQL or MySQL database, and learn how to configure diagnostics and download logs." linkid="itpro-windows-howto-configure-websites" urlDisplayName="How to Configure Websites" headerExpose="" footerExpose="" disqusComments="1" />


# How to Scale Websites #

<div chunk="../../Shared/Chunks/disclaimer.md" />


You use the Windows Azure (Preview) Management Portal to scale your websites, and to specify whether you want to run them in Shared website mode or Reserved website mode.  

## Table of Contents ##

- [Shared Website Mode](#sharedmode)
- [Reserved Website Mode](#reservedmode)
- [How to: Change Scale Options for a Website](#howtochangescale)

##<a name="sharedmode"></a>Shared Website Mode

When a website is first created it runs in **Shared** website mode, meaning that it shares available compute resources with other subscribers that are also running websites in Shared website mode. 

A single instance of a website configured to run in Shared mode will provide somewhat limited performance when compared to other configurations but should still provide sufficient performance to complete development tasks or proof of concept work. 

If a website that is configured to run in a single instance using Shared website mode is put into production, the resources available to the website may prove to be inadequate as the average number of client requests increases over time. 

Before putting a website into production, estimate the load that the website will be expected to handle and consider scaling up / scaling out the website by changing configuration options available on the website's **Scale** management page.

<strong>Warning</strong><br />Scale options applied to a website are also applied to all websites that meet the following conditions:
<ol>
<li>Are configured to run in Reserved website mode.</li>
<li>Exist in the same region as the website for which scale options are modified.</li>
</ol>
For this reason it is recommended that you configure any  "proof of concept” websites to run in Shared website mode or create the websites in a different region than websites you plan to scale up or scale out.
 
##<a name="reservedmode"></a>Reserved Website Mode

A website that is configured as **Reserved** will provide more consistent performance than a website that is configured as **Shared**. 

When you configure a website as Reserved, you specify the size of the website (**Small**, **Medium** or **Large**). A website that is configured with a larger **Reserved Instance Size** will perform better under load. 

You also specify a value for **Reserved Instance Count** (from 1 to 3).
Increasing the value for **Reserved Instance Count** will provide fault tolerance and improved performance through scale out.

Before switching a website from **Shared** website mode to **Reserved** website mode you must first remove spending caps in place for your Web Site subscription.


##<a name="howtochangescale"></a>How to: Change Scale Options for a Website
A website that is configured to run in **Shared** website mode has access to the resources associated with an **ExtraSmall** Virtual Machine Size described in the table at [How to: Configure Virtual Machine Sizes][configvmsizes]. 

To change scale options for a Website, in the Management Portal open the website's **Scale** management page to configure the following scaling options:

- **WebSite Mode** - Set to **Shared** by default.  When you change the **WebSite Mode** from **Shared** to **Reserved** the website is scaled up to run in a Small compute instance on a single dedicated core with access to additional memory, disk space and bandwidth. For more information, see [How to: Configure Virtual Machine Sizes][configvmsizes]. 

- **Reserved Instance Size** - Provides options for additional scale up of a website running in **Reserved** website mode. If **Reserved Instance Size** is changed from **Small** to **Medium** or **Large**, the website will run in a compute instance of corresponding size with access to associated resources for each size. For more information, see [How to: Configure Virtual Machine Sizes][configvmsizes].

- **Reserved/Shared Instance Count** - Increase this value to provide fault tolerance and improved performance through scale out by running additional website instances. 

Note that as you increase the value for **Shared Instance Count** you also increase the possibility of exceeding the resources allocated to each Web Site subscription for running websites in Shared website mode. The resources allocated for this purpose are evaluated on a resource usage per day basis. For more information about resource usage quotas see [How to Monitor Websites](./howto-monitor-websites/). 


[vs2010]:http://go.microsoft.com/fwlink/?LinkId=225683
[msexpressionstudio]:http://go.microsoft.com/fwlink/?LinkID=205116
[mswebmatrix]:http://go.microsoft.com/fwlink/?LinkID=226244
[getgit]:http://go.microsoft.com/fwlink/?LinkId=252533
[azuresdk]:http://go.microsoft.com/fwlink/?LinkId=246928
[gitref]:http://go.microsoft.com/fwlink/?LinkId=246651
[howtoconfiganddownloadlogs]:http://go.microsoft.com/fwlink/?LinkId=252031
[sqldbs]:http://go.microsoft.com/fwlink/?LinkId=246930
[fzilla]:http://go.microsoft.com/fwlink/?LinkId=247914
[configvmsizes]:http://go.microsoft.com/fwlink/?LinkID=236449
[webmatrix]:http://go.microsoft.com/fwlink/?LinkId=226244
