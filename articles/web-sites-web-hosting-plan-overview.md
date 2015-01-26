<properties pageTitle="What is a web hosting plan?" description="Web hosting plan overview" services="web-sites" authors="adamabdelhamed" manager="wpickett" editor="" documentationCenter=""/>

<tags ms.service="web-sites" ms.workload="web" ms.tgt_pltfrm="na" ms.devlang="multiple" ms.topic="article" ms.date="11/17/2014" ms.author="adamab"/>

# What is a Web Hosting Plan? #

Web hosting plans represent a set of features and capacity that you can share across your websites.  Web hosting plans support a few pricing tiers (e.g. Free, Shared, Basic, and Standard) where each tier has its own capabilities.  Sites in the same subscription, resource group, and geographic location can share a web hosting plan.

## Features in Web Hosting Plans ##

Each pricing tier (e.g. Free, Shared, Basic, and Standard) has its own set of features.  [Go here](http://go.microsoft.com/fwlink/?LinkID=394421) for the latest feature and pricing info.

Here are some useful tips regarding web hosting plans and features:

- You can change a web hosting plan's pricing tier at any time with zero downtime.
- Sites in the same subscription, location, and resource group can all share a web hosting plan. 
- Features like auto scale work by targeting a web hosting plan.  If you want to autoscale individual sites then you should dedicate a web hosting plan to that site.

[Learn more about managing web hosting plans](http://go.microsoft.com/fwlink/?LinkID=394411).

## Web Hosting Plans and Capacity ##

Web hosting plans in the Free and Shared tier provide sites with a shared infrastructure, meaning that your sites share resources with other customers' sites.  

Web hosting plans in the Basic and Standard tier provider sites with a dedicated infrastructure, meaning that only the site or sites you choose to associate with this plan will be running on those resources.  At this tier you can configure your web hosting plan to use one or more virtual machine instances.  Small, medium, and large instances are supported.  These virtual machines are managed on your behalf, meaning you'll never need to worry about operating system updates or anything like that.  

A note about the Shared (preview) tier.  For all tiers except 'Shared' you pay one price for the web hosting plan  based on the tier and your chosen capacity and there is no additional charge for each site that uses the plan. Shared web hosting plans are different.  Due to the nature of the shared infrastructure you are charged separately for each site in the plan.  

### Web Hosting Plans and the new Azure Preview Portal ###

The new Azure Preview Portal lets you associate your existing or new websites with web hosting plans.  In fact, all existing websites have been automatically assigned to web hosting plans based on their subscription, geographic location, and current pricing tier.  

When creating a new site, the portal will ask you which web hosting plan to associate it with.  You can either create a new web hosting plan, or select an existing plan.  To use an existing plan your new site must live in the same subscription, geographic location, and resource group as the existing plan.  When creating a new empty website Azure will default to the last used web hosting plan to help you make the best use of plans you've already created.  When creating a website with a database the option to re-use an existing plan will not be available.

You can see all of your web hosting plans across all of your subscriptions by using the **Browse** button on the left menu bar and then clicking **Everything** in the top right of the activity pane that appears on the screen.

![][BrowseEverythingScreenshot]
![][BrowseWebHostingPlansScreenshot]

You can also see which web hosting plan each website is associated with by looking at the graphical representation of your resource group that appears at the top of your website blade.

![][WebHostingPlanResourceMapScreenshot]

Clicking on the plan will launch a blade that lets you manage your web hosting plan.  [Learn more about managing web hosting plans](http://go.microsoft.com/fwlink/?LinkID=394411).

![][WebHostingPlanBladeScreenshot]
	

### Next Steps ###

To get started with Azure, see [Microsoft Azure Free Trial](http://azure.microsoft.com/en-us/pricing/free-trial/).

<!-- Images. -->
[BrowseEverythingScreenshot]: ./media/web-sites-web-hosting-plan-overview/browse-everything.png
[WebHostingPlanResourceMapScreenshot]: ./media/web-sites-web-hosting-plan-overview/web-hosting-plan-resource-map.png
[WebHostingPlanBladeScreenshot]: ./media/web-sites-web-hosting-plan-overview/web-hosting-plan-blade.png
[BrowseWebHostingPlansScreenshot]: ./media/web-sites-web-hosting-plan-overview/browse-web-hosting-plans.png
