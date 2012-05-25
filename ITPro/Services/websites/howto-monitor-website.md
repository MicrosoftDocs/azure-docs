<properties umbracoNaviHide="0" pageTitle="How to Monitor Websites" metaKeywords="Windows Azure Websites, Azure deployment, Azure configuration changes, Azure deployment update, Windows Azure .NET deployment, Azure .NET deployment" metaDescription="Learn how to configure Websites in Windows Azure to use a SQL or MySQL database, and learn how to configure diagnostics and download logs." linkid="itpro-windows-howto-configure-websites" urlDisplayName="How to Configure Websites" headerExpose="" footerExpose="" disqusComments="1" />

#<a name="howtomonitor"></a>How to Monitor Websites

Websites provide monitoring functionality via the Monitor management page. The Monitor management page provides performance statistics for a web site as described below.

## Table of Contents ##
- [Website Metrics](#websitemetrics)
- [How to: View Usage Quotas for a Website](#howtoviewusage)
- [Next Steps](#nextsteps)

##<a name="websitemetrics"></a>Website Metrics

From the website’s Management pages in the Windows Azure Portal, click the **Monitor** tab to display the **Monitor** management page. By default the chart on the **Monitor** page displays the same metrics as the chart on the **Dashboard** page. To view additional metrics for the web site click **Add Metrics** at the bottom of the page to display the **Choose Metrics** dialog box. Click to select additional metrics for display on the **Monitor** page. After selecting the metrics that you want to add to the **Monitor** page click the **Ok** checkmark to add them. After adding metrics to the **Monitor** page, click to enable / disable the option box next to each metric to add / remove the metric from the chart at the top of the page.

To remove metrics from the **Monitor** page, select the metric that you want to remove and then click the **Delete Metric** icon at the bottom of the page.

The following list describes the metrics which can be viewed in the chart on the **Monitor** page:

- **CPUTime** – A measure of the web site’s CPU usage.
- **Requests** – A count of client requests to the web site.
- **Data Out** – A measure of data sent by the website to clients.
- **Data In** – A measure of data received by the website from clients.
- **Http Client Errors** – Number of Http “4xx Client Error” messages sent.
- **Http Server Errors** – Number of Http “5xx Server Error” messages sent.
- **Http Successes** – Number of Http “2xx Success” messages sent.
- **Http Redirects** – Number of Http “3xx Redirection” messages sent.
- **Http 401 errors** – Number of Http “401 Unauthorized” messages sent.
- **Http 403 errors** – Number of Http “403 Forbidden” messages sent.
- **Http 404 errors** – Number of Http “404 Not Found” messages sent.
- **Http 406 errors** – Number of Http “406 Not Acceptable” messages sent.


--------------------------------------------------------------------------------



##<a name="howtoviewusage"></a>How to: View Usage Quotas for a Website

Websites can be configured to run in either **Shared** or **Reserved** website mode from the website’s **Scale** management page. Each Azure subscription has access to a pool of resources provided for the purpose of running up to 10 websites in **Shared** website mode. The pool of resources available to each Web Site subscription for this purpose is shared by other websites in the same geo-region that are configured to run in **Shared** website mode. Because these resources are shared for use by other websites, all subscriptions are limited in their use of these resources. Limits applied to a subscription’s use of these resources are expressed as usage quotas listed under the usage overview section of each website’s **Dashboard** management page.

**Note**  
When a website is configured to run in **Reserved** mode it is allocated dedicated resources equivalent to the **Small** (default), **Medium** or **Large** virtual machine sizes in the table at [How to: Configure Virtual Machine Sizes][configvmsizes]. There are no limits to the resources a subscription can use for running websites in **Reserved** mode however the number of **Reserved** mode websites that can be created per subscription is limited to **100**.
 
### Viewing Usage Quotas for Websites Configured for Shared Website Mode ###
To determine the extent that a website is impacting resource usage quotas, follow these steps:

1. Open the website’s **Dashboard** management page.
2. Under the **usage overview** section the usage quotas for **Data Out**, **CPU Time** and **File System Storage** are displayed. The green bar displayed for each resource indicates how much of a subscription’s resource usage quota is being consumed by the current website and the grey bar displayed for each resource indicates how much of a subscription’s resource usage quota is being consumed by all other shared mode websites associated with your Web Site subscription.

Resource usage quotas help prevent overuse of the following resources:

- **Data Out** – a measure of the amount of data sent from websites running in **Shared** mode to their clients in the current quota interval (24 hours).
- **CPU Time** – the amount of CPU time used by websites running in **Shared** mode for the current quota interval.
- **File System Storage** – The amount of file system storage in use by websites running in **Shared** mode.

When a subscription’s usage quotas are exceeded Windows Azure takes action to stop overuse of resources. This is done to prevent any subscriber from exhausting resources to the detriment of other subscribers.

**Note**<br/>
Since Windows Azure calculates resource usage quotas by measuring the resources used by a subscription’s shared mode websites during a 24 hour quota interval, consider the following:

- As the number of websites configured to run in Shared mode is increased, so is the likelihood of exceeding shared mode resource usage quotas.
Consider reducing the number of websites that are configured to run in Shared mode if resource usage quotas are being exceeded.
- Similarly, as the number of instances of any website running in Shared mode is increased, so is the likelihood of exceeding shared mode resource usage quotas.
Consider scaling back additional instances of shared mode websites if resource usage quotas are being exceeded.

Windows Azure takes the following actions if a subscription's resource usage quotas are exceeded in a quota interval (24 hours):

 - **Data Out** – when this quota is exceeded Windows Azure stops all websites for a subscription which are configured to run in **Shared** mode for the remainder of the current quota interval. Windows Azure will start the websites at the beginning of the next quota interval.
 - **CPU Time** – when this quota is exceeded Windows Azure stops all websites for a subscription which are configured to run in **Shared** mode for the remainder of the current quota interval. Windows Azure will start the websites at the beginning of the next quota interval.
 - **File System Storage** – Windows Azure prevents deployment of any websites for a subscription which are configured to run in Shared mode if the deployment will cause the File System Storage usage quota to be exceeded. When the File System Storage resource has grown to the maximum size allowed by its quota, file system storage remains accessible for read operations but all write operations, including those required for normal website activity are blocked. When this occurs you could configure one or more websites running in Shared website mode to run in Reserved website mode and reduce usage of file system storage below the File System Storage usage quota.



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