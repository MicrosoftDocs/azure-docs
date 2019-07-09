---
title: Deployment troubleshooting guide
titleSuffix: Azure Machine Learning service
description: Learn how to work around, solve, and troubleshoot the common Docker deployment errors with Azure Kubernetes Service and Azure Container Instances using  Azure Machine Learning service.
services: machine-learning
ms.service: machine-learning
ms.subservice: core
ms.topic: conceptual
author: chris-lauren
ms.author:  clauren
ms.reviewer: jmartens
ms.date: 07/09/2018
ms.custom: seodec18
---

# Troubleshooting Azure Machine Learning service Azure Kubernetes Service and Azure Container Instances deployment

Learn how to work around or solve common Docker deployment errors with Azure Container Instances (ACI) and Azure Kubernetes Service (AKS) using Azure Machine Learning service.

When deploying a model in Azure Machine Learning service, the system performs a number of tasks. The deployment tasks are:

1. Register the model in the workspace model registry.

2. Build a Docker image, including:
    1. Download the registered model from the registry. 
    2. Create a dockerfile, with a Python environment based on the dependencies you specify in the environment yaml file.
    3. Add your model files and the scoring script you supply in the dockerfile.
    4. Build a new Docker image using the dockerfile.
    5. Register the Docker image with the Azure Container Registry associated with the workspace.

    > [!IMPORTANT]
    > Depending on your code, image creation happen automatically without your input.

3. Deploy the Docker image to Azure Container Instance (ACI) service or to Azure Kubernetes Service (AKS).

4. Start up a new container (or containers) in ACI or AKS. 

Learn more about this process in the [Model Management](concept-model-management-and-deployment.md) introduction.

## Before you begin

If you run into any issue, the first thing to do is to break down the deployment task (previous described) into individual steps to isolate the problem.

Breaking the deployment into tasks is helpful if you are using the [Webservice.deploy()](https://docs.microsoft.com/python/api/azureml-core/azureml.core.webservice%28class%29?view=azure-ml-py#deploy-workspace--name--model-paths--image-config--deployment-config-none--deployment-target-none-) API, or [Webservice.deploy_from_model()](https://docs.microsoft.com/python/api/azureml-core/azureml.core.webservice%28class%29?view=azure-ml-py#deploy-from-model-workspace--name--models--image-config--deployment-config-none--deployment-target-none-) API, as both of these functions perform the aforementioned steps as a single action. Typically those APIs are convenient, but it helps to break up the steps when troubleshooting by replacing them with the below API calls.

1. Register the model. Here's some sample code:

    ```python
    # register a model out of a run record
    model = best_run.register_model(model_name='my_best_model', model_path='outputs/my_model.pkl')

    # or, you can register a file or a folder of files as a model
    model = Model.register(model_path='my_model.pkl', model_name='my_best_model', workspace=ws)
    ```

2. Build the image. Here's some sample code:

    ```python
    # configure the image
    image_config = ContainerImage.image_configuration(runtime="python",
                                                      entry_script="score.py",
                                                      conda_file="myenv.yml")

    # create the image
    image = Image.create(name='myimg', models=[model], image_config=image_config, workspace=ws)

    # wait for image creation to finish
    image.wait_for_creation(show_output=True)
    ```

3. Deploy the image as service. Here's some sample code:

    ```python
    # configure an ACI-based deployment
    aci_config = AciWebservice.deploy_configuration(cpu_cores=1, memory_gb=1)

    aci_service = Webservice.deploy_from_image(deployment_config=aci_config, 
                                               image=image, 
                                               name='mysvc', 
                                               workspace=ws)
    aci_service.wait_for_deployment(show_output=True)    
    ```

Once you have broken down the deployment process into individual tasks, we can look at some of the most common errors.

## Image building fails

If the Docker image cannot be built, the [image.wait_for_creation()](https://docs.microsoft.com/python/api/azureml-core/azureml.core.image.image(class)?view=azure-ml-py#wait-for-creation-show-output-false-) or [service.wait_for_deployment()](https://docs.microsoft.com/python/api/azureml-core/azureml.core.webservice(class)?view=azure-ml-py#wait-for-deployment-show-output-false-) call fails with some error messages that can offer some clues. You can also find out more details about the errors from the image build log. Below is some sample code showing how to discover the image build log uri.

```python
# if you already have the image object handy
print(image.image_build_log_uri)

# if you only know the name of the image (note there might be multiple images with the same name but different version number)
print(ws.images['myimg'].image_build_log_uri)

# list logs for all images in the workspace
for name, img in ws.images.items():
    print (img.name, img.version, img.image_build_log_uri)
```

The image log uri is a SAS URL pointing to a log file stored in your Azure blob storage. Simply copy and paste the uri into a browser window and you can download and view the log file.

### Azure Key Vault access policy and Azure Resource Manager templates

The image build can also fail due to a problem with the access policy on Azure Key Vault. This situation can occur when you use an Azure Resource Manager template to create the workspace and associated resources (including Azure Key Vault), multiple times. For example, using the template multiple times with the same parameters as part of a continuous integration and deployment pipeline.

Most resource creation operations through templates are idempotent, but Key Vault clears the access policies each time the template is used. Clearing the access policies breaks access to the Key Vault for any existing workspace that is using it. This condition results in errors when you try to create new images. The following are examples of the errors that you can receive:

__Portal__:
```text
Create image "myimage": An internal server error occurred. Please try again. If the problem persists, contact support.
```

__SDK__:
```python
image = ContainerImage.create(name = "myimage", models = [model], image_config = image_config, workspace = ws)
Creating image
Traceback (most recent call last):
  File "C:\Python37\lib\site-packages\azureml\core\image\image.py", line 341, in create
    resp.raise_for_status()
  File "C:\Python37\lib\site-packages\requests\models.py", line 940, in raise_for_status
    raise HTTPError(http_error_msg, response=self)
requests.exceptions.HTTPError: 500 Server Error: Internal Server Error for url: https://eastus.modelmanagement.azureml.net/api/subscriptions/<subscription-id>/resourceGroups/<resource-group>/providers/Microsoft.MachineLearningServices/workspaces/<workspace-name>/images?api-version=2018-11-19

Traceback (most recent call last):
  File "<stdin>", line 1, in <module>
  File "C:\Python37\lib\site-packages\azureml\core\image\image.py", line 346, in create
    'Content: {}'.format(resp.status_code, resp.headers, resp.content))
azureml.exceptions._azureml_exception.WebserviceException: Received bad response from Model Management Service:
Response Code: 500
Headers: {'Date': 'Tue, 26 Feb 2019 17:47:53 GMT', 'Content-Type': 'application/json', 'Transfer-Encoding': 'chunked', 'Connection': 'keep-alive', 'api-supported-versions': '2018-03-01-preview, 2018-11-19', 'x-ms-client-request-id': '3cdcf791f1214b9cbac93076ebfb5167', 'x-ms-client-session-id': '', 'Strict-Transport-Security': 'max-age=15724800; includeSubDomains; preload'}
Content: b'{"code":"InternalServerError","statusCode":500,"message":"An internal server error occurred. Please try again. If the problem persists, contact support"}'
```

__CLI__:
```text
ERROR: {'Azure-cli-ml Version': None, 'Error': WebserviceException('Received bad response from Model Management Service:\nResponse Code: 500\nHeaders: {\'Date\': \'Tue, 26 Feb 2019 17:34:05
GMT\', \'Content-Type\': \'application/json\', \'Transfer-Encoding\': \'chunked\', \'Connection\': \'keep-alive\', \'api-supported-versions\': \'2018-03-01-preview, 2018-11-19\', \'x-ms-client-request-id\':
\'bc89430916164412abe3d82acb1d1109\', \'x-ms-client-session-id\': \'\', \'Strict-Transport-Security\': \'max-age=15724800; includeSubDomains; preload\'}\nContent:
b\'{"code":"InternalServerError","statusCode":500,"message":"An internal server error occurred. Please try again. If the problem persists, contact support"}\'',)}
```

To avoid this problem, we recommend one of the following approaches:

* Do not deploy the template more than once for the same parameters. Or delete the existing resources before using the template to recreate them.
* Examine the Key Vault access policies and then use these policies to set the `accessPolicies` property of the template.
* Check if the Key Vault resource already exists. If it does, do not recreate it through the template. For example, add a parameter that allows you to disable the creation of the Key Vault resource if it already exists.

## Debug locally

If you encounter problems deploying a model to ACI or AKS, try deploying it as a local web service. Using a local web service makes it easier to troubleshoot problems. The Docker image containing the model is downloaded and started on your local system.

> [!IMPORTANT]
> Local web service deployments require a working Docker installation on your local system. Docker must be running before you deploy a local web service. For information on installing and using Docker, see [https://www.docker.com/](https://www.docker.com/).

> [!WARNING]
> Local web service deployments are not supported for production scenarios.

To deploy locally, modify your code to use `LocalWebservice.deploy_configuration()` to create a deployment configuration. Then use `Model.deploy()` to deploy the service. The following example deploys a model (contained in the `model` variable) as a local web service:

```python
from azureml.core.model import InferenceConfig,Model
from azureml.core.webservice import LocalWebservice

# Create inference configuration. This creates a docker image that contains the model.
inference_config = InferenceConfig(runtime= "python", 
                                   entry_script="score.py",
                                   conda_file="myenv.yml")

# Create a local deployment, using port 8890 for the web service endpoint
deployment_config = LocalWebservice.deploy_configuration(port=8890)
# Deploy the service
service = Model.deploy(ws, "mymodel", [model], inference_config, deployment_config)
# Wait for the deployment to complete
service.wait_for_deployment(True)
# Display the port that the web service is available on
print(service.port)
```

At this point, you can work with the service as normal. For example, the following code demonstrates sending data to the service:

```python
import json

test_sample = json.dumps({'data': [
    [1,2,3,4,5,6,7,8,9,10], 
    [10,9,8,7,6,5,4,3,2,1]
]})

test_sample = bytes(test_sample,encoding = 'utf8')

prediction = service.run(input_data=test_sample)
print(prediction)
```

### Update the service

During local testing, you may need to update the `score.py` file to add logging or attempt to resolve any problems that you've discovered. To reload changes to the `score.py` file, use `reload()`. For example, the following code reloads the script for the service, and then sends data to it. The data is scored using the updated `score.py` file:

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
import logging
logging.basicConfig(level=logging.DEBUG)
from azureml.core.model import Model
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
> This method of debugging does not work when using `Model.deploy()` and `LocalWebservice.deploy_configuration` to deploy a model locally. Instead, you must create an image using the [ContainerImage](https://docs.microsoft.com/python/api/azureml-core/azureml.core.image.containerimage?view=azure-ml-py) class. 
>
> Local web service deployments require a working Docker installation on your local system. Docker must be running before you deploy a local web service. For information on installing and using Docker, see [https://www.docker.com/](https://www.docker.com/).

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
            "name": "Azure Machine Learning service: Docker Debug",
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
                                 pip_packages = ['azureml-defaults==1.0.17', 'ptvsd'])
    
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

1. During debugging, you may want to make changes to the files in the image without having to recreate it. To install a text editor (vim) in the Docker image, create a new text file named `Dockerfile.steps` and use the following as the contents of the file:

    ```text
    RUN apt-get update && apt-get -y install vim
    ```

    A text editor allows you to modify the files inside the docker image to test changes without creating a new image.

1. To create an image that uses the `Dockerfile.steps` file, use the `docker_file` parameter when creating an image. The following example demonstrates how to do this:

    > [!NOTE]
    > This example assumes that `ws` points to your Azure Machine Learning workspace, and that `model` is the model being deployed. The `myenv.yml` file contains the conda dependencies created in step 1.

    ```python
    from azureml.core.image import Image, ContainerImage
    image_config = ContainerImage.image_configuration(runtime= "python",
                                 execution_script="score.py",
                                 conda_file="myenv.yml",
                                 docker_file="Dockerfile.steps")

    image = Image.create(name = "myimage",
                     models = [model],
                     image_config = image_config, 
                     workspace = ws)
    # Print the location of the image in the repository
    print(image.image_location)
    ```

Once the image has been created, the image location in the registry is displayed. The location is similar to the following text:

```text
myregistry.azurecr.io/myimage:1
```

In this text example, the registry name is `myregistry` and the image is named `myimage`. The image version is `1`.

### Download the image

1. Open a command prompt, terminal, or other shell and use the following [Azure CLI](https://docs.microsoft.com/cli/azure/?view=azure-cli-latest) command to authenticate to the Azure subscription that contains your Azure Machine Learning workspace:

    ```azurecli
    az login
    ```

1. To authenticate to the Azure Container Registry (ACR) that contains your image, use the following command. Replace `myregistry` with the one returned when you registered the image:

    ```azurecli
    az acr login --name myregistry
    ```

1. To download the image to your local Docker, use the following command. Replace `myimagepath` with the location returned when you registered the image:

    ```bash
    docker pull myimagepath
    ```

    The image path should be similar to `myregistry.azurecr.io/myimage:1`. Where `myregistry` is your registry, `myimage` is your image, and `1` is the image version.

    > [!TIP]
    > The authentication from the previous step does not last forever. If you wait long enough between the authentication command and the pull command, you will receive an authentication failure. If this happens, reauthenticate.

    The time it takes to complete the download depends on the speed of your internet connection. A download status is displayed during the process. Once the download is complete, you can use the `docker images` command to verify that it has downloaded.

1. To make it easier to work with the image, use the following command to add a tag. Replace `myimagepath` with the location value from step 2.

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

1. To attach VS Code to PTVSD inside the container, open VS Code and use the F5 key or select __Debug__. When prompted, select the __Azure Machine Learning service: Docker Debug__ configuration. You can also select the debug icon from the side bar, the __Azure Machine Learning service: Docker Debug__ entry from the Debug dropdown menu, and then use the green arrow to attach the debugger.

    ![The debug icon, start debugging button, and configuration selector](media/how-to-troubleshoot-deployment/start-debugging.png)

At this point, VS Code connects to PTVSD inside the Docker container and stops at the breakpoint you set previously. You can now step through the code as it runs, view variables, etc.

For more information on using VS Code to debug Python, see [Debug your Python code](https://docs.microsoft.com/visualstudio/python/debugging-python-in-visual-studio?view=vs-2019).

<a id="editfiles"></a>
### Modify the container files

To make changes to files in the image, you can attach to the running container, and execute a bash shell. From there, you can use vim to edit files:

1. To connect to the running container and launch a bash shell in the container, use the following command:

    ```bash
    docker exec -it debug /bin/bash
    ```

1. To find the files used by the service, use the following command from the bash shell in the container:

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
