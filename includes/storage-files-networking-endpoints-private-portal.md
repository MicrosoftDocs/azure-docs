---
 title: include file
 description: include file
 services: storage
 author: khdownie
 ms.service: azure-storage
 ms.topic: include
 ms.date: 08/03/2022
 ms.author: kendownie
 ms.custom: include file
---
Navigate to the storage account for which you would like to create a private endpoint. In the table of contents for the storage account, select **Networking**, **Private endpoint connections**, and then **+ Private endpoint** to create a new private endpoint.

[![Screenshot of the private endpoint connections item in the storage account table of contents.](media/storage-files-networking-endpoints-private-portal/create-private-endpoint-0.png)](media/storage-files-networking-endpoints-private-portal/create-private-endpoint-0.png#lightbox)

The resulting wizard has multiple pages to complete.

In the **Basics** blade, select the desired subscription, resource group, name, network interface name, and region for your private endpoint. These can be whatever you want, they don't have to match the storage account in any way, although you must create the private endpoint in the same region as the virtual network you wish to create the private endpoint in. Then select **Next: Resource**.

[![Screenshot showing how to provide the project and instance details for a new private endpoint.](media/storage-files-networking-endpoints-private-portal/private-endpoint-basics.png)](media/storage-files-networking-endpoints-private-portal/private-endpoint-basics.png#lightbox)

In the **Resource** blade, select **file** for the target sub-resource. Then select **Next: Virtual Network**.

[![Screenshot showing how to select which resource you would like to connect to using the new private endpoint.](media/storage-files-networking-endpoints-private-portal/private-endpoint-resource.png)](media/storage-files-networking-endpoints-private-portal/private-endpoint-resource.png#lightbox)

The **Virtual Network** blade allows you to select the specific virtual network and subnet you would like to add your private endpoint to. Select dynamic or static IP address allocation for the new private endpoint. If you select static, you'll also need to provide a name and a private IP address. You can also optionally specify an application security group. When you're finished, select **Next: DNS**.

[![Screenshot showing how to provide virtual network, subnet, and IP address details for the new private endpoint.](media/storage-files-networking-endpoints-private-portal/private-endpoint-virtual-network.png)](media/storage-files-networking-endpoints-private-portal/private-endpoint-virtual-network.png#lightbox)

The **DNS** blade contains the information for integrating your private endpoint with a private DNS zone. Make sure the subscription and resource group are correct, then select **Next: Tags**.

[![Screenshot showing how to integrate your private endpoint with a private DNS zone.](media/storage-files-networking-endpoints-private-portal/private-endpoint-dns.png)](media/storage-files-networking-endpoints-private-portal/private-endpoint-dns.png#lightbox)

You can optionally apply tags to categorize your resources, such as applying the name **Environment** and the value **Test** to all testing resources. Enter name/value pairs if desired, and then select **Next: Review + create**.

[![Screenshot showing how to optionally tag your private endpoint with name/value pairs for easy categorization.](media/storage-files-networking-endpoints-private-portal/private-endpoint-tags.png)](media/storage-files-networking-endpoints-private-portal/private-endpoint-tags.png#lightbox)

Click **Review + create** to create the private endpoint.
