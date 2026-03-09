---
title: FAQ on V1 retirement
titleSuffix: Azure Application Gateway
description: Get answers to frequently asked questions about the retirement of Application Gateway V1 SKUs and migration to V2.
services: application-gateway
author: mbender-ms
ms.service: azure-application-gateway
ms.topic: conceptual
ms.date: 03/04/2026
ms.author: mbender
# Customer intent: "As an existing Application Gateway V1 customer, I want to understand the migration process to V2 and its timeline, so that I can ensure my services remain operational and avoid disruptions before the retirement of V1 on April 28, 2026."
---
# Frequently asked questions about Application Gateway V1 retirement

On April 28, 2023, Microsoft announced the retirement of Application Gateway V1 SKU, effective April 28, 2026. This article answers commonly asked questions about the V1 retirement timeline, what to expect after retirement, and how to migrate from V1 to V2.

> [!IMPORTANT]
> Application Gateway V1 retires on April 28, 2026. If you're still using V1 SKU resources, plan and complete your migration to V2 before this date to avoid service disruptions. For migration guidance, see [Migrate from V1 to V2](./migrate-v1-v2.md).

## Common questions on V1 retirement

### When can I no longer create Application Gateway V1 resources?

Starting July 1, 2023, new customers can't create Application Gateway V1 resources. However, existing customers can continue to create V1 resources in existing subscriptions until September 1, 2024. You can manage V1 resources until the retirement date on April 28, 2026.

### What happens to existing Application Gateway V1 resources after April 28, 2026?

After April 28, 2026, Microsoft no longer supports Application Gateway V1 resources. There's no SLA for customers using this version. As Microsoft begins decommissioning the hardware that supports V1, traffic passing through V1 resources can't be guaranteed. 

### How does this migration plan affect my existing workloads that run on Application Gateway V1?

Until April 28, 2026, Microsoft supports existing Application Gateway V1 deployments. After April 28, 2026, Microsoft no longer provides patches, support, or SLA coverage for active V1 resources. Workloads running on V1 face service disruption as Microsoft blocks the data path and deletes the resources. 

### What happens to my V1 application gateways if I don't plan to migrate soon?

On April 28, 2026, Microsoft fully retires the V1 gateways. All active Application Gateway V1 resources stop receiving patches, support, or SLA coverage and face service disruptions. To prevent business impact, start planning your migration now and complete it before April 28, 2026.

### Does the retirement of Basic SKU public IPs on September 30, 2025, affect my existing V1 Application Gateways?

Although Microsoft retires Basic SKU public IPs on September 30, 2025, it won't retire Basic IP resources linked to Application Gateway V1 deployments until V1 retires on April 28, 2026. Microsoft handles this retirement and you don't need to take any action.

### How do I migrate my application gateway V1 to V2 SKU?

If you have an Application Gateway V1, you can migrate from V1 to V2 in two stages:
- **Stage 1: Migrate the configuration** - For detailed instructions, see [Migrate configuration from V1 to V2](./migrate-v1-v2.md#configuration-migration).
- **Stage 2: Migrate the client traffic** - Client traffic migration varies depending on your environment. See [PowerShell script to retain the public IP from V1 in V2](./migrate-v1-v2.md#public-ip-retention-script) and [Guidelines on traffic migration](./migrate-v1-v2.md#traffic-migration-recommendations).

### Can Microsoft migrate this data for me?

No, Microsoft can't migrate your data for you. You must migrate your data by using the self-serve options provided.
Application Gateway V1 is built on legacy components, and Azure deploys gateways in many different ways. Therefore, your involvement is required for migration. By handling the migration yourself, you can plan the work during a maintenance window and help ensure minimal downtime for your applications.

### How long does migration take?

The time required for migration depends on the complexity of your deployment. Plan for the migration to take up to a couple of months.

### How do I report an issue?

Post issues and questions about migration to [Microsoft Q&A for Application Gateway](https://aka.ms/ApplicationGatewayQA), with the keyword `V1Migration`. If you have a support contract, you can also open a [support ticket](https://portal.azure.com/#view/Microsoft_Azure_Support/NewSupportRequestV3Blade).

## FAQ on V1 to V2 migration

### Are there any limitations with the Azure PowerShell script to migrate the configuration from V1 to V2?

Yes, see [Caveats/Limitations](./migrate-v1-v2.md#caveatslimitations).

### Does Application Gateway V2 support NTLM or Kerberos authentication?

Yes. Application Gateway V2 supports proxying requests with NTLM or Kerberos authentication. For more information, see [Dedicated backend connection](configuration-http-settings.md#dedicated-backend-connection).

### How are backend certificate behaviors different between Application Gateway V1 and V2 SKUs? How should I manage the migration with the differences in behavior of backend certificate validations between V1 and V2 SKUs?

**Certificate validation behavior in Application Gateway**

- **V1 SKU** - Application Gateway V1 uses authentication certificates. This mechanism performs an exact match between the certificate configured on Application Gateway and the certificate presented by the backend server. V1 also supports default or fallback certificates if no Server Name Indication (SNI) is available during the TLS handshake.
- **V2 SKU** - By default, Application Gateway V2 performs a more comprehensive validation. It verifies the complete certificate chain and the Subject Name of the backend server certificate. For more information, see [Backend TLS connection](ssl-overview.md#backend-tls-connection-application-gateway-to-the-backend-server).

**Migration considerations**

When you migrate from V1 to V2, you might need to adjust your configuration because of these differences in certificate validation behavior. Use the [Backend HTTPS validation controls](configuration-http-settings.md#backend-https-validation-settings) available with the V2 SKU to temporarily disable validation during migration. Disabling validation should only be used as a temporary measure to facilitate migration. For production environments, re-enable full validation to maintain security.
        
### Is this article and the Azure PowerShell script applicable for Application Gateway WAF product as well?

Yes.

### Does the Azure PowerShell script also switch over the traffic from my V1 gateway to the newly created V2 gateway?

No, the Azure PowerShell script only migrates the configuration. You're responsible for and in control of actual traffic migration. You can use the [public IP retention script](./migrate-v1-v2.md#public-ip-retention-script) to retain the public IP from V1 in V2. This operation has a downtime of 1-5 minutes.

### Is the new V2 gateway created by the Azure PowerShell script sized appropriately to handle the traffic served by my V1 gateway?

The Azure PowerShell script creates a new V2 gateway with an appropriate size to handle the traffic on your existing V1 gateway. Autoscaling is disabled by default, but you can enable autoscaling when you run the script.

### Can I create an Application Gateway V2 in the same subnet as an existing V1 gateway?

No, V1 and V2 gateways can't coexist in the same subnet. Each gateway type requires its own dedicated subnet within the virtual network. If you plan to migrate from V1 to V2, you must create a new subnet for the V2 gateway and ensure you allocate sufficient IP address space.

### I configured my V1 gateway to send logs to Azure storage. Does the script replicate this configuration for V2?

No, the script doesn't replicate this configuration for V2. You must add the log configuration separately to the migrated V2 gateway.

### Does this script support certificate uploaded to Azure Key Vault?

Yes, you can download the certificate from Key Vault and provide it as input to the migration script. The [enhanced cloning script](./migrate-v1-v2.md#enhanced-cloning-script---recommended) automatically copies all the TLS/SSL certificates from V1 to the newly created V2.

### I ran into some issues with using this script. How can I get help?

You can contact Azure Support under the topic "Configuration and Setup/Migrate to V2 SKU." To learn more, see [Azure support options](https://azure.microsoft.com/support/options/).
