---
title: "How Local Process with Kubernetes works"
services: azure-dev-spaces
ms.date: 06/02/2020
ms.topic: "conceptual"
description: "Describes the processes for using Local Process with Kubernetes to connect your development computer to your Kubernetes cluster"
keywords: "Local Process with Kubernetes, Azure Dev Spaces, Dev Spaces, Docker, Kubernetes, Azure, AKS, Azure Kubernetes Service, containers"
---

# How Local Process with Kubernetes works

Local Process with Kubernetes allows you to run and debug code on your development computer, while still connected to your Kubernetes cluster with the rest of your application or services. For example, if you have a large microservices architecture with many interdependent services and databases, replicating those dependencies on your development computer can be difficult. Additionally, building and deploying code to your Kubernetes cluster for each code change during inner-loop development can be slow, time consuming, and difficult to use with a debugger.

Local Process with Kubernetes avoids having to build and deploy your code to your cluster by instead creating a connection directly between your development computer and your cluster. Connecting your development computer to your cluster while debugging allows you to quickly test and develop your service in the context of the full application without creating any Docker or Kubernetes configuration.

Local Process with Kubernetes redirects traffic between your connected Kubernetes cluster and your development computer. This traffic redirection allows code on your development computer and services running in your Kubernetes cluster to communicate as if they are in the same Kubernetes cluster. Local Process with Kubernetes also provides a way to replicate environment variables and mounted volumes available to pods in your Kubernetes cluster in your development computer. Providing access to environment variables and mounted volumes on your development computer allows you to quickly work on your code without having replicate those dependencies manually.

## Using Local Process with Kubernetes

To use Local Process with Kubernetes, you need [Visual Studio Code][vs-code] with the [Azure Dev Spaces][azds-vs-code] and [Azure Kubernetes Service][az-aks-vs-code] extensions installed and running on macOS or Windows 10 as well as the [Azure Dev Spaces CLI installed][azds-cli]. You can also use [Visual Studio 2019][visual-studio] running on Windows 10 with the *ASP.NET and web development* and *Azure development* workloads installed and the *AzureDevSpacesTools.LocalKubernetesDebugging* Preview feature flag enabled as well as the [Azure Dev Spaces CLI installed][azds-cli]. When you use Local Process with Kubernetes to establish a connection to your Kubernetes cluster, you have the option of redirecting all traffic to and from an existing pod in the cluster to your development computer.

> [!NOTE]
> When using Local Process with Kubernetes, you are prompted for the name of the service to redirect to your development computer. This option is a convenient way to identify a pod for redirection. All redirection between your Kubernetes cluster and your development computer is for a pod.

When Local Process with Kubernetes establishes a connection to your cluster, it:

* Prompts you to configure the service to replace on your cluster, the port on your development computer to use for your code, and the launch task for your code as a one-time action.
* Replaces the container in the pod on the cluster with a remote agent container that redirects traffic to your development computer.
* Runs [kubectl port-forward][kubectl-port-forward] on your development computer to forward traffic from your development computer to the remote agent running in your cluster.
* Collects environment information from your cluster using the remote agent. This environment information includes environment variables, visible services, volume mounts, and secret mounts.
* Sets up the environment in Visual Studio or Visual Studio Code so the service on your development computer can access the same variables as if it were running on the cluster.  
* Updates your hosts file to map services on your cluster to local IP addresses on your development computer. These hosts file entries allow code running on your development computer to make requests to other services running in your cluster. To update your hosts file, Local Process with Kubernetes will ask for administrator access on your development computer when connecting to your cluster.
* Starts running and debugging your code on your development computer. If necessary, Local Process with Kubernetes will free required ports on your development computer by stopping services or processes that are currently using those ports.

After you establish a connection to your cluster, you can run and debug code natively on your computer, without containerization, and the code can directly interact with the rest of your cluster. Any network traffic the remote agent receives is redirected to the local port specified during the connection so your natively running code can accept and process that traffic. The environment variables, volumes, and secrets from your cluster are made available to code running on your development computer. Also, due to the hosts file entries and port forwarding added to your developer computer by Local Process with Kubernetes, your code can send network traffic to services running on your cluster using the service names from your cluster, and that traffic gets forwarded to the services that are running in your cluster. Traffic is routed between your development computer and your cluster the entire time you're connected.

## Diagnostics and logging

When using Local Process with Kubernetes to connect to your cluster, diagnostic logs from your cluster are logged to your development computer's [temporary directory][azds-tmp-dir]. Using Visual Studio Code, you can also use the *Show diagnostic info* command to print the current environment variables and DNS entries from your cluster.

## Next steps

To get started using Local Process with Kubernetes to connect to your local development computer to your cluster, see [Use Local Process with Kubernetes with Visual Studio Code][local-process-kubernetes-vs-code] and [Use Local Process with Kubernetes with Visual Studio][local-process-kubernetes-vs].

[azds-cli]: how-to/install-dev-spaces.md#install-the-client-side-tools
[azds-tmp-dir]: troubleshooting.md#before-you-begin
[azds-vs-code]: https://marketplace.visualstudio.com/items?itemName=azuredevspaces.azds
[azure-cli]: /cli/azure/install-azure-cli?view=azure-cli-latest
[az-aks-vs-code]: https://marketplace.visualstudio.com/items?itemName=ms-kubernetes-tools.vscode-aks-tools
[local-process-kubernetes-vs-code]: how-to/local-process-kubernetes-vs-code.md
[local-process-kubernetes-vs]: how-to/local-process-kubernetes-visual-studio.md
[how-it-works-routing]: how-dev-spaces-works-routing.md
[kubectl-port-forward]: https://kubernetes.io/docs/reference/generated/kubectl/kubectl-commands#port-forward
[visual-studio]: https://www.visualstudio.com/vs/
[vs-code]: https://code.visualstudio.com/download