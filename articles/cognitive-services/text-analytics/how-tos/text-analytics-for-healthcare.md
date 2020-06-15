---
title: How to use the Text Analytics for healthcare service
titleSuffix: Azure Cognitive Services
description: This article explains how to use the Text Analytics for healthcare service.
services: cognitive-services
author: aahill
manager: nitinme

ms.service: cognitive-services
ms.subservice: text-analytics
ms.topic: conceptual
ms.date: 06/15/2020
ms.author: aahi
---

# How to: Use Text Analytics for health

> [!IMPORTANT] 
> Text Analytics for Health is not a substitute for professional medical advice, diagnosis, or treatment. Azure Text Analytics for Health should only be used in patient care scenarios after review for accuracy and sound medical judgment by trained medical professionals.

Azure Text Analytics for Health is a containerized service that extracts relevant medical information from unstructured texts such as doctor's notes, discharge summaries, clinical documents, and electronic health records. The Text Analytics for Health container currently performs named entity recognition (NER), relation extraction, and entity linking for English-language text in your own environment that meets your specific security and data governance requirements.

Text Analytics for Health uses natural language processing techniques to find and label valuable information in unstructured clinical documents such as doctor's notes, electronic health records, patient intake forms and discharge summaries.

## Features


#### [Named Entity Recognition](#tab/ner)

Named Entity Recognition detects words and phrases mentioned in unstructured text that can be associated with one or more semantic types, such as diagnosis, medication name, symptom/sign, or age.

![Health NER](../media/ta-for-health/health-named-entity-recognition.png)

Named entity categories supported by Text Analytics for Health include:


|Category  |Description   |Notes  |
|---------|---------|---------|---------|
| `AGE` | `tbd` |  | 
| `BODY_STRUCTURE` | `tbd` | |
| `CONDITION_QUALIFIER` | `tbd` | |
| `DIAGNOSIS` | `tbd` | |
| `DIRECTION` | `tbd` | |
| `DOSAGE` | `tbd` | |
| `EXAMINATION_NAME` | `tbd` | |
| `EXAMINATION_RELATION` | `tbd` | |
| `EXAMINATION_UNIT` | `tbd` | |
| `EXAMINATION_VALUE` | `tbd` | |
| `FAMILY_RELATION` | `tbd` | |
| `FREQUENCY` | `tbd` | |
| `GENDER` | `tbd` | |
| `GENE` | `tbd` | |
| `MEDICATION_CLASS` | `tbd` | |
| `MEDICATION_NAME`  | `tbd` | |
| `ROUTE_OR_MODE`  | `tbd` | |
| `SYMPTOM_OR_SIGN`  | `tbd` | |
| `TIME`  | `tbd` | |
| `TREATMENT_NAME`  | `tbd` | |
| `VARIANT`  | `tbd` | |


#### [relation extraction](#tab/relation-extraction)

Relation extraction identifies meaningful connections between concepts mentioned in text. For example, a time of medication relation is found between a medication name ("Altace") and the time ("8 years") corresponding to how long the patient had been taking the medication.

![Health RE](../media/ta-for-health/health-relation-extraction.png)

Supported relation types include:

|Category  |Description |Starting model version  |Notes  |
|---------|---------|---------|---------|
|  `DIRECTION_OF_BODY_STRUCTURE` | | | |
|  `TIME_OF_CONDITION` | | | |
|  `QUALIFIER_OF_CONDITION` | | | |
|  `DOSAGE_OF_MEDICATION` | | | |
|  `FORM_OF_MEDICATION` | | | |
|  `ROUTE_OR_MODE_OF_MEDICATION` | | | |
|  `STRENGTH_OF_MEDICATION` | | | |
|  `ADMINISTRATION_RATE_OF_MEDICATION` | | | |
|  `FREQUENCY_OF_MEDICATION` | | | |
|  `TIME_OF_MEDICATION` | | | |
|  `TIME_OF_TREATMENT` | | | |
|  `FREQUENCY_OF_TREATMENT` | | | |
|  `VALUE_OF_EXAMINATION` | | | |
|  `UNIT_OF_EXAMINATION` | | | |
|  `RELATION_OF_EXAMINATION` | | | |
|  `TIME_OF_EXAMINATION` | | | |
|  `ABBREVIATION` | | | |

#### [Entity Linking](#tab/entity-linking)

Entity Linking disambiguates distinct entities by associating named entities mentioned in text to concepts found in a predefined taxonomy of concepts. For example, the concept “NHL” in the text below is linked to the Unified Medical Language System (UMLS) concept C0024305.

![Health EL](../media/ta-for-health/health-entity-linking.png)

Text Analytics for Health supports linking to the health and biomedical vocabularies represented in the Unified Medical Language System ([UMLS](https://www.nlm.nih.gov/research/umls/sourcereleasedocs/index.html)) Metathesaurus Knowledge Source, including:

|Category  |Description |Starting model version  |Notes  |
|---------|---------|---------|---------|
|  `CPT` | | | |
|  `ICD-10-CM` | | | |
|  `ICPC2` | | | |
|  `MeSH` | | | |
|  `RxNorm` | | | |
|  `SNOMEDCT_US` | | | |

#### [Negation Detection](#tab/negation-detection) 

The meaning of medical content is highly affected by modifiers such as negation which can have critical implication if misdiagnosed. Text Analytics for Health supports negation detection for the different entities mentioned in the text. 

![Health NEG](../media/ta-for-health/health-negation.png)

Notice that in some cases a single negation term may address several terms at once. The negation of a recognized entity is represented in the JSON output by the boolean value of the "isNegated" flag as follows:
```json
{
          "id": "2",
          "offset": 90,
          "length": 10,
          "text": "chest pain",
          "type": "SYMPTOM_OR_SIGN",
          "score": 0.9972,
          "isNegated": true,
          "links": [
            {
              "dataSource": "UMLS",
              "id": "C0008031"
            },
            {
              "dataSource": "CHV",
              "id": "0000023593"
            },
            ...
```

---

## Supported languages

Text Analytics for Health only supports English language documents.

## HIPAA compliance

This is a HIPAA and HiTRUST eligible service. For more information on Azure Text Analytics' certifications, please see sections 49, 50 and Appendix A of the [Microsoft Azure Compliance Offering](https://aka.ms/azurecompliance) document.  For an Azure Blueprint sample of using Azure Policy to assist towards HIPAA HITRUST attestation, please see the [Azure HIPAA Blueprint](https://docs.microsoft.com/azure/governance/blueprints/samples/hipaa-hitrust/) page.

## Request access to the container registry

Fill out and submit the [Cognitive Services containers request form](https://aka.ms/cognitivegate) to request access to the container.

[!INCLUDE [Request access to the container registry](../../../../includes/cognitive-services-containers-request-access-only.md)]

[!INCLUDE [Authenticate to the container registry](../../../../includes/cognitive-services-containers-access-registry.md)]

## Install the container

See [How to install and run Text Analytics containers](text-analytics-how-to-install-containers?tabs=healthcare) to get your container running. You can also use [Azure web app for containers](https://docs.microsoft.com/azure/app-service/containers/) and [Azure container instances](text-analytics-how-to-use-container-instances.md) to make installation easier. Use the below PowerShell scripts  to automate the resource provisioning and installation process. 

### Using Azure Web App for Containers

Azure [Web App for Containers](https://azure.microsoft.com/services/app-service/containers/) is an Azure resource dedicated to running containers in the cloud. It brings out-of-the-box capabilities such as autoscaling, support of docker containers and docker compose, HTTPS support and much more.

> [!NOTE]
> Using Azure Web App you will automatically get a domain in the form of `<appservice_name>.azurewebsites.net`

Run this PowerShell script using the [Azure CLI](https://docs.microsoft.com/cli/azure/?view=azure-cli-latest) to create a Web App for Containers, using your subscription and the container image over HTTPS. Wait for the script to complete (approximately 20 minutes) before submitting the first request.

```bash
$subscription_name = ""                    # THe name of the subscription you want you resource to be created on.
$resource_group_name = ""                  # The name of the resource group you want the AppServicePlan
                                           #    and AppSerivce to be attached to.
$resources_location = ""                   # This is the location you wish the AppServicePlan to be deployed to.
                                           #    You can use the "az account list-locations -o table" command to
                                           #    get the list of available locations and location code names.
$appservice_plan_name = ""                 # This is the AppServicePlan name you wish to have.
$appservice_name = ""                      # This is the AppService resource name you wish to have.
$TEXT_ANALYTICS_RESOURCE_API_KEY = ""      # This should be taken from the Text Analytics resource.
$TEXT_ANALYTICS_RESOURCE_API_ENDPOINT = "" # This should be taken from the Text Analytics resource.
$DOCKER_REGISTRY_SERVER_PASSWORD = ""      # This will be provided separately.
$DOCKER_REGISTRY_SERVER_USERNAME = ""      # This will be provided separately.
$DOCKER_IMAGE_NAME = "containerpreview.azurecr.io/microsoft/cognitive-services-healthcare:latest"

az login
az account set -s $subscription_name
az appservice plan create -n $appservice_plan_name -g $resource_group_name --is-linux -l $resources_location --sku P2V2
az webapp create -g $resource_group_name -p $appservice_plan_name -n $appservice_name -i $DOCKER_IMAGE_NAME -s $DOCKER_REGISTRY_SERVER_USERNAME -w $DOCKER_REGISTRY_SERVER_PASSWORD
az webapp config appsettings set -g $resource_group_name -n $appservice_name --settings Eula=accept Billing=$TEXT_ANALYTICS_RESOURCE_API_ENDPOINT ApiKey=$TEXT_ANALYTICS_RESOURCE_API_KEY

# Once deployment complete, the resource should be available at: https://<appservice_name>.azurewebsites.net
```

### Using Azure Container Instance

You can also use an Azure Container Instance (ACI) to make deployment easier. ACI is a resource that allows you to run Docker containers on-demand in a managed, serverless Azure environment. 

See [How to use Azure Container Instances](text-analytics-how-to-use-container-instances.md) article for steps on deploying an ACI resource using the Azure portal. You can also use the below PowerShell script using [Azure CLI](https://docs.microsoft.com/cli/azure/?view=azure-cli-latest), which will create a ACI on your subscription using the container image.  Wait for the script to complete (approximately 20 minutes) before submitting the first request.

> [!NOTE] 
> Azure Container Instances don't include HTTPS support for the builtin domains. If you need HTTPS, you will need to manually configure it, including creating a certificate and registering a domain. You can find instructions to do this with NGINX below.

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

### Secure ACI connectivity

By default there is no security provided when using ACI with container API. This is because typically containers will run as part of a pod which is protected from the outside by a network bridge. You can however modify a container with a front-facing component, keeping the container endpoint private. Here we describe how to accomplish this using [NGINX](https://www.nginx.com), which can be used as an ingress gateway to support HTTPS/SSL and client-certificate authentication.

> [!NOTE]
> NGINX is an open-source, high-performance HTTP server and proxy. An NGINX container can be used to terminate a TLS connection for a single container. A more complex NGINX ingress-based TLS termination solution can also be constructed.

#### Set up NGINX as an ingress gateway

NGINX uses [configuration files](https://docs.nginx.com/nginx/admin-guide/basic-functionality/managing-configuration-files/) (a sample configuration file is provided below) to enable features at runtime. In order to enable TLS termination for another service, we must specify an ssl_certificate to terminate the TLS connection and a proxy_pass to specify an address for the service.

If you don't have a SSL certificate for your domain, here is a good resource on [how to create and acquire a SSL certificate](https://letsencrypt.org/getting-started/).

> [!NOTE]
> The `ssl_certificate` expects a path to be specified within the NGINX container's local filesystem. The address specified for `proxy_pass` must be available from within the NGINX container's network.

The NGINX container will load all of the files in the _.conf_ that are mounted under `/etc/nginx/conf.d/` into the HTTP configuration path.

```nginx
server {
  listen              80;
  return 301 https://$host$request_uri;
}
server {
  listen              443 ssl;
  # replace with .crt and .key paths
  ssl_certificate     /cert/Local.crt;
  ssl_certificate_key /cert/Local.key;

  location / {
    proxy_pass http://cognitive-service:5000;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Real-IP  $remote_addr;
  }
}
```

#### Example Docker compose file

The below example shows how a [docker compose](https://docs.docker.com/compose/reference/overview) file can be created to deploy the NGINX and Text Analytics for Health containers:

```yaml
version: "3.7"
services:
  cognitive-service:
    image: {IMAGE_ID}
    ports:
      - 5000:5000
    environment:
      - eula=accept
      - billing={ENDPOINT_URI}
      - apikey={API_KEY}
      - Logging:Disk:Format=json
    volumes:
        # replace with path to logs folder
      - <path-to-logs-folder>:/output
  nginx:
    image: nginx
    ports:
      - 443:443
    volumes:
        # replace with paths for certs and conf folders
      - <path-to-certs-folder>:/cert
      - <path-to-conf-folder>:/etc/nginx/conf.d/
```

To initiate this docker compose file, execute the following command from a console at the root level of the file:

```bash
docker-compose up
```

For more information, see NGINX's documentation on [NGINX SSL Termination](https://docs.nginx.com/nginx/admin-guide/security-controls/terminating-ssl-http/).


## Example API request

The following JSON is an example of the Text Analytics for Health API request's POST body:

```json
{
  "documents": [
    {
      "language": "en",
      "id": "1",
      "text": "Patient suffers from high blood pressure and irregular heartbeat."
    },
    {
      "language": "en",
      "id": "2",
      "text": "Prescribed 100mg ibuprofen, taken twice daily."
    }
  ]
}
```

## API response body

The following JSON is an example of the Text Analytics for Health API response body:

```json
{
  "documents": [
        {
            "id": "1",
            "entities": [
                {
                    "id": "0",
                    "offset": 21,
                    "length": 19,
                    "text": "high blood pressure",
                    "type": "SYMPTOM_OR_SIGN",
                    "score": 0.9998,
                    "umlsId": "C0020538"
                },
                {
                    "id": "1",
                    "offset": 45,
                    "length": 19,
                    "text": "irregular heartbeat",
                    "type": "SYMPTOM_OR_SIGN",
                    "score": 0.9997,
                    "umlsId": "C0003811"
                }
            ]
        },
        {
            "id": "2",
            "entities": [
                {
                    "id": "0",
                    "offset": 11,
                    "length": 5,
                    "text": "100mg",
                    "type": "DOSAGE",
                    "score": 0.9997
                },
                {
                    "id": "1",
                    "offset": 17,
                    "length": 9,
                    "text": "ibuprofen",
                    "type": "MEDICATION_NAME",
                    "score": 0.9999,
                    "umlsId": "C0020740"
                },
                {
                    "id": "2",
                    "offset": 34,
                    "length": 11,
                    "text": "twice daily",
                    "type": "FREQUENCY",
                    "score": 0.9998
                }
            ],
            "relations": [
                {
                    "relationType": "DOSAGE_OF_MEDICATION",
                    "score": 1.0,
                    "entities": [
                        {
                            "id": "0",
                            "role": "ATTRIBUTE"
                        },
                        {
                            "id": "1",
                            "role": "ENTITY"
                        }
                    ]
                }
            ]
        }
  ],
  "errors": [],
  "modelVersion": "2020-01-01"
}
```