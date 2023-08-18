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
Navigate to the storage account for which you would like to restrict all access to the public endpoint. In the table of contents for the storage account, select **Networking**.

At the top of the page, select the **Enabled from selected virtual networks and IP addresses** radio button. This will un-hide a number of settings for controlling the restriction of the public endpoint. Select **Allow Azure services on the trusted services list to access this storage account** to allow trusted first party Microsoft services such as Azure File Sync to access the storage account.

:::image type="content" source="media/storage-files-networking-endpoints-public-disable-portal/disable-public-endpoint.png" alt-text="Screenshot of the Networking blade with the required settings to disable access to the storage account public endpoint." lightbox="media/storage-files-networking-endpoints-public-disable-portal/disable-public-endpoint.png":::
