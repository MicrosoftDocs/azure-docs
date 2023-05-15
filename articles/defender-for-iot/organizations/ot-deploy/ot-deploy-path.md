---
title: Deploy Defender for IoT for OT monitoring - Microsoft Defender for IoT
description: Learn about the steps involved in deploying a Microsoft Defender for IoT system for OT monitoring.
ms.topic: install-set-up-deploy
ms.date: 02/13/2023
---

# Deploy Defender for IoT for OT monitoring

This article describes the high-level steps required to deploy Defender for IoT for OT monitoring. Learn more about each deployment step in the sections below, including relevant cross-references for more details.

The following image shows the phases in an end-to-end OT monitoring deployment path, together with the team  responsible for each phase.

While teams and job titles differ across different organizations, all Defender for IoT deployments require communication between the people responsible for the different areas of your network and infrastructure.

:::image type="content" source="../media/deployment-paths/ot-deploy.png" alt-text="Diagram of an OT monitoring deployment path." border="false" lightbox="../media/deployment-paths/ot-deploy.png":::

> [!TIP]
> Each step in the process can take a different amount of time. For example, downloading an OT sensor activation file may take five minutes, while configuring traffic monitoring may take days or even weeks, depending on your organization's processes.
>
> We recommend that you start the process for each step without waiting for it to be completed before moving on to the next step. Make sure to continue following up on any steps still in process to ensure their completion.

## Prerequisites

Before you start planning your OT monitoring deployment, make sure that you have an Azure subscription and an OT plan onboarded Defender for IoT.

For more information, see [Add an OT plan to your Azure subscription](../getting-started.md).

## Planning and preparing

The following image shows the steps included in the planning and preparing phase. Planning and preparing steps are handled by your architecture teams.

:::image type="content" source="../media/deployment-paths/plan-prepare.png" alt-text="Diagram of the steps included in the planning and preparing stage." border="false" :::

#### Plan your OT monitoring system

Plan basic details about your monitoring system, such as:

- **Sites and zones**: Decide how you'll segment the network you want to monitor using *sites* and *zones* that can represent locations all around the world.

- **Sensor management**: Decide on whether you'll be using cloud-connected or air-gapped, locally-managed OT sensors, or a hybrid system of both. If you're using cloud-connected sensors, select a connection method, such as connecting directly or via a proxy.

- **Users and roles**: List of the types of users you'll need on each sensor, and the roles that they'll need for each activity.

For more information, see [Plan your OT monitoring system with Defender for IoT](../best-practices/plan-corporate-monitoring.md).

> [!TIP]
> If you're using several locally-managed sensors, you may also want to deploy an [on-premises management console](air-gapped-deploy.md) for central visibility and management.
>
#### Prepare for an OT site deployment

Define additional details for each site planned in your system, including:

- **A network diagram**. Identify all of the devices you want to monitor and create a well-defined list of subnets. After you've deployed your sensors, use this list to verify that all the subnets you want to monitor are covered by Defender for IoT.

- **A list of sensors**: Use the list of traffic, subnets, and devices you want to monitor to create a list of the OT sensors you'll need and where they'll be placed in your network.

- **Traffic mirroring methods**: Choose a traffic mirroring method for each OT sensor, such as a SPAN port or TAP.

- **Appliances**: Prepare a deployment workstation and any hardware or VM appliances you'll be using for each of the OT sensors you've planned. If you're using pre-configured appliances, make sure to order them.

For more information, see [Prepare an OT site deployment](../best-practices/plan-prepare-deploy.md).

## Onboard sensors to Azure

The following image shows the step included in the onboard sensors phase. Sensors are onboarded to Azure by your deployment teams.

:::image type="content" source="../media/deployment-paths/onboard-sensors.png" alt-text="Diagram of the onboard sensors phase."border="false" :::

#### Onboard OT sensors on the Azure portal

Onboard as many OT sensors to Defender for IoT as you've planned. Make sure to download the activation files provided for each OT sensor and save them in a location that will be accessible from your sensor machines.

For more information, see [Onboard OT sensors to Defender for IoT](../onboard-sensors.md).

## Site networking setup

The following image shows the steps included in the site networking setup phrase. Site networking steps are handled by your connectivity teams.

:::image type="content" source="../media/deployment-paths/site-networking-setup.png" alt-text="Diagram of the site networking setup phase." border="false":::

#### Configure traffic mirroring in your network

Use the plans you'd created [earlier](#prepare-for-an-ot-site-deployment) to configure traffic mirroring at the places in your network where you'll be deploying OT sensors and mirroring traffic to Defender for IoT.

For more information, see:

- [Configure mirroring with a switch SPAN port](../traffic-mirroring/configure-mirror-span.md)
- [Configure traffic mirroring with a Remote SPAN (RSPAN) port](../traffic-mirroring/configure-mirror-rspan.md)
- [Configure active or passive aggregation (TAP)](../best-practices/traffic-mirroring-methods.md#active-or-passive-aggregation-tap)
- [Configure traffic mirroring with an encapsulated remote switched port analyzer (ERSPAN)](../traffic-mirroring/configure-mirror-erspan.md)
- [Configure traffic mirroring with a ESXi vSwitch](../traffic-mirroring/configure-mirror-esxi.md)
- [Configure traffic mirroring with a Hyper-V vSwitch](../traffic-mirroring/configure-mirror-hyper-v.md)

#### Provision for cloud management

Configure any firewall rules to ensure that your OT sensor appliances will be able to access Defender for IoT on the Azure cloud. If you're planning to connect via a proxy, you'll configure those settings only after installing your sensor.

Skip this step for any OT sensor that is planned to be air-gapped and managed locally, either directly on the sensor console, or via an [on-premises management console](air-gapped-deploy.md).

For more information, see [Provision OT sensors for cloud management](provision-cloud-management.md).

## Deploy your OT sensors

The following image shows the steps included in the sensor deployment phase. OT sensors are deployed and activated by your deployment team.

:::image type="content" source="../media/deployment-paths/deploy-sensors.png" alt-text="Diagram of the OT sensor deployment phase." border="false":::

#### Install your OT sensors

If you're installing Defender for IoT software on your own appliances, download installation software from the Azure portal and install it on your OT sensor appliance.

After installing your OT sensor software, run several checks to validate the installation and configuration.

For more information, see:

- [Install OT monitoring software on OT sensors](install-software-ot-sensor.md)
- [Validate an OT sensor software installation](post-install-validation-ot-software.md)

Skip these steps if you're purchasing [pre-configured appliances](../ot-pre-configured-appliances.md).

#### Activate your OT sensors and initial setup

Use an initial setup wizard to confirm network settings, activate the sensor, and apply SSH/TLS certificates.

For more information, see [Activate and set up your OT network sensor](activate-deploy-sensor.md).

#### Configure proxy connections

If you've decided to use a proxy to connect your sensors to the cloud, set up your proxy and configure settings on your sensor. For more information, see [Configure proxy settings on an OT sensor](../connect-sensors.md).

Skip this step in the following situations:

- For any OT sensor where you're connecting directly to Azure, without a proxy
- For any sensor that is planned to be air-gapped and managed locally, either directly on the sensor console, or via an [on-premises management console](air-gapped-deploy.md).

#### Configure optional settings

We recommend that you configure an Active Directory connection for managing on-premises users on your OT sensor, and also setting up sensor health monitoring via SNMP.

If you don't configure these settings during deployment, you can also return and configure them later on.

For more information, see:

- [Set up SNMP MIB monitoring on an OT sensor](../how-to-set-up-snmp-mib-monitoring.md)
- [Configure an Active Directory connection](../manage-users-sensor.md#configure-an-active-directory-connection)

## Calibrate and fine-tune OT monitoring

The following image shows the steps involved in calibrating and fine-tuning OT monitoring with your newly deployed sensor. Calibration and fine-tuning activities are done by your deployment team.

:::image type="content" source="../media/deployment-paths/calibrate-fine-tune.png" alt-text="Diagram of the calibrate and fine-tuning phase." border="false":::

#### Control OT monitoring on your sensor

By default, your OT sensor may not detect the exact networks that you want to monitor, or identify them in precisely the way you'd like to see them displayed. Use the [lists you'd created earlier](#prepare-for-an-ot-site-deployment) to verify and manually configure the subnets, customize port and VLAN names, and configure DHCP address ranges as needed.

For more information, see [Control the OT traffic monitored by Microsoft Defender for IoT](../how-to-control-what-traffic-is-monitored.md).

#### Verify and update your detected device inventory

After your devices are fully detected, review the device inventory and modify the device details as needed. For example, you might identify duplicate device entries that can be merged, device types or other properties to modify, and more.

For more information, see [Verify and update your detected device inventory](update-device-inventory.md).

#### Learn OT alerts to create a network baseline

The alerts triggered by your OT sensor may include several alerts that you'll want to regularly ignore, or *Learn*, as authorized traffic.

Review all the alerts in your system as an initial triage. This step creates a network traffic baseline for Defender for IoT to work with moving forward.

For more information, see [Create a learned baseline of OT alerts](create-learned-baseline.md).

## Baseline learning ends

Your OT sensors will remain in *Learning mode* for as long as new traffic is detected and you have unhandled alerts.

:::image type="content" source="../media/deployment-paths/baseline-learning-ends.png" alt-text="Diagram of the deployment phase where baseline learning ends." border="false":::

When baseline learning ends, the OT monitoring deployment process is complete, and you'll continue on in operational mode for ongoing monitoring. In operational mode, any activity that differs from your baseline data will trigger an alert.

> [!TIP]
> [Turn off learning mode manually](../how-to-manage-individual-sensors.md#turn-off-learning-mode-manually) if you feel that the current alerts in Defender for IoT reflect your network traffic accurately, and learning mode hasn't already ended automatically.
>

## Next steps

Now that you understand the OT monitoring system deployment steps, you're ready to get started!

> [!div class="step-by-step"]
> [Plan your OT monitoring system with Defender for IoT »](../best-practices/plan-corporate-monitoring.md)
