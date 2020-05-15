---
title: Azure SQL VM connection for search indexing
titleSuffix: Azure Cognitive Search
description: Enable encrypted connections and configure the firewall to allow connections to SQL Server on an Azure virtual machine (VM) from an indexer on Azure Cognitive Search.

manager: nitinme
author: HeidiSteen
ms.author: heidist
ms.service: cognitive-search
ms.topic: conceptual
ms.date: 11/04/2019
---

# Configure a connection from an Azure Cognitive Search indexer to SQL Server on an Azure VM

As noted in [Connecting Azure SQL Database to Azure Cognitive Search using indexers](search-howto-connecting-azure-sql-database-to-azure-search-using-indexers.md#faq), creating indexers against **SQL Server on Azure VMs** (or **SQL Azure VMs** for short) is supported by Azure Cognitive Search, but there are a few security-related prerequisites to take care of first. 

Connections from Azure Cognitive Search to SQL Server on a VM is a public internet connection. All of the security measures you would normally follow for these connections apply here as well:

+ Obtain a certificate from a [Certificate Authority provider](https://en.wikipedia.org/wiki/Certificate_authority#Providers) for the fully qualified domain name of the SQL Server instance on the Azure VM.
+ Install the certificate on the VM, and then enable and configure encrypted connections on the VM using the instructions in this article.

## Enable encrypted connections
Azure Cognitive Search requires an encrypted channel for all indexer requests over a public internet connection. This section lists the steps to make this work.

1. Check the properties of the certificate to verify the subject name is the fully qualified domain name (FQDN) of the Azure VM. You can use a tool like CertUtils or the Certificates snap-in to view the properties. You can get the FQDN from the VM service blade's Essentials section, in the **Public IP address/DNS name label** field, in the [Azure portal](https://portal.azure.com/).
   
   * For VMs created using the newer **Resource Manager** template, the FQDN is formatted as `<your-VM-name>.<region>.cloudapp.azure.com`
   * For older VMs created as a **Classic** VM, the FQDN is formatted as `<your-cloud-service-name.cloudapp.net>`.

2. Configure SQL Server to use the certificate using the Registry Editor (regedit). 
   
    Although SQL Server Configuration Manager is often used for this task, you can't use it for this scenario. It won't find the imported certificate because the FQDN of the VM on Azure doesn't match the FQDN as determined by the VM (it identifies the domain as either the local computer or the network domain to which it is joined). When names don't match, use regedit to specify the certificate.
   
   * In regedit, browse to this registry key: `HKEY_LOCAL_MACHINE\SOFTWARE\Microsoft\Microsoft SQL Server\[MSSQL13.MSSQLSERVER]\MSSQLServer\SuperSocketNetLib\Certificate`.
     
     The `[MSSQL13.MSSQLSERVER]` part varies based on version and instance name. 
   * Set the value of the **Certificate** key to the **thumbprint** of the TLS/SSL certificate you imported to the VM.
     
     There are several ways to get the thumbprint, some better than others. If you copy it from the **Certificates** snap-in in MMC, you will probably pick up an invisible leading character [as described in this support article](https://support.microsoft.com/kb/2023869/), which results in an error when you attempt a connection. Several workarounds exist for correcting this problem. The easiest is to backspace over and then retype the first character of the thumbprint to remove the leading character in the key value field in regedit. Alternatively, you can use a different tool to copy the thumbprint.

3. Grant permissions to the service account. 
   
    Make sure the SQL Server service account is granted appropriate permission on the private key of the TLS/SSL certificate. If you overlook this step, SQL Server will not start. You can use the **Certificates** snap-in or **CertUtils** for this task.
    
4. Restart the SQL Server service.

## Configure SQL Server connectivity in the VM
After you set up the encrypted connection required by Azure Cognitive Search, there are additional configuration steps intrinsic to SQL Server on Azure VMs. If you haven't done so already , the next step is to finish configuration using either one of these articles:

* For a **Resource Manager** VM, see [Connect to a SQL Server Virtual Machine on Azure using Resource Manager](../azure-sql/virtual-machines/windows/ways-to-connect-to-sql.md). 
* For a **Classic** VM, see [Connect to a SQL Server Virtual Machine on Azure Classic](../virtual-machines/windows/classic/sql-connect.md).

In particular, review the section in each article for "connecting over the internet".

## Configure the Network Security Group (NSG)
It is not unusual to configure the NSG and corresponding Azure endpoint or Access Control List (ACL) to make your Azure VM accessible to other parties. Chances are you've done this before to allow your own application logic to connect to your SQL Azure VM. It's no different for an Azure Cognitive Search connection to your SQL Azure VM. 

The links below provide instructions on NSG configuration for VM deployments. Use these instructions to ACL an Azure Cognitive Search endpoint based on its IP address.

> [!NOTE]
> For background, see [What is a Network Security Group?](../virtual-network/security-overview.md)
> 
> 

* For a **Resource Manager** VM, see [How to create NSGs for ARM deployments](../virtual-network/tutorial-filter-network-traffic.md). 
* For a **Classic** VM, see [How to create NSGs for Classic deployments](../virtual-network/virtual-networks-create-nsg-classic-ps.md).

IP addressing can pose a few challenges that are easily overcome if you are aware of the issue and potential workarounds. The remaining sections provide recommendations for handling issues related to IP addresses in the ACL.

#### Restrict access to the Azure Cognitive Search
We strongly recommend that you restrict the access to the IP address of your search service and the IP address range of `AzureCognitiveSearch` [service tag](https://docs.microsoft.com/azure/virtual-network/service-tags-overview#available-service-tags) in the ACL instead of making your SQL Azure VMs open to all connection requests.

You can find out the IP address by pinging the FQDN (for example, `<your-search-service-name>.search.windows.net`) of your search service.

You can find out the IP address range of `AzureCognitiveSearch` [service tag](https://docs.microsoft.com/azure/virtual-network/service-tags-overview#available-service-tags) by either using [Downloadable JSON files](https://docs.microsoft.com/azure/virtual-network/service-tags-overview#discover-service-tags-by-using-downloadable-json-files) or via the [Service Tag Discovery API](https://docs.microsoft.com/azure/virtual-network/service-tags-overview#use-the-service-tag-discovery-api-public-preview). The IP address range is updated weekly.

#### Managing IP address fluctuations
If your search service has only one search unit (that is, one replica and one partition), the IP address will change during routine service restarts, invalidating an existing ACL with your search service's IP address.

One way to avoid the subsequent connectivity error is to use more than one replica and one partition in Azure Cognitive Search. Doing so increases the cost, but it also solves the IP address problem. In Azure Cognitive Search, IP addresses don't change when you have more than one search unit.

A second approach is to allow the connection to fail, and then reconfigure the ACLs in the NSG. On average, you can expect IP addresses to change every few weeks. For customers who do controlled indexing on an infrequent basis, this approach might be viable.

A third viable (but not particularly secure) approach is to specify the IP address range of the Azure region where your search service is provisioned. The list of IP ranges from which public IP addresses are allocated to Azure resources is published at [Azure Datacenter IP ranges](https://www.microsoft.com/download/details.aspx?id=41653). 

#### Include the Azure Cognitive Search portal IP addresses
If you are using the Azure portal to create an indexer, Azure Cognitive Search portal logic also needs access to your SQL Azure VM during creation time. Azure Cognitive Search portal IP addresses can be found by pinging `stamp2.search.ext.azure.com`.

## Next steps
With configuration out of the way, you can now specify a SQL Server on Azure VM as the data source for an Azure Cognitive Search indexer. See [Connecting Azure SQL Database to Azure Cognitive Search using indexers](search-howto-connecting-azure-sql-database-to-azure-search-using-indexers.md) for more information.

