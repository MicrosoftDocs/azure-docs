---
title: Common questions - FAQ
titleSuffix: Microsoft Genomics
description: Get answers to common questions related to using the Microsoft Genomics service, including technical information, SLA, and billing. 
services: genomics
author: grhuynh
manager: cgronlun
ms.author: grhuynh
ms.service: genomics
ms.topic: troubleshooting
ms.date: 12/07/2017

---
# Microsoft Genomics: Common questions

This article lists the top queries you might have related to Microsoft Genomics. For more information on the Microsoft Genomics service, see [What is Microsoft Genomics?](overview-what-is-genomics.md). For more information about troubleshooting, see our [Troubleshooting Guide](troubleshooting-guide-genomics.md). 


## How do I run GATK4 workflows on Microsoft Genomics?
In the Microsoft Genomics service's config.txt file, specify the process_name to `gatk4`. Note that you will be billed at regular billing rates.

## How do I enable output compression?
You can compress the output vcf or gvcf using an optional argument for output compression. This is equivalent to running `-bgzip` followed by `-tabix` on the vcf or gvcf output, to produce `.gz` (bgzip output) and `.tbi` (tabix output) files. `bgzip` compresses the vcf or gvcf file, and `tabix` creates an index for the compressed file. The argument is a boolean, which is set to `false` by default for vcf output, and to `true` by default for gcvf output. To use on the command line, specify `-bz` or `--bgzip-output` as `true` (run bgzip and tabix) or `false`. To use this argument in the config.txt file, add `bgzip_output: true` or `bgzip_output: false` to the file.

## What is the SLA for Microsoft Genomics?
We guarantee that 99.9% of the time Microsoft Genomics service will be available to receive workflow API requests. For more information, see [SLA](https://azure.microsoft.com/support/legal/sla/genomics/v1_0/).

## How does the usage of Microsoft Genomics show up on my bill?
Microsoft Genomics bills based on the number of gigabases processed per workflow. For more information, see [Pricing](https://azure.microsoft.com/pricing/details/genomics/).


## Where can I find a list of all possible commands and arguments for the `msgen` client?
You can get a full list of available commands and arguments by running `msgen help`. If no further arguments are provided, it shows a list of available help sections, one for each of `submit`, `list`, `cancel`, and `status`. To get help for a specific command, type `msgen help command`; for example, `msgen help submit` lists all of the submit options.

## What are the most commonly used commands for the `msgen` client?
The most commonly used commands are arguments for the `msgen` client include: 

 |**Command**          |  **Field description** |
 |:--------------------|:-------------         |
 |`list`               |Returns a list of jobs you have submitted. For arguments, see `msgen help list`.  |
 |`submit`             |Submits a workflow request to the service. For arguments, see `msgen help submit`.|
 |`status`             |Returns the status of the workflow specified by `--workflow-id`. See also `msgen help status`. |
 |`cancel`             |Sends a request to cancel processing of the workflow specified by `--workflow-id`. See also `msgen help cancel`. |

## Where do I get the value for `--api-url-base`?
Go to Azure portal and open your Genomics account page. Under the **Management** heading, choose **Access keys**. There, you find both the API URL and your access keys.

## Where do I get the value for `--access-key`?
Go to Azure portal and open your Genomics account page. Under the **Management** heading, choose **Access keys**. There, you find both the API URL and your access keys.

## Why do I need two access keys?
You need two access keys in case you want to update (regenerate) them without interrupting usage of the service. For example, if you want to update the first key, you should have all new workflows use the second key. Then, wait for all the workflows using the first key to finish before updating the first key.

## Do you save my storage account keys?
Your storage account key is used to create short-term access tokens for the Microsoft Genomics service to read your input files and write the output files. The default token duration is 48 hours. The token duration can be changed with the `-sas/--sas-duration` option of the submit command; the value is in hours.

## What genome references can I use?

These references are supported:

 |Reference              | Value of `-pa/--process-args` |
 |:-------------         |:-------------                 |
 |b37                    | `R=b37m1`                     |
 |hg38                   | `R=hg38m1`                    |      
 |hg38 (no alt analysis) | `R=hg38m1x`                   |  
 |hg19                   | `R=hg19m1`                    |    

## How do I format my command-line arguments as a config file? 

msgen understands configuration files in the following format:
* All options are provided as key-value pairs with values separated from keys by a colon.
  Whitespace is ignored.
* Lines starting with `#` are ignored.
* Any command-line argument in the long format can be converted to a key by stripping its leading dashes and replacing dashes between words with underscores. Here are some conversion examples:

  |Command-line argument            | Configuration file line |
  |:-------------                   |:-------------                 |
  |`-u/--api-url-base https://url`  | *api_url_base:https://url*    |
  |`-k/--access-key KEY`            | *access_key:KEY*              |      
  |`-pa/--process-args R=B37m1`     | *process_args:R-b37m1*        |  

## Next steps

Use the following resources to get started with Microsoft Genomics:
- Get started by running your first workflow through the Microsoft Genomics service. [Run a workflow through the Microsoft Genomics service](quickstart-run-genomics-workflow-portal.md)
- Submit your own data for processing by the Microsoft Genomics service: [paired FASTQ](quickstart-input-pair-FASTQ.md) | [BAM](quickstart-input-BAM.md) | [Multiple FASTQ or BAM](quickstart-input-multiple.md) 

