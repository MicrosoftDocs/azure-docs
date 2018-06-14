---
title: Azure Machine Learning deployment troubleshooting guide | Microsoft Docs
description: Troubleshooting guide for deployment and service creation
services: machine-learning
author: aashishb
ms.author: aashishb
manager: mwinkle
ms.reviewer: jmartens, jasonwhowell, mldocs
ms.service: machine-learning
ms.component: core
ms.workload: data-services
ms.custom: mvc
ms.topic: article
ms.date: 11/16/2017

ROBOTS: NOINDEX
---

# Troubleshooting service deployment and environment setup

[!INCLUDE [workbench-deprecated](../../../includes/aml-deprecating-preview-2017.md)]

The following information can help determine the cause of errors when setting up the model management environment.

## Model management environment
### Contributor permission required
You need contributor access to the subscription or the resource group to set up a cluster for deployment of your web services.

### Resource availability
You need to have enough resources available in your subscription so you can provision the environment resources.

### Subscription Caps
Your subscription may have a cap on billing which could prevent you from provisioning the environment resources. Remove that cap to enable provisioning.

### Enable debug and verbose options
Use the `--debug` and  `--verbose` flags in the setup command to show debug and trace information as the environment is being provisioned.

```
az ml env setup -l <location> -n <name> -c --debug --verbose 
```

## Service deployment
The following information can help determine the cause of errors during deployment or when calling the web service.

### Service logs
The `logs` option of the service CLI provides log data from Docker and Kubernetes.

```
az ml service logs realtime -i <web service id>
```

For additional log settings, use the `--help` (or `-h`) option.

```
az ml service logs realtime -h
```

### Debug and Verbose options
Use the `--debug` flag to show debug logs as the service is being deployed.

```
az ml service create realtime -m <modelfile>.pkl -f score.py -n <service name> -r python --debug
```

Use the `--verbose` flag to see additional details as the service is being deployed.

```
az ml service create realtime -m <modelfile>.pkl -f score.py -n <service name> -r python --verbose
```

### Enable request logging in App Insights
Set the `-l` flag to true when creating a web service to enable request level logging. The request logs are written to the App Insights instance for your environment in Azure. Search for this instance using the environment name you used when using the `az ml env setup` command.

- Set `-l` to true when creating the service.
- Open App Insights in Azure portal. Use your environment name to find the App Insights instance.
- Once in App Insights, click on Search in the top menu to view the results.
- Or go to `Analytics` > `Exceptions` > `exceptions take | 10`.


### Add error handling in scoring script
Use exception handling in your `scoring.py` script's **run** function to return the error message as part of your web service output.

Python example:
```
    try:
        <code to load model and score>
   except Exception as e:
        return(str(e))
```

## Other common problems
- If pip install of azure-cli-ml fails with the error `cannot find the path specified` on a Windows machine, you need to enable long path support. See https://blogs.msdn.microsoft.com/jeremykuhne/2016/07/30/net-4-6-2-and-long-paths-on-windows-10/. 
- If the `env setup` command fails with `LocationNotAvailableForResourceType`, you are probably using the wrong location (region) for the machine learning resources. Make sure your location specified with the `-l` parameter is `eastus2`, `westcentralus`, or `australiaeast`.
- If the `env setup` command fails with `Resource quota limit exceeded`, make sure you have enough cores available in your subscription and that your resources are not being used up in other processes.
- If the `env setup` command fails with `Invalid environment name. Name must only contain lowercase alphanumeric characters`, make sure the service name does not contain upper-case letters, symbols, or the underscore ( _ ) (as in *my_environment*).
- If the `service create` command fails with `Service Name: [service_name] is invalid. The name of a service must consist of lower case alphanumeric characters (etc.)`, make sure the service name is between 3 and 32 characters in length; starts and ends with lower-case alphanumeric characters; and does not contain upper-case letters, symbols other than hyphen ( - ) and period ( . ), or the underscore ( _ ) (as in *my_webservice*).
- Retry if you get a `502 Bad Gateway` error when calling the web service. It normally means the container hasn't been deployed to the cluster yet.
- If you get `CrashLoopBackOff` error when creating a service, check your logs. It typically is the result of missing dependencies in the **init** function.
