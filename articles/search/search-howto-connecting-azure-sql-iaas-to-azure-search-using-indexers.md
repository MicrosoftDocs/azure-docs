---
title: Azure SQL VM connection for search indexing
titleSuffix: Azure Cognitive Search
description: Enable encrypted connections and configure the firewall to allow connections to SQL Server on an Azure virtual machine (VM) from an indexer on Azure Cognitive Search.

author: markheff
ms.author: maheff
ms.service: cognitive-search
ms.topic: conceptual
ms.date: 03/19/2021
---

# Configure a connection from an Azure Cognitive Search indexer to SQL Server on an Azure VM

When configuring an [Azure SQL indexer](search-howto-connecting-azure-sql-database-to-azure-search-using-indexers.md#faq) to extract content from a database on an Azure virtual machine, additional steps are required for secure connections. 

A connection from Azure Cognitive Search to SQL Server on a virtual machine is a public internet connection. In order for secure connections to succeed, complete the following steps:

+ Obtain a certificate from a [Certificate Authority provider](https://en.wikipedia.org/wiki/Certificate_authority#Providers) for the fully qualified domain name of the SQL Server instance on the virtual machine

+ Install the certificate on the virtual machine, and then enable and configure encrypted connections on the VM using the instructions in this article.

## Enable encrypted connections

Azure Cognitive Search requires an encrypted channel for all indexer requests over a public internet connection. This section lists the steps to make this work.

1. Check the properties of the certificate to verify the subject name is the fully qualified domain name (FQDN) of the Azure VM. You can use a tool like CertUtils or the Certificates snap-in to view the properties. You can get the FQDN from the VM service blade's Essentials section, in the **Public IP address/DNS name label** field, in the [Azure portal](https://portal.azure.com/).
  
   + For VMs created using the newer **Resource Manager** template, the FQDN is formatted as `<your-VM-name>.<region>.cloudapp.azure.com`

   + For older VMs created as a **Classic** VM, the FQDN is formatted as `<your-cloud-service-name.cloudapp.net>`.

1. Configure SQL Server to use the certificate using the Registry Editor (regedit). 

   Although SQL Server Configuration Manager is often used for this task, you can't use it for this scenario. It won't find the imported certificate because the FQDN of the VM on Azure doesn't match the FQDN as determined by the VM (it identifies the domain as either the local computer or the network domain to which it is joined). When names don't match, use regedit to specify the certificate.

   + In regedit, browse to this registry key: `HKEY_LOCAL_MACHINE\SOFTWARE\Microsoft\Microsoft SQL Server\[MSSQL13.MSSQLSERVER]\MSSQLServer\SuperSocketNetLib\Certificate`.

     The `[MSSQL13.MSSQLSERVER]` part varies based on version and instance name. 

   + Set the value of the **Certificate** key to the **thumbprint** of the TLS/SSL certificate you imported to the VM.

     There are several ways to get the thumbprint, some better than others. If you copy it from the **Certificates** snap-in in MMC, you will probably pick up an invisible leading character [as described in this support article](https://support.microsoft.com/kb/2023869/), which results in an error when you attempt a connection. Several workarounds exist for correcting this problem. The easiest is to backspace over and then retype the first character of the thumbprint to remove the leading character in the key value field in regedit. Alternatively, you can use a different tool to copy the thumbprint.

1. Grant permissions to the service account. 

    Make sure the SQL Server service account is granted appropriate permission on the private key of the TLS/SSL certificate. If you overlook this step, SQL Server will not start. You can use the **Certificates** snap-in or **CertUtils** for this task.

1. Restart the SQL Server service.

## Configure SQL Server connectivity in the VM

After you set up the encrypted connection required by Azure Cognitive Search, there are additional configuration steps intrinsic to SQL Server on Azure VMs. If you haven't done so already, the next step is to finish configuration using either one of these articles:

+ For a **Resource Manager** VM, see [Connect to a SQL Server Virtual Machine on Azure using Resource Manager](../azure-sql/virtual-machines/windows/ways-to-connect-to-sql.md). 

+ For a **Classic** VM, see [Connect to a SQL Server Virtual Machine on Azure Classic](/previous-versions/azure/virtual-machines/windows/sqlclassic/virtual-machines-windows-classic-sql-connect).

In particular, review the section in each article for "connecting over the internet".

## Configure the Network Security Group (NSG)

It is not unusual to configure the NSG and corresponding Azure endpoint or Access Control List (ACL) to make your Azure VM accessible to other parties. Chances are you've done this before to allow your own application logic to connect to your SQL Azure VM. It's no different for an Azure Cognitive Search connection to your SQL Azure VM. 

The links below provide instructions on NSG configuration for VM deployments. Use these instructions to ACL an Azure Cognitive Search endpoint based on its IP address.

> [!NOTE]
> For background, see [What is a Network Security Group?](../virtual-network/network-security-groups-overview.md)

+ For a **Resource Manager** VM, see [How to create NSGs for ARM deployments](../virtual-network/tutorial-filter-network-traffic.md).

+ For a **Classic** VM, see [How to create NSGs for Classic deployments](/previous-versions/azure/virtual-network/virtual-networks-create-nsg-classic-ps).

IP addressing can pose a few challenges that are easily overcome if you are aware of the issue and potential workarounds. The remaining sections provide recommendations for handling issues related to IP addresses in the ACL.

### Restrict access to the Azure Cognitive Search

We strongly recommend that you restrict the access to the IP address of your search service and the IP address range of `AzureCognitiveSearch` [service tag](../virtual-network/service-tags-overview.md#available-service-tags) in the ACL instead of making your SQL Azure VMs open to all connection requests.

You can find out the IP address by pinging the FQDN (for example, `<your-search-service-name>.search.windows.net`) of your search service. Although it is possible for the search service IP address to change, it's unlikely that it will change. The IP address tends to be static for the lifetime of the service.

You can find out the IP address range of `AzureCognitiveSearch` [service tag](../virtual-network/service-tags-overview.md#available-service-tags) by either using [Downloadable JSON files](../virtual-network/service-tags-overview.md#discover-service-tags-by-using-downloadable-json-files) or via the [Service Tag Discovery API](../virtual-network/service-tags-overview.md#use-the-service-tag-discovery-api-public-preview). The IP address range is updated weekly.

### Include the Azure Cognitive Search portal IP addresses

If you are using the Azure portal to create an indexer, Azure Cognitive Search portal logic also needs access to your SQL Azure VM during creation time. Azure Cognitive Search portal IP addresses can be found by pinging `stamp2.search.ext.azure.com`, which is the domain of the traffic manager.

Clusters in different regions connect to this traffic manager. The ping might return the IP address and domain of `stamp2.search.ext.azure.com`, but if your service is in a different region, the IP and domain name will be different. The IP address returned from the ping is the correct one for portal in your region.

## Next steps

With configuration out of the way, you can now specify a SQL Server on Azure VM as the data source for an Azure Cognitive Search indexer. For more information, see [Connecting Azure SQL Database to Azure Cognitive Search using indexers](search-howto-connecting-azure-sql-database-to-azure-search-using-indexers.md).