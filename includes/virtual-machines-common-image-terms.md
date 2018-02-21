## Terminology

A Marketplace image in Azure has the following attributes:

* **Publisher** - The organization that created the image. Examples: Canonical, MicrosoftWindowsServer
* **Offer** - Name of a group of related images created by a publisher. Examples: Ubuntu Server, WindowsServer
* **SKU** - An instance of an offer, such as a major release of a distribution. Examples: 16.04-LTS, 2016-Datacenter
* **Version** - The version number of an image SKU. 

To identify a Marketplace image when you deploy a VM programmatically, supply these values individually as parameters, or in some tools provide the image *URN*. The URN combines these values, separated by the colon (:) character: *Publisher*:*Offer*:*Sku*:*Version*. 

If the image publisher provides license terms you must accept before deployment, you also need to supply additional parameters for your purchase plan. 