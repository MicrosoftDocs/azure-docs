---
title: "Troubleshooting"
titleSuffix: Azure Dev Spaces
services: azure-dev-spaces
ms.service: azure-dev-spaces
author: zr-msft
ms.author: zarhoads
ms.date: 09/11/2018
ms.topic: "conceptual"
description: "Rapid Kubernetes development with containers and microservices on Azure"
keywords: "Docker, Kubernetes, Azure, AKS, Azure Kubernetes Service, containers, Helm, service mesh, service mesh routing, kubectl, k8s "
---
# Troubleshooting guide

This guide contains information about common problems you may have when using Azure Dev Spaces.

If you have a problem when using Azure Dev Spaces, create an [issue in the Azure Dev Spaces GitHub repository](https://github.com/Azure/dev-spaces/issues).

## Enabling detailed logging

To troubleshoot problems more effectively, it may help to create more detailed logs for review.

For the Visual Studio extension, set the `MS_VS_AZUREDEVSPACES_TOOLS_LOGGING_ENABLED` environment variable to 1. Be sure to restart Visual Studio for the environment variable to take effect. Once enabled, detailed logs are written to your `%TEMP%\Microsoft.VisualStudio.Azure.DevSpaces.Tools` directory.

In the CLI, you can output more information during command execution by using the `--verbose` switch. You can also browse more detailed logs in `%TEMP%\Azure Dev Spaces`. On a Mac, the TEMP directory can be found by running `echo $TMPDIR` from a terminal window. On a Linux computer, the TEMP directory is usually `/tmp`.

## Debugging services with multiple instances

Currently, Azure Dev Spaces works best when debugging a single instance, or pod. The azds.yaml file contains a setting, *replicaCount*, that indicates the number of pods that Kubernetes runs for your service. If you change the replicaCount to configure your app to run multiple pods for a given service, the debugger attaches to the first pod, when listed alphabetically. The debugger attaches to a different pod when the original pod recycles, possibly resulting in unexpected behavior.

## Error 'Failed to create Azure Dev Spaces controller'

### Reason
You might see this error when something goes wrong with the creation of the controller. If it's a transient error, delete and recreate the controller to fix it.

### Try

Delete the controller:

```bash
azds remove -g <resource group name> -n <cluster name>
```

You must use the Azure Dev Spaces CLI to delete a controller. It’s not possible to delete a controller from Visual Studio. You also cannot install the Azure Dev Spaces CLI in the Azure Cloud Shell so you cannot delete a controller from the Azure Cloud Shell.

If you do not have the Azure Dev Spaces CLI installed, you can first install it using the following command then delete your controller:

```cmd
az aks use-dev-spaces -g <resource group name> -n <cluster name>
```

Recreating the controller can be done from the CLI or Visual Studio. See the [Team development](quickstart-team-development.md) or [Develop with .NET Core](quickstart-netcore-visualstudio.md) quickstarts for examples.

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
    
### Multi-stage Dockerfiles:
You receive a *Service cannot be started* error when using a multi-stage Dockerfile. In this situation, the verbose output contains the following text:

```cmd
$ azds up -v
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

This error occurs because AKS nodes run an older version of Docker that does not support multi-stage builds. To avoid multi-stage builds, rewrite your Dockerfile.

### Rerunning a service after controller re-creation
You receive a *Service cannot be started* error when attempting to rerun a service after you have removed and then recreated the Azure Dev Spaces controller associated with this cluster. In this situation, the verbose output contains the following text:

```cmd
Installing Helm chart...
Release "azds-33d46b-default-webapp1" does not exist. Installing it now.
Error: release azds-33d46b-default-webapp1 failed: services "webapp1" already exists
Helm install failed with exit code '1': Release "azds-33d46b-default-webapp1" does not exist. Installing it now.
Error: release azds-33d46b-default-webapp1 failed: services "webapp1" already exists
```

This error occurs because removing the Dev Spaces controller does not remove services previously installed by that controller. Recreating the controller and then attempting to run the services using the new controller fails because the old services are still in place.

To address this problem, use the `kubectl delete` command to manually remove the old services from your cluster, then rerun Dev Spaces to install the new services.

## DNS name resolution fails for a public URL associated with a Dev Spaces service

You can configure a public URL endpoint for your service by specifying the `--public` switch to the `azds prep` command, or by selecting the `Publicly Accessible` checkbox in Visual Studio. The public DNS name is automatically registered when you run your service in Dev Spaces. If this DNS name is not registered, you see a *Page cannot be displayed* or *Site cannot be reached* error in your web browser when connecting to the public URL.

### Try:

You can use the following command to list out all URLs associated with your Dev Spaces services:

```cmd
azds list-uris
```

If a URL is in the *Pending* state, that means that Dev Spaces is still waiting for DNS registration to complete. Sometimes, it takes a few minutes for registration to complete. Dev Spaces also opens a localhost tunnel for each service, which you can use while waiting on DNS registration.

If a URL stays in the *Pending* state for more than 5 minutes, it may indicate a problem with the external DNS pod that creates the public endpoint or the nginx ingress controller pod that acquires the public endpoint. You can use the following commands to delete these pods. AKS automatically recreates the deleted pods.

```cmd
kubectl delete pod -n kube-system -l app=addon-http-application-routing-external-dns
kubectl delete pod -n kube-system -l app=addon-http-application-routing-nginx-ingress
```

## Error 'Required tools and configurations are missing'

This error might occur when launching VS Code: "[Azure Dev Spaces] Required tools and configurations to build and debug '[project name]' are missing."
The error means that azds.exe is not in the PATH environment variable, as seen in VS Code.

### Try:

Launch VS Code from a command prompt where the PATH environment variable is set properly.

## Error "Required tools to build and debug 'projectname' are out of date."

You see this error in Visual Studio Code if you have a newer version of the VS Code extension for Azure Dev Spaces, but an older version of the Azure Dev Spaces CLI.

### Try

Download and install the latest version of the Azure Dev Spaces CLI:

* [Windows](https://aka.ms/get-azds-windows)
* [Mac](https://aka.ms/get-azds-mac)
* [Linux](https://aka.ms/get-azds-linux)

## Error 'azds' is not recognized as an internal or external command, operable program, or batch file
 
You might see this error if azds.exe is not installed or configured correctly.

### Try:

1. Check the location %ProgramFiles%/Microsoft SDKs\Azure\Azure Dev Spaces CLI for azds.exe. If it's there, add that location to the PATH environment variable.
2. If azds.exe is not installed, run the following command:

    ```cmd
    az aks use-dev-spaces -n <cluster-name> -g <resource-group>
    ```

## Warning 'Dockerfile could not be generated due to unsupported language'
Azure Dev Spaces provides native support for C# and Node.js. When you run *azds prep* in a directory containing code written in one of these languages, Azure Dev Spaces will automatically create an appropriate Dockerfile for you.

You can still use Azure Dev Spaces with code written in other languages, but you need to manually create the Dockerfile before running *azds up* for the first time.

### Try:
If your application is written in a language that Azure Dev Spaces does not natively support, you need to provide an appropriate Dockerfile to build a container image running your code. Docker provides a [list of best practices for writing Dockerfiles](https://docs.docker.com/develop/develop-images/dockerfile_best-practices/) and a [Dockerfile reference](https://docs.docker.com/engine/reference/builder/) that can help you write a Dockerfile that suits your needs.

Once you have an appropriate Dockerfile in place, you can proceed with running *azds up* to run your application in Azure Dev Spaces.

## Error 'upstream connect error or disconnect/reset before headers'
You may see this error when trying to access your service. For example, when you go to the service's URL in a browser. 

### Reason 
The container port isn't available. This problem could occur because: 
* The container is still in the process of being built and deployed. This issue can arise if you run `azds up` or start the debugger, and then try to access the container before it has successfully deployed.
* Port configuration is not consistent across your _Dockerfile_, Helm Chart, and any server code that opens up a port.

### Try:
1. If the container is in the process of being built/deployed, you can wait 2-3 seconds and try accessing the service again. 
1. Check your port configuration. The specified port numbers should be **identical** in all of the following assets:
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
You do not have the VS Code extension for C# installed on your development machine. The C# extension includes debugging support for .NET Core (CoreCLR).

### Try:
Install the [VS Code extension for C#](https://marketplace.visualstudio.com/items?itemName=ms-vscode.csharp).

## Debugging error 'Configured debug type 'coreclr' is not supported'
Running the VS Code debugger reports the error: `Configured debug type 'coreclr' is not supported.`

### Reason
You do not have the VS Code extension for Azure Dev Spaces installed on your development machine.

### Try:
Install the [VS Code extension for Azure Dev Spaces](get-started-netcore.md).

## Debugging error "Invalid 'cwd' value '/src'. The system cannot find the file specified." or "launch: program '/src/[path to project binary]' does not exist"
Running the VS Code debugger reports the error `Invalid 'cwd' value '/src'. The system cannot find the file specified.` and/or `launch: program '/src/[path to project executable]' does not exist`

### Reason
By default, the VS Code extension uses `src` as the working directory for the project on the container. If you've updated your `Dockerfile` to specify a different working directory, you may see this error.

### Try:
Update the `launch.json` file under the `.vscode` subdirectory of your project folder. Change the `configurations->cwd` directive to point to the same directory as the `WORKDIR` defined in your project's `Dockerfile`. You may also need to update the `configurations->program` directive as well.

## The type or namespace name 'MyLibrary' could not be found

### Reason 
The build context is at the project/service level by default, therefore a library project you're using cannot be found.

### Try:
What needs to be done:
1. Modify the _azds.yaml_ file to set the build context to the solution level.
2. Modify the _Dockerfile_ and _Dockerfile.develop_ files to refer to the project (_.csproj_) files correctly, relative to the new build context.
3. Place a _.dockerignore_ file beside the .sln file and modify as needed.

You can find an example at https://github.com/sgreenmsft/buildcontextsample

## 'Microsoft.DevSpaces/register/action' authorization error
You need *Owner* or *Contributor* access in your Azure subscription to manage Azure Dev Spaces. You may see this error if you're trying to manage Dev Spaces and you do not have *Owner* or *Contributor* access to the associated Azure subscription.
`The client '<User email/Id>' with object id '<Guid>' does not have authorization to perform action 'Microsoft.DevSpaces/register/action' over scope '/subscriptions/<Subscription Id>'.`

### Reason
The selected Azure subscription has not registered the `Microsoft.DevSpaces` namespace.

### Try:
Someone with Owner or Contributor access to the Azure subscription can run the following Azure CLI command to manually register the `Microsoft.DevSpaces` namespace:

```cmd
az provider register --namespace Microsoft.DevSpaces
```

## Dev Spaces times out at *Waiting for container image build...* step with AKS virtual nodes

### Reason
This timeout occurs when you attempt to use Dev Spaces to run a service that is configured to run on an [AKS virtual node](https://docs.microsoft.com/azure/aks/virtual-nodes-portal). Dev Spaces does not currently support building or debugging services on virtual nodes.

If you run `azds up` with the `--verbose` switch, or enable verbose logging in Visual Studio, you see additional detail:

```cmd
$ azds up --verbose

Installed chart in 2s
Waiting for container image build...
pods/mywebapi-76cf5f69bb-lgprv: Scheduled: Successfully assigned default/mywebapi-76cf5f69bb-lgprv to virtual-node-aci-linux
Streaming build container logs for service 'mywebapi' failed with: Timed out after 601.3037572 seconds trying to start build logs streaming operation. 10m 1s
Container image build failed
```

The above command shows that the service's pod was assigned to *virtual-node-aci-linux*, which is a virtual node.

### Try:
Update the Helm chart for the service to remove any *nodeSelector* and/or *tolerations* values that allow the service to run on a virtual node. These values are typically defined in the chart's `values.yaml` file.

You can still use an AKS cluster that has the virtual nodes feature enabled, if the service you wish to build/debug via Dev Spaces runs on a VM node. This is the default configuration.

## "Error: could not find a ready tiller pod" when launching Dev Spaces

### Reason
This error occurs if the Helm client can no longer talk to the Tiller pod running in the cluster.

### Try:
Restarting the agent nodes in your cluster usually resolves this issue.

## "Error: release azds-\<identifier\>-\<spacename\>-\<servicename\> failed: services '\<servicename\>' already exists" or "Pull access denied for \<servicename\>, repository does not exist or may require 'docker login'"

### Reason
These errors can occur if you mix running direct Helm commands (such as `helm install`, `helm upgrade`, or `helm delete`) with Dev Spaces commands (such as `azds up` and `azds down`) inside the same dev space. They occur because Dev Spaces has its own Tiller instance, which conflicts with your own Tiller instance running in the same dev space.

### Try:
It's fine to use both Helm commands and Dev Spaces commands against the same AKS cluster, but each Dev Spaces-enabled namespace should use either one or the other.

For example, suppose you use a Helm command to run your entire application in a parent dev space. You can create child dev spaces off that parent, use Dev Spaces to run individual services inside the child dev spaces, and test the services together. When you're ready to check in your changes, use a Helm command to deploy the updated code to the parent dev space. Don't use `azds up` to run the updated service in the parent dev space, because it will conflict with the service initially run using Helm.

## Azure Dev Spaces proxy can interfere with other pods running in a dev space

### Reason
When you enable Dev Spaces on a namespace in your AKS cluster, an additional container called _mindaro-proxy_ is installed in each of the pods running inside that namespace. This container intercepts calls to the services in the pod, which is integral to Dev Spaces' team development capabilities; however, it can interfere with certain services running in those pods. It is known to interfere with pods running Azure Cache for Redis, causing connection errors and failures in primary/secondary communication.

### Try:
You can move the affected pods to a namespace inside the cluster that does _not_ have Dev Spaces enabled. The rest of your application can continue to run inside a Dev Spaces-enabled namespace. Dev Spaces will not install the _mindaro-proxy_ container inside non-Dev Spaces enabled namespaces.

## Azure Dev Spaces doesn't seem to use my existing Dockerfile to build a container

### Reason
Azure Dev Spaces can be configured to point to a specific _Dockerfile_ in your project. If it appears Azure Dev Spaces isn't using the _Dockerfile_ you expect to build your containers, you might need to explicitly tell Azure Dev Spaces which Dockerfile to use. 

### Try:
Open the _azds.yaml_ file that Azure Dev Spaces generated in your project. Use the *configurations->develop->build->dockerfile* directive to point to the Dockerfile you want to use:

```
...
configurations:
  develop:
    build:
      dockerfile: Dockerfile.develop
```

## Error "Internal watch failed: watch ENOSPC" when attaching debugging to a Node.js application

### Reason

The node running the pod with the Node.js application you are trying to attach to with a debugger has exceeded the *fs.inotify.max_user_watches* value. In some cases, [the default value of *fs.inotify.max_user_watches* may be too small to handle attaching a debugger directly to a pod](https://github.com/Azure/AKS/issues/772).

### Try
A temporary workaround for this issue is to increase the value of *fs.inotify.max_user_watches* on each node in the cluster and restart that node for the changes to take effect.

## New pods are not starting

### Reason

The Kubernetes initializer cannot apply the PodSpec for new pods due to RBAC permission changes to the *cluster-admin* role in the cluster. The new pod may also have an invalid PodSpec, for example the service account associated with the pod no longer exists. To see the pods that are in a *Pending* state due to the initializer issue, use the `kubectl get pods` command:

```bash
kubectl get pods --all-namespaces --include-uninitialized
```

This issue can impact pods in *all namespaces* in the cluster including namespaces where Azure Dev Spaces is not enabled.

### Try

[Updating the Dev Spaces CLI to the latest version](./how-to/upgrade-tools.md#update-the-dev-spaces-cli-extension-and-command-line-tools) and then deleting the *azds InitializerConfiguration* from the Azure Dev Spaces controller:

```bash
az aks get-credentials --resource-group <resource group name> --name <cluster name>
kubectl delete InitializerConfiguration azds
```

Once you have removed the *azds InitializerConfiguration* from the Azure Dev Spaces controller, use `kubectl delete` to remove any pods in a *Pending* state. After all pending pods have been removed, redeploy your pods.

If new pods are still stuck in a *Pending* state after a redeployment, use `kubectl delete` to remove any pods in a *Pending* state. After all pending pods have been removed, delete the controller from the cluster and reinstall it:

```bash
azds remove -g <resource group name> -n <cluster name>
azds controller create --name <cluster name> -g <resource group name> -tn <cluster name>
```

After your controller is reinstalled, redeploy your pods.

## Incorrect RBAC permissions for calling Dev Spaces controller and APIs

### Reason
The user accessing the Azure Dev Spaces controller must have access to read the admin *kubeconfig* on the AKS cluster. For example, this permission is available in the [built-in Azure Kubernetes Service Cluster Admin Role](../aks/control-kubeconfig-access.md#available-cluster-roles-permissions). The user accessing the Azure Dev Spaces controller must also have the *Contributor* or *Owner* RBAC role for the controller.

### Try
More details on updating a user's permissions for an AKS cluster are available [here](../aks/control-kubeconfig-access.md#assign-role-permissions-to-a-user-or-group).

To update the user's RBAC role for the controller:

1. Sign in to the Azure portal at https://portal.azure.com.
1. Navigate to the Resource Group containing the controller, which is usually the same as your AKS cluster.
1. Enable the *Show hidden types* checkbox.
1. Click on the controller.
1. Open the *Access Control (IAM)* pane.
1. Click on the *Role Assignments* tab.
1. Click *Add* then *Add role assignment*.
    * For *Role* select either *Contributor* or *Owner*.
    * For *Assign access to* select *Azure AD user, group, or service principal*.
    * For *Select* search for the user you want to give permissions.
1. Click *Save*.

## Controller create failing due to controller name length

### Reason
An Azure Dev Spaces controller's name cannot be longer than 31 characters. If your controller's name exceeds 31 characters when you enable Dev Spaces on an AKS cluster or create a controller, you will receive an error like:

*Failed to create a Dev Spaces controller for cluster 'a-controller-name-that-is-way-too-long-aks-east-us': Azure Dev Spaces Controller name 'a-controller-name-that-is-way-too-long-aks-east-us' is invalid. Constraint(s) violated: Azure Dev Spaces Controller names can only be at most 31 characters long*

### Try

Create a controller with an alternate name:

```cmd
azds controller create --name my-controller --target-name MyAKS --resource-group MyResourceGroup
```

## Enabling Dev Spaces failing when Windows node pools are added to an AKS cluster

### Reason
Currently, Azure Dev Spaces is intended to run on Linux pods and nodes only. When you have an AKS cluster with a Windows node pool, you must ensure that Azure Dev Spaces pods are only scheduled on Linux nodes. If an Azure Dev Spaces pod is scheduled to run on a Windows node, that pod will not start and enabling Dev Spaces will fail.

### Try
[Add a taint](../aks/operator-best-practices-advanced-scheduler.md#provide-dedicated-nodes-using-taints-and-tolerations) to your AKS cluster to ensure Linux pods are not scheduled to run on a Windows node.

## Error "Found no untainted Linux nodes in Ready state on the cluster. There needs to be at least one untainted Linux node in Ready state to deploy pods in 'azds' namespace."

### Reason

Azure Dev Spaces could not create a controller on your AKS cluster because it could not find an untainted node in a *Ready* state to schedule pods on. Azure Dev Spaces requires at least one Linux node in a *Ready* state that allows for scheduling pods without specifying tolerations.

### Try
[Update your taint configuration](../aks/operator-best-practices-advanced-scheduler.md#provide-dedicated-nodes-using-taints-and-tolerations) on your AKS cluster to ensure at least one Linux node allows for scheduling pods without specifying tolerations. Also, ensure that at least one Linux node that allows scheduling pods without specifying tolerations is in the *Ready* state. If your node is taking a long time to reach the *Ready* state, you can try restarting your node.

## Error "Azure Dev Spaces CLI not installed properly" when running `az aks use-dev-spaces`

### Reason
An update to the Azure Dev Spaces CLI changed its installation path. If you are using a version of the Azure CLI earlier than 2.0.63, you may see this error. To display your version of the Azure CLI, use `az --version`.

```bash
$ az --version
azure-cli                         2.0.60 *
...
```

Despite the error message when running `az aks use-dev-spaces` with a version of the Azure CLI before 2.0.63, the installation does succeed. You can continue to use `azds` without any issues.

### Try
Update your installation of the [Azure CLI](/cli/azure/install-azure-cli?view=azure-cli-latest) to 2.0.63 or later. This will resolve the error message you receive when running `az aks use-dev-spaces`. Alternatively, you can continue to use your current version of the Azure CLI and the Azure Dev Spaces CLI.
