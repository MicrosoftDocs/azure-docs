---
title: Run Azure Container Instances - Text Analytics
titleSuffix: Azure Cognitive Services
description: Deploy the text analytics containers to the Azure Container Instance, and test it in a web browser.
services: cognitive-services
author: aahill
manager: nitinme
ms.service: cognitive-services
ms.subservice: text-analytics
ms.topic: conceptual
ms.date: 04/01/2020
ms.author: aahi
---

# Deploy a Text Analytics container to Azure Container Instances

Learn how to deploy the Cognitive Services [Text Analytics][install-and-run-containers] container to Azure [Container Instances][container-instances]. This procedure exemplifies the creation of a Text Analytics resource, the creation of an associated Sentiment Analysis image and the ability to exercise this orchestration of the two from a browser. Using containers can shift the developers' attention away from managing infrastructure to instead focusing on application development.

## Prerequisites

* Use an Azure subscription. If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/) before you begin.

> [!NOTE]
> If you're using the Text Analytics for health container, you can find a powershell script below to automate to create a resource for you. 

[!INCLUDE [Create a Cognitive Services Text Analytics resource](../includes/create-text-analytics-resource.md)]

[!INCLUDE [Create a Text Analytics Containers on Azure Container Instances](../../containers/includes/create-container-instances-resource.md)]

#### [Key Phrase Extraction](#tab/keyphrase)

[!INCLUDE [Verify the Key Phrase Extraction container instance](../includes/verify-key-phrase-extraction-container.md)]

#### [Language Detection](#tab/language)

[!INCLUDE [Verify the Language Detection container instance](../includes/verify-language-detection-container.md)]

#### [Sentiment Analysis](#tab/sentiment)

[!INCLUDE [Verify the Sentiment Analysis container instance](../includes/verify-sentiment-analysis-container.md)]

#### [Text Analytics for health](#tab/health)


### How to install the container on Azure Container Instance using Azure CLI

You can optionally use the below powershell script using [Azure CLI](https://docs.microsoft.com/cli/azure/?view=azure-cli-latest), which will create a ACI on your subscription using the Text Analytics for Healthcare image.  Please allow 20-25 minutes for the operations contained within this script to complete before submitting the first request.

> [!NOTE] 
> In ACI you are not getting any HTTPS support at all for the builtin domain, and in any case you need it, you will have to manually configure it yourself including creating a certificate and registering a domain. Below you can find instructions of how to achieve that with NGINX.

> Azure Container Instances don't offer HTTPS support for the builtin domains. If you need HTTPS, you will need to manually configure it, including creating a certificate and registering a domain. You can find instructions to do this with NGINX in the [Text Analytics for Health](text-analytics-for-healthcare.md) article.

```bash
$subscription_name = ""                    # THe name of the subscription you want you resource to be created on.
$resource_group_name = ""                  # The name of the resource group you want the AppServicePlan
                                           #    and AppService to be attached to.
$resources_location = ""                   # This is the location you wish the web app to be deployed to.
                                           #    You can use the "az account list-locations -o table" command to
                                           #    get the list of available locations and location code names.
$azure_container_instance_name = ""        # This is the AzureContainerInstance name you wish to have.
$TEXT_ANALYTICS_RESOURCE_API_KEY = ""      # This should be taken from the Text Analytics resource.
$TEXT_ANALYTICS_RESOURCE_API_ENDPOINT = "" # This should be taken from the Text Analytics resource.
$DOCKER_REGISTRY_SERVER_PASSWORD = ""      # This will be provided separately.
$DOCKER_REGISTRY_SERVER_USERNAME = ""      # This will be provided separately.
$DNS_LABEL = ""                            # This is the DNS label name you wish your ACI will have
$DOCKER_REGISTRY_LOGIN_SERVER = "containerpreview.azurecr.io"
$DOCKER_IMAGE_NAME = "containerpreview.azurecr.io/microsoft/cognitive-services-healthcare:latest"

az login
az account set -s $subscription_name
az container create --resource-group $resource_group_name --name $azure_container_instance_name --image $DOCKER_IMAGE_NAME --cpu 4 --memory 8 --registry-login-server $DOCKER_REGISTRY_LOGIN_SERVER --registry-username $DOCKER_REGISTRY_SERVER_USERNAME --registry-password $DOCKER_REGISTRY_SERVER_PASSWORD --port 5000 --dns-name-label $DNS_LABEL --environment-variables Eula=accept Billing=$TEXT_ANALYTICS_RESOURCE_API_ENDPOINT ApiKey=$TEXT_ANALYTICS_RESOURCE_API_KEY

# Once deployment complete, the resource should be available at: http://<unique_dns_label>.<resource_group_region>.azurecontainer.io:5000
```

### Verify that a container is running

1. Select the **Overview** tab, and copy the IP address.
1. Open a new browser tab, and enter the IP address. For example, enter `http://<IP-address>:5000 (http://55.55.55.55:5000`). The container's home page is displayed, which lets you know the container is running.

    ![View the container home page to verify that it's running](../media/how-tos/container-instance/swagger-docs-on-container.png)

1. Select the **Service API Description** link to go to the container's Swagger page.

1. Choose any of the **POST** APIs, and select **Try it out**. The parameters are displayed, which includes example input.

There are several URLs you can also use to verify that the container is running.

|Request|Purpose|
|--|--|
|`http://localhost:5000/`|The container provides a home page.|
|`http://localhost:5000/ready`|Requested with GET, this provides a verification that the container is ready to accept a query against the model. This request can be used for Kubernetes [liveness and readiness probes](https://kubernetes.io/docs/tasks/configure-pod-container/configure-liveness-readiness-probes/).|
|`http://localhost:5000/status`|Requested with GET, like the /ready endpoint, this validates that the container is running without incurring a query against the model. This request can be used for Kubernetes [liveness and readiness probes](https://kubernetes.io/docs/tasks/configure-pod-container/configure-liveness-readiness-probes/).|
|`http://localhost:5000/swagger`|Through this URL, the container provides a full set of documentation for the endpoints and a `Try it now` feature. With this feature, you can enter your settings into a web-based HTML form and make the query without having to write any code. After the query returns, an example CURL command is provided to demonstrate the HTTP headers and body format that's required. |
|`http://localhost:5000/demo`|(***NEW in May release***) Requested through a browser, this feature provides an interactive visualization of the results from queries of input text samples or one you provide.  |

Use this request URL - `http://localhost:5000/text/analytics/v3.0-preview.1/domains/health` - to submit a query to the container.


***

## Next steps 

* Use more [Cognitive Services Containers](../../cognitive-services-container-support.md)
* Use the [Text Analytics Connected Service](../vs-text-connected-service.md)

[install-and-run-containers]: ./text-analytics-how-to-install-containers.md
[container-instances]: https://docs.microsoft.com/azure/container-instances