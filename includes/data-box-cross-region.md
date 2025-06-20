---
author: stevenmatthew
ms.service: azure-databox
ms.topic: include
ms.date: 03/06/2025
ms.author: shaas
---

## Cross-region data transfer for Data Box devices

### Direct upload from any source to any Azure destination region

Customers can now select a given source to any Azure destination region for a direct upload from the DataBox device. This capability allows you to copy your data from a local source and transfer it to a destination within a different country, region, or boundary. For example, data stored on-premises in a source country like India can be directly uploaded to an Azure region in a different country, such as the United States. This feature provides flexibility and convenience for organizations with distributed data storage needs. It's important to note that the DataBox device isn't shipped across commerce boundaries. Instead, it's transported to an Azure data center within the originating country or region. Data transfer between the source country and the destination region takes place using the Azure network and incurs no additional cost.

### Benefits

This capability is particularly useful for large distributed organizations that have their Azure workloads set up in multiple regions. It allows for seamless data transfer across regions without the need for intermediate steps. Additionally, customers are not charged for the transcontinental transfer, making it a cost-effective solution for global data management.

### Exceptions and limitations

Customers should be aware of the following exceptions and limitations when planning their data transfer strategies:

- Cross-cloud transfers are not supported. Data cannot be transferred between different cloud providers.
- Shipping the Data Box device itself across commerce boundaries is not supported.
- Some data transfer scenarios take place over large geographic areas. Higher than normal latencies might be encountered during such transfers.
- Export scenarios for cross region transfers are not supported.
