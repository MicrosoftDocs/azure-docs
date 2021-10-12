## Region Limits
- Conversational Language Understanding is only available in 2 regions: **West US 2** and **West Europe**. 
    - Orchestration workflow projects will enable **Conversation projects**, **QnA Maker** and **LUIS** connections in West Europe.
    - Orchestration workflow projects will enable **Conversation projects** and **QnA Maker** connections only in West US 2. There is no authoring West US 2 region for LUIS. 
- The only available SKU to access CLU is the **Text Analytics** resource with the **S** sku.

## Data Limits

The following limits are observed for the Conversational Language Understanding service.

|**Item**|**Limit**|
--- | --- 
|Utterances|15,000 per project*|
|Intents|500 per project|
|Entities|100 per project|
|Utterance length|500 characters|
|Intent and entity name length|50 characters|
|Models|10 per project|
|Projects|500 per resource|
|Synonyms|20,000 per list component|

\**Only includes utterances added by the user. Data pulled in for orchestration workflow projects do not count towards the total*


## Throughput Limits

|**Item**|**Limit**|
--- | --- 
|Authoring Calls|_60 requests per minute_|
|Prediction Calls|_60 requests per minute_|

## Quota Limits

|**Item**|**Limit**|
--- | --- 
|Authoring Calls|_Unlimited_|
|Prediction Calls|_100,000 per month_|
