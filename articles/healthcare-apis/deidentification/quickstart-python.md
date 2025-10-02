---
title: Create an Azure Health Data Services de-identification service by using the synchronous endpoint in Python
description: Learn how to create an Azure Health Data Services de-identification service by using the synchronous endpoint in Python
services: azure-resource-manager
ms.service: azure-health-data-services
ms.subservice: deidentification-service
author: kimiamavon
ms.author: kimiamavon
ms.topic: quickstart
ms.date: 04/10/2025
---

# Quickstart: Deploy the de-identification service synchronous endpoint in Python

In this quickstart, you deploy an instance of the de-identification service in your Azure subscription using the synchronous endpoint in Python. 

## Prerequisites

- If you don't have an Azure account, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).
- An Azure subscription with write permissions
- Python 3.8 or later  
- The Azure azure-health-deidentification [Python package](/python/api/overview/azure/health-deidentification-readme?view=azure-python-preview&preserve-view=true)


## Create a resource

To deploy an instance of the de-identification service, start at the Azure portal home page.

1. Search for **de-identification** in the top search bar.
1. Select **De-identification Services** in the search results.
1. Select the **Create** button.

## Complete the Basics tab

In the **Basics** tab, you provide basic information for your de-identification service.

1. Fill in the **Project Details** section:

   | Setting        | Action                                       |
   |----------------|----------------------------------------------|
   | Subscription   | Select your Azure subscription.              |
   | Resource group | Select **Create new** and enter **my-deid**. |

1. Fill in the **Instance details** section:

   | Setting        | Action                                       |
   |----------------|----------------------------------------------|
   | Name           | Name your de-identification service.          |
   | Location       | Select a supported Azure region. |

Supported regions are located [here.](https://azure.microsoft.com/explore/global-infrastructure/products-by-region/table)

After you complete the configuration, you can deploy the de-identification service.

1. Select **Next: Review + create** to review your choices.
1. Select Create to start the deployment of your de-identification service. Deployment may take a few minutes. After the deployment is complete, select Go to resource to view your service.

Note your Subscription, Subscription ID, and Service URL.

## Set role-based access control (RBAC)

Now that the resource is deployed, assign yourself as an owner using RBAC. To use the synchronous and asynchronous/Batch API, you need to be a DeID Data Owner. If you only need real-time or batch, you can assign yourself as a DeID Realtime Data User and/or DeID Batch Data Owner, respectively.

1. On the left panel, select **Access control (IAM).** 
1. Click **Add** and **Add role assignment.** 
1. Select **DeID Data Owner** and then select **Members** on the top panel. 
1. Select **+ Select members,** and a panel will appear. Search for your own name and press **Select.** 
1. Back in the **Members** panel, select **Review + assign** at the bottom left.

## Install the package

Install the Azure Health Deidentification client library for Python. More information is available [here.](/python/api/overview/azure/health-deidentification-readme?view=azure-python-preview&preserve-view=true)

```Bash
python -m pip install azure-health-deidentification
```

## Test the service
In terminal, [log in to Microsoft Azure.](/cli/azure/authenticate-azure-cli) 
The code below references the [python SDK for text.](https://github.com/Azure/azure-sdk-for-python/blob/azure-health-deidentification_1.0.0/sdk/healthdataaiservices/azure-health-deidentification/samples/deidentify_text_redact.py) 

To use it, create a python file called "deidentify_text_redact.py" and paste the following code in. Run "python deidentify_text_redact.py".

Be sure to replace AZURE_HEALTH_DEIDENTIFICATION_ENDPOINT with the URL you noted when creating a resource. 
You can also change the operation type between REDACT, TAG, or SURROGATE.

```python

"""
FILE: deidentify_text_redact.py

DESCRIPTION:
    This sample demonstrates the most simple de-identification scenario, calling the service to redact
    PHI values in a string.

USAGE:
    python deidentify_text_redact.py

    Set the environment variables with your own values before running the sample:
    1) AZURE_HEALTH_DEIDENTIFICATION_ENDPOINT - the service URL endpoint for a de-identification service.
"""


from azure.health.deidentification import DeidentificationClient
from azure.health.deidentification.models import (
    DeidentificationContent,
    DeidentificationOperationType,
    DeidentificationResult,
)
from azure.identity import DefaultAzureCredential


def deidentify_text_redact():
    endpoint = AZURE_HEALTH_DEIDENTIFICATION_ENDPOINT
    credential = DefaultAzureCredential()
    client = DeidentificationClient(endpoint, credential)

    # [START redact]
    body = DeidentificationContent(
        input_text="It's great to work at Contoso.", operation_type=DeidentificationOperationType.SURROGATE
    )
    result: DeidentificationResult = client.deidentify_text(body)
    print(f'\nOriginal Text:        "{body.input_text}"')
    print(f'Redacted Text:   "{result.output_text}"')  # Redacted output: "It's great to work at [organization]."
    # [END redact]


if __name__ == "__main__":
    deidentify_text_redact()

```

## Example input & output

   | Input        | Output          |
   |----------------|---------|
   | Kimberly Brown is a 34 y.o. female presenting with bilateral eye discomfort. Last seen by her PCP 2/6/2025 Dr. Orlo at Contoso Clinics Downtown Bellevue PCP.           | Britt Macdonough is a 34 y.o. female presenting with bilateral eye discomfort. Last seen by her PCP 1/18/2025 Dr. Defiore at Cardston Hospital PCP.          |

## Clean up resources

If you no longer need them, delete the resource group and de-identification service. To do so, select the resource group and select **Delete**.

## Next steps

> [!div class="nextstepaction"]
> [Tutorial: Configure Azure Storage to de-identify documents](configure-storage.md)
