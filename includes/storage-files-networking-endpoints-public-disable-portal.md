---
 title: include file
 description: include file
 services: storage
 author: roygara
 ms.service: storage
 ms.topic: include
 ms.date: 6/2/2020
 ms.author: rogarana
 ms.custom: include file
---
Navigate to the storage account for which you would like to restrict all access to the public endpoint. In the table of contents for the storage account, select **Firewalls and virtual networks**.

At the top of the page, select the **Selected networks** radio button. This will un-hide a number of settings for controlling the restriction of the public endpoint. Check **Allow trusted Microsoft services to access this service account** to allow trusted first party Microsoft services such as Azure File Sync to access the storage account.

[![Screenshot of the Firewalls and virtual networks blade with the appropriate restricts in place](media/storage-files-networking-endpoints-public-disable-portal/disable-public-endpoint-0.png)](media/storage-files-networking-endpoints-public-disable-portal/disable-public-endpoint-0.png#lightbox)