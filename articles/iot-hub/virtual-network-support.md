---
 title: Azure IoT Hub support for virtual networks
 description: How to use virtual networks connectivity pattern with IoT Hub
 services: iot-hub
 author: rezasherafat
 ms.service: iot-fundamentals
 ms.topic: conceptual
 ms.date: 03/13/2020
 ms.author: rezas
---

# IoT Hub support for virtual networks

This article introduces the VNET connectivity pattern and elaborates on how to set up a private connectivity experience to an IoT hub through a customer-owned Azure VNET.

> [!NOTE]
> The IoT Hub features described in this article are currently available to IoT hubs [created with managed service identity](#create-an-iot-hub-with-managed-service-identity) in the following regions: East US, South Central US, and West US 2.


## Introduction

By default, IoT Hub hostnames map to a public endpoint with a publicly routable IP address over the Internet. As shown in the illustration below, this IoT Hub public endpoint is shared among hubs owned by different customers and can be accessed by IoT devices over wide-area networks as well as on-premises networks alike.

Several IoT Hub features including [message routing](./iot-hub-devguide-messages-d2c.md), [file upload](./iot-hub-devguide-file-upload.md), and [bulk device import/export](./iot-hub-bulk-identity-mgmt.md) similarly require connectivity from IoT Hub to a customer-owned Azure resource over its public endpoint. As illustrated below, these connectivity paths collectively constitute the egress traffic from IoT Hub to customer resources.
![IoT Hub public endpoint](./media/virtual-network-support/public-endpoint.png)


For several reasons, customers may wish to restrict connectivity to their Azure resources (including IoT Hub) through a VNET that they own and operate. These reasons include:

* Introducing additional layers of security via network level isolation for your IoT hub by preventing connectivity exposure to your hub over the public Internet.

* Enabling a private connectivity experience from your on-premises network assets ensuring that your data and traffic 
is transmitted directly to Azure backbone network.

* Preventing exfiltration attacks from sensitive on-premises networks. 

* Following established Azure-wide connectivity patterns using [private endpoints](../private-link/private-endpoint-overview.md).


This article describes how to achieve these goals using [private endpoints](../private-link/private-endpoint-overview.md) for ingress connectivity to IoT Hub, as using Azure trusted first party services exception for egress connectivity from IoT Hub to other Azure resources.


## Ingress connectivity to IoT Hub using private endpoints

A private endpoint is a private IP address allocated inside a customer-owned VNET via which an Azure resource is reachable. By having a private endpoint for your IoT hub, you will be able to allow services operating inside your VNET to reach IoT Hub without requiring traffic to be sent to IoT Hub's public endpoint. Similarly, devices that operate in your on-premises can use [Virtual Private Network (VPN)](https://docs.microsoft.com/azure/vpn-gateway/vpn-gateway-about-vpngateways) or [ExpressRoute](https://azure.microsoft.com/services/expressroute/) Private Peering to gain connectivity to your VNET in Azure and subsequently to your IoT Hub (via its private endpoint). As a result, customers who wish to restrict connectivity to their IoT hub's public endpoints (or possibly completely block it off) can achieve this goal by using [IoT Hub firewall rules](./iot-hub-ip-filtering.md) while retaining connectivity to their Hub using the private endpoint.

> [!NOTE]
> The main focus of this setup is for devices inside an on-premises network. This setup is not advised for devices deployed in a wide-area network.

![IoT Hub public endpoint](./media/virtual-network-support/virtual-network-ingress.png)

Before proceeding ensure that the following prerequisites are met:

* Your IoT hub must be provisioned with [managed service identity](#create-an-iot-hub-with-managed-service-identity).

* Your IoT hub must be provisioned in one of the [supported regions](#regional-availability-private-endpoints).

* You have provisioned an Azure VNET with a subnet in which the private endpoint will be created. See [create a virtual network using Azure CLI](../virtual-network/quick-create-cli.md) for more details.

* For devices that operate inside of on-premises networks, set up [Virtual Private Network (VPN)](https://docs.microsoft.com/azure/vpn-gateway/vpn-gateway-about-vpngateways) or [ExpressRoute](https://azure.microsoft.com/services/expressroute/) private peering into your Azure VNET.


### Regional availability (private endpoints)

Private endpoints supported in IoT Hub's created in the following regions:

* East US

* South Central US

* West US 2


### Set up a private endpoint for IoT Hub ingress

To set up a private endpoint, follow these steps:

1. Run the following Azure CLI command to re-register Azure IoT Hub provider with your subscription:

    ```azurecli-interactive
    az provider register --namespace Microsoft.Devices --wait --subscription  <subscription-name>
    ```

2. Navigate to the **Private endpoint connections** tab in your IoT Hub portal (this tab is only available for in IoT Hubs in the [supported regions](#regional-availability-private-endpoints)), and click the **+** sign to add a new private endpoint.

3. Provide the subscription, resource group, name and region to create the new private endpoint in (ideally, private endpoint should be created in the same region as your hub; see [regional availability section](#regional-availability-private-endpoints) for more details).

4. Click **Next: Resource**, and provide the subscription for your IoT Hub resource, and select **"Microsoft.Devices/IotHubs"** as resource type, your IoT Hub name as **resource**, and **iotHub** as target sub-resource.

5. Click **Next: Configuration** and provide your virtual network and subnet to create the private endpoint in. Select the option to integrate with Azure private DNS zone, if desired.

6. Click **Next: Tags**, and optionally provide any tags for your resource.

7. Click **Review + create** to create your private endpoint resource.


### Pricing (private endpoints)

For pricing details, see [Azure Private Link pricing](https://azure.microsoft.com/pricing/details/private-link).


## Egress connectivity from IoT Hub to other Azure resources

IoT Hub needs access to your Azure blob storage, event hubs, service bus resources for [message routing](./iot-hub-devguide-messages-d2c.md), [file upload](./iot-hub-devguide-file-upload.md), and [bulk device import/export](./iot-hub-bulk-identity-mgmt.md), which typically takes place over the resources' public endpoint. In the event that you bind your storage account, event hubs or service bus resource to a VNET, the advised configuration will block connectivity to the resource by default. Consequently, this will impede IoT Hub's functionality that requires access to those resources.

To alleviate this situation, you need to enable connectivity from your IoT Hub resource to your storage account, event hubs or service bus resources via the **Azure first party trusted services** option.

The prerequisites are as follows:

* Your IoT hub must be provisioned in one of the [supported regions](#regional-availability-trusted-microsoft-first-party-services).

* Your IoT Hub must be assigned a managed service identity at hub provisioning time. Follow instruction on how to [create a hub with managed service identity](#create-an-iot-hub-with-managed-service-identity).


### Regional availability (trusted Microsoft first party services)

Azure trusted first party services exception to bypass firewall restrictions to Azure storage, event hubs and service bus resources is only supported for IoT Hubs in the following regions:

* East US

* South Central US

* West US 2


### Pricing (trusted Microsoft first party services)

Trusted Microsoft first party services exception feature is free of charge in IoT Hubs in the [supported regions](#regional-availability-trusted-microsoft-first-party-services). Charges for the provisioned storage accounts, event hubs, or service bus resources apply separately.


### Create an IoT hub with managed service identity

A managed service identity can be assigned to your hub at resource provisioning time (this feature is not currently supported for existing hubs), which requires the IoT hub to use TLS 1.2 as the minimum version. For this purpose, you need to use the ARM resource template below:

```json
{
  "$schema": "https://schema.management.azure.com/schemas/2015-01-01/deploymentTemplate.json#",
  "contentVersion": "1.0.0.0",
  "resources": [
    {
      "type": "Microsoft.Devices/IotHubs",
      "apiVersion": "2020-03-01",
      "name": "<provide-a-valid-resource-name>",
      "location": "<any-of-supported-regions>",
      "identity": {
        "type": "SystemAssigned"
      },
      "properties": {
        "minTlsVersion": "1.2"
      },
      "sku": {
        "name": "<your-hubs-SKU-name>",
        "tier": "<your-hubs-SKU-tier>",
        "capacity": 1
      }
    },
    {
      "type": "Microsoft.Resources/deployments",
      "apiVersion": "2018-02-01",
      "name": "updateIotHubWithKeyEncryptionKey",
      "dependsOn": [
        "<provide-a-valid-resource-name>"
      ],
      "properties": {
        "mode": "Incremental",
        "template": {
          "$schema": "https://schema.management.azure.com/schemas/2019-04-01/deploymentTemplate.json#",
          "contentVersion": "0.9.0.0",
          "resources": [
            {
              "type": "Microsoft.Devices/IotHubs",
              "apiVersion": "2020-03-01",
              "name": "<provide-a-valid-resource-name>",
              "location": "<any-of-supported-regions>",
              "identity": {
                "type": "SystemAssigned"
              },
              "properties": {
                "minTlsVersion": "1.2"
              },
              "sku": {
                "name": "<your-hubs-SKU-name>",
                "tier": "<your-hubs-SKU-tier>",
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

After substituting the values for your resource `name`, `location`, `SKU.name` and `SKU.tier`, you can use Azure CLI to deploy the resource in an existing resource group using:

```azurecli-interactive
az group deployment create --name <deployment-name> --resource-group <resource-group-name> --template-file <template-file.json>
```

After the resource is created, you can retrieve the managed service identity assigned to your hub using Azure CLI:

```azurecli-interactive
az resource show --resource-type Microsoft.Devices/IotHubs --name <iot-hub-resource-name> --resource-group <resource-group-name>
```

Once IoT Hub with a managed service identity is provisioned, follow the corresponding section to set up routing endpoints to [storage accounts](#egress-connectivity-to-storage-account-endpoints-for-routing), [event hubs](#egress-connectivity-to-event-hubs-endpoints-for-routing), and [service bus](#egress-connectivity-to-service-bus-endpoints-for-routing) resources, or to configure [file upload](#egress-connectivity-to-storage-accounts-for-file-upload) and [bulk device import/export](#egress-connectivity-to-storage-accounts-for-bulk-device-importexport).


### Egress connectivity to storage account endpoints for routing

IoT Hub can be configured to route messages to a customer-owned storage account. To allow the routing functionality to access a storage account while firewall restrictions are in place, your IoT Hub needs to have a managed service identity (see how to [create a hub with managed service identity](#create-an-iot-hub-with-managed-service-identity)). Once a managed service identity is provisioned, follow the steps below to give RBAC permission to your hub's resource identity to access your storage account.

1. In the Azure portal, navigate to your storage account's **Access control (IAM)** tab and click **Add** under the **Add a role assignment** section.

2. Select **Storage Blob Data Contributor** as **role**, **Azure AD user, group, or service principal** as **Assigning access to** and select your IoT Hub's resource name in the drop-down list. Click the **Save** button.

3. Navigate to the **Firewalls and virtual networks** tab in your storage account and enable **Allow access from selected networks** option. Under the **Exceptions** list, check the box for **Allow trusted Microsoft services to access this storage account**. Click the **Save** button.

4. On your IoT Hub's resource page, navigate to **Message routing** tab.

5. Navigate to **Custom endpoints** section and click **Add**. Select **Storage** as the endpoint type.

6. On the page that shows up, provide a name for your endpoint, select the container that you intend to use in your blob storage, provide encoding, and file name format. Select **System Assigned** as the **Authentication type** to your storage endpoint. Click the **Create** button.

Now your custom storage endpoint is set up to use your hub's system assigned identity, and it has permission to access your storage resource despite its firewall restrictions. You can now use this endpoint to set up a routing rule.


### Egress connectivity to event hubs endpoints for routing

IoT Hub can be configured to route messages to a customer-owned event hubs namespace. To allow the routing functionality to access an event hubs resource while firewall restrictions are in place, your IoT Hub needs to have a managed service identity (see how to [create a hub with managed service identity](#create-an-iot-hub-with-managed-service-identity)). Once a managed service identity is provisioned, follow the steps below to give RBAC permission to your hub's resource identity to access your event hubs.

1. In the Azure portal, navigate to your event hubs **Access control (IAM)** tab and click **Add** under the **Add a role assignment** section.

2. Select **Event Hubs Data Sender** as **role**, **Azure AD user, group, or service principal** as **Assigning access to** and select your IoT Hub's resource name in the drop-down list. Click the **Save** button.

3. Navigate to the **Firewalls and virtual networks** tab in your event hubs and enable **Allow access from selected networks** option. Under the **Exceptions** list, check the box for **Allow trusted Microsoft services to access event hubs**. Click the **Save** button.

4. On your IoT Hub's resource page, navigate to **Message routing** tab.

5. Navigate to **Custom endpoints** section and click **Add**. Select **Event hubs** as the endpoint type.

6. On the page that shows up, provide a name for your endpoint, select your event hubs namespace and instance and click the **Create** button.

Now your custom event hubs endpoint is set up to use your hub's system assigned identity, and it has permission to access your event hubs resource despite its firewall restrictions. You can now use this endpoint to set up a routing rule.


### Egress connectivity to service bus endpoints for routing

IoT Hub can be configured to route messages to a customer-owned service bus namespace. To allow the routing functionality to access a service bus resource while firewall restrictions are in place, your IoT Hub needs to have a managed service identity (see how to [create a hub with managed service identity](#create-an-iot-hub-with-managed-service-identity)). Once a managed service identity is provisioned, follow the steps below to give RBAC permission to your hub's resource identity to access your service bus.

1. In the Azure portal, navigate to your service bus' **Access control (IAM)** tab and click **Add** under the **Add a role assignment** section.

2. Select **Service bus Data Sender** as **role**, **Azure AD user, group, or service principal** as **Assigning access to** and select your IoT Hub's resource name in the drop-down list. Click the **Save** button.

3. Navigate to the **Firewalls and virtual networks** tab in your service bus and enable **Allow access from selected networks** option. Under the **Exceptions** list, check the box for **Allow trusted Microsoft services to access this service bus**. Click the **Save** button.

4. On your IoT Hub's resource page, navigate to **Message routing** tab.

5. Navigate to **Custom endpoints** section and click **Add**. Select **Service bus queue** or **Service bus topic** (as applicable) as the endpoint type.

6. On the page that shows up, provide a name for your endpoint, select your service bus' namespace and queue or topic (as applicable). Click the **Create** button.

Now your custom service bus endpoint is set up to use your hub's system assigned identity, and it has permission to access your service bus resource despite its firewall restrictions. You can now use this endpoint to set up a routing rule.


### Egress connectivity to storage accounts for file upload

IoT Hub's file upload feature allows devices to upload files to a customer-owned storage account. To allow the file upload to function, both devices and IoT Hub need to have connectivity to the storage account. If firewall restrictions are in place on the storage account, your devices need to use any of the supported storage account's mechanism (including [private endpoints](../private-link/create-private-endpoint-storage-portal.md), [service endpoints](../virtual-network/virtual-network-service-endpoints-overview.md) or [direct firewall configuration](../storage/common/storage-network-security.md)) to gain connectivity. Similarly, if firewall restrictions are in place on the storage account, IoT Hub needs to be configured to access the storage resource via the trusted Microsoft services exception. For this purpose, your IoT Hub must have a managed service identity (see how to [create a hub with managed service identity](#create-an-iot-hub-with-managed-service-identity)). Once a managed service identity is provisioned, follow the steps below to give RBAC permission to your hub's resource identity to access your storage account.

1. In the Azure portal, navigate to your storage account's **Access control (IAM)** tab and click **Add** under the **Add a role assignment** section.

2. Select **Storage Blob Data Contributor** as **role**, **Azure AD user, group, or service principal** as **Assigning access to** and select your IoT Hub's resource name in the drop-down list. Click the **Save** button.

3. Navigate to the **Firewalls and virtual networks** tab in your storage account and enable **Allow access from selected networks** option. Under the **Exceptions** list, check the box for **Allow trusted Microsoft services to access this storage account**. Click the **Save** button.

4. On your IoT Hub's resource page, navigate to **File upload** tab.

5. On the page that shows up, select the container that you intend to use in your blob storage, configure the **File notification settings**, **SAS TTL**, **Default TTL** and **Maximum delivery count** as desired. Select **System Assigned** as the **Authentication type** to your storage endpoint. Click the **Create** button.

Now your storage endpoint for file upload is set up to use your hub's system assigned identity, and it has permission to access your storage resource despite its firewall restrictions.


### Egress connectivity to storage accounts for bulk device import/export

IoT Hub supports the functionality to [import/export](./iot-hub-bulk-identity-mgmt.md) devices' information in bulk from/to a customer-provided storage blob. To allow bulk import/export feature to function, both devices and IoT Hub need to have connectivity to the storage account.

This functionality requires connectivity from IoT Hub to the storage account. To access a service bus resource while firewall restrictions are in place, your IoT Hub needs to have a managed service identity (see how to [create a hub with managed service identity](#create-an-iot-hub-with-managed-service-identity)). Once a managed service identity is provisioned, follow the steps below to give RBAC permission to your hub's resource identity to access your service bus.

1. In the Azure portal, navigate to your storage account's **Access control (IAM)** tab and click **Add** under the **Add a role assignment** section.

2. Select **Storage Blob Data Contributor** as **role**, **Azure AD user, group, or service principal** as **Assigning access to** and select your IoT Hub's resource name in the drop-down list. Click the **Save** button.

3. Navigate to the **Firewalls and virtual networks** tab in your storage account and enable **Allow access from selected networks** option. Under the **Exceptions** list, check the box for **Allow trusted Microsoft services to access this storage account**. Click the **Save** button.

You can now use the Azure IoT REST API's for [creating import export jobs](https://docs.microsoft.com/rest/api/iothub/service/jobclient/getimportexportjobs) for information on how to use the bulk import/export functionality. Note that you will need to provide the `storageAuthenticationType="identityBased"` in your request body and use `inputBlobContainerUri="https://..."` and `outputBlobContainerUri="https://..."` as the input and output URL's of your storage account, respectively.


Azure IoT Hub SDK's also support this functionality in the service client's registry manager. The following code snippet shows how to initiate an import job or export job in using the C# SDK.

```csharp
// Call an import job on the IoT Hub
JobProperties importJob = 
await registryManager.ImportDevicesAsync(
  JobProperties.CreateForImportJob(inputBlobContainerUri, outputBlobContainerUri, null, StorageAuthenticationType.IdentityBased), 
  cancellationToken);

// Call an export job on the IoT Hub to retrieve all devices
JobProperties exportJob = 
await registryManager.ExportDevicesAsync(
    JobProperties.CreateForExportJob(outputBlobContainerUri, true, null, StorageAuthenticationType.IdentityBased),
    cancellationToken);
```


To use this region-limited version of the Azure IoT SDKs with virtual network support for C#, Java, and Node.js:

1. Create an environment variable named `EnableStorageIdentity` and set its value to `1`.

2. Download the SDK:  [Java](https://aka.ms/vnetjavasdk) | [C#](https://aka.ms/vnetcsharpsdk) | [Node.js](https://aka.ms/vnetnodesdk)
 
For Python, download our limited version from GitHub.

1. Navigate to the [GitHub release page](https://aka.ms/vnetpythonsdk).

2. Download the following file, which you'll find at the bottom of the release page under the header named **assets**.
    > *azure_iot_hub-2.2.0_limited-py2.py3-none-any.whl*

3. Open a terminal and navigate to the folder with the downloaded file.

4. Run the following command to install the Python Service SDK with support for virtual networks:
    > pip install ./azure_iot_hub-2.2.0_limited-py2.py3-none-any.whl


## Next steps

Use the links below to learn more about IoT Hub features:

* [Message routing](./iot-hub-devguide-messages-d2c.md)
* [File upload](./iot-hub-devguide-file-upload.md)
* [Bulk device import/export](./iot-hub-bulk-identity-mgmt.md) 
