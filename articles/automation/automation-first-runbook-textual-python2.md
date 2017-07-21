---
title: My first Python runbook in Azure Automation | Microsoft Docs
description:  Tutorial that walks you through the creation, testing, and publishing of a simple Python runbook.
services: automation
documentationcenter: ''
author: eslesar
manager: carmonm
editor: tysonn

ms.service: automation
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: infrastructure-services
ms.date: 07/20/2017
ms.author: eslesar
---

# My first Python runbook

> [!div class="op_single_selector"]
> * [Graphical](automation-first-runbook-graphical.md)
> * [PowerShell](automation-first-runbook-textual-powershell.md)
> * [PowerShell Workflow](automation-first-runbook-textual.md)
> * [Python](automation-first-runbook-python2.md)
> 
>

This tutorial walks you through the creation of a [Python runbook](automation-runbook-types.md#python-runbooks) in Azure Automation. We start with a simple runbook that we test and publish while we explain how to track the status of the runbook job. Then we modify the runbook to actually manage Azure resources, in this case starting an Azure virtual machine. Lastly, we make the runbook more robust by adding runbook parameters.

## Prerequisites
To complete this tutorial, you need the following:

* Azure subscription. If you don't have one yet, you can [activate your MSDN subscriber benefits](https://azure.microsoft.com/pricing/member-offers/msdn-benefits-details/) or <a href="/pricing/free-account/" target="_blank">[sign up for a free account](https://azure.microsoft.com/free/).
* [Automation account](automation-sec-configure-azure-runas-account.md) to hold the runbook and authenticate to Azure resources.  This account must have permission to start and stop the virtual machine.
* An Azure virtual machine. We stop and start this machine so it should not be a production VM.

## Create a new runbook
We start by creating a simple runbook that outputs the text *Hello World*.

1. In the Azure portal, open your Automation account.  
   The Automation account page gives you a quick view of the resources in this account. You should already have some assets. Most of those are the modules that are automatically included in a new Automation account. You should also have the Credential asset that's mentioned in the [prerequisites](#prerequisites).
2. Click the **Runbooks** tile to open the list of runbooks.
   ![RunbooksControl](media/automation-first-runbook-textual-powershell/runbooks-control-tiles.png)  
3. Create a new runbook by clicking the **Add a runbook** button and then **Create a new runbook**.
4. Give the runbook the name *MyFirstRunbook-Python*.
5. In this case, we're going to create a [Python runbook](automation-runbook-types.md#powershell-runbooks) so select **Python 2** for **Runbook type**.
   ![Runbook Type](media/automation-first-runbook-textual-powershell/automation-runbook-type.png)  
6. Click **Create** to create the runbook and open the textual editor.