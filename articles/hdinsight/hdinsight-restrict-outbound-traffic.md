---
title: Configure outbound traffic restriction for Azure HDInsight clusters
description: Learn how to configure outbound traffic restriction for Azure HDInsight clusters
services: hdinsight
ms.service: hdinsight
author: hrasheed-msft
ms.author: hrasheed
ms.reviewer: jasonh
ms.topic: howto
ms.date: 05/06/2019
---
# Configure outbound traffic restriction for Azure HDInsight clusters

Azure HDInsight clusters have several external dependencies that it requires network access to function properly. The cluster usually lives in the customer specified virtual network.

There are several inbound dependencies. The inbound management traffic cannot be sent through a firewall device. The source addresses for this traffic are known and are published [here](hdinsight-extend-hadoop-virtual-network.md#hdinsight-ip). You can also create Network Security Group(NSG) rules with this information to secure inbound traffic to the clusters.

The HDInsight outbound dependencies are almost entirely defined with FQDNs, which don't have static IP addresses behind them. The lack of static addresses means that Network Security Groups (NSGs) can't be used to lock down the outbound traffic from a cluster. The addresses change often enough that one can't set up rules based on the current resolution and use that to set up NSG rules.

The solution to securing outbound addresses lies in use of a firewall device that can control outbound traffic based on domain names. Azure Firewall can restrict outbound HTTP and HTTPS traffic based on the FQDN of the destination.

> [!Important]
> Change the picture to show HDInsight cluster
![Title: ASE with Azure Firewall connection flow](./media/hdinsight-restrict-outbound-traffic/image002.png)

## Configuring Azure Firewall with HDInsight

A summary of the steps to lock down egress from your existing HDInsight with Azure Firewall are:
1. Enable service endpoints.
1. Create a firewall.
1. Add application rules to the firewall
1. Add network rules to the firewall.
1. Create a routing table.

### Enable service endpoints

If you want to bypass the firewall(e.g. to save cost on data transfer) then you can enable service endpoints for SQL and storage on your HDInsight subnet. When you have service endpoints enabled to Azure SQL, any Azure SQL dependencies that your cluster has must be configured with service endpoints as well.

To enable the correct service endpoints, complete the following steps:

1. Sign in to the Azure portal and select the virtual network that your HDInsight cluster is deployed in.
1. Select **Subnets** under **Settings**.
1. Select the subnet where your cluster is deployed.
1. On the screen to edit the subnet settings, click **Microsoft.SQL** and/or **Microsoft.Storage** from the **Service endpoints** > **Services** dropdown box.
1. If you are using an ESP cluster, then you must also select the **Microsoft.AzureActiveDirectory** service endpoint.
1. Click **Save**.

    ![Title: Add service endpoints](./media/hdinsight-restrict-outbound-traffic/hdinsight-restrict-outbound-traffic-add-service-endpoint.png)

### Create a new firewall for your cluster

1. Create a subnet named **AzureFirewallSubnet** in the virtual network where your cluster exists. 
1. Create a new firewall **Test-FW01** using the steps in [Tutorial: Deploy and configure Azure Firewall using the Azure portal](../firewall/tutorial-firewall-deploy-portal.md#deploy-the-firewall).
1. Select the new firewall from the Azure portal. Click **Rules** under **Settings** > **Application rule collection** > **Add application rule collection**.

    ![Title: Add application rule collection](./media/hdinsight-restrict-outbound-traffic/hdinsight-restrict-outbound-traffic-add-app-rule-collection.png)

### Configure the firewall with application rules

Create an application rule collection that allows the cluster to send and receive important communications.

Select the new firewall **Test-FW01** from the Azure portal. Click **Rules** under **Settings** > **Application rule collection** > **Add application rule collection**.

On the **Add application rule collection** screen, complete the following steps:

1. Enter a **Name**, **Priority**, and click **Allow** from the **Action** dropdown menu.
1. Add the following rules:
    1. A rule to allow HDInsight and Windows Update traffic:
        1. In the **FQDN tags** section, provide a **Name**, and set **Source addresses** to `*`.
        1. Select **HDInsight** and the **WindowsUpdate** from the **FQDN Tags** dropdown menu.
    1. A rule to allow Windows login activity:
        1. In the **Target FQDNs** section, provide a **Name**, and set **Source addresses** to `*`.
        1. Enter `https:443` under **Protocol:Port** and `login.windows.net` under **Target FQDNS**.
    1. A rule to allow SQM telemetry:
        1. In the **Target FQDNs** section, provide a **Name**, and set **Source addresses** to `*`.
        1. Enter `https:443` under **Protocol:Port** and `sqm.telemetry.microsoft.com` under **Target FQDNS**.
    1. If your cluster is backed by WASB and you are not using the service endpoints above, then add a rule for WASB:
        1. In the **Target FQDNs** section, provide a **Name**, and set **Source addresses** to `*`.
        1. Enter `wasb` under **Protocol:Port** and `*` under **Target FQDNS**.
1. Click **Add**.

![Title: Enter application rule collection details](./media/hdinsight-restrict-outbound-traffic/hdinsight-restrict-outbound-traffic-add-app-rule-collection-details.png)

### Configure the firewall with network rules

Create the network rules to correctly configure your HDInsight cluster.

> [!Important]
> Optionally, select SQL service tags in the firewall instead of SQL sevice endpoints described earlier earlier. If you use SQL tags in firewall you can log and audit sql traffic as well.

1. Select the new firewall **Test-FW01** from the Azure portal.
1. Click **Rules** under **Settings** > **Network rule collection** > **Add network rule collection**.
1. On the **Add network rule collection** screen, enter a **Name**, **Priority**, and click **Allow** from the **Action** dropdown menu.
1. Create the following rules:
    1. A network rule that allows the cluster to perform clock sync using NTP.
        1. In the **Rules** section, provide a **Name** and select **Any** from the **Protocol** dropdown.
        1. Set **Source Addresses** and **Destination addresses** to `*`.
        1. Set **Destination Ports** to 123.
    1. If you are using Enterprise Security Package (ESP), then add a network rule that allows communication with AAD-DS for ESP clusters.
        1. Determine the two IP addresses for your domain controllers.
        1. In the next row in the **Rules** section, provide a **Name** and select **Any** from the **Protocol** dropdown.
        1. Set **Source Addresses** `*`.
        1. Enter all of the IP addresses for your domain controllers in **Destination addresses** separated by commas.
        1. Set **Destination Ports** to `*`.
    1. If you are using Azure Data Lake Storage, then you can add a network rule to address an SNI issue with ADLS Gen1 and Gen2. This option will route the traffic to firewall which might result in higher costs for large data loads but the traffic will be logged and auditable.
        1. Determine the IP address for your Data Lake Storage account.
        1. In the next row in the **Rules** section, provide a **Name** and select **Any** from the **Protocol** dropdown.
        1. Set **Source Addresses** `*`.
        1. Enter the IP addresses for your storage account in **Destination addresses**.
        1. Set **Destination Ports** to `*`.
    1. A network rule to enable communication with the Key Management Service for Windows Activation.
        1. In the next row in the **Rules** section, provide a **Name** and select **Any** from the **Protocol** dropdown.
        1. Set **Source Addresses** `*`.
        1. Set **Destination addresses** to `*`.
        1. Set **Destination Ports** to `1688`.
    1. If you are using Log Analytics, then create a network rule to enable communication with your Log Analytics workspace.
        1. In the next row in the **Rules** section, provide a **Name** and select **Any** from the **Protocol** dropdown.
        1. Set **Source Addresses** `*`.
        1. Set **Destination addresses** to `*`.
        1. Set **Destination Ports** to `12000`.
1. Click **Add** to complete creation of your network rule collection.

![Title: Enter application rule collection details](./media/hdinsight-restrict-outbound-traffic/hdinsight-restrict-outbound-traffic-add-network-rule-collection.png)

### Create and configure a route table

Create a route table with the following entries:

1. Seven addresses from [this list of required HDInsight management IP addresses](../hdinsight/hdinsight-extend-hadoop-virtual-network.md#hdinsight-ip) with a next hop of Internet:
    1. Four IP addresses for all clusters in all regions
    1. Two IP addresses that are specific for the region where the cluster is created
    1. One IP address for Azure's recursive resolver
1. One Virtual Appliance route for IP address 0.0.0.0/0 with the next hop being your Azure Firewall private IP address.

For example, to configure the route table for a cluster created in the US region of "Central US", use following steps:

1. Sign in to the Azure portal.
1. Select your Azure firewall **Test-FW01**. Copy the **Private IP address** listed on the **Overview** page.
1. Create a new route table.
1. Click **Routes** under **Settings**.
1. Click **Add** to create routes for the IP addresses in the table below.

| Route name | Address prefix | Next hop type | Next hop address |
|---|---|---|
| 168.61.49.99 | 168.61.49.99/32 | Internet | NA |
| 23.99.5.239 | 23.99.5.239/32 | Internet | NA |
| 168.61.48.131 | 168.61.48.131/32 | Internet | NA |
| 138.91.141.162 | 138.91.141.162/32 | Internet | NA |
| 13.67.223.215 | 13.67.223.215/32 | Internet | NA |
| 40.86.83.253 | 40.86.83.253/32 | Internet | NA |
| 168.63.129.16 | 168.63.129.16/32 | Internet | NA |
| 0.0.0.0 | 0.0.0.0/0 | Virtual appliance | <Azure firewall private IP> |

![Title: Creating a route table](./media/hdinsight-restrict-outbound-traffic/hdinsight-restrict-outbound-traffic-add-route-table.png)

1. Complete the route table configuration:

    1. Assign the route table you created to your HDInsight subnet by clicking **Subnets** under **Settings** and then **Associate**.
    1. On the **Associate subnet** screen, select the virtual network that your cluster was created into and the **AzureFirewallSubnet** that you created for use with your firewall.
    1. Click **OK**.

![Title: Creating a route table](./media/hdinsight-restrict-outbound-traffic/hdinsight-restrict-outbound-traffic-route-table-associate-subnet.png)

## Deploying HDInsight behind a firewall

The steps to deploy a NEW cluster behind a firewall are the same as configuring your existing HDInsight cluster with an Azure Firewall except you will need to create your HDInsight subnet and then follow the previous steps.

## Edge-node application traffic

The above steps will allow the cluster to operate without issues. You still need to configure dependencies to accommodate your custom applications running on the edge-nodes, if applicable.

Application dependencies must be identified and added to the Azure Firewall or the route table.

Routes must be created for the application traffic to avoid asymmetric routing issues.

If your applications have other dependencies, they need to be added to your Azure Firewall. Create Application rules to allow HTTP/HTTPS traffic and Network rules for everything else.

## Logging
>[!Important]
>The instructions in this section are unclear. Should the user go to **Firewall** > **Diagnostic settings** > **Turn on diagnostics**?

Azure Firewall can send logs to Azure Storage, Event Hub, or Azure Monitor logs. To integrate your app with any supported destination, complete the following steps:

1. Go the Azure Firewall portal > Diagnostic Logs and enable the logs for your desired destination. If you integrate with Azure log Analytics, then you can see logging for any traffic sent to Azure Firewall. 
1. To see the traffic that is being denied, open your Log Analytics workspace portal > Logs and enter a query such as the following:

```
AzureDiagnostics | where msg_s contains "Deny" | where TimeGenerated >= ago(1h)
```

Integrating your Azure Firewall with Azure Monitor logs is useful when first getting an application working when you are not aware of all of the application dependencies. You can learn more about Azure Monitor logs from [Analyze log data in Azure Monitor](../azure-monitor/log-query/log-query-overview.md)

## Dependencies

The following information is ONLY required if you wish to configure a network virtual appliance(NVA) other than Azure Firewall.

* Service Endpoint capable services should be configured with service endpoints.
* IP Address dependencies are for non-HTTP/S traffic (both TCP and UDP traffic)
* FQDN HTTP/HTTPS endpoints can be placed in your NVA device.
* Wildcard HTTP/HTTPS endpoints are dependencies that can vary based on a number of qualifiers.
* Assign the route table you created to your HDInsight subnet.

### Service Endpoint capable dependencies

| **Endpoint** |
|---|
| Azure SQL |
| Azure Storage |
| Azure Active Directory |

#### IP Address dependencies

| **Endpoint** | **Details** |
|---|---|
| \*:123 | NTP clock check. Traffic is checked at multiple endpoints on port 123 |
| IPs published [here](hdinsight-extend-hadoop-virtual-network.md#hdinsight-ip) | These are HDInsight service |
| AAD-DS private IPs for ESP clusters |
| \*:16800 for KMS Windows Activation |
| \*12000 for Log Analytics |

With an Azure Firewall, you automatically get everything below configured with the FQDN tags.

#### FQDN HTTP/HTTPS dependencies

| **Endpoint**                                                          |
|---|
| azure.archive.ubuntu.com:80                                           |
| security.ubuntu.com:80                                                |
| ocsp.msocsp.com:80                                                    |
| ocsp.digicert.com:80                                                  |
| The full list is here [https://msdata.visualstudio.com/HDInsight/_git/HDInsight-Main?path=%2Ftools%2FHDInsightFQDNTag%2FHDInsightFQDNTags.json&version=GBdeveloper]

>[!Important]
>We should replicate this file (contains 14000 FQDNs), store it somewhere and link to it here

| **Endpoint**                                                          |
|---|
| wawsinfraprodbay063.blob.core.windows.net:443                         |
| registry-1.docker.io:443                                              |
| auth.docker.io:443                                                    |
| production.cloudflare.docker.com:443                                  |
| download.docker.com:443                                               |
| us.archive.ubuntu.com:80                                              |
| download.mono-project.com:80                                          |
| packages.treasuredata.com:80                                          |
| security.ubuntu.com:80                                                |
| azure.archive.ubuntu.com:80                                                |
| ocsp.msocsp.com:80                                                |
| ocsp.digicert.com:80                                                |

## Next steps

* [Azure HDInsight virtual network architecture](https://docs.microsoft.com/en-us/azure/hdinsight/hdinsight-virtual-network-architecture)
