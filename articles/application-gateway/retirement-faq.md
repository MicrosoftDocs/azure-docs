---
title: FAQ on V1 retirement 
titleSuffix: Azure Application Gateway
description: This article lists out commonly added questions on  retirement of Application gateway V1 SKUs and Migration
services: application-gateway
author: mbender-ms
ms.service: azure-application-gateway
ms.topic: how-to
ms.date: 07/31/2025
ms.author: mbender
# Customer intent: "As an existing Application Gateway V1 customer, I want to understand the migration process to V2 and its timeline, so that I can ensure my services remain operational and avoid disruptions before the retirement of V1 on April 28, 2026."
---
# FAQs
On April 28,2023 we announced retirement of Application gateway V1 on 28 April 2026. This article lists  the commonly asked questions on V1 retirement and V1-V2 migration.

## Common questions on V1 retirement

### What is the official date Application Gateway V1 is cut off from creation?

New Customers won't be allowed to create V1 from 1 July 2023 onwards. However, any existing V1 customers can continue to create resources in existing subscriptions until 1 September 2024 and manage V1 resources until the retirement date of 28 April 2026.

### What happens to existing Application Gateway V1 after 28 April 2026?

After April 28th 2026, V1 SKU will no longer be supported, and no SLA will be provided for customers using this SKU of Application Gateway. Traffic passing through V1 SKUs after retirement can't be guaranteed as our teams begin the process of cleaning up and decommissioning the hardware that supported V1 SKUs of Application Gateway. 

### Does this migration plan affect any of my existing workloads that run on Application Gateway V1 SKU?

Until April 28, 2026, existing Application Gateway V1 deployments are supported. After April 28, 2026, any V1 SKU resources that are still active will no longer receive  patches, support, or SLA coverage. Workloads running on V1 will face service disruption, as we'll begin blocking the data path and subsequently deleting the resources. 

### What happens to my V1 application gateways if I don’t plan on migrating soon?

On April 28, 2026, the V1 gateways are fully retired and all active AppGateway V1s will no longer receive  patches, support, or SLA coverage and will face service disruptions. To prevent business impact, we highly recommend starting to plan your migration at the earliest and complete it before April 28, 2026.

### Does the retirement of Basic SKU Public IPs in September 2025 affect my existing V1 Application Gateways?

While the Basic SKU Public IPs are scheduled for retirement by September 2025, the Basic IP resources linked to Application Gateway V1 deployments wo'nt be impacted until the retirement of V1 Application Gateways. This will be handled by Microsoft and needs no customer intervention.

### How do I migrate my application gateway V1 to V2 SKU?

If you have an Application Gateway V1, [Migration from v1 to v2](./migrate-v1-v2.md) can be currently done in two stages:
- Stage 1: Migrate the configuration - Detailed instruction for Migrating the configuration can be found [here](./migrate-v1-v2.md#configuration-migration).
- Stage 2: Migrate the client traffic -Client traffic migration varies depending on your specific environment. We now have a [PowerShell script to retain the Public IP from V1 in V2](./migrate-v1-v2.md#public-ip-retention-script). High level guidelines on traffic migration are provided [here](./migrate-v1-v2.md#traffic-migration-recommendations).

### Can Microsoft migrate this data for me?

No, Microsoft can't migrate a user's data on their behalf. Users must do the migration themselves by using the self-serve options provided.
Application Gateway V1 is built on legacy components and the gateways are deployed in many different ways in their architecture. Therefore, customer involvement is required for migration. This also allows users to plan the migration during a maintenance window. This can help to ensure that the migration is successful with minimal downtime for the user's applications.

### What is the time required for migration?

Planning and execution of migration greatly depends on the complexity of the deployment and could take couple of months.

### How do I report an issue?

Post your issues and questions about migration to our [Microsoft Q&A](https://aka.ms/ApplicationGatewayQA) for AppGateway, with the keyword `V1Migration`. We recommend posting all your questions on this forum. If you have a support contract, you're welcome to log a [support ticket](https://portal.azure.com/#view/Microsoft_Azure_Support/NewSupportRequestV3Blade) as well.

## FAQ on V1 to V2 migration

### Are there any limitations with the Azure PowerShell script to migrate the configuration from v1 to v2?

Yes, see [Caveats/Limitations](./migrate-v1-v2.md#caveatslimitations).

### Does Application Gateway V2 support NTLM or Kerberos authentication?

Yes. Application Gateway v2 now supports proxying requests with NTLM or Kerberos authentication. For more information, see [Dedicated backend connection](configuration-http-settings.md#dedicated-backend-connection).

### How are backend certificate behaviors different between Application Gateway V1 and V2 SKUs? How should I manage the migration with the differences in behavior of backend certificate validations between V1 and V2 SKUs?

Certificate Validation Behavior in Application Gateway

V1 SKU - Application Gateway V1 uses authentication certificates. This mechanism performs an exact match between the certificate configured on Application Gateway and the certificate presented by the backend server. Further, V1 supports the use of default or fallback certificates if no Server Name Indication (SNI) is available during the TLS handshake.

V2 SKU - By default, Application Gateway V2 performs a more comprehensive validation. It verifies the complete certificate chain as well as the Subject Name of the backend server certificate.[Learn more](ssl-overview.md#backend-tls-connection-application-gateway-to-the-backend-server)

Migration Considerations

When migrating from V1 to V2, these differences in certificate validation behavior may require adjustments. Use the [Backend HTTPS validation controls](configuration-http-settings.md#backend-https-validation-settings) available with the V2 SKU to temporarily disable validation if needed during migration. Disabling validation should only be used as a temporary measure to facilitate migration. For production environments, it is strongly recommended to re-enable full validation to maintain security.
        
### Is this article and the Azure PowerShell script applicable for Application Gateway WAF product as well?

Yes.

### Does the Azure PowerShell script also switch over the traffic from my v1 gateway to the newly created v2 gateway?

No, the Azure PowerShell script only migrates the configuration. Actual traffic migration is your responsibility and under your control. You can use the [public IP retention script](./migrate-v1-v2.md#public-ip-retention-script) to retain the Public IP from V1 in V2. This operation has a downtime of 1-5 minutes. 

### Is the new v2 gateway created by the Azure PowerShell script sized appropriately to handle all of the traffic that is served by my v1 gateway?

The Azure PowerShell script creates a new v2 gateway with an appropriate size to handle the traffic on your existing v1 gateway. Autoscaling is disabled by default, but you can enable autoscaling when you run the script.

### Can I create an Application Gateway V2 in the same subnet as an existing V1 gateway?

No, V1 and V2 gateways can't coexist in the same subnet. Each gateway type requires its own dedicated subnet within the virtual network. If you plan to migrate from V1 to V2, you must create a new subnet for the V2 gateway and ensure sufficient IP address space is allocated.

### I configured my v1 gateway  to send logs to Azure storage. Does the script replicate this configuration for v2 as well?

No, the script doesn't replicate this configuration for v2. You must add the log configuration separately to the migrated v2 gateway.

### Does this script support certificate uploaded to Azure Key Vault?

Yes, you can download the certificate from Keyvault and provide it as input to the migration script. The [enhanced cloning script](./migrate-v1-v2.md#1-enhanced-cloning-script) automatically copies all the SSL certs from V1 to the newly created V2.

### I ran into some issues with using this script. How can I get help?

You can contact Azure Support under the topic "Configuration and Setup/Migrate to V2 SKU." Learn more about [Azure support here](https://azure.microsoft.com/support/options/).
