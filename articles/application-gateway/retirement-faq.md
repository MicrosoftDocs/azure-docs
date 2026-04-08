---
title: FAQ on V1 retirement
titleSuffix: Azure Application Gateway
description: Get answers to frequently asked questions about the retirement of Application Gateway V1 and migration to V2.
services: application-gateway
author: mbender-ms
ms.service: azure-application-gateway
ms.topic: faq
ms.date: 03/04/2026
ms.author: mbender
# Customer intent: "As an existing Application Gateway V1 customer, I want to understand the migration process to V2 and its timeline so that I can keep my services operational and avoid disruptions before the retirement of V1 on April 28, 2026."
---
# Frequently asked questions about Application Gateway V1 retirement

On April 28, 2023, Microsoft announced that Azure Application Gateway V1 is retiring on *April 28, 2026*. If you're still using V1 resources, be sure to plan and complete your migration to V2 before this date to avoid service disruptions.

This article answers commonly asked questions about the V1 retirement timeline, what to expect after retirement, and how to migrate from V1 to V2. For migration guidance, see [Migrate Azure Application Gateway and Web Application Firewall from V1 to V2](./migrate-v1-v2.md).

## Common questions about V1 retirement

### When can I no longer create Application Gateway V1 resources?

As of July 1, 2023, new customers can't create Application Gateway V1 resources. As of September 1, 2024, existing customers can't create V1 resources in existing subscriptions.

Although you can no longer create V1 resources, you can manage any existing V1 resources until the retirement date of April 28, 2026.

### What happens to existing Application Gateway V1 resources after April 28, 2026?

After April 28, 2026, Microsoft will no longer support Application Gateway V1 resources. There's no service-level agreement (SLA) for customers who use this version. As Microsoft begins decommissioning the hardware that supports V1, traffic passing through V1 resources can't be guaranteed.

### How does this migration plan affect my existing workloads that run on Application Gateway V1?

Until April 28, 2026, Microsoft supports existing Application Gateway V1 deployments. After April 28, 2026, Microsoft will no longer provide patches, support, or SLA coverage for active V1 resources. Workloads running on V1 will face service disruption as Microsoft blocks the data path and deletes the resources.

### What happens to my V1 application gateways if I don't plan to migrate soon?

On April 28, 2026, Microsoft will fully retire the V1 gateways. All active Application Gateway V1 resources will stop receiving patches, support, or SLA coverage and face service disruptions. To prevent business impact, start planning your migration now and complete it before April 28, 2026.

### Does the retirement of Basic-tier public IPs on September 30, 2025, affect my existing V1 Application Gateways?

Although Microsoft retired Basic-tier public IPs on September 30, 2025, it won't retire Basic-tier IP resources linked to Application Gateway V1 deployments until V1 retires on April 28, 2026. Microsoft will handle this retirement, and you don't need to take any action.

## Common questions about migration from V1 to V2

### How do I migrate my application gateway V1 to V2?

If you have an Application Gateway V1 deployment, you can migrate from V1 to V2 in two stages:

- **Stage 1: Migrate the configuration**. For detailed instructions, see the [migration guide](./migrate-v1-v2.md#configuration-migration).
- **Stage 2: Migrate the client traffic**. Migration of client traffic varies depending on your environment. See [Public IP retention script](./migrate-v1-v2.md#public-ip-retention-script) and [Traffic migration recommendations](./migrate-v1-v2.md#traffic-migration-recommendations).

### Can Microsoft migrate my data for me?

No, Microsoft can't migrate your data for you. You must migrate your data by using the self-serve options.

Application Gateway V1 is built on legacy components, and Azure deploys gateways in many ways. That's why your involvement is required for migration. By handling the migration yourself, you can plan the work during a maintenance window and help ensure minimal downtime for your applications.

### How long does migration take?

The time required for migration depends on the complexity of your deployment. Plan for the migration to take up to a couple of months.

### Are there any limitations with the Azure PowerShell script to migrate the configuration from V1 to V2?

Yes. See [Caveats and limitations](./migrate-v1-v2.md#caveats-and-limitations).

### Does Application Gateway V2 support NTLM or Kerberos authentication?

Yes. Application Gateway V2 supports proxying requests with NTLM or Kerberos authentication. For more information, see [Dedicated backend connection](configuration-http-settings.md#dedicated-backend-connection).

### How are backend certificate behaviors different between Application Gateway V1 and V2?

Application Gateway V1 uses authentication certificates. This mechanism performs an exact match between the certificate configured on Application Gateway and the certificate from the backend server. V1 also supports default or fallback certificates if no Server Name Indication (SNI) is available during the TLS handshake.

By default, Application Gateway V2 performs a more comprehensive validation. It verifies the complete certificate chain and the subject name of the backend server certificate. For more information, see [Backend TLS connection](ssl-overview.md#backend-tls-connection-application-gateway-to-the-backend-server).

### How should I manage the migration with the differences in behavior of backend certificate validations between V1 and V2?

When you migrate from V1 to V2, you might need to adjust your configuration because of the differences in certificate validation behavior. Use the [backend HTTPS validation controls](configuration-http-settings.md#backend-https-validation-settings) available in V2 to temporarily disable validation during migration.

Disable validation only as a temporary measure to facilitate migration. For production environments, re-enable full validation to maintain security.

### Do this article and the Azure PowerShell script also apply to Azure Web Application Firewall?

Yes.

### Does the Azure PowerShell script switch over the traffic from my V1 gateway to the newly created V2 gateway?

No, the Azure PowerShell script only migrates the configuration. You're responsible for, and in control of, actual traffic migration.

You can use the [public IP retention script](./migrate-v1-v2.md#public-ip-retention-script) to retain the public IP from V1 in V2. This operation has a downtime of one to five minutes.

### Is the new V2 gateway that the Azure PowerShell script creates sized appropriately to handle the traffic on my V1 gateway?

The Azure PowerShell script creates a new V2 gateway with an appropriate size to handle the traffic on your existing V1 gateway. Autoscaling is disabled by default, but you can enable autoscaling when you run the script.

### Can I create a V2 gateway in the same subnet as an existing V1 gateway?

No, V1 and V2 gateways can't coexist in the same subnet. Each gateway type requires its own dedicated subnet within the virtual network. If you plan to migrate from V1 to V2, you must create a new subnet for the V2 gateway and ensure that you allocate sufficient IP address space.

### I configured my V1 gateway to send logs to Azure Storage. Does the script replicate this configuration for V2?

No, the script doesn't replicate this configuration for V2. You must add the log configuration separately to the migrated V2 gateway.

### Does the script support certificates uploaded to Azure Key Vault?

Yes, you can download the certificate from Azure Key Vault and provide it as input to the migration script. The [enhanced cloning script](./migrate-v1-v2.md#enhanced-cloning-script-recommended) automatically copies all the TLS/SSL certificates from V1 to the newly created V2 gateway.

### I ran into some problems with the migration. How can I get help?

Post problems and questions about migration to [Microsoft Q&A for Application Gateway](https://aka.ms/ApplicationGatewayQA), with the keyword `V1Migration`.

If you have a support contract, you can also open a [support ticket](https://portal.azure.com/#view/Microsoft_Azure_Support/NewSupportRequestV3Blade). For more information about Azure support, see [Azure support options](https://azure.microsoft.com/support/options/).
