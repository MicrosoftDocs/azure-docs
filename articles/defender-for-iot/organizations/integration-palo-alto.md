---
title: Palo Alto integration
description: Defender for IoT has integrated its continuous ICS threat monitoring platform with Palo Alto’s next-generation firewalls to enable blocking of critical threats, faster and more efficiently.
ms.date: 1/17/2021
ms.topic: article
---

# About the Palo Alto integration

Defender for IoT has integrated its continuous ICS threat monitoring platform with Palo Alto’s next-generation firewalls to enable blocking of critical threats, faster and more efficiently.

The following integration types are available:

- Automatic blocking option: Direct Defender for IoT-Palo Alto integration

- Sending recommendations for blocking to the central management system: Defender for IoT-Panorama integration

## Configure immediate blocking by specified Palo Alto firewall

In critical cases, such as malware-related alerts, you can enable automatic blocking. This is done by configuring a forwarding rule in Defender for IoT that sends blocking command directly to a specific Palo Alto firewall.

When Defender for IoT identifies a critical threat, it sends an alert that includes an option of blocking the infected source. Selecting **Block Source** in the alert’s details activates the forwarding rule, which sends the blocking command to the specified Palo Alto firewall.

To configure:

1. In the left pane, select **Forwarding**.

   :::image type="content" source="media/integration-paloalto/forwarding.png" alt-text="The forwarding alert screen.":::

1. Select **Create Forwarding Rule**.

   :::image type="content" source="media/integration-paloalto/forward-rule.png" alt-text="Create Forwarding Rule":::

1. To configure the Palo Alto NGFW Forwarding Rule:  
 
   - Define the standard rule parameters and from the **Actions** drop-down box, select **Send to Palo Alto NGFW**.
   
   :::image type="content" source="media/integration-paloalto/edit.png" alt-text="Edit your Forwarding Rule.":::

1. In the Actions pane, set the following parameters:

   - **Host**: Enter the NGFW server IP address.
   - **Port**: Enter the NGFW server port.
   - **Username**: Enter the NGFW server username.
   - **Password**: Enter the NGFW server password.
   - **Configure**: Set up the following options to allow blocking of the suspicious sources by the Palo Alto firewall:
     - **Block illegal function codes**: Protocol violations - Illegal field value violating ICS protocol specification (potential exploit).
     - **Block unauthorized PLC programming/firmware updates**: Unauthorized PLC changes.
     - **Block unauthorized PLC stop**: PLC stop (downtime).
     - **Block malware-related alerts**: Blocking of industrial malware attempts (TRITON, NotPetya, etc.). You can select the option of **Automatic blocking**. In that case, the blocking is executed automatically and immediately.
     - **Block unauthorized scanning**: Unauthorized scanning (potential reconnaissance).
     
1. Select **Submit**.

To block the suspicious source: 

1. In the **Alerts** pane, select the alert related to Palo Alto integration. The **Alert Details** dialog box appears.
   
   :::image type="content" source="media/integration-paloalto/unauthorized.png" alt-text="Alert details":::

1. To automatically block the suspicious source, select **Block Source**. The **Please Confirm** dialog box appears.

   :::image type="content" source="media/integration-paloalto/please.png" alt-text="Confirm blocking on the Please Confirm screen.":::

1. In the **Please Confirm** dialog box, select **OK**. The suspicious source is blocked by the Palo Alto firewall.

## Sending blocking policies to Palo Alto Panorama

Defender for IoT and Palo Alto Networks have an off-the-shelf integration that automatically creates new policies in Palo Alto Networks NMS, Panorama. This integration requires confirmation by the Panorama Administrator and does not allow automatic blocking.

The integration is intended for the following incidents:

- **Unauthorized PLC changes:** An update to the ladder logic or firmware of an device. This can represent a legitimate activity or an attempt to compromise the device. The compromise could happen by inserting malicious code, such as a Remote Access Trojan (RAT) or parameters causing the physical process, such as a spinning turbine, to operate in an unsafe manner.

- **Protocol Violation:** An packet structure or field value that violates the protocol specification. This can represent a misconfigured application or a malicious attempt to compromise the device. For example, causing a buffer overﬂow condition in the target device.

- **PLC Stop:** A command that causes the device to stop functioning, thereby risking the physical process that is being controlled by the PLC.

- **Industrial malware found in the ICS network:** Malware that manipulates ICS devices using their native protocols, such as TRITON and Industroyer. Defender for IoT also detects IT malware that has moved laterally into the ICS and SCADA environment, such as Conficker, WannaCry, and NotPetya.

- **Scanning malware:** Reconnaissance tools that collect data about system configuration in a pre-attack phase. For example, the Havex Trojan scans industrial networks for devices using OPC, which is a standard protocol used by Windows-based SCADA systems to communicate with ICS devices.

## The process

When Defender for IoT detects a pre-configured use case, the **Block Source** button is added to the alert. Then, when the **CyberX** user selects the **Block Source** button, Defender for IoT creates policies on the Panorama by sending the predefined forwarding rule.

The policy is applied only when the Panorama administrator pushes it to the relevant NGFW in the network.

In IT networks, there may be dynamic IP addresses. Therefore, for those subnets, the policy must be based on FQDN (DNS name) and not the IP address. Defender for IoT performs reverse lookup and matches devices with dynamic IP address to their FQDN (DNS name) every configured number of hours.

In addition, Defender for IoT sends an email to the relevant Panorama user to notify that a new policy created by Defender for IoT is waiting for the approval. The figure below presents the Defender for IoT-Panorama Integration Architecture.

:::image type="content" source="media/integration-paloalto/structure.png" alt-text="CyberX-Panorama Integration Architecture":::

## Create Panorama blocking policies in Defender for IoT configuration

### To configure DNS Lookup

1. In the left pane, select **System Settings**.

1. In the **System Settings** pane, select **DNS Settings** :::image type="icon" source="media/integration-paloalto/settings.png":::.

   :::image type="content" source="media/integration-paloalto/configuration.png" alt-text="Configure the DNS settings.":::

1. In the **Edit DNS Settings** dialog box, set the following parameters:

   - **Status**: The status of the DNS resolver.

   - **DNS Server Address**: Enter the IP address, or the FQDN of the network DNS Server.
   - **DNS Server Port**: Enter the port used to query the DNS server.
   - **Subnets**: Set the Dynamic IP address subnet range. The range that Defender for IoT reverses lookup their IP address in the DNS server to match their current FQDN name.
   - **Schedule Reverse Lookup**: Define the scheduling options as follows:
     - By specific times: Specify when to perform the reverse lookup daily.
     - By fixed intervals (in hours): Set the frequency for performing the reverse lookup.
   - **Number of Labels**: Instruct Defender for IoT to automatically resolve network IP addresses to device FQDNs. <br />To configure DNS FQDN resolution, add the number of domain labels to display. Up to 30 characters are displayed from left to right.
1. Select **SAVE**.
1. To ensure your DNS settings are correct, select **Lookup Test**. The test ensures that the DNS server IP address and DNS server port are set correctly.

### To configure a Forwarding Rule to blocks suspected traffic with the Palo Alto firewall

1. In the left pane, select **Forwarding**. The Forwarding pane appears.

   :::image type="content" source="media/integration-paloalto/forward.png" alt-text="The forwarding screen.":::

1. In the **Forwarding** pane, select **Create Forwarding Rule**.

   :::image type="content" source="media/integration-paloalto/forward-rule.png" alt-text="Create Forwarding Rule":::

1. To configure the Palo Alto Panorama Forwarding Rule:

   Define the standard rule parameters and from the **Actions** drop-down box, select **Send to Palo Alto Panorama**. The action details pane appears.

   :::image type="content" source="media/integration-paloalto/details.png" alt-text="Select action":::

1. In the Actions pane, set the following parameters:

   - **Host**: Enter the Panorama server IP address.

   - **Port**: Enter the Panorama server port.
   - **Username**: Enter the Panorama server username.
   - **Password**: Enter the Panorama server password.
   - **Report Address**: Define how the blocking is executed, as follows:
   
     - **By IP Address**: Always creates blocking policies on Panorama based on the IP address.
     
     - **By FQDN or IP Address**: Creates blocking policies on Panorama based on FQDN if it exists, otherwise by the IP Address.
     
   - **Email**: Set the email address for the policy notification email
     > [!NOTE]
     > Make sure you have configured a Mail Server in the Defender for IoT. If no email address is entered, Defender for IoT does not send a notification email.
   - **Execute a DNS lookup upon alert detection (Checkbox)**: When the By FQDN, or IP Address option is set in the Report Address. This checkbox is selected by default. If only the IP address is set, this option is disabled..
   - **Configure**: Set up the following options to allow blocking of the suspicious sources by the Palo Alto Panorama:
   
     - **Block illegal function codes**: Protocol violations - Illegal field value violating ICS, protocol specification (potential exploit).
     
     - **Block unauthorized PLC programming/firmware updates**: Unauthorized PLC changes.
     
     - **Block unauthorized PLC stop**: PLC stop (downtime).
     
     - **Block malware-related alerts**: Blocking of industrial malware attempts (TRITON, NotPetya, etc.). You can select the option of **Automatic blocking**. In that case, the blocking is executed automatically and immediately.
     
     - **Block unauthorized scanning**: Unauthorized scanning (potential reconnaissance).
     
1. Select **Submit**.

### To block the suspicious source

1. In the **Alerts** pane, select the alert related to Palo Alto integration. The **Alert’s Details** dialog box appears.

   :::image type="content" source="media/integration-paloalto/unauthorized.png" alt-text="Alert details":::        

1. To automatically block the suspicious source, select **Block Source**.

1. In the **Please Confirm** dialog box, select **OK.**

   :::image type="content" source="media/integration-paloalto/please.png" alt-text="Confirm":::

## Next steps

Learn how to [Forward alert information](how-to-forward-alert-information-to-partners.md).
