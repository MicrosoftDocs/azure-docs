---
title: Introduction to Azure and the Internet of Things (IoT)
description: Overview of Azure IoT and the services contained therein
author: robinsh
ms.service: iot-fundamentals
services: iot-fundamentals
ms.topic: overview
ms.date: 10/09/2018
ms.author: robinsh
---

# Introduction to Azure and the Internet of Things

Azure IoT consists of three areas of technologies and solutions—solutions, platform services, and edge, all designed to facilitate the end-to-end development of your IoT application. This article begins by describing the common characteristics of an IoT solution in the cloud, followed by an overview of how Azure IoT addresses challenges in IoT projects and why you should consider adopting Azure IoT.

## IoT solution architecture

IoT solutions require secure, bidirectional communication between devices, possibly numbering in the millions, and a solution back end. For example, a solution might use automated, predictive analytics to uncover insights from your device-to-cloud event stream. 

The following diagram shows the key elements of a typical IoT solution architecture. The diagram is agnostic of the specific implementation details such as the Azure services used, and device operating systems. In this architecture, IoT devices collect data that they send to a cloud gateway. The cloud gateway makes the data available for processing by other back-end services. These back-end services can deliver data to:

* Other line-of-business applications.
* Human operators through a dashboard or other presentation device.

![IoT solution architecture](./media/iot-introduction/iot-reference-architecture.png)

> [!NOTE]
> For an in-depth discussion of IoT architecture, see the [Microsoft Azure IoT Reference Architecture](https://aka.ms/iotrefarchitecture).

### Device connectivity

In an IoT solution architecture, devices typically send telemetry to the cloud for storage and processing. For example, in a predictive maintenance scenario, the solution back end might use the stream of sensor data to determine when a specific pump requires maintenance. Devices can also receive and respond to cloud-to-device messages by reading messages from a cloud endpoint. In the same example, the solution back end might send messages to other pumps in the pumping station to begin rerouting flows just before maintenance is due to start. This procedure makes sure the maintenance engineer could get started as soon as she arrives.

Connecting devices securely and reliably is often the biggest challenge in IoT solutions. This is because IoT devices have different characteristics as compared to other clients such as browsers and mobile apps. Specifically, IoT devices:

* Are often embedded systems with no human operator (unlike a phone).
* Can be deployed in remote locations, where physical access is expensive.
* May only be reachable through the solution back end. There is no other way to interact with the device.
* May have limited power and processing resources.
* May have intermittent, slow, or expensive network connectivity.
* May need to use proprietary, custom, or industry-specific application protocols.
* Can be created using a large set of popular hardware and software platforms.

In addition to the previous constraints, any IoT solution must also be scalable, secure, and reliable.

Depending on the communication protocol and network availability, a device can either communicate directly, or through an intermediate gateway, with the cloud. IoT architectures often have a mix of these two communication patterns.

### Data processing and analytics

In modern IoT solutions, data processing can occur in the cloud or on the device side. Device-side processing is referred as *Edge computing*. The choice of where to process data depends on factors such as:

* Network constraints. If bandwidth between the devices and the cloud is limited, there is an incentive to do more edge processing.
* Response time. If there is a requirement to act on a device in near real time, it may be better to process the response in the device itself. For example, a robot arm that needs to be stopped in an emergency.
* Regulatory environment. Some data cannot be sent to the cloud.

In general, data processing both in the edge and in the cloud are a combination of the following capabilities:

* Receiving telemetry at scale from your devices and determining how to process and store that data.
* Analyzing the telemetry to provide insights, whether they are in real time or after the fact.
* Sending commands from the cloud or a gateway device to a specific device.

Additionally, an IoT cloud back end should provide:

* Device registration capabilities that enable you to:
    * Provision devices.
    * Control which devices are permitted to connect to your infrastructure.
* Device management to control the state of your devices and monitor their activities.

For example, in a predictive maintenance scenario, the cloud back-end stores historical telemetry data. The solution uses this data to identify potential anomalous behavior on specific pumps before they cause a real problem. Using data analytics, it can identify that the preventative solution is to send a command back to the device to take a corrective action. This process generates an automated feedback loop between the device and the cloud that greatly increases the solution efficiency.

### Presentation and business connectivity

The presentation and business connectivity layer allows end users to interact with the IoT solution and the devices. It enables users to view and analyze the data collected from their devices. These views can take the form of dashboards or BI reports that can display both historical data or near real-time data. For example, an operator can check on the status of particular pumping station and see any alerts raised by the system. This layer also allows integration of the IoT solution back-end with existing line-of-business applications to tie into enterprise business processes or workflows. For example, a predictive maintenance solution can integrate with a scheduling system to book an engineer to visit a pumping station when it identifies a pump in need of maintenance.

## Why Azure IoT?

Azure IoT simplifies the complexity of IoT projects and addresses the challenges such as security, infrastructure incompatibility, and scaling your IoT solution. Here is how:

### Agile

Accelerate your IoT journey.

* Scale: start small, grow to any size, anywhere and everywhere — millions of devices, terabytes of data, in the most regions worldwide.

* Open: use what you have, or modernize for the future by connecting to any device, software, or service.

* Hybrid: build according to your needs by deploying your IoT solution at the edge, in the cloud, or anywhere in between.

* Pace: deploy faster, speed time-to-market, and stay ahead of your competition with the leader in solution accelerators and pace of innovation in IoT.

### Comprehensive

Deliver impact for your business.

* Complete: Microsoft is the only IoT solution provider with a complete platform spanning device to cloud, across big data, advanced analytics, and with managed services.

* Partner for success: tap into the power of the world’s  largest partner ecosystem, and bring line-of-business and technology to life, across industry and around the world.

* Data-driven: IoT is about data, and the best IoT solutions bring together all of the tools you need to store, interpret, transform, analyze, and present data to right user, in the right place, at the right time.

* Device-centric: Microsoft IoT allows you to connect anything, from legacy equipment to a vast ecosystem of certified hardware, and the ability to build your own devices across edge, mobile, and embedded systems.

### Secure

Solve the hardest part of IoT — security.

* Empower: with Microsoft IoT, you can bring together your vision, with the technology, best practices, and the capabilities to solve for the hardest part of IoT — security.

* Take action: secure your IoT data and manage risk with identity and access management, threat and information protection, and security management.

* Peace of mind: ensure the safety of sensitive information across devices, software, applications, and cloud services, as well as on-premises environments.

* Compliance: Microsoft has been leading the industry in establishing security requirements that meet a broad set of international and industry-specific standards for IoT devices, data, and services.

## Next steps

Explore the following areas of technologies and solutions.

**Solutions**

* [IoT solution accelerators](/azure/iot-suite)
* [IoT Central](/azure/iot-central)

**Platform services**

* [IoT Hub](/azure/iot-hub)
* [IoT Hub Device Provisioning Service](/azure/iot-dps)
* [Azure Maps](/azure/azure-maps/)
* [Time Series Insights](/azure/time-series-insights)

**Edge**

* [IoT Edge Overview](/azure/iot-edge)
* [What is IoT Edge](/azure/how-iot-edge-works)
