---
title: Concepts
description: 
author: shhazam-ms
manager: rkarlin
ms.author: shhazam
ms.date: 10/28/2020
ms.topic: article
ms.service: azure
---

# Concepts

## Key Advantages

XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX

## Cloud Connection (Not Written yet) 

XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX

## Air-gapped networks (#CM_About the_Console_Start)

XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX

## Sensor Management (Sensor, CMm and Cloud) (Not Written yet) 

XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX

## Learning modes

The learning mode instructs your sensor to learn your networks usual activity. For example, devices discovered in your network, protocols detected in the network, file transfers between specific devices, and more. This activity becomes your network baseline.

***About the Learning mode***

The **Learning** mode is automatically enabled after installation and will remain enabled until turned off. The approximate learning mode period is between two to six weeks, depending on the network size and complexity. After this period, when the learning mode is disabled, any new activity detected will trigger alerts. Alerts are triggered when the policy engine discovers deviations from your learned baseline.

***About the Smart IT Learning Mode***

After the learning period is complete and the learning mode is disabled, the sensor may detect an unusually high level of baseline changes that are the result of normal IT activity, for example DNS and HTTP requests. The activity is referred to as nondeterministic IT behavior. The behavior may also trigger unnecessary policy violation alerts and system notifications. To reduce the amount of these alerts and notifications, you can enable the **Smart IT Learning** function.

When **Smart IT Learning** is enabled, the sensor tracks network traffic that generates non-deterministic IT behavior based on specific alert scenarios.

The sensor monitors this traffic for seven days. If it detects the same nondeterministic IT traffic within the seven days, it continues to monitor the traffic for another seven days. When the traffic is not detected for a full seven days, **Smart IT Learning** is disabled for that scenario. New traffic detected for that scenario will only then generate alerts and notifications.

Working with **Smart IT Learning** helps you reduce the number of unnecessary alerts and notifications caused by noisy IT scenarios.

If your sensor is controlled by the on-premises management console, you cannot disable the learning modes. In cases like this, the learning mode can only be disabled from the management console.

The learning capabilities (**Learning** and **Smart IT Learning**) are enabled by default.

**To enable or disable learning:**

- Select **System Settings** and toggle the **Learning** and **Smart IT Learning** options.

  :::image type="content" source="media/toggle-options-for-learning-and-smart-it-learning.png" alt-text="System settings toggle screen":::

## Alerting (sensor, CM, Cloud) (Not Written yet) 

XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX

## Maps (senor and CM) (Not Written yet) 

XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX

## Asset Inventory (senor, CM, Cloud) (Not Written yet) 

XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX

## User roles and permissions

This article provides information about user roles, and editing user profiles.

User permissions are designed to facilitate granular security roles within your organization. The following roles are available:

  - **Read Only** – The read only (RO) user can instantly evaluate overall system status. In addition, the RO performs tasks such as checking alerts and devices. RO users see the **Navigation** section only.

  - **Security Analyst** – The security analyst has the permissions of the RO user and can also perform actions on devices, investigate and acknowledge alerts, use the investigation features. Security analysts can see the **Navigation** and **Analysis** sections.

  - **Administrator** – The administrator has all the permissions of the RO and the security analyst and can also manage the system configuration, create, and delete users and create notifications. Administrators can see the **Navigation, Analysis**, and **Administration** sections.

See [Manage Users](./manage-users.md) for details about creating users and permission assignments.

## Reporting (senor and CM) (Not Written yet) 

XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX

## Integrations 

You can expand Defender for IoT's capabilities by sharing both device and alert information with third-party systems. Integrations help enterprises bridge previously siloed security solutions to significantly enhance device visibility and threat intelligence, as well as accelerate the system wide responses and mitigate risks faster.

Integrations reduce complexity and eliminate IT and OT silos by integrating them into your existing SOC workflows and security stack. For example:

  - SIEMs such as IBM QRadar, Splunk, ArcSight, LogRhythm, RSA NetWitness

  - Security orchestration and ticketing systems such as ServiceNow, IBM Resilient

  - Secure remote access solutions such as CyberArk Privileged Session Manager (PSM), BeyondTrust

  - Secure network access control (NAC) systems such as Aruba ClearPass, Forescout CounterACT

  - Firewalls such as Fortinet and Checkpoint

Refer to the [Defender for IoT Help Center](https://cyberx-labs.zendesk.com/hc/en-us/categories/360000602111-Integrations) for documentation on integrated solutions.

:::image type="content" source="media/sample-integration-screens.png" alt-text="Integration samples for Defender for IoT":::

## Proprietary protocols

**Complete Protocol Support:** In addition to embedded protocol support, you can secure IoT and ICS devices running proprietary and custom protocols, or protocols that deviate from any standard. Using the *Horizon Open Development Environment (ODE) SDK*, developers can create dissector plugins that decode network traffic based on defined protocols. Traffic is analyzed by services to provide complete monitoring, alerting and reporting. Use Horizon to:

   - **Expand** visibility and control without the need to upgrade to new versions.

   - **Secure** proprietary information by developing on-site as an external plugin.

   - **Localize** text for alerts, events, and protocol parameters

## High availability

Increase the resiliency of your Defender for ioT deployment by installing a on-premises management console high availability appliance. High availability deployments ensure your managed sensors continuously report to an active on-premises management console.

This deployment is implemented with a on-premises management console pair that includes a primary and secondary appliance.
