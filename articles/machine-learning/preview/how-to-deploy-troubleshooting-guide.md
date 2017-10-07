---
title: Azure Machine Learning deployment troubleshooting guide | Microsoft Docs
description: Troubleshooting guide for deployment and service creation
services: machine-learning
author: raymondl
ms.author: raymondl
manager: mwinkle
ms.reviewer: garyericson, jasonwhowell, mldocs
ms.service: machine-learning
ms.workload: data-services
ms.custom: mvc
ms.topic: article
ms.date: 10/05/2017
---

# Model management troubleshooting
The following information can help determine the cause of errors during deployment or when calling the web service.
 
## 1. Service logs
The `logs` option of the service CLI provides log data from Docker and Kubernetes.

```
az ml service logs realtime -i <web service id>
```

For additional log settings, use the `--help` (or `-h`) option.

```
az ml service logs realtime -h
```

## 2. Debug and Verbose options
Use the `--debug` flag to show debug logs as the service is being deployed.

```
az ml service create realtime -m <modelfile>.pkl -f score.py -n <service name> -r python --debug
```

Use the `--verbose` flag to see additional details as the service is being deployed.

```
az ml service create realtime -m <modelfile>.pkl -f score.py -n <service name> -r python --verbose
```

## 3. App Insights
Set the `-l` flag to true when creating a web service to enable request level logging. The request logs are written to the App Insights instance for your environment in Azure. Search for this instance using the environment name you used when using the `az ml env setup` command.

- Set `-l` to true when creating the service.
- Open App Insights in Azure portal. Use your environment name to find the App Insights instance.
- Once in App Insights, click on Search in the top menu to view the results.
- Or go to `Analytics` > `Exceptions` > `exceptions take | 10`.


## 4. Error handling in script
Use exception handling in your `scoring.py` script's **run** function to return the error message as part of your web service output.

Python example:
```
    try:
        <code to load model and score>
   except Exception as e:
        return(str(e))
```

## 5. Other common problems
- If the `env setup` command fails, make sure you have enough cores available in your subscription.
- Do not use the underscore ( _ ) in the web service name (as in *my_webservice*).
- Retry if you get a **502 Bad Gateway** error when calling the web service. It normally means the container hasn't been deployed to the cluster yet.
- If you get **CrashLoopBackOff** error when creating a service, check your logs. It typically is the result of missing dependencies in the **init** function.