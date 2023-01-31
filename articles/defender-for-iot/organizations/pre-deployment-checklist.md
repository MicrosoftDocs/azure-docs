---
title: OT network pre-deployment checklist
description: Use this checklist as a worksheet to ensure that your OT network is ready for a Microsoft Defender for IoT deployment.
ms.date: 02/22/2022
ms.topic: reference
---


# Predeployment checklist

Use this checklist as a worksheet to ensure that your OT network is ready for a Microsoft Defender for IoT deployment. 

We recommend printing this browser page or using the print function to save it as a PDF file where you can check off things as you go. For example, on Windows machines, press **CTRL+P** to access the Print dialog for this page.

Use this checklist together with [Prepare your OT network for Microsoft Defender for IoT](how-to-set-up-your-network.md).

## Site checklist

Review the following items before deploying your site:

| **#** | **Task or activity** | **Status** | **Comments** |
|--|--|--|--|
| 1 | If you're using physical appliances, order your appliances. <br>For more information, see [Identify required appliances](how-to-identify-required-appliances.md). | ☐ |  |
| 2 | Identify the managed switches you want to monitor | ☐ |  |
| 3 | Provide network details for sensors (IP address, subnet, D-GW, DNS, host). | ☐ |  |
| 4 | Create necessary firewall rules and the access list. For more information, see [Networking requirements](how-to-set-up-your-network.md#networking-requirements).| ☐ |  |
| 5 | Configure port mirroring, defining the *source* as the physical ports or VLANs you want to monitor, and the *destination* as the output port that connected to OT sensor. | ☐ |  |
| 7 |  Connect the switch to the OT sensor. | ☐ |  |
| 8 | Create Active Directory groups or local users. | ☐ |  |
| 9 | On the Azure portal, add a Defender for IoT subscription and an OT sensor and then activate your sensor. | ☐ |  |
| 10 | Validate the link and incoming traffic to the OT sensor  | ☐ |  |


| **Date** | **Note** | **Deployment date** | **Note** |
|--|--|--|--|
| Defender for IoT |  | Site name* |  |
| Name |  | Name |  |
| Position |  | Position |  |

## Architecture review

Review your industrial network architecture to define the proper location for the Defender for IoT equipment.

1. **Global network diagram** - View a global network diagram of the industrial OT environment. For example:

    :::image type="content" source="media/how-to-set-up-your-network/backbone-switch.png" alt-text="Diagram of the industrial OT environment for the global network.":::

    > [!NOTE]
    > The Defender for IoT appliance should be connected to a lower-level switch that sees the traffic between the ports on the switch.

1. **Committed devices** - Provide the approximate number of network devices that will be monitored. You'll need this information when onboarding your subscription to Defender for IoT in the Azure portal. During the onboarding process, you'll be prompted to enter the number of devices in increments of 100. For more information, see [What is a Defender for IoT committed device?](architecture.md#what-is-a-defender-for-iot-committed-device)

1. **(Optional) Subnet list** - Provide a subnet list for the production networks and a description (optional).

    |  **#**  | **Subnet name** | **Description** |
    |--| --------------- | --------------- |
    | 1  | |
    | 2  | |
    | 3  | |
    | 4  | |

1. **VLANs** - Provide a VLAN list of the production networks.

    | **#** | **VLAN Name** | **Description** |
    |--|--|--|
    | 1 |  |  |
    | 2 |  |  |
    | 3 |  |  |
    | 4 |  |  |

1. **Switch models and mirroring support** - To verify that the switches have port mirroring capability, provide the switch model numbers that the Defender for IoT platform should connect to:

    | **#** | **Switch** | **Model** | **Traffic mirroring support (SPAN, RSPAN, or none)** |
    |--|--|--|--|
    | 1 |  |  |
    | 2 |  |  |
    | 3 |  |  |
    | 4 |  |  |

1. **Third-party switch management** - Does a third party manage the switches? Y or N 

    If yes, who? __________________________________ 

    What is their policy? __________________________________ 

    For example:

    - Siemens

    - Rockwell automation – Ethernet or IP

    - Emerson – DeltaV, Ovation

1. **Serial connection** - Are there devices that communicate via a serial connection in the network? Yes or No

    If yes, specify which serial communication protocol: ________________

    If yes, mark on the network diagram what devices communicate with serial protocols, and where they are:

    *Add your network diagram with marked serial connection*

1. **Quality of Service** - For Quality of Service (QoS), the default setting of the sensor is 1.5 Mbps. Specify if you want to change it: ________________

   Business unit (BU): ________________

1. **Sensor** - Specifications for site equipment

    The sensor appliance is connected to switch SPAN port through a network adapter. It's connected to the customer's corporate network for management through another dedicated network adapter.

    Provide address details for the sensor NIC that will be connected in the corporate network:

    | Item | Appliance 1 | Appliance 2 | Appliance 3 |
    |--|--|--|--|
    | Appliance IP address |  |  |  |
    | Subnet |  |  |  |
    | Default gateway |  |  |  |
    | DNS |  |  |  |
    | Host name |  |  |  |

1. **iDRAC/iLO/Server management**

    | Item | Appliance 1 | Appliance 2 | Appliance 3 |
    |--|--|--|--|
    | Appliance IP address |  |  |  |
    | Subnet |  |  |  |
    | Default gateway |  |  |  |
    | DNS |  |  |  |

1. **On-premises management console**

    | Item | Active | Passive (when using HA) |
    |--|--|--|
    | IP address |  |  |
    | Subnet |  |  |
    | Default gateway |  |  |
    | DNS |  |  |

1. **SNMP**  

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

1. **On-premises management console SSL certificate**

    Are you planning to use an SSL certificate? Yes or No

    If yes, what service will you use to generate it? What attributes will you include in the certificate (for example, domain or IP address)?

1. **SMTP authentication**

    Are you planning to use SMTP to forward alerts to an email server? Yes or No

    If yes, what authentication method will you use?  

1. **Active Directory or local users**

    Contact an Active Directory administrator to create an Active Directory site user group or create local users. Be sure to have your users ready for the deployment day.

1. IoT device types in the network

    | Device type | Number of devices in the network | Average bandwidth |
    | --------------- | ------ | ----------------------- |
    | Camera | |
    | X-ray machine | |
    |  |  |
    |  |  |
    |  |  |
    |  |  |
    |  |  |
    |  |  |
    |  |  |
    |  |  |

## Next steps

For more information, see:

- [Quickstart: Get started with Defender for IoT](getting-started.md)
- [Best practices for planning your OT network monitoring](best-practices/plan-network-monitoring.md)
- [Prepare your network for Microsoft Defender for IoT](how-to-set-up-your-network.md)
