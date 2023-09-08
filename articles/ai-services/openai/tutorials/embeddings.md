---
title: Azure OpenAI Service embeddings tutorial
titleSuffix: Azure OpenAI
description: Learn how to use Azure OpenAI's embeddings API for document search with the BillSum dataset
services: cognitive-services
manager: nitinme
ms.service: cognitive-services
ms.subservice: openai
ms.topic: tutorial
ms.date: 06/14/2023
author: mrbullwinkle #noabenefraim
ms.author: mbullwin
recommendations: false
ms.custom:

---

# Tutorial: Explore Azure OpenAI Service embeddings and document search

This tutorial will walk you through using the Azure OpenAI [embeddings](../concepts/understand-embeddings.md) API to perform **document search** where you'll query a knowledge base to find the most relevant document.

In this tutorial, you learn how to:

> [!div class="checklist"]
> * Install Azure OpenAI and other dependent Python libraries.
> * Download the BillSum dataset and prepare it for analysis.
> * Create environment variables for your resources endpoint and API key.
> * Use the **text-embedding-ada-002 (Version 2)** model
> * Use [cosine similarity](../concepts/understand-embeddings.md) to rank search results.

> [!Important]
> We strongly recommend using `text-embedding-ada-002 (Version 2)`. This model/version provides parity with OpenAI's `text-embedding-ada-002`. To learn more about the improvements offered by this model, please refer to [OpenAI's blog post](https://openai.com/blog/new-and-improved-embedding-model). Even if you are currently using Version 1 you should migrate to Version 2 to take advantage of the latest weights/updated token limit. Version 1 and Version 2 are not interchangeable, so document embedding and document search must be done using the same version of the model.  

## Prerequisites

* An Azure subscription - [Create one for free](https://azure.microsoft.com/free/cognitive-services?azure-portal=true)
* Access granted to Azure OpenAI in the desired Azure subscription
    Currently, access to this service is granted only by application. You can apply for access to Azure OpenAI by completing the form at <a href="https://aka.ms/oai/access" target="_blank">https://aka.ms/oai/access</a>. Open an issue on this repo to contact us if you have an issue.
* <a href="https://www.python.org/" target="_blank">Python 3.7.1 or later version</a>
* The following Python libraries: openai, num2words, matplotlib, plotly, scipy, scikit-learn, pandas, tiktoken.
* [Jupyter Notebooks](https://jupyter.org/)
* An Azure OpenAI resource with the **text-embedding-ada-002 (Version 2)** model deployed. This model is currently only available in [certain regions](../concepts/models.md#model-summary-table-and-region-availability).  If you don't have a resource the process of creating one is documented in our [resource deployment guide](../how-to/create-resource.md).

## Set up

### Python libraries

If you haven't already, you need to install the following libraries:

```cmd
pip install openai num2words matplotlib plotly scipy scikit-learn pandas tiktoken
```

<!--Alternatively, you can use our [requirements.txt file](https://github.com/Azure-Samples/Azure-OpenAI-Docs-Samples/blob/main/Samples/Tutorials/Embeddings/requirements.txt).-->

### Download the BillSum dataset

BillSum is a dataset of United States Congressional and California state bills. For illustration purposes, we'll look only at the US bills. The corpus consists of bills from the 103rd-115th (1993-2018) sessions of Congress. The data was split into 18,949 train bills and 3,269 test bills. The BillSum corpus focuses on mid-length legislation from 5,000 to 20,000 characters in length. More information on the project and the original academic paper where this dataset is derived from can be found on the [BillSum project's GitHub repository](https://github.com/FiscalNote/BillSum)

This tutorial uses the `bill_sum_data.csv` file that can be downloaded from our [GitHub sample data](https://github.com/Azure-Samples/Azure-OpenAI-Docs-Samples/blob/main/Samples/Tutorials/Embeddings/data/bill_sum_data.csv).

You can also download the sample data by running the following command on your local machine:

```cmd
curl "https://raw.githubusercontent.com/Azure-Samples/Azure-OpenAI-Docs-Samples/main/Samples/Tutorials/Embeddings/data/bill_sum_data.csv" --output bill_sum_data.csv
```

### Retrieve key and endpoint

To successfully make a call against Azure OpenAI, you'll need an **endpoint** and a **key**.

|Variable name | Value |
|--------------------------|-------------|
| `ENDPOINT`               | This value can be found in the **Keys & Endpoint** section when examining your resource from the Azure portal. Alternatively, you can find the value in **Azure OpenAI Studio** > **Playground** > **Code View**. An example endpoint is: `https://docs-test-001.openai.azure.com`.|
| `API-KEY` | This value can be found in the **Keys & Endpoint** section when examining your resource from the Azure portal. You can use either `KEY1` or `KEY2`.|

Go to your resource in the Azure portal. The **Endpoint and Keys** can be found in the **Resource Management** section. Copy your endpoint and access key as you'll need both for authenticating your API calls. You can use either `KEY1` or `KEY2`. Always having two keys allows you to securely rotate and regenerate keys without causing a service disruption.

Create and assign persistent environment variables for your key and endpoint.

### Environment variables

# [Command Line](#tab/command-line)

```CMD
setx AZURE_OPENAI_API_KEY "REPLACE_WITH_YOUR_KEY_VALUE_HERE" 
```

```CMD
setx AZURE_OPENAI_ENDPOINT "REPLACE_WITH_YOUR_ENDPOINT_HERE" 
```

# [PowerShell](#tab/powershell)

```powershell
[System.Environment]::SetEnvironmentVariable('AZURE_OPENAI_API_KEY', 'REPLACE_WITH_YOUR_KEY_VALUE_HERE', 'User')
```

```powershell
[System.Environment]::SetEnvironmentVariable('AZURE_OPENAI_ENDPOINT', 'REPLACE_WITH_YOUR_ENDPOINT_HERE', 'User')
```

# [Bash](#tab/bash)

```Bash
echo export AZURE_OPENAI_API_KEY="REPLACE_WITH_YOUR_KEY_VALUE_HERE" >> /etc/environment
echo export AZURE_OPENAI_ENDPOINT="REPLACE_WITH_YOUR_ENDPOINT_HERE" >> /etc/environment

source /etc/environment
```

---

After setting the environment variables, you may need to close and reopen Jupyter notebooks or whatever IDE you're using in order for the environment variables to be accessible. While we strongly recommend using Jupyter Notebooks, if for some reason you cannot you'll need to modify any code that is returning a pandas dataframe by using `print(dataframe_name)` rather than just calling the `dataframe_name` directly as is often done at the end of a code block.

Run the following code in your preferred Python IDE:

<!--If you wish to view the Jupyter notebook that corresponds to this tutorial you can download the tutorial from our [samples repo](https://github.com/Azure-Samples/Azure-OpenAI-Docs-Samples/blob/main/Samples/Tutorials/Embeddings/embedding_billsum.ipynb).-->

## Import libraries and list models

```python
import openai
import os
import re
import requests
import sys
from num2words import num2words
import os
import pandas as pd
import numpy as np
from openai.embeddings_utils import get_embedding, cosine_similarity
import tiktoken

API_KEY = os.getenv("AZURE_OPENAI_API_KEY") 
RESOURCE_ENDPOINT = os.getenv("AZURE_OPENAI_ENDPOINT") 

openai.api_type = "azure"
openai.api_key = API_KEY
openai.api_base = RESOURCE_ENDPOINT
openai.api_version = "2022-12-01"

url = openai.api_base + "/openai/deployments?api-version=2022-12-01" 

r = requests.get(url, headers={"api-key": API_KEY})

print(r.text)
```

```output
{
  "data": [
    {
      "scale_settings": {
        "scale_type": "standard"
      },
      "model": "text-embedding-ada-002",
      "owner": "organization-owner",
      "id": "text-embedding-ada-002",
      "status": "succeeded",
      "created_at": 1657572678,
      "updated_at": 1657572678,
      "object": "deployment"
    },
    {
      "scale_settings": {
        "scale_type": "standard"
      },
      "model": "code-cushman-001",
      "owner": "organization-owner",
      "id": "code-cushman-001",
      "status": "succeeded",
      "created_at": 1657572712,
      "updated_at": 1657572712,
      "object": "deployment"
    },
    {
      "scale_settings": {
        "scale_type": "standard"
      },
      "model": "text-search-curie-doc-001",
      "owner": "organization-owner",
      "id": "text-search-curie-doc-001",
      "status": "succeeded",
      "created_at": 1668620345,
      "updated_at": 1668620345,
      "object": "deployment"
    },
    {
      "scale_settings": {
        "scale_type": "standard"
      },
      "model": "text-search-curie-query-001",
      "owner": "organization-owner",
      "id": "text-search-curie-query-001",
      "status": "succeeded",
      "created_at": 1669048765,
      "updated_at": 1669048765,
      "object": "deployment"
    }
  ],
  "object": "list"
}
```

The output of this command will vary based on the number and type of models you've deployed. In this case, we need to confirm that we have an entry for **text-embedding-ada-002**. If you find that you're missing this model, you'll need to [deploy the model](../how-to/create-resource.md#deploy-a-model) to your resource before proceeding.

Now we need to read our csv file and create a pandas DataFrame. After the initial DataFrame is created, we can view the contents of the table by running `df`.

```python
df=pd.read_csv(os.path.join(os.getcwd(),'bill_sum_data.csv')) # This assumes that you have placed the bill_sum_data.csv in the same directory you are running Jupyter Notebooks
df
```

**Output:**

:::image type="content" source="../media/tutorials/initial-dataframe.png" alt-text="Screenshot of the initial DataFrame table results from the csv file." lightbox="../media/tutorials/initial-dataframe.png":::

The initial table has more columns than we need we'll create a new smaller DataFrame called `df_bills` which will contain only the columns for `text`, `summary`, and `title`.

```python
df_bills = df[['text', 'summary', 'title']]
df_bills
```

**Output:**

:::image type="content" source="../media/tutorials/cleanup-dataframe.png" alt-text="Screenshot of the smaller DataFrame table results with only text, summary and title columns displayed." lightbox="../media/tutorials/cleanup-dataframe.png":::

Next we'll perform some light data cleaning by removing redundant whitespace and cleaning up the punctuation to prepare the data for tokenization.

```python
pd.options.mode.chained_assignment = None #https://pandas.pydata.org/pandas-docs/stable/user_guide/indexing.html#evaluation-order-matters

# s is input text
def normalize_text(s, sep_token = " \n "):
    s = re.sub(r'\s+',  ' ', s).strip()
    s = re.sub(r". ,","",s)
    # remove all instances of multiple spaces
    s = s.replace("..",".")
    s = s.replace(". .",".")
    s = s.replace("\n", "")
    s = s.strip()
    
    return s

df_bills['text']= df_bills["text"].apply(lambda x : normalize_text(x))
```

Now we need to remove any bills that are too long for the token limit (8192 tokens).

```python
tokenizer = tiktoken.get_encoding("cl100k_base")
df_bills['n_tokens'] = df_bills["text"].apply(lambda x: len(tokenizer.encode(x)))
df_bills = df_bills[df_bills.n_tokens<8192]
len(df_bills)
```

```output
20
```

>[!NOTE]
>In this case all bills are under the embedding model input token limit, but you can use the technique above to remove entries that would otherwise cause embedding to fail. When faced with content that exceeds the embedding limit, you can also chunk the content into smaller pieces and then embed those one at a time.

We'll once again examine **df_bills**.

```python
df_bills
```

**Output:**

:::image type="content" source="../media/tutorials/tokens-dataframe.png" alt-text="Screenshot of the DataFrame with a new column called n_tokens." lightbox="../media/tutorials/tokens-dataframe.png":::

To understand the n_tokens column a little more as well how text ultimately is tokenized, it can be helpful to run the following code:

```python
sample_encode = tokenizer.encode(df_bills.text[0]) 
decode = tokenizer.decode_tokens_bytes(sample_encode)
decode
```

For our docs we're intentionally truncating the output, but running this command in your environment will return the full text from index zero tokenized into chunks. You can see that in some cases an entire word is represented with a single token whereas in others parts of words are split across multiple tokens.

```output
[b'SECTION',
 b' ',
 b'1',
 b'.',
 b' SHORT',
 b' TITLE',
 b'.',
 b' This',
 b' Act',
 b' may',
 b' be',
 b' cited',
 b' as',
 b' the',
 b' ``',
 b'National',
 b' Science',
 b' Education',
 b' Tax',
 b' In',
 b'cent',
 b'ive',
 b' for',
 b' Businesses',
 b' Act',
 b' of',
 b' ',
 b'200',
 b'7',
 b"''.",
 b' SEC',
 b'.',
 b' ',
 b'2',
 b'.',
 b' C',
 b'RED',
 b'ITS',
 b' FOR',
 b' CERT',
 b'AIN',
 b' CONTRIBUT',
 b'IONS',
 b' BEN',
 b'EF',
 b'IT',
 b'ING',
 b' SC',
```

If you then check the length of the `decode` variable, you'll find it matches the first number in the n_tokens column.

```python
len(decode)
```

```output
1466
```

Now that we understand more about how tokenization works we can move on to embedding. It is important to note, that we haven't actually tokenized the documents yet. The `n_tokens` column is simply a way of making sure none of the data we pass to the model for tokenization and embedding exceeds the input token limit of 8,192. When we pass the documents to the embeddings model, it will break the documents into tokens similar (though not necessarily identical) to the examples above and then convert the tokens to a series of floating point numbers that will be accessible via vector search. These embeddings can be stored locally or in an Azure Database. As a result, each bill will have its own corresponding embedding vector in the new `ada_v2` column on the right side of the DataFrame.

```python
df_bills['ada_v2'] = df_bills["text"].apply(lambda x : get_embedding(x, engine = 'text-embedding-ada-002')) # engine should be set to the deployment name you chose when you deployed the text-embedding-ada-002 (Version 2) model
```

```python
df_bills
```

**Output:**

:::image type="content" source="../media/tutorials/embed-text-documents.png" alt-text="Screenshot of the formatted results from df_bills command." lightbox="../media/tutorials/embed-text-documents.png":::

As we run the search code block below, we'll embed the search query *"Can I get information on cable company tax revenue?"* with the same **text-embedding-ada-002 (Version 2)** model. Next we'll find the closest bill embedding to the newly embedded text from our query ranked by [cosine similarity](../concepts/understand-embeddings.md).

```python
# search through the reviews for a specific product
def search_docs(df, user_query, top_n=3, to_print=True):
    embedding = get_embedding(
        user_query,
        engine="text-embedding-ada-002" # engine should be set to the deployment name you chose when you deployed the text-embedding-ada-002 (Version 2) model
    )
    df["similarities"] = df.ada_v2.apply(lambda x: cosine_similarity(x, embedding))

    res = (
        df.sort_values("similarities", ascending=False)
        .head(top_n)
    )
    if to_print:
        display(res)
    return res


res = search_docs(df_bills, "Can I get information on cable company tax revenue?", top_n=4)
```

**Output**:

:::image type="content" source="../media/tutorials/query-result.png" alt-text="Screenshot of the formatted results of res once the search query has been run." lightbox="../media/tutorials/query-result.png":::

Finally, we'll show the top result from document search based on user query against the entire knowledge base. This returns the top result of the "Taxpayer's Right to View Act of 1993". This document has a cosine similarity score of 0.76 between the query and the document:

```python
res["summary"][9]
```

```output
"Taxpayer's Right to View Act of 1993 - Amends the Communications Act of 1934 to prohibit a cable operator from assessing separate charges for any video programming of a sporting, theatrical, or other entertainment event if that event is performed at a facility constructed, renovated, or maintained with tax revenues or by an organization that receives public financial support. Authorizes the Federal Communications Commission and local franchising authorities to make determinations concerning the applicability of such prohibition. Sets forth conditions under which a facility is considered to have been constructed, maintained, or renovated with tax revenues. Considers events performed by nonprofit or public organizations that receive tax subsidies to be subject to this Act if the event is sponsored by, or includes the participation of a team that is part of, a tax exempt organization."
```

Using this approach, you can use embeddings as a search mechanism across documents in a knowledge base. The user can then take the top search result and use it for their downstream task, which prompted their initial query.

## Clean up resources

If you created an OpenAI resource solely for completing this tutorial and want to clean up and remove an OpenAI resource, you'll need to delete your deployed models, and then delete the resource or associated resource group if it's dedicated to your test resource. Deleting the resource group also deletes any other resources associated with it.

- [Portal](../../multi-service-resource.md?pivots=azportal#clean-up-resources)
- [Azure CLI](../../multi-service-resource.md?pivots=azcli#clean-up-resources)

## Next steps

Learn more about Azure OpenAI's models:
> [!div class="nextstepaction"]
> [Azure OpenAI Service models](../concepts/models.md)
