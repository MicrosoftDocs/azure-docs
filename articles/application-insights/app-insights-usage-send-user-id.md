---
title: Sending user id to enable usage experiences in Application Insights | Microsoft Docs
description: Track how users move through your service after assigning each of them a unique, persistent id string in Application Insights.
services: application-insights
documentationcenter: ''
author: abgreg
manager: carmonm

ms.service: application-insights
ms.workload: tbd
ms.tgt_pltfrm: ibiza
ms.devlang: csharp
ms.topic: article
ms.date: 08/02/2017
ms.author: cfreeman

---
#  Send user ID to enable usage experiences in Application Insights

## Tracking users

Application Insights enables you to monitor and track your users through a set of product usage tools: 
* [Users](https://docs.microsoft.com/azure/application-insights/app-insights-usage-segmentation)
* [Funnels](https://docs.microsoft.com/azure/application-insights/usage-funnels)
* [Retention](https://docs.microsoft.com/azure/application-insights/app-insights-usage-retention)
* Cohorts
* [Workbooks](https://docs.microsoft.com/azure/application-insights/app-insights-usage-workbooks)

Many Application Insight Usage products utilize user ID to identify unique users. Send user ID with every custom event or page view in order to associate the event with a unique user. Product usage tools will not light up until you have sent user ID with your events. 

If your app is integrated with the JavaScript SDK, then user ID is tracked automatically. 

**Set user ID in an ITelemetryInitializer**

Create a telemetry initializer, as described in more detail [here](https://docs.microsoft.com/azure/application-insights/app-insights-api-filtering-sampling#add-properties-itelemetryinitializer), and set the Context.User.Id to an ID that corresponds to the current user.

The ID does not need to be a Guid. If the ID contains personally identifying information about the user, it is not an appropriate value to send to Application Insights as a user ID.

*C#*

```C#

    using System;
    using Microsoft.ApplicationInsights.Channel;
    using Microsoft.ApplicationInsights.DataContracts;
    using Microsoft.ApplicationInsights.Extensibility;

    namespace MvcWebRole.Telemetry
    {
      /*
       * Custom TelemetryInitializer that sets the user ID.
       *
       */
      public class MyTelemetryInitializer : ITelemetryInitializer
      {
        public void Initialize(ITelemetry telemetry)
        {
            telemetry.Context.User.Id = Guid.NewGuid();
        }
      }
    }
```