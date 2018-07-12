---
title: "Troubleshooting | Microsoft Docs"
titleSuffix: Azure Dev Spaces
services: azure-dev-spaces
ms.service: azure-dev-spaces
ms.component: azds-kubernetes
author: "ghogen"
ms.author: "ghogen"
ms.date: "05/11/2018"
ms.topic: "article"
description: "Rapid Kubernetes development with containers and microservices on Azure"
keywords: "Docker, Kubernetes, Azure, AKS, Azure Kubernetes Service, containers"
manager: "douge"
---
# Troubleshooting guide

This guide contains information about common problems you may have when using Azure Dev Spaces.

## Error 'Service cannot be started.'

You might see this error when your service code fails to start. The cause is often in user code. To get more diagnostic information, do the following:

On the command line:

1. When using azds.exe, use the --verbose command line option, and use the --output command line option to specify the output format.
 
    ```cmd
    azds up --verbose --output json
    ```

In Visual Studio:

1. Open **Tools > Options** and under **Projects and Solutions**, choose and **Build and Run**.
2. Change the settings for **MSBuild project build output verbosity** and **MSBuild project build log file verbosity** to **Detailed** or **Diagnostic**.

    ![Screenshot of Tools Options dialog](media/common/VerbositySetting.PNG)

## Error 'upstream connect error or disconnect/reset before headers'
You may see this error when trying to access your service. For example, when you go to the service's URL in a browser. 

### Reason 
The container port isn't available. This could be because: 
* The container is still in the process of being built and deployed. This can be the case if you run `azds up` or start the debugger, and then try to access the container before it has successfully deployed.
* Port configuration is not consistent across your Dockerfile, Helm Chart, and any server code that opens up a port.

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
1. If you do not have a azds.yaml file in the code folder, run `azds prep` to generate Docker, Kubernetes, and Azure Dev Spaces assets.

## Error: 'The pipe program 'azds' exited unexpectedly with code 126.'
Starting the VS Code debugger may sometimes result in this error. This is a known issue.

### Try:
1. Close and reopen VS Code.
2. Hit F5 again.


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
1. Modify the azds.yaml file to set the build context to the solution level.
2. Modify the Dockerfile and Dockerfile.develop files to refer to the csproj files correctly, relative to the new build context.
3. Place a .dockerignore file beside the .sln file and modify as needed.

You can find an example at https://github.com/sgreenmsft/buildcontextsample

## 'Microsoft.ConnectedEnvironment/register/action' authorization error
You might see the following error when you are managing an Azure Dev Space and you are working in an Azure subscription for which you do not have Owner or Contributor access.
`The client '<User email/Id>' with object id '<Guid>' does not have authorization to perform action 'Microsoft.ConnectedEnvironment/register/action' over scope '/subscriptions/<Subscription Id>'.`

### Reason
The selected Azure subscription has not registered the Microsoft.ConnectedEnvironment namespace.

### Try:
Someone with Owner or Contributor access to the Azure subscription can run the following Azure CLI command to manually register the Microsoft.ConnectedEnvironment namespace:

```cmd
az provider register --namespace Microsoft.ConnectedEnvironment
```

## Azure Dev Spaces doesn't seem to use my existing Dockerfile to build a container 

### Reason
Azure Dev Spaces can be configured to point to a specific Dockerfile in your project. If it appears Azure Dev Spaces isn't using the Dockerfile you expect to build your containers, you might need to explicitly tell Azure Dev Spaces where it is. 

### Try:
Open the `azds.yaml` file that was generated by Azure Dev Spaces in your project. Use the `configurations->develop->build->dockerfile` directive to point to the Dockerfile you want to use:

```
...
configurations:
  develop:
    build:
      dockerfile: Dockerfile.develop
```