---
title: 'Access control for MQTT clients'
description: 'Describes the main concepts for access control for MQTT clients in Azure Event Grid’s MQTT broker feature.'
ms.topic: conceptual
ms.custom:
  - ignite-2023
ms.date: 11/15/2023
author: george-guirguis
ms.author: geguirgu
---
# Access control for MQTT clients

Access control enables you to manage the authorization of clients to publish or subscribe to topics, using a role-based access control model. Given the enormous scale of IoT environments, assigning permission for each client to each topic is incredibly tedious. Azure Event Grid’s MQTT broker feature tackles this scale challenge through grouping clients and topics into client groups and topic spaces.



The main components of the access control model are:

A **[client](mqtt-clients.md)** represents the device or application that needs to publish and/or subscribe to MQTT topics.

A **[client group](mqtt-client-groups.md)** is a set of clients that need the same access to publish and/or subscribe to the same set of MQTT topics. The client group represents the principal in the RBAC model.

A **[topic space](mqtt-topic-spaces.md)** represents multiple topics through a set of topic templates. Topic templates are an extension of MQTT filters that support variables, along with the MQTT wildcards. Each topic space represents the topics that the same set of clients need to use to communicate. The topic space represents the resource in the RBAC model.

A **permission binding** grants access to a specific client group to publish or subscribe on the topics represented by a specific topic space. The permission binding represents the role in the RBAC model.

:::image type="content" source="media/mqtt-overview/access-control-high-res.png" alt-text="Diagram of the access control model." border="false":::



## Examples:

The following examples detail how to configure the access control model based on the following requirements.

### Example 1: 
A factory has multiple areas with each area including machines that need to communicate with each other. However, machines from other areas of the factory aren't allowed to communicate with them.

| **Client** | **Role** | **Topic/Topic Filter** |
|:---:|:---:|:---:|
| **Area1_Machine1** | Publisher | areas/area1/machines/machine1 |
| **Area1_Machine2** | Subscriber | areas/area1/machines/# |
| **Area2_Machine1** | Publisher | areas/area2/machines/machine1 |
| **Area2_Machine2** | Subscriber | areas/area2/machines/# |

#### Configuration

- Create  a client resource for each machine.
- Create a client group for each factory area’s machines.
- Create a topic space for each area representing the topics that the area’s machines communicate over.
- Create two permission bindings for each area’s client group to publish and subscribe to its corresponding area’s topic space.

| **Client** | **Client Group** | **Permission Binding** | **Topic Space** |
|:---:|:---:|:---:|:---:|
| **Area1_Machine1** | Area1Machines | Area1-Pub | Area1Messages -Topic Template: areas/area1/machines/# |
| **Area1_Machine2** | Area1Machines | Area1-Sub | Area1Messages -Topic Template: areas/area1/machines/# |
| **Area2_Machine1** | Area2Machines | Area2-Pub | Area2Messages -Topic Template: areas/area2/machines/# |
| **Area2_Machine2** | Area2Machines | Area2-Sub | Area2Messages -Topic Template: areas/area2/machines/# |

### Example 2:

Let’s assume an extra requirement for the previous example: each area has management clients along with the machines, and the machines must not have access to publish in case any of them gets compromised. On the other hand, the management clients need publish access to send commands to the machines and subscribe access to receive telemetry from the machines.

| **Client** | **Role** | **Topic/Topic Filter** |
|:---:|:---:|:---:|
| **Area1_Machine1** | Publisher | areas/area1/machines/machine1 |
| | Subscriber | areas/area1/mgmt/# |
| **Area1_Mgmt1** | Publisher | areas/area1/mgmt/machine1 |
| | Subscriber | areas/area1/machines/# |
| **Area2_Machine1** | Publisher | areas/area2/machines/machine1 |
| | Subscriber | areas/area2/mgmt/# |
| **Area2_ Mgmt1** | Publisher | areas/area2/mgmt/machine1 |
| | Subscriber | areas/area2/machines/# |

#### Configuration:

- Create client resources for each machine and management client.
- Create two Client Groups per area: one for the management client and another for the machines.
- Create two Topic Spaces for each area: one representing telemetry topics and another representing commands topics.
- Create two Permission Bindings for each area’s management clients to publish to the commands Topic Space and subscribe to the telemetry Topic Space.
- Create two Permission Bindings for each area’s machines to subscribe to the commands Topic Space and publish to the telemetry Topic Space.

| **Client** | **Client Group** | **Permission Binding** | **Topic/Topic Filter** |
|:---:|:---:|:---:|:---:|
| **Area1_Machine1** | Area1Machines | Area1Machines-Pub | Area1Telemetry -Topic Template: areas/area1/machines/# |
| | | Area1Machines-Sub | Area1Commands -Topic Template: areas/area1/mgmt/# |
| **Area1_MgmtClient1** | Area1Mgmt | Area1Mgmt-Pub | Area1Commands -Topic Template: areas/area1/mgmt/# |
| | | Area1Mgmt-Sub | Area1Telemetry -Topic Template: areas/area1/machines/# |
| **Area2_Machine1** | Area2Machines | Area2Machines-Pub | Area2Telemetry -Topic Template: areas/area2/machines/# |
| | | Area2Machines-Sub | Area2Commands -Topic Template: areas/area2/mgmt/# |
| **Area2_ MgmtClient1** | Area2Mgmt | Area2Mgmt-Pub | Area2Commands -Topic Template: areas/area2/mgmt/# |
| | | Area2Mgmt-Sub | Area2Telemetry -Topic Template: areas/area2/machines/# |

## Granular access control

Granular access control allows you to control the authorization of each client within a client group to publish or subscribe to its own topic. This granular access control is achieved by using variables in topic templates. 

Even though a client group can have access to a certain topic space with all its topic templates, variables within topic templates enable you to control the authorization of each client within that client group to publish or subscribe to its own topic. For example, if client group “machines” includes two clients:  “machine1” and “machine2”. By using variables, you can allow only machine1 to publish its telemetry only on the MQTT topic “machines/machine1/telemetry” and “machine2” to publish messages on MQTT topic “machines/machine2/telemetry”. 

The variables represent either client authentication names or client attributes. During communication with MQTT broker, each client would replace the variable in the MQTT topic with a substituted value. For example, the variable ${client.authenticationName} would be replaced with the authentication name of each client: machine1, machine2, etc. MQTT broker would allow access only to the clients that have a substituted value that matches either their authentication name or the value of the specified attribute.

For example, consider the following configuration:

- Client group: Machines
- Topic space: MachinesTelemetry
  - Topic template "machines/${client.authenticationName}/telemetry". 
- Permission binding: client group: machines; topic space: machinesTelemetry; Permission: publisher

With this configuration, only the client with client authentication name “machine1” can publish on topic "machines/machine1/telemetry", and only the machine with client authentication name “machine 2” can publish on topic "machines/machine2/telemetry", and so on. Accordingly, machine2 can't publish false information on behalf of machine1, even though it has access to the same topic space, and vice versa.

:::image type="content" source="media/mqtt-access-control/access-control-example.png" alt-text="Diagram of the granular access control example." border="false":::

## Next steps:

Learn more about authorization and authentication:

- [Client authentication](mqtt-client-authentication.md)
- [Clients](mqtt-clients.md)
- [Client groups](mqtt-client-groups.md)
- [Topic Spaces](mqtt-topic-spaces.md)
