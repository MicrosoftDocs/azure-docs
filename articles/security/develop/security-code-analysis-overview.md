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

**Microsoft Security Code Analysis extension** empowers teams to seamlessly integrate security code analysis into their Azure DevOps CI/CD pipelines as recommended by the [Secure Development Lifecycle (SDL)](https://www.microsoft.com/securityengineering/sdl/practices) experts at Microsoft. Security is simplified through a consistent UX that abstracts the complexities of running various tools. With a NuGet based delivery of the tools, teams no longer need to manage the installing or updating of the tooling. With Command Line and Basic build task interfaces, all users, from savvy tool gurus to everyday developers, can have as little or as much control over the tools as they desire. Teams can also leverage powerful post processing capabilities such as publishing logs for retention, generating actionable developer focused reports & configuring build breaks on regressions.

## Why Microsoft Security Code Analysis

### Security simplified

Adding security code analysis tools to your Azure DevOps Pipeline is as simple as adding new tasks. Customize them or go with the defaults. The tasks run as part of your DevOps pipeline and produce logs detailing all kinds of findings.

### Clean builds

After addressing the initial issues reported by the tools, you can configure the extension to break builds on new issues. Setting up continuous integration build on every pull request has never been this easy!

### Set it and forget it

The build tasks and tools can be set to stay up-to-date (and are by default). If there's an updated version of the tool, there's no need to download and install it; this extension takes care of that for you. 

>>>
### Under the Hood

The Microsoft Security Code Analysis Extension build tasks abstract the complexities of:
  - Running security static analysis tools, and
  - Processing the results from log files to create a summary report or break the build.
>>>

## Security Code Analysis Toolset

The Microsoft Security Code Analysis extension makes readily available to you, the latest versions of important analysis tools. The extension includes both Microsoft Internal and Open Source tools. The tools get automatically downloaded on the cloud-hosted agent once you configure & run the pipeline using the corresponding build task. Below is the set of tools that are available in the extension today. 
Stay tuned for more and send us your suggestions for tools that could be added.

### Anti-Malware Scanner

The Anti-Malware Scanner build task is now included in the Microsoft Security Code Analysis Extension. It must be run on a build agent that has Windows Defender already installed. For more information visit [Defender website](https://aka.ms/defender) 

### BinSkim

BinSkim is a Portable Executable (PE) light-weight scanner that validates compiler/linker settings and other security-relevant binary characteristics. The build task provides a command line wrapper around the BinSkim.exe application. BinSkim is an open-source tool and for more information visit [BinSkim on GitHub](https://github.com/Microsoft/binskim)

### Credential Scanner

Passwords and other secrets stored in source code is currently a significant problem. Credential Scanner is a proprietary static analysis tool that detects credentials, secrets, certificates, and other sensitive content in your source code and your build output.

### Microsoft Security Risk Detection

Security Risk Detection is Microsoft's unique cloud-based fuzz testing service for identifying exploitable security bugs in software. This service requires a separate onboarding process. For more information visit [MSRD on docs.microsoft.com](https://docs.microsoft.com/security-risk-detection/)

### Roslyn Analyzers

Microsoft's compiler-integrated static analysis tool for analyzing managed code (C# and VB). For more information visit [Roslyn Analyzers on docs.microsoft.com](https://docs.microsoft.com/dotnet/standard/analyzers/)

### TSLint

TSLint is an extensible static analysis tool that checks TypeScript code for readability, maintainability, and functionality errors. It's widely supported across modern editors and build systems and can be customized with your own lint rules, configurations, and formatters. TSLint is an open-source tool and for more information visit [TSLint on GitHub](https://github.com/palantir/tslint)

## Analysis and Post-Processing of Results

The Microsoft Security Code Analysis extension also has three helpful post-processing tasks to help you process and analyze the results found by the security tools tasks. They are usually added in the pipeline after all other tool tasks.

### Publish Security Analysis Logs
The Publish Security Analysis Logs build task preserves the log files of the security tools run during the build for investigation and follow-up.

They can be published to the Azure Server artifacts (as a zip file), or copies to an accessible file share from your private build agent.

### Security Report
The Security Report build task parses the log files created by the security tools run during the build and creates a single summary report file with all issues found by the analysis tools.

The task can be configured to report findings for specific tools or for all tools, and you can also choose what level of issues (errors or errors and warnings) should be reported.

### Post-Analysis (Build Break)
The Post-analysis build task enables the customer to inject a build break and fail the build in case one ore more analysis tools report findings or issues in the code.

The task can be configured to break the build for issues found by specific tools or for all tools, and also based on the severity of issues found (errors or and warnings).

>[!NOTE]
>Individual build tasks will succeed, by design, as long as the tool completes successfully, whether there are findings or not so that the build can run to completion allowing all tools to run.

## Next steps

For instructions on onboarding and installing the Security code analysis, refer to our [Onboarding and installation guide](security-code-analysis-onboard.md)

For more information about configuring the build tasks, see our [Configuration guide](security-code-analysis-customize.md)

If you have further questions about the extension and the tools offered, [check our FAQs page.](security-code-analysis-faq.md)