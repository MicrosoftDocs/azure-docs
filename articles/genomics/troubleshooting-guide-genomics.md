---
title: 'Microsoft Genomics troubleshooting guide'
titleSuffix: Azure
description: Learn more about troubleshooting strategies
keywords: troubleshooting, error, debugging
services: genomics
author: grhuynh
manager: cgronlun
ms.author: grhuynh
ms.service: genomics
ms.topic: article
ms.date: 07/18/2018

---
# Troubleshooting guide for Microsoft Genomics
This overview describes strategies to address common issues when using the Microsoft Genomics service. For general FAQ, see [Common questions](frequently-asked-questions-genomics.md). 


## How do I check my job status?
You can check the status of your workflow by calling `msgen status` from the command line, as shown. 

```
msgen status -u URL -k KEY -w ID [-f CONFIG] 
```

There are three required arguments:
* URL - the base URI for the API
* KEY - the access key for your Genomics account. 
* ID - the workflow ID

To find your URL and KEY, go to Azure portal and open your Genomics account page. Under the **Management** heading, choose **Access keys**. There, you find both the API URL and your access keys.

Alternatively, you can include the path to the config file instead of directly entering the URL and KEY. Note that if you include these arguments in the command line as well as the config file, the command-line arguments will take precedence. 

After calling `msgen status`, a user-friendly message will be displayed, describing whether the workflow succeeded or giving a reason for the job failure. 


## Get more information about my workflow status

To get more information about why a job might not have succeeded, you can explore the log files produced during the workflow. In your output container, you should see a `[youroutputfilename].logs.zip` folder.  Unzipping this folder, you will see the following items:

* outputFileList.txt - a list of the output files produced during the workflow
* standarderror.txt - this file is blank.
* standardoutput.txt - contains top-level logging of the workflow. 
* GATK log files - all other files in the `logs` folder

The `standardoutput.txt` file is a good place to start to determine why your workflow did not succeed, as it includes more low-level information of the workflow. 

## Common issues and how to resolve them
This section briefly highlights common issues and how to resolve them.

### Fastq files are unmatched
Fastq files should only differ by the trailing /1 or /2 in the sample identifier. If you have accidentally submitted unmatched FASTQ files, you might see the following error messages when calling `msgen status`.
* `Encountered an unmatched read`
* `Error reading a FASTQ file, make sure the input files are valid and paired correctly` 

To resolve this, review if the fastq files submitted to the workflow are actually a matched set. 


### Error uploading .bam file. Output blob already exists and the overwrite option was set to False.
If you see the following error message, `Error uploading .bam file. Output blob already exists and the overwrite option was set to False`, the output folder already contains an output file with the same name.  Either delete the existing output file or turn on the overwrite option in the config file. Then, resubmit your workflow.

### When to contact Microsoft Genomics support
If you see the following error messages, an internal error occurred. 

* `Error locating input files on worker machine`
* `Process management failure`

Try to resubmit your workflow. If you continue to have job failures, or if you have any other questions, contact Microsoft Genomics support from the Azure portal. Additional information on how to submit a support request can be found [here](file-support-ticket-genomics.md).

## Next steps
In this article, you learned how to troubleshoot and resolve common issues with the Microsoft Genomics service. For more information and more general FAQ, see [Common questions](frequently-asked-questions-genomics.md). 
