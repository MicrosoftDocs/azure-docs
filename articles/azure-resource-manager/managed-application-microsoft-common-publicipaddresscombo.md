---
title: Azure Managed Application PublicIpAddressCombo UI element | Microsoft Docs
description: Describes the Microsoft.Network.PublicIpAddressCombo UI element for Azure Managed Applications
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
# Microsoft.Network.PublicIpAddressCombo UI element
A group of controls for selecting a new or existing public IP address.

## UI sample
![Microsoft.Network.PublicIpAddressCombo](./media/managed-application-elements/microsoft.network.publicipaddresscombo.png)

- If the user selects no public IP address (i.e. 'None'), then the domain name
label text box will be hidden.
- If the user selects an existing public IP address, then the domain name
label text box will be disabled and its value will be the domain name label of
the selected IP address.
- The domain name suffix (e.g. westus.cloudapp.azure.com) will update
automatically based on the selected location.

## Schema
```json
{
  "name": "element1",
  "type": "Microsoft.Network.PublicIpAddressCombo",
  "label": {
    "publicIpAddress": "Public IP address",
    "domainNameLabel": "Domain name label"
  },
  "toolTip": {
    "publicIpAddress": "",
    "domainNameLabel": ""
  },
  "defaultValue": {
    "publicIpAddressName": "ip01",
    "domainNameLabel": "foobar"
  },
  "constraints": {
    "required": {
      "domainNameLabel": true
    }
  },
  "options": {
    "hideNone": false,
    "hideDomainNameLabel": false,
    "hideExisting": false
  },
  "visible": true
}
```

## Remarks
- If `constraints.required.domainNameLabel` is set to `true`, then the a domain
name label must be provided when creating a new public IP address, and existing
public IP addresses that don't have a label will be made unavailable for
selection.
- If `options.hideNone` is set to `true`, then the option to select 'None' for
the public IP address will be hidden. The default value is `false`.
- If `options.hideDomainNameLabel` is set to `true`, then the text box for
domain name label will be hidden. The default value is `false`.
- If `options.hideExisting` is true, then the user won't be able to choose an
existing public IP address. The default value is `false`.

## Output
If the user selects no public IP address, then this is the expected output:
```json
{
  "newOrExistingOrNone": "none"
}
```

If the user selects a new or existing IP address, then this is the expected
output:
```json
{
  "name": "ip01",
  "resourceGroup": "rg01",
  "domainNameLabel": "foobar",
  "newOrExistingOrNone": "new"
}
```
- When `options.hideNone` is specified, `newOrExistingOrNone` will always return
`none`.
- When `options.hideDomainNameLabel` is specified, `domainNameLabel` will be
undeclared.

## Next Steps
* For an introduction to Azure Resource Manager, see [Azure Resource Manager overview](resource-group-overview.md).
