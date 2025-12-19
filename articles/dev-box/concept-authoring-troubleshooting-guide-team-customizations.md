---
title: "Authoring recommendations for Dev Box image definitions"
description: "Enhance your Microsoft Dev Box workflows with this guide to authoring image definitions, including strategies for testing, debugging, and using built-in tools."
#customer intent: As an IT admin, I want to troubleshoot Dev Box customization failures so that I can resolve issues quickly and maintain productivity.
author: mikeparker104
ms.author: miparker
ms.reviewer: rosemalcolm
ms.date: 12/11/2025
ms.topic: concept-article
ms.service: dev-box
---

# Authoring and troubleshooting guide for team customizations

This guide provides recommendations for creating Microsoft Dev Box image definition files (`imagedefinition.yaml`). It pulls together and extends content from existing documentation to raise visibility of effective approaches, common pitfalls, and troubleshooting guidance. The intent is to aid in onboarding and building reliable, maintainable customizations that work consistently for your development teams.

> [!NOTE]
> This guide builds on the [Create a dev box by using team customizations quickstart](/azure/dev-box/quickstart-team-customizations). If you're new to Dev Box customizations, complete that tutorial first.

This guide covers strategies for:

- Choosing the most effective authoring approach for your scenario
- Avoiding common pitfalls that cause customization failures
- Troubleshooting

## Prerequisites

Before you begin, ensure you have:

| Requirement | Details |
| ---------- | ------ |
| Microsoft Dev Box configuration | Dev center with dev project and dev box pool configured. Catalog attached to dev center (optional for built-in tasks). Dev Box User permissions. |
| Development environment | Dev Box with local admin permissions. Visual Studio (VS) Code with latest version. Dev Box extension installed and GitHub Copilot extension installed. |

> [!TIP]
> For comprehensive background on Dev Box customizations, see [Team Customizations documentation](/azure/dev-box/concept-what-are-team-customizations?tabs=team-customizations) and [How to write an image definition file](/azure/dev-box/how-to-write-image-definition-file).

## Approach recommendations

When authoring Dev Box customizations, choose the approach that best fits your team's workflow and technical requirements. For background on how customizations work, see [Use Team Customizations](/azure/dev-box/quickstart-team-customizations).

### Start with the authoring agent

The AI-powered workflow in Visual Studio Code with GitHub Copilot automatically handles the complex details of task syntax, context placement, and validation. This automation covers standard development tools (Git, .NET, Node.js, Visual Studio, and others), configuration, and cloning of repositories by using built-in customization tasks (also known as `primitives`).

**Recommended practices:**

- Open your target project in VS Code to begin with repository context.
- Use descriptive, specific prompts: "Install tools for .NET 8 web development" rather than "install development tools."
- Iterate incrementally: start with core tools, then add specialized requirements.
- Always validate generated YAML before committing to your catalog.

> [!TIP]
> Learn more about using GitHub Copilot for image definitions: [Create an image definition file with Copilot](/azure/dev-box/how-to-configure-team-customizations?tabs=copilot-agent#create-an-image-definition-file).

### Explore using your own GitHub Copilot instruction files alongside the authoring agent

You can provide your own custom GitHub Copilot instruction files and use those files alongside the tools provided by the Dev Box extension where applicable to tailor for specific scenarios. For example, the [Dev Box image definition instructions](https://github.com/github/awesome-copilot/blob/main/instructions/devbox-image-definition.instructions.md) from the [awesome-copilot](https://github.com/github/awesome-copilot) repo provides more coverage of advanced scenarios and edge cases along with guide rails to help apply the recommendations in this document. Be sure to review this resource regularly as the authoring agent continues to expand its capabilities.

See: [Configure custom instructions for GitHub Copilot](https://docs.github.com/copilot/how-tos/configure-custom-instructions)

### Task selection strategy: Built-in vs. custom

Start with built-in tasks and then introduce custom tasks when necessary:

**Built-in tasks are a good fit for:**

- Standard software installations (`~/winget`)
- Environment configuration (`~/powershell`)
- Repository management (`~/gitclone`)

**Consider custom tasks when you encounter these patterns repeatedly:**

- Organization-specific deployment patterns used across multiple teams
- Complex multistep processes that benefit from reusability
- Security or enterprise system integration requirements
- Performance optimizations or specific handling of file downloads

> [!TIP]
> Starting simple with built-in tasks can help you achieve faster initial success and easier maintenance.

### Consider authoring and testing longer or more complex custom scripts in a standalone file before integrating them in the image definition

Iterating in a standalone file can provide a better authoring experience and faster inner-loop compared to editing directly in YAML.

> [!IMPORTANT]
> Keep syntax simple to avoid unexpected problems when moving to inline YAML. For example, avoid use of double quotes where possible.

### Use descriptive, actionable display names

```yaml
- name: ~/winget
 displayName: "Install .NET 8 SDK for API Development" # Specific purpose
```

**Why this matters:** When customizations fail, descriptive names help teams quickly identify which step failed and why.

### Test and validate locally

Before deploying image definitions to production, test them locally by using the Dev Box CLI.

#### Prerequisites for local testing

- **Visual Studio Code must run as administrator** to execute system tasks.
- **Dev Box CLI installed** and available in your PATH.

#### Testing commands

**Test your image definition:**

```bash
devbox customizations apply-tasks --filePath "path/to/imagedefinition.yaml"
```

**List available tasks first:**

```bash
devbox customizations list-tasks
```

> [!IMPORTANT]
> Local testing with the Dev Box CLI provides the most detailed error information through log files, making it essential for debugging complex customizations.

## Avoiding common pitfalls

### Context placement: A common cause of failures

Most customization failures happen because of incorrect context placement. Here's what works:

**System context (`tasks`) success patterns:**

- Administrative software installations that need elevation
- System-wide tools like Git, .NET SDK, and Visual Studio
- Registry modifications and system configuration
- Components needed before user sign-in

**User context (`userTasks`) success patterns:**

- Visual Studio Code extensions and user-specific configurations
- Microsoft Store applications that need user authentication
- Personal development environment setup
- Profile-specific customizations

> [!TIP]
> A common mistake is placing Microsoft Store applications or VS Code extensions in system context. These customizations always fail because they require user context.
>
> For detailed guidance on context placement, see [System tasks and user tasks](/azure/dev-box/how-to-configure-team-customizations#system-tasks-and-user-tasks).

### Always use the ~/ prefix for built-in tasks

```yaml
# ✅ Correct - Explicitly uses built-in task
- name: ~/winget

# ❌ Incorrect - May conflict with custom tasks
- name: winget
```

**Why this matters:** Custom tasks with similar names can override built-in functionality, causing unexpected failures.

### Group related operations by execution context

Place all system-level operations together, then all user-level operations. This grouping keeps the execution order clear and reduces context-switching overhead.

**Why this matters:** Mixed contexts can cause timing issues and unexpected failures.

### Use Azure Key Vault for all sensitive data

```yaml
parameters:
 apiKey: "{{KV_SECRET_URI}}" # Runtime resolution
```

**Why this matters:** Hardcoded secrets in YAML files increase the chances of sensitive data being committed to source control.

> [!IMPORTANT]
> The `{{KV_SECRET_URI}}` syntax replaces Key Vault secrets only when customizations run during provisioning, not locally. When you use inline secrets to test locally, make sure to check for hard-coded secrets before committing changes.

**Tips:**

- **Validate Key Vault access** before deployment by using the project's managed identity
- **Test with representative security policies** in a staging environment
- **Document security assumptions** for future maintainers

> [!TIP]
> For comprehensive guidance on using secrets, see [Use Azure Key Vault secrets in customization files](/azure/dev-box/how-to-use-secrets-customization-files).

### Ensure WinGet package discovery

Verify package availability in the target environment to avoid unexpected failures.

```bash
winget search "exact package name" --accept-source-agreements
```

### Check the customization tasks that are available to the user in the target environment

Before creating or modifying any YAML customization files, check what customization tasks are available by running:

```bash
devbox customizations list-tasks
```

**Why this matters:**

- Different Dev Box environments might offer different available tasks.
- You must use only tasks that are available to the user.
- The available tasks determine which approaches are possible.

### Avoiding or correctly handling double quotes in script defined inline within YAML

While not limited to just double quotes, these characters are a common cause of unexpected issues, especially when you copy and paste scripts from existing standalone PowerShell files. For example, a script that runs as expected in a standalone file might contain string interpolation or escaping characters that don't work correctly within the YAML context of Dev Box customization tasks.

**Solutions:**

- **Replace double quotes with single quotes** in the inline PowerShell script where possible.
- **If double quotes are necessary**, ensure the script is properly escaped to avoid syntax errors by using backticks or other escaping mechanisms.

> [!IMPORTANT]
> When you use single quotes, make sure that any variables or expressions that need to be evaluated aren't enclosed in single quotes. If they are, the variables or expressions won't be interpreted correctly.

### Optimize the downloading of larger files

When downloading larger files using the PowerShell primitive, consider the following optimization strategies:

#### Suppress progress bar output

If you use commands like `Invoke-WebRequest` or `Start-BitsTransfer`, add the `$progressPreference = 'SilentlyContinue'` statement to the top of the PowerShell script to suppress progress bar output during the execution of those commands. This change avoids unnecessary overhead and might improve performance slightly.

```yaml
tasks:
 - name: ~/powershell
 displayName: Download large installer
 parameters:
 script: |
 $progressPreference = 'SilentlyContinue'
 Invoke-WebRequest -Uri "https://example.com/large-installer.exe" -OutFile "C:\temp\installer.exe"
```

#### Consider alternative download methods

If the file is large and causes performance or timeout problems, consider whether it's possible download that file from a different source or by using a different method:

- **Azure Storage**: Host the file in an Azure Storage account. Then, use utilities like `azcopy` or `Azure CLI` to download the file more efficiently. This approach can help with large files and provide better performance. For more information, see [Transfer data using azcopy](/azure/storage/common/storage-use-azcopy-v10?tabs=dnf#transfer-data) and [Download a file from Azure Storage](/azure/dev-box/how-to-customizations-connect-resource-repository#example-download-a-file-from-azure-storage).

- **Git repositories**: Host the file in a git repository. Then, use the `~/gitclone` primitive to clone the repository and access the files directly. This approach can be more efficient than downloading large files individually.

## Troubleshooting

When customizations fail, take the following initial actions to increase your understanding of the problem:

### Review the logs to identify the failing tasks and related error messages

When you run `devbox customizations apply-tasks --filePath "path/to/imagedefinition.yaml"` locally, customization logs are stored in a specific location that helps with troubleshooting.

**Log location:** `C:\ProgramData\Microsoft\DevBoxAgent\Logs\customizations`

**Finding the relevant logs:**

1. **Navigate to the logs directory:** The most recent logs are in the folder with the latest timestamp in `yyyy-MM-DDTHH-mm-ss` format.
1. **Locate task-specific logs:** Within the timestamped folder, check the `tasks` subfolder.
1. **Check individual task results:** Each task has its own subfolder within the `tasks` directory.
1. **Review error logs:** Look for `stderr.log` files in each task subfolder:
 - **Empty `stderr.log`** = Task completed successfully.
 - **Content in `stderr.log`** = Task failed, with error details provided.

**Example log structure:**

```text
C:\ProgramData\Microsoft\DevBoxAgent\Logs\customizations\
└── 2025-11-04T10-30-45\
 └── tasks\
 ├── task-1-winget-install\
 │ ├── stdout.log
 │ └── stderr.log # Check this for errors
 └── task-2-powershell-script\
 ├── stdout.log
 └── stderr.log # Check this for errors
```

> [!TIP]
> When you ask for help with customization problems, include the contents of any nonempty `stderr.log` files. This error information helps others troubleshoot effectively.

### Check common failure patterns

| Error Pattern | Common Cause | Suggestion |
| --------------- | -------------- | ------------ |
| "System tasks aren't allowed in standard user context" | Task in wrong context | Move to `userTasks` section |
| "Package not found" | Incorrect WinGet package ID | Use `winget search` to find correct ID |
| "Access denied" | Permissions issue | Verify task context and user privileges |
| "PowerShell execution error" | Script syntax or dependencies | Test script independently first and see [Avoiding or correctly handling double quotes in script defined inline within YAML](#avoiding-or-correctly-handling-double-quotes-in-script-defined-inline-within-yaml) |

### Isolate the problem

Create a minimal image definition with only the failing task to eliminate dependencies:

```yaml
$schema: "1.0"
name: "debug-single-task"
image: microsoftvisualstudio_visualstudioplustools_vs-2022-ent-general-win11-m365-gen2
description: "Debug configuration for isolating task failures"

tasks:
 - name: ~/winget # Only the failing task
 displayName: "Debug: Test Failing Package"
 parameters:
 packages:
 - id: ProblemPackage.ID
```

> [!TIP]
> For working examples of image definition files, see [Example YAML customization file](https://aka.ms/devcenter/preview/imaging/examples).

## Related content

- [Create a dev box by using team customizations (prerequisite quickstart)](/azure/dev-box/quickstart-team-customizations)
- [Team Customizations documentation](/azure/dev-box/concept-what-are-team-customizations?tabs=team-customizations)
- [Write an image definition file for Dev Box Team Customizations](/azure/dev-box/how-to-write-image-definition-file)
- [Configure team customizations](/azure/dev-box/how-to-configure-team-customizations)
- [System tasks and user tasks](/azure/dev-box/how-to-configure-team-customizations#system-tasks-and-user-tasks)
- [Use Azure Key Vault secrets in customization files](/azure/dev-box/how-to-use-secrets-customization-files)
- [Create an image definition file with Copilot](/azure/dev-box/how-to-use-copilot-generate-image-definition-file)
- [Example YAML customization file](https://aka.ms/devcenter/preview/imaging/examples)
- [Add and configure a catalog](/azure/dev-box/how-to-configure-catalog)
- [Dev Box image definition instructions (GitHub Copilot)](https://github.com/github/awesome-copilot/blob/main/instructions/devbox-image-definition.instructions.md)