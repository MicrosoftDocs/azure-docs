## Terminology

A Marketplace image in Azure has the following attributes:

* **Publisher** - The organization that created the image. Examples: Canonical, MicrosoftWindowsServer
* **Offer** - Name of a group of related images created by a publisher. Examples: Ubuntu Server, WindowsServer
* **SKU** - An instance of an offer, such as a major release of a distribution. Examples: 16.04-LTS, 2016-Datacenter
* **Version** - The version number of an image SKU. 

To identify a Marketplace image when you deploy a VM programmatically, supply these values as parameters. If the image publisher provides license terms you must accept before deployment, you might also need to supply additional metadata about your purchase plan. 