---
title: Azure IoT Central administrator guide
description: Azure IoT Central is an IoT application platform that simplifies the creation of IoT solutions. This article provides an overview of the administrator role in IoT Central. 
author: TheJasonAndrew
ms.author: v-anjaso
ms.date: 03/17/2021
ms.topic: conceptual
ms.service: iot-central
services: iot-central
ms.custom: [mvc, device-developer]
---

# IoT Central administrator guide

This article provides an overview of the administrator role in IoT Central. 

To access and use the Administration section, you must be in the Administrator role for an Azure IoT Central application. If you create an Azure IoT Central application, you're automatically assigned to the Administrator role for that application.

As an _administrator_, you are  responsible for administrative tasks such as:

* Managing Roles
* Curate Permissions
* Manage application by changing the application name and URL
* Uploading image
* Deleting an application in your Azure IoT Central application.

## IoT Central homepage

The [IoT Central homepage](https://aka.ms/iotcentral-get-started) page is the place where you can learn more about the latest news and features available on IoT Central, create new applications, and see and launch your existing application.

:::image type="content" source="media/overview-iot-central-admin/iot-central-homepage.png" alt-text="Screenshot of IoT Central homepage":::

To access and use the **Administration** section, you must be in the **Administrator** role for an Azure IoT Central application. If you create an Azure IoT Central application, you're automatically assigned to the **Administrator** role for that application.

## Change application name and URL

In the **Application Settings** page, you can change the name and URL of your application, then select **Save**.

![Screenshot of Application settings page](media/overview-iot-central-admin/image-0-a.png)

If your administrator creates a custom theme for your application, this page includes an option to hide the **Application Name** in the UI. This option is useful if the application logo in the custom theme includes the application name. For more information, see [Customize the Azure IoT Central UI](./howto-customize-ui.md).

> [!Note]
> If you change your URL, your old URL can be taken by another Azure IoT Central customer. If that happens, it is no longer available for you to use. When you change your URL, the old URL no longer works, and you need to notify your users about the new URL to use.

## Delete an application

Use the **Delete** button to permanently delete your IoT Central application. This action permanently deletes all data that's associated with the application.

> [!Note]
> To delete an application, you must also have permissions to delete resources in the Azure subscription you chose when you created the application. To learn more, see [Assign Azure roles to manage access to your Azure subscription resources](../../role-based-access-control/role-assignments-portal.md).

## Manage programmatically

IoT Central Azure Resource Manager SDK packages are available for Node, Python, C#, Ruby, Java, and Go. You can use these packages to create, list, update, or delete IoT Central applications. The packages include helpers to manage authentication and error handling.

## Next steps

Now that you've learned about how to administer your Azure IoT Central application, the suggested next step is to learn about [Manage users and roles](howto-manage-users-roles.md) in Azure IoT Central.