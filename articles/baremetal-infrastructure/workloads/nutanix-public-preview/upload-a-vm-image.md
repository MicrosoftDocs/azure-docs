---
title: Upload a VM image
description: 
ms.topic: how-to
ms.subservice:  
ms.date: 03/31/2021
---

# Upload a VM image

To upload a VM image in the Prism Central, perform the following: 
1. Log on to the Prism Element web console. 
1. Launch Prism Central. 
1. Click the gear icon in the main menu and select Compute & Storage > Images. 
1. On the Images page, click Add Image. 
1. On the Add Images page, select the Image Source: 
    - Image File - upload an image from a workstation 
    - URL - upload an image from a remote server  
    - VM Disk - upload an image from a VM disk 
1. After you have added all the image files you want, click Next. The Select Location page appears.
1. In Placement Method, do one of the following: 
    - To manually select the target clusters, click Place image directly on clusters, and then do one of the following in the Cluster Details section:
        1. If you want to upload the images to all registered clusters, make sure to select All clusters, and then click Save. 
        1. If you want to upload to only a subset of the registered clusters, clear All clusters, select the clusters you want from the list, and then click Save. 
    - To delegate image placement decisions to configured policies and assign categories to the images, click Place image using Image Placement policies, and then do the following in the Categories section: 
        1. Click inside the Categories search box and select the category you want from the list. You can also start typing the name of the category to reduce the list to matching names. 
        1. To specify another category, click the add icon beside the search box.
        Repeat this step to add as many categories as you need.  

Prism Central uploads the image files in batches and takes some time to enforce the image placement policies. 



## Next steps

Learn more about Nutanix:

> [!div class="nextstepaction"]
> [About the Public Preview](about-the-public-preview.md)
