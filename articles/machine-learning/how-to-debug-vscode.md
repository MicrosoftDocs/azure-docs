---
title: Interactive debugging with Visual Studio Code
titleSuffix: Azure Machine Learning
description: Interactively debug Azure Machine Learning code, pipelines and deployments using Visual Studio Code
services: machine-learning
ms.service: machine-learning
ms.subservice: core
ms.topic: troubleshooting
author: luisquintanilla
ms.author: luquinta
ms.date: 06/11/2020
---

# Interactive debugging with Visual Studio Code

[!INCLUDE [applies-to-skus](../../includes/aml-applies-to-basic-enterprise-sku.md)]

Learn how to interactively debug Azure Machine Learning code, pipelines and deployments using Visual Studio Code

## Edit and debug code on a remote compute instance

Connecting VS Code to a remote compute instance, allows you to perform tasks like editing and debugging just like you would normally do locally.

> [!NOTE]
> On Windows, consider using the [Windows Subsystem for Linux](https://docs.microsoft.com/windows/wsl/install-win10) for SSH operations

### Get IP and SSH port

1. Go to the Azure Machine Learning studio at https://ml.azure.com/.
1. Select your [workspace](concept-workspace.md).
1. Click the **Compute Instances** tab.
1. In the **Application URI** column, click the **SSH** link of the compute instance you want to use as a remote compute. 
1. In the dialog, take note of the IP Address and SSH port. 
1. Save your private key to the ~/.ssh/ directory on your local computer; for instance, open an editor for a new file and paste the key in: 

   **Linux**: 
   ```sh
   vi ~/.ssh/id_azmlcitest_rsa  
   ```

   **Windows**: 
   ```
   notepad C:\Users\<username>\.ssh\id_azmlcitest_rsa 
   ```

   The private key will look somewhat like this:
   ```
   -----BEGIN RSA PRIVATE KEY----- 

   MIIEpAIBAAKCAQEAr99EPm0P4CaTPT2KtBt+kpN3rmsNNE5dS0vmGWxIXq4vAWXD 
   ..... 
   ewMtLnDgXWYJo0IyQ91ynOdxbFoVOuuGNdDoBykUZPQfeHDONy2Raw== 

   -----END RSA PRIVATE KEY----- 
   ```

1. Change permissions on file to make sure only you can read the file.  
   ```sh
   chmod 600 ~/.ssh/id_azmlcitest_rsa   
   ```

### Add instance as a host

Open the file `~/.ssh/config` (Linux) or `C:\Users<username>.ssh\config` (Windows) in an editor and add a new entry similar to this:

```
Host azmlci1 

    HostName 13.69.56.51 

    Port 50000 

    User azureuser 

    IdentityFile ~/.ssh/id_azmlcitest_rsa   
```

Here some details on the fields: 

|Field|Description|
|----|---------|
|Host|Use whatever shorthand you like for the compute instance |
|HostName|This is the IP address of the compute instance |
|Port|This is the port shown on the SSH dialog above |
|User|This needs to be `azureuser` |
|IdentityFile|Should point to the file where you saved the private key |

Now, you should be able to ssh to your compute instance using the shorthand you used above, `ssh azmlci1`. 

### Connect VS Code to the instance

1. [Install Visual Studio Code](https://code.visualstudio.com/).

1. [Install the Remote SSH Extension](https://marketplace.visualstudio.com/items?itemName=ms-vscode-remote.remote-ssh). 

1. Click the Remote-SSH icon on the left to show your SSH configurations.

1. Right-click the SSH host configuration you just created.

1. Select **Connect to Host in Current Window**. 

From here on, you are entirely working on the compute instance and you can now edit, debug, use git, use extensions, etc. -- just like you can with your local Visual Studio Code. 

## Debug and troubleshoot machine learning pipelines

In some cases, you may need to interactively debug the Python code used in your ML pipeline. By using Visual Studio Code (VS Code) and the Python Tools for Visual Studio (PTVSD), you can attach to the code as it runs in the training environment. 

### Prerequisites

* An __Azure Machine Learning workspace__ that is configured to use an __Azure Virtual Network__.
* An __Azure Machine Learning pipeline__ that uses Python scripts as part of the pipeline steps. For example, a PythonScriptStep.
* An Azure Machine Learning Compute cluster, which is __in the virtual network__ and is __used by the pipeline for training__.
* A __development environment__ that is __in the virtual network__. The development environment might be one of the following:

    * An Azure Virtual Machine in the virtual network
    * A Compute instance of Notebook VM in the virtual network
    * A client machine connected to the virtual network by a virtual private network (VPN).

For more information on using an Azure Virtual Network with Azure Machine Learning, see [Secure Azure ML experimentation and inference jobs within an Azure Virtual Network](how-to-enable-virtual-network.md).

### How it works

Your ML pipeline steps run Python scripts. These scripts are modified to perform the following actions:
    
1. Log the IP address of the host that they are running on. You use the IP address to connect the debugger to the script.

2. Start the PTVSD debug component, and wait for a debugger to connect.

3. From your development environment, you monitor the logs created by the training process to find the IP address where the script is running.

4. You tell VS Code the IP address to connect the debugger to by using a `launch.json` file.

5. You attach the debugger and interactively step through the script.

### Configure Python scripts

To enable debugging, make the following changes to the Python script(s) used by steps in your ML pipeline:

1. Add the following import statements:

    ```python
    import ptvsd
    import socket
    from azureml.core import Run
    ```

1. Add the following arguments. These arguments allow you to enable the debugger as needed, and set the timeout for attaching the debugger:

    ```python
    parser.add_argument('--remote_debug', action='store_true')
    parser.add_argument('--remote_debug_connection_timeout', type=int,
                    default=300,
                    help=f'Defines how much time the Azure ML compute target '
                    f'will await a connection from a debugger client (VSCODE).')
    ```

1. Add the following statements. These statements load the current run context so that you can log the IP address of the node that the code is running on:

    ```python
    global run
    run = Run.get_context()
    ```

1. Add an `if` statement that starts PTVSD and waits for a debugger to attach. If no debugger attaches before the timeout, the script continues as normal.

    ```python
    if args.remote_debug:
        print(f'Timeout for debug connection: {args.remote_debug_connection_timeout}')
        # Log the IP and port
        ip = socket.gethostbyname(socket.gethostname())
        print(f'ip_address: {ip}')
        ptvsd.enable_attach(address=('0.0.0.0', 5678),
                            redirect_output=True)
        # Wait for the timeout for debugger to attach
        ptvsd.wait_for_attach(timeout=args.remote_debug_connection_timeout)
        print(f'Debugger attached = {ptvsd.is_attached()}')
    ```

The following Python example shows a basic `train.py` file that enables debugging:

```python
# Copyright (c) Microsoft. All rights reserved.
# Licensed under the MIT license.

import argparse
import os
import ptvsd
import socket
from azureml.core import Run

print("In train.py")
print("As a data scientist, this is where I use my training code.")

parser = argparse.ArgumentParser("train")

parser.add_argument("--input_data", type=str, help="input data")
parser.add_argument("--output_train", type=str, help="output_train directory")

# Argument check for remote debugging
parser.add_argument('--remote_debug', action='store_true')
parser.add_argument('--remote_debug_connection_timeout', type=int,
                    default=300,
                    help=f'Defines how much time the AML compute target '
                    f'will await a connection from a debugger client (VSCODE).')
# Get run object, so we can find and log the IP of the host instance
global run
run = Run.get_context()

args = parser.parse_args()

# Start debugger if remote_debug is enabled
if args.remote_debug:
    print(f'Timeout for debug connection: {args.remote_debug_connection_timeout}')
    # Log the IP and port
    ip = socket.gethostbyname(socket.gethostname())
    print(f'ip_address: {ip}')
    ptvsd.enable_attach(address=('0.0.0.0', 5678),
                        redirect_output=True)
    # Wait for the timeout for debugger to attach
    ptvsd.wait_for_attach(timeout=args.remote_debug_connection_timeout)
    print(f'Debugger attached = {ptvsd.is_attached()}')

print("Argument 1: %s" % args.input_data)
print("Argument 2: %s" % args.output_train)

if not (args.output_train is None):
    os.makedirs(args.output_train, exist_ok=True)
    print("%s created" % args.output_train)
```

### Configure ML pipeline

To provide the Python packages needed to start PTVSD and get the run context, create an environment
and set `pip_packages=['ptvsd', 'azureml-sdk==1.0.83']`. Change the SDK version to match the one you are using. The following code snippet demonstrates how to create an environment:

```python
# Use a RunConfiguration to specify some additional requirements for this step.
from azureml.core.runconfig import RunConfiguration
from azureml.core.conda_dependencies import CondaDependencies
from azureml.core.runconfig import DEFAULT_CPU_IMAGE

# create a new runconfig object
run_config = RunConfiguration()

# enable Docker 
run_config.environment.docker.enabled = True

# set Docker base image to the default CPU-based image
run_config.environment.docker.base_image = DEFAULT_CPU_IMAGE

# use conda_dependencies.yml to create a conda environment in the Docker image for execution
run_config.environment.python.user_managed_dependencies = False

# specify CondaDependencies obj
run_config.environment.python.conda_dependencies = CondaDependencies.create(conda_packages=['scikit-learn'],
                                                                           pip_packages=['ptvsd', 'azureml-sdk==1.0.83'])
```

In the [Configure Python scripts](#configure-python-scripts) section, two new arguments were added to the scripts used by your ML pipeline steps. The following code snippet demonstrates how to use these arguments to enable debugging for the component and set a timeout. It also demonstrates how to use the environment created earlier by setting `runconfig=run_config`:

```python
# Use RunConfig from a pipeline step
step1 = PythonScriptStep(name="train_step",
                         script_name="train.py",
                         arguments=['--remote_debug', '--remote_debug_connection_timeout', 300],
                         compute_target=aml_compute, 
                         source_directory=source_directory,
                         runconfig=run_config,
                         allow_reuse=False)
```

When the pipeline runs, each step creates a child run. If debugging is enabled, the modified script logs information similar to the following text in the `70_driver_log.txt` for the child run:

```text
Timeout for debug connection: 300
ip_address: 10.3.0.5
```

Save the `ip_address` value. It is used in the next section.

> [!TIP]
> You can also find the IP address from the run logs for the child run for this pipeline step. For more information on viewing this information, see [Monitor Azure ML experiment runs and metrics](how-to-track-experiments.md).

### Configure development environment

1. To install the Python Tools for Visual Studio (PTVSD) on your VS Code development environment, use the following command:

    ```
    python -m pip install --upgrade ptvsd
    ```

    For more information on using PTVSD with VS Code, see [Remote Debugging](https://code.visualstudio.com/docs/python/debugging#_remote-debugging).

1. To configure VS Code to communicate with the Azure Machine Learning compute that is running the debugger, create a new debug configuration:

    1. From VS Code, select the __Debug__ menu and then select __Open configurations__. A file named __launch.json__ opens.

    1. In the __launch.json__ file, find the line that contains `"configurations": [`, and insert the following text after it. Change the `"host": "10.3.0.5"` entry to the IP address returned in your logs from the previous section. Change the `"localRoot": "${workspaceFolder}/code/step"` entry to a local directory that contains a copy of the script being debugged:

        ```json
        {
            "name": "Azure Machine Learning Compute: remote debug",
            "type": "python",
            "request": "attach",
            "port": 5678,
            "host": "10.3.0.5",
            "redirectOutput": true,
            "pathMappings": [
                {
                    "localRoot": "${workspaceFolder}/code/step1",
                    "remoteRoot": "."
                }
            ]
        }
        ```

        > [!IMPORTANT]
        > If there are already other entries in the configurations section, add a comma (,) after the code that you inserted.

        > [!TIP]
        > The best practice is to keep the resources for scripts in separate directories, which is why the `localRoot` example value references `/code/step1`.
        >
        > If you are debugging multiple scripts, in different directories, create a separate configuration section for each script.

    1. Save the __launch.json__ file.

### Connect the debugger

1. Open VS Code and open a local copy of the script.
2. Set breakpoints where you want the script to stop once you've attached.
3. While the child process is running the script, and the `Timeout for debug connection` is displayed in the logs, use the F5 key or select __Debug__. When prompted, select the __Azure Machine Learning Compute: remote debug__ configuration. You can also select the debug icon from the side bar, the __Azure Machine Learning: remote debug__ entry from the Debug dropdown menu, and then use the green arrow to attach the debugger.

    At this point, VS Code connects to PTVSD on the compute node and stops at the breakpoint you set previously. You can now step through the code as it runs, view variables, etc.

    > [!NOTE]
    > If the log displays an entry stating `Debugger attached = False`, then the timeout has expired and the script continued without the debugger. Submit the pipeline again and connect the debugger after the `Timeout for debug connection` message, and before the timeout expires.

## Debug and troubleshoot deployments

In some cases, you may need to interactively debug the Python code contained in your model deployment. For example, if the entry script is failing and the reason cannot be determined by additional logging. By using Visual Studio Code and the Python Tools for Visual Studio (PTVSD), you can attach to the code running inside the Docker container.

> [!IMPORTANT]
> This method of debugging does not work when using `Model.deploy()` and `LocalWebservice.deploy_configuration` to deploy a model locally. Instead, you must create an image using the [Model.package()](https://docs.microsoft.com/python/api/azureml-core/azureml.core.model.model?view=azure-ml-py#package-workspace--models--inference-config-none--generate-dockerfile-false-) method.

Local web service deployments require a working Docker installation on your local system. For more information on using Docker, see the [Docker Documentation](https://docs.docker.com/).

### Configure development environment

1. To install the Python Tools for Visual Studio (PTVSD) on your local VS Code development environment, use the following command:

    ```
    python -m pip install --upgrade ptvsd
    ```

    For more information on using PTVSD with VS Code, see [Remote Debugging](https://code.visualstudio.com/docs/python/debugging#_remote-debugging).

1. To configure VS Code to communicate with the Docker image, create a new debug configuration:

    1. From VS Code, select the __Debug__ menu and then select __Open configurations__. A file named __launch.json__ opens.

    1. In the __launch.json__ file, find the line that contains `"configurations": [`, and insert the following text after it:

        ```json
        {
            "name": "Azure Machine Learning: Docker Debug",
            "type": "python",
            "request": "attach",
            "port": 5678,
            "host": "localhost",
            "pathMappings": [
                {
                    "localRoot": "${workspaceFolder}",
                    "remoteRoot": "/var/azureml-app"
                }
            ]
        }
        ```

        > [!IMPORTANT]
        > If there are already other entries in the configurations section, add a comma (,) after the code that you inserted.

        This section attaches to the Docker container using port 5678.

    1. Save the __launch.json__ file.

### Create an image that includes PTVSD

1. Modify the conda environment for your deployment so that it includes PTVSD. The following example demonstrates adding it using the `pip_packages` parameter:

    ```python
    from azureml.core.conda_dependencies import CondaDependencies 


    # Usually a good idea to choose specific version numbers
    # so training is made on same packages as scoring
    myenv = CondaDependencies.create(conda_packages=['numpy==1.15.4',            
                                'scikit-learn==0.19.1', 'pandas==0.23.4'],
                                 pip_packages = ['azureml-defaults==1.0.45', 'ptvsd'])

    with open("myenv.yml","w") as f:
        f.write(myenv.serialize_to_string())
    ```

1. To start PTVSD and wait for a connection when the service starts, add the following to the top of your `score.py` file:

    ```python
    import ptvsd
    # Allows other computers to attach to ptvsd on this IP address and port.
    ptvsd.enable_attach(address=('0.0.0.0', 5678), redirect_output = True)
    # Wait 30 seconds for a debugger to attach. If none attaches, the script continues as normal.
    ptvsd.wait_for_attach(timeout = 30)
    print("Debugger attached...")
    ```

1. Create an image based on the environment definition and pull the image to the local registry. During debugging, you may want to make changes to the files in the image without having to recreate it. To install a text editor (vim) in the Docker image, use the `Environment.docker.base_image` and `Environment.docker.base_dockerfile` properties:

    > [!NOTE]
    > This example assumes that `ws` points to your Azure Machine Learning workspace, and that `model` is the model being deployed. The `myenv.yml` file contains the conda dependencies created in step 1.

    ```python
    from azureml.core.conda_dependencies import CondaDependencies
    from azureml.core.model import InferenceConfig
    from azureml.core.environment import Environment


    myenv = Environment.from_conda_specification(name="env", file_path="myenv.yml")
    myenv.docker.base_image = None
    myenv.docker.base_dockerfile = "FROM mcr.microsoft.com/azureml/base:intelmpi2018.3-ubuntu16.04\nRUN apt-get update && apt-get install vim -y"
    inference_config = InferenceConfig(entry_script="score.py", environment=myenv)
    package = Model.package(ws, [model], inference_config)
    package.wait_for_creation(show_output=True)  # Or show_output=False to hide the Docker build logs.
    package.pull()
    ```

    Once the image has been created and downloaded, the image path (includes repository, name, and tag, which in this case is also its digest) is displayed in a message similar to the following:

    ```text
    Status: Downloaded newer image for myregistry.azurecr.io/package@sha256:<image-digest>
    ```

1. To make it easier to work with the image, use the following command to add a tag. Replace `myimagepath` with the location value from the previous step.

    ```bash
    docker tag myimagepath debug:1
    ```

    For the rest of the steps, you can refer to the local image as `debug:1` instead of the full image path value.

### Debug the service

> [!TIP]
> If you set a timeout for the PTVSD connection in the `score.py` file, you must connect VS Code to the debug session before the timeout expires. Start VS Code, open the local copy of `score.py`, set a breakpoint, and have it ready to go before using the steps in this section.
>
> For more information on debugging and setting breakpoints, see [Debugging](https://code.visualstudio.com/Docs/editor/debugging).

1. To start a Docker container using the image, use the following command:

    ```bash
    docker run --rm --name debug -p 8000:5001 -p 5678:5678 debug:1
    ```

1. To attach VS Code to PTVSD inside the container, open VS Code and use the F5 key or select __Debug__. When prompted, select the __Azure Machine Learning: Docker Debug__ configuration. You can also select the debug icon from the side bar, the __Azure Machine Learning: Docker Debug__ entry from the Debug dropdown menu, and then use the green arrow to attach the debugger.

    ![The debug icon, start debugging button, and configuration selector](./media/how-to-troubleshoot-deployment/start-debugging.png)

At this point, VS Code connects to PTVSD inside the Docker container and stops at the breakpoint you set previously. You can now step through the code as it runs, view variables, etc.

For more information on using VS Code to debug Python, see [Debug your Python code](https://docs.microsoft.com/visualstudio/python/debugging-python-in-visual-studio?view=vs-2019).

<a id="editfiles"></a>
### Modify the container files

To make changes to files in the image, you can attach to the running container, and execute a bash shell. From there, you can use vim to edit files:

1. To connect to the running container and launch a bash shell in the container, use the following command:

    ```bash
    docker exec -it debug /bin/bash
    ```

1. To find the files used by the service, use the following command from the bash shell in the container if the default directory is different than `/var/azureml-app`:

    ```bash
    cd /var/azureml-app
    ```

    From here, you can use vim to edit the `score.py` file. For more information on using vim, see [Using the Vim editor](https://www.tldp.org/LDP/intro-linux/html/sect_06_02.html).

1. Changes to a container are not normally persisted. To save any changes you make, use the following command, before you exit the shell started in the step above (that is, in another shell):

    ```bash
    docker commit debug debug:2
    ```

    This command creates a new image named `debug:2` that contains your edits.

    > [!TIP]
    > You will need to stop the current container and start using the new version before changes take effect.

1. Make sure to keep the changes you make to files in the container in sync with the local files that VS Code uses. Otherwise, the debugger experience will not work as expected.

### Stop the container

To stop the container, use the following command:

```bash
docker stop debug
```

## Next Steps

Now that you've set up Visual Studio Code Remote, you can use a compute instance as remote compute from Visual Studio Code to interactively debug your code. 

[Tutorial: Train your first ML model](tutorial-1st-experiment-sdk-train.md) shows how to use a compute instance with an integrated notebook.
