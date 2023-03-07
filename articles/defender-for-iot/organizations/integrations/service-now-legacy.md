---
title: Microsoft Defender for IoT integration with ServiceNow (legacy)
description: In this tutorial, learn how to integrate the legacy ServiceNow integration with Microsoft Defender for IoT.
ms.topic: tutorial
ms.date: 08/11/2022
---

# Tutorial: Integrate ServiceNow with Microsoft Defender for IoT (legacy)

> [!Note]
> A new [Operational Technology Manager](https://store.servicenow.com/sn_appstore_store.do#!/store/application/31eed0f72337201039e2cb0a56bf65ef/1.1.2?referer=%2Fstore%2Fsearch%3Flistingtype%3Dallintegrations%25253Bancillary_app%25253Bcertified_apps%25253Bcontent%25253Bindustry_solution%25253Boem%25253Butility%25253Btemplate%26q%3Doperational%2520technology%2520manager&sl=sh) integration is now available from the ServiceNow store. The new integration streamlines Microsoft Defender for IoT sensor appliances, OT assets, network connections, and vulnerabilities to ServiceNow’s Operational Technology (OT) data model.
>
>Please read the ServiceNow’s supporting links and docs for the ServiceNow's terms of service.
>
>Microsoft Defender for IoT's legacy integration with ServiceNow is not affected by the new integrations and Microsoft will continue supporting it.  
>
> For more information, see the new [ServiceNow integrations](../tutorial-servicenow.md), and the ServiceNow documentation on the ServiceNow store:
>- [Service Graph Connector (SGC)](https://store.servicenow.com/sn_appstore_store.do#!/store/application/ddd4bf1b53f130104b5cddeeff7b1229)
>- [Vulnerability Response (VR)](https://store.servicenow.com/sn_appstore_store.do#!/store/application/463a7907c3313010985a1b2d3640dd7e).

This tutorial will help you learn how to integrate, and use ServiceNow with Microsoft Defender for IoT.

The Defender for IoT integration with ServiceNow provides a new level of centralized visibility, monitoring, and control for the IoT and OT landscape. These bridged platforms enable automated device visibility and threat management to previously unreachable ICS & IoT devices.

The ServiceNow Configuration Management Database (CMDB) is enriched, and supplemented with a rich set of device attributes that are pushed by the Defender for IoT platform. This ensures a comprehensive, and continuous visibility into the device landscape. This visibility lets you monitor, and respond from a single-pane-of-glass. 

In this tutorial, you learn how to:

> [!div class="checklist"]
> * Download the Defender for IoT application in ServiceNow
> * Set up Defender for IoT to communicate with ServiceNow
> * Create access tokens in ServiceNow
> * Send Defender for IoT device attributes to ServiceNow
> * Set up the integration using an HTTPS proxy
> * View Defender for IoT detections in ServiceNow
> * View connected devices

## Prerequisites

### Software requirements

Access to ServiceNow and Defender for IoT 

- ServiceNow Service Management version 3.0.2.

- Defender for IoT patch 2.8.11.1 or above.

> [!Note]
>If you are already working with a Defender for IoT and ServiceNow integration and upgrade using the on-premises management console. In that case, the previous data from Defender for IoT sensors should be cleared from ServiceNow.

### Architecture

- **On-premises management console architecture**: Set up an on-premises management console to communicate with one instance of ServiceNow. The on-premises management console pushes sensor data to the Defender for IoT application using REST API.

    To set up your system to work with an on-premises management console, you will need to disable the ServiceNow Sync, Forwarding Rules, and Proxy configurations on any sensors where they were set up.

- **Sensor architecture**: If you want to set up your environment to include direct communication between sensors and ServiceNow, for each sensor define the ServiceNow Sync, Forwarding rules, and proxy configuration (if a proxy is needed).

## Download the Defender for IoT application in ServiceNow

To access the Defender for IoT application within ServiceNow, you will need to download the application from the ServiceNow application store. 

**To access the Defender for IoT application in ServiceNow**:

1. Navigate to the [ServiceNow application store](https://store.servicenow.com/).

1. Search for `Defender for IoT` or `CyberX IoT/ICS Management`.

   :::image type="content" source="../media/tutorial-servicenow/search-results.png" alt-text="Screenshot of the search screen in ServiceNow.":::

1. Select the application.

   :::image type="content" source="../media/tutorial-servicenow/cyberx-app.png" alt-text="Screenshot of the search screen results.":::

1. Select **Request App**.

   :::image type="content" source="../media/tutorial-servicenow/sign-in.png" alt-text="Sign in to the application with your credentials.":::

1. Sign in, and download the application.

## Set up Defender for IoT to communicate with ServiceNow

Configure Defender for IoT to push alert information to the ServiceNow tables. Defender for IoT alerts will appear in ServiceNow as security incidents. This can be done by defining a Defender for IoT forwarding rule to send alert information to ServiceNow.

**To push alert information to the ServiceNow tables**:

1. Sign in to the on-premises management console.

1. Select **Forwarding**, in the left side pane.

1. Select the :::image type="icon" source="../media/tutorial-servicenow/plus-icon.png" border="false"::: button.

    :::image type="content" source="../media/tutorial-servicenow/forwarding-rule.png" alt-text="Screenshot of the Create Forwarding Rule window.":::

1. Add a rule name.

1. Define criteria under which Defender for IoT will trigger the forwarding rule. Working with Forwarding rule criteria helps pinpoint and manage the volume of information sent from Defender for IoT to ServiceNow. The following options are available:

    - **Severity levels:** This is the minimum-security level incident to forward. For example, if **Minor** is selected, minor alerts, and any alert above this severity level will be forwarded. Levels are pre-defined by Defender for IoT.

    - **Protocols:** Only trigger the forwarding rule if the traffic detected was running over specific protocols. Select the required protocols from the drop-down list or choose them all.

    - **Engines:** Select the required engines or choose them all. Alerts from selected engines will be sent.

1. Verify that **Report Alert Notifications** is selected.

1. In the Actions section, select **Add** and then select **ServiceNow**.

    :::image type="content" source="../media/tutorial-servicenow/select-servicenow.png" alt-text="Select ServiceNow from the dropdown options.":::

1. Enter the ServiceNow action parameters:

    :::image type="content" source="../media/tutorial-servicenow/parameters.png" alt-text="Fill in the ServiceNow action parameters.":::

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

## Create access tokens in ServiceNow

A token is needed in order to allow ServiceNow to communicate with Defender for IoT.

You'll need the `Client ID` and `Client Secret` that you entered when creating the Defender for IoT Forwarding rules. The Forwarding rules forward alert information to ServiceNow, and when configuring Defender for IoT to push device attributes to ServiceNow tables.

## Send Defender for IoT device attributes to ServiceNow

Configure Defender for IoT to push an extensive range of device attributes to the ServiceNow tables. To send attributes to ServiceNow, you must map your on-premises management console to a ServiceNow instance. This ensures that the Defender for IoT platform can communicate and authenticate with the instance.

**To add a ServiceNow instance**:

1. Sign in to your Defender for IoT on-premises management console.

1. Select **System Settings**, and then **ServiceNow** from the on-premises management console Integration section.

      :::image type="content" source="../media/tutorial-servicenow/servicenow.png" alt-text="Screenshot of the select the ServiceNow button.":::

1. Enter the following sync parameters in the ServiceNow Sync dialog box.

    :::image type="content" source="../media/tutorial-servicenow/sync.png" alt-text="Screenshot of the ServiceNow sync dialog box.":::

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

:::image type="content" source="../media/tutorial-servicenow/sync-confirmation.png" alt-text="Screenshot of the communication occurring by looking at the last sync.":::

## Set up the integrations using an HTTPS proxy

When setting up the Defender for IoT and ServiceNow integration, the on-premises management console and the ServiceNow server communicate using port 443. If the ServiceNow server is behind a proxy, the default port can't be used.

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

## View Defender for IoT detections in ServiceNow

This article describes the device attributes and alert information presented in ServiceNow.

**To view device attributes**:

1. Sign in to ServiceNow.

2. Navigate to **CyberX Platform**.

3. Navigate to **Inventory**, or **Alert**.

   [:::image type="content" source="../media/tutorial-servicenow/alert-list.png" alt-text="Screenshot of the Inventory or Alert.":::](../media/tutorial-servicenow/alert-list.png#lightbox)

## View connected devices

To view connected devices:

1. Select a device, and then select the **Appliance** listed in for that device.

    :::image type="content" source="../media/tutorial-servicenow/appliance.png" alt-text="Screenshot of the desired appliance from the list.":::

1. In the **Device Details** dialog box, select **Connected Devices**.

## Clean up resources

There are no resources to clean up.

## Next steps

In this article, you learned how to get started with the ServiceNow integration. Continue on to learn about our [Cisco integration](../tutorial-forescout.md).