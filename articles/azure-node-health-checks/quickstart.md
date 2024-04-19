---
title: Azure Node Health Checks Quick Start
description: Quick start for using Azure Node Health Checks (AzNHC) to validate AI-HPC VM offerings.
ms.service: azure-node-health-checks
ms.topic: quick start
author: rafsalas19
ms.author: rafaelsalas
ms.date: 04/15/2024
---

# AzNHC Quick Start Guide
Using AzNHC is straight forward. This guide will illustrate the steps to for validating a VM.

## Things to Note
  - If the AzNHC container was not pulled down previously then AzNHC will need to pull down the image from the registry. First use of AzNHC will incur additional runtime due to this.
  - Typical runtime for AzNHC is up to 5 minutes excluding the first time the container is pulled down from the registry.
  - Additional arguments can be used to configure AzNHC. Check the help menu for more options.

## Setup
Clone the project from Github:
```git clone https://github.com/Azure/azurehpc-health-checks.git```

## Procedure
  1. Launch AzNHC: ``` sudo ./run-health-checks.sh ```
  1. AzNHC will output results to terminal as well as the health log ( health.log by default).
  1. If no errors are encountered then the health checks have completed successfully.
  1. In the event of an error refer to [reviewing results page](./reviewing-results.md).

## Example Output

### Pass
![Pass img](terminaloutput.png)
### Fail
![Fail image](terminaloutput-fail.png)
