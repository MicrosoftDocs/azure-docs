---
title: "Troubleshooting | Microsoft Docs"
titleSuffix: Azure Dev Spaces
services: azure-dev-spaces
ms.service: azure-dev-spaces
ms.component: azds-kubernetes
author: ghogen
ms.author: ghogen
ms.date: "09/11/2018"
ms.topic: "article"
description: "Rapid Kubernetes development with containers and microservices on Azure"
keywords: "Docker, Kubernetes, Azure, AKS, Azure Kubernetes Service, containers"
manager: douge
---
# Troubleshooting guide

This guide contains information about common problems you may have when using Azure Dev Spaces.

## Enabling detailed logging

In order to troubleshoot problems more effectively, it may help to create more detailed logs for review.

For the Visual Studio extension, set the `MS_VS_AZUREDEVSPACES_TOOLS_LOGGING_ENABLED` environment variable to 1. Be sure to restart Visual Studio for the environment variable to take effect. Once enabled, detailed logs will be written to your `%TEMP%\Microsoft.VisualStudio.Azure.DevSpaces.Tools` directory.

In the CLI, you can output more information during command execution by using the `--verbose` switch. You can also browse more detailed logs in `%TEMP%\Azure Dev Spaces`. On a Mac, the TEMP directory can be found by running `echo $TMPDIR` from a terminal window. On a Linux computer, the TEMP directory is usually `/tmp`.

## Debugging services with multiple instances

At this time, Azure Dev Spaces works best when debugging a single instance (pod). The azds.yaml file contains a setting, replicaCount, that indicates the number of pods that will be run for your service. If you change the replicaCount to configure your app to run multiple pods for a given service, the debugger will attach to the first pod (when listed alphabetically). If that pod recycles for any reason, the debugger will attach to a different pod, possibly resulting in unexpected behavior.

## Error 'Failed to create Azure Dev Spaces controller'

You might see this error when something goes wrong with the creation of the controller. If it's a transient error, deleting and recreating the controller will fix it.

### Try:

To delete the controller, use the Azure Dev Spaces CLI. It’s not possible to do it in Visual Studio or Cloud Shell. To install the AZDS CLI, first install the Azure CLI, and then run this command:

```cmd
az aks use-dev-spaces -g <resource group name> -n <cluster name>
```

And then run this command to delete the controller:

```cmd
azds remove -g <resource group name> -n <cluster name>
```

Recreating the controller can be done from the CLI or Visual Studio. Follow the instructions in the tutorials as if starting for the first time.


## Error 'Service cannot be started.'

You might see this error when your service code fails to start. The cause is often in user code. To get more diagnostic information, make the following changes to your commands and settings:

### Try:

On the command line:

When using _azds.exe_, use the --verbose command-line option, and use the --output command-line option to specify the output format.
 
    ```cmd
    azds up --verbose --output json
    ```

In Visual Studio:

1. Open **Tools > Options** and under **Projects and Solutions**, choose **Build and Run**.
2. Change the settings for **MSBuild project build output verbosity** to **Detailed** or **Diagnostic**.

    ![Screenshot of Tools Options dialog](media/common/VerbositySetting.PNG)
    
You may see this error when attempting to use a multi-stage Dockerfile. The verbose output will look like this:

```cmd
$ azds up
Using dev space 'default' with target 'AksClusterName'
Synchronizing files...6s
Installing Helm chart...2s
Waiting for container image build...10s
Building container image...
Step 1/12 : FROM [imagename:tag] AS base
Error parsing reference: "[imagename:tag] AS base" is not a valid repository/tag: invalid reference format
Failed to build container image.
Service cannot be started.
```

This is because AKS nodes run an older version of Docker that does not support multi-stage builds. You will need to rewrite your Dockerfile to avoid multi-stage builds.

## DNS name resolution fails for a public URL associated with a Dev Spaces service

When DNS name resolution fails, you might see a "Page cannot be displayed" or "This site cannot be reached" error in your web browser when attempting to connect to the public URL associated with a Dev Spaces service.

### Try:

You can use the following command to list out all URLs associated with your Dev Spaces services:

```cmd
azds list-uris
```

If a URL is in the *Pending* state, that means that Dev Spaces is still waiting for DNS registration to complete. Sometimes, it takes a few minutes for registration to complete. Dev Spaces also opens a localhost tunnel for each service, which you can use while waiting on DNS registration.

If a URL remains in the *Pending* state for more than 5 minutes, it may indicate a problem with the external DNS pod that creates the public endpoint and/or the nginx ingress controller pod that acquires the public endpoint. You can use the following commands to delete these pods. They will be recreated automatically.

```cmd
kubectl delete pod -n kube-system -l app=addon-http-application-routing-external-dns
kubectl delete pod -n kube-system -l app=addon-http-application-routing-nginx-ingress
```

## Error 'Required tools and configurations are missing'

This error might occur when launching VS Code: "[Azure Dev Spaces] Required tools and configurations to build and debug '[project name]' are missing."
The error means that azds.exe is not in the PATH environment variable, as seen in VS Code.

### Try:

Launch VS Code from a command prompt where the PATH environment variable is set properly.

## Error 'azds' is not recognized as an internal or external command, operable program, or batch file
 
You might see this error if azds.exe is not installed or configured correctly.

### Try:

1. Check the location %ProgramFiles%/Microsoft SDKs\Azure\Azure Dev Spaces CLI (Preview) for azds.exe. If it's there, add that location to the PATH environment variable.
2. If azds.exe is not installed, run the following command:

    ```cmd
    az aks use-dev-spaces -n <cluster-name> -g <resource-group>
    ```

## Warning 'Dockerfile could not be generated due to unsupported language'
Azure Dev Spaces provides native support for C# and Node.js. When you run *azds prep* in a directory containing code written in one of these languages, Azure Dev Spaces will automatically create an appropriate Dockerfile for you.

You can still use Azure Dev Spaces with code written in other languages, but you will need to create the Dockerfile yourself prior to running *azds up* for the first time.

### Try:
If your application is written in a language that Azure Dev Spaces does not natively support, you'll need to provide an appropriate Dockerfile to build a container image running your code. Docker provides a [list of best practices for writing Dockerfiles](https://docs.docker.com/develop/develop-images/dockerfile_best-practices/) as well as a [Dockerfile reference](https://docs.docker.com/engine/reference/builder/) that can help you write a Dockerfile that suits your needs.

Once you have an appropriate Dockerfile in place, you can proceed with running *azds up* to run your application in Azure Dev Spaces.

## Error 'upstream connect error or disconnect/reset before headers'
You may see this error when trying to access your service. For example, when you go to the service's URL in a browser. 

### Reason 
The container port isn't available. This problem could occur because: 
* The container is still in the process of being built and deployed. This issue can arise if you run `azds up` or start the debugger, and then try to access the container before it has successfully deployed.
* Port configuration is not consistent across your _Dockerfile_, Helm Chart, and any server code that opens up a port.

### Try:
1. If the container is in the process of being built/deployed, you can wait 2-3 seconds and try accessing the service again. 
1. Check your port configuration. The specified port numbers should be **identical** in all the assets below:
    * **Dockerfile:** Specified by the `EXPOSE` instruction.
    * **[Helm chart](https://docs.helm.sh):** Specified by the `externalPort` and `internalPort` values for a service (often located in a `values.yml` file),
    * Any ports being opened up in application code, for example in Node.js: `var server = app.listen(80, function () {...}`


## Config file not found
You run `azds up` and get the following error: `Config file not found: .../azds.yaml`

### Reason
You must run `azds up` from the root directory of the code you want to run, and you must initialize the code folder to run with Azure Dev Spaces.

### Try:
1. Change your current directory to the root folder containing your service code. 
1. If you do not have a _azds.yaml_ file in the code folder, run `azds prep` to generate Docker, Kubernetes, and Azure Dev Spaces assets.

## Error: 'The pipe program 'azds' exited unexpectedly with code 126.'
Starting the VS Code debugger may sometimes result in this error.

### Try:
1. Close and reopen VS Code.
2. Hit F5 again.

## Debugging error 'Failed to find debugger extension for type:coreclr'
Running the VS Code debugger reports the error: `Failed to find debugger extension for type:coreclr.`

### Reason
You do not have the VS Code extension for C# installed on your development machine. The C# extension includes debugging support for .Net Core (CoreCLR).

### Try:
Install the [VS Code extension for C#](https://marketplace.visualstudio.com/items?itemName=ms-vscode.csharp).

## Debugging error 'Configured debug type 'coreclr' is not supported'
Running the VS Code debugger reports the error: `Configured debug type 'coreclr' is not supported.`

### Reason
You do not have the VS Code extension for Azure Dev Spaces installed on your development machine.

### Try:
Install the [VS Code extension for Azure Dev Spaces](get-started-netcore.md).

## The type or namespace name 'MyLibrary' could not be found

### Reason 
The build context is at the project/service level by default, therefore a library project you're using won't be found.

### Try:
What needs to be done:
1. Modify the _azds.yaml_ file to set the build context to the solution level.
2. Modify the _Dockerfile_ and _Dockerfile.develop_ files to refer to the project (_.csproj_) files correctly, relative to the new build context.
3. Place a _.dockerignore_ file beside the .sln file and modify as needed.

You can find an example at https://github.com/sgreenmsft/buildcontextsample

## 'Microsoft.DevSpaces/register/action' authorization error
You might see the following error when you are managing an Azure Dev Space and you are working in an Azure subscription for which you do not have Owner or Contributor access.
`The client '<User email/Id>' with object id '<Guid>' does not have authorization to perform action 'Microsoft.DevSpaces/register/action' over scope '/subscriptions/<Subscription Id>'.`

### Reason
The selected Azure subscription has not registered the `Microsoft.DevSpaces` namespace.

### Try:
Someone with Owner or Contributor access to the Azure subscription can run the following Azure CLI command to manually register the `Microsoft.DevSpaces` namespace:

```cmd
az provider register --namespace Microsoft.DevSpaces
```

## "Error: could not find a ready tiller pod" when launching Dev Spaces

### Reason
This error occurs if the Helm client can no longer talk to the Tiller pod running in the cluster.

### Try:
Restarting the agent nodes in your cluster usually resolves this issue.

## Azure Dev Spaces doesn't seem to use my existing Dockerfile to build a container 

### Reason
Azure Dev Spaces can be configured to point to a specific _Dockerfile_ in your project. If it appears Azure Dev Spaces isn't using the _Dockerfile_ you expect to build your containers, you might need to tell Azure Dev Spaces where it is explicitly. 

### Try:
Open the _azds.yaml_ file that was generated by Azure Dev Spaces in your project. Use the `configurations->develop->build->dockerfile` directive to point to the Dockerfile you want to use:

```
...
configurations:
  develop:
    build:
      dockerfile: Dockerfile.develop
```
