---
title: Azure Migrate Application and Code Assessment for Java Version 7
description: Learn how to use the next generation of Azure Migrate application and code assessment tool to determine readiness to migrate any type of Java application to Azure.
author: KarlErickson
ms.author: brborges
ms.service: azure
ms.custom: devx-track-java, devx-track-extended-java
ms.topic: overview
ms.date: 01/15/2025
#customer intent: As a developer, I want to assess my Java application so that I can understand its readiness for migration to Azure.
---

# Azure Migrate application and code assessment for Java version 7 (Preview)

> [!NOTE]
> This article is for the next generation of *Azure Migrate application and code assessment for Java*, version 7.x. This version is in preview. For the previous stable version, version 6.x, see [Azure Migrate application and code assessment for Java](./java.md).

This article shows you how to use the Azure Migrate application and code assessment tool for Java to assess and replatform any type of Java application. The tool enables you to evaluate application readiness for replatforming and migration to Azure. This tool is offered as a command-line interface (CLI), and assesses Java application binaries and source code to identify replatforming and migration opportunities for Azure. It helps you modernize and replatform large-scale Java applications by identifying common use cases and code patterns and proposing recommended changes.

The tool discovers application technology usage through static code analysis, provides effort estimation, and accelerates code replatforming. This assessment helps you to prioritize and move Java applications to Azure. With a set of engines and rules, the tool can discover and assess different technologies such as Java 11, Java 17, Jakarta EE, Spring, Hibernate, Java Message Service (JMS), and more. The tool then helps you replatform the Java application to different Azure targets - Azure App Service, Azure Kubernetes Service, and Azure Container Apps - with specific Azure replatforming rules.

The tool is based on a set of components in the [Cloud Native Computing Foundation](https://www.cncf.io/) project [Konveyor](https://github.com/konveyor), created and led by Red Hat.

## Overview

The tool is designed to help organizations modernize their Java applications in a way that reduces costs and enables faster innovation. The tool uses advanced analysis techniques to understand the structure and dependencies of any Java application, and provides guidance on how to refactor and migrate the applications to Azure.

With it, you can perform the following tasks:

* Discover technology usage: Quickly see which technologies an application uses. Discovery is useful if you have legacy applications with not much documentation and want to know which technologies they use.
* Assess the code to a specific target: Assess an application for a specific Azure target. Check the effort and the modifications you have to do to replatform your applications to Azure.

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

* Azure Databases
* Azure Service Bus
* Azure Storage
* Azure Content Delivery Network
* Azure Event Hubs
* Azure Key Vault
* Azure Front Door

## Download and Install

To use the `appcat` CLI, you must download the package specific to your environment, and have the required dependencies in your environment.
The `appcat` CLI runs on any environment such as Windows, Linux, or Mac, using Intel, Arm, or Apple Silicon hardware.
For the JDK requirement, we recommend you use the [Microsoft Build of OpenJDK](/java/openjdk).

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

[1]: https://aka.ms/appcat/azure-migrate-appcat-for-java-cli-linux-amd64-7.6.0.0-preview.tar.gz
[2]: https://aka.ms/appcat/azure-migrate-appcat-for-java-cli-linux-amd64-7.6.0.0-preview.tar.gz.sha256sum.txt
[3]: https://aka.ms/appcat/azure-migrate-appcat-for-java-cli-linux-amd64-7.6.0.0-preview.tar.gz.sig
[4]: https://aka.ms/appcat/azure-migrate-appcat-for-java-cli-linux-arm64-7.6.0.0-preview.tar.gz
[5]: https://aka.ms/appcat/azure-migrate-appcat-for-java-cli-linux-arm64-7.6.0.0-preview.tar.gz.sha256sum.txt
[6]: https://aka.ms/appcat/azure-migrate-appcat-for-java-cli-linux-arm64-7.6.0.0-preview.tar.gz.sig
[7]: https://aka.ms/appcat/azure-migrate-appcat-for-java-cli-macos-amd64-7.6.0.0-preview.tar.gz
[8]: https://aka.ms/appcat/azure-migrate-appcat-for-java-cli-macos-amd64-7.6.0.0-preview.tar.gz.sha256sum.txt
[9]: https://aka.ms/appcat/azure-migrate-appcat-for-java-cli-macos-amd64-7.6.0.0-preview.tar.gz.sig
[10]: https://aka.ms/appcat/azure-migrate-appcat-for-java-cli-macos-arm64-7.6.0.0-preview.tar.gz
[11]: https://aka.ms/appcat/azure-migrate-appcat-for-java-cli-macos-arm64-7.6.0.0-preview.tar.gz.sha256sum.txt
[12]: https://aka.ms/appcat/azure-migrate-appcat-for-java-cli-macos-arm64-7.6.0.0-preview.tar.gz.sig
[13]: https://aka.ms/appcat/azure-migrate-appcat-for-java-cli-windows-amd64-7.6.0.0-preview.zip
[14]: https://aka.ms/appcat/azure-migrate-appcat-for-java-cli-windows-amd64-7.6.0.0-preview.zip.sha256sum.txt
[15]: https://aka.ms/appcat/azure-migrate-appcat-for-java-cli-windows-amd64-7.6.0.0-preview.zip.sig
[16]: https://aka.ms/appcat/azure-migrate-appcat-for-java-cli-windows-arm64-7.6.0.0-preview.zip
[17]: https://aka.ms/appcat/azure-migrate-appcat-for-java-cli-windows-arm64-7.6.0.0-preview.zip.sha256sum.txt
[18]: https://aka.ms/appcat/azure-migrate-appcat-for-java-cli-windows-arm64-7.6.0.0-preview.zip.sig

### Prerequisites

- [Download](/java/openjdk/download#openjdk-17) and [install Microsoft Build of OpenJDK 17](/java/openjdk/install). Ensure that the **JAVA_HOME** environment variable is set.
- [Download Apache Maven](https://maven.apache.org/download.cgi) and [install locally](https://maven.apache.org/install.html). Ensure that the Maven binary (`mvn`) is reachable through `PATH` environment variable.
- [Download and install Python 3](https://www.python.org/downloads/).

### Installation

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

### Running the tool

#### Option 1: Run appcat from the downloaded folder

Change the directory to the extracted folder:

```bash
cd /azure-migrate-appcat-for-java-cli-<OS>-<architecture>-<release-version>-preview/
./appcat --help
```

> [!NOTE]
> The `appcat` binary first looks for its dependencies in the current directory, where it's running from, and falls back to the following scenario if they aren't found.

#### Option 2: Add the appcat binary path to your $PATH

Move the contents of the folder to the **.appcat** folder in the user's home directory - **$HOME/.appcat** on Linux/Mac and **%USERPROFILE%/.appcat** on Windows.

Add the **.appcat** folder to your `PATH` environment variable so you can run the tool from any folder in the terminal.

# [Linux / macOS](#tab/linux)

```bash
mv <path-to-extracted>/azure-migrate-appcat-for-java-cli-<OS>-<architecture>-<release-version>-preview/ $HOME/.appcat
```

# [Windows](#tab/windows)

```cmd
move <path-to-extracted>\azure-migrate-appcat-for-java-cli-<OS>-<architecture>-<release-version>-preview\ %USERPROFILE%\.appcat
```

---

> [!NOTE]
> In this context, when the `appcat` binary is called from a different folder than where it's installed, it looks for its dependencies in the **.appcat** folder in the user's home directory.

## Usage

### Subcommands

AppCAT provides two subcommands for usage:

- `analyze`: Run source code analysis on input source code or a binary.
- `transform`: Convert XML rules from previous versions (6 and older) to YAML format used by this version.

> [!NOTE]
> For macOS users: If you encounter an error stating "Apple could not verify" when trying to run the app, you can resolve this error by using the following command:
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

The `analyze` subcommand allows you to run source code and binary analysis.

To analyze application source code, run the following command:

# [Linux / macOS](#tab/linux)

```bash
./appcat analyze --input=<path-to-source-code> --output=<path-to-output-directory> --target=azure-appservice --overwrite
```

# [Windows](#tab/windows)

```cmd
.\appcat.exe analyze --input=<path-to-source-code> --output=<path-to-output-directory> --target=azure-appservice --overwrite
```

---

The `--input` flag must point to a source code directory or a binary file, and `--output` must point to a directory to store the analysis results.

For more information on the analyze flags, run the following command:

# [Linux / macOS](#tab/linux)

```bash
./appcat analyze --help
```

# [Windows](#tab/windows)

```cmd
.\appcat.exe analyze --help
```

---

To check the available targets for AppCAT, run the following command:

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
azure-spring-apps
cloud-readiness
linux
openjdk11
openjdk17
openjdk21
```

#### Analyzing Multiple Applications

AppCAT is designed to analyze a single application per command execution, but if you use the `--bulk` option, you can analyze multiple applications in a single execution. This option generates a single static report in the output directory that includes the results for all applications.

To analyze multiple applications, run the following command:

# [Linux / macOS](#tab/linux)

```bash
./appcat analyze --bulk --input=<path-to-source-A> --output=<path-to-output-ABC> --target=<targetname>
./appcat analyze --bulk --input=<path-to-source-B> --output=<path-to-output-ABC> --target=<targetname>
./appcat analyze --bulk --input=<path-to-source-C> --output=<path-to-output-ABC> --target=<targetname>
```

# [Windows](#tab/windows)

```cmd
.\appcat.exe analyze --bulk --input=<path-to-source-A> --output=<path-to-output-ABC> --target=<targetname>
.\appcat.exe analyze --bulk --input=<path-to-source-B> --output=<path-to-output-ABC> --target=<targetname>
.\appcat.exe analyze --bulk --input=<path-to-source-C> --output=<path-to-output-ABC> --target=<targetname>
```

---

#### Transform Subcommand

The `transform` subcommand allows you to convert the previous `appcat` XML rules used in the 6.x version into the new YAML format used by this version 7.x.

To transform rules, run the following command:

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

In the **samples** folder, you can find a sample web application called **airsonic.war**. Airsonic is a web-based media streamer, providing access to your music and enabling you to share it with friends. To learn more about Airsonic, see [Airsonic](https://github.com/airsonic/airsonic).

In the **samples** directory, you can find the following scripts to run different types of analysis:

- **run-assessment**: Provides a report with code assessment and steps for migrating Airsonic to Azure App Service on Tomcat.
- **run-assessment-transform-rules**: Converts Windup XML rules to analyzer-lsp-compatible YAML rules.
- **run-assessment-custom-rules**: Provides a code assessment report using custom rules (transform XML to YAML).
- **run-assessment-openjdk21**: Generates a report with code assessment and steps for migrating Airsonic to OpenJDK 21.
- **run-assessment-package-only**: Produces a report by assessing specific packages.

Depending on your operating system, run the appropriate script, as shown in the following example:

# [Linux / macOS](#tab/linux)

```bash
./samples/run-assessment
```

# [Windows](#tab/windows)

```cmd
.\samples\run-assessment.bat
```

---

The reports are automatically generated and launched. You can find the reports under **../samples/report-\*** (Linux/macOS) or **..\samples\report-\*** (Windows).

### Summary of the analysis

The landing page of the report lists all the technologies that are used in the application. The dashboard provides a summary of the analysis, including the number of transformation incidents, the incidents categories, or the story points.

:::image type="content" source="media/java/report-summary.png" alt-text="Screenshot of the appcat summary report." lightbox="media/java/report-summary.png":::

When you zoom in on the **Incidents by Category** pie chart, you can see the number of incidents by category: **Mandatory**, **Optional**, and **Potential**.

The dashboard also shows the *story points*. The story points are an abstract metric commonly used in Agile software development to estimate the level of effort needed to implement a feature or change. `appcat` uses story points to express the level of effort needed to migrate a particular application. Story points don't necessarily translate to work hours, but the value should be consistent across tasks.

:::image type="content" source="media/java/report-summary-incident.png" alt-text="Screenshot of the AppCAT summary incident report." lightbox="media/java/report-summary-incident.png":::

### Assessment report

The assessment report gives an overview of the transformation issues that would need to be solved to migrate the application to Azure.

These *Issues*, also called *Incidents*, have a severity (*Mandatory*, *Optional*, or *Potential*), a level of effort, and a number indicating the story points. The story points are determined by calculating the number of incidents times the effort required to address the issue.

:::image type="content" source="media/java/report-assessment.png" alt-text="Screenshot of the AppCAT assessment report." lightbox="media/java/report-assessment.png":::

### Detailed information for a specific issue

For each incident, you can get more information (the issue detail, the content of the rule, and so on) just by selecting it. You also get the list of all the files affected by this incident.

:::image type="content" source="media/java/report-assessment-detail.png" alt-text="Screenshot of the AppCAT issue detail report." lightbox="media/java/report-assessment-detail.png":::

Then, for each file or class affected by the incident, you can jump into the source code to highlight the line of code that created the issue.

:::image type="content" source="media/java/report-assessment-code.png" alt-text="Screenshot of the AppCAT issue code report." lightbox="media/java/report-assessment-code.png":::

## Release notes

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

Previously, a set of targets were enabled by default, making it difficult for certain customers to assess large applications with too many incidents related to less critical issues. To reduce noise in reports, users must now specify multiple targets, with the parameter `--target`, when executing `appcat`, giving them the option to select only the targets that matter.

### 6.3.0.7

GA (Generally Available) release of Azure Migrate application and code assessment.

## Known Issues

### 7.6.0.0

1. The flag `--analyze-known-libraries` isn't working on Windows.
1. On Windows, the following extra folders are generated during the analysis process but aren't automatically removed after completion. You might want to remove these extra folders after the analysis finishes.
     - **.metadata**
     - **org.eclipse.osgi**
     - **org.eclipse.equinox.app**
     - **org.eclipse.core.runtime**
     - **org.eclipse.equinox.launcher**
1. The flag `--overrideProviderSettings` isn't supported.
1. The flag `--json-output` isn't supported. In a future release, it generates JSON outputs for the **output.yaml** and **dependency.yaml** files.
1. Rules issues:
    - **azure-system-config-01000**, **http-session-01000**, **java-removals-00150** rules aren't being triggered.
    - **FileSystem - Java IO** rule isn't being triggered
    - _"unable to parse all the rules for ruleset"_ when running analysis. This error occurs during analysis when the tool fails to parse all rules in the ruleset.
1. Analyzing WAR files on Windows produces the following error: `Failed to Move Decompiled File`. An error occurs when analyzing WAR files on Windows, which is responsible for a few redundant incidents created on Windows OS.
1. Missing descriptions for some rules on the Insights tab. Some tag rules are lacking descriptions, leading to blank titles appearing on the `Insights` tab of the report.
1. Error in Watcher Error channel on Windows: `Windows system assumed buffer larger than it is, events have likely been missed`. This error message appears on the command line during long-running jobs on Windows.
1. This release requires an active internet connection for dependency analysis.
1. <kbd>Ctrl</kbd>+<kbd>C</kbd> fails to stop ongoing analysis. To work around, manually terminate the process by explicitly killing the process.
1. When the flag `--context-lines` is set to a number 0, it doesn't work as expected. This flag allows the user to limit how much of the source code should appear on the report. Setting to a value 0 might not work as expected.

## License

Azure Migrate application and code assessment for Java is a free, open source-based tool.
