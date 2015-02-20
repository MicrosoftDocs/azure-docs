<tags 
   pageTitle="Configure Traffic Manager monitoring"
   description="How to configure Traffic Manager monitoring"
   services="traffic-manager"
   manager="adinah"
   editor="tysonn" />
<tags 
   ms.service="traffic-manager"
   ms.topic="article"
   ms.tgt_pltfrm="na"
   ms.date="02/20/2015"
   ms.author="cherylmc" />

# Configure Traffic Manager Monitoring


Azure Traffic Manager can monitor your endpoints, which include cloud services and websites, to ensure they are available. In order for monitoring to work correctly, you must set it up the same way for every endpoint that you specify in your profile settings. For more information about monitoring, see 
[About Traffic Manager Monitoring](../about-traffic-manager-monitoring).

## Protocol and port

Protocol and port settings are configured in the Management Portal under monitoring settings. The available settings are:

-**Protocol** - Choose HTTP or HTTPS. Note that https monitoring does not verify that your SSL certificate is valid. It only checks whether the certificate is present.

-**Port** – Choose the port used for the request. The default ports are 80 for HTTP and 443 for HTTPS.

When you are finished making your configuration changes, click **Save** at the bottom of the page.

## Relative path and file name


You may choose to monitor “/”, in which case Traffic Manager will try to access the default directory of the endpoints in the profile to ensure that they are available. However, you can configure Traffic Manager to monitor a specific path and file name. This involves configuration, both in Traffic Manager, and for your endpoints.

### To configure monitoring for a specific path and file name


1-Create a file with the same name on each endpoint you plan to include in your profile.


2-For each endpoint, use a web browser to test access to the file. The URL consists of the domain name of the specific endpoint (the cloud service or website), the path to the file, and the file name.



3-In the Management Portal, under **Monitoring Settings**, in the **Relative Path and File Name** field, specify the path and file name.



4-When you are finished making your configuration changes, click **Save** at the bottom of the page.



## See Also

[Traffic Manager Configuration Tasks](https://msdn.microsoft.com/en-us/library/azure/hh744830.aspx)

[Traffic Manager Overview](../traffic-manager-overview)