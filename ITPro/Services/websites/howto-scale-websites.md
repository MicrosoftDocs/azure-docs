<properties linkid="manage-scenarios-how-to-scale-websites" urlDisplayName="How to scale" pageTitle="How to scale web sites - Windows Azure service management" metaKeywords="Azure scaling web sites, share web site, reserve web site" metaDescription="Learn how to scale web sites in Windows Azure. Also learn how to use Shared Web Site and Reserved Web Site modes." metaCanonical="" disqusComments="1" umbracoNaviHide="0" />




# How to Scale Websites #

<div chunk="../../Shared/Chunks/disclaimer.md" />

You use the Windows Azure (Preview) Management Portal to scale your websites, and to specify whether you want to run them in Free website mode, Shared website mode or Reserved website mode.  

## Table of Contents ##

- [Free Website Mode](#freemode)
- [Shared Website Mode](#sharedmode)
- [Reserved Website Mode](#reservedmode)
- [How to: Change Scale Options for a Website](#howtochangescale)

##<a name="freemode"></a>Free Website Mode

When a website is first created it runs in **Free** website mode, meaning that it shares available compute resources with other subscribers that are also running websites in Free or Shared website mode.

A single instance of a website configured to run in Free mode will provide somewhat limited performance when compared to other configurations but should still provide sufficient performance to complete development tasks or proof of concept work. 

If a website that is configured to run in a single instance using Free website mode is put into production, the resources available to the website may prove to be inadequate as the average number of client requests increases over time. If the CPU time quota is exceeded for the website, all websites in the same subscription are stopped (Website instances normally unload after going idle for 20 minutes). The websites are started again at the next quota interval. 


Before putting a website into production, estimate the load that the website will be expected to handle and consider scaling up / scaling out the website by changing configuration options available on the website's **Scale** management page.

<strong>Warning</strong><br />Scale options applied to a website are also applied to all websites that meet the following conditions:
<ol>
<li>Are configured to run in Shared or Reserved website mode.</li>
<li>Exist in the same region as the website for which scale options are modified.</li>
</ol>
For this reason it is recommended that you configure any  "proof of concept” websites to run in Free website mode or create the websites in a different region than websites you plan to scale up or scale out.

##<a name="sharedmode"></a>Shared Website Mode

A website that is configured as or updated to **Shared** mode uses a low-cost scaling mode that provides more performance than **Free** mode. Changing to **Shared** mode is easily done in the **Scale** tab of the management portal. These changes take only seconds to apply, and do not require code to be changed or the application to be redeployed.

A website in **Shared** mode is deployed in the same multi-tenant environment as one in **Free** mode, but has no quotas or upper limit to the amount of bandwidth it can serve. The first 5 GB of bandwidth served on a **Shared** website is free; subsequent bandwidth is charged at the standard "pay-as-you-go" rate for outbound bandwidth.

A website running in **Shared** mode also now supports the ability to receive mapping for multiple custom DNS domain names, using both CNAME and A-records. Using A-records allows websites to be accessed using only the domain name (e.g. http://microsoft.com in addition to http://www.microsoft.com). In the future, SNI-based SSL will also be available for websites running in **Shared** mode.
 
##<a name="reservedmode"></a>Reserved Website Mode

A website that is configured as **Reserved** will provide more consistent performance than a website that is configured as **Free** or **Shared**. 

When you configure a website as Reserved, you specify the size of the website (**Small**, **Medium** or **Large**). A website that is configured with a larger **Reserved Instance Size** will perform better under load. 

You also specify a value for **Reserved Instance Count** (from 1 to 3).
Increasing the value for **Reserved Instance Count** will provide fault tolerance and improved performance through scale out.

Before switching a website from **Free** website mode to **Reserved** website mode you must first remove spending caps in place for your Web Site subscription.


##<a name="howtochangescale"></a>How to: Change Scale Options for a Website
A website that is configured to run in **Free** or **Shared** website mode has access to the resources associated with an **ExtraSmall** Virtual Machine Size described in the table at [How to: Configure Virtual Machine Sizes][configvmsizes]. 

To change scale options for a Website, in the Management Portal open the website's **Scale** management page to configure the following scaling options:

- **WebSite Mode** - Set to **Free** by default.  When you change the **WebSite Mode** from **Free** or **Shared** to **Reserved**, the website is scaled up to run in a Small compute instance on a single dedicated core with access to additional memory, disk space and bandwidth. For more information, see [How to: Configure Virtual Machine Sizes][configvmsizes]. 

- **Reserved Instance Size** - Provides options for additional scale up of a website running in **Reserved** website mode. If **Reserved Instance Size** is changed from **Small** to **Medium** or **Large**, the website will run in a compute instance of corresponding size with access to associated resources for each size. For more information, see [How to: Configure Virtual Machine Sizes][configvmsizes].

- **Reserved/Shared Instance Count** - Increase this value to provide fault tolerance and improved performance through scale out by running additional website instances. 

Note that as you increase the value for **Shared Instance Count** you also increase the possibility of exceeding the resources allocated to each Web Site subscription for running websites in Shared website mode. The resources allocated for this purpose are evaluated on a resource usage per day basis. For more information about resource usage quotas see [How to Monitor Websites](/en-us/manage/services/web-sites/how-to-monitor-websites/). 


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
