---
title: "Quickstart: Assess a Java Project using AppCAT 7"
description: Azure Migrate application and code assessment tool - Quick start to assess a java project.
author: KarlErickson
ms.author: karler
ms.reviewer: brborges
ms.service: azure
ms.custom: devx-track-java, build-2025
ms.topic: overview
ms.date: 06/27/2025
#customer intent: As a developer, I want to assess my Java application so that I can understand its readiness for migration to Azure.
---

# Quickstart: Assess a java project using AppCAT 7

This article describes how to download, install and run AppCAT 7 against a sample Java project.

## Prerequisites

Before downloading AppCAT, please make sure JDK is installed and configured correctly.

- [Download](/java/openjdk/download#openjdk-17) and [install Microsoft Build of OpenJDK 17](/java/openjdk/install). Ensure that the `JAVA_HOME` environment variable is set.

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

To install `appcat`, download the appropriate zip file for your platform. After you download the file, depending on your operating system, you should find either a **.tar.gz** (Linux/macOS) or **.zip** file (Windows).

Extract the binary from the downloaded file. You should see the following folder structure:

```
/azure-migrate-appcat-for-java-cli-<OS>-<architecture>-<release-version>/
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

## Run AppCAT against a sample Java project

In following steps, let's do application assessment using AppCAT against [Airsonic-Advanced](https://github.com/airsonic-advanced/airsonic-advanced) - a community-driven, web-based media streamer that enables you to access and share your music collection.

1. To run `appcat` from any location in your terminal, extract the archive to your desired location. Then, update the `PATH` environment variable to include the directory where you extracted the archive.

   > [!NOTE]
   > When the `appcat` binary is called, it first looks for its dependencies in the executable folder specified in the `PATH` environment variable. If the dependencies aren't found, it falls back to the user's home directory - **~/.appcat** on Linux/Mac or **%USERPROFILE%\\.appcat** on Windows.

1. Clone the application repository to a local folder using the following command:

   ```sh
   git clone https://github.com/airsonic-advanced/airsonic-advanced.git
   ```

1. Run the assessment scripts living in samples folder of the downloaded AppCAT release package with providing the path to the cloned folder above. Depending on your operating system, run the appropriate script, as shown in the following example. The reports are automatically generated and opened in your web browser. You can find the reports under **../samples/report-\*** (Linux/macOS) or **..\samples\report-\*** (Windows).

   ### [Linux / macOS](#tab/linux)

   ```bash
   ./samples/run-assessment <path-to-airsonic-advanced>
   ```

   ### [Windows](#tab/windows)

   ```cmd
   .\samples\run-assessment.bat <path-to-airsonic-advanced>
   ```

> [!NOTE]
> Ensure that the file permissions for scripts in the extracted folder are set to allow execution.

In the **samples** directory, you can find the following scripts to run different types of analysis:

- **run-assessment**: Provides a report with code assessment and steps for migrating Airsonic to Azure App Service on Tomcat.
- **run-assessment-transform-rules**: Converts Windup XML rules to analyzer-lsp-compatible YAML rules.
- **run-assessment-custom-rules**: Provides a code assessment report using custom rules (transform XML to YAML).
- **run-assessment-openjdk21**: Generates a report with code assessment and steps for migrating Airsonic to OpenJDK 21.
- **run-assessment-package-only**: Produces a report by assessing specific packages.

## Next steps

- [Interpret the report](appcat7-interpret-report.md)
- [CLI Command Guide for AppCAT 7](appcat7-cli-guide.md)
- [Create custom rules for AppCAT 7](appcat7-rule-guide.md)
