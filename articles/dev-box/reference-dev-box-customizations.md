---
title: 'Reference: imagedefinition.yaml and task.yaml files'
description: Review the current imagedefinition.yaml and task.yaml schema for Microsoft Dev Box customizations, including built-in GitClone, PowerShell, and WinGet tasks.
author: RoseHJM
ms.service: dev-box
ms.topic: reference
ms.date: 06/11/2026
ms.author: rosemalcolm
ms.custom:
  - build-2025
---

# Customizations schema reference

Microsoft Dev Box customizations let platform engineers and developers preinstall tools, clone repositories, and configure settings on dev boxes by using YAML files. This reference describes the current schema for the YAML files and built-in tasks that Dev Box customizations support.

Use this reference when you need to:

- Look up the properties, types, and defaults that are valid in an *imagedefinition.yaml* or *task.yaml* file.
- Confirm the parameters that the built-in `~/gitclone`, `~/powershell`, and `~/winget` tasks accept.
- Understand how `tasks`, `userTasks`, `parameters`, `variables`, and `buildProperties` work together when Dev Box provisions an image or applies customizations to a dev box.

## Customization file types

Dev Box customizations use three YAML file types, each with a different purpose and audience:

| File | Purpose | Author | Where it runs |
|---|---|---|---|
| `imagedefinition.yaml` | Defines a reusable image for a dev box pool. Lists the base image, parameters, variables, system tasks, user tasks, and build properties to apply when Dev Box creates an image definition. | Platform engineer or team lead | Stored in a catalog attached to a project; applied to every dev box created from a pool that references the image definition. |
| `task.yaml` | Defines a reusable, parameterized customization task that's added to a catalog. Lets administrators wrap PowerShell logic with metadata, parameter validation, documentation, and execution settings. | Platform engineer | Stored in a catalog attached to a dev center; called by name from `imagedefinition.yaml` or `devbox.yaml` files. |
| `devbox.yaml` | Personal user customization file uploaded during dev box creation. Applies only to the dev box it's attached to. | Individual developer | Uploaded from local disk or referenced from a repository in the developer portal. |

Built-in `~/gitclone`, `~/powershell`, and `~/winget` tasks are available from any dev center without attaching a catalog. To add custom tasks beyond those built-ins, define them in `task.yaml` files in a catalog and call them by name from your image definition or user customization file. For more information, see [Microsoft Dev Box customizations](concept-what-are-dev-box-customizations.md).

## Imagedefinition.yaml files

Use `imagedefinition.yaml` to define the image, parameters, variables, and customization tasks that Dev Box applies when it creates an image definition.

### Example imagedefinition.yaml file

```yaml
$schema: "1.0"
name: example-image-definition
description: Install core tools and clone the project repository.
image: microsoftvisualstudio_visualstudioplustools_vs-2022-ent-general-win11-m365-gen2
parameters:
  repositoryBranch:
    type: string
    default: main
    description: Branch to clone during setup.
variables:
  workspaceRoot:
    type: string
    value: C:\Workspaces
    description: Root directory for repositories.
tasks:
  - name: ~/winget
    parameters:
      package: Git.Git
  - name: ~/gitclone
    parameters:
      repositoryUrl: https://github.com/example-org/example-repo.git
      directory: C:\Workspaces
      branch: "{{repositoryBranch}}"
userTasks:
  - name: ~/powershell
    parameters:
      command: code C:\Workspaces\example-repo
buildProperties:
  networkConnection: corp-westus3
```

### Imagedefinition.yaml properties

|Property|Required|Type|Description|
|---|---|---|---|
|[$schema](#schema)||string or number|Specifies the schema version for the file.|
|[name](#name)|✅|string|Defines the friendly name for the image definition.|
|[description](#description)||string|Describes the image definition.|
|[image](#image)|✅|string|Identifies the base image to use for the dev box image.|
|[parameters](#parameters)||object|Defines input parameters that tasks can reference in the image definition.|
|[variables](#variables)||object|Defines reusable values for the image definition.|
|[tasks](#tasks)||array of task objects|Lists system-context customization tasks to run during provisioning.|
|[userTasks](#usertasks)||array of task objects|Lists user-context customization tasks to run after sign-in.|
|[buildProperties](#buildproperties)||object|Defines build-specific settings for image creation.|

### `$schema`

*(string or number)*

Specifies the schema version for the file. Current examples use `1.0`.

```yaml
$schema: "1.0"
```

### `name`

*(string, required, 3-63 characters)*

Specifies the friendly name shown when you select an image definition. This setting controls the name of the image definition that's available when you create and update pools. The name can't contain `/`, `"`, `[`, `]`, `:`, `|`, `<`, `>`, `+`, `=`, `;`, `,`, `?`, `*`, `@`, `&`, whitespace, or begin with `_` or `-`.

```yaml
name: example-image-definition
```

### `description`

*(string)*

Describes the purpose of the image definition.

```yaml
description: Install core tools and clone the project repository.
```

### `image`

*(string, required)*

Specifies the base image to use for the dev box image. The image can be a marketplace image or a custom image from an attached Azure Compute Gallery in the format `gallery-name/image-name@version`.

Examples:

```yaml
image: microsoftwindowsdesktop_windows-ent-cpc_win11-21h2-ent-cpc-m365
```

```yaml
image: my-gallery/my-image@0.0.1
```

To attach an Azure Compute Gallery, see [Configure Azure Compute Gallery for Microsoft Dev Box](how-to-configure-azure-compute-gallery.md).

To get a list of images that your dev center can access, use Azure CLI:

```azurecli
az devcenter admin image list --dev-center-name CustomizationsImagingHQ --resource-group TeamCustomizationsImagingRG --query "[].name"
```

If needed, install the Dev Center Azure CLI extension first:

```azurecli
az extension add --name devcenter
```

### `parameters`

*(object)*

Defines named input parameters that you can reference in tasks by using `{{parameterName}}` syntax.

```yaml
parameters:
  repositoryBranch:
    type: string
    default: main
    description: Branch to clone during setup.
```

#### Parameter object properties

|Property|Required|Type|Description|
|---|---|---|---|
|[type](#type)|✅|string|Specifies the parameter data type.|
|[allowed](#allowed)||array of strings|Restricts the parameter to a fixed list of string values.|
|[default](#default)|✅|string, boolean, or number|Sets the default value for the parameter.|
|[description](#description-1)||string|Describes the parameter.|
|[validationRegex](#validationregex)||string|Validates string values against a regular expression.|
|[minLength](#minlength)||integer|Sets the minimum length for string values.|
|[maxLength](#maxlength)||integer|Sets the maximum length for string values.|

### `type`

*(string, required, allowed values: string, boolean, number)*

Specifies the parameter data type.

### `allowed`

*(array of string)*

Restricts the parameter to a fixed set of allowed string values.

### `default`

*(string, boolean, or number, required)*

Sets the default value for the parameter.

### `description`

*(string)*

Describes the parameter for authors and tooling.

### `validationRegex`

*(string)*

Defines a regular expression that string values must match.

### `minLength`

*(integer)*

Sets the minimum length for string values.

### `maxLength`

*(integer)*

Sets the maximum length for string values.

### `variables`

*(object)*

Defines named variables that you can reuse in the image definition.

```yaml
variables:
  workspaceRoot:
    type: string
    value: C:\Workspaces
    description: Root directory for repositories.
```

#### Variable object properties

|Property|Required|Type|Description|
|---|---|---|---|
|[type](#type-1)|✅|string|Specifies the variable data type.|
|[value](#value)|✅|string, boolean, or number|Sets the variable value.|
|[description](#description-2)||string|Describes the variable.|

### `type`

*(string, required, allowed values: string, boolean, number)*

Specifies the variable data type.

### `value`

*(string, boolean, or number, required)*

Sets the variable value.

### `description`

*(string)*

Describes the variable for authors and tooling.

### `tasks`

*(array of task objects)*

Lists customization tasks to run in system context during provisioning. The specific input values that you provide vary by task. Each task entry must include `name` and can also define `displayName`, `description`, `parameters`, and `timeout`.

```yaml
tasks:
  - name: ~/winget
    parameters:
      package: Git.Git
  - name: ~/gitclone
    timeout: 1800
    parameters:
      repositoryUrl: https://github.com/example-org/example-repo.git
      directory: C:\Workspaces
```

The `timeout` property is optional and is measured in seconds when you use it in `imagedefinition.yaml`.

```yaml
tasks:
  - name: ~/powershell
    timeout: 1800
    parameters:
      command: <command>
```

#### Task entry properties

|Property|Required|Type|Description|
|---|---|---|---|
|[name](#name-1)|✅|string|Identifies the task to invoke.|
|[displayName](#displayname)||string|Provides short UI text for the task.|
|[description](#description-3)||string|Describes what the task does.|
|[parameters](#parameters-1)||object|Supplies input values for the task.|
|[timeout](#timeout)||integer|Overrides task execution time in seconds.|

### `name`

*(string, required)*

Identifies the task to run. Use the `~/` prefix for built-in tasks, such as `~/winget`, `~/powershell`, and `~/gitclone`.

### `displayName`

*(string)*

Provides short display text for UI surfaces.

### `description`

*(string)*

Describes what the task does in the image definition.

### `parameters`

*(object)*

Defines the input values passed to the task. Parameter names and value types depend on the selected task.

The parameter definitions follow the same schema described for `task.yaml` parameter properties. For details, see [`type`](#type-2), [`allowed`](#allowed-1), [`default`](#default-1), [`description`](#description-5), [`validationRegex`](#validationregex-1), [`minLength`](#minlength-1), [`maxLength`](#maxlength-1), and [`required`](#required).

### `timeout`

*(integer)*

Overrides the task execution timeout in seconds.

### `userTasks`

*(array of task objects)*

Lists customization tasks to run in user context after sign-in. `userTasks` uses the same task entry schema as [`tasks`](#tasks).

```yaml
userTasks:
  - name: ~/powershell
    parameters:
      command: code C:\Workspaces\example-repo
```

### `buildProperties`

*(object)*

Defines build-specific settings that customize the image build process.

```yaml
buildProperties:
  networkConnection: corp-westus3
```

#### Build properties object properties

|Property|Required|Type|Description|
|---|---|---|---|
|[networkConnection](#networkconnection)||string|Selects the network connection to use for image builds.|

### `networkConnection`

*(string)*

Specifies the network connection used during image creation. Use this setting when build tasks need access to resources such as private repositories or storage accounts that are reachable only through a specific network connection. The network connection must be attached to the dev center before you can use it for image creation.

```yaml
buildProperties:
  networkConnection: my-westus3
```

## Built-in tasks

Use built-in tasks when you need common customization actions without attaching a catalog. Use the `~/` prefix to call a built-in task, for example `~/winget`, `~/powershell`, or `~/gitclone`.

- [GitClone built-in task](#gitclone-built-in-task)
- [PowerShell built-in task](#powershell-built-in-task)
- [WinGet built-in task](#winget-built-in-task)

### GitClone built-in task

Use the GitClone built-in task to clone a repository into the dev box.

Example:

```yaml
tasks:
  - name: ~/gitclone
    parameters:
      repositoryUrl: https://github.com/microsoft/calculator
      directory: C:\Workspaces
      branch: main
```

|Property|Required|Type|Description|
|---|---|---|---|
|[repositoryUrl](#repositoryurl)|✅|string|Specifies the repository URL to clone.|
|[directory](#directory)||string|Sets the directory under which the repository is cloned.|
|[branch](#branch)||string|Selects a branch to clone.|
|[pat](#pat)||string|Supplies a personal access token for authenticated clone operations.|

### `repositoryUrl`

*(string, required)*

Specifies the repository URL to clone.

### `directory`

*(string, default: C:\Workspaces)*

Sets the directory under which the repository is cloned.

### `branch`

*(string)*

Selects a branch to clone.

### `pat`

*(string)*

Supplies a personal access token for authenticated clone operations. When `pat` isn't supplied, the clone is queued for the first user sign-in. When you supply `pat`, the task can clone during provisioning. Use a Key Vault secret reference instead of a raw secret value.

The GitClone built-in task also installs PowerShell 7, Git, and Git LFS during execution.

### PowerShell built-in task

Use the PowerShell built-in task to run a command or script.

Example:

```yaml
tasks:
  - name: ~/powershell
    parameters:
      command: Write-Host "Hello from Dev Box"
```

|Property|Required|Type|Description|
|---|---|---|---|
|[command](#command-1)||string|Runs an inline command.|
|[workingDirectory](#workingdirectory)||string|Sets the working directory for the command or script.|
|[script](#script)||string|Runs a local or remote PowerShell script.|
|[scriptArgs](#scriptargs)||string|Supplies arguments for the script.|
|[scriptExecutionPolicy](#scriptexecutionpolicy)||string|Sets the execution policy for the script.|

### `command`

*(string)*

Runs an inline command. If you provide `command`, the `script`, `scriptArgs`, and `scriptExecutionPolicy` parameters are ignored.

### `workingDirectory`

*(string)*

Sets the working directory for the command or script.

### `script`

*(string)*

Specifies the path to a local or remote PowerShell script to run. This parameter is ignored when `command` is provided.

### `scriptArgs`

*(string)*

Supplies arguments for the script. This parameter is ignored when `command` is provided.

### `scriptExecutionPolicy`

*(string, default: Bypass)*

Sets the execution policy for the script. This parameter is ignored when `command` is provided.

### WinGet built-in task

Use the WinGet built-in task to install a package directly or apply a WinGet configuration file.

> [!IMPORTANT]
> The WinGet built-in task isn't the same as the `winget` executable. The built-in task uses the PowerShell WinGet cmdlet.

Example:

```yaml
tasks:
  - name: ~/winget
    parameters:
      package: GitHub.GitHubDesktop
      version: 3.4.16
```

|Property|Required|Type|Description|
|---|---|---|---|
|[configurationFile](#configurationfile)||string|Points to a local WinGet configuration file.|
|[downloadUrl](#downloadurl)||string|Downloads a configuration file from a public URL.|
|[inlineConfigurationBase64](#inlineconfigurationbase64)||string|Supplies a Base64-encoded WinGet configuration file.|
|[package](#package)||string|Installs a package directly by name.|
|[version](#version)||string|Installs a specific package version.|

### `configurationFile`

*(string)*

Points to a WinGet configuration YAML file on the local machine.

### `downloadUrl`

*(string)*

Specifies a public URL for a WinGet configuration YAML file. The file is downloaded to the path in `configurationFile`.

### `inlineConfigurationBase64`

*(string)*

Supplies a Base64-encoded WinGet configuration YAML file. The task decodes it to `configurationFile`, or to a temporary file if `configurationFile` isn't set.

### `package`

*(string)*

Installs a package directly by name. If you use a configuration file source, you don't need to supply `package`.

### `version`

*(string)*

Installs a specific package version. If you use a configuration file source, you don't need to supply `version`.

## task.yaml files

Use `task.yaml` to define a reusable customization task in a catalog. A task definition describes the command, metadata, parameters, documentation, and execution settings for the task.

When you define customization tasks, you identify the tasks that are available to developers for use in `imagedefinition.yaml` or `devbox.yaml` files. You can use task definitions to restrict high-privilege actions, such as the ability to run arbitrary PowerShell commands.

### Example task.yaml file

```yaml
$schema: "1.0"
name: install-vsix-extension
description: Install a Visual Studio extension from a VSIX package.
author: Contoso Corporation
command: .\install-extension.ps1 -VsixPath {{vsixPath}}
documentationURL: https://contoso.example/devbox/install-vsix-extension
keywords:
  - visual-studio
  - extension
parameters:
  vsixPath:
    type: string
    required: true
    description: Path to the VSIX package.
timeout: 30
rebootRequired: false
documentation:
  notes: Use a path that is available during task execution.
  examples:
    - name: install-vsix-extension
      parameters:
        vsixPath: .\extensions\contoso.vsix
```

The following example shows a task definition that runs a PowerShell command in a specific working directory:

```yaml
$schema: "1.0"
name: powershell
description: Execute a PowerShell command.
author: Microsoft Corporation
command: .\runcommand.ps1 -command {{command}} -workingDirectory {{workingDirectory}}
parameters:
  command:
    type: string
    default: ""
    required: true
    description: The command to execute.
  workingDirectory:
    type: string
    default: ""
    required: false
    description: The working directory in which to execute the command.
```

### Task.yaml properties

|Property|Required|Type|Description|
|---|---|---|---|
|[$schema](#schema-1)|✅|string|Specifies the schema version for the task file.|
|[name](#name-2)|✅|string|Defines the task identifier.|
|[command](#command)|✅|string|Provides the PowerShell command that implements the task.|
|[description](#description-4)||string|Describes the task.|
|[author](#author)||string|Identifies the task author.|
|[issueNotificationEmail](#issuenotificationemail)||string|Provides a contact email for task issues.|
|[documentationURL](#documentationurl)||string|Links to task documentation.|
|[licenseURL](#licenseurl)||string|Links to the task license.|
|[keywords](#keywords)||array of strings|Lists search keywords for the task.|
|[parameters](#parameters-2)||object|Defines the inputs that the task accepts.|
|[timeout](#timeout-1)||integer|Sets the default timeout in minutes.|
|[documentation](#documentation)||object|Adds notes and task invocation examples for consumers.|
|[rebootRequired](#rebootrequired)||boolean|Indicates whether the task requires a reboot after execution.|

### `$schema`

*(string, required)*

Specifies the schema version for the task definition. Current examples use `1.0`.

### `name`

*(string, required)*

Defines the identifier used to reference the task from `imagedefinition.yaml` or `devbox.yaml` files. The name must be unique in the context of the catalog where the task exists.

Use the same naming constraints as other Dev Box customization artifacts. The name must be between 3 and 63 characters, start with an alphanumeric character, and contain only alphanumeric characters, `-`, `.`, or `_`. The `/` character is reserved.

```yaml
name: install-vsix-extension
```

### `command`

*(string, required)*

Specifies the PowerShell command that implements the task. The command runs in Windows PowerShell on the local machine. Use `{{parameterName}}` syntax to reference parameter values in the command string.

```yaml
command: .\install-extension.ps1 -VsixPath {{vsixPath}}
```

For example:

```yaml
command: .\runcommand.ps1 -command {{command}} -workingDirectory {{workingDirectory}}
```

### `description`

*(string)*

Describes the purpose of the task.

```yaml
description: This task executes a PowerShell command.
```

### `author`

*(string)*

Identifies the task author for audits and troubleshooting.

```yaml
author: Contoso Corporation
```

### `issueNotificationEmail`

*(string)*

Provides an email address that users can contact if they have issues with the task. Product functionality doesn't consume this value.

### `documentationURL`

*(string)*

Links to documentation for the task.

```yaml
documentationURL: https://link.to/documentation
```

### `licenseURL`

*(string)*

Links to the task license.

```yaml
licenseURL: https://link.to/license
```

### `keywords`

*(array of string)*

Lists keywords that help consumers find the task.

### `parameters`

*(object)*

Defines named input parameters for the task. Each child item represents a parameter name and can define the parameter type, allowed values, default value, description, validation rules, length limits, and whether the parameter is required.

```yaml
parameters:
  vsixPath:
    type: string
    required: true
    description: Path to the VSIX package.
```

#### Parameter definition properties

|Property|Required|Type|Description|
|---|---|---|---|
|[type](#type-2)|✅|string|Specifies the input data type.|
|[allowed](#allowed-1)||array of strings|Restricts the input to a fixed list of string values.|
|[default](#default-1)||string, boolean, or number|Sets the default value for the input.|
|[description](#description-5)||string|Describes the input.|
|[validationRegex](#validationregex-1)||string|Validates string values against a regular expression.|
|[minLength](#minlength-1)||integer|Sets the minimum length for string values.|
|[maxLength](#maxlength-1)||integer|Sets the maximum length for string values.|
|[required](#required)||boolean|Indicates whether the input must be supplied.|

### `type`

*(string, required, allowed values: string, boolean, number)*

Specifies the input data type.

### `allowed`

*(array of string)*

Restricts the input to a fixed set of allowed string values.

### `default`

*(string, boolean, or number)*

Sets the default value for the input.

### `description`

*(string)*

Describes the input.

### `validationRegex`

*(string)*

Defines a regular expression that string values must match.

### `minLength`

*(integer)*

Sets the minimum length for string values.

### `maxLength`

*(integer)*

Sets the maximum length for string values.

### `required`

*(boolean)*

Indicates whether the input must be supplied. If omitted, the default is `false`.

### `timeout`

*(integer, default: 30)*

Sets the default task timeout in minutes. If you don't specify a value, the default is 30 minutes.

```yaml
timeout: 30
```

### `documentation`

*(object)*

Provides notes and invocation examples that task consumers can use when they add the task to an image definition.

#### Documentation object properties

|Property|Required|Type|Description|
|---|---|---|---|
|[notes](#notes)||string|Provides guidance for consumers of the task.|
|[examples](#examples)||array of task objects|Shows how to invoke the task from a YAML file.|

### `notes`

*(string)*

Adds guidance or caveats for consumers of the task.

### `examples`

*(array of task objects)*

Shows example task invocations by using the same schema as task entries in `imagedefinition.yaml`.

### `rebootRequired`

*(boolean, default: false)*

Indicates whether the task requires a reboot after execution.

## Related content

- [Configure team customizations](how-to-configure-team-customizations.md) - Create `imagedefinition.yaml` files and apply them to a dev box pool.
- [Configure a user customization file for your dev box](how-to-configure-user-customizations.md) - Author and upload a personal `devbox.yaml` file.
- [Configure tasks for Dev Box customizations](how-to-configure-customization-tasks.md) - Author `task.yaml` files and publish them through a catalog.
- [Connect to Azure resources or clone private repositories](how-to-customizations-connect-resource-repository.md)