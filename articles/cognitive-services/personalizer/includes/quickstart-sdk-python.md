---
title: include file
description: include file
services: cognitive-services
manager: nitinme
ms.author: jacodel
author: jcodella
ms.service: cognitive-services
ms.subservice: personalizer
ms.topic: include
ms.custom: cog-serv-seo-aug-2020
ms.date: 9/1/2022
---

To start, you'll need to install the Personalizer client library for Python to:
* Authenticate the quickstart example client with your Personalizer resource in Azure.
* Send context and action features to the Rank API, which will return the best action from Personalizer.
* Send a reward score to the Reward API to train the Personalizer model.

[Reference documentation](/python/api/azure-cognitiveservices-personalizer/azure.cognitiveservices.personalizer) | [Library source code](https://github.com/Azure/azure-sdk-for-python/tree/master/sdk/cognitiveservices/azure-cognitiveservices-personalizer) | [Package (pypi)](https://pypi.org/project/azure-cognitiveservices-personalizer/) | [Quickstart code sample](https://github.com/Azure-Samples/cognitive-services-quickstart-code/tree/master/python/Personalizer)

## Prerequisites

* Azure subscription - [Create one for free](https://azure.microsoft.com/free/cognitive-services)
* [Python 3.x](https://www.python.org/)
* Once your Azure subscription is set up, <a href="https://portal.azure.com/#create/Microsoft.CognitiveServicesPersonalizer"  title="Create a Personalizer resource"  target="_blank">create a Personalizer resource </a> in the Azure portal and obtain your key and endpoint. After it deploys, click **Go to resource**.
    * You'll need the key and endpoint from the created resource to connect your application to the Personalizer API, which you'll paste into the quick-start code below.
    * You can use the free pricing tier (`F0`) to try the service, then upgrade to a paid tier for production at a later time.

## Setting Up

[!INCLUDE [Change model frequency](change-model-frequency.md)]

[!INCLUDE [Change reward wait time](change-reward-wait-time.md)]

### Install the client library

After installing Python, install the Personalizer client library with [pip](https://pypi.org/project/pip/):

```console
pip install azure-cognitiveservices-personalizer
```

### Create a new Python application

Create a new Python application file named "personalizer_quickstart.py". This application will handle both the example scenario logic and calls the Personalizer APIs. 

In the file, create variables for your resource's endpoint and subscription key.

[!INCLUDE [Personalizer find resource info](find-azure-resource-info.md)]

> [!IMPORTANT]
> Remember to remove the key from your code when you're done, and never post it publicly. For production, use a secure method to store and access your credentials like [Azure Key Vault](../../../key-vault/general/overview.md). For more information, see the Cognitive Services [security](../../cognitive-services-security.md).

```python
from azure.cognitiveservices.personalizer import PersonalizerClient
from azure.cognitiveservices.personalizer.models import RankableAction, RewardRequest, RankRequest
from msrest.authentication import CognitiveServicesCredentials

import datetime, json, os, time, uuid, random

key = "<paste-your-personalizer-key-here>"
endpoint = "<paste-your-personalizer-endpoint-here>"
```

## Object model

The client is a [PersonalizerClient](/python/api/azure-cognitiveservices-personalizer/azure.cognitiveservices.personalizer.personalizer_client.personalizerclient) object that authenticates to Azure using Microsoft.Rest.ServiceClientCredentials containing your key.

To request the best action from Personalizer, create a [RankRequest](/python/api/azure-cognitiveservices-personalizer/azure.cognitiveservices.personalizer.models.rankrequest) containing the set of [RankableActions](/python/api/azure-cognitiveservices-personalizer/azure.cognitiveservices.personalizer.models.rankableaction) that Personalizer will choose from, and a set of context features. The RankRequest will be passed to the client.Rank method, which returns a RankResponse containing an event ID.

To send a reward score to Personalizer, use the [Reward](/python/api/azure-cognitiveservices-personalizer/azure.cognitiveservices.personalizer.operations.events_operations.eventsoperations) method in the EventOperations class and include the event ID corresponding to the Rank call that returned the best action, and the reward score.

Later in this quick-start, we'll define an example reward score. However, the reward is one of the most important considerations when designing your Personalizer architecture. In a production system, determining what factors affect the [reward score](../concept-rewards.md) can be challenging, and you may decide to change your reward score as your scenario or business needs change.

## Code examples

These code snippets demonstrate how to use the Personalizer client library for Python to:

* [Authenticate the client](#authenticate-the-client)
* [Define actions and their features](#define-actions-and-their-features)
* [Define context features](#define-users-and-their-context-features)
* [Define a reward score](#define-a-reward-score-based-on-user-behavior)
* [Call the Rank and Reward APIs](#run-a-rank-and-reward-cycle)


## Authenticate the client

Instantiate the `PersonalizerClient` with the `key` and `endpoint` you obtained from your Personalizer resource.

```python
# Instantiate a Personalizer client
client = PersonalizerClient(endpoint, CognitiveServicesCredentials(key))
```

## Define actions and their features

Actions represent the choices from which Personalizer decides the best to use given the current context. The following code snippet creates a dictionary of four actions and the features that describe them. The function `get_actions()` assembles a list of `RankableAction` objects used in calling the Rank API for inference later in the quick-start.

Recall for our grocery website scenario, actions are the possible food items to be displayed in the "Featured Product" section on the website. The features here are simple examples that may be relevant in such a scenario.

```python
actions_and_features = {
    'pasta': {
        'brand_info': {
            'company':'pasta_inc'
        }, 
        'attributes': {
            'qty':1, 'cuisine':'italian',
            'price':12
        },
        'dietary_attributes': {
            'vegan': False,
            'low_carb': False,
            'high_protein': False,
            'vegetarian': False,
            'low_fat': True,
            'low_sodium': True
        }
    },
    'bbq': {
        'brand_info' : {
            'company': 'ambisco'
        },
        'attributes': {
            'qty': 2,
            'category': 'bbq',
            'price': 20
        }, 
        'dietary_attributes': {
            'vegan': False,
            'low_carb': True,
            'high_protein': True,
            'vegetarian': False,
            'low_fat': False,
            'low_sodium': False
        }
    },
    'bao': {
        'brand_info': {
            'company': 'bao_and_co'
        },
        'attributes': {
            'qty': 4,
            'category': 'chinese',
            'price': 8
        }, 
        'dietary_attributes': {
            'vegan': False,
            'low_carb': True,
            'high_protein': True,
            'vegetarian': False,
            'low_fat': True,
            'low_sodium': False
        }
    },
    'hummus': {
        'brand_info' : { 
            'company': 'garbanzo_inc'
        },
        'attributes' : {
            'qty': 1,
            'category': 'breakfast',
            'price': 5
        }, 
        'dietary_attributes': {
            'vegan': True, 
            'low_carb': False,
            'high_protein': True,
            'vegetarian': True,
            'low_fat': False, 
            'low_sodium': False
        }
    },
    'veg_platter': {
        'brand_info': {
            'company': 'farm_fresh'
        }, 
        'attributes': {
            'qty': 1,
            'category': 'produce', 
            'price': 7
        },
        'dietary_attributes': {
            'vegan': True,
            'low_carb': True,
            'high_protein': False,
            'vegetarian': True,
            'low_fat': True,
            'low_sodium': True
        }
    }
}

def get_actions():
    res = []
    for action_id, feat in actions_and_features.items():
        action = RankableAction(id=action_id, features=[feat])
        res.append(action)
    return res
```

## Define users and their context features

Context can represent the current state of your application, system, environment, or user. The following code creates a dictionary with user preferences, and the `get_context()` function assembles the features into a list for one particular user, which will be used later when calling the Rank API. In our grocery website scenario, the context consists of dietary preferences, a historical average of the order price. Let's assume our users are always on the move and include a location, time of day, and application type, which we choose randomly to simulate changing contexts every time `get_context()` is called. Finally, `get_random_users()` creates a random set of 5 user names from the user profiles, which will be used to simulate Rank/Reward calls later on.

```python
user_profiles = {
    'Bill': {
        'dietary_preferences': 'low_carb', 
        'avg_order_price': '0-20',
        'browser_type': 'edge'
    },
    'Satya': {
        'dietary_preferences': 'low_sodium',
        'avg_order_price': '201+',
        'browser_type': 'safari'
    },
    'Amy': {
        'dietary_preferences': {
            'vegan', 'vegetarian'
        },
        'avg_order_price': '21-50',
        'browser_type': 'edge'},
    }

def get_context(user):
    location_context = {'location': random.choice(['west', 'east', 'midwest'])}
    time_of_day = {'time_of_day': random.choice(['morning', 'afternoon', 'evening'])}
    app_type = {'application_type': random.choice(['edge', 'safari', 'edge_mobile', 'mobile_app'])}
    res = [user_profiles[user], location_context, time_of_day, app_type]
    return res

def get_random_users(k = 5):
    return random.choices(list(user_profiles.keys()), k=k)
```

The context features in this quick-start are simplistic, however, in a real production system, designing your [features](../concepts-features.md) and [evaluating their effectiveness](../concept-feature-evaluation.md) can be non-trivial. You can refer to the aforementioned documentation for guidance.


## Define a reward score based on user behavior

The reward score can be considered an indication how "good" the personalized action is. In a real production system, the reward score should be designed to align with your business objectives and KPIs. For example, your application code can be instrumented to detect a desired user behavior (for example, a purchase) that aligns with your business objective (for example, increased revenue).

In our grocery website scenario, we have three users: Bill, Satya, and Amy each with their own preferences. If a user purchases the product chosen by Personalizer, a reward score of 1.0 will be sent to the Reward API. Otherwise, the default reward of 0.0 will be used. In a real production system, determining how to design the [reward](../concept-rewards.md) may require some experimentation.

In the code below, the users' preferences and responses to the actions is hard-coded as a series of conditional statements, and explanatory text is included in the code for demonstrative purposes. In a real scenario, Personalizer will learn user preferences from the data sent in Rank and Reward API calls. You won't define these explicitly as in the example code.

The hard-coded preferences and reward can be succinctly described as:

* Bill will purchase any product less than $10 as long as he isn't in the midwest.
* When Bill is in the midwest, he'll purchase any product as long as it's low in carbs.
* Satya will purchase any product that's low in sodium.
* Amy will purchase any product that's either vegan or vegetarian.

```python
def get_reward_score(user, actionid, context):
    reward_score = 0.0
    action = actions_and_features[actionid]
    
    if user == 'Bill':
        if action['attributes']['price'] < 10 and (context[1]['location'] !=  "midwest"):
            reward_score = 1.0
            print("Bill likes to be economical when he's not in the midwest visiting his friend Warren. He bought", actionid, "because it was below a price of $10.")
        elif (action['dietary_attributes']['low_carb'] == True) and (context[1]['location'] ==  "midwest"):
            reward_score = 1.0
            print("Bill is visiting his friend Warren in the midwest. There he's willing to spend more on food as long as it's low carb, so Bill bought" + actionid + ".")
            
        elif (action['attributes']['price'] >= 10) and (context[1]['location'] != "midwest"):
            print("Bill didn't buy", actionid, "because the price was too high when not visting his friend Warren in the midwest.")
            
        elif (action['dietary_attributes']['low_carb'] == False) and (context[1]['location'] ==  "midwest"):
            print("Bill didn't buy", actionid, "because it's not low-carb, and he's in the midwest visitng his friend Warren.")
             
    elif user == 'Satya':
        if action['dietary_attributes']['low_sodium'] == True:
            reward_score = 1.0
            print("Satya is health conscious, so he bought", actionid,"since it's low in sodium.")
        else:
            print("Satya did not buy", actionid, "because it's not low sodium.")   
            
    elif user == 'Amy':
        if (action['dietary_attributes']['vegan'] == True) or (action['dietary_attributes']['vegetarian'] == True):
            reward_score = 1.0
            print("Amy likes to eat plant-based foods, so she bought", actionid, "because it's vegan or vegetarian friendly.")       
        else:
            print("Amy did not buy", actionid, "because it's not vegan or vegetarian.")
                
    return reward_score
```

## Run Rank and Reward calls for each user

A Personalizer event cycle consists of [Rank](#request-the-best-action) and [Reward](#send-a-reward) API calls. In our grocery website scenario, each Rank call is made to determine which product should be displayed in the "Featured Product" section. Then the Reward call tells Personalizer whether or not the featured product was purchased by the user.


### Request the best action

In a Rank call, you need to provide at least two arguments: a list of `RankableActions` (_actions and their features_), and a list of (_context_) features. The response will include the `reward_action_id`, which is the ID of the action Personalizer has determined is best for the given context. The response also includes the `event_id`, which is needed in the Reward API so Personalize knows how to link the data from the Reward and Rank calls. For more information, refer to the [Rank API docs](/rest/api/personalizer/1.0/rank/rank).


### Send a reward

In a Reward call, you need to provide two arguments: the `event_id`, which links the Reward and Rank calls to the same unique event, and the `value` (reward score). Recall that the reward score is a signal that tells Personalizer if the decision made in the Rank call was a good or not. A reward score is typically a number between 0.0 and 1.0. It's worth reiterating that determining how to design the [reward](../concept-rewards.md) can be non-trivial.


### Run a Rank and Reward cycle

The following code loops through five cycles of Rank and Reward calls for a randomly selected set of example users, then prints relevant information to the console at each step.

```python
def run_personalizer_cycle():
    actions = get_actions()
    user_list = get_random_users()
    for user in user_list:
        print("------------")
        print("User:", user, "\n")
        context = get_context(user)
        print("Context:", context, "\n")
        
        rank_request = RankRequest(actions=actions, context_features=context)
        response = client.rank(rank_request=rank_request)
        print("Rank API response:", response, "\n")
        
        eventid = response.event_id
        actionid = response.reward_action_id
        print("Personalizer recommended action", actionid, "and it was shown as the featured product.\n")
        
        reward_score = get_reward_score(user, actionid, context)
        client.events.reward(event_id=eventid, value=reward_score)     
        print("\nA reward score of", reward_score , "was sent to Personalizer.")
        print("------------\n")

continue_loop = True
while continue_loop:
    run_personalizer_cycle()
    
    br = input("Press Q to exit, or any other key to run another loop: ")
    if(br.lower()=='q'):
        continue_loop = False
```



## Run the program

Once all the above code is included in your Python file, you can run it from your application directory.

```console
python personalizer_quickstart.py
```

![The quickstart program asks a couple of questions to gather user preferences, known as features, then provides the top action.](../media/quickstart/quickstart-program-feedback-cycle-example.png)
