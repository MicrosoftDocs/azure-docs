---
title: Integrate Qradar with Azure Defender for IoT
description: In this tutorial, learn how to integrate Qradar with Azure Defender for IoT.
author: ElazarK
ms.author: v-ekrieg
ms.topic: tutorial
ms.date: 09/09/2021
ms.custom: template-tutorial
---

# Tutorial: Integrate Qradar with Azure Defender for IoT

This tutorial will help you learn how to integrate, and use QRadar with Azure Defender for IoT.

Defender for IoT delivers the only ICS, and IoT cybersecurity platform with patented ICS-aware threat analytics and machine learning.

Defender for IoT has integrated its continuous ICS threat monitoring platform with IBM QRadar.

Some of the benefits of the integration include:

- The ability to forward Azure Defender for IoT alerts to IBM QRadar for unified IT, and OT security monitoring, and governance.

- The ability to gain an overview of both IT, and OT environments. Allowing you to detect, and respond to multi-stage attacks that often cross IT, and OT boundaries.

- Integrate with existing SOC workflows.

In this tutorial, you learn how to:

> [!div class="checklist"]
> * Configure Syslog listener for QRadar
> * Deploy Defender for IoT platform QID
> * Set Up QRadar forwarding rules
> * Map notifications to QRadar in the Management Console
> * Add custom fields to alerts

## Prerequisites

There are no prerequisites of this tutorial.

## Configure Syslog listener for QRadar

**To configure the Syslog listener to work with QRadar**:

1. Sign in to QRadar.

1. From the left pane, select **Admin** > **Data Sources**.

1. In the Data Sources window, select **Log Sources**.

   [:::image type="content" source="media/tutorial-qradar/log.png" alt-text="Select log sources from the available options.":::](media/tutorial-qradar/log.png#lightbox)

1. In the **Modal** window, select **Add**.

    [:::image type="content" source="media/tutorial-qradar/modal.png" alt-text="After selecting Syslog the modal window opens.":::](media/tutorial-qradar/modal.png#lightbox)

1. In the **Add a log source** dialog box, set the following parameters:

    :::image type="content" source="media/tutorial-qradar/source.png" alt-text="Add a log source by filling in the appropriate fields.":::

   - **Log Source Name**: `<Sensor name>`

   - **Log Source Description**: `<Sensor name>`

   - **Log Source Type**: `Universal LEEF`

   - **Protocol Configuration**: `Syslog`

   - **Log Source Identifier**: `<Sensor name>`

   > [!NOTE]
   > The Log Source Identifier name must not include a white space. It is recommended to replace each white space character with an underscore.

1. Select **Save**.

1. Select **Deploy Changes**.

:::image type="content" source="media/tutorial-qradar/deploy.png" alt-text="Screenshot of Deploy Changes view":::

## Deploy Defender for IoT platform QID

QID is an event identifier in QRadar. All of Defenders for IoT platform reports are tagged under the same event (Sensor Alert).

**To deploy Defender for IoT platform QID**:

1. Sign in to the QRadar console.

1. Create a file named `xsense_qids`.

1. In the file, using the following command: `,XSense Alert,XSense Alert Report From <XSense Name>,5,7001`.

1. Execute: `sudo /opt/qradar/bin/qidmap_cli.sh -i -f <path>/xsense_qids`. The message that the QID was deployed successfully appears.

## SetUp QRadar forwarding rules

For the integration to work, you will need to setup in the Defender for IoT appliance, a Qradar forwarding rule.

**To define QRadar notifications in the Defender for IoT appliance**:

1. In the side menu, select **Forwarding**.

   :::image type="content" source="media/integration-qradar/create.png" alt-text="Create a Forwarding Rule":::

1. Set the Action to **QRadar**.

1. Configure the QRadar IP address, and the timezone.

1. Select **Submit**.

##

The Map the rule on the on-premises management console.