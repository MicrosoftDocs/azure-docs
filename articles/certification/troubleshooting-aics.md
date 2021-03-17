---
title: Troubleshooting with Azure IoT Certification Service (AICS)
description: A guide on how to troubleshoot your device during AICS testing for Azure Certified Device program
author: nikuntjo
ms.author: nikuntjo
ms.service: iot-pnp
ms.topic: how-to 
ms.date: 03/03/2021
ms.custom: template-how-to 
---

# Troubleshoot AICS

In the process of testing your device according to our certification requirements, you may find yourself having issues with the Azure IoT Certification Service (AICS) and the automated tests that your device must pass on the Azure Certified Device portal. This troubleshooting guide offers some tips and tricks for common problems that you may run into while certifying your device.

## Prerequisites

- You should be signed in and have a project for your device created on the [Azure Certified Device portal](https://certify.azure.com). For more information, view the [tutorial](tutorial-01-creating-your-project.md).

## AICS tests keep failing

Your device may fail the automated certification testing for a number of reasons. Below are some common issues and quick steps to take to resolve the issue or learn more about the root cause.

1. **Your device code is not setting the Model ID payload during DPS provisioning**: This is a [requirement](concepts-requirements-azure-certified-device-.md) for all devices to be able to run the certification tests. Adjust your device code and re-run the certification tests.
1. **Your device is not reporting declared telemetry or not completing required events during AICS**: Check the telemetry logs from previous test runs by pressing the `View Logs` button to identify what is causing the test to fail. Both the test messaging and raw data are available for review.  

    ![Review test data](./media/images/review_logs.png)
1. If the automated tests continue to fail,  you can `request a manual review` of the results to substitute for AICS. This will trigger a request for a **manual validation** session with the Azure Certified Device team.  

    ![Review test data](./media/images/request_manual_review.png)

## IoT Plug and Play related issues

For any issues or errors that are flagged due to IoT Plug and Play requirements, please visit our documentation regarding the [progam](https://docs.microsoft.com/en-us/azure/iot-pnp/).

For help regarding the model repository, refer to our [guide](https://docs.microsoft.com/azure/iot-pnp/concepts-model-repository).

## Error: "Failed to get Digital Twin Model ID of device due to DeviceNotConnected"

This error may be flagged if you are attempting to re-do AICS testing with your device, and your device data was not stored from the previous attempt.

1. Reboot your device
1. Re-start the device provisioning process. You can view additional guidance about this process in our [tutorial](tutorial-03-testing-your-device.md).

<!-- 5. Next steps
Required. Provide at least one next step and no more than three. Include some 
context so the customer can determine why they would click the link.
-->

## Next steps
<!-- Add a context sentence for the following links -->
- [Write how-to guides](contribute-how-to-write-howto.md)
- [Links](links-how-to.md)
