---
title: Troubleshoot Jupyter notebooks - Microsoft Sentinel
description: Troubleshoot errors for Jupyter notebooks in Microsoft Sentinel.
author: cwatson-cat
ms.author: cwatson
ms.topic: troubleshooting
ms.custom: mvc, ignite-fall-2021
ms.date: 04/04/2022
---

# Troubleshoot Jupyter notebooks

Usually, a notebook creates or attaches to a kernel seamlessly, and you don't need to make any manual changes. If you get errors, or the notebook doesn't seem to be running, you might need to check the version and state of the kernel.

If you run into issues with your notebooks, see the [Azure Machine Learning notebook troubleshooting](../machine-learning/how-to-run-jupyter-notebooks.md#troubleshooting).

## Force caching for user accounts and credentials between notebook runs

By default, user accounts and credentials are not cached between notebook runs, even for the same session.

**To force caching for the duration of your session**:

1. Authenticate using Azure CLI. In an empty notebook cell, enter and run the following code:

    ```python
    !az login
    ```

    The following output appears:

    ```python
    To sign in, use a web browser to open the page https://microsoft.com/devicelogin and enter the 9-digit device code to authenticate.
    ```

1. Select and copy the nine-character token from the output, and select the `devicelogin` URL to go to the indicated page. 

1. Paste the token into the dialog and continue with signing in as prompted.

    When sign-in successfully completes, you see the following output:

    ```python
    Subscription <subscription ID> 'Sample subscription' can be accessed from tenants <tenant ID>(default) and <tenant ID>. To select a specific tenant when accessing this subscription, use 'az login --tenant TENANT_ID'.

> [!NOTE]
> The following tenants don't contain accessible subscriptions. Use 'az login --allow-no-subscriptions' to have tenant level access.
>
> ```
> <tenant ID> 'foo'
><tenant ID> 'bar'
>[
> {
>    "cloudName": "AzureApp",
>    "homeTenantId": "<tenant ID>",
>    "id": "<ID>",
>    "isDefault": true,
>    "managedByTenants": [
>    ....
>```
>
## Error: *Runtime dependency of PyGObject is missing*

If the *Runtime dependency of PyGObject is missing* error appears when you load a query provider, try troubleshooting using the following steps:

1. Proceed to the cell with the following code and run it:

    ```python
    qry_prov = QueryProvider("AzureSentinel")
    ```

    A warning similar to the following message is displayed, indicating a missing Python dependency (`pygobject`):

    ```output
    Runtime dependency of PyGObject is missing.

    Depends on your Linux distribution, you can install it by running code similar to the following:
    sudo apt install python3-gi python3-gi-cairo gir1.2-secret-1

    If necessary, see PyGObject's documentation: https://pygobject.readthedocs.io/en/latest/getting_started.html

    Traceback (most recent call last):
      File "/anaconda/envs/azureml_py36/lib/python3.6/site-packages/msal_extensions/libsecret.py", line 21, in <module>
    import gi  # https://github.com/AzureAD/microsoft-authentication-extensions-for-python/wiki/Encryption-on-Linux
    ModuleNotFoundError: No module named 'gi'
    ```

1. Use the [aml-compute-setup.sh](https://github.com/Azure/Azure-Sentinel-Notebooks/blob/master/tutorials-and-examples/how-tos/aml-compute-setup.sh) script, located in the Microsoft Sentinel Notebooks GitHub repository, to automatically install the `pygobject` in all notebooks and Anaconda environments on the Compute instance.

> [!TIP]
> You can also fix this Warning by running the following code from a notebook:
>
> ```python
> !conda install --yes -c conda-forge pygobject
> ```
>

## Next steps

We welcome feedback, suggestions, requests for features, contributed notebooks, bug reports or improvements and additions to existing notebooks. Go to the [Microsoft Sentinel  GitHub repository](https://github.com/Azure/Azure-Sentinel) to create an issue or fork and upload a contribution.
