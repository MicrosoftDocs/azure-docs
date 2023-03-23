---
title: Interact with your jobs (debug and monitor)
titleSuffix: Azure Machine Learning
description: Debug or monitor your Machine Learning job as it runs on Azure Machine Learning compute with your training application of choice. 
services: machine-learning
ms.author: shoja
author: shouryaj
ms.reviewer: ssalgado
ms.service: machine-learning
ms.subservice: automl
ms.topic: how-to
ms.custom: devplatv2, sdkv2, cliv2, event-tier1-build-2022, ignite-2022
ms.date: 03/15/2022
#Customer intent: I'm a data scientist with ML knowledge in the machine learning space, looking to build ML models using data in Azure Machine Learning with full control of the model training including debugging and monitoring of live jobs.
---

# Debug jobs and monitor training progress (preview)

> [!IMPORTANT]
> Items marked (preview) in this article are currently in public preview.
> The preview version is provided without a service level agreement, and it's not recommended for production workloads. Certain features might not be supported or might have constrained capabilities.
> For more information, see [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).

Machine learning model training is usually an iterative process and requires significant experimentation. With the Azure Machine Learning interactive job experience, data scientists can use the Azure Machine Learning Python SDKv2, Azure Machine Learning CLIv2 or the Azure Studio to access the container where their job is running.  Once the job container is accessed, users can iterate on training scripts, monitor training progress or debug the job remotely like they typically do on their local machines. Jobs can be interacted with via different training applications including **JupyterLab, TensorBoard, VS Code** or by connecting to the job container directly via **SSH**.  

Interactive training is supported on **Azure Machine Learning Compute Clusters** and **Azure Arc-enabled Kubernetes Cluster**.

## Prerequisites
- Review [getting started with training on Azure Machine Learning](./how-to-train-model.md).
- To use this feature in Azure Machine Learning studio, enable the "Debug & monitor your training jobs" flight via the [preview panel](./how-to-enable-preview-features.md#how-do-i-enable-preview-features).
- To use **VS Code**, [follow this guide](how-to-setup-vs-code.md) to set up the Azure Machine Learning extension.
- Make sure your job environment has the `openssh-server` and `ipykernel ~=6.0` packages installed (all Azure Machine Learning curated training environments have these packages installed by default).
- Interactive applications can't be enabled on distributed training runs where the distribution type is anything other than Pytorch, Tensorflow or MPI. Custom distributed training setup (configuring multi-node training without using the above distribution frameworks) is not currently supported.
- To use SSH, you need an SSH key pair. You can use the `ssh-keygen -f "<filepath>"` command to generate a public and private key pair.
   
## Interact with your job container

By specifying interactive applications at job creation, you can connect directly to the container on the compute node where your job is running. Once you have access to the job container, you can test or debug your job in the exact same environment where it would run. You can also use VS Code to attach to the running process and debug as you would locally. 

### Enable during job submission
# [Azure Machine Learning studio](#tab/ui)
1. Create a new job from the left navigation pane in the studio portal.


2. Choose `Compute cluster` or `Attached compute` (Kubernetes) as the compute type, choose the compute target, and specify how many nodes you need in `Instance count`. 
  
  :::image type="content" source="./media/interactive-jobs/select-compute.png" alt-text="Screenshot of selecting a compute location for a job.":::

3. Follow the wizard to choose the environment you want to start the job.
  

4. In `Job settings` step, add your training code (and input/output data) and reference it in your command to make sure it's mounted to your job.
  
  :::image type="content" source="./media/interactive-jobs/sleep-command.png" alt-text="Screenshot of reviewing a drafted job and completing the creation.":::

  You can put `sleep <specific time>` at the end of your command to specify the amount of time you want to reserve the compute resource. The format follows: 
  * sleep 1s
  * sleep 1m
  * sleep 1h
  * sleep 1d

  You can also use the ```sleep infinity``` command that would keep the job alive indefinitely. 
    
  > [!NOTE]
  > If you use `sleep infinity`, you will need to manually [cancel the job](./how-to-interactive-jobs.md#end-job) to let go of the compute resource (and stop billing). 

5. Select the training applications you want to use to interact with the job.

  :::image type="content" source="./media/interactive-jobs/select-training-apps.png" alt-text="Screenshot of selecting a training application for the user to use for a job.":::

6. Review and create the job.

If you don't see the above options, make sure you have enabled the "Debug & monitor your training jobs" flight via the [preview panel](./how-to-enable-preview-features.md#how-do-i-enable-preview-features).

# [Python SDK](#tab/python)
1. Define the interactive services you want to use for your job. Make sure to replace `your compute name` with your own value. If you want to use your own custom environment, follow the examples in [this tutorial](how-to-manage-environments-v2.md) to create a custom environment. 

   Note that you have to import the `JobService` class from the `azure.ai.ml.entities` package to configure interactive services via the SDKv2. 

   ```python
   command_job = command(...
       code="./src",  # local path where the code is stored
       command="python main.py", # you can add a command like "sleep 1h" to reserve the compute resource is reserved after the script finishes running
       environment="AzureML-tensorflow-2.7-ubuntu20.04-py38-cuda11-gpu@latest",
       compute="<name-of-compute>",
       services={
         "My_jupyterlab": JupyterLabJobService(
           nodes="all" # For distributed jobs, use the `nodes` property to pick which node you want to enable interactive services on. If `nodes` are not selected, by default, interactive applications are only enabled on the head node. Values are "all", or compute node index (for ex. "0", "1" etc.)
         ),
         "My_vscode": VsCodeJobService(
           nodes="all"
         ),
         "My_tensorboard": TensorBoardJobService(
           nodes="all",
           log_Dir="output/tblogs"  # relative path of Tensorboard logs (same as in your training script)         
         ),
         "My_ssh": SshJobService(
           ssh_Public_Keys="<add-public-key>",
           nodes="all"  
         ),
       }
   )
   
   # submit the command
   returned_job = ml_client.jobs.create_or_update(command_job)
   ```

   The `services` section specifies the training applications you want to interact with.  

   You can put `sleep <specific time>` at the end of your command to specify the amount of time you want to reserve the compute resource. The format follows: 
   * sleep 1s
   * sleep 1m
   * sleep 1h
   * sleep 1d

   You can also use the `sleep infinity` command that would keep the job alive indefinitely. 
   
   > [!NOTE]
   > If you use `sleep infinity`, you will need to manually [cancel the job](./how-to-interactive-jobs.md#end-job) to let go of the compute resource (and stop billing). 

2. Submit your training job. For more details on how to train with the Python SDKv2, check out this [article](./how-to-train-model.md).

# [Azure CLI](#tab/azurecli)

1. Create a job yaml `job.yaml` with below sample content. Make sure to replace `your compute name` with your own value. If you want to use custom environment, follow the examples in [this tutorial](how-to-manage-environments-v2.md) to create a custom environment. 
   ```dotnetcli
   code: src 
   command: 
     python train.py 
     # you can add a command like "sleep 1h" to reserve the compute resource is reserved after the script finishes running.
   environment: azureml:AzureML-tensorflow-2.4-ubuntu18.04-py37-cuda11-gpu:41
   compute: azureml:<your compute name>
   services:
       my_vs_code:
         job_service_type: vs_code
         nodes: all # For distributed jobs, use the `nodes` property to pick which node you want to enable interactive services on. If `nodes` are not selected, by default, interactive applications are only enabled on the head node. Values are "all", or compute node index (for ex. "0", "1" etc.)
       my_tensor_board:
        job_service_type: tensor_board
         log_dir: "output/tblogs" # relative path of Tensorboard logs (same as in your training script)
         nodes: all
       my_jupyter_lab:
         job_service_type: jupyter_lab
         nodes: all
       my_ssh:
         job_service_type: ssh
         ssh_public_keys: <paste the entire pub key content>
         nodes: all
   ```

   The `services` section specifies the training applications you want to interact with.  

   You can put `sleep <specific time>` at the end of the command to specify the amount of time you want to reserve the compute resource. The format follows: 
   * sleep 1s
   * sleep 1m
   * sleep 1h
   * sleep 1d

   You can also use the `sleep infinity` command that would keep the job alive indefinitely. 
 
   > [!NOTE]
   > If you use `sleep infinity`, you will need to manually [cancel the job](./how-to-interactive-jobs.md#end-job) to let go of the compute resource (and stop billing). 

2. Run command `az ml job create --file <path to your job yaml file> --workspace-name <your workspace name> --resource-group <your resource group name> --subscription <sub-id> `to submit your training job. For more details on running a job via CLIv2, check out this [article](./how-to-train-model.md). 

---
### Connect to endpoints
# [Azure Machine Learning studio](#tab/ui)
To interact with your running job, click the button **Debug and monitor** on the job details page. 

:::image type="content" source="media/interactive-jobs/debug-and-monitor.png" alt-text="Screenshot of interactive jobs debug and monitor panel location.":::


Clicking the applications in the panel opens a new tab for the applications. You can access the applications only when they are in **Running** status and only the **job owner** is authorized to access the applications. If you're training on multiple nodes, you can pick the specific node you would like to interact with.

:::image type="content" source="media/interactive-jobs/interactive-jobs-application-list.png" alt-text="Screenshot of interactive jobs right panel information. Information content will vary depending on the user's data.":::

It might take a few minutes to start the job and the training applications specified during job creation. If you don't see the above options, make sure you have enabled the "Debug & monitor your training jobs" flight via the [preview panel](./how-to-enable-preview-features.md#how-do-i-enable-preview-features).

# [Python SDK](#tab/python)
- Once the job is submitted, you can use `ml_client.jobs.show_services("<job name>", <compute node index>)` to view the interactive service endpoints.
    
- To connect via SSH to the container where the job is running, run the command `az ml job connect-ssh --name <job-name> --node-index <compute node index> --private-key-file-path <path to private key>`. To set up the Azure Machine Learning CLIv2, follow this [guide](./how-to-configure-cli.md). 
  
You can find the reference documentation for the SDKv2 [here](./index.yml).

You can access the applications only when they are in **Running** status and only the **job owner** is authorized to access the applications. If you're training on multiple nodes, you can pick the specific node you would like to interact with by passing in the node index.

# [Azure CLI](#tab/azurecli)
- When the job is **running**, Run the command `az ml job show-services --name <job name> --node-index <compute node index>` to get the URL to the applications. The endpoint URL will show under `services` in the output. Note that for VS Code, you must copy and paste the provided URL in your browser. 

- To connect via SSH to the container where the job is running, run the command `az ml job connect-ssh --name <job-name> --node-index <compute node index> --private-key-file-path <path to private key>`. 

You can find the reference documentation for these commands [here](/cli/azure/ml).

You can access the applications only when they are in **Running** status and only the **job owner** is authorized to access the applications. If you're training on multiple nodes, you can pick the specific node you would like to interact with by passing in the node index.

---
### Interact with the applications
When you click on the endpoints to interact when your job, you're taken to the user container under your working directory, where you can access your code, inputs, outputs, and logs. If you run into any issues while connecting to the applications, the interactive capability and applications logs can be found from **system_logs->interactive_capability** under **Outputs + logs** tab.

:::image type="content" source="./media/interactive-jobs/interactive-logs.png" alt-text="Screenshot of interactive jobs interactive logs panel location.":::

- You can open a terminal from Jupyter Lab and start interacting within the job container. You can also directly iterate on your training script with Jupyter Lab. 

  :::image type="content" source="./media/interactive-jobs/jupyter-lab.png" alt-text="Screenshot of interactive jobs Jupyter lab content panel.":::

- You can also interact with the job container within VS Code. To attach a debugger to a job during job submission and pause execution, [navigate here](./how-to-interactive-jobs.md#attach-a-debugger-to-a-job).

  :::image type="content" source="./media/interactive-jobs/vs-code-open.png" alt-text="Screenshot of interactive jobs VS Code panel when first opened. This shows the sample python file that was created to print two lines.":::

- If you have logged tensorflow events for your job, you can use TensorBoard to monitor the metrics when your job is running.

  :::image type="content" source="./media/interactive-jobs/tensorboard-open.png" alt-text="Screenshot of interactive jobs tensorboard panel when first opened. This information will vary depending upon customer data":::
  
If you don't see the above options, make sure you have enabled the "Debug & monitor your training jobs" flight via the [preview panel](./how-to-enable-preview-features.md#how-do-i-enable-preview-features).

### End job
Once you're done with the interactive training, you can also go to the job details page to cancel the job which will release the compute resource. Alternatively, use `az ml job cancel -n <your job name>` in the CLI or `ml_client.job.cancel("<job name>")` in the SDK. 

:::image type="content" source="./media/interactive-jobs/cancel-job.png" alt-text="Screenshot of interactive jobs cancel job option and its location for user selection":::

## Attach a debugger to a job
To submit a job with a debugger attached and the execution paused, you can use debugpy and VS Code (`debugpy` must be installed in your job environment). 

1. During job submission (either through the UI, the CLIv2 or the SDKv2) use the debugpy command to run your python script. For example, the below screenshot shows a sample command that uses debugpy to attach the debugger for a tensorflow script (`tfevents.py` can be replaced with the name of your training script).
   
:::image type="content" source="./media/interactive-jobs/use-debugpy.png" alt-text="Screenshot of interactive jobs configuration of debugpy":::

2. Once the job has been submitted, [connect to the VS Code](./how-to-interactive-jobs.md#connect-to-endpoints), and click on the in-built debugger.
   
   :::image type="content" source="./media/interactive-jobs/open-debugger.png" alt-text="Screenshot of interactive jobs location of open debugger on the left side panel":::

3. Use the "Remote Attach" debug configuration to attach to the submitted job and pass in the path and port you configured in your job submission command. You can also find this information on the job details page.
   
   :::image type="content" source="./media/interactive-jobs/debug-path-and-port.png" alt-text="Screenshot of interactive jobs completed jobs":::

   :::image type="content" source="./media/interactive-jobs/remote-attach.png" alt-text="Screenshot of interactive jobs add a remote attach button":::

4. Set breakpoints and walk through your job execution as you would in your local debugging workflow. 
   
    :::image type="content" source="./media/interactive-jobs/set-breakpoints.png" alt-text="Screenshot of location of an example breakpoint that is set in the Visual Studio Code editor":::


> [!NOTE]
> If you use debugpy to start your job, your job will **not** execute unless you attach the debugger in VS Code and execute the script. If this is not done, the compute will be reserved until the job is [cancelled](./how-to-interactive-jobs.md#end-job).

## Next steps

+ Learn more about [how and where to deploy a model](./how-to-deploy-online-endpoints.md).
