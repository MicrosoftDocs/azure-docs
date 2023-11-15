---
title: Feature extensions for Application Insights JavaScript SDK (Click Analytics)
description: Learn how to install and use JavaScript feature extensions (Click Analytics) for the Application Insights JavaScript SDK. 
services: azure-monitor
ms.tgt_pltfrm: ibiza
ms.topic: conceptual
ms.date: 10/11/2023
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
   <!-- IMPORTANT: If you're updating this code example, please remember to also update it in: 1) articles\azure-monitor\app\javascript-sdk.md and 2) articles\azure-monitor\app\api-filtering-sampling.md -->
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
			!(function (cfg){function e(){cfg.onInit&&cfg.onInit(i)}var S,u,D,t,n,i,C=window,x=document,w=C.location,I="script",b="ingestionendpoint",E="disableExceptionTracking",A="ai.device.";"instrumentationKey"[S="toLowerCase"](),u="crossOrigin",D="POST",t="appInsightsSDK",n=cfg.name||"appInsights",(cfg.name||C[t])&&(C[t]=n),i=C[n]||function(l){var d=!1,g=!1,f={initialize:!0,queue:[],sv:"7",version:2,config:l};function m(e,t){var n={},i="Browser";function a(e){e=""+e;return 1===e.length?"0"+e:e}return n[A+"id"]=i[S](),n[A+"type"]=i,n["ai.operation.name"]=w&&w.pathname||"_unknown_",n["ai.internal.sdkVersion"]="javascript:snippet_"+(f.sv||f.version),{time:(i=new Date).getUTCFullYear()+"-"+a(1+i.getUTCMonth())+"-"+a(i.getUTCDate())+"T"+a(i.getUTCHours())+":"+a(i.getUTCMinutes())+":"+a(i.getUTCSeconds())+"."+(i.getUTCMilliseconds()/1e3).toFixed(3).slice(2,5)+"Z",iKey:e,name:"Microsoft.ApplicationInsights."+e.replace(/-/g,"")+"."+t,sampleRate:100,tags:n,data:{baseData:{ver:2}},ver:4,seq:"1",aiDataContract:undefined}}var h=-1,v=0,y=["js.monitor.azure.com","js.cdn.applicationinsights.io","js.cdn.monitor.azure.com","js0.cdn.applicationinsights.io","js0.cdn.monitor.azure.com","js2.cdn.applicationinsights.io","js2.cdn.monitor.azure.com","az416426.vo.msecnd.net"],k=l.url||cfg.src;if(k){if((n=navigator)&&(~(n=(n.userAgent||"").toLowerCase()).indexOf("msie")||~n.indexOf("trident/"))&&~k.indexOf("ai.3")&&(k=k.replace(/(\/)(ai\.3\.)([^\d]*)$/,function(e,t,n){return t+"ai.2"+n})),!1!==cfg.cr)for(var e=0;e<y.length;e++)if(0<k.indexOf(y[e])){h=e;break}var i=function(e){var a,t,n,i,o,r,s,c,p,u;f.queue=[],g||(0<=h&&v+1<y.length?(a=(h+v+1)%y.length,T(k.replace(/^(.*\/\/)([\w\.]*)(\/.*)$/,function(e,t,n,i){return t+y[a]+i})),v+=1):(d=g=!0,o=k,c=(p=function(){var e,t={},n=l.connectionString;if(n)for(var i=n.split(";"),a=0;a<i.length;a++){var o=i[a].split("=");2===o.length&&(t[o[0][S]()]=o[1])}return t[b]||(e=(n=t.endpointsuffix)?t.location:null,t[b]="https://"+(e?e+".":"")+"dc."+(n||"services.visualstudio.com")),t}()).instrumentationkey||l.instrumentationKey||"",p=(p=p[b])?p+"/v2/track":l.endpointUrl,(u=[]).push((t="SDK LOAD Failure: Failed to load Application Insights SDK script (See stack for details)",n=o,r=p,(s=(i=m(c,"Exception")).data).baseType="ExceptionData",s.baseData.exceptions=[{typeName:"SDKLoadFailed",message:t.replace(/\./g,"-"),hasFullStack:!1,stack:t+"\nSnippet failed to load ["+n+"] -- Telemetry is disabled\nHelp Link: https://go.microsoft.com/fwlink/?linkid=2128109\nHost: "+(w&&w.pathname||"_unknown_")+"\nEndpoint: "+r,parsedStack:[]}],i)),u.push((s=o,t=p,(r=(n=m(c,"Message")).data).baseType="MessageData",(i=r.baseData).message='AI (Internal): 99 message:"'+("SDK LOAD Failure: Failed to load Application Insights SDK script (See stack for details) ("+s+")").replace(/\"/g,"")+'"',i.properties={endpoint:t},n)),o=u,c=p,JSON&&((r=C.fetch)&&!cfg.useXhr?r(c,{method:D,body:JSON.stringify(o),mode:"cors"}):XMLHttpRequest&&((s=new XMLHttpRequest).open(D,c),s.setRequestHeader("Content-type","application/json"),s.send(JSON.stringify(o))))))},a=function(e,t){g||setTimeout(function(){!t&&f.core||i()},500),d=!1},T=function(e){var n=x.createElement(I),e=(n.src=e,cfg[u]);return!e&&""!==e||"undefined"==n[u]||(n[u]=e),n.onload=a,n.onerror=i,n.onreadystatechange=function(e,t){"loaded"!==n.readyState&&"complete"!==n.readyState||a(0,t)},cfg.ld&&cfg.ld<0?x.getElementsByTagName("head")[0].appendChild(n):setTimeout(function(){x.getElementsByTagName(I)[0].parentNode.appendChild(n)},cfg.ld||0),n};T(k)}try{f.cookie=x.cookie}catch(p){}function t(e){for(;e.length;)!function(t){f[t]=function(){var e=arguments;d||f.queue.push(function(){f[t].apply(f,e)})}}(e.pop())}var r,s,n="track",o="TrackPage",c="TrackEvent",n=(t([n+"Event",n+"PageView",n+"Exception",n+"Trace",n+"DependencyData",n+"Metric",n+"PageViewPerformance","start"+o,"stop"+o,"start"+c,"stop"+c,"addTelemetryInitializer","setAuthenticatedUserContext","clearAuthenticatedUserContext","flush"]),f.SeverityLevel={Verbose:0,Information:1,Warning:2,Error:3,Critical:4},(l.extensionConfig||{}).ApplicationInsightsAnalytics||{});return!0!==l[E]&&!0!==n[E]&&(t(["_"+(r="onerror")]),s=C[r],C[r]=function(e,t,n,i,a){var o=s&&s(e,t,n,i,a);return!0!==o&&f["_"+r]({message:e,url:t,lineNumber:n,columnNumber:i,error:a,evt:C.event}),o},l.autoExceptionInstrumented=!0),f}(cfg.cfg),(C[n]=i).queue&&0===i.queue.length?(i.queue.push(e),i.trackPageView({})):e();})({
					src: "https://js.monitor.azure.com/scripts/b/ai.3.gbl.min.js",
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
  1. If [`customDataPrefix`](#customdataprefix) isn't declared in the advanced configuration, the `id` provided in the `data-id` is used as the `customEvent` name.
  1. If [`customDataPrefix`](#customdataprefix) is declared, the `id` provided in the `data-*-id`, which means it must start with `data` and end with `id`, is used as the `customEvent` name. For example, if the clicked HTML element has the attribute `"data-sample-id"="button1"`, then `"button1"` is the `customEvent` name.
  1. If the `data-id` or `data-*-id` attribute doesn't exist and if [`useDefaultContentNameOrId`](#icustomdatatags) is set to `true`, the clicked element's HTML attribute `id` or content name of the element is used as the `customEvent` name. If both `id` and the content name are present, precedence is given to `id`.
  1. If `useDefaultContentNameOrId` is `false`, the `customEvent` name is `"not_specified"`. We recommend setting `useDefaultContentNameOrId` to `true` for generating meaningful data.

### `contentName`

If you have the [`contentName` callback function](#ivaluecallback) in advanced configuration defined, the `contentName` column of the `customEvent` is populated based on the following rules:

- For a clicked HTML `<a>` element, the plugin attempts to collect the value of its innerText (text) attribute. If the plugin can't find this attribute, it attempts to collect the value of its innerHtml attribute.
- For a clicked HTML `<img>` or `<area>` element, the plugin collects the value of its `alt` attribute.
- For all other clicked HTML elements, `contentName` is populated based on the following rules, which are listed in order of precedence:

   1. The value of the `value` attribute for the element
   1. The value of the `name` attribute for the element
   1. The value of the `alt` attribute for the element
   1. The value of the innerText attribute for the element
   1. The value of the `id` attribute for the element

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

The [`customDataPrefix` option in advanced configuration](#icustomdatatags) provides the user the ability to configure a data attribute prefix to help identify where heart is located within the individual's codebase. The prefix must always be lowercase and start with `data-`. For example:

- `data-heart-` 
- `data-team-name-`
- `data-example-`
  
In HTML, the `data-*` global attributes are called custom data attributes that allow proprietary information to be exchanged between the HTML and its DOM representation by scripts. Older browsers like Internet Explorer and Safari drop attributes they don't understand, unless they start with `data-`.

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

The examples show how if `parentDataTag` is defined but the plug-in can't find this tag under the DOM tree, the plug-in uses the `id` of its closest parent element.

### Example 1

In example 1, the `parentDataTag` isn't declared and `data-parentid` or `data-*-parentid` isn't defined in any element. This example shows a configuration where a value for `parentId` isn't collected.

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

For clicked element `<Button>` the value of `parentId` is `“not_specified”`, because no `parentDataTag` details are defined and no parent element id is provided within the current element.

### Example 2

In example 2, `parentDataTag` is declared and `data-parentid` is defined. This example shows how parent id details are collected.

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

For clicked element `<Button>`, the value of `parentId` is `parentid2`. Even though `parentDataTag` is declared, the `data-parentid` is directly defined within the element. Therefore, this value takes precedence over all other parent ids or id details defined in its parent elements.
       
### Example 3

In example 3, `parentDataTag` is declared and the `data-parentid` or `data-*-parentid` attribute isn’t defined. This example shows how declaring `parentDataTag` can be helpful to collect a value for `parentId` for cases when dynamic elements don't have an `id` or `data-*-id`.

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
For clicked element `<Button>`, the value of `parentId` is `test6parent`, because `parentDataTag` is declared. This declaration allows the plugin to traverse the current element tree and therefore the id of its closest parent will be used when parent id details are not directly provided within the current element. With the `data-group="buttongroup1"` defined, the plug-in finds the `parentId` more efficiently.

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
