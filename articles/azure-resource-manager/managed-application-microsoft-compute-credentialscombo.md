---
title: Azure Managed Application CredentialsCombo UI element | Microsoft Docs
description: Describes the Microsoft.Compute.CredentialsCombo UI element for Azure Managed Applications
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
# Microsoft.Compute.CredentialsCombo UI element
A group of controls with built-in validation for Windows and Linux passwords and SSH public keys. You use this element when [creating an Azure Managed Application](managed-application-publishing.md).

## UI sample
![Microsoft.Compute.CredentialsCombo](./media/managed-application-elements/microsoft.compute.credentialscombo.png)

## Schema
If `osPlatform` is **Windows**, then the following schema is used:
```json
{
  "name": "element1",
  "type": "Microsoft.Compute.CredentialsCombo",
  "label": {
    "password": "Password",
    "confirmPassword": "Confirm password"
  },
  "toolTip": {
    "password": ""
  },
  "constraints": {
    "required": true,
    "customPasswordRegex": "^(?=.*[A-Za-z])(?=.*\\d)[A-Za-z\\d]{8,}$",
    "customValidationMessage": "The password must contain at least 8 characters, with at least 1 letter and 1 number."
  },
  "options": {
    "hideConfirmation": false
  },
  "osPlatform": "Windows",
  "visible": true
}
```

If `osPlatform` is **Linux**, then the following schema is used:
```json
{
  "name": "element1",
  "type": "Microsoft.Compute.CredentialsCombo",
  "label": {
    "authenticationType": "Authentication type",
    "password": "Password",
    "confirmPassword": "Confirm password",
    "sshPublicKey": "SSH public key"
  },
  "toolTip": {
    "authenticationType": "",
    "password": "",
    "sshPublicKey": ""
  },
  "constraints": {
    "required": true,
    "customPasswordRegex": "^(?=.*[A-Za-z])(?=.*\\d)[A-Za-z\\d]{8,}$",
    "customValidationMessage": "The password must contain at least 8 characters, with at least 1 letter and 1 number."
  },
  "options": {
    "hideConfirmation": false,
    "hidePassword": false
  },
  "osPlatform": "Linux",
  "visible": true
}
```

## Remarks
- `osPlatform` must be specified, and can be either **Windows** or **Linux**.
- If `constraints.required` is set to **true**, then the password or SSH public
key text boxes must contain values to validate successfully. The default value
is **true**.
- If `options.hideConfirmation` is set to **true**, then the second text box for
confirming the user's password is hidden. The default value is **false**.
- If `options.hidePassword` is set to **true**, then the option to use password
authentication is hidden. It can be used only when `osPlatform` is **Linux**. The
default value is **false**.
- Additional constraints on the allowed passwords can be implemented by using
the `customPasswordRegex` property. The string in `customValidationMessage`
is displayed when a password fails custom validation. The default value
for both properties is **null**.

## Sample output
If `osPlatform` is **Windows**, or the user provided a password instead of an SSH
public key, then the following output is expected:

```json
{
  "authenticationType": "password",
  "password": "p4ssw0rd",
}
```

If the user provided an SSH public key, then the following output is expected:
```json
{
  "authenticationType": "sshPublicKey",
  "sshPublicKey": "AAAAB3NzaC1yc2EAAAABIwAAAIEA1on8gxCGJJWSRT4uOrR13mUaUk0hRf4RzxSZ1zRbYYFw8pfGesIFoEuVth4HKyF8k1y4mRUnYHP1XNMNMJl1JcEArC2asV8sHf6zSPVffozZ5TT4SfsUu/iKy9lUcCfXzwre4WWZSXXcPff+EHtWshahu3WzBdnGxm5Xoi89zcE=",
}
```

## Next steps
* For an introduction to managed applications, see [Azure Managed Application overview](managed-application-overview.md).
* For an introduction to creating UI definitions, see [Getting started with CreateUiDefinition](managed-application-createuidefinition-overview.md).
* For a description of common properties in UI elements, see [CreateUiDefinition elements](managed-application-createuidefinition-elements.md).
