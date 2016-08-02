<properties
   pageTitle="Hybrid Runbook Worker: A runbook job terminates with a status of Suspended | Microsoft Azure"
   description="Symptoms causes and resolutions for Hybrid Runbook Worker job termination error."
   services="automation"
   documentationCenter=""
   authors="mgoedtel"
   manager="jwhit"
   editor="tysonn" />
<tags
   ms.service="automation"
   ms.devlang="na"
   ms.topic="article"
   ms.tgt_pltfrm="na"
   ms.workload="infrastructure-services"
   ms.date="05/18/2016"
   ms.author="magoedte" />

# Hybrid Runbook Worker: A runbook job terminates with a status of Suspended

## Summary

Your runbook is suspended shortly after attempting to execute it three times. There are conditions which may interrupt the runbook from completing successfully and the related error message does not include any additional information indicating why. This article provides troubleshooting steps for issues related to the Hybrid Runbook Worker runbook execution failures.

If your Azure issue is not addressed in this article, visit the Azure forums on [MSDN and the Stack Overflow](https://azure.microsoft.com/support/forums/). You can post your issue on these forums or to [@AzureSupport on Twitter](https://twitter.com/AzureSupport). Also, you can file an Azure support request by selecting **Get support** on the [Azure support](https://azure.microsoft.com/support/options/) site.

## Symptom

Runbook execution fails and the error returned is, "The job action 'Activate' cannot be run, because the process stopped unexpectedly. The job action was attempted 3 times."


## Cause

There are several possible causes for the error: 

  1. The hybrid worker is behind a proxy or firewall
  2. The computer the hybrid worker is running on has less than the minimum hardware [requirements](automation-hybrid-runbook-worker.md#hybrid-runbook-worker-requirements) 
  3. The runbooks cannot authenticate with local resources


## Cause 1: Hybrid Runbook Worker is behind proxy or firewall

The computer the Hybrid Runbook Worker is running on is behind a firewall or proxy server and outbound network access may not be permitted or configured correctly.

### Solution

Verify the computer has outbound access to *.cloudapp.net on ports 443, 9354, and 30000-30199. 

## Cause 2: Computer has less than minimum hardware requirements

Computers running the Hybrid Runbook Worker should meet the minimum hardware requirements before designating it to host this feature. Otherwise, depending on the resource utilization of other background processes and contention caused by runbooks during execution, the computer will become over utilized and cause runbook job delays or timeouts. 

### Solution 

First confirm the computer designated to run the Hybrid Runbook Worker feature meets the minimum hardware requirements.  If it does, monitor CPU and memory utilization to determine any correlation between the performance of Hybrid Runbook Worker processes and Windows.  If there is memory or CPU pressure, this may indicate the need to upgrade or add additional processors, or increase memory to address the resource bottleneck and resolve the error. Alternatively, select a different compute resource that can support the minimum requirements and scale when workload demands indicate an increase is necessary.         

## Cause 3: Runbooks cannot authenticate with local resources

### Solution

Check the **Microsoft-SMA** event log for a corresponding event with description *Win32 Process Exited with code [4294967295]*.  The cause of this error is you haven't configured authentication in your runbooks or specified the Run As credentials for the Hybrid worker group.  Please review [Runbook permissions](automation-hybrid-runbook-worker#runbook-permissions) to confirm you have correctly configured authentication for your runbooks.  


 

