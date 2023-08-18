---
title: Feature extensions for Application Insights JavaScript SDK (Click Analytics)
description: Learn how to install and use JavaScript feature extensions (Click Analytics) for the Application Insights JavaScript SDK. 
services: azure-monitor
ms.tgt_pltfrm: ibiza
ms.topic: conceptual
ms.date: 07/10/2023
ms.devlang: javascript
ms.custom: devx-track-js
ms.reviewer: mmcc
---

# Enable Click Analytics Auto-Collection plug-in

Application Insights JavaScript SDK feature extensions are extra features that can be added to the Application Insights JavaScript SDK to enhance its functionality.

In this article, we cover the Click Analytics plug-in, which automatically tracks click events on webpages and uses `data-*` attributes or customized tags on HTML elements to populate event telemetry.

## Prerequisites

[Install the JavaScript SDK](./javascript-sdk.md) before you enable the Click Analytics plug-in.

## What data does the plug-in collect?

The following key properties are captured by default when the plug-in is enabled.

### Custom event properties

| Name                  | Description                            | Sample          |
| --------------------- | ---------------------------------------|-----------------|
| Name                  | The name of the custom event. For more information on how a name gets populated, see [Name column](#name).| About              |
| itemType              | Type of event.                                      | customEvent      |
|sdkVersion             | Version of Application Insights SDK along with click plug-in.|JavaScript:2_ClickPlugin2|

### Custom dimensions

| Name                  | Description                            | Sample          |
| --------------------- | ---------------------------------------|-----------------|
| actionType            | Action type that caused the click event. It can be a left or right click. | CL              |
| baseTypeSource        | Base Type source of the custom event.                                      | ClickEvent      |
| clickCoordinates      | Coordinates where the click event is triggered.                            | 659X47          |
| content               | Placeholder to store extra `data-*` attributes and values.            | [{sample1:value1, sample2:value2}] |
| pageName              | Title of the page where the click event is triggered.                      | Sample Title    |
| parentId              | ID or name of the parent element. For more information on how a parentId is populated, see [parentId key](#parentid-key).        | navbarContainer |

### Custom measurements

| Name                  | Description                            | Sample          |
| --------------------- | ---------------------------------------|-----------------|
| timeToAction          | Time taken in milliseconds for the user to click the element since the initial page load. | 87407              |


## Add the Click Analytics plug-in

Users can set up the Click Analytics Auto-Collection plug-in via JavaScript (Web) SDK Loader Script or npm and then optionally add a framework extension.

[!INCLUDE [azure-monitor-log-analytics-rebrand](../../../includes/azure-monitor-instrumentation-key-deprecation.md)]

### Add the code

#### [JavaScript (Web) SDK Loader Script](#tab/javascriptwebsdkloaderscript)

1. Paste the JavaScript (Web) SDK Loader Script at the top of each page for which you want to enable Application Insights.

	```html
	<script type="text/javascript" src="https://js.monitor.azure.com/scripts/b/ext/ai.clck.2.min.js"></script>
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
					connectionString: "YOUR_CONNECTION_STRING",
					// Alternatively, you can pass in the instrumentation key,
					// but support for instrumentation key ingestion will end on March 31, 2025.
					// instrumentationKey: "YOUR INSTRUMENTATION KEY",
					extensions: [
							clickPluginInstance
					],
					extensionConfig: {
							[clickPluginInstance.identifier] : clickPluginConfig
					},
			};
			// Application Insights JavaScript (Web) SDK Loader Script code
			!function(v,y,T){<!-- Removed the JavaScript (Web) SDK Loader Script code for brevity -->}(window,document,{
					src: "https://js.monitor.azure.com/scripts/b/ai.2.min.js",
					crossOrigin: "anonymous",
					cfg: configObj // configObj is defined above.
			});
	</script>
	```

1. To add or update JavaScript (Web) SDK Loader Script configuration, see [JavaScript (Web) SDK Loader Script configuration](./javascript-sdk.md?tabs=javascriptwebsdkloaderscript#javascript-web-sdk-loader-script-configuration).

#### [npm package](#tab/npmpackage)

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
  connectionString: "YOUR_CONNECTION_STRING", 
  // Alternatively, you can pass in the instrumentation key,
  // but support for instrumentation key ingestion will end on March 31, 2025.  
  // instrumentationKey: "YOUR INSTRUMENTATION KEY",
  extensions: [clickPluginInstance],
  extensionConfig: {
    [clickPluginInstance.identifier]: clickPluginConfig
  },
};

const appInsights = new ApplicationInsights({ config: configObj });
appInsights.loadAppInsights();
```

---

> [!TIP]
> If you want to add a framework extension or you've already added one, see the [React, React Native, and Angular code samples for how to add the Click Analytics plug-in](./javascript-framework-extensions.md#add-the-extension-to-your-code).

### (Optional) Set the authenticated user context

If you want to set this optional setting, see [Set the authenticated user context](https://github.com/microsoft/ApplicationInsights-JS/blob/master/API-reference.md#setauthenticatedusercontext). 

If you're using a HEART workbook with the Click Analytics plug-in, you don't need to set the authenticated user context to see telemetry data. For more information, see the [HEART workbook documentation](./usage-heart.md#confirm-that-data-is-flowing).

## Use the plug-in

The following sections describe how to use the plug-in.

### Telemetry data storage

Telemetry data generated from the click events are stored as `customEvents` in the Azure portal > Application Insights > Logs section.

### `name`

The `name` column of the `customEvent` is populated based on the following rules:
  1. The `id` provided in the `data-*-id`, which means it must start with `data` and end with `id`, is used as the `customEvent` name. For example, if the clicked HTML element has the attribute `"data-sample-id"="button1"`, then `"button1"` is the `customEvent` name.
  1. If no such attribute exists and if the `useDefaultContentNameOrId` is set to `true` in the configuration, the clicked element's HTML attribute `id` or content name of the element is used as the `customEvent` name. If both `id` and the content name are present, precedence is given to `id`.
  1. If `useDefaultContentNameOrId` is `false`, the `customEvent` name is `"not_specified"`. We recommend setting `useDefaultContentNameOrId` to `true` for generating meaningful data.

### `parentId` key

To populate the `parentId` key within `customDimensions` of the `customEvent` table in the logs, declare the tag `parentDataTag` or define the `data-parentid` attribute.
     
The value for `parentId` is fetched based on the following rules:

- When you declare the `parentDataTag`, the plug-in fetches the value of `id` or `data-*-id` defined within the element that is closest to the clicked element as `parentId`. 
- If both `data-*-id` and `id` are defined, precedence is given to `data-*-id`. 
- If `parentDataTag` is defined but the plug-in can't find this tag under the DOM tree, the plug-in uses the `id` or `data-*-id` defined within the element that is closest to the clicked element as `parentId`. However, we recommend defining the `data-{parentDataTag}` or `customDataPrefix-{parentDataTag}` attribute to reduce the number of loops needed to find `parentId`. Declaring `parentDataTag` is useful when you need to use the plug-in with customized options.
- If no `parentDataTag` is defined and no `parentId` information is included in current element, no `parentId` value is collected. 
- If `parentDataTag` is defined, `useDefaultContentNameOrId` is set to `false`, and only an `id` attribute is defined within the element closest to the clicked element, the `parentId` populates as `"not_specified"`. To fetch the value of `id`, set `useDefaultContentNameOrId` to `true`.

When you define the `data-parentid` or `data-*-parentid` attribute, the plug-in fetches the instance of this attribute that is closest to the clicked element, including within the clicked element if applicable. 

If you declare `parentDataTag` and define the `data-parentid` or `data-*-parentid` attribute, precedence is given to `data-parentid` or `data-*-parentid`.

If the "Click Event rows with no parentId value" telemetry warning appears, see [Fix the "Click Event rows with no parentId value" warning](/troubleshoot/azure/azure-monitor/app-insights/javascript-sdk-troubleshooting#fix-the-click-event-rows-with-no-parentid-value-warning).

For examples showing which value is fetched as the `parentId` for different configurations, see [Examples of `parentid` key](#examples-of-parentid-key).

> [!CAUTION]
> - Once `parentDataTag` is included in *any* HTML element across your application *the SDK begins looking for parents tags across your entire application* and not just the HTML element where you used it.
> - If you're using the HEART workbook with the Click Analytics plug-in, for HEART events to be logged or detected, the tag `parentDataTag` must be declared in all other parts of an end user's application.

### `customDataPrefix`

The `customDataPrefix` provides the user the ability to configure a data attribute prefix to help identify where heart is located within the individual's codebase. The prefix should always be lowercase and start with `data-`. For example:

- `data-heart-` 
- `data-team-name-`
- `data-example-`
  
n HTML, the `data-*` global attributes are called custom data attributes that allow proprietary information to be exchanged between the HTML and its DOM representation by scripts. Older browsers like Internet Explorer and Safari drop attributes they don't understand, unless they start with `data-`.

You can replace the asterisk (`*`) in `data-*` with any name following the [production rule of XML names](https://www.w3.org/TR/REC-xml/#NT-Name) with the following restrictions.
- The name must not start with "xml," whatever case is used for the letters.
- The name must not contain a semicolon (U+003A).
- The name must not contain capital letters.

## Add advanced configuration

| Name                  | Type                               | Default | Description                                                                                                                              |
| --------------------- | -----------------------------------| --------| ---------------------------------------------------------------------------------------------------------------------------------------- |
| autoCapture           | Boolean                            | True    | Automatic capture configuration.                                |
| callback              | [IValueCallback](#ivaluecallback)  | Null    | Callbacks configuration.                               |
| pageTags              | Object                             | Null    | Page tags.                                             |
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
| useDefaultContentNameOrId | Boolean | False     | N/A         | If `true`, collects standard HTML attribute `id` for `contentName` when a particular element isn't tagged with default data prefix or `customDataPrefix`. Otherwise, the standard HTML attribute `id` for `contentName` isn't collected. |
| customDataPrefix          | String  | `data-`   | `data-*`| Automatic capture content name and value of elements that are tagged with provided prefix. For example, `data-*-id`, `data-<yourcustomattribute>` can be used in the HTML tags.   |
| aiBlobAttributeTag        | String  | `ai-blob` |  `data-ai-blob`| Plug-in supports a JSON blob attribute instead of individual `data-*` attributes. |
| metaDataPrefix            | String  | Null      | N/A  | Automatic capture HTML Head's meta element name and content with provided prefix when captured. For example, `custom-` can be used in the HTML meta tag. |
| captureAllMetaDataContent | Boolean | False     | N/A   | Automatic capture all HTML Head's meta element names and content. Default is false. If enabled, it overrides provided `metaDataPrefix`. |
| parentDataTag             | String  | Null      |  N/A  | Fetches the `parentId` in the logs when `data-parentid` or `data-*-parentid` isn't encountered. For efficiency, stops traversing up the DOM to capture content name and value of elements when `data-{parentDataTag}` or `customDataPrefix-{parentDataTag}` attribute is encountered. For more information, see [parentId key](#parentid-key). |
| dntDataTag                | String  | `ai-dnt`  |  `data-ai-dnt`| The plug-in for capturing telemetry data ignores HTML elements with this attribute.|

### behaviorValidator

The `behaviorValidator` functions automatically check that tagged behaviors in code conform to a predefined list. The functions ensure that tagged behaviors are consistent with your enterprise's established taxonomy. It isn't required or expected that most Azure Monitor customers use these functions, but they're available for advanced scenarios. The behaviorValidator functions can help with more accessible practices.

Behaviors show up in the customDimensions field within the CustomEvents table.

#### Callback functions 

Three different `behaviorValidator` callback functions are exposed as part of this extension. You can also use your own callback functions if the exposed functions don't solve your requirement. The intent is to bring your own behavior's data structure. The plug-in uses this validator function while extracting the behaviors from the data tags.

| Name                   | Description                                                                        |
| ---------------------- | -----------------------------------------------------------------------------------|
| BehaviorValueValidator | Use this callback function if your behavior's data structure is an array of strings.|
| BehaviorMapValidator   | Use this callback function if your behavior's data structure is a dictionary.       |
| BehaviorEnumValidator  | Use this callback function if your behavior's data structure is an Enum.            |

#### Passing in string vs. numerical values

To reduce the bytes you pass, pass in the number value instead of the full text string. If cost isn’t an issue, you can pass in the full text string (e.g. NAVIGATIONBACK).

#### Sample usage with behaviorValidator

Here's a sample of what a behavior map validator might look like. Yours could look different, depending on your organization's taxonomy and the events you collect.

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
  connectionString: "YOUR_CONNECTION_STRING", 
  // Alternatively, you can pass in the instrumentation key,
  // but support for instrumentation key ingestion will end on March 31, 2025. 
  // instrumentationKey: "YOUR INSTRUMENTATION KEY",
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

## Sample app

See a [simple web app with the Click Analytics Autocollection Plug-in enabled](https://go.microsoft.com/fwlink/?linkid=2152871) for how to implement custom event properties such as `Name` and `parentid` and custom behavior and content. See the [sample app readme](https://github.com/Azure-Samples/Application-Insights-Click-Plugin-Demo/blob/main/README.md) for information about where to find click data.

## Examples of `parentId` key

The following examples show which value is fetched as the `parentId` for different configurations.

### Example 1

In example 1, the `parentDataTag` isn't declared and `data-parentid` or `data-*-parentid` isn't defined in any element.

```javascript
export const clickPluginConfigWithUseDefaultContentNameOrId = {
    dataTags : {
        customDataPrefix: "",
        parentDataTag: "",
        dntDataTag: "ai-dnt",
        captureAllMetaDataContent:false,
        useDefaultContentNameOrId: true,
        autoCapture: true
    },
}; 

<div className="test1" data-id="test1parent">
     <div>Test1</div>
      <div><small>with id, data-id, parent data-id defined</small></div>
      <Button id="id1" data-id="test1id" variant="info" onClick={trackEvent}>Test1</Button>
     </div>
```

For clicked element `<Button>`, the value of `parentId` is `“not_specified”`, because `parentDataTag` is not declared and the `data-parentid` or `data-*-parentid` is not defined in any element.

### Example 2

In example 2, `parentDataTag` is declared and `data-parentid` is defined.

```javascript
export const clickPluginConfigWithParentDataTag = {
    dataTags : {
        customDataPrefix: "",
        parentDataTag: "group",
        ntDataTag: "ai-dnt",
        captureAllMetaDataContent:false,
        useDefaultContentNameOrId: false,
        autoCapture: true
    },
};

  <div className="test2" data-group="buttongroup1" data-id="test2parent">
       <div>Test2</div>
       <div><small>with data-id, parentid, parent data-id defined</small></div>
       <Button data-id="test2id" data-parentid = "parentid2" variant="info" onClick={trackEvent}>Test2</Button>
   </div>
```

For clicked element `<Button>`, the value of `parentId` is `parentid2`. Even though `parentDataTag` is declared, the `data-parentid` definition takes precedence. If the `data-parentid` attribute was defined within the div element with `className=”test2”`, the value for `parentId` would still be `parentid2`.
       
### Example 3

In example 3, `parentDataTag` is declared and the `data-parentid` or `data-*-parentid` attribute isn’t defined.

```javascript
export const clickPluginConfigWithParentDataTag = {
    dataTags : {
        customDataPrefix: "",
        parentDataTag: "group",
        dntDataTag: "ai-dnt",
        captureAllMetaDataContent:false,
        useDefaultContentNameOrId: false,
        autoCapture: true
    },
};

<div className="test6" data-group="buttongroup1" data-id="test6grandparent">
  <div>Test6</div>
  <div><small>with data-id, grandparent data-group defined, parent data-id defined</small></div>
  <div data-id="test6parent">
    <Button data-id="test6id" variant="info" onClick={trackEvent}>Test6</Button>
  </div>
</div>
```
For clicked element `<Button>`, because `parentDataTag` is declared and the `data-parentid` or `data-*-parentid` attribute isn’t defined, the value of `parentId` is `test6parent`. It's `test6parent` because when `parentDataTag` is declared, the plug-in fetches the value of the `id` or `data-*-id` attribute from the parent HTML element that is closest to the clicked element. Because `data-group="buttongroup1"` is defined, the plug-in finds the `parentId` more efficiently.

If you remove the `data-group="buttongroup1"` attribute, the value of `parentId` is still `test6parent`, because `parentDataTag` is still declared.

## Troubleshooting

See the dedicated [troubleshooting article](/troubleshoot/azure/azure-monitor/app-insights/javascript-sdk-troubleshooting).

## Next steps

- [Confirm data is flowing](./javascript-sdk.md#confirm-data-is-flowing).
- See the [documentation on utilizing HEART workbook](usage-heart.md) for expanded product analytics.
- See the [GitHub repository](https://github.com/microsoft/ApplicationInsights-JS/tree/master/extensions/applicationinsights-clickanalytics-js) and [npm Package](https://www.npmjs.com/package/@microsoft/applicationinsights-clickanalytics-js) for the Click Analytics Autocollection Plug-in.
- Use [Events Analysis in the Usage experience](usage-segmentation.md) to analyze top clicks and slice by available dimensions.
- See [Log Analytics](../logs/log-analytics-tutorial.md#write-a-query) if you aren’t familiar with the process of writing a query. 
- Build a [workbook](../visualize/workbooks-overview.md) or [export to Power BI](../logs/log-powerbi.md) to create custom visualizations of click data.
