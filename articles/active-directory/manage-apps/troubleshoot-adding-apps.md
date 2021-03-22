---
title: Troubleshoot common problem adding or removing an application to Azure Active Directory
description: Troubleshoot the common problems people face when adding or removing an app to Azure Active Directory.
services: active-directory
author: kenwith
manager: daveba
ms.service: active-directory
ms.subservice: app-mgmt
ms.workload: identity
ms.topic: troubleshooting
ms.date: 09/11/2018
ms.author: kenwith 
---

# Troubleshoot common problem adding or removing an application to Azure Active Directory
This article helps you understand the common problems people face when adding or removing an app to Azure Active Directory.

## I clicked the “add” button and my application took a long time to appear
Under some circumstances, it can take 1-2 minutes (and sometimes longer) for an application to appear after adding it to your directory. While this is not the normal expected performance, you can see the application addition is in progress by clicking on the **Notifications** icon (the bell) in the upper right of the [Azure portal](https://portal.azure.com/) and looking for an **In Progress** or **Completed** notification labeled **Adding application.**

If your application is never added, or you encounter an error when clicking the **Add** button, you’ll see a **Notification** in an **Error** state. If you want more details about the error to learn more to or share with a support engineer, you can see more information about the error by following the steps in the [How to see the details of a portal notification](#how-to-see-the-details-of-a-portal-notification) section.

## I clicked the “add” button and my application didn’t appear
Sometimes, due to transient issues, networking problems, or a bug, adding an application fails. You can tell this happens when you click the **Notifications** icon (the bell) in the upper right of the Azure portal and you see a red (!) icon next to your **Adding application** notification. This indicates there was an error when creating the application.

If you encounter an error when clicking the **Add** button, you’ll see a **Notification** in an **Error** state. If you want more details about the error to learn more to or share with a support engineer, you can see more information about the error by following the steps in the [How to see the details of a portal notification](#how-to-see-the-details-of-a-portal-notification) section.

## I don’t know how to set up my application once I’ve added it
If you need help with learning about applications, the [List of Tutorials on How to Integrate SaaS Apps with Azure Active Directory](../saas-apps/tutorial-list.md) article is a good place to start.

In addition to this, the [Azure AD Applications Document Library](./what-is-application-management.md) helps you to learn more about single sign-on with Azure AD and how it works.

## I want to delete an application but the delete button is disabled

The delete button will be disabled in the following scenarios:

- For applications under Enterprise application, if you don't have one of the following roles: Global Administrator, Cloud Application Administrator, Application Administrator, or owner of the service principal.

- For Microsoft application, you won't be able to delete them from the UI regardless of your role.

- For servicePrincipals that correspond to a managed identity. Managed identities service principals can't be deleted in the Enterprise apps blade. You need to go to the Azure resource to manage it. Learn more about [Managed Identity](../managed-identities-azure-resources/overview.md)

## How to see the details of a portal notification
You can see the details of any portal notification by following the steps below:
1.  Select the **Notifications** icon (the bell) in the upper right of the Azure portal
2.  Select any notification in an **Error** state (those with a red (!) next to them).
    >[!NOTE]
    >You cannot click notifications in a **Successful** or **In Progress** state.
4.  Use the information under **Notification Details** to understand more details about the problem.
5.  If you still need help, you can also share this information with a support engineer or the product group to get help with your problem.
6.  Select the **copy icon** to the right of the **Copy error** textbox to copy all the notification details to share with a support or product group engineer.

## How to get help by sending notification details to a support engineer
It is important that you share **all the details listed below** with a support engineer if you need help, so that they can help you quickly. **Take a screenshot** or select the **Copy error icon**, found to the right of the **Copy error** textbox.

## Notification Details Explained
See the following descriptions for more details about the notifications.

### Essential Notification Items
- **Title** – the descriptive title of the notification
  * Example – **Application proxy settings**
- **Description** – the description of what occurred as a result of the operation
  -   Example – **Internal url entered is already being used by another application**
- **Notification ID** – the unique ID of the notification
  -   Example – **clientNotification-2adbfc06-2073-4678-a69f-7eb78d96b068**
- **Client Request ID** – the specific request ID made by your browser
  -   Example – **302fd775-3329-4670-a9f3-bea37004f0bc**
- **Time Stamp UTC** – the timestamp during which the notification occurred, in UTC
  -   Example – **2017-03-23T19:50:43.7583681Z**
- **Internal Transaction ID** – the internal ID we can use to look up the error in our systems
  -   Example – **71a2f329-ca29-402f-aa72-bc00a7aca603**
- **UPN** – the user who performed the operation
  -   Example – **tperkins\@f128.info**
- **Tenant ID** – the unique ID of the tenant that the user who performed the operation was a member of
  -   Example – **7918d4b5-0442-4a97-be2d-36f9f9962ece**
- **User object ID** – the unique ID of the user who performed the operation
  -   Example – **17f84be4-51f8-483a-b533-383791227a99**

### Detailed Notification Items
-   **Display Name** – **(can be empty)** a more detailed display name for the error
    -   Example – **Application proxy settings**
-   **Status** – the specific status of the notification
    -   Example – **Failed**
-   **Object ID** – **(can be empty)** the object ID against which the operation was performed
    -   Example – **8e08161d-f2fd-40ad-a34a-a9632d6bb599**
-   **Details** – the detailed description of what occurred as a result of the operation
    -   Example – **Internal url `https://bing.com/` is invalid since it is already in use**
-   **Copy error** – Select the **copy icon** to the right of the **Copy error** textbox to copy all the notification details to share with a support or product group 
-   engineer
    -   Example 
    ```{"errorCode":"InternalUrl\_Duplicate","localizedErrorDetails":{"errorDetail":"Internal url 'https://google.com/' is invalid since it is already in use"},"operationResults":\[{"objectId":null,"displayName":null,"status":0,"details":"Internal url 'https://bing.com/' is invalid since it is already in use"}\],"timeStampUtc":"2017-03-23T19:50:26.465743Z","clientRequestId":"302fd775-3329-4670-a9f3-bea37004f0bb","internalTransactionId":"ea5b5475-03b9-4f08-8e95-bbb11289ab65","upn":"tperkins@f128.info","tenantId":"7918d4b5-0442-4a97-be2d-36f9f9962ece","userObjectId":"17f84be4-51f8-483a-b533-383791227a99"}```
