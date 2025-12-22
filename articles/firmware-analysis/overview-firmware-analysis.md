---
title: Firmware analysis overview
description: Learn how firmware analysis helps device builders and operators to evaluate the security of IoT, OT and network devices.
ms.topic: conceptual
ms.date: 09/12/2025
author: karengu0
ms.author: karenguo
ms.service: azure
#Customer intent: As a device builder, I want to understand how firmware analysis can help secure my IoT/OT devices and products.
---

# What is firmware analysis?

Just like computers have operating systems, IoT devices have firmware, and it's the firmware that runs and controls IoT devices. For IoT device builders, security is a near-universal concern as IoT devices have traditionally lacked basic security measures.

For example, IoT attack vectors typically use easily exploitable--but easily correctable--weaknesses such as hardcoded user accounts, outdated and vulnerable open-source packages, or a manufacturer's private cryptographic signing key. 

Use the firmware analysis service to identify embedded security threats, vulnerabilities, and common weaknesses that may be otherwise undetectable.

> [!NOTE]
> The firmware analysis service is made available to customers under the terms governing their subscription to Microsoft Azure Services (including the [Service Specific Terms](https://aka.ms/MCAServiceSpecificTerms)). Please review these terms carefully as they contain important conditions and obligations governing your use of firmware analysis. Learn more about the legal terms that apply to this service [here](https://azure.microsoft.com/support/legal/).

## How to be sure your firmware is secure

Firmware analysis can analyze your firmware for common weaknesses and vulnerabilities, and provide insight into your firmware security. This analysis is useful whether you build the firmware in-house or receive firmware from your supply chain.

- **Software bill of materials (SBOM)**: Receive a detailed listing of open-source packages used during the firmware's build process. See the package version and what license governs the use of the open-source package.

- **CVE analysis**: See which firmware components have publicly known security vulnerabilities and exposures.

- **Binary hardening analysis**: Identify binaries that haven't enabled specific security flags during compilation like buffer overflow protection, position independent executables, and more common hardening techniques.

- **SSL certificate analysis**: Reveal expired and revoked TLS/SSL certificates.

- **Public and private key analysis**: Verify that the public and private cryptographic keys discovered in the firmware are necessary and not accidental.

- **Password hash extraction**: Ensure that user account password hashes use secure cryptographic algorithms.  

:::image type="content" source="media/tutorial-firmware-analysis/overview.png" alt-text="Screenshot that shows the overview page of the analysis results.":::
 
## Next steps

- [Analyze a firmware image](./tutorial-analyze-firmware.md)
- [Understand Role-Based Access Control for Firmware Images](./firmware-analysis-rbac.md)
- [Frequently asked questions about firmware analysis](./firmware-analysis-faq.md)
