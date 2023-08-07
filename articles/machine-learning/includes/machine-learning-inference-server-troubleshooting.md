---
author: shohei1029
ms.service: machine-learning
ms.topic: include
ms.date: 16/12/2022
ms.author: shnagata
---

### Basic steps

The basic steps for troubleshooting are:
1. Gather version information for your Python environment.
2. Make sure the azureml-inference-server-http python package version that specified in the environment file matches the AzureML Inferencing HTTP server version that displayed in the [startup log](../how-to-inference-server-http.md#startup-logs). Sometimes pip's dependency resolver leads to unexpected versions of packages installed.
3. If you specify Flask (and or its dependencies) in your environment, remove them. The dependencies include `Flask`, `Jinja2`, `itsdangerous`, `Werkzeug`, `MarkupSafe`, and `click`. Flask is listed as a dependency in the server package and it's best to let our server install it. This way when the server supports new versions of Flask, you'll automatically get them.

### Server version

The server package `azureml-inference-server-http` is published to PyPI. You can find our changelog and all previous versions on our [PyPI page](https://pypi.org/project/azureml-inference-server-http/). Update to the latest version if you're using an earlier version.
- 0.4.x: The version that is bundled in training images ≤ `20220601` and in `azureml-defaults>=1.34,<=1.43`. `0.4.13` is the last stable version. If you use the server before version `0.4.11`, you may see Flask dependency issues like can't import name `Markup` from `jinja2`. You're recommended to upgrade to `0.4.13` or `0.8.x` (the latest version), if possible.
- 0.6.x: The version that is preinstalled in inferencing images ≤ 20220516. The latest stable version is `0.6.1`.
- 0.7.x: The first version that supports Flask 2. The latest stable version is `0.7.7`.
- 0.8.x: The log format has changed and Python 3.6 support has dropped.

### Package dependencies

The most relevant packages for the server `azureml-inference-server-http` are following packages: 
- flask
- opencensus-ext-azure
- inference-schema
  
If you specified `azureml-defaults` in your Python environment, the `azureml-inference-server-http` package is depended on, and will be installed automatically.

> [!TIP]
> If you're using Python SDK v1 and don't explicitly specify `azureml-defaults` in your Python environment, the SDK may add the package for you. However, it will lock it to the version the SDK is on. For example, if the SDK version is `1.38.0`, it will add `azureml-defaults==1.38.0` to the environment's pip requirements.

### Frequently asked questions

#### 1. I encountered the following error during server startup:

```bash

TypeError: register() takes 3 positional arguments but 4 were given

  File "/var/azureml-server/aml_blueprint.py", line 251, in register

    super(AMLBlueprint, self).register(app, options, first_registration)

TypeError: register() takes 3 positional arguments but 4 were given

```

You have **Flask 2** installed in your python environment but are running a version of `azureml-inference-server-http` that doesn't support Flask 2. Support for Flask 2 is added in `azureml-inference-server-http>=0.7.0`, which is also in `azureml-defaults>=1.44`.

- If you're not using this package in an AzureML docker image, use the latest version of
   `azureml-inference-server-http` or `azureml-defaults`.

- If you're using this package with an AzureML docker image, make sure you're using an image built in or after July,
   2022. The image version is available in the container logs. You should be able to find a log similar to the following:

    ```
    2022-08-22T17:05:02,147738763+00:00 | gunicorn/run | AzureML Container Runtime Information
    2022-08-22T17:05:02,161963207+00:00 | gunicorn/run | ###############################################
    2022-08-22T17:05:02,168970479+00:00 | gunicorn/run | 
    2022-08-22T17:05:02,174364834+00:00 | gunicorn/run | 
    2022-08-22T17:05:02,187280665+00:00 | gunicorn/run | AzureML image information: openmpi4.1.0-ubuntu20.04, Materializaton Build:20220708.v2
    2022-08-22T17:05:02,188930082+00:00 | gunicorn/run | 
    2022-08-22T17:05:02,190557998+00:00 | gunicorn/run | 
    ```

   The build date of the image appears after "Materialization Build", which in the above example is `20220708`, or July 8, 2022. This image is compatible with Flask 2. If you don't see a banner like this in your container log, your image is out-of-date, and should be updated. If you're using a CUDA image, and are unable to find a newer image, check if your image is deprecated in [AzureML-Containers](https://github.com/Azure/AzureML-Containers). If it's, you should be able to find replacements.

- If you're using the server with an online endpoint, you can also find the logs under "Deployment logs" in the [online endpoint page in Azure Machine Learning studio](https://ml.azure.com/endpoints). If you deploy with SDK v1 and don't explicitly specify an image in your deployment configuration, it will default to using a version of `openmpi4.1.0-ubuntu20.04` that matches your local SDK toolset, which may not be the latest version of the image. For example, SDK 1.43 will default to using `openmpi4.1.0-ubuntu20.04:20220616`, which is incompatible. Make sure you use the latest SDK for your deployment.

- If for some reason you're unable to update the image, you can temporarily avoid the issue by pinning `azureml-defaults==1.43` or `azureml-inference-server-http~=0.4.13`, which will install the older version server with `Flask 1.0.x`.

#### 2. I encountered an ``ImportError`` or ``ModuleNotFoundError`` on modules ``opencensus``, ``jinja2``, ``MarkupSafe``, or ``click`` during startup like the following message:

```bash
ImportError: cannot import name 'Markup' from 'jinja2'
```

Older versions (<= 0.4.10) of the server didn't pin Flask's dependency to compatible versions. This problem is fixed in the latest version of the server.
