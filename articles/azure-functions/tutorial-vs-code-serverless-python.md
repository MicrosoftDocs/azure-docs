---
title: Create and deploy Azure Functions in Python with Visual Studio Code
description: How to use the Visual Studio Code extension for Azure Functions to create serverless functions in Python and deploy them to Azure.
services: functions
author: ggailey777
manager: jeconnoc
ms.service: azure-functions
ms.topic: conceptual
ms.date: 07/02/2019
ms.author: glenga
---

# Deploy Python to Azure Functions with Visual Studio Code

In this tutorial, you use Visual Studio Code and the Azure Functions extension to create a serverless HTTP endpoint with Python and to also add a connection (or "binding") to storage. Azure Functions runs your code in a serverless environment without needing to provision a virtual machine or publish a web app. The Azure Functions extension for Visual Studio Code greatly simplifies the process of using Functions by automatically handling many configuration concerns.

If you encounter issues with any of the steps in this tutorial, we'd love to hear about the details. Use the **I ran into an issue** button at the end of each section to submit detailed feedback.

## Prerequisites

- An [Azure subscription](#azure-subscription).
- [Visual Studio Code with the Azure Functions](#visual-studio-code-python-and-the-azure-functions-extension) extension.
- The [Azure Functions Core Tools](#azure-functions-core-tools).

### Azure subscription

If you don't have an Azure subscription, [sign up now](https://azure.microsoft.com/free/?utm_source=campaign&utm_campaign=vscode-tutorial-docker-extension&mktingSource=vscode-tutorial-docker-extension) for a free 30-day account with $200 in Azure credits to try out any combination of services.

### Visual Studio Code, Python, and the Azure Functions extension

Install the following software:

- Python 3.6.x as required by Azure Functions. [Python 3.6.8](https://www.python.org/downloads/release/python-368/) is the latest 3.6.x version.
- [Visual Studio Code](https://code.visualstudio.com/).
- The [Python extension](https://marketplace.visualstudio.com/items?itemName=ms-python.python) as described on [Visual Studio Code Python Tutorial - Prerequisites](https://code.visualstudio.com/docs/python/python-tutorial).
- The [Azure Functions extension](https://marketplace.visualstudio.com/items?itemName=ms-azuretools.vscode-azurefunctions). For general information, visit the [vscode-azurefunctions GitHub repository](https://github.com/Microsoft/vscode-azurefunctions).

### Azure Functions Core Tools

Follow the instructions for your operating system on [Work with Azure Functions Core Tools](functions-run-local.md#v2). The tools themselves are written in .NET Core, and the Core Tools package is best installed using the Node.js package manager, npm, which is why you need to install .NET Core and Node.js at present, even for Python code. You can, however bypass the .NET Core requirement using "extension bundles" as described in the aforementioned documentation. Whatever the case, you need install these components only once, after which Visual Studio Code automatically prompts you to install any updates.

### Sign in to Azure

Once the Functions extension is installed, sign into your Azure account by navigating to the **Azure: Functions** explorer, select **Sign in to Azure**, and follow the prompts.

![Sign in to Azure through Visual Studio Code](media/tutorial-vs-code-serverless-python/azure-sign-in.png)

After signing in, verify that the email account of your Azure subscription appears in the Status Bar:

![Visual Studio Code status bar showing Azure account](media/tutorial-vs-code-serverless-python/azure-account-status-bar.png)

The name you've assigned to your subscription also appears in the **Azure: Functions** explorer ("Primary" in the image below):

![Visual Studio Code Azure App Service explorer showing subscriptions](media/tutorial-vs-code-serverless-python/azure-subscription-view.png)

> [!NOTE]
> If you encounter the error **"Cannot find subscription with name [subscription ID]"**, this may be because you are behind a proxy and unable to reach the Azure API. Configure `HTTP_PROXY` and `HTTPS_PROXY` environment variables with your proxy information in your terminal:
>
> ```bash
> # macOS/Linux
> export HTTPS_PROXY=https://username:password@proxy:8080
> export HTTP_PROXY=http://username:password@proxy:8080
> ```
>
> ```ps
> # Windows
> set HTTPS_PROXY=https://username:password@proxy:8080
> set HTTP_PROXY=http://username:password@proxy:8080
> ```

### Verify prerequisites

To verify that all the Azure Functions tools are installed, open the Visual Studio Code Command Palette (F1), select the **Terminal: Create New Integrated Terminal** command, and once the terminal opens, run the command `func`:

![Checking Azure Functions core tools prerequisites](media/tutorial-vs-code-serverless-python/check-prereqs.png)

The output that starts with the Azure Functions logo (you need to scroll the output upwards) indicates that the Azure Functions Core Tools are present.

If the `func` command isn't recognized, then verify that the folder where you installed the Azure Functions Core Tools is included in your PATH environment variable.

> [!div class="nextstepaction"]
> [I ran into an issue](https://www.research.net/r/PWZWZ52?tutorial=python-functions-extension&step=01-verify-prerequisites)

## Create the function

1. Code for Azure Functions is managed within a Functions _project_, which you create first before creating the code. In **Azure: Functions** explorer (opened using the Azure icon on the left side), select the **New Project** command icon, or open the Command Palette (F1) and select **Azure Functions: Create New Project**.

    ![Create new project button in the Functions explorer](media/tutorial-vs-code-serverless-python/project-create-new.png)

1. In the prompts that follow:

    | Prompt | Value | Description | 
    | --- | --- | --- |
    | Specify a folder for the project | Current open folder | The folder in which to create the project. You may want to create the project in a subfolder. |
    | Select a language for your function app project | **Python** | The language to use for the function, which determines the template used for the code. |
    | Select a template for your project's first function | **HTTP trigger** | A function that uses an HTTP trigger is run whenever there's an HTTP request made to the function's endpoint. (There are a variety of other triggers for Azure Functions. To learn more, see [What can I do with Functions?](functions-overview.md#what-can-i-do-with-functions).) |
    | Provide a function name | HttpExample | The name is used for a subfolder that contains the function's code along with configuration data, and also defines the name of the HTTP endpoint. Use "HttpExample" rather than accepting the default "HTTPTrigger" to distinguish the function itself from the trigger. |
    | Authorization level | **Anonymous** | Anonymous authorization makes the function publicly accessible to anyone. |
    | Select how you would like to open your project | **Open in current window** | Opens the project in the current Visual Studio Code window. |

1. After a short time, a message to indicate that the new project was created. In the **Explorer**, there's the subfolder created for the function, and Visual Studio Code opens the *\_\_init\_\_.py* file that contains the default function code:

    [![Result of creating a new Python functions project](media/tutorial-vs-code-serverless-python/project-create-results.png)](media/tutorial-vs-code-serverless-python/project-create-results.png)

    > [!NOTE]
    > If Visual Studio Code tells you that you don't have a Python interpreter selected when it opens *\_\_init\_\_.py*, open the Command Palette (F1), select the **Python: Select Interpreter** command,  and then select the virtual environment in the local `.env` folder (which was created as part of the project). The environment must be based on Python 3.6x specifically, as noted earlier under [Prerequisites](#prerequisites).
    >
    > ![Selecting the virtual environment created with the project](media/tutorial-vs-code-serverless-python/select-venv-interpreter.png)

> [!TIP]
> Whenever you want to create another function in the same project, use the **Create Function** command in the **Azure: Functions** explorer, or open the Command Palette (F1) and select the **Azure Functions: Create Function** command. Both commands prompt you for a function name (which is the name of the endpoint), then creates a subfolder with the default files.
>
> ![New Function command in the Azure: Functions explorer](media/tutorial-vs-code-serverless-python/function-create-new.png)

> [!div class="nextstepaction"]
> [I ran into an issue](https://www.research.net/r/PWZWZ52?tutorial=python-functions-extension&step=02-create-function)

## Examine the code files

In the newly created function subfolder are three files: *\_\_init\_\_.py* contains the function's code, *function.json* describes the function to Azure Functions, and *sample.dat* is a sample data file. You can delete *sample.dat* if you want, as it exists only to show that you can add other files to the subfolder.

Let's look at *function.json* first, then the code in *\_\_init\_\_.py*.

### function.json

The function.json file provides the necessary configuration information for the Azure Functions endpoint:

```json
{
  "scriptFile": "__init__.py",
  "bindings": [
    {
      "authLevel": "anonymous",
      "type": "httpTrigger",
      "direction": "in",
      "name": "req",
      "methods": [
        "get",
        "post"
      ]
    },
    {
      "type": "http",
      "direction": "out",
      "name": "$return"
    }
  ]
}
```

The `scriptFile` property identifies the startup file for the code, and that code must contain a Python function named `main`. You can factor your code into multiple files so long as the file specified here contains a `main` function.

The `bindings` element contains two objects, one to describe incoming requests, and the other to describe the HTTP response. For incoming requests (`"direction": "in"`), the function responds to HTTP GET or POST requests and doesn't require authentication. The response (`"direction": "out"`) is an HTTP response that returns whatever value is returned from the `main` Python function.

### \_\_init.py\_\_

When you create a new function, Azure Functions provides default Python code in *\_\_init\_\_.py*:

```python
import logging

import azure.functions as func


def main(req: func.HttpRequest) -> func.HttpResponse:
    logging.info('Python HTTP trigger function processed a request.')

    name = req.params.get('name')
    if not name:
        try:
            req_body = req.get_json()
        except ValueError:
            pass
        else:
            name = req_body.get('name')

    if name:
        return func.HttpResponse(f"Hello {name}!")
    else:
        return func.HttpResponse(
             "Please pass a name on the query string or in the request body",
             status_code=400
        )
```

The important parts of the code are as follows:

- You must import `func` from `azure.functions`; importing the logging module is optional but recommended.
- The required `main` Python function receives a `func.request`  object named `req`, and returns a value of type `func.HttpResponse`. You can learn more about the capabilities of these objects in the [func.HttpRequest](/python/api/azure-functions/azure.functions.httprequest?view=azure-python) and [func.HttpResponse](/python/api/azure-functions/azure.functions.httpresponse?view=azure-python) references.
- The body of `main` then processes the request and generates a response. In this case, the code looks for a `name` parameter in the URL. Failing that, it checks if the request body contains JSON (using `func.HttpRequest.get_json`) and that the JSON contains a `name` value (using the `get` method of the JSON object returned by `get_json`).
- If a name is found, the code returns the string "Hello" with the name appended; otherwise it returns an error message.

> [!div class="nextstepaction"]
> [I ran into an issue](https://www.research.net/r/PWZWZ52?tutorial=python-functions-extension&step=03-examine-code-files)

## Debug locally

1. When you create the Functions project, the Visual Studio Code extension also creates a launch configuration in `.vscode/launch.json` that contains a single configuration named **Attach to Python Functions**. This configuration means you can just press F5 or use the Debug explorer to start the project:

    ![Debug explorer showing the Functions launch configuration](media/tutorial-vs-code-serverless-python/launch-configuration.png)

1. When you start the debugger, a terminal opens showing output from Azure Functions, including a summary of the available endpoints. Your URL might be different if you used a name other than "HttpExample":

    ```output
    Http Functions:

            HttpExample: [GET,POST] http://localhost:7071/api/HttpExample
    ```

1. Use **Ctrl+click** or **Cmd+click** on the URL in the Visual Studio Code **Output** window to open a browser to that address, or start a browser and paste in the same URL. In either case, the endpoint is `api/<function_name>`, in this case `api/HttpExample`. However, because that URL doesn't include a name parameter, the browser window should just show, "Please pass a name on the query string or in the request body" as appropriate for that path in the code.

1. Now try adding a name parameter to the use, such as `http://localhost:7071/api/HttpExample?name=VS%20Code`, and the browser window should display the message, "Hello Visual Studio Code!", demonstrating that you've run that code path.

1. To pass the name value in a JSON request body, you can use a tool like curl with the JSON inline:

    ```bash
    # Mac OS/Linux: modify the URL if you're using a different function name
    curl --header "Content-Type: application/json" --request POST \
        --data {"name":"Visual Studio Code"} http://localhost:7071/api/HttpExample
    ```

    ```ps
    # Windows (escaping on the quotes is necessary; also modify the URL
    # if you're using a different function name)
    curl --header "Content-Type: application/json" --request POST \
        --data {"""name""":"""Visual Studio Code"""} http://localhost:7071/api/HttpExample
    ```

    Alternately, create a file like *data.json* that contains `{"name":"Visual Studio Code"}` and use the command `curl --header "Content-Type: application/json" --request POST --data @data.json http://localhost:7071/api/HttpExample`.

1. To test debugging the function, set a breakpoint on the line that reads `name = req.params.get('name')` and make a request to the URL again. The Visual Studio Code debugger should stop on that line, allowing you to examine variables and step through the code. (For a short walkthrough of basic debugging, see [Visual Studio Code Tutorial - Configure and run the debugger](https://code.visualstudio.com/docs/python/python-tutorial.md#configure-and-run-the-debugger).)

1. When you're satisfied that you've thoroughly tested the function locally, stop the debugger (with the **Debug** > **Stop Debugging** menu command or the **Disconnect** command on the debugging toolbar).

> [!div class="nextstepaction"]
> [I ran into an issue](https://www.research.net/r/PWZWZ52?tutorial=python-functions-extension&step=04-test-debug)

## Deploy to Azure Functions

In these steps, you use the Functions extension to create a function app in Azure, along with other required Azure resources. A function app lets you group functions as a logic unit for easier management, deployment, and sharing of resources. It also requires an Azure Storage account for data and a [hosting plan](functions-scale.md#hosting-plan-support). All of these resources are organized within a single resource group.

1. In the **Azure: Functions** explorer, select the **Deploy to Function App** command, or open the Command Palette (F1) and select the **Azure Functions: Deploy to Function App** command. Again, the function app is where your Python project runs in Azure.

    ![Deploy to Function App command](media/tutorial-vs-code-serverless-python/deploy-command.png)

1. When prompted, select **Create New Function App in Azure**, and provide a name that's unique across Azure (typically using your personal or company name along with other unique identifiers; you can use letters, numbers, and hyphens). If you previously created a Function App, its name appears in this list of options.

1. The extension performs the following actions, which you can observe in Visual Studio Code popup messages and the **Output** window (the process takes a few minutes):

    - Create a resource group using the name you gave (removing hyphens).
    - In that resource group, create the storage account, hosting plan, and function app. By default, a [Consumption plan](functions-scale.md#consumption-plan) is created. To run your functions in a dedicated plan, you need to [enable publishing with advanced create options](functions-develop-vs-code.md).
    - Deploy your code to the function app.

    The **Azure: Functions** explorer also shows progress:

    ![Deployment progress indicator in the Azure: Functions explorer](media/tutorial-vs-code-serverless-python/deploy-progress.png)

1. Once deployment is complete, the Azure Functions extension displays a message with buttons for three additional actions:

    ![Message indicating successful deployment with additional actions](media/tutorial-vs-code-serverless-python/deployment-popup.png)

    For **Stream logs** and **Upload settings**, see the next sections. For **View output**, see step 5 that follows.

1. After deployment, the **Output** window also shows the public endpoint on Azure:

    ```output
    HTTP Trigger Urls:
      HttpExample: https://vscode-azure-functions.azurewebsites.net/api/HttpExample
    ```

    Use this endpoint to run the same tests you did locally, using URL parameters and/or requests with JSON data in the request body. The results of the public endpoint should match the results of the local endpoint you tested earlier.

> [!div class="nextstepaction"]
> [I ran into an issue](https://www.research.net/r/PWZWZ52?tutorial=python-functions-extension&step=05-deploy)

### Stream logs

Support for log streaming is currently in development, as described on [Issue 589](https://github.com/microsoft/vscode-azurefunctions/issues/589) for the Azure Functions extension. The **Stream logs** button in the deployment message popup will eventually connect the log output on Azure to Visual Studio Code. You will also be able to start and stop the log stream on the **Azure Functions** explorer by right-clicking the Functions project and selecting **Start streaming logs** or **Stop streaming logs**.

At present, however, these commands aren't yet operational. Log streaming is instead available in a browser by running the following command, replacing `<app_name>` with the name of your Functions app on Azure:

```bash
# Replace <app_name> with the name of your Functions app on Azure
func azure functionapp logstream <app_name> --browser
```

### Sync local settings to Azure

The **Upload settings** button in the deployment message popup applies any changes you've made to your *local.settings.json* file to Azure. You can also invoke the command on the **Azure Functions** explorer by expanding the Functions project node, right-clicking **Application Settings**, and selecting **Upload local settings...**. You can also use the Command Palette to select the **Azure Functions: Upload Local Settings** command.

Uploading settings updates any existing settings and adds any new settings defined in *local.settings.json*. Uploading doesn't remove any settings from Azure that aren't listed in the local file. To remove those settings, expand the **Applications Settings** node in the **Azure Functions** explorer, right-click the setting, and select **Delete Setting...**. You can also edit settings directly on the Azure portal.

To apply any changes you make through the portal or through the **Azure Explorer** to the *local.settings.json* file, right-click the **Application Settings** node and select the **Download remote settings...** command. You can also use the Command Palette to select the **Azure Functions: Download Remote Settings** command.

## Add a second Function

After your first deployment, you can make changes to your code, such as adding additional functions, and redeploy to the same Functions App.

1. In the **Azure: Functions** explorer, select the **Create Function** command or use **Azure Functions: Create Function** from the Command Palette. Specify the following details for the function:

    - Template: HTTP trigger
    - Name: "DigitsOfPi"
    - Authorization level: Anonymous

1. In the Visual Studio Code file explorer is a subfolder with your function name that again contains files named *\_\_init\_\_.py*, *function.json*, and *sample.dat*.

1. Replace the contents of *\_\_init\_\_.py* to match the following code, which generates a string containing the value of PI to a number of digits specified in the URL (this code uses only a URL parameter)

    ```python
    import logging

    import azure.functions as func

    """ Adapted from the second, shorter solution at http://www.codecodex.com/wiki/Calculate_digits_of_pi#Python
    """

    def pi_digits_Python(digits):
        scale = 10000
        maxarr = int((digits / 4) * 14)
        arrinit = 2000
        carry = 0
        arr = [arrinit] * (maxarr + 1)
        output = ""

        for i in range(maxarr, 1, -14):
            total = 0
            for j in range(i, 0, -1):
                total = (total * j) + (scale * arr[j])
                arr[j] = total % ((j * 2) - 1)
                total = total / ((j * 2) - 1)

            output += "%04d" % (carry + (total / scale))
            carry = total % scale

        return output;

    def main(req: func.HttpRequest) -> func.HttpResponse:
        logging.info('DigitsOfPi HTTP trigger function processed a request.')

        digits_param = req.params.get('digits')

        if digits_param is not None:
            try:
                digits = int(digits_param)
            except ValueError:
                digits = 10   # A default

            if digits > 0:
                digit_string = pi_digits_Python(digits)

                # Insert a decimal point in the return value
                return func.HttpResponse(digit_string[:1] + '.' + digit_string[1:])

        return func.HttpResponse(
             "Please pass the URL parameter ?digits= to specify a positive number of digits.",
             status_code=400
        )
    ```

1. Because the code supports only HTTP GET, modify *function.json* so that the `"methods"` collection contains only `"get"` (that is, remove `"post"`). The whole file should appear as follows:

    ```json
    {
      "scriptFile": "__init__.py",
      "bindings": [
        {
          "authLevel": "anonymous",
          "type": "httpTrigger",
          "direction": "in",
          "name": "req",
          "methods": [
            "get"
          ]
        },
        {
          "type": "http",
          "direction": "out",
          "name": "$return"
        }
      ]
    }
    ```

1. Start the debugger by pressing F5 or selecting the **Debug** > **Start Debugging** menu command. The **Output** window should now show both endpoints in your project:

    ```output
    Http Functions:

            DigitsOfPi: [GET] http://localhost:7071/api/DigitsOfPi

            HttpExample: [GET,POST] http://localhost:7071/api/HttpExample
    ```

1. In a browser, or from curl, make a request to `http://localhost:7071/api/DigitsOfPi?digits=125` and observe the output. (You might notice that the code algorithm isn't entirely accurate, but we'll leave the improvements to you!) Stop the debugger when you're finished.

1. Redeploy the code by using the **Deploy to Function App** in the **Azure: Functions** explorer. If prompted, select the Function App created previously.

1. Once deployment finishes (it takes a few minutes!), the **Output** window shows the public endpoints with which you can repeat your tests.

> [!div class="nextstepaction"]
> [I ran into an issue](https://www.research.net/r/PWZWZ52?tutorial=python-functions-extension&step=06-second-function)

## Add a binding to write messages to Azure storage

A _binding_ let you connect your function code to resources, such as Azure storage, without writing any data access code. A binding is defined in the *function.json* file and can represent both input and output. A function can use multiple input and output bindings, but only one trigger. To learn more, see [Azure Functions triggers and bindings concepts](functions-triggers-bindings.md).

In this section, you add a storage binding to the HttpExample function created earlier in this tutorial. The function uses this binding to write messages to storage with each request. The storage in question uses the same default storage account used by the function app. If you plan on making heavy use of storage, however, you would want to consider creating a separate account.

1. Sync the remote settings for your Azure Functions project into your *local.settings.json* file by opening the Command Palette and selecting **Azure Functions: Download Remote Settings**. Open *local.settings.json* and check that it contains a value for `AzureWebJobsStorage`. That value is the connection string for the storage account.

1. In the `HttpExample` folder, right-click the *function.json*, select **Add binding**:

    ![Add binding command in the Visual Studio Code explorer](media/tutorial-vs-code-serverless-python/add-binding-command.png)

1. In the prompts that follow in Visual Studio Code, select or provide the following values:

    | Prompt | Value to provide |
    | --- | --- |
    | Set binding direction | out |
    | Select binding with direction out | Azure Queue Storage |
    | The name used to identify this binding in your code | msg |
    | The queue to which the message will be sent | outqueue |
    | Select setting from *local.settings.json* (asking for the storage connection) | AzureWebJobsStorage |

1. After making these selections, verify that the following binding is added to your *function.json* file:

    ```json
        {
          "type": "queue",
          "direction": "out",
          "name": "msg",
          "queueName": "outqueue",
          "connection": "AzureWebJobsStorage"
        }
    ```

1. Now that you've configured the binding, you can use it in your function code. Again, the newly defined binding appears in your code as an argument to the `main` function in *\_\_init\_\_.py*. For example, you can modify the *\_\_init\_\_.py* file in HttpExample to match the following, which shows using the `msg` argument to write a timestamped message with the name used in the request. The comments explain the specific changes:

    ```python
    import logging
    import datetime  # MODIFICATION: added import
    import azure.functions as func

    # MODIFICATION: the added binding appears as an argument; func.Out[func.QueueMessage]
    # is the appropriate type for an output binding with "type": "queue" (in function.json).
    def main(req: func.HttpRequest, msg: func.Out[func.QueueMessage]) -> func.HttpResponse:
        logging.info('Python HTTP trigger function processed a request.')

        name = req.params.get('name')
        if not name:
            try:
                req_body = req.get_json()
            except ValueError:
                pass
            else:
                name = req_body.get('name')

        if name:
            # MODIFICATION: write the a message to the message queue, using msg.set
            msg.set(f"Request made for {name} at {datetime.datetime.now()}")

            return func.HttpResponse(f"Hello {name}!")
        else:
            return func.HttpResponse(
                 "Please pass a name on the query string or in the request body",
                 status_code=400
            )
    ```

1. To test these changes locally, start the debugger again in Visual Studio Code by pressing F5 or selecting the **Debug** > **Start Debugging** menu command. As before the **Output** window should show the endpoints in your project.

1. In a browser, visit the URL `http://localhost:7071/api/HttpExample?name=VS%20Code` to create a request to the HttpExample endpoint, which should also write a message to the queue.

1. To verify that the message was written to the "outqueue" queue (as named in the binding), you can use one of three methods:

    1. Sign into the [Azure portal](https://portal.azure.com), and navigate to the resource group containing your functions project. Within that resource group, local and navigate into the storage account for the project, then navigate into **Queues**. On that page, navigate into "outqueue", which should display all the logged messages.

    1. Navigate and examine the queue with either the Azure Storage Explorer, which integrates with Visual Studio, as described on [Connect Functions to Azure Storage using Visual Studio Code](functions-add-output-binding-storage-queue-vs-code.md), especially the [Examine the output queue](functions-add-output-binding-storage-queue-vs-code.md#examine-the-output-queue) section.

    1. Use the Azure CLI to query the storage queue, as described on [Query the storage queue](functions-add-output-binding-storage-queue-python.md#query-the-storage-queue).
    
1. To test in the cloud, redeploy the code by using the **Deploy to Function App** in the **Azure: Functions** explorer. If prompted, select the Function App created previously. Once deployment finishes (it takes a few minutes!), the **Output** window again shows the public endpoints with which you can repeat your tests.

> [!div class="nextstepaction"]
> [I ran into an issue](https://www.research.net/r/PWZWZ52?tutorial=python-functions-extension&step=07-storage-binding)

## Clean up resources

The Function App you created includes resources that can incur minimal costs (refer to [Functions Pricing](https://azure.microsoft.com/pricing/details/functions/)). To clean up the resources, right-click the Function App in the **Azure: Functions** explorer and select **Delete Function App**. You can also visit the [Azure portal](https://portal.azure.com), select **Resource groups** from the left-side navigation pane, select the resource group that was created in the process of this tutorial, and then use the **Delete resource group** command.

## Next steps

Congratulations on completing this walkthrough of deploying Python code to Azure Functions! You're now ready to create many more serverless functions.

As noted earlier, you can learn more about the Functions extension by visiting its GitHub repository, [vscode-azurefunctions](https://github.com/Microsoft/vscode-azurefunctions). Issues and contributions are also welcome.

Read the [Azure Functions Overview](functions-overview.md) to explore the different triggers you can use.

To learn more about Azure services that you can use from Python, including data storage along with AI and Machine Learning services, visit [Azure Python Developer Center](/azure/python/?view=azure-python).

There are also other Azure extensions for Visual Studio Code that you may find helpful. Just search on "Azure" in the Extensions explorer:

![Azure extensions for Visual Studio Code](media/tutorial-vs-code-serverless-python/azure-extensions.png)

Some popular extensions are:

- [Cosmos DB](https://marketplace.visualstudio.com/items?itemName=ms-azuretools.vscode-cosmosdb)
- [Azure App Service](https://marketplace.visualstudio.com/items?itemName=ms-azuretools.vscode-azureappservice)
- [Azure CLI Tools](https://marketplace.visualstudio.com/items?itemName=ms-vscode.azurecli)
- [Azure Resource Manager Tools](https://marketplace.visualstudio.com/items?itemName=msazurermtools.azurerm-vscode-tools)
