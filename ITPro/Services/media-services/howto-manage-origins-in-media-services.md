<properties linkid="manage-services-how-to-manage-origins-in-a-media-service" urlDisplayName="How to manage origins" pageTitle="How to manage origins in a media service - Windows Azure" metaKeywords="Azure link resource, managing origins in a media service" metaDescription="Learn how to managing origins in a media service in Windows Azure." metaCanonical="" disqusComments="1" umbracoNaviHide="0" writer="juliako" />



<h1><a id="managemediaservicesorigins"></a>How to Manage Origins in a Media Services Account</h1>

Media Services enables you to add multiple streaming origins to your account and to configure the origins. Each Media Services account has at least one streaming origin called **default** associated with it. 


<h2>Adding and Deleting Origins</h2> 

1. In the [Management Portal](https://manage.windowsazure.com/), click **Media Services**. Then, click the name of the media service.
2. Select the ORIGINS page. 
3. Click the ADD or DELETE button at the bottom of the page. Note that the default origin cannot be deleted. 
4. Click the START button to start the origin. 
5. If you want to configure the origin, click the name of the origin. 

 ![Origin page] (../media/media-services-origins-page.png)

<h2>Configuring the Origin</h2>

The CONFIGURE tab enables you to do the following configurations:

1. Set the maximum caching period that will be specified in the cache control header of HTTP responses. This value will not override the maximum cache value that have been set explicitly on the blob content.

2. Specify IP addresses that would be allowed to connect to the published streaming endpoint. If no IP addresses specified, any IP address would be able to connect.

3. Specify configuration for G20 authentication requests from Akami servers.


 ![Configure origin] (../media/media-services-origins-configure.png)

The configuration on this page will only apply to origins that have at least one reserved unit. To reserve the on-demand streaming reserved units, go to the SCALE tab. For detailed information about reserved units, see [Scaling Media Services](http://go.microsoft.com/fwlink/?LinkID=275847&clcid=0x409/).





 




