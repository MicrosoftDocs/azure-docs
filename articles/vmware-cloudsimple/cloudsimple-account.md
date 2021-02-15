---
title: CloudSimple account management - Azure 
description: Learn about managing a CloudSimple account, which is created along with your CloudSimple service and is associated with your Azure subscription.
author: sharaths-cs 
ms.author: dikamath 
ms.date: 04/10/2019 
ms.topic: article 
ms.service: azure-vmware-cloudsimple 
ms.reviewer: cynthn 
manager: dikamath 
---
# Account management overview

When you create your CloudSimple service, it creates an account on CloudSimple.  The account is associated with your Azure subscription where the service is located.  All users with **owner** and **contributor** roles in the subscription have access to the CloudSimple portal.  The Azure subscription ID and tenant ID associated with the CloudSimple service are found on the [Accounts page](account.md).

## Additional alert emails

You can configure email IDs in CloudSimple to receive alerts:

* Related to your service
* For automatic processing

## CloudSimple operator access

You can control access to the CloudSimple portal for service operations personnel.  Service operations personnel sign in to the portal when you submit a support ticket.  Service operations will fix any problems reported and the actions taken are available in audit logs.

## Users

All users who have **owner** and **contributor** role in the subscription have access to the CloudSimple portal.  When you access the portal, the user is created on the CloudSimple account.  You can disable access to the CloudSimple portal for specific users from the Accounts page.

## Next steps

* [View account summary](account.md)
* [View user list](users.md)
