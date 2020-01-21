---
title: Create a cluster error dictionary
description: Learn how to create a cluster error dictionary.
ms.reviewer: hrasheed
author: karkrish
ms.service: hdinsight
ms.custom: hdinsightactive,hdiseo17may2017
ms.topic: troubleshooting
ms.date: 11/19/2019
ms.author: v-todmc
---


# Azure HDInsight: Cluster creation errors

This article describes resolutions to errors you might come across when creating clusters.

> [!NOTE]
> The first three errors described in this article are validation errors. They can occur when an Azure HDInsight product uses the **CsmDocument_2_0** class.

## Error code: DeploymentDocument 'CsmDocument_2_0' failed the validation

### Error

"Script Action location cannot be accessed URI:\<SCRIPT ACTION URL\>"

#### Error message

"The remote server returned an error: (404) Not Found."

### Cause

The HDInsight service can't access the script action URL that you provided as part of the Create Cluster request. The service receives the preceding error message when it tries to access the script action.

### Resolution

- For an HTTP or HTTPS URL, verify the URL by trying to go to it from an incognito browser window.
- For a WASB URL, be sure that the script exists in the storage account that you give in the request. Also make sure that the storage key for this storage account is correct.
- For an ADLS URL, be sure that the script exists in the storage account.

---

## Error code: DeploymentDocument 'CsmDocument_2_0' failed the validation

### Error

"Script Action location cannot be accessed URI: \<SCRIPT_ACTION_URL\>"

#### Error message

"The given script URI \<SCRIPT_URI\> is in ADLS, but this cluster has no data lake storage principal"

### Cause

The HDInsight service can't access the script action URL that you provided as part of the Create Cluster request. The service receives the preceding error message when it tries to access the script action.

### Resolution

Add the corresponding Azure Data Lake Storage Gen 1 account to the cluster. Also add the service principal that accesses the Data Lake Storage Gen 1 account to the cluster.

---

## Error code: DeploymentDocument 'CsmDocument_2_0' failed the validation

### Error

"VM size '\<CUSTOMER_SPECIFIED_VM_SIZE\>' provided in the request is invalid or not supported for role '\<ROLE\>'. Valid values are: \<VALID_VM_SIZE_FOR_ROLE\>."

### Cause

The virtual machine size that you specified isn't allowed for the role. This error might occur because the VM size value doesn't work as expected or isn't suitable for the computer role.

### Resolution

The error message lists the valid values for the VM size. Select one of these values and retry the Create Cluster request.

---

## Error code: InvalidVirtualNetworkId  

### Error

"The VirtualNetworkId is not valid. VirtualNetworkId '\<USER_VIRTUALNETWORKID\>'*"

### Cause

The **VirtualNetworkId** value that you specified during cluster creation isn't in the correct format.

### Resolution

Make sure that the **VirtualNetworkId** and subnet values are in the correct format. To get the **VirtualNetworkId** value:

1. Go to the Azure portal.
1. Select your virtual network.
1. Select the **Properties** menu item. The **ResourceID** property value is the **VirtualNetworkId** value.

Here's an example of a virtual network ID:

"/subscriptions/c15fd9b8-e2b8-1d4e-aa85-2e668040233b/resourceGroups/myresourcegroup/providers/Microsoft.Network/virtualNetworks/myvnet"

---

## Error code: CustomizationFailedErrorCode

### Error

"Cluster deployment failed due to an error in the custom script action. Failed Actions: \<SCRIPT_NAME\>, Please go to Ambari UI to further debug the failure."

### Cause

The custom script that you provided during the Create Cluster request is executed after the cluster is deployed successfully. This error code indicates that an error arose during execution of the custom script named \<SCRIPT_NAME\>.

### Resolution

Because the script is your custom script, we recommend that you troubleshoot the problem and rerun the script if necessary. To troubleshoot the script failure, examine the logs in the /var/lib/ambari-agent/* folder. Or open the **Operations** page in the Ambari UI and then select the **run_customscriptaction** operation to view the error details.

---

## Error code: InvalidDocumentErrorCode

### Error

"The \<META_STORE_TYPE\> Metastore schema version \<METASTORE_MAJOR_VERSION\> in database \<DATABASE_NAME\> is incompatible with cluster version \<CLUSTER_VERSION\>"

### Cause

The custom metastore is incompatible with the selected HDInsight cluster version. Currently, HDInsight 4.0 clusters support only Metastore version 3.0 and later, while HDInsight 3.6 clusters don't support Metastore version 3.0 and later.

### Resolution

Use only Metastore versions that your HDInsight cluster version supports. If you don't specify a custom metastore, HDInsight internally creates a metastore and then deletes it upon cluster deletion.

---

## Error code: FailedToConnectWithClusterErrorCode 

### Error

"Unable to connect to cluster management endpoint to perform scaling operation. Verify that network security rules are not blocking external access to the cluster, and that the cluster manager (Ambari) UI can be successfully accessed."

### Cause

A firewall rule on your network security group (NSG) is blocking cluster communication with critical Azure health and management services.

### Resolution

If you plan to use network security groups to control network traffic, take the following actions before you install HDInsight:

- Identify the Azure region that you plan to use for HDInsight.
- Identify the IP addresses required by HDInsight. For more information, see [HDInsight management IP addresses](https://docs.microsoft.com/azure/hdinsight/hdinsight-management-ip-addresses).
  - Create or modify the network security groups for the subnet that you plan to install HDInsight into.
  - For network security groups, allow inbound traffic on port 443 from the IP addresses. This configuration ensures that HDInsight management services can reach the cluster from outside the virtual network.

---

## Error code: StoragePermissionsBlockedForMsi  

### Error

"The Managed Identity does not have permissions on the storage account. Please verify that 'Storage Blob Data Owner' role is assigned to the Managed Identity for the storage account. Storage: /subscriptions/ \<Subscription ID\> /resourceGroups/\< Resource Group Name\> /providers/Microsoft.Storage/storageAccounts/ \<Storage Account Name\>, Managed Identity: /subscriptions/ \<Subscription ID\> /resourceGroups/ /\< Resource Group Name\> /providers/Microsoft.ManagedIdentity/userAssignedIdentities/ \<User Managed Identity Name\>"

### Cause

You didn't provide the permissions required to manage identity. The user-assigned managed identity doesn't have the Blob Storage Contributor role on the Azure Data Lake Storage Gen2 storage account.

### Resolution

1. Open the Azure portal.
1. Go to your storage account.
1. Look under **Access Control (IAM)**.
1. Make sure that the Storage Blob Data Contributor role or the Storage Blob Data Owner role has "Assigned" access to the user-assigned managed identity for the subscription.

For more information, see [Set up permissions for the managed identity on the Data Lake Storage Gen2 account](hdinsight-hadoop-use-data-lake-storage-gen2.md).

---

## Error code: InvalidNetworkSecurityGroupSecurityRules  

### Error

"The security rules in the Network Security Group /subscriptions/\<SubscriptionID\>/resourceGroups/<Resource Group name\> default/providers/Microsoft.Network/networkSecurityGroups/\<Network Security Group Name\> configured with subnet /subscriptions/\<SubscriptionID\>/resourceGroups/\<Resource Group name\> RG-westeurope-vnet-tomtom-default/providers/Microsoft.Network/virtualNetworks/\<Virtual Network Name\>/subnets/\<Subnet Name\> does not allow required inbound and/or outbound connectivity. For more information, please visit [Plan a virtual network for Azure HDInsight](https://docs.microsoft.com/azure/hdinsight/hdinsight-plan-virtual-network-deployment), or contact support."

### Cause

If network security groups or user-defined routes (UDRs) control inbound traffic to your HDInsight cluster, be sure that your cluster can communicate with critical Azure health and management services.

### Resolution

If you plan to use network security groups to control network traffic, take the following actions before you install HDInsight:

- Identify the Azure region that you plan to use for HDInsight, and create a safe list of the IP addresses for your region. For more information, see [Health and management services: Specific regions](https://docs.microsoft.com/azure/hdinsight/hdinsight-management-ip-addresses#health-and-management-services-specific-regions).
- Identify the IP addresses that HDInsight requires. For more information, see [HDInsight management IP addresses](https://docs.microsoft.com/azure/hdinsight/hdinsight-management-ip-addresses).
- Create or modify the network security groups for the subnet that you plan to install HDInsight into. For network security groups, allow inbound traffic on port 443 from the IP addresses. This configuration ensures that HDInsight management services can reach the cluster from outside the virtual network.
  
---

## Error code: Cluster setup failed to install components on one or more hosts

###  Error

"Cluster setup failed to install components on one or more hosts. Please retry your request."

### Cause 

Typically, this error is generated when there's a transient problem or an Azure outage.

### Resolution

Check the [Azure status](https://status.azure.com/status) page for any Azure outages that might affect cluster deployment. If there are no outages, retry cluster deployment.

## Next steps

For more information about troubleshooting errors in cluster creation, see [Troubleshoot cluster creation failures with Azure HDInsight](https://docs.microsoft.com/azure/hdinsight/hadoop/hdinsight-troubleshoot-cluster-creation-fails).
