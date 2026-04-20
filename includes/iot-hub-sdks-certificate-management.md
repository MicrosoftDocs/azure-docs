---
title: include file
description: include file
services: iot-dps
author: cwatson-cat
ms.service: azure-iot-hub
ms.topic: include
ms.date: 04/01/2026
ms.author: cwatson
ms.custom: Include file
ms.subservice: azure-iot-hub-dps
---

The following table lists the platform SDKs that currently support Microsoft-backed X.509 certificate management in preview.

| Language | Package | Source/Branch | Samples |
| ----- | ----- | ----- | ----- |
| .NET | [NuGet](https://www.nuget.org/packages/Microsoft.Azure.Devices.Client) | [Azure/azure-iot-sdk-csharp at feature/iot-csr-preview](https://github.com/Azure/azure-iot-sdk-csharp/tree/feature/iot-csr-preview) | [CertificateSigningRequestSample](https://github.com/Azure/azure-iot-sdk-csharp/tree/feature/iot-csr-preview/iothub/device/samples/how%20to%20guides/CertificateSigningRequestSample) |
| Python | [pip](https://pypi.org/project/azure-iot-device/) | [Azure/azure-iot-sdk-python at feature/iot-csr-preview](https://github.com/Azure/azure-iot-sdk-python/tree/feature/iot-csr-preview) | [cert-mgmt samples](https://github.com/Azure/azure-iot-sdk-python/tree/feature/iot-csr-preview/samples/cert-mgmt) |
| Node.js | [npm](https://www.npmjs.com/package/azure-iot-device) | Not available | Not available |
| Java | [Maven](https://mvnrepository.com/artifact/com.microsoft.azure.sdk.iot/iot-device-client) | [Azure/azure-iot-sdk-java at feature/csr](https://github.com/Azure/azure-iot-sdk-java/tree/feature/csr) | [certificate-signing-sample](https://github.com/Azure/azure-iot-sdk-java/tree/feature/csr/provisioning/provisioning-device-client-samples/certificate-signing-sample) |
| C | [packages](https://github.com/Azure/azure-iot-sdk-c/blob/main/readme.md#getting-the-sdk) | [Azure/azure-iot-sdk-c at feature/dps-csr-preview](https://github.com/Azure/azure-iot-sdk-c/tree/feature/dps-csr-preview) | [iothub_ll_client_sample_certificate_signing_request](https://github.com/Azure/azure-iot-sdk-c/tree/feature/dps-csr-preview/iothub_client/samples/iothub_ll_client_sample_certificate_signing_request) |
