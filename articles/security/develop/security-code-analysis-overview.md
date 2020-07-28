---
title: Microsoft Security Code Analysis documentation overview
description: This article is an overview of the Microsoft Security Code Analysis extension
author: sukhans
manager: sukhans
ms.author: terrylan
ms.date: 07/31/2019
ms.topic: article
ms.service: security
services: azure

ms.assetid: 521180dc-2cc9-43f1-ae87-2701de7ca6b8
ms.devlang: na
ms.tgt_pltfrm: na
ms.workload: na
---
# About Microsoft Security Code Analysis

With the Microsoft Security Code Analysis extension, teams can add security code analysis to their Azure DevOps continuous integration and delivery (CI/CD) pipelines. This analysis is recommended by the [Secure Development Lifecycle (SDL)](https://www.microsoft.com/securityengineering/sdl/practices) experts at Microsoft.

A consistent UX simplifies security by hiding the complexity of running tools. With NuGet-based delivery of the tools, teams no longer need to manage the installation or update of tooling. With both command-line and basic interfaces for build tasks, all users can have as much control over the tools as they want.

Teams can also use powerful postprocessing capabilities such as:

- Publishing logs for retention.
- Generating actionable, developer-focused reports.
- Configuring build breaks on regression tests.

## Why should I use Microsoft Security Code Analysis?

### Security simplified

Adding Microsoft Security Code Analysis tools to your Azure DevOps pipeline is as simple as adding new tasks. Customize the tasks or use their default behavior. Tasks run as part of your Azure DevOps pipeline and produce logs that detail many kinds of results.

### Clean builds

After addressing the initial issues reported by the tools, you can configure the extension to break builds on new issues. Setting up continuous integration builds on every pull request is easy.

### Set it and forget it

By default, the build tasks and tools stay up-to-date. If there's an updated version of a tool, you don't need to download and install it. The extension takes care of the updating for you.

### Under the hood

The extension's build tasks hide the complexities of:
  - Running security static-analysis tools.
  - Processing the results from log files to create a summary report or break the build.

## Microsoft Security Code Analysis tool set

The Microsoft Security Code Analysis extension makes the latest versions of important analysis tools readily available to you. The extension includes both Microsoft-managed tools and open-source tools.

These tools are automatically downloaded to the cloud-hosted agent after you use the corresponding build task to configure and run the pipeline.

This section lists the set of tools that are currently available in the extension. Watch for the addition of more tools. Also, send us your suggestions for tools that you want us to add.

### Anti-Malware Scanner

The Anti-Malware Scanner build task is now included in the Microsoft Security Code Analysis extension. This task must be run on a build agent that has Windows Defender already installed. For more information, see the [Windows Defender website](https://aka.ms/defender).

### BinSkim

BinSkim is a Portable Executable (PE) lightweight scanner that validates compiler settings, linker settings, and other security-relevant characteristics of binary files. This build task provides a command-line wrapper around the binskim.exe console application. BinSkim is an open-source tool. For more information, see [BinSkim on GitHub](https://github.com/Microsoft/binskim).

### Credential Scanner

Passwords and other secrets stored in source code are a significant problem. Credential Scanner is a proprietary static-analysis tool that helps solve this problem. The tool detects credentials, secrets, certificates, and other sensitive content in your source code and your build output.

### Roslyn Analyzers

Roslyn Analyzers is Microsoft's compiler-integrated tool for statically analyzing managed C# and Visual Basic code. For more information, see [Roslyn-based analyzers](https://docs.microsoft.com/dotnet/standard/analyzers/).

### TSLint

TSLint is an extensible static-analysis tool that checks TypeScript code for readability, maintainability, and errors in functionality. It's widely supported by modern editors and build systems. You can customize it with your own lint rules, configurations, and formatters. TSLint is an open-source tool. For more information, see [TSLint on GitHub](https://github.com/palantir/tslint).

## Analysis and post-processing of results

The Microsoft Security Code Analysis extension also has three postprocessing tasks. These tasks help you analyze the results found by the security-tool tasks. When added to a pipeline, these tasks usually follow all other tool tasks.

### Publish Security Analysis Logs

The Publish Security Analysis Logs build task preserves the log files of the security tools that are run during the build. You can read these logs for investigation and follow-up.

You can publish the log files to Azure Artifacts as a .zip file. You can also copy them to an accessible file share from your private build agent.

### Security Report

The Security Report build task parses the log files. These files are created by the security tools that run during the build. The build task then creates a single summary report file. This file shows all issues found by the analysis tools.

You can configure this task to report results for specific tools or for all tools. You can also choose what issue level to report, like errors only or both errors and warnings.

### Post-Analysis (build break)

With the Post-Analysis build task, you can inject a build break that purposely causes a build to fail. You inject a build break if one or more analysis tools report issues in the code.

You can configure this task to break the build for issues found by specific tools or all tools. You can also configure it based on the severity of issues found, such as errors or warnings.

>[!NOTE]
>By design, each build task succeeds if the task finishes successfully. This is true whether or not a tool finds issues, so that the build can run to completion by allowing all tools to run.

## Next steps

For instructions on how to onboard and install Microsoft Security Code Analysis, refer to our [Onboarding and installation guide](security-code-analysis-onboard.md).

For more information about configuring the build tasks, see our [Configuration guide](security-code-analysis-customize.md) or [YAML Configuration guide](yaml-configuration.md).

If you have further questions about the extension and the tools offered, check out our [FAQ page](security-code-analysis-faq.md).
