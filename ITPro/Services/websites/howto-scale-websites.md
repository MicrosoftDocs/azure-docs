<properties linkid="manage-scenarios-how-to-scale-websites" urlDisplayName="How to scale" pageTitle="How to scale web sites - Windows Azure service management" metaKeywords="Azure scaling web sites, share web site, reserve web site" metaDescription="Learn how to scale web sites in Windows Azure. Also learn how to use Shared Web Site and Reserved Web Site modes." metaCanonical="" disqusComments="1" umbracoNaviHide="0" />




# How to Scale Web Sites #

<div chunk="../../Shared/Chunks/disclaimer.md" />

You use the Windows Azure (Preview) Management Portal to scale your web sites, and to specify whether you want to run them in Free web site mode, Shared web site mode or Reserved web site mode.  

## Table of Contents ##

- [Free Web Site Mode](#freemode)
- [Shared Web Site Mode](#sharedmode)
- [Reserved Web Site Mode](#reservedmode)
- [How to: Change Scale Options for a Web Site](#howtochangescale)

##<a name="freemode"></a>Free Web Site Mode

When a web site is first created it runs in **Free** web site mode, meaning that it shares available compute resources with other subscribers that are also running web sites in Free or Shared web site mode.

A single instance of a web site configured to run in Free mode will provide somewhat limited performance when compared to other configurations but should still provide sufficient performance to complete development tasks or proof of concept work. 

If a web site that is configured to run in a single instance using Free web site mode is put into production, the resources available to the web site may prove to be inadequate as the average number of client requests increases over time. If the CPU time quota is exceeded for the web site, all web sites in the same subscription are stopped (Web site instances normally unload after going idle for 20 minutes). The web sites are started again at the next quota interval. 


Before putting a web site into production, estimate the load that the web site will be expected to handle and consider scaling up / scaling out the web site by changing configuration options available on the web site's **Scale** management page.

<strong>Warning</strong><br />Scale options applied to a web site are also applied to all web sites that meet the following conditions:
<ol>
<li>Are configured to run in Shared or Reserved web site mode.</li>
<li>Exist in the same region as the web site for which scale options are modified.</li>
</ol>
For this reason it is recommended that you configure any  "proof of concept” web sites to run in Free web site mode or create the web sites in a different region than web sites you plan to scale up or scale out.

##<a name="sharedmode"></a>Shared Web Site Mode

A web site that is configured as or updated to **Shared** mode uses a low-cost scaling mode that provides more performance than **Free** mode. Changing to **Shared** mode is easily done in the **Scale** tab of the management portal. These changes take only seconds to apply, and do not require code to be changed or the application to be redeployed.

A web site in **Shared** mode is deployed in the same multi-tenant environment as one in **Free** mode, but has no quotas or upper limit to the amount of bandwidth it can serve. The first 5 GB of bandwidth served on a **Shared** web site is free; subsequent bandwidth is charged at the standard "pay-as-you-go" rate for outbound bandwidth.

A web site running in **Shared** mode also now supports the ability to receive mapping for multiple custom DNS domain names, using both CNAME and A-records. Using A-records allows web sites to be accessed using only the domain name (e.g. http://microsoft.com in addition to http://www.microsoft.com). In the future, SNI-based SSL will also be available for web sites running in **Shared** mode.
 
##<a name="reservedmode"></a>Reserved Web Site Mode

A web site that is configured as **Reserved** will provide more consistent performance than a web site that is configured as **Free** or **Shared**. 

When you configure a web site as Reserved, you specify the size of the web site (**Small**, **Medium** or **Large**). A web site that is configured with a larger **Reserved Instance Size** will perform better under load. 

You also specify a value for **Reserved Instance Count** (from 1 to 3).
Increasing the value for **Reserved Instance Count** will provide fault tolerance and improved performance through scale out.

Before switching a web site from **Free** web site mode to **Reserved** web site mode you must first remove spending caps in place for your Web Site subscription.


##<a name="howtochangescale"></a>How to: Change Scale Options for a Web Site
A web site that is configured to run in **Free** or **Shared** web site mode has access to the resources associated with an **ExtraSmall** Virtual Machine Size described in the table at [How to: Configure Virtual Machine Sizes][configvmsizes]. 

To change scale options for a web site, in the Management Portal open the web site's **Scale** management page to configure the following scaling options:

- **Web Site Mode** - Set to **Free** by default.  When you change the **Web Site Mode** from **Free** or **Shared** to **Reserved**, the web site is scaled up to run in a Small compute instance on a single dedicated core with access to additional memory, disk space and bandwidth. For more information, see [How to: Configure Virtual Machine Sizes][configvmsizes]. 

- **Reserved Instance Size** - Provides options for additional scale up of a web site running in **Reserved** web site mode. If **Reserved Instance Size** is changed from **Small** to **Medium** or **Large**, the web site will run in a compute instance of corresponding size with access to associated resources for each size. For more information, see [How to: Configure Virtual Machine Sizes][configvmsizes].

- **Reserved/Shared Instance Count** - Increase this value to provide fault tolerance and improved performance through scale out by running additional web site instances. 

Note that as you increase the value for **Shared Instance Count** you also increase the possibility of exceeding the resources allocated to each Web Site subscription for running web sites in Shared web site mode. The resources allocated for this purpose are evaluated on a resource usage per day basis. For more information about resource usage quotas see [How to Monitor Web Sites](/en-us/manage/services/web-sites/how-to-monitor-websites/). 


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
