---
title: What's new in Azure Bastion?
description: Learn what's new with Azure Bastion, such as the latest release notes, known issues, bug fixes, deprecated functionality, and upcoming changes.
author: aatsang
ms.service: azure-bastion
ms.topic: concept-article
ms.date: 10/24/2024
ms.author: aarontsang
---

# What's new in Azure Bastion?

Azure Bastion is updated regularly. Stay up to date with the latest announcements. This article provides you with information about:

* Recent releases
* Previews underway with known limitations (if applicable)
* Deprecated functionality (if applicable)

You can also find the latest Bastion updates and subscribe to the RSS feed [here](https://azure.microsoft.com/blog/product/azure-bastion/).

## Recent releases and announcements

| Type |  Name | Description | Date added | Limitations |
|---|---|---|---|---|
|Feature | [Graphical session recording](session-recording.md) | Graphical session recording is now generally available in all regions that Bastion is available in. | November 2024 | Can't currently be used with native client.
| Feature | [Private Only Bastion](private-only-deployment.md)| Private Only Bastion is now generally available in all regions that Bastion is available in.| November 2024 | N/A|
| SKU | [Bastion Premium SKU](bastion-overview.md#sku)| Bastion Premium SKU is now generally available in all regions that Bastion is available in. | June 2024 | N/A|
| Feature | [Microsoft Entra ID support for portal (SSH)](bastion-connect-vm-ssh-linux.md#microsoft-entra-id-authentication)  |Microsoft Entra ID support for SSH connections in portal is now GA. | November 2024 | N/A|
|Feature  |  [Availability Zones for Bastion](../reliability/reliability-bastion.md?toc=/azure/bastion/TOC.json) |Availability Zones is now in public preview as a customer-enabled feature in select regions. | May 2024 | See available region list [here](../reliability/reliability-bastion.md?toc=%2Fazure%2Fbastion%2FTOC.json#regions-supported).
|SKU  |  [Bastion Developer SKU](quickstart-developer-sku.md) | Bastion Developer SKU is now in GA for select regions. | May 2024 | See available region list [here](quickstart-developer-sku.md#about-the-developer-sku).


## Next steps

* [What is Azure Bastion?](bastion-overview.md)
* [Bastion FAQ](bastion-faq.md)
* [Bastion SKUs](bastion-overview.md#sku)
