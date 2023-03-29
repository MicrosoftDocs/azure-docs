---
title: Feature extensions for Application Insights JavaScript SDK (Click Analytics)
description: Learn how to install and use JavaScript feature extensions (Click Analytics) for the Application Insights JavaScript SDK. 
services: azure-monitor
ms.tgt_pltfrm: ibiza
ms.topic: conceptual
ms.date: 02/13/2023
ms.devlang: javascript
ms.reviewer: mmcc
---

# Feature extensions for the Application Insights JavaScript SDK (Click Analytics)

Application Insights JavaScript SDK feature extensions are extra features that can be added to the Application Insights JavaScript SDK to enhance its functionality.

In this article, we cover the Click Analytics plug-in that automatically tracks click events on webpages and uses `data-*` attributes on HTML elements to populate event telemetry.

[!INCLUDE [azure-monitor-log-analytics-rebrand](../../../includes/azure-monitor-instrumentation-key-deprecation.md)]

## Get started

Users can set up the Click Analytics Autocollection plug-in via npm.

### npm setup

Install the npm package:

```bash
npm install --save @microsoft/applicationinsights-clickanalytics-js @microsoft/applicationinsights-web
```

```js

import { ApplicationInsights } from '@microsoft/applicationinsights-web';
import { ClickAnalyticsPlugin } from '@microsoft/applicationinsights-clickanalytics-js';

const clickPluginInstance = new ClickAnalyticsPlugin();
// Click Analytics configuration
const clickPluginConfig = {
  autoCapture: true
};
// Application Insights Configuration
const configObj = {
  instrumentationKey: "YOUR INSTRUMENTATION KEY",
  extensions: [clickPluginInstance],
  extensionConfig: {
    [clickPluginInstance.identifier]: clickPluginConfig
  },
};

const appInsights = new ApplicationInsights({ config: configObj });
appInsights.loadAppInsights();
```

## Snippet setup

Ignore this setup if you use the npm setup.

```html
<script type="text/javascript" src="https://js.monitor.azure.com/scripts/b/ext/ai.clck.2.6.2.min.js"></script>
<script type="text/javascript">
  var clickPluginInstance = new Microsoft.ApplicationInsights.ClickAnalyticsPlugin();
  // Click Analytics configuration
  var clickPluginConfig = {
    autoCapture : true,
    dataTags: {
      useDefaultContentNameOrId: true
    }
  }
  // Application Insights configuration
  var configObj = {
    instrumentationKey: "YOUR INSTRUMENTATION KEY",
    extensions: [
      clickPluginInstance
    ],
    extensionConfig: {
      [clickPluginInstance.identifier] : clickPluginConfig
    },
  };
  // Application Insights Snippet code
  !function(T,l,y){<!-- Removed the Snippet code for brevity -->}(window,document,{
    src: "https://js.monitor.azure.com/scripts/b/ai.2.min.js",
    crossOrigin: "anonymous",
    cfg: configObj
  });
</script>
```

## Use the plug-in

1. Telemetry data generated from the click events are stored as `customEvents` in the Application Insights section of the Azure portal.
1. The `name` of the `customEvent` is populated based on the following rules:
    1. The `id` provided in the `data-*-id` is used as the `customEvent` name. For example, if the clicked HTML element has the attribute `"data-sample-id"="button1"`, then `"button1"` is the `customEvent` name.
    1. If no such attribute exists and if the `useDefaultContentNameOrId` is set to `true` in the configuration, the clicked element's HTML attribute `id` or content name of the element is used as the `customEvent` name. If both `id` and the content name are present, precedence is given to `id`.
    1. If `useDefaultContentNameOrId` is `false`, the `customEvent` name is `"not_specified"`.

    > [!TIP]
    > We recommend setting `useDefaultContentNameOrId` to `true` for generating meaningful data.
1. The tag `parentDataTag` does two things:
    1. If this tag is present, the plug-in fetches the `data-*` attributes and values from all the parent HTML elements of the clicked element.
    1. To improve efficiency, the plug-in uses this tag as a flag. When encountered, it stops itself from further processing the Document Object Model (DOM) upward.
    
    > [!CAUTION]
    > After `parentDataTag` is used, the SDK begins looking for parent tags across your entire application and not just the HTML element where you used it.
1. The `customDataPrefix` provided by the user should always start with `data-`. An example is `data-sample-`. In HTML, the `data-*` global attributes are called custom data attributes that allow proprietary information to be exchanged between the HTML and its DOM representation by scripts. Older browsers like Internet Explorer and Safari drop attributes they don't understand, unless they start with `data-`.

    The asterisk (`*`) in `data-*` can be replaced by any name following the [production rule of XML names](https://www.w3.org/TR/REC-xml/#NT-Name) with the following restrictions:
    - The name must not start with "xml," whatever case is used for the letters.
    - The name must not contain a semicolon (U+003A).
    - The name must not contain capital letters.

## What data does the plug-in collect?

The following key properties are captured by default when the plug-in is enabled.

### Custom event properties
| Name                  | Description                            | Sample          |
| --------------------- | ---------------------------------------|-----------------|
| Name                  | The name of the custom event. More information on how a name gets populated is shown in the [preceding section](#use-the-plug-in).| About              |
| itemType              | Type of event.                                      | customEvent      |
|sdkVersion             | Version of Application Insights SDK along with click plug-in.|JavaScript:2.6.2_ClickPlugin2.6.2|

### Custom dimensions
| Name                  | Description                            | Sample          |
| --------------------- | ---------------------------------------|-----------------|
| actionType            | Action type that caused the click event. It can be a left or right click. | CL              |
| baseTypeSource        | Base Type source of the custom event.                                      | ClickEvent      |
| clickCoordinates      | Coordinates where the click event is triggered.                            | 659X47          |
| content               | Placeholder to store extra `data-*` attributes and values.            | [{sample1:value1, sample2:value2}] |
| pageName              | Title of the page where the click event is triggered.                      | Sample Title    |
| parentId              | ID or name of the parent element.                                           | navbarContainer |

### Custom measurements
| Name                  | Description                            | Sample          |
| --------------------- | ---------------------------------------|-----------------|
| timeToAction          | Time taken in milliseconds for the user to click the element since the initial page load. | 87407              |

## Configuration

| Name                  | Type                               | Default | Description                                                                                                                              |
| --------------------- | -----------------------------------| --------| ---------------------------------------------------------------------------------------------------------------------------------------- |
| auto-Capture           | Boolean                            | True    | Automatic capture configuration.                                |
| callback              | [IValueCallback](#ivaluecallback)  | Null    | Callbacks configuration.                               |
| pageTags              | String                             | Null    | Page tags.                                             |
| dataTags              | [ICustomDataTags](#icustomdatatags)| Null    | Custom Data Tags provided to override default tags used to capture click data. |
| urlCollectHash        | Boolean                            | False   | Enables the logging of values after a "#" character of the URL.                |
| urlCollectQuery       | Boolean                            | False   | Enables the logging of the query string of the URL.                            |
| behaviorValidator     | Function                           | Null  | Callback function to use for the `data-*-bhvr` value validation. For more information, see the [behaviorValidator section](#behaviorvalidator).|
| defaultRightClickBhvr | String (or) number                 | ''      | Default behavior value when a right-click event has occurred. This value is overridden if the element has the `data-*-bhvr` attribute. |
| dropInvalidEvents     | Boolean                            | False   | Flag to drop events that don't have useful click data.                                                                                   |

### IValueCallback

| Name               | Type     | Default | Description                                                                             |
| ------------------ | -------- | ------- | --------------------------------------------------------------------------------------- |
| pageName           | Function | Null    | Function to override the default `pageName` capturing behavior.                           |
| pageActionPageTags | Function | Null    | A callback function to augment the default `pageTags` collected during a `pageAction` event.  |
| contentName        | Function | Null    | A callback function to populate customized `contentName`.                                 |

### ICustomDataTags

| Name                      | Type    | Default   | Default tag to use in HTML |   Description                                                                                |
|---------------------------|---------|-----------|-------------|----------------------------------------------------------------------------------------------|
| useDefaultContentNameOrId | Boolean | False     | N/A         |Collects standard HTML attribute for `contentName` when a particular element isn't tagged with default `customDataPrefix` or when `customDataPrefix` isn't provided by user. |
| customDataPrefix          | String  | `data-`   | `data-*`| Automatic capture content name and value of elements that are tagged with provided prefix. For example, `data-*-id`, `data-<yourcustomattribute>` can be used in the HTML tags.   |
| aiBlobAttributeTag        | String  | `ai-blob` |  `data-ai-blob`| Plug-in supports a JSON blob attribute instead of individual `data-*` attributes. |
| metaDataPrefix            | String  | Null      | N/A  | Automatic capture HTML Head's meta element name and content with provided prefix when captured. For example, `custom-` can be used in the HTML meta tag. |
| captureAllMetaDataContent | Boolean | False     | N/A   | Automatic capture all HTML Head's meta element names and content. Default is false. If enabled, it overrides provided `metaDataPrefix`. |
| parentDataTag             | String  | Null      |  N/A  | Stops traversing up the DOM to capture content name and value of elements when encountered with this tag. For example, `data-<yourparentDataTag>` can be used in the HTML tags.|
| dntDataTag                | String  | `ai-dnt`  |  `data-ai-dnt`| HTML elements with this attribute are ignored by the plug-in for capturing telemetry data.|

### behaviorValidator

The `behaviorValidator` functions automatically check that tagged behaviors in code conform to a predefined list. The functions ensure that tagged behaviors are consistent with your enterprise's established taxonomy. It isn't required or expected that most Azure Monitor customers use these functions, but they're available for advanced scenarios.

Three different `behaviorValidator` callback functions are exposed as part of this extension. You can also use your own callback functions if the exposed functions don't solve your requirement. The intent is to bring your own behavior's data structure. The plug-in uses this validator function while extracting the behaviors from the data tags.

| Name                   | Description                                                                        |
| ---------------------- | -----------------------------------------------------------------------------------|
| BehaviorValueValidator | Use this callback function if your behavior's data structure is an array of strings.|
| BehaviorMapValidator   | Use this callback function if your behavior's data structure is a dictionary.       |
| BehaviorEnumValidator  | Use this callback function if your behavior's data structure is an Enum.            |

#### Sample usage with behaviorValidator

```js
var clickPlugin = Microsoft.ApplicationInsights.ClickAnalyticsPlugin;
var clickPluginInstance = new clickPlugin();

// Behavior enum values
var behaviorMap = {
  UNDEFINED: 0, // default, Undefined

  ///////////////////////////////////////////////////////////////////////////////////////////////////
  // Page Experience [1-19]
  ///////////////////////////////////////////////////////////////////////////////////////////////////
  NAVIGATIONBACK: 1, // Advancing to the previous index position within a webpage
  NAVIGATION: 2, // Advancing to a specific index position within a webpage
  NAVIGATIONFORWARD: 3, // Advancing to the next index position within a webpage
  APPLY: 4, // Applying filter(s) or making selections
  REMOVE: 5, // Applying filter(s) or removing selections
  SORT: 6, // Sorting content
  EXPAND: 7, // Expanding content or content container
  REDUCE: 8, // Sorting content
  CONTEXTMENU: 9, // Context menu
  TAB: 10, // Tab control
  COPY: 11, // Copy the contents of a page
  EXPERIMENTATION: 12, // Used to identify a third-party experimentation event
  PRINT: 13, // User printed page
  SHOW: 14, // Displaying an overlay
  HIDE: 15, // Hiding an overlay
  MAXIMIZE: 16, // Maximizing an overlay
  MINIMIZE: 17, // Minimizing an overlay
  BACKBUTTON: 18, // Clicking the back button

  ///////////////////////////////////////////////////////////////////////////////////////////////////
  // Scenario Process [20-39]
  ///////////////////////////////////////////////////////////////////////////////////////////////////
  STARTPROCESS: 20, // Initiate a web process unique to adopter
  PROCESSCHECKPOINT: 21, // Represents a checkpoint in a web process unique to adopter
  COMPLETEPROCESS: 22, // Page Actions that complete a web process unique to adopter
  SCENARIOCANCEL: 23, // Actions resulting from cancelling a process/scenario

  ///////////////////////////////////////////////////////////////////////////////////////////////////
  // Download [40-59]
  ///////////////////////////////////////////////////////////////////////////////////////////////////
  DOWNLOADCOMMIT: 40, // Initiating an unmeasurable off-network download
  DOWNLOAD: 41, // Initiating a download

  ///////////////////////////////////////////////////////////////////////////////////////////////////
  // Search [60-79]
  ///////////////////////////////////////////////////////////////////////////////////////////////////
  SEARCHAUTOCOMPLETE: 60, // Auto-completing a search query during user input
  SEARCH: 61, // Submitting a search query
  SEARCHINITIATE: 62, // Initiating a search query
  TEXTBOXINPUT: 63, // Typing or entering text in the text box

  ///////////////////////////////////////////////////////////////////////////////////////////////////
  // Commerce [80-99]
  ///////////////////////////////////////////////////////////////////////////////////////////////////
  VIEWCART: 82, // Viewing the cart
  ADDWISHLIST: 83, // Adding a physical or digital good or services to a wishlist
  FINDSTORE: 84, // Finding a physical store
  CHECKOUT: 85, // Before you fill in credit card info
  REMOVEFROMCART: 86, // Remove an item from the cart
  PURCHASECOMPLETE: 87, // Used to track the pageView event that happens when the CongratsPage or Thank You page loads after a successful purchase
  VIEWCHECKOUTPAGE: 88, // View the checkout page
  VIEWCARTPAGE: 89, // View the cart page
  VIEWPDP: 90, // View a PDP
  UPDATEITEMQUANTITY: 91, // Update an item's quantity
  INTENTTOBUY: 92, // User has the intent to buy an item
  PUSHTOINSTALL: 93, // User has selected the push to install option

  ///////////////////////////////////////////////////////////////////////////////////////////////////
  // Authentication [100-119]
  ///////////////////////////////////////////////////////////////////////////////////////////////////
  SIGNIN: 100, // User sign-in
  SIGNOUT: 101, // User sign-out

  ///////////////////////////////////////////////////////////////////////////////////////////////////
  // Social [120-139]
  ///////////////////////////////////////////////////////////////////////////////////////////////////
  SOCIALSHARE: 120, // "Sharing" content for a specific social channel
  SOCIALLIKE: 121, // "Liking" content for a specific social channel
  SOCIALREPLY: 122, // "Replying" content for a specific social channel
  CALL: 123, // Click on a "call" link
  EMAIL: 124, // Click on an "email" link
  COMMUNITY: 125, // Click on a "community" link

  ///////////////////////////////////////////////////////////////////////////////////////////////////
  // Feedback [140-159]
  ///////////////////////////////////////////////////////////////////////////////////////////////////
  VOTE: 140, // Rating content or voting for content
  SURVEYCHECKPOINT: 145, // Reaching the survey page/form

  ///////////////////////////////////////////////////////////////////////////////////////////////////
  // Registration, Contact [160-179]
  ///////////////////////////////////////////////////////////////////////////////////////////////////
  REGISTRATIONINITIATE: 161, // Initiating a registration process
  REGISTRATIONCOMPLETE: 162, // Completing a registration process
  CANCELSUBSCRIPTION: 163, // Canceling a subscription
  RENEWSUBSCRIPTION: 164, // Renewing a subscription
  CHANGESUBSCRIPTION: 165, // Changing a subscription
  REGISTRATIONCHECKPOINT: 166, // Reaching the registration page/form

  ///////////////////////////////////////////////////////////////////////////////////////////////////
  // Chat [180-199]
  ///////////////////////////////////////////////////////////////////////////////////////////////////
  CHATINITIATE: 180, // Initiating a chat experience
  CHATEND: 181, // Ending a chat experience

  ///////////////////////////////////////////////////////////////////////////////////////////////////
  // Trial [200-209]
  ///////////////////////////////////////////////////////////////////////////////////////////////////
  TRIALSIGNUP: 200, // Signing up for a trial
  TRIALINITIATE: 201, // Initiating a trial

  ///////////////////////////////////////////////////////////////////////////////////////////////////
  // Signup [210-219]
  ///////////////////////////////////////////////////////////////////////////////////////////////////
  SIGNUP: 210, // Signing up for a notification or service
  FREESIGNUP: 211, // Signing up for a free service

  ///////////////////////////////////////////////////////////////////////////////////////////////////
  // Referrals [220-229]
  ///////////////////////////////////////////////////////////////////////////////////////////////////
  PARTNERREFERRAL: 220, // Navigating to a partner's web property

  ///////////////////////////////////////////////////////////////////////////////////////////////////
  // Intents [230-239]
  ///////////////////////////////////////////////////////////////////////////////////////////////////
  LEARNLOWFUNNEL: 230, // Engaging in learning behavior on a commerce page (for example, "Learn more click")
  LEARNHIGHFUNNEL: 231, // Engaging in learning behavior on a non-commerce page (for example, "Learn more click")
  SHOPPINGINTENT: 232, // Shopping behavior prior to landing on a commerce page

  ///////////////////////////////////////////////////////////////////////////////////////////////////
  // Video [240-259]
  ///////////////////////////////////////////////////////////////////////////////////////////////////
  VIDEOSTART: 240, // Initiating a video
  VIDEOPAUSE: 241, // Pausing a video
  VIDEOCONTINUE: 242, // Pausing or resuming a video
  VIDEOCHECKPOINT: 243, // Capturing predetermined video percentage complete
  VIDEOJUMP: 244, // Jumping to a new video location
  VIDEOCOMPLETE: 245, // Completing a video (or % proxy)
  VIDEOBUFFERING: 246, // Capturing a video buffer event
  VIDEOERROR: 247, // Capturing a video error
  VIDEOMUTE: 248, // Muting a video
  VIDEOUNMUTE: 249, // Unmuting a video
  VIDEOFULLSCREEN: 250, // Making a video full screen
  VIDEOUNFULLSCREEN: 251, // Making a video return from full screen to original size
  VIDEOREPLAY: 252, // Making a video replay
  VIDEOPLAYERLOAD: 253, // Loading the video player
  VIDEOPLAYERCLICK: 254, // Click on a button within the interactive player
  VIDEOVOLUMECONTROL: 255, // Click on video volume control
  VIDEOAUDIOTRACKCONTROL: 256, // Click on audio control within a video
  VIDEOCLOSEDCAPTIONCONTROL: 257, // Click on the closed-caption control
  VIDEOCLOSEDCAPTIONSTYLE: 258, // Click to change closed-caption style
  VIDEORESOLUTIONCONTROL: 259, // Click to change resolution

  ///////////////////////////////////////////////////////////////////////////////////////////////////
  // 	Advertisement Engagement [280-299]
  ///////////////////////////////////////////////////////////////////////////////////////////////////
  ADBUFFERING: 283, // Ad is buffering
  ADERROR: 284, // Ad error
  ADSTART: 285, // Ad start
  ADCOMPLETE: 286, // Ad complete
  ADSKIP: 287, // Ad skipped
  ADTIMEOUT: 288, // Ad timed out
  OTHER: 300 // Other
};

// Application Insights Configuration
var configObj = {
  instrumentationKey: "YOUR INSTRUMENTATION KEY",
  extensions: [clickPluginInstance],
  extensionConfig: {
    [clickPluginInstance.identifier]: {
      behaviorValidator: Microsoft.ApplicationInsights.BehaviorMapValidator(behaviorMap),
      defaultRightClickBhvr: 9
    },
  },
};
var appInsights = new Microsoft.ApplicationInsights.ApplicationInsights({
  config: configObj
});
appInsights.loadAppInsights();
```

## Enable correlation

Correlation generates and sends data that enables distributed tracing and powers the [application map](../app/app-map.md), [end-to-end transaction view](../app/app-map.md#go-to-details), and other diagnostic tools.

JavaScript correlation is turned off by default to minimize the telemetry we send by default. To enable correlation, see the [JavaScript client-side correlation documentation](./javascript.md#enable-distributed-tracing).

## Sample app

[Simple web app with the Click Analytics Autocollection Plug-in enabled](https://go.microsoft.com/fwlink/?linkid=2152871)

## Next steps

- See the [documentation on utilizing HEART workbook](usage-heart.md) for expanded product analytics.
- See the [GitHub repository](https://github.com/microsoft/ApplicationInsights-JS/tree/master/extensions/applicationinsights-clickanalytics-js) and [npm Package](https://www.npmjs.com/package/@microsoft/applicationinsights-clickanalytics-js) for the Click Analytics Autocollection Plug-in.
- Use [Events Analysis in the Usage experience](usage-segmentation.md) to analyze top clicks and slice by available dimensions.
- Find click data under the content field within the `customDimensions` attribute in the `CustomEvents` table in [Log Analytics](../logs/log-analytics-tutorial.md#write-a-query). For more information, see a [sample app](https://go.microsoft.com/fwlink/?linkid=2152871).
- Build a [workbook](../visualize/workbooks-overview.md) or [export to Power BI](../logs/log-powerbi.md) to create custom visualizations of click data.