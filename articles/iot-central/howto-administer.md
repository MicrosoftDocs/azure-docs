---
title: Administer an Azure IoT Central application | Microsoft Docs
description: As an adminstrator, how to administer your Azure IoT Central application
author: tbhagwat3
ms.author: tanmayb
ms.date: 04/16/2018
ms.topic: conceptual
ms.service: iot-central
services: iot-central
manager: peterpr
---

# How to administer your application

After you create a Microsoft Azure IoT Central application, you can use the **Administration** section of the Azure IoT Central user interface to administer it. To navigate to the **Administration** section, choose **Administration** on the left navigation menu.

The **Administration** section enables you to:

- Manage users

- Manage roles

- View billing information

- Manage application settings

- Extend a free trial

In the **Administration** section, there is a secondary navigation menu with links to the various administration tasks.

To access and use the **Administration** section, you must be in the **Administrator** role in the Azure IoT Central application. If you create an Azure IoT Central application, you are automatically assigned to the **Administrator** role for that application. The *Managing Users* section in this article explains more about how to assign the **Administrator** role to other users.

## Change application name

To change the name of your application, use the secondary navigation menu to navigate to the **Application Settings** page in the **Administration** section.

On the **Application Settings** page, enter a name of your choice in the **Application Name** field, and then choose **Save**.

## Change the application URL

To change the URL for your application, use the secondary navigation menu to navigate to the **Application Settings** page in the **Administration** section.

![Application Settings Page](media\howto-administer\image0-a.png)

On the **Application Settings** page, enter the URL of your choice in the **URL** field, and then choose **Save**. Your URL can be at most 200 characters in length. If the URL is not available, you see a validation error

> [!Note]
> If you change your URL, your old URL can be taken by another Azure IoT Central customer. In that case, it is no longer available for you to use. When you change your URL, the old URL no longer works and you must notify your users about the new URL to use.

## Change the application image

For more information about using images in an Azure IoT Central application, see [Prepare and upload images to your Azure IoT Central application](howto-prepare-images.md).

## Copy an application

You can create a copy of any application, minus any device instances, device data history, and user data. The copy will be a paid application that you'll be charged for. You cannot create a trial application by copying another application.

To copy an application, navigate to the **Application Settings** page and click the **Copy** button.

![Application Settings page](media\howto-administer\appCopy1.png)

Clicking the **Copy** button will open a dialog in which you can select a name, URL, AAD directory, subscription and Azure region for the new application that will be created by copying your application. Select values for each of those fields and then click the **Copy** button to confirm that you want to proceed. You can learn more about what to enter for those values in the article about [how to create an application](howto-create-application.md).

![Application Settings page](media\howto-administer\appCopy2.png)

Once the app copy operation succeeds, you will be able to navigate to the new application that was created by copying your application by clicking the link that appears on the **Application Settings** page.

![Application Settings page](media\howto-administer\appCopy3.png)

> [!Note]
> Copying an application will copy the definition of rules or actions. However, since users that have access to your original app aren't copied to the copied app, you'll have to manually add users to actions such as email for which users are a pre-requisite.

## Delete an application

To delete your application, use the secondary navigation menu to navigate to the **Application Settings** page in the **Administration** section.

Choose **Delete**.

> [!Note]
> Deleting an application irrecoverably deletes all data associated with the application. To delete an application, you must also have the rights to delete resources in the Azure subscription you chose when you created the application. To learn more, see [Use Role-Based Access Control to manage access to your Azure subscription resources](https://docs.microsoft.com/azure/active-directory/role-based-access-control-configure).

## Roles in Azure IoT Central

Roles enable you to control who, within your organization, can perform various Azure IoT Central tasks. Azure IoT Central has three roles you can assign to users of your application. Roles are assigned by each application. The same user can have different roles in different applications. You can assign the same user can to multiple roles within an application.

### Administrator

Users in the **Administrator** role have access to all functionality in an Azure IoT Central application.

The user creating an application is automatically assigned to the **Administrator** role. There must always be at least one user in the **Administrator** role.

### Application Builder

Users in the **Application Builder** role can do everything in an Azure IoT Central application except administer the application.

### Application Operator

Users in the **Application Operator** role don't have access to the **Application Builder** page. They can't administer the application.

## Manage users

Application administrators can assign users to the roles in the application.

### Add users

Every user must have a user account before they can sign in and access an Azure IoT Central application. Microsoft Accounts (MSAs) and Azure Active Directory (AAD) accounts are supported in Azure IoT Central. Azure Active Directory groups are not currently supported in Azure IoT Central.

To learn more, see [Microsoft account help](https://support.microsoft.com/products/microsoft-account?category=manage-account) and  [Quickstart: Add new users to Azure Active Directory](https://docs.microsoft.com/azure/active-directory/add-users-azure-active-directory).

1. To add a user account to an Azure IoT Central application, use the secondary navigation menu to navigate to the **Users** page in the **Administration** section.

    ![List of Users](media\howto-administer\image1.png)

1. On the **Users** page, choose **+ Add user** to add a user.

    ![Add User](media\howto-administer\image2.png)

1. When you add a user to your Azure IoT Central application, choose a role for the user from the **Role** drop-down. Learn more about roles in the *Roles in Azure IoT Central* section of this article.

    ![Role Selection](media\howto-administer\image3.png)

    > [!NOTE]
    >  To add users in bulk, enter the User IDs of all the users you'd like to add separated by semi-colons. Choose a role from the **Role** drop-down and choose **Save**.

1. After you add a user, an entry appears for that user on the **Users** page.

    ![User List](media\howto-administer\image4.png)

### Edit the roles assigned to users

Roles cannot be changed once assinged. To change the role assigned to a user, delete the user and add the user again with a different role.

### Delete users

To delete users, check one or more checkboxes on the **Users** page and then choose **Delete**.

## View your bill

To view your bill, navigate to the **Billing** page in the **Administration** section and choose **Billing**. The Azure billing page opens in a new tab and you can see the bill for each of your Azure IoT Central applications.

## Convert your trial to a paid application

Once you've evaluated IoT Central, you can convert your trial to a paid application. To complete this self-service process, follow these steps:

1. Use the secondary navigation menu to navigate to the **Billing** page in the **Administration** section. If you haven't extended your trial, the page looks like the following:

    ![Free trial state](media/howto-administer/freetrial.png)

2. Click **Convert to Paid**. If you haven't extended your trial, the pop-up looks like the following:

    In the pop-up select the appropriate Azure Active Directory tenant and then the Azure Subscription that you want to use for your IoT Central application.

    ![Extend free trial](media/howto-administer/extend.png)

3. After you click **Convert**, your trial is converted to a paid application and you start getting billed.

## Extend your free trial

By default, all free trials are available for 7 days. If you'd like to increase your trial to 30 days, you follow these steps:

1. Use the secondary navigation menu to navigate to the **Billing** page in the **Administration** section:

1. Click **Extend Trial**. In the pop-up select the appropriate Azure Active Directory tenant and then the Azure Subscription to use for your IoT Central application:

1. Then click **Extend**. Your trial is now valid for 30 days.

## Next steps

Now that you have learned how to administer your Azure IoT Central application, here is the suggested next step:

> [!div class="nextstepaction"]
> [Set up the device template](howto-set-up-template.md)