---
title: Release notes
description: Azure Migrate application and code assessment tool - release notes.
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

## Release notes
### 7.6.0.7

This release contains the following fixes and enhancements.

- Support to analyze Gradle-based Spring apps.
- Support to analyze Open Liberty projects.
- Show assessment progress by displaying the number of rules processed during assessment.
- Removed Maven from prerequisites.
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
