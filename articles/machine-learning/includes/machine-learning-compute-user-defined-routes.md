---
author: Blackmist
ms.service: machine-learning
ms.topic: include
ms.date: 01/10/2023
ms.author: larryfr
---

> [!IMPORTANT]
> A compute instance or compute cluster without a public IP does not need inbound traffic from Azure Batch management and Azure Machine Learning services. However, if you have multiple computes and some of them use a public IP address, you will need to allow this traffic.

When using Azure Machine Learning __compute instance__ or __compute cluster__ (_with a public IP address_), allow inbound traffic from the Azure Machine Learning service. A compute instance or compute cluster _with no public IP_ (preview) __doesn't__ require this inbound communication. A Network Security Group allowing this traffic is dynamically created for you, however you may need to also create user-defined routes (UDR) if you have a firewall. When creating a UDR for this traffic, you can use either **IP Addresses** or **service tags** to route the traffic.

# [IP Address routes](#tab/ipaddress)

For the Azure Machine Learning service, you must add the IP address of both the __primary__ and __secondary__ regions. To find the secondary region, see the [Cross-region replication in Azure](/azure/availability-zones/cross-region-replication-azure). For example, if your Azure Machine Learning service is in East US 2, the secondary region is Central US. 

To get a list of IP addresses of the Azure Machine Learning service, download the [Azure IP Ranges and Service Tags](https://www.microsoft.com/download/details.aspx?id=56519) and search the file for `AzureMachineLearning.<region>`, where `<region>` is your Azure region.

> [!IMPORTANT]
> The IP addresses may change over time.

When creating the UDR, set the __Next hop type__ to __Internet__. This means the inbound communication from Azure skips your firewall to access the load balancers with public IPs of Compute Instance and Compute Cluster. UDR is required because Compute Instance and Compute Cluster will get random public IPs at creation, and you cannot know the public IPs before creation to register them on your firewall to allow the inbound from Azure to specific IPs for Compute Instance and Compute Cluster. The following image shows an example IP address based UDR in the Azure portal:

:::image type="content" source="./media/machine-learning-compute-user-defined-routes/user-defined-route.png" alt-text="Image of a user-defined route configuration":::

# [Service tag routes](#tab/servicetag)

Create user-defined routes for the `AzureMachineLearning` service tag.

The following command demonstrates adding a route for this service tag:

```azurecli
az network route-table route create -g MyResourceGroup --route-table-name MyRouteTable -n AzureMLRoute --address-prefix AzureMachineLearning --next-hop-type Internet
```

---

For information on configuring UDR, see [Route network traffic with a routing table](/azure/virtual-network/tutorial-create-route-table-portal).
