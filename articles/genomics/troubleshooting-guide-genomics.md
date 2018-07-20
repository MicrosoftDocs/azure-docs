---
title: 'Microsoft Genomics:Troubleshooting Guide | Microsoft Docs'
titleSuffix: Azure
description: Learn more about troubleshooting strategies
keywords: troubleshooting, error, debugging
services: microsoft-genomics
author: grhuynh;ruchir
manager: jhubbard
editor: jasonwhowell
ms.author: grhuynh;ruchir
ms.service: microsoft-genomics
ms.workload: genomics
ms.topic: article
ms.date: 04/13/2018

---
# MSGEN Troubleshooting guide

This overview describes strategies to address common errors seen when using the Microsoft Genomics service, MSGEN. For general FAQ, see [Common questions](frequently-asked-questions-genomics.md).


## Step 1:Check your job status

The first step is to find out the status of your job. Type in `msgen status` with the three required arguments:
:

```bash
msgen status -u URL -k KEY -w ID [-f CONFIG] 
```

There are three required arguments:

* URL - the base URI for the API
* KEY - the access key for your Genomics account
* ID - the workflow ID

## How to find the URL and key for your account

To find your URL and KEY, go to Azure portal and open your Genomics account page. Under the **Management** heading, choose **Access keys**. There, you find both the API URL and your access keys.

**Note:**  You can provide these required arguments in the config file or in the command line. If you include these arguments in the command line and in the config file, the command-line arguments will take precedence. 

## Step 2: Note your job status

The `msgen status` command provides a detailed message about the status of your workflow. The next section lists the possible errors that you might see if your workflow fails.

### Getting more details about your workflow status

Besides using `msgen status`, you can also get more details by looking at the workflow output files.

Locate the output container for the workflow in question. MSGEN creates a,   `[workflowfilename].logs.zip` folder after every workflow execution. Unzip the folder to view its contents:

* outputFileList.txt - a list of the output files produced during the workflow
* standarderror.txt - this file is blank.
* standardoutput.txt - logs  all top-level status messages including errors, that occurred while running the workflow.
* GATK log files - all other files in the `logs` folder

For troubleshooting purposes, you only need to evaluate the error messages in the  `standardoutput.txt` file.

## Step 3:Try to resolve the most common issues using this troubleshooting guide

This section briefly highlights common errors and the strategies you can use to resolve them
Note: All errors have the word 'Error Code [ErrorCode Number]' at the beginning. This will help you determine what went wrong, and what do to about it.

### DEBUGGING MSGEN WORKFLOW ERRORS

The Microsoft Genomics Service (msgen) can throw the following two kinds of errors:

1. Internal Service Errors: Errors that are internal to the service, that may not be resolved by fixing parameters or input files. Sometimes resubmitting the workflow might fix these errors.
2. Input Errors: Errors that can be resolved by using the correct arguments or fixing file formats.

The following section describes these errors in detail

### INTERNAL SERVICE ERRORS

You can get one of the following two kinds of internal service errors

1. Undetermined service errors - If you get these error messages repeatedly even after resubmitting the workflow, please contact Microsoft Genomics Support
2. Actionable service errors - Typically you can do something to fix them

| Type of error              | Error code       | Error message                                                                                                                            | Recommended troubleshooting steps                                                                                                                                   |
|----------------------------|------------------|------------------------------------------------------------------------------------------------------------------------------------------|---------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Undetermined service error | Error code range | "An internal error occurred. Try resubmitting the workflow. If you encounter an error again, please contact Microsoft Genomics support" | Try resubmitting the workflow. If you get the error again, contact Microsoft Genomics support by creating a support [ticket](file-support-ticket-genomics.md )  |
| Actionable service error   | 592              | "Insufficient buffer space"                                                                                                              | * Please increase the expansion factor by setting -xf to 2, 3, or 4 in 'process_args' in the workflow config file. or,  Unzip the input files and submit FASTQ files. |
| Actionable service error   | 6                | "The process machine ran out of disk space when writing output files."                                                                   | * Please increase the expansion factor by setting -xf to 2, 3, or 4 in 'process_args' in the workflow config file.  or,  Unzip the input files and submit FASTQ files. |                                                                                                                                                                     |

**Note:**
We have successfully run submissions up to 200x coverage.  A memory consumption problem may arise if:

* The input files are corrupted, OR
* The workflow submits very large files (150x or more coverage), OR
* The variant file is very complex.

If these errors persist contact Microsoft Genomics Support.
For more information on how to create a support ticket for the Microsoft Genomics service, please see [here](file-support-ticket-genomics.md).

### INPUT ERRORS

These errors are user actionable and you can use the listed troubleshooting steps to successfully submit your workflow.

| Type of file | Error code | Error message                                                                           | Recommended troubleshooting steps                                                                                         |
|--------------|------------|-----------------------------------------------------------------------------------------|---------------------------------------------------------------------------------------------------------------------------|
| Any          | 769        | "Read [readId] has [number of bases] bases, but the limit is [maxReadLength]"           | The most common reason for this error is file corruption leading  to concatenation of two reads.  Check your input files. |
| Any          | 4097       | "-o max and /or -mpc are only meaningful in the context of -om                           | Check the input parameters used.                                                                                   |
| Any          | 4097       | "The minimum read length [minReadLength] must be at least the seed length [seedLength]" | Please check the values specified in the workflow parameters                                                              |
| BAM          | 256        |   "Unable to read file '[yourFileName]'. Ensure the BAM file is correctly formatted."                                                                                      | Please check the BAM file used for the workflow                                                                           |
| BAM          | 256        |   "Failure reading file '[yourFileName]'. Ensure the BAM file is correctly formatted."                                                                                      | Please check the BAM file used for the workflow                                                                           |
| BAM          | 256        | "Malformed BAM file '[yourFileName]'. It is too small to contain even a header. Ensure the BAM file is correctly formatted."                                                                                        | Please check the BAM file used for the workflow                                                                           |
| BAM          | 256        |   “'[yourFileName]' is not a valid BAM file. Ensure the BAM file is correctly formatted."                                                                                      | Please check the BAM file used for the workflow                                                                           |
| BAM          | 256        |    "Unable to read entire header of BAM file ‘[yourFileName]’. It may be malformed. Ensure the BAM file is correctly formatted."                                                                                     | Please check the BAM file used for the workflow                                                                           |
| BAM          | 256        |    ''[yourFileName]'' is not a valid BAM file. Ensure the BAM file is correctly formatted."                                                                                     | Please check the BAM file used for the workflow                                                                           |
| BAM          | 256        |   "Failed to parse BAM file's '[yourFileName]' header correctly. Ensure the BAM file is correctly formatted."                                                                                      | Please check the BAM file used for the workflow                                                                           |
| BAM          | 256        |  "Truncated or corrupt BAM file '[yourFileName]' near offset [offset]. Ensure the BAM file is correctly formatted."                                                                                       | Please check the BAM file used for the workflow                                                                           |
| BAM          | 256        |   "Read [readId] has no sequence in file '[yourFileName]'."                                                                                      | Please correct the information in the BAM file                                                                            |
| FASTQ        | 259        |   "FASTQ file does not end with a newline. Please ensure the FASTQ file '[yourFileName]' is correctly formatted."                                                                                      | Check the FASTQ file used for the workflow                                                                           |
| FASTQ        | 259        |   "FASTQ record is larger than buffer size in file '[yourFileName]':[offset]."                                                                                      | Check the FASTQ file used for the workflow                                                                         |
| FASTQ        | 259        |     "Syntax error (blank line) in FASTQ file '[yourFileName]'. Ensure the FASTQ file is correctly formatted."                                                                                    | Check the FASTQ file used for the workflow                                                                         |
| FASTQ        | 259        |       "FASTQ file '[yourFileName]' has invalid starting character at offset [offset], line type [i], char [character]. Ensure the FASTQ file is correctly formatted."                                                                                  | Check the FASTQ file used for the workflow                                                                         |
| FASTQ        | 259        |  "First read of batch doesn't have ID ending with /1: '[readId]' in file '[yourFileName]'."                                                                                       | Correct the information in the FASTQ file file                                                                          |
| FASTQ        | 259        |  "Second read of batch doesn't have ID ending with /2: '[readId]' in file '[yourFileName]'."                                                                                       | Correct the information in the FASTQ file file                                                                          |
| FASTQ        | 259        |  "First read of pair doesn't have an ID that ends in /1: '[readId]'."                                                                                       | Correct the information in the FASTQ file file                                                                          |
| FASTQ        | 259        |   “Read ID doesn't end with /1 or /2, and cannot be used as a paired FASTQ file: [readId] in file '[yourFileName]'."                                                                                      | Correct the information in the FASTQ file file                                                                          |
| FASTQ        | 259        |  "Reads of both ends responded differently. Please ensure the correct FASTQ files were chosen."                                                                                       | Please choose the right FASTQ files                                                                          |
|        |       |                                                                                        |                                                                           |

## Step 4: Contact Microsoft Genomics support

If you continue to have job failures, or if you have any other questions, contact Microsoft Genomics support from the Azure portal. Additional information on how to submit a support request can be found [here](file-support-ticket-genomics.md).

## Next steps
In this article, you learned how to troubleshoot and resolve common issues with the Microsoft Genomics service. For more information and more general FAQ, see [Common questions](frequently-asked-questions-genomics.md). 