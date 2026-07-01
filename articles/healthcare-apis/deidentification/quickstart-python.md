---
title: Create an Azure Health Data Services De-identification Service by Using the Synchronous Endpoint in Python
description: Learn how to create an Azure Health Data Services de-identification service by using the synchronous endpoint in Python.
services: azure-resource-manager
ms.service: azure-health-data-services
ms.subservice: deidentification-service
author: LeaKass
ms.author: leakassab
ms.topic: quickstart
ms.date: 10/23/2025
---

# Quickstart: Deploy the de-identification service synchronous endpoint (English and multilingual)

In this quickstart, you deploy an instance of the de-identification service in your Azure subscription by using the synchronous endpoint in Python.

## Prerequisites

- An Azure account. If you don't have one, create a [free account](https://azure.microsoft.com/pricing/purchase-options/azure-account?cid=msft_learn).
- An Azure subscription with write permissions.
- Python 3.8 or later.
- The Azure `azure-health-deidentification` [Python package](/python/api/overview/azure/health-deidentification-readme?view=azure-python-preview&preserve-view=true).
- Basic familiarity with the Azure CLI or terminal.

## Create a resource

1. In the [Azure portal](https://portal.azure.com), search for **de-identification** in the top search bar.
1. Select **De-identification Services** in the search results.
1. Select **Create**.

## Complete the Basics tab

On the **Basics** tab, provide the following information for your de-identification service.

1. Fill in the **Project details** section:

   | Setting        | Action                                       |
   |----------------|----------------------------------------------|
   | Subscription   | Select your Azure subscription.              |
   | Resource group | Select **Create new** and enter **my-deid**. |

1. Fill in the **Instance details** section:

   | Setting        | Action                                       |
   |----------------|----------------------------------------------|
   | Name           | Name your de-identification service.          |
   | Location       | Select a supported Azure region. |

Supported regions are located in the [Product Availability by Region table](https://azure.microsoft.com/explore/global-infrastructure/products-by-region/table).

After you finish the configuration, you can deploy the de-identification service:

1. Select **Next: Review + create** to review your choices.
1. Select **Create** to start the deployment of your de-identification service. Deployment might take a few minutes. After the deployment is finished, select **Go to resource** to view your service.
1. After the deployment finishes, note your subscription, subscription ID, and service URL.

## Set role-based access control

Now that the resource is deployed, you need to assign yourself the following permissions by using Azure role-based access control to use the de-identification APIs.

1. On the left panel, select **Access control (IAM).**
1. Select **Add** and **Add role assignment.**
1. Select **DeID Data Owner** and **DeID Real-Time Data User**, and then select **Members** on the top panel.
1. Select **+ Select members** to open a panel. Search for your own name and choose **Select.**
1. Back on the **Members** panel, select **Review + assign** at the lower left.

>[!TIP]
>If you want to use both the synchronous and asynchronous (Batch) APIs, you need to also assign yourself the DeID Batch Data Owner role.

## Run the service by using the Python SDK

1. Install the Azure Health De-identification client library for Python. More information is available in the [Product Availability by Region table](/python/api/overview/azure/health-deidentification-readme?view=azure-python-preview&preserve-view=true).

    ```Bash
    python -m pip install azure-health-deidentification
    ```

1. Test the service.

The following steps walk you through how to test the service for the `REDACT` operation. When you test, you can change the language-locale pair to [other languages supported](languages-supported.md) by the service.

### Redact text

1. In the terminal, [sign in to Azure](/cli/azure/authenticate-azure-cli).
1. The following code references the [Python SDK for text](https://github.com/Azure/azure-sdk-for-python/blob/azure-health-deidentification_1.0.0/sdk/healthdataaiservices/azure-health-deidentification/samples/deidentify_text_redact.py). To use it, create a Python file called `deidentify_text_redact.py` and paste in the following code. Run `python deidentify_text_redact.py`. Replace `AZURE_HEALTH_DEIDENTIFICATION_ENDPOINT` with the URL that you noted when you created a resource.

```python

"""
FILE: deidentify_text_redact.py

DESCRIPTION:
    This sample demonstrates the most simple de-identification scenario, calling the service to redact
    PHI values in a string.

USAGE:
    python deidentify_text_redact.py

    Set the `AZURE_HEALTH_DEIDENTIFICATION_ENDPOINT` with your service's URL.
"""

from azure.health.deidentification import DeidentificationClient
from azure.health.deidentification.models import (
    DeidentificationContent,
    DeidentificationOperationType,
    DeidentificationResult,
)
from azure.identity import DefaultAzureCredential


def deidentify_text_redact():
    endpoint = "<YOUR SERVICE'S URL>"
    credential = DefaultAzureCredential()
    client = DeidentificationClient(endpoint, credential)

    locale = "en-US"  # e.g., "fr-FR", "es-US", etc

    body = DeidentificationContent(
        input_text="It's great to work at Contoso.",
        operation_type=DeidentificationOperationType.REDACT,    
    )

    result: DeidentificationResult = client.deidentify_text(body)
    print(f'\nOriginal Text:  "{body.input_text}"')
    print(f'Locale:         {locale}')
    print(f'Redacted Text:  "{result.output_text}"')
    # [END redact]


if __name__ == "__main__":
    deidentify_text_redact()

```

### Example inputs and outputs

| Operation  | Language-locale pair | Input                                                                                                                                                                    | Output                                                                                                               |
|-------------|----------------------|--------------------------------------------------------------------------------------------------------------------------------------------------------------------------|----------------------------------------------------------------------------------------------------------------------|
| Redaction   | en-US               | `Kimberly Brown is a 34 y.o. female presenting with bilateral eye discomfort. Last seen by her PCP 2/6/2025 Dr. Orlo at Contoso Clinics Downtown Bellevue PCP.`           | `[patient] is a [age] y.o. female presenting with bilateral eye discomfort. Last seen by her PCP [date] [doctor] at [hospital] PCP.` |
| Redaction   | fr-CA               | `André, un ingénieur âgé de 45 ans, a été admis à l'Hôpital de Laval le 23 avril 2025 après une évaluation avec Dr Jeanne Dubuc.`                                         | `[patient], un ingénieur âgé de [age], a été admis à l'[hospital] le [date] après une évaluation avec [doctor].`    |

## Clean up resources

If you no longer need the service, delete the resource group and de-identification service.

1. In the Azure portal, select the resource group.
1. Select **Delete**.

## Next step

> [!div class="nextstepaction"]
> [Tutorial: Configure Azure Storage to de-identify documents](configure-storage.md)
