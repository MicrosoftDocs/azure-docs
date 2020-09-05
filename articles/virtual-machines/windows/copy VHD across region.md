---
title: Upload a VHD to Azure or copy a disk across regions - Azure PowerShell
description: Learn how to upload a VHD to an Azure managed disk and copy a managed disk across regions, using Azure PowerShell, via direct upload.    
author: saggupta
ms.author: saggupta
ms.date: 09/05/2020
ms.topic: how-to
ms.service: virtual-machines
ms.tgt_pltfrm: linux
ms.subservice: disks
---

# Copy/Move an Azure VHD to another region

In this article we will walk you through the steps of copying a managed Azure disk to another supported region. We will be method of export template to copy the respective resouce to our target region.

## Prerequisites

- Make sure that your VHD is in the Azure region that you want to move from.
- To export a VHD and deploy a template to create a VHD in another region, you need to have the Network Contributor role or higher.
- Identify the source networking layout and all the resources that you're currently using. This layout includes but isn't limited to load balancers, network security groups (NSGs), and public IPs.
-	Verify that your Azure subscription allows you to create VHDs in the target region. To enable the required quota, contact support.
-	Make sure that your subscription has enough resources to support the addition of VHDs for this process. For more information, see Azure subscription and service limits, quotas, and constraints.

## Getting started

# To export the VHD and deploy the target VHD by using the Azure portal, do the following:

1.	Sign in to the Azure portal, and then select Resource Groups.
2.	Locate the resource group that contains the source VHD, and then select it.
3.	Select Settings > Export template.
4.	In the Export template pane, select Deploy.
5.	To open the parameters.json file in your online editor, select Template > Edit parameters.
6.	To edit the parameter of the VHD name, change the value property under parameters:

```
JSONCopy
{
    "$schema": "https://schema.management.azure.com/schemas/2015-01-01/deploymentParameters.json#",
    "contentVersion": "1.0.0.0",
    "parameters": {
        "VHD_name": {
            "value": "<target-VHD name>"
        }
    }
}
```

7.	In the editor, change the source VHD name value in the editor to a name that you want for the target VHD. Be sure to enclose the name in quotation marks.
8.	Select Save in the editor.
9.	To open the template.json file in the online editor, select Template > Edit template.
10.	In the online editor, to edit the target region where the VHD will be moved, change the location property under resources:

```
JSONCopy
 "resources": [
        {
            "type": "Microsoft.Compute/disks",
            "apiVersion": "2019-07-01",
            "name": "[parameters(VHD_Name)]",
            "location": "<Target-Region>",
            "sku": {
                "name": "<Premium_LRS>",
                "tier": "Premium"
            },
            "properties": {
                "osType": "<OSType>",
                "hyperVGeneration": "<V1/V2>",
                "creationData": {
                    "createOption": "<Your_Create_method>",
                    "imageReference": {
                        "id": "<Image_reference_id>"
                    }
                },
                "diskSizeGB": <disk_size>,
                "diskIOPSReadWrite": <diskIOPSReadWrite>,
                "diskMBpsReadWrite": <diskMBpsReadWrite>,
                "encryption": {
                                    "type": "<Encryption_type>"
                }


```

11.	To obtain region location codes, see Azure Locations. The code for a region is the region name, without spaces (for example, Central US = centralus).
12.	In the online editor, select Save.
13.	To choose the subscription where the target VHD will be deployed, select Basics > Subscription.
14.	To choose the resource group where the target VHD will be deployed, select Basics > Resource group.
If you need to create a new resource group for the target VHD, select Create new. Make sure that the name isn't the same as the source resource group name in the existing VHD.
15.	Verify that Basics > Location is set to the target location where you want the VHD to be deployed.
16.	Under Settings, verify that the name matches the name that you entered previously in the parameters editor.
17.	Select the Terms and Conditions check box.
18.	To deploy the target VHD, select Purchase.

# Note: Your VHD will be copied to the target region and then you can deploy a new VM using the VHD.

