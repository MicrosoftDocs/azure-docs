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
ms.date: 07/21/2018

---
# Troubleshooting guide

Here are a few troubleshooting tips for some of the common issues that you might face when using the Microsoft Genomics service, MSGEN.

 For FAQ, not related to troubleshooting, see [Common questions](frequently-asked-questions-genomics.md).


## Step 1: Locate error codes associated with the workflow

You can locate the error messages associated with the workflow by:

1. Using the command line and typing in  `msgen status`
2. Examining the contents of standardoutput.txt.


### 1. MSGEN STATUS

```bash
msgen status -u URL -k KEY -w ID 
```

There are three required arguments:

* URL - the base URI for the API
* KEY - the access key for your Genomics account
    * To find your URL and KEY, go to Azure portal and open your Microsoft Genomics account page. Under the **Management** heading, choose **Access keys**. There, you find both the API URL and your access keys.

    * Alternatively you can include the path to the config file instead of directly entering the URL and KEY. Note that if you include these arguments in the command line as well as the config file, the command-line arguments will take precedence.
* ID - the workflow ID

**Note:**

* To  find your workflow ID type in msgen list command: assuming your config file is in the same location as your msgen exe, this will look like this: Be sure to include the  URI and keys in the config file :

```bash
msgen list -f "config.txt"
```

A Sample output from this command will look like this:

```bash
c:\Python27\Scripts> msgen list -f "config.txt"
Microsoft Genomics command-line client v0.7.4
Copyright (c) 2018 Microsoft. All rights reserved.

Workflow List
-------------
Total Count  : 1

Workflow ID     : 10001
Status          : Completed successfully
Message         :
Process         : snapgatk-20180730_1
Description     :
Created Date    : Mon, 27 Aug 2018 20:27:24 GMT
End Date        : Mon, 27 Aug 2018 20:55:12 GMT
Wall Clock Time : 0h 27m 48s
Bases Processed : 1,348,613,600 (1 GBase)
```



### 2. STANDARDOUTPUT.TXT 
Locate the output container for the workflow in question. MSGEN creates a,   `[workflowfilename].logs.zip` folder after every workflow execution. Unzip the folder to view its contents:

* outputFileList.txt - a list of the output files produced during the workflow
* standarderror.txt - this file is blank.
* standardoutput.txt - logs  all top-level status messages including errors, that occurred while running the workflow.
* GATK log files - all other files in the `logs` folder

For troubleshooting, examine the contents of standardoutput.txt and note any error messages that appear.


## Step 2: Try recommended resolutions for common error codes

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
| Undetermined service error | >400 | An internal error occurred. Try resubmitting the workflow. If you see this error again, contact Microsoft Genomics support for assistance | Submit the workflow again. Contact Microsoft Genomics support for assistance if the issue persists by creating a support [ticket](file-support-ticket-genomics.md ). |
| Actionable service error   | 400              | Insufficient buffer space                                                                                                              | Increase the expansion factor by setting -xf to 2, 3, or 4 in 'process_args' in the workflow config file. Unzip the input files and submit FASTQ files. |
| Actionable service error   | 6                | The process machine ran out of disk space when writing output files.                                                                   | *Increase the expansion factor by setting -xf to 2, 3, or 4 in 'process_args' in the workflow config file.  or,  Unzip the input files and submit FASTQ files. |                                                                                                                                                                     |

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
| Any          | 701        | Read [readId] has [numberOfBases] bases, but the limit is [maxReadLength]           | The most common reason for this error is file corruption leading to concatenation of two reads. Check your input files. |                                |
| BAM          | 200        |   Unable to read file '[yourFileName]'.                                                                                       | Check the format of the BAM file. Submit the workflow again with a properly formatted file.                                                                           |
| BAM          | 201        |  Unable to read BAM file [File_name].                                                                                      |Check the format of the BAM file.  Submit the workflow with a correctly formatted file.                                                                            |
| BAM          | 202        | Unable to read BAM file [File_name]. File too small and missing header.                                                                                        | Check the format of the BAM file.  Submit the workflow with a correctly formatted file.                                                                            |
| BAM          | 203        |   Unable to read BAM file [File_name]. Header of file was corrupt.                                                                                      |Check the format of the BAM file.  Submit the workflow with a correctly formatted file.                                                                           |
| BAM          | 204        |    Unable to read BAM file [File_name]. Header of file was corrupt.                                                                                     | Check the format of the BAM file.  Submit the workflow with a correctly formatted file.                                                                           |
| BAM          | 205        |    Unable to read BAM file [File_name]. Header of file was corrupt.                                                                                     | Check the format of the BAM file.  Submit the workflow with a correctly formatted file.                                                                            |
| BAM          | 206        |   Unable to read BAM file [File_name]. Header of file was corrupt.                                                                                      | Check the format of the BAM file.  Submit the workflow with a correctly formatted file.                                                                            |
| BAM          | 207        |  Unable to read BAM file [File_name]. File truncated near offset [offset].                                                                                       | Check the format of the BAM file.  Submit the workflow with a correctly formatted file.                                                                            |
| BAM          | 208        |   Invalid BAM file. The ReadID [Read_Id] has no sequence in file [File_name].                                                                                      | Check the format of the BAM file.  Submit the workflow with a correctly formatted file.                                                                             |
| FASTQ        | 300        |  Unable to read FASTQ file. [File_name] doesn't end with a newline.                                                                                     | Correct the format of the FASTQ file and submit  the workflow again.                                                                           |
| FASTQ        | 301        |   Unable to read FASTQ file [File_name]. FASTQ record is larger than buffer size at offset: [_offset]                                                                                      | Correct the format of the FASTQ file and submit  the workflow again.                                                                         |
| FASTQ        | 302        |     FASTQ Syntax error. File [File_name] has a blank line.                                                                                    | Correct the format of the FASTQ file and submit  the workflow again.                                                                         |
| FASTQ        | 303        |       FASTQ Syntax error. File[File_name] has an invalid starting character at offset: [_offset],  line type: [line_type], character: [_char]                                                                                  | Correct the format of the FASTQ file and submit  the workflow again.                                                                         |
| FASTQ        | 304      |  FASTQ Syntax error at readID [_ReadID].  First read of batch doesn’t have readID ending in /1 in file [File_name]                                                                                       | Correct the format of the FASTQ file and submit  the workflow again.                                                                         |
| FASTQ        | 305        |  FASTQ Syntax error at readID [_readID]. Second read of batch doesn’t have readID ending in /2 in file [File_name]                                                                                      | Correct the format of the FASTQ file and submit  the workflow again.                                                                          |
| FASTQ        | 306        |  FASTQ Syntax error at readID [_ReadID]. First read of pair doesn’t have an ID that ends in /1 in file [File_name]                                                                                       | Correct the format of the FASTQ file and submit  the workflow again.                                                                          |
| FASTQ        | 307        |   FASTQ Syntax error at readID [_ReadID]. ReadID doesn’t end with /1 or/2. File [File_name] can't be used as a paired FASTQ file.                                                                                      |Correct the format of the FASTQ file and submit  the workflow again.                                                                          |
| FASTQ        | 308        |  FASTQ read error. Reads of both ends responded differently. Did you choose the correct FASTQ files?                                                                                       | Correct the format of the FASTQ file and submit  the workflow again.                                                                         |
|        |       |                                                                                        |                                                                           |

## Step 3: Contact Microsoft Genomics support

If you continue to have job failures, or if you have any other questions, contact Microsoft Genomics support from the Azure portal. Additional information on how to submit a support request can be found [here](file-support-ticket-genomics.md).

## Next steps

In this article, you learned how to troubleshoot and resolve common issues with the Microsoft Genomics service. For more information and more general FAQ, see [Common questions](frequently-asked-questions-genomics.md). 