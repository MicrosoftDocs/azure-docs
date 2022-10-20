---
title: Interact with your jobs (debug & monitor)
titleSuffix: Azure Machine Learning
description: Debug or montior your Machine Learning job as it runs on AzureML compute with your training application of choice. 
services: machine-learning
ms.author: shoja
author: shouryaj
ms.reviewer: ssalgadodev
ms.service: machine-learning
ms.subservice: automl
ms.topic: how-to
ms.custom: devplatv2, sdkv2, cliv2, event-tier1-build-2022, ignite-2022
ms.date: 03/15/2022
#Customer intent: I'm a data scientist with ML knowledge in the machine learning space, looking to build ML models using data in Azure Machine Learning with full control of the model training including debugging and monitoring of live jobs.
---

## Overview
Machine learning model training is usually an iterative process and requires significant experimentation. With the AzureML interactive job experience, data scientists can now use the AzureML Python SDKv2, AzureML CLIv2 or AzureML Studio to quickly access the container where their job is running to iterate on training scripts, monitor training progress or debug the job remotely like they usually do on their local machines. This is possible to do via different training applications including **JupyterLab, TensorBoard, VS Code** or by connecting via SSH directly into the job container.  

Note that interactive training is supported on **AzureML Compute Cluster** and **Azure Arc-enabled Kubernetes Cluster**.

## Prerequisites
- [Get started with training on AzureML](./how-to-train-model.md) 
- To use **VS Code**, please open VS Code and install the [Azure Machine Learning](https://marketplace.visualstudio.com/items?itemName=ms-toolsai.vscode-ai) and [Azure Machine Learning - Remote](https://marketplace.visualstudio.com/items?itemName=ms-toolsai.vscode-ai-remote) extensions. 
- Make sure your job environment has the `openssh-server` and `ipykernel ~=6.0` packages installed
- Interactive jobs cannot be used in conjuction with the below AzureML features
  1. VMs with windows images // TODO add links out to docs for these 
  2. Parallel Run Step
  3. Multi-Node MPI
  4. Custom Multi Nodes

## Get started
### Submit an interactive job via AzureML studio portal
1. Create a new job from the left navigation pane in the studio portal.
![screenshot select-job-ui](./media/selectjob.png) // TODO Update screenshot
1. Choose `Compute cluster` or `Attached compute` (Kubernetes) as the compute type, choose the compute target, and specify how many nodes you need in `Instance count`. 
![screenshot select-compute-ui](./media/selectcompute.png) // TODO Update screenshot
1. Follow the wizard to choose the environment you want to start the job.
1. In `Job settings` step, add your training code (and input/output data) and reference it in your command to make sure it's mounted to your job. **You can end your command with `sleep <specific time>` to pause the job and reserve the compute.** An example is like below:
![screenshot set-command](./media/setcommand.png) // TODO Update screenshot
1. Select the training applications you want to interact with in the job.
![screenshot select-apps](./media/selectapps.png) // TODO Update screenshot
1. Review and create the job.

### Submit an interactive job via the AzureML SDKv2
1. Define the interactive services you want to use for your job. Make sure to replace `your compute name` with your own value. If you want to use custom environment, follow the examples in [this tutorial](https://docs.microsoft.com/azure/machine-learning/how-to-manage-environments-v2) to create a custom environment. 
  ```python
  # NEED TO LINK OUT TO SAMPLES REPO INSTEAD OF HARD CODING
  command_job = command(...
      code="./src",  # local path where the code is stored
      command="python main.py", # you can add a command like "sleep 1h" to reserve the compute resource is reserved after the script finishes running
      environment="AzureML-tensorflow-2.7-ubuntu20.04-py38-cuda11-gpu@latest",
      compute="<name-of-compute>",
      services={
        "My_jupyterlab": JobService(
          job_service_type = "JupyterLab"
        ),
        "My_vscode": JobService(
          job_service_type = "VSCode"
        ),
        "My_tensorboard": JobService(
          job_service_type = "Tensorboard"
          logs = "~/logs" # location of Tensorboard logs # TODO VERIFY SYNTAX
        ),
        "My_ssh": JobService(
          job_service_type = "SSH",
          sshPublicKeys = "<add-public-key>" # TODO VERIFY SYNTAX
        ),
      }
  )

  # submit the command
  returned_job = ml_client.jobs.create_or_update(command_job)
  ```
  The `services=` section specifies the training applications you want to interact with.  

  Note that you can put `sleep <specific time>` at the end of your command to speicify the amount of time you want to reserve the compute resource. The format follows: 
  * sleep 1s
  * sleep 1m
  * sleep 1h
  * sleep 1d

  You can also use the `sleep infinity` command. However, note that if you use `sleep infinity`, you will need to cancel the job to let go of the compute resource (and stop billing).

2. Run above Python code. For more details on how to train with the Python SDKv2, check out this [article](./how-to-train-model.md).

### Submit an interactive job via the AzureML CLI v2
1. Create a job yaml `job.yaml` with below sample content. Make sure to replace `your compute name` with your own value. If you want to use custom environment, follow the examples in [this tutorial](https://docs.microsoft.com/azure/machine-learning/how-to-manage-environments-v2) to create a custom environment. 
  ```dotnetcli
  # NEED TO LINK OUT TO SAMPLES REPO INSTEAD OF HARD CODING
  code: src 
  command: 
    python train.py 
    # you can add a command like "sleep 1h" to reserve the compute resource is reserved after the script finishes running.
  environment: azureml:AzureML-tensorflow-2.4-ubuntu18.04-py37-cuda11-gpu:41
  compute: azureml:<your compute name>
  services:
      my_vs_code:
        job_service_type: VSCode
      my_tensor_board:
        job_service_type: TensorBoard
        properties:
          logDir: "~/logs" # location of Tensorboard logs
      my_jupyter_lab:
        job_service_type: JupyterLab
      my_ssh:
       job_service_type: SSH
       properties:
         sshPublicKeys: <paste the entire pub key content>
  ```
  The `services` section specifies the training applications you want to interact with.  

  Note that you can put `sleep <specific time>` at the end of the command to speicify the amount of time you want to reserve the compute resource. The format follows: 
  * sleep 1s
  * sleep 1m
  * sleep 1h
  * sleep 1d

  You can also use the `sleep infinity` command. However, note that if you use `sleep infinity`, you will need to cancel the job to let go of the compute resource (and stop billing).

2. Run command `az ml job create --file <path to your job yaml file> --workspace-name <your workspace name> --resource-group <your resource group name> --subscription <sub-id> `. For more details on running a job via CLIv2, check out this [article](./how-to-train-model.md). 


### Connect to endpoints
It might take a few minutes to start the job and applications specified. After the job is submitted and in **Running** state, you can connect to the applications by finding them from the job details page on the studio portal or directly from the CLI/SDK.

#### Connect via AzureML studio portal
1. You can connect to the applications by clicking the button **Debug and monitor** in the job details page. 
![screenshot connect-to-apps](./media/accessbutton.png) // TODO Update screenshot

Clicking the applications in the panel opens a new tab for the applications. Please note that you can access the applications only when the applications is in **Running** status and only the **job owner** is authorized to access the applications.
![screenshot apps-panel](./media/appspanel.png) // TODO Update screenshot

#### Connect via AzureML Python SDKv2
1. Printing the returned job will show you the different endpoint links you can click out to.
// TODO -- add screenshot

#### Connect via AzureML CLI v2
When the job is **running**, Run the command `az ml job show <your job name>` to get the URL to the applications. The endpoint URL will show under `services` in the output. Here is an example:
![screenshot show-services-cli](./media/servicescli.png)

### Interact with the applications
When you click on the endpoints to interact when your job, you are taken to the user container under your working directory, where you can access your code, inputs, outputs, and logs. If you run into any issues while connecting to the applications, the interactive capability and applications logs can be found from **system_logs->interactive_capability** under **Outputs + logs** tab.
![screenshot check-logs](./media/ijlogs.png)

1. You can open a terminal from Jupyter Lab and start interacting within the job container. You can also directly iterate your training script with Jupyter Lab. 
![screenshot jupyterlab](./media/jupyterlab.png)
1. 1. If you have opened VS code, you will see... // TO DO finish statement and add screenshot
1. If you have logged tensorflow events for your job, you can use TensorBoard to monitor the metrics when your job is running.


### End the interactive job
1. Once you are done with the interactive training, you can also go to the job details page to cancel the job. This will release the compute resource. Alternatively, use `az ml job cancel -n <your job name>` in the CLI. 
![screenshot cancel-job](./media/canceljob.png)

## Next steps

+ Learn more about [how and where to deploy a model](./how-to-deploy-managed-online-endpoints.md).
