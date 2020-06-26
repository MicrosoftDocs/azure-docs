---
title: Configure outbound network traffic restriction - Azure HDInsight
description: Learn how to configure outbound network traffic restriction for Azure HDInsight clusters.
author: hrasheed-msft
ms.author: hrasheed
ms.reviewer: jasonh
ms.service: hdinsight
ms.topic: conceptual
ms.custom: seoapr2020
ms.date: 04/17/2020
---

# Configure outbound network traffic for Azure HDInsight clusters using Firewall

This article provides the steps for you to secure outbound traffic from your HDInsight cluster using Azure Firewall. The steps below assume you're configuring an Azure Firewall for an existing cluster. If you're deploying a new cluster behind a firewall, create your HDInsight cluster and subnet first. Then follow the steps in this guide.

## Background

HDInsight clusters are normally deployed in a virtual network. The cluster has dependencies on services outside of that virtual network.

There are several dependencies that require inbound traffic. The inbound management traffic can't be sent through a firewall device. The source addresses for this traffic are known and are published [here](hdinsight-management-ip-addresses.md). You can also create Network Security Group (NSG) rules with this information to secure inbound traffic to the clusters.

The HDInsight outbound traffic dependencies are almost entirely defined with FQDNs. Which don't have static IP addresses behind them. The lack of static addresses means Network Security Groups (NSGs) can't lock down outbound traffic from a cluster. The addresses change often enough one can't set up rules based on the current name resolution and use.

Secure outbound addresses with a firewall that can control outbound traffic based on domain names. Azure Firewall restricts outbound traffic based on the FQDN of the destination or [FQDN tags](../firewall/fqdn-tags.md).

## Configuring Azure Firewall with HDInsight

A summary of the steps to lock down egress from your existing HDInsight with Azure Firewall are:

1. Create a subnet.
1. Create a firewall.
1. Add application rules to the firewall
1. Add network rules to the firewall.
1. Create a routing table.

### Create new subnet

Create a subnet named **AzureFirewallSubnet** in the virtual network where your cluster exists.

### Create a new firewall for your cluster

Create a firewall named **Test-FW01** using the steps in **Deploy the firewall** from [Tutorial: Deploy and configure Azure Firewall using the Azure portal](../firewall/tutorial-firewall-deploy-portal.md#deploy-the-firewall).

### Configure the firewall with application rules

Create an application rule collection that allows the cluster to send and receive important communications.

1. Select the new firewall **Test-FW01** from the Azure portal.

1. Navigate to **Settings** > **Rules** > **Application rule collection** > **+ Add application rule collection**.

    ![Title: Add application rule collection](./media/hdinsight-restrict-outbound-traffic/hdinsight-restrict-outbound-traffic-add-app-rule-collection.png)

1. On the **Add application rule collection** screen, provide the following information:

    **Top section**

    | Property|  Value|
    |---|---|
    |Name| FwAppRule|
    |Priority|200|
    |Action|Allow|

    **FQDN tags section**

    | Name | Source address | FQDN tag | Notes |
    | --- | --- | --- | --- |
    | Rule_1 | * | WindowsUpdate and HDInsight | Required for HDI services |

    **Target FQDNs section**

    | Name | Source addresses | `Protocol:Port` | Target FQDNS | Notes |
    | --- | --- | --- | --- | --- |
    | Rule_2 | * | https:443 | login.windows.net | Allows Windows login activity |
    | Rule_3 | * | https:443 | login.microsoftonline.com | Allows Windows login activity |
    | Rule_4 | * | https:443,http:80 | storage_account_name.blob.core.windows.net | Replace `storage_account_name` with your actual storage account name. If your cluster is backed by WASB, then add a rule for WASB. To use ONLY https connections, make sure ["secure transfer required"](../storage/common/storage-require-secure-transfer.md) is enabled on the storage account. |

   ![Title: Enter application rule collection details](./media/hdinsight-restrict-outbound-traffic/hdinsight-restrict-outbound-traffic-add-app-rule-collection-details.png)

1. Select **Add**.

### Configure the firewall with network rules

Create the network rules to correctly configure your HDInsight cluster.

1. Continuing from the prior step, navigate to **Network rule collection** > **+ Add network rule collection**.

1. On the **Add network rule collection** screen, provide the following information:

    **Top section**

    | Property|  Value|
    |---|---|
    |Name| FwNetRule|
    |Priority|200|
    |Action|Allow|

    **IP Addresses section**

    | Name | Protocol | Source addresses | Destination addresses | Destination ports | Notes |
    | --- | --- | --- | --- | --- | --- |
    | Rule_1 | UDP | * | * | 123 | Time service |
    | Rule_2 | Any | * | DC_IP_Address_1, DC_IP_Address_2 | * | If you're using Enterprise Security Package (ESP), then add a network rule in the IP Addresses section that allows communication with AAD-DS for ESP clusters. You can find the IP addresses of the domain controllers on the AAD-DS section in the portal |
    | Rule_3 | TCP | * | IP Address of your Data Lake Storage account | * | If you're using Azure Data Lake Storage, then you can add a network rule in the IP Addresses section to address an SNI issue with ADLS Gen1 and Gen2. This option will route the traffic to firewall. Which might result in higher costs for large data loads but the traffic will be logged and auditable in firewall logs. Determine the IP address for your Data Lake Storage account. You can use a PowerShell command such as `[System.Net.DNS]::GetHostAddresses("STORAGEACCOUNTNAME.blob.core.windows.net")` to resolve the FQDN to an IP address.|
    | Rule_4 | TCP | * | * | 12000 | (Optional) If you're using Log Analytics, then create a network rule in the IP Addresses section to enable communication with your Log Analytics workspace. |

    **Service Tags section**

    | Name | Protocol | Source Addresses | Service Tags | Destination Ports | Notes |
    | --- | --- | --- | --- | --- | --- |
    | Rule_7 | TCP | * | SQL | 1433 | Configure a network rule in the Service Tags section for SQL that will allow you to log and audit SQL traffic. Unless you configured Service Endpoints for SQL Server on the HDInsight subnet, which will bypass the firewall. |
    | Rule_8 | TCP | * | Azure Monitor | * | (optional) Customers who plan to use auto scale feature should add this rule. |
    
   ![Title: Enter application rule collection](./media/hdinsight-restrict-outbound-traffic/hdinsight-restrict-outbound-traffic-add-network-rule-collection.png)

1. Select **Add**.

### Create and configure a route table

Create a route table with the following entries:

* All IP addresses from [Health and management services: All regions](../hdinsight/hdinsight-management-ip-addresses.md#health-and-management-services-all-regions) with a next hop type of **Internet**.

* Two IP addresses for the region where the cluster is created from [Health and management services: Specific regions](../hdinsight/hdinsight-management-ip-addresses.md#health-and-management-services-specific-regions) with a next hop type of **Internet**.

* One Virtual Appliance route for IP address 0.0.0.0/0 with the next hop being your Azure Firewall private IP address.

For example, to configure the route table for a cluster created in the US region of "East US", use following steps:

1. Select your Azure firewall **Test-FW01**. Copy the **Private IP address** listed on the **Overview** page. For this example, we'll use a **sample address of 10.0.2.4**.

1. Then navigate to **All services** > **Networking** > **Route tables** and **Create Route Table**.

1. From your new route, navigate to **Settings** > **Routes** > **+ Add**. Add the following routes:

| Route name | Address prefix | Next hop type | Next hop address |
|---|---|---|---|
| 168.61.49.99 | 168.61.49.99/32 | Internet | NA |
| 23.99.5.239 | 23.99.5.239/32 | Internet | NA |
| 168.61.48.131 | 168.61.48.131/32 | Internet | NA |
| 138.91.141.162 | 138.91.141.162/32 | Internet | NA |
| 13.82.225.233 | 13.82.225.233/32 | Internet | NA |
| 40.71.175.99 | 40.71.175.99/32 | Internet | NA |
| 0.0.0.0 | 0.0.0.0/0 | Virtual appliance | 10.0.2.4 |

Complete the route table configuration:

1. Assign the route table you created to your HDInsight subnet by selecting **Subnets** under **Settings**.

1. Select **+ Associate**.

1. On the **Associate subnet** screen, select the virtual network that your cluster was created into. And the **Subnet** you used for your HDInsight cluster.

1. Select **OK**.

## Edge-node or custom application traffic

The above steps will allow the cluster to operate without issues. You still need to configure dependencies to accommodate your custom applications running on the edge-nodes, if applicable.

Application dependencies must be identified and added to the Azure Firewall or the route table.

Routes must be created for the application traffic to avoid asymmetric routing issues.

If your applications have other dependencies, they need to be added to your Azure Firewall. Create Application rules to allow HTTP/HTTPS traffic and Network rules for everything else.

## Logging and scale

Azure Firewall can send logs to a few different storage systems. For instructions on configuring logging for your firewall, follow the steps in [Tutorial: Monitor Azure Firewall logs and metrics](../firewall/tutorial-diagnostics.md).

Once you've completed the logging setup, if you're using Log Analytics, you can view blocked traffic with a query such as:

```Kusto
AzureDiagnostics | where msg_s contains "Deny" | where TimeGenerated >= ago(1h)
```

Integrating Azure Firewall with Azure Monitor logs is useful when first getting an application working. Especially when you aren't aware of all of the application dependencies. You can learn more about Azure Monitor logs from [Analyze log data in Azure Monitor](../azure-monitor/log-query/log-query-overview.md)

To learn about the scale limits of Azure Firewall and request increases, see [this](../azure-resource-manager/management/azure-subscription-service-limits.md#azure-firewall-limits) document or refer to the [FAQs](../firewall/firewall-faq.md).

## Access to the cluster

After having the firewall set up successfully, you can use the internal endpoint (`https://CLUSTERNAME-int.azurehdinsight.net`) to access the Ambari from inside the virtual network.

To use the public endpoint (`https://CLUSTERNAME.azurehdinsight.net`) or ssh endpoint (`CLUSTERNAME-ssh.azurehdinsight.net`), make sure you have the right routes in the route table and NSG rules to avoid the asymmetric routing issue explained [here](../firewall/integrate-lb.md). Specifically in this case, you need to allow the client IP address in the Inbound NSG rules and also add it to the user-defined route table with the next hop set as `internet`. If the routing isn't set up correctly, you'll see a timeout error.

## Next steps

* [Azure HDInsight virtual network architecture](hdinsight-virtual-network-architecture.md)
* [Configure network virtual appliance](./network-virtual-appliance.md)
