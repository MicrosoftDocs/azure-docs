---
title: Troubleshoot Start/Stop VMs
description: This article tells how to troubleshoot issues encountered with the Start/Stop VMs feature for your Azure VMs.
services: azure-functions
ms.subservice: start-stop-vms
ms.date: 06/08/2022
ms.topic: conceptual
---

# Troubleshoot common issues with Start/Stop VMs

This article provides information on troubleshooting and resolving issues that may occur while attempting to install and configure Start/Stop VMs. For general information, see [Start/Stop VMs overview](overview.md).

## General validation and troubleshooting

This section covers how to troubleshoot general issues with the schedules scenarios and help identify the root cause.

### Azure dashboard

You can start by reviewing the Azure shared dashboard. The Azure shared dashboard deployed as part of Start/Stop VMs v2 is a quick and easy way to verify the status of each operation that's performed on your VMs. Refer to the **Recently attempted actions on VMs** tile to see all the recent operations executed on your VMs. There is some latency, around five minutes, for data to show up in the report as it pulls data from the Application Insights resource.

### Logic Apps

Depending on which Logic Apps you have enabled to support your start/stop scenario, you can review its run history to help identify why the scheduled startup/shutdown scenario did not complete successfully for one or more target VMs. To learn how to review this in detail, see [Logic Apps run history](../../logic-apps/monitor-logic-apps.md#review-runs-history).

### Azure Storage

You can review the details for the operations performed on the VMs that are written to the table **requestsstoretable** in the Azure storage account used for Start/Stop VMs v2. Perform the following steps to view those records.

1. Navigate to the storage account in the Azure portal and in the account select **Storage Explorer** from the left-hand pane.
1. Select **TABLES** and then select **requeststoretable**.
1. Each record in the table represents the start/stop action performed against an Azure VM based on the target scope defined in the logic app scenario. You can filter the results by any one of the record properties (for example, TIMESTAMP, ACTION, or TARGETTOPLEVELRESOURCENAME).

### Azure Functions

You can review the latest invocation details for any of the Azure Functions responsible for the VM start and stop execution. First let's review the execution flow.

The execution flow for both **Scheduled** and **Sequenced** scenario is controlled by the same function. The payload schema is what determines which scenario is performed. For the **Scheduled** scenario, the execution flow is - **Scheduled** HTTP > **VirtualMachineRequestOrchestrator** Queue > **VirtualMachineRequestExecutor** Queue.

From the logic app, the **Scheduled** HTTP function is invoked with Payload schema. Once the **Scheduled** HTTP function receives the request, it sends the information to the **Orchestrator** queue function, which in turn creates several queues for each VM to perform the action.

Perform the following steps to see the invocation details.

1. In the Azure portal, navigate to **Azure Functions**.
1. Select the Function app for Start/Stop VMs v2 from the list.
1. Select **Functions** from the left-hand pane.
1. In the list, you see several functions associated for each scenario. Select the **Scheduled** HTTP function.
1. Select **Monitor** from the left-hand pane.
1. Select the latest execution trace to see the invocation details and the message section for detailed logging.
1. Repeat the same steps for each function described as part of reviewing the execution flow earlier.

To learn more about monitoring Azure Functions, see [Analyze Azure Functions telemetry in Application Insights](../../azure-functions/analyze-telemetry-data.md).

## Next steps

Learn more about monitoring Azure Functions and logic apps:

* [Monitor Azure Functions](../../azure-functions/functions-monitoring.md).

* [How to configure monitoring for Azure Functions](../../azure-functions/configure-monitoring.md).

* [Monitor logic apps](../../logic-apps/monitor-logic-apps.md).

* If you run into problems during deployment, you encounter an issue when using Start/Stop VMs v2, or if you have a related question, you can submit an issue on [GitHub](https://github.com/microsoft/startstopv2-deployments/issues). Filing an Azure support incident from the [Azure support site](https://azure.microsoft.com/support/options/) is also available for this version. 
