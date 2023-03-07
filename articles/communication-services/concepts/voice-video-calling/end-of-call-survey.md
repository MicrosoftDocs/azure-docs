---
title: Azure Communication Services Call Quality Survey
titleSuffix: An Azure Communication Services concept document
description: Provides an overview of the Call Quality Survey Capability
author: amagginetti
ms.author: amagginetti
manager: mvivion

services: azure-communication-services
ms.date: 3/06/2023
ms.topic: conceptual
ms.service: azure-communication-services
ms.subservice: calling
---



# Call Quality Survey


[!INCLUDE [Public Preview](../../includes/public-preview-include-document.md)]

>[!IMPORTANT]
>Call Quality Survey is available starting on the version [1.9.1-beta.1](https://www.npmjs.com/package/@azure/communication-calling/v/1.9.1-beta.1) of the Calling SDK. Make sure to use that version when trying the instructions below.


> [!NOTE] 
> User-facing diagnostics is currently supported only for our JavaScript / Web SDK.


TODO – any regional restrictions? EU?

The Call Quality Survey provides you with a tool to understand how your end users perceive the overall quality and reliability of your **WebJS SDK? Only** calling solution. 

## Purpose of the Call Quality Survey
It’s difficult to determine a customer’s perceived calling experience and determine how well your calling solution is performing without gathering subjective feedback from customers.

You can use the Call Quality Survey to collect and analyze customers **subjective** opinions on their calling experience as opposed to relying only on **objective** measurements such as audio and video bitrate, jitter, and latency, which may not indicate if a customer had a poor calling experience. After publishing survey data you can collect the survey results through Azure for analysis and improvements. Azure Communication Services **(we?)** uses these survey results to monitor and improve quality and reliability.

### Call Quality Survey vs. Post-Call Survey


If you want to survey your customers on topics unrelated to the quality of their calling experience, use the [Post-Call Survey](https://github.com/Azure-Samples/communication-services-virtual-visits-js/blob/main/docs/post-call-survey.md#custom). Microsoft analyzes the Call Quality Survey data results to improve the Azure Communication Services calling capabilities. 


## How to use the Call Quality Survey
The Call Quality Survey APIs can be accessed through….. the Calling SDK. 

## Prerequisites

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).
- [Node.js](https://nodejs.org/) active Long Term Support(LTS) versions are recommended.
- An active Communication Services resource. [Create a Communication Services resource](../../quickstarts/create-communication-resource.md).
- A User Access Token to instantiate the call client. Learn how to [create and manage user access tokens](../../quickstarts/identity/access-tokens.md). You can also use the Azure CLI and run the following command with your connection string to create a user and an access token. (Need to grab connection string from the resource through Azure portal.)

  ```azurecli-interactive
  az communication identity token issue --scope voip --connection-string "yourConnectionString"
  ```

  For details, see [Use Azure CLI to Create and Manage Access Tokens](../../quickstarts/identity/access-tokens.md?pivots=platform-azcli).


- **An active Azure Log Analytics workspace to collect and analyze survey results?**


## Survey Structure

The survey is designed to answer two questions from a user’s point of view. 

-	Question 1: How did the users perceive their overall call quality experience?

-	Question 2: Did the user perceive any Audio, Video, or Screen Share issues in the call?

The API allows applications to gather data points that describe user perceived ratings of their Overall Call, Audio, Video, and Screen Share experiences. Microsoft analyzes received API results according to the following goals.

### Call Quality Survey API Goals

| API Values | Question Goal |
| ----------- | ----------- |
|  Overall Call  |       |
| Audio   |       |
|   Video |       |
| Screen Share   |       |


## API Capabilities



### Default survey API configuration
| API Values | Cutoff Value* | Input Range | Comments |
| ----------- | ----------- | -------- | -------- | 
| Overall Call | 2 | 1-5 | Survey’s a calling participant’s overall quality experience on a scale of 1-5 where 1 indicates an imperfect call experience and 5 indicates a perfect call. The cutoff value of 2 means that a customer response of 1 or 2 indicates a less than perfect call experience. API submission would map to a scale of 1-5 with the cutoff value being 2. |
| Audio |   0 |  0-1  | A response of 0 indicates an imperfect audio experience and 1 indicates no audio issues were experienced.  |
| Video |   0 |   0-1 |  A response of 0 indicates an imperfect video experience and 1 indicates no video issues were experienced. |
| ScreenShare | 0   |0-1   |  A response of 0 indicates an imperfect screen share experience and 1 indicates no screen share issues were experienced. |





| API Values | Cutoff Value* | Input Range | Comments |
| ----------- | ----------- | -------- | -------- | 
|    |       |       |      |
|    |       |       |      |
|    |       |       |      |
|    |       |       |      |
|    |       |       |      |



-	*Note: A question’s indicated cutoff value in the API is the threshold that Microsoft uses when analyzing your survey data. When you customize the cutoff value or Question Input Range Microsoft analyzes your survey data according to your customization.

### API Tags by Value
| API Values | Optional Tags |
| ----------- | ----------- |
|  Overall Call  |       |
| Audio   |       |
|   Video |       |
| Screen Share   |       |


## To invoke API (API category values and API Tags)

TODO – add details on implementation

## Debbugability?


## HELP – Frequently Asked Questions (FAQs)
-	How is the API data collected in the SDK?
-	During the call, after the call? Once all participants join, once it ends?
-	How is the data collected?
-	How long does Microsoft store and analyze my survey data?
-	When can I use the API?
-	only works at at the end of the call?
-	During a call? No?
-	Day after a call? Yes?
-	Week after a call? No?
-	How can I tell if the API is not working?

## Best Practices
Here are our recommended API survey flows and suggested question prompts for consideration. Your development can use our recommendation or use customized question prompts and flows for your visual interface.

**Question 1:** How did the users perceive their overall call quality experience?
Separating the first and seconds questions helps only collect responses to Audio, Video, and Screen Share issues if they are related to a call if a survey participant indicates they experienced call quality issues with a score at or below your cutoff value. 

-	Suggested prompt: “How was the call quality?” 
-	API Question Values: Overall Call

**Question 2:** Did the user perceive any Audio, Video, or Screensharing issues in the call?
If a survey participant responded to Question 1 with a score at or below the cutoff value for the overall call, then present the second question.

-	Suggested prompt: “What could have been better?” 
-	API Question Values: Audio, Video, and Screenshare 

**Surveying Guidelines**
-	Avoid survey burnout by not surveying all call participants.
-	Aside from question 1, question and attribute order matters. We recommend randomizing the sequence of secondary questions and tags in case respondents focus most of their feedback on the first prompt they visually see.
-	Consider using surveys for separate ACS Resources in controlled experiments to identify release impacts.  

## Call Quality Survey Customization
You can choose to collect each of the four API values or only the ones you find most important. For example, you can choose to only ask customers about their overall call experience instead of asking them about their audio, video, and screen share experience. You can also customize input ranges to suit your needs.

| API Values | Cutoff Value* | Input Range | Comments |
| ----------- | ----------- | -------- | -------- | 
|    |       |       |      |
|    |       |       |      |
|    |       |       |      |
|    |       |       |      |
|    |       |       |      |

**TODO - To Invoke**

## Privacy

TODO – are there any privacy things to note?


## Retrieve Survey Data Options:
-	1. Analyze through an Azure Log Analytics workspace.
-	2. Export results and analyze with PowerBI query.
-	3. Export results for your own for analysis.


### Analyze through an Azure Log Analytics workspace?

Create a log analytics workspace and analyze your survey results with this sample query.

•	Prerequisites:?

Azure Communication Services-Enable Azure Monitor - An Azure Communication Services concept document | Microsoft Learn


Azure Communication Services - Call Logs - An Azure Communication Services concept document | Microsoft Learn

Azure Communication Services - Log Analytics Preview - An Azure Communication Services concept document | Microsoft Learn


-	Use this log analytics query?


### Export results and analyze with Power BI query.

-	Call Quality Survey data can be retrieved from Azure Monitor?

-	Prerequisites:?

-	Use this PowerBI Query


### Export results for your own for analysis

•	Can Call Quality Survey data can be retrieved from Azure Monitor?

•	Prerequisites:



### Data result format?
•	Azure data requests
o	Get Survey Result = Call ID = XYZ
o	Response = 
	Overall Call = 0/7
	Audio = 1/4
•	Is survey data tied to , Call ID, Leg ID, Resource? How can I retrieve my data?


### HELP – Frequently Asked Questions (FAQs)
•	How long will the data take to become available?


## Next Steps

Link to Log workspace?
Azure Communication Services-Enable Azure Monitor - An Azure Communication Services concept document | Microsoft Learn


Azure Communication Services - Call Logs - An Azure Communication Services concept document | Microsoft Learn

Azure Communication Services - Log Analytics Preview - An Azure Communication Services concept document | Microsoft Learn

note