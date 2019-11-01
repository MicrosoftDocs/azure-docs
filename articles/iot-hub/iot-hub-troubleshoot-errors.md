---
title: Troubleshooting Azure IoT Hub errors
description: Understand how to troubleshoot errors for Azure IoT Hub 
author: jlian
manager: briz
ms.service: iot-hub
services: iot-hub
ms.topic: troubleshooting
ms.date: 11/01/2019
ms.author: jlian
# As a developer or operator for Azure IoT Hub, I need to know how to find and resolve common errors that occur with IoT Hub.
---
# Troubleshoot Azure IoT Hub errors

This article provides information about how to find IoT Hub error codes. You can use Azure Monitor diagnostic settings and Azure Monitor alerts to log errors that occur on your IoT hub. You can then examine the generated logs to get the underlying error codes. Once you have an error code, you can use the articles under [Problem Resolution](./iot-hub-troubleshoot-error-401002-authenticationfailed.md) to understand what the possible causes of some common errors might be and how to mitigate them.

To learn about how to enable Azure Monitor diagnostic settings for IoT Hub, see [Use Azure Monitor](./iot-hub-monitor-resource-health.md#use-azure-monitor). For a tutorial about how to set up Azure monitor diagnostics and alerts, see [Set up and use metrics and diagnostic logs with an IoT hub](./tutorial-use-metrics-and-diags.md).

## Find error codes

When you turn on diagnostic logs and alerts for connected devices, you get alerts when errors occur. This section describes how to find the specific error that occurred when you receive an alert. The steps below assume you've set up Azure Monitor logs for your diagnostic logs.

1. Go your workspace for **Log Analytics** in the Azure portal.

2. Select **Log Search**.

3. Enter a query to search for the category of error you are interested in. For example, to isolate connectivity error logs for IoT Hub, enter the following query and then select **Run**:

    ```kusto
    search *
    | where ( Type == "AzureDiagnostics" and ResourceType == "IOTHUBS")
    | where ( Category == "Connections" and Level == "Error")
    ```

4. If there are results, look for `OperationName`, `ResultType` (error code), and `ResultDescription` (error message) to get more detail on the error.

   ![Example of error log](./media/iot-hub-troubleshoot-errors/diag-logs.png)

5. Use `ResultType` (error code) and `ResultDescription` (error message) to locate the error from the list of common errors under [Problem Resolution](./iot-hub-troubleshoot-error-401002-authenticationfailed.md) and learn about its cause and possible ways to resolve it.

## Other steps to try

If the previous steps don't help, you can try:

* If you have access to the problematic devices, either physically or remotely (like SSH), follow the [device-side troubleshooting guide](https://github.com/Azure/azure-iot-sdk-node/wiki/Troubleshooting-Guide-Devices) to continue troubleshooting.

* Verify that your devices are **Enabled** in the Azure portal > your IoT hub > IoT devices.

* Get help from [Azure IoT Hub forum](https://social.msdn.microsoft.com/Forums/azure/home?forum=azureiothub), [Stack Overflow](https://stackoverflow.com/questions/tagged/azure-iot-hub), or [Azure support](https://azure.microsoft.com/support/options/).

## Next steps

* To learn more about resolving common errors with IoT Hub, see the topics under [Problem Resolution](./iot-hub-troubleshoot-error-401002-authenticationfailed.md).
