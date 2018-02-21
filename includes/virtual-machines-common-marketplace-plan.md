## Deploy a licensed image

To identify a commonly used Marketplace image through programmatic tools, usually you only need to supply the image publisher, offer, SKU, and version parameters (or a URN that combines these values). However, certain VM images in the Azure Marketplace have additional license terms that you must accept before you can deploy them programmatically using Azure command-line tools, Resource Manager templates, or APIs.  

If you need to accept license terms for an image, you also need to provide *purchase plan* parameters when you deploy a VM from the image.

The following sections explain how to find out if an image has license terms you must accept, and how to supply the purchase plan parameters.

