---  
title: 'Reference: imagedefinition.yaml and task.yaml files'  
description: Reference for customizing Dev Box environments using devbox.yaml and task.yaml files, including built-in tasks and parameters.  
author: RoseHJM  
ms.service: dev-box  
ms.topic: reference  
ms.date: 05/09/2025  
ms.author: rosemalcolm  

---  

# Customizations Schema Reference

This reference guide provides detailed information about the `imagedefinition.yaml` and `task.yaml` files used to customize Microsoft Dev Box. These YAML files enable developers to define tasks for provisioning and configuring Dev Boxes, ensuring consistency and efficiency across development environments. The guide covers the schema, required attributes, and examples for both file types, along with built-in tasks like PowerShell and Winget.

## Imagedefinition.yaml files

A Dev Box yaml allows you to define customization tasks that ought to run during Dev Box creation. A devbox.yaml file might live in the same repository as the primary source code being used by the dev team, or in a centralized repository of configurations.

Example Image Definition yaml:

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

**Required**

A friendly name for the image definition associated with this devbox.yaml. This setting controls the name of the image definition available when creating and updating pools.

```
name: myVSDevBox
```

### image

**Required**

The image you would like to use as the base image for your image definition. This image can be a marketplace image:

```
image: MicrosoftWindowsDesktop_windows-ent-cpc_win11-21h2-ent-cpc-m365
```

Or a custom image from an attached Azure Compute Gallery:

```
image: galleryname/imagename@version
```
To learn how to attach an Azure Compute Gallery to your DevCenter, see [Configure Azure Compute Gallery for Microsoft Dev Box](how-to-configure-azure-compute-gallery.md).


To get a list of images that your DevCenter has access to, use this az cli command:

```
az devcenter admin image list --dev-center-name CustomizationsImagingHQ --resource-group TeamCustomizationsImagingRG --query "[].name"
```

You would need the DevCenter az cli extension:

```
az extension add --name devcenter
```

### tasks

**Required**

An object collection of Dev Box customization tasks to be executed when provisioning a Dev Box. The specific inputs provided to a task vary by task.

Example:

```
tasks:
- name: winget
  parameters:
    package: GitHub.GitHubDesktop
```

The **timeout** parameter is supported by all tasks and is optional.

Example:

```
tasks:
- name: powershell
  parameters:
    command: <command>
    timeout: 1800 # in seconds
```

### Built-in tasks

PowerShell and Winget are available as built-in tasks and can be invoked directly without attaching a DevCenter-level catalog that defines the implementation of these tasks.

#### Winget built-in task

Applies a winget configuration to the Dev Box.

**Parameters:**

- **configurationFile**  
  - type: "string"  
  - The path to the winget config yaml file. The file must be located in the local machine.  
  - required: false  

- **downloadUrl**  
  - type: "string"  
  - A publicly accessible URL where the config yaml file is stored. The file is downloaded to the path given in 'configurationFile'.  
  - required: false  

- **inlineConfigurationBase64**  
  - type: "string"  
  - A base64 encoded string of the winget config yaml file. The file is decoded to the path given in 'configurationFile' or to a temporary file if not specified.  
  - required: false  

- **package**  
  - type: "string"  
  - The name of the package to install.   
  - If a config yaml file is provided under other parameters, there's no need for the package name.  
  - required: false  

- **version**  
  - type: "string"  
  - The version of the package to install.  
  - If a config yaml file is provided under other parameters, there's no need for the package version.  
  - required: false  

#### PowerShell built-in task

Execute a PowerShell command.

**Parameters:**

- **command**  
  - type: "string"  
  - The command to execute.  
  - required: true  

## task.yaml files

Customization tasks are reusable units of installation code or environment configuration – written using PowerShell scripts and described using a task.yaml metadata file. These tasks are then used by devs to customize a dev box by referencing them from a devbox.yaml file.

By defining customization tasks, you can define a guardrailed palette of what tasks are available to your developers for use in devbox.yamls, without providing high-privilege actions such as the ability to run any PowerShell command.

Example of a task definition that executes a PowerShell command in a specific working directory:

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

### Attributes:

#### name  
  **Required**  
  The unique identifier used to refer to a task from devbox.yaml. The name should be unique in the context of the catalog where the task exists.  
  Naming must match existing Azure Resource constraints: The name must be between 3 and 63 characters and must start with an alphanumeric character and consist of only alphanumeric characters and '-', '.', or '_'. The "/" character is reserved.  

  ```
  name: powershell
  ```

#### description
  **Optional**  
  Description of the task.  

  ```
  description: This task executes a powershell command
  ```

#### inputs  
  **Required**  
  List of parameters that this task takes as an input from a devbox.yaml and utilizes while executing the command. Each parent item represents the name of a parameter and supports these keys:  

  - **type** [required]: input data type for this parameter. Can be string, int.  
  - **defaultValue** [required]: default value this parameter takes.  
  - **required** [required]: specifies whether this parameter is optional or required.  
  - **description** [required]: a description of what this parameter represents.  

  ```
  inputs:
    command:
      type: string
      defaultValue: ""
      required: true
      description: The command to execute
  ```

#### command
  **Required**  
  The command to execute to fulfill this task. The provided command string would be executed in Windows PowerShell on the local machine.  

  ```
  command: ".\runcommand.ps1
  ```

#### Referencing variables in command
  To reference parameters in a command, you can specify the variable name in Handlebar style double braces {{parameter_name}}. The values of these variables are interpolated before your command is executed.  

  ```
  command: ".\runcommand.ps1 -command {{command}} -workingDirectory {{workingDirectory}}"
  ```

#### timeout  
  **Optional**  
  The maximum amount of time (in minutes) to wait for task execution to complete, before timing out the task. Defaults to 30 minutes.  

  ```
  timeout: 30
  ```

#### author  
  **Optional**  
  Identifier of a task author – to help with audits and troubleshooting.  

  ```
  author: Contoso Corporation
  ```

#### documentationURL  
  **Optional**  
  Link to documentation for this task.  

  ```
  documentationURL: "https://link.to/documentation"
  ```

#### licenseURL 
  **Optional**  
  Link to the license for this task.  

  ```
  licenseURL: "https://link.to/license"
  ```