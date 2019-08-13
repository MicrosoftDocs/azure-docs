---
title: Microsoft Azure Security Code Analysis documentation overview
description: This article is an overview of Security Code Analysis Extension
author: vharindra
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

With the Microsoft Security Code Analysis extension, teams can seamlessly add security code analysis to their Azure DevOps continuous integration and delivery (CI/CD) pipelines. This analysis is recommended by the [Secure Development Lifecycle (SDL)](https://www.microsoft.com/securityengineering/sdl/practices) experts at Microsoft.

A consistent UX hides the complexities of running various tools. With NuGet-based delivery of the tools, teams no longer need to manage the installation or update of the tooling. With both command-line and basic interfaces for build tasks, users ranging from savvy tool gurus to everyday developers can have as much control over the tools as they want.

Teams can also use powerful postprocessing capabilities such as publishing logs for retention, generating actionable developer-focused reports, and configuring build breaks on regression tests.

## Why use Microsoft Security Code Analysis

### Security simplified

Adding Microsoft security code analysis tools to your Azure DevOps pipeline is as simple as adding new tasks. Customize the tasks or use their default behavior. Tasks run as part of your Azure DevOps pipeline and produce logs that detail many kinds of results.

### Clean builds

After addressing the initial issues reported by the tools, you can configure the extension to break builds on new issues. Setting up continuous integration builds on every pull request is easy.

### Set it and forget it

The build tasks and tools can be set to stay up-to-date, which is their default behavior. If there's an updated version of a tool, you don't need to download and install it. The extension takes care of the updating for you.

### Under the hood

The extension's build tasks hide the complexities of:
  - Running security static-analysis tools.
  - Processing the results from log files. Possible reasons for such processing include creating a summary report or breaking the build.

## Microsoft Security Code Analysis tool set

The Microsoft Security Code Analysis extension makes the latest versions of important analysis tools readily available to you. The extension includes both Microsoft-managed and open source tools. These tools are automatically downloaded on the cloud-hosted agent after you use the corresponding build task to configure and run the pipeline.

This section lists the set of tools that are currently available in the extension. Watch for the addition of more tools. Also, send us your suggestions for tools that you want us to add.

### Anti-Malware Scanner

The Anti-Malware Scanner build task is now included in the Microsoft Security Code Analysis extension. This task must be run on a build agent that has Windows Defender already installed. For more information, see the [Windows Defender website](https://aka.ms/defender).

### BinSkim

BinSkim is a Portable Executable (PE) lightweight scanner that validates compiler settings, linker settings, and other security-relevant characteristics of binary files. This build task provides a command-line wrapper around the BinSkim.exe application. BinSkim is an open-source tool. For more information, see [BinSkim on GitHub](https://github.com/Microsoft/binskim)

### Credential Scanner

Passwords and other secrets stored in source code are currently a significant problem. Credential Scanner is a proprietary static-analysis tool. It detects credentials, secrets, certificates, and other sensitive content in your source code and your build output.

### Microsoft Security Risk Detection

Microsoft Security Risk Detection (MSRD) is a cloud-based fuzz testing service for identifying exploitable security bugs in software. This service requires a separate onboarding process. For more information, see [the MSRD Developer Center](https://docs.microsoft.com/security-risk-detection/).

### .NET Compiler Platform (Roslyn) analyzers

.NET Compiler Platform (Roslyn) is Microsoft's compiler-integrated tool for statically analyzing managed C# and Visual Basic code. For more information, see [Roslyn-based analyzers](https://docs.microsoft.com/dotnet/standard/analyzers/).

### TSLint

TSLint is an extensible static-analysis tool that checks TypeScript code for readability, maintainability, and functionality errors. It's widely supported across modern editors and build systems. You can customize it with your own lint rules, configurations, and formatters. TSLint is an open-source tool. For more information, see [TSLint on GitHub](https://github.com/palantir/tslint).

## Analysis and postprocessing of results

The Microsoft Security Code Analysis extension also has three postprocessing tasks that help you analyze the results found by the security tools tasks. When added to a pipeline, these tasks usually follow all other tool tasks.

### Publish Security Analysis Logs

The Publish Security Analysis Logs build task preserves the log files of the security tools that are run during the build. You can analyze these logs for investigation and follow-up.

You can publish the log files to the Azure Server artifacts as a .zip file or copy them to an accessible file share from your private build agent.

### Security Report

The Security Report build task parses the log files created by the security tools run during the build. It then creates a single summary report file with all issues found by the analysis tools.

You can configure this task to report results for specific tools or for all tools. You can also choose what level of issues should be reported, like errors only or both errors and warnings.

### Post-Analysis (build break)

With the Post-Analysis build task, you can inject a build break that purposely causes the build to fail. You would inject a build break in case one or more analysis tools report issues in the code.

You can configure this task to break the build for issues found by specific tools or for all tools. You can also configure it to break based on the severity of issues found, such as errors or warnings.

>[!NOTE]
>By design, each build task will succeed if the task completes successfully. This is true whether or not a tool finds issues, so that the build can run to completion by allowing all tools to run.

## Next steps

For instructions on onboarding and installing the Security code analysis, refer to our [Onboarding and installation guide](security-code-analysis-onboard.md)

For more information about configuring the build tasks, see our [Configuration guide](security-code-analysis-customize.md)

If you have further questions about the extension and the tools offered, [check our FAQ page.](security-code-analysis-faq.md)