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

## Deploy an image with Marketplace terms

Some VM images in the Azure Marketplace have additional license and purchase terms that you must accept before you can deploy them programmatically.  

To deploy a VM from such an image, you'll need to both accept the image's terms and enable programmatic deployment. You'll only need to do this once per subscription. Afterward, each time you deploy a VM programmatically from the image you'll also need to specify *purchase plan* parameters.

The following sections show how to:

* Find out whether a Marketplace image has additional license terms 
* Accept the terms programmatically
* Provide purchase plan parameters when you deploy a VM programmatically

