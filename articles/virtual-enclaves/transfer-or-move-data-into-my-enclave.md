---
title: Transfer or move data into my enclave
description: Transfer or move data into my enclave
author: jadean-msft
ms.author: jadean
# ms.service: Azure Virtual Enclaves
ms.topic: overview
ms.date: 01/31/2025
---

# Transferring data into an Enclave

By default, all network traffic within an [enclave](./what-is-an-enclave.md) is permitted by Azure Virtual Enclaves (AVE) product design. This means that all resources and hosts within an enclave can reach, discover, and communicate with each other. However, this poses a potential issue for Community and Enclave Owners when first creating their AVE-related resources on how to initially migrate or bring their data into their enclaves.

## Overview
If the data that needs to be moved into an enclave resides in an Azure Storage Account, you will need to create a connection to the data source, optionally download an application to help download/copy/move, and then perform the download/copy/move operation. Please follow these detailed steps:
1. Log into [Enclave Admin Workstation](/docs/concepts/Understanding-Admin-Workstations), or any other resource located in the enclave private network. 
2. Create an Endpoint (at either the Community or Enclave level) and Connection (targeting the Enclave/Community and Endpoint created) to where the data is
      - How to make a [Community Endpoint](docs/How-To-Guides/Create-a-Enclave-Endpoint-in-the-Azure-Portal) or [Enclave Endpoint](docs/How-To-Guides/Create-a-Community-Endpoint-in-the-Azure-Portal) for your IP Data Source / External Data Network (an example of this could look like this: `name: ep-mydatasource`, `source: 172.168.10.0/16`, `protocol: https`, `port: 443`)
      - [How to make a Connection](docs/How-To-Guides/Create-a-Connection-from-the-Azure-Portal) connecting either a Community or an Enclave to the Endpoint created above
3. Use [AzCopy](https://aka.ms/azcopy), [Azure Portal](https://aka.ms/azureportal), or [Azure Storage Explorer](https://aka.ms/storageexplorer) while on Enclave Admin Workstation to transfer data from location specified above into the Enclave
      - By default these tools are not installed on Admin Workstations or other machines. To install these tools onto resources residing in the enclave private network, you must create an endpoint and connection to the download location of these tools.
      - AVE recommends downloading these tools using [Azure Toolbox](https://aka.ms/aztoolbox)
![storageAcct.png](./media/storageAcct-0fa64159-b3d3-4e38-b232-afad495179b7.png)

## Downloading tools from Azure Toolbox
To download tools from Azure Toolbox into an enclave, AVE recommends that either an enclave or community endpoint be created to Azure Toolbox. Furthermore, Enclave Owners should then also create a connection from the Enclave or Community to the Azure Toolbox endpoint. Below is an example of how to do this:
- How to make a [Community Endpoint](docs/How-To-Guides/Create-a-Enclave-Endpoint-in-the-Azure-Portal) or [Enclave Endpoint](docs/How-To-Guides/Create-a-Community-Endpoint-in-the-Azure-Portal) for your IP Data Source / External Data Network (an example of this could look like this: `name: ep-aztoolbox`, `source: <aztoolbox-fqdn>`, `protocol: https`, `port: 443`). Below is a table with the current environments and their respective FQDNs needed to connect to Azure Toolbox. Additional information can be found here on the [Azure Toolbox](https://eng.ms/docs/cloud-ai-platform/azure-edge-platform-aep/aep-silver/azure-toolbox/azure-toolbox/) overview page.

|Environment| FQDN  |
|--|--|
| Test | prod.api.toolbox.azure-test.net |
| US Sec |  |
| US Nat |  |


- [How to make a Connection](docs/How-To-Guides/Create-a-Connection-from-the-Azure-Portal) connecting either a Community or an Enclave to the Endpoint created above
![toolbox.png](./media/toolbox-c55876fc-9344-41bb-aeeb-1c40f2c69b0d.png)

---

Should further troubleshooting be required to investigate making Connections, please refer to [Create a Connection from the Azure Portal](docs/How-To-Guides/Create-a-Connection-from-the-Azure-Portal) or contact [Azure Support](https://azure.microsoft.com/en-us/support/).

## References
- [What is Azure Virtual Enclaves?](./what-is-azure-virtual-enclaves.md)
- [Best ractices](./best-practices.md)
- [What is an Enclave?](./what-is-an-enclave.md)
- [Understanding Admin Workstation](./understanding-admin-workstations.md)
- [Create an Enclave Endpoint](./create-a-enclave-endpoint-in-the-azure-portal.md)
- [Create a Community Endpoint](./create-a-community-endpoint-in-the-azure-portal.md)
- [Create a Connection from the Azure Portal](./create-a-connection-from-the-azure-portal.md)
- [Azure Support](https://azure.microsoft.com/support/)
