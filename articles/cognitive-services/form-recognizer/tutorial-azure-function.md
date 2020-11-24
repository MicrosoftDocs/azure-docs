---
title: "Tutorial: tbd"
titleSuffix: Azure Cognitive Services
description: In this tutorial tbd
author: PatrickFarley
manager: nitinme

ms.service: cognitive-services
ms.subservice: forms-recognizer
ms.topic: tutorial
ms.date: 10/28/2020
ms.author: pafarley
---

# Tutorial: tbd

Use an Azure function to trigger the processing of documents in Azure blog storage through the Azure Form Recognizer service. This workflow extracts table data from stored documents and saves that data in Azure Tables, which can then be displayed through PowerBI.

In this tutorial, you learn how to:

> [!div class="checklist"]
> * 

## Prerequisites

* Azure subscription - [Create one for free](https://azure.microsoft.com/free/cognitive-services)
* A set of at least five forms of the same type to use for training/testing data. See [Build a training data set](./build-training-data-set.md) for tips and options for putting together your training data set. For this quickstart, you can use the files under the **Train** folder of the [sample data set](https://go.microsoft.com/fwlink/?linkid=2128080).
* [Python 3.x](https://www.python.org/)
* Azure Storage Explorer installed on your computer
* [Azure Functions Core Tools](https://docs.microsoft.com/da-dk/azure/developer/python/tutorial-vs-code-serverless-python-01#azure-functions-core-tools) installed
* Visual Studio Code with the following extensions installed:
  * [Azure Functions extension](https://docs.microsoft.com/da-dk/azure/developer/python/tutorial-vs-code-serverless-python-01#visual-studio-code-python-and-the-azure-functions-extension)
  * NuGet Package Manager
  * [Python extension](https://code.visualstudio.com/docs/python/python-tutorial#_install-visual-studio-code-and-the-python-extension)

## Create an Azure Storage account

StorageV2

Create two empty blob containers, named **Test** and **Output**.



## Create an Azure Functions project

In VSCode, press create function (add lightning icon).
In the Create new project options, select Python
Next you're prompted to select your function type. Select Azure Blob Storage trigger. And give it a name.
Create new local app settings
Select your Azure Subscription and your Azure storage account you created. Then you have to enter the name of the storage container (test)
Then opt to open in current window. This will display a new template python script.


## Test the function

press run or F5. VSCode will prompt you to select a storage account to interface with. 
You'll see the Azure function logo in console
Open Azure Storage Explorer to monitor and upload a sample pdf file. 
Check the code terminal and you should see that the script was triggered by the pdf upload.
Stop the script.

## Add form processing code

Next, you'll add your own code to the Python script to call the Form Recognizer service and parse the pdf documents.

In VSCode, navigate to the function's *requirements.txt* file. This defines the dependencies for your script. Add the following Python package names:

```
azure-functions
azure-storage
azure-storage-blog
requests
numpy
pandas
```

Then ...

```Python
import logging
from azure.storage.blob import BlobServiceClient
import azure.functions as func
import json
import time
from requests import get, post
import os
from collections import OrderedDict
import numpy as np
import pandas as pd

# This part is automatically generated
def main(myblob: func.InputStream):
    logging.info(f"Python blob trigger function processed blob \n"
    f"Name: {myblob.name}\n"
    f"Blob Size: {myblob.length} bytes")

# From here you need to copy that into your __init__ file. Also the import section above
# This is the call to the Form Recognizer endpoint
    endpoint = r"Your Form Recognizer Endpoint"
    apim_key = "Your Form Recognizer Key"
    post_url = endpoint + "/formrecognizer/v2.0-preview/Layout/analyze"
    source = myblob.read()

    headers = {
    # Request headers
    'Content-Type': 'application/pdf',
    'Ocp-Apim-Subscription-Key': apim_key,
        }

    text1=os.path.basename(myblob.name)

    resp = post(url = post_url, data = source, headers = headers)
    if resp.status_code != 202:
        print("POST analyze failed:\n%s" % resp.text)
        quit()
    print("POST analyze succeeded:\n%s" % resp.headers)
    get_url = resp.headers["operation-location"]

    wait_sec = 25

    time.sleep(wait_sec)

    # The layout API is async therefore the wait statement
    resp = get(url = get_url, headers = {"Ocp-Apim-Subscription-Key": apim_key})

    resp_json = json.loads(resp.text)

    status = resp_json["status"]

    if status == "succeeded":
        print("Layout Analysis succeeded:\n%s")
        results=resp_json
    else:
        print("GET Layout results failed:\n%s")
        quit()

    results=resp_json

    # This is the connection to the blob storage, with the Azure Python SDK
    blob_service_client = BlobServiceClient.from_connection_string("DefaultEndpointsProtocol=https;AccountName="Storage Account Name";AccountKey="storage account key";EndpointSuffix=core.windows.net")
    container_client=blob_service_client.get_container_client("output")

    # The code below is how I extract the json format into tabular data 
    # Please note that you need to adjust the code below to your form structure
    # It probably won't work out-of-box for your specific form
    pages = results["analyzeResult"]["pageResults"]

    def make_page(p):
        res=[]
        res_table=[]
        y=0
        page = pages[p]
        for tab in page["tables"]:
            for cell in tab["cells"]:
                res.append(cell)
                res_table.append(y)
            y=y+1

        res_table=pd.DataFrame(res_table)
        res=pd.DataFrame(res)
        res["table_num"]=res_table[0]
        h=res.drop(columns=["boundingBox","elements"])
        h.loc[:,"rownum"]=range(0,len(h))
        num_table=max(h["table_num"])
        return h, num_table, p

    h, num_table, p= make_page(0)   

    for k in range(num_table+1):
        new_table=h[h.table_num==k]
        new_table.loc[:,"rownum"]=range(0,len(new_table))
        row_table=pages[p]["tables"][k]["rows"]
        col_table=pages[p]["tables"][k]["columns"]
        b=np.zeros((row_table,col_table))
        b=pd.DataFrame(b)
        s=0
        for i,j in zip(new_table["rowIndex"],new_table["columnIndex"]):
            b.ix[i,j]=new_table.ix[new_table.ix[s,"rownum"],"text"]
            s=s+1

    # Here is the upload to the blob storage
    tab1_csv=b.to_csv(header=False,index=False,mode='w')
    name1=(os.path.splitext(text1)[0]) +'.csv'
    container_client.upload_blob(name=name1,data=tab1_csv)
```

## Run the function

Press F5. Use Azure Storage Explorer to upload the sample pdf form to the **test** storage container. This should trigger the script to run, and you should then see the result in the **output** container.

And then the result in PowerBI ?

## Next steps

Follow the AI Builder documentation for using a form-processing model.

* [Use the form-processor component in Power Apps](https://docs.microsoft.com/ai-builder/form-processor-component-in-powerapps)
* [Use a form-processing model in Power Automate](https://docs.microsoft.com/ai-builder/form-processing-model-in-flow)