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
ms.date: 05/09/2017
ms.author: tabrezm;tomfitz

---
# Microsoft.Compute.SizeSelector UI element
A control for selecting a size for one or more virtual machine instances.

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
by calling [this API](https://msdn.microsoft.com/library/azure/mt269440.aspx).
- `osPlatform` must be specified, and can be either `Windows` or `Linux`. It's
used to determine the hardware costs of the virtual machines.
- `imageReference` is omitted for first-party images, but provided for third-party images. It's used to determine the software costs of the virtual machines.
- `count` is used to set the appropriate multiplier for the element. It supports
a static value, like `2`, or a dynamic value from another element, like
`[steps('step1').vmCount]`. The default value is `1`.

## Output
```json
"Standard_D1"
```

## Next Steps
* For an introduction to Azure Resource Manager, see [Azure Resource Manager overview](resource-group-overview.md).
