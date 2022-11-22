---
title: Azure OpenAI embeddings tutorial
titleSuffix: Azure OpenAI
description: Learn how to use the Azure OpenAI embeddings API for document search with the BillSum dataset
services: cognitive-services
manager: nitinme
ms.service: cognitive-services
ms.subservice: openai
ms.topic: tutorial
ms.date: 11/21/2022
author: mrbullwinkle
ms.author: mbullwin
recommendations: false
ms.custom:

---

# Tutorial: Explore Azure OpenAI embeddings and document search

This tutorial will walk you through using the Azure OpenAI embeddings API to perform **document search** where you'll query a knowledge base to find the most relevant document.

In this tutorial, you learn how to:

> [!div class="checklist"]
> * Install Azure OpenAI and other dependent Python libraries.
> * Download the BillSum dataset and prepare it for analyis.
> * Create environment variables for your resources endpoint and API key.
> * Use the **text-search-curie-doc-001** and **text-search-curie-query-001** models.
> * Use cosine similarity to return search results.

## Prerequisites

* An Azure subscription - [Create one for free](https://azure.microsoft.com/free/cognitive-services?azure-portal=true)
* Access granted to the Azure OpenAI service in the desired Azure subscription
    Currently, access to this service is granted only by application. You can apply for access to the Azure OpenAI service by completing the form at <a href="https://aka.ms/oai/access" target="_blank">https://aka.ms/oai/access</a>. Open an issue on this repo to contact us if you have an issue.
* <a href="https://www.python.org/" target="_blank">Python 3.7.1 or later version</a>
* The following Python libraries: openai, num2words, matplotlib, plotly, scipy, scikit-learn, transformers
* An Azure OpenAI Service resource with **text-search-curie-doc-001** and **text-search-curie-query-001** models deployed. If you don't have a resource the process is documented in our [resource deployment guide](../how-to/create-resource.md).

## Set up

### Python libaries

If you haven't already, you need to install the following libraries:

```cmd
pip install openai, num2words, matplotlib, plotly, scipy, scikit-learn, transformers
```

Alternatively, you can use our requirements.txt file. `TODO:(mbullwin): Create publicly accessible sample repo with requirements.txt file for this tutorial`

### Download the BillSum dataset

BillSum is a dataset of United States Congressional and California state bills. For illustration purposes, we'll look only at the US bills. The corpus consists of bills from the 103rd-115th (1993-2018) sessions of Congress. The data was split into 18,949 train bills and 3,269 test bills. The BillSum corpus focuses on mid-length legislation from 5,000 to 20,000 characters in length. More information on the project and the original academic paper where this dataset is derived from can be found on the [BillSum project's GitHub repository](https://github.com/FiscalNote/BillSum)

This tutorial uses the `bill_sum_data.csv` file that can be downloaded from our [GitHub sample data](TODO-mbullwin-add-link-to-sample-file).

You can also download the sample data by running the following on your local machine:

```cmd
curl "https://raw.githubusercontent.com/Azure/TODO-mbullwin-create-publiclly-accessible-repo-with-sample-dataset-available/bill_sum_data.csv" --output bill_sum_data.csv
```

### Retrieve key and endpoint

To successfully make a call against the Azure OpenAI service, you'll need an **endpoint** and a **key**.

|Variable name | Value |
|--------------------------|-------------|
| `ENDPOINT`               | This value can be found in the **Keys & Endpoint** section when examining your resource from the Azure portal. Alternatively, you can find the value in the **Azure OpenAI Studio** > **Playground** > **Code View**. An example endpoint is: `https://docs-test-001.openai.azure.com/`.|
| `API-KEY` | This value can be found in the **Keys & Endpoint** section when examining your resource from the Azure portal. You can use either `KEY1` or `KEY2`.|

Go to your resource in the Azure portal. The **Endpoint and Keys** can be found in the **Resource Management** section. Copy your endpoint and access key as you'll need both for authenticating your API calls. You can use either `KEY1` or `KEY2`. Always having two keys allows you to securely rotate and regenerate keys without causing a service disruption.

Create and assign persistent environment variables for your key and endpoint.

### Environment variables

# [Command Line](#tab/command-line)

```CMD
setx AZURE_OPENAI_API_KEY "REPLACE_WITH_YOUR_KEY_VALUE_HERE" 
```

```CMD
setx AZURE_OPENAI_API_KEY_ENDPOINT "REPLACE_WITH_YOUR_ENDPOINT_HERE" 
```

# [PowerShell](#tab/powershell)

```powershell
[System.Environment]::SetEnvironmentVariable('AZURE_OPENAI_API_KEY', 'REPLACE_WITH_YOUR_KEY_VALUE_HERE', 'User')
```

```powershell
[System.Environment]::SetEnvironmentVariable('AZURE_OPENAI_API_KEY_ENDPOINT', 'REPLACE_WITH_YOUR_ENDPOINT_HERE', 'User')
```

# [Bash](#tab/bash)

```Bash
echo export AZURE_OPENAI_API_KEY="REPLACE_WITH_YOUR_KEY_VALUE_HERE" >> /etc/environment && source /etc/environment
```

```Bash
echo export AZURE_OPENAI_API_KEY_ENDPOINT="REPLACE_WITH_YOUR_ENDPOINT_HERE" >> /etc/environment && source /etc/environment
```

---

1. Run the following code in your preferred Python IDE:

## Import libraries and list models

```python
import openai
import re
import requests
import sys
from num2words import num2words
import os
import pandas as pd
import numpy as np
from openai.embeddings_utils import get_embedding, cosine_similarity
from transformers import GPT2TokenizerFast

API_KEY = os.getenv("AZURE_OPENAI_API_KEY") 
RESOURCE_ENDPOINT = os.getenv("AZURE_OPENAI_API_KEY_ENDPOINT") 

openai.api_type = "azure"
openai.api_key = API_KEY
openai.api_base = RESOURCE_ENDPOINT
openai.api_version = "2022-06-01-preview"

url = openai.api_base + "/openai/deployments?api-version=2022-06-01-preview"

r = requests.get(url, headers={"api-key": apiKey})

print(r.text)
```

**Output:**

```cmd
{
  "data": [
    {
      "scale_settings": {
        "scale_type": "standard"
      },
      "model": "text-davinci-002",
      "owner": "organization-owner",
      "id": "text-davinci-002",
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

The output of this command will vary based on the number and type of models you've deployed. In this case, we need to confirm that we have entries for both **text-search-curie-doc-001** and  **text-search-curie-query-001**. If you find that you're missing one of these models, you'll need to [deploy the models](../how-to/create-resource.md#deploy-a-model) to your resource before proceeding.

> [!IMPORTANT]
> You will likely receive warnings even when successfully running the code above and retrieving the expected output. The warning messages can be ignored.

**TODO(mbullwin): Confirm with Noa if the below warning is expected behavior** *`TqdmWarning: IProgress not found. Please update jupyter and ipywidgets.None of PyTorch, TensorFlow >= 2.0, or Flax have been found. Models won't be available and only tokenizers, configuration and file/data utilities can be used.`*

```python
df = pd.read_csv("INSERT LOCAL PATH TO BILL_SUM_DATA.CSV")
df_bills = df[['text', 'summary', 'title']]
df_bills.count()
```

**Output:**

```cmd
text       20
summary    20
title      20
dtype: int64
```

Let's take a look at how the data is currently formatted.

```python
print(df_bills)
```

**Output:**

```cmd
 text  \
0   SECTION 1. SHORT TITLE.\r\n\r\n    This Act ma...   
1   SECTION 1. SHORT TITLE.\r\n\r\n    This Act ma...   
2   SECTION 1. RELEASE OF DOCUMENTS CAPTURED IN IR...   
3   SECTION 1. SHORT TITLE.\r\n\r\n    This Act ma...   
4   SECTION 1. SHORT TITLE.\r\n\r\n    This Act ma...   
5   SECTION 1. RELIQUIDATION OF CERTAIN ENTRIES PR...   
6   SECTION 1. SHORT TITLE.\r\n\r\n    This Act ma...   
7   SECTION 1. SHORT TITLE.\r\n\r\n    This Act ma...   
8   SECTION 1. SHORT TITLE.\r\n\r\n    This Act ma...   
9   SECTION 1. SHORT TITLE.\r\n\r\n    This Act ma...   
10  SECTION 1. SHORT TITLE.\r\n\r\n    This Act ma...   
11  SECTION 1. SHORT TITLE.\r\n\r\n    This Act ma...   
12  SECTION 1. FINDINGS.\r\n\r\n    The Congress f...   
13  SECTION 1. SHORT TITLE.\r\n\r\n    This Act ma...   
14  SECTION 1. SHORT TITLE.\r\n\r\n    This Act ma...   
15  SECTION 1. SHORT TITLE.\r\n\r\n    This Act ma...   
16  SECTION 1. SHORT TITLE.\r\n\r\n    This Act ma...   
17  SECTION 1. SHORT TITLE.\r\n\r\n    This Act ma...   
18  SECTION 1. SHORT TITLE.\r\n    This Act may be...   
19  SECTION 1. SHORT TITLE.\r\n\r\n    This Act ma...   

                                              summary  \
0   National Science Education Tax Incentive for B...   
1   Small Business Expansion and Hiring Act of 201...   
2   Requires the Director of National Intelligence...   
3   National Cancer Act of 2003 - Amends the Publi...   
4   Military Call-up Relief Act - Amends the Inter...   
5   Requires the Customs Service to reliquidate ce...   
6   Service Dogs for Veterans Act of 2009 - Direct...   
7   Race to the Top Act of 2010 - Directs the Secr...   
8   Troop Talent Act of 2013 - Directs the Secreta...   
9   Taxpayer's Right to View Act of 1993 - Amends ...   
10  Full-Service Schools Act - Establishes the Fed...   
11  Wall Street Compensation Reform Act of 2010 - ...   
12  Amends the Marine Mammal Protection Act of 197...   
13  Freedom and Mobility in Consumer Banking Act -...   
14  Education and Training for Health Act of 2017 ...   
15  Recreational Hunting Safety and Preservation A...   
16  Andrew Prior Act or Andrew's Law - Amends the ...   
17  Directs the President, in coordination with de...   
18  This measure has not been amended since it was...   
19  Strengthening the Health Care Safety Net Act o...   

                                                title  
0   To amend the Internal Revenue Code of 1986 to ...  
1   To amend the Internal Revenue Code of 1986 to ...  
2   A bill to require the Director of National Int...  
3   A bill to improve data collection and dissemin...  
4   A bill to amend the Internal Revenue Code of 1...  
5   To provide for reliquidation of entries premat...  
6   A bill to require the Secretary of Veterans Af...  
7   A bill to provide incentives for States and lo...  
8                            Troop Talent Act of 2013  
9                Taxpayer's Right to View Act of 1993  
10                           Full-Service Schools Act  
11  A bill to amend the Internal Revenue Code of 1...  
12  To amend the Marine Mammal Protection Act of 1...  
13       Freedom and Mobility in Consumer Banking Act  
14      Education and Training for Health Act of 2017  
15  Recreational Hunting Safety and Preservation A...  
16                                       Andrew's Law  
17                    Energy Independence Act of 2000  
18              Veterans Entrepreneurship Act of 2015  
19  To amend title XIX of the Social Security Act ...  
```

Next we'll perform some light data cleaning on by removing redundant whitespace and cleaning up the punctuation.

```python

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

df_bills['text'] = df_bills["text"].apply(lambda x : normalize_text(x))
```

> [!Note]
> If you receive a warning stating *"A value is trying to be set on a copy of a slice from a DataFrame.
Try using .loc[row_indexer,col_indexer] = value instead"* you can safely ignore this message.

**TODO(mbullwin): Confirm with Noa if the above warning is expected behavior**

Let's once again print `df_bills` so we can visualize the cleanup we just completed:

```python
print(df_bills)
```

**Output:**

```cmd
                                  text  \
0   SECTION 1. SHORT TITLE. This Act may be cited ...   
1   SECTION 1. SHORT TITLE. This Act may be cited ...   
2   SECTION 1. RELEASE OF DOCUMENTS CAPTURED IN IR...   
3   SECTION 1. SHORT TITLE. This Act may be cited ...   
4   SECTION 1. SHORT TITLE. This Act may be cited ...   
5   SECTION 1. RELIQUIDATION OF CERTAIN ENTRIES PR...   
6   SECTION 1. SHORT TITLE. This Act may be cited ...   
7   SECTION 1. SHORT TITLE. This Act may be cited ...   
8   SECTION 1. SHORT TITLE. This Act may be cited ...   
9   SECTION 1. SHORT TITLE. This Act may be cited ...   
10  SECTION 1. SHORT TITLE. This Act may be cited ...   
11  SECTION 1. SHORT TITLE. This Act may be cited ...   
12  SECTION 1. FINDINGS. The Congress finds the fo...   
13  SECTION 1. SHORT TITLE. This Act may be cited ...   
14  SECTION 1. SHORT TITLE. This Act may be cited ...   
15  SECTION 1. SHORT TITLE. This Act may be cited ...   
16  SECTION 1. SHORT TITLE. This Act may be cited ...   
17  SECTION 1. SHORT TITLE. This Act may be cited ...   
18  SECTION 1. SHORT TITLE. This Act may be cited ...   
19  SECTION 1. SHORT TITLE. This Act may be cited ...   

                                              summary  \
0   National Science Education Tax Incentive for B...   
1   Small Business Expansion and Hiring Act of 201...   
2   Requires the Director of National Intelligence...   
3   National Cancer Act of 2003 - Amends the Publi...   
4   Military Call-up Relief Act - Amends the Inter...   
5   Requires the Customs Service to reliquidate ce...   
6   Service Dogs for Veterans Act of 2009 - Direct...   
7   Race to the Top Act of 2010 - Directs the Secr...   
8   Troop Talent Act of 2013 - Directs the Secreta...   
9   Taxpayer's Right to View Act of 1993 - Amends ...   
10  Full-Service Schools Act - Establishes the Fed...   
11  Wall Street Compensation Reform Act of 2010 - ...   
12  Amends the Marine Mammal Protection Act of 197...   
13  Freedom and Mobility in Consumer Banking Act -...   
14  Education and Training for Health Act of 2017 ...   
15  Recreational Hunting Safety and Preservation A...   
16  Andrew Prior Act or Andrew's Law - Amends the ...   
17  Directs the President, in coordination with de...   
18  This measure has not been amended since it was...   
19  Strengthening the Health Care Safety Net Act o...   

                                                title  
0   To amend the Internal Revenue Code of 1986 to ...  
1   To amend the Internal Revenue Code of 1986 to ...  
2   A bill to require the Director of National Int...  
3   A bill to improve data collection and dissemin...  
4   A bill to amend the Internal Revenue Code of 1...  
5   To provide for reliquidation of entries premat...  
6   A bill to require the Secretary of Veterans Af...  
7   A bill to provide incentives for States and lo...  
8                            Troop Talent Act of 2013  
9                Taxpayer's Right to View Act of 1993  
10                           Full-Service Schools Act  
11  A bill to amend the Internal Revenue Code of 1...  
12  To amend the Marine Mammal Protection Act of 1...  
13       Freedom and Mobility in Consumer Banking Act  
14      Education and Training for Health Act of 2017  
15  Recreational Hunting Safety and Preservation A...  
16                                       Andrew's Law  
17                    Energy Independence Act of 2000  
18              Veterans Entrepreneurship Act of 2015  
19  To amend title XIX of the Social Security Act ...  
```

Now we need to remove any bills that are too long for the token limitation.

```python
tokenizer = GPT2TokenizerFast.from_pretrained("gpt2")
df_bills['n_tokens'] = df_bills["text"].apply(lambda x: len(tokenizer.encode(x)))
df_bills = df_bills[df_bills.n_tokens<2000]
len(df_bills)
```

**Output:**

```cmd
12
```

**TODO(mbullwin): Confirm with Noa if the following warning is expected behavior and customers should be ignoring it or if the code requires further modification.** *Token indices sequence length is longer than the specified maximum sequence length for this model (1480 > 1024). Running this sequence through the model will result in indexing errors. A value is trying to be set on a copy of a slice from a DataFrame.Try using .loc[row_indexer,col_indexer] = value instead.*

We'll once again print **df_bills**. Note that as expected, now only 12 results are returned though they retain their original index in the first column.

```python
print(df_bills)
```

**Output:**

```cmd
                                          text  \
0   SECTION 1. SHORT TITLE. This Act may be cited ...   
1   SECTION 1. SHORT TITLE. This Act may be cited ...   
2   SECTION 1. RELEASE OF DOCUMENTS CAPTURED IN IR...   
4   SECTION 1. SHORT TITLE. This Act may be cited ...   
5   SECTION 1. RELIQUIDATION OF CERTAIN ENTRIES PR...   
6   SECTION 1. SHORT TITLE. This Act may be cited ...   
9   SECTION 1. SHORT TITLE. This Act may be cited ...   
12  SECTION 1. FINDINGS. The Congress finds the fo...   
14  SECTION 1. SHORT TITLE. This Act may be cited ...   
16  SECTION 1. SHORT TITLE. This Act may be cited ...   
17  SECTION 1. SHORT TITLE. This Act may be cited ...   
18  SECTION 1. SHORT TITLE. This Act may be cited ...   

                                              summary  \
0   National Science Education Tax Incentive for B...   
1   Small Business Expansion and Hiring Act of 201...   
2   Requires the Director of National Intelligence...   
4   Military Call-up Relief Act - Amends the Inter...   
5   Requires the Customs Service to reliquidate ce...   
6   Service Dogs for Veterans Act of 2009 - Direct...   
9   Taxpayer's Right to View Act of 1993 - Amends ...   
12  Amends the Marine Mammal Protection Act of 197...   
14  Education and Training for Health Act of 2017 ...   
16  Andrew Prior Act or Andrew's Law - Amends the ...   
17  Directs the President, in coordination with de...   
18  This measure has not been amended since it was...   

                                                title  n_tokens  
0   To amend the Internal Revenue Code of 1986 to ...      1480  
1   To amend the Internal Revenue Code of 1986 to ...      1152  
2   A bill to require the Director of National Int...       930  
4   A bill to amend the Internal Revenue Code of 1...      1048  
5   To provide for reliquidation of entries premat...      1846  
6   A bill to require the Secretary of Veterans Af...       872  
9                Taxpayer's Right to View Act of 1993       946  
12  To amend the Marine Mammal Protection Act of 1...      1223  
14      Education and Training for Health Act of 2017      1596  
16                                       Andrew's Law       608  
17                    Energy Independence Act of 2000      1341  
18              Veterans Entrepreneurship Act of 2015      1404  
```

Before the search, we'll embed the text documents and save the corresponding embedding. We embed each chunk using a *doc* model, in this case text-search-curie-doc-001. These embeddings can be stored locally or in an Azure DB.

```python
df_bills['curie_search'] = df_bills["text"].apply(lambda x : get_embedding(x, engine = 'text-search-curie-doc-001'))
```

```python
df_bills
```

**Output:**

:::image type="content" source="../media/tutorials/embed-text-documents.png" alt-text="Screenshot of the formatted results from df_bills command." lightbox="../media/tutorials/embed-text-documents.png":::

At the time of search (live compute), we'll embed the search query using the corresponding *query* model (text-search-query-001). Next find the closest embedding in the database, ranked by cosine similarity.

```python
# search through the reviews for a specific product
def search_docs(df, user_query, top_n=3, to_print=True):
    embedding = get_embedding(
        user_query,
        engine="text-search-curie-query-001"
    )
    df["similarities"] = df.curie_search.apply(lambda x: cosine_similarity(x, embedding))

    res = (
        df.sort_values("similarities", ascending=False)
        .head(top_n)
    )
    if to_print:
        display(res)
    return res


res = search_docs(df_bills, "can i get information on cable company tax revenue", top_n=4)
```

**Output**:

:::image type="content" source="../media/tutorials/query-result.png" alt-text="Screenshot of the formatted results of res once the search query has been run." lightbox="../media/tutorials/query-result.png":::

Finally, we'll show the top result from document search based on user query against the entire knowledge base:

```python
res["summary"][9]
```

**Output:**

```cmd
"Taxpayer's Right to View Act of 1993 - Amends the Communications Act of 1934 to prohibit a cable operator from assessing separate charges for any video programming of a sporting, theatrical, or other entertainment event if that event is performed at a facility constructed, renovated, or maintained with tax revenues or by an organization that receives public financial support. Authorizes the Federal Communications Commission and local franchising authorities to make determinations concerning the applicability of such prohibition. Sets forth conditions under which a facility is considered to have been constructed, maintained, or renovated with tax revenues. Considers events performed by nonprofit or public organizations that receive tax subsidies to be subject to this Act if the event is sponsored by, or includes the participation of a team that is part of, a tax exempt organization."
```

Using this approach, you can use embeddings as a search mechanism across documents in a knowledge base. The user can then take the top search result and use it for their downstream task, which prompted their initial query.

## Clean up resources

If you created an OpenAI resource solely for completing this tutorial and want to clean up and remove an OpenAI resource, you'll need to delete your deployed models, and then delete the resource or associated resource group if it's dedicated to your test resource. Deleting the resource group also deletes any other resources associated with it.

- [Portal](../../cognitive-services-apis-create-account.md#clean-up-resources)
- [Azure CLI](../../cognitive-services-apis-create-account-cli.md#clean-up-resources)


## Next steps

Learn more about Azure OpenAI's models:
> [!div class="nextstepaction"]
> [Next steps button](../concepts/models.md.md)

