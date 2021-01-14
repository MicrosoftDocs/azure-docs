---
title: Migrate a V2 IoT Central Application to V3 | Microsoft Docs
description: As an adminstrator, how to migrate your V2 IoT Central application to V3
author: troyhopwood
ms.author: troyhop
ms.date: 08/06/2020
ms.topic: conceptual
ms.service: iot-central
services: iot-central
manager: reddyd
---

# Migrate your V2 IoT Central application to V3

## Determining the version for your IoT Central application

To get the version number for your IoT Central application:

1. Select the **Help** link on the top menu.

1. Select **About your app**.

1. The **About your app** page shows information about your application. If **Version** is 2 then you will need to migrate your application to V3. If **Version** is 3 then your application is already running the latest version of IoT Central.

    :::image type="content" source="media/howto-get-app-info/about-your-app.png" alt-text="About your app screenshot":::

## Creating a new V3 application

You must be an administrator to migrate an application to V3.

1. Select **Migrate to a V3 application** from the **Administration** menu.

    :::image type="content" source="media/howto-migrate/migratemenu.png" alt-text="About your app screenshot":::

    > [!Note]
    > IoT Central does not support migrating to an existing V3 application. To ensure minimal impact to existing devices, you must use the migration wizard to create your V3 application.
    
    The migration wizard creates a new V3 application, checks all device templates for compatibility with V3, copies all device templates, and copies all users and role assignments.

1. Enter a new **Application name** and adjust the **URL**** as desired. The URL cannot be the same as your current V2 application (though you can change this later after deleting your V2 application.)

1. Click **Create a new V3 app**

    :::image type="content" source="media/howto-migrate/createapp.png" alt-text="About your app screenshot":::

    Depending on the number of device templates and their complexity, this process may take several minutes to complete.
    
    > [!Warning]
    > The creation of your V3 application will fail if any device template has fields that start with a number or contain any of the following characters (+, *, ?, ^, $, (, ), [, ], {, }, |, \\). The DTDL device template schema used in V3 does not allow these characters. You will need to update your device template before you can migrate to V3.

1. Once your new V3 app has been created, you can open it by clicking **Open your new app**

    :::image type="content" source="media/howto-migrate/openapp.png" alt-text="About your app screenshot":::

## Configuring your new V3 application

Once you your new V3 application has been created, we recommend you take some time to configure it before moving your devices to the new app. Take a moment to [familiarize yourself with V3](overview-iot-central-tour#navigate-your-application) as it has some differences.

Here are some recommended steps to consider:

- [Configure dashboards](howto-add-tiles-to-your-dashboard)
- [Configure data export](howto-export-data)
- [Configure rules and actions](quick-configure-rules)
- [Customize the application UI](howto-customize-ui)

Once your V3 application is configured to meet your needs, you are ready to move your devices from your V2 application to your V3 application.

## Moving devices to your new V3 application

> [!IMPORTANT]
> Before moving devices to your V3 application, you must delete any devices that you may have created in the V3 application.

This step will move all your existing devices to your new V3 application. Your device data will not be copied. 

1. Click the **Move all devices** button to start the device move. This step could take several minutes.

    once complete, all your devices will communicate only with your new V3 application.
    
    Do not delete your V3 application as your V2 application is now inoperable.
        :::image type="content" source="media/howto-migrate/movedevices.png" alt-text="About your app screenshot":::

## Delete your old V2 application

Once you have validated everything is working as expected in your new V3 application, it is important to delete your old V2 application. This will ensure you don't get unnecessarily billed for an application you no longer use.

> [!Note]
> To delete an application, you must also have permissions to delete resources in the Azure subscription you chose when you created the application. To learn more, see [Use role-based access control to manage access to your Azure subscription resources](https://docs.microsoft.com/azure/active-directory/role-based-access-control-configure).

1. In your M2 application, Click the **Administration** tab in the menu
2. Click the red **Delete** button to permanently delete your IoT Central application. Doing this will permanently delete all data that's associated with that application.
