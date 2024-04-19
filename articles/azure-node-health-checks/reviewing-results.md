---
title: Interpreting results from Azure Node Health Check
description: Interpreting results from Azure Node Health Checks (AzNHC) to validation.
ms.service: azure-node-health-checks
ms.topic: how to 
author: rafsalas19
ms.author: rafaelsalas
ms.date: 04/15/2024
---

# Interpreting Azure Node Health Check Results
AzNHC prints results to both terminal and it's health log. The error messages produced by AzNHC gives are useful for determining the failed components. The following will guide you through understanding what a successful/failed test output looks like.

## Test Results

### Passing Tests
By default AzNHC will run each test specified in the conf file to completion unless a failure is detected.

Passing tests have this format:
  ```SUCCESS:  nhc:  Health check passed:  <Test function executed>: <Test result message>```

### Failed Tests
If AzNHC encounters a failure it will exit and report the failure. If you would like to run all tests regardless of any failure you can use the "--all" flag when running.

Failed tests have this format:
  ```ERROR:  nhc:  Health check failed:  <Test function executed>: <Test result message>. FaultCode: <NHC Fault code>```

Notes:
- The "Test function executed" is the bash function that executes the check. Check out the [overview page](./overview.md) for the table of custom tests.
- The "Test result message" will vary depending on the test that is run.
- The "NHC Fault Code" is a code used internally. This code is used internally by Microsoft.

## When to submit a support request
Some NHC Failures can be remediated by you without the need for a support ticket.

### Failure which can be remediated without support
  - check_gpu_ecc/check_ecc
    - Row remap pending: This can be resolved by rebooting the VM to allow the GPUs to remap memory.

### Submitting a ticket to support
For all other failures do the following:
1. Confirm AzNHC failure by rerunning the AzNHC.
1. If the issue is intermittent or confirmed continue on to the next steps.
1. If using the Azure AI/HPC market place VM image gather hpc diagnostics: ```sudo bash /opt/azurehpc/diagnostics/gather_azhpc_vm_diagnostics.sh```
1. If not using the market place image please refer to [azhpc-diagnostics](https://github.com/Azure/azhpc-diagnostics) Github page on how to install and gather diagnostics.
1. Open an Azure support ticket:
    - Refer to [creating a support ticket page](../azure-portal/supportability/how-to-create-azure-support-request.md).
    - Use "Compute/High Performance Computing (HPC)" as the service path.
    - Include the AzNHC Error details in the description. 
    - Attach both the azure-hpc diagnostic tar file and the AzNHC health.log to the ticket.
1. Once completed support will reach out to you to triage the VM/Node.
