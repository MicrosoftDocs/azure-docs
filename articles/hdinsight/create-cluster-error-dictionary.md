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


# HDInsight: Cluster creation errors

This article describes resolutions to errors encountered when creating clusters. 

> [!NOTE]
> The first three errors in the list below occur due to validation errors when the CsmDocument_2_0 class is used by an HDInsight product.



## Error Code: DeploymentDocument 'CsmDocument_2_0' failed the validation

### **Error**: Script Action location cannot be accessed URI:\<SCRIPT ACTION URL\>

**Error message: "The remote server returned an error: (404) Not Found."**

### Cause
The Script Action URL that is provided as part of the Create Cluster request is not accessible from HDInsight service. We receive the “ErrorMessage” when we try to access the script action.

### Resolution 
  - For an http/https URL, you can verify by trying to open the URL from an incognito browser window. 
  - For a WASB URL, make sure that the script exists in the storage account that is given in request. Make sure that the storage key for this storage account is accurate. 
  - For an ADLS URL, make sure that the script exists in the storage account.

---

## Error Code: DeploymentDocument 'CsmDocument_2_0' failed the validation

### **Error**: Script Action location cannot be accessed URI: \<SCRIPT ACTION URL\>

**Error message: The given script URI \<SCRIPT URI\> is in ADLS, but this cluster has no data lake storage principal**

### Cause
The Script Action URL that is provided as part of the Create Cluster request is not accessible from the HDInsight service. We receive the “ErrorMessage” when we try to access the script action. 

### Resolution

Make sure that the corresponding Azure Data Lake Store Gen 1 account is added to the cluster. The service principal that is used to access the Azure Data Lake Store Gen 1 account is also added to the cluster. 

---

## Error Code: DeploymentDocument 'CsmDocument_2_0' failed the validation

### **Error**: VM size '\<CUSTOMER SPECIFIED VM SIZE\>' provided in the request is invalid or not supported for role '\<ROLE\>'. Valid values are: \<VALID VM SIZE FOR ROLE\>.

### Cause
The customer-specified VM sizes are not allowed for the role. This may be true because the VM size value is not working as expected or is not suitable for the computer role. 

### Resolution
The error message lists the valid values for the VM size. Select one of these valid values, and retry the Create Cluster request. 

---

## Error Code: InvalidVirtualNetworkId  

### **Error**: The VirtualNetworkId is not valid. VirtualNetworkId '\<USER_VIRTUALNETWORKID\>'*

### Cause
The **VirtualNetworkId** value that is specified during cluster creation is not in the correct format. 

### Resolution
Make sure that **VirtualNetworkId** and subnet are in the correct format. To obtain the **VirtualnetworkId** value, go to the Azure portal, select your virtual network, and then select **Properties** on the menu. The **ResourceID** property is the **VirtualNetworkId** value. 

An example of a virtual network ID is: 

“/subscriptions/c15fd9b8-e2b8-1d4e-aa85-2e668040233b/resourceGroups/myresourcegroup/providers/Microsoft.Network/virtualNetworks/myvnet” 

---

## Error Code: CustomizationFailedErrorCode

### **Error**: Cluster deployment failed due to an error in the custom script action. Failed Actions: \<SCRIPT_NAME\>, Please go to Ambari UI to further debug the failure.

### Cause
The user’s custom script that was provided during the Create Cluster request is executed after the cluster is deployed successfully. This error code indicates that an error was encountered while executing this custom script with name \<SCRIPT_NAME\>.   

### Resolution
Because this is the user’s custom script, users should troubleshoot the issue and rerun the script if necessary. To troubleshoot the script failure, examine the logs in the /var/lib/ambari-agent/* folder. Or, open the Operations page in the Ambari UI, and then select the **run_customscriptionaction** operation to view the error details. 

---

## Error Code: InvalidDocumentErrorCode

### **Error**: The \<META_STORE_TYPE\> Metastore schema version \<METASTORE_MAJOR_VERSION\> in database \<DATABASE_NAME\> is incompatible with cluster version \<CLUSTER_VERSION\>

### Cause
The custom metastore is incompatible with the selected HDInsight cluster version. Currently, HDInsight 4.0 cluster supports only Metastore version 3.*x*, and HDInsight 3.6 does not support Metastore version 3.*x* or later. 

### Resolution
Make sure to use only Metastore versions that are supported by each HDInsight cluster version. Notice that if a custom metastore is not specified, HDInsight internally creates a metastore. However, this metastore will automatically be deleted upon cluster deletion. 

---

## Error Code: FailedToConnectWithClusterErrorCode 

### **Error**: Unable to connect to cluster management endpoint to perform scaling operation. Verify that network security rules are not blocking external access to the cluster, and that the cluster manager (Ambari) UI can be successfully accessed.

### Cause
You have a firewall rule on your Network Security Group (NSG) that is blocking cluster communication with critical Azure health and management services. 

### Resolution
If you plan to use **network security groups** to control network traffic, take the following actions before you install HDInsight: 
  - Identify the Azure region that you plan to use for HDInsight. 
  - Identify the IP addresses required by HDInsight. For more information, see [HDInsight management IP addresses](https://docs.microsoft.com/azure/hdinsight/hdinsight-management-ip-addresses). 
    - Create or modify the network security groups for the subnet that you plan to install HDInsight into. 
    - **Network security groups:** Allow **inbound** traffic on port **443** from the IP addresses. This makes sure that HDInsight management services can reach the cluster from outside the virtual network. 

---

## Error Code: StoragePermissionsBlockedForMsi  

### **Error**: The Managed Identity does not have permissions on the storage account. Please verify that 'Storage Blob Data Owner' role is assigned to the Managed Identity for the storage account. Storage: /subscriptions/ \<Subscription ID\> /resourceGroups/\< Resource Group Name\> /providers/Microsoft.Storage/storageAccounts/ \<Storage Account Name\>, Managed Identity: /subscriptions/ \<Subscription ID\> /resourceGroups/ /\< Resource Group Name\> /providers/Microsoft.ManagedIdentity/userAssignedIdentities/ \<User Managed Identity Name\>

### Cause
The required permissions were not provided to **Manage identity.** **User-assigned managed identity** didn’t have Blob Storage Contributor Role on ADLS Gen2 storage account. 

### Resolution

Open the Azure portal, go to your Storage account, look under **Access Control (IAM)**, and make sure that the Storage Blob Data Contributor or the Storage Blob Data Owner role has ""Assigned" access to the **User-assigned managed identity** for the subscription. For more information, see [Set up permissions for the managed identity on the Data Lake Storage Gen2 account](hdinsight-hadoop-use-data-lake-storage-gen2.md). 

---

## Error Code: InvalidNetworkSecurityGroupSecurityRules  

### **Error**: The security rules in the Network Security Group /subscriptions/\<SubscriptionID>\/resourceGroups/<Resource Group name> default/providers/Microsoft.Network/networkSecurityGroups/\<Network Security Group Name\> configured with subnet /subscriptions/\<SubscriptionID>\/resourceGroups/\<Resource Group name> RG-westeurope-vnet-tomtom-default\/providers/Microsoft.Network/virtualNetworks/\<Virtual Network Name>\/subnets/\<Subnet Name\> 
does not allow required inbound and/or outbound connectivity. For more information, please visit [Plan a virtual network for Azure HDInsight](https://docs.microsoft.com/azure/hdinsight/hdinsight-plan-virtual-network-deployment), or contact support.**

### Cause
If you use network security groups (NSGs) or user-defined routes (UDRs) to control inbound traffic to your HDInsight cluster, you must make sure that your cluster can communicate with critical Azure health and management services.

### Resolution
If you plan to use **network security groups** to control network traffic, take the following actions before you install HDInsight: 
  - Identify the Azure region that you plan to use for HDInsight, and create a safe list of the IP addresses for your region: [Health and management services: Specific regions](https://docs.microsoft.com/azure/hdinsight/hdinsight-management-ip-addresses#health-and-management-services-specific-regions).
  - Identify the IP addresses that are required by HDInsight. For more information, see [HDInsight management IP addresses](https://docs.microsoft.com/azure/hdinsight/hdinsight-management-ip-addresses). 
  - Create or modify the network security groups for the subnet that you plan to install HDInsight into. **Network security groups**: allow inbound traffic on port **443** from the IP addresses. This will ensure that HDInsight management services can reach the cluster from outside the virtual network.
  
---

## Error Code: Cluster setup failed to install components on one or more hosts

###  **Error**: Cluster setup failed to install components on one or more hosts. Please retry your request. 

### Cause 
Typically this error is generated when there is a transient issue or there is an Azure Outage 

### Resolution

Check the [Azure status](https://status.azure.com/status) page for any potential Azure Outages that may impact cluster deployment. If there aren't any outages, retry cluster deployment. 

## Next Steps

For more insight into troubleshooting errors with cluster creation, see [Troubleshoot cluster creation failures with Azure HDInsight](https://docs.microsoft.com/azure/hdinsight/hadoop/hdinsight-troubleshoot-cluster-creation-fails).
