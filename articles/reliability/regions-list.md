---
title: List of Azure regions
description: Find Azure regions, their physical location, geography, availability zone support, as well as their corresponding paired regions if they have one.
author: anaharris-ms
ms.service: azure
ms.subservice: azure-reliability
ms.topic: conceptual
ms.date: 09/23/2025
ms.author: anaharris
ms.custom: references_regions, subject-reliability
#customer intent: As a cloud architect, I want a concise, programmatic list of Azure regions and their characteristics so that I can plan deployments and account for compliance and availability requirements.
---

# Azure regions list

Azure provides the most extensive global footprint of any cloud provider and is rapidly opening new regions. This article contains a list of all Azure regions, their paired region status, physical location, geography, and [availability zone](availability-zones-overview.md) support.

## Legend

| Symbol | Description |
|---|---|
|:::image type="content" source="media/icon-region-coming-soon.svg"  alt-text="Icon that shows that this region is coming soon."  border="false"::: | Region coming soon. To learn more about availability zones and available services support in this region, contact your Microsoft sales or customer representative. For upcoming regions that support availability zones, see [Azure geographies](https://azure.microsoft.com/global-infrastructure/geographies/).
| :::image type="content"  source="media/icon-region-restricted.svg"  alt-text="Icon that shows that this region is access restricted to support specific customer scenarios, such as in-country/region disaster recovery." border="false"::: | This region is access restricted to support specific customer scenarios, such as in-country/region disaster recovery. To request access to a restricted region, see [Azure region access request process](/troubleshoot/azure/general/region-access-request-process#reserved-access-regions). |

> [!NOTE]
> Even when a region provides availability zones, it's possible that some services might not support them in that region. Refer to the [Azure service reliability guides](./overview-reliability-guidance.md) to learn about region support for availability zone-enabled services.
 
 ## Azure regions list
 
| Region | Availability zone support | Paired region | Physical location | Geography | Programmatic name |
|--------|----------------------------|---------------|-------------------|-----------|-------------------|
| Australia Central | | :::image type="content" source="media/icon-region-restricted.svg" alt-text="Icon that shows that this region is access restricted to support specific customer scenarios, such as in-country/region disaster recovery" border="false"::: Australia Central 2 | Canberra | Australia | australiacentral |
| :::image type="content" source="media/icon-region-restricted.svg" alt-text="Icon that shows that this region is access restricted to support specific customer scenarios, such as in-country/region disaster recovery" border="false"::: Australia Central 2 | | Australia Central | Canberra | Australia | australiacentral2 |
| Australia East | :::image  alt-text="Yes"  type="content" source="media/icon-checkmark.svg"  border="false"::: | Australia Southeast | New South Wales | Australia | australiaeast |
| Australia Southeast | | Australia East | Victoria | Australia | australiasoutheast |
| Austria East | :::image alt-text="Yes" type="content" source="media/icon-checkmark.svg" border="false"::: | N/A | Vienna | Austria | austriaeast |
| :::image type="content" source="media/icon-region-coming-soon.svg"  alt-text="Icon that shows that this region is coming soon." border="false"::: :::image type="content" source="media/icon-region-restricted.svg" alt-text="Icon that shows that this region is access restricted to support specific customer scenarios, such as in-country/region disaster recovery"  border="false"::: Belgium Central | :::image  alt-text="Yes"  type="content" source="media/icon-checkmark.svg"  border="false"::: | N/A | Brussels | Belgium | belgiumcentral |
| Brazil South | :::image  alt-text="Yes"  type="content" source="media/icon-checkmark.svg"  border="false"::: | South Central US | Sao Paulo State | Brazil | brazilsouth |
| :::image type="content" source="media/icon-region-restricted.svg" alt-text="Icon that shows that this region is access restricted to support specific customer scenarios, such as in-country/region disaster recovery" border="false"::: Brazil Southeast | | Brazil South | Rio | Brazil | brazilsoutheast |
| Canada Central | :::image  alt-text="Yes"  type="content" source="media/icon-checkmark.svg"  border="false"::: | Canada East | Toronto | Canada | canadacentral |
| Canada East | | Canada Central | Quebec | Canada | canadaeast |
| Central India | :::image  alt-text="Yes"  type="content" source="media/icon-checkmark.svg"  border="false"::: | South India | Pune | India | centralindia |
| Central US | :::image  alt-text="Yes"  type="content" source="media/icon-checkmark.svg"  border="false"::: | East US 2 | Iowa | United States | centralus |
| Chile Central | :::image alt-text="Yes" type="content" source="media/icon-checkmark.svg" border="false"::: | N/A | Santiago | Chile | chilecentral |
| East Asia | :::image  alt-text="Yes"  type="content" source="media/icon-checkmark.svg"  border="false"::: | Southeast Asia | Hong Kong SAR | Asia Pacific | eastasia |
| East US | :::image  alt-text="Yes"  type="content" source="media/icon-checkmark.svg"  border="false"::: | West US | Virginia | United States | eastus |
| East US 2 | :::image  alt-text="Yes"  type="content" source="media/icon-checkmark.svg"  border="false"::: | Central US | Virginia | United States | eastus2 |
| France Central | :::image  alt-text="Yes"  type="content" source="media/icon-checkmark.svg"  border="false"::: | :::image type="content" source="media/icon-region-restricted.svg" alt-text="Icon that shows that this region is access restricted to support specific customer scenarios, such as in-country/region disaster recovery" border="false"::: France South | Paris | France | francecentral |
| :::image type="content" source="media/icon-region-restricted.svg" alt-text="Icon that shows that this region is access restricted to support specific customer scenarios, such as in-country/region disaster recovery" border="false"::: France South | | France Central | Marseille | France | francesouth |
| :::image type="content" source="media/icon-region-restricted.svg" alt-text="Icon that shows that this region is access restricted to support specific customer scenarios, such as in-country/region disaster recovery" border="false"::: Germany North |  | Germany West Central | Berlin | Germany | germanynorth |
| Germany West Central |:::image  alt-text="Yes"  type="content" source="media/icon-checkmark.svg"  border="false"::: | :::image type="content" source="media/icon-region-restricted.svg" alt-text="Icon that shows that this region is access restricted to support specific customer scenarios, such as in-country/region disaster recovery" border="false"::: Germany North | Frankfurt | Germany | germanywestcentral |
| Indonesia Central | :::image alt-text="Yes" type="content" source="media/icon-checkmark.svg" border="false"::: | N/A | Jakarta | Indonesia | indonesiacentral |
| Israel Central | :::image  alt-text="Yes"  type="content" source="media/icon-checkmark.svg"  border="false"::: | N/A | Israel | Israel | israelcentral |
| Italy North | :::image  alt-text="Yes"  type="content" source="media/icon-checkmark.svg"  border="false"::: | N/A | Milan | Italy | italynorth |
| Japan East | :::image  alt-text="Yes"  type="content" source="media/icon-checkmark.svg"  border="false"::: | Japan West | Tokyo, Saitama | Japan | japaneast |
| Japan West | :::image  alt-text="Yes"  type="content" source="media/icon-checkmark.svg"  border="false"::: | Japan East | Osaka | Japan | japanwest |
| Korea Central | :::image  alt-text="Yes"  type="content" source="media/icon-checkmark.svg"  border="false"::: | Korea South | Seoul | Korea | koreacentral |
| Korea South | | Korea Central | Busan | Korea | koreasouth |
| Malaysia West | :::image type="content" source="media/icon-checkmark.svg" alt-text="Yes" border="false"::: | N/A | Kuala Lumpur | Malaysia | malaysiawest |
| Mexico Central | :::image  alt-text="Yes"  type="content" source="media/icon-checkmark.svg"  border="false"::: | N/A | Querétaro State | Mexico | mexicocentral |
| New Zealand North | :::image  alt-text="Yes"  type="content" source="media/icon-checkmark.svg"  border="false"::: | N/A | Auckland | New Zealand | newzealandnorth |
| North Central US | | South Central US | Illinois | United States | northcentralus |
| North Europe | :::image  alt-text="Yes"  type="content" source="media/icon-checkmark.svg"  border="false"::: | West Europe | Ireland | Europe | northeurope |
| Norway East | :::image  alt-text="Yes"  type="content" source="media/icon-checkmark.svg"  border="false"::: | :::image type="content" source="media/icon-region-restricted.svg" alt-text="Icon that shows that this region is access restricted to support specific customer scenarios, such as in-country/region disaster recovery" border="false"::: Norway West | Norway | Norway | norwayeast |
| :::image type="content" source="media/icon-region-restricted.svg" alt-text="Icon that shows that this region is access restricted to support specific customer scenarios, such as in-country/region disaster recovery" border="false"::: Norway West | | Norway East | Norway | Norway | norwaywest |
| Poland Central | :::image  alt-text="Yes"  type="content" source="media/icon-checkmark.svg"  border="false"::: | N/A | Warsaw | Poland | polandcentral |
| Qatar Central | :::image  alt-text="Yes"  type="content" source="media/icon-checkmark.svg"  border="false"::: | N/A | Doha | Qatar | qatarcentral |
| South Africa North | :::image  alt-text="Yes"  type="content" source="media/icon-checkmark.svg"  border="false"::: | :::image type="content" source="media/icon-region-restricted.svg" alt-text="Icon that shows that this region is access restricted to support specific customer scenarios, such as in-country/region disaster recovery" border="false"::: South Africa West | Johannesburg | South Africa | southafricanorth |
| :::image type="content" source="media/icon-region-restricted.svg" alt-text="Icon that shows that this region is access restricted to support specific customer scenarios, such as in-country/region disaster recovery" border="false"::: South Africa West | | South Africa North | Cape Town | South Africa | southafricawest |
| South Central US | :::image  alt-text="Yes"  type="content" source="media/icon-checkmark.svg"  border="false"::: | North Central US | Texas | United States | southcentralus |
| South India | | Central India | Chennai | India | southindia |
| Southeast Asia | :::image  alt-text="Yes"  type="content" source="media/icon-checkmark.svg"  border="false"::: | East Asia | Singapore | Asia Pacific | southeastasia |
| Spain Central | :::image  alt-text="Yes"  type="content" source="media/icon-checkmark.svg"  border="false"::: | N/A | Madrid | Spain | spaincentral |
| Sweden Central | :::image  alt-text="Yes"  type="content" source="media/icon-checkmark.svg"  border="false"::: | :::image type="content" source="media/icon-region-restricted.svg" alt-text="Icon that shows that this region is access restricted to support specific customer scenarios, such as in-country/region disaster recovery" border="false"::: Sweden South | Gävle | Sweden | swedencentral |
| Switzerland North | :::image  alt-text="Yes"  type="content" source="media/icon-checkmark.svg"  border="false"::: | :::image type="content" source="media/icon-region-restricted.svg" alt-text="Icon that shows that this region is access restricted to support specific customer scenarios, such as in-country/region disaster recovery" border="false"::: Switzerland West | Zurich | Switzerland | switzerlandnorth |
| :::image type="content" source="media/icon-region-restricted.svg" alt-text="Icon that shows that this region is access restricted to support specific customer scenarios, such as in-country/region disaster recovery" border="false"::: Switzerland West | | Switzerland North | Geneva | Switzerland | switzerlandwest |
| :::image type="content" source="media/icon-region-restricted.svg" alt-text="Icon that shows that this region is access restricted to support specific customer scenarios, such as in-country/region disaster recovery" border="false"::: UAE Central | | UAE North | Abu Dhabi | UAE | uaecentral |
| UAE North | :::image  alt-text="Yes"  type="content" source="media/icon-checkmark.svg"  border="false"::: | :::image type="content" source="media/icon-region-restricted.svg" alt-text="Icon that shows that this region is access restricted to support specific customer scenarios, such as in-country/region disaster recovery" border="false"::: UAE Central | Dubai | UAE | uaenorth |
| UK South | :::image  alt-text="Yes"  type="content" source="media/icon-checkmark.svg"  border="false"::: | UK West | London | United Kingdom | uksouth |
| UK West | | UK South | Cardiff | United Kingdom | ukwest |
| West Central US | | West US 2 | Wyoming | United States | westcentralus |
| West Europe | :::image type="content" source="media/icon-checkmark.svg" alt-text="Yes"   border="false"::: | North Europe | Netherlands | Europe | westeurope |
| West India | | South India | Mumbai | India | westindia |
| West US | | East US | California | United States | westus |
| West US 2 | :::image type="content" source="media/icon-checkmark.svg" alt-text="Yes"   border="false"::: | West Central US | Washington | United States | westus2 |
| West US 3 | :::image type="content" source="media/icon-checkmark.svg" alt-text="Yes"   border="false"::: | East US | Phoenix | United States | westus3 |

### Azure programmatic region names

To retrieve a list of regions, including the names that can be used for programming and scripting, you can use the following methods:

- [Azure CLI - az account list-locations](/cli/azure/account#az-account-list-locations)
- [Azure PowerShell - Get-AzLocation](/powershell/module/az.resources/get-azlocation)
- [Azure Resource Manager REST API](/rest/api/resources/subscriptions/list-locations)

## Related content

- [What are Azure regions?](regions-overview.md)
- [Azure region pairs and nonpaired regions](regions-paired.md)
- [Microsoft commitment to expand Azure availability zones to more regions](https://azure.microsoft.com/blog/our-commitment-to-expand-azure-availability-zones-to-more-regions/)
