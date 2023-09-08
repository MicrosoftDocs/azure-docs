---
title: 'Automotive messaging, data & analytics reference architecture'
description: 'Describes the use case of automotive messaging'
ms.topic: conceptual
ms.date: 05/23/2023
author: msmarioo
ms.author: marioo
---

# Automotive messaging, data & analytics reference architecture

This reference architecture is designed to support automotive OEMs and Mobility Providers in the development of advanced connected vehicle applications and digital services. Its goal is to provide reliable and efficient messaging, data and analytics infrastructure. The architecture includes message processing, command processing, and state storage capabilities to facilitate the integration of various services through managed APIs. It also describes a data and analytics solution that ensures the storage and accessibility of data in a scalable and secure manner for digital engineering and data sharing with the wider mobility ecosystem.

[!INCLUDE [mqtt-preview-note](./includes/mqtt-preview-note.md)]

## Architecture

:::image type="content" source="media/mqtt-automotive-connectivity-and-data-solution/high-level-architecture.png" alt-text="Diagram of the high-level architecture." border="false" lightbox="media/mqtt-automotive-connectivity-and-data-solution/high-level-architecture.png":::

The high level architecture diagram shows the main logical blocks and services of an automotive messaging, data & analytics solution. Further details can be found in the following sections.

* The **vehicle** contains a collection of devices. Some of these devices are *Software Defined*, and can execute software workloads managed from the cloud. The vehicle collects and processes a wide variety of data, from sensor information from electro-mechanical devices such as the battery management system to software log files.
* The **vehicle messaging services** manages the communication to and from the vehicle. It is in charge of processing messages, executing commands using workflows and  mediating the vehicle, user and device management backend. It also keeps track of vehicle, device and certificate registration and provisioning.
* The **vehicle and device management backend** are the OEM systems that keep track of vehicle configuration from factory to repair and maintenance.
* The operator has **IT & operations** to ensure availability and performance of both vehicles and backend.  
* The **data & analytics services** provides data storage and enables processing and analytics for all data users. It turns data into insights that drive better business decisions.
* The vehicle manufacturer provides **digital services** as value add to the end customer, from companion apps to repair and maintenance applications.
* Several digital services require **business integration** to backend systems such as Dealer Management (DMS), Customer Relationship Management (CRM) or Enterprise Resource Planning (ERP) systems.
* The **consent management** backend is part of customer management and keeps track of user authorization for data collection according to geographical country/region legislation.
* Data collected from vehicles is an input to the **digital engineering** process, with the goal of continuous product improvements using analytics and machine learning.
* The **smart mobility ecosystem** can subscribe and consume both live telemetry as well as aggregated insights to provide more products and services.

*Microsoft is a member of the [Eclipse Software Defined Vehicle](https://www.eclipse.org/org/workinggroups/sdv-charter.php) working group, a forum for open collaboration using open source for vehicle software platforms.*

### Dataflow

The architecture uses the [publisher/subscriber](/azure/architecture/patterns/publisher-subscriber) messaging pattern to decouple vehicles from services.

#### Vehicle to cloud messages

The *vehicle to cloud* dataflow is used to process telemetry data from the vehicle. Telemetry data can be sent periodically (vehicle state, collection from vehicle sensors) or based on an event (triggers on error conditions, reaction to a user action).

:::image type="content" source="media/mqtt-automotive-connectivity-and-data-solution/messaging-dataflow.png" alt-text="Diagram of the messaging dataflow." border="false" lightbox="media/mqtt-automotive-connectivity-and-data-solution/messaging-dataflow.png":::

1. The *vehicle* is configured for a customer based on the selected options using the **Management APIs**. The configuration contains:
    1. **Provisioning** information for vehicles and devices.
    1. Initial vehicle **data collection** configuration based on market and business considerations.
    1. Storage of initial **user consent** settings based on vehicle options and user acceptance.
1. The vehicle publishes telemetry and events messages through an MQTT client with defined topics to the **Event Grid** *MQTT Broker* in the *vehicle messaging services*.
1. The **Event Grid** routes messages to different subscribers based on the topic and message attributes.
    1. Low priority messages that don't require immediate processing (for example, analytics messages) are routed directly to storage using an Event Hubs instance for buffering.
    1. High priority messages that require immediate processing (for example, status changes that must be visualized in a user-facing application) are routed to an Azure Function using an Event Hubs instance for buffering.
1. Low priority messages are stored directly in the **data lake** using [event capture](/azure/stream-analytics/event-hubs-parquet-capture-tutorial). These messages can use [batch decoding and processing](#data-analytics) for optimum costs.
1. High priority messages are processed with an **Azure function**. The function reads the vehicle, device and user consent settings from the **Device Registry** and performs the following steps:
    1. Verifies that the vehicle and device are registered and active.
    2. Verifies that the user has given consent for the message topic.
    3. Decodes and enriches the payload.
    4. Adds more routing information.
1. The Live Telemetry **Event Hub** in the *data & analytics solution* receives the decoded messages. **Azure Data Explorer** uses [streaming ingestion](/azure/data-explorer/ingest-data-streaming) to process and store messages as they're received.
1. The *digital Services* layer receives decoded messages. **Service Bus** provides notifications to applications on important changes / events on the state of the vehicle. **Azure Data Explorer** provides the last-known-state of the vehicle and the short term history.

#### Cloud to vehicle messages

The *cloud to vehicle* dataflow is often used to execute remote commands in the vehicle from a digital service. These commands include use cases such as lock/unlock door, climate control (set preferred cabin temperature) or configuration changes. The successful execution depends on vehicle state and might require some time to complete.

Depending on the vehicle capabilities and type of action, there are multiple possible approaches for command execution. We'll cover two variations:

* Direct cloud to device messages **(A)** that don't require a user consent check and with a predictable response time. This covers messages to both individual and multiple vehicles. An example includes weather notifications.
* Vehicle commands **(B)** that use vehicle state to determine success and require user consent. The messaging solution must have a command workflow logic that checks user consent, keeps track of the command execution state and notifies the digital service when done.

The following dataflow users commands issued from a companion app digital services as an example.

:::image type="content" source="media/mqtt-automotive-connectivity-and-data-solution/command-and-control-dataflow.png" alt-text="Diagram of the command and control dataflow." border="false" lightbox="media/mqtt-automotive-connectivity-and-data-solution/command-and-control-dataflow.png":::

Direct messages are executed with the minimum amount of hops for the best possible performance **(A)**:

1. Companion app is an authenticated service that can publish messages to **Event Grid**.
1. **Event Grid** checks for authorization for the Companion app Service to determine if it can send messages to the provided topics.
1. Companion app subscribes to responses from the specific vehicle / command combination.

In the case of vehicle state-dependent commands that require user consent **(B)**:

1. The vehicle owner / user provides consent for the execution of command and control functions to a **digital service** (in this example a companion app). This is normally done when the user downloads/activate the app and the OEM activates their account. This triggers a configuration change on the vehicle to subscribe to the associated command topic in the MQTT broker.
2. The **companion app** uses the command and control managed API to request execution of a remote command.
    1. The command execution might have more parameters to configure options such as timeout, store and forward options, etc.
    1. The command logic decides how to process the command based on the topic and other properties.
    1. The workflow logic creates a state to keep track of the status of the execution
3. The command **workflow logic** checks against user consent information to determine if the message can be executed.
4. The command workflow logic publishes a message to **Event Grid** with the command and the parameter values.
5. The **messaging module** in the vehicle is subscribed to the command topic and receives the notification. It routes the command to the right workload.
6. The messaging module monitors the **workload** for completion (or error). A workload is in charge of the (physical) execution of the command.
7. The messaging module publishes command status reports to **Event Grid**.
8. The **workflow module** is subscribed to command status updates and updates the internal state of command execution.
9. Once the command execution is complete, the service app receives the execution result over the command and control API.

#### Vehicle and Device Provisioning

This dataflow covers the process to register and provision vehicles and devices to the *vehicle messaging services*. The process is typically initiated as part of vehicle manufacturing.

:::image type="content" source="media/mqtt-automotive-connectivity-and-data-solution/provisioning-dataflow.png" alt-text="Diagram of the provisioning dataflow." border="false" lightbox="media/mqtt-automotive-connectivity-and-data-solution/provisioning-dataflow.png":::

1. The **Factory System** commissions the vehicle device to the desired construction state. This may include firmware & software initial installation and configuration. As part of this process, the factory system will obtain and write the device *certificate*, created from the **Public Key Infrastructure** provider.
1. The **Factory System** registers the vehicle & device using the *Vehicle & Device Provisioning API*.
1. The factory system triggers the **device provisioning client** to connect to the *device registration*  and provision the device. The device retrieves connection information to the *MQTT Broker*.
1. The *device registration* application creates the device identity in **Event Grid**.
1. The factory system triggers the device to establish a connection to the **Event Grid** *MQTT Data Broker* for the first time.
    1. The MQTT broker authenticates the device using the *CA Root Certificate* and extracts the client information.
1. The *MQTT broker* manages authorization for allowed topics using the **Event Grid** local registry.
1. In case of part replacement, the OEM **Dealer System** can trigger the registration of a new device.

> [!NOTE]
> Factory systems are usually on-premises and have no direct connection to the cloud.

### Data Analytics

This dataflow covers analytics for vehicle data. You can use other data sources such as factory or workshop operators to enrich and provide context to vehicle data.

:::image type="content" source="media/mqtt-automotive-connectivity-and-data-solution/data-analytics.png" alt-text="Diagram of the data analytics." border="false"lightbox="media/mqtt-automotive-connectivity-and-data-solution/data-analytics.png":::

1. The *vehicle messaging services* layer provides telemetry, events, commands and configuration messages from the bidirectional communication to the vehicle.
1. The *IT & Operations* layer provides information about the software running on the vehicle and the associated cloud services.
1. Several pipelines provide processing of the data into a more refined state
    * Processing from raw data to enriched and deduplicated vehicle data.
    * Vehicle Data Aggregation, key performance indicators and insights.
    * Generation of training data for machine learning.
1. Different applications consume refined and aggregated data.
    - Visualization using Power BI.
    - Business Integration workflows using Logic Apps with integration into the Dataverse.
1. Generated Training Data is consumed by tools such as ML Studio to generate ML models.

### Scalability

A connected vehicle and data solution can scale to millions of vehicles and thousands of services. It's recommended to use the [Deployment Stamps pattern](/azure/architecture/patterns/deployment-stamp) to achieve scalability and elasticity.

:::image type="content" source="media/mqtt-automotive-connectivity-and-data-solution/scalability.png" alt-text="Diagram of the scalability concept." border="false"lightbox="media/mqtt-automotive-connectivity-and-data-solution/scalability.png":::

Each *vehicle messaging scale unit* supports a defined vehicle population (for example, vehicles in a specific geographical region, partitioned by model year). The *applications scale unit* is used to scale the services that require sending or receiving messages to the vehicles. The *common service* is accessible from any scale unit and provides device management and subscription services for applications and devices.

1. The **application scale unit** subscribes applications to messages of interest. The common service handles subscription to the **vehicle messaging scale unit** components.
1. The vehicle uses the **device management service** to discover its assignment to a vehicle messaging scale unit.
1. If necessary, the vehicle is provisioned using the [Vehicle and device Provisioning](#vehicle-and-device-provisioning) workflow.
1. The vehicle publishes a message to the **Event Grid** *MQTT broker*.
1. **Event Grid** routes the message using the subscription information.
    1. For messages that don't require processing and claims check, it's routed to an ingress hub on the corresponding application scale unit.
    1. Messages that require processing are routed to the [D2C processing logic](#vehicle-to-cloud-messages) for decoding and authorization (user consent).
1. Applications consume events from their **app ingress** event hubs instance.
1. Applications publish messages for the vehicle.
    1. Messages that don't require more processing are published to the **Event Grid** *MQTT Broker*.
    1. Messages that require more processing, workflow control and authorization are routed to the relevant [C2D Processing Logic](#cloud-to-vehicle-messages) over an Event Hubs instance.

### Components

 This reference architecture references the following Azure components.

#### Connectivity

* [Azure Event Grid](/azure/event-grid/) allows for device onboarding, AuthN/Z and pub-sub via MQTT v5.
* [Azure Functions](/azure/azure-functions/) processes the vehicle messages. It can also be used to implement management APIs that require short-lived execution.
* [Azure Kubernetes Service (AKS)](/azure/aks/) is an alternative when the functionality behind the Managed APIs consists of complex workloads deployed as containerized applications.
* [Azure Cosmos DB](/azure/cosmos-db) stores the vehicle, device and user consent settings.
* [Azure API Management](/azure/api-management/) provides a managed API gateway to existing back-end services such as vehicle lifecycle management (including OTA) and user consent management.
* [Azure Batch](/azure/batch/) runs large compute-intensive tasks efficiently, such as vehicle communication trace ingestion.

#### Data and Analytics

* [Azure Event Hubs](/azure/event-hubs/) enables processing and ingesting massive amounts of telemetry data.
* [Azure Data Explorer](/azure/data-explorer/data-explorer-overview) provides exploration, curation and analytics of time-series based vehicle telemetry data.
* [Azure Blob Storage](/azure/storage/blobs) stores large documents (such as videos and can traces) and curated vehicle data.
* [Azure Databricks](/azure/databricks/) provides a set of tool to maintain enterprise-grade data solutions at scale. Required for long-running operations on large amounts of vehicle data.

#### Backend Integration

* [Azure Logic Apps](/azure/logic-apps/) runs automated workflows for business integration based on vehicle data.
* [Azure App Service](/azure/app-service/) provides user-facing web apps and mobile back ends, such as the companion app.
* [Azure Cache for Redis](/azure/azure-cache-for-redis/) provides in-memory caching of data often used by user-facing applications.
* [Azure Service Bus](/azure/service-bus-messaging/) provides brokering that decouples vehicle connectivity from digital services and business integration.

### Alternatives

The selection of the right type of compute to implement message processing and managed APIs depends on a multitude of factors. Select the right service using the [Choose an Azure compute service](/azure/architecture/guide/technology-choices/compute-decision-tree) guide.

Examples:

* **Azure Functions** for Event-driven, short lived processes such as telemetry ingestion.
* **Azure Batch** for High-Performance Computing tasks such as decoding large CAN Trace / Video Files
* **Azure Kubernetes Service** for managed, full fledge orchestration of complex logic such as command & control workflow management.

As an alternative to event-based data sharing, it's also possible to use [Azure Data Share](/azure/data-share/) if the objective is to perform batch synchronization at the data lake level.

## Scenario details

:::image type="content" source="media/mqtt-automotive-connectivity-and-data-solution/high-level-view.png" alt-text="Diagram of the high level view." border="false"lightbox="media/mqtt-automotive-connectivity-and-data-solution/high-level-view.png":::

Automotive OEMs are undergoing a significant transformation as they shift from producing fixed products to offering connected, software-defined vehicles. Vehicles offer a range of features, such as over-the-air updates, remote diagnostics, and personalized user experiences. This transition enables OEMs to continuously improve their products based on real-time data and insights while also expanding their business models to include new services and revenue streams.

This reference architecture allows automotive manufacturers and mobility providers to:

* Use feedback data as part of the **digital engineering** process to drive continuous product improvement, proactively address root causes of problems and create new customer value.
* Provide new **digital products and services** and digitalize operations with **business integration** with back-end systems like Enterprise Resource Planning (ERP) and Customer Relationship Management (CRM).
* Share data securely and addressing country/region-specific requirements for user consent with the broader **smart Mobility ecosystems**.
* Integrate with back-end systems for vehicle lifecycle management and consent management simplifies and accelerate the deployment and management of connected vehicle solutions using a **Software Defined Vehicle DevOps Toolchain**.
* Store and provide compute at scale for **vehicle and analytics**.
* Manage **vehicle connectivity** to millions of devices in a cost-effective way.

### Potential use cases

*OEM Automotive use cases* are about enhancing vehicle performance, safety, and user experience

* **Continuous product improvement**: Enhancing vehicle performance by analyzing real-time data and applying updates remotely.
* **Engineering Test Fleet Validation**: Ensuring vehicle safety and reliability by collecting and analyzing data from test fleets.
* **Companion App & User Portal**: Enabling remote vehicle access and control through a personalized app and web portal.
* **Proactive Repair & Maintenance**: Predicting and scheduling vehicle maintenance based on data-driven insights.

*Broader ecosystem use cases* expand connected vehicle applications to improve fleet operations, insurance, marketing, and roadside assistance across the entire transportation landscape

* **Connected commercial fleet operations**: Optimizing fleet management through real-time monitoring and data-driven decision-making.
* **Digital Vehicle Insurance**: Customizing insurance premiums based on driving behavior and providing immediate accident reporting.
* **Location-Based Marketing**: Delivering targeted marketing campaigns to drivers based on their location and preferences.
* **Road Assistance**: Providing real-time support and assistance to drivers in need, using vehicle location and diagnostic data.

## Considerations

These considerations implement the pillars of the Azure Well-Architected Framework, which is a set of guiding tenets that can be used to improve the quality of a workload. For more information, see [Microsoft Azure Well-Architected Framework](/azure/architecture/framework).

### Reliability

Reliability ensures your application can meet the commitments you make to your customers. For more information, see [Overview of the reliability pillar](/azure/architecture/framework/resiliency/overview).

* Consider horizontal scaling to add reliability.
* Use scale units to isolate geographical regions with different regulations.
* Auto scale and reserved instances: manage compute resources by dynamically scaling based on demand and optimizing costs with pre-allocated instances.
* Geo redundancy: replicate data across multiple geographic locations for fault tolerance and disaster recovery.

### Security

Security provides assurances against deliberate attacks and the abuse of your valuable data and systems. For more information, see [Overview of the security pillar](/azure/architecture/framework/security/overview).

* Securing vehicle connection: See the section on [certificate management](/azure/event-grid/) to understand how to use X.509 certificates to establish secure vehicle communications.

### Cost optimization

Cost optimization is about looking at ways to reduce unnecessary expenses and improve operational efficiencies. For more information, see [Overview of the cost optimization pillar](/azure/architecture/framework/cost/overview).

* Cost-per vehicle considerations: the communication costs should be dependent on the number of digital services offered. Calculate the RoI of the digital services against the operation costs.
* Establish practices for cost analysis based on message traffic. Connected vehicle traffic tends to increase with time as more services are added.
* Consider networking & mobile costs
  * Use MQTT topic alias to reduce traffic volume.
  * Use an efficient method to encode and compress payload messages.
* Traffic handling
  * Message priority: vehicles tend to have repeating usage patterns that create daily / weekly demand peaks. Use message properties to delay processing of non-critical or analytic messages to smooth the load and optimize resource usage.
  * Auto-scale based on demand.
* Consider how long the data should be stored hot/warm/cold.
* Consider the use of reserved instances to optimize costs.

### Operational excellence

Operational excellence covers the operations processes that deploy an application and keep it running in production. For more information, see [Overview of the operational excellence pillar](/azure/architecture/framework/devops/overview).

* Consider monitoring the vehicle software (logs/metrics/traces), the messaging services, the data & analytics services and related back-end services as part of unified IT operations.

### Performance efficiency

Performance efficiency is the ability of your workload to scale to meet the demands placed on it by users in an efficient manner. For more information, see [Performance efficiency pillar overview](/azure/architecture/framework/scalability/overview).

* Consider using the [scale concept](#scalability) for solutions that scale above 50,000 devices, specially if multiple geographical regions are required.
* Carefully consider the best way to ingest data (messaging, streaming or batched).
* Consider the best way to analyze the data based on use case.

## Contributors

*This article is maintained by Microsoft. It was originally written by the following contributors.*

Principal authors:

* [Peter Miller](https://www.linkedin.com/in/peter-miller-ba642776/) | Principal Engineering Manager, Mobility CVP
* [Mario Ortegon-Cabrera](http://www.linkedin.com/in/marioortegon) | Principal Program Manager, MCIGET SDV & Mobility
* [David Peterson](https://www.linkedin.com/in/david-peterson-64456021/) | Chief Architect, Mobility Service Line, Microsoft Industry Solutions
* [David Sauntry](https://www.linkedin.com/in/david-sauntry-603424a4/) | Principal Software Engineering Manager, Mobility CVP
* [Max Zilberman](https://www.linkedin.com/in/maxzilberman/) | Principal Software Engineering Manager

Other contributors:

* [Jeff Beman](https://www.linkedin.com/in/jeff-beman-4730726/) | Principal Program Manager, Mobility CVP
* [Frederick Chong](https://www.linkedin.com/in/frederick-chong-5a00224) | Principal PM Manager, MCIGET SDV & Mobility
* [Felipe Prezado](https://www.linkedin.com/in/filipe-prezado-9606bb14) | Principal Program Manager, MCIGET SDV & Mobility
* [Ashita Rastogi](https://www.linkedin.com/in/ashitarastogi/) | Principal Program Manager, Azure Messaging
* [Henning Rauch](https://www.linkedin.com/in/henning-rauch-adx) | Principal Program Manager, Azure Data Explorer (Kusto)
* [Rajagopal Ravipati](https://www.linkedin.com/in/rajagopal-ravipati-79020a4/) | Partner Software Engineering Manager, Azure Messaging
* [Larry Sullivan](https://www.linkedin.com/in/larry-sullivan-1972654/) | Partner Group Software Engineering Manager, Energy & CVP
* [Venkata Yaddanapudi](https://www.linkedin.com/in/venkata-yaddanapudi-5769338/) | Senior Program Manager, Azure Messaging

*To see non-public LinkedIn profiles, sign in to LinkedIn.*

## Next steps

* [Create an Autonomous Vehicle Operations (AVOps) solution](/azure/architecture/solution-ideas/articles/avops-architecture) for a broader look into automotive digital engineering for autonomous and assisted driving.

## Related resources

The following articles cover some of the concepts used in the architecture:

* [Claim Check Pattern](/azure/architecture/patterns/claim-check) is used to support processing large messages, such as file uploads.
* [Deployment Stamps](/azure/architecture/patterns/deployment-stamp) covers the general concepts required to scale the solution to millions of vehicles.
* [Throttling](/azure/architecture/patterns/throttling) describes the concept require to handle exceptional number of messages from vehicles.

The following articles describe interactions between components in the architecture:

* [Configure streaming ingestion on your Azure Data Explorer cluster](/azure/data-explorer/ingest-data-streaming)
* [Capture Event Hubs data in parquet format and analyze with Azure Synapse Analytics](/azure/stream-analytics/event-hubs-parquet-capture-tutorial)
