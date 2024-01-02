---
 title: include file
 description: include file
 services: storage
 author: khdownie
 ms.service: azure-file-storage
 ms.topic: include
 ms.date: 11/01/2022
 ms.author: kendownie
 ms.custom: include file
---

Navigate to the storage account for which you would like to restrict the public endpoint to specific virtual networks. In the table of contents for the storage account, select **Networking**. 

At the top of the page, select the **Enabled from selected virtual networks and IP addresses** radio button. This will un-hide a number of settings for controlling the restriction of the public endpoint. Select **+Add existing virtual network** to select the specific virtual network that should be allowed to access the storage account via the public endpoint. Select a virtual network and a subnet for that virtual network, and then select **Enable**.

Select **Allow Azure services on the trusted services list to access this storage account** to allow trusted first party Microsoft services such as Azure File Sync to access the storage account.

:::image type="content" source="media/storage-files-networking-endpoints-public-restrict-portal/restrict-public-endpoint.png" alt-text="Screenshot of the Networking blade with a specific virtual network allowed to access the storage account via the public endpoint." lightbox="media/storage-files-networking-endpoints-public-restrict-portal/restrict-public-endpoint.png":::
