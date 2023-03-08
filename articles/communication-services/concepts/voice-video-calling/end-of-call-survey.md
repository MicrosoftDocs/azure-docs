---
title: Azure Communication Services End of Call Survey
titleSuffix: An Azure Communication Services concept document
description: Provides an overview of the End of Call Survey Capability
author: amagginetti
ms.author: amagginetti
manager: mvivion

services: azure-communication-services
ms.date: 3/06/2023
ms.topic: conceptual
ms.service: azure-communication-services
ms.subservice: calling
---



# End of Call Survey


[!INCLUDE [Public Preview](../../includes/public-preview-include-document.md)]



> [!NOTE] 
> User-facing diagnostics is currently supported only for our JavaScript / Web SDK.


TODO – any regional restrictions? EU?

The End of Call Survey provides you with a tool to understand how your end users perceive the overall quality and reliability of your **WebJS SDK? Only** calling solution. 

## Purpose of the End of Call Survey
It’s difficult to determine a customer’s perceived calling experience and determine how well your calling solution is performing without gathering subjective feedback from customers.

You can use the End of Call Survey to collect and analyze customers **subjective** opinions on their calling experience as opposed to relying only on **objective** measurements such as audio and video bitrate, jitter, and latency, which may not indicate if a customer had a poor calling experience. After publishing survey data, you can view the survey results through Azure for analysis and improvements. Azure Communication Services uses these survey results to monitor and improve quality and reliability.

## End of Call Survey vs. Post-Call Survey

If you want to survey your customers on topics unrelated to the quality of their calling experience, use the [Post-Call Survey](https://github.com/Azure-Samples/communication-services-virtual-visits-js/blob/main/docs/post-call-survey.md#custom). Microsoft analyzes the Call Quality Survey data results to improve the Azure Communication Services calling capabilities. 

## How to use the End of Call Survey
The End of Call Survey APIs can be accessed through….. the Calling SDK. 
## Prerequisites

-	An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).

-	[Node.js](https://nodejs.org/) active Long Term Support(LTS) versions are recommended.

-	An active Communication Services resource. [Create a Communication Services resource](../../quickstarts/create-communication-resource.md). Survey results are tied to single Communication Services resources.

-	An active Log Analytics Workspace, also known as Azure Monitor Logs, to analyze your survey results. [Enable logging in Diagnostic Settings](../analytics/enable-logging.md) 



-	A User Access Token to instantiate the call client. Learn how to create and manage user access tokens. You can also use the Azure CLI and run the following command with your connection string to create a user and an access token. (Need to grab connection string from the resource through Azure portal.)

Azure CLICopy
Open Cloudshell
az communication identity token issue --scope voip --connection-string "yourConnectionString"
For details, see Use Azure CLI to Create and Manage Access Tokens.






## Survey Structure

The survey is designed to answer two questions from a user’s point of view. 

-	Question 1: How did the users perceive their overall call quality experience?

-	Question 2: Did the user perceive any Audio, Video, or Screen Share issues in the call?

The API allows applications to gather data points that describe user perceived ratings of their Overall Call, Audio, Video, and Screen Share experiences. Microsoft analyzes survey API results according to the following goals.

### End of Call Survey API Goals


| API Values | Question Goal |
| ----------- | ----------- |
|  Overall Call  |   Responses indicate how a call participant perceived their overall call quality.    |
| Audio   |    Responses indicate if the user perceived any Audio issues.   |
|   Video |   Responses indicate if the user perceived any Video issues.   |
| Screen Share   |    Responses indicate if the user perceived any Screen Share issues.   |



## API Capabilities



### Default survey API configuration

| API Values | Cutoff Value* | Input Range | Comments |
| ----------- | ----------- | -------- | -------- | 
| Overall Call | 2 | 1-5 | Survey’s a calling participant’s overall quality experience on a scale of 1-5 where 1 indicates an imperfect call experience and 5 indicates a perfect call. The cutoff value of 2 means that a customer response of 1 or 2 indicates a less than perfect call experience.  |
| Audio |   0 |  0-1  | A response of 0 indicates an imperfect audio experience and 1 indicates no audio issues were experienced.  |
| Video |   0 |   0-1 |  A response of 0 indicates an imperfect video experience and 1 indicates no video issues were experienced. |
| ScreenShare | 0   |0-1   |  A response of 0 indicates an imperfect screen share experience and 1 indicates no screen share issues were experienced. |



-	***Note**: A question’s indicated cutoff value in the API is the threshold that Microsoft uses when analyzing your survey data. When you customize the cutoff value or Input Range, Microsoft analyzes your survey data according to your customization.

### API Tags by Value
| API Values | Optional Tags |
| ----------- | ----------- |
|  Overall Call  |       |
| Audio   |       |
|   Video |       |
| Screen Share   |       |



## To invoke API (API category values and API Tags)

>[!IMPORTANT]
>End of Call Survey is available starting on the version [1.9.1-beta.1](https://www.npmjs.com/package/@azure/communication-calling/v/1.9.1-beta.1) of the Calling SDK. Make sure to use that version or later when trying the instructions.

TODO – add details on implementation

## Best Practices
Here are our recommended API survey flows and suggested question prompts for consideration. Your development can use our recommendation or use customized question prompts and flows for your visual interface.

**Question 1:** How did the users perceive their overall call quality experience?
We recommend you start the survey by only asking about the participants’ overall quality. If you separate the first and second questions, it helps to only collect responses to Audio, Video, and Screen Share issues if a survey participant indicates they experienced call quality issues. 


-	Suggested prompt: “How was the call quality?” 
-	API Question Values: Overall Call

**Question 2:** Did the user perceive any Audio, Video, or Screen Sharing issues in the call?
If a survey participant responded to Question 1 with a score at or below the cutoff value for the overall call, then present the second question.

-	Suggested prompt: “What could have been better?” 
-	API Question Values: Audio, Video, and ScreenShare 

Surveying Guidelines
-	Avoid survey burnout, don’t survey all call participants.
-	The order of your questions matters. We recommend you randomize the sequence of optional tags in Question 2 in case respondents focus most of their feedback on the first prompt they visually see.
-	Consider using surveys for separate ACS Resources in controlled experiments to identify release impacts.  

### End of Call Survey Customization
You can choose to collect each of the four API values or only the ones you find most important. For example, you can choose to only ask customers about their overall call experience instead of asking them about their audio, video, and screen share experience. You can also customize input ranges to suit your needs. The default input range is 1 to 5 for Overall Call, and 0 to 1 for Audio, Video, and ScreenShare. However, each API value can be customized from a minimum of 0 to maximum of 100.

### Customization options


| API Values | Cutoff Value* | Input Range |
| ----------- | ----------- | -------- |  
| Overall Call   |   0-100    |  0-100     |     
|  Audio  |   0-100    |   0-100    |     
|  Video  |    0-100   |   0-100    |     
|  ScreenShare  |   0-100    |   0-100    |     

-	***Note**: A question’s indicated cutoff value in the API is the threshold that Microsoft uses when analyzing your survey data. When you customize the cutoff value or Input Range, Microsoft analyzes your survey data according to your customization.

**TODO - To Invoke**

TODO – are there any privacy things to note?


## View Survey Data:

> [!IMPORTANT]
> You must enable a Diagnostic Setting in Azure Monitor to send the log data of your surveys to a Log Analytics workspace, Event Hubs, or an Azure storage account to receive and analyze your survey data. If you do not send survey data to one of these options your survey data will not be stored. To enable these logs for your Communications Services, see: [Enable logging in Diagnostic Settings](../analytics/enable-logging.md)

	

### View survey data with a Log Analytics workspace

You need to enable a Log Analytics Workspace to both store the log data of your surveys and access survey results. To enable these logs for your Communications Services, see: [Enable logging in Diagnostic Settings](../analytics/enable-logging.md). Follow the steps to add a diagnostic setting. Select the “CALL DIAGNOSTICS???” data source when choosing category details. Also, choose “Send to Log Analytics workspace” as your destination detail.

-	You can also integrate your Log Analytics workspace with Power BI, see: [Integrate Log Analytics with Power BI](../../../../articles/azure-monitor/logs/log-powerbi.md)


### Default survey analytics query/s: NEED to add to default query pack in azure.

You can use the following sample query in your Log Analytics workspace or Power BI.

#### End of Call Survey Summary

```
ACS Account ID
Start date 
end date
survey response count for overall = XX

-	get the API Value overall: cutoff value, input range, average score, median score, score standard deviation, count of survey responses, total calls, percentage of total calls to two decimal places

-	Same as above but for Audio, video, and screenshare …

-	% of calls with tag A, B, C – print in pie chart, (count, description, percentage of total calls to three decimal places)


| summarize API Value = respondents () by Y?
| summarize =percentage of total respondents () by X
| order by Input range (e.g. 1-5, 0-100)
| render columnchart title="End of Call Survey Summary – Overall"
|Y axis = percentage of total respondents, 
| chart 2 Y axis = axis is number of responses.
```



Do we need to provide data example? Or is that somewhere else?



### Export survey results

If you want to export your survey data, you can instead choose to send the log data of your surveys to Event Hubs, see: [Enable logging in Diagnostic Settings](../analytics/enable-logging.md). Follow the steps to add a diagnostic setting. Again, select the “CALL DIAGNOSTICS???” data source when choosing category details. Then, choose “Stream to an event hub” as your destination detail.



## Debug support?


## Frequently Asked Questions (FAQs) HELP 
-	How is the API data collected in the SDK?
-	During the call, after the call? Once all participants join, once it ends?
-	How long does Microsoft store and analyze my survey data?
-	90 days? Not worth discussing?
-	When can I use the API?
-	only works at the end of the call?
-	During a call? No?
-	Day after a call? Yes?
-	Week after a call? No?
-	How can I tell if the API isn’t working?
-	How long does it take for survey data to be available in Azure?

## Next Steps


-	To learn how to use the Log Analytics workspace, see: [Log Analytics Tutorial](../../../../articles/azure-monitor/logs/log-analytics-tutorial.md)

-	To create your own queries in Log Analytics, see: [Get Started Queries](../../../../articles/azure-monitor/logs/get-started-queries.md)


