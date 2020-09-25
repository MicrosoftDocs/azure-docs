---
title: Azure Certified Device program | Microsoft Docs
description: As a device builder, understand the concept of the Azure Certified Device program.
author: koichih
ms.author: koichih
ms.date: 09/25/2020
ms.topic: conceptual
ms.custom: mvc
ms.service: iot-pnp
services: iot-pnp
manager: peterpr
---

# Getting Started with the Azure Certified Device program #

The Azure Certified Device program ensures customer solutions work great on Azure. It is a program that utilizes tools, services, and a marketplace to share industry knowledge and best practices with our community of builders within the IoT ecosystem that is great for builders and customers alike.

The three tenets of this program are:

- **Giving customers confidence:** Customers can confidently purchase Azure certified devices that carry the Microsoft promise.

- **Matchmaking customers with the right devices for them:** Device builders can set themselves apart with certification that highlights their unique capabilities, and customers can easily find the products that fit their needs.

- **Promoting certified devices:** Device builders get increased visibility, contact with customers, and usage of Microsoft’s Azure Certified Device brand.
 
This article shows you how to:

1. Onboard your company to the Azure Certified Device program
2. Determine which certification is applicable for your device
3. Find program requirements and other resources to get you started with testing
4. Use the Azure Certified Device portal to validate the device

## Onboarding to the program ##
### Onboarding ###

To certify your devices on the [Azure Certified Device portal](https://aka.ms/acdp), you must complete the following steps:

1. Ensure your company has an Azure Active Directory account using a work or school tenant.
2. Join the [Microsoft Partner Network](https://partner.microsoft.com/) (MPN) using your account.
3. Sign in to the Azure Certified Device portal once you have joined the MPN.
4. Review and sign the [program agreement](https://aka.ms/acdagreement) on the Company profile page

### Company profile ###
You can manage your company’s profile from the left-navigation menu item labeled “Company profile.” The company profile includes the company URL, email address, and logo. The program agreement must be accepted on this page before you proceed with any certification operations.

The company profile information will be used in the device description page showcased in the Azure Certified Device Catalog.

## Determining which Certification is applicable for your device ##
There are three different certifications, each focused on delivering a different customer value. Depending on the type of device you are building and your target audience, you can choose which certification (or certifications) is most applicable:

### Azure Certified Device  ###
Azure Certified Device certification validates that a device can connect with Azure IoT Hub and securely provision through the Device Provisioning Service (DPS). This certification reflects a device's functionality and interoperability that is a necessary baseline for more advanced certifications.

- For additional information, view the [certification requirements](https://aka.ms/acdrequirements).
- For information on connecting your device to Azure IoT Hub with Device Provisioning Service (DPS) – a requirement for all devices being certified – visit [provisioning devices overview](https://docs.microsoft.com/en-us/azure/iot-dps/about-iot-dps).

### IoT Plug and Play ###
IoT Plug and Play certification, an incremental certification beyond the baseline Azure Certified Device certification, simplifies the process of building devices without custom device code. It enables a seamless device-to-cloud integration experience and enables hardware partners to build devices that can easily integrate with cloud solutions based on Azure IoT Central as well as third-party solutions.

- For additional information, view the [certification requirements](https://aka.ms/acdiotpnprequirements).
- For information on how to prepare a device for IoT Plug and Play testing, visit [How To certify IoT Plug and Play devices](https://docs.microsoft.com/en-us/azure/iot-pnp/howto-certify-device).

### Edge Managed ###
Edge Managed certification, an incremental certification beyond the baseline Azure Certified Device certification, focuses on device management standards for Azure connected devices for IoT devices running Windows, Linux, or RTOS. Today, this program certification focuses on Edge runtime compatibility for module deployment and management though will continue to grow in the future with additional customer manageability needs. (Previously, this program was identified as the IoT Edge certification program.)

- For additional information, view the [certification requirements](https://aka.ms/acdedgemanagedrequirements).
- For information on IoT Edge, visit [IoT Edge overview](https://docs.microsoft.com/en-us/azure/iot-edge/about-iot-edge).
- For information on supported operating systems and containers, visit [IoT Edge supported systems](https://docs.microsoft.com/en-us/azure/iot-edge/support). 

## Using the Azure Certified Device portal ##
The Azure Certified Device portal can be accessed at [Azure Certified Device portal](https://certify.azure.com). For a more complete overview on using the Azure Certified Device portal, please refer to the [Getting started with the portal guide](https://aka.ms/acdhelp).

As a summary, certifying a device in our Azure Certified Device program consists of four activities, which are:

1. Providing device details
2. Testing the device
3. Submitting and completing the review
4. Publishing to the Azure Certified Device Catalog (optional)

### Providing device details ###

For each device you want to certify, the certification portal provides forms to collect various properties about the device hardware, setup instructions, and marketing material:

- **Device information:** Collects information about the device such as its name, description, hardware details, and operating system.
- Get started guide: A PDF document that can be used by the customer to quickly use your product. Templates are provided [here](https://aka.ms/GSTemplate).
- **Marketing details:** Provide customer-ready marketing information for your device, such as a photo and distributor information.
- **Additional industry certifications:** Optional section lets you provide additional information about any other certifications the device may have received.

### Testing the device ###
This phase interacts and runs a series of tests with your device that has been connected to IoT Hub using the Device Provisioning Service (DPS). Upon completion, you will be able to view a set of log files with your test results.

Instructions on connecting to the IoT Hub instance used for testing are provided in the portal. The DPS connection can be established through any of the [supported attestation methods](https://aka.ms/acdAttestation).

Depending on the type of device being certified and the certification program selected, the device builder may be contacted by the Azure Certified Device team for further manual validation of the device.

### Submitting and publishing ###

The final required stage to complete certification is to Submit the project for review. This will notify an Azure Certified Device team member to review your project for completeness, including the device and marketing details and the Get started guide. A team member may reach out to you at the company email address previously provided with questions or edit requests prior to approval.

If further manual validation is required on your device as part of certification, you may receive notice at this time.

Once a device has been certified, you may optionally choose to publish your product details to the Azure Certified Device Catalog via the Publish feature within your project details page.

## If you have questions ##

Please contact the team at [iotcert@microsoft.com](mailto:iotcert@microsoft.com?subject=Azure%20Certified%20Device%20question) if you have any questions about our certification programs, our certification portal, or our Azure Certified Device Catalog.
