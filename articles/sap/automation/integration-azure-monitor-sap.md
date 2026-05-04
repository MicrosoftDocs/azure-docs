---
title: Configure Azure Monitor for SAP with SAP Deployment Automation Framework
description: Learn how to configure Azure Monitor for SAP with SAP Deployment Automation Framework to automate monitoring of your SAP landscape.
author: devanshjain
ms.author: devanshjain
ms.reviewer: kimforss
ms.date: 04/01/2026
ms.topic: how-to
ms.service: sap-on-azure
ms.subservice: sap-automation
# Customer intent: As an SAP administrator, I want to automate the deployment and monitoring of SAP systems using Azure Monitor and the SAP Deployment Automation Framework, so that I can ensure optimal performance and availability while reducing complexity and costs.
---

# Configure Azure Monitor for SAP with SAP Deployment Automation Framework

Azure Monitor for SAP is an Azure-native monitoring product for SAP landscapes running on Azure. SAP Deployment Automation Framework is an open-source orchestration tool that deploys, installs, and maintains SAP environments on Azure. Setting up monitoring manually across the databases, operating systems, and clusters in an SAP landscape is complex and error-prone.

In this article, you configure Azure Monitor for SAP as part of your SAP Deployment Automation Framework deployment so that the framework automatically provisions monitoring alongside your SAP infrastructure. For more information, see [Azure Monitor for SAP](../monitor/about-azure-monitor-sap-solutions.md) and [SAP Deployment Automation Framework](deployment-framework.md).

> [!NOTE]
> The automation framework currently supports deploying Azure Monitor for SAP resources, the [OS (Linux) provider](../monitor/about-azure-monitor-sap-solutions.md#os-linux-data) for monitoring Azure virtual machines (VMs), and the [HA Pacemaker cluster provider](../monitor/about-azure-monitor-sap-solutions.md#ha-pacemaker-cluster-data) for monitoring high-availability clusters.

## Understand the architecture

The automation framework deploys one Azure Monitor for SAP resource per [workload zone](deployment-framework.md#about-the-sap-workload-zone). The resource monitors performance and availability for all SAP systems in that environment.

:::image type="content" source="./media/deployment-framework/control-plane-sap-infrastructure-monitor.png" alt-text="Diagram that shows the dependency between the control plane, and application plane for SAP Deployment Automation Framework with Azure Monitor for SAP." lightbox="./media/deployment-framework/control-plane-sap-infrastructure-monitor.png":::

The automation framework performs the following steps:

- Creates the Azure Monitor for SAP resource in the workload zone.
- Performs prerequisite steps required to enable monitoring.
- Creates [providers](../monitor/about-azure-monitor-sap-solutions.md#what-can-you-monitor) for each monitored component of the SAP landscape.

The Azure Monitor for SAP resource deployed in the workload zone resource group includes the following [key components](../monitor/about-azure-monitor-sap-solutions.md#what-is-the-architecture):

- Azure Monitor for SAP resource
- Managed resource group that includes:
  - Azure Functions resource
  - Azure Key Vault
  - Log Analytics workspace (optional)
  - Storage account

## Prerequisites

- An Azure subscription. If you don't have an Azure subscription, [create a free account](https://azure.microsoft.com/pricing/purchase-options/azure-account?cid=msft_learn).
- A deployed SAP Deployment Automation Framework [control plane](deployment-framework.md).
- A deployed [SAP workload zone](deployment-framework.md#about-the-sap-workload-zone).
- Terraform installed on your deployment system.

## Configure the workload zone for Azure Monitor for SAP

Add the Azure Monitor for SAP parameters to your workload zone Terraform variables file (`.tfvars`). Optionally, you can use an existing Log Analytics workspace in the same subscription as your workload zone.

1. Open your workload zone `.tfvars` file in an editor.

1. Add the subnet configuration for Azure Monitor for SAP. Set `ams_subnet_address_prefix` to a valid subnet address range in your virtual network.

   ```terraform
   #########################################################################################
   #  AMS subnet variables                                                                 #
   #########################################################################################

   # ams_subnet_name is an optional parameter and should only be used if the default naming is not acceptable
   # ams_subnet_name = ""

   # ams_subnet_address_prefix is a mandatory parameter if the subnets are not defined in the workload or if existing subnets are not used
   ams_subnet_address_prefix = "10.242.25.0/24"

   # ams_subnet_arm_id is an optional parameter that if provided specifies Azure resource identifier for the existing subnet to use
   # ams_subnet_arm_id = ""

   # ams_subnet_nsg_name is an optional parameter and should only be used if the default naming is not acceptable for the network security group name
   # ams_subnet_nsg_name = ""

   # ams_subnet_nsg_arm_id is an optional parameter that if provided specifies Azure resource identifier for the existing network security group to use
   # ams_subnet_nsg_arm_id = ""
   ```

1. Add the Azure Monitor for SAP instance configuration. Set `create_ams_instance` to `true` and configure the instance name.

   ```terraform
   #########################################################################################
   #  AMS instance variables                                                               #
   #########################################################################################

   # create_ams_instance is an optional parameter, and should be set true if the AMS instance is to be created.
   create_ams_instance = true

   # ams_instance_name is an optional parameter and should only be used if the default naming is not acceptable
   ams_instance_name = "AMS-RESOURCE"

   # ams_laws_arm_id is an optional parameter to use an existing Log Analytics workspace for the AMS instance
   ams_laws_arm_id = "/subscriptions/<subscription-id>/resourcegroups/<rg-name>/providers/microsoft.operationalinsights/workspaces/<workspace-name>"
   ```

1. Save and close the file.

1. Deploy the workload zone with the updated configuration by running the deployment script for your workload zone.

## Configure system providers for Azure Monitor for SAP

To enable OS and high-availability cluster monitoring, add the monitoring provider parameters to your SAP system Terraform variables file (`.tfvars`).

1. Open your SAP system `.tfvars` file in an editor.

1. Add the following parameters. Set each parameter to `true` for the provider types you want to enable.

   ```terraform
   # enable_os_monitoring is an optional parameter and should be set to true if you want to monitor the Azure VMs of your SAP system.
   enable_os_monitoring = true

   # enable_ha_monitoring is an optional parameter and should be set to true if you want to monitor the HA clusters of your SAP system.
   enable_ha_monitoring = true
   ```

1. Save and close the file.

1. Deploy the SAP system with the updated configuration by running the system deployment script.

## Related content

- [What is Azure Monitor for SAP?](../monitor/about-azure-monitor-sap-solutions.md)
- [SAP Deployment Automation Framework](deployment-framework.md)
- [Providers for Azure Monitor for SAP](../monitor/about-azure-monitor-sap-solutions.md#what-can-you-monitor)
