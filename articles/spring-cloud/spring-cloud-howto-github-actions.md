---
title:  Azure Spring Cloud CI/CD with GitHub Actions
description: How to build up CI/CD workflow for Azure Spring Cloud with GitHub Actions
author:  MikeDodaro
ms.author: barbkess
ms.service: spring-cloud
ms.topic: how-to
ms.date: 01/15/2019
---
# Azure Spring Cloud CI/CD with GitHub Actions

GitHub Actions support an automated software development lifecycle workflow. With GitHub Actions for Azure Spring Cloud you can create workflows in your repository to build, test, package, release and deploy to Azure. 

## Prerequisites
This example requires the [Azure CLI](https://review.docs.microsoft.com/en-us/azure/spring-cloud/spring-cloud-quickstart-launch-app-cli#install-the-azure-cli-extension)

## Set up your GitHub repository and authenticate with Azure
You need an Azure service principle credential to authorize Azure login action. To get Azure credential, execute the following commands on you local machine:
```
az login
az ad sp create-for-rbac --role contributor --scopes /subscriptions/<SUBSCRIPTION_ID> --sdk-auth 
```
To access to a specific resource group, you can reduce the scope:
```
az ad sp create-for-rbac --role contributor --scopes /subscriptions/<SUBSCRIPTION_ID>/resourceGroups/{RESOURCE_GROUP} --sdk-auth
```
The command should output a JSON object:
```JSON
{
    "clientId": "<GUID>",
    "clientSecret": "<GUID>",
    "subscriptionId": "<GUID>",
    "tenantId": "<GUID>",
    ...
}
```

This example uses the [Piggy Metrics](https://github.com/Azure-Samples/piggymetrics) sample on GitHub.  Fork the sample, open GitHub repository page, and click Settings tab. Open Secrets menu, and click Add a new secret:
    > ![Add new secret](./media/github-actions/actions1.png)

