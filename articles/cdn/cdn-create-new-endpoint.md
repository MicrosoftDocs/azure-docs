<properties
	 pageTitle="How to use Azure CDN"
	 description="This topic shows how to enable the Content Delivery Network (CDN) for Azure. The tutorial walks through the creation of a new CDN profile and endpoint."
	 services="cdn"
	 documentationCenter=""
	 authors="camsoper"
	 manager="erikre"
	 editor=""/>
<tags
	 ms.service="cdn"
	 ms.workload="media"
	 ms.tgt_pltfrm="na"
	 ms.devlang="na"
	 ms.topic="get-started-article"
	 ms.date="04/15/2016" 
	 ms.author="casoper"/>

# How to use Azure CDN  

CDN can be enabled in the [Azure Portal](https://portal.azure.com). Several types of integrated Azure origins are supported, including Web Apps, blob storage, and Cloud Services. You can also enable CDN for your Azure Media Services Streaming endpoint.  If your origin is not one of these Azure services, or is hosted elsewhere outside of Azure, you can create a custom origin.  Once you enable a CDN endpoint for your origin, all publicly available objects are eligible for CDN edge caching.

>[AZURE.NOTE] For an introduction to how CDN works, as well as a list of features, see the [CDN Overview](./cdn-overview.md).

## Create a new CDN profile

A CDN profile is a collection of CDN endpoints.  Each profile contains one or more CDN endpoints.  You may wish to use multiple profiles to organize your CDN endpoints by internet domain, web application, or some other criteria.

> [AZURE.NOTE] By default, a single Azure subscription is limited to four CDN profiles. Each CDN profile is limited to ten CDN endpoints.
>
> CDN pricing is applied at the CDN profile level. If you wish to use a mix of Standard and Premium CDN features, you will need multiple CDN profiles.


**To create a new CDN profile**

1. In the [Azure Portal](https://portal.azure.com), in the upper left, click **New**.  In the **New** blade, select **Media + CDN**, then **CDN**.

    The new CDN profile blade appears.

    ![New CDN Profile][new-cdn-profile]

2. Enter a name for your CDN profile.

3. Select a **Pricing tier** or use the default.

4. Select or create a **Resource Group**.  For more information on Resource Groups, see [Azure Resource Manager overview](resource-group-overview/#resource-groups).

5. Select the **Subscription** for this CDN profile.

6. Select a **Location**.  This is the Azure location where your CDN profile information will be stored.  It has no impact on CDN endpoint locations.  It does not need to be the same location as the storage account.

7. Click the **Create** button to create the new profile.

## Create a new CDN endpoint

**To create a new CDN endpoint for your storage account**

1. In the [Azure Portal](https://portal.azure.com), navigate to your CDN profile.  You may have pinned it to the dashboard in the previous step.  If you not, you can find it by clicking **Browse**, then **CDN profiles**, and clicking on the profile you plan to add your endpoint to.

    The CDN profile blade appears.

    ![CDN profile][cdn-profile-settings]

2. Click the **Add Endpoint** button.

    ![Add endpoint button][cdn-new-endpoint-button]

    The **Add an endpoint** blade appears.

    ![Add endpoint blade][cdn-add-endpoint]

3. Enter a **Name** for this CDN endpoint.  This name will be used to access your cached resources at the domain `<endpointname>.azureedge.net`.

4. In the **Origin type** dropdown, select your origin type.

	![CDN origin type](./media/cdn-create-new-endpoint/cdn-origin-type.png)

5. In the **Origin hostname** dropdown, select or type your origin domain.  The dropdown will list all available origins of the type you specified in step 4.  If you selected *Custom origin* as your **Origin type**, you will type in the domain of your custom origin.

6. In the **Origin path** text box, enter the path to the resources you want to cache, or leave blank to allow cache any resource at the domain you specified in step 5.

7. In the **Origin host header**, enter the host header you want the CDN to send with each request, or leave the default.

8. For **Protocol** and **Origin port**, specify the protocols and ports used to access your resources at the origin.  Your clients will continue to use these same protocols and ports when they access resources on the CDN.  At least one protocol (HTTP or HTTPS) must be selected.
	
	> [AZURE.TIP] Accessing CDN content using HTTPS has the following constraints:
	> 
	> - You must use SSL the certificate provided by the CDN. Third party certificates are not supported.
	> - You must use the CDN-provided domain (`<identifier>.azureedge.net`) to access HTTPS content. HTTPS support is not available for custom domain names (CNAMEs) since the CDN does not support custom certificates at this time.

9. Click the **Add** button to create the new endpoint.

10. Once the endpoint is created, it appears in a list of endpoints for the profile. The list view shows the URL to use to access cached content, as well as the origin domain.

    ![CDN endpoint][cdn-endpoint-success]

    > [AZURE.NOTE] The endpoint will not immediately be available for use.  It can take up to 90 minutes for the registration to propagate through the CDN network. Users who try to use the CDN domain name immediately may receive status code 404 until the content is available via the CDN.

##See Also
- [Controlling caching behavior of requests with query strings](cdn-query-string.md)
- [How to Map CDN Content to a Custom Domain](cdn-map-content-to-custom-domain.md)
- [Pre-load assets on an Azure CDN endpoint](cdn-preload-endpoint.md)
- [Purge an Azure CDN Endpoint](cdn-purge-endpoint.md)

[new-cdn-profile]: ./media/cdn-create-new-endpoint/cdn-new-profile.png
[cdn-profile-settings]: ./media/cdn-create-new-endpoint/cdn-profile-settings.png
[cdn-new-endpoint-button]: ./media/cdn-create-new-endpoint/cdn-new-endpoint-button.png
[cdn-add-endpoint]: ./media/cdn-create-new-endpoint/cdn-add-endpoint.png
[cdn-endpoint-success]: ./media/cdn-create-new-endpoint/cdn-endpoint-success.png
