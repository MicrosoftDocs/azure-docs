---
title: Troubleshoot security and access control issues
description: Learn how to troubleshoot security and access control issues in Azure Data Factory. 
services: data-factory
author: lrtoyou1223
ms.service: data-factory
ms.topic: troubleshooting
ms.date: 11/19/2020
ms.author: lle
ms.reviewer: craigg
---

# Troubleshoot Azure Data Factory security and access control issues

[!INCLUDE[appliesto-adf-asa-md](includes/appliesto-adf-asa-md.md)]

This article explores common troubleshooting methods for security and access control in Azure Data Factory.

## Common errors and messages


### Connectivity issue of copy activity in Cloud Data Store

#### Symptoms

Various kinds of error messages could be returned when connectivity issue occurred for source/sink data store.

#### Cause 

The problem is mostly caused by following factors:

1. Proxy setting in self-hosted IR's node (If you are using self-hosted IR)

1. Firewall setting in the self-hosted IR's node (If you are using self-hosted IR)

1. Firewall setting in Cloud Data Store

#### Resolution

1. Check following points first to make sure the issue is caused by connectivity issue:

   - The error is thrown from the source/sink connectors.

   - The activity fails at the start of the copy

   - It is a consistent failure for Azure IR or self-hosted IR with one node, as it could be a random failure for multiple-node self-hosted IR if only part of the nodes has the issue.

1. Check your proxy, firewall, and network settings if you are using **self-hosted IR** as the run to the same data store could succeed in Azure IR. Please refer to following links for troubleshoot:

   [Self-hosted IR Ports and Firewalls](https://docs.microsoft.com/azure/data-factory/create-self-hosted-integration-runtime#ports-and-firewalls)
   [ADLS Connector](https://docs.microsoft.com/azure/data-factory/connector-azure-data-lake-store)
  
1. If you are using **Azure IR**, please try disabling the firewall setting of data store. Through this way, the issue for following two circumstances can be fixed:
  
   * [Azure IR IP Addresses](https://docs.microsoft.com/azure/data-factory/azure-integration-runtime-ip-addresses) are not in allow list.

   * *Allow trusted Microsoft services to access this storage account* feature is turned off for [Azure Blob Storage](https://docs.microsoft.com/azure/data-factory/connector-azure-blob-storage#supported-capabilities) and [ADLS Gen 2](https://docs.microsoft.com/azure/data-factory/connector-azure-data-lake-storage#supported-capabilities).

   * *Allow access to Azure services* is not enabled for ADLS Gen1.

1. If above methods are not working, please contact Microsoft for help.


### Invalid or empty Authentication key issue after disabling public network access

#### Symptoms

Self-hosted integration runtime throws error “The Authentication key is invalid or empty” after disabling public network access for Data Factory.

#### Cause

The problem is most likely caused by DNS resolution issue, as disabling public connectivity and establishing a private endpoint does no help for reconnecting.

You can follow below steps to verify if Data Factory FQDN is resolved to public IP address:

1. Confirm that you have created the Azure VM in the same VNET as Data Factory private endpoint.

1. Run PsPing and Ping from Azure VM to Data Factory FQDN:

   `ping <dataFactoryName>.<region>.datafactory.azure.net`

   `psping.exe <dataFactoryName>.<region>.datafactory.azure.net:443`

> [!Note]
> A port is required to be specified for PsPing command, while 443 port is not a must.
>

1. Check if both commands resolved to an ADF public IP that based on specified region (format xxx.xxx.xxx.0).

#### Resolution

- You can refer to the article in [Azure Private Link for Azure Data Factory](https://docs.microsoft.com/azure/data-factory/data-factory-private-link#dns-changes-for-private-endpoints). The instruction is for configuring the private DNS zone/server to resolve Data Factory FQDN to private IP address.

- If you are not willing to configure the private DNS zone/server currently, please take below steps as temporary solution. However, custom DNS is still recommended as long-term solution.

  1. Change the host file in windows and map private IP (ADF Private endpoint) to ADF FQDN.
  
     Navigate to path "C:\Windows\System32\drivers\etc" in Azure VM and open the **host** file with notepad. Add the line of mapping private IP to FQDN at the end of the file, and save the change.
     
     ![Add mapping to host](media/self-hosted-integration-runtime-troubleshoot-guide/add-mapping-to-host.png)

  1. Rerun the same commands in above verification steps to check the response, which should contain the private IP.

  1. Re-register the self-hosted integration runtime and the problem should be solved.
 

### Unable to register IR authentication key on Self-hosted VMs due to private link

#### Symptoms

Unable to register IR authentication key on Self-hosted VM due to private link enabled.

The error information shows as below:

`
Failed to get service token from ADF service with key *************** and time cost is: 0.1250079 seconds, the error code is: InvalidGatewayKey, activityId is: XXXXXXX and detailed error message is Client IP address is not valid private ip Cause Data factory couldn’t access the public network thereby not able to reach out to the cloud to make the successful connection.
`

#### Cause

The issue could be caused by the VM where the SHIR is trying to be installed. Public network access should be enabled for connecting to the cloud.

#### Resolution

 **Solution 1:** You can follow below steps to resolve the issue:

1. Navigate to the below link: 
    
    https://docs.microsoft.com/rest/api/datafactory/Factories/Update

1. Click on **Try It** option and fill all required details. Paste below property in the **Body** as well:

    ```
    { "tags": { "publicNetworkAccess":"Enabled" } }
    ``` 

1. Click **Run** at the end of the page to run the function. Make sure that you would get Response Code 200. The property we pasted will be shown in JSON definition as well.

1. Then you can try to add IR authentication key again in the integration runtime.


**Solution 2:** You can refer to below article for solution:

https://docs.microsoft.com/azure/data-factory/data-factory-private-link

Try to enable the public network access with user interface.

![Enable public network access](media/self-hosted-integration-runtime-troubleshoot-guide/enable-public-network-access.png)

## Next steps

For more help with troubleshooting, try the following resources:

*  [Private Link for Data Factory](data-factory-private-link.md)
*  [Data Factory blog](https://azure.microsoft.com/blog/tag/azure-data-factory/)
*  [Data Factory feature requests](https://feedback.azure.com/forums/270578-data-factory)
*  [Azure videos](https://azure.microsoft.com/resources/videos/index/?sort=newest&services=data-factory)
*  [Microsoft Q&A question page](/answers/topics/azure-data-factory.html)
*  [Stack overflow forum for Data Factory](https://stackoverflow.com/questions/tagged/azure-data-factory)
*  [Twitter information about Data Factory](https://twitter.com/hashtag/DataFactory)