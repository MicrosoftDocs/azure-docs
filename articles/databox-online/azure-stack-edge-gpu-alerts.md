---
title: Review alerts on Azure Stack Edge Pro GPU 
description: Describes alerts that can occur on Azure Stack Edge Pro GPU device.
services: databox
author: v-dalc

ms.service: databox
ms.subservice: edge
ms.topic: how-to
ms.date: 09/30/2021
ms.author: alkohli
---
# Review alerts on an Azure Stack Edge Pro GPU device

This article describes alerts that occur on an Azure Stack Edge Pro GPU device and steps to take when you receive the alert. The alerts generate notifications in the Azure portal.

> [!NOTE]
> You can also monitor activity logs for virtual machines in the Azure portal. For more information, see [Monitor VM activity on your device](azure-stack-edge-gpu-monitor-virtual-machine-activity.md).


## View alerts in the Azure portal

IN DEVELOPMENT

## ARM alerts

The following alerts are generated when ... .

| Alert description                                                                             | Severity | Suggested resolution                                                                                          |
|------------------------------------------------------------------------------------------------|----------|---------------------------------------------------------------------------------------------------------------|
| Contact <a href=”http://aka.ms/getazuresupport”>Microsoft Support</a> for next steps.          | Critical | One or more device components are not working properly.                                                       |
| Specified service authentication certificate with thumbprint '{0}' does not have a private key | Critical | If the issue persists, <a href="http://aka.ms/getazuresupport" target="_blank">contact Microsoft Support</a>. |
| Certificate with thumbprint '{0}' at location '{1}' is not found or not accessible             | Critical | If the issue persists, <a href="http://aka.ms/getazuresupport" target="_blank">contact Microsoft Support</a>. |
| Unable to connect endpoint: '{0}'                                                              | Critical | If the issue persists, <a href="http://aka.ms/getazuresupport" target="_blank">contact Microsoft Support</a>. |
| Error occurred during web request: '{0}'                                                       | Critical | If the issue persists, <a href="http://aka.ms/getazuresupport" target="_blank">contact Microsoft Support</a>. |
| Request timed out for url: '{0}'                                                               | Critical | If the issue persists, <a href="http://aka.ms/getazuresupport" target="_blank">contact Microsoft Support</a>. |
| Unable to get Token using login endpoint '{0}' for resource '{1}'                              | Critical | If the issue persists, <a href="http://aka.ms/getazuresupport" target="_blank">contact Microsoft Support</a>. |
| Unknown error occurred. ErrorCode:'{0}'. Details: '{1}'                                        | Critical | If the issue persists, <a href="http://aka.ms/getazuresupport" target="_blank">contact Microsoft Support</a>. |
| The service has failed over to a secondary data center due to an unexpected failure.           | Warning  | Wait for the failover to complete. After the failover is complete, this alert is cleared.                     |

## ASE RP alerts

The following alerts are generated when ... .

| Alert description                            | Severity           | Recommended action                                                              |
|-----------------------------------|--------------------|---------------------------------------------------------------------------------|
| {0} from {1} expires in {2} days. | Critical | Warning | Check your certificate and upload a new certificate before the expiration date. |

## Compute alerts

The following alerts are generated when ... .

| Alert description | Severity | Recommended action      |
|-------------------|----------|-------------------------|
| {0} of type {1} is not valid. | Critical | Check your certificate. If the certificate is not valid, upload a new certificate.|
| Could not connect to the Azure. | Critical | Check your internet connection. In the local web UI of the device, go to Troubleshooting > Diagnostic tests. Run the Internet connectivity diagnostic test. |
| The cluster quorum witness resource is offline. | Critical | Take the following steps: STOPPING HERE.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    |
|                                                                                                              | 1. Check the witness resource.                                              |
|                                                                                                              | 2. Start or replace failed nodes on your device."                           |
| The CPU utilization on your device has exceeded the threshold for an extended duration.                      | Critical                                                                    | Reduce workloads or modules running on your device. If the problem persists, contact Microsoft Support.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        |
| The CPUs reserved for the Virtual Machines on your device exceeds the configured threshold.                  | Critical                                                                    | "Take one of the following steps:                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              |
|                                                                                                              | 1. Reduce CPU reservation for the virtual machines running on your device.  |
| Remove some virtual machines off your device."                                                               |
| The memory used by the virtual machines on your device exceeds the configured threshold.                     | Critical                                                                    | "Take one of the following steps:                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              |
|                                                                                                              | 1. Reduce memory allocated for the virtual machines running on your device. |
| Remove some virtual machines off your device."                                                               |
| Compute acceleration card configuration has an issue.                                                        | Critical                                                                    | "We've detected an unsupported compute acceleration card configuration.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        |
|                                                                                                              |
| Before you contact Microsoft Support, follow these steps:                                                    |
| 1.                                                                                                           | In the local web UI, go to Troubleshooting > Support.                       |
| 2.                                                                                                           | Create and download a support package.                                      |
| 3.                                                                                                           | Create a [Support request]( http://aka.ms/getazuresupport).                 |
| 4.                                                                                                           | Attach the package to the support request."                                 |
| Compute acceleration card configuration has an issue.                                                        | Critical                                                                    | "We've detected an unsupported compute acceleration card configuration.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        |
|                                                                                                              |
| Before you contact Microsoft Support, follow these steps:                                                    |
| 1.                                                                                                           | In the local web UI, go to Troubleshooting > Support.                       |
| 2.                                                                                                           | Create and download a support package.                                      |
| 3.                                                                                                           | Create a [Support request]( http://aka.ms/getazuresupport).                 |
| 4.                                                                                                           | Attach the package to the support request."                                 |
| Compute acceleration card performance is degraded.                                                           | Warning                                                                     | "This might be because the compute acceleration card has a high usage. Consider stopping or reducing the workload on the Azure IoT Machine Learning module.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    |
|                                                                                                              |
| Before you contact Microsoft Support, follow these steps:                                                    |
| 1. In the local web UI, go to Troubleshooting > Support.                                                     |
| 2. Create and download a support package.                                                                    |
| 3. Create a [Support request]( http://aka.ms/getazuresupport).                                               |
| 4. Attach the package to the support request."                                                               |
| Shutting down the compute acceleration card as the card temperature has exceeded the operating limit!        | Critical                                                                    | "This is due to an internal error.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             |
|                                                                                                              |
| Before you contact Microsoft Support, follow these steps:                                                    |
| 1. In the local web UI, go to Troubleshooting > Support.                                                     |
| 2. Create and download a support package.                                                                    |
| 3. Create a [Support request]( http://aka.ms/getazuresupport).                                               |
| 4. Attach the package to the support request."                                                               |
| Compute acceleration card temperature is rising.                                                             | Warning                                                                     | "This might be because the compute acceleration card has a high usage. Consider stopping or reducing the workload on the Azure IoT Machine Learning module.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    |
|                                                                                                              |
| Before you contact Microsoft Support, follow these steps:                                                    |
| 1. In the local web UI, go to Troubleshooting > Support.                                                     |
| 2. Create and download a support package.                                                                    |
| 3. Create a [Support request]( http://aka.ms/getazuresupport).                                               |
| 4. Attach the package to the support request."                                                               |
| Compute acceleration card configuration has an issue.                                                        | Critical                                                                    | "This may be due to one of the following reasons:                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              |
| 1. If the card is an FPGA, the image is not valid.                                                           |
| 2.  Compute acceleration card isn't seated properly.                                                         |
| 3. Underlying issues with the compute acceleration driver.                                                   |
|                                                                                                              |
| To resolve the issue, redeploy the Azure IoT Edge module. Once the issue is resolved, the alert goes away.   |
|                                                                                                              |
| If the issue persists, do the following:                                                                     |
| 1. In the local web UI, go to Troubleshooting > Support.                                                     |
| 2. Create and download a support package.                                                                    |
| 3. Create a [Support request]( http://aka.ms/getazuresupport).                                               |
| 4. Attach the package to the support request."                                                               |
| Compute acceleration card on your device is unhealthy.                                                       | Critical                                                                    | "This is due to an internal error.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             |
|                                                                                                              |
| Before you contact Microsoft Support, follow these steps:                                                    |
| 1. In the local web UI, go to Troubleshooting > Support.                                                     |
| 2. Create and download a support package.                                                                    |
| 3. Create a [Support request]( http://aka.ms/getazuresupport).                                               |
| 4. Attach the package to the support request."                                                               |
| Compute acceleration card configuration has an issue.                                                        | Critical                                                                    | "We've detected an unsupported compute acceleration card.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      |
|                                                                                                              |
| Before you contact Microsoft Support, follow these steps:                                                    |
| 1. In the local web UI, go to Troubleshooting > Support.                                                     |
| 2. Create and download a support package.                                                                    |
| 3. Create a [Support request]( http://aka.ms/getazuresupport).                                               |
| 4. Attach the package to the support request."                                                               |
| Compute acceleration card configuration has an issue.                                                        | Critical                                                                    | "This may be due to one of the following reasons:                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              |
| 1. If the card is an FPGA, the image is not valid.                                                           |
| 2.  Compute acceleration card isn't seated properly.                                                         |
| 3. Underlying issues with the compute acceleration driver.                                                   |
|                                                                                                              |
| To resolve the issue, redeploy the Azure IoT Edge module. Once the issue is resolved, the alert goes away.   |
|                                                                                                              |
| If the issue persists, do the following:                                                                     |
| 1. In the local web UI, go to Troubleshooting > Support.                                                     |
| 2. Create and download a support package.                                                                    |
| 3. Create a [Support request]( http://aka.ms/getazuresupport).                                               |
| 4. Attach the package to the support request."                                                               |
| Compute acceleration card configuration has an issue.                                                        | Critical                                                                    | "This is due to an internal error.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             |
|                                                                                                              |
| Before you contact Microsoft Support, follow these steps:                                                    |
| 1. In the local web UI, go to Troubleshooting > Support.                                                     |
| 2. Create and download a support package.                                                                    |
| 3. Create a [Support request]( http://aka.ms/getazuresupport).                                               |
| 4. Attach the package to the support request."                                                               |
| Compute acceleration card driver software is not running.                                                    | Critical                                                                    | "This is due to an internal error.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             |
|                                                                                                              |
| Before you contact Microsoft Support, follow these steps:                                                    |
| 1. In the local web UI, go to Troubleshooting > Support.                                                     |
| 2. Create and download a support package.                                                                    |
| 3. Create a [Support request]( http://aka.ms/getazuresupport).                                               |
| 4. Attach the package to the support request."                                                               |
| Compute acceleration card configuration has an issue.                                                        | Critical                                                                    | "This may be due to one of the following reasons:                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              |
| 1. If the card is an FPGA, the image is not valid.                                                           |
| 2.  Compute acceleration card isn't seated properly.                                                         |
| 3. Underlying issues with the compute acceleration driver.                                                   |
|                                                                                                              |
| To resolve the issue, redeploy the Azure IoT Edge module. Once the issue is resolved, the alert goes away.   |
|                                                                                                              |
| If the issue persists, do the following:                                                                     |
| 1. In the local web UI, go to Troubleshooting > Support.                                                     |
| 2. Create and download a support package.                                                                    |
| 3. Create a [Support request]( http://aka.ms/getazuresupport).                                               |
| 4. Attach the package to the support request."                                                               |
| Compute acceleration card configuration has an issue.                                                        | Critical                                                                    | "As your Azure IoT Machine Learning module starts up, you may see this transient issue. Wait a few minutes to see if the issue resolves.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       |
|                                                                                                              |
| If the issue persists, do the following:                                                                     |
| 1. In the local web UI, go to Troubleshooting > Support.                                                     |
| 2. Create and download a support package.                                                                    |
| 3. Create a [Support request]( http://aka.ms/getazuresupport).                                               |
| 4. Attach the package to the support request."                                                               |
| Could not reach {1}.                                                                                         | Critical                                                                    | "If the controller is turned off, restart the controller.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      |
| Make sure that the power supply is functional.                                                               |
| For information on monitoring the power supply LEDs, go to http://www.microsoft.com/2.                       |
| If the issue persists, contact Microsoft Support."                                                           |
| Lost heartbeat from your device.                                                                             | Critical                                                                    | If your device is offline, then the device is not able to communicate with the Azure service. This could be due to one of the following reasons: <br/> &nbsp;1. The Internet connectivity is broken. Check your internet connection. In the local web UI of the device, go to Troubleshooting > Diagnostic tests. Run the diagnostic tests. Resolve the reported issues.<br/> &nbsp;2. The device is turned off or paused on the hypervisor. Turn on your device! For more information, go to <a href="https://aka.ms/dbe-device-local-mgmt" target="_blank">Turn on your device</a>. <br/>&nbsp;3. Your device could have rebooted due to an update. Wait a few minutes and try to reconnect. |
| Could not replace {0}.                                                                                       | Warning                                                                     | Contact <a href=”http://aka.ms/getazuresupport”>Microsoft Support</a> for next steps.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          |
| Started the replacement of {0}.                                                                              | Informational                                                               | No action is required from you.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                |
| Successfully replaced {0}.                                                                                   | Informational                                                               | No action is required from you.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                |
| Could not start the VM service on the device.                                                                | Critical                                                                    | If you see this alert, contact Microsoft Support.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              |
| VM service is not running on the device.                                                                     | Critical                                                                    | If you see this alert, contact Microsoft Support.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              |
| Edge compute ran into an issue with name resolution.                                                         | Critical                                                                    | Ensure that your DNS server {15} is online and reachable. If the problem persists, contact your network administrator.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         |
| Edge compute is unhealthy.                                                                                   | Critical                                                                    | Restart your device to resolve the issue. In the local web UI of your device, go to Maintenance > Power settings and click Restart. <br> If the problem persists, contact Microsoft Support.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   |
| TBD                                                                                                          | Critical                                                                    | TBD                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            |
| Edge compute couldn’t access data on share {16}. This may be because the share doesn’t exist anymore.        | Warning                                                                     | "If the share does not {16} exist, restart your device to resolve the issue. In the local web UI of your device, go to Maintenance > Power settings and click Restart.<br>                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     |
| If the problem persists, contact Microsoft Support."                                                         |
| IoT Edge agent is not running.                                                                               | Warning                                                                     | Restart your device to resolve the issue. In the local web UI of your device, go to Maintenance > Power settings and click Restart. <br>If the problem persists, contact Microsoft Support.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    |
| IoT Edge service is not running.                                                                             | Warning                                                                     | Restart your device to resolve the issue. In the local web UI of your device, go to Maintenance > Power settings and click Restart. <br> If the problem persists, contact Microsoft Support.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   |
| Your Edge compute module {20} is disconnected from IoT Edge hub.                                             | Warning                                                                     | Restart your device to resolve the issue. In the local web UI of your device, go to Maintenance > Power settings and click Restart. <br>If the problem persists, contact Microsoft Support.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    |



## ObjStore alerts

The following alerts are generated when ... .



## Security alerts

The following alerts are generated when ... .



## SwPlatform alerts

The following alerts are generated when ... .



## Tiering alerts

The following alerts are generated when ... .



## VM alerts

The following alerts are generated when ... .



## Unclassified

The following alerts are generated when ... .




## Next steps

- [Monitor the VM activity log](azure-stack-edge-gpu-monitor-virtual-machine-activity.md).
- [Troubleshoot VM provisioning on Azure Stack Edge Pro GPU](azure-stack-edge-gpu-troubleshoot-virtual-machine-provisioning.md).