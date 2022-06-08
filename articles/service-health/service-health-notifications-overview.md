---
title: Service Health notifications overview | Microsoft Docs
description: Learn how Service Health notifications provides you with a customizable dashboard which tracks the health of your Azure services in the regions where you use them. 
ms.topic: conceptual
ms.date: 08/06/2022


---
# Service Health notifications overview


Azure Service Health has been updated to provide notifications to tenant admins within the Azure portal when there are Service Health events for Azure Active Directory services. Due to the criticality of these events, an alert card in the Azure AD overview page will also be provided to support the discovery of these notifications. 

## How it works 

When there happens to be a Service Health notification for an Azure Active Directory service it will be posted to the Service Health page within the Azure portal.  Previously these were subscription events that were posted to all the subscription owners/readers of subscriptions within the tenant that had an issue.  To improve the targeting of these notifications they will now be available as tenant events to the tenant admins of the impacted tenant.  For a transition period these service events will be available as both tenant events and subscription events. 

Now that they are available as tenant events, they will be available in the Azure AD overview page as alert cards. Any Service Health notification that has been updated within the last 3 days will be shown in one of the cards.   

 
![Azure Service Health overview page](./media/service-health-notifications-overview/service-health-overview.png)



Each card represents a currently active event or a resolved one which will be distinguished by the icon in the card.  Each card has a link to the event which can be viewed in the Azure Service Health pages.  

 
![Azure Service Health issues page](./media/service-health-notifications-overview/service-health-issues.png)


 

For more information on the new Azure Service Health tenant events, see [Azure Service Health portal updates](link) 

## Who will see the notifications 

Most of the built-in admin roles will have access to see these notifications. For the complete list of all authorized roles, see [Azure Service Health Tenant Admin authorized roles](link).  Currently custom roles are not supported. 

## What you should know 

Service Health events allow the addition of alerts and notifications to be applied to subscription events. Currently this is not yet supported with tenant events, but will be coming soon. Until notifications are supported, both tenant events and subscription events to all subscriptions in an impacted tenant will be issued in the event of an outage.  


 



## Next steps

- [Service Health overview](service-health-overview.md)
