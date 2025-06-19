---
title: Azure Migrate Application and Code Assessment for Java Version 7
description: Learn how to use the next generation of Azure Migrate application and code assessment tool to determine readiness to migrate any type of Java application to Azure.
author: KarlErickson
ms.author: karler
ms.reviewer: brborges
ms.service: azure
ms.custom:
  - devx-track-java
  - devx-track-extended-java
  - build-2025
ms.topic: overview
ms.date: 01/15/2025
#customer intent: As a developer, I want to assess my Java application so that I can understand its readiness for migration to Azure.
---

# Azure Migrate application and code assessment for Java version 7 (preview)

> [!NOTE]
> This article is for the next generation of *Azure Migrate application and code assessment for Java*, version 7.x. This version is in preview. For the previous stable version, version 6.x, see [Azure Migrate application and code assessment for Java](./java.md).

This article shows you how to use the Azure Migrate application and code assessment tool for Java to assess and replatform any type of Java application. The tool enables you to evaluate application readiness for replatforming and migration to Azure. This tool is offered as a command-line interface (CLI), and assesses Java application binaries and source code to identify replatforming and migration opportunities for Azure. It helps you modernize and replatform large-scale Java applications by identifying common use cases and code patterns and proposing recommended changes.

The tool discovers application technology usage through static code analysis, provides effort estimation, and accelerates code replatforming. This assessment helps you to prioritize and move Java applications to Azure. With a set of engines and rules, the tool can discover and assess different technologies such as Java 11, Java 17, Jakarta EE, Spring, Hibernate, Java Message Service (JMS), and more. The tool then helps you replatform the Java application to different Azure targets - Azure App Service, Azure Kubernetes Service, and Azure Container Apps - with specific Azure replatforming rules.

The tool is based on a set of components in the [Cloud Native Computing Foundation](https://www.cncf.io/) project [Konveyor](https://github.com/konveyor), created and led by Red Hat.

## Overview

The tool is designed to help organizations modernize their Java applications in a way that reduces costs and enables faster innovation. The tool uses advanced analysis techniques to understand the structure and dependencies of any Java application, and provides guidance on how to refactor and migrate the applications to Azure.

With it, you can perform the following tasks:

- Discover technology usage: Quickly see which technologies an application uses. Discovery is useful if you have legacy applications with not much documentation and want to know which technologies they use.
- Assess the code to a specific target: Assess an application for a specific Azure target. Check the effort and the modifications you have to do to replatform your applications to Azure.

### Supported targets

The tool contains rules for helping you replatform your applications so you can deploy to, and use, different Azure services.

The rules used by Azure Migrate application and code assessment are grouped based on a *target*. A target is where or how the application runs, and general needs and expectations. When assessing an application, you can choose multiple targets. The following table describes the available targets:

| Target name              | Description                                                            | Target                 |
|--------------------------|------------------------------------------------------------------------|------------------------|
| Azure App Service        | Best practices for deploying an app to Azure App Service.              | `azure-appservice`     |
| Azure Kubernetes Service | Best practices for deploying an app to Azure Kubernetes Service.       | `azure-aks`            |
| Azure Container Apps     | Best practices for deploying an app to Azure Container Apps.           | `azure-container-apps` |
| Cloud Readiness          | General best practices for making an application Cloud (Azure) ready.  | `cloud-readiness`      |
| Linux                    | General best practices for making an application Linux ready.          | `linux`                |
| OpenJDK 11               | General best practices for running a Java 8 application with Java 11.  | `openjdk11`            |
| OpenJDK 17               | General best practices for running a Java 11 application with Java 17. | `openjdk17`            |
| OpenJDK 21               | General best practices for running a Java 17 application with Java 21. | `openjdk21`            |

When the tool assesses for Cloud Readiness and related Azure services, it can also report useful information for potential usage of different Azure services. The following list shows a few of the services covered:

- Azure Databases
- Azure Service Bus
- Azure Storage
- Azure Content Delivery Network
- Azure Event Hubs
- Azure Key Vault
- Azure Front Door

## Download and install

To use the `appcat` CLI, you must download the package specific to your environment, and have the required dependencies in your environment. The `appcat` CLI runs on any environment such as Windows, Linux, or Mac, using Intel, Arm, or Apple Silicon hardware. For the JDK requirement, we recommend you use the [Microsoft Build of OpenJDK](/java/openjdk).

| OS      | Architecture    | Download Link  | Other files              |
|---------|-----------------|----------------|--------------------------|
| *x64*
| Windows | x64             | [Download][13] | [sha256][14] / [sig][15] |
| macOS   | x64             | [Download][7]  | [sha256][8] / [sig][9]   |
| Linux   | x64             | [Download][1]  | [sha256][2] / [sig][3]   |
| *AArch64*
| Windows | AArch64 / ARM64 | [Download][16] | [sha256][17] / [sig][18] |
| macOS   | Apple Silicon   | [Download][10] | [sha256][11] / [sig][12] |
| Linux   | AArch64 / ARM64 | [Download][4]  | [sha256][5] / [sig][6]   |

[1]: https://aka.ms/appcat/azure-migrate-appcat-for-java-cli-linux-amd64.tar.gz
[2]: https://aka.ms/appcat/azure-migrate-appcat-for-java-cli-linux-amd64.tar.gz.sha256sum.txt
[3]: https://aka.ms/appcat/azure-migrate-appcat-for-java-cli-linux-amd64.tar.gz.sig
[4]: https://aka.ms/appcat/azure-migrate-appcat-for-java-cli-linux-arm64.tar.gz
[5]: https://aka.ms/appcat/azure-migrate-appcat-for-java-cli-linux-arm64.tar.gz.sha256sum.txt
[6]: https://aka.ms/appcat/azure-migrate-appcat-for-java-cli-linux-arm64.tar.gz.sig
[7]: https://aka.ms/appcat/azure-migrate-appcat-for-java-cli-macos-amd64.tar.gz
[8]: https://aka.ms/appcat/azure-migrate-appcat-for-java-cli-macos-amd64.tar.gz.sha256sum.txt
[9]: https://aka.ms/appcat/azure-migrate-appcat-for-java-cli-macos-amd64.tar.gz.sig
[10]: https://aka.ms/appcat/azure-migrate-appcat-for-java-cli-macos-arm64.tar.gz
[11]: https://aka.ms/appcat/azure-migrate-appcat-for-java-cli-macos-arm64.tar.gz.sha256sum.txt
[12]: https://aka.ms/appcat/azure-migrate-appcat-for-java-cli-macos-arm64.tar.gz.sig
[13]: https://aka.ms/appcat/azure-migrate-appcat-for-java-cli-windows-amd64.zip
[14]: https://aka.ms/appcat/azure-migrate-appcat-for-java-cli-windows-amd64.zip.sha256sum.txt
[15]: https://aka.ms/appcat/azure-migrate-appcat-for-java-cli-windows-amd64.zip.sig
[16]: https://aka.ms/appcat/azure-migrate-appcat-for-java-cli-windows-arm64.zip
[17]: https://aka.ms/appcat/azure-migrate-appcat-for-java-cli-windows-arm64.zip.sha256sum.txt
[18]: https://aka.ms/appcat/azure-migrate-appcat-for-java-cli-windows-arm64.zip.sig

### Prerequisites

- [Download](/java/openjdk/download#openjdk-17) and [install Microsoft Build of OpenJDK 17](/java/openjdk/install). Ensure that the `JAVA_HOME` environment variable is set.

### Install AppCAT

To install `appcat`, download the appropriate zip file for your platform. After you download the file, depending on your operating system, you should find either a **.tar.gz** (Linux/macOS) or **.zip** file (Windows).

Extract the binary from the downloaded file. You should see the following folder structure:

```
/azure-migrate-appcat-for-java-cli-<OS>-<architecture>-<release-version>-preview/
├── appcat.exe (Windows) / appcat (Linux/macOS)
├── samples/
├── fernflower.jar
├── LICENSE
├── NOTICE.txt
├── maven.default.index
├── jdtls/
├── static-report/
├── rulesets/
├── readme.md
└── readme.html
```

### Run AppCAT

To run `appcat` from any location in your terminal, extract the archive to your desired location. Then, update the `PATH` environment variable to include the directory where you extracted the archive.

> [!NOTE]
> When the `appcat` binary is called, it first looks for its dependencies in the executable folder specified in the `PATH` environment variable. If the dependencies aren't found, it falls back to the user's home directory - **~/.appcat** on Linux/Mac or **%USERPROFILE%\\.appcat** on Windows.

## Usage

### Subcommands

AppCAT provides two subcommands for usage:

- `analyze`: Run source code analysis on input source code or a binary.
- `transform`: Convert XML rules from previous versions (6 and older) to YAML format used by this version.

> [!NOTE]
> For macOS users: If you encounter an error stating `Apple could not verify` when trying to run the app, you can resolve this error by using the following command:
>
> ```bash
> xattr -d -r com.apple.quarantine /path/to/appcat_binary
> ```
>
> For example:
>
> ```bash
> xattr -d -r com.apple.quarantine $HOME/.appcat/appcat
> ```

#### Analyze subcommand

The `analyze` subcommand enables you to run source code and binary analysis.

To analyze application source code, use the following command:

# [Linux / macOS](#tab/linux)

```bash
./appcat analyze --input=<path-to-source-code> --output=<path-to-output-directory> --target=azure-appservice,cloud-readiness --overwrite
```

# [Windows](#tab/windows)

```cmd
.\appcat.exe analyze --input=<path-to-source-code> --output=<path-to-output-directory> --target=azure-appservice,cloud-readiness --overwrite
```

---

The `--input` flag must point to a source code directory or a binary file, and `--output` must point to a directory to store the analysis results.

For more information on the analyze flags, use the following command:

# [Linux / macOS](#tab/linux)

```bash
./appcat analyze --help
```

# [Windows](#tab/windows)

```cmd
.\appcat.exe analyze --help
```

---

To check the available targets for AppCAT, use the following command:

# [Linux / macOS](#tab/linux)

```bash
./appcat analyze --list-targets
```

# [Windows](#tab/windows)

```cmd
.\appcat.exe analyze --list-targets
```

---

This command produces the following output:

```output
available target technologies:
azure-aks
azure-appservice
azure-container-apps
cloud-readiness
linux
openjdk11
openjdk17
openjdk21
```

#### Analyzing multiple applications

AppCAT supports multiple application analysis in per command execution. You can provide a comma-separated list of input paths for the `--input` flag to analyze multiple applications in a single command. The output directory and static report include the combined analysis results for all applications.

To analyze multiple applications, use the following command:

# [Linux / macOS](#tab/linux)

```bash
./appcat analyze --input=<path-to-source-A>,<path-to-source-B>,<path-to-source-C> --output=<path-to-output-ABC> --target=<target-name>
```

# [Windows](#tab/windows)

```cmd
.\appcat.exe analyze --input=<path-to-source-A>,<path-to-source-B>,<path-to-source-C> --output=<path-to-output-ABC> --target=<target-name>
```

---

AppCAT also enables you to use `--bulk` option to incrementally add more application analysis to an existing output directory and static report. When you use the `--bulk` option, you must use it consistently across all command executions that write to the same output.

> [!NOTE]
> When you provide multiple input paths, `--bulk` is enabled by default.

To incrementally add more application analysis to an existing static report, use the following command:

# [Linux / macOS](#tab/linux)

```bash
./appcat analyze --input=<path-to-source-A>,<path-to-source-B>,<path-to-source-C> --output=<path-to-output-ABC> --target=<target-name>
./appcat analyze --bulk --input=<path-to-source-D> --output=<path-to-output-ABC> --target=<target-name>
./appcat analyze --bulk --input=<path-to-source-E> --output=<path-to-output-ABC> --target=<target-name>
```

# [Windows](#tab/windows)

```cmd
.\appcat.exe analyze --input=<path-to-source-A>,<path-to-source-B>,<path-to-source-C> --output=<path-to-output-ABC> --target=<target-name>
.\appcat.exe analyze --bulk --input=<path-to-source-D> --output=<path-to-output-ABC>
.\appcat.exe analyze --bulk --input=<path-to-source-E> --output=<path-to-output-ABC>
```

---

#### Transform subcommand

The `transform` subcommand enables you to convert the previous `appcat` XML rules used in the 6.x version into the new YAML format used by this version 7.x.

To transform rules, use the following command:

# [Linux / macOS](#tab/linux)

```bash
./appcat transform rules --input=<path-to-xml-rules> --output=<path-to-output-directory>
```

# [Windows](#tab/windows)

```cmd
.\appcat.exe transform rules --input=<path-to-xml-rules> --output=<path-to-output-directory>
```

---

The `--input` flag should point to a file or directory containing XML rules, and the `--output` flag should point to the output directory for the converted YAML rules.

### Samples

> [!NOTE]
> Ensure that the file permissions for scripts in the extracted folder are set to allow execution.

In the **samples** directory, you can find the following scripts to run different types of analysis:

- **run-assessment**: Provides a report with code assessment and steps for migrating Airsonic to Azure App Service on Tomcat.
- **run-assessment-transform-rules**: Converts Windup XML rules to analyzer-lsp-compatible YAML rules.
- **run-assessment-custom-rules**: Provides a code assessment report using custom rules (transform XML to YAML).
- **run-assessment-openjdk21**: Generates a report with code assessment and steps for migrating Airsonic to OpenJDK 21.
- **run-assessment-package-only**: Produces a report by assessing specific packages.

These scripts are intended to be used with the [Airsonic-Advanced](https://github.com/airsonic-advanced/airsonic-advanced) sample project - a community-driven, web-based media streamer that enables you to access and share your music collection.

You can clone the application repository manually using the following command:

```sh
git clone https://github.com/airsonic-advanced/airsonic-advanced.git
```

After cloning, provide the path to the cloned folder when running the assessment scripts. Depending on your operating system, run the appropriate script, as shown in the following example:

> [!NOTE]
> Make sure you have cloned the Airsonic Advanced project to a local path before running the scripts.

# [Linux / macOS](#tab/linux)

```bash
./samples/run-assessment <path-to-airsonic-advanced>
```

# [Windows](#tab/windows)

```cmd
.\samples\run-assessment.bat <path-to-airsonic-advanced>
```

---

The reports are automatically generated and launched. You can find the reports under **../samples/report-\*** (Linux/macOS) or **..\samples\report-\*** (Windows).

### Summary of the analysis

The landing page of the report presents a summary view of all analyzed applications. From here, you can navigate to individual application reports to explore detailed findings.

:::image type="content" source="media/java/appcat-7-report-summary.png" alt-text="Screenshot of the appcat summary report." lightbox="media/java/appcat-7-report-summary.png":::

The **Ask Copilot** button in the upper-right corner redirects you to the GitHub Copilot App Modernization for Java extension in Visual Studio Code. This extension provides both app assessment and code remediation as its key capabilities for migrating Java applications to Azure - powered by AppCAT and GitHub Copilot's AI capabilities.

### Assessment report

The assessment report provides a categorized issue list of various aspects of Azure readiness, cloud native, and Java modernization that you need to address to successfully migrate the application to Azure.

Each *Issue* is categorized by severity - **Mandatory**, **Optional**, or **Potential** - and includes the number of impacted lines of code.

The **Dependencies** and **Technologies** tabs display the libraries and technologies used within the application.

:::image type="content" source="media/java/appcat-7-report-assessment.png" alt-text="Screenshot of the AppCAT assessment report." lightbox="media/java/appcat-7-report-assessment.png":::

### Detailed information for a specific issue

For each issue, you can get more information (the issue detail, the content of the rule, and so on) just by selecting it. You also get the list of all the files affected by this issue.

:::image type="content" source="media/java/appcat-7-report-assessment-detail.png" alt-text="Screenshot of the AppCAT issue detail report." lightbox="media/java/appcat-7-report-assessment-detail.png":::

Then, for each file or class affected by the issue, you can jump into the source code to highlight the line of code that created the issue.

:::image type="content" source="media/java/appcat-7-report-assessment-code.png" alt-text="Screenshot of the AppCAT issue code report." lightbox="media/java/appcat-7-report-assessment-code.png":::

## Release notes

### 7.6.0.7

This release contains the following fixes and enhancements.

- Added support for Gradle-based project analysis.
- Support to analyze Open Liberty projects.
- Show assessment progress by displaying the number of rules processed during assessment.
- Removed Maven prerequisites, use the Maven Wrapper when needed.
- Replaced `airsonic.war` with `airsonic-advanced` as the sample application in the released artifacts.

### 7.6.0.6

This release contains the following fixes and enhancements.

- A default **.appcat-ignore** file is now included in the release package by default. This file causes the tool to exclude specified folders or paths that don't need to be analyzed.
- Fixed the issue of missing dependencies in the report when using `full` mode (specified by using `--mode`).
- Scoped analysis to AppCAT-supported targets when no targets are specified.
- Ignored comment lines during analysis.
- Fixed incorrect location for XML rules.

### 7.6.0.5

This release contains the following fixes and enhancements.

- The `--input` flag now accepts multiple values, enabling you to analyze multiple applications in a single command execution.
- The static report categorizes its issue list for better readability.
- Users can now install AppCAT in directories other than the user's home directory.
- Fixed an issue where running `analyze` with both `--bulk` and `--skip-static-report` failed to generate multiple output files.
- Resolved a failure when analyzing with `--bulk` and `--rules` if no Java provider was launched.
- Fixed an issue where analysis would fail if a specified package wasn't found when using the `--packages` flag.
- The `--exclude-paths` flag is deprecated. To exclude files or directories, use a **.appcat-ignore** file - supporting glob patterns - placed in the input directory or installation directory.

### 7.6.0.4

This release contains the following fixes and enhancements.

- Supports telemetry collection. Use the `--disable-telemetry` flag to disable telemetry.
- Refactors the CLI command format to make it clearer.
  - Updates the `--source` flag, changing from `--source <source1> --source <source2> ...` to `--source <source1>,<source2>,...`
  - Updates the `--target` flag, changing from `--target <target1> --target <target2> ...` to ` --target <target1>,<target2>,...`
  - Updates the `--rules` flag, changing from `--rules <rule1> --rules <rule2> ...` to `--rules <rule1>,<rule2>,...`
  - Updates the `--maven-settings` flag to `--custom-maven-settings`
  - Updates the `--limit-code-snips` flag to `--code-snips-number`
  - Removes the `--json-output` flag, use `--output-format` flag, choose output format: 'yaml' or 'json'. (default yaml)
  - Removes the `--provider`, `--override-provider-settings`, `--list-providers`, and `--dependency-folders` flags
- A new `--exclude-paths` flag: Specifies paths that should be ignored in analysis. Use a comma-separated list for multiple values: `--exclude-paths <path1>,<path2>,...`. The default value is `[]`.
- A new `--packages` flag: Specifies application class packages to be evaluated. Use a comma-separated list for multiple values: `--packages <package1>,<package2>,...`. The default value is `[]`.
- A new `--dry-run` flag: Only checks whether the flags are valid without actually running the analysis actually. The default value is `false`.
- Removes `azure-spring-apps` from the appcat `--list-targets`.

### 7.6.0.3

This release contains the following fixes and enhancements.

- New `--limit-code-snips` flag: Controls code snippet limits during rule evaluation (0=unlimited, -1=disable snippets).
- Fixed missing dependency file failures in bulk analysis mode: The tool no longer aborts during bulk analysis for non-Java projects or Java projects using `--mode=source-only`.

### 7.6.0.2

This release contains the following fixes.

- `java-removals-00150` rule is now triggering correctly.

### 7.6.0.1

This release contains the following fixes and enhancements.

- `--analyze-known-libraries` flag: Now works on Windows.
- Directory cleanup: Extra directories created during analysis on Windows are now automatically cleaned up.
- `--json-output` flag: Now operational.
- Rules parsing error: The error `unable to parse all the rules for ruleset` is resolved.
- Insights tab descriptions: Missing rule descriptions are now present.
- Internet connection dependency: Analysis no longer fails without an internet connection.
- `--context-lines` flag: Now behaves as expected when set to 0.
- Removed Python requirement to run the tool.

### 7.6.0.0

This release is based on a different set of components of the Konveyor project.

**General Updates**

- New engine based on the [Konveyor Analyzer LSP](https://github.com/konveyor/analyzer-lsp) project, with a CLI based on the [Konveyor Kantra](https://github.com/konveyor/kantra/) project.

### 6.3.9.0

This release contains the following fixes and includes a set of new rules.

**General Updates**

- Integrated changes from the Windup upstream repository (6.3.9.Final Release).
- Resolved broken links in rule descriptions and help text.

**Rules**

- Azure Message Queue: updated and added new rules for `azure-message-queue-rabbitmq` and `azure-message-queue-amqp`.
- Azure Service Bus: introduced a detection rule for Azure Service Bus.
- MySQL and PostgreSQL: refined dependency detection rules.
- Azure-AWS Rules: enhanced and improved existing rules.
- S3 Spring Starter: added a detection rule for S3 Spring Starter.
- RabbitMQ Spring JMS: added a detection rule for RabbitMQ Spring JMS.
- Logging Rules: updated and refined logging-related rules.
- Local-Storage Rule: updated and refined the local storage rule.
- Azure File System Rule: updated and refined the Azure File System rule.

**Libraries**

- Updated libraries to address security vulnerabilities.

### 6.3.0.9

This release contains the following fixes and includes a set of new rules.

- Resolved an issue with the `localhost-java-00001` rule.
- Introduced new rules for identifying technologies such as AWS S3, AWS SQS, Alibaba Cloud OSS, Alibaba Cloud SMS, Alibaba Scheduler X, Alibaba Cloud Seata, and Alibaba Rocket MQ.
- Updated the `azure-file-system-02000` to now support XML file extensions.
- Upgraded various libraries to address security vulnerabilities.

### 6.3.0.8

Previously, a set of targets were enabled by default, making it difficult for certain customers to assess large applications with too many issues related to less critical issues. To reduce noise in reports, users must now specify multiple targets, with the parameter `--target`, when executing `appcat`, giving them the option to select only the targets that matter.

### 6.3.0.7

GA (Generally Available) release of Azure Migrate application and code assessment.

## Known issues

### 7.6.0.7

- Rules issues:
  - The `azure-system-config-01000` rules aren't being triggered.
  - The `azure-password-01000` rule detects only one violation, even when multiple violations exist in the same file.
- An error in the Watcher Error channel on Windows: `Windows system assumed buffer larger than it is, events have likely been missed`. This error message appears on the command line during long-running jobs on Windows.

### 7.6.0.6

- Rules issues:
  - The `azure-system-config-01000` rules aren't being triggered.
  - The `azure-password-01000` rule detects only one violation, even when multiple violations exist in the same file.
- An error in the Watcher Error channel on Windows: `Windows system assumed buffer larger than it is, events have likely been missed`. This error message appears on the command line during long-running jobs on Windows.

### 7.6.0.5

- Rules issues:
  - The `azure-system-config-01000` rules aren't being triggered.
  - The `azure-password-01000` rule detects only one violation, even when multiple violations exist in the same file.
- An error in the Watcher Error channel on Windows: `Windows system assumed buffer larger than it is, events have likely been missed`. This error message appears on the command line during long-running jobs on Windows.

### 7.6.0.4

- Rules issues:
  - The `azure-system-config-01000` rules aren't being triggered.
  - The `azure-password-01000` rule detects only one violation, even when multiple violations exist in the same file.
- An error in the Watcher Error channel on Windows: `Windows system assumed buffer larger than it is, events have likely been missed`. This error message appears on the command line during long-running jobs on Windows.

### 7.6.0.3

- The flag `--overrideProviderSettings` isn't supported.
- Rules issues:
    - `azure-system-config-01000`, `http-session-01000` rules aren't being triggered.
    - `FileSystem - Java IO` rule isn't being triggered.
- Analyzing WAR files on Windows produces the following error: `Failed to Move Decompiled File`. An error occurs when analyzing WAR files on Windows, which is responsible for a few redundant issues created on Windows OS.
- Error in Watcher Error channel on Windows: `Windows system assumed buffer larger than it is, events have likely been missed`. This error message appears on the command line during long-running jobs on Windows.
- <kbd>Ctrl</kbd>+<kbd>C</kbd> fails to stop ongoing analysis. To work around, manually terminate the process by explicitly killing the process.
- In binary analysis reports, the code snippet title shows an incorrect or nonexistent file path.

### 7.6.0.2

- The flag `--overrideProviderSettings` isn't supported.
- Rules issues:
    - `azure-system-config-01000`, `http-session-01000` rules aren't being triggered.
    - `FileSystem - Java IO` rule isn't being triggered.
- Analyzing WAR files on Windows produces the following error: `Failed to Move Decompiled File`. An error occurs when analyzing WAR files on Windows, which is responsible for a few redundant issues created on Windows OS.
- Error in Watcher Error channel on Windows: `Windows system assumed buffer larger than it is, events have likely been missed`. This error message appears on the command line during long-running jobs on Windows.
- <kbd>Ctrl</kbd>+<kbd>C</kbd> fails to stop ongoing analysis. To work around, manually terminate the process by explicitly killing the process.
- In binary analysis reports, the code snippet title shows an incorrect or nonexistent file path.

### 7.6.0.1

- The flag `--overrideProviderSettings` isn't supported.
- Rules issues:
    - `azure-system-config-01000`, `http-session-01000`, `java-removals-00150` rules aren't being triggered.
    - `FileSystem - Java IO` rule isn't being triggered.
- Analyzing WAR files on Windows produces the following error: `Failed to Move Decompiled File`. An error occurs when analyzing WAR files on Windows, which is responsible for a few redundant issues created on Windows OS.
- Error in Watcher Error channel on Windows: `Windows system assumed buffer larger than it is, events have likely been missed`. This error message appears on the command line during long-running jobs on Windows.
- <kbd>Ctrl</kbd>+<kbd>C</kbd> fails to stop ongoing analysis. To work around, manually terminate the process by explicitly killing the process.
- In binary analysis reports, the code snippet title shows an incorrect or nonexistent file path.

### 7.6.0.0

- The flag `--analyze-known-libraries` isn't working on Windows.
- On Windows, the following extra folders are generated during the analysis process but aren't automatically removed after completion. You might want to remove these extra folders after the analysis finishes.
     - **.metadata**
     - **org.eclipse.osgi**
     - **org.eclipse.equinox.app**
     - **org.eclipse.core.runtime**
     - **org.eclipse.equinox.launcher**
- The flag `--overrideProviderSettings` isn't supported.
- The flag `--json-output` isn't supported. In a future release, it generates JSON outputs for the **output.yaml** and **dependency.yaml** files.
- Rules issues:
    - `azure-system-config-01000`, `http-session-01000`, `java-removals-00150` rules aren't being triggered.
    - `FileSystem - Java IO` rule isn't being triggered.
    - Error `unable to parse all the rules for ruleset` when running analysis. This error occurs during analysis when the tool fails to parse all rules in the ruleset.
- Analyzing WAR files on Windows produces the following error: `Failed to Move Decompiled File`. An error occurs when analyzing WAR files on Windows, which is responsible for a few redundant issues created on Windows OS.
- Missing descriptions for some rules on the **Insights** tab. Some tag rules are lacking descriptions, leading to blank titles appearing on the **Insights** tab of the report.
- Error in **Watcher Error** channel on Windows: `Windows system assumed buffer larger than it is, events have likely been missed`. This error message appears on the command line during long-running jobs on Windows.
- This release requires an active internet connection for dependency analysis.
- <kbd>Ctrl</kbd>+<kbd>C</kbd> fails to stop ongoing analysis. To work around, manually terminate the process by explicitly killing the process.
- When the flag `--context-lines` is set to a number 0, it doesn't work as expected. This flag enables the user to limit how much of the source code should appear on the report. Setting to a value 0 might not work as expected.

## License

Azure Migrate application and code assessment for Java is a free, open source-based tool.

## Data collection

AppCAT collects telemetry data by default. Microsoft aggregates collected data to identify patterns of usage to identify common issues and to improve the experience of the AppCAT CLI. The Microsoft AppCAT CLI doesn't collect any private or personal data. For example, the usage data helps identify issues such as commands with low success rate. This information helps us prioritize our work.

While we appreciate the insights this data provides, we also understand that not everyone wants to send usage data. You can disable data collection by using the `appcat analyze --disable-telemetry` command. For more information, see our [privacy statement](https://www.microsoft.com/privacy/privacystatement).
