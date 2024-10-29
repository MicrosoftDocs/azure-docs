---
title: Trouble shooting guide for OT sensor deployment - Microsoft Defender for IoT
description: A quick guide for the correct placement and mirroring of the OT sensor in your network for Microsoft Defender for IoT.
ms.topic: install-set-up-deploy
ms.date: 10/15/2024
---

# Trouble shooting guide for OT sensor deployment - Successful sensor deployment

Deploying sensors effectively is crucial for ensuring comprehensive network monitoring and security. This guide provides a step-by-step approach to successful sensor deployment, covering essential aspects such as:

- network architecture review,  

- sensor placement,  

- traffic mirroring methods,  

- and post-deployment validation.  

Follow these guidelines to optimize your sensor performance and achieve accurate and reliable network data collection.

## Deployment Steps

These are the following five deployment steps

1. Network architecture review

    Before the sensor can be applied to the network, it's crucial to review the network architecture. These steps include:

    - Reviewing the network diagram.

    - Estimating the total number of devices to be monitored.

    - Identifying VLANs that contain OT networks.

    - Determining the OT protocols expected to be monitored (Profinet, S7, Modbus etc..).

1. Sensor location

    The next step involves identifying the best location to install the sensor in the network. The sensor provides discovery and security value based on the traffic monitored and therefore it's important to identify the ideal place to locate the sensor. The location should give the sensor access to the following three important types of network traffic:

    | Type | Description|
    |---|---|
    |Layer 2 (L2) Traffic | L2 traffic, which includes protocols such as ARP and DHCP, is a critical indicator of the sensor's placement. When a sensor is correctly positioned, it accurately captures the MAC addresses of devices. This vital information provides vendor indicators, which in turn enhances the sensor's ability to classify devices more effectively. Ensuring that the sensor can receive L2 traffic means that it is in a location where it can gather precise and valuable data about the network's devices.<!-- sentence seems repetative? --> |
    | OT Protocols | OT protocols are essential for extracting detailed information about devices within the network. These protocols provide crucial data that leads to high classification coverage. By analyzing OT protocol traffic, the sensor can gather comprehensive details about each device, such as its model, firmware version, and other relevant characteristics. This level of detail is necessary for maintaining an accurate and up-to-date inventory of all devices, which is crucial for network management and security. |
    | Inner Subnet Communication | In OT networks, devices primarily communicate within the same subnet. This inner subnet communication contains most of the information needed to ensure the quality of the data collected by the sensors. Placing sensors where they can capture this type of communication is vital. It allows the sensors to monitor the interactions between devices, which often include critical data. By capturing these packets, the sensors can provide a detailed and accurate picture of the network.|

    **Validation of the sensor location**

    After deciding on a potential location for the sensor, users should validate the presence of L2 and OT protocols. It's recommended to use tools like Wireshark to verify these protocols at the potential sensor location. For example:

    :::image type="content" source="media/guide/deployment-guide-analyzer.png" alt-text="Screenshot of the wireshark program used to confirm and validate OT sensor set up and network protocols communicating with the newly deployed OT sensor":::

    Wireshark displays the list of protocols identified by the sensor and the amount of data being monitored, thereby validating the location of your sensor. If protocols don't appear or don't detect any data, this indicates that the sensor is incorrectly placed or set up in the network. For example:

    :::image type="content" source="media/guide/deployment-guide-protocols.png" alt-text="Screenshot of the wireshark program protocol output used to confirm and validate OT sensor set up and network protocols communicating with the newly deployed OT sensor":::

    This step is crucial to ensure effective monitoring of OT networks.

1. Traffic Mirroring Methods

    There are three types of traffic mirroring methods, that are designed for specific usage scenarios. Choose the best method based on the usage and size of your network.

    1. Switched Port Analyzer (SPAN)

        SPAN is a local traffic mirroring technique used within a single switch or a switch stack. It allows network administrators to duplicate traffic from specified source ports or VLANs to a destination port where the monitoring device, such as a network sensor or analyzer, is connected. For example:

        **How It Works:**  Set up:
        Source Ports/VLANs: Configure the switch to mirror traffic from selected ports or VLANs.

        Destination Port: The mirrored traffic is sent to a designated port on the same switch. This port is connected to your monitoring device.

        :::image type="content" source="media/guide/deployment-guide-SPAN.png" alt-text="Diagram to explain the setup of the local SPAN traffic mirroring between the OT network and the sensor.":::

        |**Usage Scenario:** |Ideal for monitoring and analyzing traffic within a single switch or a small network segment.|
        |---|---|
        | Benefits | - Simplicity: Easy to configure and manage. <br> - Low Latency: Since it’s confined to a single switch, it introduces minimal delay.|
        | Limitations | Local Scope: Limited to monitoring within the same switch, which might not be sufficient for larger networks.|

        |Mirroring type| Switched Port Analyzer (SPAN) |
        |---|---|
        |Usage Scenario | Ideal for monitoring and analyzing traffic within a single switch or a small network segment.|
        |Description| SPAN is a local traffic mirroring technique used within a single switch or a switch stack. It allows network administrators to duplicate traffic from specified source ports or VLANs to a destination port where the monitoring device, such as a network sensor or analyzer, is connected. |
        |Mirroring set up | - Source Ports/VLANs: Configure the switch to mirror traffic from selected ports or VLANs.<br>  - Destination Port: The mirrored traffic is sent to a designated port on the same switch. This port is connected to your monitoring device.|
        | Benefits | - Simplicity: Easy to configure and manage. <br> - Low Latency: Since it’s confined to a single switch, it introduces minimal delay.|
        | Limitations | Local Scope: Limited to monitoring within the same switch, which might not be sufficient for larger networks.|

    1. Remote SPAN (RSPAN)

        RSPAN extends the capabilities of SPAN by allowing traffic to be mirrored across multiple switches. It's designed for environments where monitoring needs to occur over different switches or switch stacks.

        How It Works:

        Source Ports/VLANs: Traffic is mirrored from specified source ports or VLANs on a source switch.

        RSPAN VLAN: The mirrored traffic is sent to a special RSPAN VLAN that spans multiple switches.

        Destination Port: The traffic is then extracted from this RSPAN VLAN at a designated port on a remote switch where the monitoring device is connected.

        :::image type="content" source="media/guide/deployment-guide-RSPAN.png" alt-text="Diagram to explain the set up of the remote SPAN (RSPAN) traffic mirroring between the OT network and the sensor":::

        |Usage Scenario | Suitable for larger networks or scenarios where traffic needs to be monitored across different network segments.|
        |---|---|
        |Benefits: | - Extended Coverage: Allows for monitoring across multiple switches.<br> - Flexibility: Can be used to monitor traffic from different parts of the network. |
        |Complexity | Network Load: Potentially increases the load on the network due to the RSPAN VLAN traffic.|

        |Mirroring type| Remote SPAN (RSPAN)  |
        |---|---|
        |Usage Scenario | Suitable for larger networks or scenarios where traffic needs to be monitored across different network segments.|
        |Description| RSPAN extends the capabilities of SPAN by allowing traffic to be mirrored across multiple switches. It's designed for environments where monitoring needs to occur over different switches or switch stacks. |
        |Mirroring set up | - Source Ports/VLANs: Traffic is mirrored from specified source ports or VLANs on a source switch.<br> - RSPAN VLAN: The mirrored traffic is sent to a special RSPAN VLAN that spans multiple switches. <br> - Destination Port: The traffic is then extracted from this RSPAN VLAN at a designated port on a remote switch where the monitoring device is connected.|
        | Benefits | - Extended Coverage: Allows for monitoring across multiple switches.<br> - Flexibility: Can be used to monitor traffic from different parts of the network. |
        |Complexity | Network Load: Potentially increases the load on the network due to the RSPAN VLAN traffic.|

    1. Encapsulated Remote SPAN (ERSPAN)

        ERSPAN takes RSPAN a step further by encapsulating mirrored traffic in Generic Routing Encapsulation (GRE) packets. This method enables traffic mirroring across different network segments or even across the internet.

        :::image type="content" source="media/guide/deployment-guide-ERSPAN.png" alt-text="Diagram to explain the set up of the encapuslated remote SPAN (ERSPAN) traffic mirroring between the OT network and the sensor":::

        How It Works:

        Source Ports/VLANs: Similar to SPAN and RSPAN, traffic is mirrored from specified source ports or VLANs.

        Encapsulation: The mirrored traffic is encapsulated in GRE packets, which can then be routed across IP networks. <!-- where does the encaplusation occur?? -->

        Destination Port: The encapsulated traffic is sent to a monitoring device connected to a destination port where the GRE packets are decapsulated and analyzed.

        |Usage Scenario | Ideal for monitoring traffic over diverse or geographically dispersed networks, including remote sites.|
        |---|---|
        | Benefits | - Broad Coverage: Enables monitoring across different IP networks and locations. <br> - Flexibility: Can be used in scenarios where traffic needs to be monitored over long distances or through complex network paths.|

        |Mirroring type| Encapsulated Remote SPAN (ERSPAN)  |
        |---|---|
        |Usage Scenario | Ideal for monitoring traffic over diverse or geographically dispersed networks, including remote sites.|
        |Description| ERSPAN takes RSPAN a step further by encapsulating mirrored traffic in Generic Routing Encapsulation (GRE) packets. This method enables traffic mirroring across different network segments or even across the internet. |
        |Mirroring set up | - Source Ports/VLANs: Similar to SPAN and RSPAN, traffic is mirrored from specified source ports or VLANs.<br> - Encapsulation: The mirrored traffic is encapsulated in GRE packets, which can then be routed across IP networks. <!-- where does the encaplusation occur?? --> <br> - Destination Port: The encapsulated traffic is sent to a monitoring device connected to a destination port where the GRE packets are decapsulated and analyzed.|
        | Benefits | - Broad Coverage: Enables monitoring across different IP networks and locations. <br> - Flexibility: Can be used in scenarios where traffic needs to be monitored over long distances or through complex network paths.|

  1. Switched Port Analyzer (SPAN)

        :::image type="content" source="media/guide/deployment-guide-SPAN.png" alt-text="Diagram to explain the setup of the local SPAN traffic mirroring between the OT network and the sensor.":::

        |Mirroring type| Switched Port Analyzer (SPAN) |
        |---|---|
        |Usage Scenario | Ideal for monitoring and analyzing traffic within a single switch or a small network segment.|
        |Description| SPAN is a local traffic mirroring technique used within a single switch or a switch stack. It allows network administrators to duplicate traffic from specified source ports or VLANs to a destination port where the monitoring device, such as a network sensor or analyzer, is connected. |
        |Mirroring set up | - Source Ports/VLANs: Configure the switch to mirror traffic from selected ports or VLANs.<br>  - Destination Port: The mirrored traffic is sent to a designated port on the same switch. This port is connected to your monitoring device.|
        | Benefits | - Simplicity: Easy to configure and manage. <br> - Low Latency: Since it’s confined to a single switch, it introduces minimal delay.|
        | Limitations | Local Scope: Limited to monitoring within the same switch, which might not be sufficient for larger networks.|

    1. Remote SPAN (RSPAN)

        :::image type="content" source="media/guide/deployment-guide-RSPAN.png" alt-text="Diagram to explain the set up of the remote SPAN (RSPAN) traffic mirroring between the OT network and the sensor":::

        |Mirroring type| Remote SPAN (RSPAN)  |
        |---|---|
        |Usage Scenario | Suitable for larger networks or scenarios where traffic needs to be monitored across different network segments.|
        |Description| RSPAN extends the capabilities of SPAN by allowing traffic to be mirrored across multiple switches. It's designed for environments where monitoring needs to occur over different switches or switch stacks. |
        |Mirroring set up | - Source Ports/VLANs: Traffic is mirrored from specified source ports or VLANs on a source switch.<br> - RSPAN VLAN: The mirrored traffic is sent to a special RSPAN VLAN that spans multiple switches. <br> - Destination Port: The traffic is then extracted from this RSPAN VLAN at a designated port on a remote switch where the monitoring device is connected.|
        | Benefits | - Extended Coverage: Allows for monitoring across multiple switches.<br> - Flexibility: Can be used to monitor traffic from different parts of the network. |
        |Complexity | Network Load: Potentially increases the load on the network due to the RSPAN VLAN traffic.|

    1. Encapsulated Remote SPAN (ERSPAN)

        :::image type="content" source="media/guide/deployment-guide-ERSPAN.png" alt-text="Diagram to explain the set up of the encapuslated remote SPAN (ERSPAN) traffic mirroring between the OT network and the sensor":::

        |Mirroring type| Encapsulated Remote SPAN (ERSPAN)  |
        |---|---|
        |Usage Scenario | Ideal for monitoring traffic over diverse or geographically dispersed networks, including remote sites.|
        |Description| ERSPAN takes RSPAN a step further by encapsulating mirrored traffic in Generic Routing Encapsulation (GRE) packets. This method enables traffic mirroring across different network segments or even across the internet. |
        |Mirroring set up | - Source Ports/VLANs: Similar to SPAN and RSPAN, traffic is mirrored from specified source ports or VLANs.<br> - Encapsulation: The mirrored traffic is encapsulated in GRE packets, which can then be routed across IP networks. <!-- where does the encaplusation occur?? --> <br> - Destination Port: The encapsulated traffic is sent to a monitoring device connected to a destination port where the GRE packets are decapsulated and analyzed.|
        | Benefits | - Broad Coverage: Enables monitoring across different IP networks and locations. <br> - Flexibility: Can be used in scenarios where traffic needs to be monitored over long distances or through complex network paths.|

    **Select mirroring method**

    When selecting a mirroring method, consider the following factors:

    |Factors| Description |
    |---|---|
    |Network Size and Layout | - SPAN is suitable for local monitoring. <br>- RSPAN for larger, multi-switch environments <br> - ERSPAN for geographically dispersed or complex networks.|
    |Traffic Volume | Ensure that the chosen method can handle the volume of traffic without introducing significant latency or network load.|
    |Monitoring Needs| Determine if traffic is captured locally or across different network segments and choose the appropriate method.|

    By selecting the appropriate mirroring method, you ensure that your network sensor captures the necessary Layer 2 (L2) traffic, and provides high-quality data for accurate inventory and traffic analysis.

    **Choosing the Right Method**

    When selecting a mirroring method, consider the following factors:

    Network Size and Layout: SPAN is suitable for local monitoring, RSPAN for larger, multi-switch environments, and ERSPAN for geographically dispersed or complex networks.

    Traffic Volume: Ensure that the chosen method can handle the volume of traffic without introducing significant latency or network load.

    Monitoring Needs: Determine if you need to capture traffic locally or across different network segments and choose the method that best meets those needs.

    By selecting the appropriate mirroring method, you can ensure that your network sensor captures the necessary Layer 2 (L2) traffic, providing high-quality data for accurate inventory and traffic analysis.

1. Deploy the sensor

    After choosing the sensor location and the mirroring method the user can move forward and install the sensors.

1. Post deployment validation

    It's essential to validate the monitoring interfaces and activate them. We recommend using the Deployment tool in the sensor system setting to monitor the current networks being sent to the sensor.  

    :::image type="content" source="media/guide/deployment-guide-post-deployment-system-settings.png" alt-text="Screenshot of the OT sensor systems settings screen, highlighting the Deployment box to be used to help validate the post OT sensor deployment.":::

    Key steps include:

    - Verifying that the number of devices in the inventory is reasonable.

    - Ensuring type classification for devices listed in the inventory.

    - Confirming the visibility of OT protocol names on the device’s inventory.

    - Assure L2 protocols are monitored by seeing MAC addresses in the inventory.

    If information is lacking, review the SPAN configuration and recheck the deployment tool in the sensor which provides visibility of the subnets monitored and the status of the OT protocols, for example:

    :::image type="content" source="media/guide/deployment-guide-post-deployment-analyze.png" alt-text="Screenshot of the OT sensor Analyze feature screen used to help validate the post OT sensor deployment.":::

### Network diagram examples

This needs an introduction or further descriptions.<!--Theo-->

**L2 traffic**

:::image type="content" source="media/guide/deployment-guide-network-diagram-l2-traffic.png" alt-text="Diagram to demonstrate the components set up of the L2 traffic monitoring setup.":::

**Cross L2 traffic**

:::image type="content" source="media/guide/deployment-guide-network-diagram-cross-l2-traffic.png" alt-text="Diagram to demonstrate the components set up of the cross L2 traffic monitoring setup.":::

**Cross L3 traffic**

:::image type="content" source="media/guide/deployment-guide-network-diagram-cross-l3-traffic.png" alt-text="Diagram to demonstrate the components set up of the cross L3 traffic monitoring setup.":::
