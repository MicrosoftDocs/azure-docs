---
title: Configure the Homepage of your Azure IoT Central application | Microsoft Docs
description: As a builder, learn how to configure the Homepage of your Azure IoT Central application.
author: tbhagwat3
ms.author: tanmayb
ms.date: 07/10/2018
ms.topic: conceptual
ms.service: iot-central
services: iot-central
manager: peterpr
---

## Configuring Homepage

The Homepage is the page that loads when users that have access navigate to the application's URL. If you selected either the "Sample Contoso" or "Sample Devkits" Application Templates while creating your application, your application will have pre-defined Homepages. If on the other hand you selected the "Custom Application" Application Template, your Homepage will be blank.

For example, here's the Homepage for applications based on the "Sample Contoso" template. To customize the Homepage for your application, first select **Edit** on the top right. 

![Homepage for applications based on the "Sample Contoso" template](media\howto-configure-homepage\image1.png)

Selecting **Edit**, will open the dashboard library in a panel to the left. There are many types of tiles and dashboard primitives that can be added to customize your Homepage.

![Dashboard library](media\howto-configure-homepage\image2.png)

For example, you can add a **Settings and Properties** tile to show a selection of the current values of settings and properties. To do so, first select a **Device Template** then select a **Device Instance**. After that give the tile a title and select a **Setting** or a **Property** to display. In this case we've selected **Set Temperature**. Clicking **Done** will cause this tile to appear on the Homepage.

!["Configure Device Details" form with details for settings and properties](media\howto-configure-homepage\image3.png)

Now when an operator views the Homepage, they can see this tile that displays the properties or settings of the device:

!["Dashboard" tab with displayed settings and properties for the tile](media\howto-configure-homepage\image4.png)

Play around with the various other tile types in the library to discover how you can customize your application's Homepage even more.

## Next steps

Now that you've learned how to configure your Azure IoT Central Homepage, you can:

> [!div class="nextstepaction"]
> [Learn how to prepare and upload images](howto-prepare-images.md)
