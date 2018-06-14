---
title: Troubleshoot errors with Update Management
description: Learn how to troubleshoot issues with Update Management
services: automation
author: georgewallace
ms.author: gwallace
ms.date: 06/13/2018
ms.topic: conceptual
ms.service: automation
manager: carmonm
---
# Troubleshooting issues with Update Management

This article discusses solutions to resolve issues that you may encounter when using Update Management

## Onboarding issues

If you encounter issues while attempting to onboard the solution on a virtual machine, check the **Operations Manager** event log under **Application and Services Logs** on the local machine for events with event ID **4502** and event message containing **Microsoft.EnterpriseManagement.HealthService.AzureAutomation.HybridAgent**.

The following section highlights specific error messages and a possible resolution for each. For other onboarding issues see, [troubleshoot solution onboarding](onboarding.md).

### Machine is already registered to a different account

#### Issue

You receive the following error message 

```error
Unable to Register Machine for Patch Management, Registration Failed with Exception System.InvalidOperationException: {"Message":"Machine is already registered to a different account."}
```

#### Cause

The machine is already onboarded to another workspace for Update Management.

#### Resolution

Perform cleanup of old artifacts on the machine by [deleting the hybrid runbook group](../automation-hybrid-runbook-worker.md#remove-a-hybrid-worker-group) and try again.

### Machine is unable to communicate with the service

#### Issue

You receive one of the following error messages:

```
Unable to Register Machine for Patch Management, Registration Failed with Exception System.Net.Http.HttpRequestException: An error occurred while sending the request. ---> System.Net.WebException: The underlying connection was closed: An unexpected error occurred on a receive. ---> System.ComponentModel.Win32Exception: The client and server cannot communicate, because they do not possess a common algorithm
```

```
Unable to Register Machine for Patch Management, Registration Failed with Exception Newtonsoft.Json.JsonReaderException: Error parsing positive infinity value.
```

```
The certificate presented by the service <wsid>.oms.opinsights.azure.com was not issued by a certificate authority used for Microsoft services. Contact your network administrator to see if they are running a proxy that intercepts TLS/SSL communication.
```

#### Cause

There may be a proxy, gateway or firewall blocking network communication.

#### Resolution

Review your networking and ensure appropriate ports and addresses are allowed. See [network requirements](../automation-hybrid-runbook-worker.md#network-planning), for a list of ports and addresses that are required by Update Management and Hybrid Runbook Workers.

### Unable to create self-signed certificate

#### Issue

You receive one of the following error messages:

```
Unable to Register Machine for Patch Management, Registration Failed with Exception AgentService.HybridRegistration. PowerShell.Certificates.CertificateCreationException: Failed to create a self-signed certificate. ---> System.UnauthorizedAccessException: Access is denied.
```

#### Cause

The Hybrid Runbook Worker was not able to generate a self-signed certificate

#### Resolution

Verify system account has read access to folder **C:\ProgramData\Microsoft\Crypto\RSA** and try again.

## Next steps

If you did not see your problem or were unable to solve your issue, visit one of the following channels for more support:

* Get answers from Azure experts through [Azure Forums](https://azure.microsoft.com/support/forums/)
* Connect with [@AzureSupport](https://twitter.com/azuresupport) – the official Microsoft Azure account for improving customer experience by connecting the Azure community to the right resources: answers, support, and experts.
