---
title: Azure Quickstart SDK for Python
description: Create configuration profile assignments using the Python SDK for Automanage.
author: andrsmith
ms.service: azure-automanage
ms.custom: devx-track-python
ms.topic: quickstart
ms.date: 08/24/2022
ms.author: andrsmith
# Customer intent: "As a cloud administrator, I want to apply best practices configuration profiles to existing virtual machines using Python, so that I can automate the management and optimization of my cloud resources effectively before the upcoming retirement of Azure Automanage services."
---

# Quickstart: Enable Azure Automanage for virtual machines using Python

> [!CAUTION]
> On September 30, 2027, the Azure Automanage Best Practices service will be retired. As a result, attempting to create a new configuration profile or onboarding a new subscription to the service will result in an error. Learn more [here](https://aka.ms/automanagemigration/) about how to migrate to Azure Policy before that date. 

> [!CAUTION]
> Starting February 1st 2025, Azure Automanage will begin rolling out changes to halt support and enforcement for all services dependent on the deprecated Microsoft Monitoring Agent (MMA). To continue using Change Tracking and Management, VM Insights, Update Management, and Azure Automation, [migrate to the new Azure Monitor Agent (AMA)](https://aka.ms/mma-to-ama/).

Azure Automanage allows users to seamlessly apply Azure best practices to their virtual machines. This quickstart guide will help you apply a Best Practices Configuration profile to an existing virtual machine using the [azure-sdk-for-python repo](https://github.com/Azure/azure-sdk-for-python).

## Prerequisites 

- An active [Azure Subscription](https://azure.microsoft.com/pricing/purchase-options/pay-as-you-go/)
- An existing [Virtual Machine](/azure/virtual-machines/windows/quick-create-portal)

> [!NOTE]
> Free trial accounts do not have access to the virtual machines used in this tutorial. Please upgrade to a Pay-As-You-Go subscription.

> [!IMPORTANT]
> You need to have the **Contributor** role on the resource group containing your VMs to enable Automanage. If you are enabling Automanage for the first time on a subscription, you need the following permissions: **Owner** role or **Contributor** along with **User Access Administrator** roles on your subscription.

## Install required packages 

For this demo, both the **Azure Identity** and **Azure Automanage** packages are required.

Use `pip` to install these packages: 

```
pip install azure-identity
pip install azure-mgmt-automanage
```

## Import packages 

Import the **Azure Identity** and **Azure Automanage** packages into the script: 

```python
from azure.identity import DefaultAzureCredential
from azure.mgmt.automanage import AutomanageClient
```

## Authenticate to Azure and create an Automanage client

Use the **Azure Identity** package to authenticate to Azure and then create an Automanage Client:

```python 
credential = DefaultAzureCredential()
client = AutomanageClient(credential, "<subscription ID>")
```

## Enable best practices configuration profile to an existing virtual machine

```python 
assignment = {
    "properties": {
        "configurationProfile": "/providers/Microsoft.Automanage/bestPractices/AzureBestPracticesProduction",
    }
}

client.configuration_profile_assignments.create_or_update("default", "resourceGroupName", "vmName", assignment)
```

## Next steps

> [!div class="nextstepaction"]
Learn how to conduct more operations with the Automanage Client by visiting the [azure-samples-python-management repo](https://github.com/Azure-Samples/azure-samples-python-management/tree/main/samples/automanage).
