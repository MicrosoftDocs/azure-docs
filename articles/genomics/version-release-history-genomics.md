---
title: Version release history
titleSuffix: Microsoft Genomics
description: The release history of updates to the Microsoft Genomics Python client for fixes and new functionality. 
services: genomics
author: grhuynh
manager: cgronlun
ms.author: grhuynh
ms.service: genomics
ms.topic: conceptual
ms.date: 01/11/2019
---

# Version release history
The Microsoft Genomics team regularly updates the Microsoft Genomics Python client for fixes and new functionality. 

## Latest release
The current Python client is version 0.9.0. It was released February 6 2019 and supports running workflows with GATK 3.5 and GATK4. It supports gVCF output and can accept an optional argument for output compression.


## Release history 
New versions of the Microsoft Genomics Python client are released about once per year. As new versions of the Microsoft Genomics Python client are released, a list of fixes and features is updated here. When new versions are released, prior versions should continue to be supported for at least 90 days. When prior versions are no longer supported, it will be indicated on this page. 

### Version 0.9.0
Version 0.9.0 includes support for output compression. This is equivalent to running `-bgzip` followed by `-tabix` on the vcf or gvcf output. For more information, see [Frequently asked questions](frequently-asked-questions-genomics.md). 

### Version 0.8.1
Version 0.8.1 includes minor bug fixes.  

### Version 0.8.0
Version 0.8.0 includes support for GATK4 and outputting gVCFs.  

### Version 0.7.4
Version 0.7.4 includes support for accepting SAS tokens instead of account keys in the `config.txt` input. For more information, see [Input SAS tokens quickstart](quickstart-input-sas.md). 

### Version 0.7.3
Version 0.7.3 includes minor bug fixes.

### Version 0.7.2
Version 0.7.2 is the initial version. It was released November 1 2017.
