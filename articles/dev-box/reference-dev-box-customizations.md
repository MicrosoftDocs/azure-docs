---  
title: 'Reference: imagedefinition.yaml and task.yaml Files'
description: Reference for customizing Dev Box environments by using devbox.yaml and task.yaml files, including built-in tasks and parameters.
author: RoseHJM  
ms.service: dev-box  
ms.topic: reference  
ms.date: 05/09/2025  
ms.author: rosemalcolm
ms.custom:
  - build-2025
---  

# Customizations schema reference

This reference article provides detailed information about the `imagedefinition.yaml` and `task.yaml` files that are used to customize Microsoft Dev Box. Developers can use these YAML files to define tasks for provisioning and configuring dev boxes. The files help to ensure consistency and efficiency across development environments. This article covers the schema, required attributes, and examples for both file types, along with built-in tasks like PowerShell and WinGet.

## Imagedefinition.yaml files

You can use a Dev Box YAML file to define customization tasks that ought to run during Dev Box creation. A `devbox.yaml` file might live in the same repository as the primary source that the dev team uses, or the file might be in a centralized repository of configurations.

Example image definition YAML:

```
$schema: 1.0
name: project-sample-1
image: MicrosoftWindowsDesktop_windows-ent-cpc_win11-21h2-ent-cpc-m365
tasks:
- name: "powershell"
  inputs:
    command:
```

### name

**Required:** This friendly name for the image definition is associated with this `devbox.yaml` file. This setting controls the name of the image definition that's available when you create and update pools.

```
name: myVSDevBox
```

### image

**Required:** The image that you want to use as the base image for your image definition can be a marketplace image:

```
image: MicrosoftWindowsDesktop_windows-ent-cpc_win11-21h2-ent-cpc-m365
```

Or it can be a custom image from an attached Azure Compute Gallery instance:

```
image: galleryname/imagename@version
```
To learn how to attach an Azure Compute Gallery instance to your dev center, see [Configure Azure Compute Gallery for Microsoft Dev Box](how-to-configure-azure-compute-gallery.md).


To get a list of images to which your dev center has access, use this `az cli` command:

```
az devcenter admin image list --dev-center-name CustomizationsImagingHQ --resource-group TeamCustomizationsImagingRG --query "[].name"
```

You need the dev center `az cli` extension:

```
az extension add --name devcenter
```

### tasks

**Required:** This object collection is made up of Dev Box customization tasks to run when you provision a dev box. The specific inputs that are provided to a task vary by task.

Example:

```
tasks:
- name: winget
  parameters:
    package: GitHub.GitHubDesktop
```

All tasks support the `timeout` parameter, which is optional.

Example:

```
tasks:
- name: powershell
  parameters:
    command: <command>
    timeout: 1800 # in seconds
```

### Built-in tasks

PowerShell and WinGet are available as built-in tasks. You can invoke them directly without attaching a catalog at the dev center level that defines the implementation of these tasks.

#### WinGet built-in task

This built-in task applies a WinGet configuration to the dev box.

**Parameters:**

- `configurationFile`:
  - Type: `string`
  - The path to the WinGet config YAML file. The file must be located in the local machine.
  - Required: `false`

- `downloadUrl`:
  - Type: `string`
  - A publicly accessible URL where the config YAML file is stored. The file is downloaded to the path that `configurationFile` specifies.
  - Required: `false`

- `inlineConfigurationBase64`:
  - Type: `string`
  - A Base64-encoded string of the WinGet config YAML file. The file is decoded to the path that `configurationFile` specifies or to a temporary file if it isn't specified.
  - Required: `false`

- `package`:
  - Type: `string`
  - The name of the package to install.
  - If a config YAML file is provided under other parameters, the package name isn't needed.
  - Required: `false`

- `version`
  - Type: `string`
  - The version of the package to install.
  - If a config YAML file is provided under other parameters, there's no need for the package version.
  - Required: `false`

#### PowerShell built-in task

This built-in task runs a PowerShell command.

**Parameters:**

- `command`:
  - Type: `string`
  - The command to run.
  - Required: `true`

## task.yaml files

Customization tasks are reusable units of installation code or environment configuration. Developers use PowerShell scripts to write them and use a `task.yaml` metadata file to describe them. Developers use these tasks to customize a dev box by referencing them from a `devbox.yaml` file.

When you define customization tasks, you can identify the tasks that are available to your developers for use in `devbox.yaml` files. You can restrict high-privilege actions, such as the ability to run any PowerShell command.

The following example of a task definition runs a PowerShell command in a specific working directory:

```
name: powershell
description: Execute a powershell command
author: Microsoft Corporation
command: ".\runcommand.ps1 -command {{command}} -workingDirectory {{workingDirectory}}"
inputs:
  command:
    type: string
    defaultValue: ""
    required: true
    description: The command to execute
  workingDirectory:
    type: string
    defaultValue: ""
    required: false
    description: The working directory to execute the command in
```

### Attributes

#### name

**Required:** This unique identifier is used to refer to a task from `devbox.yaml`. The name must be unique in the context of the catalog where the task exists.

Naming must match existing Azure resource constraints. The name must be between 3 and 63 characters. It must start with an alphanumeric character. The name must consist of only alphanumeric characters and "-", ".", or "_". The "/" character is reserved.

  ```
  name: powershell
  ```

#### description

  **Optional:** This attribute describes the task.

  ```
  description: This task executes a powershell command
  ```

#### inputs

**Required:** This attribute lists the parameters that this task takes as an input from a `devbox.yaml` file and uses while it runs the command. Each parent item represents the name of a parameter and supports these keys:

  - `type` (required): The input data type for this parameter. Can be `string` or `int`.
  - `defaultValue` (required): The default value this parameter takes.
  - `required` (required): The key that specifies whether this parameter is optional or required.
  - `description` (required): A description of what this parameter represents.

  ```
  inputs:
    command:
      type: string
      defaultValue: ""
      required: true
      description: The command to execute
  ```

#### command

  **Required:** This command is used to fulfill this task. The provided command string runs in Windows PowerShell on the local machine.

  ```
  command: ".\runcommand.ps1
  ```

#### Reference variables in commands

To reference parameters in a command, specify the variable name in double braces, for example, `{{parameter_name}}`. The values of these variables are interpolated before your command runs.

  ```
  command: ".\runcommand.ps1 -command {{command}} -workingDirectory {{workingDirectory}}"
  ```

#### timeout

  **Optional:** This variable specifies the maximum amount of time (in minutes) to wait for task execution to complete before the task times out. The default is 30 minutes.

  ```
  timeout: 30
  ```

#### author

**Optional:** This variable identifies the task author to help with audits and troubleshooting.

  ```
  author: Contoso Corporation
  ```

#### documentationURL

**Optional:** This variable links to the documentation for this task.

  ```
  documentationURL: "https://link.to/documentation"
  ```

#### licenseURL

**Optional:** This variable links to the license for this task.

  ```
  licenseURL: "https://link.to/license"
  ```
