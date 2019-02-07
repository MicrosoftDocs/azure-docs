---
title: Known issues & troubleshooting
titleSuffix: Azure Machine Learning service
description: Get a list of the known issues, workarounds, and troubleshooting for Azure Machine Learning service.
services: machine-learning
author: j-martens
ms.author: jmartens
ms.reviewer: mldocs
ms.service: machine-learning
ms.subservice: core
ms.topic: article
ms.date: 12/04/2018
ms.custom: seodec18

---
# Known issues and troubleshooting Azure Machine Learning service

This article helps you find and correct errors or failures encountered when using the Azure Machine Learning service.

## SDK installation issues

**Error message: Cannot uninstall 'PyYAML'**

Azure Machine Learning SDK for Python: PyYAML is a distutils installed project. Therefore, we cannot accurately determine which files belong to it if there is a partial uninstall. To continue installing the SDK while ignoring this error, use:

```Python
pip install --upgrade azureml-sdk[notebooks,automl] --ignore-installed PyYAML
```

## Trouble creating Azure Machine Learning Compute

There is a rare chance that some users who created their Azure Machine Learning workspace from the Azure portal before the GA release might not be able to create Azure Machine Learning Compute in that workspace. You can either raise a support request against the service or create a new workspace through the Portal or the SDK to unblock yourself immediately.

## Image building failure

Image building failure when deploying web service. Workaround is to add "pynacl==1.2.1" as a pip dependency to Conda file for image configuration.

## Deployment failure

If you observe `['DaskOnBatch:context_managers.DaskOnBatch', 'setup.py']' died with <Signals.SIGKILL: 9>`, change the SKU for VMs used in your deployment to one that has more memory.

## FPGAs
You will not be able to deploy models on FPGAs until you have requested and been approved for FPGA quota. To request access, fill out the quota request form: https://aka.ms/aml-real-time-ai

## Databricks

Databricks and Azure Machine Learning issues.

1. Azure Machine Learning SDK installation failures on Databricks when more packages are installed.

   Some packages, such as `psutil`, can cause conflicts. To avoid installation errors,  install packages by freezing lib version. This issue is related to Databricks and not the Azure Machine Learning service SDK - you may face it with other libs too. Example:
   ```python
   pstuil cryptography==1.5 pyopenssl==16.0.0 ipython==2.2.0
   ```
   Alternatively, you can use init scripts if you keep facing install issues with Python libs. This approach is not an officially supported approach. You can refer to [this doc](https://docs.azuredatabricks.net/user-guide/clusters/init-scripts.html#cluster-scoped-init-scripts).

2. When using Automated Machine Learning on Databricks, if you want to cancel a run and start a new experiment run, restart your Azure Databricks cluster.

3. In Automated ml settings, if you have more than 10 iterations, set `show_output` to `False` when you submit the run.


## Azure portal
If you go directly to view your workspace from a share link from the SDK or the portal, you will not be able to view the normal Overview page with subscription information in the extension. You will also not be able to switch into another workspace. If you need to view another workspace, the workaround is to go directly to the [Azure portal](https://portal.azure.com) and search for the workspace name.

## Diagnostic logs
Sometimes it can be helpful if you can provide diagnostic information when asking for help.
Here is where the log files live:

## Resource quotas

Learn about the [resource quotas](how-to-manage-quotas.md) you might encounter when working with Azure Machine Learning.

## Authentication errors

If you perform a management operation on a compute target from a remote job, you will receive one of the following errors:

```json
{"code":"Unauthorized","statusCode":401,"message":"Unauthorized","details":[{"code":"InvalidOrExpiredToken","message":"The request token was either invalid or expired. Please try again with a valid token."}]}
```

```json
{"error":{"code":"AuthenticationFailed","message":"Authentication failed."}}
```

For example, you will receive an error if you try to create or attach a compute target from an ML Pipeline that is submitted for remote execution.

## Get more support

You can submit requests for support and get help from technical support, forums, and more. [Learn more...](support-for-aml-services.md)
