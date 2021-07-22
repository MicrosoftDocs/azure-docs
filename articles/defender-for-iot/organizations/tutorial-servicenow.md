---
title: Integrate ServiceNow with Azure Defender for IoT
description: In this tutorial, learn how to integrate ServiceNow with Azure Defender for IoT.
author: ElazarK
ms.author: v-ekrieg
ms.topic: tutorial
ms.date: 07/21/2021
ms.custom: template-tutorial
---

# Tutorial: Integrate ServiceNow with Azure Defender for IoT

This tutorial will help you learn how to integrate, and use ServiceNow with Azure Defender for IoT

<!-- 2. Introductory paragraph 
Required. Lead with a light intro that describes, in customer-friendly language, 
what the customer will learn, or do, or accomplish. Answer the fundamental “why 
would I want to do this?” question. Keep it short.
-->

[Add your introductory paragraph]

<!-- 3. Tutorial outline 
Required. Use the format provided in the list below.
-->

In this tutorial, you learn how to:

> [!div class="checklist"]
> * All tutorials include a list summarizing the steps to completion
> * Each of these bullet points align to a key H2
> * Use these green checkboxes in a tutorial

<!-- 4. Prerequisites 
Required. First prerequisite is a link to a free trial account if one exists. If there 
are no prerequisites, state that no prerequisites are needed for this tutorial.
-->

## Prerequisites

### Software RequirementsAccess to ServiceNow and Defender for IoT 

- ServiceNow Service Management version 3.0.2.

- Defender for IoT patch 2.8.11.1 or above.

> [!Note]
> If you are already working with a Defender for IoT and ServiceNow integration, and upgrade using the on-premises management console, pervious data received from Defender for IoT sensors should be cleared from ServiceNow.

### Architecture

- **On-premises management console architecture**: Set up an on-premises management console to communicate with one instance of ServiceNow. The on-premises management console pushes sensor data to the Defender for IoT application using REST API.

    To set up your system to work with an on-premises management console, you will need to disable the ServiceNow Sync, Forwarding Rules, and Proxy configurations on any sensors where they were set up.

- **Sensor architecture**: If you want to set up your environment to include direct communication between sensors and ServiceNow, for each sensor define the ServiceNow Sync, Forwarding rules, and proxy configuration (if a proxy is needed).

<!-- 5. H2s
Required. Give each H2 a heading that sets expectations for the content that follows. 
Follow the H2 headings with a sentence about how the section contributes to the whole.
-->

## Create access tokens in ServiceNow

A token is needed in order to allow ServiceNow to communicate with Defender for IoT.

1. Sign in to the on-premises management console.
1. Select **Forwarding**.
1. Select the :::image type="icon" source="media/tutorial-servicenow/plus-icon.png" border="false"::: button.
1. 

## Set up Defender for IoT to communicate with ServiceNow

Configure Defender for IoT to push alert information to the ServiceNow tables. Defender for IoT alerts will appear in ServiceNow as security incidents. This can be done by defining a Defender for IoT forwarding rule to send alert information to ServiceNow.

**To push alert information to the ServiceNow tables**:

1. Sign in to the on-premises management console.

1. Select **Forwarding**, in the left side pane.

1. Select the :::image type="icon" source="media/tutorial-servicenow/plus-icon.png" border="false"::: button.

 :::image type="content" source="media/tutorial-servicenow/forwarding-rule.png" alt-text="Create Forwarding Rule":::

1. Add a rule name.

1. Define criteria under which Defender for IoT will trigger the forwarding rule. Working with Forwarding rule criteria helps pinpoint and manage the volume of information sent from Defender for IoT to ServiceNow. The following options are available:

    - **Severity levels:** This is the minimum-security level incident to forward. For example, if **Minor** is selected, minor alerts, and any alert above this severity level will be forwarded. Levels are pre-defined by Defender for IoT.

    - **Protocols:** Only trigger the forwarding rule if the traffic detected was running over specific protocols. Select the required protocols from the drop-down list or choose them all.

    - **Engines:** Select the required engines or choose them all. Alerts from selected engines will be sent.

1. Verify that **Report Alert Notifications** is selected.

1. In the Actions section, select **Add** and then select **ServiceNow**.

    :::image type="content" source="media/tutorial-servicenow/select-servicenow.png" alt-text="Select ServiceNow from the dropdown options.":::

1. Enter the ServiceNow action parameters:

    :::image type="content" source="media/tutorial-servicenow/parameters.png" alt-text="Fill in the ServiceNow action parameters":::

1. In the **Actions** pane, set the following parameters:

  | Parameter | Description |
  |--|--|
  | Domain | Enter the ServiceNow server IP address. |
  | Username | Enter the ServiceNow server username. |
  | Password | Enter the ServiceNow server password. |
  | Client ID | Enter the Client ID you received for Defender for IoT in the **Application Registries** page in ServiceNow. |
  | Client Secret | Enter the client secret string you created for Defender for IoT in the **Application Registries** page in ServiceNow. |
  | Report Type | **Incidents**: Forward a list of alerts that are presented in ServiceNow with an incident ID and short description of each alert.<br /><br />**Defender for IoT Application**: Forward full alert information, including the  sensor details, the engine, the source, and destination addresses. The information is forwarded to the Defender for IoT on the ServiceNow application. |

1. Select **SAVE**. 

Defender for IoT alerts will now appear as incidents in ServiceNow.

## Send Defender for IoT device attributes to ServiceNow

Configure Defender for IoT to push an extensive range of device attributes to the ServiceNow tables. To send attributes to ServiceNow, you must map your on-premises management console to a ServiceNow instance. This ensures that the Defender for IoT platform can communicate and authenticate with the instance.

**To add a ServiceNow instance**:

1. Sign in to your Defender for IoT on-premises management console.

1. Select **System Settings**, and then **ServiceNow** from the on-premises management console Integration section.

      :::image type="content" source="media/tutorial-servicenow/servicenow.png" alt-text="Select the ServiceNow button.":::

1. Enter the following sync parameters in the ServiceNow Sync dialog box.

    :::image type="content" source="media/tutorial-servicenow/sync.png" alt-text="The ServiceNow sync dialog box.":::

     Parameter | Description |
    |--|--|
    | Enable Sync | Enable and disable the sync after defining parameters. |
    | Sync Frequency (minutes) | By default, information is pushed to ServiceNow every 60 minutes. The minimum is 5 minutes. |
    | ServiceNow Instance | Enter the ServiceNow instance URL. |
    | Client ID | Enter the Client ID you received for Defender for IoT in the **Application Registries** page in ServiceNow. |
    | Client Secret | Enter the Client Secret string you created for Defender for IoT in the **Application Registries** page in ServiceNow. |
    | Username | Enter the username for this instance. |
    | Password | Enter the password for this instance. |

1. Select **SAVE**.

Verify that the on-premises management console is connected to the ServiceNow instance by reviewing the Last Sync date.

:::image type="content" source="media/tutorial-servicenow/sync-confirmation.png" alt-text="Verify the communication occurred by looking at the last sync.":::

## Set up the integrations using a HTTPS proxy

When setting up the Defender for IoT and ServiceNow integration, the on-premises management console and the ServiceNow server communicate using port 443. If the ServiceNow server is behind a proxy, the default port cannot be used.

Defender for IoT supports an HTTPS proxy in the ServiceNow integration by enabling the change of the default port used for integration.

**To configure the proxy**:

1. Edit the global properties on the on-premises management console using the following command:

    ```bash
    sudo vim /var/cyberx/properties/global.properties
    ```

2. Add the following parameters:

    - `servicenow.http_proxy.enabled=1`

    - `servicenow.http_proxy.ip=1.179.148.9`

    - `servicenow.http_proxy.port=59125`

3. Select **Save and Exit**.

4. Reset the on-premises management console using the following command: 

    ```bash
    sudo monit restart all
    ```

After the configurations are set, all the ServiceNow data is forwarded using the configured proxy.

## Download the Defender for IoT application in ServiceNow

To access the Defender for IoT application within ServiceNow, you will need to download the application form the ServiceNow application store. 

**To access the Defender for IoT application in ServiceNow**:

1. Navigate to the [ServiceNow application store](https://store.servicenow.com/).

2. Search for `Defender for IoT` or `CyberX IoT/ICS Management`.

   :::image type="content" source="media/tutorial-servicenow/search-results.png" alt-text="Search for CyberX in the search bar.":::

3. Select the application.

   :::image type="content" source="media/tutorial-servicenow/cyberx-app.png" alt-text="Select the application from the list.":::

4. Select **Request App.**

   :::image type="content" source="media/tutorial-servicenow/sign-in.png" alt-text="Sign in to the application with your credentials.":::

5. Sign in, and download the application.

## View Defender for IoT detections in ServiceNow

This article describes the device attributes and alert information presented in ServiceNow.

**To view device attributes**:

1. Sign in to ServiceNow.

2. Navigate to **CyberX Platform**.

3. Navigate to **Inventory**, or **Alert**.

   [:::image type="content" source="media/tutorial-servicenow/alert-list.png" alt-text="Inventory or Alert":::](media/tutorial-servicenow/alert-list.png#lightbox)

## View connected devices

To view connected devices:

1. Select a device, and then select the **Appliance** listed in for that device.

    :::image type="content" source="media/tutorial-servicenow/appliance.png" alt-text="Select the desired appliance from the list.":::

1. In the **Device Details** dialog box, select **Connected Devices**.
<!-- 6. Clean up resources
Required. If resources were created during the tutorial. If no resources were created, 
state that there are no resources to clean up in this section.
-->

## Clean up resources

There are no resources to clean up

<!-- 7. Next steps
Required: A single link in the blue box format. Point to the next logical tutorial 
in a series, or, if there are no other tutorials, to some other cool thing the 
customer can do. 
-->

## Next steps

Advance to the next article to learn how to create...
> [!div class="nextstepaction"]
> [Next steps button](contribute-how-to-mvc-tutorial.md)

<!--
Remove all the comments in this template before you sign-off or merge to the 
main branch.
-->