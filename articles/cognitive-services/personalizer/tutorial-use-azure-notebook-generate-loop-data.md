---
title: "Tutorial: Azure Notebook - Personalizer"
titleSuffix: Azure Cognitive Services
description: This tutorial simulates a Personalizer loop _system in an Azure Notebook, which suggests which type of coffee a customer should order. The users and their preferences are stored in a user dataset. Information about the coffee is also available and stored in a coffee dataset.
services: cognitive-services
author: diberry
manager: nitinme
ms.service: cognitive-services
ms.subservice: personalizer
ms.topic: tutorial
ms.date: 09/23/2019
ms.author: diberry
#Customer intent:  As a python developer, I want use Personalizer in an Azure Notebook so that I can run each cell, view the output, then finally see the overall prediction success of Personalizer over a duration of many requests.
---

# Tutorial: Use Personalizer in Azure Notebook

This tutorial simulates a Personalizer loop _system in an Azure Notebook, which suggests which type of coffee a customer should order. The users and their preferences are stored in a user dataset. Information about the coffee is also available and stored in a coffee dataset.

A summary of the user information is:

|Customers|Times of Day|Types of weather|
|--|--|--|
|Alice<br>Bob<br>Cathy<br>Dave|Morning<br>afternoon<br>evening|Sunny<br>rainy<br>snowy| 

To help Personalizer make the correct coffee selection for each person, the _system_ also knows details about the coffee.

|Types of temperature|Places of origin|Types of roast|Organic|
|--|--|--|--|
|Hot<br>cold|Kenya<br>Brazil<br>Ethiopia|Dark<br>light|Organic<br>not organic|

The **purpose** of the Personalizer loop is to find the best match between the users and the coffee as much of the time as possible. 

The code for this tutorial is available in the [Personalizer Samples GitHub repository](https://github.com/Azure-Samples/cognitive-services-personalizer-samples/blob/master/samples/azurenotebook/Personalization.ipynb).

## How the simulation works

 At the beginning of the running system, the suggestions from Personalizer are only successful between 20% to 30% (indicated by the reward score of 1). After the model update frequency period, the system improves to an accuracy rate of between 70%-80% for the next set of suggestions.  

|#|Groups of rank and reward calls|
|--|--|
|First 2,000 requests|20%-30% success |
|Second 2,000 requests|70%-80% success |

## Rank and reward calls

For each of the few thousand calls to the Personalizer service, the Azure Notebook sends the **Rank** request to the REST API:

* A unique ID for the Rank/Request event
* Context - A random choice of the user, weather, and time of day - simulating a user on a website or mobile device
* Features - _All_ the coffee data - from which Personalizer makes a suggestion

The system receives the rank of the coffee choices, then compares that prediction with the user's known choice for the same time of day and weather. If the known choice is the same as the predicted choice, the **Reward** of 1 is sent back to Personalizer. Otherwise the reward is 0. 

> [!Note]
> This is a simulation so the algorithm for the reward is simple. In a real-world scenario, the algorithm should use business logic, possibly with weights for various aspects of the customer's experience, to determine the reward score. 


## Prerequisites

* An [Azure Notebook](https://notebooks.azure.com/) account. 
* Upload all the files for [this sample](https://github.com/Azure-Samples/cognitive-services-personalizer-samples/tree/master/samples/azurenotebook) into an Azure Notebook project. 
* A [Personalizer resource](https://ms.portal.azure.com/#create/Microsoft.CognitiveServicesPersonalizer) with the update model frequency set to 5 minutes. 

File descriptions:

* [Personalizer.ipynb](https://github.com/Azure-Samples/cognitive-services-personalizer-samples/blob/master/samples/azurenotebook/Personalization.ipynb)
* [User dataset](https://github.com/Azure-Samples/cognitive-services-personalizer-samples/blob/master/samples/azurenotebook/users.json) is stored in a JSON object.
* [Coffee dataset](https://github.com/Azure-Samples/cognitive-services-personalizer-samples/blob/master/samples/azurenotebook/coffee.json) is stored in a JSON object. 
* [Example Request JSON](https://github.com/Azure-Samples/cognitive-services-personalizer-samples/blob/master/samples/azurenotebook/example-rankrequest.json) is the expected format for a POST request to the Rank API.

## Set up the Azure Notebook

1. Change the Kernel to `Python 3.6`. 
1. Open the `Personalizer.ipynb` file.

## Run Notebook cells

Run each executable cell and wait for it to return. You know it is done when the brackets next to the cell display a number instead of a `*`. The following sections explain what each cell does programmatically and what to expect for the output. 

### Include the python modules

Include the required python modules. The cell has no output.

```python
import json
import matplotlib.pyplot as plt
import random 
import requests
import time
import uuid
```

### Set Personalizer resource key and name

Change the value of `<your-resource-name>` to your Personalizer resource's name. Change the value of `resource_key` to own of your Personalizer keys on the **Keys** page from the Azure portal. The cell has no output.

```python
# Replace 'personalization_base_url' and 'resource_key' with your valid endpoint values.
personalization_base_url = "https://<your-resource-name>.cognitiveservices.azure.com"
resource_key = "123456789"
```

### Get the last model update date and time

When the function, `get_last_updated`, is called, the function prints out the last modified date and time that the model was updated. The cell has no output. The function does output the last model training date when called.

```python
# model's last modified date
modelLastModified = ""
```

```python
def get_last_updated(currentModifiedDate):
    
    print('-----checking model')
    
    # get model properties
    response = requests.get(personalization_model_properties_url, headers = headers, params = None)
    
    # get lastModifiedTime
    lastModifiedTime = json.dumps(response.json()["lastModifiedTime"])
    
    if (currentModifiedDate != lastModifiedTime):
        currentModifiedDate = lastModifiedTime
        print(f'-----model updated: {lastModifiedTime}')
```


### Construct URLs for REST calls and read JSON data files

This cell 

* builds the URLs used in REST calls* 
* sets the security header using your Personalizer resource key 
* sets the random seed for the Rank event ID
* reads in the JSON data files
* calls `get_last_updated` method

The cell has output from the call to `get_last_updated` function, which is the date of the last model training update. The date looks like: 

```python
"0001-01-01T00:00:00+00:00"
```

```python
# build URLs
personalization_rank_url = personalization_base_url + "/personalizer/v1.0/rank"
personalization_reward_url = personalization_base_url + "/personalizer/v1.0/events/" #add "{eventId}/reward"
headers = {'Ocp-Apim-Subscription-Key' : resource_key, 'Content-Type': 'application/json'}

# context
users = "users.json"

# action features
coffee = "coffee.json"

# empty JSON for Rank request
requestpath = "example-rankrequest.json"

# initialize random
random.seed(time.time())

userpref = None 
rankactionsjsonobj = None 
actionfeaturesobj = None

with open(users) as handle:
    userpref = json.loads(handle.read())

with open(coffee) as handle:
    actionfeaturesobj = json.loads(handle.read())
    
with open(requestpath) as handle:
    rankactionsjsonobj = json.loads(handle.read())  
    
get_last_updated(modelLastModified)
```





### Generate a unique event ID

This function generates a unique ID for each rank call. The ID is used again with the reward call. The cell has no output. The function does output the unique ID when called.

```python
def add_event_id(rankjsonobj):
    eventid = uuid.uuid4().hex
    rankjsonobj["eventId"] = eventid
    return eventid
```



### Get random user, weather, and time of day

This function selects a unique user, weather, and time of day, then adds those items to the JSON object to send to the Rank request.

The list of 4 users and their preferences - only some preferences are shown for brevity: 

```json
{
  "Alice": {
    "Sunny": {
      "Morning": "Cold brew",
      "Afternoon": "Iced mocha",
      "Evening": "Cold brew"
    }...
  },
  "Bob": {
    "Sunny": {
      "Morning": "Cappucino",
      "Afternoon": "Iced mocha",
      "Evening": "Cold brew"
    }...
  },
  "Cathy": {
    "Sunny": {
      "Morning": "Latte",
      "Afternoon": "Cold brew",
      "Evening": "Cappucino"
    }...
  },
  "Dave": {
    "Sunny": {
      "Morning": "Iced mocha",
      "Afternoon": "Iced mocha",
      "Evening": "Iced mocha"
    }...
  }
}
```

```python
def add_random_user_and_contextfeatures(namesoption, weatheropt, timeofdayopt, rankjsonobj):   
    name = namesopt[random.randint(0,3)]
    weather = weatheropt[random.randint(0,2)]
    timeofday = timeofdayopt[random.randint(0,2)]
    rankjsonobj['contextFeatures'] = [{'timeofday': timeofday, 'weather': weather, 'name': name}]
    return [name, weather, timeofday]
```


### Add all coffee data

This function adds the entire list of coffee to the JSON object to send to the Rank request. 

The cell has no output. The function does change the `rankjsonobj` when called.


The example of a single coffee's features is: 

```json
{
    "id": "Cappucino",
    "features": [
    {
        "type": "hot",
        "origin": "kenya",
        "organic": "yes",
        "roast": "dark"
        
    }
}
```

```python
def add_action_features(rankjsonobj):
    rankjsonobj["actions"] = actionfeaturesobj
```




### Compare Rank API's prediction with known user preference

This function compares the user's preference for coffee, based on weather and time of day, with the Personalizer's suggestion for the user for those filters. If the suggestion matches, a score of 1 is returned, otherwise the score is 0. The cell has no output. The function does output the score when called.

```python
def get_reward_from_simulated_data(name, weather, timeofday, prediction):
    if(userpref[name][weather][timeofday] == str(prediction)):
        return 1 
    return 0
``` 

### Loop through calls to Rank and Reward

The next cell is the _main_ work of the Notebook, getting a random user, getting the coffee list, sending both to the Rank API. Comparing the prediction with the user's known preferences, then sending the reward back to the Personalizer service. 

The loop runs for `num_requests` times, currently set to 4000. This number is meant to indicate that Personalizer needs a few thousand requests before its first retraining, regardless of the duration of the update model frequency. If the frequency was an five minutes or an hour, the service still needs a few thousand calls to Rank and Reward to create an effective learning policy. 

An example of the JSON sent to the Rank API follows. The list of coffee is not complete, for brevity. You can see the entire JSON for coffee in `coffee.json`.


```json
{ 
   'contextFeatures':[ 
      { 
         'timeofday':'Evening',
         'weather':'Snowy',
         'name':'Alice'
      }
   ],
   'actions':[ 
      { 
         'id':'Cappucino',
         'features':[ 
            { 
               'type':'hot',
               'origin':'kenya',
               'organic':'yes',
               'roast':'dark'
            }
         ]
      }
        ...rest of coffee list
   ],
   'excludedActions':[ 

   ],
   'eventId':'b5c4ef3e8c434f358382b04be8963f62',
   'deferActivation':False
}
```

Then displays the JSON sent to the Rank API:

```console
To:  {'contextFeatures': [{'timeofday': 'Morning', 'weather': 'Sunny', 'name': 'Bob'}], 'actions': [{'id': 'Cappucino', 'features': [{'type': 'hot', 'origin': 'kenya', 'organic': 'yes', 'roast': 'dark'}]}, {'id': 'Cold brew', 'features': [{'type': 'cold', 'origin': 'brazil', 'organic': 'yes', 'roast': 'light'}]}, {'id': 'Iced mocha', 'features': [{'type': 'cold', 'origin': 'ethiopia', 'organic': 'no', 'roast': 'light'}]}, {'id': 'Latte', 'features': [{'type': 'hot', 'origin': 'brazil', 'organic': 'no', 'roast': 'dark'}]}], 'excludedActions': [], 'eventId': '5001bcfe3bb542a1a238e6d18d57f2d2', 'deferActivation': False}
```

Then displays the results from the Rank API:

```
From:  {'ranking': [{'id': 'Latte', 'probability': 0.85}, {'id': 'Iced mocha', 'probability': 0.05}, {'id': 'Cappucino', 'probability': 0.05}, {'id': 'Cold brew', 'probability': 0.05}], 'eventId': '5001bcfe3bb542a1a238e6d18d57f2d2', 'rewardActionId': 'Latte'}
```

Finally, each loop shows the random selection of user, weather, time of day, and determined reward.

```console
1 Alice Rainy Morning Latte 1
```

```python
# default JSON to send to Rank API
rankjsonobj = rankactionsjsonobj

# loop max and iterator
i = 1
num_requests = 4000

# check last mod date N% of time - currently 10%
lastModCheck = int(num_requests * .10)

# default reward value - assumes failed prediction
reward = 0

# collect results to aggregate in graph
recommendations = 0
rewards = []
count = []
    
# default list of user, weather, time of day
namesopt = ['Alice', 'Bob', 'Cathy', 'Dave']
weatheropt = ['Sunny', 'Rainy', 'Snowy']
timeofdayopt = ['Morning', 'Afternoon', 'Evening']

while(i <= num_requests):
      
    # create unique id to associate with an event
    eventid = add_event_id(rankjsonobj)
    
    # generate a random sample
    [name, weather, timeofday] = add_random_user_and_contextfeatures(namesopt, weatheropt, timeofdayopt, rankjsonobj)
    
    # add action features to rank
    add_action_features(rankjsonobj) 
        
    # show JSON to send to Rank
    print('To: ', rankjsonobj)    
        
    # choose an action - get prediction from Personalizer
    response = requests.post(personalization_rank_url, headers = headers, params = None, json = rankjsonobj)
    
    # show Rank prediction 
    print ('From: ',response.json())    
        
    # compare personalization service recommendation with the simulated data to generate a reward value
    prediction = json.dumps(response.json()["rewardActionId"]).replace('"','')
    reward = get_reward_from_simulated_data(name, weather, timeofday, prediction)
    
    # show result for iteration
    print(f'   {i} {name} {weather} {timeofday} {prediction} {reward}')
    
    # send the reward to the service 
    response = requests.post(personalization_reward_url + eventid + "/reward", headers = headers, params= None, json = { "value" : reward })
    
    # for every N rank requests, compute total correct recommendations 
    recommendations = recommendations + reward
    
    # every N iteration, get last updated model date and time
    if(i % lastModCheck == 0):
        
        print("**** 10% of loop found")
        
        get_last_updated(modelLastModified) 

        rewards.append(recommendations)
        count.append(i)
        recommendations = 0
               
    # aggregate so chart is easier to read
    if(i % 10 == 0):
        rewards.append(recommendations)
        count.append(i)
        recommendations = 0
        
    i = i + 1
```


### Chart results to see improvement with Personalizer

Create a chart from the `count` and `rewards`.

```python
plt.plot(count, rewards)
plt.xlabel("Batch of rank events")
plt.ylabel("Correct recommendations per batch")
plt.show()
```

The chart should look like the image below. 

![Chart of results from Azure Notebook](./media/tutorial-azure-notebook/azure-notebook-chart-results.png)

This chart shows a low performance period (between 20-30% prediction reward of 1) then after a few thousand requests, a significant performance increase (to around 80% prediction reward of 1) that continues for the duration of the test.

The 80% success indicates a near perfect prediction, which isn't realistic for all Personalizer loops. The other 20% of the time, the loop is exploring by sending back results to the Rank call that are not determined by the currently trained model. 

## Clean up resources

If you do not intend to continue the tutorial series, clean up the following resources:

* Delete your Azure Notebook project. 
* Delete your Personalizer resource. 

## Next steps

The [Jupyter notebook and data files](https://github.com/Azure-Samples/cognitive-services-personalizer-samples/tree/master/samples/azurenotebook) used in this sample is available on the GitHub repo for Personalizer. 

In the next tutorial, use the data for offline evaluation, create, and apply a new learning policy. Then run the simulation again to see the improvements. 

