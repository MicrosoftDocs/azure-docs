---
title: Integrate Splunk with Azure Defender for IoT
description: In this tutorial, learn how to integrate Splunk with Azure Defender for IoT.
author: ElazarK
ms.author: v-ekrieg
ms.topic: tutorial
ms.date: 07/29/2021
ms.custom: template-tutorial
---

# Tutorial: Integrate Splunk with Azure Defender for IoT

This tutorial will help you learn how to integrate, and use Splunk with Azure Defender for IoT.

Defender for IoT mitigates IIoT, ICS, and SCADA risk with patented, ICS-aware self-learning engines that deliver immediate insights about ICS devices, vulnerabilities, and threats in less than an image hour and without relying on agents, rules or signatures, specialized skills, or prior knowledge of the environment.

To address a lack of visibility into the security and resiliency of OT networks, Defender for IoT developed the Defender for IoT, IIoT, and ICS threat monitoring application for Splunk, a native integration between Defender for IoT and Splunk that enables a unified approach to IT and OT security.

The application provides SOC analysts with multidimensional visibility into the specialized OT protocols and IIoT devices deployed in industrial environments, along with ICS-aware behavioral analytics to rapidly detect suspicious or anomalous behavior. The application also enables both IT, and OT incident response from within one corporate SOC. This is an important evolution given the ongoing convergence of IT and OT to support new IIoT initiatives, such as smart machines and real-time intelligence.

Splunk application can be installed locally or run on a cloud. The integration with Defender for IoT supports both deployments.

> [!Note]
> References to CyberX refer to Azure Defender for IoT.

In this tutorial, you learn how to:

> [!div class="checklist"]
> * Download the Defender for IoT application in Splunk
> * Send Defender for IoT alerts to Splunk
> * Define alert forwarding rules

## Prerequisites

### Version requirements

The following versions are required for the application to run.

- Defender for IoT version 2.4 and above.

- Splunkbase version 11 and above.

- Splunk Enterprise version 7.2 and above.

### Splunk permission requirements

The following Splunk permission is required:

- Any user with an *Admin* level user role.

