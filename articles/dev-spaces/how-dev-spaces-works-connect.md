---
title: "How connecting your development computer to your AKS cluster works"
services: azure-dev-spaces
ms.date: 03/24/2020
ms.topic: "conceptual"
description: "Describes the processes fo using Azure Dev Spaces to connect your development computer to your Azure Kubernetes Service cluster"
keywords: "Azure Dev Spaces, Dev Spaces, Docker, Kubernetes, Azure, AKS, Azure Kubernetes Service, containers"
---

# How connecting your development computer to your AKS cluster works

With Azure Dev Spaces, you can connect your development computer to your AKS cluster, allowing you to run and debug code on your development computer as if it were running on the cluster. Azure Dev Spaces redirects traffic between your connected AKS cluster by running a pod on your cluster that acts as a remote agent to redirect traffic between your development machine and the cluster. This traffic redirection allows code on your development computer and services running in your AKS cluster to communicate as if they were in the same AKS cluster. This connection also allows you to run and debug code with or without a container on your development computer. Connecting your development computer to your cluster helps you to quickly develop your application and perform end-to-end testing.

## Connecting to your cluster

You connect to your existing AKS cluster using [Visual Studio Code][vs-code] with the [Azure Dev Spaces][azds-vs-code] extension installed running on MacOS or Windows 10. When you establish a connection, you have the option of redirecting all traffic to and from a new or existing pod in the cluster to your development computer.

> [!NOTE]
> When using Visual Studio Code to connect to your cluster, the Azure Dev Spaces extension gives you the option of redirecting a service to your development computer. This option is a convenient way to identify a pod for redirection. All redirection between your AKS cluster and your development computer is for a pod.

Connecting to your cluster does not require you to have Azure Dev Spaces enabled on your cluster. Instead, when the Azure Dev Spaces extension establishes a connection to your cluster, it:

* Replaces the container in the pod on the AKS cluster with a remote agent container that redirects traffic to your development computer. When redirecting a new pod, Azure Dev Spaces creates a new pod in your AKS cluster with the remote agent.
* Runs [kubectl port-forward][kubectl-port-forward] on your development computer to forward traffic from your development computer to the remote agent running in your cluster.
* Collects environment information from your cluster using the remote agent. This environment information includes environment variables, visible services, volume mounts, and secret mounts.
* Sets up the environment in the Visual Studio Code terminal so the service on your development computer can access the same variables as if it were running on the cluster.  
* Updates your hosts file to map services on your AKS cluster to local IP addresses on your development computer. These hosts file entries allow code running on your development computer to make requests to other services running in your cluster. To update your hosts file, Azure Dev Spaces will ask for administrator access on your development computer when connecting to your cluster.

If you do have Azure Dev Spaces enabled on your cluster, you also have the option to use the [traffic redirection offered by Azure Dev Spaces][how-it-works-routing]. The traffic redirection offered by Azure Dev Spaces allows you to connect to a copy of your service running in a child dev space. Using a child dev space helps you avoid disrupting others working in the parent dev space since you are only redirecting the traffic targeting the child space's instance of your service, leaving the parent space instance of the service unmodified.

Once you connect to your cluster, traffic is routed to your development computer regardless of whether you have your service running on your development computer.

## Running code on your development computer

After you establish a connection to your AKS cluster, you can run any code natively on your computer, without containerization. Any network traffic the remote agent receives is redirected to the local port specified during the connection so your natively running code can accept and process that traffic. The environment variables, volumes, and secrets from your cluster are made available to code running on your development computer. Also, due to the hosts file entries and port forwarding added to your developer computer by Azure Dev Spaces, your code can send network traffic to services running on your cluster using the service names from your cluster, and that traffic gets forwarded to the services that are running in your cluster.

Since your code is running on your development computer, you have the flexibility to use any tool you normally use for development to run your code and debug it. Traffic is routed between your development computer and your cluster the entire time you're connected. This persistent connection allows you to start, stop, and restart your code as much as you need to without having to re-establish a connection.

In addition, Azure Dev Spaces provides a way to replicate environment variables and mounted files available to pods in your AKS cluster in your development computer through the *azds-local.env* file. You can also use this file to create new environment variables and volume mounts.

## Additional configuration with azds-local.env

The *azds-local.env* file allows you to replicate environment variables and mounted files available to your pods in your AKS cluster. You can specify the following actions in an *azds-local.env* file:

* Download a volume and set the path to that volume as an environment variable.
* Download an individual file or set of files from a volume and mount it on your development computer.
* Make a service available regardless of the cluster you are connected to.

Here is an example *azds-local.env* file:

```
# This downloads the "whitelist" volume from the container,
# saves it to a temporary directory on your development computer,
# and sets the full path to an environment variable called WHITELIST_PATH.

WHITELIST_PATH=${volumes.whitelist}/whitelist

# This downloads a file from the container's 'default-token-<any>' mount directory 
# to /var/run/secrets/kubernetes.io/serviceaccount on your development computer.

KUBERNETES_IN_CLUSTER_CONFIG_OVERWRITE=${volumes.default-token-*|/var/run/secrets/kubernetes.io/serviceaccount}

# This makes the myapp1 service available to your development computer
# regardless of the AKS cluster you are connected to and
# sets the local IP to an environment variable called MYAPP1_SERVICE_HOST.

# If the myapp1 service is made available in this way, 
# you can also access it using "myapp1" and "myapp1.svc.cluster.local"
# in addition to the IP in the MYAPP1_SERVICE_HOST environment variable.

MYAPP1_SERVICE_HOST=${services.myapp1}

# This makes the service myapp2 in namespace mynamespace available to your 
# development computer regardless of the AKS cluster you are connected to and
# sets the local IP to an environment variable called MYAPP2_SERVICE_HOST.

MYAPP2_SERVICE_HOST=${services.mynamespace.myapp2}
```

A default *azds-local.env* file is not created automatically so you must manually create the file at the root of your project.

## Diagnostics and logging

When connected to your AKS cluster, diagnostic logs from your cluster are logged to your development computer's [temporary directory][azds-tmp-dir]. Using Visual Studio Code, you can also use the *Show diagnostic info* command to print the current environment variables and DNS entries from your AKS cluster.

## Next steps

To get started connecting your local development computer to your AKS cluster, see [Connect your development computer to an AKS cluster][connect].

[azds-tmp-dir]: troubleshooting.md#before-you-begin
[azds-vs-code]: https://marketplace.visualstudio.com/items?itemName=azuredevspaces.azds
[connect]: how-to/connect.md
[how-it-works-routing]: how-dev-spaces-works-routing.md
[kubectl-port-forward]: https://kubernetes.io/docs/reference/generated/kubectl/kubectl-commands#port-forward
[vs-code]: https://code.visualstudio.com/download
