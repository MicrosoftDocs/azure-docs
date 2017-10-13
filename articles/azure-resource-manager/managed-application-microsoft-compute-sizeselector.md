---
title: Azure Managed Application SizeSelector UI element | Microsoft Docs
description: Describes the Microsoft.Compute.SizeSelector UI element for Azure Managed Applications
services: azure-resource-manager
documentationcenter: na
author: tabrezm
manager: timlt
editor: tysonn

ms.service: azure-resource-manager
ms.devlang: na
ms.topic: reference
ms.tgt_pltfrm: na
ms.workload: na
ms.date: 05/12/2017
ms.author: tabrezm;tomfitz

---
# Microsoft.Compute.SizeSelector UI element
A control for selecting a size for one or more virtual machine instances. You use this element when [creating an Azure Managed Application](managed-application-publishing.md).

## UI sample
![Microsoft.Compute.SizeSelector](./media/managed-application-elements/microsoft.compute.sizeselector.png)

## Schema
```json
{
  "name": "element1",
  "type": "Microsoft.Compute.SizeSelector",
  "label": "Size",
  "toolTip": "",
  "recommendedSizes": [
    "Standard_D1",
    "Standard_D2",
    "Standard_D3"
  ],
  "constraints": {
    "allowedSizes": [],
    "excludedSizes": []
  },
  "osPlatform": "Windows",
  "imageReference": {
    "publisher": "MicrosoftWindowsServer",
    "offer": "WindowsServer",
    "sku": "2012-R2-Datacenter"
  },
  "count": 2,
  "visible": true
}
```

## Remarks
- `recommendedSizes` should contain at least one size. The first recommended size is used as the default.
- If a recommended size is not available in the selected location, the size is automatically skipped. Instead, the next recommended size is used.
- Any size not specified in the `constraints.allowedSizes` is hidden, and any size not specified in `constraints.excludedSizes` is shown.
`constraints.allowedSizes` and `constraints.excludedSizes` are both optional,
but cannot be used simultaneously. The list of available sizes can be determined
by calling [List available virtual machine sizes for a subscription](/rest/api/compute/virtualmachines/virtualmachines-list-sizes-region).
- `osPlatform` must be specified, and can be either **Windows** or **Linux**. It's
used to determine the hardware costs of the virtual machines.
- `imageReference` is omitted for first-party images, but provided for third-party images. It's used to determine the software costs of the virtual machines.
- `count` is used to set the appropriate multiplier for the element. It supports
a static value, like **2**, or a dynamic value from another element, like
`[steps('step1').vmCount]`. The default value is **1**.

## Sample output
```json
"Standard_D1"
```

## Next steps
* For an introduction to managed applications, see [Azure Managed Application overview](managed-application-overview.md).
* For an introduction to creating UI definitions, see [Getting started with CreateUiDefinition](managed-application-createuidefinition-overview.md).
* For a description of common properties in UI elements, see [CreateUiDefinition elements](managed-application-createuidefinition-elements.md).
