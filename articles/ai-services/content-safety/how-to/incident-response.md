


# Use the incident response API

Incident response in content moderation scenarios is the process of identifying, analyzing, containing, eradicating, and recovering from cyber incidents that involve inappropriate or harmful content on online platforms. 

An incident may involve a set of emerging content patterns (text, image, or other modalities) that violate the Microsoft community guidelines or customers' policies and expectations, that need to be mitigated quickly and accurately to avoid potential live site issues or harm to users/communities. 


For any new incidents, users could use the incident response features from Azure AI Content Safety to mitigate the new incidents quickly.

Incident response provides a set of APIs to help users mitigate harmful content incidents quickly. [Custom Blocklists](https://learn.microsoft.com/azure/ai-services/content-safety/how-to/use-blocklist) are one solution, but only provide exact match. Incident response offers the advanced capabilities of text semantic match using embedding search and a lightweight classifier, and image matching, a light-weight image object tracking model and embedding search to address image incidents with low latency and high performance.

For this advanced text and image incident response, you can easily define an incident with few examples in one specific topic, and the API will start detecting similar content. 

Note: This new feature is only available in **East US** and **Sweden Central**. 

> [!CAUTION]
> The sample code could have offensive content, user discretion is advised.


## Quick start

### Step 1. Whitelist your subscription ID

1. Submit this form by filling in your subscription ID to whitelist this feature to you: [Microsoft Forms](https://forms.office.com/r/38GYZwLC0u).
2. The whitelist will take up to 48 hours to approve. Once you receive a notification from Microsoft, you can go to the next step.

### Step 2. Create an Azure Content Safety resource

1. Sign in to the [Azure Portal](https://portal.azure.com/).
2. [Create Content Safety Resource](https://aka.ms/acs-create). Enter a unique name for your resource, select the **whitelisted subscription**, resource group, and your preferred region in one of the **East US, Sweden Central** and pricing tier. Select **Create**.
3. **The resource will take a few minutes to deploy.** After it does, go to the new resource. To access your Content Safety resource, you'll need a subscription key; In the left pane, under **Resource Management**, select **API Keys and Endpoints**. Copy one of the subscription key values and endpoint for later use.

### Step 3A. Test with Sample request of text incident response

#### 1. Create an incident

```shell
curl --location --request PATCH 'https://<endpoint>/contentsafety/text/incidents/text-incident-name?api-version=2023-10-30-preview' \
--header 'Ocp-Apim-Subscription-Key: <api_key>' \
--header 'Content-Type: application/json' \
--data '{
  "incidentName": "text-incident-name",
  "description": "string"
}'
```

```python
import requests
import json

url = "https://<endpoint>/contentsafety/text/incidents/text-incident-name?api-version=2023-10-30-preview"

payload = json.dumps({
  "incidentName": "text-incident-name",
  "description": "string"
})
headers = {
  'Ocp-Apim-Subscription-Key': '<api_key>',
  'Content-Type': 'application/json'
}

response = requests.request("PATCH", url, headers=headers, data=payload)

print(response.text)
```

#### 2. Add samples to the incident

```shell
curl --location 'https://<endpoint>/contentsafety/text/incidents/text-incident-name:addIncidentSamples?api-version=2023-10-30-preview' \
--header 'Ocp-Apim-Subscription-Key: <api_key>' \
--header 'Content-Type: application/json' \
--data-raw '{
  "incidentSamples": [
    { "text":      "COCKSUCKER BEFORE YOU PISS AROUND ON MY WORK"},
    { "text":"@: nobody cares about the Fucking Shit like you, fucking bitch........................ 5.9.97.199"},
    { "text":      "FUCK \nYou little bitch the cowboys have no testes"},
    { "text":"And your a dick sucker dabomb you want a big juicy jizzBOMB in your mouth."},
    { "text":"Whatever, dumbass. \n\nGo eat Jimbo'\''s pussy."},
    { "text":"you are a senile old homosexual==\n\nyou need to go to Oz to get a fucking brain \n\n=="},
    { "text":"STANDAHL ARE YOU A MAN OR A MOUSESTACHE?\n\nWHY DON'\''T YOU RESPOND.\n\nARE YOU SCARED OF THE APPROPRIATE FEDERAL AGENCIES WHO ARE ACTIVELY WATCHING YOUR ACTS?"},
    { "text":", I hope you'\''re on the next plane just so we can erase all record of what they did to you the way you are trying to revise this history.  Asshole."},
    { "text":"I very much doubt that you can describe an undoubted POV vandal such as User:Vintagekits as '\''editing in good faith'\''. Just ignore these stupid Admins"},
    { "text":"Hey, Halcy.Seems like you get mad alot. Want me to call the WAAAAAMBULANCE for you? Want some dick (extra small) with that too, bitch? U mad? butthurt? I bet you'\''re having an orgy with MeetTheMedic and MeepTheSheep, aren'\''t you? You three would make a good threesome. You'\''re all reject 4-Chan trolls that became admins on another website to have Unwarranted Self Importance while you spam faggot and dick all day. Seems like you enjoy that kind of stuff. I had no idea, really.\n \nTL;DR: U mad?"},
    { "text":"Better late then ever. \n\nGood riddance, militant freak."}
  ]
}'
```

```python
import requests
import json

url = "https://<endpoint>/contentsafety/text/incidents/text-incident-name:addIncidentSamples?api-version=2023-10-30-preview"

payload = json.dumps({
  "incidentSamples": [
    {
      "text": "COCKSUCKER BEFORE YOU PISS AROUND ON MY WORK"
    },
    {
      "text": "@: nobody cares about the Fucking Shit like you, fucking bitch........................ 5.9.97.199"
    },
    {
      "text": "FUCK \nYou little bitch the cowboys have no testes"
    },
    {
      "text": "And your a dick sucker dabomb you want a big juicy jizzBOMB in your mouth."
    },
    {
      "text": "Whatever, dumbass. \n\nGo eat Jimbo's pussy."
    },
    {
      "text": "you are a senile old homosexual==\n\nyou need to go to Oz to get a fucking brain \n\n=="
    },
    {
      "text": "STANDAHL ARE YOU A MAN OR A MOUSESTACHE?\n\nWHY DON'T YOU RESPOND.\n\nARE YOU SCARED OF THE APPROPRIATE FEDERAL AGENCIES WHO ARE ACTIVELY WATCHING YOUR ACTS?"
    },
    {
      "text": ", I hope you're on the next plane just so we can erase all record of what they did to you the way you are trying to revise this history.  Asshole."
    },
    {
      "text": "I very much doubt that you can describe an undoubted POV vandal such as User:Vintagekits as 'editing in good faith'. Just ignore these stupid Admins"
    },
    {
      "text": "Hey, Halcy.Seems like you get mad alot. Want me to call the WAAAAAMBULANCE for you? Want some dick (extra small) with that too, bitch? U mad? butthurt? I bet you're having an orgy with MeetTheMedic and MeepTheSheep, aren't you? You three would make a good threesome. You're all reject 4-Chan trolls that became admins on another website to have Unwarranted Self Importance while you spam faggot and dick all day. Seems like you enjoy that kind of stuff. I had no idea, really.\n \nTL;DR: U mad?"
    },
    {
      "text": "Better late then ever. \n\nGood riddance, militant freak."
    }
  ]
})
headers = {
  'Ocp-Apim-Subscription-Key': '<api_key>',
  'Content-Type': 'application/json'
}

response = requests.request("POST", url, headers=headers, data=payload)

print(response.text)
```

#### 3. Analyze text with incident response

```shell
curl --location 'https://<endpoint>/contentsafety/text:analyze?api-version=2023-10-30-preview' \
--header 'Ocp-Apim-Subscription-Key: <api_key>' \
--header 'Content-Type: application/json' \
--data '{
  "text":  "COCKSUCKER BEFORE YOU PISS AROUND ON MY WORK",
  "incidents": {
    "incidentNames": [
      "text-incident-name"
    ],
    "haltOnIncidentHit": true
  }
}'
```

```python
import requests
import json

url = "https://<endpoint>/contentsafety/text:analyze?api-version=2023-10-30-preview"

payload = json.dumps({
  "text": "COCKSUCKER BEFORE YOU PISS AROUND ON MY WORK",
  "incidents": {
    "incidentNames": [
      "text-incident-name"
    ],
    "haltOnIncidentHit": True
  }
})
headers = {
  'Ocp-Apim-Subscription-Key': '<api_key>',
  'Content-Type': 'application/json'
}

response = requests.request("POST", url, headers=headers, data=payload)

print(response.text)
```

## Image incident response

#### 1. Create an incident

```shell
curl --location --request PATCH 'https://<endpoint>/contentsafety/image/incidents/image-incident-name?api-version=2023-10-30-preview' \
--header 'Ocp-Apim-Subscription-Key: <api_key>' \
--header 'Content-Type: application/json' \
--data '{
  "incidentName": "image-incident-name",
  "description": "string"
}'
```

```python
import requests
import json

url = "https://<endpoint>/contentsafety/image/incidents/image-incident-name?api-version=2023-10-30-preview"

payload = json.dumps({
  "incidentName": "image-incident-name",
  "description": "string"
})
headers = {
  'Ocp-Apim-Subscription-Key': '<api_key>',
  'Content-Type': 'application/json'
}

response = requests.request("PATCH", url, headers=headers, data=payload)

print(response.text)

```

#### 2. Add samples to the incident

```shell
curl --location 'https://<endpoint>/contentsafety/image/incidents/image-incident-name:addIncidentSamples?api-version=2023-10-30-preview' \
--header 'Ocp-Apim-Subscription-Key: <api_key>' \
--header 'Content-Type: application/json' \
--data '{
  "incidentSamples": [
    {
      "image": {
        "content": "",
        "blobUrl": "https://cmbugbashsampledata.blob.core.windows.net/image-sample/cm_bugbash/safe/safe-incident-sample-image.png"
      }
    }
  ]
}'
```

```python
import requests
import json

url = "https://<endpoint>/contentsafety/image/incidents/image-incident-name:addIncidentSamples?api-version=2023-10-30-preview"

payload = json.dumps({
  "incidentSamples": [
    {
      "image": {
        "content": "",
        "blobUrl": "https://cmbugbashsampledata.blob.core.windows.net/image-sample/cm_bugbash/safe/safe-incident-sample-image.png"
      }
    }
  ]
})
headers = {
  'Ocp-Apim-Subscription-Key': '<api_key>',
  'Content-Type': 'application/json'
}

response = requests.request("POST", url, headers=headers, data=payload)

print(response.text)

```

#### 3. Analyze image with incident response

```shell
curl --location 'https://<endpoint>/contentsafety/image:analyze?api-version=2023-10-30-preview' \
--header 'Ocp-Apim-Subscription-Key: <api_key>' \
--header 'Content-Type: application/json' \
--data '{
    "image":
        {
        "blobUrl": "https://cmbugbashsampledata.blob.core.windows.net/image-sample/cm_bugbash/safe/safe-incident-sample-image.png"
        },
    "categories": [
        "SelfHarm",
        "Sexual"
    ],
   "outputType": "FourSeverityLevels",
   "incidents": {
       "incidentNames": [
          "image-incident-name"
        ],
        "haltOnIncidentHit": true
  }
}'
```


```python
import requests
import json

url = "https://<endpoint>/contentsafety/image:analyze?api-version=2023-10-30-preview"

payload = json.dumps({
  "image": {
    "blobUrl": "https://cmbugbashsampledata.blob.core.windows.net/image-sample/cm_bugbash/safe/safe-incident-sample-image.png"
  },
  "categories": [
    "SelfHarm",
    "Sexual"
  ],
  "outputType": "FourSeverityLevels",
  "incidents": {
    "incidentNames": [
      "image-incident-name"
    ],
    "haltOnIncidentHit": True
  }
})
headers = {
  'Ocp-Apim-Subscription-Key': '<api_key>',
  'Content-Type': 'application/json'
}

response = requests.request("POST", url, headers=headers, data=payload)

print(response.text)

```

## Limitations
| Object     | Limitation                                                  |
| :------------ | :------------------ |
| Maximum length of an incident name | 100 characters | 
| Maximum number of samples per text/image incident | 1000 |
|Maximum size of each sample | Text less than 500 characters, Image less than 4M  |
| Maximum number of text or image incidents | 100 |  
| Supported Image format | BMP, GIF, JPEG, PNG, TIF, WEBP|
| Supported language for text incident response | All languages that supported by Azure AI Content Safety | 


## Sample Code 

### Text Incident Management related API

#### Get the incidents list

```shell
curl --location 'https://<endpoint>/contentsafety/text/incidents?api-version=2023-10-30-preview' \
--header 'Ocp-Apim-Subscription-Key: <api_key>'
```

```python
import requests

url = "https://<endpoint>/contentsafety/text/incidents?api-version=2023-10-30-preview"

payload = {}
headers = {
  'Ocp-Apim-Subscription-Key': '<api_key>'
}

response = requests.request("GET", url, headers=headers, data=payload)

print(response.text)
```

#### Get the incident details

```shell
curl --location 'https://<endpoint>/contentsafety/text/incidents/text-incident-name?api-version=2023-10-30-preview' \
--header 'Ocp-Apim-Subscription-Key: <api_key>'
```

```python
import requests

url = "https://<endpoint>/contentsafety/text/incidents/text-incident-name?api-version=2023-10-30-preview"

payload = {}
headers = {
  'Ocp-Apim-Subscription-Key': '<api_key>'
}

response = requests.request("GET", url, headers=headers, data=payload)

print(response.text)
```

#### Delete the incident

```shell
curl --location --request DELETE 'https://<endpoint>/contentsafety/text/incidents/text-incident-name?api-version=2023-10-30-preview' \
--header 'Ocp-Apim-Subscription-Key: <api_key>'
```

```python
import requests

url = "https://<endpoint>/contentsafety/text/incidents/text-incident-name?api-version=2023-10-30-preview"

payload = {}
headers = {
  'Ocp-Apim-Subscription-Key': '<api_key>'
}

response = requests.request("DELETE", url, headers=headers, data=payload)

print(response.text)
```

#### Retrieve the incident sample list

```shell
curl --location 'https://<endpoint>/contentsafety/text/incidents/text-incident-name/incidentSamples?api-version=2023-10-30-preview' \
--header 'Ocp-Apim-Subscription-Key: <api_key>'
```

```python
import requests

url = "https://<endpoint>/contentsafety/text/incidents/text-incident-name/incidentSamples?api-version=2023-10-30-preview"

payload = {}
headers = {
  'Ocp-Apim-Subscription-Key': '<api_key>'
}

response = requests.request("GET", url, headers=headers, data=payload)

print(response.text)
```

#### Get the incident sample's details

```shell
curl --location 'https://<endpoint>/contentsafety/text/incidents/text-incident-name/incidentSamples/00e63d3f-54a6-4495-8191-6020923ca789?api-version=2023-10-30-preview' \
--header 'Ocp-Apim-Subscription-Key: <api_key>'
```

```python
import requests

url = "https://<endpoint>/contentsafety/text/incidents/text-incident-name/incidentSamples/00e63d3f-54a6-4495-8191-6020923ca789?api-version=2023-10-30-preview"

payload = {}
headers = {
  'Ocp-Apim-Subscription-Key': '<api_key>'
}

response = requests.request("GET", url, headers=headers, data=payload)

print(response.text)
```

#### Delete an incident sample

```shell
curl --location 'https://<endpoint>/contentsafety/text/incidents/text-incident-name:removeIncidentSamples?api-version=2023-10-30-preview' \
--header 'Ocp-Apim-Subscription-Key: <api_key>' \
--header 'Content-Type: application/json' \
--data '{
  "incidentSampleIds": [
    "00e63d3f-54a6-4495-8191-6020923ca789"
  ]
}'
```

```python
import requests
import json

url = "https://<endpoint>/contentsafety/text/incidents/text-incident-name:removeIncidentSamples?api-version=2023-10-30-preview"

payload = json.dumps({
  "incidentSampleIds": [
    "00e63d3f-54a6-4495-8191-6020923ca789"
  ]
})
headers = {
  'Ocp-Apim-Subscription-Key': '<api_key>',
  'Content-Type': 'application/json'
}

response = requests.request("POST", url, headers=headers, data=payload)

print(response.text)
```

### Image Incident Management related API

#### Get the incidents list

```shell
curl --location 'https://<endpoint>/contentsafety/image/incidents?api-version=2023-10-30-preview' \
--header 'Ocp-Apim-Subscription-Key: <api_key>'
```

```python
import requests

url = "https://<endpoint>/contentsafety/image/incidents?api-version=2023-10-30-preview"

payload = {}
headers = {
  'Ocp-Apim-Subscription-Key': '<api_key>'
}

response = requests.request("GET", url, headers=headers, data=payload)

print(response.text)
```

#### Get the incident details

```shell
curl --location 'https://<endpoint>/contentsafety/image/incidents/image-incident-name?api-version=2023-10-30-preview' \
--header 'Ocp-Apim-Subscription-Key: <api_key>'
```

```python
import requests

url = "https://<endpoint>/contentsafety/image/incidents/image-incident-name?api-version=2023-10-30-preview"

payload = {}
headers = {
  'Ocp-Apim-Subscription-Key': '<api_key>'
}

response = requests.request("GET", url, headers=headers, data=payload)

print(response.text)
```

#### Delete the incident

```shell
curl --location --request DELETE 'https://<endpoint>/contentsafety/image/incidents/image-incident-name?api-version=2023-10-30-preview' \
--header 'Ocp-Apim-Subscription-Key: <api_key>'
```

```python
import requests

url = "https://<endpoint>/contentsafety/image/incidents/image-incident-name?api-version=2023-10-30-preview"

payload = {}
headers = {
  'Ocp-Apim-Subscription-Key': '<api_key>'
}

response = requests.request("DELETE", url, headers=headers, data=payload)

print(response.text)
```

#### Get the incident sample list

```shell
curl --location 'https://<endpoint>/contentsafety/image/incidents/image-incident-name/incidentSamples?api-version=2023-10-30-preview' \
--header 'Ocp-Apim-Subscription-Key: <api_key>'
```

```python
import requests

url = "https://<endpoint>/contentsafety/image/incidents/image-incident-name/incidentSamples?api-version=2023-10-30-preview"

payload = {}
headers = {
  'Ocp-Apim-Subscription-Key': '<api_key>'
}

response = requests.request("GET", url, headers=headers, data=payload)

print(response.text)
```

#### Get the incident sample details

```shell
curl --location 'https://<endpoint>/contentsafety/image/incidents/image-incident-name/incidentSamples/00e63d3f-54a6-4495-8191-6020923ca789?api-version=2023-10-30-preview' \
--header 'Ocp-Apim-Subscription-Key: <api_key>'
```

```python
import requests

url = "https://<endpoint>/contentsafety/image/incidents/image-incident-name/incidentSamples/00e63d3f-54a6-4495-8191-6020923ca789?api-version=2023-10-30-preview"

payload = {}
headers = {
  'Ocp-Apim-Subscription-Key': '<api_key>'
}

response = requests.request("GET", url, headers=headers, data=payload)

print(response.text)
```

#### Delete the incident sample

```shell
curl --location 'https://<endpoint>/contentsafety/image/incidents/image-incident-name:removeIncidentSamples?api-version=2023-10-30-preview' \
--header 'Ocp-Apim-Subscription-Key: <api_key>' \
--header 'Content-Type: application/json' \
--data '{
  "incidentSampleIds": [
    "00e63d3f-54a6-4495-8191-6020923ca789"
  ]
}'
```

```python
import requests
import json

url = "https://<endpoint>/contentsafety/image/incidents/image-incident-name:removeIncidentSamples?api-version=2023-10-30-preview"

payload = json.dumps({
  "incidentSampleIds": [
    "00e63d3f-54a6-4495-8191-6020923ca789"
  ]
})
headers = {
  'Ocp-Apim-Subscription-Key': '<api_key>',
  'Content-Type': 'application/json'
}

response = requests.request("POST", url, headers=headers, data=payload)

print(response.text)
```

