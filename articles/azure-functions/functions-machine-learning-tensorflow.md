---
title: Use Python and TensorFlow for machine learning in Azure 
description: Use Python, TensorFlow, and Azure Functions with a machine learning model to classify an image based on its contents.
author: anthonychu

ms.topic: tutorial
ms.date: 01/15/2020
ms.author: antchu
ms.custom: mvc, devx-track-python, py-fresh-zinc
---

# Tutorial: Apply machine learning models in Azure Functions with Python and TensorFlow

In this article, you learn how to use Python, TensorFlow, and Azure Functions with a machine learning model to classify an image based on its contents. Because you do all work locally and create no Azure resources in the cloud, there is no cost to complete this tutorial.

> [!div class="checklist"]
> * Initialize a local environment for developing Azure Functions in Python.
> * Import a custom TensorFlow machine learning model into a function app.
> * Build a serverless HTTP API for classifying an image as containing a dog or a cat.
> * Consume the API from a web app.

## Prerequisites 

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?ref=microsoft.com&utm_source=microsoft.com&utm_medium=docs&utm_campaign=visualstudio).
- [Python 3.7.4](https://www.python.org/downloads/release/python-374/). (Python 3.7.4 and Python 3.6.x are verified with Azure Functions; Python 3.8 and later versions are not yet supported.)
- The [Azure Functions Core Tools](functions-run-local.md#install-the-azure-functions-core-tools)
- A code editor such as [Visual Studio Code](https://code.visualstudio.com/)

### Prerequisite check

1. In a terminal or command window, run `func --version` to check that the Azure Functions Core Tools are version 2.7.1846 or later.
1. Run `python --version` (Linux/MacOS) or `py --version` (Windows) to check your Python version reports 3.7.x.

## Clone the tutorial repository

1. In a terminal or command window, clone the following repository using Git:

    ```
    git clone https://github.com/Azure-Samples/functions-python-tensorflow-tutorial.git
    ```

1. Navigate into the folder and examine its contents.

    ```
    cd functions-python-tensorflow-tutorial
    ```

    - *start* is your working folder for the tutorial.
    - *end* is the final result and full implementation for your reference.
    - *resources* contains the machine learning model and helper libraries.
    - *frontend* is a website that calls the function app.
    
## Create and activate a Python virtual environment

Navigate to the *start* folder and run the following commands to create and activate a virtual environment named `.venv`. Be sure to use Python 3.7, which is supported by Azure Functions.


# [bash](#tab/bash)

```bash
cd start
python -m venv .venv
source .venv/bin/activate
```

If Python didn't install the venv package on your Linux distribution, run the following command:

```bash
sudo apt-get install python3-venv
```

# [PowerShell](#tab/powershell)

```powershell
cd start
py -3.7 -m venv .venv
.venv\scripts\activate
```

# [Cmd](#tab/cmd)

```cmd
cd start
py -3.7 -m venv .venv
.venv\scripts\activate
```

---

You run all subsequent commands in this activated virtual environment. (To exit the virtual environment, run `deactivate`.)


## Create a local functions project

In Azure Functions, a function project is a container for one or more individual functions that each responds to a specific trigger. All functions in a project share the same local and hosting configurations. In this section, you create a function project that contains a single boilerplate function named `classify` that provides an HTTP endpoint. You add more specific code in a later section.

1. In the *start* folder, use the Azure Functions Core Tools to initialize a Python function app:

    ```
    func init --worker-runtime python
    ```

    After initialization, the *start* folder contains various files for the project, including configurations files named [local.settings.json](functions-develop-local.md#local-settings-file) and [host.json](functions-host-json.md). Because *local.settings.json* can contain secrets downloaded from Azure, the file is excluded from source control by default in the *.gitignore* file.

    > [!TIP]
    > Because a function project is tied to a specific runtime, all the functions in the project must be written with the same language.

1. Add a function to your project by using the following command, where the `--name` argument is the unique name of your function and the `--template` argument specifies the function's trigger. `func new` create a subfolder matching the function name that contains a code file appropriate to the project's chosen language and a configuration file named *function.json*.

    ```
    func new --name classify --template "HTTP trigger"
    ```

    This command creates a folder matching the name of the function, *classify*. In that folder are two files: *\_\_init\_\_.py*, which contains the function code, and *function.json*, which describes the function's trigger and its input and output bindings. For details on the contents of these files, see [Programming model](./functions-reference-python.md?pivots=python-mode-configuration#programming-model) in the Python developer guide.


## Run the function locally

1. Start the function by starting the local Azure Functions runtime host in the *start* folder:

    ```
    func start
    ```
    
1. Once you see the `classify` endpoint appear in the output, navigate to the URL, ```http://localhost:7071/api/classify?name=Azure```. The message "Hello Azure!" should appear in the output.

1. Use **Ctrl**-**C** to stop the host.


## Import the TensorFlow model and add helper code

To modify the `classify` function to classify an image based on its contents, you use a pre-built TensorFlow model that was trained with and exported from Azure Custom Vision Service. The model, which is contained in the *resources* folder of the sample you cloned earlier, classifies an image based on whether it contains a dog or a cat. You then add some helper code and dependencies to your project.

To build your own model using the free tier of the Custom Vision Service, follow the instructions in the [sample project repository](https://github.com/Azure-Samples/functions-python-tensorflow-tutorial/blob/master/train-custom-vision-model.md).

> [!TIP]
> If you want to host your TensorFlow model independent of the function app, you can instead mount a file share containing your model to your Linux function app. To learn more, see [Mount a file share to a Python function app using Azure CLI](./scripts/functions-cli-mount-files-storage-linux.md).

1. In the *start* folder, run following command to copy the model files into the *classify* folder. Be sure to include `\*` in the command. 

    # [bash](#tab/bash)
    
    ```bash
    cp ../resources/model/* classify
    ```
    
    # [PowerShell](#tab/powershell)
    
    ```powershell
    copy ..\resources\model\* classify
    ```
    
    # [Cmd](#tab/cmd)
    
    ```cmd
    copy ..\resources\model\* classify
    ```
    
    ---
    
1. Verify that the *classify* folder contains files named *model.pb* and *labels.txt*. If not, check that you ran the command in the *start* folder.

1. In the *start* folder, run the following command to copy a file with helper code into the *classify* folder:

    # [bash](#tab/bash)
    
    ```bash
    cp ../resources/predict.py classify
    ```
    
    # [PowerShell](#tab/powershell)
    
    ```powershell
    copy ..\resources\predict.py classify
    ```
    
    # [Cmd](#tab/cmd)
    
    ```cmd
    copy ..\resources\predict.py classify
    ```
    
    ---

1. Verify that the *classify* folder now contains a file named *predict.py*.

1. Open *start/requirements.txt* in a text editor and add the following dependencies required by the helper code:

    ```txt
    tensorflow==1.14
    Pillow
    requests
    ```
    
1. Save *requirements.txt*.

1. Install the dependencies by running the following command in the *start* folder. Installation may take a few minutes, during which time you can proceed with modifying the function in the next section.

    ```
    pip install --no-cache-dir -r requirements.txt
    ```
    
    On Windows, you may encounter the error, "Could not install packages due to an EnvironmentError: [Errno 2] No such file or directory:" followed by a long pathname to a file like *sharded_mutable_dense_hashtable.cpython-37.pyc*. Typically, this error happens because the depth of the folder path becomes too long. In this case, set the registry key `HKEY_LOCAL_MACHINE\SYSTEM\CurrentControlSet\Control\FileSystem@LongPathsEnabled` to `1` to enable long paths. Alternately, check where your Python interpreter is installed. If that location has a long path, try reinstalling in a folder with a shorter path.

> [!TIP]
> When calling upon *predict.py* to make its first prediction, a function named `_initialize` loads the TensorFlow model from disk and caches it in global variables. This caching speeds up subsequent predictions. For more information on using global variables, refer to the [Azure Functions Python developer guide](functions-reference-python.md#global-variables).

## Update the function to run predictions

1. Open *classify/\_\_init\_\_.py* in a text editor and add the following lines after the existing `import` statements to import the standard JSON library and the *predict* helpers:

    :::code language="python" source="~/functions-python-tensorflow-tutorial/end/classify/__init__.py" range="1-6" highlight="5-6":::

1. Replace the entire contents of the `main` function with the following code:

    :::code language="python" source="~/functions-python-tensorflow-tutorial/end/classify/__init__.py" range="8-19":::

    This function receives an image URL in a query string parameter named `img`. It then calls `predict_image_from_url` from the helper library to download and classify the image using the TensorFlow model. The function then returns an HTTP response with the results. 

    > [!IMPORTANT]
    > Because this HTTP endpoint is called by a web page hosted on another domain, the response includes an `Access-Control-Allow-Origin` header to satisfy the browser's Cross-Origin Resource Sharing (CORS) requirements.
    >
    > In a production application, change `*` to the web page's specific origin for added security.

1. Save your changes, then assuming that dependencies have finished installing, start the local function host again with `func start`. Be sure to run the host in the *start* folder with the virtual environment activated. Otherwise the host will start, but you will see errors when invoking the function.

    ```
    func start
    ```

1. In a browser, open the following URL to invoke the function with the URL of a cat image and confirm that the returned JSON classifies the image as a cat.

    ```
    http://localhost:7071/api/classify?img=https://raw.githubusercontent.com/Azure-Samples/functions-python-tensorflow-tutorial/master/resources/assets/samples/cat1.png
    ```
    
1. Keep the host running because you use it in the next step. 

### Run the local web app front end to test the function

To test invoking the function endpoint from another web app, there's a simple app in the repository's *frontend* folder.

1. Open a new terminal or command prompt and activate the virtual environment (as described earlier under [Create and activate a Python virtual environment](#create-and-activate-a-python-virtual-environment)).

1. Navigate to the repository's *frontend* folder.

1. Start an HTTP server with Python:

    # [bash](#tab/bash)

    ```bash 
    python -m http.server
    ```
    
    # [PowerShell](#tab/powershell)

    ```powershell
    py -m http.server
    ```

    # [Cmd](#tab/cmd)

    ```cmd
    py -m http.server
    ```

1. In a browser, navigate to `localhost:8000`, then enter one of the following photo URLs into the textbox, or use the URL of any publicly accessible image.

    - `https://raw.githubusercontent.com/Azure-Samples/functions-python-tensorflow-tutorial/master/resources/assets/samples/cat1.png`
    - `https://raw.githubusercontent.com/Azure-Samples/functions-python-tensorflow-tutorial/master/resources/assets/samples/cat2.png`
    - `https://raw.githubusercontent.com/Azure-Samples/functions-python-tensorflow-tutorial/master/resources/assets/samples/dog1.png`
    - `https://raw.githubusercontent.com/Azure-Samples/functions-python-tensorflow-tutorial/master/resources/assets/samples/dog2.png`
    
1. Select **Submit** to invoke the function endpoint to classify the image.

    ![Screenshot of finished project](media/functions-machine-learning-tensorflow/functions-machine-learning-tensorflow-screenshot.png)

    If the browser reports an error when you submit the image URL, check the terminal in which you're running the function app. If you see an error like "No module found 'PIL'", you may have started the function app in the *start* folder without first activating the virtual environment you created earlier. If you still see errors, run `pip install -r requirements.txt` again with the virtual environment activated and look for errors.

> [!NOTE]
> The model always classifies the content of the image as a cat or a dog, regardless of whether the image contains either, defaulting to dog. Images of tigers and panthers, for example, typically classify as cat, but images of elephants, carrots, or airplanes classify as dog.

## Clean up resources

Because the entirety of this tutorial runs locally on your machine, there are no Azure resources or services to clean up.

## Next steps

In this tutorial, you learned how to build and customize an HTTP API endpoint with Azure Functions to classify images using a TensorFlow model. You also learned how to call the API from a web app. You can use the techniques in this tutorial to build out APIs of any complexity, all while running on the serverless compute model provided by Azure Functions.

> [!div class="nextstepaction"]
> [Deploy the function to Azure Functions using the Azure CLI Guide](./functions-run-local.md#publish)

See also:

- [Deploy the function to Azure using Visual Studio Code](https://code.visualstudio.com/docs/python/tutorial-azure-functions).
- [Azure Functions Python Developer Guide](./functions-reference-python.md)
- [Mount a file share to a Python function app using Azure CLI](./scripts/functions-cli-mount-files-storage-linux.md)
