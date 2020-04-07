---
title: Troubleshoot access, ingestion, and operation of your Azure Data Explorer cluster in your virtual network
description: Troubleshoot connectivity, ingestion, cluster creation, and operation of your Azure Data Explorer cluster in your virtual network
author: basaba
ms.author: basaba
ms.reviewer: orspodek
ms.service: data-explorer
ms.topic: conceptual
ms.date: 03/24/2020
---

# Troubleshoot access, ingestion, and operation of your Azure Data Explorer cluster in your virtual network

In this section you learn how to troubleshoot connectivity, operational, and cluster creation issues for a cluster that is deployed into your [Virtual Network](/azure/virtual-network/virtual-networks-overview).

## Access issues

If you have an issue while accessing cluster using the public (cluster.region.kusto.windows.net) or private (private-cluster.region.kusto.windows.net) endpoint and you suspect it's related to virtual network setup, perform the following steps to troubleshoot the issue.

### Check TCP connectivity

The first step includes checking TCP connectivity using Windows or Linux OS.

# [Windows](#tab/windows)

   1. Download [TCping](https://www.elifulkerson.com/projects/tcping.php) to the machine connecting to the cluster.
   2. Ping the destination from the source machine by using the following command:

    ```cmd
     C:\> tcping -t yourcluster.kusto.windows.net 443 
    
     ** Pinging continuously.  Press control-c to stop **
    
     Probing 1.2.3.4:443/tcp - Port is open - time=100.00ms
     ```

# [Linux](#tab/linux)

   1. Install *netcat* in the machine connecting to the cluster

    ```bash
    $ apt-get install netcat
     ```

   2. Ping the destination from the source machine by using the following command:

     ```bash
     $ netcat -z -v yourcluster.kusto.windows.net 443
    
     Connection to yourcluster.kusto.windows.net 443 port [tcp/https] succeeded!
     ```
---

If the test isn't successful, proceed with the following steps. If the test is successful, the issue isn't due to a TCP connectivity issue. Go to [operational issues](#cluster-creation-and-operations-issues) to troubleshoot further.

### Check the Network Security Group (NSG)

   Check that the [Network Security Group](/azure/virtual-network/security-overview) (NSG) attached to the cluster's subnet, has an inbound rule that allows access from the client machine's IP for port 443.

### Check route table

   If the cluster's subnet has force-tunneling setup to firewall (subnet with a [route table](/azure/virtual-network/virtual-networks-udr-overview) that contains the default route '0.0.0.0/0'), make sure that the machine IP address has a route with [next hop type](/azure/virtual-network/virtual-networks-udr-overview) to VirtualNetwork/Internet. This route is required to prevent asymmetric route issues.

## Ingestion issues

If you're experiencing ingestion issues and you suspect it's related to virtual network setup, perform the following steps.

### Check ingestion health

Check that the [cluster ingestion metrics](/azure/data-explorer/using-metrics#ingestion-health-and-performance-metrics) indicate a healthy state.

### Check security rules on data source resources

If the metrics indicate that no events were processed from the data source (*Events processed* metric for Event/IoT Hubs), make sure that the data source resources (Event Hub or Storage) allow access from cluster's subnet in the firewall rules or service endpoints.

### Check security rules configured on cluster's subnet

Make sure cluster's subnet has NSG, UDR, and firewall rules are properly configured. In addition, test network connectivity for all dependent endpoints. 

## Cluster creation and operations issues

If you're experiencing cluster creation or operation issues and you suspect it's related to virtual network setup, follow these steps to troubleshoot the issue.

### Diagnose the virtual network with the REST API

The [ARMClient](https://chocolatey.org/packages/ARMClient) is used to call the REST API using PowerShell. 

1. Log in with ARMClient

   ```powerShell
   armclient login
   ```

1. Invoke diagnose operation

    ```powershell
    $subscriptionId = '<subscription id>'
    $clusterName = '<name of cluster>'
    $resourceGroupName = '<resource group name>'
    $apiversion = '2019-11-09'
    
    armclient post "https://management.azure.com/subscriptions/$subscriptionId/resourceGroups/$resourceGroupName/providers/Microsoft.Kusto/clusters/$clusterName/diagnoseVirtualNetwork?api-version=$apiversion" -verbose
    ```

1. Check the response

    ```powershell
    HTTP/1.1 202 Accepted
    ...
    Azure-AsyncOperation: https://management.azure.com/subscriptions/{subscription-id}/providers/Microsoft.Kusto/locations/{location}/operationResults/{operation-id}?api-version=2019-11-09
    ...
    ```

1. Wait for operation completion

    ```powershell
    armclient get https://management.azure.com/subscriptions/$subscriptionId/providers/Microsoft.Kusto/locations/{location}/operationResults/{operation-id}?api-version=2019-11-09
    
    {
      "id": "/subscriptions/{subscription-id}/providers/Microsoft.Kusto/locations/{location}/operationresults/{operation-id}",
      "name": "{operation-name}",
      "status": "[Running/Failed/Completed]",
      "startTime": "{start-time}",
      "endTime": "{end-time}",
      "properties": {...}
    }
    ```
    
   Wait until the *status* property shows *Completed*, then the *properties* field should show:

    ```powershell
    {
      "id": "/subscriptions/{subscription-id}/providers/Microsoft.Kusto/locations/{location}/operationresults/{operation-id}",
      "name": "{operation-name}",
      "status": "Completed",
      "startTime": "{start-time}",
      "endTime": "{end-time}",
      "properties": {
        "Findings": [...]
      }
    }
    ```

If the *Findings* property shows an empty result, it means that all network tests passed and no connections are broken. If the following error is shown, *Outbound dependency '{dependencyName}:{port}' might be not satisfied (Outbound)*, the cluster can't reach the dependent service endpoints. Proceed with the following steps.

### Check Network Security Group (NSG)

Make sure that the [Network Security Group](/azure/virtual-network/security-overview) is configured properly per the instructions in [Dependencies for VNet deployment](/azure/data-explorer/vnet-deployment#dependencies-for-vnet-deployment)

### Check route table

If the cluster's subnet has force-tunneling set up to firewall (subnet with a [route table](/azure/virtual-network/virtual-networks-udr-overview) that contains the default route '0.0.0.0/0') make sure that the [management IP addresses](vnet-deployment.md#azure-data-explorer-management-ip-addresses)) and [health monitoring IP addresses](vnet-deployment.md#health-monitoring-addresses) have a route with [next hop type](/azure/virtual-network/virtual-networks-udr-overview##next-hop-types-across-azure-tools) *Internet*, and [source address prefix](/azure/virtual-network/virtual-networks-udr-overview#how-azure-selects-a-route) to *'management-ip/32'* and *'health-monitoring-ip/32'*. This route required to prevent asymmetric route issues.

### Check firewall rules

If you force tunnel subnet outbound traffic to a firewall, make sure all dependencies FQDN (for example, *.blob.core.windows.net*) are allowed in the firewall configuration as described in [securing outbound traffic with firewall](/azure/data-explorer/vnet-deployment#securing-outbound-traffic-with-firewall).
