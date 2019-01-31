# Create your first PowerShell function in Azure (preview)

This quickstart article walks you through how to use the Azure CLI to create your first
[serverless](https://azure.com/serverless) PowerShell function app running on Windows or Linux.
The function code is created locally and then deployed to Azure by using the
[Azure Functions Core Tools](functions-run-local.md).
To learn more about preview considerations for running your function apps on Linux,
see [this Functions on Linux article](https://aka.ms/funclinux).

The following steps are supported on a Mac, Windows, or Linux computer.

## Prerequisites

To run and debug functions locally, you will need to:

* Install [PowerShell Core](https://docs.microsoft.com/powershell/scripting/install/installing-powershell#powershell-core)
* Install the [.NET Core SDK 2.1+](https://www.microsoft.com/net/download)
* Install [Azure Functions Core Tools](functions-run-local.md#v2) version 2.4.299 or later
  (update as often as possible)

To publish and run in Azure:

* Install [Azure PowerShell](https://docs.microsoft.com/powershell/azure/install-az-ps)
  OR install the [Azure CLI](cli/azure/install-azure-cli) version 2.x or later.
* You need an active Azure subscription.
  [!INCLUDE [quickstarts-free-trial-note](../../includes/quickstarts-free-trial-note.md)]

## Initializing a Function App

The first thing we need to get started is a Function App.
A Function App is like a folder of all of your functions that will be running in the same instance.

To create a PowerShell Function App we will create and cd into the directory we want our app to go in and then initialize the Function App:

```bash
mkdir AwesomeFuncApp
cd AwesomeFuncApp
func init --worker-runtime powershell
```

You should see something like this:

```output
PS > func init --worker-runtime powershell
Writing .gitignore
Writing host.json
Writing local.settings.json
PS >
```

We now have a Function App, but it's empty. There are no actual Functions inside. Let's create one.

## Creating a Function

Now that we have a Function App, we need to create a Function inside of it. A Function will contain the actual script of yours that will get executed.

To create a Function in the Function App we created above, simply run:

```
func new -l powershell -t HttpTrigger -n MyHttpTrigger
```

You should see something like:
```
PS > func new -l powershell -t HttpTrigger -n MyHttpTrigger
Select a template: HttpTrigger
Function name: [HttpTrigger] Writing /home/tyler/Code/PowerShell/TesingFunctions123/MyHttpTrigger/run.ps1
Writing /home/tyler/Code/PowerShell/TesingFunctions123/MyHttpTrigger/sample.dat
Writing /home/tyler/Code/PowerShell/TesingFunctions123/MyHttpTrigger/function.json
The function "MyHttpTrigger" was created successfully from the "HttpTrigger" template.
PS >
```

- The `-l` stands for the _language_ you would like to use
- The `-t` stands for the _template_ you would like to work off of
- The `-n` stands for the _name_ of the Function you are creating

Here we are using the "HttpTrigger" template. It's a simple template that allows you to trigger your Function using an HTTP request.

Our directory structure should look like this:

```
PS > dir -Recurse


    Directory: /home/tyler/Code/PowerShell/TesingFunctions123


Mode                LastWriteTime         Length Name
----                -------------         ------ ----
d-----           11/1/18  5:41 PM                MyHttpTrigger
------           11/1/18  5:41 PM             25 host.json
------           11/1/18  5:41 PM            142 local.settings.json


    Directory: /home/tyler/Code/PowerShell/TesingFunctions123/MyHttpTrigger


Mode                LastWriteTime         Length Name
----                -------------         ------ ----
------           11/1/18  5:41 PM            300 function.json
------           11/1/18  5:41 PM            689 run.ps1
------           11/1/18  5:41 PM             27 sample.dat

```

Let's run through what each of these files do:

- _MyHttpTrigger_ - The folder the contains the Function
- _host.json_ - Contains global configuration options that affect all functions for a function app
- _local.settings.json_ - Contains the configuration settings for your Function App that can be published to "Application Settings" in your Azure Function App environment

- _function.json_ - Contains the configuration metadata for the Function and the definition of input and output bindings
- _run.ps1_ - This is the script that will be executed when a Function is triggered
- _sample.dat_ - Contains the sample data that will be displayed in the Azure Portal for testing purposes

> [!NOTE]
> For more information on input and output bindings, checkout the [Binding usage guide here]().

We now have a Function inside of a Function App and are ready to run and test it out!

## Running a Function App

To run a function app locally for testing purposes, all you have to do is run this inside of the Function App directory:

```
func start
```

You should see something like:

```
PS > func start

                  %%%%%%
                 %%%%%%
            @   %%%%%%    @
          @@   %%%%%%      @@
       @@@    %%%%%%%%%%%    @@@
     @@      %%%%%%%%%%        @@
       @@         %%%%       @@
         @@      %%%       @@
           @@    %%      @@
                %%
                %

Azure Functions Core Tools (2.1.748 Commit hash: 5db20665cf0c11bedaffc96d81c9baef7456acb3)
Function Runtime Version: 2.0.12134.0
[11/2/18 1:24:09 AM] Building host: startup suppressed:False, configuration suppressed: False
[11/2/18 1:24:09 AM] Reading host configuration file '/home/tyler/Code/PowerShell/testingfunc/host.json'
[11/2/18 1:24:09 AM] Host configuration file read:
[11/2/18 1:24:09 AM] {
[11/2/18 1:24:09 AM]   "version": "2.0"
[11/2/18 1:24:09 AM] }
[11/2/18 1:24:09 AM] Initializing Host.
[11/2/18 1:24:09 AM] Host initialization: ConsecutiveErrors=0, StartupCount=1
[11/2/18 1:24:09 AM] Starting JobHost
[11/2/18 1:24:09 AM] Starting Host (HostId=tylerthinkpadx1carbon-194536703, InstanceId=b6520196-09f7-4c53-8d60-84700a53fa1b, Version=2.0.12134.0, ProcessId=3851, AppDomainId=1, Debug=False, FunctionsExtensionVersion=)
[11/2/18 1:24:09 AM] Loading functions metadata
[11/2/18 1:24:09 AM] 1 functions loaded
[11/2/18 1:24:09 AM] Starting language worker process:dotnet  "/usr/lib/azure-functions-core-tools/workers/powershell/Microsoft.Azure.Functions.PowerShellWorker.dll" --host 127.0.0.1 --port 45399 --workerId 6fb34395-f6ec-41ec-893a-fa3cb517548d --requestId f62b51b0-10cd-4268-8585-4353395567a8 --grpcMaxMessageLength 134217728
[11/2/18 1:24:09 AM] dotnet process with Id=3874 started
[11/2/18 1:24:09 AM] Generating 1 job function(s)
[11/2/18 1:24:09 AM] Found the following functions:
[11/2/18 1:24:09 AM] Host.Functions.MyHttpTrigger
[11/2/18 1:24:09 AM] 
[11/2/18 1:24:09 AM] Host initialized (363ms)
[11/2/18 1:24:09 AM] Host started (374ms)
[11/2/18 1:24:09 AM] Job host started
Hosting environment: Production
Content root path: /home/tyler/Code/PowerShell/testingfunc
Now listening on: http://0.0.0.0:7071
Application started. Press Ctrl+C to shut down.
Listening on http://0.0.0.0:7071/
Hit CTRL-C to exit...

Http Functions:

	MyHttpTrigger: [GET,POST] http://localhost:7071/api/MyHttpTrigger

[11/2/18 1:24:11 AM] Request Id: 
[11/2/18 1:24:11 AM] Invocation Id: 
[11/2/18 1:24:11 AM] Log Message:
[11/2/18 1:24:11 AM] Required environment variables to authenticate to Azure were not present
[11/2/18 1:24:14 AM] Host lock lease acquired by instance ID '000000000000000000000000AA1493E8'.
```

If you open up `http://localhost:7071/api/MyHttpTrigger` in a browser, you should get:

```
PS > irm http://localhost:7071/api/MyHttpTrigger
irm : Please pass a name on the query string or in the request body.
At line:1 char:1
+ irm http://localhost:7071/api/MyHttpTrigger
+ ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
+ CategoryInfo          : InvalidOperation: (Method: GET, Re...rShell/6.2.0
}:HttpRequestMessage) [Invoke-RestMethod], HttpResponseException
+ FullyQualifiedErrorId : WebCmdletWebResponseException,Microsoft.PowerShell.Commands.InvokeRestMethodCommand
```

This error is expected to be thrown if you look at the `run.ps1`. To get back a proper 200 response, we need to supply a query parameter called "Name":

```
PS > irm http://localhost:7071/api/MyHttpTrigger?Name=PowerShell
Hello PowerShell
```

We have successfully started our Function App locally! Now let's publish it to Azure.

## Publishing a Function App

### Prerequisites

As a prerequisite of this section, you should have followed the guide on "Deploying a new PowerShell Azure Function App" as you will need an existing PowerShell Function App deployed to Azure in order to publish.

In addition to an existing Function App, you will also need to have Azure PowerShell or the Azure CLI as the Azure Functions Core Tools depends on it for publishing. 

#### Azure PowerShell

To get Azure PowerShell, you can run:

```powershell
Install-Module Az
```

> [!NOTE]
> If you have the AzureRM module, that works fine too. However, the Az module is recommended.

Once installed, you can login in to Azure PowerShell by running the following command and following the prompt:

```powershell
Login-AzAccount
```

Once you login, you're ready to publish!

#### Azure CLI

To get the Azure CLI, [go here](https://docs.microsoft.com/en-us/cli/azure/install-azure-cli?view=azure-cli-latest).

Once installed, you can login in to Azure CLI by running the following command and following the prompt:
```powershell
az login
```

Once you login, you're ready to publish!

### Publish

To publish our Function App, all you need to do is run:

```
func azure functionapp publish <Name Of Function App in Azure>
```

> [!NOTE]
> You might be asked to supply the `--nozip` parameter. That's okay!


You should see:

```
PS > func azure functionapp publish AwesomePSFunc
Getting site publishing info...
Creating archive for current directory...
Uploading archive...
Upload completed successfully.
Functions in AwesomePSFunc:
    MyHttpTrigger - [httpTrigger]
        Invoke url: http://awesomepsfunc.azurewebsites.net/api/myhttptrigger?code=8fLQn8PM8wDRXDxhr0/ZWbulJgHPLZTPoH8KagmLbA9jaMheybRwtw==
PS >
```

Your Function App is now deployed to Azure and can be invoked using the URL above:

```
PS > irm 'http://awesomepsfunc.azurewebsites.net/api/myhttptrigger?code=8fLQn8PM8wDRXDxhr0/ZWbulJgHPLZTPoH8KagmLbA9jaMheybRwtw==&Name=PowerShell'
Hello PowerShell
PS >
```

> [!NOTE]
> The `code` query parameter that you see there is a result of the Function's HTTP trigger binding having `"authLevel":"function"` which can be found in the Function's `function.json`.
For more information, take a look at the [official HTTP binding documentation](https://docs.microsoft.com/en-us/azure/azure-functions/functions-bindings-http-webhook#trigger---configuration).
