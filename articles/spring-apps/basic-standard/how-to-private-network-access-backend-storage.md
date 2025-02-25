---
title: Configure Private Network Access for Backend Storage in Your Virtual Network
description: Learn how to configure private network access to backend storage in your virtual network.
author: KarlErickson
ms.author: haozhan
ms.service: azure-spring-apps
ms.topic: how-to
ms.date: 07/25/2024
ms.custom: devx-track-java, devx-track-extended-java, devx-track-azurecli
---

# Configure private network access for backend storage in your virtual network

[!INCLUDE [deprecation-note](../includes/deprecation-note.md)]

**This article applies to:** ✅ Standard ✅ Enterprise

This article explains how to configure private network access to backend storage for your application within your virtual network.

When you deploy an application in an Azure Spring Apps service instance with virtual network injection, the service instance relies on backend storage for housing associated assets, including JAR files and logs. While the default configuration routes traffic to this backend storage over the public network, you can turn on the private storage access feature. This feature enables you to direct the traffic through your private network, enhancing security, and potentially improving performance.

> [!NOTE]
> This feature applies to an Azure Spring Apps virtual network injected service instance only.
>
> Before you enable this feature for your Azure Spring Apps service instance, ensure that there are at least two available IP addresses in the service runtime subnet.
>
> Enabling or disabling this feature changes the DNS resolution to the backend storage. For a short period of time, you might experience deployments that fail to establish a connection to the backend storage or are unable to resolve their endpoint during the update.
>
> After you enable this feature, the backend storage is only accessible privately, so you have to deploy your application within the virtual network.

## Prerequisites

- An Azure subscription. If you don't have a subscription, create a [free account](https://azure.microsoft.com/free/) before you begin.
- [Azure CLI](/cli/azure/install-azure-cli) version 2.56.0 or higher.
- An existing Azure Spring Apps service instance deployed to a virtual network. For more information, see [Deploy Azure Spring Apps in a virtual network](./how-to-deploy-in-azure-virtual-network.md).

## Enable private storage access when you create a new Azure Spring Apps instance

When you create an Azure Spring Apps instance in the virtual network, use the following command to pass the argument `--enable-private-storage-access true` to enable private storage access. For more information, see [Deploy Azure Spring Apps in a virtual network](how-to-deploy-in-azure-virtual-network.md).

```azurecli
az spring create \
    --resource-group "<resource-group>" \
    --name "<Azure-Spring-Apps-instance-name>" \
    --vnet "<virtual-network-name>" \
    --service-runtime-subnet "<service-runtime-subnet>" \
    --app-subnet "<apps-subnet>" \
    --location "<location>" \
    --enable-private-storage-access true
```

One more resource group is created in your subscription to host the private link resources for the Azure Spring Apps instance. This resource group is named `ap-res_{service instance name}_{service instance region}`.

There are two sets of private link resources deployed in the resource group, each composed of the following Azure resources:

- A private endpoint that represents the backend storage account's private endpoint.
- A network interface (NIC) that maintains a private IP address within the service runtime subnet.
- A private DNS zone deployed for your virtual network, with a DNS A record also created for the storage account within this DNS zone.

> [!IMPORTANT]
> The resource groups are fully managed by the Azure Spring Apps service. Don't manually delete or modify any resource inside these resource groups.

## Enable or disable private storage access for an existing Azure Spring Apps instance

Use the following command to update an existing Azure Spring Apps instance to enable or disable private storage access:

```azurecli
az spring update \
    --resource-group "<resource-group>" \
    --name "<Azure-Spring-Apps-instance-name>" \
    --enable-private-storage-access <true-or-false>
```

## Use central DNS resolution

A centralized DNS management architecture is documented in the hub and spoke network architecture in [Private Link and DNS integration at scale](/azure/cloud-adoption-framework/ready/azure-best-practices/private-link-and-dns-integration-at-scale). In this architecture, all private DNS zones are deployed and managed centrally in a different central virtual network than the Azure Spring Apps service instance. If you're using this architecture, you can enable central DNS resolution for private storage access by configuring the DNS settings appropriately. This setup ensures that:

- When a private endpoint is created, the corresponding DNS records are automatically added to the centralized private DNS zone.
- DNS records are managed according to the lifecycle of the private endpoint, meaning they are automatically removed when the private endpoint is deleted.

The following sections explain how to enable central DNS resolution for Azure Storage blobs by using [Azure Policy](../../governance/policy/overview.md), assuming you already have the private DNS zone `privatelink.blob.core.windows.net` set up in the central virtual network. The same principles apply to Azure Storage files and other Azure services that support Private Link.

### Policy definition

In addition to the private DNS zone, you need to create a custom Azure Policy definition. For more information, see [Tutorial: Create a custom policy definition](../../governance/policy/tutorials/create-custom-policy-definition.md). This definition automatically creates the required DNS record in the central private DNS zone when you create a private endpoint.

The following policy is triggered when you create a private endpoint resource with a service-specific `groupId`. The `groupId` is the ID of the group obtained from the remote resource or service that this private endpoint should connect to. In this example, the `groupId` for Azure Storage blobs is `blob`. For more information on the `groupId` for other Azure services, see the tables in [Azure Private Endpoint private DNS zone values](../../private-link/private-endpoint-dns.md), under the **Subresource** column.

The policy then triggers a deployment of a `privateDNSZoneGroup` within the private endpoint, which associates the private endpoint with the private DNS zone specified as the parameter. In the following example, the private DNS zone resource ID is `/subscriptions/<subscription-id>/resourceGroups/<resourceGroupName>/providers/Microsoft.Network/privateDnsZones/privatelink.blob.core.windows.net`:

```json
{
  "mode": "Indexed",
  "policyRule": {
    "if": {
      "allOf": [
        {
          "field": "type",
          "equals": "Microsoft.Network/privateEndpoints"
        },
        {
          "value": "[contains(resourceGroup().name, 'ap-res_')]",
          "equals": "true"
        },
        {
          "count": {
            "field": "Microsoft.Network/privateEndpoints/privateLinkServiceConnections[*].groupIds[*]",
            "where": {
              "field": "Microsoft.Network/privateEndpoints/privateLinkServiceConnections[*].groupIds[*]",
              "equals": "blob"
            }
          },
          "greaterOrEquals": 1
        }
      ]
    },
    "then": {
      "effect": "deployIfNotExists",
      "details": {
        "type": "Microsoft.Network/privateEndpoints/privateDnsZoneGroups",
        "evaluationDelay": "AfterProvisioningSuccess",
        "roleDefinitionIds": [
          "/providers/Microsoft.Authorization/roleDefinitions/4d97b98b-1d4f-4787-a291-c67834d212e7"
        ],
        "deployment": {
          "properties": {
            "mode": "incremental",
            "template": {
              "$schema": "https://schema.management.azure.com/schemas/2019-04-01/deploymentTemplate.json#",
              "contentVersion": "1.0.0.0",
              "parameters": {
                "privateDnsZoneId": {
                  "type": "string"
                },
                "privateEndpointName": {
                  "type": "string"
                },
                "location": {
                  "type": "string"
                }
              },
              "resources": [
                {
                  "name": "[concat(parameters('privateEndpointName'), '/deployedByPolicy')]",
                  "type": "Microsoft.Network/privateEndpoints/privateDnsZoneGroups",
                  "apiVersion": "2020-03-01",
                  "location": "[parameters('location')]",
                  "properties": {
                    "privateDnsZoneConfigs": [
                      {
                        "name": "storageBlob-privateDnsZone",
                        "properties": {
                          "privateDnsZoneId": "[parameters('privateDnsZoneId')]"
                        }
                      }
                    ]
                  }
                }
              ]
            },
            "parameters": {
              "privateDnsZoneId": {
                "value": "[parameters('privateDnsZoneId')]"
              },
              "privateEndpointName": {
                "value": "[field('name')]"
              },
              "location": {
                "value": "[field('location')]"
              }
            }
          }
        }
      }
    }
  },
  "parameters": {
    "privateDnsZoneId": {
      "type": "String",
      "metadata": {
        "displayName": "privateDnsZoneId",
        "description": null,
        "strongType": "Microsoft.Network/privateDnsZones"
      }
    }
  }
}
```

### Policy assignment

After you deploy the policy definition, assign the policy at the subscription hosting the Azure Spring Apps service instances and specify the central private DNS zone as the parameter.

The central private DNS zone and Azure Spring Apps service instance might be hosted in the different subscriptions. In this case, remember to assign the [Private DNS Zone Contributor role](../../dns/dns-protect-private-zones-recordsets.md#the-private-dns-zone-contributor-role) in the subscription and resource group where the private DNS zones are hosted to the managed identity created by the `DeployIfNotExists` policy assignment that's responsible to create and manage the private endpoint DNS record in the private DNS zone. For more information, see the [Configure the managed identity](../../governance/policy/how-to/remediate-resources.md?tabs=azure-portal#configure-the-managed-identity) section of [Remediate non-compliant resources with Azure Policy](../../governance/policy/how-to/remediate-resources.md?tabs=azure-portal).

After you finish the configurations, when you enable or disable the private storage access feature, the DNS records for private endpoints are automatically registered - and removed after a private endpoint is deleted - in the corresponding private DNS zone.

## Extra costs

The Azure Spring Apps instance doesn't incur charges for this feature. However, you're billed for the private link resources hosted in your subscription that support this feature. For more information, see [Azure Private Link Pricing](https://azure.microsoft.com/pricing/details/private-link/) and [Azure DNS Pricing](https://azure.microsoft.com/pricing/details/dns/).

## Use custom DNS servers

If you're using a custom domain name system (DNS) server and the Azure DNS IP `168.63.129.16` isn't configured as the upstream DNS server, you must manually bind all the DNS records of the private DNS zones shown in the resource group `ap-res_{service instance name}_{service instance region}` to resolve the private IP addresses.

## Next steps

* [Customer responsibilities for running Azure Spring Apps in a virtual network](vnet-customer-responsibilities.md)
* [Private Link and DNS integration at scale](/azure/cloud-adoption-framework/ready/azure-best-practices/private-link-and-dns-integration-at-scale)
