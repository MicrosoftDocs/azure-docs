---
title: Microsoft Azure Security Code Analysis task customization guide
description: This article is about customizing the tasks in Security Code Analysis Extension
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

# How To: Configure & Customize the build tasks

This page describes in detail the configuration options available in each of the build tasks, starting with the tasks for security code analysis tools followed by the post processing tasks

## Anti-Malware Scanner Task

> [!NOTE]
> The Anti-Malware build task requires a build agent with Windows Defender enabled, which is true on "Hosted VS2017" and later build agents. (It will not run on the legacy/VS2015 "Hosted" agent) Signatures cannot be updated on these agents, but the signature should always be relatively current, less than 3 hours old.

Screenshot and details on configuring below.

![Customizing the Anti-Malware Scanner Build Task](./media/security-tools/5-add-anti-malware-task600.png) 

- Settings for Type = **Basic**
- With Type = **Custom**, command-line arguments can be provided to customize the scan.

Windows Defender uses the Windows Update client to download and install signatures. If signature update fails on your build agent, the HRESULT error code is likely coming from Windows Update. For more information on Windows Update Errors and mitigation, visit [this page](https://docs.microsoft.com/windows/deployment/update/windows-update-error-reference) and this [technet page](https://social.technet.microsoft.com/wiki/contents/articles/15260.windows-update-agent-error-codes.aspx)

## BinSkim Task

> [!NOTE]
> As a prerequisite to run the BinSkim task, your build should meet one of the below conditions.
>    - Your build produces binary artifacts from managed code.
>    - You have binary artifacts committed you would like to analyze with BinSkim.

Screenshot and details on configuring below. 

![BinSkim Setup](./media/security-tools/7-binskim-task-details.png)  
1. Set the build configuration to Debug to produce ***.pdb** debug files. They're used by BinSkim to map issues found in the output binary back to source code. 
2. Choose Type = **Basic** & Function = **Analyze** to avoid researching and creating your own command line. 
3. **Target** - One or more specifiers to a file, directory, or filter pattern that resolves to one or more binaries to analyze. 
    - Multiple targets should be separated by a **semicolon(;)**. 
    - Can be a single file or contain wildcards.
    - Directories should always end with \*
    - Examples:

           *.dll;*.exe
           $(BUILD_STAGINGDIRECTORY)\*
           $(BUILD_STAGINGDIRECTORY)\*.dll;$(BUILD_STAGINGDIRECTORY)\*.exe;
4. If you select Type = **Command Line**, 
     - Make sure the first argument to **BinSkim.exe** is the verb **analyze** using full paths, or paths relative to the source directory.
     - For **Command Line** input, multiple targets should be separated by a space.
     - You can omit the **/o** or **/output** file parameter; it will be added for you or replaced. 
     - **Standard Command Line Configuration** 

           analyze $(Build.StagingDirectory)\* --recurse --verbose
           analyze *.dll *.exe --recurse --verbose
          > [!NOTE]
          > The trailing \* is very important when specifying a directory or directories for the target. 

For more details on BinSkim about command line arguments, rules by ID or exit codes, visit the [BinSkim User Guide](https://github.com/Microsoft/binskim/blob/master/docs/UserGuide.md)

## Credential Scanner Task
Screenshot and details on configuring below.
 
![Credential Scanner Customization](./media/security-tools/3-taskdetails.png)

Available options include 
  - **Output Format** – TSV/ CSV/ SARIF/ PREfast
  - **Tool Version** (Recommended: Latest)
  - **Scan Folder** – The folder in your repository to scan
  - **Searchers File Type** - Options to locate the searchers file used for scanning.
  - **Suppressions File** – A [JSON](https://json.org/) file can be used for suppressing issues in the output log (more details in the Resources section). 
  - **Verbose Output** - self-explanatory 
  - **Batch Size** - The number of concurrent threads used to run Credential Scanners in parallel. Defaults to 20 (Value must be in the range of 1 to 2147483647).
  - **Match Timeout** - The amount of time to spend attempting a searcher match before abandoning the check. 
  - **File Scan Read Buffer Size** - Buffer size while reading content in bytes. (Defaults to 524288) 
  - **Maximum File Scan Read Bytes** - Maximum number of bytes to read from a given file during content analysis. (Defaults to 104857600) 
  - **Run this task** (under **Control Options**) - Specifies when the task should run. Choose "Custom conditions" to specify more complex conditions. 
  - **Version** - Build task version within Azure DevOps. Not frequently used. 

## Microsoft Security Risk Detection Task
> [!NOTE]
> You have to create and configure an account with the Risk Detection service as a prerequisite to be able to use this task. This service requires a separate onboarding process; it is not 'plug-and-play' as most of the other tasks in this extension. Please refer to [Microsoft Security Risk Detection](https://aka.ms/msrddocs) and [Microsoft Security Risk Detection: How To](https://docs.microsoft.com/security-risk-detection/how-to/) for instructions.

Details on configuring below.

Enter the required data; each option has hover text help.
   - **Azure DevOps Service Endpoint Name for MSRD**: If you have created a Generic type of Azure DevOps Service Endpoint to store the MSRD instance URL (you have onboarded to) and the REST API access token, then you can choose that service endpoint. If not, click the Manage link to create and configure a new service endpoint for this MSRD task. 
   - **Account ID**: It is a GUID that can be retrieved from the MSRD account URL.
   - **URLs to Binaries**: A semicolon delimited list of publicly available URLs (to be used by the fuzzing machine to download the binaries).
   - **URLs of the Seed Files**: A semicolon delimited list of publicly available URLs (to be used by the fuzzing machine to download the seeds). This field is optional if the seed files are downloaded together with the binaries.
   - **OS Platform Type**: The OS platform type (Windows, or Linux) of machines to run the fuzzing job on.
   - **Windows Edition / Linux Edition**: The OS edition of machines to run the fuzzing job on. You can overwrite the default value if your machines have a different OS edition.
   - **Package Installation Script**: Provide your script to be run on a test machine to install the test target program and its dependencies before submission of the fuzzing job.
   - **Job Submission Parameters**:
       - **Seed Directory**: Path to the directory on the fuzzing machine containing the seeds.
       - **Seed Extension**: The file extension of the seeds
       - **Test Driver Executable**: Path to the target executable on the fuzzing machine.
       - **Test Driver Executable Architecture**: The target executable file architecture (x86 or amd64).
       - **Test Driver Arguments**: The command-line arguments passed to the test target executable. Note that the "%testfile%" symbol, including the double quotes, will be automatically replaced with the full path to the target file the test driver is expected to parse, and is required.
       - **Test Driver Process Exits Upon Test Completion**: Check to terminates test driver upon completion; Uncheck if the test driver needs to be forcibly closed.
       - **Maximum Duration (in seconds)**: Provide an estimation of the longest reasonably expected time required for the target program to parse an input file. The more accurate this estimation, the more efficient the fuzzing run.
       - **Test Driver Can Be Run Repeatedly**: Check if the test driver can be run repeatedly without depending on a persisted/shared global state.
       - **Test Driver Can Be Renamed**: Check if the test driver executable can be renamed and can still work correctly.
       - **The Fuzzing Application Runs as a Single OS Process**: Check if the test driver runs under a single OS process; Un-check if the test driver spawns additional processes.


## Roslyn Analyzers Task
> [!NOTE]
> As a prerequisite to run the Roslyn Analyzer task, your build should meet the following conditions.
>  - Your build definition includes the built-in MSBuild or VSBuild build task to compile C# (or VB) code. This task relies on the input and output of that specific build task to rerun the MSBuild compilation with Roslyn analyzers enabled.
>  - The build agent running this build task has Visual Studio 2017 v15.5 or later installed (compiler version 2.6.x).
>

Details on configuring below.

Available options include 
- **Ruleset** - SDL Required, SDL Recommended, or you can use a custom ruleset of your own.
- **Analyzers Version** (Recommended: Latest)
- **Compiler Warnings Suppressions File** - A text file with a list of warnings IDs that should be suppressed. 
- **Run this task** (under **Control Options**) - Specifies when the task should run. Choose "**Custom conditions**" to specify more complex conditions. 

> [!NOTE]
> - Roslyn analyzers are compiler-integrated and can only be run as part of CSC.exe compilation. Hence, this task requires replaying/rerunning the compiler command that ran earlier in the build. This is done by querying VSTS for the MSBuild build task logs (there is no other way for the task to reliably get the MSBuild compilation command line from the build definition; we did consider adding a freeform textbox to allow users to enter their command lines, but it would be hard to keep these up-to-date and in sync with the main build). Custom builds require replaying the entire set of commands, not just compiler commands, and it is not trivial/reliable to enable Roslyn analyzers in these cases. 
> - Roslyn analyzers are integrated with the compiler and requires the compilation to be invoked. This build task is implemented by recompiling C# projects that were already built using only the MSBuild/VSBuild build task, in the same build / build definition, but in this case, with the Analyzers enabled. If this build task runs on the same agent as the original build task, the output of the original MSBuild/VSBuild build task will be overwritten in the 's' sources folder, by the output of this build task. The build output will be the same, but it is advised that you run MSBuild, copy output to the the artifacts staging directory, and then run Roslyn.
>

For additional Resources for Roslyn Analyzers Task check [Roslyn Analyzers on Microsoft Docs](https://docs.microsoft.com/dotnet/standard/analyzers/)

The analyzer package installed and used by this build task can be found [here](https://www.nuget.org/packages/Microsoft.CodeAnalysis.FxCopAnalyzers) 

## TSLint Task

For More information about TSLint, visit [TSLint GitHub Repo](https://github.com/palantir/tslint)
>[!NOTE] 
>As you may be aware, TSLint will be deprecated some time in 2019 (Source: [TSLint GitHub Repo](https://github.com/palantir/tslint)) The team is currently investigating [ESLint](https://github.com/eslint/eslint) as an alternative, and creating a new task for ESLint is in the roadmap.

## Publish Security Analysis Logs Task
Screenshot and details on configuring below.

![Customizing Publish Security Analysis](./media/security-tools/9-publish-security-analsis-logs600.png)  

- **Artifact name** -can be any String Identifier
- **Artifact Type** - you can publish logs to the Azure-DevOps server or to a file share that is accessible to the build agent. 
- **Tools** - You can choose to preserve logs for individual/specific tools or select **All Tools** to preserve all logs. 

## Security Report Task
Screenshot and details on configuring below.  
![Setup Post-Analysis](./media/security-tools/4-createsecurityanalysisreport600.png) 
- **Reports** - Choose Report files to create; one will be created in each format **Console**, **TSV**, and/or **HTML** 
- **Tools** - Select the tools in your build definition for which you would like a summary of issues detected. For each tool selected, there may be an option to select whether you would like to see Errors only or both Errors and Warnings in the report. 
- **Advanced Options** - You can choose to log a warning or an error (and fail the task) in case there are no logs for one of the tools selected.
You can customize the base logs folder where logs are to be found, but this is not a typical scenario. 

## Post-Analysis Task
Screenshot and details on configuring below.

![Customizing Post-Analysis](./media/security-tools/a-post-analysis600.png) 
- **Tools** - Select the tools in your build definition for which you would like to inject a build break based on its findings. For each tool selected, there may be an option to select whether you would like to break on Errors only or both Errors and Warnings. 
- **Report** - You can optionally write the results that are found and causing the build break to the Azure DevOps console window and log file. 
- **Advanced Options** - You can choose to log a warning or an error (and fail the task) in case there are no logs for one of the tools selected.

## Next steps

If you have further questions about the extension and the tools offered, [check our FAQs page.](security-code-analysis-faq.md)


