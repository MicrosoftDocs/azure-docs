---
title: Application Gateway Confidential Compute architecture
description: Understand the architecture, security model, and data flow of Application Gateway Confidential Compute and how it protects sensitive data while it is being processed by the gateway.
services: application-gateway
author: jaesoni
ms.service: azure-application-gateway
ms.topic: concept-article
ms.date: 10/16/2026
ms.author: jaysoni
ms.custom: references_regions
#customer intent: As a security architect, I want to understand how Confidential Compute protects data in transit and in-use within Application Gateway, so that I can design secure architectures that meet compliance requirements and protect against insider threats.
---

# Application Gateway Confidential Compute overview (Preview)

Application Gateway Confidential Compute is a security enhancement for Azure Application Gateway that protects your sensitive data while the gateway processes it. By running the Application Gateway data plane on confidential computing infrastructure, your unencrypted traffic stays protected in memory during inspection, routing, and Web Application Firewall (WAF) processing.

> [!NOTE]
> Application Gateway Confidential Compute is currently in preview. This preview version is provided without a service-level agreement. Certain features might not be supported or might have constrained capabilities. For more information, see [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).

## Architecture

Application Gateway Confidential Compute runs the application gateway data plane on confidential computing infrastructure to help protect sensitive data while it processes. Hardware-based security capabilities provide an isolated execution environment for the Application Gateways, helping protect sensitive data while it processes.

Application Gateway on Confidential Compute is a managed offering that uses Trusted Execution Environments (TEE) to protect data.

- **Hardware-based memory protection**: The hardware-based encryption protects the memory used by the Application Gateway data plane.
- **Hardware-enforced isolation**: The confidential computing environment creates a hardware-enforced security boundary that isolates the workload from other virtual machines, the hypervisor, and host management code.
- **Data-in-use protection**: Sensitive data stays protected while Application Gateway processes application traffic, including during TLS termination, WAF inspection, and routing-policy evaluation.

## Comparison between Application Gateway types

| Feature |	Application Gateway	| Application Gateway - Confidential Compute|
|--------|-------------------|---------------------------|
| Memory protection	| Standard platform protections	| Hardware-based memory encryption |
| Isolation from the virtualization infrastructure | Standard platform isolation |	Hardware-enforced isolation from the hypervisor, host management code, and other virtual machines|
| Data in use |	Processed in the standard Application Gateway environment	| Protected by confidential computing hardware while being processed|

> [!NOTE]
> Confidential Compute doesn't protect against vulnerabilities in the application code itself or against compromised backend servers.


## When to use Application Gateway Confidential Compute

Consider using Application Gateway Confidential Compute when your applications require extra protection for sensitive data while it processes at the application delivery layer. Application Gateway Confidential Compute is especially suited for scenarios with confidential backends, like Confidential VMs, and you want to extend data-in-use protection to their application delivery layer.

Use Application Gateway Confidential Compute when you:

* Process highly sensitive data, such as financial transactions, protected health information, personal data, intellectual property, or trade secrets.
* Have strict security, privacy, or compliance requirements that require stronger isolation and protection of data while it processes.
* Want a more comprehensive confidential computing architecture by protecting sensitive workloads and the application delivery layer by using hardware-based confidential computing technologies.
* Require defense in depth for critical workloads by reducing exposure of application data to the underlying infrastructure and privileged software.

## Feature capabilities

Confidential Application Gateway provides the same Application Gateway capabilities while adding protection for data in use.

* **Traffic processing and routing**: TLS termination, Web Application Firewall (WAF) inspection, and request routing continue to work transparently while application traffic processes within the confidential environment.
* **Backend support**: Use the same supported backend types as a standard Application Gateway deployment.
* **Connectivity and protocol support**: Use Private Link for private connectivity and TCP/TLS proxy for non-HTTP workloads and centralized TLS termination.
* **Observability**: Continue to use Azure Monitor for Application Gateway monitoring and diagnostic logs, including Access, Firewall, and Activity logs.



## Certificate key and protection

Application Gateway supports integration with Azure Key Vault for TLS certificate and key management. By using Confidential Compute, the confidential computing environment protects sensitive data used during TLS processing. The level and location of private key protection depend on the Key Vault integration used.

### Integration with Azure Key Vault Standard and Premium tiers

When your application gateway retrieves a TLS certificate from Azure Key Vault, the gateway uses the certificate and its private key for TLS termination. When you enable Confidential Compute, the private key and application data that the gateway processes are protected within the confidential computing environment.

**Data flow:**

* Application Gateway Confidential Compute retrieves the TLS certificate PFX from Key Vault.
* Uses the stored PFX to perform TLS processing.
* Decrypted application data is processed within the confidential computing environment.

**Protection:** Confidential Compute on the gateway protects the private key and sensitive application data while they're in use within the Application Gateway compute environment.

### Integration with Azure Key Vault Managed HSM (Hardware Security Module)

For scenarios that require the TLS private key to remain outside the Application Gateway compute environment, Managed HSM provides hardware-backed protection for the private key.

**Data flow:**

* The private key remains protected by the HSM.
* The HSM handles private key cryptographic operations.
* Application Gateway performs TLS processing.  
* Decrypted application data is processed within the confidential computing environment.

**Protection:** Managed HSM protects the TLS private key, while Application Gateway Confidential Compute protects sensitive application data during gateway processing.

## Configurations

* **SKUs**: The Standard_v2 and WAF_v2 SKUs support the Confidential Compute add-on.
* **Deployment type**: You must enable Confidential Compute when you create the Application Gateway. You can't enable Confidential Compute on an existing gateway.
* **Regions**: Available in selected Azure regions that support the required Confidential VM SKUs.

### Deployment guide

* Portal - When you create a new application gateway, select the **Confidential Compute** checkbox.
* Other methods - Set the Boolean property `enableConfidentialCompute` to `true`.

#### REST API

```json
"enableConfidentialCompute": true
```

> [!Tip]
> Use 2026-05-01 or later for Application Gateway Confidential Compute.

## Regions

The confidential Application Gateway is available in the following regions:

* Australia East
* Canada Central
* Central India
* Central US
* East US
* East US 2
* France Central
* Germany West Central
* Japan East
* North Central US
* South Central US
* Southeast Asia
* Sweden Central
* UAE North
* UK South
* West US
* West US 2
* West US 3

> [!Tip]
> If you require Confidential Compute support in an Azure region that isn't currently supported, contact Azure Support to discuss your regional requirements.

## Pricing

Application Gateway Confidential Compute is billed as an hourly add-on to the Standard_v2 and WAF_v2 SKUs. When you enable Confidential Compute, your Application Gateway charges include:

* Fixed charge: The standard fixed hourly charge for the Standard_v2 or WAF_v2 SKU.
* Capacity unit charge: Usage-based charges determined by the capacity units consumed by the gateway while processing traffic.
* Confidential Compute charge: An additional hourly charge for the Confidential Compute add-on.

See Application Gateway [pricing](https://azure.microsoft.com/pricing/details/application-gateway) for regional rates.






