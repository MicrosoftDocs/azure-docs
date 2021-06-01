---
 author: mikeparker104
 ms.author: miparker
 ms.date: 06/02/2020
 ms.service: notification-hubs
 ms.topic: include
---

### Create a notification hub 

In this section, you create a notification hub and configure authentication with **APNS**. You can use a p12 push certificate or token-based authentication. If you want to use a notification hub that you've already created, you can skip to step 5.

1. Sign in to [Azure](https://portal.azure.com).

1. Click **Create a resource**, then search for and choose **Notification Hub**, then click **Create**.

1. Update the following fields, then click **Create**:

    **BASIC DETAILS**  

    **Subscription:** Choose the target **Subscription** from the drop-down list  
    **Resource Group:** Create a new **Resource Group** (or pick an existing one)  

    **NAMESPACE DETAILS**  

    **Notification Hub Namespace:** Enter a globally unique name for the **Notification Hub** namespace  

    > [!NOTE]
    > Ensure the **Create new** option is selected for this field.

    **NOTIFICATION HUB DETAILS**  

    **Notification Hub:** Enter a name for the **Notification Hub**  
    **Location:** Choose a suitable location from the drop-down list  
    **Pricing Tier:** Keep the default **Free** option  

    > [!NOTE]
    > Unless you have reached the maximum number of hubs on the free tier.

1. Once the **Notification Hub** has been provisioned, navigate to that resource.
1. Navigate to your new **Notification Hub**.
1. Select **Access Policies** from the list (under **MANAGE**).
1. Make note of the **Policy Name** values along with their corresponding **Connection String** values.
