---
title: Azure Certified Device program | Microsoft Docs
description: Understand the Azure Certified Device program.
author: koichih
ms.author: koichih
ms.date: 09/25/2020
ms.topic: conceptual
ms.custom: mvc
ms.service: iot-pnp
services: iot-pnp
---

# What is the Azure Certified Device program?

The Azure Certified Device program ensures customer solutions work seamlessly with your Azure services. The program uses tools, services, and a marketplace to share industry knowledge and best practices with a community of device and solution builders.

This program is designed to:

- **Give customers confidence:** Customers can confidently purchase devices that are certified by Microsoft for use with Azure services.

- **Help customers to find the right devices for their solution:** Device builders can publish the unique capabilities of their devices as part of the certification process. Customers can easily find the products that fit their needs.

- **Promote certified devices:** Device builders get increased visibility, contact with customers, and usage of the Azure Certified Device brand.

This article describes how to:

- Onboard your company to the Azure Certified Device program.
- Determine which certification is applicable for your device.
- Find program requirements and other resources to get you started with testing.
- Use the Azure Certified Device portal to validate your device.

## Onboarding

To certify your devices on the [Azure Certified Device portal](https://aka.ms/acdp), you must complete the following steps:

1. Ensure your company has an Azure Active Directory account using a work or school tenant.
2. Join the [Microsoft Partner Network (MPN)](https://partner.microsoft.com/) using your account.
3. Sign in to the [Azure Certified Device portal](https://aka.ms/acdp) after you've joined the MPN.
4. Review and sign the [program agreement](https://aka.ms/acdagreement) on the company profile page

### Company profile

To manage your company's profile in the Azure Certified Device portal, select **Company profile**. The company profile includes the company URL, email address, and logo. Accept the program agreement on this page before you continue with any certification operations.

The device description page in the Azure Certified Device catalog uses the company profile information.

## Choose the certification

There are three different certifications, each focused on delivering a different customer value. Depending on the type of device you're building and your target audience, you can choose the certification or certifications that are most applicable:

### Azure Certified Device

_Azure Certified Device certification_ validates that a device can connect with Azure IoT Hub and securely provision through the Device Provisioning Service (DPS). This certification reflects a device's functionality and interoperability that's a necessary baseline for more advanced certifications.

- To learn more, see the [certification requirements](https://aka.ms/acdrequirements).
- To learn more about using DPS to connect your device to Azure IoT Hub, see the [provisioning devices overview](../iot-dps/about-iot-dps.md).

### IoT Plug and Play

_IoT Plug and Play certification_, an incremental certification to the Azure Certified Device certification, simplifies the process of building devices without custom device code. IoT Plug and Play enables hardware partners to build devices that easily integrate with cloud solutions based on Azure IoT Central and third-party solutions.

- To learn more, see the [certification requirements](https://aka.ms/acdiotpnprequirements).
- To learn more about how to prepare a device for IoT Plug and Play testing, see [How To certify IoT Plug and Play devices](howto-certify-device.md).

### Edge managed

_Edge Managed certification_, an incremental certification to the Azure Certified Device certification, focuses on device management standards for Azure IoT devices running Windows, Linux, or RTOS. Currently, this program certification focuses on Edge runtime compatibility for module deployment and management.

> [!TIP]
> This program was previously known as the _IoT Edge certification program_.

- To learn more, see the [certification requirements](https://aka.ms/acdedgemanagedrequirements).
- To learn more about IoT Edge, see [IoT Edge overview](../iot-edge/about-iot-edge.md).
- To learn more about supported operating systems and containers, see [IoT Edge supported systems](../iot-edge/support.md).

## Use the Azure Certified Device portal

This section summarizes how to use the [Azure Certified Device portal](https://certify.azure.com). To learn more, see the [Getting started with the portal guide](https://aka.ms/acdhelp).

To certify a device in the Azure Certified Device program, complete the following four steps:

1. Provide the device details
2. Test the device
3. Submit and complete the review
4. Publish to the Azure Certified Device catalog (optional)

### Provide device details

For each device you want to certify, use the forms in the certification portal to record details about the device hardware, setup instructions, and marketing material:

- **Device information:** Collects information about the device such as its name, description, hardware details, and operating system.
- **Get started guide**: A PDF document that a customer can use to quickly use your product. [Sample templates](https://aka.ms/GSTemplate) are available.
- **Marketing details:** Provide customer-ready marketing information for your device, such as a picture and distributor information.
- **Additional industry certifications:** An optional section that lets you provide information about any other certifications the device has.

### Test the device

This phase interacts with your device and runs a series of tests after device uses DPS to connect to IoT Hub. On completion, you can view a set of log files with your device test results.

The certification portal has instructions about how to connect to the IoT Hub instance used for testing. You can establish the DPS connection through any of the [supported attestation methods](https://aka.ms/acdAttestation).

The Azure Certified Device team may contact the device builder for further manual validation of the device.

### Submit and publish

The final required stage is to submit the project for review. This step notifies an Azure Certified Device team member to review your project for completeness, including the device and marketing details, and the get started guide. A team member may contact you at the company email address previously provided with questions or edit requests before approval.

If your device requires further manual validation as part of certification, you'll receive a notice at this time.

When a device is certified, you can choose to publish your product details to the Azure Certified Device Catalog using the **Publish to catalog** feature in the product summary page.

## If you have questions

Contact the team at [iotcert@microsoft.com](mailto:iotcert@microsoft.com?subject=Azure%20Certified%20Device%20question) if you have any questions about the certification programs, the certification portal, or the Azure Certified Device Catalog.

## Next steps

Now that you have an overview of the Azure Certified Device program, a suggested next step is to learn [How to certify IoT Plug and Play devices](howto-certify-device.md).
