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
ms.topic: conceptual
ms.date: 04/30/2019
ms.custom: seodec18

---
# Known issues and troubleshooting Azure Machine Learning service

This article helps you find and correct errors or failures encountered when using the Azure Machine Learning service.

## Visual interface issues

Visual interface for machine learning service issues.

### Long compute preparation time

Create new compute or evoke leaving compute takes time, may be a few minutes or even longer. The team is working for optimization.


### Cannot run an experiment only contains dataset 

You might want to run an experiment only contains dataset  to visualize the dataset. However, it's not allowed to run an experiment only contains dataset today. We are actively fixing this issue.
 
Before the fix, you can connect the dataset to any data transformation module (Select Columns in Dataset, Edit Metadata, Split Data etc.) and run the experiment. Then you can visualize the dataset. 

Below image shows how:
![visulize-data](./media/resource-known-issues/aml-visualize-data.png)

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

## Automated machine learning

Tensor Flow
Automated machine learning does not currently support tensor flow version 1.13. Installing this version will cause package dependencies to stop working. We are working to fix this issue in a future release. 

### Experiment Charts

Binary classification charts (precision-recall, ROC, gain curve etc.) shown in automated ML experiment iterations are not rendering corectly in user interface since 4/12. Chart plots are currently showing inverse results, where better performing models are shown with lower results. A resolution is under investigation.

## Databricks

Databricks and Azure Machine Learning issues.

### Failure when installing packages

Azure Machine Learning SDK installation fails on Azure Databricks when more packages are installed. Some packages, such as `psutil`, can cause conflicts. To avoid installation errors, install packages by freezing the library version. This issue is related to Databricks and not to the Azure Machine Learning service SDK. You might experience this issue with other libraries, too. Example:

```python
psutil cryptography==1.5 pyopenssl==16.0.0 ipython==2.2.0
```

Alternatively, you can use init scripts if you keep facing install issues with Python libraries. This approach isn't officially supported. For more information, see [Cluster-scoped init scripts](https://docs.azuredatabricks.net/user-guide/clusters/init-scripts.html#cluster-scoped-init-scripts).

### Cancel an automated machine learning run

When you use automated machine learning capabilities on Azure Databricks, to cancel a run and start a new experiment run, restart your Azure Databricks cluster.

### >10 iterations for automated machine learning

In automated machine learning settings, if you have more than 10 iterations, set `show_output` to `False` when you submit the run.

### Widget for the Azure Machine Learning SDK/automated machine learning

The Azure Machine Learning SDK widget isn't supported in a Databricks notebook because the notebooks can't parse HTML widgets. You can view the widget in the portal by using this Python code in your Azure Databricks notebook cell:

```
displayHTML("<a href={} target='_blank'>Azure Portal: {}</a>".format(local_run.get_portal_url(), local_run.id))
```

### Import error: No module named 'pandas.core.indexes'

If you see this error when you use automated machine learning:

1. Run this command to install two packages in your Azure Databricks cluster: 

   ```
   scikit-learn==0.19.1
   pandas==0.22.0
   ```

1. Detach and then reattach the cluster to your notebook. 

If these steps don't solve the issue, try restarting the cluster.

## Azure portal

If you go directly to view your workspace from a share link from the SDK or the portal, you will not be able to view the normal Overview page with subscription information in the extension. You will also not be able to switch into another workspace. If you need to view another workspace, the workaround is to go directly to the [Azure portal](https://portal.azure.com) and search for the workspace name.

## Diagnostic logs

Sometimes it can be helpful if you can provide diagnostic information when asking for help. To see some logs, visit [Azure portal](https://portal.azure.com) and  go to your workspace and select **Workspace > Experiment > Run > Logs**.

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
