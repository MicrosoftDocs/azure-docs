---
title: CredentialsCombo UI element
description: Describes the Microsoft.Compute.CredentialsCombo UI element for Azure portal.
ms.topic: conceptual
ms.date: 08/01/2022
---

# Microsoft.Compute.CredentialsCombo UI element

The `CredentialsCombo` element is a group of controls with built-in validation for Windows passwords, and Linux passwords or SSH public keys.

## UI sample

For Windows, the password control is displayed.

:::image type="content" source="./media/managed-application-elements/microsoft-compute-credentialscombo-windows.png" alt-text="Screenshot of the credentials combo user-interface element for a Windows password.":::

For Linux with **Password** selected, the password control is displayed:

:::image type="content" source="./media/managed-application-elements/microsoft-compute-credentialscombo-linux-password.png" alt-text="Screenshot of the credentials combo user-interface element for a Linux password.":::

For Linux with **SSH public key** selected, the SSH key control is displayed:

:::image type="content" source="./media/managed-application-elements/microsoft-compute-credentialscombo-linux-key.png" alt-text="Screenshot of the credentials combo user-interface element for a Linux SSH public key.":::

The **SSH public key source** has three options:

- **Generate new key pair**: Provide a name to create a new SSH key pair in Azure.
- **Use existing key stored in Azure**: Select an existing SSH public key that's stored in Azure.
- **Use existing public key**: Use an SSH public key that you've already created. For example, an SSH public key that was created on a local computer.

:::image type="content" source="./media/managed-application-elements/microsoft-compute-credentialscombo-linux-key-options.png" alt-text="Screenshot of the credentials combo user-interface element with options for Linux SSH public key.":::

For the **Generate new key pair** option, the keys are generated on the **Review+Create** tab after you select **Create** and **Download private key and create resource**.

:::image type="content" source="./media/managed-application-elements/microsoft-compute-credentialscombo-linux-new-key.png" alt-text="Screenshot to generate new SSH key pair, and select download private key and create resource.":::

## Schema

For Windows, use the following schema:

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
    "customPasswordRegex": "^(?=.*[A-Za-z])(?=.*\\d)[A-Za-z\\d]{12,}$",
    "customValidationMessage": "The password must be alphanumeric, contain at least 12 characters, and have at least 1 letter and 1 number."
  },
  "options": {
    "hideConfirmation": false
  },
  "osPlatform": "Windows",
  "visible": true
}
```

For **Linux**, use the following schema:

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
    "customPasswordRegex": "^(?=.*[A-Za-z])(?=.*\\d)[A-Za-z\\d]{12,}$",
    "customValidationMessage": "The password must be alphanumeric, contain at least 12 characters, and have at least 1 letter and 1 number."
  },
  "options": {
    "hideConfirmation": false,
    "hidePassword": false
  },
  "osPlatform": "Linux",
  "visible": true
}
```

## Sample output

If `osPlatform` is **Windows**, or `osPlatform` is **Linux** and the user provided a password instead of an SSH public key, the control returns the following output:

```json
{
  "authenticationType": "password",
  "password": "p4ssw0rddem0",
}
```

If `osPlatform` is **Linux** and the user provided an SSH public key, the control returns the following output:

```json
{
  "authenticationType": "sshPublicKey",
  "sshPublicKey": "AAAAB3NzaC1yc2EAAAABIwAAAIEA1on8gxCGJJWSRT4uOrR13mUaUk0hRf4RzxSZ1zRbYYFw8pfGesIFoEuVth4HKyF8k1y4mRUnYHP1XNMNMJl1JcEArC2asV8sHf6zSPVffozZ5TT4SfsUu/iKy9lUcCfXzwre4WWZSXXcPff+EHtWshahu3WzBdnGxm5Xoi89zcE=",
  "sshKeyName": "demo-public-key-name",
  "generateNewSshKey": false
}
```

- When **Generate new key pair** is selected, the `sshPublicKey` property is empty. The reason is because on the **Review+Create** tab the keys are generated after you select **Create** and **Download private key and create resource**.
- The `sshKeyName` property contains a name only when a new SSH key pair is generated in Azure or for a key that's already stored in Azure.
- The `generateNewSshKey` is **false** when you use an existing key. When a new key pair is generated, the value is **true**.

## Remarks

- `osPlatform` must be specified, and can be either **Windows** or **Linux**.
- If `constraints.required` is set to **true**, then the password or SSH public key text boxes must have values to validate successfully. The default value is **true**.
- If `options.hideConfirmation` is set to **true**, then the second text box for confirming the user's password is hidden. The default value is **false**.
- If `options.hidePassword` is set to **true**, then the option to use password authentication is hidden. It can be used only when `osPlatform` is **Linux**. The default value is **false**.
- More constraints on the allowed passwords can be implemented by using the `customPasswordRegex` property. The string in `customValidationMessage` is displayed when a password fails custom validation. The default value for both properties is **null**. The schema shows an example of each property.

## Next steps

- For an introduction to creating UI definitions, see [Getting started with CreateUiDefinition](create-uidefinition-overview.md).
- For a description of common properties in UI elements, see [CreateUiDefinition elements](create-uidefinition-elements.md).
