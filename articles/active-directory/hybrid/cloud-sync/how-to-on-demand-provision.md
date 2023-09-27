---
title: 'On-demand provisioning in Microsoft Entra Connect cloud sync'
description: This article describes how to use the cloud sync feature of Microsoft Entra Connect to test configuration changes.
services: active-directory
author: billmath
manager: amycolannino
ms.service: active-directory
ms.workload: identity
ms.topic: how-to
ms.date: 01/11/2023
ms.subservice: hybrid
ms.author: billmath
ms.collection: M365-identity-device-management
---

# On-demand provisioning in Microsoft Entra Connect cloud sync

You can use the cloud sync feature of Microsoft Entra Connect to test configuration changes by applying these changes to a single user. This on-demand provisioning helps you validate and verify that the changes made to the configuration were applied properly and are being correctly synchronized to Microsoft Entra ID.  

> [!IMPORTANT] 
> When you use on-demand provisioning, the scoping filters are not applied to the user that you selected. You can use on-demand provisioning on users who are outside the organization units that you specified.

For additional information and an example see the following video.

> [!VIDEO https://www.microsoft.com/en-us/videoplayer/embed/RWK5mW]

## Validate a user
To use on-demand provisioning, follow these steps:

 [!INCLUDE [sign in](../../../../includes/cloud-sync-sign-in.md)]

 3. Under **Configuration**, select your configuration.
 4. On the left, select **Provision on demand**.
 5. Enter the distinguished name of a user and select the **Provision** button.
 
 :::image type="content" source="media/how-to-on-demand-provision/new-ux-2.png" alt-text="Screenshot of user distinguished name." lightbox="media/how-to-on-demand-provision/new-ux-2.png":::    

 6. After provisioning finishes, a success screen appears with four green check marks. Any errors appear to the left.

 :::image type="content" source="media/how-to-on-demand-provision/new-ux-3.png" alt-text="Screenshot of on-demand success." lightbox="media/how-to-on-demand-provision/new-ux-3.png":::  

## Get details about provisioning
Now you can look at the user information and determine if the changes that you made in the configuration have been applied. The rest of this article describes the individual sections that appear in the details of a successfully synchronized user.

### Import user
The **Import user** section provides information on the user who was imported from Active Directory. This is what the user looks like before provisioning into Microsoft Entra ID. Select the **View details** link to display this information.

By using this information, you can see the various attributes (and their values) that were imported. If you created a custom attribute mapping, you can see the value here.

 :::image type="content" source="media/how-to-on-demand-provision/new-ux-4.png" alt-text="Screenshot of import user." lightbox="media/how-to-on-demand-provision/new-ux-4.png":::  

### Determine if user is in scope
The **Determine if user is in scope** section provides information on whether the user who was imported to Microsoft Entra ID is in scope. Select the **View details** link to display this information.

By using this information, you can see if the user is in scope.

 :::image type="content" source="media/how-to-on-demand-provision/new-ux-5.png" alt-text="Screenshot of scope determination." lightbox="media/how-to-on-demand-provision/new-ux-5.png":::  

### Match user between source and target system
The **Match user between source and target system** section provides information on whether the user already exists in Microsoft Entra ID and whether a join should occur instead of provisioning a new user. Select the **View details** link to display this information.

By using this information, you can see whether a match was found or if a new user is going to be created.

 :::image type="content" source="media/how-to-on-demand-provision/new-ux-6.png" alt-text="Screenshot of matching user." lightbox="media/how-to-on-demand-provision/new-ux-6.png":::  

The matching details show a message with one of the three following operations:
- **Create**: A user is created in Microsoft Entra ID.
- **Update**: A user is updated based on a change made in the configuration.
- **Delete**: A user is removed from Microsoft Entra ID.

Depending on the type of operation that you've performed, the message will vary.

### Perform action
The **Perform action** section provides information on the user who was provisioned or exported into Microsoft Entra ID after the configuration was applied. This is what the user looks like after provisioning into Microsoft Entra ID. Select the **View details** link to display this information.

By using this information, you can see the values of the attributes after the configuration was applied. Do they look similar to what was imported, or are they different? Was the configuration applied successfully?  

This process enables you to trace the attribute transformation as it moves through the cloud and into your Microsoft Entra tenant.

 :::image type="content" source="media/how-to-on-demand-provision/new-ux-7.png" alt-text="Screenshot of perform action." lightbox="media/how-to-on-demand-provision/new-ux-7.png":::  

## Next steps 

- [What is Microsoft Entra Connect cloud sync?](what-is-cloud-sync.md)
- [Install Microsoft Entra Connect cloud sync](how-to-install.md)
 
