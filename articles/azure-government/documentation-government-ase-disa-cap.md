---
title: ASE deployment with DISA CAP
description: This article explains the baseline App Service Environment configuration for customers who use DISA CAP to connect to Azure Government.
ms.service: azure-government
ms.custom: devx-track-arm-template
ms.topic: article
recommendations: false
ms.date: 06/27/2022
---

# App Service Environment reference for DoD customers connected to the DISA CAP

This article explains the baseline configuration of an App Service Environment (ASE) with an internal load balancer (ILB) for customers who use the Defense Information Systems Agency (DISA) Cloud Access Point (CAP) to connect to Azure Government.

## Environment configuration

### Assumptions

You've deployed an ASE with an ILB and have implemented an ExpressRoute connection to the DISA CAP.

### Route table

When you create the ASE via the Azure Government portal, a route table with a default route of 0.0.0.0/0 and next hop “Internet” is created. However, since DISA advertises a default route out of the ExpressRoute circuit, the User Defined Route (UDR) should either be deleted, or you should remove the default route to Internet.  

You'll need to create new routes in the UDR for the management addresses to keep the ASE healthy. For Azure Government ranges, see [App Service Environment management addresses](../app-service/environment/management-addresses.md).

- 23.97.29.209/32 -> Internet
- 13.72.53.37/32 -> Internet
- 13.72.180.105/32 -> Internet
- 52.181.183.11/32 -> Internet
- 52.227.80.100/32 -> Internet
- 52.182.93.40/32 -> Internet
- 52.244.79.34/32 -> Internet
- 52.238.74.16/32 -> Internet

Make sure the UDR is applied to the subnet your ASE is deployed to. 

### Network security group (NSG)

The ASE will be created with the following inbound and outbound security rules. The inbound security rules **must** allow ports 454-455 with an ephemeral source port range (*). The following images describe the default NSG rules generated during the ASE creation. For more information, see [Networking considerations for an App Service Environment](../app-service/environment/network-info.md#network-security-groups).

:::image type="content" source="./media/documentation-government-ase-disacap-inbound-route-table.png" alt-text="Default inbound NSG security rules for an ILB ASE." border="false":::

:::image type="content" source="./media/documentation-government-ase-disacap-outbound-route-table.png" alt-text="Default outbound NSG security rules for an ILB ASE." border="false":::

### Service endpoints 

Depending on the storage you use, you need to enable service endpoints for Azure SQL Database and Azure Storage to access them without going back to the DISA CAP. You also need to enable the Event Hubs service endpoint for ASE logs. For more information, see [Networking considerations for App Service Environment: Service endpoints](../app-service/environment/network-info.md#service-endpoints).

## FAQs

**How long will it take for configuration changes to take effect?** </br>
Some configuration changes may take time to become effective. Allow several hours for changes to routing, NSGs, ASE Health, and so on, to propagate and take effect. Otherwise, you can optionally reboot the ASE.

## Azure Resource Manager template sample

> [!NOTE]
> To deploy non-RFC 1918 IP addresses in the portal, you must pre-stage the VNet and subnet for the ASE. You can use an Azure Resource Manager template to deploy the ASE with non-RFC1918 IPs as well.

</br>

<a href="https://portal.azure.us/#create/Microsoft.Template/uri/https%3A%2F%2Fraw.githubusercontent.com%2FAzure%2Fazure-quickstart-templates%2Fmaster%2FApp-Service-Environment-AzFirewall%2Fazuredeploy.json" target="_blank">

<img src="https://raw.githubusercontent.com/Azure/azure-quickstart-templates/master/1-CONTRIBUTION-GUIDE/images/deploytoazuregov.png" alt="Button to deploy to Azure Gov" />
</a>

This template deploys an **ILB ASE** into the Azure Government or DoD regions.

## Next steps

- [Sign up for Azure Government trial](https://azure.microsoft.com/global-infrastructure/government/request/?ReqType=Trial)
- [Acquiring and accessing Azure Government](https://azure.microsoft.com/offers/azure-government/)
- [Ask questions via the azure-gov tag on StackOverflow](https://stackoverflow.com/tags/azure-gov)
- [Azure Government blog](https://devblogs.microsoft.com/azuregov/)
- [Azure Government overview](./documentation-government-welcome.md)
- [Azure Government security](./documentation-government-plan-security.md)
- [Azure Government compliance](./documentation-government-plan-compliance.md)
- [Secure Azure computing architecture](./compliance/secure-azure-computing-architecture.md)
- [Azure Policy overview](../governance/policy/overview.md)
- [Azure Policy regulatory compliance built-in initiatives](../governance/policy/samples/index.md#regulatory-compliance)
- [Azure Government services by audit scope](./compliance/azure-services-in-fedramp-auditscope.md#azure-government-services-by-audit-scope)
- [Azure Government isolation guidelines for Impact Level 5 workloads](./documentation-government-impact-level-5.md)
- [Azure Government DoD overview](./documentation-government-overview-dod.md)
