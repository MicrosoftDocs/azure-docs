---
 title: include file
 description: include file
 services: virtual-machines-windows, virtual-machines-linux
 author: dlepow
 ms.service: multiple
 ms.topic: include
 ms.date: 09/28/2018
 ms.author: danlep
 ms.custom: include file
---

## Deploy an image with Marketplace terms

Certain VM images in the Azure Marketplace have additional license and purchase terms that you must accept before you can deploy them programmatically.  

To deploy a VM from such an image, you need to accept the image's terms and enable programmatic deployment. You only need to do this one time in your subscription. Then, each time you deploy a VM programmatically from the image, you also need to specify *purchase plan* parameters.

The following sections show how to:

* Find out if a Marketplace image has additional license terms 
* Accept the terms programmatically
* Provide purchase plan parameters when you deploy a VM programmatically

