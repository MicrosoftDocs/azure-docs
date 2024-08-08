---
author: shohei1029
ms.service: machine-learning
ms.topic: include
ms.date: 08/07/2024
ms.author: shnagata
---

### Check installed packages

Follow these steps to address issues with installed packages:

1. Gather information about installed packages and versions for your Python environment.

1. Confirm the `azureml-inference-server-http` Python package version specified in the environment file matches the Azure Machine Learning inference HTTP server version displayed in the [startup log](../how-to-inference-server-http.md#view-startup-logs).

   - In some cases, the pip dependency resolver installs unexpected package versions.

   - You might need to run `pip` to correct installed packages and versions.

1. If you specify the Flask or its dependencies in your environment, remove these items.

   - Dependent packages include `flask`, `jinja2`, `itsdangerous`, `werkzeug`, `markupsafe`, and `click`.

   - `flask` is listed as a dependency in the server package. The best approach is to allow the inference server to install the `flask` package.

   - When the inference server is configured to support new versions of Flask, the server automatically receives the package updates as they become available.

### Check server version

The `azureml-inference-server-http` server package is published to PyPI. The changelog and all previous versions are listed on the [PyPI page](https://pypi.org/project/azureml-inference-server-http/).

If you use an earlier package version, the recommendation is to update your configuration to the **latest** version.

The following table summarizes stable versions, common issues, and recommended adjustments:

| Package version | Description | Issue | Resolution |
| --- | --- | --- |
| **0.4.x** | Bundled in training images dated `20220601` or earlier and `azureml-defaults` package versions `.1.34` through `1.43`. Latest stable version is **0.4.13**. | For server versions earlier than **0.4.11**, you might encounter Flask dependency issues, such as "can't import name Markup from jinja2." | Upgrade to version **0.4.13** or **0.8.x** (the latest version), if possible. |
| **0.6.x** | Preinstalled in inferencing images dated `20220516` and earlier. Latest stable version is **0.6.1**. | N/A | N/A |
| **0.7.x** | Supports Flask 2. Latest stable version is **0.7.7**. | N/A | N/A |
| **0.8.x** | Log format changed. Python 3.6 support ended. | N/A | N/A |

<!-- Reviewer: Confirm if other versions or common issues + resolutions should be listed. The last major update to this topic was about 2 years ago. -->

### Check package dependencies

The most relevant dependent packages for the `azureml-inference-server-http` server package include: 

- `flask`
- `opencensus-ext-azure`
- `inference-schema`
  
If you specified the `azureml-defaults` package in your Python environment, the `azureml-inference-server-http` package is a dependendent package. The dependency is installed automatically.

> [!TIP]
> If you use Python SDK v1 and don't explicitly specify the `azureml-defaults` package in your Python environment, the SDK might automatically add the package. However, the packager version is locked relative to the SDK version. For example, if the SDK version is `1.38.0`, then the `azureml-defaults==1.38.0` entry is added to the environment's pip requirements.

### Frequently asked questions

The following sections describe possible resolutions for frequently asked questions about the Azure Machine Learning inference HTTP server.

#### TypeError during server startup

You might encounter a TypeError during server startup, as follows:

```bash
TypeError: register() takes 3 positional arguments but 4 were given

  File "/var/azureml-server/aml_blueprint.py", line 251, in register

    super(AMLBlueprint, self).register(app, options, first_registration)

TypeError: register() takes 3 positional arguments but 4 were given
```

This error occurs when you have Flask 2 installed in your Python environment, but your `azureml-inference-server-http` package version doesn't support Flask 2. Support for Flask 2 is available in `azureml-inference-server-http` package version **0.7.0** and later, and `azureml-defaults` package version **1.44** and later.

- If you don't use the Flask 2 package in an Azure Machine Learning docker image, use the latest version of the `azureml-inference-server-http` or `azureml-defaults` package

- If you use the Flask 2 package in an Azure Machine Learning docker image, confirm the image build version is **July 2022** or later.

   You can find the image version in the container logs:

   ```console
   2022-08-22T17:05:02,147738763+00:00 | gunicorn/run | AzureML Container Runtime Information
   2022-08-22T17:05:02,161963207+00:00 | gunicorn/run | ###############################################
   2022-08-22T17:05:02,168970479+00:00 | gunicorn/run | 
   2022-08-22T17:05:02,174364834+00:00 | gunicorn/run | 
   2022-08-22T17:05:02,187280665+00:00 | gunicorn/run | AzureML image information: openmpi4.1.0-ubuntu20.04, Materialization Build:20220708.v2
   2022-08-22T17:05:02,188930082+00:00 | gunicorn/run | 
   2022-08-22T17:05:02,190557998+00:00 | gunicorn/run | 
   ```

   - The build date of the image appears after the `Materialization Build` notation. In the example, the image version is `20220708` or July 8, 2022. In this example, the image is compatible with Flask 2.
   
   - If you don't see a similar message in your container log, your image is out-of-date and should be updated. If you use a Compute Unified Device Architecture (CUDA) image, and you can't find a newer image, check if your image is deprecated in [AzureML-Containers](https://github.com/Azure/AzureML-Containers). You can find designated replacements for deprecated images.

- If you use the server with an online endpoint, you can also find the logs under "Deployment logs" in the [online endpoint page in Azure Machine Learning studio](https://ml.azure.com/endpoints).

   - If you deploy with SDK v1, and don't explicitly specify an image in your deployment configuration, the server applies the `openmpi4.1.0-ubuntu20.04` package with a version that matches your local SDK toolset. However, the version installed might not be the latest available version of the image. For SDK version 1.43, the server installs the `openmpi4.1.0-ubuntu20.04:20220616` package version by default, but this package version isn't compatible with SDK 1.43. Make sure you use the latest SDK for your deployment.

- If you can't update the image, you can temporarily avoid the issue by pinning the `azureml-defaults==1.43` or `azureml-inference-server-http~=0.4.13` entries in your environment file. These entries direct the server to install the older version with `flask 1.0.x`.

#### ImportError or ModuleNotFoundError during server startup

You might encounter an `ImportError` or `ModuleNotFoundError` on specific modules during server startup, such as  `opencensus`, `jinja2`, `markupsafe`, or `click`. Here's an example of the error message:

```bash
ImportError: cannot import name 'Markup' from 'jinja2'
```

The import and module errors occur when you use older versions of the server (version **0.4.10** and earlier) that don't pin the Flask dependency to a compatible version. 

To prevent the issue, install a later version of the server.
