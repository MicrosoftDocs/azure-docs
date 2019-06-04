# Deploy a model using a custom Docker image

When you deploy a trained model to a web service or IoT Edge device, a Docker image is created. This image contains the model, conda environment, and assets needed to use the model. It also contains a web server to handle incoming requests when deployed as a web service, and components needed to work with Azure IoT Hub.

Azure Machine Learning service provides a default Docker image so you don't have to worry about creating on. You can also use a custom image that you create as a _base image_. A base image is used as the starting point when an image is created for a deployment. It provides the underlying operating system and components. The deployment process then adds additional components, such as your model, conda environment, and other assets, to the image before deploying it.

> [!IMPORTANT]
> When deploying a model, you cannot override core components such as the web server or IoT Edge components. The components used provide a known working environment that is tested and supported by Microsoft.

Microsoft also provides several base images that use the ONNX Runtime. These are useful when deploying ONNX models.

## Prerequisites

* An Azure Machine Learning service workgroup
* The Azure CLI
* An Azure Container Registry or other Docker registry that is accessible on the internet. The steps in this document use an Azure Container Registry.

## Image requirements

Azure Machine Learning service supports Docker images that provide the following software:

* Ubuntu 16.04 or greater.
* Conda 4.5.# or greater.
* Python 3.5.# or 3.6.#.

For example, the following Dockerfile uses Ubuntu 16.04, the latest miniconda, and finally uses conda to install Python 3.6:

```text
FROM ubuntu:16.04
# update and install wget and bzip2
RUN apt-get update -y && yes|apt-get upgrade
RUN apt-get install -y wget bzip2
# add a user named 'ubuntu'
RUN apt-get -y install sudo
RUN adduser --disabled-password --gecos '' ubuntu
RUN adduser ubuntu sudo
RUN echo '%sudo ALL=(ALL) NOPASSWD:ALL' >> /etc/sudoers
# switch to 'ubuntu' user and set up home directory
USER ubuntu
WORKDIR /home/ubuntu/
RUN chmod a+rwx /home/ubuntu
# Install miniconda
RUN wget https://repo.anaconda.com/miniconda/Miniconda2-latest-Linux-x86_64.sh
RUN bash Miniconda2-latest-Linux-x86_64.sh -b
RUN rm Miniconda2-latest-Linux-x86_64.sh
# Add to user path
ENV PATH /home/ubuntu/miniconda2/bin:$PATH
# Update conda packages
RUN conda update conda
# Set default python to 3.6
RUN conda install python=3.6
```

## Get container registry address

__If you've already trained or deployed models__ using the Azure Machine Learning service, a container registry was created for your workspace. If you have not trained or deployed a model, use the steps in the [Train image classification models](tutorial-train-models-with-aml.md) tutorial. By walking through the tutorial, a container registry is created for your workspace.

For information on what is different when using a different Azure Container Registry than the one in your workgroup, see the [tbd]() section.

To find the name of this container registry, use the following steps:

1. Open a new shell or command-prompt and use the following command to authenticate to your Azure subscription:

    ```
    az login
    ```

    Follow the prompts to authenticate to the subscription.

2. Use the following command to list the container registry for the workspace. Replace `<myworkspace>` with your Azure Machine Learning service workspace name. Replace `<resourcegroup>` with the Azure resource group that contains your workspace:

    ```
    az ml workspace show -w <myworkspace> -g <resourcegroup> --query containerRegistry
    ```

    The information returned is similar to the following:

    ```text
    /subscriptions/<subscription_id>/resourceGroups/<resource_group>/providers/Microsoft.ContainerRegistry/registries/<registry_name>
    ```

    Save the `<registry_name>` value. It will be used in later steps.

## Build a custom image

1. Create a new text file named `Dockerfile`, and use the following text as the contents:

    ```text
    FROM ubuntu:16.04
    # update and install wget and bzip2
    RUN apt-get update -y && yes|apt-get upgrade
    RUN apt-get install -y wget bzip2
    # add a user named 'ubuntu'
    RUN apt-get -y install sudo
    RUN adduser --disabled-password --gecos '' ubuntu
    RUN adduser ubuntu sudo
    RUN echo '%sudo ALL=(ALL) NOPASSWD:ALL' >> /etc/sudoers
    # switch to 'ubuntu' user and set up home directory
    USER ubuntu
    WORKDIR /home/ubuntu/
    RUN chmod a+rwx /home/ubuntu
    # Install miniconda
    RUN wget https://repo.anaconda.com/miniconda/Miniconda2-latest-Linux-x86_64.sh
    RUN bash Miniconda2-latest-Linux-x86_64.sh -b
    RUN rm Miniconda2-latest-Linux-x86_64.sh
    # Add to user path
    ENV PATH /home/ubuntu/miniconda2/bin:$PATH
    # Update conda packages
    RUN conda update conda
    # Set default python to 3.6
    RUN conda install python=3.6
    ```

2. From a shell or command-prompt, use the following to authenticate to the Azure Container Registry. Replace the `<registry_name>` with the one retrieved earlier:

    ```
    az acr login --name <registry_name>
    ```

3. To upload the Dockerfile, and build it, use the following command:

    ```
    az acr build --image custom/myimage:v1 --registry <registry_name> --file Dockerfile .
    ```

    During the build process, information is streamed to back to you

## Use a custom base image

To use a custom image, set the `base_image` property of the inference configuration to the address of the image. The following example demonstrates how to use an image from both a public and private Azure Container Registry:

```python
# use an image available in public Container Registry without authentication
inference_config.base_image = "mcr.microsoft.com/azureml/o16n-sample-user-base/ubuntu-miniconda"

# or, use an image available in a private Container Registry
inference_config.base_image = "myregistry.azurecr.io/mycustomimage:1.0"
inference_config.base_image_registry.address = "myregistry.azurecr.io"
inference_config.base_image_registry.username = "username"
inference_config.base_image_registry.password = "password"
```

The following image URIs are for images provided by Microsoft, and can be used without providing a user name or password value:

* `mcr.microsoft.com/azureml/o16n-sample-user-base/ubuntu-miniconda`
* `mcr.microsoft.com/azureml/onnxruntime:v0.4.0`
* `mcr.microsoft.com/azureml/onnxruntime:v0.4.0-cuda10.0-cudnn7`
* `mcr.microsoft.com/azureml/onnxruntime:v0.4.0-tensorrt19.03`

To use these images, set the `base_image` to the URI from the list above. Set `base_image_registry.address` to `mcr.microsoft.com`.

> [!IMPORTANT]
> Microsoft images that use CUDA or TensorRT must be used on Microsoft Azure Services only.

For more information on uploading your own images to an Azure Container Registry, see [Push your first image to a private Docker container registry](https://docs.microsoft.com/azure/container-registry/container-registry-get-started-docker-cli).

If your model is trained on Azure Machine Learning Compute, using __version 1.0.22 or greater__ of the Azure Machine Learning SDK, an image is created during training. The following example demonstrates how to use this image:

```python
# Use an image built during training with SDK 1.0.22 or greater
image_config.base_image = run.properties["AzureML.DerivedImageName"]
```