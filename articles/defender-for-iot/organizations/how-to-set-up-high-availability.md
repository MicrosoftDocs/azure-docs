---
title: Set up high availability
description: Increase the resiliency of your Defender for IoT deployment by installing an on-premises management console high availability appliance. High availability deployments ensure your managed sensors continuously report to an active on-premises management console.
ms.date: 06/12/2022 
ms.topic: how-to
---
# About high availability

Increase the resiliency of your Defender for IoT deployment by configuring high availability on your on-premises management console. High availability deployments ensure your managed sensors continuously report to an active on-premises management console.

This deployment is implemented with an on-premises management console pair that includes a primary and secondary appliance.

> [!NOTE]
> In this document, the principal on-premises management console is referred to as the primary, and the agent is referred to as the secondary.

## About primary and secondary communication

When a primary and secondary on-premises management console is paired:

- An on-premises management console SSL certificate is applied to create a secure connection between the primary and secondary appliances. The SSL may be the self-signed certificate installed by default or a certificate installed by the customer.

    When validation is `ON`, the appliance should be able to establish connection to the CRL server defined by the certificate.

- The primary on-premises management console data is automatically backed up to the secondary on-premises management console every 10 minutes. The on-premises management console configurations and device data are backed up. PCAP files and logs are not included in the backup. You can back up and restore PCAPs and logs manually.

- The primary setup on the management console is duplicated on the secondary. For example, if the system settings are updated on the primary, they're also updated on the secondary.

- Before the license of the secondary expires, you should define it as the primary in order to update the license.

## About failover and failback

If a sensor can't connect to the primary on-premises management console, it automatically connects to the secondary. Your system will be supported by both the primary and secondary simultaneously, if less than half of the sensors are communicating with the secondary. The secondary takes over when more than half of the sensors are communicating with it. Failover from the primary to the secondary takes approximately three minutes. When the failover occurs, the primary on-premises management console freezes. When this happens, you can sign in to the secondary using the same sign-in credentials.

During failover, sensors continue attempts to communicate with the primary appliance. When more than half the managed sensors succeed in communicating with the primary, the primary is restored. The following message appears on the secondary console when the primary is restored:

:::image type="content" source="media/how-to-set-up-high-availability/secondary-console-message.png" alt-text="Screenshot of a message that appears at the secondary console when the primary is restored.":::

Sign back in to the primary appliance after redirection.

## High availability setup overview

The installation and configuration procedures are performed in four main stages:

1. Install an on-premises management console primary appliance. 

1. Configure the on-premises management console primary appliance. For example, scheduled backup settings, VLAN settings. For more information, see [Manage the on-premises management console](how-to-manage-the-on-premises-management-console.md). All settings are applied to the secondary appliance automatically after pairing.

1. Install an on-premises management console secondary appliance. For more information, see [About the Defender for IoT Installation](how-to-install-software.md).

1. Pair the primary and secondary on-premises management console appliances. The primary on-premises management console must manage at least two sensors in order to carry out the setup. 

    For more information, see [Create the primary and secondary pair](#create-the-primary-and-secondary-pair).

## High availability requirements

Verify that you've met the following high availability requirements:

- [Certificate requirements](how-to-manage-the-on-premises-management-console.md#manage-certificates)

- Software and hardware requirements

- Network access requirements

### Software and hardware requirements

- Both the primary and secondary on-premises management console appliances must be running identical hardware models and software versions.

- The high availability system can be set up by Defender for IoT users only, using CLI tools.

### Network access requirements

Verify if your organizational security policy allows you to have access to the following services, on the primary and secondary on-premises management console. These services also allow the connection between the sensors and secondary on-premises management console:

|Port|Service|Description|
|----|-------|-----------|
|**443 or TCP**|HTTPS|Grants access to the on-premises management console web console.|
|**22 or TCP**|SSH|Syncs the data between the primary and secondary on-premises management console appliances|
|**123 or UDP**|NTP| The on-premises management console's NTP time sync. Verify that the active and passive appliances are defined with the same timezone.|

## Create the primary and secondary pair

Verify that both the primary and secondary on-premises management console appliances are powered on before starting the procedure.

### On the primary

1. Sign in to the management console.

1. Select **System Settings** from the side menu.

1. Copy the Connection String.

    :::image type="content" source="../media/how-to-set-up-high-availability/connection-string.png" alt-text="Copy the connection string to use in the following command.":::

1. Run the following command on the primary:

    ```bash
    sudo cyberx-management-trusted-hosts-add -ip <Secondary IP> -token <connection string>
    ```


1. Enter the IP address of the secondary appliance in the ```<Secondary ip>``` field and select Enter. The IP address is then validated, and the SSL certificate is downloaded to the primary. Entering the IP address also associates the sensors to the secondary appliance.

1. Run the following command on the primary to verify that the certificate is installed properly:

    ```bash
    sudo cyberx-management-trusted-hosts-apply
    ```

1. Run the following command on the primary. **Do not run with sudo.**

    ```bash
    cyberx-management-deploy-ssh-key <Secondary IP>
    ```

   This allows the connection between the primary and secondary appliances for backup and restoration purposes between them.

1. Enter the IP address of the secondary and select Enter.

### On the secondary

1. Sign in to the CLI as a Defender for IoT user.

1. Run the following command on the secondary. **Do not run with sudo**:

    ```bash
    cyberx-management-deploy-ssh-key <Primary ip>
    ```

    This allows the connection between the Primary and Secondary appliances for backup and restore purposes between them.

1. Enter the IP address of the primary and press Enter.

### Track high availability activity

The core application logs can be exported to the Defender for IoT support team to handle any high availability issues.  

**To access the core logs**:

1. Select **Export** from the **System Settings** window.

## Update the on-premises management console with high availability

To update an on-premises management console that has high availability configured, you'll need to:

1. Disconnect the high availability from both the primary and secondary appliances. 
1. Update the appliances to the new version. 
1. Reconfigure the high availability back onto both appliances.

Perform the update in the following order. Make sure each step is complete before you begin a new step.

**To update an on-premises management console with high availability configured**:

1. Disconnect the high availability from both the primary and secondary appliances:

    **On the primary:**
    
    1. Get the list of the currently connected appliances. Run: 

        ```bash
        cyberx-management-trusted-hosts-list
        ```

    1. Find the domain associated with the secondary appliance and copy it to your clipboard. For example:

        :::image type="content" source="media/how-to-set-up-high-availability/update-high-availability-domain.jpg" alt-text="Screenshot showing the domain associated with the secondary appliance.":::

    1. Remove the secondary domain from the list of trusted hosts. Run:
    
        ```bash
        sudo cyberx-management-trusted-hosts-remove -d [Secondary domain]
        ```
    
    1. Verify that the certificate is installed correctly. Run:
    
        ```bash
        sudo cyberx-management-trusted-hosts-apply
        ```
    
    **On the secondary:**
    
    1. Get the list of the currently connected appliances. Run: 

        ```bash
        cyberx-management-trusted-hosts-list
        ```

    1. Find the domain associated with the primary appliance and copy it to your clipboard.

    1. Remove the primary domain from the list of trusted hosts. Run:
    
        ```bash
        sudo cyberx-management-trusted-hosts-remove -d [Primary domain]
        ```
    
    1. Verify that the certificate is installed correctly. Run:
    
        ```bash
        sudo cyberx-management-trusted-hosts-apply
        ```

1. Update both the primary and secondary appliances to the new version. For more information, see [Update an on-premises management console](update-ot-software.md#update-an-on-premises-management-console).

1. Set up high availability again, on both the primary and secondary appliances. For more information, see [Create the primary and secondary pair](#create-the-primary-and-secondary-pair).


## Next steps

For more information, see [Activate and set up your on-premises management console](how-to-activate-and-set-up-your-on-premises-management-console.md).
