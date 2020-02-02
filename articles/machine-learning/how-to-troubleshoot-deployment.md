---
title: Deployment troubleshooting guide
titleSuffix: Azure Machine Learning
description: Learn how to work around, solve, and troubleshoot the common Docker deployment errors with Azure Kubernetes Service and Azure Container Instances using  Azure Machine Learning.
services: machine-learning
ms.service: machine-learning
ms.subservice: core
ms.topic: conceptual
author: clauren42
ms.author:  clauren
ms.reviewer: jmartens
ms.date: 10/25/2019
ms.custom: seodec18
---

# Troubleshooting Azure Machine Learning Azure Kubernetes Service and Azure Container Instances deployment

Learn how to work around or solve common Docker deployment errors with Azure Container Instances (ACI) and Azure Kubernetes Service (AKS) using Azure Machine Learning.

When deploying a model in Azure Machine Learning, the system performs a number of tasks.

The recommended and the most up to date approach for model deployment is via the [Model.deploy()](https://docs.microsoft.com/python/api/azureml-core/azureml.core.model%28class%29?view=azure-ml-py#deploy-workspace--name--models--inference-config-none--deployment-config-none--deployment-target-none--overwrite-false-) API using an [Environment](https://docs.microsoft.com/azure/machine-learning/service/how-to-use-environments) object as an input parameter. In this case our service will create a base docker image for you during deployment stage and mount the required models all in one call. The basic deployment tasks are:

1. Register the model in the workspace model registry.

2. Define Inference Configuration:
    1. Create an [Environment](https://docs.microsoft.com/azure/machine-learning/service/how-to-use-environments) object based on the dependencies you specify in the environment yaml file or use one of our procured environments.
    2. Create an inference configuration (InferenceConfig object) based on the environment and the scoring script.

3. Deploy the model to Azure Container Instance (ACI) service or to Azure Kubernetes Service (AKS).

Learn more about this process in the [Model Management](concept-model-management-and-deployment.md) introduction.

## Prerequisites

* An **Azure subscription**. If you do not have one, try the [free or paid version of Azure Machine Learning](https://aka.ms/AMLFree).
* The [Azure Machine Learning SDK](https://docs.microsoft.com/python/api/overview/azure/ml/install?view=azure-ml-py).
* The [Azure CLI](https://docs.microsoft.com/cli/azure/install-azure-cli?view=azure-cli-latest).
* The [CLI extension for Azure Machine Learning](reference-azure-machine-learning-cli.md).
* To debug locally, you must have a working Docker installation on your local system.

    To verify your Docker installation, use the command `docker run hello-world` from a terminal or command prompt. For information on installing Docker, or troubleshooting Docker errors, see the [Docker Documentation](https://docs.docker.com/).

## Before you begin

If you run into any issue, the first thing to do is to break down the deployment task (previous described) into individual steps to isolate the problem.

Assuming you are using the new/recommended deployment method via [Model.deploy()](https://docs.microsoft.com/python/api/azureml-core/azureml.core.model%28class%29?view=azure-ml-py#deploy-workspace--name--models--inference-config-none--deployment-config-none--deployment-target-none--overwrite-false-) API with an [Environment](https://docs.microsoft.com/azure/machine-learning/service/how-to-use-environments) object as an input parameter, your code can be broken down into three major steps:

1. Register the model. Here is some sample code:

    ```python
    from azureml.core.model import Model


    # register a model out of a run record
    model = best_run.register_model(model_name='my_best_model', model_path='outputs/my_model.pkl')

    # or, you can register a file or a folder of files as a model
    model = Model.register(model_path='my_model.pkl', model_name='my_best_model', workspace=ws)
    ```

2. Define inference configuration for deployment:

    ```python
    from azureml.core.model import InferenceConfig
    from azureml.core.environment import Environment


    # create inference configuration based on the requirements defined in the YAML
    myenv = Environment.from_conda_specification(name="myenv", file_path="myenv.yml")
    inference_config = InferenceConfig(entry_script="score.py", environment=myenv)
    ```

3. Deploy the model using the inference configuration created in the previous step:

    ```python
    from azureml.core.webservice import AciWebservice


    # deploy the model
    aci_config = AciWebservice.deploy_configuration(cpu_cores=1, memory_gb=1)
    aci_service = Model.deploy(workspace=ws,
                           name='my-service',
                           models=[model],
                           inference_config=inference_config,
                           deployment_config=aci_config)
    aci_service.wait_for_deployment(show_output=True)
    ```

Once you have broken down the deployment process into individual tasks, we can look at some of the most common errors.

## Debug locally

If you encounter problems deploying a model to ACI or AKS, try deploying it as a local web service. Using a local web service makes it easier to troubleshoot problems. The Docker image containing the model is downloaded and started on your local system.

> [!WARNING]
> Local web service deployments are not supported for production scenarios.

To deploy locally, modify your code to use `LocalWebservice.deploy_configuration()` to create a deployment configuration. Then use `Model.deploy()` to deploy the service. The following example deploys a model (contained in the model variable) as a local web service:

```python
from azureml.core.environment import Environment
from azureml.core.model import InferenceConfig, Model
from azureml.core.webservice import LocalWebservice


# Create inference configuration based on the environment definition and the entry script
myenv = Environment.from_conda_specification(name="env", file_path="myenv.yml")
inference_config = InferenceConfig(entry_script="score.py", environment=myenv)
# Create a local deployment, using port 8890 for the web service endpoint
deployment_config = LocalWebservice.deploy_configuration(port=8890)
# Deploy the service
service = Model.deploy(
    ws, "mymodel", [model], inference_config, deployment_config)
# Wait for the deployment to complete
service.wait_for_deployment(True)
# Display the port that the web service is available on
print(service.port)
```

Please note that if you are defining your own conda specification YAML, you must list azureml-defaults with version >= 1.0.45 as a pip dependency. This package contains the functionality needed to host the model as a web service.

At this point, you can work with the service as normal. For example, the following code demonstrates sending data to the service:

```python
import json

test_sample = json.dumps({'data': [
    [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
    [10, 9, 8, 7, 6, 5, 4, 3, 2, 1]
]})

test_sample = bytes(test_sample, encoding='utf8')

prediction = service.run(input_data=test_sample)
print(prediction)
```

For more information on customizing your Python environment, see [Create and manage environments for training and deployment](how-to-use-environments.md). 

### Update the service

During local testing, you may need to update the `score.py` file to add logging or attempt to resolve any problems that you've discovered. To reload changes to the `score.py` file, use `reload()`. For example, the following code reloads the script for the service, and then sends data to it. The data is scored using the updated `score.py` file:

> [!IMPORTANT]
> The `reload` method is only available for local deployments. For information on updating a deployment to another compute target, see the update section of [Deploy models](how-to-deploy-and-where.md#update).

```python
service.reload()
print(service.run(input_data=test_sample))
```

> [!NOTE]
> The script is reloaded from the location specified by the `InferenceConfig` object used by the service.

To change the model, Conda dependencies, or deployment configuration, use [update()](https://docs.microsoft.com/python/api/azureml-core/azureml.core.webservice%28class%29?view=azure-ml-py#update--args-). The following example updates the model used by the service:

```python
service.update([different_model], inference_config, deployment_config)
```

### Delete the service

To delete the service, use [delete()](https://docs.microsoft.com/python/api/azureml-core/azureml.core.webservice%28class%29?view=azure-ml-py#delete--).

### <a id="dockerlog"></a> Inspect the Docker log

You can print out detailed Docker engine log messages from the service object. You can view the log for ACI, AKS, and Local deployments. The following example demonstrates how to print the logs.

```python
# if you already have the service object handy
print(service.get_logs())

# if you only know the name of the service (note there might be multiple services with the same name but different version number)
print(ws.webservices['mysvc'].get_logs())
```

## Service launch fails

After the image is successfully built, the system attempts to start a container using your deployment configuration. As part of container starting-up process, the `init()` function in your scoring script is invoked by the system. If there are uncaught exceptions in the `init()` function, you might see **CrashLoopBackOff** error in the error message.

Use the info in the [Inspect the Docker log](#dockerlog) section to check the logs.

## Function fails: get_model_path()

Often, in the `init()` function in the scoring script, [Model.get_model_path()](https://docs.microsoft.com/python/api/azureml-core/azureml.core.model.model?view=azure-ml-py#get-model-path-model-name--version-none---workspace-none-) function is called to locate a model file or a folder of model files in the container. If the model file or folder cannot be found, the function fails. The easiest way to debug this error is to run the below Python code in the Container shell:

```python
from azureml.core.model import Model
import logging
logging.basicConfig(level=logging.DEBUG)
print(Model.get_model_path(model_name='my-best-model'))
```

This example prints out the local path (relative to `/var/azureml-app`) in the container where your scoring script is expecting to find the model file or folder. Then you can verify if the file or folder is indeed where it is expected to be.

Setting the logging level to DEBUG may cause additional information to be logged, which may be useful in identifying the failure.

## Function fails: run(input_data)

If the service is successfully deployed, but it crashes when you post data to the scoring endpoint, you can add error catching statement in your `run(input_data)` function so that it returns detailed error message instead. For example:

```python
def run(input_data):
    try:
        data = json.loads(input_data)['data']
        data = np.array(data)
        result = model.predict(data)
        return json.dumps({"result": result.tolist()})
    except Exception as e:
        result = str(e)
        # return error message back to the client
        return json.dumps({"error": result})
```

**Note**: Returning error messages from the `run(input_data)` call should be done for debugging purpose only. For security reasons, you should not return error messages this way in a production environment.

## HTTP status code 503

Azure Kubernetes Service deployments support autoscaling, which allows replicas to be added to support additional load. However, the autoscaler is designed to handle **gradual** changes in load. If you receive large spikes in requests per second, clients may receive an HTTP status code 503.

There are two things that can help prevent 503 status codes:

* Change the utilization level at which autoscaling creates new replicas.
    
    By default, autoscaling target utilization is set to 70%, which means that the service can handle spikes in requests per second (RPS) of up to 30%. You can adjust the utilization target by setting the `autoscale_target_utilization` to a lower value.

    > [!IMPORTANT]
    > This change does not cause replicas to be created *faster*. Instead, they are created at a lower utilization threshold. Instead of waiting until the service is 70% utilized, changing the value to 30% causes replicas to be created when 30% utilization occurs.
    
    If the web service is already using the current max replicas and you are still seeing 503 status codes, increase the `autoscale_max_replicas` value to increase the maximum number of replicas.

* Change the minimum number of replicas. Increasing the minimum replicas provides a larger pool to handle the incoming spikes.

    To increase the minimum number of replicas, set `autoscale_min_replicas` to a higher value. You can calculate the required replicas by using the following code, replacing values with values specific to your project:

    ```python
    from math import ceil
    # target requests per second
    targetRps = 20
    # time to process the request (in seconds)
    reqTime = 10
    # Maximum requests per container
    maxReqPerContainer = 1
    # target_utilization. 70% in this example
    targetUtilization = .7

    concurrentRequests = targetRps * reqTime / targetUtilization

    # Number of container replicas
    replicas = ceil(concurrentRequests / maxReqPerContainer)
    ```

    > [!NOTE]
    > If you receive request spikes larger than the new minimum replicas can handle, you may receive 503s again. For example, as traffic to your service increases, you may need to increase the minimum replicas.

For more information on setting `autoscale_target_utilization`, `autoscale_max_replicas`, and `autoscale_min_replicas` for, see the [AksWebservice](https://docs.microsoft.com/python/api/azureml-core/azureml.core.webservice.akswebservice?view=azure-ml-py) module reference.

## Advanced debugging

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

## Next steps

Learn more about deployment:

* [How to deploy and where](how-to-deploy-and-where.md)
* [Tutorial: Train & deploy models](tutorial-train-models-with-aml.md)
