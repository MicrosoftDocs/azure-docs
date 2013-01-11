<properties linkid="manage-services-how-to-scale-a-media-service" urlDisplayName="How to scale" pageTitle="How to scale a media service - Windows Azure" metaKeywords="Azure link resource, scaling media service" metaDescription="Learn how to scale a media service in Windows Azure." metaCanonical="" disqusComments="1" umbracoNaviHide="0" />


#How to Scale a Media Service  

<div chunk="../../Shared/Chunks/disclaimer.md" />


On the **Scale** page of the Windows Azure Management Portal, you can specify the number of **On-Demand Streaming Reserved Units** and **Encoding Reserved Units** that you would like your account to be provisioned with. 


<h2>On-Demand Streaming Reserved Units</h2>

On-Demand Streaming reserved units provide you with both dedicated egress capacity that can be purchased in increments of 200 Mbps and  additional functionality which currently includes [dynamic packaging capabilities](http://go.microsoft.com/fwlink/?LinkId=276874). By default, on-demand streaming is configured in a shared-instance model for which server resources (for example, compute, egress capacity, etc.) are shared with all other users. To improve an on-demand streaming throughput, it is recommended to purchase On-Demand Streaming reserved units. 

The allocation of any new units of on-demand streaming takes around 20 minutes to complete. 


<h2>Encoding Reserved Units</h2>

The number of provisioned encoding reserved units is equal to the number of media tasks that can be processed concurrently in a given account. For example, if your account has 5 reserved units, then 5 media tasks will be running concurrently as long as there are tasks to be processed. The remaining tasks will wait in the queue and will get picked up for processing sequentially as soon as a running task finishes. If an account does not have any reserved units provisioned, then tasks will be picked up sequentially. In this case, the wait time between one task finishing and the next one starting will depend on the availability of resources in the system.

The new encoding reserved units are allocated almost immediately.


<h2>Reserving Units</h2>

1. In the [Management Portal](https://manage.windowsazure.com/), click **Media Services**. Then click the name of the media service to open the dashboard.

2. Click **Scale**.

 Your display will look similar to the following one. 


 ![Scale page] (../media/WAMS_Scale.png)

3. To specify the number of reserved units, move the slider on the Scale page. By default, you can specify up to 5 reserved units. If you would like your account to be provisioned with more than 5 reserved units, contact [Azure support](http://go.microsoft.com/fwlink/?LinkId=276875). 

	**Note:** The highest number of units specified for the 24-hour period is used in calculating the cost. For information about pricing details, see [Media Services Pricing Details](http://go.microsoft.com/fwlink/?LinkId=275107).

	**Note:** Currently, going from any positive value of on-demand streaming units back to none, can disable on-demand streaming for up to an hour.





 




