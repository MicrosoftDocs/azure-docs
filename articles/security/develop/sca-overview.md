---
title: Security Code Analysis Documentation
description: This article is introduction to Security Code Analysis Documentation
author: v-havee
manager: sukhans
ms.author: terrylan
ms.date: 07/18/2019
ms.topic: article
ms.service: security
services: azure

ms.assetid: 521180dc-2cc9-43f1-ae87-2701de7ca6b8
ms.devlang: na
ms.tgt_pltfrm: na
ms.workload: na
---
# About Microsoft Security Code Analysis

The **Microsoft Security Code Analysis** extension empowers teams to integrate the running of static analysis tools during their development cycle. Through NuGet based delivery of the tools, teams no longer need to install and update analysis tools on their build agents. Just add the tasks, choose a specific version, or keep it on the Latest and new tools will be discovered and downloaded at build time. With Command Line and Basic build task interfaces, all users from savvy tool gurus to everyday developers, can have as little or as much control over the tools as they desire.

## Run security analysis tools in Azure DevOps Pipelines

The [Secure Development Lifecycle (SDL) Guidelines](https://www.microsoft.com/en-us/securityengineering/sdl/practices) recommend that teams perform static analysis during the implementation phase of their development cycle.
The Microsoft Security Code Analysis extension empowers you to do so by easily integrating the running of static analysis tools in your Azure DevOps pipelines.

### Simple Configuration and Execution

Adding security static analysis tools to your build is as simple as adding new build tasks. Just provide a few parameters or go with the defaults. The tasks run as part of your DevOps pipeline and produce logs with results of any findings.

### Keep Your Builds Clean

Once you have addressed the issues reported by the tool, you can configure the extension to introduce a build break should any new issues being introduced and detected by the tools, for example, in a continuous integration build, which can run on every pull request.

### Auto-Update

The Azure DevOps build tasks and tools can be set to stay up to date (default setting) or an older version can be selected. If there is an updated version of the tool, there is no need to download and install it; this extension takes care of that for you.

## Each build task will:
1. Prompt the user for a minimal list of options related to the source and binaries that are to be scanned. The task will provide defaults where possible.
2. Download the latest (or selected) version of the tool from a restricted nuget feed to the build agent.
3. Sanitize and convert user input into (often complex) command-line arguments, and then launch the tool on the build agent.
4. Save tool output log files locally on the build agent.

You will also want to add up to three helpful post-processing tasks after all other tool tasks complete, to produce a summary report of the issues found by the tools you run and to preserve tool log files to the Azure DevOps Server or to a file share. And perhaps most importantly, understand that when a security tool finds an issue the build does NOT break or fail. Should you wish to inject a build break (a build task failure) based on security findings by one of the tools, you will need ot add the Post-Analysis build task.
See [Post-Processing build tasks](post-processing.md) for more details on these three tasks.

## Under the Hood

The Microsoft Security Code Analysis Extension build tasks abstract the complexities of:
   1.  Running security static analysis tools, and 
   2.  Processing the results from log files to create a summary report or break the build.

# Security Static Analysis Tools

The Microsoft Security Code Analysis extension makes readily available to you, the latest versions of important static analysis tools. The extension includes both Microsoft Internal and Open Source tools. The tools get automatically downloaded on the cloud-hosted agent once you configure & run the pipeline using the corresponding build task. Below is the list of tools that are available in the extension today. 
Stay tuned for more and send us your suggestions for tools that could be added.

## Credential Scanner

Passwords and other secrets stored in source code is currently a big problem. Credential Scanner is a proprietary static analysis tool that detects credentials, secrets, certificates, and other sensitive content in your source code and your build output.

## BinSkim

BinSkim is a Portable Executable (PE) light-weight scanner that validates compiler/linker settings and other security-relevant binary characteristics. The build task provides a command line wrapper around the BinSkim.exe application. BinSkim is an open source tool.

For more information visit [BinSkim on GitHub](https://github.com/Microsoft/binskim)

## TSLint

TSLint is an extensible static analysis tool that checks TypeScript code for readability, maintainability, and functionality errors. It is widely supported across modern editors and build systems and can be customized with your own lint rules, configurations, and formatters. TSLint is an open source tool.

For more information visit [TSLint on Github](https://github.com/palantir/tslint)

## Roslyn Analyzers

Microsoft's compiler-integrated static analysis tool for analyzing managed code (C# and VB).

For more information visit [Roslyn Analyzers on docs.microsoft.com](https://docs.microsoft.com/en-us/dotnet/standard/analyzers/)

## Microsoft Security Risk Detection

Security Risk Detection is Microsoft's unique cloud-based fuzz testing service for identifying exploitable security bugs in software.

For more information visit [MSRD on docs.microsoft.com](https://docs.microsoft.com/en-us/security-risk-detection/)

## Anti-Malware Scanner

The Anti-Malware Scanner build task is now included in the Microsoft Security Code Analysis Extension. It must be run on a build agent which has Windows Defender already installed. 

For more information visit [Defender website](https://aka.ms/defender) 

# Analysis and Post-Processing of Results

The Microsoft Security Code Analysis extension has three build tasks to help you process and analyze the results found by the security tools tasks.
 - The Publish Security Analysis Logs build task preserves logs files from the build for investigation and follow-up.
 - The Security Report build task collects all issues reported by all tools and adds them to a single summary report file.
 - The Post-Analysis build task allows customers to inject build breaks and fail the build should an analysis tool report security issues found in the code that was scanned.

## Publish Security Analysis Logs
The Publish Security Analysis Logs build task preserves the log files of the security tools run during the build.

They can be published to the Azure DevOps Server artifacts (as a zip file), or copies to an accessible file share from your private build agent.

## Security Report
The Security Report build task parses the log files created by the security tools run during the build and creates a summary report file with all issues found by the analysis tools.

The task can be configured to report findings for specific tools or for all tools, and you can also choose what level of issues (errors or errors and warnings) should be reported.

## Post-Analysis (Build Break)
The Post-analysis build task enables the customer to inject a build break and fail the build in case one ore more analysis tools reports findings or issues in the code.

Individual build tasks will succeed, by design, as long as the tool completes successfully, whether there are findings or not. This is so that the build can run to completion allowing all tools to run.

To fail the build based on security issues found by one of the tools run in the build, then you can add and configure this build task.

The task can be configured to break the build for issues found by specific tools or for all tools, and also based on the severity of issues found (errors or and warnings).
