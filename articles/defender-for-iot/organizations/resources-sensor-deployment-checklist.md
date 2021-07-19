---
title: Azure Defender for IoT pre-deployment checklist
description: This article provides information, and a checklist that should be used prior to deployment when preparing your site.
ms.date: 07/18/2021
ms.topic: checklist
---

# Pre-deployment checklist overview

This article provides information, and a checklist that should be used prior to deployment when preparing your site to ensure a successful onboarding.

- The Defender for IoT physical sensor should connect to managed switches that see the industrial communications between layers 1 and 2 (in some cases also layer 3).
- The sensor listens on a switch Mirror port (SPAN port) or a TAP.
- The management port is connected to the business/corporate network using SSL.

## Checklist

Having an overview of an industrial network diagram, will allow the site engineers to define the proper location for Azure Defender for IoT equipment.

### 1. Global network diagram

The global network diagram provides a diagram of the industrial OT environment

:::image type="content" source="media/resources-sensor-deployment-checklist/purdue-model.png" alt-text="This is where the Azure Defender for IoT sensor fits in, in the setup.":::

:::image type="content" source="media/resources-sensor-deployment-checklist/backbone-switch.png" alt-text="This is where the Azure Defender for IoT sensor fits in, in the purdue model.":::

> [!Note] 
> The Defender for IoT appliance should be connected to a lower-level switch that sees the traffic between the ports on the switch. 

### 2. Committed devices

Provide the approximate number of network devices that will be monitored. You will need this information when onboarding your subscription to the Azure Defender for IoT portal. During the onboarding process, you will be prompted to enter the number of devices in increments of 1000.

### 3. (Optional) Subnet list 

Provide a subnet list of the production networks.

| **#** | **Subnet name** | **Description** |
|--|--|--|
| 1 |  |  |
| 2 |  |  |
| 3 |  |  |
| 4 |  |  |

### 4. VLANs

Provide a VLAN list of the production networks.

| **#** | **VLAN Name** | **Description** |
|--|--|--|
| 1 |  |  |
| 2 |  |  |
| 3 |  |  |
| 4 |  |  |

### 5. Switch models and mirroring support

To verify that the switches have port mirroring capability, provide the switch model numbers that the Defender for IoT platform should connect to.

| **#** | **Switch** | **Model** | **Traffic mirroring support (SPAN, RSPAN, or none)** |
|--|--|--|--|
| 1 |  |  |
| 2 |  |  |
| 3 |  |  |
| 4 |  |  |

### 6. Third-party switch management

Does a third party manage the switches? Y or N 

If yes, who? __________________________________ 

What is their policy? __________________________________ 

### 7. Serial connection

Are there devices that communicate via a serial connection in the network? Yes or No 

If yes, specify which serial communication protocol: ________________ 

If yes, indicate on the network diagram what devices communicate with serial protocols, and where they are.

*Add your network diagram with marked serial connections.*

### 8. Vendors and protocols (industrial equipment)

Provide a list of vendors and protocols of the industrial equipment. (Optional)

| **#** | **Vendor** | **Communication protocol** |
|--|--|--|
| 1 |  |  |
| 2 |  |  |
| 3 |  |  |
| 4 |  |  |

For example:

- Siemens

- Rockwell automation – Ethernet or IP

- Emerson – DeltaV, Ovation

### 9. QoS

For QoS, the default setting of the sensor is 1.5 Mbps. Specify if you want to change it: ________________ 

   Business unit (BU): ________________

### 10. Sensor  

The sensor appliance is connected to switch SPAN port through a network adapter. It's connected to the customer's corporate network for management through another dedicated network adapter.

Provide address details for the sensor NIC that will be connected in the corporate network: 

| Item | Appliance 1 | Appliance 2 | Appliance 3 |
|--|--|--|--|
| Appliance IP address |  |  |  |
| Subnet |  |  |  |
| Default gateway |  |  |  |
| DNS |  |  |  |
| Host name |  |  |  |

### 11. iDRAC/iLO/Server management

| Item | Appliance 1 | Appliance 2 | Appliance 3 |
|--|--|--|--|
| Appliance IP address |  |  |  |
| Subnet |  |  |  |
| Default gateway |  |  |  |
| DNS |  |  |  |

### 12. On-premises management console  

| Item | Active | Passive (when using HA) |
|--|--|--|
| IP address |  |  |
| Subnet |  |  |
| Default gateway |  |  |
| DNS |  |  |

### 13. SNMP  

| Item | Details |
|--|--|
| IP |  |
| IP address |  |
| Username |  |
| Password |  |
| Authentication type | MD5 or SHA |
| Encryption | DES or AES |
| Secret key |  |
| SNMP v2 community string |

### 14. SSL certificate

Are you planning to use an SSL certificate? Yes or No

If yes, what service will you use to generate it? What attributes will you include in the certificate (for example, domain or IP address)?

### 15. SMTP authentication

Are you planning to use SMTP to forward alerts to an email server? Yes or No

If yes, what authentication method you will use?  

### 16. Active Directory or local users

Contact an Active Directory administrator to create an Active Directory site user group or create local users. Be sure to have your users ready for the deployment day.

### 17. IoT device types in the network

| Device type | Number of devices in the network | Average bandwidth |
|--|--|--|
| Ex. Camera |  |
| EX. X-ray machine |  |
|  |  |
|  |  |
|  |  |
|  |  |
|  |  |
|  |  |
|  |  |
|  |  |

## Next steps

[About Azure Defender for IoT network setup](how-to-set-up-your-network.md)

[About the Defender for IoT installation](how-to-install-software.md)
