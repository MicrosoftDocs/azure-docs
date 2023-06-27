---
title: Configure service endpoint policies - Azure HDInsight
description: Learn how to configure service endpoint policies for your virtual network with Azure HDInsight.
ms.service: hdinsight
ms.custom: devx-track-azurepowershell, devx-track-azurecli
ms.topic: how-to
ms.date: 12/21/2022
---

# Configure virtual network service endpoint policies for Azure HDInsight

This article provides information about how to implement service endpoint policies on virtual networks with Azure HDInsight.

## Background

Azure HDInsight allows you to create clusters in your own virtual network. If you need to allow outgoing traffic from your virtual network to other Azure services like storage accounts, you can create [service endpoint policies](../virtual-network/virtual-network-service-endpoint-policies-overview.md). Service endpoint policies that are created through the Azure portal, however, only allow you to create a policy for a single account, all accounts in a subscription, or all accounts in a resource group.

As a managed service, however, Azure HDInsight collects data and log files from each cluster in specific storage accounts in each region. In order for this data to reach HDInsight from your virtual network, it's necessary for you to create service endpoint policies that allow outgoing traffic to specific data collection points managed by Azure HDInsight.

## Service endpoint policies for HDInsight

These service endpoint policies support the following functionality:

- Collection of logs and telemetry on cluster creation, job execution, and platform operations such as scaling.
- Attaching virtual hard disks (VHDs) to newly created cluster nodes for provisioning software and libraries on your cluster.

If service endpoint policies are not created to enable this flow of data, cluster creation may fail and Azure HDInsight will be unable to provide support for your clusters.

## Create service endpoint policies for HDInsight

Ensure that the correct service endpoint policies are attached to your virtual network before creating new clusters. Otherwise the cluster creation may fail or result in error.

Use the following process to create the necessary service endpoint policies:

1. Decide the region where you will be creating your HDInsight cluster.
1. Look up that region in the [list of service endpoint policy resources](https://github.com/Azure-Samples/hdinsight-enterprise-security/blob/main/hdinsight-service-endpoint-policy-resources.json), which gives all of the resource groups for HDInsight management storage accounts.
1. Select the list of resource groups for your region. An example of the resources for `Canada Central` is shown below:

    ```json
    "Canada Central":[
        "/subscriptions/235d341f-7fb9-435c-9bdc-034b7306c9b4/resourceGroups/Default-Storage-WestUS",
        "/subscriptions/da0c4c68-9283-4f88-9c35-18f7bd72fbdd/resourceGroups/GenevaWarmPathManageRG",
        "/subscriptions/6a853a41-3423-4167-8d9c-bcf37dc72818/resourceGroups/GenevaWarmPathManageRG",
        "/subscriptions/c8845df8-14d1-4a46-b6dd-e0c44ae400b0/resourceGroups/Default-Storage-CanadaCentral",
        "/subscriptions/c8845df8-14d1-4a46-b6dd-e0c44ae400b0/resourceGroups/cancstorage",
        "/subscriptions/c8845df8-14d1-4a46-b6dd-e0c44ae400b0/resourceGroups/GenevaWarmPathManageRG",
        "/subscriptions/fb3429ab-83d0-4bed-95e9-1a8e9455252c/resourceGroups/DistroStorageRG/providers/Microsoft.Storage/storageAccounts/hdi31distrorelease",
        "/subscriptions/fb3429ab-83d0-4bed-95e9-1a8e9455252c/resourceGroups/DistroStorageRG/providers/Microsoft.Storage/storageAccounts/bigdatadistro"
    ],
    ```

1. Insert that list of resource groups into the setup script written in Azure CLI or Azure PowerShell.

    ```azurecli
    $subscriptionId = "<subscription id>"
    $rgName="<resource group name> "
    $location="<location name>"
    $vnetName="<vnet name>"
    $subnetName="<subnet name>"
    $sepName="<service endpoint policy name>"
    $sepDefName="<service endpoint policy definition name>"
    
    # Set to the right subscription ID
    az account set --subscription $subscriptionId
    
    # setup service endpoint on the virtual network subnet
    az network vnet subnet update -g $rgName --vnet-name $vnetName -n $subnetName --service-endpoints Microsoft.Storage
    
    # Create Service Endpoint Policy
    az network service-endpoint policy create -g $rgName  -n $sepName -l $location
    
    # Insert the list of HDInsight owned resources for the region your clusters will be created in.
    # Be sure to get the most recent list of resource groups from the [list of service endpoint policy resources](https://github.com/Azure-Samples/hdinsight-enterprise-security/blob/main/hdinsight-service-endpoint-policy-resources.json)
    [String[]]$resources = @("/subscriptions/235d341f-7fb9-435c-9bdc-034b7306c9b4/resourceGroups/Default-Storage-WestUS",`
    "/subscriptions/da0c4c68-9283-4f88-9c35-18f7bd72fbdd/resourceGroups/GenevaWarmPathManageRG",`
    "/subscriptions/6a853a41-3423-4167-8d9c-bcf37dc72818/resourceGroups/GenevaWarmPathManageRG",`
    "/subscriptions/c8845df8-14d1-4a46-b6dd-e0c44ae400b0/resourceGroups/Default-Storage-CanadaCentral",`
    "/subscriptions/c8845df8-14d1-4a46-b6dd-e0c44ae400b0/resourceGroups/cancstorage",`
    "/subscriptions/c8845df8-14d1-4a46-b6dd-e0c44ae400b0/resourceGroups/GenevaWarmPathManageRG",
    "/subscriptions/fb3429ab-83d0-4bed-95e9-1a8e9455252c/resourceGroups/DistroStorageRG/providers/Microsoft.Storage/storageAccounts/hdi31distrorelease",
    "/subscriptions/fb3429ab-83d0-4bed-95e9-1a8e9455252c/resourceGroups/DistroStorageRG/providers/Microsoft.Storage/storageAccounts/bigdatadistro")
    
    #Assign service resources to the SEP policy.
    az network service-endpoint policy-definition create -g $rgName --policy-name $sepName -n $sepDefName --service "Microsoft.Storage" --service-resources $resources
    
    # Associate a subnet to the service endpoint policy just created. If there is a delay in updating it to subnet, you can use the Azure portal to associate the policy with the subnet.
    az network vnet subnet update -g $rgName --vnet-name $vnetName -n $subnetName --service-endpoint-policy $sepName
    ```

    If you prefer to set up your service endpoint policy using PowerShell, using the following code snippet.
    
    ```powershell
    #Script to assign SEP 
    $subscriptionId = "<subscription id>"
    $rgName = "<resource group name>"
    $vnetName = "<vnet name>"
    $subnetName = "<subnet Name"
    $location = "Canada Central"
    
    # Connect to your Azure Account
    Connect-AzAccount
    
    # Select the Subscription that you want to use
    Select-AzSubscription -SubscriptionId $subscriptionId
    
    # Retrieve VNet Config
    $vnet = Get-AzVirtualNetwork -ResourceGroupName $rgName -Name $vnetName
    
    # Retrieve Subnet Config
    $subnet = Get-AzVirtualNetworkSubnetConfig -Name $subnetName -VirtualNetwork $vnet
    
    # Insert the list of HDInsight owned resources for the region your clusters will be created in.
    # Be sure to get the most recent list of resource groups from the [list of service endpoint policy resources](https://github.com/Azure-Samples/hdinsight-enterprise-security/blob/main/hdinsight-service-endpoint-policy-resources.json)
    [String[]]$resources = @("/subscriptions/235d341f-7fb9-435c-9bdc-034b7306c9b4/resourceGroups/Default-Storage-WestUS",
    "/subscriptions/da0c4c68-9283-4f88-9c35-18f7bd72fbdd/resourceGroups/GenevaWarmPathManageRG",
    "/subscriptions/6a853a41-3423-4167-8d9c-bcf37dc72818/resourceGroups/GenevaWarmPathManageRG",
    "/subscriptions/c8845df8-14d1-4a46-b6dd-e0c44ae400b0/resourceGroups/Default-Storage-CanadaCentral",
    "/subscriptions/c8845df8-14d1-4a46-b6dd-e0c44ae400b0/resourceGroups/cancstorage",
    "/subscriptions/c8845df8-14d1-4a46-b6dd-e0c44ae400b0/resourceGroups/GenevaWarmPathManageRG",
    "/subscriptions/fb3429ab-83d0-4bed-95e9-1a8e9455252c/resourceGroups/DistroStorageRG/providers/Microsoft.Storage/storageAccounts/hdi31distrorelease",
    "/subscriptions/fb3429ab-83d0-4bed-95e9-1a8e9455252c/resourceGroups/DistroStorageRG/providers/Microsoft.Storage/storageAccounts/bigdatadistro")
    
    #Declare service endpoint policy definition
    $sepDef = New-AzServiceEndpointPolicyDefinition -Name "SEPHDICanadaCentral" -Description "Service Endpoint Policy Definition" -Service "Microsoft.Storage" -ServiceResource $resources
    
    # Service Endpoint Policy
    $sep= New-AzServiceEndpointPolicy -ResourceGroupName $rgName -Name "SEPHDICanadaCentral" -Location $location -ServiceEndpointPolicyDefinition $sepDef
    
    # Associate a subnet to the service endpoint policy just created. If there is a delay in updating it to subnet, you can use the Azure portal to associate the policy with the subnet.
    Set-AzVirtualNetworkSubnetConfig -Name $subnetName -VirtualNetwork $vnet -AddressPrefix $subnet.AddressPrefix -ServiceEndpointPolicy $sep
    ```
> [!IMPORTANT] 
> It is recommended that you get the latest [list of service endpoint policy resources](https://github.com/Azure-Samples/hdinsight-enterprise-security/blob/main/hdinsight-service-endpoint-policy-resources.json) 
> on a scheduled basis manually or via automation. This will prevent CRUD issues when additional resource groups are added or removed from the JSON file. 


## Next steps

* [Azure HDInsight virtual network architecture](hdinsight-virtual-network-architecture.md)
* [Configure network virtual appliance](./network-virtual-appliance.md)
