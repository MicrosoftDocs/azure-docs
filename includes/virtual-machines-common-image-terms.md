---
 title: include file
 description: include file
 services: virtual-machines-windows, virtual-machines-linux
 author: dlepow
 ms.service: multiple
 ms.topic: include
 ms.date: 10/09/2018
 ms.author: danlep
 ms.custom: include file
---

## Terminology

A Marketplace image in Azure has the following attributes:

* **Publisher**: The organization that created the image. Examples: Canonical, MicrosoftWindowsServer
* **Offer**: The name of a group of related images created by a publisher. Examples: UbuntuServer, WindowsServer
* **SKU**: An instance of an offer, such as a major release of a distribution. Examples: 18.04-LTS, 2019-Datacenter
* **Version**: The version number of an image SKU. 

To identify a Marketplace image when you deploy a VM programmatically, supply these values individually as parameters. Some tools accept an image *URN*, which combines these values, separated by the colon (:) character: *Publisher*:*Offer*:*Sku*:*Version*. In a URN, you can replace the version number with "latest", which selects the latest version of the image. 

If the image publisher provides additional license and purchase terms, then you must accept those terms and enable programmatic deployment. You'll also need to supply *purchase plan* parameters when deploying a VM programmatically. See [Deploy an image with Marketplace terms](#deploy-an-image-with-marketplace-terms).
