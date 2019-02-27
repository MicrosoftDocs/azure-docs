---
title: Deployment troubleshooting guide
titleSuffix: Azure Machine Learning service
description: Learn how to work around, solve, and troubleshoot the common Docker deployment errors with AKS and ACI using  Azure Machine Learning service.
services: machine-learning
ms.service: machine-learning
ms.subservice: core
ms.topic: conceptual
author: chris-lauren
ms.author:  clauren
ms.reviewer: jmartens
ms.date: 12/04/2018
ms.custom: seodec18
---

# Troubleshooting Azure Machine Learning service AKS and ACI deployments

In this article, you will learn how to work around or solve the common Docker deployment errors with Azure Container Instances (ACI) and Azure Kubernetes Service (AKS) using Azure Machine Learning service.

When deploying a model in Azure Machine Learning service, the system performs a number of tasks. This is a complex sequence of events and sometimes issues arise. The deployment tasks are:

1. Register the model in the workspace model registry.

2. Build a Docker image, including:
    1. Download the registered model from the registry. 
    2. Create a dockerfile, with a Python environment based on the dependencies you specify in the environment yaml file.
    3. Add your model files and the scoring script you supply in the dockerfile.
    4. Build a new Docker image using the dockerfile.
    5. Register the Docker image with the Azure Container Registry associated with the workspace.

3. Deploy the Docker image to Azure Container Instance (ACI) service or to Azure Kubernetes Service (AKS).

4. Start up a new container (or containers) in ACI or AKS. 

Learn more about this process in the [Model Management](concept-model-management-and-deployment.md) introduction.

## Before you begin

If you run into any issue, the first thing to do is to break down the deployment task (previous described) into individual steps to isolate the problem. 

This is helpful if you are using the `Webservice.deploy` API, or `Webservice.deploy_from_model` API, since those functions group together the aforementioned steps into a single action. Typically those APIs are convenient, but it helps to break up the steps when troubleshooting by replacing them with the below API calls.

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
                                                      execution_script="score.py",
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
If system is unable to build the Docker image, the `image.wait_for_creation()` call fails with some error messages that can offer some clues. You can also find out more details about the errors from the image build log. Below is some sample code showing how to discover the image build log uri.

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

The image build can also fail due to a problem with the access policy on Azure Key Vault. This can occur when you use an Azure Resource Manager template to create the workspace and associated resources (including Azure Key Vault), multiple times. For example, using the template multiple times with the same parameters as part of a continuous integration and deployment pipeline.

Most resource creation operations through templates are idempotent, but Key Vault clears the access policies each time the template is used. This breaks access to the Key Vault for any existing workspace that is using it. This results in errors when you try to create new images. The following are examples of the errors that you can receive:

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
* Examine the Key Vault access policies and use this to set the `accessPolicies` property of the template.
* Check if the Key Vault resource already exists. If it does, do not recreate it through the template. For example, add a parameter that allows you to disable the creation of the Key Vault resource if it already exists.

## Service launch fails
After the image is successfully built, the system attempts to start a container in either ACI or AKS depending on your deployment configuration. It is recommended to try an ACI deployment first, since it is a simpler single-container deployment. This way you can then rule out any AKS-specific problem.

As part of container starting-up process, the `init()` function in your scoring script is invoked by the system. If there are uncaught exceptions in the `init()` function, you might see **CrashLoopBackOff** error in the error message. Below are some tips to help you troubleshoot the problem.

### Inspect the Docker log
You can print out detailed Docker engine log messages from the service object.

```python
# if you already have the service object handy
print(service.get_logs())

# if you only know the name of the service (note there might be multiple services with the same name but different version number)
print(ws.webservices['mysvc'].get_logs())
```

### Debug the Docker image locally
Some times the Docker log does not emit enough information about what is going wrong. You can go one step further and pull down the built Docker image, start a local container, and debug directly inside the live container interactively. To start a local container, you must have a Docker engine running locally, and it would be a lot easier if you also have [azure-cli](https://docs.microsoft.com/cli/azure/install-azure-cli?view=azure-cli-latest) installed.

First we need to find out the image location:

```python
# print image location
print(image.image_location)
```

The image location has this format: `<acr-name>.azurecr.io/<image-name>:<version-number>`, such as `myworkpaceacr.azurecr.io/myimage:3`. 

Now go to your command-line window. If you have azure-cli installed, you can type the following commands to sign in to the ACR (Azure Container Registry) associated with the workspace where the image is stored. 

```sh
# log on to Azure first if you haven't done so before
$ az login

# make sure you set the right subscription in case you have access to multiple subscriptions
$ az account set -s <subscription_name_or_id>

# now let's log in to the workspace ACR
# note the acr-name is the domain name WITHOUT the ".azurecr.io" postfix
# e.g.: az acr login -n myworkpaceacr
$ az acr login -n <acr-name>
```
If you don't have azure-cli installed, you can use `docker login` command to log into the ACR. But you need to retrieve the user name and password of the ACR from Azure portal first.

Once you have logged in to the ACR, you can pull down the Docker image and start a container locally, and then launch a bash session for debugging by using the `docker run` command:

```sh
# note the image_id is <acr-name>.azurecr.io/<image-name>:<version-number>
# for example: myworkpaceacr.azurecr.io/myimage:3
$ docker run -it <image_id> /bin/bash
```

Once you launch a bash session the running container, you can find your scoring scripts in the `/var/azureml-app` folder. You can then launch a Python session to debug your scoring scripts. 

```sh
# enter the directory where scoring scripts live
cd /var/azureml-app

# find what Python packages are installed in the python environment
pip freeze

# sanity-check on score.py
# you might want to edit the score.py to trigger init().
# as most of the errors happen in init() when you are trying to load the model.
python score.py
```
In case you need a text editor to modify your scripts, you can install vim, nano, Emacs, or your other favorite editor.

```sh
# update package index
apt-get update

# install a text editor of your choice
apt-get install vim
apt-get install nano
apt-get install emacs

# launch emacs (for example) to edit score.py
emacs score.py

# exit the container bash shell
exit
```

You can also start up the web service locally and send HTTP traffic to it. The Flask server in the Docker container is running on port 5001. You can map to any other ports available on the host machine.
```sh
# you can find the scoring API at: http://localhost:8000/score
$ docker run -p 8000:5001 <image_id>
```

## Function fails: get_model_path()
Often, in the `init()` function in the scoring script, `Model.get_model_path()` function is called to locate a model file or a folder of model files in the container. This is often a source of failure if the model file or folder cannot be found. The easiest way to debug this error is to run the below Python code in the Container shell:

```python
import logging
logging.basicConfig(level=logging.DEBUG)
from azureml.core.model import Model
print(Model.get_model_path(model_name='my-best-model'))
```

This would print out the local path (relative to `/var/azureml-app`) in the container where your scoring script is expecting to find the model file or folder. Then you can verify if the file or folder is indeed where it is expected to be.

Setting the logging level to DEBUG may provide cause additional information to be logged, which may be useful in identifying the failure.

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
**Note**: Returning error messages from the `run(input_data)` call should be done for debugging purpose only. It might not be a good idea to do this in a production environment for security reasons.


## Next steps

Learn more about deployment: 
* [How to deploy and where](how-to-deploy-and-where.md)

* [Tutorial: Train & deploy models](tutorial-train-models-with-aml.md)
