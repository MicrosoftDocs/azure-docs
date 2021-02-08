---
title: Set up high availability
description: Increase the resiliency of your Defender for IoT deployment by installing a on-premises management console high availability appliance. High availability deployments ensure your managed sensors continuously report to an active on-premises management console.
author: shhazam-ms
manager: rkarlin
ms.author: shhazam
ms.date: 12/07/2020
ms.topic: how-to
ms.service: azure
---
# About high availability

Increase the resiliency of your Defender for IoT deployment by installing a on-premises management console high availability appliance. High availability deployments ensure your managed sensors continuously report to an active on-premises management console.

This deployment is implemented with an on-premises management console pair that includes a primary and secondary appliance.

## About primary and secondary communication

When a primary and secondary on-premises management console is paired:

- An on-premises management console SLL certificate is applied to create a secure connection between the primary and secondary appliances. The SLL may be the self-signed certificate installed by default or a certificate installed by the customer.

- The primary on-premises management console data is automatically backed up to the secondary on-premises management console every 10 minutes. The on-premises management console configurations and device data are backed up. PCAP files and logs are not included in the backup. You can back up and restore of PCAPs and logs manually.

- The primary setup at the management console is duplicated on the secondary; for example, system settings. If these settings are updated on the primary, they are also updated on the secondary.

- Before the license of the secondary expires, you should define it as the primary in order to update the license.

## About failover and failback

If a sensor cannot connect to the primary on-premises management console, it automatically connects to the secondary. Your system will be supported by both the primary and secondary simultaneously, if less than half of the sensors are communicating with the secondary. The secondary takes over when more than half of the sensors are communicating with it. Fail over from the primary to the secondary takes approximately three minutes. When the failover occurs, the primary on-premises management console freezes. When this happens, you can sign in to the secondary using the same sign-in credentials.

During failover, sensors continue attempting to communicate with the primary appliance. When more than half the managed sensors succeed to communicate with the primary, the primary is restored. The following message appears at the secondary console when the primary is restored.

:::image type="content" source="media/how-to-set-up-high-availability/secondary-console-message.png" alt-text="Screenshot of a message that appears at the secondary console when the primary is restored.":::

Sign back in to the primary appliance after redirection.

## High availability setup overview

The installation and configuration procedures are performed in four main stages:

1. Install an on-premises management console primary appliance. 

2. Configure the on-premises management console primary appliance. For example, scheduled backup settings, VLAN settings. See the on-premises management console user guide for details. All settings are applied to the secondary appliance automatically after pairing.

3. Install a on-premises management console secondary appliance. For more information see, [About the Defender for IoT Installation](how-to-install-software.md).

4. Pair the primary and secondary on-premises management console appliances as described [here](https://infrascale.secure.force.com/pkb/articles/Support_Article/How-to-access-your-Appliance-Management-Console). The primary on-premises management console must manage at least two sensors in order to carry out the setup.

## High availability requirements

Verify that you have met the following high availability requirements:

- Certificate requirements

- Software and hardware requirements

- Network access requirements

### Software and hardware requirements

- Both the primary and secondary on-premises management console appliances must be running identical hardware models and software versions.

- The high availability system can be set up by Defender for IoT users only, using CLI tools.

### Network access requirements

You need to verify that your organizational security policy allows you access to the following services on the primary and secondary on-premises management console. These services also allow the connection between the sensors and secondary on-premises management console:

|Port|Service|Description|
|----|-------|-----------|
|**443 or TCP**|HTTPS|Grants access to the on-premises management console web console.|
|**22 or TCP**|SSH|Syncs the data between the primary and secondary on-premises management console appliances|
|**123 or UDP**|NTP| The on-premises management console's NTP time sync. Verify that the active and passive appliances are defined with the same timezone.|

## Create the primary and secondary pair

Verify that both the primary and secondary on-premises management console appliances are powered on before starting the procedure.  

### On the primary

1. Sign in to the CLI as a Defender for IoT user.

2. Run the following command on the primary:

```azurecli-interactive
sudo cyberx-management-trusted-hosts-add -ip <Secondary IP>
```

>[!NOTE]
>In this document, the principal on-premises management console is referred to as the primary, and the agent is referred to as the secondary.

3. Enter the IP address of the secondary appliance in the ```<Secondary ip>``` field and select Enter. The IP address is then validated, and the SSL certificate is downloaded to the primary. Entering the IP address also associates the sensors to the secondary appliance.

4. Run the following command on the primary to verify that the certificate is installed properly:

```azurecli-interactive
sudo cyberx-management-trusted-hosts-apply
```

5. Run the following command on the primary. **Do not run with sudo.**

```azurecli-interactive
cyberx-management-deploy-ssh-key <Secondary IP>
```

This allows the connection between the primary and secondary appliances for backup and restoration purposes between them.

6. Enter the IP address of the secondary and select Enter.

### On the secondary

1. Sign in to the CLI as a Defender for IoT user.

2. Run the following command on the secondary. **Do not run with sudo**:

```azurecli-interactive
cyberx-management-deploy-ssh-key <Primary ip>
```

This allows the connection between the Primary and Secondary appliances for backup and restore purposes between them.

3. Enter the IP address of the primary and press Enter.

### Track high availability activity

The core application logs can be exported to the Defender for IoT support team to handle any high availability issues.  

To access the core logs:

1. Select **Export** from the **System Settings** window.

## Update the on-premises management console with high availability

Perform the high availability update in the following order. Make sure each step is complete before you begin a new step.

To update with high availability:

1. Update the primary on-premises management console.

2. Update the secondary on-premises management console.

3. Update the sensors.

## See also

[Activate and set up your on-premises management console](how-to-activate-and-set-up-your-on-premises-management-console.md)