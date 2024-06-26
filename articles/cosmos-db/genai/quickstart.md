---
title: Build a RAG chatbot - Quickstart
description: Learn how to build a RAG chatbot in Python
author: TheovanKraay
ms.service: cosmos-db
ms.subservice: nosql
ms.topic: quickstart
ms.date: 06/26/2024
ms.author: thvankra
---

# Build a RAG chatbot - Quickstart

Azure Cosmos DB provides a fully managed NoSQL database for high-performance AI applications. It offers long-term memory and a streamlined API without infrastructure hassles. Azure Cosmos DB serves fresh, relevant query results with low latency at the scale of billions of vectors.

This guide shows you how to set up and use an Azure Cosmos DB vector database in minutes.

### 1. Sign Up for Azure Cosmos DB or Log In
Sign up for a free Azure Cosmos DB account or log in to your existing account.

You will need your Azure Cosmos DB connection string and key, which will be used in the next steps.

### 2. Get Your Connection Information
You need the connection string and key to make API calls to your Azure Cosmos DB instance. These can be found in the Azure portal.

### 3. Install Required Packages
Install the necessary Python packages to interact with Azure Cosmos DB and other services.

```bash
pip install json
pip install python-dotenv
pip install azure-cosmos
pip install openai
pip install gradio
```

### 4. Initialize Your Client Connection
Using your connection string and key, initialize your client connection to Azure Cosmos DB.

```python
# Import the required libraries
import time
import json
import uuid
from dotenv import dotenv_values
from openai import AzureOpenAI
import gradio as gr

# Cosmos DB imports
from azure.cosmos import CosmosClient

# Load configuration
env_name = "your_env_file.env"
config = dotenv_values(env_name)

cosmos_conn = config['cosmos_connection_string']
cosmos_key = config['cosmos_key']
cosmos_database = config['cosmos_database_name']
cosmos_collection = config['cosmos_collection_name']
cosmos_vector_property = config['cosmos_vector_property_name']
comsos_cache_db = config['cosmos_cache_database_name']
cosmos_cache = config['cosmos_cache_collection_name']

# Create the Azure Cosmos DB for NoSQL client
cosmos_client = CosmosClient(url=cosmos_conn, credential=cosmos_key)

openai_endpoint = config['openai_endpoint']
openai_key = config['openai_key']
openai_api_version = config['openai_api_version']
openai_embeddings_deployment = config['openai_embeddings_deployment']
openai_embeddings_dimensions = int(config['openai_embeddings_dimensions'])
openai_completions_deployment = config['openai_completions_deployment']

# Create the OpenAI client
openai_client = AzureOpenAI(azure_endpoint=openai_endpoint, api_key=openai_key, api_version=openai_api_version)
```

### 5. Set Up Databases and Containers
Ensure your Azure Cosmos DB account has the necessary databases and containers set up for vector search. 

```python
# Get databases and containers to work with
db = cosmos_client.get_database_client(cosmos_database)
movies_container = db.get_container_client(cosmos_collection)
cache_container = db.get_container_client(cosmos_cache)
```

### 6. Generate Embeddings from Azure OpenAI
Use Azure OpenAI to vectorize user input for vector search.

```python
def generate_embeddings(text):
    response = openai_client.embeddings.create(input=text, model=openai_embeddings_deployment)
    embeddings = response.model_dump()
    time.sleep(0.5)
    return embeddings['data'][0]['embedding']
```

### 7. Perform Vector Search
Define a function for vector search in Azure Cosmos DB.

```python
def vector_search(container, vectors, similarity_score=0.02, num_results=3):
    results = list(container.query_items(
        query='SELECT TOP @num_results c.title, c.overview, c.completion, VectorDistance(c.embeddings, @embedding, false, {"distanceFunction": "cosine"}) as SimilarityScore FROM c WHERE VectorDistance(c.embeddings, @embedding, true, {"distanceFunction": "cosine"}) > @similarity_score',
        parameters=[
            {"name": "@embedding", "value": vectors},
            {"name": "@num_results", "value": num_results},
            {"name": "@similarity_score", "value": similarity_score}
        ],
        enable_cross_partition_query=True)
    )
    
    formatted_results = [{'similarityScore': result['SimilarityScore'], 'document': result} for result in results]
    
    return formatted_results
```

### 8. Get Recent Chat History
Retrieve recent chat history for better conversational context.

```python
def get_chat_history(history_container, completions=3):
    query = f"SELECT TOP {completions} c.prompt, c.completion FROM c ORDER BY c._ts DESC"
    items = list(history_container.query_items(query=query, enable_cross_partition_query=True))
    return items
```

### 9. Chat Completion Function
Define the function to handle the chat completion process, including caching responses.

```python
def chat_completion(cache_container, movies_container, user_input):
    # Generate embeddings from the user input
    user_embeddings = generate_embeddings(user_input)
    
    # Query the chat history cache first to see if this question has been asked before
    cache_results = vector_search(container=cache_container, vectors=user_embeddings, similarity_score=0.99, num_results=1)
    
    if len(cache_results) > 0:
        return cache_results[0]['document']['completion']
    else:
        # Perform vector search on the movie collection
        search_results = vector_search(movies_container, user_embeddings)
        
        # Get chat history
        chat_history = get_chat_history(cache_container, completions=3)
        
        # Generate the completion
        completions_results = generate_completion(user_input, search_results, chat_history)
        
        # Cache the response
        cache_response(cache_container, user_input, user_embeddings, completions_results)
        
        # Return the generated LLM completion
        return completions_results['choices'][0]['message']['content']
```

### 10. Cache Generated Responses
Save the user prompts and generated completions to the cache for faster future responses.

```python
def cache_response(cache_container, user_prompt, prompt_vectors, response):
    chat_document = {
        'id': str(uuid.uuid4()),  # Generate a unique ID for the document
        'prompt': user_prompt,
        'completion': response['choices'][0]['message']['content'],
        'completionTokens': str(response['usage']['completion_tokens']),
        'promptTokens': str(response['usage']['prompt_tokens']),
        'totalTokens': str(response['usage']['total_tokens']),
        'model': response['model'],
        'embeddings': prompt_vectors
    }
    # Insert the chat document into the Cosmos DB container
    cache_container.create_item(body=chat_document)
```

### 11. Create a Simple UX in Gradio
Build a user interface using Gradio for interacting with the AI application.

```python
chat_history = []

with gr.Blocks() as demo:
    chatbot = gr.Chatbot()
    msg = gr.Textbox(label="Ask me anything about movies!")
    clear = gr.Button("Clear")
    
    def user(user_message, chat_history):
        start_time = time.time()
        
        # Get LLM completion
        response_payload = chat_completion(cache_container, movies_container, user_message)
        
        end_time = time.time()
        elapsed_time = round((end_time - start_time) * 1000, 2)
        
        response = response_payload
        
        # Append user message and response to chat history
        chat_history.append([user_message, response_payload + f"\n (Time: {elapsed_time}ms)"])
        
        return gr.update(value=""), chat_history
    
    msg.submit(user, [msg, chatbot], [msg, chatbot], queue=False)
    clear.click(lambda: None, None, chatbot, queue=False)

# Launch the Gradio interface
demo.launch(debug=True)

# Be sure to run this cell to close or restart the Gradio demo
demo.close()
```

## Next Steps
This quickstart guide is designed to help you set up and get running with Azure Cosmos DB NoSQL API for vector search applications in a few simple steps. If you have any further questions or need assistance, feel free to reach out or consult the Azure documentation. Explore the following use cases and sample applications to further utilize your Azure Cosmos DB setup:

- Retrieval Augmented Generation (RAG) with Azure OpenAI
- Semantic Search
- Implementing a Namespace for multitenancy
- Upserting your own vector embeddings


