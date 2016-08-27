<properties
   pageTitle="Interact with reports using the JavaScript API"
   description="Power BI Embedded, interact with reports using the JavaScript API"
   services="power-bi-embedded"
   documentationCenter=""
   authors="minewiskan"
   manager="NA"
   editor=""
   tags=""/>
<tags
   ms.service="power-bi-embedded"
   ms.devlang="NA"
   ms.topic="hero-article"
   ms.tgt_pltfrm="NA"
   ms.workload="powerbi"
   ms.date="08/26/2016"
   ms.author="owend"/>

# Interact with reports using the JavaScript API

The Power BI JavaScript API allows for easy embedding of Power BI reports into applications that you are building. With the API, your application can programmatically interact with the different elements of the reports like pages and filters. These interactions will make the reports a more integrated part of the application.

Embedding a Power BI report in your application is done with an iframe which is hosted as part of the app. The iframe acts as a boundary between your application and the Power BI report. Without the JavaScript API the report cannot interact with your application and your application can&#39;t interact with the report. While the iframe can make the embedding process a lot easier, this lack of interaction between your application and the Power BI report can sometimes make it feel like that report is not really part of your application. To really make the report feel like it is just another part of your app you may want to communicate back and forth with it.

[IMAGE 1 image]

The latest enhancements to the Power BI JavaScript API will allow you to write code that can securely pass through the iframe boundary so that your application can programmatically perform an action in a report and listen for events from actions that users make from within the reports themselves.

[IMAGE 2 image]

## What can be done with the Power BI JavaScript API?

[IMAGE 3 diagram]

### Reports

- Embed a specific Power BI Report securely in your application (example: [http://azure-samples.github.io/powerbi-angular-client/#/scenario1](http://azure-samples.github.io/powerbi-angular-client/#/scenario1))
  - Set access token
- Configure the report
  - Enable/Disable functionality (example: [http://azure-samples.github.io/powerbi-angular-client/#/scenario6](http://azure-samples.github.io/powerbi-angular-client/#/scenario6))
    - Filter Pane
    - Page Navigation tabs
  - Set defaults (example: [http://azure-samples.github.io/powerbi-angular-client/#/scenario5](http://azure-samples.github.io/powerbi-angular-client/#/scenario5))
    - Page
    - Filters
- Enter/Exit full screen mode

To learn more about embedding a report, please visit: [https://github.com/Microsoft/PowerBI-JavaScript/wiki/Embedding-Basics](https://github.com/Microsoft/PowerBI-JavaScript/wiki/Embedding-Basics).

### Page Navigation

- Discover all pages in a report
- Set the current page (example: [http://azure-samples.github.io/powerbi-angular-client/#/scenario3](http://azure-samples.github.io/powerbi-angular-client/#/scenario3))

To learn more about page navigation, please visit: [https://github.com/Microsoft/PowerBI-JavaScript/wiki/Page-Navigation](https://github.com/Microsoft/PowerBI-JavaScript/wiki/Page-Navigation).

### Filters

The JavaScript API allows for advanced filtering capabilities on embedded reports. A filtering example can be found here: [http://azure-samples.github.io/powerbi-angular-client/#/scenario4](http://azure-samples.github.io/powerbi-angular-client/#/scenario4).

- Filtering supported on:
  - Reports
  - Pages
- Supported filter types
  - Basic
    - A basic filter is placed on a column or hierarchy level and contains a list of values to include or exclude:

[IMAGE 4 code]

-
  - Advanced

Advanced filters have a logical operator and accept 1 or 2 conditions which have their own operator and value.

-
  -
    - Logical Operators
      - And
      - Or
    - Conditions
      - None
      - LessThan
      - LessThanOrEqual
      - GreaterThan
      - GreaterThanOrEqual
      - Contains
      - DoesNotContain
      - StartsWith
      - DoesNotStartWith
      - Is
      - IsNot
      - IsBlank
      - IsNotBlank

[IMAGE 5 code]

For more information on filtering please see: [https://github.com/Microsoft/PowerBI-JavaScript/wiki/Filters](https://github.com/Microsoft/PowerBI-JavaScript/wiki/Filters)

### Events

In addition to sending information into the iframe your app can also receive information on events coming from the iframe. The following are a list of supported events:

- Embed
  - loaded
  - error
- Reports
  - pageChanged
  - dataSelected (coming soon)

To learn more about handling events, please see: [https://github.com/Microsoft/PowerBI-JavaScript/wiki/Handling-Events](https://github.com/Microsoft/PowerBI-JavaScript/wiki/Handling-Events).

## Next Steps

To get more information on the Power BI JavaScript API, please review the following links:

- JavaScript API Wiki: [https://github.com/Microsoft/PowerBI-JavaScript/wiki](https://github.com/Microsoft/PowerBI-JavaScript/wiki)
- Object model reference: [https://microsoft.github.io/powerbi-models/modules/\_models\_.html](https://microsoft.github.io/powerbi-models/modules/_models_.html)
- Samples
  - Asp.Net MVC: [https://github.com/Azure-Samples/power-bi-embedded-integrate-report-into-web-app/tree/master/EmbedSample](https://github.com/Azure-Samples/power-bi-embedded-integrate-report-into-web-app/tree/master/EmbedSample)
  - Angular: [http://azure-samples.github.io/powerbi-angular-client](http://azure-samples.github.io/powerbi-angular-client)
  - Ember: [https://github.com/Microsoft/powerbi-ember](https://github.com/Microsoft/powerbi-ember)
- Live demo: [https://microsoft.github.io/PowerBI-JavaScript/demo/](https://microsoft.github.io/PowerBI-JavaScript/demo/)
