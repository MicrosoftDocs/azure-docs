---
title: Understand your OT network architecture - Microsoft Defender for IoT
description: Describes the Purdue reference module in relation to Microsoft Defender for IoT to help you understand more about your own OT network architecture.
ms.date: 06/02/2022
ms.topic: conceptual
---

# Understand your OT network architecture

When planning your network monitoring, you must understand your system network architecture and how it will need to connect to Defender for IoT. Also, understand where each of your system elements falls in the Purdue Reference model for Industrial Control System (ICS) OT network segmentation.

Defender for IoT network sensors receive traffic from two main sources, either by switch mirror ports (SPAN ports) or network TAPs. The network sensor's management port connects to the business, corporate, or sensor management network for network management from the Azure portal or an on-premises management system.

For example:

:::image type="content" source="../media/how-to-set-up-your-network/switch-with-port-mirroring.png" alt-text="Diagram of a managed switch with port mirroring." border="false" :::

## Purdue reference model and Defender for IoT

The Purdue Reference Model is a model for Industrial Control System (ICS)/OT network segmentation that defines six layers, components and relevant security controls for those networks.

Each device type in your OT network falls in a specific level of the Purdue model. The following image shows how devices in your network spread across the Purdue model and connect to Defender for IoT services.

:::image type="content" source="../media/how-to-set-up-your-network/purdue-model.png" alt-text="Diagram of the Purdue model." border="false" lightbox="../media/how-to-set-up-your-network/purdue-model.png":::

The following table describes each level of the Purdue model when applied to Defender for IoT devices:

|Name  |Description  |
|---------|---------|
|**Level 0**: Cell and area     |   Level 0 consists of a wide variety of sensors, actuators, and devices involved in the basic manufacturing process. These devices perform the basic functions of the industrial automation and control system, such as: <br><br>- Driving a motor<br>- Measuring variables<br>- Setting an output<br>- Performing key functions, such as painting, welding, and bending      |
| **Level 1**: Process control     | Level 1 consists of embedded controllers that control and manipulate the manufacturing process whose key function is to communicate with the Level 0 devices. In discrete manufacturing, those devices are programmable logic controllers (PLCs) or remote telemetry units (RTUs). In process manufacturing, the basic controller is called a distributed control system (DCS).        |
|**Level 2**: Supervisory     |  Level 2 represents the systems and functions associated with the runtime supervision and operation of an area of a production facility. These usually include the following: <br><br>- Operator interfaces or human-machine interfaces (HMIs) <br>- Alarms or alerting systems <br> - Process historian and batch management systems <br>- Control room workstations <br><br>These systems communicate with the PLCs and RTUs in Level 1. In some cases, they communicate or share data with the site or enterprise (Level 4 and Level 5) systems and applications. These systems are primarily based on standard computing equipment and operating systems (Unix or Microsoft Windows).       |
|**Levels 3 and 3.5**: Site-level and industrial perimeter network     | The site level represents the highest level of industrial automation and control systems. The systems and applications that exist at this level manage site-wide industrial automation and control functions. Levels 0 through 3 are considered critical to site operations. The systems and functions that exist at this level might include the following: <br><br>- Production reporting (for example, cycle times, quality index, predictive maintenance) <br>- Plant historian <br>- Detailed production scheduling<br>- Site-level operations management <br>-0 Device and material management <br>- Patch launch server <br>- File server <br>- Industrial domain, Active Directory, terminal server <br><br>These systems communicate with the production zone and share data with the enterprise (Level 4 and Level 5) systems and applications.          |
|**Levels 4 and 5**: Business and enterprise networks     |  Level 4 and Level 5 represent the site or enterprise network where the centralized IT systems and functions exist. The IT organization directly manages the services, systems, and applications at these levels.       |

## Next steps

After you've understood your own OT network architecture, learn more about how to plan your Defender for IoT deployment in your network. Continue with [Plan your sensor connections](plan-network-monitoring.md).

For more information, see:

- [Traffic mirroring methods for OT monitoring](traffic-mirroring-methods.md)
- [Sample OT network connectivity models](sample-connectivity-models.md)
