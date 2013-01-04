<properties linkid="manage-services-how-to-scale-a-media-service" urlDisplayName="How to scale" pageTitle="How to scale a media service - Windows Azure" metaKeywords="Azure link resource, scaling media service" metaDescription="Learn how to scale a media service in Windows Azure." metaCanonical="" disqusComments="1" umbracoNaviHide="0" />


#How to Scale a Media Service  

<div chunk="../../Shared/Chunks/disclaimer.md" />


On the **Scale** page of the Windows Azure Management Portal, you can specify the number of Encoding Reserved Units and On-Demand Streaming Reserved Units that you would like your account to be provisioned with. 


1. In the [Management Portal](https://manage.windowsazure.com/), click **Media Services**. Then click the name of the media service to open the dashboard.

2. Click **Scale**.

 Your display will look similar to the following one. 


 ![Scale page] (../media/WAMS_Scale.png)

3. To specify the number of reserved units, move the slider on the Scale page. By default, you can specify up to 5 reserved units. If you would like your account to be provisioned with more than 5 reserved units, send email to mediaservices@microsoft.com.

	To use on-demand streaming service, you need to purchase reserved units. Each on-demand streaming reserved unit is equal to 200 mbps. 

	The number of provisioned encoding reserved units is equal to the number of media tasks that can be processed concurrently in a given account. For example, if your account has 5 reserved units, then 5 media tasks will be running concurrently as long as there are tasks to be processed. The remaining tasks will wait in the queue and will get picked up for processing sequentially as soon as a running task finishes. If an account does not have any reserved units provisioned, then tasks will be picked up sequentially. In this case, the wait time between one task finishing and the next one starting will depend on the availability of resources in the system.

	**Note** that the highest number of units specified for the 24-hour period is used in calculating the cost. For information about pricing details, see [Media Services Pricing Details](http://go.microsoft.com/fwlink/?LinkId=275107).



 




