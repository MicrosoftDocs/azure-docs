---
 title: Azure IoT Device Provisioning Service (DPS) support for virtual networks
 description: How to use virtual networks connectivity pattern with Azure IoT Device Provisioning Service (DPS)
 services: iot-hub
 author: wesmc7777
 ms.service: iot-dps
 ms.topic: conceptual
 ms.date: 05/03/2020
 ms.author: wesmc
---

# Azure IoT Hub Device Provisioning Service (DPS) support for virtual networks

This article introduces the virtual network (VNET) connectivity pattern and elaborates on how to set up a private connectivity experience for devices using DPS to be assigned to an IoT Hub inside a customer-owned Azure VNET. 

In most scenarios where DPS is configured with a VNET, your IoT Hub will also be configured in the same VNET. For more specific information on IoT Hub support for virtual networks, see, [IoT Hub virtual network support](../iot-hub/virtual-network-support.md).

> [!NOTE]
> The DPS features described in this article are currently available to DPS resources [created with managed service identity](#create-a-dps-resource-with-managed-service-identity) in the following regions: 
> * East US
> * South Central US
> * West US 2


## Introduction

By default, DPS hostnames map to a public endpoint with a publicly routable IP address over the Internet. This public endpoint is visible to DPS resources owned by different customers and access can be attempted by IoT devices over wide-area networks as well as on-premises networks alike.

For several reasons, customers may wish to restrict connectivity to Azure resources, like DPS, through a VNET that they own and operate. These reasons include:

* Introducing additional layers of security via network level isolation for your IoT hub and DPS resources to prevent connection exposure over the public Internet.

* Enabling a private connectivity experience from your on-premises network assets ensuring that your data and traffic 
is transmitted directly to Azure backbone network.

* Preventing exfiltration attacks from sensitive on-premises networks. 

* Following established Azure-wide connectivity patterns using [private endpoints](../private-link/private-endpoint-overview.md).


This article describes how to achieve these goals using [private endpoints](../private-link/private-endpoint-overview.md).


## DPS connectivity using private endpoints

A private endpoint is a private IP address allocated inside a customer-owned VNET via which an Azure resource is reachable. By having a private endpoint for your DPS resource, you will be able to allow devices operating inside your VNET to request provisioning by your DPS resource without requiring traffic to be sent to public endpoints.

Devices that operate in your on-premises network can use [Virtual Private Network (VPN)](https://docs.microsoft.com/azure/vpn-gateway/vpn-gateway-about-vpngateways) or [ExpressRoute](https://azure.microsoft.com/services/expressroute/) private peering to gain connectivity to your VNET in Azure and subsequently to your DPS resource via the private endpoint. As a result, customers who wish to restrict connectivity to public endpoints for DPS can achieve this goal by using [DPS IP filter rules](./iot-dps-ip-filtering.md) while retaining connectivity to their DPS resource using the private endpoint.

> [!NOTE]
> The main focus of this setup is for devices inside an on-premises network. This setup is not advised for devices deployed in a wide-area network.

Before proceeding ensure that the following prerequisites are met:

* Your DPS resource must be provisioned with [managed service identity](#create-a-dps-resource-with-managed-service-identity).

* Your DPS resource must be provisioned in one of the [supported regions](#regional-availability-private-endpoints).

* You have provisioned an Azure VNET with a subnet in which the private endpoint will be created. See [create a virtual network using Azure CLI](../virtual-network/quick-create-cli.md) for more details.

* For devices that operate inside of on-premises networks, set up [Virtual Private Network (VPN)](https://docs.microsoft.com/azure/vpn-gateway/vpn-gateway-about-vpngateways) or [ExpressRoute](https://azure.microsoft.com/services/expressroute/) private peering into your Azure VNET.


### Regional availability (private endpoints)

Private endpoints supported in IoT Hub's created in the following regions:

* East US

* South Central US

* West US 2


### Set up a private endpoint for DPS

To set up a private endpoint, follow these steps:

1. Run the following Azure CLI command to re-register Azure IoT Hub provider with your subscription:

    ```azurecli-interactive
    az provider register --namespace Microsoft.Devices --wait --subscription  <subscription-name>
    ```

2. Navigate to the **Private endpoint connections** tab for your DPS resource in the [Azure portal](https://portal.azure.com) (this tab is only available for in IoT Hubs in the [supported regions](#regional-availability-private-endpoints)), and click the **+** sign to add a new private endpoint.

3. Provide the subscription, resource group, name and region to create the new private endpoint in (ideally, private endpoint should be created in the same region as your hub; see [regional availability section](#regional-availability-private-endpoints) for more details).

4. Click **Next: Resource**, and provide the subscription for your DPS resource, and select **"Microsoft.Devices/ProvisioningServices"** as resource type, your DPS name as **resource**, and **iotHub** as target sub-resource.

    **!!TEST STEP 4 HERE AS THE TARGET SUB-RESOURCE SHOULD BE DPS RELATED!!**

5. Click **Next: Configuration** and provide your virtual network and subnet to create the private endpoint in. Select the option to integrate with Azure private DNS zone, if desired.

6. Click **Next: Tags**, and optionally provide any tags for your resource.

7. Click **Review + create** to create your private endpoint resource.


### Pricing private endpoints

For pricing details, see [Azure Private Link pricing](https://azure.microsoft.com/pricing/details/private-link).


## Egress connectivity from DPS to IoT Hubs

  **!! IS THIS NEEDED FOR DPS TO TALK TO HUBs? !!**


IoT Hub needs access to your Azure blob storage, event hubs, service bus resources for [message routing](../iot-hub/iot-hub-devguide-messages-d2c.md), [file upload](../iot-hub/iot-hub-devguide-file-upload.md), and [bulk device import/export](../iot-hub/iot-hub-bulk-identity-mgmt.md), which typically takes place over the resources' public endpoint. In the event that you bind your storage account, event hubs or service bus resource to a VNET, the advised configuration will block connectivity to the resource by default. Consequently, this will impede IoT Hub's functionality that requires access to those resources.

To alleviate this situation, you need to enable connectivity from your IoT Hub resource to your storage account, event hubs or service bus resources via the **Azure first party trusted services** option.

The prerequisites are as follows:

* Your IoT hub must be provisioned in one of the [supported regions](#regional-availability-trusted-microsoft-first-party-services).

* Your IoT Hub must be assigned a managed service identity at hub provisioning time. Follow instruction on how to [create a DPS resource with managed service identity](#create-a-dps-resource-with-managed-service-identity).


### Regional availability (trusted Microsoft first party services)

Azure trusted first party services exception to bypass firewall restrictions to Azure storage, event hubs and service bus resources is only supported for IoT Hubs in the following regions:

* East US

* South Central US

* West US 2


### Pricing (trusted Microsoft first party services)

Trusted Microsoft first party services exception feature is free of charge in IoT Hubs in the [supported regions](#regional-availability-trusted-microsoft-first-party-services). Charges for the provisioned storage accounts, event hubs, or service bus resources apply separately.


### Create a DPS resource with managed service identity

A managed service identity can be assigned to your DPS resource at provisioning time (this feature is not currently supported for existing DPS resources), which requires the DPS resource to use TLS 1.2 as the minimum version. For this purpose, you need to use the ARM resource template below:

```json
{
  "$schema": "https://schema.management.azure.com/schemas/2015-01-01/deploymentTemplate.json#",
  "contentVersion": "1.0.0.0",
  "resources": [
    {
      "type": "Microsoft.Devices/ProvisioningServices",
      "apiVersion": "2020-03-01",
      "name": "<provide-a-valid-DPS-resource-name>",
      "location": "<any-of-supported-regions>",
      "identity": {
        "type": "SystemAssigned"
      },
      "properties": {
        "minTlsVersion": "1.2"
      },
      "sku": {
          "name": "S1",
          "capacity": 1
      }
    },
    {
      "type": "Microsoft.Resources/deployments",
      "apiVersion": "2018-02-01",
      "name": "updateIotDPSWithKeyEncryptionKey",
      "dependsOn": [
        "<provide-a-valid-DPS-resource-name>"
      ],
      "properties": {
        "mode": "Incremental",
        "template": {
          "$schema": "https://schema.management.azure.com/schemas/2019-04-01/deploymentTemplate.json#",
          "contentVersion": "0.9.0.0",
          "resources": [
            {
              "type": "Microsoft.Devices/ProvisioningServices",
              "apiVersion": "2020-03-01",
              "name": "<provide-a-valid-DPS-resource-name>",
              "location": "<any-of-supported-regions>",
              "identity": {
                "type": "SystemAssigned"
              },
              "properties": {
                "minTlsVersion": "1.2"
              },
              "sku": {
                "name": "S1",
                "capacity": 1
              }
            }
          ]
        }
      }
    }
  ]
}
```

After substituting the values for your resource `name` and supported region for `location`, you can use Azure CLI to deploy the resource in an existing resource group using:

```azurecli-interactive
az group deployment create --name <deployment-name> --resource-group <resource-group-name> --template-file <template-file.json>
```

After the resource is created, you can retrieve the managed service identity assigned to your hub using Azure CLI:

```azurecli-interactive
az resource show --resource-type Microsoft.Devices/ProvisioningServices --name <iot-hub-resource-name> --resource-group <resource-group-name>
```

**!!! IS THIS NEEDED?  I NEED TO WALK THROUGH THIS !!!**

Once the DPS resource with a managed service identity is provisioned, follow the IoT Hub section to set up routing endpoints to your linked IoT Hubs.


### Egress connectivity to IoT Hubs endpoints for routing

**!!! IS THIS NEEDED FOR THE HUB?  I NEED TO WALK THROUGH THIS !!!**

IoT Hub can be configured to route messages to a customer-owned storage account. To allow the routing functionality to access a storage account while firewall restrictions are in place, your IoT Hub needs to have a managed service identity (see how to [create a DPS resource with managed service identity](#create-a-dps-resource-with-managed-service-identity)). Once a managed service identity is provisioned, follow the steps below to give RBAC permission to your hub's resource identity to access your storage account.

1. In the Azure portal, navigate to your storage account's **Access control (IAM)** tab and click **Add** under the **Add a role assignment** section.

2. Select **Storage Blob Data Contributor** as **role**, **Azure AD user, group, or service principal** as **Assigning access to** and select your IoT Hub's resource name in the drop-down list. Click the **Save** button.

3. Navigate to the **Firewalls and virtual networks** tab in your storage account and enable **Allow access from selected networks** option. Under the **Exceptions** list, check the box for **Allow trusted Microsoft services to access this storage account**. Click the **Save** button.

4. On your IoT Hub's resource page, navigate to **Message routing** tab.

5. Navigate to **Custom endpoints** section and click **Add**. Select **Storage** as the endpoint type.

6. On the page that shows up, provide a name for your endpoint, select the container that you intend to use in your blob storage, provide encoding, and file name format. Select **System Assigned** as the **Authentication type** to your storage endpoint. Click the **Create** button.

Now your custom storage endpoint is set up to use your hub's system assigned identity, and it has permission to access your storage resource despite its firewall restrictions. You can now use this endpoint to set up a routing rule.



## Next steps

Use the links below to learn more about IoT Hub features:

* [Message routing](../iot-hub/iot-hub-devguide-messages-d2c.md)
* [File upload](../iot-hub/iot-hub-devguide-file-upload.md)
* [Bulk device import/export](../iot-hub/iot-hub-bulk-identity-mgmt.md) 
