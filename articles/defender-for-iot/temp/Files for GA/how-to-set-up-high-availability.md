---
title: Set up high availability
description: 
author: shhazam-ms
manager: rkarlin
ms.author: shhazam
ms.date: 11/1/2020
ms.topic: article
ms.service: azure
---
# Set up high availability

## About high availability

Increase the resiliency of your Defender for Iot deployment by installing a on-premises management console high availability appliance. High availability deployments ensure your managed sensors continuously report to an active on-premises management console.

This deployment is implemented with a on-premises management console pair that includes a primary and secondary appliance.

### About primary and secondary communication

When a primary and secondary on-premises management console is paired:

- A on-premises management console SLL certificate is applied to create a secure connection between the primary and secondary appliances. The SLL may be the self-signed certificate installed by default or a certificate installed by the customer.

- The primary on-premises management console data is automatically backed up to the secondary on-premises management console every 10 minutes. Contact <support@cyberx-labs.com> for information about changing the default setting. The on-premises management console configurations and device data are backed up. PCAP files and logs are not included in the backup. You can back up and restore of PCAPs and logs manually.

- The primary setup at the console is duplicated on the secondary. For example, system settings. If these settings are updated on the primary, they are also updated on the secondary.

- Before the license of the secondary expires, you should define it as the primary in order to update the license.

### About failover and failback

If a sensor cannot connect to the primary on-premises management console, it automatically connects to the secondary. Your system will be supported by both the primary and secondary simultaneously, if less than half of the sensors are communicating with the secondary. The secondary takes over when more than half of the sensors are communicating with it. Failover from the primary to the secondary takes approximately three minutes. When the failover occurs, the primary on-premises management console console freezes. When this happens, you can sign in to the secondary using the same sign in credentials.

During failover, sensors continue attempting to communicate with the primary appliance. When more than half the managed sensors succeed to communicate with the primary, the primary is restored. The following message appears at the secondary console when the primary is restored.

:::image type="content" source="media/secondary-console-message.png" alt-text="Screenshot of a message that appears at the secondary console when the primary is restored.":::

Sign back in to the primary appliance after redirection.

## High availability setup overview

The installation and configuration procedures are performed in four main stages:

1. Install a on-premises management console primary appliance. See the Defender for Iot Installation Guide for details.

2. Configure the on-premises management console primary appliance. For example, scheduled backup settings, VLAN settings. See the on-premises management console user guide for details. All settings are applied to the secondary appliance automatically after pairing.

3. Install a on-premises management console secondary appliance. See the Defender for Iot installation guide for details.

4. Pair the primary and secondary on-premises management console appliances as described [here](/create-the-primary-and-secondary-pair.md). The primary on-premises management console must manage at least two sensors in order to carry out the setup.

## High availability requirements

Verify that you have met the following High Availability requirements:

- Certificate Requirements

- Software/Hardware Requirements

- Network Access Requirements

#### Certificate Requirements

XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX INFORMATION NEEDS TO BE ADDED HERE XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX

#### Software and hardware requirements

- Both the primary and secondary on-premises management console appliances must be running identical hardware models and software versions.

- The high availability system can be set up by Defender for Iot users only, using CLI tools.

#### Network access requirements

You need to verify that your organizational security policy allows you access to the following services on the primary and secondary on-premises management console. These services also allow the connection between the sensors and secondary on-premises management console:

|Port|Service|Description|
|----|-------|-----------|
|**443/TCP**|HTTPS|Grants access to the on-premises management console web console.|
|**22/TCP**|SSH|Syncs the data between the primary and secondary on-premises management console appliances|
|**123/UDP**|NTP| The on-premises management console's NTP time sync. Verify that the active and passive appliances are defined with the same timezone.|

For a complete list of the system access requirements, see the Defender for Iot Installation Guide.

## Create the primary and secondary pair

Verify that both the primary and secondary on-premises management console appliances are powered on before starting the procedure.  

### On the Primary

1. Sign in to the CLI as a Defender for Iot user.

2. Run the following command on the primary:

```azurecli-interactive
sudo cyberx-management-trusted-hosts-add -ip <Slave ip>
```

>[!NOTE]
>In this document, the principal on-premises management console is referred to as the primary, and the agent is referred to as the secondary.

3. Enter the IP address of the secondary appliance in the ```<Slave ip>``` field and select Enter. The IP address is then validated, and the SSL certificate is downloaded to the primary. Entering the IP address also associates the sensors to the secondary appliance.

4. Run the following command on the primary to verify that the certificate is installed properly:

```azurecli-interactive
sudo cyberx-management-trusted-hosts-apply
```

5. Run the following command on the primary. **Do not run with sudo.**

```azurecli-interactive
cyberx-management-deploy-ssh-key <Slave ip>
```

This allows the connection between the primary and secondary appliances for backup and restoration purposes between them.

6. Enter the IP address of the secondary and select Enter.

### On the secondary

1. Sign in to the CLI as an Defender for Iot user.

2. Run the following command on the secondary. **Do not run with sudo**:

```azurecli-interactive
cyberx-management-deploy-ssh-key <Master's ip>
```

This allows the connection between the Primary and Secondary appliances for backup and restore purposes between them.

3. Enter the IP address of the primary and press Enter.

### Tracking high availability activity

The core application logs can be exported to the Defender for Iot support team to handle any high availability issues.  

To access the core logs:

1. Select **Export** from the **System Settings** window.
