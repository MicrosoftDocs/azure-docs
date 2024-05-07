---
# Required metadata
# For more information, see https://review.learn.microsoft.com/en-us/help/platform/learn-editor-add-metadata?branch=main
# For valid values of ms.service, ms.prod, and ms.topic, see https://review.learn.microsoft.com/en-us/help/platform/metadata-taxonomies?branch=main

title:       # Add a title for the browser tab
description: # Add a meaningful description for search results
author:      jojohnso-msft # GitHub alias
ms.author:   johnsonje.arc # Microsoft alias
ms.service:  # Add the ms.service or ms.prod value
# ms.prod:   # To use ms.prod, uncomment it and delete ms.service
ms.topic:    # Add the ms.topic value
ms.date:     05/07/2024
---

# Azure Database for PostgreSQL - Flexible Server: azure_local_ai extension (Preview)  
  
The azure_local_ai extension for Azure Database for PostgreSQL Flexible server will allow you to use [[NA1]](#_msocom_1) registered[[N(2]](#_msocom_2) [[JJ3]](#_msocom_3) [[N(4]](#_msocom_4) , <ins> </ins>pre-trained[[NA5]](#_msocom_5)  open-source model(s) [[NA6]](#_msocom_6) deployed locally to your Azure Database for PostgreSQL server.  These models can be used to create embeddings that are used to improve Retrieval Augmented Generation(RAG) <ins>a</ins>nd help[[N(7]](#_msocom_7) [[JJ8]](#_msocom_8) [[JJ9]](#_msocom_9)  build rich generative AI applications[[NA10]](#_msocom_10) [[ML11]](#_msocom_11) [[ML12]](#_msocom_12) .  The azure_local_ai extension enables the database to call locally deployed models to create vector embeddings from text data, simplifying the development process and reducing latency, by removing the need to make additional remote API calls to separate larger [[NA13]](#_msocom_13) [[ML14]](#_msocom_14) AI embedding models.[[ML15]](#_msocom_15) 

Local embedding generation brings text embedding models within Azure Database for PostgreSQL, so the embeddings can be generated locally, without making remote calls to Azure OpenAI. This feature helps customers:

Reduce embedding creation time to single-digit millisecond latency;

Leverage embedding models at a predictable cost;

Keep data compliant by using local embeddings.[[NA16]](#_msocom_16) 

 

~~<u>Note!  the Azure Local AI extension is currently in preview.</u>[[N(17] ](#_msocom_17)   <u>Open source AI models made available by Microsoft for installation through the Azure Local AI extension are deemed to be Non-Microsoft Products under the Microsoft Product Terms. Customer’s use of open source AI models are  governed by the separate license terms provided in product documentation associated with such model made available through the Azure Local AI extension.</u>~~

||
| -------- |
||
||![Rectangle: Rounded Corners: Note!  The azure_local_ai extension is currently in preview.   Open-source AI models made available by Microsoft for installation through the Azure Local AI extension are deemed to be Non-Microsoft Products under the Microsoft Product Terms. Customer’s use of open-source AI models are governed by the separate license terms provided in product documentation associated with such model made available through the Azure Local AI extension.](file:///C:/Users/jojohnso/AppData/Local/Temp/msohtmlclip1/01/clip_image001.png)|

 

 

 

 

 

Enable the azure_local_a[[AP18]](#_msocom_18) i extension (preview[[N(19]](#_msocom_19) [[JJ20]](#_msocom_20) )

 

>[!IMPORTANT]
> Given the memory requirements to run these language models locally[[ML21]](#_msocom_21) , __only__ memory optimized Azure SKUs are currently supported. 

Before you can enable azure_local_ai on your Azure Database for PostgreSQL flexible server instance, you need to add it to your allowlist as described in [how to use PostgreSQL extensions](/azure/postgresql/flexible-server/concepts-extensions) and check if correctly added by running SHOW azure.extensions;.[[NA22]](#_msocom_22) 

Select “Server parameters” from the Settings section of the Azure Database for PostgreSQL Flexible Server Azure Portal Blade[[NA23]](#_msocom_23) .

![](file:///C:/Users/jojohnso/AppData/Local/Temp/msohtmlclip1/01/clip_image006.png)

 

Select AZURE_LOCAL_AI from the extensions list. [[NA24]](#_msocom_24) [[JJ25]](#_msocom_25) 

 

![A screenshot of a computerDescription automatically generated](file:///C:/Users/jojohnso/AppData/Local/Temp/msohtmlclip1/01/clip_image008.png)

 

Click “Save” to apply the changes and begin the Azure Local AI deployment. [[NA26]](#_msocom_26) 

 

![A screenshot of a computerDescription automatically generated](file:///C:/Users/jojohnso/AppData/Local/Temp/msohtmlclip1/01/clip_image010.png)

 

![Rectangle: Rounded Corners: Note!  Enabling Azure Local AI preview will deploy the multilingual-e5-small model to your Azure Database for PostgreSQL Flexible Server instance. Additional third-party open-source models may become available for installation on an ongoing basis.  ](file:///C:/Users/jojohnso/AppData/Local/Temp/msohtmlclip1/01/clip_image011.png) 

 

 

 

 

 

>[!NOTE]
>Enabling Azure Local AI preview will deploy the [multilingual-e5-small](https://huggingface.co/intfloat/multilingual-e5-small) model to your Azure Database for PostgreSQL Flexible Server instance. 
> Additional third-party open-source models may become available for installation on an ongoing basis. 
 

Once allow-listed, you can install the extension by connecting to your target database and running the [CREATE EXTENSION](https://www.postgresql.org/docs/current/static/sql-createextension.html) command. You need to repeat the command separately for every database you want the extension to be available in.

 

List extensions allow listed from Azure Portal - Server Parameters blade

SQLCopy

SHOW azure.extensions;

 

SQLCopy

CREATE EXTENSION azure_local_ai;

 

Installing the extension azure_local_ai creates the following schema:

·         azure_local_ai: principal schema in which the extension creates tables, functions and any other SQL-related object it requires to implement and expose its functionality. [[NA31]](#_msocom_31) 

 

>[!IMPORTANT]
>You want to enable the __[pgvector extension](/azure/postgresql/flexible-server/how-to-use-pgvector),__ as it is required to store vectors with azure_local_ai.

 

 

 

Configure the azure_local_ai extension

Configuring the extensions requires the user to be a member of the “admin” role.

 

The following functions to configure the azure_local_ai extension settings require azure_pg_admin or azure_local_ai_setting_manager role membership:

·         azure_local_ai.set_setting

·         azure_local_ai.get_setting

azure_local_ai.set_setting

Used to set configuration options.

azure_ai.set_setting(key TEXT, value TEXT)[[IAP32]](#_msocom_32) 

 

azure_local_ai.get_setting

Used to obtain current values of configuration options.

azure_local_ai.get_setting(key TEXT)[[IAP33]](#_msocom_33) 

Permissions

Currently, only users with the azure_pg_admin role in PostgreSQL can make changes to the settings within azure_local_ai.  *Note this will be updated to use azure_ai_settings_manager role.

Next steps

[Generate vector embeddings with azure_local_ai on Azure Database for PostgreSQL Flexible Server (Preview)](Generate%20vector%20embeddings%20with%20azure_local_ai%20on%20Azure%20Database%20for%20PostgreSQL%20Flexible%20Server%20(Preview))

__[Learn more about vector similarity search using pgvector](/azure/postgresql/flexible-server/how-to-use-pgvector)__

Feedback

Coming soon: Throughout 2024 we will be phasing out GitHub Issues as the feedback mechanism for content and replacing it with a new feedback system. For more information see: __[https://aka.ms/ContentUserFeedback](https://aka.ms/ContentUserFeedback)__.

---
 [[NA1]](#_msoanchor_1)“to use”

[@Joshua Johnson](mailto:jojohnso@microsoft.com)  what does 'registered' mean? [[N(2]](#_msoanchor_2)

Before they can be used, models must be loaded on the server and registered with the ONNX runtime service.  [[JJ3]](#_msoanchor_3)

 

___registering a Model___

pglocalml.model_register

Inputs:

model-name: text,

model-version: text,

model-path: text,

tokenizer-path: text (NULL by default)

Output:

model-id: int64

Flow:

It sends a call to ORT Service to fetch model’s metadata,

It  inserts the model into “pglocalml.model” table with the metadata.

is microsoft registering the model or is this only done when customer enables/ does it? [[N(4]](#_msoanchor_4)

 [[NA5]](#_msoanchor_5)“pre-trained”

 [[NA6]](#_msoanchor_6)I would remove the parenthesis and leave the plural form as “models”, despite the fact that currently this will be limited to a single model, as far as I understood.

[@Joshua Johnson](mailto:jojohnso@microsoft.com) does this get deployed into the customers specific tenant?  something isn't reading correctly here in use of 'server' [[N(7]](#_msoanchor_7)

Yes. This is deployed in a container within the server hosting the PaaS instance of Azure DB for PostgreSQL in their tenant/subscription.  [[JJ8]](#_msoanchor_8)

 [[JJ9]](#_msoanchor_9)Also, there is no list of models to select from. This is a single model only that will be deployed to the sidecar container when the feature is enabled.

 [[NA10]](#_msoanchor_10)“With these models you can create embeddings that are used to improve Retrieval Augmented Generation(RAG) to build rich generative AI applications”

This is a bit strange. RAG is a pattern or an app. I don't think it exists on it's own. If we follow this logic then I would rephrase as: [[ML11]](#_msoanchor_11)

These models can be used to create embeddings in Retrieval Augmented Generation (RAG) apps.

Or something similar. [[ML12]](#_msoanchor_12)

 [[NA13]](#_msoanchor_13)I would remove this adjective from here.

+1 [[ML14]](#_msoanchor_14)

This section and next paragraph are duplicates. Suggest consolidating them into one. [[ML15]](#_msoanchor_15)

 [[NA16]](#_msoanchor_16)How about the big benefit that getting rid of throttling imposed by Azure OpenAI represents?

[@Joshua Johnson](mailto:jojohnso@microsoft.com) just wanted to flag for you that I have revised the proposed disclaimer text to be a bit more generic / not call out MSR directly.   [[N(17]](#_msoanchor_17)

Wasn't it decided to only allow local_ai to run on memory optimized instances ?    I lost track of where the conversation around managing ORT memory use along side PG ended (av oiding linux OOM kills). [[AP18]](#_msoanchor_18)

 

[@Pino de Candia](mailto:pinod@microsoft.com) what was the conclusion to dealing with the memory problem?

[@Joshua Johnson](mailto:jojohnso@microsoft.com) not sure where we flag that this is a preview feature.  can we suggest that more models will be coming/ made avaialble through this extension [[N(19]](#_msoanchor_19)

 [[JJ20]](#_msoanchor_20)We could state that there’s potential to add more models in the future without making any promises.

This sounds defensive. I would rephrase in a more direct language: [[ML21]](#_msoanchor_21)

"Hosting language models in database requires large memory footprint, to support this requirement this feature, at this time, is only supported on memory optimized Azure SKU."

 [[NA22]](#_msoanchor_22)Might be good to mention that this is a PG command, which must be executed once connected to your instance. This might seem too obvious to mention this for us, but it would be appreciated by many users of our service.

 [[NA23]](#_msoanchor_23)That menu that shows up on the left-hand size of the portal, full of resource-specific options, is officially known as “resource menu”.

 [[NA24]](#_msoanchor_24)I would expand this to: “search for azure.extensions and, from the list of values, make sure that the AZURE_LOCAL_AI extension is marked.”

 [[JJ25]](#_msoanchor_25)I’ve been trying to get it into a Canary build to update the screenshots. Even with the latest deployment it’s still not showing up in Central US EUAP. I’m hoping that it will be available before the 5/13 doc freeze to replace these place holders.

 [[NA26]](#_msoanchor_26)I would split this into two parts. First part being “Click “Save” to apply the changes” (with the already existing screenshot below). Part two being “Wait for the Azure Local AI deployment to complete.” (and I would add an additional screenshot showing that bit).

[@Joshua Johnson](mailto:jojohnso@microsoft.com) can you sahre the link to the 'terms' that apply to this model?  where is the mit license terms listed? [[N(27]](#_msoanchor_27)

It's listed at the top of the page already linked. [https://huggingface.co/intfloat/multilingual-e5-small](https://huggingface.co/intfloat/multilingual-e5-small) [[JJ28]](#_msoanchor_28)

 

[@Joshua Johnson](mailto:jojohnso@microsoft.com)  can't the customer see this name when they install this local AI extension?  we need to make sure there is some way for users to find the 'terms' (ie link to the huggingface docs page with license terms associated iwth this model).    ideally we would set up this page to suggest more models will be made available [[N(29]](#_msoanchor_29)

The link will be here, in our docs, linked from the portal page. If we need additional links, we'd need to change the portal blade for Server Parameters - similar to the popup disclaimer discussion. [[JJ30]](#_msoanchor_30)

 [[NA31]](#_msoanchor_31)“principal schema in which the extension creates tables, functions and any other SQL-related object it requires to implement and expose its functionality”

 [[IAP32]](#_msoanchor_32)Don’t you want to document the “timeout_ms” parameter of this function?

 [[IAP33]](#_msoanchor_33)Don’t you want to document the “timeout_ms” parameter of this function?
