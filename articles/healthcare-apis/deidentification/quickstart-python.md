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
In terminal, [log in to Microsoft azure.](/cli/azure/authenticate-azure-cli) 
Now, write “python” to open a python shell and paste the following code. 
Be sure to replace your Service URL with the URL you noted when creating a resource. 
You can also change the operation type between REDACT, TAG, or SURROGATE.

```Bash
from azure.health.deidentification import *  
from azure.health.deidentification.models import *  
from azure.identity import DefaultAzureCredential  

SERVICE_URL = "<YOUR SERVICE URL HERE>" ### Replace 
client = DeidentificationClient(SERVICE_URL.replace("https://", ""), DefaultAzureCredential())  

# Input  
text = """  Hannah is a 92-year-old admitted on 9/7/23. First presented symptoms two days earlier on Tuesday, 9/5/23 """  
operation=OperationType.SURROGATE ### CHANGE OPERATION TYPE AS NEEDED. Options include OperationType.TAG, OperationType.REDACT, and OperationType.SURROGATE    

# Processing  
print("############ Input")  
print(text)  
content = DeidentificationContent(input_text=text, operation=operation)  
try: 
    response = client.deidentify(content) 
except Exception as e: 
    print("Request failed with exception: \n\n", e) 
    exit() 
print("\n############ Output")  

if operation==OperationType.TAG:  
    print(response.tagger_result)  
else:  
    print(response.output_text)  

```

## Example input & output

   | Input        | Output          |
   |----------------|---------|
   | Hannah is a 92-year-old admitted on 9/7/23. First presented symptoms two days earlier on Tuesday, 9/5/23           | Kim is a 90-year-old admitted on 9/30/23. First presented symptoms two days earlier on Thursday, 9/28/23          |

## Clean up resources

If you no longer need them, delete the resource group and de-identification service. To do so, select the resource group and select **Delete**.

## Next steps

> [!div class="nextstepaction"]
> [Tutorial: Configure Azure Storage to de-identify documents](configure-storage.md)
