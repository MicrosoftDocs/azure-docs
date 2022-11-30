---
title: How to use MedTech service mapping debugger - Azure Health Data Services
description: This article explains how to use MedTech service mapping debugger.
services: healthcare-apis
author: brown-sam
ms.service: healthcare-apis
ms.subservice: iomt
ms.topic: how-to
ms.date: 11/14/2022
ms.author: sabro
---

# How to use the MedTech service mapping debugger

In this article, you'll learn how to use the [MedTech service](iot-connector-overview.md) mapping debugger in the Azure portal. The mapping debugger is a central user interface that provides a frictionless way to debug and edit any [device mappings](how-to-use-device-mappings.md) and [FHIR destination mappings](how-to-use-fhir-mappings.md) for the MedTech service in real time. 

## Use the MedTech service mapping debugger

1. Within your Azure Health Data Services workspace, select **Mapping debugger** under **Settings**.

   :::image type="content" source="media\iot-monitoring-tab\workspace-displayed-with-connectors-button.png" alt-text="Screenshot of select the MedTech service within the workspace." lightbox="media\iot-monitoring-tab\workspace-displayed-with-connectors-button.png":::

2. On the left, you see the normalization file, and the right shows the FHIR transformation file. Below the files, you can see the errors that need to be addressed along with the corresponding lines. If you're having trouble understanding the error, hovering over it will give you a tool tip for guidance. 

   :::image type="content" source="media\iot-monitoring-tab\select-medtech-service.png" alt-text="Screenshot of select the MedTech service you would like to display metrics for." lightbox="media\iot-monitoring-tab\select-medtech-service.png":::

3. As you edit these errors, you can watch the error messages disappear when they've been resolved.

   :::image type="content" source="media\iot-monitoring-tab\select-monitoring-tab.png" alt-text="Screenshot of select the Metrics option within your MedTech service." lightbox="media\iot-monitoring-tab\select-monitoring-tab.png":::

4. When all errors have been resolved, you'll see a green checkbox appear with a "No validation errors" text. 

   :::image type="content" source="media\iot-monitoring-tab\display-metrics-tile.png" alt-text="Screenshot the MedTech service monitoring tab with drop-down menus." lightbox="media\iot-monitoring-tab\display-metrics-tile.png":::

The Medtech service mapping debugger allows you to have an easy experience when configuring, monitoring and debugging the service. 

## Next steps

In this article, you learned how to use the mapping debugger. 

To learn how to use device mappings, see

> [!div class="nextstepaction"]
> [How to use device mappings](how-to-use-device-mappings.md)

To learn how to use FHIR destination mappings, see

> [!div class="nextstepaction"]
> [How to use the FHIR destination mappings](how-to-use-fhir-mappings.md)

(FHIR&#174;) is a registered trademark of Health Level Seven International, registered in the U.S. Trademark Office and is used with their permission.
