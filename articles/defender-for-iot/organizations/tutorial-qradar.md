---
title: Integrate Qradar with Microsoft Defender for IoT
description: In this tutorial, learn how to integrate Qradar with Microsoft Defender for IoT.
ms.topic: tutorial
ms.date: 02/07/2022
ms.custom: template-tutorial
---

# Tutorial: Integrate Qradar with Microsoft Defender for IoT

This tutorial will help you learn how to integrate, and use QRadar with Microsoft Defender for IoT.

Defender for IoT delivers the only ICS, and IoT cybersecurity platform with patented ICS-aware threat analytics and machine learning.

Defender for IoT has integrated its continuous ICS threat monitoring platform with IBM QRadar.

Some of the benefits of the integration include:

- The ability to forward Microsoft Defender for IoT alerts to IBM QRadar for unified IT, and OT security monitoring, and governance.

- The ability to gain an overview of both IT, and OT environments. Allowing you to detect, and respond to multi-stage attacks that often cross IT, and OT boundaries.

- Integrate with existing SOC workflows.

In this tutorial, you learn how to:

> [!div class="checklist"]
> * Configure Syslog listener for QRadar
> * Deploy Defender for IoT platform QID
> * Setup QRadar forwarding rules
> * Map notifications to QRadar in the Management Console
> * Add custom fields to alerts

If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.

## Prerequisites

There are no prerequisites of this tutorial.

## Configure Syslog listener for QRadar

**To configure the Syslog listener to work with QRadar**:

1. Sign in to QRadar.

1. From the left pane, select **Admin** > **Data Sources**.

1. In the Data Sources window, select **Log Sources**.

   [:::image type="content" source="media/tutorial-qradar/log.png" alt-text="Screenshot of, selecting a log sources from the available options.":::](media/tutorial-qradar/log.png#lightbox)

1. In the **Modal** window, select **Add**.

    [:::image type="content" source="media/tutorial-qradar/modal.png" alt-text="Screenshot of, after selecting Syslog the modal window opens.":::](media/tutorial-qradar/modal.png#lightbox)

1. In the **Add a log source** dialog box, set the following parameters:

    :::image type="content" source="media/tutorial-qradar/source.png" alt-text="Screenshot of, adding a log source by filling in the appropriate fields.":::

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

QID is an event identifier in QRadar. All of Defender for IoT platform reports are tagged under the same event (Sensor Alert).

**To deploy Defender for IoT platform QID**:

1. Sign in to the QRadar console.

1. Create a file named `xsense_qids`.

1. In the file, using the following command: `,XSense Alert,XSense Alert Report From <XSense Name>,5,7001`.

1. Execute: `sudo /opt/qradar/bin/qidmap_cli.sh -i -f <path>/xsense_qids`. The message that the QID was deployed successfully appears.

## SetUp QRadar forwarding rules

For the integration to work, you will need to setup in the Defender for IoT appliance, a Qradar forwarding rule.

**To define QRadar notifications in the Defender for IoT appliance**:

1. In the side menu, select **Forwarding**.

1. Select **Create new rule**.
1. Define a rule name.
1. Define the rule conditions.
1. In the Actions section, select **QRadar** .

    :::image type="content" source="media/tutorial-qradar/create.png" alt-text="Screenshot of, create a Forwarding Rule window.":::

1. Define the QRadar IP address, and the timezone.

1. Select **Save**.

## Map notifications to QRadar

The rule must then be mapped on the on-premises management console.

**To map the notifications to QRadar**:

1. Sign in to the management console.

1. From the left side pane, select **Forwarding**.

1. In the Qradar GUI, under QRadar, select **Log Activity** .

1. Select **Add Filter** and set the following parameters:
   - Parameter: `Log Sources [Indexed]`
   - Operator: `Equals`
   - Log Source Group: `Other`
   - Log Source: `<Xsense Name>`

1. Double-click an unknown report from the sensor.

1. Select **Map Event**.

1. In the Modal Log Source Event page, select as follows:
   - High-Level Category - Suspicious Activity + Low-Level Category - Unknown Suspicious Event + Log
   - Source Type - any

1. Select **Search**.

1. From the results, choose the line in which the name XSense appears, and select **OK**.

All of the sensor reports from now on are tagged as Sensor Alerts.

## Add custom fields to the alerts

**To add custom fields to alerts**:

1. Select **Extract Property**.

1. Select **Regex Based**.

1. Configure the following fields:
   - New Property: _choose from the list below_
      - Sensor Alert Description
      - Sensor Alert ID
      - Sensor Alert Score
      - Sensor Alert Title
      - Sensor Destination Name
      - Sensor Direct Redirect
      - Sensor Sender IP
      - Sensor Sender Name
      - Sensor Alert Engine
      - Sensor Source Device Name
   - Check **Optimize Parsing**
   - Field Type: `AlphaNumeric`
   - Check **Enabled**
   - Log Source Type: `Universal LEAF`
   - Log Source: `<Sensor Name>`
   - Event Name (should be already set as Sensor Alert)
   - Capture Group: 1
   - Regex:
      - Sensor Alert Description RegEx: `msg=(.*)(?=\t)`
      - Sensor Alert ID RegEx: `alertId=(.*)(?=\t)`
      - Sensor Alert Score RegEx: `Detected score=(.*)(?=\t)`
      - Sensor Alert Title RegEx: `title=(.*)(?=\t)`
      - Sensor Destination Name RegEx: `dstName=(.*)(?=\t)`
      - Sensor Direct Redirect RegEx: `rta=(.*)(?=\t)`
      - Sensor Sender IP: RegEx: `reporter=(.*)(?=\t)`
      - Sensor Sender Name RegEx: `senderName=(.*)(?=\t)`
      - Sensor Alert Engine RegEx: `engine =(.*)(?=\t)`
      - Sensor Source Device Name RegEx: `src`

## Clean up resources

There are no resources to clean up.

## Next steps

In this tutorial, you learned how to get started with the QRadar integration. Continue on to learn how to [Integrate ServiceNow with Microsoft Defender for IoT](tutorial-servicenow.md).

> [!div class="nextstepaction"]
> [Integrate ServiceNow with Microsoft Defender for IoT](tutorial-servicenow.md)
