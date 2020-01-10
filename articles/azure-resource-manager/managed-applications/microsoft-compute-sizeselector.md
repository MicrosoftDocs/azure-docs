---
title: SizeSelector UI element
description: Describes the Microsoft.Compute.SizeSelector UI element for Azure portal. Use for selecting the size of a virtual machine.
author: tfitzmac

ms.topic: conceptual
ms.date: 06/27/2018
ms.author: tomfitz

---
# Microsoft.Compute.SizeSelector UI element

A control for selecting a size for one or more virtual machine instances.

## UI sample

The user sees a selector with default values from the element definition.

![Microsoft.Compute.SizeSelector](./media/managed-application-elements/microsoft.compute.sizeselector.png)

After selecting the control, the user sees an expanded view of the available sizes.

![Microsoft.Compute.SizeSelector expanded](./media/managed-application-elements/microsoft.compute.sizeselector-expanded.png)

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
    "excludedSizes": [],
    "numAvailabilityZonesRequired": 3,
    "zone": "3"
  },
  "options": {
    "hideDiskTypeFilter": false
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

## Sample output

```json
"Standard_D1"
```

## Remarks

- `recommendedSizes` should have at least one size. The first recommended size is used as the default. The list of available sizes isn't sorted by the recommended state. The user can select that column to sort by recommended state.
- If a recommended size isn't available in the selected location, the size is automatically skipped. Instead, the next recommended size is used.
- `constraints.allowedSizes` and `constraints.excludedSizes` are both optional, but can't be used simultaneously. The list of available sizes can be determined by calling [List available virtual machine sizes for a subscription](/rest/api/compute/virtualmachines/virtualmachines-list-sizes-region). Any size not specified in the `constraints.allowedSizes` is hidden, and any size not specified in `constraints.excludedSizes` is shown.
- `osPlatform` must be specified, and can be either **Windows** or **Linux**. It's used to determine the hardware costs of the virtual machines.
- `imageReference` is omitted for first-party images, but provided for third-party images. It's used to determine the software costs of the virtual machines.
- `count` is used to set the appropriate multiplier for the element. It supports a static value, like **2**, or a dynamic value from another element, like `[steps('step1').vmCount]`. The default value is **1**.
- The `numAvailabilityZonesRequired` can be 1, 2, or 3.
- By default, `hideDiskTypeFilter` is **false**. The disk type filter enables the user to see all disk types or only SSD.

## Next steps

* For an introduction to creating UI definitions, see [Getting started with CreateUiDefinition](create-uidefinition-overview.md).
* For a description of common properties in UI elements, see [CreateUiDefinition elements](create-uidefinition-elements.md).
