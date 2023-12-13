---
title: Azure Automation FAQ
description: This article gives answers to frequently asked questions about Azure Automation.
services: automation
ms.topic: conceptual
ms.custom: devx-track-python
ms.date: 10/03/2023
#Customer intent: As an implementer, I want answers to various questions.
---

# Azure Automation frequently asked questions

This Microsoft FAQ is a list of commonly asked questions about Azure Automation. If you have any other questions about its capabilities, go to the discussion forum and post your questions. When a question is frequently asked, we add it to this article so that it's found quickly and easily.

## Why can't I create new Automation job in West Europe region?

You might experience a delay or failure of job creation because of scalability issues in West Europe region. For more information, see [creation of new Automation job in West Europe region](./troubleshoot/runbooks.md#scenario-unable-to-create-new-automation-job-in-west-europe-region).


## Can Update Management prevent unexpected OS-level upgrades?

Yes. For more information, see [Exclude updates](./update-management/manage-updates-for-vm.md#exclude-updates).

## Why aren't critical/security updates applied to a Linux machine with Update Management?

When you deploy updates to a Linux machine, you can select update classifications. This option filters the updates that meet the specified criteria. For more information, see [Linux update classifications](./update-management/manage-updates-for-vm.md#linux-update-classifications).

## Can Update Management deploy updates across Azure tenants?

Yes. For instructions, see [Deploy updates across Azure tenants](./update-management/deploy-updates.md#deploy-updates-across-azure-tenants).

## Which Python 3 version is supported in Azure Automation?

For cloud jobs, Python 3.8 is supported. Scripts and packages from any 3.x version might work if the code is compatible across different versions.

For hybrid jobs on Windows Hybrid Runbook Workers, you can choose to install any 3.x version you want to use. For hybrid jobs on Linux Hybrid Runbook Workers, we depend on Python 3 version installed on the machine to run DSC OMSConfig and the Linux Hybrid Worker. We recommend installing version 3.6; however, different versions should also work if there are no breaking changes in method signatures or contracts between versions of Python 3.

## Can Python 2 and Python 3 runbooks run in same Automation account?

Yes, there's no limitation for using Python 2 and Python 3 runbooks in same Automation account.  

## What is the plan for migrating existing Python 2 runbooks and packages to Python 3?

Azure Automation doesn't plan to migrate Python 2 runbooks and packages to Python 3. You'll have to do this migration yourself. Existing and new Python 2 runbooks and packages will continue to work.

## What packages are supported by default in Python 3 environment?

Azure package 4.0.0. For more information, see [Manage Python 3 packages](python-3-packages.md).

## What if I run a Python 3 runbook that references a Python 2 package or the other way around?

Python 2 and Python 3 have different execution environments. While a Python 2 runbook is running, only Python 2 packages can be imported and similar for Python 3.

## How do I differentiate between Python 2 and Python 3 runbooks and packages?

Python 3 is a new runbook definition, which distinguishes between Python 2 and Python 3 runbooks. Similarly, another package kind is introduced for Python 3 packages.

## How does a Hybrid Runbook Worker know which version of Python to run when both Python2 and Python3 are installed?

For a Windows Runbook Worker, when running a Python 2 runbook it looks for the environment variable `PYTHON_2_PATH` first and validates whether it points to a valid executable file. For example, if the installation folder is `C:\Python2`, it would check if `C:\Python2\python.exe` is a valid path. If not found, then it looks for the `PATH` environment variable to do a similar check.

For Python 3, it looks for the `PYTHON_3_PATH` env variable first and then falls back to the `PATH` environment variable.

See [Multiple Python versions](automation-runbook-types.md#multiple-python-versions).

## How does a Hybrid Runbook Worker locate the Python interpreter?

Locating the Python module is controlled by environment variables as explained earlier.

## Is Python 3 supported in Source Control?

No. Source Control isn't currently supported for Python 3. By default, Python runbooks are synced as Python 2 runbooks.

## How can a runbook author know what Python packages are available in an Azure sandbox?

See [Identify available packages in sandbox](python-3-packages.md#identify-available-packages-in-sandbox).

## How can a runbook author set which version of a package module to be used if there are multiple modules?

See [Manage Python 3 packages](python-3-packages.md).

## Next steps

If your question isn't answered here, you can refer to the following sources for more questions and answers.

- [Azure Automation](/answers/topics/azure-automation.html)
- [Feedback forum](https://feedback.azure.com/d365community/forum/721a322e-bd25-ec11-b6e6-000d3a4f0f1c)
