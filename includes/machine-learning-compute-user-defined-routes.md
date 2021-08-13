---
author: Blackmist
ms.service: machine-learning
ms.topic: include
ms.date: 08/12/2021
ms.author: larryfr
---

When using Azure Machine Learning __compute instance__ or __compute cluster__, allow inbound traffic from Azure Batch management and Azure Machine Learning services. When creating the user-defined routes for this traffic, you can use either **IP Addresses** or **service tags** to route the traffic.

> [!IMPORTANT]
> Using service tags with user-defined routes is currently in preview and may not be fully supported. For more information, see [Virtual Network routing](/azure/virtual-network/virtual-networks-udr-overview.md#service-tags-for-user-defined-routes-preview).

# [IP Address routes](#tab/ipaddress)

For the Azure Machine Learning service, you must add the IP address of both the __primary__ and __secondary__ regions. To find the secondary region, see the [Ensure business continuity & disaster recovery using Azure Paired Regions](/azure/best-practices-availability-paired-regions.md#azure-regional-pairs). For example, if your Azure Machine Learning service is in East US 2, the secondary region is Central US. 

To get a list of IP addresses of the Batch service and Azure Machine Learning service, use one of the following methods:

* Download the [Azure IP Ranges and Service Tags](https://www.microsoft.com/download/details.aspx?id=56519) and search the file for `BatchNodeManagement.<region>` and `AzureMachineLearning.<region>`, where `<region>` is your Azure region.

* Use the [Azure CLI](/cli/azure/install-azure-cli) to download the information. The following example downloads the IP address information and filters out the information for the East US 2 region (primary) and Central US region (secondary):

    ```azurecli-interactive
    az network list-service-tags -l "East US 2" --query "values[?starts_with(id, 'Batch')] | [?properties.region=='eastus2']"
    # Get primary region IPs
    az network list-service-tags -l "East US 2" --query "values[?starts_with(id, 'AzureMachineLearning')] | [?properties.region=='eastus2']"
    # Get secondary region IPs
    az network list-service-tags -l "Central US" --query "values[?starts_with(id, 'AzureMachineLearning')] | [?properties.region=='centralus']"
    ```

    > [!TIP]
    > If you are using the US-Virginia, US-Arizona regions, or China-East-2 regions, these commands return no IP addresses. Instead, use one of the following links to download a list of IP addresses:
    >
    > * [Azure IP ranges and service tags for Azure Government](https://www.microsoft.com/download/details.aspx?id=57063)
    > * [Azure IP ranges and service tags for Azure China](https://www.microsoft.com//download/details.aspx?id=57062)

> [!IMPORTANT]
> The IP addresses may change over time.

When creating the UDR, set the __Next hop type__ to __Internet__. The following image shows an example IP address based UDR in the Azure portal:

:::image type="content" source="./media/machine-learning-compute-user-defined-routes/user-defined-route.png" alt-text="Image of a user-defined route configuration":::

# [Service tag routes](#tab/servicetag)

Create user-defined routes for the following service tags:

* `AzureMachineLearning`
* `BatchNodeManagement.<region>`, where `<region>` is your Azure region.

The following commands demonstrate adding routes for these service tags:

```azurecli
az network route-table route create -g MyResourceGroup --route-table-name MyRouteTable -n AzureMLRoute --address-prefix AzureMachineLearning --next-hop-type Internet
az network route-table route create -g MyResourceGroup --route-table-name MyRouteTable -n BatchRoute --address-prefix BatchNodeManagement.westus2 --next-hop-type Internet
```

---

For information on configuring UDR, see [Route network traffic with a routing table](/azure/virtual-network/tutorial-create-route-table-portal.md).