---
title: Known issues & troubleshooting
titleSuffix: Azure Machine Learning
description: Get help finding and correcting errors or failures in Azure Machine Learning. Learn about known issues, troubleshooting, and workarounds. 
services: machine-learning
author: j-martens
ms.author: jmartens
ms.reviewer: mldocs
ms.service: machine-learning
ms.subservice: core
ms.topic: troubleshooting
ms.custom: contperfq4
ms.date: 03/31/2020

---
# Known issues and troubleshooting in Azure Machine Learning

This article helps you troubleshoot known issues you may encounter when using Azure Machine Learning. 

For more information on troubleshooting, see [Next steps](#next-steps) at the end of this article.

> [!TIP]
> Errors or other issues might be the result of [resource quotas](how-to-manage-quotas.md) you encounter when working with Azure Machine Learning. 

## Access diagnostic logs

Sometimes it can be helpful if you can provide diagnostic information when asking for help. To see some logs: 
1. Visit [Azure Machine Learning studio](https://ml.azure.com). 
1. On the left-hand side, select **Experiment** 
1. Select an experiment.
1. Select a run.
1. On the top, select **Outputs + logs**.

> [!NOTE]
> Azure Machine Learning logs information from a variety of sources during training, such as AutoML or the Docker container that runs the training job. Many of these logs are not documented. If you encounter problems and contact Microsoft support, they may be able to use these logs during troubleshooting.


## Installation and import
                           
* **Pip Installation: Dependencies are not guaranteed to be consistent with single-line installation:** 

   This is a known limitation of pip, as it does not have a functioning dependency resolver when you install as a single line. The first  unique dependency is the only one it looks at. 

   In the following code `azureml-datadrift` and `azureml-train-automl` are both installed using a single-line pip install. 
     ```
       pip install azureml-datadrift, azureml-train-automl
     ```
   For this example, let's say `azureml-datadrift` requires version > 1.0 and `azureml-train-automl` requires version < 1.2. If the latest version of `azureml-datadrift` is 1.3,  then both packages get upgraded to 1.3, regardless of the `azureml-train-automl` package requirement for an older version. 

   To ensure the appropriate versions are installed for your packages, install using multiple lines like in the following code. Order isn't an issue here, since pip explicitly downgrades as part of the next line call. And so, the appropriate version dependencies are applied.
    
     ```
        pip install azureml-datadrift
        pip install azureml-train-automl 
     ```
     
* **Explanation package not guaranteed to be installed when installing the azureml-train-automl-client:** 
   
   When running a remote AutoML run with model explanation enabled, you will see an error message "Please install azureml-explain-model package for model explanations." This is a known issue. As a workaround follow one of the steps below:
  
  1. Install azureml-explain-model locally.
   ```
      pip install azureml-explain-model
   ```
  2. Disable the explainability feature entirely by passing model_explainability=False in the AutoML configuration.
   ```
      automl_config = AutoMLConfig(task = 'classification',
                             path = '.',
                             debug_log = 'automated_ml_errors.log',
                             compute_target = compute_target,
                             run_configuration = aml_run_config,
                             featurization = 'auto',
                             model_explainability=False,
                             training_data = prepped_data,
                             label_column_name = 'Survived',
                             **automl_settings)
    ``` 
    
* **Panda errors: Typically seen during AutoML Experiment:**
   
   When manually setting up your environment using pip, you may notice attribute errors (especially from pandas) due to unsupported package versions being installed. In order to prevent such errors, [please install the AutoML SDK using the automl_setup.cmd](https://github.com/Azure/MachineLearningNotebooks/blob/master/how-to-use-azureml/automated-machine-learning/README.md):
   
    1. Open an Anaconda prompt and clone the GitHub repository for a set of sample notebooks.

    ```bash
    git clone https://github.com/Azure/MachineLearningNotebooks.git
    ```
    
    2. cd to the how-to-use-azureml/automated-machine-learning folder where the sample notebooks were extracted and then run:
    
    ```bash
    automl_setup
    ```
  
* **Error message: Cannot uninstall 'PyYAML'**

    Azure Machine Learning SDK for Python: PyYAML is a `distutils` installed project. Therefore, we cannot accurately determine which files belong to it if there is a partial uninstall. To continue installing the SDK while ignoring this error, use:
    
    ```Python
    pip install --upgrade azureml-sdk[notebooks,automl] --ignore-installed PyYAML
    ```

* **Databricks failure when installing packages**

    Azure Machine Learning SDK installation fails on Azure Databricks when more packages are installed. Some packages, such as `psutil`, can cause conflicts. To avoid installation errors, install packages by freezing the library version. This issue is related to Databricks and not to the Azure Machine Learning SDK. You might experience this issue with other libraries, too. Example:
    
    ```python
    psutil cryptography==1.5 pyopenssl==16.0.0 ipython==2.2.0
    ```

    Alternatively, you can use init scripts if you keep facing install issues with Python libraries. This approach isn't officially supported. For more information, see [Cluster-scoped init scripts](https://docs.azuredatabricks.net/user-guide/clusters/init-scripts.html#cluster-scoped-init-scripts).

* **Databricks import error: cannot import name 'Timedelta' from 'pandas._libs.tslibs'**: If you see this error when you use automated machine learning, run the two following lines in your notebook:
    ```
    %sh rm -rf /databricks/python/lib/python3.7/site-packages/pandas-0.23.4.dist-info /databricks/python/lib/python3.7/site-packages/pandas
    %sh /databricks/python/bin/pip install pandas==0.23.4
    ```

* **Databricks import error: No module named 'pandas.core.indexes'**: If you see this error when you use automated machine learning:

    1. Run this command to install two packages in your Azure Databricks cluster:
    
       ```bash
       scikit-learn==0.19.1
       pandas==0.22.0
       ```
    
    1. Detach and then reattach the cluster to your notebook.
    
    If these steps don't solve the issue, try restarting the cluster.

* **Databricks FailToSendFeather**: If you see a `FailToSendFeather` error when reading data on Azure Databricks cluster, refer to the following solutions:
    
    * Upgrade `azureml-sdk[automl]` package to the latest version.
    * Add `azureml-dataprep` version 1.1.8 or above.
    * Add `pyarrow` version 0.11 or above.
    
## Create and manage workspaces

> [!WARNING]
> Moving your Azure Machine Learning workspace to a different subscription, or moving the owning subscription to a new tenant, is not supported. Doing so may cause errors.

* **Azure portal**: If you go directly to view your workspace from a share link from the SDK or the portal, you will not be able to view the normal **Overview** page with subscription information in the extension. You will also not be able to switch into another workspace. If you need to view another workspace, go directly to [Azure Machine Learning studio](https://ml.azure.com) and search for the workspace name.

## Set up your environment

* **Trouble creating AmlCompute**: There is a rare chance that some users who created their Azure Machine Learning workspace from the Azure portal before the GA release might not be able to create AmlCompute in that workspace. You can either raise a support request against the service or create a new workspace through the portal or the SDK to unblock yourself immediately.

## Work with data

### Overloaded AzureFile storage

If you receive an error `Unable to upload project files to working directory in AzureFile because the storage is overloaded`, apply following workarounds.

If you are using file share for other workloads, such as data transfer, the recommendation is to use blobs so that file share is free to be used for submitting runs. You may also split the workload between two different workspaces.

### Passing data as input

*  **TypeError: FileNotFound: No such file or directory**: This error occurs if the file path you provide isn't where the file is located. You need to make sure the way you refer to the file is consistent with where you mounted your dataset on your compute target. To ensure a deterministic state, we recommend using the abstract path when mounting a dataset to a compute target. For example, in the following code we mount the dataset under the root of the filesystem of the compute target, `/tmp`. 
    
    ```python
    # Note the leading / in '/tmp/dataset'
    script_params = {
        '--data-folder': dset.as_named_input('dogscats_train').as_mount('/tmp/dataset'),
    } 
    ```

    If you don't include the leading forward slash, '/',  you'll need to prefix the working directory e.g. `/mnt/batch/.../tmp/dataset` on the compute target to indicate where you want the dataset to be mounted.

### Data labeling projects

|Issue  |Resolution  |
|---------|---------|
|Only datasets created on blob datastores can be used.     |  This is a known limitation of the current release.       |
|After creation, the project shows "Initializing" for a long time.     | Manually refresh the page. Initialization should proceed at roughly 20 datapoints per second. The lack of autorefresh is a known issue.         |
|When reviewing images, newly labeled images are not shown.     |   To load all labeled images, choose the **First** button. The **First** button will take you back to the front of the list, but loads all labeled data.      |
|Pressing Esc key while labeling for object detection creates a zero size label on the top-left corner. Submitting labels in this state fails.     |   Delete the label by clicking on the cross mark next to it.  |

### Data drift monitors

* If the SDK `backfill()` function does not generate the expected output, it may be due to an authentication issue.  When you create the compute to pass into this function, do not use `Run.get_context().experiment.workspace.compute_targets`.  Instead, use [ServicePrincipalAuthentication](https://docs.microsoft.com/python/api/azureml-core/azureml.core.authentication.serviceprincipalauthentication?view=azure-ml-py) such as the following to create the compute that you pass into that `backfill()` function: 

  ```python
   auth = ServicePrincipalAuthentication(
          tenant_id=tenant_id,
          service_principal_id=app_id,
          service_principal_password=client_secret
          )
   ws = Workspace.get("xxx", auth=auth, subscription_id="xxx", resource_group"xxx")
   compute = ws.compute_targets.get("xxx")
   ```

## Azure Machine Learning designer

Known issues:

* **Long compute preparation time**: It may be a few minutes or even longer when you first connect to or create a compute target. 

## Train models

* **ModuleErrors (No module named)**:  If you are running into ModuleErrors while submitting experiments in Azure ML, it means that the training script is expecting a package to be installed but it isn't added. Once you provide the package name, Azure ML installs the package in the environment used for your training run. 

    If you are using [Estimators](concept-azure-machine-learning-architecture.md#estimators) to submit experiments, you can specify a package name via `pip_packages` or `conda_packages` parameter in the estimator based on from which source you want to install the package. You can also specify a yml file with all your dependencies using `conda_dependencies_file`or list all your pip requirements in a txt file using `pip_requirements_file` parameter. If you have your own Azure ML Environment object that you want to override the default image used by the estimator, you can specify that environment via the `environment` parameter of the estimator constructor.

    Azure ML also provides framework-specific estimators for TensorFlow, PyTorch, Chainer and SKLearn. Using these estimators will make sure that the core framework dependencies are installed on your behalf in the environment used for training. You have the option to specify extra dependencies as described above. 
 
    Azure ML maintained docker images and their contents can be seen in [AzureML Containers](https://github.com/Azure/AzureML-Containers).
    Framework-specific dependencies  are listed in the respective framework documentation - [Chainer](https://docs.microsoft.com/python/api/azureml-train-core/azureml.train.dnn.chainer?view=azure-ml-py#remarks), [PyTorch](https://docs.microsoft.com/python/api/azureml-train-core/azureml.train.dnn.pytorch?view=azure-ml-py#remarks), [TensorFlow](https://docs.microsoft.com/python/api/azureml-train-core/azureml.train.dnn.tensorflow?view=azure-ml-py#remarks), [SKLearn](https://docs.microsoft.com/python/api/azureml-train-core/azureml.train.sklearn.sklearn?view=azure-ml-py#remarks).

    > [!Note]
    > If you think a particular package is common enough to be added in Azure ML maintained images and environments please raise a GitHub issue in [AzureML Containers](https://github.com/Azure/AzureML-Containers). 
 
* **NameError (Name not defined), AttributeError (Object has no attribute)**: This exception should come from your training scripts. You can look at the log files from Azure portal to get more information about the specific name not defined or attribute error. From the SDK, you can use `run.get_details()` to look at the error message. This will also list all the log files generated for your run. Please make sure to take a look at your training script and fix the error before resubmitting your run. 

* **Horovod has been shut down**: In most cases if you encounter "AbortedError: Horovod has been shut down" this exception means there was an underlying exception in one of the processes that caused Horovod to shut down. Each rank in the MPI job gets it own dedicated log file in Azure ML. These logs are named `70_driver_logs`. In case of distributed training, the log names are suffixed with `_rank` to make it easier to differentiate the logs. To find the exact error that caused Horovod to shut down, go through all the log files and look for `Traceback` at the end of the driver_log files. One of these files will give you the actual underlying exception. 

* **Run or experiment deletion**:  Experiments can be archived by using the [Experiment.archive](https://docs.microsoft.com/python/api/azureml-core/azureml.core.experiment(class)?view=azure-ml-py#archive--) 
method, or from the Experiment tab view in Azure Machine Learning studio client via the "Archive experiment" button. This action hides the experiment from list queries and views, but does not delete it.

    Permanent deletion of individual experiments or runs is not currently supported. For more information on deleting Workspace assets, see [Export or delete your Machine Learning service workspace data](how-to-export-delete-data.md).

* **Metric Document is too large**: Azure Machine Learning has internal limits on the size of metric objects that can be logged at once from a training run. If you encounter a "Metric Document is too large" error when logging a list-valued metric, try splitting the list into smaller chunks, for example:

    ```python
    run.log_list("my metric name", my_metric[:N])
    run.log_list("my metric name", my_metric[N:])
    ```

    Internally, Azure ML concatenates the blocks with the same metric name into a contiguous list.

## Automated machine learning

* **TensorFlow**: As of version 1.5.0 of the SDK, automated machine learning does not install tensorflow models by default. To install tensorflow and use it with your automated ML experiments, install tensorflow==1.12.0 via CondaDependecies. 
 
   ```python
   from azureml.core.runconfig import RunConfiguration
   from azureml.core.conda_dependencies import CondaDependencies
   run_config = RunConfiguration()
   run_config.environment.python.conda_dependencies = CondaDependencies.create(conda_packages=['tensorflow==1.12.0'])
  ```
* **Experiment Charts**: Binary classification charts (precision-recall, ROC, gain curve etc.) shown in automated ML experiment iterations are not rendering correctly in user interface since 4/12. Chart plots are currently showing inverse results, where better performing models are shown with lower results. A resolution is under investigation.

* **Databricks cancel an automated machine learning run**: When you use automated machine learning capabilities on Azure Databricks, to cancel a run and start a new experiment run, restart your Azure Databricks cluster.

* **Databricks >10 iterations for automated machine learning**: In automated machine learning settings, if you have more than 10 iterations, set `show_output` to `False` when you submit the run.

* **Databricks widget for the Azure Machine Learning SDK and automated machine learning**: The Azure Machine Learning SDK widget isn't supported in a Databricks notebook because the notebooks can't parse HTML widgets. You can view the widget in the portal by using this Python code in your Azure Databricks notebook cell:

    ```
    displayHTML("<a href={} target='_blank'>Azure Portal: {}</a>".format(local_run.get_portal_url(), local_run.id))
    ```

## Deploy & serve models

Take these actions for the following errors:

|Error  | Resolution  |
|---------|---------|
|Image building failure when deploying web service     |  Add "pynacl==1.2.1" as a pip dependency to Conda file for image configuration       |
|`['DaskOnBatch:context_managers.DaskOnBatch', 'setup.py']' died with <Signals.SIGKILL: 9>`     |   Change the SKU for VMs used in your deployment to one that has more memory. |
|FPGA failure     |  You will not be able to deploy models on FPGAs until you have requested and been approved for FPGA quota. To request access, fill out the quota request form: https://aka.ms/aml-real-time-ai       |

### Updating Azure Machine Learning components in AKS cluster

Updates to Azure Machine Learning components installed in an Azure Kubernetes Service cluster must be manually applied. 

You can apply these updates by detaching the cluster from the Azure Machine Learning workspace, and then reattaching the cluster to the workspace. If TLS is enabled in the cluster, you will need to supply the TLS/SSL certificate and private key when reattaching the cluster. 

```python
compute_target = ComputeTarget(workspace=ws, name=clusterWorkspaceName)
compute_target.detach()
compute_target.wait_for_completion(show_output=True)

attach_config = AksCompute.attach_configuration(resource_group=resourceGroup, cluster_name=kubernetesClusterName)

## If SSL is enabled.
attach_config.enable_ssl(
    ssl_cert_pem_file="cert.pem",
    ssl_key_pem_file="key.pem",
    ssl_cname=sslCname)

attach_config.validate_configuration()

compute_target = ComputeTarget.attach(workspace=ws, name=args.clusterWorkspaceName, attach_configuration=attach_config)
compute_target.wait_for_completion(show_output=True)
```

If you no longer have the TLS/SSL certificate and private key, or you are using a certificate generated by Azure Machine Learning, you can retrieve the files prior to detaching the cluster by connecting to the cluster using `kubectl` and retrieving the secret `azuremlfessl`.

```bash
kubectl get secret/azuremlfessl -o yaml
```

>[!Note]
>Kubernetes stores the secrets in base-64 encoded format. You will need to base-64 decode the `cert.pem` and `key.pem` components of the secrets prior to providing them to `attach_config.enable_ssl`. 

### Webservices in Azure Kubernetes Service failures

Many webservice failures in Azure Kubernetes Service can be debugged by connecting to the cluster using `kubectl`. You can get the `kubeconfig.json` for an Azure Kubernetes Service Cluster by running

```azurecli-interactive
az aks get-credentials -g <rg> -n <aks cluster name>
```

## Authentication errors

If you perform a management operation on a compute target from a remote job, you will receive one of the following errors: 

```json
{"code":"Unauthorized","statusCode":401,"message":"Unauthorized","details":[{"code":"InvalidOrExpiredToken","message":"The request token was either invalid or expired. Please try again with a valid token."}]}
```

```json
{"error":{"code":"AuthenticationFailed","message":"Authentication failed."}}
```

For example, you will receive an error if you try to create or attach a compute target from an ML Pipeline that is submitted for remote execution.

## Next steps

See more troubleshooting articles for Azure Machine Learning:

* [Docker deployment troubleshooting with Azure Machine Learning](how-to-troubleshoot-deployment.md)
* [Debug machine learning pipelines](how-to-debug-pipelines.md)
* [Debug the ParallelRunStep class from the Azure Machine Learning SDK](how-to-debug-parallel-run-step.md)
* [Interactive debugging of a machine learning compute instance with VS Code](how-to-set-up-vs-code-remote.md)
* [Use Application Insights to debug machine learning pipelines](how-to-debug-pipelines-application-insights.md)
