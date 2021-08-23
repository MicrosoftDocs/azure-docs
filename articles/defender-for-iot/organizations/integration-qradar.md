---
title: QRadar integration
description: Configure the Defender for IoT solution integration with QRadar.
ms.date: 1/4/2021
ms.topic: article
---

# About the QRadar integration

Defender for IoT delivers the only ICS and IoT cybersecurity platform built by blue-team experts with a track record defending critical national infrastructure, and the only platform with patented ICS-aware threat analytics and machine learning.

Defender for IoT has integrated its continuous ICS threat monitoring platform with IBM QRadar. 

Some of the benefits of the integration include:

- The ability to forward Azure Defender for IoT alerts to IBM QRadar for unified IT, and OT security monitoring, and governance.

- The ability to gain a bird's eye view across both IT, and OT environments. This allows you to detect, and respond to multi-stage attacks that often cross IT, and OT boundaries.

- Integrate with existing SOC workflows.

## Configuring Syslog listener for QRadar

To configure the Syslog listener to work with QRadar:

1. Sign in to QRadar.

1. From the left pane, select **Admin** > **Data Sources**.

   [:::image type="content" source="media/integration-qradar/log.png" alt-text="Select log sources from the available options.":::](media/integration-qradar/log.png#lightbox)

1. In the Data Sources window, select **Log Sources**.

   [:::image type="content" source="media/integration-qradar/modal.png" alt-text="After selecting Syslog the modal window opens.":::](media/integration-qradar/modal.png#lightbox)

1. In the **Modal** window, select **Add**.

   :::image type="content" source="media/integration-qradar/source.png" alt-text="Add a log source by filling in the appropriate fields.":::

1. In the **Add a log source** dialog box, set the following parameters:

   - **Log Source Name**: `<XSense Name>`
   
   - **Log Source Description**: `<XSense Name>`
   
   - **Log Source Type**: `Universal LEEF`

   - **Protocol Configuration**: `Syslog`
   
   - **Log Source Identifier**: `<XSenseName>`
   
   > [!NOTE]
   > The Log Source Identifier name must not include a white space. It is recommended to replace each white space character with an underscore.

1. Select **Save**.

1. Select **Deploy Changes**.

:::image type="content" source="media/integration-qradar/deploy.png" alt-text="Screenshot of Deploy Changes view":::

## Deploying Defender for IoT platform QID

QID is an event identifier in QRadar. All of Defenders for IoT platform reports are tagged under the same event (XSense Alert).

**To deploy Xsense QID**:

1. Sign in to the QRadar console.

1. Create a file named `xsense_qids`.

1. In the file, using the following command: `,XSense Alert,XSense Alert Report From <XSense Name>,5,7001`.

1. Execute: `sudo /opt/qradar/bin/qidmap_cli.sh -i -f <path>/xsense_qids`. The message that the QID was deployed successfully appears.

## Setting Up QRadar forwarding rules

In the Defender for IoT appliance, configure a Qradar forwarding rule. Map the rule on the on-premises management console.

**To define QRadar notifications in the Defender for IoT appliance**:

1. In the side menu, select **Forwarding**.

   :::image type="content" source="media/integration-qradar/create.png" alt-text="Create a Forwarding Rule":::

1. Set the Action to **QRadar**.

1. Configure the QRadar IP address, and the timezone.

1. Select **Submit**.

**To map notifications to QRadar in the Central Manager**:

1. From the side menu, select **Forwarding**.

1. In the Qradar GUI, under QRadar, select **Log Activity** .

1. Select **Add Filter** and set the following parameters:
   - Parameter: `Log Sources [Indexed]`
   - Operator: `Equals`
   - Log Source Group: `Other`
   - Log Source: `<Xsense Name>`

1. Double-click an unknown report from XSense.

1. Select **Map Event**.

1. In the Modal Log Source Event page, select as follows:
   - High-Level Category - Suspicious Activity + Low-Level Category - Unknown Suspicious Event + Log
   - Source Type - any

1. Select **Search**.

1. From the results, choose the line in which the name XSense appears, and select **OK**.

All the XSense reports from now on are tagged as XSense Alerts.

## Adding custom fields to alerts

**To add custom fields to alerts**:

1. Select **Extract Property**.

1. Select **Regex Based**.

1. Configure the following fields:
   - New Property: _choose from the list below_
      - Xsense Alert Description
      - Xsense Alert ID
      - Xsense Alert Score
      - Xsense Alert Title
      - Xsense Destination Name
      - Xsense Direct Redirect
      - Xsense Sender IP
      - Xsense Sender Name
      - Xsense Alert Engine
      - Xsense Source Device Name
   - Check **Optimize Parsing**
   - Field Type: `AlphaNumeric`
   - Check **Enabled**
   - Log Source Type: `Universal LEAF`
   - Log Source: `<Xsense Name>`
   - Event Name (should be already set as XSense Alert)
   - Capture Group: 1
   - Regex:
      - Xsense Alert Description RegEx: `msg=(.*)(?=\t)`
      - Xsense Alert ID RegEx: `alertId=(.*)(?=\t)`
      - Xsense Alert Score RegEx: `Detected score=(.*)(?=\t)`
      - Xsense Alert Title RegEx: `title=(.*)(?=\t)`
      - Xsense Destination Name RegEx: `dstName=(.*)(?=\t)`
      - Xsense Direct Redirect RegEx: `rta=(.*)(?=\t)`
      - Xsense Sender IP: RegEx: `reporter=(.*)(?=\t)`
      - Xsense Sender Name RegEx: `senderName=(.*)(?=\t)`
      - Xsense Alert Engine RegEx: `engine =(.*)(?=\t)`
      - Xsense Source Device Name RegEx: `src`

## Defining Defender for IoT appliance name

You can change the name of the platform at any time.

When building sites, and assigning appliances to zones in the on-premises management console, you should assign each appliance a significant name. For example, “Motorcycles PL Unit 2” means that this appliance is protecting unit #2 in the Motorcycles production line. 

It is important to pick a meaningful name for your appliance, because the appliance's name is passed on to the logs. When reviewing logs, each alert has a sensor attached to it. You will be able to identify which sensor is related to each alert based on its name.

**To change the appliance name**:

1. On the side menu, select the current appliance name. The **Edit management console configuration** dialog box appears.

   :::image type="content" source="media/integration-qradar/edit-management-console.png" alt-text="Change the name of your console.":::

1. Enter a name in the Name field and select **Save**.

## Next steps

Learn how to [Forward alert information](how-to-forward-alert-information-to-partners.md).
