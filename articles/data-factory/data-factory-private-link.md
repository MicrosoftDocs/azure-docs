---
title: Azure Private Link for Azure Data Factory
description: Learn about how Azure Private Link works in Azure Data Factory.
ms.author: lle
author: lrtoyou1223
ms.service: data-factory
ms.subservice: integration-runtime
ms.topic: conceptual
ms.custom: seo-lt-2019, contperf-fy22q2
ms.date: 03/18/2022
---

# Azure Private Link for Azure Data Factory

[!INCLUDE[appliesto-adf-asa-md](includes/appliesto-adf-xxx-md.md)]

By using Azure private link, you can connect to various platforms as a service (PaaS) deployments in Azure via a private endpoint. A private endpoint is a private IP address within a specific virtual network and subnet. For a list of PaaS deployments that support private link functionality, see [Private Link documentation](../private-link/index.yml). 

## Secure communication between customer networks and Azure Data Factory 
You can set up an Azure virtual network as a logical representation of your network in the cloud. Doing so provides the following benefits:
* You help protect your Azure resources from attacks in public networks.
* You let the networks and data factory securely communicate with each other. 

You can also connect an on-premises network to your virtual network by setting up an Internet Protocol security (IPsec) VPN (site-to-site) connection or an Azure ExpressRoute (private peering) connection. 

You can also install a self-hosted integration runtime on an on-premises machine or a virtual machine in the virtual network. Doing so lets you:
* Run copy activities between a cloud data store and a data store in a private network.
* Dispatch transform activities against compute resources in an on-premises network or an Azure virtual network. 

Several communication channels are required between Azure data factory and the customer virtual network, as shown in the following table:

| Domain | Port | Description |
| ---------- | -------- | --------------- |
| `adf.azure.com` | 443 | Azure data factory portal, required by data factory authoring and monitoring. |
| `*.{region}.datafactory.azure.net` | 443 | Required by the self-hosted integration runtime to connect to the Data Factory service. |
| `*.servicebus.windows.net` | 443 | Required by the self-hosted integration runtime for interactive authoring. |
| `download.microsoft.com` | 443 | Required by the self-hosted integration runtime for downloading the updates. |

> [!NOTE]
> Disabling public network access is applicable only to the self-hosted integration runtime, not to Azure Integration Runtime and SQL Server Integration Services (SSIS) Integration Runtime.

The communications to Azure data factory service go through private link and help provide secure private connectivity. 

:::image type="content" source="./media/data-factory-private-link/private-link-architecture.png" alt-text="Diagram of Private Link for Azure Data Factory architecture.":::

Enabling the private link service for each of the preceding communication channels offers the following functionality:
- **Supported**:
   - You can author and monitor in the data factory portal from your virtual network, even if you block all outbound communications. It should be noted that even if you create a private endpoint for the portal, others can still access the Azure data factory portal through the public network.
   - The command communications between the self-hosted integration runtime and the Azure data factory service can be performed securely in a private network environment. The traffic between the self-hosted integration runtime and the Azure data factory service goes through private link. 
- **Not currently supported**:
   - Interactive authoring that uses a self-hosted integration runtime, such as test connection, browse folder list and table list, get schema, and preview data, goes through Private Link.
   - The new version of the self-hosted integration runtime that can be automatically downloaded from Microsoft Download Center if you enable Auto-Update, isn't supported at this time.
   
   > [!NOTE]
   > For functionality that's not currently supported, you still need to configure the previously mentioned domain and port in the virtual network or your corporate firewall. 

   > [!NOTE]
   > Connecting to Azure data factory via private endpoint is only applicable to self-hosted integration runtime in data factory. It is not supported for Azure Synapse.

> [!WARNING]
> If you enable private link in Azure data factory and block public access at the same time, it is recommended that you store your credentials in an Azure key vault to ensure they are secure.

## Steps to configure private endpoint for communication between self-hosted integration runtime and Azure data factory
This section will detail how to configure the private endpoint for communication between self-hosted integration runtime and Azure data factory.

**Step 1: Create a private endpoint and set up a private link for Azure data factory.**
The private endpoint is created in your virtual network for the communication between self-hosted integration runtime and Azure data factory service. Follow the details step in [Set up a private endpoint link for Azure Data Factory](#set-up-a-private-endpoint-link-for-azure-data-factory)

**Step 2: Make sure the DNS configuration is correct.**
Follow the instructions [DNS changes for private endpoints](#dns-changes-for-private-endpoints) to check or configure your DNS settings.

**Step 3: Put FQDNs of Azure Relay and download center into the allow list of your firewall.**
If your self-hosted integration runtime is installed on the virtual machine in your virtual network, allow outbound traffic to below FQDNs in the NSG of your virtual network.

If your self-hosted integration runtime is installed on the machine in your on-premises environment, please allow outbound traffic to below FQDNs in the firewall of your on-premises environment and NSG of your virtual network.

| Domain | Port | Description |
| ---------- | -------- | --------------- |
| `*.servicebus.windows.net` | 443 | Required by the self-hosted integration runtime for interactive authoring. |
| `download.microsoft.com` | 443 | Required by the self-hosted integration runtime for downloading the updates. |

> [!NOTE]
> If you don’t allow above outbound traffic in the firewall and NSG, self-hosted integration runtime is shown as limited status. But you can still use it to execute activities. Only interactive authoring and auto-update don’t work.

> [!NOTE]
> If one data factory (shared) has a self-hosted integration runtime and the self-hosted integration runtime is shared with other data factories (linked). You only need to create private endpoint for the shared data factory, other linked data factories can leverage this private link for the communications between self-hosted integration runtime and Azure data factory service.

## DNS changes for private endpoints
When you create a private endpoint, the DNS CNAME resource record for the data factory is updated to an alias in a subdomain with the prefix 'privatelink'. By default, we also create a [private DNS zone](../dns/private-dns-overview.md), corresponding to the 'privatelink' subdomain, with the DNS A resource records for the private endpoints.

When you resolve the data factory endpoint URL from outside the virtual network with the private endpoint, it resolves to the public endpoint of the data factory service. When resolved from the virtual network hosting the private endpoint, the storage endpoint URL resolves to the private endpoint's IP address.

For the illustrated example above, the DNS resource records for the data factory 'DataFactoryA', when resolved from outside the virtual network hosting the private endpoint, will be:

| Name | Type | Value |
| ---------- | -------- | --------------- |
| DataFactoryA.{region}.datafactory.azure.net |	CNAME	| < data factory service public endpoint > |
| < data factory service public endpoint >	| A | < data factory service public IP address > |

The DNS resource records for DataFactoryA, when resolved in the virtual network hosting the private endpoint, will be:

| Name | Type | Value |
| ---------- | -------- | --------------- |
| DataFactoryA.{region}.datafactory.azure.net | CNAME	| DataFactoryA.{region}.privatelink.datafactory.azure.net |
| DataFactoryA.{region}.privatelink.datafactory.azure.net	| A | < private endpoint IP address > |

If you're using a custom DNS server on your network, clients must be able to resolve the FQDN for the data factory endpoint to the private endpoint IP address. You should configure your DNS server to delegate your private link subdomain to the private DNS zone for the virtual network, or configure the A records for ' DataFactoryA.{region}.datafactory.azure.net' with the private endpoint IP address.
- [Name resolution for resources in Azure virtual networks](../virtual-network/virtual-networks-name-resolution-for-vms-and-role-instances.md#name-resolution-that-uses-your-own-dns-server)
- [DNS configuration for private endpoints](../private-link/private-endpoint-overview.md#dns-configuration)

 > [!NOTE]
   > There is currently only one Azure data factory portal endpoint and therefore only one private endpoint for portal in a DNS zone. Attempting to create a second or subsequent portal private endpoint will overwrite the previously created private DNS entry for portal.


## Set up a private endpoint link for Azure Data Factory

In this section, you'll set up a private endpoint link for Azure Data Factory.

You can choose whether to connect your Self-Hosted Integration Runtime (SHIR) to Azure Data Factory via public endpoint or private endpoint during the data factory creation step, shown here: 

:::image type="content" source="./media/data-factory-private-link/disable-public-access-shir.png" alt-text="Screenshot of blocking public access of Self-hosted Integration Runtime.":::

You can change the selection anytime after creation from the data factory portal page on the Networking blade.  After you enable private endpoints there, you must also add a private endpoint to the data factory.

A private endpoint requires a virtual network and subnet for the link. In this example, a virtual machine within the subnet will be used to run the Self-Hosted Integration Runtime (SHIR), connecting via the private endpoint link.

### Create the virtual network
If you don't have an existing virtual network to use with your private endpoint link, you must create a one, and assign a subnet.  

1. Sign into the Azure portal at https://portal.azure.com.
2. On the upper-left side of the screen, select **Create a resource > Networking > Virtual network** or search for **Virtual network** in the search box.

3. In **Create virtual network**, enter or select this information in the **Basics** tab:

    | **Setting**          | **Value**                                                           |
    |------------------|-----------------------------------------------------------------|
    | **Project Details**  |                                                                 |
    | Subscription     | Select your Azure subscription                                  |
    | Resource Group   | Select a resource group for your virtual network |
    | **Instance details** |                                                                 |
    | Name             | Enter a name for your virtual network |
    | Region           | IMPORTANT: Select the same region your private endpoint will use |

4. Select the **IP Addresses** tab or select the **Next: IP Addresses** button at the bottom of the page.

5. In the **IP Addresses** tab, enter this information:

    | Setting            | Value                      |
    |--------------------|----------------------------|
    | IPv4 address space | Enter **10.1.0.0/16** |

6. Under **Subnet name**, select the word **default**.

7. In **Edit subnet**, enter this information:

    | Setting            | Value                      |
    |--------------------|----------------------------|
    | Subnet name | Enter a name for your subnet |
    | Subnet address range | Enter **10.1.0.0/24** |

8. Select **Save**.

9. Select the **Review + create** tab or select the **Review + create** button.

10. Select **Create**.

### Create a virtual machine for the Self-Hosted Integration Runtime (SHIR)
You must also create or assign an existing virtual machine to run the Self-Hosted Integration Runtime in the new subnet created above.

1. On the upper-left side of the portal, select **Create a resource** > **Compute** > **Virtual machine** or search for **Virtual machine** in the search box.
   
2. In **Create a virtual machine**, type or select the values in the **Basics** tab:

    | Setting | Value                                          |
    |-----------------------|----------------------------------|
    | **Project Details** |  |
    | Subscription | Select your Azure subscription |
    | Resource Group | Select a resource group |
    | **Instance details** |  |
    | Virtual machine name | Enter a name for the virtual machine |
    | Region | Select the region used above for your virtual network |
    | Availability Options | Select **No infrastructure redundancy required** |
    | Image | Select **Windows Server 2019 Datacenter - Gen1** (or any other Windows image that supports the Self-Hosted Integration Runtime) |
    | Azure Spot instance | Select **No** |
    | Size | Choose VM size or take default setting |
    | **Administrator account** |  |
    | Username | Enter a username |
    | Password | Enter a password |
    | Confirm password | Reenter password |

3. Select the **Networking** tab, or select **Next: Disks**, then **Next: Networking**.
  
4. In the Networking tab, select or enter:

    | Setting | Value |
    |-|-|
    | **Network interface** |  |
    | Virtual network | Select the virtual network created above. |
    | Subnet | Select the subnet created above. |
    | Public IP | Select **None**. |
    | NIC network security group | **Basic**|
    | Public inbound ports | Select **None**. |
   
5. Select **Review + create**. 
  
6. Review the settings, and then select **Create**.

[!INCLUDE [ephemeral-ip-note.md](../../includes/ephemeral-ip-note.md)]

### Create the private endpoint 
Finally, you must create the private endpoint in your data factory.

1. On the Azure portal page for your data factory, select the **Networking** blade and the **Private endpoint connections** tab, and then select **+ Private endpoint**. 

:::image type="content" source="./media/data-factory-private-link/create-private-endpoint.png" alt-text="Screenshot of the Private endpoint connections pane for creating a private endpoint.":::

2. In the **Basics** tab of **Create a private endpoint**, enter, or select this information:

    | Setting | Value |
    | ------- | ----- |
    | **Project details** | |
    | Subscription | Select your subscription |
    | Resource group | Select a resource group |
    | **Instance details** |  |
    | Name  | Enter a name for your endpoint |
    | Region | Select the region of the virtual network created above |

3. Select the **Resource** tab or the **Next: Resource** button at the bottom of the page.
    
4. In **Resource**, enter or select this information:

    | Setting | Value |
    | ------- | ----- |
    | Connection method | Select **Connect to an Azure resource in my directory** |
    | Subscription | Select your subscription |
    | Resource type | Select **Microsoft.Datafactory/factories** |
    | Resource | Select your data factory |
    | Target sub-resource | If you want to use the private endpoint for command communications between the self-hosted integration runtime and the Azure Data Factory service, select **datafactory** as **Target sub-resource**. If you want to use the private endpoint for authoring and monitoring the data factory in your virtual network, select **portal** as **Target sub-resource**.|

5. Select the **Configuration** tab or the **Next: Configuration** button at the bottom of the screen.

6. In **Configuration**, enter or select this information:

    | Setting | Value |
    | ------- | ----- |
    | **Networking** |  |
    | Virtual network | Select the virtual network created above. |
    | Subnet | Select the subnet created above. |
    | **Private DNS integration** |  |
    | Integrate with private DNS zone | Leave the default of **Yes**. |
    | Subscription | Select your subscription. |
    | Private DNS zones | Leave the default value in both Target sub-resources:  1. datafactory: **(New) privatelink.datafactory.azure.net**. 2. portal: **(New) privatelink.adf.azure.com**.|
    

7. Select **Review + create**.

8. Select **Create**.


## Restrict access for data factory resources using private link
If you want to restrict access for data factory resources in your subscriptions by private link, please follow [Use portal to create private link for managing Azure resources](../azure-resource-manager/management/create-private-link-access-portal.md?source=docs)


## Known issue
You're unable to access each other PaaS Resource when both sides are exposed to private Link and private endpoint. This is a known limitation of private link and private endpoint. 
For example, if A is using a private link to access the portal of data factory A in virtual network A. When data factory A doesn’t block public access, B can access the portal of data factory A in virtual network B via public. But when customer B creates a private endpoint against data factory B in virtual network B, then customer B can’t access data factory A via public in virtual network B anymore.


## Next steps

- [Create a data factory by using the Azure Data Factory UI](quickstart-create-data-factory-portal.md)
- [Introduction to Azure Data Factory](introduction.md)
- [Visual authoring in Azure Data Factory](author-visually.md)