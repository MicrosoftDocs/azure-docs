---
author: zhangmanling
ms.author: mazha
ms.service: azure-cdn
ms.topic: include
ms.date: 11/21/2018
ms.custom:
  - include file
  - sfi-image-nochange
---

## Prerequisites
Before writing CDN management code, you must do some preparation to enable the code to interact with the Azure Resource Manager. To do this preparation, you need to:

* Create a resource group to contain the CDN profile created in this tutorial
* Configure Microsoft Entra ID to provide authentication for the application
* Apply permissions to the resource group so that only authorized users from your Microsoft Entra tenant can interact with the CDN profile

### Creating the resource group
1. Sign in to the [Azure portal](https://portal.azure.com).
2. Select **Create a resource**.
3. Search for **Resource group** and in the Resource group pane, select **Create**.

    ![Creating a new resource group](./media/cdn-app-dev-prep/cdn-new-rg-1-include.png)
3. Name your resource group *CdnConsoleTutorial*. Select your subscription and choose a location near you. If you wish, you can select the **Pin to dashboard** checkbox to pin the resource group to the dashboard in the portal.  Pinning makes it easier to find later. After you make your selections, select **Create**.

    ![Screenshot of the Resource group dialog box.](./media/cdn-app-dev-prep/cdn-new-rg-2-include.png)
4. After the resource group is created, if you didn't pin it to your dashboard, you can find it by clicking **Browse**, then **Resource Groups**. To open it, select the resource group. Make a note of your **Subscription ID**. We need it later.

    ![Screenshot of the C D N Console Tutorial section.](./media/cdn-app-dev-prep/cdn-subscription-id-include.png)

<a name='creating-the-azure-ad-application-and-applying-permissions'></a>

### Creating the Microsoft Entra application and applying permissions
There are two approaches to app authentication with Microsoft Entra ID: Individual users or a service principal. A service principal is similar to a service account in Windows. Instead of granting a particular user the permissions to interact with the CDN profiles, permissions are instead granted to the service principal. Service principals are typically used for automated, non-interactive processes. Even though this tutorial is writing an interactive console app, we focus on the service principal approach.

Creating a service principal consists of several steps, including creating a Microsoft Entra application. To create it, we're going to [follow this tutorial](../articles/active-directory/develop/howto-create-service-principal-portal.md).

> [!IMPORTANT]
> Be sure to follow all the steps in the [linked tutorial](../articles/active-directory/develop/howto-create-service-principal-portal.md). It's *important* that you complete it exactly as described. Make sure to note your **tenant ID**, **tenant domain name** (commonly a *.onmicrosoft.com* domain unless you specify a custom domain), **client ID**, and **client authentication key**, as we need this information later. Be careful to guard your **client ID** and **client authentication key**, as these credentials can be used by anyone to execute operations as the service principal.
>
> When you get to the step named Configure multi-tenant application, select **No**.
>
> When you get to the step [Assign the application to a role](../articles/active-directory/develop/howto-create-service-principal-portal.md#assign-a-role-to-the-application), use the resource group created earlier,  *CdnConsoleTutorial*, but instead of the **Reader** role, assign the **CDN Profile Contributor** role. After you assign the application the **CDN Profile Contributor** role on your resource group, return to this tutorial. 
>

After you created your service principal and assigned the **CDN Profile Contributor** role, the **Users** blade for your resource group should look similar to the following image.

![Users blade](./media/cdn-app-dev-prep/cdn-service-principal-include.png)

### Interactive user authentication
If, instead of a service principal, you'd rather have interactive individual user authentication, the process is similar to that for a service principal. In fact, you need to follow the same procedure, but make a few minor changes.

> [!IMPORTANT]
> Only follow these next steps if you're choosing to use individual user authentication instead of a service principal.

1. When creating your application, instead of **Web Application**, choose **Native application**.

    ![Native application](./media/cdn-app-dev-prep/cdn-native-application-include.png)
2. On the next page, you're prompted for a **redirect URI**. The URI won't be validated, but remember what you entered. You need it later.
3. There's no need to create a **client authentication key**.
4. Instead of assigning a service principal to the **CDN Profile Contributor** role, we're going to assign individual users or groups. This example assigns *CDN Demo User* to the **CDN Profile Contributor** role.  

    ![Individual user access](./media/cdn-app-dev-prep/cdn-user-include.png)
